/*
 * OBJECTS
 */
const isAuthenticated = (__resolve, __directiveArgs, __, ___, Context, ____) => {
  /*
   * Only proceed if user is logged in
   * else report failure.
   */
  if (Context && Context.Session && Context.Session.isLoggedIn) {
    /*
     * Validate for accountType if its value
     * is passed.
     */
    if (__directiveArgs && __directiveArgs.accountType && __directiveArgs.accountType !== Context.Session.user.accountType) return new Error('ACCOUNT__AUTHORIZATION__FAILED')


    // Execute resolver.
    return __resolve(__, ___, Context, ____)
  }

  // Else report failure.
  return new Error('REQUIRE__LOGIN')
}


/*
 * EXPORTS
 */
export default isAuthenticated
