# Masking-Tape
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Furbanairship%2Fmasking-tape.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Furbanairship%2Fmasking-tape?ref=badge_shield)


A [tape](https://npmjs.com/package/tape) test harness with "beforeEach",
"afterEach", and "afterAll" lifecycle hooks. Also lets you add an identifying
comment to the beginning of each test file's run.

## Example:

```javascript
var mask = require('masking-tape')

// a pretend module that overrides http requests, like sinon's fakeServer,
// perhaps
var mockServer = require('mock-server') 

var server = new mockServer
var test = mask('my bestest test', afterAll, beforeEach, afterEach)

function beforeEach() {
  // maybe we've got a dom available.
  document.body.innerHTML = '<div>test html</div>'
}

function afterEach() {
  server.removeAllEndpoints()
}


function afterAll() {
  mockServer.teardownAll()
}

test('my coolestest test', function(t) {
  /* 
   * This is just a normal tape test.
  */
  t.end()
})
```

## API:

```javascript
var test = mask(name, afterAll, beforeEach, afterEach)
```

### Arguments

- `name`: a string to be printed as a comment before the test runs. Can have
  multiple lines: Each line will have `# ` prepended to it.

- `afterAll`: A function to be run after each test completes. This is necessary
  because by default tape runs all tests in the same environment, so leaving it
  out can pollute your test run.

- `beforeEach`: A function to be run before each test begins. There is no
  functionality to schedule the next test after an asynchronous process
  specified in `before` completes. The next test will be queued as
  soon as this function returns.

- `afterEach`: A function to be run after each tests completes. `masking-tape` does
  not support asynchronous function calls here, meaning that the next test will
  be queued as soon as this function returns.

Errors occurring in these functions are unhandled. Tracebacks should be easy to
follow because of the complete lack of asynchronous support.

### Return Value

A [tape test harness](https://github.com/substack/tape#var-htest--testcreateharness).

## Note:

The function returned by `require('masking-tape')` has an attribute attached to
it called `.stream`.  `require('masking-tape').stream` is a function that
returns a stream. `tape`'s stream of text data is piped into the returned 
stream in order to report test results. The "class" method is available to
support tests, but you could also use it to report test results across a
network, or in a browser. The default stream lives in
[lib/reporter.js](./lib/reporter.js)

## Why should I use this module as opposed to `<insert module here>`

This module implements its functionality without overriding any tape methods,
or adding unnecessary clutter to tape's output. It simply makes a test harness,
and creates an object stream which informs the client of the test's life-cycle. 

The only caveat is we had to write a custom reporter stream for writing to
stdout, since tape does not expose the reporter it uses internally.

## Contributing:

Please see the [contributing guidelines](./CONTRIBUTING.md).

## License:

[APACHE V2](./LICENSE)


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Furbanairship%2Fmasking-tape.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Furbanairship%2Fmasking-tape?ref=badge_large)