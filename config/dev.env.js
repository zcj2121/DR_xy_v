'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://192.168.199.212:8088/archetype-ui-dr"',
  BASE_API: '"http://47.98.55.66:8090/archetype-ui-dr"',
})
