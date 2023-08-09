import { AuthenticationError, UserInputError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import validator from 'validator';
import crypto from 'crypto';
import base64url from 'base64url';
import { User } from '../models/userModel'
import { Token } from '../models/tokenModel';
import { sendVerifyMail } from '../helpers/email';
import { TokenType } from '../models/tokenModel';

interface Context {
  req: Request
  res: Response
}

export const authResolvers = {
  Query: {
    signout(_: any, __: any, { req, res }: Context): Promise<string> {
      if (!req.session.user) throw new AuthenticationError("User was not logged in");
      return new Promise<string>((resolve: (value: string) => void, reject: (reason: string) => void) => {
        req.session.destroy((err) => {
          if (err) {
            reject(err);
            return;
          }
          res.cookie('user', '', { path: '/', maxAge: 1000 * 60 * 60 * 24, secure: process.env.NODE_ENV === "production", domain: process.env.NODE_ENV === "production" ? "instachatapp.me": undefined });
          resolve("You have been signed out");
        });
      })
    },
    isSignedIn(_: any, __: any, { req }: Context): string  {
      if (!req.session.user) throw new AuthenticationError("User was not logged in");
      return "User was logged in";
    },
  },
  Mutation: {
    async signin(_: any, { email, password }: { email: string, password: string }, { req, res }: Context): Promise<User> {
      if (!validator.isEmail(email)) throw new UserInputError("Email must be valid");
      if (!validator.isAlphanumeric(password)) throw new UserInputError("Password must be alphanumeric");

      const user: User | null = await User.findOne({ email });
      if (!user) throw new UserInputError("User not found")
      if (!user.isVerified) throw new AuthenticationError("Email is not verified for the user. Please verify first")

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new AuthenticationError("Wrong credentials");

      req.session.user = user.username;
      res.cookie('user', user.username, { path: '/', maxAge: 1000 * 60 * 60 * 24, secure: process.env.NODE_ENV === "production", domain: process.env.NODE_ENV === "production" ? "instachatapp.me": undefined });
      return user;
    },
    async signup(_: any, { username, email, password }: { username: string, email: string, password: string }): Promise<User> {
      if (!validator.isAlphanumeric(username)) throw new UserInputError("Username must be alphanumeric");
      if (!validator.isEmail(email)) throw new UserInputError("Email must be valid");
      if (!validator.isAlphanumeric(password)) throw new UserInputError("Password must be alphanumeric");
      if (!validator.isLength(password, { min: 8 })) throw new UserInputError("Password must be 8 characters long");

      let user: User | null = await User.findOne({ email });
      if (user) throw new UserInputError("User with email already exists");
      user = await User.findOne({ username });
      if (user) throw new UserInputError("Username already taken");
  
      const hash = await bcrypt.hash(password, 10);
      user = await User.create({
        username,
        password: hash,
        email
      });

      const tokenEntry = await Token.create({
        user: user._id,
        token: base64url(crypto.randomBytes(64)),
        type: TokenType.verify
      });

      try {
        await sendVerifyMail(user.email, tokenEntry.token);
      } catch (err) {
        throw new UserInputError("Cannot send verification email");
      }

      return user;
    }
  }
}