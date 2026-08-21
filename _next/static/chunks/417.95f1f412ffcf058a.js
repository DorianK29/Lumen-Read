"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[417],{

/***/ 417:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {


// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_async_iterator.mjs
var _async_iterator = __webpack_require__(6131);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_async_to_generator.mjs
var _async_to_generator = __webpack_require__(947);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_class_call_check.mjs
var _class_call_check = __webpack_require__(4656);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_instanceof.mjs
var _instanceof = __webpack_require__(8149);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_object_spread.mjs
var _object_spread = __webpack_require__(6690);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_sliced_to_array.mjs + 2 modules
var _sliced_to_array = __webpack_require__(1296);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_to_consumable_array.mjs + 2 modules
var _to_consumable_array = __webpack_require__(8417);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_type_of.mjs
var _type_of = __webpack_require__(4167);
// EXTERNAL MODULE: ../../node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(2336);
;// CONCATENATED MODULE: ./src/lib/ai/config.ts
var AI_CONFIG = {
    embeddingModel: "Xenova/all-MiniLM-L6-v2",
    // Firefox MV3 SOTA: wllama + E5-Large-Instruct (Best Multilingual)
    embeddingModelFirefox: "Ralriki/multilingual-e5-large-instruct-GGUF@8738f8d:q6_k",
    embeddingModelFirefoxUrl: "https://huggingface.co/Ralriki/multilingual-e5-large-instruct-GGUF/resolve/8738f8d3d8f311808479ecd5756607e24c6ca811/multilingual-e5-large-instruct-q6_k.gguf",
    embeddingModelFirefoxBytes: 467958912,
    embeddingModelFirefoxSha256: "971b20b033a555f920bad72941123f48b470a2fa676abdb713e5dc8605ea15a4",
    embeddingModelFirefoxPrefixes: {
        query: "query: ",
        document: "passage: "
    },
    embeddingDimFirefox: 768,
    embeddingDim: 384,
    chunkSize: 1000,
    chunkOverlap: 200,
    vectorStoreName: "lumen-vectors",
    ragVersion: 3.1
};
// Bump this whenever local model consent needs to be re-collected. It makes
// upgrades safe even when an older version had downloads enabled by default.
var LOCAL_MODEL_CONSENT_VERSION = 1;
function isCloudAIProvider(provider) {
    return provider !== "local";
}
var DEFAULT_AI_SETTINGS = {
    provider: "gemini",
    apiKey: "",
    model: "",
    temperature: 0.7,
    systemPrompt: "You are a helpful assistant answering questions about the book. Use the provided context to answer accurately.",
    autoPersona: false,
    insightTriggers: false,
    deepThink: false,
    explainSelection: true,
    summarizeSelection: true,
    answerDepth: "balanced",
    aiScope: "book_only",
    downloadLocalModels: false,
    localModelConsentVersion: 0,
    remoteDataConsent: false,
    remoteDataConsentProvider: "",
    includeAnnotationsInRemotePrompts: false,
    includeDefinitionsInRemotePrompts: false,
    autoRepairCitations: false
};

;// CONCATENATED MODULE: ./src/lib/ai/rag.worker.ts
/// <reference lib="webworker" />









var ref, ref1, ref2, ref3;

var DEBUG_EMBED = "production" !== "production";
var WLLAMA_ASSET_VERSION = "20260204a";
var ENABLE_WLLAMA_WORKER_OVERRIDE_FALLBACK = false;
// Xenova/all-MiniLM-L6-v2 produces 384-dim sentence embeddings.
// Note: multilingual-e5-base produces 768-dim; large produces 1024-dim.
var ONNX_DIM = 384;
var E5_LARGE_DIM = 1024;
var FIREFOX_ML_MODEL_ID = "Xenova/multilingual-e5-base" // Default model ID for Native ML delegation
;
var FIREFOX_DELEGATE_MAX_BATCH_SIZE = 24;
var FIREFOX_DELEGATE_MIN_BATCH_SIZE = 8;
var FIREFOX_DELEGATE_MAX_BATCH_CHARS = 9500;
var FIREFOX_DELEGATE_TIMEOUT_SINGLE_MS = 300000;
var FIREFOX_DELEGATE_TIMEOUT_BASE_MS = 120000;
var FIREFOX_DELEGATE_TIMEOUT_PER_ITEM_MS = 6000;
var FIREFOX_DELEGATE_TIMEOUT_PER_1K_CHARS_MS = 9000;
var WLLAMA_EMBED_MODEL_URL = AI_CONFIG.embeddingModelFirefoxUrl;
var TOKEN_PRECHUNK_TARGET_TOKENS = 220;
var TOKEN_PRECHUNK_MIN_TOKENS = 120;
var TOKEN_PRECHUNK_MAX_TOKENS = 320;
var TOKEN_PRECHUNK_OVERLAP_TOKENS = 24;
var TOKEN_PRECHUNK_HARD_MAX_CHARS = 1800;
var ENABLE_TOKEN_AWARE_PRECHUNKING = true;
var SEMANTIC_MERGE_THRESHOLD_FLOOR = 0.42;
var SEMANTIC_MERGE_THRESHOLD_CEIL = 0.62;
var SEMANTIC_MERGE_THRESHOLD_DEFAULT = 0.5;
var SEMANTIC_MERGE_MAX_TOKENS = 420;
var SEMANTIC_MERGE_MAX_CHARS = 2500;
// EXPERIMENTAL: WebGPU model for 15-30x faster embeddings (Firefox 147+)
// Keep WebGPU path aligned with Firefox Native ML default model family.
var WEBGPU_EMBED_MODEL = "Xenova/multilingual-e5-base";
var yieldToWorker = function() {
    return new Promise(function(resolve) {
        return setTimeout(resolve, 0);
    });
};
var isFirefox = typeof navigator !== "undefined" && /Firefox/i.test(navigator.userAgent || "");
function hasWebGPU() {
    return _hasWebGPU.apply(this, arguments);
}
function _hasWebGPU() {
    _hasWebGPU = // EXPERIMENTAL: WebGPU detection for GPU-accelerated embeddings
    (0,_async_to_generator/* default */.Z)(function() {
        var gpu, ref, adapter, info, err;
        return (0,tslib_es6.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log("[RAG WORKER] Checking WebGPU availability...");
                    console.log("[RAG WORKER] isSecureContext:", typeof isSecureContext !== "undefined" ? isSecureContext : "unknown");
                    console.log("[RAG WORKER] User Agent:", typeof navigator !== "undefined" ? navigator.userAgent : "unknown");
                    if (typeof navigator === "undefined" || !navigator.gpu) {
                        console.log("[RAG WORKER] \xe2\x9dŒ navigator.gpu is undefined");
                        return [
                            2,
                            false
                        ];
                    }
                    gpu = navigator.gpu;
                    console.log("[RAG WORKER] navigator.gpu exists, requesting adapter...");
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        8,
                        ,
                        9
                    ]);
                    return [
                        4,
                        gpu.requestAdapter()
                    ];
                case 2:
                    adapter = _state.sent();
                    if (!!adapter) return [
                        3,
                        4
                    ];
                    console.log("[RAG WORKER] \xe2š\xa0\xef\xb8\x8f navigator.gpu.requestAdapter() returned null (Standard)");
                    console.log("[RAG WORKER] Trying with powerPreference: low-power...");
                    return [
                        4,
                        gpu.requestAdapter({
                            powerPreference: "low-power"
                        })
                    ];
                case 3:
                    adapter = _state.sent();
                    _state.label = 4;
                case 4:
                    if (!!adapter) return [
                        3,
                        6
                    ];
                    console.log("[RAG WORKER] \xe2š\xa0\xef\xb8\x8f navigator.gpu.requestAdapter() returned null (Low-Power)");
                    console.log("[RAG WORKER] Trying with powerPreference: high-performance...");
                    return [
                        4,
                        gpu.requestAdapter({
                            powerPreference: "high-performance"
                        })
                    ];
                case 5:
                    adapter = _state.sent();
                    _state.label = 6;
                case 6:
                    if (!adapter) {
                        console.log("[RAG WORKER] \xe2\x9dŒ WebGPU adapter still null after all attempts");
                        return [
                            2,
                            false
                        ];
                    }
                    return [
                        4,
                        (ref = adapter.requestAdapterInfo) === null || ref === void 0 ? void 0 : ref.call(adapter)
                    ];
                case 7:
                    info = _state.sent() || {};
                    console.log("[RAG WORKER] \xe2œ… WebGPU Adapter found:", {
                        vendor: info.vendor,
                        architecture: info.architecture,
                        device: info.device,
                        description: info.description
                    });
                    return [
                        2,
                        true
                    ];
                case 8:
                    err = _state.sent();
                    console.error("[RAG WORKER] \xe2\x9dŒ Fatal error requesting WebGPU adapter:", (err === null || err === void 0 ? void 0 : err.message) || err);
                    return [
                        2,
                        false
                    ];
                case 9:
                    return [
                        2
                    ];
            }
        });
    });
    return _hasWebGPU.apply(this, arguments);
}
function hasFirefoxNativeML() {
    return _hasFirefoxNativeML.apply(this, arguments);
}
function _hasFirefoxNativeML() {
    _hasFirefoxNativeML = // EXPERIMENTAL: Firefox Native ML API detection (2-10x faster than WASM)
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/trial/ml
    (0,_async_to_generator/* default */.Z)(function() {
        var ref, ref1, g, browserApi;
        return (0,tslib_es6.__generator)(this, function(_state) {
            try {
                ;
                g = self;
                browserApi = g.browser || g.chrome;
                if (!browserApi) {
                    // Expected in worker context without special polyfills
                    return [
                        2,
                        false
                    ];
                }
                if (!((ref = browserApi.trial) === null || ref === void 0 ? void 0 : (ref1 = ref.ml) === null || ref1 === void 0 ? void 0 : ref1.createEngine)) {
                    return [
                        2,
                        false
                    ];
                }
                return [
                    2,
                    true
                ];
            } catch (err) {
                return [
                    2,
                    false
                ];
            }
            return [
                2
            ];
        });
    });
    return _hasFirefoxNativeML.apply(this, arguments);
}
var firefoxMLEngine = null;
var embedder = null;
var wllama = null;
var wllamaLoadPromise = null;
var wllamaEmbedModelUrl = WLLAMA_EMBED_MODEL_URL;
var backend = null;
var voyChunks = null;
var voyChapters = null;
var initialized = false;
var cancelled = false;
var itemsAdded = 0;
var embeddingModel = "";
var embedDim = ONNX_DIM;
var outputDim = ONNX_DIM;
var targetDim = null;
var voyAcceptsTypedArrays = false;
var skippedSections = [];
var currentLocale = "en";
var embeddingPrefixQuery = "";
var embeddingPrefixDocument = "";
var liteMode = false // PHASE 2: Lite mode skips embedding for instant import
;
var firefoxDelegate = false;
var allowLocalModelDownloads = true;
var nextEmbedId = 1;
var pendingEmbeddings = new Map();
var pendingEmbedBatch = new Map();
var transformersPromise = null;
function getTransformers() {
    return _getTransformers.apply(this, arguments);
}
function _getTransformers() {
    _getTransformers = (0,_async_to_generator/* default */.Z)(function() {
        return (0,tslib_es6.__generator)(this, function(_state) {
            if (!transformersPromise) {
                transformersPromise = Promise.all(/* import() */[__webpack_require__.e(768), __webpack_require__.e(546), __webpack_require__.e(621), __webpack_require__.e(396), __webpack_require__.e(80)]).then(__webpack_require__.bind(__webpack_require__, 1693));
            }
            return [
                2,
                transformersPromise
            ];
        });
    });
    return _getTransformers.apply(this, arguments);
}
function debugLog(message, data) {
    if (!DEBUG_EMBED) return;
    try {
        self.postMessage({
            type: "embedding-debug",
            data: (0,_object_spread/* default */.Z)({
                message: message
            }, data || {})
        });
    } catch (e) {
    // ignore debug post errors
    }
}
var METADATA_PREFIX = "__metadata__";
var DirectOPFSCacheManager = /*#__PURE__*/ function() {
    "use strict";
    function DirectOPFSCacheManager() {
        (0,_class_call_check/* default */.Z)(this, DirectOPFSCacheManager);
    }
    var _proto = DirectOPFSCacheManager.prototype;
    _proto.getCacheDir = function getCacheDir() {
        return (0,_async_to_generator/* default */.Z)(function() {
            var storage, opfsRoot;
            return (0,tslib_es6.__generator)(this, function(_state) {
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
        return (0,_async_to_generator/* default */.Z)(function() {
            var hashBuffer, hashArray, hashHex;
            return (0,tslib_es6.__generator)(this, function(_state) {
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
        return (0,_async_to_generator/* default */.Z)(function() {
            var ref, cacheDir, fileHandle, writable, accessHandle, buf;
            return (0,tslib_es6.__generator)(this, function(_state) {
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
        return (0,_async_to_generator/* default */.Z)(function() {
            var cacheDir, fileHandle, reader, syncHandle, _tmp, writable, _tmp1, offset, done, chunk, value;
            return (0,tslib_es6.__generator)(this, function(_state) {
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
        return (0,_async_to_generator/* default */.Z)(function() {
            var ref, filename, metadataFileName, cacheDir, fileHandle, response, total, etag, reader, syncHandle, _tmp, writable, _tmp1, loaded, done, ref1, chunk, value;
            return (0,tslib_es6.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        debugLog("download_start", {
                            url: url
                        });
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
                        debugLog("download_response", {
                            status: response.status
                        });
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
                        debugLog("download_complete", {
                            loaded: loaded,
                            total: total || loaded
                        });
                        return [
                            2
                        ];
                }
            });
        })();
    };
    _proto.getNameFromURL = function getNameFromURL(url) {
        var _this = this;
        return (0,_async_to_generator/* default */.Z)(function() {
            return (0,tslib_es6.__generator)(this, function(_state) {
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
        return (0,_async_to_generator/* default */.Z)(function() {
            var cacheDir, fileName, _tmp, fileHandle, file, e, name, _tmp1;
            return (0,tslib_es6.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            7,
                            ,
                            11
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
                        debugLog("cache_hit", {
                            name: fileName,
                            size: (file === null || file === void 0 ? void 0 : file.size) || 0
                        });
                        return [
                            2,
                            file || null
                        ];
                    case 7:
                        e = _state.sent();
                        if (!nameOrURL.includes("://")) return [
                            3,
                            9
                        ];
                        return [
                            4,
                            _this.urlToFileName(nameOrURL, "").catch(function() {
                                return nameOrURL;
                            })
                        ];
                    case 8:
                        _tmp1 = _state.sent();
                        return [
                            3,
                            10
                        ];
                    case 9:
                        _tmp1 = nameOrURL;
                        _state.label = 10;
                    case 10:
                        name = _tmp1;
                        debugLog("cache_miss", {
                            name: name
                        });
                        return [
                            2,
                            null
                        ];
                    case 11:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    _proto.getSize = function getSize(nameOrURL) {
        var _this = this;
        return (0,_async_to_generator/* default */.Z)(function() {
            var file, e;
            return (0,tslib_es6.__generator)(this, function(_state) {
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
        return (0,_async_to_generator/* default */.Z)(function() {
            var cacheDir, fileName, _tmp, metaHandle, file, json, e;
            return (0,tslib_es6.__generator)(this, function(_state) {
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
        return (0,_async_to_generator/* default */.Z)(function() {
            var cacheDir, result, metadataMap, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, __value, name, handler, file, meta, err, _iteratorAbruptCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, _value1, __value1, name1, handler1, file1, meta1, err1;
            return (0,tslib_es6.__generator)(this, function(_state) {
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
                        _iterator = (0,_async_iterator/* default */.Z)(cacheDir.entries());
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
                        __value = (0,_sliced_to_array/* default */.Z)(_value, 2), name = __value[0], handler = __value[1];
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
                        _iterator1 = (0,_async_iterator/* default */.Z)(cacheDir.entries());
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
                        __value1 = (0,_sliced_to_array/* default */.Z)(_value1, 2), name1 = __value1[0], handler1 = __value1[1];
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
        return (0,_async_to_generator/* default */.Z)(function() {
            var cacheDir, entries, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, err;
            return (0,tslib_es6.__generator)(this, function(_state) {
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
        return (0,_async_to_generator/* default */.Z)(function() {
            var cacheDir, fileName, _tmp;
            return (0,tslib_es6.__generator)(this, function(_state) {
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
        return (0,_async_to_generator/* default */.Z)(function() {
            return (0,tslib_es6.__generator)(this, function(_state) {
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
var g = typeof self !== "undefined" ? self : {};
var getURL = ((ref = g.browser) === null || ref === void 0 ? void 0 : (ref1 = ref.runtime) === null || ref1 === void 0 ? void 0 : ref1.getURL) || ((ref2 = g.chrome) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.runtime) === null || ref3 === void 0 ? void 0 : ref3.getURL);
var resolveWasmBase = function() {
    var ref;
    if (typeof getURL === "function") return getURL("wasm/");
    var origin = self === null || self === void 0 ? void 0 : (ref = self.location) === null || ref === void 0 ? void 0 : ref.origin;
    if (origin) return "".concat(origin, "/wasm/");
    return "/wasm/";
};
function configureTransformersEnv() {
    return _configureTransformersEnv.apply(this, arguments);
}
function _configureTransformersEnv() {
    _configureTransformersEnv = (0,_async_to_generator/* default */.Z)(function() {
        var env;
        return (0,tslib_es6.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        getTransformers()
                    ];
                case 1:
                    env = _state.sent().env;
                    // SOTA: keep everything remote + cached by the browser. Avoid local-path probes that can fail under MV3.
                    env.allowLocalModels = false;
                    env.useBrowserCache = true;
                    env.backends.onnx.wasm.wasmPaths = resolveWasmBase();
                    debugLog("wasm_paths", {
                        base: env.backends.onnx.wasm.wasmPaths
                    });
                    return [
                        2
                    ];
            }
        });
    });
    return _configureTransformersEnv.apply(this, arguments);
}
var originalFetch = self.fetch.bind(self);
self.fetch = /*#__PURE__*/ (0,_async_to_generator/* default */.Z)(function() {
    var _len, args, _key, ref, url;
    var _arguments = arguments;
    return (0,tslib_es6.__generator)(this, function(_state) {
        for(_len = _arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = _arguments[_key];
        }
        if (DEBUG_EMBED) {
            ;
            url = typeof args[0] === "string" ? args[0] : (ref = args[0]) === null || ref === void 0 ? void 0 : ref.url;
            if (url) debugLog("fetch", {
                url: url
            });
        }
        return [
            2,
            originalFetch.apply(void 0, (0,_to_consumable_array/* default */.Z)(args))
        ];
    });
});
var installWllamaWorkerOverride = function() {
    var ref, ref1, ref2, ref3, ref4;
    // Firefox MV3 SOTA: Force use of physical worker with INLINED WASM
    // This bypasses 'worker-src blob:' CSP restrictions and 'NetworkError' from fetch.
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
    // wllama creates two different Blob workers:
    // - the main llama.cpp worker (large, contains Module + LLAMA_CPP_WORKER_CODE)
    // - the OPFS helper worker (smaller, used by CacheManager to write/download to OPFS)
    //
    // Routing by blob size is brittle across wllama versions/minifiers; in a Worker we can
    // synchronously peek the blob header via FileReaderSync and detect OPFS-related code.
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
            if ((0,_instanceof/* default */.Z)(blob, Blob) && (blobType.includes("javascript") || blobType === "")) {
                var chosen;
                try {
                    var fr = typeof self.FileReaderSync === "function" ? new self.FileReaderSync() : null;
                    var head = fr ? String(fr.readAsText(blob.slice(0, 2048))) : "";
                    // Only override blobs that look like wllama workers. Avoid hijacking unrelated libs
                    // that legitimately create Blob workers inside this Worker.
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
        // ignore override errors
        }
        return originalCreateObjectURL(blob);
    };
    anySelf.__wllamaWorkerOverrideInstalled = true;
};
var setWllamaWorkerOverrideEnabled = function(enabled) {
    var anySelf = self;
    installWllamaWorkerOverride();
    anySelf.__wllamaUseWorkerOverride = enabled;
};
/**
 * Optimized dot product
 */ function dotProduct(a, b) {
    var dot = 0;
    var n = Math.min(a.length, b.length);
    for(var i = 0; i < n; i++)dot += a[i] * b[i];
    return dot;
}
/**
 * Normalization Utility (Zero-Copy focused)
 */ function normalizeInPlace(vec) {
    var norm = 0;
    for(var i = 0; i < vec.length; i++)norm += vec[i] * vec[i];
    norm = Math.sqrt(norm) || 1;
    for(var i1 = 0; i1 < vec.length; i1++)vec[i1] /= norm;
}
function maybeTruncateEmbedding(vec) {
    if (!outputDim || outputDim >= vec.length) return vec;
    var truncated = (0,_instanceof/* default */.Z)(vec, Float32Array) ? vec.slice(0, outputDim) : vec.slice(0, outputDim);
    var norm = 0;
    for(var i = 0; i < truncated.length; i++)norm += truncated[i] * truncated[i];
    norm = Math.sqrt(norm) || 1;
    for(var i1 = 0; i1 < truncated.length; i1++)truncated[i1] /= norm;
    return truncated;
}
/**
 * Guardrail: Strict Dimension Enforcement
 * Returns a Float32Array of exactly targetDim length.
 * Pads with zeros or truncates as needed. RENORMALIZES if modified.
 */ function forceDim(vec, target) {
    var v = (0,_instanceof/* default */.Z)(vec, Float32Array) ? vec : Float32Array.from(vec);
    if (v.length === target) return v;
    var out = new Float32Array(target);
    out.set(v.subarray(0, Math.min(target, v.length)));
    // Renormalize if we truncated or padded, as the vector magnitude changed
    normalizeInPlace(out);
    return out;
}
function ensureWllama() {
    return _ensureWllama.apply(this, arguments);
}
function _ensureWllama() {
    _ensureWllama = (0,_async_to_generator/* default */.Z)(function() {
        var loaded, withVersion, readErr, isBlobCspError, isOverrideNetworkError, preflightOverrideAssets, init;
        return (0,tslib_es6.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!wllamaLoadPromise) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        wllamaLoadPromise
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
                case 2:
                    if (wllama) {
                        loaded = typeof wllama.isModelLoaded === "function" ? wllama.isModelLoaded() : false;
                        if (loaded) return [
                            2
                        ];
                    }
                    debugLog("wllama_init_lazy_start");
                    withVersion = function(url) {
                        return "".concat(url).concat(url.includes("?") ? "&" : "?", "v=").concat(WLLAMA_ASSET_VERSION);
                    };
                    readErr = function(err) {
                        return (0,_instanceof/* default */.Z)(err, Error) ? err.message : String(err || "");
                    };
                    isBlobCspError = function(msg) {
                        var lower = msg.toLowerCase();
                        return lower.includes("blob:") && lower.includes("content-security-policy") || lower.includes("blob:") && lower.includes("worker-src") || lower.includes("blob:") && lower.includes("script-src") || lower.includes("blob") && lower.includes("refused to create") || lower.includes("blob") && lower.includes("failed to construct");
                    };
                    isOverrideNetworkError = function(msg) {
                        return msg.includes("NetworkError") || msg.includes("failed to asynchronously prepare wasm") || msg.includes("Aborted(NetworkError") || msg.includes("wasm streaming compile failed");
                    };
                    preflightOverrideAssets = function() {
                        var _ref = (0,_async_to_generator/* default */.Z)(function() {
                            var ref, ref1, ref2, ref3, ref4, g, getURL, origin, workerUrl, wasmUrl, ref5, workerRes, wasmRes;
                            return (0,tslib_es6.__generator)(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        g = self;
                                        getURL = ((ref = g.browser) === null || ref === void 0 ? void 0 : (ref1 = ref.runtime) === null || ref1 === void 0 ? void 0 : ref1.getURL) || ((ref2 = g.chrome) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.runtime) === null || ref3 === void 0 ? void 0 : ref3.getURL);
                                        origin = (g === null || g === void 0 ? void 0 : (ref4 = g.location) === null || ref4 === void 0 ? void 0 : ref4.origin) || "";
                                        workerUrl = typeof getURL === "function" ? withVersion(getURL("wasm/wllama.worker.js")) : withVersion("".concat(origin, "/wasm/wllama.worker.js"));
                                        wasmUrl = typeof getURL === "function" ? withVersion(getURL("wasm/wllama-single.wasm")) : withVersion("".concat(origin, "/wasm/wllama-single.wasm"));
                                        return [
                                            4,
                                            Promise.all([
                                                fetch(workerUrl, {
                                                    cache: "no-store"
                                                }),
                                                fetch(wasmUrl, {
                                                    cache: "no-store"
                                                })
                                            ])
                                        ];
                                    case 1:
                                        ref5 = _sliced_to_array/* default.apply */.Z.apply(void 0, [
                                            _state.sent(),
                                            2
                                        ]), workerRes = ref5[0], wasmRes = ref5[1];
                                        if (!workerRes.ok) throw new Error("worker_bootstrap_failed:".concat(workerRes.status, ":").concat(workerUrl));
                                        if (!wasmRes.ok) throw new Error("worker_bootstrap_failed:".concat(wasmRes.status, ":").concat(wasmUrl));
                                        return [
                                            2
                                        ];
                                }
                            });
                        });
                        return function preflightOverrideAssets() {
                            return _ref.apply(this, arguments);
                        };
                    }();
                    init = function() {
                        var _ref = (0,_async_to_generator/* default */.Z)(function(opts) {
                            var anySelf, ref, Wllama, wasmBase, canUseMultiThread, wasmPaths;
                            return (0,tslib_es6.__generator)(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        setWllamaWorkerOverrideEnabled(!!opts.forceWorkerOverride);
                                        if (!opts.forceWorkerOverride) return [
                                            3,
                                            2
                                        ];
                                        return [
                                            4,
                                            preflightOverrideAssets()
                                        ];
                                    case 1:
                                        _state.sent();
                                        _state.label = 2;
                                    case 2:
                                        anySelf = self;
                                        if (!anySelf.document) {
                                            ;
                                            anySelf.document = {
                                                baseURI: ((ref = self.location) === null || ref === void 0 ? void 0 : ref.href) || ""
                                            };
                                        }
                                        return [
                                            4,
                                            Promise.all(/* import() */[__webpack_require__.e(72), __webpack_require__.e(892)]).then(__webpack_require__.bind(__webpack_require__, 4940))
                                        ];
                                    case 3:
                                        Wllama = _state.sent().Wllama;
                                        wasmBase = resolveWasmBase();
                                        canUseMultiThread = typeof self.SharedArrayBuffer !== "undefined" && self.crossOriginIsolated === true;
                                        wasmPaths = canUseMultiThread ? {
                                            "single-thread/wllama.wasm": withVersion(wasmBase + "wllama-single.wasm"),
                                            "multi-thread/wllama.wasm": withVersion(wasmBase + "wllama-multi.wasm")
                                        } : {
                                            "single-thread/wllama.wasm": withVersion(wasmBase + "wllama-single.wasm")
                                        };
                                        wllama = new Wllama(wasmPaths, {
                                            cacheManager: new DirectOPFSCacheManager(),
                                            allowOffline: true
                                        });
                                        debugLog("wllama_monitor", {
                                            status: "rag_loading_model_start",
                                            url: wllamaEmbedModelUrl
                                        });
                                        return [
                                            4,
                                            wllama.loadModelFromUrl(wllamaEmbedModelUrl, {
                                                embeddings: true,
                                                pooling_type: "LLAMA_POOLING_TYPE_MEAN",
                                                n_threads: 1,
                                                progressCallback: function(param) {
                                                    var loaded = param.loaded, total = param.total;
                                                    var pct = total ? loaded / total * 100 : 0;
                                                    if (pct % 10 < 1 || pct === 100) {
                                                        debugLog("progress", {
                                                            file: "gguf",
                                                            progress: pct,
                                                            loaded: loaded,
                                                            total: total
                                                        });
                                                    }
                                                    self.postMessage({
                                                        type: "rag-progress",
                                                        data: {
                                                            status: "progress",
                                                            progress: pct,
                                                            file: "gguf"
                                                        }
                                                    });
                                                }
                                            })
                                        ];
                                    case 4:
                                        _state.sent();
                                        debugLog("wllama_init_lazy_done");
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
                    wllamaLoadPromise = (0,_async_to_generator/* default */.Z)(function() {
                        var firstErr, firstMsg, secondErr, secondMsg;
                        return (0,tslib_es6.__generator)(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    _state.trys.push([
                                        0,
                                        2,
                                        ,
                                        3
                                    ]);
                                    // Fast path: native worker bootstrap (blob URL) when allowed by CSP.
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
                                    firstErr = _state.sent();
                                    if (!ENABLE_WLLAMA_WORKER_OVERRIDE_FALLBACK) {
                                        throw firstErr;
                                    }
                                    firstMsg = readErr(firstErr);
                                    if (!isBlobCspError(firstMsg)) {
                                        throw firstErr;
                                    }
                                    debugLog("wllama_retry_with_override", {
                                        reason: "csp_blob_worker_blocked",
                                        message: firstMsg
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
                                    // Fallback path for Firefox MV3 CSP setups that block blob workers.
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
                                    secondErr = _state.sent();
                                    secondMsg = readErr(secondErr);
                                    if (!isOverrideNetworkError(secondMsg)) return [
                                        3,
                                        7
                                    ];
                                    // Some Firefox builds fail on the override path even when blob workers are allowed.
                                    // Retry native once so we don't hard-fail from an override-only issue.
                                    debugLog("wllama_retry_without_override", {
                                        reason: secondMsg
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
                                    throw secondErr;
                                case 8:
                                    return [
                                        2
                                    ];
                            }
                        });
                    })().finally(function() {
                        wllamaLoadPromise = null;
                    });
                    return [
                        4,
                        wllamaLoadPromise
                    ];
                case 3:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _ensureWllama.apply(this, arguments);
}
function embedWithWllama(text) {
    return _embedWithWllama.apply(this, arguments);
}
function _embedWithWllama() {
    _embedWithWllama = (0,_async_to_generator/* default */.Z)(function(text) {
        var input, raw, vec, len, i;
        return (0,tslib_es6.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        ensureWllama()
                    ];
                case 1:
                    _state.sent();
                    if (!wllama) throw new Error("Wllama not initialized");
                    input = "".concat(embeddingPrefixDocument).concat(text);
                    debugLog("embed_start", {
                        textLen: text.length,
                        inputLen: input.length
                    });
                    return [
                        4,
                        wllama.createEmbedding(input)
                    ];
                case 2:
                    raw = _state.sent();
                    debugLog("embed_done", {
                        rawLen: raw.length
                    });
                    vec = new Float32Array(embedDim);
                    len = Math.min(raw.length, embedDim);
                    for(i = 0; i < len; i++)vec[i] = raw[i];
                    normalizeInPlace(vec);
                    return [
                        2,
                        vec
                    ];
            }
        });
    });
    return _embedWithWllama.apply(this, arguments);
}
function applyEmbeddingPrefix(text, mode) {
    var prefix = mode === "query" ? embeddingPrefixQuery : embeddingPrefixDocument;
    return "".concat(prefix || "").concat(text);
}
function embedBatch(texts, mode) {
    return _embedBatch.apply(this, arguments);
}
function _embedBatch() {
    _embedBatch = /**
 * SOTA: Unified Batch Embedding
 * Handles Delegation, Native ML, and Fallback
 */ (0,_async_to_generator/* default */.Z)(function(texts, mode) {
        var res, err1, errMsg, isBackgroundUnavailable, seq, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, text, _, err, seqErr, inputs, result, rawBatch, err2, vecs, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, text1, _1, err, vecs1, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, text2, input, out, data, vec, err;
        return (0,tslib_es6.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (texts.length === 0) return [
                        2,
                        []
                    ];
                    if (!firefoxDelegate) return [
                        3,
                        19
                    ];
                    if (DEBUG_EMBED) {
                        console.log("[RAG-DEBUG] Attempting delegation for batch size:", texts.length);
                    }
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        18
                    ]);
                    return [
                        4,
                        embedBatchWithFirefoxDelegate(texts, mode)
                    ];
                case 2:
                    res = _state.sent();
                    if (DEBUG_EMBED) {
                        console.log("[RAG-DEBUG] Delegation successful");
                    }
                    return [
                        2,
                        res
                    ];
                case 3:
                    err1 = _state.sent();
                    if (DEBUG_EMBED) {
                        console.log("[RAG-DEBUG] Batch delegation failed. Error details:", JSON.stringify(err1, Object.getOwnPropertyNames(err1)));
                    }
                    console.error("[RAG WORKER] Batch delegation failed, retrying sequential delegation:", (err1 === null || err1 === void 0 ? void 0 : err1.message) || err1);
                    errMsg = String((err1 === null || err1 === void 0 ? void 0 : err1.message) || err1 || "");
                    isBackgroundUnavailable = /Could not establish connection/i.test(errMsg) || /Receiving end does not exist/i.test(errMsg) || /Firefox ML not available/i.test(errMsg);
                    if (!!isBackgroundUnavailable) return [
                        3,
                        16
                    ];
                    _state.label = 4;
                case 4:
                    _state.trys.push([
                        4,
                        14,
                        ,
                        15
                    ]);
                    seq = [];
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 5;
                case 5:
                    _state.trys.push([
                        5,
                        11,
                        12,
                        13
                    ]);
                    _iterator = texts[Symbol.iterator]();
                    _state.label = 6;
                case 6:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        10
                    ];
                    text = _step.value;
                    if (cancelled) return [
                        3,
                        10
                    ];
                    _ = seq.push;
                    return [
                        4,
                        embedWithFirefoxDelegate(text, mode)
                    ];
                case 7:
                    _.apply(seq, [
                        _state.sent()
                    ]);
                    return [
                        4,
                        yieldToWorker()
                    ];
                case 8:
                    _state.sent();
                    _state.label = 9;
                case 9:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        6
                    ];
                case 10:
                    return [
                        3,
                        13
                    ];
                case 11:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        13
                    ];
                case 12:
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
                case 13:
                    if (seq.length === texts.length) {
                        if (DEBUG_EMBED) {
                            console.log("[RAG-DEBUG] Sequential delegation retry successful");
                        }
                        return [
                            2,
                            seq
                        ];
                    }
                    throw new Error("Sequential delegation incomplete: ".concat(seq.length, "/").concat(texts.length));
                case 14:
                    seqErr = _state.sent();
                    console.error("[RAG WORKER] Sequential delegation also failed, falling back:", (seqErr === null || seqErr === void 0 ? void 0 : seqErr.message) || seqErr);
                    return [
                        3,
                        15
                    ];
                case 15:
                    return [
                        3,
                        17
                    ];
                case 16:
                    console.warn("[RAG WORKER] Delegation background unavailable; skipping sequential retry.");
                    _state.label = 17;
                case 17:
                    return [
                        3,
                        18
                    ];
                case 18:
                    return [
                        3,
                        20
                    ];
                case 19:
                    if (DEBUG_EMBED) {
                        console.log("[RAG-DEBUG] firefoxDelegate is false. Skipping delegation.");
                    }
                    _state.label = 20;
                case 20:
                    if (!(backend === "firefox-native" && firefoxMLEngine)) return [
                        3,
                        24
                    ];
                    _state.label = 21;
                case 21:
                    _state.trys.push([
                        21,
                        23,
                        ,
                        24
                    ]);
                    inputs = texts.map(function(t) {
                        return applyEmbeddingPrefix(t, mode);
                    });
                    return [
                        4,
                        firefoxMLEngine.run({
                            args: inputs
                        })
                    ];
                case 22:
                    result = _state.sent();
                    rawBatch = Array.isArray(result) ? result : (result === null || result === void 0 ? void 0 : result.output) || [
                        result
                    ];
                    return [
                        2,
                        rawBatch.map(function(item) {
                            var ref;
                            var data;
                            if (Array.isArray(item)) data = item;
                            else if (item === null || item === void 0 ? void 0 : item.data) data = Array.from(item.data);
                            else if (item === null || item === void 0 ? void 0 : (ref = item.output) === null || ref === void 0 ? void 0 : ref[0]) data = Array.from(item.output[0].data || []);
                            else data = [];
                            var vec = forceDim(new Float32Array(data), outputDim || embedDim || ONNX_DIM);
                            return vec;
                        })
                    ];
                case 23:
                    err2 = _state.sent();
                    console.warn("[RAG WORKER] Native batch failed, falling back to Wllama:", err2 === null || err2 === void 0 ? void 0 : err2.message);
                    return [
                        3,
                        24
                    ];
                case 24:
                    // 3. Fallback to Wllama (Local WASM)
                    // We use ensureWllama to guarantee it's ready (lazy load)
                    if (!wllama && !allowLocalModelDownloads) {
                        throw new Error("local_model_download_disabled");
                    }
                    return [
                        4,
                        ensureWllama()
                    ];
                case 25:
                    _state.sent();
                    if (!wllama) return [
                        3,
                        35
                    ];
                    vecs = [];
                    _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                    _state.label = 26;
                case 26:
                    _state.trys.push([
                        26,
                        32,
                        33,
                        34
                    ]);
                    _iterator1 = texts[Symbol.iterator]();
                    _state.label = 27;
                case 27:
                    if (!!(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done)) return [
                        3,
                        31
                    ];
                    text1 = _step1.value;
                    if (cancelled) return [
                        3,
                        31
                    ];
                    _1 = vecs.push;
                    return [
                        4,
                        embedWithWllama(text1)
                    ];
                case 28:
                    _1.apply(vecs, [
                        _state.sent()
                    ]);
                    return [
                        4,
                        yieldToWorker()
                    ];
                case 29:
                    _state.sent();
                    _state.label = 30;
                case 30:
                    _iteratorNormalCompletion1 = true;
                    return [
                        3,
                        27
                    ];
                case 31:
                    return [
                        3,
                        34
                    ];
                case 32:
                    err = _state.sent();
                    _didIteratorError1 = true;
                    _iteratorError1 = err;
                    return [
                        3,
                        34
                    ];
                case 33:
                    try {
                        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                            _iterator1.return();
                        }
                    } finally{
                        if (_didIteratorError1) {
                            throw _iteratorError1;
                        }
                    }
                    return [
                        7
                    ];
                case 34:
                    return [
                        2,
                        vecs
                    ];
                case 35:
                    if (!embedder) return [
                        3,
                        45
                    ];
                    vecs1 = [];
                    _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
                    _state.label = 36;
                case 36:
                    _state.trys.push([
                        36,
                        42,
                        43,
                        44
                    ]);
                    _iterator2 = texts[Symbol.iterator]();
                    _state.label = 37;
                case 37:
                    if (!!(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done)) return [
                        3,
                        41
                    ];
                    text2 = _step2.value;
                    if (cancelled) return [
                        3,
                        41
                    ];
                    input = applyEmbeddingPrefix(text2, mode);
                    return [
                        4,
                        embedder(input, {
                            pooling: "mean",
                            normalize: true
                        })
                    ];
                case 38:
                    out = _state.sent();
                    data = (0,_instanceof/* default */.Z)(out === null || out === void 0 ? void 0 : out.data, Float32Array) ? out.data : new Float32Array((out === null || out === void 0 ? void 0 : out.data) || []);
                    vec = forceDim(data, outputDim || embedDim || ONNX_DIM);
                    vecs1.push(vec);
                    return [
                        4,
                        yieldToWorker()
                    ];
                case 39:
                    _state.sent();
                    _state.label = 40;
                case 40:
                    _iteratorNormalCompletion2 = true;
                    return [
                        3,
                        37
                    ];
                case 41:
                    return [
                        3,
                        44
                    ];
                case 42:
                    err = _state.sent();
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                    return [
                        3,
                        44
                    ];
                case 43:
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                            _iterator2.return();
                        }
                    } finally{
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                    return [
                        7
                    ];
                case 44:
                    return [
                        2,
                        vecs1
                    ];
                case 45:
                    throw new Error("No embedding backend available");
            }
        });
    });
    return _embedBatch.apply(this, arguments);
}
function embedWithFirefoxDelegate(text, mode) {
    return _embedWithFirefoxDelegate.apply(this, arguments);
}
function _embedWithFirefoxDelegate() {
    _embedWithFirefoxDelegate = (0,_async_to_generator/* default */.Z)(function(text, mode) {
        return (0,tslib_es6.__generator)(this, function(_state) {
            return [
                2,
                new Promise(function(resolve, reject) {
                    var id = nextEmbedId++;
                    pendingEmbeddings.set(id, {
                        resolve: resolve,
                        reject: reject
                    });
                    // Timeout to prevent hanging
                    // Timeout to prevent hanging: Increased to 5 minutes (300000ms)
                    var tid = setTimeout(function() {
                        if (pendingEmbeddings.has(id)) {
                            pendingEmbeddings.delete(id);
                            reject(new Error("Firefox ML delegation timeout"));
                        }
                    }, FIREFOX_DELEGATE_TIMEOUT_SINGLE_MS);
                    var input = applyEmbeddingPrefix(text, mode);
                    // Request embedding from main thread
                    // Guardrail: Always use fixed FIREFOX_ML_MODEL_ID
                    self.postMessage({
                        type: "request-embedding",
                        payload: {
                            id: id,
                            text: input,
                            modelId: FIREFOX_ML_MODEL_ID
                        }
                    });
                    // Clear timeout on success/error via response handler
                    pendingEmbeddings.get(id).resolve = function(v) {
                        clearTimeout(tid);
                        resolve(v);
                    };
                    pendingEmbeddings.get(id).reject = function(e) {
                        clearTimeout(tid);
                        reject(e);
                    };
                })
            ];
        });
    });
    return _embedWithFirefoxDelegate.apply(this, arguments);
}
function requestFirefoxDelegatedBatchChunk(inputs, mode, timeoutMs) {
    return _requestFirefoxDelegatedBatchChunk.apply(this, arguments);
}
function _requestFirefoxDelegatedBatchChunk() {
    _requestFirefoxDelegatedBatchChunk = /**
 * SOTA: Batch Delegation (Worker -> Main Thread)
 * Reduces message overhead by factor of N.
 */ (0,_async_to_generator/* default */.Z)(function(inputs, mode, timeoutMs) {
        return (0,tslib_es6.__generator)(this, function(_state) {
            return [
                2,
                new Promise(function(resolve, reject) {
                    var id = nextEmbedId++;
                    pendingEmbedBatch.set(id, {
                        resolve: resolve,
                        reject: reject
                    });
                    var tid = setTimeout(function() {
                        if (pendingEmbedBatch.has(id)) {
                            pendingEmbedBatch.delete(id);
                            reject(new Error("Firefox ML batch delegation timeout"));
                        }
                    }, timeoutMs);
                    self.postMessage({
                        type: "request-embedding-batch",
                        payload: {
                            id: id,
                            texts: inputs,
                            mode: mode,
                            modelId: FIREFOX_ML_MODEL_ID
                        }
                    });
                    pendingEmbedBatch.get(id).resolve = function(v) {
                        clearTimeout(tid);
                        resolve(v);
                    };
                    pendingEmbedBatch.get(id).reject = function(e) {
                        clearTimeout(tid);
                        reject(e);
                    };
                })
            ];
        });
    });
    return _requestFirefoxDelegatedBatchChunk.apply(this, arguments);
}
function dedupeBatchInputs(inputs) {
    var sourceToUniqueIndex = new Array(inputs.length);
    var uniqueInputs = [];
    var seen = new Map();
    for(var i = 0; i < inputs.length; i++){
        var text = inputs[i];
        var existing = seen.get(text);
        if (existing !== undefined) {
            sourceToUniqueIndex[i] = existing;
            continue;
        }
        var nextIdx = uniqueInputs.length;
        uniqueInputs.push(text);
        seen.set(text, nextIdx);
        sourceToUniqueIndex[i] = nextIdx;
    }
    return {
        uniqueInputs: uniqueInputs,
        sourceToUniqueIndex: sourceToUniqueIndex
    };
}
function splitDelegationSubBatches(inputs) {
    var batches = [];
    var current = [];
    var currentChars = 0;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = inputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var input = _step.value;
            var len = input.length;
            var reachedItemCap = current.length >= FIREFOX_DELEGATE_MAX_BATCH_SIZE;
            var reachedCharCap = current.length >= FIREFOX_DELEGATE_MIN_BATCH_SIZE && currentChars + len > FIREFOX_DELEGATE_MAX_BATCH_CHARS;
            if (current.length > 0 && (reachedItemCap || reachedCharCap)) {
                batches.push(current);
                current = [];
                currentChars = 0;
            }
            current.push(input);
            currentChars += len;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    if (current.length > 0) {
        batches.push(current);
    }
    return batches;
}
function computeDelegationTimeoutMs(chunkSize, chunkChars) {
    var byItems = chunkSize * FIREFOX_DELEGATE_TIMEOUT_PER_ITEM_MS;
    var byChars = Math.ceil(chunkChars / 1000) * FIREFOX_DELEGATE_TIMEOUT_PER_1K_CHARS_MS;
    return Math.max(FIREFOX_DELEGATE_TIMEOUT_BASE_MS, byItems, byChars);
}
function embedBatchWithFirefoxDelegate(texts, mode) {
    return _embedBatchWithFirefoxDelegate.apply(this, arguments);
}
function _embedBatchWithFirefoxDelegate() {
    _embedBatchWithFirefoxDelegate = (0,_async_to_generator/* default */.Z)(function(texts, mode) {
        var inputs, ref, uniqueInputs, sourceToUniqueIndex, batches, totalChunks, uniqueVectors, totalStart, totalChars, uniqueChars, chunkIndex, _uniqueVectors, chunk, chunkChars, timeoutMs, chunkStart, vectors, chunkMs, allVectors, totalMs;
        return (0,tslib_es6.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    inputs = texts.map(function(t) {
                        return applyEmbeddingPrefix(t, mode);
                    });
                    if (inputs.length === 0) return [
                        2,
                        []
                    ];
                    ref = dedupeBatchInputs(inputs), uniqueInputs = ref.uniqueInputs, sourceToUniqueIndex = ref.sourceToUniqueIndex;
                    batches = splitDelegationSubBatches(uniqueInputs);
                    totalChunks = batches.length;
                    uniqueVectors = [];
                    totalStart = Date.now();
                    totalChars = inputs.reduce(function(acc, t) {
                        return acc + t.length;
                    }, 0);
                    uniqueChars = uniqueInputs.reduce(function(acc, t) {
                        return acc + t.length;
                    }, 0);
                    if (DEBUG_EMBED && uniqueInputs.length !== inputs.length) {
                        console.log("[RAG-DEBUG] Delegation dedupe:", {
                            inputs: inputs.length,
                            unique: uniqueInputs.length,
                            duplicates: inputs.length - uniqueInputs.length
                        });
                    }
                    chunkIndex = 0;
                    _state.label = 1;
                case 1:
                    if (!(chunkIndex < batches.length)) return [
                        3,
                        5
                    ];
                    chunk = batches[chunkIndex];
                    chunkChars = chunk.reduce(function(acc, t) {
                        return acc + t.length;
                    }, 0);
                    timeoutMs = computeDelegationTimeoutMs(chunk.length, chunkChars);
                    chunkStart = Date.now();
                    if (DEBUG_EMBED) {
                        console.log("[RAG-DEBUG] Delegation sub-batch start:", {
                            chunkIndex: chunkIndex + 1,
                            totalChunks: totalChunks,
                            size: chunk.length,
                            totalChars: chunkChars,
                            avgChars: Number((chunkChars / Math.max(1, chunk.length)).toFixed(1)),
                            timeoutMs: timeoutMs
                        });
                    }
                    return [
                        4,
                        requestFirefoxDelegatedBatchChunk(chunk, mode, timeoutMs)
                    ];
                case 2:
                    vectors = _state.sent();
                    if (vectors.length !== chunk.length) {
                        throw new Error("Delegated batch size mismatch: expected ".concat(chunk.length, ", got ").concat(vectors.length));
                    }
                    (_uniqueVectors = uniqueVectors).push.apply(_uniqueVectors, (0,_to_consumable_array/* default */.Z)(vectors));
                    chunkMs = Date.now() - chunkStart;
                    if (DEBUG_EMBED) {
                        console.log("[RAG-DEBUG] Delegation sub-batch done:", {
                            chunkIndex: chunkIndex + 1,
                            totalChunks: totalChunks,
                            size: chunk.length,
                            totalChars: chunkChars,
                            ms: chunkMs,
                            msPerItem: Number((chunkMs / Math.max(1, chunk.length)).toFixed(1))
                        });
                    }
                    return [
                        4,
                        yieldToWorker()
                    ];
                case 3:
                    _state.sent();
                    _state.label = 4;
                case 4:
                    chunkIndex++;
                    return [
                        3,
                        1
                    ];
                case 5:
                    allVectors = sourceToUniqueIndex.map(function(idx) {
                        var vec = uniqueVectors[idx];
                        if (!vec) {
                            throw new Error("Missing delegated vector at unique index ".concat(idx));
                        }
                        return vec;
                    });
                    totalMs = Date.now() - totalStart;
                    if (DEBUG_EMBED) {
                        console.log("[RAG-DEBUG] Delegation batch complete:", {
                            items: inputs.length,
                            uniqueItems: uniqueInputs.length,
                            subBatches: totalChunks,
                            totalChars: totalChars,
                            uniqueChars: uniqueChars,
                            ms: totalMs,
                            msPerItem: Number((totalMs / Math.max(1, inputs.length)).toFixed(1)),
                            msPer1kChars: totalChars > 0 ? Number((totalMs / (totalChars / 1000)).toFixed(1)) : 0
                        });
                    }
                    return [
                        2,
                        allVectors
                    ];
            }
        });
    });
    return _embedBatchWithFirefoxDelegate.apply(this, arguments);
}
function embedText(text, mode) {
    return _embedText.apply(this, arguments);
}
function _embedText() {
    _embedText = (0,_async_to_generator/* default */.Z)(function(text, mode) {
        var clean, vec, err, ref, input, result, rawData, vec1, i, maybe, raw, vec2, len, i1, maybe1, out, data, vec3, maybe2;
        return (0,tslib_es6.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    clean = String(text || "").trim();
                    if (!clean) return [
                        2,
                        new Float32Array(outputDim || embedDim || ONNX_DIM)
                    ];
                    if (!firefoxDelegate) return [
                        3,
                        4
                    ];
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        4
                    ]);
                    return [
                        4,
                        embedWithFirefoxDelegate(clean, mode)
                    ];
                case 2:
                    vec = _state.sent();
                    // Guardrail: Strict Dimension Enforcement
                    return [
                        2,
                        forceDim(vec, outputDim || embedDim || ONNX_DIM)
                    ];
                case 3:
                    err = _state.sent();
                    console.warn("[RAG WORKER] Firefox delegation failed (single), fallback to Wllama:", err === null || err === void 0 ? void 0 : err.message);
                    return [
                        3,
                        4
                    ];
                case 4:
                    if (!(backend === "firefox-native")) return [
                        3,
                        6
                    ];
                    if (!firefoxMLEngine) throw new Error("Firefox ML engine not initialized");
                    input = applyEmbeddingPrefix(clean, mode);
                    return [
                        4,
                        firefoxMLEngine.run({
                            args: [
                                input
                            ]
                        })
                    ];
                case 5:
                    result = _state.sent();
                    if (Array.isArray(result) && Array.isArray(result[0])) {
                        rawData = result[0];
                    } else if (result === null || result === void 0 ? void 0 : (ref = result.output) === null || ref === void 0 ? void 0 : ref[0]) {
                        rawData = Array.isArray(result.output[0]) ? result.output[0] : Array.from(result.output[0].data || []);
                    } else if (result === null || result === void 0 ? void 0 : result.data) {
                        rawData = Array.from(result.data);
                    } else {
                        rawData = Array.isArray(result) ? result : [];
                    }
                    vec1 = new Float32Array(rawData.length || embedDim);
                    for(i = 0; i < rawData.length; i++)vec1[i] = rawData[i];
                    normalizeInPlace(vec1);
                    maybe = maybeTruncateEmbedding(vec1);
                    return [
                        2,
                        (0,_instanceof/* default */.Z)(maybe, Float32Array) ? maybe : Float32Array.from(maybe)
                    ];
                case 6:
                    if (!(backend === "wllama" || firefoxDelegate)) return [
                        3,
                        9
                    ];
                    if (!wllama && !allowLocalModelDownloads) {
                        throw new Error("local_model_download_disabled");
                    }
                    return [
                        4,
                        ensureWllama()
                    ];
                case 7:
                    _state.sent();
                    return [
                        4,
                        wllama.createEmbedding(applyEmbeddingPrefix(clean, mode))
                    ];
                case 8:
                    raw = _state.sent();
                    vec2 = new Float32Array(embedDim);
                    len = Math.min(raw.length, embedDim);
                    for(i1 = 0; i1 < len; i1++)vec2[i1] = raw[i1];
                    normalizeInPlace(vec2);
                    maybe1 = maybeTruncateEmbedding(vec2);
                    return [
                        2,
                        (0,_instanceof/* default */.Z)(maybe1, Float32Array) ? maybe1 : Float32Array.from(maybe1)
                    ];
                case 9:
                    if (!embedder) throw new Error("Embedder not initialized");
                    return [
                        4,
                        embedder(applyEmbeddingPrefix(clean, mode), {
                            pooling: "mean",
                            normalize: true
                        })
                    ];
                case 10:
                    out = _state.sent();
                    data = (0,_instanceof/* default */.Z)(out === null || out === void 0 ? void 0 : out.data, Float32Array) ? out.data : new Float32Array((out === null || out === void 0 ? void 0 : out.data) || []);
                    vec3 = data.length === embedDim ? data : data.slice(0, embedDim);
                    normalizeInPlace(vec3);
                    maybe2 = maybeTruncateEmbedding(vec3);
                    return [
                        2,
                        (0,_instanceof/* default */.Z)(maybe2, Float32Array) ? maybe2 : Float32Array.from(maybe2)
                    ];
            }
        });
    });
    return _embedText.apply(this, arguments);
}
/**
 * Semantic Splitter (Internal to Worker, Locale Aware)
 */ function splitSentences(text) {
    var locale = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "en";
    var blocks = text.split(/\n{2,}/g).map(function(b) {
        return b.trim();
    }).filter(Boolean);
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        try {
            var seg = new Intl.Segmenter(locale, {
                granularity: "sentence"
            });
            return blocks.flatMap(function(block) {
                return Array.from(seg.segment(block)).map(function(s) {
                    return s.segment.trim();
                }).filter(function(s) {
                    return s.length > 0;
                });
            });
        } catch (e) {}
    }
    var ref;
    // Fallback using global punctuation (includes CJK)
    return blocks.flatMap(function(b) {
        var ref1;
        return (ref = (ref1 = b.match(/[^.!?\u3002\uFF01\uFF1F\u00A1\u00BF]+(?:[.!?\u3002\uFF01\uFF1F\u00A1\u00BF]+|$)/g)) === null || ref1 === void 0 ? void 0 : ref1.map(function(s) {
            return s.trim();
        })) !== null && ref !== void 0 ? ref : [
            b
        ];
    }).filter(Boolean);
}
function estimateTokenCount(text) {
    var locale = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "en";
    var clean = String(text || "").trim();
    if (!clean) return 0;
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        try {
            var seg = new Intl.Segmenter(locale, {
                granularity: "word"
            });
            var wordLike = 0;
            var segmentCount = 0;
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = seg.segment(clean)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var part = _step.value;
                    segmentCount++;
                    if (part.isWordLike) {
                        wordLike++;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
            if (wordLike > 0) {
                return Math.max(1, Math.round(wordLike * 1.25));
            }
            if (segmentCount > 0) {
                return Math.max(1, Math.round(segmentCount * 0.75));
            }
        } catch (e) {
        // Fall back to language-agnostic heuristics.
        }
    }
    var whitespaceWords = clean.split(/\s+/g).filter(Boolean).length;
    if (whitespaceWords > 0) {
        return Math.max(1, Math.round(whitespaceWords * 1.3));
    }
    var cjkChars = (clean.match(/[\u3400-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/g) || []).length;
    if (cjkChars > 0) {
        return Math.max(1, Math.round(cjkChars * 1.05));
    }
    return Math.max(1, Math.ceil(clean.length / 4));
}
function buildLegacyCharPreChunks(sentences) {
    var locale = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "en";
    var minChunkSize = 100;
    var maxChunkSize = 500;
    var preChunks = [];
    var currentChunkText = [];
    var currentLen = 0;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = sentences[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var sentence = _step.value;
            var willExceed = currentLen + sentence.length > maxChunkSize;
            if (willExceed && currentLen >= minChunkSize) {
                var chunkSentences = (0,_to_consumable_array/* default */.Z)(currentChunkText);
                var chunkText = chunkSentences.join(" ");
                preChunks.push({
                    text: chunkText,
                    sentences: chunkSentences,
                    tokenCount: estimateTokenCount(chunkText, locale)
                });
                currentChunkText = [];
                currentLen = 0;
            }
            currentChunkText.push(sentence);
            currentLen += (currentChunkText.length > 1 ? 1 : 0) + sentence.length;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    if (currentChunkText.length > 0) {
        var chunkSentences1 = (0,_to_consumable_array/* default */.Z)(currentChunkText);
        var chunkText1 = chunkSentences1.join(" ");
        preChunks.push({
            text: chunkText1,
            sentences: chunkSentences1,
            tokenCount: estimateTokenCount(chunkText1, locale)
        });
    }
    return preChunks;
}
function buildTokenAwarePreChunks(sentences) {
    var _loop = function() {
        var end = start;
        var tokenTotal = 0;
        var charTotal = 0;
        while(end < units.length){
            var unit = units[end];
            var nextTokenTotal = tokenTotal + unit.tokenCount;
            var nextCharTotal = charTotal + (charTotal > 0 ? 1 : 0) + unit.text.length;
            var shouldStopForMaxTokens = end > start && nextTokenTotal > TOKEN_PRECHUNK_MAX_TOKENS;
            var shouldStopForMaxChars = end > start && nextCharTotal > TOKEN_PRECHUNK_HARD_MAX_CHARS;
            if (shouldStopForMaxTokens || shouldStopForMaxChars) {
                break;
            }
            tokenTotal = nextTokenTotal;
            charTotal = nextCharTotal;
            end++;
            if (tokenTotal >= TOKEN_PRECHUNK_TARGET_TOKENS && tokenTotal >= TOKEN_PRECHUNK_MIN_TOKENS) {
                break;
            }
        }
        if (end <= start) {
            end = start + 1;
            tokenTotal = units[start].tokenCount;
        }
        var slice = units.slice(start, end);
        preChunks.push({
            text: slice.map(function(u) {
                return u.text;
            }).join(" "),
            sentences: slice.map(function(u) {
                return u.text;
            }),
            tokenCount: tokenTotal
        });
        if (end >= units.length) return "break";
        var overlapTokens = 0;
        var resume = end;
        while(resume > start && overlapTokens < TOKEN_PRECHUNK_OVERLAP_TOKENS){
            resume--;
            overlapTokens += units[resume].tokenCount;
        }
        var nextStart = Math.max(start + 1, resume);
        start = Math.min(end, nextStart);
    };
    var locale = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "en";
    var units = sentences.map(function(text) {
        var clean = String(text || "").trim();
        if (!clean) return null;
        return {
            text: clean,
            tokenCount: estimateTokenCount(clean, locale)
        };
    }).filter(function(u) {
        return !!u;
    });
    if (units.length === 0) return [];
    var preChunks = [];
    var start = 0;
    while(start < units.length){
        var _ret = _loop();
        if (_ret === "break") break;
    }
    return preChunks;
}
function percentileSorted(values, p) {
    if (values.length === 0) return 0;
    if (values.length === 1) return values[0];
    var clampedP = Math.max(0, Math.min(1, p));
    var idx = (values.length - 1) * clampedP;
    var lo = Math.floor(idx);
    var hi = Math.ceil(idx);
    if (lo === hi) return values[lo];
    var t = idx - lo;
    return values[lo] * (1 - t) + values[hi] * t;
}
function cosineSimilarity(a, b) {
    var denom = Math.sqrt(dotProduct(a, a)) * Math.sqrt(dotProduct(b, b));
    if (!Number.isFinite(denom) || denom <= 0) return 0;
    return dotProduct(a, b) / denom;
}
function computeAdaptiveMergeThreshold(vectors) {
    if (vectors.length < 4) return SEMANTIC_MERGE_THRESHOLD_DEFAULT;
    var sims = [];
    for(var i = 1; i < vectors.length; i++){
        var prev = vectors[i - 1];
        var next = vectors[i];
        if (!prev || !next || prev.length === 0 || next.length === 0) continue;
        var sim = cosineSimilarity(prev, next);
        if (Number.isFinite(sim)) sims.push(sim);
    }
    if (sims.length < 4) return SEMANTIC_MERGE_THRESHOLD_DEFAULT;
    sims.sort(function(a, b) {
        return a - b;
    });
    var p25 = percentileSorted(sims, 0.25);
    var p50 = percentileSorted(sims, 0.5);
    var p75 = percentileSorted(sims, 0.75);
    var iqr = Math.max(0, p75 - p25);
    var candidate = p50 - Math.min(0.08, iqr * 0.4);
    return Math.max(SEMANTIC_MERGE_THRESHOLD_FLOOR, Math.min(SEMANTIC_MERGE_THRESHOLD_CEIL, candidate));
}
/**
 * Safe TypedArray to Array conversion (Zero-Copy where possible)
 */ function toIntArray(ids) {
    var out = new Array(ids.length);
    for(var i = 0; i < ids.length; i++){
        var v = ids[i];
        out[i] = (typeof v === "undefined" ? "undefined" : (0,_type_of/* default */.Z)(v)) === "bigint" ? Number(v) : v | 0;
    }
    return out;
}
function viewIds(inputIds, start, end) {
    if (inputIds === null || inputIds === void 0 ? void 0 : inputIds.subarray) return inputIds.subarray(start, end);
    return inputIds.slice(start, end);
}
function initialize(payload) {
    return _initialize.apply(this, arguments);
}
function _initialize() {
    _initialize = /**
 * Main Initialization
 */ (0,_async_to_generator/* default */.Z)(function(payload) {
        var ref, requestedDim, nextTargetDim, Voy, backendHint, webgpuAvailable, useExperimentalWebGPU, firefoxNativeAvailable, _tmp, nextBackend, modelUrl, nextModelId, Voy1, pipeline, probe, probeData, e, webgpuErr, g, browserApi, ref1, probeResult, probeData1, e1, firefoxErr, ref2, shouldEagerDownload, pipeline1, testVoy, err, msg;
        return (0,tslib_es6.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        30,
                        ,
                        31
                    ]);
                    requestedDim = Number(payload === null || payload === void 0 ? void 0 : payload.truncateDim);
                    nextTargetDim = Number.isFinite(requestedDim) && requestedDim > 0 ? requestedDim : null;
                    if (payload.locale) currentLocale = payload.locale;
                    if (payload.embeddingPrefixes) {
                        embeddingPrefixQuery = payload.embeddingPrefixes.query || "";
                        embeddingPrefixDocument = payload.embeddingPrefixes.document || "";
                        debugLog("embedding_prefixes", {
                            query: embeddingPrefixQuery,
                            document: embeddingPrefixDocument
                        });
                    } else {
                        embeddingPrefixQuery = "";
                        embeddingPrefixDocument = "";
                    }
                    firefoxDelegate = !!payload.firefoxDelegate;
                    allowLocalModelDownloads = (payload === null || payload === void 0 ? void 0 : (ref = payload.config) === null || ref === void 0 ? void 0 : ref.downloadLocalModels) !== false;
                    if (firefoxDelegate) {
                        console.log("[RAG WORKER] \xf0Ÿš€ Firefox Delegation Enabled: Embeddings will be computed on Main Thread");
                    // Set outputDim for E5 Large if delegating?
                    // Native ML default uses multilingual-e5-base (768 dim).
                    // If we delegate, probe/init logic sets the effective dimension.
                    // But valid outputDim might be overwritten later.
                    // Let's assume the main thread handles the model correctly.
                    }
                    if (!payload.liteMode) return [
                        3,
                        2
                    ];
                    liteMode = true;
                    console.log("[RAG WORKER] \xf0Ÿš€ LITE MODE: Skipping embedding model, chunks-only indexing");
                    debugLog("lite_mode_enabled", {});
                    return [
                        4,
                        __webpack_require__.e(/* import() */ 801).then(__webpack_require__.bind(__webpack_require__, 7801))
                    ];
                case 1:
                    Voy = _state.sent().Voy;
                    voyChunks = new Voy({
                        embeddings: []
                    });
                    voyChapters = new Voy({
                        embeddings: []
                    });
                    initialized = true;
                    backend = null // No embedding backend in lite mode
                    ;
                    self.postMessage({
                        type: "initialized",
                        payload: {
                            dim: 0,
                            liteMode: true
                        }
                    });
                    return [
                        2
                    ];
                case 2:
                    backendHint = payload === null || payload === void 0 ? void 0 : payload.backend;
                    return [
                        4,
                        hasWebGPU()
                    ];
                case 3:
                    webgpuAvailable = _state.sent();
                    useExperimentalWebGPU = (payload === null || payload === void 0 ? void 0 : payload.experimentalWebGPU) !== false && webgpuAvailable;
                    _tmp = isFirefox;
                    if (!_tmp) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        hasFirefoxNativeML()
                    ];
                case 4:
                    _tmp = _state.sent();
                    _state.label = 5;
                case 5:
                    firefoxNativeAvailable = _tmp;
                    if (backendHint === "wllama") {
                        nextBackend = "wllama";
                    } else if (backendHint === "transformers") {
                        nextBackend = "transformers";
                    } else if (backendHint === "firefox-native") {
                        nextBackend = "firefox-native";
                    } else if (backendHint === "webgpu" || useExperimentalWebGPU) {
                        nextBackend = "webgpu";
                        debugLog("webgpu_detected", {
                            available: webgpuAvailable,
                            experimental: true
                        });
                    } else if (firefoxNativeAvailable) {
                        // Firefox native ML is 2-10x faster than Wllama WASM
                        nextBackend = "firefox-native";
                        debugLog("firefox_native_detected", {
                            available: true
                        });
                    } else {
                        nextBackend = isFirefox ? "wllama" : "transformers";
                    }
                    console.log("[RAG WORKER] Backend selection:", {
                        nextBackend: nextBackend,
                        webgpuAvailable: webgpuAvailable,
                        firefoxNativeAvailable: firefoxNativeAvailable,
                        isFirefox: isFirefox,
                        backendHint: backendHint
                    });
                    modelUrl = (payload === null || payload === void 0 ? void 0 : payload.modelUrl) || WLLAMA_EMBED_MODEL_URL;
                    if (nextBackend === "wllama" && !modelUrl) {
                        throw new Error("Missing embedding modelUrl for wllama backend");
                    }
                    wllamaEmbedModelUrl = modelUrl;
                    nextModelId = nextBackend === "wllama" ? (payload === null || payload === void 0 ? void 0 : payload.modelId) || modelUrl : String((payload === null || payload === void 0 ? void 0 : payload.model) || "");
                    if (initialized && backend === nextBackend && embeddingModel === nextModelId && targetDim === nextTargetDim) {
                        self.postMessage({
                            type: "initialized",
                            payload: {
                                dim: outputDim
                            }
                        });
                        return [
                            2
                        ];
                    }
                    backend = nextBackend;
                    embeddingModel = nextModelId;
                    targetDim = nextTargetDim;
                    debugLog("backend", {
                        name: backend
                    });
                    debugLog("init_start", {
                        model: embeddingModel
                    });
                    return [
                        4,
                        __webpack_require__.e(/* import() */ 801).then(__webpack_require__.bind(__webpack_require__, 7801))
                    ];
                case 6:
                    Voy1 = _state.sent().Voy;
                    if (!(backend === "webgpu" || backend === "firefox-native" || backend === "wllama")) return [
                        3,
                        25
                    ];
                    if (!(backend === "webgpu")) return [
                        3,
                        16
                    ];
                    debugLog("webgpu_init_start", {
                        model: WEBGPU_EMBED_MODEL
                    });
                    console.log("[RAG WORKER] \xf0Ÿš€ EXPERIMENTAL: Initializing WebGPU embedder for 15-30x speedup...");
                    _state.label = 7;
                case 7:
                    _state.trys.push([
                        7,
                        15,
                        ,
                        16
                    ]);
                    return [
                        4,
                        configureTransformersEnv()
                    ];
                case 8:
                    _state.sent();
                    return [
                        4,
                        getTransformers()
                    ];
                case 9:
                    pipeline = _state.sent().pipeline;
                    return [
                        4,
                        pipeline("feature-extraction", WEBGPU_EMBED_MODEL, {
                            device: "webgpu",
                            quantized: true,
                            progress_callback: function(d) {
                                if (d.status === "progress") {
                                    debugLog("webgpu_progress", {
                                        file: d.file,
                                        progress: d.progress
                                    });
                                    self.postMessage({
                                        type: "rag-progress",
                                        data: {
                                            status: "progress",
                                            progress: d.progress,
                                            file: d.file,
                                            backend: "webgpu"
                                        }
                                    });
                                }
                            }
                        })
                    ];
                case 10:
                    embedder = _state.sent();
                    _state.label = 11;
                case 11:
                    _state.trys.push([
                        11,
                        13,
                        ,
                        14
                    ]);
                    return [
                        4,
                        embedder("test", {
                            pooling: "mean",
                            normalize: true
                        })
                    ];
                case 12:
                    probe = _state.sent();
                    probeData = (0,_instanceof/* default */.Z)(probe === null || probe === void 0 ? void 0 : probe.data, Float32Array) ? probe.data : new Float32Array((probe === null || probe === void 0 ? void 0 : probe.data) || []);
                    embedDim = probeData.length || E5_LARGE_DIM;
                    console.log("[RAG WORKER] \xe2œ… WebGPU embedDim probed:", embedDim);
                    return [
                        3,
                        14
                    ];
                case 13:
                    e = _state.sent();
                    embedDim = E5_LARGE_DIM;
                    console.log("[RAG WORKER] \xe2š\xa0\xef\xb8\x8f WebGPU dim probe failed, using default:", embedDim);
                    return [
                        3,
                        14
                    ];
                case 14:
                    wllama = null;
                    console.log("[RAG WORKER] \xe2œ… WebGPU embedder initialized successfully!");
                    debugLog("webgpu_init_success", {
                        dim: embedDim
                    });
                    return [
                        3,
                        16
                    ];
                case 15:
                    webgpuErr = _state.sent();
                    console.warn("[RAG WORKER] \xe2š\xa0\xef\xb8\x8f WebGPU failed, falling back to wllama WASM:", webgpuErr === null || webgpuErr === void 0 ? void 0 : webgpuErr.message);
                    debugLog("webgpu_init_failed", {
                        error: String(webgpuErr === null || webgpuErr === void 0 ? void 0 : webgpuErr.message),
                        fallback: "wllama"
                    });
                    backend = "wllama";
                    return [
                        3,
                        16
                    ];
                case 16:
                    if (!(backend === "firefox-native")) return [
                        3,
                        24
                    ];
                    console.log("[RAG WORKER] \xf0Ÿš€ EXPERIMENTAL: Initializing Firefox Native ML engine...");
                    debugLog("firefox_native_init_start", {});
                    _state.label = 17;
                case 17:
                    _state.trys.push([
                        17,
                        23,
                        ,
                        24
                    ]);
                    g = self;
                    browserApi = g.browser || g.chrome;
                    return [
                        4,
                        browserApi.trial.ml.createEngine({
                            taskName: "feature-extraction",
                            modelId: FIREFOX_ML_MODEL_ID,
                            modelHub: "huggingface"
                        })
                    ];
                case 18:
                    firefoxMLEngine = _state.sent();
                    _state.label = 19;
                case 19:
                    _state.trys.push([
                        19,
                        21,
                        ,
                        22
                    ]);
                    return [
                        4,
                        firefoxMLEngine.run({
                            args: [
                                "test"
                            ]
                        })
                    ];
                case 20:
                    probeResult = _state.sent();
                    probeData1 = (probeResult === null || probeResult === void 0 ? void 0 : (ref1 = probeResult.output) === null || ref1 === void 0 ? void 0 : ref1[0]) || (probeResult === null || probeResult === void 0 ? void 0 : probeResult[0]) || probeResult;
                    if (Array.isArray(probeData1)) {
                        embedDim = probeData1.length;
                    } else if (probeData1 === null || probeData1 === void 0 ? void 0 : probeData1.data) {
                        embedDim = probeData1.data.length;
                    } else {
                        embedDim = E5_LARGE_DIM;
                    }
                    console.log("[RAG WORKER] \xe2œ… Firefox Native ML embedDim probed:", embedDim);
                    return [
                        3,
                        22
                    ];
                case 21:
                    e1 = _state.sent();
                    embedDim = E5_LARGE_DIM;
                    console.log("[RAG WORKER] \xe2š\xa0\xef\xb8\x8f Firefox Native ML dim probe failed, using default:", embedDim);
                    return [
                        3,
                        22
                    ];
                case 22:
                    embedder = null;
                    wllama = null;
                    console.log("[RAG WORKER] \xe2œ… Firefox Native ML engine initialized!");
                    debugLog("firefox_native_init_success", {
                        dim: embedDim
                    });
                    return [
                        3,
                        24
                    ];
                case 23:
                    firefoxErr = _state.sent();
                    console.warn("[RAG WORKER] \xe2š\xa0\xef\xb8\x8f Firefox Native ML failed, falling back to wllama:", firefoxErr === null || firefoxErr === void 0 ? void 0 : firefoxErr.message);
                    debugLog("firefox_native_init_failed", {
                        error: String(firefoxErr === null || firefoxErr === void 0 ? void 0 : firefoxErr.message),
                        fallback: "wllama"
                    });
                    backend = "wllama";
                    firefoxMLEngine = null;
                    return [
                        3,
                        24
                    ];
                case 24:
                    // SOTA: Lazy Loading for Wllama (common fallback for WebGPU/Native ML or default for Firefox)
                    if (backend === "wllama") {
                        ;
                        embedDim = E5_LARGE_DIM;
                        shouldEagerDownload = (payload === null || payload === void 0 ? void 0 : (ref2 = payload.config) === null || ref2 === void 0 ? void 0 : ref2.downloadLocalModels) !== false && !firefoxDelegate;
                        if (shouldEagerDownload) {
                            console.log("[RAG WORKER] \xf0Ÿš€ Eager Wllama download: Triggering background fetch...");
                            ensureWllama().catch(function(err) {
                                return console.warn("[RAG WORKER] Eager Wllama pre-fetch failed:", err);
                            });
                        } else {
                            console.log("[RAG WORKER] \xf0Ÿ›‘ Eager Wllama download skipped (Delegation Active or User Disabled).");
                        }
                    }
                    return [
                        3,
                        29
                    ];
                case 25:
                    // Standard Transformers.js pipeline (CPU-based ONNX)
                    if (!(payload === null || payload === void 0 ? void 0 : payload.model)) {
                        throw new Error("Missing embedding model id");
                    }
                    return [
                        4,
                        configureTransformersEnv()
                    ];
                case 26:
                    _state.sent();
                    return [
                        4,
                        getTransformers()
                    ];
                case 27:
                    pipeline1 = _state.sent().pipeline;
                    return [
                        4,
                        pipeline1("feature-extraction", payload.model, {
                            quantized: true,
                            progress_callback: function(d) {
                                if (d.status === "progress") {
                                    debugLog("progress", {
                                        file: d.file,
                                        progress: d.progress,
                                        loaded: d.loaded,
                                        total: d.total
                                    });
                                    self.postMessage({
                                        type: "rag-progress",
                                        data: {
                                            status: "progress",
                                            progress: d.progress,
                                            file: d.file
                                        }
                                    });
                                }
                            }
                        })
                    ];
                case 28:
                    embedder = _state.sent();
                    embedDim = ONNX_DIM;
                    wllama = null;
                    _state.label = 29;
                case 29:
                    voyChunks = new Voy1();
                    voyChapters = new Voy1();
                    // SOTA: Voy Probe (Check for Float32Array support to save allocation)
                    try {
                        testVoy = new Voy1();
                        testVoy.add({
                            embeddings: [
                                {
                                    id: "probe",
                                    title: "",
                                    url: "",
                                    embeddings: new Float32Array(embedDim)
                                }
                            ]
                        });
                        voyAcceptsTypedArrays = true;
                    } catch (e2) {
                        voyAcceptsTypedArrays = false;
                    }
                    outputDim = targetDim && targetDim < embedDim ? targetDim : embedDim;
                    initialized = true;
                    skippedSections.length = 0;
                    debugLog("ready");
                    self.postMessage({
                        type: "initialized",
                        payload: {
                            dim: outputDim
                        }
                    });
                    return [
                        3,
                        31
                    ];
                case 30:
                    err = _state.sent();
                    msg = String((err === null || err === void 0 ? void 0 : err.message) || err);
                    debugLog("init_error", {
                        message: msg
                    });
                    self.postMessage({
                        type: "embedding-error",
                        data: {
                            message: msg,
                            stage: "init"
                        }
                    });
                    self.postMessage({
                        type: "error",
                        payload: {
                            reason: "FAILED_INIT: ".concat(msg)
                        }
                    });
                    return [
                        3,
                        31
                    ];
                case 31:
                    return [
                        2
                    ];
            }
        });
    });
    return _initialize.apply(this, arguments);
}
function processSectionLite(bookId, markdown, metadata) {
    return _processSectionLite.apply(this, arguments);
}
function _processSectionLite() {
    _processSectionLite = /**
 * PHASE 2: Lite Mode Section Processor
 * Stores text chunks WITHOUT generating embeddings for instant import.
 * Uses zero-vectors for compatibility with Voy structure.
 * Retrieval relies on BM25 text search instead of vector similarity.
 */ (0,_async_to_generator/* default */.Z)(function(bookId, markdown, metadata) {
        var doneSent, ref, donePayload, sendDone, reason, sentences, target, overlap, recordsBatch, current, currentStart, charOffset, flushChunk, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, s, words, overlapWords;
        return (0,tslib_es6.__generator)(this, function(_state) {
            doneSent = false;
            donePayload = {
                sectionIndex: (ref = metadata === null || metadata === void 0 ? void 0 : metadata.sectionIndex) !== null && ref !== void 0 ? ref : -1,
                skipped: false
            };
            sendDone = function(p) {
                if (!doneSent) {
                    doneSent = true;
                    self.postMessage({
                        type: "sectionDone",
                        payload: p
                    });
                }
            };
            try {
                // Skip empty sections
                if (!markdown || markdown.trim().length === 0 || metadata.skipped) {
                    reason = metadata.reason || "empty markdown";
                    skippedSections.push({
                        sectionIndex: metadata.sectionIndex,
                        reason: reason
                    });
                    donePayload = {
                        sectionIndex: metadata.sectionIndex,
                        skipped: true,
                        reason: reason
                    };
                    sendDone(donePayload);
                    return [
                        2
                    ];
                }
                sentences = splitSentences(markdown, currentLocale);
                target = 1000 // chars per chunk
                ;
                overlap = 200;
                recordsBatch = [];
                current = "";
                currentStart = 0;
                charOffset = 0;
                flushChunk = function() {
                    if (!current.trim()) return;
                    // Create record with empty embedding (for BM25 text search)
                    recordsBatch.push({
                        bookId: bookId,
                        sectionId: String(metadata.sectionIndex),
                        chapterId: metadata.chapterId || "",
                        chapterTitle: metadata.title || "",
                        content: current.trim(),
                        charStart: currentStart,
                        charEnd: charOffset,
                        // No embedding - zero vector placeholder
                        embedding: null
                    });
                    current = "";
                    currentStart = charOffset;
                };
                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(_iterator = sentences[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        s = _step.value;
                        if (cancelled) break;
                        if (current.length + s.length > target) {
                            words = current.split(/\s+/);
                            flushChunk();
                            overlapWords = words.slice(-Math.min(words.length, Math.floor(overlap / 5)));
                            current = overlapWords.join(" ") + " ";
                            currentStart = charOffset - current.length;
                        }
                        current += s + " ";
                        charOffset += s.length + 1;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                // Flush remaining
                flushChunk();
                // Add records (emit them back to main thread for DB storage)
                if (recordsBatch.length > 0) {
                    self.postMessage({
                        type: "records",
                        payload: recordsBatch
                    });
                    itemsAdded += recordsBatch.length;
                }
                donePayload = {
                    sectionIndex: metadata.sectionIndex,
                    skipped: false,
                    chunks: recordsBatch.length
                };
                sendDone(donePayload);
                debugLog("lite_section_done", {
                    sectionIndex: metadata.sectionIndex,
                    chunks: recordsBatch.length
                });
            } catch (err1) {
                console.error("[RAG WORKER] Lite section error:", err1 === null || err1 === void 0 ? void 0 : err1.message);
                donePayload = {
                    sectionIndex: metadata.sectionIndex,
                    skipped: true,
                    reason: (err1 === null || err1 === void 0 ? void 0 : err1.message) || "lite_error"
                };
                sendDone(donePayload);
            }
            return [
                2
            ];
        });
    });
    return _processSectionLite.apply(this, arguments);
}
function processSection(bookId, markdown, metadata) {
    return _processSection.apply(this, arguments);
}
function _processSection() {
    _processSection = /**
 * Optimized Section Processor
 */ (0,_async_to_generator/* default */.Z)(function(bookId, markdown, metadata) {
        var doneSent, ref, donePayload, sendDone, reason, markdownTokens, inputIds, numTokens, MAX_LATE_CHUNK_TOKENS, useLateChunking, tokenEmbeddings, WINDOW_SIZE, STRIDE, tokenWeight, lateOk, i, end, windowView, windowIds, textWindow, out, data, seqLen, windowLen, j, globalIdx, startOff, winOff, d, e, i1, weight, off, d1, sectionSumVec, i2, off1, d2, d3, sentences, currentPos, sentenceVectors, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, sentence, startIdx, searchSlice, vec, charStartRatio, charEndRatio, tStart, tEnd, count, t, d4, d5, out1, d6, err, d7, chapterRaw, chapterEmb, currentChunkVecSum, currentChunkTokenCount, currentChunkText, currentLen, similarityThreshold, minChunkSize, maxChunkSize, recordsBatch, voyBatch, finalizeChunkLocal, j1, sentence1, vec1, meanVec, d8, mag, d9, d10, similarity, isTopicShift, isTooBig, d11, err1, reason1, ref1;
        return (0,tslib_es6.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!initialized) return [
                        2
                    ];
                    // PHASE 2: Lite mode - Store text chunks only, no embeddings
                    if (liteMode) {
                        return [
                            2,
                            processSectionLite(bookId, markdown, metadata)
                        ];
                    }
                    if (!voyChunks || !voyChapters) return [
                        2
                    ];
                    // High-performance backends (Firefox, Wllama) use the optimized batch processor
                    if (backend === "wllama" || backend === "firefox-native" || firefoxDelegate) {
                        return [
                            2,
                            processSectionOptimized(bookId, markdown, metadata)
                        ];
                    }
                    if (!embedder) return [
                        2
                    ];
                    doneSent = false;
                    donePayload = {
                        sectionIndex: (ref = metadata === null || metadata === void 0 ? void 0 : metadata.sectionIndex) !== null && ref !== void 0 ? ref : -1,
                        skipped: false
                    };
                    sendDone = function(p) {
                        if (!doneSent) {
                            doneSent = true;
                            self.postMessage({
                                type: "sectionDone",
                                payload: p
                            });
                        }
                    };
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        22,
                        23,
                        24
                    ]);
                    // Bulletproof Hardening v3.5: Structured Skip Reporting
                    if (!markdown || markdown.trim().length === 0 || metadata.skipped) {
                        reason = metadata.reason || "empty markdown";
                        skippedSections.push({
                            sectionIndex: metadata.sectionIndex,
                            reason: reason
                        });
                        donePayload = {
                            sectionIndex: metadata.sectionIndex,
                            skipped: true,
                            reason: reason
                        };
                        sendDone(donePayload);
                        return [
                            2
                        ];
                    }
                    return [
                        4,
                        embedder.tokenizer(markdown)
                    ];
                case 2:
                    markdownTokens = _state.sent();
                    inputIds = markdownTokens.input_ids.data;
                    numTokens = inputIds.length;
                    MAX_LATE_CHUNK_TOKENS = 8000;
                    useLateChunking = numTokens <= MAX_LATE_CHUNK_TOKENS;
                    tokenEmbeddings = null;
                    if (!useLateChunking) return [
                        3,
                        11
                    ];
                    WINDOW_SIZE = 510 // Less than 512 to be safe
                    ;
                    STRIDE = 384;
                    tokenEmbeddings = new Float32Array(numTokens * embedDim);
                    tokenWeight = new Float32Array(numTokens).fill(0);
                    lateOk = true;
                    i = 0;
                    _state.label = 3;
                case 3:
                    if (!(i < numTokens)) return [
                        3,
                        10
                    ];
                    if (cancelled) return [
                        3,
                        10
                    ];
                    end = Math.min(i + WINDOW_SIZE, numTokens);
                    windowView = viewIds(inputIds, i, end);
                    windowIds = toIntArray(windowView);
                    if (windowIds.length === 0) return [
                        3,
                        9
                    ];
                    _state.label = 4;
                case 4:
                    _state.trys.push([
                        4,
                        6,
                        ,
                        7
                    ]);
                    textWindow = embedder.tokenizer.decode(windowIds, {
                        skip_special_tokens: true
                    });
                    if (!textWindow || textWindow.trim().length === 0) return [
                        3,
                        9
                    ];
                    return [
                        4,
                        embedder(textWindow, {
                            pooling: "none"
                        })
                    ];
                case 5:
                    out = _state.sent();
                    data = out.data;
                    seqLen = Math.floor(data.length / embedDim);
                    if (seqLen !== windowIds.length) {
                        console.warn("Late Chunking Mismatch [".concat(metadata === null || metadata === void 0 ? void 0 : metadata.sectionIndex, "]: Tokens ").concat(windowIds.length, " vs Embeds ").concat(seqLen, ". Falling back to standard pooling."));
                        lateOk = false;
                        tokenEmbeddings = null;
                        return [
                            3,
                            10
                        ];
                    }
                    windowLen = windowIds.length;
                    // Average overlapping regions
                    for(j = 0; j < windowLen; j++){
                        globalIdx = i + j;
                        if (globalIdx >= numTokens) break;
                        startOff = globalIdx * embedDim;
                        winOff = j * embedDim;
                        for(d = 0; d < embedDim; d++){
                            tokenEmbeddings[startOff + d] += data[winOff + d];
                        }
                        tokenWeight[globalIdx]++;
                    }
                    return [
                        3,
                        7
                    ];
                case 6:
                    e = _state.sent();
                    console.warn("Late Chunking Error [".concat(metadata === null || metadata === void 0 ? void 0 : metadata.sectionIndex, "]: ").concat(e.message, ". Falling back."));
                    lateOk = false;
                    tokenEmbeddings = null;
                    return [
                        3,
                        10
                    ];
                case 7:
                    return [
                        4,
                        yieldToWorker()
                    ];
                case 8:
                    _state.sent();
                    _state.label = 9;
                case 9:
                    i += STRIDE;
                    return [
                        3,
                        3
                    ];
                case 10:
                    // Finalize token embeddings (average overlaps) only if logic held up
                    if (lateOk && tokenEmbeddings) {
                        for(i1 = 0; i1 < numTokens; i1++){
                            weight = tokenWeight[i1];
                            if (weight > 1) {
                                off = i1 * embedDim;
                                for(d1 = 0; d1 < embedDim; d1++)tokenEmbeddings[off + d1] /= weight;
                            }
                        }
                    } else {
                        // Ensure null if failed
                        tokenEmbeddings = null;
                    }
                    _state.label = 11;
                case 11:
                    sectionSumVec = new Float32Array(embedDim);
                    if (useLateChunking && tokenEmbeddings) {
                        for(i2 = 0; i2 < numTokens; i2++){
                            off1 = i2 * embedDim;
                            for(d2 = 0; d2 < embedDim; d2++)sectionSumVec[d2] += tokenEmbeddings[off1 + d2];
                        }
                        if (numTokens > 0) {
                            for(d3 = 0; d3 < embedDim; d3++)sectionSumVec[d3] /= numTokens;
                        }
                    }
                    sentences = splitSentences(markdown, currentLocale);
                    if (sentences.length === 0) return [
                        2
                    ];
                    currentPos = 0;
                    sentenceVectors = [];
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 12;
                case 12:
                    _state.trys.push([
                        12,
                        19,
                        20,
                        21
                    ]);
                    _iterator = sentences[Symbol.iterator]();
                    _state.label = 13;
                case 13:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        18
                    ];
                    sentence = _step.value;
                    startIdx = markdown.indexOf(sentence, currentPos);
                    if (startIdx === -1) {
                        searchSlice = sentence.slice(0, 30).trim();
                        startIdx = markdown.indexOf(searchSlice, currentPos);
                    }
                    if (startIdx === -1) {
                        sentenceVectors.push(new Float32Array(embedDim));
                        return [
                            3,
                            17
                        ];
                    }
                    currentPos = startIdx + sentence.length;
                    vec = new Float32Array(embedDim);
                    if (!(useLateChunking && tokenEmbeddings)) return [
                        3,
                        14
                    ];
                    charStartRatio = startIdx / markdown.length;
                    charEndRatio = (startIdx + sentence.length) / markdown.length;
                    tStart = Math.floor(charStartRatio * numTokens);
                    tEnd = Math.ceil(charEndRatio * numTokens);
                    count = 0;
                    for(t = tStart; t < tEnd && t < numTokens; t++){
                        for(d4 = 0; d4 < embedDim; d4++)vec[d4] += tokenEmbeddings[t * embedDim + d4];
                        count++;
                    }
                    if (count > 0) for(d5 = 0; d5 < embedDim; d5++)vec[d5] /= count;
                    return [
                        3,
                        16
                    ];
                case 14:
                    return [
                        4,
                        embedder(sentence, {
                            pooling: "mean",
                            normalize: true
                        })
                    ];
                case 15:
                    out1 = _state.sent();
                    vec.set(out1.data);
                    // Add to section sum for chapter embedding
                    for(d6 = 0; d6 < embedDim; d6++)sectionSumVec[d6] += vec[d6];
                    _state.label = 16;
                case 16:
                    normalizeInPlace(vec);
                    sentenceVectors.push(vec);
                    _state.label = 17;
                case 17:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        13
                    ];
                case 18:
                    return [
                        3,
                        21
                    ];
                case 19:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        21
                    ];
                case 20:
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
                case 21:
                    // Finalize Chapter Embedding if it was rolling
                    if (!useLateChunking) {
                        if (sentences.length > 0) {
                            for(d7 = 0; d7 < embedDim; d7++)sectionSumVec[d7] /= sentences.length;
                        }
                    }
                    normalizeInPlace(sectionSumVec);
                    // Save Chapter Vector
                    if (voyChapters) {
                        chapterRaw = voyAcceptsTypedArrays ? new Float32Array(sectionSumVec) : Array.from(sectionSumVec);
                        chapterEmb = maybeTruncateEmbedding(chapterRaw);
                        voyChapters.add({
                            embeddings: [
                                {
                                    id: String(metadata.sectionIndex),
                                    title: "",
                                    url: "",
                                    embeddings: chapterEmb
                                }
                            ]
                        });
                    }
                    currentChunkVecSum = new Float32Array(embedDim);
                    currentChunkTokenCount = 0;
                    currentChunkText = [];
                    currentLen = 0;
                    similarityThreshold = 0.5;
                    minChunkSize = 100;
                    maxChunkSize = 2500;
                    recordsBatch = [];
                    voyBatch = [];
                    finalizeChunkLocal = function(idx) {
                        var content = currentChunkText.join(" ");
                        normalizeInPlace(currentChunkVecSum);
                        var embRaw = voyAcceptsTypedArrays ? new Float32Array(currentChunkVecSum) : Array.from(currentChunkVecSum);
                        var embToSend = maybeTruncateEmbedding(embRaw);
                        voyBatch.push({
                            id: String(idx),
                            title: "",
                            url: "",
                            embeddings: embToSend
                        });
                        if (voyBatch.length >= 64) {
                            voyChunks.add({
                                embeddings: (0,_to_consumable_array/* default */.Z)(voyBatch)
                            });
                            voyBatch.length = 0;
                        }
                        recordsBatch.push({
                            bookId: bookId,
                            content: content,
                            index: idx,
                            metadata: metadata
                        });
                        currentChunkText = [];
                        currentLen = 0;
                        currentChunkVecSum.fill(0);
                        currentChunkTokenCount = 0;
                    };
                    for(j1 = 0; j1 < sentences.length; j1++){
                        if (cancelled) break;
                        sentence1 = sentences[j1];
                        vec1 = sentenceVectors[j1];
                        if (currentChunkText.length > 0) {
                            meanVec = new Float32Array(embedDim);
                            for(d8 = 0; d8 < embedDim; d8++){
                                meanVec[d8] = currentChunkVecSum[d8] / (currentChunkTokenCount || 1);
                            }
                            mag = 0;
                            for(d9 = 0; d9 < embedDim; d9++)mag += meanVec[d9] * meanVec[d9];
                            mag = Math.sqrt(mag);
                            if (mag > 0) {
                                for(d10 = 0; d10 < embedDim; d10++)meanVec[d10] /= mag;
                            }
                            similarity = dotProduct(meanVec, vec1);
                            isTopicShift = sentence1.length > 25 && similarity < similarityThreshold;
                            isTooBig = currentLen + sentence1.length > maxChunkSize;
                            if (isTopicShift && currentLen >= minChunkSize || isTooBig) {
                                finalizeChunkLocal(itemsAdded++);
                            }
                        }
                        currentChunkText.push(sentence1);
                        currentLen += (currentChunkText.length > 1 ? 1 : 0) + sentence1.length;
                        for(d11 = 0; d11 < embedDim; d11++)currentChunkVecSum[d11] += vec1[d11];
                        currentChunkTokenCount++;
                        if (recordsBatch.length >= 12) {
                            self.postMessage({
                                type: "records",
                                payload: (0,_to_consumable_array/* default */.Z)(recordsBatch)
                            });
                            recordsBatch.length = 0;
                        }
                    }
                    if (currentChunkText.length > 0) finalizeChunkLocal(itemsAdded++);
                    if (voyBatch.length > 0) voyChunks.add({
                        embeddings: voyBatch
                    });
                    if (recordsBatch.length > 0) self.postMessage({
                        type: "records",
                        payload: recordsBatch
                    });
                    sendDone(donePayload);
                    return [
                        3,
                        24
                    ];
                case 22:
                    err1 = _state.sent();
                    reason1 = String((err1 === null || err1 === void 0 ? void 0 : err1.message) || err1);
                    console.error("Worker Section Processor Failure [".concat(metadata === null || metadata === void 0 ? void 0 : metadata.sectionIndex, "]:"), reason1);
                    donePayload = {
                        sectionIndex: (ref1 = metadata === null || metadata === void 0 ? void 0 : metadata.sectionIndex) !== null && ref1 !== void 0 ? ref1 : -1,
                        skipped: true,
                        reason: reason1
                    };
                    skippedSections.push({
                        sectionIndex: donePayload.sectionIndex,
                        reason: reason1
                    });
                    self.postMessage({
                        type: "error",
                        payload: {
                            sectionIndex: metadata === null || metadata === void 0 ? void 0 : metadata.sectionIndex,
                            reason: reason1,
                            fatal: false
                        }
                    });
                    return [
                        3,
                        24
                    ];
                case 23:
                    // GARANTIA ABSOLUTA: Always send the most accurate payload we have
                    sendDone(donePayload);
                    return [
                        7
                    ];
                case 24:
                    return [
                        2
                    ];
            }
        });
    });
    return _processSection.apply(this, arguments);
}
function processSectionOptimized(bookId, markdown, metadata) {
    return _processSectionOptimized.apply(this, arguments);
}
function _processSectionOptimized() {
    _processSectionOptimized = (0,_async_to_generator/* default */.Z)(function(bookId, markdown, metadata) {
        var doneSent, ref, donePayload, sendDone, reason, sentences, reason1, preChunks, totalPreChunkTokens, chunkVectors, sectionSumVec, embedStartedAt, embedMs, similarityThreshold, merged, currentText, currentTokens, currentVec, currentCount, i, nextVec, sim, nextChunk, combinedLen, combinedTokens, newCount, d, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, mc, d1, d2, chapterRaw, chapterEmb, recordsBatch, voyBatch, i1, mc1, embRaw, embToSend, err1, reason2, ref1;
        return (0,tslib_es6.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!initialized || !voyChunks || !voyChapters) return [
                        2
                    ];
                    // SOTA v3.11: On-Start Robustness
                    // Wllama download is now triggered during 'initialize' (Mode Selection).
                    // We keep a safety check here just in case, but only if downloads are allowed.
                    if (!wllama && !liteMode && backend === "wllama") {
                        // Check if download is allowed (defaults to true)
                        // Note: We don't have access to global config here easily without passing it.
                        // But initialized logic should have ideally handled it.
                        // If we are here, we just try to ensure it exists if permitted.
                        // Since we can't easily check config, we will skip the optimistic download here
                        // and rely on the main flow or user interaction to trigger it if missing.
                        // This avoids the bug where it auto-downloads even if disabled.
                        console.log("[RAG WORKER] processSectionOptimized: Wllama check skipped to respect potential user settings.");
                    }
                    doneSent = false;
                    donePayload = {
                        sectionIndex: (ref = metadata === null || metadata === void 0 ? void 0 : metadata.sectionIndex) !== null && ref !== void 0 ? ref : -1,
                        skipped: false
                    };
                    sendDone = function(p) {
                        if (!doneSent) {
                            doneSent = true;
                            self.postMessage({
                                type: "sectionDone",
                                payload: p
                            });
                        }
                    };
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        4,
                        5
                    ]);
                    if (!markdown || markdown.trim().length === 0 || metadata.skipped) {
                        reason = metadata.reason || "empty markdown";
                        skippedSections.push({
                            sectionIndex: metadata.sectionIndex,
                            reason: reason
                        });
                        donePayload = {
                            sectionIndex: metadata.sectionIndex,
                            skipped: true,
                            reason: reason
                        };
                        sendDone(donePayload);
                        return [
                            2
                        ];
                    }
                    sentences = splitSentences(markdown, currentLocale);
                    if (sentences.length === 0) {
                        reason1 = "no sentences";
                        skippedSections.push({
                            sectionIndex: metadata.sectionIndex,
                            reason: reason1
                        });
                        donePayload = {
                            sectionIndex: metadata.sectionIndex,
                            skipped: true,
                            reason: reason1
                        };
                        sendDone(donePayload);
                        return [
                            2
                        ];
                    }
                    preChunks = ENABLE_TOKEN_AWARE_PRECHUNKING ? buildTokenAwarePreChunks(sentences, currentLocale) : buildLegacyCharPreChunks(sentences, currentLocale);
                    if (ENABLE_TOKEN_AWARE_PRECHUNKING && preChunks.length === 0) {
                        preChunks = buildLegacyCharPreChunks(sentences, currentLocale);
                    }
                    totalPreChunkTokens = preChunks.reduce(function(acc, chunk) {
                        return acc + chunk.tokenCount;
                    }, 0);
                    console.log("[RAG WORKER] Section", metadata.sectionIndex, ": token-aware pre-chunking", {
                        sentences: sentences.length,
                        chunks: preChunks.length,
                        avgTokens: preChunks.length > 0 ? Number((totalPreChunkTokens / preChunks.length).toFixed(1)) : 0,
                        overlapTokens: TOKEN_PRECHUNK_OVERLAP_TOKENS
                    });
                    chunkVectors = [];
                    sectionSumVec = new Float32Array(embedDim);
                    embedStartedAt = Date.now();
                    return [
                        4,
                        embedBatch(preChunks.map(function(c) {
                            return c.text;
                        }), "document")
                    ];
                case 2:
                    chunkVectors = _state.sent();
                    embedMs = Date.now() - embedStartedAt;
                    console.log("[RAG WORKER] Section", metadata.sectionIndex, ": embedding batch timing", {
                        chunks: preChunks.length,
                        ms: embedMs,
                        msPerChunk: Number((embedMs / Math.max(1, preChunks.length)).toFixed(1))
                    });
                    similarityThreshold = computeAdaptiveMergeThreshold(chunkVectors);
                    merged = [];
                    if (chunkVectors.length > 0) {
                        currentText = preChunks[0].text;
                        currentTokens = preChunks[0].tokenCount;
                        currentVec = new Float32Array(chunkVectors[0]);
                        currentCount = 1;
                        for(i = 1; i < preChunks.length; i++){
                            nextVec = chunkVectors[i];
                            if (!nextVec || nextVec.length === 0) continue;
                            sim = cosineSimilarity(currentVec, nextVec);
                            nextChunk = preChunks[i];
                            combinedLen = currentText.length + nextChunk.text.length + 1;
                            combinedTokens = currentTokens + nextChunk.tokenCount;
                            if (sim >= similarityThreshold && combinedLen <= SEMANTIC_MERGE_MAX_CHARS && combinedTokens <= SEMANTIC_MERGE_MAX_TOKENS) {
                                // Merge: high similarity = same topic, combine text and average vectors
                                currentText += " " + nextChunk.text;
                                newCount = currentCount + 1;
                                for(d = 0; d < embedDim; d++){
                                    currentVec[d] = (currentVec[d] * currentCount + nextVec[d]) / newCount;
                                }
                                currentCount = newCount;
                                currentTokens = combinedTokens;
                            } else {
                                // Topic shift or size limit: finalize current chunk
                                normalizeInPlace(currentVec);
                                merged.push({
                                    text: currentText,
                                    vec: currentVec
                                });
                                currentText = nextChunk.text;
                                currentTokens = nextChunk.tokenCount;
                                currentVec = new Float32Array(nextVec);
                                currentCount = 1;
                            }
                        }
                        // Finalize last chunk
                        normalizeInPlace(currentVec);
                        merged.push({
                            text: currentText,
                            vec: currentVec
                        });
                    }
                    console.log("[RAG WORKER] Section", metadata.sectionIndex, ": topic-shift merge", {
                        preChunks: preChunks.length,
                        semanticChunks: merged.length,
                        threshold: Number(similarityThreshold.toFixed(3)),
                        mergeMaxTokens: SEMANTIC_MERGE_MAX_TOKENS
                    });
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        // Process sum for chapter index using merged vectors
                        for(_iterator = merged[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            mc = _step.value;
                            for(d1 = 0; d1 < embedDim; d1++)sectionSumVec[d1] += mc.vec[d1];
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    console.log("[RAG WORKER] Section", metadata.sectionIndex, "embedding complete, chunks:", merged.length);
                    if (merged.length > 0) {
                        for(d2 = 0; d2 < embedDim; d2++)sectionSumVec[d2] /= merged.length;
                    }
                    normalizeInPlace(sectionSumVec);
                    // Add to chapter index
                    if (voyChapters) {
                        chapterRaw = voyAcceptsTypedArrays ? new Float32Array(sectionSumVec) : Array.from(sectionSumVec);
                        chapterEmb = maybeTruncateEmbedding(chapterRaw);
                        voyChapters.add({
                            embeddings: [
                                {
                                    id: String(metadata.sectionIndex),
                                    title: "",
                                    url: "",
                                    embeddings: chapterEmb
                                }
                            ]
                        });
                    }
                    recordsBatch = [];
                    voyBatch = [];
                    for(i1 = 0; i1 < merged.length; i1++){
                        if (cancelled) break;
                        mc1 = merged[i1];
                        embRaw = voyAcceptsTypedArrays ? new Float32Array(mc1.vec) : Array.from(mc1.vec);
                        embToSend = maybeTruncateEmbedding(embRaw);
                        voyBatch.push({
                            id: String(itemsAdded),
                            title: "",
                            url: "",
                            embeddings: embToSend
                        });
                        if (voyBatch.length >= 64) {
                            voyChunks.add({
                                embeddings: (0,_to_consumable_array/* default */.Z)(voyBatch)
                            });
                            voyBatch.length = 0;
                        }
                        recordsBatch.push({
                            bookId: bookId,
                            content: mc1.text,
                            index: itemsAdded,
                            metadata: metadata
                        });
                        itemsAdded++;
                        if (recordsBatch.length >= 12) {
                            self.postMessage({
                                type: "records",
                                payload: (0,_to_consumable_array/* default */.Z)(recordsBatch)
                            });
                            recordsBatch.length = 0;
                        }
                    }
                    // Flush remaining
                    if (voyBatch.length > 0) {
                        voyChunks.add({
                            embeddings: (0,_to_consumable_array/* default */.Z)(voyBatch)
                        });
                    }
                    if (recordsBatch.length > 0) {
                        self.postMessage({
                            type: "records",
                            payload: recordsBatch
                        });
                    }
                    donePayload = {
                        sectionIndex: metadata.sectionIndex,
                        skipped: false
                    };
                    sendDone(donePayload);
                    return [
                        3,
                        5
                    ];
                case 3:
                    err1 = _state.sent();
                    reason2 = String((err1 === null || err1 === void 0 ? void 0 : err1.message) || err1);
                    console.error("Worker Section Processor Failure [".concat(metadata === null || metadata === void 0 ? void 0 : metadata.sectionIndex, "]:"), reason2);
                    donePayload = {
                        sectionIndex: (ref1 = metadata === null || metadata === void 0 ? void 0 : metadata.sectionIndex) !== null && ref1 !== void 0 ? ref1 : -1,
                        skipped: true,
                        reason: reason2
                    };
                    skippedSections.push({
                        sectionIndex: donePayload.sectionIndex,
                        reason: reason2
                    });
                    self.postMessage({
                        type: "error",
                        payload: {
                            sectionIndex: metadata === null || metadata === void 0 ? void 0 : metadata.sectionIndex,
                            reason: reason2,
                            fatal: false
                        }
                    });
                    return [
                        3,
                        5
                    ];
                case 4:
                    sendDone(donePayload);
                    return [
                        7
                    ];
                case 5:
                    return [
                        2
                    ];
            }
        });
    });
    return _processSectionOptimized.apply(this, arguments);
}
/**
 * Worker Listener
 */ self.onmessage = function() {
    var _ref = (0,_async_to_generator/* default */.Z)(function(e) {
        var _data, type, payload, ref, ref1, chunks, chapters, requestId, mode, vec, err, message, id, vector, error, pending, vec1, id1, vectors, error1, pending1, chunks1;
        return (0,tslib_es6.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    _data = e.data, type = _data.type, payload = _data.payload;
                    console.log("[RAG WORKER] Received message:", type);
                    switch(type){
                        case "init":
                            return [
                                3,
                                1
                            ];
                        case "index":
                            return [
                                3,
                                3
                            ];
                        case "finalize":
                            return [
                                3,
                                5
                            ];
                        case "cancel":
                            return [
                                3,
                                6
                            ];
                        case "embed":
                            return [
                                3,
                                7
                            ];
                        case "embedding-response":
                            return [
                                3,
                                12
                            ];
                        case "embedding-batch-response":
                            return [
                                3,
                                13
                            ];
                    }
                    return [
                        3,
                        14
                    ];
                case 1:
                    console.log("[RAG WORKER] Starting initialization...");
                    cancelled = false;
                    itemsAdded = 0;
                    return [
                        4,
                        initialize(payload)
                    ];
                case 2:
                    _state.sent();
                    console.log("[RAG WORKER] Initialization complete, initialized=", initialized);
                    return [
                        3,
                        14
                    ];
                case 3:
                    console.log("[RAG WORKER] Processing section:", payload === null || payload === void 0 ? void 0 : (ref = payload.metadata) === null || ref === void 0 ? void 0 : ref.sectionIndex);
                    if (cancelled) return [
                        2
                    ];
                    return [
                        4,
                        processSection(payload.bookId, payload.markdown, payload.metadata)
                    ];
                case 4:
                    _state.sent();
                    console.log("[RAG WORKER] Section done:", payload === null || payload === void 0 ? void 0 : (ref1 = payload.metadata) === null || ref1 === void 0 ? void 0 : ref1.sectionIndex);
                    return [
                        3,
                        14
                    ];
                case 5:
                    if (voyChunks && voyChapters) {
                        // v3.5: Barrier Flush
                        self.postMessage({
                            type: "records",
                            payload: []
                        });
                        chunks = voyChunks.serialize();
                        chapters = voyChapters.serialize();
                        self.postMessage({
                            type: "finalized",
                            payload: {
                                chunks: chunks,
                                chapters: chapters,
                                itemsAdded: itemsAdded,
                                dim: outputDim,
                                skippedSections: skippedSections
                            }
                        });
                    }
                    return [
                        3,
                        14
                    ];
                case 6:
                    cancelled = true;
                    return [
                        3,
                        14
                    ];
                case 7:
                    requestId = e.data.requestId;
                    _state.label = 8;
                case 8:
                    _state.trys.push([
                        8,
                        10,
                        ,
                        11
                    ]);
                    if (!initialized) throw new Error("RAG worker not initialized");
                    mode = (payload === null || payload === void 0 ? void 0 : payload.mode) === "document" ? "document" : "query";
                    return [
                        4,
                        embedText((payload === null || payload === void 0 ? void 0 : payload.text) || "", mode)
                    ];
                case 9:
                    vec = _state.sent();
                    // Return transferable buffer to avoid copies.
                    self.postMessage({
                        type: "embed-result",
                        requestId: requestId,
                        payload: {
                            vector: vec,
                            dim: vec.length
                        }
                    }, (vec === null || vec === void 0 ? void 0 : vec.buffer) ? [
                        vec.buffer
                    ] : undefined);
                    return [
                        3,
                        11
                    ];
                case 10:
                    err = _state.sent();
                    message = String((err === null || err === void 0 ? void 0 : err.message) || err);
                    debugLog("embed_error", {
                        message: message
                    });
                    self.postMessage({
                        type: "embedding-error",
                        data: {
                            message: message,
                            stage: "embed"
                        }
                    });
                    self.postMessage({
                        type: "embed-result",
                        requestId: requestId,
                        payload: {
                            error: message
                        }
                    });
                    return [
                        3,
                        11
                    ];
                case 11:
                    return [
                        3,
                        14
                    ];
                case 12:
                    {
                        id = payload.id, vector = payload.vector, error = payload.error;
                        pending = pendingEmbeddings.get(id);
                        if (pending) {
                            pendingEmbeddings.delete(id);
                            if (error) {
                                pending.reject(new Error(error));
                            } else if (vector) {
                                vec1 = (0,_instanceof/* default */.Z)(vector, Float32Array) ? vector : new Float32Array(vector);
                                pending.resolve(vec1);
                            } else {
                                pending.reject(new Error("Invalid response from main thread"));
                            }
                        }
                        return [
                            3,
                            14
                        ];
                    }
                    _state.label = 13;
                case 13:
                    {
                        id1 = payload.id, vectors = payload.vectors, error1 = payload.error;
                        pending1 = pendingEmbedBatch.get(id1);
                        if (pending1) {
                            pendingEmbedBatch.delete(id1);
                            if (error1) {
                                pending1.reject(new Error(error1));
                            } else if (vectors && Array.isArray(vectors)) {
                                chunks1 = vectors.map(function(v) {
                                    return (0,_instanceof/* default */.Z)(v, Float32Array) ? v : new Float32Array(v);
                                });
                                pending1.resolve(chunks1);
                            } else {
                                pending1.reject(new Error("Invalid batch response from main thread"));
                            }
                        }
                        return [
                            3,
                            14
                        ];
                    }
                    _state.label = 14;
                case 14:
                    return [
                        2
                    ];
            }
        });
    });
    return function(e) {
        return _ref.apply(this, arguments);
    };
}();


/***/ })

}]);