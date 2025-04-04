'use strict'

require('dotenv').config()

const path = require('node:path')
const Fastify = require('fastify')
const AutoLoad = require('@fastify/autoload')

// Create Fastify instance
const fastify = Fastify({
  logger: true
})

// Register Autoload for plugins
fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'plugins'),
  options: {}
})

// Register Autoload for routes
fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'routes'),
  options: {}
})

// Start the server if we're running directly
if (require.main === module) {
  // Run the server!
  fastify.listen({ 
    port: process.env.PORT || 3000,
    host: '0.0.0.0'
  }, (err) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  })
}

// Export fastify for testing purposes
module.exports = fastify
