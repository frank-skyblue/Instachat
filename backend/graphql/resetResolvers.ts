import { UserInputError } from 'apollo-server-express';
import base64url from 'base64url';
import { Token } from '../models/tokenModel';
import { User } from '../models/userModel';
import validator from 'validator';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { TokenType } from './../models/tokenModel';
import { sendResetMail } from './../helpers/email';

export const resetResolvers = {
  Mutation: {
    async forgot(_: any, { email }: { email: string }): Promise<string> {
      if (!validator.isEmail(email)) throw new UserInputError("Email must be valid");

      const user: User | null = await User.findOne({ email });
      if (!user) throw new UserInputError("User not found");

      const tokenEntry = await Token.create({
        user: user._id,
        token: base64url(crypto.randomBytes(64)),
        type: TokenType.reset
      });

      try {
        await sendResetMail(user.email, tokenEntry.token);
        return "Email sent";
      } catch (err) {
        throw new UserInputError("Cannot send password reset email");
      }
    },
    async reset(_: any, { token, password, confirm }: { token: string, password: string, confirm: string }) {
      if (!validator.isAlphanumeric(password)) throw new UserInputError("Password must be alphanumeric");
      if (!validator.isLength(password, { min: 8 })) throw new UserInputError("Password must be 8 characters long");
      if (password !== confirm) throw new UserInputError("Passwords are not the same");

      const tokenEntry: Token | null = await Token.findOne({ token, type: TokenType.reset }).populate('user');
      if (!tokenEntry || !tokenEntry.user) throw new UserInputError("Incorrect token or token has expired");

      const user = tokenEntry.user as User;
      const newPass = await bcrypt.hash(password, 10);
      user.password = newPass;
      user.save();
      return "Password has been updated";
    }
  }
}