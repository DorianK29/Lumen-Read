(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[396],{

/***/ 6446:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ 1468:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(6446)
var ieee754 = __webpack_require__(7164)
var isArray = __webpack_require__(3161)

exports.Buffer = Buffer
__webpack_unused_export__ = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = __webpack_require__.g.TYPED_ARRAY_SUPPORT !== undefined
  ? __webpack_require__.g.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
__webpack_unused_export__ = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


/***/ }),

/***/ 7164:
/***/ (function(__unused_webpack_module, exports) {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ 3161:
/***/ (function(module) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ 8567:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var __dirname = "/";
(function(){var e={477:function(e){"use strict";e.exports=__webpack_require__(5302)}};var t={};function __nccwpck_require__(o){var a=t[o];if(a!==undefined){return a.exports}var s=t[o]={exports:{}};var n=true;try{e[o](s,s.exports,__nccwpck_require__);n=false}finally{if(n)delete t[o]}return s.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var o={};!function(){var e=o;var t,a=(t=__nccwpck_require__(477))&&"object"==typeof t&&"default"in t?t.default:t,s=/https?|ftp|gopher|file/;function r(e){"string"==typeof e&&(e=d(e));var t=function(e,t,o){var a=e.auth,s=e.hostname,n=e.protocol||"",p=e.pathname||"",c=e.hash||"",i=e.query||"",u=!1;a=a?encodeURIComponent(a).replace(/%3A/i,":")+"@":"",e.host?u=a+e.host:s&&(u=a+(~s.indexOf(":")?"["+s+"]":s),e.port&&(u+=":"+e.port)),i&&"object"==typeof i&&(i=t.encode(i));var f=e.search||i&&"?"+i||"";return n&&":"!==n.substr(-1)&&(n+=":"),e.slashes||(!n||o.test(n))&&!1!==u?(u="//"+(u||""),p&&"/"!==p[0]&&(p="/"+p)):u||(u=""),c&&"#"!==c[0]&&(c="#"+c),f&&"?"!==f[0]&&(f="?"+f),{protocol:n,host:u,pathname:p=p.replace(/[?#]/g,encodeURIComponent),search:f=f.replace("#","%23"),hash:c}}(e,a,s);return""+t.protocol+t.host+t.pathname+t.search+t.hash}var n="http://",p="w.w",c=n+p,i=/^([a-z0-9.+-]*:\/\/\/)([a-z0-9.+-]:\/*)?/i,u=/https?|ftp|gopher|file/;function h(e,t){var o="string"==typeof e?d(e):e;e="object"==typeof e?r(e):e;var a=d(t),s="";o.protocol&&!o.slashes&&(s=o.protocol,e=e.replace(o.protocol,""),s+="/"===t[0]||"/"===e[0]?"/":""),s&&a.protocol&&(s="",a.slashes||(s=a.protocol,t=t.replace(a.protocol,"")));var p=e.match(i);p&&!a.protocol&&(e=e.substr((s=p[1]+(p[2]||"")).length),/^\/\/[^/]/.test(t)&&(s=s.slice(0,-1)));var f=new URL(e,c+"/"),m=new URL(t,f).toString().replace(c,""),v=a.protocol||o.protocol;return v+=o.slashes||a.slashes?"//":"",!s&&v?m=m.replace(n,v):s&&(m=m.replace(n,"")),u.test(m)||~t.indexOf(".")||"/"===e.slice(-1)||"/"===t.slice(-1)||"/"!==m.slice(-1)||(m=m.slice(0,-1)),s&&(m=s+("/"===m[0]?m.substr(1):m)),m}function l(){}l.prototype.parse=d,l.prototype.format=r,l.prototype.resolve=h,l.prototype.resolveObject=h;var f=/^https?|ftp|gopher|file/,m=/^(.*?)([#?].*)/,v=/^([a-z0-9.+-]*:)(\/{0,3})(.*)/i,_=/^([a-z0-9.+-]*:)?\/\/\/*/i,b=/^([a-z0-9.+-]*:)(\/{0,2})\[(.*)\]$/i;function d(e,t,o){if(void 0===t&&(t=!1),void 0===o&&(o=!1),e&&"object"==typeof e&&e instanceof l)return e;var s=(e=e.trim()).match(m);e=s?s[1].replace(/\\/g,"/")+s[2]:e.replace(/\\/g,"/"),b.test(e)&&"/"!==e.slice(-1)&&(e+="/");var n=!/(^javascript)/.test(e)&&e.match(v),i=_.test(e),u="";n&&(f.test(n[1])||(u=n[1].toLowerCase(),e=""+n[2]+n[3]),n[2]||(i=!1,f.test(n[1])?(u=n[1],e=""+n[3]):e="//"+n[3]),3!==n[2].length&&1!==n[2].length||(u=n[1],e="/"+n[3]));var g,y=(s?s[1]:e).match(/^https?:\/\/[^/]+(:[0-9]+)(?=\/|$)/),w=y&&y[1],C=new l,U="",j="";try{g=new URL(e)}catch(t){U=t,u||o||!/^\/\//.test(e)||/^\/\/.+[@.]/.test(e)||(j="/",e=e.substr(1));try{g=new URL(e,c)}catch(e){return C.protocol=u,C.href=u,C}}C.slashes=i&&!j,C.host=g.host===p?"":g.host,C.hostname=g.hostname===p?"":g.hostname.replace(/(\[|\])/g,""),C.protocol=U?u||null:g.protocol,C.search=g.search.replace(/\\/g,"%5C"),C.hash=g.hash.replace(/\\/g,"%5C");var x=e.split("#");!C.search&&~x[0].indexOf("?")&&(C.search="?"),C.hash||""!==x[1]||(C.hash="#"),C.query=t?a.decode(g.search.substr(1)):C.search.substr(1),C.pathname=j+(n?function(e){return e.replace(/['^|`]/g,(function(e){return"%"+e.charCodeAt().toString(16).toUpperCase()})).replace(/((?:%[0-9A-F]{2})+)/g,(function(e,t){try{return decodeURIComponent(t).split("").map((function(e){var t=e.charCodeAt();return t>256||/^[a-z0-9]$/i.test(e)?e:"%"+t.toString(16).toUpperCase()})).join("")}catch(e){return t}}))}(g.pathname):g.pathname),"about:"===C.protocol&&"blank"===C.pathname&&(C.protocol="",C.pathname=""),U&&"/"!==e[0]&&(C.pathname=C.pathname.substr(1)),u&&!f.test(u)&&"/"!==e.slice(-1)&&"/"===C.pathname&&(C.pathname=""),C.path=C.pathname+C.search,C.auth=[g.username,g.password].map(decodeURIComponent).filter(Boolean).join(":"),C.port=g.port,w&&!C.host.endsWith(w)&&(C.host+=w,C.port=w.slice(1)),C.href=j?""+C.pathname+C.search+C.hash:r(C);var q=/^(file)/.test(C.href)?["host","hostname"]:[];return Object.keys(C).forEach((function(e){~q.indexOf(e)||(C[e]=C[e]||null)})),C}e.parse=d,e.format=r,e.resolve=h,e.resolveObject=function(e,t){return d(h(e,t))},e.Url=l}();module.exports=o})();

/***/ }),

/***/ 5302:
/***/ (function(module) {

var __dirname = "/";
(function(){"use strict";var e={815:function(e){function hasOwnProperty(e,r){return Object.prototype.hasOwnProperty.call(e,r)}e.exports=function(e,n,t,o){n=n||"&";t=t||"=";var a={};if(typeof e!=="string"||e.length===0){return a}var i=/\+/g;e=e.split(n);var u=1e3;if(o&&typeof o.maxKeys==="number"){u=o.maxKeys}var c=e.length;if(u>0&&c>u){c=u}for(var p=0;p<c;++p){var f=e[p].replace(i,"%20"),s=f.indexOf(t),_,l,y,d;if(s>=0){_=f.substr(0,s);l=f.substr(s+1)}else{_=f;l=""}y=decodeURIComponent(_);d=decodeURIComponent(l);if(!hasOwnProperty(a,y)){a[y]=d}else if(r(a[y])){a[y].push(d)}else{a[y]=[a[y],d]}}return a};var r=Array.isArray||function(e){return Object.prototype.toString.call(e)==="[object Array]"}},577:function(e){var stringifyPrimitive=function(e){switch(typeof e){case"string":return e;case"boolean":return e?"true":"false";case"number":return isFinite(e)?e:"";default:return""}};e.exports=function(e,t,o,a){t=t||"&";o=o||"=";if(e===null){e=undefined}if(typeof e==="object"){return map(n(e),(function(n){var a=encodeURIComponent(stringifyPrimitive(n))+o;if(r(e[n])){return map(e[n],(function(e){return a+encodeURIComponent(stringifyPrimitive(e))})).join(t)}else{return a+encodeURIComponent(stringifyPrimitive(e[n]))}})).join(t)}if(!a)return"";return encodeURIComponent(stringifyPrimitive(a))+o+encodeURIComponent(stringifyPrimitive(e))};var r=Array.isArray||function(e){return Object.prototype.toString.call(e)==="[object Array]"};function map(e,r){if(e.map)return e.map(r);var n=[];for(var t=0;t<e.length;t++){n.push(r(e[t],t))}return n}var n=Object.keys||function(e){var r=[];for(var n in e){if(Object.prototype.hasOwnProperty.call(e,n))r.push(n)}return r}}};var r={};function __nccwpck_require__(n){var t=r[n];if(t!==undefined){return t.exports}var o=r[n]={exports:{}};var a=true;try{e[n](o,o.exports,__nccwpck_require__);a=false}finally{if(a)delete r[n]}return o.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var n={};!function(){var e=n;e.decode=e.parse=__nccwpck_require__(815);e.encode=e.stringify=__nccwpck_require__(577)}();module.exports=n})();

/***/ }),

/***/ 7494:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "InferenceSession": function() { return /* reexport */ inference_session_InferenceSession; },
  "Tensor": function() { return /* reexport */ tensor_Tensor; },
  "env": function() { return /* reexport */ env; },
  "registerBackend": function() { return /* reexport */ registerBackend; }
});

;// CONCATENATED MODULE: ../../node_modules/.pnpm/onnxruntime-common@1.14.0/node_modules/onnxruntime-common/dist/lib/backend-impl.js
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const backends = {};
const backendsSortedByPriority = [];
/**
 * Register a backend.
 *
 * @param name - the name as a key to lookup as an execution provider.
 * @param backend - the backend object.
 * @param priority - an integer indicating the priority of the backend. Higher number means higher priority. if priority
 * < 0, it will be considered as a 'beta' version and will not be used as a fallback backend by default.
 *
 * @internal
 */
const registerBackend = (name, backend, priority) => {
    if (backend && typeof backend.init === 'function' && typeof backend.createSessionHandler === 'function') {
        const currentBackend = backends[name];
        if (currentBackend === undefined) {
            backends[name] = { backend, priority };
        }
        else if (currentBackend.priority > priority) {
            // same name is already registered with a higher priority. skip registeration.
            return;
        }
        else if (currentBackend.priority === priority) {
            if (currentBackend.backend !== backend) {
                throw new Error(`cannot register backend "${name}" using priority ${priority}`);
            }
        }
        if (priority >= 0) {
            const i = backendsSortedByPriority.indexOf(name);
            if (i !== -1) {
                backendsSortedByPriority.splice(i, 1);
            }
            for (let i = 0; i < backendsSortedByPriority.length; i++) {
                if (backends[backendsSortedByPriority[i]].priority <= priority) {
                    backendsSortedByPriority.splice(i, 0, name);
                    return;
                }
            }
            backendsSortedByPriority.push(name);
        }
        return;
    }
    throw new TypeError('not a valid backend');
};
/**
 * Resolve backend by specified hints.
 *
 * @param backendHints - a list of execution provider names to lookup. If omitted use registered backends as list.
 * @returns a promise that resolves to the backend.
 *
 * @internal
 */
const resolveBackend = async (backendHints) => {
    const backendNames = backendHints.length === 0 ? backendsSortedByPriority : backendHints;
    const errors = [];
    for (const backendName of backendNames) {
        const backendInfo = backends[backendName];
        if (backendInfo) {
            if (backendInfo.initialized) {
                return backendInfo.backend;
            }
            else if (backendInfo.aborted) {
                continue; // current backend is unavailable; try next
            }
            const isInitializing = !!backendInfo.initPromise;
            try {
                if (!isInitializing) {
                    backendInfo.initPromise = backendInfo.backend.init();
                }
                await backendInfo.initPromise;
                backendInfo.initialized = true;
                return backendInfo.backend;
            }
            catch (e) {
                if (!isInitializing) {
                    errors.push({ name: backendName, err: e });
                }
                backendInfo.aborted = true;
            }
            finally {
                delete backendInfo.initPromise;
            }
        }
    }
    throw new Error(`no available backend found. ERR: ${errors.map(e => `[${e.name}] ${e.err}`).join(', ')}`);
};
//# sourceMappingURL=backend-impl.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/onnxruntime-common@1.14.0/node_modules/onnxruntime-common/dist/lib/backend.js
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

//# sourceMappingURL=backend.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/onnxruntime-common@1.14.0/node_modules/onnxruntime-common/dist/lib/env-impl.js
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
class EnvImpl {
    constructor() {
        this.wasm = {};
        this.webgl = {};
        this.logLevelInternal = 'warning';
    }
    // TODO standadize the getter and setter convention in env for other fields.
    set logLevel(value) {
        if (value === undefined) {
            return;
        }
        if (typeof value !== 'string' || ['verbose', 'info', 'warning', 'error', 'fatal'].indexOf(value) === -1) {
            throw new Error(`Unsupported logging level: ${value}`);
        }
        this.logLevelInternal = value;
    }
    get logLevel() {
        return this.logLevelInternal;
    }
}
//# sourceMappingURL=env-impl.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/onnxruntime-common@1.14.0/node_modules/onnxruntime-common/dist/lib/env.js
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/**
 * Represent a set of flags as a global singleton.
 */
const env = new EnvImpl();
//# sourceMappingURL=env.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/onnxruntime-common@1.14.0/node_modules/onnxruntime-common/dist/lib/tensor-impl.js
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const isBigInt64ArrayAvailable = typeof BigInt64Array !== 'undefined' && typeof BigInt64Array.from === 'function';
const isBigUint64ArrayAvailable = typeof BigUint64Array !== 'undefined' && typeof BigUint64Array.from === 'function';
// a runtime map that maps type string to TypedArray constructor. Should match Tensor.DataTypeMap.
const NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP = new Map([
    ['float32', Float32Array],
    ['uint8', Uint8Array],
    ['int8', Int8Array],
    ['uint16', Uint16Array],
    ['int16', Int16Array],
    ['int32', Int32Array],
    ['bool', Uint8Array],
    ['float64', Float64Array],
    ['uint32', Uint32Array],
]);
// a runtime map that maps type string to TypedArray constructor. Should match Tensor.DataTypeMap.
const NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP = new Map([
    [Float32Array, 'float32'],
    [Uint8Array, 'uint8'],
    [Int8Array, 'int8'],
    [Uint16Array, 'uint16'],
    [Int16Array, 'int16'],
    [Int32Array, 'int32'],
    [Float64Array, 'float64'],
    [Uint32Array, 'uint32'],
]);
if (isBigInt64ArrayAvailable) {
    NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.set('int64', BigInt64Array);
    NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP.set(BigInt64Array, 'int64');
}
if (isBigUint64ArrayAvailable) {
    NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.set('uint64', BigUint64Array);
    NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP.set(BigUint64Array, 'uint64');
}
/**
 * calculate size from dims.
 *
 * @param dims the dims array. May be an illegal input.
 */
const calculateSize = (dims) => {
    let size = 1;
    for (let i = 0; i < dims.length; i++) {
        const dim = dims[i];
        if (typeof dim !== 'number' || !Number.isSafeInteger(dim)) {
            throw new TypeError(`dims[${i}] must be an integer, got: ${dim}`);
        }
        if (dim < 0) {
            throw new RangeError(`dims[${i}] must be a non-negative integer, got: ${dim}`);
        }
        size *= dim;
    }
    return size;
};
class Tensor {
    constructor(arg0, arg1, arg2) {
        let type;
        let data;
        let dims;
        // check whether arg0 is type or data
        if (typeof arg0 === 'string') {
            //
            // Override: constructor(type, data, ...)
            //
            type = arg0;
            dims = arg2;
            if (arg0 === 'string') {
                // string tensor
                if (!Array.isArray(arg1)) {
                    throw new TypeError('A string tensor\'s data must be a string array.');
                }
                // we don't check whether every element in the array is string; this is too slow. we assume it's correct and
                // error will be populated at inference
                data = arg1;
            }
            else {
                // numeric tensor
                const typedArrayConstructor = NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.get(arg0);
                if (typedArrayConstructor === undefined) {
                    throw new TypeError(`Unsupported tensor type: ${arg0}.`);
                }
                if (Array.isArray(arg1)) {
                    // use 'as any' here because TypeScript's check on type of 'SupportedTypedArrayConstructors.from()' produces
                    // incorrect results.
                    // 'typedArrayConstructor' should be one of the typed array prototype objects.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data = typedArrayConstructor.from(arg1);
                }
                else if (arg1 instanceof typedArrayConstructor) {
                    data = arg1;
                }
                else {
                    throw new TypeError(`A ${type} tensor's data must be type of ${typedArrayConstructor}`);
                }
            }
        }
        else {
            //
            // Override: constructor(data, ...)
            //
            dims = arg1;
            if (Array.isArray(arg0)) {
                // only boolean[] and string[] is supported
                if (arg0.length === 0) {
                    throw new TypeError('Tensor type cannot be inferred from an empty array.');
                }
                const firstElementType = typeof arg0[0];
                if (firstElementType === 'string') {
                    type = 'string';
                    data = arg0;
                }
                else if (firstElementType === 'boolean') {
                    type = 'bool';
                    // 'arg0' is of type 'boolean[]'. Uint8Array.from(boolean[]) actually works, but typescript thinks this is
                    // wrong type. We use 'as any' to make it happy.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data = Uint8Array.from(arg0);
                }
                else {
                    throw new TypeError(`Invalid element type of data array: ${firstElementType}.`);
                }
            }
            else {
                // get tensor type from TypedArray
                const mappedType = NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP.get(arg0.constructor);
                if (mappedType === undefined) {
                    throw new TypeError(`Unsupported type for tensor data: ${arg0.constructor}.`);
                }
                type = mappedType;
                data = arg0;
            }
        }
        // type and data is processed, now processing dims
        if (dims === undefined) {
            // assume 1-D tensor if dims omitted
            dims = [data.length];
        }
        else if (!Array.isArray(dims)) {
            throw new TypeError('A tensor\'s dims must be a number array');
        }
        // perform check
        const size = calculateSize(dims);
        if (size !== data.length) {
            throw new Error(`Tensor's size(${size}) does not match data length(${data.length}).`);
        }
        this.dims = dims;
        this.type = type;
        this.data = data;
        this.size = size;
    }
    // #endregion
    /**
     * Create a new tensor object from image object
     *
     * @param buffer - Extracted image buffer data - assuming RGBA format
     * @param imageFormat - input image configuration - required configurations height, width, format
     * @param tensorFormat - output tensor configuration - Default is RGB format
     */
    static bufferToTensor(buffer, options) {
        if (buffer === undefined) {
            throw new Error('Image buffer must be defined');
        }
        if (options.height === undefined || options.width === undefined) {
            throw new Error('Image height and width must be defined');
        }
        const { height, width } = options;
        const norm = options.norm;
        let normMean;
        let normBias;
        if (norm === undefined || norm.mean === undefined) {
            normMean = 255;
        }
        else {
            normMean = norm.mean;
        }
        if (norm === undefined || norm.bias === undefined) {
            normBias = 0;
        }
        else {
            normBias = norm.bias;
        }
        const inputformat = options.bitmapFormat !== undefined ? options.bitmapFormat : 'RGBA';
        // default value is RGBA since imagedata and HTMLImageElement uses it
        const outputformat = options.tensorFormat !== undefined ?
            (options.tensorFormat !== undefined ? options.tensorFormat : 'RGB') :
            'RGB';
        const offset = height * width;
        const float32Data = outputformat === 'RGBA' ? new Float32Array(offset * 4) : new Float32Array(offset * 3);
        // Default pointer assignments
        let step = 4, rImagePointer = 0, gImagePointer = 1, bImagePointer = 2, aImagePointer = 3;
        let rTensorPointer = 0, gTensorPointer = offset, bTensorPointer = offset * 2, aTensorPointer = -1;
        // Updating the pointer assignments based on the input image format
        if (inputformat === 'RGB') {
            step = 3;
            rImagePointer = 0;
            gImagePointer = 1;
            bImagePointer = 2;
            aImagePointer = -1;
        }
        // Updating the pointer assignments based on the output tensor format
        if (outputformat === 'RGBA') {
            aTensorPointer = offset * 3;
        }
        else if (outputformat === 'RBG') {
            rTensorPointer = 0;
            bTensorPointer = offset;
            gTensorPointer = offset * 2;
        }
        else if (outputformat === 'BGR') {
            bTensorPointer = 0;
            gTensorPointer = offset;
            rTensorPointer = offset * 2;
        }
        for (let i = 0; i < offset; i++, rImagePointer += step, bImagePointer += step, gImagePointer += step, aImagePointer += step) {
            float32Data[rTensorPointer++] = (buffer[rImagePointer] + normBias) / normMean;
            float32Data[gTensorPointer++] = (buffer[gImagePointer] + normBias) / normMean;
            float32Data[bTensorPointer++] = (buffer[bImagePointer] + normBias) / normMean;
            if (aTensorPointer !== -1 && aImagePointer !== -1) {
                float32Data[aTensorPointer++] = (buffer[aImagePointer] + normBias) / normMean;
            }
        }
        // Float32Array -> ort.Tensor
        const outputTensor = outputformat === 'RGBA' ? new Tensor('float32', float32Data, [1, 4, height, width]) :
            new Tensor('float32', float32Data, [1, 3, height, width]);
        return outputTensor;
    }
    static async fromImage(image, options) {
        // checking the type of image object
        const isHTMLImageEle = typeof (HTMLImageElement) !== 'undefined' && image instanceof HTMLImageElement;
        const isImageDataEle = typeof (ImageData) !== 'undefined' && image instanceof ImageData;
        const isImageBitmap = typeof (ImageBitmap) !== 'undefined' && image instanceof ImageBitmap;
        const isURL = typeof (String) !== 'undefined' && (image instanceof String || typeof image === 'string');
        let data;
        let tensorConfig = {};
        // filling and checking image configuration options
        if (isHTMLImageEle) {
            // HTMLImageElement - image object - format is RGBA by default
            const canvas = document.createElement('canvas');
            const pixels2DContext = canvas.getContext('2d');
            if (pixels2DContext != null) {
                let height = image.naturalHeight;
                let width = image.naturalWidth;
                if (options !== undefined && options.resizedHeight !== undefined && options.resizedWidth !== undefined) {
                    height = options.resizedHeight;
                    width = options.resizedWidth;
                }
                if (options !== undefined) {
                    tensorConfig = options;
                    if (options.tensorFormat !== undefined) {
                        throw new Error('Image input config format must be RGBA for HTMLImageElement');
                    }
                    else {
                        tensorConfig.tensorFormat = 'RGBA';
                    }
                    if (options.height !== undefined && options.height !== height) {
                        throw new Error('Image input config height doesn\'t match HTMLImageElement height');
                    }
                    else {
                        tensorConfig.height = height;
                    }
                    if (options.width !== undefined && options.width !== width) {
                        throw new Error('Image input config width doesn\'t match HTMLImageElement width');
                    }
                    else {
                        tensorConfig.width = width;
                    }
                }
                else {
                    tensorConfig.tensorFormat = 'RGBA';
                    tensorConfig.height = height;
                    tensorConfig.width = width;
                }
                canvas.width = width;
                canvas.height = height;
                pixels2DContext.drawImage(image, 0, 0, width, height);
                data = pixels2DContext.getImageData(0, 0, width, height).data;
            }
            else {
                throw new Error('Can not access image data');
            }
        }
        else if (isImageDataEle) {
            // ImageData - image object - format is RGBA by default
            const format = 'RGBA';
            let height;
            let width;
            if (options !== undefined && options.resizedWidth !== undefined && options.resizedHeight !== undefined) {
                height = options.resizedHeight;
                width = options.resizedWidth;
            }
            else {
                height = image.height;
                width = image.width;
            }
            if (options !== undefined) {
                tensorConfig = options;
                if (options.bitmapFormat !== undefined && options.bitmapFormat !== format) {
                    throw new Error('Image input config format must be RGBA for ImageData');
                }
                else {
                    tensorConfig.bitmapFormat = 'RGBA';
                }
            }
            else {
                tensorConfig.bitmapFormat = 'RGBA';
            }
            tensorConfig.height = height;
            tensorConfig.width = width;
            if (options !== undefined) {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
                const pixels2DContext = tempCanvas.getContext('2d');
                if (pixels2DContext != null) {
                    pixels2DContext.putImageData(image, 0, 0);
                    data = pixels2DContext.getImageData(0, 0, width, height).data;
                }
                else {
                    throw new Error('Can not access image data');
                }
            }
            else {
                data = image.data;
            }
        }
        else if (isImageBitmap) {
            // ImageBitmap - image object - format must be provided by user
            if (options === undefined) {
                throw new Error('Please provide image config with format for Imagebitmap');
            }
            if (options.bitmapFormat !== undefined) {
                throw new Error('Image input config format must be defined for ImageBitmap');
            }
            const pixels2DContext = document.createElement('canvas').getContext('2d');
            if (pixels2DContext != null) {
                const height = image.height;
                const width = image.width;
                pixels2DContext.drawImage(image, 0, 0, width, height);
                data = pixels2DContext.getImageData(0, 0, width, height).data;
                if (options !== undefined) {
                    // using square brackets to avoid TS error - type 'never'
                    if (options.height !== undefined && options.height !== height) {
                        throw new Error('Image input config height doesn\'t match ImageBitmap height');
                    }
                    else {
                        tensorConfig.height = height;
                    }
                    // using square brackets to avoid TS error - type 'never'
                    if (options.width !== undefined && options.width !== width) {
                        throw new Error('Image input config width doesn\'t match ImageBitmap width');
                    }
                    else {
                        tensorConfig.width = width;
                    }
                }
                else {
                    tensorConfig.height = height;
                    tensorConfig.width = width;
                }
                return Tensor.bufferToTensor(data, tensorConfig);
            }
            else {
                throw new Error('Can not access image data');
            }
        }
        else if (isURL) {
            return new Promise((resolve, reject) => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                if (!image || !context) {
                    return reject();
                }
                const newImage = new Image();
                newImage.crossOrigin = 'Anonymous';
                newImage.src = image;
                newImage.onload = () => {
                    canvas.width = newImage.width;
                    canvas.height = newImage.height;
                    context.drawImage(newImage, 0, 0, canvas.width, canvas.height);
                    const img = context.getImageData(0, 0, canvas.width, canvas.height);
                    if (options !== undefined) {
                        // using square brackets to avoid TS error - type 'never'
                        if (options.height !== undefined && options.height !== canvas.height) {
                            throw new Error('Image input config height doesn\'t match ImageBitmap height');
                        }
                        else {
                            tensorConfig.height = canvas.height;
                        }
                        // using square brackets to avoid TS error - type 'never'
                        if (options.width !== undefined && options.width !== canvas.width) {
                            throw new Error('Image input config width doesn\'t match ImageBitmap width');
                        }
                        else {
                            tensorConfig.width = canvas.width;
                        }
                    }
                    else {
                        tensorConfig.height = canvas.height;
                        tensorConfig.width = canvas.width;
                    }
                    resolve(Tensor.bufferToTensor(img.data, tensorConfig));
                };
            });
        }
        else {
            throw new Error('Input data provided is not supported - aborted tensor creation');
        }
        if (data !== undefined) {
            return Tensor.bufferToTensor(data, tensorConfig);
        }
        else {
            throw new Error('Input data provided is not supported - aborted tensor creation');
        }
    }
    toImageData(options) {
        var _a, _b;
        const pixels2DContext = document.createElement('canvas').getContext('2d');
        let image;
        if (pixels2DContext != null) {
            // Default values for height and width & format
            const width = this.dims[3];
            const height = this.dims[2];
            const channels = this.dims[1];
            const inputformat = options !== undefined ? (options.format !== undefined ? options.format : 'RGB') : 'RGB';
            const normMean = options !== undefined ? (((_a = options.norm) === null || _a === void 0 ? void 0 : _a.mean) !== undefined ? options.norm.mean : 255) : 255;
            const normBias = options !== undefined ? (((_b = options.norm) === null || _b === void 0 ? void 0 : _b.bias) !== undefined ? options.norm.bias : 0) : 0;
            const offset = height * width;
            if (options !== undefined) {
                if (options.height !== undefined && options.height !== height) {
                    throw new Error('Image output config height doesn\'t match tensor height');
                }
                if (options.width !== undefined && options.width !== width) {
                    throw new Error('Image output config width doesn\'t match tensor width');
                }
                if (options.format !== undefined && (channels === 4 && options.format !== 'RGBA') ||
                    (channels === 3 && (options.format !== 'RGB' && options.format !== 'BGR'))) {
                    throw new Error('Tensor format doesn\'t match input tensor dims');
                }
            }
            // Default pointer assignments
            const step = 4;
            let rImagePointer = 0, gImagePointer = 1, bImagePointer = 2, aImagePointer = 3;
            let rTensorPointer = 0, gTensorPointer = offset, bTensorPointer = offset * 2, aTensorPointer = -1;
            // Updating the pointer assignments based on the input image format
            if (inputformat === 'RGBA') {
                rTensorPointer = 0;
                gTensorPointer = offset;
                bTensorPointer = offset * 2;
                aTensorPointer = offset * 3;
            }
            else if (inputformat === 'RGB') {
                rTensorPointer = 0;
                gTensorPointer = offset;
                bTensorPointer = offset * 2;
            }
            else if (inputformat === 'RBG') {
                rTensorPointer = 0;
                bTensorPointer = offset;
                gTensorPointer = offset * 2;
            }
            image = pixels2DContext.createImageData(width, height);
            for (let i = 0; i < height * width; rImagePointer += step, gImagePointer += step, bImagePointer += step, aImagePointer += step, i++) {
                image.data[rImagePointer] = (this.data[rTensorPointer++] - normBias) * normMean; // R value
                image.data[gImagePointer] = (this.data[gTensorPointer++] - normBias) * normMean; // G value
                image.data[bImagePointer] = (this.data[bTensorPointer++] - normBias) * normMean; // B value
                image.data[aImagePointer] =
                    aTensorPointer === -1 ? 255 : (this.data[aTensorPointer++] - normBias) * normMean; // A value
            }
        }
        else {
            throw new Error('Can not access image data');
        }
        return image;
    }
    // #endregion
    // #region tensor utilities
    reshape(dims) {
        return new Tensor(this.type, this.data, dims);
    }
}
//# sourceMappingURL=tensor-impl.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/onnxruntime-common@1.14.0/node_modules/onnxruntime-common/dist/lib/tensor.js
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// eslint-disable-next-line @typescript-eslint/naming-convention
const tensor_Tensor = Tensor;
//# sourceMappingURL=tensor.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/onnxruntime-common@1.14.0/node_modules/onnxruntime-common/dist/lib/inference-session-impl.js
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.


class InferenceSession {
    constructor(handler) {
        this.handler = handler;
    }
    async run(feeds, arg1, arg2) {
        const fetches = {};
        let options = {};
        // check inputs
        if (typeof feeds !== 'object' || feeds === null || feeds instanceof tensor_Tensor || Array.isArray(feeds)) {
            throw new TypeError('\'feeds\' must be an object that use input names as keys and OnnxValue as corresponding values.');
        }
        let isFetchesEmpty = true;
        // determine which override is being used
        if (typeof arg1 === 'object') {
            if (arg1 === null) {
                throw new TypeError('Unexpected argument[1]: cannot be null.');
            }
            if (arg1 instanceof tensor_Tensor) {
                throw new TypeError('\'fetches\' cannot be a Tensor');
            }
            if (Array.isArray(arg1)) {
                if (arg1.length === 0) {
                    throw new TypeError('\'fetches\' cannot be an empty array.');
                }
                isFetchesEmpty = false;
                // output names
                for (const name of arg1) {
                    if (typeof name !== 'string') {
                        throw new TypeError('\'fetches\' must be a string array or an object.');
                    }
                    if (this.outputNames.indexOf(name) === -1) {
                        throw new RangeError(`'fetches' contains invalid output name: ${name}.`);
                    }
                    fetches[name] = null;
                }
                if (typeof arg2 === 'object' && arg2 !== null) {
                    options = arg2;
                }
                else if (typeof arg2 !== 'undefined') {
                    throw new TypeError('\'options\' must be an object.');
                }
            }
            else {
                // decide whether arg1 is fetches or options
                // if any output name is present and its value is valid OnnxValue, we consider it fetches
                let isFetches = false;
                const arg1Keys = Object.getOwnPropertyNames(arg1);
                for (const name of this.outputNames) {
                    if (arg1Keys.indexOf(name) !== -1) {
                        const v = arg1[name];
                        if (v === null || v instanceof tensor_Tensor) {
                            isFetches = true;
                            isFetchesEmpty = false;
                            fetches[name] = v;
                        }
                    }
                }
                if (isFetches) {
                    if (typeof arg2 === 'object' && arg2 !== null) {
                        options = arg2;
                    }
                    else if (typeof arg2 !== 'undefined') {
                        throw new TypeError('\'options\' must be an object.');
                    }
                }
                else {
                    options = arg1;
                }
            }
        }
        else if (typeof arg1 !== 'undefined') {
            throw new TypeError('Unexpected argument[1]: must be \'fetches\' or \'options\'.');
        }
        // check if all inputs are in feed
        for (const name of this.inputNames) {
            if (typeof feeds[name] === 'undefined') {
                throw new Error(`input '${name}' is missing in 'feeds'.`);
            }
        }
        // if no fetches is specified, we use the full output names list
        if (isFetchesEmpty) {
            for (const name of this.outputNames) {
                fetches[name] = null;
            }
        }
        // feeds, fetches and options are prepared
        const results = await this.handler.run(feeds, fetches, options);
        const returnValue = {};
        for (const key in results) {
            if (Object.hasOwnProperty.call(results, key)) {
                returnValue[key] = new tensor_Tensor(results[key].type, results[key].data, results[key].dims);
            }
        }
        return returnValue;
    }
    static async create(arg0, arg1, arg2, arg3) {
        // either load from a file or buffer
        let filePathOrUint8Array;
        let options = {};
        if (typeof arg0 === 'string') {
            filePathOrUint8Array = arg0;
            if (typeof arg1 === 'object' && arg1 !== null) {
                options = arg1;
            }
            else if (typeof arg1 !== 'undefined') {
                throw new TypeError('\'options\' must be an object.');
            }
        }
        else if (arg0 instanceof Uint8Array) {
            filePathOrUint8Array = arg0;
            if (typeof arg1 === 'object' && arg1 !== null) {
                options = arg1;
            }
            else if (typeof arg1 !== 'undefined') {
                throw new TypeError('\'options\' must be an object.');
            }
        }
        else if (arg0 instanceof ArrayBuffer ||
            (typeof SharedArrayBuffer !== 'undefined' && arg0 instanceof SharedArrayBuffer)) {
            const buffer = arg0;
            let byteOffset = 0;
            let byteLength = arg0.byteLength;
            if (typeof arg1 === 'object' && arg1 !== null) {
                options = arg1;
            }
            else if (typeof arg1 === 'number') {
                byteOffset = arg1;
                if (!Number.isSafeInteger(byteOffset)) {
                    throw new RangeError('\'byteOffset\' must be an integer.');
                }
                if (byteOffset < 0 || byteOffset >= buffer.byteLength) {
                    throw new RangeError(`'byteOffset' is out of range [0, ${buffer.byteLength}).`);
                }
                byteLength = arg0.byteLength - byteOffset;
                if (typeof arg2 === 'number') {
                    byteLength = arg2;
                    if (!Number.isSafeInteger(byteLength)) {
                        throw new RangeError('\'byteLength\' must be an integer.');
                    }
                    if (byteLength <= 0 || byteOffset + byteLength > buffer.byteLength) {
                        throw new RangeError(`'byteLength' is out of range (0, ${buffer.byteLength - byteOffset}].`);
                    }
                    if (typeof arg3 === 'object' && arg3 !== null) {
                        options = arg3;
                    }
                    else if (typeof arg3 !== 'undefined') {
                        throw new TypeError('\'options\' must be an object.');
                    }
                }
                else if (typeof arg2 !== 'undefined') {
                    throw new TypeError('\'byteLength\' must be a number.');
                }
            }
            else if (typeof arg1 !== 'undefined') {
                throw new TypeError('\'options\' must be an object.');
            }
            filePathOrUint8Array = new Uint8Array(buffer, byteOffset, byteLength);
        }
        else {
            throw new TypeError('Unexpected argument[0]: must be \'path\' or \'buffer\'.');
        }
        // get backend hints
        const eps = options.executionProviders || [];
        const backendHints = eps.map(i => typeof i === 'string' ? i : i.name);
        const backend = await resolveBackend(backendHints);
        const handler = await backend.createSessionHandler(filePathOrUint8Array, options);
        return new InferenceSession(handler);
    }
    startProfiling() {
        this.handler.startProfiling();
    }
    endProfiling() {
        this.handler.endProfiling();
    }
    get inputNames() {
        return this.handler.inputNames;
    }
    get outputNames() {
        return this.handler.outputNames;
    }
}
//# sourceMappingURL=inference-session-impl.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/onnxruntime-common@1.14.0/node_modules/onnxruntime-common/dist/lib/inference-session.js
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// eslint-disable-next-line @typescript-eslint/naming-convention
const inference_session_InferenceSession = InferenceSession;
//# sourceMappingURL=inference-session.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/onnxruntime-common@1.14.0/node_modules/onnxruntime-common/dist/lib/index.js
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
/**
 * # ONNX Runtime JavaScript API
 *
 * ONNX Runtime JavaScript API is a unified API for all JavaScript usages, including the following NPM packages:
 *
 * - [onnxruntime-node](https://www.npmjs.com/package/onnxruntime-node)
 * - [onnxruntime-web](https://www.npmjs.com/package/onnxruntime-web)
 * - [onnxruntime-react-native](https://www.npmjs.com/package/onnxruntime-react-native)
 *
 * See also:
 * - [Get Started](https://onnxruntime.ai/docs/get-started/with-javascript.html)
 * - [Inference examples](https://github.com/microsoft/onnxruntime-inference-examples/tree/main/js)
 *
 * @packageDocumentation
 */





//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3656:
/***/ (function(module) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ 5987:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "YS": function() { return /* binding */ Template; }
/* harmony export */ });
/* unused harmony exports Environment, Interpreter, parse, tokenize */
// src/lexer.ts
var TOKEN_TYPES = Object.freeze({
  Text: "Text",
  // The text between Jinja statements or expressions
  NumericLiteral: "NumericLiteral",
  // e.g., 123
  BooleanLiteral: "BooleanLiteral",
  // true or false
  StringLiteral: "StringLiteral",
  // 'string'
  Identifier: "Identifier",
  // Variables, functions, etc.
  Equals: "Equals",
  // =
  OpenParen: "OpenParen",
  // (
  CloseParen: "CloseParen",
  // )
  OpenStatement: "OpenStatement",
  // {%
  CloseStatement: "CloseStatement",
  // %}
  OpenExpression: "OpenExpression",
  // {{
  CloseExpression: "CloseExpression",
  // }}
  OpenSquareBracket: "OpenSquareBracket",
  // [
  CloseSquareBracket: "CloseSquareBracket",
  // ]
  OpenCurlyBracket: "OpenCurlyBracket",
  // {
  CloseCurlyBracket: "CloseCurlyBracket",
  // }
  Comma: "Comma",
  // ,
  Dot: "Dot",
  // .
  Colon: "Colon",
  // :
  Pipe: "Pipe",
  // |
  CallOperator: "CallOperator",
  // ()
  AdditiveBinaryOperator: "AdditiveBinaryOperator",
  // + -
  MultiplicativeBinaryOperator: "MultiplicativeBinaryOperator",
  // * / %
  ComparisonBinaryOperator: "ComparisonBinaryOperator",
  // < > <= >= == !=
  UnaryOperator: "UnaryOperator",
  // ! - +
  // Keywords
  Set: "Set",
  If: "If",
  For: "For",
  In: "In",
  Is: "Is",
  NotIn: "NotIn",
  Else: "Else",
  EndIf: "EndIf",
  ElseIf: "ElseIf",
  EndFor: "EndFor",
  And: "And",
  Or: "Or",
  Not: "UnaryOperator"
});
var KEYWORDS = Object.freeze({
  set: TOKEN_TYPES.Set,
  for: TOKEN_TYPES.For,
  in: TOKEN_TYPES.In,
  is: TOKEN_TYPES.Is,
  if: TOKEN_TYPES.If,
  else: TOKEN_TYPES.Else,
  endif: TOKEN_TYPES.EndIf,
  elif: TOKEN_TYPES.ElseIf,
  endfor: TOKEN_TYPES.EndFor,
  and: TOKEN_TYPES.And,
  or: TOKEN_TYPES.Or,
  not: TOKEN_TYPES.Not,
  "not in": TOKEN_TYPES.NotIn,
  // Literals
  true: TOKEN_TYPES.BooleanLiteral,
  false: TOKEN_TYPES.BooleanLiteral
});
var Token = class {
  /**
   * Constructs a new Token.
   * @param {string} value The raw value as seen inside the source code.
   * @param {TokenType} type The type of token.
   */
  constructor(value, type) {
    this.value = value;
    this.type = type;
  }
};
function isWord(char) {
  return /\w/.test(char);
}
function isInteger(char) {
  return /[0-9]/.test(char);
}
var ORDERED_MAPPING_TABLE = [
  // Control sequences
  ["{%", TOKEN_TYPES.OpenStatement],
  ["%}", TOKEN_TYPES.CloseStatement],
  ["{{", TOKEN_TYPES.OpenExpression],
  ["}}", TOKEN_TYPES.CloseExpression],
  // Single character tokens
  ["(", TOKEN_TYPES.OpenParen],
  [")", TOKEN_TYPES.CloseParen],
  ["{", TOKEN_TYPES.OpenCurlyBracket],
  ["}", TOKEN_TYPES.CloseCurlyBracket],
  ["[", TOKEN_TYPES.OpenSquareBracket],
  ["]", TOKEN_TYPES.CloseSquareBracket],
  [",", TOKEN_TYPES.Comma],
  [".", TOKEN_TYPES.Dot],
  [":", TOKEN_TYPES.Colon],
  ["|", TOKEN_TYPES.Pipe],
  // Comparison operators
  ["<=", TOKEN_TYPES.ComparisonBinaryOperator],
  [">=", TOKEN_TYPES.ComparisonBinaryOperator],
  ["==", TOKEN_TYPES.ComparisonBinaryOperator],
  ["!=", TOKEN_TYPES.ComparisonBinaryOperator],
  ["<", TOKEN_TYPES.ComparisonBinaryOperator],
  [">", TOKEN_TYPES.ComparisonBinaryOperator],
  // Arithmetic operators
  ["+", TOKEN_TYPES.AdditiveBinaryOperator],
  ["-", TOKEN_TYPES.AdditiveBinaryOperator],
  ["*", TOKEN_TYPES.MultiplicativeBinaryOperator],
  ["/", TOKEN_TYPES.MultiplicativeBinaryOperator],
  ["%", TOKEN_TYPES.MultiplicativeBinaryOperator],
  // Assignment operator
  ["=", TOKEN_TYPES.Equals]
];
var ESCAPE_CHARACTERS = /* @__PURE__ */ new Map([
  ["n", "\n"],
  // New line
  ["t", "	"],
  // Horizontal tab
  ["r", "\r"],
  // Carriage return
  ["b", "\b"],
  // Backspace
  ["f", "\f"],
  // Form feed
  ["v", "\v"],
  // Vertical tab
  ["'", "'"],
  // Single quote
  ['"', '"'],
  // Double quote
  ["\\", "\\"]
  // Backslash
]);
function preprocess(template, options = {}) {
  if (template.endsWith("\n")) {
    template = template.slice(0, -1);
  }
  template = template.replace(/{#.*?#}/gs, "{##}");
  if (options.lstrip_blocks) {
    template = template.replace(/^[ \t]*({[#%])/gm, "$1");
  }
  if (options.trim_blocks) {
    template = template.replace(/([#%]})\n/g, "$1");
  }
  return template.replace(/{##}/g, "").replace(/-%}\s*/g, "%}").replace(/\s*{%-/g, "{%").replace(/-}}\s*/g, "}}").replace(/\s*{{-/g, "{{");
}
function tokenize(source, options = {}) {
  const tokens = [];
  const src = preprocess(source, options);
  let cursorPosition = 0;
  const consumeWhile = (predicate) => {
    let str = "";
    while (predicate(src[cursorPosition])) {
      if (src[cursorPosition] === "\\") {
        ++cursorPosition;
        if (cursorPosition >= src.length)
          throw new SyntaxError("Unexpected end of input");
        const escaped = src[cursorPosition++];
        const unescaped = ESCAPE_CHARACTERS.get(escaped);
        if (unescaped === void 0) {
          throw new SyntaxError(`Unexpected escaped character: ${escaped}`);
        }
        str += unescaped;
        continue;
      }
      str += src[cursorPosition++];
      if (cursorPosition >= src.length)
        throw new SyntaxError("Unexpected end of input");
    }
    return str;
  };
  main:
    while (cursorPosition < src.length) {
      const lastTokenType = tokens.at(-1)?.type;
      if (lastTokenType === void 0 || lastTokenType === TOKEN_TYPES.CloseStatement || lastTokenType === TOKEN_TYPES.CloseExpression) {
        let text = "";
        while (cursorPosition < src.length && // Keep going until we hit the next Jinja statement or expression
        !(src[cursorPosition] === "{" && (src[cursorPosition + 1] === "%" || src[cursorPosition + 1] === "{"))) {
          text += src[cursorPosition++];
        }
        if (text.length > 0) {
          tokens.push(new Token(text, TOKEN_TYPES.Text));
          continue;
        }
      }
      consumeWhile((char2) => /\s/.test(char2));
      const char = src[cursorPosition];
      if (char === "-" || char === "+") {
        const lastTokenType2 = tokens.at(-1)?.type;
        if (lastTokenType2 === TOKEN_TYPES.Text || lastTokenType2 === void 0) {
          throw new SyntaxError(`Unexpected character: ${char}`);
        }
        switch (lastTokenType2) {
          case TOKEN_TYPES.Identifier:
          case TOKEN_TYPES.NumericLiteral:
          case TOKEN_TYPES.BooleanLiteral:
          case TOKEN_TYPES.StringLiteral:
          case TOKEN_TYPES.CloseParen:
          case TOKEN_TYPES.CloseSquareBracket:
            break;
          default: {
            ++cursorPosition;
            const num = consumeWhile(isInteger);
            tokens.push(
              new Token(`${char}${num}`, num.length > 0 ? TOKEN_TYPES.NumericLiteral : TOKEN_TYPES.UnaryOperator)
            );
            continue;
          }
        }
      }
      for (const [char2, token] of ORDERED_MAPPING_TABLE) {
        const slice2 = src.slice(cursorPosition, cursorPosition + char2.length);
        if (slice2 === char2) {
          tokens.push(new Token(char2, token));
          cursorPosition += char2.length;
          continue main;
        }
      }
      if (char === "'" || char === '"') {
        ++cursorPosition;
        const str = consumeWhile((c) => c !== char);
        tokens.push(new Token(str, TOKEN_TYPES.StringLiteral));
        ++cursorPosition;
        continue;
      }
      if (isInteger(char)) {
        const num = consumeWhile(isInteger);
        tokens.push(new Token(num, TOKEN_TYPES.NumericLiteral));
        continue;
      }
      if (isWord(char)) {
        const word = consumeWhile(isWord);
        const type = Object.hasOwn(KEYWORDS, word) ? KEYWORDS[word] : TOKEN_TYPES.Identifier;
        if (type === TOKEN_TYPES.In && tokens.at(-1)?.type === TOKEN_TYPES.Not) {
          tokens.pop();
          tokens.push(new Token("not in", TOKEN_TYPES.NotIn));
        } else {
          tokens.push(new Token(word, type));
        }
        continue;
      }
      throw new SyntaxError(`Unexpected character: ${char}`);
    }
  return tokens;
}

// src/ast.ts
var Statement = class {
  type = "Statement";
};
var Program = class extends Statement {
  constructor(body) {
    super();
    this.body = body;
  }
  type = "Program";
};
var If = class extends Statement {
  constructor(test, body, alternate) {
    super();
    this.test = test;
    this.body = body;
    this.alternate = alternate;
  }
  type = "If";
};
var For = class extends Statement {
  constructor(loopvar, iterable, body) {
    super();
    this.loopvar = loopvar;
    this.iterable = iterable;
    this.body = body;
  }
  type = "For";
};
var SetStatement = class extends Statement {
  constructor(assignee, value) {
    super();
    this.assignee = assignee;
    this.value = value;
  }
  type = "Set";
};
var Expression = class extends Statement {
  type = "Expression";
};
var MemberExpression = class extends Expression {
  constructor(object, property, computed) {
    super();
    this.object = object;
    this.property = property;
    this.computed = computed;
  }
  type = "MemberExpression";
};
var CallExpression = class extends Expression {
  constructor(callee, args) {
    super();
    this.callee = callee;
    this.args = args;
  }
  type = "CallExpression";
};
var Identifier = class extends Expression {
  /**
   * @param {string} value The name of the identifier
   */
  constructor(value) {
    super();
    this.value = value;
  }
  type = "Identifier";
};
var Literal = class extends Expression {
  constructor(value) {
    super();
    this.value = value;
  }
  type = "Literal";
};
var NumericLiteral = class extends Literal {
  type = "NumericLiteral";
};
var StringLiteral = class extends Literal {
  type = "StringLiteral";
};
var BooleanLiteral = class extends Literal {
  type = "BooleanLiteral";
};
var ArrayLiteral = class extends Literal {
  type = "ArrayLiteral";
};
var TupleLiteral = class extends Literal {
  type = "TupleLiteral";
};
var ObjectLiteral = class extends Literal {
  type = "ObjectLiteral";
};
var BinaryExpression = class extends Expression {
  constructor(operator, left, right) {
    super();
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
  type = "BinaryExpression";
};
var FilterExpression = class extends Expression {
  constructor(operand, filter) {
    super();
    this.operand = operand;
    this.filter = filter;
  }
  type = "FilterExpression";
};
var TestExpression = class extends Expression {
  constructor(operand, negate, test) {
    super();
    this.operand = operand;
    this.negate = negate;
    this.test = test;
  }
  type = "TestExpression";
};
var UnaryExpression = class extends Expression {
  constructor(operator, argument) {
    super();
    this.operator = operator;
    this.argument = argument;
  }
  type = "UnaryExpression";
};
var SliceExpression = class extends Expression {
  constructor(start = void 0, stop = void 0, step = void 0) {
    super();
    this.start = start;
    this.stop = stop;
    this.step = step;
  }
  type = "SliceExpression";
};
var KeywordArgumentExpression = class extends Expression {
  constructor(key, value) {
    super();
    this.key = key;
    this.value = value;
  }
  type = "KeywordArgumentExpression";
};

// src/parser.ts
function parse(tokens) {
  const program = new Program([]);
  let current = 0;
  function expect(type, error) {
    const prev = tokens[current++];
    if (!prev || prev.type !== type) {
      throw new Error(`Parser Error: ${error}. ${prev.type} !== ${type}.`);
    }
    return prev;
  }
  function parseAny() {
    switch (tokens[current].type) {
      case TOKEN_TYPES.Text:
        return parseText();
      case TOKEN_TYPES.OpenStatement:
        return parseJinjaStatement();
      case TOKEN_TYPES.OpenExpression:
        return parseJinjaExpression();
      default:
        throw new SyntaxError(`Unexpected token type: ${tokens[current].type}`);
    }
  }
  function not(...types) {
    return current + types.length <= tokens.length && types.some((type, i) => type !== tokens[current + i].type);
  }
  function is(...types) {
    return current + types.length <= tokens.length && types.every((type, i) => type === tokens[current + i].type);
  }
  function parseText() {
    return new StringLiteral(expect(TOKEN_TYPES.Text, "Expected text token").value);
  }
  function parseJinjaStatement() {
    expect(TOKEN_TYPES.OpenStatement, "Expected opening statement token");
    let result;
    switch (tokens[current].type) {
      case TOKEN_TYPES.Set:
        ++current;
        result = parseSetStatement();
        expect(TOKEN_TYPES.CloseStatement, "Expected closing statement token");
        break;
      case TOKEN_TYPES.If:
        ++current;
        result = parseIfStatement();
        expect(TOKEN_TYPES.OpenStatement, "Expected {% token");
        expect(TOKEN_TYPES.EndIf, "Expected endif token");
        expect(TOKEN_TYPES.CloseStatement, "Expected %} token");
        break;
      case TOKEN_TYPES.For:
        ++current;
        result = parseForStatement();
        expect(TOKEN_TYPES.OpenStatement, "Expected {% token");
        expect(TOKEN_TYPES.EndFor, "Expected endfor token");
        expect(TOKEN_TYPES.CloseStatement, "Expected %} token");
        break;
      default:
        throw new SyntaxError(`Unknown statement type: ${tokens[current].type}`);
    }
    return result;
  }
  function parseJinjaExpression() {
    expect(TOKEN_TYPES.OpenExpression, "Expected opening expression token");
    const result = parseExpression();
    expect(TOKEN_TYPES.CloseExpression, "Expected closing expression token");
    return result;
  }
  function parseSetStatement() {
    const left = parseExpression();
    if (is(TOKEN_TYPES.Equals)) {
      ++current;
      const value = parseSetStatement();
      return new SetStatement(left, value);
    }
    return left;
  }
  function parseIfStatement() {
    const test = parseExpression();
    expect(TOKEN_TYPES.CloseStatement, "Expected closing statement token");
    const body = [];
    const alternate = [];
    while (!(tokens[current]?.type === TOKEN_TYPES.OpenStatement && (tokens[current + 1]?.type === TOKEN_TYPES.ElseIf || tokens[current + 1]?.type === TOKEN_TYPES.Else || tokens[current + 1]?.type === TOKEN_TYPES.EndIf))) {
      body.push(parseAny());
    }
    if (tokens[current]?.type === TOKEN_TYPES.OpenStatement && tokens[current + 1]?.type !== TOKEN_TYPES.EndIf) {
      ++current;
      if (is(TOKEN_TYPES.ElseIf)) {
        expect(TOKEN_TYPES.ElseIf, "Expected elseif token");
        alternate.push(parseIfStatement());
      } else {
        expect(TOKEN_TYPES.Else, "Expected else token");
        expect(TOKEN_TYPES.CloseStatement, "Expected closing statement token");
        while (!(tokens[current]?.type === TOKEN_TYPES.OpenStatement && tokens[current + 1]?.type === TOKEN_TYPES.EndIf)) {
          alternate.push(parseAny());
        }
      }
    }
    return new If(test, body, alternate);
  }
  function parseExpressionSequence(primary = false) {
    const fn = primary ? parsePrimaryExpression : parseExpression;
    const expressions = [fn()];
    const isTuple = is(TOKEN_TYPES.Comma);
    while (isTuple) {
      ++current;
      expressions.push(fn());
      if (!is(TOKEN_TYPES.Comma)) {
        break;
      }
    }
    return isTuple ? new TupleLiteral(expressions) : expressions[0];
  }
  function parseForStatement() {
    const loopVariable = parseExpressionSequence(true);
    if (!(loopVariable instanceof Identifier || loopVariable instanceof TupleLiteral)) {
      throw new SyntaxError(`Expected identifier/tuple for the loop variable, got ${loopVariable.type} instead`);
    }
    expect(TOKEN_TYPES.In, "Expected `in` keyword following loop variable");
    const iterable = parseExpression();
    expect(TOKEN_TYPES.CloseStatement, "Expected closing statement token");
    const body = [];
    while (not(TOKEN_TYPES.OpenStatement, TOKEN_TYPES.EndFor)) {
      body.push(parseAny());
    }
    return new For(loopVariable, iterable, body);
  }
  function parseExpression() {
    return parseTernaryExpression();
  }
  function parseTernaryExpression() {
    const a = parseLogicalOrExpression();
    if (is(TOKEN_TYPES.If)) {
      ++current;
      const predicate = parseLogicalOrExpression();
      expect(TOKEN_TYPES.Else, "Expected else token");
      const b = parseLogicalOrExpression();
      return new If(predicate, [a], [b]);
    }
    return a;
  }
  function parseLogicalOrExpression() {
    let left = parseLogicalAndExpression();
    while (is(TOKEN_TYPES.Or)) {
      const operator = tokens[current];
      ++current;
      const right = parseLogicalAndExpression();
      left = new BinaryExpression(operator, left, right);
    }
    return left;
  }
  function parseLogicalAndExpression() {
    let left = parseLogicalNegationExpression();
    while (is(TOKEN_TYPES.And)) {
      const operator = tokens[current];
      ++current;
      const right = parseLogicalNegationExpression();
      left = new BinaryExpression(operator, left, right);
    }
    return left;
  }
  function parseLogicalNegationExpression() {
    let right;
    while (is(TOKEN_TYPES.Not)) {
      const operator = tokens[current];
      ++current;
      const arg = parseLogicalNegationExpression();
      right = new UnaryExpression(operator, arg);
    }
    return right ?? parseComparisonExpression();
  }
  function parseComparisonExpression() {
    let left = parseAdditiveExpression();
    while (is(TOKEN_TYPES.ComparisonBinaryOperator) || is(TOKEN_TYPES.In) || is(TOKEN_TYPES.NotIn)) {
      const operator = tokens[current];
      ++current;
      const right = parseAdditiveExpression();
      left = new BinaryExpression(operator, left, right);
    }
    return left;
  }
  function parseAdditiveExpression() {
    let left = parseMultiplicativeExpression();
    while (is(TOKEN_TYPES.AdditiveBinaryOperator)) {
      const operator = tokens[current];
      ++current;
      const right = parseMultiplicativeExpression();
      left = new BinaryExpression(operator, left, right);
    }
    return left;
  }
  function parseCallMemberExpression() {
    const member = parseMemberExpression();
    if (is(TOKEN_TYPES.OpenParen)) {
      return parseCallExpression(member);
    }
    return member;
  }
  function parseCallExpression(callee) {
    let callExpression = new CallExpression(callee, parseArgs());
    if (is(TOKEN_TYPES.OpenParen)) {
      callExpression = parseCallExpression(callExpression);
    }
    return callExpression;
  }
  function parseArgs() {
    expect(TOKEN_TYPES.OpenParen, "Expected opening parenthesis for arguments list");
    const args = parseArgumentsList();
    expect(TOKEN_TYPES.CloseParen, "Expected closing parenthesis for arguments list");
    return args;
  }
  function parseArgumentsList() {
    const args = [];
    while (!is(TOKEN_TYPES.CloseParen)) {
      let argument = parseExpression();
      if (is(TOKEN_TYPES.Equals)) {
        ++current;
        if (!(argument instanceof Identifier)) {
          throw new SyntaxError(`Expected identifier for keyword argument`);
        }
        const value = parseExpression();
        argument = new KeywordArgumentExpression(argument, value);
      }
      args.push(argument);
      if (is(TOKEN_TYPES.Comma)) {
        ++current;
      }
    }
    return args;
  }
  function parseMemberExpressionArgumentsList() {
    const slices = [];
    let isSlice = false;
    while (!is(TOKEN_TYPES.CloseSquareBracket)) {
      if (is(TOKEN_TYPES.Colon)) {
        slices.push(void 0);
        ++current;
        isSlice = true;
      } else {
        slices.push(parseExpression());
        if (is(TOKEN_TYPES.Colon)) {
          ++current;
          isSlice = true;
        }
      }
    }
    if (slices.length === 0) {
      throw new SyntaxError(`Expected at least one argument for member/slice expression`);
    }
    if (isSlice) {
      if (slices.length > 3) {
        throw new SyntaxError(`Expected 0-3 arguments for slice expression`);
      }
      return new SliceExpression(...slices);
    }
    return slices[0];
  }
  function parseMemberExpression() {
    let object = parsePrimaryExpression();
    while (is(TOKEN_TYPES.Dot) || is(TOKEN_TYPES.OpenSquareBracket)) {
      const operator = tokens[current];
      ++current;
      let property;
      const computed = operator.type !== TOKEN_TYPES.Dot;
      if (computed) {
        property = parseMemberExpressionArgumentsList();
        expect(TOKEN_TYPES.CloseSquareBracket, "Expected closing square bracket");
      } else {
        property = parsePrimaryExpression();
        if (property.type !== "Identifier") {
          throw new SyntaxError(`Expected identifier following dot operator`);
        }
      }
      object = new MemberExpression(object, property, computed);
    }
    return object;
  }
  function parseMultiplicativeExpression() {
    let left = parseTestExpression();
    while (is(TOKEN_TYPES.MultiplicativeBinaryOperator)) {
      const operator = tokens[current];
      ++current;
      const right = parseTestExpression();
      left = new BinaryExpression(operator, left, right);
    }
    return left;
  }
  function parseTestExpression() {
    let operand = parseFilterExpression();
    while (is(TOKEN_TYPES.Is)) {
      ++current;
      const negate = is(TOKEN_TYPES.Not);
      if (negate) {
        ++current;
      }
      let filter = parsePrimaryExpression();
      if (filter instanceof BooleanLiteral) {
        filter = new Identifier(filter.value.toString());
      }
      if (!(filter instanceof Identifier)) {
        throw new SyntaxError(`Expected identifier for the test`);
      }
      operand = new TestExpression(operand, negate, filter);
    }
    return operand;
  }
  function parseFilterExpression() {
    let operand = parseCallMemberExpression();
    while (is(TOKEN_TYPES.Pipe)) {
      ++current;
      let filter = parsePrimaryExpression();
      if (!(filter instanceof Identifier)) {
        throw new SyntaxError(`Expected identifier for the filter`);
      }
      if (is(TOKEN_TYPES.OpenParen)) {
        filter = parseCallExpression(filter);
      }
      operand = new FilterExpression(operand, filter);
    }
    return operand;
  }
  function parsePrimaryExpression() {
    const token = tokens[current];
    switch (token.type) {
      case TOKEN_TYPES.NumericLiteral:
        ++current;
        return new NumericLiteral(Number(token.value));
      case TOKEN_TYPES.StringLiteral:
        ++current;
        return new StringLiteral(token.value);
      case TOKEN_TYPES.BooleanLiteral:
        ++current;
        return new BooleanLiteral(token.value === "true");
      case TOKEN_TYPES.Identifier:
        ++current;
        return new Identifier(token.value);
      case TOKEN_TYPES.OpenParen: {
        ++current;
        const expression = parseExpressionSequence();
        if (tokens[current].type !== TOKEN_TYPES.CloseParen) {
          throw new SyntaxError(`Expected closing parenthesis, got ${tokens[current].type} instead`);
        }
        ++current;
        return expression;
      }
      case TOKEN_TYPES.OpenSquareBracket: {
        ++current;
        const values = [];
        while (!is(TOKEN_TYPES.CloseSquareBracket)) {
          values.push(parseExpression());
          if (is(TOKEN_TYPES.Comma)) {
            ++current;
          }
        }
        ++current;
        return new ArrayLiteral(values);
      }
      case TOKEN_TYPES.OpenCurlyBracket: {
        ++current;
        const values = /* @__PURE__ */ new Map();
        while (!is(TOKEN_TYPES.CloseCurlyBracket)) {
          const key = parseExpression();
          expect(TOKEN_TYPES.Colon, "Expected colon between key and value in object literal");
          const value = parseExpression();
          values.set(key, value);
          if (is(TOKEN_TYPES.Comma)) {
            ++current;
          }
        }
        ++current;
        return new ObjectLiteral(values);
      }
      default:
        throw new SyntaxError(`Unexpected token: ${token.type}`);
    }
  }
  while (current < tokens.length) {
    program.body.push(parseAny());
  }
  return program;
}

// src/utils.ts
function range(start, stop, step = 1) {
  if (stop === void 0) {
    stop = start;
    start = 0;
  }
  const result = [];
  for (let i = start; i < stop; i += step) {
    result.push(i);
  }
  return result;
}
function slice(array, start, stop, step = 1) {
  const direction = Math.sign(step);
  if (direction >= 0) {
    start = (start ??= 0) < 0 ? Math.max(array.length + start, 0) : Math.min(start, array.length);
    stop = (stop ??= array.length) < 0 ? Math.max(array.length + stop, 0) : Math.min(stop, array.length);
  } else {
    start = (start ??= array.length - 1) < 0 ? Math.max(array.length + start, -1) : Math.min(start, array.length - 1);
    stop = (stop ??= -1) < -1 ? Math.max(array.length + stop, -1) : Math.min(stop, array.length - 1);
  }
  const result = [];
  for (let i = start; direction * i < direction * stop; i += step) {
    result.push(array[i]);
  }
  return result;
}
function titleCase(value) {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

// src/runtime.ts
var RuntimeValue = class {
  type = "RuntimeValue";
  value;
  /**
   * A collection of built-in functions for this type.
   */
  builtins = /* @__PURE__ */ new Map();
  /**
   * Creates a new RuntimeValue.
   */
  constructor(value = void 0) {
    this.value = value;
  }
  /**
   * Determines truthiness or falsiness of the runtime value.
   * This function should be overridden by subclasses if it has custom truthiness criteria.
   * @returns {BooleanValue} BooleanValue(true) if the value is truthy, BooleanValue(false) otherwise.
   */
  __bool__() {
    return new BooleanValue(!!this.value);
  }
};
var NumericValue = class extends RuntimeValue {
  type = "NumericValue";
};
var StringValue = class extends RuntimeValue {
  type = "StringValue";
  builtins = /* @__PURE__ */ new Map([
    [
      "upper",
      new FunctionValue(() => {
        return new StringValue(this.value.toUpperCase());
      })
    ],
    [
      "lower",
      new FunctionValue(() => {
        return new StringValue(this.value.toLowerCase());
      })
    ],
    [
      "strip",
      new FunctionValue(() => {
        return new StringValue(this.value.trim());
      })
    ],
    [
      "title",
      new FunctionValue(() => {
        return new StringValue(titleCase(this.value));
      })
    ],
    ["length", new NumericValue(this.value.length)]
  ]);
};
var BooleanValue = class extends RuntimeValue {
  type = "BooleanValue";
};
var ObjectValue = class extends RuntimeValue {
  type = "ObjectValue";
  /**
   * NOTE: necessary to override since all JavaScript arrays are considered truthy,
   * while only non-empty Python arrays are consider truthy.
   *
   * e.g.,
   *  - JavaScript:  {} && 5 -> 5
   *  - Python:      {} and 5 -> {}
   */
  __bool__() {
    return new BooleanValue(this.value.size > 0);
  }
  builtins = /* @__PURE__ */ new Map([
    [
      "get",
      new FunctionValue(([key, defaultValue]) => {
        if (!(key instanceof StringValue)) {
          throw new Error(`Object key must be a string: got ${key.type}`);
        }
        return this.value.get(key.value) ?? defaultValue ?? new NullValue();
      })
    ],
    [
      "items",
      new FunctionValue(() => {
        return new ArrayValue(
          Array.from(this.value.entries()).map(([key, value]) => new ArrayValue([new StringValue(key), value]))
        );
      })
    ]
  ]);
};
var ArrayValue = class extends RuntimeValue {
  type = "ArrayValue";
  builtins = /* @__PURE__ */ new Map([["length", new NumericValue(this.value.length)]]);
  /**
   * NOTE: necessary to override since all JavaScript arrays are considered truthy,
   * while only non-empty Python arrays are consider truthy.
   *
   * e.g.,
   *  - JavaScript:  [] && 5 -> 5
   *  - Python:      [] and 5 -> []
   */
  __bool__() {
    return new BooleanValue(this.value.length > 0);
  }
};
var TupleValue = class extends ArrayValue {
  type = "TupleValue";
};
var FunctionValue = class extends RuntimeValue {
  type = "FunctionValue";
};
var NullValue = class extends RuntimeValue {
  type = "NullValue";
};
var UndefinedValue = class extends RuntimeValue {
  type = "UndefinedValue";
};
var Environment = class {
  constructor(parent) {
    this.parent = parent;
  }
  /**
   * The variables declared in this environment.
   */
  variables = /* @__PURE__ */ new Map([
    [
      "namespace",
      new FunctionValue((args) => {
        if (args.length === 0) {
          return new ObjectValue(/* @__PURE__ */ new Map());
        }
        if (args.length !== 1 || !(args[0] instanceof ObjectValue)) {
          throw new Error("`namespace` expects either zero arguments or a single object argument");
        }
        return args[0];
      })
    ]
  ]);
  /**
   * The tests available in this environment.
   */
  tests = /* @__PURE__ */ new Map([
    ["boolean", (operand) => operand.type === "BooleanValue"],
    ["callable", (operand) => operand instanceof FunctionValue],
    [
      "odd",
      (operand) => {
        if (operand.type !== "NumericValue") {
          throw new Error(`Cannot apply test "odd" to type: ${operand.type}`);
        }
        return operand.value % 2 !== 0;
      }
    ],
    [
      "even",
      (operand) => {
        if (operand.type !== "NumericValue") {
          throw new Error(`Cannot apply test "even" to type: ${operand.type}`);
        }
        return operand.value % 2 === 0;
      }
    ],
    ["false", (operand) => operand.type === "BooleanValue" && !operand.value],
    ["true", (operand) => operand.type === "BooleanValue" && operand.value],
    ["number", (operand) => operand.type === "NumericValue"],
    ["integer", (operand) => operand.type === "NumericValue" && Number.isInteger(operand.value)],
    ["iterable", (operand) => operand instanceof ArrayValue || operand instanceof StringValue],
    [
      "lower",
      (operand) => {
        const str = operand.value;
        return operand.type === "StringValue" && str === str.toLowerCase();
      }
    ],
    [
      "upper",
      (operand) => {
        const str = operand.value;
        return operand.type === "StringValue" && str === str.toUpperCase();
      }
    ],
    ["none", (operand) => operand.type === "NullValue"],
    ["defined", (operand) => operand.type !== "UndefinedValue"],
    ["undefined", (operand) => operand.type === "UndefinedValue"],
    ["equalto", (a, b) => a.value === b.value]
  ]);
  /**
   * Set the value of a variable in the current environment.
   */
  set(name, value) {
    return this.declareVariable(name, convertToRuntimeValues(value));
  }
  declareVariable(name, value) {
    if (this.variables.has(name)) {
      throw new SyntaxError(`Variable already declared: ${name}`);
    }
    this.variables.set(name, value);
    return value;
  }
  // private assignVariable(name: string, value: AnyRuntimeValue): AnyRuntimeValue {
  // 	const env = this.resolve(name);
  // 	env.variables.set(name, value);
  // 	return value;
  // }
  /**
   * Set variable in the current scope.
   * See https://jinja.palletsprojects.com/en/3.0.x/templates/#assignments for more information.
   */
  setVariable(name, value) {
    this.variables.set(name, value);
    return value;
  }
  /**
   * Resolve the environment in which the variable is declared.
   * @param {string} name The name of the variable.
   * @returns {Environment} The environment in which the variable is declared.
   */
  resolve(name) {
    if (this.variables.has(name)) {
      return this;
    }
    if (this.parent) {
      return this.parent.resolve(name);
    }
    throw new Error(`Unknown variable: ${name}`);
  }
  lookupVariable(name) {
    try {
      return this.resolve(name).variables.get(name) ?? new UndefinedValue();
    } catch {
      return new UndefinedValue();
    }
  }
};
var Interpreter = class {
  global;
  constructor(env) {
    this.global = env ?? new Environment();
  }
  /**
   * Run the program.
   */
  run(program) {
    return this.evaluate(program, this.global);
  }
  /**
   * Evaluates expressions following the binary operation type.
   */
  evaluateBinaryExpression(node, environment) {
    const left = this.evaluate(node.left, environment);
    switch (node.operator.value) {
      case "and":
        return left.__bool__().value ? this.evaluate(node.right, environment) : left;
      case "or":
        return left.__bool__().value ? left : this.evaluate(node.right, environment);
    }
    const right = this.evaluate(node.right, environment);
    switch (node.operator.value) {
      case "==":
        return new BooleanValue(left.value == right.value);
      case "!=":
        return new BooleanValue(left.value != right.value);
    }
    if (left instanceof UndefinedValue || right instanceof UndefinedValue) {
      throw new Error("Cannot perform operation on undefined values");
    } else if (left instanceof NullValue || right instanceof NullValue) {
      throw new Error("Cannot perform operation on null values");
    } else if (left instanceof NumericValue && right instanceof NumericValue) {
      switch (node.operator.value) {
        case "+":
          return new NumericValue(left.value + right.value);
        case "-":
          return new NumericValue(left.value - right.value);
        case "*":
          return new NumericValue(left.value * right.value);
        case "/":
          return new NumericValue(left.value / right.value);
        case "%":
          return new NumericValue(left.value % right.value);
        case "<":
          return new BooleanValue(left.value < right.value);
        case ">":
          return new BooleanValue(left.value > right.value);
        case ">=":
          return new BooleanValue(left.value >= right.value);
        case "<=":
          return new BooleanValue(left.value <= right.value);
      }
    } else if (left instanceof ArrayValue && right instanceof ArrayValue) {
      switch (node.operator.value) {
        case "+":
          return new ArrayValue(left.value.concat(right.value));
      }
    } else if (right instanceof ArrayValue) {
      const member = right.value.find((x) => x.value === left.value) !== void 0;
      switch (node.operator.value) {
        case "in":
          return new BooleanValue(member);
        case "not in":
          return new BooleanValue(!member);
      }
    }
    if (left instanceof StringValue || right instanceof StringValue) {
      switch (node.operator.value) {
        case "+":
          return new StringValue(left.value.toString() + right.value.toString());
      }
    }
    if (left instanceof StringValue && right instanceof StringValue) {
      switch (node.operator.value) {
        case "in":
          return new BooleanValue(right.value.includes(left.value));
        case "not in":
          return new BooleanValue(!right.value.includes(left.value));
      }
    }
    if (left instanceof StringValue && right instanceof ObjectValue) {
      switch (node.operator.value) {
        case "in":
          return new BooleanValue(right.value.has(left.value));
        case "not in":
          return new BooleanValue(!right.value.has(left.value));
      }
    }
    throw new SyntaxError(`Unknown operator "${node.operator.value}" between ${left.type} and ${right.type}`);
  }
  /**
   * Evaluates expressions following the filter operation type.
   */
  evaluateFilterExpression(node, environment) {
    const operand = this.evaluate(node.operand, environment);
    if (node.filter.type === "Identifier") {
      const filter = node.filter;
      if (operand instanceof ArrayValue) {
        switch (filter.value) {
          case "list":
            return operand;
          case "first":
            return operand.value[0];
          case "last":
            return operand.value[operand.value.length - 1];
          case "length":
            return new NumericValue(operand.value.length);
          case "reverse":
            return new ArrayValue(operand.value.reverse());
          case "sort":
            return new ArrayValue(
              operand.value.sort((a, b) => {
                if (a.type !== b.type) {
                  throw new Error(`Cannot compare different types: ${a.type} and ${b.type}`);
                }
                switch (a.type) {
                  case "NumericValue":
                    return a.value - b.value;
                  case "StringValue":
                    return a.value.localeCompare(b.value);
                  default:
                    throw new Error(`Cannot compare type: ${a.type}`);
                }
              })
            );
          default:
            throw new Error(`Unknown ArrayValue filter: ${filter.value}`);
        }
      } else if (operand instanceof StringValue) {
        switch (filter.value) {
          case "length":
            return new NumericValue(operand.value.length);
          case "upper":
            return new StringValue(operand.value.toUpperCase());
          case "lower":
            return new StringValue(operand.value.toLowerCase());
          case "title":
            return new StringValue(titleCase(operand.value));
          case "capitalize":
            return new StringValue(operand.value.charAt(0).toUpperCase() + operand.value.slice(1));
          case "trim":
            return new StringValue(operand.value.trim());
          default:
            throw new Error(`Unknown StringValue filter: ${filter.value}`);
        }
      } else if (operand instanceof NumericValue) {
        switch (filter.value) {
          case "abs":
            return new NumericValue(Math.abs(operand.value));
          default:
            throw new Error(`Unknown NumericValue filter: ${filter.value}`);
        }
      } else if (operand instanceof ObjectValue) {
        switch (filter.value) {
          case "items":
            return new ArrayValue(
              Array.from(operand.value.entries()).map(([key, value]) => new ArrayValue([new StringValue(key), value]))
            );
          case "length":
            return new NumericValue(operand.value.size);
          default:
            throw new Error(`Unknown ObjectValue filter: ${filter.value}`);
        }
      }
      throw new Error(`Cannot apply filter "${filter.value}" to type: ${operand.type}`);
    } else if (node.filter.type === "CallExpression") {
      const filter = node.filter;
      if (filter.callee.type !== "Identifier") {
        throw new Error(`Unknown filter: ${filter.callee.type}`);
      }
      const filterName = filter.callee.value;
      if (operand instanceof ArrayValue) {
        switch (filterName) {
          case "selectattr": {
            if (operand.value.some((x) => !(x instanceof ObjectValue))) {
              throw new Error("`selectattr` can only be applied to array of objects");
            }
            if (filter.args.some((x) => x.type !== "StringLiteral")) {
              throw new Error("arguments of `selectattr` must be strings");
            }
            const [attr, testName, value] = filter.args.map((x) => this.evaluate(x, environment));
            let testFunction;
            if (testName) {
              const test = environment.tests.get(testName.value);
              if (!test) {
                throw new Error(`Unknown test: ${testName.value}`);
              }
              testFunction = test;
            } else {
              testFunction = (...x) => x[0].__bool__().value;
            }
            const filtered = operand.value.filter((item) => {
              const a = item.value.get(attr.value);
              if (a) {
                return testFunction(a, value);
              }
              return false;
            });
            return new ArrayValue(filtered);
          }
        }
        throw new Error(`Unknown ArrayValue filter: ${filterName}`);
      } else {
        throw new Error(`Cannot apply filter "${filterName}" to type: ${operand.type}`);
      }
    }
    throw new Error(`Unknown filter: ${node.filter.type}`);
  }
  /**
   * Evaluates expressions following the test operation type.
   */
  evaluateTestExpression(node, environment) {
    const operand = this.evaluate(node.operand, environment);
    const test = environment.tests.get(node.test.value);
    if (!test) {
      throw new Error(`Unknown test: ${node.test.value}`);
    }
    const result = test(operand);
    return new BooleanValue(node.negate ? !result : result);
  }
  /**
   * Evaluates expressions following the unary operation type.
   */
  evaluateUnaryExpression(node, environment) {
    const argument = this.evaluate(node.argument, environment);
    switch (node.operator.value) {
      case "not":
        return new BooleanValue(!argument.value);
      default:
        throw new SyntaxError(`Unknown operator: ${node.operator.value}`);
    }
  }
  evalProgram(program, environment) {
    return this.evaluateBlock(program.body, environment);
  }
  evaluateBlock(statements, environment) {
    let result = "";
    for (const statement of statements) {
      const lastEvaluated = this.evaluate(statement, environment);
      if (lastEvaluated.type !== "NullValue" && lastEvaluated.type !== "UndefinedValue") {
        result += lastEvaluated.value;
      }
    }
    return new StringValue(result);
  }
  evaluateIdentifier(node, environment) {
    return environment.lookupVariable(node.value);
  }
  evaluateCallExpression(expr, environment) {
    const args = [];
    const kwargs = /* @__PURE__ */ new Map();
    for (const argument of expr.args) {
      if (argument.type === "KeywordArgumentExpression") {
        const kwarg = argument;
        kwargs.set(kwarg.key.value, this.evaluate(kwarg.value, environment));
      } else {
        args.push(this.evaluate(argument, environment));
      }
    }
    if (kwargs.size > 0) {
      args.push(new ObjectValue(kwargs));
    }
    const fn = this.evaluate(expr.callee, environment);
    if (fn.type !== "FunctionValue") {
      throw new Error(`Cannot call something that is not a function: got ${fn.type}`);
    }
    return fn.value(args, environment);
  }
  evaluateSliceExpression(object, expr, environment) {
    if (!(object instanceof ArrayValue || object instanceof StringValue)) {
      throw new Error("Slice object must be an array or string");
    }
    const start = this.evaluate(expr.start, environment);
    const stop = this.evaluate(expr.stop, environment);
    const step = this.evaluate(expr.step, environment);
    if (!(start instanceof NumericValue || start instanceof UndefinedValue)) {
      throw new Error("Slice start must be numeric or undefined");
    }
    if (!(stop instanceof NumericValue || stop instanceof UndefinedValue)) {
      throw new Error("Slice stop must be numeric or undefined");
    }
    if (!(step instanceof NumericValue || step instanceof UndefinedValue)) {
      throw new Error("Slice step must be numeric or undefined");
    }
    if (object instanceof ArrayValue) {
      return new ArrayValue(slice(object.value, start.value, stop.value, step.value));
    } else {
      return new StringValue(slice(Array.from(object.value), start.value, stop.value, step.value).join(""));
    }
  }
  evaluateMemberExpression(expr, environment) {
    const object = this.evaluate(expr.object, environment);
    let property;
    if (expr.computed) {
      if (expr.property.type === "SliceExpression") {
        return this.evaluateSliceExpression(object, expr.property, environment);
      } else {
        property = this.evaluate(expr.property, environment);
      }
    } else {
      property = new StringValue(expr.property.value);
    }
    let value;
    if (object instanceof ObjectValue) {
      if (!(property instanceof StringValue)) {
        throw new Error(`Cannot access property with non-string: got ${property.type}`);
      }
      value = object.value.get(property.value) ?? object.builtins.get(property.value);
    } else if (object instanceof ArrayValue || object instanceof StringValue) {
      if (property instanceof NumericValue) {
        value = object.value.at(property.value);
        if (object instanceof StringValue) {
          value = new StringValue(object.value.at(property.value));
        }
      } else if (property instanceof StringValue) {
        value = object.builtins.get(property.value);
      } else {
        throw new Error(`Cannot access property with non-string/non-number: got ${property.type}`);
      }
    } else {
      if (!(property instanceof StringValue)) {
        throw new Error(`Cannot access property with non-string: got ${property.type}`);
      }
      value = object.builtins.get(property.value);
    }
    return value instanceof RuntimeValue ? value : new UndefinedValue();
  }
  evaluateSet(node, environment) {
    const rhs = this.evaluate(node.value, environment);
    if (node.assignee.type === "Identifier") {
      const variableName = node.assignee.value;
      environment.setVariable(variableName, rhs);
    } else if (node.assignee.type === "MemberExpression") {
      const member = node.assignee;
      const object = this.evaluate(member.object, environment);
      if (!(object instanceof ObjectValue)) {
        throw new Error("Cannot assign to member of non-object");
      }
      if (member.property.type !== "Identifier") {
        throw new Error("Cannot assign to member with non-identifier property");
      }
      object.value.set(member.property.value, rhs);
    } else {
      throw new Error(`Invalid LHS inside assignment expression: ${JSON.stringify(node.assignee)}`);
    }
    return new NullValue();
  }
  evaluateIf(node, environment) {
    const test = this.evaluate(node.test, environment);
    return this.evaluateBlock(test.__bool__().value ? node.body : node.alternate, environment);
  }
  evaluateFor(node, environment) {
    const scope = new Environment(environment);
    const iterable = this.evaluate(node.iterable, scope);
    if (!(iterable instanceof ArrayValue)) {
      throw new Error(`Expected iterable type in for loop: got ${iterable.type}`);
    }
    let result = "";
    for (let i = 0; i < iterable.value.length; ++i) {
      const loop = /* @__PURE__ */ new Map([
        ["index", new NumericValue(i + 1)],
        ["index0", new NumericValue(i)],
        ["revindex", new NumericValue(iterable.value.length - i)],
        ["revindex0", new NumericValue(iterable.value.length - i - 1)],
        ["first", new BooleanValue(i === 0)],
        ["last", new BooleanValue(i === iterable.value.length - 1)],
        ["length", new NumericValue(iterable.value.length)],
        ["previtem", i > 0 ? iterable.value[i - 1] : new UndefinedValue()],
        ["nextitem", i < iterable.value.length - 1 ? iterable.value[i + 1] : new UndefinedValue()]
      ]);
      scope.setVariable("loop", new ObjectValue(loop));
      const current = iterable.value[i];
      if (node.loopvar.type === "Identifier") {
        scope.setVariable(node.loopvar.value, current);
      } else if (node.loopvar.type === "TupleLiteral") {
        const loopvar = node.loopvar;
        if (current.type !== "ArrayValue") {
          throw new Error(`Cannot unpack non-iterable type: ${current.type}`);
        }
        const c = current;
        if (loopvar.value.length !== c.value.length) {
          throw new Error(`Too ${loopvar.value.length > c.value.length ? "few" : "many"} items to unpack`);
        }
        for (let j = 0; j < loopvar.value.length; ++j) {
          if (loopvar.value[j].type !== "Identifier") {
            throw new Error(`Cannot unpack non-identifier type: ${loopvar.value[j].type}`);
          }
          scope.setVariable(loopvar.value[j].value, c.value[j]);
        }
      }
      const evaluated = this.evaluateBlock(node.body, scope);
      result += evaluated.value;
    }
    return new StringValue(result);
  }
  evaluate(statement, environment) {
    if (statement === void 0)
      return new UndefinedValue();
    switch (statement.type) {
      case "Program":
        return this.evalProgram(statement, environment);
      case "Set":
        return this.evaluateSet(statement, environment);
      case "If":
        return this.evaluateIf(statement, environment);
      case "For":
        return this.evaluateFor(statement, environment);
      case "NumericLiteral":
        return new NumericValue(Number(statement.value));
      case "StringLiteral":
        return new StringValue(statement.value);
      case "BooleanLiteral":
        return new BooleanValue(statement.value);
      case "ArrayLiteral":
        return new ArrayValue(statement.value.map((x) => this.evaluate(x, environment)));
      case "TupleLiteral":
        return new TupleValue(statement.value.map((x) => this.evaluate(x, environment)));
      case "ObjectLiteral": {
        const mapping = /* @__PURE__ */ new Map();
        for (const [key, value] of statement.value) {
          const evaluatedKey = this.evaluate(key, environment);
          if (!(evaluatedKey instanceof StringValue)) {
            throw new Error(`Object keys must be strings: got ${evaluatedKey.type}`);
          }
          mapping.set(evaluatedKey.value, this.evaluate(value, environment));
        }
        return new ObjectValue(mapping);
      }
      case "Identifier":
        return this.evaluateIdentifier(statement, environment);
      case "CallExpression":
        return this.evaluateCallExpression(statement, environment);
      case "MemberExpression":
        return this.evaluateMemberExpression(statement, environment);
      case "UnaryExpression":
        return this.evaluateUnaryExpression(statement, environment);
      case "BinaryExpression":
        return this.evaluateBinaryExpression(statement, environment);
      case "FilterExpression":
        return this.evaluateFilterExpression(statement, environment);
      case "TestExpression":
        return this.evaluateTestExpression(statement, environment);
      default:
        throw new SyntaxError(`Unknown node type: ${statement.type}`);
    }
  }
};
function convertToRuntimeValues(input) {
  switch (typeof input) {
    case "number":
      return new NumericValue(input);
    case "string":
      return new StringValue(input);
    case "boolean":
      return new BooleanValue(input);
    case "object":
      if (input === null) {
        return new NullValue();
      } else if (Array.isArray(input)) {
        return new ArrayValue(input.map(convertToRuntimeValues));
      } else {
        return new ObjectValue(
          new Map(Object.entries(input).map(([key, value]) => [key, convertToRuntimeValues(value)]))
        );
      }
    case "function":
      return new FunctionValue((args, _scope) => {
        const result = input(...args.map((x) => x.value)) ?? null;
        return convertToRuntimeValues(result);
      });
    default:
      throw new Error(`Cannot convert to runtime value: ${input}`);
  }
}

// src/index.ts
var Template = class {
  parsed;
  /**
   * @param {string} template The template string
   */
  constructor(template) {
    const tokens = tokenize(template, {
      lstrip_blocks: true,
      trim_blocks: true
    });
    this.parsed = parse(tokens);
  }
  render(items) {
    const env = new Environment();
    env.set("false", false);
    env.set("true", true);
    env.set("raise_exception", (args) => {
      throw new Error(args);
    });
    env.set("range", range);
    for (const [key, value] of Object.entries(items)) {
      env.set(key, value);
    }
    const interpreter = new Interpreter(env);
    const result = interpreter.run(this.parsed);
    return result.value;
  }
};



/***/ }),

/***/ 9358:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
var onnxruntime_node__WEBPACK_IMPORTED_MODULE_0___namespace_cache;
var onnxruntime_web__WEBPACK_IMPORTED_MODULE_1___namespace_cache;
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "V": function() { return /* binding */ ONNX; },
/* harmony export */   "p": function() { return /* binding */ executionProviders; }
/* harmony export */ });
/* harmony import */ var onnxruntime_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5079);
/* harmony import */ var onnxruntime_web__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7950);
/* provided dependency */ var process = __webpack_require__(3656);
/**
 * @file Handler file for choosing the correct version of ONNX Runtime, based on the environment.
 * Ideally, we could import the `onnxruntime-web` and `onnxruntime-node` packages only when needed,
 * but dynamic imports don't seem to work with the current webpack version and/or configuration.
 * This is possibly due to the experimental nature of top-level await statements.
 * So, we just import both packages, and use the appropriate one based on the environment:
 *   - When running in node, we use `onnxruntime-node`.
 *   - When running in the browser, we use `onnxruntime-web` (`onnxruntime-node` is not bundled).
 * 
 * This module is not directly exported, but can be accessed through the environment variables:
 * ```javascript
 * import { env } from '@xenova/transformers';
 * console.log(env.backends.onnx);
 * ```
 * 
 * @module backends/onnx
 */

// NOTE: Import order matters here. We need to import `onnxruntime-node` before `onnxruntime-web`.
// In either case, we select the default export if it exists, otherwise we use the named export.



/** @type {import('onnxruntime-web')} The ONNX runtime module. */
let ONNX;

const executionProviders = [
    // 'webgpu',
    'wasm'
];

if (typeof process !== 'undefined' && process?.release?.name === 'node') {
    // Running in a node-like environment.
    ONNX = onnxruntime_node__WEBPACK_IMPORTED_MODULE_0__ ?? /*#__PURE__*/ (onnxruntime_node__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (onnxruntime_node__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(onnxruntime_node__WEBPACK_IMPORTED_MODULE_0__, 2)));

    // Add `cpu` execution provider, with higher precedence that `wasm`.
    executionProviders.unshift('cpu');

} else {
    // Running in a browser-environment
    ONNX = onnxruntime_web__WEBPACK_IMPORTED_MODULE_1__ ?? /*#__PURE__*/ (onnxruntime_web__WEBPACK_IMPORTED_MODULE_1___namespace_cache || (onnxruntime_web__WEBPACK_IMPORTED_MODULE_1___namespace_cache = __webpack_require__.t(onnxruntime_web__WEBPACK_IMPORTED_MODULE_1__, 2)));

    // SIMD for WebAssembly does not operate correctly in some recent versions of iOS (16.4.x).
    // As a temporary fix, we disable it for now.
    // For more information, see: https://github.com/microsoft/onnxruntime/issues/15644
    const isIOS = typeof navigator !== 'undefined' && /iP(hone|od|ad).+16_4.+AppleWebKit/.test(navigator.userAgent);
    if (isIOS) {
        ONNX.env.wasm.simd = false;
    }
}


/***/ }),

/***/ 8958:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "D": function() { return /* binding */ PretrainedConfig; },
/* harmony export */   "z": function() { return /* binding */ AutoConfig; }
/* harmony export */ });
/* harmony import */ var _utils_hub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2023);

/**
 * @file Helper module for using model configs. For more information, see the corresponding
 * [Python documentation](https://huggingface.co/docs/transformers/main/en/model_doc/auto#transformers.AutoConfig).
 * 
 * **Example:** Load an `AutoConfig`.
 * 
 * ```javascript
 * import { AutoConfig } from '@xenova/transformers';
 * let config = await AutoConfig.from_pretrained('bert-base-uncased');
 * console.log(config);
 * // PretrainedConfig {
 * //   "model_type": "bert",
 * //   "is_encoder_decoder": false,
 * //   "architectures": [
 * //       "BertForMaskedLM"
 * //   ],
 * //   "vocab_size": 30522
 * //   "num_attention_heads": 12,
 * //   "num_hidden_layers": 12,
 * //   "hidden_size": 768,
 * //   "max_position_embeddings": 512,
 * //   ...
 * // }
 * ```
 * 
 * @module configs
 */



/**
 * @typedef {import('./utils/hub.js').PretrainedOptions} PretrainedOptions
 */


/**
 * Loads a config from the specified path.
 * @param {string} pretrained_model_name_or_path The path to the config directory.
 * @param {PretrainedOptions} options Additional options for loading the config.
 * @returns {Promise<Array>} A promise that resolves with information about the loaded config.
 */
async function loadConfig(pretrained_model_name_or_path, options) {
    let info = await (0,_utils_hub_js__WEBPACK_IMPORTED_MODULE_0__/* .getModelJSON */ .yM)(pretrained_model_name_or_path, 'config.json', true, options);
    return info;
}

/**
 * Base class for all configuration classes. For more information, see the corresponding
 * [Python documentation](https://huggingface.co/docs/transformers/main/en/main_classes/configuration#transformers.PretrainedConfig).
 */
class PretrainedConfig {
    // NOTE: Typo in original

    /**
     * Create a new PreTrainedTokenizer instance.
     * @param {Object} configJSON The JSON of the config.
     */
    constructor(configJSON) {
        this.model_type = null;
        this.is_encoder_decoder = false;

        Object.assign(this, configJSON);
    }

    /**
     * Loads a pre-trained config from the given `pretrained_model_name_or_path`. 
     * 
     * @param {string} pretrained_model_name_or_path The path to the pre-trained config.
     * @param {PretrainedOptions} options Additional options for loading the config.
     * @throws {Error} Throws an error if the config.json is not found in the `pretrained_model_name_or_path`.
     * 
     * @returns {Promise<PretrainedConfig>} A new instance of the `PretrainedConfig` class.
     */
    static async from_pretrained(pretrained_model_name_or_path, {
        progress_callback = null,
        config = null,
        cache_dir = null,
        local_files_only = false,
        revision = 'main',
    } = {}) {

        let data = config ?? await loadConfig(pretrained_model_name_or_path, {
            progress_callback,
            config,
            cache_dir,
            local_files_only,
            revision,
        })
        return new this(data);
    }
}

/**
 * Helper class which is used to instantiate pretrained configs with the `from_pretrained` function.
 * 
 * @example
 * let config = await AutoConfig.from_pretrained('bert-base-uncased'); 
 */
class AutoConfig {
    /** @type {PretrainedConfig.from_pretrained} */
    static async from_pretrained(...args) {
        return PretrainedConfig.from_pretrained(...args);
    }
}


/***/ }),

/***/ 157:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "O": function() { return /* binding */ env; }
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5592);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2658);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8567);
/* harmony import */ var _backends_onnx_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9358);
/**
 * @file Module used to configure Transformers.js.
 * 
 * **Example:** Disable remote models.
 * ```javascript
 * import { env } from '@xenova/transformers';
 * env.allowRemoteModels = false;
 * ```
 * 
 * **Example:** Set local model path.
 * ```javascript
 * import { env } from '@xenova/transformers';
 * env.localModelPath = '/path/to/local/models/';
 * ```
 * 
 * **Example:** Set cache directory.
 * ```javascript
 * import { env } from '@xenova/transformers';
 * env.cacheDir = '/path/to/cache/directory/';
 * ```
 * 
 * @module env
 */






const { env: onnx_env } = _backends_onnx_js__WEBPACK_IMPORTED_MODULE_3__/* .ONNX */ .V;

const VERSION = '2.17.2';

// Check if various APIs are available (depends on environment)
const WEB_CACHE_AVAILABLE = typeof self !== 'undefined' && 'caches' in self;
const FS_AVAILABLE = !isEmpty(fs__WEBPACK_IMPORTED_MODULE_0__); // check if file system is available
const PATH_AVAILABLE = !isEmpty(path__WEBPACK_IMPORTED_MODULE_1__); // check if path is available

const RUNNING_LOCALLY = FS_AVAILABLE && PATH_AVAILABLE;

const __dirname = RUNNING_LOCALLY
    ? path__WEBPACK_IMPORTED_MODULE_1__.dirname(path__WEBPACK_IMPORTED_MODULE_1__.dirname(url__WEBPACK_IMPORTED_MODULE_2__.fileURLToPath("file:///home/runner/work/Lumen-Read/Lumen-Read/node_modules/.pnpm/@xenova+transformers@2.17.2/node_modules/@xenova/transformers/src/env.js")))
    : './';

// Only used for environments with access to file system
const DEFAULT_CACHE_DIR = RUNNING_LOCALLY
    ? path__WEBPACK_IMPORTED_MODULE_1__.join(__dirname, '/.cache/')
    : null;

// Set local model path, based on available APIs
const DEFAULT_LOCAL_MODEL_PATH = '/models/';
const localModelPath = RUNNING_LOCALLY
    ? path__WEBPACK_IMPORTED_MODULE_1__.join(__dirname, DEFAULT_LOCAL_MODEL_PATH)
    : DEFAULT_LOCAL_MODEL_PATH;

if (onnx_env?.wasm) {
    // Set path to wasm files. This is needed when running in a web worker.
    // https://onnxruntime.ai/docs/api/js/interfaces/Env.WebAssemblyFlags.html#wasmPaths
    // We use remote wasm files by default to make it easier for newer users.
    // In practice, users should probably self-host the necessary .wasm files.
    onnx_env.wasm.wasmPaths = RUNNING_LOCALLY
        ? path__WEBPACK_IMPORTED_MODULE_1__.join(__dirname, '/dist/')
        : `https://cdn.jsdelivr.net/npm/@xenova/transformers@${VERSION}/dist/`;
}

/**
 * Global variable used to control execution. This provides users a simple way to configure Transformers.js.
 * @property {Object} backends Expose environment variables of different backends,
 * allowing users to set these variables if they want to.
 * @property {string} __dirname Directory name of module. Useful for resolving local paths.
 * @property {string} version This version of Transformers.js.
 * @property {boolean} allowRemoteModels Whether to allow loading of remote files, defaults to `true`.
 * If set to `false`, it will have the same effect as setting `local_files_only=true` when loading pipelines, models, tokenizers, processors, etc.
 * @property {string} remoteHost Host URL to load models from. Defaults to the Hugging Face Hub.
 * @property {string} remotePathTemplate Path template to fill in and append to `remoteHost` when loading models.
 * @property {boolean} allowLocalModels Whether to allow loading of local files, defaults to `true`.
 * If set to `false`, it will skip the local file check and try to load the model from the remote host.
 * @property {string} localModelPath Path to load local models from. Defaults to `/models/`.
 * @property {boolean} useFS Whether to use the file system to load files. By default, it is `true` if available.
 * @property {boolean} useBrowserCache Whether to use Cache API to cache models. By default, it is `true` if available.
 * @property {boolean} useFSCache Whether to use the file system to cache files. By default, it is `true` if available.
 * @property {string} cacheDir The directory to use for caching files with the file system. By default, it is `./.cache`.
 * @property {boolean} useCustomCache Whether to use a custom cache system (defined by `customCache`), defaults to `false`.
 * @property {Object} customCache The custom cache to use. Defaults to `null`. Note: this must be an object which
 * implements the `match` and `put` functions of the Web Cache API. For more information, see https://developer.mozilla.org/en-US/docs/Web/API/Cache
 */
const env = {
    /////////////////// Backends settings ///////////////////
    backends: {
        // onnxruntime-web/onnxruntime-node
        onnx: onnx_env,

        // TensorFlow.js
        tfjs: {},
    },

    __dirname,
    version: VERSION,

    /////////////////// Model settings ///////////////////
    allowRemoteModels: true,
    remoteHost: 'https://huggingface.co/',
    remotePathTemplate: '{model}/resolve/{revision}/',

    allowLocalModels: true,
    localModelPath: localModelPath,
    useFS: FS_AVAILABLE,

    /////////////////// Cache settings ///////////////////
    useBrowserCache: WEB_CACHE_AVAILABLE,

    useFSCache: FS_AVAILABLE,
    cacheDir: DEFAULT_CACHE_DIR,

    useCustomCache: false,
    customCache: null,
    //////////////////////////////////////////////////////
}


/**
 * @param {Object} obj
 * @private
 */
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}



/***/ }),

/***/ 1693:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ASTFeatureExtractor": function() { return /* reexport */ ASTFeatureExtractor; },
  "ASTForAudioClassification": function() { return /* reexport */ models/* ASTForAudioClassification */.vJG; },
  "ASTModel": function() { return /* reexport */ models/* ASTModel */.BAR; },
  "ASTPreTrainedModel": function() { return /* reexport */ models/* ASTPreTrainedModel */.m9r; },
  "AlbertForMaskedLM": function() { return /* reexport */ models/* AlbertForMaskedLM */.sQR; },
  "AlbertForQuestionAnswering": function() { return /* reexport */ models/* AlbertForQuestionAnswering */.fon; },
  "AlbertForSequenceClassification": function() { return /* reexport */ models/* AlbertForSequenceClassification */.VN0; },
  "AlbertModel": function() { return /* reexport */ models/* AlbertModel */.Son; },
  "AlbertPreTrainedModel": function() { return /* reexport */ models/* AlbertPreTrainedModel */.NYs; },
  "AlbertTokenizer": function() { return /* reexport */ tokenizers/* AlbertTokenizer */.tu; },
  "AudioClassificationPipeline": function() { return /* reexport */ AudioClassificationPipeline; },
  "AutoConfig": function() { return /* reexport */ configs/* AutoConfig */.z; },
  "AutoModel": function() { return /* reexport */ models/* AutoModel */.$Sz; },
  "AutoModelForAudioClassification": function() { return /* reexport */ models/* AutoModelForAudioClassification */.K2m; },
  "AutoModelForAudioFrameClassification": function() { return /* reexport */ models/* AutoModelForAudioFrameClassification */.qxW; },
  "AutoModelForCTC": function() { return /* reexport */ models/* AutoModelForCTC */.ENH; },
  "AutoModelForCausalLM": function() { return /* reexport */ models/* AutoModelForCausalLM */.Hqk; },
  "AutoModelForDepthEstimation": function() { return /* reexport */ models/* AutoModelForDepthEstimation */.hY6; },
  "AutoModelForDocumentQuestionAnswering": function() { return /* reexport */ models/* AutoModelForDocumentQuestionAnswering */.DcG; },
  "AutoModelForImageClassification": function() { return /* reexport */ models/* AutoModelForImageClassification */.En$; },
  "AutoModelForImageFeatureExtraction": function() { return /* reexport */ models/* AutoModelForImageFeatureExtraction */.IFL; },
  "AutoModelForImageMatting": function() { return /* reexport */ models/* AutoModelForImageMatting */.pTY; },
  "AutoModelForImageSegmentation": function() { return /* reexport */ models/* AutoModelForImageSegmentation */.U$$; },
  "AutoModelForImageToImage": function() { return /* reexport */ models/* AutoModelForImageToImage */.S2d; },
  "AutoModelForMaskGeneration": function() { return /* reexport */ models/* AutoModelForMaskGeneration */.EGs; },
  "AutoModelForMaskedLM": function() { return /* reexport */ models/* AutoModelForMaskedLM */.t78; },
  "AutoModelForObjectDetection": function() { return /* reexport */ models/* AutoModelForObjectDetection */.Zn; },
  "AutoModelForQuestionAnswering": function() { return /* reexport */ models/* AutoModelForQuestionAnswering */.wiU; },
  "AutoModelForSemanticSegmentation": function() { return /* reexport */ models/* AutoModelForSemanticSegmentation */.$Bv; },
  "AutoModelForSeq2SeqLM": function() { return /* reexport */ models/* AutoModelForSeq2SeqLM */.Kf0; },
  "AutoModelForSequenceClassification": function() { return /* reexport */ models/* AutoModelForSequenceClassification */.o$X; },
  "AutoModelForSpeechSeq2Seq": function() { return /* reexport */ models/* AutoModelForSpeechSeq2Seq */.hZO; },
  "AutoModelForTextToSpectrogram": function() { return /* reexport */ models/* AutoModelForTextToSpectrogram */.lbf; },
  "AutoModelForTextToWaveform": function() { return /* reexport */ models/* AutoModelForTextToWaveform */.z6E; },
  "AutoModelForTokenClassification": function() { return /* reexport */ models/* AutoModelForTokenClassification */.OjJ; },
  "AutoModelForVision2Seq": function() { return /* reexport */ models/* AutoModelForVision2Seq */.tLj; },
  "AutoModelForXVector": function() { return /* reexport */ models/* AutoModelForXVector */.Sjl; },
  "AutoModelForZeroShotObjectDetection": function() { return /* reexport */ models/* AutoModelForZeroShotObjectDetection */.LdW; },
  "AutoProcessor": function() { return /* reexport */ AutoProcessor; },
  "AutoTokenizer": function() { return /* reexport */ tokenizers/* AutoTokenizer */.t2; },
  "AutomaticSpeechRecognitionPipeline": function() { return /* reexport */ AutomaticSpeechRecognitionPipeline; },
  "BartForConditionalGeneration": function() { return /* reexport */ models/* BartForConditionalGeneration */.AfG; },
  "BartForSequenceClassification": function() { return /* reexport */ models/* BartForSequenceClassification */.tvh; },
  "BartModel": function() { return /* reexport */ models/* BartModel */.l4I; },
  "BartPretrainedModel": function() { return /* reexport */ models/* BartPretrainedModel */.hNz; },
  "BartTokenizer": function() { return /* reexport */ tokenizers/* BartTokenizer */.yT; },
  "BaseModelOutput": function() { return /* reexport */ models/* BaseModelOutput */.ygE; },
  "BeitFeatureExtractor": function() { return /* reexport */ BeitFeatureExtractor; },
  "BeitForImageClassification": function() { return /* reexport */ models/* BeitForImageClassification */.MO; },
  "BeitModel": function() { return /* reexport */ models/* BeitModel */.iBL; },
  "BeitPreTrainedModel": function() { return /* reexport */ models/* BeitPreTrainedModel */.doG; },
  "BertForMaskedLM": function() { return /* reexport */ models/* BertForMaskedLM */.ATo; },
  "BertForQuestionAnswering": function() { return /* reexport */ models/* BertForQuestionAnswering */.goF; },
  "BertForSequenceClassification": function() { return /* reexport */ models/* BertForSequenceClassification */.a0H; },
  "BertForTokenClassification": function() { return /* reexport */ models/* BertForTokenClassification */.oa3; },
  "BertModel": function() { return /* reexport */ models/* BertModel */.XR2; },
  "BertPreTrainedModel": function() { return /* reexport */ models/* BertPreTrainedModel */.Xp9; },
  "BertTokenizer": function() { return /* reexport */ tokenizers/* BertTokenizer */.Qy; },
  "BitImageProcessor": function() { return /* reexport */ BitImageProcessor; },
  "BlenderbotForConditionalGeneration": function() { return /* reexport */ models/* BlenderbotForConditionalGeneration */.ea7; },
  "BlenderbotModel": function() { return /* reexport */ models/* BlenderbotModel */.$zC; },
  "BlenderbotPreTrainedModel": function() { return /* reexport */ models/* BlenderbotPreTrainedModel */.YQv; },
  "BlenderbotSmallForConditionalGeneration": function() { return /* reexport */ models/* BlenderbotSmallForConditionalGeneration */.bGu; },
  "BlenderbotSmallModel": function() { return /* reexport */ models/* BlenderbotSmallModel */.rCE; },
  "BlenderbotSmallPreTrainedModel": function() { return /* reexport */ models/* BlenderbotSmallPreTrainedModel */.FDW; },
  "BlenderbotSmallTokenizer": function() { return /* reexport */ tokenizers/* BlenderbotSmallTokenizer */.L4; },
  "BlenderbotTokenizer": function() { return /* reexport */ tokenizers/* BlenderbotTokenizer */.vo; },
  "BloomForCausalLM": function() { return /* reexport */ models/* BloomForCausalLM */.d9Y; },
  "BloomModel": function() { return /* reexport */ models/* BloomModel */.VEm; },
  "BloomPreTrainedModel": function() { return /* reexport */ models/* BloomPreTrainedModel */.dNl; },
  "BloomTokenizer": function() { return /* reexport */ tokenizers/* BloomTokenizer */.ot; },
  "CLIPFeatureExtractor": function() { return /* reexport */ CLIPFeatureExtractor; },
  "CLIPModel": function() { return /* reexport */ models/* CLIPModel */.mFG; },
  "CLIPPreTrainedModel": function() { return /* reexport */ models/* CLIPPreTrainedModel */.pct; },
  "CLIPSegForImageSegmentation": function() { return /* reexport */ models/* CLIPSegForImageSegmentation */.gfN; },
  "CLIPSegModel": function() { return /* reexport */ models/* CLIPSegModel */.ONK; },
  "CLIPSegPreTrainedModel": function() { return /* reexport */ models/* CLIPSegPreTrainedModel */.bAW; },
  "CLIPTextModelWithProjection": function() { return /* reexport */ models/* CLIPTextModelWithProjection */.v3$; },
  "CLIPTokenizer": function() { return /* reexport */ tokenizers/* CLIPTokenizer */.aT; },
  "CLIPVisionModelWithProjection": function() { return /* reexport */ models/* CLIPVisionModelWithProjection */.rhz; },
  "CamembertForMaskedLM": function() { return /* reexport */ models/* CamembertForMaskedLM */.ZRy; },
  "CamembertForQuestionAnswering": function() { return /* reexport */ models/* CamembertForQuestionAnswering */.J1v; },
  "CamembertForSequenceClassification": function() { return /* reexport */ models/* CamembertForSequenceClassification */.zPS; },
  "CamembertForTokenClassification": function() { return /* reexport */ models/* CamembertForTokenClassification */.tnS; },
  "CamembertModel": function() { return /* reexport */ models/* CamembertModel */.jG9; },
  "CamembertPreTrainedModel": function() { return /* reexport */ models/* CamembertPreTrainedModel */.rRW; },
  "CamembertTokenizer": function() { return /* reexport */ tokenizers/* CamembertTokenizer */.m7; },
  "CausalLMOutput": function() { return /* reexport */ models/* CausalLMOutput */.f9F; },
  "CausalLMOutputWithPast": function() { return /* reexport */ models/* CausalLMOutputWithPast */.okh; },
  "ChineseCLIPFeatureExtractor": function() { return /* reexport */ ChineseCLIPFeatureExtractor; },
  "ChineseCLIPModel": function() { return /* reexport */ models/* ChineseCLIPModel */.Y5j; },
  "ChineseCLIPPreTrainedModel": function() { return /* reexport */ models/* ChineseCLIPPreTrainedModel */.$3J; },
  "ClapAudioModelWithProjection": function() { return /* reexport */ models/* ClapAudioModelWithProjection */.zvp; },
  "ClapFeatureExtractor": function() { return /* reexport */ ClapFeatureExtractor; },
  "ClapModel": function() { return /* reexport */ models/* ClapModel */.A6f; },
  "ClapPreTrainedModel": function() { return /* reexport */ models/* ClapPreTrainedModel */.LB1; },
  "ClapTextModelWithProjection": function() { return /* reexport */ models/* ClapTextModelWithProjection */.tbw; },
  "CodeGenForCausalLM": function() { return /* reexport */ models/* CodeGenForCausalLM */.ldC; },
  "CodeGenModel": function() { return /* reexport */ models/* CodeGenModel */.Pkw; },
  "CodeGenPreTrainedModel": function() { return /* reexport */ models/* CodeGenPreTrainedModel */.r9p; },
  "CodeGenTokenizer": function() { return /* reexport */ tokenizers/* CodeGenTokenizer */.mi; },
  "CodeLlamaTokenizer": function() { return /* reexport */ tokenizers/* CodeLlamaTokenizer */.Xc; },
  "CohereTokenizer": function() { return /* reexport */ tokenizers/* CohereTokenizer */.a7; },
  "ConvBertForMaskedLM": function() { return /* reexport */ models/* ConvBertForMaskedLM */.dkn; },
  "ConvBertForQuestionAnswering": function() { return /* reexport */ models/* ConvBertForQuestionAnswering */.Fx7; },
  "ConvBertForSequenceClassification": function() { return /* reexport */ models/* ConvBertForSequenceClassification */.ypw; },
  "ConvBertForTokenClassification": function() { return /* reexport */ models/* ConvBertForTokenClassification */.fiz; },
  "ConvBertModel": function() { return /* reexport */ models/* ConvBertModel */.teE; },
  "ConvBertPreTrainedModel": function() { return /* reexport */ models/* ConvBertPreTrainedModel */.TmS; },
  "ConvBertTokenizer": function() { return /* reexport */ tokenizers/* ConvBertTokenizer */.vP; },
  "ConvNextFeatureExtractor": function() { return /* reexport */ ConvNextFeatureExtractor; },
  "ConvNextForImageClassification": function() { return /* reexport */ models/* ConvNextForImageClassification */.nlm; },
  "ConvNextImageProcessor": function() { return /* reexport */ ConvNextImageProcessor; },
  "ConvNextModel": function() { return /* reexport */ models/* ConvNextModel */.oHn; },
  "ConvNextPreTrainedModel": function() { return /* reexport */ models/* ConvNextPreTrainedModel */.OWw; },
  "ConvNextV2ForImageClassification": function() { return /* reexport */ models/* ConvNextV2ForImageClassification */.Tmp; },
  "ConvNextV2Model": function() { return /* reexport */ models/* ConvNextV2Model */.yxe; },
  "ConvNextV2PreTrainedModel": function() { return /* reexport */ models/* ConvNextV2PreTrainedModel */.M$7; },
  "DPTFeatureExtractor": function() { return /* reexport */ DPTFeatureExtractor; },
  "DPTForDepthEstimation": function() { return /* reexport */ models/* DPTForDepthEstimation */.RqD; },
  "DPTImageProcessor": function() { return /* reexport */ DPTImageProcessor; },
  "DPTModel": function() { return /* reexport */ models/* DPTModel */.HIB; },
  "DPTPreTrainedModel": function() { return /* reexport */ models/* DPTPreTrainedModel */.HO_; },
  "DebertaForMaskedLM": function() { return /* reexport */ models/* DebertaForMaskedLM */.j0K; },
  "DebertaForQuestionAnswering": function() { return /* reexport */ models/* DebertaForQuestionAnswering */.CSL; },
  "DebertaForSequenceClassification": function() { return /* reexport */ models/* DebertaForSequenceClassification */.RCi; },
  "DebertaForTokenClassification": function() { return /* reexport */ models/* DebertaForTokenClassification */.sgd; },
  "DebertaModel": function() { return /* reexport */ models/* DebertaModel */.ZQh; },
  "DebertaPreTrainedModel": function() { return /* reexport */ models/* DebertaPreTrainedModel */.Ifx; },
  "DebertaTokenizer": function() { return /* reexport */ tokenizers/* DebertaTokenizer */.iH; },
  "DebertaV2ForMaskedLM": function() { return /* reexport */ models/* DebertaV2ForMaskedLM */.BUf; },
  "DebertaV2ForQuestionAnswering": function() { return /* reexport */ models/* DebertaV2ForQuestionAnswering */.W57; },
  "DebertaV2ForSequenceClassification": function() { return /* reexport */ models/* DebertaV2ForSequenceClassification */.jf9; },
  "DebertaV2ForTokenClassification": function() { return /* reexport */ models/* DebertaV2ForTokenClassification */.mbT; },
  "DebertaV2Model": function() { return /* reexport */ models/* DebertaV2Model */.Kqx; },
  "DebertaV2PreTrainedModel": function() { return /* reexport */ models/* DebertaV2PreTrainedModel */.XiS; },
  "DebertaV2Tokenizer": function() { return /* reexport */ tokenizers/* DebertaV2Tokenizer */.KL; },
  "DeiTFeatureExtractor": function() { return /* reexport */ DeiTFeatureExtractor; },
  "DeiTForImageClassification": function() { return /* reexport */ models/* DeiTForImageClassification */.OHg; },
  "DeiTModel": function() { return /* reexport */ models/* DeiTModel */.Zvm; },
  "DeiTPreTrainedModel": function() { return /* reexport */ models/* DeiTPreTrainedModel */.LUG; },
  "DepthAnythingForDepthEstimation": function() { return /* reexport */ models/* DepthAnythingForDepthEstimation */.BFw; },
  "DepthAnythingPreTrainedModel": function() { return /* reexport */ models/* DepthAnythingPreTrainedModel */.R5h; },
  "DepthEstimationPipeline": function() { return /* reexport */ DepthEstimationPipeline; },
  "DetrFeatureExtractor": function() { return /* reexport */ DetrFeatureExtractor; },
  "DetrForObjectDetection": function() { return /* reexport */ models/* DetrForObjectDetection */.zxW; },
  "DetrForSegmentation": function() { return /* reexport */ models/* DetrForSegmentation */.OdO; },
  "DetrModel": function() { return /* reexport */ models/* DetrModel */.mUC; },
  "DetrObjectDetectionOutput": function() { return /* reexport */ models/* DetrObjectDetectionOutput */.sld; },
  "DetrPreTrainedModel": function() { return /* reexport */ models/* DetrPreTrainedModel */.y8o; },
  "DetrSegmentationOutput": function() { return /* reexport */ models/* DetrSegmentationOutput */.IZd; },
  "Dinov2ForImageClassification": function() { return /* reexport */ models/* Dinov2ForImageClassification */.OZ1; },
  "Dinov2Model": function() { return /* reexport */ models/* Dinov2Model */.fpK; },
  "Dinov2PreTrainedModel": function() { return /* reexport */ models/* Dinov2PreTrainedModel */.oUt; },
  "DistilBertForMaskedLM": function() { return /* reexport */ models/* DistilBertForMaskedLM */.Kgc; },
  "DistilBertForQuestionAnswering": function() { return /* reexport */ models/* DistilBertForQuestionAnswering */.gyp; },
  "DistilBertForSequenceClassification": function() { return /* reexport */ models/* DistilBertForSequenceClassification */.RtS; },
  "DistilBertForTokenClassification": function() { return /* reexport */ models/* DistilBertForTokenClassification */.bkG; },
  "DistilBertModel": function() { return /* reexport */ models/* DistilBertModel */.pc$; },
  "DistilBertPreTrainedModel": function() { return /* reexport */ models/* DistilBertPreTrainedModel */.MSH; },
  "DistilBertTokenizer": function() { return /* reexport */ tokenizers/* DistilBertTokenizer */.Po; },
  "DocumentQuestionAnsweringPipeline": function() { return /* reexport */ DocumentQuestionAnsweringPipeline; },
  "DonutFeatureExtractor": function() { return /* reexport */ DonutFeatureExtractor; },
  "DonutSwinModel": function() { return /* reexport */ models/* DonutSwinModel */.B4n; },
  "DonutSwinPreTrainedModel": function() { return /* reexport */ models/* DonutSwinPreTrainedModel */.DZJ; },
  "EfficientNetForImageClassification": function() { return /* reexport */ models/* EfficientNetForImageClassification */.jM; },
  "EfficientNetImageProcessor": function() { return /* reexport */ EfficientNetImageProcessor; },
  "EfficientNetModel": function() { return /* reexport */ models/* EfficientNetModel */.RwB; },
  "EfficientNetPreTrainedModel": function() { return /* reexport */ models/* EfficientNetPreTrainedModel */.KVf; },
  "ElectraForMaskedLM": function() { return /* reexport */ models/* ElectraForMaskedLM */.LCU; },
  "ElectraForQuestionAnswering": function() { return /* reexport */ models/* ElectraForQuestionAnswering */.GPZ; },
  "ElectraForSequenceClassification": function() { return /* reexport */ models/* ElectraForSequenceClassification */.hmo; },
  "ElectraForTokenClassification": function() { return /* reexport */ models/* ElectraForTokenClassification */.q8P; },
  "ElectraModel": function() { return /* reexport */ models/* ElectraModel */.i96; },
  "ElectraPreTrainedModel": function() { return /* reexport */ models/* ElectraPreTrainedModel */.NlR; },
  "ElectraTokenizer": function() { return /* reexport */ tokenizers/* ElectraTokenizer */.jJ; },
  "EsmForMaskedLM": function() { return /* reexport */ models/* EsmForMaskedLM */.cvB; },
  "EsmForSequenceClassification": function() { return /* reexport */ models/* EsmForSequenceClassification */.v08; },
  "EsmForTokenClassification": function() { return /* reexport */ models/* EsmForTokenClassification */.KW9; },
  "EsmModel": function() { return /* reexport */ models/* EsmModel */.$qt; },
  "EsmPreTrainedModel": function() { return /* reexport */ models/* EsmPreTrainedModel */.Osz; },
  "EsmTokenizer": function() { return /* reexport */ tokenizers/* EsmTokenizer */.k8; },
  "FFT": function() { return /* reexport */ maths/* FFT */.vw; },
  "FalconForCausalLM": function() { return /* reexport */ models/* FalconForCausalLM */.tQ_; },
  "FalconModel": function() { return /* reexport */ models/* FalconModel */.QN7; },
  "FalconPreTrainedModel": function() { return /* reexport */ models/* FalconPreTrainedModel */.n_h; },
  "FalconTokenizer": function() { return /* reexport */ tokenizers/* FalconTokenizer */.F4; },
  "FastViTForImageClassification": function() { return /* reexport */ models/* FastViTForImageClassification */.zZI; },
  "FastViTModel": function() { return /* reexport */ models/* FastViTModel */.XKJ; },
  "FastViTPreTrainedModel": function() { return /* reexport */ models/* FastViTPreTrainedModel */.SG6; },
  "FeatureExtractionPipeline": function() { return /* reexport */ FeatureExtractionPipeline; },
  "FeatureExtractor": function() { return /* reexport */ FeatureExtractor; },
  "FillMaskPipeline": function() { return /* reexport */ FillMaskPipeline; },
  "GLPNFeatureExtractor": function() { return /* reexport */ GLPNFeatureExtractor; },
  "GLPNForDepthEstimation": function() { return /* reexport */ models/* GLPNForDepthEstimation */.Psc; },
  "GLPNModel": function() { return /* reexport */ models/* GLPNModel */.Vu2; },
  "GLPNPreTrainedModel": function() { return /* reexport */ models/* GLPNPreTrainedModel */.yiZ; },
  "GPT2LMHeadModel": function() { return /* reexport */ models/* GPT2LMHeadModel */.Say; },
  "GPT2Model": function() { return /* reexport */ models/* GPT2Model */.RHF; },
  "GPT2PreTrainedModel": function() { return /* reexport */ models/* GPT2PreTrainedModel */.OIe; },
  "GPT2Tokenizer": function() { return /* reexport */ tokenizers/* GPT2Tokenizer */.aX; },
  "GPTBigCodeForCausalLM": function() { return /* reexport */ models/* GPTBigCodeForCausalLM */.iQg; },
  "GPTBigCodeModel": function() { return /* reexport */ models/* GPTBigCodeModel */.fqS; },
  "GPTBigCodePreTrainedModel": function() { return /* reexport */ models/* GPTBigCodePreTrainedModel */.Mi1; },
  "GPTJForCausalLM": function() { return /* reexport */ models/* GPTJForCausalLM */.b4r; },
  "GPTJModel": function() { return /* reexport */ models/* GPTJModel */.GW7; },
  "GPTJPreTrainedModel": function() { return /* reexport */ models/* GPTJPreTrainedModel */.CDp; },
  "GPTNeoForCausalLM": function() { return /* reexport */ models/* GPTNeoForCausalLM */.nrk; },
  "GPTNeoModel": function() { return /* reexport */ models/* GPTNeoModel */.CFl; },
  "GPTNeoPreTrainedModel": function() { return /* reexport */ models/* GPTNeoPreTrainedModel */.u1H; },
  "GPTNeoXForCausalLM": function() { return /* reexport */ models/* GPTNeoXForCausalLM */.sYH; },
  "GPTNeoXModel": function() { return /* reexport */ models/* GPTNeoXModel */.vRY; },
  "GPTNeoXPreTrainedModel": function() { return /* reexport */ models/* GPTNeoXPreTrainedModel */.Pd7; },
  "GPTNeoXTokenizer": function() { return /* reexport */ tokenizers/* GPTNeoXTokenizer */.MF; },
  "GemmaTokenizer": function() { return /* reexport */ tokenizers/* GemmaTokenizer */.D$; },
  "Grok1Tokenizer": function() { return /* reexport */ tokenizers/* Grok1Tokenizer */.fI; },
  "HerbertTokenizer": function() { return /* reexport */ tokenizers/* HerbertTokenizer */.Yq; },
  "HubertForCTC": function() { return /* reexport */ models/* HubertForCTC */.Z_F; },
  "HubertForSequenceClassification": function() { return /* reexport */ models/* HubertForSequenceClassification */.dDV; },
  "HubertModel": function() { return /* reexport */ models/* HubertModel */.FlG; },
  "HubertPreTrainedModel": function() { return /* reexport */ models/* HubertPreTrainedModel */.TJv; },
  "ImageClassificationPipeline": function() { return /* reexport */ ImageClassificationPipeline; },
  "ImageFeatureExtractionPipeline": function() { return /* reexport */ ImageFeatureExtractionPipeline; },
  "ImageFeatureExtractor": function() { return /* reexport */ ImageFeatureExtractor; },
  "ImageMattingOutput": function() { return /* reexport */ models/* ImageMattingOutput */.azf; },
  "ImageSegmentationPipeline": function() { return /* reexport */ ImageSegmentationPipeline; },
  "ImageToImagePipeline": function() { return /* reexport */ ImageToImagePipeline; },
  "ImageToTextPipeline": function() { return /* reexport */ ImageToTextPipeline; },
  "LlamaForCausalLM": function() { return /* reexport */ models/* LlamaForCausalLM */.XHO; },
  "LlamaModel": function() { return /* reexport */ models/* LlamaModel */.S5D; },
  "LlamaPreTrainedModel": function() { return /* reexport */ models/* LlamaPreTrainedModel */.EhR; },
  "LlamaTokenizer": function() { return /* reexport */ tokenizers/* LlamaTokenizer */.Ht; },
  "LongT5ForConditionalGeneration": function() { return /* reexport */ models/* LongT5ForConditionalGeneration */.TJ$; },
  "LongT5Model": function() { return /* reexport */ models/* LongT5Model */.kCl; },
  "LongT5PreTrainedModel": function() { return /* reexport */ models/* LongT5PreTrainedModel */.s4i; },
  "M2M100ForConditionalGeneration": function() { return /* reexport */ models/* M2M100ForConditionalGeneration */.SH$; },
  "M2M100Model": function() { return /* reexport */ models/* M2M100Model */.Var; },
  "M2M100PreTrainedModel": function() { return /* reexport */ models/* M2M100PreTrainedModel */.Qs5; },
  "M2M100Tokenizer": function() { return /* reexport */ tokenizers/* M2M100Tokenizer */.mC; },
  "MBart50Tokenizer": function() { return /* reexport */ tokenizers/* MBart50Tokenizer */.Cf; },
  "MBartForCausalLM": function() { return /* reexport */ models/* MBartForCausalLM */.$uV; },
  "MBartForConditionalGeneration": function() { return /* reexport */ models/* MBartForConditionalGeneration */.SZU; },
  "MBartForSequenceClassification": function() { return /* reexport */ models/* MBartForSequenceClassification */.lV$; },
  "MBartModel": function() { return /* reexport */ models/* MBartModel */.G_3; },
  "MBartPreTrainedModel": function() { return /* reexport */ models/* MBartPreTrainedModel */.Tdw; },
  "MBartTokenizer": function() { return /* reexport */ tokenizers/* MBartTokenizer */.Mo; },
  "MPNetForMaskedLM": function() { return /* reexport */ models/* MPNetForMaskedLM */.TPP; },
  "MPNetForQuestionAnswering": function() { return /* reexport */ models/* MPNetForQuestionAnswering */.I6S; },
  "MPNetForSequenceClassification": function() { return /* reexport */ models/* MPNetForSequenceClassification */.QNv; },
  "MPNetForTokenClassification": function() { return /* reexport */ models/* MPNetForTokenClassification */.jDD; },
  "MPNetModel": function() { return /* reexport */ models/* MPNetModel */.LOS; },
  "MPNetPreTrainedModel": function() { return /* reexport */ models/* MPNetPreTrainedModel */.mXx; },
  "MPNetTokenizer": function() { return /* reexport */ tokenizers/* MPNetTokenizer */.vr; },
  "MT5ForConditionalGeneration": function() { return /* reexport */ models/* MT5ForConditionalGeneration */.Yib; },
  "MT5Model": function() { return /* reexport */ models/* MT5Model */.zp9; },
  "MT5PreTrainedModel": function() { return /* reexport */ models/* MT5PreTrainedModel */.cWO; },
  "MarianMTModel": function() { return /* reexport */ models/* MarianMTModel */.NLK; },
  "MarianModel": function() { return /* reexport */ models/* MarianModel */.qTI; },
  "MarianPreTrainedModel": function() { return /* reexport */ models/* MarianPreTrainedModel */.KSb; },
  "MarianTokenizer": function() { return /* reexport */ tokenizers/* MarianTokenizer */.ZP; },
  "MaskedLMOutput": function() { return /* reexport */ models/* MaskedLMOutput */.Dii; },
  "MistralForCausalLM": function() { return /* reexport */ models/* MistralForCausalLM */.EOu; },
  "MistralModel": function() { return /* reexport */ models/* MistralModel */.ykI; },
  "MistralPreTrainedModel": function() { return /* reexport */ models/* MistralPreTrainedModel */.QuJ; },
  "MobileBertForMaskedLM": function() { return /* reexport */ models/* MobileBertForMaskedLM */.GUD; },
  "MobileBertForQuestionAnswering": function() { return /* reexport */ models/* MobileBertForQuestionAnswering */.a5s; },
  "MobileBertForSequenceClassification": function() { return /* reexport */ models/* MobileBertForSequenceClassification */.gLP; },
  "MobileBertModel": function() { return /* reexport */ models/* MobileBertModel */.KXo; },
  "MobileBertPreTrainedModel": function() { return /* reexport */ models/* MobileBertPreTrainedModel */.Dzs; },
  "MobileBertTokenizer": function() { return /* reexport */ tokenizers/* MobileBertTokenizer */.B1; },
  "MobileViTFeatureExtractor": function() { return /* reexport */ MobileViTFeatureExtractor; },
  "MobileViTForImageClassification": function() { return /* reexport */ models/* MobileViTForImageClassification */.K2P; },
  "MobileViTImageProcessor": function() { return /* reexport */ MobileViTImageProcessor; },
  "MobileViTModel": function() { return /* reexport */ models/* MobileViTModel */.cq_; },
  "MobileViTPreTrainedModel": function() { return /* reexport */ models/* MobileViTPreTrainedModel */.IMJ; },
  "MobileViTV2ForImageClassification": function() { return /* reexport */ models/* MobileViTV2ForImageClassification */.Vqq; },
  "MobileViTV2Model": function() { return /* reexport */ models/* MobileViTV2Model */.Nhw; },
  "MobileViTV2PreTrainedModel": function() { return /* reexport */ models/* MobileViTV2PreTrainedModel */.Ytf; },
  "ModelOutput": function() { return /* reexport */ models/* ModelOutput */.WX_; },
  "MptForCausalLM": function() { return /* reexport */ models/* MptForCausalLM */.BrB; },
  "MptModel": function() { return /* reexport */ models/* MptModel */.jYm; },
  "MptPreTrainedModel": function() { return /* reexport */ models/* MptPreTrainedModel */.u3E; },
  "NllbTokenizer": function() { return /* reexport */ tokenizers/* NllbTokenizer */.AV; },
  "NomicBertModel": function() { return /* reexport */ models/* NomicBertModel */.jre; },
  "NomicBertPreTrainedModel": function() { return /* reexport */ models/* NomicBertPreTrainedModel */.dCE; },
  "NougatImageProcessor": function() { return /* reexport */ NougatImageProcessor; },
  "NougatTokenizer": function() { return /* reexport */ tokenizers/* NougatTokenizer */.kW; },
  "OPTForCausalLM": function() { return /* reexport */ models/* OPTForCausalLM */.Oic; },
  "OPTModel": function() { return /* reexport */ models/* OPTModel */.VoQ; },
  "OPTPreTrainedModel": function() { return /* reexport */ models/* OPTPreTrainedModel */.Ioh; },
  "ObjectDetectionPipeline": function() { return /* reexport */ ObjectDetectionPipeline; },
  "OwlViTFeatureExtractor": function() { return /* reexport */ OwlViTFeatureExtractor; },
  "OwlViTForObjectDetection": function() { return /* reexport */ models/* OwlViTForObjectDetection */.SrL; },
  "OwlViTModel": function() { return /* reexport */ models/* OwlViTModel */.Rdx; },
  "OwlViTPreTrainedModel": function() { return /* reexport */ models/* OwlViTPreTrainedModel */.Wbk; },
  "OwlViTProcessor": function() { return /* reexport */ OwlViTProcessor; },
  "Owlv2ForObjectDetection": function() { return /* reexport */ models/* Owlv2ForObjectDetection */.O8H; },
  "Owlv2ImageProcessor": function() { return /* reexport */ Owlv2ImageProcessor; },
  "Owlv2Model": function() { return /* reexport */ models/* Owlv2Model */.aGS; },
  "Owlv2PreTrainedModel": function() { return /* reexport */ models/* Owlv2PreTrainedModel */.BPi; },
  "PhiForCausalLM": function() { return /* reexport */ models/* PhiForCausalLM */.ivj; },
  "PhiModel": function() { return /* reexport */ models/* PhiModel */.B9z; },
  "PhiPreTrainedModel": function() { return /* reexport */ models/* PhiPreTrainedModel */.rjh; },
  "Pipeline": function() { return /* reexport */ Pipeline; },
  "PreTrainedModel": function() { return /* reexport */ models/* PreTrainedModel */.q1U; },
  "PreTrainedTokenizer": function() { return /* reexport */ tokenizers/* PreTrainedTokenizer */.zb; },
  "PretrainedConfig": function() { return /* reexport */ configs/* PretrainedConfig */.D; },
  "PretrainedMixin": function() { return /* reexport */ models/* PretrainedMixin */.NNd; },
  "Processor": function() { return /* reexport */ Processor; },
  "QuestionAnsweringModelOutput": function() { return /* reexport */ models/* QuestionAnsweringModelOutput */.ej5; },
  "QuestionAnsweringPipeline": function() { return /* reexport */ QuestionAnsweringPipeline; },
  "Qwen2ForCausalLM": function() { return /* reexport */ models/* Qwen2ForCausalLM */.Q7k; },
  "Qwen2Model": function() { return /* reexport */ models/* Qwen2Model */.Psf; },
  "Qwen2PreTrainedModel": function() { return /* reexport */ models/* Qwen2PreTrainedModel */.ccR; },
  "Qwen2Tokenizer": function() { return /* reexport */ tokenizers/* Qwen2Tokenizer */.Jk; },
  "RawImage": function() { return /* reexport */ RawImage; },
  "ResNetForImageClassification": function() { return /* reexport */ models/* ResNetForImageClassification */.yTn; },
  "ResNetModel": function() { return /* reexport */ models/* ResNetModel */.z7Z; },
  "ResNetPreTrainedModel": function() { return /* reexport */ models/* ResNetPreTrainedModel */.DyF; },
  "RoFormerForMaskedLM": function() { return /* reexport */ models/* RoFormerForMaskedLM */.I7N; },
  "RoFormerForQuestionAnswering": function() { return /* reexport */ models/* RoFormerForQuestionAnswering */.ldm; },
  "RoFormerForSequenceClassification": function() { return /* reexport */ models/* RoFormerForSequenceClassification */.V_N; },
  "RoFormerForTokenClassification": function() { return /* reexport */ models/* RoFormerForTokenClassification */.FBI; },
  "RoFormerModel": function() { return /* reexport */ models/* RoFormerModel */.IbJ; },
  "RoFormerPreTrainedModel": function() { return /* reexport */ models/* RoFormerPreTrainedModel */.NNm; },
  "RoFormerTokenizer": function() { return /* reexport */ tokenizers/* RoFormerTokenizer */.M9; },
  "RobertaForMaskedLM": function() { return /* reexport */ models/* RobertaForMaskedLM */.IXX; },
  "RobertaForQuestionAnswering": function() { return /* reexport */ models/* RobertaForQuestionAnswering */.PR4; },
  "RobertaForSequenceClassification": function() { return /* reexport */ models/* RobertaForSequenceClassification */.Lqh; },
  "RobertaForTokenClassification": function() { return /* reexport */ models/* RobertaForTokenClassification */.fM5; },
  "RobertaModel": function() { return /* reexport */ models/* RobertaModel */.sSY; },
  "RobertaPreTrainedModel": function() { return /* reexport */ models/* RobertaPreTrainedModel */.xnh; },
  "RobertaTokenizer": function() { return /* reexport */ tokenizers/* RobertaTokenizer */.ut; },
  "SamImageProcessor": function() { return /* reexport */ SamImageProcessor; },
  "SamImageSegmentationOutput": function() { return /* reexport */ models/* SamImageSegmentationOutput */.NLC; },
  "SamModel": function() { return /* reexport */ models/* SamModel */.p$H; },
  "SamPreTrainedModel": function() { return /* reexport */ models/* SamPreTrainedModel */.vee; },
  "SamProcessor": function() { return /* reexport */ SamProcessor; },
  "SeamlessM4TFeatureExtractor": function() { return /* reexport */ SeamlessM4TFeatureExtractor; },
  "SegformerFeatureExtractor": function() { return /* reexport */ SegformerFeatureExtractor; },
  "SegformerForImageClassification": function() { return /* reexport */ models/* SegformerForImageClassification */.EEI; },
  "SegformerForSemanticSegmentation": function() { return /* reexport */ models/* SegformerForSemanticSegmentation */.pVo; },
  "SegformerModel": function() { return /* reexport */ models/* SegformerModel */.ABF; },
  "SegformerPreTrainedModel": function() { return /* reexport */ models/* SegformerPreTrainedModel */.AMl; },
  "Seq2SeqLMOutput": function() { return /* reexport */ models/* Seq2SeqLMOutput */.BtD; },
  "SequenceClassifierOutput": function() { return /* reexport */ models/* SequenceClassifierOutput */.okV; },
  "SiglipImageProcessor": function() { return /* reexport */ SiglipImageProcessor; },
  "SiglipModel": function() { return /* reexport */ models/* SiglipModel */.$fn; },
  "SiglipPreTrainedModel": function() { return /* reexport */ models/* SiglipPreTrainedModel */.ILj; },
  "SiglipTextModel": function() { return /* reexport */ models/* SiglipTextModel */.FqA; },
  "SiglipTokenizer": function() { return /* reexport */ tokenizers/* SiglipTokenizer */.Df; },
  "SiglipVisionModel": function() { return /* reexport */ models/* SiglipVisionModel */.ZQV; },
  "SpeechT5FeatureExtractor": function() { return /* reexport */ SpeechT5FeatureExtractor; },
  "SpeechT5ForSpeechToText": function() { return /* reexport */ models/* SpeechT5ForSpeechToText */.gDx; },
  "SpeechT5ForTextToSpeech": function() { return /* reexport */ models/* SpeechT5ForTextToSpeech */.Uby; },
  "SpeechT5HifiGan": function() { return /* reexport */ models/* SpeechT5HifiGan */.WTN; },
  "SpeechT5Model": function() { return /* reexport */ models/* SpeechT5Model */.k2T; },
  "SpeechT5PreTrainedModel": function() { return /* reexport */ models/* SpeechT5PreTrainedModel */.LdE; },
  "SpeechT5Processor": function() { return /* reexport */ SpeechT5Processor; },
  "SpeechT5Tokenizer": function() { return /* reexport */ tokenizers/* SpeechT5Tokenizer */.y7; },
  "SqueezeBertForMaskedLM": function() { return /* reexport */ models/* SqueezeBertForMaskedLM */.FlS; },
  "SqueezeBertForQuestionAnswering": function() { return /* reexport */ models/* SqueezeBertForQuestionAnswering */.M$B; },
  "SqueezeBertForSequenceClassification": function() { return /* reexport */ models/* SqueezeBertForSequenceClassification */.ieO; },
  "SqueezeBertModel": function() { return /* reexport */ models/* SqueezeBertModel */.NU; },
  "SqueezeBertPreTrainedModel": function() { return /* reexport */ models/* SqueezeBertPreTrainedModel */.Qlb; },
  "SqueezeBertTokenizer": function() { return /* reexport */ tokenizers/* SqueezeBertTokenizer */.SS; },
  "StableLmForCausalLM": function() { return /* reexport */ models/* StableLmForCausalLM */.VYt; },
  "StableLmModel": function() { return /* reexport */ models/* StableLmModel */.Exl; },
  "StableLmPreTrainedModel": function() { return /* reexport */ models/* StableLmPreTrainedModel */.MN_; },
  "Starcoder2ForCausalLM": function() { return /* reexport */ models/* Starcoder2ForCausalLM */.Bgf; },
  "Starcoder2Model": function() { return /* reexport */ models/* Starcoder2Model */.SuI; },
  "Starcoder2PreTrainedModel": function() { return /* reexport */ models/* Starcoder2PreTrainedModel */.ezq; },
  "SummarizationPipeline": function() { return /* reexport */ SummarizationPipeline; },
  "Swin2SRForImageSuperResolution": function() { return /* reexport */ models/* Swin2SRForImageSuperResolution */.gts; },
  "Swin2SRImageProcessor": function() { return /* reexport */ Swin2SRImageProcessor; },
  "Swin2SRModel": function() { return /* reexport */ models/* Swin2SRModel */.ckI; },
  "Swin2SRPreTrainedModel": function() { return /* reexport */ models/* Swin2SRPreTrainedModel */.Irb; },
  "SwinForImageClassification": function() { return /* reexport */ models/* SwinForImageClassification */.TVl; },
  "SwinModel": function() { return /* reexport */ models/* SwinModel */.DXm; },
  "SwinPreTrainedModel": function() { return /* reexport */ models/* SwinPreTrainedModel */.LdN; },
  "T5ForConditionalGeneration": function() { return /* reexport */ models/* T5ForConditionalGeneration */.U2e; },
  "T5Model": function() { return /* reexport */ models/* T5Model */.kFo; },
  "T5PreTrainedModel": function() { return /* reexport */ models/* T5PreTrainedModel */.Eez; },
  "T5Tokenizer": function() { return /* reexport */ tokenizers/* T5Tokenizer */.Tk; },
  "TableTransformerForObjectDetection": function() { return /* reexport */ models/* TableTransformerForObjectDetection */.M8O; },
  "TableTransformerModel": function() { return /* reexport */ models/* TableTransformerModel */.lbo; },
  "TableTransformerObjectDetectionOutput": function() { return /* reexport */ models/* TableTransformerObjectDetectionOutput */.lR1; },
  "TableTransformerPreTrainedModel": function() { return /* reexport */ models/* TableTransformerPreTrainedModel */.TUE; },
  "Tensor": function() { return /* reexport */ utils_tensor/* Tensor */.es; },
  "Text2TextGenerationPipeline": function() { return /* reexport */ Text2TextGenerationPipeline; },
  "TextClassificationPipeline": function() { return /* reexport */ TextClassificationPipeline; },
  "TextGenerationPipeline": function() { return /* reexport */ TextGenerationPipeline; },
  "TextToAudioPipeline": function() { return /* reexport */ TextToAudioPipeline; },
  "TokenClassificationPipeline": function() { return /* reexport */ TokenClassificationPipeline; },
  "TokenClassifierOutput": function() { return /* reexport */ models/* TokenClassifierOutput */.PIJ; },
  "TokenizerModel": function() { return /* reexport */ tokenizers/* TokenizerModel */.BZ; },
  "TrOCRForCausalLM": function() { return /* reexport */ models/* TrOCRForCausalLM */.raf; },
  "TrOCRPreTrainedModel": function() { return /* reexport */ models/* TrOCRPreTrainedModel */.Miw; },
  "TranslationPipeline": function() { return /* reexport */ TranslationPipeline; },
  "UniSpeechForCTC": function() { return /* reexport */ models/* UniSpeechForCTC */.lqn; },
  "UniSpeechForSequenceClassification": function() { return /* reexport */ models/* UniSpeechForSequenceClassification */.zMI; },
  "UniSpeechModel": function() { return /* reexport */ models/* UniSpeechModel */.i51; },
  "UniSpeechPreTrainedModel": function() { return /* reexport */ models/* UniSpeechPreTrainedModel */.Xcn; },
  "UniSpeechSatForAudioFrameClassification": function() { return /* reexport */ models/* UniSpeechSatForAudioFrameClassification */.FMz; },
  "UniSpeechSatForCTC": function() { return /* reexport */ models/* UniSpeechSatForCTC */.A02; },
  "UniSpeechSatForSequenceClassification": function() { return /* reexport */ models/* UniSpeechSatForSequenceClassification */.Gex; },
  "UniSpeechSatModel": function() { return /* reexport */ models/* UniSpeechSatModel */.TCy; },
  "UniSpeechSatPreTrainedModel": function() { return /* reexport */ models/* UniSpeechSatPreTrainedModel */.f4g; },
  "ViTFeatureExtractor": function() { return /* reexport */ ViTFeatureExtractor; },
  "ViTForImageClassification": function() { return /* reexport */ models/* ViTForImageClassification */.Q2B; },
  "ViTImageProcessor": function() { return /* reexport */ ViTImageProcessor; },
  "ViTModel": function() { return /* reexport */ models/* ViTModel */.D6z; },
  "ViTPreTrainedModel": function() { return /* reexport */ models/* ViTPreTrainedModel */.uQT; },
  "VisionEncoderDecoderModel": function() { return /* reexport */ models/* VisionEncoderDecoderModel */.$IJ; },
  "VitMatteForImageMatting": function() { return /* reexport */ models/* VitMatteForImageMatting */.AOR; },
  "VitMatteImageProcessor": function() { return /* reexport */ VitMatteImageProcessor; },
  "VitMattePreTrainedModel": function() { return /* reexport */ models/* VitMattePreTrainedModel */.RLG; },
  "VitsModel": function() { return /* reexport */ models/* VitsModel */.POT; },
  "VitsModelOutput": function() { return /* reexport */ models/* VitsModelOutput */.TvZ; },
  "VitsPreTrainedModel": function() { return /* reexport */ models/* VitsPreTrainedModel */.icC; },
  "VitsTokenizer": function() { return /* reexport */ tokenizers/* VitsTokenizer */.KY; },
  "Wav2Vec2BertForCTC": function() { return /* reexport */ models/* Wav2Vec2BertForCTC */.bQ0; },
  "Wav2Vec2BertForSequenceClassification": function() { return /* reexport */ models/* Wav2Vec2BertForSequenceClassification */.yw4; },
  "Wav2Vec2BertModel": function() { return /* reexport */ models/* Wav2Vec2BertModel */.ryR; },
  "Wav2Vec2BertPreTrainedModel": function() { return /* reexport */ models/* Wav2Vec2BertPreTrainedModel */.v4V; },
  "Wav2Vec2CTCTokenizer": function() { return /* reexport */ tokenizers/* Wav2Vec2CTCTokenizer */.dO; },
  "Wav2Vec2FeatureExtractor": function() { return /* reexport */ Wav2Vec2FeatureExtractor; },
  "Wav2Vec2ForAudioFrameClassification": function() { return /* reexport */ models/* Wav2Vec2ForAudioFrameClassification */.GZG; },
  "Wav2Vec2ForCTC": function() { return /* reexport */ models/* Wav2Vec2ForCTC */.dfz; },
  "Wav2Vec2ForSequenceClassification": function() { return /* reexport */ models/* Wav2Vec2ForSequenceClassification */.OqU; },
  "Wav2Vec2Model": function() { return /* reexport */ models/* Wav2Vec2Model */.vKQ; },
  "Wav2Vec2PreTrainedModel": function() { return /* reexport */ models/* Wav2Vec2PreTrainedModel */.Dwe; },
  "Wav2Vec2ProcessorWithLM": function() { return /* reexport */ Wav2Vec2ProcessorWithLM; },
  "WavLMForAudioFrameClassification": function() { return /* reexport */ models/* WavLMForAudioFrameClassification */._XM; },
  "WavLMForCTC": function() { return /* reexport */ models/* WavLMForCTC */.DWg; },
  "WavLMForSequenceClassification": function() { return /* reexport */ models/* WavLMForSequenceClassification */.GDD; },
  "WavLMForXVector": function() { return /* reexport */ models/* WavLMForXVector */._98; },
  "WavLMModel": function() { return /* reexport */ models/* WavLMModel */.f76; },
  "WavLMPreTrainedModel": function() { return /* reexport */ models/* WavLMPreTrainedModel */.tGD; },
  "WhisperFeatureExtractor": function() { return /* reexport */ WhisperFeatureExtractor; },
  "WhisperForConditionalGeneration": function() { return /* reexport */ models/* WhisperForConditionalGeneration */.s0; },
  "WhisperModel": function() { return /* reexport */ models/* WhisperModel */.Cvr; },
  "WhisperPreTrainedModel": function() { return /* reexport */ models/* WhisperPreTrainedModel */.KZ9; },
  "WhisperProcessor": function() { return /* reexport */ WhisperProcessor; },
  "WhisperTokenizer": function() { return /* reexport */ tokenizers/* WhisperTokenizer */.rK; },
  "XLMForQuestionAnswering": function() { return /* reexport */ models/* XLMForQuestionAnswering */.$JM; },
  "XLMForSequenceClassification": function() { return /* reexport */ models/* XLMForSequenceClassification */.v79; },
  "XLMForTokenClassification": function() { return /* reexport */ models/* XLMForTokenClassification */.Els; },
  "XLMModel": function() { return /* reexport */ models/* XLMModel */.v17; },
  "XLMPreTrainedModel": function() { return /* reexport */ models/* XLMPreTrainedModel */.kR_; },
  "XLMRobertaForMaskedLM": function() { return /* reexport */ models/* XLMRobertaForMaskedLM */.Jqv; },
  "XLMRobertaForQuestionAnswering": function() { return /* reexport */ models/* XLMRobertaForQuestionAnswering */.vpo; },
  "XLMRobertaForSequenceClassification": function() { return /* reexport */ models/* XLMRobertaForSequenceClassification */.LNK; },
  "XLMRobertaForTokenClassification": function() { return /* reexport */ models/* XLMRobertaForTokenClassification */.rbR; },
  "XLMRobertaModel": function() { return /* reexport */ models/* XLMRobertaModel */.RVs; },
  "XLMRobertaPreTrainedModel": function() { return /* reexport */ models/* XLMRobertaPreTrainedModel */.vSH; },
  "XLMRobertaTokenizer": function() { return /* reexport */ tokenizers/* XLMRobertaTokenizer */.Kp; },
  "XLMTokenizer": function() { return /* reexport */ tokenizers/* XLMTokenizer */.Ne; },
  "XLMWithLMHeadModel": function() { return /* reexport */ models/* XLMWithLMHeadModel */.b0Z; },
  "XVectorOutput": function() { return /* reexport */ models/* XVectorOutput */.WE3; },
  "YolosFeatureExtractor": function() { return /* reexport */ YolosFeatureExtractor; },
  "YolosForObjectDetection": function() { return /* reexport */ models/* YolosForObjectDetection */.l1C; },
  "YolosModel": function() { return /* reexport */ models/* YolosModel */.dTl; },
  "YolosObjectDetectionOutput": function() { return /* reexport */ models/* YolosObjectDetectionOutput */.E66; },
  "YolosPreTrainedModel": function() { return /* reexport */ models/* YolosPreTrainedModel */._Lu; },
  "ZeroShotAudioClassificationPipeline": function() { return /* reexport */ ZeroShotAudioClassificationPipeline; },
  "ZeroShotClassificationPipeline": function() { return /* reexport */ ZeroShotClassificationPipeline; },
  "ZeroShotImageClassificationPipeline": function() { return /* reexport */ ZeroShotImageClassificationPipeline; },
  "ZeroShotObjectDetectionPipeline": function() { return /* reexport */ ZeroShotObjectDetectionPipeline; },
  "bankers_round": function() { return /* reexport */ maths/* bankers_round */.eT; },
  "cat": function() { return /* reexport */ utils_tensor/* cat */.d3; },
  "cos_sim": function() { return /* reexport */ maths/* cos_sim */.Dx; },
  "dot": function() { return /* reexport */ maths/* dot */.AK; },
  "dynamicTimeWarping": function() { return /* reexport */ utils_tensor/* dynamicTimeWarping */.Ks; },
  "env": function() { return /* reexport */ env/* env */.O; },
  "getTopItems": function() { return /* reexport */ maths/* getTopItems */.em; },
  "hanning": function() { return /* reexport */ hanning; },
  "interpolate": function() { return /* reexport */ utils_tensor/* interpolate */.sX; },
  "interpolate_data": function() { return /* reexport */ maths/* interpolate_data */.Nq; },
  "layer_norm": function() { return /* reexport */ utils_tensor/* layer_norm */.K3; },
  "log_softmax": function() { return /* reexport */ maths/* log_softmax */.CI; },
  "magnitude": function() { return /* reexport */ maths/* magnitude */.VE; },
  "max": function() { return /* reexport */ maths/* max */.Fp; },
  "mean": function() { return /* reexport */ utils_tensor/* mean */.J6; },
  "mean_pooling": function() { return /* reexport */ utils_tensor/* mean_pooling */.v6; },
  "medianFilter": function() { return /* reexport */ maths/* medianFilter */.qC; },
  "mel_filter_bank": function() { return /* reexport */ mel_filter_bank; },
  "min": function() { return /* reexport */ maths/* min */.VV; },
  "ones": function() { return /* reexport */ utils_tensor/* ones */.iU; },
  "ones_like": function() { return /* reexport */ utils_tensor/* ones_like */.r6; },
  "permute": function() { return /* reexport */ utils_tensor/* permute */.FO; },
  "permute_data": function() { return /* reexport */ maths/* permute_data */.nu; },
  "pipeline": function() { return /* reexport */ pipeline; },
  "quantize_embeddings": function() { return /* reexport */ utils_tensor/* quantize_embeddings */.e; },
  "read_audio": function() { return /* reexport */ read_audio; },
  "round": function() { return /* reexport */ maths/* round */.NM; },
  "softmax": function() { return /* reexport */ maths/* softmax */.XA; },
  "spectrogram": function() { return /* reexport */ spectrogram; },
  "stack": function() { return /* reexport */ utils_tensor/* stack */.kn; },
  "std_mean": function() { return /* reexport */ utils_tensor/* std_mean */.f3; },
  "window_function": function() { return /* reexport */ window_function; }
});

// EXTERNAL MODULE: ../../node_modules/.pnpm/@xenova+transformers@2.17.2/node_modules/@xenova/transformers/src/tokenizers.js
var tokenizers = __webpack_require__(3753);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@xenova+transformers@2.17.2/node_modules/@xenova/transformers/src/models.js
var models = __webpack_require__(8279);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@xenova+transformers@2.17.2/node_modules/@xenova/transformers/src/utils/core.js
var core = __webpack_require__(4513);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@xenova+transformers@2.17.2/node_modules/@xenova/transformers/src/utils/hub.js
var hub = __webpack_require__(2023);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@xenova+transformers@2.17.2/node_modules/@xenova/transformers/src/utils/maths.js
var maths = __webpack_require__(365);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@xenova+transformers@2.17.2/node_modules/@xenova/transformers/src/utils/tensor.js
var utils_tensor = __webpack_require__(2672);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@xenova+transformers@2.17.2/node_modules/@xenova/transformers/src/env.js
var env = __webpack_require__(157);
// EXTERNAL MODULE: sharp (ignored)
var sharp_ignored_ = __webpack_require__(5808);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@xenova+transformers@2.17.2/node_modules/@xenova/transformers/src/utils/image.js

/**
 * @file Helper module for image processing. 
 * 
 * These functions and classes are only used internally, 
 * meaning an end-user shouldn't need to access anything here.
 * 
 * @module utils/image
 */





// Will be empty (or not used) if running in browser or web-worker


const BROWSER_ENV = typeof self !== 'undefined';
const WEBWORKER_ENV = BROWSER_ENV && self.constructor.name === 'DedicatedWorkerGlobalScope';

let createCanvasFunction;
let ImageDataClass;
let loadImageFunction;
if (BROWSER_ENV) {
    // Running in browser or web-worker
    createCanvasFunction = (/** @type {number} */ width, /** @type {number} */ height) => {
        if (!self.OffscreenCanvas) {
            throw new Error('OffscreenCanvas not supported by this browser.');
        }
        return new self.OffscreenCanvas(width, height)
    };
    loadImageFunction = self.createImageBitmap;
    ImageDataClass = self.ImageData;

} else if (sharp_ignored_) {
    // Running in Node.js, electron, or other non-browser environment

    loadImageFunction = async (/**@type {sharp.Sharp}*/img) => {
        const metadata = await img.metadata();
        const rawChannels = metadata.channels;

        let { data, info } = await img.rotate().raw().toBuffer({ resolveWithObject: true });

        const newImage = new RawImage(new Uint8ClampedArray(data), info.width, info.height, info.channels);
        if (rawChannels !== undefined && rawChannels !== info.channels) {
            // Make sure the new image has the same number of channels as the input image.
            // This is necessary for grayscale images.
            newImage.convert(rawChannels);
        }
        return newImage;
    }

} else {
    throw new Error('Unable to load image processing library.');
}


// Defined here: https://github.com/python-pillow/Pillow/blob/a405e8406b83f8bfb8916e93971edc7407b8b1ff/src/libImaging/Imaging.h#L262-L268
const RESAMPLING_MAPPING = {
    0: 'nearest',
    1: 'lanczos',
    2: 'bilinear',
    3: 'bicubic',
    4: 'box',
    5: 'hamming',
}

/**
 * Mapping from file extensions to MIME types.
 */
const CONTENT_TYPE_MAP = new Map([
    ['png', 'image/png'],
    ['jpg', 'image/jpeg'],
    ['jpeg', 'image/jpeg'],
    ['gif', 'image/gif'],
]);

class RawImage {

    /**
     * Create a new `RawImage` object.
     * @param {Uint8ClampedArray|Uint8Array} data The pixel data.
     * @param {number} width The width of the image.
     * @param {number} height The height of the image.
     * @param {1|2|3|4} channels The number of channels.
     */
    constructor(data, width, height, channels) {
        this.data = data;
        this.width = width;
        this.height = height;
        this.channels = channels;
    }

    /** 
     * Returns the size of the image (width, height).
     * @returns {[number, number]} The size of the image (width, height).
     */
    get size() {
        return [this.width, this.height];
    }

    /**
     * Helper method for reading an image from a variety of input types.
     * @param {RawImage|string|URL} input 
     * @returns The image object.
     * 
     * **Example:** Read image from a URL.
     * ```javascript
     * let image = await RawImage.read('https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/football-match.jpg');
     * // RawImage {
     * //   "data": Uint8ClampedArray [ 25, 25, 25, 19, 19, 19, ... ],
     * //   "width": 800,
     * //   "height": 533,
     * //   "channels": 3
     * // }
     * ```
     */
    static async read(input) {
        if (input instanceof RawImage) {
            return input;
        } else if (typeof input === 'string' || input instanceof URL) {
            return await this.fromURL(input);
        } else {
            throw new Error(`Unsupported input type: ${typeof input}`);
        }
    }


    /**
     * Read an image from a URL or file path.
     * @param {string|URL} url The URL or file path to read the image from.
     * @returns {Promise<RawImage>} The image object.
     */
    static async fromURL(url) {
        let response = await (0,hub/* getFile */.hn)(url);
        if (response.status !== 200) {
            throw new Error(`Unable to read image from "${url}" (${response.status} ${response.statusText})`);
        }
        let blob = await response.blob();
        return this.fromBlob(blob);
    }

    /**
     * Helper method to create a new Image from a blob.
     * @param {Blob} blob The blob to read the image from.
     * @returns {Promise<RawImage>} The image object.
     */
    static async fromBlob(blob) {
        if (BROWSER_ENV) {
            // Running in environment with canvas
            let img = await loadImageFunction(blob);

            const ctx = createCanvasFunction(img.width, img.height).getContext('2d');

            // Draw image to context
            ctx.drawImage(img, 0, 0);

            return new this(ctx.getImageData(0, 0, img.width, img.height).data, img.width, img.height, 4);

        } else {
            // Use sharp.js to read (and possible resize) the image.
            let img = sharp_ignored_(await blob.arrayBuffer());

            return await loadImageFunction(img);
        }
    }

    /**
     * Helper method to create a new Image from a tensor
     * @param {Tensor} tensor 
     */
    static fromTensor(tensor, channel_format = 'CHW') {
        if (tensor.dims.length !== 3) {
            throw new Error(`Tensor should have 3 dimensions, but has ${tensor.dims.length} dimensions.`);
        }

        if (channel_format === 'CHW') {
            tensor = tensor.transpose(1, 2, 0);
        } else if (channel_format === 'HWC') {
            // Do nothing
        } else {
            throw new Error(`Unsupported channel format: ${channel_format}`);
        }
        if (!(tensor.data instanceof Uint8ClampedArray || tensor.data instanceof Uint8Array)) {
            throw new Error(`Unsupported tensor type: ${tensor.type}`);
        }
        switch (tensor.dims[2]) {
            case 1:
            case 2:
            case 3:
            case 4:
                return new RawImage(tensor.data, tensor.dims[1], tensor.dims[0], tensor.dims[2]);
            default:
                throw new Error(`Unsupported number of channels: ${tensor.dims[2]}`);
        }
    }

    /**
     * Convert the image to grayscale format.
     * @returns {RawImage} `this` to support chaining.
     */
    grayscale() {
        if (this.channels === 1) {
            return this;
        }

        let newData = new Uint8ClampedArray(this.width * this.height * 1);
        switch (this.channels) {
            case 3: // rgb to grayscale
            case 4: // rgba to grayscale
                for (let i = 0, offset = 0; i < this.data.length; i += this.channels) {
                    const red = this.data[i];
                    const green = this.data[i + 1];
                    const blue = this.data[i + 2];

                    newData[offset++] = Math.round(0.2989 * red + 0.5870 * green + 0.1140 * blue);
                }
                break;
            default:
                throw new Error(`Conversion failed due to unsupported number of channels: ${this.channels}`);
        }
        return this._update(newData, this.width, this.height, 1);
    }

    /**
     * Convert the image to RGB format.
     * @returns {RawImage} `this` to support chaining.
     */
    rgb() {
        if (this.channels === 3) {
            return this;
        }

        let newData = new Uint8ClampedArray(this.width * this.height * 3);

        switch (this.channels) {
            case 1: // grayscale to rgb
                for (let i = 0, offset = 0; i < this.data.length; ++i) {
                    newData[offset++] = this.data[i];
                    newData[offset++] = this.data[i];
                    newData[offset++] = this.data[i];
                }
                break;
            case 4: // rgba to rgb
                for (let i = 0, offset = 0; i < this.data.length; i += 4) {
                    newData[offset++] = this.data[i];
                    newData[offset++] = this.data[i + 1];
                    newData[offset++] = this.data[i + 2];
                }
                break;
            default:
                throw new Error(`Conversion failed due to unsupported number of channels: ${this.channels}`);
        }
        return this._update(newData, this.width, this.height, 3);

    }

    /**
     * Convert the image to RGBA format.
     * @returns {RawImage} `this` to support chaining.
     */
    rgba() {
        if (this.channels === 4) {
            return this;
        }

        let newData = new Uint8ClampedArray(this.width * this.height * 4);

        switch (this.channels) {
            case 1: // grayscale to rgba
                for (let i = 0, offset = 0; i < this.data.length; ++i) {
                    newData[offset++] = this.data[i];
                    newData[offset++] = this.data[i];
                    newData[offset++] = this.data[i];
                    newData[offset++] = 255;
                }
                break;
            case 3: // rgb to rgba
                for (let i = 0, offset = 0; i < this.data.length; i += 3) {
                    newData[offset++] = this.data[i];
                    newData[offset++] = this.data[i + 1];
                    newData[offset++] = this.data[i + 2];
                    newData[offset++] = 255;
                }
                break;
            default:
                throw new Error(`Conversion failed due to unsupported number of channels: ${this.channels}`);
        }

        return this._update(newData, this.width, this.height, 4);
    }

    /**
     * Resize the image to the given dimensions. This method uses the canvas API to perform the resizing.
     * @param {number} width The width of the new image.
     * @param {number} height The height of the new image.
     * @param {Object} options Additional options for resizing.
     * @param {0|1|2|3|4|5|string} [options.resample] The resampling method to use.
     * @returns {Promise<RawImage>} `this` to support chaining.
     */
    async resize(width, height, {
        resample = 2,
    } = {}) {

        // Ensure resample method is a string
        let resampleMethod = RESAMPLING_MAPPING[resample] ?? resample;

        if (BROWSER_ENV) {
            // TODO use `resample` in browser environment

            // Store number of channels before resizing
            let numChannels = this.channels;

            // Create canvas object for this image
            let canvas = this.toCanvas();

            // Actually perform resizing using the canvas API
            const ctx = createCanvasFunction(width, height).getContext('2d');

            // Draw image to context, resizing in the process
            ctx.drawImage(canvas, 0, 0, width, height);

            // Create image from the resized data
            let resizedImage = new RawImage(ctx.getImageData(0, 0, width, height).data, width, height, 4);

            // Convert back so that image has the same number of channels as before
            return resizedImage.convert(numChannels);

        } else {
            // Create sharp image from raw data, and resize
            let img = this.toSharp();

            switch (resampleMethod) {
                case 'box':
                case 'hamming':
                    if (resampleMethod === 'box' || resampleMethod === 'hamming') {
                        console.warn(`Resampling method ${resampleMethod} is not yet supported. Using bilinear instead.`);
                        resampleMethod = 'bilinear';
                    }

                case 'nearest':
                case 'bilinear':
                case 'bicubic':
                    // Perform resizing using affine transform. 
                    // This matches how the python Pillow library does it.
                    img = img.affine([width / this.width, 0, 0, height / this.height], {
                        interpolator: resampleMethod
                    });
                    break;

                case 'lanczos':
                    // https://github.com/python-pillow/Pillow/discussions/5519
                    // https://github.com/lovell/sharp/blob/main/docs/api-resize.md
                    img = img.resize({
                        width, height,
                        fit: 'fill',
                        kernel: 'lanczos3', // PIL Lanczos uses a kernel size of 3 
                    });
                    break;

                default:
                    throw new Error(`Resampling method ${resampleMethod} is not supported.`);
            }

            return await loadImageFunction(img);
        }

    }

    async pad([left, right, top, bottom]) {
        left = Math.max(left, 0);
        right = Math.max(right, 0);
        top = Math.max(top, 0);
        bottom = Math.max(bottom, 0);

        if (left === 0 && right === 0 && top === 0 && bottom === 0) {
            // No padding needed
            return this;
        }

        if (BROWSER_ENV) {
            // Store number of channels before padding
            let numChannels = this.channels;

            // Create canvas object for this image
            let canvas = this.toCanvas();

            let newWidth = this.width + left + right;
            let newHeight = this.height + top + bottom;

            // Create a new canvas of the desired size.
            const ctx = createCanvasFunction(newWidth, newHeight).getContext('2d');

            // Draw image to context, padding in the process
            ctx.drawImage(canvas,
                0, 0, this.width, this.height,
                left, top, newWidth, newHeight
            );

            // Create image from the padded data
            let paddedImage = new RawImage(
                ctx.getImageData(0, 0, newWidth, newHeight).data,
                newWidth, newHeight, 4);

            // Convert back so that image has the same number of channels as before
            return paddedImage.convert(numChannels);

        } else {
            let img = this.toSharp().extend({ left, right, top, bottom });
            return await loadImageFunction(img);
        }
    }

    async crop([x_min, y_min, x_max, y_max]) {
        // Ensure crop bounds are within the image
        x_min = Math.max(x_min, 0);
        y_min = Math.max(y_min, 0);
        x_max = Math.min(x_max, this.width - 1);
        y_max = Math.min(y_max, this.height - 1);

        // Do nothing if the crop is the entire image
        if (x_min === 0 && y_min === 0 && x_max === this.width - 1 && y_max === this.height - 1) {
            return this;
        }

        const crop_width = x_max - x_min + 1;
        const crop_height = y_max - y_min + 1;

        if (BROWSER_ENV) {
            // Store number of channels before resizing
            const numChannels = this.channels;

            // Create canvas object for this image
            const canvas = this.toCanvas();

            // Create a new canvas of the desired size. This is needed since if the 
            // image is too small, we need to pad it with black pixels.
            const ctx = createCanvasFunction(crop_width, crop_height).getContext('2d');

            // Draw image to context, cropping in the process
            ctx.drawImage(canvas,
                x_min, y_min, crop_width, crop_height,
                0, 0, crop_width, crop_height
            );

            // Create image from the resized data
            const resizedImage = new RawImage(ctx.getImageData(0, 0, crop_width, crop_height).data, crop_width, crop_height, 4);

            // Convert back so that image has the same number of channels as before
            return resizedImage.convert(numChannels);

        } else {
            // Create sharp image from raw data
            const img = this.toSharp().extract({
                left: x_min,
                top: y_min,
                width: crop_width,
                height: crop_height,
            });

            return await loadImageFunction(img);
        }

    }

    async center_crop(crop_width, crop_height) {
        // If the image is already the desired size, return it
        if (this.width === crop_width && this.height === crop_height) {
            return this;
        }

        // Determine bounds of the image in the new canvas
        let width_offset = (this.width - crop_width) / 2;
        let height_offset = (this.height - crop_height) / 2;


        if (BROWSER_ENV) {
            // Store number of channels before resizing
            let numChannels = this.channels;

            // Create canvas object for this image
            let canvas = this.toCanvas();

            // Create a new canvas of the desired size. This is needed since if the 
            // image is too small, we need to pad it with black pixels.
            const ctx = createCanvasFunction(crop_width, crop_height).getContext('2d');

            let sourceX = 0;
            let sourceY = 0;
            let destX = 0;
            let destY = 0;

            if (width_offset >= 0) {
                sourceX = width_offset;
            } else {
                destX = -width_offset;
            }

            if (height_offset >= 0) {
                sourceY = height_offset;
            } else {
                destY = -height_offset;
            }

            // Draw image to context, cropping in the process
            ctx.drawImage(canvas,
                sourceX, sourceY, crop_width, crop_height,
                destX, destY, crop_width, crop_height
            );

            // Create image from the resized data
            let resizedImage = new RawImage(ctx.getImageData(0, 0, crop_width, crop_height).data, crop_width, crop_height, 4);

            // Convert back so that image has the same number of channels as before
            return resizedImage.convert(numChannels);

        } else {
            // Create sharp image from raw data
            let img = this.toSharp();

            if (width_offset >= 0 && height_offset >= 0) {
                // Cropped image lies entirely within the original image
                img = img.extract({
                    left: Math.floor(width_offset),
                    top: Math.floor(height_offset),
                    width: crop_width,
                    height: crop_height,
                })
            } else if (width_offset <= 0 && height_offset <= 0) {
                // Cropped image lies entirely outside the original image,
                // so we add padding
                let top = Math.floor(-height_offset);
                let left = Math.floor(-width_offset);
                img = img.extend({
                    top: top,
                    left: left,

                    // Ensures the resulting image has the desired dimensions
                    right: crop_width - this.width - left,
                    bottom: crop_height - this.height - top,
                });
            } else {
                // Cropped image lies partially outside the original image.
                // We first pad, then crop.

                let y_padding = [0, 0];
                let y_extract = 0;
                if (height_offset < 0) {
                    y_padding[0] = Math.floor(-height_offset);
                    y_padding[1] = crop_height - this.height - y_padding[0];
                } else {
                    y_extract = Math.floor(height_offset);
                }

                let x_padding = [0, 0];
                let x_extract = 0;
                if (width_offset < 0) {
                    x_padding[0] = Math.floor(-width_offset);
                    x_padding[1] = crop_width - this.width - x_padding[0];
                } else {
                    x_extract = Math.floor(width_offset);
                }

                img = img.extend({
                    top: y_padding[0],
                    bottom: y_padding[1],
                    left: x_padding[0],
                    right: x_padding[1],
                }).extract({
                    left: x_extract,
                    top: y_extract,
                    width: crop_width,
                    height: crop_height,
                })
            }

            return await loadImageFunction(img);
        }
    }

    async toBlob(type = 'image/png', quality = 1) {
        if (!BROWSER_ENV) {
            throw new Error('toBlob() is only supported in browser environments.')
        }

        const canvas = this.toCanvas();
        return await canvas.convertToBlob({ type, quality });
    }

    toTensor(channel_format = 'CHW') {
        let tensor = new utils_tensor/* Tensor */.es(
            'uint8',
            new Uint8Array(this.data),
            [this.height, this.width, this.channels]
        );

        if (channel_format === 'HWC') {
            // Do nothing
        } else if (channel_format === 'CHW') { // hwc -> chw
            tensor = tensor.permute(2, 0, 1);
        } else {
            throw new Error(`Unsupported channel format: ${channel_format}`);
        }
        return tensor;
    }

    toCanvas() {
        if (!BROWSER_ENV) {
            throw new Error('toCanvas() is only supported in browser environments.')
        }

        // Clone, and convert data to RGBA before drawing to canvas.
        // This is because the canvas API only supports RGBA
        let cloned = this.clone().rgba();

        // Create canvas object for the cloned image
        let clonedCanvas = createCanvasFunction(cloned.width, cloned.height);

        // Draw image to context
        let data = new ImageDataClass(cloned.data, cloned.width, cloned.height);
        clonedCanvas.getContext('2d').putImageData(data, 0, 0);

        return clonedCanvas;
    }

    /**
     * Helper method to update the image data.
     * @param {Uint8ClampedArray} data The new image data.
     * @param {number} width The new width of the image.
     * @param {number} height The new height of the image.
     * @param {1|2|3|4|null} [channels] The new number of channels of the image.
     * @private
     */
    _update(data, width, height, channels = null) {
        this.data = data;
        this.width = width;
        this.height = height;
        if (channels !== null) {
            this.channels = channels;
        }
        return this;
    }

    /**
     * Clone the image
     * @returns {RawImage} The cloned image
     */
    clone() {
        return new RawImage(this.data.slice(), this.width, this.height, this.channels);
    }

    /**
     * Helper method for converting image to have a certain number of channels
     * @param {number} numChannels The number of channels. Must be 1, 3, or 4.
     * @returns {RawImage} `this` to support chaining.
     */
    convert(numChannels) {
        if (this.channels === numChannels) return this; // Already correct number of channels

        switch (numChannels) {
            case 1:
                this.grayscale();
                break;
            case 3:
                this.rgb();
                break;
            case 4:
                this.rgba();
                break;
            default:
                throw new Error(`Conversion failed due to unsupported number of channels: ${this.channels}`);
        }
        return this;
    }

    /**
     * Save the image to the given path.
     * @param {string} path The path to save the image to.
     */
    async save(path) {

        if (BROWSER_ENV) {
            if (WEBWORKER_ENV) {
                throw new Error('Unable to save an image from a Web Worker.')
            }

            const extension = path.split('.').pop().toLowerCase();
            const mime = CONTENT_TYPE_MAP.get(extension) ?? 'image/png';

            // Convert image to Blob
            const blob = await this.toBlob(mime);

            // Convert the canvas content to a data URL
            const dataURL = URL.createObjectURL(blob);

            // Create an anchor element with the data URL as the href attribute
            const downloadLink = document.createElement('a');
            downloadLink.href = dataURL;

            // Set the download attribute to specify the desired filename for the downloaded image
            downloadLink.download = path;

            // Trigger the download
            downloadLink.click();

            // Clean up: remove the anchor element from the DOM
            downloadLink.remove();

        } else if (!env/* env.useFS */.O.useFS) {
            throw new Error('Unable to save the image because filesystem is disabled in this environment.')

        } else {
            const img = this.toSharp();
            return await img.toFile(path);
        }
    }

    toSharp() {
        if (BROWSER_ENV) {
            throw new Error('toSharp() is only supported in server-side environments.')
        }

        return sharp_ignored_(this.data, {
            raw: {
                width: this.width,
                height: this.height,
                channels: this.channels
            }
        });
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@xenova+transformers@2.17.2/node_modules/@xenova/transformers/src/utils/audio.js
/**
 * @file Helper module for audio processing. 
 * 
 * These functions and classes are only used internally, 
 * meaning an end-user shouldn't need to access anything here.
 * 
 * @module utils/audio
 */






/**
 * Helper function to read audio from a path/URL.
 * @param {string|URL} url The path/URL to load the audio from.
 * @param {number} sampling_rate The sampling rate to use when decoding the audio.
 * @returns {Promise<Float32Array>} The decoded audio as a `Float32Array`.
 */
async function read_audio(url, sampling_rate) {
    if (typeof AudioContext === 'undefined') {
        // Running in node or an environment without AudioContext
        throw Error(
            "Unable to load audio from path/URL since `AudioContext` is not available in your environment. " +
            "Instead, audio data should be passed directly to the pipeline/processor. " +
            "For more information and some example code, see https://huggingface.co/docs/transformers.js/guides/node-audio-processing."
        )
    }

    const response = await (await (0,hub/* getFile */.hn)(url)).arrayBuffer();
    const audioCTX = new AudioContext({ sampleRate: sampling_rate });
    if (typeof sampling_rate === 'undefined') {
        console.warn(`No sampling rate provided, using default of ${audioCTX.sampleRate}Hz.`)
    }
    const decoded = await audioCTX.decodeAudioData(response);

    /** @type {Float32Array} */
    let audio;

    // We now replicate HuggingFace's `ffmpeg_read` method:
    if (decoded.numberOfChannels === 2) {
        // When downmixing a stereo audio file to mono using the -ac 1 option in FFmpeg,
        // the audio signal is summed across both channels to create a single mono channel.
        // However, if the audio is at full scale (i.e. the highest possible volume level),
        // the summing of the two channels can cause the audio signal to clip or distort.

        // To prevent this clipping, FFmpeg applies a scaling factor of 1/sqrt(2) (~ 0.707)
        // to the audio signal before summing the two channels. This scaling factor ensures
        // that the combined audio signal will not exceed the maximum possible level, even
        // if both channels are at full scale.

        // After applying this scaling factor, the audio signal from both channels is summed
        // to create a single mono channel. It's worth noting that this scaling factor is
        // only applied when downmixing stereo audio to mono using the -ac 1 option in FFmpeg.
        // If you're using a different downmixing method, or if you're not downmixing the
        // audio at all, this scaling factor may not be needed.
        const SCALING_FACTOR = Math.sqrt(2);

        const left = decoded.getChannelData(0);
        const right = decoded.getChannelData(1);

        audio = new Float32Array(left.length);
        for (let i = 0; i < decoded.length; ++i) {
            audio[i] = SCALING_FACTOR * (left[i] + right[i]) / 2;
        }

    } else {
        // If the audio is not stereo, we can just use the first channel:
        audio = decoded.getChannelData(0);
    }

    return audio;
}

/**
 * Generates a Hanning window of length M.
 *
 * @param {number} M The length of the Hanning window to generate.
 * @returns {Float64Array} The generated Hanning window.
 */
function hanning(M) {
    if (M < 1) {
        return new Float64Array();
    }
    if (M === 1) {
        return new Float64Array([1]);
    }
    const denom = M - 1;
    const factor = Math.PI / denom;
    const cos_vals = new Float64Array(M);
    for (let i = 0; i < M; ++i) {
        const n = 2 * i - denom;
        cos_vals[i] = 0.5 + 0.5 * Math.cos(factor * n);
    }
    return cos_vals;
}

const HERTZ_TO_MEL_MAPPING = {
    "htk": (/** @type {number} */ freq) => 2595.0 * Math.log10(1.0 + (freq / 700.0)),
    "kaldi": (/** @type {number} */ freq) => 1127.0 * Math.log(1.0 + (freq / 700.0)),
    "slaney": (/** @type {number} */ freq, min_log_hertz = 1000.0, min_log_mel = 15.0, logstep = 27.0 / Math.log(6.4)) =>
        freq >= min_log_hertz
            ? min_log_mel + Math.log(freq / min_log_hertz) * logstep
            : 3.0 * freq / 200.0,
}

/**
 * @template {Float32Array|Float64Array|number} T 
 * @param {T} freq 
 * @param {string} [mel_scale]
 * @returns {T}
 */
function hertz_to_mel(freq, mel_scale = "htk") {
    const fn = HERTZ_TO_MEL_MAPPING[mel_scale];
    if (!fn) {
        throw new Error('mel_scale should be one of "htk", "slaney" or "kaldi".');
    }

    return typeof freq === 'number' ? fn(freq) : freq.map(x => fn(x));
}

const MEL_TO_HERTZ_MAPPING = {
    "htk": (/** @type {number} */ mels) => 700.0 * (10.0 ** (mels / 2595.0) - 1.0),
    "kaldi": (/** @type {number} */ mels) => 700.0 * (Math.exp(mels / 1127.0) - 1.0),
    "slaney": (/** @type {number} */ mels, min_log_hertz = 1000.0, min_log_mel = 15.0, logstep = Math.log(6.4) / 27.0) => mels >= min_log_mel
        ? min_log_hertz * Math.exp(logstep * (mels - min_log_mel))
        : 200.0 * mels / 3.0,
}

/**
 * @template {Float32Array|Float64Array|number} T 
 * @param {T} mels 
 * @param {string} [mel_scale]
 * @returns {T}
 */
function mel_to_hertz(mels, mel_scale = "htk") {
    const fn = MEL_TO_HERTZ_MAPPING[mel_scale];
    if (!fn) {
        throw new Error('mel_scale should be one of "htk", "slaney" or "kaldi".');
    }

    return typeof mels === 'number' ? fn(mels) : mels.map(x => fn(x));
}

/**
* Creates a triangular filter bank.
*
* Adapted from torchaudio and librosa.
*
* @param {Float64Array} fft_freqs Discrete frequencies of the FFT bins in Hz, of shape `(num_frequency_bins,)`.
* @param {Float64Array} filter_freqs Center frequencies of the triangular filters to create, in Hz, of shape `(num_mel_filters,)`.
* @returns {number[][]} of shape `(num_frequency_bins, num_mel_filters)`.
*/
function _create_triangular_filter_bank(fft_freqs, filter_freqs) {
    const filter_diff = Float64Array.from(
        { length: filter_freqs.length - 1 },
        (_, i) => filter_freqs[i + 1] - filter_freqs[i]
    );

    const slopes = Array.from({
        length: fft_freqs.length
    }, () => new Array(filter_freqs.length));

    for (let j = 0; j < fft_freqs.length; ++j) {
        const slope = slopes[j];
        for (let i = 0; i < filter_freqs.length; ++i) {
            slope[i] = filter_freqs[i] - fft_freqs[j];
        }
    }

    const numFreqs = filter_freqs.length - 2;
    const ret = Array.from({ length: numFreqs }, () => new Array(fft_freqs.length));

    for (let j = 0; j < fft_freqs.length; ++j) { // 201
        const slope = slopes[j];
        for (let i = 0; i < numFreqs; ++i) { // 80
            const down = -slope[i] / filter_diff[i];
            const up = slope[i + 2] / filter_diff[i + 1];
            ret[i][j] = Math.max(0, Math.min(down, up));
        }
    }
    return ret;
}

/**
 * Return evenly spaced numbers over a specified interval.
 * @param {number} start The starting value of the sequence.
 * @param {number} end The end value of the sequence.
 * @param {number} num Number of samples to generate.
 * @returns `num` evenly spaced samples, calculated over the interval `[start, stop]`.
 */
function linspace(start, end, num) {
    const step = (end - start) / (num - 1);
    return Float64Array.from({ length: num }, (_, i) => start + step * i);
}

/**
 * Creates a frequency bin conversion matrix used to obtain a mel spectrogram. This is called a *mel filter bank*, and
 * various implementation exist, which differ in the number of filters, the shape of the filters, the way the filters
 * are spaced, the bandwidth of the filters, and the manner in which the spectrum is warped. The goal of these
 * features is to approximate the non-linear human perception of the variation in pitch with respect to the frequency.
 * @param {number} num_frequency_bins Number of frequencies used to compute the spectrogram (should be the same as in `stft`).
 * @param {number} num_mel_filters Number of mel filters to generate.
 * @param {number} min_frequency Lowest frequency of interest in Hz.
 * @param {number} max_frequency Highest frequency of interest in Hz. This should not exceed `sampling_rate / 2`.
 * @param {number} sampling_rate Sample rate of the audio waveform.
 * @param {string} [norm] If `"slaney"`, divide the triangular mel weights by the width of the mel band (area normalization).
 * @param {string} [mel_scale] The mel frequency scale to use, `"htk"` or `"slaney"`.
 * @param {boolean} [triangularize_in_mel_space] If this option is enabled, the triangular filter is applied in mel space rather than frequency space.
 * This should be set to `true` in order to get the same results as `torchaudio` when computing mel filters.
 * @returns {number[][]} Triangular filter bank matrix, which is a 2D array of shape (`num_frequency_bins`, `num_mel_filters`).
 * This is a projection matrix to go from a spectrogram to a mel spectrogram.
 */
function mel_filter_bank(
    num_frequency_bins,
    num_mel_filters,
    min_frequency,
    max_frequency,
    sampling_rate,
    norm = null,
    mel_scale = "htk",
    triangularize_in_mel_space = false,
) {
    if (norm !== null && norm !== "slaney") {
        throw new Error('norm must be one of null or "slaney"');
    }

    const mel_min = hertz_to_mel(min_frequency, mel_scale);
    const mel_max = hertz_to_mel(max_frequency, mel_scale);
    const mel_freqs = linspace(mel_min, mel_max, num_mel_filters + 2);

    let filter_freqs = mel_to_hertz(mel_freqs, mel_scale);
    let fft_freqs; // frequencies of FFT bins in Hz

    if (triangularize_in_mel_space) {
        const fft_bin_width = sampling_rate / (num_frequency_bins * 2);
        fft_freqs = hertz_to_mel(Float64Array.from({ length: num_frequency_bins }, (_, i) => i * fft_bin_width), mel_scale);
        filter_freqs = mel_freqs;
    } else {
        fft_freqs = linspace(0, Math.floor(sampling_rate / 2), num_frequency_bins);
    }

    const mel_filters = _create_triangular_filter_bank(fft_freqs, filter_freqs);

    if (norm !== null && norm === "slaney") {
        // Slaney-style mel is scaled to be approx constant energy per channel
        for (let i = 0; i < num_mel_filters; ++i) {
            const filter = mel_filters[i];
            const enorm = 2.0 / (filter_freqs[i + 2] - filter_freqs[i]);
            for (let j = 0; j < num_frequency_bins; ++j) {
                // Apply this enorm to all frequency bins
                filter[j] *= enorm;
            }
        }
    }

    // TODO warn if there is a zero row

    return mel_filters;

}

/**
 * @template {Float32Array|Float64Array} T
 * Pads an array with a reflected version of itself on both ends.
 * @param {T} array The array to pad.
 * @param {number} left The amount of padding to add to the left.
 * @param {number} right The amount of padding to add to the right.
 * @returns {T} The padded array.
 */
function padReflect(array, left, right) {
    // @ts-ignore
    const padded = new array.constructor(array.length + left + right);
    const w = array.length - 1;

    for (let i = 0; i < array.length; ++i) {
        padded[left + i] = array[i];
    }

    for (let i = 1; i <= left; ++i) {
        padded[left - i] = array[(0,core/* calculateReflectOffset */.hs)(i, w)];
    }

    for (let i = 1; i <= right; ++i) {
        padded[w + left + i] = array[(0,core/* calculateReflectOffset */.hs)(w - i, w)];
    }

    return padded;
}

/**
 * Helper function to compute `amplitude_to_db` and `power_to_db`.
 * @template {Float32Array|Float64Array} T
 * @param {T} spectrogram 
 * @param {number} factor 
 * @param {number} reference 
 * @param {number} min_value 
 * @param {number} db_range 
 * @returns {T}
 */
function _db_conversion_helper(spectrogram, factor, reference, min_value, db_range) {
    if (reference <= 0) {
        throw new Error('reference must be greater than zero');
    }

    if (min_value <= 0) {
        throw new Error('min_value must be greater than zero');
    }

    reference = Math.max(min_value, reference);

    const logReference = Math.log10(reference);
    for (let i = 0; i < spectrogram.length; ++i) {
        spectrogram[i] = factor * Math.log10(Math.max(min_value, spectrogram[i]) - logReference)
    }

    if (db_range !== null) {
        if (db_range <= 0) {
            throw new Error('db_range must be greater than zero');
        }
        const maxValue = (0,maths/* max */.Fp)(spectrogram)[0] - db_range;
        for (let i = 0; i < spectrogram.length; ++i) {
            spectrogram[i] = Math.max(spectrogram[i], maxValue);
        }
    }

    return spectrogram;
}

/**
 * Converts an amplitude spectrogram to the decibel scale. This computes `20 * log10(spectrogram / reference)`,
 * using basic logarithm properties for numerical stability. NOTE: Operates in-place.
 * 
 * The motivation behind applying the log function on the (mel) spectrogram is that humans do not hear loudness on a
 * linear scale. Generally to double the perceived volume of a sound we need to put 8 times as much energy into it.
 * This means that large variations in energy may not sound all that different if the sound is loud to begin with.
 * This compression operation makes the (mel) spectrogram features match more closely what humans actually hear.
 * 
 * @template {Float32Array|Float64Array} T
 * @param {T} spectrogram The input amplitude (mel) spectrogram.
 * @param {number} [reference=1.0] Sets the input spectrogram value that corresponds to 0 dB.
 * For example, use `np.max(spectrogram)` to set the loudest part to 0 dB. Must be greater than zero.
 * @param {number} [min_value=1e-5] The spectrogram will be clipped to this minimum value before conversion to decibels,
 * to avoid taking `log(0)`. The default of `1e-5` corresponds to a minimum of -100 dB. Must be greater than zero.
 * @param {number} [db_range=null] Sets the maximum dynamic range in decibels. For example, if `db_range = 80`, the
 * difference between the peak value and the smallest value will never be more than 80 dB. Must be greater than zero.
 * @returns {T} The modified spectrogram in decibels.
 */
function amplitude_to_db(spectrogram, reference = 1.0, min_value = 1e-5, db_range = null) {
    return _db_conversion_helper(spectrogram, 20.0, reference, min_value, db_range);
}

/**
 * Converts a power spectrogram to the decibel scale. This computes `10 * log10(spectrogram / reference)`,
 * using basic logarithm properties for numerical stability. NOTE: Operates in-place.
 * 
 * The motivation behind applying the log function on the (mel) spectrogram is that humans do not hear loudness on a
 * linear scale. Generally to double the perceived volume of a sound we need to put 8 times as much energy into it.
 * This means that large variations in energy may not sound all that different if the sound is loud to begin with.
 * This compression operation makes the (mel) spectrogram features match more closely what humans actually hear.
 * 
 * Based on the implementation of `librosa.power_to_db`.
 * 
 * @template {Float32Array|Float64Array} T
 * @param {T} spectrogram The input power (mel) spectrogram. Note that a power spectrogram has the amplitudes squared!
 * @param {number} [reference=1.0] Sets the input spectrogram value that corresponds to 0 dB.
 * For example, use `np.max(spectrogram)` to set the loudest part to 0 dB. Must be greater than zero.
 * @param {number} [min_value=1e-10] The spectrogram will be clipped to this minimum value before conversion to decibels,
 * to avoid taking `log(0)`. The default of `1e-10` corresponds to a minimum of -100 dB. Must be greater than zero.
 * @param {number} [db_range=null] Sets the maximum dynamic range in decibels. For example, if `db_range = 80`, the
 * difference between the peak value and the smallest value will never be more than 80 dB. Must be greater than zero.
 * @returns {T} The modified spectrogram in decibels.
 */
function power_to_db(spectrogram, reference = 1.0, min_value = 1e-10, db_range = null) {
    return _db_conversion_helper(spectrogram, 10.0, reference, min_value, db_range);
}

/**
 * Calculates a spectrogram over one waveform using the Short-Time Fourier Transform.
 * 
 * This function can create the following kinds of spectrograms:
 *   - amplitude spectrogram (`power = 1.0`)
 *   - power spectrogram (`power = 2.0`)
 *   - complex-valued spectrogram (`power = None`)
 *   - log spectrogram (use `log_mel` argument)
 *   - mel spectrogram (provide `mel_filters`)
 *   - log-mel spectrogram (provide `mel_filters` and `log_mel`)
 *
 * In this implementation, the window is assumed to be zero-padded to have the same size as the analysis frame.
 * A padded window can be obtained from `window_function()`. The FFT input buffer may be larger than the analysis frame, 
 * typically the next power of two.
 * 
 * @param {Float32Array|Float64Array} waveform The input waveform of shape `(length,)`. This must be a single real-valued, mono waveform.
 * @param {Float32Array|Float64Array} window The windowing function to apply of shape `(frame_length,)`, including zero-padding if necessary. The actual window length may be
 * shorter than `frame_length`, but we're assuming the array has already been zero-padded.
 * @param {number} frame_length The length of the analysis frames in samples (a.k.a., `fft_length`).
 * @param {number} hop_length The stride between successive analysis frames in samples.
 * @param {Object} options
 * @param {number} [options.fft_length=null] The size of the FFT buffer in samples. This determines how many frequency bins the spectrogram will have.
 * For optimal speed, this should be a power of two. If `null`, uses `frame_length`.
 * @param {number} [options.power=1.0] If 1.0, returns the amplitude spectrogram. If 2.0, returns the power spectrogram. If `null`, returns complex numbers.
 * @param {boolean} [options.center=true] Whether to pad the waveform so that frame `t` is centered around time `t * hop_length`. If `false`, frame
 * `t` will start at time `t * hop_length`.
 * @param {string} [options.pad_mode="reflect"] Padding mode used when `center` is `true`. Possible values are: `"constant"` (pad with zeros),
 * `"edge"` (pad with edge values), `"reflect"` (pads with mirrored values).
 * @param {boolean} [options.onesided=true] If `true`, only computes the positive frequencies and returns a spectrogram containing `fft_length // 2 + 1`
 * frequency bins. If `false`, also computes the negative frequencies and returns `fft_length` frequency bins.
 * @param {number} [options.preemphasis=null] Coefficient for a low-pass filter that applies pre-emphasis before the DFT.
 * @param {number[][]} [options.mel_filters=null] The mel filter bank of shape `(num_freq_bins, num_mel_filters)`.
 * If supplied, applies this filter bank to create a mel spectrogram.
 * @param {number} [options.mel_floor=1e-10] Minimum value of mel frequency banks.
 * @param {string} [options.log_mel=null] How to convert the spectrogram to log scale. Possible options are:
 * `null` (don't convert), `"log"` (take the natural logarithm) `"log10"` (take the base-10 logarithm), `"dB"` (convert to decibels).
 * Can only be used when `power` is not `null`.
 * @param {number} [options.reference=1.0] Sets the input spectrogram value that corresponds to 0 dB. For example, use `max(spectrogram)[0]` to set
 * the loudest part to 0 dB. Must be greater than zero.
 * @param {number} [options.min_value=1e-10] The spectrogram will be clipped to this minimum value before conversion to decibels, to avoid taking `log(0)`.
 * For a power spectrogram, the default of `1e-10` corresponds to a minimum of -100 dB. For an amplitude spectrogram, the value `1e-5` corresponds to -100 dB.
 * Must be greater than zero.
 * @param {number} [options.db_range=null] Sets the maximum dynamic range in decibels. For example, if `db_range = 80`, the difference between the
 * peak value and the smallest value will never be more than 80 dB. Must be greater than zero.
 * @param {boolean} [options.remove_dc_offset=null] Subtract mean from waveform on each frame, applied before pre-emphasis. This should be set to `true` in
 * order to get the same results as `torchaudio.compliance.kaldi.fbank` when computing mel filters.
 * @param {number} [options.max_num_frames=null] If provided, limits the number of frames to compute to this value.
 * @param {boolean} [options.do_pad=true] If `true`, pads the output spectrogram to have `max_num_frames` frames.
 * @param {boolean} [options.transpose=false] If `true`, the returned spectrogram will have shape `(num_frames, num_frequency_bins/num_mel_filters)`. If `false`, the returned spectrogram will have shape `(num_frequency_bins/num_mel_filters, num_frames)`.
 * @returns {{data: Float32Array, dims: number[]}} Spectrogram of shape `(num_frequency_bins, length)` (regular spectrogram) or shape `(num_mel_filters, length)` (mel spectrogram).
 */
function spectrogram(
    waveform,
    window,
    frame_length,
    hop_length,
    {
        fft_length = null,
        power = 1.0,
        center = true,
        pad_mode = "reflect",
        onesided = true,
        preemphasis = null,
        mel_filters = null,
        mel_floor = 1e-10,
        log_mel = null,
        reference = 1.0,
        min_value = 1e-10,
        db_range = null,
        remove_dc_offset = null,

        // Custom parameters for efficiency reasons
        max_num_frames = null,
        do_pad = true,
        transpose = false,
    } = {}
) {
    const window_length = window.length;
    if (fft_length === null) {
        fft_length = frame_length;
    }
    if (frame_length > fft_length) {
        throw Error(`frame_length (${frame_length}) may not be larger than fft_length (${fft_length})`)
    }

    if (window_length !== frame_length) {
        throw new Error(`Length of the window (${window_length}) must equal frame_length (${frame_length})`);
    }

    if (hop_length <= 0) {
        throw new Error("hop_length must be greater than zero");
    }

    if (power === null && mel_filters !== null) {
        throw new Error(
            "You have provided `mel_filters` but `power` is `None`. Mel spectrogram computation is not yet supported for complex-valued spectrogram. " +
            "Specify `power` to fix this issue."
        );
    }

    if (center) {
        if (pad_mode !== 'reflect') {
            throw new Error(`pad_mode="${pad_mode}" not implemented yet.`)
        }
        const half_window = Math.floor((fft_length - 1) / 2) + 1;
        waveform = padReflect(waveform, half_window, half_window);
    }

    // split waveform into frames of frame_length size
    const num_frames = Math.floor(1 + Math.floor((waveform.length - frame_length) / hop_length))

    const num_frequency_bins = onesided ? Math.floor(fft_length / 2) + 1 : fft_length

    let d1 = num_frames;
    let d1Max = num_frames;

    // If maximum number of frames is provided, we must either pad or truncate
    if (max_num_frames !== null) {
        if (max_num_frames > num_frames) { // input is too short, so we pad
            if (do_pad) {
                d1Max = max_num_frames;
            }
        } else { // input is too long, so we truncate
            d1Max = d1 = max_num_frames;
        }
    }

    // Preallocate arrays to store output.
    const fft = new maths/* FFT */.vw(fft_length);
    const inputBuffer = new Float64Array(fft_length);
    const outputBuffer = new Float64Array(fft.outputBufferSize);
    const magnitudes = new Array(d1);

    for (let i = 0; i < d1; ++i) {
        // Populate buffer with waveform data
        const offset = i * hop_length;
        for (let j = 0; j < frame_length; ++j) {
            inputBuffer[j] = waveform[offset + j];
        }

        if (remove_dc_offset) {
            let sum = 0;
            for (let j = 0; j < frame_length; ++j) {
                sum += inputBuffer[j];
            }
            const mean = sum / frame_length;
            for (let j = 0; j < frame_length; ++j) {
                inputBuffer[j] -= mean;
            }
        }

        if (preemphasis !== null) {
            // Done in reverse to avoid copies and distructive modification
            for (let j = frame_length - 1; j >= 1; --j) {
                inputBuffer[j] -= preemphasis * inputBuffer[j - 1];
            }
            inputBuffer[0] *= 1 - preemphasis;
        }

        for (let j = 0; j < window.length; ++j) {
            inputBuffer[j] *= window[j];
        }

        fft.realTransform(outputBuffer, inputBuffer);

        // compute magnitudes
        const row = new Array(num_frequency_bins);
        for (let j = 0; j < row.length; ++j) {
            const j2 = j << 1;
            row[j] = outputBuffer[j2] ** 2 + outputBuffer[j2 + 1] ** 2;
        }
        magnitudes[i] = row;
    }

    if (power !== null && power !== 2) {
        // slight optimization to not sqrt
        const pow = 2 / power; // we use 2 since we already squared
        for (let i = 0; i < magnitudes.length; ++i) {
            const magnitude = magnitudes[i];
            for (let j = 0; j < magnitude.length; ++j) {
                magnitude[j] **= pow;
            }
        }
    }

    // TODO: What if `mel_filters` is null?
    const num_mel_filters = mel_filters.length;

    // Only here do we create Float32Array
    const mel_spec = new Float32Array(num_mel_filters * d1Max);

    // Perform matrix muliplication:
    // mel_spec = mel_filters @ magnitudes.T
    //  - mel_filters.shape=(80, 201)
    //  - magnitudes.shape=(3000, 201) => - magnitudes.T.shape=(201, 3000)
    //  - mel_spec.shape=(80, 3000)
    const dims = transpose ? [d1Max, num_mel_filters] : [num_mel_filters, d1Max];
    for (let i = 0; i < num_mel_filters; ++i) { // num melfilters (e.g., 80)
        const filter = mel_filters[i];
        for (let j = 0; j < d1; ++j) { // num frames (e.g., 3000)
            const magnitude = magnitudes[j];

            let sum = 0;
            for (let k = 0; k < num_frequency_bins; ++k) { // num frequency bins (e.g., 201)
                sum += filter[k] * magnitude[k];
            }

            mel_spec[
                transpose
                    ? j * num_mel_filters + i
                    : i * d1 + j
            ] = Math.max(mel_floor, sum);
        }
    }

    if (power !== null && log_mel !== null) {
        const o = Math.min(mel_spec.length, d1 * num_mel_filters);
        switch (log_mel) {
            case 'log':
                for (let i = 0; i < o; ++i) {
                    mel_spec[i] = Math.log(mel_spec[i]);
                }
                break;
            case 'log10':
                for (let i = 0; i < o; ++i) {
                    mel_spec[i] = Math.log10(mel_spec[i]);
                }
                break;
            case 'dB':
                if (power === 1.0) {
                    // NOTE: operates in-place
                    amplitude_to_db(mel_spec, reference, min_value, db_range);
                } else if (power === 2.0) {
                    power_to_db(mel_spec, reference, min_value, db_range);
                } else {
                    throw new Error(`Cannot use log_mel option '${log_mel}' with power ${power}`)
                }
                break;
            default:
                throw new Error(`log_mel must be one of null, 'log', 'log10' or 'dB'. Got '${log_mel}'`);
        }
    }

    return { data: mel_spec, dims };
}

/**
 * Returns an array containing the specified window.
 * @param {number} window_length The length of the window in samples.
 * @param {string} name The name of the window function.
 * @param {Object} options Additional options.
 * @param {boolean} [options.periodic=true] Whether the window is periodic or symmetric.
 * @param {number} [options.frame_length=null] The length of the analysis frames in samples.
 * Provide a value for `frame_length` if the window is smaller than the frame length, so that it will be zero-padded.
 * @param {boolean} [options.center=true] Whether to center the window inside the FFT buffer. Only used when `frame_length` is provided.
 * @returns {Float64Array} The window of shape `(window_length,)` or `(frame_length,)`.
 */
function window_function(window_length, name, {
    periodic = true,
    frame_length = null,
    center = true,
} = {}) {
    const length = periodic ? window_length + 1 : window_length;
    let window;
    switch (name) {
        case 'boxcar':
            window = new Float64Array(length).fill(1.0);
            break;
        case 'hann':
        case 'hann_window':
            window = hanning(length);
            break;
        case 'povey':
            window = hanning(length).map(x => Math.pow(x, 0.85));
            break;
        default:
            throw new Error(`Unknown window type ${name}.`);
    }
    if (periodic) {
        window = window.subarray(0, window_length);
    }
    if (frame_length === null) {
        return window;
    }
    if (window_length > frame_length) {
        throw new Error(`Length of the window (${window_length}) may not be larger than frame_length (${frame_length})`);
    }

    return window;
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@xenova+transformers@2.17.2/node_modules/@xenova/transformers/src/processors.js

/**
 * @file Processors are used to prepare non-textual inputs (e.g., image or audio) for a model.
 * 
 * **Example:** Using a `WhisperProcessor` to prepare an audio input for a model.
 * ```javascript
 * import { AutoProcessor, read_audio } from '@xenova/transformers';
 *
 * let processor = await AutoProcessor.from_pretrained('openai/whisper-tiny.en');
 * let audio = await read_audio('https://huggingface.co/datasets/Narsil/asr_dummy/resolve/main/mlk.flac', 16000);
 * let { input_features } = await processor(audio);
 * // Tensor {
 * //   data: Float32Array(240000) [0.4752984642982483, 0.5597258806228638, 0.56434166431427, ...],
 * //   dims: [1, 80, 3000],
 * //   type: 'float32',
 * //   size: 240000,
 * // }
 * ```
 * 
 * @module processors
 */













// Helper functions

/**
 * Converts bounding boxes from center format to corners format.
 * 
 * @param {number[]} arr The coordinate for the center of the box and its width, height dimensions (center_x, center_y, width, height)
 * @returns {number[]} The coodinates for the top-left and bottom-right corners of the box (top_left_x, top_left_y, bottom_right_x, bottom_right_y)
 */
function center_to_corners_format([centerX, centerY, width, height]) {
    return [
        centerX - width / 2,
        centerY - height / 2,
        centerX + width / 2,
        centerY + height / 2
    ];
}

/**
 * Post-processes the outputs of the model (for object detection).
 * @param {Object} outputs The outputs of the model that must be post-processed
 * @param {Tensor} outputs.logits The logits
 * @param {Tensor} outputs.pred_boxes The predicted boxes.
 * @param {number} [threshold=0.5] The threshold to use for the scores.
 * @param {number[][]} [target_sizes=null] The sizes of the original images.
 * @param {boolean} [is_zero_shot=false] Whether zero-shot object detection was performed.
 * @return {Object[]} An array of objects containing the post-processed outputs.
 * @private
 */
function post_process_object_detection(outputs, threshold = 0.5, target_sizes = null, is_zero_shot = false) {
    const out_logits = outputs.logits;
    const out_bbox = outputs.pred_boxes;
    const [batch_size, num_boxes, num_classes] = out_logits.dims;

    if (target_sizes !== null && target_sizes.length !== batch_size) {
        throw Error("Make sure that you pass in as many target sizes as the batch dimension of the logits")
    }
    let toReturn = [];
    for (let i = 0; i < batch_size; ++i) {
        let target_size = target_sizes !== null ? target_sizes[i] : null;
        let info = {
            boxes: [],
            classes: [],
            scores: []
        }
        let logits = out_logits[i];
        let bbox = out_bbox[i];

        for (let j = 0; j < num_boxes; ++j) {
            let logit = logits[j];

            let indices = [];
            let probs;
            if (is_zero_shot) {
                // Get indices of classes with high enough probability
                probs = logit.sigmoid().data;
                for (let k = 0; k < probs.length; ++k) {
                    if (probs[k] > threshold) {
                        indices.push(k);
                    }
                }

            } else {
                // Get most probable class
                let maxIndex = (0,maths/* max */.Fp)(logit.data)[1];

                if (maxIndex === num_classes - 1) {
                    // This is the background class, skip it
                    continue;
                }
                indices.push(maxIndex);

                // Compute softmax over classes
                probs = (0,maths/* softmax */.XA)(logit.data);
            }

            for (const index of indices) {

                // Some class has a high enough probability
                /** @type {number[]} */
                let box = bbox[j].data;

                // convert to [x0, y0, x1, y1] format
                box = center_to_corners_format(box)
                if (target_size !== null) {
                    box = box.map((x, i) => x * target_size[(i + 1) % 2])
                }

                info.boxes.push(box);
                info.classes.push(index);
                info.scores.push(probs[index]);
            }
        }
        toReturn.push(info);
    }
    return toReturn;
}

/**
 * Named tuple to indicate the order we are using is (height x width), even though
 * the Graphics’ industry standard is (width x height).
 * @typedef {[height: number, width: number]} HeightWidth
 */

/**
 * Helper function to validate audio inputs.
 * @param {any} audio The audio data.
 * @param {string} feature_extractor The name of the feature extractor.
 * @private
 */
function validate_audio_inputs(audio, feature_extractor) {
    if (!(audio instanceof Float32Array || audio instanceof Float64Array)) {
        throw new Error(
            `${feature_extractor} expects input to be a Float32Array or a Float64Array, but got ${audio?.constructor?.name ?? typeof audio} instead. ` +
            `If using the feature extractor directly, remember to use \`read_audio(url, sampling_rate)\` to obtain the raw audio data of the file/url.`
        )
    }
}

/**
 * Helper function to constrain a value to be a multiple of a number.
 * @param {number} val The value to constrain.
 * @param {number} multiple The number to constrain to.
 * @param {number} [minVal=0] The minimum value to constrain to.
 * @param {number} [maxVal=null] The maximum value to constrain to.
 * @returns {number} The constrained value.
 * @private
 */
function constraint_to_multiple_of(val, multiple, minVal = 0, maxVal = null) {
    const a = val / multiple;
    let x = (0,maths/* bankers_round */.eT)(a) * multiple;

    if (maxVal !== null && x > maxVal) {
        x = Math.floor(a) * multiple;
    }

    if (x < minVal) {
        x = Math.ceil(a) * multiple;
    }

    return x;
}

/**
 * Rounds the height and width down to the closest multiple of size_divisibility
 * @param {[number, number]} size The size of the image
 * @param {number} divisor The divisor to use.
 * @returns {[number, number]} The rounded size.
 */
function enforce_size_divisibility([width, height], divisor) {
    return [
        Math.max(Math.floor(width / divisor), 1) * divisor,
        Math.max(Math.floor(height / divisor), 1) * divisor
    ];
}


/**
 * Base class for feature extractors.
 *
 * @extends Callable
 */
class FeatureExtractor extends core/* Callable */.Ag {
    /**
     * Constructs a new FeatureExtractor instance.
     *
     * @param {Object} config The configuration for the feature extractor.
     */
    constructor(config) {
        super();
        this.config = config
    }
}

/**
 * @typedef {object} ImageFeatureExtractorResult
 * @property {Tensor} pixel_values The pixel values of the batched preprocessed images.
 * @property {HeightWidth[]} original_sizes Array of two-dimensional tuples like [[480, 640]].
 * @property {HeightWidth[]} reshaped_input_sizes Array of two-dimensional tuples like [[1000, 1330]].
 */

/**
 * Feature extractor for image models.
 *
 * @extends FeatureExtractor
 */
class ImageFeatureExtractor extends FeatureExtractor {

    /**
     * Constructs a new ImageFeatureExtractor instance.
     *
     * @param {Object} config The configuration for the feature extractor.
     * @param {number[]} config.image_mean The mean values for image normalization.
     * @param {number[]} config.image_std The standard deviation values for image normalization.
     * @param {boolean} config.do_rescale Whether to rescale the image pixel values to the [0,1] range.
     * @param {number} config.rescale_factor The factor to use for rescaling the image pixel values.
     * @param {boolean} config.do_normalize Whether to normalize the image pixel values.
     * @param {boolean} config.do_resize Whether to resize the image.
     * @param {number} config.resample What method to use for resampling.
     * @param {number|Object} config.size The size to resize the image to.
     * @param {boolean} [config.do_flip_channel_order=false] Whether to flip the color channels from RGB to BGR.
     * Can be overridden by the `do_flip_channel_order` parameter in the `preprocess` method.
     */
    constructor(config) {
        super(config);

        this.image_mean = this.config.image_mean ?? this.config.mean;
        this.image_std = this.config.image_std ?? this.config.std;

        this.resample = this.config.resample ?? 2; // 2 => bilinear
        this.do_rescale = this.config.do_rescale ?? true;
        this.rescale_factor = this.config.rescale_factor ?? (1 / 255);
        this.do_normalize = this.config.do_normalize;

        this.do_resize = this.config.do_resize;
        this.do_thumbnail = this.config.do_thumbnail;
        this.size = this.config.size;
        this.size_divisibility = this.config.size_divisibility ?? this.config.size_divisor;

        this.do_center_crop = this.config.do_center_crop;
        this.crop_size = this.config.crop_size;
        this.do_convert_rgb = this.config.do_convert_rgb ?? true;
        this.do_crop_margin = this.config.do_crop_margin;

        this.pad_size = this.config.pad_size;
        this.do_pad = this.config.do_pad;

        if (this.do_pad && !this.pad_size && this.size && this.size.width !== undefined && this.size.height !== undefined) {
            // Should pad, but no pad size specified
            // We infer the pad size from the resize size
            this.pad_size = this.size
        }

        this.do_flip_channel_order = this.config.do_flip_channel_order ?? false;
    }

    /**
     * Resize the image to make a thumbnail. The image is resized so that no dimension is larger than any
     * corresponding dimension of the specified size.
     * @param {RawImage} image The image to be resized.
     * @param {{height:number, width:number}} size The size `{"height": h, "width": w}` to resize the image to.
     * @param {string | 0 | 1 | 2 | 3 | 4 | 5} [resample=2] The resampling filter to use.
     * @returns {Promise<RawImage>} The resized image.
     */
    async thumbnail(image, size, resample = 2) {
        const input_height = image.height;
        const input_width = image.width;

        const output_height = size.height;
        const output_width = size.width;

        // We always resize to the smallest of either the input or output size.
        let height = Math.min(input_height, output_height)
        let width = Math.min(input_width, output_width)

        if (height === input_height && width === input_width) {
            return image;
        }
        if (input_height > input_width) {
            width = Math.floor(input_width * height / input_height);
        } else if (input_width > input_height) {
            height = Math.floor(input_height * width / input_width);
        }
        return await image.resize(width, height, { resample });
    }


    /**
     * Crops the margin of the image. Gray pixels are considered margin (i.e., pixels with a value below the threshold).
     * @param {RawImage} image The image to be cropped.
     * @param {number} gray_threshold Value below which pixels are considered to be gray.
     * @returns {Promise<RawImage>} The cropped image.
     */
    async crop_margin(image, gray_threshold = 200) {

        const gray_image = image.clone().grayscale();

        const minValue = (0,maths/* min */.VV)(gray_image.data)[0];
        const maxValue = (0,maths/* max */.Fp)(gray_image.data)[0];
        const diff = maxValue - minValue;

        if (diff === 0) {
            return image;
        }

        const threshold = gray_threshold / 255;

        let x_min = gray_image.width, y_min = gray_image.height, x_max = 0, y_max = 0;
        for (let j = 0; j < gray_image.height; ++j) {
            const row = j * gray_image.width;
            for (let i = 0; i < gray_image.width; ++i) {
                if ((gray_image.data[row + i] - minValue) / diff < threshold) {
                    // We have a non-zero pixel, so we update the min/max values accordingly
                    x_min = Math.min(x_min, i);
                    y_min = Math.min(y_min, j);
                    x_max = Math.max(x_max, i);
                    y_max = Math.max(y_max, j);
                }
            }
        }

        image = await image.crop([x_min, y_min, x_max, y_max]);
        return image;
    }

    /**
     * Pad the image by a certain amount.
     * @param {Float32Array} pixelData The pixel data to pad.
     * @param {number[]} imgDims The dimensions of the image (height, width, channels).
     * @param {{width:number; height:number}|number} padSize The dimensions of the padded image.
     * @param {Object} options The options for padding.
     * @param {'constant'|'symmetric'} [options.mode='constant'] The type of padding to add.
     * @param {boolean} [options.center=false] Whether to center the image.
     * @param {number} [options.constant_values=0] The constant value to use for padding.
     * @returns {[Float32Array, number[]]} The padded pixel data and image dimensions.
     */
    pad_image(pixelData, imgDims, padSize, {
        mode = 'constant',
        center = false,
        constant_values = 0,
    } = {}) {
        const [imageHeight, imageWidth, imageChannels] = imgDims;

        let paddedImageWidth, paddedImageHeight;
        if (typeof padSize === 'number') {
            paddedImageWidth = padSize;
            paddedImageHeight = padSize;
        } else {
            paddedImageWidth = padSize.width;
            paddedImageHeight = padSize.height;
        }

        // Only add padding if there is a difference in size
        if (paddedImageWidth !== imageWidth || paddedImageHeight !== imageHeight) {
            const paddedPixelData = new Float32Array(paddedImageWidth * paddedImageHeight * imageChannels);
            if (Array.isArray(constant_values)) {
                // Fill with constant values, cycling through the array
                for (let i = 0; i < paddedPixelData.length; ++i) {
                    paddedPixelData[i] = constant_values[i % imageChannels];
                }
            } else if (constant_values !== 0) {
                paddedPixelData.fill(constant_values);
            }

            const [left, top] = center
                ? [Math.floor((paddedImageWidth - imageWidth) / 2), Math.floor((paddedImageHeight - imageHeight) / 2)]
                : [0, 0];

            // Copy the original image into the padded image
            for (let i = 0; i < imageHeight; ++i) {
                const a = (i + top) * paddedImageWidth;
                const b = i * imageWidth;
                for (let j = 0; j < imageWidth; ++j) {
                    const c = (a + j + left) * imageChannels;
                    const d = (b + j) * imageChannels;
                    for (let k = 0; k < imageChannels; ++k) {
                        paddedPixelData[c + k] = pixelData[d + k];
                    }
                }
            }

            if (mode === 'symmetric') {
                if (center) {
                    throw new Error('`center` padding is not supported when `mode` is set to `symmetric`.');
                    // TODO: Implement this
                }
                const h1 = imageHeight - 1;
                const w1 = imageWidth - 1;
                for (let i = 0; i < paddedImageHeight; ++i) {
                    const a = i * paddedImageWidth;
                    const b = (0,core/* calculateReflectOffset */.hs)(i, h1) * imageWidth;

                    for (let j = 0; j < paddedImageWidth; ++j) {
                        if (i < imageHeight && j < imageWidth) continue; // Do not overwrite original image
                        const c = (a + j) * imageChannels;
                        const d = (b + (0,core/* calculateReflectOffset */.hs)(j, w1)) * imageChannels;

                        // Copy channel-wise
                        for (let k = 0; k < imageChannels; ++k) {
                            paddedPixelData[c + k] = pixelData[d + k];
                        }
                    }
                }
            }


            // Update pixel data and image dimensions
            pixelData = paddedPixelData;
            imgDims = [paddedImageHeight, paddedImageWidth, imageChannels]
        }
        return [pixelData, imgDims];
    }

    /**
     * Rescale the image' pixel values by `this.rescale_factor`.
     * @param {Float32Array} pixelData The pixel data to rescale.
     * @returns {void}
     */
    rescale(pixelData) {
        for (let i = 0; i < pixelData.length; ++i) {
            pixelData[i] = this.rescale_factor * pixelData[i];
        }
    }

    /**
     * Find the target (width, height) dimension of the output image after
     * resizing given the input image and the desired size.
     * @param {RawImage} image The image to resize.
     * @param {any} size The size to use for resizing the image. 
     * @returns {[number, number]} The target (width, height) dimension of the output image after resizing.
     */
    get_resize_output_image_size(image, size) {
        // `size` comes in many forms, so we need to handle them all here:
        // 1. `size` is an integer, in which case we resize the image to be a square 

        const [srcWidth, srcHeight] = image.size;

        let shortest_edge;
        let longest_edge;

        if (this.do_thumbnail) {
            // NOTE: custom logic for `Donut` models
            const { height, width } = size;
            shortest_edge = Math.min(height, width)
        }
        // Support both formats for backwards compatibility
        else if (Number.isInteger(size)) {
            shortest_edge = size;
            longest_edge = this.config.max_size ?? shortest_edge;

        } else if (size !== undefined) {
            // Extract known properties from `size`
            shortest_edge = size.shortest_edge;
            longest_edge = size.longest_edge;
        }

        // If `longest_edge` and `shortest_edge` are set, maintain aspect ratio and resize to `shortest_edge`
        // while keeping the largest dimension <= `longest_edge`
        if (shortest_edge !== undefined || longest_edge !== undefined) {
            // http://opensourcehacker.com/2011/12/01/calculate-aspect-ratio-conserving-resize-for-images-in-javascript/
            // Try resize so that shortest edge is `shortest_edge` (target)
            const shortResizeFactor = shortest_edge === undefined
                ? 1 // If `shortest_edge` is not set, don't upscale
                : Math.max(shortest_edge / srcWidth, shortest_edge / srcHeight);

            const newWidth = srcWidth * shortResizeFactor;
            const newHeight = srcHeight * shortResizeFactor;

            // The new width and height might be greater than `longest_edge`, so
            // we downscale again to ensure the largest dimension is `longest_edge` 
            const longResizeFactor = longest_edge === undefined
                ? 1 // If `longest_edge` is not set, don't downscale
                : Math.min(longest_edge / newWidth, longest_edge / newHeight);

            // To avoid certain floating point precision issues, we round to 2 decimal places
            let finalWidth = Math.floor(Number((newWidth * longResizeFactor).toFixed(2)));
            let finalHeight = Math.floor(Number((newHeight * longResizeFactor).toFixed(2)));

            if (this.size_divisibility !== undefined) {
                [finalWidth, finalHeight] = enforce_size_divisibility([finalWidth, finalHeight], this.size_divisibility)
            }
            return [finalWidth, finalHeight];

        } else if (size !== undefined && size.width !== undefined && size.height !== undefined) {
            // If `width` and `height` are set, resize to those dimensions

            let newWidth = size.width;
            let newHeight = size.height;

            // Custom for DPT models
            if (this.config.keep_aspect_ratio && this.config.ensure_multiple_of) {

                // determine new height and width
                let scale_height = newHeight / srcHeight;
                let scale_width = newWidth / srcWidth;

                // scale as little as possible
                if (Math.abs(1 - scale_width) < Math.abs(1 - scale_height)) {
                    // fit width
                    scale_height = scale_width;
                } else {
                    // fit height
                    scale_width = scale_height;
                }

                newHeight = constraint_to_multiple_of(scale_height * srcHeight, this.config.ensure_multiple_of);
                newWidth = constraint_to_multiple_of(scale_width * srcWidth, this.config.ensure_multiple_of);
            }

            return [newWidth, newHeight];

        } else if (this.size_divisibility !== undefined) {
            return enforce_size_divisibility([srcWidth, srcHeight], this.size_divisibility);
        } else {
            throw new Error(`Could not resize image due to unsupported \`this.size\` option in config: ${JSON.stringify(size)}`);
        }
    }

    /**
     * Resizes the image.
     * @param {RawImage} image The image to resize.
     * @returns {Promise<RawImage>} The resized image.
     */
    async resize(image) {
        const [newWidth, newHeight] = this.get_resize_output_image_size(image, this.size);
        return await image.resize(newWidth, newHeight, {
            resample: this.resample,
        });
    }

    /**
     * @typedef {object} PreprocessedImage
     * @property {HeightWidth} original_size The original size of the image.
     * @property {HeightWidth} reshaped_input_size The reshaped input size of the image.
     * @property {Tensor} pixel_values The pixel values of the preprocessed image.
     */

    /**
     * Preprocesses the given image.
     *
     * @param {RawImage} image The image to preprocess.
     * @param {Object} overrides The overrides for the preprocessing options.
     * @returns {Promise<PreprocessedImage>} The preprocessed image.
     */
    async preprocess(image, {
        do_normalize = null,
        do_pad = null,
        do_convert_rgb = null,
        do_convert_grayscale = null,
        do_flip_channel_order = null,
    } = {}) {
        if (this.do_crop_margin) {
            // NOTE: Specific to nougat processors. This is done before resizing,
            // and can be interpreted as a pre-preprocessing step.
            image = await this.crop_margin(image);
        }

        const [srcWidth, srcHeight] = image.size; // original image size

        // Convert image to RGB if specified in config.
        if (do_convert_rgb ?? this.do_convert_rgb) {
            image = image.rgb();
        } else if (do_convert_grayscale) {
            image = image.grayscale();
        }

        // TODO:
        // For efficiency reasons, it might be best to merge the resize and center crop operations into one.

        // Resize all images
        if (this.do_resize) {
            image = await this.resize(image);
        }

        // Resize the image using thumbnail method.
        if (this.do_thumbnail) {
            image = await this.thumbnail(image, this.size, this.resample);
        }

        if (this.do_center_crop) {

            let crop_width;
            let crop_height;
            if (Number.isInteger(this.crop_size)) {
                crop_width = this.crop_size;
                crop_height = this.crop_size;
            } else {
                crop_width = this.crop_size.width;
                crop_height = this.crop_size.height;
            }

            image = await image.center_crop(crop_width, crop_height);
        }

        /** @type {HeightWidth} */
        const reshaped_input_size = [image.height, image.width];

        // NOTE: All pixel-level manipulation (i.e., modifying `pixelData`)
        // occurs with data in the hwc format (height, width, channels), 
        // to emulate the behavior of the original Python code (w/ numpy).
        let pixelData = Float32Array.from(image.data);
        let imgDims = [image.height, image.width, image.channels];

        if (this.do_rescale) {
            this.rescale(pixelData);
        }

        if (do_normalize ?? this.do_normalize) {
            let image_mean = this.image_mean;
            if (!Array.isArray(this.image_mean)) {
                image_mean = new Array(image.channels).fill(image_mean);
            }

            let image_std = this.image_std;
            if (!Array.isArray(this.image_std)) {
                image_std = new Array(image.channels).fill(image_mean);
            }

            if (image_mean.length !== image.channels || image_std.length !== image.channels) {
                throw new Error(`When set to arrays, the length of \`image_mean\` (${image_mean.length}) and \`image_std\` (${image_std.length}) must match the number of channels in the image (${image.channels}).`);
            }

            for (let i = 0; i < pixelData.length; i += image.channels) {
                for (let j = 0; j < image.channels; ++j) {
                    pixelData[i + j] = (pixelData[i + j] - image_mean[j]) / image_std[j];
                }
            }
        }

        // do padding after rescaling/normalizing
        if (do_pad ?? this.do_pad) {
            if (this.pad_size) {
                const padded = this.pad_image(pixelData, [image.height, image.width, image.channels], this.pad_size);
                [pixelData, imgDims] = padded; // Update pixel data and image dimensions
            } else if (this.size_divisibility) {
                const [paddedWidth, paddedHeight] = enforce_size_divisibility([imgDims[1], imgDims[0]], this.size_divisibility);
                [pixelData, imgDims] = this.pad_image(pixelData, imgDims, { width: paddedWidth, height: paddedHeight });
            }
        }

        if (do_flip_channel_order ?? this.do_flip_channel_order) {
            if (imgDims[2] !== 3) {
                throw new Error('Flipping channel order is only supported for RGB images.');
            }
            // Convert RGB to BGR
            for (let i = 0; i < pixelData.length; i += 3) {
                const temp = pixelData[i];
                pixelData[i] = pixelData[i + 2];
                pixelData[i + 2] = temp;
            }
        }

        const pixel_values = new utils_tensor/* Tensor */.es('float32', pixelData, imgDims)
            .permute(2, 0, 1); // convert to channel dimension format (hwc -> chw)

        return {
            original_size: [srcHeight, srcWidth],
            reshaped_input_size: reshaped_input_size,
            pixel_values: pixel_values,
        }
    }

    /**
     * Calls the feature extraction process on an array of images,
     * preprocesses each image, and concatenates the resulting
     * features into a single Tensor.
     * @param {RawImage[]} images The image(s) to extract features from.
     * @param {...any} args Additional arguments.
     * @returns {Promise<ImageFeatureExtractorResult>} An object containing the concatenated pixel values (and other metadata) of the preprocessed images.
     */
    async _call(images, ...args) {
        if (!Array.isArray(images)) {
            images = [images];
        }
        /** @type {PreprocessedImage[]} */
        const imageData = await Promise.all(images.map(x => this.preprocess(x)));

        // Stack pixel values
        const pixel_values = (0,utils_tensor/* stack */.kn)(imageData.map(x => x.pixel_values), 0);

        return {
            pixel_values: pixel_values,

            // Original sizes of images
            original_sizes: imageData.map(x => x.original_size),

            // Reshaped sizes of images, before padding or cropping
            reshaped_input_sizes: imageData.map(x => x.reshaped_input_size),
        }
    }

}

class SegformerFeatureExtractor extends ImageFeatureExtractor {

    /**
     * Converts the output of `SegformerForSemanticSegmentation` into semantic segmentation maps.
     * @param {*} outputs Raw outputs of the model.
     * @param {number[][]} [target_sizes=null] List of tuples corresponding to the requested final size
     * (height, width) of each prediction. If unset, predictions will not be resized.
     * @returns {{segmentation: Tensor; labels: number[]}[]} The semantic segmentation maps.
     */
    post_process_semantic_segmentation(outputs, target_sizes = null) {

        const logits = outputs.logits;
        const batch_size = logits.dims[0];

        if (target_sizes !== null && target_sizes.length !== batch_size) {
            throw Error("Make sure that you pass in as many target sizes as the batch dimension of the logits")
        }

        const toReturn = [];
        for (let i = 0; i < batch_size; ++i) {
            const target_size = target_sizes !== null ? target_sizes[i] : null;

            let data = logits[i];

            // 1. If target_size is not null, we need to resize the masks to the target size
            if (target_size !== null) {
                // resize the masks to the target size
                data = (0,utils_tensor/* interpolate */.sX)(data, target_size, 'bilinear', false);
            }
            const [height, width] = target_size ?? data.dims.slice(-2);

            const segmentation = new utils_tensor/* Tensor */.es(
                'int32',
                new Int32Array(height * width),
                [height, width]
            );

            // Buffer to store current largest value
            const buffer = data[0].data;
            for (let j = 1; j < data.dims[0]; ++j) {
                const row = data[j].data;
                for (let k = 0; k < row.length; ++k) {
                    if (row[k] > buffer[k]) {
                        buffer[k] = row[k];
                        segmentation.data[k] = j;
                    }
                }
            }

            // Store which objects have labels
            // This is much more efficient that creating a set of the final values
            const hasLabel = new Array(data.dims[0]);
            const out = segmentation.data;
            for (let j = 0; j < out.length; ++j) {
                const index = out[j];
                hasLabel[index] = index;
            }
            /** @type {number[]} The unique list of labels that were detected */
            const labels = hasLabel.filter(x => x !== undefined);

            toReturn.push({ segmentation, labels });
        }
        return toReturn;
    }
}
class DPTFeatureExtractor extends ImageFeatureExtractor { }
class DPTImageProcessor extends DPTFeatureExtractor { } // NOTE: extends DPTFeatureExtractor
class BitImageProcessor extends ImageFeatureExtractor { }
class GLPNFeatureExtractor extends ImageFeatureExtractor { }
class CLIPFeatureExtractor extends ImageFeatureExtractor { }
class ChineseCLIPFeatureExtractor extends ImageFeatureExtractor { }
class SiglipImageProcessor extends ImageFeatureExtractor { }
class ConvNextFeatureExtractor extends ImageFeatureExtractor {
    constructor(config) {
        super(config);

        /**
         * Percentage of the image to crop. Only has an effect if this.size < 384.
         */
        this.crop_pct = this.config.crop_pct ?? (224 / 256);
    }

    async resize(image) {
        const shortest_edge = this.size?.shortest_edge;
        if (shortest_edge === undefined) {
            throw new Error(`Size dictionary must contain 'shortest_edge' key.`);
        }

        if (shortest_edge < 384) {
            // maintain same ratio, resizing shortest edge to shortest_edge/crop_pct
            const resize_shortest_edge = Math.floor(shortest_edge / this.crop_pct);

            const [newWidth, newHeight] = this.get_resize_output_image_size(image, {
                shortest_edge: resize_shortest_edge,
            });

            image = await image.resize(newWidth, newHeight, {
                resample: this.resample,
            });

            // then crop to (shortest_edge, shortest_edge)
            image = await image.center_crop(shortest_edge, shortest_edge);
        } else {
            // warping (no cropping) when evaluated at 384 or larger
            image = await image.resize(shortest_edge, shortest_edge, {
                resample: this.resample,
            });
        }

        return image;
    }
}
class ConvNextImageProcessor extends ConvNextFeatureExtractor { }  // NOTE extends ConvNextFeatureExtractor
class ViTFeatureExtractor extends ImageFeatureExtractor { }
class ViTImageProcessor extends ImageFeatureExtractor { }

class EfficientNetImageProcessor extends ImageFeatureExtractor {
    constructor(config) {
        super(config);
        this.include_top = this.config.include_top ?? true;
        if (this.include_top) {
            this.image_std = this.image_std.map(x => x * x);
        }
    }
}


class MobileViTFeatureExtractor extends ImageFeatureExtractor { }
class MobileViTImageProcessor extends MobileViTFeatureExtractor { } // NOTE extends MobileViTFeatureExtractor
class OwlViTFeatureExtractor extends ImageFeatureExtractor {
    /** @type {post_process_object_detection} */
    post_process_object_detection(...args) {
        return post_process_object_detection(...args);
    }
}
class Owlv2ImageProcessor extends OwlViTFeatureExtractor { } // NOTE extends OwlViTFeatureExtractor

class DeiTFeatureExtractor extends ImageFeatureExtractor { }
class BeitFeatureExtractor extends ImageFeatureExtractor { }
class DonutFeatureExtractor extends ImageFeatureExtractor {
    pad_image(pixelData, imgDims, padSize, options = {}) {
        const [imageHeight, imageWidth, imageChannels] = imgDims;

        let image_mean = this.image_mean;
        if (!Array.isArray(this.image_mean)) {
            image_mean = new Array(imageChannels).fill(image_mean);
        }

        let image_std = this.image_std;
        if (!Array.isArray(image_std)) {
            image_std = new Array(imageChannels).fill(image_mean);
        }

        const constant_values = image_mean.map((x, i) => - x / image_std[i]);

        return super.pad_image(pixelData, imgDims, padSize, {
            center: true,

            // Since normalization is done after padding, we need to use certain constant values to ensure the same behaviour is observed.
            // For more information, see https://github.com/huggingface/transformers/blob/main/src/transformers/models/donut/image_processing_donut.py#L433-L451
            constant_values: constant_values,
            ...options,
        });
    }
}
class NougatImageProcessor extends DonutFeatureExtractor { } // NOTE extends DonutFeatureExtractor

/**
 * @typedef {object} DetrFeatureExtractorResultProps
 * @property {Tensor} pixel_mask
 * @typedef {ImageFeatureExtractorResult & DetrFeatureExtractorResultProps} DetrFeatureExtractorResult
 */

/**
 * Detr Feature Extractor.
 *
 * @extends ImageFeatureExtractor
 */
class DetrFeatureExtractor extends ImageFeatureExtractor {
    /**
     * Calls the feature extraction process on an array of images, preprocesses
     * each image, and concatenates the resulting features into a single Tensor.
     * @param {RawImage[]} images The image(s) to extract features from.
     * @returns {Promise<DetrFeatureExtractorResult>} An object containing the concatenated pixel values of the preprocessed images.
     */
    async _call(images) {
        const result = await super._call(images);

        // TODO support differently-sized images, for now assume all images are the same size.
        // TODO support different mask sizes (not just 64x64)
        // Currently, just fill pixel mask with 1s
        const maskSize = [result.pixel_values.dims[0], 64, 64];
        const pixel_mask = new utils_tensor/* Tensor */.es(
            'int64',
            new BigInt64Array(maskSize.reduce((a, b) => a * b)).fill(1n),
            maskSize
        );

        return { ...result, pixel_mask };
    }

    /**
     * Post-processes the outputs of the model (for object detection).
     * @param {Object} outputs The outputs of the model that must be post-processed
     * @param {Tensor} outputs.logits The logits
     * @param {Tensor} outputs.pred_boxes The predicted boxes.
     * @return {Object[]} An array of objects containing the post-processed outputs.
     */

    /** @type {post_process_object_detection} */
    post_process_object_detection(...args) {
        return post_process_object_detection(...args);
    }

    /**
     * Binarize the given masks using `object_mask_threshold`, it returns the associated values of `masks`, `scores` and `labels`.
     * @param {Tensor} class_logits The class logits.
     * @param {Tensor} mask_logits The mask logits.
     * @param {number} object_mask_threshold A number between 0 and 1 used to binarize the masks.
     * @param {number} num_labels The number of labels.
     * @returns {[Tensor[], number[], number[]]} The binarized masks, the scores, and the labels.
     */
    remove_low_and_no_objects(class_logits, mask_logits, object_mask_threshold, num_labels) {

        let mask_probs_item = [];
        let pred_scores_item = [];
        let pred_labels_item = [];

        for (let j = 0; j < class_logits.dims[0]; ++j) {
            let cls = class_logits[j];
            let mask = mask_logits[j];

            let pred_label = (0,maths/* max */.Fp)(cls.data)[1];
            if (pred_label === num_labels) {
                // Is the background, so we ignore it
                continue;
            }

            let scores = (0,maths/* softmax */.XA)(cls.data);
            let pred_score = scores[pred_label];
            if (pred_score > object_mask_threshold) {
                mask_probs_item.push(mask);
                pred_scores_item.push(pred_score);
                pred_labels_item.push(pred_label);
            }
        }

        return [mask_probs_item, pred_scores_item, pred_labels_item];

    }

    /**
     * Checks whether the segment is valid or not.
     * @param {Int32Array} mask_labels Labels for each pixel in the mask.
     * @param {Tensor[]} mask_probs Probabilities for each pixel in the masks.
     * @param {number} k The class id of the segment.
     * @param {number} mask_threshold The mask threshold.
     * @param {number} overlap_mask_area_threshold The overlap mask area threshold.
     * @returns {[boolean, number[]]} Whether the segment is valid or not, and the indices of the valid labels.
     */
    check_segment_validity(
        mask_labels,
        mask_probs,
        k,
        mask_threshold = 0.5,
        overlap_mask_area_threshold = 0.8
    ) {
        // mask_k is a 1D array of indices, indicating where the mask is equal to k
        let mask_k = [];
        let mask_k_area = 0;
        let original_area = 0;

        // Compute the area of all the stuff in query k
        for (let i = 0; i < mask_labels.length; ++i) {
            if (mask_labels[i] === k) {
                mask_k.push(i);
                ++mask_k_area;
            }

            if (mask_probs[k].data[i] >= mask_threshold) {
                ++original_area;
            }
        }
        let mask_exists = mask_k_area > 0 && original_area > 0;

        // Eliminate disconnected tiny segments
        if (mask_exists) {
            // Perform additional check
            let area_ratio = mask_k_area / original_area;
            mask_exists = area_ratio > overlap_mask_area_threshold;
        }

        return [mask_exists, mask_k]
    }

    /**
     * Computes the segments.
     * @param {Tensor[]} mask_probs The mask probabilities.
     * @param {number[]} pred_scores The predicted scores.
     * @param {number[]} pred_labels The predicted labels.
     * @param {number} mask_threshold The mask threshold.
     * @param {number} overlap_mask_area_threshold The overlap mask area threshold.
     * @param {Set<number>} label_ids_to_fuse The label ids to fuse.
     * @param {number[]} target_size The target size of the image.
     * @returns {[Tensor, Array<{id: number, label_id: number, score: number}>]} The computed segments.
     */
    compute_segments(
        mask_probs,
        pred_scores,
        pred_labels,
        mask_threshold,
        overlap_mask_area_threshold,
        label_ids_to_fuse = null,
        target_size = null,
    ) {
        let [height, width] = target_size ?? mask_probs[0].dims;

        let segmentation = new utils_tensor/* Tensor */.es(
            'int32',
            new Int32Array(height * width),
            [height, width]
        );
        let segments = [];

        // 1. If target_size is not null, we need to resize the masks to the target size
        if (target_size !== null) {
            // resize the masks to the target size
            for (let i = 0; i < mask_probs.length; ++i) {
                mask_probs[i] = (0,utils_tensor/* interpolate */.sX)(mask_probs[i], target_size, 'bilinear', false);
            }
        }

        // 2. Weigh each mask by its prediction score
        // NOTE: `mask_probs` is updated in-place
        // 
        // Temporary storage for the best label/scores for each pixel ([height, width]):
        let mask_labels = new Int32Array(mask_probs[0].data.length);
        let bestScores = new Float32Array(mask_probs[0].data.length);

        for (let i = 0; i < mask_probs.length; ++i) {
            let score = pred_scores[i];

            for (let j = 0; j < mask_probs[i].data.length; ++j) {
                mask_probs[i].data[j] *= score
                if (mask_probs[i].data[j] > bestScores[j]) {
                    mask_labels[j] = i;
                    bestScores[j] = mask_probs[i].data[j];
                }
            }
        }

        let current_segment_id = 0;

        // let stuff_memory_list = {}
        for (let k = 0; k < pred_labels.length; ++k) {
            let pred_class = pred_labels[k];

            // TODO add `should_fuse`
            // let should_fuse = pred_class in label_ids_to_fuse

            // Check if mask exists and large enough to be a segment
            let [mask_exists, mask_k] = this.check_segment_validity(
                mask_labels,
                mask_probs,
                k,
                mask_threshold,
                overlap_mask_area_threshold
            )

            if (!mask_exists) {
                // Nothing to see here
                continue;
            }

            // TODO
            // if (pred_class in stuff_memory_list) {
            //     current_segment_id = stuff_memory_list[pred_class]
            // } else {
            //     current_segment_id += 1;
            // }
            ++current_segment_id;


            // Add current object segment to final segmentation map
            for (let index of mask_k) {
                segmentation.data[index] = current_segment_id;
            }

            segments.push({
                id: current_segment_id,
                label_id: pred_class,
                // was_fused: should_fuse, TODO
                score: pred_scores[k],
            })

            // TODO
            // if(should_fuse){
            //     stuff_memory_list[pred_class] = current_segment_id
            // }
        }

        return [segmentation, segments];
    }

    /**
     * Post-process the model output to generate the final panoptic segmentation.
     * @param {*} outputs The model output to post process
     * @param {number} [threshold=0.5] The probability score threshold to keep predicted instance masks.
     * @param {number} [mask_threshold=0.5] Threshold to use when turning the predicted masks into binary values.
     * @param {number} [overlap_mask_area_threshold=0.8] The overlap mask area threshold to merge or discard small disconnected parts within each binary instance mask.
     * @param {Set<number>} [label_ids_to_fuse=null] The labels in this state will have all their instances be fused together.
     * @param {number[][]} [target_sizes=null] The target sizes to resize the masks to.
     * @returns {Array<{ segmentation: Tensor, segments_info: Array<{id: number, label_id: number, score: number}>}>}
     */
    post_process_panoptic_segmentation(
        outputs,
        threshold = 0.5,
        mask_threshold = 0.5,
        overlap_mask_area_threshold = 0.8,
        label_ids_to_fuse = null,
        target_sizes = null,
    ) {
        if (label_ids_to_fuse === null) {
            console.warn("`label_ids_to_fuse` unset. No instance will be fused.")
            label_ids_to_fuse = new Set();
        }

        const class_queries_logits = outputs.logits; // [batch_size, num_queries, num_classes+1]
        const masks_queries_logits = outputs.pred_masks; // [batch_size, num_queries, height, width]

        const mask_probs = masks_queries_logits.sigmoid()  // [batch_size, num_queries, height, width]

        let [batch_size, num_queries, num_labels] = class_queries_logits.dims;
        num_labels -= 1; // Remove last class (background)

        if (target_sizes !== null && target_sizes.length !== batch_size) {
            throw Error("Make sure that you pass in as many target sizes as the batch dimension of the logits")
        }

        let toReturn = [];
        for (let i = 0; i < batch_size; ++i) {
            let target_size = target_sizes !== null ? target_sizes[i] : null;

            let class_logits = class_queries_logits[i];
            let mask_logits = mask_probs[i];

            let [mask_probs_item, pred_scores_item, pred_labels_item] = this.remove_low_and_no_objects(class_logits, mask_logits, threshold, num_labels);

            if (pred_labels_item.length === 0) {
                // No mask found
                let [height, width] = target_size ?? mask_logits.dims.slice(-2);

                let segmentation = new utils_tensor/* Tensor */.es(
                    'int32',
                    new Int32Array(height * width).fill(-1),
                    [height, width]
                )
                toReturn.push({
                    segmentation: segmentation,
                    segments_info: []
                });
                continue;
            }


            // Get segmentation map and segment information of batch item
            let [segmentation, segments] = this.compute_segments(
                mask_probs_item,
                pred_scores_item,
                pred_labels_item,
                mask_threshold,
                overlap_mask_area_threshold,
                label_ids_to_fuse,
                target_size,
            )

            toReturn.push({
                segmentation: segmentation,
                segments_info: segments
            })
        }

        return toReturn;
    }

    post_process_instance_segmentation() {
        // TODO
        throw Error("Not implemented yet");
    }
}

class YolosFeatureExtractor extends ImageFeatureExtractor {
    /** @type {post_process_object_detection} */
    post_process_object_detection(...args) {
        return post_process_object_detection(...args);
    }
}

/**
 * @typedef {object} SamImageProcessorResult
 * @property {Tensor} pixel_values
 * @property {HeightWidth[]} original_sizes
 * @property {HeightWidth[]} reshaped_input_sizes
 * @property {Tensor} [input_points]
 * @property {Tensor} [input_labels]
 */

class SamImageProcessor extends ImageFeatureExtractor {

    /**
     * 
     * @param {any} input_points 
     * @param {HeightWidth[]} original_sizes 
     * @param {HeightWidth[]} reshaped_input_sizes 
     * @returns {Tensor}
     */
    reshape_input_points(input_points, original_sizes, reshaped_input_sizes) {

        // Make deep copy to avoid altering user's input
        input_points = structuredClone(input_points);
        let shape = (0,core/* calculateDimensions */.jg)(input_points);

        // TODO: add support for 2D input_points
        if (shape.length === 3) {
            // Correct user's input
            shape = [1, ...shape];
            input_points = [input_points];
        } else if (shape.length !== 4) {
            throw Error("The input_points must be a 4D tensor of shape `batch_size`, `point_batch_size`, `nb_points_per_image`, `2`.")
        }

        // Reshape input points
        for (let i = 0; i < input_points.length; ++i) { // batch_size
            let originalImageSize = original_sizes[i];
            let reshapedImageSize = reshaped_input_sizes[i];

            let resizeFactors = [
                reshapedImageSize[0] / originalImageSize[0],
                reshapedImageSize[1] / originalImageSize[1]
            ]

            for (let j = 0; j < input_points[i].length; ++j) { // point_batch_size
                for (let k = 0; k < input_points[i][j].length; ++k) { // nb_points_per_image
                    for (let w = 0; w < input_points[i][j][k].length; ++w) { // 2
                        input_points[i][j][k][w] *= resizeFactors[w];
                    }
                }
            }
        }

        return new utils_tensor/* Tensor */.es(
            'float32',
            Float32Array.from(input_points.flat(Infinity)),
            shape
        )

    }

    /**
     * 
     * @param {any} input_labels 
     * @param {Tensor} input_points 
     * @returns {Tensor}
     */
    add_input_labels(input_labels, input_points) {
        let shape = (0,core/* calculateDimensions */.jg)(input_labels);
        if (shape.length === 2) {
            // Correct user's input
            shape = [1, ...shape];
            input_labels = [input_labels];
        } else if (shape.length !== 3) {
            throw Error("The input_points must be a 4D tensor of shape `batch_size`, `point_batch_size`, `nb_points_per_image`, `2`.")
        }

        if (shape.some((x, i) => x !== input_points.dims[i])) {
            throw Error(`The first ${shape.length} dimensions of 'input_points' and 'input_labels' must be the same.`)
        }
        return new utils_tensor/* Tensor */.es(
            'int64',
            input_labels.flat(Infinity).map(BigInt),
            shape,
        )
    }
    /**
     * @param {any[]} images The URL(s) of the image(s) to extract features from.
     * @param {any} [input_points] A 3D or 4D array, representing the input points provided by the user.
     * - 3D: `[point_batch_size, nb_points_per_image, 2]`. In this case, `batch_size` is assumed to be 1.
     * - 4D: `[batch_size, point_batch_size, nb_points_per_image, 2]`.
     * @param {any} [input_labels] A 2D or 3D array, representing the input labels for the points, used by the prompt encoder to encode the prompt.
     * - 2D: `[point_batch_size, nb_points_per_image]`. In this case, `batch_size` is assumed to be 1.
     * - 3D: `[batch_size, point_batch_size, nb_points_per_image]`.
     * @returns {Promise<SamImageProcessorResult>}
     */
    async _call(images, input_points = null, input_labels = null) {
        // TODO allow user to use preprocessed images
        /** @type {SamImageProcessorResult} */
        const processed = await super._call(images);

        if (input_points) {
            processed.input_points = this.reshape_input_points(
                input_points, processed.original_sizes, processed.reshaped_input_sizes
            );
        }

        if (input_labels) {
            if (!processed.input_points) {
                throw Error("`input_points` must be provided if `input_labels` are provided.")
            }
            processed.input_labels = this.add_input_labels(input_labels, processed.input_points);
        }

        return processed;
    }

    /**
     * Remove padding and upscale masks to the original image size.
     * @param {Tensor} masks Batched masks from the mask_decoder in (batch_size, num_channels, height, width) format.
     * @param {number[][]} original_sizes The original sizes of each image before it was resized to the model's expected input shape, in (height, width) format.
     * @param {number[][]} reshaped_input_sizes The size of each image as it is fed to the model, in (height, width) format. Used to remove padding.
     * @param {Object} options Optional parameters for post-processing.
     * @param {number} [options.mask_threshold] The threshold to use for binarizing the masks.
     * @param {boolean} [options.binarize] Whether to binarize the masks.
     * @param {Object} [options.pad_size] The target size the images were padded to before being passed to the model. If `null`, the target size is assumed to be the processor's `pad_size`.
     * @param {number} [options.pad_size.height] The height the images were padded to.
     * @param {number} [options.pad_size.width] The width the images were padded to.
     * @returns {Tensor[]} Batched masks in batch_size, num_channels, height, width) format, where (height, width) is given by original_size.
     */
    post_process_masks(masks, original_sizes, reshaped_input_sizes, {
        mask_threshold = 0.0,
        binarize = true,
        pad_size = null,
    } = {}) {
        // masks: [1, 1, 3, 256, 256]

        const output_masks = [];

        pad_size = pad_size ?? this.pad_size;

        const target_image_size = [pad_size.height, pad_size.width];

        for (let i = 0; i < original_sizes.length; ++i) {
            const original_size = original_sizes[i];
            const reshaped_input_size = reshaped_input_sizes[i];

            const mask = masks[i]; // [b, c, h, w]

            // TODO: improve
            const interpolated_masks = [];
            for (let j = 0; j < mask.dims[0]; ++j) {
                const m = mask[j]; // 3d tensor

                // Upscale mask to padded size
                let interpolated_mask = (0,utils_tensor/* interpolate */.sX)(m, target_image_size, 'bilinear', false);

                // Crop mask
                interpolated_mask = interpolated_mask.slice(null, [0, reshaped_input_size[0]], [0, reshaped_input_size[1]]);

                // Downscale mask
                interpolated_mask = (0,utils_tensor/* interpolate */.sX)(interpolated_mask, original_size, 'bilinear', false);

                if (binarize) {
                    const binarizedMaskData = new Uint8Array(interpolated_mask.data.length);
                    for (let i = 0; i < interpolated_mask.data.length; ++i) {
                        if (interpolated_mask.data[i] > mask_threshold) {
                            binarizedMaskData[i] = 1;
                        }
                    }
                    interpolated_mask = new utils_tensor/* Tensor */.es(
                        'bool',
                        binarizedMaskData,
                        interpolated_mask.dims
                    )
                }

                interpolated_masks.push(interpolated_mask);
            }

            output_masks.push((0,utils_tensor/* stack */.kn)(interpolated_masks));
        }

        return output_masks;
    }
}

class Swin2SRImageProcessor extends ImageFeatureExtractor {
    pad_image(pixelData, imgDims, padSize, options = {}) {
        // NOTE: In this case, `padSize` represents the size of the sliding window for the local attention.
        // In other words, the image is padded so that its width and height are multiples of `padSize`.
        const [imageHeight, imageWidth, imageChannels] = imgDims;

        return super.pad_image(pixelData, imgDims, {
            // NOTE: For Swin2SR models, the original python implementation adds padding even when the image's width/height is already
            // a multiple of `pad_size`. However, this is most likely a bug (PR: https://github.com/mv-lab/swin2sr/pull/19).
            // For this reason, we only add padding when the image's width/height is not a multiple of `pad_size`.
            width: imageWidth + (padSize - imageWidth % padSize) % padSize,
            height: imageHeight + (padSize - imageHeight % padSize) % padSize,
        }, {
            mode: 'symmetric',
            center: false,
            constant_values: -1,
            ...options,
        })
    }
}

class VitMatteImageProcessor extends ImageFeatureExtractor {
    /**
     * Calls the feature extraction process on an array of images, preprocesses
     * each image, and concatenates the resulting features into a single Tensor.
     * @param {RawImage[]} images The image(s) to extract features from.
     * @param {RawImage[]} trimaps The trimaps(s) to extract features from.
     * @returns {Promise<ImageFeatureExtractorResult>} An object containing the concatenated pixel values of the preprocessed images.
     */
    async _call(images, trimaps) {
        if (!Array.isArray(images)) {
            images = [images];
        }
        if (!Array.isArray(trimaps)) {
            trimaps = [trimaps];
        }

        const imageData = await Promise.all(images.map(x => this.preprocess(x)));
        const trimapData = await Promise.all(trimaps.map(x => this.preprocess(x, {
            do_normalize: false,
            do_convert_rgb: false,
            do_convert_grayscale: true,
        })));


        // Stack pixel values
        const pixel_values = (0,utils_tensor/* stack */.kn)(imageData.map(
            // Concatenate images and trimaps
            (x, i) => (0,utils_tensor/* cat */.d3)([x.pixel_values, trimapData[i].pixel_values], 0)
        ), 0);

        return {
            pixel_values: pixel_values,

            // Original sizes of images
            original_sizes: imageData.map(x => x.original_size),

            // Reshaped sizes of images, before padding or cropping
            reshaped_input_sizes: imageData.map(x => x.reshaped_input_size),
        }
    }
}

class WhisperFeatureExtractor extends FeatureExtractor {

    constructor(config) {
        super(config);

        // Prefer given `mel_filters` from preprocessor_config.json, or calculate them if they don't exist.
        this.config.mel_filters ??= mel_filter_bank(
            Math.floor(1 + this.config.n_fft / 2), // num_frequency_bins
            this.config.feature_size, // num_mel_filters
            0.0, // min_frequency
            8000.0, // max_frequency
            this.config.sampling_rate, // sampling_rate
            "slaney", // norm
            "slaney", // mel_scale
        );

        this.window = window_function(this.config.n_fft, 'hann');
    }

    /**
     * Computes the log-Mel spectrogram of the provided audio waveform.
     * @param {Float32Array|Float64Array} waveform The audio waveform to process.
     * @returns {{data: Float32Array, dims: number[]}} An object containing the log-Mel spectrogram data as a Float32Array and its dimensions as an array of numbers.
     */
    _extract_fbank_features(waveform) {
        const { data, dims } = spectrogram(
            waveform,
            this.window, // window
            this.config.n_fft, // frame_length
            this.config.hop_length, // hop_length
            {
                power: 2.0,
                mel_filters: this.config.mel_filters,
                log_mel: 'log10',

                // Custom
                max_num_frames: this.config.nb_max_frames, // 3000
            }
        )

        const maxValue = (0,maths/* max */.Fp)(data)[0];

        for (let i = 0; i < data.length; ++i) {
            data[i] = (Math.max(data[i], maxValue - 8.0) + 4.0) / 4.0;
        }

        return { data, dims };
    }

    /**
     * Asynchronously extracts features from a given audio using the provided configuration.
     * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
     * @returns {Promise<{ input_features: Tensor }>} A Promise resolving to an object containing the extracted input features as a Tensor.
     */
    async _call(audio) {
        validate_audio_inputs(audio, 'WhisperFeatureExtractor');

        let waveform;
        if (audio.length > this.config.n_samples) {
            console.warn(
                "Attempting to extract features for audio longer than 30 seconds. " +
                "If using a pipeline to extract transcript from a long audio clip, " +
                "remember to specify `chunk_length_s` and/or `stride_length_s`."
            );
            waveform = audio.slice(0, this.config.n_samples);
        } else {
            // pad with zeros
            waveform = new Float32Array(this.config.n_samples);
            waveform.set(audio);
        }

        const { data, dims } = this._extract_fbank_features(waveform);

        return {
            input_features: new utils_tensor/* Tensor */.es('float32',
                data,
                [1, ...dims]
            )
        };
    }
}

class Wav2Vec2FeatureExtractor extends FeatureExtractor {

    /**
     * @param {Float32Array} input_values 
     * @returns {Float32Array} 
     */
    _zero_mean_unit_var_norm(input_values) {
        // TODO support batch?
        const sum = input_values.reduce((a, b) => a + b, 0);
        const mean = sum / input_values.length;
        const variance = input_values.reduce((a, b) => a + (b - mean) ** 2, 0) / input_values.length;
        return input_values.map(x => (x - mean) / Math.sqrt(variance + 1e-7));
    }

    /**
     * Asynchronously extracts features from a given audio using the provided configuration.
     * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
     * @returns {Promise<{ input_values: Tensor; attention_mask: Tensor }>} A Promise resolving to an object containing the extracted input features and attention mask as Tensors.
     */
    async _call(audio) {
        validate_audio_inputs(audio, 'Wav2Vec2FeatureExtractor');

        if (audio instanceof Float64Array) {
            audio = new Float32Array(audio);
        }

        let input_values = audio;

        // zero-mean and unit-variance normalization
        if (this.config.do_normalize) {
            input_values = this._zero_mean_unit_var_norm(input_values);
        }

        // TODO: allow user to pass in attention mask
        const shape = [1, input_values.length];
        return {
            input_values: new utils_tensor/* Tensor */.es('float32', input_values, shape),
            attention_mask: new utils_tensor/* Tensor */.es('int64', new BigInt64Array(input_values.length).fill(1n), shape)
        };
    }
}

class SeamlessM4TFeatureExtractor extends FeatureExtractor {

    constructor(config) {
        super(config);

        const sampling_rate = this.config.sampling_rate;
        const mel_filters = mel_filter_bank(
            256, // num_frequency_bins
            this.config.num_mel_bins, // num_mel_filters
            20, // min_frequency
            Math.floor(sampling_rate / 2), // max_frequency
            sampling_rate, // sampling_rate
            null, // norm
            "kaldi", // mel_scale
            true, // triangularize_in_mel_space
        );

        // Do padding:
        for (let i = 0; i < mel_filters.length; ++i) {
            mel_filters[i].push(0);
        }
        this.mel_filters = mel_filters;

        this.window = window_function(400, 'povey', {
            periodic: false,
        })
    }

    /**
     * Computes the log-Mel spectrogram of the provided audio waveform.
     * @param {Float32Array|Float64Array} waveform The audio waveform to process.
     * @param {number} max_length The maximum number of frames to return.
     * @returns {{data: Float32Array, dims: number[]}} An object containing the log-Mel spectrogram data as a Float32Array and its dimensions as an array of numbers.
     */
    _extract_fbank_features(waveform, max_length) {
        // NOTE: We don't pad/truncate since that is passed in as `max_num_frames`

        // Kaldi compliance: 16-bit signed integers
        // 32768 == 2 ** 15
        waveform = waveform.map((/** @type {number} */ x) => x * 32768)

        return spectrogram(
            waveform,
            this.window, // window
            400, // frame_length
            160, // hop_length
            {
                fft_length: 512,
                power: 2.0,
                center: false,
                preemphasis: 0.97,
                mel_filters: this.mel_filters,
                log_mel: 'log',
                mel_floor: 1.192092955078125e-07,
                remove_dc_offset: true,

                // Custom
                max_num_frames: max_length,
                transpose: true,
            }
        )
    }

    /**
     * Asynchronously extracts features from a given audio using the provided configuration.
     * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
     * @param {Object} options Optional parameters for feature extraction.
     * @param {boolean} [options.padding=true] Whether to pad the sequence to a multiple of `pad_to_multiple_of`.
     * @param {number} [options.pad_to_multiple_of=2] The number to pad the sequence to a multiple of.
     * @param {boolean} [options.do_normalize_per_mel_bins=true] Whether or not to zero-mean unit-variance normalize the input per mel-channel.
     * @param {boolean} [options.return_attention_mask=true] Whether to return the attention mask.
     * @returns {Promise<{ input_features: Tensor, attention_mask?: Tensor }>} A Promise resolving to an object containing the extracted input features and attention masks as Tensors.
     */
    async _call(audio, {
        padding = true,
        pad_to_multiple_of = 2,
        do_normalize_per_mel_bins = true,
        return_attention_mask = true,
    } = {}) {
        validate_audio_inputs(audio, 'SeamlessM4TFeatureExtractor');

        let features = this._extract_fbank_features(audio, this.config.max_length);

        if (do_normalize_per_mel_bins) {
            const [num_features, feature_size] = features.dims;
            for (let i = 0; i < feature_size; ++i) {
                let sum = 0;
                for (let j = 0; j < num_features; ++j) {
                    sum += features.data[j * feature_size + i];
                }

                const mean = sum / num_features;

                let variance = 0;
                for (let j = 0; j < num_features; ++j) {
                    variance += (features.data[j * feature_size + i] - mean) ** 2;
                }
                variance /= num_features - 1; // NOTE: We use ddof=1

                const std = Math.sqrt(variance + 1e-7);
                for (let j = 0; j < num_features; ++j) {
                    const index = j * feature_size + i;
                    features.data[index] = (features.data[index] - mean) / std;
                }
            }
        }

        let padded_attention_mask;
        if (padding) {
            const [num_frames, num_channels] = features.dims;

            const pad_size = num_frames % pad_to_multiple_of;
            if (pad_size > 0) {
                const padded_data = new Float32Array(num_channels * (num_frames + pad_size));
                padded_data.set(features.data)
                padded_data.fill(this.config.padding_value, features.data.length)

                const numPaddedFrames = num_frames + pad_size;
                features = {
                    data: padded_data,
                    dims: [numPaddedFrames, num_channels],
                }

                if (return_attention_mask) {
                    padded_attention_mask = new utils_tensor/* Tensor */.es(
                        'int64',
                        new BigInt64Array(numPaddedFrames),
                        [1, numPaddedFrames],
                    )
                    padded_attention_mask.data.fill(1n, 0, num_frames);
                }
            }
        }

        const [num_frames, num_channels] = features.dims;

        const stride = this.config.stride;
        const remainder = num_frames % stride;
        if (remainder !== 0) {
            throw new Error(`The number of frames (${num_frames}) must be a multiple of the stride (${stride}).`)
        }

        const input_features = new utils_tensor/* Tensor */.es('float32',
            features.data,
            features.dims,
        ).view(
            1,
            Math.floor(num_frames / stride),
            num_channels * stride,
        );

        const result = { input_features }

        if (return_attention_mask) {
            const reshapedNumFrames = input_features.dims[1];

            const attention_mask = new utils_tensor/* Tensor */.es(
                'int64',
                new BigInt64Array(reshapedNumFrames),
                [1, reshapedNumFrames],
            );
            if (padded_attention_mask) {
                for (let i = 1, j = 0; i < num_frames; i += stride, ++j) {
                    attention_mask.data[j] = padded_attention_mask.data[i];
                }
            } else {
                attention_mask.data.fill(1n);
            }

            result.attention_mask = attention_mask;
        }

        return result;
    }
}

class ASTFeatureExtractor extends FeatureExtractor {


    constructor(config) {
        super(config);

        const sampling_rate = this.config.sampling_rate;
        const mel_filters = mel_filter_bank(
            256, // num_frequency_bins
            this.config.num_mel_bins, // num_mel_filters
            20, // min_frequency
            Math.floor(sampling_rate / 2), // max_frequency
            sampling_rate, // sampling_rate
            null, // norm
            "kaldi", // mel_scale
            true, // triangularize_in_mel_space
        );

        // Do padding:
        for (let i = 0; i < mel_filters.length; ++i) {
            mel_filters[i].push(0);
        }
        this.mel_filters = mel_filters;

        this.window = window_function(400, 'hann', {
            periodic: false,
        })

        this.mean = this.config.mean;
        this.std = this.config.std;
    }

    /**
     * Computes the log-Mel spectrogram of the provided audio waveform.
     * @param {Float32Array|Float64Array} waveform The audio waveform to process.
     * @param {number} max_length The maximum number of frames to return.
     * @returns {{data: Float32Array, dims: number[]}} An object containing the log-Mel spectrogram data as a Float32Array and its dimensions as an array of numbers.
     */
    _extract_fbank_features(waveform, max_length) {
        // NOTE: We don't pad/truncate since that is passed in as `max_num_frames`
        return spectrogram(
            waveform,
            this.window, // window
            400, // frame_length
            160, // hop_length
            {
                fft_length: 512,
                power: 2.0,
                center: false,
                preemphasis: 0.97,
                mel_filters: this.mel_filters,
                log_mel: 'log',
                mel_floor: 1.192092955078125e-07,
                remove_dc_offset: true,

                // Custom
                max_num_frames: max_length,
                transpose: true,
            }
        )
    }


    /**
     * Asynchronously extracts features from a given audio using the provided configuration.
     * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
     * @returns {Promise<{ input_values: Tensor }>} A Promise resolving to an object containing the extracted input features as a Tensor.
     */
    async _call(audio) {
        validate_audio_inputs(audio, 'ASTFeatureExtractor');

        const features = this._extract_fbank_features(audio, this.config.max_length);
        if (this.config.do_normalize) {
            // Normalize the input audio spectrogram to have mean=0, std=0.5
            const denom = this.std * 2;
            for (let i = 0; i < features.data.length; ++i) {
                features.data[i] = (features.data[i] - this.mean) / denom;
            }
        }

        return {
            input_values: new utils_tensor/* Tensor */.es('float32',
                features.data,
                [1, ...features.dims]
            )
        };
    }
}

class ClapFeatureExtractor extends FeatureExtractor {

    constructor(config) {
        super(config);

        this.mel_filters = mel_filter_bank(
            this.config.nb_frequency_bins, // num_frequency_bins
            this.config.feature_size, // num_mel_filters
            this.config.frequency_min, // min_frequency
            this.config.frequency_max, // max_frequency
            this.config.sampling_rate, // sampling_rate
            null, // norm
            "htk", // mel_scale
        );

        this.mel_filters_slaney = mel_filter_bank(
            this.config.nb_frequency_bins, // num_frequency_bins
            this.config.feature_size, // num_mel_filters
            this.config.frequency_min, // min_frequency
            this.config.frequency_max, // max_frequency
            this.config.sampling_rate, // sampling_rate
            "slaney", // norm
            "slaney", // mel_scale
        );

        this.window = window_function(this.config.fft_window_size, 'hann')

    }


    /**
     * Extracts the mel spectrogram and prepares it for the mode based on the `truncation` and `padding` arguments.
     * 
     * Four different path are possible:
     *   - `truncation="fusion"` and the length of the waveform is greater than the max length: the mel spectrogram
     *     will be computed on the entire audio. 3 random crops and a dowsampled version of the full mel spectrogram
     *     are then stacked together. They will later be used for `feature_fusion`.
     *   - `truncation="rand_trunc"` and the length of the waveform is smaller than the max length: the audio is
     *     padded based on `padding`.
     *   - `truncation="fusion"` and the length of the waveform is smaller than the max length: the audio is padded
     *     based on `padding`, and is repeated `4` times.
     *   - `truncation="rand_trunc"` and the length of the waveform is greater than the max length: the mel
     *     spectrogram will be computed on a random crop of the waveform.
     * 
     * @param {Float32Array|Float64Array} waveform The input waveform.
     * @param {number} max_length The maximum length of the waveform.
     * @param {string} truncation The truncation strategy to use.
     * @param {string} padding The padding strategy to use.
     * @returns {{ data: Float32Array; dims: number[]; longer: boolean; }} An object containing the mel spectrogram data as a Float32Array, its dimensions as an array of numbers, and a boolean indicating whether the waveform was longer than the max length.
     */
    _get_input_mel(waveform, max_length, truncation, padding) {

        /** @type {{ data: Float32Array; dims: number[]}} */
        let input_mel;
        let longer = false;
        const diff = waveform.length - max_length;
        if (diff > 0) {
            if (truncation === 'rand_trunc') {
                longer = true;
                const idx = Math.floor(Math.random() * (diff + 1));
                waveform = waveform.subarray(idx, idx + max_length);

                input_mel = this._extract_fbank_features(waveform, this.mel_filters_slaney, this.config.nb_max_samples);
                input_mel.dims = [1, ...input_mel.dims]; // "unsqueeze"
            } else {
                // TODO implement fusion strategy
                throw new Error(`Truncation strategy "${truncation}" not implemented`)
            }
        } else {
            if (diff < 0) {
                let padded = new Float64Array(max_length); // already padded with zeros
                padded.set(waveform);

                if (padding === 'repeat') {
                    for (let i = waveform.length; i < max_length; i += waveform.length) {
                        padded.set(waveform.subarray(0, Math.min(waveform.length, max_length - i)), i);
                    }
                } else if (padding === 'repeatpad') {
                    for (let i = waveform.length; i < -diff; i += waveform.length) {
                        padded.set(waveform, i);
                    }
                }
                waveform = padded;
            }

            if (truncation === 'fusion') {
                throw new Error(`Truncation strategy "${truncation}" not implemented`)
            }

            input_mel = this._extract_fbank_features(waveform, this.mel_filters_slaney, this.config.nb_max_samples);
            input_mel.dims = [1, ...input_mel.dims]; // "unsqueeze"
        }

        return {
            ...input_mel,
            longer,
        }
    }

    /**
     * Compute the log-mel spectrogram of the provided `waveform` using the Hann window.
     * In CLAP, two different filter banks are used depending on the truncation pattern:
     *  - `self.mel_filters`: they correspond to the default parameters of `torchaudio` which can be obtained from
     *    calling `torchaudio.transforms.MelSpectrogram().mel_scale.fb`. These filters are used when `truncation`
     *    is set to `"fusion"`.
     *  - `self.mel_filteres_slaney` : they correspond to the default parameters of `librosa` which used
     *    `librosa.filters.mel` when computing the mel spectrogram. These filters were only used in the original
     *    implementation when the truncation mode is not `"fusion"`.
     * 
     * @param {Float32Array|Float64Array} waveform The audio waveform to process.
     * @param {number[][]} mel_filters The mel filters to use.
     * @param {number} [max_length=null] The maximum number of frames to return.
     * @returns {{data: Float32Array, dims: number[]}} An object containing the log-Mel spectrogram data as a Float32Array and its dimensions as an array of numbers.
     */
    _extract_fbank_features(waveform, mel_filters, max_length = null) {
        // NOTE: We don't pad/truncate since that is passed in as `max_num_frames`
        return spectrogram(
            waveform,
            this.window, // window
            this.config.fft_window_size, // frame_length
            this.config.hop_length, // hop_length
            {
                power: 2.0,
                mel_filters,
                log_mel: 'dB',

                // Custom
                max_num_frames: max_length,
                do_pad: false,
                transpose: true,
            }
        )
    }


    /**
     * Asynchronously extracts features from a given audio using the provided configuration.
     * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
     * @returns {Promise<{ input_features: Tensor }>} A Promise resolving to an object containing the extracted input features as a Tensor.
     */
    async _call(audio, {
        max_length = null,
    } = {}) {
        validate_audio_inputs(audio, 'ClapFeatureExtractor');

        // convert to mel spectrogram, truncate and pad if needed.
        const padded_inputs = this._get_input_mel(
            audio,
            max_length ?? this.config.nb_max_samples,
            this.config.truncation,
            this.config.padding,
        );


        return {
            input_features: new utils_tensor/* Tensor */.es('float32',
                padded_inputs.data,
                [1, ...padded_inputs.dims]
            )
        };
    }
}



class SpeechT5FeatureExtractor extends FeatureExtractor { }

/**
 * Represents a Processor that extracts features from an input.
 * @extends Callable
 */
class Processor extends core/* Callable */.Ag {
    /**
     * Creates a new Processor with the given feature extractor.
     * @param {FeatureExtractor} feature_extractor The function used to extract features from the input.
     */
    constructor(feature_extractor) {
        super();
        this.feature_extractor = feature_extractor;
        // TODO use tokenizer here?
    }

    /**
     * Calls the feature_extractor function with the given input.
     * @param {any} input The input to extract features from.
     * @param {...any} args Additional arguments.
     * @returns {Promise<any>} A Promise that resolves with the extracted features.
     */
    async _call(input, ...args) {
        return await this.feature_extractor(input, ...args);
    }
}

class SamProcessor extends Processor {
    /**
     * @borrows SamImageProcessor#_call as _call
     */
    async _call(...args) {
        return await this.feature_extractor(...args);
    }

    /**
     * @borrows SamImageProcessor#post_process_masks as post_process_masks
     */
    post_process_masks(...args) {
        // @ts-ignore
        return this.feature_extractor.post_process_masks(...args);
    }
    /**
     * @borrows SamImageProcessor#reshape_input_points as reshape_input_points
     */
    reshape_input_points(...args) {
        // @ts-ignore
        return this.feature_extractor.reshape_input_points(...args);
    }
}

/**
 * Represents a WhisperProcessor that extracts features from an audio input.
 * @extends Processor
 */
class WhisperProcessor extends Processor {
    /**
     * Calls the feature_extractor function with the given audio input.
     * @param {any} audio The audio input to extract features from.
     * @returns {Promise<any>} A Promise that resolves with the extracted features.
     */
    async _call(audio) {
        return await this.feature_extractor(audio)
    }
}


class Wav2Vec2ProcessorWithLM extends Processor {
    /**
     * Calls the feature_extractor function with the given audio input.
     * @param {any} audio The audio input to extract features from.
     * @returns {Promise<any>} A Promise that resolves with the extracted features.
     */
    async _call(audio) {
        return await this.feature_extractor(audio)
    }
}

class SpeechT5Processor extends Processor {
    /**
     * Calls the feature_extractor function with the given input.
     * @param {any} input The input to extract features from.
     * @returns {Promise<any>} A Promise that resolves with the extracted features.
     */
    async _call(input) {
        return await this.feature_extractor(input)
    }
}

class OwlViTProcessor extends Processor { }


//////////////////////////////////////////////////
/**
 * Helper class which is used to instantiate pretrained processors with the `from_pretrained` function.
 * The chosen processor class is determined by the type specified in the processor config.
 * 
 * **Example:** Load a processor using `from_pretrained`.
 * ```javascript
 * let processor = await AutoProcessor.from_pretrained('openai/whisper-tiny.en');
 * ```
 * 
 * **Example:** Run an image through a processor.
 * ```javascript
 * let processor = await AutoProcessor.from_pretrained('Xenova/clip-vit-base-patch16');
 * let image = await RawImage.read('https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/football-match.jpg');
 * let image_inputs = await processor(image);
 * // {
 * //   "pixel_values": {
 * //     "dims": [ 1, 3, 224, 224 ],
 * //     "type": "float32",
 * //     "data": Float32Array [ -1.558687686920166, -1.558687686920166, -1.5440893173217773, ... ],
 * //     "size": 150528
 * //   },
 * //   "original_sizes": [
 * //     [ 533, 800 ]
 * //   ],
 * //   "reshaped_input_sizes": [
 * //     [ 224, 224 ]
 * //   ]
 * // }
 * ```
 */
class AutoProcessor {
    static FEATURE_EXTRACTOR_CLASS_MAPPING = {
        ImageFeatureExtractor,
        WhisperFeatureExtractor,
        ViTFeatureExtractor,
        MobileViTFeatureExtractor,
        MobileViTImageProcessor,
        OwlViTFeatureExtractor,
        Owlv2ImageProcessor,
        CLIPFeatureExtractor,
        ChineseCLIPFeatureExtractor,
        SiglipImageProcessor,
        ConvNextFeatureExtractor,
        ConvNextImageProcessor,
        SegformerFeatureExtractor,
        BitImageProcessor,
        DPTImageProcessor,
        DPTFeatureExtractor,
        GLPNFeatureExtractor,
        BeitFeatureExtractor,
        DeiTFeatureExtractor,
        DetrFeatureExtractor,
        YolosFeatureExtractor,
        DonutFeatureExtractor,
        NougatImageProcessor,
        EfficientNetImageProcessor,

        ViTImageProcessor,
        VitMatteImageProcessor,
        SamImageProcessor,
        Swin2SRImageProcessor,
        Wav2Vec2FeatureExtractor,
        SeamlessM4TFeatureExtractor,
        SpeechT5FeatureExtractor,
        ASTFeatureExtractor,
        ClapFeatureExtractor,
    }

    static PROCESSOR_CLASS_MAPPING = {
        WhisperProcessor,
        Wav2Vec2ProcessorWithLM,
        SamProcessor,
        SpeechT5Processor,
        OwlViTProcessor,
    }

    /**
     * Instantiate one of the processor classes of the library from a pretrained model.
     * 
     * The processor class to instantiate is selected based on the `feature_extractor_type` property of the config object
     * (either passed as an argument or loaded from `pretrained_model_name_or_path` if possible)
     * 
     * @param {string} pretrained_model_name_or_path The name or path of the pretrained model. Can be either:
     * - A string, the *model id* of a pretrained processor hosted inside a model repo on huggingface.co.
     *   Valid model ids can be located at the root-level, like `bert-base-uncased`, or namespaced under a
     *   user or organization name, like `dbmdz/bert-base-german-cased`.
     * - A path to a *directory* containing processor files, e.g., `./my_model_directory/`.
     * @param {import('./utils/hub.js').PretrainedOptions} options Additional options for loading the processor.
     * 
     * @returns {Promise<Processor>} A new instance of the Processor class.
     */
    static async from_pretrained(pretrained_model_name_or_path, {
        progress_callback = null,
        config = null,
        cache_dir = null,
        local_files_only = false,
        revision = 'main',
    } = {}) {

        let preprocessorConfig = config ?? await (0,hub/* getModelJSON */.yM)(pretrained_model_name_or_path, 'preprocessor_config.json', true, {
            progress_callback,
            config,
            cache_dir,
            local_files_only,
            revision,
        })

        // Determine feature extractor class
        // TODO: Ensure backwards compatibility with old configs
        let key = preprocessorConfig.feature_extractor_type ?? preprocessorConfig.image_processor_type;
        let feature_extractor_class = this.FEATURE_EXTRACTOR_CLASS_MAPPING[key];

        if (!feature_extractor_class) {
            if (preprocessorConfig.size !== undefined) {
                // Assume ImageFeatureExtractor
                console.warn(`Feature extractor type "${key}" not found, assuming ImageFeatureExtractor due to size parameter in config.`);
                feature_extractor_class = ImageFeatureExtractor;
            } else {
                throw new Error(`Unknown Feature Extractor type: ${key}`);
            }
        }

        // If no associated processor class, use default
        let processor_class = this.PROCESSOR_CLASS_MAPPING[preprocessorConfig.processor_class] ?? Processor;

        // Instantiate processor and feature extractor
        let feature_extractor = new feature_extractor_class(preprocessorConfig);
        return new processor_class(feature_extractor);
    }
}
//////////////////////////////////////////////////


;// CONCATENATED MODULE: ../../node_modules/.pnpm/@xenova+transformers@2.17.2/node_modules/@xenova/transformers/src/pipelines.js
/**
 * @file Pipelines provide a high-level, easy to use, API for running machine learning models.
 * 
 * **Example:** Instantiate pipeline using the `pipeline` function.
 * ```javascript
 * import { pipeline } from '@xenova/transformers';
 * 
 * const classifier = await pipeline('sentiment-analysis');
 * const output = await classifier('I love transformers!');
 * // [{'label': 'POSITIVE', 'score': 0.999817686}]
 * ```
 * 
 * @module pipelines
 */













/**
 * @typedef {string | RawImage | URL} ImageInput
 * @typedef {ImageInput|ImageInput[]} ImagePipelineInputs
 */

/**
 * Prepare images for further tasks.
 * @param {ImagePipelineInputs} images images to prepare.
 * @returns {Promise<RawImage[]>} returns processed images.
 * @private
 */
async function prepareImages(images) {
    if (!Array.isArray(images)) {
        images = [images];
    }

    // Possibly convert any non-images to images
    return await Promise.all(images.map(x => RawImage.read(x)));
}

/**
 * @typedef {string | URL | Float32Array | Float64Array} AudioInput
 * @typedef {AudioInput|AudioInput[]} AudioPipelineInputs
 */

/**
 * Prepare audios for further tasks.
 * @param {AudioPipelineInputs} audios audios to prepare.
 * @param {number} sampling_rate sampling rate of the audios.
 * @returns {Promise<Float32Array[]>} The preprocessed audio data.
 * @private
 */
async function prepareAudios(audios, sampling_rate) {
    if (!Array.isArray(audios)) {
        audios = [audios];
    }

    return await Promise.all(audios.map(x => {
        if (typeof x === 'string' || x instanceof URL) {
            return read_audio(x, sampling_rate);
        } else if (x instanceof Float64Array) {
            return new Float32Array(x);
        }
        return x;
    }));
}

/**
 * @typedef {Object} BoundingBox
 * @property {number} xmin The minimum x coordinate of the bounding box.
 * @property {number} ymin The minimum y coordinate of the bounding box.
 * @property {number} xmax The maximum x coordinate of the bounding box.
 * @property {number} ymax The maximum y coordinate of the bounding box.
 */

/**
 * Helper function to convert list [xmin, xmax, ymin, ymax] into object { "xmin": xmin, ... }
 * @param {number[]} box The bounding box as a list.
 * @param {boolean} asInteger Whether to cast to integers.
 * @returns {BoundingBox} The bounding box as an object.
 * @private
 */
function get_bounding_box(box, asInteger) {
    if (asInteger) {
        box = box.map(x => x | 0);
    }
    const [xmin, ymin, xmax, ymax] = box;

    return { xmin, ymin, xmax, ymax };
}


/**
 * @callback DisposeType Disposes the item.
 * @returns {Promise<void>} A promise that resolves when the item has been disposed.
 * 
 * @typedef {Object} Disposable
 * @property {DisposeType} dispose A promise that resolves when the pipeline has been disposed.
 */

/**
 * The Pipeline class is the class from which all pipelines inherit.
 * Refer to this class for methods shared across different pipelines.
 * @extends Callable
 */
class Pipeline extends core/* Callable */.Ag {
    /**
     * Create a new Pipeline.
     * @param {Object} options An object containing the following properties:
     * @param {string} [options.task] The task of the pipeline. Useful for specifying subtasks.
     * @param {PreTrainedModel} [options.model] The model used by the pipeline.
     * @param {PreTrainedTokenizer} [options.tokenizer=null] The tokenizer used by the pipeline (if any).
     * @param {Processor} [options.processor=null] The processor used by the pipeline (if any).
     */
    constructor({ task, model, tokenizer = null, processor = null }) {
        super();
        this.task = task;
        this.model = model;
        this.tokenizer = tokenizer;
        this.processor = processor;
    }

    /** @type {DisposeType} */
    async dispose() {
        await this.model.dispose();
    }
}

/**
 * @typedef {Object} ModelTokenizerConstructorArgs
 * @property {string} task The task of the pipeline. Useful for specifying subtasks.
 * @property {PreTrainedModel} model The model used by the pipeline.
 * @property {PreTrainedTokenizer} tokenizer The tokenizer used by the pipeline.
 * 
 * @typedef {ModelTokenizerConstructorArgs} TextPipelineConstructorArgs An object used to instantiate a text-based pipeline.
 */

/**
 * @typedef {Object} ModelProcessorConstructorArgs
 * @property {string} task The task of the pipeline. Useful for specifying subtasks.
 * @property {PreTrainedModel} model The model used by the pipeline.
 * @property {Processor} processor The processor used by the pipeline.
 * 
 * @typedef {ModelProcessorConstructorArgs} AudioPipelineConstructorArgs An object used to instantiate an audio-based pipeline.
 * @typedef {ModelProcessorConstructorArgs} ImagePipelineConstructorArgs An object used to instantiate an image-based pipeline.
 */


/**
 * @typedef {Object} ModelTokenizerProcessorConstructorArgs
 * @property {string} task The task of the pipeline. Useful for specifying subtasks.
 * @property {PreTrainedModel} model The model used by the pipeline.
 * @property {PreTrainedTokenizer} tokenizer The tokenizer used by the pipeline.
 * @property {Processor} processor The processor used by the pipeline.
 * 
 * @typedef {ModelTokenizerProcessorConstructorArgs} TextAudioPipelineConstructorArgs An object used to instantiate a text- and audio-based pipeline.
 * @typedef {ModelTokenizerProcessorConstructorArgs} TextImagePipelineConstructorArgs An object used to instantiate a text- and image-based pipeline.
 */

/**
 * @typedef {Object} TextClassificationSingle
 * @property {string} label The label predicted.
 * @property {number} score The corresponding probability.
 * @typedef {TextClassificationSingle[]} TextClassificationOutput
 * 
 * @typedef {Object} TextClassificationPipelineOptions Parameters specific to text classification pipelines.
 * @property {number} [topk=1] The number of top predictions to be returned.
 * 
 * @callback TextClassificationPipelineCallback Classify the text(s) given as inputs.
 * @param {string|string[]} texts The input text(s) to be classified.
 * @param {TextClassificationPipelineOptions} [options] The options to use for text classification.
 * @returns {Promise<TextClassificationOutput|TextClassificationOutput[]>} An array or object containing the predicted labels and scores.
 * 
 * @typedef {TextPipelineConstructorArgs & TextClassificationPipelineCallback & Disposable} TextClassificationPipelineType
 */

/**
 * Text classification pipeline using any `ModelForSequenceClassification`.
 *
 * **Example:** Sentiment-analysis w/ `Xenova/distilbert-base-uncased-finetuned-sst-2-english`.
 * ```javascript
 * const classifier = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
 * const output = await classifier('I love transformers!');
 * // [{ label: 'POSITIVE', score: 0.999788761138916 }]
 * ```
 * 
 * **Example:** Multilingual sentiment-analysis w/ `Xenova/bert-base-multilingual-uncased-sentiment` (and return top 5 classes).
 * ```javascript
 * const classifier = await pipeline('sentiment-analysis', 'Xenova/bert-base-multilingual-uncased-sentiment');
 * const output = await classifier('Le meilleur film de tous les temps.', { topk: 5 });
 * // [
 * //   { label: '5 stars', score: 0.9610759615898132 },
 * //   { label: '4 stars', score: 0.03323351591825485 },
 * //   { label: '3 stars', score: 0.0036155181005597115 },
 * //   { label: '1 star', score: 0.0011325967498123646 },
 * //   { label: '2 stars', score: 0.0009423971059732139 }
 * // ]
 * ```
 * 
 * **Example:** Toxic comment classification w/ `Xenova/toxic-bert` (and return all classes).
 * ```javascript
 * const classifier = await pipeline('text-classification', 'Xenova/toxic-bert');
 * const output = await classifier('I hate you!', { topk: null });
 * // [
 * //   { label: 'toxic', score: 0.9593140482902527 },
 * //   { label: 'insult', score: 0.16187334060668945 },
 * //   { label: 'obscene', score: 0.03452680632472038 },
 * //   { label: 'identity_hate', score: 0.0223250575363636 },
 * //   { label: 'threat', score: 0.019197041168808937 },
 * //   { label: 'severe_toxic', score: 0.005651099607348442 }
 * // ]
 * ```
 */
class TextClassificationPipeline extends (/** @type {new (options: TextPipelineConstructorArgs) => TextClassificationPipelineType} */ (Pipeline)) {

    /**
     * Create a new TextClassificationPipeline.
     * @param {TextPipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {TextClassificationPipelineCallback} */
    async _call(texts, {
        topk = 1
    } = {}) {

        // Run tokenization
        const model_inputs = this.tokenizer(texts, {
            padding: true,
            truncation: true,
        });

        // Run model
        const outputs = await this.model(model_inputs)

        // TODO: Use softmax tensor function
        const function_to_apply =
            this.model.config.problem_type === 'multi_label_classification'
                ? batch => batch.sigmoid().data
                : batch => (0,maths/* softmax */.XA)(batch.data); // single_label_classification (default)

        const id2label = this.model.config.id2label;

        const toReturn = [];
        for (const batch of outputs.logits) {
            const output = function_to_apply(batch);
            const scores = (0,maths/* getTopItems */.em)(output, topk);

            const vals = scores.map(x => ({
                label: id2label[x[0]],
                score: x[1],
            }));
            if (topk === 1) {
                toReturn.push(...vals);
            } else {
                toReturn.push(vals);
            }
        }

        return Array.isArray(texts) || topk === 1 ? /** @type {TextClassificationOutput} */ (toReturn) : /** @type {TextClassificationOutput[]} */ (toReturn)[0];
    }
}

/**
 * @typedef {Object} TokenClassificationSingle
 * @property {string} word The token/word classified. This is obtained by decoding the selected tokens.
 * @property {number} score The corresponding probability for `entity`.
 * @property {string} entity The entity predicted for that token/word.
 * @property {number} index The index of the corresponding token in the sentence.
 * @property {number} [start] The index of the start of the corresponding entity in the sentence.
 * @property {number} [end] The index of the end of the corresponding entity in the sentence.
 * @typedef {TokenClassificationSingle[]} TokenClassificationOutput
 * 
 * @typedef {Object} TokenClassificationPipelineOptions Parameters specific to token classification pipelines.
 * @property {string[]} [ignore_labels] A list of labels to ignore.
 * 
 * @callback TokenClassificationPipelineCallback Classify each token of the text(s) given as inputs.
 * @param {string|string[]} texts One or several texts (or one list of texts) for token classification.
 * @param {TokenClassificationPipelineOptions} [options] The options to use for token classification.
 * @returns {Promise<TokenClassificationOutput|TokenClassificationOutput[]>} The result.
 * 
 * @typedef {TextPipelineConstructorArgs & TokenClassificationPipelineCallback & Disposable} TokenClassificationPipelineType
 */

/**
 * Named Entity Recognition pipeline using any `ModelForTokenClassification`.
 * 
 * **Example:** Perform named entity recognition with `Xenova/bert-base-NER`.
 * ```javascript
 * const classifier = await pipeline('token-classification', 'Xenova/bert-base-NER');
 * const output = await classifier('My name is Sarah and I live in London');
 * // [
 * //   { entity: 'B-PER', score: 0.9980202913284302, index: 4, word: 'Sarah' },
 * //   { entity: 'B-LOC', score: 0.9994474053382874, index: 9, word: 'London' }
 * // ]
 * ```
 * 
 * **Example:** Perform named entity recognition with `Xenova/bert-base-NER` (and return all labels).
 * ```javascript
 * const classifier = await pipeline('token-classification', 'Xenova/bert-base-NER');
 * const output = await classifier('Sarah lives in the United States of America', { ignore_labels: [] });
 * // [
 * //   { entity: 'B-PER', score: 0.9966587424278259, index: 1, word: 'Sarah' },
 * //   { entity: 'O', score: 0.9987385869026184, index: 2, word: 'lives' },
 * //   { entity: 'O', score: 0.9990072846412659, index: 3, word: 'in' },
 * //   { entity: 'O', score: 0.9988298416137695, index: 4, word: 'the' },
 * //   { entity: 'B-LOC', score: 0.9995510578155518, index: 5, word: 'United' },
 * //   { entity: 'I-LOC', score: 0.9990395307540894, index: 6, word: 'States' },
 * //   { entity: 'I-LOC', score: 0.9986724853515625, index: 7, word: 'of' },
 * //   { entity: 'I-LOC', score: 0.9975294470787048, index: 8, word: 'America' }
 * // ]
 * ```
 */
class TokenClassificationPipeline extends (/** @type {new (options: TextPipelineConstructorArgs) => TokenClassificationPipelineType} */ (Pipeline)) {

    /**
     * Create a new TokenClassificationPipeline.
     * @param {TextPipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {TokenClassificationPipelineCallback} */
    async _call(texts, {
        ignore_labels = ['O'],
    } = {}) {

        const isBatched = Array.isArray(texts);

        // Run tokenization
        const model_inputs = this.tokenizer(isBatched ? texts : [texts], {
            padding: true,
            truncation: true,
        });

        // Run model
        const outputs = await this.model(model_inputs)

        const logits = outputs.logits;
        const id2label = this.model.config.id2label;

        const toReturn = [];
        for (let i = 0; i < logits.dims[0]; ++i) {
            const ids = model_inputs.input_ids[i];
            const batch = logits[i];

            // List of tokens that aren't ignored
            const tokens = [];
            for (let j = 0; j < batch.dims[0]; ++j) {
                const tokenData = batch[j];
                const topScoreIndex = (0,maths/* max */.Fp)(tokenData.data)[1];

                const entity = id2label ? id2label[topScoreIndex] : `LABEL_${topScoreIndex}`;
                if (ignore_labels.includes(entity)) {
                    // We predicted a token that should be ignored. So, we skip it.
                    continue;
                }

                // TODO add option to keep special tokens?
                const word = this.tokenizer.decode([ids[j].item()], { skip_special_tokens: true });
                if (word === '') {
                    // Was a special token. So, we skip it.
                    continue;
                }

                const scores = (0,maths/* softmax */.XA)(tokenData.data);

                tokens.push({
                    entity: entity,
                    score: scores[topScoreIndex],
                    index: j,
                    word: word,

                    // TODO: null for now, but will add
                    start: null,
                    end: null,
                });
            }
            toReturn.push(tokens);
        }
        return isBatched ? toReturn : toReturn[0];
    }
}

/**
 * @typedef {Object} QuestionAnsweringOutput
 * @property {number} score The probability associated to the answer.
 * @property {number} [start] The character start index of the answer (in the tokenized version of the input).
 * @property {number} [end] The character end index of the answer (in the tokenized version of the input).
 * @property {string} answer The answer to the question.
 * 
 * @typedef {Object} QuestionAnsweringPipelineOptions Parameters specific to question answering pipelines.
 * @property {number} [topk=1] The number of top answer predictions to be returned.
 * 
 * @callback QuestionAnsweringPipelineCallback Answer the question(s) given as inputs by using the context(s).
 * @param {string|string[]} question One or several question(s) (must be used in conjunction with the `context` argument).
 * @param {string|string[]} context One or several context(s) associated with the question(s) (must be used in conjunction with the `question` argument).
 * @param {QuestionAnsweringPipelineOptions} [options] The options to use for question answering.
 * @returns {Promise<QuestionAnsweringOutput|QuestionAnsweringOutput[]>} An array or object containing the predicted answers and scores.
 * 
 * @typedef {TextPipelineConstructorArgs & QuestionAnsweringPipelineCallback & Disposable} QuestionAnsweringPipelineType
 */

/**
 * Question Answering pipeline using any `ModelForQuestionAnswering`.
 * 
 * **Example:** Run question answering with `Xenova/distilbert-base-uncased-distilled-squad`.
 * ```javascript
 * const answerer = await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad');
 * const question = 'Who was Jim Henson?';
 * const context = 'Jim Henson was a nice puppet.';
 * const output = await answerer(question, context);
 * // {
 * //   answer: "a nice puppet",
 * //   score: 0.5768911502526741
 * // }
 * ```
 */
class QuestionAnsweringPipeline extends (/** @type {new (options: TextPipelineConstructorArgs) => QuestionAnsweringPipelineType} */ (Pipeline)) {

    /**
     * Create a new QuestionAnsweringPipeline.
     * @param {TextPipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {QuestionAnsweringPipelineCallback} */
    async _call(question, context, {
        topk = 1
    } = {}) {

        // Run tokenization
        const inputs = this.tokenizer(question, {
            text_pair: context,
            padding: true,
            truncation: true,
        });

        const output = await this.model(inputs);

        /** @type {QuestionAnsweringOutput[]} */
        const toReturn = [];
        for (let j = 0; j < output.start_logits.dims[0]; ++j) {
            const ids = inputs.input_ids[j];
            const sepIndex = ids.indexOf(this.tokenizer.sep_token_id);

            const s1 = Array.from((0,maths/* softmax */.XA)(output.start_logits[j].data))
                .map((x, i) => [x, i])
                .filter(x => x[1] > sepIndex);
            const e1 = Array.from((0,maths/* softmax */.XA)(output.end_logits[j].data))
                .map((x, i) => [x, i])
                .filter(x => x[1] > sepIndex);

            const options = (0,core/* product */.O7)(s1, e1)
                .filter(x => x[0][1] <= x[1][1])
                .map(x => [x[0][1], x[1][1], x[0][0] * x[1][0]])
                .sort((a, b) => b[2] - a[2]);

            for (let k = 0; k < Math.min(options.length, topk); ++k) {
                const [start, end, score] = options[k];

                const answer_tokens = [...ids].slice(start, end + 1)

                const answer = this.tokenizer.decode(answer_tokens, {
                    skip_special_tokens: true,
                });

                // TODO add start and end?
                // NOTE: HF returns character index
                toReturn.push({
                    answer, score
                });
            }
        }

        // Mimic HF's return type based on topk
        return (topk === 1) ? toReturn[0] : toReturn;
    }
}


/**
 * @typedef {Object} FillMaskSingle
 * @property {string} sequence The corresponding input with the mask token prediction.
 * @property {number} score The corresponding probability.
 * @property {number} token The predicted token id (to replace the masked one).
 * @property {string} token_str The predicted token (to replace the masked one).
 * @typedef {FillMaskSingle[]} FillMaskOutput
 * 
 * @typedef {Object} FillMaskPipelineOptions Parameters specific to fill mask pipelines.
 * @property {number} [topk=5] When passed, overrides the number of predictions to return.
 * 
 * @callback FillMaskPipelineCallback Fill the masked token in the text(s) given as inputs.
 * @param {string|string[]} texts One or several texts (or one list of prompts) with masked tokens.
 * @param {FillMaskPipelineOptions} [options] The options to use for masked language modelling.
 * @returns {Promise<FillMaskOutput|FillMaskOutput[]>} An array of objects containing the score, predicted token, predicted token string,
 * and the sequence with the predicted token filled in, or an array of such arrays (one for each input text).
 * If only one input text is given, the output will be an array of objects.
 * @throws {Error} When the mask token is not found in the input text.
 * 
 * @typedef {TextPipelineConstructorArgs & FillMaskPipelineCallback & Disposable} FillMaskPipelineType
 */

/**
 * Masked language modeling prediction pipeline using any `ModelWithLMHead`.
 * 
 * **Example:** Perform masked language modelling (a.k.a. "fill-mask") with `Xenova/bert-base-uncased`.
 * ```javascript
 * const unmasker = await pipeline('fill-mask', 'Xenova/bert-base-cased');
 * const output = await unmasker('The goal of life is [MASK].');
 * // [
 * //   { token_str: 'survival', score: 0.06137419492006302, token: 8115, sequence: 'The goal of life is survival.' },
 * //   { token_str: 'love', score: 0.03902450203895569, token: 1567, sequence: 'The goal of life is love.' },
 * //   { token_str: 'happiness', score: 0.03253183513879776, token: 9266, sequence: 'The goal of life is happiness.' },
 * //   { token_str: 'freedom', score: 0.018736306577920914, token: 4438, sequence: 'The goal of life is freedom.' },
 * //   { token_str: 'life', score: 0.01859794743359089, token: 1297, sequence: 'The goal of life is life.' }
 * // ]
 * ```
 * 
 * **Example:** Perform masked language modelling (a.k.a. "fill-mask") with `Xenova/bert-base-cased` (and return top result).
 * ```javascript
 * const unmasker = await pipeline('fill-mask', 'Xenova/bert-base-cased');
 * const output = await unmasker('The Milky Way is a [MASK] galaxy.', { topk: 1 });
 * // [{ token_str: 'spiral', score: 0.6299987435340881, token: 14061, sequence: 'The Milky Way is a spiral galaxy.' }]
 * ```
 */
class FillMaskPipeline extends (/** @type {new (options: TextPipelineConstructorArgs) => FillMaskPipelineType} */ (Pipeline)) {

    /**
     * Create a new FillMaskPipeline.
     * @param {TextPipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {FillMaskPipelineCallback} */
    async _call(texts, {
        topk = 5
    } = {}) {

        // Run tokenization
        const model_inputs = this.tokenizer(texts, {
            padding: true,
            truncation: true,
        });

        // Run model
        const outputs = await this.model(model_inputs)

        const toReturn = [];

        for (let i = 0; i < model_inputs.input_ids.dims[0]; ++i) {
            const ids = model_inputs.input_ids[i];
            const mask_token_index = ids.indexOf(this.tokenizer.mask_token_id)

            if (mask_token_index === -1) {
                throw Error(`Mask token (${this.tokenizer.mask_token}) not found in text.`)
            }
            const logits = outputs.logits[i];
            const itemLogits = logits[mask_token_index];

            const scores = (0,maths/* getTopItems */.em)((0,maths/* softmax */.XA)(itemLogits.data), topk);

            toReturn.push(scores.map(x => {
                const sequence = [...ids];
                sequence[mask_token_index] = x[0];

                return {
                    score: x[1],
                    token: x[0],
                    token_str: this.tokenizer.model.vocab[x[0]],
                    sequence: this.tokenizer.decode(sequence, { skip_special_tokens: true }),
                }
            }));
        }
        return Array.isArray(texts) ? toReturn : toReturn[0];
    }
}


/**
 * @typedef {Object} Text2TextGenerationSingle
 * @property {string} generated_text The generated text.
 * @typedef {Text2TextGenerationSingle[]} Text2TextGenerationOutput
 * 
 * @callback Text2TextGenerationPipelineCallback Generate the output text(s) using text(s) given as inputs.
 * @param {string|string[]} texts Input text for the encoder.
 * @param {import('./utils/generation.js').GenerationConfigType} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<Text2TextGenerationOutput|Text2TextGenerationOutput[]>}
 * 
 * @typedef {TextPipelineConstructorArgs & Text2TextGenerationPipelineCallback & Disposable} Text2TextGenerationPipelineType
 */

/**
 * Text2TextGenerationPipeline class for generating text using a model that performs text-to-text generation tasks.
 * 
 * **Example:** Text-to-text generation w/ `Xenova/LaMini-Flan-T5-783M`.
 * ```javascript
 * const generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-783M');
 * const output = await generator('how can I become more healthy?', {
 *   max_new_tokens: 100,
 * });
 * // [{ generated_text: "To become more healthy, you can: 1. Eat a balanced diet with plenty of fruits, vegetables, whole grains, lean proteins, and healthy fats. 2. Stay hydrated by drinking plenty of water. 3. Get enough sleep and manage stress levels. 4. Avoid smoking and excessive alcohol consumption. 5. Regularly exercise and maintain a healthy weight. 6. Practice good hygiene and sanitation. 7. Seek medical attention if you experience any health issues." }]
 * ```
 */
class Text2TextGenerationPipeline extends (/** @type {new (options: TextPipelineConstructorArgs) => Text2TextGenerationPipelineType} */ (Pipeline)) {
    /** @type {'generated_text'} */
    _key = 'generated_text';

    /**
     * Create a new Text2TextGenerationPipeline.
     * @param {TextPipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {Text2TextGenerationPipelineCallback} */
    async _call(texts, generate_kwargs = {}) {
        if (!Array.isArray(texts)) {
            texts = [texts];
        }


        // Add global prefix, if present
        if (this.model.config.prefix) {
            texts = texts.map(x => this.model.config.prefix + x)
        }

        // Handle task specific params:
        const task_specific_params = this.model.config.task_specific_params
        if (task_specific_params && task_specific_params[this.task]) {
            // Add prefixes, if present
            if (task_specific_params[this.task].prefix) {
                texts = texts.map(x => task_specific_params[this.task].prefix + x)
            }

            // TODO update generation config
        }

        const tokenizer = this.tokenizer;
        const tokenizer_options = {
            padding: true,
            truncation: true,
        }
        let input_ids;
        if (this instanceof TranslationPipeline && '_build_translation_inputs' in tokenizer) {
            // TODO: move to Translation pipeline?
            // Currently put here to avoid code duplication
            // @ts-ignore
            input_ids = tokenizer._build_translation_inputs(texts, tokenizer_options, generate_kwargs).input_ids;

        } else {
            input_ids = tokenizer(texts, tokenizer_options).input_ids;
        }

        const outputTokenIds = await this.model.generate(input_ids, generate_kwargs);

        return tokenizer.batch_decode(outputTokenIds, {
            skip_special_tokens: true,
        }).map(text => ({ [this._key]: text }));
    }
}


/**
 * @typedef {Object} SummarizationSingle
 * @property {string} summary_text The summary text.
 * @typedef {SummarizationSingle[]} SummarizationOutput
 * 
 * @callback SummarizationPipelineCallback Summarize the text(s) given as inputs.
 * @param {string|string[]} texts One or several articles (or one list of articles) to summarize.
 * @param {import('./utils/generation.js').GenerationConfigType} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<SummarizationOutput|SummarizationOutput[]>}
 * 
 * @typedef {TextPipelineConstructorArgs & SummarizationPipelineCallback & Disposable} SummarizationPipelineType
 */

/**
 * A pipeline for summarization tasks, inheriting from Text2TextGenerationPipeline.
 * 
 * **Example:** Summarization w/ `Xenova/distilbart-cnn-6-6`.
 * ```javascript
 * const generator = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
 * const text = 'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, ' +
 *   'and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. ' +
 *   'During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest ' +
 *   'man-made structure in the world, a title it held for 41 years until the Chrysler Building in New ' +
 *   'York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to ' +
 *   'the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the ' +
 *   'Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second ' +
 *   'tallest free-standing structure in France after the Millau Viaduct.';
 * const output = await generator(text, {
 *   max_new_tokens: 100,
 * });
 * // [{ summary_text: ' The Eiffel Tower is about the same height as an 81-storey building and the tallest structure in Paris. It is the second tallest free-standing structure in France after the Millau Viaduct.' }]
 * ```
 */
class SummarizationPipeline extends (/** @type {new (options: TextPipelineConstructorArgs) => SummarizationPipelineType} */ (/** @type {any} */ (Text2TextGenerationPipeline))) {
    /** @type {'summary_text'} */
    _key = 'summary_text';

    /**
     * Create a new SummarizationPipeline.
     * @param {TextPipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }
}


/**
 * @typedef {Object} TranslationSingle
 * @property {string} translation_text The translated text.
 * @typedef {TranslationSingle[]} TranslationOutput
 * 
 * @callback TranslationPipelineCallback Translate the text(s) given as inputs.
 * @param {string|string[]} texts Texts to be translated.
 * @param {import('./utils/generation.js').GenerationConfigType} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<TranslationOutput|TranslationOutput[]>}
 * 
 * @typedef {TextPipelineConstructorArgs & TranslationPipelineCallback & Disposable} TranslationPipelineType
 */

/**
 * Translates text from one language to another.
 * 
 * **Example:** Multilingual translation w/ `Xenova/nllb-200-distilled-600M`.
 * 
 * See [here](https://github.com/facebookresearch/flores/blob/main/flores200/README.md#languages-in-flores-200)
 * for the full list of languages and their corresponding codes.
 * 
 * ```javascript
 * const translator = await pipeline('translation', 'Xenova/nllb-200-distilled-600M');
 * const output = await translator('जीवन एक चॉकलेट बॉक्स की तरह है।', {
 *   src_lang: 'hin_Deva', // Hindi
 *   tgt_lang: 'fra_Latn', // French
 * });
 * // [{ translation_text: 'La vie est comme une boîte à chocolat.' }]
 * ```
 * 
 * **Example:** Multilingual translation w/ `Xenova/m2m100_418M`.
 * 
 * See [here](https://huggingface.co/facebook/m2m100_418M#languages-covered)
 * for the full list of languages and their corresponding codes.
 * 
 * ```javascript
 * const translator = await pipeline('translation', 'Xenova/m2m100_418M');
 * const output = await translator('生活就像一盒巧克力。', {
 *   src_lang: 'zh', // Chinese
 *   tgt_lang: 'en', // English
 * });
 * // [{ translation_text: 'Life is like a box of chocolate.' }]
 * ```
 * 
 * **Example:** Multilingual translation w/ `Xenova/mbart-large-50-many-to-many-mmt`.
 * 
 * See [here](https://huggingface.co/facebook/mbart-large-50-many-to-many-mmt#languages-covered)
 * for the full list of languages and their corresponding codes.
 * 
 * ```javascript
 * const translator = await pipeline('translation', 'Xenova/mbart-large-50-many-to-many-mmt');
 * const output = await translator('संयुक्त राष्ट्र के प्रमुख का कहना है कि सीरिया में कोई सैन्य समाधान नहीं है', {
 *   src_lang: 'hi_IN', // Hindi
 *   tgt_lang: 'fr_XX', // French
 * });
 * // [{ translation_text: 'Le chef des Nations affirme qu 'il n 'y a military solution in Syria.' }]
 * ```
 */
class TranslationPipeline extends (/** @type {new (options: TextPipelineConstructorArgs) => TranslationPipelineType} */ (/** @type {any} */ (Text2TextGenerationPipeline))) {
    /** @type {'translation_text'} */
    _key = 'translation_text';

    /**
     * Create a new TranslationPipeline.
     * @param {TextPipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }
}

function isChat(x) {
    return Array.isArray(x) && x.every(x => 'role' in x && 'content' in x);
}

/**
 * @typedef {import('./tokenizers.js').Message[]} Chat
 * 
 * @typedef {Object} TextGenerationSingle
 * @property {string|Chat} generated_text The generated text.
 * @typedef {TextGenerationSingle[]} TextGenerationOutput
 * 
 * @typedef {Object} TextGenerationSpecificParams Parameters specific to text-generation pipelines.
 * @property {boolean} [add_special_tokens] Whether or not to add special tokens when tokenizing the sequences.
 * @property {boolean} [return_full_text=true] If set to `false` only added text is returned, otherwise the full text is returned.
 * @typedef {import('./utils/generation.js').GenerationConfigType & TextGenerationSpecificParams} TextGenerationConfig
 * 
 * @callback TextGenerationPipelineCallback Complete the prompt(s) given as inputs.
 * @param {string|string[]|Chat|Chat[]} texts One or several prompts (or one list of prompts) to complete.
 * @param {TextGenerationConfig} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<TextGenerationOutput|TextGenerationOutput[]>} An array or object containing the generated texts.
 * 
 * @typedef {TextPipelineConstructorArgs & TextGenerationPipelineCallback & Disposable} TextGenerationPipelineType
 */

/**
 * Language generation pipeline using any `ModelWithLMHead` or `ModelForCausalLM`.
 * This pipeline predicts the words that will follow a specified text prompt.
 * NOTE: For the full list of generation parameters, see [`GenerationConfig`](./utils/generation#module_utils/generation.GenerationConfig).
 * 
 * **Example:** Text generation with `Xenova/distilgpt2` (default settings).
 * ```javascript
 * const generator = await pipeline('text-generation', 'Xenova/distilgpt2');
 * const text = 'I enjoy walking with my cute dog,';
 * const output = await generator(text);
 * // [{ generated_text: "I enjoy walking with my cute dog, and I love to play with the other dogs." }]
 * ```
 * 
 * **Example:** Text generation with `Xenova/distilgpt2` (custom settings).
 * ```javascript
 * const generator = await pipeline('text-generation', 'Xenova/distilgpt2');
 * const text = 'Once upon a time, there was';
 * const output = await generator(text, {
 *   temperature: 2,
 *   max_new_tokens: 10,
 *   repetition_penalty: 1.5,
 *   no_repeat_ngram_size: 2,
 *   num_beams: 2,
 *   num_return_sequences: 2,
 * });
 * // [{
 * //   "generated_text": "Once upon a time, there was an abundance of information about the history and activities that"
 * // }, {
 * //   "generated_text": "Once upon a time, there was an abundance of information about the most important and influential"
 * // }]
 * ```
 * 
 * **Example:** Run code generation with `Xenova/codegen-350M-mono`.
 * ```javascript
 * const generator = await pipeline('text-generation', 'Xenova/codegen-350M-mono');
 * const text = 'def fib(n):';
 * const output = await generator(text, {
 *   max_new_tokens: 44,
 * });
 * // [{
 * //   generated_text: 'def fib(n):\n' +
 * //     '    if n == 0:\n' +
 * //     '        return 0\n' +
 * //     '    elif n == 1:\n' +
 * //     '        return 1\n' +
 * //     '    else:\n' +
 * //     '        return fib(n-1) + fib(n-2)\n'
 * // }]
 * ```
 */
class TextGenerationPipeline extends (/** @type {new (options: TextPipelineConstructorArgs) => TextGenerationPipelineType} */ (Pipeline)) {

    /**
     * Create a new TextGenerationPipeline.
     * @param {TextPipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {TextGenerationPipelineCallback} */
    async _call(texts, generate_kwargs = {}) {
        let isBatched = false;
        let isChatInput = false;

        // Normalize inputs
        /** @type {string[]} */
        let inputs;
        if (typeof texts === 'string') {
            inputs = texts = [texts];
        } else if (Array.isArray(texts) && texts.every(x => typeof x === 'string')) {
            isBatched = true;
            inputs = /** @type {string[]} */(texts);
        } else {
            if (isChat(texts)) {
                texts = [/** @type {Chat} */(texts)];
            } else if (Array.isArray(texts) && texts.every(isChat)) {
                isBatched = true;
            } else {
                throw new Error('Input must be a string, an array of strings, a Chat, or an array of Chats');
            }
            isChatInput = true;

            // If the input is a chat, we need to apply the chat template
            inputs = /** @type {string[]} */(/** @type {Chat[]} */ (texts).map(
                x => this.tokenizer.apply_chat_template(x, {
                    tokenize: false,
                    add_generation_prompt: true,
                })
            ));
        }

        // By default, do not add special tokens
        const add_special_tokens = generate_kwargs.add_special_tokens ?? false;

        // By default, return full text
        const return_full_text = isChatInput
            ? false
            : generate_kwargs.return_full_text ?? true;

        this.tokenizer.padding_side = 'left';
        const { input_ids, attention_mask } = this.tokenizer(inputs, {
            add_special_tokens,
            padding: true,
            truncation: true,
        });

        const outputTokenIds = await this.model.generate(input_ids, generate_kwargs, null, {
            inputs_attention_mask: attention_mask
        });

        let decoded = this.tokenizer.batch_decode(outputTokenIds, {
            skip_special_tokens: true,
        });


        let promptLengths;
        if (!return_full_text && input_ids.dims.at(-1) > 0) {
            promptLengths = this.tokenizer.batch_decode(input_ids, {
                skip_special_tokens: true,
            }).map(x => x.length);
        }

        /** @type {TextGenerationOutput[]} */
        const toReturn = Array.from({ length: texts.length }, _ => []);
        for (let i = 0; i < decoded.length; ++i) {
            const textIndex = Math.floor(i / outputTokenIds.length * texts.length);

            if (promptLengths) {
                // Trim the decoded text to only include the generated part
                decoded[i] = decoded[i].slice(promptLengths[textIndex]);
            }
            toReturn[textIndex].push({
                generated_text: isChatInput
                    ? [
                        ...((/** @type {Chat[]} */(texts)[textIndex])),
                        { role: 'assistant', content: decoded[i] },
                    ]
                    : decoded[i]
            });
        }
        return (!isBatched && toReturn.length === 1) ? toReturn[0] : toReturn;
    }
}

/**
 * @typedef {Object} ZeroShotClassificationOutput
 * @property {string} sequence The sequence for which this is the output.
 * @property {string[]} labels The labels sorted by order of likelihood.
 * @property {number[]} scores The probabilities for each of the labels.
 * 
 * @typedef {Object} ZeroShotClassificationPipelineOptions Parameters specific to zero-shot classification pipelines.
 * @property {string} [hypothesis_template="This example is {}."] The template used to turn each
 * candidate label into an NLI-style hypothesis. The candidate label will replace the {} placeholder.
 * @property {boolean} [multi_label=false] Whether or not multiple candidate labels can be true.
 * If `false`, the scores are normalized such that the sum of the label likelihoods for each sequence
 * is 1. If `true`, the labels are considered independent and probabilities are normalized for each
 * candidate by doing a softmax of the entailment score vs. the contradiction score.
 * 
 * @callback ZeroShotClassificationPipelineCallback Classify the sequence(s) given as inputs.
 * @param {string|string[]} texts The sequence(s) to classify, will be truncated if the model input is too large.
 * @param {string|string[]} candidate_labels The set of possible class labels to classify each sequence into.
 * Can be a single label, a string of comma-separated labels, or a list of labels.
 * @param {ZeroShotClassificationPipelineOptions} [options] The options to use for zero-shot classification.
 * @returns {Promise<ZeroShotClassificationOutput|ZeroShotClassificationOutput[]>} An array or object containing the predicted labels and scores.
 * 
 * @typedef {TextPipelineConstructorArgs & ZeroShotClassificationPipelineCallback & Disposable} ZeroShotClassificationPipelineType
 */

/**
 * NLI-based zero-shot classification pipeline using a `ModelForSequenceClassification`
 * trained on NLI (natural language inference) tasks. Equivalent of `text-classification`
 * pipelines, but these models don't require a hardcoded number of potential classes, they
 * can be chosen at runtime. It usually means it's slower but it is **much** more flexible.
 * 
 * **Example:** Zero shot classification with `Xenova/mobilebert-uncased-mnli`.
 * ```javascript
 * const classifier = await pipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli');
 * const text = 'Last week I upgraded my iOS version and ever since then my phone has been overheating whenever I use your app.';
 * const labels = [ 'mobile', 'billing', 'website', 'account access' ];
 * const output = await classifier(text, labels);
 * // {
 * //   sequence: 'Last week I upgraded my iOS version and ever since then my phone has been overheating whenever I use your app.',
 * //   labels: [ 'mobile', 'website', 'billing', 'account access' ],
 * //   scores: [ 0.5562091040482018, 0.1843621307860853, 0.13942646639336376, 0.12000229877234923 ]
 * // }
 * ```
 * 
 * **Example:** Zero shot classification with `Xenova/nli-deberta-v3-xsmall` (multi-label).
 * ```javascript
 * const classifier = await pipeline('zero-shot-classification', 'Xenova/nli-deberta-v3-xsmall');
 * const text = 'I have a problem with my iphone that needs to be resolved asap!';
 * const labels = [ 'urgent', 'not urgent', 'phone', 'tablet', 'computer' ];
 * const output = await classifier(text, labels, { multi_label: true });
 * // {
 * //   sequence: 'I have a problem with my iphone that needs to be resolved asap!',
 * //   labels: [ 'urgent', 'phone', 'computer', 'tablet', 'not urgent' ],
 * //   scores: [ 0.9958870956360275, 0.9923963400697035, 0.002333537946160235, 0.0015134138567598765, 0.0010699384208377163 ]
 * // }
 * ```
 */
class ZeroShotClassificationPipeline extends (/** @type {new (options: TextPipelineConstructorArgs) => ZeroShotClassificationPipelineType} */ (Pipeline)) {
    /**
     * Create a new ZeroShotClassificationPipeline.
     * @param {TextPipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);

        // Use model config to get label2id mapping
        this.label2id = Object.fromEntries(
            Object.entries((/** @type {any} */(this).model).config.label2id).map(
                ([k, v]) => [k.toLowerCase(), v]
            )
        );

        this.entailment_id = this.label2id['entailment'];
        if (this.entailment_id === undefined) {
            console.warn("Could not find 'entailment' in label2id mapping. Using 2 as entailment_id.");
            this.entailment_id = 2;
        }

        this.contradiction_id = this.label2id['contradiction'] ?? this.label2id['not_entailment'];
        if (this.contradiction_id === undefined) {
            console.warn("Could not find 'contradiction' in label2id mapping. Using 0 as contradiction_id.");
            this.contradiction_id = 0;
        }
    }

    /** @type {ZeroShotClassificationPipelineCallback} */
    async _call(texts, candidate_labels, {
        hypothesis_template = "This example is {}.",
        multi_label = false,
    } = {}) {

        const isBatched = Array.isArray(texts);
        if (!isBatched) {
            texts = [/** @type {string} */ (texts)];
        }
        if (!Array.isArray(candidate_labels)) {
            candidate_labels = [candidate_labels];
        }

        // Insert labels into hypothesis template
        const hypotheses = candidate_labels.map(
            x => hypothesis_template.replace('{}', x)
        );

        // How to perform the softmax over the logits:
        //  - true:  softmax over the entailment vs. contradiction dim for each label independently
        //  - false: softmax the "entailment" logits over all candidate labels
        const softmaxEach = multi_label || candidate_labels.length === 1;

        /** @type {ZeroShotClassificationOutput[]} */
        const toReturn = [];
        for (const premise of texts) {
            const entails_logits = [];

            for (const hypothesis of hypotheses) {
                const inputs = this.tokenizer(premise, {
                    text_pair: hypothesis,
                    padding: true,
                    truncation: true,
                })
                const outputs = await this.model(inputs)

                if (softmaxEach) {
                    entails_logits.push([
                        outputs.logits.data[this.contradiction_id],
                        outputs.logits.data[this.entailment_id]
                    ])
                } else {
                    entails_logits.push(outputs.logits.data[this.entailment_id])
                }
            }

            /** @type {number[]} */
            const scores = softmaxEach
                ? entails_logits.map(x => (0,maths/* softmax */.XA)(x)[1])
                : (0,maths/* softmax */.XA)(entails_logits);

            // Sort by scores (desc) and return scores with indices
            const scores_sorted = scores
                .map((x, i) => [x, i])
                .sort((a, b) => (b[0] - a[0]));

            toReturn.push({
                sequence: premise,
                labels: scores_sorted.map(x => candidate_labels[x[1]]),
                scores: scores_sorted.map(x => x[0]),
            });
        }
        return isBatched ? toReturn : toReturn[0];
    }
}

/**
 * @typedef {Object} FeatureExtractionPipelineOptions Parameters specific to feature extraction pipelines.
 * @property {'none'|'mean'|'cls'} [pooling="none"] The pooling method to use.
 * @property {boolean} [normalize=false] Whether or not to normalize the embeddings in the last dimension.
 * @property {boolean} [quantize=false] Whether or not to quantize the embeddings.
 * @property {'binary'|'ubinary'} [precision='binary'] The precision to use for quantization. 
 * 
 * @callback FeatureExtractionPipelineCallback Extract the features of the input(s).
 * @param {string|string[]} texts One or several texts (or one list of texts) to get the features of.
 * @param {FeatureExtractionPipelineOptions} [options] The options to use for feature extraction.
 * @returns {Promise<Tensor>} The features computed by the model.
 * 
 * @typedef {TextPipelineConstructorArgs & FeatureExtractionPipelineCallback & Disposable} FeatureExtractionPipelineType
 */

/**
 * Feature extraction pipeline using no model head. This pipeline extracts the hidden
 * states from the base transformer, which can be used as features in downstream tasks.
 * 
 * **Example:** Run feature extraction with `bert-base-uncased` (without pooling/normalization).
 * ```javascript
 * const extractor = await pipeline('feature-extraction', 'Xenova/bert-base-uncased', { revision: 'default' });
 * const output = await extractor('This is a simple test.');
 * // Tensor {
 * //   type: 'float32',
 * //   data: Float32Array [0.05939924716949463, 0.021655935794115067, ...],
 * //   dims: [1, 8, 768]
 * // }
 * ```
 * 
 * **Example:** Run feature extraction with `bert-base-uncased` (with pooling/normalization).
 * ```javascript
 * const extractor = await pipeline('feature-extraction', 'Xenova/bert-base-uncased', { revision: 'default' });
 * const output = await extractor('This is a simple test.', { pooling: 'mean', normalize: true });
 * // Tensor {
 * //   type: 'float32',
 * //   data: Float32Array [0.03373778983950615, -0.010106077417731285, ...],
 * //   dims: [1, 768]
 * // }
 * ```
 * 
 * **Example:** Calculating embeddings with `sentence-transformers` models.
 * ```javascript
 * const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
 * const output = await extractor('This is a simple test.', { pooling: 'mean', normalize: true });
 * // Tensor {
 * //   type: 'float32',
 * //   data: Float32Array [0.09094982594251633, -0.014774246141314507, ...],
 * //   dims: [1, 384]
 * // }
 * ```
 * **Example:** Calculating binary embeddings with `sentence-transformers` models.
 * ```javascript
 * const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
 * const output = await extractor('This is a simple test.', { pooling: 'mean', quantize: true, precision: 'binary' });
 * // Tensor {
 * //   type: 'int8',
 * //   data: Int8Array [49, 108, 24, ...],
 * //   dims: [1, 48]
 * // }
 * ```
 */
class FeatureExtractionPipeline extends (/** @type {new (options: TextPipelineConstructorArgs) => FeatureExtractionPipelineType} */ (Pipeline)) {
    /**
     * Create a new FeatureExtractionPipeline.
     * @param {TextPipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {FeatureExtractionPipelineCallback} */
    async _call(texts, {
        pooling = /** @type {'none'} */('none'),
        normalize = false,
        quantize = false,
        precision = /** @type {'binary'} */('binary'),
    } = {}) {

        // Run tokenization
        const model_inputs = this.tokenizer(texts, {
            padding: true,
            truncation: true,
        });

        // Run model
        const outputs = await this.model(model_inputs)

        // TODO: Provide warning to the user that they might be using model which was not exported
        // specifically for feature extraction
        // console.log(this.model.config)
        // console.log(outputs)

        /** @type {Tensor} */
        let result = outputs.last_hidden_state ?? outputs.logits ?? outputs.token_embeddings;
        if (pooling === 'none') {
            // Skip pooling
        } else if (pooling === 'mean') {
            result = (0,utils_tensor/* mean_pooling */.v6)(result, model_inputs.attention_mask);
        } else if (pooling === 'cls') {
            result = result.slice(null, 0);
        } else {
            throw Error(`Pooling method '${pooling}' not supported.`);
        }

        if (normalize) {
            result = result.normalize(2, -1);
        }

        if (quantize) {
            result = (0,utils_tensor/* quantize_embeddings */.e)(result, precision);
        }

        return result;
    }
}


/**
 * @typedef {Object} ImageFeatureExtractionPipelineOptions Parameters specific to image feature extraction pipelines.
 * @property {boolean} [pool=null] Whether or not to return the pooled output. If set to `false`, the model will return the raw hidden states.
 * 
 * @callback ImageFeatureExtractionPipelineCallback Extract the features of the input(s).
 * @param {ImagePipelineInputs} images One or several images (or one list of images) to get the features of.
 * @param {ImageFeatureExtractionPipelineOptions} [options] The options to use for image feature extraction.
 * @returns {Promise<Tensor>} The image features computed by the model.
 * 
 * @typedef {ImagePipelineConstructorArgs & ImageFeatureExtractionPipelineCallback & Disposable} ImageFeatureExtractionPipelineType
 */

/**
 * Image feature extraction pipeline using no model head. This pipeline extracts the hidden
 * states from the base transformer, which can be used as features in downstream tasks.
 * 
 * **Example:** Perform image feature extraction with `Xenova/vit-base-patch16-224-in21k`.
 * ```javascript
 * const image_feature_extractor = await pipeline('image-feature-extraction', 'Xenova/vit-base-patch16-224-in21k');
 * const url = 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/cats.png';
 * const features = await image_feature_extractor(url);
 * // Tensor {
 * //   dims: [ 1, 197, 768 ],
 * //   type: 'float32',
 * //   data: Float32Array(151296) [ ... ],
 * //   size: 151296
 * // }
 * ```
 * 
 * **Example:** Compute image embeddings with `Xenova/clip-vit-base-patch32`.
 * ```javascript
 * const image_feature_extractor = await pipeline('image-feature-extraction', 'Xenova/clip-vit-base-patch32');
 * const url = 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/cats.png';
 * const features = await image_feature_extractor(url);
 * // Tensor {
 * //   dims: [ 1, 512 ],
 * //   type: 'float32',
 * //   data: Float32Array(512) [ ... ],
 * //   size: 512
 * // }
 * ```
 */
class ImageFeatureExtractionPipeline extends (/** @type {new (options: ImagePipelineConstructorArgs) => ImageFeatureExtractionPipelineType} */ (Pipeline)) {
    /**
     * Create a new ImageFeatureExtractionPipeline.
     * @param {ImagePipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {ImageFeatureExtractionPipelineCallback} */
    async _call(images, {
        pool = null,
    } = {}) {

        const preparedImages = await prepareImages(images);
        const { pixel_values } = await this.processor(preparedImages);
        const outputs = await this.model({ pixel_values });

        /** @type {Tensor} */
        let result;
        if (pool) {
            if (!('pooler_output' in outputs)) {
                throw Error(`No pooled output was returned. Make sure the model has a 'pooler' layer when using the 'pool' option.`);
            }
            result = outputs.pooler_output;

        } else {
            result = outputs.last_hidden_state ?? outputs.logits ?? outputs.image_embeds;
        }
        return result;
    }
}

// TODO
// export class SentenceSimilarityPipeline extends Pipeline {
// }

/**
 * @typedef {Object} AudioClassificationSingle
 * @property {string} label The label predicted.
 * @property {number} score The corresponding probability.
 * @typedef {AudioClassificationSingle[]} AudioClassificationOutput
 * 
 * @typedef {Object} AudioClassificationPipelineOptions Parameters specific to audio classification pipelines.
 * @property {number} [topk=null] The number of top labels that will be returned by the pipeline.
 * If the provided number is `null` or higher than the number of labels available in the model configuration,
 * it will default to the number of labels.
 * 
 * @callback AudioClassificationPipelineCallback Classify the sequence(s) given as inputs.
 * @param {AudioPipelineInputs} audio The input audio file(s) to be classified. The input is either:
 * - `string` or `URL` that is the filename/URL of the audio file, the file will be read at the processor's sampling rate
 * to get the waveform using the [`AudioContext`](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) API.
 * If `AudioContext` is not available, you should pass the raw waveform in as a Float32Array of shape `(n, )`.
 * - `Float32Array` or `Float64Array` of shape `(n, )`, representing the raw audio at the correct sampling rate (no further check will be done).
 * @param {AudioClassificationPipelineOptions} [options] The options to use for audio classification.
 * @returns {Promise<AudioClassificationOutput|AudioClassificationOutput[]>} An array or object containing the predicted labels and scores.
 * 
 * @typedef {AudioPipelineConstructorArgs & AudioClassificationPipelineCallback & Disposable} AudioClassificationPipelineType
 */

/**
 * Audio classification pipeline using any `AutoModelForAudioClassification`.
 * This pipeline predicts the class of a raw waveform or an audio file.
 * 
 * **Example:** Perform audio classification with `Xenova/wav2vec2-large-xlsr-53-gender-recognition-librispeech`.
 * ```javascript
 * const classifier = await pipeline('audio-classification', 'Xenova/wav2vec2-large-xlsr-53-gender-recognition-librispeech');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
 * const output = await classifier(url);
 * // [
 * //   { label: 'male', score: 0.9981542229652405 },
 * //   { label: 'female', score: 0.001845747814513743 }
 * // ]
 * ```
 * 
 * **Example:** Perform audio classification with `Xenova/ast-finetuned-audioset-10-10-0.4593` and return top 4 results.
 * ```javascript
 * const classifier = await pipeline('audio-classification', 'Xenova/ast-finetuned-audioset-10-10-0.4593');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/cat_meow.wav';
 * const output = await classifier(url, { topk: 4 });
 * // [
 * //   { label: 'Meow', score: 0.5617874264717102 },
 * //   { label: 'Cat', score: 0.22365376353263855 },
 * //   { label: 'Domestic animals, pets', score: 0.1141069084405899 },
 * //   { label: 'Animal', score: 0.08985692262649536 },
 * // ]
 * ```
 */
class AudioClassificationPipeline extends (/** @type {new (options: AudioPipelineConstructorArgs) => AudioClassificationPipelineType} */ (Pipeline)) {

    /**
     * Create a new AudioClassificationPipeline.
     * @param {AudioPipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {AudioClassificationPipelineCallback} */
    async _call(audio, {
        topk = null
    } = {}) {

        const single = !Array.isArray(audio);

        const sampling_rate = this.processor.feature_extractor.config.sampling_rate;
        const preparedAudios = await prepareAudios(audio, sampling_rate);

        const id2label = this.model.config.id2label;

        const toReturn = [];
        for (const aud of preparedAudios) {
            const inputs = await this.processor(aud);
            const output = await this.model(inputs);
            const logits = output.logits[0];

            const scores = (0,maths/* getTopItems */.em)((0,maths/* softmax */.XA)(logits.data), topk);

            const vals = scores.map(x => ({
                label: /** @type {string} */ (id2label[x[0]]),
                score: /** @type {number} */ (x[1]),
            }));

            if (topk === 1) {
                toReturn.push(...vals);
            } else {
                toReturn.push(vals);
            }
        }
        return !single || topk === 1 ? /** @type {AudioClassificationOutput} */ (toReturn) : /** @type {AudioClassificationOutput[]} */ (toReturn)[0];
    }
}

/**
 * @typedef {Object} ZeroShotAudioClassificationOutput
 * @property {string} label The label identified by the model. It is one of the suggested `candidate_label`.
 * @property {number} score The score attributed by the model for that label (between 0 and 1).
 * 
 * @typedef {Object} ZeroShotAudioClassificationPipelineOptions Parameters specific to zero-shot audio classification pipelines.
 * @property {string} [hypothesis_template="This is a sound of {}."] The sentence used in conjunction with `candidate_labels`
 * to attempt the audio classification by replacing the placeholder with the candidate_labels.
 * Then likelihood is estimated by using `logits_per_audio`.
 * 
 * @callback ZeroShotAudioClassificationPipelineCallback Classify the sequence(s) given as inputs.
 * @param {AudioPipelineInputs} audio The input audio file(s) to be classified. The input is either:
 * - `string` or `URL` that is the filename/URL of the audio file, the file will be read at the processor's sampling rate
 * to get the waveform using the [`AudioContext`](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) API.
 * If `AudioContext` is not available, you should pass the raw waveform in as a Float32Array of shape `(n, )`.
 * - `Float32Array` or `Float64Array` of shape `(n, )`, representing the raw audio at the correct sampling rate (no further check will be done).
 * @param {string[]} candidate_labels The candidate labels for this audio.
 * @param {ZeroShotAudioClassificationPipelineOptions} [options] The options to use for zero-shot audio classification.
 * @returns {Promise<ZeroShotAudioClassificationOutput[]|ZeroShotAudioClassificationOutput[][]>} An array of objects containing the predicted labels and scores.
 * 
 * @typedef {TextAudioPipelineConstructorArgs & ZeroShotAudioClassificationPipelineCallback & Disposable} ZeroShotAudioClassificationPipelineType
 */

/**
 * Zero shot audio classification pipeline using `ClapModel`. This pipeline predicts the class of an audio when you
 * provide an audio and a set of `candidate_labels`.
 * 
 * **Example**: Perform zero-shot audio classification with `Xenova/clap-htsat-unfused`.
 * ```javascript
 * const classifier = await pipeline('zero-shot-audio-classification', 'Xenova/clap-htsat-unfused');
 * const audio = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/dog_barking.wav';
 * const candidate_labels = ['dog', 'vaccum cleaner'];
 * const scores = await classifier(audio, candidate_labels);
 * // [
 * //   { score: 0.9993992447853088, label: 'dog' },
 * //   { score: 0.0006007603369653225, label: 'vaccum cleaner' }
 * // ]
 * ```
 */
class ZeroShotAudioClassificationPipeline extends (/** @type {new (options: TextAudioPipelineConstructorArgs) => ZeroShotAudioClassificationPipelineType} */ (Pipeline)) {

    /**
     * Create a new ZeroShotAudioClassificationPipeline.
     * @param {TextAudioPipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {ZeroShotAudioClassificationPipelineCallback} */
    async _call(audio, candidate_labels, {
        hypothesis_template = "This is a sound of {}."
    } = {}) {

        const single = !Array.isArray(audio);
        if (single) {
            audio = [/** @type {AudioInput} */ (audio)];
        }

        // Insert label into hypothesis template 
        const texts = candidate_labels.map(
            x => hypothesis_template.replace('{}', x)
        );

        // Run tokenization
        const text_inputs = this.tokenizer(texts, {
            padding: true,
            truncation: true,
        });

        const sampling_rate = this.processor.feature_extractor.config.sampling_rate;
        const preparedAudios = await prepareAudios(audio, sampling_rate);

        const toReturn = [];
        for (const aud of preparedAudios) {
            const audio_inputs = await this.processor(aud);

            // Run model with both text and audio inputs
            const output = await this.model({ ...text_inputs, ...audio_inputs });

            // Compute softmax per audio
            const probs = (0,maths/* softmax */.XA)(output.logits_per_audio.data);

            toReturn.push([...probs].map((x, i) => ({
                score: x,
                label: candidate_labels[i]
            })));
        }
        return single ? toReturn[0] : toReturn;
    }
}

/**
 * @typedef {{stride: number[], input_features: Tensor, is_last: boolean, tokens?: number[], token_timestamps?: number[]}} ChunkCallbackItem
 * @callback ChunkCallback
 * @param {ChunkCallbackItem} chunk The chunk to process.
 */

/**
 * @typedef {Object} Chunk
 * @property {[number, number]} timestamp The start and end timestamp of the chunk in seconds.
 * @property {string} text The recognized text.
 */

/**
 * @typedef {Object} AutomaticSpeechRecognitionOutput
 * @property {string} text The recognized text.
 * @property {Chunk[]} [chunks] When using `return_timestamps`, the `chunks` will become a list
 * containing all the various text chunks identified by the model.
 * 
 * @typedef {Object} AutomaticSpeechRecognitionSpecificParams Parameters specific to automatic-speech-recognition pipelines.
 * @property {boolean|'word'} [kwargs.return_timestamps] Whether to return timestamps or not. Default is `false`.
 * @property {number} [kwargs.chunk_length_s] The length of audio chunks to process in seconds. Default is 0 (no chunking).
 * @property {number} [kwargs.stride_length_s] The length of overlap between consecutive audio chunks in seconds. If not provided, defaults to `chunk_length_s / 6`.
 * @property {ChunkCallback} [kwargs.chunk_callback] Callback function to be called with each chunk processed.
 * @property {boolean} [kwargs.force_full_sequences] Whether to force outputting full sequences or not. Default is `false`.
 * @property {string} [kwargs.language] The source language. Default is `null`, meaning it should be auto-detected. Use this to potentially improve performance if the source language is known.
 * @property {string} [kwargs.task] The task to perform. Default is `null`, meaning it should be auto-detected.
 * @property {number[][]} [kwargs.forced_decoder_ids] A list of pairs of integers which indicates a mapping from generation indices to token indices
 * that will be forced before sampling. For example, [[1, 123]] means the second generated token will always be a token of index 123.
 * @property {number} [num_frames] The number of frames in the input audio.
 * @typedef {import('./utils/generation.js').GenerationConfigType & AutomaticSpeechRecognitionSpecificParams} AutomaticSpeechRecognitionConfig
 * 
 * @callback AutomaticSpeechRecognitionPipelineCallback Transcribe the audio sequence(s) given as inputs to text.
 * @param {AudioPipelineInputs} audio The input audio file(s) to be transcribed. The input is either:
 * - `string` or `URL` that is the filename/URL of the audio file, the file will be read at the processor's sampling rate
 * to get the waveform using the [`AudioContext`](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) API.
 * If `AudioContext` is not available, you should pass the raw waveform in as a Float32Array of shape `(n, )`.
 * - `Float32Array` or `Float64Array` of shape `(n, )`, representing the raw audio at the correct sampling rate (no further check will be done).
 * @param {AutomaticSpeechRecognitionConfig} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<AutomaticSpeechRecognitionOutput|AutomaticSpeechRecognitionOutput[]>} An object containing the transcription text and optionally timestamps if `return_timestamps` is `true`.
 * 
 * @typedef {TextAudioPipelineConstructorArgs & AutomaticSpeechRecognitionPipelineCallback & Disposable} AutomaticSpeechRecognitionPipelineType
 */

/**
 * Pipeline that aims at extracting spoken text contained within some audio.
 *
 * **Example:** Transcribe English.
 * ```javascript
 * const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
 * const output = await transcriber(url);
 * // { text: " And so my fellow Americans ask not what your country can do for you, ask what you can do for your country." }
 * ```
 * 
 * **Example:** Transcribe English w/ timestamps.
 * ```javascript
 * const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
 * const output = await transcriber(url, { return_timestamps: true });
 * // {
 * //   text: " And so my fellow Americans ask not what your country can do for you, ask what you can do for your country."
 * //   chunks: [
 * //     { timestamp: [0, 8],  text: " And so my fellow Americans ask not what your country can do for you" }
 * //     { timestamp: [8, 11], text: " ask what you can do for your country." }
 * //   ]
 * // }
 * ```
 * 
 * **Example:** Transcribe English w/ word-level timestamps.
 * ```javascript
 * const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
 * const output = await transcriber(url, { return_timestamps: 'word' });
 * // {
 * //   "text": " And so my fellow Americans ask not what your country can do for you ask what you can do for your country.",
 * //   "chunks": [
 * //     { "text": " And", "timestamp": [0, 0.78] },
 * //     { "text": " so", "timestamp": [0.78, 1.06] },
 * //     { "text": " my", "timestamp": [1.06, 1.46] },
 * //     ...
 * //     { "text": " for", "timestamp": [9.72, 9.92] },
 * //     { "text": " your", "timestamp": [9.92, 10.22] },
 * //     { "text": " country.", "timestamp": [10.22, 13.5] }
 * //   ]
 * // }
 * ```
 * 
 * **Example:** Transcribe French.
 * ```javascript
 * const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/french-audio.mp3';
 * const output = await transcriber(url, { language: 'french', task: 'transcribe' });
 * // { text: " J'adore, j'aime, je n'aime pas, je déteste." }
 * ```
 * 
 * **Example:** Translate French to English.
 * ```javascript
 * const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/french-audio.mp3';
 * const output = await transcriber(url, { language: 'french', task: 'translate' });
 * // { text: " I love, I like, I don't like, I hate." }
 * ```
 * 
 * **Example:** Transcribe/translate audio longer than 30 seconds.
 * ```javascript
 * const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/ted_60.wav';
 * const output = await transcriber(url, { chunk_length_s: 30, stride_length_s: 5 });
 * // { text: " So in college, I was a government major, which means [...] So I'd start off light and I'd bump it up" }
 * ```
 */
class AutomaticSpeechRecognitionPipeline extends (/** @type {new (options: TextAudioPipelineConstructorArgs) => AutomaticSpeechRecognitionPipelineType} */ (Pipeline)) {

    /**
     * Create a new AutomaticSpeechRecognitionPipeline.
     * @param {TextAudioPipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {AutomaticSpeechRecognitionPipelineCallback} */
    async _call(audio, kwargs = {}) {
        switch (this.model.config.model_type) {
            case 'whisper':
                return this._call_whisper(audio, kwargs)
            case 'wav2vec2':
            case 'wav2vec2-bert':
            case 'unispeech':
            case 'unispeech-sat':
            case 'hubert':
                return this._call_wav2vec2(audio, kwargs)
            default:
                throw new Error(`AutomaticSpeechRecognitionPipeline does not support model type '${this.model.config.model_type}'.`)
        }
    }

    /**
     * @type {AutomaticSpeechRecognitionPipelineCallback}
     * @private
     */
    async _call_wav2vec2(audio, kwargs = {}) {
        // TODO use kwargs

        if (kwargs.language) {
            console.warn('`language` parameter is not yet supported for `wav2vec2` models, defaulting to "English".');
        }
        if (kwargs.task) {
            console.warn('`task` parameter is not yet supported for `wav2vec2` models, defaulting to "transcribe".');
        }

        const single = !Array.isArray(audio);
        if (single) {
            audio = [/** @type {AudioInput} */ (audio)];
        }

        const sampling_rate = this.processor.feature_extractor.config.sampling_rate;
        const preparedAudios = await prepareAudios(audio, sampling_rate);

        const toReturn = [];
        for (const aud of preparedAudios) {
            const inputs = await this.processor(aud);
            const output = await this.model(inputs);
            const logits = output.logits[0];

            const predicted_ids = [];
            for (const item of logits) {
                predicted_ids.push((0,maths/* max */.Fp)(item.data)[1])
            }
            const predicted_sentences = this.tokenizer.decode(predicted_ids)
            toReturn.push({ text: predicted_sentences })
        }
        return single ? toReturn[0] : toReturn;
    }

    /**
     * @type {AutomaticSpeechRecognitionPipelineCallback}
     * @private
     */
    async _call_whisper(audio, kwargs = {}) {

        const return_timestamps = kwargs.return_timestamps ?? false;
        const chunk_length_s = kwargs.chunk_length_s ?? 0;
        const chunk_callback = kwargs.chunk_callback ?? null;
        const force_full_sequences = kwargs.force_full_sequences ?? false;
        let stride_length_s = kwargs.stride_length_s ?? null;

        if (return_timestamps === 'word') {
            kwargs['return_token_timestamps'] = true;
        }

        const language = (0,core/* pop */.Sw)(kwargs, 'language', null);
        const task = (0,core/* pop */.Sw)(kwargs, 'task', null);

        if (language || task || return_timestamps) {
            if (kwargs.forced_decoder_ids) {
                throw new Error("Cannot specify `language`/`task`/`return_timestamps` and `forced_decoder_ids` at the same time.")
            }
            // @ts-ignore
            const decoder_prompt_ids = this.tokenizer.get_decoder_prompt_ids({ language, task, no_timestamps: !return_timestamps })
            if (decoder_prompt_ids.length > 0) {
                kwargs.forced_decoder_ids = decoder_prompt_ids;
            }
        }

        const single = !Array.isArray(audio);
        if (single) {
            audio = [/** @type {AudioInput} */ (audio)];
        }

        const time_precision = this.processor.feature_extractor.config.chunk_length / this.model.config.max_source_positions;
        const hop_length = this.processor.feature_extractor.config.hop_length;

        const sampling_rate = this.processor.feature_extractor.config.sampling_rate;
        const preparedAudios = await prepareAudios(audio, sampling_rate);

        const toReturn = [];
        for (const aud of preparedAudios) {
            /** @type {ChunkCallbackItem[]} */
            let chunks = [];
            if (chunk_length_s > 0) {
                if (stride_length_s === null) {
                    stride_length_s = chunk_length_s / 6;
                } else if (chunk_length_s <= stride_length_s) {
                    throw Error("`chunk_length_s` must be larger than `stride_length_s`.")
                }

                // TODO support different stride_length_s (for left and right)

                const window = sampling_rate * chunk_length_s;
                const stride = sampling_rate * stride_length_s;
                const jump = window - 2 * stride;
                let offset = 0;

                // Create subarrays of audio with overlaps

                while (offset < aud.length) {
                    const subarr = aud.subarray(offset, offset + window);
                    const feature = await this.processor(subarr);

                    const isFirst = offset === 0;
                    const isLast = offset + jump >= aud.length;
                    chunks.push({
                        stride: [
                            subarr.length,
                            isFirst ? 0 : stride,
                            isLast ? 0 : stride
                        ],
                        input_features: feature.input_features,
                        is_last: isLast
                    })
                    offset += jump;
                }

            } else {
                chunks = [{
                    stride: [aud.length, 0, 0],
                    input_features: (await this.processor(aud)).input_features,
                    is_last: true
                }]
            }

            // Generate for each set of input features
            for (const chunk of chunks) {
                kwargs.num_frames = Math.floor(chunk.stride[0] / hop_length);

                // NOTE: doing sequentially for now
                const data = await this.model.generate(chunk.input_features, kwargs);

                // TODO: Right now we only get top beam
                if (return_timestamps === 'word') {
                    chunk.tokens = data.sequences[0];
                    chunk.token_timestamps = data.token_timestamps.tolist()[0].map(
                        (/** @type {number} */ x) => (0,maths/* round */.NM)(x, 2)
                    );

                } else {
                    chunk.tokens = data[0];
                }

                // convert stride to seconds
                chunk.stride = chunk.stride.map(x => x / sampling_rate);

                if (chunk_callback !== null) {
                    chunk_callback(chunk)
                }
            }

            // Merge text chunks
            // @ts-ignore
            const [full_text, optional] = this.tokenizer._decode_asr(chunks, {
                time_precision, return_timestamps, force_full_sequences
            });

            toReturn.push({ text: full_text, ...optional })
        }
        return single ? toReturn[0] : toReturn;
    }
}

/**
 * @typedef {Object} ImageToTextSingle
 * @property {string} generated_text The generated text.
 * @typedef {ImageToTextSingle[]} ImageToTextOutput
 * 
 * @callback ImageToTextPipelineCallback Assign labels to the image(s) passed as inputs.
 * @param {ImagePipelineInputs} texts The images to be captioned.
 * @param {import('./utils/generation.js').GenerationConfigType} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<ImageToTextOutput|ImageToTextOutput[]>} An object (or array of objects) containing the generated text(s).
 * 
 * @typedef {TextImagePipelineConstructorArgs & ImageToTextPipelineCallback & Disposable} ImageToTextPipelineType
 */

/**
 * Image To Text pipeline using a `AutoModelForVision2Seq`. This pipeline predicts a caption for a given image.
 * 
 * **Example:** Generate a caption for an image w/ `Xenova/vit-gpt2-image-captioning`.
 * ```javascript
 * const captioner = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/cats.jpg';
 * const output = await captioner(url);
 * // [{ generated_text: 'a cat laying on a couch with another cat' }]
 * ```
 * 
 * **Example:** Optical Character Recognition (OCR) w/ `Xenova/trocr-small-handwritten`.
 * ```javascript
 * const captioner = await pipeline('image-to-text', 'Xenova/trocr-small-handwritten');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/handwriting.jpg';
 * const output = await captioner(url);
 * // [{ generated_text: 'Mr. Brown commented icily.' }]
 * ```
 */
class ImageToTextPipeline extends (/** @type {new (options: TextImagePipelineConstructorArgs) => ImageToTextPipelineType} */ (Pipeline)) {

    /**
     * Create a new ImageToTextPipeline.
     * @param {TextImagePipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {ImageToTextPipelineCallback} */
    async _call(images, generate_kwargs = {}) {

        const isBatched = Array.isArray(images);
        const preparedImages = await prepareImages(images);

        const { pixel_values } = await this.processor(preparedImages);

        const toReturn = [];
        for (const batch of pixel_values) {
            batch.dims = [1, ...batch.dims]
            const output = await this.model.generate(batch, generate_kwargs);
            const decoded = this.tokenizer.batch_decode(output, {
                skip_special_tokens: true,
            }).map(x => ({ generated_text: x.trim() }))
            toReturn.push(decoded);
        }

        return isBatched ? toReturn : toReturn[0];
    }
}

/**
 * @typedef {Object} ImageClassificationSingle
 * @property {string} label The label identified by the model.
 * @property {number} score The score attributed by the model for that label.
 * @typedef {ImageClassificationSingle[]} ImageClassificationOutput
 * 
 * @typedef {Object} ImageClassificationPipelineOptions Parameters specific to image classification pipelines.
 * @property {number} [topk=1] The number of top labels that will be returned by the pipeline. 
 * 
 * @callback ImageClassificationPipelineCallback Assign labels to the image(s) passed as inputs.
 * @param {ImagePipelineInputs} images The input images(s) to be classified.
 * @param {ImageClassificationPipelineOptions} [options] The options to use for image classification.
 * @returns {Promise<ImageClassificationOutput|ImageClassificationOutput[]>} An array or object containing the predicted labels and scores.
 * 
 * @typedef {ImagePipelineConstructorArgs & ImageClassificationPipelineCallback & Disposable} ImageClassificationPipelineType
 */

/**
 * Image classification pipeline using any `AutoModelForImageClassification`.
 * This pipeline predicts the class of an image.
 * 
 * **Example:** Classify an image.
 * ```javascript
 * const classifier = await pipeline('image-classification', 'Xenova/vit-base-patch16-224');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/tiger.jpg';
 * const output = await classifier(url);
 * // [
 * //   { label: 'tiger, Panthera tigris', score: 0.632695734500885 },
 * // ]
 * ```
 * 
 * **Example:** Classify an image and return top `n` classes.
 * ```javascript
 * const classifier = await pipeline('image-classification', 'Xenova/vit-base-patch16-224');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/tiger.jpg';
 * const output = await classifier(url, { topk: 3 });
 * // [
 * //   { label: 'tiger, Panthera tigris', score: 0.632695734500885 },
 * //   { label: 'tiger cat', score: 0.3634825646877289 },
 * //   { label: 'lion, king of beasts, Panthera leo', score: 0.00045060308184474707 },
 * // ]
 * ```
 * 
 * **Example:** Classify an image and return all classes.
 * ```javascript
 * const classifier = await pipeline('image-classification', 'Xenova/vit-base-patch16-224');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/tiger.jpg';
 * const output = await classifier(url, { topk: 0 });
 * // [
 * //   { label: 'tiger, Panthera tigris', score: 0.632695734500885 },
 * //   { label: 'tiger cat', score: 0.3634825646877289 },
 * //   { label: 'lion, king of beasts, Panthera leo', score: 0.00045060308184474707 },
 * //   { label: 'jaguar, panther, Panthera onca, Felis onca', score: 0.00035465499968267977 },
 * //   ...
 * // ]
 * ```
 */
class ImageClassificationPipeline extends (/** @type {new (options: ImagePipelineConstructorArgs) => ImageClassificationPipelineType} */ (Pipeline)) {

    /**
     * Create a new ImageClassificationPipeline.
     * @param {ImagePipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {ImageClassificationPipelineCallback} */
    async _call(images, {
        topk = 1
    } = {}) {

        const isBatched = Array.isArray(images);
        const preparedImages = await prepareImages(images);

        const { pixel_values } = await this.processor(preparedImages);
        const output = await this.model({ pixel_values });

        const id2label = this.model.config.id2label;
        const toReturn = [];
        for (const batch of output.logits) {
            const scores = (0,maths/* getTopItems */.em)((0,maths/* softmax */.XA)(batch.data), topk);

            const vals = scores.map(x => ({
                label: id2label[x[0]],
                score: x[1],
            }));
            if (topk === 1) {
                toReturn.push(...vals);
            } else {
                toReturn.push(vals);
            }
        }

        return isBatched || topk === 1 ? /** @type {ImageClassificationOutput} */ (toReturn) : /** @type {ImageClassificationOutput[]} */ (toReturn)[0];
    }

}

/**
 * @typedef {Object} ImageSegmentationPipelineOutput
 * @property {string} label The label of the segment.
 * @property {number|null} score The score of the segment.
 * @property {RawImage} mask The mask of the segment.
 * 
 * @typedef {Object} ImageSegmentationPipelineOptions Parameters specific to image segmentation pipelines.
 * @property {number} [threshold=0.5] Probability threshold to filter out predicted masks.
 * @property {number} [mask_threshold=0.5] Threshold to use when turning the predicted masks into binary values.
 * @property {number} [overlap_mask_area_threshold=0.8] Mask overlap threshold to eliminate small, disconnected segments.
 * @property {null|string} [subtask=null] Segmentation task to be performed. One of [`panoptic`, `instance`, and `semantic`],
 * depending on model capabilities. If not set, the pipeline will attempt to resolve (in that order).
 * @property {number[]} [label_ids_to_fuse=null] List of label ids to fuse. If not set, do not fuse any labels.
 * @property {number[][]} [target_sizes=null] List of target sizes for the input images. If not set, use the original image sizes.
 * 
 * @callback ImageSegmentationPipelineCallback Segment the input images.
 * @param {ImagePipelineInputs} images The input images.
 * @param {ImageSegmentationPipelineOptions} [options] The options to use for image segmentation.
 * @returns {Promise<ImageSegmentationPipelineOutput[]>} The annotated segments.
 * 
 * @typedef {ImagePipelineConstructorArgs & ImageSegmentationPipelineCallback & Disposable} ImageSegmentationPipelineType
 */

/**
 * Image segmentation pipeline using any `AutoModelForXXXSegmentation`.
 * This pipeline predicts masks of objects and their classes.
 * 
 * **Example:** Perform image segmentation with `Xenova/detr-resnet-50-panoptic`.
 * ```javascript
 * const segmenter = await pipeline('image-segmentation', 'Xenova/detr-resnet-50-panoptic');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/cats.jpg';
 * const output = await segmenter(url);
 * // [
 * //   { label: 'remote', score: 0.9984649419784546, mask: RawImage { ... } },
 * //   { label: 'cat', score: 0.9994316101074219, mask: RawImage { ... } }
 * // ]
 * ```
 */
class ImageSegmentationPipeline extends (/** @type {new (options: ImagePipelineConstructorArgs) => ImageSegmentationPipelineType} */ (Pipeline)) {
    /**
     * Create a new ImageSegmentationPipeline.
     * @param {ImagePipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);

        this.subtasks_mapping = {
            // Mapping of subtasks to their corresponding post-processing function names.
            panoptic: 'post_process_panoptic_segmentation',
            instance: 'post_process_instance_segmentation',
            semantic: 'post_process_semantic_segmentation'
        }
    }

    /** @type {ImageSegmentationPipelineCallback} */
    async _call(images, {
        threshold = 0.5,
        mask_threshold = 0.5,
        overlap_mask_area_threshold = 0.8,
        label_ids_to_fuse = null,
        target_sizes = null,
        subtask = null,
    } = {}) {
        const isBatched = Array.isArray(images);

        if (isBatched && images.length !== 1) {
            throw Error("Image segmentation pipeline currently only supports a batch size of 1.");
        }

        const preparedImages = await prepareImages(images);
        const imageSizes = preparedImages.map(x => [x.height, x.width]);

        const { pixel_values, pixel_mask } = await this.processor(preparedImages);
        const output = await this.model({ pixel_values, pixel_mask });

        let fn = null;
        if (subtask !== null) {
            fn = this.subtasks_mapping[subtask];
        } else {
            for (let [task, func] of Object.entries(this.subtasks_mapping)) {
                if (func in this.processor.feature_extractor) {
                    fn = this.processor.feature_extractor[func].bind(this.processor.feature_extractor);
                    subtask = task;
                    break;
                }
            }
        }

        const id2label = this.model.config.id2label;

        /** @type {ImageSegmentationPipelineOutput[]} */
        const annotation = [];
        if (subtask === 'panoptic' || subtask === 'instance') {
            const processed = fn(
                output,
                threshold,
                mask_threshold,
                overlap_mask_area_threshold,
                label_ids_to_fuse,
                target_sizes ?? imageSizes, // TODO FIX?
            )[0];

            const segmentation = processed.segmentation;

            for (const segment of processed.segments_info) {
                const maskData = new Uint8ClampedArray(segmentation.data.length);
                for (let i = 0; i < segmentation.data.length; ++i) {
                    if (segmentation.data[i] === segment.id) {
                        maskData[i] = 255;
                    }
                }

                const mask = new RawImage(maskData, segmentation.dims[1], segmentation.dims[0], 1)

                annotation.push({
                    score: segment.score,
                    label: id2label[segment.label_id],
                    mask: mask
                })
            }

        } else if (subtask === 'semantic') {
            const { segmentation, labels } = fn(output, target_sizes ?? imageSizes)[0];

            for (const label of labels) {
                const maskData = new Uint8ClampedArray(segmentation.data.length);
                for (let i = 0; i < segmentation.data.length; ++i) {
                    if (segmentation.data[i] === label) {
                        maskData[i] = 255;
                    }
                }

                const mask = new RawImage(maskData, segmentation.dims[1], segmentation.dims[0], 1);

                annotation.push({
                    score: null,
                    label: id2label[label],
                    mask: mask
                });
            }
        } else {
            throw Error(`Subtask ${subtask} not supported.`);
        }

        return annotation;
    }
}

/**
 * @typedef {Object} ZeroShotImageClassificationOutput
 * @property {string} label The label identified by the model. It is one of the suggested `candidate_label`.
 * @property {number} score The score attributed by the model for that label (between 0 and 1).
 * 
 * @typedef {Object} ZeroShotImageClassificationPipelineOptions Parameters specific to zero-shot image classification pipelines.
 * @property {string} [hypothesis_template="This is a photo of {}"] The sentence used in conjunction with `candidate_labels`
 * to attempt the image classification by replacing the placeholder with the candidate_labels.
 * Then likelihood is estimated by using `logits_per_image`.
 * 
 * @callback ZeroShotImageClassificationPipelineCallback Assign labels to the image(s) passed as inputs.
 * @param {ImagePipelineInputs} images The input images.
 * @param {string[]} candidate_labels The candidate labels for this image.
 * @param {ZeroShotImageClassificationPipelineOptions} [options] The options to use for zero-shot image classification.
 * @returns {Promise<ZeroShotImageClassificationOutput[]|ZeroShotImageClassificationOutput[][]>} An array of objects containing the predicted labels and scores.
 * 
 * @typedef {TextImagePipelineConstructorArgs & ZeroShotImageClassificationPipelineCallback & Disposable} ZeroShotImageClassificationPipelineType
 */

/**
 * Zero shot image classification pipeline. This pipeline predicts the class of
 * an image when you provide an image and a set of `candidate_labels`.
 * 
 * **Example:** Zero shot image classification w/ `Xenova/clip-vit-base-patch32`.
 * ```javascript
 * const classifier = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-base-patch32');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/tiger.jpg';
 * const output = await classifier(url, ['tiger', 'horse', 'dog']);
 * // [
 * //   { score: 0.9993917942047119, label: 'tiger' },
 * //   { score: 0.0003519294841680676, label: 'horse' },
 * //   { score: 0.0002562698791734874, label: 'dog' }
 * // ]
 * ```
 */
class ZeroShotImageClassificationPipeline extends (/** @type {new (options: TextImagePipelineConstructorArgs) => ZeroShotImageClassificationPipelineType} */ (Pipeline)) {
    /**
     * Create a new ZeroShotImageClassificationPipeline.
     * @param {TextImagePipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {ZeroShotImageClassificationPipelineCallback} */
    async _call(images, candidate_labels, {
        hypothesis_template = "This is a photo of {}"
    } = {}) {

        const isBatched = Array.isArray(images);
        const preparedImages = await prepareImages(images);

        // Insert label into hypothesis template 
        const texts = candidate_labels.map(
            x => hypothesis_template.replace('{}', x)
        );

        // Run tokenization
        const text_inputs = this.tokenizer(texts, {
            padding: this.model.config.model_type === 'siglip' ? 'max_length' : true,
            truncation: true,
        });

        // Run processor
        const { pixel_values } = await this.processor(preparedImages);

        // Run model with both text and pixel inputs
        const output = await this.model({ ...text_inputs, pixel_values });

        const function_to_apply =
            this.model.config.model_type === 'siglip'
                ? batch => batch.sigmoid().data
                : batch => (0,maths/* softmax */.XA)(batch.data);

        // Compare each image with each candidate label
        const toReturn = [];
        for (const batch of output.logits_per_image) {
            // Compute softmax per image
            const probs = function_to_apply(batch);

            const result = [...probs].map((x, i) => ({
                score: x,
                label: candidate_labels[i]
            }));
            result.sort((a, b) => b.score - a.score); // sort by score in descending order
            toReturn.push(result);
        }

        return isBatched ? toReturn : toReturn[0];
    }
}


/**
 * @typedef {Object} ObjectDetectionPipelineSingle
 * @property {string} label The class label identified by the model.
 * @property {number} score The score attributed by the model for that label.
 * @property {BoundingBox} box The bounding box of detected object in image's original size, or as a percentage if `percentage` is set to true.
 * @typedef {ObjectDetectionPipelineSingle[]} ObjectDetectionPipelineOutput
 * 
 * @typedef {Object} ObjectDetectionPipelineOptions Parameters specific to object detection pipelines.
 * @property {number} [threshold=0.9] The threshold used to filter boxes by score.
 * @property {boolean} [percentage=false] Whether to return the boxes coordinates in percentage (true) or in pixels (false).
 * 
 * @callback ObjectDetectionPipelineCallback Detect objects (bounding boxes & classes) in the image(s) passed as inputs.
 * @param {ImagePipelineInputs} images The input images.
 * @param {ObjectDetectionPipelineOptions} [options] The options to use for object detection.
 * @returns {Promise<ObjectDetectionPipelineOutput|ObjectDetectionPipelineOutput[]>} A list of objects or a list of list of objects. 
 * 
 * @typedef {ImagePipelineConstructorArgs & ObjectDetectionPipelineCallback & Disposable} ObjectDetectionPipelineType
 */

/**
 * Object detection pipeline using any `AutoModelForObjectDetection`.
 * This pipeline predicts bounding boxes of objects and their classes.
 * 
 * **Example:** Run object-detection with `Xenova/detr-resnet-50`.
 * ```javascript
 * const detector = await pipeline('object-detection', 'Xenova/detr-resnet-50');
 * const img = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/cats.jpg';
 * const output = await detector(img, { threshold: 0.9 });
 * // [{
 * //   score: 0.9976370930671692,
 * //   label: "remote",
 * //   box: { xmin: 31, ymin: 68, xmax: 190, ymax: 118 }
 * // },
 * // ...
 * // {
 * //   score: 0.9984092116355896,
 * //   label: "cat",
 * //   box: { xmin: 331, ymin: 19, xmax: 649, ymax: 371 }
 * // }]
 * ```
 */
class ObjectDetectionPipeline extends (/** @type {new (options: ImagePipelineConstructorArgs) => ObjectDetectionPipelineType} */ (Pipeline)) {

    /**
     * Create a new ObjectDetectionPipeline.
     * @param {ImagePipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {ObjectDetectionPipelineCallback} */
    async _call(images, {
        threshold = 0.9,
        percentage = false,
    } = {}) {

        const isBatched = Array.isArray(images);

        if (isBatched && images.length !== 1) {
            throw Error("Object detection pipeline currently only supports a batch size of 1.");
        }
        const preparedImages = await prepareImages(images);

        const imageSizes = percentage ? null : preparedImages.map(x => [x.height, x.width]);

        const { pixel_values, pixel_mask } = await this.processor(preparedImages);
        const output = await this.model({ pixel_values, pixel_mask });

        // @ts-ignore
        const processed = this.processor.feature_extractor.post_process_object_detection(output, threshold, imageSizes);

        // Add labels
        const id2label = this.model.config.id2label;

        // Format output
        /** @type {ObjectDetectionPipelineOutput[]} */
        const result = processed.map(batch => (
            batch.boxes.map((box, i) => ({
                score: batch.scores[i],
                label: id2label[batch.classes[i]],
                box: get_bounding_box(box, !percentage),
            }))
        ))

        return isBatched ? result : result[0];
    }
}


/**
 * @typedef {Object} ZeroShotObjectDetectionOutput
 * @property {string} label Text query corresponding to the found object.
 * @property {number} score Score corresponding to the object (between 0 and 1).
 * @property {BoundingBox} box Bounding box of the detected object in image's original size, or as a percentage if `percentage` is set to true.
 * 
 * @typedef {Object} ZeroShotObjectDetectionPipelineOptions Parameters specific to zero-shot object detection pipelines.
 * @property {number} [threshold=0.1] The probability necessary to make a prediction.
 * @property {number} [topk=null] The number of top predictions that will be returned by the pipeline.
 * If the provided number is `null` or higher than the number of predictions available, it will default
 * to the number of predictions.
 * @property {boolean} [percentage=false] Whether to return the boxes coordinates in percentage (true) or in pixels (false).
 * 
 * @callback ZeroShotObjectDetectionPipelineCallback Detect objects (bounding boxes & classes) in the image(s) passed as inputs.
 * @param {ImagePipelineInputs} images The input images.
 * @param {string[]} candidate_labels What the model should recognize in the image.
 * @param {ZeroShotObjectDetectionPipelineOptions} [options] The options to use for zero-shot object detection.
 * @returns {Promise<ZeroShotObjectDetectionOutput[]|ZeroShotObjectDetectionOutput[][]>} An array of objects containing the predicted labels, scores, and bounding boxes.
 * 
 * @typedef {TextImagePipelineConstructorArgs & ZeroShotObjectDetectionPipelineCallback & Disposable} ZeroShotObjectDetectionPipelineType
 */

/**
 * Zero-shot object detection pipeline. This pipeline predicts bounding boxes of
 * objects when you provide an image and a set of `candidate_labels`.
 * 
 * **Example:** Zero-shot object detection w/ `Xenova/owlvit-base-patch32`.
 * ```javascript
 * const detector = await pipeline('zero-shot-object-detection', 'Xenova/owlvit-base-patch32');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/astronaut.png';
 * const candidate_labels = ['human face', 'rocket', 'helmet', 'american flag'];
 * const output = await detector(url, candidate_labels);
 * // [
 * //   {
 * //     score: 0.24392342567443848,
 * //     label: 'human face',
 * //     box: { xmin: 180, ymin: 67, xmax: 274, ymax: 175 }
 * //   },
 * //   {
 * //     score: 0.15129457414150238,
 * //     label: 'american flag',
 * //     box: { xmin: 0, ymin: 4, xmax: 106, ymax: 513 }
 * //   },
 * //   {
 * //     score: 0.13649864494800568,
 * //     label: 'helmet',
 * //     box: { xmin: 277, ymin: 337, xmax: 511, ymax: 511 }
 * //   },
 * //   {
 * //     score: 0.10262022167444229,
 * //     label: 'rocket',
 * //     box: { xmin: 352, ymin: -1, xmax: 463, ymax: 287 }
 * //   }
 * // ]
 * ```
 * 
 * **Example:** Zero-shot object detection w/ `Xenova/owlvit-base-patch32` (returning top 4 matches and setting a threshold).
 * ```javascript
 * const detector = await pipeline('zero-shot-object-detection', 'Xenova/owlvit-base-patch32');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/beach.png';
 * const candidate_labels = ['hat', 'book', 'sunglasses', 'camera'];
 * const output = await detector(url, candidate_labels, { topk: 4, threshold: 0.05 });
 * // [
 * //   {
 * //     score: 0.1606510728597641,
 * //     label: 'sunglasses',
 * //     box: { xmin: 347, ymin: 229, xmax: 429, ymax: 264 }
 * //   },
 * //   {
 * //     score: 0.08935828506946564,
 * //     label: 'hat',
 * //     box: { xmin: 38, ymin: 174, xmax: 258, ymax: 364 }
 * //   },
 * //   {
 * //     score: 0.08530698716640472,
 * //     label: 'camera',
 * //     box: { xmin: 187, ymin: 350, xmax: 260, ymax: 411 }
 * //   },
 * //   {
 * //     score: 0.08349756896495819,
 * //     label: 'book',
 * //     box: { xmin: 261, ymin: 280, xmax: 494, ymax: 425 }
 * //   }
 * // ]
 * ```
 */
class ZeroShotObjectDetectionPipeline extends (/** @type {new (options: TextImagePipelineConstructorArgs) => ZeroShotObjectDetectionPipelineType} */ (Pipeline)) {

    /**
     * Create a new ZeroShotObjectDetectionPipeline.
     * @param {TextImagePipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {ZeroShotObjectDetectionPipelineCallback} */
    async _call(images, candidate_labels, {
        threshold = 0.1,
        topk = null,
        percentage = false,
    } = {}) {

        const isBatched = Array.isArray(images);
        const preparedImages = await prepareImages(images);

        // Run tokenization
        const text_inputs = this.tokenizer(candidate_labels, {
            padding: true,
            truncation: true,
        });

        // Run processor
        const model_inputs = await this.processor(preparedImages);

        // Since non-maximum suppression is performed for exporting, we need to
        // process each image separately. For more information, see:
        // https://github.com/huggingface/optimum/blob/e3b7efb1257c011db907ef40ab340e795cc5684c/optimum/exporters/onnx/model_configs.py#L1028-L1032
        const toReturn = [];
        for (let i = 0; i < preparedImages.length; ++i) {
            const image = preparedImages[i];
            const imageSize = percentage ? null : [[image.height, image.width]];
            const pixel_values = model_inputs.pixel_values[i].unsqueeze_(0);

            // Run model with both text and pixel inputs
            const output = await this.model({ ...text_inputs, pixel_values });

            // @ts-ignore
            const processed = this.processor.feature_extractor.post_process_object_detection(output, threshold, imageSize, true)[0];
            let result = processed.boxes.map((box, i) => ({
                score: processed.scores[i],
                label: candidate_labels[processed.classes[i]],
                box: get_bounding_box(box, !percentage),
            })).sort((a, b) => b.score - a.score);
            if (topk !== null) {
                result = result.slice(0, topk);
            }
            toReturn.push(result)
        }

        return isBatched ? toReturn : toReturn[0];
    }
}

/**
 * @typedef {Object} DocumentQuestionAnsweringSingle
 * @property {string} answer The generated text.
 * @typedef {DocumentQuestionAnsweringSingle[]} DocumentQuestionAnsweringOutput
 * 
 * @callback DocumentQuestionAnsweringPipelineCallback Answer the question given as input by using the document.
 * @param {ImageInput} image The image of the document to use.
 * @param {string} question A question to ask of the document.
 * @param {import('./utils/generation.js').GenerationConfigType} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<DocumentQuestionAnsweringOutput|DocumentQuestionAnsweringOutput[]>} An object (or array of objects) containing the answer(s).
 * 
 * @typedef {TextImagePipelineConstructorArgs & DocumentQuestionAnsweringPipelineCallback & Disposable} DocumentQuestionAnsweringPipelineType
 */

/**
 * Document Question Answering pipeline using any `AutoModelForDocumentQuestionAnswering`.
 * The inputs/outputs are similar to the (extractive) question answering pipeline; however,
 * the pipeline takes an image (and optional OCR'd words/boxes) as input instead of text context.
 * 
 * **Example:** Answer questions about a document with `Xenova/donut-base-finetuned-docvqa`.
 * ```javascript
 * const qa_pipeline = await pipeline('document-question-answering', 'Xenova/donut-base-finetuned-docvqa');
 * const image = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/invoice.png';
 * const question = 'What is the invoice number?';
 * const output = await qa_pipeline(image, question);
 * // [{ answer: 'us-001' }]
 * ```
 */
class DocumentQuestionAnsweringPipeline extends (/** @type {new (options: TextImagePipelineConstructorArgs) => DocumentQuestionAnsweringPipelineType} */ (Pipeline)) {

    /**
     * Create a new DocumentQuestionAnsweringPipeline.
     * @param {TextImagePipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {DocumentQuestionAnsweringPipelineCallback} */
    async _call(image, question, generate_kwargs = {}) {

        // NOTE: For now, we only support a batch size of 1

        // Preprocess image
        const preparedImage = (await prepareImages(image))[0];
        const { pixel_values } = await this.processor(preparedImage);

        // Run tokenization
        const task_prompt = `<s_docvqa><s_question>${question}</s_question><s_answer>`;
        const decoder_input_ids = this.tokenizer(task_prompt, {
            add_special_tokens: false,
            padding: true,
            truncation: true,
        }).input_ids;

        // Run model
        const output = await this.model.generate(
            pixel_values,
            {
                ...generate_kwargs,
                decoder_input_ids,
                max_length: this.model.config.decoder.max_position_embeddings,
            }
        );

        // Decode output
        const decoded = this.tokenizer.batch_decode(output)[0];

        // Parse answer
        const match = decoded.match(/<s_answer>(.*?)<\/s_answer>/);
        let answer = null;
        if (match && match.length >= 2) {
            answer = match[1].trim();
        }
        return [{ answer }];
    }
}


/**
 * @typedef {Object} VocoderOptions
 * @property {PreTrainedModel} [vocoder] The vocoder used by the pipeline (if the model uses one). If not provided, use the default HifiGan vocoder.
 * @typedef {TextAudioPipelineConstructorArgs & VocoderOptions} TextToAudioPipelineConstructorArgs
 */

/**
 * @typedef {Object} TextToAudioOutput
 * @property {Float32Array} audio The generated audio waveform.
 * @property {number} sampling_rate The sampling rate of the generated audio waveform.
 * 
 * @typedef {Object} TextToAudioPipelineOptions Parameters specific to text-to-audio pipelines.
 * @property {Tensor|Float32Array|string|URL} [speaker_embeddings=null] The speaker embeddings (if the model requires it).
 * 
 * @callback TextToAudioPipelineCallback Generates speech/audio from the inputs.
 * @param {string|string[]} texts The text(s) to generate.
 * @param {TextToAudioPipelineOptions} options Parameters passed to the model generation/forward method.
 * @returns {Promise<TextToAudioOutput>} An object containing the generated audio and sampling rate.
 * 
 * @typedef {TextToAudioPipelineConstructorArgs & TextToAudioPipelineCallback & Disposable} TextToAudioPipelineType
 */

/**
 * Text-to-audio generation pipeline using any `AutoModelForTextToWaveform` or `AutoModelForTextToSpectrogram`.
 * This pipeline generates an audio file from an input text and optional other conditional inputs.
 * 
 * **Example:** Generate audio from text with `Xenova/speecht5_tts`.
 * ```javascript
 * const synthesizer = await pipeline('text-to-speech', 'Xenova/speecht5_tts', { quantized: false });
 * const speaker_embeddings = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin';
 * const out = await synthesizer('Hello, my dog is cute', { speaker_embeddings });
 * // {
 * //   audio: Float32Array(26112) [-0.00005657337896991521, 0.00020583874720614403, ...],
 * //   sampling_rate: 16000
 * // }
 * ```
 * 
 * You can then save the audio to a .wav file with the `wavefile` package:
 * ```javascript
 * import wavefile from 'wavefile';
 * import fs from 'fs';
 * 
 * const wav = new wavefile.WaveFile();
 * wav.fromScratch(1, out.sampling_rate, '32f', out.audio);
 * fs.writeFileSync('out.wav', wav.toBuffer());
 * ```
 * 
 * **Example:** Multilingual speech generation with `Xenova/mms-tts-fra`. See [here](https://huggingface.co/models?pipeline_tag=text-to-speech&other=vits&sort=trending) for the full list of available languages (1107).
 * ```javascript
 * const synthesizer = await pipeline('text-to-speech', 'Xenova/mms-tts-fra');
 * const out = await synthesizer('Bonjour');
 * // {
 * //   audio: Float32Array(23808) [-0.00037693005288019776, 0.0003325853613205254, ...],
 * //   sampling_rate: 16000
 * // }
 * ```
 */
class TextToAudioPipeline extends (/** @type {new (options: TextToAudioPipelineConstructorArgs) => TextToAudioPipelineType} */ (Pipeline)) {
    DEFAULT_VOCODER_ID = "Xenova/speecht5_hifigan"

    /**
     * Create a new TextToAudioPipeline.
     * @param {TextToAudioPipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);

        // TODO: Find a better way for `pipeline` to set the default vocoder
        this.vocoder = options.vocoder ?? null;
    }


    /** @type {TextToAudioPipelineCallback} */
    async _call(text_inputs, {
        speaker_embeddings = null,
    } = {}) {

        // If this.processor is not set, we are using a `AutoModelForTextToWaveform` model
        if (this.processor) {
            return this._call_text_to_spectrogram(text_inputs, { speaker_embeddings });
        } else {
            return this._call_text_to_waveform(text_inputs);
        }
    }

    async _call_text_to_waveform(text_inputs) {

        // Run tokenization
        const inputs = this.tokenizer(text_inputs, {
            padding: true,
            truncation: true,
        });

        // Generate waveform
        const { waveform } = await this.model(inputs);

        const sampling_rate = this.model.config.sampling_rate;
        return {
            audio: waveform.data,
            sampling_rate,
        }
    }

    async _call_text_to_spectrogram(text_inputs, { speaker_embeddings }) {

        // Load vocoder, if not provided
        if (!this.vocoder) {
            console.log('No vocoder specified, using default HifiGan vocoder.');
            this.vocoder = await models/* AutoModel.from_pretrained */.$Sz.from_pretrained(this.DEFAULT_VOCODER_ID, { quantized: false });
        }

        // Load speaker embeddings as Float32Array from path/URL
        if (typeof speaker_embeddings === 'string' || speaker_embeddings instanceof URL) {
            // Load from URL with fetch
            speaker_embeddings = new Float32Array(
                await (await fetch(speaker_embeddings)).arrayBuffer()
            );
        }

        if (speaker_embeddings instanceof Float32Array) {
            speaker_embeddings = new utils_tensor/* Tensor */.es(
                'float32',
                speaker_embeddings,
                [1, speaker_embeddings.length]
            )
        } else if (!(speaker_embeddings instanceof utils_tensor/* Tensor */.es)) {
            throw new Error("Speaker embeddings must be a `Tensor`, `Float32Array`, `string`, or `URL`.")
        }

        // Run tokenization
        const { input_ids } = this.tokenizer(text_inputs, {
            padding: true,
            truncation: true,
        });

        // NOTE: At this point, we are guaranteed that `speaker_embeddings` is a `Tensor`
        // @ts-ignore
        const { waveform } = await this.model.generate_speech(input_ids, speaker_embeddings, { vocoder: this.vocoder });

        const sampling_rate = this.processor.feature_extractor.config.sampling_rate;
        return {
            audio: waveform.data,
            sampling_rate,
        }
    }
}

/**
 * @callback ImageToImagePipelineCallback Transform the image(s) passed as inputs.
 * @param {ImagePipelineInputs} images The images to transform.
 * @returns {Promise<RawImage|RawImage[]>} The transformed image or list of images.
 * 
 * @typedef {ImagePipelineConstructorArgs & ImageToImagePipelineCallback & Disposable} ImageToImagePipelineType
 */

/**
 * Image to Image pipeline using any `AutoModelForImageToImage`. This pipeline generates an image based on a previous image input.
 * 
 * **Example:** Super-resolution w/ `Xenova/swin2SR-classical-sr-x2-64`
 * ```javascript
 * const upscaler = await pipeline('image-to-image', 'Xenova/swin2SR-classical-sr-x2-64');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/butterfly.jpg';
 * const output = await upscaler(url);
 * // RawImage {
 * //   data: Uint8Array(786432) [ 41, 31, 24,  43, ... ],
 * //   width: 512,
 * //   height: 512,
 * //   channels: 3
 * // }
 * ```
 */
class ImageToImagePipeline extends (/** @type {new (options: ImagePipelineConstructorArgs) => ImageToImagePipelineType} */ (Pipeline)) {
    /**
     * Create a new ImageToImagePipeline.
     * @param {ImagePipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {ImageToImagePipelineCallback} */
    async _call(images) {

        const preparedImages = await prepareImages(images);
        const inputs = await this.processor(preparedImages);
        const outputs = await this.model(inputs);

        /** @type {RawImage[]} */
        const toReturn = [];
        for (const batch of outputs.reconstruction) {
            const output = batch.squeeze().clamp_(0, 1).mul_(255).round_().to('uint8');
            toReturn.push(RawImage.fromTensor(output));
        }

        return toReturn.length > 1 ? toReturn : toReturn[0];
    }
}

/**
 * @typedef {Object} DepthEstimationPipelineOutput
 * @property {Tensor} predicted_depth The raw depth map predicted by the model.
 * @property {RawImage} depth The processed depth map as an image (with the same size as the input image).
 * 
 * @callback DepthEstimationPipelineCallback Predicts the depth for the image(s) passed as inputs.
 * @param {ImagePipelineInputs} images The images to compute depth for.
 * @returns {Promise<DepthEstimationPipelineOutput|DepthEstimationPipelineOutput[]>} An image or a list of images containing result(s).
 * 
 * @typedef {ImagePipelineConstructorArgs & DepthEstimationPipelineCallback & Disposable} DepthEstimationPipelineType
 */

/**
 * Depth estimation pipeline using any `AutoModelForDepthEstimation`. This pipeline predicts the depth of an image.
 * 
 * **Example:** Depth estimation w/ `Xenova/dpt-hybrid-midas`
 * ```javascript
 * const depth_estimator = await pipeline('depth-estimation', 'Xenova/dpt-hybrid-midas');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/cats.jpg';
 * const out = await depth_estimator(url);
 * // {
 * //   predicted_depth: Tensor {
 * //     dims: [ 384, 384 ],
 * //     type: 'float32',
 * //     data: Float32Array(147456) [ 542.859130859375, 545.2833862304688, 546.1649169921875, ... ],
 * //     size: 147456
 * //   },
 * //   depth: RawImage {
 * //     data: Uint8Array(307200) [ 86, 86, 86, ... ],
 * //     width: 640,
 * //     height: 480,
 * //     channels: 1
 * //   }
 * // }
 * ```
 */
class DepthEstimationPipeline extends (/** @type {new (options: ImagePipelineConstructorArgs) => DepthEstimationPipelineType} */ (Pipeline)) {
    /**
     * Create a new DepthEstimationPipeline.
     * @param {ImagePipelineConstructorArgs} options An object used to instantiate the pipeline.
     */
    constructor(options) {
        super(options);
    }

    /** @type {DepthEstimationPipelineCallback} */
    async _call(images) {

        const preparedImages = await prepareImages(images);

        const inputs = await this.processor(preparedImages);
        const { predicted_depth } = await this.model(inputs);

        const toReturn = [];
        for (let i = 0; i < preparedImages.length; ++i) {
            const prediction = (0,utils_tensor/* interpolate */.sX)(predicted_depth[i], preparedImages[i].size.reverse(), 'bilinear', false);
            const formatted = prediction.mul_(255 / (0,maths/* max */.Fp)(prediction.data)[0]).to('uint8');
            toReturn.push({
                predicted_depth: predicted_depth[i],
                depth: RawImage.fromTensor(formatted),
            });
        }

        return toReturn.length > 1 ? toReturn : toReturn[0];
    }
}

const SUPPORTED_TASKS = Object.freeze({
    "text-classification": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": TextClassificationPipeline,
        "model": models/* AutoModelForSequenceClassification */.o$X,
        "default": {
            // TODO: replace with original
            // "model": "distilbert-base-uncased-finetuned-sst-2-english",
            "model": "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
        },
        "type": "text",
    },
    "token-classification": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": TokenClassificationPipeline,
        "model": models/* AutoModelForTokenClassification */.OjJ,
        "default": {
            // TODO: replace with original
            // "model": "Davlan/bert-base-multilingual-cased-ner-hrl",
            "model": "Xenova/bert-base-multilingual-cased-ner-hrl",
        },
        "type": "text",
    },
    "question-answering": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": QuestionAnsweringPipeline,
        "model": models/* AutoModelForQuestionAnswering */.wiU,
        "default": {
            // TODO: replace with original
            // "model": "distilbert-base-cased-distilled-squad",
            "model": "Xenova/distilbert-base-cased-distilled-squad",
        },
        "type": "text",
    },

    "fill-mask": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": FillMaskPipeline,
        "model": models/* AutoModelForMaskedLM */.t78,
        "default": {
            // TODO: replace with original
            // "model": "bert-base-uncased",
            "model": "Xenova/bert-base-uncased",
        },
        "type": "text",
    },
    "summarization": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": SummarizationPipeline,
        "model": models/* AutoModelForSeq2SeqLM */.Kf0,
        "default": {
            // TODO: replace with original
            // "model": "sshleifer/distilbart-cnn-6-6",
            "model": "Xenova/distilbart-cnn-6-6",
        },
        "type": "text",
    },
    "translation": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": TranslationPipeline,
        "model": models/* AutoModelForSeq2SeqLM */.Kf0,
        "default": {
            // TODO: replace with original
            // "model": "t5-small",
            "model": "Xenova/t5-small",
        },
        "type": "text",
    },
    "text2text-generation": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": Text2TextGenerationPipeline,
        "model": models/* AutoModelForSeq2SeqLM */.Kf0,
        "default": {
            // TODO: replace with original
            // "model": "google/flan-t5-small",
            "model": "Xenova/flan-t5-small",
        },
        "type": "text",
    },
    "text-generation": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": TextGenerationPipeline,
        "model": models/* AutoModelForCausalLM */.Hqk,
        "default": {
            // TODO: replace with original
            // "model": "gpt2",
            "model": "Xenova/gpt2",
        },
        "type": "text",
    },
    "zero-shot-classification": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": ZeroShotClassificationPipeline,
        "model": models/* AutoModelForSequenceClassification */.o$X,
        "default": {
            // TODO: replace with original
            // "model": "typeform/distilbert-base-uncased-mnli",
            "model": "Xenova/distilbert-base-uncased-mnli",
        },
        "type": "text",
    },
    "audio-classification": {
        "pipeline": AudioClassificationPipeline,
        "model": models/* AutoModelForAudioClassification */.K2m,
        "processor": AutoProcessor,
        "default": {
            // TODO: replace with original
            // "model": "superb/wav2vec2-base-superb-ks",
            "model": "Xenova/wav2vec2-base-superb-ks",
        },
        "type": "audio",
    },
    "zero-shot-audio-classification": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": ZeroShotAudioClassificationPipeline,
        "model": models/* AutoModel */.$Sz,
        "processor": AutoProcessor,
        "default": {
            // TODO: replace with original
            // "model": "laion/clap-htsat-fused",
            "model": "Xenova/clap-htsat-unfused",
        },
        "type": "multimodal",
    },
    "automatic-speech-recognition": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": AutomaticSpeechRecognitionPipeline,
        "model": [models/* AutoModelForSpeechSeq2Seq */.hZO, models/* AutoModelForCTC */.ENH],
        "processor": AutoProcessor,
        "default": {
            // TODO: replace with original
            // "model": "openai/whisper-tiny.en",
            "model": "Xenova/whisper-tiny.en",
        },
        "type": "multimodal",
    },
    "text-to-audio": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": TextToAudioPipeline,
        "model": [models/* AutoModelForTextToWaveform */.z6E, models/* AutoModelForTextToSpectrogram */.lbf],
        "processor": [AutoProcessor, /* Some don't use a processor */ null],
        "default": {
            // TODO: replace with original
            // "model": "microsoft/speecht5_tts",
            "model": "Xenova/speecht5_tts",
        },
        "type": "text",
    },
    "image-to-text": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": ImageToTextPipeline,
        "model": models/* AutoModelForVision2Seq */.tLj,
        "processor": AutoProcessor,
        "default": {
            // TODO: replace with original
            // "model": "nlpconnect/vit-gpt2-image-captioning",
            "model": "Xenova/vit-gpt2-image-captioning",
        },
        "type": "multimodal",
    },

    "image-classification": {
        // no tokenizer
        "pipeline": ImageClassificationPipeline,
        "model": models/* AutoModelForImageClassification */.En$,
        "processor": AutoProcessor,
        "default": {
            // TODO: replace with original
            // "model": "google/vit-base-patch16-224",
            "model": "Xenova/vit-base-patch16-224",
        },
        "type": "multimodal",
    },

    "image-segmentation": {
        // no tokenizer
        "pipeline": ImageSegmentationPipeline,
        "model": [models/* AutoModelForImageSegmentation */.U$$, models/* AutoModelForSemanticSegmentation */.$Bv],
        "processor": AutoProcessor,
        "default": {
            // TODO: replace with original
            // "model": "facebook/detr-resnet-50-panoptic",
            "model": "Xenova/detr-resnet-50-panoptic",
        },
        "type": "multimodal",
    },

    "zero-shot-image-classification": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": ZeroShotImageClassificationPipeline,
        "model": models/* AutoModel */.$Sz,
        "processor": AutoProcessor,
        "default": {
            // TODO: replace with original
            // "model": "openai/clip-vit-base-patch32",
            "model": "Xenova/clip-vit-base-patch32",
        },
        "type": "multimodal",
    },

    "object-detection": {
        // no tokenizer
        "pipeline": ObjectDetectionPipeline,
        "model": models/* AutoModelForObjectDetection */.Zn,
        "processor": AutoProcessor,
        "default": {
            // TODO: replace with original
            // "model": "facebook/detr-resnet-50",
            "model": "Xenova/detr-resnet-50",
        },
        "type": "multimodal",
    },
    "zero-shot-object-detection": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": ZeroShotObjectDetectionPipeline,
        "model": models/* AutoModelForZeroShotObjectDetection */.LdW,
        "processor": AutoProcessor,
        "default": {
            // TODO: replace with original
            // "model": "google/owlvit-base-patch32",
            "model": "Xenova/owlvit-base-patch32",
        },
        "type": "multimodal",
    },
    "document-question-answering": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": DocumentQuestionAnsweringPipeline,
        "model": models/* AutoModelForDocumentQuestionAnswering */.DcG,
        "processor": AutoProcessor,
        "default": {
            // TODO: replace with original
            // "model": "naver-clova-ix/donut-base-finetuned-docvqa",
            "model": "Xenova/donut-base-finetuned-docvqa",
        },
        "type": "multimodal",
    },
    "image-to-image": {
        // no tokenizer
        "pipeline": ImageToImagePipeline,
        "model": models/* AutoModelForImageToImage */.S2d,
        "processor": AutoProcessor,
        "default": {
            // TODO: replace with original
            // "model": "caidas/swin2SR-classical-sr-x2-64",
            "model": "Xenova/swin2SR-classical-sr-x2-64",
        },
        "type": "image",
    },
    "depth-estimation": {
        // no tokenizer
        "pipeline": DepthEstimationPipeline,
        "model": models/* AutoModelForDepthEstimation */.hY6,
        "processor": AutoProcessor,
        "default": {
            // TODO: replace with original
            // "model": "Intel/dpt-large",
            "model": "Xenova/dpt-large",
        },
        "type": "image",
    },

    // This task serves as a useful interface for dealing with sentence-transformers (https://huggingface.co/sentence-transformers).
    "feature-extraction": {
        "tokenizer": tokenizers/* AutoTokenizer */.t2,
        "pipeline": FeatureExtractionPipeline,
        "model": models/* AutoModel */.$Sz,
        "default": {
            // TODO: replace with original
            // "model": "sentence-transformers/all-MiniLM-L6-v2",
            "model": "Xenova/all-MiniLM-L6-v2",
        },
        "type": "text",
    },
    "image-feature-extraction": {
        "processor": AutoProcessor,
        "pipeline": ImageFeatureExtractionPipeline,
        "model": [models/* AutoModelForImageFeatureExtraction */.IFL, models/* AutoModel */.$Sz],
        "default": {
            // TODO: replace with original
            // "model": "google/vit-base-patch16-224",
            "model": "Xenova/vit-base-patch16-224-in21k",
        },
        "type": "image",
    },
})


// TODO: Add types for TASK_ALIASES
const TASK_ALIASES = Object.freeze({
    "sentiment-analysis": "text-classification",
    "ner": "token-classification",
    // "vqa": "visual-question-answering", // TODO: Add
    "asr": "automatic-speech-recognition",
    "text-to-speech": "text-to-audio",

    // Add for backwards compatibility
    "embeddings": "feature-extraction",
});

/**
 * @typedef {keyof typeof SUPPORTED_TASKS} TaskType
 * @typedef {keyof typeof TASK_ALIASES} AliasType
 * @typedef {TaskType | AliasType} PipelineType All possible pipeline types.
 * @typedef {{[K in TaskType]: InstanceType<typeof SUPPORTED_TASKS[K]["pipeline"]>}} SupportedTasks A mapping of pipeline names to their corresponding pipeline classes.
 * @typedef {{[K in AliasType]: InstanceType<typeof SUPPORTED_TASKS[TASK_ALIASES[K]]["pipeline"]>}} AliasTasks A mapping from pipeline aliases to their corresponding pipeline classes.
 * @typedef {SupportedTasks & AliasTasks} AllTasks A mapping from all pipeline names and aliases to their corresponding pipeline classes.
 */

/**
 * Utility factory method to build a `Pipeline` object.
 * 
 * @template {PipelineType} T The type of pipeline to return.
 * @param {T} task The task defining which pipeline will be returned. Currently accepted tasks are:
 *  - `"audio-classification"`: will return a `AudioClassificationPipeline`.
 *  - `"automatic-speech-recognition"`: will return a `AutomaticSpeechRecognitionPipeline`.
 *  - `"depth-estimation"`: will return a `DepthEstimationPipeline`.
 *  - `"document-question-answering"`: will return a `DocumentQuestionAnsweringPipeline`.
 *  - `"feature-extraction"`: will return a `FeatureExtractionPipeline`.
 *  - `"fill-mask"`: will return a `FillMaskPipeline`.
 *  - `"image-classification"`: will return a `ImageClassificationPipeline`.
 *  - `"image-segmentation"`: will return a `ImageSegmentationPipeline`.
 *  - `"image-to-text"`: will return a `ImageToTextPipeline`.
 *  - `"object-detection"`: will return a `ObjectDetectionPipeline`.
 *  - `"question-answering"`: will return a `QuestionAnsweringPipeline`.
 *  - `"summarization"`: will return a `SummarizationPipeline`.
 *  - `"text2text-generation"`: will return a `Text2TextGenerationPipeline`.
 *  - `"text-classification"` (alias "sentiment-analysis" available): will return a `TextClassificationPipeline`.
 *  - `"text-generation"`: will return a `TextGenerationPipeline`.
 *  - `"token-classification"` (alias "ner" available): will return a `TokenClassificationPipeline`.
 *  - `"translation"`: will return a `TranslationPipeline`.
 *  - `"translation_xx_to_yy"`: will return a `TranslationPipeline`.
 *  - `"zero-shot-classification"`: will return a `ZeroShotClassificationPipeline`.
 *  - `"zero-shot-audio-classification"`: will return a `ZeroShotAudioClassificationPipeline`.
 *  - `"zero-shot-image-classification"`: will return a `ZeroShotImageClassificationPipeline`.
 *  - `"zero-shot-object-detection"`: will return a `ZeroShotObjectDetectionPipeline`.
 * @param {string} [model=null] The name of the pre-trained model to use. If not specified, the default model for the task will be used.
 * @param {import('./utils/hub.js').PretrainedOptions} [options] Optional parameters for the pipeline.
 * @returns {Promise<AllTasks[T]>} A Pipeline object for the specified task.
 * @throws {Error} If an unsupported pipeline is requested.
 */
async function pipeline(
    task,
    model = null,
    {
        quantized = true,
        progress_callback = null,
        config = null,
        cache_dir = null,
        local_files_only = false,
        revision = 'main',
        model_file_name = null,
    } = {}
) {
    // Helper method to construct pipeline

    // Apply aliases
    // @ts-ignore
    task = TASK_ALIASES[task] ?? task;

    // Get pipeline info
    const pipelineInfo = SUPPORTED_TASKS[task.split('_', 1)[0]];
    if (!pipelineInfo) {
        throw Error(`Unsupported pipeline: ${task}. Must be one of [${Object.keys(SUPPORTED_TASKS)}]`)
    }

    // Use model if specified, otherwise, use default
    if (!model) {
        model = pipelineInfo.default.model
        console.log(`No model specified. Using default model: "${model}".`);
    }

    const pretrainedOptions = {
        quantized,
        progress_callback,
        config,
        cache_dir,
        local_files_only,
        revision,
        model_file_name,
    }

    const classes = new Map([
        ['tokenizer', pipelineInfo.tokenizer],
        ['model', pipelineInfo.model],
        ['processor', pipelineInfo.processor],
    ]);

    // Load model, tokenizer, and processor (if they exist)
    const results = await loadItems(classes, model, pretrainedOptions);
    results.task = task;

    (0,core/* dispatchCallback */.T2)(progress_callback, {
        'status': 'ready',
        'task': task,
        'model': model,
    });

    const pipelineClass = pipelineInfo.pipeline;
    return new pipelineClass(results);
}


/**
 * Helper function to get applicable model, tokenizer, or processor classes for a given model.
 * @param {Map<string, any>} mapping The mapping of names to classes, arrays of classes, or null.
 * @param {string} model The name of the model to load.
 * @param {import('./utils/hub.js').PretrainedOptions} pretrainedOptions The options to pass to the `from_pretrained` method.
 * @private
 */
async function loadItems(mapping, model, pretrainedOptions) {

    const result = Object.create(null);

    /**@type {Promise[]} */
    const promises = [];
    for (let [name, cls] of mapping.entries()) {
        if (!cls) continue;

        /**@type {Promise} */
        let promise;
        if (Array.isArray(cls)) {
            promise = new Promise(async (resolve, reject) => {
                let e;
                for (let c of cls) {
                    if (c === null) {
                        // If null, we resolve it immediately, meaning the relevant
                        // class was not found, but it is optional.
                        resolve(null);
                        return;
                    }
                    try {
                        resolve(await c.from_pretrained(model, pretrainedOptions));
                        return;
                    } catch (err) {
                        e = err;
                    }
                }
                reject(e);
            })
        } else {
            promise = cls.from_pretrained(model, pretrainedOptions);
        }

        result[name] = promise;
        promises.push(promise);
    }

    // Wait for all promises to resolve (in parallel)
    await Promise.all(promises);

    // Then assign to result
    for (let [name, promise] of Object.entries(result)) {
        result[name] = await promise;
    }

    return result;
}
// EXTERNAL MODULE: ../../node_modules/.pnpm/@xenova+transformers@2.17.2/node_modules/@xenova/transformers/src/configs.js
var configs = __webpack_require__(8958);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@xenova+transformers@2.17.2/node_modules/@xenova/transformers/src/transformers.js
/**
 * @file Entry point for the Transformers.js library. Only the exports from this file
 * are available to the end user, and are grouped as follows:
 * 
 * 1. [Pipelines](./pipelines)
 * 2. [Environment variables](./env)
 * 3. [Models](./models)
 * 4. [Tokenizers](./tokenizers)
 * 5. [Processors](./processors)
 * 
 * @module transformers
 */














/***/ }),

/***/ 4513:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$2": function() { return /* binding */ reverseDictionary; },
/* harmony export */   "Ag": function() { return /* binding */ Callable; },
/* harmony export */   "Gg": function() { return /* binding */ exists; },
/* harmony export */   "O7": function() { return /* binding */ product; },
/* harmony export */   "Sw": function() { return /* binding */ pop; },
/* harmony export */   "T2": function() { return /* binding */ dispatchCallback; },
/* harmony export */   "Wy": function() { return /* binding */ isIntegralNumber; },
/* harmony export */   "eG": function() { return /* binding */ mergeArrays; },
/* harmony export */   "fU": function() { return /* binding */ isTypedArray; },
/* harmony export */   "hr": function() { return /* binding */ escapeRegExp; },
/* harmony export */   "hs": function() { return /* binding */ calculateReflectOffset; },
/* harmony export */   "jg": function() { return /* binding */ calculateDimensions; }
/* harmony export */ });

/**
 * @file Core utility functions/classes for Transformers.js.
 * 
 * These are only used internally, meaning an end-user shouldn't
 * need to access anything here.
 * 
 * @module utils/core
 */

/**
 * Helper function to dispatch progress callbacks.
 *
 * @param {Function} progress_callback The progress callback function to dispatch.
 * @param {any} data The data to pass to the progress callback function.
 * @returns {void}
 * @private
 */
function dispatchCallback(progress_callback, data) {
    if (progress_callback) progress_callback(data);
}

/**
 * Reverses the keys and values of an object.
 *
 * @param {Object} data The object to reverse.
 * @returns {Object} The reversed object.
 * @see https://ultimatecourses.com/blog/reverse-object-keys-and-values-in-javascript
 */
function reverseDictionary(data) {
    // https://ultimatecourses.com/blog/reverse-object-keys-and-values-in-javascript
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [value, key]));
}

/**
 * Escapes regular expression special characters from a string by replacing them with their escaped counterparts.
 *
 * @param {string} string The string to escape.
 * @returns {string} The escaped string.
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * A base class for creating callable objects.
 * 
 * @type {new () => {(...args: any[]): any, _call(...args: any[]): any}}
 */
const Callable = /** @type {any} */ (class {
    /**
    * Creates a new instance of the Callable class.
    */
    constructor() {
        /**
         * Creates a closure that delegates to a private method '_call' with the given arguments.
         * @type {any}
         * @param {...any} args Zero or more arguments to pass to the '_call' method.
         * @returns {*} The result of calling the '_call' method.
         */
        let closure = function (...args) {
            return closure._call(...args)
        }
        return Object.setPrototypeOf(closure, new.target.prototype)
    }

    /**
     * This method should be implemented in subclasses to provide the
     * functionality of the callable object.
     *
     * @param {any[]} args
     * @throws {Error} If the subclass does not implement the `_call` method.
     */
    _call(...args) {
        throw Error('Must implement _call method in subclass')
    }
});

/**
 * Check if a value is a typed array.
 * @param {*} val The value to check.
 * @returns {boolean} True if the value is a `TypedArray`, false otherwise.
 * 
 * Adapted from https://stackoverflow.com/a/71091338/13989043
 */
function isTypedArray(val) {
    return val?.prototype?.__proto__?.constructor?.name === 'TypedArray';
}


/**
 * Check if a value is an integer.
 * @param {*} x The value to check.
 * @returns {boolean} True if the value is a string, false otherwise.
 */
function isIntegralNumber(x) {
    return Number.isInteger(x) || typeof x === 'bigint'
}

/**
 * Check if a value is exists.
 * @param {*} x The value to check.
 * @returns {boolean} True if the value exists, false otherwise.
 */
function exists(x) {
    return x !== undefined && x !== null;
}

/**
 * Calculates the dimensions of a nested array.
 *
 * @param {any[]} arr The nested array to calculate dimensions for.
 * @returns {number[]} An array containing the dimensions of the input array.
 */
function calculateDimensions(arr) {
    const dimensions = [];
    let current = arr;
    while (Array.isArray(current)) {
        dimensions.push(current.length);
        current = current[0];
    }
    return dimensions;
}

/**
 * Replicate python's .pop() method for objects.
 * @param {Object} obj The object to pop from.
 * @param {string} key The key to pop.
 * @param {*} defaultValue The default value to return if the key does not exist.
 * @returns {*} The value of the popped key.
 * @throws {Error} If the key does not exist and no default value is provided.
 */
function pop(obj, key, defaultValue = undefined) {
    const value = obj[key];
    if (value !== undefined) {
        delete obj[key];
        return value;
    }
    if (defaultValue === undefined) {
        throw Error(`Key ${key} does not exist in object.`)
    }
    return defaultValue;
}

/**
 * Efficiently merge arrays, creating a new copy.
 * Adapted from https://stackoverflow.com/a/6768642/13989043
 * @param  {Array[]} arrs Arrays to merge.
 * @returns {Array} The merged array.
 */
function mergeArrays(...arrs) {
    return Array.prototype.concat.apply([], arrs);
}

/**
 * Compute the Cartesian product of given arrays
 * @param {...Array} a Arrays to compute the product
 * @returns {Array} Returns the computed Cartesian product as an array
 * @private
 */
function product(...a) {
    // Cartesian product of items
    // Adapted from https://stackoverflow.com/a/43053803
    return a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e])));
}

/**
 * Calculates the index offset for a given index and window size.
 * @param {number} i The index.
 * @param {number} w The window size.
 * @returns {number} The index offset.
 */
function calculateReflectOffset(i, w) {
    return Math.abs((i + w) % (2 * w) - w);
}


/***/ }),

/***/ 6861:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GA": function() { return /* binding */ CharTrie; },
/* harmony export */   "Z3": function() { return /* binding */ PriorityQueue; },
/* harmony export */   "pQ": function() { return /* binding */ TokenLattice; }
/* harmony export */ });

/**
 * @file Custom data structures.
 * 
 * These are only used internally, meaning an end-user shouldn't
 * need to access anything here.
 * 
 * @module utils/data-structures
 */


/**
 * Efficient Heap-based Implementation of a Priority Queue.
 * It uses an array-based binary heap, where the root is at index `0`, and the
 * children of node `i` are located at indices `2i + 1` and `2i + 2`, respectively.
 * 
 * Adapted from the following sources:
 * - https://stackoverflow.com/a/42919752/13989043 (original)
 * - https://github.com/belladoreai/llama-tokenizer-js (minor improvements)
 */
class PriorityQueue {

    /**
     * Create a new PriorityQueue.
     * @param {Function} comparator Comparator function to determine priority. Defaults to a MaxHeap.
     */
    constructor(comparator = (a, b) => a > b) {
        this._heap = [];
        this._comparator = comparator;
    }

    /**
     * The size of the queue
     */
    get size() {
        return this._heap.length;
    }

    /**
     * Check if the queue is empty.
     * @returns {boolean} `true` if the queue is empty, `false` otherwise.
     */
    isEmpty() {
        return this.size === 0;
    }

    /**
     * Return the element with the highest priority in the queue.
     * @returns {any} The highest priority element in the queue.
     */
    peek() {
        return this._heap[0];
    }

    /**
     * Add one or more elements to the queue.
     * @param  {...any} values The values to push into the queue.
     * @returns {number} The new size of the queue.
     */
    push(...values) {
        return this.extend(values);
    }

    /**
     * Add multiple elements to the queue.
     * @param {any[]} values The values to push into the queue.
     * @returns {number} The new size of the queue.
     */
    extend(values) {
        for (const value of values) {
            this._heap.push(value);
            this._siftUp();
        }
        return this.size;
    }

    /**
     * Remove and return the element with the highest priority in the queue.
     * @returns {any} The element with the highest priority in the queue.
     */
    pop() {
        const poppedValue = this.peek();
        const bottom = this.size - 1;
        if (bottom > 0) {
            this._swap(0, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }

    /**
     * Replace the element with the highest priority in the queue with a new value.
     * @param {*} value The new value.
     * @returns {*} The replaced value.
     */
    replace(value) {
        const replacedValue = this.peek();
        this._heap[0] = value;
        this._siftDown();
        return replacedValue;
    }

    /**
     * Compute the index for the parent of the node at index `i`.
     * @param {number} i The index of the node to get the parent of.
     * @returns {number} The index of the parent node.
     * @private
     */
    _parent(i) {
        return ((i + 1) >>> 1) - 1;
    }

    /**
     * Compute the index for the left child of the node at index `i`.
     * @param {number} i The index of the node to get the left child of.
     * @returns {number} The index of the left child.
     * @private
     */
    _left(i) {
        return (i << 1) + 1;
    }

    /**
     * Compute the index for the right child of the node at index `i`.
     * @param {number} i The index of the node to get the right child of.
     * @returns {number} The index of the right child.
     * @private
     */
    _right(i) {
        return (i + 1) << 1;
    }

    /**
     * Check if the element at index `i` is greater than the element at index `j`.
     * @param {number} i The index of the first element to compare.
     * @param {number} j The index of the second element to compare.
     * @returns {boolean} `true` if the element at index `i` is greater than the element at index `j`, `false` otherwise.
     * @private
     */
    _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }

    /**
     * Swap the elements at indices `i` and `j`.
     * @param {number} i The index of the first element to swap.
     * @param {number} j The index of the second element to swap.
     * @private
     */
    _swap(i, j) {
        const temp = this._heap[i];
        this._heap[i] = this._heap[j];
        this._heap[j] = temp;
    }

    /**
     * Maintain the heap property by updating positions in the heap,
     * starting at the last element and moving up the heap.
     * @private
     */
    _siftUp() {
        let node = this.size - 1;
        while (node > 0 && this._greater(node, this._parent(node))) {
            this._swap(node, this._parent(node));
            node = this._parent(node);
        }
    }
    /**
     * Maintain the heap property by updating positions in the heap,
     * starting at the first element and moving down the heap.
     * @private
     */
    _siftDown() {
        let node = 0;
        while (
            (this._left(node) < this.size && this._greater(this._left(node), node)) ||
            (this._right(node) < this.size && this._greater(this._right(node), node))
        ) {
            const maxChild = (this._right(node) < this.size && this._greater(this._right(node), this._left(node)))
                ? this._right(node)
                : this._left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}

/**
 * A trie structure to efficiently store and search for strings.
 */
class CharTrie {
    constructor() {
        this.root = CharTrieNode.default();
    }

    /**
     * Adds one or more `texts` to the trie.
     * @param {string[]} texts The strings to add to the trie.
     */
    extend(texts) {
        for (let text of texts) {
            this.push(text);
        }
    }

    /**
     * Adds text to the trie.
     * @param {string} text The string to add to the trie.
     */
    push(text) {
        let node = this.root;
        for (let ch of text) {
            let child = node.children.get(ch);
            if (child === undefined) {
                child = CharTrieNode.default();
                node.children.set(ch, child);
            }
            node = child;
        }
        node.isLeaf = true;
    }

    /**
     * Searches the trie for all strings with a common prefix of `text`.
     * @param {string} text The common prefix to search for.
     * @yields {string} Each string in the trie that has `text` as a prefix.
     */
    *commonPrefixSearch(text) {
        let node = this.root;
        let prefix = "";
        for (let i = 0; i < text.length && node !== undefined; ++i) {
            const ch = text[i];
            prefix += ch;
            node = node.children.get(ch);
            if (node !== undefined && node.isLeaf) {
                yield prefix;
            }
        }
    }
}

/**
 * Represents a node in a character trie.
 */
class CharTrieNode {
    /**
     * Create a new CharTrieNode.
     * @param {boolean} isLeaf Whether the node is a leaf node or not.
     * @param {Map<string, CharTrieNode>} children A map containing the node's children, where the key is a character and the value is a `CharTrieNode`.
     */
    constructor(isLeaf, children) {
        this.isLeaf = isLeaf;
        this.children = children;
    }

    /**
     * Returns a new `CharTrieNode` instance with default values.
     * @returns {CharTrieNode} A new `CharTrieNode` instance with `isLeaf` set to `false` and an empty `children` map.
     */
    static default() {
        return new CharTrieNode(false, new Map());
    }
}

/**
 * A lattice data structure to be used for tokenization.
 */
class TokenLattice {
    /**
     * Creates a new TokenLattice instance.
     *
     * @param {string} sentence The input sentence to be tokenized.
     * @param {number} bosTokenId The beginning-of-sequence token ID.
     * @param {number} eosTokenId The end-of-sequence token ID.
     */
    constructor(sentence, bosTokenId, eosTokenId) {
        this.sentence = sentence;
        this.len = sentence.length;
        this.bosTokenId = bosTokenId;
        this.eosTokenId = eosTokenId;
        this.nodes = [];
        this.beginNodes = Array.from({ length: this.len + 1 }, () => []);
        this.endNodes = Array.from({ length: this.len + 1 }, () => []);

        const bos = new TokenLatticeNode(this.bosTokenId, 0, 0, 0, 0.0);
        const eos = new TokenLatticeNode(this.eosTokenId, 1, this.len, 0, 0.0);
        this.nodes.push(bos.clone());
        this.nodes.push(eos.clone());
        this.beginNodes[this.len].push(eos);
        this.endNodes[0].push(bos);
    }

    /**
     * Inserts a new token node into the token lattice.
     *
     * @param {number} pos The starting position of the token.
     * @param {number} length The length of the token.
     * @param {number} score The score of the token.
     * @param {number} tokenId The token ID of the token.
     */
    insert(pos, length, score, tokenId) {
        const nodeId = this.nodes.length;
        const node = new TokenLatticeNode(tokenId, nodeId, pos, length, score);
        this.beginNodes[pos].push(node);
        this.endNodes[pos + length].push(node);
        this.nodes.push(node);
    }

    /**
     * Implements the Viterbi algorithm to compute the most likely sequence of tokens.
     *
     * @returns {TokenLatticeNode[]} The array of nodes representing the most likely sequence of tokens.
     */
    viterbi() {
        const len = this.len;
        let pos = 0;
        while (pos <= len) {
            if (this.beginNodes[pos].length == 0) {
                return [];
            }
            for (let rnode of this.beginNodes[pos]) {
                rnode.prev = null;
                let bestScore = 0.0;
                let bestNode = null;
                for (let lnode of this.endNodes[pos]) {
                    const score = lnode.backtraceScore + rnode.score;
                    if (bestNode === null || score > bestScore) {
                        bestNode = lnode.clone();
                        bestScore = score;
                    }
                }

                if (bestNode !== null) {
                    rnode.prev = bestNode;
                    rnode.backtraceScore = bestScore;
                } else {
                    return [];
                }
            }
            ++pos;
        }

        const results = [];
        const root = this.beginNodes[len][0];
        const prev = root.prev;
        if (prev === null) {
            return [];
        }

        let node = prev.clone();
        while (node.prev !== null) {
            results.push(node.clone());
            const n = node.clone();
            node = n.prev.clone();
        }

        results.reverse();
        return results;
    }

    /**
     * @param {TokenLatticeNode} node
     * @returns {string} The array of nodes representing the most likely sequence of tokens.
     */
    piece(node) {
        return this.sentence.slice(node.pos, node.pos + node.length);
    }

    /**
     * @returns {Array} The array of nodes representing the most likely sequence of tokens.
     */
    tokens() {
        const nodes = this.viterbi();
        return nodes.map(x => this.piece(x));
    }

    /**
     * @returns {Array} The array of nodes representing the most likely sequence of tokens.
     */
    tokenIds() {
        const nodes = this.viterbi();
        return nodes.map(x => x.tokenId);
    }
}
class TokenLatticeNode {
    /**
     * Represents a node in a token lattice for a given sentence.
     * @param {number} tokenId The ID of the token associated with this node.
     * @param {number} nodeId The ID of this node.
     * @param {number} pos The starting position of the token in the sentence.
     * @param {number} length The length of the token.
     * @param {number} score The score associated with the token.
     */
    constructor(tokenId, nodeId, pos, length, score) {
        this.tokenId = tokenId;
        this.nodeId = nodeId;
        this.pos = pos;
        this.length = length;
        this.score = score;
        this.prev = null;
        this.backtraceScore = 0.0;
    }

    /**
     * Returns a clone of this node.
     * @returns {TokenLatticeNode} A clone of this node.
     */
    clone() {
        const n = new TokenLatticeNode(this.tokenId, this.nodeId, this.pos, this.length, this.score);
        n.prev = this.prev;
        n.backtraceScore = this.backtraceScore;
        return n;
    }
}


/***/ }),

/***/ 3268:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AE": function() { return /* binding */ NoBadWordsLogitsProcessor; },
/* harmony export */   "C9": function() { return /* binding */ ForcedBOSTokenLogitsProcessor; },
/* harmony export */   "CJ": function() { return /* binding */ MinNewTokensLengthLogitsProcessor; },
/* harmony export */   "E": function() { return /* binding */ ForceTokensLogitsProcessor; },
/* harmony export */   "GU": function() { return /* binding */ SuppressTokensAtBeginLogitsProcessor; },
/* harmony export */   "Jj": function() { return /* binding */ RepetitionPenaltyLogitsProcessor; },
/* harmony export */   "Jm": function() { return /* binding */ LogitsProcessorList; },
/* harmony export */   "Pg": function() { return /* binding */ WhisperTimeStampLogitsProcessor; },
/* harmony export */   "Z4": function() { return /* binding */ Sampler; },
/* harmony export */   "aP": function() { return /* binding */ GenerationConfig; },
/* harmony export */   "dZ": function() { return /* binding */ ForcedEOSTokenLogitsProcessor; },
/* harmony export */   "ez": function() { return /* binding */ MinLengthLogitsProcessor; },
/* harmony export */   "jF": function() { return /* binding */ NoRepeatNGramLogitsProcessor; }
/* harmony export */ });
/* unused harmony export LogitsProcessor */
/* harmony import */ var _tensor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2672);
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4513);
/* harmony import */ var _maths_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(365);

/**
 * @file Classes, functions, and utilities for generation.
 * 
 * @todo Describe how to create a custom `GenerationConfig`.
 * 
 * @module utils/generation
 */




/**
 * A class representing a list of logits processors. A logits processor is a function that modifies the logits
 * output of a language model. This class provides methods for adding new processors and applying all processors to a
 * batch of logits.
 *
 * @extends Callable
 */
class LogitsProcessorList extends _core_js__WEBPACK_IMPORTED_MODULE_1__/* .Callable */ .Ag {
    /**
     * Constructs a new instance of `LogitsProcessorList`.
     */
    constructor() {
        super();
        this.processors = [];
    }

    /**
     * Adds a new logits processor to the list.
     *
     * @param {LogitsProcessor} item The logits processor function to add.
     */
    push(item) {
        this.processors.push(item);
    }

    /**
     * Adds multiple logits processors to the list.
     *
     * @param {LogitsProcessor[]} items The logits processor functions to add.
     */
    extend(items) {
        this.processors.push(...items);
    }

    /**
     * Applies all logits processors in the list to a batch of logits, modifying them in-place.
     *
     * @param {number[]} input_ids The input IDs for the language model.
     * @param {number[][]} batchedLogits A 2D array of logits, where each row corresponds to a single
     *                                                input sequence in the batch.
     */
    _call(input_ids, batchedLogits) {
        // NOTE: This is different from the Python code, since vanilla JS does not support vectorized operations. 
        // As a result, we apply each processor to each item in the batch.
        for (let logits of batchedLogits) {
            // Modifies logits inplace
            this.processors.forEach(
                func => func(input_ids, logits)
            )
        }
    }

    [Symbol.iterator]() {
        return this.processors.values();
    }
}

/**
 * Base class for processing logits.
 * @extends Callable
 */
class LogitsProcessor extends _core_js__WEBPACK_IMPORTED_MODULE_1__/* .Callable */ .Ag {
    /**
     * Apply the processor to the input logits.
     *
     * @abstract
     * @param {Array} input_ids The input ids.
     * @param {Tensor} logits The logits to process.
     * @throws {Error} Throws an error if `_call` is not implemented in the subclass.
     */
    _call(input_ids, logits) {
        throw Error("`_call` should be implemented in a subclass")
    }
}

/**
 * A logits processor that forces a specific token to be generated by the decoder.
 * 
 * @extends LogitsProcessor
 */
class ForceTokensLogitsProcessor extends LogitsProcessor {
    /**
     * Constructs a new instance of `ForceTokensLogitsProcessor`.
     * 
     * @param {Array} forced_decoder_ids The ids of tokens that should be forced.
     */
    constructor(forced_decoder_ids) {
        super();
        this.force_token_map = Object.fromEntries(forced_decoder_ids ?? []);
    }

    /**
     * Apply the processor to the input logits.
     *
     * @param {Array} input_ids The input ids.
     * @param {Tensor} logits The logits to process.
     * @returns {Tensor} The processed logits.
     */
    _call(input_ids, logits) {
        let map = this.force_token_map[input_ids.length];
        if ((0,_core_js__WEBPACK_IMPORTED_MODULE_1__/* .exists */ .Gg)(map)) { // There exists a mapping
            logits.data.fill(-Infinity)
            logits.data[map] = 0;
        }
        return logits;
    }
}

/**
 * A LogitsProcessor that forces a BOS token at the beginning of the generated sequence.
 * @extends LogitsProcessor
 */
class ForcedBOSTokenLogitsProcessor extends LogitsProcessor {
    /**
     * Create a ForcedBOSTokenLogitsProcessor.
     * @param {number} bos_token_id The ID of the beginning-of-sequence token to be forced.
     */
    constructor(bos_token_id) {
        super();
        this.bos_token_id = bos_token_id;
    }

    /**
     * Apply the BOS token forcing to the logits.
     * @param {Array} input_ids The input IDs.
     * @param {Object} logits The logits.
     * @returns {Object} The logits with BOS token forcing.
     */
    _call(input_ids, logits) {
        if (input_ids.length === 1) {
            logits.data.fill(-Infinity)
            logits.data[this.bos_token_id] = 0;
        }
        return logits;
    }
}

/**
 * A logits processor that forces end-of-sequence token probability to 1.
 * 
 * @extends LogitsProcessor
 */
class ForcedEOSTokenLogitsProcessor extends LogitsProcessor {
    /**
     * Create a ForcedEOSTokenLogitsProcessor.
     * @param {number} max_length Max length of the sequence.
     * @param {number|number[]} forced_eos_token_id The ID of the end-of-sequence token to be forced.
     */
    constructor(max_length, forced_eos_token_id) {
        super();
        this.max_length = max_length;
        this.forced_eos_token_id = forced_eos_token_id;
    }

    /**
     * Apply the processor to input_ids and logits.
     * 
     * @param {number[]} input_ids The input ids.
     * @param {Tensor} logits The logits tensor.
     */
    _call(input_ids, logits) {
        // console.log('call ForcedEOSTokenLogitsProcessor')
        // TODO
    }
}

/**
 * A LogitsProcessor that suppresses a list of tokens as soon as the `generate` function starts
 * generating using `begin_index` tokens. This should ensure that the tokens defined by
 * `begin_suppress_tokens` at not sampled at the begining of the generation.
 * @extends LogitsProcessor
 */
class SuppressTokensAtBeginLogitsProcessor extends LogitsProcessor {
    /**
     * Create a SuppressTokensAtBeginLogitsProcessor.
     * @param {number[]} begin_suppress_tokens The IDs of the tokens to suppress.
     * @param {number} begin_index The number of tokens to generate before suppressing tokens.
     */
    constructor(begin_suppress_tokens, begin_index) {
        super();
        this.begin_suppress_tokens = begin_suppress_tokens;
        this.begin_index = begin_index;
    }

    /**
     * Apply the BOS token forcing to the logits.
     * @param {Array} input_ids The input IDs.
     * @param {Object} logits The logits.
     * @returns {Object} The logits with BOS token forcing.
     */
    _call(input_ids, logits) {
        if (input_ids.length === this.begin_index) {
            for (let token_id of this.begin_suppress_tokens) {
                logits.data[token_id] = -Infinity;
            }
        }
        return logits;
    }
}

/**
 * A LogitsProcessor that handles adding timestamps to generated text.
 * @extends LogitsProcessor
 */
class WhisperTimeStampLogitsProcessor extends LogitsProcessor {
    /**
     * Constructs a new WhisperTimeStampLogitsProcessor.
     * @param {Object} generate_config The config object passed to the `generate()` method of a transformer model.
     * @param {number} generate_config.eos_token_id The ID of the end-of-sequence token.
     * @param {number} generate_config.no_timestamps_token_id The ID of the token used to indicate that a token should not have a timestamp.
     * @param {number[][]} [generate_config.forced_decoder_ids] An array of two-element arrays representing decoder IDs that are forced to appear in the output. The second element of each array indicates whether the token is a timestamp.
     * @param {number} [generate_config.max_initial_timestamp_index] The maximum index at which an initial timestamp can appear.
     */
    constructor(generate_config) {
        super();
        this.eos_token_id = generate_config.eos_token_id;
        this.no_timestamps_token_id = generate_config.no_timestamps_token_id;
        this.timestamp_begin = this.no_timestamps_token_id + 1;

        this.begin_index = (generate_config.forced_decoder_ids || []).length + 2;
        if (generate_config.forced_decoder_ids.slice(-1)[0][1] === this.no_timestamps_token_id) {
            this.begin_index -= 1;
        }
        this.max_initial_timestamp_index = generate_config.max_initial_timestamp_index;

    }

    /**
     * Modify the logits to handle timestamp tokens.
     * @param {Array} input_ids The input sequence of tokens.
     * @param {Tensor} logits The logits output by the model.
     * @returns {Tensor} The modified logits.
     */
    _call(input_ids, logits) {
        const logitsData = /** @type {Float32Array} */(logits.data);

        // suppress <|notimestamps|> which is handled by without_timestamps
        logitsData[this.no_timestamps_token_id] = -Infinity;

        if (input_ids.length === this.begin_index - 1) {
            logitsData.fill(-Infinity);
            logitsData[this.timestamp_begin] = 0;
            return logits;
        }

        // timestamps have to appear in pairs, except directly before eos_token; mask logits accordingly
        const seq = input_ids.slice(this.begin_index);
        const last_was_timestamp = seq.length >= 1 && seq[seq.length - 1] >= this.timestamp_begin;
        const penultimate_was_timestamp = seq.length < 2 || seq[seq.length - 2] >= this.timestamp_begin;

        if (last_was_timestamp) {
            if (penultimate_was_timestamp) { // has to be non-timestamp
                logitsData.subarray(this.timestamp_begin).fill(-Infinity);
            } else { // cannot be normal text tokens
                logitsData.subarray(0, this.eos_token_id).fill(-Infinity);
            }
        }

        // apply the `max_initial_timestamp` option
        if (input_ids.length === this.begin_index && this.max_initial_timestamp_index !== null) {
            const last_allowed = this.timestamp_begin + this.max_initial_timestamp_index;
            logitsData.subarray(last_allowed + 1).fill(-Infinity);
        }

        // if sum of probability over timestamps is above any other token, sample timestamp
        const logprobs = (0,_maths_js__WEBPACK_IMPORTED_MODULE_2__/* .log_softmax */ .CI)(logitsData);
        const timestamp_logprob = Math.log(logprobs.subarray(this.timestamp_begin).map(Math.exp).reduce((a, b) => a + b));
        const max_text_token_logprob = (0,_maths_js__WEBPACK_IMPORTED_MODULE_2__/* .max */ .Fp)(logprobs.subarray(0, this.timestamp_begin))[0];

        if (timestamp_logprob > max_text_token_logprob) {
            logitsData.subarray(0, this.timestamp_begin).fill(-Infinity);
        }

        return logits;
    }
}

/**
 * A logits processor that disallows ngrams of a certain size to be repeated.
 * 
 * @extends LogitsProcessor
 */
class NoRepeatNGramLogitsProcessor extends LogitsProcessor {
    /**
     * Create a NoRepeatNGramLogitsProcessor.
     * @param {number} no_repeat_ngram_size The no-repeat-ngram size. All ngrams of this size can only occur once.
     */
    constructor(no_repeat_ngram_size) {
        super();
        this.no_repeat_ngram_size = no_repeat_ngram_size;
    }

    /**
     * Generate n-grams from a sequence of token ids.
     * @param {number[]} prevInputIds List of previous input ids
     * @returns {Map<string, number[]>} Map of generated n-grams
     */
    getNgrams(prevInputIds) {
        const curLen = prevInputIds.length;

        /**@type {number[][]} */
        const ngrams = [];
        for (let j = 0; j < curLen + 1 - this.no_repeat_ngram_size; ++j) {
            const ngram = [];
            for (let k = 0; k < this.no_repeat_ngram_size; ++k) {
                ngram.push(prevInputIds[j + k]);
            }
            ngrams.push(ngram);
        }

        /** @type {Map<string, number[]>} */
        const generatedNgram = new Map();
        for (const ngram of ngrams) {
            const prevNgram = ngram.slice(0, ngram.length - 1);
            const prevNgramKey = JSON.stringify(prevNgram);
            const prevNgramValue = generatedNgram.get(prevNgramKey) ?? [];
            prevNgramValue.push(ngram[ngram.length - 1]);
            generatedNgram.set(prevNgramKey, prevNgramValue);
        }
        return generatedNgram;
    }

    /**
     * Generate n-grams from a sequence of token ids.
     * @param {Map<string, number[]>} bannedNgrams Map of banned n-grams
     * @param {number[]} prevInputIds List of previous input ids
     * @returns {number[]} Map of generated n-grams
     */
    getGeneratedNgrams(bannedNgrams, prevInputIds) {
        const ngramIdx = prevInputIds.slice(prevInputIds.length + 1 - this.no_repeat_ngram_size, prevInputIds.length);
        const banned = bannedNgrams.get(JSON.stringify(ngramIdx)) ?? [];
        return banned;
    }

    /**
     * Calculate banned n-gram tokens
     * @param {number[]} prevInputIds List of previous input ids
     * @returns {number[]} Map of generated n-grams
     */
    calcBannedNgramTokens(prevInputIds) {
        const bannedTokens = [];
        if (prevInputIds.length + 1 < this.no_repeat_ngram_size) {
            // return no banned tokens if we haven't generated no_repeat_ngram_size tokens yet
            return bannedTokens;

        } else {
            const generatedNgrams = this.getNgrams(prevInputIds);
            const bannedTokens = this.getGeneratedNgrams(generatedNgrams, prevInputIds);
            return bannedTokens;
        }
    }

    /**
     * Apply the no-repeat-ngram processor to the logits.
     * @param {Array} input_ids The input IDs.
     * @param {Object} logits The logits.
     * @returns {Object} The logits with no-repeat-ngram processing.
     */
    _call(input_ids, logits) {
        const bannedTokens = this.calcBannedNgramTokens(input_ids);

        for (const token of bannedTokens) {
            logits.data[token] = -Infinity;
        }
        return logits;
    }
}

/**
 * A logits processor that penalises repeated output tokens.
 * 
 * @extends LogitsProcessor
 */
class RepetitionPenaltyLogitsProcessor extends LogitsProcessor {
    /**
     * Create a RepetitionPenaltyLogitsProcessor.
     * @param {number} penalty The penalty to apply for repeated tokens.
     */
    constructor(penalty) {
        super();
        this.penalty = penalty;
    }

    /**
     * Apply the repetition penalty to the logits.
     * @param {Array} input_ids The input IDs.
     * @param {Object} logits The logits.
     * @returns {Object} The logits with repetition penalty processing.
     */
    _call(input_ids, logits) {
        // Modify the logits corresponding to each element in `input_ids`.
        // As a consequence, the logits corresponding to tokens that appear
        // many times in the output will be penalised more.
        for (const input_id of input_ids) {
            if (logits.data[input_id] < 0) {
                logits.data[input_id] *= this.penalty;
            } else {
                logits.data[input_id] /= this.penalty;
            }
        }
        return logits
    }
}

/**
 * A logits processor that enforces a minimum number of tokens.
 * 
 * @extends LogitsProcessor
 */
class MinLengthLogitsProcessor extends LogitsProcessor {
    /**
     * Create a MinLengthLogitsProcessor.
     * @param {number} min_length The minimum length below which the score of `eos_token_id` is set to negative infinity.
     * @param {number|number[]} eos_token_id The ID/IDs of the end-of-sequence token.
     */
    constructor(min_length, eos_token_id) {
        super();
        this.min_length = min_length;
        this.eos_token_id = Array.isArray(eos_token_id) ? eos_token_id : [eos_token_id];
    }

    /**
     * Apply logit processor.
     * @param {Array} input_ids The input IDs.
     * @param {Object} logits The logits.
     * @returns {Object} The processed logits.
     */
    _call(input_ids, logits) {
        if (input_ids.length < this.min_length) {
            for (const eos_token of this.eos_token_id) {
                logits.data[eos_token] = -Infinity;
            }
        }

        return logits
    }
}

/**
 * A logits processor that enforces a minimum number of new tokens.
 * 
 * @extends LogitsProcessor
 */
class MinNewTokensLengthLogitsProcessor extends LogitsProcessor {
    /**
     * Create a MinNewTokensLengthLogitsProcessor.
     * @param {number} prompt_length_to_skip The input tokens length.
     * @param {number} min_new_tokens The minimum *new* tokens length below which the score of `eos_token_id` is set to negative infinity.
     * @param {number|number[]} eos_token_id The ID/IDs of the end-of-sequence token.
     */
    constructor(prompt_length_to_skip, min_new_tokens, eos_token_id) {
        super();
        this.prompt_length_to_skip = prompt_length_to_skip;
        this.min_new_tokens = min_new_tokens;
        this.eos_token_id = Array.isArray(eos_token_id) ? eos_token_id : [eos_token_id];
    }

    /**
     * Apply logit processor.
     * @param {Array} input_ids The input IDs.
     * @param {Object} logits The logits.
     * @returns {Object} The processed logits.
     */
    _call(input_ids, logits) {
        const new_tokens_length = input_ids.length - this.prompt_length_to_skip;
        if (new_tokens_length < this.min_new_tokens) {
            for (const eos_token of this.eos_token_id) {
                logits.data[eos_token] = -Infinity;
            }
        }

        return logits
    }
}

class NoBadWordsLogitsProcessor extends LogitsProcessor {
    /**
     * Create a `NoBadWordsLogitsProcessor`.
     * @param {number[][]} bad_words_ids List of list of token ids that are not allowed to be generated.
     * @param {number|number[]} eos_token_id The id of the *end-of-sequence* token. Optionally, use a list to set multiple *end-of-sequence* tokens.
     */
    constructor(bad_words_ids, eos_token_id) {
        super();
        this.bad_words_ids = bad_words_ids;
        this.eos_token_id = Array.isArray(eos_token_id) ? eos_token_id : [eos_token_id];
    }

    /**
     * Apply logit processor.
     * @param {Array} input_ids The input IDs.
     * @param {Object} logits The logits.
     * @returns {Object} The processed logits.
     */
    _call(input_ids, logits) {

        for (const bad_word_ids of this.bad_words_ids) {
            // Whether to modify the logits of the last token in the bad word id sequence
            let mark = true;

            // For each bad word in the list, if the current sequence of input ids ends with this sequence (excluding the last),
            // then we set the logits of the last bad word id to -Infinity.
            for (let i = 1; i <= bad_word_ids.length - 1 && bad_word_ids.length < input_ids.length; ++i) {

                if (bad_word_ids.at(-i - 1) !== input_ids.at(-i)) {
                    // We have found a mismatch
                    mark = false;
                    break;
                }
            }
            if (mark) {
                logits.data[bad_word_ids.at(-1)] = -Infinity;
            }
        }

        return logits
    }
}

/**
 * @typedef {Object} GenerationConfigType The default configuration parameters.
 * @property {number} [max_length=20] The maximum length the generated tokens can have. Corresponds to the length of the input prompt + `max_new_tokens`. Its effect is overridden by `max_new_tokens`, if also set.
 * @property {number} [max_new_tokens=null] The maximum numbers of tokens to generate, ignoring the number of tokens in the prompt.
 * @property {number} [min_length=0] The minimum length of the sequence to be generated. Corresponds to the length of the input prompt + `min_new_tokens`. Its effect is overridden by `min_new_tokens`, if also set.
 * @property {number} [min_new_tokens=null] The minimum numbers of tokens to generate, ignoring the number of tokens in the prompt.
 * @property {boolean|"never"} [early_stopping=false] Controls the stopping condition for beam-based methods, like beam-search. It accepts the following values:
 * - `true`, where the generation stops as soon as there are `num_beams` complete candidates;
 * - `false`, where an heuristic is applied and the generation stops when is it very unlikely to find better candidates;
 * - `"never"`, where the beam search procedure only stops when there cannot be better candidates (canonical beam search algorithm).
 * @property {number} [max_time=null] The maximum amount of time you allow the computation to run for in seconds. Generation will still finish the current pass after allocated time has been passed.
 *
 * @property {boolean} [do_sample=false] Whether or not to use sampling; use greedy decoding otherwise.
 * @property {number} [num_beams=1] Number of beams for beam search. 1 means no beam search.
 * @property {number} [num_beam_groups=1] Number of groups to divide `num_beams` into in order to ensure diversity among different groups of beams. See [this paper](https://arxiv.org/pdf/1610.02424.pdf) for more details.
 * @property {number} [penalty_alpha=null] The values balance the model confidence and the degeneration penalty in contrastive search decoding.
 * @property {boolean} [use_cache=true] Whether or not the model should use the past last key/values attentions (if applicable to the model) to speed up decoding.
 *
 * @property {number} [temperature=1.0] The value used to modulate the next token probabilities.
 * @property {number} [top_k=50] The number of highest probability vocabulary tokens to keep for top-k-filtering.
 * @property {number} [top_p=1.0] If set to float < 1, only the smallest set of most probable tokens with probabilities that add up to `top_p` or higher are kept for generation.
 * @property {number} [typical_p=1.0] Local typicality measures how similar the conditional probability of predicting a target token next is to the expected conditional probability of predicting a random token next, given the partial text already generated. If set to float < 1, the smallest set of the most locally typical tokens with probabilities that add up to `typical_p` or higher are kept for generation. See [this paper](https://arxiv.org/pdf/2202.00666.pdf) for more details.
 * @property {number} [epsilon_cutoff=0.0] If set to float strictly between 0 and 1, only tokens with a conditional probability greater than `epsilon_cutoff` will be sampled. In the paper, suggested values range from 3e-4 to 9e-4, depending on the size of the model. See [Truncation Sampling as Language Model Desmoothing](https://arxiv.org/abs/2210.15191) for more details.
 * @property {number} [eta_cutoff=0.0] Eta sampling is a hybrid of locally typical sampling and epsilon sampling. If set to float strictly between 0 and 1, a token is only considered if it is greater than either `eta_cutoff` or `sqrt(eta_cutoff) * exp(-entropy(softmax(next_token_logits)))`. The latter term is intuitively the expected next token probability, scaled by `sqrt(eta_cutoff)`. In the paper, suggested values range from 3e-4 to 2e-3, depending on the size of the model. See [Truncation Sampling as Language Model Desmoothing](https://arxiv.org/abs/2210.15191) for more details.
 * @property {number} [diversity_penalty=0.0] This value is subtracted from a beam's score if it generates a token same as any beam from other group at a particular time. Note that `diversity_penalty` is only effective if `group beam search` is enabled.
 * @property {number} [repetition_penalty=1.0] The parameter for repetition penalty. 1.0 means no penalty. See [this paper](https://arxiv.org/pdf/1909.05858.pdf) for more details.
 * @property {number} [encoder_repetition_penalty=1.0] The paramater for encoder_repetition_penalty. An exponential penalty on sequences that are not in the original input. 1.0 means no penalty.
 * @property {number} [length_penalty=1.0] Exponential penalty to the length that is used with beam-based generation. It is applied as an exponent to the sequence length, which in turn is used to divide the score of the sequence. Since the score is the log likelihood of the sequence (i.e. negative), `length_penalty` > 0.0 promotes longer sequences, while `length_penalty` < 0.0 encourages shorter sequences.
 * @property {number} [no_repeat_ngram_size=0] If set to int > 0, all ngrams of that size can only occur once.
 * @property {number[][]} [bad_words_ids=null] List of token ids that are not allowed to be generated. In order to get the token ids of the words that should not appear in the generated text, use `(await tokenizer(bad_words, {add_prefix_space: true, add_special_tokens: false})).input_ids`.
 * @property {number[][]|number[][][]} [force_words_ids=null] List of token ids that must be generated. If given a `number[][]`, this is treated as a simple list of words that must be included, the opposite to `bad_words_ids`. If given `number[][][]`, this triggers a [disjunctive constraint](https://github.com/huggingface/transformers/issues/14081), where one can allow different forms of each word.
 * @property {boolean} [renormalize_logits=false] Whether to renormalize the logits after applying all the logits processors or warpers (including the custom ones). It's highly recommended to set this flag to `true` as the search algorithms suppose the score logits are normalized but some logit processors or warpers break the normalization.
 * @property {Object[]} [constraints=null] Custom constraints that can be added to the generation to ensure that the output will contain the use of certain tokens as defined by `Constraint` objects, in the most sensible way possible.
 * 
 * @property {number} [forced_bos_token_id=null] The id of the token to force as the first generated token after the `decoder_start_token_id`. Useful for multilingual models like mBART where the first generated token needs to be the target language token.
 * @property {number|number[]} [forced_eos_token_id=null] The id of the token to force as the last generated token when `max_length` is reached. Optionally, use a list to set multiple *end-of-sequence* tokens.
 * @property {boolean} [remove_invalid_values=false] Whether to remove possible *nan* and *inf* outputs of the model to prevent the generation method to crash. Note that using `remove_invalid_values` can slow down generation.
 * @property {number[]} [exponential_decay_length_penalty=null] This Tuple adds an exponentially increasing length penalty, after a certain amount of tokens have been generated. The tuple shall consist of: `(start_index, decay_factor)` where `start_index` indicates where penalty starts and `decay_factor` represents the factor of exponential decay.
 * @property {number[]} [suppress_tokens=null] A list of tokens that will be suppressed at generation. The `SupressTokens` logit processor will set their log probs to `-inf` so that they are not sampled.
 * @property {number[]} [begin_suppress_tokens=null] A list of tokens that will be suppressed at the beginning of the generation. The `SupressBeginTokens` logit processor will set their log probs to `-inf` so that they are not sampled.
 * @property {number[][]} [forced_decoder_ids=null] A list of pairs of integers which indicates a mapping from generation indices to token indices that will be forced before sampling. For example, `[[1, 123]]` means the second generated token will always be a token of index 123.
 * 
 * @property {number} [num_return_sequences=1] The number of independently computed returned sequences for each element in the batch.
 * @property {boolean} [output_attentions=false] Whether or not to return the attentions tensors of all attention layers. See `attentions` under returned tensors for more details.
 * @property {boolean} [output_hidden_states=false] Whether or not to return the hidden states of all layers. See `hidden_states` under returned tensors for more details.
 * @property {boolean} [output_scores=false] Whether or not to return the prediction scores. See `scores` under returned tensors for more details.
 * @property {boolean} [return_dict_in_generate=false] Whether or not to return a `ModelOutput` instead of a plain tuple.
 * 
 * @property {number} [pad_token_id=null] The id of the *padding* token.
 * @property {number} [bos_token_id=null] The id of the *beginning-of-sequence* token.
 * @property {number|number[]} [eos_token_id=null] The id of the *end-of-sequence* token. Optionally, use a list to set multiple *end-of-sequence* tokens.
 * 
 * @property {number} [encoder_no_repeat_ngram_size=0] If set to int > 0, all ngrams of that size that occur in the `encoder_input_ids` cannot occur in the `decoder_input_ids`.
 * @property {number} [decoder_start_token_id=null] If an encoder-decoder model starts decoding with a different token than *bos*, the id of that token.
 * 
 * @property {Object} [generation_kwargs={}] Additional generation kwargs will be forwarded to the `generate` function of the model. Kwargs that are not present in `generate`'s signature will be used in the model forward pass.
 */

/**
 * Class that holds a configuration for a generation task.
 * @type {new (kwargs?: GenerationConfigType) => GenerationConfigType}
 */
const GenerationConfig = /** @type {any} */ (class {

    /**
     * Create a new GenerationConfig object.
     * @param {GenerationConfigType} kwargs 
     */
    constructor(kwargs = {}) {
        // Parameters that control the length of the output
        this.max_length = kwargs.max_length ?? 20;
        this.max_new_tokens = kwargs.max_new_tokens ?? null;
        this.min_length = kwargs.min_length ?? 0;
        this.min_new_tokens = kwargs.min_new_tokens ?? null;
        this.early_stopping = kwargs.early_stopping ?? false;
        this.max_time = kwargs.max_time ?? null;

        // Parameters that control the generation strategy used
        this.do_sample = kwargs.do_sample ?? false;
        this.num_beams = kwargs.num_beams ?? 1;
        this.num_beam_groups = kwargs.num_beam_groups ?? 1;
        this.penalty_alpha = kwargs.penalty_alpha ?? null;
        this.use_cache = kwargs.use_cache ?? true;

        // Parameters for manipulation of the model output logits
        this.temperature = kwargs.temperature ?? 1.0;
        this.top_k = kwargs.top_k ?? 50;
        this.top_p = kwargs.top_p ?? 1.0;
        this.typical_p = kwargs.typical_p ?? 1.0;
        this.epsilon_cutoff = kwargs.epsilon_cutoff ?? 0.0;
        this.eta_cutoff = kwargs.eta_cutoff ?? 0.0;
        this.diversity_penalty = kwargs.diversity_penalty ?? 0.0;
        this.repetition_penalty = kwargs.repetition_penalty ?? 1.0;
        this.encoder_repetition_penalty = kwargs.encoder_repetition_penalty ?? 1.0;
        this.length_penalty = kwargs.length_penalty ?? 1.0;
        this.no_repeat_ngram_size = kwargs.no_repeat_ngram_size ?? 0;
        this.bad_words_ids = kwargs.bad_words_ids ?? null;
        this.force_words_ids = kwargs.force_words_ids ?? null;
        this.renormalize_logits = kwargs.renormalize_logits ?? false;
        this.constraints = kwargs.constraints ?? null;
        this.forced_bos_token_id = kwargs.forced_bos_token_id ?? null;
        this.forced_eos_token_id = kwargs.forced_eos_token_id ?? null;
        this.remove_invalid_values = kwargs.remove_invalid_values ?? false;
        this.exponential_decay_length_penalty = kwargs.exponential_decay_length_penalty ?? null;
        this.suppress_tokens = kwargs.suppress_tokens ?? null;
        this.begin_suppress_tokens = kwargs.begin_suppress_tokens ?? null;
        this.forced_decoder_ids = kwargs.forced_decoder_ids ?? null;

        // Parameters that define the output variables of `generate`
        this.num_return_sequences = kwargs.num_return_sequences ?? 1;
        this.output_attentions = kwargs.output_attentions ?? false;
        this.output_hidden_states = kwargs.output_hidden_states ?? false;
        this.output_scores = kwargs.output_scores ?? false;
        this.return_dict_in_generate = kwargs.return_dict_in_generate ?? false;

        // Special tokens that can be used at generation time
        this.pad_token_id = kwargs.pad_token_id ?? null;
        this.bos_token_id = kwargs.bos_token_id ?? null;
        this.eos_token_id = kwargs.eos_token_id ?? null;

        // Generation parameters exclusive to encoder-decoder models
        this.encoder_no_repeat_ngram_size = kwargs.encoder_no_repeat_ngram_size ?? 0;
        this.decoder_start_token_id = kwargs.decoder_start_token_id ?? null;

        // Wild card
        this.generation_kwargs = kwargs.generation_kwargs ?? {};
    }
});

/**
 * Sampler is a base class for all sampling methods used for text generation.
 */
class Sampler extends _core_js__WEBPACK_IMPORTED_MODULE_1__/* .Callable */ .Ag {
    /**
     * Creates a new Sampler object with the specified generation config.
     * @param {GenerationConfigType} generation_config The generation config.
     */
    constructor(generation_config) {
        super();
        this.generation_config = generation_config;
    }

    /**
     * Executes the sampler, using the specified logits.
     * @param {Tensor} logits
     * @param {number} index
     * @returns {void}
     */
    _call(logits, index = -1) {
        // Sample from logits, of dims [batch, sequence_length, vocab_size].
        // If index is specified, sample from [batch, index, vocab_size].
        return this.sample(logits, index);
    }

    /**
     * Abstract method for sampling the logits.
     * @param {Tensor} logits
     * @param {number} index
     * @throws {Error}
     */
    sample(logits, index) {
        throw Error("sample should be implemented in subclasses.")
    }

    /**
     * Returns the specified logits as an array, with temperature applied.
     * @param {Tensor} logits
     * @param {number} index
     * @returns {Float32Array}
     */
    getLogits(logits, index) {
        let vocabSize = logits.dims.at(-1);

        let logs = /** @type {Float32Array} */(logits.data);

        if (index === -1) {
            logs = logs.slice(-vocabSize);
        } else {
            let startIndex = index * vocabSize;
            logs = logs.slice(startIndex, startIndex + vocabSize);
        }

        // add temperature
        if (this.generation_config.temperature > 0) {
            logs = logs.map(x => x / this.generation_config.temperature)
        }
        return logs;
    }

    /**
     * Selects an item randomly based on the specified probabilities.
     * @param {Array} probabilities An array of probabilities to use for selection.
     * @returns {number} The index of the selected item.
     */
    randomSelect(probabilities) {
        // Return index of chosen item
        let sumProbabilities = probabilities.reduce((acc, curr) => acc + curr, 0);

        let r = Math.random() * sumProbabilities;
        for (let i = 0; i < probabilities.length; ++i) {
            r -= probabilities[i];
            if (r <= 0) {
                return i;
            }
        }
        return 0; // return first (most probable) as a fallback
    }

    /**
     * Returns a Sampler object based on the specified options.
     * @param {GenerationConfigType} generation_config An object containing options for the sampler.
     * @returns {Sampler} A Sampler object.
     */
    static getSampler(generation_config) {
        // - *greedy decoding*: `num_beams=1` and `do_sample=False`
        // - *contrastive search*: `penalty_alpha>0` and `top_k>1`
        // - *multinomial sampling*: `num_beams=1` and `do_sample=True`
        // - *beam-search decoding*: `num_beams>1` and `do_sample=False`
        // - *beam-search multinomial sampling*: `num_beams>1` and `do_sample=True`
        // - *diverse beam-search decoding*: `num_beams>1` and `num_beam_groups>1`
        // - *constrained beam-search decoding*: `constraints!=None` or `force_words_ids!=None`

        // NOTE: beam search is implemented directly into the generation function
        if (generation_config.do_sample) {
            return new MultinomialSampler(generation_config);

        } else if (generation_config.num_beams > 1) {
            return new BeamSearchSampler(generation_config);

        } else {
            if (generation_config.num_return_sequences > 1) {
                throw Error(`num_return_sequences has to be 1 when doing greedy search, but is ${generation_config.num_return_sequences}.`)
            }
            return new GreedySampler(generation_config);
        }
    }
}

/**
 * Class representing a Greedy Sampler.
 * @extends Sampler
 */
class GreedySampler extends Sampler {
    /**
     * Sample the maximum probability of a given logits tensor.
     * @param {Tensor} logits
     * @param {number} [index=-1]
     * @returns {Array} An array with a single tuple, containing the index of the maximum value and a meaningless score (since this is a greedy search).
     */
    sample(logits, index = -1) {
        // NOTE: no need to do log_softmax here since we only take the maximum
        let logs = this.getLogits(logits, index);
        let argmax = (0,_maths_js__WEBPACK_IMPORTED_MODULE_2__/* .max */ .Fp)(logs)[1];

        // Note: score is meaningless in this context, since we are performing
        // greedy search (p = 1 => log(p) = 0)
        return [
            [argmax, 0]
        ];
    }
}

/**
 * Class representing a MultinomialSampler.
 * @extends Sampler
 */
class MultinomialSampler extends Sampler {

    /**
     * Sample from the logits.
     * @param {Tensor} logits
     * @param {number} index
     * @returns {Array}
     */
    sample(logits, index = -1) {
        let k = logits.dims.at(-1); // defaults to vocab size
        if (this.generation_config.top_k > 0) {
            k = Math.min(this.generation_config.top_k, k);
        }

        // Get logits of nth token
        const logs = this.getLogits(logits, index);

        // Get top k tokens
        const topLogits = (0,_maths_js__WEBPACK_IMPORTED_MODULE_2__/* .getTopItems */ .em)(logs, k);

        // Compute softmax over logits
        const probabilities = (0,_maths_js__WEBPACK_IMPORTED_MODULE_2__/* .softmax */ .XA)(topLogits.map(x => x[1]));

        return Array.from({ length: this.generation_config.num_beams }, () => {
            const sampledIndex = this.randomSelect(probabilities);
            return [
                topLogits[sampledIndex][0], // token id
                Math.log(probabilities[sampledIndex]), // score
            ];
        });
    }
}


/**
 * Class representing a BeamSearchSampler.
 * @extends Sampler
 */
class BeamSearchSampler extends Sampler {

    /**
     * Sample from the logits.
     * @param {Tensor} logits
     * @param {number} index
     * @returns {Array}
     */
    sample(logits, index = -1) {
        let k = logits.dims.at(-1); // defaults to vocab size
        if (this.generation_config.top_k > 0) {
            k = Math.min(this.generation_config.top_k, k);
        }

        // Get logits of nth token
        const logs = this.getLogits(logits, index);

        // Get top k tokens
        const topLogits = (0,_maths_js__WEBPACK_IMPORTED_MODULE_2__/* .getTopItems */ .em)(logs, k);

        // Compute softmax over logits
        const probabilities = (0,_maths_js__WEBPACK_IMPORTED_MODULE_2__/* .softmax */ .XA)(topLogits.map(x => x[1]));

        return Array.from({ length: this.generation_config.num_beams }, (_, i) => {
            return [
                topLogits[i][0], // token id
                Math.log(probabilities[i]), // score
            ];
        });
    }
}


/***/ }),

/***/ 2023:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hn": function() { return /* binding */ getFile; },
/* harmony export */   "st": function() { return /* binding */ getModelFile; },
/* harmony export */   "yM": function() { return /* binding */ getModelJSON; }
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2143);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4628);
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(157);
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4513);
/* provided dependency */ var process = __webpack_require__(3656);
/* provided dependency */ var Buffer = __webpack_require__(1468)["Buffer"];

/**
 * @file Utility functions to interact with the Hugging Face Hub (https://huggingface.co/models)
 * 
 * @module utils/hub
 */







/**
 * @typedef {Object} PretrainedOptions Options for loading a pretrained model.     
 * @property {boolean?} [quantized=true] Whether to load the 8-bit quantized version of the model (only applicable when loading model files).
 * @property {function} [progress_callback=null] If specified, this function will be called during model construction, to provide the user with progress updates.
 * @property {Object} [config=null] Configuration for the model to use instead of an automatically loaded configuration. Configuration can be automatically loaded when:
 * - The model is a model provided by the library (loaded with the *model id* string of a pretrained model).
 * - The model is loaded by supplying a local directory as `pretrained_model_name_or_path` and a configuration JSON file named *config.json* is found in the directory.
 * @property {string} [cache_dir=null] Path to a directory in which a downloaded pretrained model configuration should be cached if the standard cache should not be used.
 * @property {boolean} [local_files_only=false] Whether or not to only look at local files (e.g., not try downloading the model).
 * @property {string} [revision='main'] The specific model version to use. It can be a branch name, a tag name, or a commit id,
 * since we use a git-based system for storing models and other artifacts on huggingface.co, so `revision` can be any identifier allowed by git.
 * NOTE: This setting is ignored for local requests.
 * @property {string} [model_file_name=null] If specified, load the model with this name (excluding the .onnx suffix). Currently only valid for encoder- or decoder-only models.
 */

class FileResponse {
    /**
     * Mapping from file extensions to MIME types.
     */
    _CONTENT_TYPE_MAP = {
        'txt': 'text/plain',
        'html': 'text/html',
        'css': 'text/css',
        'js': 'text/javascript',
        'json': 'application/json',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
    }
    /**
     * Creates a new `FileResponse` object.
     * @param {string|URL} filePath
     */
    constructor(filePath) {
        this.filePath = filePath;
        this.headers = new Headers();

        this.exists = fs__WEBPACK_IMPORTED_MODULE_0__.existsSync(filePath);
        if (this.exists) {
            this.status = 200;
            this.statusText = 'OK';

            let stats = fs__WEBPACK_IMPORTED_MODULE_0__.statSync(filePath);
            this.headers.set('content-length', stats.size.toString());

            this.updateContentType();

            let self = this;
            this.body = new ReadableStream({
                start(controller) {
                    self.arrayBuffer().then(buffer => {
                        controller.enqueue(new Uint8Array(buffer));
                        controller.close();
                    })
                }
            });
        } else {
            this.status = 404;
            this.statusText = 'Not Found';
            this.body = null;
        }
    }

    /**
     * Updates the 'content-type' header property of the response based on the extension of
     * the file specified by the filePath property of the current object.
     * @returns {void}
     */
    updateContentType() {
        // Set content-type header based on file extension
        const extension = this.filePath.toString().split('.').pop().toLowerCase();
        this.headers.set('content-type', this._CONTENT_TYPE_MAP[extension] ?? 'application/octet-stream');
    }

    /**
     * Clone the current FileResponse object.
     * @returns {FileResponse} A new FileResponse object with the same properties as the current object.
     */
    clone() {
        let response = new FileResponse(this.filePath);
        response.exists = this.exists;
        response.status = this.status;
        response.statusText = this.statusText;
        response.headers = new Headers(this.headers);
        return response;
    }

    /**
     * Reads the contents of the file specified by the filePath property and returns a Promise that
     * resolves with an ArrayBuffer containing the file's contents.
     * @returns {Promise<ArrayBuffer>} A Promise that resolves with an ArrayBuffer containing the file's contents.
     * @throws {Error} If the file cannot be read.
     */
    async arrayBuffer() {
        const data = await fs__WEBPACK_IMPORTED_MODULE_0__.promises.readFile(this.filePath);
        return data.buffer;
    }

    /**
     * Reads the contents of the file specified by the filePath property and returns a Promise that
     * resolves with a Blob containing the file's contents.
     * @returns {Promise<Blob>} A Promise that resolves with a Blob containing the file's contents.
     * @throws {Error} If the file cannot be read.
     */
    async blob() {
        const data = await fs__WEBPACK_IMPORTED_MODULE_0__.promises.readFile(this.filePath);
        return new Blob([data], { type: this.headers.get('content-type') });
    }

    /**
     * Reads the contents of the file specified by the filePath property and returns a Promise that
     * resolves with a string containing the file's contents.
     * @returns {Promise<string>} A Promise that resolves with a string containing the file's contents.
     * @throws {Error} If the file cannot be read.
     */
    async text() {
        const data = await fs__WEBPACK_IMPORTED_MODULE_0__.promises.readFile(this.filePath, 'utf8');
        return data;
    }

    /**
     * Reads the contents of the file specified by the filePath property and returns a Promise that
     * resolves with a parsed JavaScript object containing the file's contents.
     * 
     * @returns {Promise<Object>} A Promise that resolves with a parsed JavaScript object containing the file's contents.
     * @throws {Error} If the file cannot be read.
     */
    async json() {
        return JSON.parse(await this.text());
    }
}

/**
 * Determines whether the given string is a valid URL.
 * @param {string|URL} string The string to test for validity as an URL.
 * @param {string[]} [protocols=null] A list of valid protocols. If specified, the protocol must be in this list.
 * @param {string[]} [validHosts=null] A list of valid hostnames. If specified, the URL's hostname must be in this list.
 * @returns {boolean} True if the string is a valid URL, false otherwise.
 */
function isValidUrl(string, protocols = null, validHosts = null) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    if (protocols && !protocols.includes(url.protocol)) {
        return false;
    }
    if (validHosts && !validHosts.includes(url.hostname)) {
        return false;
    }
    return true;
}

/**
 * Helper function to get a file, using either the Fetch API or FileSystem API.
 *
 * @param {URL|string} urlOrPath The URL/path of the file to get.
 * @returns {Promise<FileResponse|Response>} A promise that resolves to a FileResponse object (if the file is retrieved using the FileSystem API), or a Response object (if the file is retrieved using the Fetch API).
 */
async function getFile(urlOrPath) {

    if (_env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.useFS */ .O.useFS && !isValidUrl(urlOrPath, ['http:', 'https:', 'blob:'])) {
        return new FileResponse(urlOrPath);

    } else if (typeof process !== 'undefined' && process?.release?.name === 'node') {
        const IS_CI = !!process.env?.TESTING_REMOTELY;
        const version = _env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.version */ .O.version;

        const headers = new Headers();
        headers.set('User-Agent', `transformers.js/${version}; is_ci/${IS_CI};`);

        // Check whether we are making a request to the Hugging Face Hub.
        const isHFURL = isValidUrl(urlOrPath, ['http:', 'https:'], ['huggingface.co', 'hf.co']);
        if (isHFURL) {
            // If an access token is present in the environment variables,
            // we add it to the request headers.
            // NOTE: We keep `HF_ACCESS_TOKEN` for backwards compatibility (as a fallback).
            const token = process.env?.HF_TOKEN ?? process.env?.HF_ACCESS_TOKEN;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
        }
        return fetch(urlOrPath, { headers });
    } else {
        // Running in a browser-environment, so we use default headers
        // NOTE: We do not allow passing authorization headers in the browser,
        // since this would require exposing the token to the client.
        return fetch(urlOrPath);
    }
}

const ERROR_MAPPING = {
    // 4xx errors (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses)
    400: 'Bad request error occurred while trying to load file',
    401: 'Unauthorized access to file',
    403: 'Forbidden access to file',
    404: 'Could not locate file',
    408: 'Request timeout error occurred while trying to load file',

    // 5xx errors (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses)
    500: 'Internal server error error occurred while trying to load file',
    502: 'Bad gateway error occurred while trying to load file',
    503: 'Service unavailable error occurred while trying to load file',
    504: 'Gateway timeout error occurred while trying to load file',
}
/**
 * Helper method to handle fatal errors that occur while trying to load a file from the Hugging Face Hub.
 * @param {number} status The HTTP status code of the error.
 * @param {string} remoteURL The URL of the file that could not be loaded.
 * @param {boolean} fatal Whether to raise an error if the file could not be loaded.
 * @returns {null} Returns `null` if `fatal = true`.
 * @throws {Error} If `fatal = false`.
 */
function handleError(status, remoteURL, fatal) {
    if (!fatal) {
        // File was not loaded correctly, but it is optional.
        // TODO in future, cache the response?
        return null;
    }

    const message = ERROR_MAPPING[status] ?? `Error (${status}) occurred while trying to load file`;
    throw Error(`${message}: "${remoteURL}".`);
}

class FileCache {
    /**
     * Instantiate a `FileCache` object.
     * @param {string} path 
     */
    constructor(path) {
        this.path = path;
    }

    /**
     * Checks whether the given request is in the cache.
     * @param {string} request 
     * @returns {Promise<FileResponse | undefined>}
     */
    async match(request) {

        let filePath = path__WEBPACK_IMPORTED_MODULE_1__.join(this.path, request);
        let file = new FileResponse(filePath);

        if (file.exists) {
            return file;
        } else {
            return undefined;
        }
    }

    /**
     * Adds the given response to the cache.
     * @param {string} request 
     * @param {Response|FileResponse} response 
     * @returns {Promise<void>}
     */
    async put(request, response) {
        const buffer = Buffer.from(await response.arrayBuffer());

        let outputPath = path__WEBPACK_IMPORTED_MODULE_1__.join(this.path, request);

        try {
            await fs__WEBPACK_IMPORTED_MODULE_0__.promises.mkdir(path__WEBPACK_IMPORTED_MODULE_1__.dirname(outputPath), { recursive: true });
            await fs__WEBPACK_IMPORTED_MODULE_0__.promises.writeFile(outputPath, buffer);

        } catch (err) {
            console.warn('An error occurred while writing the file to cache:', err)
        }
    }

    // TODO add the rest?
    // addAll(requests: RequestInfo[]): Promise<void>;
    // delete(request: RequestInfo | URL, options?: CacheQueryOptions): Promise<boolean>;
    // keys(request?: RequestInfo | URL, options?: CacheQueryOptions): Promise<ReadonlyArray<Request>>;
    // match(request: RequestInfo | URL, options?: CacheQueryOptions): Promise<Response | undefined>;
    // matchAll(request?: RequestInfo | URL, options?: CacheQueryOptions): Promise<ReadonlyArray<Response>>;
}

/**
 * 
 * @param {FileCache|Cache} cache The cache to search
 * @param {string[]} names The names of the item to search for
 * @returns {Promise<FileResponse|Response|undefined>} The item from the cache, or undefined if not found.
 */
async function tryCache(cache, ...names) {
    for (let name of names) {
        try {
            let result = await cache.match(name);
            if (result) return result;
        } catch (e) {
            continue;
        }
    }
    return undefined;
}

/**
 * 
 * Retrieves a file from either a remote URL using the Fetch API or from the local file system using the FileSystem API.
 * If the filesystem is available and `env.useCache = true`, the file will be downloaded and cached.
 * 
 * @param {string} path_or_repo_id This can be either:
 * - a string, the *model id* of a model repo on huggingface.co.
 * - a path to a *directory* potentially containing the file.
 * @param {string} filename The name of the file to locate in `path_or_repo`.
 * @param {boolean} [fatal=true] Whether to throw an error if the file is not found.
 * @param {PretrainedOptions} [options] An object containing optional parameters.
 * 
 * @throws Will throw an error if the file is not found and `fatal` is true.
 * @returns {Promise} A Promise that resolves with the file content as a buffer.
 */
async function getModelFile(path_or_repo_id, filename, fatal = true, options = {}) {

    if (!_env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.allowLocalModels */ .O.allowLocalModels) {
        // User has disabled local models, so we just make sure other settings are correct.

        if (options.local_files_only) {
            throw Error("Invalid configuration detected: local models are disabled (`env.allowLocalModels=false`) but you have requested to only use local models (`local_files_only=true`).")
        } else if (!_env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.allowRemoteModels */ .O.allowRemoteModels) {
            throw Error("Invalid configuration detected: both local and remote models are disabled. Fix by setting `env.allowLocalModels` or `env.allowRemoteModels` to `true`.")
        }
    }

    // Initiate file retrieval
    (0,_core_js__WEBPACK_IMPORTED_MODULE_3__/* .dispatchCallback */ .T2)(options.progress_callback, {
        status: 'initiate',
        name: path_or_repo_id,
        file: filename
    })

    // First, check if the a caching backend is available
    // If no caching mechanism available, will download the file every time
    let cache;
    if (!cache && _env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.useBrowserCache */ .O.useBrowserCache) {
        if (typeof caches === 'undefined') {
            throw Error('Browser cache is not available in this environment.')
        }
        try {
            // In some cases, the browser cache may be visible, but not accessible due to security restrictions.
            // For example, when running an application in an iframe, if a user attempts to load the page in
            // incognito mode, the following error is thrown: `DOMException: Failed to execute 'open' on 'CacheStorage':
            // An attempt was made to break through the security policy of the user agent.`
            // So, instead of crashing, we just ignore the error and continue without using the cache.
            cache = await caches.open('transformers-cache');
        } catch (e) {
            console.warn('An error occurred while opening the browser cache:', e);
        }
    }

    if (!cache && _env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.useFSCache */ .O.useFSCache) {
        // TODO throw error if not available

        // If `cache_dir` is not specified, use the default cache directory
        cache = new FileCache(options.cache_dir ?? _env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.cacheDir */ .O.cacheDir);
    }

    if (!cache && _env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.useCustomCache */ .O.useCustomCache) {
        // Allow the user to specify a custom cache system.
        if (!_env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.customCache */ .O.customCache) {
            throw Error('`env.useCustomCache=true`, but `env.customCache` is not defined.')
        }

        // Check that the required methods are defined:
        if (!_env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.customCache.match */ .O.customCache.match || !_env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.customCache.put */ .O.customCache.put) {
            throw new Error(
                "`env.customCache` must be an object which implements the `match` and `put` functions of the Web Cache API. " +
                "For more information, see https://developer.mozilla.org/en-US/docs/Web/API/Cache"
            )
        }
        cache = _env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.customCache */ .O.customCache;
    }

    const revision = options.revision ?? 'main';

    let requestURL = pathJoin(path_or_repo_id, filename);
    let localPath = pathJoin(_env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.localModelPath */ .O.localModelPath, requestURL);

    let remoteURL = pathJoin(
        _env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.remoteHost */ .O.remoteHost,
        _env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.remotePathTemplate.replaceAll */ .O.remotePathTemplate.replaceAll('{model}', path_or_repo_id)
            .replaceAll('{revision}', encodeURIComponent(revision)),
        filename
    );

    // Choose cache key for filesystem cache
    // When using the main revision (default), we use the request URL as the cache key.
    // If a specific revision is requested, we account for this in the cache key.
    let fsCacheKey = revision === 'main' ? requestURL : pathJoin(path_or_repo_id, revision, filename);

    /** @type {string} */
    let cacheKey;
    let proposedCacheKey = cache instanceof FileCache ? fsCacheKey : remoteURL;

    // Whether to cache the final response in the end.
    let toCacheResponse = false;

    /** @type {Response|FileResponse|undefined} */
    let response;

    if (cache) {
        // A caching system is available, so we try to get the file from it.
        //  1. We first try to get from cache using the local path. In some environments (like deno),
        //     non-URL cache keys are not allowed. In these cases, `response` will be undefined.
        //  2. If no response is found, we try to get from cache using the remote URL or file system cache.
        response = await tryCache(cache, localPath, proposedCacheKey);
    }

    const cacheHit = response !== undefined;

    if (response === undefined) {
        // Caching not available, or file is not cached, so we perform the request

        if (_env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.allowLocalModels */ .O.allowLocalModels) {
            // Accessing local models is enabled, so we try to get the file locally.
            // If request is a valid HTTP URL, we skip the local file check. Otherwise, we try to get the file locally.
            const isURL = isValidUrl(requestURL, ['http:', 'https:']);
            if (!isURL) {
                try {
                    response = await getFile(localPath);
                    cacheKey = localPath; // Update the cache key to be the local path
                } catch (e) {
                    // Something went wrong while trying to get the file locally.
                    // NOTE: error handling is done in the next step (since `response` will be undefined)
                    console.warn(`Unable to load from local path "${localPath}": "${e}"`);
                }
            } else if (options.local_files_only) {
                throw new Error(`\`local_files_only=true\`, but attempted to load a remote file from: ${requestURL}.`);
            } else if (!_env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.allowRemoteModels */ .O.allowRemoteModels) {
                throw new Error(`\`env.allowRemoteModels=false\`, but attempted to load a remote file from: ${requestURL}.`);
            }
        }

        if (response === undefined || response.status === 404) {
            // File not found locally. This means either:
            // - The user has disabled local file access (`env.allowLocalModels=false`)
            // - the path is a valid HTTP url (`response === undefined`)
            // - the path is not a valid HTTP url and the file is not present on the file system or local server (`response.status === 404`)

            if (options.local_files_only || !_env_js__WEBPACK_IMPORTED_MODULE_2__/* .env.allowRemoteModels */ .O.allowRemoteModels) {
                // User requested local files only, but the file is not found locally.
                if (fatal) {
                    throw Error(`\`local_files_only=true\` or \`env.allowRemoteModels=false\` and file was not found locally at "${localPath}".`);
                } else {
                    // File not found, but this file is optional.
                    // TODO in future, cache the response?
                    return null;
                }
            }

            // File not found locally, so we try to download it from the remote server
            response = await getFile(remoteURL);

            if (response.status !== 200) {
                return handleError(response.status, remoteURL, fatal);
            }

            // Success! We use the proposed cache key from earlier
            cacheKey = proposedCacheKey;
        }

        // Only cache the response if:
        toCacheResponse =
            cache                              // 1. A caching system is available
            && typeof Response !== 'undefined' // 2. `Response` is defined (i.e., we are in a browser-like environment)
            && response instanceof Response    // 3. result is a `Response` object (i.e., not a `FileResponse`)
            && response.status === 200         // 4. request was successful (status code 200)
    }

    // Start downloading
    (0,_core_js__WEBPACK_IMPORTED_MODULE_3__/* .dispatchCallback */ .T2)(options.progress_callback, {
        status: 'download',
        name: path_or_repo_id,
        file: filename
    })

    const progressInfo = {
        status: 'progress',
        name: path_or_repo_id,
        file: filename
    }

    /** @type {Uint8Array} */
    let buffer;

    if (!options.progress_callback) {
        // If no progress callback is specified, we can use the `.arrayBuffer()`
        // method to read the response.
        buffer = new Uint8Array(await response.arrayBuffer());

    } else if (
        cacheHit // The item is being read from the cache
        &&
        typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent) // We are in Firefox
    ) {
        // Due to bug in Firefox, we cannot display progress when loading from cache.
        // Fortunately, since this should be instantaneous, this should not impact users too much.
        buffer = new Uint8Array(await response.arrayBuffer());

        // For completeness, we still fire the final progress callback
        (0,_core_js__WEBPACK_IMPORTED_MODULE_3__/* .dispatchCallback */ .T2)(options.progress_callback, {
            ...progressInfo,
            progress: 100,
            loaded: buffer.length,
            total: buffer.length,
        })
    } else {
        buffer = await readResponse(response, data => {
            (0,_core_js__WEBPACK_IMPORTED_MODULE_3__/* .dispatchCallback */ .T2)(options.progress_callback, {
                ...progressInfo,
                ...data,
            })
        })
    }

    if (
        // Only cache web responses
        // i.e., do not cache FileResponses (prevents duplication)
        toCacheResponse && cacheKey
        &&
        // Check again whether request is in cache. If not, we add the response to the cache
        (await cache.match(cacheKey) === undefined)
    ) {
        // NOTE: We use `new Response(buffer, ...)` instead of `response.clone()` to handle LFS files
        await cache.put(cacheKey, new Response(buffer, {
            headers: response.headers
        }))
            .catch(err => {
                // Do not crash if unable to add to cache (e.g., QuotaExceededError).
                // Rather, log a warning and proceed with execution.
                console.warn(`Unable to add response to browser cache: ${err}.`);
            });

    }

    (0,_core_js__WEBPACK_IMPORTED_MODULE_3__/* .dispatchCallback */ .T2)(options.progress_callback, {
        status: 'done',
        name: path_or_repo_id,
        file: filename
    });

    return buffer;
}

/**
 * Fetches a JSON file from a given path and file name.
 *
 * @param {string} modelPath The path to the directory containing the file.
 * @param {string} fileName The name of the file to fetch.
 * @param {boolean} [fatal=true] Whether to throw an error if the file is not found.
 * @param {PretrainedOptions} [options] An object containing optional parameters.
 * @returns {Promise<Object>} The JSON data parsed into a JavaScript object.
 * @throws Will throw an error if the file is not found and `fatal` is true.
 */
async function getModelJSON(modelPath, fileName, fatal = true, options = {}) {
    let buffer = await getModelFile(modelPath, fileName, fatal, options);
    if (buffer === null) {
        // Return empty object
        return {}
    }

    let decoder = new TextDecoder('utf-8');
    let jsonData = decoder.decode(buffer);

    return JSON.parse(jsonData);
}

/**
 * Read and track progress when reading a Response object
 *
 * @param {any} response The Response object to read
 * @param {function} progress_callback The function to call with progress updates
 * @returns {Promise<Uint8Array>} A Promise that resolves with the Uint8Array buffer
 */
async function readResponse(response, progress_callback) {

    const contentLength = response.headers.get('Content-Length');
    if (contentLength === null) {
        console.warn('Unable to determine content-length from response headers. Will expand buffer when needed.')
    }
    let total = parseInt(contentLength ?? '0');
    let buffer = new Uint8Array(total);
    let loaded = 0;

    const reader = response.body.getReader();
    async function read() {
        const { done, value } = await reader.read();
        if (done) return;

        let newLoaded = loaded + value.length;
        if (newLoaded > total) {
            total = newLoaded;

            // Adding the new data will overflow buffer.
            // In this case, we extend the buffer
            let newBuffer = new Uint8Array(total);

            // copy contents
            newBuffer.set(buffer);

            buffer = newBuffer;
        }
        buffer.set(value, loaded)
        loaded = newLoaded;

        const progress = (loaded / total) * 100;

        // Call your function here
        progress_callback({
            progress: progress,
            loaded: loaded,
            total: total,
        })

        return read();
    }

    // Actually read
    await read();

    return buffer;
}

/**
 * Joins multiple parts of a path into a single path, while handling leading and trailing slashes.
 *
 * @param {...string} parts Multiple parts of a path.
 * @returns {string} A string representing the joined path.
 */
function pathJoin(...parts) {
    // https://stackoverflow.com/a/55142565
    parts = parts.map((part, index) => {
        if (index) {
            part = part.replace(new RegExp('^/'), '');
        }
        if (index !== parts.length - 1) {
            part = part.replace(new RegExp('/$'), '');
        }
        return part;
    })
    return parts.join('/');
}


/***/ }),

/***/ 365:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AK": function() { return /* binding */ dot; },
/* harmony export */   "CI": function() { return /* binding */ log_softmax; },
/* harmony export */   "Dx": function() { return /* binding */ cos_sim; },
/* harmony export */   "Fp": function() { return /* binding */ max; },
/* harmony export */   "NM": function() { return /* binding */ round; },
/* harmony export */   "Nq": function() { return /* binding */ interpolate_data; },
/* harmony export */   "VE": function() { return /* binding */ magnitude; },
/* harmony export */   "VV": function() { return /* binding */ min; },
/* harmony export */   "XA": function() { return /* binding */ softmax; },
/* harmony export */   "eT": function() { return /* binding */ bankers_round; },
/* harmony export */   "em": function() { return /* binding */ getTopItems; },
/* harmony export */   "nu": function() { return /* binding */ permute_data; },
/* harmony export */   "qC": function() { return /* binding */ medianFilter; },
/* harmony export */   "vw": function() { return /* binding */ FFT; }
/* harmony export */ });

/**
 * @file Helper module for mathematical processing. 
 * 
 * These functions and classes are only used internally, 
 * meaning an end-user shouldn't need to access anything here.
 * 
 * @module utils/maths
 */

/**
 * @typedef {Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array} TypedArray
 * @typedef {BigInt64Array | BigUint64Array} BigTypedArray
 * @typedef {TypedArray | BigTypedArray} AnyTypedArray
 */

/**
 * @param {TypedArray} input
 */
function interpolate_data(input, [in_channels, in_height, in_width], [out_height, out_width], mode = 'bilinear', align_corners = false) {
    // TODO use mode and align_corners

    // Output image dimensions
    const x_scale = out_width / in_width;
    const y_scale = out_height / in_height;

    // Output image
    // @ts-ignore
    const out_img = new input.constructor(out_height * out_width * in_channels);

    // Pre-calculate strides
    const inStride = in_height * in_width;
    const outStride = out_height * out_width;

    for (let i = 0; i < out_height; ++i) {
        for (let j = 0; j < out_width; ++j) {
            // Calculate output offset
            const outOffset = i * out_width + j;

            // Calculate input pixel coordinates
            const x = (j + 0.5) / x_scale - 0.5;
            const y = (i + 0.5) / y_scale - 0.5;

            // Calculate the four nearest input pixels
            // We also check if the input pixel coordinates are within the image bounds
            let x1 = Math.floor(x);
            let y1 = Math.floor(y);
            const x2 = Math.min(x1 + 1, in_width - 1);
            const y2 = Math.min(y1 + 1, in_height - 1);

            x1 = Math.max(x1, 0);
            y1 = Math.max(y1, 0);


            // Calculate the fractional distances between the input pixel and the four nearest pixels
            const s = x - x1;
            const t = y - y1;

            // Perform bilinear interpolation
            const w1 = (1 - s) * (1 - t);
            const w2 = s * (1 - t);
            const w3 = (1 - s) * t;
            const w4 = s * t;

            // Calculate the four nearest input pixel indices
            const yStride = y1 * in_width;
            const xStride = y2 * in_width;
            const idx1 = yStride + x1;
            const idx2 = yStride + x2;
            const idx3 = xStride + x1;
            const idx4 = xStride + x2;

            for (let k = 0; k < in_channels; ++k) {
                // Calculate channel offset
                const cOffset = k * inStride;

                out_img[k * outStride + outOffset] =
                    w1 * input[cOffset + idx1] +
                    w2 * input[cOffset + idx2] +
                    w3 * input[cOffset + idx3] +
                    w4 * input[cOffset + idx4];
            }
        }
    }

    return out_img;
}


/**
 * Helper method to permute a `AnyTypedArray` directly
 * @template {AnyTypedArray} T 
 * @param {T} array 
 * @param {number[]} dims 
 * @param {number[]} axes 
 * @returns {[T, number[]]} The permuted array and the new shape.
 */
function permute_data(array, dims, axes) {
    // Calculate the new shape of the permuted array
    // and the stride of the original array
    const shape = new Array(axes.length);
    const stride = new Array(axes.length);

    for (let i = axes.length - 1, s = 1; i >= 0; --i) {
        stride[i] = s;
        shape[i] = dims[axes[i]];
        s *= shape[i];
    }

    // Precompute inverse mapping of stride
    const invStride = axes.map((_, i) => stride[axes.indexOf(i)]);

    // Create the permuted array with the new shape
    // @ts-ignore
    const permutedData = new array.constructor(array.length);

    // Permute the original array to the new array
    for (let i = 0; i < array.length; ++i) {
        let newIndex = 0;
        for (let j = dims.length - 1, k = i; j >= 0; --j) {
            newIndex += (k % dims[j]) * invStride[j];
            k = Math.floor(k / dims[j]);
        }
        permutedData[newIndex] = array[i];
    }

    return [permutedData, shape];
}


/**
 * Compute the softmax of an array of numbers.
 * @template {TypedArray|number[]} T
 * @param {T} arr The array of numbers to compute the softmax of.
 * @returns {T} The softmax array.
 */
function softmax(arr) {
    // Compute the maximum value in the array
    const maxVal = max(arr)[0];

    // Compute the exponentials of the array values
    const exps = arr.map(x => Math.exp(x - maxVal));

    // Compute the sum of the exponentials
    // @ts-ignore
    const sumExps = exps.reduce((acc, val) => acc + val, 0);

    // Compute the softmax values
    const softmaxArr = exps.map(x => x / sumExps);

    return /** @type {T} */(softmaxArr);
}

/**
 * Calculates the logarithm of the softmax function for the input array.
 * @template {TypedArray|number[]} T
 * @param {T} arr The input array to calculate the log_softmax function for.
 * @returns {T} The resulting log_softmax array.
 */
function log_softmax(arr) {
    // Compute the softmax values
    const softmaxArr = softmax(arr);

    // Apply log formula to each element
    const logSoftmaxArr = softmaxArr.map(x => Math.log(x));

    return /** @type {T} */(logSoftmaxArr);
}

/**
 * Calculates the dot product of two arrays.
 * @param {number[]} arr1 The first array.
 * @param {number[]} arr2 The second array.
 * @returns {number} The dot product of arr1 and arr2.
 */
function dot(arr1, arr2) {
    let result = 0;
    for (let i = 0; i < arr1.length; ++i) {
        result += arr1[i] * arr2[i];
    }
    return result;
}


/**
 * Get the top k items from an iterable, sorted by descending order
 * @param {any[]|TypedArray} items The items to be sorted
 * @param {number|null} [top_k=0] The number of top items to return (default: 0 = return all)
 * @returns {[number, any][]} The top k items, sorted by descending order
 */
function getTopItems(items, top_k = 0) {
    // if top == 0, return all

    items = Array.from(items)
        .map((x, i) => [i, x])            // Get indices ([index, score])
        .sort((a, b) => b[1] - a[1])      // Sort by log probabilities

    if (top_k !== null && top_k > 0) {
        items = items.slice(0, top_k);    // Get top k items
    }

    return items
}

/**
 * Computes the cosine similarity between two arrays.
 *
 * @param {number[]} arr1 The first array.
 * @param {number[]} arr2 The second array.
 * @returns {number} The cosine similarity between the two arrays.
 */
function cos_sim(arr1, arr2) {
    // Calculate dot product of the two arrays
    const dotProduct = dot(arr1, arr2);

    // Calculate the magnitude of the first array
    const magnitudeA = magnitude(arr1);

    // Calculate the magnitude of the second array
    const magnitudeB = magnitude(arr2);

    // Calculate the cosine similarity
    const cosineSimilarity = dotProduct / (magnitudeA * magnitudeB);

    return cosineSimilarity;
}

/**
 * Calculates the magnitude of a given array.
 * @param {number[]} arr The array to calculate the magnitude of.
 * @returns {number} The magnitude of the array.
 */
function magnitude(arr) {
    return Math.sqrt(arr.reduce((acc, val) => acc + val * val, 0));
}


/**
 * Returns the value and index of the minimum element in an array.
 * @param {number[]|TypedArray} arr array of numbers.
 * @returns {number[]} the value and index of the minimum element, of the form: [valueOfMin, indexOfMin]
 * @throws {Error} If array is empty.
 */
function min(arr) {
    if (arr.length === 0) throw Error('Array must not be empty');
    let min = arr[0];
    let indexOfMin = 0;
    for (let i = 1; i < arr.length; ++i) {
        if (arr[i] < min) {
            min = arr[i];
            indexOfMin = i;
        }
    }
    return [min, indexOfMin];
}


/**
 * Returns the value and index of the maximum element in an array.
 * @param {number[]|AnyTypedArray} arr array of numbers.
 * @returns {[number, number]} the value and index of the maximum element, of the form: [valueOfMax, indexOfMax]
 * @throws {Error} If array is empty.
 */
function max(arr) {
    if (arr.length === 0) throw Error('Array must not be empty');
    let max = arr[0];
    let indexOfMax = 0;
    for (let i = 1; i < arr.length; ++i) {
        if (arr[i] > max) {
            max = arr[i];
            indexOfMax = i;
        }
    }
    return [Number(max), indexOfMax];
}

function isPowerOfTwo(number) {
    // Check if the number is greater than 0 and has only one bit set to 1
    return (number > 0) && ((number & (number - 1)) === 0);
}

/**
 * Implementation of Radix-4 FFT.
 * 
 * P2FFT class provides functionality for performing Fast Fourier Transform on arrays
 * which are a power of two in length.
 * Code adapted from https://www.npmjs.com/package/fft.js
 */
class P2FFT {
    /**
     * @param {number} size The size of the input array. Must be a power of two larger than 1.
     * @throws {Error} FFT size must be a power of two larger than 1.
     */
    constructor(size) {
        this.size = size | 0; // convert to a 32-bit signed integer
        if (this.size <= 1 || !isPowerOfTwo(this.size))
            throw new Error('FFT size must be a power of two larger than 1');

        this._csize = size << 1;

        this.table = new Float64Array(this.size * 2);
        for (let i = 0; i < this.table.length; i += 2) {
            const angle = Math.PI * i / this.size;
            this.table[i] = Math.cos(angle);
            this.table[i + 1] = -Math.sin(angle);
        }

        // Find size's power of two
        let power = 0;
        for (let t = 1; this.size > t; t <<= 1)
            ++power;

        // Calculate initial step's width:
        //   * If we are full radix-4, it is 2x smaller to give inital len=8
        //   * Otherwise it is the same as `power` to give len=4
        this._width = power % 2 === 0 ? power - 1 : power;

        // Pre-compute bit-reversal patterns
        this._bitrev = new Int32Array(1 << this._width);
        for (let j = 0; j < this._bitrev.length; ++j) {
            this._bitrev[j] = 0;
            for (let shift = 0; shift < this._width; shift += 2) {
                const revShift = this._width - shift - 2;
                this._bitrev[j] |= ((j >>> shift) & 3) << revShift;
            }
        }
    }

    /**
     * Create a complex number array with size `2 * size`
     *
     * @returns {Float64Array} A complex number array with size `2 * size`
     */
    createComplexArray() {
        return new Float64Array(this._csize);
    }

    /**
     * Converts a complex number representation stored in a Float64Array to an array of real numbers.
     * 
     * @param {Float64Array} complex The complex number representation to be converted.
     * @param {number[]} [storage] An optional array to store the result in.
     * @returns {number[]} An array of real numbers representing the input complex number representation.
     */
    fromComplexArray(complex, storage) {
        const res = storage || new Array(complex.length >>> 1);
        for (let i = 0; i < complex.length; i += 2)
            res[i >>> 1] = complex[i];
        return res;
    }

    /**
     * Convert a real-valued input array to a complex-valued output array.
     * @param {Float64Array} input The real-valued input array.
     * @param {Float64Array} [storage] Optional buffer to store the output array.
     * @returns {Float64Array} The complex-valued output array.
     */
    toComplexArray(input, storage) {
        const res = storage || this.createComplexArray();
        for (let i = 0; i < res.length; i += 2) {
            res[i] = input[i >>> 1];
            res[i + 1] = 0;
        }
        return res;
    }

    /**
     * Performs a Fast Fourier Transform (FFT) on the given input data and stores the result in the output buffer.
     * 
     * @param {Float64Array} out The output buffer to store the result.
     * @param {Float64Array} data The input data to transform.
     * 
     * @throws {Error} Input and output buffers must be different.
     * 
     * @returns {void}
     */
    transform(out, data) {
        if (out === data)
            throw new Error('Input and output buffers must be different');

        this._transform4(out, data, 1 /* DONE */);
    }

    /**
     * Performs a real-valued forward FFT on the given input buffer and stores the result in the given output buffer.
     * The input buffer must contain real values only, while the output buffer will contain complex values. The input and
     * output buffers must be different.
     *
     * @param {Float64Array} out The output buffer.
     * @param {Float64Array} data The input buffer containing real values.
     *
     * @throws {Error} If the input and output buffers are the same.
     */
    realTransform(out, data) {
        if (out === data)
            throw new Error('Input and output buffers must be different');

        this._realTransform4(out, data, 1 /* DONE */);
    }

    /**
     * Performs an inverse FFT transformation on the given `data` array, and stores the result in `out`.
     * The `out` array must be a different buffer than the `data` array. The `out` array will contain the
     * result of the transformation. The `data` array will not be modified.
     * 
     * @param {Float64Array} out The output buffer for the transformed data.
     * @param {Float64Array} data The input data to transform.
     * @throws {Error} If `out` and `data` refer to the same buffer.
     * @returns {void}
     */
    inverseTransform(out, data) {
        if (out === data)
            throw new Error('Input and output buffers must be different');

        this._transform4(out, data, -1 /* DONE */);
        for (let i = 0; i < out.length; ++i)
            out[i] /= this.size;
    }

    /**
     * Performs a radix-4 implementation of a discrete Fourier transform on a given set of data.
     *
     * @param {Float64Array} out The output buffer for the transformed data.
     * @param {Float64Array} data The input buffer of data to be transformed.
     * @param {number} inv A scaling factor to apply to the transform.
     * @returns {void}
     */
    _transform4(out, data, inv) {
        // radix-4 implementation

        const size = this._csize;

        // Initial step (permute and transform)
        const width = this._width;
        let step = 1 << width;
        let len = (size / step) << 1;

        let outOff;
        let t;
        const bitrev = this._bitrev;
        if (len === 4) {
            for (outOff = 0, t = 0; outOff < size; outOff += len, ++t) {
                const off = bitrev[t];
                this._singleTransform2(data, out, outOff, off, step);
            }
        } else {
            // len === 8
            for (outOff = 0, t = 0; outOff < size; outOff += len, ++t) {
                const off = bitrev[t];
                this._singleTransform4(data, out, outOff, off, step, inv);
            }
        }

        // Loop through steps in decreasing order
        const table = this.table;
        for (step >>= 2; step >= 2; step >>= 2) {
            len = (size / step) << 1;
            const quarterLen = len >>> 2;

            // Loop through offsets in the data
            for (outOff = 0; outOff < size; outOff += len) {
                // Full case
                const limit = outOff + quarterLen - 1;
                for (let i = outOff, k = 0; i < limit; i += 2, k += step) {
                    const A = i;
                    const B = A + quarterLen;
                    const C = B + quarterLen;
                    const D = C + quarterLen;

                    // Original values
                    const Ar = out[A];
                    const Ai = out[A + 1];
                    const Br = out[B];
                    const Bi = out[B + 1];
                    const Cr = out[C];
                    const Ci = out[C + 1];
                    const Dr = out[D];
                    const Di = out[D + 1];

                    const tableBr = table[k];
                    const tableBi = inv * table[k + 1];
                    const MBr = Br * tableBr - Bi * tableBi;
                    const MBi = Br * tableBi + Bi * tableBr;

                    const tableCr = table[2 * k];
                    const tableCi = inv * table[2 * k + 1];
                    const MCr = Cr * tableCr - Ci * tableCi;
                    const MCi = Cr * tableCi + Ci * tableCr;

                    const tableDr = table[3 * k];
                    const tableDi = inv * table[3 * k + 1];
                    const MDr = Dr * tableDr - Di * tableDi;
                    const MDi = Dr * tableDi + Di * tableDr;

                    // Pre-Final values
                    const T0r = Ar + MCr;
                    const T0i = Ai + MCi;
                    const T1r = Ar - MCr;
                    const T1i = Ai - MCi;
                    const T2r = MBr + MDr;
                    const T2i = MBi + MDi;
                    const T3r = inv * (MBr - MDr);
                    const T3i = inv * (MBi - MDi);

                    // Final values
                    out[A] = T0r + T2r;
                    out[A + 1] = T0i + T2i;
                    out[B] = T1r + T3i;
                    out[B + 1] = T1i - T3r;
                    out[C] = T0r - T2r;
                    out[C + 1] = T0i - T2i;
                    out[D] = T1r - T3i;
                    out[D + 1] = T1i + T3r;
                }
            }
        }
    }

    /**
     * Performs a radix-2 implementation of a discrete Fourier transform on a given set of data.
     *
     * @param {Float64Array} data The input buffer of data to be transformed.
     * @param {Float64Array} out The output buffer for the transformed data.
     * @param {number} outOff The offset at which to write the output data.
     * @param {number} off The offset at which to begin reading the input data.
     * @param {number} step The step size for indexing the input data.
     * @returns {void}
     */
    _singleTransform2(data, out, outOff, off, step) {
        // radix-2 implementation
        // NOTE: Only called for len=4

        const evenR = data[off];
        const evenI = data[off + 1];
        const oddR = data[off + step];
        const oddI = data[off + step + 1];

        out[outOff] = evenR + oddR;
        out[outOff + 1] = evenI + oddI;
        out[outOff + 2] = evenR - oddR;
        out[outOff + 3] = evenI - oddI;
    }

    /**
     * Performs radix-4 transformation on input data of length 8
     *
     * @param {Float64Array} data Input data array of length 8
     * @param {Float64Array} out Output data array of length 8
     * @param {number} outOff Index of output array to start writing from
     * @param {number} off Index of input array to start reading from
     * @param {number} step Step size between elements in input array
     * @param {number} inv Scaling factor for inverse transform
     * 
     * @returns {void}
     */
    _singleTransform4(data, out, outOff, off, step, inv) {
        // radix-4
        // NOTE: Only called for len=8
        const step2 = step * 2;
        const step3 = step * 3;

        // Original values
        const Ar = data[off];
        const Ai = data[off + 1];
        const Br = data[off + step];
        const Bi = data[off + step + 1];
        const Cr = data[off + step2];
        const Ci = data[off + step2 + 1];
        const Dr = data[off + step3];
        const Di = data[off + step3 + 1];

        // Pre-Final values
        const T0r = Ar + Cr;
        const T0i = Ai + Ci;
        const T1r = Ar - Cr;
        const T1i = Ai - Ci;
        const T2r = Br + Dr;
        const T2i = Bi + Di;
        const T3r = inv * (Br - Dr);
        const T3i = inv * (Bi - Di);

        // Final values
        out[outOff] = T0r + T2r;
        out[outOff + 1] = T0i + T2i;
        out[outOff + 2] = T1r + T3i;
        out[outOff + 3] = T1i - T3r;
        out[outOff + 4] = T0r - T2r;
        out[outOff + 5] = T0i - T2i;
        out[outOff + 6] = T1r - T3i;
        out[outOff + 7] = T1i + T3r;
    }

    /**
     * Real input radix-4 implementation
     * @param {Float64Array} out Output array for the transformed data
     * @param {Float64Array} data Input array of real data to be transformed
     * @param {number} inv The scale factor used to normalize the inverse transform
     */
    _realTransform4(out, data, inv) {
        // Real input radix-4 implementation
        const size = this._csize;

        // Initial step (permute and transform)
        const width = this._width;
        let step = 1 << width;
        let len = (size / step) << 1;

        let outOff;
        let t;
        const bitrev = this._bitrev;
        if (len === 4) {
            for (outOff = 0, t = 0; outOff < size; outOff += len, ++t) {
                const off = bitrev[t];
                this._singleRealTransform2(data, out, outOff, off >>> 1, step >>> 1);
            }
        } else {
            // len === 8
            for (outOff = 0, t = 0; outOff < size; outOff += len, ++t) {
                const off = bitrev[t];
                this._singleRealTransform4(data, out, outOff, off >>> 1, step >>> 1, inv);
            }
        }

        // Loop through steps in decreasing order
        const table = this.table;
        for (step >>= 2; step >= 2; step >>= 2) {
            len = (size / step) << 1;
            const halfLen = len >>> 1;
            const quarterLen = halfLen >>> 1;
            const hquarterLen = quarterLen >>> 1;

            // Loop through offsets in the data
            for (outOff = 0; outOff < size; outOff += len) {
                for (let i = 0, k = 0; i <= hquarterLen; i += 2, k += step) {
                    const A = outOff + i;
                    const B = A + quarterLen;
                    const C = B + quarterLen;
                    const D = C + quarterLen;

                    // Original values
                    const Ar = out[A];
                    const Ai = out[A + 1];
                    const Br = out[B];
                    const Bi = out[B + 1];
                    const Cr = out[C];
                    const Ci = out[C + 1];
                    const Dr = out[D];
                    const Di = out[D + 1];

                    // Middle values
                    const MAr = Ar;
                    const MAi = Ai;

                    const tableBr = table[k];
                    const tableBi = inv * table[k + 1];
                    const MBr = Br * tableBr - Bi * tableBi;
                    const MBi = Br * tableBi + Bi * tableBr;

                    const tableCr = table[2 * k];
                    const tableCi = inv * table[2 * k + 1];
                    const MCr = Cr * tableCr - Ci * tableCi;
                    const MCi = Cr * tableCi + Ci * tableCr;

                    const tableDr = table[3 * k];
                    const tableDi = inv * table[3 * k + 1];
                    const MDr = Dr * tableDr - Di * tableDi;
                    const MDi = Dr * tableDi + Di * tableDr;

                    // Pre-Final values
                    const T0r = MAr + MCr;
                    const T0i = MAi + MCi;
                    const T1r = MAr - MCr;
                    const T1i = MAi - MCi;
                    const T2r = MBr + MDr;
                    const T2i = MBi + MDi;
                    const T3r = inv * (MBr - MDr);
                    const T3i = inv * (MBi - MDi);

                    // Final values
                    out[A] = T0r + T2r;
                    out[A + 1] = T0i + T2i;
                    out[B] = T1r + T3i;
                    out[B + 1] = T1i - T3r;

                    // Output final middle point
                    if (i === 0) {
                        out[C] = T0r - T2r;
                        out[C + 1] = T0i - T2i;
                        continue;
                    }

                    // Do not overwrite ourselves
                    if (i === hquarterLen)
                        continue;

                    const SA = outOff + quarterLen - i;
                    const SB = outOff + halfLen - i;

                    out[SA] = T1r - inv * T3i;
                    out[SA + 1] = -T1i - inv * T3r;
                    out[SB] = T0r - inv * T2r;
                    out[SB + 1] = -T0i + inv * T2i;
                }
            }
        }

        // Complete the spectrum by adding its mirrored negative frequency components.
        const half = size >>> 1;
        for (let i = 2; i < half; i += 2) {
            out[size - i] = out[i];
            out[size - i + 1] = -out[i + 1];
        }
    }

    /**
     * Performs a single real input radix-2 transformation on the provided data
     * 
     * @param {Float64Array} data The input data array
     * @param {Float64Array} out The output data array
     * @param {number} outOff The output offset
     * @param {number} off The input offset
     * @param {number} step The step
     * 
     * @returns {void}
     */
    _singleRealTransform2(data, out, outOff, off, step) {
        // radix-2 implementation
        // NOTE: Only called for len=4

        const evenR = data[off];
        const oddR = data[off + step];

        out[outOff] = evenR + oddR;
        out[outOff + 1] = 0;
        out[outOff + 2] = evenR - oddR;
        out[outOff + 3] = 0;
    }

    /**
     * Computes a single real-valued transform using radix-4 algorithm.
     * This method is only called for len=8.
     *
     * @param {Float64Array} data The input data array.
     * @param {Float64Array} out The output data array.
     * @param {number} outOff The offset into the output array.
     * @param {number} off The offset into the input array.
     * @param {number} step The step size for the input array.
     * @param {number} inv The value of inverse.
     */
    _singleRealTransform4(data, out, outOff, off, step, inv) {
        // radix-4
        // NOTE: Only called for len=8
        const step2 = step * 2;
        const step3 = step * 3;

        // Original values
        const Ar = data[off];
        const Br = data[off + step];
        const Cr = data[off + step2];
        const Dr = data[off + step3];

        // Pre-Final values
        const T0r = Ar + Cr;
        const T1r = Ar - Cr;
        const T2r = Br + Dr;
        const T3r = inv * (Br - Dr);

        // Final values
        out[outOff] = T0r + T2r;
        out[outOff + 1] = 0;
        out[outOff + 2] = T1r;
        out[outOff + 3] = -T3r;
        out[outOff + 4] = T0r - T2r;
        out[outOff + 5] = 0;
        out[outOff + 6] = T1r;
        out[outOff + 7] = T3r;
    }
}

/**
 * NP2FFT class provides functionality for performing Fast Fourier Transform on arrays
 * which are not a power of two in length. In such cases, the chirp-z transform is used.
 * 
 * For more information, see: https://math.stackexchange.com/questions/77118/non-power-of-2-ffts/77156#77156
 */
class NP2FFT {

    /**
     * Constructs a new NP2FFT object.
     * @param {number} fft_length The length of the FFT
     */
    constructor(fft_length) {
        // Helper variables
        const a = 2 * (fft_length - 1);
        const b = 2 * (2 * fft_length - 1);
        const nextP2 = 2 ** (Math.ceil(Math.log2(b)))
        this.bufferSize = nextP2;
        this._a = a;

        // Define buffers
        // Compute chirp for transform
        const chirp = new Float64Array(b);
        const ichirp = new Float64Array(nextP2);
        this._chirpBuffer = new Float64Array(nextP2);
        this._buffer1 = new Float64Array(nextP2);
        this._buffer2 = new Float64Array(nextP2);
        this._outBuffer1 = new Float64Array(nextP2);
        this._outBuffer2 = new Float64Array(nextP2);

        // Compute complex exponentiation
        const theta = -2 * Math.PI / fft_length;
        const baseR = Math.cos(theta);
        const baseI = Math.sin(theta);

        // Precompute helper for chirp-z transform
        for (let i = 0; i < b >> 1; ++i) {
            // Compute complex power:
            const e = (i + 1 - fft_length) ** 2 / 2.0;

            // Compute the modulus and argument of the result
            const result_mod = Math.sqrt(baseR ** 2 + baseI ** 2) ** e;
            const result_arg = e * Math.atan2(baseI, baseR);

            // Convert the result back to rectangular form
            // and assign to chirp and ichirp
            const i2 = 2 * i;
            chirp[i2] = result_mod * Math.cos(result_arg);
            chirp[i2 + 1] = result_mod * Math.sin(result_arg);

            // conjugate
            ichirp[i2] = chirp[i2];
            ichirp[i2 + 1] = - chirp[i2 + 1];
        }
        this._slicedChirpBuffer = chirp.subarray(a, b);

        // create object to perform Fast Fourier Transforms
        // with `nextP2` complex numbers
        this._f = new P2FFT(nextP2 >> 1);
        this._f.transform(this._chirpBuffer, ichirp);
    }

    _transform(output, input, real) {
        const ib1 = this._buffer1;
        const ib2 = this._buffer2;
        const ob2 = this._outBuffer1;
        const ob3 = this._outBuffer2;
        const cb = this._chirpBuffer;
        const sb = this._slicedChirpBuffer;
        const a = this._a;

        if (real) {
            // Real multiplication
            for (let j = 0; j < sb.length; j += 2) {
                const j2 = j + 1
                const j3 = j >> 1;

                const a_real = input[j3];
                ib1[j] = a_real * sb[j];
                ib1[j2] = a_real * sb[j2];
            }
        } else {
            // Complex multiplication
            for (let j = 0; j < sb.length; j += 2) {
                const j2 = j + 1
                ib1[j] = input[j] * sb[j] - input[j2] * sb[j2];
                ib1[j2] = input[j] * sb[j2] + input[j2] * sb[j];
            }
        }
        this._f.transform(ob2, ib1);

        for (let j = 0; j < cb.length; j += 2) {
            const j2 = j + 1;

            ib2[j] = ob2[j] * cb[j] - ob2[j2] * cb[j2];
            ib2[j2] = ob2[j] * cb[j2] + ob2[j2] * cb[j];
        }
        this._f.inverseTransform(ob3, ib2);

        for (let j = 0; j < ob3.length; j += 2) {
            const a_real = ob3[j + a];
            const a_imag = ob3[j + a + 1];
            const b_real = sb[j];
            const b_imag = sb[j + 1];

            output[j] = a_real * b_real - a_imag * b_imag;
            output[j + 1] = a_real * b_imag + a_imag * b_real;
        }
    }

    transform(output, input) {
        this._transform(output, input, false);
    }

    realTransform(output, input) {
        this._transform(output, input, true);
    }
}

class FFT {
    constructor(fft_length) {
        this.fft_length = fft_length;
        this.isPowerOfTwo = isPowerOfTwo(fft_length);
        if (this.isPowerOfTwo) {
            this.fft = new P2FFT(fft_length);
            this.outputBufferSize = 2 * fft_length;
        } else {
            this.fft = new NP2FFT(fft_length);
            this.outputBufferSize = this.fft.bufferSize;
        }
    }

    realTransform(out, input) {
        this.fft.realTransform(out, input);
    }

    transform(out, input) {
        this.fft.transform(out, input);
    }
}


/**
 * Performs median filter on the provided data. Padding is done by mirroring the data.
 * @param {AnyTypedArray} data The input array
 * @param {number} windowSize The window size
 */
function medianFilter(data, windowSize) {

    if (windowSize % 2 === 0 || windowSize <= 0) {
        throw new Error('Window size must be a positive odd number');
    }

    // @ts-ignore
    const outputArray = new data.constructor(data.length);

    // @ts-ignore
    const buffer = new data.constructor(windowSize); // Reusable array for storing values

    const halfWindowSize = Math.floor(windowSize / 2);

    for (let i = 0; i < data.length; ++i) {
        let valuesIndex = 0;

        for (let j = -halfWindowSize; j <= halfWindowSize; ++j) {
            let index = i + j;
            if (index < 0) {
                index = Math.abs(index);
            } else if (index >= data.length) {
                index = 2 * (data.length - 1) - index;
            }

            buffer[valuesIndex++] = data[index];
        }

        buffer.sort();
        outputArray[i] = buffer[halfWindowSize];
    }

    return outputArray;
}

/**
 * Helper function to round a number to a given number of decimals
 * @param {number} num The number to round
 * @param {number} decimals The number of decimals
 * @returns {number} The rounded number
 */
function round(num, decimals) {
    const pow = Math.pow(10, decimals);
    return Math.round(num * pow) / pow;
}

/**
 * Helper function to round a number to the nearest integer, with ties rounded to the nearest even number.
 * Also known as "bankers' rounding". This is the default rounding mode in python. For example:
 * 1.5 rounds to 2 and 2.5 rounds to 2.
 * 
 * @param {number} x The number to round
 * @returns {number} The rounded number
 */
function bankers_round(x) {
    const r = Math.round(x);
    const br = Math.abs(x) % 1 === 0.5 ? (r % 2 === 0 ? r : r - 1) : r;
    return br;
}


/***/ }),

/***/ 2672:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FO": function() { return /* binding */ permute; },
/* harmony export */   "J6": function() { return /* binding */ mean; },
/* harmony export */   "K3": function() { return /* binding */ layer_norm; },
/* harmony export */   "Ks": function() { return /* binding */ dynamicTimeWarping; },
/* harmony export */   "d3": function() { return /* binding */ cat; },
/* harmony export */   "e": function() { return /* binding */ quantize_embeddings; },
/* harmony export */   "es": function() { return /* binding */ Tensor; },
/* harmony export */   "f3": function() { return /* binding */ std_mean; },
/* harmony export */   "iU": function() { return /* binding */ ones; },
/* harmony export */   "kn": function() { return /* binding */ stack; },
/* harmony export */   "r6": function() { return /* binding */ ones_like; },
/* harmony export */   "sX": function() { return /* binding */ interpolate; },
/* harmony export */   "v6": function() { return /* binding */ mean_pooling; }
/* harmony export */ });
/* harmony import */ var _backends_onnx_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9358);
/* harmony import */ var _maths_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(365);
/**
 * @file Helper module for `Tensor` processing.
 * 
 * These functions and classes are only used internally, 
 * meaning an end-user shouldn't need to access anything here.
 * 
 * @module utils/tensor
 */






const DataTypeMap = Object.freeze({
    float32: Float32Array,
    float64: Float64Array,
    string: Array, // string[]
    int8: Int8Array,
    uint8: Uint8Array,
    int16: Int16Array,
    uint16: Uint16Array,
    int32: Int32Array,
    uint32: Uint32Array,
    int64: BigInt64Array,
    uint64: BigUint64Array,
    bool: Uint8Array,
});

/**
 * @typedef {keyof typeof DataTypeMap} DataType
 * @typedef {import('./maths.js').AnyTypedArray | any[]} DataArray
 */

const ONNXTensor = _backends_onnx_js__WEBPACK_IMPORTED_MODULE_0__/* .ONNX.Tensor */ .V.Tensor;

class Tensor {
    /** @type {number[]} Dimensions of the tensor. */
    dims;

    /** @type {DataType} Type of the tensor. */
    type;

    /** @type {DataArray} The data stored in the tensor. */
    data;

    /** @type {number} The number of elements in the tensor. */
    size;

    /**
     * Create a new Tensor or copy an existing Tensor.
     * @param {[DataType, DataArray, number[]]|[import('onnxruntime-common').Tensor]} args
     */
    constructor(...args) {
        if (args[0] instanceof ONNXTensor) {
            // Create shallow copy
            Object.assign(this, args[0]);

        } else {
            // Create new tensor
            Object.assign(this, new ONNXTensor(
                /** @type {DataType} */(args[0]),
                /** @type {Exclude<import('./maths.js').AnyTypedArray, Uint8ClampedArray>} */(args[1]),
                args[2]
            ));
        }

        return new Proxy(this, {
            get: (obj, key) => {
                if (typeof key === 'string') {
                    let index = Number(key);
                    if (Number.isInteger(index)) {
                        // key is an integer (i.e., index)
                        return obj._getitem(index);
                    }
                }
                // @ts-ignore
                return obj[key];
            },
            set: (obj, key, value) => {
                // TODO allow setting of data

                // @ts-ignore
                return obj[key] = value;
            }
        });
    }

    /**
     * Returns an iterator object for iterating over the tensor data in row-major order.
     * If the tensor has more than one dimension, the iterator will yield subarrays.
     * @returns {Iterator} An iterator object for iterating over the tensor data in row-major order.
     */
    *[Symbol.iterator]() {
        const [iterLength, ...iterDims] = this.dims;

        if (iterDims.length > 0) {
            const iterSize = iterDims.reduce((a, b) => a * b);
            for (let i = 0; i < iterLength; ++i) {
                yield this._subarray(i, iterSize, iterDims);
            }
        } else {
            yield* this.data
        }

    }

    /**
     * Index into a Tensor object.
     * @param {number} index The index to access.
     * @returns {Tensor} The data at the specified index.
     */
    _getitem(index) {
        const [iterLength, ...iterDims] = this.dims;

        index = safeIndex(index, iterLength);

        if (iterDims.length > 0) {
            const iterSize = iterDims.reduce((a, b) => a * b);
            return this._subarray(index, iterSize, iterDims);
        } else {
            return new Tensor(this.type, [this.data[index]], iterDims);
        }
    }

    /**
     * @param {number|bigint} item The item to search for in the tensor
     * @returns {number} The index of the first occurrence of item in the tensor data.
     */
    indexOf(item) {
        for (let index = 0; index < this.data.length; ++index) {
            // Note: == instead of === so we can match Ints with BigInts
            if (this.data[index] == item) {
                return index;
            }
        }
        return -1;
    }

    /**
     * @param {number} index 
     * @param {number} iterSize 
     * @param {any} iterDims 
     * @returns {Tensor}
     */
    _subarray(index, iterSize, iterDims) {
        const o1 = index * iterSize;
        const o2 = (index + 1) * iterSize;

        // We use subarray if available (typed array), otherwise we use slice (normal array)
        const data =
            ('subarray' in this.data)
                ? this.data.subarray(o1, o2)
                : this.data.slice(o1, o2);
        return new Tensor(this.type, data, iterDims);
    }

    /**
     * Returns the value of this tensor as a standard JavaScript Number. This only works
     * for tensors with one element. For other cases, see `Tensor.tolist()`.
     * @returns {number|bigint} The value of this tensor as a standard JavaScript Number.
     * @throws {Error} If the tensor has more than one element.
     */
    item() {
        if (this.data.length !== 1) {
            throw new Error(`a Tensor with ${this.data.length} elements cannot be converted to Scalar`);
        }
        return this.data[0];
    }

    /**
     * Convert tensor data to a n-dimensional JS list
     * @returns {Array}
     */
    tolist() {
        return reshape(this.data, this.dims)
    }

    /**
     * Return a new Tensor with the sigmoid function applied to each element.
     * @returns {Tensor} The tensor with the sigmoid function applied.
     */
    sigmoid() {
        return this.clone().sigmoid_();
    }

    /**
     * Applies the sigmoid function to the tensor in place.
     * @returns {Tensor} Returns `this`.
     */
    sigmoid_() {
        for (let i = 0; i < this.data.length; ++i) {
            this.data[i] = 1 / (1 + Math.exp(-this.data[i]));
        }
        return this;
    }

    /**
     * Return a new Tensor with every element multiplied by a constant.
     * @param {number} val The value to multiply by.
     * @returns {Tensor} The new tensor.
     */
    mul(val) {
        return this.clone().mul_(val);
    }

    /**
     * Multiply the tensor by a constant in place.
     * @param {number} val The value to multiply by.
     * @returns {Tensor} Returns `this`.
     */
    mul_(val) {
        for (let i = 0; i < this.data.length; ++i) {
            this.data[i] *= val;
        }
        return this;
    }


    /**
     * Return a new Tensor with every element added by a constant.
     * @param {number} val The value to add by.
     * @returns {Tensor} The new tensor.
     */
    add(val) {
        return this.clone().add_(val);
    }

    /**
     * Add the tensor by a constant in place.
     * @param {number} val The value to add by.
     * @returns {Tensor} Returns `this`.
     */
    add_(val) {
        for (let i = 0; i < this.data.length; ++i) {
            this.data[i] += val;
        }
        return this;
    }
    clone() {
        return new Tensor(this.type, this.data.slice(), this.dims.slice());
    }

    slice(...slices) {
        // This allows for slicing with ranges and numbers
        let newTensorDims = [];
        let newOffsets = [];

        // slices is an array of numbers or arrays of numbers
        // e.g., slices = [0, [1, 3], null, [0, 3]]
        for (let sliceIndex = 0; sliceIndex < this.dims.length; ++sliceIndex) {
            let slice = slices[sliceIndex];

            if (slice === null || slice === undefined) {
                // null or undefined means take the whole dimension
                newOffsets.push([0, this.dims[sliceIndex]]);
                newTensorDims.push(this.dims[sliceIndex]);

            } else if (typeof slice === 'number') {
                slice = safeIndex(slice, this.dims[sliceIndex], sliceIndex);

                // A number means take a single element
                newOffsets.push([slice, slice + 1]);

            } else if (Array.isArray(slice) && slice.length === 2) {
                // An array of length 2 means take a range of elements

                if (slice[0] > slice[1]) {
                    throw new Error(`Invalid slice: ${slice}`);
                }

                let offsets = [
                    Math.max(slice[0], 0),
                    Math.min(slice[1], this.dims[sliceIndex])
                ];

                newOffsets.push(offsets);
                newTensorDims.push(offsets[1] - offsets[0]);

            } else {
                throw new Error(`Invalid slice: ${slice}`);
            }
        }

        let newDims = newOffsets.map(([start, end]) => end - start);
        let newBufferSize = newDims.reduce((a, b) => a * b);

        // Allocate memory
        // @ts-ignore
        let data = new this.data.constructor(newBufferSize);

        // Precompute strides
        const stride = this.stride();

        for (let i = 0; i < newBufferSize; ++i) {
            let originalIndex = 0;
            for (let j = newDims.length - 1, num = i; j >= 0; --j) {
                const size = newDims[j];
                originalIndex += ((num % size) + newOffsets[j][0]) * stride[j];
                num = Math.floor(num / size);
            }
            data[i] = this.data[originalIndex];
        }
        return new Tensor(this.type, data, newTensorDims);

    }

    /**
     * Return a permuted version of this Tensor, according to the provided dimensions.
     * @param  {...number} dims Dimensions to permute.
     * @returns {Tensor} The permuted tensor.
     */
    permute(...dims) {
        return permute(this, dims);
    }

    // TODO: implement transpose. For now (backwards compatibility), it's just an alias for permute()
    transpose(...dims) {
        return this.permute(...dims);
    }

    // TODO add .max() and .min() methods

    /**
     * Returns the sum of each row of the input tensor in the given dimension dim.
     * 
     * @param {number} [dim=null] The dimension or dimensions to reduce. If `null`, all dimensions are reduced.
     * @param {boolean} keepdim Whether the output tensor has `dim` retained or not.
     * @returns The summed tensor
     */
    sum(dim = null, keepdim = false) {
        return this.norm(1, dim, keepdim);
    }

    /**
     * Returns the matrix norm or vector norm of a given tensor.
     * @param {number|string} [p='fro'] The order of norm
     * @param {number} [dim=null] Specifies which dimension of the tensor to calculate the norm across.
     * If dim is None, the norm will be calculated across all dimensions of input.
     * @param {boolean} [keepdim=false] Whether the output tensors have dim retained or not.
     * @returns {Tensor} The norm of the tensor.
     */
    norm(p = 'fro', dim = null, keepdim = false) {
        if (p === 'fro') {
            // NOTE: Since we only support integer dims, Frobenius norm produces the same result as p=2.
            p = 2;
        } else if (typeof p === 'string') {
            throw Error(`Unsupported norm: ${p}`);
        }

        if (dim === null) {
            // @ts-ignore
            let val = this.data.reduce((a, b) => a + (b ** p), 0) ** (1 / p);
            return new Tensor(this.type, [val], []);
        }

        // Negative indexing
        dim = safeIndex(dim, this.dims.length);

        // Calculate the shape of the resulting array after summation
        const resultDims = this.dims.slice(); // Copy the original dimensions
        resultDims[dim] = 1; // Remove the specified axis

        // Create a new array to store the accumulated values
        // @ts-ignore
        const result = new this.data.constructor(this.data.length / this.dims[dim]);

        // Iterate over the data array
        for (let i = 0; i < this.data.length; ++i) {

            // Calculate the index in the resulting array
            let resultIndex = 0;

            for (let j = this.dims.length - 1, num = i, resultMultiplier = 1; j >= 0; --j) {
                const size = this.dims[j];
                if (j !== dim) {
                    const index = num % size;
                    resultIndex += index * resultMultiplier;
                    resultMultiplier *= resultDims[j];
                }
                num = Math.floor(num / size);
            }

            // Accumulate the value at the current index
            result[resultIndex] += (this.data[i]) ** p;
        }

        if (p !== 1) {
            for (let i = 0; i < result.length; ++i) {
                result[i] = result[i] ** (1 / p);
            }
        }

        if (!keepdim) {
            resultDims.splice(dim, 1);
        }

        return new Tensor(this.type, result, resultDims);
    }

    /**
     * Performs `L_p` normalization of inputs over specified dimension. Operates in place.
     * @param {number} [p=2] The exponent value in the norm formulation
     * @param {number} [dim=1] The dimension to reduce
     * @returns {Tensor} `this` for operation chaining.
     */
    normalize_(p = 2.0, dim = 1) {
        dim = safeIndex(dim, this.dims.length);

        const norm = this.norm(p, dim, true);

        for (let i = 0; i < this.data.length; ++i) {

            // Calculate the index in the resulting array
            let resultIndex = 0;

            for (let j = this.dims.length - 1, num = i, resultMultiplier = 1; j >= 0; --j) {
                const size = this.dims[j];
                if (j !== dim) {
                    const index = num % size;
                    resultIndex += index * resultMultiplier;
                    resultMultiplier *= this.dims[j];
                }
                num = Math.floor(num / size);
            }

            // Divide by normalized value
            this.data[i] /= norm.data[resultIndex];
        }

        return this;
    }

    /**
     * Performs `L_p` normalization of inputs over specified dimension.
     * @param {number} [p=2] The exponent value in the norm formulation
     * @param {number} [dim=1] The dimension to reduce
     * @returns {Tensor} The normalized tensor.
     */
    normalize(p = 2.0, dim = 1) {
        return this.clone().normalize_(p, dim);
    }

    /**
     * Compute and return the stride of this tensor.
     * Stride is the jump necessary to go from one element to the next one in the specified dimension dim.
     * @returns {number[]} The stride of this tensor.
     */
    stride() {
        return dimsToStride(this.dims);
    }

    /**
     * Returns a tensor with all specified dimensions of input of size 1 removed.
     * 
     * NOTE: The returned tensor shares the storage with the input tensor, so changing the contents of one will change the contents of the other.
     * If you would like a copy, use `tensor.clone()` before squeezing.
     * 
     * @param {number} [dim=null] If given, the input will be squeezed only in the specified dimensions.
     * @returns The squeezed tensor
     */
    squeeze(dim = null) {
        return new Tensor(
            this.type,
            this.data,
            calc_squeeze_dims(this.dims, dim)
        )
    }

    /**
     * In-place version of @see {@link Tensor.squeeze}
     */
    squeeze_(dim = null) {
        this.dims = calc_squeeze_dims(this.dims, dim);
        return this;
    }

    /**
     * Returns a new tensor with a dimension of size one inserted at the specified position.
     * 
     * NOTE: The returned tensor shares the same underlying data with this tensor.
     * 
     * @param {number} dim The index at which to insert the singleton dimension
     * @returns The unsqueezed tensor
     */
    unsqueeze(dim = null) {
        return new Tensor(
            this.type,
            this.data,
            calc_unsqueeze_dims(this.dims, dim)
        );
    }

    /**
     * In-place version of @see {@link Tensor.unsqueeze}
     */
    unsqueeze_(dim = null) {
        this.dims = calc_unsqueeze_dims(this.dims, dim);
        return this;
    }

    /**
     * In-place version of @see {@link Tensor.flatten}
     */
    flatten_(start_dim = 0, end_dim = -1) {
        // TODO validate inputs
        end_dim = (end_dim + this.dims.length) % this.dims.length;

        let dimsToKeepBefore = this.dims.slice(0, start_dim);
        let dimsToFlatten = this.dims.slice(start_dim, end_dim + 1);
        let dimsToKeepAfter = this.dims.slice(end_dim + 1);

        this.dims = [...dimsToKeepBefore, dimsToFlatten.reduce((a, b) => a * b, 1), ...dimsToKeepAfter]
        return this;
    }

    /**
     * Flattens input by reshaping it into a one-dimensional tensor.
     * If `start_dim` or `end_dim` are passed, only dimensions starting with `start_dim`
     * and ending with `end_dim` are flattened. The order of elements in input is unchanged.
     * @param {number} start_dim the first dim to flatten
     * @param {number} end_dim the last dim to flatten
     * @returns The flattened tensor.
     */
    flatten(start_dim = 0, end_dim = -1) {
        return this.clone().flatten_(start_dim, end_dim);
    }

    /**
     * Returns a new tensor with the same data as the `self` tensor but of a different `shape`.
     * @param  {...number} dims the desired size
     * @returns {Tensor} The tensor with the same data but different shape
     */
    view(...dims) {
        // TODO: validate dims
        let inferredIndex = -1;
        for (let i = 0; i < dims.length; ++i) {
            if (dims[i] === -1) {
                if (inferredIndex !== -1) {
                    throw new Error("Only one dimension can be inferred");
                }
                inferredIndex = i;
            }
        }

        if (inferredIndex !== -1) {
            // Some dimension must be inferred
            const productOther = dims.reduce((product, curr, index) => {
                return index !== inferredIndex ? product * curr : product
            }, 1);

            dims[inferredIndex] = this.data.length / productOther;
        }
        return new Tensor(this.type, this.data, dims); // NOTE: uses same underlying storage
    }

    neg_() {
        for (let i = 0; i < this.data.length; ++i) {
            this.data[i] = -this.data[i];
        }
        return this;
    }
    neg() {
        return this.clone().neg_();
    }

    /**
     * In-place version of @see {@link Tensor.clamp}
     */
    clamp_(min, max) {
        for (let i = 0; i < this.data.length; ++i) {
            this.data[i] = Math.min(Math.max(this.data[i], min), max);
        }
        return this;
    }

    /**
     * Clamps all elements in input into the range [ min, max ]
     * @param {number} min lower-bound of the range to be clamped to
     * @param {number} max upper-bound of the range to be clamped to
     * @returns the output tensor.
     */
    clamp(min, max) {
        return this.clone().clamp_(min, max);
    }

    /**
     * In-place version of @see {@link Tensor.round}
     */
    round_() {
        for (let i = 0; i < this.data.length; ++i) {
            this.data[i] = Math.round(this.data[i]);
        }
        return this;
    }

    /**
     * Rounds elements of input to the nearest integer.
     * @returns the output tensor.
     */
    round() {
        return this.clone().round_();
    }

    /**
     * Performs Tensor dtype conversion.
     * @param {DataType} type The desired data type.
     * @returns {Tensor} The converted tensor.
     */
    to(type) {
        // If the self Tensor already has the correct dtype, then self is returned.
        if (this.type === type) return this;

        // Otherwise, the returned tensor is a copy of self with the desired dtype.
        if (!DataTypeMap.hasOwnProperty(type)) {
            throw new Error(`Unsupported type: ${type}`);
        }
        // @ts-ignore
        return new Tensor(type, DataTypeMap[type].from(this.data), this.dims);
    }
}

/**
 * This creates a nested array of a given type and depth (see examples).
 * 
 * @example
 *   NestArray<string, 1>; // string[]
 * @example
 *   NestArray<number, 2>; // number[][]
 * @example
 *   NestArray<string, 3>; // string[][][] etc.
 * @template T
 * @template {number} Depth
 * @template {never[]} [Acc=[]]
 * @typedef {Acc['length'] extends Depth ? T : NestArray<T[], Depth, [...Acc, never]>} NestArray
 */

/**
 * Reshapes a 1-dimensional array into an n-dimensional array, according to the provided dimensions.
 *
 * @example
 *   reshape([10                    ], [1      ]); // Type: number[]      Value: [10]
 *   reshape([1, 2, 3, 4            ], [2, 2   ]); // Type: number[][]    Value: [[1, 2], [3, 4]]
 *   reshape([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]); // Type: number[][][]  Value: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
 *   reshape([1, 2, 3, 4, 5, 6, 7, 8], [4, 2   ]); // Type: number[][]    Value: [[1, 2], [3, 4], [5, 6], [7, 8]]
 * @param {T[]|DataArray} data The input array to reshape.
 * @param {DIM} dimensions The target shape/dimensions.
 * @template T
 * @template {[number]|number[]} DIM
 * @returns {NestArray<T, DIM["length"]>} The reshaped array.
 */
function reshape(data, dimensions) {

    const totalElements = data.length;
    const dimensionSize = dimensions.reduce((a, b) => a * b);

    if (totalElements !== dimensionSize) {
        throw Error(`cannot reshape array of size ${totalElements} into shape (${dimensions})`);
    }

    /** @type {any} */
    let reshapedArray = data;

    for (let i = dimensions.length - 1; i >= 0; i--) {
        reshapedArray = reshapedArray.reduce((acc, val) => {
            let lastArray = acc[acc.length - 1];

            if (lastArray.length < dimensions[i]) {
                lastArray.push(val);
            } else {
                acc.push([val]);
            }

            return acc;
        }, [[]]);
    }

    return reshapedArray[0];
}

/**
 * Permutes a tensor according to the provided axes.
 * @param {any} tensor The input tensor to permute.
 * @param {Array} axes The axes to permute the tensor along.
 * @returns {Tensor} The permuted tensor.
 */
function permute(tensor, axes) {
    const [permutedData, shape] = (0,_maths_js__WEBPACK_IMPORTED_MODULE_1__/* .permute_data */ .nu)(tensor.data, tensor.dims, axes);
    return new Tensor(tensor.type, permutedData, shape);
}


/**
 * Interpolates an Tensor to the given size.
 * @param {Tensor} input The input tensor to interpolate. Data must be channel-first (i.e., [c, h, w])
 * @param {number[]} size The output size of the image
 * @param {string} mode The interpolation mode
 * @param {boolean} align_corners Whether to align corners.
 * @returns {Tensor} The interpolated tensor.
 */
function interpolate(input, [out_height, out_width], mode = 'bilinear', align_corners = false) {

    // Input image dimensions
    const in_channels = input.dims.at(-3) ?? 1;
    const in_height = input.dims.at(-2);
    const in_width = input.dims.at(-1);

    let output = (0,_maths_js__WEBPACK_IMPORTED_MODULE_1__/* .interpolate_data */ .Nq)(
        /** @type {import('./maths.js').TypedArray}*/(input.data),
        [in_channels, in_height, in_width],
        [out_height, out_width],
        mode,
        align_corners
    );
    return new Tensor(input.type, output, [in_channels, out_height, out_width]);
}

/**
 * Perform mean pooling of the last hidden state followed by a normalization step.
 * @param {Tensor} last_hidden_state Tensor of shape [batchSize, seqLength, embedDim]
 * @param {Tensor} attention_mask Tensor of shape [batchSize, seqLength]
 * @returns {Tensor} Returns a new Tensor of shape [batchSize, embedDim].
 */
function mean_pooling(last_hidden_state, attention_mask) {
    // last_hidden_state: [batchSize, seqLength, embedDim]
    // attention_mask:    [batchSize, seqLength]

    let shape = [last_hidden_state.dims[0], last_hidden_state.dims[2]];
    // @ts-ignore
    let returnedData = new last_hidden_state.data.constructor(shape[0] * shape[1]);
    let [batchSize, seqLength, embedDim] = last_hidden_state.dims;

    let outIndex = 0;
    for (let i = 0; i < batchSize; ++i) {
        let offset = i * embedDim * seqLength;

        for (let k = 0; k < embedDim; ++k) {
            let sum = 0;
            let count = 0;

            let attnMaskOffset = i * seqLength;
            let offset2 = offset + k;
            // Pool over all words in sequence
            for (let j = 0; j < seqLength; ++j) {
                // index into attention mask
                let attn = Number(attention_mask.data[attnMaskOffset + j]);

                count += attn;
                sum += last_hidden_state.data[offset2 + j * embedDim] * attn;
            }

            let avg = sum / count;
            returnedData[outIndex++] = avg;
        }
    }

    return new Tensor(
        last_hidden_state.type,
        returnedData,
        shape
    )
}

/**
 * Apply Layer Normalization for last certain number of dimensions.
 * @param {Tensor} input The input tensor
 * @param {number[]} normalized_shape input shape from an expected input of size
 * @param {Object} options The options for the layer normalization
 * @param {number} [options.eps=1e-5] A value added to the denominator for numerical stability.
 * @returns {Tensor} The normalized tensor.
 */
function layer_norm(input, normalized_shape, {
    eps = 1e-5,
} = {}) {
    if (input.dims.length !== 2) {
        throw new Error('`layer_norm` currently only supports 2D input.');
    }

    const [batchSize, featureDim] = input.dims;

    if (normalized_shape.length !== 1 && normalized_shape[0] !== featureDim) {
        throw new Error('`normalized_shape` must be a 1D array with shape `[input.dims[1]]`.');
    }

    const [std, mean] = std_mean(input, 1, 0, true);

    // @ts-ignore
    const returnedData = new input.data.constructor(input.data.length);

    for (let i = 0; i < batchSize; ++i) {
        const offset = i * featureDim;
        for (let j = 0; j < featureDim; ++j) {
            const offset2 = offset + j;
            returnedData[offset2] = (input.data[offset2] - mean.data[i]) / (std.data[i] + eps);
        }
    }
    return new Tensor(input.type, returnedData, input.dims);
}

/**
 * Helper function to calculate new dimensions when performing a squeeze operation.
 * @param {number[]} dims The dimensions of the tensor.
 * @param {number|number[]|null} dim The dimension(s) to squeeze.
 * @returns The new dimensions.
 * @private
 */
function calc_squeeze_dims(dims, dim) {
    dims = dims.slice();
    if (dim === null) {
        dims = dims.filter((d) => d !== 1);
    } else if (typeof dim === 'number') {
        if (dims[dim] === 1) {
            dims.splice(dim, 1);
        }
    } else if (Array.isArray(dim)) {
        dims = dims.filter((x, i) => {
            return x !== 1 || !dim.includes(i);
        });
    }
    return dims;
}

/**
 * Helper function to calculate new dimensions when performing an unsqueeze operation.
 * @param {number[]} dims The dimensions of the tensor.
 * @param {number} dim The dimension to unsqueeze.
 * @returns The new dimensions.
 * @private
 */
function calc_unsqueeze_dims(dims, dim) {
    // Dimension out of range (e.g., "expected to be in range of [-4, 3], but got 4")
    // + 1 since we allow inserting at the end (i.e. dim = -1)
    dim = safeIndex(dim, dims.length + 1);
    dims = dims.slice();
    // Insert 1 into specified dimension
    dims.splice(dim, 0, 1);
    return dims;
}

/**
 * Safely calculate the index for an array of a given size, allowing negative indexing.
 * @param {number} index The index that will be used.
 * @param {number} size The size of the array.
 * @param {number} [dimension=null] The dimension that the index is for (optional).
 * @returns {number} The index, guaranteed to be non-negative and less than `arrayLength`.
 * 
 * @throws {Error} If the index is out of range.
 * @private
 */
function safeIndex(index, size, dimension = null) {
    if (index < -size || index >= size) {
        throw new Error(`IndexError: index ${index} is out of bounds for dimension${dimension === null ? '' : ' ' + dimension} with size ${size}`);
    }

    if (index < 0) {
        // Negative indexing, ensuring positive index
        index = ((index % size) + size) % size;
    }
    return index;
}

/**
 * Concatenates an array of tensors along a specified dimension.
 * @param {Tensor[]} tensors The array of tensors to concatenate.
 * @param {number} dim The dimension to concatenate along.
 * @returns {Tensor} The concatenated tensor.
 */
function cat(tensors, dim = 0) {
    dim = safeIndex(dim, tensors[0].dims.length);

    // TODO do validation of shapes

    const resultDims = tensors[0].dims.slice();
    resultDims[dim] = tensors.reduce((a, b) => a + b.dims[dim], 0);

    // Create a new array to store the accumulated values
    const resultSize = resultDims.reduce((a, b) => a * b, 1);
    // @ts-ignore
    const result = new tensors[0].data.constructor(resultSize);

    // Create output tensor of same type as first
    const resultType = tensors[0].type;

    if (dim === 0) {
        // Handle special case for performance reasons

        let offset = 0;
        for (let t of tensors) {
            result.set(t.data, offset);
            offset += t.data.length;
        }

    } else {

        let currentDim = 0;

        for (let t = 0; t < tensors.length; ++t) {
            let tensor = tensors[t];

            // Iterate over the data array
            for (let i = 0; i < tensor.data.length; ++i) {
                // Calculate the index in the resulting array
                let resultIndex = 0;

                for (let j = tensor.dims.length - 1, num = i, resultMultiplier = 1; j >= 0; --j) {
                    const size = tensor.dims[j];
                    let index = num % size;
                    if (j === dim) {
                        index += currentDim;
                    }
                    resultIndex += index * resultMultiplier;
                    resultMultiplier *= resultDims[j];
                    num = Math.floor(num / size);
                }
                // Accumulate the value at the current index
                result[resultIndex] = tensor.data[i];
            }

            currentDim += tensor.dims[dim];
        }
    }
    return new Tensor(resultType, result, resultDims);
}

/**
 * Stack an array of tensors along a specified dimension.
 * @param {Tensor[]} tensors The array of tensors to stack.
 * @param {number} dim The dimension to stack along.
 * @returns {Tensor} The stacked tensor.
 */
function stack(tensors, dim = 0) {
    // TODO do validation of shapes
    // NOTE: stack expects each tensor to be equal size
    return cat(tensors.map(t => t.unsqueeze(dim)), dim);
}


/**
 * Calculates the standard deviation and mean over the dimensions specified by dim. dim can be a single dimension or `null` to reduce over all dimensions.
 * @param {Tensor} input the input tenso
 * @param {number|null} dim the dimension to reduce. If None, all dimensions are reduced.
 * @param {number} correction difference between the sample size and sample degrees of freedom. Defaults to Bessel's correction, correction=1.
 * @param {boolean} keepdim whether the output tensor has dim retained or not.
 * @returns {Tensor[]} A tuple of (std, mean) tensors.
 */
function std_mean(input, dim = null, correction = 1, keepdim = false) {

    if (dim === null) {
        // None to reduce over all dimensions.
        // @ts-ignore
        const sum = input.data.reduce((a, b) => a + b, 0);
        const mean = sum / input.data.length;
        // @ts-ignore
        const std = Math.sqrt(input.data.reduce((a, b) => a + (b - mean) ** 2, 0) / (input.data.length - correction));

        const meanTensor = new Tensor(input.type, [mean], [/* scalar */]);
        const stdTensor = new Tensor(input.type, [std], [/* scalar */]);

        return [stdTensor, meanTensor];
    }

    // Negative indexing
    dim = safeIndex(dim, input.dims.length);

    const meanTensor = mean(input, dim, keepdim);

    // Calculate the shape of the resulting array after summation
    const resultDims = input.dims.slice(); // Copy the original dimensions
    resultDims[dim] = 1; // Remove the specified axis

    // Create a new array to store the accumulated values
    // @ts-ignore
    const result = new input.data.constructor(input.data.length / input.dims[dim]);

    // Iterate over the data array
    for (let i = 0; i < input.data.length; ++i) {

        // Calculate the index in the resulting array
        let resultIndex = 0;

        for (let j = input.dims.length - 1, num = i, resultMultiplier = 1; j >= 0; --j) {
            const size = input.dims[j];
            if (j !== dim) {
                const index = num % size;
                resultIndex += index * resultMultiplier;
                resultMultiplier *= resultDims[j];
            }
            num = Math.floor(num / size);
        }

        // Accumulate the value at the current index
        result[resultIndex] += (input.data[i] - meanTensor.data[resultIndex]) ** 2;
    }

    for (let i = 0; i < result.length; ++i) {
        result[i] = Math.sqrt(result[i] / (input.dims[dim] - correction));
    }

    if (!keepdim) {
        resultDims.splice(dim, 1);
    }

    const stdTensor = new Tensor(input.type, result, resultDims);

    return [stdTensor, meanTensor];
}


/**
 * Returns the mean value of each row of the input tensor in the given dimension dim.
 * @param {Tensor} input the input tensor.
 * @param {number|null} dim the dimension to reduce.
 * @param {boolean} keepdim whether the output tensor has dim retained or not.
 * @returns A new tensor with means taken along the specified dimension.
 */
function mean(input, dim = null, keepdim = false) {

    if (dim === null) {
        // None to reduce over all dimensions.
        // @ts-ignore
        let val = input.data.reduce((a, b) => a + b, 0);
        return new Tensor(input.type, [val / input.data.length], [/* scalar */]);
    }

    // Negative indexing
    dim = safeIndex(dim, input.dims.length);

    // Calculate the shape of the resulting array after summation
    const resultDims = input.dims.slice(); // Copy the original dimensions
    resultDims[dim] = 1; // Remove the specified axis

    // Create a new array to store the accumulated values
    // @ts-ignore
    const result = new input.data.constructor(input.data.length / input.dims[dim]);

    // Iterate over the data array
    for (let i = 0; i < input.data.length; ++i) {

        // Calculate the index in the resulting array
        let resultIndex = 0;

        for (let j = input.dims.length - 1, num = i, resultMultiplier = 1; j >= 0; --j) {
            const size = input.dims[j];
            if (j !== dim) {
                const index = num % size;
                resultIndex += index * resultMultiplier;
                resultMultiplier *= resultDims[j];
            }
            num = Math.floor(num / size);
        }

        // Accumulate the value at the current index
        result[resultIndex] += input.data[i];
    }

    if (input.dims[dim] !== 1) {
        for (let i = 0; i < result.length; ++i) {
            result[i] = result[i] / input.dims[dim];
        }
    }

    if (!keepdim) {
        resultDims.splice(dim, 1);
    }

    return new Tensor(input.type, result, resultDims);
}


/**
 *
 * Measures similarity between two temporal sequences (e.g., input audio and output tokens
 * to generate token-level timestamps).
 * @param {Tensor} matrix 
 * @returns {number[][]}
 */
function dynamicTimeWarping(matrix) {
    const [output_length, input_length] = matrix.dims;

    const outputShape = [output_length + 1, input_length + 1];

    const cost = new Tensor(
        'float32',
        new Float32Array(outputShape[0] * outputShape[1]).fill(Infinity),
        outputShape
    );

    const trace = new Tensor(
        'float32',
        new Float32Array(outputShape[0] * outputShape[1]).fill(-1),
        outputShape
    )

    // same as `cost[0][0] = 0`;
    cost[0].data[0] = 0;

    for (let j = 1; j < input_length + 1; ++j) {
        for (let i = 1; i < output_length + 1; ++i) {

            const c0 = cost[i - 1][j - 1].item();
            const c1 = cost[i - 1][j].item();
            const c2 = cost[i][j - 1].item();

            let c, t;
            if (c0 < c1 && c0 < c2) {
                c = c0;
                t = 0;
            } else if (c1 < c0 && c1 < c2) {
                c = c1;
                t = 1;
            } else {
                c = c2;
                t = 2;
            }

            cost[i].data[j] = matrix[i - 1][j - 1].item() + c;
            trace[i].data[j] = t;
        }
    }

    // backtrace
    let i = output_length;
    let j = input_length;

    // @ts-ignore
    trace.data.fill(2, 0, outputShape[1]) // trace[0, :] = 2
    for (let i = 0; i < outputShape[0]; ++i) { // trace[:, 0] = 1
        trace[i].data[0] = 1;
    }

    let text_indices = [];
    let time_indices = [];

    while (i > 0 || j > 0) {
        text_indices.push(i - 1);
        time_indices.push(j - 1);

        const t = trace[i][j].item();
        switch (t) {
            case 0:
                --i; --j;
                break;
            case 1:
                --i;
                break;
            case 2:
                --j;
                break;
            default:
                throw new Error(
                    `Internal error in dynamic time warping. Unexpected trace[${i}, ${j}]. Please file a bug report.`
                )
        }
    }

    text_indices.reverse();
    time_indices.reverse();

    return [text_indices, time_indices];

}

function dimsToStride(dims) {
    const stride = new Array(dims.length);
    for (let i = dims.length - 1, s2 = 1; i >= 0; --i) {
        stride[i] = s2;
        s2 *= dims[i];
    }
    return stride;
}

/**
 * Returns a tensor filled with the scalar value 1, with the shape defined by the variable argument size.
 * @param {number[]} size A sequence of integers defining the shape of the output tensor.
 */
function ones(size) {
    const numElements = size.reduce((a, b) => a * b, 1);
    return new Tensor(
        'int64',
        new BigInt64Array(numElements).fill(1n),
        size
    )
}

/**
 * Returns a tensor filled with the scalar value 1, with the same size as input.
 * @param {Tensor} tensor The size of input will determine size of the output tensor.
 * @returns The ones tensor.
 */
function ones_like(tensor) {
    return ones(tensor.dims);
}

/**
 * Quantizes the embeddings tensor to binary or unsigned binary precision.
 * @param {Tensor} tensor The tensor to quantize.
 * @param {'binary'|'ubinary'} precision The precision to use for quantization.
 * @returns {Tensor} The quantized tensor.
 */
function quantize_embeddings(tensor, precision) {
    if (tensor.dims.length !== 2) {
        throw new Error("The tensor must have 2 dimensions");
    }
    if (tensor.dims.at(-1) % 8 !== 0) {
        throw new Error("The last dimension of the tensor must be a multiple of 8");
    }
    if (!['binary', 'ubinary'].includes(precision)) {
        throw new Error("The precision must be either 'binary' or 'ubinary'");
    }

    const signed = precision === 'binary';
    const dtype = signed ? 'int8' : 'uint8';

    // Create a typed array to store the packed bits
    const cls = signed ? Int8Array : Uint8Array;
    const inputData = tensor.data;
    const outputData = new cls(inputData.length / 8);

    // Iterate over each number in the array
    for (let i = 0; i < inputData.length; ++i) {
        // Determine if the number is greater than 0
        const bit = inputData[i] > 0 ? 1 : 0;

        // Calculate the index in the typed array and the position within the byte
        const arrayIndex = Math.floor(i / 8);
        const bitPosition = i % 8;

        // Pack the bit into the typed array
        outputData[arrayIndex] |= bit << (7 - bitPosition);
        if (signed && bitPosition === 0) {
            outputData[arrayIndex] -= 128;
        }
    };

    return new Tensor(dtype, outputData, [tensor.dims[0], tensor.dims[1] / 8]);
}


/***/ })

}]);