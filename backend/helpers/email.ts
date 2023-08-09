import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

/* Sendgrid configuration adapted from https://www.npmjs.com/package/@sendgrid/mail */
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
const link = process.env.NODE_ENV === "production" ? "https://instachatapp.me/" : "http://localhost:3000/"

export const sendVerifyMail = (to: string, token: string) => {
  const msg = {
    to,
    from: {
      name: "InstaChat",
      email: "no-reply@instachatapp.me"
    },
    subject: "InstaChat Verification Token",
    html: `Welcome to Instachat, before you can use your account you will need to verify your email <br> 
           Please click <a href="${link + "verify/" + token}">here</a> to verify email <br>
           Please note that the link will expire in 1 hour`
  }
  return sgMail.send(msg)
};

export const sendResetMail = (to: string, token: string) => {
  const msg = {
    to,
    from: {
      name: "InstaChat",
      email: "no-reply@instachatapp.me"
    },
    subject: "InstaChat Password Reset",
    html: `You have requested a password reset on your account. <br>
           If this action was not authorized by you please ignore this email <br>
           Please click <a href="${link + "reset/" + token}">here</a> to reset your password`
  }
  return sgMail.send(msg)
}