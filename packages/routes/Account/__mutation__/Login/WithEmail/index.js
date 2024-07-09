/*
 * IMPORTS
 */
import _ from 'underscore' // Npm: utility module.
import Argon2 from 'argon2' // Npm: argon2 encryption library.
import Debug from 'debug/src/node' // Npm: debugging library.

/*
 * EXPORTS
 */
export default async (__, { email, password }, Context) => {
  // Initialize debugger.
  const debug = Debug('Account --> Login --> Logging in account')

  // Error handling.
  try {
    /*
     * Only proceed if context is
     * defined else report failure.
     */
    if (Context && Context.isContext) {
      // Log the start of the login process.
      debug(`Email: ${email} - Starting login process.`)

      // Get the account by email.
      const _getAccountByEmail = await Context.DataBase.account.findUnique({ where: { email } })

      /*
       * If account with given email exists
       * then return error raising this issue.
       */
      if (_getAccountByEmail instanceof Error) {
        debug(`Email: ${email} - Error occurred while checking for existing account.`)

        return _getAccountByEmail
      } else if (_.isEmpty(_getAccountByEmail)) {
        debug(`Email: ${email} - Account with this email not found.`)

        return new Error('ACCOUNT_WITH_EMAIL_NOT_FOUND')
      }

      // Verify the account password.
      const _isAccountPasswordCorrect = await Argon2.verify(_getAccountByEmail.password, password)

      /*
       * On successful verification return
       * with account signup.
       */
      if (_isAccountPasswordCorrect) {
        // Generate session token for given login.
        const _Session = await Context.Session.jwt.Sign(_getAccountByEmail)

        /*
         * On successful _Session reply to
         * client.
         */
        if (!_.isEmpty(_Session) && !(_Session instanceof Error)) {
          // Log the successful login and token generation.
          debug(`Email: ${email} - Login successful, token generated: ${_Session}`)

          /*
           * Register jwt token and
           * return.
           */
          return {
            message: `${email} logged in successfully.`,
            token: _Session,
            status: 'LOGIN_SUCCESSFUL',
            ..._getAccountByEmail
          }
        }

        // Report failure in token generation.
        debug(`Email: ${email} - Failed to generate JWT.`)

        return _Session instanceof Error ? _Session : new Error('REQUIRE_JWT')
      }

      // Report failure for invalid credentials.
      debug(`Email: ${email} - Invalid credentials provided.`)

      return new Error('INVALID_CREDENTIALS')
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
