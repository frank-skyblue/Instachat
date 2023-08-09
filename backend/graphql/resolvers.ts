import { authResolvers } from './authResolvers';
import { resetResolvers } from './resetResolvers';
import { verifyResolvers } from './verifyResolvers';

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...verifyResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...verifyResolvers.Mutation,
    ...resetResolvers.Mutation
  }
}