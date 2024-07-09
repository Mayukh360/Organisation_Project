/*
 *IMPORTS
 */
module.exports = grunt => {
  // Project configuration.
  grunt.initConfig({
    'jsdoc': {
      'dist': {
        'src': ['/*.js'],
        'options': {
          'destination': 'docs'
        }
      }
    }
  })

  // Load js documentation plugin for documenting.
  grunt.loadNpmTasks('grunt-jsdoc')

  // Default task(s).
  grunt.registerTask('default', ['jsdoc'])
}
