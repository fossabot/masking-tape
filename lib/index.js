var tape = require('tape')
var reporter = require('./reporter')

mask.stream = reporter

module.exports = mask

function mask(message, afterAll, beforeEach, afterEach) {
  var test = tape.createHarness()
  var stream = test.createStream({objectMode: true})

  stream
    .on('data', makeOnData(beforeEach, afterEach))
    .on('end', afterAll || noop)

  test.createStream()
    .pipe(mask.stream())
    .write('# ' + message.split('\n').join('\n# ') + '\n')

  return test
}

function makeOnData(beforeEach, afterEach) {
  return function(data) {
    if(!data && typeof data !== 'object') {
      return
    }

    if(data.type === 'test' && beforeEach) {
      beforeEach()
    }

    if(data.type === 'end' && afterEach) {
      afterEach()
    }
  }
}

function noop() {
  //
}
