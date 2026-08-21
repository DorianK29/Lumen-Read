"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[801,537],{

/***/ 7801:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async function (__webpack_handle_async_dependencies__, __webpack_async_result__) { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Voy": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.XL; },
/* harmony export */   "__wbg_error_f851667af71bcfc6": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.iX; },
/* harmony export */   "__wbg_new_abda76e883ba8a5f": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.a2; },
/* harmony export */   "__wbg_parse_76a8a18ca3f8730b": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.ZR; },
/* harmony export */   "__wbg_set_wasm": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.oT; },
/* harmony export */   "__wbg_stack_658279fe44541cf6": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.KM; },
/* harmony export */   "__wbg_stringify_d06ad2addc54d51e": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.J_; },
/* harmony export */   "__wbindgen_is_undefined": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.XP; },
/* harmony export */   "__wbindgen_object_clone_ref": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.m_; },
/* harmony export */   "__wbindgen_object_drop_ref": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.ug; },
/* harmony export */   "__wbindgen_string_get": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.qt; },
/* harmony export */   "__wbindgen_throw": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.Or; },
/* harmony export */   "add": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.IH; },
/* harmony export */   "clear": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.ZH; },
/* harmony export */   "index": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.Kz; },
/* harmony export */   "remove": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.Od; },
/* harmony export */   "search": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.yC; },
/* harmony export */   "size": function() { return /* reexport safe */ _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__.dp; }
/* harmony export */ });
/* harmony import */ var _voy_search_bg_wasm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9579);
/* harmony import */ var _voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7286);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_voy_search_bg_wasm__WEBPACK_IMPORTED_MODULE_1__]);
_voy_search_bg_wasm__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


(0,_voy_search_bg_js__WEBPACK_IMPORTED_MODULE_0__/* .__wbg_set_wasm */ .oT)(_voy_search_bg_wasm__WEBPACK_IMPORTED_MODULE_1__);


__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 7286:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IH": function() { return /* binding */ add; },
/* harmony export */   "J_": function() { return /* binding */ __wbg_stringify_d06ad2addc54d51e; },
/* harmony export */   "KM": function() { return /* binding */ __wbg_stack_658279fe44541cf6; },
/* harmony export */   "Kz": function() { return /* binding */ index; },
/* harmony export */   "Od": function() { return /* binding */ remove; },
/* harmony export */   "Or": function() { return /* binding */ __wbindgen_throw; },
/* harmony export */   "XL": function() { return /* binding */ Voy; },
/* harmony export */   "XP": function() { return /* binding */ __wbindgen_is_undefined; },
/* harmony export */   "ZH": function() { return /* binding */ clear; },
/* harmony export */   "ZR": function() { return /* binding */ __wbg_parse_76a8a18ca3f8730b; },
/* harmony export */   "a2": function() { return /* binding */ __wbg_new_abda76e883ba8a5f; },
/* harmony export */   "dp": function() { return /* binding */ size; },
/* harmony export */   "iX": function() { return /* binding */ __wbg_error_f851667af71bcfc6; },
/* harmony export */   "m_": function() { return /* binding */ __wbindgen_object_clone_ref; },
/* harmony export */   "oT": function() { return /* binding */ __wbg_set_wasm; },
/* harmony export */   "qt": function() { return /* binding */ __wbindgen_string_get; },
/* harmony export */   "ug": function() { return /* binding */ __wbindgen_object_drop_ref; },
/* harmony export */   "yC": function() { return /* binding */ search; }
/* harmony export */ });
/* harmony import */ var _swc_helpers_src_class_call_check_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4656);
/* harmony import */ var _swc_helpers_src_create_class_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9648);
/* module decorator */ module = __webpack_require__.hmd(module);


var wasm;
function __wbg_set_wasm(val) {
    wasm = val;
}
var heap = new Array(128).fill(undefined);
heap.push(undefined, null, true, false);
function getObject(idx) {
    return heap[idx];
}
var heap_next = heap.length;
function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    var idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
}
function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}
function takeObject(idx) {
    var ret = getObject(idx);
    dropObject(idx);
    return ret;
}
var WASM_VECTOR_LEN = 0;
var cachedUint8Memory0 = null;
function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}
var lTextEncoder = typeof TextEncoder === "undefined" ? (0, module.require)("util").TextEncoder : TextEncoder;
var cachedTextEncoder = new lTextEncoder("utf-8");
var encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function encodeString(arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
} : function(arg, view) {
    var buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
};
function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        var buf = cachedTextEncoder.encode(arg);
        var ptr = malloc(buf.length) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }
    var len = arg.length;
    var ptr1 = malloc(len) >>> 0;
    var mem = getUint8Memory0();
    var offset = 0;
    for(; offset < len; offset++){
        var code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr1 + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr1 = realloc(ptr1, len, len = offset + arg.length * 3) >>> 0;
        var view = getUint8Memory0().subarray(ptr1 + offset, ptr1 + len);
        var ret = encodeString(arg, view);
        offset += ret.written;
    }
    WASM_VECTOR_LEN = offset;
    return ptr1;
}
function isLikeNone(x) {
    return x === undefined || x === null;
}
var cachedInt32Memory0 = null;
function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}
var lTextDecoder = typeof TextDecoder === "undefined" ? (0, module.require)("util").TextDecoder : TextDecoder;
var cachedTextDecoder = new lTextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
});
cachedTextDecoder.decode();
function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
var cachedFloat32Memory0 = null;
function getFloat32Memory0() {
    if (cachedFloat32Memory0 === null || cachedFloat32Memory0.byteLength === 0) {
        cachedFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32Memory0;
}
function passArrayF32ToWasm0(arg, malloc) {
    var ptr = malloc(arg.length * 4) >>> 0;
    getFloat32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {Resource} resource
* @returns {string}
*/ function index(resource) {
    var deferred1_0;
    var deferred1_1;
    try {
        var retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.index(retptr, addHeapObject(resource));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally{
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred1_0, deferred1_1);
    }
}
/**
* @param {string} index
* @param {Float32Array} query
* @param {number} k
* @returns {SearchResult}
*/ function search(index, query, k) {
    var ptr0 = passStringToWasm0(index, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passArrayF32ToWasm0(query, wasm.__wbindgen_malloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.search(ptr0, len0, ptr1, len1, k);
    return takeObject(ret);
}
/**
* @param {string} index
* @param {Resource} resource
* @returns {string}
*/ function add(index, resource) {
    var deferred2_0;
    var deferred2_1;
    try {
        var retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passStringToWasm0(index, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.add(retptr, ptr0, len0, addHeapObject(resource));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred2_0 = r0;
        deferred2_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally{
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred2_0, deferred2_1);
    }
}
/**
* @param {string} index
* @param {Resource} resource
* @returns {string}
*/ function remove(index, resource) {
    var deferred2_0;
    var deferred2_1;
    try {
        var retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passStringToWasm0(index, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.remove(retptr, ptr0, len0, addHeapObject(resource));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred2_0 = r0;
        deferred2_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally{
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred2_0, deferred2_1);
    }
}
/**
* @param {string} index
* @returns {string}
*/ function clear(index) {
    var deferred2_0;
    var deferred2_1;
    try {
        var retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passStringToWasm0(index, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.clear(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred2_0 = r0;
        deferred2_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally{
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred2_0, deferred2_1);
    }
}
/**
* @param {string} index
* @returns {number}
*/ function size(index) {
    var ptr0 = passStringToWasm0(index, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.size(ptr0, len0);
    return ret >>> 0;
}
function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/ var Voy = /*#__PURE__*/ function() {
    "use strict";
    function Voy(resource) {
        (0,_swc_helpers_src_class_call_check_mjs__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this, Voy);
        var ret = wasm.voy_new(isLikeNone(resource) ? 0 : addHeapObject(resource));
        return Voy.__wrap(ret);
    }
    (0,_swc_helpers_src_create_class_mjs__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(Voy, [
        {
            key: "__destroy_into_raw",
            value: function __destroy_into_raw() {
                var ptr = this.__wbg_ptr;
                this.__wbg_ptr = 0;
                return ptr;
            }
        },
        {
            key: "free",
            value: function free() {
                var ptr = this.__destroy_into_raw();
                wasm.__wbg_voy_free(ptr);
            }
        },
        {
            /**
    * @returns {string}
    */ key: "serialize",
            value: function serialize() {
                var deferred1_0;
                var deferred1_1;
                try {
                    var retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                    wasm.voy_serialize(retptr, this.__wbg_ptr);
                    var r0 = getInt32Memory0()[retptr / 4 + 0];
                    var r1 = getInt32Memory0()[retptr / 4 + 1];
                    deferred1_0 = r0;
                    deferred1_1 = r1;
                    return getStringFromWasm0(r0, r1);
                } finally{
                    wasm.__wbindgen_add_to_stack_pointer(16);
                    wasm.__wbindgen_free(deferred1_0, deferred1_1);
                }
            }
        },
        {
            /**
    * @param {Resource} resource
    */ key: "index",
            value: function index(resource) {
                wasm.voy_index(this.__wbg_ptr, addHeapObject(resource));
            }
        },
        {
            /**
    * @param {Float32Array} query
    * @param {number} k
    * @returns {SearchResult}
    */ key: "search",
            value: function search(query, k) {
                var ptr0 = passArrayF32ToWasm0(query, wasm.__wbindgen_malloc);
                var len0 = WASM_VECTOR_LEN;
                var ret = wasm.voy_search(this.__wbg_ptr, ptr0, len0, k);
                return takeObject(ret);
            }
        },
        {
            /**
    * @param {Resource} resource
    */ key: "add",
            value: function add(resource) {
                wasm.voy_add(this.__wbg_ptr, addHeapObject(resource));
            }
        },
        {
            /**
    * @param {Resource} resource
    */ key: "remove",
            value: function remove(resource) {
                wasm.voy_remove(this.__wbg_ptr, addHeapObject(resource));
            }
        },
        {
            /**
    */ key: "clear",
            value: function clear() {
                wasm.voy_clear(this.__wbg_ptr);
            }
        },
        {
            /**
    * @returns {number}
    */ key: "size",
            value: function size() {
                var ret = wasm.voy_size(this.__wbg_ptr);
                return ret >>> 0;
            }
        }
    ], [
        {
            key: "__wrap",
            value: function __wrap(ptr) {
                ptr = ptr >>> 0;
                var obj = Object.create(Voy.prototype);
                obj.__wbg_ptr = ptr;
                return obj;
            }
        },
        {
            key: "deserialize",
            value: /**
    * @param {string} serialized_index
    * @returns {Voy}
    */ function deserialize(serialized_index) {
                var ptr0 = passStringToWasm0(serialized_index, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
                var len0 = WASM_VECTOR_LEN;
                var ret = wasm.voy_deserialize(ptr0, len0);
                return Voy.__wrap(ret);
            }
        }
    ]);
    return Voy;
}();
function __wbindgen_object_clone_ref(arg0) {
    var ret = getObject(arg0);
    return addHeapObject(ret);
}
;
function __wbindgen_is_undefined(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
}
;
function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
}
;
function __wbg_new_abda76e883ba8a5f() {
    var ret = new Error();
    return addHeapObject(ret);
}
;
function __wbg_stack_658279fe44541cf6(arg0, arg1) {
    var ret = getObject(arg1).stack;
    var ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}
;
function __wbg_error_f851667af71bcfc6(arg0, arg1) {
    var deferred0_0;
    var deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally{
        wasm.__wbindgen_free(deferred0_0, deferred0_1);
    }
}
;
function __wbg_parse_76a8a18ca3f8730b() {
    return handleError(function(arg0, arg1) {
        var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments);
}
;
function __wbg_stringify_d06ad2addc54d51e() {
    return handleError(function(arg0) {
        var ret = JSON.stringify(getObject(arg0));
        return addHeapObject(ret);
    }, arguments);
}
;
function __wbindgen_string_get(arg0, arg1) {
    var obj = getObject(arg1);
    var ret = typeof obj === "string" ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}
;
function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
}
;


/***/ }),

/***/ 9648:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _createClass; }
/* harmony export */ });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}


/***/ }),

/***/ 9579:
/***/ (function(module, exports, __webpack_require__) {

/* harmony import */ var WEBPACK_IMPORTED_MODULE_0 = __webpack_require__(7286);
module.exports = __webpack_require__.v(exports, module.id, "43274586ceaca369", {
	"./voy_search_bg.js": {
		"__wbindgen_object_clone_ref": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_object_clone_ref */ .m_,
		"__wbindgen_is_undefined": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_is_undefined */ .XP,
		"__wbindgen_object_drop_ref": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_object_drop_ref */ .ug,
		"__wbg_new_abda76e883ba8a5f": WEBPACK_IMPORTED_MODULE_0/* .__wbg_new_abda76e883ba8a5f */ .a2,
		"__wbg_stack_658279fe44541cf6": WEBPACK_IMPORTED_MODULE_0/* .__wbg_stack_658279fe44541cf6 */ .KM,
		"__wbg_error_f851667af71bcfc6": WEBPACK_IMPORTED_MODULE_0/* .__wbg_error_f851667af71bcfc6 */ .iX,
		"__wbg_parse_76a8a18ca3f8730b": WEBPACK_IMPORTED_MODULE_0/* .__wbg_parse_76a8a18ca3f8730b */ .ZR,
		"__wbg_stringify_d06ad2addc54d51e": WEBPACK_IMPORTED_MODULE_0/* .__wbg_stringify_d06ad2addc54d51e */ .J_,
		"__wbindgen_string_get": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_string_get */ .qt,
		"__wbindgen_throw": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_throw */ .Or
	}
});

/***/ })

}]);