'use strict'

require('dotenv').config()

const path = require('node:path')
const AutoLoad = require('@fastify/autoload')

// Pass --options via CLI arguments in command to enable these options.
const options = {}

const start = async () => {
  try {
    await fastify.listen({ 
      port: process.env.PORT || 3000,
      host: '0.0.0.0'
    })
    console.log(`Server is running on port ${process.env.PORT || 3000}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

module.exports = function (fastify, opts, done) {
  // Place here your custom code!

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })

  // Call done when the plugin is ready
  done()

  // Start the server if we're running directly
  if (require.main === module) {
    start()
  }
}

module.exports.options = options
