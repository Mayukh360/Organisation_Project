/*
 * IMPORTS
 */
import _ from 'underscore' // Npm; utility module.
import JsonWebToken from 'jsonwebtoken' // Npm: json web token Maps.


/*
 * PACKAGES
 */
import Cache from 'dyna_modules/Cache'
import Tag from 'tag'


/*
 * EXPORTS
 */
export default async function Session({ name, request }) {
  // Error handling.
  try {
    // Only work if called as constructor.
    if (this instanceof Session) {
      /*
       *  Own properties.
       * console.log(this, 'Session')
       */
      this.name = name ? name.toCapitalize() : Session.prototype.name
      this.user = null
      this.token = null
      this.ip = request?.headers?.['x-forwarded-for'] || request?.socket?.remoteAddress
      this.isLoggedIn = false
      this.headers = request.headers.headersInit
      this.developerToken = null

      /*
       * Only proceed if headers
       * authorization is provided
       * else report failure.
       */
      if (request && request.headers && request.headers.headersInit && (!_.isEmpty(request.headers.headersInit['l-authorization']) && 'undefined' !== request.headers.headersInit['l-authorization'])) {
        /*
         * Const assignment.
         * console.log('HEADER', request.headers.headersInit['l-authorization'])
         */
        const _JwtCheck = await this.jwt.Verify(request.headers.headersInit['l-authorization'])

        /*
         * Verify given jwt if is
         * valid token or not.
         */
        if (_JwtCheck && _JwtCheck instanceof Error) return _JwtCheck

        /*
         * Update instance with
         * session detail's.
         */
        this.user = _JwtCheck
        this.token = request.headers.headersInit['l-authorization']
        this.isLoggedIn = true
      }
      // Developer account

      if (request && request.headers && request.headers.headersInit && (!_.isEmpty(request.headers.headersInit['d-authorization']) && 'undefined' !== request.headers.headersInit['d-authorization'])) {
        this.developerToken = request.headers.headersInit['d-authorization']
      }


      // Return instance.
      return this
    }

    // Report failure.
    return new Error('NOT__CONSTRUCTOR')
  } catch (error) {
    // Report failure.
    return error
  }
}

/*
 * PROTOTYPE
 */
Session.prototype = {
  // Properties.
  'name': 'Session',
  'configuration': {
    'expireIn': '24 days',
    'secret': CONFIG_RC.secret ?? '1Singleshot'
  },

  /*
   * Kill deletes given session from user
   * session container.
   */
  'Kill': async function Kill(__param) {
    // Error handling.
    try {
      /*
       * If given __param is not empty than only continue
       * else report failure.
       */
      if (!_.isEmpty(__param)) {
        // Local variable.
        let _userSession

        // Variable assignment.
        _userSession = await this.Cache({ 'id': __param })

        /*
         * Only proceed if userSession is not
         * empty else report failure.
         */
        if (_.isArray(_userSession) && _userSession.includes(this.token)) {
          // Remove token if found
          _userSession = _.without(_userSession, this.token)

          // Report failure.
        } else if (_.isString(_userSession)) {
          // Update null as removing token.
          _userSession = []
        } else {
          // Report failure.
          return new Error('REQUIRE__LOGIN')
        }

        /*
         * Remove client auth from Auth
         * and return Cache
         */
        const _CacheUpdate = await this.Cache({ 'id': __param, 'whatToCache': _userSession }, { 'save': true })

        /*
         * If updateUserAuth is not empty
         * and doesn't contain error.
         */
        if (!(_CacheUpdate instanceof Error)) {
          // Update prototype
          this.isLoggedIn = false

          // Resolve done.
          return true
        }

        // Report failure.
        return _CacheUpdate
      }

      // Report failure.
      return new Error('EXPECTED_PARAM(KILL)')
    } catch (error) {
      // Report failure.
      return error
    }
  },

  /*
   * Jwt handler for handling jwt
   * token's etc.
   */
  'jwt': {
    'Sign': async __param => {
      // Error handling.
      try {
        /*
         * Only proceed if __param is passed for signing
         * else report failure.
         */
        if (!_.isEmpty(__param)) {
          // Sign toke and update cache.
          const _SignedToken = JsonWebToken.sign(__param, Session.prototype.configuration.secret, {
            'expiresIn': Session.prototype.configuration.expireIn
          })

          /*
           * Signing token caught exception than
           * report failure.
           */
          if (_SignedToken && _SignedToken instanceof Error) return _SignedToken

          // Cache new signed token.
          const _UserSessionCache = await Session.prototype.Cache(
            {
              'id': __param.id,
              'whatToCache': _SignedToken
            },
            {
              'changeTo': Array,
              'expireIn': Session.prototype.configuration.expireIn,
              'save': true
            }
          )

          /*
           * On successful cacheUpdate return token
           * to client.
           */
          if (_.isEmpty(_UserSessionCache) || (_UserSessionCache instanceof Error)) return _UserSessionCache instanceof Error ? _UserSessionCache : new Error('EXPECTED_CACHE(SIGN)')

          // Report failure.
          return _SignedToken
        }

        // Report failure.
        return new Error('EXPECTED_PARAM(SIGN)')
      } catch (error) {
        // Report failure.
        return error
      }
    },
    'Verify': async __param => {
      // Error handling.

      try {
        /*
         * Only proceed if param is passed else
         * report failure.
         */
        if (!_.isEmpty(__param)) {
          // Const assignment.
          const _JwtVerify = await JsonWebToken.verify(__param, Session.prototype.configuration.secret)
          /*
           * If _jwtVerify contains error
           * than report failure else return
           */
          if (!_.isEmpty(_JwtVerify) && !(_JwtVerify instanceof Error)) {
            // Const assignment.
            const _UserSessionCache = await Session.prototype.Cache({ 'id': _JwtVerify.id })

            /*
             * Only proceed if user session cache is
             * not empty or is not instanceof Error.
             */
            if (_UserSessionCache && _UserSessionCache instanceof Error) return _UserSessionCache

            /*
             * Only validate to true
             * if token is present in cache.
             */
            /*
             * If (_.isArray(_UserSessionCache) && _UserSessionCache.includes(__param)) {
             *   // Return token details.
             *   return _JwtVerify
             */

            /*
             *   // If given token is string
             * } else if (_.isString(_UserSessionCache) && _UserSessionCache === __param) {
             *   // Return token details.
             *   return _JwtVerify
             * }
             */

            if (_JwtVerify) {
              return _JwtVerify
            }

            // Report failure.
            return new Error('NOT_FOUND(VERIFY)')
          }

          // Report failure.
          return _JwtVerify instanceof Error ? _JwtVerify : new Error('EXPECTED_JWT(VERIFY)')
        }

        // Report failure.
        return new Error('EXPECTED_PARAM(VERIFY)')
      } catch (error) {
        // Report failure.
        return error
      }
    }
  },


  /*
   * Cache handler for caching session
   * and other details.
   */
  'Cache': function({ id, whatToCache }, $options) {
    // Return cache for given id.
    return $options && $options.save ? new Cache({ 'id': Tag.Session.cache(id), whatToCache }, $options) : new Cache({ 'id': Tag.Session.cache(id) }, $options)
  }
}
