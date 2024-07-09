/*
 * IMPORTS
 */
import _ from 'underscore' // Npm: utility module.
import Debug from 'debug/src/node' // Npm: debugging library.

/*
 * EXPORTS
 */
export default async (__, ___, Context) => {
  // Initialize debugger.
  const debug = Debug('Task --> Get --> Specific organisation based task')

  // Error handling.
  try {
    /*
     * Only proceed if context is passed,
     * else report failure.
     */
    if (Context && Context.isContext) {
      // Log the start of the process.
      debug(`Account ID: ${Context.Session.user.id} - Starting task retrieval process.`)

      // Fetch organisations associated with the user.
      const _OrganisationFindMany = await Context.DataBase.organisation.findMany({
        where: {
          Account: { id: Context.Session.user.id }
        }
      })

      // Check if any organisations are found.
      if (_.isEmpty(_OrganisationFindMany)) {
        debug('No organisations found for the account.')

        return new Error('NO_ORGANISATION')
      }

      // Extract organisation IDs.
      const organisationIds = _OrganisationFindMany.map((org) => org.id)

      // Fetch tasks associated with the organisations.
      const _TaskFindMany = await Context.DataBase.key.findMany({
        where: {
          Organisation: { id: { in: organisationIds } }
        }
      })

      // Log successful retrieval of tasks.
      debug('Successfully fetched tasks.')

      // Return successful response with tasks.
      return {
        message: 'Successfully fetched tasks',
        status: 'FETCH_SUCCESSFUL',
        tasks: _TaskFindMany
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
