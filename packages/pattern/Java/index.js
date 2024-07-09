/* eslint-disable */
/*
 * IMPORTS
 */
import _ from 'underscore' // Npm: utility module.


/*
 * EXPORTS
 */
export default async function(__object) {
  // reassignment.
  __object = await __object

  /*
   * If _Debug return
   * Main method than update with
   * Main as default method.
   */
  if (__object && _.isFunction(__object.Main)) return _.extend(__object.Main, _.omit(__object, 'Main'))

  // Return _object as is.
  return __object
}
