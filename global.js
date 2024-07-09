/*
 * This is global variables file containing
 * enums and other global variables which will
 * be shared across the server.
 */
(() => {
  // Const assignment.
  const _home = require('path').resolve(`./`)

  // Load all env variables.
  require('dotenv').config({ 'path': `${_home}/.env` })

  // Const assignment.
  const _globalsToExport = {
    'CONFIG_RC': {
      ...require('rc-parser/sync')({ 'path': _home, 'name': '.config' }).value,
      'env': process.env.NODE_ENV ?? 'PRODUCTION'
    },
    'WORKING_ENV': new Enum({
      'DEVELOPMENT': 'DEVELOPMENT',
      'PRODUCTION': 'PRODUCTION',
      'STAGING': 'STAGING'
    }),
    'ACCOUNT_TYPE': new Enum({
      'ACCOUNT_DEFAULT': 'ACCOUNT_DEFAULT',
      'ACCOUNT_ADMIN': 'ACCOUNT_ADMIN'
    })
  }



  // Loop over globals which needs to be export.
  for (const j in _globalsToExport) {
    /*
     * If given j exist in global than skip
     * assigning it.
     */
    if (global && global[j]) continue

    // Assign key value to global.
    global[j] = _globalsToExport[j]
  }
})()

