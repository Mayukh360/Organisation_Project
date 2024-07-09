/*
 * IMPORTS
 */
import Redis from 'ioredis' // Npm: redis client.
import { createPubSub } from 'graphql-yoga' // Npm: graphql subscriptions.
import { createRedisEventTarget } from '@graphql-yoga/redis-event-target' // Npm: graphql subscriptions.
import _ from 'underscore' // Npm: utility module.
import { execute, parse } from 'graphql' // Npm: graphql execute.


/*
 * PACKAGES
 */
import { Java } from 'pattern' // Custom: Allow pre-existing js constructor to behave like java main().
import Router from 'routes'


/*
 * SIBLINGS
 */
import __Debug from './Debug' // Dyna: Debugger with logging.
import Cron from './Cron' // Dyna: Cron library.
import Session from './Session' // Custom: Client Session handler.
import { errorHandlers } from './errors' // Custom: Error handler's for Debugging queue.


/*
 * PRISMA
 */
import { PrismaClient } from '@prisma/client' // Prisma: Database library.


/*
 * GLOBALS
 */
const _RedisClient = new Redis({ 'connectTimeout': 10000 })
const _Debug = new __Debug({ QUEUE: errorHandlers }, { 'watch': ['packages/routes/', 'packages/./', 'packages/dyna_modules/', 'packages/middleware/'], 'showLog': 'dev' === CONFIG_RC.env })
const _Pubsub = createPubSub({ 'eventTarget': createRedisEventTarget({ 'publishClient': _RedisClient, 'subscribeClient': _RedisClient }) })
const _Prisma = new PrismaClient()
const _Cron = new Cron({ 'DataBase': _Prisma }, { 'loadAllJobs': false })


/*
 * OBJECTS
 */
const Context = async ({ request }) => {
  // Const assignment.
  const _context = {
    'isContext': true,
    'host': request && request.headers ? request.headers.host : void 0,
    'Debug': _.extend(_Debug.Main, _.omit(_Debug, 'Main')),
    'Cron': await Java(_Cron),
    'Pubsub': _Pubsub,
    'DataBase': _Prisma
  }

  // Check request session.
  const _Session = await new Session({ request })

  /*
   * Only return _Session if return is
   * not instanceof Error.
   */
  if (_Session && ('TokenExpiredError' === _Session.name || _Session instanceof Error)) _context.Debug({ 'error': _Session })
  else _context.Session = _Session

  // Return context with server
  return _context
}


/*
 * EXPORTS
 */
export default Context
export const ExecuteGraph = (__query, __variables, __context) => execute({ 'schema': Router, 'document': parse(__query), 'contextValue': __context, 'variableValues': __variables })
