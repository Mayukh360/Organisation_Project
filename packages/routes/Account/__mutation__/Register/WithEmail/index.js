/*
 * IMPORTS
 */
import _ from 'underscore' // Npm: utility module.
import Argon2 from 'argon2' // Npm: argon2 encryption library.
import Debug from 'debug/src/node' // Npm: debugging library.

/*
 * EXPORTS
 */
export default async (__, { email, password, fullName, roles }, Context) => {
  // Initialize debugger.
  const debug = Debug('Account --> Register --> Registering new account')

  // Error handling.
  try {
    /*
     * Only proceed if context is
     * defined else report failure.
     */
    if (Context && Context.isContext) {
      // Log the start of the registration process.
      debug(`Email: ${email} - Starting registration process.`)

      /*
       * Get given email and if given email exists
       * then report failure.
       */
      const _getAccountByEmail = await Context.DataBase.account.findUnique({ where: { email } })

      /*
       * If account with given email exists
       * then return error raising this issue.
       */
      if (_getAccountByEmail instanceof Error) {
        debug(`Email: ${email} - Error occurred while checking for existing account.`)

        return _getAccountByEmail
      } else if (!_.isEmpty(_getAccountByEmail)) {
        debug(`Email: ${email} - Account with this email already exists.`)

        return new Error('ACCOUNT_WITH_EMAIL_FOUND')
      }

      // Log the registration attempt.
      debug(`Email: ${email} - Registering given email.`)

      // Create account entry for given user details.
      const _CreateAccount = await Context.DataBase.account.create({
        data: {
          fullName,
          roles: roles || 'ACCOUNT_DEFAULT',
          email,
          password: await Argon2.hash(password)
        }
      })

      // If creating account caught exception then report failure.
      if (_.isEmpty(_CreateAccount) || _CreateAccount instanceof Error) {
        debug(`Email: ${email} - Failed to create account.`)

        return _CreateAccount instanceof Error ? _CreateAccount : new Error('FAILED_TO_CREATE_ACCOUNT')
      }

      // Log successful registration.
      debug(`Email: ${email} - Registration successful.`)

      // Generate session token for given registration.
      const _Session = await Context.Session.jwt.Sign(_CreateAccount)

      /*
       * On successful _Session reply to
       * client.
       */
      if (!_.isEmpty(_Session) && !(_Session instanceof Error)) {
        // Log the registration token.
        debug(`Email: ${email} - Registration token: ${_Session}`)

        /*
         * Register jwt token and
         * return.
         */
        return {
          message: `${email} registration successful.`,
          token: _Session,
          status: 'REGISTER_SUCCESSFUL',
          ..._CreateAccount
        }
      }

      // Report failure.
      debug(`Email: ${email} - Failed to generate JWT.`)

      return _Session instanceof Error ? _Session : new Error('REQUIRE_JWT')
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
