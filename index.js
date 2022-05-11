'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/cjs/seven.prod.js')
} else {
  module.exports = require('./dist/cjs/seven.js')
}
