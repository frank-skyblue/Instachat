import { gql, DocumentNode } from "@apollo/client";

export const SIGN_IN: DocumentNode = gql`
  mutation Signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      username
      email
    }
  }
`;

export const SIGN_UP: DocumentNode = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      username
      email
    }
  }
`;

export const SIGN_OUT: DocumentNode = gql`
  query {
    signout
  }
`

export const IS_SIGNED_IN: DocumentNode = gql`
  query {
    isSignedIn
  }
`

export const VERIFY: DocumentNode = gql`
  mutation Verify($token: String!) {
    verify(token: $token)
  }
`

export const RESEND: DocumentNode = gql`
  query Resend($email: String!) {
    resend(email: $email)
  }
`;

export const RESET: DocumentNode = gql`
  mutation Reset($token: String!, $password: String!, $confirm: String!) {
    reset(token: $token, password: $password, confirm: $confirm)
  }
`;

export const FORGOT: DocumentNode = gql`
  mutation Forgot($email: String!) {
    forgot(email: $email)
  }
`;