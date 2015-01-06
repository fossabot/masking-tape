var through = require('through')

module.exports = reporterStream

function reporterStream(_log) {
  var log = _log || defaultLog

  var stream = through(write, function() {
    // otherwise you won't get the last thing you put in the queue unless you
    // ended it with a newline
    log(stream.message)
  })

  stream.message = ''

  return stream

  function write(data) {
    var i = data.indexOf('\n')

    while(i !== -1) {
      stream.message += data.slice(0, i)

      log(stream.message)
      stream.message = ''

      data = data.slice(i + 1)
      i = data.indexOf('\n')
    }

    stream.message += data
  }

  function defaultLog(data) {
    console.log(data)
  }
}
