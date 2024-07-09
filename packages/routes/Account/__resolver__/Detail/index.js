/*
 * IMPORTS
 */
import _ from 'underscore' // NPM: Utility module.
import Debug from 'debug/src/node' // NPM: Debugging library.

/*
 * EXPORTS
 */
export default async (__, { accountId }, Context) => {
  // Initialize debugger.
  const debug = Debug('Account --> Detail --> Getting Account Details')

  // Error handling.
  try {
    /*
     * Only proceed if context is
     * defined else report failure.
     */
    if (Context && Context.isContext) {
      // Assign accountId from context session if not provided.
      if (!accountId) {
        accountId = Context.Session.user.id
      }

      // Log the start of the process.
      debug(`Account ID: ${accountId} - Starting account details retrieval process.`)

      // Fetch account details with related stories and subscriptions.
      const _getAccount = await Context.DataBase.account.findUnique({
        where: {
          id: accountId
        }
      })

      // Log the successful retrieval of account details.
      debug(`Account ID: ${accountId} - Account details found.`)

      /*
       * If getting account details contains error
       * then report failure.
       */
      if (_getAccount && !(_getAccount instanceof Error)) {
        // Return account details.
        return { ..._getAccount, status: 'GET_SUCCESSFUL', message: 'Successfully got given account details.' }
      }

      // Log failure to find account.
      debug(`Account ID: ${accountId} - Failed to find account.`)

      // Report failure.
      return _getAccount instanceof Error ? _getAccount : new Error('FAILED_TO_FIND_ACCOUNT')
    }

    // Log missing context error.
    debug('Context is missing.')

    return new Error('MISSING_CONTEXT')
  } catch (error) {
    // Log the error.
    debug(`Error occurred: ${error.message}`)

    return error
  }
}
