/*
 * IMPORTS
 */
import DebugMiddleware from './Debug' // Middleware: for debugging resolver return.
import CronMiddleware from './Cron' // Middleware: for handling cron jobs.


/*
 * EXPORTS
 */
export default [DebugMiddleware, CronMiddleware]
