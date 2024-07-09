/*
 * IMPORTS
 */
import _ from 'underscore' // Npm: utility module.
import Debug from 'debug/src/node' // Npm: debugging library.

/*
 * EXPORTS
 */
export default async (__, { taskName, organisationId }, Context) => {
  // Initialize debugger.
  const debug = Debug('Task --> Create --> Creating new task')

  // Error handling.
  try {
    /*
     * Only proceed if context is
     * defined else report failure.
     */
    if (Context && Context.isContext) {
      // Log the start of the task creation process.
      debug(`Organisation ID: ${organisationId} - Starting task creation process.`)

      // Create a new task.
      const _TaskCreate = await Context.DataBase.task.create({
        data: {
          name: taskName,
          Organisation: {
            connect: { id: organisationId }
          }
        }
      })

      // Check if task creation failed.
      if (_TaskCreate instanceof Error) {
        debug(`Organisation ID: ${organisationId} - Task creation failed.`)

        return new Error('TASK_CREATE_FAILED')
      }

      // Log successful task creation.
      debug(`Organisation ID: ${organisationId} - Task created successfully.`)

      // Return successful response with task details.
      return {
        message: 'Successfully created task',
        status: 'CREATE_SUCCESSFUL',
        ..._TaskCreate
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
