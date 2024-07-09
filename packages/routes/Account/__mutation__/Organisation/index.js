/*
 * IMPORTS
 */
import _ from 'underscore' // Npm: utility module.
import Debug from 'debug/src/node' // Npm: debugging library.

/*
 * EXPORTS
 */
export default async (__, { organisationName }, Context) => {
  // Initialize debugger.
  const debug = Debug('Organisation --> Create --> Creating new organisation')

  // Error handling.
  try {
    /*
     * Only proceed if context is
     * defined else report failure.
     */
    if (Context && Context.isContext) {
      // Log the start of the organisation creation process.
      debug(`Account ID: ${Context.Session.user.id} - Starting organisation creation process.`)

      // Create a new organisation.
      const _OrganisationCreate = await Context.DataBase.organisation.create({
        data: {
          name: organisationName,
          Account: {
            connect: { id: Context.Session.user.id }
          }
        }
      })

      // Check if organisation creation failed.
      if (_OrganisationCreate instanceof Error) {
        debug(`Account ID: ${Context.Session.user.id} - Organisation creation failed.`)

        return new Error('ORGANISATION_CREATE_FAILED')
      }

      // Log successful organisation creation.
      debug(`Account ID: ${Context.Session.user.id} - Organisation created successfully.`)

      // Return successful response with organisation details.
      return {
        message: 'Successfully created organisation',
        status: 'CREATE_SUCCESSFUL',
        ..._OrganisationCreate
      }
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
