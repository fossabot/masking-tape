var reporter = require('../lib/reporter')
var tape = require('tape')

for(var j = 0; j < 10; ++j) {
  // this test is randomized, so we run it many times to make sure it's working
  // properly
  tape(1 + '-th test that it logs when written', logsWhenWritten)
}

function logsWhenWritten(t) {
  var expected = [
      'Come live with me and be my love,'
    , 'And we will all the pleasures prove,'
    , 'That Valleys, groves, hills, and fields,'
    , 'Woods, or steepy mountain yields.'
    , ''
    , 'And we will sit upon the Rocks,'
    , 'Seeing the Shepherds feed their flocks,'
    , 'By shallow Rivers to whose falls'
    , 'Melodious birds sing Madrigals.'
    , ''
    , 'And I will make thee beds of Roses'
    , 'And a thousand fragrant posies,'
    , 'A cap of flowers, and a kirtle'
    , 'Embroidered all with leaves of Myrtle;'
    , ''
    , 'A gown made of the finest wool'
    , 'Which from our pretty Lambs we pull;'
    , 'Fair lined slippers for the cold,'
    , 'With buckles of the purest gold;'
    , ''
    , 'A belt of straw and Ivy buds,'
    , 'With Coral clasps and Amber studs:'
    , 'And if these pleasures may thee move,'
    , 'Come live with me, and be my love.'
    , ''
    , 'The Shepherds’ Swains shall dance and sing'
    , 'For thy delight each May-morning:'
    , 'If these delights thy mind may move,'
    , 'Then live with me, and be my love.'
    , '-- Christopher Marlowe, published in 1599'
  ]

  t.plan(expected.length)

  var stream = reporter(log)
  var values = expected.join('\n')
  var subsets = chooseRandomSubsets(values)

  write()

  function write() {
    var data = subsets.shift()

    if(typeof data === 'undefined') {
      stream.end()
      t.end()

      return
    }

    stream.write(data)

    setTimeout(write, 0)
  }

  function log(data) {
    t.equal(data, expected.shift())
  }
}

function chooseRandomSubsets(str) {
  var arr = str.split('')
  var result = []
  var amount
  var elements

  while(arr.length) {
    amount = 1

    if(arr.length > 1) {
      amount = Math.min(arr.length, Math.floor(Math.random() * 100) + 10)
    }

    elements = arr.splice(0, amount)

    result.push(elements.join(''))
  }

  return result
}
