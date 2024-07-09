/*
 * IMPORTS
 */
import _ from 'underscore' // Npm: utility module.
import Fs from 'fs-extra' // Npm: node.js fs system.
import Moment from 'moment' // Npm: moment.js library.
import { CronJob } from 'cron' // Custom: Cron job handler.


/*
 * EXPORTS
 */
export default function Cron({ DataBase }, $options = {}) {
  // Error handling.
  try {
    // Only work if called as constructor.
    if (this instanceof Cron) {
      // Update properties
      this.name = Cron.prototype.name
      this.DataBase = DataBase
      this.Jobs = new Map()

      // Configuration setup.
      this.configuration.noExternalParameter = $options.noExternalParameter ?? this.configuration.noExternalParameter
      this.configuration.timeZone = $options.timeZone ?? this.configuration.timeZone
      this.configuration.manualStart = $options.manualStart ?? this.configuration.manualStart
      this.configuration.loadAllJobs = $options.loadAllJobs ?? this.configuration.loadAllJobs


      /*
       * If given configuration is set to true than
       * load all jobs from database.
       */
      if (this.configuration.loadAllJobs) this.LoadAllJobs().catch(error => { throw error })

      /*
       * OBJECT: MAIN
       * Details: Execute this method after instance
       * initialization. and use it for debugging.
       */
      this.Main = async (root, args, context, info, { id, whatToCron, atWhatTime, paramToSave }) => {
        /*
         * Only proceed if id is provided else report
         * failure.
         */
        if (!_.isEmpty(id)) {
          // Save properties.
          this.root = root
          this.args = args
          this.context = context
          this.info = info

          /*
           * Cron based on condition provided
           * and return this as default.
           */
          if (!_.isEmpty(whatToCron)) {
            // Store given cron job.
            const _SetCron = await this.set({ id, whatToCron, atWhatTime, paramToSave })

            /*
             * If setting cron work caught exception
             * than report failure.
             */
            if (_SetCron instanceof Error) return _SetCron

            // Else report success.
            return {
              'message': 'Successfully added cron job',
              'status': 'CRON_ADDED_JOB_SUCCESSFULLY'
            }
          }

          // Return cron job for given id.
          return this.get(id)
        }

        // Report failure.
        return new Error('EXPECTED_ID')
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
 * PROTOTYPE.
 */
Cron.prototype = {
  // Properties
  'name': 'Cron',
  'configuration': {
    'noExternalParameter': true,
    'timeZone': 'Asia/Kolkata',
    'manualStart': false,
    'loadAllJobs': true
  },

  // Setter for setting values to cache.
  async set({ id, whatToCron, atWhatTime, paramToSave }) {
    // Error handling.
    try {
      // If whatToCache and key is not empty.
      if (!_.isEmpty(id) && _.isString(id)) {
        // Local variable.
        const _CronJob = require(whatToCron).default

        /*
         * Only proceed if cron time is provided
         * else report failure.
         */
        if (_.isEmpty(atWhatTime)) return new Error('EXPECTED_CRON_TIME(SET)')
        if (Moment(atWhatTime) < Moment()) return new Error('CRON_WILL_NO_GOING_TO_EXECUTE(SET)')

        /*
         * Only proceed if given whatToCron is function
         * else report failure.
         */
        if (_.isFunction(_CronJob)) {
          /*
           * Only create job if no previous entry
           * has been made with given id.
           */
          const _getCron = await this.DataBase.cron.findUnique({ 'where': { id } })

          /*
           * If getting cron job caught exception than report failure
           * if job is found than too.
           */
          if (!_.isEmpty(_getCron) || _getCron instanceof Error) return _getCron instanceof Error ? _getCron : new Error('DUPLICATE_CRON_JOB_ENTRY(SET)')

          // Pass given job to executor.
          const _Job = await this.JobExecutor([{ id, whatToCron, atWhatTime, paramToSave }])

          /*
           * If creating job caught exception than report
           * failure.
           */
          if (_Job instanceof Error) return _Job

          // Create entry for given cron job in dataBase.
          const _CreateEntry = await this.DataBase.cron.create({
            'data': {
              id,
              whatToCron,
              atWhatTime,
              'params': paramToSave
            }
          })

          /*
           * If creating cron entry caught exception than
           * report failure.
           */
          if (_CreateEntry instanceof Error) return _CreateEntry

          // Return given job as is.
          return _Job
        }
      }

      // Report failure.
      return new Error('REQUIRE_ID(SET)')
    } catch (error) {
      // Report failure.
      return error
    }
  },

  // Getter for getting cron jobs by id.
  get(id) { return this.Jobs.get(id) },

  /*
   * Job Executor which executes all jobs passed
   * to it inform of object.
   */
  'JobExecutor': async function JobExecutor(__job) {
    /*
     * Only proceed if job is not empty
     * if so than report failure.
     */
    if (!_.isEmpty(__job) && _.isArray(__job)) {
      // Const assignment.
      const _return = []

      // Loop over each job and execute them as Loop progresses.
      for await (const job of __job) {
        // Only proceed if given job have cron file path
        if (!_.isEmpty(job.whatToCron) && job.atWhatTime) {
          // Only proceed if given job path exists else skip.
          if (await Fs.exists(job.whatToCron)) {
            // Const assignment.
            const _cronTime = Moment(job.atWhatTime)
            const _getJob = await import(job.whatToCron)

            // Only proceed if given job is function.
            if (_getJob.default && _.isFunction(_getJob.default)) {
              /*
               * Create cron job for give id
               * and save it.
               */
              const _Job = new CronJob(`${_cronTime.second()} ${_cronTime.minute()} ${_cronTime.hour()} ${_cronTime.date()} ${_cronTime.month()} *`, async () => {
                // Mark current job as done.
                const _UpdateCron = await this.DataBase.cron.update({ 'where': { 'id': job.id }, 'data': { 'executed': true } })

                /*
                 * If updating cron caught exception than
                 * report failure.
                 */
                if (_UpdateCron instanceof Error) return _UpdateCron

                // Return handler.
                return _getJob.default(this.root, this.configuration.noExternalParameter ? _.omit(job.paramToSave, 'Context') : { ...this.args, ..._.omit(job.paramToSave, 'Context') }, { ...this.context, ...job?.paramToSave?.Context }, this.info)
              }, void 0, true, this.configuration.timeZone)

              /*
               * If creating job caught any exception
               * than report failure.
               */
              if (_Job instanceof Error) return _Job


              // Save given _Job and _start cron.
              this.Jobs.set(job.id, _Job)

              /*
               * Start cron job if no option
               * is provided for manual startup.
               */
              if (!this.configuration.manualStart) _Job.start()

              // Update return object.
              _return.push(_Job)
            }
          }
        }
      }

      // Return job.
      return _return
    }

    // Report failure.
    return new Error('EXPECTED_JOB(JOB_EXECUTOR)')
  },

  // Load all jobs from database.
  'LoadAllJobs': async function LoadAllJobs() {
    /*
     * Load all jobs from database which will
     * going to be executed in future.
     */
    const _LoadAllJobs = await this.DataBase.cron.findMany({
      'where': {
        'atWhatTime': {
          'gte': Moment.utc().subtract(1, 'day').startOf('day').toISOString()
        }
      }
    })

    // If loading jobs caught exception than report failure.
    if (_LoadAllJobs instanceof Error) return _LoadAllJobs

    // Load all jobs to executor.
    return _.isEmpty(_LoadAllJobs) ? void 0 : this.JobExecutor(_LoadAllJobs)
  },

  // Remove job from cron completely.
  'RemoveJob': async function RemoveJob(__id) {
    // Only proceed if id is provided else report failure.
    if (!_.isEmpty(__id) && _.isString(__id)) {
      // Only Remove given job if it exists.
      const _getCron = await this.DataBase.cron.findUnique({ 'where': { 'id': __id } })

      /*
       * If getting cron entry caught exception than
       * report failure.
       */
      if (_getCron instanceof Error) return _getCron

      // Only remove entry if it exists.
      if (!_.isEmpty(_getCron)) {
        // Remove given job from Cron entry.
        const _RemoveCron = await this.DataBase.cron.delete({ 'where': { 'id': __id } })

        /*
         * If removing cron entry caught exception
         * than report failure.
         */
        if (_RemoveCron instanceof Error) return _RemoveCron

        // Remove cron job from jobs map.
        return this.Jobs.delete(__id)
      }

      // Report failure.
      return new Error('JOB_DOESNT_EXIST(REMOVE_JOB)')
    }

    // Report failure.
    return new Error('EXPECTED_RIDE_ID(REMOVE_JOB)')
  }
}
