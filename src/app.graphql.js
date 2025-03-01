import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import {
  adminMutationsController,
  adminQueriesController,
} from "./modules/admin/admin.controller.js";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "mainQuery",
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => "hello",
      },
      ...adminQueriesController,
    },
  }),
  mutation: new GraphQLObjectType({
    name: "mainMutation",
    fields: {
      ...adminMutationsController,
    },
  }),
});
