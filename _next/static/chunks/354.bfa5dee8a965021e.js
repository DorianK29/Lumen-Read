(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[354],{

/***/ 3405:
/***/ (function(module) {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var defineProperty = Object.defineProperty;
var gOPD = Object.getOwnPropertyDescriptor;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

// If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
var setProperty = function setProperty(target, options) {
	if (defineProperty && options.name === '__proto__') {
		defineProperty(target, options.name, {
			enumerable: true,
			configurable: true,
			value: options.newValue,
			writable: true
		});
	} else {
		target[options.name] = options.newValue;
	}
};

// Return undefined instead of __proto__ if '__proto__' is not an own property
var getProperty = function getProperty(obj, name) {
	if (name === '__proto__') {
		if (!hasOwn.call(obj, name)) {
			return void 0;
		} else if (gOPD) {
			// In early versions of node, obj['__proto__'] is buggy when obj has
			// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
			return gOPD(obj, name).value;
		}
	}

	return obj[name];
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = getProperty(target, name);
				copy = getProperty(options, name);

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						setProperty(target, { name: name, newValue: copy });
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


/***/ }),

/***/ 6021:
/***/ (function(module) {

"use strict";


// http://www.w3.org/TR/CSS21/grammar.html
// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
var COMMENT_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;

var NEWLINE_REGEX = /\n/g;
var WHITESPACE_REGEX = /^\s*/;

// declaration
var PROPERTY_REGEX = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/;
var COLON_REGEX = /^:\s*/;
var VALUE_REGEX = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/;
var SEMICOLON_REGEX = /^[;\s]*/;

// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
var TRIM_REGEX = /^\s+|\s+$/g;

// strings
var NEWLINE = '\n';
var FORWARD_SLASH = '/';
var ASTERISK = '*';
var EMPTY_STRING = '';

// types
var TYPE_COMMENT = 'comment';
var TYPE_DECLARATION = 'declaration';

/**
 * @param {String} style
 * @param {Object} [options]
 * @return {Object[]}
 * @throws {TypeError}
 * @throws {Error}
 */
function index (style, options) {
  if (typeof style !== 'string') {
    throw new TypeError('First argument must be a string');
  }

  if (!style) return [];

  options = options || {};

  /**
   * Positional.
   */
  var lineno = 1;
  var column = 1;

  /**
   * Update lineno and column based on `str`.
   *
   * @param {String} str
   */
  function updatePosition(str) {
    var lines = str.match(NEWLINE_REGEX);
    if (lines) lineno += lines.length;
    var i = str.lastIndexOf(NEWLINE);
    column = ~i ? str.length - i : column + str.length;
  }

  /**
   * Mark position and patch `node.position`.
   *
   * @return {Function}
   */
  function position() {
    var start = { line: lineno, column: column };
    return function (node) {
      node.position = new Position(start);
      whitespace();
      return node;
    };
  }

  /**
   * Store position information for a node.
   *
   * @constructor
   * @property {Object} start
   * @property {Object} end
   * @property {undefined|String} source
   */
  function Position(start) {
    this.start = start;
    this.end = { line: lineno, column: column };
    this.source = options.source;
  }

  /**
   * Non-enumerable source string.
   */
  Position.prototype.content = style;

  /**
   * Error `msg`.
   *
   * @param {String} msg
   * @throws {Error}
   */
  function error(msg) {
    var err = new Error(
      options.source + ':' + lineno + ':' + column + ': ' + msg
    );
    err.reason = msg;
    err.filename = options.source;
    err.line = lineno;
    err.column = column;
    err.source = style;

    if (options.silent) ; else {
      throw err;
    }
  }

  /**
   * Match `re` and return captures.
   *
   * @param {RegExp} re
   * @return {undefined|Array}
   */
  function match(re) {
    var m = re.exec(style);
    if (!m) return;
    var str = m[0];
    updatePosition(str);
    style = style.slice(str.length);
    return m;
  }

  /**
   * Parse whitespace.
   */
  function whitespace() {
    match(WHITESPACE_REGEX);
  }

  /**
   * Parse comments.
   *
   * @param {Object[]} [rules]
   * @return {Object[]}
   */
  function comments(rules) {
    var c;
    rules = rules || [];
    while ((c = comment())) {
      if (c !== false) {
        rules.push(c);
      }
    }
    return rules;
  }

  /**
   * Parse comment.
   *
   * @return {Object}
   * @throws {Error}
   */
  function comment() {
    var pos = position();
    if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return;

    var i = 2;
    while (
      EMPTY_STRING != style.charAt(i) &&
      (ASTERISK != style.charAt(i) || FORWARD_SLASH != style.charAt(i + 1))
    ) {
      ++i;
    }
    i += 2;

    if (EMPTY_STRING === style.charAt(i - 1)) {
      return error('End of comment missing');
    }

    var str = style.slice(2, i - 2);
    column += 2;
    updatePosition(str);
    style = style.slice(i);
    column += 2;

    return pos({
      type: TYPE_COMMENT,
      comment: str
    });
  }

  /**
   * Parse declaration.
   *
   * @return {Object}
   * @throws {Error}
   */
  function declaration() {
    var pos = position();

    // prop
    var prop = match(PROPERTY_REGEX);
    if (!prop) return;
    comment();

    // :
    if (!match(COLON_REGEX)) return error("property missing ':'");

    // val
    var val = match(VALUE_REGEX);

    var ret = pos({
      type: TYPE_DECLARATION,
      property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),
      value: val
        ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING))
        : EMPTY_STRING
    });

    // ;
    match(SEMICOLON_REGEX);

    return ret;
  }

  /**
   * Parse declarations.
   *
   * @return {Object[]}
   */
  function declarations() {
    var decls = [];

    comments(decls);

    // declarations
    var decl;
    while ((decl = declaration())) {
      if (decl !== false) {
        decls.push(decl);
        comments(decls);
      }
    }

    return decls;
  }

  whitespace();
  return declarations();
}

/**
 * Trim `str`.
 *
 * @param {String} str
 * @return {String}
 */
function trim(str) {
  return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;
}

module.exports = index;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 2128:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;


var _interopRequireDefault = __webpack_require__(9259);
__webpack_unused_export__ = ({
  value: true
});
exports.Z = void 0;
var _json = _interopRequireDefault(__webpack_require__(4121));
var _default = exports.Z = _json["default"];

/***/ }),

/***/ 6597:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;


var _interopRequireDefault = __webpack_require__(9259);
__webpack_unused_export__ = ({
  value: true
});
exports.Z = void 0;
var _markdown = _interopRequireDefault(__webpack_require__(6559));
var _default = exports.Z = _markdown["default"];

/***/ }),

/***/ 6844:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;


var _interopRequireDefault = __webpack_require__(9259);
__webpack_unused_export__ = ({
  value: true
});
exports.Z = void 0;
var _python = _interopRequireDefault(__webpack_require__(5816));
var _default = exports.Z = _python["default"];

/***/ }),

/***/ 6004:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;


var _interopRequireDefault = __webpack_require__(9259);
__webpack_unused_export__ = ({
  value: true
});
exports.Z = void 0;
var _typescript = _interopRequireDefault(__webpack_require__(121));
var _default = exports.Z = _typescript["default"];

/***/ }),

/***/ 7388:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#f8f8f2",
    "background": "none",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#f8f8f2",
    "background": "#2b2b2b",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": "0.5em 0",
    "overflow": "auto",
    "borderRadius": "0.3em"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#2b2b2b",
    "padding": "0.1em",
    "borderRadius": "0.3em",
    "whiteSpace": "normal"
  },
  "comment": {
    "color": "#d4d0ab"
  },
  "prolog": {
    "color": "#d4d0ab"
  },
  "doctype": {
    "color": "#d4d0ab"
  },
  "cdata": {
    "color": "#d4d0ab"
  },
  "punctuation": {
    "color": "#fefefe"
  },
  "property": {
    "color": "#ffa07a"
  },
  "tag": {
    "color": "#ffa07a"
  },
  "constant": {
    "color": "#ffa07a"
  },
  "symbol": {
    "color": "#ffa07a"
  },
  "deleted": {
    "color": "#ffa07a"
  },
  "boolean": {
    "color": "#00e0e0"
  },
  "number": {
    "color": "#00e0e0"
  },
  "selector": {
    "color": "#abe338"
  },
  "attr-name": {
    "color": "#abe338"
  },
  "string": {
    "color": "#abe338"
  },
  "char": {
    "color": "#abe338"
  },
  "builtin": {
    "color": "#abe338"
  },
  "inserted": {
    "color": "#abe338"
  },
  "operator": {
    "color": "#00e0e0"
  },
  "entity": {
    "color": "#00e0e0",
    "cursor": "help"
  },
  "url": {
    "color": "#00e0e0"
  },
  ".language-css .token.string": {
    "color": "#00e0e0"
  },
  ".style .token.string": {
    "color": "#00e0e0"
  },
  "variable": {
    "color": "#00e0e0"
  },
  "atrule": {
    "color": "#ffd700"
  },
  "attr-value": {
    "color": "#ffd700"
  },
  "function": {
    "color": "#ffd700"
  },
  "keyword": {
    "color": "#00e0e0"
  },
  "regex": {
    "color": "#ffd700"
  },
  "important": {
    "color": "#ffd700",
    "fontWeight": "bold"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  }
};

/***/ }),

/***/ 7782:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#c5c8c6",
    "textShadow": "0 1px rgba(0, 0, 0, 0.3)",
    "fontFamily": "Inconsolata, Monaco, Consolas, 'Courier New', Courier, monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#c5c8c6",
    "textShadow": "0 1px rgba(0, 0, 0, 0.3)",
    "fontFamily": "Inconsolata, Monaco, Consolas, 'Courier New', Courier, monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto",
    "borderRadius": "0.3em",
    "background": "#1d1f21"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#1d1f21",
    "padding": ".1em",
    "borderRadius": ".3em"
  },
  "comment": {
    "color": "#7C7C7C"
  },
  "prolog": {
    "color": "#7C7C7C"
  },
  "doctype": {
    "color": "#7C7C7C"
  },
  "cdata": {
    "color": "#7C7C7C"
  },
  "punctuation": {
    "color": "#c5c8c6"
  },
  ".namespace": {
    "Opacity": ".7"
  },
  "property": {
    "color": "#96CBFE"
  },
  "keyword": {
    "color": "#96CBFE"
  },
  "tag": {
    "color": "#96CBFE"
  },
  "class-name": {
    "color": "#FFFFB6",
    "textDecoration": "underline"
  },
  "boolean": {
    "color": "#99CC99"
  },
  "constant": {
    "color": "#99CC99"
  },
  "symbol": {
    "color": "#f92672"
  },
  "deleted": {
    "color": "#f92672"
  },
  "number": {
    "color": "#FF73FD"
  },
  "selector": {
    "color": "#A8FF60"
  },
  "attr-name": {
    "color": "#A8FF60"
  },
  "string": {
    "color": "#A8FF60"
  },
  "char": {
    "color": "#A8FF60"
  },
  "builtin": {
    "color": "#A8FF60"
  },
  "inserted": {
    "color": "#A8FF60"
  },
  "variable": {
    "color": "#C6C5FE"
  },
  "operator": {
    "color": "#EDEDED"
  },
  "entity": {
    "color": "#FFFFB6",
    "cursor": "help"
  },
  "url": {
    "color": "#96CBFE"
  },
  ".language-css .token.string": {
    "color": "#87C38A"
  },
  ".style .token.string": {
    "color": "#87C38A"
  },
  "atrule": {
    "color": "#F9EE98"
  },
  "attr-value": {
    "color": "#F9EE98"
  },
  "function": {
    "color": "#DAD085"
  },
  "regex": {
    "color": "#E9C062"
  },
  "important": {
    "color": "#fd971f",
    "fontWeight": "bold"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  }
};

/***/ }),

/***/ 6628:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "fontFamily": "Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize": "14px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "background": "#f5f7ff",
    "color": "#5e6687"
  },
  "pre[class*=\"language-\"]": {
    "fontFamily": "Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize": "14px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "background": "#f5f7ff",
    "color": "#5e6687",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto"
  },
  "pre > code[class*=\"language-\"]": {
    "fontSize": "1em"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#dfe2f1"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#dfe2f1"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#dfe2f1"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#dfe2f1"
  },
  "pre[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#dfe2f1"
  },
  "pre[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#dfe2f1"
  },
  "code[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#dfe2f1"
  },
  "code[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#dfe2f1"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "padding": ".1em",
    "borderRadius": ".3em"
  },
  "comment": {
    "color": "#898ea4"
  },
  "prolog": {
    "color": "#898ea4"
  },
  "doctype": {
    "color": "#898ea4"
  },
  "cdata": {
    "color": "#898ea4"
  },
  "punctuation": {
    "color": "#5e6687"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "operator": {
    "color": "#c76b29"
  },
  "boolean": {
    "color": "#c76b29"
  },
  "number": {
    "color": "#c76b29"
  },
  "property": {
    "color": "#c08b30"
  },
  "tag": {
    "color": "#3d8fd1"
  },
  "string": {
    "color": "#22a2c9"
  },
  "selector": {
    "color": "#6679cc"
  },
  "attr-name": {
    "color": "#c76b29"
  },
  "entity": {
    "color": "#22a2c9",
    "cursor": "help"
  },
  "url": {
    "color": "#22a2c9"
  },
  ".language-css .token.string": {
    "color": "#22a2c9"
  },
  ".style .token.string": {
    "color": "#22a2c9"
  },
  "attr-value": {
    "color": "#ac9739"
  },
  "keyword": {
    "color": "#ac9739"
  },
  "control": {
    "color": "#ac9739"
  },
  "directive": {
    "color": "#ac9739"
  },
  "unit": {
    "color": "#ac9739"
  },
  "statement": {
    "color": "#22a2c9"
  },
  "regex": {
    "color": "#22a2c9"
  },
  "atrule": {
    "color": "#22a2c9"
  },
  "placeholder": {
    "color": "#3d8fd1"
  },
  "variable": {
    "color": "#3d8fd1"
  },
  "deleted": {
    "textDecoration": "line-through"
  },
  "inserted": {
    "borderBottom": "1px dotted #202746",
    "textDecoration": "none"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "important": {
    "fontWeight": "bold",
    "color": "#c94922"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "pre > code.highlight": {
    "Outline": "0.4em solid #c94922",
    "OutlineOffset": ".4em"
  },
  ".line-numbers.line-numbers .line-numbers-rows": {
    "borderRightColor": "#dfe2f1"
  },
  ".line-numbers .line-numbers-rows > span:before": {
    "color": "#979db4"
  },
  ".line-highlight.line-highlight": {
    "background": "linear-gradient(to right, rgba(107, 115, 148, 0.2) 70%, rgba(107, 115, 148, 0))"
  }
};

/***/ }),

/***/ 4243:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#fff",
    "textShadow": "0 1px 1px #000",
    "fontFamily": "Menlo, Monaco, \"Courier New\", monospace",
    "direction": "ltr",
    "textAlign": "left",
    "wordSpacing": "normal",
    "whiteSpace": "pre",
    "wordWrap": "normal",
    "lineHeight": "1.4",
    "background": "none",
    "border": "0",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#fff",
    "textShadow": "0 1px 1px #000",
    "fontFamily": "Menlo, Monaco, \"Courier New\", monospace",
    "direction": "ltr",
    "textAlign": "left",
    "wordSpacing": "normal",
    "whiteSpace": "pre",
    "wordWrap": "normal",
    "lineHeight": "1.4",
    "background": "#222",
    "border": "0",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "15px",
    "margin": "1em 0",
    "overflow": "auto",
    "MozBorderRadius": "8px",
    "WebkitBorderRadius": "8px",
    "borderRadius": "8px"
  },
  "pre[class*=\"language-\"] code": {
    "float": "left",
    "padding": "0 15px 0 0"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#222",
    "padding": "5px 10px",
    "lineHeight": "1",
    "MozBorderRadius": "3px",
    "WebkitBorderRadius": "3px",
    "borderRadius": "3px"
  },
  "comment": {
    "color": "#797979"
  },
  "prolog": {
    "color": "#797979"
  },
  "doctype": {
    "color": "#797979"
  },
  "cdata": {
    "color": "#797979"
  },
  "selector": {
    "color": "#fff"
  },
  "operator": {
    "color": "#fff"
  },
  "punctuation": {
    "color": "#fff"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "tag": {
    "color": "#ffd893"
  },
  "boolean": {
    "color": "#ffd893"
  },
  "atrule": {
    "color": "#B0C975"
  },
  "attr-value": {
    "color": "#B0C975"
  },
  "hex": {
    "color": "#B0C975"
  },
  "string": {
    "color": "#B0C975"
  },
  "property": {
    "color": "#c27628"
  },
  "entity": {
    "color": "#c27628",
    "cursor": "help"
  },
  "url": {
    "color": "#c27628"
  },
  "attr-name": {
    "color": "#c27628"
  },
  "keyword": {
    "color": "#c27628"
  },
  "regex": {
    "color": "#9B71C6"
  },
  "function": {
    "color": "#e5a638"
  },
  "constant": {
    "color": "#e5a638"
  },
  "variable": {
    "color": "#fdfba8"
  },
  "number": {
    "color": "#8799B0"
  },
  "important": {
    "color": "#E45734"
  },
  "deliminator": {
    "color": "#E45734"
  },
  ".line-highlight.line-highlight": {
    "background": "rgba(255, 255, 255, .2)"
  },
  ".line-highlight.line-highlight:before": {
    "top": ".3em",
    "backgroundColor": "rgba(255, 255, 255, .3)",
    "color": "#fff",
    "MozBorderRadius": "8px",
    "WebkitBorderRadius": "8px",
    "borderRadius": "8px"
  },
  ".line-highlight.line-highlight[data-end]:after": {
    "top": ".3em",
    "backgroundColor": "rgba(255, 255, 255, .3)",
    "color": "#fff",
    "MozBorderRadius": "8px",
    "WebkitBorderRadius": "8px",
    "borderRadius": "8px"
  },
  ".line-numbers .line-numbers-rows > span": {
    "borderRight": "3px #d9d336 solid"
  }
};

/***/ }),

/***/ 3747:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#111b27",
    "background": "none",
    "fontFamily": "Consolas, Monaco, \"Andale Mono\", \"Ubuntu Mono\", monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#111b27",
    "background": "#e3eaf2",
    "fontFamily": "Consolas, Monaco, \"Andale Mono\", \"Ubuntu Mono\", monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": "0.5em 0",
    "overflow": "auto"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "background": "#8da1b9"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "background": "#8da1b9"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "background": "#8da1b9"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "background": "#8da1b9"
  },
  "pre[class*=\"language-\"]::selection": {
    "background": "#8da1b9"
  },
  "pre[class*=\"language-\"] ::selection": {
    "background": "#8da1b9"
  },
  "code[class*=\"language-\"]::selection": {
    "background": "#8da1b9"
  },
  "code[class*=\"language-\"] ::selection": {
    "background": "#8da1b9"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#e3eaf2",
    "padding": "0.1em 0.3em",
    "borderRadius": "0.3em",
    "whiteSpace": "normal"
  },
  "comment": {
    "color": "#3c526d"
  },
  "prolog": {
    "color": "#3c526d"
  },
  "doctype": {
    "color": "#3c526d"
  },
  "cdata": {
    "color": "#3c526d"
  },
  "punctuation": {
    "color": "#111b27"
  },
  "delimiter.important": {
    "color": "#006d6d",
    "fontWeight": "inherit"
  },
  "selector.parent": {
    "color": "#006d6d"
  },
  "tag": {
    "color": "#006d6d"
  },
  "tag.punctuation": {
    "color": "#006d6d"
  },
  "attr-name": {
    "color": "#755f00"
  },
  "boolean": {
    "color": "#755f00"
  },
  "boolean.important": {
    "color": "#755f00"
  },
  "number": {
    "color": "#755f00"
  },
  "constant": {
    "color": "#755f00"
  },
  "selector.attribute": {
    "color": "#755f00"
  },
  "class-name": {
    "color": "#005a8e"
  },
  "key": {
    "color": "#005a8e"
  },
  "parameter": {
    "color": "#005a8e"
  },
  "property": {
    "color": "#005a8e"
  },
  "property-access": {
    "color": "#005a8e"
  },
  "variable": {
    "color": "#005a8e"
  },
  "attr-value": {
    "color": "#116b00"
  },
  "inserted": {
    "color": "#116b00"
  },
  "color": {
    "color": "#116b00"
  },
  "selector.value": {
    "color": "#116b00"
  },
  "string": {
    "color": "#116b00"
  },
  "string.url-link": {
    "color": "#116b00"
  },
  "builtin": {
    "color": "#af00af"
  },
  "keyword-array": {
    "color": "#af00af"
  },
  "package": {
    "color": "#af00af"
  },
  "regex": {
    "color": "#af00af"
  },
  "function": {
    "color": "#7c00aa"
  },
  "selector.class": {
    "color": "#7c00aa"
  },
  "selector.id": {
    "color": "#7c00aa"
  },
  "atrule.rule": {
    "color": "#a04900"
  },
  "combinator": {
    "color": "#a04900"
  },
  "keyword": {
    "color": "#a04900"
  },
  "operator": {
    "color": "#a04900"
  },
  "pseudo-class": {
    "color": "#a04900"
  },
  "pseudo-element": {
    "color": "#a04900"
  },
  "selector": {
    "color": "#a04900"
  },
  "unit": {
    "color": "#a04900"
  },
  "deleted": {
    "color": "#c22f2e"
  },
  "important": {
    "color": "#c22f2e",
    "fontWeight": "bold"
  },
  "keyword-this": {
    "color": "#005a8e",
    "fontWeight": "bold"
  },
  "this": {
    "color": "#005a8e",
    "fontWeight": "bold"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "entity": {
    "cursor": "help"
  },
  ".language-markdown .token.title": {
    "color": "#005a8e",
    "fontWeight": "bold"
  },
  ".language-markdown .token.title .token.punctuation": {
    "color": "#005a8e",
    "fontWeight": "bold"
  },
  ".language-markdown .token.blockquote.punctuation": {
    "color": "#af00af"
  },
  ".language-markdown .token.code": {
    "color": "#006d6d"
  },
  ".language-markdown .token.hr.punctuation": {
    "color": "#005a8e"
  },
  ".language-markdown .token.url > .token.content": {
    "color": "#116b00"
  },
  ".language-markdown .token.url-link": {
    "color": "#755f00"
  },
  ".language-markdown .token.list.punctuation": {
    "color": "#af00af"
  },
  ".language-markdown .token.table-header": {
    "color": "#111b27"
  },
  ".language-json .token.operator": {
    "color": "#111b27"
  },
  ".language-scss .token.variable": {
    "color": "#006d6d"
  },
  "token.tab:not(:empty):before": {
    "color": "#3c526d"
  },
  "token.cr:before": {
    "color": "#3c526d"
  },
  "token.lf:before": {
    "color": "#3c526d"
  },
  "token.space:before": {
    "color": "#3c526d"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a": {
    "color": "#e3eaf2",
    "background": "#005a8e"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button": {
    "color": "#e3eaf2",
    "background": "#005a8e"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:hover": {
    "color": "#e3eaf2",
    "background": "#005a8eda",
    "textDecoration": "none"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:focus": {
    "color": "#e3eaf2",
    "background": "#005a8eda",
    "textDecoration": "none"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:hover": {
    "color": "#e3eaf2",
    "background": "#005a8eda",
    "textDecoration": "none"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:focus": {
    "color": "#e3eaf2",
    "background": "#005a8eda",
    "textDecoration": "none"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span": {
    "color": "#e3eaf2",
    "background": "#3c526d"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:hover": {
    "color": "#e3eaf2",
    "background": "#3c526d"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:focus": {
    "color": "#e3eaf2",
    "background": "#3c526d"
  },
  ".line-highlight.line-highlight": {
    "background": "linear-gradient(to right, #8da1b92f 70%, #8da1b925)"
  },
  ".line-highlight.line-highlight:before": {
    "backgroundColor": "#3c526d",
    "color": "#e3eaf2",
    "boxShadow": "0 1px #8da1b9"
  },
  ".line-highlight.line-highlight[data-end]:after": {
    "backgroundColor": "#3c526d",
    "color": "#e3eaf2",
    "boxShadow": "0 1px #8da1b9"
  },
  "pre[id].linkable-line-numbers.linkable-line-numbers span.line-numbers-rows > span:hover:before": {
    "backgroundColor": "#3c526d1f"
  },
  ".line-numbers.line-numbers .line-numbers-rows": {
    "borderRight": "1px solid #8da1b97a",
    "background": "#d0dae77a"
  },
  ".line-numbers .line-numbers-rows > span:before": {
    "color": "#3c526dda"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-1": {
    "color": "#755f00"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-5": {
    "color": "#755f00"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-9": {
    "color": "#755f00"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-2": {
    "color": "#af00af"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-6": {
    "color": "#af00af"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-10": {
    "color": "#af00af"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-3": {
    "color": "#005a8e"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-7": {
    "color": "#005a8e"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-11": {
    "color": "#005a8e"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-4": {
    "color": "#7c00aa"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-8": {
    "color": "#7c00aa"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-12": {
    "color": "#7c00aa"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix)": {
    "backgroundColor": "#c22f2e1f"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix)": {
    "backgroundColor": "#c22f2e1f"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix)": {
    "backgroundColor": "#116b001f"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix)": {
    "backgroundColor": "#116b001f"
  },
  ".command-line .command-line-prompt": {
    "borderRight": "1px solid #8da1b97a"
  },
  ".command-line .command-line-prompt > span:before": {
    "color": "#3c526dda"
  }
};

/***/ }),

/***/ 2618:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#e3eaf2",
    "background": "none",
    "fontFamily": "Consolas, Monaco, \"Andale Mono\", \"Ubuntu Mono\", monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#e3eaf2",
    "background": "#111b27",
    "fontFamily": "Consolas, Monaco, \"Andale Mono\", \"Ubuntu Mono\", monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": "0.5em 0",
    "overflow": "auto"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "background": "#3c526d"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "background": "#3c526d"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "background": "#3c526d"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "background": "#3c526d"
  },
  "pre[class*=\"language-\"]::selection": {
    "background": "#3c526d"
  },
  "pre[class*=\"language-\"] ::selection": {
    "background": "#3c526d"
  },
  "code[class*=\"language-\"]::selection": {
    "background": "#3c526d"
  },
  "code[class*=\"language-\"] ::selection": {
    "background": "#3c526d"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#111b27",
    "padding": "0.1em 0.3em",
    "borderRadius": "0.3em",
    "whiteSpace": "normal"
  },
  "comment": {
    "color": "#8da1b9"
  },
  "prolog": {
    "color": "#8da1b9"
  },
  "doctype": {
    "color": "#8da1b9"
  },
  "cdata": {
    "color": "#8da1b9"
  },
  "punctuation": {
    "color": "#e3eaf2"
  },
  "delimiter.important": {
    "color": "#66cccc",
    "fontWeight": "inherit"
  },
  "selector.parent": {
    "color": "#66cccc"
  },
  "tag": {
    "color": "#66cccc"
  },
  "tag.punctuation": {
    "color": "#66cccc"
  },
  "attr-name": {
    "color": "#e6d37a"
  },
  "boolean": {
    "color": "#e6d37a"
  },
  "boolean.important": {
    "color": "#e6d37a"
  },
  "number": {
    "color": "#e6d37a"
  },
  "constant": {
    "color": "#e6d37a"
  },
  "selector.attribute": {
    "color": "#e6d37a"
  },
  "class-name": {
    "color": "#6cb8e6"
  },
  "key": {
    "color": "#6cb8e6"
  },
  "parameter": {
    "color": "#6cb8e6"
  },
  "property": {
    "color": "#6cb8e6"
  },
  "property-access": {
    "color": "#6cb8e6"
  },
  "variable": {
    "color": "#6cb8e6"
  },
  "attr-value": {
    "color": "#91d076"
  },
  "inserted": {
    "color": "#91d076"
  },
  "color": {
    "color": "#91d076"
  },
  "selector.value": {
    "color": "#91d076"
  },
  "string": {
    "color": "#91d076"
  },
  "string.url-link": {
    "color": "#91d076"
  },
  "builtin": {
    "color": "#f4adf4"
  },
  "keyword-array": {
    "color": "#f4adf4"
  },
  "package": {
    "color": "#f4adf4"
  },
  "regex": {
    "color": "#f4adf4"
  },
  "function": {
    "color": "#c699e3"
  },
  "selector.class": {
    "color": "#c699e3"
  },
  "selector.id": {
    "color": "#c699e3"
  },
  "atrule.rule": {
    "color": "#e9ae7e"
  },
  "combinator": {
    "color": "#e9ae7e"
  },
  "keyword": {
    "color": "#e9ae7e"
  },
  "operator": {
    "color": "#e9ae7e"
  },
  "pseudo-class": {
    "color": "#e9ae7e"
  },
  "pseudo-element": {
    "color": "#e9ae7e"
  },
  "selector": {
    "color": "#e9ae7e"
  },
  "unit": {
    "color": "#e9ae7e"
  },
  "deleted": {
    "color": "#cd6660"
  },
  "important": {
    "color": "#cd6660",
    "fontWeight": "bold"
  },
  "keyword-this": {
    "color": "#6cb8e6",
    "fontWeight": "bold"
  },
  "this": {
    "color": "#6cb8e6",
    "fontWeight": "bold"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "entity": {
    "cursor": "help"
  },
  ".language-markdown .token.title": {
    "color": "#6cb8e6",
    "fontWeight": "bold"
  },
  ".language-markdown .token.title .token.punctuation": {
    "color": "#6cb8e6",
    "fontWeight": "bold"
  },
  ".language-markdown .token.blockquote.punctuation": {
    "color": "#f4adf4"
  },
  ".language-markdown .token.code": {
    "color": "#66cccc"
  },
  ".language-markdown .token.hr.punctuation": {
    "color": "#6cb8e6"
  },
  ".language-markdown .token.url .token.content": {
    "color": "#91d076"
  },
  ".language-markdown .token.url-link": {
    "color": "#e6d37a"
  },
  ".language-markdown .token.list.punctuation": {
    "color": "#f4adf4"
  },
  ".language-markdown .token.table-header": {
    "color": "#e3eaf2"
  },
  ".language-json .token.operator": {
    "color": "#e3eaf2"
  },
  ".language-scss .token.variable": {
    "color": "#66cccc"
  },
  "token.tab:not(:empty):before": {
    "color": "#8da1b9"
  },
  "token.cr:before": {
    "color": "#8da1b9"
  },
  "token.lf:before": {
    "color": "#8da1b9"
  },
  "token.space:before": {
    "color": "#8da1b9"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a": {
    "color": "#111b27",
    "background": "#6cb8e6"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button": {
    "color": "#111b27",
    "background": "#6cb8e6"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:hover": {
    "color": "#111b27",
    "background": "#6cb8e6da",
    "textDecoration": "none"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:focus": {
    "color": "#111b27",
    "background": "#6cb8e6da",
    "textDecoration": "none"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:hover": {
    "color": "#111b27",
    "background": "#6cb8e6da",
    "textDecoration": "none"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:focus": {
    "color": "#111b27",
    "background": "#6cb8e6da",
    "textDecoration": "none"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span": {
    "color": "#111b27",
    "background": "#8da1b9"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:hover": {
    "color": "#111b27",
    "background": "#8da1b9"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:focus": {
    "color": "#111b27",
    "background": "#8da1b9"
  },
  ".line-highlight.line-highlight": {
    "background": "linear-gradient(to right, #3c526d5f 70%, #3c526d55)"
  },
  ".line-highlight.line-highlight:before": {
    "backgroundColor": "#8da1b9",
    "color": "#111b27",
    "boxShadow": "0 1px #3c526d"
  },
  ".line-highlight.line-highlight[data-end]:after": {
    "backgroundColor": "#8da1b9",
    "color": "#111b27",
    "boxShadow": "0 1px #3c526d"
  },
  "pre[id].linkable-line-numbers.linkable-line-numbers span.line-numbers-rows > span:hover:before": {
    "backgroundColor": "#8da1b918"
  },
  ".line-numbers.line-numbers .line-numbers-rows": {
    "borderRight": "1px solid #0b121b",
    "background": "#0b121b7a"
  },
  ".line-numbers .line-numbers-rows > span:before": {
    "color": "#8da1b9da"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-1": {
    "color": "#e6d37a"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-5": {
    "color": "#e6d37a"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-9": {
    "color": "#e6d37a"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-2": {
    "color": "#f4adf4"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-6": {
    "color": "#f4adf4"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-10": {
    "color": "#f4adf4"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-3": {
    "color": "#6cb8e6"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-7": {
    "color": "#6cb8e6"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-11": {
    "color": "#6cb8e6"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-4": {
    "color": "#c699e3"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-8": {
    "color": "#c699e3"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-12": {
    "color": "#c699e3"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix)": {
    "backgroundColor": "#cd66601f"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix)": {
    "backgroundColor": "#cd66601f"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix)": {
    "backgroundColor": "#91d0761f"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix)": {
    "backgroundColor": "#91d0761f"
  },
  ".command-line .command-line-prompt": {
    "borderRight": "1px solid #0b121b"
  },
  ".command-line .command-line-prompt > span:before": {
    "color": "#8da1b9da"
  }
};

/***/ }),

/***/ 4450:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "black",
    "background": "none",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "black",
    "background": "none",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "position": "relative",
    "borderLeft": "10px solid #358ccb",
    "boxShadow": "-1px 0 0 0 #358ccb, 0 0 0 1px #dfdfdf",
    "backgroundColor": "#fdfdfd",
    "backgroundImage": "linear-gradient(transparent 50%, rgba(69, 142, 209, 0.04) 50%)",
    "backgroundSize": "3em 3em",
    "backgroundOrigin": "content-box",
    "backgroundAttachment": "local",
    "margin": ".5em 0",
    "padding": "0 1em"
  },
  "pre[class*=\"language-\"] > code": {
    "display": "block"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "position": "relative",
    "padding": ".2em",
    "borderRadius": "0.3em",
    "color": "#c92c2c",
    "border": "1px solid rgba(0, 0, 0, 0.1)",
    "display": "inline",
    "whiteSpace": "normal",
    "backgroundColor": "#fdfdfd",
    "WebkitBoxSizing": "border-box",
    "MozBoxSizing": "border-box",
    "boxSizing": "border-box"
  },
  "comment": {
    "color": "#7D8B99"
  },
  "block-comment": {
    "color": "#7D8B99"
  },
  "prolog": {
    "color": "#7D8B99"
  },
  "doctype": {
    "color": "#7D8B99"
  },
  "cdata": {
    "color": "#7D8B99"
  },
  "punctuation": {
    "color": "#5F6364"
  },
  "property": {
    "color": "#c92c2c"
  },
  "tag": {
    "color": "#c92c2c"
  },
  "boolean": {
    "color": "#c92c2c"
  },
  "number": {
    "color": "#c92c2c"
  },
  "function-name": {
    "color": "#c92c2c"
  },
  "constant": {
    "color": "#c92c2c"
  },
  "symbol": {
    "color": "#c92c2c"
  },
  "deleted": {
    "color": "#c92c2c"
  },
  "selector": {
    "color": "#2f9c0a"
  },
  "attr-name": {
    "color": "#2f9c0a"
  },
  "string": {
    "color": "#2f9c0a"
  },
  "char": {
    "color": "#2f9c0a"
  },
  "function": {
    "color": "#2f9c0a"
  },
  "builtin": {
    "color": "#2f9c0a"
  },
  "inserted": {
    "color": "#2f9c0a"
  },
  "operator": {
    "color": "#a67f59",
    "background": "rgba(255, 255, 255, 0.5)"
  },
  "entity": {
    "color": "#a67f59",
    "background": "rgba(255, 255, 255, 0.5)",
    "cursor": "help"
  },
  "url": {
    "color": "#a67f59",
    "background": "rgba(255, 255, 255, 0.5)"
  },
  "variable": {
    "color": "#a67f59",
    "background": "rgba(255, 255, 255, 0.5)"
  },
  "atrule": {
    "color": "#1990b8"
  },
  "attr-value": {
    "color": "#1990b8"
  },
  "keyword": {
    "color": "#1990b8"
  },
  "class-name": {
    "color": "#1990b8"
  },
  "regex": {
    "color": "#e90"
  },
  "important": {
    "color": "#e90",
    "fontWeight": "normal"
  },
  ".language-css .token.string": {
    "color": "#a67f59",
    "background": "rgba(255, 255, 255, 0.5)"
  },
  ".style .token.string": {
    "color": "#a67f59",
    "background": "rgba(255, 255, 255, 0.5)"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "namespace": {
    "Opacity": ".7"
  }
};

/***/ }),

/***/ 8184:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "black",
    "background": "none",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "maxHeight": "inherit",
    "height": "inherit",
    "padding": "0 1em",
    "display": "block",
    "overflow": "auto"
  },
  "pre[class*=\"language-\"]": {
    "color": "black",
    "background": "none",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "position": "relative",
    "margin": ".5em 0",
    "overflow": "visible",
    "padding": "1px",
    "backgroundColor": "#fdfdfd",
    "WebkitBoxSizing": "border-box",
    "MozBoxSizing": "border-box",
    "boxSizing": "border-box",
    "marginBottom": "1em"
  },
  "pre[class*=\"language-\"] > code": {
    "position": "relative",
    "zIndex": "1",
    "borderLeft": "10px solid #358ccb",
    "boxShadow": "-1px 0px 0px 0px #358ccb, 0px 0px 0px 1px #dfdfdf",
    "backgroundColor": "#fdfdfd",
    "backgroundImage": "linear-gradient(transparent 50%, rgba(69, 142, 209, 0.04) 50%)",
    "backgroundSize": "3em 3em",
    "backgroundOrigin": "content-box",
    "backgroundAttachment": "local"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "backgroundColor": "#fdfdfd",
    "WebkitBoxSizing": "border-box",
    "MozBoxSizing": "border-box",
    "boxSizing": "border-box",
    "marginBottom": "1em",
    "position": "relative",
    "padding": ".2em",
    "borderRadius": "0.3em",
    "color": "#c92c2c",
    "border": "1px solid rgba(0, 0, 0, 0.1)",
    "display": "inline",
    "whiteSpace": "normal"
  },
  "pre[class*=\"language-\"]:before": {
    "content": "''",
    "display": "block",
    "position": "absolute",
    "bottom": "0.75em",
    "left": "0.18em",
    "width": "40%",
    "height": "20%",
    "maxHeight": "13em",
    "boxShadow": "0px 13px 8px #979797",
    "WebkitTransform": "rotate(-2deg)",
    "MozTransform": "rotate(-2deg)",
    "msTransform": "rotate(-2deg)",
    "OTransform": "rotate(-2deg)",
    "transform": "rotate(-2deg)"
  },
  "pre[class*=\"language-\"]:after": {
    "content": "''",
    "display": "block",
    "position": "absolute",
    "bottom": "0.75em",
    "left": "auto",
    "width": "40%",
    "height": "20%",
    "maxHeight": "13em",
    "boxShadow": "0px 13px 8px #979797",
    "WebkitTransform": "rotate(2deg)",
    "MozTransform": "rotate(2deg)",
    "msTransform": "rotate(2deg)",
    "OTransform": "rotate(2deg)",
    "transform": "rotate(2deg)",
    "right": "0.75em"
  },
  "comment": {
    "color": "#7D8B99"
  },
  "block-comment": {
    "color": "#7D8B99"
  },
  "prolog": {
    "color": "#7D8B99"
  },
  "doctype": {
    "color": "#7D8B99"
  },
  "cdata": {
    "color": "#7D8B99"
  },
  "punctuation": {
    "color": "#5F6364"
  },
  "property": {
    "color": "#c92c2c"
  },
  "tag": {
    "color": "#c92c2c"
  },
  "boolean": {
    "color": "#c92c2c"
  },
  "number": {
    "color": "#c92c2c"
  },
  "function-name": {
    "color": "#c92c2c"
  },
  "constant": {
    "color": "#c92c2c"
  },
  "symbol": {
    "color": "#c92c2c"
  },
  "deleted": {
    "color": "#c92c2c"
  },
  "selector": {
    "color": "#2f9c0a"
  },
  "attr-name": {
    "color": "#2f9c0a"
  },
  "string": {
    "color": "#2f9c0a"
  },
  "char": {
    "color": "#2f9c0a"
  },
  "function": {
    "color": "#2f9c0a"
  },
  "builtin": {
    "color": "#2f9c0a"
  },
  "inserted": {
    "color": "#2f9c0a"
  },
  "operator": {
    "color": "#a67f59",
    "background": "rgba(255, 255, 255, 0.5)"
  },
  "entity": {
    "color": "#a67f59",
    "background": "rgba(255, 255, 255, 0.5)",
    "cursor": "help"
  },
  "url": {
    "color": "#a67f59",
    "background": "rgba(255, 255, 255, 0.5)"
  },
  "variable": {
    "color": "#a67f59",
    "background": "rgba(255, 255, 255, 0.5)"
  },
  "atrule": {
    "color": "#1990b8"
  },
  "attr-value": {
    "color": "#1990b8"
  },
  "keyword": {
    "color": "#1990b8"
  },
  "class-name": {
    "color": "#1990b8"
  },
  "regex": {
    "color": "#e90"
  },
  "important": {
    "color": "#e90",
    "fontWeight": "normal"
  },
  ".language-css .token.string": {
    "color": "#a67f59",
    "background": "rgba(255, 255, 255, 0.5)"
  },
  ".style .token.string": {
    "color": "#a67f59",
    "background": "rgba(255, 255, 255, 0.5)"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "pre[class*=\"language-\"].line-numbers.line-numbers": {
    "paddingLeft": "0"
  },
  "pre[class*=\"language-\"].line-numbers.line-numbers code": {
    "paddingLeft": "3.8em"
  },
  "pre[class*=\"language-\"].line-numbers.line-numbers .line-numbers-rows": {
    "left": "0"
  },
  "pre[class*=\"language-\"][data-line]": {
    "paddingTop": "0",
    "paddingBottom": "0",
    "paddingLeft": "0"
  },
  "pre[data-line] code": {
    "position": "relative",
    "paddingLeft": "4em"
  },
  "pre .line-highlight": {
    "marginTop": "0"
  }
};

/***/ }),

/***/ 1539:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#a9b7c6",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#a9b7c6",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto",
    "background": "#2b2b2b"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "color": "inherit",
    "background": "rgba(33, 66, 131, .85)"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "color": "inherit",
    "background": "rgba(33, 66, 131, .85)"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "color": "inherit",
    "background": "rgba(33, 66, 131, .85)"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "color": "inherit",
    "background": "rgba(33, 66, 131, .85)"
  },
  "pre[class*=\"language-\"]::selection": {
    "color": "inherit",
    "background": "rgba(33, 66, 131, .85)"
  },
  "pre[class*=\"language-\"] ::selection": {
    "color": "inherit",
    "background": "rgba(33, 66, 131, .85)"
  },
  "code[class*=\"language-\"]::selection": {
    "color": "inherit",
    "background": "rgba(33, 66, 131, .85)"
  },
  "code[class*=\"language-\"] ::selection": {
    "color": "inherit",
    "background": "rgba(33, 66, 131, .85)"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#2b2b2b",
    "padding": ".1em",
    "borderRadius": ".3em"
  },
  "comment": {
    "color": "#808080"
  },
  "prolog": {
    "color": "#808080"
  },
  "cdata": {
    "color": "#808080"
  },
  "delimiter": {
    "color": "#cc7832"
  },
  "boolean": {
    "color": "#cc7832"
  },
  "keyword": {
    "color": "#cc7832"
  },
  "selector": {
    "color": "#cc7832"
  },
  "important": {
    "color": "#cc7832"
  },
  "atrule": {
    "color": "#cc7832"
  },
  "operator": {
    "color": "#a9b7c6"
  },
  "punctuation": {
    "color": "#a9b7c6"
  },
  "attr-name": {
    "color": "#a9b7c6"
  },
  "tag": {
    "color": "#e8bf6a"
  },
  "tag.punctuation": {
    "color": "#e8bf6a"
  },
  "doctype": {
    "color": "#e8bf6a"
  },
  "builtin": {
    "color": "#e8bf6a"
  },
  "entity": {
    "color": "#6897bb"
  },
  "number": {
    "color": "#6897bb"
  },
  "symbol": {
    "color": "#6897bb"
  },
  "property": {
    "color": "#9876aa"
  },
  "constant": {
    "color": "#9876aa"
  },
  "variable": {
    "color": "#9876aa"
  },
  "string": {
    "color": "#6a8759"
  },
  "char": {
    "color": "#6a8759"
  },
  "attr-value": {
    "color": "#a5c261"
  },
  "attr-value.punctuation": {
    "color": "#a5c261"
  },
  "attr-value.punctuation:first-child": {
    "color": "#a9b7c6"
  },
  "url": {
    "color": "#287bde",
    "textDecoration": "underline"
  },
  "function": {
    "color": "#ffc66d"
  },
  "regex": {
    "background": "#364135"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "inserted": {
    "background": "#294436"
  },
  "deleted": {
    "background": "#484a4a"
  },
  "code.language-css .token.property": {
    "color": "#a9b7c6"
  },
  "code.language-css .token.property + .token.punctuation": {
    "color": "#a9b7c6"
  },
  "code.language-css .token.id": {
    "color": "#ffc66d"
  },
  "code.language-css .token.selector > .token.class": {
    "color": "#ffc66d"
  },
  "code.language-css .token.selector > .token.attribute": {
    "color": "#ffc66d"
  },
  "code.language-css .token.selector > .token.pseudo-class": {
    "color": "#ffc66d"
  },
  "code.language-css .token.selector > .token.pseudo-element": {
    "color": "#ffc66d"
  }
};

/***/ }),

/***/ 6760:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "white",
    "background": "none",
    "textShadow": "0 -.1em .2em black",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "white",
    "background": "hsl(30, 20%, 25%)",
    "textShadow": "0 -.1em .2em black",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto",
    "border": ".3em solid hsl(30, 20%, 40%)",
    "borderRadius": ".5em",
    "boxShadow": "1px 1px .5em black inset"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "hsl(30, 20%, 25%)",
    "padding": ".15em .2em .05em",
    "borderRadius": ".3em",
    "border": ".13em solid hsl(30, 20%, 40%)",
    "boxShadow": "1px 1px .3em -.1em black inset",
    "whiteSpace": "normal"
  },
  "comment": {
    "color": "hsl(30, 20%, 50%)"
  },
  "prolog": {
    "color": "hsl(30, 20%, 50%)"
  },
  "doctype": {
    "color": "hsl(30, 20%, 50%)"
  },
  "cdata": {
    "color": "hsl(30, 20%, 50%)"
  },
  "punctuation": {
    "Opacity": ".7"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "property": {
    "color": "hsl(350, 40%, 70%)"
  },
  "tag": {
    "color": "hsl(350, 40%, 70%)"
  },
  "boolean": {
    "color": "hsl(350, 40%, 70%)"
  },
  "number": {
    "color": "hsl(350, 40%, 70%)"
  },
  "constant": {
    "color": "hsl(350, 40%, 70%)"
  },
  "symbol": {
    "color": "hsl(350, 40%, 70%)"
  },
  "selector": {
    "color": "hsl(75, 70%, 60%)"
  },
  "attr-name": {
    "color": "hsl(75, 70%, 60%)"
  },
  "string": {
    "color": "hsl(75, 70%, 60%)"
  },
  "char": {
    "color": "hsl(75, 70%, 60%)"
  },
  "builtin": {
    "color": "hsl(75, 70%, 60%)"
  },
  "inserted": {
    "color": "hsl(75, 70%, 60%)"
  },
  "operator": {
    "color": "hsl(40, 90%, 60%)"
  },
  "entity": {
    "color": "hsl(40, 90%, 60%)",
    "cursor": "help"
  },
  "url": {
    "color": "hsl(40, 90%, 60%)"
  },
  ".language-css .token.string": {
    "color": "hsl(40, 90%, 60%)"
  },
  ".style .token.string": {
    "color": "hsl(40, 90%, 60%)"
  },
  "variable": {
    "color": "hsl(40, 90%, 60%)"
  },
  "atrule": {
    "color": "hsl(350, 40%, 70%)"
  },
  "attr-value": {
    "color": "hsl(350, 40%, 70%)"
  },
  "keyword": {
    "color": "hsl(350, 40%, 70%)"
  },
  "regex": {
    "color": "#e90"
  },
  "important": {
    "color": "#e90",
    "fontWeight": "bold"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "deleted": {
    "color": "red"
  }
};

/***/ }),

/***/ 9775:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#f8f8f2",
    "background": "none",
    "textShadow": "0 1px rgba(0, 0, 0, 0.3)",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#f8f8f2",
    "background": "#282a36",
    "textShadow": "0 1px rgba(0, 0, 0, 0.3)",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto",
    "borderRadius": "0.3em"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#282a36",
    "padding": ".1em",
    "borderRadius": ".3em",
    "whiteSpace": "normal"
  },
  "comment": {
    "color": "#6272a4"
  },
  "prolog": {
    "color": "#6272a4"
  },
  "doctype": {
    "color": "#6272a4"
  },
  "cdata": {
    "color": "#6272a4"
  },
  "punctuation": {
    "color": "#f8f8f2"
  },
  ".namespace": {
    "Opacity": ".7"
  },
  "property": {
    "color": "#ff79c6"
  },
  "tag": {
    "color": "#ff79c6"
  },
  "constant": {
    "color": "#ff79c6"
  },
  "symbol": {
    "color": "#ff79c6"
  },
  "deleted": {
    "color": "#ff79c6"
  },
  "boolean": {
    "color": "#bd93f9"
  },
  "number": {
    "color": "#bd93f9"
  },
  "selector": {
    "color": "#50fa7b"
  },
  "attr-name": {
    "color": "#50fa7b"
  },
  "string": {
    "color": "#50fa7b"
  },
  "char": {
    "color": "#50fa7b"
  },
  "builtin": {
    "color": "#50fa7b"
  },
  "inserted": {
    "color": "#50fa7b"
  },
  "operator": {
    "color": "#f8f8f2"
  },
  "entity": {
    "color": "#f8f8f2",
    "cursor": "help"
  },
  "url": {
    "color": "#f8f8f2"
  },
  ".language-css .token.string": {
    "color": "#f8f8f2"
  },
  ".style .token.string": {
    "color": "#f8f8f2"
  },
  "variable": {
    "color": "#f8f8f2"
  },
  "atrule": {
    "color": "#f1fa8c"
  },
  "attr-value": {
    "color": "#f1fa8c"
  },
  "function": {
    "color": "#f1fa8c"
  },
  "class-name": {
    "color": "#f1fa8c"
  },
  "keyword": {
    "color": "#8be9fd"
  },
  "regex": {
    "color": "#ffb86c"
  },
  "important": {
    "color": "#ffb86c",
    "fontWeight": "bold"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  }
};

/***/ }),

/***/ 6414:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "fontFamily": "Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize": "14px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "background": "#2a2734",
    "color": "#9a86fd"
  },
  "pre[class*=\"language-\"]": {
    "fontFamily": "Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize": "14px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "background": "#2a2734",
    "color": "#9a86fd",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto"
  },
  "pre > code[class*=\"language-\"]": {
    "fontSize": "1em"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#6a51e6"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#6a51e6"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#6a51e6"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#6a51e6"
  },
  "pre[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#6a51e6"
  },
  "pre[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#6a51e6"
  },
  "code[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#6a51e6"
  },
  "code[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#6a51e6"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "padding": ".1em",
    "borderRadius": ".3em"
  },
  "comment": {
    "color": "#6c6783"
  },
  "prolog": {
    "color": "#6c6783"
  },
  "doctype": {
    "color": "#6c6783"
  },
  "cdata": {
    "color": "#6c6783"
  },
  "punctuation": {
    "color": "#6c6783"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "tag": {
    "color": "#e09142"
  },
  "operator": {
    "color": "#e09142"
  },
  "number": {
    "color": "#e09142"
  },
  "property": {
    "color": "#9a86fd"
  },
  "function": {
    "color": "#9a86fd"
  },
  "tag-id": {
    "color": "#eeebff"
  },
  "selector": {
    "color": "#eeebff"
  },
  "atrule-id": {
    "color": "#eeebff"
  },
  "code.language-javascript": {
    "color": "#c4b9fe"
  },
  "attr-name": {
    "color": "#c4b9fe"
  },
  "code.language-css": {
    "color": "#ffcc99"
  },
  "code.language-scss": {
    "color": "#ffcc99"
  },
  "boolean": {
    "color": "#ffcc99"
  },
  "string": {
    "color": "#ffcc99"
  },
  "entity": {
    "color": "#ffcc99",
    "cursor": "help"
  },
  "url": {
    "color": "#ffcc99"
  },
  ".language-css .token.string": {
    "color": "#ffcc99"
  },
  ".language-scss .token.string": {
    "color": "#ffcc99"
  },
  ".style .token.string": {
    "color": "#ffcc99"
  },
  "attr-value": {
    "color": "#ffcc99"
  },
  "keyword": {
    "color": "#ffcc99"
  },
  "control": {
    "color": "#ffcc99"
  },
  "directive": {
    "color": "#ffcc99"
  },
  "unit": {
    "color": "#ffcc99"
  },
  "statement": {
    "color": "#ffcc99"
  },
  "regex": {
    "color": "#ffcc99"
  },
  "atrule": {
    "color": "#ffcc99"
  },
  "placeholder": {
    "color": "#ffcc99"
  },
  "variable": {
    "color": "#ffcc99"
  },
  "deleted": {
    "textDecoration": "line-through"
  },
  "inserted": {
    "borderBottom": "1px dotted #eeebff",
    "textDecoration": "none"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "important": {
    "fontWeight": "bold",
    "color": "#c4b9fe"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "pre > code.highlight": {
    "Outline": ".4em solid #8a75f5",
    "OutlineOffset": ".4em"
  },
  ".line-numbers.line-numbers .line-numbers-rows": {
    "borderRightColor": "#2c2937"
  },
  ".line-numbers .line-numbers-rows > span:before": {
    "color": "#3c3949"
  },
  ".line-highlight.line-highlight": {
    "background": "linear-gradient(to right, rgba(224, 145, 66, 0.2) 70%, rgba(224, 145, 66, 0))"
  }
};

/***/ }),

/***/ 8875:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "fontFamily": "Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize": "14px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "background": "#322d29",
    "color": "#88786d"
  },
  "pre[class*=\"language-\"]": {
    "fontFamily": "Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize": "14px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "background": "#322d29",
    "color": "#88786d",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto"
  },
  "pre > code[class*=\"language-\"]": {
    "fontSize": "1em"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#6f5849"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#6f5849"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#6f5849"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#6f5849"
  },
  "pre[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#6f5849"
  },
  "pre[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#6f5849"
  },
  "code[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#6f5849"
  },
  "code[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#6f5849"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "padding": ".1em",
    "borderRadius": ".3em"
  },
  "comment": {
    "color": "#6a5f58"
  },
  "prolog": {
    "color": "#6a5f58"
  },
  "doctype": {
    "color": "#6a5f58"
  },
  "cdata": {
    "color": "#6a5f58"
  },
  "punctuation": {
    "color": "#6a5f58"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "tag": {
    "color": "#bfa05a"
  },
  "operator": {
    "color": "#bfa05a"
  },
  "number": {
    "color": "#bfa05a"
  },
  "property": {
    "color": "#88786d"
  },
  "function": {
    "color": "#88786d"
  },
  "tag-id": {
    "color": "#fff3eb"
  },
  "selector": {
    "color": "#fff3eb"
  },
  "atrule-id": {
    "color": "#fff3eb"
  },
  "code.language-javascript": {
    "color": "#a48774"
  },
  "attr-name": {
    "color": "#a48774"
  },
  "code.language-css": {
    "color": "#fcc440"
  },
  "code.language-scss": {
    "color": "#fcc440"
  },
  "boolean": {
    "color": "#fcc440"
  },
  "string": {
    "color": "#fcc440"
  },
  "entity": {
    "color": "#fcc440",
    "cursor": "help"
  },
  "url": {
    "color": "#fcc440"
  },
  ".language-css .token.string": {
    "color": "#fcc440"
  },
  ".language-scss .token.string": {
    "color": "#fcc440"
  },
  ".style .token.string": {
    "color": "#fcc440"
  },
  "attr-value": {
    "color": "#fcc440"
  },
  "keyword": {
    "color": "#fcc440"
  },
  "control": {
    "color": "#fcc440"
  },
  "directive": {
    "color": "#fcc440"
  },
  "unit": {
    "color": "#fcc440"
  },
  "statement": {
    "color": "#fcc440"
  },
  "regex": {
    "color": "#fcc440"
  },
  "atrule": {
    "color": "#fcc440"
  },
  "placeholder": {
    "color": "#fcc440"
  },
  "variable": {
    "color": "#fcc440"
  },
  "deleted": {
    "textDecoration": "line-through"
  },
  "inserted": {
    "borderBottom": "1px dotted #fff3eb",
    "textDecoration": "none"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "important": {
    "fontWeight": "bold",
    "color": "#a48774"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "pre > code.highlight": {
    "Outline": ".4em solid #816d5f",
    "OutlineOffset": ".4em"
  },
  ".line-numbers.line-numbers .line-numbers-rows": {
    "borderRightColor": "#35302b"
  },
  ".line-numbers .line-numbers-rows > span:before": {
    "color": "#46403d"
  },
  ".line-highlight.line-highlight": {
    "background": "linear-gradient(to right, rgba(191, 160, 90, 0.2) 70%, rgba(191, 160, 90, 0))"
  }
};

/***/ }),

/***/ 1945:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "fontFamily": "Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize": "14px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "background": "#2a2d2a",
    "color": "#687d68"
  },
  "pre[class*=\"language-\"]": {
    "fontFamily": "Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize": "14px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "background": "#2a2d2a",
    "color": "#687d68",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto"
  },
  "pre > code[class*=\"language-\"]": {
    "fontSize": "1em"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#435643"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#435643"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#435643"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#435643"
  },
  "pre[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#435643"
  },
  "pre[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#435643"
  },
  "code[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#435643"
  },
  "code[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#435643"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "padding": ".1em",
    "borderRadius": ".3em"
  },
  "comment": {
    "color": "#535f53"
  },
  "prolog": {
    "color": "#535f53"
  },
  "doctype": {
    "color": "#535f53"
  },
  "cdata": {
    "color": "#535f53"
  },
  "punctuation": {
    "color": "#535f53"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "tag": {
    "color": "#a2b34d"
  },
  "operator": {
    "color": "#a2b34d"
  },
  "number": {
    "color": "#a2b34d"
  },
  "property": {
    "color": "#687d68"
  },
  "function": {
    "color": "#687d68"
  },
  "tag-id": {
    "color": "#f0fff0"
  },
  "selector": {
    "color": "#f0fff0"
  },
  "atrule-id": {
    "color": "#f0fff0"
  },
  "code.language-javascript": {
    "color": "#b3d6b3"
  },
  "attr-name": {
    "color": "#b3d6b3"
  },
  "code.language-css": {
    "color": "#e5fb79"
  },
  "code.language-scss": {
    "color": "#e5fb79"
  },
  "boolean": {
    "color": "#e5fb79"
  },
  "string": {
    "color": "#e5fb79"
  },
  "entity": {
    "color": "#e5fb79",
    "cursor": "help"
  },
  "url": {
    "color": "#e5fb79"
  },
  ".language-css .token.string": {
    "color": "#e5fb79"
  },
  ".language-scss .token.string": {
    "color": "#e5fb79"
  },
  ".style .token.string": {
    "color": "#e5fb79"
  },
  "attr-value": {
    "color": "#e5fb79"
  },
  "keyword": {
    "color": "#e5fb79"
  },
  "control": {
    "color": "#e5fb79"
  },
  "directive": {
    "color": "#e5fb79"
  },
  "unit": {
    "color": "#e5fb79"
  },
  "statement": {
    "color": "#e5fb79"
  },
  "regex": {
    "color": "#e5fb79"
  },
  "atrule": {
    "color": "#e5fb79"
  },
  "placeholder": {
    "color": "#e5fb79"
  },
  "variable": {
    "color": "#e5fb79"
  },
  "deleted": {
    "textDecoration": "line-through"
  },
  "inserted": {
    "borderBottom": "1px dotted #f0fff0",
    "textDecoration": "none"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "important": {
    "fontWeight": "bold",
    "color": "#b3d6b3"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "pre > code.highlight": {
    "Outline": ".4em solid #5c705c",
    "OutlineOffset": ".4em"
  },
  ".line-numbers.line-numbers .line-numbers-rows": {
    "borderRightColor": "#2c302c"
  },
  ".line-numbers .line-numbers-rows > span:before": {
    "color": "#3b423b"
  },
  ".line-highlight.line-highlight": {
    "background": "linear-gradient(to right, rgba(162, 179, 77, 0.2) 70%, rgba(162, 179, 77, 0))"
  }
};

/***/ }),

/***/ 7110:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "fontFamily": "Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize": "14px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "background": "#faf8f5",
    "color": "#728fcb"
  },
  "pre[class*=\"language-\"]": {
    "fontFamily": "Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize": "14px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "background": "#faf8f5",
    "color": "#728fcb",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto"
  },
  "pre > code[class*=\"language-\"]": {
    "fontSize": "1em"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#faf8f5"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#faf8f5"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#faf8f5"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#faf8f5"
  },
  "pre[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#faf8f5"
  },
  "pre[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#faf8f5"
  },
  "code[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#faf8f5"
  },
  "code[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#faf8f5"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "padding": ".1em",
    "borderRadius": ".3em"
  },
  "comment": {
    "color": "#b6ad9a"
  },
  "prolog": {
    "color": "#b6ad9a"
  },
  "doctype": {
    "color": "#b6ad9a"
  },
  "cdata": {
    "color": "#b6ad9a"
  },
  "punctuation": {
    "color": "#b6ad9a"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "tag": {
    "color": "#063289"
  },
  "operator": {
    "color": "#063289"
  },
  "number": {
    "color": "#063289"
  },
  "property": {
    "color": "#b29762"
  },
  "function": {
    "color": "#b29762"
  },
  "tag-id": {
    "color": "#2d2006"
  },
  "selector": {
    "color": "#2d2006"
  },
  "atrule-id": {
    "color": "#2d2006"
  },
  "code.language-javascript": {
    "color": "#896724"
  },
  "attr-name": {
    "color": "#896724"
  },
  "code.language-css": {
    "color": "#728fcb"
  },
  "code.language-scss": {
    "color": "#728fcb"
  },
  "boolean": {
    "color": "#728fcb"
  },
  "string": {
    "color": "#728fcb"
  },
  "entity": {
    "color": "#728fcb",
    "cursor": "help"
  },
  "url": {
    "color": "#728fcb"
  },
  ".language-css .token.string": {
    "color": "#728fcb"
  },
  ".language-scss .token.string": {
    "color": "#728fcb"
  },
  ".style .token.string": {
    "color": "#728fcb"
  },
  "attr-value": {
    "color": "#728fcb"
  },
  "keyword": {
    "color": "#728fcb"
  },
  "control": {
    "color": "#728fcb"
  },
  "directive": {
    "color": "#728fcb"
  },
  "unit": {
    "color": "#728fcb"
  },
  "statement": {
    "color": "#728fcb"
  },
  "regex": {
    "color": "#728fcb"
  },
  "atrule": {
    "color": "#728fcb"
  },
  "placeholder": {
    "color": "#93abdc"
  },
  "variable": {
    "color": "#93abdc"
  },
  "deleted": {
    "textDecoration": "line-through"
  },
  "inserted": {
    "borderBottom": "1px dotted #2d2006",
    "textDecoration": "none"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "important": {
    "fontWeight": "bold",
    "color": "#896724"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "pre > code.highlight": {
    "Outline": ".4em solid #896724",
    "OutlineOffset": ".4em"
  },
  ".line-numbers.line-numbers .line-numbers-rows": {
    "borderRightColor": "#ece8de"
  },
  ".line-numbers .line-numbers-rows > span:before": {
    "color": "#cdc4b1"
  },
  ".line-highlight.line-highlight": {
    "background": "linear-gradient(to right, rgba(45, 32, 6, 0.2) 70%, rgba(45, 32, 6, 0))"
  }
};

/***/ }),

/***/ 8047:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "fontFamily": "Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize": "14px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "background": "#1d262f",
    "color": "#57718e"
  },
  "pre[class*=\"language-\"]": {
    "fontFamily": "Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize": "14px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "background": "#1d262f",
    "color": "#57718e",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto"
  },
  "pre > code[class*=\"language-\"]": {
    "fontSize": "1em"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#004a9e"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#004a9e"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#004a9e"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#004a9e"
  },
  "pre[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#004a9e"
  },
  "pre[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#004a9e"
  },
  "code[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#004a9e"
  },
  "code[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#004a9e"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "padding": ".1em",
    "borderRadius": ".3em"
  },
  "comment": {
    "color": "#4a5f78"
  },
  "prolog": {
    "color": "#4a5f78"
  },
  "doctype": {
    "color": "#4a5f78"
  },
  "cdata": {
    "color": "#4a5f78"
  },
  "punctuation": {
    "color": "#4a5f78"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "tag": {
    "color": "#0aa370"
  },
  "operator": {
    "color": "#0aa370"
  },
  "number": {
    "color": "#0aa370"
  },
  "property": {
    "color": "#57718e"
  },
  "function": {
    "color": "#57718e"
  },
  "tag-id": {
    "color": "#ebf4ff"
  },
  "selector": {
    "color": "#ebf4ff"
  },
  "atrule-id": {
    "color": "#ebf4ff"
  },
  "code.language-javascript": {
    "color": "#7eb6f6"
  },
  "attr-name": {
    "color": "#7eb6f6"
  },
  "code.language-css": {
    "color": "#47ebb4"
  },
  "code.language-scss": {
    "color": "#47ebb4"
  },
  "boolean": {
    "color": "#47ebb4"
  },
  "string": {
    "color": "#47ebb4"
  },
  "entity": {
    "color": "#47ebb4",
    "cursor": "help"
  },
  "url": {
    "color": "#47ebb4"
  },
  ".language-css .token.string": {
    "color": "#47ebb4"
  },
  ".language-scss .token.string": {
    "color": "#47ebb4"
  },
  ".style .token.string": {
    "color": "#47ebb4"
  },
  "attr-value": {
    "color": "#47ebb4"
  },
  "keyword": {
    "color": "#47ebb4"
  },
  "control": {
    "color": "#47ebb4"
  },
  "directive": {
    "color": "#47ebb4"
  },
  "unit": {
    "color": "#47ebb4"
  },
  "statement": {
    "color": "#47ebb4"
  },
  "regex": {
    "color": "#47ebb4"
  },
  "atrule": {
    "color": "#47ebb4"
  },
  "placeholder": {
    "color": "#47ebb4"
  },
  "variable": {
    "color": "#47ebb4"
  },
  "deleted": {
    "textDecoration": "line-through"
  },
  "inserted": {
    "borderBottom": "1px dotted #ebf4ff",
    "textDecoration": "none"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "important": {
    "fontWeight": "bold",
    "color": "#7eb6f6"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "pre > code.highlight": {
    "Outline": ".4em solid #34659d",
    "OutlineOffset": ".4em"
  },
  ".line-numbers.line-numbers .line-numbers-rows": {
    "borderRightColor": "#1f2932"
  },
  ".line-numbers .line-numbers-rows > span:before": {
    "color": "#2c3847"
  },
  ".line-highlight.line-highlight": {
    "background": "linear-gradient(to right, rgba(10, 163, 112, 0.2) 70%, rgba(10, 163, 112, 0))"
  }
};

/***/ }),

/***/ 7000:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "fontFamily": "Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize": "14px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "background": "#24242e",
    "color": "#767693"
  },
  "pre[class*=\"language-\"]": {
    "fontFamily": "Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize": "14px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "background": "#24242e",
    "color": "#767693",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto"
  },
  "pre > code[class*=\"language-\"]": {
    "fontSize": "1em"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#5151e6"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#5151e6"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#5151e6"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#5151e6"
  },
  "pre[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#5151e6"
  },
  "pre[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#5151e6"
  },
  "code[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#5151e6"
  },
  "code[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#5151e6"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "padding": ".1em",
    "borderRadius": ".3em"
  },
  "comment": {
    "color": "#5b5b76"
  },
  "prolog": {
    "color": "#5b5b76"
  },
  "doctype": {
    "color": "#5b5b76"
  },
  "cdata": {
    "color": "#5b5b76"
  },
  "punctuation": {
    "color": "#5b5b76"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "tag": {
    "color": "#dd672c"
  },
  "operator": {
    "color": "#dd672c"
  },
  "number": {
    "color": "#dd672c"
  },
  "property": {
    "color": "#767693"
  },
  "function": {
    "color": "#767693"
  },
  "tag-id": {
    "color": "#ebebff"
  },
  "selector": {
    "color": "#ebebff"
  },
  "atrule-id": {
    "color": "#ebebff"
  },
  "code.language-javascript": {
    "color": "#aaaaca"
  },
  "attr-name": {
    "color": "#aaaaca"
  },
  "code.language-css": {
    "color": "#fe8c52"
  },
  "code.language-scss": {
    "color": "#fe8c52"
  },
  "boolean": {
    "color": "#fe8c52"
  },
  "string": {
    "color": "#fe8c52"
  },
  "entity": {
    "color": "#fe8c52",
    "cursor": "help"
  },
  "url": {
    "color": "#fe8c52"
  },
  ".language-css .token.string": {
    "color": "#fe8c52"
  },
  ".language-scss .token.string": {
    "color": "#fe8c52"
  },
  ".style .token.string": {
    "color": "#fe8c52"
  },
  "attr-value": {
    "color": "#fe8c52"
  },
  "keyword": {
    "color": "#fe8c52"
  },
  "control": {
    "color": "#fe8c52"
  },
  "directive": {
    "color": "#fe8c52"
  },
  "unit": {
    "color": "#fe8c52"
  },
  "statement": {
    "color": "#fe8c52"
  },
  "regex": {
    "color": "#fe8c52"
  },
  "atrule": {
    "color": "#fe8c52"
  },
  "placeholder": {
    "color": "#fe8c52"
  },
  "variable": {
    "color": "#fe8c52"
  },
  "deleted": {
    "textDecoration": "line-through"
  },
  "inserted": {
    "borderBottom": "1px dotted #ebebff",
    "textDecoration": "none"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "important": {
    "fontWeight": "bold",
    "color": "#aaaaca"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "pre > code.highlight": {
    "Outline": ".4em solid #7676f4",
    "OutlineOffset": ".4em"
  },
  ".line-numbers.line-numbers .line-numbers-rows": {
    "borderRightColor": "#262631"
  },
  ".line-numbers .line-numbers-rows > span:before": {
    "color": "#393949"
  },
  ".line-highlight.line-highlight": {
    "background": "linear-gradient(to right, rgba(221, 103, 44, 0.2) 70%, rgba(221, 103, 44, 0))"
  }
};

/***/ }),

/***/ 3075:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "background": "black",
    "color": "white",
    "boxShadow": "-.3em 0 0 .3em black, .3em 0 0 .3em black"
  },
  "pre[class*=\"language-\"]": {
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": ".4em .8em",
    "margin": ".5em 0",
    "overflow": "auto",
    "background": "url('data:image/svg+xml;charset=utf-8,<svg%20version%3D\"1.1\"%20xmlns%3D\"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\"%20width%3D\"100\"%20height%3D\"100\"%20fill%3D\"rgba(0%2C0%2C0%2C.2)\">%0D%0A<polygon%20points%3D\"0%2C50%2050%2C0%200%2C0\"%20%2F>%0D%0A<polygon%20points%3D\"0%2C100%2050%2C100%20100%2C50%20100%2C0\"%20%2F>%0D%0A<%2Fsvg>')",
    "backgroundSize": "1em 1em"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "padding": ".2em",
    "borderRadius": ".3em",
    "boxShadow": "none",
    "whiteSpace": "normal"
  },
  "comment": {
    "color": "#aaa"
  },
  "prolog": {
    "color": "#aaa"
  },
  "doctype": {
    "color": "#aaa"
  },
  "cdata": {
    "color": "#aaa"
  },
  "punctuation": {
    "color": "#999"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "property": {
    "color": "#0cf"
  },
  "tag": {
    "color": "#0cf"
  },
  "boolean": {
    "color": "#0cf"
  },
  "number": {
    "color": "#0cf"
  },
  "constant": {
    "color": "#0cf"
  },
  "symbol": {
    "color": "#0cf"
  },
  "selector": {
    "color": "yellow"
  },
  "attr-name": {
    "color": "yellow"
  },
  "string": {
    "color": "yellow"
  },
  "char": {
    "color": "yellow"
  },
  "builtin": {
    "color": "yellow"
  },
  "operator": {
    "color": "yellowgreen"
  },
  "entity": {
    "color": "yellowgreen",
    "cursor": "help"
  },
  "url": {
    "color": "yellowgreen"
  },
  ".language-css .token.string": {
    "color": "yellowgreen"
  },
  "variable": {
    "color": "yellowgreen"
  },
  "inserted": {
    "color": "yellowgreen"
  },
  "atrule": {
    "color": "deeppink"
  },
  "attr-value": {
    "color": "deeppink"
  },
  "keyword": {
    "color": "deeppink"
  },
  "regex": {
    "color": "orange"
  },
  "important": {
    "color": "orange",
    "fontWeight": "bold"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "deleted": {
    "color": "red"
  },
  "pre.diff-highlight.diff-highlight > code .token.deleted:not(.prefix)": {
    "backgroundColor": "rgba(255, 0, 0, .3)",
    "display": "inline"
  },
  "pre > code.diff-highlight.diff-highlight .token.deleted:not(.prefix)": {
    "backgroundColor": "rgba(255, 0, 0, .3)",
    "display": "inline"
  },
  "pre.diff-highlight.diff-highlight > code .token.inserted:not(.prefix)": {
    "backgroundColor": "rgba(0, 255, 128, .3)",
    "display": "inline"
  },
  "pre > code.diff-highlight.diff-highlight .token.inserted:not(.prefix)": {
    "backgroundColor": "rgba(0, 255, 128, .3)",
    "display": "inline"
  }
};

/***/ }),

/***/ 9087:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#393A34",
    "fontFamily": "\"Consolas\", \"Bitstream Vera Sans Mono\", \"Courier New\", Courier, monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "fontSize": ".9em",
    "lineHeight": "1.2em",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#393A34",
    "fontFamily": "\"Consolas\", \"Bitstream Vera Sans Mono\", \"Courier New\", Courier, monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "fontSize": ".9em",
    "lineHeight": "1.2em",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto",
    "border": "1px solid #dddddd",
    "backgroundColor": "white"
  },
  "pre > code[class*=\"language-\"]": {
    "fontSize": "1em"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "background": "#b3d4fc"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "background": "#b3d4fc"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "background": "#b3d4fc"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "background": "#b3d4fc"
  },
  "pre[class*=\"language-\"]::selection": {
    "background": "#b3d4fc"
  },
  "pre[class*=\"language-\"] ::selection": {
    "background": "#b3d4fc"
  },
  "code[class*=\"language-\"]::selection": {
    "background": "#b3d4fc"
  },
  "code[class*=\"language-\"] ::selection": {
    "background": "#b3d4fc"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "padding": ".2em",
    "paddingTop": "1px",
    "paddingBottom": "1px",
    "background": "#f8f8f8",
    "border": "1px solid #dddddd"
  },
  "comment": {
    "color": "#999988",
    "fontStyle": "italic"
  },
  "prolog": {
    "color": "#999988",
    "fontStyle": "italic"
  },
  "doctype": {
    "color": "#999988",
    "fontStyle": "italic"
  },
  "cdata": {
    "color": "#999988",
    "fontStyle": "italic"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "string": {
    "color": "#e3116c"
  },
  "attr-value": {
    "color": "#e3116c"
  },
  "punctuation": {
    "color": "#393A34"
  },
  "operator": {
    "color": "#393A34"
  },
  "entity": {
    "color": "#36acaa"
  },
  "url": {
    "color": "#36acaa"
  },
  "symbol": {
    "color": "#36acaa"
  },
  "number": {
    "color": "#36acaa"
  },
  "boolean": {
    "color": "#36acaa"
  },
  "variable": {
    "color": "#36acaa"
  },
  "constant": {
    "color": "#36acaa"
  },
  "property": {
    "color": "#36acaa"
  },
  "regex": {
    "color": "#36acaa"
  },
  "inserted": {
    "color": "#36acaa"
  },
  "atrule": {
    "color": "#00a4db"
  },
  "keyword": {
    "color": "#00a4db"
  },
  "attr-name": {
    "color": "#00a4db"
  },
  ".language-autohotkey .token.selector": {
    "color": "#00a4db"
  },
  "function": {
    "color": "#9a050f",
    "fontWeight": "bold"
  },
  "deleted": {
    "color": "#9a050f"
  },
  ".language-autohotkey .token.tag": {
    "color": "#9a050f"
  },
  "tag": {
    "color": "#00009f"
  },
  "selector": {
    "color": "#00009f"
  },
  ".language-autohotkey .token.keyword": {
    "color": "#00009f"
  },
  "important": {
    "fontWeight": "bold"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  }
};

/***/ }),

/***/ 5322:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#ebdbb2",
    "fontFamily": "Consolas, Monaco, \"Andale Mono\", monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#ebdbb2",
    "fontFamily": "Consolas, Monaco, \"Andale Mono\", monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": "0.5em 0",
    "overflow": "auto",
    "background": "#1d2021"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "color": "#fbf1c7",
    "background": "#7c6f64"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "color": "#fbf1c7",
    "background": "#7c6f64"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "color": "#fbf1c7",
    "background": "#7c6f64"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "color": "#fbf1c7",
    "background": "#7c6f64"
  },
  "pre[class*=\"language-\"]::selection": {
    "color": "#fbf1c7",
    "background": "#7c6f64"
  },
  "pre[class*=\"language-\"] ::selection": {
    "color": "#fbf1c7",
    "background": "#7c6f64"
  },
  "code[class*=\"language-\"]::selection": {
    "color": "#fbf1c7",
    "background": "#7c6f64"
  },
  "code[class*=\"language-\"] ::selection": {
    "color": "#fbf1c7",
    "background": "#7c6f64"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#1d2021",
    "padding": "0.1em",
    "borderRadius": "0.3em"
  },
  "comment": {
    "color": "#a89984"
  },
  "prolog": {
    "color": "#a89984"
  },
  "cdata": {
    "color": "#a89984"
  },
  "delimiter": {
    "color": "#fb4934"
  },
  "boolean": {
    "color": "#fb4934"
  },
  "keyword": {
    "color": "#fb4934"
  },
  "selector": {
    "color": "#fb4934"
  },
  "important": {
    "color": "#fb4934"
  },
  "atrule": {
    "color": "#fb4934"
  },
  "operator": {
    "color": "#a89984"
  },
  "punctuation": {
    "color": "#a89984"
  },
  "attr-name": {
    "color": "#a89984"
  },
  "tag": {
    "color": "#fabd2f"
  },
  "tag.punctuation": {
    "color": "#fabd2f"
  },
  "doctype": {
    "color": "#fabd2f"
  },
  "builtin": {
    "color": "#fabd2f"
  },
  "entity": {
    "color": "#d3869b"
  },
  "number": {
    "color": "#d3869b"
  },
  "symbol": {
    "color": "#d3869b"
  },
  "property": {
    "color": "#fb4934"
  },
  "constant": {
    "color": "#fb4934"
  },
  "variable": {
    "color": "#fb4934"
  },
  "string": {
    "color": "#b8bb26"
  },
  "char": {
    "color": "#b8bb26"
  },
  "attr-value": {
    "color": "#a89984"
  },
  "attr-value.punctuation": {
    "color": "#a89984"
  },
  "url": {
    "color": "#b8bb26",
    "textDecoration": "underline"
  },
  "function": {
    "color": "#fabd2f"
  },
  "regex": {
    "background": "#b8bb26"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "inserted": {
    "background": "#a89984"
  },
  "deleted": {
    "background": "#fb4934"
  }
};

/***/ }),

/***/ 1104:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#3c3836",
    "fontFamily": "Consolas, Monaco, \"Andale Mono\", monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#3c3836",
    "fontFamily": "Consolas, Monaco, \"Andale Mono\", monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": "0.5em 0",
    "overflow": "auto",
    "background": "#f9f5d7"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "color": "#282828",
    "background": "#a89984"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "color": "#282828",
    "background": "#a89984"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "color": "#282828",
    "background": "#a89984"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "color": "#282828",
    "background": "#a89984"
  },
  "pre[class*=\"language-\"]::selection": {
    "color": "#282828",
    "background": "#a89984"
  },
  "pre[class*=\"language-\"] ::selection": {
    "color": "#282828",
    "background": "#a89984"
  },
  "code[class*=\"language-\"]::selection": {
    "color": "#282828",
    "background": "#a89984"
  },
  "code[class*=\"language-\"] ::selection": {
    "color": "#282828",
    "background": "#a89984"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#f9f5d7",
    "padding": "0.1em",
    "borderRadius": "0.3em"
  },
  "comment": {
    "color": "#7c6f64"
  },
  "prolog": {
    "color": "#7c6f64"
  },
  "cdata": {
    "color": "#7c6f64"
  },
  "delimiter": {
    "color": "#9d0006"
  },
  "boolean": {
    "color": "#9d0006"
  },
  "keyword": {
    "color": "#9d0006"
  },
  "selector": {
    "color": "#9d0006"
  },
  "important": {
    "color": "#9d0006"
  },
  "atrule": {
    "color": "#9d0006"
  },
  "operator": {
    "color": "#7c6f64"
  },
  "punctuation": {
    "color": "#7c6f64"
  },
  "attr-name": {
    "color": "#7c6f64"
  },
  "tag": {
    "color": "#b57614"
  },
  "tag.punctuation": {
    "color": "#b57614"
  },
  "doctype": {
    "color": "#b57614"
  },
  "builtin": {
    "color": "#b57614"
  },
  "entity": {
    "color": "#8f3f71"
  },
  "number": {
    "color": "#8f3f71"
  },
  "symbol": {
    "color": "#8f3f71"
  },
  "property": {
    "color": "#9d0006"
  },
  "constant": {
    "color": "#9d0006"
  },
  "variable": {
    "color": "#9d0006"
  },
  "string": {
    "color": "#797403"
  },
  "char": {
    "color": "#797403"
  },
  "attr-value": {
    "color": "#7c6f64"
  },
  "attr-value.punctuation": {
    "color": "#7c6f64"
  },
  "url": {
    "color": "#797403",
    "textDecoration": "underline"
  },
  "function": {
    "color": "#b57614"
  },
  "regex": {
    "background": "#797403"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "inserted": {
    "background": "#7c6f64"
  },
  "deleted": {
    "background": "#9d0006"
  }
};

/***/ }),

/***/ 5369:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*='language-']": {
    "color": "#d6e7ff",
    "background": "#030314",
    "textShadow": "none",
    "fontFamily": "Consolas, Monaco, \"Andale Mono\", \"Ubuntu Mono\", monospace",
    "fontSize": "1em",
    "lineHeight": "1.5",
    "letterSpacing": ".2px",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "textAlign": "left",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*='language-']": {
    "color": "#d6e7ff",
    "background": "#030314",
    "textShadow": "none",
    "fontFamily": "Consolas, Monaco, \"Andale Mono\", \"Ubuntu Mono\", monospace",
    "fontSize": "1em",
    "lineHeight": "1.5",
    "letterSpacing": ".2px",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "textAlign": "left",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "border": "1px solid #2a4555",
    "borderRadius": "5px",
    "padding": "1.5em 1em",
    "margin": "1em 0",
    "overflow": "auto"
  },
  "pre[class*='language-']::-moz-selection": {
    "color": "inherit",
    "background": "#1d3b54",
    "textShadow": "none"
  },
  "pre[class*='language-'] ::-moz-selection": {
    "color": "inherit",
    "background": "#1d3b54",
    "textShadow": "none"
  },
  "code[class*='language-']::-moz-selection": {
    "color": "inherit",
    "background": "#1d3b54",
    "textShadow": "none"
  },
  "code[class*='language-'] ::-moz-selection": {
    "color": "inherit",
    "background": "#1d3b54",
    "textShadow": "none"
  },
  "pre[class*='language-']::selection": {
    "color": "inherit",
    "background": "#1d3b54",
    "textShadow": "none"
  },
  "pre[class*='language-'] ::selection": {
    "color": "inherit",
    "background": "#1d3b54",
    "textShadow": "none"
  },
  "code[class*='language-']::selection": {
    "color": "inherit",
    "background": "#1d3b54",
    "textShadow": "none"
  },
  "code[class*='language-'] ::selection": {
    "color": "inherit",
    "background": "#1d3b54",
    "textShadow": "none"
  },
  ":not(pre) > code[class*='language-']": {
    "color": "#f0f6f6",
    "background": "#2a4555",
    "padding": "0.2em 0.3em",
    "borderRadius": "0.2em",
    "boxDecorationBreak": "clone"
  },
  "comment": {
    "color": "#446e69"
  },
  "prolog": {
    "color": "#446e69"
  },
  "doctype": {
    "color": "#446e69"
  },
  "cdata": {
    "color": "#446e69"
  },
  "punctuation": {
    "color": "#d6b007"
  },
  "property": {
    "color": "#d6e7ff"
  },
  "tag": {
    "color": "#d6e7ff"
  },
  "boolean": {
    "color": "#d6e7ff"
  },
  "number": {
    "color": "#d6e7ff"
  },
  "constant": {
    "color": "#d6e7ff"
  },
  "symbol": {
    "color": "#d6e7ff"
  },
  "deleted": {
    "color": "#d6e7ff"
  },
  "selector": {
    "color": "#e60067"
  },
  "attr-name": {
    "color": "#e60067"
  },
  "builtin": {
    "color": "#e60067"
  },
  "inserted": {
    "color": "#e60067"
  },
  "string": {
    "color": "#49c6ec"
  },
  "char": {
    "color": "#49c6ec"
  },
  "operator": {
    "color": "#ec8e01",
    "background": "transparent"
  },
  "entity": {
    "color": "#ec8e01",
    "background": "transparent"
  },
  "url": {
    "color": "#ec8e01",
    "background": "transparent"
  },
  ".language-css .token.string": {
    "color": "#ec8e01",
    "background": "transparent"
  },
  ".style .token.string": {
    "color": "#ec8e01",
    "background": "transparent"
  },
  "atrule": {
    "color": "#0fe468"
  },
  "attr-value": {
    "color": "#0fe468"
  },
  "keyword": {
    "color": "#0fe468"
  },
  "function": {
    "color": "#78f3e9"
  },
  "class-name": {
    "color": "#78f3e9"
  },
  "regex": {
    "color": "#d6e7ff"
  },
  "important": {
    "color": "#d6e7ff"
  },
  "variable": {
    "color": "#d6e7ff"
  }
};

/***/ }),

/***/ 6508:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "fontFamily": "\"Fira Mono\", Menlo, Monaco, \"Lucida Console\", \"Courier New\", Courier, monospace",
    "fontSize": "16px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "wordSpacing": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "whiteSpace": "pre-wrap",
    "wordBreak": "break-all",
    "wordWrap": "break-word",
    "background": "#322931",
    "color": "#b9b5b8"
  },
  "pre[class*=\"language-\"]": {
    "fontFamily": "\"Fira Mono\", Menlo, Monaco, \"Lucida Console\", \"Courier New\", Courier, monospace",
    "fontSize": "16px",
    "lineHeight": "1.375",
    "direction": "ltr",
    "textAlign": "left",
    "wordSpacing": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "whiteSpace": "pre-wrap",
    "wordBreak": "break-all",
    "wordWrap": "break-word",
    "background": "#322931",
    "color": "#b9b5b8",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto"
  },
  "pre > code[class*=\"language-\"]": {
    "fontSize": "1em"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "padding": ".1em",
    "borderRadius": ".3em"
  },
  "comment": {
    "color": "#797379"
  },
  "prolog": {
    "color": "#797379"
  },
  "doctype": {
    "color": "#797379"
  },
  "cdata": {
    "color": "#797379"
  },
  "punctuation": {
    "color": "#b9b5b8"
  },
  ".namespace": {
    "Opacity": ".7"
  },
  "null": {
    "color": "#fd8b19"
  },
  "operator": {
    "color": "#fd8b19"
  },
  "boolean": {
    "color": "#fd8b19"
  },
  "number": {
    "color": "#fd8b19"
  },
  "property": {
    "color": "#fdcc59"
  },
  "tag": {
    "color": "#1290bf"
  },
  "string": {
    "color": "#149b93"
  },
  "selector": {
    "color": "#c85e7c"
  },
  "attr-name": {
    "color": "#fd8b19"
  },
  "entity": {
    "color": "#149b93",
    "cursor": "help"
  },
  "url": {
    "color": "#149b93"
  },
  ".language-css .token.string": {
    "color": "#149b93"
  },
  ".style .token.string": {
    "color": "#149b93"
  },
  "attr-value": {
    "color": "#8fc13e"
  },
  "keyword": {
    "color": "#8fc13e"
  },
  "control": {
    "color": "#8fc13e"
  },
  "directive": {
    "color": "#8fc13e"
  },
  "unit": {
    "color": "#8fc13e"
  },
  "statement": {
    "color": "#149b93"
  },
  "regex": {
    "color": "#149b93"
  },
  "atrule": {
    "color": "#149b93"
  },
  "placeholder": {
    "color": "#1290bf"
  },
  "variable": {
    "color": "#1290bf"
  },
  "important": {
    "color": "#dd464c",
    "fontWeight": "bold"
  },
  "pre > code.highlight": {
    "Outline": ".4em solid red",
    "OutlineOffset": ".4em"
  }
};

/***/ }),

/***/ 8276:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;


var _interopRequireDefault = __webpack_require__(9259);
__webpack_unused_export__ = ({
  value: true
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _a11yDark["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _atomDark["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _base16Ateliersulphurpool["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _cb["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _coldarkCold["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _coldarkDark["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _coy["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _coyWithoutShadows["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _darcula["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _dark["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _dracula["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _duotoneDark["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _duotoneEarth["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _duotoneForest["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _duotoneLight["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _duotoneSea["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _duotoneSpace["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _funky["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _ghcolors["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _gruvboxDark["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _gruvboxLight["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _holiTheme["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _hopscotch["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _lucario["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _materialDark["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _materialLight["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _materialOceanic["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _nightOwl["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _nord["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _okaidia["default"];
  }
});
Object.defineProperty(exports, "vk", ({
  enumerable: true,
  get: function get() {
    return _oneDark["default"];
  }
}));
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _oneLight["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _pojoaque["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _prism["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _shadesOfPurple["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _solarizedDarkAtom["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _solarizedlight["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _synthwave["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _tomorrow["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _twilight["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _vs["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _vscDarkPlus["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _xonokai["default"];
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function get() {
    return _zTouch["default"];
  }
});
var _coy = _interopRequireDefault(__webpack_require__(8184));
var _dark = _interopRequireDefault(__webpack_require__(6760));
var _funky = _interopRequireDefault(__webpack_require__(3075));
var _okaidia = _interopRequireDefault(__webpack_require__(2133));
var _solarizedlight = _interopRequireDefault(__webpack_require__(6440));
var _tomorrow = _interopRequireDefault(__webpack_require__(8940));
var _twilight = _interopRequireDefault(__webpack_require__(6015));
var _prism = _interopRequireDefault(__webpack_require__(4837));
var _a11yDark = _interopRequireDefault(__webpack_require__(7388));
var _atomDark = _interopRequireDefault(__webpack_require__(7782));
var _base16Ateliersulphurpool = _interopRequireDefault(__webpack_require__(6628));
var _cb = _interopRequireDefault(__webpack_require__(4243));
var _coldarkCold = _interopRequireDefault(__webpack_require__(3747));
var _coldarkDark = _interopRequireDefault(__webpack_require__(2618));
var _coyWithoutShadows = _interopRequireDefault(__webpack_require__(4450));
var _darcula = _interopRequireDefault(__webpack_require__(1539));
var _dracula = _interopRequireDefault(__webpack_require__(9775));
var _duotoneDark = _interopRequireDefault(__webpack_require__(6414));
var _duotoneEarth = _interopRequireDefault(__webpack_require__(8875));
var _duotoneForest = _interopRequireDefault(__webpack_require__(1945));
var _duotoneLight = _interopRequireDefault(__webpack_require__(7110));
var _duotoneSea = _interopRequireDefault(__webpack_require__(8047));
var _duotoneSpace = _interopRequireDefault(__webpack_require__(7000));
var _ghcolors = _interopRequireDefault(__webpack_require__(9087));
var _gruvboxDark = _interopRequireDefault(__webpack_require__(5322));
var _gruvboxLight = _interopRequireDefault(__webpack_require__(1104));
var _holiTheme = _interopRequireDefault(__webpack_require__(5369));
var _hopscotch = _interopRequireDefault(__webpack_require__(6508));
var _lucario = _interopRequireDefault(__webpack_require__(3887));
var _materialDark = _interopRequireDefault(__webpack_require__(9045));
var _materialLight = _interopRequireDefault(__webpack_require__(8826));
var _materialOceanic = _interopRequireDefault(__webpack_require__(7825));
var _nightOwl = _interopRequireDefault(__webpack_require__(7472));
var _nord = _interopRequireDefault(__webpack_require__(3660));
var _oneDark = _interopRequireDefault(__webpack_require__(7266));
var _oneLight = _interopRequireDefault(__webpack_require__(4310));
var _pojoaque = _interopRequireDefault(__webpack_require__(1487));
var _shadesOfPurple = _interopRequireDefault(__webpack_require__(5869));
var _solarizedDarkAtom = _interopRequireDefault(__webpack_require__(4983));
var _synthwave = _interopRequireDefault(__webpack_require__(5404));
var _vs = _interopRequireDefault(__webpack_require__(9249));
var _vscDarkPlus = _interopRequireDefault(__webpack_require__(2096));
var _xonokai = _interopRequireDefault(__webpack_require__(4872));
var _zTouch = _interopRequireDefault(__webpack_require__(9928));

/***/ }),

/***/ 3887:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#f8f8f2",
    "background": "none",
    "textShadow": "0 1px rgba(0, 0, 0, 0.3)",
    "fontFamily": "Monaco, Consolas, 'Andale Mono', 'Ubuntu Mono', monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#f8f8f2",
    "background": "#263E52",
    "textShadow": "0 1px rgba(0, 0, 0, 0.3)",
    "fontFamily": "Monaco, Consolas, 'Andale Mono', 'Ubuntu Mono', monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto",
    "borderRadius": "0.3em"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#263E52",
    "padding": ".1em",
    "borderRadius": ".3em",
    "whiteSpace": "normal"
  },
  "comment": {
    "color": "#5c98cd"
  },
  "prolog": {
    "color": "#5c98cd"
  },
  "doctype": {
    "color": "#5c98cd"
  },
  "cdata": {
    "color": "#5c98cd"
  },
  "punctuation": {
    "color": "#f8f8f2"
  },
  ".namespace": {
    "Opacity": ".7"
  },
  "property": {
    "color": "#F05E5D"
  },
  "tag": {
    "color": "#F05E5D"
  },
  "constant": {
    "color": "#F05E5D"
  },
  "symbol": {
    "color": "#F05E5D"
  },
  "deleted": {
    "color": "#F05E5D"
  },
  "boolean": {
    "color": "#BC94F9"
  },
  "number": {
    "color": "#BC94F9"
  },
  "selector": {
    "color": "#FCFCD6"
  },
  "attr-name": {
    "color": "#FCFCD6"
  },
  "string": {
    "color": "#FCFCD6"
  },
  "char": {
    "color": "#FCFCD6"
  },
  "builtin": {
    "color": "#FCFCD6"
  },
  "inserted": {
    "color": "#FCFCD6"
  },
  "operator": {
    "color": "#f8f8f2"
  },
  "entity": {
    "color": "#f8f8f2",
    "cursor": "help"
  },
  "url": {
    "color": "#f8f8f2"
  },
  ".language-css .token.string": {
    "color": "#f8f8f2"
  },
  ".style .token.string": {
    "color": "#f8f8f2"
  },
  "variable": {
    "color": "#f8f8f2"
  },
  "atrule": {
    "color": "#66D8EF"
  },
  "attr-value": {
    "color": "#66D8EF"
  },
  "function": {
    "color": "#66D8EF"
  },
  "class-name": {
    "color": "#66D8EF"
  },
  "keyword": {
    "color": "#6EB26E"
  },
  "regex": {
    "color": "#F05E5D"
  },
  "important": {
    "color": "#F05E5D",
    "fontWeight": "bold"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  }
};

/***/ }),

/***/ 9045:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "color": "#eee",
    "background": "#2f2f2f",
    "fontFamily": "Roboto Mono, monospace",
    "fontSize": "1em",
    "lineHeight": "1.5em",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "color": "#eee",
    "background": "#2f2f2f",
    "fontFamily": "Roboto Mono, monospace",
    "fontSize": "1em",
    "lineHeight": "1.5em",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "overflow": "auto",
    "position": "relative",
    "margin": "0.5em 0",
    "padding": "1.25em 1em"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "background": "#363636"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "background": "#363636"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "background": "#363636"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "background": "#363636"
  },
  "code[class*=\"language-\"]::selection": {
    "background": "#363636"
  },
  "pre[class*=\"language-\"]::selection": {
    "background": "#363636"
  },
  "code[class*=\"language-\"] ::selection": {
    "background": "#363636"
  },
  "pre[class*=\"language-\"] ::selection": {
    "background": "#363636"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "whiteSpace": "normal",
    "borderRadius": "0.2em",
    "padding": "0.1em"
  },
  ".language-css > code": {
    "color": "#fd9170"
  },
  ".language-sass > code": {
    "color": "#fd9170"
  },
  ".language-scss > code": {
    "color": "#fd9170"
  },
  "[class*=\"language-\"] .namespace": {
    "Opacity": "0.7"
  },
  "atrule": {
    "color": "#c792ea"
  },
  "attr-name": {
    "color": "#ffcb6b"
  },
  "attr-value": {
    "color": "#a5e844"
  },
  "attribute": {
    "color": "#a5e844"
  },
  "boolean": {
    "color": "#c792ea"
  },
  "builtin": {
    "color": "#ffcb6b"
  },
  "cdata": {
    "color": "#80cbc4"
  },
  "char": {
    "color": "#80cbc4"
  },
  "class": {
    "color": "#ffcb6b"
  },
  "class-name": {
    "color": "#f2ff00"
  },
  "comment": {
    "color": "#616161"
  },
  "constant": {
    "color": "#c792ea"
  },
  "deleted": {
    "color": "#ff6666"
  },
  "doctype": {
    "color": "#616161"
  },
  "entity": {
    "color": "#ff6666"
  },
  "function": {
    "color": "#c792ea"
  },
  "hexcode": {
    "color": "#f2ff00"
  },
  "id": {
    "color": "#c792ea",
    "fontWeight": "bold"
  },
  "important": {
    "color": "#c792ea",
    "fontWeight": "bold"
  },
  "inserted": {
    "color": "#80cbc4"
  },
  "keyword": {
    "color": "#c792ea"
  },
  "number": {
    "color": "#fd9170"
  },
  "operator": {
    "color": "#89ddff"
  },
  "prolog": {
    "color": "#616161"
  },
  "property": {
    "color": "#80cbc4"
  },
  "pseudo-class": {
    "color": "#a5e844"
  },
  "pseudo-element": {
    "color": "#a5e844"
  },
  "punctuation": {
    "color": "#89ddff"
  },
  "regex": {
    "color": "#f2ff00"
  },
  "selector": {
    "color": "#ff6666"
  },
  "string": {
    "color": "#a5e844"
  },
  "symbol": {
    "color": "#c792ea"
  },
  "tag": {
    "color": "#ff6666"
  },
  "unit": {
    "color": "#fd9170"
  },
  "url": {
    "color": "#ff6666"
  },
  "variable": {
    "color": "#ff6666"
  }
};

/***/ }),

/***/ 8826:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "color": "#90a4ae",
    "background": "#fafafa",
    "fontFamily": "Roboto Mono, monospace",
    "fontSize": "1em",
    "lineHeight": "1.5em",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "color": "#90a4ae",
    "background": "#fafafa",
    "fontFamily": "Roboto Mono, monospace",
    "fontSize": "1em",
    "lineHeight": "1.5em",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "overflow": "auto",
    "position": "relative",
    "margin": "0.5em 0",
    "padding": "1.25em 1em"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "background": "#cceae7",
    "color": "#263238"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "background": "#cceae7",
    "color": "#263238"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "background": "#cceae7",
    "color": "#263238"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "background": "#cceae7",
    "color": "#263238"
  },
  "code[class*=\"language-\"]::selection": {
    "background": "#cceae7",
    "color": "#263238"
  },
  "pre[class*=\"language-\"]::selection": {
    "background": "#cceae7",
    "color": "#263238"
  },
  "code[class*=\"language-\"] ::selection": {
    "background": "#cceae7",
    "color": "#263238"
  },
  "pre[class*=\"language-\"] ::selection": {
    "background": "#cceae7",
    "color": "#263238"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "whiteSpace": "normal",
    "borderRadius": "0.2em",
    "padding": "0.1em"
  },
  ".language-css > code": {
    "color": "#f76d47"
  },
  ".language-sass > code": {
    "color": "#f76d47"
  },
  ".language-scss > code": {
    "color": "#f76d47"
  },
  "[class*=\"language-\"] .namespace": {
    "Opacity": "0.7"
  },
  "atrule": {
    "color": "#7c4dff"
  },
  "attr-name": {
    "color": "#39adb5"
  },
  "attr-value": {
    "color": "#f6a434"
  },
  "attribute": {
    "color": "#f6a434"
  },
  "boolean": {
    "color": "#7c4dff"
  },
  "builtin": {
    "color": "#39adb5"
  },
  "cdata": {
    "color": "#39adb5"
  },
  "char": {
    "color": "#39adb5"
  },
  "class": {
    "color": "#39adb5"
  },
  "class-name": {
    "color": "#6182b8"
  },
  "comment": {
    "color": "#aabfc9"
  },
  "constant": {
    "color": "#7c4dff"
  },
  "deleted": {
    "color": "#e53935"
  },
  "doctype": {
    "color": "#aabfc9"
  },
  "entity": {
    "color": "#e53935"
  },
  "function": {
    "color": "#7c4dff"
  },
  "hexcode": {
    "color": "#f76d47"
  },
  "id": {
    "color": "#7c4dff",
    "fontWeight": "bold"
  },
  "important": {
    "color": "#7c4dff",
    "fontWeight": "bold"
  },
  "inserted": {
    "color": "#39adb5"
  },
  "keyword": {
    "color": "#7c4dff"
  },
  "number": {
    "color": "#f76d47"
  },
  "operator": {
    "color": "#39adb5"
  },
  "prolog": {
    "color": "#aabfc9"
  },
  "property": {
    "color": "#39adb5"
  },
  "pseudo-class": {
    "color": "#f6a434"
  },
  "pseudo-element": {
    "color": "#f6a434"
  },
  "punctuation": {
    "color": "#39adb5"
  },
  "regex": {
    "color": "#6182b8"
  },
  "selector": {
    "color": "#e53935"
  },
  "string": {
    "color": "#f6a434"
  },
  "symbol": {
    "color": "#7c4dff"
  },
  "tag": {
    "color": "#e53935"
  },
  "unit": {
    "color": "#f76d47"
  },
  "url": {
    "color": "#e53935"
  },
  "variable": {
    "color": "#e53935"
  }
};

/***/ }),

/***/ 7825:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "color": "#c3cee3",
    "background": "#263238",
    "fontFamily": "Roboto Mono, monospace",
    "fontSize": "1em",
    "lineHeight": "1.5em",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "color": "#c3cee3",
    "background": "#263238",
    "fontFamily": "Roboto Mono, monospace",
    "fontSize": "1em",
    "lineHeight": "1.5em",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "overflow": "auto",
    "position": "relative",
    "margin": "0.5em 0",
    "padding": "1.25em 1em"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "background": "#363636"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "background": "#363636"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "background": "#363636"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "background": "#363636"
  },
  "code[class*=\"language-\"]::selection": {
    "background": "#363636"
  },
  "pre[class*=\"language-\"]::selection": {
    "background": "#363636"
  },
  "code[class*=\"language-\"] ::selection": {
    "background": "#363636"
  },
  "pre[class*=\"language-\"] ::selection": {
    "background": "#363636"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "whiteSpace": "normal",
    "borderRadius": "0.2em",
    "padding": "0.1em"
  },
  ".language-css > code": {
    "color": "#fd9170"
  },
  ".language-sass > code": {
    "color": "#fd9170"
  },
  ".language-scss > code": {
    "color": "#fd9170"
  },
  "[class*=\"language-\"] .namespace": {
    "Opacity": "0.7"
  },
  "atrule": {
    "color": "#c792ea"
  },
  "attr-name": {
    "color": "#ffcb6b"
  },
  "attr-value": {
    "color": "#c3e88d"
  },
  "attribute": {
    "color": "#c3e88d"
  },
  "boolean": {
    "color": "#c792ea"
  },
  "builtin": {
    "color": "#ffcb6b"
  },
  "cdata": {
    "color": "#80cbc4"
  },
  "char": {
    "color": "#80cbc4"
  },
  "class": {
    "color": "#ffcb6b"
  },
  "class-name": {
    "color": "#f2ff00"
  },
  "color": {
    "color": "#f2ff00"
  },
  "comment": {
    "color": "#546e7a"
  },
  "constant": {
    "color": "#c792ea"
  },
  "deleted": {
    "color": "#f07178"
  },
  "doctype": {
    "color": "#546e7a"
  },
  "entity": {
    "color": "#f07178"
  },
  "function": {
    "color": "#c792ea"
  },
  "hexcode": {
    "color": "#f2ff00"
  },
  "id": {
    "color": "#c792ea",
    "fontWeight": "bold"
  },
  "important": {
    "color": "#c792ea",
    "fontWeight": "bold"
  },
  "inserted": {
    "color": "#80cbc4"
  },
  "keyword": {
    "color": "#c792ea",
    "fontStyle": "italic"
  },
  "number": {
    "color": "#fd9170"
  },
  "operator": {
    "color": "#89ddff"
  },
  "prolog": {
    "color": "#546e7a"
  },
  "property": {
    "color": "#80cbc4"
  },
  "pseudo-class": {
    "color": "#c3e88d"
  },
  "pseudo-element": {
    "color": "#c3e88d"
  },
  "punctuation": {
    "color": "#89ddff"
  },
  "regex": {
    "color": "#f2ff00"
  },
  "selector": {
    "color": "#f07178"
  },
  "string": {
    "color": "#c3e88d"
  },
  "symbol": {
    "color": "#c792ea"
  },
  "tag": {
    "color": "#f07178"
  },
  "unit": {
    "color": "#f07178"
  },
  "url": {
    "color": "#fd9170"
  },
  "variable": {
    "color": "#f07178"
  }
};

/***/ }),

/***/ 7472:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#d6deeb",
    "fontFamily": "Consolas, Monaco, \"Andale Mono\", \"Ubuntu Mono\", monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "fontSize": "1em",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "white",
    "fontFamily": "Consolas, Monaco, \"Andale Mono\", \"Ubuntu Mono\", monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "fontSize": "1em",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": "0.5em 0",
    "overflow": "auto",
    "background": "#011627"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  "pre[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  "pre[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  "code[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  "code[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "color": "white",
    "background": "#011627",
    "padding": "0.1em",
    "borderRadius": "0.3em",
    "whiteSpace": "normal"
  },
  "comment": {
    "color": "rgb(99, 119, 119)",
    "fontStyle": "italic"
  },
  "prolog": {
    "color": "rgb(99, 119, 119)",
    "fontStyle": "italic"
  },
  "cdata": {
    "color": "rgb(99, 119, 119)",
    "fontStyle": "italic"
  },
  "punctuation": {
    "color": "rgb(199, 146, 234)"
  },
  ".namespace": {
    "color": "rgb(178, 204, 214)"
  },
  "deleted": {
    "color": "rgba(239, 83, 80, 0.56)",
    "fontStyle": "italic"
  },
  "symbol": {
    "color": "rgb(128, 203, 196)"
  },
  "property": {
    "color": "rgb(128, 203, 196)"
  },
  "tag": {
    "color": "rgb(127, 219, 202)"
  },
  "operator": {
    "color": "rgb(127, 219, 202)"
  },
  "keyword": {
    "color": "rgb(127, 219, 202)"
  },
  "boolean": {
    "color": "rgb(255, 88, 116)"
  },
  "number": {
    "color": "rgb(247, 140, 108)"
  },
  "constant": {
    "color": "rgb(130, 170, 255)"
  },
  "function": {
    "color": "rgb(130, 170, 255)"
  },
  "builtin": {
    "color": "rgb(130, 170, 255)"
  },
  "char": {
    "color": "rgb(130, 170, 255)"
  },
  "selector": {
    "color": "rgb(199, 146, 234)",
    "fontStyle": "italic"
  },
  "doctype": {
    "color": "rgb(199, 146, 234)",
    "fontStyle": "italic"
  },
  "attr-name": {
    "color": "rgb(173, 219, 103)",
    "fontStyle": "italic"
  },
  "inserted": {
    "color": "rgb(173, 219, 103)",
    "fontStyle": "italic"
  },
  "string": {
    "color": "rgb(173, 219, 103)"
  },
  "url": {
    "color": "rgb(173, 219, 103)"
  },
  "entity": {
    "color": "rgb(173, 219, 103)"
  },
  ".language-css .token.string": {
    "color": "rgb(173, 219, 103)"
  },
  ".style .token.string": {
    "color": "rgb(173, 219, 103)"
  },
  "class-name": {
    "color": "rgb(255, 203, 139)"
  },
  "atrule": {
    "color": "rgb(255, 203, 139)"
  },
  "attr-value": {
    "color": "rgb(255, 203, 139)"
  },
  "regex": {
    "color": "rgb(214, 222, 235)"
  },
  "important": {
    "color": "rgb(214, 222, 235)",
    "fontWeight": "bold"
  },
  "variable": {
    "color": "rgb(214, 222, 235)"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  }
};

/***/ }),

/***/ 3660:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#f8f8f2",
    "background": "none",
    "fontFamily": "\"Fira Code\", Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#f8f8f2",
    "background": "#2E3440",
    "fontFamily": "\"Fira Code\", Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto",
    "borderRadius": "0.3em"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#2E3440",
    "padding": ".1em",
    "borderRadius": ".3em",
    "whiteSpace": "normal"
  },
  "comment": {
    "color": "#636f88"
  },
  "prolog": {
    "color": "#636f88"
  },
  "doctype": {
    "color": "#636f88"
  },
  "cdata": {
    "color": "#636f88"
  },
  "punctuation": {
    "color": "#81A1C1"
  },
  ".namespace": {
    "Opacity": ".7"
  },
  "property": {
    "color": "#81A1C1"
  },
  "tag": {
    "color": "#81A1C1"
  },
  "constant": {
    "color": "#81A1C1"
  },
  "symbol": {
    "color": "#81A1C1"
  },
  "deleted": {
    "color": "#81A1C1"
  },
  "number": {
    "color": "#B48EAD"
  },
  "boolean": {
    "color": "#81A1C1"
  },
  "selector": {
    "color": "#A3BE8C"
  },
  "attr-name": {
    "color": "#A3BE8C"
  },
  "string": {
    "color": "#A3BE8C"
  },
  "char": {
    "color": "#A3BE8C"
  },
  "builtin": {
    "color": "#A3BE8C"
  },
  "inserted": {
    "color": "#A3BE8C"
  },
  "operator": {
    "color": "#81A1C1"
  },
  "entity": {
    "color": "#81A1C1",
    "cursor": "help"
  },
  "url": {
    "color": "#81A1C1"
  },
  ".language-css .token.string": {
    "color": "#81A1C1"
  },
  ".style .token.string": {
    "color": "#81A1C1"
  },
  "variable": {
    "color": "#81A1C1"
  },
  "atrule": {
    "color": "#88C0D0"
  },
  "attr-value": {
    "color": "#88C0D0"
  },
  "function": {
    "color": "#88C0D0"
  },
  "class-name": {
    "color": "#88C0D0"
  },
  "keyword": {
    "color": "#81A1C1"
  },
  "regex": {
    "color": "#EBCB8B"
  },
  "important": {
    "color": "#EBCB8B",
    "fontWeight": "bold"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  }
};

/***/ }),

/***/ 2133:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#f8f8f2",
    "background": "none",
    "textShadow": "0 1px rgba(0, 0, 0, 0.3)",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#f8f8f2",
    "background": "#272822",
    "textShadow": "0 1px rgba(0, 0, 0, 0.3)",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto",
    "borderRadius": "0.3em"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#272822",
    "padding": ".1em",
    "borderRadius": ".3em",
    "whiteSpace": "normal"
  },
  "comment": {
    "color": "#8292a2"
  },
  "prolog": {
    "color": "#8292a2"
  },
  "doctype": {
    "color": "#8292a2"
  },
  "cdata": {
    "color": "#8292a2"
  },
  "punctuation": {
    "color": "#f8f8f2"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "property": {
    "color": "#f92672"
  },
  "tag": {
    "color": "#f92672"
  },
  "constant": {
    "color": "#f92672"
  },
  "symbol": {
    "color": "#f92672"
  },
  "deleted": {
    "color": "#f92672"
  },
  "boolean": {
    "color": "#ae81ff"
  },
  "number": {
    "color": "#ae81ff"
  },
  "selector": {
    "color": "#a6e22e"
  },
  "attr-name": {
    "color": "#a6e22e"
  },
  "string": {
    "color": "#a6e22e"
  },
  "char": {
    "color": "#a6e22e"
  },
  "builtin": {
    "color": "#a6e22e"
  },
  "inserted": {
    "color": "#a6e22e"
  },
  "operator": {
    "color": "#f8f8f2"
  },
  "entity": {
    "color": "#f8f8f2",
    "cursor": "help"
  },
  "url": {
    "color": "#f8f8f2"
  },
  ".language-css .token.string": {
    "color": "#f8f8f2"
  },
  ".style .token.string": {
    "color": "#f8f8f2"
  },
  "variable": {
    "color": "#f8f8f2"
  },
  "atrule": {
    "color": "#e6db74"
  },
  "attr-value": {
    "color": "#e6db74"
  },
  "function": {
    "color": "#e6db74"
  },
  "class-name": {
    "color": "#e6db74"
  },
  "keyword": {
    "color": "#66d9ef"
  },
  "regex": {
    "color": "#fd971f"
  },
  "important": {
    "color": "#fd971f",
    "fontWeight": "bold"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  }
};

/***/ }),

/***/ 7266:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "background": "hsl(220, 13%, 18%)",
    "color": "hsl(220, 14%, 71%)",
    "textShadow": "0 1px rgba(0, 0, 0, 0.3)",
    "fontFamily": "\"Fira Code\", \"Fira Mono\", Menlo, Consolas, \"DejaVu Sans Mono\", monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "2",
    "OTabSize": "2",
    "tabSize": "2",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "background": "hsl(220, 13%, 18%)",
    "color": "hsl(220, 14%, 71%)",
    "textShadow": "0 1px rgba(0, 0, 0, 0.3)",
    "fontFamily": "\"Fira Code\", \"Fira Mono\", Menlo, Consolas, \"DejaVu Sans Mono\", monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "2",
    "OTabSize": "2",
    "tabSize": "2",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": "0.5em 0",
    "overflow": "auto",
    "borderRadius": "0.3em"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "background": "hsl(220, 13%, 28%)",
    "color": "inherit",
    "textShadow": "none"
  },
  "code[class*=\"language-\"] *::-moz-selection": {
    "background": "hsl(220, 13%, 28%)",
    "color": "inherit",
    "textShadow": "none"
  },
  "pre[class*=\"language-\"] *::-moz-selection": {
    "background": "hsl(220, 13%, 28%)",
    "color": "inherit",
    "textShadow": "none"
  },
  "code[class*=\"language-\"]::selection": {
    "background": "hsl(220, 13%, 28%)",
    "color": "inherit",
    "textShadow": "none"
  },
  "code[class*=\"language-\"] *::selection": {
    "background": "hsl(220, 13%, 28%)",
    "color": "inherit",
    "textShadow": "none"
  },
  "pre[class*=\"language-\"] *::selection": {
    "background": "hsl(220, 13%, 28%)",
    "color": "inherit",
    "textShadow": "none"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "padding": "0.2em 0.3em",
    "borderRadius": "0.3em",
    "whiteSpace": "normal"
  },
  "comment": {
    "color": "hsl(220, 10%, 40%)",
    "fontStyle": "italic"
  },
  "prolog": {
    "color": "hsl(220, 10%, 40%)"
  },
  "cdata": {
    "color": "hsl(220, 10%, 40%)"
  },
  "doctype": {
    "color": "hsl(220, 14%, 71%)"
  },
  "punctuation": {
    "color": "hsl(220, 14%, 71%)"
  },
  "entity": {
    "color": "hsl(220, 14%, 71%)",
    "cursor": "help"
  },
  "attr-name": {
    "color": "hsl(29, 54%, 61%)"
  },
  "class-name": {
    "color": "hsl(29, 54%, 61%)"
  },
  "boolean": {
    "color": "hsl(29, 54%, 61%)"
  },
  "constant": {
    "color": "hsl(29, 54%, 61%)"
  },
  "number": {
    "color": "hsl(29, 54%, 61%)"
  },
  "atrule": {
    "color": "hsl(29, 54%, 61%)"
  },
  "keyword": {
    "color": "hsl(286, 60%, 67%)"
  },
  "property": {
    "color": "hsl(355, 65%, 65%)"
  },
  "tag": {
    "color": "hsl(355, 65%, 65%)"
  },
  "symbol": {
    "color": "hsl(355, 65%, 65%)"
  },
  "deleted": {
    "color": "hsl(355, 65%, 65%)"
  },
  "important": {
    "color": "hsl(355, 65%, 65%)"
  },
  "selector": {
    "color": "hsl(95, 38%, 62%)"
  },
  "string": {
    "color": "hsl(95, 38%, 62%)"
  },
  "char": {
    "color": "hsl(95, 38%, 62%)"
  },
  "builtin": {
    "color": "hsl(95, 38%, 62%)"
  },
  "inserted": {
    "color": "hsl(95, 38%, 62%)"
  },
  "regex": {
    "color": "hsl(95, 38%, 62%)"
  },
  "attr-value": {
    "color": "hsl(95, 38%, 62%)"
  },
  "attr-value > .token.punctuation": {
    "color": "hsl(95, 38%, 62%)"
  },
  "variable": {
    "color": "hsl(207, 82%, 66%)"
  },
  "operator": {
    "color": "hsl(207, 82%, 66%)"
  },
  "function": {
    "color": "hsl(207, 82%, 66%)"
  },
  "url": {
    "color": "hsl(187, 47%, 55%)"
  },
  "attr-value > .token.punctuation.attr-equals": {
    "color": "hsl(220, 14%, 71%)"
  },
  "special-attr > .token.attr-value > .token.value.css": {
    "color": "hsl(220, 14%, 71%)"
  },
  ".language-css .token.selector": {
    "color": "hsl(355, 65%, 65%)"
  },
  ".language-css .token.property": {
    "color": "hsl(220, 14%, 71%)"
  },
  ".language-css .token.function": {
    "color": "hsl(187, 47%, 55%)"
  },
  ".language-css .token.url > .token.function": {
    "color": "hsl(187, 47%, 55%)"
  },
  ".language-css .token.url > .token.string.url": {
    "color": "hsl(95, 38%, 62%)"
  },
  ".language-css .token.important": {
    "color": "hsl(286, 60%, 67%)"
  },
  ".language-css .token.atrule .token.rule": {
    "color": "hsl(286, 60%, 67%)"
  },
  ".language-javascript .token.operator": {
    "color": "hsl(286, 60%, 67%)"
  },
  ".language-javascript .token.template-string > .token.interpolation > .token.interpolation-punctuation.punctuation": {
    "color": "hsl(5, 48%, 51%)"
  },
  ".language-json .token.operator": {
    "color": "hsl(220, 14%, 71%)"
  },
  ".language-json .token.null.keyword": {
    "color": "hsl(29, 54%, 61%)"
  },
  ".language-markdown .token.url": {
    "color": "hsl(220, 14%, 71%)"
  },
  ".language-markdown .token.url > .token.operator": {
    "color": "hsl(220, 14%, 71%)"
  },
  ".language-markdown .token.url-reference.url > .token.string": {
    "color": "hsl(220, 14%, 71%)"
  },
  ".language-markdown .token.url > .token.content": {
    "color": "hsl(207, 82%, 66%)"
  },
  ".language-markdown .token.url > .token.url": {
    "color": "hsl(187, 47%, 55%)"
  },
  ".language-markdown .token.url-reference.url": {
    "color": "hsl(187, 47%, 55%)"
  },
  ".language-markdown .token.blockquote.punctuation": {
    "color": "hsl(220, 10%, 40%)",
    "fontStyle": "italic"
  },
  ".language-markdown .token.hr.punctuation": {
    "color": "hsl(220, 10%, 40%)",
    "fontStyle": "italic"
  },
  ".language-markdown .token.code-snippet": {
    "color": "hsl(95, 38%, 62%)"
  },
  ".language-markdown .token.bold .token.content": {
    "color": "hsl(29, 54%, 61%)"
  },
  ".language-markdown .token.italic .token.content": {
    "color": "hsl(286, 60%, 67%)"
  },
  ".language-markdown .token.strike .token.content": {
    "color": "hsl(355, 65%, 65%)"
  },
  ".language-markdown .token.strike .token.punctuation": {
    "color": "hsl(355, 65%, 65%)"
  },
  ".language-markdown .token.list.punctuation": {
    "color": "hsl(355, 65%, 65%)"
  },
  ".language-markdown .token.title.important > .token.punctuation": {
    "color": "hsl(355, 65%, 65%)"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "namespace": {
    "Opacity": "0.8"
  },
  "token.tab:not(:empty):before": {
    "color": "hsla(220, 14%, 71%, 0.15)",
    "textShadow": "none"
  },
  "token.cr:before": {
    "color": "hsla(220, 14%, 71%, 0.15)",
    "textShadow": "none"
  },
  "token.lf:before": {
    "color": "hsla(220, 14%, 71%, 0.15)",
    "textShadow": "none"
  },
  "token.space:before": {
    "color": "hsla(220, 14%, 71%, 0.15)",
    "textShadow": "none"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item": {
    "marginRight": "0.4em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button": {
    "background": "hsl(220, 13%, 26%)",
    "color": "hsl(220, 9%, 55%)",
    "padding": "0.1em 0.4em",
    "borderRadius": "0.3em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a": {
    "background": "hsl(220, 13%, 26%)",
    "color": "hsl(220, 9%, 55%)",
    "padding": "0.1em 0.4em",
    "borderRadius": "0.3em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span": {
    "background": "hsl(220, 13%, 26%)",
    "color": "hsl(220, 9%, 55%)",
    "padding": "0.1em 0.4em",
    "borderRadius": "0.3em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:hover": {
    "background": "hsl(220, 13%, 28%)",
    "color": "hsl(220, 14%, 71%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:focus": {
    "background": "hsl(220, 13%, 28%)",
    "color": "hsl(220, 14%, 71%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:hover": {
    "background": "hsl(220, 13%, 28%)",
    "color": "hsl(220, 14%, 71%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:focus": {
    "background": "hsl(220, 13%, 28%)",
    "color": "hsl(220, 14%, 71%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:hover": {
    "background": "hsl(220, 13%, 28%)",
    "color": "hsl(220, 14%, 71%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:focus": {
    "background": "hsl(220, 13%, 28%)",
    "color": "hsl(220, 14%, 71%)"
  },
  ".line-highlight.line-highlight": {
    "background": "hsla(220, 100%, 80%, 0.04)"
  },
  ".line-highlight.line-highlight:before": {
    "background": "hsl(220, 13%, 26%)",
    "color": "hsl(220, 14%, 71%)",
    "padding": "0.1em 0.6em",
    "borderRadius": "0.3em",
    "boxShadow": "0 2px 0 0 rgba(0, 0, 0, 0.2)"
  },
  ".line-highlight.line-highlight[data-end]:after": {
    "background": "hsl(220, 13%, 26%)",
    "color": "hsl(220, 14%, 71%)",
    "padding": "0.1em 0.6em",
    "borderRadius": "0.3em",
    "boxShadow": "0 2px 0 0 rgba(0, 0, 0, 0.2)"
  },
  "pre[id].linkable-line-numbers.linkable-line-numbers span.line-numbers-rows > span:hover:before": {
    "backgroundColor": "hsla(220, 100%, 80%, 0.04)"
  },
  ".line-numbers.line-numbers .line-numbers-rows": {
    "borderRightColor": "hsla(220, 14%, 71%, 0.15)"
  },
  ".command-line .command-line-prompt": {
    "borderRightColor": "hsla(220, 14%, 71%, 0.15)"
  },
  ".line-numbers .line-numbers-rows > span:before": {
    "color": "hsl(220, 14%, 45%)"
  },
  ".command-line .command-line-prompt > span:before": {
    "color": "hsl(220, 14%, 45%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-1": {
    "color": "hsl(355, 65%, 65%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-5": {
    "color": "hsl(355, 65%, 65%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-9": {
    "color": "hsl(355, 65%, 65%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-2": {
    "color": "hsl(95, 38%, 62%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-6": {
    "color": "hsl(95, 38%, 62%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-10": {
    "color": "hsl(95, 38%, 62%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-3": {
    "color": "hsl(207, 82%, 66%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-7": {
    "color": "hsl(207, 82%, 66%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-11": {
    "color": "hsl(207, 82%, 66%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-4": {
    "color": "hsl(286, 60%, 67%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-8": {
    "color": "hsl(286, 60%, 67%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-12": {
    "color": "hsl(286, 60%, 67%)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix)": {
    "backgroundColor": "hsla(353, 100%, 66%, 0.15)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix)": {
    "backgroundColor": "hsla(353, 100%, 66%, 0.15)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix)::-moz-selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix) *::-moz-selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix)::-moz-selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix) *::-moz-selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix)::selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix) *::selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix)::selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix) *::selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix)": {
    "backgroundColor": "hsla(137, 100%, 55%, 0.15)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix)": {
    "backgroundColor": "hsla(137, 100%, 55%, 0.15)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix)::-moz-selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix) *::-moz-selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix)::-moz-selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix) *::-moz-selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix)::selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix) *::selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix)::selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix) *::selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  ".prism-previewer.prism-previewer:before": {
    "borderColor": "hsl(224, 13%, 17%)"
  },
  ".prism-previewer-gradient.prism-previewer-gradient div": {
    "borderColor": "hsl(224, 13%, 17%)",
    "borderRadius": "0.3em"
  },
  ".prism-previewer-color.prism-previewer-color:before": {
    "borderRadius": "0.3em"
  },
  ".prism-previewer-easing.prism-previewer-easing:before": {
    "borderRadius": "0.3em"
  },
  ".prism-previewer.prism-previewer:after": {
    "borderTopColor": "hsl(224, 13%, 17%)"
  },
  ".prism-previewer-flipped.prism-previewer-flipped.after": {
    "borderBottomColor": "hsl(224, 13%, 17%)"
  },
  ".prism-previewer-angle.prism-previewer-angle:before": {
    "background": "hsl(219, 13%, 22%)"
  },
  ".prism-previewer-time.prism-previewer-time:before": {
    "background": "hsl(219, 13%, 22%)"
  },
  ".prism-previewer-easing.prism-previewer-easing": {
    "background": "hsl(219, 13%, 22%)"
  },
  ".prism-previewer-angle.prism-previewer-angle circle": {
    "stroke": "hsl(220, 14%, 71%)",
    "strokeOpacity": "1"
  },
  ".prism-previewer-time.prism-previewer-time circle": {
    "stroke": "hsl(220, 14%, 71%)",
    "strokeOpacity": "1"
  },
  ".prism-previewer-easing.prism-previewer-easing circle": {
    "stroke": "hsl(220, 14%, 71%)",
    "fill": "transparent"
  },
  ".prism-previewer-easing.prism-previewer-easing path": {
    "stroke": "hsl(220, 14%, 71%)"
  },
  ".prism-previewer-easing.prism-previewer-easing line": {
    "stroke": "hsl(220, 14%, 71%)"
  }
};

/***/ }),

/***/ 4310:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "background": "hsl(230, 1%, 98%)",
    "color": "hsl(230, 8%, 24%)",
    "fontFamily": "\"Fira Code\", \"Fira Mono\", Menlo, Consolas, \"DejaVu Sans Mono\", monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "2",
    "OTabSize": "2",
    "tabSize": "2",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "background": "hsl(230, 1%, 98%)",
    "color": "hsl(230, 8%, 24%)",
    "fontFamily": "\"Fira Code\", \"Fira Mono\", Menlo, Consolas, \"DejaVu Sans Mono\", monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "2",
    "OTabSize": "2",
    "tabSize": "2",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": "0.5em 0",
    "overflow": "auto",
    "borderRadius": "0.3em"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "background": "hsl(230, 1%, 90%)",
    "color": "inherit"
  },
  "code[class*=\"language-\"] *::-moz-selection": {
    "background": "hsl(230, 1%, 90%)",
    "color": "inherit"
  },
  "pre[class*=\"language-\"] *::-moz-selection": {
    "background": "hsl(230, 1%, 90%)",
    "color": "inherit"
  },
  "code[class*=\"language-\"]::selection": {
    "background": "hsl(230, 1%, 90%)",
    "color": "inherit"
  },
  "code[class*=\"language-\"] *::selection": {
    "background": "hsl(230, 1%, 90%)",
    "color": "inherit"
  },
  "pre[class*=\"language-\"] *::selection": {
    "background": "hsl(230, 1%, 90%)",
    "color": "inherit"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "padding": "0.2em 0.3em",
    "borderRadius": "0.3em",
    "whiteSpace": "normal"
  },
  "comment": {
    "color": "hsl(230, 4%, 64%)",
    "fontStyle": "italic"
  },
  "prolog": {
    "color": "hsl(230, 4%, 64%)"
  },
  "cdata": {
    "color": "hsl(230, 4%, 64%)"
  },
  "doctype": {
    "color": "hsl(230, 8%, 24%)"
  },
  "punctuation": {
    "color": "hsl(230, 8%, 24%)"
  },
  "entity": {
    "color": "hsl(230, 8%, 24%)",
    "cursor": "help"
  },
  "attr-name": {
    "color": "hsl(35, 99%, 36%)"
  },
  "class-name": {
    "color": "hsl(35, 99%, 36%)"
  },
  "boolean": {
    "color": "hsl(35, 99%, 36%)"
  },
  "constant": {
    "color": "hsl(35, 99%, 36%)"
  },
  "number": {
    "color": "hsl(35, 99%, 36%)"
  },
  "atrule": {
    "color": "hsl(35, 99%, 36%)"
  },
  "keyword": {
    "color": "hsl(301, 63%, 40%)"
  },
  "property": {
    "color": "hsl(5, 74%, 59%)"
  },
  "tag": {
    "color": "hsl(5, 74%, 59%)"
  },
  "symbol": {
    "color": "hsl(5, 74%, 59%)"
  },
  "deleted": {
    "color": "hsl(5, 74%, 59%)"
  },
  "important": {
    "color": "hsl(5, 74%, 59%)"
  },
  "selector": {
    "color": "hsl(119, 34%, 47%)"
  },
  "string": {
    "color": "hsl(119, 34%, 47%)"
  },
  "char": {
    "color": "hsl(119, 34%, 47%)"
  },
  "builtin": {
    "color": "hsl(119, 34%, 47%)"
  },
  "inserted": {
    "color": "hsl(119, 34%, 47%)"
  },
  "regex": {
    "color": "hsl(119, 34%, 47%)"
  },
  "attr-value": {
    "color": "hsl(119, 34%, 47%)"
  },
  "attr-value > .token.punctuation": {
    "color": "hsl(119, 34%, 47%)"
  },
  "variable": {
    "color": "hsl(221, 87%, 60%)"
  },
  "operator": {
    "color": "hsl(221, 87%, 60%)"
  },
  "function": {
    "color": "hsl(221, 87%, 60%)"
  },
  "url": {
    "color": "hsl(198, 99%, 37%)"
  },
  "attr-value > .token.punctuation.attr-equals": {
    "color": "hsl(230, 8%, 24%)"
  },
  "special-attr > .token.attr-value > .token.value.css": {
    "color": "hsl(230, 8%, 24%)"
  },
  ".language-css .token.selector": {
    "color": "hsl(5, 74%, 59%)"
  },
  ".language-css .token.property": {
    "color": "hsl(230, 8%, 24%)"
  },
  ".language-css .token.function": {
    "color": "hsl(198, 99%, 37%)"
  },
  ".language-css .token.url > .token.function": {
    "color": "hsl(198, 99%, 37%)"
  },
  ".language-css .token.url > .token.string.url": {
    "color": "hsl(119, 34%, 47%)"
  },
  ".language-css .token.important": {
    "color": "hsl(301, 63%, 40%)"
  },
  ".language-css .token.atrule .token.rule": {
    "color": "hsl(301, 63%, 40%)"
  },
  ".language-javascript .token.operator": {
    "color": "hsl(301, 63%, 40%)"
  },
  ".language-javascript .token.template-string > .token.interpolation > .token.interpolation-punctuation.punctuation": {
    "color": "hsl(344, 84%, 43%)"
  },
  ".language-json .token.operator": {
    "color": "hsl(230, 8%, 24%)"
  },
  ".language-json .token.null.keyword": {
    "color": "hsl(35, 99%, 36%)"
  },
  ".language-markdown .token.url": {
    "color": "hsl(230, 8%, 24%)"
  },
  ".language-markdown .token.url > .token.operator": {
    "color": "hsl(230, 8%, 24%)"
  },
  ".language-markdown .token.url-reference.url > .token.string": {
    "color": "hsl(230, 8%, 24%)"
  },
  ".language-markdown .token.url > .token.content": {
    "color": "hsl(221, 87%, 60%)"
  },
  ".language-markdown .token.url > .token.url": {
    "color": "hsl(198, 99%, 37%)"
  },
  ".language-markdown .token.url-reference.url": {
    "color": "hsl(198, 99%, 37%)"
  },
  ".language-markdown .token.blockquote.punctuation": {
    "color": "hsl(230, 4%, 64%)",
    "fontStyle": "italic"
  },
  ".language-markdown .token.hr.punctuation": {
    "color": "hsl(230, 4%, 64%)",
    "fontStyle": "italic"
  },
  ".language-markdown .token.code-snippet": {
    "color": "hsl(119, 34%, 47%)"
  },
  ".language-markdown .token.bold .token.content": {
    "color": "hsl(35, 99%, 36%)"
  },
  ".language-markdown .token.italic .token.content": {
    "color": "hsl(301, 63%, 40%)"
  },
  ".language-markdown .token.strike .token.content": {
    "color": "hsl(5, 74%, 59%)"
  },
  ".language-markdown .token.strike .token.punctuation": {
    "color": "hsl(5, 74%, 59%)"
  },
  ".language-markdown .token.list.punctuation": {
    "color": "hsl(5, 74%, 59%)"
  },
  ".language-markdown .token.title.important > .token.punctuation": {
    "color": "hsl(5, 74%, 59%)"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "namespace": {
    "Opacity": "0.8"
  },
  "token.tab:not(:empty):before": {
    "color": "hsla(230, 8%, 24%, 0.2)"
  },
  "token.cr:before": {
    "color": "hsla(230, 8%, 24%, 0.2)"
  },
  "token.lf:before": {
    "color": "hsla(230, 8%, 24%, 0.2)"
  },
  "token.space:before": {
    "color": "hsla(230, 8%, 24%, 0.2)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item": {
    "marginRight": "0.4em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button": {
    "background": "hsl(230, 1%, 90%)",
    "color": "hsl(230, 6%, 44%)",
    "padding": "0.1em 0.4em",
    "borderRadius": "0.3em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a": {
    "background": "hsl(230, 1%, 90%)",
    "color": "hsl(230, 6%, 44%)",
    "padding": "0.1em 0.4em",
    "borderRadius": "0.3em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span": {
    "background": "hsl(230, 1%, 90%)",
    "color": "hsl(230, 6%, 44%)",
    "padding": "0.1em 0.4em",
    "borderRadius": "0.3em"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:hover": {
    "background": "hsl(230, 1%, 78%)",
    "color": "hsl(230, 8%, 24%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:focus": {
    "background": "hsl(230, 1%, 78%)",
    "color": "hsl(230, 8%, 24%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:hover": {
    "background": "hsl(230, 1%, 78%)",
    "color": "hsl(230, 8%, 24%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:focus": {
    "background": "hsl(230, 1%, 78%)",
    "color": "hsl(230, 8%, 24%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:hover": {
    "background": "hsl(230, 1%, 78%)",
    "color": "hsl(230, 8%, 24%)"
  },
  "div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:focus": {
    "background": "hsl(230, 1%, 78%)",
    "color": "hsl(230, 8%, 24%)"
  },
  ".line-highlight.line-highlight": {
    "background": "hsla(230, 8%, 24%, 0.05)"
  },
  ".line-highlight.line-highlight:before": {
    "background": "hsl(230, 1%, 90%)",
    "color": "hsl(230, 8%, 24%)",
    "padding": "0.1em 0.6em",
    "borderRadius": "0.3em",
    "boxShadow": "0 2px 0 0 rgba(0, 0, 0, 0.2)"
  },
  ".line-highlight.line-highlight[data-end]:after": {
    "background": "hsl(230, 1%, 90%)",
    "color": "hsl(230, 8%, 24%)",
    "padding": "0.1em 0.6em",
    "borderRadius": "0.3em",
    "boxShadow": "0 2px 0 0 rgba(0, 0, 0, 0.2)"
  },
  "pre[id].linkable-line-numbers.linkable-line-numbers span.line-numbers-rows > span:hover:before": {
    "backgroundColor": "hsla(230, 8%, 24%, 0.05)"
  },
  ".line-numbers.line-numbers .line-numbers-rows": {
    "borderRightColor": "hsla(230, 8%, 24%, 0.2)"
  },
  ".command-line .command-line-prompt": {
    "borderRightColor": "hsla(230, 8%, 24%, 0.2)"
  },
  ".line-numbers .line-numbers-rows > span:before": {
    "color": "hsl(230, 1%, 62%)"
  },
  ".command-line .command-line-prompt > span:before": {
    "color": "hsl(230, 1%, 62%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-1": {
    "color": "hsl(5, 74%, 59%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-5": {
    "color": "hsl(5, 74%, 59%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-9": {
    "color": "hsl(5, 74%, 59%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-2": {
    "color": "hsl(119, 34%, 47%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-6": {
    "color": "hsl(119, 34%, 47%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-10": {
    "color": "hsl(119, 34%, 47%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-3": {
    "color": "hsl(221, 87%, 60%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-7": {
    "color": "hsl(221, 87%, 60%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-11": {
    "color": "hsl(221, 87%, 60%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-4": {
    "color": "hsl(301, 63%, 40%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-8": {
    "color": "hsl(301, 63%, 40%)"
  },
  ".rainbow-braces .token.token.punctuation.brace-level-12": {
    "color": "hsl(301, 63%, 40%)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix)": {
    "backgroundColor": "hsla(353, 100%, 66%, 0.15)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix)": {
    "backgroundColor": "hsla(353, 100%, 66%, 0.15)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix)::-moz-selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix) *::-moz-selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix)::-moz-selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix) *::-moz-selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix)::selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.deleted:not(.prefix) *::selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix)::selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.deleted:not(.prefix) *::selection": {
    "backgroundColor": "hsla(353, 95%, 66%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix)": {
    "backgroundColor": "hsla(137, 100%, 55%, 0.15)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix)": {
    "backgroundColor": "hsla(137, 100%, 55%, 0.15)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix)::-moz-selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix) *::-moz-selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix)::-moz-selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix) *::-moz-selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix)::selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  "pre.diff-highlight > code .token.token.inserted:not(.prefix) *::selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix)::selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  "pre > code.diff-highlight .token.token.inserted:not(.prefix) *::selection": {
    "backgroundColor": "hsla(135, 73%, 55%, 0.25)"
  },
  ".prism-previewer.prism-previewer:before": {
    "borderColor": "hsl(0, 0, 95%)"
  },
  ".prism-previewer-gradient.prism-previewer-gradient div": {
    "borderColor": "hsl(0, 0, 95%)",
    "borderRadius": "0.3em"
  },
  ".prism-previewer-color.prism-previewer-color:before": {
    "borderRadius": "0.3em"
  },
  ".prism-previewer-easing.prism-previewer-easing:before": {
    "borderRadius": "0.3em"
  },
  ".prism-previewer.prism-previewer:after": {
    "borderTopColor": "hsl(0, 0, 95%)"
  },
  ".prism-previewer-flipped.prism-previewer-flipped.after": {
    "borderBottomColor": "hsl(0, 0, 95%)"
  },
  ".prism-previewer-angle.prism-previewer-angle:before": {
    "background": "hsl(0, 0%, 100%)"
  },
  ".prism-previewer-time.prism-previewer-time:before": {
    "background": "hsl(0, 0%, 100%)"
  },
  ".prism-previewer-easing.prism-previewer-easing": {
    "background": "hsl(0, 0%, 100%)"
  },
  ".prism-previewer-angle.prism-previewer-angle circle": {
    "stroke": "hsl(230, 8%, 24%)",
    "strokeOpacity": "1"
  },
  ".prism-previewer-time.prism-previewer-time circle": {
    "stroke": "hsl(230, 8%, 24%)",
    "strokeOpacity": "1"
  },
  ".prism-previewer-easing.prism-previewer-easing circle": {
    "stroke": "hsl(230, 8%, 24%)",
    "fill": "transparent"
  },
  ".prism-previewer-easing.prism-previewer-easing path": {
    "stroke": "hsl(230, 8%, 24%)"
  },
  ".prism-previewer-easing.prism-previewer-easing line": {
    "stroke": "hsl(230, 8%, 24%)"
  }
};

/***/ }),

/***/ 1487:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "whiteSpace": "pre-wrap",
    "wordBreak": "break-all",
    "wordWrap": "break-word",
    "fontFamily": "Menlo, Monaco, \"Courier New\", monospace",
    "fontSize": "15px",
    "lineHeight": "1.5",
    "color": "#dccf8f",
    "textShadow": "0"
  },
  "pre[class*=\"language-\"]": {
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "whiteSpace": "pre-wrap",
    "wordBreak": "break-all",
    "wordWrap": "break-word",
    "fontFamily": "Menlo, Monaco, \"Courier New\", monospace",
    "fontSize": "15px",
    "lineHeight": "1.5",
    "color": "#DCCF8F",
    "textShadow": "0",
    "borderRadius": "5px",
    "border": "1px solid #000",
    "background": "#181914 url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAMAAA/+4ADkFkb2JlAGTAAAAAAf/bAIQACQYGBgcGCQcHCQ0IBwgNDwsJCQsPEQ4ODw4OERENDg4ODg0RERQUFhQUERoaHBwaGiYmJiYmKysrKysrKysrKwEJCAgJCgkMCgoMDwwODA8TDg4ODhMVDg4PDg4VGhMRERERExoXGhYWFhoXHR0aGh0dJCQjJCQrKysrKysrKysr/8AAEQgAjACMAwEiAAIRAQMRAf/EAF4AAQEBAAAAAAAAAAAAAAAAAAABBwEBAQAAAAAAAAAAAAAAAAAAAAIQAAEDAwIHAQEAAAAAAAAAAADwAREhYaExkUFRcYGxwdHh8REBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AyGFEjHaBS2fDDs2zkhKmBKktb7km+ZwwCnXPkLVmCTMItj6AXFxRS465/BTnkAJvkLkJe+7AKKoi2AtRS2zuAWsCb5GOlBN8gKfmuGHZ8MFqIth3ALmFoFwbwKWyAlTAp17uKqBvgBD8sM4fTjhvAhkzhaRkBMKBrfs7jGPIpzy7gFrAqnC0C0gB0EWwBDW2cBVQwm+QtPpa3wBO3sVvszCnLAhkzgL5/RLf13cLQd8/AGlu0Cb5HTx9KuAEieGJEdcehS3eRTp2ATdt3CpIm+QtZwAhROXFeb7swp/ahaM3kBE/jSIUBc/AWrgBN8uNFAl+b7sAXFxFn2YLUU5Ns7gFX8C4ib+hN8gFWXwK3bZglxEJm+gKdciLPsFV/TClsgJUwKJ5FVA7tvIFrfZhVfGJDcsCKaYgAqv6YRbE+RWOWBtu7+AL3yRalXLyKqAIIfk+zARbDgFyEsncYwJvlgFRW+GEWntIi2P0BooyFxcNr8Ep3+ANLbMO+QyhvbiqdgC0kVvgUUiLYgBS2QtPbiVI1/sgOmG9uO+Y8DW+7jS2zAOnj6O2BndwuIAUtkdRN8gFoK3wwXMQyZwHVbClsuNLd4E3yAUR6FVDBR+BafQGt93LVMxJTv8ABts4CVLhcfYWsCb5kC9/BHdU8CLYFY5bMAd+eX9MGthhpbA1vu4B7+RKkaW2Yq4AQtVBBFsAJU/AuIXBhN8gGWnstefhiZyWvLAEnbYS1uzSFP6Jvn4Baxx70JKkQojLib5AVTey1jjgkKJGO0AKWyOm7N7cSpgSpAdPH0Tfd/gp1z5C1ZgKqN9J2wFxcUUuAFLZAm+QC0Fb4YUVRFsAOvj4KW2dwtYE3yAWk/wS/PLMKfmuGHZ8MAXF/Ja32Yi5haAKWz4Ydm2cSpgU693Atb7km+Zwwh+WGcPpxw3gAkzCLY+iYUDW/Z3Adc/gpzyFrAqnALkJe+7DoItgAtRS2zuKqGE3yAx0oJvkdvYrfZmALURbDuL5/RLf13cAuDeBS2RpbtAm+QFVA3wR+3fUtFHoBDJnC0jIXH0HWsgMY8inPLuOkd9chp4z20ALQLSA8cI9jYAIa2zjzjBd8gRafS1vgiUho/kAKcsCGTOGWvoOpkAtB3z8Hm8x2Ff5ADp4+lXAlIvcmwH/2Q==') repeat left top",
    "padding": "12px",
    "overflow": "auto"
  },
  "pre > code[class*=\"language-\"]": {
    "fontSize": "1em"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "borderRadius": "5px",
    "border": "1px solid #000",
    "color": "#DCCF8F",
    "background": "#181914 url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAMAAA/+4ADkFkb2JlAGTAAAAAAf/bAIQACQYGBgcGCQcHCQ0IBwgNDwsJCQsPEQ4ODw4OERENDg4ODg0RERQUFhQUERoaHBwaGiYmJiYmKysrKysrKysrKwEJCAgJCgkMCgoMDwwODA8TDg4ODhMVDg4PDg4VGhMRERERExoXGhYWFhoXHR0aGh0dJCQjJCQrKysrKysrKysr/8AAEQgAjACMAwEiAAIRAQMRAf/EAF4AAQEBAAAAAAAAAAAAAAAAAAABBwEBAQAAAAAAAAAAAAAAAAAAAAIQAAEDAwIHAQEAAAAAAAAAAADwAREhYaExkUFRcYGxwdHh8REBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AyGFEjHaBS2fDDs2zkhKmBKktb7km+ZwwCnXPkLVmCTMItj6AXFxRS465/BTnkAJvkLkJe+7AKKoi2AtRS2zuAWsCb5GOlBN8gKfmuGHZ8MFqIth3ALmFoFwbwKWyAlTAp17uKqBvgBD8sM4fTjhvAhkzhaRkBMKBrfs7jGPIpzy7gFrAqnC0C0gB0EWwBDW2cBVQwm+QtPpa3wBO3sVvszCnLAhkzgL5/RLf13cLQd8/AGlu0Cb5HTx9KuAEieGJEdcehS3eRTp2ATdt3CpIm+QtZwAhROXFeb7swp/ahaM3kBE/jSIUBc/AWrgBN8uNFAl+b7sAXFxFn2YLUU5Ns7gFX8C4ib+hN8gFWXwK3bZglxEJm+gKdciLPsFV/TClsgJUwKJ5FVA7tvIFrfZhVfGJDcsCKaYgAqv6YRbE+RWOWBtu7+AL3yRalXLyKqAIIfk+zARbDgFyEsncYwJvlgFRW+GEWntIi2P0BooyFxcNr8Ep3+ANLbMO+QyhvbiqdgC0kVvgUUiLYgBS2QtPbiVI1/sgOmG9uO+Y8DW+7jS2zAOnj6O2BndwuIAUtkdRN8gFoK3wwXMQyZwHVbClsuNLd4E3yAUR6FVDBR+BafQGt93LVMxJTv8ABts4CVLhcfYWsCb5kC9/BHdU8CLYFY5bMAd+eX9MGthhpbA1vu4B7+RKkaW2Yq4AQtVBBFsAJU/AuIXBhN8gGWnstefhiZyWvLAEnbYS1uzSFP6Jvn4Baxx70JKkQojLib5AVTey1jjgkKJGO0AKWyOm7N7cSpgSpAdPH0Tfd/gp1z5C1ZgKqN9J2wFxcUUuAFLZAm+QC0Fb4YUVRFsAOvj4KW2dwtYE3yAWk/wS/PLMKfmuGHZ8MAXF/Ja32Yi5haAKWz4Ydm2cSpgU693Atb7km+Zwwh+WGcPpxw3gAkzCLY+iYUDW/Z3Adc/gpzyFrAqnALkJe+7DoItgAtRS2zuKqGE3yAx0oJvkdvYrfZmALURbDuL5/RLf13cAuDeBS2RpbtAm+QFVA3wR+3fUtFHoBDJnC0jIXH0HWsgMY8inPLuOkd9chp4z20ALQLSA8cI9jYAIa2zjzjBd8gRafS1vgiUho/kAKcsCGTOGWvoOpkAtB3z8Hm8x2Ff5ADp4+lXAlIvcmwH/2Q==') repeat left top",
    "padding": "2px 6px"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "comment": {
    "color": "#586e75",
    "fontStyle": "italic"
  },
  "prolog": {
    "color": "#586e75",
    "fontStyle": "italic"
  },
  "doctype": {
    "color": "#586e75",
    "fontStyle": "italic"
  },
  "cdata": {
    "color": "#586e75",
    "fontStyle": "italic"
  },
  "number": {
    "color": "#b89859"
  },
  "string": {
    "color": "#468966"
  },
  "char": {
    "color": "#468966"
  },
  "builtin": {
    "color": "#468966"
  },
  "inserted": {
    "color": "#468966"
  },
  "attr-name": {
    "color": "#b89859"
  },
  "operator": {
    "color": "#dccf8f"
  },
  "entity": {
    "color": "#dccf8f",
    "cursor": "help"
  },
  "url": {
    "color": "#dccf8f"
  },
  ".language-css .token.string": {
    "color": "#dccf8f"
  },
  ".style .token.string": {
    "color": "#dccf8f"
  },
  "selector": {
    "color": "#859900"
  },
  "regex": {
    "color": "#859900"
  },
  "atrule": {
    "color": "#cb4b16"
  },
  "keyword": {
    "color": "#cb4b16"
  },
  "attr-value": {
    "color": "#468966"
  },
  "function": {
    "color": "#b58900"
  },
  "variable": {
    "color": "#b58900"
  },
  "placeholder": {
    "color": "#b58900"
  },
  "property": {
    "color": "#b89859"
  },
  "tag": {
    "color": "#ffb03b"
  },
  "boolean": {
    "color": "#b89859"
  },
  "constant": {
    "color": "#b89859"
  },
  "symbol": {
    "color": "#b89859"
  },
  "important": {
    "color": "#dc322f"
  },
  "statement": {
    "color": "#dc322f"
  },
  "deleted": {
    "color": "#dc322f"
  },
  "punctuation": {
    "color": "#dccf8f"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  }
};

/***/ }),

/***/ 4837:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "black",
    "background": "none",
    "textShadow": "0 1px white",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "black",
    "background": "#f5f2f0",
    "textShadow": "0 1px white",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#b3d4fc"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#b3d4fc"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "#b3d4fc"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "#b3d4fc"
  },
  "pre[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#b3d4fc"
  },
  "pre[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#b3d4fc"
  },
  "code[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#b3d4fc"
  },
  "code[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "#b3d4fc"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#f5f2f0",
    "padding": ".1em",
    "borderRadius": ".3em",
    "whiteSpace": "normal"
  },
  "comment": {
    "color": "slategray"
  },
  "prolog": {
    "color": "slategray"
  },
  "doctype": {
    "color": "slategray"
  },
  "cdata": {
    "color": "slategray"
  },
  "punctuation": {
    "color": "#999"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "property": {
    "color": "#905"
  },
  "tag": {
    "color": "#905"
  },
  "boolean": {
    "color": "#905"
  },
  "number": {
    "color": "#905"
  },
  "constant": {
    "color": "#905"
  },
  "symbol": {
    "color": "#905"
  },
  "deleted": {
    "color": "#905"
  },
  "selector": {
    "color": "#690"
  },
  "attr-name": {
    "color": "#690"
  },
  "string": {
    "color": "#690"
  },
  "char": {
    "color": "#690"
  },
  "builtin": {
    "color": "#690"
  },
  "inserted": {
    "color": "#690"
  },
  "operator": {
    "color": "#9a6e3a",
    "background": "hsla(0, 0%, 100%, .5)"
  },
  "entity": {
    "color": "#9a6e3a",
    "background": "hsla(0, 0%, 100%, .5)",
    "cursor": "help"
  },
  "url": {
    "color": "#9a6e3a",
    "background": "hsla(0, 0%, 100%, .5)"
  },
  ".language-css .token.string": {
    "color": "#9a6e3a",
    "background": "hsla(0, 0%, 100%, .5)"
  },
  ".style .token.string": {
    "color": "#9a6e3a",
    "background": "hsla(0, 0%, 100%, .5)"
  },
  "atrule": {
    "color": "#07a"
  },
  "attr-value": {
    "color": "#07a"
  },
  "keyword": {
    "color": "#07a"
  },
  "function": {
    "color": "#DD4A68"
  },
  "class-name": {
    "color": "#DD4A68"
  },
  "regex": {
    "color": "#e90"
  },
  "important": {
    "color": "#e90",
    "fontWeight": "bold"
  },
  "variable": {
    "color": "#e90"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  }
};

/***/ }),

/***/ 5869:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*='language-']": {
    "color": "#9efeff",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "fontFamily": "'Operator Mono', 'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontWeight": "400",
    "fontSize": "17px",
    "lineHeight": "25px",
    "letterSpacing": "0.5px",
    "textShadow": "0 1px #222245"
  },
  "pre[class*='language-']": {
    "color": "#9efeff",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "fontFamily": "'Operator Mono', 'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontWeight": "400",
    "fontSize": "17px",
    "lineHeight": "25px",
    "letterSpacing": "0.5px",
    "textShadow": "0 1px #222245",
    "padding": "2em",
    "margin": "0.5em 0",
    "overflow": "auto",
    "background": "#1e1e3f"
  },
  "pre[class*='language-']::-moz-selection": {
    "color": "inherit",
    "background": "#a599e9"
  },
  "pre[class*='language-'] ::-moz-selection": {
    "color": "inherit",
    "background": "#a599e9"
  },
  "code[class*='language-']::-moz-selection": {
    "color": "inherit",
    "background": "#a599e9"
  },
  "code[class*='language-'] ::-moz-selection": {
    "color": "inherit",
    "background": "#a599e9"
  },
  "pre[class*='language-']::selection": {
    "color": "inherit",
    "background": "#a599e9"
  },
  "pre[class*='language-'] ::selection": {
    "color": "inherit",
    "background": "#a599e9"
  },
  "code[class*='language-']::selection": {
    "color": "inherit",
    "background": "#a599e9"
  },
  "code[class*='language-'] ::selection": {
    "color": "inherit",
    "background": "#a599e9"
  },
  ":not(pre) > code[class*='language-']": {
    "background": "#1e1e3f",
    "padding": "0.1em",
    "borderRadius": "0.3em"
  },
  "": {
    "fontWeight": "400"
  },
  "comment": {
    "color": "#b362ff"
  },
  "prolog": {
    "color": "#b362ff"
  },
  "cdata": {
    "color": "#b362ff"
  },
  "delimiter": {
    "color": "#ff9d00"
  },
  "keyword": {
    "color": "#ff9d00"
  },
  "selector": {
    "color": "#ff9d00"
  },
  "important": {
    "color": "#ff9d00"
  },
  "atrule": {
    "color": "#ff9d00"
  },
  "operator": {
    "color": "rgb(255, 180, 84)",
    "background": "none"
  },
  "attr-name": {
    "color": "rgb(255, 180, 84)"
  },
  "punctuation": {
    "color": "#ffffff"
  },
  "boolean": {
    "color": "rgb(255, 98, 140)"
  },
  "tag": {
    "color": "rgb(255, 157, 0)"
  },
  "tag.punctuation": {
    "color": "rgb(255, 157, 0)"
  },
  "doctype": {
    "color": "rgb(255, 157, 0)"
  },
  "builtin": {
    "color": "rgb(255, 157, 0)"
  },
  "entity": {
    "color": "#6897bb",
    "background": "none"
  },
  "symbol": {
    "color": "#6897bb"
  },
  "number": {
    "color": "#ff628c"
  },
  "property": {
    "color": "#ff628c"
  },
  "constant": {
    "color": "#ff628c"
  },
  "variable": {
    "color": "#ff628c"
  },
  "string": {
    "color": "#a5ff90"
  },
  "char": {
    "color": "#a5ff90"
  },
  "attr-value": {
    "color": "#a5c261"
  },
  "attr-value.punctuation": {
    "color": "#a5c261"
  },
  "attr-value.punctuation:first-child": {
    "color": "#a9b7c6"
  },
  "url": {
    "color": "#287bde",
    "textDecoration": "underline",
    "background": "none"
  },
  "function": {
    "color": "rgb(250, 208, 0)"
  },
  "regex": {
    "background": "#364135"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "inserted": {
    "background": "#00ff00"
  },
  "deleted": {
    "background": "#ff000d"
  },
  "code.language-css .token.property": {
    "color": "#a9b7c6"
  },
  "code.language-css .token.property + .token.punctuation": {
    "color": "#a9b7c6"
  },
  "code.language-css .token.id": {
    "color": "#ffc66d"
  },
  "code.language-css .token.selector > .token.class": {
    "color": "#ffc66d"
  },
  "code.language-css .token.selector > .token.attribute": {
    "color": "#ffc66d"
  },
  "code.language-css .token.selector > .token.pseudo-class": {
    "color": "#ffc66d"
  },
  "code.language-css .token.selector > .token.pseudo-element": {
    "color": "#ffc66d"
  },
  "class-name": {
    "color": "#fb94ff"
  },
  ".language-css .token.string": {
    "background": "none"
  },
  ".style .token.string": {
    "background": "none"
  },
  ".line-highlight.line-highlight": {
    "marginTop": "36px",
    "background": "linear-gradient(to right, rgba(179, 98, 255, 0.17), transparent)"
  },
  ".line-highlight.line-highlight:before": {
    "content": "''"
  },
  ".line-highlight.line-highlight[data-end]:after": {
    "content": "''"
  }
};

/***/ }),

/***/ 4983:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#839496",
    "textShadow": "0 1px rgba(0, 0, 0, 0.3)",
    "fontFamily": "Inconsolata, Monaco, Consolas, 'Courier New', Courier, monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#839496",
    "textShadow": "0 1px rgba(0, 0, 0, 0.3)",
    "fontFamily": "Inconsolata, Monaco, Consolas, 'Courier New', Courier, monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto",
    "borderRadius": "0.3em",
    "background": "#002b36"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#002b36",
    "padding": ".1em",
    "borderRadius": ".3em"
  },
  "comment": {
    "color": "#586e75"
  },
  "prolog": {
    "color": "#586e75"
  },
  "doctype": {
    "color": "#586e75"
  },
  "cdata": {
    "color": "#586e75"
  },
  "punctuation": {
    "color": "#93a1a1"
  },
  ".namespace": {
    "Opacity": ".7"
  },
  "property": {
    "color": "#268bd2"
  },
  "keyword": {
    "color": "#268bd2"
  },
  "tag": {
    "color": "#268bd2"
  },
  "class-name": {
    "color": "#FFFFB6",
    "textDecoration": "underline"
  },
  "boolean": {
    "color": "#b58900"
  },
  "constant": {
    "color": "#b58900"
  },
  "symbol": {
    "color": "#dc322f"
  },
  "deleted": {
    "color": "#dc322f"
  },
  "number": {
    "color": "#859900"
  },
  "selector": {
    "color": "#859900"
  },
  "attr-name": {
    "color": "#859900"
  },
  "string": {
    "color": "#859900"
  },
  "char": {
    "color": "#859900"
  },
  "builtin": {
    "color": "#859900"
  },
  "inserted": {
    "color": "#859900"
  },
  "variable": {
    "color": "#268bd2"
  },
  "operator": {
    "color": "#EDEDED"
  },
  "function": {
    "color": "#268bd2"
  },
  "regex": {
    "color": "#E9C062"
  },
  "important": {
    "color": "#fd971f",
    "fontWeight": "bold"
  },
  "entity": {
    "color": "#FFFFB6",
    "cursor": "help"
  },
  "url": {
    "color": "#96CBFE"
  },
  ".language-css .token.string": {
    "color": "#87C38A"
  },
  ".style .token.string": {
    "color": "#87C38A"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "atrule": {
    "color": "#F9EE98"
  },
  "attr-value": {
    "color": "#F9EE98"
  }
};

/***/ }),

/***/ 6440:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#657b83",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#657b83",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto",
    "borderRadius": "0.3em",
    "backgroundColor": "#fdf6e3"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "background": "#073642"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "background": "#073642"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "background": "#073642"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "background": "#073642"
  },
  "pre[class*=\"language-\"]::selection": {
    "background": "#073642"
  },
  "pre[class*=\"language-\"] ::selection": {
    "background": "#073642"
  },
  "code[class*=\"language-\"]::selection": {
    "background": "#073642"
  },
  "code[class*=\"language-\"] ::selection": {
    "background": "#073642"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "backgroundColor": "#fdf6e3",
    "padding": ".1em",
    "borderRadius": ".3em"
  },
  "comment": {
    "color": "#93a1a1"
  },
  "prolog": {
    "color": "#93a1a1"
  },
  "doctype": {
    "color": "#93a1a1"
  },
  "cdata": {
    "color": "#93a1a1"
  },
  "punctuation": {
    "color": "#586e75"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "property": {
    "color": "#268bd2"
  },
  "tag": {
    "color": "#268bd2"
  },
  "boolean": {
    "color": "#268bd2"
  },
  "number": {
    "color": "#268bd2"
  },
  "constant": {
    "color": "#268bd2"
  },
  "symbol": {
    "color": "#268bd2"
  },
  "deleted": {
    "color": "#268bd2"
  },
  "selector": {
    "color": "#2aa198"
  },
  "attr-name": {
    "color": "#2aa198"
  },
  "string": {
    "color": "#2aa198"
  },
  "char": {
    "color": "#2aa198"
  },
  "builtin": {
    "color": "#2aa198"
  },
  "url": {
    "color": "#2aa198"
  },
  "inserted": {
    "color": "#2aa198"
  },
  "entity": {
    "color": "#657b83",
    "background": "#eee8d5",
    "cursor": "help"
  },
  "atrule": {
    "color": "#859900"
  },
  "attr-value": {
    "color": "#859900"
  },
  "keyword": {
    "color": "#859900"
  },
  "function": {
    "color": "#b58900"
  },
  "class-name": {
    "color": "#b58900"
  },
  "regex": {
    "color": "#cb4b16"
  },
  "important": {
    "color": "#cb4b16",
    "fontWeight": "bold"
  },
  "variable": {
    "color": "#cb4b16"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  }
};

/***/ }),

/***/ 5404:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#f92aad",
    "textShadow": "0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3",
    "background": "none",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#f92aad",
    "textShadow": "0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3",
    "background": "none",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto",
    "backgroundColor": "transparent !important",
    "backgroundImage": "linear-gradient(to bottom, #2a2139 75%, #34294f)"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "backgroundColor": "transparent !important",
    "backgroundImage": "linear-gradient(to bottom, #2a2139 75%, #34294f)",
    "padding": ".1em",
    "borderRadius": ".3em",
    "whiteSpace": "normal"
  },
  "comment": {
    "color": "#8e8e8e"
  },
  "block-comment": {
    "color": "#8e8e8e"
  },
  "prolog": {
    "color": "#8e8e8e"
  },
  "doctype": {
    "color": "#8e8e8e"
  },
  "cdata": {
    "color": "#8e8e8e"
  },
  "punctuation": {
    "color": "#ccc"
  },
  "tag": {
    "color": "#e2777a"
  },
  "attr-name": {
    "color": "#e2777a"
  },
  "namespace": {
    "color": "#e2777a"
  },
  "number": {
    "color": "#e2777a"
  },
  "unit": {
    "color": "#e2777a"
  },
  "hexcode": {
    "color": "#e2777a"
  },
  "deleted": {
    "color": "#e2777a"
  },
  "property": {
    "color": "#72f1b8",
    "textShadow": "0 0 2px #100c0f, 0 0 10px #257c5575, 0 0 35px #21272475"
  },
  "selector": {
    "color": "#72f1b8",
    "textShadow": "0 0 2px #100c0f, 0 0 10px #257c5575, 0 0 35px #21272475"
  },
  "function-name": {
    "color": "#6196cc"
  },
  "boolean": {
    "color": "#fdfdfd",
    "textShadow": "0 0 2px #001716, 0 0 3px #03edf975, 0 0 5px #03edf975, 0 0 8px #03edf975"
  },
  "selector.id": {
    "color": "#fdfdfd",
    "textShadow": "0 0 2px #001716, 0 0 3px #03edf975, 0 0 5px #03edf975, 0 0 8px #03edf975"
  },
  "function": {
    "color": "#fdfdfd",
    "textShadow": "0 0 2px #001716, 0 0 3px #03edf975, 0 0 5px #03edf975, 0 0 8px #03edf975"
  },
  "class-name": {
    "color": "#fff5f6",
    "textShadow": "0 0 2px #000, 0 0 10px #fc1f2c75, 0 0 5px #fc1f2c75, 0 0 25px #fc1f2c75"
  },
  "constant": {
    "color": "#f92aad",
    "textShadow": "0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3"
  },
  "symbol": {
    "color": "#f92aad",
    "textShadow": "0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3"
  },
  "important": {
    "color": "#f4eee4",
    "textShadow": "0 0 2px #393a33, 0 0 8px #f39f0575, 0 0 2px #f39f0575",
    "fontWeight": "bold"
  },
  "atrule": {
    "color": "#f4eee4",
    "textShadow": "0 0 2px #393a33, 0 0 8px #f39f0575, 0 0 2px #f39f0575"
  },
  "keyword": {
    "color": "#f4eee4",
    "textShadow": "0 0 2px #393a33, 0 0 8px #f39f0575, 0 0 2px #f39f0575"
  },
  "selector.class": {
    "color": "#f4eee4",
    "textShadow": "0 0 2px #393a33, 0 0 8px #f39f0575, 0 0 2px #f39f0575"
  },
  "builtin": {
    "color": "#f4eee4",
    "textShadow": "0 0 2px #393a33, 0 0 8px #f39f0575, 0 0 2px #f39f0575"
  },
  "string": {
    "color": "#f87c32"
  },
  "char": {
    "color": "#f87c32"
  },
  "attr-value": {
    "color": "#f87c32"
  },
  "regex": {
    "color": "#f87c32"
  },
  "variable": {
    "color": "#f87c32"
  },
  "operator": {
    "color": "#67cdcc"
  },
  "entity": {
    "color": "#67cdcc",
    "cursor": "help"
  },
  "url": {
    "color": "#67cdcc"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "inserted": {
    "color": "green"
  }
};

/***/ }),

/***/ 8940:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#ccc",
    "background": "none",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#ccc",
    "background": "#2d2d2d",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#2d2d2d",
    "padding": ".1em",
    "borderRadius": ".3em",
    "whiteSpace": "normal"
  },
  "comment": {
    "color": "#999"
  },
  "block-comment": {
    "color": "#999"
  },
  "prolog": {
    "color": "#999"
  },
  "doctype": {
    "color": "#999"
  },
  "cdata": {
    "color": "#999"
  },
  "punctuation": {
    "color": "#ccc"
  },
  "tag": {
    "color": "#e2777a"
  },
  "attr-name": {
    "color": "#e2777a"
  },
  "namespace": {
    "color": "#e2777a"
  },
  "deleted": {
    "color": "#e2777a"
  },
  "function-name": {
    "color": "#6196cc"
  },
  "boolean": {
    "color": "#f08d49"
  },
  "number": {
    "color": "#f08d49"
  },
  "function": {
    "color": "#f08d49"
  },
  "property": {
    "color": "#f8c555"
  },
  "class-name": {
    "color": "#f8c555"
  },
  "constant": {
    "color": "#f8c555"
  },
  "symbol": {
    "color": "#f8c555"
  },
  "selector": {
    "color": "#cc99cd"
  },
  "important": {
    "color": "#cc99cd",
    "fontWeight": "bold"
  },
  "atrule": {
    "color": "#cc99cd"
  },
  "keyword": {
    "color": "#cc99cd"
  },
  "builtin": {
    "color": "#cc99cd"
  },
  "string": {
    "color": "#7ec699"
  },
  "char": {
    "color": "#7ec699"
  },
  "attr-value": {
    "color": "#7ec699"
  },
  "regex": {
    "color": "#7ec699"
  },
  "variable": {
    "color": "#7ec699"
  },
  "operator": {
    "color": "#67cdcc"
  },
  "entity": {
    "color": "#67cdcc",
    "cursor": "help"
  },
  "url": {
    "color": "#67cdcc"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "inserted": {
    "color": "green"
  }
};

/***/ }),

/***/ 6015:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "white",
    "background": "none",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "textShadow": "0 -.1em .2em black",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "white",
    "background": "hsl(0, 0%, 8%)",
    "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "fontSize": "1em",
    "textAlign": "left",
    "textShadow": "0 -.1em .2em black",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "borderRadius": ".5em",
    "border": ".3em solid hsl(0, 0%, 33%)",
    "boxShadow": "1px 1px .5em black inset",
    "margin": ".5em 0",
    "overflow": "auto",
    "padding": "1em"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "hsl(0, 0%, 8%)",
    "borderRadius": ".3em",
    "border": ".13em solid hsl(0, 0%, 33%)",
    "boxShadow": "1px 1px .3em -.1em black inset",
    "padding": ".15em .2em .05em",
    "whiteSpace": "normal"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "background": "hsla(0, 0%, 93%, 0.15)",
    "textShadow": "none"
  },
  "pre[class*=\"language-\"]::selection": {
    "background": "hsla(0, 0%, 93%, 0.15)",
    "textShadow": "none"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "hsla(0, 0%, 93%, 0.15)"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "hsla(0, 0%, 93%, 0.15)"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "hsla(0, 0%, 93%, 0.15)"
  },
  "pre[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "hsla(0, 0%, 93%, 0.15)"
  },
  "code[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "hsla(0, 0%, 93%, 0.15)"
  },
  "code[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "hsla(0, 0%, 93%, 0.15)"
  },
  "comment": {
    "color": "hsl(0, 0%, 47%)"
  },
  "prolog": {
    "color": "hsl(0, 0%, 47%)"
  },
  "doctype": {
    "color": "hsl(0, 0%, 47%)"
  },
  "cdata": {
    "color": "hsl(0, 0%, 47%)"
  },
  "punctuation": {
    "Opacity": ".7"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "tag": {
    "color": "hsl(14, 58%, 55%)"
  },
  "boolean": {
    "color": "hsl(14, 58%, 55%)"
  },
  "number": {
    "color": "hsl(14, 58%, 55%)"
  },
  "deleted": {
    "color": "hsl(14, 58%, 55%)"
  },
  "keyword": {
    "color": "hsl(53, 89%, 79%)"
  },
  "property": {
    "color": "hsl(53, 89%, 79%)"
  },
  "selector": {
    "color": "hsl(53, 89%, 79%)"
  },
  "constant": {
    "color": "hsl(53, 89%, 79%)"
  },
  "symbol": {
    "color": "hsl(53, 89%, 79%)"
  },
  "builtin": {
    "color": "hsl(53, 89%, 79%)"
  },
  "attr-name": {
    "color": "hsl(76, 21%, 52%)"
  },
  "attr-value": {
    "color": "hsl(76, 21%, 52%)"
  },
  "string": {
    "color": "hsl(76, 21%, 52%)"
  },
  "char": {
    "color": "hsl(76, 21%, 52%)"
  },
  "operator": {
    "color": "hsl(76, 21%, 52%)"
  },
  "entity": {
    "color": "hsl(76, 21%, 52%)",
    "cursor": "help"
  },
  "url": {
    "color": "hsl(76, 21%, 52%)"
  },
  ".language-css .token.string": {
    "color": "hsl(76, 21%, 52%)"
  },
  ".style .token.string": {
    "color": "hsl(76, 21%, 52%)"
  },
  "variable": {
    "color": "hsl(76, 21%, 52%)"
  },
  "inserted": {
    "color": "hsl(76, 21%, 52%)"
  },
  "atrule": {
    "color": "hsl(218, 22%, 55%)"
  },
  "regex": {
    "color": "hsl(42, 75%, 65%)"
  },
  "important": {
    "color": "hsl(42, 75%, 65%)",
    "fontWeight": "bold"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  ".language-markup .token.tag": {
    "color": "hsl(33, 33%, 52%)"
  },
  ".language-markup .token.attr-name": {
    "color": "hsl(33, 33%, 52%)"
  },
  ".language-markup .token.punctuation": {
    "color": "hsl(33, 33%, 52%)"
  },
  "": {
    "position": "relative",
    "zIndex": "1"
  },
  ".line-highlight.line-highlight": {
    "background": "linear-gradient(to right, hsla(0, 0%, 33%, .1) 70%, hsla(0, 0%, 33%, 0))",
    "borderBottom": "1px dashed hsl(0, 0%, 33%)",
    "borderTop": "1px dashed hsl(0, 0%, 33%)",
    "marginTop": "0.75em",
    "zIndex": "0"
  },
  ".line-highlight.line-highlight:before": {
    "backgroundColor": "hsl(215, 15%, 59%)",
    "color": "hsl(24, 20%, 95%)"
  },
  ".line-highlight.line-highlight[data-end]:after": {
    "backgroundColor": "hsl(215, 15%, 59%)",
    "color": "hsl(24, 20%, 95%)"
  }
};

/***/ }),

/***/ 9249:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#393A34",
    "fontFamily": "\"Consolas\", \"Bitstream Vera Sans Mono\", \"Courier New\", Courier, monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "fontSize": ".9em",
    "lineHeight": "1.2em",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
    "color": "#393A34",
    "fontFamily": "\"Consolas\", \"Bitstream Vera Sans Mono\", \"Courier New\", Courier, monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "fontSize": ".9em",
    "lineHeight": "1.2em",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto",
    "border": "1px solid #dddddd",
    "backgroundColor": "white"
  },
  "pre > code[class*=\"language-\"]": {
    "fontSize": "1em"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "background": "#C1DEF1"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "background": "#C1DEF1"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "background": "#C1DEF1"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "background": "#C1DEF1"
  },
  "pre[class*=\"language-\"]::selection": {
    "background": "#C1DEF1"
  },
  "pre[class*=\"language-\"] ::selection": {
    "background": "#C1DEF1"
  },
  "code[class*=\"language-\"]::selection": {
    "background": "#C1DEF1"
  },
  "code[class*=\"language-\"] ::selection": {
    "background": "#C1DEF1"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "padding": ".2em",
    "paddingTop": "1px",
    "paddingBottom": "1px",
    "background": "#f8f8f8",
    "border": "1px solid #dddddd"
  },
  "comment": {
    "color": "#008000",
    "fontStyle": "italic"
  },
  "prolog": {
    "color": "#008000",
    "fontStyle": "italic"
  },
  "doctype": {
    "color": "#008000",
    "fontStyle": "italic"
  },
  "cdata": {
    "color": "#008000",
    "fontStyle": "italic"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "string": {
    "color": "#A31515"
  },
  "punctuation": {
    "color": "#393A34"
  },
  "operator": {
    "color": "#393A34"
  },
  "url": {
    "color": "#36acaa"
  },
  "symbol": {
    "color": "#36acaa"
  },
  "number": {
    "color": "#36acaa"
  },
  "boolean": {
    "color": "#36acaa"
  },
  "variable": {
    "color": "#36acaa"
  },
  "constant": {
    "color": "#36acaa"
  },
  "inserted": {
    "color": "#36acaa"
  },
  "atrule": {
    "color": "#0000ff"
  },
  "keyword": {
    "color": "#0000ff"
  },
  "attr-value": {
    "color": "#0000ff"
  },
  ".language-autohotkey .token.selector": {
    "color": "#0000ff"
  },
  ".language-json .token.boolean": {
    "color": "#0000ff"
  },
  ".language-json .token.number": {
    "color": "#0000ff"
  },
  "code[class*=\"language-css\"]": {
    "color": "#0000ff"
  },
  "function": {
    "color": "#393A34"
  },
  "deleted": {
    "color": "#9a050f"
  },
  ".language-autohotkey .token.tag": {
    "color": "#9a050f"
  },
  "selector": {
    "color": "#800000"
  },
  ".language-autohotkey .token.keyword": {
    "color": "#00009f"
  },
  "important": {
    "color": "#e90",
    "fontWeight": "bold"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "class-name": {
    "color": "#2B91AF"
  },
  ".language-json .token.property": {
    "color": "#2B91AF"
  },
  "tag": {
    "color": "#800000"
  },
  "attr-name": {
    "color": "#ff0000"
  },
  "property": {
    "color": "#ff0000"
  },
  "regex": {
    "color": "#ff0000"
  },
  "entity": {
    "color": "#ff0000"
  },
  "directive.tag.tag": {
    "background": "#ffff00",
    "color": "#393A34"
  },
  ".line-numbers.line-numbers .line-numbers-rows": {
    "borderRightColor": "#a5a5a5"
  },
  ".line-numbers .line-numbers-rows > span:before": {
    "color": "#2B91AF"
  },
  ".line-highlight.line-highlight": {
    "background": "linear-gradient(to right, rgba(193, 222, 241, 0.2) 70%, rgba(221, 222, 241, 0))"
  }
};

/***/ }),

/***/ 2096:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "pre[class*=\"language-\"]": {
    "color": "#d4d4d4",
    "fontSize": "13px",
    "textShadow": "none",
    "fontFamily": "Menlo, Monaco, Consolas, \"Andale Mono\", \"Ubuntu Mono\", \"Courier New\", monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "padding": "1em",
    "margin": ".5em 0",
    "overflow": "auto",
    "background": "#1e1e1e"
  },
  "code[class*=\"language-\"]": {
    "color": "#d4d4d4",
    "fontSize": "13px",
    "textShadow": "none",
    "fontFamily": "Menlo, Monaco, Consolas, \"Andale Mono\", \"Ubuntu Mono\", \"Courier New\", monospace",
    "direction": "ltr",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "lineHeight": "1.5",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none"
  },
  "pre[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#264F78"
  },
  "code[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "#264F78"
  },
  "pre[class*=\"language-\"] *::selection": {
    "textShadow": "none",
    "background": "#264F78"
  },
  "code[class*=\"language-\"] *::selection": {
    "textShadow": "none",
    "background": "#264F78"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "padding": ".1em .3em",
    "borderRadius": ".3em",
    "color": "#db4c69",
    "background": "#1e1e1e"
  },
  ".namespace": {
    "Opacity": ".7"
  },
  "doctype.doctype-tag": {
    "color": "#569CD6"
  },
  "doctype.name": {
    "color": "#9cdcfe"
  },
  "comment": {
    "color": "#6a9955"
  },
  "prolog": {
    "color": "#6a9955"
  },
  "punctuation": {
    "color": "#d4d4d4"
  },
  ".language-html .language-css .token.punctuation": {
    "color": "#d4d4d4"
  },
  ".language-html .language-javascript .token.punctuation": {
    "color": "#d4d4d4"
  },
  "property": {
    "color": "#9cdcfe"
  },
  "tag": {
    "color": "#569cd6"
  },
  "boolean": {
    "color": "#569cd6"
  },
  "number": {
    "color": "#b5cea8"
  },
  "constant": {
    "color": "#9cdcfe"
  },
  "symbol": {
    "color": "#b5cea8"
  },
  "inserted": {
    "color": "#b5cea8"
  },
  "unit": {
    "color": "#b5cea8"
  },
  "selector": {
    "color": "#d7ba7d"
  },
  "attr-name": {
    "color": "#9cdcfe"
  },
  "string": {
    "color": "#ce9178"
  },
  "char": {
    "color": "#ce9178"
  },
  "builtin": {
    "color": "#ce9178"
  },
  "deleted": {
    "color": "#ce9178"
  },
  ".language-css .token.string.url": {
    "textDecoration": "underline"
  },
  "operator": {
    "color": "#d4d4d4"
  },
  "entity": {
    "color": "#569cd6"
  },
  "operator.arrow": {
    "color": "#569CD6"
  },
  "atrule": {
    "color": "#ce9178"
  },
  "atrule.rule": {
    "color": "#c586c0"
  },
  "atrule.url": {
    "color": "#9cdcfe"
  },
  "atrule.url.function": {
    "color": "#dcdcaa"
  },
  "atrule.url.punctuation": {
    "color": "#d4d4d4"
  },
  "keyword": {
    "color": "#569CD6"
  },
  "keyword.module": {
    "color": "#c586c0"
  },
  "keyword.control-flow": {
    "color": "#c586c0"
  },
  "function": {
    "color": "#dcdcaa"
  },
  "function.maybe-class-name": {
    "color": "#dcdcaa"
  },
  "regex": {
    "color": "#d16969"
  },
  "important": {
    "color": "#569cd6"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "class-name": {
    "color": "#4ec9b0"
  },
  "maybe-class-name": {
    "color": "#4ec9b0"
  },
  "console": {
    "color": "#9cdcfe"
  },
  "parameter": {
    "color": "#9cdcfe"
  },
  "interpolation": {
    "color": "#9cdcfe"
  },
  "punctuation.interpolation-punctuation": {
    "color": "#569cd6"
  },
  "variable": {
    "color": "#9cdcfe"
  },
  "imports.maybe-class-name": {
    "color": "#9cdcfe"
  },
  "exports.maybe-class-name": {
    "color": "#9cdcfe"
  },
  "escape": {
    "color": "#d7ba7d"
  },
  "tag.punctuation": {
    "color": "#808080"
  },
  "cdata": {
    "color": "#808080"
  },
  "attr-value": {
    "color": "#ce9178"
  },
  "attr-value.punctuation": {
    "color": "#ce9178"
  },
  "attr-value.punctuation.attr-equals": {
    "color": "#d4d4d4"
  },
  "namespace": {
    "color": "#4ec9b0"
  },
  "pre[class*=\"language-javascript\"]": {
    "color": "#9cdcfe"
  },
  "code[class*=\"language-javascript\"]": {
    "color": "#9cdcfe"
  },
  "pre[class*=\"language-jsx\"]": {
    "color": "#9cdcfe"
  },
  "code[class*=\"language-jsx\"]": {
    "color": "#9cdcfe"
  },
  "pre[class*=\"language-typescript\"]": {
    "color": "#9cdcfe"
  },
  "code[class*=\"language-typescript\"]": {
    "color": "#9cdcfe"
  },
  "pre[class*=\"language-tsx\"]": {
    "color": "#9cdcfe"
  },
  "code[class*=\"language-tsx\"]": {
    "color": "#9cdcfe"
  },
  "pre[class*=\"language-css\"]": {
    "color": "#ce9178"
  },
  "code[class*=\"language-css\"]": {
    "color": "#ce9178"
  },
  "pre[class*=\"language-html\"]": {
    "color": "#d4d4d4"
  },
  "code[class*=\"language-html\"]": {
    "color": "#d4d4d4"
  },
  ".language-regex .token.anchor": {
    "color": "#dcdcaa"
  },
  ".language-html .token.punctuation": {
    "color": "#808080"
  },
  "pre[class*=\"language-\"] > code[class*=\"language-\"]": {
    "position": "relative",
    "zIndex": "1"
  },
  ".line-highlight.line-highlight": {
    "background": "#f7ebc6",
    "boxShadow": "inset 5px 0 0 #f7d87c",
    "zIndex": "0"
  }
};

/***/ }),

/***/ 4872:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "MozTabSize": "2",
    "OTabSize": "2",
    "tabSize": "2",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "whiteSpace": "pre-wrap",
    "wordWrap": "normal",
    "fontFamily": "Menlo, Monaco, \"Courier New\", monospace",
    "fontSize": "14px",
    "color": "#76d9e6",
    "textShadow": "none"
  },
  "pre[class*=\"language-\"]": {
    "MozTabSize": "2",
    "OTabSize": "2",
    "tabSize": "2",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "whiteSpace": "pre-wrap",
    "wordWrap": "normal",
    "fontFamily": "Menlo, Monaco, \"Courier New\", monospace",
    "fontSize": "14px",
    "color": "#76d9e6",
    "textShadow": "none",
    "background": "#2a2a2a",
    "padding": "15px",
    "borderRadius": "4px",
    "border": "1px solid #e1e1e8",
    "overflow": "auto",
    "position": "relative"
  },
  "pre > code[class*=\"language-\"]": {
    "fontSize": "1em"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "background": "#2a2a2a",
    "padding": "0.15em 0.2em 0.05em",
    "borderRadius": ".3em",
    "border": "0.13em solid #7a6652",
    "boxShadow": "1px 1px 0.3em -0.1em #000 inset"
  },
  "pre[class*=\"language-\"] code": {
    "whiteSpace": "pre",
    "display": "block"
  },
  "namespace": {
    "Opacity": ".7"
  },
  "comment": {
    "color": "#6f705e"
  },
  "prolog": {
    "color": "#6f705e"
  },
  "doctype": {
    "color": "#6f705e"
  },
  "cdata": {
    "color": "#6f705e"
  },
  "operator": {
    "color": "#a77afe"
  },
  "boolean": {
    "color": "#a77afe"
  },
  "number": {
    "color": "#a77afe"
  },
  "attr-name": {
    "color": "#e6d06c"
  },
  "string": {
    "color": "#e6d06c"
  },
  "entity": {
    "color": "#e6d06c",
    "cursor": "help"
  },
  "url": {
    "color": "#e6d06c"
  },
  ".language-css .token.string": {
    "color": "#e6d06c"
  },
  ".style .token.string": {
    "color": "#e6d06c"
  },
  "selector": {
    "color": "#a6e22d"
  },
  "inserted": {
    "color": "#a6e22d"
  },
  "atrule": {
    "color": "#ef3b7d"
  },
  "attr-value": {
    "color": "#ef3b7d"
  },
  "keyword": {
    "color": "#ef3b7d"
  },
  "important": {
    "color": "#ef3b7d",
    "fontWeight": "bold"
  },
  "deleted": {
    "color": "#ef3b7d"
  },
  "regex": {
    "color": "#76d9e6"
  },
  "statement": {
    "color": "#76d9e6",
    "fontWeight": "bold"
  },
  "placeholder": {
    "color": "#fff"
  },
  "variable": {
    "color": "#fff"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "punctuation": {
    "color": "#bebec5"
  },
  "italic": {
    "fontStyle": "italic"
  },
  "code.language-markup": {
    "color": "#f9f9f9"
  },
  "code.language-markup .token.tag": {
    "color": "#ef3b7d"
  },
  "code.language-markup .token.attr-name": {
    "color": "#a6e22d"
  },
  "code.language-markup .token.attr-value": {
    "color": "#e6d06c"
  },
  "code.language-markup .token.style": {
    "color": "#76d9e6"
  },
  "code.language-markup .token.script": {
    "color": "#76d9e6"
  },
  "code.language-markup .token.script .token.keyword": {
    "color": "#76d9e6"
  },
  ".line-highlight.line-highlight": {
    "padding": "0",
    "background": "rgba(255, 255, 255, 0.08)"
  },
  ".line-highlight.line-highlight:before": {
    "padding": "0.2em 0.5em",
    "backgroundColor": "rgba(255, 255, 255, 0.4)",
    "color": "black",
    "height": "1em",
    "lineHeight": "1em",
    "boxShadow": "0 1px 1px rgba(255, 255, 255, 0.7)"
  },
  ".line-highlight.line-highlight[data-end]:after": {
    "padding": "0.2em 0.5em",
    "backgroundColor": "rgba(255, 255, 255, 0.4)",
    "color": "black",
    "height": "1em",
    "lineHeight": "1em",
    "boxShadow": "0 1px 1px rgba(255, 255, 255, 0.7)"
  }
};

/***/ }),

/***/ 9928:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  "code[class*=\"language-\"]": {
    "color": "#22da17",
    "fontFamily": "monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "lineHeight": "25px",
    "fontSize": "18px",
    "margin": "5px 0"
  },
  "pre[class*=\"language-\"]": {
    "color": "white",
    "fontFamily": "monospace",
    "textAlign": "left",
    "whiteSpace": "pre",
    "wordSpacing": "normal",
    "wordBreak": "normal",
    "wordWrap": "normal",
    "MozTabSize": "4",
    "OTabSize": "4",
    "tabSize": "4",
    "WebkitHyphens": "none",
    "MozHyphens": "none",
    "msHyphens": "none",
    "hyphens": "none",
    "lineHeight": "25px",
    "fontSize": "18px",
    "margin": "0.5em 0",
    "background": "#0a143c",
    "padding": "1em",
    "overflow": "auto"
  },
  "pre[class*=\"language-\"] *": {
    "fontFamily": "monospace"
  },
  ":not(pre) > code[class*=\"language-\"]": {
    "color": "white",
    "background": "#0a143c",
    "padding": "0.1em",
    "borderRadius": "0.3em",
    "whiteSpace": "normal"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  "code[class*=\"language-\"]::-moz-selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  "pre[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  "pre[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  "code[class*=\"language-\"]::selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  "code[class*=\"language-\"] ::selection": {
    "textShadow": "none",
    "background": "rgba(29, 59, 83, 0.99)"
  },
  "comment": {
    "color": "rgb(99, 119, 119)",
    "fontStyle": "italic"
  },
  "prolog": {
    "color": "rgb(99, 119, 119)",
    "fontStyle": "italic"
  },
  "cdata": {
    "color": "rgb(99, 119, 119)",
    "fontStyle": "italic"
  },
  "punctuation": {
    "color": "rgb(199, 146, 234)"
  },
  ".namespace": {
    "color": "rgb(178, 204, 214)"
  },
  "deleted": {
    "color": "rgba(239, 83, 80, 0.56)",
    "fontStyle": "italic"
  },
  "symbol": {
    "color": "rgb(128, 203, 196)"
  },
  "property": {
    "color": "rgb(128, 203, 196)"
  },
  "tag": {
    "color": "rgb(127, 219, 202)"
  },
  "operator": {
    "color": "rgb(127, 219, 202)"
  },
  "keyword": {
    "color": "rgb(127, 219, 202)"
  },
  "boolean": {
    "color": "rgb(255, 88, 116)"
  },
  "number": {
    "color": "rgb(247, 140, 108)"
  },
  "constant": {
    "color": "rgb(34 183 199)"
  },
  "function": {
    "color": "rgb(34 183 199)"
  },
  "builtin": {
    "color": "rgb(34 183 199)"
  },
  "char": {
    "color": "rgb(34 183 199)"
  },
  "selector": {
    "color": "rgb(199, 146, 234)",
    "fontStyle": "italic"
  },
  "doctype": {
    "color": "rgb(199, 146, 234)",
    "fontStyle": "italic"
  },
  "attr-name": {
    "color": "rgb(173, 219, 103)",
    "fontStyle": "italic"
  },
  "inserted": {
    "color": "rgb(173, 219, 103)",
    "fontStyle": "italic"
  },
  "string": {
    "color": "rgb(173, 219, 103)"
  },
  "url": {
    "color": "rgb(173, 219, 103)"
  },
  "entity": {
    "color": "rgb(173, 219, 103)"
  },
  ".language-css .token.string": {
    "color": "rgb(173, 219, 103)"
  },
  ".style .token.string": {
    "color": "rgb(173, 219, 103)"
  },
  "class-name": {
    "color": "rgb(255, 203, 139)"
  },
  "atrule": {
    "color": "rgb(255, 203, 139)"
  },
  "attr-value": {
    "color": "rgb(255, 203, 139)"
  },
  "regex": {
    "color": "rgb(214, 222, 235)"
  },
  "important": {
    "color": "rgb(214, 222, 235)",
    "fontWeight": "bold"
  },
  "variable": {
    "color": "rgb(214, 222, 235)"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "italic": {
    "fontStyle": "italic"
  }
};

/***/ }),

/***/ 1083:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": function() { return /* binding */ prism_light; }
});

// EXTERNAL MODULE: ../../node_modules/.pnpm/@babel+runtime@7.28.6/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
var objectWithoutPropertiesLoose = __webpack_require__(4846);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.28.6/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js

function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = (0,objectWithoutPropertiesLoose/* default */.Z)(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.28.6/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.28.6/node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.28.6/node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.28.6/node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.28.6/node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.28.6/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/@babel+runtime@7.28.6/node_modules/@babel/runtime/helpers/esm/defineProperty.js + 3 modules
var defineProperty = __webpack_require__(9009);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react@18.0.0/node_modules/react/index.js
var react = __webpack_require__(6248);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@babel+runtime@7.28.6/node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(8404);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/react-syntax-highlighter@16.1.0_react@18.0.0/node_modules/react-syntax-highlighter/dist/esm/create-element.js


function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* default */.Z)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }


// Get all possible permutations of all power sets
//
// Super simple, non-algorithmic solution since the
// number of class names will not be greater than 4
function powerSetPermutations(arr) {
  var arrLength = arr.length;
  if (arrLength === 0 || arrLength === 1) return arr;
  if (arrLength === 2) {
    // prettier-ignore
    return [arr[0], arr[1], "".concat(arr[0], ".").concat(arr[1]), "".concat(arr[1], ".").concat(arr[0])];
  }
  if (arrLength === 3) {
    return [arr[0], arr[1], arr[2], "".concat(arr[0], ".").concat(arr[1]), "".concat(arr[0], ".").concat(arr[2]), "".concat(arr[1], ".").concat(arr[0]), "".concat(arr[1], ".").concat(arr[2]), "".concat(arr[2], ".").concat(arr[0]), "".concat(arr[2], ".").concat(arr[1]), "".concat(arr[0], ".").concat(arr[1], ".").concat(arr[2]), "".concat(arr[0], ".").concat(arr[2], ".").concat(arr[1]), "".concat(arr[1], ".").concat(arr[0], ".").concat(arr[2]), "".concat(arr[1], ".").concat(arr[2], ".").concat(arr[0]), "".concat(arr[2], ".").concat(arr[0], ".").concat(arr[1]), "".concat(arr[2], ".").concat(arr[1], ".").concat(arr[0])];
  }
  if (arrLength >= 4) {
    // Currently does not support more than 4 extra
    // class names (after `.token` has been removed)
    return [arr[0], arr[1], arr[2], arr[3], "".concat(arr[0], ".").concat(arr[1]), "".concat(arr[0], ".").concat(arr[2]), "".concat(arr[0], ".").concat(arr[3]), "".concat(arr[1], ".").concat(arr[0]), "".concat(arr[1], ".").concat(arr[2]), "".concat(arr[1], ".").concat(arr[3]), "".concat(arr[2], ".").concat(arr[0]), "".concat(arr[2], ".").concat(arr[1]), "".concat(arr[2], ".").concat(arr[3]), "".concat(arr[3], ".").concat(arr[0]), "".concat(arr[3], ".").concat(arr[1]), "".concat(arr[3], ".").concat(arr[2]), "".concat(arr[0], ".").concat(arr[1], ".").concat(arr[2]), "".concat(arr[0], ".").concat(arr[1], ".").concat(arr[3]), "".concat(arr[0], ".").concat(arr[2], ".").concat(arr[1]), "".concat(arr[0], ".").concat(arr[2], ".").concat(arr[3]), "".concat(arr[0], ".").concat(arr[3], ".").concat(arr[1]), "".concat(arr[0], ".").concat(arr[3], ".").concat(arr[2]), "".concat(arr[1], ".").concat(arr[0], ".").concat(arr[2]), "".concat(arr[1], ".").concat(arr[0], ".").concat(arr[3]), "".concat(arr[1], ".").concat(arr[2], ".").concat(arr[0]), "".concat(arr[1], ".").concat(arr[2], ".").concat(arr[3]), "".concat(arr[1], ".").concat(arr[3], ".").concat(arr[0]), "".concat(arr[1], ".").concat(arr[3], ".").concat(arr[2]), "".concat(arr[2], ".").concat(arr[0], ".").concat(arr[1]), "".concat(arr[2], ".").concat(arr[0], ".").concat(arr[3]), "".concat(arr[2], ".").concat(arr[1], ".").concat(arr[0]), "".concat(arr[2], ".").concat(arr[1], ".").concat(arr[3]), "".concat(arr[2], ".").concat(arr[3], ".").concat(arr[0]), "".concat(arr[2], ".").concat(arr[3], ".").concat(arr[1]), "".concat(arr[3], ".").concat(arr[0], ".").concat(arr[1]), "".concat(arr[3], ".").concat(arr[0], ".").concat(arr[2]), "".concat(arr[3], ".").concat(arr[1], ".").concat(arr[0]), "".concat(arr[3], ".").concat(arr[1], ".").concat(arr[2]), "".concat(arr[3], ".").concat(arr[2], ".").concat(arr[0]), "".concat(arr[3], ".").concat(arr[2], ".").concat(arr[1]), "".concat(arr[0], ".").concat(arr[1], ".").concat(arr[2], ".").concat(arr[3]), "".concat(arr[0], ".").concat(arr[1], ".").concat(arr[3], ".").concat(arr[2]), "".concat(arr[0], ".").concat(arr[2], ".").concat(arr[1], ".").concat(arr[3]), "".concat(arr[0], ".").concat(arr[2], ".").concat(arr[3], ".").concat(arr[1]), "".concat(arr[0], ".").concat(arr[3], ".").concat(arr[1], ".").concat(arr[2]), "".concat(arr[0], ".").concat(arr[3], ".").concat(arr[2], ".").concat(arr[1]), "".concat(arr[1], ".").concat(arr[0], ".").concat(arr[2], ".").concat(arr[3]), "".concat(arr[1], ".").concat(arr[0], ".").concat(arr[3], ".").concat(arr[2]), "".concat(arr[1], ".").concat(arr[2], ".").concat(arr[0], ".").concat(arr[3]), "".concat(arr[1], ".").concat(arr[2], ".").concat(arr[3], ".").concat(arr[0]), "".concat(arr[1], ".").concat(arr[3], ".").concat(arr[0], ".").concat(arr[2]), "".concat(arr[1], ".").concat(arr[3], ".").concat(arr[2], ".").concat(arr[0]), "".concat(arr[2], ".").concat(arr[0], ".").concat(arr[1], ".").concat(arr[3]), "".concat(arr[2], ".").concat(arr[0], ".").concat(arr[3], ".").concat(arr[1]), "".concat(arr[2], ".").concat(arr[1], ".").concat(arr[0], ".").concat(arr[3]), "".concat(arr[2], ".").concat(arr[1], ".").concat(arr[3], ".").concat(arr[0]), "".concat(arr[2], ".").concat(arr[3], ".").concat(arr[0], ".").concat(arr[1]), "".concat(arr[2], ".").concat(arr[3], ".").concat(arr[1], ".").concat(arr[0]), "".concat(arr[3], ".").concat(arr[0], ".").concat(arr[1], ".").concat(arr[2]), "".concat(arr[3], ".").concat(arr[0], ".").concat(arr[2], ".").concat(arr[1]), "".concat(arr[3], ".").concat(arr[1], ".").concat(arr[0], ".").concat(arr[2]), "".concat(arr[3], ".").concat(arr[1], ".").concat(arr[2], ".").concat(arr[0]), "".concat(arr[3], ".").concat(arr[2], ".").concat(arr[0], ".").concat(arr[1]), "".concat(arr[3], ".").concat(arr[2], ".").concat(arr[1], ".").concat(arr[0])];
  }
}
var classNameCombinations = {};
function getClassNameCombinations(classNames) {
  if (classNames.length === 0 || classNames.length === 1) return classNames;
  var key = classNames.join('.');
  if (!classNameCombinations[key]) {
    classNameCombinations[key] = powerSetPermutations(classNames);
  }
  return classNameCombinations[key];
}
function createStyleObject(classNames) {
  var elementStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var stylesheet = arguments.length > 2 ? arguments[2] : undefined;
  var nonTokenClassNames = classNames.filter(function (className) {
    return className !== 'token';
  });
  var classNamesCombinations = getClassNameCombinations(nonTokenClassNames);
  return classNamesCombinations.reduce(function (styleObject, className) {
    return _objectSpread(_objectSpread({}, styleObject), stylesheet[className]);
  }, elementStyle);
}
function createClassNameString(classNames) {
  return classNames.join(' ');
}
function createChildren(stylesheet, useInlineStyles) {
  var childrenCount = 0;
  return function (children) {
    childrenCount += 1;
    return children.map(function (child, i) {
      return createElement({
        node: child,
        stylesheet: stylesheet,
        useInlineStyles: useInlineStyles,
        key: "code-segment-".concat(childrenCount, "-").concat(i)
      });
    });
  };
}
function createElement(_ref) {
  var node = _ref.node,
    stylesheet = _ref.stylesheet,
    _ref$style = _ref.style,
    style = _ref$style === void 0 ? {} : _ref$style,
    useInlineStyles = _ref.useInlineStyles,
    key = _ref.key;
  var properties = node.properties,
    type = node.type,
    TagName = node.tagName,
    value = node.value;
  if (type === 'text') {
    return value;
  } else if (TagName) {
    var childrenCreator = createChildren(stylesheet, useInlineStyles);
    var props;
    if (!useInlineStyles) {
      props = _objectSpread(_objectSpread({}, properties), {}, {
        className: createClassNameString(properties.className)
      });
    } else {
      var allStylesheetSelectors = Object.keys(stylesheet).reduce(function (classes, selector) {
        selector.split('.').forEach(function (className) {
          if (!classes.includes(className)) classes.push(className);
        });
        return classes;
      }, []);

      // For compatibility with older versions of react-syntax-highlighter
      var startingClassName = properties.className && properties.className.includes('token') ? ['token'] : [];
      var className = properties.className && startingClassName.concat(properties.className.filter(function (className) {
        return !allStylesheetSelectors.includes(className);
      }));
      props = _objectSpread(_objectSpread({}, properties), {}, {
        className: createClassNameString(className) || undefined,
        style: createStyleObject(properties.className, Object.assign({}, properties.style, style), stylesheet)
      });
    }
    var children = childrenCreator(node.children);
    return /*#__PURE__*/react.createElement(TagName, (0,esm_extends/* default */.Z)({
      key: key
    }, props), children);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/react-syntax-highlighter@16.1.0_react@18.0.0/node_modules/react-syntax-highlighter/dist/esm/checkForListedLanguage.js
/* harmony default export */ var checkForListedLanguage = (function (astGenerator, language) {
  var langs = astGenerator.listLanguages();
  return langs.indexOf(language) !== -1;
});
;// CONCATENATED MODULE: ../../node_modules/.pnpm/react-syntax-highlighter@16.1.0_react@18.0.0/node_modules/react-syntax-highlighter/dist/esm/highlight.js



var _excluded = ["language", "children", "style", "customStyle", "codeTagProps", "useInlineStyles", "showLineNumbers", "showInlineLineNumbers", "startingLineNumber", "lineNumberContainerStyle", "lineNumberStyle", "wrapLines", "wrapLongLines", "lineProps", "renderer", "PreTag", "CodeTag", "code", "astGenerator"];
function highlight_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function highlight_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? highlight_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* default */.Z)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : highlight_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var newLineRegex = /\n/g;
function getNewLines(str) {
  return str.match(newLineRegex);
}
function getAllLineNumbers(_ref) {
  var lines = _ref.lines,
    startingLineNumber = _ref.startingLineNumber,
    style = _ref.style;
  return lines.map(function (_, i) {
    var number = i + startingLineNumber;
    return /*#__PURE__*/react.createElement("span", {
      key: "line-".concat(i),
      className: "react-syntax-highlighter-line-number",
      style: typeof style === 'function' ? style(number) : style
    }, "".concat(number, "\n"));
  });
}
function AllLineNumbers(_ref2) {
  var codeString = _ref2.codeString,
    codeStyle = _ref2.codeStyle,
    _ref2$containerStyle = _ref2.containerStyle,
    containerStyle = _ref2$containerStyle === void 0 ? {
      "float": 'left',
      paddingRight: '10px'
    } : _ref2$containerStyle,
    _ref2$numberStyle = _ref2.numberStyle,
    numberStyle = _ref2$numberStyle === void 0 ? {} : _ref2$numberStyle,
    startingLineNumber = _ref2.startingLineNumber;
  return /*#__PURE__*/react.createElement("code", {
    style: Object.assign({}, codeStyle, containerStyle)
  }, getAllLineNumbers({
    lines: codeString.replace(/\n$/, '').split('\n'),
    style: numberStyle,
    startingLineNumber: startingLineNumber
  }));
}
function getEmWidthOfNumber(num) {
  return "".concat(num.toString().length, ".25em");
}
function getInlineLineNumber(lineNumber, inlineLineNumberStyle) {
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      key: "line-number--".concat(lineNumber),
      className: ['comment', 'linenumber', 'react-syntax-highlighter-line-number'],
      style: inlineLineNumberStyle
    },
    children: [{
      type: 'text',
      value: lineNumber
    }]
  };
}
function assembleLineNumberStyles(lineNumberStyle, lineNumber, largestLineNumber) {
  // minimally necessary styling for line numbers
  var defaultLineNumberStyle = {
    display: 'inline-block',
    minWidth: getEmWidthOfNumber(largestLineNumber),
    paddingRight: '1em',
    textAlign: 'right',
    userSelect: 'none'
  };
  // prep custom styling
  var customLineNumberStyle = typeof lineNumberStyle === 'function' ? lineNumberStyle(lineNumber) : lineNumberStyle;
  // combine
  var assembledStyle = highlight_objectSpread(highlight_objectSpread({}, defaultLineNumberStyle), customLineNumberStyle);
  return assembledStyle;
}
function createLineElement(_ref3) {
  var children = _ref3.children,
    lineNumber = _ref3.lineNumber,
    lineNumberStyle = _ref3.lineNumberStyle,
    largestLineNumber = _ref3.largestLineNumber,
    showInlineLineNumbers = _ref3.showInlineLineNumbers,
    _ref3$lineProps = _ref3.lineProps,
    lineProps = _ref3$lineProps === void 0 ? {} : _ref3$lineProps,
    _ref3$className = _ref3.className,
    className = _ref3$className === void 0 ? [] : _ref3$className,
    showLineNumbers = _ref3.showLineNumbers,
    wrapLongLines = _ref3.wrapLongLines,
    _ref3$wrapLines = _ref3.wrapLines,
    wrapLines = _ref3$wrapLines === void 0 ? false : _ref3$wrapLines;
  var properties = wrapLines ? highlight_objectSpread({}, typeof lineProps === 'function' ? lineProps(lineNumber) : lineProps) : {};
  properties['className'] = properties['className'] ? [].concat(_toConsumableArray(properties['className'].trim().split(/\s+/)), _toConsumableArray(className)) : className;
  if (lineNumber && showInlineLineNumbers) {
    var inlineLineNumberStyle = assembleLineNumberStyles(lineNumberStyle, lineNumber, largestLineNumber);
    children.unshift(getInlineLineNumber(lineNumber, inlineLineNumberStyle));
  }
  if (wrapLongLines & showLineNumbers) {
    properties.style = highlight_objectSpread({
      display: 'flex'
    }, properties.style);
  }
  return {
    type: 'element',
    tagName: 'span',
    properties: properties,
    children: children
  };
}
function flattenCodeTree(tree) {
  var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var newTree = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  if (tree.length === undefined) {
    tree = [tree];
  }
  for (var i = 0; i < tree.length; i++) {
    var node = tree[i];
    if (node.type === 'text') {
      newTree.push(createLineElement({
        children: [node],
        className: _toConsumableArray(new Set(className))
      }));
    } else if (node.children) {
      var _node$properties;
      var classNames = className.concat(((_node$properties = node.properties) === null || _node$properties === void 0 ? void 0 : _node$properties.className) || []);
      flattenCodeTree(node.children, classNames).forEach(function (i) {
        return newTree.push(i);
      });
    }
  }
  return newTree;
}
function processLines(codeTree, wrapLines, lineProps, showLineNumbers, showInlineLineNumbers, startingLineNumber, largestLineNumber, lineNumberStyle, wrapLongLines) {
  var _ref4;
  var tree = flattenCodeTree(codeTree.value);
  var newTree = [];
  var lastLineBreakIndex = -1;
  var index = 0;
  function createWrappedLine(children, lineNumber) {
    var className = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    return createLineElement({
      children: children,
      lineNumber: lineNumber,
      lineNumberStyle: lineNumberStyle,
      largestLineNumber: largestLineNumber,
      showInlineLineNumbers: showInlineLineNumbers,
      lineProps: lineProps,
      className: className,
      showLineNumbers: showLineNumbers,
      wrapLongLines: wrapLongLines,
      wrapLines: wrapLines
    });
  }
  function createUnwrappedLine(children, lineNumber) {
    if (showLineNumbers && lineNumber && showInlineLineNumbers) {
      var inlineLineNumberStyle = assembleLineNumberStyles(lineNumberStyle, lineNumber, largestLineNumber);
      children.unshift(getInlineLineNumber(lineNumber, inlineLineNumberStyle));
    }
    return children;
  }
  function createLine(children, lineNumber) {
    var className = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    return wrapLines || className.length > 0 ? createWrappedLine(children, lineNumber, className) : createUnwrappedLine(children, lineNumber);
  }
  var _loop = function _loop() {
    var node = tree[index];
    var value = node.children[0].value;
    var newLines = getNewLines(value);
    if (newLines) {
      var splitValue = value.split('\n');
      splitValue.forEach(function (text, i) {
        var lineNumber = showLineNumbers && newTree.length + startingLineNumber;
        var newChild = {
          type: 'text',
          value: "".concat(text, "\n")
        };

        // if it's the first line
        if (i === 0) {
          var _children = tree.slice(lastLineBreakIndex + 1, index).concat(createLineElement({
            children: [newChild],
            className: node.properties.className
          }));
          var _line = createLine(_children, lineNumber);
          newTree.push(_line);

          // if it's the last line
        } else if (i === splitValue.length - 1) {
          var stringChild = tree[index + 1] && tree[index + 1].children && tree[index + 1].children[0];
          var lastLineInPreviousSpan = {
            type: 'text',
            value: "".concat(text)
          };
          if (stringChild) {
            var newElem = createLineElement({
              children: [lastLineInPreviousSpan],
              className: node.properties.className
            });
            tree.splice(index + 1, 0, newElem);
          } else {
            var _children2 = [lastLineInPreviousSpan];
            var _line2 = createLine(_children2, lineNumber, node.properties.className);
            newTree.push(_line2);
          }

          // if it's neither the first nor the last line
        } else {
          var _children3 = [newChild];
          var _line3 = createLine(_children3, lineNumber, node.properties.className);
          newTree.push(_line3);
        }
      });
      lastLineBreakIndex = index;
    }
    index++;
  };
  while (index < tree.length) {
    _loop();
  }
  if (lastLineBreakIndex !== tree.length - 1) {
    var children = tree.slice(lastLineBreakIndex + 1, tree.length);
    if (children && children.length) {
      var lineNumber = showLineNumbers && newTree.length + startingLineNumber;
      var line = createLine(children, lineNumber);
      newTree.push(line);
    }
  }
  return wrapLines ? newTree : (_ref4 = []).concat.apply(_ref4, newTree);
}
function defaultRenderer(_ref5) {
  var rows = _ref5.rows,
    stylesheet = _ref5.stylesheet,
    useInlineStyles = _ref5.useInlineStyles;
  return rows.map(function (node, i) {
    return createElement({
      node: node,
      stylesheet: stylesheet,
      useInlineStyles: useInlineStyles,
      key: "code-segment-".concat(i)
    });
  });
}

// only highlight.js has the highlightAuto method
function isHighlightJs(astGenerator) {
  return astGenerator && typeof astGenerator.highlightAuto !== 'undefined';
}
function getCodeTree(_ref6) {
  var astGenerator = _ref6.astGenerator,
    language = _ref6.language,
    code = _ref6.code,
    defaultCodeValue = _ref6.defaultCodeValue;
  // figure out whether we're using lowlight/highlight or refractor/prism
  // then attempt highlighting accordingly

  // lowlight/highlight?
  if (isHighlightJs(astGenerator)) {
    var hasLanguage = checkForListedLanguage(astGenerator, language);
    if (language === 'text') {
      return {
        value: defaultCodeValue,
        language: 'text'
      };
    } else if (hasLanguage) {
      return astGenerator.highlight(language, code);
    } else {
      return astGenerator.highlightAuto(code);
    }
  }

  // must be refractor/prism, then
  try {
    return language && language !== 'text' ? {
      value: astGenerator.highlight(code, language)
    } : {
      value: defaultCodeValue
    };
  } catch (e) {
    return {
      value: defaultCodeValue
    };
  }
}
/* harmony default export */ function highlight(defaultAstGenerator, defaultStyle) {
  return function SyntaxHighlighter(_ref7) {
    var _code$match$length, _code$match;
    var language = _ref7.language,
      children = _ref7.children,
      _ref7$style = _ref7.style,
      style = _ref7$style === void 0 ? defaultStyle : _ref7$style,
      _ref7$customStyle = _ref7.customStyle,
      customStyle = _ref7$customStyle === void 0 ? {} : _ref7$customStyle,
      _ref7$codeTagProps = _ref7.codeTagProps,
      codeTagProps = _ref7$codeTagProps === void 0 ? {
        className: language ? "language-".concat(language) : undefined,
        style: highlight_objectSpread(highlight_objectSpread({}, style['code[class*="language-"]']), style["code[class*=\"language-".concat(language, "\"]")])
      } : _ref7$codeTagProps,
      _ref7$useInlineStyles = _ref7.useInlineStyles,
      useInlineStyles = _ref7$useInlineStyles === void 0 ? true : _ref7$useInlineStyles,
      _ref7$showLineNumbers = _ref7.showLineNumbers,
      showLineNumbers = _ref7$showLineNumbers === void 0 ? false : _ref7$showLineNumbers,
      _ref7$showInlineLineN = _ref7.showInlineLineNumbers,
      showInlineLineNumbers = _ref7$showInlineLineN === void 0 ? true : _ref7$showInlineLineN,
      _ref7$startingLineNum = _ref7.startingLineNumber,
      startingLineNumber = _ref7$startingLineNum === void 0 ? 1 : _ref7$startingLineNum,
      lineNumberContainerStyle = _ref7.lineNumberContainerStyle,
      _ref7$lineNumberStyle = _ref7.lineNumberStyle,
      lineNumberStyle = _ref7$lineNumberStyle === void 0 ? {} : _ref7$lineNumberStyle,
      wrapLines = _ref7.wrapLines,
      _ref7$wrapLongLines = _ref7.wrapLongLines,
      wrapLongLines = _ref7$wrapLongLines === void 0 ? false : _ref7$wrapLongLines,
      _ref7$lineProps = _ref7.lineProps,
      lineProps = _ref7$lineProps === void 0 ? {} : _ref7$lineProps,
      renderer = _ref7.renderer,
      _ref7$PreTag = _ref7.PreTag,
      PreTag = _ref7$PreTag === void 0 ? 'pre' : _ref7$PreTag,
      _ref7$CodeTag = _ref7.CodeTag,
      CodeTag = _ref7$CodeTag === void 0 ? 'code' : _ref7$CodeTag,
      _ref7$code = _ref7.code,
      code = _ref7$code === void 0 ? (Array.isArray(children) ? children[0] : children) || '' : _ref7$code,
      astGenerator = _ref7.astGenerator,
      rest = _objectWithoutProperties(_ref7, _excluded);
    astGenerator = astGenerator || defaultAstGenerator;
    var allLineNumbers = showLineNumbers ? /*#__PURE__*/react.createElement(AllLineNumbers, {
      containerStyle: lineNumberContainerStyle,
      codeStyle: codeTagProps.style || {},
      numberStyle: lineNumberStyle,
      startingLineNumber: startingLineNumber,
      codeString: code
    }) : null;
    var defaultPreStyle = style.hljs || style['pre[class*="language-"]'] || {
      backgroundColor: '#fff'
    };
    var generatorClassName = isHighlightJs(astGenerator) ? 'hljs' : 'prismjs';
    var preProps = useInlineStyles ? Object.assign({}, rest, {
      style: Object.assign({}, defaultPreStyle, customStyle)
    }) : Object.assign({}, rest, {
      className: rest.className ? "".concat(generatorClassName, " ").concat(rest.className) : generatorClassName,
      style: Object.assign({}, customStyle)
    });
    if (wrapLongLines) {
      codeTagProps.style = highlight_objectSpread({
        whiteSpace: 'pre-wrap'
      }, codeTagProps.style);
    } else {
      codeTagProps.style = highlight_objectSpread({
        whiteSpace: 'pre'
      }, codeTagProps.style);
    }
    if (!astGenerator) {
      return /*#__PURE__*/react.createElement(PreTag, preProps, allLineNumbers, /*#__PURE__*/react.createElement(CodeTag, codeTagProps, code));
    }

    /*
     * Some custom renderers rely on individual row elements so we need to turn wrapLines on
     * if renderer is provided and wrapLines is undefined.
     */
    if (wrapLines === undefined && renderer || wrapLongLines) wrapLines = true;
    renderer = renderer || defaultRenderer;
    var defaultCodeValue = [{
      type: 'text',
      value: code
    }];
    var codeTree = getCodeTree({
      astGenerator: astGenerator,
      language: language,
      code: code,
      defaultCodeValue: defaultCodeValue
    });
    if (codeTree.language === null) {
      codeTree.value = defaultCodeValue;
    }

    // pre-determine largest line number so that we can force minWidth on all linenumber elements
    var lineBreakCount = (_code$match$length = (_code$match = code.match(/\n/g)) === null || _code$match === void 0 ? void 0 : _code$match.length) !== null && _code$match$length !== void 0 ? _code$match$length : 0;
    var largestLineNumber = startingLineNumber + lineBreakCount;
    var rows = processLines(codeTree, wrapLines, lineProps, showLineNumbers, showInlineLineNumbers, startingLineNumber, largestLineNumber, lineNumberStyle, wrapLongLines);
    return /*#__PURE__*/react.createElement(PreTag, preProps, /*#__PURE__*/react.createElement(CodeTag, codeTagProps, !showInlineLineNumbers && allLineNumbers, renderer({
      rows: rows,
      stylesheet: style,
      useInlineStyles: useInlineStyles
    })));
  };
}
// EXTERNAL MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/index.js + 11 modules
var property_information = __webpack_require__(9447);
// EXTERNAL MODULE: ../../node_modules/.pnpm/comma-separated-tokens@2.0.3/node_modules/comma-separated-tokens/index.js
var comma_separated_tokens = __webpack_require__(804);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/hast-util-parse-selector@4.0.0/node_modules/hast-util-parse-selector/lib/index.js
/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Properties} Properties
 */

/**
 * @template {string} SimpleSelector
 *   Selector type.
 * @template {string} DefaultTagName
 *   Default tag name.
 * @typedef {(
 *   SimpleSelector extends ''
 *     ? DefaultTagName
 *     : SimpleSelector extends `${infer TagName}.${infer Rest}`
 *     ? ExtractTagName<TagName, DefaultTagName>
 *     : SimpleSelector extends `${infer TagName}#${infer Rest}`
 *     ? ExtractTagName<TagName, DefaultTagName>
 *     : SimpleSelector extends string
 *     ? SimpleSelector
 *     : DefaultTagName
 * )} ExtractTagName
 *   Extract tag name from a simple selector.
 */

const search = /[#.]/g

/**
 * Create a hast element from a simple CSS selector.
 *
 * @template {string} Selector
 *   Type of selector.
 * @template {string} [DefaultTagName='div']
 *   Type of default tag name (default: `'div'`).
 * @param {Selector | null | undefined} [selector]
 *   Simple CSS selector (optional).
 *
 *   Can contain a tag name (`foo`), classes (`.bar`), and an ID (`#baz`).
 *   Multiple classes are allowed.
 *   Uses the last ID if multiple IDs are found.
 * @param {DefaultTagName | null | undefined} [defaultTagName='div']
 *   Tag name to use if `selector` does not specify one (default: `'div'`).
 * @returns {Element & {tagName: ExtractTagName<Selector, DefaultTagName>}}
 *   Built element.
 */
function parseSelector(selector, defaultTagName) {
  const value = selector || ''
  /** @type {Properties} */
  const props = {}
  let start = 0
  /** @type {string | undefined} */
  let previous
  /** @type {string | undefined} */
  let tagName

  while (start < value.length) {
    search.lastIndex = start
    const match = search.exec(value)
    const subvalue = value.slice(start, match ? match.index : value.length)

    if (subvalue) {
      if (!previous) {
        tagName = subvalue
      } else if (previous === '#') {
        props.id = subvalue
      } else if (Array.isArray(props.className)) {
        props.className.push(subvalue)
      } else {
        props.className = [subvalue]
      }

      start += subvalue.length
    }

    if (match) {
      previous = match[0]
      start++
    }
  }

  return {
    type: 'element',
    // @ts-expect-error: tag name is parsed.
    tagName: tagName || defaultTagName || 'div',
    properties: props,
    children: []
  }
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/find.js
var find = __webpack_require__(1714);
// EXTERNAL MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/normalize.js
var normalize = __webpack_require__(4317);
// EXTERNAL MODULE: ../../node_modules/.pnpm/space-separated-tokens@2.0.2/node_modules/space-separated-tokens/index.js
var space_separated_tokens = __webpack_require__(8384);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/hastscript@9.0.1/node_modules/hastscript/lib/create-h.js
/**
 * @import {Element, Nodes, RootContent, Root} from 'hast'
 * @import {Info, Schema} from 'property-information'
 */

/**
 * @typedef {Array<Nodes | PrimitiveChild>} ArrayChildNested
 *   List of children (deep).
 */

/**
 * @typedef {Array<ArrayChildNested | Nodes | PrimitiveChild>} ArrayChild
 *   List of children.
 */

/**
 * @typedef {Array<number | string>} ArrayValue
 *   List of property values for space- or comma separated values (such as `className`).
 */

/**
 * @typedef {ArrayChild | Nodes | PrimitiveChild} Child
 *   Acceptable child value.
 */

/**
 * @typedef {number | string | null | undefined} PrimitiveChild
 *   Primitive children, either ignored (nullish), or turned into text nodes.
 */

/**
 * @typedef {boolean | number | string | null | undefined} PrimitiveValue
 *   Primitive property value.
 */

/**
 * @typedef {Record<string, PropertyValue | Style>} Properties
 *   Acceptable value for element properties.
 */

/**
 * @typedef {ArrayValue | PrimitiveValue} PropertyValue
 *   Primitive value or list value.
 */

/**
 * @typedef {Element | Root} Result
 *   Result from a `h` (or `s`) call.
 */

/**
 * @typedef {number | string} StyleValue
 *   Value for a CSS style field.
 */

/**
 * @typedef {Record<string, StyleValue>} Style
 *   Supported value of a `style` prop.
 */






/**
 * @param {Schema} schema
 *   Schema to use.
 * @param {string} defaultTagName
 *   Default tag name.
 * @param {ReadonlyArray<string> | undefined} [caseSensitive]
 *   Case-sensitive tag names (default: `undefined`).
 * @returns
 *   `h`.
 */
function createH(schema, defaultTagName, caseSensitive) {
  const adjust = caseSensitive ? createAdjustMap(caseSensitive) : undefined

  /**
   * Hyperscript compatible DSL for creating virtual hast trees.
   *
   * @overload
   * @param {null | undefined} [selector]
   * @param {...Child} children
   * @returns {Root}
   *
   * @overload
   * @param {string} selector
   * @param {Properties} properties
   * @param {...Child} children
   * @returns {Element}
   *
   * @overload
   * @param {string} selector
   * @param {...Child} children
   * @returns {Element}
   *
   * @param {string | null | undefined} [selector]
   *   Selector.
   * @param {Child | Properties | null | undefined} [properties]
   *   Properties (or first child) (default: `undefined`).
   * @param {...Child} children
   *   Children.
   * @returns {Result}
   *   Result.
   */
  function h(selector, properties, ...children) {
    /** @type {Result} */
    let node

    if (selector === null || selector === undefined) {
      node = {type: 'root', children: []}
      // Properties are not supported for roots.
      const child = /** @type {Child} */ (properties)
      children.unshift(child)
    } else {
      node = parseSelector(selector, defaultTagName)
      // Normalize the name.
      const lower = node.tagName.toLowerCase()
      const adjusted = adjust ? adjust.get(lower) : undefined
      node.tagName = adjusted || lower

      // Handle properties.
      if (isChild(properties)) {
        children.unshift(properties)
      } else {
        for (const [key, value] of Object.entries(properties)) {
          addProperty(schema, node.properties, key, value)
        }
      }
    }

    // Handle children.
    for (const child of children) {
      addChild(node.children, child)
    }

    if (node.type === 'element' && node.tagName === 'template') {
      node.content = {type: 'root', children: node.children}
      node.children = []
    }

    return node
  }

  return h
}

/**
 * Check if something is properties or a child.
 *
 * @param {Child | Properties} value
 *   Value to check.
 * @returns {value is Child}
 *   Whether `value` is definitely a child.
 */
function isChild(value) {
  // Never properties if not an object.
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return true
  }

  // Never node without `type`; that’s the main discriminator.
  if (typeof value.type !== 'string') return false

  // Slower check: never property value if object or array with
  // non-number/strings.
  const record = /** @type {Record<string, unknown>} */ (value)
  const keys = Object.keys(value)

  for (const key of keys) {
    const value = record[key]

    if (value && typeof value === 'object') {
      if (!Array.isArray(value)) return true

      const list = /** @type {ReadonlyArray<unknown>} */ (value)

      for (const item of list) {
        if (typeof item !== 'number' && typeof item !== 'string') {
          return true
        }
      }
    }
  }

  // Also see empty `children` as a node.
  if ('children' in value && Array.isArray(value.children)) {
    return true
  }

  // Default to properties, someone can always pass an empty object,
  // put `data: {}` in a node,
  // or wrap it in an array.
  return false
}

/**
 * @param {Schema} schema
 *   Schema.
 * @param {Properties} properties
 *   Properties object.
 * @param {string} key
 *   Property name.
 * @param {PropertyValue | Style} value
 *   Property value.
 * @returns {undefined}
 *   Nothing.
 */
function addProperty(schema, properties, key, value) {
  const info = (0,find/* find */.s)(schema, key)
  /** @type {PropertyValue} */
  let result

  // Ignore nullish and NaN values.
  if (value === null || value === undefined) return

  if (typeof value === 'number') {
    // Ignore NaN.
    if (Number.isNaN(value)) return

    result = value
  }
  // Booleans.
  else if (typeof value === 'boolean') {
    result = value
  }
  // Handle list values.
  else if (typeof value === 'string') {
    if (info.spaceSeparated) {
      result = (0,space_separated_tokens/* parse */.Q)(value)
    } else if (info.commaSeparated) {
      result = (0,comma_separated_tokens/* parse */.Q)(value)
    } else if (info.commaOrSpaceSeparated) {
      result = (0,space_separated_tokens/* parse */.Q)((0,comma_separated_tokens/* parse */.Q)(value).join(' '))
    } else {
      result = parsePrimitive(info, info.property, value)
    }
  } else if (Array.isArray(value)) {
    result = [...value]
  } else {
    result = info.property === 'style' ? style(value) : String(value)
  }

  if (Array.isArray(result)) {
    /** @type {Array<number | string>} */
    const finalResult = []

    for (const item of result) {
      // Assume no booleans in array.
      finalResult.push(
        /** @type {number | string} */ (
          parsePrimitive(info, info.property, item)
        )
      )
    }

    result = finalResult
  }

  // Class names (which can be added both on the `selector` and here).
  if (info.property === 'className' && Array.isArray(properties.className)) {
    // Assume no booleans in `className`.
    result = properties.className.concat(
      /** @type {Array<number | string> | number | string} */ (result)
    )
  }

  properties[info.property] = result
}

/**
 * @param {Array<RootContent>} nodes
 *   Children.
 * @param {Child} value
 *   Child.
 * @returns {undefined}
 *   Nothing.
 */
function addChild(nodes, value) {
  if (value === null || value === undefined) {
    // Empty.
  } else if (typeof value === 'number' || typeof value === 'string') {
    nodes.push({type: 'text', value: String(value)})
  } else if (Array.isArray(value)) {
    for (const child of value) {
      addChild(nodes, child)
    }
  } else if (typeof value === 'object' && 'type' in value) {
    if (value.type === 'root') {
      addChild(nodes, value.children)
    } else {
      nodes.push(value)
    }
  } else {
    throw new Error('Expected node, nodes, or string, got `' + value + '`')
  }
}

/**
 * Parse a single primitives.
 *
 * @param {Info} info
 *   Property information.
 * @param {string} name
 *   Property name.
 * @param {PrimitiveValue} value
 *   Property value.
 * @returns {PrimitiveValue}
 *   Property value.
 */
function parsePrimitive(info, name, value) {
  if (typeof value === 'string') {
    if (info.number && value && !Number.isNaN(Number(value))) {
      return Number(value)
    }

    if (
      (info.boolean || info.overloadedBoolean) &&
      (value === '' || (0,normalize/* normalize */.F)(value) === (0,normalize/* normalize */.F)(name))
    ) {
      return true
    }
  }

  return value
}

/**
 * Serialize a `style` object as a string.
 *
 * @param {Style} styles
 *   Style object.
 * @returns {string}
 *   CSS string.
 */
function style(styles) {
  /** @type {Array<string>} */
  const result = []

  for (const [key, value] of Object.entries(styles)) {
    result.push([key, value].join(': '))
  }

  return result.join('; ')
}

/**
 * Create a map to adjust casing.
 *
 * @param {ReadonlyArray<string>} values
 *   List of properly cased keys.
 * @returns {Map<string, string>}
 *   Map of lowercase keys to uppercase keys.
 */
function createAdjustMap(values) {
  /** @type {Map<string, string>} */
  const result = new Map()

  for (const value of values) {
    result.set(value.toLowerCase(), value)
  }

  return result
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/hastscript@9.0.1/node_modules/hastscript/lib/svg-case-sensitive-tag-names.js
/**
 * List of case-sensitive SVG tag names.
 *
 * @type {ReadonlyArray<string>}
 */
const svgCaseSensitiveTagNames = [
  'altGlyph',
  'altGlyphDef',
  'altGlyphItem',
  'animateColor',
  'animateMotion',
  'animateTransform',
  'clipPath',
  'feBlend',
  'feColorMatrix',
  'feComponentTransfer',
  'feComposite',
  'feConvolveMatrix',
  'feDiffuseLighting',
  'feDisplacementMap',
  'feDistantLight',
  'feDropShadow',
  'feFlood',
  'feFuncA',
  'feFuncB',
  'feFuncG',
  'feFuncR',
  'feGaussianBlur',
  'feImage',
  'feMerge',
  'feMergeNode',
  'feMorphology',
  'feOffset',
  'fePointLight',
  'feSpecularLighting',
  'feSpotLight',
  'feTile',
  'feTurbulence',
  'foreignObject',
  'glyphRef',
  'linearGradient',
  'radialGradient',
  'solidColor',
  'textArea',
  'textPath'
]

;// CONCATENATED MODULE: ../../node_modules/.pnpm/hastscript@9.0.1/node_modules/hastscript/lib/index.js
// Register the JSX namespace on `h`.
/**
 * @typedef {import('./jsx-classic.js').Element} h.JSX.Element
 * @typedef {import('./jsx-classic.js').ElementChildrenAttribute} h.JSX.ElementChildrenAttribute
 * @typedef {import('./jsx-classic.js').IntrinsicAttributes} h.JSX.IntrinsicAttributes
 * @typedef {import('./jsx-classic.js').IntrinsicElements} h.JSX.IntrinsicElements
 */

// Register the JSX namespace on `s`.
/**
 * @typedef {import('./jsx-classic.js').Element} s.JSX.Element
 * @typedef {import('./jsx-classic.js').ElementChildrenAttribute} s.JSX.ElementChildrenAttribute
 * @typedef {import('./jsx-classic.js').IntrinsicAttributes} s.JSX.IntrinsicAttributes
 * @typedef {import('./jsx-classic.js').IntrinsicElements} s.JSX.IntrinsicElements
 */





// Note: this explicit type is needed, otherwise TS creates broken types.
/** @type {ReturnType<createH>} */
const h = createH(property_information/* html */.dy, 'div')

// Note: this explicit type is needed, otherwise TS creates broken types.
/** @type {ReturnType<createH>} */
const s = createH(property_information/* svg */.YP, 'g', svgCaseSensitiveTagNames)

;// CONCATENATED MODULE: ../../node_modules/.pnpm/character-entities-legacy@3.0.0/node_modules/character-entities-legacy/index.js
/**
 * List of legacy HTML named character references that don’t need a trailing semicolon.
 *
 * @type {Array<string>}
 */
const characterEntitiesLegacy = [
  'AElig',
  'AMP',
  'Aacute',
  'Acirc',
  'Agrave',
  'Aring',
  'Atilde',
  'Auml',
  'COPY',
  'Ccedil',
  'ETH',
  'Eacute',
  'Ecirc',
  'Egrave',
  'Euml',
  'GT',
  'Iacute',
  'Icirc',
  'Igrave',
  'Iuml',
  'LT',
  'Ntilde',
  'Oacute',
  'Ocirc',
  'Ograve',
  'Oslash',
  'Otilde',
  'Ouml',
  'QUOT',
  'REG',
  'THORN',
  'Uacute',
  'Ucirc',
  'Ugrave',
  'Uuml',
  'Yacute',
  'aacute',
  'acirc',
  'acute',
  'aelig',
  'agrave',
  'amp',
  'aring',
  'atilde',
  'auml',
  'brvbar',
  'ccedil',
  'cedil',
  'cent',
  'copy',
  'curren',
  'deg',
  'divide',
  'eacute',
  'ecirc',
  'egrave',
  'eth',
  'euml',
  'frac12',
  'frac14',
  'frac34',
  'gt',
  'iacute',
  'icirc',
  'iexcl',
  'igrave',
  'iquest',
  'iuml',
  'laquo',
  'lt',
  'macr',
  'micro',
  'middot',
  'nbsp',
  'not',
  'ntilde',
  'oacute',
  'ocirc',
  'ograve',
  'ordf',
  'ordm',
  'oslash',
  'otilde',
  'ouml',
  'para',
  'plusmn',
  'pound',
  'quot',
  'raquo',
  'reg',
  'sect',
  'shy',
  'sup1',
  'sup2',
  'sup3',
  'szlig',
  'thorn',
  'times',
  'uacute',
  'ucirc',
  'ugrave',
  'uml',
  'uuml',
  'yacute',
  'yen',
  'yuml'
]

;// CONCATENATED MODULE: ../../node_modules/.pnpm/character-reference-invalid@2.0.1/node_modules/character-reference-invalid/index.js
/**
 * Map of invalid numeric character references to their replacements, according to HTML.
 *
 * @type {Record<number, string>}
 */
const characterReferenceInvalid = {
  0: '�',
  128: '€',
  130: '‚',
  131: 'ƒ',
  132: '„',
  133: '…',
  134: '†',
  135: '‡',
  136: 'ˆ',
  137: '‰',
  138: 'Š',
  139: '‹',
  140: 'Œ',
  142: 'Ž',
  145: '‘',
  146: '’',
  147: '“',
  148: '”',
  149: '•',
  150: '–',
  151: '—',
  152: '˜',
  153: '™',
  154: 'š',
  155: '›',
  156: 'œ',
  158: 'ž',
  159: 'Ÿ'
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/is-decimal@2.0.1/node_modules/is-decimal/index.js
/**
 * Check if the given character code, or the character code at the first
 * character, is decimal.
 *
 * @param {string|number} character
 * @returns {boolean} Whether `character` is a decimal
 */
function isDecimal(character) {
  const code =
    typeof character === 'string' ? character.charCodeAt(0) : character

  return code >= 48 && code <= 57 /* 0-9 */
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/is-hexadecimal@2.0.1/node_modules/is-hexadecimal/index.js
/**
 * Check if the given character code, or the character code at the first
 * character, is hexadecimal.
 *
 * @param {string|number} character
 * @returns {boolean} Whether `character` is hexadecimal
 */
function isHexadecimal(character) {
  const code =
    typeof character === 'string' ? character.charCodeAt(0) : character

  return (
    (code >= 97 /* a */ && code <= 102) /* z */ ||
    (code >= 65 /* A */ && code <= 70) /* Z */ ||
    (code >= 48 /* A */ && code <= 57) /* Z */
  )
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/is-alphabetical@2.0.1/node_modules/is-alphabetical/index.js
/**
 * Check if the given character code, or the character code at the first
 * character, is alphabetical.
 *
 * @param {string|number} character
 * @returns {boolean} Whether `character` is alphabetical.
 */
function isAlphabetical(character) {
  const code =
    typeof character === 'string' ? character.charCodeAt(0) : character

  return (
    (code >= 97 && code <= 122) /* a-z */ ||
    (code >= 65 && code <= 90) /* A-Z */
  )
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/is-alphanumerical@2.0.1/node_modules/is-alphanumerical/index.js



/**
 * Check if the given character code, or the character code at the first
 * character, is alphanumerical.
 *
 * @param {string|number} character
 * @returns {boolean} Whether `character` is alphanumerical.
 */
function isAlphanumerical(character) {
  return isAlphabetical(character) || isDecimal(character)
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/decode-named-character-reference@1.3.0/node_modules/decode-named-character-reference/index.dom.js
var index_dom = __webpack_require__(8787);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/parse-entities@4.0.2/node_modules/parse-entities/lib/index.js
/**
 * @import {Point} from 'unist'
 * @import {Options} from '../index.js'
 */








// Warning messages.
const messages = [
  '',
  /* 1: Non terminated (named) */
  'Named character references must be terminated by a semicolon',
  /* 2: Non terminated (numeric) */
  'Numeric character references must be terminated by a semicolon',
  /* 3: Empty (named) */
  'Named character references cannot be empty',
  /* 4: Empty (numeric) */
  'Numeric character references cannot be empty',
  /* 5: Unknown (named) */
  'Named character references must be known',
  /* 6: Disallowed (numeric) */
  'Numeric character references cannot be disallowed',
  /* 7: Prohibited (numeric) */
  'Numeric character references cannot be outside the permissible Unicode range'
]

/**
 * Parse HTML character references.
 *
 * @param {string} value
 * @param {Readonly<Options> | null | undefined} [options]
 */
function parseEntities(value, options) {
  const settings = options || {}
  const additional =
    typeof settings.additional === 'string'
      ? settings.additional.charCodeAt(0)
      : settings.additional
  /** @type {Array<string>} */
  const result = []
  let index = 0
  let lines = -1
  let queue = ''
  /** @type {Point | undefined} */
  let point
  /** @type {Array<number>|undefined} */
  let indent

  if (settings.position) {
    if ('start' in settings.position || 'indent' in settings.position) {
      // @ts-expect-error: points don’t have indent.
      indent = settings.position.indent
      // @ts-expect-error: points don’t have indent.
      point = settings.position.start
    } else {
      point = settings.position
    }
  }

  let line = (point ? point.line : 0) || 1
  let column = (point ? point.column : 0) || 1

  // Cache the current point.
  let previous = now()
  /** @type {number|undefined} */
  let character

  // Ensure the algorithm walks over the first character (inclusive).
  index--

  while (++index <= value.length) {
    // If the previous character was a newline.
    if (character === 10 /* `\n` */) {
      column = (indent ? indent[lines] : 0) || 1
    }

    character = value.charCodeAt(index)

    if (character === 38 /* `&` */) {
      const following = value.charCodeAt(index + 1)

      // The behavior depends on the identity of the next character.
      if (
        following === 9 /* `\t` */ ||
        following === 10 /* `\n` */ ||
        following === 12 /* `\f` */ ||
        following === 32 /* ` ` */ ||
        following === 38 /* `&` */ ||
        following === 60 /* `<` */ ||
        Number.isNaN(following) ||
        (additional && following === additional)
      ) {
        // Not a character reference.
        // No characters are consumed, and nothing is returned.
        // This is not an error, either.
        queue += String.fromCharCode(character)
        column++
        continue
      }

      const start = index + 1
      let begin = start
      let end = start
      /** @type {string} */
      let type

      if (following === 35 /* `#` */) {
        // Numerical reference.
        end = ++begin

        // The behavior further depends on the next character.
        const following = value.charCodeAt(end)

        if (following === 88 /* `X` */ || following === 120 /* `x` */) {
          // ASCII hexadecimal digits.
          type = 'hexadecimal'
          end = ++begin
        } else {
          // ASCII decimal digits.
          type = 'decimal'
        }
      } else {
        // Named reference.
        type = 'named'
      }

      let characterReferenceCharacters = ''
      let characterReference = ''
      let characters = ''
      // Each type of character reference accepts different characters.
      // This test is used to detect whether a reference has ended (as the semicolon
      // is not strictly needed).
      const test =
        type === 'named'
          ? isAlphanumerical
          : type === 'decimal'
            ? isDecimal
            : isHexadecimal

      end--

      while (++end <= value.length) {
        const following = value.charCodeAt(end)

        if (!test(following)) {
          break
        }

        characters += String.fromCharCode(following)

        // Check if we can match a legacy named reference.
        // If so, we cache that as the last viable named reference.
        // This ensures we do not need to walk backwards later.
        if (type === 'named' && characterEntitiesLegacy.includes(characters)) {
          characterReferenceCharacters = characters
          // @ts-expect-error: always able to decode.
          characterReference = (0,index_dom/* decodeNamedCharacterReference */.T)(characters)
        }
      }

      let terminated = value.charCodeAt(end) === 59 /* `;` */

      if (terminated) {
        end++

        const namedReference =
          type === 'named' ? (0,index_dom/* decodeNamedCharacterReference */.T)(characters) : false

        if (namedReference) {
          characterReferenceCharacters = characters
          characterReference = namedReference
        }
      }

      let diff = 1 + end - start
      let reference = ''

      if (!terminated && settings.nonTerminated === false) {
        // Empty.
      } else if (!characters) {
        // An empty (possible) reference is valid, unless it’s numeric (thus an
        // ampersand followed by an octothorp).
        if (type !== 'named') {
          warning(4 /* Empty (numeric) */, diff)
        }
      } else if (type === 'named') {
        // An ampersand followed by anything unknown, and not terminated, is
        // invalid.
        if (terminated && !characterReference) {
          warning(5 /* Unknown (named) */, 1)
        } else {
          // If there’s something after an named reference which is not known,
          // cap the reference.
          if (characterReferenceCharacters !== characters) {
            end = begin + characterReferenceCharacters.length
            diff = 1 + end - begin
            terminated = false
          }

          // If the reference is not terminated, warn.
          if (!terminated) {
            const reason = characterReferenceCharacters
              ? 1 /* Non terminated (named) */
              : 3 /* Empty (named) */

            if (settings.attribute) {
              const following = value.charCodeAt(end)

              if (following === 61 /* `=` */) {
                warning(reason, diff)
                characterReference = ''
              } else if (isAlphanumerical(following)) {
                characterReference = ''
              } else {
                warning(reason, diff)
              }
            } else {
              warning(reason, diff)
            }
          }
        }

        reference = characterReference
      } else {
        if (!terminated) {
          // All nonterminated numeric references are not rendered, and emit a
          // warning.
          warning(2 /* Non terminated (numeric) */, diff)
        }

        // When terminated and numerical, parse as either hexadecimal or
        // decimal.
        let referenceCode = Number.parseInt(
          characters,
          type === 'hexadecimal' ? 16 : 10
        )

        // Emit a warning when the parsed number is prohibited, and replace with
        // replacement character.
        if (prohibited(referenceCode)) {
          warning(7 /* Prohibited (numeric) */, diff)
          reference = String.fromCharCode(65533 /* `�` */)
        } else if (referenceCode in characterReferenceInvalid) {
          // Emit a warning when the parsed number is disallowed, and replace by
          // an alternative.
          warning(6 /* Disallowed (numeric) */, diff)
          reference = characterReferenceInvalid[referenceCode]
        } else {
          // Parse the number.
          let output = ''

          // Emit a warning when the parsed number should not be used.
          if (disallowed(referenceCode)) {
            warning(6 /* Disallowed (numeric) */, diff)
          }

          // Serialize the number.
          if (referenceCode > 0xffff) {
            referenceCode -= 0x10000
            output += String.fromCharCode(
              (referenceCode >>> (10 & 0x3ff)) | 0xd800
            )
            referenceCode = 0xdc00 | (referenceCode & 0x3ff)
          }

          reference = output + String.fromCharCode(referenceCode)
        }
      }

      // Found it!
      // First eat the queued characters as normal text, then eat a reference.
      if (reference) {
        flush()

        previous = now()
        index = end - 1
        column += end - start + 1
        result.push(reference)
        const next = now()
        next.offset++

        if (settings.reference) {
          settings.reference.call(
            settings.referenceContext || undefined,
            reference,
            {start: previous, end: next},
            value.slice(start - 1, end)
          )
        }

        previous = next
      } else {
        // If we could not find a reference, queue the checked characters (as
        // normal characters), and move the pointer to their end.
        // This is possible because we can be certain neither newlines nor
        // ampersands are included.
        characters = value.slice(start - 1, end)
        queue += characters
        column += characters.length
        index = end - 1
      }
    } else {
      // Handle anything other than an ampersand, including newlines and EOF.
      if (character === 10 /* `\n` */) {
        line++
        lines++
        column = 0
      }

      if (Number.isNaN(character)) {
        flush()
      } else {
        queue += String.fromCharCode(character)
        column++
      }
    }
  }

  // Return the reduced nodes.
  return result.join('')

  // Get current position.
  function now() {
    return {
      line,
      column,
      offset: index + ((point ? point.offset : 0) || 0)
    }
  }

  /**
   * Handle the warning.
   *
   * @param {1|2|3|4|5|6|7} code
   * @param {number} offset
   */
  function warning(code, offset) {
    /** @type {ReturnType<now>} */
    let position

    if (settings.warning) {
      position = now()
      position.column += offset
      position.offset += offset

      settings.warning.call(
        settings.warningContext || undefined,
        messages[code],
        position,
        code
      )
    }
  }

  /**
   * Flush `queue` (normal text).
   * Macro invoked before each reference and at the end of `value`.
   * Does nothing when `queue` is empty.
   */
  function flush() {
    if (queue) {
      result.push(queue)

      if (settings.text) {
        settings.text.call(settings.textContext || undefined, queue, {
          start: previous,
          end: now()
        })
      }

      queue = ''
    }
  }
}

/**
 * Check if `character` is outside the permissible unicode range.
 *
 * @param {number} code
 * @returns {boolean}
 */
function prohibited(code) {
  return (code >= 0xd800 && code <= 0xdfff) || code > 0x10ffff
}

/**
 * Check if `character` is disallowed.
 *
 * @param {number} code
 * @returns {boolean}
 */
function disallowed(code) {
  return (
    (code >= 0x0001 && code <= 0x0008) ||
    code === 0x000b ||
    (code >= 0x000d && code <= 0x001f) ||
    (code >= 0x007f && code <= 0x009f) ||
    (code >= 0xfdd0 && code <= 0xfdef) ||
    (code & 0xffff) === 0xffff ||
    (code & 0xffff) === 0xfffe
  )
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/refractor@5.0.0/node_modules/refractor/lib/prism-core.js
// @ts-nocheck

// This is a slimmed down version of `prism-core.js`, to remove globals,
// document, workers, `util.encode`, `Token.stringify`

// Private helper vars
var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i
var uniqueId = 0

// The grammar object for plaintext
var plainTextGrammar = {}

var _ = {
  /**
   * A namespace for utility methods.
   *
   * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
   * change or disappear at any time.
   *
   * @namespace
   * @memberof Prism
   */
  util: {
    /**
     * Returns the name of the type of the given value.
     *
     * @param {any} o
     * @returns {string}
     * @example
     * type(null)      === 'Null'
     * type(undefined) === 'Undefined'
     * type(123)       === 'Number'
     * type('foo')     === 'String'
     * type(true)      === 'Boolean'
     * type([1, 2])    === 'Array'
     * type({})        === 'Object'
     * type(String)    === 'Function'
     * type(/abc+/)    === 'RegExp'
     */
    type: function (o) {
      return Object.prototype.toString.call(o).slice(8, -1)
    },

    /**
     * Returns a unique number for the given object. Later calls will still return the same number.
     *
     * @param {Object} obj
     * @returns {number}
     */
    objId: function (obj) {
      if (!obj['__id']) {
        Object.defineProperty(obj, '__id', {value: ++uniqueId})
      }
      return obj['__id']
    },

    /**
     * Creates a deep clone of the given object.
     *
     * The main intended use of this function is to clone language definitions.
     *
     * @param {T} o
     * @param {Record<number, any>} [visited]
     * @returns {T}
     * @template T
     */
    clone: function deepClone(o, visited) {
      visited = visited || {}

      var clone
      var id
      switch (_.util.type(o)) {
        case 'Object':
          id = _.util.objId(o)
          if (visited[id]) {
            return visited[id]
          }
          clone = /** @type {Record<string, any>} */ ({})
          visited[id] = clone

          for (var key in o) {
            if (o.hasOwnProperty(key)) {
              clone[key] = deepClone(o[key], visited)
            }
          }

          return /** @type {any} */ (clone)

        case 'Array':
          id = _.util.objId(o)
          if (visited[id]) {
            return visited[id]
          }
          clone = []
          visited[id] = clone

          ;/** @type {Array} */ (/** @type {any} */ (o)).forEach(
            function (v, i) {
              clone[i] = deepClone(v, visited)
            }
          )

          return /** @type {any} */ (clone)

        default:
          return o
      }
    }
  },

  /**
   * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
   *
   * @namespace
   * @memberof Prism
   * @public
   */
  languages: {
    /**
     * The grammar for plain, unformatted text.
     */
    plain: plainTextGrammar,
    plaintext: plainTextGrammar,
    text: plainTextGrammar,
    txt: plainTextGrammar,

    /**
     * Creates a deep copy of the language with the given id and appends the given tokens.
     *
     * If a token in `redef` also appears in the copied language, then the existing token in the copied language
     * will be overwritten at its original position.
     *
     * ## Best practices
     *
     * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
     * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
     * understand the language definition because, normally, the order of tokens matters in Prism grammars.
     *
     * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
     * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
     *
     * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
     * @param {Grammar} redef The new tokens to append.
     * @returns {Grammar} The new language created.
     * @public
     * @example
     * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
     *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
     *     // at its original position
     *     'comment': { ... },
     *     // CSS doesn't have a 'color' token, so this token will be appended
     *     'color': /\b(?:red|green|blue)\b/
     * });
     */
    extend: function (id, redef) {
      var lang = _.util.clone(_.languages[id])

      for (var key in redef) {
        lang[key] = redef[key]
      }

      return lang
    },

    /**
     * Inserts tokens _before_ another token in a language definition or any other grammar.
     *
     * ## Usage
     *
     * This helper method makes it easy to modify existing languages. For example, the CSS language definition
     * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
     * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
     * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
     * this:
     *
     * ```js
     * Prism.languages.markup.style = {
     *     // token
     * };
     * ```
     *
     * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
     * before existing tokens. For the CSS example above, you would use it like this:
     *
     * ```js
     * Prism.languages.insertBefore('markup', 'cdata', {
     *     'style': {
     *         // token
     *     }
     * });
     * ```
     *
     * ## Special cases
     *
     * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
     * will be ignored.
     *
     * This behavior can be used to insert tokens after `before`:
     *
     * ```js
     * Prism.languages.insertBefore('markup', 'comment', {
     *     'comment': Prism.languages.markup.comment,
     *     // tokens after 'comment'
     * });
     * ```
     *
     * ## Limitations
     *
     * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
     * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
     * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
     * deleting properties which is necessary to insert at arbitrary positions.
     *
     * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
     * Instead, it will create a new object and replace all references to the target object with the new one. This
     * can be done without temporarily deleting properties, so the iteration order is well-defined.
     *
     * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
     * you hold the target object in a variable, then the value of the variable will not change.
     *
     * ```js
     * var oldMarkup = Prism.languages.markup;
     * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
     *
     * assert(oldMarkup !== Prism.languages.markup);
     * assert(newMarkup === Prism.languages.markup);
     * ```
     *
     * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
     * object to be modified.
     * @param {string} before The key to insert before.
     * @param {Grammar} insert An object containing the key-value pairs to be inserted.
     * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
     * object to be modified.
     *
     * Defaults to `Prism.languages`.
     * @returns {Grammar} The new grammar object.
     * @public
     */
    insertBefore: function (inside, before, insert, root) {
      root = root || /** @type {any} */ (_.languages)
      var grammar = root[inside]
      /** @type {Grammar} */
      var ret = {}

      for (var token in grammar) {
        if (grammar.hasOwnProperty(token)) {
          if (token == before) {
            for (var newToken in insert) {
              if (insert.hasOwnProperty(newToken)) {
                ret[newToken] = insert[newToken]
              }
            }
          }

          // Do not insert token which also occur in insert. See #1525
          if (!insert.hasOwnProperty(token)) {
            ret[token] = grammar[token]
          }
        }
      }

      var old = root[inside]
      root[inside] = ret

      // Update references in other language definitions
      _.languages.DFS(_.languages, function (key, value) {
        if (value === old && key != inside) {
          this[key] = ret
        }
      })

      return ret
    },

    // Traverse a language definition with Depth First Search
    DFS: function DFS(o, callback, type, visited) {
      visited = visited || {}

      var objId = _.util.objId

      for (var i in o) {
        if (o.hasOwnProperty(i)) {
          callback.call(o, i, o[i], type || i)

          var property = o[i]
          var propertyType = _.util.type(property)

          if (propertyType === 'Object' && !visited[objId(property)]) {
            visited[objId(property)] = true
            DFS(property, callback, null, visited)
          } else if (propertyType === 'Array' && !visited[objId(property)]) {
            visited[objId(property)] = true
            DFS(property, callback, i, visited)
          }
        }
      }
    }
  },

  plugins: {},

  /**
   * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
   * and the language definitions to use, and returns a string with the HTML produced.
   *
   * The following hooks will be run:
   * 1. `before-tokenize`
   * 2. `after-tokenize`
   * 3. `wrap`: On each {@link Token}.
   *
   * @param {string} text A string with the code to be highlighted.
   * @param {Grammar} grammar An object containing the tokens to use.
   *
   * Usually a language definition like `Prism.languages.markup`.
   * @param {string} language The name of the language definition passed to `grammar`.
   * @returns {string} The highlighted HTML.
   * @memberof Prism
   * @public
   * @example
   * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
   */
  highlight: function (text, grammar, language) {
    var env = {
      code: text,
      grammar: grammar,
      language: language
    }
    _.hooks.run('before-tokenize', env)
    if (!env.grammar) {
      throw new Error('The language "' + env.language + '" has no grammar.')
    }
    env.tokens = _.tokenize(env.code, env.grammar)
    _.hooks.run('after-tokenize', env)
    return Token.stringify(_.util.encode(env.tokens), env.language)
  },

  /**
   * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
   * and the language definitions to use, and returns an array with the tokenized code.
   *
   * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
   *
   * This method could be useful in other contexts as well, as a very crude parser.
   *
   * @param {string} text A string with the code to be highlighted.
   * @param {Grammar} grammar An object containing the tokens to use.
   *
   * Usually a language definition like `Prism.languages.markup`.
   * @returns {TokenStream} An array of strings and tokens, a token stream.
   * @memberof Prism
   * @public
   * @example
   * let code = `var foo = 0;`;
   * let tokens = Prism.tokenize(code, Prism.languages.javascript);
   * tokens.forEach(token => {
   *     if (token instanceof Prism.Token && token.type === 'number') {
   *         console.log(`Found numeric literal: ${token.content}`);
   *     }
   * });
   */
  tokenize: function (text, grammar) {
    var rest = grammar.rest
    if (rest) {
      for (var token in rest) {
        grammar[token] = rest[token]
      }

      delete grammar.rest
    }

    var tokenList = new LinkedList()
    addAfter(tokenList, tokenList.head, text)

    matchGrammar(text, tokenList, grammar, tokenList.head, 0)

    return toArray(tokenList)
  },

  /**
   * @namespace
   * @memberof Prism
   * @public
   */
  hooks: {
    all: {},

    /**
     * Adds the given callback to the list of callbacks for the given hook.
     *
     * The callback will be invoked when the hook it is registered for is run.
     * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
     *
     * One callback function can be registered to multiple hooks and the same hook multiple times.
     *
     * @param {string} name The name of the hook.
     * @param {HookCallback} callback The callback function which is given environment variables.
     * @public
     */
    add: function (name, callback) {
      var hooks = _.hooks.all

      hooks[name] = hooks[name] || []

      hooks[name].push(callback)
    },

    /**
     * Runs a hook invoking all registered callbacks with the given environment variables.
     *
     * Callbacks will be invoked synchronously and in the order in which they were registered.
     *
     * @param {string} name The name of the hook.
     * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
     * @public
     */
    run: function (name, env) {
      var callbacks = _.hooks.all[name]

      if (!callbacks || !callbacks.length) {
        return
      }

      for (var i = 0, callback; (callback = callbacks[i++]); ) {
        callback(env)
      }
    }
  },

  Token: Token
}

// Typescript note:
// The following can be used to import the Token type in JSDoc:
//
//   @typedef {InstanceType<import("./prism-core")["Token"]>} Token

/**
 * Creates a new token.
 *
 * @param {string} type See {@link Token#type type}
 * @param {string | TokenStream} content See {@link Token#content content}
 * @param {string|string[]} [alias] The alias(es) of the token.
 * @param {string} [matchedStr=""] A copy of the full string this token was created from.
 * @class
 * @global
 * @public
 */
function Token(type, content, alias, matchedStr) {
  /**
   * The type of the token.
   *
   * This is usually the key of a pattern in a {@link Grammar}.
   *
   * @type {string}
   * @see GrammarToken
   * @public
   */
  this.type = type
  /**
   * The strings or tokens contained by this token.
   *
   * This will be a token stream if the pattern matched also defined an `inside` grammar.
   *
   * @type {string | TokenStream}
   * @public
   */
  this.content = content
  /**
   * The alias(es) of the token.
   *
   * @type {string|string[]}
   * @see GrammarToken
   * @public
   */
  this.alias = alias
  // Copy of the full string this token was created from
  this.length = (matchedStr || '').length | 0
}

/**
 * A token stream is an array of strings and {@link Token Token} objects.
 *
 * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
 * them.
 *
 * 1. No adjacent strings.
 * 2. No empty strings.
 *
 *    The only exception here is the token stream that only contains the empty string and nothing else.
 *
 * @typedef {Array<string | Token>} TokenStream
 * @global
 * @public
 */

/**
 * @param {RegExp} pattern
 * @param {number} pos
 * @param {string} text
 * @param {boolean} lookbehind
 * @returns {RegExpExecArray | null}
 */
function matchPattern(pattern, pos, text, lookbehind) {
  pattern.lastIndex = pos
  var match = pattern.exec(text)
  if (match && lookbehind && match[1]) {
    // change the match to remove the text matched by the Prism lookbehind group
    var lookbehindLength = match[1].length
    match.index += lookbehindLength
    match[0] = match[0].slice(lookbehindLength)
  }
  return match
}

/**
 * @param {string} text
 * @param {LinkedList<string | Token>} tokenList
 * @param {any} grammar
 * @param {LinkedListNode<string | Token>} startNode
 * @param {number} startPos
 * @param {RematchOptions} [rematch]
 * @returns {void}
 * @private
 *
 * @typedef RematchOptions
 * @property {string} cause
 * @property {number} reach
 */
function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
  for (var token in grammar) {
    if (!grammar.hasOwnProperty(token) || !grammar[token]) {
      continue
    }

    var patterns = grammar[token]
    patterns = Array.isArray(patterns) ? patterns : [patterns]

    for (var j = 0; j < patterns.length; ++j) {
      if (rematch && rematch.cause == token + ',' + j) {
        return
      }

      var patternObj = patterns[j]
      var inside = patternObj.inside
      var lookbehind = !!patternObj.lookbehind
      var greedy = !!patternObj.greedy
      var alias = patternObj.alias

      if (greedy && !patternObj.pattern.global) {
        // Without the global flag, lastIndex won't work
        var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0]
        patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g')
      }

      /** @type {RegExp} */
      var pattern = patternObj.pattern || patternObj

      for (
        // iterate the token list and keep track of the current token/string position
        var currentNode = startNode.next, pos = startPos;
        currentNode !== tokenList.tail;
        pos += currentNode.value.length, currentNode = currentNode.next
      ) {
        if (rematch && pos >= rematch.reach) {
          break
        }

        var str = currentNode.value

        if (tokenList.length > text.length) {
          // Something went terribly wrong, ABORT, ABORT!
          return
        }

        if (str instanceof Token) {
          continue
        }

        var removeCount = 1 // this is the to parameter of removeBetween
        var match

        if (greedy) {
          match = matchPattern(pattern, pos, text, lookbehind)
          if (!match || match.index >= text.length) {
            break
          }

          var from = match.index
          var to = match.index + match[0].length
          var p = pos

          // find the node that contains the match
          p += currentNode.value.length
          while (from >= p) {
            currentNode = currentNode.next
            p += currentNode.value.length
          }
          // adjust pos (and p)
          p -= currentNode.value.length
          pos = p

          // the current node is a Token, then the match starts inside another Token, which is invalid
          if (currentNode.value instanceof Token) {
            continue
          }

          // find the last node which is affected by this match
          for (
            var k = currentNode;
            k !== tokenList.tail && (p < to || typeof k.value === 'string');
            k = k.next
          ) {
            removeCount++
            p += k.value.length
          }
          removeCount--

          // replace with the new match
          str = text.slice(pos, p)
          match.index -= pos
        } else {
          match = matchPattern(pattern, 0, str, lookbehind)
          if (!match) {
            continue
          }
        }

        // eslint-disable-next-line no-redeclare
        var from = match.index
        var matchStr = match[0]
        var before = str.slice(0, from)
        var after = str.slice(from + matchStr.length)

        var reach = pos + str.length
        if (rematch && reach > rematch.reach) {
          rematch.reach = reach
        }

        var removeFrom = currentNode.prev

        if (before) {
          removeFrom = addAfter(tokenList, removeFrom, before)
          pos += before.length
        }

        removeRange(tokenList, removeFrom, removeCount)

        var wrapped = new Token(
          token,
          inside ? _.tokenize(matchStr, inside) : matchStr,
          alias,
          matchStr
        )
        currentNode = addAfter(tokenList, removeFrom, wrapped)

        if (after) {
          addAfter(tokenList, currentNode, after)
        }

        if (removeCount > 1) {
          // at least one Token object was removed, so we have to do some rematching
          // this can only happen if the current pattern is greedy

          /** @type {RematchOptions} */
          var nestedRematch = {
            cause: token + ',' + j,
            reach: reach
          }
          matchGrammar(
            text,
            tokenList,
            grammar,
            currentNode.prev,
            pos,
            nestedRematch
          )

          // the reach might have been extended because of the rematching
          if (rematch && nestedRematch.reach > rematch.reach) {
            rematch.reach = nestedRematch.reach
          }
        }
      }
    }
  }
}

/**
 * @typedef LinkedListNode
 * @property {T} value
 * @property {LinkedListNode<T> | null} prev The previous node.
 * @property {LinkedListNode<T> | null} next The next node.
 * @template T
 * @private
 */

/**
 * @template T
 * @private
 */
function LinkedList() {
  /** @type {LinkedListNode<T>} */
  var head = {value: null, prev: null, next: null}
  /** @type {LinkedListNode<T>} */
  var tail = {value: null, prev: head, next: null}
  head.next = tail

  /** @type {LinkedListNode<T>} */
  this.head = head
  /** @type {LinkedListNode<T>} */
  this.tail = tail
  this.length = 0
}

/**
 * Adds a new node with the given value to the list.
 *
 * @param {LinkedList<T>} list
 * @param {LinkedListNode<T>} node
 * @param {T} value
 * @returns {LinkedListNode<T>} The added node.
 * @template T
 */
function addAfter(list, node, value) {
  // assumes that node != list.tail && values.length >= 0
  var next = node.next

  var newNode = {value: value, prev: node, next: next}
  node.next = newNode
  next.prev = newNode
  list.length++

  return newNode
}
/**
 * Removes `count` nodes after the given node. The given node will not be removed.
 *
 * @param {LinkedList<T>} list
 * @param {LinkedListNode<T>} node
 * @param {number} count
 * @template T
 */
function removeRange(list, node, count) {
  var next = node.next
  for (var i = 0; i < count && next !== list.tail; i++) {
    next = next.next
  }
  node.next = next
  next.prev = node
  list.length -= i
}
/**
 * @param {LinkedList<T>} list
 * @returns {T[]}
 * @template T
 */
function toArray(list) {
  var array = []
  var node = list.head.next
  while (node !== list.tail) {
    array.push(node.value)
    node = node.next
  }
  return array
}

const Prism = _

;// CONCATENATED MODULE: ../../node_modules/.pnpm/refractor@5.0.0/node_modules/refractor/lib/core.js
/**
 * @import {Element, Root, Text} from 'hast'
 * @import {Grammar, Languages} from 'prismjs'
 */

/**
 * @typedef _Token
 *   Hidden Prism token.
 * @property {string} alias
 *   Alias.
 * @property {string} content
 *   Content.
 * @property {number} length
 *   Length.
 * @property {string} type
 *   Type.
 */

/**
 * @typedef _Env
 *   Hidden Prism environment.
 * @property {Record<string, string>} attributes
 *   Attributes.
 * @property {Array<string>} classes
 *   Classes.
 * @property {Array<Element | Text> | Element | Text} content
 *   Content.
 * @property {string} language
 *   Language.
 * @property {string} tag
 *   Tag.
 * @property {string} type
 *   Type.
 */

/**
 * @typedef {((prism: Refractor) => undefined | void) & {aliases?: Array<string> | undefined, displayName: string}} Syntax
 *   Refractor syntax function.
 */

/**
 * @typedef Refractor
 *   Virtual syntax highlighting
 * @property {typeof alias} alias
 * @property {Languages} languages
 * @property {typeof listLanguages} listLanguages
 * @property {typeof highlight} highlight
 * @property {typeof registered} registered
 * @property {typeof register} register
 */

// Load all stuff in `prism.js` itself, except for `prism-file-highlight.js`.
// The wrapped non-leaky grammars are loaded instead of Prism’s originals.




// Inherit.
function Refractor() {}

Refractor.prototype = Prism

/** @type {Refractor} */
// @ts-expect-error: TS is wrong.
const refractor = new Refractor()

// Create.
refractor.highlight = core_highlight
refractor.register = register
refractor.alias = alias
refractor.registered = registered
refractor.listLanguages = listLanguages

// @ts-expect-error Overwrite Prism.
refractor.util.encode = encode
// @ts-expect-error Overwrite Prism.
refractor.Token.stringify = stringify

/**
 * Highlight `value` (code) as `language` (programming language).
 *
 * @param {string} value
 *   Code to highlight.
 * @param {Grammar | string} language
 *   Programming language name, alias, or grammar.
 * @returns {Root}
 *   Node representing highlighted code.
 */
function core_highlight(value, language) {
  if (typeof value !== 'string') {
    throw new TypeError('Expected `string` for `value`, got `' + value + '`')
  }

  /** @type {Grammar} */
  let grammar
  /** @type {string | undefined} */
  let name

  // `name` is a grammar object.
  // This was called internally by Prism.js before 1.28.0.
  /* c8 ignore next 2 */
  if (language && typeof language === 'object') {
    grammar = language
  } else {
    name = language

    if (typeof name !== 'string') {
      throw new TypeError('Expected `string` for `name`, got `' + name + '`')
    }

    if (Object.hasOwn(refractor.languages, name)) {
      grammar = refractor.languages[name]
    } else {
      throw new Error('Unknown language: `' + name + '` is not registered')
    }
  }

  return {
    type: 'root',
    // @ts-expect-error: we hacked Prism to accept and return the things we want.
    children: Prism.highlight.call(refractor, value, grammar, name)
  }
}

/**
 * Register a syntax.
 *
 * @param {Syntax} syntax
 *   Language function made for refractor, as in, the files in
 *   `refractor/lang/*.js`.
 * @returns {undefined}
 *   Nothing.
 */
function register(syntax) {
  if (typeof syntax !== 'function' || !syntax.displayName) {
    throw new Error('Expected `function` for `syntax`, got `' + syntax + '`')
  }

  // Do not duplicate registrations.
  if (!Object.hasOwn(refractor.languages, syntax.displayName)) {
    syntax(refractor)
  }
}

/**
 * Register aliases for already registered languages.
 *
 * @param {Record<string, ReadonlyArray<string> | string> | string} language
 *   Language to alias.
 * @param {ReadonlyArray<string> | string | null | undefined} [alias]
 *   Aliases.
 * @returns {undefined}
 *   Nothing.
 */
function alias(language, alias) {
  const languages = refractor.languages
  /** @type {Record<string, ReadonlyArray<string> | string>} */
  let map = {}

  if (typeof language === 'string') {
    if (alias) {
      map[language] = alias
    }
  } else {
    map = language
  }

  /** @type {string} */
  let key

  for (key in map) {
    if (Object.hasOwn(map, key)) {
      const value = map[key]
      const list = typeof value === 'string' ? [value] : value
      let index = -1

      while (++index < list.length) {
        languages[list[index]] = languages[key]
      }
    }
  }
}

/**
 * Check whether an `alias` or `language` is registered.
 *
 * @param {string} aliasOrLanguage
 *   Language or alias to check.
 * @returns {boolean}
 *   Whether the language is registered.
 */
function registered(aliasOrLanguage) {
  if (typeof aliasOrLanguage !== 'string') {
    throw new TypeError(
      'Expected `string` for `aliasOrLanguage`, got `' + aliasOrLanguage + '`'
    )
  }

  return Object.hasOwn(refractor.languages, aliasOrLanguage)
}

/**
 * List all registered languages (names and aliases).
 *
 * @returns {Array<string>}
 *   List of language names.
 */
function listLanguages() {
  const languages = refractor.languages
  /** @type {Array<string>} */
  const list = []
  /** @type {string} */
  let language

  for (language in languages) {
    if (
      Object.hasOwn(languages, language) &&
      typeof languages[language] === 'object'
    ) {
      list.push(language)
    }
  }

  return list
}

/**
 * @param {Array<_Token | string> | _Token | string} value
 *   Token to stringify.
 * @param {string} language
 *   Language of the token.
 * @returns {Array<Element | Text> | Element | Text}
 *   Node representing the token.
 */
function stringify(value, language) {
  if (typeof value === 'string') {
    return {type: 'text', value}
  }

  if (Array.isArray(value)) {
    /** @type {Array<Element | Text>} */
    const result = []
    let index = -1

    while (++index < value.length) {
      if (
        value[index] !== null &&
        value[index] !== undefined &&
        value[index] !== ''
      ) {
        // Cast because we assume no sub-arrays.
        result.push(
          /** @type {Element | Text} */ (stringify(value[index], language))
        )
      }
    }

    return result
  }

  /** @type {_Env} */
  const env = {
    attributes: {},
    classes: ['token', value.type],
    content: stringify(value.content, language),
    language,
    tag: 'span',
    type: value.type
  }

  if (value.alias) {
    env.classes.push(
      ...(typeof value.alias === 'string' ? [value.alias] : value.alias)
    )
  }

  // @ts-expect-error Prism.
  refractor.hooks.run('wrap', env)

  return h(
    env.tag + '.' + env.classes.join('.'),
    attributes(env.attributes),
    env.content
  )
}

/**
 * @template {unknown} T
 *   Tokens.
 * @param {T} tokens
 *   Input.
 * @returns {T}
 *   Output, same as input.
 */
function encode(tokens) {
  return tokens
}

/**
 * @param {Record<string, string>} record
 *   Attributes.
 * @returns {Record<string, string>}
 *   Attributes.
 */
function attributes(record) {
  /** @type {string} */
  let key

  for (key in record) {
    if (Object.hasOwn(record, key)) {
      record[key] = parseEntities(record[key])
    }
  }

  return record
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/react-syntax-highlighter@16.1.0_react@18.0.0/node_modules/react-syntax-highlighter/dist/esm/prism-light.js


var SyntaxHighlighter = highlight(refractor, {});
SyntaxHighlighter.registerLanguage = function (_, language) {
  return refractor.register(language);
};
SyntaxHighlighter.alias = function (name, aliases) {
  return refractor.alias(name, aliases);
};
/* harmony default export */ var prism_light = (SyntaxHighlighter);

/***/ }),

/***/ 6801:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var style_to_object_1 = __importDefault(__webpack_require__(4963));
var utilities_1 = __webpack_require__(6635);
/**
 * Parses CSS inline style to JavaScript object (camelCased).
 */
function StyleToJS(style, options) {
    var output = {};
    if (!style || typeof style !== 'string') {
        return output;
    }
    (0, style_to_object_1.default)(style, function (property, value) {
        // skip CSS comment
        if (property && value) {
            output[(0, utilities_1.camelCase)(property, options)] = value;
        }
    });
    return output;
}
StyleToJS.default = StyleToJS;
module.exports = StyleToJS;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6635:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.camelCase = void 0;
var CUSTOM_PROPERTY_REGEX = /^--[a-zA-Z0-9_-]+$/;
var HYPHEN_REGEX = /-([a-z])/g;
var NO_HYPHEN_REGEX = /^[^-]+$/;
var VENDOR_PREFIX_REGEX = /^-(webkit|moz|ms|o|khtml)-/;
var MS_VENDOR_PREFIX_REGEX = /^-(ms)-/;
/**
 * Checks whether to skip camelCase.
 */
var skipCamelCase = function (property) {
    return !property ||
        NO_HYPHEN_REGEX.test(property) ||
        CUSTOM_PROPERTY_REGEX.test(property);
};
/**
 * Replacer that capitalizes first character.
 */
var capitalize = function (match, character) {
    return character.toUpperCase();
};
/**
 * Replacer that removes beginning hyphen of vendor prefix property.
 */
var trimHyphen = function (match, prefix) { return "".concat(prefix, "-"); };
/**
 * CamelCases a CSS property.
 */
var camelCase = function (property, options) {
    if (options === void 0) { options = {}; }
    if (skipCamelCase(property)) {
        return property;
    }
    property = property.toLowerCase();
    if (options.reactCompat) {
        // `-ms` vendor prefix should not be capitalized
        property = property.replace(MS_VENDOR_PREFIX_REGEX, trimHyphen);
    }
    else {
        // for non-React, remove first hyphen so vendor prefix is not capitalized
        property = property.replace(VENDOR_PREFIX_REGEX, trimHyphen);
    }
    return property.replace(HYPHEN_REGEX, capitalize);
};
exports.camelCase = camelCase;
//# sourceMappingURL=utilities.js.map

/***/ }),

/***/ 4963:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = StyleToObject;
const inline_style_parser_1 = __importDefault(__webpack_require__(6021));
/**
 * Parses inline style to object.
 *
 * @param style - Inline style.
 * @param iterator - Iterator.
 * @returns - Style object or null.
 *
 * @example Parsing inline style to object:
 *
 * ```js
 * import parse from 'style-to-object';
 * parse('line-height: 42;'); // { 'line-height': '42' }
 * ```
 */
function StyleToObject(style, iterator) {
    let styleObject = null;
    if (!style || typeof style !== 'string') {
        return styleObject;
    }
    const declarations = (0, inline_style_parser_1.default)(style);
    const hasIterator = typeof iterator === 'function';
    declarations.forEach((declaration) => {
        if (declaration.type !== 'declaration') {
            return;
        }
        const { property, value } = declaration;
        if (hasIterator) {
            iterator(property, value, declaration);
        }
        else if (value) {
            styleObject = styleObject || {};
            styleObject[property] = value;
        }
    });
    return styleObject;
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9259:
/***/ (function(module) {

function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    "default": e
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 9009:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": function() { return /* binding */ _defineProperty; }
});

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.28.6/node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.28.6/node_modules/@babel/runtime/helpers/esm/toPrimitive.js

function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.28.6/node_modules/@babel/runtime/helpers/esm/toPropertyKey.js


function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.28.6/node_modules/@babel/runtime/helpers/esm/defineProperty.js

function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}


/***/ }),

/***/ 8404:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _extends; }
/* harmony export */ });
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}


/***/ }),

/***/ 4846:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _objectWithoutPropertiesLoose; }
/* harmony export */ });
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}


/***/ }),

/***/ 804:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "P": function() { return /* binding */ stringify; },
/* harmony export */   "Q": function() { return /* binding */ parse; }
/* harmony export */ });
/**
 * @typedef Options
 *   Configuration for `stringify`.
 * @property {boolean} [padLeft=true]
 *   Whether to pad a space before a token.
 * @property {boolean} [padRight=false]
 *   Whether to pad a space after a token.
 */

/**
 * @typedef {Options} StringifyOptions
 *   Please use `StringifyOptions` instead.
 */

/**
 * Parse comma-separated tokens to an array.
 *
 * @param {string} value
 *   Comma-separated tokens.
 * @returns {Array<string>}
 *   List of tokens.
 */
function parse(value) {
  /** @type {Array<string>} */
  const tokens = []
  const input = String(value || '')
  let index = input.indexOf(',')
  let start = 0
  /** @type {boolean} */
  let end = false

  while (!end) {
    if (index === -1) {
      index = input.length
      end = true
    }

    const token = input.slice(start, index).trim()

    if (token || !end) {
      tokens.push(token)
    }

    start = index + 1
    index = input.indexOf(',', start)
  }

  return tokens
}

/**
 * Serialize an array of strings or numbers to comma-separated tokens.
 *
 * @param {Array<string|number>} values
 *   List of tokens.
 * @param {Options} [options]
 *   Configuration for `stringify` (optional).
 * @returns {string}
 *   Comma-separated tokens.
 */
function stringify(values, options) {
  const settings = options || {}

  // Ensure the last empty entry is seen.
  const input = values[values.length - 1] === '' ? [...values, ''] : values

  return input
    .join(
      (settings.padRight ? ' ' : '') +
        ',' +
        (settings.padLeft === false ? '' : ' ')
    )
    .trim()
}


/***/ }),

/***/ 8787:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "T": function() { return /* binding */ decodeNamedCharacterReference; }
/* harmony export */ });
/// <reference lib="dom" />

/* global document */

const element = document.createElement('i')

/**
 * @param {string} value
 * @returns {string | false}
 */
function decodeNamedCharacterReference(value) {
  const characterReference = '&' + value + ';'
  element.innerHTML = characterReference
  const character = element.textContent

  // Some named character references do not require the closing semicolon
  // (`&not`, for instance), which leads to situations where parsing the assumed
  // named reference of `&notit;` will result in the string `¬it;`.
  // When we encounter a trailing semicolon after parsing, and the character
  // reference to decode was not a semicolon (`&semi;`), we can assume that the
  // matching was not complete.
  if (
    character.charCodeAt(character.length - 1) === 59 /* `;` */ &&
    value !== 'semi'
  ) {
    return false
  }

  // If the decoded string is equal to the input, the character reference was
  // not valid.
  return character === characterReference ? false : character
}


/***/ }),

/***/ 9447:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "dy": function() { return /* binding */ property_information_html; },
  "YP": function() { return /* binding */ property_information_svg; }
});

// UNUSED EXPORTS: find, hastToReact, normalize

;// CONCATENATED MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/schema.js
/**
 * @import {Schema as SchemaType, Space} from 'property-information'
 */

/** @type {SchemaType} */
class Schema {
  /**
   * @param {SchemaType['property']} property
   *   Property.
   * @param {SchemaType['normal']} normal
   *   Normal.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Schema.
   */
  constructor(property, normal, space) {
    this.normal = normal
    this.property = property

    if (space) {
      this.space = space
    }
  }
}

Schema.prototype.normal = {}
Schema.prototype.property = {}
Schema.prototype.space = undefined

;// CONCATENATED MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/merge.js
/**
 * @import {Info, Space} from 'property-information'
 */



/**
 * @param {ReadonlyArray<Schema>} definitions
 *   Definitions.
 * @param {Space | undefined} [space]
 *   Space.
 * @returns {Schema}
 *   Schema.
 */
function merge(definitions, space) {
  /** @type {Record<string, Info>} */
  const property = {}
  /** @type {Record<string, string>} */
  const normal = {}

  for (const definition of definitions) {
    Object.assign(property, definition.property)
    Object.assign(normal, definition.normal)
  }

  return new Schema(property, normal, space)
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/normalize.js
var normalize = __webpack_require__(4317);
// EXTERNAL MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/defined-info.js
var defined_info = __webpack_require__(855);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/create.js
/**
 * @import {Info, Space} from 'property-information'
 */

/**
 * @typedef Definition
 *   Definition of a schema.
 * @property {Record<string, string> | undefined} [attributes]
 *   Normalzed names to special attribute case.
 * @property {ReadonlyArray<string> | undefined} [mustUseProperty]
 *   Normalized names that must be set as properties.
 * @property {Record<string, number | null>} properties
 *   Property names to their types.
 * @property {Space | undefined} [space]
 *   Space.
 * @property {Transform} transform
 *   Transform a property name.
 */

/**
 * @callback Transform
 *   Transform.
 * @param {Record<string, string>} attributes
 *   Attributes.
 * @param {string} property
 *   Property.
 * @returns {string}
 *   Attribute.
 */





/**
 * @param {Definition} definition
 *   Definition.
 * @returns {Schema}
 *   Schema.
 */
function create(definition) {
  /** @type {Record<string, Info>} */
  const properties = {}
  /** @type {Record<string, string>} */
  const normals = {}

  for (const [property, value] of Object.entries(definition.properties)) {
    const info = new defined_info/* DefinedInfo */.I(
      property,
      definition.transform(definition.attributes || {}, property),
      value,
      definition.space
    )

    if (
      definition.mustUseProperty &&
      definition.mustUseProperty.includes(property)
    ) {
      info.mustUseProperty = true
    }

    properties[property] = info

    normals[(0,normalize/* normalize */.F)(property)] = property
    normals[(0,normalize/* normalize */.F)(info.attribute)] = property
  }

  return new Schema(properties, normals, definition.space)
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/types.js
var types = __webpack_require__(7706);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/aria.js



const aria = create({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: types.booleanish,
    ariaAutoComplete: null,
    ariaBusy: types.booleanish,
    ariaChecked: types.booleanish,
    ariaColCount: types.number,
    ariaColIndex: types.number,
    ariaColSpan: types.number,
    ariaControls: types.spaceSeparated,
    ariaCurrent: null,
    ariaDescribedBy: types.spaceSeparated,
    ariaDetails: null,
    ariaDisabled: types.booleanish,
    ariaDropEffect: types.spaceSeparated,
    ariaErrorMessage: null,
    ariaExpanded: types.booleanish,
    ariaFlowTo: types.spaceSeparated,
    ariaGrabbed: types.booleanish,
    ariaHasPopup: null,
    ariaHidden: types.booleanish,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: types.spaceSeparated,
    ariaLevel: types.number,
    ariaLive: null,
    ariaModal: types.booleanish,
    ariaMultiLine: types.booleanish,
    ariaMultiSelectable: types.booleanish,
    ariaOrientation: null,
    ariaOwns: types.spaceSeparated,
    ariaPlaceholder: null,
    ariaPosInSet: types.number,
    ariaPressed: types.booleanish,
    ariaReadOnly: types.booleanish,
    ariaRelevant: null,
    ariaRequired: types.booleanish,
    ariaRoleDescription: types.spaceSeparated,
    ariaRowCount: types.number,
    ariaRowIndex: types.number,
    ariaRowSpan: types.number,
    ariaSelected: types.booleanish,
    ariaSetSize: types.number,
    ariaSort: null,
    ariaValueMax: types.number,
    ariaValueMin: types.number,
    ariaValueNow: types.number,
    ariaValueText: null,
    role: null
  },
  transform(_, property) {
    return property === 'role'
      ? property
      : 'aria-' + property.slice(4).toLowerCase()
  }
})

;// CONCATENATED MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/case-sensitive-transform.js
/**
 * @param {Record<string, string>} attributes
 *   Attributes.
 * @param {string} attribute
 *   Attribute.
 * @returns {string}
 *   Transformed attribute.
 */
function caseSensitiveTransform(attributes, attribute) {
  return attribute in attributes ? attributes[attribute] : attribute
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/case-insensitive-transform.js


/**
 * @param {Record<string, string>} attributes
 *   Attributes.
 * @param {string} property
 *   Property.
 * @returns {string}
 *   Transformed property.
 */
function caseInsensitiveTransform(attributes, property) {
  return caseSensitiveTransform(attributes, property.toLowerCase())
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/html.js




const html = create({
  attributes: {
    acceptcharset: 'accept-charset',
    classname: 'class',
    htmlfor: 'for',
    httpequiv: 'http-equiv'
  },
  mustUseProperty: ['checked', 'multiple', 'muted', 'selected'],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: types.commaSeparated,
    acceptCharset: types.spaceSeparated,
    accessKey: types.spaceSeparated,
    action: null,
    allow: null,
    allowFullScreen: types.boolean,
    allowPaymentRequest: types.boolean,
    allowUserMedia: types.boolean,
    alt: null,
    as: null,
    async: types.boolean,
    autoCapitalize: null,
    autoComplete: types.spaceSeparated,
    autoFocus: types.boolean,
    autoPlay: types.boolean,
    blocking: types.spaceSeparated,
    capture: null,
    charSet: null,
    checked: types.boolean,
    cite: null,
    className: types.spaceSeparated,
    cols: types.number,
    colSpan: null,
    content: null,
    contentEditable: types.booleanish,
    controls: types.boolean,
    controlsList: types.spaceSeparated,
    coords: types.number | types.commaSeparated,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: types.boolean,
    defer: types.boolean,
    dir: null,
    dirName: null,
    disabled: types.boolean,
    download: types.overloadedBoolean,
    draggable: types.booleanish,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: types.boolean,
    formTarget: null,
    headers: types.spaceSeparated,
    height: types.number,
    hidden: types.overloadedBoolean,
    high: types.number,
    href: null,
    hrefLang: null,
    htmlFor: types.spaceSeparated,
    httpEquiv: types.spaceSeparated,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: types.boolean,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: types.boolean,
    itemId: null,
    itemProp: types.spaceSeparated,
    itemRef: types.spaceSeparated,
    itemScope: types.boolean,
    itemType: types.spaceSeparated,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: types.boolean,
    low: types.number,
    manifest: null,
    max: null,
    maxLength: types.number,
    media: null,
    method: null,
    min: null,
    minLength: types.number,
    multiple: types.boolean,
    muted: types.boolean,
    name: null,
    nonce: null,
    noModule: types.boolean,
    noValidate: types.boolean,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: types.boolean,
    optimum: types.number,
    pattern: null,
    ping: types.spaceSeparated,
    placeholder: null,
    playsInline: types.boolean,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: types.boolean,
    referrerPolicy: null,
    rel: types.spaceSeparated,
    required: types.boolean,
    reversed: types.boolean,
    rows: types.number,
    rowSpan: types.number,
    sandbox: types.spaceSeparated,
    scope: null,
    scoped: types.boolean,
    seamless: types.boolean,
    selected: types.boolean,
    shadowRootClonable: types.boolean,
    shadowRootDelegatesFocus: types.boolean,
    shadowRootMode: null,
    shape: null,
    size: types.number,
    sizes: null,
    slot: null,
    span: types.number,
    spellCheck: types.booleanish,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: types.number,
    step: null,
    style: null,
    tabIndex: types.number,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: types.boolean,
    useMap: null,
    value: types.booleanish,
    width: types.number,
    wrap: null,
    writingSuggestions: null,

    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null, // Several. Use CSS `text-align` instead,
    aLink: null, // `<body>`. Use CSS `a:active {color}` instead
    archive: types.spaceSeparated, // `<object>`. List of URIs to archives
    axis: null, // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null, // `<body>`. Use CSS `background-image` instead
    bgColor: null, // `<body>` and table elements. Use CSS `background-color` instead
    border: types.number, // `<table>`. Use CSS `border-width` instead,
    borderColor: null, // `<table>`. Use CSS `border-color` instead,
    bottomMargin: types.number, // `<body>`
    cellPadding: null, // `<table>`
    cellSpacing: null, // `<table>`
    char: null, // Several table elements. When `align=char`, sets the character to align on
    charOff: null, // Several table elements. When `char`, offsets the alignment
    classId: null, // `<object>`
    clear: null, // `<br>`. Use CSS `clear` instead
    code: null, // `<object>`
    codeBase: null, // `<object>`
    codeType: null, // `<object>`
    color: null, // `<font>` and `<hr>`. Use CSS instead
    compact: types.boolean, // Lists. Use CSS to reduce space between items instead
    declare: types.boolean, // `<object>`
    event: null, // `<script>`
    face: null, // `<font>`. Use CSS instead
    frame: null, // `<table>`
    frameBorder: null, // `<iframe>`. Use CSS `border` instead
    hSpace: types.number, // `<img>` and `<object>`
    leftMargin: types.number, // `<body>`
    link: null, // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null, // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null, // `<img>`. Use a `<picture>`
    marginHeight: types.number, // `<body>`
    marginWidth: types.number, // `<body>`
    noResize: types.boolean, // `<frame>`
    noHref: types.boolean, // `<area>`. Use no href instead of an explicit `nohref`
    noShade: types.boolean, // `<hr>`. Use background-color and height instead of borders
    noWrap: types.boolean, // `<td>` and `<th>`
    object: null, // `<applet>`
    profile: null, // `<head>`
    prompt: null, // `<isindex>`
    rev: null, // `<link>`
    rightMargin: types.number, // `<body>`
    rules: null, // `<table>`
    scheme: null, // `<meta>`
    scrolling: types.booleanish, // `<frame>`. Use overflow in the child context
    standby: null, // `<object>`
    summary: null, // `<table>`
    text: null, // `<body>`. Use CSS `color` instead
    topMargin: types.number, // `<body>`
    valueType: null, // `<param>`
    version: null, // `<html>`. Use a doctype.
    vAlign: null, // Several. Use CSS `vertical-align` instead
    vLink: null, // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: types.number, // `<img>` and `<object>`

    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: types.boolean,
    disableRemotePlayback: types.boolean,
    prefix: null,
    property: null,
    results: types.number,
    security: null,
    unselectable: null
  },
  space: 'html',
  transform: caseInsensitiveTransform
})

;// CONCATENATED MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/svg.js




const svg = create({
  attributes: {
    accentHeight: 'accent-height',
    alignmentBaseline: 'alignment-baseline',
    arabicForm: 'arabic-form',
    baselineShift: 'baseline-shift',
    capHeight: 'cap-height',
    className: 'class',
    clipPath: 'clip-path',
    clipRule: 'clip-rule',
    colorInterpolation: 'color-interpolation',
    colorInterpolationFilters: 'color-interpolation-filters',
    colorProfile: 'color-profile',
    colorRendering: 'color-rendering',
    crossOrigin: 'crossorigin',
    dataType: 'datatype',
    dominantBaseline: 'dominant-baseline',
    enableBackground: 'enable-background',
    fillOpacity: 'fill-opacity',
    fillRule: 'fill-rule',
    floodColor: 'flood-color',
    floodOpacity: 'flood-opacity',
    fontFamily: 'font-family',
    fontSize: 'font-size',
    fontSizeAdjust: 'font-size-adjust',
    fontStretch: 'font-stretch',
    fontStyle: 'font-style',
    fontVariant: 'font-variant',
    fontWeight: 'font-weight',
    glyphName: 'glyph-name',
    glyphOrientationHorizontal: 'glyph-orientation-horizontal',
    glyphOrientationVertical: 'glyph-orientation-vertical',
    hrefLang: 'hreflang',
    horizAdvX: 'horiz-adv-x',
    horizOriginX: 'horiz-origin-x',
    horizOriginY: 'horiz-origin-y',
    imageRendering: 'image-rendering',
    letterSpacing: 'letter-spacing',
    lightingColor: 'lighting-color',
    markerEnd: 'marker-end',
    markerMid: 'marker-mid',
    markerStart: 'marker-start',
    navDown: 'nav-down',
    navDownLeft: 'nav-down-left',
    navDownRight: 'nav-down-right',
    navLeft: 'nav-left',
    navNext: 'nav-next',
    navPrev: 'nav-prev',
    navRight: 'nav-right',
    navUp: 'nav-up',
    navUpLeft: 'nav-up-left',
    navUpRight: 'nav-up-right',
    onAbort: 'onabort',
    onActivate: 'onactivate',
    onAfterPrint: 'onafterprint',
    onBeforePrint: 'onbeforeprint',
    onBegin: 'onbegin',
    onCancel: 'oncancel',
    onCanPlay: 'oncanplay',
    onCanPlayThrough: 'oncanplaythrough',
    onChange: 'onchange',
    onClick: 'onclick',
    onClose: 'onclose',
    onCopy: 'oncopy',
    onCueChange: 'oncuechange',
    onCut: 'oncut',
    onDblClick: 'ondblclick',
    onDrag: 'ondrag',
    onDragEnd: 'ondragend',
    onDragEnter: 'ondragenter',
    onDragExit: 'ondragexit',
    onDragLeave: 'ondragleave',
    onDragOver: 'ondragover',
    onDragStart: 'ondragstart',
    onDrop: 'ondrop',
    onDurationChange: 'ondurationchange',
    onEmptied: 'onemptied',
    onEnd: 'onend',
    onEnded: 'onended',
    onError: 'onerror',
    onFocus: 'onfocus',
    onFocusIn: 'onfocusin',
    onFocusOut: 'onfocusout',
    onHashChange: 'onhashchange',
    onInput: 'oninput',
    onInvalid: 'oninvalid',
    onKeyDown: 'onkeydown',
    onKeyPress: 'onkeypress',
    onKeyUp: 'onkeyup',
    onLoad: 'onload',
    onLoadedData: 'onloadeddata',
    onLoadedMetadata: 'onloadedmetadata',
    onLoadStart: 'onloadstart',
    onMessage: 'onmessage',
    onMouseDown: 'onmousedown',
    onMouseEnter: 'onmouseenter',
    onMouseLeave: 'onmouseleave',
    onMouseMove: 'onmousemove',
    onMouseOut: 'onmouseout',
    onMouseOver: 'onmouseover',
    onMouseUp: 'onmouseup',
    onMouseWheel: 'onmousewheel',
    onOffline: 'onoffline',
    onOnline: 'ononline',
    onPageHide: 'onpagehide',
    onPageShow: 'onpageshow',
    onPaste: 'onpaste',
    onPause: 'onpause',
    onPlay: 'onplay',
    onPlaying: 'onplaying',
    onPopState: 'onpopstate',
    onProgress: 'onprogress',
    onRateChange: 'onratechange',
    onRepeat: 'onrepeat',
    onReset: 'onreset',
    onResize: 'onresize',
    onScroll: 'onscroll',
    onSeeked: 'onseeked',
    onSeeking: 'onseeking',
    onSelect: 'onselect',
    onShow: 'onshow',
    onStalled: 'onstalled',
    onStorage: 'onstorage',
    onSubmit: 'onsubmit',
    onSuspend: 'onsuspend',
    onTimeUpdate: 'ontimeupdate',
    onToggle: 'ontoggle',
    onUnload: 'onunload',
    onVolumeChange: 'onvolumechange',
    onWaiting: 'onwaiting',
    onZoom: 'onzoom',
    overlinePosition: 'overline-position',
    overlineThickness: 'overline-thickness',
    paintOrder: 'paint-order',
    panose1: 'panose-1',
    pointerEvents: 'pointer-events',
    referrerPolicy: 'referrerpolicy',
    renderingIntent: 'rendering-intent',
    shapeRendering: 'shape-rendering',
    stopColor: 'stop-color',
    stopOpacity: 'stop-opacity',
    strikethroughPosition: 'strikethrough-position',
    strikethroughThickness: 'strikethrough-thickness',
    strokeDashArray: 'stroke-dasharray',
    strokeDashOffset: 'stroke-dashoffset',
    strokeLineCap: 'stroke-linecap',
    strokeLineJoin: 'stroke-linejoin',
    strokeMiterLimit: 'stroke-miterlimit',
    strokeOpacity: 'stroke-opacity',
    strokeWidth: 'stroke-width',
    tabIndex: 'tabindex',
    textAnchor: 'text-anchor',
    textDecoration: 'text-decoration',
    textRendering: 'text-rendering',
    transformOrigin: 'transform-origin',
    typeOf: 'typeof',
    underlinePosition: 'underline-position',
    underlineThickness: 'underline-thickness',
    unicodeBidi: 'unicode-bidi',
    unicodeRange: 'unicode-range',
    unitsPerEm: 'units-per-em',
    vAlphabetic: 'v-alphabetic',
    vHanging: 'v-hanging',
    vIdeographic: 'v-ideographic',
    vMathematical: 'v-mathematical',
    vectorEffect: 'vector-effect',
    vertAdvY: 'vert-adv-y',
    vertOriginX: 'vert-origin-x',
    vertOriginY: 'vert-origin-y',
    wordSpacing: 'word-spacing',
    writingMode: 'writing-mode',
    xHeight: 'x-height',
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: 'playbackorder',
    timelineBegin: 'timelinebegin'
  },
  properties: {
    about: types.commaOrSpaceSeparated,
    accentHeight: types.number,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: types.number,
    amplitude: types.number,
    arabicForm: null,
    ascent: types.number,
    attributeName: null,
    attributeType: null,
    azimuth: types.number,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: types.number,
    by: null,
    calcMode: null,
    capHeight: types.number,
    className: types.spaceSeparated,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: types.number,
    diffuseConstant: types.number,
    direction: null,
    display: null,
    dur: null,
    divisor: types.number,
    dominantBaseline: null,
    download: types.boolean,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: types.number,
    enableBackground: null,
    end: null,
    event: null,
    exponent: types.number,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: types.number,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: types.commaSeparated,
    g2: types.commaSeparated,
    glyphName: types.commaSeparated,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: types.number,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: types.number,
    horizOriginX: types.number,
    horizOriginY: types.number,
    id: null,
    ideographic: types.number,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: types.number,
    k: types.number,
    k1: types.number,
    k2: types.number,
    k3: types.number,
    k4: types.number,
    kernelMatrix: types.commaOrSpaceSeparated,
    kernelUnitLength: null,
    keyPoints: null, // SEMI_COLON_SEPARATED
    keySplines: null, // SEMI_COLON_SEPARATED
    keyTimes: null, // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: types.number,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: types.number,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: types.number,
    overlineThickness: types.number,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: types.number,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: types.spaceSeparated,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: types.number,
    pointsAtY: types.number,
    pointsAtZ: types.number,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: types.commaOrSpaceSeparated,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: types.commaOrSpaceSeparated,
    rev: types.commaOrSpaceSeparated,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: types.commaOrSpaceSeparated,
    requiredFeatures: types.commaOrSpaceSeparated,
    requiredFonts: types.commaOrSpaceSeparated,
    requiredFormats: types.commaOrSpaceSeparated,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: types.number,
    specularExponent: types.number,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: types.number,
    strikethroughThickness: types.number,
    string: null,
    stroke: null,
    strokeDashArray: types.commaOrSpaceSeparated,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: types.number,
    strokeOpacity: types.number,
    strokeWidth: null,
    style: null,
    surfaceScale: types.number,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: types.commaOrSpaceSeparated,
    tabIndex: types.number,
    tableValues: null,
    target: null,
    targetX: types.number,
    targetY: types.number,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: types.commaOrSpaceSeparated,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: types.number,
    underlineThickness: types.number,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: types.number,
    values: null,
    vAlphabetic: types.number,
    vMathematical: types.number,
    vectorEffect: null,
    vHanging: types.number,
    vIdeographic: types.number,
    version: null,
    vertAdvY: types.number,
    vertOriginX: types.number,
    vertOriginY: types.number,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: types.number,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: 'svg',
  transform: caseSensitiveTransform
})

;// CONCATENATED MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/xlink.js


const xlink = create({
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  },
  space: 'xlink',
  transform(_, property) {
    return 'xlink:' + property.slice(5).toLowerCase()
  }
})

;// CONCATENATED MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/xmlns.js



const xmlns = create({
  attributes: {xmlnsxlink: 'xmlns:xlink'},
  properties: {xmlnsXLink: null, xmlns: null},
  space: 'xmlns',
  transform: caseInsensitiveTransform
})

;// CONCATENATED MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/xml.js


const xml = create({
  properties: {xmlBase: null, xmlLang: null, xmlSpace: null},
  space: 'xml',
  transform(_, property) {
    return 'xml:' + property.slice(3).toLowerCase()
  }
})

;// CONCATENATED MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/index.js
// Note: types exposed from `index.d.ts`.










const property_information_html = merge([aria, html, xlink, xmlns, xml], 'html')




const property_information_svg = merge([aria, svg, xlink, xmlns, xml], 'svg')


/***/ }),

/***/ 1714:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": function() { return /* binding */ find; }
/* harmony export */ });
/* harmony import */ var _util_defined_info_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(855);
/* harmony import */ var _util_info_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8373);
/* harmony import */ var _normalize_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4317);
/**
 * @import {Schema} from 'property-information'
 */





const cap = /[A-Z]/g
const dash = /-[a-z]/g
const valid = /^data[-\w.:]+$/i

/**
 * Look up info on a property.
 *
 * In most cases the given `schema` contains info on the property.
 * All standard,
 * most legacy,
 * and some non-standard properties are supported.
 * For these cases,
 * the returned `Info` has hints about the value of the property.
 *
 * `name` can also be a valid data attribute or property,
 * in which case an `Info` object with the correctly cased `attribute` and
 * `property` is returned.
 *
 * `name` can be an unknown attribute,
 * in which case an `Info` object with `attribute` and `property` set to the
 * given name is returned.
 * It is not recommended to provide unsupported legacy or recently specced
 * properties.
 *
 *
 * @param {Schema} schema
 *   Schema;
 *   either the `html` or `svg` export.
 * @param {string} value
 *   An attribute-like or property-like name;
 *   it will be passed through `normalize` to hopefully find the correct info.
 * @returns {Info}
 *   Info.
 */
function find(schema, value) {
  const normal = (0,_normalize_js__WEBPACK_IMPORTED_MODULE_0__/* .normalize */ .F)(value)
  let property = value
  let Type = _util_info_js__WEBPACK_IMPORTED_MODULE_1__/* .Info */ .k

  if (normal in schema.normal) {
    return schema.property[schema.normal[normal]]
  }

  if (normal.length > 4 && normal.slice(0, 4) === 'data' && valid.test(value)) {
    // Attribute or property.
    if (value.charAt(4) === '-') {
      // Turn it into a property.
      const rest = value.slice(5).replace(dash, camelcase)
      property = 'data' + rest.charAt(0).toUpperCase() + rest.slice(1)
    } else {
      // Turn it into an attribute.
      const rest = value.slice(4)

      if (!dash.test(rest)) {
        let dashes = rest.replace(cap, kebab)

        if (dashes.charAt(0) !== '-') {
          dashes = '-' + dashes
        }

        value = 'data' + dashes
      }
    }

    Type = _util_defined_info_js__WEBPACK_IMPORTED_MODULE_2__/* .DefinedInfo */ .I
  }

  return new Type(property, value)
}

/**
 * @param {string} $0
 *   Value.
 * @returns {string}
 *   Kebab.
 */
function kebab($0) {
  return '-' + $0.toLowerCase()
}

/**
 * @param {string} $0
 *   Value.
 * @returns {string}
 *   Camel.
 */
function camelcase($0) {
  return $0.charAt(1).toUpperCase()
}


/***/ }),

/***/ 4317:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "F": function() { return /* binding */ normalize; }
/* harmony export */ });
/**
 * Get the cleaned case insensitive form of an attribute or property.
 *
 * @param {string} value
 *   An attribute-like or property-like name.
 * @returns {string}
 *   Value that can be used to look up the properly cased property on a
 *   `Schema`.
 */
function normalize(value) {
  return value.toLowerCase()
}


/***/ }),

/***/ 855:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "I": function() { return /* binding */ DefinedInfo; }
/* harmony export */ });
/* harmony import */ var _info_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8373);
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7706);
/**
 * @import {Space} from 'property-information'
 */




const checks = /** @type {ReadonlyArray<keyof typeof types>} */ (
  Object.keys(_types_js__WEBPACK_IMPORTED_MODULE_0__)
)

class DefinedInfo extends _info_js__WEBPACK_IMPORTED_MODULE_1__/* .Info */ .k {
  /**
   * @constructor
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @param {number | null | undefined} [mask]
   *   Mask.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Info.
   */
  constructor(property, attribute, mask, space) {
    let index = -1

    super(property, attribute)

    mark(this, 'space', space)

    if (typeof mask === 'number') {
      while (++index < checks.length) {
        const check = checks[index]
        mark(this, checks[index], (mask & _types_js__WEBPACK_IMPORTED_MODULE_0__[check]) === _types_js__WEBPACK_IMPORTED_MODULE_0__[check])
      }
    }
  }
}

DefinedInfo.prototype.defined = true

/**
 * @template {keyof DefinedInfo} Key
 *   Key type.
 * @param {DefinedInfo} values
 *   Info.
 * @param {Key} key
 *   Key.
 * @param {DefinedInfo[Key]} value
 *   Value.
 * @returns {undefined}
 *   Nothing.
 */
function mark(values, key, value) {
  if (value) {
    values[key] = value
  }
}


/***/ }),

/***/ 8373:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "k": function() { return /* binding */ Info; }
/* harmony export */ });
/**
 * @import {Info as InfoType} from 'property-information'
 */

/** @type {InfoType} */
class Info {
  /**
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @returns
   *   Info.
   */
  constructor(property, attribute) {
    this.attribute = attribute
    this.property = property
  }
}

Info.prototype.attribute = ''
Info.prototype.booleanish = false
Info.prototype.boolean = false
Info.prototype.commaOrSpaceSeparated = false
Info.prototype.commaSeparated = false
Info.prototype.defined = false
Info.prototype.mustUseProperty = false
Info.prototype.number = false
Info.prototype.overloadedBoolean = false
Info.prototype.property = ''
Info.prototype.spaceSeparated = false
Info.prototype.space = undefined


/***/ }),

/***/ 7706:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "boolean": function() { return /* binding */ boolean; },
/* harmony export */   "booleanish": function() { return /* binding */ booleanish; },
/* harmony export */   "commaOrSpaceSeparated": function() { return /* binding */ commaOrSpaceSeparated; },
/* harmony export */   "commaSeparated": function() { return /* binding */ commaSeparated; },
/* harmony export */   "number": function() { return /* binding */ number; },
/* harmony export */   "overloadedBoolean": function() { return /* binding */ overloadedBoolean; },
/* harmony export */   "spaceSeparated": function() { return /* binding */ spaceSeparated; }
/* harmony export */ });
let powers = 0

const boolean = increment()
const booleanish = increment()
const overloadedBoolean = increment()
const number = increment()
const spaceSeparated = increment()
const commaSeparated = increment()
const commaOrSpaceSeparated = increment()

function increment() {
  return 2 ** ++powers
}


/***/ }),

/***/ 9180:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "UG": function() { return /* binding */ Markdown; },
  "nC": function() { return /* binding */ defaultUrlTransform; }
});

// UNUSED EXPORTS: MarkdownAsync, MarkdownHooks

// NAMESPACE OBJECT: ../../node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/constructs.js
var constructs_namespaceObject = {};
__webpack_require__.r(constructs_namespaceObject);
__webpack_require__.d(constructs_namespaceObject, {
  "attentionMarkers": function() { return attentionMarkers; },
  "contentInitial": function() { return contentInitial; },
  "disable": function() { return disable; },
  "document": function() { return constructs_document; },
  "flow": function() { return constructs_flow; },
  "flowInitial": function() { return flowInitial; },
  "insideSpan": function() { return insideSpan; },
  "string": function() { return constructs_string; },
  "text": function() { return constructs_text; }
});

;// CONCATENATED MODULE: ../../node_modules/.pnpm/devlop@1.1.0/node_modules/devlop/lib/default.js
function deprecate(fn) {
  return fn
}

function equal() {}

function ok() {}

function unreachable() {}

// EXTERNAL MODULE: ../../node_modules/.pnpm/comma-separated-tokens@2.0.3/node_modules/comma-separated-tokens/index.js
var comma_separated_tokens = __webpack_require__(804);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/estree-util-is-identifier-name@3.0.0/node_modules/estree-util-is-identifier-name/lib/index.js
/**
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [jsx=false]
 *   Support JSX identifiers (default: `false`).
 */

const startRe = /[$_\p{ID_Start}]/u
const contRe = /[$_\u{200C}\u{200D}\p{ID_Continue}]/u
const contReJsx = /[-$_\u{200C}\u{200D}\p{ID_Continue}]/u
const nameRe = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u
const nameReJsx = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u

/** @type {Options} */
const emptyOptions = {}

/**
 * Checks if the given code point can start an identifier.
 *
 * @param {number | undefined} code
 *   Code point to check.
 * @returns {boolean}
 *   Whether `code` can start an identifier.
 */
// Note: `undefined` is supported so you can pass the result from `''.codePointAt`.
function start(code) {
  return code ? startRe.test(String.fromCodePoint(code)) : false
}

/**
 * Checks if the given code point can continue an identifier.
 *
 * @param {number | undefined} code
 *   Code point to check.
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {boolean}
 *   Whether `code` can continue an identifier.
 */
// Note: `undefined` is supported so you can pass the result from `''.codePointAt`.
function cont(code, options) {
  const settings = options || emptyOptions
  const re = settings.jsx ? contReJsx : contRe
  return code ? re.test(String.fromCodePoint(code)) : false
}

/**
 * Checks if the given value is a valid identifier name.
 *
 * @param {string} name
 *   Identifier to check.
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {boolean}
 *   Whether `name` can be an identifier.
 */
function lib_name(name, options) {
  const settings = options || emptyOptions
  const re = settings.jsx ? nameReJsx : nameRe
  return re.test(name)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/hast-util-whitespace@3.0.0/node_modules/hast-util-whitespace/lib/index.js
/**
 * @typedef {import('hast').Nodes} Nodes
 */

// HTML whitespace expression.
// See <https://infra.spec.whatwg.org/#ascii-whitespace>.
const re = /[ \t\n\f\r]/g

/**
 * Check if the given value is *inter-element whitespace*.
 *
 * @param {Nodes | string} thing
 *   Thing to check (`Node` or `string`).
 * @returns {boolean}
 *   Whether the `value` is inter-element whitespace (`boolean`): consisting of
 *   zero or more of space, tab (`\t`), line feed (`\n`), carriage return
 *   (`\r`), or form feed (`\f`); if a node is passed it must be a `Text` node,
 *   whose `value` field is checked.
 */
function whitespace(thing) {
  return typeof thing === 'object'
    ? thing.type === 'text'
      ? empty(thing.value)
      : false
    : empty(thing)
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function empty(value) {
  return value.replace(re, '') === ''
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/index.js + 11 modules
var property_information = __webpack_require__(9447);
// EXTERNAL MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/find.js
var find = __webpack_require__(1714);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/hast-to-react.js
/**
 * Special cases for React (`Record<string, string>`).
 *
 * `hast` is close to `React` but differs in a couple of cases.
 * To get a React property from a hast property,
 * check if it is in `hastToReact`.
 * If it is, use the corresponding value;
 * otherwise, use the hast property.
 *
 * @type {Record<string, string>}
 */
const hastToReact = {
  classId: 'classID',
  dataType: 'datatype',
  itemId: 'itemID',
  strokeDashArray: 'strokeDasharray',
  strokeDashOffset: 'strokeDashoffset',
  strokeLineCap: 'strokeLinecap',
  strokeLineJoin: 'strokeLinejoin',
  strokeMiterLimit: 'strokeMiterlimit',
  typeOf: 'typeof',
  xLinkActuate: 'xlinkActuate',
  xLinkArcRole: 'xlinkArcrole',
  xLinkHref: 'xlinkHref',
  xLinkRole: 'xlinkRole',
  xLinkShow: 'xlinkShow',
  xLinkTitle: 'xlinkTitle',
  xLinkType: 'xlinkType',
  xmlnsXLink: 'xmlnsXlink'
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/space-separated-tokens@2.0.2/node_modules/space-separated-tokens/index.js
var space_separated_tokens = __webpack_require__(8384);
// EXTERNAL MODULE: ../../node_modules/.pnpm/style-to-js@1.1.21/node_modules/style-to-js/cjs/index.js
var cjs = __webpack_require__(6801);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/unist-util-position@5.0.0/node_modules/unist-util-position/lib/index.js
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Point} Point
 * @typedef {import('unist').Position} Position
 */

/**
 * @typedef NodeLike
 * @property {string} type
 * @property {PositionLike | null | undefined} [position]
 *
 * @typedef PositionLike
 * @property {PointLike | null | undefined} [start]
 * @property {PointLike | null | undefined} [end]
 *
 * @typedef PointLike
 * @property {number | null | undefined} [line]
 * @property {number | null | undefined} [column]
 * @property {number | null | undefined} [offset]
 */

/**
 * Get the ending point of `node`.
 *
 * @param node
 *   Node.
 * @returns
 *   Point.
 */
const pointEnd = point('end')

/**
 * Get the starting point of `node`.
 *
 * @param node
 *   Node.
 * @returns
 *   Point.
 */
const pointStart = point('start')

/**
 * Get the positional info of `node`.
 *
 * @param {'end' | 'start'} type
 *   Side.
 * @returns
 *   Getter.
 */
function point(type) {
  return point

  /**
   * Get the point info of `node` at a bound side.
   *
   * @param {Node | NodeLike | null | undefined} [node]
   * @returns {Point | undefined}
   */
  function point(node) {
    const point = (node && node.position && node.position[type]) || {}

    if (
      typeof point.line === 'number' &&
      point.line > 0 &&
      typeof point.column === 'number' &&
      point.column > 0
    ) {
      return {
        line: point.line,
        column: point.column,
        offset:
          typeof point.offset === 'number' && point.offset > -1
            ? point.offset
            : undefined
      }
    }
  }
}

/**
 * Get the positional info of `node`.
 *
 * @param {Node | NodeLike | null | undefined} [node]
 *   Node.
 * @returns {Position | undefined}
 *   Position.
 */
function position(node) {
  const start = pointStart(node)
  const end = pointEnd(node)

  if (start && end) {
    return {start, end}
  }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/unist-util-stringify-position@4.0.0/node_modules/unist-util-stringify-position/lib/index.js
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Point} Point
 * @typedef {import('unist').Position} Position
 */

/**
 * @typedef NodeLike
 * @property {string} type
 * @property {PositionLike | null | undefined} [position]
 *
 * @typedef PointLike
 * @property {number | null | undefined} [line]
 * @property {number | null | undefined} [column]
 * @property {number | null | undefined} [offset]
 *
 * @typedef PositionLike
 * @property {PointLike | null | undefined} [start]
 * @property {PointLike | null | undefined} [end]
 */

/**
 * Serialize the positional info of a point, position (start and end points),
 * or node.
 *
 * @param {Node | NodeLike | Point | PointLike | Position | PositionLike | null | undefined} [value]
 *   Node, position, or point.
 * @returns {string}
 *   Pretty printed positional info of a node (`string`).
 *
 *   In the format of a range `ls:cs-le:ce` (when given `node` or `position`)
 *   or a point `l:c` (when given `point`), where `l` stands for line, `c` for
 *   column, `s` for `start`, and `e` for end.
 *   An empty string (`''`) is returned if the given value is neither `node`,
 *   `position`, nor `point`.
 */
function stringifyPosition(value) {
  // Nothing.
  if (!value || typeof value !== 'object') {
    return ''
  }

  // Node.
  if ('position' in value || 'type' in value) {
    return lib_position(value.position)
  }

  // Position.
  if ('start' in value || 'end' in value) {
    return lib_position(value)
  }

  // Point.
  if ('line' in value || 'column' in value) {
    return lib_point(value)
  }

  // ?
  return ''
}

/**
 * @param {Point | PointLike | null | undefined} point
 * @returns {string}
 */
function lib_point(point) {
  return index(point && point.line) + ':' + index(point && point.column)
}

/**
 * @param {Position | PositionLike | null | undefined} pos
 * @returns {string}
 */
function lib_position(pos) {
  return lib_point(pos && pos.start) + '-' + lib_point(pos && pos.end)
}

/**
 * @param {number | null | undefined} value
 * @returns {number}
 */
function index(value) {
  return value && typeof value === 'number' ? value : 1
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/vfile-message@4.0.3/node_modules/vfile-message/lib/index.js
/**
 * @import {Node, Point, Position} from 'unist'
 */

/**
 * @typedef {object & {type: string, position?: Position | undefined}} NodeLike
 *
 * @typedef Options
 *   Configuration.
 * @property {Array<Node> | null | undefined} [ancestors]
 *   Stack of (inclusive) ancestor nodes surrounding the message (optional).
 * @property {Error | null | undefined} [cause]
 *   Original error cause of the message (optional).
 * @property {Point | Position | null | undefined} [place]
 *   Place of message (optional).
 * @property {string | null | undefined} [ruleId]
 *   Category of message (optional, example: `'my-rule'`).
 * @property {string | null | undefined} [source]
 *   Namespace of who sent the message (optional, example: `'my-package'`).
 */



/**
 * Message.
 */
class VFileMessage extends Error {
  /**
   * Create a message for `reason`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {Options | null | undefined} [options]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // eslint-disable-next-line complexity
  constructor(causeOrReason, optionsOrParentOrPlace, origin) {
    super()

    if (typeof optionsOrParentOrPlace === 'string') {
      origin = optionsOrParentOrPlace
      optionsOrParentOrPlace = undefined
    }

    /** @type {string} */
    let reason = ''
    /** @type {Options} */
    let options = {}
    let legacyCause = false

    if (optionsOrParentOrPlace) {
      // Point.
      if (
        'line' in optionsOrParentOrPlace &&
        'column' in optionsOrParentOrPlace
      ) {
        options = {place: optionsOrParentOrPlace}
      }
      // Position.
      else if (
        'start' in optionsOrParentOrPlace &&
        'end' in optionsOrParentOrPlace
      ) {
        options = {place: optionsOrParentOrPlace}
      }
      // Node.
      else if ('type' in optionsOrParentOrPlace) {
        options = {
          ancestors: [optionsOrParentOrPlace],
          place: optionsOrParentOrPlace.position
        }
      }
      // Options.
      else {
        options = {...optionsOrParentOrPlace}
      }
    }

    if (typeof causeOrReason === 'string') {
      reason = causeOrReason
    }
    // Error.
    else if (!options.cause && causeOrReason) {
      legacyCause = true
      reason = causeOrReason.message
      options.cause = causeOrReason
    }

    if (!options.ruleId && !options.source && typeof origin === 'string') {
      const index = origin.indexOf(':')

      if (index === -1) {
        options.ruleId = origin
      } else {
        options.source = origin.slice(0, index)
        options.ruleId = origin.slice(index + 1)
      }
    }

    if (!options.place && options.ancestors && options.ancestors) {
      const parent = options.ancestors[options.ancestors.length - 1]

      if (parent) {
        options.place = parent.position
      }
    }

    const start =
      options.place && 'start' in options.place
        ? options.place.start
        : options.place

    /**
     * Stack of ancestor nodes surrounding the message.
     *
     * @type {Array<Node> | undefined}
     */
    this.ancestors = options.ancestors || undefined

    /**
     * Original error cause of the message.
     *
     * @type {Error | undefined}
     */
    this.cause = options.cause || undefined

    /**
     * Starting column of message.
     *
     * @type {number | undefined}
     */
    this.column = start ? start.column : undefined

    /**
     * State of problem.
     *
     * * `true` — error, file not usable
     * * `false` — warning, change may be needed
     * * `undefined` — change likely not needed
     *
     * @type {boolean | null | undefined}
     */
    this.fatal = undefined

    /**
     * Path of a file (used throughout the `VFile` ecosystem).
     *
     * @type {string | undefined}
     */
    this.file = ''

    // Field from `Error`.
    /**
     * Reason for message.
     *
     * @type {string}
     */
    this.message = reason

    /**
     * Starting line of error.
     *
     * @type {number | undefined}
     */
    this.line = start ? start.line : undefined

    // Field from `Error`.
    /**
     * Serialized positional info of message.
     *
     * On normal errors, this would be something like `ParseError`, buit in
     * `VFile` messages we use this space to show where an error happened.
     */
    this.name = stringifyPosition(options.place) || '1:1'

    /**
     * Place of message.
     *
     * @type {Point | Position | undefined}
     */
    this.place = options.place || undefined

    /**
     * Reason for message, should use markdown.
     *
     * @type {string}
     */
    this.reason = this.message

    /**
     * Category of message (example: `'my-rule'`).
     *
     * @type {string | undefined}
     */
    this.ruleId = options.ruleId || undefined

    /**
     * Namespace of message (example: `'my-package'`).
     *
     * @type {string | undefined}
     */
    this.source = options.source || undefined

    // Field from `Error`.
    /**
     * Stack of message.
     *
     * This is used by normal errors to show where something happened in
     * programming code, irrelevant for `VFile` messages,
     *
     * @type {string}
     */
    this.stack =
      legacyCause && options.cause && typeof options.cause.stack === 'string'
        ? options.cause.stack
        : ''

    // The following fields are “well known”.
    // Not standard.
    // Feel free to add other non-standard fields to your messages.

    /**
     * Specify the source value that’s being reported, which is deemed
     * incorrect.
     *
     * @type {string | undefined}
     */
    this.actual = undefined

    /**
     * Suggest acceptable values that can be used instead of `actual`.
     *
     * @type {Array<string> | undefined}
     */
    this.expected = undefined

    /**
     * Long form description of the message (you should use markdown).
     *
     * @type {string | undefined}
     */
    this.note = undefined

    /**
     * Link to docs for the message.
     *
     * > 👉 **Note**: this must be an absolute URL that can be passed as `x`
     * > to `new URL(x)`.
     *
     * @type {string | undefined}
     */
    this.url = undefined
  }
}

VFileMessage.prototype.file = ''
VFileMessage.prototype.name = ''
VFileMessage.prototype.reason = ''
VFileMessage.prototype.message = ''
VFileMessage.prototype.stack = ''
VFileMessage.prototype.column = undefined
VFileMessage.prototype.line = undefined
VFileMessage.prototype.ancestors = undefined
VFileMessage.prototype.cause = undefined
VFileMessage.prototype.fatal = undefined
VFileMessage.prototype.place = undefined
VFileMessage.prototype.ruleId = undefined
VFileMessage.prototype.source = undefined

;// CONCATENATED MODULE: ../../node_modules/.pnpm/hast-util-to-jsx-runtime@2.3.6/node_modules/hast-util-to-jsx-runtime/lib/index.js
/**
 * @import {Identifier, Literal, MemberExpression} from 'estree'
 * @import {Jsx, JsxDev, Options, Props} from 'hast-util-to-jsx-runtime'
 * @import {Element, Nodes, Parents, Root, Text} from 'hast'
 * @import {MdxFlowExpressionHast, MdxTextExpressionHast} from 'mdast-util-mdx-expression'
 * @import {MdxJsxFlowElementHast, MdxJsxTextElementHast} from 'mdast-util-mdx-jsx'
 * @import {MdxjsEsmHast} from 'mdast-util-mdxjs-esm'
 * @import {Position} from 'unist'
 * @import {Child, Create, Field, JsxElement, State, Style} from './types.js'
 */











// To do: next major: `Object.hasOwn`.
const own = {}.hasOwnProperty

/** @type {Map<string, number>} */
const emptyMap = new Map()

const cap = /[A-Z]/g

// `react-dom` triggers a warning for *any* white space in tables.
// To follow GFM, `mdast-util-to-hast` injects line endings between elements.
// Other tools might do so too, but they don’t do here, so we remove all of
// that.

// See: <https://github.com/facebook/react/pull/7081>.
// See: <https://github.com/facebook/react/pull/7515>.
// See: <https://github.com/remarkjs/remark-react/issues/64>.
// See: <https://github.com/rehypejs/rehype-react/pull/29>.
// See: <https://github.com/rehypejs/rehype-react/pull/32>.
// See: <https://github.com/rehypejs/rehype-react/pull/45>.
const tableElements = new Set(['table', 'tbody', 'thead', 'tfoot', 'tr'])

const tableCellElement = new Set(['td', 'th'])

const docs = 'https://github.com/syntax-tree/hast-util-to-jsx-runtime'

/**
 * Transform a hast tree to preact, react, solid, svelte, vue, etc.,
 * with an automatic JSX runtime.
 *
 * @param {Nodes} tree
 *   Tree to transform.
 * @param {Options} options
 *   Configuration (required).
 * @returns {JsxElement}
 *   JSX element.
 */

function toJsxRuntime(tree, options) {
  if (!options || options.Fragment === undefined) {
    throw new TypeError('Expected `Fragment` in options')
  }

  const filePath = options.filePath || undefined
  /** @type {Create} */
  let create

  if (options.development) {
    if (typeof options.jsxDEV !== 'function') {
      throw new TypeError(
        'Expected `jsxDEV` in options when `development: true`'
      )
    }

    create = developmentCreate(filePath, options.jsxDEV)
  } else {
    if (typeof options.jsx !== 'function') {
      throw new TypeError('Expected `jsx` in production options')
    }

    if (typeof options.jsxs !== 'function') {
      throw new TypeError('Expected `jsxs` in production options')
    }

    create = productionCreate(filePath, options.jsx, options.jsxs)
  }

  /** @type {State} */
  const state = {
    Fragment: options.Fragment,
    ancestors: [],
    components: options.components || {},
    create,
    elementAttributeNameCase: options.elementAttributeNameCase || 'react',
    evaluater: options.createEvaluater ? options.createEvaluater() : undefined,
    filePath,
    ignoreInvalidStyle: options.ignoreInvalidStyle || false,
    passKeys: options.passKeys !== false,
    passNode: options.passNode || false,
    schema: options.space === 'svg' ? property_information/* svg */.YP : property_information/* html */.dy,
    stylePropertyNameCase: options.stylePropertyNameCase || 'dom',
    tableCellAlignToStyle: options.tableCellAlignToStyle !== false
  }

  const result = one(state, tree, undefined)

  // JSX element.
  if (result && typeof result !== 'string') {
    return result
  }

  // Text node or something that turned into nothing.
  return state.create(
    tree,
    state.Fragment,
    {children: result || undefined},
    undefined
  )
}

/**
 * Transform a node.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Nodes} node
 *   Current node.
 * @param {string | undefined} key
 *   Key.
 * @returns {Child | undefined}
 *   Child, optional.
 */
function one(state, node, key) {
  if (node.type === 'element') {
    return lib_element(state, node, key)
  }

  if (node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') {
    return mdxExpression(state, node)
  }

  if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
    return mdxJsxElement(state, node, key)
  }

  if (node.type === 'mdxjsEsm') {
    return mdxEsm(state, node)
  }

  if (node.type === 'root') {
    return root(state, node, key)
  }

  if (node.type === 'text') {
    return lib_text(state, node)
  }
}

/**
 * Handle element.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Element} node
 *   Current node.
 * @param {string | undefined} key
 *   Key.
 * @returns {Child | undefined}
 *   Child, optional.
 */
function lib_element(state, node, key) {
  const parentSchema = state.schema
  let schema = parentSchema

  if (node.tagName.toLowerCase() === 'svg' && parentSchema.space === 'html') {
    schema = property_information/* svg */.YP
    state.schema = schema
  }

  state.ancestors.push(node)

  const type = findComponentFromName(state, node.tagName, false)
  const props = createElementProps(state, node)
  let children = createChildren(state, node)

  if (tableElements.has(node.tagName)) {
    children = children.filter(function (child) {
      return typeof child === 'string' ? !whitespace(child) : true
    })
  }

  addNode(state, props, type, node)
  addChildren(props, children)

  // Restore.
  state.ancestors.pop()
  state.schema = parentSchema

  return state.create(node, type, props, key)
}

/**
 * Handle MDX expression.
 *
 * @param {State} state
 *   Info passed around.
 * @param {MdxFlowExpressionHast | MdxTextExpressionHast} node
 *   Current node.
 * @returns {Child | undefined}
 *   Child, optional.
 */
function mdxExpression(state, node) {
  if (node.data && node.data.estree && state.evaluater) {
    const program = node.data.estree
    const expression = program.body[0]
    ok(expression.type === 'ExpressionStatement')

    // Assume result is a child.
    return /** @type {Child | undefined} */ (
      state.evaluater.evaluateExpression(expression.expression)
    )
  }

  crashEstree(state, node.position)
}

/**
 * Handle MDX ESM.
 *
 * @param {State} state
 *   Info passed around.
 * @param {MdxjsEsmHast} node
 *   Current node.
 * @returns {Child | undefined}
 *   Child, optional.
 */
function mdxEsm(state, node) {
  if (node.data && node.data.estree && state.evaluater) {
    // Assume result is a child.
    return /** @type {Child | undefined} */ (
      state.evaluater.evaluateProgram(node.data.estree)
    )
  }

  crashEstree(state, node.position)
}

/**
 * Handle MDX JSX.
 *
 * @param {State} state
 *   Info passed around.
 * @param {MdxJsxFlowElementHast | MdxJsxTextElementHast} node
 *   Current node.
 * @param {string | undefined} key
 *   Key.
 * @returns {Child | undefined}
 *   Child, optional.
 */
function mdxJsxElement(state, node, key) {
  const parentSchema = state.schema
  let schema = parentSchema

  if (node.name === 'svg' && parentSchema.space === 'html') {
    schema = property_information/* svg */.YP
    state.schema = schema
  }

  state.ancestors.push(node)

  const type =
    node.name === null
      ? state.Fragment
      : findComponentFromName(state, node.name, true)
  const props = createJsxElementProps(state, node)
  const children = createChildren(state, node)

  addNode(state, props, type, node)
  addChildren(props, children)

  // Restore.
  state.ancestors.pop()
  state.schema = parentSchema

  return state.create(node, type, props, key)
}

/**
 * Handle root.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Root} node
 *   Current node.
 * @param {string | undefined} key
 *   Key.
 * @returns {Child | undefined}
 *   Child, optional.
 */
function root(state, node, key) {
  /** @type {Props} */
  const props = {}

  addChildren(props, createChildren(state, node))

  return state.create(node, state.Fragment, props, key)
}

/**
 * Handle text.
 *
 * @param {State} _
 *   Info passed around.
 * @param {Text} node
 *   Current node.
 * @returns {Child | undefined}
 *   Child, optional.
 */
function lib_text(_, node) {
  return node.value
}

/**
 * Add `node` to props.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Props} props
 *   Props.
 * @param {unknown} type
 *   Type.
 * @param {Element | MdxJsxFlowElementHast | MdxJsxTextElementHast} node
 *   Node.
 * @returns {undefined}
 *   Nothing.
 */
function addNode(state, props, type, node) {
  // If this is swapped out for a component:
  if (typeof type !== 'string' && type !== state.Fragment && state.passNode) {
    props.node = node
  }
}

/**
 * Add children to props.
 *
 * @param {Props} props
 *   Props.
 * @param {Array<Child>} children
 *   Children.
 * @returns {undefined}
 *   Nothing.
 */
function addChildren(props, children) {
  if (children.length > 0) {
    const value = children.length > 1 ? children : children[0]

    if (value) {
      props.children = value
    }
  }
}

/**
 * @param {string | undefined} _
 *   Path to file.
 * @param {Jsx} jsx
 *   Dynamic.
 * @param {Jsx} jsxs
 *   Static.
 * @returns {Create}
 *   Create a production element.
 */
function productionCreate(_, jsx, jsxs) {
  return create
  /** @type {Create} */
  function create(_, type, props, key) {
    // Only an array when there are 2 or more children.
    const isStaticChildren = Array.isArray(props.children)
    const fn = isStaticChildren ? jsxs : jsx
    return key ? fn(type, props, key) : fn(type, props)
  }
}

/**
 * @param {string | undefined} filePath
 *   Path to file.
 * @param {JsxDev} jsxDEV
 *   Development.
 * @returns {Create}
 *   Create a development element.
 */
function developmentCreate(filePath, jsxDEV) {
  return create
  /** @type {Create} */
  function create(node, type, props, key) {
    // Only an array when there are 2 or more children.
    const isStaticChildren = Array.isArray(props.children)
    const point = pointStart(node)
    return jsxDEV(
      type,
      props,
      key,
      isStaticChildren,
      {
        columnNumber: point ? point.column - 1 : undefined,
        fileName: filePath,
        lineNumber: point ? point.line : undefined
      },
      undefined
    )
  }
}

/**
 * Create props from an element.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Element} node
 *   Current element.
 * @returns {Props}
 *   Props.
 */
function createElementProps(state, node) {
  /** @type {Props} */
  const props = {}
  /** @type {string | undefined} */
  let alignValue
  /** @type {string} */
  let prop

  for (prop in node.properties) {
    if (prop !== 'children' && own.call(node.properties, prop)) {
      const result = createProperty(state, prop, node.properties[prop])

      if (result) {
        const [key, value] = result

        if (
          state.tableCellAlignToStyle &&
          key === 'align' &&
          typeof value === 'string' &&
          tableCellElement.has(node.tagName)
        ) {
          alignValue = value
        } else {
          props[key] = value
        }
      }
    }
  }

  if (alignValue) {
    // Assume style is an object.
    const style = /** @type {Style} */ (props.style || (props.style = {}))
    style[state.stylePropertyNameCase === 'css' ? 'text-align' : 'textAlign'] =
      alignValue
  }

  return props
}

/**
 * Create props from a JSX element.
 *
 * @param {State} state
 *   Info passed around.
 * @param {MdxJsxFlowElementHast | MdxJsxTextElementHast} node
 *   Current JSX element.
 * @returns {Props}
 *   Props.
 */
function createJsxElementProps(state, node) {
  /** @type {Props} */
  const props = {}

  for (const attribute of node.attributes) {
    if (attribute.type === 'mdxJsxExpressionAttribute') {
      if (attribute.data && attribute.data.estree && state.evaluater) {
        const program = attribute.data.estree
        const expression = program.body[0]
        ok(expression.type === 'ExpressionStatement')
        const objectExpression = expression.expression
        ok(objectExpression.type === 'ObjectExpression')
        const property = objectExpression.properties[0]
        ok(property.type === 'SpreadElement')

        Object.assign(
          props,
          state.evaluater.evaluateExpression(property.argument)
        )
      } else {
        crashEstree(state, node.position)
      }
    } else {
      // For JSX, the author is responsible of passing in the correct values.
      const name = attribute.name
      /** @type {unknown} */
      let value

      if (attribute.value && typeof attribute.value === 'object') {
        if (
          attribute.value.data &&
          attribute.value.data.estree &&
          state.evaluater
        ) {
          const program = attribute.value.data.estree
          const expression = program.body[0]
          ok(expression.type === 'ExpressionStatement')
          value = state.evaluater.evaluateExpression(expression.expression)
        } else {
          crashEstree(state, node.position)
        }
      } else {
        value = attribute.value === null ? true : attribute.value
      }

      // Assume a prop.
      props[name] = /** @type {Props[keyof Props]} */ (value)
    }
  }

  return props
}

/**
 * Create children.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Parents} node
 *   Current element.
 * @returns {Array<Child>}
 *   Children.
 */
function createChildren(state, node) {
  /** @type {Array<Child>} */
  const children = []
  let index = -1
  /** @type {Map<string, number>} */
  // Note: test this when Solid doesn’t want to merge my upcoming PR.
  /* c8 ignore next */
  const countsByName = state.passKeys ? new Map() : emptyMap

  while (++index < node.children.length) {
    const child = node.children[index]
    /** @type {string | undefined} */
    let key

    if (state.passKeys) {
      const name =
        child.type === 'element'
          ? child.tagName
          : child.type === 'mdxJsxFlowElement' ||
              child.type === 'mdxJsxTextElement'
            ? child.name
            : undefined

      if (name) {
        const count = countsByName.get(name) || 0
        key = name + '-' + count
        countsByName.set(name, count + 1)
      }
    }

    const result = one(state, child, key)
    if (result !== undefined) children.push(result)
  }

  return children
}

/**
 * Handle a property.
 *
 * @param {State} state
 *   Info passed around.
 * @param {string} prop
 *   Key.
 * @param {Array<number | string> | boolean | number | string | null | undefined} value
 *   hast property value.
 * @returns {Field | undefined}
 *   Field for runtime, optional.
 */
function createProperty(state, prop, value) {
  const info = (0,find/* find */.s)(state.schema, prop)

  // Ignore nullish and `NaN` values.
  if (
    value === null ||
    value === undefined ||
    (typeof value === 'number' && Number.isNaN(value))
  ) {
    return
  }

  if (Array.isArray(value)) {
    // Accept `array`.
    // Most props are space-separated.
    value = info.commaSeparated ? (0,comma_separated_tokens/* stringify */.P)(value) : (0,space_separated_tokens/* stringify */.P)(value)
  }

  // React only accepts `style` as object.
  if (info.property === 'style') {
    let styleObject =
      typeof value === 'object' ? value : parseStyle(state, String(value))

    if (state.stylePropertyNameCase === 'css') {
      styleObject = transformStylesToCssCasing(styleObject)
    }

    return ['style', styleObject]
  }

  return [
    state.elementAttributeNameCase === 'react' && info.space
      ? hastToReact[info.property] || info.property
      : info.attribute,
    value
  ]
}

/**
 * Parse a CSS declaration to an object.
 *
 * @param {State} state
 *   Info passed around.
 * @param {string} value
 *   CSS declarations.
 * @returns {Style}
 *   Properties.
 * @throws
 *   Throws `VFileMessage` when CSS cannot be parsed.
 */
function parseStyle(state, value) {
  try {
    return cjs(value, {reactCompat: true})
  } catch (error) {
    if (state.ignoreInvalidStyle) {
      return {}
    }

    const cause = /** @type {Error} */ (error)
    const message = new VFileMessage('Cannot parse `style` attribute', {
      ancestors: state.ancestors,
      cause,
      ruleId: 'style',
      source: 'hast-util-to-jsx-runtime'
    })
    message.file = state.filePath || undefined
    message.url = docs + '#cannot-parse-style-attribute'

    throw message
  }
}

/**
 * Create a JSX name from a string.
 *
 * @param {State} state
 *   To do.
 * @param {string} name
 *   Name.
 * @param {boolean} allowExpression
 *   Allow member expressions and identifiers.
 * @returns {unknown}
 *   To do.
 */
function findComponentFromName(state, name, allowExpression) {
  /** @type {Identifier | Literal | MemberExpression} */
  let result

  if (!allowExpression) {
    result = {type: 'Literal', value: name}
  } else if (name.includes('.')) {
    const identifiers = name.split('.')
    let index = -1
    /** @type {Identifier | Literal | MemberExpression | undefined} */
    let node

    while (++index < identifiers.length) {
      /** @type {Identifier | Literal} */
      const prop = lib_name(identifiers[index])
        ? {type: 'Identifier', name: identifiers[index]}
        : {type: 'Literal', value: identifiers[index]}
      node = node
        ? {
            type: 'MemberExpression',
            object: node,
            property: prop,
            computed: Boolean(index && prop.type === 'Literal'),
            optional: false
          }
        : prop
    }

    ok(node, 'always a result')
    result = node
  } else {
    result =
      lib_name(name) && !/^[a-z]/.test(name)
        ? {type: 'Identifier', name}
        : {type: 'Literal', value: name}
  }

  // Only literals can be passed in `components` currently.
  // No identifiers / member expressions.
  if (result.type === 'Literal') {
    const name = /** @type {string | number} */ (result.value)
    return own.call(state.components, name) ? state.components[name] : name
  }

  // Assume component.
  if (state.evaluater) {
    return state.evaluater.evaluateExpression(result)
  }

  crashEstree(state)
}

/**
 * @param {State} state
 * @param {Position | undefined} [place]
 * @returns {never}
 */
function crashEstree(state, place) {
  const message = new VFileMessage(
    'Cannot handle MDX estrees without `createEvaluater`',
    {
      ancestors: state.ancestors,
      place,
      ruleId: 'mdx-estree',
      source: 'hast-util-to-jsx-runtime'
    }
  )
  message.file = state.filePath || undefined
  message.url = docs + '#cannot-handle-mdx-estrees-without-createevaluater'

  throw message
}

/**
 * Transform a DOM casing style object to a CSS casing style object.
 *
 * @param {Style} domCasing
 * @returns {Style}
 */
function transformStylesToCssCasing(domCasing) {
  /** @type {Style} */
  const cssCasing = {}
  /** @type {string} */
  let from

  for (from in domCasing) {
    if (own.call(domCasing, from)) {
      cssCasing[transformStyleToCssCasing(from)] = domCasing[from]
    }
  }

  return cssCasing
}

/**
 * Transform a DOM casing style field to a CSS casing style field.
 *
 * @param {string} from
 * @returns {string}
 */
function transformStyleToCssCasing(from) {
  let to = from.replace(cap, toDash)
  // Handle `ms-xxx` -> `-ms-xxx`.
  if (to.slice(0, 3) === 'ms-') to = '-' + to
  return to
}

/**
 * Make `$0` dash cased.
 *
 * @param {string} $0
 *   Capitalized ASCII leter.
 * @returns {string}
 *   Dash and lower letter.
 */
function toDash($0) {
  return '-' + $0.toLowerCase()
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/html-url-attributes@3.0.1/node_modules/html-url-attributes/lib/index.js
/**
 * HTML URL properties.
 *
 * Each key is a property name and each value is a list of tag names it applies
 * to or `null` if it applies to all elements.
 *
 * @type {Record<string, Array<string> | null>}
 */
const urlAttributes = {
  action: ['form'],
  cite: ['blockquote', 'del', 'ins', 'q'],
  data: ['object'],
  formAction: ['button', 'input'],
  href: ['a', 'area', 'base', 'link'],
  icon: ['menuitem'],
  itemId: null,
  manifest: ['html'],
  ping: ['a', 'area'],
  poster: ['video'],
  src: [
    'audio',
    'embed',
    'iframe',
    'img',
    'input',
    'script',
    'source',
    'track',
    'video'
  ]
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/react@18.0.0/node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(1999);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react@18.0.0/node_modules/react/index.js
var react = __webpack_require__(6248);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-string@4.0.0/node_modules/mdast-util-to-string/lib/index.js
/**
 * @typedef {import('mdast').Nodes} Nodes
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [includeImageAlt=true]
 *   Whether to use `alt` for `image`s (default: `true`).
 * @property {boolean | null | undefined} [includeHtml=true]
 *   Whether to use `value` of HTML (default: `true`).
 */

/** @type {Options} */
const lib_emptyOptions = {}

/**
 * Get the text content of a node or list of nodes.
 *
 * Prefers the node’s plain-text fields, otherwise serializes its children,
 * and if the given value is an array, serialize the nodes in it.
 *
 * @param {unknown} [value]
 *   Thing to serialize, typically `Node`.
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {string}
 *   Serialized `value`.
 */
function lib_toString(value, options) {
  const settings = options || lib_emptyOptions
  const includeImageAlt =
    typeof settings.includeImageAlt === 'boolean'
      ? settings.includeImageAlt
      : true
  const includeHtml =
    typeof settings.includeHtml === 'boolean' ? settings.includeHtml : true

  return lib_one(value, includeImageAlt, includeHtml)
}

/**
 * One node or several nodes.
 *
 * @param {unknown} value
 *   Thing to serialize.
 * @param {boolean} includeImageAlt
 *   Include image `alt`s.
 * @param {boolean} includeHtml
 *   Include HTML.
 * @returns {string}
 *   Serialized node.
 */
function lib_one(value, includeImageAlt, includeHtml) {
  if (node(value)) {
    if ('value' in value) {
      return value.type === 'html' && !includeHtml ? '' : value.value
    }

    if (includeImageAlt && 'alt' in value && value.alt) {
      return value.alt
    }

    if ('children' in value) {
      return lib_all(value.children, includeImageAlt, includeHtml)
    }
  }

  if (Array.isArray(value)) {
    return lib_all(value, includeImageAlt, includeHtml)
  }

  return ''
}

/**
 * Serialize a list of nodes.
 *
 * @param {Array<unknown>} values
 *   Thing to serialize.
 * @param {boolean} includeImageAlt
 *   Include image `alt`s.
 * @param {boolean} includeHtml
 *   Include HTML.
 * @returns {string}
 *   Serialized nodes.
 */
function lib_all(values, includeImageAlt, includeHtml) {
  /** @type {Array<string>} */
  const result = []
  let index = -1

  while (++index < values.length) {
    result[index] = lib_one(values[index], includeImageAlt, includeHtml)
  }

  return result.join('')
}

/**
 * Check if `value` looks like a node.
 *
 * @param {unknown} value
 *   Thing.
 * @returns {value is Nodes}
 *   Whether `value` is a node.
 */
function node(value) {
  return Boolean(value && typeof value === 'object')
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-util-chunked@2.0.1/node_modules/micromark-util-chunked/index.js
/**
 * Like `Array#splice`, but smarter for giant arrays.
 *
 * `Array#splice` takes all items to be inserted as individual argument which
 * causes a stack overflow in V8 when trying to insert 100k items for instance.
 *
 * Otherwise, this does not return the removed items, and takes `items` as an
 * array instead of rest parameters.
 *
 * @template {unknown} T
 *   Item type.
 * @param {Array<T>} list
 *   List to operate on.
 * @param {number} start
 *   Index to remove/insert at (can be negative).
 * @param {number} remove
 *   Number of items to remove.
 * @param {Array<T>} items
 *   Items to inject into `list`.
 * @returns {undefined}
 *   Nothing.
 */
function splice(list, start, remove, items) {
  const end = list.length;
  let chunkStart = 0;
  /** @type {Array<unknown>} */
  let parameters;

  // Make start between zero and `end` (included).
  if (start < 0) {
    start = -start > end ? 0 : end + start;
  } else {
    start = start > end ? end : start;
  }
  remove = remove > 0 ? remove : 0;

  // No need to chunk the items if there’s only a couple (10k) items.
  if (items.length < 10000) {
    parameters = Array.from(items);
    parameters.unshift(start, remove);
    // @ts-expect-error Hush, it’s fine.
    list.splice(...parameters);
  } else {
    // Delete `remove` items starting from `start`
    if (remove) list.splice(start, remove);

    // Insert the items in chunks to not cause stack overflows.
    while (chunkStart < items.length) {
      parameters = items.slice(chunkStart, chunkStart + 10000);
      parameters.unshift(start, 0);
      // @ts-expect-error Hush, it’s fine.
      list.splice(...parameters);
      chunkStart += 10000;
      start += 10000;
    }
  }
}

/**
 * Append `items` (an array) at the end of `list` (another array).
 * When `list` was empty, returns `items` instead.
 *
 * This prevents a potentially expensive operation when `list` is empty,
 * and adds items in batches to prevent V8 from hanging.
 *
 * @template {unknown} T
 *   Item type.
 * @param {Array<T>} list
 *   List to operate on.
 * @param {Array<T>} items
 *   Items to add to `list`.
 * @returns {Array<T>}
 *   Either `list` or `items`.
 */
function push(list, items) {
  if (list.length > 0) {
    splice(list, list.length, 0, items);
    return list;
  }
  return items;
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-util-subtokenize@2.1.0/node_modules/micromark-util-subtokenize/lib/splice-buffer.js
/**
 * Some of the internal operations of micromark do lots of editing
 * operations on very large arrays. This runs into problems with two
 * properties of most circa-2020 JavaScript interpreters:
 *
 *  - Array-length modifications at the high end of an array (push/pop) are
 *    expected to be common and are implemented in (amortized) time
 *    proportional to the number of elements added or removed, whereas
 *    other operations (shift/unshift and splice) are much less efficient.
 *  - Function arguments are passed on the stack, so adding tens of thousands
 *    of elements to an array with `arr.push(...newElements)` will frequently
 *    cause stack overflows. (see <https://stackoverflow.com/questions/22123769/rangeerror-maximum-call-stack-size-exceeded-why>)
 *
 * SpliceBuffers are an implementation of gap buffers, which are a
 * generalization of the "queue made of two stacks" idea. The splice buffer
 * maintains a cursor, and moving the cursor has cost proportional to the
 * distance the cursor moves, but inserting, deleting, or splicing in
 * new information at the cursor is as efficient as the push/pop operation.
 * This allows for an efficient sequence of splices (or pushes, pops, shifts,
 * or unshifts) as long such edits happen at the same part of the array or
 * generally sweep through the array from the beginning to the end.
 *
 * The interface for splice buffers also supports large numbers of inputs by
 * passing a single array argument rather passing multiple arguments on the
 * function call stack.
 *
 * @template T
 *   Item type.
 */
class SpliceBuffer {
  /**
   * @param {ReadonlyArray<T> | null | undefined} [initial]
   *   Initial items (optional).
   * @returns
   *   Splice buffer.
   */
  constructor(initial) {
    /** @type {Array<T>} */
    this.left = initial ? [...initial] : [];
    /** @type {Array<T>} */
    this.right = [];
  }

  /**
   * Array access;
   * does not move the cursor.
   *
   * @param {number} index
   *   Index.
   * @return {T}
   *   Item.
   */
  get(index) {
    if (index < 0 || index >= this.left.length + this.right.length) {
      throw new RangeError('Cannot access index `' + index + '` in a splice buffer of size `' + (this.left.length + this.right.length) + '`');
    }
    if (index < this.left.length) return this.left[index];
    return this.right[this.right.length - index + this.left.length - 1];
  }

  /**
   * The length of the splice buffer, one greater than the largest index in the
   * array.
   */
  get length() {
    return this.left.length + this.right.length;
  }

  /**
   * Remove and return `list[0]`;
   * moves the cursor to `0`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  shift() {
    this.setCursor(0);
    return this.right.pop();
  }

  /**
   * Slice the buffer to get an array;
   * does not move the cursor.
   *
   * @param {number} start
   *   Start.
   * @param {number | null | undefined} [end]
   *   End (optional).
   * @returns {Array<T>}
   *   Array of items.
   */
  slice(start, end) {
    /** @type {number} */
    const stop = end === null || end === undefined ? Number.POSITIVE_INFINITY : end;
    if (stop < this.left.length) {
      return this.left.slice(start, stop);
    }
    if (start > this.left.length) {
      return this.right.slice(this.right.length - stop + this.left.length, this.right.length - start + this.left.length).reverse();
    }
    return this.left.slice(start).concat(this.right.slice(this.right.length - stop + this.left.length).reverse());
  }

  /**
   * Mimics the behavior of Array.prototype.splice() except for the change of
   * interface necessary to avoid segfaults when patching in very large arrays.
   *
   * This operation moves cursor is moved to `start` and results in the cursor
   * placed after any inserted items.
   *
   * @param {number} start
   *   Start;
   *   zero-based index at which to start changing the array;
   *   negative numbers count backwards from the end of the array and values
   *   that are out-of bounds are clamped to the appropriate end of the array.
   * @param {number | null | undefined} [deleteCount=0]
   *   Delete count (default: `0`);
   *   maximum number of elements to delete, starting from start.
   * @param {Array<T> | null | undefined} [items=[]]
   *   Items to include in place of the deleted items (default: `[]`).
   * @return {Array<T>}
   *   Any removed items.
   */
  splice(start, deleteCount, items) {
    /** @type {number} */
    const count = deleteCount || 0;
    this.setCursor(Math.trunc(start));
    const removed = this.right.splice(this.right.length - count, Number.POSITIVE_INFINITY);
    if (items) chunkedPush(this.left, items);
    return removed.reverse();
  }

  /**
   * Remove and return the highest-numbered item in the array, so
   * `list[list.length - 1]`;
   * Moves the cursor to `length`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  pop() {
    this.setCursor(Number.POSITIVE_INFINITY);
    return this.left.pop();
  }

  /**
   * Inserts a single item to the high-numbered side of the array;
   * moves the cursor to `length`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  push(item) {
    this.setCursor(Number.POSITIVE_INFINITY);
    this.left.push(item);
  }

  /**
   * Inserts many items to the high-numbered side of the array.
   * Moves the cursor to `length`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  pushMany(items) {
    this.setCursor(Number.POSITIVE_INFINITY);
    chunkedPush(this.left, items);
  }

  /**
   * Inserts a single item to the low-numbered side of the array;
   * Moves the cursor to `0`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  unshift(item) {
    this.setCursor(0);
    this.right.push(item);
  }

  /**
   * Inserts many items to the low-numbered side of the array;
   * moves the cursor to `0`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  unshiftMany(items) {
    this.setCursor(0);
    chunkedPush(this.right, items.reverse());
  }

  /**
   * Move the cursor to a specific position in the array. Requires
   * time proportional to the distance moved.
   *
   * If `n < 0`, the cursor will end up at the beginning.
   * If `n > length`, the cursor will end up at the end.
   *
   * @param {number} n
   *   Position.
   * @return {undefined}
   *   Nothing.
   */
  setCursor(n) {
    if (n === this.left.length || n > this.left.length && this.right.length === 0 || n < 0 && this.left.length === 0) return;
    if (n < this.left.length) {
      // Move cursor to the this.left
      const removed = this.left.splice(n, Number.POSITIVE_INFINITY);
      chunkedPush(this.right, removed.reverse());
    } else {
      // Move cursor to the this.right
      const removed = this.right.splice(this.left.length + this.right.length - n, Number.POSITIVE_INFINITY);
      chunkedPush(this.left, removed.reverse());
    }
  }
}

/**
 * Avoid stack overflow by pushing items onto the stack in segments
 *
 * @template T
 *   Item type.
 * @param {Array<T>} list
 *   List to inject into.
 * @param {ReadonlyArray<T>} right
 *   Items to inject.
 * @return {undefined}
 *   Nothing.
 */
function chunkedPush(list, right) {
  /** @type {number} */
  let chunkStart = 0;
  if (right.length < 10000) {
    list.push(...right);
  } else {
    while (chunkStart < right.length) {
      list.push(...right.slice(chunkStart, chunkStart + 10000));
      chunkStart += 10000;
    }
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-util-subtokenize@2.1.0/node_modules/micromark-util-subtokenize/index.js
/**
 * @import {Chunk, Event, Token} from 'micromark-util-types'
 */




// Hidden API exposed for testing.


/**
 * Tokenize subcontent.
 *
 * @param {Array<Event>} eventsArray
 *   List of events.
 * @returns {boolean}
 *   Whether subtokens were found.
 */
// eslint-disable-next-line complexity
function subtokenize(eventsArray) {
  /** @type {Record<string, number>} */
  const jumps = {};
  let index = -1;
  /** @type {Event} */
  let event;
  /** @type {number | undefined} */
  let lineIndex;
  /** @type {number} */
  let otherIndex;
  /** @type {Event} */
  let otherEvent;
  /** @type {Array<Event>} */
  let parameters;
  /** @type {Array<Event>} */
  let subevents;
  /** @type {boolean | undefined} */
  let more;
  const events = new SpliceBuffer(eventsArray);
  while (++index < events.length) {
    while (index in jumps) {
      index = jumps[index];
    }
    event = events.get(index);

    // Add a hook for the GFM tasklist extension, which needs to know if text
    // is in the first content of a list item.
    if (index && event[1].type === "chunkFlow" && events.get(index - 1)[1].type === "listItemPrefix") {
      subevents = event[1]._tokenizer.events;
      otherIndex = 0;
      if (otherIndex < subevents.length && subevents[otherIndex][1].type === "lineEndingBlank") {
        otherIndex += 2;
      }
      if (otherIndex < subevents.length && subevents[otherIndex][1].type === "content") {
        while (++otherIndex < subevents.length) {
          if (subevents[otherIndex][1].type === "content") {
            break;
          }
          if (subevents[otherIndex][1].type === "chunkText") {
            subevents[otherIndex][1]._isInFirstContentOfListItem = true;
            otherIndex++;
          }
        }
      }
    }

    // Enter.
    if (event[0] === 'enter') {
      if (event[1].contentType) {
        Object.assign(jumps, subcontent(events, index));
        index = jumps[index];
        more = true;
      }
    }
    // Exit.
    else if (event[1]._container) {
      otherIndex = index;
      lineIndex = undefined;
      while (otherIndex--) {
        otherEvent = events.get(otherIndex);
        if (otherEvent[1].type === "lineEnding" || otherEvent[1].type === "lineEndingBlank") {
          if (otherEvent[0] === 'enter') {
            if (lineIndex) {
              events.get(lineIndex)[1].type = "lineEndingBlank";
            }
            otherEvent[1].type = "lineEnding";
            lineIndex = otherIndex;
          }
        } else if (otherEvent[1].type === "linePrefix" || otherEvent[1].type === "listItemIndent") {
          // Move past.
        } else {
          break;
        }
      }
      if (lineIndex) {
        // Fix position.
        event[1].end = {
          ...events.get(lineIndex)[1].start
        };

        // Switch container exit w/ line endings.
        parameters = events.slice(lineIndex, index);
        parameters.unshift(event);
        events.splice(lineIndex, index - lineIndex + 1, parameters);
      }
    }
  }

  // The changes to the `events` buffer must be copied back into the eventsArray
  splice(eventsArray, 0, Number.POSITIVE_INFINITY, events.slice(0));
  return !more;
}

/**
 * Tokenize embedded tokens.
 *
 * @param {SpliceBuffer<Event>} events
 *   Events.
 * @param {number} eventIndex
 *   Index.
 * @returns {Record<string, number>}
 *   Gaps.
 */
function subcontent(events, eventIndex) {
  const token = events.get(eventIndex)[1];
  const context = events.get(eventIndex)[2];
  let startPosition = eventIndex - 1;
  /** @type {Array<number>} */
  const startPositions = [];
  let tokenizer = token._tokenizer;
  if (!tokenizer) {
    tokenizer = context.parser[token.contentType](token.start);
    if (token._contentTypeTextTrailing) {
      tokenizer._contentTypeTextTrailing = true;
    }
  }
  const childEvents = tokenizer.events;
  /** @type {Array<[number, number]>} */
  const jumps = [];
  /** @type {Record<string, number>} */
  const gaps = {};
  /** @type {Array<Chunk>} */
  let stream;
  /** @type {Token | undefined} */
  let previous;
  let index = -1;
  /** @type {Token | undefined} */
  let current = token;
  let adjust = 0;
  let start = 0;
  const breaks = [start];

  // Loop forward through the linked tokens to pass them in order to the
  // subtokenizer.
  while (current) {
    // Find the position of the event for this token.
    while (events.get(++startPosition)[1] !== current) {
      // Empty.
    }
    startPositions.push(startPosition);
    if (!current._tokenizer) {
      stream = context.sliceStream(current);
      if (!current.next) {
        stream.push(null);
      }
      if (previous) {
        tokenizer.defineSkip(current.start);
      }
      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = true;
      }
      tokenizer.write(stream);
      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = undefined;
      }
    }

    // Unravel the next token.
    previous = current;
    current = current.next;
  }

  // Now, loop back through all events (and linked tokens), to figure out which
  // parts belong where.
  current = token;
  while (++index < childEvents.length) {
    if (
    // Find a void token that includes a break.
    childEvents[index][0] === 'exit' && childEvents[index - 1][0] === 'enter' && childEvents[index][1].type === childEvents[index - 1][1].type && childEvents[index][1].start.line !== childEvents[index][1].end.line) {
      start = index + 1;
      breaks.push(start);
      // Help GC.
      current._tokenizer = undefined;
      current.previous = undefined;
      current = current.next;
    }
  }

  // Help GC.
  tokenizer.events = [];

  // If there’s one more token (which is the cases for lines that end in an
  // EOF), that’s perfect: the last point we found starts it.
  // If there isn’t then make sure any remaining content is added to it.
  if (current) {
    // Help GC.
    current._tokenizer = undefined;
    current.previous = undefined;
  } else {
    breaks.pop();
  }

  // Now splice the events from the subtokenizer into the current events,
  // moving back to front so that splice indices aren’t affected.
  index = breaks.length;
  while (index--) {
    const slice = childEvents.slice(breaks[index], breaks[index + 1]);
    const start = startPositions.pop();
    jumps.push([start, start + slice.length - 1]);
    events.splice(start, 2, slice);
  }
  jumps.reverse();
  index = -1;
  while (++index < jumps.length) {
    gaps[adjust + jumps[index][0]] = adjust + jumps[index][1];
    adjust += jumps[index][1] - jumps[index][0] - 1;
  }
  return gaps;
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/postprocess.js
/**
 * @import {Event} from 'micromark-util-types'
 */



/**
 * @param {Array<Event>} events
 *   Events.
 * @returns {Array<Event>}
 *   Events.
 */
function postprocess(events) {
  while (!subtokenize(events)) {
    // Empty
  }
  return events;
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-util-combine-extensions@2.0.1/node_modules/micromark-util-combine-extensions/index.js
/**
 * @import {
 *   Extension,
 *   Handles,
 *   HtmlExtension,
 *   NormalizedExtension
 * } from 'micromark-util-types'
 */



const micromark_util_combine_extensions_hasOwnProperty = {}.hasOwnProperty

/**
 * Combine multiple syntax extensions into one.
 *
 * @param {ReadonlyArray<Extension>} extensions
 *   List of syntax extensions.
 * @returns {NormalizedExtension}
 *   A single combined extension.
 */
function combineExtensions(extensions) {
  /** @type {NormalizedExtension} */
  const all = {}
  let index = -1

  while (++index < extensions.length) {
    syntaxExtension(all, extensions[index])
  }

  return all
}

/**
 * Merge `extension` into `all`.
 *
 * @param {NormalizedExtension} all
 *   Extension to merge into.
 * @param {Extension} extension
 *   Extension to merge.
 * @returns {undefined}
 *   Nothing.
 */
function syntaxExtension(all, extension) {
  /** @type {keyof Extension} */
  let hook

  for (hook in extension) {
    const maybe = micromark_util_combine_extensions_hasOwnProperty.call(all, hook) ? all[hook] : undefined
    /** @type {Record<string, unknown>} */
    const left = maybe || (all[hook] = {})
    /** @type {Record<string, unknown> | undefined} */
    const right = extension[hook]
    /** @type {string} */
    let code

    if (right) {
      for (code in right) {
        if (!micromark_util_combine_extensions_hasOwnProperty.call(left, code)) left[code] = []
        const value = right[code]
        constructs(
          // @ts-expect-error Looks like a list.
          left[code],
          Array.isArray(value) ? value : value ? [value] : []
        )
      }
    }
  }
}

/**
 * Merge `list` into `existing` (both lists of constructs).
 * Mutates `existing`.
 *
 * @param {Array<unknown>} existing
 *   List of constructs to merge into.
 * @param {Array<unknown>} list
 *   List of constructs to merge.
 * @returns {undefined}
 *   Nothing.
 */
function constructs(existing, list) {
  let index = -1
  /** @type {Array<unknown>} */
  const before = []

  while (++index < list.length) {
    // @ts-expect-error Looks like an object.
    ;(list[index].add === 'after' ? existing : before).push(list[index])
  }

  splice(existing, 0, 0, before)
}

/**
 * Combine multiple HTML extensions into one.
 *
 * @param {ReadonlyArray<HtmlExtension>} htmlExtensions
 *   List of HTML extensions.
 * @returns {HtmlExtension}
 *   Single combined HTML extension.
 */
function combineHtmlExtensions(htmlExtensions) {
  /** @type {HtmlExtension} */
  const handlers = {}
  let index = -1

  while (++index < htmlExtensions.length) {
    htmlExtension(handlers, htmlExtensions[index])
  }

  return handlers
}

/**
 * Merge `extension` into `all`.
 *
 * @param {HtmlExtension} all
 *   Extension to merge into.
 * @param {HtmlExtension} extension
 *   Extension to merge.
 * @returns {undefined}
 *   Nothing.
 */
function htmlExtension(all, extension) {
  /** @type {keyof HtmlExtension} */
  let hook

  for (hook in extension) {
    const maybe = micromark_util_combine_extensions_hasOwnProperty.call(all, hook) ? all[hook] : undefined
    const left = maybe || (all[hook] = {})
    const right = extension[hook]
    /** @type {keyof Handles} */
    let type

    if (right) {
      for (type in right) {
        // @ts-expect-error assume document vs regular handler are managed correctly.
        left[type] = right[type]
      }
    }
  }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-util-character@2.1.1/node_modules/micromark-util-character/index.js
/**
 * @import {Code} from 'micromark-util-types'
 */

/**
 * Check whether the character code represents an ASCII alpha (`a` through `z`,
 * case insensitive).
 *
 * An **ASCII alpha** is an ASCII upper alpha or ASCII lower alpha.
 *
 * An **ASCII upper alpha** is a character in the inclusive range U+0041 (`A`)
 * to U+005A (`Z`).
 *
 * An **ASCII lower alpha** is a character in the inclusive range U+0061 (`a`)
 * to U+007A (`z`).
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiAlpha = regexCheck(/[A-Za-z]/);

/**
 * Check whether the character code represents an ASCII alphanumeric (`a`
 * through `z`, case insensitive, or `0` through `9`).
 *
 * An **ASCII alphanumeric** is an ASCII digit (see `asciiDigit`) or ASCII alpha
 * (see `asciiAlpha`).
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);

/**
 * Check whether the character code represents an ASCII atext.
 *
 * atext is an ASCII alphanumeric (see `asciiAlphanumeric`), or a character in
 * the inclusive ranges U+0023 NUMBER SIGN (`#`) to U+0027 APOSTROPHE (`'`),
 * U+002A ASTERISK (`*`), U+002B PLUS SIGN (`+`), U+002D DASH (`-`), U+002F
 * SLASH (`/`), U+003D EQUALS TO (`=`), U+003F QUESTION MARK (`?`), U+005E
 * CARET (`^`) to U+0060 GRAVE ACCENT (`` ` ``), or U+007B LEFT CURLY BRACE
 * (`{`) to U+007E TILDE (`~`).
 *
 * See:
 * **\[RFC5322]**:
 * [Internet Message Format](https://tools.ietf.org/html/rfc5322).
 * P. Resnick.
 * IETF.
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);

/**
 * Check whether a character code is an ASCII control character.
 *
 * An **ASCII control** is a character in the inclusive range U+0000 NULL (NUL)
 * to U+001F (US), or U+007F (DEL).
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function asciiControl(code) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    code !== null && (code < 32 || code === 127)
  );
}

/**
 * Check whether the character code represents an ASCII digit (`0` through `9`).
 *
 * An **ASCII digit** is a character in the inclusive range U+0030 (`0`) to
 * U+0039 (`9`).
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiDigit = regexCheck(/\d/);

/**
 * Check whether the character code represents an ASCII hex digit (`a` through
 * `f`, case insensitive, or `0` through `9`).
 *
 * An **ASCII hex digit** is an ASCII digit (see `asciiDigit`), ASCII upper hex
 * digit, or an ASCII lower hex digit.
 *
 * An **ASCII upper hex digit** is a character in the inclusive range U+0041
 * (`A`) to U+0046 (`F`).
 *
 * An **ASCII lower hex digit** is a character in the inclusive range U+0061
 * (`a`) to U+0066 (`f`).
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiHexDigit = regexCheck(/[\dA-Fa-f]/);

/**
 * Check whether the character code represents ASCII punctuation.
 *
 * An **ASCII punctuation** is a character in the inclusive ranges U+0021
 * EXCLAMATION MARK (`!`) to U+002F SLASH (`/`), U+003A COLON (`:`) to U+0040 AT
 * SIGN (`@`), U+005B LEFT SQUARE BRACKET (`[`) to U+0060 GRAVE ACCENT
 * (`` ` ``), or U+007B LEFT CURLY BRACE (`{`) to U+007E TILDE (`~`).
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);

/**
 * Check whether a character code is a markdown line ending.
 *
 * A **markdown line ending** is the virtual characters M-0003 CARRIAGE RETURN
 * LINE FEED (CRLF), M-0004 LINE FEED (LF) and M-0005 CARRIAGE RETURN (CR).
 *
 * In micromark, the actual character U+000A LINE FEED (LF) and U+000D CARRIAGE
 * RETURN (CR) are replaced by these virtual characters depending on whether
 * they occurred together.
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownLineEnding(code) {
  return code !== null && code < -2;
}

/**
 * Check whether a character code is a markdown line ending (see
 * `markdownLineEnding`) or markdown space (see `markdownSpace`).
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownLineEndingOrSpace(code) {
  return code !== null && (code < 0 || code === 32);
}

/**
 * Check whether a character code is a markdown space.
 *
 * A **markdown space** is the concrete character U+0020 SPACE (SP) and the
 * virtual characters M-0001 VIRTUAL SPACE (VS) and M-0002 HORIZONTAL TAB (HT).
 *
 * In micromark, the actual character U+0009 CHARACTER TABULATION (HT) is
 * replaced by one M-0002 HORIZONTAL TAB (HT) and between 0 and 3 M-0001 VIRTUAL
 * SPACE (VS) characters, depending on the column at which the tab occurred.
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownSpace(code) {
  return code === -2 || code === -1 || code === 32;
}

// Size note: removing ASCII from the regex and using `asciiPunctuation` here
// In fact adds to the bundle size.
/**
 * Check whether the character code represents Unicode punctuation.
 *
 * A **Unicode punctuation** is a character in the Unicode `Pc` (Punctuation,
 * Connector), `Pd` (Punctuation, Dash), `Pe` (Punctuation, Close), `Pf`
 * (Punctuation, Final quote), `Pi` (Punctuation, Initial quote), `Po`
 * (Punctuation, Other), or `Ps` (Punctuation, Open) categories, or an ASCII
 * punctuation (see `asciiPunctuation`).
 *
 * See:
 * **\[UNICODE]**:
 * [The Unicode Standard](https://www.unicode.org/versions/).
 * Unicode Consortium.
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const unicodePunctuation = regexCheck(/\p{P}|\p{S}/u);

/**
 * Check whether the character code represents Unicode whitespace.
 *
 * Note that this does handle micromark specific markdown whitespace characters.
 * See `markdownLineEndingOrSpace` to check that.
 *
 * A **Unicode whitespace** is a character in the Unicode `Zs` (Separator,
 * Space) category, or U+0009 CHARACTER TABULATION (HT), U+000A LINE FEED (LF),
 * U+000C (FF), or U+000D CARRIAGE RETURN (CR) (**\[UNICODE]**).
 *
 * See:
 * **\[UNICODE]**:
 * [The Unicode Standard](https://www.unicode.org/versions/).
 * Unicode Consortium.
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const unicodeWhitespace = regexCheck(/\s/);

/**
 * Create a code check from a regex.
 *
 * @param {RegExp} regex
 *   Expression.
 * @returns {(code: Code) => boolean}
 *   Check.
 */
function regexCheck(regex) {
  return check;

  /**
   * Check whether a code matches the bound regex.
   *
   * @param {Code} code
   *   Character code.
   * @returns {boolean}
   *   Whether the character code matches the bound regex.
   */
  function check(code) {
    return code !== null && code > -1 && regex.test(String.fromCharCode(code));
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-factory-space@2.0.1/node_modules/micromark-factory-space/index.js
/**
 * @import {Effects, State, TokenType} from 'micromark-util-types'
 */



// To do: implement `spaceOrTab`, `spaceOrTabMinMax`, `spaceOrTabWithOptions`.

/**
 * Parse spaces and tabs.
 *
 * There is no `nok` parameter:
 *
 * *   spaces in markdown are often optional, in which case this factory can be
 *     used and `ok` will be switched to whether spaces were found or not
 * *   one line ending or space can be detected with `markdownSpace(code)` right
 *     before using `factorySpace`
 *
 * ###### Examples
 *
 * Where `␉` represents a tab (plus how much it expands) and `␠` represents a
 * single space.
 *
 * ```markdown
 * ␉
 * ␠␠␠␠
 * ␉␠
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {TokenType} type
 *   Type (`' \t'`).
 * @param {number | undefined} [max=Infinity]
 *   Max (exclusive).
 * @returns {State}
 *   Start state.
 */
function factorySpace(effects, ok, type, max) {
  const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
  let size = 0;
  return start;

  /** @type {State} */
  function start(code) {
    if (markdownSpace(code)) {
      effects.enter(type);
      return prefix(code);
    }
    return ok(code);
  }

  /** @type {State} */
  function prefix(code) {
    if (markdownSpace(code) && size++ < limit) {
      effects.consume(code);
      return prefix;
    }
    effects.exit(type);
    return ok(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/initialize/content.js
/**
 * @import {
 *   InitialConstruct,
 *   Initializer,
 *   State,
 *   TokenizeContext,
 *   Token
 * } from 'micromark-util-types'
 */



/** @type {InitialConstruct} */
const content = {
  tokenize: initializeContent
};

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Initializer}
 *   Content.
 */
function initializeContent(effects) {
  const contentStart = effects.attempt(this.parser.constructs.contentInitial, afterContentStartConstruct, paragraphInitial);
  /** @type {Token} */
  let previous;
  return contentStart;

  /** @type {State} */
  function afterContentStartConstruct(code) {
    if (code === null) {
      effects.consume(code);
      return;
    }
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return factorySpace(effects, contentStart, "linePrefix");
  }

  /** @type {State} */
  function paragraphInitial(code) {
    effects.enter("paragraph");
    return lineStart(code);
  }

  /** @type {State} */
  function lineStart(code) {
    const token = effects.enter("chunkText", {
      contentType: "text",
      previous
    });
    if (previous) {
      previous.next = token;
    }
    previous = token;
    return data(code);
  }

  /** @type {State} */
  function data(code) {
    if (code === null) {
      effects.exit("chunkText");
      effects.exit("paragraph");
      effects.consume(code);
      return;
    }
    if (markdownLineEnding(code)) {
      effects.consume(code);
      effects.exit("chunkText");
      return lineStart;
    }

    // Data.
    effects.consume(code);
    return data;
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/initialize/document.js
/**
 * @import {
 *   Construct,
 *   ContainerState,
 *   InitialConstruct,
 *   Initializer,
 *   Point,
 *   State,
 *   TokenizeContext,
 *   Tokenizer,
 *   Token
 * } from 'micromark-util-types'
 */

/**
 * @typedef {[Construct, ContainerState]} StackItem
 *   Construct and its state.
 */




/** @type {InitialConstruct} */
const document_document = {
  tokenize: initializeDocument
};

/** @type {Construct} */
const containerConstruct = {
  tokenize: tokenizeContainer
};

/**
 * @this {TokenizeContext}
 *   Self.
 * @type {Initializer}
 *   Initializer.
 */
function initializeDocument(effects) {
  const self = this;
  /** @type {Array<StackItem>} */
  const stack = [];
  let continued = 0;
  /** @type {TokenizeContext | undefined} */
  let childFlow;
  /** @type {Token | undefined} */
  let childToken;
  /** @type {number} */
  let lineStartOffset;
  return start;

  /** @type {State} */
  function start(code) {
    // First we iterate through the open blocks, starting with the root
    // document, and descending through last children down to the last open
    // block.
    // Each block imposes a condition that the line must satisfy if the block is
    // to remain open.
    // For example, a block quote requires a `>` character.
    // A paragraph requires a non-blank line.
    // In this phase we may match all or just some of the open blocks.
    // But we cannot close unmatched blocks yet, because we may have a lazy
    // continuation line.
    if (continued < stack.length) {
      const item = stack[continued];
      self.containerState = item[1];
      return effects.attempt(item[0].continuation, documentContinue, checkNewContainers)(code);
    }

    // Done.
    return checkNewContainers(code);
  }

  /** @type {State} */
  function documentContinue(code) {
    continued++;

    // Note: this field is called `_closeFlow` but it also closes containers.
    // Perhaps a good idea to rename it but it’s already used in the wild by
    // extensions.
    if (self.containerState._closeFlow) {
      self.containerState._closeFlow = undefined;
      if (childFlow) {
        closeFlow();
      }

      // Note: this algorithm for moving events around is similar to the
      // algorithm when dealing with lazy lines in `writeToChild`.
      const indexBeforeExits = self.events.length;
      let indexBeforeFlow = indexBeforeExits;
      /** @type {Point | undefined} */
      let point;

      // Find the flow chunk.
      while (indexBeforeFlow--) {
        if (self.events[indexBeforeFlow][0] === 'exit' && self.events[indexBeforeFlow][1].type === "chunkFlow") {
          point = self.events[indexBeforeFlow][1].end;
          break;
        }
      }
      exitContainers(continued);

      // Fix positions.
      let index = indexBeforeExits;
      while (index < self.events.length) {
        self.events[index][1].end = {
          ...point
        };
        index++;
      }

      // Inject the exits earlier (they’re still also at the end).
      splice(self.events, indexBeforeFlow + 1, 0, self.events.slice(indexBeforeExits));

      // Discard the duplicate exits.
      self.events.length = index;
      return checkNewContainers(code);
    }
    return start(code);
  }

  /** @type {State} */
  function checkNewContainers(code) {
    // Next, after consuming the continuation markers for existing blocks, we
    // look for new block starts (e.g. `>` for a block quote).
    // If we encounter a new block start, we close any blocks unmatched in
    // step 1 before creating the new block as a child of the last matched
    // block.
    if (continued === stack.length) {
      // No need to `check` whether there’s a container, of `exitContainers`
      // would be moot.
      // We can instead immediately `attempt` to parse one.
      if (!childFlow) {
        return documentContinued(code);
      }

      // If we have concrete content, such as block HTML or fenced code,
      // we can’t have containers “pierce” into them, so we can immediately
      // start.
      if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
        return flowStart(code);
      }

      // If we do have flow, it could still be a blank line,
      // but we’d be interrupting it w/ a new container if there’s a current
      // construct.
      // To do: next major: remove `_gfmTableDynamicInterruptHack` (no longer
      // needed in micromark-extension-gfm-table@1.0.6).
      self.interrupt = Boolean(childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack);
    }

    // Check if there is a new container.
    self.containerState = {};
    return effects.check(containerConstruct, thereIsANewContainer, thereIsNoNewContainer)(code);
  }

  /** @type {State} */
  function thereIsANewContainer(code) {
    if (childFlow) closeFlow();
    exitContainers(continued);
    return documentContinued(code);
  }

  /** @type {State} */
  function thereIsNoNewContainer(code) {
    self.parser.lazy[self.now().line] = continued !== stack.length;
    lineStartOffset = self.now().offset;
    return flowStart(code);
  }

  /** @type {State} */
  function documentContinued(code) {
    // Try new containers.
    self.containerState = {};
    return effects.attempt(containerConstruct, containerContinue, flowStart)(code);
  }

  /** @type {State} */
  function containerContinue(code) {
    continued++;
    stack.push([self.currentConstruct, self.containerState]);
    // Try another.
    return documentContinued(code);
  }

  /** @type {State} */
  function flowStart(code) {
    if (code === null) {
      if (childFlow) closeFlow();
      exitContainers(0);
      effects.consume(code);
      return;
    }
    childFlow = childFlow || self.parser.flow(self.now());
    effects.enter("chunkFlow", {
      _tokenizer: childFlow,
      contentType: "flow",
      previous: childToken
    });
    return flowContinue(code);
  }

  /** @type {State} */
  function flowContinue(code) {
    if (code === null) {
      writeToChild(effects.exit("chunkFlow"), true);
      exitContainers(0);
      effects.consume(code);
      return;
    }
    if (markdownLineEnding(code)) {
      effects.consume(code);
      writeToChild(effects.exit("chunkFlow"));
      // Get ready for the next line.
      continued = 0;
      self.interrupt = undefined;
      return start;
    }
    effects.consume(code);
    return flowContinue;
  }

  /**
   * @param {Token} token
   *   Token.
   * @param {boolean | undefined} [endOfFile]
   *   Whether the token is at the end of the file (default: `false`).
   * @returns {undefined}
   *   Nothing.
   */
  function writeToChild(token, endOfFile) {
    const stream = self.sliceStream(token);
    if (endOfFile) stream.push(null);
    token.previous = childToken;
    if (childToken) childToken.next = token;
    childToken = token;
    childFlow.defineSkip(token.start);
    childFlow.write(stream);

    // Alright, so we just added a lazy line:
    //
    // ```markdown
    // > a
    // b.
    //
    // Or:
    //
    // > ~~~c
    // d
    //
    // Or:
    //
    // > | e |
    // f
    // ```
    //
    // The construct in the second example (fenced code) does not accept lazy
    // lines, so it marked itself as done at the end of its first line, and
    // then the content construct parses `d`.
    // Most constructs in markdown match on the first line: if the first line
    // forms a construct, a non-lazy line can’t “unmake” it.
    //
    // The construct in the third example is potentially a GFM table, and
    // those are *weird*.
    // It *could* be a table, from the first line, if the following line
    // matches a condition.
    // In this case, that second line is lazy, which “unmakes” the first line
    // and turns the whole into one content block.
    //
    // We’ve now parsed the non-lazy and the lazy line, and can figure out
    // whether the lazy line started a new flow block.
    // If it did, we exit the current containers between the two flow blocks.
    if (self.parser.lazy[token.start.line]) {
      let index = childFlow.events.length;
      while (index--) {
        if (
        // The token starts before the line ending…
        childFlow.events[index][1].start.offset < lineStartOffset && (
        // …and either is not ended yet…
        !childFlow.events[index][1].end ||
        // …or ends after it.
        childFlow.events[index][1].end.offset > lineStartOffset)) {
          // Exit: there’s still something open, which means it’s a lazy line
          // part of something.
          return;
        }
      }

      // Note: this algorithm for moving events around is similar to the
      // algorithm when closing flow in `documentContinue`.
      const indexBeforeExits = self.events.length;
      let indexBeforeFlow = indexBeforeExits;
      /** @type {boolean | undefined} */
      let seen;
      /** @type {Point | undefined} */
      let point;

      // Find the previous chunk (the one before the lazy line).
      while (indexBeforeFlow--) {
        if (self.events[indexBeforeFlow][0] === 'exit' && self.events[indexBeforeFlow][1].type === "chunkFlow") {
          if (seen) {
            point = self.events[indexBeforeFlow][1].end;
            break;
          }
          seen = true;
        }
      }
      exitContainers(continued);

      // Fix positions.
      index = indexBeforeExits;
      while (index < self.events.length) {
        self.events[index][1].end = {
          ...point
        };
        index++;
      }

      // Inject the exits earlier (they’re still also at the end).
      splice(self.events, indexBeforeFlow + 1, 0, self.events.slice(indexBeforeExits));

      // Discard the duplicate exits.
      self.events.length = index;
    }
  }

  /**
   * @param {number} size
   *   Size.
   * @returns {undefined}
   *   Nothing.
   */
  function exitContainers(size) {
    let index = stack.length;

    // Exit open containers.
    while (index-- > size) {
      const entry = stack[index];
      self.containerState = entry[1];
      entry[0].exit.call(self, effects);
    }
    stack.length = size;
  }
  function closeFlow() {
    childFlow.write([null]);
    childToken = undefined;
    childFlow = undefined;
    self.containerState._closeFlow = undefined;
  }
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 *   Tokenizer.
 */
function tokenizeContainer(effects, ok, nok) {
  // Always populated by defaults.

  return factorySpace(effects, effects.attempt(this.parser.constructs.document, ok, nok), "linePrefix", this.parser.constructs.disable.null.includes('codeIndented') ? undefined : 4);
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/blank-line.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */



/** @type {Construct} */
const blankLine = {
  partial: true,
  tokenize: tokenizeBlankLine
};

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeBlankLine(effects, ok, nok) {
  return start;

  /**
   * Start of blank line.
   *
   * > 👉 **Note**: `␠` represents a space character.
   *
   * ```markdown
   * > | ␠␠␊
   *     ^
   * > | ␊
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    return markdownSpace(code) ? factorySpace(effects, after, "linePrefix")(code) : after(code);
  }

  /**
   * At eof/eol, after optional whitespace.
   *
   * > 👉 **Note**: `␠` represents a space character.
   *
   * ```markdown
   * > | ␠␠␊
   *       ^
   * > | ␊
   *     ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return code === null || markdownLineEnding(code) ? ok(code) : nok(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/content.js
/**
 * @import {
 *   Construct,
 *   Resolver,
 *   State,
 *   TokenizeContext,
 *   Tokenizer,
 *   Token
 * } from 'micromark-util-types'
 */




/**
 * No name because it must not be turned off.
 * @type {Construct}
 */
const content_content = {
  resolve: resolveContent,
  tokenize: tokenizeContent
};

/** @type {Construct} */
const continuationConstruct = {
  partial: true,
  tokenize: tokenizeContinuation
};

/**
 * Content is transparent: it’s parsed right now. That way, definitions are also
 * parsed right now: before text in paragraphs (specifically, media) are parsed.
 *
 * @type {Resolver}
 */
function resolveContent(events) {
  subtokenize(events);
  return events;
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeContent(effects, ok) {
  /** @type {Token | undefined} */
  let previous;
  return chunkStart;

  /**
   * Before a content chunk.
   *
   * ```markdown
   * > | abc
   *     ^
   * ```
   *
   * @type {State}
   */
  function chunkStart(code) {
    effects.enter("content");
    previous = effects.enter("chunkContent", {
      contentType: "content"
    });
    return chunkInside(code);
  }

  /**
   * In a content chunk.
   *
   * ```markdown
   * > | abc
   *     ^^^
   * ```
   *
   * @type {State}
   */
  function chunkInside(code) {
    if (code === null) {
      return contentEnd(code);
    }

    // To do: in `markdown-rs`, each line is parsed on its own, and everything
    // is stitched together resolving.
    if (markdownLineEnding(code)) {
      return effects.check(continuationConstruct, contentContinue, contentEnd)(code);
    }

    // Data.
    effects.consume(code);
    return chunkInside;
  }

  /**
   *
   *
   * @type {State}
   */
  function contentEnd(code) {
    effects.exit("chunkContent");
    effects.exit("content");
    return ok(code);
  }

  /**
   *
   *
   * @type {State}
   */
  function contentContinue(code) {
    effects.consume(code);
    effects.exit("chunkContent");
    previous.next = effects.enter("chunkContent", {
      contentType: "content",
      previous
    });
    previous = previous.next;
    return chunkInside;
  }
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeContinuation(effects, ok, nok) {
  const self = this;
  return startLookahead;

  /**
   *
   *
   * @type {State}
   */
  function startLookahead(code) {
    effects.exit("chunkContent");
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return factorySpace(effects, prefixed, "linePrefix");
  }

  /**
   *
   *
   * @type {State}
   */
  function prefixed(code) {
    if (code === null || markdownLineEnding(code)) {
      return nok(code);
    }

    // Always populated by defaults.

    const tail = self.events[self.events.length - 1];
    if (!self.parser.constructs.disable.null.includes('codeIndented') && tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4) {
      return ok(code);
    }
    return effects.interrupt(self.parser.constructs.flow, nok, ok)(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/initialize/flow.js
/**
 * @import {
 *   InitialConstruct,
 *   Initializer,
 *   State,
 *   TokenizeContext
 * } from 'micromark-util-types'
 */




/** @type {InitialConstruct} */
const flow = {
  tokenize: initializeFlow
};

/**
 * @this {TokenizeContext}
 *   Self.
 * @type {Initializer}
 *   Initializer.
 */
function initializeFlow(effects) {
  const self = this;
  const initial = effects.attempt(
  // Try to parse a blank line.
  blankLine, atBlankEnding,
  // Try to parse initial flow (essentially, only code).
  effects.attempt(this.parser.constructs.flowInitial, afterConstruct, factorySpace(effects, effects.attempt(this.parser.constructs.flow, afterConstruct, effects.attempt(content_content, afterConstruct)), "linePrefix")));
  return initial;

  /** @type {State} */
  function atBlankEnding(code) {
    if (code === null) {
      effects.consume(code);
      return;
    }
    effects.enter("lineEndingBlank");
    effects.consume(code);
    effects.exit("lineEndingBlank");
    self.currentConstruct = undefined;
    return initial;
  }

  /** @type {State} */
  function afterConstruct(code) {
    if (code === null) {
      effects.consume(code);
      return;
    }
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    self.currentConstruct = undefined;
    return initial;
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/initialize/text.js
/**
 * @import {
 *   Code,
 *   InitialConstruct,
 *   Initializer,
 *   Resolver,
 *   State,
 *   TokenizeContext
 * } from 'micromark-util-types'
 */

const resolver = {
  resolveAll: createResolver()
};
const string = initializeFactory('string');
const text_text = initializeFactory('text');

/**
 * @param {'string' | 'text'} field
 *   Field.
 * @returns {InitialConstruct}
 *   Construct.
 */
function initializeFactory(field) {
  return {
    resolveAll: createResolver(field === 'text' ? resolveAllLineSuffixes : undefined),
    tokenize: initializeText
  };

  /**
   * @this {TokenizeContext}
   *   Context.
   * @type {Initializer}
   */
  function initializeText(effects) {
    const self = this;
    const constructs = this.parser.constructs[field];
    const text = effects.attempt(constructs, start, notText);
    return start;

    /** @type {State} */
    function start(code) {
      return atBreak(code) ? text(code) : notText(code);
    }

    /** @type {State} */
    function notText(code) {
      if (code === null) {
        effects.consume(code);
        return;
      }
      effects.enter("data");
      effects.consume(code);
      return data;
    }

    /** @type {State} */
    function data(code) {
      if (atBreak(code)) {
        effects.exit("data");
        return text(code);
      }

      // Data.
      effects.consume(code);
      return data;
    }

    /**
     * @param {Code} code
     *   Code.
     * @returns {boolean}
     *   Whether the code is a break.
     */
    function atBreak(code) {
      if (code === null) {
        return true;
      }
      const list = constructs[code];
      let index = -1;
      if (list) {
        // Always populated by defaults.

        while (++index < list.length) {
          const item = list[index];
          if (!item.previous || item.previous.call(self, self.previous)) {
            return true;
          }
        }
      }
      return false;
    }
  }
}

/**
 * @param {Resolver | undefined} [extraResolver]
 *   Resolver.
 * @returns {Resolver}
 *   Resolver.
 */
function createResolver(extraResolver) {
  return resolveAllText;

  /** @type {Resolver} */
  function resolveAllText(events, context) {
    let index = -1;
    /** @type {number | undefined} */
    let enter;

    // A rather boring computation (to merge adjacent `data` events) which
    // improves mm performance by 29%.
    while (++index <= events.length) {
      if (enter === undefined) {
        if (events[index] && events[index][1].type === "data") {
          enter = index;
          index++;
        }
      } else if (!events[index] || events[index][1].type !== "data") {
        // Don’t do anything if there is one data token.
        if (index !== enter + 2) {
          events[enter][1].end = events[index - 1][1].end;
          events.splice(enter + 2, index - enter - 2);
          index = enter + 2;
        }
        enter = undefined;
      }
    }
    return extraResolver ? extraResolver(events, context) : events;
  }
}

/**
 * A rather ugly set of instructions which again looks at chunks in the input
 * stream.
 * The reason to do this here is that it is *much* faster to parse in reverse.
 * And that we can’t hook into `null` to split the line suffix before an EOF.
 * To do: figure out if we can make this into a clean utility, or even in core.
 * As it will be useful for GFMs literal autolink extension (and maybe even
 * tables?)
 *
 * @type {Resolver}
 */
function resolveAllLineSuffixes(events, context) {
  let eventIndex = 0; // Skip first.

  while (++eventIndex <= events.length) {
    if ((eventIndex === events.length || events[eventIndex][1].type === "lineEnding") && events[eventIndex - 1][1].type === "data") {
      const data = events[eventIndex - 1][1];
      const chunks = context.sliceStream(data);
      let index = chunks.length;
      let bufferIndex = -1;
      let size = 0;
      /** @type {boolean | undefined} */
      let tabs;
      while (index--) {
        const chunk = chunks[index];
        if (typeof chunk === 'string') {
          bufferIndex = chunk.length;
          while (chunk.charCodeAt(bufferIndex - 1) === 32) {
            size++;
            bufferIndex--;
          }
          if (bufferIndex) break;
          bufferIndex = -1;
        }
        // Number
        else if (chunk === -2) {
          tabs = true;
          size++;
        } else if (chunk === -1) {
          // Empty
        } else {
          // Replacement character, exit.
          index++;
          break;
        }
      }

      // Allow final trailing whitespace.
      if (context._contentTypeTextTrailing && eventIndex === events.length) {
        size = 0;
      }
      if (size) {
        const token = {
          type: eventIndex === events.length || tabs || size < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            _bufferIndex: index ? bufferIndex : data.start._bufferIndex + bufferIndex,
            _index: data.start._index + index,
            line: data.end.line,
            column: data.end.column - size,
            offset: data.end.offset - size
          },
          end: {
            ...data.end
          }
        };
        data.end = {
          ...token.start
        };
        if (data.start.offset === data.end.offset) {
          Object.assign(data, token);
        } else {
          events.splice(eventIndex, 0, ['enter', token, context], ['exit', token, context]);
          eventIndex += 2;
        }
      }
      eventIndex++;
    }
  }
  return events;
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/thematic-break.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */



/** @type {Construct} */
const thematicBreak = {
  name: 'thematicBreak',
  tokenize: tokenizeThematicBreak
};

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeThematicBreak(effects, ok, nok) {
  let size = 0;
  /** @type {NonNullable<Code>} */
  let marker;
  return start;

  /**
   * Start of thematic break.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("thematicBreak");
    // To do: parse indent like `markdown-rs`.
    return before(code);
  }

  /**
   * After optional whitespace, at marker.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    marker = code;
    return atBreak(code);
  }

  /**
   * After something, before something else.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === marker) {
      effects.enter("thematicBreakSequence");
      return sequence(code);
    }
    if (size >= 3 && (code === null || markdownLineEnding(code))) {
      effects.exit("thematicBreak");
      return ok(code);
    }
    return nok(code);
  }

  /**
   * In sequence.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequence(code) {
    if (code === marker) {
      effects.consume(code);
      size++;
      return sequence;
    }
    effects.exit("thematicBreakSequence");
    return markdownSpace(code) ? factorySpace(effects, atBreak, "whitespace")(code) : atBreak(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/list.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   Exiter,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */






/** @type {Construct} */
const list = {
  continuation: {
    tokenize: tokenizeListContinuation
  },
  exit: tokenizeListEnd,
  name: 'list',
  tokenize: tokenizeListStart
};

/** @type {Construct} */
const listItemPrefixWhitespaceConstruct = {
  partial: true,
  tokenize: tokenizeListItemPrefixWhitespace
};

/** @type {Construct} */
const indentConstruct = {
  partial: true,
  tokenize: tokenizeIndent
};

// To do: `markdown-rs` parses list items on their own and later stitches them
// together.

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeListStart(effects, ok, nok) {
  const self = this;
  const tail = self.events[self.events.length - 1];
  let initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
  let size = 0;
  return start;

  /** @type {State} */
  function start(code) {
    const kind = self.containerState.type || (code === 42 || code === 43 || code === 45 ? "listUnordered" : "listOrdered");
    if (kind === "listUnordered" ? !self.containerState.marker || code === self.containerState.marker : asciiDigit(code)) {
      if (!self.containerState.type) {
        self.containerState.type = kind;
        effects.enter(kind, {
          _container: true
        });
      }
      if (kind === "listUnordered") {
        effects.enter("listItemPrefix");
        return code === 42 || code === 45 ? effects.check(thematicBreak, nok, atMarker)(code) : atMarker(code);
      }
      if (!self.interrupt || code === 49) {
        effects.enter("listItemPrefix");
        effects.enter("listItemValue");
        return inside(code);
      }
    }
    return nok(code);
  }

  /** @type {State} */
  function inside(code) {
    if (asciiDigit(code) && ++size < 10) {
      effects.consume(code);
      return inside;
    }
    if ((!self.interrupt || size < 2) && (self.containerState.marker ? code === self.containerState.marker : code === 41 || code === 46)) {
      effects.exit("listItemValue");
      return atMarker(code);
    }
    return nok(code);
  }

  /**
   * @type {State}
   **/
  function atMarker(code) {
    effects.enter("listItemMarker");
    effects.consume(code);
    effects.exit("listItemMarker");
    self.containerState.marker = self.containerState.marker || code;
    return effects.check(blankLine,
    // Can’t be empty when interrupting.
    self.interrupt ? nok : onBlank, effects.attempt(listItemPrefixWhitespaceConstruct, endOfPrefix, otherPrefix));
  }

  /** @type {State} */
  function onBlank(code) {
    self.containerState.initialBlankLine = true;
    initialSize++;
    return endOfPrefix(code);
  }

  /** @type {State} */
  function otherPrefix(code) {
    if (markdownSpace(code)) {
      effects.enter("listItemPrefixWhitespace");
      effects.consume(code);
      effects.exit("listItemPrefixWhitespace");
      return endOfPrefix;
    }
    return nok(code);
  }

  /** @type {State} */
  function endOfPrefix(code) {
    self.containerState.size = initialSize + self.sliceSerialize(effects.exit("listItemPrefix"), true).length;
    return ok(code);
  }
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeListContinuation(effects, ok, nok) {
  const self = this;
  self.containerState._closeFlow = undefined;
  return effects.check(blankLine, onBlank, notBlank);

  /** @type {State} */
  function onBlank(code) {
    self.containerState.furtherBlankLines = self.containerState.furtherBlankLines || self.containerState.initialBlankLine;

    // We have a blank line.
    // Still, try to consume at most the items size.
    return factorySpace(effects, ok, "listItemIndent", self.containerState.size + 1)(code);
  }

  /** @type {State} */
  function notBlank(code) {
    if (self.containerState.furtherBlankLines || !markdownSpace(code)) {
      self.containerState.furtherBlankLines = undefined;
      self.containerState.initialBlankLine = undefined;
      return notInCurrentItem(code);
    }
    self.containerState.furtherBlankLines = undefined;
    self.containerState.initialBlankLine = undefined;
    return effects.attempt(indentConstruct, ok, notInCurrentItem)(code);
  }

  /** @type {State} */
  function notInCurrentItem(code) {
    // While we do continue, we signal that the flow should be closed.
    self.containerState._closeFlow = true;
    // As we’re closing flow, we’re no longer interrupting.
    self.interrupt = undefined;
    // Always populated by defaults.

    return factorySpace(effects, effects.attempt(list, ok, nok), "linePrefix", self.parser.constructs.disable.null.includes('codeIndented') ? undefined : 4)(code);
  }
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeIndent(effects, ok, nok) {
  const self = this;
  return factorySpace(effects, afterPrefix, "listItemIndent", self.containerState.size + 1);

  /** @type {State} */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];
    return tail && tail[1].type === "listItemIndent" && tail[2].sliceSerialize(tail[1], true).length === self.containerState.size ? ok(code) : nok(code);
  }
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Exiter}
 */
function tokenizeListEnd(effects) {
  effects.exit(this.containerState.type);
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeListItemPrefixWhitespace(effects, ok, nok) {
  const self = this;

  // Always populated by defaults.

  return factorySpace(effects, afterPrefix, "listItemPrefixWhitespace", self.parser.constructs.disable.null.includes('codeIndented') ? undefined : 4 + 1);

  /** @type {State} */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];
    return !markdownSpace(code) && tail && tail[1].type === "listItemPrefixWhitespace" ? ok(code) : nok(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/block-quote.js
/**
 * @import {
 *   Construct,
 *   Exiter,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */



/** @type {Construct} */
const blockQuote = {
  continuation: {
    tokenize: tokenizeBlockQuoteContinuation
  },
  exit,
  name: 'blockQuote',
  tokenize: tokenizeBlockQuoteStart
};

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeBlockQuoteStart(effects, ok, nok) {
  const self = this;
  return start;

  /**
   * Start of block quote.
   *
   * ```markdown
   * > | > a
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === 62) {
      const state = self.containerState;
      if (!state.open) {
        effects.enter("blockQuote", {
          _container: true
        });
        state.open = true;
      }
      effects.enter("blockQuotePrefix");
      effects.enter("blockQuoteMarker");
      effects.consume(code);
      effects.exit("blockQuoteMarker");
      return after;
    }
    return nok(code);
  }

  /**
   * After `>`, before optional whitespace.
   *
   * ```markdown
   * > | > a
   *      ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    if (markdownSpace(code)) {
      effects.enter("blockQuotePrefixWhitespace");
      effects.consume(code);
      effects.exit("blockQuotePrefixWhitespace");
      effects.exit("blockQuotePrefix");
      return ok;
    }
    effects.exit("blockQuotePrefix");
    return ok(code);
  }
}

/**
 * Start of block quote continuation.
 *
 * ```markdown
 *   | > a
 * > | > b
 *     ^
 * ```
 *
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeBlockQuoteContinuation(effects, ok, nok) {
  const self = this;
  return contStart;

  /**
   * Start of block quote continuation.
   *
   * Also used to parse the first block quote opening.
   *
   * ```markdown
   *   | > a
   * > | > b
   *     ^
   * ```
   *
   * @type {State}
   */
  function contStart(code) {
    if (markdownSpace(code)) {
      // Always populated by defaults.

      return factorySpace(effects, contBefore, "linePrefix", self.parser.constructs.disable.null.includes('codeIndented') ? undefined : 4)(code);
    }
    return contBefore(code);
  }

  /**
   * At `>`, after optional whitespace.
   *
   * Also used to parse the first block quote opening.
   *
   * ```markdown
   *   | > a
   * > | > b
   *     ^
   * ```
   *
   * @type {State}
   */
  function contBefore(code) {
    return effects.attempt(blockQuote, ok, nok)(code);
  }
}

/** @type {Exiter} */
function exit(effects) {
  effects.exit("blockQuote");
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-factory-destination@2.0.1/node_modules/micromark-factory-destination/index.js
/**
 * @import {Effects, State, TokenType} from 'micromark-util-types'
 */


/**
 * Parse destinations.
 *
 * ###### Examples
 *
 * ```markdown
 * <a>
 * <a\>b>
 * <a b>
 * <a)>
 * a
 * a\)b
 * a(b)c
 * a(b)
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type for whole (`<a>` or `b`).
 * @param {TokenType} literalType
 *   Type when enclosed (`<a>`).
 * @param {TokenType} literalMarkerType
 *   Type for enclosing (`<` and `>`).
 * @param {TokenType} rawType
 *   Type when not enclosed (`b`).
 * @param {TokenType} stringType
 *   Type for the value (`a` or `b`).
 * @param {number | undefined} [max=Infinity]
 *   Depth of nested parens (inclusive).
 * @returns {State}
 *   Start state.
 */
function factoryDestination(effects, ok, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
  const limit = max || Number.POSITIVE_INFINITY;
  let balance = 0;
  return start;

  /**
   * Start of destination.
   *
   * ```markdown
   * > | <aa>
   *     ^
   * > | aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === 60) {
      effects.enter(type);
      effects.enter(literalType);
      effects.enter(literalMarkerType);
      effects.consume(code);
      effects.exit(literalMarkerType);
      return enclosedBefore;
    }

    // ASCII control, space, closing paren.
    if (code === null || code === 32 || code === 41 || asciiControl(code)) {
      return nok(code);
    }
    effects.enter(type);
    effects.enter(rawType);
    effects.enter(stringType);
    effects.enter("chunkString", {
      contentType: "string"
    });
    return raw(code);
  }

  /**
   * After `<`, at an enclosed destination.
   *
   * ```markdown
   * > | <aa>
   *      ^
   * ```
   *
   * @type {State}
   */
  function enclosedBefore(code) {
    if (code === 62) {
      effects.enter(literalMarkerType);
      effects.consume(code);
      effects.exit(literalMarkerType);
      effects.exit(literalType);
      effects.exit(type);
      return ok;
    }
    effects.enter(stringType);
    effects.enter("chunkString", {
      contentType: "string"
    });
    return enclosed(code);
  }

  /**
   * In enclosed destination.
   *
   * ```markdown
   * > | <aa>
   *      ^
   * ```
   *
   * @type {State}
   */
  function enclosed(code) {
    if (code === 62) {
      effects.exit("chunkString");
      effects.exit(stringType);
      return enclosedBefore(code);
    }
    if (code === null || code === 60 || markdownLineEnding(code)) {
      return nok(code);
    }
    effects.consume(code);
    return code === 92 ? enclosedEscape : enclosed;
  }

  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | <a\*a>
   *        ^
   * ```
   *
   * @type {State}
   */
  function enclosedEscape(code) {
    if (code === 60 || code === 62 || code === 92) {
      effects.consume(code);
      return enclosed;
    }
    return enclosed(code);
  }

  /**
   * In raw destination.
   *
   * ```markdown
   * > | aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function raw(code) {
    if (!balance && (code === null || code === 41 || markdownLineEndingOrSpace(code))) {
      effects.exit("chunkString");
      effects.exit(stringType);
      effects.exit(rawType);
      effects.exit(type);
      return ok(code);
    }
    if (balance < limit && code === 40) {
      effects.consume(code);
      balance++;
      return raw;
    }
    if (code === 41) {
      effects.consume(code);
      balance--;
      return raw;
    }

    // ASCII control (but *not* `\0`) and space and `(`.
    // Note: in `markdown-rs`, `\0` exists in codes, in `micromark-js` it
    // doesn’t.
    if (code === null || code === 32 || code === 40 || asciiControl(code)) {
      return nok(code);
    }
    effects.consume(code);
    return code === 92 ? rawEscape : raw;
  }

  /**
   * After `\`, at special character.
   *
   * ```markdown
   * > | a\*a
   *       ^
   * ```
   *
   * @type {State}
   */
  function rawEscape(code) {
    if (code === 40 || code === 41 || code === 92) {
      effects.consume(code);
      return raw;
    }
    return raw(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-factory-label@2.0.1/node_modules/micromark-factory-label/index.js
/**
 * @import {
 *   Effects,
 *   State,
 *   TokenizeContext,
 *   TokenType
 * } from 'micromark-util-types'
 */


/**
 * Parse labels.
 *
 * > 👉 **Note**: labels in markdown are capped at 999 characters in the string.
 *
 * ###### Examples
 *
 * ```markdown
 * [a]
 * [a
 * b]
 * [a\]b]
 * ```
 *
 * @this {TokenizeContext}
 *   Tokenize context.
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type of the whole label (`[a]`).
 * @param {TokenType} markerType
 *   Type for the markers (`[` and `]`).
 * @param {TokenType} stringType
 *   Type for the identifier (`a`).
 * @returns {State}
 *   Start state.
 */
function factoryLabel(effects, ok, nok, type, markerType, stringType) {
  const self = this;
  let size = 0;
  /** @type {boolean} */
  let seen;
  return start;

  /**
   * Start of label.
   *
   * ```markdown
   * > | [a]
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter(type);
    effects.enter(markerType);
    effects.consume(code);
    effects.exit(markerType);
    effects.enter(stringType);
    return atBreak;
  }

  /**
   * In label, at something, before something else.
   *
   * ```markdown
   * > | [a]
   *      ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (size > 999 || code === null || code === 91 || code === 93 && !seen ||
    // To do: remove in the future once we’ve switched from
    // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
    // which doesn’t need this.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    code === 94 && !size && '_hiddenFootnoteSupport' in self.parser.constructs) {
      return nok(code);
    }
    if (code === 93) {
      effects.exit(stringType);
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      effects.exit(type);
      return ok;
    }

    // To do: indent? Link chunks and EOLs together?
    if (markdownLineEnding(code)) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return atBreak;
    }
    effects.enter("chunkString", {
      contentType: "string"
    });
    return labelInside(code);
  }

  /**
   * In label, in text.
   *
   * ```markdown
   * > | [a]
   *      ^
   * ```
   *
   * @type {State}
   */
  function labelInside(code) {
    if (code === null || code === 91 || code === 93 || markdownLineEnding(code) || size++ > 999) {
      effects.exit("chunkString");
      return atBreak(code);
    }
    effects.consume(code);
    if (!seen) seen = !markdownSpace(code);
    return code === 92 ? labelEscape : labelInside;
  }

  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | [a\*a]
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEscape(code) {
    if (code === 91 || code === 92 || code === 93) {
      effects.consume(code);
      size++;
      return labelInside;
    }
    return labelInside(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-factory-title@2.0.1/node_modules/micromark-factory-title/index.js
/**
 * @import {
 *   Code,
 *   Effects,
 *   State,
 *   TokenType
 * } from 'micromark-util-types'
 */



/**
 * Parse titles.
 *
 * ###### Examples
 *
 * ```markdown
 * "a"
 * 'b'
 * (c)
 * "a
 * b"
 * 'a
 *     b'
 * (a\)b)
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type of the whole title (`"a"`, `'b'`, `(c)`).
 * @param {TokenType} markerType
 *   Type for the markers (`"`, `'`, `(`, and `)`).
 * @param {TokenType} stringType
 *   Type for the value (`a`).
 * @returns {State}
 *   Start state.
 */
function factoryTitle(effects, ok, nok, type, markerType, stringType) {
  /** @type {NonNullable<Code>} */
  let marker;
  return start;

  /**
   * Start of title.
   *
   * ```markdown
   * > | "a"
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === 34 || code === 39 || code === 40) {
      effects.enter(type);
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      marker = code === 40 ? 41 : code;
      return begin;
    }
    return nok(code);
  }

  /**
   * After opening marker.
   *
   * This is also used at the closing marker.
   *
   * ```markdown
   * > | "a"
   *      ^
   * ```
   *
   * @type {State}
   */
  function begin(code) {
    if (code === marker) {
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      effects.exit(type);
      return ok;
    }
    effects.enter(stringType);
    return atBreak(code);
  }

  /**
   * At something, before something else.
   *
   * ```markdown
   * > | "a"
   *      ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === marker) {
      effects.exit(stringType);
      return begin(marker);
    }
    if (code === null) {
      return nok(code);
    }

    // Note: blank lines can’t exist in content.
    if (markdownLineEnding(code)) {
      // To do: use `space_or_tab_eol_with_options`, connect.
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return factorySpace(effects, atBreak, "linePrefix");
    }
    effects.enter("chunkString", {
      contentType: "string"
    });
    return inside(code);
  }

  /**
   *
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker || code === null || markdownLineEnding(code)) {
      effects.exit("chunkString");
      return atBreak(code);
    }
    effects.consume(code);
    return code === 92 ? escape : inside;
  }

  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | "a\*b"
   *      ^
   * ```
   *
   * @type {State}
   */
  function escape(code) {
    if (code === marker || code === 92) {
      effects.consume(code);
      return inside;
    }
    return inside(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-factory-whitespace@2.0.1/node_modules/micromark-factory-whitespace/index.js
/**
 * @import {Effects, State} from 'micromark-util-types'
 */



/**
 * Parse spaces and tabs.
 *
 * There is no `nok` parameter:
 *
 * *   line endings or spaces in markdown are often optional, in which case this
 *     factory can be used and `ok` will be switched to whether spaces were found
 *     or not
 * *   one line ending or space can be detected with
 *     `markdownLineEndingOrSpace(code)` right before using `factoryWhitespace`
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @returns {State}
 *   Start state.
 */
function factoryWhitespace(effects, ok) {
  /** @type {boolean} */
  let seen;
  return start;

  /** @type {State} */
  function start(code) {
    if (markdownLineEnding(code)) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      seen = true;
      return start;
    }
    if (markdownSpace(code)) {
      return factorySpace(effects, start, seen ? "linePrefix" : "lineSuffix")(code);
    }
    return ok(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-util-normalize-identifier@2.0.1/node_modules/micromark-util-normalize-identifier/index.js
/**
 * Normalize an identifier (as found in references, definitions).
 *
 * Collapses markdown whitespace, trim, and then lower- and uppercase.
 *
 * Some characters are considered “uppercase”, such as U+03F4 (`ϴ`), but if their
 * lowercase counterpart (U+03B8 (`θ`)) is uppercased will result in a different
 * uppercase character (U+0398 (`Θ`)).
 * So, to get a canonical form, we perform both lower- and uppercase.
 *
 * Using uppercase last makes sure keys will never interact with default
 * prototypal values (such as `constructor`): nothing in the prototype of
 * `Object` is uppercase.
 *
 * @param {string} value
 *   Identifier to normalize.
 * @returns {string}
 *   Normalized identifier.
 */
function normalizeIdentifier(value) {
  return value
  // Collapse markdown whitespace.
  .replace(/[\t\n\r ]+/g, " ")
  // Trim.
  .replace(/^ | $/g, '')
  // Some characters are considered “uppercase”, but if their lowercase
  // counterpart is uppercased will result in a different uppercase
  // character.
  // Hence, to get that form, we perform both lower- and uppercase.
  // Upper case makes sure keys will not interact with default prototypal
  // methods: no method is uppercase.
  .toLowerCase().toUpperCase();
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/definition.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */








/** @type {Construct} */
const definition = {
  name: 'definition',
  tokenize: tokenizeDefinition
};

/** @type {Construct} */
const titleBefore = {
  partial: true,
  tokenize: tokenizeTitleBefore
};

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeDefinition(effects, ok, nok) {
  const self = this;
  /** @type {string} */
  let identifier;
  return start;

  /**
   * At start of a definition.
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // Do not interrupt paragraphs (but do follow definitions).
    // To do: do `interrupt` the way `markdown-rs` does.
    // To do: parse whitespace the way `markdown-rs` does.
    effects.enter("definition");
    return before(code);
  }

  /**
   * After optional whitespace, at `[`.
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    // To do: parse whitespace the way `markdown-rs` does.

    return factoryLabel.call(self, effects, labelAfter,
    // Note: we don’t need to reset the way `markdown-rs` does.
    nok, "definitionLabel", "definitionLabelMarker", "definitionLabelString")(code);
  }

  /**
   * After label.
   *
   * ```markdown
   * > | [a]: b "c"
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelAfter(code) {
    identifier = normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1));
    if (code === 58) {
      effects.enter("definitionMarker");
      effects.consume(code);
      effects.exit("definitionMarker");
      return markerAfter;
    }
    return nok(code);
  }

  /**
   * After marker.
   *
   * ```markdown
   * > | [a]: b "c"
   *         ^
   * ```
   *
   * @type {State}
   */
  function markerAfter(code) {
    // Note: whitespace is optional.
    return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, destinationBefore)(code) : destinationBefore(code);
  }

  /**
   * Before destination.
   *
   * ```markdown
   * > | [a]: b "c"
   *          ^
   * ```
   *
   * @type {State}
   */
  function destinationBefore(code) {
    return factoryDestination(effects, destinationAfter,
    // Note: we don’t need to reset the way `markdown-rs` does.
    nok, "definitionDestination", "definitionDestinationLiteral", "definitionDestinationLiteralMarker", "definitionDestinationRaw", "definitionDestinationString")(code);
  }

  /**
   * After destination.
   *
   * ```markdown
   * > | [a]: b "c"
   *           ^
   * ```
   *
   * @type {State}
   */
  function destinationAfter(code) {
    return effects.attempt(titleBefore, after, after)(code);
  }

  /**
   * After definition.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return markdownSpace(code) ? factorySpace(effects, afterWhitespace, "whitespace")(code) : afterWhitespace(code);
  }

  /**
   * After definition, after optional whitespace.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function afterWhitespace(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("definition");

      // Note: we don’t care about uniqueness.
      // It’s likely that that doesn’t happen very frequently.
      // It is more likely that it wastes precious time.
      self.parser.defined.push(identifier);

      // To do: `markdown-rs` interrupt.
      // // You’d be interrupting.
      // tokenizer.interrupt = true
      return ok(code);
    }
    return nok(code);
  }
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeTitleBefore(effects, ok, nok) {
  return titleBefore;

  /**
   * After destination, at whitespace.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *           ^
   * ```
   *
   * @type {State}
   */
  function titleBefore(code) {
    return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, beforeMarker)(code) : nok(code);
  }

  /**
   * At title.
   *
   * ```markdown
   *   | [a]: b
   * > | "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function beforeMarker(code) {
    return factoryTitle(effects, titleAfter, nok, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(code);
  }

  /**
   * After title.
   *
   * ```markdown
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function titleAfter(code) {
    return markdownSpace(code) ? factorySpace(effects, titleAfterOptionalWhitespace, "whitespace")(code) : titleAfterOptionalWhitespace(code);
  }

  /**
   * After title, after optional whitespace.
   *
   * ```markdown
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function titleAfterOptionalWhitespace(code) {
    return code === null || markdownLineEnding(code) ? ok(code) : nok(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/code-indented.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */



/** @type {Construct} */
const codeIndented = {
  name: 'codeIndented',
  tokenize: tokenizeCodeIndented
};

/** @type {Construct} */
const furtherStart = {
  partial: true,
  tokenize: tokenizeFurtherStart
};

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeCodeIndented(effects, ok, nok) {
  const self = this;
  return start;

  /**
   * Start of code (indented).
   *
   * > **Parsing note**: it is not needed to check if this first line is a
   * > filled line (that it has a non-whitespace character), because blank lines
   * > are parsed already, so we never run into that.
   *
   * ```markdown
   * > |     aaa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: manually check if interrupting like `markdown-rs`.

    effects.enter("codeIndented");
    // To do: use an improved `space_or_tab` function like `markdown-rs`,
    // so that we can drop the next state.
    return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code);
  }

  /**
   * At start, after 1 or 4 spaces.
   *
   * ```markdown
   * > |     aaa
   *         ^
   * ```
   *
   * @type {State}
   */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];
    return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? atBreak(code) : nok(code);
  }

  /**
   * At a break.
   *
   * ```markdown
   * > |     aaa
   *         ^  ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === null) {
      return after(code);
    }
    if (markdownLineEnding(code)) {
      return effects.attempt(furtherStart, atBreak, after)(code);
    }
    effects.enter("codeFlowValue");
    return inside(code);
  }

  /**
   * In code content.
   *
   * ```markdown
   * > |     aaa
   *         ^^^^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("codeFlowValue");
      return atBreak(code);
    }
    effects.consume(code);
    return inside;
  }

  /** @type {State} */
  function after(code) {
    effects.exit("codeIndented");
    // To do: allow interrupting like `markdown-rs`.
    // Feel free to interrupt.
    // tokenizer.interrupt = false
    return ok(code);
  }
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeFurtherStart(effects, ok, nok) {
  const self = this;
  return furtherStart;

  /**
   * At eol, trying to parse another indent.
   *
   * ```markdown
   * > |     aaa
   *            ^
   *   |     bbb
   * ```
   *
   * @type {State}
   */
  function furtherStart(code) {
    // To do: improve `lazy` / `pierce` handling.
    // If this is a lazy line, it can’t be code.
    if (self.parser.lazy[self.now().line]) {
      return nok(code);
    }
    if (markdownLineEnding(code)) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return furtherStart;
    }

    // To do: the code here in `micromark-js` is a bit different from
    // `markdown-rs` because there it can attempt spaces.
    // We can’t yet.
    //
    // To do: use an improved `space_or_tab` function like `markdown-rs`,
    // so that we can drop the next state.
    return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code);
  }

  /**
   * At start, after 1 or 4 spaces.
   *
   * ```markdown
   * > |     aaa
   *         ^
   * ```
   *
   * @type {State}
   */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];
    return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? ok(code) : markdownLineEnding(code) ? furtherStart(code) : nok(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/heading-atx.js
/**
 * @import {
 *   Construct,
 *   Resolver,
 *   State,
 *   TokenizeContext,
 *   Tokenizer,
 *   Token
 * } from 'micromark-util-types'
 */




/** @type {Construct} */
const headingAtx = {
  name: 'headingAtx',
  resolve: resolveHeadingAtx,
  tokenize: tokenizeHeadingAtx
};

/** @type {Resolver} */
function resolveHeadingAtx(events, context) {
  let contentEnd = events.length - 2;
  let contentStart = 3;
  /** @type {Token} */
  let content;
  /** @type {Token} */
  let text;

  // Prefix whitespace, part of the opening.
  if (events[contentStart][1].type === "whitespace") {
    contentStart += 2;
  }

  // Suffix whitespace, part of the closing.
  if (contentEnd - 2 > contentStart && events[contentEnd][1].type === "whitespace") {
    contentEnd -= 2;
  }
  if (events[contentEnd][1].type === "atxHeadingSequence" && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === "whitespace")) {
    contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
  }
  if (contentEnd > contentStart) {
    content = {
      type: "atxHeadingText",
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end
    };
    text = {
      type: "chunkText",
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end,
      contentType: "text"
    };
    splice(events, contentStart, contentEnd - contentStart + 1, [['enter', content, context], ['enter', text, context], ['exit', text, context], ['exit', content, context]]);
  }
  return events;
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeHeadingAtx(effects, ok, nok) {
  let size = 0;
  return start;

  /**
   * Start of a heading (atx).
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: parse indent like `markdown-rs`.
    effects.enter("atxHeading");
    return before(code);
  }

  /**
   * After optional whitespace, at `#`.
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    effects.enter("atxHeadingSequence");
    return sequenceOpen(code);
  }

  /**
   * In opening sequence.
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === 35 && size++ < 6) {
      effects.consume(code);
      return sequenceOpen;
    }

    // Always at least one `#`.
    if (code === null || markdownLineEndingOrSpace(code)) {
      effects.exit("atxHeadingSequence");
      return atBreak(code);
    }
    return nok(code);
  }

  /**
   * After something, before something else.
   *
   * ```markdown
   * > | ## aa
   *       ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === 35) {
      effects.enter("atxHeadingSequence");
      return sequenceFurther(code);
    }
    if (code === null || markdownLineEnding(code)) {
      effects.exit("atxHeading");
      // To do: interrupt like `markdown-rs`.
      // // Feel free to interrupt.
      // tokenizer.interrupt = false
      return ok(code);
    }
    if (markdownSpace(code)) {
      return factorySpace(effects, atBreak, "whitespace")(code);
    }

    // To do: generate `data` tokens, add the `text` token later.
    // Needs edit map, see: `markdown.rs`.
    effects.enter("atxHeadingText");
    return data(code);
  }

  /**
   * In further sequence (after whitespace).
   *
   * Could be normal “visible” hashes in the heading or a final sequence.
   *
   * ```markdown
   * > | ## aa ##
   *           ^
   * ```
   *
   * @type {State}
   */
  function sequenceFurther(code) {
    if (code === 35) {
      effects.consume(code);
      return sequenceFurther;
    }
    effects.exit("atxHeadingSequence");
    return atBreak(code);
  }

  /**
   * In text.
   *
   * ```markdown
   * > | ## aa
   *        ^
   * ```
   *
   * @type {State}
   */
  function data(code) {
    if (code === null || code === 35 || markdownLineEndingOrSpace(code)) {
      effects.exit("atxHeadingText");
      return atBreak(code);
    }
    effects.consume(code);
    return data;
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/setext-underline.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   Resolver,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */



/** @type {Construct} */
const setextUnderline = {
  name: 'setextUnderline',
  resolveTo: resolveToSetextUnderline,
  tokenize: tokenizeSetextUnderline
};

/** @type {Resolver} */
function resolveToSetextUnderline(events, context) {
  // To do: resolve like `markdown-rs`.
  let index = events.length;
  /** @type {number | undefined} */
  let content;
  /** @type {number | undefined} */
  let text;
  /** @type {number | undefined} */
  let definition;

  // Find the opening of the content.
  // It’ll always exist: we don’t tokenize if it isn’t there.
  while (index--) {
    if (events[index][0] === 'enter') {
      if (events[index][1].type === "content") {
        content = index;
        break;
      }
      if (events[index][1].type === "paragraph") {
        text = index;
      }
    }
    // Exit
    else {
      if (events[index][1].type === "content") {
        // Remove the content end (if needed we’ll add it later)
        events.splice(index, 1);
      }
      if (!definition && events[index][1].type === "definition") {
        definition = index;
      }
    }
  }
  const heading = {
    type: "setextHeading",
    start: {
      ...events[content][1].start
    },
    end: {
      ...events[events.length - 1][1].end
    }
  };

  // Change the paragraph to setext heading text.
  events[text][1].type = "setextHeadingText";

  // If we have definitions in the content, we’ll keep on having content,
  // but we need move it.
  if (definition) {
    events.splice(text, 0, ['enter', heading, context]);
    events.splice(definition + 1, 0, ['exit', events[content][1], context]);
    events[content][1].end = {
      ...events[definition][1].end
    };
  } else {
    events[content][1] = heading;
  }

  // Add the heading exit at the end.
  events.push(['exit', heading, context]);
  return events;
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeSetextUnderline(effects, ok, nok) {
  const self = this;
  /** @type {NonNullable<Code>} */
  let marker;
  return start;

  /**
   * At start of heading (setext) underline.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    let index = self.events.length;
    /** @type {boolean | undefined} */
    let paragraph;
    // Find an opening.
    while (index--) {
      // Skip enter/exit of line ending, line prefix, and content.
      // We can now either have a definition or a paragraph.
      if (self.events[index][1].type !== "lineEnding" && self.events[index][1].type !== "linePrefix" && self.events[index][1].type !== "content") {
        paragraph = self.events[index][1].type === "paragraph";
        break;
      }
    }

    // To do: handle lazy/pierce like `markdown-rs`.
    // To do: parse indent like `markdown-rs`.
    if (!self.parser.lazy[self.now().line] && (self.interrupt || paragraph)) {
      effects.enter("setextHeadingLine");
      marker = code;
      return before(code);
    }
    return nok(code);
  }

  /**
   * After optional whitespace, at `-` or `=`.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    effects.enter("setextHeadingLineSequence");
    return inside(code);
  }

  /**
   * In sequence.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker) {
      effects.consume(code);
      return inside;
    }
    effects.exit("setextHeadingLineSequence");
    return markdownSpace(code) ? factorySpace(effects, after, "lineSuffix")(code) : after(code);
  }

  /**
   * After sequence, after optional whitespace.
   *
   * ```markdown
   *   | aa
   * > | ==
   *       ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("setextHeadingLine");
      return ok(code);
    }
    return nok(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-util-html-tag-name@2.0.1/node_modules/micromark-util-html-tag-name/index.js
/**
 * List of lowercase HTML “block” tag names.
 *
 * The list, when parsing HTML (flow), results in more relaxed rules (condition
 * 6).
 * Because they are known blocks, the HTML-like syntax doesn’t have to be
 * strictly parsed.
 * For tag names not in this list, a more strict algorithm (condition 7) is used
 * to detect whether the HTML-like syntax is seen as HTML (flow) or not.
 *
 * This is copied from:
 * <https://spec.commonmark.org/0.30/#html-blocks>.
 *
 * > 👉 **Note**: `search` was added in `CommonMark@0.31`.
 */
const htmlBlockNames = [
  'address',
  'article',
  'aside',
  'base',
  'basefont',
  'blockquote',
  'body',
  'caption',
  'center',
  'col',
  'colgroup',
  'dd',
  'details',
  'dialog',
  'dir',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'frame',
  'frameset',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'iframe',
  'legend',
  'li',
  'link',
  'main',
  'menu',
  'menuitem',
  'nav',
  'noframes',
  'ol',
  'optgroup',
  'option',
  'p',
  'param',
  'search',
  'section',
  'summary',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'title',
  'tr',
  'track',
  'ul'
]

/**
 * List of lowercase HTML “raw” tag names.
 *
 * The list, when parsing HTML (flow), results in HTML that can include lines
 * without exiting, until a closing tag also in this list is found (condition
 * 1).
 *
 * This module is copied from:
 * <https://spec.commonmark.org/0.30/#html-blocks>.
 *
 * > 👉 **Note**: `textarea` was added in `CommonMark@0.30`.
 */
const htmlRawNames = ['pre', 'script', 'style', 'textarea']

;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/html-flow.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   Resolver,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */





/** @type {Construct} */
const htmlFlow = {
  concrete: true,
  name: 'htmlFlow',
  resolveTo: resolveToHtmlFlow,
  tokenize: tokenizeHtmlFlow
};

/** @type {Construct} */
const blankLineBefore = {
  partial: true,
  tokenize: tokenizeBlankLineBefore
};
const nonLazyContinuationStart = {
  partial: true,
  tokenize: tokenizeNonLazyContinuationStart
};

/** @type {Resolver} */
function resolveToHtmlFlow(events) {
  let index = events.length;
  while (index--) {
    if (events[index][0] === 'enter' && events[index][1].type === "htmlFlow") {
      break;
    }
  }
  if (index > 1 && events[index - 2][1].type === "linePrefix") {
    // Add the prefix start to the HTML token.
    events[index][1].start = events[index - 2][1].start;
    // Add the prefix start to the HTML line token.
    events[index + 1][1].start = events[index - 2][1].start;
    // Remove the line prefix.
    events.splice(index - 2, 2);
  }
  return events;
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeHtmlFlow(effects, ok, nok) {
  const self = this;
  /** @type {number} */
  let marker;
  /** @type {boolean} */
  let closingTag;
  /** @type {string} */
  let buffer;
  /** @type {number} */
  let index;
  /** @type {Code} */
  let markerB;
  return start;

  /**
   * Start of HTML (flow).
   *
   * ```markdown
   * > | <x />
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: parse indent like `markdown-rs`.
    return before(code);
  }

  /**
   * At `<`, after optional whitespace.
   *
   * ```markdown
   * > | <x />
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    effects.enter("htmlFlow");
    effects.enter("htmlFlowData");
    effects.consume(code);
    return open;
  }

  /**
   * After `<`, at tag name or other stuff.
   *
   * ```markdown
   * > | <x />
   *      ^
   * > | <!doctype>
   *      ^
   * > | <!--xxx-->
   *      ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 33) {
      effects.consume(code);
      return declarationOpen;
    }
    if (code === 47) {
      effects.consume(code);
      closingTag = true;
      return tagCloseStart;
    }
    if (code === 63) {
      effects.consume(code);
      marker = 3;
      // To do:
      // tokenizer.concrete = true
      // To do: use `markdown-rs` style interrupt.
      // While we’re in an instruction instead of a declaration, we’re on a `?`
      // right now, so we do need to search for `>`, similar to declarations.
      return self.interrupt ? ok : continuationDeclarationInside;
    }

    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      // Always the case.
      effects.consume(code);
      buffer = String.fromCharCode(code);
      return tagName;
    }
    return nok(code);
  }

  /**
   * After `<!`, at declaration, comment, or CDATA.
   *
   * ```markdown
   * > | <!doctype>
   *       ^
   * > | <!--xxx-->
   *       ^
   * > | <![CDATA[>&<]]>
   *       ^
   * ```
   *
   * @type {State}
   */
  function declarationOpen(code) {
    if (code === 45) {
      effects.consume(code);
      marker = 2;
      return commentOpenInside;
    }
    if (code === 91) {
      effects.consume(code);
      marker = 5;
      index = 0;
      return cdataOpenInside;
    }

    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      effects.consume(code);
      marker = 4;
      // // Do not form containers.
      // tokenizer.concrete = true
      return self.interrupt ? ok : continuationDeclarationInside;
    }
    return nok(code);
  }

  /**
   * After `<!-`, inside a comment, at another `-`.
   *
   * ```markdown
   * > | <!--xxx-->
   *        ^
   * ```
   *
   * @type {State}
   */
  function commentOpenInside(code) {
    if (code === 45) {
      effects.consume(code);
      // // Do not form containers.
      // tokenizer.concrete = true
      return self.interrupt ? ok : continuationDeclarationInside;
    }
    return nok(code);
  }

  /**
   * After `<![`, inside CDATA, expecting `CDATA[`.
   *
   * ```markdown
   * > | <![CDATA[>&<]]>
   *        ^^^^^^
   * ```
   *
   * @type {State}
   */
  function cdataOpenInside(code) {
    const value = "CDATA[";
    if (code === value.charCodeAt(index++)) {
      effects.consume(code);
      if (index === value.length) {
        // // Do not form containers.
        // tokenizer.concrete = true
        return self.interrupt ? ok : continuation;
      }
      return cdataOpenInside;
    }
    return nok(code);
  }

  /**
   * After `</`, in closing tag, at tag name.
   *
   * ```markdown
   * > | </x>
   *       ^
   * ```
   *
   * @type {State}
   */
  function tagCloseStart(code) {
    if (asciiAlpha(code)) {
      // Always the case.
      effects.consume(code);
      buffer = String.fromCharCode(code);
      return tagName;
    }
    return nok(code);
  }

  /**
   * In tag name.
   *
   * ```markdown
   * > | <ab>
   *      ^^
   * > | </ab>
   *       ^^
   * ```
   *
   * @type {State}
   */
  function tagName(code) {
    if (code === null || code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
      const slash = code === 47;
      const name = buffer.toLowerCase();
      if (!slash && !closingTag && htmlRawNames.includes(name)) {
        marker = 1;
        // // Do not form containers.
        // tokenizer.concrete = true
        return self.interrupt ? ok(code) : continuation(code);
      }
      if (htmlBlockNames.includes(buffer.toLowerCase())) {
        marker = 6;
        if (slash) {
          effects.consume(code);
          return basicSelfClosing;
        }

        // // Do not form containers.
        // tokenizer.concrete = true
        return self.interrupt ? ok(code) : continuation(code);
      }
      marker = 7;
      // Do not support complete HTML when interrupting.
      return self.interrupt && !self.parser.lazy[self.now().line] ? nok(code) : closingTag ? completeClosingTagAfter(code) : completeAttributeNameBefore(code);
    }

    // ASCII alphanumerical and `-`.
    if (code === 45 || asciiAlphanumeric(code)) {
      effects.consume(code);
      buffer += String.fromCharCode(code);
      return tagName;
    }
    return nok(code);
  }

  /**
   * After closing slash of a basic tag name.
   *
   * ```markdown
   * > | <div/>
   *          ^
   * ```
   *
   * @type {State}
   */
  function basicSelfClosing(code) {
    if (code === 62) {
      effects.consume(code);
      // // Do not form containers.
      // tokenizer.concrete = true
      return self.interrupt ? ok : continuation;
    }
    return nok(code);
  }

  /**
   * After closing slash of a complete tag name.
   *
   * ```markdown
   * > | <x/>
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeClosingTagAfter(code) {
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeClosingTagAfter;
    }
    return completeEnd(code);
  }

  /**
   * At an attribute name.
   *
   * At first, this state is used after a complete tag name, after whitespace,
   * where it expects optional attributes or the end of the tag.
   * It is also reused after attributes, when expecting more optional
   * attributes.
   *
   * ```markdown
   * > | <a />
   *        ^
   * > | <a :b>
   *        ^
   * > | <a _b>
   *        ^
   * > | <a b>
   *        ^
   * > | <a >
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeNameBefore(code) {
    if (code === 47) {
      effects.consume(code);
      return completeEnd;
    }

    // ASCII alphanumerical and `:` and `_`.
    if (code === 58 || code === 95 || asciiAlpha(code)) {
      effects.consume(code);
      return completeAttributeName;
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeNameBefore;
    }
    return completeEnd(code);
  }

  /**
   * In attribute name.
   *
   * ```markdown
   * > | <a :b>
   *         ^
   * > | <a _b>
   *         ^
   * > | <a b>
   *         ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeName(code) {
    // ASCII alphanumerical and `-`, `.`, `:`, and `_`.
    if (code === 45 || code === 46 || code === 58 || code === 95 || asciiAlphanumeric(code)) {
      effects.consume(code);
      return completeAttributeName;
    }
    return completeAttributeNameAfter(code);
  }

  /**
   * After attribute name, at an optional initializer, the end of the tag, or
   * whitespace.
   *
   * ```markdown
   * > | <a b>
   *         ^
   * > | <a b=c>
   *         ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeNameAfter(code) {
    if (code === 61) {
      effects.consume(code);
      return completeAttributeValueBefore;
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeNameAfter;
    }
    return completeAttributeNameBefore(code);
  }

  /**
   * Before unquoted, double quoted, or single quoted attribute value, allowing
   * whitespace.
   *
   * ```markdown
   * > | <a b=c>
   *          ^
   * > | <a b="c">
   *          ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueBefore(code) {
    if (code === null || code === 60 || code === 61 || code === 62 || code === 96) {
      return nok(code);
    }
    if (code === 34 || code === 39) {
      effects.consume(code);
      markerB = code;
      return completeAttributeValueQuoted;
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeValueBefore;
    }
    return completeAttributeValueUnquoted(code);
  }

  /**
   * In double or single quoted attribute value.
   *
   * ```markdown
   * > | <a b="c">
   *           ^
   * > | <a b='c'>
   *           ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueQuoted(code) {
    if (code === markerB) {
      effects.consume(code);
      markerB = null;
      return completeAttributeValueQuotedAfter;
    }
    if (code === null || markdownLineEnding(code)) {
      return nok(code);
    }
    effects.consume(code);
    return completeAttributeValueQuoted;
  }

  /**
   * In unquoted attribute value.
   *
   * ```markdown
   * > | <a b=c>
   *          ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueUnquoted(code) {
    if (code === null || code === 34 || code === 39 || code === 47 || code === 60 || code === 61 || code === 62 || code === 96 || markdownLineEndingOrSpace(code)) {
      return completeAttributeNameAfter(code);
    }
    effects.consume(code);
    return completeAttributeValueUnquoted;
  }

  /**
   * After double or single quoted attribute value, before whitespace or the
   * end of the tag.
   *
   * ```markdown
   * > | <a b="c">
   *            ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueQuotedAfter(code) {
    if (code === 47 || code === 62 || markdownSpace(code)) {
      return completeAttributeNameBefore(code);
    }
    return nok(code);
  }

  /**
   * In certain circumstances of a complete tag where only an `>` is allowed.
   *
   * ```markdown
   * > | <a b="c">
   *             ^
   * ```
   *
   * @type {State}
   */
  function completeEnd(code) {
    if (code === 62) {
      effects.consume(code);
      return completeAfter;
    }
    return nok(code);
  }

  /**
   * After `>` in a complete tag.
   *
   * ```markdown
   * > | <x>
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeAfter(code) {
    if (code === null || markdownLineEnding(code)) {
      // // Do not form containers.
      // tokenizer.concrete = true
      return continuation(code);
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAfter;
    }
    return nok(code);
  }

  /**
   * In continuation of any HTML kind.
   *
   * ```markdown
   * > | <!--xxx-->
   *          ^
   * ```
   *
   * @type {State}
   */
  function continuation(code) {
    if (code === 45 && marker === 2) {
      effects.consume(code);
      return continuationCommentInside;
    }
    if (code === 60 && marker === 1) {
      effects.consume(code);
      return continuationRawTagOpen;
    }
    if (code === 62 && marker === 4) {
      effects.consume(code);
      return continuationClose;
    }
    if (code === 63 && marker === 3) {
      effects.consume(code);
      return continuationDeclarationInside;
    }
    if (code === 93 && marker === 5) {
      effects.consume(code);
      return continuationCdataInside;
    }
    if (markdownLineEnding(code) && (marker === 6 || marker === 7)) {
      effects.exit("htmlFlowData");
      return effects.check(blankLineBefore, continuationAfter, continuationStart)(code);
    }
    if (code === null || markdownLineEnding(code)) {
      effects.exit("htmlFlowData");
      return continuationStart(code);
    }
    effects.consume(code);
    return continuation;
  }

  /**
   * In continuation, at eol.
   *
   * ```markdown
   * > | <x>
   *        ^
   *   | asd
   * ```
   *
   * @type {State}
   */
  function continuationStart(code) {
    return effects.check(nonLazyContinuationStart, continuationStartNonLazy, continuationAfter)(code);
  }

  /**
   * In continuation, at eol, before non-lazy content.
   *
   * ```markdown
   * > | <x>
   *        ^
   *   | asd
   * ```
   *
   * @type {State}
   */
  function continuationStartNonLazy(code) {
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return continuationBefore;
  }

  /**
   * In continuation, before non-lazy content.
   *
   * ```markdown
   *   | <x>
   * > | asd
   *     ^
   * ```
   *
   * @type {State}
   */
  function continuationBefore(code) {
    if (code === null || markdownLineEnding(code)) {
      return continuationStart(code);
    }
    effects.enter("htmlFlowData");
    return continuation(code);
  }

  /**
   * In comment continuation, after one `-`, expecting another.
   *
   * ```markdown
   * > | <!--xxx-->
   *             ^
   * ```
   *
   * @type {State}
   */
  function continuationCommentInside(code) {
    if (code === 45) {
      effects.consume(code);
      return continuationDeclarationInside;
    }
    return continuation(code);
  }

  /**
   * In raw continuation, after `<`, at `/`.
   *
   * ```markdown
   * > | <script>console.log(1)</script>
   *                            ^
   * ```
   *
   * @type {State}
   */
  function continuationRawTagOpen(code) {
    if (code === 47) {
      effects.consume(code);
      buffer = '';
      return continuationRawEndTag;
    }
    return continuation(code);
  }

  /**
   * In raw continuation, after `</`, in a raw tag name.
   *
   * ```markdown
   * > | <script>console.log(1)</script>
   *                             ^^^^^^
   * ```
   *
   * @type {State}
   */
  function continuationRawEndTag(code) {
    if (code === 62) {
      const name = buffer.toLowerCase();
      if (htmlRawNames.includes(name)) {
        effects.consume(code);
        return continuationClose;
      }
      return continuation(code);
    }
    if (asciiAlpha(code) && buffer.length < 8) {
      // Always the case.
      effects.consume(code);
      buffer += String.fromCharCode(code);
      return continuationRawEndTag;
    }
    return continuation(code);
  }

  /**
   * In cdata continuation, after `]`, expecting `]>`.
   *
   * ```markdown
   * > | <![CDATA[>&<]]>
   *                  ^
   * ```
   *
   * @type {State}
   */
  function continuationCdataInside(code) {
    if (code === 93) {
      effects.consume(code);
      return continuationDeclarationInside;
    }
    return continuation(code);
  }

  /**
   * In declaration or instruction continuation, at `>`.
   *
   * ```markdown
   * > | <!-->
   *         ^
   * > | <?>
   *       ^
   * > | <!q>
   *        ^
   * > | <!--ab-->
   *             ^
   * > | <![CDATA[>&<]]>
   *                   ^
   * ```
   *
   * @type {State}
   */
  function continuationDeclarationInside(code) {
    if (code === 62) {
      effects.consume(code);
      return continuationClose;
    }

    // More dashes.
    if (code === 45 && marker === 2) {
      effects.consume(code);
      return continuationDeclarationInside;
    }
    return continuation(code);
  }

  /**
   * In closed continuation: everything we get until the eol/eof is part of it.
   *
   * ```markdown
   * > | <!doctype>
   *               ^
   * ```
   *
   * @type {State}
   */
  function continuationClose(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("htmlFlowData");
      return continuationAfter(code);
    }
    effects.consume(code);
    return continuationClose;
  }

  /**
   * Done.
   *
   * ```markdown
   * > | <!doctype>
   *               ^
   * ```
   *
   * @type {State}
   */
  function continuationAfter(code) {
    effects.exit("htmlFlow");
    // // Feel free to interrupt.
    // tokenizer.interrupt = false
    // // No longer concrete.
    // tokenizer.concrete = false
    return ok(code);
  }
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeNonLazyContinuationStart(effects, ok, nok) {
  const self = this;
  return start;

  /**
   * At eol, before continuation.
   *
   * ```markdown
   * > | * ```js
   *            ^
   *   | b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (markdownLineEnding(code)) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return after;
    }
    return nok(code);
  }

  /**
   * A continuation.
   *
   * ```markdown
   *   | * ```js
   * > | b
   *     ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
  }
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeBlankLineBefore(effects, ok, nok) {
  return start;

  /**
   * Before eol, expecting blank line.
   *
   * ```markdown
   * > | <div>
   *          ^
   *   |
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return effects.attempt(blankLine, ok, nok);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/code-fenced.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */



/** @type {Construct} */
const nonLazyContinuation = {
  partial: true,
  tokenize: tokenizeNonLazyContinuation
};

/** @type {Construct} */
const codeFenced = {
  concrete: true,
  name: 'codeFenced',
  tokenize: tokenizeCodeFenced
};

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeCodeFenced(effects, ok, nok) {
  const self = this;
  /** @type {Construct} */
  const closeStart = {
    partial: true,
    tokenize: tokenizeCloseStart
  };
  let initialPrefix = 0;
  let sizeOpen = 0;
  /** @type {NonNullable<Code>} */
  let marker;
  return start;

  /**
   * Start of code.
   *
   * ```markdown
   * > | ~~~js
   *     ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: parse whitespace like `markdown-rs`.
    return beforeSequenceOpen(code);
  }

  /**
   * In opening fence, after prefix, at sequence.
   *
   * ```markdown
   * > | ~~~js
   *     ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function beforeSequenceOpen(code) {
    const tail = self.events[self.events.length - 1];
    initialPrefix = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
    marker = code;
    effects.enter("codeFenced");
    effects.enter("codeFencedFence");
    effects.enter("codeFencedFenceSequence");
    return sequenceOpen(code);
  }

  /**
   * In opening fence sequence.
   *
   * ```markdown
   * > | ~~~js
   *      ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === marker) {
      sizeOpen++;
      effects.consume(code);
      return sequenceOpen;
    }
    if (sizeOpen < 3) {
      return nok(code);
    }
    effects.exit("codeFencedFenceSequence");
    return markdownSpace(code) ? factorySpace(effects, infoBefore, "whitespace")(code) : infoBefore(code);
  }

  /**
   * In opening fence, after the sequence (and optional whitespace), before info.
   *
   * ```markdown
   * > | ~~~js
   *        ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function infoBefore(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("codeFencedFence");
      return self.interrupt ? ok(code) : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code);
    }
    effects.enter("codeFencedFenceInfo");
    effects.enter("chunkString", {
      contentType: "string"
    });
    return info(code);
  }

  /**
   * In info.
   *
   * ```markdown
   * > | ~~~js
   *        ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function info(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("chunkString");
      effects.exit("codeFencedFenceInfo");
      return infoBefore(code);
    }
    if (markdownSpace(code)) {
      effects.exit("chunkString");
      effects.exit("codeFencedFenceInfo");
      return factorySpace(effects, metaBefore, "whitespace")(code);
    }
    if (code === 96 && code === marker) {
      return nok(code);
    }
    effects.consume(code);
    return info;
  }

  /**
   * In opening fence, after info and whitespace, before meta.
   *
   * ```markdown
   * > | ~~~js eval
   *           ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function metaBefore(code) {
    if (code === null || markdownLineEnding(code)) {
      return infoBefore(code);
    }
    effects.enter("codeFencedFenceMeta");
    effects.enter("chunkString", {
      contentType: "string"
    });
    return meta(code);
  }

  /**
   * In meta.
   *
   * ```markdown
   * > | ~~~js eval
   *           ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function meta(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("chunkString");
      effects.exit("codeFencedFenceMeta");
      return infoBefore(code);
    }
    if (code === 96 && code === marker) {
      return nok(code);
    }
    effects.consume(code);
    return meta;
  }

  /**
   * At eol/eof in code, before a non-lazy closing fence or content.
   *
   * ```markdown
   * > | ~~~js
   *          ^
   * > | alert(1)
   *             ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function atNonLazyBreak(code) {
    return effects.attempt(closeStart, after, contentBefore)(code);
  }

  /**
   * Before code content, not a closing fence, at eol.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *             ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentBefore(code) {
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return contentStart;
  }

  /**
   * Before code content, not a closing fence.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentStart(code) {
    return initialPrefix > 0 && markdownSpace(code) ? factorySpace(effects, beforeContentChunk, "linePrefix", initialPrefix + 1)(code) : beforeContentChunk(code);
  }

  /**
   * Before code content, after optional prefix.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function beforeContentChunk(code) {
    if (code === null || markdownLineEnding(code)) {
      return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code);
    }
    effects.enter("codeFlowValue");
    return contentChunk(code);
  }

  /**
   * In code content.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^^^^^^^^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentChunk(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("codeFlowValue");
      return beforeContentChunk(code);
    }
    effects.consume(code);
    return contentChunk;
  }

  /**
   * After code.
   *
   * ```markdown
   *   | ~~~js
   *   | alert(1)
   * > | ~~~
   *        ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    effects.exit("codeFenced");
    return ok(code);
  }

  /**
   * @this {TokenizeContext}
   *   Context.
   * @type {Tokenizer}
   */
  function tokenizeCloseStart(effects, ok, nok) {
    let size = 0;
    return startBefore;

    /**
     *
     *
     * @type {State}
     */
    function startBefore(code) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return start;
    }

    /**
     * Before closing fence, at optional whitespace.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function start(code) {
      // Always populated by defaults.

      // To do: `enter` here or in next state?
      effects.enter("codeFencedFence");
      return markdownSpace(code) ? factorySpace(effects, beforeSequenceClose, "linePrefix", self.parser.constructs.disable.null.includes('codeIndented') ? undefined : 4)(code) : beforeSequenceClose(code);
    }

    /**
     * In closing fence, after optional whitespace, at sequence.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function beforeSequenceClose(code) {
      if (code === marker) {
        effects.enter("codeFencedFenceSequence");
        return sequenceClose(code);
      }
      return nok(code);
    }

    /**
     * In closing fence sequence.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function sequenceClose(code) {
      if (code === marker) {
        size++;
        effects.consume(code);
        return sequenceClose;
      }
      if (size >= sizeOpen) {
        effects.exit("codeFencedFenceSequence");
        return markdownSpace(code) ? factorySpace(effects, sequenceCloseAfter, "whitespace")(code) : sequenceCloseAfter(code);
      }
      return nok(code);
    }

    /**
     * After closing fence sequence, after optional whitespace.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *        ^
     * ```
     *
     * @type {State}
     */
    function sequenceCloseAfter(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit("codeFencedFence");
        return ok(code);
      }
      return nok(code);
    }
  }
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeNonLazyContinuation(effects, ok, nok) {
  const self = this;
  return start;

  /**
   *
   *
   * @type {State}
   */
  function start(code) {
    if (code === null) {
      return nok(code);
    }
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return lineStart;
  }

  /**
   *
   *
   * @type {State}
   */
  function lineStart(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
  }
}
// EXTERNAL MODULE: ../../node_modules/.pnpm/decode-named-character-reference@1.3.0/node_modules/decode-named-character-reference/index.dom.js
var index_dom = __webpack_require__(8787);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/character-reference.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */



/** @type {Construct} */
const characterReference = {
  name: 'characterReference',
  tokenize: tokenizeCharacterReference
};

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeCharacterReference(effects, ok, nok) {
  const self = this;
  let size = 0;
  /** @type {number} */
  let max;
  /** @type {(code: Code) => boolean} */
  let test;
  return start;

  /**
   * Start of character reference.
   *
   * ```markdown
   * > | a&amp;b
   *      ^
   * > | a&#123;b
   *      ^
   * > | a&#x9;b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("characterReference");
    effects.enter("characterReferenceMarker");
    effects.consume(code);
    effects.exit("characterReferenceMarker");
    return open;
  }

  /**
   * After `&`, at `#` for numeric references or alphanumeric for named
   * references.
   *
   * ```markdown
   * > | a&amp;b
   *       ^
   * > | a&#123;b
   *       ^
   * > | a&#x9;b
   *       ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 35) {
      effects.enter("characterReferenceMarkerNumeric");
      effects.consume(code);
      effects.exit("characterReferenceMarkerNumeric");
      return numeric;
    }
    effects.enter("characterReferenceValue");
    max = 31;
    test = asciiAlphanumeric;
    return value(code);
  }

  /**
   * After `#`, at `x` for hexadecimals or digit for decimals.
   *
   * ```markdown
   * > | a&#123;b
   *        ^
   * > | a&#x9;b
   *        ^
   * ```
   *
   * @type {State}
   */
  function numeric(code) {
    if (code === 88 || code === 120) {
      effects.enter("characterReferenceMarkerHexadecimal");
      effects.consume(code);
      effects.exit("characterReferenceMarkerHexadecimal");
      effects.enter("characterReferenceValue");
      max = 6;
      test = asciiHexDigit;
      return value;
    }
    effects.enter("characterReferenceValue");
    max = 7;
    test = asciiDigit;
    return value(code);
  }

  /**
   * After markers (`&#x`, `&#`, or `&`), in value, before `;`.
   *
   * The character reference kind defines what and how many characters are
   * allowed.
   *
   * ```markdown
   * > | a&amp;b
   *       ^^^
   * > | a&#123;b
   *        ^^^
   * > | a&#x9;b
   *         ^
   * ```
   *
   * @type {State}
   */
  function value(code) {
    if (code === 59 && size) {
      const token = effects.exit("characterReferenceValue");
      if (test === asciiAlphanumeric && !(0,index_dom/* decodeNamedCharacterReference */.T)(self.sliceSerialize(token))) {
        return nok(code);
      }

      // To do: `markdown-rs` uses a different name:
      // `CharacterReferenceMarkerSemi`.
      effects.enter("characterReferenceMarker");
      effects.consume(code);
      effects.exit("characterReferenceMarker");
      effects.exit("characterReference");
      return ok;
    }
    if (test(code) && size++ < max) {
      effects.consume(code);
      return value;
    }
    return nok(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/character-escape.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */


/** @type {Construct} */
const characterEscape = {
  name: 'characterEscape',
  tokenize: tokenizeCharacterEscape
};

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeCharacterEscape(effects, ok, nok) {
  return start;

  /**
   * Start of character escape.
   *
   * ```markdown
   * > | a\*b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("characterEscape");
    effects.enter("escapeMarker");
    effects.consume(code);
    effects.exit("escapeMarker");
    return inside;
  }

  /**
   * After `\`, at punctuation.
   *
   * ```markdown
   * > | a\*b
   *       ^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    // ASCII punctuation.
    if (asciiPunctuation(code)) {
      effects.enter("characterEscapeValue");
      effects.consume(code);
      effects.exit("characterEscapeValue");
      effects.exit("characterEscape");
      return ok;
    }
    return nok(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/line-ending.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */



/** @type {Construct} */
const lineEnding = {
  name: 'lineEnding',
  tokenize: tokenizeLineEnding
};

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeLineEnding(effects, ok) {
  return start;

  /** @type {State} */
  function start(code) {
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return factorySpace(effects, ok, "linePrefix");
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-util-resolve-all@2.0.1/node_modules/micromark-util-resolve-all/index.js
/**
 * @import {Event, Resolver, TokenizeContext} from 'micromark-util-types'
 */

/**
 * Call all `resolveAll`s.
 *
 * @param {ReadonlyArray<{resolveAll?: Resolver | undefined}>} constructs
 *   List of constructs, optionally with `resolveAll`s.
 * @param {Array<Event>} events
 *   List of events.
 * @param {TokenizeContext} context
 *   Context used by `tokenize`.
 * @returns {Array<Event>}
 *   Changed events.
 */
function resolveAll(constructs, events, context) {
  /** @type {Array<Resolver>} */
  const called = []
  let index = -1

  while (++index < constructs.length) {
    const resolve = constructs[index].resolveAll

    if (resolve && !called.includes(resolve)) {
      events = resolve(events, context)
      called.push(resolve)
    }
  }

  return events
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/label-end.js
/**
 * @import {
 *   Construct,
 *   Event,
 *   Resolver,
 *   State,
 *   TokenizeContext,
 *   Tokenizer,
 *   Token
 * } from 'micromark-util-types'
 */









/** @type {Construct} */
const labelEnd = {
  name: 'labelEnd',
  resolveAll: resolveAllLabelEnd,
  resolveTo: resolveToLabelEnd,
  tokenize: tokenizeLabelEnd
};

/** @type {Construct} */
const resourceConstruct = {
  tokenize: tokenizeResource
};
/** @type {Construct} */
const referenceFullConstruct = {
  tokenize: tokenizeReferenceFull
};
/** @type {Construct} */
const referenceCollapsedConstruct = {
  tokenize: tokenizeReferenceCollapsed
};

/** @type {Resolver} */
function resolveAllLabelEnd(events) {
  let index = -1;
  /** @type {Array<Event>} */
  const newEvents = [];
  while (++index < events.length) {
    const token = events[index][1];
    newEvents.push(events[index]);
    if (token.type === "labelImage" || token.type === "labelLink" || token.type === "labelEnd") {
      // Remove the marker.
      const offset = token.type === "labelImage" ? 4 : 2;
      token.type = "data";
      index += offset;
    }
  }

  // If the events are equal, we don't have to copy newEvents to events
  if (events.length !== newEvents.length) {
    splice(events, 0, events.length, newEvents);
  }
  return events;
}

/** @type {Resolver} */
function resolveToLabelEnd(events, context) {
  let index = events.length;
  let offset = 0;
  /** @type {Token} */
  let token;
  /** @type {number | undefined} */
  let open;
  /** @type {number | undefined} */
  let close;
  /** @type {Array<Event>} */
  let media;

  // Find an opening.
  while (index--) {
    token = events[index][1];
    if (open) {
      // If we see another link, or inactive link label, we’ve been here before.
      if (token.type === "link" || token.type === "labelLink" && token._inactive) {
        break;
      }

      // Mark other link openings as inactive, as we can’t have links in
      // links.
      if (events[index][0] === 'enter' && token.type === "labelLink") {
        token._inactive = true;
      }
    } else if (close) {
      if (events[index][0] === 'enter' && (token.type === "labelImage" || token.type === "labelLink") && !token._balanced) {
        open = index;
        if (token.type !== "labelLink") {
          offset = 2;
          break;
        }
      }
    } else if (token.type === "labelEnd") {
      close = index;
    }
  }
  const group = {
    type: events[open][1].type === "labelLink" ? "link" : "image",
    start: {
      ...events[open][1].start
    },
    end: {
      ...events[events.length - 1][1].end
    }
  };
  const label = {
    type: "label",
    start: {
      ...events[open][1].start
    },
    end: {
      ...events[close][1].end
    }
  };
  const text = {
    type: "labelText",
    start: {
      ...events[open + offset + 2][1].end
    },
    end: {
      ...events[close - 2][1].start
    }
  };
  media = [['enter', group, context], ['enter', label, context]];

  // Opening marker.
  media = push(media, events.slice(open + 1, open + offset + 3));

  // Text open.
  media = push(media, [['enter', text, context]]);

  // Always populated by defaults.

  // Between.
  media = push(media, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + offset + 4, close - 3), context));

  // Text close, marker close, label close.
  media = push(media, [['exit', text, context], events[close - 2], events[close - 1], ['exit', label, context]]);

  // Reference, resource, or so.
  media = push(media, events.slice(close + 1));

  // Media close.
  media = push(media, [['exit', group, context]]);
  splice(events, open, events.length, media);
  return events;
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeLabelEnd(effects, ok, nok) {
  const self = this;
  let index = self.events.length;
  /** @type {Token} */
  let labelStart;
  /** @type {boolean} */
  let defined;

  // Find an opening.
  while (index--) {
    if ((self.events[index][1].type === "labelImage" || self.events[index][1].type === "labelLink") && !self.events[index][1]._balanced) {
      labelStart = self.events[index][1];
      break;
    }
  }
  return start;

  /**
   * Start of label end.
   *
   * ```markdown
   * > | [a](b) c
   *       ^
   * > | [a][b] c
   *       ^
   * > | [a][] b
   *       ^
   * > | [a] b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // If there is not an okay opening.
    if (!labelStart) {
      return nok(code);
    }

    // If the corresponding label (link) start is marked as inactive,
    // it means we’d be wrapping a link, like this:
    //
    // ```markdown
    // > | a [b [c](d) e](f) g.
    //                  ^
    // ```
    //
    // We can’t have that, so it’s just balanced brackets.
    if (labelStart._inactive) {
      return labelEndNok(code);
    }
    defined = self.parser.defined.includes(normalizeIdentifier(self.sliceSerialize({
      start: labelStart.end,
      end: self.now()
    })));
    effects.enter("labelEnd");
    effects.enter("labelMarker");
    effects.consume(code);
    effects.exit("labelMarker");
    effects.exit("labelEnd");
    return after;
  }

  /**
   * After `]`.
   *
   * ```markdown
   * > | [a](b) c
   *       ^
   * > | [a][b] c
   *       ^
   * > | [a][] b
   *       ^
   * > | [a] b
   *       ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    // Note: `markdown-rs` also parses GFM footnotes here, which for us is in
    // an extension.

    // Resource (`[asd](fgh)`)?
    if (code === 40) {
      return effects.attempt(resourceConstruct, labelEndOk, defined ? labelEndOk : labelEndNok)(code);
    }

    // Full (`[asd][fgh]`) or collapsed (`[asd][]`) reference?
    if (code === 91) {
      return effects.attempt(referenceFullConstruct, labelEndOk, defined ? referenceNotFull : labelEndNok)(code);
    }

    // Shortcut (`[asd]`) reference?
    return defined ? labelEndOk(code) : labelEndNok(code);
  }

  /**
   * After `]`, at `[`, but not at a full reference.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] b
   *        ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceNotFull(code) {
    return effects.attempt(referenceCollapsedConstruct, labelEndOk, labelEndNok)(code);
  }

  /**
   * Done, we found something.
   *
   * ```markdown
   * > | [a](b) c
   *           ^
   * > | [a][b] c
   *           ^
   * > | [a][] b
   *          ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEndOk(code) {
    // Note: `markdown-rs` does a bunch of stuff here.
    return ok(code);
  }

  /**
   * Done, it’s nothing.
   *
   * There was an okay opening, but we didn’t match anything.
   *
   * ```markdown
   * > | [a](b c
   *        ^
   * > | [a][b c
   *        ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEndNok(code) {
    labelStart._balanced = true;
    return nok(code);
  }
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeResource(effects, ok, nok) {
  return resourceStart;

  /**
   * At a resource.
   *
   * ```markdown
   * > | [a](b) c
   *        ^
   * ```
   *
   * @type {State}
   */
  function resourceStart(code) {
    effects.enter("resource");
    effects.enter("resourceMarker");
    effects.consume(code);
    effects.exit("resourceMarker");
    return resourceBefore;
  }

  /**
   * In resource, after `(`, at optional whitespace.
   *
   * ```markdown
   * > | [a](b) c
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceBefore(code) {
    return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, resourceOpen)(code) : resourceOpen(code);
  }

  /**
   * In resource, after optional whitespace, at `)` or a destination.
   *
   * ```markdown
   * > | [a](b) c
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceOpen(code) {
    if (code === 41) {
      return resourceEnd(code);
    }
    return factoryDestination(effects, resourceDestinationAfter, resourceDestinationMissing, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(code);
  }

  /**
   * In resource, after destination, at optional whitespace.
   *
   * ```markdown
   * > | [a](b) c
   *          ^
   * ```
   *
   * @type {State}
   */
  function resourceDestinationAfter(code) {
    return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, resourceBetween)(code) : resourceEnd(code);
  }

  /**
   * At invalid destination.
   *
   * ```markdown
   * > | [a](<<) b
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceDestinationMissing(code) {
    return nok(code);
  }

  /**
   * In resource, after destination and whitespace, at `(` or title.
   *
   * ```markdown
   * > | [a](b ) c
   *           ^
   * ```
   *
   * @type {State}
   */
  function resourceBetween(code) {
    if (code === 34 || code === 39 || code === 40) {
      return factoryTitle(effects, resourceTitleAfter, nok, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(code);
    }
    return resourceEnd(code);
  }

  /**
   * In resource, after title, at optional whitespace.
   *
   * ```markdown
   * > | [a](b "c") d
   *              ^
   * ```
   *
   * @type {State}
   */
  function resourceTitleAfter(code) {
    return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, resourceEnd)(code) : resourceEnd(code);
  }

  /**
   * In resource, at `)`.
   *
   * ```markdown
   * > | [a](b) d
   *          ^
   * ```
   *
   * @type {State}
   */
  function resourceEnd(code) {
    if (code === 41) {
      effects.enter("resourceMarker");
      effects.consume(code);
      effects.exit("resourceMarker");
      effects.exit("resource");
      return ok;
    }
    return nok(code);
  }
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeReferenceFull(effects, ok, nok) {
  const self = this;
  return referenceFull;

  /**
   * In a reference (full), at the `[`.
   *
   * ```markdown
   * > | [a][b] d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceFull(code) {
    return factoryLabel.call(self, effects, referenceFullAfter, referenceFullMissing, "reference", "referenceMarker", "referenceString")(code);
  }

  /**
   * In a reference (full), after `]`.
   *
   * ```markdown
   * > | [a][b] d
   *          ^
   * ```
   *
   * @type {State}
   */
  function referenceFullAfter(code) {
    return self.parser.defined.includes(normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1))) ? ok(code) : nok(code);
  }

  /**
   * In reference (full) that was missing.
   *
   * ```markdown
   * > | [a][b d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceFullMissing(code) {
    return nok(code);
  }
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeReferenceCollapsed(effects, ok, nok) {
  return referenceCollapsedStart;

  /**
   * In reference (collapsed), at `[`.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceCollapsedStart(code) {
    // We only attempt a collapsed label if there’s a `[`.

    effects.enter("reference");
    effects.enter("referenceMarker");
    effects.consume(code);
    effects.exit("referenceMarker");
    return referenceCollapsedOpen;
  }

  /**
   * In reference (collapsed), at `]`.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] d
   *         ^
   * ```
   *
   *  @type {State}
   */
  function referenceCollapsedOpen(code) {
    if (code === 93) {
      effects.enter("referenceMarker");
      effects.consume(code);
      effects.exit("referenceMarker");
      effects.exit("reference");
      return ok;
    }
    return nok(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/label-start-image.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */



/** @type {Construct} */
const labelStartImage = {
  name: 'labelStartImage',
  resolveAll: labelEnd.resolveAll,
  tokenize: tokenizeLabelStartImage
};

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeLabelStartImage(effects, ok, nok) {
  const self = this;
  return start;

  /**
   * Start of label (image) start.
   *
   * ```markdown
   * > | a ![b] c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("labelImage");
    effects.enter("labelImageMarker");
    effects.consume(code);
    effects.exit("labelImageMarker");
    return open;
  }

  /**
   * After `!`, at `[`.
   *
   * ```markdown
   * > | a ![b] c
   *        ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 91) {
      effects.enter("labelMarker");
      effects.consume(code);
      effects.exit("labelMarker");
      effects.exit("labelImage");
      return after;
    }
    return nok(code);
  }

  /**
   * After `![`.
   *
   * ```markdown
   * > | a ![b] c
   *         ^
   * ```
   *
   * This is needed in because, when GFM footnotes are enabled, images never
   * form when started with a `^`.
   * Instead, links form:
   *
   * ```markdown
   * ![^a](b)
   *
   * ![^a][b]
   *
   * [b]: c
   * ```
   *
   * ```html
   * <p>!<a href=\"b\">^a</a></p>
   * <p>!<a href=\"c\">^a</a></p>
   * ```
   *
   * @type {State}
   */
  function after(code) {
    // To do: use a new field to do this, this is still needed for
    // `micromark-extension-gfm-footnote`, but the `label-start-link`
    // behavior isn’t.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    return code === 94 && '_hiddenFootnoteSupport' in self.parser.constructs ? nok(code) : ok(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-util-classify-character@2.0.1/node_modules/micromark-util-classify-character/index.js
/**
 * @import {Code} from 'micromark-util-types'
 */


/**
 * Classify whether a code represents whitespace, punctuation, or something
 * else.
 *
 * Used for attention (emphasis, strong), whose sequences can open or close
 * based on the class of surrounding characters.
 *
 * > 👉 **Note**: eof (`null`) is seen as whitespace.
 *
 * @param {Code} code
 *   Code.
 * @returns {typeof constants.characterGroupWhitespace | typeof constants.characterGroupPunctuation | undefined}
 *   Group.
 */
function classifyCharacter(code) {
  if (code === null || markdownLineEndingOrSpace(code) || unicodeWhitespace(code)) {
    return 1;
  }
  if (unicodePunctuation(code)) {
    return 2;
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/attention.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   Event,
 *   Point,
 *   Resolver,
 *   State,
 *   TokenizeContext,
 *   Tokenizer,
 *   Token
 * } from 'micromark-util-types'
 */




/** @type {Construct} */
const attention = {
  name: 'attention',
  resolveAll: resolveAllAttention,
  tokenize: tokenizeAttention
};

/**
 * Take all events and resolve attention to emphasis or strong.
 *
 * @type {Resolver}
 */
// eslint-disable-next-line complexity
function resolveAllAttention(events, context) {
  let index = -1;
  /** @type {number} */
  let open;
  /** @type {Token} */
  let group;
  /** @type {Token} */
  let text;
  /** @type {Token} */
  let openingSequence;
  /** @type {Token} */
  let closingSequence;
  /** @type {number} */
  let use;
  /** @type {Array<Event>} */
  let nextEvents;
  /** @type {number} */
  let offset;

  // Walk through all events.
  //
  // Note: performance of this is fine on an mb of normal markdown, but it’s
  // a bottleneck for malicious stuff.
  while (++index < events.length) {
    // Find a token that can close.
    if (events[index][0] === 'enter' && events[index][1].type === 'attentionSequence' && events[index][1]._close) {
      open = index;

      // Now walk back to find an opener.
      while (open--) {
        // Find a token that can open the closer.
        if (events[open][0] === 'exit' && events[open][1].type === 'attentionSequence' && events[open][1]._open &&
        // If the markers are the same:
        context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index][1]).charCodeAt(0)) {
          // If the opening can close or the closing can open,
          // and the close size *is not* a multiple of three,
          // but the sum of the opening and closing size *is* multiple of three,
          // then don’t match.
          if ((events[open][1]._close || events[index][1]._open) && (events[index][1].end.offset - events[index][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index][1].end.offset - events[index][1].start.offset) % 3)) {
            continue;
          }

          // Number of markers to use from the sequence.
          use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index][1].end.offset - events[index][1].start.offset > 1 ? 2 : 1;
          const start = {
            ...events[open][1].end
          };
          const end = {
            ...events[index][1].start
          };
          movePoint(start, -use);
          movePoint(end, use);
          openingSequence = {
            type: use > 1 ? "strongSequence" : "emphasisSequence",
            start,
            end: {
              ...events[open][1].end
            }
          };
          closingSequence = {
            type: use > 1 ? "strongSequence" : "emphasisSequence",
            start: {
              ...events[index][1].start
            },
            end
          };
          text = {
            type: use > 1 ? "strongText" : "emphasisText",
            start: {
              ...events[open][1].end
            },
            end: {
              ...events[index][1].start
            }
          };
          group = {
            type: use > 1 ? "strong" : "emphasis",
            start: {
              ...openingSequence.start
            },
            end: {
              ...closingSequence.end
            }
          };
          events[open][1].end = {
            ...openingSequence.start
          };
          events[index][1].start = {
            ...closingSequence.end
          };
          nextEvents = [];

          // If there are more markers in the opening, add them before.
          if (events[open][1].end.offset - events[open][1].start.offset) {
            nextEvents = push(nextEvents, [['enter', events[open][1], context], ['exit', events[open][1], context]]);
          }

          // Opening.
          nextEvents = push(nextEvents, [['enter', group, context], ['enter', openingSequence, context], ['exit', openingSequence, context], ['enter', text, context]]);

          // Always populated by defaults.

          // Between.
          nextEvents = push(nextEvents, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + 1, index), context));

          // Closing.
          nextEvents = push(nextEvents, [['exit', text, context], ['enter', closingSequence, context], ['exit', closingSequence, context], ['exit', group, context]]);

          // If there are more markers in the closing, add them after.
          if (events[index][1].end.offset - events[index][1].start.offset) {
            offset = 2;
            nextEvents = push(nextEvents, [['enter', events[index][1], context], ['exit', events[index][1], context]]);
          } else {
            offset = 0;
          }
          splice(events, open - 1, index - open + 3, nextEvents);
          index = open + nextEvents.length - offset - 2;
          break;
        }
      }
    }
  }

  // Remove remaining sequences.
  index = -1;
  while (++index < events.length) {
    if (events[index][1].type === 'attentionSequence') {
      events[index][1].type = 'data';
    }
  }
  return events;
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeAttention(effects, ok) {
  const attentionMarkers = this.parser.constructs.attentionMarkers.null;
  const previous = this.previous;
  const before = classifyCharacter(previous);

  /** @type {NonNullable<Code>} */
  let marker;
  return start;

  /**
   * Before a sequence.
   *
   * ```markdown
   * > | **
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    marker = code;
    effects.enter('attentionSequence');
    return inside(code);
  }

  /**
   * In a sequence.
   *
   * ```markdown
   * > | **
   *     ^^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker) {
      effects.consume(code);
      return inside;
    }
    const token = effects.exit('attentionSequence');

    // To do: next major: move this to resolver, just like `markdown-rs`.
    const after = classifyCharacter(code);

    // Always populated by defaults.

    const open = !after || after === 2 && before || attentionMarkers.includes(code);
    const close = !before || before === 2 && after || attentionMarkers.includes(previous);
    token._open = Boolean(marker === 42 ? open : open && (before || !close));
    token._close = Boolean(marker === 42 ? close : close && (after || !open));
    return ok(code);
  }
}

/**
 * Move a point a bit.
 *
 * Note: `move` only works inside lines! It’s not possible to move past other
 * chunks (replacement characters, tabs, or line endings).
 *
 * @param {Point} point
 *   Point.
 * @param {number} offset
 *   Amount to move.
 * @returns {undefined}
 *   Nothing.
 */
function movePoint(point, offset) {
  point.column += offset;
  point.offset += offset;
  point._bufferIndex += offset;
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/autolink.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */


/** @type {Construct} */
const autolink = {
  name: 'autolink',
  tokenize: tokenizeAutolink
};

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeAutolink(effects, ok, nok) {
  let size = 0;
  return start;

  /**
   * Start of an autolink.
   *
   * ```markdown
   * > | a<https://example.com>b
   *      ^
   * > | a<user@example.com>b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("autolink");
    effects.enter("autolinkMarker");
    effects.consume(code);
    effects.exit("autolinkMarker");
    effects.enter("autolinkProtocol");
    return open;
  }

  /**
   * After `<`, at protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *       ^
   * > | a<user@example.com>b
   *       ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (asciiAlpha(code)) {
      effects.consume(code);
      return schemeOrEmailAtext;
    }
    if (code === 64) {
      return nok(code);
    }
    return emailAtext(code);
  }

  /**
   * At second byte of protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *        ^
   * > | a<user@example.com>b
   *        ^
   * ```
   *
   * @type {State}
   */
  function schemeOrEmailAtext(code) {
    // ASCII alphanumeric and `+`, `-`, and `.`.
    if (code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) {
      // Count the previous alphabetical from `open` too.
      size = 1;
      return schemeInsideOrEmailAtext(code);
    }
    return emailAtext(code);
  }

  /**
   * In ambiguous protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *        ^
   * > | a<user@example.com>b
   *        ^
   * ```
   *
   * @type {State}
   */
  function schemeInsideOrEmailAtext(code) {
    if (code === 58) {
      effects.consume(code);
      size = 0;
      return urlInside;
    }

    // ASCII alphanumeric and `+`, `-`, and `.`.
    if ((code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) && size++ < 32) {
      effects.consume(code);
      return schemeInsideOrEmailAtext;
    }
    size = 0;
    return emailAtext(code);
  }

  /**
   * After protocol, in URL.
   *
   * ```markdown
   * > | a<https://example.com>b
   *             ^
   * ```
   *
   * @type {State}
   */
  function urlInside(code) {
    if (code === 62) {
      effects.exit("autolinkProtocol");
      effects.enter("autolinkMarker");
      effects.consume(code);
      effects.exit("autolinkMarker");
      effects.exit("autolink");
      return ok;
    }

    // ASCII control, space, or `<`.
    if (code === null || code === 32 || code === 60 || asciiControl(code)) {
      return nok(code);
    }
    effects.consume(code);
    return urlInside;
  }

  /**
   * In email atext.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *              ^
   * ```
   *
   * @type {State}
   */
  function emailAtext(code) {
    if (code === 64) {
      effects.consume(code);
      return emailAtSignOrDot;
    }
    if (asciiAtext(code)) {
      effects.consume(code);
      return emailAtext;
    }
    return nok(code);
  }

  /**
   * In label, after at-sign or dot.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *                 ^       ^
   * ```
   *
   * @type {State}
   */
  function emailAtSignOrDot(code) {
    return asciiAlphanumeric(code) ? emailLabel(code) : nok(code);
  }

  /**
   * In label, where `.` and `>` are allowed.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *                   ^
   * ```
   *
   * @type {State}
   */
  function emailLabel(code) {
    if (code === 46) {
      effects.consume(code);
      size = 0;
      return emailAtSignOrDot;
    }
    if (code === 62) {
      // Exit, then change the token type.
      effects.exit("autolinkProtocol").type = "autolinkEmail";
      effects.enter("autolinkMarker");
      effects.consume(code);
      effects.exit("autolinkMarker");
      effects.exit("autolink");
      return ok;
    }
    return emailValue(code);
  }

  /**
   * In label, where `.` and `>` are *not* allowed.
   *
   * Though, this is also used in `emailLabel` to parse other values.
   *
   * ```markdown
   * > | a<user.name@ex-ample.com>b
   *                    ^
   * ```
   *
   * @type {State}
   */
  function emailValue(code) {
    // ASCII alphanumeric or `-`.
    if ((code === 45 || asciiAlphanumeric(code)) && size++ < 63) {
      const next = code === 45 ? emailValue : emailLabel;
      effects.consume(code);
      return next;
    }
    return nok(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/html-text.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */



/** @type {Construct} */
const htmlText = {
  name: 'htmlText',
  tokenize: tokenizeHtmlText
};

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeHtmlText(effects, ok, nok) {
  const self = this;
  /** @type {NonNullable<Code> | undefined} */
  let marker;
  /** @type {number} */
  let index;
  /** @type {State} */
  let returnState;
  return start;

  /**
   * Start of HTML (text).
   *
   * ```markdown
   * > | a <b> c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("htmlText");
    effects.enter("htmlTextData");
    effects.consume(code);
    return open;
  }

  /**
   * After `<`, at tag name or other stuff.
   *
   * ```markdown
   * > | a <b> c
   *        ^
   * > | a <!doctype> c
   *        ^
   * > | a <!--b--> c
   *        ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 33) {
      effects.consume(code);
      return declarationOpen;
    }
    if (code === 47) {
      effects.consume(code);
      return tagCloseStart;
    }
    if (code === 63) {
      effects.consume(code);
      return instruction;
    }

    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      effects.consume(code);
      return tagOpen;
    }
    return nok(code);
  }

  /**
   * After `<!`, at declaration, comment, or CDATA.
   *
   * ```markdown
   * > | a <!doctype> c
   *         ^
   * > | a <!--b--> c
   *         ^
   * > | a <![CDATA[>&<]]> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function declarationOpen(code) {
    if (code === 45) {
      effects.consume(code);
      return commentOpenInside;
    }
    if (code === 91) {
      effects.consume(code);
      index = 0;
      return cdataOpenInside;
    }
    if (asciiAlpha(code)) {
      effects.consume(code);
      return declaration;
    }
    return nok(code);
  }

  /**
   * In a comment, after `<!-`, at another `-`.
   *
   * ```markdown
   * > | a <!--b--> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function commentOpenInside(code) {
    if (code === 45) {
      effects.consume(code);
      return commentEnd;
    }
    return nok(code);
  }

  /**
   * In comment.
   *
   * ```markdown
   * > | a <!--b--> c
   *           ^
   * ```
   *
   * @type {State}
   */
  function comment(code) {
    if (code === null) {
      return nok(code);
    }
    if (code === 45) {
      effects.consume(code);
      return commentClose;
    }
    if (markdownLineEnding(code)) {
      returnState = comment;
      return lineEndingBefore(code);
    }
    effects.consume(code);
    return comment;
  }

  /**
   * In comment, after `-`.
   *
   * ```markdown
   * > | a <!--b--> c
   *             ^
   * ```
   *
   * @type {State}
   */
  function commentClose(code) {
    if (code === 45) {
      effects.consume(code);
      return commentEnd;
    }
    return comment(code);
  }

  /**
   * In comment, after `--`.
   *
   * ```markdown
   * > | a <!--b--> c
   *              ^
   * ```
   *
   * @type {State}
   */
  function commentEnd(code) {
    return code === 62 ? end(code) : code === 45 ? commentClose(code) : comment(code);
  }

  /**
   * After `<![`, in CDATA, expecting `CDATA[`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *          ^^^^^^
   * ```
   *
   * @type {State}
   */
  function cdataOpenInside(code) {
    const value = "CDATA[";
    if (code === value.charCodeAt(index++)) {
      effects.consume(code);
      return index === value.length ? cdata : cdataOpenInside;
    }
    return nok(code);
  }

  /**
   * In CDATA.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                ^^^
   * ```
   *
   * @type {State}
   */
  function cdata(code) {
    if (code === null) {
      return nok(code);
    }
    if (code === 93) {
      effects.consume(code);
      return cdataClose;
    }
    if (markdownLineEnding(code)) {
      returnState = cdata;
      return lineEndingBefore(code);
    }
    effects.consume(code);
    return cdata;
  }

  /**
   * In CDATA, after `]`, at another `]`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                    ^
   * ```
   *
   * @type {State}
   */
  function cdataClose(code) {
    if (code === 93) {
      effects.consume(code);
      return cdataEnd;
    }
    return cdata(code);
  }

  /**
   * In CDATA, after `]]`, at `>`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                     ^
   * ```
   *
   * @type {State}
   */
  function cdataEnd(code) {
    if (code === 62) {
      return end(code);
    }
    if (code === 93) {
      effects.consume(code);
      return cdataEnd;
    }
    return cdata(code);
  }

  /**
   * In declaration.
   *
   * ```markdown
   * > | a <!b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function declaration(code) {
    if (code === null || code === 62) {
      return end(code);
    }
    if (markdownLineEnding(code)) {
      returnState = declaration;
      return lineEndingBefore(code);
    }
    effects.consume(code);
    return declaration;
  }

  /**
   * In instruction.
   *
   * ```markdown
   * > | a <?b?> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function instruction(code) {
    if (code === null) {
      return nok(code);
    }
    if (code === 63) {
      effects.consume(code);
      return instructionClose;
    }
    if (markdownLineEnding(code)) {
      returnState = instruction;
      return lineEndingBefore(code);
    }
    effects.consume(code);
    return instruction;
  }

  /**
   * In instruction, after `?`, at `>`.
   *
   * ```markdown
   * > | a <?b?> c
   *           ^
   * ```
   *
   * @type {State}
   */
  function instructionClose(code) {
    return code === 62 ? end(code) : instruction(code);
  }

  /**
   * After `</`, in closing tag, at tag name.
   *
   * ```markdown
   * > | a </b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagCloseStart(code) {
    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      effects.consume(code);
      return tagClose;
    }
    return nok(code);
  }

  /**
   * After `</x`, in a tag name.
   *
   * ```markdown
   * > | a </b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagClose(code) {
    // ASCII alphanumerical and `-`.
    if (code === 45 || asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagClose;
    }
    return tagCloseBetween(code);
  }

  /**
   * In closing tag, after tag name.
   *
   * ```markdown
   * > | a </b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagCloseBetween(code) {
    if (markdownLineEnding(code)) {
      returnState = tagCloseBetween;
      return lineEndingBefore(code);
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagCloseBetween;
    }
    return end(code);
  }

  /**
   * After `<x`, in opening tag name.
   *
   * ```markdown
   * > | a <b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagOpen(code) {
    // ASCII alphanumerical and `-`.
    if (code === 45 || asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagOpen;
    }
    if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code);
    }
    return nok(code);
  }

  /**
   * In opening tag, after tag name.
   *
   * ```markdown
   * > | a <b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagOpenBetween(code) {
    if (code === 47) {
      effects.consume(code);
      return end;
    }

    // ASCII alphabetical and `:` and `_`.
    if (code === 58 || code === 95 || asciiAlpha(code)) {
      effects.consume(code);
      return tagOpenAttributeName;
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenBetween;
      return lineEndingBefore(code);
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagOpenBetween;
    }
    return end(code);
  }

  /**
   * In attribute name.
   *
   * ```markdown
   * > | a <b c> d
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeName(code) {
    // ASCII alphabetical and `-`, `.`, `:`, and `_`.
    if (code === 45 || code === 46 || code === 58 || code === 95 || asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagOpenAttributeName;
    }
    return tagOpenAttributeNameAfter(code);
  }

  /**
   * After attribute name, before initializer, the end of the tag, or
   * whitespace.
   *
   * ```markdown
   * > | a <b c> d
   *           ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeNameAfter(code) {
    if (code === 61) {
      effects.consume(code);
      return tagOpenAttributeValueBefore;
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeNameAfter;
      return lineEndingBefore(code);
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagOpenAttributeNameAfter;
    }
    return tagOpenBetween(code);
  }

  /**
   * Before unquoted, double quoted, or single quoted attribute value, allowing
   * whitespace.
   *
   * ```markdown
   * > | a <b c=d> e
   *            ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueBefore(code) {
    if (code === null || code === 60 || code === 61 || code === 62 || code === 96) {
      return nok(code);
    }
    if (code === 34 || code === 39) {
      effects.consume(code);
      marker = code;
      return tagOpenAttributeValueQuoted;
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueBefore;
      return lineEndingBefore(code);
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagOpenAttributeValueBefore;
    }
    effects.consume(code);
    return tagOpenAttributeValueUnquoted;
  }

  /**
   * In double or single quoted attribute value.
   *
   * ```markdown
   * > | a <b c="d"> e
   *             ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueQuoted(code) {
    if (code === marker) {
      effects.consume(code);
      marker = undefined;
      return tagOpenAttributeValueQuotedAfter;
    }
    if (code === null) {
      return nok(code);
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueQuoted;
      return lineEndingBefore(code);
    }
    effects.consume(code);
    return tagOpenAttributeValueQuoted;
  }

  /**
   * In unquoted attribute value.
   *
   * ```markdown
   * > | a <b c=d> e
   *            ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueUnquoted(code) {
    if (code === null || code === 34 || code === 39 || code === 60 || code === 61 || code === 96) {
      return nok(code);
    }
    if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code);
    }
    effects.consume(code);
    return tagOpenAttributeValueUnquoted;
  }

  /**
   * After double or single quoted attribute value, before whitespace or the end
   * of the tag.
   *
   * ```markdown
   * > | a <b c="d"> e
   *               ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueQuotedAfter(code) {
    if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code);
    }
    return nok(code);
  }

  /**
   * In certain circumstances of a tag where only an `>` is allowed.
   *
   * ```markdown
   * > | a <b c="d"> e
   *               ^
   * ```
   *
   * @type {State}
   */
  function end(code) {
    if (code === 62) {
      effects.consume(code);
      effects.exit("htmlTextData");
      effects.exit("htmlText");
      return ok;
    }
    return nok(code);
  }

  /**
   * At eol.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   * > | a <!--a
   *            ^
   *   | b-->
   * ```
   *
   * @type {State}
   */
  function lineEndingBefore(code) {
    effects.exit("htmlTextData");
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return lineEndingAfter;
  }

  /**
   * After eol, at optional whitespace.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   *   | a <!--a
   * > | b-->
   *     ^
   * ```
   *
   * @type {State}
   */
  function lineEndingAfter(code) {
    // Always populated by defaults.

    return markdownSpace(code) ? factorySpace(effects, lineEndingAfterPrefix, "linePrefix", self.parser.constructs.disable.null.includes('codeIndented') ? undefined : 4)(code) : lineEndingAfterPrefix(code);
  }

  /**
   * After eol, after optional whitespace.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   *   | a <!--a
   * > | b-->
   *     ^
   * ```
   *
   * @type {State}
   */
  function lineEndingAfterPrefix(code) {
    effects.enter("htmlTextData");
    return returnState(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/label-start-link.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */



/** @type {Construct} */
const labelStartLink = {
  name: 'labelStartLink',
  resolveAll: labelEnd.resolveAll,
  tokenize: tokenizeLabelStartLink
};

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeLabelStartLink(effects, ok, nok) {
  const self = this;
  return start;

  /**
   * Start of label (link) start.
   *
   * ```markdown
   * > | a [b] c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("labelLink");
    effects.enter("labelMarker");
    effects.consume(code);
    effects.exit("labelMarker");
    effects.exit("labelLink");
    return after;
  }

  /** @type {State} */
  function after(code) {
    // To do: this isn’t needed in `micromark-extension-gfm-footnote`,
    // remove.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    return code === 94 && '_hiddenFootnoteSupport' in self.parser.constructs ? nok(code) : ok(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/hard-break-escape.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */


/** @type {Construct} */
const hardBreakEscape = {
  name: 'hardBreakEscape',
  tokenize: tokenizeHardBreakEscape
};

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeHardBreakEscape(effects, ok, nok) {
  return start;

  /**
   * Start of a hard break (escape).
   *
   * ```markdown
   * > | a\
   *      ^
   *   | b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("hardBreakEscape");
    effects.consume(code);
    return after;
  }

  /**
   * After `\`, at eol.
   *
   * ```markdown
   * > | a\
   *       ^
   *   | b
   * ```
   *
   *  @type {State}
   */
  function after(code) {
    if (markdownLineEnding(code)) {
      effects.exit("hardBreakEscape");
      return ok(code);
    }
    return nok(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/code-text.js
/**
 * @import {
 *   Construct,
 *   Previous,
 *   Resolver,
 *   State,
 *   TokenizeContext,
 *   Tokenizer,
 *   Token
 * } from 'micromark-util-types'
 */


/** @type {Construct} */
const codeText = {
  name: 'codeText',
  previous,
  resolve: resolveCodeText,
  tokenize: tokenizeCodeText
};

// To do: next major: don’t resolve, like `markdown-rs`.
/** @type {Resolver} */
function resolveCodeText(events) {
  let tailExitIndex = events.length - 4;
  let headEnterIndex = 3;
  /** @type {number} */
  let index;
  /** @type {number | undefined} */
  let enter;

  // If we start and end with an EOL or a space.
  if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === 'space') && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === 'space')) {
    index = headEnterIndex;

    // And we have data.
    while (++index < tailExitIndex) {
      if (events[index][1].type === "codeTextData") {
        // Then we have padding.
        events[headEnterIndex][1].type = "codeTextPadding";
        events[tailExitIndex][1].type = "codeTextPadding";
        headEnterIndex += 2;
        tailExitIndex -= 2;
        break;
      }
    }
  }

  // Merge adjacent spaces and data.
  index = headEnterIndex - 1;
  tailExitIndex++;
  while (++index <= tailExitIndex) {
    if (enter === undefined) {
      if (index !== tailExitIndex && events[index][1].type !== "lineEnding") {
        enter = index;
      }
    } else if (index === tailExitIndex || events[index][1].type === "lineEnding") {
      events[enter][1].type = "codeTextData";
      if (index !== enter + 2) {
        events[enter][1].end = events[index - 1][1].end;
        events.splice(enter + 2, index - enter - 2);
        tailExitIndex -= index - enter - 2;
        index = enter + 2;
      }
      enter = undefined;
    }
  }
  return events;
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Previous}
 */
function previous(code) {
  // If there is a previous code, there will always be a tail.
  return code !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeCodeText(effects, ok, nok) {
  const self = this;
  let sizeOpen = 0;
  /** @type {number} */
  let size;
  /** @type {Token} */
  let token;
  return start;

  /**
   * Start of code (text).
   *
   * ```markdown
   * > | `a`
   *     ^
   * > | \`a`
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("codeText");
    effects.enter("codeTextSequence");
    return sequenceOpen(code);
  }

  /**
   * In opening sequence.
   *
   * ```markdown
   * > | `a`
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === 96) {
      effects.consume(code);
      sizeOpen++;
      return sequenceOpen;
    }
    effects.exit("codeTextSequence");
    return between(code);
  }

  /**
   * Between something and something else.
   *
   * ```markdown
   * > | `a`
   *      ^^
   * ```
   *
   * @type {State}
   */
  function between(code) {
    // EOF.
    if (code === null) {
      return nok(code);
    }

    // To do: next major: don’t do spaces in resolve, but when compiling,
    // like `markdown-rs`.
    // Tabs don’t work, and virtual spaces don’t make sense.
    if (code === 32) {
      effects.enter('space');
      effects.consume(code);
      effects.exit('space');
      return between;
    }

    // Closing fence? Could also be data.
    if (code === 96) {
      token = effects.enter("codeTextSequence");
      size = 0;
      return sequenceClose(code);
    }
    if (markdownLineEnding(code)) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return between;
    }

    // Data.
    effects.enter("codeTextData");
    return data(code);
  }

  /**
   * In data.
   *
   * ```markdown
   * > | `a`
   *      ^
   * ```
   *
   * @type {State}
   */
  function data(code) {
    if (code === null || code === 32 || code === 96 || markdownLineEnding(code)) {
      effects.exit("codeTextData");
      return between(code);
    }
    effects.consume(code);
    return data;
  }

  /**
   * In closing sequence.
   *
   * ```markdown
   * > | `a`
   *       ^
   * ```
   *
   * @type {State}
   */
  function sequenceClose(code) {
    // More.
    if (code === 96) {
      effects.consume(code);
      size++;
      return sequenceClose;
    }

    // Done!
    if (size === sizeOpen) {
      effects.exit("codeTextSequence");
      effects.exit("codeText");
      return ok(code);
    }

    // More or less accents: mark as data.
    token.type = "codeTextData";
    return data(code);
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/constructs.js
/**
 * @import {Extension} from 'micromark-util-types'
 */




/** @satisfies {Extension['document']} */
const constructs_document = {
  [42]: list,
  [43]: list,
  [45]: list,
  [48]: list,
  [49]: list,
  [50]: list,
  [51]: list,
  [52]: list,
  [53]: list,
  [54]: list,
  [55]: list,
  [56]: list,
  [57]: list,
  [62]: blockQuote
};

/** @satisfies {Extension['contentInitial']} */
const contentInitial = {
  [91]: definition
};

/** @satisfies {Extension['flowInitial']} */
const flowInitial = {
  [-2]: codeIndented,
  [-1]: codeIndented,
  [32]: codeIndented
};

/** @satisfies {Extension['flow']} */
const constructs_flow = {
  [35]: headingAtx,
  [42]: thematicBreak,
  [45]: [setextUnderline, thematicBreak],
  [60]: htmlFlow,
  [61]: setextUnderline,
  [95]: thematicBreak,
  [96]: codeFenced,
  [126]: codeFenced
};

/** @satisfies {Extension['string']} */
const constructs_string = {
  [38]: characterReference,
  [92]: characterEscape
};

/** @satisfies {Extension['text']} */
const constructs_text = {
  [-5]: lineEnding,
  [-4]: lineEnding,
  [-3]: lineEnding,
  [33]: labelStartImage,
  [38]: characterReference,
  [42]: attention,
  [60]: [autolink, htmlText],
  [91]: labelStartLink,
  [92]: [hardBreakEscape, characterEscape],
  [93]: labelEnd,
  [95]: attention,
  [96]: codeText
};

/** @satisfies {Extension['insideSpan']} */
const insideSpan = {
  null: [attention, resolver]
};

/** @satisfies {Extension['attentionMarkers']} */
const attentionMarkers = {
  null: [42, 95]
};

/** @satisfies {Extension['disable']} */
const disable = {
  null: []
};
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/create-tokenizer.js
/**
 * @import {
 *   Chunk,
 *   Code,
 *   ConstructRecord,
 *   Construct,
 *   Effects,
 *   InitialConstruct,
 *   ParseContext,
 *   Point,
 *   State,
 *   TokenizeContext,
 *   Token
 * } from 'micromark-util-types'
 */

/**
 * @callback Restore
 *   Restore the state.
 * @returns {undefined}
 *   Nothing.
 *
 * @typedef Info
 *   Info.
 * @property {Restore} restore
 *   Restore.
 * @property {number} from
 *   From.
 *
 * @callback ReturnHandle
 *   Handle a successful run.
 * @param {Construct} construct
 *   Construct.
 * @param {Info} info
 *   Info.
 * @returns {undefined}
 *   Nothing.
 */




/**
 * Create a tokenizer.
 * Tokenizers deal with one type of data (e.g., containers, flow, text).
 * The parser is the object dealing with it all.
 * `initialize` works like other constructs, except that only its `tokenize`
 * function is used, in which case it doesn’t receive an `ok` or `nok`.
 * `from` can be given to set the point before the first character, although
 * when further lines are indented, they must be set with `defineSkip`.
 *
 * @param {ParseContext} parser
 *   Parser.
 * @param {InitialConstruct} initialize
 *   Construct.
 * @param {Omit<Point, '_bufferIndex' | '_index'> | undefined} [from]
 *   Point (optional).
 * @returns {TokenizeContext}
 *   Context.
 */
function createTokenizer(parser, initialize, from) {
  /** @type {Point} */
  let point = {
    _bufferIndex: -1,
    _index: 0,
    line: from && from.line || 1,
    column: from && from.column || 1,
    offset: from && from.offset || 0
  };
  /** @type {Record<string, number>} */
  const columnStart = {};
  /** @type {Array<Construct>} */
  const resolveAllConstructs = [];
  /** @type {Array<Chunk>} */
  let chunks = [];
  /** @type {Array<Token>} */
  let stack = [];
  /** @type {boolean | undefined} */
  let consumed = true;

  /**
   * Tools used for tokenizing.
   *
   * @type {Effects}
   */
  const effects = {
    attempt: constructFactory(onsuccessfulconstruct),
    check: constructFactory(onsuccessfulcheck),
    consume,
    enter,
    exit,
    interrupt: constructFactory(onsuccessfulcheck, {
      interrupt: true
    })
  };

  /**
   * State and tools for resolving and serializing.
   *
   * @type {TokenizeContext}
   */
  const context = {
    code: null,
    containerState: {},
    defineSkip,
    events: [],
    now,
    parser,
    previous: null,
    sliceSerialize,
    sliceStream,
    write
  };

  /**
   * The state function.
   *
   * @type {State | undefined}
   */
  let state = initialize.tokenize.call(context, effects);

  /**
   * Track which character we expect to be consumed, to catch bugs.
   *
   * @type {Code}
   */
  let expectedCode;
  if (initialize.resolveAll) {
    resolveAllConstructs.push(initialize);
  }
  return context;

  /** @type {TokenizeContext['write']} */
  function write(slice) {
    chunks = push(chunks, slice);
    main();

    // Exit if we’re not done, resolve might change stuff.
    if (chunks[chunks.length - 1] !== null) {
      return [];
    }
    addResult(initialize, 0);

    // Otherwise, resolve, and exit.
    context.events = resolveAll(resolveAllConstructs, context.events, context);
    return context.events;
  }

  //
  // Tools.
  //

  /** @type {TokenizeContext['sliceSerialize']} */
  function sliceSerialize(token, expandTabs) {
    return serializeChunks(sliceStream(token), expandTabs);
  }

  /** @type {TokenizeContext['sliceStream']} */
  function sliceStream(token) {
    return sliceChunks(chunks, token);
  }

  /** @type {TokenizeContext['now']} */
  function now() {
    // This is a hot path, so we clone manually instead of `Object.assign({}, point)`
    const {
      _bufferIndex,
      _index,
      line,
      column,
      offset
    } = point;
    return {
      _bufferIndex,
      _index,
      line,
      column,
      offset
    };
  }

  /** @type {TokenizeContext['defineSkip']} */
  function defineSkip(value) {
    columnStart[value.line] = value.column;
    accountForPotentialSkip();
  }

  //
  // State management.
  //

  /**
   * Main loop (note that `_index` and `_bufferIndex` in `point` are modified by
   * `consume`).
   * Here is where we walk through the chunks, which either include strings of
   * several characters, or numerical character codes.
   * The reason to do this in a loop instead of a call is so the stack can
   * drain.
   *
   * @returns {undefined}
   *   Nothing.
   */
  function main() {
    /** @type {number} */
    let chunkIndex;
    while (point._index < chunks.length) {
      const chunk = chunks[point._index];

      // If we’re in a buffer chunk, loop through it.
      if (typeof chunk === 'string') {
        chunkIndex = point._index;
        if (point._bufferIndex < 0) {
          point._bufferIndex = 0;
        }
        while (point._index === chunkIndex && point._bufferIndex < chunk.length) {
          go(chunk.charCodeAt(point._bufferIndex));
        }
      } else {
        go(chunk);
      }
    }
  }

  /**
   * Deal with one code.
   *
   * @param {Code} code
   *   Code.
   * @returns {undefined}
   *   Nothing.
   */
  function go(code) {
    consumed = undefined;
    expectedCode = code;
    state = state(code);
  }

  /** @type {Effects['consume']} */
  function consume(code) {
    if (markdownLineEnding(code)) {
      point.line++;
      point.column = 1;
      point.offset += code === -3 ? 2 : 1;
      accountForPotentialSkip();
    } else if (code !== -1) {
      point.column++;
      point.offset++;
    }

    // Not in a string chunk.
    if (point._bufferIndex < 0) {
      point._index++;
    } else {
      point._bufferIndex++;

      // At end of string chunk.
      if (point._bufferIndex ===
      // Points w/ non-negative `_bufferIndex` reference
      // strings.
      /** @type {string} */
      chunks[point._index].length) {
        point._bufferIndex = -1;
        point._index++;
      }
    }

    // Expose the previous character.
    context.previous = code;

    // Mark as consumed.
    consumed = true;
  }

  /** @type {Effects['enter']} */
  function enter(type, fields) {
    /** @type {Token} */
    // @ts-expect-error Patch instead of assign required fields to help GC.
    const token = fields || {};
    token.type = type;
    token.start = now();
    context.events.push(['enter', token, context]);
    stack.push(token);
    return token;
  }

  /** @type {Effects['exit']} */
  function exit(type) {
    const token = stack.pop();
    token.end = now();
    context.events.push(['exit', token, context]);
    return token;
  }

  /**
   * Use results.
   *
   * @type {ReturnHandle}
   */
  function onsuccessfulconstruct(construct, info) {
    addResult(construct, info.from);
  }

  /**
   * Discard results.
   *
   * @type {ReturnHandle}
   */
  function onsuccessfulcheck(_, info) {
    info.restore();
  }

  /**
   * Factory to attempt/check/interrupt.
   *
   * @param {ReturnHandle} onreturn
   *   Callback.
   * @param {{interrupt?: boolean | undefined} | undefined} [fields]
   *   Fields.
   */
  function constructFactory(onreturn, fields) {
    return hook;

    /**
     * Handle either an object mapping codes to constructs, a list of
     * constructs, or a single construct.
     *
     * @param {Array<Construct> | ConstructRecord | Construct} constructs
     *   Constructs.
     * @param {State} returnState
     *   State.
     * @param {State | undefined} [bogusState]
     *   State.
     * @returns {State}
     *   State.
     */
    function hook(constructs, returnState, bogusState) {
      /** @type {ReadonlyArray<Construct>} */
      let listOfConstructs;
      /** @type {number} */
      let constructIndex;
      /** @type {Construct} */
      let currentConstruct;
      /** @type {Info} */
      let info;
      return Array.isArray(constructs) ? /* c8 ignore next 1 */
      handleListOfConstructs(constructs) : 'tokenize' in constructs ?
      // Looks like a construct.
      handleListOfConstructs([(/** @type {Construct} */constructs)]) : handleMapOfConstructs(constructs);

      /**
       * Handle a list of construct.
       *
       * @param {ConstructRecord} map
       *   Constructs.
       * @returns {State}
       *   State.
       */
      function handleMapOfConstructs(map) {
        return start;

        /** @type {State} */
        function start(code) {
          const left = code !== null && map[code];
          const all = code !== null && map.null;
          const list = [
          // To do: add more extension tests.
          /* c8 ignore next 2 */
          ...(Array.isArray(left) ? left : left ? [left] : []), ...(Array.isArray(all) ? all : all ? [all] : [])];
          return handleListOfConstructs(list)(code);
        }
      }

      /**
       * Handle a list of construct.
       *
       * @param {ReadonlyArray<Construct>} list
       *   Constructs.
       * @returns {State}
       *   State.
       */
      function handleListOfConstructs(list) {
        listOfConstructs = list;
        constructIndex = 0;
        if (list.length === 0) {
          return bogusState;
        }
        return handleConstruct(list[constructIndex]);
      }

      /**
       * Handle a single construct.
       *
       * @param {Construct} construct
       *   Construct.
       * @returns {State}
       *   State.
       */
      function handleConstruct(construct) {
        return start;

        /** @type {State} */
        function start(code) {
          // To do: not needed to store if there is no bogus state, probably?
          // Currently doesn’t work because `inspect` in document does a check
          // w/o a bogus, which doesn’t make sense. But it does seem to help perf
          // by not storing.
          info = store();
          currentConstruct = construct;
          if (!construct.partial) {
            context.currentConstruct = construct;
          }

          // Always populated by defaults.

          if (construct.name && context.parser.constructs.disable.null.includes(construct.name)) {
            return nok(code);
          }
          return construct.tokenize.call(
          // If we do have fields, create an object w/ `context` as its
          // prototype.
          // This allows a “live binding”, which is needed for `interrupt`.
          fields ? Object.assign(Object.create(context), fields) : context, effects, ok, nok)(code);
        }
      }

      /** @type {State} */
      function ok(code) {
        consumed = true;
        onreturn(currentConstruct, info);
        return returnState;
      }

      /** @type {State} */
      function nok(code) {
        consumed = true;
        info.restore();
        if (++constructIndex < listOfConstructs.length) {
          return handleConstruct(listOfConstructs[constructIndex]);
        }
        return bogusState;
      }
    }
  }

  /**
   * @param {Construct} construct
   *   Construct.
   * @param {number} from
   *   From.
   * @returns {undefined}
   *   Nothing.
   */
  function addResult(construct, from) {
    if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
      resolveAllConstructs.push(construct);
    }
    if (construct.resolve) {
      splice(context.events, from, context.events.length - from, construct.resolve(context.events.slice(from), context));
    }
    if (construct.resolveTo) {
      context.events = construct.resolveTo(context.events, context);
    }
  }

  /**
   * Store state.
   *
   * @returns {Info}
   *   Info.
   */
  function store() {
    const startPoint = now();
    const startPrevious = context.previous;
    const startCurrentConstruct = context.currentConstruct;
    const startEventsIndex = context.events.length;
    const startStack = Array.from(stack);
    return {
      from: startEventsIndex,
      restore
    };

    /**
     * Restore state.
     *
     * @returns {undefined}
     *   Nothing.
     */
    function restore() {
      point = startPoint;
      context.previous = startPrevious;
      context.currentConstruct = startCurrentConstruct;
      context.events.length = startEventsIndex;
      stack = startStack;
      accountForPotentialSkip();
    }
  }

  /**
   * Move the current point a bit forward in the line when it’s on a column
   * skip.
   *
   * @returns {undefined}
   *   Nothing.
   */
  function accountForPotentialSkip() {
    if (point.line in columnStart && point.column < 2) {
      point.column = columnStart[point.line];
      point.offset += columnStart[point.line] - 1;
    }
  }
}

/**
 * Get the chunks from a slice of chunks in the range of a token.
 *
 * @param {ReadonlyArray<Chunk>} chunks
 *   Chunks.
 * @param {Pick<Token, 'end' | 'start'>} token
 *   Token.
 * @returns {Array<Chunk>}
 *   Chunks.
 */
function sliceChunks(chunks, token) {
  const startIndex = token.start._index;
  const startBufferIndex = token.start._bufferIndex;
  const endIndex = token.end._index;
  const endBufferIndex = token.end._bufferIndex;
  /** @type {Array<Chunk>} */
  let view;
  if (startIndex === endIndex) {
    // @ts-expect-error `_bufferIndex` is used on string chunks.
    view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
  } else {
    view = chunks.slice(startIndex, endIndex);
    if (startBufferIndex > -1) {
      const head = view[0];
      if (typeof head === 'string') {
        view[0] = head.slice(startBufferIndex);
        /* c8 ignore next 4 -- used to be used, no longer */
      } else {
        view.shift();
      }
    }
    if (endBufferIndex > 0) {
      // @ts-expect-error `_bufferIndex` is used on string chunks.
      view.push(chunks[endIndex].slice(0, endBufferIndex));
    }
  }
  return view;
}

/**
 * Get the string value of a slice of chunks.
 *
 * @param {ReadonlyArray<Chunk>} chunks
 *   Chunks.
 * @param {boolean | undefined} [expandTabs=false]
 *   Whether to expand tabs (default: `false`).
 * @returns {string}
 *   Result.
 */
function serializeChunks(chunks, expandTabs) {
  let index = -1;
  /** @type {Array<string>} */
  const result = [];
  /** @type {boolean | undefined} */
  let atTab;
  while (++index < chunks.length) {
    const chunk = chunks[index];
    /** @type {string} */
    let value;
    if (typeof chunk === 'string') {
      value = chunk;
    } else switch (chunk) {
      case -5:
        {
          value = "\r";
          break;
        }
      case -4:
        {
          value = "\n";
          break;
        }
      case -3:
        {
          value = "\r" + "\n";
          break;
        }
      case -2:
        {
          value = expandTabs ? " " : "\t";
          break;
        }
      case -1:
        {
          if (!expandTabs && atTab) continue;
          value = " ";
          break;
        }
      default:
        {
          // Currently only replacement character.
          value = String.fromCharCode(chunk);
        }
    }
    atTab = chunk === -2;
    result.push(value);
  }
  return result.join('');
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/parse.js
/**
 * @import {
 *   Create,
 *   FullNormalizedExtension,
 *   InitialConstruct,
 *   ParseContext,
 *   ParseOptions
 * } from 'micromark-util-types'
 */









/**
 * @param {ParseOptions | null | undefined} [options]
 *   Configuration (optional).
 * @returns {ParseContext}
 *   Parser.
 */
function parse(options) {
  const settings = options || {};
  const constructs = /** @type {FullNormalizedExtension} */
  combineExtensions([constructs_namespaceObject, ...(settings.extensions || [])]);

  /** @type {ParseContext} */
  const parser = {
    constructs,
    content: create(content),
    defined: [],
    document: create(document_document),
    flow: create(flow),
    lazy: {},
    string: create(string),
    text: create(text_text)
  };
  return parser;

  /**
   * @param {InitialConstruct} initial
   *   Construct to start with.
   * @returns {Create}
   *   Create a tokenizer.
   */
  function create(initial) {
    return creator;
    /** @type {Create} */
    function creator(from) {
      return createTokenizer(parser, initial, from);
    }
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/preprocess.js
/**
 * @import {Chunk, Code, Encoding, Value} from 'micromark-util-types'
 */

/**
 * @callback Preprocessor
 *   Preprocess a value.
 * @param {Value} value
 *   Value.
 * @param {Encoding | null | undefined} [encoding]
 *   Encoding when `value` is a typed array (optional).
 * @param {boolean | null | undefined} [end=false]
 *   Whether this is the last chunk (default: `false`).
 * @returns {Array<Chunk>}
 *   Chunks.
 */

const search = /[\0\t\n\r]/g;

/**
 * @returns {Preprocessor}
 *   Preprocess a value.
 */
function preprocess() {
  let column = 1;
  let buffer = '';
  /** @type {boolean | undefined} */
  let start = true;
  /** @type {boolean | undefined} */
  let atCarriageReturn;
  return preprocessor;

  /** @type {Preprocessor} */
  // eslint-disable-next-line complexity
  function preprocessor(value, encoding, end) {
    /** @type {Array<Chunk>} */
    const chunks = [];
    /** @type {RegExpMatchArray | null} */
    let match;
    /** @type {number} */
    let next;
    /** @type {number} */
    let startPosition;
    /** @type {number} */
    let endPosition;
    /** @type {Code} */
    let code;
    value = buffer + (typeof value === 'string' ? value.toString() : new TextDecoder(encoding || undefined).decode(value));
    startPosition = 0;
    buffer = '';
    if (start) {
      // To do: `markdown-rs` actually parses BOMs (byte order mark).
      if (value.charCodeAt(0) === 65279) {
        startPosition++;
      }
      start = undefined;
    }
    while (startPosition < value.length) {
      search.lastIndex = startPosition;
      match = search.exec(value);
      endPosition = match && match.index !== undefined ? match.index : value.length;
      code = value.charCodeAt(endPosition);
      if (!match) {
        buffer = value.slice(startPosition);
        break;
      }
      if (code === 10 && startPosition === endPosition && atCarriageReturn) {
        chunks.push(-3);
        atCarriageReturn = undefined;
      } else {
        if (atCarriageReturn) {
          chunks.push(-5);
          atCarriageReturn = undefined;
        }
        if (startPosition < endPosition) {
          chunks.push(value.slice(startPosition, endPosition));
          column += endPosition - startPosition;
        }
        switch (code) {
          case 0:
            {
              chunks.push(65533);
              column++;
              break;
            }
          case 9:
            {
              next = Math.ceil(column / 4) * 4;
              chunks.push(-2);
              while (column++ < next) chunks.push(-1);
              break;
            }
          case 10:
            {
              chunks.push(-4);
              column = 1;
              break;
            }
          default:
            {
              atCarriageReturn = true;
              column = 1;
            }
        }
      }
      startPosition = endPosition + 1;
    }
    if (end) {
      if (atCarriageReturn) chunks.push(-5);
      if (buffer) chunks.push(buffer);
      chunks.push(null);
    }
    return chunks;
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-util-decode-numeric-character-reference@2.0.2/node_modules/micromark-util-decode-numeric-character-reference/index.js
/**
 * Turn the number (in string form as either hexa- or plain decimal) coming from
 * a numeric character reference into a character.
 *
 * Sort of like `String.fromCodePoint(Number.parseInt(value, base))`, but makes
 * non-characters and control characters safe.
 *
 * @param {string} value
 *   Value to decode.
 * @param {number} base
 *   Numeric base.
 * @returns {string}
 *   Character.
 */
function decodeNumericCharacterReference(value, base) {
  const code = Number.parseInt(value, base);
  if (
  // C0 except for HT, LF, FF, CR, space.
  code < 9 || code === 11 || code > 13 && code < 32 ||
  // Control character (DEL) of C0, and C1 controls.
  code > 126 && code < 160 ||
  // Lone high surrogates and low surrogates.
  code > 55_295 && code < 57_344 ||
  // Noncharacters.
  code > 64_975 && code < 65_008 || /* eslint-disable no-bitwise */
  (code & 65_535) === 65_535 || (code & 65_535) === 65_534 || /* eslint-enable no-bitwise */
  // Out of range
  code > 1_114_111) {
    return "\uFFFD";
  }
  return String.fromCodePoint(code);
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-util-decode-string@2.0.1/node_modules/micromark-util-decode-string/index.js


const characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;

/**
 * Decode markdown strings (which occur in places such as fenced code info
 * strings, destinations, labels, and titles).
 *
 * The “string” content type allows character escapes and -references.
 * This decodes those.
 *
 * @param {string} value
 *   Value to decode.
 * @returns {string}
 *   Decoded value.
 */
function decodeString(value) {
  return value.replace(characterEscapeOrReference, decode);
}

/**
 * @param {string} $0
 *   Match.
 * @param {string} $1
 *   Character escape.
 * @param {string} $2
 *   Character reference.
 * @returns {string}
 *   Decoded value
 */
function decode($0, $1, $2) {
  if ($1) {
    // Escape.
    return $1;
  }

  // Reference.
  const head = $2.charCodeAt(0);
  if (head === 35) {
    const head = $2.charCodeAt(1);
    const hex = head === 120 || head === 88;
    return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10);
  }
  return (0,index_dom/* decodeNamedCharacterReference */.T)($2) || $0;
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-from-markdown@2.0.2/node_modules/mdast-util-from-markdown/lib/index.js
/**
 * @import {
 *   Break,
 *   Blockquote,
 *   Code,
 *   Definition,
 *   Emphasis,
 *   Heading,
 *   Html,
 *   Image,
 *   InlineCode,
 *   Link,
 *   ListItem,
 *   List,
 *   Nodes,
 *   Paragraph,
 *   PhrasingContent,
 *   ReferenceType,
 *   Root,
 *   Strong,
 *   Text,
 *   ThematicBreak
 * } from 'mdast'
 * @import {
 *   Encoding,
 *   Event,
 *   Token,
 *   Value
 * } from 'micromark-util-types'
 * @import {Point} from 'unist'
 * @import {
 *   CompileContext,
 *   CompileData,
 *   Config,
 *   Extension,
 *   Handle,
 *   OnEnterError,
 *   Options
 * } from './types.js'
 */








const lib_own = {}.hasOwnProperty;

/**
 * Turn markdown into a syntax tree.
 *
 * @overload
 * @param {Value} value
 * @param {Encoding | null | undefined} [encoding]
 * @param {Options | null | undefined} [options]
 * @returns {Root}
 *
 * @overload
 * @param {Value} value
 * @param {Options | null | undefined} [options]
 * @returns {Root}
 *
 * @param {Value} value
 *   Markdown to parse.
 * @param {Encoding | Options | null | undefined} [encoding]
 *   Character encoding for when `value` is `Buffer`.
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns {Root}
 *   mdast tree.
 */
function fromMarkdown(value, encoding, options) {
  if (typeof encoding !== 'string') {
    options = encoding;
    encoding = undefined;
  }
  return compiler(options)(postprocess(parse(options).document().write(preprocess()(value, encoding, true))));
}

/**
 * Note this compiler only understand complete buffering, not streaming.
 *
 * @param {Options | null | undefined} [options]
 */
function compiler(options) {
  /** @type {Config} */
  const config = {
    transforms: [],
    canContainEols: ['emphasis', 'fragment', 'heading', 'paragraph', 'strong'],
    enter: {
      autolink: opener(link),
      autolinkProtocol: onenterdata,
      autolinkEmail: onenterdata,
      atxHeading: opener(heading),
      blockQuote: opener(blockQuote),
      characterEscape: onenterdata,
      characterReference: onenterdata,
      codeFenced: opener(codeFlow),
      codeFencedFenceInfo: buffer,
      codeFencedFenceMeta: buffer,
      codeIndented: opener(codeFlow, buffer),
      codeText: opener(codeText, buffer),
      codeTextData: onenterdata,
      data: onenterdata,
      codeFlowValue: onenterdata,
      definition: opener(definition),
      definitionDestinationString: buffer,
      definitionLabelString: buffer,
      definitionTitleString: buffer,
      emphasis: opener(emphasis),
      hardBreakEscape: opener(hardBreak),
      hardBreakTrailing: opener(hardBreak),
      htmlFlow: opener(html, buffer),
      htmlFlowData: onenterdata,
      htmlText: opener(html, buffer),
      htmlTextData: onenterdata,
      image: opener(image),
      label: buffer,
      link: opener(link),
      listItem: opener(listItem),
      listItemValue: onenterlistitemvalue,
      listOrdered: opener(list, onenterlistordered),
      listUnordered: opener(list),
      paragraph: opener(paragraph),
      reference: onenterreference,
      referenceString: buffer,
      resourceDestinationString: buffer,
      resourceTitleString: buffer,
      setextHeading: opener(heading),
      strong: opener(strong),
      thematicBreak: opener(thematicBreak)
    },
    exit: {
      atxHeading: closer(),
      atxHeadingSequence: onexitatxheadingsequence,
      autolink: closer(),
      autolinkEmail: onexitautolinkemail,
      autolinkProtocol: onexitautolinkprotocol,
      blockQuote: closer(),
      characterEscapeValue: onexitdata,
      characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
      characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
      characterReferenceValue: onexitcharacterreferencevalue,
      characterReference: onexitcharacterreference,
      codeFenced: closer(onexitcodefenced),
      codeFencedFence: onexitcodefencedfence,
      codeFencedFenceInfo: onexitcodefencedfenceinfo,
      codeFencedFenceMeta: onexitcodefencedfencemeta,
      codeFlowValue: onexitdata,
      codeIndented: closer(onexitcodeindented),
      codeText: closer(onexitcodetext),
      codeTextData: onexitdata,
      data: onexitdata,
      definition: closer(),
      definitionDestinationString: onexitdefinitiondestinationstring,
      definitionLabelString: onexitdefinitionlabelstring,
      definitionTitleString: onexitdefinitiontitlestring,
      emphasis: closer(),
      hardBreakEscape: closer(onexithardbreak),
      hardBreakTrailing: closer(onexithardbreak),
      htmlFlow: closer(onexithtmlflow),
      htmlFlowData: onexitdata,
      htmlText: closer(onexithtmltext),
      htmlTextData: onexitdata,
      image: closer(onexitimage),
      label: onexitlabel,
      labelText: onexitlabeltext,
      lineEnding: onexitlineending,
      link: closer(onexitlink),
      listItem: closer(),
      listOrdered: closer(),
      listUnordered: closer(),
      paragraph: closer(),
      referenceString: onexitreferencestring,
      resourceDestinationString: onexitresourcedestinationstring,
      resourceTitleString: onexitresourcetitlestring,
      resource: onexitresource,
      setextHeading: closer(onexitsetextheading),
      setextHeadingLineSequence: onexitsetextheadinglinesequence,
      setextHeadingText: onexitsetextheadingtext,
      strong: closer(),
      thematicBreak: closer()
    }
  };
  configure(config, (options || {}).mdastExtensions || []);

  /** @type {CompileData} */
  const data = {};
  return compile;

  /**
   * Turn micromark events into an mdast tree.
   *
   * @param {Array<Event>} events
   *   Events.
   * @returns {Root}
   *   mdast tree.
   */
  function compile(events) {
    /** @type {Root} */
    let tree = {
      type: 'root',
      children: []
    };
    /** @type {Omit<CompileContext, 'sliceSerialize'>} */
    const context = {
      stack: [tree],
      tokenStack: [],
      config,
      enter,
      exit,
      buffer,
      resume,
      data
    };
    /** @type {Array<number>} */
    const listStack = [];
    let index = -1;
    while (++index < events.length) {
      // We preprocess lists to add `listItem` tokens, and to infer whether
      // items the list itself are spread out.
      if (events[index][1].type === "listOrdered" || events[index][1].type === "listUnordered") {
        if (events[index][0] === 'enter') {
          listStack.push(index);
        } else {
          const tail = listStack.pop();
          index = prepareList(events, tail, index);
        }
      }
    }
    index = -1;
    while (++index < events.length) {
      const handler = config[events[index][0]];
      if (lib_own.call(handler, events[index][1].type)) {
        handler[events[index][1].type].call(Object.assign({
          sliceSerialize: events[index][2].sliceSerialize
        }, context), events[index][1]);
      }
    }

    // Handle tokens still being open.
    if (context.tokenStack.length > 0) {
      const tail = context.tokenStack[context.tokenStack.length - 1];
      const handler = tail[1] || defaultOnError;
      handler.call(context, undefined, tail[0]);
    }

    // Figure out `root` position.
    tree.position = {
      start: mdast_util_from_markdown_lib_point(events.length > 0 ? events[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: mdast_util_from_markdown_lib_point(events.length > 0 ? events[events.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    };

    // Call transforms.
    index = -1;
    while (++index < config.transforms.length) {
      tree = config.transforms[index](tree) || tree;
    }
    return tree;
  }

  /**
   * @param {Array<Event>} events
   * @param {number} start
   * @param {number} length
   * @returns {number}
   */
  function prepareList(events, start, length) {
    let index = start - 1;
    let containerBalance = -1;
    let listSpread = false;
    /** @type {Token | undefined} */
    let listItem;
    /** @type {number | undefined} */
    let lineIndex;
    /** @type {number | undefined} */
    let firstBlankLineIndex;
    /** @type {boolean | undefined} */
    let atMarker;
    while (++index <= length) {
      const event = events[index];
      switch (event[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote":
          {
            if (event[0] === 'enter') {
              containerBalance++;
            } else {
              containerBalance--;
            }
            atMarker = undefined;
            break;
          }
        case "lineEndingBlank":
          {
            if (event[0] === 'enter') {
              if (listItem && !atMarker && !containerBalance && !firstBlankLineIndex) {
                firstBlankLineIndex = index;
              }
              atMarker = undefined;
            }
            break;
          }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          {
            // Empty.

            break;
          }
        default:
          {
            atMarker = undefined;
          }
      }
      if (!containerBalance && event[0] === 'enter' && event[1].type === "listItemPrefix" || containerBalance === -1 && event[0] === 'exit' && (event[1].type === "listUnordered" || event[1].type === "listOrdered")) {
        if (listItem) {
          let tailIndex = index;
          lineIndex = undefined;
          while (tailIndex--) {
            const tailEvent = events[tailIndex];
            if (tailEvent[1].type === "lineEnding" || tailEvent[1].type === "lineEndingBlank") {
              if (tailEvent[0] === 'exit') continue;
              if (lineIndex) {
                events[lineIndex][1].type = "lineEndingBlank";
                listSpread = true;
              }
              tailEvent[1].type = "lineEnding";
              lineIndex = tailIndex;
            } else if (tailEvent[1].type === "linePrefix" || tailEvent[1].type === "blockQuotePrefix" || tailEvent[1].type === "blockQuotePrefixWhitespace" || tailEvent[1].type === "blockQuoteMarker" || tailEvent[1].type === "listItemIndent") {
              // Empty
            } else {
              break;
            }
          }
          if (firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex)) {
            listItem._spread = true;
          }

          // Fix position.
          listItem.end = Object.assign({}, lineIndex ? events[lineIndex][1].start : event[1].end);
          events.splice(lineIndex || index, 0, ['exit', listItem, event[2]]);
          index++;
          length++;
        }

        // Create a new list item.
        if (event[1].type === "listItemPrefix") {
          /** @type {Token} */
          const item = {
            type: 'listItem',
            _spread: false,
            start: Object.assign({}, event[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: undefined
          };
          listItem = item;
          events.splice(index, 0, ['enter', item, event[2]]);
          index++;
          length++;
          firstBlankLineIndex = undefined;
          atMarker = true;
        }
      }
    }
    events[start][1]._spread = listSpread;
    return length;
  }

  /**
   * Create an opener handle.
   *
   * @param {(token: Token) => Nodes} create
   *   Create a node.
   * @param {Handle | undefined} [and]
   *   Optional function to also run.
   * @returns {Handle}
   *   Handle.
   */
  function opener(create, and) {
    return open;

    /**
     * @this {CompileContext}
     * @param {Token} token
     * @returns {undefined}
     */
    function open(token) {
      enter.call(this, create(token), token);
      if (and) and.call(this, token);
    }
  }

  /**
   * @type {CompileContext['buffer']}
   */
  function buffer() {
    this.stack.push({
      type: 'fragment',
      children: []
    });
  }

  /**
   * @type {CompileContext['enter']}
   */
  function enter(node, token, errorHandler) {
    const parent = this.stack[this.stack.length - 1];
    /** @type {Array<Nodes>} */
    const siblings = parent.children;
    siblings.push(node);
    this.stack.push(node);
    this.tokenStack.push([token, errorHandler || undefined]);
    node.position = {
      start: mdast_util_from_markdown_lib_point(token.start),
      // @ts-expect-error: `end` will be patched later.
      end: undefined
    };
  }

  /**
   * Create a closer handle.
   *
   * @param {Handle | undefined} [and]
   *   Optional function to also run.
   * @returns {Handle}
   *   Handle.
   */
  function closer(and) {
    return close;

    /**
     * @this {CompileContext}
     * @param {Token} token
     * @returns {undefined}
     */
    function close(token) {
      if (and) and.call(this, token);
      exit.call(this, token);
    }
  }

  /**
   * @type {CompileContext['exit']}
   */
  function exit(token, onExitError) {
    const node = this.stack.pop();
    const open = this.tokenStack.pop();
    if (!open) {
      throw new Error('Cannot close `' + token.type + '` (' + stringifyPosition({
        start: token.start,
        end: token.end
      }) + '): it’s not open');
    } else if (open[0].type !== token.type) {
      if (onExitError) {
        onExitError.call(this, token, open[0]);
      } else {
        const handler = open[1] || defaultOnError;
        handler.call(this, token, open[0]);
      }
    }
    node.position.end = mdast_util_from_markdown_lib_point(token.end);
  }

  /**
   * @type {CompileContext['resume']}
   */
  function resume() {
    return lib_toString(this.stack.pop());
  }

  //
  // Handlers.
  //

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterlistordered() {
    this.data.expectingFirstListItemValue = true;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterlistitemvalue(token) {
    if (this.data.expectingFirstListItemValue) {
      const ancestor = this.stack[this.stack.length - 2];
      ancestor.start = Number.parseInt(this.sliceSerialize(token), 10);
      this.data.expectingFirstListItemValue = undefined;
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfenceinfo() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.lang = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfencemeta() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.meta = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfence() {
    // Exit if this is the closing fence.
    if (this.data.flowCodeInside) return;
    this.buffer();
    this.data.flowCodeInside = true;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefenced() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.value = data.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, '');
    this.data.flowCodeInside = undefined;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodeindented() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.value = data.replace(/(\r?\n|\r)$/g, '');
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitionlabelstring(token) {
    const label = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.label = label;
    node.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitiontitlestring() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.title = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitiondestinationstring() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.url = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitatxheadingsequence(token) {
    const node = this.stack[this.stack.length - 1];
    if (!node.depth) {
      const depth = this.sliceSerialize(token).length;
      node.depth = depth;
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheadingtext() {
    this.data.setextHeadingSlurpLineEnding = true;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheadinglinesequence(token) {
    const node = this.stack[this.stack.length - 1];
    node.depth = this.sliceSerialize(token).codePointAt(0) === 61 ? 1 : 2;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheading() {
    this.data.setextHeadingSlurpLineEnding = undefined;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onenterdata(token) {
    const node = this.stack[this.stack.length - 1];
    /** @type {Array<Nodes>} */
    const siblings = node.children;
    let tail = siblings[siblings.length - 1];
    if (!tail || tail.type !== 'text') {
      // Add a new text node.
      tail = text();
      tail.position = {
        start: mdast_util_from_markdown_lib_point(token.start),
        // @ts-expect-error: we’ll add `end` later.
        end: undefined
      };
      siblings.push(tail);
    }
    this.stack.push(tail);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitdata(token) {
    const tail = this.stack.pop();
    tail.value += this.sliceSerialize(token);
    tail.position.end = mdast_util_from_markdown_lib_point(token.end);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlineending(token) {
    const context = this.stack[this.stack.length - 1];
    // If we’re at a hard break, include the line ending in there.
    if (this.data.atHardBreak) {
      const tail = context.children[context.children.length - 1];
      tail.position.end = mdast_util_from_markdown_lib_point(token.end);
      this.data.atHardBreak = undefined;
      return;
    }
    if (!this.data.setextHeadingSlurpLineEnding && config.canContainEols.includes(context.type)) {
      onenterdata.call(this, token);
      onexitdata.call(this, token);
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexithardbreak() {
    this.data.atHardBreak = true;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexithtmlflow() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.value = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexithtmltext() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.value = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitcodetext() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.value = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlink() {
    const node = this.stack[this.stack.length - 1];
    // Note: there are also `identifier` and `label` fields on this link node!
    // These are used / cleaned here.

    // To do: clean.
    if (this.data.inReference) {
      /** @type {ReferenceType} */
      const referenceType = this.data.referenceType || 'shortcut';
      node.type += 'Reference';
      // @ts-expect-error: mutate.
      node.referenceType = referenceType;
      // @ts-expect-error: mutate.
      delete node.url;
      delete node.title;
    } else {
      // @ts-expect-error: mutate.
      delete node.identifier;
      // @ts-expect-error: mutate.
      delete node.label;
    }
    this.data.referenceType = undefined;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitimage() {
    const node = this.stack[this.stack.length - 1];
    // Note: there are also `identifier` and `label` fields on this link node!
    // These are used / cleaned here.

    // To do: clean.
    if (this.data.inReference) {
      /** @type {ReferenceType} */
      const referenceType = this.data.referenceType || 'shortcut';
      node.type += 'Reference';
      // @ts-expect-error: mutate.
      node.referenceType = referenceType;
      // @ts-expect-error: mutate.
      delete node.url;
      delete node.title;
    } else {
      // @ts-expect-error: mutate.
      delete node.identifier;
      // @ts-expect-error: mutate.
      delete node.label;
    }
    this.data.referenceType = undefined;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlabeltext(token) {
    const string = this.sliceSerialize(token);
    const ancestor = this.stack[this.stack.length - 2];
    // @ts-expect-error: stash this on the node, as it might become a reference
    // later.
    ancestor.label = decodeString(string);
    // @ts-expect-error: same as above.
    ancestor.identifier = normalizeIdentifier(string).toLowerCase();
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlabel() {
    const fragment = this.stack[this.stack.length - 1];
    const value = this.resume();
    const node = this.stack[this.stack.length - 1];
    // Assume a reference.
    this.data.inReference = true;
    if (node.type === 'link') {
      /** @type {Array<PhrasingContent>} */
      const children = fragment.children;
      node.children = children;
    } else {
      node.alt = value;
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitresourcedestinationstring() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.url = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitresourcetitlestring() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.title = data;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitresource() {
    this.data.inReference = undefined;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onenterreference() {
    this.data.referenceType = 'collapsed';
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitreferencestring(token) {
    const label = this.resume();
    const node = this.stack[this.stack.length - 1];
    // @ts-expect-error: stash this on the node, as it might become a reference
    // later.
    node.label = label;
    // @ts-expect-error: same as above.
    node.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
    this.data.referenceType = 'full';
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitcharacterreferencemarker(token) {
    this.data.characterReferenceType = token.type;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcharacterreferencevalue(token) {
    const data = this.sliceSerialize(token);
    const type = this.data.characterReferenceType;
    /** @type {string} */
    let value;
    if (type) {
      value = decodeNumericCharacterReference(data, type === "characterReferenceMarkerNumeric" ? 10 : 16);
      this.data.characterReferenceType = undefined;
    } else {
      const result = (0,index_dom/* decodeNamedCharacterReference */.T)(data);
      value = result;
    }
    const tail = this.stack[this.stack.length - 1];
    tail.value += value;
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcharacterreference(token) {
    const tail = this.stack.pop();
    tail.position.end = mdast_util_from_markdown_lib_point(token.end);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitautolinkprotocol(token) {
    onexitdata.call(this, token);
    const node = this.stack[this.stack.length - 1];
    node.url = this.sliceSerialize(token);
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitautolinkemail(token) {
    onexitdata.call(this, token);
    const node = this.stack[this.stack.length - 1];
    node.url = 'mailto:' + this.sliceSerialize(token);
  }

  //
  // Creaters.
  //

  /** @returns {Blockquote} */
  function blockQuote() {
    return {
      type: 'blockquote',
      children: []
    };
  }

  /** @returns {Code} */
  function codeFlow() {
    return {
      type: 'code',
      lang: null,
      meta: null,
      value: ''
    };
  }

  /** @returns {InlineCode} */
  function codeText() {
    return {
      type: 'inlineCode',
      value: ''
    };
  }

  /** @returns {Definition} */
  function definition() {
    return {
      type: 'definition',
      identifier: '',
      label: null,
      title: null,
      url: ''
    };
  }

  /** @returns {Emphasis} */
  function emphasis() {
    return {
      type: 'emphasis',
      children: []
    };
  }

  /** @returns {Heading} */
  function heading() {
    return {
      type: 'heading',
      // @ts-expect-error `depth` will be set later.
      depth: 0,
      children: []
    };
  }

  /** @returns {Break} */
  function hardBreak() {
    return {
      type: 'break'
    };
  }

  /** @returns {Html} */
  function html() {
    return {
      type: 'html',
      value: ''
    };
  }

  /** @returns {Image} */
  function image() {
    return {
      type: 'image',
      title: null,
      url: '',
      alt: null
    };
  }

  /** @returns {Link} */
  function link() {
    return {
      type: 'link',
      title: null,
      url: '',
      children: []
    };
  }

  /**
   * @param {Token} token
   * @returns {List}
   */
  function list(token) {
    return {
      type: 'list',
      ordered: token.type === 'listOrdered',
      start: null,
      spread: token._spread,
      children: []
    };
  }

  /**
   * @param {Token} token
   * @returns {ListItem}
   */
  function listItem(token) {
    return {
      type: 'listItem',
      spread: token._spread,
      checked: null,
      children: []
    };
  }

  /** @returns {Paragraph} */
  function paragraph() {
    return {
      type: 'paragraph',
      children: []
    };
  }

  /** @returns {Strong} */
  function strong() {
    return {
      type: 'strong',
      children: []
    };
  }

  /** @returns {Text} */
  function text() {
    return {
      type: 'text',
      value: ''
    };
  }

  /** @returns {ThematicBreak} */
  function thematicBreak() {
    return {
      type: 'thematicBreak'
    };
  }
}

/**
 * Copy a point-like value.
 *
 * @param {Point} d
 *   Point-like value.
 * @returns {Point}
 *   unist point.
 */
function mdast_util_from_markdown_lib_point(d) {
  return {
    line: d.line,
    column: d.column,
    offset: d.offset
  };
}

/**
 * @param {Config} combined
 * @param {Array<Array<Extension> | Extension>} extensions
 * @returns {undefined}
 */
function configure(combined, extensions) {
  let index = -1;
  while (++index < extensions.length) {
    const value = extensions[index];
    if (Array.isArray(value)) {
      configure(combined, value);
    } else {
      extension(combined, value);
    }
  }
}

/**
 * @param {Config} combined
 * @param {Extension} extension
 * @returns {undefined}
 */
function extension(combined, extension) {
  /** @type {keyof Extension} */
  let key;
  for (key in extension) {
    if (lib_own.call(extension, key)) {
      switch (key) {
        case 'canContainEols':
          {
            const right = extension[key];
            if (right) {
              combined[key].push(...right);
            }
            break;
          }
        case 'transforms':
          {
            const right = extension[key];
            if (right) {
              combined[key].push(...right);
            }
            break;
          }
        case 'enter':
        case 'exit':
          {
            const right = extension[key];
            if (right) {
              Object.assign(combined[key], right);
            }
            break;
          }
        // No default
      }
    }
  }
}

/** @type {OnEnterError} */
function defaultOnError(left, right) {
  if (left) {
    throw new Error('Cannot close `' + left.type + '` (' + stringifyPosition({
      start: left.start,
      end: left.end
    }) + '): a different token (`' + right.type + '`, ' + stringifyPosition({
      start: right.start,
      end: right.end
    }) + ') is open');
  } else {
    throw new Error('Cannot close document, a token (`' + right.type + '`, ' + stringifyPosition({
      start: right.start,
      end: right.end
    }) + ') is still open');
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/remark-parse@11.0.0/node_modules/remark-parse/lib/index.js
/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast-util-from-markdown').Options} FromMarkdownOptions
 * @typedef {import('unified').Parser<Root>} Parser
 * @typedef {import('unified').Processor<Root>} Processor
 */

/**
 * @typedef {Omit<FromMarkdownOptions, 'extensions' | 'mdastExtensions'>} Options
 */



/**
 * Aadd support for parsing from markdown.
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns {undefined}
 *   Nothing.
 */
function remarkParse(options) {
  /** @type {Processor} */
  // @ts-expect-error: TS in JSDoc generates wrong types if `this` is typed regularly.
  const self = this

  self.parser = parser

  /**
   * @type {Parser}
   */
  function parser(doc) {
    return fromMarkdown(doc, {
      ...self.data('settings'),
      ...options,
      // Note: these options are not in the readme.
      // The goal is for them to be set by plugins on `data` instead of being
      // passed by users.
      extensions: self.data('micromarkExtensions') || [],
      mdastExtensions: self.data('fromMarkdownExtensions') || []
    })
  }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@ungap+structured-clone@1.3.0/node_modules/@ungap/structured-clone/esm/types.js
const VOID       = -1;
const PRIMITIVE  = 0;
const ARRAY      = 1;
const OBJECT     = 2;
const DATE       = 3;
const REGEXP     = 4;
const MAP        = 5;
const SET        = 6;
const ERROR      = 7;
const BIGINT     = 8;
// export const SYMBOL = 9;

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@ungap+structured-clone@1.3.0/node_modules/@ungap/structured-clone/esm/deserialize.js


const env = typeof self === 'object' ? self : globalThis;

const deserializer = ($, _) => {
  const as = (out, index) => {
    $.set(index, out);
    return out;
  };

  const unpair = index => {
    if ($.has(index))
      return $.get(index);

    const [type, value] = _[index];
    switch (type) {
      case PRIMITIVE:
      case VOID:
        return as(value, index);
      case ARRAY: {
        const arr = as([], index);
        for (const index of value)
          arr.push(unpair(index));
        return arr;
      }
      case OBJECT: {
        const object = as({}, index);
        for (const [key, index] of value)
          object[unpair(key)] = unpair(index);
        return object;
      }
      case DATE:
        return as(new Date(value), index);
      case REGEXP: {
        const {source, flags} = value;
        return as(new RegExp(source, flags), index);
      }
      case MAP: {
        const map = as(new Map, index);
        for (const [key, index] of value)
          map.set(unpair(key), unpair(index));
        return map;
      }
      case SET: {
        const set = as(new Set, index);
        for (const index of value)
          set.add(unpair(index));
        return set;
      }
      case ERROR: {
        const {name, message} = value;
        return as(new env[name](message), index);
      }
      case BIGINT:
        return as(BigInt(value), index);
      case 'BigInt':
        return as(Object(BigInt(value)), index);
      case 'ArrayBuffer':
        return as(new Uint8Array(value).buffer, value);
      case 'DataView': {
        const { buffer } = new Uint8Array(value);
        return as(new DataView(buffer), value);
      }
    }
    return as(new env[type](value), index);
  };

  return unpair;
};

/**
 * @typedef {Array<string,any>} Record a type representation
 */

/**
 * Returns a deserialized value from a serialized array of Records.
 * @param {Record[]} serialized a previously serialized value.
 * @returns {any}
 */
const deserialize = serialized => deserializer(new Map, serialized)(0);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@ungap+structured-clone@1.3.0/node_modules/@ungap/structured-clone/esm/serialize.js


const EMPTY = '';

const {toString: serialize_toString} = {};
const {keys} = Object;

const typeOf = value => {
  const type = typeof value;
  if (type !== 'object' || !value)
    return [PRIMITIVE, type];

  const asString = serialize_toString.call(value).slice(8, -1);
  switch (asString) {
    case 'Array':
      return [ARRAY, EMPTY];
    case 'Object':
      return [OBJECT, EMPTY];
    case 'Date':
      return [DATE, EMPTY];
    case 'RegExp':
      return [REGEXP, EMPTY];
    case 'Map':
      return [MAP, EMPTY];
    case 'Set':
      return [SET, EMPTY];
    case 'DataView':
      return [ARRAY, asString];
  }

  if (asString.includes('Array'))
    return [ARRAY, asString];

  if (asString.includes('Error'))
    return [ERROR, asString];

  return [OBJECT, asString];
};

const shouldSkip = ([TYPE, type]) => (
  TYPE === PRIMITIVE &&
  (type === 'function' || type === 'symbol')
);

const serializer = (strict, json, $, _) => {

  const as = (out, value) => {
    const index = _.push(out) - 1;
    $.set(value, index);
    return index;
  };

  const pair = value => {
    if ($.has(value))
      return $.get(value);

    let [TYPE, type] = typeOf(value);
    switch (TYPE) {
      case PRIMITIVE: {
        let entry = value;
        switch (type) {
          case 'bigint':
            TYPE = BIGINT;
            entry = value.toString();
            break;
          case 'function':
          case 'symbol':
            if (strict)
              throw new TypeError('unable to serialize ' + type);
            entry = null;
            break;
          case 'undefined':
            return as([VOID], value);
        }
        return as([TYPE, entry], value);
      }
      case ARRAY: {
        if (type) {
          let spread = value;
          if (type === 'DataView') {
            spread = new Uint8Array(value.buffer);
          }
          else if (type === 'ArrayBuffer') {
            spread = new Uint8Array(value);
          }
          return as([type, [...spread]], value);
        }

        const arr = [];
        const index = as([TYPE, arr], value);
        for (const entry of value)
          arr.push(pair(entry));
        return index;
      }
      case OBJECT: {
        if (type) {
          switch (type) {
            case 'BigInt':
              return as([type, value.toString()], value);
            case 'Boolean':
            case 'Number':
            case 'String':
              return as([type, value.valueOf()], value);
          }
        }

        if (json && ('toJSON' in value))
          return pair(value.toJSON());

        const entries = [];
        const index = as([TYPE, entries], value);
        for (const key of keys(value)) {
          if (strict || !shouldSkip(typeOf(value[key])))
            entries.push([pair(key), pair(value[key])]);
        }
        return index;
      }
      case DATE:
        return as([TYPE, value.toISOString()], value);
      case REGEXP: {
        const {source, flags} = value;
        return as([TYPE, {source, flags}], value);
      }
      case MAP: {
        const entries = [];
        const index = as([TYPE, entries], value);
        for (const [key, entry] of value) {
          if (strict || !(shouldSkip(typeOf(key)) || shouldSkip(typeOf(entry))))
            entries.push([pair(key), pair(entry)]);
        }
        return index;
      }
      case SET: {
        const entries = [];
        const index = as([TYPE, entries], value);
        for (const entry of value) {
          if (strict || !shouldSkip(typeOf(entry)))
            entries.push(pair(entry));
        }
        return index;
      }
    }

    const {message} = value;
    return as([TYPE, {name: type, message}], value);
  };

  return pair;
};

/**
 * @typedef {Array<string,any>} Record a type representation
 */

/**
 * Returns an array of serialized Records.
 * @param {any} value a serializable value.
 * @param {{json?: boolean, lossy?: boolean}?} options an object with a `lossy` or `json` property that,
 *  if `true`, will not throw errors on incompatible types, and behave more
 *  like JSON stringify would behave. Symbol and Function will be discarded.
 * @returns {Record[]}
 */
 const serialize = (value, {json, lossy} = {}) => {
  const _ = [];
  return serializer(!(json || lossy), !!json, new Map, _)(value), _;
};

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@ungap+structured-clone@1.3.0/node_modules/@ungap/structured-clone/esm/index.js



/**
 * @typedef {Array<string,any>} Record a type representation
 */

/**
 * Returns an array of serialized Records.
 * @param {any} any a serializable value.
 * @param {{transfer?: any[], json?: boolean, lossy?: boolean}?} options an object with
 * a transfer option (ignored when polyfilled) and/or non standard fields that
 * fallback to the polyfill if present.
 * @returns {Record[]}
 */
/* harmony default export */ var esm = (typeof structuredClone === "function" ?
  /* c8 ignore start */
  (any, options) => (
    options && ('json' in options || 'lossy' in options) ?
      deserialize(serialize(any, options)) : structuredClone(any)
  ) :
  (any, options) => deserialize(serialize(any, options)));
  /* c8 ignore stop */



;// CONCATENATED MODULE: ../../node_modules/.pnpm/micromark-util-sanitize-uri@2.0.1/node_modules/micromark-util-sanitize-uri/index.js


/**
 * Make a value safe for injection as a URL.
 *
 * This encodes unsafe characters with percent-encoding and skips already
 * encoded sequences (see `normalizeUri`).
 * Further unsafe characters are encoded as character references (see
 * `micromark-util-encode`).
 *
 * A regex of allowed protocols can be given, in which case the URL is
 * sanitized.
 * For example, `/^(https?|ircs?|mailto|xmpp)$/i` can be used for `a[href]`, or
 * `/^https?$/i` for `img[src]` (this is what `github.com` allows).
 * If the URL includes an unknown protocol (one not matched by `protocol`, such
 * as a dangerous example, `javascript:`), the value is ignored.
 *
 * @param {string | null | undefined} url
 *   URI to sanitize.
 * @param {RegExp | null | undefined} [protocol]
 *   Allowed protocols.
 * @returns {string}
 *   Sanitized URI.
 */
function sanitizeUri(url, protocol) {
  const value = encode(normalizeUri(url || ''));
  if (!protocol) {
    return value;
  }
  const colon = value.indexOf(':');
  const questionMark = value.indexOf('?');
  const numberSign = value.indexOf('#');
  const slash = value.indexOf('/');
  if (
  // If there is no protocol, it’s relative.
  colon < 0 ||
  // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
  slash > -1 && colon > slash || questionMark > -1 && colon > questionMark || numberSign > -1 && colon > numberSign ||
  // It is a protocol, it should be allowed.
  protocol.test(value.slice(0, colon))) {
    return value;
  }
  return '';
}

/**
 * Normalize a URL.
 *
 * Encode unsafe characters with percent-encoding, skipping already encoded
 * sequences.
 *
 * @param {string} value
 *   URI to normalize.
 * @returns {string}
 *   Normalized URI.
 */
function normalizeUri(value) {
  /** @type {Array<string>} */
  const result = [];
  let index = -1;
  let start = 0;
  let skip = 0;
  while (++index < value.length) {
    const code = value.charCodeAt(index);
    /** @type {string} */
    let replace = '';

    // A correct percent encoded value.
    if (code === 37 && asciiAlphanumeric(value.charCodeAt(index + 1)) && asciiAlphanumeric(value.charCodeAt(index + 2))) {
      skip = 2;
    }
    // ASCII.
    else if (code < 128) {
      if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code))) {
        replace = String.fromCharCode(code);
      }
    }
    // Astral.
    else if (code > 55_295 && code < 57_344) {
      const next = value.charCodeAt(index + 1);

      // A correct surrogate pair.
      if (code < 56_320 && next > 56_319 && next < 57_344) {
        replace = String.fromCharCode(code, next);
        skip = 1;
      }
      // Lone surrogate.
      else {
        replace = "\uFFFD";
      }
    }
    // Unicode.
    else {
      replace = String.fromCharCode(code);
    }
    if (replace) {
      result.push(value.slice(start, index), encodeURIComponent(replace));
      start = index + skip + 1;
      replace = '';
    }
    if (skip) {
      index += skip;
      skip = 0;
    }
  }
  return result.join('') + value.slice(start);
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/footer.js
/**
 * @import {ElementContent, Element} from 'hast'
 * @import {State} from './state.js'
 */

/**
 * @callback FootnoteBackContentTemplate
 *   Generate content for the backreference dynamically.
 *
 *   For the following markdown:
 *
 *   ```markdown
 *   Alpha[^micromark], bravo[^micromark], and charlie[^remark].
 *
 *   [^remark]: things about remark
 *   [^micromark]: things about micromark
 *   ```
 *
 *   This function will be called with:
 *
 *   *  `0` and `0` for the backreference from `things about micromark` to
 *      `alpha`, as it is the first used definition, and the first call to it
 *   *  `0` and `1` for the backreference from `things about micromark` to
 *      `bravo`, as it is the first used definition, and the second call to it
 *   *  `1` and `0` for the backreference from `things about remark` to
 *      `charlie`, as it is the second used definition
 * @param {number} referenceIndex
 *   Index of the definition in the order that they are first referenced,
 *   0-indexed.
 * @param {number} rereferenceIndex
 *   Index of calls to the same definition, 0-indexed.
 * @returns {Array<ElementContent> | ElementContent | string}
 *   Content for the backreference when linking back from definitions to their
 *   reference.
 *
 * @callback FootnoteBackLabelTemplate
 *   Generate a back label dynamically.
 *
 *   For the following markdown:
 *
 *   ```markdown
 *   Alpha[^micromark], bravo[^micromark], and charlie[^remark].
 *
 *   [^remark]: things about remark
 *   [^micromark]: things about micromark
 *   ```
 *
 *   This function will be called with:
 *
 *   *  `0` and `0` for the backreference from `things about micromark` to
 *      `alpha`, as it is the first used definition, and the first call to it
 *   *  `0` and `1` for the backreference from `things about micromark` to
 *      `bravo`, as it is the first used definition, and the second call to it
 *   *  `1` and `0` for the backreference from `things about remark` to
 *      `charlie`, as it is the second used definition
 * @param {number} referenceIndex
 *   Index of the definition in the order that they are first referenced,
 *   0-indexed.
 * @param {number} rereferenceIndex
 *   Index of calls to the same definition, 0-indexed.
 * @returns {string}
 *   Back label to use when linking back from definitions to their reference.
 */




/**
 * Generate the default content that GitHub uses on backreferences.
 *
 * @param {number} _
 *   Index of the definition in the order that they are first referenced,
 *   0-indexed.
 * @param {number} rereferenceIndex
 *   Index of calls to the same definition, 0-indexed.
 * @returns {Array<ElementContent>}
 *   Content.
 */
function defaultFootnoteBackContent(_, rereferenceIndex) {
  /** @type {Array<ElementContent>} */
  const result = [{type: 'text', value: '↩'}]

  if (rereferenceIndex > 1) {
    result.push({
      type: 'element',
      tagName: 'sup',
      properties: {},
      children: [{type: 'text', value: String(rereferenceIndex)}]
    })
  }

  return result
}

/**
 * Generate the default label that GitHub uses on backreferences.
 *
 * @param {number} referenceIndex
 *   Index of the definition in the order that they are first referenced,
 *   0-indexed.
 * @param {number} rereferenceIndex
 *   Index of calls to the same definition, 0-indexed.
 * @returns {string}
 *   Label.
 */
function defaultFootnoteBackLabel(referenceIndex, rereferenceIndex) {
  return (
    'Back to reference ' +
    (referenceIndex + 1) +
    (rereferenceIndex > 1 ? '-' + rereferenceIndex : '')
  )
}

/**
 * Generate a hast footer for called footnote definitions.
 *
 * @param {State} state
 *   Info passed around.
 * @returns {Element | undefined}
 *   `section` element or `undefined`.
 */
// eslint-disable-next-line complexity
function footer(state) {
  const clobberPrefix =
    typeof state.options.clobberPrefix === 'string'
      ? state.options.clobberPrefix
      : 'user-content-'
  const footnoteBackContent =
    state.options.footnoteBackContent || defaultFootnoteBackContent
  const footnoteBackLabel =
    state.options.footnoteBackLabel || defaultFootnoteBackLabel
  const footnoteLabel = state.options.footnoteLabel || 'Footnotes'
  const footnoteLabelTagName = state.options.footnoteLabelTagName || 'h2'
  const footnoteLabelProperties = state.options.footnoteLabelProperties || {
    className: ['sr-only']
  }
  /** @type {Array<ElementContent>} */
  const listItems = []
  let referenceIndex = -1

  while (++referenceIndex < state.footnoteOrder.length) {
    const definition = state.footnoteById.get(
      state.footnoteOrder[referenceIndex]
    )

    if (!definition) {
      continue
    }

    const content = state.all(definition)
    const id = String(definition.identifier).toUpperCase()
    const safeId = normalizeUri(id.toLowerCase())
    let rereferenceIndex = 0
    /** @type {Array<ElementContent>} */
    const backReferences = []
    const counts = state.footnoteCounts.get(id)

    // eslint-disable-next-line no-unmodified-loop-condition
    while (counts !== undefined && ++rereferenceIndex <= counts) {
      if (backReferences.length > 0) {
        backReferences.push({type: 'text', value: ' '})
      }

      let children =
        typeof footnoteBackContent === 'string'
          ? footnoteBackContent
          : footnoteBackContent(referenceIndex, rereferenceIndex)

      if (typeof children === 'string') {
        children = {type: 'text', value: children}
      }

      backReferences.push({
        type: 'element',
        tagName: 'a',
        properties: {
          href:
            '#' +
            clobberPrefix +
            'fnref-' +
            safeId +
            (rereferenceIndex > 1 ? '-' + rereferenceIndex : ''),
          dataFootnoteBackref: '',
          ariaLabel:
            typeof footnoteBackLabel === 'string'
              ? footnoteBackLabel
              : footnoteBackLabel(referenceIndex, rereferenceIndex),
          className: ['data-footnote-backref']
        },
        children: Array.isArray(children) ? children : [children]
      })
    }

    const tail = content[content.length - 1]

    if (tail && tail.type === 'element' && tail.tagName === 'p') {
      const tailTail = tail.children[tail.children.length - 1]
      if (tailTail && tailTail.type === 'text') {
        tailTail.value += ' '
      } else {
        tail.children.push({type: 'text', value: ' '})
      }

      tail.children.push(...backReferences)
    } else {
      content.push(...backReferences)
    }

    /** @type {Element} */
    const listItem = {
      type: 'element',
      tagName: 'li',
      properties: {id: clobberPrefix + 'fn-' + safeId},
      children: state.wrap(content, true)
    }

    state.patch(definition, listItem)

    listItems.push(listItem)
  }

  if (listItems.length === 0) {
    return
  }

  return {
    type: 'element',
    tagName: 'section',
    properties: {dataFootnotes: true, className: ['footnotes']},
    children: [
      {
        type: 'element',
        tagName: footnoteLabelTagName,
        properties: {
          ...esm(footnoteLabelProperties),
          id: 'footnote-label'
        },
        children: [{type: 'text', value: footnoteLabel}]
      },
      {type: 'text', value: '\n'},
      {
        type: 'element',
        tagName: 'ol',
        properties: {},
        children: state.wrap(listItems, true)
      },
      {type: 'text', value: '\n'}
    ]
  }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/unist-util-is@6.0.1/node_modules/unist-util-is/lib/index.js
/**
 * @import {Node, Parent} from 'unist'
 */

/**
 * @template Fn
 * @template Fallback
 * @typedef {Fn extends (value: any) => value is infer Thing ? Thing : Fallback} Predicate
 */

/**
 * @callback Check
 *   Check that an arbitrary value is a node.
 * @param {unknown} this
 *   The given context.
 * @param {unknown} [node]
 *   Anything (typically a node).
 * @param {number | null | undefined} [index]
 *   The node’s position in its parent.
 * @param {Parent | null | undefined} [parent]
 *   The node’s parent.
 * @returns {boolean}
 *   Whether this is a node and passes a test.
 *
 * @typedef {Record<string, unknown> | Node} Props
 *   Object to check for equivalence.
 *
 *   Note: `Node` is included as it is common but is not indexable.
 *
 * @typedef {Array<Props | TestFunction | string> | ReadonlyArray<Props | TestFunction | string> | Props | TestFunction | string | null | undefined} Test
 *   Check for an arbitrary node.
 *
 * @callback TestFunction
 *   Check if a node passes a test.
 * @param {unknown} this
 *   The given context.
 * @param {Node} node
 *   A node.
 * @param {number | undefined} [index]
 *   The node’s position in its parent.
 * @param {Parent | undefined} [parent]
 *   The node’s parent.
 * @returns {boolean | undefined | void}
 *   Whether this node passes the test.
 *
 *   Note: `void` is included until TS sees no return as `undefined`.
 */

/**
 * Check if `node` is a `Node` and whether it passes the given test.
 *
 * @param {unknown} node
 *   Thing to check, typically `Node`.
 * @param {Test} test
 *   A check for a specific node.
 * @param {number | null | undefined} index
 *   The node’s position in its parent.
 * @param {Parent | null | undefined} parent
 *   The node’s parent.
 * @param {unknown} context
 *   Context object (`this`) to pass to `test` functions.
 * @returns {boolean}
 *   Whether `node` is a node and passes a test.
 */
const is =
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends ReadonlyArray<string>>(node: unknown, test: Condition, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition[number]}) &
   *   (<Condition extends Array<string>>(node: unknown, test: Condition, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition[number]}) &
   *   (<Condition extends string>(node: unknown, test: Condition, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(node: unknown, test: Condition, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(node: unknown, test: Condition, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((node?: null | undefined) => false) &
   *   ((node: unknown, test?: null | undefined, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((node: unknown, test?: Test, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => boolean)
   * )}
   */
  (
    /**
     * @param {unknown} [node]
     * @param {Test} [test]
     * @param {number | null | undefined} [index]
     * @param {Parent | null | undefined} [parent]
     * @param {unknown} [context]
     * @returns {boolean}
     */
    // eslint-disable-next-line max-params
    function (node, test, index, parent, context) {
      const check = convert(test)

      if (
        index !== undefined &&
        index !== null &&
        (typeof index !== 'number' ||
          index < 0 ||
          index === Number.POSITIVE_INFINITY)
      ) {
        throw new Error('Expected positive finite index')
      }

      if (
        parent !== undefined &&
        parent !== null &&
        (!is(parent) || !parent.children)
      ) {
        throw new Error('Expected parent node')
      }

      if (
        (parent === undefined || parent === null) !==
        (index === undefined || index === null)
      ) {
        throw new Error('Expected both parent and index')
      }

      return looksLikeANode(node)
        ? check.call(context, node, index, parent)
        : false
    }
  )

/**
 * Generate an assertion from a test.
 *
 * Useful if you’re going to test many nodes, for example when creating a
 * utility where something else passes a compatible test.
 *
 * The created function is a bit faster because it expects valid input only:
 * a `node`, `index`, and `parent`.
 *
 * @param {Test} test
 *   *   when nullish, checks if `node` is a `Node`.
 *   *   when `string`, works like passing `(node) => node.type === test`.
 *   *   when `function` checks if function passed the node is true.
 *   *   when `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
 *   *   when `array`, checks if any one of the subtests pass.
 * @returns {Check}
 *   An assertion.
 */
const convert =
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  (
    /**
     * @param {Test} [test]
     * @returns {Check}
     */
    function (test) {
      if (test === null || test === undefined) {
        return lib_ok
      }

      if (typeof test === 'function') {
        return castFactory(test)
      }

      if (typeof test === 'object') {
        return Array.isArray(test)
          ? anyFactory(test)
          : // Cast because `ReadonlyArray` goes into the above but `isArray`
            // narrows to `Array`.
            propertiesFactory(/** @type {Props} */ (test))
      }

      if (typeof test === 'string') {
        return typeFactory(test)
      }

      throw new Error('Expected function, string, or object as test')
    }
  )

/**
 * @param {Array<Props | TestFunction | string>} tests
 * @returns {Check}
 */
function anyFactory(tests) {
  /** @type {Array<Check>} */
  const checks = []
  let index = -1

  while (++index < tests.length) {
    checks[index] = convert(tests[index])
  }

  return castFactory(any)

  /**
   * @this {unknown}
   * @type {TestFunction}
   */
  function any(...parameters) {
    let index = -1

    while (++index < checks.length) {
      if (checks[index].apply(this, parameters)) return true
    }

    return false
  }
}

/**
 * Turn an object into a test for a node with a certain fields.
 *
 * @param {Props} check
 * @returns {Check}
 */
function propertiesFactory(check) {
  const checkAsRecord = /** @type {Record<string, unknown>} */ (check)

  return castFactory(all)

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  function all(node) {
    const nodeAsRecord = /** @type {Record<string, unknown>} */ (
      /** @type {unknown} */ (node)
    )

    /** @type {string} */
    let key

    for (key in check) {
      if (nodeAsRecord[key] !== checkAsRecord[key]) return false
    }

    return true
  }
}

/**
 * Turn a string into a test for a node with a certain type.
 *
 * @param {string} check
 * @returns {Check}
 */
function typeFactory(check) {
  return castFactory(type)

  /**
   * @param {Node} node
   */
  function type(node) {
    return node && node.type === check
  }
}

/**
 * Turn a custom test into a test for a node that passes that test.
 *
 * @param {TestFunction} testFunction
 * @returns {Check}
 */
function castFactory(testFunction) {
  return check

  /**
   * @this {unknown}
   * @type {Check}
   */
  function check(value, index, parent) {
    return Boolean(
      looksLikeANode(value) &&
        testFunction.call(
          this,
          value,
          typeof index === 'number' ? index : undefined,
          parent || undefined
        )
    )
  }
}

function lib_ok() {
  return true
}

/**
 * @param {unknown} value
 * @returns {value is Node}
 */
function looksLikeANode(value) {
  return value !== null && typeof value === 'object' && 'type' in value
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/unist-util-visit-parents@6.0.2/node_modules/unist-util-visit-parents/lib/color.js
/**
 * @param {string} d
 * @returns {string}
 */
function color(d) {
  return d
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/unist-util-visit-parents@6.0.2/node_modules/unist-util-visit-parents/lib/index.js
/**
 * @import {Node as UnistNode, Parent as UnistParent} from 'unist'
 */

/**
 * @typedef {Exclude<import('unist-util-is').Test, undefined> | undefined} Test
 *   Test from `unist-util-is`.
 *
 *   Note: we have remove and add `undefined`, because otherwise when generating
 *   automatic `.d.ts` files, TS tries to flatten paths from a local perspective,
 *   which doesn’t work when publishing on npm.
 */

/**
 * @typedef {(
 *   Fn extends (value: any) => value is infer Thing
 *   ? Thing
 *   : Fallback
 * )} Predicate
 *   Get the value of a type guard `Fn`.
 * @template Fn
 *   Value; typically function that is a type guard (such as `(x): x is Y`).
 * @template Fallback
 *   Value to yield if `Fn` is not a type guard.
 */

/**
 * @typedef {(
 *   Check extends null | undefined // No test.
 *   ? Value
 *   : Value extends {type: Check} // String (type) test.
 *   ? Value
 *   : Value extends Check // Partial test.
 *   ? Value
 *   : Check extends Function // Function test.
 *   ? Predicate<Check, Value> extends Value
 *     ? Predicate<Check, Value>
 *     : never
 *   : never // Some other test?
 * )} MatchesOne
 *   Check whether a node matches a primitive check in the type system.
 * @template Value
 *   Value; typically unist `Node`.
 * @template Check
 *   Value; typically `unist-util-is`-compatible test, but not arrays.
 */

/**
 * @typedef {(
 *   Check extends ReadonlyArray<infer T>
 *   ? MatchesOne<Value, T>
 *   : Check extends Array<infer T>
 *   ? MatchesOne<Value, T>
 *   : MatchesOne<Value, Check>
 * )} Matches
 *   Check whether a node matches a check in the type system.
 * @template Value
 *   Value; typically unist `Node`.
 * @template Check
 *   Value; typically `unist-util-is`-compatible test.
 */

/**
 * @typedef {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10} Uint
 *   Number; capped reasonably.
 */

/**
 * @typedef {I extends 0 ? 1 : I extends 1 ? 2 : I extends 2 ? 3 : I extends 3 ? 4 : I extends 4 ? 5 : I extends 5 ? 6 : I extends 6 ? 7 : I extends 7 ? 8 : I extends 8 ? 9 : 10} Increment
 *   Increment a number in the type system.
 * @template {Uint} [I=0]
 *   Index.
 */

/**
 * @typedef {(
 *   Node extends UnistParent
 *   ? Node extends {children: Array<infer Children>}
 *     ? Child extends Children ? Node : never
 *     : never
 *   : never
 * )} InternalParent
 *   Collect nodes that can be parents of `Child`.
 * @template {UnistNode} Node
 *   All node types in a tree.
 * @template {UnistNode} Child
 *   Node to search for.
 */

/**
 * @typedef {InternalParent<InclusiveDescendant<Tree>, Child>} Parent
 *   Collect nodes in `Tree` that can be parents of `Child`.
 * @template {UnistNode} Tree
 *   All node types in a tree.
 * @template {UnistNode} Child
 *   Node to search for.
 */

/**
 * @typedef {(
 *   Depth extends Max
 *   ? never
 *   :
 *     | InternalParent<Node, Child>
 *     | InternalAncestor<Node, InternalParent<Node, Child>, Max, Increment<Depth>>
 * )} InternalAncestor
 *   Collect nodes in `Tree` that can be ancestors of `Child`.
 * @template {UnistNode} Node
 *   All node types in a tree.
 * @template {UnistNode} Child
 *   Node to search for.
 * @template {Uint} [Max=10]
 *   Max; searches up to this depth.
 * @template {Uint} [Depth=0]
 *   Current depth.
 */

/**
 * @typedef {InternalAncestor<InclusiveDescendant<Tree>, Child>} Ancestor
 *   Collect nodes in `Tree` that can be ancestors of `Child`.
 * @template {UnistNode} Tree
 *   All node types in a tree.
 * @template {UnistNode} Child
 *   Node to search for.
 */

/**
 * @typedef {(
 *   Tree extends UnistParent
 *     ? Depth extends Max
 *       ? Tree
 *       : Tree | InclusiveDescendant<Tree['children'][number], Max, Increment<Depth>>
 *     : Tree
 * )} InclusiveDescendant
 *   Collect all (inclusive) descendants of `Tree`.
 *
 *   > 👉 **Note**: for performance reasons, this seems to be the fastest way to
 *   > recurse without actually running into an infinite loop, which the
 *   > previous version did.
 *   >
 *   > Practically, a max of `2` is typically enough assuming a `Root` is
 *   > passed, but it doesn’t improve performance.
 *   > It gets higher with `List > ListItem > Table > TableRow > TableCell`.
 *   > Using up to `10` doesn’t hurt or help either.
 * @template {UnistNode} Tree
 *   Tree type.
 * @template {Uint} [Max=10]
 *   Max; searches up to this depth.
 * @template {Uint} [Depth=0]
 *   Current depth.
 */

/**
 * @typedef {'skip' | boolean} Action
 *   Union of the action types.
 *
 * @typedef {number} Index
 *   Move to the sibling at `index` next (after node itself is completely
 *   traversed).
 *
 *   Useful if mutating the tree, such as removing the node the visitor is
 *   currently on, or any of its previous siblings.
 *   Results less than 0 or greater than or equal to `children.length` stop
 *   traversing the parent.
 *
 * @typedef {[(Action | null | undefined | void)?, (Index | null | undefined)?]} ActionTuple
 *   List with one or two values, the first an action, the second an index.
 *
 * @typedef {Action | ActionTuple | Index | null | undefined | void} VisitorResult
 *   Any value that can be returned from a visitor.
 */

/**
 * @callback Visitor
 *   Handle a node (matching `test`, if given).
 *
 *   Visitors are free to transform `node`.
 *   They can also transform the parent of node (the last of `ancestors`).
 *
 *   Replacing `node` itself, if `SKIP` is not returned, still causes its
 *   descendants to be walked (which is a bug).
 *
 *   When adding or removing previous siblings of `node` (or next siblings, in
 *   case of reverse), the `Visitor` should return a new `Index` to specify the
 *   sibling to traverse after `node` is traversed.
 *   Adding or removing next siblings of `node` (or previous siblings, in case
 *   of reverse) is handled as expected without needing to return a new `Index`.
 *
 *   Removing the children property of an ancestor still results in them being
 *   traversed.
 * @param {Visited} node
 *   Found node.
 * @param {Array<VisitedParents>} ancestors
 *   Ancestors of `node`.
 * @returns {VisitorResult}
 *   What to do next.
 *
 *   An `Index` is treated as a tuple of `[CONTINUE, Index]`.
 *   An `Action` is treated as a tuple of `[Action]`.
 *
 *   Passing a tuple back only makes sense if the `Action` is `SKIP`.
 *   When the `Action` is `EXIT`, that action can be returned.
 *   When the `Action` is `CONTINUE`, `Index` can be returned.
 * @template {UnistNode} [Visited=UnistNode]
 *   Visited node type.
 * @template {UnistParent} [VisitedParents=UnistParent]
 *   Ancestor type.
 */

/**
 * @typedef {Visitor<Matches<InclusiveDescendant<Tree>, Check>, Ancestor<Tree, Matches<InclusiveDescendant<Tree>, Check>>>} BuildVisitor
 *   Build a typed `Visitor` function from a tree and a test.
 *
 *   It will infer which values are passed as `node` and which as `parents`.
 * @template {UnistNode} [Tree=UnistNode]
 *   Tree type.
 * @template {Test} [Check=Test]
 *   Test type.
 */




/** @type {Readonly<ActionTuple>} */
const lib_empty = []

/**
 * Continue traversing as normal.
 */
const CONTINUE = true

/**
 * Stop traversing immediately.
 */
const EXIT = false

/**
 * Do not traverse this node’s children.
 */
const SKIP = 'skip'

/**
 * Visit nodes, with ancestral information.
 *
 * This algorithm performs *depth-first* *tree traversal* in *preorder*
 * (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
 *
 * You can choose for which nodes `visitor` is called by passing a `test`.
 * For complex tests, you should test yourself in `visitor`, as it will be
 * faster and will have improved type information.
 *
 * Walking the tree is an intensive task.
 * Make use of the return values of the visitor when possible.
 * Instead of walking a tree multiple times, walk it once, use `unist-util-is`
 * to check if a node matches, and then perform different operations.
 *
 * You can change the tree.
 * See `Visitor` for more info.
 *
 * @overload
 * @param {Tree} tree
 * @param {Check} check
 * @param {BuildVisitor<Tree, Check>} visitor
 * @param {boolean | null | undefined} [reverse]
 * @returns {undefined}
 *
 * @overload
 * @param {Tree} tree
 * @param {BuildVisitor<Tree>} visitor
 * @param {boolean | null | undefined} [reverse]
 * @returns {undefined}
 *
 * @param {UnistNode} tree
 *   Tree to traverse.
 * @param {Visitor | Test} test
 *   `unist-util-is`-compatible test
 * @param {Visitor | boolean | null | undefined} [visitor]
 *   Handle each node.
 * @param {boolean | null | undefined} [reverse]
 *   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
 * @returns {undefined}
 *   Nothing.
 *
 * @template {UnistNode} Tree
 *   Node type.
 * @template {Test} Check
 *   `unist-util-is`-compatible test.
 */
function visitParents(tree, test, visitor, reverse) {
  /** @type {Test} */
  let check

  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor
    // @ts-expect-error no visitor given, so `visitor` is test.
    visitor = test
  } else {
    // @ts-expect-error visitor given, so `test` isn’t a visitor.
    check = test
  }

  const is = convert(check)
  const step = reverse ? -1 : 1

  factory(tree, undefined, [])()

  /**
   * @param {UnistNode} node
   * @param {number | undefined} index
   * @param {Array<UnistParent>} parents
   */
  function factory(node, index, parents) {
    const value = /** @type {Record<string, unknown>} */ (
      node && typeof node === 'object' ? node : {}
    )

    if (typeof value.type === 'string') {
      const name =
        // `hast`
        typeof value.tagName === 'string'
          ? value.tagName
          : // `xast`
            typeof value.name === 'string'
            ? value.name
            : undefined

      Object.defineProperty(visit, 'name', {
        value:
          'node (' + color(node.type + (name ? '<' + name + '>' : '')) + ')'
      })
    }

    return visit

    function visit() {
      /** @type {Readonly<ActionTuple>} */
      let result = lib_empty
      /** @type {Readonly<ActionTuple>} */
      let subresult
      /** @type {number} */
      let offset
      /** @type {Array<UnistParent>} */
      let grandparents

      if (!test || is(node, index, parents[parents.length - 1] || undefined)) {
        // @ts-expect-error: `visitor` is now a visitor.
        result = toResult(visitor(node, parents))

        if (result[0] === EXIT) {
          return result
        }
      }

      if ('children' in node && node.children) {
        const nodeAsParent = /** @type {UnistParent} */ (node)

        if (nodeAsParent.children && result[0] !== SKIP) {
          offset = (reverse ? nodeAsParent.children.length : -1) + step
          grandparents = parents.concat(nodeAsParent)

          while (offset > -1 && offset < nodeAsParent.children.length) {
            const child = nodeAsParent.children[offset]

            subresult = factory(child, offset, grandparents)()

            if (subresult[0] === EXIT) {
              return subresult
            }

            offset =
              typeof subresult[1] === 'number' ? subresult[1] : offset + step
          }
        }
      }

      return result
    }
  }
}

/**
 * Turn a return value into a clean result.
 *
 * @param {VisitorResult} value
 *   Valid return values from visitors.
 * @returns {Readonly<ActionTuple>}
 *   Clean result.
 */
function toResult(value) {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE, value]
  }

  return value === null || value === undefined ? lib_empty : [value]
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/unist-util-visit@5.1.0/node_modules/unist-util-visit/lib/index.js
/**
 * @import {Node as UnistNode, Parent as UnistParent} from 'unist'
 * @import {VisitorResult} from 'unist-util-visit-parents'
 */

/**
 * @typedef {Exclude<import('unist-util-is').Test, undefined> | undefined} Test
 *   Test from `unist-util-is`.
 *
 *   Note: we have remove and add `undefined`, because otherwise when generating
 *   automatic `.d.ts` files, TS tries to flatten paths from a local perspective,
 *   which doesn’t work when publishing on npm.
 */

// To do: use types from `unist-util-visit-parents` when it’s released.

/**
 * @typedef {(
 *   Fn extends (value: any) => value is infer Thing
 *   ? Thing
 *   : Fallback
 * )} Predicate
 *   Get the value of a type guard `Fn`.
 * @template Fn
 *   Value; typically function that is a type guard (such as `(x): x is Y`).
 * @template Fallback
 *   Value to yield if `Fn` is not a type guard.
 */

/**
 * @typedef {(
 *   Check extends null | undefined // No test.
 *   ? Value
 *   : Value extends {type: Check} // String (type) test.
 *   ? Value
 *   : Value extends Check // Partial test.
 *   ? Value
 *   : Check extends Function // Function test.
 *   ? Predicate<Check, Value> extends Value
 *     ? Predicate<Check, Value>
 *     : never
 *   : never // Some other test?
 * )} MatchesOne
 *   Check whether a node matches a primitive check in the type system.
 * @template Value
 *   Value; typically unist `Node`.
 * @template Check
 *   Value; typically `unist-util-is`-compatible test, but not arrays.
 */

/**
 * @typedef {(
 *   Check extends ReadonlyArray<any>
 *   ? MatchesOne<Value, Check[number]>
 *   : MatchesOne<Value, Check>
 * )} Matches
 *   Check whether a node matches a check in the type system.
 * @template Value
 *   Value; typically unist `Node`.
 * @template Check
 *   Value; typically `unist-util-is`-compatible test.
 */

/**
 * @typedef {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10} Uint
 *   Number; capped reasonably.
 */

/**
 * @typedef {I extends 0 ? 1 : I extends 1 ? 2 : I extends 2 ? 3 : I extends 3 ? 4 : I extends 4 ? 5 : I extends 5 ? 6 : I extends 6 ? 7 : I extends 7 ? 8 : I extends 8 ? 9 : 10} Increment
 *   Increment a number in the type system.
 * @template {Uint} [I=0]
 *   Index.
 */

/**
 * @typedef {(
 *   Node extends UnistParent
 *   ? Node extends {children: Array<infer Children>}
 *     ? Child extends Children ? Node : never
 *     : never
 *   : never
 * )} InternalParent
 *   Collect nodes that can be parents of `Child`.
 * @template {UnistNode} Node
 *   All node types in a tree.
 * @template {UnistNode} Child
 *   Node to search for.
 */

/**
 * @typedef {InternalParent<InclusiveDescendant<Tree>, Child>} Parent
 *   Collect nodes in `Tree` that can be parents of `Child`.
 * @template {UnistNode} Tree
 *   All node types in a tree.
 * @template {UnistNode} Child
 *   Node to search for.
 */

/**
 * @typedef {(
 *   Depth extends Max
 *   ? never
 *   :
 *     | InternalParent<Node, Child>
 *     | InternalAncestor<Node, InternalParent<Node, Child>, Max, Increment<Depth>>
 * )} InternalAncestor
 *   Collect nodes in `Tree` that can be ancestors of `Child`.
 * @template {UnistNode} Node
 *   All node types in a tree.
 * @template {UnistNode} Child
 *   Node to search for.
 * @template {Uint} [Max=10]
 *   Max; searches up to this depth.
 * @template {Uint} [Depth=0]
 *   Current depth.
 */

/**
 * @typedef {(
 *   Tree extends UnistParent
 *     ? Depth extends Max
 *       ? Tree
 *       : Tree | InclusiveDescendant<Tree['children'][number], Max, Increment<Depth>>
 *     : Tree
 * )} InclusiveDescendant
 *   Collect all (inclusive) descendants of `Tree`.
 *
 *   > 👉 **Note**: for performance reasons, this seems to be the fastest way to
 *   > recurse without actually running into an infinite loop, which the
 *   > previous version did.
 *   >
 *   > Practically, a max of `2` is typically enough assuming a `Root` is
 *   > passed, but it doesn’t improve performance.
 *   > It gets higher with `List > ListItem > Table > TableRow > TableCell`.
 *   > Using up to `10` doesn’t hurt or help either.
 * @template {UnistNode} Tree
 *   Tree type.
 * @template {Uint} [Max=10]
 *   Max; searches up to this depth.
 * @template {Uint} [Depth=0]
 *   Current depth.
 */

/**
 * @callback Visitor
 *   Handle a node (matching `test`, if given).
 *
 *   Visitors are free to transform `node`.
 *   They can also transform `parent`.
 *
 *   Replacing `node` itself, if `SKIP` is not returned, still causes its
 *   descendants to be walked (which is a bug).
 *
 *   When adding or removing previous siblings of `node` (or next siblings, in
 *   case of reverse), the `Visitor` should return a new `Index` to specify the
 *   sibling to traverse after `node` is traversed.
 *   Adding or removing next siblings of `node` (or previous siblings, in case
 *   of reverse) is handled as expected without needing to return a new `Index`.
 *
 *   Removing the children property of `parent` still results in them being
 *   traversed.
 * @param {Visited} node
 *   Found node.
 * @param {Visited extends UnistNode ? number | undefined : never} index
 *   Index of `node` in `parent`.
 * @param {Ancestor extends UnistParent ? Ancestor | undefined : never} parent
 *   Parent of `node`.
 * @returns {VisitorResult}
 *   What to do next.
 *
 *   An `Index` is treated as a tuple of `[CONTINUE, Index]`.
 *   An `Action` is treated as a tuple of `[Action]`.
 *
 *   Passing a tuple back only makes sense if the `Action` is `SKIP`.
 *   When the `Action` is `EXIT`, that action can be returned.
 *   When the `Action` is `CONTINUE`, `Index` can be returned.
 * @template {UnistNode} [Visited=UnistNode]
 *   Visited node type.
 * @template {UnistParent} [Ancestor=UnistParent]
 *   Ancestor type.
 */

/**
 * @typedef {Visitor<Visited, Parent<Ancestor, Visited>>} BuildVisitorFromMatch
 *   Build a typed `Visitor` function from a node and all possible parents.
 *
 *   It will infer which values are passed as `node` and which as `parent`.
 * @template {UnistNode} Visited
 *   Node type.
 * @template {UnistParent} Ancestor
 *   Parent type.
 */

/**
 * @typedef {(
 *   BuildVisitorFromMatch<
 *     Matches<Descendant, Check>,
 *     Extract<Descendant, UnistParent>
 *   >
 * )} BuildVisitorFromDescendants
 *   Build a typed `Visitor` function from a list of descendants and a test.
 *
 *   It will infer which values are passed as `node` and which as `parent`.
 * @template {UnistNode} Descendant
 *   Node type.
 * @template {Test} Check
 *   Test type.
 */

/**
 * @typedef {(
 *   BuildVisitorFromDescendants<
 *     InclusiveDescendant<Tree>,
 *     Check
 *   >
 * )} BuildVisitor
 *   Build a typed `Visitor` function from a tree and a test.
 *
 *   It will infer which values are passed as `node` and which as `parent`.
 * @template {UnistNode} [Tree=UnistNode]
 *   Node type.
 * @template {Test} [Check=Test]
 *   Test type.
 */





/**
 * Visit nodes.
 *
 * This algorithm performs *depth-first* *tree traversal* in *preorder*
 * (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
 *
 * You can choose for which nodes `visitor` is called by passing a `test`.
 * For complex tests, you should test yourself in `visitor`, as it will be
 * faster and will have improved type information.
 *
 * Walking the tree is an intensive task.
 * Make use of the return values of the visitor when possible.
 * Instead of walking a tree multiple times, walk it once, use `unist-util-is`
 * to check if a node matches, and then perform different operations.
 *
 * You can change the tree.
 * See `Visitor` for more info.
 *
 * @overload
 * @param {Tree} tree
 * @param {Check} check
 * @param {BuildVisitor<Tree, Check>} visitor
 * @param {boolean | null | undefined} [reverse]
 * @returns {undefined}
 *
 * @overload
 * @param {Tree} tree
 * @param {BuildVisitor<Tree>} visitor
 * @param {boolean | null | undefined} [reverse]
 * @returns {undefined}
 *
 * @param {UnistNode} tree
 *   Tree to traverse.
 * @param {Visitor | Test} testOrVisitor
 *   `unist-util-is`-compatible test (optional, omit to pass a visitor).
 * @param {Visitor | boolean | null | undefined} [visitorOrReverse]
 *   Handle each node (when test is omitted, pass `reverse`).
 * @param {boolean | null | undefined} [maybeReverse=false]
 *   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
 * @returns {undefined}
 *   Nothing.
 *
 * @template {UnistNode} Tree
 *   Node type.
 * @template {Test} Check
 *   `unist-util-is`-compatible test.
 */
function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
  /** @type {boolean | null | undefined} */
  let reverse
  /** @type {Test} */
  let test
  /** @type {Visitor} */
  let visitor

  if (
    typeof testOrVisitor === 'function' &&
    typeof visitorOrReverse !== 'function'
  ) {
    test = undefined
    visitor = testOrVisitor
    reverse = visitorOrReverse
  } else {
    // @ts-expect-error: assume the overload with test was given.
    test = testOrVisitor
    // @ts-expect-error: assume the overload with test was given.
    visitor = visitorOrReverse
    reverse = maybeReverse
  }

  visitParents(tree, test, overload, reverse)

  /**
   * @param {UnistNode} node
   * @param {Array<UnistParent>} parents
   */
  function overload(node, parents) {
    const parent = parents[parents.length - 1]
    const index = parent ? parent.children.indexOf(node) : undefined
    return visitor(node, index, parent)
  }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/blockquote.js
/**
 * @import {Element} from 'hast'
 * @import {Blockquote} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `blockquote` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Blockquote} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
function blockquote(state, node) {
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'blockquote',
    properties: {},
    children: state.wrap(state.all(node), true)
  }
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/break.js
/**
 * @import {Element, Text} from 'hast'
 * @import {Break} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `break` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Break} node
 *   mdast node.
 * @returns {Array<Element | Text>}
 *   hast element content.
 */
function hardBreak(state, node) {
  /** @type {Element} */
  const result = {type: 'element', tagName: 'br', properties: {}, children: []}
  state.patch(node, result)
  return [state.applyData(node, result), {type: 'text', value: '\n'}]
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/code.js
/**
 * @import {Element, Properties} from 'hast'
 * @import {Code} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `code` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Code} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
function code(state, node) {
  const value = node.value ? node.value + '\n' : ''
  /** @type {Properties} */
  const properties = {}
  // Someone can write `js&#x20;python&#x9;ruby`.
  const language = node.lang ? node.lang.split(/\s+/) : []

  // GH/CM still drop the non-first languages.
  if (language.length > 0) {
    properties.className = ['language-' + language[0]]
  }

  // Create `<code>`.
  /** @type {Element} */
  let result = {
    type: 'element',
    tagName: 'code',
    properties,
    children: [{type: 'text', value}]
  }

  if (node.meta) {
    result.data = {meta: node.meta}
  }

  state.patch(node, result)
  result = state.applyData(node, result)

  // Create `<pre>`.
  result = {type: 'element', tagName: 'pre', properties: {}, children: [result]}
  state.patch(node, result)
  return result
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/delete.js
/**
 * @import {Element} from 'hast'
 * @import {Delete} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `delete` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Delete} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
function strikethrough(state, node) {
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'del',
    properties: {},
    children: state.all(node)
  }
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/emphasis.js
/**
 * @import {Element} from 'hast'
 * @import {Emphasis} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `emphasis` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Emphasis} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
function emphasis(state, node) {
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'em',
    properties: {},
    children: state.all(node)
  }
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/footnote-reference.js
/**
 * @import {Element} from 'hast'
 * @import {FootnoteReference} from 'mdast'
 * @import {State} from '../state.js'
 */



/**
 * Turn an mdast `footnoteReference` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {FootnoteReference} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
function footnoteReference(state, node) {
  const clobberPrefix =
    typeof state.options.clobberPrefix === 'string'
      ? state.options.clobberPrefix
      : 'user-content-'
  const id = String(node.identifier).toUpperCase()
  const safeId = normalizeUri(id.toLowerCase())
  const index = state.footnoteOrder.indexOf(id)
  /** @type {number} */
  let counter

  let reuseCounter = state.footnoteCounts.get(id)

  if (reuseCounter === undefined) {
    reuseCounter = 0
    state.footnoteOrder.push(id)
    counter = state.footnoteOrder.length
  } else {
    counter = index + 1
  }

  reuseCounter += 1
  state.footnoteCounts.set(id, reuseCounter)

  /** @type {Element} */
  const link = {
    type: 'element',
    tagName: 'a',
    properties: {
      href: '#' + clobberPrefix + 'fn-' + safeId,
      id:
        clobberPrefix +
        'fnref-' +
        safeId +
        (reuseCounter > 1 ? '-' + reuseCounter : ''),
      dataFootnoteRef: true,
      ariaDescribedBy: ['footnote-label']
    },
    children: [{type: 'text', value: String(counter)}]
  }
  state.patch(node, link)

  /** @type {Element} */
  const sup = {
    type: 'element',
    tagName: 'sup',
    properties: {},
    children: [link]
  }
  state.patch(node, sup)
  return state.applyData(node, sup)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/heading.js
/**
 * @import {Element} from 'hast'
 * @import {Heading} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `heading` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Heading} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
function heading(state, node) {
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'h' + node.depth,
    properties: {},
    children: state.all(node)
  }
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/html.js
/**
 * @import {Element} from 'hast'
 * @import {Html} from 'mdast'
 * @import {State} from '../state.js'
 * @import {Raw} from '../../index.js'
 */

/**
 * Turn an mdast `html` node into hast (`raw` node in dangerous mode, otherwise
 * nothing).
 *
 * @param {State} state
 *   Info passed around.
 * @param {Html} node
 *   mdast node.
 * @returns {Element | Raw | undefined}
 *   hast node.
 */
function html(state, node) {
  if (state.options.allowDangerousHtml) {
    /** @type {Raw} */
    const result = {type: 'raw', value: node.value}
    state.patch(node, result)
    return state.applyData(node, result)
  }

  return undefined
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/revert.js
/**
 * @import {ElementContent} from 'hast'
 * @import {Reference, Nodes} from 'mdast'
 * @import {State} from './state.js'
 */

/**
 * Return the content of a reference without definition as plain text.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Extract<Nodes, Reference>} node
 *   Reference node (image, link).
 * @returns {Array<ElementContent>}
 *   hast content.
 */
function revert(state, node) {
  const subtype = node.referenceType
  let suffix = ']'

  if (subtype === 'collapsed') {
    suffix += '[]'
  } else if (subtype === 'full') {
    suffix += '[' + (node.label || node.identifier) + ']'
  }

  if (node.type === 'imageReference') {
    return [{type: 'text', value: '![' + node.alt + suffix}]
  }

  const contents = state.all(node)
  const head = contents[0]

  if (head && head.type === 'text') {
    head.value = '[' + head.value
  } else {
    contents.unshift({type: 'text', value: '['})
  }

  const tail = contents[contents.length - 1]

  if (tail && tail.type === 'text') {
    tail.value += suffix
  } else {
    contents.push({type: 'text', value: suffix})
  }

  return contents
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/image-reference.js
/**
 * @import {ElementContent, Element, Properties} from 'hast'
 * @import {ImageReference} from 'mdast'
 * @import {State} from '../state.js'
 */




/**
 * Turn an mdast `imageReference` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {ImageReference} node
 *   mdast node.
 * @returns {Array<ElementContent> | ElementContent}
 *   hast node.
 */
function imageReference(state, node) {
  const id = String(node.identifier).toUpperCase()
  const definition = state.definitionById.get(id)

  if (!definition) {
    return revert(state, node)
  }

  /** @type {Properties} */
  const properties = {src: normalizeUri(definition.url || ''), alt: node.alt}

  if (definition.title !== null && definition.title !== undefined) {
    properties.title = definition.title
  }

  /** @type {Element} */
  const result = {type: 'element', tagName: 'img', properties, children: []}
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/image.js
/**
 * @import {Element, Properties} from 'hast'
 * @import {Image} from 'mdast'
 * @import {State} from '../state.js'
 */



/**
 * Turn an mdast `image` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Image} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
function image_image(state, node) {
  /** @type {Properties} */
  const properties = {src: normalizeUri(node.url)}

  if (node.alt !== null && node.alt !== undefined) {
    properties.alt = node.alt
  }

  if (node.title !== null && node.title !== undefined) {
    properties.title = node.title
  }

  /** @type {Element} */
  const result = {type: 'element', tagName: 'img', properties, children: []}
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/inline-code.js
/**
 * @import {Element, Text} from 'hast'
 * @import {InlineCode} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `inlineCode` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {InlineCode} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
function inlineCode(state, node) {
  /** @type {Text} */
  const text = {type: 'text', value: node.value.replace(/\r?\n|\r/g, ' ')}
  state.patch(node, text)

  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'code',
    properties: {},
    children: [text]
  }
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/link-reference.js
/**
 * @import {ElementContent, Element, Properties} from 'hast'
 * @import {LinkReference} from 'mdast'
 * @import {State} from '../state.js'
 */




/**
 * Turn an mdast `linkReference` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {LinkReference} node
 *   mdast node.
 * @returns {Array<ElementContent> | ElementContent}
 *   hast node.
 */
function linkReference(state, node) {
  const id = String(node.identifier).toUpperCase()
  const definition = state.definitionById.get(id)

  if (!definition) {
    return revert(state, node)
  }

  /** @type {Properties} */
  const properties = {href: normalizeUri(definition.url || '')}

  if (definition.title !== null && definition.title !== undefined) {
    properties.title = definition.title
  }

  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'a',
    properties,
    children: state.all(node)
  }
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/link.js
/**
 * @import {Element, Properties} from 'hast'
 * @import {Link} from 'mdast'
 * @import {State} from '../state.js'
 */



/**
 * Turn an mdast `link` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Link} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
function link_link(state, node) {
  /** @type {Properties} */
  const properties = {href: normalizeUri(node.url)}

  if (node.title !== null && node.title !== undefined) {
    properties.title = node.title
  }

  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'a',
    properties,
    children: state.all(node)
  }
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/list-item.js
/**
 * @import {ElementContent, Element, Properties} from 'hast'
 * @import {ListItem, Parents} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `listItem` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {ListItem} node
 *   mdast node.
 * @param {Parents | undefined} parent
 *   Parent of `node`.
 * @returns {Element}
 *   hast node.
 */
function listItem(state, node, parent) {
  const results = state.all(node)
  const loose = parent ? listLoose(parent) : listItemLoose(node)
  /** @type {Properties} */
  const properties = {}
  /** @type {Array<ElementContent>} */
  const children = []

  if (typeof node.checked === 'boolean') {
    const head = results[0]
    /** @type {Element} */
    let paragraph

    if (head && head.type === 'element' && head.tagName === 'p') {
      paragraph = head
    } else {
      paragraph = {type: 'element', tagName: 'p', properties: {}, children: []}
      results.unshift(paragraph)
    }

    if (paragraph.children.length > 0) {
      paragraph.children.unshift({type: 'text', value: ' '})
    }

    paragraph.children.unshift({
      type: 'element',
      tagName: 'input',
      properties: {type: 'checkbox', checked: node.checked, disabled: true},
      children: []
    })

    // According to github-markdown-css, this class hides bullet.
    // See: <https://github.com/sindresorhus/github-markdown-css>.
    properties.className = ['task-list-item']
  }

  let index = -1

  while (++index < results.length) {
    const child = results[index]

    // Add eols before nodes, except if this is a loose, first paragraph.
    if (
      loose ||
      index !== 0 ||
      child.type !== 'element' ||
      child.tagName !== 'p'
    ) {
      children.push({type: 'text', value: '\n'})
    }

    if (child.type === 'element' && child.tagName === 'p' && !loose) {
      children.push(...child.children)
    } else {
      children.push(child)
    }
  }

  const tail = results[results.length - 1]

  // Add a final eol.
  if (tail && (loose || tail.type !== 'element' || tail.tagName !== 'p')) {
    children.push({type: 'text', value: '\n'})
  }

  /** @type {Element} */
  const result = {type: 'element', tagName: 'li', properties, children}
  state.patch(node, result)
  return state.applyData(node, result)
}

/**
 * @param {Parents} node
 * @return {Boolean}
 */
function listLoose(node) {
  let loose = false
  if (node.type === 'list') {
    loose = node.spread || false
    const children = node.children
    let index = -1

    while (!loose && ++index < children.length) {
      loose = listItemLoose(children[index])
    }
  }

  return loose
}

/**
 * @param {ListItem} node
 * @return {Boolean}
 */
function listItemLoose(node) {
  const spread = node.spread

  return spread === null || spread === undefined
    ? node.children.length > 1
    : spread
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/list.js
/**
 * @import {Element, Properties} from 'hast'
 * @import {List} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `list` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {List} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
function list_list(state, node) {
  /** @type {Properties} */
  const properties = {}
  const results = state.all(node)
  let index = -1

  if (typeof node.start === 'number' && node.start !== 1) {
    properties.start = node.start
  }

  // Like GitHub, add a class for custom styling.
  while (++index < results.length) {
    const child = results[index]

    if (
      child.type === 'element' &&
      child.tagName === 'li' &&
      child.properties &&
      Array.isArray(child.properties.className) &&
      child.properties.className.includes('task-list-item')
    ) {
      properties.className = ['contains-task-list']
      break
    }
  }

  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: node.ordered ? 'ol' : 'ul',
    properties,
    children: state.wrap(results, true)
  }
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/paragraph.js
/**
 * @import {Element} from 'hast'
 * @import {Paragraph} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `paragraph` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Paragraph} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
function paragraph(state, node) {
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'p',
    properties: {},
    children: state.all(node)
  }
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/root.js
/**
 * @import {Parents as HastParents, Root as HastRoot} from 'hast'
 * @import {Root as MdastRoot} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `root` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {MdastRoot} node
 *   mdast node.
 * @returns {HastParents}
 *   hast node.
 */
function root_root(state, node) {
  /** @type {HastRoot} */
  const result = {type: 'root', children: state.wrap(state.all(node))}
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/strong.js
/**
 * @import {Element} from 'hast'
 * @import {Strong} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `strong` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Strong} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
function strong(state, node) {
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'strong',
    properties: {},
    children: state.all(node)
  }
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/table.js
/**
 * @import {Table} from 'mdast'
 * @import {Element} from 'hast'
 * @import {State} from '../state.js'
 */



/**
 * Turn an mdast `table` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Table} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
function table(state, node) {
  const rows = state.all(node)
  const firstRow = rows.shift()
  /** @type {Array<Element>} */
  const tableContent = []

  if (firstRow) {
    /** @type {Element} */
    const head = {
      type: 'element',
      tagName: 'thead',
      properties: {},
      children: state.wrap([firstRow], true)
    }
    state.patch(node.children[0], head)
    tableContent.push(head)
  }

  if (rows.length > 0) {
    /** @type {Element} */
    const body = {
      type: 'element',
      tagName: 'tbody',
      properties: {},
      children: state.wrap(rows, true)
    }

    const start = pointStart(node.children[1])
    const end = pointEnd(node.children[node.children.length - 1])
    if (start && end) body.position = {start, end}
    tableContent.push(body)
  }

  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'table',
    properties: {},
    children: state.wrap(tableContent, true)
  }
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/table-row.js
/**
 * @import {Element, ElementContent, Properties} from 'hast'
 * @import {Parents, TableRow} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `tableRow` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {TableRow} node
 *   mdast node.
 * @param {Parents | undefined} parent
 *   Parent of `node`.
 * @returns {Element}
 *   hast node.
 */
function tableRow(state, node, parent) {
  const siblings = parent ? parent.children : undefined
  // Generate a body row when without parent.
  const rowIndex = siblings ? siblings.indexOf(node) : 1
  const tagName = rowIndex === 0 ? 'th' : 'td'
  // To do: option to use `style`?
  const align = parent && parent.type === 'table' ? parent.align : undefined
  const length = align ? align.length : node.children.length
  let cellIndex = -1
  /** @type {Array<ElementContent>} */
  const cells = []

  while (++cellIndex < length) {
    // Note: can also be undefined.
    const cell = node.children[cellIndex]
    /** @type {Properties} */
    const properties = {}
    const alignValue = align ? align[cellIndex] : undefined

    if (alignValue) {
      properties.align = alignValue
    }

    /** @type {Element} */
    let result = {type: 'element', tagName, properties, children: []}

    if (cell) {
      result.children = state.all(cell)
      state.patch(cell, result)
      result = state.applyData(cell, result)
    }

    cells.push(result)
  }

  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'tr',
    properties: {},
    children: state.wrap(cells, true)
  }
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/table-cell.js
/**
 * @import {Element} from 'hast'
 * @import {TableCell} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `tableCell` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {TableCell} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
function tableCell(state, node) {
  // Note: this function is normally not called: see `table-row` for how rows
  // and their cells are compiled.
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'td', // Assume body cell.
    properties: {},
    children: state.all(node)
  }
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/trim-lines@3.0.1/node_modules/trim-lines/index.js
const tab = 9 /* `\t` */
const space = 32 /* ` ` */

/**
 * Remove initial and final spaces and tabs at the line breaks in `value`.
 * Does not trim initial and final spaces and tabs of the value itself.
 *
 * @param {string} value
 *   Value to trim.
 * @returns {string}
 *   Trimmed value.
 */
function trimLines(value) {
  const source = String(value)
  const search = /\r?\n|\r/g
  let match = search.exec(source)
  let last = 0
  /** @type {Array<string>} */
  const lines = []

  while (match) {
    lines.push(
      trimLine(source.slice(last, match.index), last > 0, true),
      match[0]
    )

    last = match.index + match[0].length
    match = search.exec(source)
  }

  lines.push(trimLine(source.slice(last), last > 0, false))

  return lines.join('')
}

/**
 * @param {string} value
 *   Line to trim.
 * @param {boolean} start
 *   Whether to trim the start of the line.
 * @param {boolean} end
 *   Whether to trim the end of the line.
 * @returns {string}
 *   Trimmed line.
 */
function trimLine(value, start, end) {
  let startIndex = 0
  let endIndex = value.length

  if (start) {
    let code = value.codePointAt(startIndex)

    while (code === tab || code === space) {
      startIndex++
      code = value.codePointAt(startIndex)
    }
  }

  if (end) {
    let code = value.codePointAt(endIndex - 1)

    while (code === tab || code === space) {
      endIndex--
      code = value.codePointAt(endIndex - 1)
    }
  }

  return endIndex > startIndex ? value.slice(startIndex, endIndex) : ''
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/text.js
/**
 * @import {Element as HastElement, Text as HastText} from 'hast'
 * @import {Text as MdastText} from 'mdast'
 * @import {State} from '../state.js'
 */



/**
 * Turn an mdast `text` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {MdastText} node
 *   mdast node.
 * @returns {HastElement | HastText}
 *   hast node.
 */
function handlers_text_text(state, node) {
  /** @type {HastText} */
  const result = {type: 'text', value: trimLines(String(node.value))}
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/thematic-break.js
/**
 * @import {Element} from 'hast'
 * @import {ThematicBreak} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `thematicBreak` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {ThematicBreak} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
function thematic_break_thematicBreak(state, node) {
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'hr',
    properties: {},
    children: []
  }
  state.patch(node, result)
  return state.applyData(node, result)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/index.js
/**
 * @import {Handlers} from '../state.js'
 */

























/**
 * Default handlers for nodes.
 *
 * @satisfies {Handlers}
 */
const handlers_handlers = {
  blockquote: blockquote,
  break: hardBreak,
  code: code,
  delete: strikethrough,
  emphasis: emphasis,
  footnoteReference: footnoteReference,
  heading: heading,
  html: html,
  imageReference: imageReference,
  image: image_image,
  inlineCode: inlineCode,
  linkReference: linkReference,
  link: link_link,
  listItem: listItem,
  list: list_list,
  paragraph: paragraph,
  // @ts-expect-error: root is different, but hard to type.
  root: root_root,
  strong: strong,
  table: table,
  tableCell: tableCell,
  tableRow: tableRow,
  text: handlers_text_text,
  thematicBreak: thematic_break_thematicBreak,
  toml: ignore,
  yaml: ignore,
  definition: ignore,
  footnoteDefinition: ignore
}

// Return nothing for nodes that are ignored.
function ignore() {
  return undefined
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/state.js
/**
 * @import {
 *   ElementContent as HastElementContent,
 *   Element as HastElement,
 *   Nodes as HastNodes,
 *   Properties as HastProperties,
 *   RootContent as HastRootContent,
 *   Text as HastText
 * } from 'hast'
 * @import {
 *   Definition as MdastDefinition,
 *   FootnoteDefinition as MdastFootnoteDefinition,
 *   Nodes as MdastNodes,
 *   Parents as MdastParents
 * } from 'mdast'
 * @import {VFile} from 'vfile'
 * @import {
 *   FootnoteBackContentTemplate,
 *   FootnoteBackLabelTemplate
 * } from './footer.js'
 */

/**
 * @callback Handler
 *   Handle a node.
 * @param {State} state
 *   Info passed around.
 * @param {any} node
 *   mdast node to handle.
 * @param {MdastParents | undefined} parent
 *   Parent of `node`.
 * @returns {Array<HastElementContent> | HastElementContent | undefined}
 *   hast node.
 *
 * @typedef {Partial<Record<MdastNodes['type'], Handler>>} Handlers
 *   Handle nodes.
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [allowDangerousHtml=false]
 *   Whether to persist raw HTML in markdown in the hast tree (default:
 *   `false`).
 * @property {string | null | undefined} [clobberPrefix='user-content-']
 *   Prefix to use before the `id` property on footnotes to prevent them from
 *   *clobbering* (default: `'user-content-'`).
 *
 *   Pass `''` for trusted markdown and when you are careful with
 *   polyfilling.
 *   You could pass a different prefix.
 *
 *   DOM clobbering is this:
 *
 *   ```html
 *   <p id="x"></p>
 *   <script>alert(x) // `x` now refers to the `p#x` DOM element</script>
 *   ```
 *
 *   The above example shows that elements are made available by browsers, by
 *   their ID, on the `window` object.
 *   This is a security risk because you might be expecting some other variable
 *   at that place.
 *   It can also break polyfills.
 *   Using a prefix solves these problems.
 * @property {VFile | null | undefined} [file]
 *   Corresponding virtual file representing the input document (optional).
 * @property {FootnoteBackContentTemplate | string | null | undefined} [footnoteBackContent]
 *   Content of the backreference back to references (default: `defaultFootnoteBackContent`).
 *
 *   The default value is:
 *
 *   ```js
 *   function defaultFootnoteBackContent(_, rereferenceIndex) {
 *     const result = [{type: 'text', value: '↩'}]
 *
 *     if (rereferenceIndex > 1) {
 *       result.push({
 *         type: 'element',
 *         tagName: 'sup',
 *         properties: {},
 *         children: [{type: 'text', value: String(rereferenceIndex)}]
 *       })
 *     }
 *
 *     return result
 *   }
 *   ```
 *
 *   This content is used in the `a` element of each backreference (the `↩`
 *   links).
 * @property {FootnoteBackLabelTemplate | string | null | undefined} [footnoteBackLabel]
 *   Label to describe the backreference back to references (default:
 *   `defaultFootnoteBackLabel`).
 *
 *   The default value is:
 *
 *   ```js
 *   function defaultFootnoteBackLabel(referenceIndex, rereferenceIndex) {
 *    return (
 *      'Back to reference ' +
 *      (referenceIndex + 1) +
 *      (rereferenceIndex > 1 ? '-' + rereferenceIndex : '')
 *    )
 *   }
 *   ```
 *
 *   Change it when the markdown is not in English.
 *
 *   This label is used in the `ariaLabel` property on each backreference
 *   (the `↩` links).
 *   It affects users of assistive technology.
 * @property {string | null | undefined} [footnoteLabel='Footnotes']
 *   Textual label to use for the footnotes section (default: `'Footnotes'`).
 *
 *   Change it when the markdown is not in English.
 *
 *   This label is typically hidden visually (assuming a `sr-only` CSS class
 *   is defined that does that) and so affects screen readers only.
 *   If you do have such a class, but want to show this section to everyone,
 *   pass different properties with the `footnoteLabelProperties` option.
 * @property {HastProperties | null | undefined} [footnoteLabelProperties={className: ['sr-only']}]
 *   Properties to use on the footnote label (default: `{className:
 *   ['sr-only']}`).
 *
 *   Change it to show the label and add other properties.
 *
 *   This label is typically hidden visually (assuming an `sr-only` CSS class
 *   is defined that does that) and so affects screen readers only.
 *   If you do have such a class, but want to show this section to everyone,
 *   pass an empty string.
 *   You can also add different properties.
 *
 *   > **Note**: `id: 'footnote-label'` is always added, because footnote
 *   > calls use it with `aria-describedby` to provide an accessible label.
 * @property {string | null | undefined} [footnoteLabelTagName='h2']
 *   HTML tag name to use for the footnote label element (default: `'h2'`).
 *
 *   Change it to match your document structure.
 *
 *   This label is typically hidden visually (assuming a `sr-only` CSS class
 *   is defined that does that) and so affects screen readers only.
 *   If you do have such a class, but want to show this section to everyone,
 *   pass different properties with the `footnoteLabelProperties` option.
 * @property {Handlers | null | undefined} [handlers]
 *   Extra handlers for nodes (optional).
 * @property {Array<MdastNodes['type']> | null | undefined} [passThrough]
 *   List of custom mdast node types to pass through (keep) in hast (note that
 *   the node itself is passed, but eventual children are transformed)
 *   (optional).
 * @property {Handler | null | undefined} [unknownHandler]
 *   Handler for all unknown nodes (optional).
 *
 * @typedef State
 *   Info passed around.
 * @property {(node: MdastNodes) => Array<HastElementContent>} all
 *   Transform the children of an mdast parent to hast.
 * @property {<Type extends HastNodes>(from: MdastNodes, to: Type) => HastElement | Type} applyData
 *   Honor the `data` of `from`, and generate an element instead of `node`.
 * @property {Map<string, MdastDefinition>} definitionById
 *   Definitions by their identifier.
 * @property {Map<string, MdastFootnoteDefinition>} footnoteById
 *   Footnote definitions by their identifier.
 * @property {Map<string, number>} footnoteCounts
 *   Counts for how often the same footnote was called.
 * @property {Array<string>} footnoteOrder
 *   Identifiers of order when footnote calls first appear in tree order.
 * @property {Handlers} handlers
 *   Applied handlers.
 * @property {(node: MdastNodes, parent: MdastParents | undefined) => Array<HastElementContent> | HastElementContent | undefined} one
 *   Transform an mdast node to hast.
 * @property {Options} options
 *   Configuration.
 * @property {(from: MdastNodes, node: HastNodes) => undefined} patch
 *   Copy a node’s positional info.
 * @property {<Type extends HastRootContent>(nodes: Array<Type>, loose?: boolean | undefined) => Array<HastText | Type>} wrap
 *   Wrap `nodes` with line endings between each node, adds initial/final line endings when `loose`.
 */






const state_own = {}.hasOwnProperty

/** @type {Options} */
const state_emptyOptions = {}

/**
 * Create `state` from an mdast tree.
 *
 * @param {MdastNodes} tree
 *   mdast node to transform.
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {State}
 *   `state` function.
 */
function createState(tree, options) {
  const settings = options || state_emptyOptions
  /** @type {Map<string, MdastDefinition>} */
  const definitionById = new Map()
  /** @type {Map<string, MdastFootnoteDefinition>} */
  const footnoteById = new Map()
  /** @type {Map<string, number>} */
  const footnoteCounts = new Map()
  /** @type {Handlers} */
  // @ts-expect-error: the root handler returns a root.
  // Hard to type.
  const handlers = {...handlers_handlers, ...settings.handlers}

  /** @type {State} */
  const state = {
    all,
    applyData,
    definitionById,
    footnoteById,
    footnoteCounts,
    footnoteOrder: [],
    handlers,
    one,
    options: settings,
    patch,
    wrap
  }

  visit(tree, function (node) {
    if (node.type === 'definition' || node.type === 'footnoteDefinition') {
      const map = node.type === 'definition' ? definitionById : footnoteById
      const id = String(node.identifier).toUpperCase()

      // Mimick CM behavior of link definitions.
      // See: <https://github.com/syntax-tree/mdast-util-definitions/blob/9032189/lib/index.js#L20-L21>.
      if (!map.has(id)) {
        // @ts-expect-error: node type matches map.
        map.set(id, node)
      }
    }
  })

  return state

  /**
   * Transform an mdast node into a hast node.
   *
   * @param {MdastNodes} node
   *   mdast node.
   * @param {MdastParents | undefined} [parent]
   *   Parent of `node`.
   * @returns {Array<HastElementContent> | HastElementContent | undefined}
   *   Resulting hast node.
   */
  function one(node, parent) {
    const type = node.type
    const handle = state.handlers[type]

    if (state_own.call(state.handlers, type) && handle) {
      return handle(state, node, parent)
    }

    if (state.options.passThrough && state.options.passThrough.includes(type)) {
      if ('children' in node) {
        const {children, ...shallow} = node
        const result = esm(shallow)
        // @ts-expect-error: TS doesn’t understand…
        result.children = state.all(node)
        // @ts-expect-error: TS doesn’t understand…
        return result
      }

      // @ts-expect-error: it’s custom.
      return esm(node)
    }

    const unknown = state.options.unknownHandler || defaultUnknownHandler

    return unknown(state, node, parent)
  }

  /**
   * Transform the children of an mdast node into hast nodes.
   *
   * @param {MdastNodes} parent
   *   mdast node to compile
   * @returns {Array<HastElementContent>}
   *   Resulting hast nodes.
   */
  function all(parent) {
    /** @type {Array<HastElementContent>} */
    const values = []

    if ('children' in parent) {
      const nodes = parent.children
      let index = -1
      while (++index < nodes.length) {
        const result = state.one(nodes[index], parent)

        // To do: see if we van clean this? Can we merge texts?
        if (result) {
          if (index && nodes[index - 1].type === 'break') {
            if (!Array.isArray(result) && result.type === 'text') {
              result.value = trimMarkdownSpaceStart(result.value)
            }

            if (!Array.isArray(result) && result.type === 'element') {
              const head = result.children[0]

              if (head && head.type === 'text') {
                head.value = trimMarkdownSpaceStart(head.value)
              }
            }
          }

          if (Array.isArray(result)) {
            values.push(...result)
          } else {
            values.push(result)
          }
        }
      }
    }

    return values
  }
}

/**
 * Copy a node’s positional info.
 *
 * @param {MdastNodes} from
 *   mdast node to copy from.
 * @param {HastNodes} to
 *   hast node to copy into.
 * @returns {undefined}
 *   Nothing.
 */
function patch(from, to) {
  if (from.position) to.position = position(from)
}

/**
 * Honor the `data` of `from` and maybe generate an element instead of `to`.
 *
 * @template {HastNodes} Type
 *   Node type.
 * @param {MdastNodes} from
 *   mdast node to use data from.
 * @param {Type} to
 *   hast node to change.
 * @returns {HastElement | Type}
 *   Nothing.
 */
function applyData(from, to) {
  /** @type {HastElement | Type} */
  let result = to

  // Handle `data.hName`, `data.hProperties, `data.hChildren`.
  if (from && from.data) {
    const hName = from.data.hName
    const hChildren = from.data.hChildren
    const hProperties = from.data.hProperties

    if (typeof hName === 'string') {
      // Transforming the node resulted in an element with a different name
      // than wanted:
      if (result.type === 'element') {
        result.tagName = hName
      }
      // Transforming the node resulted in a non-element, which happens for
      // raw, text, and root nodes (unless custom handlers are passed).
      // The intent of `hName` is to create an element, but likely also to keep
      // the content around (otherwise: pass `hChildren`).
      else {
        /** @type {Array<HastElementContent>} */
        // @ts-expect-error: assume no doctypes in `root`.
        const children = 'children' in result ? result.children : [result]
        result = {type: 'element', tagName: hName, properties: {}, children}
      }
    }

    if (result.type === 'element' && hProperties) {
      Object.assign(result.properties, esm(hProperties))
    }

    if (
      'children' in result &&
      result.children &&
      hChildren !== null &&
      hChildren !== undefined
    ) {
      result.children = hChildren
    }
  }

  return result
}

/**
 * Transform an unknown node.
 *
 * @param {State} state
 *   Info passed around.
 * @param {MdastNodes} node
 *   Unknown mdast node.
 * @returns {HastElement | HastText}
 *   Resulting hast node.
 */
function defaultUnknownHandler(state, node) {
  const data = node.data || {}
  /** @type {HastElement | HastText} */
  const result =
    'value' in node &&
    !(state_own.call(data, 'hProperties') || state_own.call(data, 'hChildren'))
      ? {type: 'text', value: node.value}
      : {
          type: 'element',
          tagName: 'div',
          properties: {},
          children: state.all(node)
        }

  state.patch(node, result)
  return state.applyData(node, result)
}

/**
 * Wrap `nodes` with line endings between each node.
 *
 * @template {HastRootContent} Type
 *   Node type.
 * @param {Array<Type>} nodes
 *   List of nodes to wrap.
 * @param {boolean | undefined} [loose=false]
 *   Whether to add line endings at start and end (default: `false`).
 * @returns {Array<HastText | Type>}
 *   Wrapped nodes.
 */
function wrap(nodes, loose) {
  /** @type {Array<HastText | Type>} */
  const result = []
  let index = -1

  if (loose) {
    result.push({type: 'text', value: '\n'})
  }

  while (++index < nodes.length) {
    if (index) result.push({type: 'text', value: '\n'})
    result.push(nodes[index])
  }

  if (loose && nodes.length > 0) {
    result.push({type: 'text', value: '\n'})
  }

  return result
}

/**
 * Trim spaces and tabs at the start of `value`.
 *
 * @param {string} value
 *   Value to trim.
 * @returns {string}
 *   Result.
 */
function trimMarkdownSpaceStart(value) {
  let index = 0
  let code = value.charCodeAt(index)

  while (code === 9 || code === 32) {
    index++
    code = value.charCodeAt(index)
  }

  return value.slice(index)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/index.js
/**
 * @import {Nodes as HastNodes} from 'hast'
 * @import {Nodes as MdastNodes} from 'mdast'
 * @import {Options} from './state.js'
 */





/**
 * Transform mdast to hast.
 *
 * ##### Notes
 *
 * ###### HTML
 *
 * Raw HTML is available in mdast as `html` nodes and can be embedded in hast
 * as semistandard `raw` nodes.
 * Most utilities ignore `raw` nodes but two notable ones don’t:
 *
 * *   `hast-util-to-html` also has an option `allowDangerousHtml` which will
 *     output the raw HTML.
 *     This is typically discouraged as noted by the option name but is useful
 *     if you completely trust authors
 * *   `hast-util-raw` can handle the raw embedded HTML strings by parsing them
 *     into standard hast nodes (`element`, `text`, etc).
 *     This is a heavy task as it needs a full HTML parser, but it is the only
 *     way to support untrusted content
 *
 * ###### Footnotes
 *
 * Many options supported here relate to footnotes.
 * Footnotes are not specified by CommonMark, which we follow by default.
 * They are supported by GitHub, so footnotes can be enabled in markdown with
 * `mdast-util-gfm`.
 *
 * The options `footnoteBackLabel` and `footnoteLabel` define natural language
 * that explains footnotes, which is hidden for sighted users but shown to
 * assistive technology.
 * When your page is not in English, you must define translated values.
 *
 * Back references use ARIA attributes, but the section label itself uses a
 * heading that is hidden with an `sr-only` class.
 * To show it to sighted users, define different attributes in
 * `footnoteLabelProperties`.
 *
 * ###### Clobbering
 *
 * Footnotes introduces a problem, as it links footnote calls to footnote
 * definitions on the page through `id` attributes generated from user content,
 * which results in DOM clobbering.
 *
 * DOM clobbering is this:
 *
 * ```html
 * <p id=x></p>
 * <script>alert(x) // `x` now refers to the DOM `p#x` element</script>
 * ```
 *
 * Elements by their ID are made available by browsers on the `window` object,
 * which is a security risk.
 * Using a prefix solves this problem.
 *
 * More information on how to handle clobbering and the prefix is explained in
 * Example: headings (DOM clobbering) in `rehype-sanitize`.
 *
 * ###### Unknown nodes
 *
 * Unknown nodes are nodes with a type that isn’t in `handlers` or `passThrough`.
 * The default behavior for unknown nodes is:
 *
 * *   when the node has a `value` (and doesn’t have `data.hName`,
 *     `data.hProperties`, or `data.hChildren`, see later), create a hast `text`
 *     node
 * *   otherwise, create a `<div>` element (which could be changed with
 *     `data.hName`), with its children mapped from mdast to hast as well
 *
 * This behavior can be changed by passing an `unknownHandler`.
 *
 * @param {MdastNodes} tree
 *   mdast tree.
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {HastNodes}
 *   hast tree.
 */
function toHast(tree, options) {
  const state = createState(tree, options)
  const node = state.one(tree, undefined)
  const foot = footer(state)
  /** @type {HastNodes} */
  const result = Array.isArray(node)
    ? {type: 'root', children: node}
    : node || {type: 'root', children: []}

  if (foot) {
    // If there’s a footer, there were definitions, meaning block
    // content.
    // So `result` is a parent node.
    ok('children' in result)
    result.children.push({type: 'text', value: '\n'}, foot)
  }

  return result
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/remark-rehype@11.1.2/node_modules/remark-rehype/lib/index.js
/**
 * @import {Root as HastRoot} from 'hast'
 * @import {Root as MdastRoot} from 'mdast'
 * @import {Options as ToHastOptions} from 'mdast-util-to-hast'
 * @import {Processor} from 'unified'
 * @import {VFile} from 'vfile'
 */

/**
 * @typedef {Omit<ToHastOptions, 'file'>} Options
 *
 * @callback TransformBridge
 *   Bridge-mode.
 *
 *   Runs the destination with the new hast tree.
 *   Discards result.
 * @param {MdastRoot} tree
 *   Tree.
 * @param {VFile} file
 *   File.
 * @returns {Promise<undefined>}
 *   Nothing.
 *
 * @callback TransformMutate
 *  Mutate-mode.
 *
 *  Further transformers run on the hast tree.
 * @param {MdastRoot} tree
 *   Tree.
 * @param {VFile} file
 *   File.
 * @returns {HastRoot}
 *   Tree (hast).
 */



/**
 * Turn markdown into HTML.
 *
 * ##### Notes
 *
 * ###### Signature
 *
 * * if a processor is given,
 *   runs the (rehype) plugins used on it with a hast tree,
 *   then discards the result (*bridge mode*)
 * * otherwise,
 *   returns a hast tree,
 *   the plugins used after `remarkRehype` are rehype plugins (*mutate mode*)
 *
 * > 👉 **Note**:
 * > It’s highly unlikely that you want to pass a `processor`.
 *
 * ###### HTML
 *
 * Raw HTML is available in mdast as `html` nodes and can be embedded in hast
 * as semistandard `raw` nodes.
 * Most plugins ignore `raw` nodes but two notable ones don’t:
 *
 * * `rehype-stringify` also has an option `allowDangerousHtml` which will
 *   output the raw HTML.
 *   This is typically discouraged as noted by the option name but is useful if
 *   you completely trust authors
 * * `rehype-raw` can handle the raw embedded HTML strings by parsing them
 *   into standard hast nodes (`element`, `text`, etc);
 *   this is a heavy task as it needs a full HTML parser,
 *   but it is the only way to support untrusted content
 *
 * ###### Footnotes
 *
 * Many options supported here relate to footnotes.
 * Footnotes are not specified by CommonMark,
 * which we follow by default.
 * They are supported by GitHub,
 * so footnotes can be enabled in markdown with `remark-gfm`.
 *
 * The options `footnoteBackLabel` and `footnoteLabel` define natural language
 * that explains footnotes,
 * which is hidden for sighted users but shown to assistive technology.
 * When your page is not in English,
 * you must define translated values.
 *
 * Back references use ARIA attributes,
 * but the section label itself uses a heading that is hidden with an
 * `sr-only` class.
 * To show it to sighted users,
 * define different attributes in `footnoteLabelProperties`.
 *
 * ###### Clobbering
 *
 * Footnotes introduces a problem,
 * as it links footnote calls to footnote definitions on the page through `id`
 * attributes generated from user content,
 * which results in DOM clobbering.
 *
 * DOM clobbering is this:
 *
 * ```html
 * <p id=x></p>
 * <script>alert(x) // `x` now refers to the DOM `p#x` element</script>
 * ```
 *
 * Elements by their ID are made available by browsers on the `window` object,
 * which is a security risk.
 * Using a prefix solves this problem.
 *
 * More information on how to handle clobbering and the prefix is explained in
 * *Example: headings (DOM clobbering)* in `rehype-sanitize`.
 *
 * ###### Unknown nodes
 *
 * Unknown nodes are nodes with a type that isn’t in `handlers` or `passThrough`.
 * The default behavior for unknown nodes is:
 *
 * * when the node has a `value`
 *   (and doesn’t have `data.hName`, `data.hProperties`, or `data.hChildren`,
 *   see later),
 *   create a hast `text` node
 * * otherwise,
 *   create a `<div>` element (which could be changed with `data.hName`),
 *   with its children mapped from mdast to hast as well
 *
 * This behavior can be changed by passing an `unknownHandler`.
 *
 * @overload
 * @param {Processor} processor
 * @param {Readonly<Options> | null | undefined} [options]
 * @returns {TransformBridge}
 *
 * @overload
 * @param {Readonly<Options> | null | undefined} [options]
 * @returns {TransformMutate}
 *
 * @overload
 * @param {Readonly<Options> | Processor | null | undefined} [destination]
 * @param {Readonly<Options> | null | undefined} [options]
 * @returns {TransformBridge | TransformMutate}
 *
 * @param {Readonly<Options> | Processor | null | undefined} [destination]
 *   Processor or configuration (optional).
 * @param {Readonly<Options> | null | undefined} [options]
 *   When a processor was given,
 *   configuration (optional).
 * @returns {TransformBridge | TransformMutate}
 *   Transform.
 */
function remarkRehype(destination, options) {
  if (destination && 'run' in destination) {
    /**
     * @type {TransformBridge}
     */
    return async function (tree, file) {
      // Cast because root in -> root out.
      const hastTree = /** @type {HastRoot} */ (
        toHast(tree, {file, ...options})
      )
      await destination.run(hastTree, file)
    }
  }

  /**
   * @type {TransformMutate}
   */
  return function (tree, file) {
    // Cast because root in -> root out.
    // To do: in the future, disallow ` || options` fallback.
    // With `unified-engine`, `destination` can be `undefined` but
    // `options` will be the file set.
    // We should not pass that as `options`.
    return /** @type {HastRoot} */ (
      toHast(tree, {file, ...(destination || options)})
    )
  }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/bail@2.0.2/node_modules/bail/index.js
/**
 * Throw a given error.
 *
 * @param {Error|null|undefined} [error]
 *   Maybe error.
 * @returns {asserts error is null|undefined}
 */
function bail(error) {
  if (error) {
    throw error
  }
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/extend@3.0.2/node_modules/extend/index.js
var extend = __webpack_require__(3405);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/is-plain-obj@4.1.0/node_modules/is-plain-obj/index.js
function isPlainObject(value) {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/trough@2.2.0/node_modules/trough/lib/index.js
// To do: remove `void`s
// To do: remove `null` from output of our APIs, allow it as user APIs.

/**
 * @typedef {(error?: Error | null | undefined, ...output: Array<any>) => void} Callback
 *   Callback.
 *
 * @typedef {(...input: Array<any>) => any} Middleware
 *   Ware.
 *
 * @typedef Pipeline
 *   Pipeline.
 * @property {Run} run
 *   Run the pipeline.
 * @property {Use} use
 *   Add middleware.
 *
 * @typedef {(...input: Array<any>) => void} Run
 *   Call all middleware.
 *
 *   Calls `done` on completion with either an error or the output of the
 *   last middleware.
 *
 *   > 👉 **Note**: as the length of input defines whether async functions get a
 *   > `next` function,
 *   > it’s recommended to keep `input` at one value normally.

 *
 * @typedef {(fn: Middleware) => Pipeline} Use
 *   Add middleware.
 */

/**
 * Create new middleware.
 *
 * @returns {Pipeline}
 *   Pipeline.
 */
function trough() {
  /** @type {Array<Middleware>} */
  const fns = []
  /** @type {Pipeline} */
  const pipeline = {run, use}

  return pipeline

  /** @type {Run} */
  function run(...values) {
    let middlewareIndex = -1
    /** @type {Callback} */
    const callback = values.pop()

    if (typeof callback !== 'function') {
      throw new TypeError('Expected function as last argument, not ' + callback)
    }

    next(null, ...values)

    /**
     * Run the next `fn`, or we’re done.
     *
     * @param {Error | null | undefined} error
     * @param {Array<any>} output
     */
    function next(error, ...output) {
      const fn = fns[++middlewareIndex]
      let index = -1

      if (error) {
        callback(error)
        return
      }

      // Copy non-nullish input into values.
      while (++index < values.length) {
        if (output[index] === null || output[index] === undefined) {
          output[index] = values[index]
        }
      }

      // Save the newly created `output` for the next call.
      values = output

      // Next or done.
      if (fn) {
        lib_wrap(fn, next)(...output)
      } else {
        callback(null, ...output)
      }
    }
  }

  /** @type {Use} */
  function use(middelware) {
    if (typeof middelware !== 'function') {
      throw new TypeError(
        'Expected `middelware` to be a function, not ' + middelware
      )
    }

    fns.push(middelware)
    return pipeline
  }
}

/**
 * Wrap `middleware` into a uniform interface.
 *
 * You can pass all input to the resulting function.
 * `callback` is then called with the output of `middleware`.
 *
 * If `middleware` accepts more arguments than the later given in input,
 * an extra `done` function is passed to it after that input,
 * which must be called by `middleware`.
 *
 * The first value in `input` is the main input value.
 * All other input values are the rest input values.
 * The values given to `callback` are the input values,
 * merged with every non-nullish output value.
 *
 * * if `middleware` throws an error,
 *   returns a promise that is rejected,
 *   or calls the given `done` function with an error,
 *   `callback` is called with that error
 * * if `middleware` returns a value or returns a promise that is resolved,
 *   that value is the main output value
 * * if `middleware` calls `done`,
 *   all non-nullish values except for the first one (the error) overwrite the
 *   output values
 *
 * @param {Middleware} middleware
 *   Function to wrap.
 * @param {Callback} callback
 *   Callback called with the output of `middleware`.
 * @returns {Run}
 *   Wrapped middleware.
 */
function lib_wrap(middleware, callback) {
  /** @type {boolean} */
  let called

  return wrapped

  /**
   * Call `middleware`.
   * @this {any}
   * @param {Array<any>} parameters
   * @returns {void}
   */
  function wrapped(...parameters) {
    const fnExpectsCallback = middleware.length > parameters.length
    /** @type {any} */
    let result

    if (fnExpectsCallback) {
      parameters.push(done)
    }

    try {
      result = middleware.apply(this, parameters)
    } catch (error) {
      const exception = /** @type {Error} */ (error)

      // Well, this is quite the pickle.
      // `middleware` received a callback and called it synchronously, but that
      // threw an error.
      // The only thing left to do is to throw the thing instead.
      if (fnExpectsCallback && called) {
        throw exception
      }

      return done(exception)
    }

    if (!fnExpectsCallback) {
      if (result && result.then && typeof result.then === 'function') {
        result.then(then, done)
      } else if (result instanceof Error) {
        done(result)
      } else {
        then(result)
      }
    }
  }

  /**
   * Call `callback`, only once.
   *
   * @type {Callback}
   */
  function done(error, ...output) {
    if (!called) {
      called = true
      callback(error, ...output)
    }
  }

  /**
   * Call `done` with one value.
   *
   * @param {any} [value]
   */
  function then(value) {
    done(null, value)
  }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/vfile@6.0.3/node_modules/vfile/lib/minpath.browser.js
// A derivative work based on:
// <https://github.com/browserify/path-browserify>.
// Which is licensed:
//
// MIT License
//
// Copyright (c) 2013 James Halliday
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// A derivative work based on:
//
// Parts of that are extracted from Node’s internal `path` module:
// <https://github.com/nodejs/node/blob/master/lib/path.js>.
// Which is licensed:
//
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

const minpath = {basename, dirname, extname, join, sep: '/'}

/* eslint-disable max-depth, complexity */

/**
 * Get the basename from a path.
 *
 * @param {string} path
 *   File path.
 * @param {string | null | undefined} [extname]
 *   Extension to strip.
 * @returns {string}
 *   Stem or basename.
 */
function basename(path, extname) {
  if (extname !== undefined && typeof extname !== 'string') {
    throw new TypeError('"ext" argument must be a string')
  }

  assertPath(path)
  let start = 0
  let end = -1
  let index = path.length
  /** @type {boolean | undefined} */
  let seenNonSlash

  if (
    extname === undefined ||
    extname.length === 0 ||
    extname.length > path.length
  ) {
    while (index--) {
      if (path.codePointAt(index) === 47 /* `/` */) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now.
        if (seenNonSlash) {
          start = index + 1
          break
        }
      } else if (end < 0) {
        // We saw the first non-path separator, mark this as the end of our
        // path component.
        seenNonSlash = true
        end = index + 1
      }
    }

    return end < 0 ? '' : path.slice(start, end)
  }

  if (extname === path) {
    return ''
  }

  let firstNonSlashEnd = -1
  let extnameIndex = extname.length - 1

  while (index--) {
    if (path.codePointAt(index) === 47 /* `/` */) {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now.
      if (seenNonSlash) {
        start = index + 1
        break
      }
    } else {
      if (firstNonSlashEnd < 0) {
        // We saw the first non-path separator, remember this index in case
        // we need it if the extension ends up not matching.
        seenNonSlash = true
        firstNonSlashEnd = index + 1
      }

      if (extnameIndex > -1) {
        // Try to match the explicit extension.
        if (path.codePointAt(index) === extname.codePointAt(extnameIndex--)) {
          if (extnameIndex < 0) {
            // We matched the extension, so mark this as the end of our path
            // component
            end = index
          }
        } else {
          // Extension does not match, so our result is the entire path
          // component
          extnameIndex = -1
          end = firstNonSlashEnd
        }
      }
    }
  }

  if (start === end) {
    end = firstNonSlashEnd
  } else if (end < 0) {
    end = path.length
  }

  return path.slice(start, end)
}

/**
 * Get the dirname from a path.
 *
 * @param {string} path
 *   File path.
 * @returns {string}
 *   File path.
 */
function dirname(path) {
  assertPath(path)

  if (path.length === 0) {
    return '.'
  }

  let end = -1
  let index = path.length
  /** @type {boolean | undefined} */
  let unmatchedSlash

  // Prefix `--` is important to not run on `0`.
  while (--index) {
    if (path.codePointAt(index) === 47 /* `/` */) {
      if (unmatchedSlash) {
        end = index
        break
      }
    } else if (!unmatchedSlash) {
      // We saw the first non-path separator
      unmatchedSlash = true
    }
  }

  return end < 0
    ? path.codePointAt(0) === 47 /* `/` */
      ? '/'
      : '.'
    : end === 1 && path.codePointAt(0) === 47 /* `/` */
      ? '//'
      : path.slice(0, end)
}

/**
 * Get an extname from a path.
 *
 * @param {string} path
 *   File path.
 * @returns {string}
 *   Extname.
 */
function extname(path) {
  assertPath(path)

  let index = path.length

  let end = -1
  let startPart = 0
  let startDot = -1
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find.
  let preDotState = 0
  /** @type {boolean | undefined} */
  let unmatchedSlash

  while (index--) {
    const code = path.codePointAt(index)

    if (code === 47 /* `/` */) {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now.
      if (unmatchedSlash) {
        startPart = index + 1
        break
      }

      continue
    }

    if (end < 0) {
      // We saw the first non-path separator, mark this as the end of our
      // extension.
      unmatchedSlash = true
      end = index + 1
    }

    if (code === 46 /* `.` */) {
      // If this is our first dot, mark it as the start of our extension.
      if (startDot < 0) {
        startDot = index
      } else if (preDotState !== 1) {
        preDotState = 1
      }
    } else if (startDot > -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension.
      preDotState = -1
    }
  }

  if (
    startDot < 0 ||
    end < 0 ||
    // We saw a non-dot character immediately before the dot.
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly `..`.
    (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
  ) {
    return ''
  }

  return path.slice(startDot, end)
}

/**
 * Join segments from a path.
 *
 * @param {Array<string>} segments
 *   Path segments.
 * @returns {string}
 *   File path.
 */
function join(...segments) {
  let index = -1
  /** @type {string | undefined} */
  let joined

  while (++index < segments.length) {
    assertPath(segments[index])

    if (segments[index]) {
      joined =
        joined === undefined ? segments[index] : joined + '/' + segments[index]
    }
  }

  return joined === undefined ? '.' : normalize(joined)
}

/**
 * Normalize a basic file path.
 *
 * @param {string} path
 *   File path.
 * @returns {string}
 *   File path.
 */
// Note: `normalize` is not exposed as `path.normalize`, so some code is
// manually removed from it.
function normalize(path) {
  assertPath(path)

  const absolute = path.codePointAt(0) === 47 /* `/` */

  // Normalize the path according to POSIX rules.
  let value = normalizeString(path, !absolute)

  if (value.length === 0 && !absolute) {
    value = '.'
  }

  if (value.length > 0 && path.codePointAt(path.length - 1) === 47 /* / */) {
    value += '/'
  }

  return absolute ? '/' + value : value
}

/**
 * Resolve `.` and `..` elements in a path with directory names.
 *
 * @param {string} path
 *   File path.
 * @param {boolean} allowAboveRoot
 *   Whether `..` can move above root.
 * @returns {string}
 *   File path.
 */
function normalizeString(path, allowAboveRoot) {
  let result = ''
  let lastSegmentLength = 0
  let lastSlash = -1
  let dots = 0
  let index = -1
  /** @type {number | undefined} */
  let code
  /** @type {number} */
  let lastSlashIndex

  while (++index <= path.length) {
    if (index < path.length) {
      code = path.codePointAt(index)
    } else if (code === 47 /* `/` */) {
      break
    } else {
      code = 47 /* `/` */
    }

    if (code === 47 /* `/` */) {
      if (lastSlash === index - 1 || dots === 1) {
        // Empty.
      } else if (lastSlash !== index - 1 && dots === 2) {
        if (
          result.length < 2 ||
          lastSegmentLength !== 2 ||
          result.codePointAt(result.length - 1) !== 46 /* `.` */ ||
          result.codePointAt(result.length - 2) !== 46 /* `.` */
        ) {
          if (result.length > 2) {
            lastSlashIndex = result.lastIndexOf('/')

            if (lastSlashIndex !== result.length - 1) {
              if (lastSlashIndex < 0) {
                result = ''
                lastSegmentLength = 0
              } else {
                result = result.slice(0, lastSlashIndex)
                lastSegmentLength = result.length - 1 - result.lastIndexOf('/')
              }

              lastSlash = index
              dots = 0
              continue
            }
          } else if (result.length > 0) {
            result = ''
            lastSegmentLength = 0
            lastSlash = index
            dots = 0
            continue
          }
        }

        if (allowAboveRoot) {
          result = result.length > 0 ? result + '/..' : '..'
          lastSegmentLength = 2
        }
      } else {
        if (result.length > 0) {
          result += '/' + path.slice(lastSlash + 1, index)
        } else {
          result = path.slice(lastSlash + 1, index)
        }

        lastSegmentLength = index - lastSlash - 1
      }

      lastSlash = index
      dots = 0
    } else if (code === 46 /* `.` */ && dots > -1) {
      dots++
    } else {
      dots = -1
    }
  }

  return result
}

/**
 * Make sure `path` is a string.
 *
 * @param {string} path
 *   File path.
 * @returns {asserts path is string}
 *   Nothing.
 */
function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError(
      'Path must be a string. Received ' + JSON.stringify(path)
    )
  }
}

/* eslint-enable max-depth, complexity */

;// CONCATENATED MODULE: ../../node_modules/.pnpm/vfile@6.0.3/node_modules/vfile/lib/minproc.browser.js
// Somewhat based on:
// <https://github.com/defunctzombie/node-process/blob/master/browser.js>.
// But I don’t think one tiny line of code can be copyrighted. 😅
const minproc = {cwd}

function cwd() {
  return '/'
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/vfile@6.0.3/node_modules/vfile/lib/minurl.shared.js
/**
 * Checks if a value has the shape of a WHATWG URL object.
 *
 * Using a symbol or instanceof would not be able to recognize URL objects
 * coming from other implementations (e.g. in Electron), so instead we are
 * checking some well known properties for a lack of a better test.
 *
 * We use `href` and `protocol` as they are the only properties that are
 * easy to retrieve and calculate due to the lazy nature of the getters.
 *
 * We check for auth attribute to distinguish legacy url instance with
 * WHATWG URL instance.
 *
 * @param {unknown} fileUrlOrPath
 *   File path or URL.
 * @returns {fileUrlOrPath is URL}
 *   Whether it’s a URL.
 */
// From: <https://github.com/nodejs/node/blob/6a3403c/lib/internal/url.js#L720>
function isUrl(fileUrlOrPath) {
  return Boolean(
    fileUrlOrPath !== null &&
      typeof fileUrlOrPath === 'object' &&
      'href' in fileUrlOrPath &&
      fileUrlOrPath.href &&
      'protocol' in fileUrlOrPath &&
      fileUrlOrPath.protocol &&
      // @ts-expect-error: indexing is fine.
      fileUrlOrPath.auth === undefined
  )
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/vfile@6.0.3/node_modules/vfile/lib/minurl.browser.js




// See: <https://github.com/nodejs/node/blob/6a3403c/lib/internal/url.js>

/**
 * @param {URL | string} path
 *   File URL.
 * @returns {string}
 *   File URL.
 */
function urlToPath(path) {
  if (typeof path === 'string') {
    path = new URL(path)
  } else if (!isUrl(path)) {
    /** @type {NodeJS.ErrnoException} */
    const error = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' +
        path +
        '`'
    )
    error.code = 'ERR_INVALID_ARG_TYPE'
    throw error
  }

  if (path.protocol !== 'file:') {
    /** @type {NodeJS.ErrnoException} */
    const error = new TypeError('The URL must be of scheme file')
    error.code = 'ERR_INVALID_URL_SCHEME'
    throw error
  }

  return getPathFromURLPosix(path)
}

/**
 * Get a path from a POSIX URL.
 *
 * @param {URL} url
 *   URL.
 * @returns {string}
 *   File path.
 */
function getPathFromURLPosix(url) {
  if (url.hostname !== '') {
    /** @type {NodeJS.ErrnoException} */
    const error = new TypeError(
      'File URL host must be "localhost" or empty on darwin'
    )
    error.code = 'ERR_INVALID_FILE_URL_HOST'
    throw error
  }

  const pathname = url.pathname
  let index = -1

  while (++index < pathname.length) {
    if (
      pathname.codePointAt(index) === 37 /* `%` */ &&
      pathname.codePointAt(index + 1) === 50 /* `2` */
    ) {
      const third = pathname.codePointAt(index + 2)
      if (third === 70 /* `F` */ || third === 102 /* `f` */) {
        /** @type {NodeJS.ErrnoException} */
        const error = new TypeError(
          'File URL path must not include encoded / characters'
        )
        error.code = 'ERR_INVALID_FILE_URL_PATH'
        throw error
      }
    }
  }

  return decodeURIComponent(pathname)
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/vfile@6.0.3/node_modules/vfile/lib/index.js
/**
 * @import {Node, Point, Position} from 'unist'
 * @import {Options as MessageOptions} from 'vfile-message'
 * @import {Compatible, Data, Map, Options, Value} from 'vfile'
 */

/**
 * @typedef {object & {type: string, position?: Position | undefined}} NodeLike
 */






/**
 * Order of setting (least specific to most), we need this because otherwise
 * `{stem: 'a', path: '~/b.js'}` would throw, as a path is needed before a
 * stem can be set.
 */
const order = /** @type {const} */ ([
  'history',
  'path',
  'basename',
  'stem',
  'extname',
  'dirname'
])

class VFile {
  /**
   * Create a new virtual file.
   *
   * `options` is treated as:
   *
   * *   `string` or `Uint8Array` — `{value: options}`
   * *   `URL` — `{path: options}`
   * *   `VFile` — shallow copies its data over to the new file
   * *   `object` — all fields are shallow copied over to the new file
   *
   * Path related fields are set in the following order (least specific to
   * most specific): `history`, `path`, `basename`, `stem`, `extname`,
   * `dirname`.
   *
   * You cannot set `dirname` or `extname` without setting either `history`,
   * `path`, `basename`, or `stem` too.
   *
   * @param {Compatible | null | undefined} [value]
   *   File value.
   * @returns
   *   New instance.
   */
  constructor(value) {
    /** @type {Options | VFile} */
    let options

    if (!value) {
      options = {}
    } else if (isUrl(value)) {
      options = {path: value}
    } else if (typeof value === 'string' || isUint8Array(value)) {
      options = {value}
    } else {
      options = value
    }

    /* eslint-disable no-unused-expressions */

    /**
     * Base of `path` (default: `process.cwd()` or `'/'` in browsers).
     *
     * @type {string}
     */
    // Prevent calling `cwd` (which could be expensive) if it’s not needed;
    // the empty string will be overridden in the next block.
    this.cwd = 'cwd' in options ? '' : minproc.cwd()

    /**
     * Place to store custom info (default: `{}`).
     *
     * It’s OK to store custom data directly on the file but moving it to
     * `data` is recommended.
     *
     * @type {Data}
     */
    this.data = {}

    /**
     * List of file paths the file moved between.
     *
     * The first is the original path and the last is the current path.
     *
     * @type {Array<string>}
     */
    this.history = []

    /**
     * List of messages associated with the file.
     *
     * @type {Array<VFileMessage>}
     */
    this.messages = []

    /**
     * Raw value.
     *
     * @type {Value}
     */
    this.value

    // The below are non-standard, they are “well-known”.
    // As in, used in several tools.
    /**
     * Source map.
     *
     * This type is equivalent to the `RawSourceMap` type from the `source-map`
     * module.
     *
     * @type {Map | null | undefined}
     */
    this.map

    /**
     * Custom, non-string, compiled, representation.
     *
     * This is used by unified to store non-string results.
     * One example is when turning markdown into React nodes.
     *
     * @type {unknown}
     */
    this.result

    /**
     * Whether a file was saved to disk.
     *
     * This is used by vfile reporters.
     *
     * @type {boolean}
     */
    this.stored
    /* eslint-enable no-unused-expressions */

    // Set path related properties in the correct order.
    let index = -1

    while (++index < order.length) {
      const field = order[index]

      // Note: we specifically use `in` instead of `hasOwnProperty` to accept
      // `vfile`s too.
      if (
        field in options &&
        options[field] !== undefined &&
        options[field] !== null
      ) {
        // @ts-expect-error: TS doesn’t understand basic reality.
        this[field] = field === 'history' ? [...options[field]] : options[field]
      }
    }

    /** @type {string} */
    let field

    // Set non-path related properties.
    for (field in options) {
      // @ts-expect-error: fine to set other things.
      if (!order.includes(field)) {
        // @ts-expect-error: fine to set other things.
        this[field] = options[field]
      }
    }
  }

  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   *
   * @returns {string | undefined}
   *   Basename.
   */
  get basename() {
    return typeof this.path === 'string'
      ? minpath.basename(this.path)
      : undefined
  }

  /**
   * Set basename (including extname) (`'index.min.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} basename
   *   Basename.
   * @returns {undefined}
   *   Nothing.
   */
  set basename(basename) {
    assertNonEmpty(basename, 'basename')
    assertPart(basename, 'basename')
    this.path = minpath.join(this.dirname || '', basename)
  }

  /**
   * Get the parent path (example: `'~'`).
   *
   * @returns {string | undefined}
   *   Dirname.
   */
  get dirname() {
    return typeof this.path === 'string'
      ? minpath.dirname(this.path)
      : undefined
  }

  /**
   * Set the parent path (example: `'~'`).
   *
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} dirname
   *   Dirname.
   * @returns {undefined}
   *   Nothing.
   */
  set dirname(dirname) {
    lib_assertPath(this.basename, 'dirname')
    this.path = minpath.join(dirname || '', this.basename)
  }

  /**
   * Get the extname (including dot) (example: `'.js'`).
   *
   * @returns {string | undefined}
   *   Extname.
   */
  get extname() {
    return typeof this.path === 'string'
      ? minpath.extname(this.path)
      : undefined
  }

  /**
   * Set the extname (including dot) (example: `'.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} extname
   *   Extname.
   * @returns {undefined}
   *   Nothing.
   */
  set extname(extname) {
    assertPart(extname, 'extname')
    lib_assertPath(this.dirname, 'extname')

    if (extname) {
      if (extname.codePointAt(0) !== 46 /* `.` */) {
        throw new Error('`extname` must start with `.`')
      }

      if (extname.includes('.', 1)) {
        throw new Error('`extname` cannot contain multiple dots')
      }
    }

    this.path = minpath.join(this.dirname, this.stem + (extname || ''))
  }

  /**
   * Get the full path (example: `'~/index.min.js'`).
   *
   * @returns {string}
   *   Path.
   */
  get path() {
    return this.history[this.history.length - 1]
  }

  /**
   * Set the full path (example: `'~/index.min.js'`).
   *
   * Cannot be nullified.
   * You can set a file URL (a `URL` object with a `file:` protocol) which will
   * be turned into a path with `url.fileURLToPath`.
   *
   * @param {URL | string} path
   *   Path.
   * @returns {undefined}
   *   Nothing.
   */
  set path(path) {
    if (isUrl(path)) {
      path = urlToPath(path)
    }

    assertNonEmpty(path, 'path')

    if (this.path !== path) {
      this.history.push(path)
    }
  }

  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   *
   * @returns {string | undefined}
   *   Stem.
   */
  get stem() {
    return typeof this.path === 'string'
      ? minpath.basename(this.path, this.extname)
      : undefined
  }

  /**
   * Set the stem (basename w/o extname) (example: `'index.min'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} stem
   *   Stem.
   * @returns {undefined}
   *   Nothing.
   */
  set stem(stem) {
    assertNonEmpty(stem, 'stem')
    assertPart(stem, 'stem')
    this.path = minpath.join(this.dirname || '', stem + (this.extname || ''))
  }

  // Normal prototypal methods.
  /**
   * Create a fatal message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `true` (error; file not usable)
   * and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {never}
   *   Never.
   * @throws {VFileMessage}
   *   Message.
   */
  fail(causeOrReason, optionsOrParentOrPlace, origin) {
    // @ts-expect-error: the overloads are fine.
    const message = this.message(causeOrReason, optionsOrParentOrPlace, origin)

    message.fatal = true

    throw message
  }

  /**
   * Create an info message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `undefined` (info; change
   * likely not needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  info(causeOrReason, optionsOrParentOrPlace, origin) {
    // @ts-expect-error: the overloads are fine.
    const message = this.message(causeOrReason, optionsOrParentOrPlace, origin)

    message.fatal = undefined

    return message
  }

  /**
   * Create a message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `false` (warning; change may be
   * needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  message(causeOrReason, optionsOrParentOrPlace, origin) {
    const message = new VFileMessage(
      // @ts-expect-error: the overloads are fine.
      causeOrReason,
      optionsOrParentOrPlace,
      origin
    )

    if (this.path) {
      message.name = this.path + ':' + message.name
      message.file = this.path
    }

    message.fatal = false

    this.messages.push(message)

    return message
  }

  /**
   * Serialize the file.
   *
   * > **Note**: which encodings are supported depends on the engine.
   * > For info on Node.js, see:
   * > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
   *
   * @param {string | null | undefined} [encoding='utf8']
   *   Character encoding to understand `value` as when it’s a `Uint8Array`
   *   (default: `'utf-8'`).
   * @returns {string}
   *   Serialized file.
   */
  toString(encoding) {
    if (this.value === undefined) {
      return ''
    }

    if (typeof this.value === 'string') {
      return this.value
    }

    const decoder = new TextDecoder(encoding || undefined)
    return decoder.decode(this.value)
  }
}

/**
 * Assert that `part` is not a path (as in, does not contain `path.sep`).
 *
 * @param {string | null | undefined} part
 *   File path part.
 * @param {string} name
 *   Part name.
 * @returns {undefined}
 *   Nothing.
 */
function assertPart(part, name) {
  if (part && part.includes(minpath.sep)) {
    throw new Error(
      '`' + name + '` cannot be a path: did not expect `' + minpath.sep + '`'
    )
  }
}

/**
 * Assert that `part` is not empty.
 *
 * @param {string | undefined} part
 *   Thing.
 * @param {string} name
 *   Part name.
 * @returns {asserts part is string}
 *   Nothing.
 */
function assertNonEmpty(part, name) {
  if (!part) {
    throw new Error('`' + name + '` cannot be empty')
  }
}

/**
 * Assert `path` exists.
 *
 * @param {string | undefined} path
 *   Path.
 * @param {string} name
 *   Dependency name.
 * @returns {asserts path is string}
 *   Nothing.
 */
function lib_assertPath(path, name) {
  if (!path) {
    throw new Error('Setting `' + name + '` requires `path` to be set too')
  }
}

/**
 * Assert `value` is an `Uint8Array`.
 *
 * @param {unknown} value
 *   thing.
 * @returns {value is Uint8Array}
 *   Whether `value` is an `Uint8Array`.
 */
function isUint8Array(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'byteLength' in value &&
      'byteOffset' in value
  )
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/unified@11.0.5/node_modules/unified/lib/callable-instance.js
const CallableInstance =
  /**
   * @type {new <Parameters extends Array<unknown>, Result>(property: string | symbol) => (...parameters: Parameters) => Result}
   */
  (
    /** @type {unknown} */
    (
      /**
       * @this {Function}
       * @param {string | symbol} property
       * @returns {(...parameters: Array<unknown>) => unknown}
       */
      function (property) {
        const self = this
        const constr = self.constructor
        const proto = /** @type {Record<string | symbol, Function>} */ (
          // Prototypes do exist.
          // type-coverage:ignore-next-line
          constr.prototype
        )
        const value = proto[property]
        /** @type {(...parameters: Array<unknown>) => unknown} */
        const apply = function () {
          return value.apply(apply, arguments)
        }

        Object.setPrototypeOf(apply, proto)

        // Not needed for us in `unified`: we only call this on the `copy`
        // function,
        // and we don't need to add its fields (`length`, `name`)
        // over.
        // See also: GH-246.
        // const names = Object.getOwnPropertyNames(value)
        //
        // for (const p of names) {
        //   const descriptor = Object.getOwnPropertyDescriptor(value, p)
        //   if (descriptor) Object.defineProperty(apply, p, descriptor)
        // }

        return apply
      }
    )
  )

;// CONCATENATED MODULE: ../../node_modules/.pnpm/unified@11.0.5/node_modules/unified/lib/index.js
/**
 * @typedef {import('trough').Pipeline} Pipeline
 *
 * @typedef {import('unist').Node} Node
 *
 * @typedef {import('vfile').Compatible} Compatible
 * @typedef {import('vfile').Value} Value
 *
 * @typedef {import('../index.js').CompileResultMap} CompileResultMap
 * @typedef {import('../index.js').Data} Data
 * @typedef {import('../index.js').Settings} Settings
 */

/**
 * @typedef {CompileResultMap[keyof CompileResultMap]} CompileResults
 *   Acceptable results from compilers.
 *
 *   To register custom results, add them to
 *   {@linkcode CompileResultMap}.
 */

/**
 * @template {Node} [Tree=Node]
 *   The node that the compiler receives (default: `Node`).
 * @template {CompileResults} [Result=CompileResults]
 *   The thing that the compiler yields (default: `CompileResults`).
 * @callback Compiler
 *   A **compiler** handles the compiling of a syntax tree to something else
 *   (in most cases, text) (TypeScript type).
 *
 *   It is used in the stringify phase and called with a {@linkcode Node}
 *   and {@linkcode VFile} representation of the document to compile.
 *   It should return the textual representation of the given tree (typically
 *   `string`).
 *
 *   > **Note**: unified typically compiles by serializing: most compilers
 *   > return `string` (or `Uint8Array`).
 *   > Some compilers, such as the one configured with
 *   > [`rehype-react`][rehype-react], return other values (in this case, a
 *   > React tree).
 *   > If you’re using a compiler that doesn’t serialize, expect different
 *   > result values.
 *   >
 *   > To register custom results in TypeScript, add them to
 *   > {@linkcode CompileResultMap}.
 *
 *   [rehype-react]: https://github.com/rehypejs/rehype-react
 * @param {Tree} tree
 *   Tree to compile.
 * @param {VFile} file
 *   File associated with `tree`.
 * @returns {Result}
 *   New content: compiled text (`string` or `Uint8Array`, for `file.value`) or
 *   something else (for `file.result`).
 */

/**
 * @template {Node} [Tree=Node]
 *   The node that the parser yields (default: `Node`)
 * @callback Parser
 *   A **parser** handles the parsing of text to a syntax tree.
 *
 *   It is used in the parse phase and is called with a `string` and
 *   {@linkcode VFile} of the document to parse.
 *   It must return the syntax tree representation of the given file
 *   ({@linkcode Node}).
 * @param {string} document
 *   Document to parse.
 * @param {VFile} file
 *   File associated with `document`.
 * @returns {Tree}
 *   Node representing the given file.
 */

/**
 * @typedef {(
 *   Plugin<Array<any>, any, any> |
 *   PluginTuple<Array<any>, any, any> |
 *   Preset
 * )} Pluggable
 *   Union of the different ways to add plugins and settings.
 */

/**
 * @typedef {Array<Pluggable>} PluggableList
 *   List of plugins and presets.
 */

// Note: we can’t use `callback` yet as it messes up `this`:
//  <https://github.com/microsoft/TypeScript/issues/55197>.
/**
 * @template {Array<unknown>} [PluginParameters=[]]
 *   Arguments passed to the plugin (default: `[]`, the empty tuple).
 * @template {Node | string | undefined} [Input=Node]
 *   Value that is expected as input (default: `Node`).
 *
 *   *   If the plugin returns a {@linkcode Transformer}, this
 *       should be the node it expects.
 *   *   If the plugin sets a {@linkcode Parser}, this should be
 *       `string`.
 *   *   If the plugin sets a {@linkcode Compiler}, this should be the
 *       node it expects.
 * @template [Output=Input]
 *   Value that is yielded as output (default: `Input`).
 *
 *   *   If the plugin returns a {@linkcode Transformer}, this
 *       should be the node that that yields.
 *   *   If the plugin sets a {@linkcode Parser}, this should be the
 *       node that it yields.
 *   *   If the plugin sets a {@linkcode Compiler}, this should be
 *       result it yields.
 * @typedef {(
 *   (this: Processor, ...parameters: PluginParameters) =>
 *     Input extends string ? // Parser.
 *        Output extends Node | undefined ? undefined | void : never :
 *     Output extends CompileResults ? // Compiler.
 *        Input extends Node | undefined ? undefined | void : never :
 *     Transformer<
 *       Input extends Node ? Input : Node,
 *       Output extends Node ? Output : Node
 *     > | undefined | void
 * )} Plugin
 *   Single plugin.
 *
 *   Plugins configure the processors they are applied on in the following
 *   ways:
 *
 *   *   they change the processor, such as the parser, the compiler, or by
 *       configuring data
 *   *   they specify how to handle trees and files
 *
 *   In practice, they are functions that can receive options and configure the
 *   processor (`this`).
 *
 *   > **Note**: plugins are called when the processor is *frozen*, not when
 *   > they are applied.
 */

/**
 * Tuple of a plugin and its configuration.
 *
 * The first item is a plugin, the rest are its parameters.
 *
 * @template {Array<unknown>} [TupleParameters=[]]
 *   Arguments passed to the plugin (default: `[]`, the empty tuple).
 * @template {Node | string | undefined} [Input=undefined]
 *   Value that is expected as input (optional).
 *
 *   *   If the plugin returns a {@linkcode Transformer}, this
 *       should be the node it expects.
 *   *   If the plugin sets a {@linkcode Parser}, this should be
 *       `string`.
 *   *   If the plugin sets a {@linkcode Compiler}, this should be the
 *       node it expects.
 * @template [Output=undefined] (optional).
 *   Value that is yielded as output.
 *
 *   *   If the plugin returns a {@linkcode Transformer}, this
 *       should be the node that that yields.
 *   *   If the plugin sets a {@linkcode Parser}, this should be the
 *       node that it yields.
 *   *   If the plugin sets a {@linkcode Compiler}, this should be
 *       result it yields.
 * @typedef {(
 *   [
 *     plugin: Plugin<TupleParameters, Input, Output>,
 *     ...parameters: TupleParameters
 *   ]
 * )} PluginTuple
 */

/**
 * @typedef Preset
 *   Sharable configuration.
 *
 *   They can contain plugins and settings.
 * @property {PluggableList | undefined} [plugins]
 *   List of plugins and presets (optional).
 * @property {Settings | undefined} [settings]
 *   Shared settings for parsers and compilers (optional).
 */

/**
 * @template {VFile} [File=VFile]
 *   The file that the callback receives (default: `VFile`).
 * @callback ProcessCallback
 *   Callback called when the process is done.
 *
 *   Called with either an error or a result.
 * @param {Error | undefined} [error]
 *   Fatal error (optional).
 * @param {File | undefined} [file]
 *   Processed file (optional).
 * @returns {undefined}
 *   Nothing.
 */

/**
 * @template {Node} [Tree=Node]
 *   The tree that the callback receives (default: `Node`).
 * @callback RunCallback
 *   Callback called when transformers are done.
 *
 *   Called with either an error or results.
 * @param {Error | undefined} [error]
 *   Fatal error (optional).
 * @param {Tree | undefined} [tree]
 *   Transformed tree (optional).
 * @param {VFile | undefined} [file]
 *   File (optional).
 * @returns {undefined}
 *   Nothing.
 */

/**
 * @template {Node} [Output=Node]
 *   Node type that the transformer yields (default: `Node`).
 * @callback TransformCallback
 *   Callback passed to transforms.
 *
 *   If the signature of a `transformer` accepts a third argument, the
 *   transformer may perform asynchronous operations, and must call it.
 * @param {Error | undefined} [error]
 *   Fatal error to stop the process (optional).
 * @param {Output | undefined} [tree]
 *   New, changed, tree (optional).
 * @param {VFile | undefined} [file]
 *   New, changed, file (optional).
 * @returns {undefined}
 *   Nothing.
 */

/**
 * @template {Node} [Input=Node]
 *   Node type that the transformer expects (default: `Node`).
 * @template {Node} [Output=Input]
 *   Node type that the transformer yields (default: `Input`).
 * @callback Transformer
 *   Transformers handle syntax trees and files.
 *
 *   They are functions that are called each time a syntax tree and file are
 *   passed through the run phase.
 *   When an error occurs in them (either because it’s thrown, returned,
 *   rejected, or passed to `next`), the process stops.
 *
 *   The run phase is handled by [`trough`][trough], see its documentation for
 *   the exact semantics of these functions.
 *
 *   > **Note**: you should likely ignore `next`: don’t accept it.
 *   > it supports callback-style async work.
 *   > But promises are likely easier to reason about.
 *
 *   [trough]: https://github.com/wooorm/trough#function-fninput-next
 * @param {Input} tree
 *   Tree to handle.
 * @param {VFile} file
 *   File to handle.
 * @param {TransformCallback<Output>} next
 *   Callback.
 * @returns {(
 *   Promise<Output | undefined | void> |
 *   Promise<never> | // For some reason this is needed separately.
 *   Output |
 *   Error |
 *   undefined |
 *   void
 * )}
 *   If you accept `next`, nothing.
 *   Otherwise:
 *
 *   *   `Error` — fatal error to stop the process
 *   *   `Promise<undefined>` or `undefined` — the next transformer keeps using
 *       same tree
 *   *   `Promise<Node>` or `Node` — new, changed, tree
 */

/**
 * @template {Node | undefined} ParseTree
 *   Output of `parse`.
 * @template {Node | undefined} HeadTree
 *   Input for `run`.
 * @template {Node | undefined} TailTree
 *   Output for `run`.
 * @template {Node | undefined} CompileTree
 *   Input of `stringify`.
 * @template {CompileResults | undefined} CompileResult
 *   Output of `stringify`.
 * @template {Node | string | undefined} Input
 *   Input of plugin.
 * @template Output
 *   Output of plugin (optional).
 * @typedef {(
 *   Input extends string
 *     ? Output extends Node | undefined
 *       ? // Parser.
 *         Processor<
 *           Output extends undefined ? ParseTree : Output,
 *           HeadTree,
 *           TailTree,
 *           CompileTree,
 *           CompileResult
 *         >
 *       : // Unknown.
 *         Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>
 *     : Output extends CompileResults
 *     ? Input extends Node | undefined
 *       ? // Compiler.
 *         Processor<
 *           ParseTree,
 *           HeadTree,
 *           TailTree,
 *           Input extends undefined ? CompileTree : Input,
 *           Output extends undefined ? CompileResult : Output
 *         >
 *       : // Unknown.
 *         Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>
 *     : Input extends Node | undefined
 *     ? Output extends Node | undefined
 *       ? // Transform.
 *         Processor<
 *           ParseTree,
 *           HeadTree extends undefined ? Input : HeadTree,
 *           Output extends undefined ? TailTree : Output,
 *           CompileTree,
 *           CompileResult
 *         >
 *       : // Unknown.
 *         Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>
 *     : // Unknown.
 *       Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>
 * )} UsePlugin
 *   Create a processor based on the input/output of a {@link Plugin plugin}.
 */

/**
 * @template {CompileResults | undefined} Result
 *   Node type that the transformer yields.
 * @typedef {(
 *   Result extends Value | undefined ?
 *     VFile :
 *     VFile & {result: Result}
 *   )} VFileWithOutput
 *   Type to generate a {@linkcode VFile} corresponding to a compiler result.
 *
 *   If a result that is not acceptable on a `VFile` is used, that will
 *   be stored on the `result` field of {@linkcode VFile}.
 */









// To do: next major: drop `Compiler`, `Parser`: prefer lowercase.

// To do: we could start yielding `never` in TS when a parser is missing and
// `parse` is called.
// Currently, we allow directly setting `processor.parser`, which is untyped.

const unified_lib_own = {}.hasOwnProperty

/**
 * @template {Node | undefined} [ParseTree=undefined]
 *   Output of `parse` (optional).
 * @template {Node | undefined} [HeadTree=undefined]
 *   Input for `run` (optional).
 * @template {Node | undefined} [TailTree=undefined]
 *   Output for `run` (optional).
 * @template {Node | undefined} [CompileTree=undefined]
 *   Input of `stringify` (optional).
 * @template {CompileResults | undefined} [CompileResult=undefined]
 *   Output of `stringify` (optional).
 * @extends {CallableInstance<[], Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>>}
 */
class Processor extends CallableInstance {
  /**
   * Create a processor.
   */
  constructor() {
    // If `Processor()` is called (w/o new), `copy` is called instead.
    super('copy')

    /**
     * Compiler to use (deprecated).
     *
     * @deprecated
     *   Use `compiler` instead.
     * @type {(
     *   Compiler<
     *     CompileTree extends undefined ? Node : CompileTree,
     *     CompileResult extends undefined ? CompileResults : CompileResult
     *   > |
     *   undefined
     * )}
     */
    this.Compiler = undefined

    /**
     * Parser to use (deprecated).
     *
     * @deprecated
     *   Use `parser` instead.
     * @type {(
     *   Parser<ParseTree extends undefined ? Node : ParseTree> |
     *   undefined
     * )}
     */
    this.Parser = undefined

    // Note: the following fields are considered private.
    // However, they are needed for tests, and TSC generates an untyped
    // `private freezeIndex` field for, which trips `type-coverage` up.
    // Instead, we use `@deprecated` to visualize that they shouldn’t be used.
    /**
     * Internal list of configured plugins.
     *
     * @deprecated
     *   This is a private internal property and should not be used.
     * @type {Array<PluginTuple<Array<unknown>>>}
     */
    this.attachers = []

    /**
     * Compiler to use.
     *
     * @type {(
     *   Compiler<
     *     CompileTree extends undefined ? Node : CompileTree,
     *     CompileResult extends undefined ? CompileResults : CompileResult
     *   > |
     *   undefined
     * )}
     */
    this.compiler = undefined

    /**
     * Internal state to track where we are while freezing.
     *
     * @deprecated
     *   This is a private internal property and should not be used.
     * @type {number}
     */
    this.freezeIndex = -1

    /**
     * Internal state to track whether we’re frozen.
     *
     * @deprecated
     *   This is a private internal property and should not be used.
     * @type {boolean | undefined}
     */
    this.frozen = undefined

    /**
     * Internal state.
     *
     * @deprecated
     *   This is a private internal property and should not be used.
     * @type {Data}
     */
    this.namespace = {}

    /**
     * Parser to use.
     *
     * @type {(
     *   Parser<ParseTree extends undefined ? Node : ParseTree> |
     *   undefined
     * )}
     */
    this.parser = undefined

    /**
     * Internal list of configured transformers.
     *
     * @deprecated
     *   This is a private internal property and should not be used.
     * @type {Pipeline}
     */
    this.transformers = trough()
  }

  /**
   * Copy a processor.
   *
   * @deprecated
   *   This is a private internal method and should not be used.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   New *unfrozen* processor ({@linkcode Processor}) that is
   *   configured to work the same as its ancestor.
   *   When the descendant processor is configured in the future it does not
   *   affect the ancestral processor.
   */
  copy() {
    // Cast as the type parameters will be the same after attaching.
    const destination =
      /** @type {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>} */ (
        new Processor()
      )
    let index = -1

    while (++index < this.attachers.length) {
      const attacher = this.attachers[index]
      destination.use(...attacher)
    }

    destination.data(extend(true, {}, this.namespace))

    return destination
  }

  /**
   * Configure the processor with info available to all plugins.
   * Information is stored in an object.
   *
   * Typically, options can be given to a specific plugin, but sometimes it
   * makes sense to have information shared with several plugins.
   * For example, a list of HTML elements that are self-closing, which is
   * needed during all phases.
   *
   * > **Note**: setting information cannot occur on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * > **Note**: to register custom data in TypeScript, augment the
   * > {@linkcode Data} interface.
   *
   * @example
   *   This example show how to get and set info:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   const processor = unified().data('alpha', 'bravo')
   *
   *   processor.data('alpha') // => 'bravo'
   *
   *   processor.data() // => {alpha: 'bravo'}
   *
   *   processor.data({charlie: 'delta'})
   *
   *   processor.data() // => {charlie: 'delta'}
   *   ```
   *
   * @template {keyof Data} Key
   *
   * @overload
   * @returns {Data}
   *
   * @overload
   * @param {Data} dataset
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Key} key
   * @returns {Data[Key]}
   *
   * @overload
   * @param {Key} key
   * @param {Data[Key]} value
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @param {Data | Key} [key]
   *   Key to get or set, or entire dataset to set, or nothing to get the
   *   entire dataset (optional).
   * @param {Data[Key]} [value]
   *   Value to set (optional).
   * @returns {unknown}
   *   The current processor when setting, the value at `key` when getting, or
   *   the entire dataset when getting without key.
   */
  data(key, value) {
    if (typeof key === 'string') {
      // Set `key`.
      if (arguments.length === 2) {
        assertUnfrozen('data', this.frozen)
        this.namespace[key] = value
        return this
      }

      // Get `key`.
      return (unified_lib_own.call(this.namespace, key) && this.namespace[key]) || undefined
    }

    // Set space.
    if (key) {
      assertUnfrozen('data', this.frozen)
      this.namespace = key
      return this
    }

    // Get space.
    return this.namespace
  }

  /**
   * Freeze a processor.
   *
   * Frozen processors are meant to be extended and not to be configured
   * directly.
   *
   * When a processor is frozen it cannot be unfrozen.
   * New processors working the same way can be created by calling the
   * processor.
   *
   * It’s possible to freeze processors explicitly by calling `.freeze()`.
   * Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
   * `.stringify()`, `.process()`, or `.processSync()` are called.
   *
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   The current processor.
   */
  freeze() {
    if (this.frozen) {
      return this
    }

    // Cast so that we can type plugins easier.
    // Plugins are supposed to be usable on different processors, not just on
    // this exact processor.
    const self = /** @type {Processor} */ (/** @type {unknown} */ (this))

    while (++this.freezeIndex < this.attachers.length) {
      const [attacher, ...options] = this.attachers[this.freezeIndex]

      if (options[0] === false) {
        continue
      }

      if (options[0] === true) {
        options[0] = undefined
      }

      const transformer = attacher.call(self, ...options)

      if (typeof transformer === 'function') {
        this.transformers.use(transformer)
      }
    }

    this.frozen = true
    this.freezeIndex = Number.POSITIVE_INFINITY

    return this
  }

  /**
   * Parse text to a syntax tree.
   *
   * > **Note**: `parse` freezes the processor if not already *frozen*.
   *
   * > **Note**: `parse` performs the parse phase, not the run phase or other
   * > phases.
   *
   * @param {Compatible | undefined} [file]
   *   file to parse (optional); typically `string` or `VFile`; any value
   *   accepted as `x` in `new VFile(x)`.
   * @returns {ParseTree extends undefined ? Node : ParseTree}
   *   Syntax tree representing `file`.
   */
  parse(file) {
    this.freeze()
    const realFile = vfile(file)
    const parser = this.parser || this.Parser
    assertParser('parse', parser)
    return parser(String(realFile), realFile)
  }

  /**
   * Process the given file as configured on the processor.
   *
   * > **Note**: `process` freezes the processor if not already *frozen*.
   *
   * > **Note**: `process` performs the parse, run, and stringify phases.
   *
   * @overload
   * @param {Compatible | undefined} file
   * @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
   * @returns {undefined}
   *
   * @overload
   * @param {Compatible | undefined} [file]
   * @returns {Promise<VFileWithOutput<CompileResult>>}
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`]; any value accepted as
   *   `x` in `new VFile(x)`.
   * @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
   *   Callback (optional).
   * @returns {Promise<VFile> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise a promise, rejected with a fatal error or resolved with the
   *   processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  process(file, done) {
    const self = this

    this.freeze()
    assertParser('process', this.parser || this.Parser)
    assertCompiler('process', this.compiler || this.Compiler)

    return done ? executor(undefined, done) : new Promise(executor)

    // Note: `void`s needed for TS.
    /**
     * @param {((file: VFileWithOutput<CompileResult>) => undefined | void) | undefined} resolve
     * @param {(error: Error | undefined) => undefined | void} reject
     * @returns {undefined}
     */
    function executor(resolve, reject) {
      const realFile = vfile(file)
      // Assume `ParseTree` (the result of the parser) matches `HeadTree` (the
      // input of the first transform).
      const parseTree =
        /** @type {HeadTree extends undefined ? Node : HeadTree} */ (
          /** @type {unknown} */ (self.parse(realFile))
        )

      self.run(parseTree, realFile, function (error, tree, file) {
        if (error || !tree || !file) {
          return realDone(error)
        }

        // Assume `TailTree` (the output of the last transform) matches
        // `CompileTree` (the input of the compiler).
        const compileTree =
          /** @type {CompileTree extends undefined ? Node : CompileTree} */ (
            /** @type {unknown} */ (tree)
          )

        const compileResult = self.stringify(compileTree, file)

        if (looksLikeAValue(compileResult)) {
          file.value = compileResult
        } else {
          file.result = compileResult
        }

        realDone(error, /** @type {VFileWithOutput<CompileResult>} */ (file))
      })

      /**
       * @param {Error | undefined} error
       * @param {VFileWithOutput<CompileResult> | undefined} [file]
       * @returns {undefined}
       */
      function realDone(error, file) {
        if (error || !file) {
          reject(error)
        } else if (resolve) {
          resolve(file)
        } else {
          ok(done, '`done` is defined if `resolve` is not')
          done(undefined, file)
        }
      }
    }
  }

  /**
   * Process the given file as configured on the processor.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `processSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `processSync` performs the parse, run, and stringify phases.
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`; any value accepted as
   *   `x` in `new VFile(x)`.
   * @returns {VFileWithOutput<CompileResult>}
   *   The processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  processSync(file) {
    /** @type {boolean} */
    let complete = false
    /** @type {VFileWithOutput<CompileResult> | undefined} */
    let result

    this.freeze()
    assertParser('processSync', this.parser || this.Parser)
    assertCompiler('processSync', this.compiler || this.Compiler)

    this.process(file, realDone)
    assertDone('processSync', 'process', complete)
    ok(result, 'we either bailed on an error or have a tree')

    return result

    /**
     * @type {ProcessCallback<VFileWithOutput<CompileResult>>}
     */
    function realDone(error, file) {
      complete = true
      bail(error)
      result = file
    }
  }

  /**
   * Run *transformers* on a syntax tree.
   *
   * > **Note**: `run` freezes the processor if not already *frozen*.
   *
   * > **Note**: `run` performs the run phase, not other phases.
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} file
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} [file]
   * @returns {Promise<TailTree extends undefined ? Node : TailTree>}
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {(
   *   RunCallback<TailTree extends undefined ? Node : TailTree> |
   *   Compatible
   * )} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
   *   Callback (optional).
   * @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise, a promise rejected with a fatal error or resolved with the
   *   transformed tree.
   */
  run(tree, file, done) {
    assertNode(tree)
    this.freeze()

    const transformers = this.transformers

    if (!done && typeof file === 'function') {
      done = file
      file = undefined
    }

    return done ? executor(undefined, done) : new Promise(executor)

    // Note: `void`s needed for TS.
    /**
     * @param {(
     *   ((tree: TailTree extends undefined ? Node : TailTree) => undefined | void) |
     *   undefined
     * )} resolve
     * @param {(error: Error) => undefined | void} reject
     * @returns {undefined}
     */
    function executor(resolve, reject) {
      ok(
        typeof file !== 'function',
        '`file` can’t be a `done` anymore, we checked'
      )
      const realFile = vfile(file)
      transformers.run(tree, realFile, realDone)

      /**
       * @param {Error | undefined} error
       * @param {Node} outputTree
       * @param {VFile} file
       * @returns {undefined}
       */
      function realDone(error, outputTree, file) {
        const resultingTree =
          /** @type {TailTree extends undefined ? Node : TailTree} */ (
            outputTree || tree
          )

        if (error) {
          reject(error)
        } else if (resolve) {
          resolve(resultingTree)
        } else {
          ok(done, '`done` is defined if `resolve` is not')
          done(undefined, resultingTree, file)
        }
      }
    }
  }

  /**
   * Run *transformers* on a syntax tree.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `runSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `runSync` performs the run phase, not other phases.
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {TailTree extends undefined ? Node : TailTree}
   *   Transformed tree.
   */
  runSync(tree, file) {
    /** @type {boolean} */
    let complete = false
    /** @type {(TailTree extends undefined ? Node : TailTree) | undefined} */
    let result

    this.run(tree, file, realDone)

    assertDone('runSync', 'run', complete)
    ok(result, 'we either bailed on an error or have a tree')
    return result

    /**
     * @type {RunCallback<TailTree extends undefined ? Node : TailTree>}
     */
    function realDone(error, tree) {
      bail(error)
      result = tree
      complete = true
    }
  }

  /**
   * Compile a syntax tree.
   *
   * > **Note**: `stringify` freezes the processor if not already *frozen*.
   *
   * > **Note**: `stringify` performs the stringify phase, not the run phase
   * > or other phases.
   *
   * @param {CompileTree extends undefined ? Node : CompileTree} tree
   *   Tree to compile.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {CompileResult extends undefined ? Value : CompileResult}
   *   Textual representation of the tree (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most compilers
   *   > return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  stringify(tree, file) {
    this.freeze()
    const realFile = vfile(file)
    const compiler = this.compiler || this.Compiler
    assertCompiler('stringify', compiler)
    assertNode(tree)

    return compiler(tree, realFile)
  }

  /**
   * Configure the processor to use a plugin, a list of usable values, or a
   * preset.
   *
   * If the processor is already using a plugin, the previous plugin
   * configuration is changed based on the options that are passed in.
   * In other words, the plugin is not added a second time.
   *
   * > **Note**: `use` cannot be called on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * @example
   *   There are many ways to pass plugins to `.use()`.
   *   This example gives an overview:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   unified()
   *     // Plugin with options:
   *     .use(pluginA, {x: true, y: true})
   *     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
   *     .use(pluginA, {y: false, z: true})
   *     // Plugins:
   *     .use([pluginB, pluginC])
   *     // Two plugins, the second with options:
   *     .use([pluginD, [pluginE, {}]])
   *     // Preset with plugins and settings:
   *     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
   *     // Settings only:
   *     .use({settings: {position: false}})
   *   ```
   *
   * @template {Array<unknown>} [Parameters=[]]
   * @template {Node | string | undefined} [Input=undefined]
   * @template [Output=Input]
   *
   * @overload
   * @param {Preset | null | undefined} [preset]
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {PluggableList} list
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Plugin<Parameters, Input, Output>} plugin
   * @param {...(Parameters | [boolean])} parameters
   * @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
   *
   * @param {PluggableList | Plugin | Preset | null | undefined} value
   *   Usable value.
   * @param {...unknown} parameters
   *   Parameters, when a plugin is given as a usable value.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   Current processor.
   */
  use(value, ...parameters) {
    const attachers = this.attachers
    const namespace = this.namespace

    assertUnfrozen('use', this.frozen)

    if (value === null || value === undefined) {
      // Empty.
    } else if (typeof value === 'function') {
      addPlugin(value, parameters)
    } else if (typeof value === 'object') {
      if (Array.isArray(value)) {
        addList(value)
      } else {
        addPreset(value)
      }
    } else {
      throw new TypeError('Expected usable value, not `' + value + '`')
    }

    return this

    /**
     * @param {Pluggable} value
     * @returns {undefined}
     */
    function add(value) {
      if (typeof value === 'function') {
        addPlugin(value, [])
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          const [plugin, ...parameters] =
            /** @type {PluginTuple<Array<unknown>>} */ (value)
          addPlugin(plugin, parameters)
        } else {
          addPreset(value)
        }
      } else {
        throw new TypeError('Expected usable value, not `' + value + '`')
      }
    }

    /**
     * @param {Preset} result
     * @returns {undefined}
     */
    function addPreset(result) {
      if (!('plugins' in result) && !('settings' in result)) {
        throw new Error(
          'Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither'
        )
      }

      addList(result.plugins)

      if (result.settings) {
        namespace.settings = extend(true, namespace.settings, result.settings)
      }
    }

    /**
     * @param {PluggableList | null | undefined} plugins
     * @returns {undefined}
     */
    function addList(plugins) {
      let index = -1

      if (plugins === null || plugins === undefined) {
        // Empty.
      } else if (Array.isArray(plugins)) {
        while (++index < plugins.length) {
          const thing = plugins[index]
          add(thing)
        }
      } else {
        throw new TypeError('Expected a list of plugins, not `' + plugins + '`')
      }
    }

    /**
     * @param {Plugin} plugin
     * @param {Array<unknown>} parameters
     * @returns {undefined}
     */
    function addPlugin(plugin, parameters) {
      let index = -1
      let entryIndex = -1

      while (++index < attachers.length) {
        if (attachers[index][0] === plugin) {
          entryIndex = index
          break
        }
      }

      if (entryIndex === -1) {
        attachers.push([plugin, ...parameters])
      }
      // Only set if there was at least a `primary` value, otherwise we’d change
      // `arguments.length`.
      else if (parameters.length > 0) {
        let [primary, ...rest] = parameters
        const currentPrimary = attachers[entryIndex][1]
        if (isPlainObject(currentPrimary) && isPlainObject(primary)) {
          primary = extend(true, currentPrimary, primary)
        }

        attachers[entryIndex] = [plugin, primary, ...rest]
      }
    }
  }
}

// Note: this returns a *callable* instance.
// That’s why it’s documented as a function.
/**
 * Create a new processor.
 *
 * @example
 *   This example shows how a new processor can be created (from `remark`) and linked
 *   to **stdin**(4) and **stdout**(4).
 *
 *   ```js
 *   import process from 'node:process'
 *   import concatStream from 'concat-stream'
 *   import {remark} from 'remark'
 *
 *   process.stdin.pipe(
 *     concatStream(function (buf) {
 *       process.stdout.write(String(remark().processSync(buf)))
 *     })
 *   )
 *   ```
 *
 * @returns
 *   New *unfrozen* processor (`processor`).
 *
 *   This processor is configured to work the same as its ancestor.
 *   When the descendant processor is configured in the future it does not
 *   affect the ancestral processor.
 */
const unified = new Processor().freeze()

/**
 * Assert a parser is available.
 *
 * @param {string} name
 * @param {unknown} value
 * @returns {asserts value is Parser}
 */
function assertParser(name, value) {
  if (typeof value !== 'function') {
    throw new TypeError('Cannot `' + name + '` without `parser`')
  }
}

/**
 * Assert a compiler is available.
 *
 * @param {string} name
 * @param {unknown} value
 * @returns {asserts value is Compiler}
 */
function assertCompiler(name, value) {
  if (typeof value !== 'function') {
    throw new TypeError('Cannot `' + name + '` without `compiler`')
  }
}

/**
 * Assert the processor is not frozen.
 *
 * @param {string} name
 * @param {unknown} frozen
 * @returns {asserts frozen is false}
 */
function assertUnfrozen(name, frozen) {
  if (frozen) {
    throw new Error(
      'Cannot call `' +
        name +
        '` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.'
    )
  }
}

/**
 * Assert `node` is a unist node.
 *
 * @param {unknown} node
 * @returns {asserts node is Node}
 */
function assertNode(node) {
  // `isPlainObj` unfortunately uses `any` instead of `unknown`.
  // type-coverage:ignore-next-line
  if (!isPlainObject(node) || typeof node.type !== 'string') {
    throw new TypeError('Expected node, got `' + node + '`')
    // Fine.
  }
}

/**
 * Assert that `complete` is `true`.
 *
 * @param {string} name
 * @param {string} asyncName
 * @param {unknown} complete
 * @returns {asserts complete is true}
 */
function assertDone(name, asyncName, complete) {
  if (!complete) {
    throw new Error(
      '`' + name + '` finished async. Use `' + asyncName + '` instead'
    )
  }
}

/**
 * @param {Compatible | undefined} [value]
 * @returns {VFile}
 */
function vfile(value) {
  return looksLikeAVFile(value) ? value : new VFile(value)
}

/**
 * @param {Compatible | undefined} [value]
 * @returns {value is VFile}
 */
function looksLikeAVFile(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'message' in value &&
      'messages' in value
  )
}

/**
 * @param {unknown} [value]
 * @returns {value is Value}
 */
function looksLikeAValue(value) {
  return typeof value === 'string' || lib_isUint8Array(value)
}

/**
 * Assert `value` is an `Uint8Array`.
 *
 * @param {unknown} value
 *   thing.
 * @returns {value is Uint8Array}
 *   Whether `value` is an `Uint8Array`.
 */
function lib_isUint8Array(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'byteLength' in value &&
      'byteOffset' in value
  )
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/react-markdown@10.1.0_@types+react@18.0.0_react@18.0.0/node_modules/react-markdown/lib/index.js
/**
 * @import {Element, Nodes, Parents, Root} from 'hast'
 * @import {Root as MdastRoot} from 'mdast'
 * @import {ComponentType, JSX, ReactElement, ReactNode} from 'react'
 * @import {Options as RemarkRehypeOptions} from 'remark-rehype'
 * @import {BuildVisitor} from 'unist-util-visit'
 * @import {PluggableList, Processor} from 'unified'
 */

/**
 * @callback AllowElement
 *   Filter elements.
 * @param {Readonly<Element>} element
 *   Element to check.
 * @param {number} index
 *   Index of `element` in `parent`.
 * @param {Readonly<Parents> | undefined} parent
 *   Parent of `element`.
 * @returns {boolean | null | undefined}
 *   Whether to allow `element` (default: `false`).
 */

/**
 * @typedef ExtraProps
 *   Extra fields we pass.
 * @property {Element | undefined} [node]
 *   passed when `passNode` is on.
 */

/**
 * @typedef {{
 *   [Key in keyof JSX.IntrinsicElements]?: ComponentType<JSX.IntrinsicElements[Key] & ExtraProps> | keyof JSX.IntrinsicElements
 * }} Components
 *   Map tag names to components.
 */

/**
 * @typedef Deprecation
 *   Deprecation.
 * @property {string} from
 *   Old field.
 * @property {string} id
 *   ID in readme.
 * @property {keyof Options} [to]
 *   New field.
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {AllowElement | null | undefined} [allowElement]
 *   Filter elements (optional);
 *   `allowedElements` / `disallowedElements` is used first.
 * @property {ReadonlyArray<string> | null | undefined} [allowedElements]
 *   Tag names to allow (default: all tag names);
 *   cannot combine w/ `disallowedElements`.
 * @property {string | null | undefined} [children]
 *   Markdown.
 * @property {Components | null | undefined} [components]
 *   Map tag names to components.
 * @property {ReadonlyArray<string> | null | undefined} [disallowedElements]
 *   Tag names to disallow (default: `[]`);
 *   cannot combine w/ `allowedElements`.
 * @property {PluggableList | null | undefined} [rehypePlugins]
 *   List of rehype plugins to use.
 * @property {PluggableList | null | undefined} [remarkPlugins]
 *   List of remark plugins to use.
 * @property {Readonly<RemarkRehypeOptions> | null | undefined} [remarkRehypeOptions]
 *   Options to pass through to `remark-rehype`.
 * @property {boolean | null | undefined} [skipHtml=false]
 *   Ignore HTML in markdown completely (default: `false`).
 * @property {boolean | null | undefined} [unwrapDisallowed=false]
 *   Extract (unwrap) what’s in disallowed elements (default: `false`);
 *   normally when say `strong` is not allowed, it and it’s children are dropped,
 *   with `unwrapDisallowed` the element itself is replaced by its children.
 * @property {UrlTransform | null | undefined} [urlTransform]
 *   Change URLs (default: `defaultUrlTransform`)
 */

/**
 * @typedef HooksOptionsOnly
 *   Configuration specifically for {@linkcode MarkdownHooks}.
 * @property {ReactNode | null | undefined} [fallback]
 *   Content to render while the processor processing the markdown (optional).
 */

/**
 * @typedef {Options & HooksOptionsOnly} HooksOptions
 *   Configuration for {@linkcode MarkdownHooks};
 *   extends the regular {@linkcode Options} with a `fallback` prop.
 */

/**
 * @callback UrlTransform
 *   Transform all URLs.
 * @param {string} url
 *   URL.
 * @param {string} key
 *   Property name (example: `'href'`).
 * @param {Readonly<Element>} node
 *   Node.
 * @returns {string | null | undefined}
 *   Transformed URL (optional).
 */












const changelog =
  'https://github.com/remarkjs/react-markdown/blob/main/changelog.md'

/** @type {PluggableList} */
const emptyPlugins = []
/** @type {Readonly<RemarkRehypeOptions>} */
const emptyRemarkRehypeOptions = {allowDangerousHtml: true}
const safeProtocol = /^(https?|ircs?|mailto|xmpp)$/i

// Mutable because we `delete` any time it’s used and a message is sent.
/** @type {ReadonlyArray<Readonly<Deprecation>>} */
const deprecations = [
  {from: 'astPlugins', id: 'remove-buggy-html-in-markdown-parser'},
  {from: 'allowDangerousHtml', id: 'remove-buggy-html-in-markdown-parser'},
  {
    from: 'allowNode',
    id: 'replace-allownode-allowedtypes-and-disallowedtypes',
    to: 'allowElement'
  },
  {
    from: 'allowedTypes',
    id: 'replace-allownode-allowedtypes-and-disallowedtypes',
    to: 'allowedElements'
  },
  {from: 'className', id: 'remove-classname'},
  {
    from: 'disallowedTypes',
    id: 'replace-allownode-allowedtypes-and-disallowedtypes',
    to: 'disallowedElements'
  },
  {from: 'escapeHtml', id: 'remove-buggy-html-in-markdown-parser'},
  {from: 'includeElementIndex', id: '#remove-includeelementindex'},
  {
    from: 'includeNodeIndex',
    id: 'change-includenodeindex-to-includeelementindex'
  },
  {from: 'linkTarget', id: 'remove-linktarget'},
  {from: 'plugins', id: 'change-plugins-to-remarkplugins', to: 'remarkPlugins'},
  {from: 'rawSourcePos', id: '#remove-rawsourcepos'},
  {from: 'renderers', id: 'change-renderers-to-components', to: 'components'},
  {from: 'source', id: 'change-source-to-children', to: 'children'},
  {from: 'sourcePos', id: '#remove-sourcepos'},
  {from: 'transformImageUri', id: '#add-urltransform', to: 'urlTransform'},
  {from: 'transformLinkUri', id: '#add-urltransform', to: 'urlTransform'}
]

/**
 * Component to render markdown.
 *
 * This is a synchronous component.
 * When using async plugins,
 * see {@linkcode MarkdownAsync} or {@linkcode MarkdownHooks}.
 *
 * @param {Readonly<Options>} options
 *   Props.
 * @returns {ReactElement}
 *   React element.
 */
function Markdown(options) {
  const processor = createProcessor(options)
  const file = createFile(options)
  return post(processor.runSync(processor.parse(file), file), options)
}

/**
 * Component to render markdown with support for async plugins
 * through async/await.
 *
 * Components returning promises are supported on the server.
 * For async support on the client,
 * see {@linkcode MarkdownHooks}.
 *
 * @param {Readonly<Options>} options
 *   Props.
 * @returns {Promise<ReactElement>}
 *   Promise to a React element.
 */
async function MarkdownAsync(options) {
  const processor = createProcessor(options)
  const file = createFile(options)
  const tree = await processor.run(processor.parse(file), file)
  return post(tree, options)
}

/**
 * Component to render markdown with support for async plugins through hooks.
 *
 * This uses `useEffect` and `useState` hooks.
 * Hooks run on the client and do not immediately render something.
 * For async support on the server,
 * see {@linkcode MarkdownAsync}.
 *
 * @param {Readonly<HooksOptions>} options
 *   Props.
 * @returns {ReactNode}
 *   React node.
 */
function MarkdownHooks(options) {
  const processor = createProcessor(options)
  const [error, setError] = useState(
    /** @type {Error | undefined} */ (undefined)
  )
  const [tree, setTree] = useState(/** @type {Root | undefined} */ (undefined))

  useEffect(
    function () {
      let cancelled = false
      const file = createFile(options)

      processor.run(processor.parse(file), file, function (error, tree) {
        if (!cancelled) {
          setError(error)
          setTree(tree)
        }
      })

      /**
       * @returns {undefined}
       *   Nothing.
       */
      return function () {
        cancelled = true
      }
    },
    [
      options.children,
      options.rehypePlugins,
      options.remarkPlugins,
      options.remarkRehypeOptions
    ]
  )

  if (error) throw error

  return tree ? post(tree, options) : options.fallback
}

/**
 * Set up the `unified` processor.
 *
 * @param {Readonly<Options>} options
 *   Props.
 * @returns {Processor<MdastRoot, MdastRoot, Root, undefined, undefined>}
 *   Result.
 */
function createProcessor(options) {
  const rehypePlugins = options.rehypePlugins || emptyPlugins
  const remarkPlugins = options.remarkPlugins || emptyPlugins
  const remarkRehypeOptions = options.remarkRehypeOptions
    ? {...options.remarkRehypeOptions, ...emptyRemarkRehypeOptions}
    : emptyRemarkRehypeOptions

  const processor = unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype, remarkRehypeOptions)
    .use(rehypePlugins)

  return processor
}

/**
 * Set up the virtual file.
 *
 * @param {Readonly<Options>} options
 *   Props.
 * @returns {VFile}
 *   Result.
 */
function createFile(options) {
  const children = options.children || ''
  const file = new VFile()

  if (typeof children === 'string') {
    file.value = children
  } else {
    unreachable(
      'Unexpected value `' +
        children +
        '` for `children` prop, expected `string`'
    )
  }

  return file
}

/**
 * Process the result from unified some more.
 *
 * @param {Nodes} tree
 *   Tree.
 * @param {Readonly<Options>} options
 *   Props.
 * @returns {ReactElement}
 *   React element.
 */
function post(tree, options) {
  const allowedElements = options.allowedElements
  const allowElement = options.allowElement
  const components = options.components
  const disallowedElements = options.disallowedElements
  const skipHtml = options.skipHtml
  const unwrapDisallowed = options.unwrapDisallowed
  const urlTransform = options.urlTransform || defaultUrlTransform

  for (const deprecation of deprecations) {
    if (Object.hasOwn(options, deprecation.from)) {
      unreachable(
        'Unexpected `' +
          deprecation.from +
          '` prop, ' +
          (deprecation.to
            ? 'use `' + deprecation.to + '` instead'
            : 'remove it') +
          ' (see <' +
          changelog +
          '#' +
          deprecation.id +
          '> for more info)'
      )
    }
  }

  if (allowedElements && disallowedElements) {
    unreachable(
      'Unexpected combined `allowedElements` and `disallowedElements`, expected one or the other'
    )
  }

  visit(tree, transform)

  return toJsxRuntime(tree, {
    Fragment: jsx_runtime.Fragment,
    components,
    ignoreInvalidStyle: true,
    jsx: jsx_runtime.jsx,
    jsxs: jsx_runtime.jsxs,
    passKeys: true,
    passNode: true
  })

  /** @type {BuildVisitor<Root>} */
  function transform(node, index, parent) {
    if (node.type === 'raw' && parent && typeof index === 'number') {
      if (skipHtml) {
        parent.children.splice(index, 1)
      } else {
        parent.children[index] = {type: 'text', value: node.value}
      }

      return index
    }

    if (node.type === 'element') {
      /** @type {string} */
      let key

      for (key in urlAttributes) {
        if (
          Object.hasOwn(urlAttributes, key) &&
          Object.hasOwn(node.properties, key)
        ) {
          const value = node.properties[key]
          const test = urlAttributes[key]
          if (test === null || test.includes(node.tagName)) {
            node.properties[key] = urlTransform(String(value || ''), key, node)
          }
        }
      }
    }

    if (node.type === 'element') {
      let remove = allowedElements
        ? !allowedElements.includes(node.tagName)
        : disallowedElements
          ? disallowedElements.includes(node.tagName)
          : false

      if (!remove && allowElement && typeof index === 'number') {
        remove = !allowElement(node, index, parent)
      }

      if (remove && parent && typeof index === 'number') {
        if (unwrapDisallowed && node.children) {
          parent.children.splice(index, 1, ...node.children)
        } else {
          parent.children.splice(index, 1)
        }

        return index
      }
    }
  }
}

/**
 * Make a URL safe.
 *
 * @satisfies {UrlTransform}
 * @param {string} value
 *   URL.
 * @returns {string}
 *   Safe URL.
 */
function defaultUrlTransform(value) {
  // Same as:
  // <https://github.com/micromark/micromark/blob/929275e/packages/micromark-util-sanitize-uri/dev/index.js#L34>
  // But without the `encode` part.
  const colon = value.indexOf(':')
  const questionMark = value.indexOf('?')
  const numberSign = value.indexOf('#')
  const slash = value.indexOf('/')

  if (
    // If there is no protocol, it’s relative.
    colon === -1 ||
    // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    (slash !== -1 && colon > slash) ||
    (questionMark !== -1 && colon > questionMark) ||
    (numberSign !== -1 && colon > numberSign) ||
    // It is a protocol, it should be allowed.
    safeProtocol.test(value.slice(0, colon))
  ) {
    return value
  }

  return ''
}


/***/ }),

/***/ 4121:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ json; }
/* harmony export */ });
// @ts-nocheck
/**
 * @import {Refractor} from '../lib/core.js'
 */
json.displayName = 'json'
json.aliases = ['webmanifest']

/** @param {Refractor} Prism */
function json(Prism) {
  // https://www.json.org/json-en.html
  Prism.languages.json = {
    property: {
      pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
      lookbehind: true,
      greedy: true
    },
    string: {
      pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
      lookbehind: true,
      greedy: true
    },
    comment: {
      pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
      greedy: true
    },
    number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
    punctuation: /[{}[\],]/,
    operator: /:/,
    boolean: /\b(?:false|true)\b/,
    null: {
      pattern: /\bnull\b/,
      alias: 'keyword'
    }
  }
  Prism.languages.webmanifest = Prism.languages.json
}


/***/ }),

/***/ 6559:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ markdown; }
});

;// CONCATENATED MODULE: ../../node_modules/.pnpm/refractor@5.0.0/node_modules/refractor/lang/markup.js
// @ts-nocheck
/**
 * @import {Refractor} from '../lib/core.js'
 */
markup.displayName = 'markup'
markup.aliases = ['atom', 'html', 'mathml', 'rss', 'ssml', 'svg', 'xml']

/** @param {Refractor} Prism */
function markup(Prism) {
  Prism.languages.markup = {
    comment: {
      pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
      greedy: true
    },
    prolog: {
      pattern: /<\?[\s\S]+?\?>/,
      greedy: true
    },
    doctype: {
      // https://www.w3.org/TR/xml/#NT-doctypedecl
      pattern:
        /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
      greedy: true,
      inside: {
        'internal-subset': {
          pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
          lookbehind: true,
          greedy: true,
          inside: null // see below
        },
        string: {
          pattern: /"[^"]*"|'[^']*'/,
          greedy: true
        },
        punctuation: /^<!|>$|[[\]]/,
        'doctype-tag': /^DOCTYPE/i,
        name: /[^\s<>'"]+/
      }
    },
    cdata: {
      pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
      greedy: true
    },
    tag: {
      pattern:
        /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
      greedy: true,
      inside: {
        tag: {
          pattern: /^<\/?[^\s>\/]+/,
          inside: {
            punctuation: /^<\/?/,
            namespace: /^[^\s>\/:]+:/
          }
        },
        'special-attr': [],
        'attr-value': {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
          inside: {
            punctuation: [
              {
                pattern: /^=/,
                alias: 'attr-equals'
              },
              {
                pattern: /^(\s*)["']|["']$/,
                lookbehind: true
              }
            ]
          }
        },
        punctuation: /\/?>/,
        'attr-name': {
          pattern: /[^\s>\/]+/,
          inside: {
            namespace: /^[^\s>\/:]+:/
          }
        }
      }
    },
    entity: [
      {
        pattern: /&[\da-z]{1,8};/i,
        alias: 'named-entity'
      },
      /&#x?[\da-f]{1,8};/i
    ]
  }
  Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
    Prism.languages.markup['entity']
  Prism.languages.markup['doctype'].inside['internal-subset'].inside =
    Prism.languages.markup

  // Plugin to make entity title show the real entity, idea by Roman Komarov
  Prism.hooks.add('wrap', function (env) {
    if (env.type === 'entity') {
      env.attributes['title'] = env.content.value.replace(/&amp;/, '&')
    }
  })
  Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
    /**
     * Adds an inlined language to markup.
     *
     * An example of an inlined language is CSS with `<style>` tags.
     *
     * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addInlined('style', 'css');
     */
    value: function addInlined(tagName, lang) {
      var includedCdataInside = {}
      includedCdataInside['language-' + lang] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: true,
        inside: Prism.languages[lang]
      }
      includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i
      var inside = {
        'included-cdata': {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          inside: includedCdataInside
        }
      }
      inside['language-' + lang] = {
        pattern: /[\s\S]+/,
        inside: Prism.languages[lang]
      }
      var def = {}
      def[tagName] = {
        pattern: RegExp(
          /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
            /__/g,
            function () {
              return tagName
            }
          ),
          'i'
        ),
        lookbehind: true,
        greedy: true,
        inside: inside
      }
      Prism.languages.insertBefore('markup', 'cdata', def)
    }
  })
  Object.defineProperty(Prism.languages.markup.tag, 'addAttribute', {
    /**
     * Adds an pattern to highlight languages embedded in HTML attributes.
     *
     * An example of an inlined language is CSS with `style` attributes.
     *
     * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addAttribute('style', 'css');
     */
    value: function (attrName, lang) {
      Prism.languages.markup.tag.inside['special-attr'].push({
        pattern: RegExp(
          /(^|["'\s])/.source +
            '(?:' +
            attrName +
            ')' +
            /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
          'i'
        ),
        lookbehind: true,
        inside: {
          'attr-name': /^[^\s=]+/,
          'attr-value': {
            pattern: /=[\s\S]+/,
            inside: {
              value: {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: true,
                alias: [lang, 'language-' + lang],
                inside: Prism.languages[lang]
              },
              punctuation: [
                {
                  pattern: /^=/,
                  alias: 'attr-equals'
                },
                /"|'/
              ]
            }
          }
        }
      })
    }
  })
  Prism.languages.html = Prism.languages.markup
  Prism.languages.mathml = Prism.languages.markup
  Prism.languages.svg = Prism.languages.markup
  Prism.languages.xml = Prism.languages.extend('markup', {})
  Prism.languages.ssml = Prism.languages.xml
  Prism.languages.atom = Prism.languages.xml
  Prism.languages.rss = Prism.languages.xml
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/refractor@5.0.0/node_modules/refractor/lang/markdown.js
// @ts-nocheck
/**
 * @import {Refractor} from '../lib/core.js'
 */

markdown.displayName = 'markdown'
markdown.aliases = ['md']

/** @param {Refractor} Prism */
function markdown(Prism) {
  Prism.register(markup)
  ;(function (Prism) {
    // Allow only one line break
    var inner = /(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?![\r\n]))/.source

    /**
     * This function is intended for the creation of the bold or italic pattern.
     *
     * This also adds a lookbehind group to the given pattern to ensure that the pattern is not backslash-escaped.
     *
     * _Note:_ Keep in mind that this adds a capturing group.
     *
     * @param {string} pattern
     * @returns {RegExp}
     */
    function createInline(pattern) {
      pattern = pattern.replace(/<inner>/g, function () {
        return inner
      })
      return RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + '(?:' + pattern + ')')
    }
    var tableCell = /(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/
      .source
    var tableRow =
      /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|(?![\s\S]))/.source.replace(
        /__/g,
        function () {
          return tableCell
        }
      )
    var tableLine =
      /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/
        .source
    Prism.languages.markdown = Prism.languages.extend('markup', {})
    Prism.languages.insertBefore('markdown', 'prolog', {
      'front-matter-block': {
        pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
        lookbehind: true,
        greedy: true,
        inside: {
          punctuation: /^---|---$/,
          'front-matter': {
            pattern: /\S+(?:\s+\S+)*/,
            alias: ['yaml', 'language-yaml'],
            inside: Prism.languages.yaml
          }
        }
      },
      blockquote: {
        // > ...
        pattern: /^>(?:[\t ]*>)*/m,
        alias: 'punctuation'
      },
      table: {
        pattern: RegExp(
          '^' + tableRow + tableLine + '(?:' + tableRow + ')*',
          'm'
        ),
        inside: {
          'table-data-rows': {
            pattern: RegExp(
              '^(' + tableRow + tableLine + ')(?:' + tableRow + ')*$'
            ),
            lookbehind: true,
            inside: {
              'table-data': {
                pattern: RegExp(tableCell),
                inside: Prism.languages.markdown
              },
              punctuation: /\|/
            }
          },
          'table-line': {
            pattern: RegExp('^(' + tableRow + ')' + tableLine + '$'),
            lookbehind: true,
            inside: {
              punctuation: /\||:?-{3,}:?/
            }
          },
          'table-header-row': {
            pattern: RegExp('^' + tableRow + '$'),
            inside: {
              'table-header': {
                pattern: RegExp(tableCell),
                alias: 'important',
                inside: Prism.languages.markdown
              },
              punctuation: /\|/
            }
          }
        }
      },
      code: [
        {
          // Prefixed by 4 spaces or 1 tab and preceded by an empty line
          pattern:
            /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
          lookbehind: true,
          alias: 'keyword'
        },
        {
          // ```optional language
          // code block
          // ```
          pattern: /^```[\s\S]*?^```$/m,
          greedy: true,
          inside: {
            'code-block': {
              pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
              lookbehind: true
            },
            'code-language': {
              pattern: /^(```).+/,
              lookbehind: true
            },
            punctuation: /```/
          }
        }
      ],
      title: [
        {
          // title 1
          // =======

          // title 2
          // -------
          pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
          alias: 'important',
          inside: {
            punctuation: /==+$|--+$/
          }
        },
        {
          // # title 1
          // ###### title 6
          pattern: /(^\s*)#.+/m,
          lookbehind: true,
          alias: 'important',
          inside: {
            punctuation: /^#+|#+$/
          }
        }
      ],
      hr: {
        // ***
        // ---
        // * * *
        // -----------
        pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
        lookbehind: true,
        alias: 'punctuation'
      },
      list: {
        // * item
        // + item
        // - item
        // 1. item
        pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
        lookbehind: true,
        alias: 'punctuation'
      },
      'url-reference': {
        // [id]: http://example.com "Optional title"
        // [id]: http://example.com 'Optional title'
        // [id]: http://example.com (Optional title)
        // [id]: <http://example.com> "Optional title"
        pattern:
          /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
        inside: {
          variable: {
            pattern: /^(!?\[)[^\]]+/,
            lookbehind: true
          },
          string:
            /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
          punctuation: /^[\[\]!:]|[<>]/
        },
        alias: 'url'
      },
      bold: {
        // **strong**
        // __strong__

        // allow one nested instance of italic text using the same delimiter
        pattern: createInline(
          /\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\b|\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/
            .source
        ),
        lookbehind: true,
        greedy: true,
        inside: {
          content: {
            pattern: /(^..)[\s\S]+(?=..$)/,
            lookbehind: true,
            inside: {} // see below
          },
          punctuation: /\*\*|__/
        }
      },
      italic: {
        // *em*
        // _em_

        // allow one nested instance of bold text using the same delimiter
        pattern: createInline(
          /\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/
            .source
        ),
        lookbehind: true,
        greedy: true,
        inside: {
          content: {
            pattern: /(^.)[\s\S]+(?=.$)/,
            lookbehind: true,
            inside: {} // see below
          },
          punctuation: /[*_]/
        }
      },
      strike: {
        // ~~strike through~~
        // ~strike~
        // eslint-disable-next-line regexp/strict
        pattern: createInline(/(~~?)(?:(?!~)<inner>)+\2/.source),
        lookbehind: true,
        greedy: true,
        inside: {
          content: {
            pattern: /(^~~?)[\s\S]+(?=\1$)/,
            lookbehind: true,
            inside: {} // see below
          },
          punctuation: /~~?/
        }
      },
      'code-snippet': {
        // `code`
        // ``code``
        pattern:
          /(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,
        lookbehind: true,
        greedy: true,
        alias: ['code', 'keyword']
      },
      url: {
        // [example](http://example.com "Optional title")
        // [example][id]
        // [example] [id]
        pattern: createInline(
          /!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)|[ \t]?\[(?:(?!\])<inner>)+\])/
            .source
        ),
        lookbehind: true,
        greedy: true,
        inside: {
          operator: /^!/,
          content: {
            pattern: /(^\[)[^\]]+(?=\])/,
            lookbehind: true,
            inside: {} // see below
          },
          variable: {
            pattern: /(^\][ \t]?\[)[^\]]+(?=\]$)/,
            lookbehind: true
          },
          url: {
            pattern: /(^\]\()[^\s)]+/,
            lookbehind: true
          },
          string: {
            pattern: /(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,
            lookbehind: true
          }
        }
      }
    })
    ;['url', 'bold', 'italic', 'strike'].forEach(function (token) {
      ;['url', 'bold', 'italic', 'strike', 'code-snippet'].forEach(
        function (inside) {
          if (token !== inside) {
            Prism.languages.markdown[token].inside.content.inside[inside] =
              Prism.languages.markdown[inside]
          }
        }
      )
    })
    Prism.hooks.add('after-tokenize', function (env) {
      if (env.language !== 'markdown' && env.language !== 'md') {
        return
      }
      function walkTokens(tokens) {
        if (!tokens || typeof tokens === 'string') {
          return
        }
        for (var i = 0, l = tokens.length; i < l; i++) {
          var token = tokens[i]
          if (token.type !== 'code') {
            walkTokens(token.content)
            continue
          }

          /*
           * Add the correct `language-xxxx` class to this code block. Keep in mind that the `code-language` token
           * is optional. But the grammar is defined so that there is only one case we have to handle:
           *
           * token.content = [
           *     <span class="punctuation">```</span>,
           *     <span class="code-language">xxxx</span>,
           *     '\n', // exactly one new lines (\r or \n or \r\n)
           *     <span class="code-block">...</span>,
           *     '\n', // exactly one new lines again
           *     <span class="punctuation">```</span>
           * ];
           */

          var codeLang = token.content[1]
          var codeBlock = token.content[3]
          if (
            codeLang &&
            codeBlock &&
            codeLang.type === 'code-language' &&
            codeBlock.type === 'code-block' &&
            typeof codeLang.content === 'string'
          ) {
            // this might be a language that Prism does not support

            // do some replacements to support C++, C#, and F#
            var lang = codeLang.content
              .replace(/\b#/g, 'sharp')
              .replace(/\b\+\+/g, 'pp')
            // only use the first word
            lang = (/[a-z][\w-]*/i.exec(lang) || [''])[0].toLowerCase()
            var alias = 'language-' + lang

            // add alias
            if (!codeBlock.alias) {
              codeBlock.alias = [alias]
            } else if (typeof codeBlock.alias === 'string') {
              codeBlock.alias = [codeBlock.alias, alias]
            } else {
              codeBlock.alias.push(alias)
            }
          }
        }
      }
      walkTokens(env.tokens)
    })
    Prism.hooks.add('wrap', function (env) {
      if (env.type !== 'code-block') {
        return
      }
      var codeLang = ''
      for (var i = 0, l = env.classes.length; i < l; i++) {
        var cls = env.classes[i]
        var match = /language-(.+)/.exec(cls)
        if (match) {
          codeLang = match[1]
          break
        }
      }
      var grammar = Prism.languages[codeLang]
      if (!grammar) {
        if (codeLang && codeLang !== 'none' && Prism.plugins.autoloader) {
          var id =
            'md-' +
            new Date().valueOf() +
            '-' +
            Math.floor(Math.random() * 1e16)
          env.attributes['id'] = id
          Prism.plugins.autoloader.loadLanguages(codeLang, function () {
            var ele = document.getElementById(id)
            if (ele) {
              ele.innerHTML = Prism.highlight(
                ele.textContent,
                Prism.languages[codeLang],
                codeLang
              )
            }
          })
        }
      } else {
        env.content = Prism.highlight(env.content.value, grammar, codeLang)
      }
    })
    var tagPattern = RegExp(Prism.languages.markup.tag.pattern.source, 'gi')

    /**
     * A list of known entity names.
     *
     * This will always be incomplete to save space. The current list is the one used by lowdash's unescape function.
     *
     * @see {@link https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/unescape.js#L2}
     */
    var KNOWN_ENTITY_NAMES = {
      amp: '&',
      lt: '<',
      gt: '>',
      quot: '"'
    }

    // IE 11 doesn't support `String.fromCodePoint`
    var fromCodePoint = String.fromCodePoint || String.fromCharCode

    /**
     * Returns the text content of a given HTML source code string.
     *
     * @param {string} html
     * @returns {string}
     */
    function textContent(html) {
      // remove all tags
      var text = html.replace(tagPattern, '')

      // decode known entities
      text = text.replace(/&(\w{1,8}|#x?[\da-f]{1,8});/gi, function (m, code) {
        code = code.toLowerCase()
        if (code[0] === '#') {
          var value
          if (code[1] === 'x') {
            value = parseInt(code.slice(2), 16)
          } else {
            value = Number(code.slice(1))
          }
          return fromCodePoint(value)
        } else {
          var known = KNOWN_ENTITY_NAMES[code]
          if (known) {
            return known
          }

          // unable to decode
          return m
        }
      })
      return text
    }
    Prism.languages.md = Prism.languages.markdown
  })(Prism)
}


/***/ }),

/***/ 5816:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ python; }
/* harmony export */ });
// @ts-nocheck
/**
 * @import {Refractor} from '../lib/core.js'
 */
python.displayName = 'python'
python.aliases = ['py']

/** @param {Refractor} Prism */
function python(Prism) {
  Prism.languages.python = {
    comment: {
      pattern: /(^|[^\\])#.*/,
      lookbehind: true,
      greedy: true
    },
    'string-interpolation': {
      pattern:
        /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
      greedy: true,
      inside: {
        interpolation: {
          // "{" <expression> <optional "!s", "!r", or "!a"> <optional ":" format specifier> "}"
          pattern:
            /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
          lookbehind: true,
          inside: {
            'format-spec': {
              pattern: /(:)[^:(){}]+(?=\}$)/,
              lookbehind: true
            },
            'conversion-option': {
              pattern: /![sra](?=[:}]$)/,
              alias: 'punctuation'
            },
            rest: null
          }
        },
        string: /[\s\S]+/
      }
    },
    'triple-quoted-string': {
      pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
      greedy: true,
      alias: 'string'
    },
    string: {
      pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
      greedy: true
    },
    function: {
      pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
      lookbehind: true
    },
    'class-name': {
      pattern: /(\bclass\s+)\w+/i,
      lookbehind: true
    },
    decorator: {
      pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
      lookbehind: true,
      alias: ['annotation', 'punctuation'],
      inside: {
        punctuation: /\./
      }
    },
    keyword:
      /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
    builtin:
      /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
    boolean: /\b(?:False|None|True)\b/,
    number:
      /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
    operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
    punctuation: /[{}[\];(),.:]/
  }
  Prism.languages.python['string-interpolation'].inside[
    'interpolation'
  ].inside.rest = Prism.languages.python
  Prism.languages.py = Prism.languages.python
}


/***/ }),

/***/ 121:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ typescript; }
});

;// CONCATENATED MODULE: ../../node_modules/.pnpm/refractor@5.0.0/node_modules/refractor/lang/clike.js
// @ts-nocheck
/**
 * @import {Refractor} from '../lib/core.js'
 */
clike.displayName = 'clike'
clike.aliases = []

/** @param {Refractor} Prism */
function clike(Prism) {
  Prism.languages.clike = {
    comment: [
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true,
        greedy: true
      },
      {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true,
        greedy: true
      }
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true
    },
    'class-name': {
      pattern:
        /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: true,
      inside: {
        punctuation: /[.\\]/
      }
    },
    keyword:
      /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
    boolean: /\b(?:false|true)\b/,
    function: /\b\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/
  }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/refractor@5.0.0/node_modules/refractor/lang/javascript.js
// @ts-nocheck
/**
 * @import {Refractor} from '../lib/core.js'
 */

javascript.displayName = 'javascript'
javascript.aliases = ['js']

/** @param {Refractor} Prism */
function javascript(Prism) {
  Prism.register(clike)
  Prism.languages.javascript = Prism.languages.extend('clike', {
    'class-name': [
      Prism.languages.clike['class-name'],
      {
        pattern:
          /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
        lookbehind: true
      }
    ],
    keyword: [
      {
        pattern: /((?:^|\})\s*)catch\b/,
        lookbehind: true
      },
      {
        pattern:
          /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: true
      }
    ],
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    function:
      /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    number: {
      pattern: RegExp(
        /(^|[^\w$])/.source +
          '(?:' +
          // constant
          (/NaN|Infinity/.source +
            '|' +
            // binary integer
            /0[bB][01]+(?:_[01]+)*n?/.source +
            '|' +
            // octal integer
            /0[oO][0-7]+(?:_[0-7]+)*n?/.source +
            '|' +
            // hexadecimal integer
            /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
            '|' +
            // decimal bigint
            /\d+(?:_\d+)*n/.source +
            '|' +
            // decimal number (integer or float) but no bigint
            /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/
              .source) +
          ')' +
          /(?![\w$])/.source
      ),
      lookbehind: true
    },
    operator:
      /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
  })
  Prism.languages.javascript['class-name'][0].pattern =
    /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/
  Prism.languages.insertBefore('javascript', 'keyword', {
    regex: {
      pattern: RegExp(
        // lookbehind
        // eslint-disable-next-line regexp/no-dupe-characters-character-class
        /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
          // Regex pattern:
          // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
          // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
          // with the only syntax, so we have to define 2 different regex patterns.
          /\//.source +
          '(?:' +
          /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/
            .source +
          '|' +
          // `v` flag syntax. This supports 3 levels of nested character classes.
          /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/
            .source +
          ')' +
          // lookahead
          /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/
            .source
      ),
      lookbehind: true,
      greedy: true,
      inside: {
        'regex-source': {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: true,
          alias: 'language-regex',
          inside: Prism.languages.regex
        },
        'regex-delimiter': /^\/|\/$/,
        'regex-flags': /^[a-z]+$/
      }
    },
    // This must be declared before keyword because we use "function" inside the look-forward
    'function-variable': {
      pattern:
        /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: 'function'
    },
    parameter: [
      {
        pattern:
          /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: true,
        inside: Prism.languages.javascript
      },
      {
        pattern:
          /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: true,
        inside: Prism.languages.javascript
      },
      {
        pattern:
          /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: true,
        inside: Prism.languages.javascript
      },
      {
        pattern:
          /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: true,
        inside: Prism.languages.javascript
      }
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  })
  Prism.languages.insertBefore('javascript', 'string', {
    hashbang: {
      pattern: /^#!.*/,
      greedy: true,
      alias: 'comment'
    },
    'template-string': {
      pattern:
        /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: true,
      inside: {
        'template-punctuation': {
          pattern: /^`|`$/,
          alias: 'string'
        },
        interpolation: {
          pattern:
            /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: true,
          inside: {
            'interpolation-punctuation': {
              pattern: /^\$\{|\}$/,
              alias: 'punctuation'
            },
            rest: Prism.languages.javascript
          }
        },
        string: /[\s\S]+/
      }
    },
    'string-property': {
      pattern:
        /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
      lookbehind: true,
      greedy: true,
      alias: 'property'
    }
  })
  Prism.languages.insertBefore('javascript', 'operator', {
    'literal-property': {
      pattern:
        /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
      lookbehind: true,
      alias: 'property'
    }
  })
  if (Prism.languages.markup) {
    Prism.languages.markup.tag.addInlined('script', 'javascript')

    // add attribute support for all DOM events.
    // https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events
    Prism.languages.markup.tag.addAttribute(
      /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/
        .source,
      'javascript'
    )
  }
  Prism.languages.js = Prism.languages.javascript
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/refractor@5.0.0/node_modules/refractor/lang/typescript.js
// @ts-nocheck
/**
 * @import {Refractor} from '../lib/core.js'
 */

typescript.displayName = 'typescript'
typescript.aliases = ['ts']

/** @param {Refractor} Prism */
function typescript(Prism) {
  Prism.register(javascript)
  ;(function (Prism) {
    Prism.languages.typescript = Prism.languages.extend('javascript', {
      'class-name': {
        pattern:
          /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
        lookbehind: true,
        greedy: true,
        inside: null // see below
      },
      builtin:
        /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/
    })

    // The keywords TypeScript adds to JavaScript
    Prism.languages.typescript.keyword.push(
      /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
      // keywords that have to be followed by an identifier
      /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
      // This is for `import type *, {}`
      /\btype\b(?=\s*(?:[\{*]|$))/
    )

    // doesn't work with TS because TS is too complex
    delete Prism.languages.typescript['parameter']
    delete Prism.languages.typescript['literal-property']

    // a version of typescript specifically for highlighting types
    var typeInside = Prism.languages.extend('typescript', {})
    delete typeInside['class-name']
    Prism.languages.typescript['class-name'].inside = typeInside
    Prism.languages.insertBefore('typescript', 'function', {
      decorator: {
        pattern: /@[$\w\xA0-\uFFFF]+/,
        inside: {
          at: {
            pattern: /^@/,
            alias: 'operator'
          },
          function: /^[\s\S]+/
        }
      },
      'generic-function': {
        // e.g. foo<T extends "bar" | "baz">( ...
        pattern:
          /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
        greedy: true,
        inside: {
          function: /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
          generic: {
            pattern: /<[\s\S]+/,
            // everything after the first <
            alias: 'class-name',
            inside: typeInside
          }
        }
      }
    })
    Prism.languages.ts = Prism.languages.typescript
  })(Prism)
}


/***/ }),

/***/ 8384:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "P": function() { return /* binding */ stringify; },
/* harmony export */   "Q": function() { return /* binding */ parse; }
/* harmony export */ });
/**
 * Parse space-separated tokens to an array of strings.
 *
 * @param {string} value
 *   Space-separated tokens.
 * @returns {Array<string>}
 *   List of tokens.
 */
function parse(value) {
  const input = String(value || '').trim()
  return input ? input.split(/[ \t\n\r\f]+/g) : []
}

/**
 * Serialize an array of strings as space separated-tokens.
 *
 * @param {Array<string|number>} values
 *   List of tokens.
 * @returns {string}
 *   Space-separated tokens.
 */
function stringify(values) {
  return values.join(' ').trim()
}


/***/ })

}]);