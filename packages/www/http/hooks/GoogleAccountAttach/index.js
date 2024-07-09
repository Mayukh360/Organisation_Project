/*
 * IMPORTS
 */
import { execute, parse } from 'graphql' // Npm: graphql execution.


/*
 * OBJECTS
 */
const Index = async ({ schema, request, response, context }) => {
  // Error handling.
  try {
    // Variable assignment.
    const { code } = request.query

    // Dummy update of headers.
    request.headers.headersInit = { ...request.headers.headersInit }

    // Execute the mutation on the schema
    const _result = await execute({
      schema,
      'document': parse(`
        mutation AccountGoogleLogin($googleToken: String!) {
          AccountGoogleLogin(googleToken: $googleToken) {
            status
            token
          }
        }
    `),
      'variableValues': { 'googleToken': code },
      'contextValue': await context({ request })
    })

    // Send a response indicating the success or any necessary data
    return response.status(200).json(_result.data)
  } catch (error) {
    console.log(error)

    // Report failure.
    return response.status(500).json({ error: 'Something went wrong when handling this request.' })
  }
}


/*
 * ENDPOINT
 */
Index.endpoint = '/google/authorization'


/*
 * EXPORTS
 */
export default Index
