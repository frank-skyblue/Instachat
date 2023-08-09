import { UserInputError } from 'apollo-server-express';
import validator from 'validator';
import crypto from 'crypto';
import base64url from 'base64url';
import { User } from '../models/userModel'
import { Token } from '../models/tokenModel';
import { sendVerifyMail } from '../helpers/email';
import { TokenType } from '../models/tokenModel';

export const verifyResolvers = {
  Query: {
    async resend(_: any, { email }: { email: string }): Promise<string> {
      if (!validator.isEmail(email)) throw new UserInputError("Email must be valid");

      const user: User | null = await User.findOne({ email });
      if (!user) throw new UserInputError("User not found");
      if (user.isVerified) throw new UserInputError("User is already verified");

      const tokenEntry = await Token.create({
        user: user._id,
        token: base64url(crypto.randomBytes(64)),
        type: TokenType.verify
      });

      try {
        await sendVerifyMail(email, tokenEntry.token);
        return "Email sent";
      } catch (err) {
        throw new UserInputError("Cannot send verification email")
      }
    }
  },
  Mutation: {
    async verify(_: any, { token }: { token: string }): Promise<string> {
      if (!validator.isBase64(token, { urlSafe: true })) throw new UserInputError("Invalid link");

      const tokenEntry: Token | null = await Token.findOne({ token, type: TokenType.verify }).populate('user');
      if (!tokenEntry || !tokenEntry.user) throw new UserInputError("Incorrect link or link has expired");

      const user = tokenEntry.user as User;
      if (!user) throw new UserInputError("Incorrect link or link has expired");
      if (user.isVerified) throw new UserInputError("User has already been verified");
      user.isVerified = true;
      user.save()
      return "Verification successful"
    }
  }
}