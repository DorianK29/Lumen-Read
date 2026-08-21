/******/ (function() { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ 1514:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _swc_helpers_src_async_iterator_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6131);
/* harmony import */ var _swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(947);
/* harmony import */ var _swc_helpers_src_class_call_check_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4656);
/* harmony import */ var _swc_helpers_src_instanceof_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8149);
/* harmony import */ var _swc_helpers_src_object_spread_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6690);
/* harmony import */ var _swc_helpers_src_sliced_to_array_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1296);
/* harmony import */ var _swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2336);
/* harmony import */ var _wllama_wllama_esm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4940);
/// <reference lib="webworker" />








var DEBUG = "production" !== "production";
var IS_FIREFOX = typeof navigator !== "undefined" && /Firefox/i.test((navigator === null || navigator === void 0 ? void 0 : navigator.userAgent) || "");
// SOTA (2026): Gemma 3 270M Instruct (GGUF) - good quality/size tradeoff.
var DEFAULT_MODEL_URL = "https://huggingface.co/unsloth/gemma-3-270m-it-GGUF/resolve/e45c5af7019a8d4f30dc82c5e0f35b0cce139631/gemma-3-270m-it-Q6_K.gguf";
// Cache-buster for local extension assets (workers/wasm). Firefox can keep old
// module-worker code around longer than you'd expect across reloads.
var WLLAMA_ASSET_VERSION = "20260204a";
// Blob-worker override is a fallback for Firefox CSP/Blob-worker edge cases.
// We keep it enabled only in Firefox and still prefer native blob workers first.
var ENABLE_WLLAMA_WORKER_OVERRIDE_FALLBACK = IS_FIREFOX;
var MODEL_CTX = 4096;
var MAX_HISTORY_TURNS = 4;
var MAX_HISTORY_CHARS_PER_TURN = 220;
var METADATA_PREFIX = "__metadata__";
function toErrorDetails(reason) {
    if ((0,_swc_helpers_src_instanceof_mjs__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(reason, Error)) {
        return {
            message: reason.message || String(reason),
            stack: reason.stack
        };
    }
    if (typeof reason === "string") {
        return {
            message: reason
        };
    }
    if (reason && typeof reason === "object") {
        try {
            return {
                message: JSON.stringify(reason)
            };
        } catch (e) {
            return {
                message: String(reason)
            };
        }
    }
    return {
        message: String(reason || "unknown_worker_error")
    };
}
function postUnhandledWorkerError(stage, reason) {
    var ref = toErrorDetails(reason), message = ref.message, stack = ref.stack;
    try {
        self.postMessage({
            type: "slm-error",
            data: {
                stage: stage,
                message: message,
                stack: stack
            },
            fatal: false
        });
    } catch (e) {
    // ignore
    }
}
// Guard against silent async failures in worker runtime. Without this, some
// rejected internal promises can leave the UI stuck in "downloading".
self.addEventListener("unhandledrejection", function(event) {
    postUnhandledWorkerError("unhandledrejection", event.reason);
});
self.addEventListener("error", function(event) {
    postUnhandledWorkerError("worker_runtime", event.error || event.message);
});
function debugLog(message, data) {
    if (!DEBUG) return;
    try {
        self.postMessage({
            type: "slm-debug",
            data: (0,_swc_helpers_src_object_spread_mjs__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)({
                message: message
            }, data || {})
        });
    } catch (e) {
    // ignore
    }
}
function postError(id, err, stage) {
    var fatal = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
    var message = (0,_swc_helpers_src_instanceof_mjs__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(err, Error) ? err.message : String(err);
    var stack = (0,_swc_helpers_src_instanceof_mjs__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(err, Error) ? err.stack : undefined;
    debugLog("error", {
        stage: stage,
        message: message
    });
    try {
        self.postMessage({
            type: "slm-error",
            data: {
                stage: stage,
                message: message,
                stack: stack
            },
            fatal: fatal
        });
    } catch (e) {
    // ignore
    }
    if (typeof id === "number") {
        try {
            self.postMessage({
                id: id,
                error: message,
                fatal: fatal
            });
        } catch (e1) {
        // ignore
        }
    }
}
function compactText(input) {
    return (input || "").replace(/Sources:[^\n\r]*/gi, "").replace(/\[S\d+:C\d+\]/g, "").replace(/\s+/g, " ").trim();
}
function safeJsonParse(text) {
    var cleaned = String(text || "").replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
    var start = cleaned.indexOf("{");
    var end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    var slice = cleaned.slice(start, end + 1);
    try {
        return JSON.parse(slice);
    } catch (e) {
        return null;
    }
}
// ----------------------------------------------------------------------------
// wllama bootstrapping (CSP-safe worker override + stable wasm bytes)
// ----------------------------------------------------------------------------
var DirectOPFSCacheManager = /*#__PURE__*/ function() {
    "use strict";
    function DirectOPFSCacheManager() {
        (0,_swc_helpers_src_class_call_check_mjs__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(this, DirectOPFSCacheManager);
    }
    var _proto = DirectOPFSCacheManager.prototype;
    _proto.getCacheDir = function getCacheDir() {
        return (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
            var storage, opfsRoot;
            return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        storage = navigator === null || navigator === void 0 ? void 0 : navigator.storage;
                        if (!(storage === null || storage === void 0 ? void 0 : storage.getDirectory)) {
                            throw new Error("OPFS not supported (navigator.storage.getDirectory missing)");
                        }
                        return [
                            4,
                            storage.getDirectory()
                        ];
                    case 1:
                        opfsRoot = _state.sent();
                        return [
                            4,
                            opfsRoot.getDirectoryHandle("cache", {
                                create: true
                            })
                        ];
                    case 2:
                        return [
                            2,
                            _state.sent()
                        ];
                }
            });
        })();
    };
    _proto.urlToFileName = function urlToFileName(url, prefix) {
        return (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
            var hashBuffer, hashArray, hashHex;
            return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            crypto.subtle.digest("SHA-1", new TextEncoder().encode(url))
                        ];
                    case 1:
                        hashBuffer = _state.sent();
                        hashArray = Array.from(new Uint8Array(hashBuffer));
                        hashHex = hashArray.map(function(b) {
                            return b.toString(16).padStart(2, "0");
                        }).join("");
                        return [
                            2,
                            "".concat(prefix).concat(hashHex, "_").concat(url.split("/").pop())
                        ];
                }
            });
        })();
    };
    _proto.writeMetadata = function writeMetadata(fileName, metadata) {
        var _this = this;
        return (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
            var ref, cacheDir, fileHandle, writable, accessHandle, buf;
            return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.getCacheDir()
                        ];
                    case 1:
                        cacheDir = _state.sent();
                        return [
                            4,
                            cacheDir.getFileHandle(fileName, {
                                create: true
                            })
                        ];
                    case 2:
                        fileHandle = _state.sent();
                        if (!fileHandle.createWritable) return [
                            3,
                            6
                        ];
                        return [
                            4,
                            fileHandle.createWritable()
                        ];
                    case 3:
                        writable = _state.sent();
                        return [
                            4,
                            writable.write(new TextEncoder().encode(JSON.stringify(metadata)))
                        ];
                    case 4:
                        _state.sent();
                        return [
                            4,
                            writable.close()
                        ];
                    case 5:
                        _state.sent();
                        return [
                            2
                        ];
                    case 6:
                        return [
                            4,
                            (ref = fileHandle.createSyncAccessHandle) === null || ref === void 0 ? void 0 : ref.call(fileHandle)
                        ];
                    case 7:
                        accessHandle = _state.sent();
                        if (!accessHandle) {
                            throw new Error("OPFS metadata write failed (no writable or sync access handle)");
                        }
                        buf = new TextEncoder().encode(JSON.stringify(metadata));
                        accessHandle.truncate(0);
                        accessHandle.write(buf, {
                            at: 0
                        });
                        accessHandle.flush();
                        accessHandle.close();
                        return [
                            2
                        ];
                }
            });
        })();
    };
    _proto.write = function write(name, stream, metadata) {
        var _this = this;
        return (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
            var cacheDir, fileHandle, reader, syncHandle, _tmp, writable, _tmp1, offset, done, chunk, value;
            return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.getCacheDir()
                        ];
                    case 1:
                        cacheDir = _state.sent();
                        return [
                            4,
                            cacheDir.getFileHandle(name, {
                                create: true
                            })
                        ];
                    case 2:
                        fileHandle = _state.sent();
                        reader = stream.getReader();
                        if (!fileHandle.createSyncAccessHandle) return [
                            3,
                            4
                        ];
                        return [
                            4,
                            fileHandle.createSyncAccessHandle()
                        ];
                    case 3:
                        _tmp = _state.sent();
                        return [
                            3,
                            5
                        ];
                    case 4:
                        _tmp = null;
                        _state.label = 5;
                    case 5:
                        syncHandle = _tmp;
                        if (!(!syncHandle && fileHandle.createWritable)) return [
                            3,
                            7
                        ];
                        return [
                            4,
                            fileHandle.createWritable()
                        ];
                    case 6:
                        _tmp1 = _state.sent();
                        return [
                            3,
                            8
                        ];
                    case 7:
                        _tmp1 = null;
                        _state.label = 8;
                    case 8:
                        writable = _tmp1;
                        if (!syncHandle) return [
                            3,
                            9
                        ];
                        syncHandle.truncate(0);
                        return [
                            3,
                            11
                        ];
                    case 9:
                        if (!writable) return [
                            3,
                            11
                        ];
                        return [
                            4,
                            writable.truncate(0)
                        ];
                    case 10:
                        _state.sent();
                        _state.label = 11;
                    case 11:
                        offset = 0;
                        done = false;
                        _state.label = 12;
                    case 12:
                        if (!!done) return [
                            3,
                            17
                        ];
                        return [
                            4,
                            reader.read()
                        ];
                    case 13:
                        chunk = _state.sent();
                        done = chunk.done;
                        value = chunk.value;
                        if (!value) return [
                            3,
                            12
                        ];
                        if (!syncHandle) return [
                            3,
                            14
                        ];
                        syncHandle.write(value, {
                            at: offset
                        });
                        return [
                            3,
                            16
                        ];
                    case 14:
                        if (!writable) return [
                            3,
                            16
                        ];
                        return [
                            4,
                            writable.write({
                                type: "write",
                                position: offset,
                                data: value
                            })
                        ];
                    case 15:
                        _state.sent();
                        _state.label = 16;
                    case 16:
                        offset += value.byteLength;
                        return [
                            3,
                            12
                        ];
                    case 17:
                        if (!syncHandle) return [
                            3,
                            18
                        ];
                        syncHandle.flush();
                        syncHandle.close();
                        return [
                            3,
                            20
                        ];
                    case 18:
                        if (!writable) return [
                            3,
                            20
                        ];
                        return [
                            4,
                            writable.close()
                        ];
                    case 19:
                        _state.sent();
                        _state.label = 20;
                    case 20:
                        return [
                            4,
                            _this.writeMetadata("".concat(METADATA_PREFIX).concat(name), metadata)
                        ];
                    case 21:
                        _state.sent();
                        return [
                            2
                        ];
                }
            });
        })();
    };
    _proto.download = function download(url) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var _this = this;
        return (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
            var ref, filename, metadataFileName, cacheDir, fileHandle, response, total, etag, reader, syncHandle, _tmp, writable, _tmp1, loaded, done, ref1, chunk, value;
            return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.urlToFileName(url, "")
                        ];
                    case 1:
                        filename = _state.sent();
                        return [
                            4,
                            _this.urlToFileName(url, METADATA_PREFIX)
                        ];
                    case 2:
                        metadataFileName = _state.sent();
                        return [
                            4,
                            _this.getCacheDir()
                        ];
                    case 3:
                        cacheDir = _state.sent();
                        return [
                            4,
                            cacheDir.getFileHandle(filename, {
                                create: true
                            })
                        ];
                    case 4:
                        fileHandle = _state.sent();
                        return [
                            4,
                            fetch(url, {
                                headers: options.headers,
                                signal: options.signal
                            })
                        ];
                    case 5:
                        response = _state.sent();
                        if (!response.ok || !response.body) {
                            throw new Error("Download failed: ".concat(response.status, " ").concat(response.statusText));
                        }
                        total = Number(response.headers.get("content-length") || "0");
                        etag = (response.headers.get("etag") || "").replace(/[^A-Za-z0-9]/g, "");
                        reader = response.body.getReader();
                        if (!fileHandle.createSyncAccessHandle) return [
                            3,
                            7
                        ];
                        return [
                            4,
                            fileHandle.createSyncAccessHandle()
                        ];
                    case 6:
                        _tmp = _state.sent();
                        return [
                            3,
                            8
                        ];
                    case 7:
                        _tmp = null;
                        _state.label = 8;
                    case 8:
                        syncHandle = _tmp;
                        if (!(!syncHandle && fileHandle.createWritable)) return [
                            3,
                            10
                        ];
                        return [
                            4,
                            fileHandle.createWritable()
                        ];
                    case 9:
                        _tmp1 = _state.sent();
                        return [
                            3,
                            11
                        ];
                    case 10:
                        _tmp1 = null;
                        _state.label = 11;
                    case 11:
                        writable = _tmp1;
                        if (!syncHandle) return [
                            3,
                            12
                        ];
                        syncHandle.truncate(0);
                        return [
                            3,
                            14
                        ];
                    case 12:
                        if (!writable) return [
                            3,
                            14
                        ];
                        return [
                            4,
                            writable.truncate(0)
                        ];
                    case 13:
                        _state.sent();
                        _state.label = 14;
                    case 14:
                        loaded = 0;
                        done = false;
                        _state.label = 15;
                    case 15:
                        if (!!done) return [
                            3,
                            20
                        ];
                        return [
                            4,
                            reader.read()
                        ];
                    case 16:
                        chunk = _state.sent();
                        done = chunk.done;
                        value = chunk.value;
                        if (!value) return [
                            3,
                            15
                        ];
                        if (!syncHandle) return [
                            3,
                            17
                        ];
                        syncHandle.write(value, {
                            at: loaded
                        });
                        return [
                            3,
                            19
                        ];
                    case 17:
                        if (!writable) return [
                            3,
                            19
                        ];
                        return [
                            4,
                            writable.write({
                                type: "write",
                                position: loaded,
                                data: value
                            })
                        ];
                    case 18:
                        _state.sent();
                        _state.label = 19;
                    case 19:
                        loaded += value.byteLength;
                        (ref1 = options.progressCallback) === null || ref1 === void 0 ? void 0 : ref1.call(options, {
                            loaded: loaded,
                            total: total || loaded
                        });
                        return [
                            3,
                            15
                        ];
                    case 20:
                        (ref = options.progressCallback) === null || ref === void 0 ? void 0 : ref.call(options, {
                            loaded: loaded,
                            total: total || loaded
                        });
                        if (!syncHandle) return [
                            3,
                            21
                        ];
                        syncHandle.flush();
                        syncHandle.close();
                        return [
                            3,
                            23
                        ];
                    case 21:
                        if (!writable) return [
                            3,
                            23
                        ];
                        return [
                            4,
                            writable.close()
                        ];
                    case 22:
                        _state.sent();
                        _state.label = 23;
                    case 23:
                        return [
                            4,
                            _this.writeMetadata(metadataFileName, {
                                originalURL: url,
                                originalSize: total || loaded,
                                etag: etag
                            })
                        ];
                    case 24:
                        _state.sent();
                        return [
                            2
                        ];
                }
            });
        })();
    };
    _proto.getNameFromURL = function getNameFromURL(url) {
        var _this = this;
        return (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
            return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.urlToFileName(url, "")
                        ];
                    case 1:
                        return [
                            2,
                            _state.sent()
                        ];
                }
            });
        })();
    };
    _proto.open = function open(nameOrURL) {
        var _this = this;
        return (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
            var cacheDir, fileName, _tmp, fileHandle, file, e;
            return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            7,
                            ,
                            8
                        ]);
                        return [
                            4,
                            _this.getCacheDir()
                        ];
                    case 1:
                        cacheDir = _state.sent();
                        if (!nameOrURL.includes("://")) return [
                            3,
                            3
                        ];
                        return [
                            4,
                            _this.urlToFileName(nameOrURL, "")
                        ];
                    case 2:
                        _tmp = _state.sent();
                        return [
                            3,
                            4
                        ];
                    case 3:
                        _tmp = nameOrURL;
                        _state.label = 4;
                    case 4:
                        fileName = _tmp;
                        return [
                            4,
                            cacheDir.getFileHandle(fileName)
                        ];
                    case 5:
                        fileHandle = _state.sent();
                        return [
                            4,
                            fileHandle.getFile()
                        ];
                    case 6:
                        file = _state.sent();
                        return [
                            2,
                            file || null
                        ];
                    case 7:
                        e = _state.sent();
                        return [
                            2,
                            null
                        ];
                    case 8:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    _proto.getSize = function getSize(nameOrURL) {
        var _this = this;
        return (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
            var file, e;
            return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4,
                            _this.open(nameOrURL)
                        ];
                    case 1:
                        file = _state.sent();
                        return [
                            2,
                            file ? file.size : -1
                        ];
                    case 2:
                        e = _state.sent();
                        return [
                            2,
                            -1
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    _proto.getMetadata = function getMetadata(nameOrURL) {
        var _this = this;
        return (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
            var cacheDir, fileName, _tmp, metaHandle, file, json, e;
            return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            8,
                            ,
                            9
                        ]);
                        return [
                            4,
                            _this.getCacheDir()
                        ];
                    case 1:
                        cacheDir = _state.sent();
                        if (!nameOrURL.includes("://")) return [
                            3,
                            3
                        ];
                        return [
                            4,
                            _this.urlToFileName(nameOrURL, "")
                        ];
                    case 2:
                        _tmp = _state.sent();
                        return [
                            3,
                            4
                        ];
                    case 3:
                        _tmp = nameOrURL;
                        _state.label = 4;
                    case 4:
                        fileName = _tmp;
                        return [
                            4,
                            cacheDir.getFileHandle("".concat(METADATA_PREFIX).concat(fileName))
                        ];
                    case 5:
                        metaHandle = _state.sent();
                        return [
                            4,
                            metaHandle.getFile()
                        ];
                    case 6:
                        file = _state.sent();
                        return [
                            4,
                            new Response(file).json().catch(function() {
                                return null;
                            })
                        ];
                    case 7:
                        json = _state.sent();
                        return [
                            2,
                            json || null
                        ];
                    case 8:
                        e = _state.sent();
                        return [
                            2,
                            null
                        ];
                    case 9:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    _proto.list = function list() {
        var _this = this;
        return (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
            var cacheDir, result, metadataMap, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, __value, name, handler, file, meta, err, _iteratorAbruptCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, _value1, __value1, name1, handler1, file1, meta1, err1;
            return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.getCacheDir()
                        ];
                    case 1:
                        cacheDir = _state.sent();
                        result = [];
                        metadataMap = {};
                        _iteratorAbruptCompletion = false, _didIteratorError = false;
                        _state.label = 2;
                    case 2:
                        _state.trys.push([
                            2,
                            9,
                            10,
                            15
                        ]);
                        _iterator = (0,_swc_helpers_src_async_iterator_mjs__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z)(cacheDir.entries());
                        _state.label = 3;
                    case 3:
                        return [
                            4,
                            _iterator.next()
                        ];
                    case 4:
                        if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                            3,
                            8
                        ];
                        _value = _step.value;
                        __value = (0,_swc_helpers_src_sliced_to_array_mjs__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)(_value, 2), name = __value[0], handler = __value[1];
                        if (!(handler.kind === "file" && String(name).startsWith(METADATA_PREFIX))) return [
                            3,
                            7
                        ];
                        return [
                            4,
                            handler.getFile()
                        ];
                    case 5:
                        file = _state.sent();
                        return [
                            4,
                            new Response(file).json().catch(function() {
                                return null;
                            })
                        ];
                    case 6:
                        meta = _state.sent();
                        metadataMap[String(name).replace(METADATA_PREFIX, "")] = meta;
                        _state.label = 7;
                    case 7:
                        _iteratorAbruptCompletion = false;
                        return [
                            3,
                            3
                        ];
                    case 8:
                        return [
                            3,
                            15
                        ];
                    case 9:
                        err = _state.sent();
                        _didIteratorError = true;
                        _iteratorError = err;
                        return [
                            3,
                            15
                        ];
                    case 10:
                        _state.trys.push([
                            10,
                            ,
                            13,
                            14
                        ]);
                        if (!(_iteratorAbruptCompletion && _iterator.return != null)) return [
                            3,
                            12
                        ];
                        return [
                            4,
                            _iterator.return()
                        ];
                    case 11:
                        _state.sent();
                        _state.label = 12;
                    case 12:
                        return [
                            3,
                            14
                        ];
                    case 13:
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                        return [
                            7
                        ];
                    case 14:
                        return [
                            7
                        ];
                    case 15:
                        _iteratorAbruptCompletion1 = false, _didIteratorError1 = false;
                        _state.label = 16;
                    case 16:
                        _state.trys.push([
                            16,
                            22,
                            23,
                            28
                        ]);
                        _iterator1 = (0,_swc_helpers_src_async_iterator_mjs__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z)(cacheDir.entries());
                        _state.label = 17;
                    case 17:
                        return [
                            4,
                            _iterator1.next()
                        ];
                    case 18:
                        if (!(_iteratorAbruptCompletion1 = !(_step1 = _state.sent()).done)) return [
                            3,
                            21
                        ];
                        _value1 = _step1.value;
                        __value1 = (0,_swc_helpers_src_sliced_to_array_mjs__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)(_value1, 2), name1 = __value1[0], handler1 = __value1[1];
                        if (!(handler1.kind === "file" && !String(name1).startsWith(METADATA_PREFIX))) return [
                            3,
                            20
                        ];
                        return [
                            4,
                            handler1.getFile()
                        ];
                    case 19:
                        file1 = _state.sent();
                        meta1 = metadataMap[String(name1)] || {
                            originalSize: file1.size,
                            originalURL: "",
                            etag: ""
                        };
                        result.push({
                            name: String(name1),
                            size: file1.size,
                            metadata: meta1
                        });
                        _state.label = 20;
                    case 20:
                        _iteratorAbruptCompletion1 = false;
                        return [
                            3,
                            17
                        ];
                    case 21:
                        return [
                            3,
                            28
                        ];
                    case 22:
                        err1 = _state.sent();
                        _didIteratorError1 = true;
                        _iteratorError1 = err1;
                        return [
                            3,
                            28
                        ];
                    case 23:
                        _state.trys.push([
                            23,
                            ,
                            26,
                            27
                        ]);
                        if (!(_iteratorAbruptCompletion1 && _iterator1.return != null)) return [
                            3,
                            25
                        ];
                        return [
                            4,
                            _iterator1.return()
                        ];
                    case 24:
                        _state.sent();
                        _state.label = 25;
                    case 25:
                        return [
                            3,
                            27
                        ];
                    case 26:
                        if (_didIteratorError1) {
                            throw _iteratorError1;
                        }
                        return [
                            7
                        ];
                    case 27:
                        return [
                            7
                        ];
                    case 28:
                        return [
                            2,
                            result
                        ];
                }
            });
        })();
    };
    _proto.deleteMany = function deleteMany(predicate) {
        var _this = this;
        return (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
            var cacheDir, entries, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, err;
            return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.getCacheDir()
                        ];
                    case 1:
                        cacheDir = _state.sent();
                        return [
                            4,
                            _this.list()
                        ];
                    case 2:
                        entries = _state.sent();
                        _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        _state.label = 3;
                    case 3:
                        _state.trys.push([
                            3,
                            9,
                            10,
                            11
                        ]);
                        _iterator = entries[Symbol.iterator]();
                        _state.label = 4;
                    case 4:
                        if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                            3,
                            8
                        ];
                        entry = _step.value;
                        if (!predicate(entry)) return [
                            3,
                            7
                        ];
                        return [
                            4,
                            cacheDir.removeEntry(entry.name).catch(function() {
                                return undefined;
                            })
                        ];
                    case 5:
                        _state.sent();
                        return [
                            4,
                            cacheDir.removeEntry("".concat(METADATA_PREFIX).concat(entry.name)).catch(function() {
                                return undefined;
                            })
                        ];
                    case 6:
                        _state.sent();
                        _state.label = 7;
                    case 7:
                        _iteratorNormalCompletion = true;
                        return [
                            3,
                            4
                        ];
                    case 8:
                        return [
                            3,
                            11
                        ];
                    case 9:
                        err = _state.sent();
                        _didIteratorError = true;
                        _iteratorError = err;
                        return [
                            3,
                            11
                        ];
                    case 10:
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                        return [
                            7
                        ];
                    case 11:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    _proto.delete = function _delete(nameOrURL) {
        var _this = this;
        return (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
            var cacheDir, fileName, _tmp;
            return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.getCacheDir()
                        ];
                    case 1:
                        cacheDir = _state.sent();
                        if (!nameOrURL.includes("://")) return [
                            3,
                            3
                        ];
                        return [
                            4,
                            _this.urlToFileName(nameOrURL, "")
                        ];
                    case 2:
                        _tmp = _state.sent();
                        return [
                            3,
                            4
                        ];
                    case 3:
                        _tmp = nameOrURL;
                        _state.label = 4;
                    case 4:
                        fileName = _tmp;
                        return [
                            4,
                            cacheDir.removeEntry(fileName).catch(function() {
                                return undefined;
                            })
                        ];
                    case 5:
                        _state.sent();
                        return [
                            4,
                            cacheDir.removeEntry("".concat(METADATA_PREFIX).concat(fileName)).catch(function() {
                                return undefined;
                            })
                        ];
                    case 6:
                        _state.sent();
                        return [
                            2
                        ];
                }
            });
        })();
    };
    _proto.clear = function clear() {
        var _this = this;
        return (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
            return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.deleteMany(function() {
                                return true;
                            })
                        ];
                    case 1:
                        _state.sent();
                        return [
                            2
                        ];
                }
            });
        })();
    };
    return DirectOPFSCacheManager;
}();
function createDirectOPFSCacheManager() {
    try {
        var ref;
        if (typeof navigator === "undefined") return null;
        if (!(navigator === null || navigator === void 0 ? void 0 : (ref = navigator.storage) === null || ref === void 0 ? void 0 : ref.getDirectory)) return null;
        return new DirectOPFSCacheManager();
    } catch (e) {
        return null;
    }
}
var wllama = null;
var loadPromise = null;
function installWllamaWorkerOverride() {
    var ref, ref1, ref2, ref3, ref4;
    var anySelf = self;
    if (anySelf.__wllamaWorkerOverrideInstalled) return;
    var g = self;
    var getURL = ((ref = g.browser) === null || ref === void 0 ? void 0 : (ref1 = ref.runtime) === null || ref1 === void 0 ? void 0 : ref1.getURL) || ((ref2 = g.chrome) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.runtime) === null || ref3 === void 0 ? void 0 : ref3.getURL);
    var origin = (g === null || g === void 0 ? void 0 : (ref4 = g.location) === null || ref4 === void 0 ? void 0 : ref4.origin) || "";
    var withVersion = function(url) {
        return "".concat(url).concat(url.includes("?") ? "&" : "?", "v=").concat(WLLAMA_ASSET_VERSION);
    };
    var wllamaWorkerUrl = typeof getURL === "function" ? withVersion(getURL("wasm/wllama.worker.js")) : withVersion("".concat(origin, "/wasm/wllama.worker.js"));
    var opfsWorkerUrl = typeof getURL === "function" ? withVersion(getURL("wasm/wllama.opfs.worker.js")) : withVersion("".concat(origin, "/wasm/wllama.opfs.worker.js"));
    // wllama uses two blob workers:
    // - main llama.cpp worker (~70-100KB)
    // - OPFS helper worker (~4KB)
    //
    // Earlier we routed by blob size, but that is brittle across wllama versions/minifiers.
    // In a Worker context we can synchronously peek the blob header using FileReaderSync.
    var OPFS_WORKER_MAX_BYTES = 20000;
    var originalCreateObjectURL = URL.createObjectURL.bind(URL);
    anySelf.__wllamaOriginalCreateObjectURL = originalCreateObjectURL;
    anySelf.__wllamaUseWorkerOverride = false;
    URL.createObjectURL = function(blob) {
        if (!anySelf.__wllamaUseWorkerOverride) {
            return originalCreateObjectURL(blob);
        }
        try {
            var blobType = String((blob === null || blob === void 0 ? void 0 : blob.type) || "").toLowerCase();
            if ((0,_swc_helpers_src_instanceof_mjs__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(blob, Blob) && (blobType.includes("javascript") || blobType === "")) {
                var chosen;
                try {
                    // Heuristic: OPFS helper code references OPFS APIs; llama worker contains llama.cpp glue.
                    var fr = typeof self.FileReaderSync === "function" ? new self.FileReaderSync() : null;
                    var head = fr ? String(fr.readAsText(blob.slice(0, 2048))) : "";
                    // Only override blobs that look like wllama workers. Otherwise we could break unrelated libs
                    // that legitimately use Blob workers inside this Worker.
                    var isLikelyWllama = head.includes("LLAMA_CPP") || head.includes("wModuleInit") || head.includes("wllama") || head.includes("_wllama_") || head.includes("wllama_action") || head.includes("llama.cpp");
                    var isOpfs = head.includes("navigator.storage.getDirectory") || head.includes("getDirectoryHandle") || head.toLowerCase().includes("opfs");
                    // Some wllama versions/minifiers can remove our fingerprint strings.
                    // In those cases, fall back to size heuristics: OPFS workers are tiny, llama workers are ~70-100KB.
                    if (!isOpfs && !isLikelyWllama) {
                        if (blob.size <= OPFS_WORKER_MAX_BYTES) {
                            chosen = opfsWorkerUrl;
                        } else if (blob.size >= 60000) {
                            chosen = wllamaWorkerUrl;
                        } else {
                            return originalCreateObjectURL(blob);
                        }
                    } else {
                        chosen = isOpfs ? opfsWorkerUrl : wllamaWorkerUrl;
                    }
                } catch (e) {
                    // Fallback: size-based routing
                    // If we can't inspect the source, be conservative:
                    // - small blob: assume OPFS helper
                    // - very large blob: assume llama worker
                    // - otherwise: do not override
                    if (blob.size <= OPFS_WORKER_MAX_BYTES) {
                        chosen = opfsWorkerUrl;
                    } else if (blob.size >= 60000) {
                        chosen = wllamaWorkerUrl;
                    } else {
                        return originalCreateObjectURL(blob);
                    }
                }
                debugLog("wllama_worker_override", {
                    url: chosen,
                    size: blob.size,
                    kind: chosen === opfsWorkerUrl ? "opfs" : "llama"
                });
                return chosen;
            }
        } catch (e1) {
        // ignore
        }
        return originalCreateObjectURL(blob);
    };
    anySelf.__wllamaWorkerOverrideInstalled = true;
}
function setWllamaWorkerOverrideEnabled(enabled) {
    var anySelf = self;
    if (enabled) {
        installWllamaWorkerOverride();
        anySelf.__wllamaUseWorkerOverride = true;
        return;
    }
    // Keep native blob-worker path untouched unless override is explicitly enabled.
    if (anySelf.__wllamaWorkerOverrideInstalled) {
        anySelf.__wllamaUseWorkerOverride = false;
    }
}
function resolveWasmPaths() {
    var ref, ref1, ref2, ref3, ref4;
    var g = self;
    var getURL = ((ref = g.browser) === null || ref === void 0 ? void 0 : (ref1 = ref.runtime) === null || ref1 === void 0 ? void 0 : ref1.getURL) || ((ref2 = g.chrome) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.runtime) === null || ref3 === void 0 ? void 0 : ref3.getURL);
    var origin = (g === null || g === void 0 ? void 0 : (ref4 = g.location) === null || ref4 === void 0 ? void 0 : ref4.origin) || "";
    var withVersion = function(url) {
        return "".concat(url).concat(url.includes("?") ? "&" : "?", "v=").concat(WLLAMA_ASSET_VERSION);
    };
    var single = typeof getURL === "function" ? withVersion(getURL("wasm/wllama-single.wasm")) : withVersion("".concat(origin, "/wasm/wllama-single.wasm"));
    // Only expose the multi-thread build if the environment is actually capable of using it.
    // In Firefox MV3 (and many extension contexts), SharedArrayBuffer is unavailable, which causes
    // wllama to probe multi-thread and trip CSP / blob-worker restrictions.
    var canUseMultiThread = typeof self.SharedArrayBuffer !== "undefined" && self.crossOriginIsolated === true;
    if (!canUseMultiThread) {
        return {
            "single-thread/wllama.wasm": single
        };
    }
    var multi = typeof getURL === "function" ? withVersion(getURL("wasm/wllama-multi.wasm")) : withVersion("".concat(origin, "/wasm/wllama-multi.wasm"));
    return {
        "single-thread/wllama.wasm": single,
        "multi-thread/wllama.wasm": multi
    };
}
function ensureLoaded() {
    return _ensureLoaded.apply(this, arguments);
}
function _ensureLoaded() {
    _ensureLoaded = (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
        var modelUrl, init, errorMessage, isBlobCspError, isOverrideNetworkError;
        var _arguments = arguments;
        return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    modelUrl = _arguments.length > 0 && _arguments[0] !== void 0 ? _arguments[0] : DEFAULT_MODEL_URL;
                    if (wllama && wllama.isModelLoaded()) return [
                        2,
                        wllama
                    ];
                    if (!loadPromise) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        loadPromise
                    ];
                case 1:
                    _state.sent();
                    if (!wllama) throw new Error("SLM init failed");
                    return [
                        2,
                        wllama
                    ];
                case 2:
                    init = function() {
                        var _ref = (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function(opts) {
                            var anySelf, ref, wasmPaths, directCacheManager, name, size, e, hasCachedModel, name1, size1, err;
                            return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        anySelf = self;
                                        if (!anySelf.document) {
                                            ;
                                            anySelf.document = {
                                                baseURI: ((ref = self.location) === null || ref === void 0 ? void 0 : ref.href) || ""
                                            };
                                        }
                                        // Prefer native blob workers (fast path). In Firefox MV3, CSP may block blob: workers depending on
                                        // the manifest CSP. If that happens, we fall back to a physical worker file override.
                                        setWllamaWorkerOverrideEnabled(!!opts.forceWorkerOverride);
                                        if (opts.forceWorkerOverride) {
                                            debugLog("override_enabled", {
                                                workerOverride: true
                                            });
                                        }
                                        wasmPaths = resolveWasmPaths();
                                        debugLog("wllama_wasm_paths", wasmPaths);
                                        debugLog("init_start", {
                                            model: modelUrl
                                        });
                                        directCacheManager = createDirectOPFSCacheManager();
                                        wllama = new _wllama_wllama_esm__WEBPACK_IMPORTED_MODULE_0__.Wllama(wasmPaths, {
                                            cacheManager: directCacheManager || undefined,
                                            allowOffline: true,
                                            logger: {
                                                debug: function() {
                                                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                                                        args[_key] = arguments[_key];
                                                    }
                                                    return debugLog("logger_debug", {
                                                        args: args.map(function(a) {
                                                            return String(a);
                                                        })
                                                    });
                                                },
                                                log: function() {
                                                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                                                        args[_key] = arguments[_key];
                                                    }
                                                    return debugLog("logger_log", {
                                                        args: args.map(function(a) {
                                                            return String(a);
                                                        })
                                                    });
                                                },
                                                warn: function() {
                                                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                                                        args[_key] = arguments[_key];
                                                    }
                                                    return debugLog("logger_warn", {
                                                        args: args.map(function(a) {
                                                            try {
                                                                return typeof a === "object" ? JSON.stringify(a) : String(a);
                                                            } catch (e) {
                                                                return String(a);
                                                            }
                                                        })
                                                    });
                                                },
                                                error: function() {
                                                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                                                        args[_key] = arguments[_key];
                                                    }
                                                    return debugLog("logger_error", {
                                                        args: args.map(function(a) {
                                                            return String(a);
                                                        })
                                                    });
                                                }
                                            }
                                        });
                                        _state.label = 1;
                                    case 1:
                                        _state.trys.push([
                                            1,
                                            4,
                                            ,
                                            5
                                        ]);
                                        return [
                                            4,
                                            wllama.cacheManager.getNameFromURL(modelUrl)
                                        ];
                                    case 2:
                                        name = _state.sent();
                                        return [
                                            4,
                                            wllama.cacheManager.getSize(name)
                                        ];
                                    case 3:
                                        size = _state.sent();
                                        if (size > 0) {
                                            debugLog("cache_hit", {
                                                name: name,
                                                size: size
                                            });
                                        }
                                        return [
                                            3,
                                            5
                                        ];
                                    case 4:
                                        e = _state.sent();
                                        return [
                                            3,
                                            5
                                        ];
                                    case 5:
                                        if (!directCacheManager) return [
                                            3,
                                            12
                                        ];
                                        hasCachedModel = false;
                                        _state.label = 6;
                                    case 6:
                                        _state.trys.push([
                                            6,
                                            9,
                                            ,
                                            10
                                        ]);
                                        return [
                                            4,
                                            directCacheManager.getNameFromURL(modelUrl)
                                        ];
                                    case 7:
                                        name1 = _state.sent();
                                        return [
                                            4,
                                            directCacheManager.getSize(name1)
                                        ];
                                    case 8:
                                        size1 = _state.sent();
                                        hasCachedModel = size1 > 0;
                                        return [
                                            3,
                                            10
                                        ];
                                    case 9:
                                        err = _state.sent();
                                        debugLog("cache_probe_failed", {
                                            message: (0,_swc_helpers_src_instanceof_mjs__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(err, Error) ? err.message : String(err)
                                        });
                                        return [
                                            3,
                                            10
                                        ];
                                    case 10:
                                        if (!!hasCachedModel) return [
                                            3,
                                            12
                                        ];
                                        debugLog("download_start", {
                                            model: modelUrl
                                        });
                                        return [
                                            4,
                                            directCacheManager.download(modelUrl, {
                                                progressCallback: function(param) {
                                                    var loaded = param.loaded, total = param.total;
                                                    var pct = total ? loaded / total * 100 : 0;
                                                    self.postMessage({
                                                        type: "slm-progress",
                                                        data: {
                                                            status: "progress",
                                                            file: "gguf",
                                                            progress: pct,
                                                            loaded: loaded,
                                                            total: total
                                                        }
                                                    });
                                                }
                                            })
                                        ];
                                    case 11:
                                        _state.sent();
                                        debugLog("download_complete", {
                                            model: modelUrl
                                        });
                                        try {
                                            self.postMessage({
                                                type: "slm-debug",
                                                data: {
                                                    message: "download_complete",
                                                    model: modelUrl
                                                }
                                            });
                                        } catch (e1) {
                                        // ignore
                                        }
                                        _state.label = 12;
                                    case 12:
                                        return [
                                            4,
                                            wllama.loadModelFromUrl(modelUrl, {
                                                n_ctx: MODEL_CTX,
                                                // Firefox MV3 does not expose SharedArrayBuffer without COOP/COEP, so multi-thread wasm is not reliable.
                                                n_threads: 1,
                                                progressCallback: function(param) {
                                                    var loaded = param.loaded, total = param.total;
                                                    var pct = total ? loaded / total * 100 : 0;
                                                    self.postMessage({
                                                        type: "slm-progress",
                                                        data: {
                                                            status: "progress",
                                                            file: "gguf",
                                                            progress: pct,
                                                            loaded: loaded,
                                                            total: total
                                                        }
                                                    });
                                                    if (pct === 100) {
                                                        debugLog("download_complete", {
                                                            loaded: loaded,
                                                            total: total
                                                        });
                                                    }
                                                }
                                            })
                                        ];
                                    case 13:
                                        _state.sent();
                                        debugLog("ready");
                                        self.postMessage({
                                            type: "slm-ready"
                                        });
                                        return [
                                            2
                                        ];
                                }
                            });
                        });
                        return function init(opts) {
                            return _ref.apply(this, arguments);
                        };
                    }();
                    errorMessage = function(err) {
                        return (0,_swc_helpers_src_instanceof_mjs__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(err, Error) ? err.message : String(err || "");
                    };
                    isBlobCspError = function(msg) {
                        var lower = msg.toLowerCase();
                        return lower.includes("blob:") && lower.includes("content-security-policy") || lower.includes("blob:") && lower.includes("worker-src") || lower.includes("blob:") && lower.includes("script-src") || lower.includes("blob") && lower.includes("refused to create") || lower.includes("blob") && lower.includes("failed to construct");
                    };
                    isOverrideNetworkError = function(msg) {
                        return msg.includes("NetworkError") || msg.includes("failed to asynchronously prepare wasm") || msg.includes("Aborted(NetworkError") || msg.includes("wasm streaming compile failed");
                    };
                    loadPromise = (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
                        var err, msg, err1, msg1;
                        return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    _state.trys.push([
                                        0,
                                        2,
                                        ,
                                        3
                                    ]);
                                    return [
                                        4,
                                        init({
                                            forceWorkerOverride: false
                                        })
                                    ];
                                case 1:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                                case 2:
                                    err = _state.sent();
                                    msg = errorMessage(err);
                                    if (!ENABLE_WLLAMA_WORKER_OVERRIDE_FALLBACK) throw err;
                                    if (!isBlobCspError(msg) && !IS_FIREFOX) throw err;
                                    if (!isBlobCspError(msg) && IS_FIREFOX) {
                                        // If it's Firefox but not clearly CSP-related, keep original error for diagnostics.
                                        throw err;
                                    }
                                    debugLog("retry_with_override", {
                                        reason: "csp_blob_worker_blocked",
                                        message: msg
                                    });
                                    wllama = null;
                                    return [
                                        3,
                                        3
                                    ];
                                case 3:
                                    _state.trys.push([
                                        3,
                                        5,
                                        ,
                                        8
                                    ]);
                                    return [
                                        4,
                                        init({
                                            forceWorkerOverride: true
                                        })
                                    ];
                                case 4:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                                case 5:
                                    err1 = _state.sent();
                                    msg1 = errorMessage(err1);
                                    if (!isOverrideNetworkError(msg1)) return [
                                        3,
                                        7
                                    ];
                                    // Attempt 3: if override path cannot fetch wasm in this environment, retry native path once.
                                    debugLog("retry_without_override", {
                                        reason: "override_network_error"
                                    });
                                    wllama = null;
                                    return [
                                        4,
                                        init({
                                            forceWorkerOverride: false
                                        })
                                    ];
                                case 6:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                                case 7:
                                    throw err1;
                                case 8:
                                    return [
                                        2
                                    ];
                            }
                        });
                    })().finally(function() {
                        loadPromise = null;
                    });
                    return [
                        4,
                        loadPromise
                    ];
                case 3:
                    _state.sent();
                    if (!wllama) throw new Error("SLM init failed");
                    return [
                        2,
                        wllama
                    ];
            }
        });
    });
    return _ensureLoaded.apply(this, arguments);
}
// ----------------------------------------------------------------------------
// SLM prompts
// ----------------------------------------------------------------------------
function historyToText(history) {
    var turns = (history || []).slice(-MAX_HISTORY_TURNS);
    return turns.map(function(m) {
        return "".concat(m.role.toUpperCase(), ": ").concat(compactText(m.content).slice(0, MAX_HISTORY_CHARS_PER_TURN));
    }).join("\n").trim();
}
function runRewrite(llm, query, history) {
    return _runRewrite.apply(this, arguments);
}
function _runRewrite() {
    _runRewrite = (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function(llm, query, history) {
        var convo, userMsg, system, user, out;
        return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    convo = historyToText(history);
                    userMsg = compactText(query);
                    system = "Rewrite the user message into a standalone question for retrieval.\n" + "Rules:\n" + "- Preserve the original language (respond in the SAME language as the user message).\n" + "- Use the conversation only to resolve pronouns/ellipses.\n" + "- Output ONLY the rewritten question (no quotes, no markdown).\n";
                    user = "Conversation (most recent last):\n".concat(convo || "(empty)", "\n\n") + "User message:\n".concat(userMsg, "\n\n") + "Standalone question:";
                    return [
                        4,
                        llm.createChatCompletion([
                            {
                                role: "system",
                                content: system
                            },
                            {
                                role: "user",
                                content: user
                            }
                        ], {
                            nPredict: 96,
                            sampling: {
                                temp: 0.2,
                                top_p: 0.9
                            }
                        })
                    ];
                case 1:
                    out = _state.sent();
                    return [
                        2,
                        String(out || "").replace(/^["']|["']$/g, "").trim()
                    ];
            }
        });
    });
    return _runRewrite.apply(this, arguments);
}
function runClassify(llm, query, history) {
    return _runClassify.apply(this, arguments);
}
function _runClassify() {
    _runClassify = (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function(llm, query, history) {
        var ref, convo, userMsg, system, user, out, parsed, intents, primaryQueryRaw, primaryQuery;
        return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    convo = historyToText(history);
                    userMsg = compactText(query);
                    system = "You are an intent router for an ebook reader RAG system.\n" + "Return ONLY valid JSON (no markdown) with this schema:\n" + '{ "primaryQuery": string, "intents": [ { "type": string, "query": string } ] }\n' + "Rules:\n" + "- Language: keep the SAME language as the user message.\n" + "- Multi-intent: include multiple intents if present.\n" + "- Allowed types: question, explain, summarize, define, analyze, concept, general.\n" + "- Each intent query MUST be standalone.\n";
                    user = "Conversation (most recent last):\n".concat(convo || "(empty)", "\n\n") + "User message:\n".concat(userMsg, "\n\n") + "JSON:";
                    return [
                        4,
                        llm.createChatCompletion([
                            {
                                role: "system",
                                content: system
                            },
                            {
                                role: "user",
                                content: user
                            }
                        ], {
                            nPredict: 220,
                            sampling: {
                                temp: 0.2,
                                top_p: 0.9
                            }
                        })
                    ];
                case 1:
                    out = _state.sent();
                    parsed = safeJsonParse(out);
                    if (!parsed || !Array.isArray(parsed.intents)) {
                        // Minimal fallback: treat as a single question.
                        return [
                            2,
                            {
                                primaryQuery: userMsg,
                                intents: [
                                    {
                                        type: "question",
                                        query: userMsg
                                    }
                                ]
                            }
                        ];
                    }
                    intents = (parsed.intents || []).map(function(i) {
                        return {
                            type: String((i === null || i === void 0 ? void 0 : i.type) || "general"),
                            query: String((i === null || i === void 0 ? void 0 : i.query) || "").trim()
                        };
                    }).filter(function(i) {
                        return i.query.length > 0;
                    });
                    primaryQueryRaw = typeof parsed.primaryQuery === "string" ? String(parsed.primaryQuery) : "";
                    primaryQuery = (primaryQueryRaw.trim() || ((ref = intents[0]) === null || ref === void 0 ? void 0 : ref.query) || userMsg).trim();
                    return [
                        2,
                        {
                            primaryQuery: primaryQuery,
                            intents: intents.length ? intents : [
                                {
                                    type: "question",
                                    query: primaryQuery
                                }
                            ]
                        }
                    ];
            }
        });
    });
    return _runClassify.apply(this, arguments);
}
// ----------------------------------------------------------------------------
// Request serialization (llama.cpp contexts are not re-entrant)
// ----------------------------------------------------------------------------
var queue = Promise.resolve();
function enqueue(fn) {
    var next = queue.then(fn, fn);
    // keep queue alive even on errors
    queue = next.then(function() {
        return undefined;
    }, function() {
        return undefined;
    });
    return next;
}
self.onmessage = function(e) {
    var msg = e.data;
    if (!msg || typeof msg.id !== "number") return;
    var id = msg.id;
    // Preload is a UX trigger ("start warming up"), not a transactional request.
    // Reply immediately so the UI never flips to error just because init is slow.
    if (msg.type === "preload") {
        void enqueue(/*#__PURE__*/ (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
            var err;
            return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        // Important: await so preload failures surface as `slm-error`.
                        // Without await, rejected init/download promises can be swallowed and
                        // UI may stay forever in "downloading".
                        return [
                            4,
                            ensureLoaded(DEFAULT_MODEL_URL)
                        ];
                    case 1:
                        _state.sent();
                        return [
                            3,
                            3
                        ];
                    case 2:
                        err = _state.sent();
                        postError(null, err, "preload", false);
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        }));
        try {
            self.postMessage({
                id: id,
                ok: true
            });
        } catch (e1) {
        // ignore
        }
        return;
    }
    void enqueue(/*#__PURE__*/ (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
        var llm, text, payload, err;
        return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        6,
                        ,
                        7
                    ]);
                    return [
                        4,
                        ensureLoaded(DEFAULT_MODEL_URL)
                    ];
                case 1:
                    llm = _state.sent();
                    if (!(msg.type === "rewrite")) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        runRewrite(llm, msg.query, msg.history || [])
                    ];
                case 2:
                    text = _state.sent();
                    self.postMessage({
                        id: id,
                        text: text
                    });
                    return [
                        2
                    ];
                case 3:
                    if (!(msg.type === "classify")) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        runClassify(llm, msg.query, msg.history || [])
                    ];
                case 4:
                    payload = _state.sent();
                    self.postMessage({
                        id: id,
                        payload: payload
                    });
                    return [
                        2
                    ];
                case 5:
                    return [
                        3,
                        7
                    ];
                case 6:
                    err = _state.sent();
                    postError(id, err, msg.type, false);
                    return [
                        3,
                        7
                    ];
                case 7:
                    return [
                        2
                    ];
            }
        });
    }));
};


/***/ }),

/***/ 918:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _assertThisInitialized; }
/* harmony export */ });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}


/***/ }),

/***/ 3203:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _construct; }
/* harmony export */ });
/* harmony import */ var _set_prototype_of_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5398);


function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () { }));
    return true;
  } catch (e) {
    return false;
  }
}

function construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    construct = Reflect.construct;
  } else {
    construct = function construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) (0,_set_prototype_of_mjs__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(instance, Class.prototype);
      return instance;
    };
  }

  return construct.apply(null, arguments);
}

function _construct(Parent, args, Class) {
  return construct.apply(null, arguments);
}


/***/ }),

/***/ 9648:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
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

/***/ 4802:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": function() { return /* binding */ _createSuper; }
});

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_is_native_reflect_construct.mjs
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () { }));
        return true;
    } catch (e) {
        return false;
    }
}
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_get_prototype_of.mjs
var _get_prototype_of = __webpack_require__(8216);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_assert_this_initialized.mjs
var _assert_this_initialized = __webpack_require__(918);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_type_of.mjs
var _type_of = __webpack_require__(4167);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_possible_constructor_return.mjs



function _possibleConstructorReturn(self, call) {
  if (call && ((0,_type_of/* default */.Z)(call) === "object" || typeof call === "function")) {
    return call;
  }

  return (0,_assert_this_initialized/* default */.Z)(self);
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_create_super.mjs




function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = (0,_get_prototype_of/* default */.Z)(Derived),
            result;
        if (hasNativeReflectConstruct) {
            var NewTarget = (0,_get_prototype_of/* default */.Z)(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}

/***/ }),

/***/ 8216:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _getPrototypeOf; }
/* harmony export */ });
function getPrototypeOf(o) {
  getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return getPrototypeOf(o);
}

function _getPrototypeOf(o) {
  return getPrototypeOf(o);
}

/***/ }),

/***/ 3459:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _inherits; }
/* harmony export */ });
/* harmony import */ var _set_prototype_of_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5398);


function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) (0,_set_prototype_of_mjs__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(subClass, superClass);
}


/***/ }),

/***/ 5398:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _setPrototypeOf; }
/* harmony export */ });
function setPrototypeOf(o, p) {
  setPrototypeOf = Object.setPrototypeOf || function setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return setPrototypeOf(o, p);
}

function _setPrototypeOf(o, p) {
  return setPrototypeOf(o, p);
}


/***/ }),

/***/ 6071:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": function() { return /* binding */ _wrapNativeSuper; }
});

// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_construct.mjs
var _construct = __webpack_require__(3203);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_is_native_function.mjs
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_get_prototype_of.mjs
var _get_prototype_of = __webpack_require__(8216);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_set_prototype_of.mjs
var _set_prototype_of = __webpack_require__(5398);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_wrap_native_super.mjs





function wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  wrapNativeSuper = function wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return (0,_construct/* default */.Z)(Class, arguments, (0,_get_prototype_of/* default */.Z)(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return (0,_set_prototype_of/* default */.Z)(Wrapper, Class);
  };

  return wrapNativeSuper(Class);
}

function _wrapNativeSuper(Class) {
  return wrapNativeSuper(Class);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = function() {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, [72,71], function() { return __webpack_require__(1514); })
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	!function() {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = function(chunkId) {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce(function(promises, key) {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return "static/chunks/" + (chunkId === 72 ? "0bfbc5eb" : chunkId) + "." + {"71":"ccc3b2e787f0aa0e","72":"95f272e86485c9a6"}[chunkId] + ".js";
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.miniCssF = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	!function() {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = function() {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScriptURL: function(url) { return url; }
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script url */
/******/ 	!function() {
/******/ 		__webpack_require__.tu = function(url) { return __webpack_require__.tt().createScriptURL(url); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "/Lumen-Read//_next/";
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			441: 1,
/******/ 			892: 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = function(data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = function(chunkId, promises) {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.tu(__webpack_require__.p + __webpack_require__.u(chunkId)));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	!function() {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = function() {
/******/ 			return Promise.all([
/******/ 				__webpack_require__.e(72),
/******/ 				__webpack_require__.e(71)
/******/ 			]).then(next);
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	_N_E = __webpack_exports__;
/******/ 	
/******/ })()
;