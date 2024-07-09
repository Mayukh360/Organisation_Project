/*
 * EXPORTS
 */
export default async (resolve, root, args, context, info) => {
  // Error handling.
  try {
    /*
     * If context is error than report
     * failure.
     */
    if (context && context.isContext && !(context instanceof Error)) {
      // Return regular execution.
      const _resolve = await resolve(root, args, context, info)

      /*
       * Only proceed if given
       * resolve contains cron object.
       */
      if (_resolve && !(_resolve.isCronJob)) return _resolve

      // Return cronjob.
      return _resolve && _resolve.isCronJob ? context.Cron(root, args, context, info, _resolve) : _resolve
    }

    // Report failure
    return context.Debug({
      'error': context instanceof Error ? context : new Error('MISSING__CONTEXT'),
      root,
      args,
      context,
      info
    })
  } catch (error) {
    // Report failure.
    return error
  }
}
