var mask = require('../')
var through = require('through')
var tape = require('tape')

var originalStream = mask.stream

tape('ensure lifecycle events occur in correct order', function(t) {
  t.plan(3)
  var stream = through()

  mask.stream = function() {
    return stream
  }

  var test = mask('filename', afterAll, before, after)
  var counter = 0

  function afterAll() {
    t.equal(counter, 6)
    mask.stream = originalStream
    t.end()
  }

  function before() {
    counter++
  }

  function after() {
    counter++
  }

  test('a test', function(_t) {
    counter++
    _t.ok(true)
    t.equal(counter, 2)
    _t.end()
  })

  test('just another test', function(_t) {
    counter++
    t.equal(counter, 5)
    _t.end()
  })
})

tape('creates a new harness', function(t) {
  var stream = through()

  mask.stream = function() {
    return stream
  }

  var test = mask('a file')

  t.plan(2)

  t.notEqual(test, tape)
  t.notDeepEqual(test, tape)

  t.end()
})

tape('writes message to output before tests run.', function(t) {
  // NB: this test does not verify that the message is printed only once...
  // It checks that the expected message is the first thing written to the
  // stream, and then exits

  var stream = through()
  var message = 'arbitrary \n multiline name'
  var messageArray = message.split('')

  mask.stream = function() {
    return stream
  }

  stream.on('data', onData)
  stream.on('end', onEnd)

  function onEnd() {
    t.fail('consumed test output without encountering expected message')
  }

  var found = ''

  function onData(data) {
    var dataArray = data.split('')

    var messageElement
    var dataElement

    while(messageArray.length && dataArray.length) {
      messageElement = messageArray.shift()
      dataElement = dataArray.shift()

      if(dataElement === '#') {
        dataElement = dataArray.shift()
        t.equal(dataElement, ' ', 'encountered comment/space')

        if(found.length) {
          t.equal(t.equal(found[found.length - 1], '\n'))
        }

        dataElement = dataArray.shift()
      }

      found += dataElement
      t.equal(
          messageElement
        , dataElement
        , messageElement + ' == ' + dataElement
      )
    }

    if(!messageArray.length) {
      // then we consumed the whole message and found matches the whole way
      stream.removeListener('data', onData)
      stream.removeListener('end', onEnd)
      t.end()
    }
  }

  var test = mask(message)

  test('my coolest test', function(_t) {
    _t.equal('cool', 'cool')
    _t.end()
  })
})
