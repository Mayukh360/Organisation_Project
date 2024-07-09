/*
 * IMPORTS
 */
import Debug from 'debug/src/node' // Npm: debugging library.
import Express from 'express' // Npm: Express library.
import Helmet from 'helmet' // Npm: helmet library.
import { mw } from 'request-ip' // Npm: request-ip library.
import { createYoga } from 'graphql-yoga' // Npm: graphql server Maps.
import { createFetch } from '@whatwg-node/fetch' // Npm: fetch polyfill.
import { useCSRFPrevention } from '@graphql-yoga/plugin-csrf-prevention' // Npm: csrf prevention.
import { useAPQ } from '@graphql-yoga/plugin-apq' // Npm: automatic persisted queries.
import { useDisableIntrospection } from '@graphql-yoga/plugin-disable-introspection' // Npm: disable introspection.
import { blockFieldSuggestionsPlugin } from '@escape.tech/graphql-armor-block-field-suggestions' // Npm: graphql armor.
import { useGraphQLMiddleware } from '@envelop/graphql-middleware' // Npm: graphql middleware.
import { useGraphQLSSE } from '@graphql-yoga/plugin-graphql-sse' // Npm: graphql sse plugin.
import { useRateLimiter } from '@envelop/rate-limiter' // Npm: rate limiter.
import { renderGraphiQL } from '@graphql-yoga/render-graphiql' // Npm: graphql render graphiql.
import Cron from 'node-cron' // Npm: cron job.
import { useSofa } from '@graphql-yoga/plugin-sofa'
import Schema from './../../routes/index'
import { graphql } from 'graphql'
import { PrismaClient } from '@prisma/client' // Prisma: Database library.


/*
 * PACKAGES
 */
import 'iffe' // Custom: iife objects.
import Router from 'routes' // Graphql: server routes7 for handling api.
import Context from 'context' // Custom: graphql context.
import Middleware from 'middleware' // Custom: graphql middleware's.
import CronJobs from '../../cron' // Custom: cron jobs.


/*
 * HOOKS
 */
import * as Hooks from './hooks' // Custom: hooks.


/*
 * SERVER
 */
const _Express = Express()
const _Prisma = new PrismaClient()

const sofa = useSofa({
  Schema,
  basePath: '/v1/graphql',
  swaggerUI: {
    endpoint: '/swagger'
  },
  title: 'Example API',
  version: '1.0.0'
})


const _Server = createYoga({
  'renderGraphiQL': renderGraphiQL,
  'batching': 'PRODUCTION' === global.CONFIG_RC.env,
  'context': Context,
  'graphqlEndpoint': '/v1/graphql',
  'graphiql': {
    'subscriptionsProtocol': 'GRAPHQL_SSE'
  },
  'cors':
  'PRODUCTION' === global.CONFIG_RC.env ? {
    origin: '*',
    credentials: true,
    methods: [
      'POST',
      'GET',
      'PUT',
      'DELETE',
      'OPTIONS'
    ]
  } : void 0,
  'schema': Router,
  'landingPage': false,
  'fetchAPI': createFetch({
    'formDataLimits': {
      'fileSize': 20 * 1024 * 1024 * 1024,
      'files': 10,
      'fieldSize': 10000000000,
      'headerSize': 10000000000
    }
  }),
  'parserCache': 'PRODUCTION' === global.CONFIG_RC.env,
  'validationCache': 'PRODUCTION' === global.CONFIG_RC.env,
  'plugins': [
    sofa,
    'PRODUCTION' === global.CONFIG_RC.env ? useCSRFPrevention({
      'requestHeaders': ['x-graphql-csrf'] // Default
    }) : void 0,
    'PRODUCTION' === global.CONFIG_RC.env ? useAPQ() : void 0,
    'PRODUCTION' === global.CONFIG_RC.env ? useDisableIntrospection() : void 0,
    'PRODUCTION' === global.CONFIG_RC.env ? void 0 : blockFieldSuggestionsPlugin(),
    useGraphQLMiddleware(Middleware),
    useGraphQLSSE(),
    useRateLimiter({
      'identifyFn': context => context?.Session?.user?.id
    })
    // ...new EnvelopArmor().protect().plugins
  ]
})

for (const job of Object.values(CronJobs)) Cron.schedule(job.prototype.time, async () => job(await Context({ 'request': {} })))

// Render all hooks in ./hook directory automatically.
Object.entries(Hooks).map(k => _Express.use(k[1].endpoint, (__request, __response) => k[1](({ 'context': Context, 'schema': Router, 'request': __request, 'response': __response }))))

/*
 * ROUTES
 */
'PRODUCTION' === global.CONFIG_RC.env && _Express.use(Helmet())
_Express.use(mw())

/*
 * CUSTOM ROUTE
 */
_Express.use(_Server.graphqlEndpoint, _Server)


/*
 * START
 */
// _Express.listen(global.CONFIG_RC.port, () => Debug('HTTP')(`Running on ${global.CONFIG_RC.port}`))
const server = _Express.listen(global.CONFIG_RC.port, () => {
  Debug('HTTP')(`Running on ${global.CONFIG_RC.port}`)
})

// Set a custom timeout (e.g., 30 minutes)
server.setTimeout(30 * 60 * 1000) // 30 minutes in milliseconds
