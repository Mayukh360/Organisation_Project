/*
 * SIBLINGS
 */
import Context from './context' // Custom: context error handler.


/*
 * EXPORTS
 */
export const errorHandlers = [
  /*
   * List of error handler's for handling
   * error's raised during execution.
   */
  Context,
  ({ error }) => ({
    'message': error.message.toString(),
    'status': 'EXCEPTION_CAUGHT'
  })
]
