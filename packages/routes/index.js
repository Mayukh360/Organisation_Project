/*
 * IMPORTS
 */
import { resolvers } from 'graphql-scalars' // Npm: graphql resolvers handler.
import { mergeTypeDefs } from '@graphql-tools/merge' // Npm: graphql typeDefs merger.
import { makeExecutableSchema } from '@graphql-tools/schema' // Npm: graphql-tools for handling graphql.
import { createSchema } from 'graphql-yoga' // Npm: graphql server Maps.
import { defaultFieldResolver } from 'graphql' // Npm: graphql default field resolver.
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils' // Npm: graphql-tools for handling graphql.


/*
 * GRAPHS
 */
import MainGraph from './index.graphql' // Custom: contains common types.
import MainDirectiveGraph from './index.directive.graphql' // Custom: handle's custom directives.
import MainScalarGraph from './index.scalar.graphql' // Custom: contains scalar values.


/*
 * SIBLINGS
 */
import Account from './Account'
import * as RootScalars from './__scalar__'

/*
 * GLOBALS
 */
const GlobalMutation = {}
const GlobalSubscription = {}
const GlobalResolver = {}


/*
 * TYPE'DEFS
 */
const typeDefs = makeExecutableSchema({
  'typeDefs': mergeTypeDefs([
    require('graphql-scalars').typeDefs,
    MainGraph,
    MainScalarGraph,
    MainDirectiveGraph,
    Account.typeDefs
  ])
})


/*
 * OBJECTS
 */
const _definition = {
  typeDefs,
  'resolvers': {
    ...RootScalars,
    ...resolvers,
    'Query': {
      ...GlobalResolver,
      ...Account.resolvers
    },
    'Mutation': {
      ...GlobalMutation,
      ...Account.Mutation
    },
    'Subscription': {
      ...GlobalSubscription,
      ...Account.Subscription
    }
  }
}


/*
 * TYPE'DEFS
 */
const Schema = createSchema({
  'typeDefs': _definition.typeDefs,
  'resolvers': _definition.resolvers,
  'directives': _definition.schemaDirectives
})


/*
 * DIRECTIVES
 */
const _directivesToRegister = {
  ...Account.Directive
}


/*
 * REGISTER
 */
for (const _directiveToRegister of Object.entries(_directivesToRegister)) {
  // Register the directive.
  Object.assign(Schema, mapSchema(Schema, {
    [MapperKind.FIELD](fieldConfig) {
      // Const assignment.
      const _getDirective = getDirective(Schema, fieldConfig, _directiveToRegister[0])?.[0]

      // Only continue if directive exists.
      if (_getDirective) {
        // Get Default resolver from config.
        const { resolve = defaultFieldResolver } = fieldConfig

        // Return the resolved field.
        fieldConfig.resolve = (source, args, context, info) => _directiveToRegister[1](resolve, _getDirective, source, args, context, info)

        // Return field.
        return fieldConfig
      }
    }
  }))
}


/*
 * EXPORTS
 */
export default Schema
