import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    username: String!
    email: String!
  }
  type Mutation {
    signup(username: String!, email: String!, password: String!): User!
    signin(email: String!, password: String!): User!
    verify(token: String!): String!
    forgot(email: String!): String!
    reset(token: String!, password: String!, confirm: String!): String!
  }
  type Query {
    signout: String!
    isSignedIn: String!
    resend(email: String!): String!
  }
`;