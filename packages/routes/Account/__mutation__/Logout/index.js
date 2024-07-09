/*
 * EXPORTS
 */
import Debug from 'debug/src/node' // Npm: debugging library.
import _ from 'underscore'

/*
 * EXPORTS
 */
export default async (__, { email }, Context) => {
  // Error handling.
  try {
    /*
     * Only proceed if context is passed
     * else report failure.
     */
    if (Context && Context.isContext) {
      // Const assignment.

      // Style guide.
      Debug('Google -> Account Logout')(`email: ${email} Id: ${Context.Session.user.id}`)

      // Kill the session.
      const _RemoveSession = await Context.Session.Kill(Context.Session.user.id)

      /*
       * Only successful session kill
       * reply client for successful logout
       */

      // Style guide.
      Debug('Google -> Account Logouts --> Device Counter Update')(`email: ${email} `)

      // Update device counter.
      const _AccountUpdate = await Context.DataBase.account.update({
        'where': { id: Context.Session.user.id },
        'data': {
          'deviceCounter': 0
        }
      })

      if (_AccountUpdate instanceof Error) {
        // Style guide.
        Debug('Google -> Account Login --> Device Counter Update Failed')(`email: ${email} `)

        // Report failure.
        return _AccountUpdate
      }

      if (_RemoveSession && !(_RemoveSession instanceof Error)) {
        // Report message.
        return {
          'message': 'Logout successful',
          'status': 'LOGOUT_SUCCESSFUL'
        }
      }

      // Report failure.
      return _RemoveSession instanceof Error ? _RemoveSession : new Error('SESSION_KILL_FAILED')
    }

    // Report failure.
    return new Error('MISSING__CONTEXT')
  } catch (error) {
    console.log(error)

    // Report failure.
    return error
  }
}
