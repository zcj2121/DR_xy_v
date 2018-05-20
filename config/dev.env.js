'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://vbs.fhave.com:8088/archetype-ui-dr"',
  BASE_API: '"http://192.168.199.212:8088/archetype-ui-dr"',
})
