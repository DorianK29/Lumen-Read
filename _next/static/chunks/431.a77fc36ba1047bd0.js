"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[431],{

/***/ 4431:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ChatbotSidebar": function() { return /* binding */ ChatbotSidebar; }
});

// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_async_to_generator.mjs
var _async_to_generator = __webpack_require__(947);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_instanceof.mjs
var _instanceof = __webpack_require__(8149);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_sliced_to_array.mjs + 2 modules
var _sliced_to_array = __webpack_require__(1296);
// EXTERNAL MODULE: ../../node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(2336);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react@18.0.0/node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(1999);
// EXTERNAL MODULE: ../../node_modules/.pnpm/clsx@1.1.1/node_modules/clsx/dist/clsx.m.js
var clsx_m = __webpack_require__(5789);
// EXTERNAL MODULE: ../../node_modules/.pnpm/dexie-react-hooks@1.1.1_@types+react@18.0.0_dexie@3.2.2_react@18.0.0/node_modules/dexie-react-hooks/dist/dexie-react-hooks.js
var dexie_react_hooks = __webpack_require__(4010);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react@18.0.0/node_modules/react/index.js
var react = __webpack_require__(6248);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react-icons@4.3.1_react@18.0.0/node_modules/react-icons/md/index.esm.js + 4 modules
var index_esm = __webpack_require__(5615);
// EXTERNAL MODULE: ./src/db.ts
var db = __webpack_require__(2543);
// EXTERNAL MODULE: ./src/hooks/index.ts + 26 modules
var hooks = __webpack_require__(6901);
// EXTERNAL MODULE: ./src/hooks/useTranslation.ts + 8 modules
var useTranslation = __webpack_require__(2397);
// EXTERNAL MODULE: ./src/lib/ai/firefoxMLState.ts
var firefoxMLState = __webpack_require__(4110);
// EXTERNAL MODULE: ./src/lib/ai/language.ts + 6 modules
var language = __webpack_require__(507);
// EXTERNAL MODULE: ./src/lib/ai/llm.ts + 554 modules
var ai_llm = __webpack_require__(9886);
// EXTERNAL MODULE: ./src/lib/ai/rag.ts + 2 modules
var ai_rag = __webpack_require__(9316);
// EXTERNAL MODULE: ./src/lib/ai/rewriter.ts
var rewriter = __webpack_require__(5345);
// EXTERNAL MODULE: ./src/models/index.ts + 2 modules
var models = __webpack_require__(1964);
// EXTERNAL MODULE: ./src/state.ts
var src_state = __webpack_require__(1477);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_class_call_check.mjs
var _class_call_check = __webpack_require__(4656);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_define_property.mjs
var _define_property = __webpack_require__(7705);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_inherits.mjs
var _inherits = __webpack_require__(3459);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_object_spread.mjs
var _object_spread = __webpack_require__(6690);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_object_spread_props.mjs
var _object_spread_props = __webpack_require__(3089);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_wrap_native_super.mjs + 1 modules
var _wrap_native_super = __webpack_require__(6071);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_create_super.mjs + 2 modules
var _create_super = __webpack_require__(4802);
// EXTERNAL MODULE: ./src/lib/ai/config.ts
var config = __webpack_require__(601);
// EXTERNAL MODULE: ./src/lib/ai/permissions.ts
var permissions = __webpack_require__(1);
// EXTERNAL MODULE: ./src/lib/security/redact.ts
var redact = __webpack_require__(7567);
// EXTERNAL MODULE: ./src/components/Button.tsx
var Button = __webpack_require__(4599);
// EXTERNAL MODULE: ./src/components/Form.tsx
var Form = __webpack_require__(8188);
;// CONCATENATED MODULE: ./src/components/StatusIndicator.tsx




var StatusIndicator = function(param) {
    var label = param.label, status = param.status, progress = param.progress, onClick = param.onClick, icon = param.icon, tooltip = param.tooltip, statusText = param.statusText, errorMessage = param.errorMessage, warningMessage = param.warningMessage, className = param.className;
    var isDownloading = status === "downloading";
    var isSuccess = status === "ready" || status === "warning";
    var hasWarning = status === "warning" || !!warningMessage;
    var getIcon = function() {
        switch(status){
            case "ready":
                return /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdCheckCircle */.ZSR, {
                    className: "text-green-500"
                });
            case "error":
                return /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdError */.vVM, {
                    className: "text-red-500"
                });
            // Warning means "downloaded/working, but with a known limitation" (e.g. single-thread in Firefox MV3).
            case "warning":
                return /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                    className: "flex items-center gap-0.5",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdCheckCircle */.ZSR, {
                            className: "text-green-500"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdWarning */.YTL, {
                            className: "text-yellow-500"
                        })
                    ]
                });
            case "downloading":
                return /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdHourglassEmpty */.Ley, {
                    className: "text-blue-500 animate-spin"
                });
            default:
                return /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdCloudDownload */.YZd, {
                    className: "text-subtle"
                });
        }
    };
    var getText = function() {
        if (status === "error" && errorMessage) return errorMessage;
        if (status === "warning") {
            var ready = (statusText === null || statusText === void 0 ? void 0 : statusText.ready) || "ready";
            var warn = warningMessage || (statusText === null || statusText === void 0 ? void 0 : statusText.warning) || "warning";
            return warn ? "".concat(ready, "\n").concat(warn) : ready;
        }
        if (status === "unknown") return (statusText === null || statusText === void 0 ? void 0 : statusText.clickToDownload) || status;
        if (status === "downloading" && typeof progress === "number" && Number.isFinite(progress)) {
            var pct = Math.max(0, Math.min(100, Math.round(progress)));
            var base = (statusText === null || statusText === void 0 ? void 0 : statusText.downloading) || status;
            return pct > 0 ? "".concat(base, " (").concat(pct, "%)") : base;
        }
        return (statusText === null || statusText === void 0 ? void 0 : statusText[status]) || status;
    };
    var titleText = [
        tooltip,
        getText()
    ].filter(Boolean).join("\n");
    var handleClick = function() {
        if (isDownloading) return;
        onClick === null || onClick === void 0 ? void 0 : onClick();
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
        type: "button",
        onClick: handleClick,
        title: titleText,
        // Do NOT set `disabled` for ready/warning; disabled buttons don't show tooltips in Firefox.
        "aria-disabled": isDownloading || !onClick,
        className: (0,clsx_m/* default */.Z)("flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium border transition-all", isSuccess ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400" : status === "error" ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400" : status === "downloading" ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400" : "bg-surface-2 border-border-light hover:bg-surface-3 text-subtle hover:text-text", isDownloading || !onClick ? "cursor-default opacity-90" : "cursor-pointer", className),
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                className: "opacity-70",
                children: icon
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                children: label
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                className: "text-xs",
                children: getIcon()
            }),
            status !== "warning" && hasWarning && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                className: "text-xs",
                title: warningMessage || (statusText === null || statusText === void 0 ? void 0 : statusText.warning) || "",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdWarning */.YTL, {
                    className: "text-yellow-500"
                })
            })
        ]
    });
};

// EXTERNAL MODULE: ./src/components/icons/ProviderIcons.tsx
var ProviderIcons = __webpack_require__(4651);
;// CONCATENATED MODULE: ./src/components/AISettingsPanel.tsx






























var MdDeleteSweep = index_esm/* MdDeleteSweep */.tGS;
var MdLock = index_esm/* MdLock */.Tmq;
var MdRefresh = index_esm/* MdRefresh */.la_;
var MdSearch = index_esm/* MdSearch */.vU7;
var MdChevronRight = index_esm/* MdChevronRight */.FNi;
var MdCheck = index_esm/* MdCheck */.HhX;
var MdSmartToy = index_esm/* MdSmartToy */.yLM;
var MdComputer = index_esm/* MdComputer */.pUp;
var MdSettings = index_esm/* MdSettings */.b9P;
var MdClose = index_esm/* MdClose */.FU5;
var MdDns = index_esm/* MdDns */.dzP;
var MdVpnKey = index_esm/* MdVpnKey */.izl;
var MdVisibility = index_esm/* MdVisibility */.t2l;
var MdVisibilityOff = index_esm/* MdVisibilityOff */.wqE;
var MdContentPaste = index_esm/* MdContentPaste */.Vqr;
var MdStorage = index_esm/* MdStorage */.WMK;
var MdTranslate = index_esm/* MdTranslate */.mp2;
var GeminiIcon = ProviderIcons/* GeminiIcon */.Vz;
var OpenAIIcon = ProviderIcons/* OpenAIIcon */.Nz;
var AnthropicIcon = ProviderIcons/* AnthropicIcon */.Vw;
// SOTA: Internal component for handling Firefox Permissions
var PermissionButton = function() {
    var ref = (0,_sliced_to_array/* default */.Z)(react.useState("loading"), 2), status = ref[0], setStatus = ref[1];
    react.useEffect(function() {
        check();
    }, []);
    var check = function() {
        var _ref = (0,_async_to_generator/* default */.Z)(function() {
            var ref, isFirefoxBrowser, isTrialMLPermissionGranted, granted, e;
            return (0,tslib_es6.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4,
                            Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 4110))
                        ];
                    case 1:
                        ref = _state.sent(), isFirefoxBrowser = ref.isFirefoxBrowser, isTrialMLPermissionGranted = ref.isTrialMLPermissionGranted;
                        if (!isFirefoxBrowser()) {
                            setStatus("granted") // Not relevant for non-firefox, hide button
                            ;
                            return [
                                2
                            ];
                        }
                        return [
                            4,
                            isTrialMLPermissionGranted()
                        ];
                    case 2:
                        granted = _state.sent();
                        setStatus(granted ? "granted" : "idle");
                        return [
                            3,
                            4
                        ];
                    case 3:
                        e = _state.sent();
                        setStatus("idle");
                        return [
                            3,
                            4
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        });
        return function check() {
            return _ref.apply(this, arguments);
        };
    }();
    var request = function() {
        var _ref = (0,_async_to_generator/* default */.Z)(function() {
            var requestTrialMLPermissionSync, granted, e;
            return (0,tslib_es6.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            3,
                            ,
                            4
                        ]);
                        setStatus("loading");
                        return [
                            4,
                            Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 4110))
                        ];
                    case 1:
                        requestTrialMLPermissionSync = _state.sent().requestTrialMLPermissionSync;
                        return [
                            4,
                            requestTrialMLPermissionSync()
                        ];
                    case 2:
                        granted = _state.sent();
                        setStatus(granted ? "granted" : "denied");
                        return [
                            3,
                            4
                        ];
                    case 3:
                        e = _state.sent();
                        console.error(e);
                        setStatus("denied");
                        return [
                            3,
                            4
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        });
        return function request() {
            return _ref.apply(this, arguments);
        };
    }();
    if (status === "granted" || status === "loading") return null;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "bg-primary/5 border-primary/10 flex items-center justify-between gap-3 rounded-xl border p-3",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "text-primary flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                        className: "text-lg",
                        children: "\uD83D\uDE80"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                        className: "text-xs font-bold",
                        children: "Firefox Native AI"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                onClick: request,
                className: "bg-primary hover:bg-primary-dark rounded-lg px-3 py-1.5 text-[10px] font-bold text-white shadow-sm transition-colors",
                children: status === "denied" ? "Try Again" : "Grant Permission"
            })
        ]
    });
};
var TABS = [
    "General",
    "Persona",
    "Advanced"
];
var ModelFetchError = /*#__PURE__*/ function(Error1) {
    "use strict";
    (0,_inherits/* default */.Z)(ModelFetchError, Error1);
    var _super = (0,_create_super/* default */.Z)(ModelFetchError);
    function ModelFetchError(failure, message) {
        (0,_class_call_check/* default */.Z)(this, ModelFetchError);
        var _this;
        _this = _super.call(this, message);
        _this.failure = failure;
        _this.name = "ModelFetchError";
        return _this;
    }
    return ModelFetchError;
}((0,_wrap_native_super/* default */.Z)(Error));
function getConnectionTestFailure(status) {
    if (status === 401) return "unauthorized";
    if (status === 403) return "forbidden";
    if (status === 404 || status === 405) return "incompatible";
    return "failed";
}
var MODEL_FETCH_CACHE_TTL_MS = 10 * 60 * 1000;
var MODEL_FETCH_CACHE = new Map();
function buildModelCacheKey(provider, apiKey, baseUrl) {
    var trimmed = apiKey.trim();
    var endpoint = (baseUrl === null || baseUrl === void 0 ? void 0 : baseUrl.trim()) || "";
    if (!trimmed) return "".concat(provider, ":").concat(endpoint);
    var keyFingerprint = "".concat(trimmed.length, ":").concat(trimmed.slice(0, 4), ":").concat(trimmed.slice(-2));
    return "".concat(provider, ":").concat(endpoint, ":").concat(keyFingerprint);
}
var PremiumSelect = function(param) {
    var label = param.label, value = param.value, options = param.options, onChange = param.onChange, searchable = param.searchable, icon = param.icon, placeholder = param.placeholder;
    var t = (0,useTranslation/* useTranslation */.$)("ai");
    var ref = (0,react.useState)(false), isOpen = ref[0], setIsOpen = ref[1];
    var ref1 = (0,react.useState)(""), search = ref1[0], setSearch = ref1[1];
    var containerRef = react.useRef(null);
    var groups = react.useMemo(function() {
        if (!options || options.length === 0) return [];
        if (typeof options[0] === "string") {
            return [
                {
                    label: "",
                    options: options.map(function(o) {
                        return {
                            value: o
                        };
                    })
                }, 
            ];
        }
        if ("options" in options[0]) {
            return options;
        }
        return [
            {
                label: "",
                options: options
            }
        ];
    }, [
        options
    ]);
    var filteredGroups = groups.map(function(group) {
        return (0,_object_spread_props/* default */.Z)((0,_object_spread/* default */.Z)({}, group), {
            options: group.options.filter(function(o) {
                return (o.value || "").toLowerCase().includes(search.toLowerCase()) || o.label && o.label.toLowerCase().includes(search.toLowerCase());
            })
        });
    }).filter(function(group) {
        return group.options.length > 0;
    });
    var selectedOption = react.useMemo(function() {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = groups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var g = _step.value;
                var found = g.options.find(function(o) {
                    return o.value === value;
                });
                if (found) return found;
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
        return null;
    }, [
        groups,
        value
    ]);
    react.useEffect(function() {
        var handleClickOutside = function(event) {
            var target = event.target;
            if (containerRef.current && !containerRef.current.contains(target)) {
                // SOTA UX: Don't close if clicking within the AI settings panel (e.g., scrollbars, padding)
                // This prevents accidental closing when dragging the main sidebar scrollbar.
                if (target.closest(".ai-settings-panel")) {
                    // Check if it's a click that *should* close (like clicking another select or a button)
                    // but for now, we prioritize allowing scrollbar interactions in the panel.
                    // Detect scrollbar click via coordinate check (standard heuristic)
                    var isScrollbar = target.clientWidth < target.offsetWidth || target.clientHeight < target.offsetHeight;
                    if (isScrollbar) return;
                    // If the user clicked specifically on the scrollable container's background
                    // (prevents closing when clicking the track of the scrollbar)
                    if (target.classList.contains("ai-settings-panel-content")) return;
                    if (target.classList.contains("custom-scrollbar")) return;
                }
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return function() {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [
        isOpen
    ]);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: (0,clsx_m/* default */.Z)("relative space-y-1.5", isOpen && "z-[100]"),
        ref: containerRef,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                className: "text-subtle ml-1 block text-[11px] font-bold uppercase tracking-wider",
                children: label
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                onClick: function() {
                    return setIsOpen(!isOpen);
                },
                className: "border-border-light dark:border-border-dark hover:border-primary/50 group flex w-full items-center justify-between rounded-xl border bg-white p-3 text-sm transition-all dark:bg-gray-900",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex items-center gap-2.5 overflow-hidden text-left",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                className: "text-primary flex-shrink-0 whitespace-nowrap opacity-70 transition-opacity group-hover:opacity-100 [&>svg]:block [&>svg]:h-4 [&>svg]:w-4",
                                children: (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.icon) || icon
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                className: "truncate font-medium capitalize",
                                children: (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.label) || (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.value) || placeholder || t("settings.select_model_placeholder")
                            })
                        ]
                    }),
                    /*#__PURE__*/ react.createElement(MdChevronRight, {
                        className: (0,clsx_m/* default */.Z)("text-lg text-subtle transition-transform flex-shrink-0", isOpen && "rotate-90")
                    })
                ]
            }),
            isOpen && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "border-border-light dark:border-border-dark animate-in fade-in slide-in-from-top-2 absolute top-[calc(100%+4px)] left-0 z-[110] w-full overflow-hidden rounded-xl border bg-white shadow-2xl ring-4 ring-black/5 backdrop-blur-xl duration-200 dark:bg-gray-900",
                children: [
                    searchable && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "border-border-light dark:border-border-dark border-b bg-white/50 p-2 dark:bg-gray-900/50",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "relative flex items-center",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(MdSearch, {
                                    className: "text-subtle absolute left-3"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                    autoFocus: true,
                                    className: "border-border-light dark:border-border-dark focus:border-primary w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-xs focus:outline-none dark:bg-gray-900",
                                    placeholder: t("settings.search_placeholder"),
                                    value: search,
                                    onChange: function(e) {
                                        return setSearch(e.target.value);
                                    },
                                    onClick: function(e) {
                                        return e.stopPropagation();
                                    }
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "custom-scrollbar max-h-[250px] overflow-y-auto p-1",
                        children: [
                            filteredGroups.length === 0 && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "text-subtle p-4 text-center text-xs italic",
                                children: t("settings.no_results")
                            }),
                            filteredGroups.map(function(group, gIdx) {
                                return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "space-y-1",
                                    children: [
                                        group.label && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                            className: "text-subtle px-3 py-2 text-[10px] font-bold uppercase tracking-widest opacity-50",
                                            children: group.label
                                        }),
                                        group.options.map(function(opt) {
                                            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                                onClick: function() {
                                                    onChange(opt.value);
                                                    setIsOpen(false);
                                                },
                                                className: (0,clsx_m/* default */.Z)("hover:bg-primary/5 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors", value === opt.value ? "text-primary bg-primary/10 font-semibold" : "text-subtle hover:text-text"),
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "flex items-center gap-2.5 overflow-hidden",
                                                        children: [
                                                            opt.icon && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "flex-shrink-0 opacity-70 [&>svg]:block [&>svg]:h-4 [&>svg]:w-4",
                                                                children: opt.icon
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "truncate capitalize",
                                                                children: opt.label || opt.value
                                                            })
                                                        ]
                                                    }),
                                                    value === opt.value && /*#__PURE__*/ (0,jsx_runtime.jsx)(MdCheck, {
                                                        className: "text-primary flex-shrink-0"
                                                    })
                                                ]
                                            }, opt.value);
                                        })
                                    ]
                                }, group.label || gIdx);
                            })
                        ]
                    })
                ]
            })
        ]
    });
};
var Switch = function(param) {
    var checked = param.checked, onChange = param.onChange;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
        type: "button",
        role: "switch",
        "aria-checked": checked,
        onClick: function(e) {
            e.stopPropagation();
            onChange(!checked);
        },
        className: (0,clsx_m/* default */.Z)("focus:ring-primary group relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900", checked ? "bg-primary" : "bg-surface-variant"),
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
            "aria-hidden": "true",
            className: (0,clsx_m/* default */.Z)("pointer-events-none absolute top-[2px] left-[2px] inline-block h-[20px] w-[20px] rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out", checked ? "translate-x-[20px]" : "translate-x-0")
        })
    });
};
var PremiumInput = function(param) {
    var label = param.label, value = param.value, onChange = param.onChange, placeholder = param.placeholder, _type = param.type, type = _type === void 0 ? "text" : _type;
    var t = (0,useTranslation/* useTranslation */.$)("ai");
    var ref = (0,react.useState)(false), isVisible = ref[0], setIsVisible = ref[1];
    var isPassword = type === "password";
    // Auto-hide value if not password type but is a key
    var inputType = isPassword ? isVisible ? "text" : "password" : type;
    var handlePaste = function() {
        var _ref = (0,_async_to_generator/* default */.Z)(function() {
            var text, e;
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
                            navigator.clipboard.readText()
                        ];
                    case 1:
                        text = _state.sent();
                        if (text) onChange(text);
                        return [
                            3,
                            3
                        ];
                    case 2:
                        e = _state.sent();
                        console.error("Failed to paste", e);
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
        });
        return function handlePaste() {
            return _ref.apply(this, arguments);
        };
    }();
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "space-y-1.5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "ml-1 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                        className: "text-subtle block text-[11px] font-bold uppercase tracking-wider",
                        children: label
                    }),
                    value.length > 5 && /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                        className: "text-primary flex items-center gap-1 text-[10px]",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(MdCheck, {
                                size: 12
                            }),
                            " ",
                            t("settings.set_status")
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "group relative",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "text-subtle/50 group-focus-within:text-primary absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdVpnKey, {
                            className: "text-lg"
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                        type: inputType,
                        value: value,
                        onChange: function(e) {
                            return onChange(e.target.value);
                        },
                        placeholder: placeholder,
                        className: "border-border-light dark:border-border-dark focus:border-primary focus:ring-primary/20 w-full rounded-xl border bg-white py-3 pl-10 pr-20 font-mono text-sm shadow-sm transition-all placeholder:font-sans focus:outline-none focus:ring-1 dark:bg-gray-900"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1",
                        children: [
                            !value && /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                onClick: handlePaste,
                                className: "text-subtle hover:text-text hover:bg-surface-variant rounded-lg p-1.5 transition-colors",
                                title: t("settings.paste_tooltip"),
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdContentPaste, {
                                    size: 16
                                })
                            }),
                            isPassword && value && /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                onClick: function() {
                                    return setIsVisible(!isVisible);
                                },
                                className: "text-subtle hover:text-text hover:bg-surface-variant rounded-lg p-1.5 transition-colors",
                                title: isVisible ? t("settings.hide_password") : t("settings.show_password"),
                                children: isVisible ? /*#__PURE__*/ (0,jsx_runtime.jsx)(MdVisibilityOff, {
                                    size: 16
                                }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(MdVisibility, {
                                    size: 16
                                })
                            })
                        ]
                    })
                ]
            })
        ]
    });
};
var AISettingsPanel = function(param) {
    var className = param.className, onClose = param.onClose, isSetup = param.isSetup, onClearHistory = param.onClearHistory;
    var ref;
    var ref1 = (0,_sliced_to_array/* default */.Z)((0,src_state/* useAISettings */.KR)(), 2), settings = ref1[0], setSettings = ref1[1];
    var ref2 = (0,_sliced_to_array/* default */.Z)((0,src_state/* useSettings */.rV)(), 1), appSettings = ref2[0];
    var ref3 = (0,react.useState)("General"), activeTab = ref3[0], setActiveTab = ref3[1];
    var t = (0,useTranslation/* useTranslation */.$)("ai");
    var isCloudProvider = (0,config/* isCloudAIProvider */.vY)(settings.provider);
    var ref4 = (0,react.useState)("checking"), connectionPermissionStatus = ref4[0], setConnectionPermissionStatus = ref4[1];
    var ref5 = (0,react.useState)("idle"), connectionTestStatus = ref5[0], setConnectionTestStatus = ref5[1];
    var ref6 = (0,react.useState)(null), connectionTestFailure = ref6[0], setConnectionTestFailure = ref6[1];
    react.useEffect(function() {
        var isCurrent = true;
        setConnectionPermissionStatus("checking");
        void (0,permissions/* hasProviderHostPermission */.pK)(settings.provider, settings.baseUrl).then(function(granted) {
            if (isCurrent) {
                setConnectionPermissionStatus(granted ? "granted" : "idle");
            }
        }, function() {
            if (isCurrent) setConnectionPermissionStatus("idle");
        });
        return function() {
            isCurrent = false;
        };
    }, [
        settings.provider,
        settings.baseUrl
    ]);
    react.useEffect(function() {
        setConnectionTestStatus("idle");
        setConnectionTestFailure(null);
    }, [
        settings.apiKey,
        settings.baseUrl,
        settings.provider
    ]);
    var connectionConfigurationError = react.useMemo(function() {
        if (settings.provider === "local" || settings.provider === "custom") {
            var endpoint = (0,permissions/* validateProviderBaseUrl */.dD)(settings.provider, settings.baseUrl);
            if (endpoint.ok === false) return endpoint.reason;
        }
        if (settings.provider !== "local" && !settings.apiKey.trim()) {
            return "api_key_missing";
        }
        return null;
    }, [
        settings.apiKey,
        settings.baseUrl,
        settings.provider
    ]);
    var isConnectionPermissionReady = connectionConfigurationError === null;
    var updateLocalModelConsent = function() {
        var _ref = (0,_async_to_generator/* default */.Z)(function(checked) {
            var granted;
            return (0,tslib_es6.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!checked) return [
                            3,
                            2
                        ];
                        return [
                            4,
                            (0,permissions/* requestLocalModelHostPermissions */.el)()
                        ];
                    case 1:
                        granted = _state.sent();
                        if (!granted) {
                            alert(t("error.host_permission_denied"));
                            return [
                                2
                            ];
                        }
                        _state.label = 2;
                    case 2:
                        setSettings(function(prev) {
                            return (0,_object_spread_props/* default */.Z)((0,_object_spread/* default */.Z)({}, prev), {
                                downloadLocalModels: checked,
                                localModelConsentVersion: checked ? config/* LOCAL_MODEL_CONSENT_VERSION */.nQ : 0
                            });
                        });
                        return [
                            2
                        ];
                }
            });
        });
        return function updateLocalModelConsent(checked) {
            return _ref.apply(this, arguments);
        };
    }();
    var updateRemoteDataConsent = function(checked) {
        setSettings(function(prev) {
            return (0,_object_spread_props/* default */.Z)((0,_object_spread/* default */.Z)({}, prev), {
                remoteDataConsent: checked,
                remoteDataConsentProvider: checked ? prev.provider : "",
                includeAnnotationsInRemotePrompts: checked ? prev.includeAnnotationsInRemotePrompts : false,
                includeDefinitionsInRemotePrompts: checked ? prev.includeDefinitionsInRemotePrompts : false,
                autoRepairCitations: checked ? prev.autoRepairCitations : false
            });
        });
    };
    var requestConnectionPermission = function() {
        var _ref = (0,_async_to_generator/* default */.Z)(function() {
            var granted;
            return (0,tslib_es6.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (connectionConfigurationError) {
                            setConnectionPermissionStatus("idle");
                            alert(t("error.".concat(connectionConfigurationError)));
                            return [
                                2
                            ];
                        }
                        // permissions.request is invoked in this click handler so the browser can
                        // show an informed, host-specific permission prompt.
                        setConnectionPermissionStatus("checking");
                        return [
                            4,
                            (0,permissions/* requestProviderHostPermission */.wT)(settings.provider, settings.baseUrl)
                        ];
                    case 1:
                        granted = _state.sent();
                        setConnectionPermissionStatus(granted ? "granted" : "denied");
                        if (!granted) alert(t("error.host_permission_denied"));
                        return [
                            2
                        ];
                }
            });
        });
        return function requestConnectionPermission() {
            return _ref.apply(this, arguments);
        };
    }();
    var ref7 = (0,react.useState)(false), loadingModels = ref7[0], setLoadingModels = ref7[1];
    var ref8 = (0,react.useState)([]), availableModels = ref8[0], setAvailableModels = ref8[1];
    var modelFetchAbortRef = react.useRef(null);
    var ref9 = (0,react.useState)((0,rewriter/* getSlmStatus */.Cu)()), slmStatus = ref9[0], setSlmStatus = ref9[1];
    var ref10 = (0,react.useState)(null), slmError = ref10[0], setSlmError = ref10[1];
    var ref11 = (0,react.useState)(0), slmProgress = ref11[0], setSlmProgress = ref11[1];
    var ref12 = (0,react.useState)((0,rewriter/* getSlmWarning */.CD)()), slmWarning = ref12[0], setSlmWarning = ref12[1];
    var ref13 = (0,react.useState)(ai_rag/* RAGService.getEmbeddingStatus */.LZ.getEmbeddingStatus()), embeddingStatus = ref13[0], setEmbeddingStatus = ref13[1];
    var ref14 = (0,react.useState)(null), embeddingError = ref14[0], setEmbeddingError = ref14[1];
    var ref15 = (0,react.useState)(0), embeddingProgress = ref15[0], setEmbeddingProgress = ref15[1];
    var ref16 = (0,react.useState)(ai_rag/* RAGService.getEmbeddingWarning */.LZ.getEmbeddingWarning()), embeddingWarning = ref16[0], setEmbeddingWarning = ref16[1];
    var ref17 = (0,react.useState)((0,language/* getFastTextStatus */.Xu)()), fastTextStatus = ref17[0], setFastTextStatus = ref17[1];
    var ref18 = (0,react.useState)(null), fastTextError = ref18[0], setFastTextError = ref18[1];
    var ref19 = (0,react.useState)((0,language/* getFastTextWarning */.E7)()), fastTextWarning = ref19[0], setFastTextWarning = ref19[1];
    var statusText = {
        ready: t("status.ready"),
        warning: t("status.warning"),
        downloading: t("status.downloading"),
        error: t("status.error"),
        clickToDownload: t("status.click_to_download")
    };
    var ref20 = (0,react.useState)(false), isIndexing = ref20[0], setIsIndexing = ref20[1];
    var ref21 = (0,react.useState)(0), indexProgress = ref21[0], setIndexProgress = ref21[1];
    var ref22 = (0,react.useState)(false), showReindexConfirm = ref22[0], setShowReindexConfirm = ref22[1];
    var isMounted = react.useRef(true);
    var activeBookId = (ref = models/* reader.focusedBookTab */.r1.focusedBookTab) === null || ref === void 0 ? void 0 : ref.book.id;
    var hasChunkIndex = (0,dexie_react_hooks.useLiveQuery)(/*#__PURE__*/ (0,_async_to_generator/* default */.Z)(function() {
        var idx, e, ref, errName, idx1;
        return (0,tslib_es6.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!activeBookId || !db.db) return [
                        2,
                        false
                    ];
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        6
                    ]);
                    return [
                        4,
                        db.db.indices.where("[bookId+kind]").equals([
                            activeBookId,
                            "chunks"
                        ]).first()
                    ];
                case 2:
                    idx = _state.sent();
                    return [
                        2,
                        !!idx
                    ];
                case 3:
                    e = _state.sent();
                    errName = (e === null || e === void 0 ? void 0 : e.name) || (e === null || e === void 0 ? void 0 : (ref = e._e) === null || ref === void 0 ? void 0 : ref.name);
                    if (!(errName === "SchemaError" || errName === "DataError")) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        db.db.indices.get(activeBookId)
                    ];
                case 4:
                    idx1 = _state.sent();
                    return [
                        2,
                        !!idx1
                    ];
                case 5:
                    return [
                        2,
                        false
                    ];
                case 6:
                    return [
                        2
                    ];
            }
        });
    }), [
        activeBookId
    ], false);
    var indexedChunkCount = (0,dexie_react_hooks.useLiveQuery)(/*#__PURE__*/ (0,_async_to_generator/* default */.Z)(function() {
        var e;
        return (0,tslib_es6.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!activeBookId || !db.db) return [
                        2,
                        0
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
                        db.db.vectors.where("bookId").equals(activeBookId).count()
                    ];
                case 2:
                    return [
                        2,
                        _state.sent()
                    ];
                case 3:
                    e = _state.sent();
                    return [
                        2,
                        0
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    }), [
        activeBookId
    ], 0);
    var isBookIndexed = !!hasChunkIndex || (indexedChunkCount || 0) > 0;
    react.useEffect(function() {
        isMounted.current = true;
        return function() {
            var ref;
            isMounted.current = false;
            (ref = modelFetchAbortRef.current) === null || ref === void 0 ? void 0 : ref.abort();
            modelFetchAbortRef.current = null;
        };
    }, []);
    react.useEffect(function() {
        var statusHandler = function(e) {
            var ref, ref1;
            var next = e === null || e === void 0 ? void 0 : (ref = e.detail) === null || ref === void 0 ? void 0 : ref.status;
            if (next === "unknown" || next === "downloading" || next === "ready" || next === "warning" || next === "error") {
                setSlmStatus(next);
                if (next !== "error") setSlmError(null);
            }
            var warning = e === null || e === void 0 ? void 0 : (ref1 = e.detail) === null || ref1 === void 0 ? void 0 : ref1.warning;
            if (typeof warning === "string") {
                setSlmWarning(warning);
            } else if (warning === null) {
                setSlmWarning(null);
            }
        };
        var progressHandler = function(e) {
            var ref;
            if (typeof (e === null || e === void 0 ? void 0 : (ref = e.detail) === null || ref === void 0 ? void 0 : ref.progress) === "number") setSlmProgress(e.detail.progress);
        };
        var errorHandler = function(e) {
            var ref, ref1;
            if ((e === null || e === void 0 ? void 0 : (ref = e.detail) === null || ref === void 0 ? void 0 : ref.status) && e.detail.status !== "error") return;
            var message = e === null || e === void 0 ? void 0 : (ref1 = e.detail) === null || ref1 === void 0 ? void 0 : ref1.message;
            if (typeof message === "string" && message.length > 0) {
                setSlmError(message);
            }
        };
        window.addEventListener("slm-status", statusHandler);
        window.addEventListener("slm-progress", progressHandler);
        window.addEventListener("slm-error", errorHandler);
        return function() {
            window.removeEventListener("slm-status", statusHandler);
            window.removeEventListener("slm-progress", progressHandler);
            window.removeEventListener("slm-error", errorHandler);
        };
    }, []);
    react.useEffect(function() {
        var statusHandler = function(e) {
            var ref, ref1;
            var next = e === null || e === void 0 ? void 0 : (ref = e.detail) === null || ref === void 0 ? void 0 : ref.status;
            if (next === "unknown" || next === "downloading" || next === "ready" || next === "warning" || next === "error") {
                setEmbeddingStatus(next);
                if (next !== "error") setEmbeddingError(null);
            }
            var warning = e === null || e === void 0 ? void 0 : (ref1 = e.detail) === null || ref1 === void 0 ? void 0 : ref1.warning;
            if (typeof warning === "string") {
                setEmbeddingWarning(warning);
            } else if (warning === null) {
                setEmbeddingWarning(null);
            }
        };
        var progressHandler = function(e) {
            var ref;
            if (typeof (e === null || e === void 0 ? void 0 : (ref = e.detail) === null || ref === void 0 ? void 0 : ref.progress) === "number") setEmbeddingProgress(e.detail.progress);
        };
        var errorHandler = function(e) {
            var ref, ref1;
            if ((e === null || e === void 0 ? void 0 : (ref = e.detail) === null || ref === void 0 ? void 0 : ref.status) && e.detail.status !== "error") return;
            var message = e === null || e === void 0 ? void 0 : (ref1 = e.detail) === null || ref1 === void 0 ? void 0 : ref1.message;
            if (typeof message === "string" && message.length > 0) {
                setEmbeddingError(message);
            }
        };
        window.addEventListener("embedding-status", statusHandler);
        window.addEventListener("embedding-progress", progressHandler);
        window.addEventListener("embedding-error", errorHandler);
        return function() {
            window.removeEventListener("embedding-status", statusHandler);
            window.removeEventListener("embedding-progress", progressHandler);
            window.removeEventListener("embedding-error", errorHandler);
        };
    }, []);
    react.useEffect(function() {
        var handler = function(e) {
            var ref, ref1, ref2;
            var next = e === null || e === void 0 ? void 0 : (ref = e.detail) === null || ref === void 0 ? void 0 : ref.status;
            if (next === "unknown" || next === "downloading" || next === "ready" || next === "warning" || next === "error") {
                setFastTextStatus(next);
                if (next !== "error") setFastTextError(null);
            }
            var warning = e === null || e === void 0 ? void 0 : (ref1 = e.detail) === null || ref1 === void 0 ? void 0 : ref1.warning;
            if (typeof warning === "string") {
                setFastTextWarning(warning);
            } else if (warning === null) {
                setFastTextWarning(null);
            } else if ((e === null || e === void 0 ? void 0 : (ref2 = e.detail) === null || ref2 === void 0 ? void 0 : ref2.reasonCode) === "preload_timeout") {
                setFastTextWarning("preload_timeout");
            }
        };
        var errorHandler = function(e) {
            var ref, ref1;
            if ((e === null || e === void 0 ? void 0 : (ref = e.detail) === null || ref === void 0 ? void 0 : ref.status) && e.detail.status !== "error") return;
            var message = e === null || e === void 0 ? void 0 : (ref1 = e.detail) === null || ref1 === void 0 ? void 0 : ref1.message;
            if (typeof message === "string" && message.length > 0) {
                setFastTextError(message);
            }
        };
        window.addEventListener("fasttext-status", handler);
        window.addEventListener("fasttext-error", errorHandler);
        return function() {
            window.removeEventListener("fasttext-status", handler);
            window.removeEventListener("fasttext-error", errorHandler);
        };
    }, []);
    var handleChange = function(key, value) {
        setSettings(function(prev) {
            return (0,_object_spread_props/* default */.Z)((0,_object_spread/* default */.Z)({}, prev), (0,_define_property/* default */.Z)({}, key, value));
        });
    };
    var handleProviderChange = function(nextProvider) {
        setSettings(function(prev) {
            var providerChanged = prev.provider !== nextProvider;
            var next = (0,_object_spread_props/* default */.Z)((0,_object_spread/* default */.Z)({}, prev), {
                provider: nextProvider
            });
            if (providerChanged) {
                next.remoteDataConsent = false;
                next.remoteDataConsentProvider = "";
                next.includeAnnotationsInRemotePrompts = false;
                next.includeDefinitionsInRemotePrompts = false;
                next.autoRepairCitations = false;
            }
            // Prevent stale local/custom endpoint from leaking into hosted providers.
            if (nextProvider === "openai" || nextProvider === "gemini" || nextProvider === "anthropic") {
                next.baseUrl = "";
            }
            if (providerChanged) {
                // Model availability changes independently for every provider.
                // Ask the user to select a currently available model instead of
                // carrying forward a versioned default from a previous provider.
                next.model = "";
            }
            return next;
        });
        setAvailableModels([]);
    };
    var resetDefaults = function() {
        if (confirm(t("confirm_reset"))) {
            setSettings(function(prev) {
                return (0,_object_spread_props/* default */.Z)((0,_object_spread/* default */.Z)({}, src_state/* defaultAIConfig */.Bg), {
                    apiKey: prev.apiKey,
                    provider: prev.provider,
                    model: "",
                    baseUrl: prev.provider === "local" || prev.provider === "custom" ? prev.baseUrl : ""
                });
            });
        }
    };
    var clearHistory = function() {
        if (!confirm(t("confirm_clear"))) return;
        void onClearHistory();
    };
    var runReindexBook = function() {
        var _ref = (0,_async_to_generator/* default */.Z)(function(bookId) {
            var ref, ref1, fileRecord, rag, bookLang, e;
            return (0,tslib_es6.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!bookId) return [
                            2
                        ];
                        if (isIndexing) return [
                            2
                        ];
                        setIsIndexing(true);
                        setIndexProgress(0);
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            4,
                            5,
                            6
                        ]);
                        return [
                            4,
                            db.db === null || db.db === void 0 ? void 0 : db.db.files.get(bookId)
                        ];
                    case 2:
                        fileRecord = _state.sent();
                        if (!fileRecord) throw new Error("Book file not found in local database.");
                        rag = ai_rag/* RAGService.getInstance */.LZ.getInstance();
                        bookLang = (0,language/* normalizeLangForRAG */.I$)((ref1 = (ref = models/* reader.focusedBookTab */.r1.focusedBookTab) === null || ref === void 0 ? void 0 : ref.book.metadata) === null || ref1 === void 0 ? void 0 : ref1.language, appSettings.locale || "en");
                        return [
                            4,
                            rag.indexBook(fileRecord.file, bookId, function(p) {
                                if (isMounted.current) {
                                    setIndexProgress(p);
                                }
                            }, bookLang)
                        ];
                    case 3:
                        _state.sent();
                        if (isMounted.current) {
                            alert(t("index.success"));
                        }
                        return [
                            3,
                            6
                        ];
                    case 4:
                        e = _state.sent();
                        if (isMounted.current) {
                            alert(t("index.failed", {
                                error: e.message
                            }));
                        }
                        return [
                            3,
                            6
                        ];
                    case 5:
                        if (isMounted.current) {
                            setIsIndexing(false);
                            setIndexProgress(0);
                        }
                        return [
                            7
                        ];
                    case 6:
                        return [
                            2
                        ];
                }
            });
        });
        return function runReindexBook(bookId) {
            return _ref.apply(this, arguments);
        };
    }();
    var reindexBook = function() {
        var ref;
        var bookId = (ref = models/* reader.focusedBookTab */.r1.focusedBookTab) === null || ref === void 0 ? void 0 : ref.book.id;
        if (!bookId) {
            alert(t("index.no_book"));
            return;
        }
        if (isBookIndexed) {
            setShowReindexConfirm(true);
            return;
        }
        void runReindexBook(bookId);
    };
    var confirmReindexBook = function() {
        var ref;
        setShowReindexConfirm(false);
        var bookId = (ref = models/* reader.focusedBookTab */.r1.focusedBookTab) === null || ref === void 0 ? void 0 : ref.book.id;
        if (!bookId) return;
        void runReindexBook(bookId);
    };
    var fetchModels = react.useCallback(function() {
        var _ref = (0,_async_to_generator/* default */.Z)(function(options) {
            var ref, force, cacheKey, cached, isFresh, abortController, groups, res, data, blacklist, candidates, filtered, verificationResults, modelOptions, res1, data1, blacklist1, filtered1, _$options, res2, data2, _$options1, ref1, baseUrl, res3, data3, _$options2, e, failure;
            return (0,tslib_es6.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        force = (options === null || options === void 0 ? void 0 : options.force) === true;
                        if (settings.provider !== "local" && !settings.apiKey) {
                            if ((options === null || options === void 0 ? void 0 : options.showError) !== false) {
                                alert(t("settings.enter_api_key_first"));
                            }
                            return [
                                2,
                                {
                                    ok: false,
                                    failure: "configuration"
                                }
                            ];
                        }
                        return [
                            4,
                            (0,permissions/* hasProviderHostPermission */.pK)(settings.provider, settings.baseUrl)
                        ];
                    case 1:
                        if (!_state.sent()) {
                            if ((options === null || options === void 0 ? void 0 : options.showError) !== false) {
                                alert(t("error.host_permission_required"));
                            }
                            return [
                                2,
                                {
                                    ok: false,
                                    failure: "permission"
                                }
                            ];
                        }
                        cacheKey = buildModelCacheKey(settings.provider, settings.apiKey, settings.baseUrl);
                        if (!force) {
                            cached = MODEL_FETCH_CACHE.get(cacheKey);
                            isFresh = cached && Date.now() - cached.fetchedAt < MODEL_FETCH_CACHE_TTL_MS;
                            if (isFresh && cached) {
                                setAvailableModels(cached.groups);
                                return [
                                    2,
                                    {
                                        ok: true
                                    }
                                ];
                            }
                        }
                        (ref = modelFetchAbortRef.current) === null || ref === void 0 ? void 0 : ref.abort();
                        abortController = new AbortController();
                        modelFetchAbortRef.current = abortController;
                        setLoadingModels(true);
                        setAvailableModels([]);
                        _state.label = 2;
                    case 2:
                        _state.trys.push([
                            2,
                            17,
                            18,
                            19
                        ]);
                        groups = [];
                        if (!(settings.provider === "gemini")) return [
                            3,
                            7
                        ];
                        return [
                            4,
                            fetch("https://generativelanguage.googleapis.com/v1beta/models", {
                                headers: {
                                    "x-goog-api-key": settings.apiKey
                                },
                                signal: abortController.signal
                            })
                        ];
                    case 3:
                        res = _state.sent();
                        if (!res.ok) {
                            throw new ModelFetchError(getConnectionTestFailure(res.status), "Failed to fetch from Google");
                        }
                        return [
                            4,
                            res.json()
                        ];
                    case 4:
                        data = _state.sent();
                        blacklist = /(gemma|deep-research|computer-use|vision|aqa|embedding|imaging|imagen|image|text-|translator|metadata|attr|realtime|audio|instruct|nano|bison|gecko|tts|speech|sound|media)/i;
                        candidates = data.models.filter(function(m) {
                            var methods = m.supportedGenerationMethods || [];
                            var name = m.name.toLowerCase();
                            return methods.includes("generateContent") && !blacklist.test(name);
                        });
                        filtered = candidates;
                        if (!((options === null || options === void 0 ? void 0 : options.verifyGeminiModels) === true)) return [
                            3,
                            6
                        ];
                        return [
                            4,
                            Promise.allSettled(candidates.map(function() {
                                var _ref = (0,_async_to_generator/* default */.Z)(function(m) {
                                    var verifyRes;
                                    return (0,tslib_es6.__generator)(this, function(_state) {
                                        switch(_state.label){
                                            case 0:
                                                return [
                                                    4,
                                                    fetch("https://generativelanguage.googleapis.com/v1beta/".concat(m.name, ":countTokens"), {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                            "x-goog-api-key": settings.apiKey
                                                        },
                                                        body: JSON.stringify({
                                                            contents: [
                                                                {
                                                                    parts: [
                                                                        {
                                                                            text: ""
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }),
                                                        signal: abortController.signal
                                                    })
                                                ];
                                            case 1:
                                                verifyRes = _state.sent();
                                                if (!verifyRes.ok) throw new Error("Access Denied");
                                                return [
                                                    2,
                                                    m
                                                ];
                                        }
                                    });
                                });
                                return function(m) {
                                    return _ref.apply(this, arguments);
                                };
                            }()))
                        ];
                    case 5:
                        verificationResults = _state.sent();
                        filtered = verificationResults.map(function(r) {
                            return r.status === "fulfilled" ? r.value : null;
                        }).filter(function(m) {
                            return m !== null;
                        });
                        _state.label = 6;
                    case 6:
                        modelOptions = filtered.map(function(model) {
                            var id = model.name.replace("models/", "");
                            return {
                                value: id,
                                label: id,
                                icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(GeminiIcon, {})
                            };
                        }).sort(function(a, b) {
                            return a.value.localeCompare(b.value, undefined, {
                                numeric: true
                            });
                        });
                        groups = [
                            {
                                label: t("settings.model_category.other"),
                                options: modelOptions
                            }, 
                        ];
                        return [
                            3,
                            16
                        ];
                    case 7:
                        if (!(settings.provider === "openai")) return [
                            3,
                            10
                        ];
                        return [
                            4,
                            fetch("https://api.openai.com/v1/models", {
                                headers: {
                                    Authorization: "Bearer ".concat(settings.apiKey)
                                },
                                signal: abortController.signal
                            })
                        ];
                    case 8:
                        res1 = _state.sent();
                        if (!res1.ok) {
                            throw new ModelFetchError(getConnectionTestFailure(res1.status), "Failed to fetch from OpenAI");
                        }
                        return [
                            4,
                            res1.json()
                        ];
                    case 9:
                        data1 = _state.sent();
                        blacklist1 = /(audio|realtime|instruct|vision|embedding|dall-e|tts|whisper)/i;
                        filtered1 = data1.data.filter(function(model) {
                            return !blacklist1.test(model.id.toLowerCase());
                        });
                        _$options = filtered1.map(function(model) {
                            return {
                                value: model.id,
                                label: model.id,
                                icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(OpenAIIcon, {})
                            };
                        }).sort(function(a, b) {
                            return a.value.localeCompare(b.value, undefined, {
                                numeric: true
                            });
                        });
                        groups = [
                            {
                                label: t("settings.model_category.other"),
                                options: _$options
                            }, 
                        ];
                        return [
                            3,
                            16
                        ];
                    case 10:
                        if (!(settings.provider === "anthropic")) return [
                            3,
                            13
                        ];
                        return [
                            4,
                            fetch("https://api.anthropic.com/v1/models", {
                                headers: {
                                    "x-api-key": settings.apiKey,
                                    "anthropic-version": "2023-06-01",
                                    "anthropic-dangerous-direct-browser-access": "true"
                                },
                                signal: abortController.signal
                            })
                        ];
                    case 11:
                        res2 = _state.sent();
                        if (!res2.ok) {
                            throw new ModelFetchError(getConnectionTestFailure(res2.status), "Failed to fetch from Anthropic");
                        }
                        return [
                            4,
                            res2.json()
                        ];
                    case 12:
                        data2 = _state.sent();
                        _$options1 = data2.data.map(function(m) {
                            return {
                                value: m.id,
                                label: m.id,
                                icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(AnthropicIcon, {})
                            };
                        });
                        groups = [
                            {
                                label: t("settings.claude_series"),
                                options: _$options1.sort(function(a, b) {
                                    return b.value.localeCompare(a.value, undefined, {
                                        numeric: true
                                    });
                                })
                            }, 
                        ];
                        return [
                            3,
                            16
                        ];
                    case 13:
                        if (!(settings.provider === "local" || settings.provider === "custom")) return [
                            3,
                            16
                        ];
                        baseUrl = (ref1 = settings.baseUrl) === null || ref1 === void 0 ? void 0 : ref1.trim().replace(/\/+$/, "");
                        if (!baseUrl) {
                            throw new ModelFetchError("configuration", "Base URL is required");
                        }
                        return [
                            4,
                            fetch("".concat(baseUrl, "/models"), {
                                headers: settings.apiKey ? {
                                    Authorization: "Bearer ".concat(settings.apiKey)
                                } : undefined,
                                signal: abortController.signal
                            })
                        ];
                    case 14:
                        res3 = _state.sent();
                        if (!res3.ok) {
                            throw new ModelFetchError(getConnectionTestFailure(res3.status), "Failed to fetch compatible models");
                        }
                        return [
                            4,
                            res3.json()
                        ];
                    case 15:
                        data3 = _state.sent();
                        _$options2 = Array.isArray(data3 === null || data3 === void 0 ? void 0 : data3.data) ? data3.data.filter(function(model) {
                            return typeof (model === null || model === void 0 ? void 0 : model.id) === "string";
                        }).map(function(model) {
                            return {
                                value: model.id,
                                label: model.id,
                                icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdSmartToy, {})
                            };
                        }) : [];
                        groups = [
                            {
                                label: t("settings.model_category.other"),
                                options: _$options2.sort(function(a, b) {
                                    return a.value.localeCompare(b.value, undefined, {
                                        numeric: true
                                    });
                                })
                            }, 
                        ];
                        _state.label = 16;
                    case 16:
                        if (abortController.signal.aborted) return [
                            2
                        ];
                        setAvailableModels(groups);
                        MODEL_FETCH_CACHE.set(cacheKey, {
                            fetchedAt: Date.now(),
                            groups: groups
                        });
                        return [
                            2,
                            {
                                ok: true
                            }
                        ];
                    case 17:
                        e = _state.sent();
                        if ((e === null || e === void 0 ? void 0 : e.name) === "AbortError") {
                            return [
                                2,
                                {
                                    ok: false,
                                    failure: "failed"
                                }
                            ];
                        }
                        failure = (0,_instanceof/* default */.Z)(e, ModelFetchError) ? e.failure : (0,_instanceof/* default */.Z)(e, TypeError) ? "unavailable" : "failed";
                        if ((options === null || options === void 0 ? void 0 : options.showError) !== false) {
                            alert(t("settings.fetch_models_error"));
                        }
                        console.error("[Model Fetch Error]", (0,redact/* sanitizeErrorForLogs */.w)(e));
                        return [
                            2,
                            {
                                ok: false,
                                failure: failure
                            }
                        ];
                    case 18:
                        if (modelFetchAbortRef.current === abortController) {
                            modelFetchAbortRef.current = null;
                        }
                        if (!abortController.signal.aborted) {
                            setLoadingModels(false);
                        }
                        return [
                            7
                        ];
                    case 19:
                        return [
                            2
                        ];
                }
            });
        });
        return function(options) {
            return _ref.apply(this, arguments);
        };
    }(), [
        settings.apiKey,
        settings.provider,
        settings.baseUrl,
        t
    ]);
    var testConnection = function() {
        var _ref = (0,_async_to_generator/* default */.Z)(function() {
            var result;
            return (0,tslib_es6.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (connectionConfigurationError) {
                            setConnectionTestStatus("failed");
                            setConnectionTestFailure("configuration");
                            return [
                                2
                            ];
                        }
                        return [
                            4,
                            (0,permissions/* hasProviderHostPermission */.pK)(settings.provider, settings.baseUrl)
                        ];
                    case 1:
                        if (!_state.sent()) {
                            setConnectionTestStatus("failed");
                            setConnectionTestFailure("permission");
                            return [
                                2
                            ];
                        }
                        setConnectionTestStatus("testing");
                        setConnectionTestFailure(null);
                        return [
                            4,
                            fetchModels({
                                force: true,
                                showError: false
                            })
                        ];
                    case 2:
                        result = _state.sent();
                        if (result.ok === false) {
                            setConnectionTestStatus("failed");
                            setConnectionTestFailure(result.failure);
                            return [
                                2
                            ];
                        }
                        setConnectionTestStatus("verified");
                        return [
                            2
                        ];
                }
            });
        });
        return function testConnection() {
            return _ref.apply(this, arguments);
        };
    }();
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: (0,clsx_m/* default */.Z)("ai-settings-panel relative flex h-full flex-col bg-white dark:bg-gray-900", className),
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "border-border-light dark:border-border-dark sticky top-0 z-[50] border-b bg-white dark:bg-gray-900",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex items-center justify-between bg-white p-4 dark:bg-gray-900",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdSettings, {
                                            className: "text-2xl"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                        className: "text-lg font-bold tracking-tight",
                                        children: t("settings.config_title")
                                    })
                                ]
                            }),
                            !isSetup && /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                onClick: onClose,
                                className: "hover:bg-surface-variant text-subtle hover:text-text group rounded-full p-2 transition-colors",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdClose, {
                                    className: "text-2xl transition-transform duration-300 group-hover:rotate-90"
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "flex bg-white dark:bg-gray-900",
                        children: TABS.map(function(tab) {
                            return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                onClick: function() {
                                    return setActiveTab(tab);
                                },
                                className: (0,clsx_m/* default */.Z)("flex-1 py-3 text-sm font-medium transition-colors", activeTab === tab ? "text-primary border-primary border-b-2" : "text-subtle hover:text-text"),
                                children: t("tabs.".concat(tab.toLowerCase()))
                            }, tab);
                        })
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "ai-settings-panel-content custom-scrollbar flex-1 space-y-6 overflow-y-auto bg-white p-4 dark:bg-gray-900",
                children: [
                    activeTab === "General" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(PremiumSelect, {
                                label: t("provider"),
                                value: settings.provider,
                                options: [
                                    {
                                        value: "gemini",
                                        label: "Gemini",
                                        icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(GeminiIcon, {})
                                    },
                                    {
                                        value: "openai",
                                        label: "OpenAI",
                                        icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(OpenAIIcon, {})
                                    },
                                    {
                                        value: "anthropic",
                                        label: "Anthropic",
                                        icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(AnthropicIcon, {})
                                    },
                                    {
                                        value: "local",
                                        label: "Local",
                                        icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdComputer, {})
                                    },
                                    {
                                        value: "custom",
                                        label: "Custom",
                                        icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdDns, {})
                                    }, 
                                ],
                                onChange: function(val) {
                                    return handleProviderChange(val);
                                },
                                icon: settings.provider === "openai" ? /*#__PURE__*/ (0,jsx_runtime.jsx)(OpenAIIcon, {}) : settings.provider === "gemini" ? /*#__PURE__*/ (0,jsx_runtime.jsx)(GeminiIcon, {}) : settings.provider === "anthropic" ? /*#__PURE__*/ (0,jsx_runtime.jsx)(AnthropicIcon, {}) : settings.provider === "local" ? /*#__PURE__*/ (0,jsx_runtime.jsx)(MdComputer, {}) : /*#__PURE__*/ (0,jsx_runtime.jsx)(MdDns, {})
                            }),
                            settings.provider !== "local" && settings.provider !== "custom" && /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(PremiumInput, {
                                        label: t("api_key"),
                                        value: settings.apiKey,
                                        onChange: function(val) {
                                            return handleChange("apiKey", val);
                                        },
                                        placeholder: t("settings.api_key_placeholder"),
                                        type: "password"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-subtle -mt-2 px-1 text-[10px] leading-relaxed",
                                        children: t("settings.api_key_session_only")
                                    })
                                ]
                            }),
                            (settings.provider === "local" || settings.provider === "custom") && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "bg-primary/5 border-primary/10 space-y-3 rounded-xl border p-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "text-primary/80 text-[11px] font-medium leading-relaxed",
                                        children: settings.provider === "local" ? t("settings.model_hint.local") : t("settings.model_hint.custom")
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "space-y-1.5",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                                className: "text-subtle ml-1 block text-[11px] font-bold uppercase tracking-wider",
                                                children: t("base_url")
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Form/* TextField */.nv, {
                                                name: "Base URL",
                                                hideLabel: true,
                                                value: settings.baseUrl || "",
                                                onChange: function(e) {
                                                    return handleChange("baseUrl", e.target.value);
                                                },
                                                placeholder: settings.provider === "local" ? "http://localhost:11434/v1" : "https://api.proxy.com/v1"
                                            })
                                        ]
                                    }),
                                    settings.provider === "custom" && /*#__PURE__*/ (0,jsx_runtime.jsx)(PremiumInput, {
                                        label: "".concat(t("settings.proxy_api_key"), " *"),
                                        value: settings.apiKey,
                                        onChange: function(val) {
                                            return handleChange("apiKey", val);
                                        },
                                        type: "password",
                                        placeholder: "sk-..."
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "bg-primary/5 border-primary/10 space-y-2 rounded-xl border p-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-primary/80 text-[11px] leading-relaxed",
                                        children: t("settings.connection_permission_desc")
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "flex flex-wrap gap-2",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                                type: "button",
                                                onClick: function() {
                                                    return void requestConnectionPermission();
                                                },
                                                disabled: connectionPermissionStatus === "checking" || !isConnectionPermissionReady,
                                                className: (0,clsx_m/* default */.Z)("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70", connectionPermissionStatus === "granted" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-primary hover:bg-primary-dark"),
                                                children: [
                                                    connectionPermissionStatus === "granted" && /*#__PURE__*/ (0,jsx_runtime.jsx)(MdCheck, {}),
                                                    connectionPermissionStatus === "checking" ? t("chatbot.thinking") : connectionPermissionStatus === "granted" ? t("settings.connection_allowed") : t("settings.allow_connection")
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                                type: "button",
                                                onClick: function() {
                                                    return void testConnection();
                                                },
                                                disabled: connectionPermissionStatus !== "granted" || !isConnectionPermissionReady || connectionTestStatus === "testing",
                                                className: "border-primary text-primary hover:bg-primary/10 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                                                children: [
                                                    connectionTestStatus === "verified" && /*#__PURE__*/ (0,jsx_runtime.jsx)(MdCheck, {}),
                                                    connectionTestStatus === "testing" ? t("chatbot.thinking") : t("settings.test_connection")
                                                ]
                                            })
                                        ]
                                    }),
                                    connectionConfigurationError && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        role: "status",
                                        className: "text-[10px] text-amber-700 dark:text-amber-300",
                                        children: t("error.".concat(connectionConfigurationError))
                                    }),
                                    connectionPermissionStatus === "granted" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                        role: "status",
                                        className: "flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-300",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(MdCheck, {}),
                                            t("settings.connection_allowed")
                                        ]
                                    }),
                                    connectionPermissionStatus === "denied" && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        role: "status",
                                        className: "text-[10px] text-red-600 dark:text-red-300",
                                        children: t("error.host_permission_denied")
                                    }),
                                    connectionTestStatus === "verified" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                        role: "status",
                                        className: "flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-300",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(MdCheck, {}),
                                            t("settings.connection_verified")
                                        ]
                                    }),
                                    connectionTestStatus === "failed" && connectionTestFailure && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        role: "status",
                                        className: "text-[10px] text-red-600 dark:text-red-300",
                                        children: connectionTestFailure === "configuration" ? t("error.".concat(connectionConfigurationError || "api_key_missing")) : connectionTestFailure === "permission" ? t("error.host_permission_required") : t("error.connection_test_".concat(connectionTestFailure))
                                    })
                                ]
                            }),
                            isCloudProvider && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "bg-surface-1 border-border-light dark:border-border-dark space-y-3 rounded-xl border p-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "flex items-center justify-between gap-3",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-subtle ml-1 block text-[10px] font-bold uppercase tracking-wider",
                                                        children: t("settings.remote_data_consent")
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-subtle ml-1 block max-w-[240px] text-[9px] leading-tight opacity-70",
                                                        children: t("settings.remote_data_consent_desc")
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Switch, {
                                                checked: settings.remoteDataConsent && settings.remoteDataConsentProvider === settings.provider,
                                                onChange: updateRemoteDataConsent
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                        className: "text-subtle flex items-center justify-between gap-3 text-[10px]",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                children: t("settings.share_annotations")
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Switch, {
                                                checked: settings.includeAnnotationsInRemotePrompts,
                                                onChange: function(checked) {
                                                    if (settings.remoteDataConsent) {
                                                        handleChange("includeAnnotationsInRemotePrompts", checked);
                                                    }
                                                }
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                        className: "text-subtle flex items-center justify-between gap-3 text-[10px]",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                children: t("settings.share_definitions")
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Switch, {
                                                checked: settings.includeDefinitionsInRemotePrompts,
                                                onChange: function(checked) {
                                                    if (settings.remoteDataConsent) {
                                                        handleChange("includeDefinitionsInRemotePrompts", checked);
                                                    }
                                                }
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                        className: "text-subtle flex items-center justify-between gap-3 text-[10px]",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                children: t("settings.auto_repair_citations")
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Switch, {
                                                checked: settings.autoRepairCitations,
                                                onChange: function(checked) {
                                                    if (settings.remoteDataConsent) {
                                                        handleChange("autoRepairCitations", checked);
                                                    }
                                                }
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "ml-1 flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                                className: "text-subtle block text-[11px] font-bold uppercase tracking-wider",
                                                children: t("model")
                                            }),
                                            (settings.provider === "local" || [
                                                "openai",
                                                "gemini",
                                                "anthropic",
                                                "custom"
                                            ].includes(settings.provider) && settings.apiKey) && /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                                onClick: function() {
                                                    return void fetchModels({
                                                        force: true,
                                                        verifyGeminiModels: true
                                                    });
                                                },
                                                disabled: loadingModels,
                                                className: "text-primary flex items-center gap-1 text-[10px] font-medium hover:underline disabled:opacity-50",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(MdRefresh, {
                                                        className: (0,clsx_m/* default */.Z)(loadingModels && "animate-spin")
                                                    }),
                                                    loadingModels ? t("chatbot.thinking").replace("...", "") : t("maintenance.refresh_list")
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(PremiumSelect, {
                                        label: "",
                                        value: settings.model,
                                        options: availableModels.length > 0 ? availableModels : [
                                            {
                                                value: settings.model,
                                                icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdSmartToy, {})
                                            }
                                        ],
                                        onChange: function(val) {
                                            return handleChange("model", val);
                                        },
                                        searchable: availableModels.reduce(function(acc, g) {
                                            var ref;
                                            return acc + (((ref = g.options) === null || ref === void 0 ? void 0 : ref.length) || 0);
                                        }, 0) > 5,
                                        placeholder: t("settings.select_model_placeholder"),
                                        icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdSmartToy, {})
                                    }),
                                    connectionTestFailure === "incompatible" && /*#__PURE__*/ (0,jsx_runtime.jsx)(PremiumInput, {
                                        label: "".concat(t("model"), " ID"),
                                        value: settings.model,
                                        onChange: function(value) {
                                            return handleChange("model", value);
                                        },
                                        placeholder: "provider/model-id"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "grid grid-cols-2 gap-3 pt-2",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(PremiumSelect, {
                                                label: t("answer_depth"),
                                                value: settings.answerDepth,
                                                options: [
                                                    {
                                                        value: "short",
                                                        label: t("answer_depth.short"),
                                                        icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdChevronRight, {})
                                                    },
                                                    {
                                                        value: "balanced",
                                                        label: t("answer_depth.balanced"),
                                                        icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdChevronRight, {})
                                                    },
                                                    {
                                                        value: "deep",
                                                        label: t("answer_depth.deep"),
                                                        icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdChevronRight, {})
                                                    }, 
                                                ],
                                                onChange: function(val) {
                                                    return handleChange("answerDepth", val);
                                                }
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(PremiumSelect, {
                                                label: t("scope"),
                                                value: settings.aiScope,
                                                options: [
                                                    {
                                                        value: "book_only",
                                                        label: t("scope.book_only"),
                                                        icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdLock, {})
                                                    },
                                                    {
                                                        value: "book_plus_discussion",
                                                        label: t("scope.plus_discussion"),
                                                        icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdSmartToy, {})
                                                    }, 
                                                ],
                                                onChange: function(val) {
                                                    return handleChange("aiScope", val);
                                                }
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "bg-surface-1 border-border-light dark:border-border-dark space-y-3 rounded-xl border p-3",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "flex flex-col",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "text-subtle ml-1 text-[10px] font-bold uppercase tracking-wider",
                                                                children: t("settings.download_models")
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "text-subtle ml-1 block max-w-[200px] text-[9px] leading-tight opacity-70",
                                                                children: t("settings.download_models_desc")
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "relative inline-flex shrink-0 self-center",
                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Switch, {
                                                            checked: settings.downloadLocalModels,
                                                            onChange: updateLocalModelConsent
                                                        })
                                                    })
                                                ]
                                            }),
                                            settings.downloadLocalModels && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "animate-in fade-in slide-in-from-top-1",
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(PermissionButton, {})
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "bg-border-light dark:bg-border-dark h-px opacity-50"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                                className: "text-subtle ml-1 block text-[10px] font-bold uppercase tracking-wider",
                                                children: t("settings.local_models_status")
                                            }),
                                            !settings.downloadLocalModels && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                className: "text-subtle -mt-1 ml-1 text-[9px] leading-tight",
                                                children: t("settings.local_models_download_required")
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "flex items-center justify-center gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(StatusIndicator, {
                                                        label: "SLM",
                                                        status: slmStatus,
                                                        progress: slmProgress,
                                                        onClick: settings.downloadLocalModels ? rewriter/* preloadSlm */.LM : undefined,
                                                        icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdSmartToy, {
                                                            className: "text-[14px]"
                                                        }),
                                                        tooltip: settings.downloadLocalModels ? t("slm_tooltip") : t("settings.local_models_download_required"),
                                                        statusText: statusText,
                                                        errorMessage: slmError,
                                                        warningMessage: slmWarning === "single_thread" ? t("status.single_thread") : slmWarning === "preload_timeout" ? t("status.preload_timeout") : null
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(StatusIndicator, {
                                                        label: "RAG",
                                                        status: embeddingStatus,
                                                        progress: embeddingProgress,
                                                        onClick: function() {
                                                            return ai_rag/* RAGService.preloadEmbeddings */.LZ.preloadEmbeddings(undefined, {
                                                                downloadLocalModels: settings.downloadLocalModels
                                                            });
                                                        },
                                                        icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdStorage, {
                                                            className: "text-[14px]"
                                                        }),
                                                        tooltip: t("rag_tooltip"),
                                                        statusText: statusText,
                                                        errorMessage: embeddingError,
                                                        warningMessage: embeddingWarning === "single_thread" ? t("status.single_thread") : embeddingWarning === "preload_timeout" ? t("status.preload_timeout") : null
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(StatusIndicator, {
                                                        label: "LID",
                                                        status: fastTextStatus,
                                                        onClick: language/* preloadFastText */.jr,
                                                        icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(MdTranslate, {
                                                            className: "text-[14px]"
                                                        }),
                                                        tooltip: t("fasttext_tooltip"),
                                                        statusText: statusText,
                                                        errorMessage: fastTextError,
                                                        warningMessage: fastTextWarning === "preload_timeout" ? t("status.preload_timeout") : null
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    activeTab === "Persona" && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "flex h-full flex-col space-y-4",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex flex-1 flex-col",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                    className: "text-subtle mb-1 block text-xs font-bold uppercase tracking-wider",
                                    children: t("system_prompt")
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("textarea", {
                                    className: "text-text placeholder:text-subtle border-border-light dark:border-border-dark focus:border-primary min-h-[200px] w-full flex-1 resize-none rounded-xl border bg-white p-3 text-sm leading-relaxed shadow-inner focus:outline-none dark:bg-gray-900",
                                    value: settings.systemPrompt,
                                    onChange: function(e) {
                                        return handleChange("systemPrompt", e.target.value);
                                    },
                                    placeholder: t("settings.system_prompt_placeholder")
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "text-subtle mt-2 text-[11px] leading-relaxed",
                                    children: t("settings.adaptive_context_hint")
                                })
                            ]
                        })
                    }),
                    activeTab === "Advanced" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "space-y-3 pt-0",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "text-subtle block text-xs font-bold uppercase tracking-wider",
                                        children: t("maintenance")
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "grid grid-cols-2 gap-3",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                                onClick: reindexBook,
                                                disabled: isIndexing || !activeBookId,
                                                className: (0,clsx_m/* default */.Z)("group col-span-2 flex items-center justify-between gap-2 rounded-xl border p-3.5 shadow-sm transition-all disabled:opacity-50", isBookIndexed ? "hover:bg-emerald-500/15 hover:border-emerald-500/35 border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/30 text-primary"),
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            isBookIndexed && !isIndexing ? /*#__PURE__*/ (0,jsx_runtime.jsx)(MdCheck, {
                                                                className: "text-xl"
                                                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(MdStorage, {
                                                                className: (0,clsx_m/* default */.Z)("text-xl", isIndexing && "animate-pulse")
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "flex flex-col items-start",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                        className: "text-[10px] font-bold uppercase tracking-wider",
                                                                        children: isIndexing ? t("chatbot.thinking").replace("...", "") + "..." : isBookIndexed ? t("status.ready") : t("reindex")
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                        className: "text-[9px] leading-tight opacity-70",
                                                                        children: isBookIndexed ? t("reindex_desc") : t("chatbot.index_description")
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    isIndexing && /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                        className: "font-mono text-xs font-bold",
                                                        children: [
                                                            indexProgress,
                                                            "%"
                                                        ]
                                                    }),
                                                    !isIndexing && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "text-[10px] font-semibold opacity-80",
                                                                children: isBookIndexed ? (indexedChunkCount || 0) > 0 ? "".concat(indexedChunkCount, " chunks") : t("status.ready") : t("status.not_indexed")
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(MdChevronRight, {
                                                                className: "text-subtle transition-transform group-hover:translate-x-0.5"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                                onClick: clearHistory,
                                                className: "border-border-light dark:border-border-dark bg-surface-1 hover:bg-error/5 hover:border-error/20 hover:text-error group flex flex-col items-center justify-center gap-2 rounded-xl border p-3 shadow-sm transition-all",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(MdDeleteSweep, {
                                                        className: "text-subtle group-hover:text-error text-xl transition-colors"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-[10px] font-bold uppercase tracking-wider",
                                                        children: t("clear_history")
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                                onClick: resetDefaults,
                                                className: "border-border-light dark:border-border-dark bg-surface-1 hover:bg-primary/5 hover:border-primary/20 hover:text-primary group flex flex-col items-center justify-center gap-2 rounded-xl border p-3 shadow-sm transition-all",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(MdRefresh, {
                                                        className: "text-subtle group-hover:text-primary text-xl transition-colors"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-[10px] font-bold uppercase tracking-wider",
                                                        children: t("reset_defaults")
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "text-subtle mb-1 block text-xs font-bold uppercase tracking-wider",
                                        children: t("tabs.advanced")
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "bg-surface-1 border-border-light dark:border-border-dark group flex items-center justify-between rounded-xl border p-3.5 transition-all",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "flex flex-col pr-4",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "group-hover:text-primary text-sm font-semibold transition-colors",
                                                        children: t("insight_triggers")
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-subtle text-[10px] leading-tight",
                                                        children: t("insight_triggers_desc")
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "relative inline-flex shrink-0 self-center",
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Switch, {
                                                    checked: settings.insightTriggers,
                                                    onChange: function(checked) {
                                                        return handleChange("insightTriggers", checked);
                                                    }
                                                })
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "bg-surface-1 border-border-light dark:border-border-dark group flex items-center justify-between rounded-xl border p-3.5 transition-all",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "flex flex-col pr-4",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "group-hover:text-primary text-sm font-semibold transition-colors",
                                                        children: t("auto_persona")
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-subtle text-[10px] leading-tight",
                                                        children: t("auto_persona_desc")
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "relative inline-flex shrink-0 self-center",
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Switch, {
                                                    checked: settings.autoPersona,
                                                    onChange: function(checked) {
                                                        return handleChange("autoPersona", checked);
                                                    }
                                                })
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "bg-surface-1 border-border-light dark:border-border-dark group flex items-center justify-between rounded-xl border p-3.5 transition-all",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "flex flex-col pr-4",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "group-hover:text-primary text-sm font-semibold transition-colors",
                                                        children: t("deep_think")
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-subtle text-[10px] leading-tight",
                                                        children: t("deep_think_desc")
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "relative inline-flex shrink-0 self-center",
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Switch, {
                                                    checked: settings.deepThink,
                                                    onChange: function(checked) {
                                                        return handleChange("deepThink", checked);
                                                    }
                                                })
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "bg-surface-1 border-border-light dark:border-border-dark group flex items-center justify-between rounded-xl border p-3.5 transition-all",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "flex flex-col pr-4",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "group-hover:text-primary text-sm font-semibold transition-colors",
                                                        children: t("selection.explain")
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-subtle text-[10px] leading-tight",
                                                        children: t("selection.explain_desc")
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "relative inline-flex shrink-0 self-center",
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Switch, {
                                                    checked: settings.explainSelection,
                                                    onChange: function(checked) {
                                                        return handleChange("explainSelection", checked);
                                                    }
                                                })
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "bg-surface-1 border-border-light dark:border-border-dark group flex items-center justify-between rounded-xl border p-3.5 transition-all",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "flex flex-col pr-4",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "group-hover:text-primary text-sm font-semibold transition-colors",
                                                        children: t("selection.summarize")
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-subtle text-[10px] leading-tight",
                                                        children: t("selection.summarize_desc")
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "relative inline-flex shrink-0 self-center",
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Switch, {
                                                    checked: settings.summarizeSelection,
                                                    onChange: function(checked) {
                                                        return handleChange("summarizeSelection", checked);
                                                    }
                                                })
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    activeTab === "Advanced" && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "space-y-6",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "py-2.5",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "mb-3 flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            className: "text-subtle block text-xs font-bold uppercase tracking-wider",
                                            children: t("temperature")
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "bg-surface-variant text-primary border-primary/10 rounded border px-2 py-0.5 font-mono text-xs shadow-inner",
                                            children: settings.temperature
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                    type: "range",
                                    min: "0",
                                    max: "2",
                                    step: "0.1",
                                    className: "premium-slider",
                                    value: settings.temperature,
                                    onChange: function(e) {
                                        return handleChange("temperature", parseFloat(e.target.value));
                                    }
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "text-subtle mt-1 flex justify-between px-0.5 text-[10px] font-bold uppercase tracking-tight",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            children: t("settings.temperature.precise")
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            children: t("settings.temperature.balanced")
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            children: t("settings.temperature.creative")
                                        })
                                    ]
                                })
                            ]
                        })
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "border-border-light dark:border-border-dark sticky bottom-0 z-[50] mt-auto space-y-4 border-t bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:bg-gray-900",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "bg-primary/5 border-primary/10 text-subtle flex items-center gap-3 rounded-xl border p-3",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(MdLock, {
                                className: "text-primary flex-shrink-0 text-xl"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                className: "text-[10px] leading-relaxed",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                        className: "text-primary mr-1 uppercase tracking-tighter",
                                        children: t("settings.privacy_first")
                                    }),
                                    t("settings.api_key_session_only"),
                                    " ",
                                    t("settings.remote_data_consent_desc")
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* Button */.z, {
                        className: "shadow-primary/20 flex w-full items-center justify-center gap-2 py-3.5 font-bold shadow-lg",
                        onClick: onClose,
                        children: isSetup ? t("settings.start_assistant") : t("settings.save_changes")
                    })
                ]
            }),
            showReindexConfirm && !isIndexing && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "absolute inset-0 z-[260] flex items-center justify-center p-4",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "bg-black/45 absolute inset-0 backdrop-blur-[1px]",
                        onClick: function() {
                            return setShowReindexConfirm(false);
                        }
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "border-border-light dark:border-border-dark relative w-full max-w-md rounded-2xl border bg-white shadow-2xl dark:bg-gray-900",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "border-border-light dark:border-border-dark border-b p-5",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h4", {
                                        className: "text-text text-sm font-bold",
                                        children: t("confirm_reindex_title")
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-subtle mt-2 text-xs leading-relaxed",
                                        children: t("confirm_reindex_desc")
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex items-center justify-end gap-2 p-4",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                        onClick: function() {
                                            return setShowReindexConfirm(false);
                                        },
                                        className: "border-border-light dark:border-border-dark bg-surface-1 hover:bg-surface-variant text-subtle hover:text-text rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                                        children: t("confirm_reindex_cancel")
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                        onClick: confirmReindexBook,
                                        className: "bg-primary hover:bg-primary-dark rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors",
                                        children: t("confirm_reindex_action")
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
};

// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_object_without_properties.mjs + 1 modules
var _object_without_properties = __webpack_require__(9106);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react-markdown@10.1.0_@types+react@18.0.0_react@18.0.0/node_modules/react-markdown/lib/index.js + 108 modules
var lib = __webpack_require__(9180);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react-syntax-highlighter@16.1.0_react@18.0.0/node_modules/react-syntax-highlighter/dist/esm/prism-light.js + 23 modules
var prism_light = __webpack_require__(1083);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react-syntax-highlighter@16.1.0_react@18.0.0/node_modules/react-syntax-highlighter/dist/cjs/languages/prism/json.js
var json = __webpack_require__(2128);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react-syntax-highlighter@16.1.0_react@18.0.0/node_modules/react-syntax-highlighter/dist/cjs/languages/prism/markdown.js
var markdown = __webpack_require__(6597);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react-syntax-highlighter@16.1.0_react@18.0.0/node_modules/react-syntax-highlighter/dist/cjs/languages/prism/python.js
var python = __webpack_require__(6844);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react-syntax-highlighter@16.1.0_react@18.0.0/node_modules/react-syntax-highlighter/dist/cjs/languages/prism/typescript.js
var typescript = __webpack_require__(6004);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react-syntax-highlighter@16.1.0_react@18.0.0/node_modules/react-syntax-highlighter/dist/cjs/styles/prism/index.js
var prism = __webpack_require__(8276);
;// CONCATENATED MODULE: ./src/components/ChatMessage.tsx















// Register common languages for technical books
prism_light/* default.registerLanguage */.Z.registerLanguage("typescript", typescript/* default */.Z);
prism_light/* default.registerLanguage */.Z.registerLanguage("json", json/* default */.Z);
prism_light/* default.registerLanguage */.Z.registerLanguage("python", python/* default */.Z);
prism_light/* default.registerLanguage */.Z.registerLanguage("markdown", markdown/* default */.Z);
var ChatMessage = function(param) {
    var role = param.role, content = param.content;
    var isUser = role === "user";
    var t = (0,useTranslation/* useTranslation */.$)("ai");
    var handleCopy = function(code) {
        navigator.clipboard.writeText(code);
    };
    // Extract thoughts if present (delimited by <thought> tags)
    var displayContent = content;
    var thought = null;
    var thoughtMatch = content.match(/<thought>([\s\S]*?)<\/thought>/);
    if (thoughtMatch) {
        thought = thoughtMatch[1].trim();
        displayContent = content.replace(/<thought>[\s\S]*?<\/thought>/, "").trim();
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: (0,clsx_m/* default */.Z)("group relative rounded-2xl px-4 py-3 max-w-[85%] text-sm leading-relaxed shadow-sm transition-all flex flex-col gap-2", isUser ? "self-end bg-primary text-on-primary ml-auto rounded-tr-sm shadow-lg shadow-primary/20 dark:shadow-lg dark:shadow-primary/10 transition-transform active:scale-[0.98]" : "self-start bg-surface-1 text-on-surface mr-auto border border-border-light/30 dark:border-border-dark/30 rounded-tl-sm shadow-md shadow-black/[0.02] dark:bg-surface-3 dark:border-white/5"),
        children: [
            !isUser && thought && /*#__PURE__*/ (0,jsx_runtime.jsxs)("details", {
                className: "bg-surface-2 border border-border-light/40 dark:border-border-dark/40 rounded-lg overflow-hidden group/thought",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("summary", {
                        className: "px-3 py-1.5 text-[10px] font-bold text-subtle uppercase tracking-widest cursor-pointer hover:bg-surface-3 transition-colors list-none flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                className: "w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"
                            }),
                            t("chatbot.reasoning")
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "px-3 pb-3 pt-1 text-xs text-subtle border-t border-border-light/20 dark:border-border-dark/20 leading-relaxed font-mono opacity-80",
                        children: thought
                    })
                ]
            }),
            isUser ? /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "whitespace-pre-wrap",
                children: displayContent
            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "markdown-body",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(lib/* Markdown */.UG, {
                    urlTransform: function(url) {
                        // Allow our custom cfi:// scheme for citation links
                        if (url.startsWith("cfi://")) return url;
                        // Default behavior for other URLs (sanitizes javascript: etc)
                        return (0,lib/* defaultUrlTransform */.nC)(url);
                    },
                    components: {
                        // ... existing components ...
                        // Style paragraphs to look like readable book text
                        p: function(_param) /*#__PURE__*/ {
                            var node = _param.node, props = (0,_object_without_properties/* default */.Z)(_param, [
                                "node"
                            ]);
                            return (0,jsx_runtime.jsx)("p", (0,_object_spread/* default */.Z)({
                                className: "mb-2 last:mb-0"
                            }, props));
                        },
                        // Style links
                        a: function(_param) {
                            var node = _param.node, props = (0,_object_without_properties/* default */.Z)(_param, [
                                "node"
                            ]);
                            var href = props.href || "";
                            if (href.startsWith("cfi://")) {
                                return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                    onClick: function() {
                                        var citation = href.replace("cfi://", "");
                                        window.dispatchEvent(new CustomEvent("reader-navigate-citation", {
                                            detail: {
                                                citation: citation
                                            }
                                        }));
                                    },
                                    className: "text-primary hover:underline font-bold bg-primary/5 px-1 rounded transition-colors",
                                    children: props.children
                                });
                            }
                            return /*#__PURE__*/ (0,jsx_runtime.jsx)("a", (0,_object_spread/* default */.Z)({
                                className: "text-primary hover:underline font-medium"
                            }, props));
                        },
                        // Style lists
                        ul: function(_param) /*#__PURE__*/ {
                            var node = _param.node, props = (0,_object_without_properties/* default */.Z)(_param, [
                                "node"
                            ]);
                            return (0,jsx_runtime.jsx)("ul", (0,_object_spread/* default */.Z)({
                                className: "list-disc pl-4 mb-2 space-y-1"
                            }, props));
                        },
                        ol: function(_param) /*#__PURE__*/ {
                            var node = _param.node, props = (0,_object_without_properties/* default */.Z)(_param, [
                                "node"
                            ]);
                            return (0,jsx_runtime.jsx)("ol", (0,_object_spread/* default */.Z)({
                                className: "list-decimal pl-4 mb-2 space-y-1"
                            }, props));
                        },
                        // Style blockquotes (Crucial for Book Citations)
                        blockquote: function(_param) /*#__PURE__*/ {
                            var node = _param.node, props = (0,_object_without_properties/* default */.Z)(_param, [
                                "node"
                            ]);
                            return (0,jsx_runtime.jsx)("blockquote", (0,_object_spread/* default */.Z)({
                                className: "border-l-4 border-primary/50 pl-3 py-1 my-2 bg-surface-1 italic text-subtle rounded-r"
                            }, props));
                        },
                        // Style headers
                        h1: function(_param) /*#__PURE__*/ {
                            var node = _param.node, props = (0,_object_without_properties/* default */.Z)(_param, [
                                "node"
                            ]);
                            return (0,jsx_runtime.jsx)("h1", (0,_object_spread/* default */.Z)({
                                className: "text-lg font-bold mt-4 mb-2"
                            }, props));
                        },
                        h2: function(_param) /*#__PURE__*/ {
                            var node = _param.node, props = (0,_object_without_properties/* default */.Z)(_param, [
                                "node"
                            ]);
                            return (0,jsx_runtime.jsx)("h2", (0,_object_spread/* default */.Z)({
                                className: "text-base font-bold mt-3 mb-1"
                            }, props));
                        },
                        h3: function(_param) /*#__PURE__*/ {
                            var node = _param.node, props = (0,_object_without_properties/* default */.Z)(_param, [
                                "node"
                            ]);
                            return (0,jsx_runtime.jsx)("h3", (0,_object_spread/* default */.Z)({
                                className: "text-sm font-bold mt-2 mb-1"
                            }, props));
                        },
                        // Code blocks
                        code: function code(_param) {
                            var node = _param.node, inline = _param.inline, className = _param.className, children = _param.children, props = (0,_object_without_properties/* default */.Z)(_param, [
                                "node",
                                "inline",
                                "className",
                                "children"
                            ]);
                            var match = /language-(\w+)/.exec(className || "");
                            var codeString = String(children).replace(/\n$/, "");
                            return !inline && match ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "relative group my-3 rounded-md overflow-hidden border border-border-light/50 dark:border-border-dark/50 shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            onClick: function() {
                                                return handleCopy(codeString);
                                            },
                                            className: "p-1.5 bg-surface-1 text-subtle hover:text-primary rounded shadow-sm border border-border-light dark:border-border-dark",
                                            title: t("chatbot.copy_code") || "Copy code",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdContentCopy */.Fqs, {
                                                size: 14
                                            })
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(prism_light/* default */.Z, (0,_object_spread_props/* default */.Z)((0,_object_spread/* default */.Z)({
                                        style: prism/* oneDark */.vk,
                                        language: match[1],
                                        PreTag: "div",
                                        customStyle: {
                                            margin: 0,
                                            borderRadius: 0,
                                            fontSize: "12px"
                                        }
                                    }, props), {
                                        children: codeString
                                    }))
                                ]
                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("code", (0,_object_spread_props/* default */.Z)((0,_object_spread/* default */.Z)({
                                className: "bg-surface-3 px-1.5 py-0.5 rounded text-xs font-mono border border-border-light/50 dark:border-border-dark/50 text-primary uppercase tracking-tighter"
                            }, props), {
                                children: children
                            }));
                        }
                    },
                    children: displayContent
                })
            })
        ]
    });
};

;// CONCATENATED MODULE: ./src/components/FirefoxMLModal.tsx
/**
 * Firefox Native ML Consent Modal
 *
 * SOTA 2026: Progressive enhancement with just-in-time consent
 * Redesigned to match BookDetailsModal aesthetics (Semantic Tokens)
 */ 




function FirefoxMLModal(param) {
    var isOpen = param.isOpen, onClose = param.onClose;
    var ref = (0,react.useState)("idle"), status = ref[0], setStatus = ref[1];
    var ref1 = (0,react.useState)(null), errorMessage = ref1[0], setErrorMessage = ref1[1];
    if (!isOpen) return null;
    var handleEnable = function() {
        var _ref = (0,_async_to_generator/* default */.Z)(function() {
            var granted, e;
            return (0,tslib_es6.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        setStatus("requesting");
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
                            (0,firefoxMLState.requestTrialMLPermissionSync)()
                        ];
                    case 2:
                        granted = _state.sent();
                        if (granted) {
                            (0,firefoxMLState.setPromptState)("accepted");
                            onClose(true);
                        } else {
                            (0,firefoxMLState.setPromptState)("declined");
                            setStatus("error");
                            setErrorMessage("Permission denied. Please try again.");
                        }
                        return [
                            3,
                            4
                        ];
                    case 3:
                        e = _state.sent();
                        console.error("[FirefoxMLModal] Permission request failed:", e);
                        setErrorMessage(e.message || "Request failed");
                        setStatus("error");
                        return [
                            3,
                            4
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        });
        return function handleEnable() {
            return _ref.apply(this, arguments);
        };
    }();
    var handleDecline = function() {
        (0,firefoxMLState.setPromptState)("declined");
        onClose(false);
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
                onClick: handleDecline
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "bg-background-light dark:bg-background-dark relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl transition-all",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "flex flex-col items-center p-8 text-center",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "bg-surface-light dark:bg-surface-dark mb-6 rounded-2xl p-4 shadow-lg ring-1 ring-black/5 dark:ring-white/10",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                className: "text-4xl",
                                children: "\uD83D\uDE80"
                            })
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                            className: "text-text-light dark:text-text-dark mb-3 text-2xl font-bold leading-tight",
                            children: "Supercharge your Browser"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                            className: "text-primary mb-6 text-sm font-medium uppercase tracking-wide",
                            children: "Firefox Native AI Acceleration"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                            className: "text-subtle-light dark:text-subtle-dark mb-8 text-sm leading-relaxed",
                            children: [
                                "Run AI models ",
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                    children: "directly on your device"
                                }),
                                ". No server latency, complete privacy, and 50x faster indexing."
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "mb-8 grid w-full grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark rounded-xl border p-4",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "mb-2 block text-xl",
                                            children: "⚡"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "text-text-light dark:text-text-dark block text-xs font-bold",
                                            children: "50X FASTER"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark rounded-xl border p-4",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "mb-2 block text-xl",
                                            children: "\uD83D\uDD12"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "text-text-light dark:text-text-dark block text-xs font-bold",
                                            children: "PRIVATE"
                                        })
                                    ]
                                })
                            ]
                        }),
                        status === "idle" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "w-full space-y-3",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                    onClick: handleEnable,
                                    className: "from-primary to-primary-dark shadow-primary/20 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-8 py-3.5 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]",
                                    children: "Enable Speed Boost"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                    onClick: handleDecline,
                                    className: "text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark py-2 text-xs font-medium transition-colors",
                                    children: "Not right now"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "text-subtle-light dark:text-subtle-dark mt-4 text-[10px] opacity-60",
                                    children: "Requires ~40MB one-time download."
                                })
                            ]
                        }),
                        status === "requesting" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex w-full animate-pulse flex-col items-center space-y-3 py-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: "border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "text-text-light dark:text-text-dark text-sm font-medium",
                                    children: "Check the permission popup..."
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "text-subtle-light dark:text-subtle-dark text-[10px]",
                                    children: 'Please click "Allow" in Firefox'
                                })
                            ]
                        }),
                        status === "error" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "bg-error/10 border-error/20 w-full space-y-2 rounded-xl border p-4 text-center",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "text-error text-sm font-bold",
                                    children: "❌ Setup Failed"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "text-subtle-light dark:text-subtle-dark text-xs",
                                    children: errorMessage
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                    onClick: handleEnable,
                                    className: "text-text-light dark:text-text-dark text-xs font-bold underline",
                                    children: "Try Again"
                                })
                            ]
                        })
                    ]
                })
            })
        ]
    });
}
/* harmony default export */ var components_FirefoxMLModal = ((/* unused pure expression or super */ null && (FirefoxMLModal)));

;// CONCATENATED MODULE: ./src/components/ChatbotSidebar.tsx

























var ChatbotSidebar = function(param) {
    var className = param.className;
    var ref, ref1, ref2, ref3, ref4, ref5, ref6;
    var readerSnap = (0,models/* useReaderSnapshot */.Ys)();
    var ref7 = (0,hooks/* useChatbot */.dp)(), state = ref7.state, sendMessage = ref7.sendMessage, stopGeneration = ref7.stopGeneration, startNewChat = ref7.startNewChat, deleteCurrentChat = ref7.deleteCurrentChat, setActiveChat = ref7.setActiveChat, clearChat = ref7.clearChat;
    var ref8 = (0,_sliced_to_array/* default */.Z)((0,src_state/* useAISettings */.KR)(), 1), settings = ref8[0];
    var ref9 = (0,react.useState)(""), input = ref9[0], setInput = ref9[1];
    var t = (0,useTranslation/* useTranslation */.$)("ai");
    var msgsRef = (0,react.useRef)(null);
    var hasApiKey = react.useMemo(function() {
        var ref;
        var apiKey = settings.apiKey.trim();
        var baseUrl = ((ref = settings.baseUrl) === null || ref === void 0 ? void 0 : ref.trim()) || "";
        if (settings.provider === "local") return baseUrl.length > 0;
        if (settings.provider === "custom") return baseUrl.length > 0 && apiKey.length > 0;
        return apiKey.length > 0;
    }, [
        settings.apiKey,
        settings.baseUrl,
        settings.provider
    ]);
    var ref10 = (0,react.useState)(false), showSettings = ref10[0], setShowSettings = ref10[1];
    var ref11 = (0,react.useState)(!hasApiKey), forceSetup = ref11[0], setForceSetup = ref11[1];
    var ref12 = (0,react.useState)(""), streamingContent = ref12[0], setStreamingContent = ref12[1];
    var ref13 = (0,react.useState)(""), activeRequestId = ref13[0], setActiveRequestId = ref13[1];
    var lastInsightAt = (0,react.useRef)({});
    var ref14 = (0,react.useState)(false), isIndexing = ref14[0], setIsIndexing = ref14[1];
    var ref15 = (0,react.useState)(null), indexError = ref15[0], setIndexError = ref15[1];
    var ref16 = (0,react.useState)(0), indexProgress = ref16[0], setIndexProgress = ref16[1];
    var ref17 = (0,react.useState)((0,rewriter/* getSlmStatus */.Cu)()), slmStatus = ref17[0], setSlmStatus = ref17[1];
    var ref18 = (0,react.useState)(null), slmError = ref18[0], setSlmError = ref18[1];
    var ref19 = (0,react.useState)((0,rewriter/* getSlmWarning */.CD)()), slmWarning = ref19[0], setSlmWarning = ref19[1];
    var ref20 = (0,react.useState)(ai_rag/* RAGService.getEmbeddingStatus */.LZ.getEmbeddingStatus()), embeddingStatus = ref20[0], setEmbeddingStatus = ref20[1];
    var ref21 = (0,react.useState)(null), embeddingError = ref21[0], setEmbeddingError = ref21[1];
    var ref22 = (0,react.useState)(ai_rag/* RAGService.getEmbeddingWarning */.LZ.getEmbeddingWarning()), embeddingWarning = ref22[0], setEmbeddingWarning = ref22[1];
    var ref23 = (0,react.useState)((0,language/* getFastTextStatus */.Xu)()), fastTextStatus = ref23[0], setFastTextStatus = ref23[1];
    var ref24 = (0,react.useState)(null), fastTextError = ref24[0], setFastTextError = ref24[1];
    var ref25 = (0,react.useState)((0,language/* getFastTextWarning */.E7)()), fastTextWarning = ref25[0], setFastTextWarning = ref25[1];
    var ref26 = (0,react.useState)(false), showFirefoxMLModal = ref26[0], setShowFirefoxMLModal = ref26[1];
    var firefoxMLChecked = (0,react.useRef)(false);
    var chatSessions = ((ref = readerSnap.focusedBookTab) === null || ref === void 0 ? void 0 : ref.book.chatSessions) || [];
    var activeChatId = ((ref1 = readerSnap.focusedBookTab) === null || ref1 === void 0 ? void 0 : ref1.book.activeChatId) || ((ref2 = chatSessions[0]) === null || ref2 === void 0 ? void 0 : ref2.id);
    var statusText = {
        ready: t("status.ready"),
        warning: t("status.warning"),
        downloading: t("status.downloading"),
        error: t("status.error"),
        clickToDownload: t("status.click_to_download")
    };
    var formatChatLabel = function(session, index) {
        var title = ((session === null || session === void 0 ? void 0 : session.title) || "").trim();
        return title || "Chat ".concat(index + 1);
    };
    (0,react.useEffect)(function() {
        setForceSetup(!hasApiKey);
    }, [
        hasApiKey
    ]);
    // SOTA: Show Firefox ML consent modal when sidebar opens
    (0,react.useEffect)(function() {
        if ((0,firefoxMLState.isFirefoxBrowser)() && !firefoxMLChecked.current && (0,firefoxMLState.shouldShowFirefoxMLModal)()) {
            firefoxMLChecked.current = true;
            setShowFirefoxMLModal(true);
        }
    }, []) // Run once on mount
    ;
    (0,react.useEffect)(function() {
        var handler = function(e) {
            var ref, ref1;
            var next = e === null || e === void 0 ? void 0 : (ref = e.detail) === null || ref === void 0 ? void 0 : ref.status;
            if (next === "unknown" || next === "downloading" || next === "ready" || next === "warning" || next === "error") {
                setSlmStatus(next);
                if (next !== "error") setSlmError(null);
            }
            var warning = e === null || e === void 0 ? void 0 : (ref1 = e.detail) === null || ref1 === void 0 ? void 0 : ref1.warning;
            if (typeof warning === "string") {
                setSlmWarning(warning);
            } else if (warning === null) {
                setSlmWarning(null);
            }
        };
        var errorHandler = function(e) {
            var ref, ref1;
            if ((e === null || e === void 0 ? void 0 : (ref = e.detail) === null || ref === void 0 ? void 0 : ref.status) && e.detail.status !== "error") return;
            var message = e === null || e === void 0 ? void 0 : (ref1 = e.detail) === null || ref1 === void 0 ? void 0 : ref1.message;
            if (typeof message === "string" && message.length > 0) {
                setSlmError(message);
            }
        };
        var debugHandler = function(e) {
            console.log("[SLM Debug]", e === null || e === void 0 ? void 0 : e.detail);
        };
        window.addEventListener("slm-status", handler);
        window.addEventListener("slm-error", errorHandler);
        window.addEventListener("slm-debug", debugHandler);
        return function() {
            window.removeEventListener("slm-status", handler);
            window.removeEventListener("slm-error", errorHandler);
            window.removeEventListener("slm-debug", debugHandler);
        };
    }, []);
    (0,react.useEffect)(function() {
        var handler = function(e) {
            var ref, ref1;
            var next = e === null || e === void 0 ? void 0 : (ref = e.detail) === null || ref === void 0 ? void 0 : ref.status;
            if (next === "unknown" || next === "downloading" || next === "ready" || next === "warning" || next === "error") {
                setEmbeddingStatus(next);
                if (next !== "error") setEmbeddingError(null);
            }
            var warning = e === null || e === void 0 ? void 0 : (ref1 = e.detail) === null || ref1 === void 0 ? void 0 : ref1.warning;
            if (typeof warning === "string") {
                setEmbeddingWarning(warning);
            } else if (warning === null) {
                setEmbeddingWarning(null);
            }
        };
        var errorHandler = function(e) {
            var ref, ref1;
            if ((e === null || e === void 0 ? void 0 : (ref = e.detail) === null || ref === void 0 ? void 0 : ref.status) && e.detail.status !== "error") return;
            var message = e === null || e === void 0 ? void 0 : (ref1 = e.detail) === null || ref1 === void 0 ? void 0 : ref1.message;
            if (typeof message === "string" && message.length > 0) {
                setEmbeddingError(message);
            }
        };
        var debugHandler = function(e) {
            console.log("[Embedding Debug]", e === null || e === void 0 ? void 0 : e.detail);
        };
        window.addEventListener("embedding-status", handler);
        window.addEventListener("embedding-error", errorHandler);
        window.addEventListener("embedding-debug", debugHandler);
        return function() {
            window.removeEventListener("embedding-status", handler);
            window.removeEventListener("embedding-error", errorHandler);
            window.removeEventListener("embedding-debug", debugHandler);
        };
    }, []);
    (0,react.useEffect)(function() {
        var handler = function(e) {
            var ref, ref1, ref2;
            var next = e === null || e === void 0 ? void 0 : (ref = e.detail) === null || ref === void 0 ? void 0 : ref.status;
            if (next === "unknown" || next === "downloading" || next === "ready" || next === "warning" || next === "error") {
                setFastTextStatus(next);
                if (next !== "error") setFastTextError(null);
            }
            var warning = e === null || e === void 0 ? void 0 : (ref1 = e.detail) === null || ref1 === void 0 ? void 0 : ref1.warning;
            if (typeof warning === "string") {
                setFastTextWarning(warning);
            } else if (warning === null) {
                setFastTextWarning(null);
            } else if ((e === null || e === void 0 ? void 0 : (ref2 = e.detail) === null || ref2 === void 0 ? void 0 : ref2.reasonCode) === "preload_timeout") {
                setFastTextWarning("preload_timeout");
            }
        };
        var errorHandler = function(e) {
            var ref, ref1;
            if ((e === null || e === void 0 ? void 0 : (ref = e.detail) === null || ref === void 0 ? void 0 : ref.status) && e.detail.status !== "error") return;
            var message = e === null || e === void 0 ? void 0 : (ref1 = e.detail) === null || ref1 === void 0 ? void 0 : ref1.message;
            if (typeof message === "string" && message.length > 0) {
                setFastTextError(message);
            }
        };
        var debugHandler = function(e) {
            console.log("[FastText Debug]", e === null || e === void 0 ? void 0 : e.detail);
        };
        window.addEventListener("fasttext-status", handler);
        window.addEventListener("fasttext-error", errorHandler);
        window.addEventListener("fasttext-debug", debugHandler);
        return function() {
            window.removeEventListener("fasttext-status", handler);
            window.removeEventListener("fasttext-error", errorHandler);
            window.removeEventListener("fasttext-debug", debugHandler);
        };
    }, []);
    var currentBook = (ref3 = readerSnap.focusedBookTab) === null || ref3 === void 0 ? void 0 : ref3.book;
    var isIndexed = (0,dexie_react_hooks.useLiveQuery)(/*#__PURE__*/ (0,_async_to_generator/* default */.Z)(function() {
        var idx, e, ref, errName, idx1;
        return (0,tslib_es6.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!currentBook) return [
                        2,
                        false
                    ];
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        6
                    ]);
                    return [
                        4,
                        db.db === null || db.db === void 0 ? void 0 : db.db.indices.where("[bookId+kind]").equals([
                            currentBook.id,
                            "chunks"
                        ]).first()
                    ];
                case 2:
                    idx = _state.sent();
                    return [
                        2,
                        !!idx
                    ];
                case 3:
                    e = _state.sent();
                    errName = (e === null || e === void 0 ? void 0 : e.name) || (e === null || e === void 0 ? void 0 : (ref = e._e) === null || ref === void 0 ? void 0 : ref.name);
                    if (!(errName === "SchemaError" || errName === "DataError")) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        db.db === null || db.db === void 0 ? void 0 : db.db.indices.get(currentBook.id)
                    ];
                case 4:
                    idx1 = _state.sent();
                    return [
                        2,
                        !!idx1
                    ];
                case 5:
                    return [
                        2,
                        false
                    ];
                case 6:
                    return [
                        2
                    ];
            }
        });
    }), [
        currentBook === null || currentBook === void 0 ? void 0 : currentBook.id
    ]);
    var ref27 = (0,react.useState)([]), suggestedQuestions = ref27[0], setSuggestedQuestions = ref27[1];
    var scrollToBottom = function() {
        if (msgsRef.current) {
            msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
        }
    };
    // AUTO-PERSONA: Classify book once
    (0,react.useEffect)(function() {
        var classify = function() {
            var _ref = (0,_async_to_generator/* default */.Z)(function() {
                var focusedItem, book, llm, persona, e;
                return (0,tslib_es6.__generator)(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            focusedItem = models/* reader.focusedBookTab */.r1.focusedBookTab;
                            if (!focusedItem || !settings.autoPersona) return [
                                2
                            ];
                            book = focusedItem.book;
                            if (book.aiPersona) return [
                                2
                            ]; // Already classified
                            _state.label = 1;
                        case 1:
                            _state.trys.push([
                                1,
                                4,
                                ,
                                5
                            ]);
                            llm = new ai_llm/* LLMService */.U(settings);
                            return [
                                4,
                                llm.classifyBook(book.metadata)
                            ];
                        case 2:
                            persona = _state.sent();
                            return [
                                4,
                                db.db === null || db.db === void 0 ? void 0 : db.db.books.update(book.id, {
                                    aiPersona: persona
                                })
                            ];
                        case 3:
                            _state.sent();
                            return [
                                3,
                                5
                            ];
                        case 4:
                            e = _state.sent();
                            console.error("Failed to auto-classify:", e);
                            return [
                                3,
                                5
                            ];
                        case 5:
                            return [
                                2
                            ];
                    }
                });
            });
            return function classify() {
                return _ref.apply(this, arguments);
            };
        }();
        classify();
    }, [
        (ref4 = readerSnap.focusedBookTab) === null || ref4 === void 0 ? void 0 : ref4.book.id,
        settings.autoPersona,
        settings
    ]);
    // INSIGHT TRIGGERS: Generate suggestions when reading
    (0,react.useEffect)(function() {
        if (!settings.insightTriggers || !models/* reader.focusedBookTab */.r1.focusedBookTab) return;
        var timer = setTimeout(/*#__PURE__*/ (0,_async_to_generator/* default */.Z)(function() {
            var ref, ref1, ref2, bookId, now, rag, bookLang, context, text, llm, langName, response, ref3, questions, e;
            return (0,tslib_es6.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            3,
                            ,
                            4
                        ]);
                        bookId = (ref = models/* reader.focusedBookTab */.r1.focusedBookTab) === null || ref === void 0 ? void 0 : ref.book.id;
                        if (!bookId) return [
                            2
                        ];
                        now = Date.now();
                        if (lastInsightAt.current[bookId] && now - lastInsightAt.current[bookId] < 10 * 60000) return [
                            2
                        ];
                        lastInsightAt.current[bookId] = now;
                        rag = ai_rag/* RAGService.getInstance */.LZ.getInstance();
                        bookLang = (0,language/* normalizeLangForRAG */.I$)((ref1 = models/* reader.focusedBookTab */.r1.focusedBookTab) === null || ref1 === void 0 ? void 0 : ref1.book.metadata.language, "en");
                        return [
                            4,
                            rag.retrieveContext(bookId, "important themes", 6, {
                                expandContext: true,
                                maxChars: 8000,
                                locale: bookLang
                            })
                        ];
                    case 1:
                        context = _state.sent();
                        text = context.map(function(c) {
                            return c.content;
                        }).join("\n");
                        llm = new ai_llm/* LLMService */.U(settings);
                        langName = (0,language/* langLabel */.lG)(((ref2 = models/* reader.focusedBookTab */.r1.focusedBookTab) === null || ref2 === void 0 ? void 0 : ref2.book.metadata.language) || "en");
                        return [
                            4,
                            llm.generateResponse("You are a helpful reading assistant. Generate 3 short, intriguing questions (max 10 words each) the reader could ask about this text. Return them as a JSON array of strings. Language: Respond in ".concat(langName, "."), "Text: ".concat(text))
                        ];
                    case 2:
                        response = _state.sent();
                        try {
                            ;
                            questions = JSON.parse(((ref3 = response.match(RegExp("\\[.*\\]", "s"))) === null || ref3 === void 0 ? void 0 : ref3[0]) || "[]");
                            setSuggestedQuestions(questions.slice(0, 3));
                        } catch (e1) {
                            setSuggestedQuestions([]);
                        }
                        return [
                            3,
                            4
                        ];
                    case 3:
                        e = _state.sent();
                        console.error("Insight Trigger Error:", e);
                        return [
                            3,
                            4
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        }), 15000) // 15s debounce
        ;
        return function() {
            return clearTimeout(timer);
        };
    }, [
        (ref5 = readerSnap.focusedBookTab) === null || ref5 === void 0 ? void 0 : ref5.book.id,
        settings.insightTriggers,
        settings
    ]);
    (0,react.useEffect)(function() {
        scrollToBottom();
    }, [
        state.messages,
        streamingContent
    ]);
    // Stream & Navigation Listeners
    (0,react.useEffect)(function() {
        var sleep = function(ms) {
            return new Promise(function(r) {
                return setTimeout(r, ms);
            });
        };
        var normHref = function(h) {
            return (h || "").replace(/^(\.\/)+/, "").replace(/^\/+/, "");
        };
        var normCfi = function(cfi) {
            if (!cfi) return "";
            if (cfi.startsWith("epubcfi(")) return cfi;
            if (cfi.startsWith("/")) return "epubcfi(".concat(cfi, ")");
            return cfi;
        };
        var isDisplayableCfi = function(cfi) {
            return !!cfi && cfi.startsWith("epubcfi(") && cfi.includes("!");
        };
        var resolveSpineHref = function(tab, href) {
            var ref, ref1, ref2, ref3;
            var spineItems = ((ref1 = tab === null || tab === void 0 ? void 0 : (ref = tab.book) === null || ref === void 0 ? void 0 : ref.spine) === null || ref1 === void 0 ? void 0 : ref1.spineItems) || ((ref3 = tab === null || tab === void 0 ? void 0 : (ref2 = tab.book) === null || ref2 === void 0 ? void 0 : ref2.spine) === null || ref3 === void 0 ? void 0 : ref3.items) || [];
            var target = normHref(href);
            var hit = spineItems.find(function(s) {
                var sh = normHref(s === null || s === void 0 ? void 0 : s.href);
                return sh === target || sh.endsWith(target) || target.endsWith(sh);
            });
            return (hit === null || hit === void 0 ? void 0 : hit.href) || href;
        };
        var displaySafe = function() {
            var _ref = (0,_async_to_generator/* default */.Z)(function(tab, target) {
                var ref, ref1, i, fn;
                return (0,tslib_es6.__generator)(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            i = 0;
                            _state.label = 1;
                        case 1:
                            if (!(i < 10)) return [
                                3,
                                4
                            ];
                            if (tab === null || tab === void 0 ? void 0 : tab.rendition) return [
                                3,
                                4
                            ];
                            return [
                                4,
                                sleep(50)
                            ];
                        case 2:
                            _state.sent();
                            _state.label = 3;
                        case 3:
                            i++;
                            return [
                                3,
                                1
                            ];
                        case 4:
                            fn = (tab === null || tab === void 0 ? void 0 : tab.display) ? tab.display.bind(tab) : tab === null || tab === void 0 ? void 0 : (ref = tab.rendition) === null || ref === void 0 ? void 0 : (ref1 = ref.display) === null || ref1 === void 0 ? void 0 : ref1.bind(tab.rendition);
                            if (!fn) throw new Error("No display() available");
                            return [
                                4,
                                fn(target)
                            ];
                        case 5:
                            return [
                                2,
                                _state.sent()
                            ];
                    }
                });
            });
            return function displaySafe(tab, target) {
                return _ref.apply(this, arguments);
            };
        }();
        var handleStream = function(e) {
            if (e.detail.requestId === activeRequestId) {
                setStreamingContent(e.detail.fullResponse);
            }
        };
        var handleNavigate = function(e) {
            void (0,_async_to_generator/* default */.Z)(function() {
                var ref, ref1, ref2, ref3, ref4, ref5, ref6, citation, match, tab, bookId, sectionIndex, chunkIndex, chunk, ref7, exact, err, cfi, emitHighlight, err1, hrefRaw, href, err2, spineItems, ref8, idx, spineHref, err3, err4, err5;
                return (0,tslib_es6.__generator)(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                22,
                                ,
                                23
                            ]);
                            citation = e.detail.citation;
                            match = citation === null || citation === void 0 ? void 0 : citation.match(/S(\d+):C(\d+)/);
                            tab = models/* reader.focusedBookTab */.r1.focusedBookTab;
                            if (!match || !tab) {
                                return [
                                    2
                                ];
                            }
                            bookId = (ref = tab.book) === null || ref === void 0 ? void 0 : ref.id;
                            if (!bookId) return [
                                2
                            ];
                            sectionIndex = Number(match[1]);
                            chunkIndex = Number(match[2]);
                            console.log("[Citation Trace] Indices:", {
                                sectionIndex: sectionIndex,
                                chunkIndex: chunkIndex
                            });
                            chunk = null;
                            _state.label = 1;
                        case 1:
                            _state.trys.push([
                                1,
                                5,
                                ,
                                6
                            ]);
                            if (!!Number.isNaN(chunkIndex)) return [
                                3,
                                4
                            ];
                            return [
                                4,
                                db.db.vectors.where("[bookId+index]").equals([
                                    bookId,
                                    chunkIndex
                                ]).first()
                            ];
                        case 2:
                            chunk = _state.sent();
                            if (!(chunk && Number.isFinite(sectionIndex) && (chunk === null || chunk === void 0 ? void 0 : (ref7 = chunk.metadata) === null || ref7 === void 0 ? void 0 : ref7.sectionIndex) !== sectionIndex)) return [
                                3,
                                4
                            ];
                            return [
                                4,
                                db.db.vectors.where("bookId").equals(bookId).filter(function(v) {
                                    var ref;
                                    return v.index === chunkIndex && (v === null || v === void 0 ? void 0 : (ref = v.metadata) === null || ref === void 0 ? void 0 : ref.sectionIndex) === sectionIndex;
                                }).first()
                            ];
                        case 3:
                            exact = _state.sent();
                            if (exact) chunk = exact;
                            _state.label = 4;
                        case 4:
                            return [
                                3,
                                6
                            ];
                        case 5:
                            err = _state.sent();
                            console.warn("[Citation] DB lookup failed:", err);
                            return [
                                3,
                                6
                            ];
                        case 6:
                            cfi = normCfi((chunk === null || chunk === void 0 ? void 0 : (ref1 = chunk.metadata) === null || ref1 === void 0 ? void 0 : ref1.cfi) || "");
                            emitHighlight = function() {
                                var ref, ref1, ref2, ref3, ref4, ref5;
                                window.dispatchEvent(new CustomEvent("reader-highlight-chunk", {
                                    detail: {
                                        cfi: cfi,
                                        content: chunk === null || chunk === void 0 ? void 0 : chunk.content,
                                        href: (chunk === null || chunk === void 0 ? void 0 : (ref = chunk.metadata) === null || ref === void 0 ? void 0 : ref.href) || "",
                                        sectionIndex: sectionIndex,
                                        chunkIndex: chunkIndex,
                                        anchorStartNorm: Number.isFinite(Number(chunk === null || chunk === void 0 ? void 0 : (ref1 = chunk.metadata) === null || ref1 === void 0 ? void 0 : ref1.anchorStartNorm)) ? Number(chunk === null || chunk === void 0 ? void 0 : (ref2 = chunk.metadata) === null || ref2 === void 0 ? void 0 : ref2.anchorStartNorm) : undefined,
                                        anchorEndNorm: Number.isFinite(Number(chunk === null || chunk === void 0 ? void 0 : (ref3 = chunk.metadata) === null || ref3 === void 0 ? void 0 : ref3.anchorEndNorm)) ? Number(chunk === null || chunk === void 0 ? void 0 : (ref4 = chunk.metadata) === null || ref4 === void 0 ? void 0 : ref4.anchorEndNorm) : undefined,
                                        anchorAlgo: (chunk === null || chunk === void 0 ? void 0 : (ref5 = chunk.metadata) === null || ref5 === void 0 ? void 0 : ref5.anchorAlgo) || undefined
                                    }
                                }));
                            };
                            if (!isDisplayableCfi(cfi)) return [
                                3,
                                10
                            ];
                            _state.label = 7;
                        case 7:
                            _state.trys.push([
                                7,
                                9,
                                ,
                                10
                            ]);
                            return [
                                4,
                                displaySafe(tab, cfi)
                            ];
                        case 8:
                            _state.sent();
                            emitHighlight();
                            return [
                                2
                            ];
                        case 9:
                            err1 = _state.sent();
                            console.warn("[Citation] CFI navigation failed:", err1);
                            return [
                                3,
                                10
                            ];
                        case 10:
                            hrefRaw = (chunk === null || chunk === void 0 ? void 0 : (ref2 = chunk.metadata) === null || ref2 === void 0 ? void 0 : ref2.href) || "";
                            if (!hrefRaw) return [
                                3,
                                14
                            ];
                            href = resolveSpineHref(tab, hrefRaw);
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
                                displaySafe(tab, href)
                            ];
                        case 12:
                            _state.sent();
                            emitHighlight();
                            return [
                                2
                            ];
                        case 13:
                            err2 = _state.sent();
                            console.warn("[Citation] Href navigation failed:", err2);
                            return [
                                3,
                                14
                            ];
                        case 14:
                            spineItems = ((ref4 = (ref3 = tab === null || tab === void 0 ? void 0 : tab.book) === null || ref3 === void 0 ? void 0 : ref3.spine) === null || ref4 === void 0 ? void 0 : ref4.spineItems) || ((ref6 = (ref5 = tab === null || tab === void 0 ? void 0 : tab.book) === null || ref5 === void 0 ? void 0 : ref5.spine) === null || ref6 === void 0 ? void 0 : ref6.items) || [];
                            if (!(Number.isFinite(sectionIndex) && spineItems.length)) return [
                                3,
                                21
                            ];
                            idx = sectionIndex;
                            if (idx >= spineItems.length && idx - 1 >= 0 && idx - 1 < spineItems.length) {
                                idx = idx - 1;
                            }
                            spineHref = (ref8 = spineItems[idx]) === null || ref8 === void 0 ? void 0 : ref8.href;
                            if (!spineHref) return [
                                3,
                                18
                            ];
                            _state.label = 15;
                        case 15:
                            _state.trys.push([
                                15,
                                17,
                                ,
                                18
                            ]);
                            return [
                                4,
                                displaySafe(tab, spineHref)
                            ];
                        case 16:
                            _state.sent();
                            emitHighlight();
                            return [
                                2
                            ];
                        case 17:
                            err3 = _state.sent();
                            console.warn("[Citation] Spine href navigation failed:", err3);
                            return [
                                3,
                                18
                            ];
                        case 18:
                            _state.trys.push([
                                18,
                                20,
                                ,
                                21
                            ]);
                            return [
                                4,
                                displaySafe(tab, idx)
                            ];
                        case 19:
                            _state.sent();
                            emitHighlight();
                            return [
                                2
                            ];
                        case 20:
                            err4 = _state.sent();
                            console.error("[Citation] display(index) failed:", err4);
                            return [
                                3,
                                21
                            ];
                        case 21:
                            return [
                                3,
                                23
                            ];
                        case 22:
                            err5 = _state.sent();
                            console.error("[Citation] Navigation handler crashed:", err5);
                            return [
                                3,
                                23
                            ];
                        case 23:
                            return [
                                2
                            ];
                    }
                });
            })();
        };
        window.addEventListener("chatbot-stream", handleStream);
        window.addEventListener("reader-navigate-citation", handleNavigate);
        return function() {
            window.removeEventListener("chatbot-stream", handleStream);
            window.removeEventListener("reader-navigate-citation", handleNavigate);
        };
    }, [
        activeRequestId
    ]);
    // Clear streaming content when loading stops
    (0,react.useEffect)(function() {
        if (!state.isLoading) {
            setStreamingContent("");
        }
    }, [
        state.isLoading
    ]);
    var handleSend = function() {
        if (!input.trim() || state.isLoading) return;
        var rid = Date.now().toString();
        setActiveRequestId(rid);
        sendMessage(input, rid);
        setInput("");
    };
    var handleReindex = function() {
        var _ref = (0,_async_to_generator/* default */.Z)(function() {
            var fileRecord, bookLang, e;
            return (0,tslib_es6.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!currentBook || isIndexing) return [
                            2
                        ];
                        // SOTA: Show Firefox ML consent modal before indexing if needed
                        if ((0,firefoxMLState.isFirefoxBrowser)() && !firefoxMLChecked.current && (0,firefoxMLState.shouldShowFirefoxMLModal)()) {
                            firefoxMLChecked.current = true;
                            setShowFirefoxMLModal(true);
                        }
                        return [
                            4,
                            db.db === null || db.db === void 0 ? void 0 : db.db.files.get(currentBook.id)
                        ];
                    case 1:
                        fileRecord = _state.sent();
                        if (!fileRecord) {
                            setIndexError(t("index.file_missing"));
                            return [
                                2
                            ];
                        }
                        setIndexError(null);
                        setIsIndexing(true);
                        setIndexProgress(0);
                        _state.label = 2;
                    case 2:
                        _state.trys.push([
                            2,
                            4,
                            5,
                            6
                        ]);
                        bookLang = (0,language/* normalizeLangForRAG */.I$)(currentBook.metadata.language, "en");
                        return [
                            4,
                            ai_rag/* RAGService.getInstance */.LZ.getInstance().indexBook(fileRecord.file, currentBook.id, function(p) {
                                return setIndexProgress(p);
                            }, bookLang)
                        ];
                    case 3:
                        _state.sent();
                        return [
                            3,
                            6
                        ];
                    case 4:
                        e = _state.sent();
                        console.error("Indexing failed:", e);
                        setIndexError(t("index.failed", {
                            error: (0,_instanceof/* default */.Z)(e, Error) ? e.message : String(e)
                        }));
                        return [
                            3,
                            6
                        ];
                    case 5:
                        setIsIndexing(false);
                        return [
                            7
                        ];
                    case 6:
                        return [
                            2
                        ];
                }
            });
        });
        return function handleReindex() {
            return _ref.apply(this, arguments);
        };
    }();
    var handleSearchDeeper = function() {
        var lastMsg = state.messages.filter(function(m) {
            return m.role === "user";
        }).pop();
        if (!lastMsg || state.isLoading) return;
        var rid = Date.now().toString();
        setActiveRequestId(rid);
        sendMessage(lastMsg.content, rid, {
            deeper: true,
            skipUserMessage: true
        });
    };
    var showDeeperButton = !state.isLoading && !!((ref6 = state.meta) === null || ref6 === void 0 ? void 0 : ref6.canSearchDeeper) && state.messages.length > 0 && state.messages[state.messages.length - 1].role === "assistant";
    var deeperLabel = t("chatbot.search_deeper");
    if (forceSetup) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            className: (0,clsx_m/* default */.Z)("bg-surface-1 border-border-light dark:border-border-dark flex h-full flex-col border-l", className),
            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "animate-in fade-in zoom-in flex flex-1 flex-col items-center justify-center space-y-6 p-8 text-center duration-500",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "bg-primary/10 text-primary flex h-20 w-20 items-center justify-center rounded-3xl shadow-inner",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdSmartToy */.yLM, {
                            size: 48
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                className: "text-2xl font-bold tracking-tight",
                                children: t("chatbot.welcome_title")
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-subtle mt-2 text-sm leading-relaxed",
                                children: t("chatbot.welcome_desc")
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "w-full pt-4",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(AISettingsPanel, {
                            onClose: function() {
                                return setForceSetup(false);
                            },
                            onClearHistory: clearChat,
                            isSetup: true,
                            className: "border-border-light dark:border-border-dark max-h-[500px] overflow-hidden rounded-2xl border shadow-2xl"
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "text-subtle text-[10px] font-bold uppercase tracking-widest opacity-50",
                        children: t("chatbot.footer")
                    })
                ]
            })
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: (0,clsx_m/* default */.Z)("bg-surface-2 border-border-light dark:border-border-dark relative flex h-full min-w-[300px] flex-col border-l !bg-opacity-100", className),
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "border-border-light dark:border-border-dark bg-surface-1 sticky top-0 z-10 flex items-center justify-between border-b !bg-opacity-100 p-4 shadow-sm",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("h2", {
                        className: "flex items-center gap-2 font-medium",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdSmartToy */.yLM, {}),
                            " ",
                            t("title")
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "ml-2 flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(StatusIndicator, {
                                label: "SLM",
                                status: slmStatus,
                                onClick: settings.downloadLocalModels ? rewriter/* preloadSlm */.LM : undefined,
                                icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdSmartToy */.yLM, {
                                    className: "text-[10px]"
                                }),
                                tooltip: t("slm_tooltip"),
                                statusText: statusText,
                                errorMessage: slmError,
                                warningMessage: slmWarning === "single_thread" ? t("status.single_thread") : slmWarning === "preload_timeout" ? t("status.preload_timeout") : null
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(StatusIndicator, {
                                label: "RAG",
                                status: embeddingStatus,
                                onClick: settings.downloadLocalModels ? function() {
                                    return ai_rag/* RAGService.preloadEmbeddings */.LZ.preloadEmbeddings(undefined, {
                                        downloadLocalModels: true
                                    });
                                } : undefined,
                                icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdStorage */.WMK, {
                                    className: "text-[10px]"
                                }),
                                tooltip: t("rag_tooltip"),
                                statusText: statusText,
                                errorMessage: embeddingError,
                                warningMessage: embeddingWarning === "single_thread" ? t("status.single_thread") : embeddingWarning === "preload_timeout" ? t("status.preload_timeout") : null
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(StatusIndicator, {
                                label: "LID",
                                status: fastTextStatus,
                                onClick: language/* preloadFastText */.jr,
                                icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdTranslate */.mp2, {
                                    className: "text-[10px]"
                                }),
                                tooltip: t("fasttext_tooltip"),
                                statusText: statusText,
                                errorMessage: fastTextError,
                                warningMessage: fastTextWarning === "preload_timeout" ? t("status.preload_timeout") : null
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "ml-auto flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* IconButton */.h, {
                                Icon: index_esm/* MdDelete */.ZkW,
                                title: t("clear_history"),
                                onClick: function() {
                                    if (confirm(t("confirm_clear"))) {
                                        deleteCurrentChat();
                                    }
                                },
                                disabled: state.isLoading || chatSessions.length === 0
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* IconButton */.h, {
                                Icon: index_esm/* MdSettings */.b9P,
                                title: t("chatbot.settings_tooltip"),
                                onClick: function() {
                                    return setShowSettings(true);
                                }
                            })
                        ]
                    })
                ]
            }),
            chatSessions.length > 0 && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "border-border-light dark:border-border-dark bg-surface-1 flex items-center gap-2 border-b px-4 py-2",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("select", {
                        className: "border-border-light dark:border-border-dark focus:ring-primary/30 flex-1 rounded-lg border bg-white px-2 py-1.5 text-[11px] font-semibold focus:outline-none focus:ring-1 dark:bg-gray-900",
                        value: activeChatId,
                        onChange: function(e) {
                            return setActiveChat(e.target.value);
                        },
                        disabled: state.isLoading,
                        children: chatSessions.map(function(session, idx) {
                            return /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                value: session.id,
                                children: formatChatLabel(session, idx)
                            }, session.id);
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* IconButton */.h, {
                        Icon: index_esm/* MdAdd */.x06,
                        title: t("new_chat_tooltip"),
                        onClick: function() {
                            return startNewChat();
                        },
                        disabled: state.isLoading
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "custom-scrollbar flex-1 space-y-5 overflow-y-auto p-4",
                ref: msgsRef,
                children: [
                    state.messages.length === 0 && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "animate-in fade-in slide-in-from-bottom-4 flex min-h-[60%] flex-col items-center justify-center space-y-6 p-6 text-center duration-700",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "bg-surface-1 text-primary border-border-light/50 flex h-20 w-20 items-center justify-center rounded-3xl border shadow-inner",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdSmartToy */.yLM, {
                                    size: 40
                                })
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                        className: "text-xl font-bold tracking-tight",
                                        children: t("chatbot.welcome_title")
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-subtle mx-auto max-w-[240px] text-sm leading-relaxed",
                                        children: t("chatbot.empty_state_desc")
                                    })
                                ]
                            }),
                            !isIndexed && !isIndexing && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "from-primary/10 via-primary/5 border-primary/20 animate-in zoom-in group relative w-full space-y-5 overflow-hidden rounded-2xl border bg-gradient-to-br to-transparent p-6 shadow-sm delay-300 duration-500",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "absolute -right-4 -top-4 opacity-5 transition-opacity group-hover:opacity-10",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ProviderIcons/* LumenSparkleIcon */.N5, {
                                            className: "size-20"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "relative z-10 flex items-start gap-3 text-left",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "bg-primary/10 text-primary rounded-lg p-2",
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdInfoOutline */.eJU, {
                                                    size: 20
                                                })
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                className: "text-text pt-1 text-xs font-semibold leading-tight",
                                                children: t("chatbot.index_description")
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                        onClick: handleReindex,
                                        className: "from-primary to-primary-dark text-on-primary shadow-primary/30 group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r py-3 text-xs font-black shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover/btn:opacity-100"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdFlashOn */.V5G, {
                                                className: "animate-pulse text-lg"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "relative z-10",
                                                children: t("chatbot.start_indexing")
                                            })
                                        ]
                                    })
                                ]
                            }),
                            indexError && !isIndexing && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                role: "alert",
                                className: "text-xs font-medium text-red-700 dark:text-red-300",
                                children: indexError
                            }),
                            isIndexing && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "bg-surface-1 border-primary/20 shadow-2l ring-primary/10 animate-pulse-subtle w-full space-y-5 rounded-2xl border p-6 ring-1",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "text-primary flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ProviderIcons/* LumenSparkleIcon */.N5, {
                                                        className: "animate-spin-slow"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        children: t("chatbot.indexing_knowledge")
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                className: "bg-primary/10 rounded-full px-2 py-0.5",
                                                children: [
                                                    indexProgress,
                                                    "%"
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "bg-primary/10 border-primary/5 h-2 w-full overflow-hidden rounded-full border p-0.5",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                            className: "from-primary via-primary-light to-primary h-full rounded-full bg-gradient-to-r shadow-[0_0_12px_rgba(var(--color-primary),0.5)] transition-all duration-500 ease-out",
                                            style: {
                                                width: "".concat(indexProgress, "%")
                                            }
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-subtle text-center text-[10px] font-medium italic opacity-80",
                                        children: t("chatbot.indexing_subtext")
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "space-y-1 pt-4 opacity-50",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-[10px] font-bold uppercase tracking-widest",
                                        children: t("chatbot.footer")
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                        className: "text-[10px] font-medium italic",
                                        children: [
                                            t("chatbot.connected_to"),
                                            " ",
                                            settings.provider
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    state.messages.map(function(msg) {
                        return /*#__PURE__*/ (0,jsx_runtime.jsx)(ChatMessage, {
                            role: msg.role,
                            content: msg.content
                        }, msg.id);
                    }),
                    showDeeperButton && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "animate-in fade-in slide-in-from-bottom-2 flex justify-center p-2",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                            className: "border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary group flex items-center gap-2 rounded-full border py-1.5 px-4 text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all",
                            onClick: handleSearchDeeper,
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdSearch */.vU7, {
                                    className: "text-sm transition-transform group-hover:scale-110"
                                }),
                                deeperLabel
                            ]
                        })
                    }),
                    streamingContent && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "animate-pulse",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ChatMessage, {
                            role: "assistant",
                            content: streamingContent
                        })
                    }),
                    state.isLoading && !streamingContent && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "text-subtle ml-2 animate-pulse self-start text-sm",
                        children: t("chatbot.status_context")
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "bg-surface-2 border-border-light/40 dark:border-border-dark/40 space-y-3 border-t !bg-opacity-100 p-4 shadow-[0_-12px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.2)]",
                children: [
                    settings.insightTriggers && suggestedQuestions.length > 0 && !input && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "animate-in fade-in slide-in-from-bottom-2 custom-scrollbar flex max-h-24 flex-wrap gap-2 overflow-y-auto p-1 duration-500",
                        children: suggestedQuestions.map(function(q, i) {
                            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                onClick: function() {
                                    return setInput(q);
                                },
                                className: "bg-surface-1 hover:bg-primary hover:text-on-primary border-border-light dark:border-border-dark dark:bg-surface-3 group/q flex max-w-full items-center gap-2 truncate rounded-xl border px-3 py-2 text-left text-[11px] shadow-sm transition-all hover:-translate-y-0.5",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                        className: "opacity-50 transition-opacity group-hover/q:opacity-100",
                                        children: "✨"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                        className: "flex-1 truncate font-medium",
                                        children: q
                                    })
                                ]
                            }, i);
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "ring-border-light/30 dark:ring-border-dark/30 bg-surface-1 focus-within:ring-primary/40 relative overflow-hidden rounded-2xl shadow-xl ring-1 transition-all focus-within:shadow-2xl",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                className: "placeholder:text-subtle/40 w-full appearance-none border-none bg-transparent py-4 pl-5 pr-12 text-sm font-medium shadow-none outline-none ring-0 focus:ring-0",
                                placeholder: t("chatbot.placeholder"),
                                disabled: state.isLoading,
                                value: input,
                                onChange: function(e) {
                                    return setInput(e.target.value);
                                },
                                onKeyDown: function(e) {
                                    return e.key === "Enter" && handleSend();
                                }
                            }),
                            state.isLoading ? /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                onClick: stopGeneration,
                                className: "animate-in zoom-in absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-red-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-600",
                                title: t("chatbot.stop"),
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdStop */.l74, {
                                    size: 20
                                })
                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                onClick: handleSend,
                                disabled: !input.trim(),
                                className: "text-primary hover:text-primary-dark hover:bg-primary/10 absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-all disabled:opacity-30 disabled:hover:bg-transparent",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdSend */.D6S, {
                                    size: 18
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "text-subtle mt-2 text-center text-[10px] opacity-60",
                        children: t("chatbot.disclaimer")
                    })
                ]
            }),
            showSettings && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "animate-in slide-in-from-right ai-settings-panel absolute inset-0 z-[200] flex flex-col bg-white shadow-2xl duration-200 dark:bg-gray-900",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(AISettingsPanel, {
                    onClose: function() {
                        return setShowSettings(false);
                    },
                    onClearHistory: clearChat,
                    className: "h-full w-full"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(FirefoxMLModal, {
                isOpen: showFirefoxMLModal,
                onClose: function(enabled) {
                    setShowFirefoxMLModal(false);
                    if (enabled) {
                        // Reset cache to re-probe Firefox ML on next request
                        (0,ai_rag/* resetFirefoxMLCache */.Rc)();
                    }
                }
            })
        ]
    });
};


/***/ }),

/***/ 8188:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "nv": function() { return /* binding */ TextField; }
/* harmony export */ });
/* unused harmony exports Checkbox, Select, ColorPicker, Label */
/* harmony import */ var _swc_helpers_src_object_spread_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(6690);
/* harmony import */ var _swc_helpers_src_object_without_properties_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9106);
/* harmony import */ var _swc_helpers_src_to_consumable_array_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8417);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1999);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5789);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6248);
/* harmony import */ var react_icons_md__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5615);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6901);
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4599);









function TextField(_param) {
    var name = _param.name, as = _param.as, className = _param.className, _hideLabel = _param.hideLabel, hideLabel = _hideLabel === void 0 ? false : _hideLabel, autoFocus = _param.autoFocus, _actions = _param.actions, actions = _actions === void 0 ? [] : _actions, datalist = _param.datalist, onClear = _param.onClear, outerRef = _param.mRef, props = (0,_swc_helpers_src_object_without_properties_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(_param, [
        "name",
        "as",
        "className",
        "hideLabel",
        "autoFocus",
        "actions",
        "datalist",
        "onClear",
        "mRef"
    ]);
    var Component = as || "input";
    var isInput = Component === "input";
    var innerRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var datalistId = "".concat(name, "-datalist") // TODO: use `useId`
    ;
    var ref = outerRef || innerRef;
    var mobile = (0,_hooks__WEBPACK_IMPORTED_MODULE_2__/* .useMobile */ .XA)();
    var t = (0,_hooks__WEBPACK_IMPORTED_MODULE_2__/* .useTranslation */ .$G)();
    if (onClear) {
        actions = (0,_swc_helpers_src_to_consumable_array_mjs__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)(actions).concat([
            {
                title: t("action.clear"),
                Icon: react_icons_md__WEBPACK_IMPORTED_MODULE_6__/* .MdClose */ .FU5,
                onClick: onClear
            }, 
        ]);
    }
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function() {
        if (mobile === false && autoFocus) {
            setTimeout(function() {
                var ref1;
                (ref1 = ref.current) === null || ref1 === void 0 ? void 0 : ref1.focus();
            });
        }
    }, [
        autoFocus,
        mobile,
        ref
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (0,clsx__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)("flex flex-col", className),
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Label, {
                name: name,
                hide: hideLabel,
                children: name
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "bg-default textfield flex grow items-center",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Component, (0,_swc_helpers_src_object_spread_mjs__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)({
                        ref: ref,
                        name: name,
                        id: name,
                        className: (0,clsx__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)("typescale-body-medium text-on-surface-variant placeholder:text-outline/60 w-0 flex-1 bg-transparent py-1 px-1.5 !text-[13px]", isInput || "scroll h-full resize-none")
                    }, datalist && {
                        list: datalistId
                    }, props)),
                    datalist && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("datalist", {
                        id: datalistId,
                        children: datalist
                    }),
                    !!actions.length && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                        className: "mx-1 flex gap-0.5",
                        children: actions.map(function(_param) /*#__PURE__*/ {
                            var onClick = _param.onClick, a = (0,_swc_helpers_src_object_without_properties_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(_param, [
                                "onClick"
                            ]);
                            return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_3__/* .IconButton */ .h, (0,_swc_helpers_src_object_spread_mjs__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)({
                                className: "text-outline !p-px",
                                onClick: function() {
                                    onClick(ref.current);
                                }
                            }, a), a.title);
                        })
                    })
                ]
            })
        ]
    });
}
var Checkbox = function(_param) {
    var name = _param.name, props = _object_without_properties(_param, [
        "name"
    ]);
    return /*#__PURE__*/ _jsxs("div", {
        className: "flex items-center",
        children: [
            /*#__PURE__*/ _jsx(Label, {
                name: name
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "checkbox bg-default relative ml-auto rounded-sm",
                children: [
                    /*#__PURE__*/ _jsx("input", _object_spread({
                        type: "checkbox",
                        name: name,
                        id: name,
                        className: "peer block h-4 w-4 appearance-none"
                    }, props)),
                    /*#__PURE__*/ _jsx(MdCheck, {
                        className: "text-on-surface-variant pointer-events-none invisible absolute top-0 peer-checked:visible"
                    })
                ]
            })
        ]
    });
};
var Select = function(_param) {
    var name = _param.name, className = _param.className, props = _object_without_properties(_param, [
        "name",
        "className"
    ]);
    return /*#__PURE__*/ _jsxs("div", {
        className: clsx("flex flex-col", className),
        children: [
            name && /*#__PURE__*/ _jsx(Label, {
                name: name
            }),
            /*#__PURE__*/ _jsx("select", _object_spread({
                name: name,
                id: name,
                className: clsx("typescale-body-medium text-on-surface-variant bg-default max-w-xs px-0.5 py-1 !text-[13px]")
            }, props))
        ]
    });
};
var ColorPicker = function(_param) {
    var name = _param.name, className = _param.className, props = _object_without_properties(_param, [
        "name",
        "className"
    ]);
    return /*#__PURE__*/ _jsxs("div", {
        className: clsx("flex flex-col", className),
        children: [
            name && /*#__PURE__*/ _jsx(Label, {
                name: name
            }),
            /*#__PURE__*/ _jsx("input", _object_spread({
                type: "color",
                name: name,
                id: name,
                className: "h-6 w-12"
            }, props))
        ]
    });
};
var Label = function(param) {
    var name = param.name, _hide = param.hide, hide = _hide === void 0 ? false : _hide, className = param.className;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
        htmlFor: name,
        className: (0,clsx__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)("typescale-label-medium text-on-surface-variant mb-1 block !text-[13px]", hide && "hidden", className),
        children: name
    });
};


/***/ })

}]);