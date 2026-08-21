(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 4596:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(3251);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 8188:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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


/***/ }),

/***/ 3251:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Index; }
});

// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_async_to_generator.mjs
var _async_to_generator = __webpack_require__(947);
// EXTERNAL MODULE: ../../node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(2336);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react@18.0.0/node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(1999);
// EXTERNAL MODULE: ../../node_modules/.pnpm/dexie-react-hooks@1.1.1_@types+react@18.0.0_dexie@3.2.2_react@18.0.0/node_modules/dexie-react-hooks/dist/dexie-react-hooks.js
var dexie_react_hooks = __webpack_require__(4010);
// EXTERNAL MODULE: ../../node_modules/.pnpm/file-saver@2.0.5/node_modules/file-saver/dist/FileSaver.min.js
var FileSaver_min = __webpack_require__(2887);
// EXTERNAL MODULE: ../../node_modules/.pnpm/next@12.3.4_@babel+core@7.28.6_react-dom@18.0.0_react@18.0.0__react@18.0.0/node_modules/next/head.js
var head = __webpack_require__(4193);
var head_default = /*#__PURE__*/__webpack_require__.n(head);
// EXTERNAL MODULE: ../../node_modules/.pnpm/next@12.3.4_@babel+core@7.28.6_react-dom@18.0.0_react@18.0.0__react@18.0.0/node_modules/next/router.js
var next_router = __webpack_require__(384);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react@18.0.0/node_modules/react/index.js
var react = __webpack_require__(6248);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react-use@17.4.0_react-dom@18.0.0_react@18.0.0__react@18.0.0/node_modules/react-use/esm/usePrevious.js
var usePrevious = __webpack_require__(3269);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_object_spread.mjs
var _object_spread = __webpack_require__(6690);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_object_spread_props.mjs
var _object_spread_props = __webpack_require__(3089);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_sliced_to_array.mjs + 2 modules
var _sliced_to_array = __webpack_require__(1296);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@dnd-kit+core@6.3.1_react-dom@18.0.0_react@18.0.0__react@18.0.0/node_modules/@dnd-kit/core/dist/core.esm.js + 1 modules
var core_esm = __webpack_require__(4308);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@dnd-kit+modifiers@9.0.0_@dnd-kit+core@6.3.1_react-dom@18.0.0_react@18.0.0__react@18.0.0__react@18.0.0/node_modules/@dnd-kit/modifiers/dist/modifiers.esm.js
var modifiers_esm = __webpack_require__(7432);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@dnd-kit+sortable@10.0.0_@dnd-kit+core@6.3.1_react-dom@18.0.0_react@18.0.0__react@18.0.0__react@18.0.0/node_modules/@dnd-kit/sortable/dist/sortable.esm.js
var sortable_esm = __webpack_require__(3754);
// EXTERNAL MODULE: ../../node_modules/.pnpm/clsx@1.1.1/node_modules/clsx/dist/clsx.m.js
var clsx_m = __webpack_require__(5789);
// EXTERNAL MODULE: ./src/db.ts
var db = __webpack_require__(2543);
// EXTERNAL MODULE: ./src/hooks/index.ts + 26 modules
var hooks = __webpack_require__(6901);
// EXTERNAL MODULE: ./src/state.ts
var state = __webpack_require__(1477);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react-icons@4.3.1_react@18.0.0/node_modules/react-icons/md/index.esm.js + 4 modules
var index_esm = __webpack_require__(5615);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@literal-ui+core@0.0.13_react-dom@18.0.0_react@18.0.0__react-icons@4.3.1_react@18.0.0__react@18.0.0/node_modules/@literal-ui/core/dist/index.mjs
var dist = __webpack_require__(2592);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react-focus-lock@2.9.1_@types+react@18.0.0_react@18.0.0/node_modules/react-focus-lock/dist/es2015/index.js + 34 modules
var es2015 = __webpack_require__(6337);
;// CONCATENATED MODULE: ./src/components/BookMenu.tsx







var BookMenu = function(param) {
    var isFavorite = param.isFavorite, onToggleFavorite = param.onToggleFavorite, onDownload = param.onDownload, onRemove = param.onRemove, onViewDetails = param.onViewDetails, className = param.className, _activeClassName = param.activeClassName, activeClassName = _activeClassName === void 0 ? "bg-black/80" : _activeClassName;
    var ref = (0,react.useState)(false), isOpen = ref[0], setIsOpen = ref[1];
    var mobile = (0,hooks/* useMobile */.XA)();
    var buttonRef = (0,react.useRef)(null);
    var t = (0,hooks/* useTranslation */.$G)();
    var toggle = function(e) {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };
    var close = function() {
        return setIsOpen(false);
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: (0,clsx_m/* default */.Z)("relative", className),
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                ref: buttonRef,
                onClick: toggle,
                className: (0,clsx_m/* default */.Z)("flex h-full w-full items-center justify-center rounded-md transition-colors focus:outline-none", isOpen && activeClassName),
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdMoreHoriz */.xr$, {
                    className: "text-2xl drop-shadow-md"
                })
            }),
            isOpen && /*#__PURE__*/ (0,jsx_runtime.jsxs)(es2015/* default */.ZP, {
                disabled: mobile,
                returnFocus: true,
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(dist/* Overlay */.aV, {
                        className: "!z-40 !bg-transparent",
                        onMouseDown: function(e) {
                            e.stopPropagation();
                            close();
                        }
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "bg-surface-light dark:bg-surface-dark shadow-2 absolute right-0 top-full z-50 mt-1 min-w-[200px] overflow-hidden rounded-xl py-1 ring-1 ring-black/5 focus:outline-none",
                        onClick: function(e) {
                            return e.stopPropagation();
                        },
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(MenuItem, {
                                icon: isFavorite ? index_esm/* MdStar */.MVI : index_esm/* MdStarBorder */.pIY,
                                label: isFavorite ? t("menu.remove_favorite") : t("menu.add_to_favorites"),
                                onClick: function() {
                                    onToggleFavorite();
                                    close();
                                },
                                className: isFavorite ? "text-yellow-500" : "",
                                iconClassName: isFavorite ? "text-yellow-500 opacity-100" : ""
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(MenuItem, {
                                icon: index_esm/* MdVisibility */.t2l,
                                label: t("menu.view_details"),
                                onClick: function() {
                                    onViewDetails();
                                    close();
                                }
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(MenuItem, {
                                icon: index_esm/* MdDownload */.uKn,
                                label: t("menu.download"),
                                onClick: function() {
                                    onDownload();
                                    close();
                                }
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "border-border-light dark:border-border-dark my-1 border-t"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(MenuItem, {
                                icon: index_esm/* MdDelete */.ZkW,
                                label: t("menu.remove_from_library"),
                                onClick: function() {
                                    onRemove();
                                    close();
                                },
                                className: "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20",
                                iconClassName: "text-red-600 dark:text-red-400 opacity-100"
                            })
                        ]
                    })
                ]
            })
        ]
    });
};
var MenuItem = function(param) {
    var Icon = param.icon, label = param.label, onClick = param.onClick, className = param.className, iconClassName = param.iconClassName;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
        onClick: onClick,
        className: (0,clsx_m/* default */.Z)("text-text-light dark:text-text-dark flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5", className),
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon, {
                className: (0,clsx_m/* default */.Z)("text-lg opacity-70", iconClassName)
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                className: "font-medium",
                children: label
            })
        ]
    });
};

// EXTERNAL MODULE: ./src/components/icons/ProviderIcons.tsx
var ProviderIcons = __webpack_require__(4651);
;// CONCATENATED MODULE: ./src/components/BookCard.tsx






var placeholder = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect fill="gray" fill-opacity="0.1" width="1" height="1"/></svg>';
var BookCard = function(param) {
    var book = param.book, cover = param.cover, viewMode = param.viewMode, onClick = param.onClick, onToggleFavorite = param.onToggleFavorite, onDownload = param.onDownload, onRemove = param.onRemove, onViewDetails = param.onViewDetails, isIndexed = param.isIndexed;
    var ref, ref1;
    var t = (0,hooks/* useTranslation */.$G)();
    var title = ((ref = book.metadata) === null || ref === void 0 ? void 0 : ref.title) || book.name;
    var author = ((ref1 = book.metadata) === null || ref1 === void 0 ? void 0 : ref1.creator) || t("books.unknown_author");
    var percentage = book.percentage !== undefined ? Math.round(book.percentage * 100) : 0;
    if (viewMode === "list") {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            onClick: onClick,
            className: "bg-surface-light dark:bg-surface-dark hover:border-border-light dark:hover:border-border-dark group grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg border border-transparent p-4 transition-colors duration-200 sm:grid-cols-[auto_1fr_120px_auto] [&:not(:has(.book-menu-container:hover))]:hover:bg-black/5 dark:[&:not(:has(.book-menu-container:hover))]:hover:bg-white/5",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "relative aspect-[2/3] h-[72px] w-12 rounded bg-cover bg-center bg-no-repeat shadow-md",
                    style: {
                        backgroundImage: 'url("'.concat(cover || placeholder, '")')
                    },
                    children: [
                        book.favorite && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "size-5 absolute -top-1 -left-1 flex items-center justify-center rounded-md bg-black/60 p-0.5 text-yellow-400 backdrop-blur-sm",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdStar */.MVI, {
                                className: "text-xs"
                            })
                        }),
                        isIndexed && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "size-5 animate-in fade-in zoom-in absolute bottom-1 right-1 flex items-center justify-center rounded-md border border-white/40 bg-white/20 text-white shadow-lg backdrop-blur-md duration-300",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: "from-primary/40 absolute inset-0 rounded-md bg-gradient-to-br to-blue-600/40 opacity-50"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(ProviderIcons/* IndexedIcon */.Lh, {
                                    className: "relative z-10 text-[12px] drop-shadow-sm"
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "flex flex-col gap-1",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                            className: "text-text-light dark:text-text-dark truncate text-base font-medium leading-normal",
                            children: title
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                            className: "text-subtle-light dark:text-subtle-dark text-sm font-normal leading-normal",
                            children: author
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "hidden flex-col gap-2 sm:flex",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "text-subtle-light dark:text-subtle-dark text-xs font-medium",
                                    children: t("books.progress")
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                    className: "text-subtle-light dark:text-subtle-dark text-xs font-medium",
                                    children: [
                                        percentage,
                                        "%"
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "bg-primary/20 h-1 w-full overflow-hidden rounded-full",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "bg-primary h-full rounded-full",
                                style: {
                                    width: "".concat(percentage, "%")
                                }
                            })
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(BookMenu, {
                    isFavorite: book.favorite,
                    onToggleFavorite: onToggleFavorite,
                    onDownload: onDownload,
                    onRemove: onRemove,
                    onViewDetails: onViewDetails,
                    className: "book-menu-container h-8 w-8 rounded-md text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700",
                    activeClassName: "bg-gray-300 dark:bg-gray-600"
                })
            ]
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        onClick: onClick,
        className: "group relative flex cursor-pointer flex-col gap-3",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "relative w-full overflow-hidden",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "aspect-[2/3] w-full rounded-lg bg-cover bg-center bg-no-repeat shadow-md transition-transform group-hover:scale-105",
                        style: {
                            backgroundImage: 'url("'.concat(cover || placeholder, '")')
                        }
                    }),
                    book.favorite && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "size-8 absolute top-2 left-2 z-10 flex items-center justify-center rounded-md bg-black/60 text-yellow-400 backdrop-blur-md transition-colors hover:bg-black/80",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdStar */.MVI, {
                            className: "text-2xl"
                        })
                    }),
                    isIndexed && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "size-8 animate-in fade-in zoom-in absolute bottom-4 right-2 z-10 flex items-center justify-center rounded-xl border border-white/40 bg-white/10 text-white shadow-xl backdrop-blur-xl duration-300",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "from-primary/60 absolute inset-0 rounded-xl bg-gradient-to-br to-blue-600/60 opacity-40"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "absolute inset-0 rounded-xl bg-gradient-to-tl from-white/20 to-transparent"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ProviderIcons/* IndexedIcon */.Lh, {
                                className: "animate-pulse-slow relative z-10 text-xl drop-shadow-md"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "absolute bottom-0 left-0 right-0 mx-2 mb-2 h-1 overflow-hidden rounded-full bg-white/80 shadow-sm",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "bg-primary h-full rounded-full",
                            style: {
                                width: "".concat(percentage, "%")
                            }
                        })
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "absolute top-2 right-2 z-20 opacity-0 transition-opacity group-hover:opacity-100",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(BookMenu, {
                    isFavorite: book.favorite,
                    onToggleFavorite: onToggleFavorite,
                    onDownload: onDownload,
                    onRemove: onRemove,
                    onViewDetails: onViewDetails,
                    className: "size-8 flex items-center justify-center rounded-md bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/80"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "text-text-light dark:text-text-dark truncate text-base font-medium leading-normal",
                        children: title
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "text-subtle-light dark:text-subtle-dark text-sm font-normal leading-normal",
                        children: author
                    })
                ]
            })
        ]
    });
};

// EXTERNAL MODULE: ../../node_modules/.pnpm/dompurify@3.3.1/node_modules/dompurify/dist/purify.es.mjs
var purify_es = __webpack_require__(4511);
;// CONCATENATED MODULE: ./src/components/BookDetailsModal.tsx







// Security: Install DOMPurify hook once for safe link handling
var domPurifyHooksInstalled = false;
function installDomPurifyHooksOnce() {
    if (domPurifyHooksInstalled) return;
    domPurifyHooksInstalled = true;
    purify_es/* default.addHook */.Z.addHook("afterSanitizeAttributes", function(node) {
        if (node.tagName === "A") {
            var href = node.getAttribute("href") || "";
            var target = node.getAttribute("target") || "";
            // Block dangerous schemes (javascript:, data:, etc.)
            var isSafe = href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http://") || href.startsWith("https://");
            if (href && !isSafe) {
                node.removeAttribute("href");
            }
            // Ensure noopener noreferrer for _blank links
            if (target === "_blank") {
                var rel = (node.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
                if (!rel.includes("noopener")) rel.push("noopener");
                if (!rel.includes("noreferrer")) rel.push("noreferrer");
                node.setAttribute("rel", rel.join(" "));
            }
        }
    });
}
var BookDetailsModal = function(param) {
    var book = param.book, cover = param.cover, onClose = param.onClose, onRead = param.onRead;
    var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
    var modalRef = (0,react.useRef)(null);
    var t = (0,hooks/* useTranslation */.$G)();
    var ref8 = (0,_sliced_to_array/* default */.Z)((0,state/* useSettings */.rV)(), 1), appSettings = ref8[0];
    var appLocale = appSettings.locale || "en";
    // Install DOMPurify hooks on first render
    installDomPurifyHooksOnce();
    // Close on click outside
    // Close on click outside removed - relying on backdrop click
    // This prevents issues where clicking on scrollbars or other edge cases
    // might trigger a close if the target isn't strictly inside the modal ref.
    // Close on Escape key
    (0,react.useEffect)(function() {
        var handleEsc = function(event) {
            if (event.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return function() {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [
        onClose
    ]);
    var title = ((ref = book.metadata) === null || ref === void 0 ? void 0 : ref.title) || book.name;
    var author = ((ref1 = book.metadata) === null || ref1 === void 0 ? void 0 : ref1.creator) || t("details.unknown_author");
    var description = (ref2 = book.metadata) === null || ref2 === void 0 ? void 0 : ref2.description;
    var publisher = (ref3 = book.metadata) === null || ref3 === void 0 ? void 0 : ref3.publisher;
    var date = (ref4 = book.metadata) === null || ref4 === void 0 ? void 0 : ref4.pubdate;
    var subject = (ref5 = book.metadata) === null || ref5 === void 0 ? void 0 : ref5.subject;
    var identifier = (ref6 = book.metadata) === null || ref6 === void 0 ? void 0 : ref6.identifier;
    var language = (ref7 = book.metadata) === null || ref7 === void 0 ? void 0 : ref7.language;
    var percentage = Math.round((book.percentage || 0) * 100);
    var sizeMb = (book.size / (1024 * 1024)).toFixed(2);
    // Security: Sanitize HTML description from ePub to prevent XSS
    var sanitizedDescription = (0,react.useMemo)(function() {
        if (!description) return "";
        return purify_es/* default.sanitize */.Z.sanitize(description, {
            ALLOWED_TAGS: [
                "p",
                "br",
                "b",
                "i",
                "em",
                "strong",
                "span",
                "div",
                "ul",
                "ol",
                "li",
                "a", 
            ],
            ALLOWED_ATTR: [
                "href",
                "target",
                "rel"
            ]
        });
    }, [
        description
    ]);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "absolute inset-0 bg-black/60",
                onClick: onClose
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                ref: modalRef,
                className: "bg-background-light dark:bg-background-dark relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl shadow-2xl md:flex-row",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                        onClick: onClose,
                        className: "text-text-light dark:text-text-dark absolute right-4 top-4 z-20 rounded-full bg-black/20 p-2 transition-colors hover:bg-black/30 md:hidden",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdClose */.FU5, {
                            size: 24
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "bg-surface-light/50 dark:bg-surface-dark/50 md:border-border-light dark:md:border-border-dark relative flex shrink-0 flex-col items-center p-8 md:w-[320px] md:border-r",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "aspect-[2/3] w-48 rounded-lg bg-cover bg-center shadow-2xl transition-transform hover:scale-[1.02] md:w-full",
                                style: {
                                    backgroundImage: 'url("'.concat(cover || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect fill="gray" fill-opacity="0.1" width="1" height="1"/></svg>', '")')
                                }
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "mt-8 w-full space-y-4",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "rounded-xl bg-white/50 p-4 backdrop-blur-sm dark:bg-black/20",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("h3", {
                                            className: "text-text-light dark:text-text-dark mb-3 flex items-center gap-2 text-sm font-semibold",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                    className: "material-symbols-outlined text-primary text-lg",
                                                    children: "library_books"
                                                }),
                                                t("details.file_info")
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            className: "text-subtle-light dark:text-subtle-dark space-y-2 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "flex justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                            children: t("details.size")
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                            className: "text-text-light dark:text-text-dark font-medium",
                                                            children: t("details.mb", {
                                                                size: sizeMb
                                                            })
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "flex justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                            children: t("details.format")
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                            className: "text-text-light dark:text-text-dark font-medium",
                                                            children: t("details.epub_format")
                                                        })
                                                    ]
                                                }),
                                                language && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "flex justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                            children: t("details.language")
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                            className: "text-text-light dark:text-text-dark font-medium uppercase",
                                                            children: language
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex flex-1 flex-col overflow-y-auto p-8 md:p-10",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mb-8",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                        className: "text-text-light dark:text-text-dark mb-2 text-3xl font-bold leading-tight tracking-tight md:text-4xl",
                                        children: title
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-primary text-xl font-medium",
                                        children: author
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mb-10 grid gap-8 md:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                className: "text-text-light dark:text-text-dark border-border-light dark:border-border-dark border-b pb-2 text-lg font-semibold",
                                                children: t("details.details")
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "space-y-3 text-sm",
                                                children: [
                                                    publisher && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "text-subtle-light dark:text-subtle-dark block text-xs uppercase tracking-wider",
                                                                children: t("details.publisher")
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "text-text-light dark:text-text-dark font-medium",
                                                                children: publisher
                                                            })
                                                        ]
                                                    }),
                                                    date && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "text-subtle-light dark:text-subtle-dark block text-xs uppercase tracking-wider",
                                                                children: t("details.pub_date")
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "text-text-light dark:text-text-dark font-medium",
                                                                children: new Date(date).toLocaleDateString(appLocale)
                                                            })
                                                        ]
                                                    }),
                                                    subject && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "text-subtle-light dark:text-subtle-dark block text-xs uppercase tracking-wider",
                                                                children: t("details.genre")
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "text-text-light dark:text-text-dark font-medium",
                                                                children: Array.isArray(subject) ? subject.join(", ") : subject
                                                            })
                                                        ]
                                                    }),
                                                    identifier && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "text-subtle-light dark:text-subtle-dark block text-xs uppercase tracking-wider",
                                                                children: t("details.isbn_id")
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "text-text-light dark:text-text-dark break-all font-medium",
                                                                children: identifier
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
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                className: "text-text-light dark:text-text-dark border-border-light dark:border-border-dark border-b pb-2 text-lg font-semibold",
                                                children: t("details.progress_info")
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                className: "mb-1 flex justify-between text-sm",
                                                                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                    className: "text-text-light dark:text-text-dark font-medium",
                                                                    children: [
                                                                        percentage,
                                                                        "% ",
                                                                        t("details.complete")
                                                                    ]
                                                                })
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                className: "bg-border-light dark:bg-border-dark h-2 w-full overflow-hidden rounded-full",
                                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                    className: "bg-primary h-full rounded-full transition-all duration-500 ease-out",
                                                                    style: {
                                                                        width: "".concat(percentage, "%")
                                                                    }
                                                                })
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "grid grid-cols-2 gap-4",
                                                        children: [
                                                            book.pageCount && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                        className: "text-subtle-light dark:text-subtle-dark block text-xs uppercase tracking-wider",
                                                                        children: t("details.pages")
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                        className: "text-text-light dark:text-text-dark text-lg font-medium",
                                                                        children: [
                                                                            book.pageCount,
                                                                            book.pageCountEstimated && " ~"
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                        className: "text-subtle-light dark:text-subtle-dark block text-xs uppercase tracking-wider",
                                                                        children: t("details.last_read")
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                        className: "text-text-light dark:text-text-dark font-medium",
                                                                        children: book.updatedAt ? new Date(book.updatedAt).toLocaleDateString(appLocale) : t("details.never")
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }),
                            sanitizedDescription && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mb-10 flex-1",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                        className: "text-text-light dark:text-text-dark mb-3 text-lg font-semibold",
                                        children: t("details.synopsis")
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "text-subtle-light dark:text-subtle-dark prose dark:prose-invert max-w-none text-sm leading-relaxed",
                                        dangerouslySetInnerHTML: {
                                            __html: sanitizedDescription
                                        }
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "border-border-light dark:border-border-dark mt-auto flex items-center justify-end gap-4 border-t pt-6",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                        onClick: onClose,
                                        className: "text-text-light dark:text-text-dark rounded-xl px-6 py-3 font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5",
                                        children: t("details.close")
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                        onClick: function() {
                                            return onRead(book);
                                        },
                                        className: "from-primary to-primary-dark shadow-primary/20 flex items-center gap-2 rounded-xl bg-gradient-to-r px-8 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* MdMenuBook */.Egn, {
                                                size: 20
                                            }),
                                            t("details.read_book")
                                        ]
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

// EXTERNAL MODULE: ../../node_modules/.pnpm/@material+material-color-utilities@0.2.0/node_modules/@material/material-color-utilities/dist/index.js + 17 modules
var material_color_utilities_dist = __webpack_require__(4586);
;// CONCATENATED MODULE: ./src/components/NewHeader.tsx





var NewHeader = function(param) {
    var viewMode = param.viewMode, onViewModeChange = param.onViewModeChange, onAddBook = param.onAddBook;
    var sourceColor = (0,hooks/* useSourceColor */.P9)().sourceColor;
    var t = (0,hooks/* useTranslation */.$G)();
    var hueRotation = (0,react.useMemo)(function() {
        try {
            var sourceHue = material_color_utilities_dist/* Hct.fromInt */.OP.fromInt((0,material_color_utilities_dist/* argbFromHex */.fq)(sourceColor)).hue;
            // Base icon color is approx #0ea5e9 which has a hue of ~199deg
            var baseHue = 199;
            return "".concat(sourceHue - baseHue, "deg");
        } catch (e) {
            return "0deg";
        }
    }, [
        sourceColor
    ]);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("header", {
        className: "border-border-light dark:border-border-dark mb-6 flex flex-col items-start justify-between gap-4 border-b border-solid pb-6 sm:flex-row sm:items-center",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "flex items-center gap-8",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "text-text-light dark:text-text-dark flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "size-8",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("img", {
                                src: "/icons/512.png",
                                alt: t("details.logo_alt"),
                                className: "h-8 w-8 object-contain transition-all duration-500",
                                style: {
                                    filter: "hue-rotate(".concat(hueRotation, ")")
                                }
                            })
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                            className: "text-2xl font-bold leading-tight tracking-tighter",
                            children: t("library.title")
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex w-full items-center justify-end gap-2 sm:w-auto",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                        onClick: onAddBook,
                        className: "bg-primary flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg px-4 text-sm font-bold leading-normal tracking-wide text-white transition-opacity hover:opacity-90",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                            className: "truncate",
                            children: t("library.add_book")
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "bg-background-light dark:bg-surface-dark border-border-light dark:border-border-dark flex items-center rounded-lg border",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                onClick: function() {
                                    return onViewModeChange("grid");
                                },
                                className: (0,clsx_m/* default */.Z)("flex h-10 min-w-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-l-lg px-3 text-sm font-bold leading-normal transition-colors", viewMode === "grid" ? "bg-primary/20 dark:bg-primary/30 text-primary" : "text-subtle-light dark:text-subtle-dark bg-transparent hover:bg-black/5 dark:hover:bg-white/5"),
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                    className: "material-symbols-outlined text-xl",
                                    children: "grid_view"
                                })
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                onClick: function() {
                                    return onViewModeChange("list");
                                },
                                className: (0,clsx_m/* default */.Z)("flex h-10 min-w-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-r-lg px-3 text-sm font-bold leading-normal transition-colors", viewMode === "list" ? "bg-primary/20 dark:bg-primary/30 text-primary" : "text-subtle-light dark:text-subtle-dark bg-transparent hover:bg-black/5 dark:hover:bg-white/5"),
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                    className: "material-symbols-outlined text-xl",
                                    children: "list"
                                })
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
// EXTERNAL MODULE: ../../node_modules/.pnpm/@dnd-kit+utilities@3.2.2_react@18.0.0/node_modules/@dnd-kit/utilities/dist/utilities.esm.js
var utilities_esm = __webpack_require__(819);
;// CONCATENATED MODULE: ./src/components/SortableBookCard.tsx








var SortableBookCard = function(_param) {
    var id = _param.id, disabled = _param.disabled, isIndexed = _param.isIndexed, props = (0,_object_without_properties/* default */.Z)(_param, [
        "id",
        "disabled",
        "isIndexed"
    ]);
    var ref = (0,sortable_esm/* useSortable */.nB)({
        id: id,
        disabled: disabled
    }), attributes = ref.attributes, listeners = ref.listeners, setNodeRef = ref.setNodeRef, transform = ref.transform, transition = ref.transition, isDragging = ref.isDragging;
    var style = {
        transform: utilities_esm/* CSS.Transform.toString */.ux.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : "auto",
        position: "relative",
        outline: "none"
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", (0,_object_spread_props/* default */.Z)((0,_object_spread/* default */.Z)({
        ref: setNodeRef,
        style: style
    }, attributes, listeners), {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(BookCard, (0,_object_spread_props/* default */.Z)((0,_object_spread/* default */.Z)({}, props), {
                isIndexed: isIndexed
            })),
            !disabled && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "ring-primary/20 absolute inset-0 z-0 hidden rounded-xl ring-2 hover:block"
            })
        ]
    }));
};

// EXTERNAL MODULE: ./src/components/base/index.ts + 7 modules
var base = __webpack_require__(7675);
;// CONCATENATED MODULE: ./src/components/LibraryView.tsx




















var LibraryView = function(param) {
    var books = param.books, covers = param.covers, onAddBook = param.onAddBook, onBookClick = param.onBookClick, onDrop = param.onDrop, onToggleFavorite = param.onToggleFavorite, onDownload = param.onDownload, onRemove = param.onRemove, _onViewDetails = param.onViewDetails;
    var ref, ref1;
    var ref2 = (0,_sliced_to_array/* default */.Z)((0,state/* useLibraryState */.Zc)(), 2), ref3 = ref2[0], viewMode = ref3.viewMode, filter = ref3.filter, setLibraryState = ref2[1];
    var ref4 = (0,react.useState)(""), searchQuery = ref4[0], setSearchQuery = ref4[1];
    var ref5 = (0,react.useState)("recent"), sortMode = ref5[0], setSortMode = ref5[1];
    var ref6 = (0,react.useState)(null), activeId = ref6[0], setActiveId = ref6[1];
    var ref7 = (0,react.useState)(books), localBooks = ref7[0], setLocalBooks = ref7[1];
    var ref8 = (0,react.useState)(null), selectedBook = ref8[0], setSelectedBook = ref8[1];
    var t = (0,hooks/* useTranslation */.$G)();
    var indexedBookIds = (0,dexie_react_hooks.useLiveQuery)(/*#__PURE__*/ (0,_async_to_generator/* default */.Z)(function() {
        var indices, e, ref, errName, allIndices;
        return (0,tslib_es6.__generator)(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        2,
                        ,
                        5
                    ]);
                    return [
                        4,
                        db.db === null || db.db === void 0 ? void 0 : db.db.indices.where("kind").equals("chunks").toArray()
                    ];
                case 1:
                    indices = _state.sent();
                    return [
                        2,
                        new Set((indices === null || indices === void 0 ? void 0 : indices.map(function(i) {
                            return i.bookId;
                        })) || [])
                    ];
                case 2:
                    e = _state.sent();
                    errName = (e === null || e === void 0 ? void 0 : e.name) || (e === null || e === void 0 ? void 0 : (ref = e._e) === null || ref === void 0 ? void 0 : ref.name);
                    if (!(errName === "SchemaError" || errName === "DataError")) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        db.db === null || db.db === void 0 ? void 0 : db.db.indices.toArray()
                    ];
                case 3:
                    allIndices = _state.sent();
                    return [
                        2,
                        new Set((allIndices === null || allIndices === void 0 ? void 0 : allIndices.map(function(i) {
                            return i.bookId || i.id;
                        })) || [])
                    ];
                case 4:
                    return [
                        2,
                        new Set()
                    ];
                case 5:
                    return [
                        2
                    ];
            }
        });
    }), []);
    (0,react.useEffect)(function() {
        setLocalBooks(books);
    }, [
        books
    ]);
    var sensors = (0,core_esm/* useSensors */.Dy)((0,core_esm/* useSensor */.VT)(core_esm/* PointerSensor */.we, {
        activationConstraint: {
            distance: 8
        }
    }), (0,core_esm/* useSensor */.VT)(core_esm/* KeyboardSensor */.Lg, {
        coordinateGetter: sortable_esm/* sortableKeyboardCoordinates */.is
    }), (0,core_esm/* useSensor */.VT)(core_esm/* TouchSensor */.LO, {
        activationConstraint: {
            delay: 200,
            tolerance: 5
        }
    }), (0,core_esm/* useSensor */.VT)(core_esm/* MouseSensor */.MA, {
        activationConstraint: {
            distance: 10
        }
    }));
    var ref9 = (0,react.useState)(false), isSortMenuOpen = ref9[0], setIsSortMenuOpen = ref9[1];
    var setViewMode = function(mode) {
        return setLibraryState(function(prev) {
            return (0,_object_spread_props/* default */.Z)((0,_object_spread/* default */.Z)({}, prev), {
                viewMode: mode
            });
        });
    };
    var setFilter = function(f) {
        return setLibraryState(function(prev) {
            return (0,_object_spread_props/* default */.Z)((0,_object_spread/* default */.Z)({}, prev), {
                filter: f
            });
        });
    };
    var filteredBooks = (0,react.useMemo)(function() {
        var filtered = localBooks.filter(function(book) {
            var ref, ref1;
            var matchesSearch = (((ref = book.metadata) === null || ref === void 0 ? void 0 : ref.title) || book.name).toLowerCase().includes(searchQuery.toLowerCase()) || (((ref1 = book.metadata) === null || ref1 === void 0 ? void 0 : ref1.creator) || "").toLowerCase().includes(searchQuery.toLowerCase());
            if (!matchesSearch) return false;
            var percentage = book.percentage || 0;
            if (filter === "Favorites") return book.favorite;
            if (filter === "Unread") return percentage === 0;
            if (filter === "In Progress") return percentage > 0 && percentage < 0.99;
            if (filter === "Finished") return percentage >= 0.99;
            return true;
        });
        if (sortMode === "custom") {
            return filtered.sort(function(a, b) {
                return (a.position || 0) - (b.position || 0);
            });
        }
        return filtered.sort(function(a, b) {
            switch(sortMode){
                case "title":
                    var ref, ref1;
                    return (((ref = a.metadata) === null || ref === void 0 ? void 0 : ref.title) || a.name).localeCompare(((ref1 = b.metadata) === null || ref1 === void 0 ? void 0 : ref1.title) || b.name);
                case "author":
                    var ref2, ref3;
                    return (((ref2 = a.metadata) === null || ref2 === void 0 ? void 0 : ref2.creator) || "").localeCompare(((ref3 = b.metadata) === null || ref3 === void 0 ? void 0 : ref3.creator) || "");
                case "recent":
                default:
                    // Sort by last read (updatedAt) or added time
                    return (b.updatedAt || 0) - (a.updatedAt || 0);
            }
        });
    }, [
        localBooks,
        searchQuery,
        filter,
        sortMode
    ]);
    var handleDragStart = function(event) {
        setActiveId(event.active.id);
    };
    var handleDragEnd = function(event) {
        var active = event.active, over = event.over;
        if (over && active.id !== over.id) {
            // Find indices in filtered books
            var oldIndex = filteredBooks.findIndex(function(item) {
                return item.id === active.id;
            });
            var newIndex = filteredBooks.findIndex(function(item) {
                return item.id === over.id;
            });
            if (oldIndex === -1 || newIndex === -1) {
                setActiveId(null);
                return;
            }
            // Reorder filtered books
            var reorderedFiltered = (0,sortable_esm/* arrayMove */.Rp)(filteredBooks, oldIndex, newIndex);
            // Update positions in DB and local state
            reorderedFiltered.forEach(function(book, index) {
                db.db === null || db.db === void 0 ? void 0 : db.db.books.update(book.id, {
                    position: index
                });
            });
            // Update local books to reflect new positions
            setLocalBooks(function(prevBooks) {
                return prevBooks.map(function(book) {
                    var newPosition = reorderedFiltered.findIndex(function(b) {
                        return b.id === book.id;
                    });
                    if (newPosition !== -1) {
                        return (0,_object_spread_props/* default */.Z)((0,_object_spread/* default */.Z)({}, book), {
                            position: newPosition
                        });
                    }
                    return book;
                });
            });
        }
        setActiveId(null);
    };
    var filterLabels = {
        All: t("library.filter.all"),
        Favorites: t("library.filter.favorites"),
        Unread: t("library.filter.unread"),
        "In Progress": t("library.filter.in_progress"),
        Finished: t("library.filter.finished")
    };
    var sortLabels = {
        recent: t("library.sort.recent"),
        title: t("library.sort.title"),
        author: t("library.sort.author"),
        custom: t("library.sort.custom")
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(base/* DropZone */.rE, {
        className: "bg-background-light dark:bg-background-dark flex h-full w-full flex-col",
        onDrop: onDrop,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex flex-1 flex-col overflow-y-auto p-4 sm:p-6 md:p-8",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(NewHeader, {
                        viewMode: viewMode,
                        onViewModeChange: setViewMode,
                        onAddBook: onAddBook
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                className: "relative block w-full md:max-w-md",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                        className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500",
                                        children: "search"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                        className: "focus:ring-primary focus:border-primary w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-1 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500",
                                        placeholder: t("library.search_placeholder"),
                                        value: searchQuery,
                                        onChange: function(e) {
                                            return setSearchQuery(e.target.value);
                                        }
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex flex-wrap gap-2",
                                children: [
                                    [
                                        "All",
                                        "Favorites",
                                        "Unread",
                                        "In Progress",
                                        "Finished"
                                    ].map(function(f) {
                                        return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            onClick: function() {
                                                return setFilter(f);
                                            },
                                            className: (0,clsx_m/* default */.Z)("flex h-9 shrink-0 items-center justify-center gap-x-2 whitespace-nowrap rounded-full px-4 transition-colors", filter === f ? "bg-primary/20 dark:bg-primary/30 text-primary" : "bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark border hover:bg-black/5 dark:hover:bg-white/5"),
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                className: "text-sm font-medium leading-normal",
                                                children: filterLabels[f]
                                            })
                                        }, f);
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                                onClick: function() {
                                                    return setIsSortMenuOpen(!isSortMenuOpen);
                                                },
                                                className: "bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full border pl-4 pr-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                        className: "text-sm font-medium leading-normal",
                                                        children: [
                                                            t("library.sort_by"),
                                                            " ",
                                                            sortLabels[sortMode]
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "material-symbols-outlined text-lg",
                                                        children: "expand_more"
                                                    })
                                                ]
                                            }),
                                            isSortMenuOpen && /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "fixed inset-0 z-10",
                                                        onClick: function() {
                                                            return setIsSortMenuOpen(false);
                                                        }
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark absolute right-0 top-full z-20 mt-2 w-40 overflow-hidden rounded-xl border shadow-xl",
                                                        children: [
                                                            {
                                                                label: sortLabels["recent"],
                                                                value: "recent"
                                                            },
                                                            {
                                                                label: sortLabels["title"],
                                                                value: "title"
                                                            },
                                                            {
                                                                label: sortLabels["author"],
                                                                value: "author"
                                                            },
                                                            {
                                                                label: sortLabels["custom"],
                                                                value: "custom"
                                                            }, 
                                                        ].map(function(option) {
                                                            return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                                                onClick: function() {
                                                                    setSortMode(option.value);
                                                                    setIsSortMenuOpen(false);
                                                                },
                                                                className: (0,clsx_m/* default */.Z)("w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5", sortMode === option.value ? "text-primary font-medium" : "text-gray-700 dark:text-gray-200"),
                                                                children: option.label
                                                            }, option.value);
                                                        })
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(core_esm/* DndContext */.LB, {
                        sensors: sensors,
                        collisionDetection: core_esm/* closestCenter */.pE,
                        onDragStart: handleDragStart,
                        onDragEnd: handleDragEnd,
                        modifiers: [
                            modifiers_esm/* snapCenterToCursor */.oJ
                        ],
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(sortable_esm/* SortableContext */.Fo, {
                                items: filteredBooks.map(function(b) {
                                    return b.id;
                                }),
                                strategy: sortable_esm/* rectSortingStrategy */.U2,
                                disabled: sortMode !== "custom",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: (0,clsx_m/* default */.Z)(viewMode === "grid" ? "grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-x-4 gap-y-8 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]" : "flex flex-col gap-4"),
                                    children: filteredBooks.map(function(book) {
                                        var ref, ref1;
                                        return sortMode === "custom" ? /*#__PURE__*/ (0,jsx_runtime.jsx)(SortableBookCard, {
                                            id: book.id,
                                            book: book,
                                            cover: (ref = covers.find(function(c) {
                                                return c.id === book.id;
                                            })) === null || ref === void 0 ? void 0 : ref.cover,
                                            viewMode: viewMode,
                                            onClick: function() {
                                                return onBookClick(book);
                                            },
                                            onToggleFavorite: function() {
                                                return onToggleFavorite(book);
                                            },
                                            onDownload: function() {
                                                return onDownload(book);
                                            },
                                            onRemove: function() {
                                                return onRemove(book);
                                            },
                                            onViewDetails: function() {
                                                return setSelectedBook(book);
                                            },
                                            isIndexed: indexedBookIds === null || indexedBookIds === void 0 ? void 0 : indexedBookIds.has(book.id)
                                        }, book.id) : /*#__PURE__*/ (0,jsx_runtime.jsx)(BookCard, {
                                            book: book,
                                            cover: (ref1 = covers.find(function(c) {
                                                return c.id === book.id;
                                            })) === null || ref1 === void 0 ? void 0 : ref1.cover,
                                            viewMode: viewMode,
                                            onClick: function() {
                                                return onBookClick(book);
                                            },
                                            onToggleFavorite: function() {
                                                return onToggleFavorite(book);
                                            },
                                            onDownload: function() {
                                                return onDownload(book);
                                            },
                                            onRemove: function() {
                                                return onRemove(book);
                                            },
                                            onViewDetails: function() {
                                                return setSelectedBook(book);
                                            },
                                            isIndexed: indexedBookIds === null || indexedBookIds === void 0 ? void 0 : indexedBookIds.has(book.id)
                                        }, book.id);
                                    })
                                })
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(core_esm/* DragOverlay */.y9, {
                                children: activeId ? /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    style: {
                                        transform: "scale(1.05)"
                                    },
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(BookCard, {
                                        book: filteredBooks.find(function(b) {
                                            return b.id === activeId;
                                        }),
                                        cover: (ref = covers.find(function(c) {
                                            return c.id === activeId;
                                        })) === null || ref === void 0 ? void 0 : ref.cover,
                                        viewMode: viewMode,
                                        onClick: function() {},
                                        onToggleFavorite: function() {},
                                        onDownload: function() {},
                                        onRemove: function() {},
                                        onViewDetails: function() {}
                                    })
                                }) : null
                            })
                        ]
                    })
                ]
            }),
            selectedBook && /*#__PURE__*/ (0,jsx_runtime.jsx)(BookDetailsModal, {
                book: selectedBook,
                cover: (ref1 = covers.find(function(c) {
                    return c.id === selectedBook.id;
                })) === null || ref1 === void 0 ? void 0 : ref1.cover,
                onClose: function() {
                    return setSelectedBook(null);
                },
                onRead: function(book) {
                    onBookClick(book);
                    setSelectedBook(null);
                }
            })
        ]
    });
};

// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_instanceof.mjs
var _instanceof = __webpack_require__(8149);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@literal-ui+hooks@0.0.8_react-dom@18.0.0_react@18.0.0__react@18.0.0/node_modules/@literal-ui/hooks/dist/index.mjs
var hooks_dist = __webpack_require__(2601);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react-photo-view@1.1.2_react-dom@18.0.0_react@18.0.0__react@18.0.0/node_modules/react-photo-view/dist/react-photo-view.module.js
var react_photo_view_module = __webpack_require__(1174);
// EXTERNAL MODULE: ../../node_modules/.pnpm/recoil@0.7.6_react-dom@18.0.0_react@18.0.0__react@18.0.0/node_modules/recoil/es/index.js
var es = __webpack_require__(3297);
// EXTERNAL MODULE: ../../node_modules/.pnpm/tilg@0.1.1_react@18.0.0/node_modules/tilg/index.js
var tilg = __webpack_require__(622);
var tilg_default = /*#__PURE__*/__webpack_require__.n(tilg);
// EXTERNAL MODULE: ../../node_modules/.pnpm/valtio@1.6.0_@babel+helper-module-imports@7.28.6_@babel+types@7.28.6_react@18.0.0/node_modules/valtio/esm/index.js
var esm = __webpack_require__(9319);
// EXTERNAL MODULE: ../../packages/epubjs/types/rendition.ts
var types_rendition = __webpack_require__(876);
// EXTERNAL MODULE: ./src/file.ts + 40 modules
var src_file = __webpack_require__(954);
// EXTERNAL MODULE: ./src/models/index.ts + 2 modules
var models = __webpack_require__(1964);
// EXTERNAL MODULE: ./src/platform.ts
var platform = __webpack_require__(9050);
// EXTERNAL MODULE: ./src/styles.ts
var styles = __webpack_require__(6843);
;// CONCATENATED MODULE: ./src/annotation.ts
var typeMap = {
    highlight: {
        style: "backgroundColor",
        class: "rounded"
    }
};
// "dark color + low opacity" is clearer than "light color + high opacity"
// from tailwind [color]-600
var colorMap = {
    yellow: "rgba(217, 119, 6, 0.2)",
    red: "rgba(220, 38, 38, 0.2)",
    green: "rgba(22, 163, 74, 0.2)",
    blue: "rgba(37, 99, 235, 0.2)"
};

;// CONCATENATED MODULE: ./src/components/Annotation.tsx






// avoid click penetration
var clickedAnnotation = false;
var getClickedAnnotation = function() {
    return clickedAnnotation;
};
var setClickedAnnotation = function(v) {
    return clickedAnnotation = v;
};
var FindMatches = function(param) {
    var tab = param.tab;
    var setAction = (0,hooks/* useSetAction */.ED)();
    var ref = (0,esm/* useSnapshot */.RK)(tab), rendition = ref.rendition, results = ref.results, currentHref = ref.currentHref;
    (0,react.useEffect)(function() {
        var result = results === null || results === void 0 ? void 0 : results.find(function(r) {
            return (0,models/* compareHref */.sR)(currentHref, r.id);
        });
        var matches = result === null || result === void 0 ? void 0 : result.subitems;
        matches === null || matches === void 0 ? void 0 : matches.forEach(function(m) {
            try {
                var h = rendition === null || rendition === void 0 ? void 0 : rendition.annotations.highlight(m.cfi, undefined, undefined, undefined, {
                    // tailwind yellow-500
                    fill: "rgba(234, 179, 8, 0.3)",
                    "fill-opacity": "unset"
                });
                var g = h === null || h === void 0 ? void 0 : h.mark.element;
                g === null || g === void 0 ? void 0 : g.addEventListener("click", function() {
                    setClickedAnnotation(true);
                });
            } catch (error) {
            // ignore matched text in `<title>`
            }
        });
        return function() {
            matches === null || matches === void 0 ? void 0 : matches.forEach(function(m) {
                rendition === null || rendition === void 0 ? void 0 : rendition.annotations.remove(m.cfi, "highlight");
            });
        };
    }, [
        currentHref,
        rendition === null || rendition === void 0 ? void 0 : rendition.annotations,
        results,
        setAction
    ]);
    return null;
};
var Definition = function(param) {
    var tab = param.tab, definition = param.definition;
    var setAction = (0,hooks/* useSetAction */.ED)();
    var ref = (0,esm/* useSnapshot */.RK)(tab), rendition = ref.rendition, currentHref = ref.currentHref;
    (0,react.useEffect)(function() {
        var result = tab.searchInSection(definition);
        var matches = result === null || result === void 0 ? void 0 : result.subitems;
        matches === null || matches === void 0 ? void 0 : matches.forEach(function(m) {
            try {
                var h = rendition === null || rendition === void 0 ? void 0 : rendition.annotations.highlight(m.cfi, undefined, undefined, undefined, {
                    // tailwind gray-600
                    fill: "rgba(75, 85, 99, 0.15)",
                    "fill-opacity": "unset"
                });
                var g = h === null || h === void 0 ? void 0 : h.mark.element;
                // `<rect>` should be reserved to response `click`
                g === null || g === void 0 ? void 0 : g.addEventListener("click", function() {
                    tab.setAnnotationRange(m.cfi);
                    setClickedAnnotation(true);
                });
            } catch (error) {
            // ignore matched text in `<title>`
            }
        });
        return function() {
            matches === null || matches === void 0 ? void 0 : matches.forEach(function(m) {
                return rendition === null || rendition === void 0 ? void 0 : rendition.annotations.remove(m.cfi, "highlight");
            });
        };
    }, [
        currentHref,
        definition,
        rendition === null || rendition === void 0 ? void 0 : rendition.annotations,
        setAction,
        tab
    ]);
    return null;
};
var Annotation = function(param) {
    var tab = param.tab, annotation = param.annotation;
    var rendition = (0,esm/* useSnapshot */.RK)(tab).rendition;
    (0,react.useEffect)(function() {
        var ref;
        var h = rendition === null || rendition === void 0 ? void 0 : rendition.annotations[annotation.type](annotation.cfi, undefined, undefined, undefined, {
            fill: colorMap[annotation.color],
            "fill-opacity": "0.5"
        });
        var g = h === null || h === void 0 ? void 0 : (ref = h.mark) === null || ref === void 0 ? void 0 : ref.element;
        // `<rect>` should be reserved to response `click`
        g === null || g === void 0 ? void 0 : g.addEventListener("click", function() {
            tab.setAnnotationRange(annotation.cfi);
            setClickedAnnotation(true);
        });
        return function() {
            rendition === null || rendition === void 0 ? void 0 : rendition.annotations.remove(annotation.cfi, annotation.type);
        };
    }, [
        annotation.cfi,
        annotation.color,
        annotation.type,
        rendition === null || rendition === void 0 ? void 0 : rendition.annotations,
        tab, 
    ]);
    return null;
};
var Annotations = function(param) {
    var tab = param.tab;
    var ref = (0,esm/* useSnapshot */.RK)(tab), book = ref.book, section = ref.section;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(FindMatches, {
                tab: tab
            }),
            book.annotations// seems to fix annotation flash when executing `next()` and `display()`
            .filter(function(a) {
                return a.spine.index === (section === null || section === void 0 ? void 0 : section.index);
            }).map(function(annotation) {
                return /*#__PURE__*/ (0,jsx_runtime.jsx)(Annotation, {
                    tab: tab,
                    annotation: annotation
                }, annotation.id);
            }),
            book.definitions.map(function(definition) {
                return /*#__PURE__*/ (0,jsx_runtime.jsx)(Definition, {
                    tab: tab,
                    definition: definition
                }, definition);
            })
        ]
    });
};

;// CONCATENATED MODULE: ./src/components/NewReaderLayout.tsx


var NewReaderLayout = function(param) {
    var header = param.header, footer = param.footer, children = param.children;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        className: "bg-background-light dark:bg-background-dark flex h-screen flex-1 flex-col",
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            className: "flex h-full flex-1 overflow-hidden",
            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex min-w-0 flex-1 flex-col",
                children: [
                    header,
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "relative flex-1 overflow-hidden",
                        children: children
                    }),
                    footer
                ]
            })
        })
    });
};

// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_class_call_check.mjs
var _class_call_check = __webpack_require__(4656);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_construct.mjs
var _construct = __webpack_require__(3203);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_to_consumable_array.mjs + 2 modules
var _to_consumable_array = __webpack_require__(8417);
;// CONCATENATED MODULE: ./src/lib/highlights.ts




var HighlightManager = /*#__PURE__*/ function() {
    "use strict";
    function HighlightManager() {
        (0,_class_call_check/* default */.Z)(this, HighlightManager);
    }
    var _proto = HighlightManager.prototype;
    /**
     * Highlights search matches using the CSS Custom Highlight API (Zero DOM cost)
     */ _proto.highlightSearchMatches = function highlightSearchMatches(ranges) {
        if (hooks_dist/* IS_SERVER */.W6 || typeof CSS === "undefined" || !CSS.highlights) return;
        var highlight = (0,_construct/* default */.Z)(Highlight, (0,_to_consumable_array/* default */.Z)(ranges));
        CSS.highlights.set("search-results", highlight);
    };
    /**
     * Clears all search highlights
     */ _proto.clearSearchHighlights = function clearSearchHighlights() {
        if (hooks_dist/* IS_SERVER */.W6 || typeof CSS === "undefined" || !CSS.highlights) return;
        CSS.highlights.delete("search-results");
    };
    /**
     * Create ranges from CFI or text search (Utility)
     * Note: Parsing CFIs to Ranges is complex and usually requires EPUB.js context.
     * This utility assumes we have access to the underlying text nodes or a mapped range.
     */ _proto.createRangeFromNodes = function createRangeFromNodes(startNode, startOffset, endNode, endOffset) {
        var range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        return range;
    };
    HighlightManager.getInstance = function getInstance() {
        if (!HighlightManager.instance) {
            HighlightManager.instance = new HighlightManager();
        }
        return HighlightManager.instance;
    };
    return HighlightManager;
}();
var highlightManager = HighlightManager.getInstance();

;// CONCATENATED MODULE: ./src/components/SearchHighlightLayer.tsx





/**
 * SOTA 2026: Zero-Cost Search Highlighting
 * Uses CSS Custom Highlight API to paint search results without DOM node injection.
 */ var SearchHighlightLayer = function(param) {
    var tab = param.tab;
    // Reactive subscription to search results
    var ref = (0,esm/* useSnapshot */.RK)(tab), results = ref.results, rendition = ref.rendition;
    (0,react.useEffect)(function() {
        if (!rendition || !results || results.length === 0) {
            highlightManager.clearSearchHighlights();
            return;
        }
        var applyHighlights = function() {
            var _ref = (0,_async_to_generator/* default */.Z)(function() {
                var ranges, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, chapter, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, match, ref, range, e, err, err;
                return (0,tslib_es6.__generator)(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            ranges = [];
                            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            _state.label = 1;
                        case 1:
                            _state.trys.push([
                                1,
                                14,
                                15,
                                16
                            ]);
                            _iterator = results[Symbol.iterator]();
                            _state.label = 2;
                        case 2:
                            if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                3,
                                13
                            ];
                            chapter = _step.value;
                            if (!chapter.subitems) return [
                                3,
                                12
                            ];
                            _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                            _state.label = 3;
                        case 3:
                            _state.trys.push([
                                3,
                                10,
                                11,
                                12
                            ]);
                            _iterator1 = chapter.subitems[Symbol.iterator]();
                            _state.label = 4;
                        case 4:
                            if (!!(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done)) return [
                                3,
                                9
                            ];
                            match = _step1.value;
                            if (!match.cfi) return [
                                3,
                                8
                            ];
                            _state.label = 5;
                        case 5:
                            _state.trys.push([
                                5,
                                7,
                                ,
                                8
                            ]);
                            return [
                                4,
                                (ref = tab.rendition) === null || ref === void 0 ? void 0 : ref.getRange(match.cfi)
                            ];
                        case 6:
                            range = _state.sent();
                            if (range) {
                                ranges.push(range);
                            }
                            return [
                                3,
                                8
                            ];
                        case 7:
                            e = _state.sent();
                            return [
                                3,
                                8
                            ];
                        case 8:
                            _iteratorNormalCompletion1 = true;
                            return [
                                3,
                                4
                            ];
                        case 9:
                            return [
                                3,
                                12
                            ];
                        case 10:
                            err = _state.sent();
                            _didIteratorError1 = true;
                            _iteratorError1 = err;
                            return [
                                3,
                                12
                            ];
                        case 11:
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
                        case 12:
                            _iteratorNormalCompletion = true;
                            return [
                                3,
                                2
                            ];
                        case 13:
                            return [
                                3,
                                16
                            ];
                        case 14:
                            err = _state.sent();
                            _didIteratorError = true;
                            _iteratorError = err;
                            return [
                                3,
                                16
                            ];
                        case 15:
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
                        case 16:
                            if (ranges.length > 0) {
                                highlightManager.highlightSearchMatches(ranges);
                            } else {
                                highlightManager.clearSearchHighlights();
                            }
                            return [
                                2
                            ];
                    }
                });
            });
            return function applyHighlights() {
                return _ref.apply(this, arguments);
            };
        }();
        applyHighlights();
        return function() {
            highlightManager.clearSearchHighlights();
        };
    }, [
        results,
        rendition,
        tab.rendition
    ]);
    return null;
};

// EXTERNAL MODULE: ../../node_modules/.pnpm/@swc+helpers@0.4.11/node_modules/@swc/helpers/src/_define_property.mjs
var _define_property = __webpack_require__(7705);
// EXTERNAL MODULE: ./src/utils.ts
var utils = __webpack_require__(3444);
// EXTERNAL MODULE: ./src/components/Button.tsx
var Button = __webpack_require__(4599);
// EXTERNAL MODULE: ./src/components/Form.tsx
var Form = __webpack_require__(8188);
;// CONCATENATED MODULE: ./src/components/TextSelectionMenu.tsx


















var TextSelectionMenu = function(param) {
    var tab = param.tab;
    var ref, ref1, ref2;
    var ref3 = (0,esm/* useSnapshot */.RK)(tab), rendition = ref3.rendition, annotationRange = ref3.annotationRange;
    // `manager` is not reactive, so we need to use getter
    var view = (0,react.useCallback)(function() {
        var ref;
        if (!(rendition === null || rendition === void 0 ? void 0 : (ref = rendition.manager) === null || ref === void 0 ? void 0 : ref.views)) return;
        return rendition.manager.views._views[0];
    }, [
        rendition
    ]);
    var win = (ref = view()) === null || ref === void 0 ? void 0 : ref.window;
    var ref4 = (0,_sliced_to_array/* default */.Z)((0,hooks/* useTextSelection */.td)(win), 2), selection = ref4[0], setSelection = ref4[1];
    var el = (ref1 = view()) === null || ref1 === void 0 ? void 0 : ref1.element;
    if (!el) return null;
    var ref5;
    // it is possible that both `selection` and `tab.annotationRange`
    // are set when select end within an annotation
    var range = (ref5 = selection === null || selection === void 0 ? void 0 : selection.getRangeAt(0)) !== null && ref5 !== void 0 ? ref5 : annotationRange;
    if (!range) return null;
    // prefer to display above the selection to avoid text selection helpers
    // https://stackoverflow.com/questions/68081757/hide-the-two-text-selection-helpers-in-mobile-browsers
    var forward = platform/* isTouchScreen */.z ? false : selection ? (0,hooks/* isForwardSelection */.de)(selection) : true;
    var rects = (0,_to_consumable_array/* default */.Z)(range.getClientRects()).filter(function(r) {
        return Math.round(r.width);
    });
    var anchorRect = rects && (forward ? (0,utils/* last */.Z$)(rects) : rects[0]);
    if (!anchorRect) return null;
    var contents = range.cloneContents();
    var text = (ref2 = contents.textContent) === null || ref2 === void 0 ? void 0 : ref2.trim();
    if (!text) return null;
    return(// to reset inner state
    /*#__PURE__*/ (0,jsx_runtime.jsx)(TextSelectionMenuRenderer, {
        tab: tab,
        range: range,
        anchorRect: anchorRect,
        containerRect: el.parentElement.getBoundingClientRect(),
        viewRect: el.getBoundingClientRect(),
        text: text,
        forward: forward,
        hide: function() {
            if (selection) {
                selection.removeAllRanges();
                setSelection(undefined);
            }
            /**
         * {@link range}
         */ if (tab.annotationRange) {
                tab.annotationRange = undefined;
            }
        }
    }));
};
var ICON_SIZE = (0,platform/* scale */.b)(22, 28);
var ANNOTATION_SIZE = (0,platform/* scale */.b)(24, 30);
var TextSelectionMenuRenderer = function(param) {
    var tab = param.tab, range = param.range, anchorRect = param.anchorRect, containerRect = param.containerRect, viewRect = param.viewRect, forward = param.forward, text = param.text, hide = param.hide;
    var setAction = (0,hooks/* useSetAction */.ED)();
    var ref = (0,_sliced_to_array/* default */.Z)((0,state/* useAISettings */.KR)(), 1), settings = ref[0];
    var sendMessage = (0,hooks/* useChatbot */.dp)().sendMessage;
    var ref1 = (0,react.useRef)(null);
    var ref2 = (0,react.useState)(0), width = ref2[0], setWidth = ref2[1];
    var ref3 = (0,react.useState)(0), height = ref3[0], setHeight = ref3[1];
    var mobile = (0,hooks/* useMobile */.XA)();
    var t = (0,hooks/* useTranslation */.$G)("menu");
    var tAI = (0,hooks/* useTranslation */.$G)("ai");
    var cfi = tab.rangeToCfi(range);
    var annotation = tab.book.annotations.find(function(a) {
        return a.cfi === cfi;
    });
    var ref4 = (0,react.useState)(!!annotation), annotate = ref4[0], setAnnotate = ref4[1];
    var position = forward ? base/* LayoutAnchorPosition.Before */.tp.Before : base/* LayoutAnchorPosition.After */.tp.After;
    var zoom = (0,hooks/* useTypography */.tj)(tab).zoom;
    var endContainer = forward ? range.endContainer : range.startContainer;
    var _lineHeight = parseFloat(getComputedStyle(endContainer.parentElement).lineHeight);
    // no custom line height and the origin is keyword, e.g. 'normal'.
    var lineHeight = isNaN(_lineHeight) ? anchorRect.height : _lineHeight * (zoom !== null && zoom !== void 0 ? zoom : 1);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(es2015/* default */.ZP, {
        disabled: mobile,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(dist/* Overlay */.aV, {
                // cover `sash`
                className: "!z-50 !bg-transparent",
                onMouseDown: hide
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                ref: function(el) {
                    if (!el) return;
                    setWidth(el.clientWidth);
                    setHeight(el.clientHeight);
                    if (!mobile) {
                        el.focus();
                    }
                },
                className: (0,clsx_m/* default */.Z)("bg-surface text-on-surface-variant shadow-1 absolute z-50 p-2 focus:outline-none"),
                style: {
                    left: (0,base/* layout */.bK)(containerRect.width, width, {
                        offset: anchorRect.left + viewRect.left - containerRect.left,
                        size: anchorRect.width,
                        mode: base/* LayoutAnchorMode.ALIGN */.yW.ALIGN,
                        position: position
                    }),
                    top: (0,base/* layout */.bK)(containerRect.height, height, {
                        offset: anchorRect.top - (lineHeight - anchorRect.height) / 2,
                        size: lineHeight,
                        position: position
                    })
                },
                tabIndex: -1,
                onKeyDown: function(e) {
                    e.stopPropagation();
                    if (e.key === "c" && e.ctrlKey) {
                        (0,utils/* copy */.JG)(text);
                    }
                },
                children: [
                    annotate ? /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "mb-3",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Form/* TextField */.nv, {
                            mRef: ref1,
                            as: "textarea",
                            name: "notes",
                            defaultValue: annotation === null || annotation === void 0 ? void 0 : annotation.notes,
                            hideLabel: true,
                            className: "h-40 w-72",
                            autoFocus: true
                        })
                    }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "text-on-surface-variant -mx- mb-3 flex flex-wrap gap-1",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* IconButton */.h, {
                                title: t("copy"),
                                Icon: index_esm/* MdCopyAll */.vlz,
                                size: ICON_SIZE,
                                onClick: function() {
                                    hide();
                                    (0,utils/* copy */.JG)(text);
                                }
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* IconButton */.h, {
                                title: t("search_in_book"),
                                Icon: index_esm/* MdSearch */.vU7,
                                size: ICON_SIZE,
                                onClick: function() {
                                    hide();
                                    setAction("search");
                                    tab.setKeyword(text);
                                }
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* IconButton */.h, {
                                title: t("annotate"),
                                Icon: index_esm/* MdOutlineEdit */.mM_,
                                size: ICON_SIZE,
                                onClick: function() {
                                    setAnnotate(true);
                                }
                            }),
                            tab.isDefined(text) ? /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* IconButton */.h, {
                                title: t("undefine"),
                                Icon: index_esm/* MdOutlineIndeterminateCheckBox */.Tgt,
                                size: ICON_SIZE,
                                onClick: function() {
                                    hide();
                                    tab.undefine(text);
                                }
                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* IconButton */.h, {
                                title: t("define"),
                                Icon: index_esm/* MdOutlineAddBox */.om2,
                                size: ICON_SIZE,
                                onClick: function() {
                                    hide();
                                    tab.define([
                                        text
                                    ]);
                                }
                            }),
                            settings.explainSelection && /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* IconButton */.h, {
                                title: tAI("selection.explain_tooltip"),
                                Icon: index_esm/* MdAutoAwesome */.Gd0,
                                size: ICON_SIZE,
                                className: "text-primary hover:scale-110 active:scale-95 transition-all !p-1 bg-primary/5 rounded-lg border border-primary/20 shadow-sm shadow-primary/10",
                                onClick: function() {
                                    hide();
                                    sendMessage(text, undefined, {
                                        action: "explain"
                                    });
                                }
                            }),
                            settings.summarizeSelection && /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* IconButton */.h, {
                                title: tAI("selection.summarize_tooltip"),
                                Icon: index_esm/* MdAutoStories */.b2B,
                                size: ICON_SIZE,
                                className: "text-primary hover:scale-110 active:scale-95 transition-all !p-1 bg-primary/5 rounded-lg border border-primary/20 shadow-sm shadow-primary/10",
                                onClick: function() {
                                    hide();
                                    sendMessage(text, undefined, {
                                        action: "summarize"
                                    });
                                }
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "space-y-2",
                        children: (0,utils/* keys */.XP)(typeMap).map(function(type) {
                            /*#__PURE__*/ return (0,jsx_runtime.jsx)("div", {
                                className: "flex gap-2",
                                children: (0,utils/* keys */.XP)(colorMap).map(function(color) {
                                    var _obj;
                                    /*#__PURE__*/ return (0,jsx_runtime.jsx)("div", {
                                        style: (_obj = {}, (0,_define_property/* default */.Z)(_obj, typeMap[type].style, colorMap[color]), (0,_define_property/* default */.Z)(_obj, "width", ANNOTATION_SIZE), (0,_define_property/* default */.Z)(_obj, "height", ANNOTATION_SIZE), (0,_define_property/* default */.Z)(_obj, "fontSize", (0,platform/* scale */.b)(16, 20)), _obj),
                                        className: (0,clsx_m/* default */.Z)("typescale-body-large text-on-surface-variant flex cursor-pointer items-center justify-center", typeMap[type].class),
                                        onClick: function() {
                                            var ref;
                                            tab.putAnnotation(type, cfi, color, text, (ref = ref1.current) === null || ref === void 0 ? void 0 : ref.value);
                                            hide();
                                        },
                                        children: "A"
                                    }, color);
                                })
                            }, type);
                        })
                    }),
                    annotate && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mt-3 flex",
                        children: [
                            annotation && /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* Button */.z, {
                                compact: true,
                                variant: "secondary",
                                onClick: function() {
                                    tab.removeAnnotation(cfi);
                                    hide();
                                },
                                children: t("delete")
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* Button */.z, {
                                className: "ml-auto",
                                compact: true,
                                onClick: function() {
                                    var ref;
                                    var ref2, ref3;
                                    tab.putAnnotation((ref2 = annotation === null || annotation === void 0 ? void 0 : annotation.type) !== null && ref2 !== void 0 ? ref2 : "highlight", cfi, (ref3 = annotation === null || annotation === void 0 ? void 0 : annotation.color) !== null && ref3 !== void 0 ? ref3 : "yellow", text, (ref = ref1.current) === null || ref === void 0 ? void 0 : ref.value);
                                    hide();
                                },
                                children: t(annotation ? "update" : "create")
                            })
                        ]
                    })
                ]
            })
        ]
    });
};

// EXTERNAL MODULE: ./src/components/pages/index.ts + 1 modules
var pages = __webpack_require__(146);
;// CONCATENATED MODULE: ./src/components/Reader.tsx


























function handleKeyDown(tab) {
    var rtl = tab === null || tab === void 0 ? void 0 : tab.isRTL;
    return function(e) {
        // Ignore keyboard shortcuts if an input or editable element is focused
        var target = e.target;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
            return;
        }
        try {
            switch(e.code){
                case "ArrowLeft":
                case "ArrowUp":
                    rtl ? tab === null || tab === void 0 ? void 0 : tab.next() : tab === null || tab === void 0 ? void 0 : tab.prev();
                    break;
                case "ArrowRight":
                case "ArrowDown":
                    rtl ? tab === null || tab === void 0 ? void 0 : tab.prev() : tab === null || tab === void 0 ? void 0 : tab.next();
                    break;
                case "Space":
                    e.shiftKey ? tab === null || tab === void 0 ? void 0 : tab.prev() : tab === null || tab === void 0 ? void 0 : tab.next();
            }
        } catch (error) {
        // ignore `rendition is undefined` error
        }
    };
}
function ReaderGridView() {
    var groups = (0,models/* useReaderSnapshot */.Ys)().groups;
    (0,hooks_dist/* useEventListener */.OR)("keydown", handleKeyDown(models/* reader.focusedBookTab */.r1.focusedBookTab));
    if (!groups.length) return null;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(base/* SplitView */.z3, {
        className: (0,clsx_m/* default */.Z)("ReaderGridView"),
        children: groups.map(function(param, i) {
            var id = param.id;
            return /*#__PURE__*/ (0,jsx_runtime.jsx)(ReaderGroup, {
                index: i
            }, id);
        })
    });
}
function ReaderGroup(param) {
    var index = param.index;
    var group = models/* reader.groups */.r1.groups[index];
    var selectedIndex = (0,esm/* useSnapshot */.RK)(group).selectedIndex;
    var size = (0,base/* useSplitViewItem */.Bt)("".concat(ReaderGroup.name, ".").concat(index), {
        // to disable sash resize
        visible: false
    }).size;
    var handleMouseDown = (0,react.useCallback)(function() {
        models/* reader.selectGroup */.r1.selectGroup(index);
    }, [
        index
    ]);
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        className: "ReaderGroup flex flex-1 flex-col overflow-hidden focus:outline-none",
        onMouseDown: handleMouseDown,
        style: {
            width: size
        },
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(base/* DropZone */.rE, {
            className: (0,clsx_m/* default */.Z)("flex-1", platform/* isTouchScreen */.z || "h-0"),
            split: true,
            onDrop: function() {
                var _ref = (0,_async_to_generator/* default */.Z)(function(e, position) {
                    var files, tabs, text, fromTab, indexes, groupIdx, tabIdx, tab, id, ref, tabParam, _tmp;
                    return (0,tslib_es6.__generator)(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                files = e.dataTransfer.files;
                                tabs = [];
                                if (!files.length) return [
                                    3,
                                    2
                                ];
                                return [
                                    4,
                                    (0,src_file/* handleFiles */.Np)(files)
                                ];
                            case 1:
                                tabs = _state.sent();
                                return [
                                    3,
                                    7
                                ];
                            case 2:
                                text = e.dataTransfer.getData("text/plain") || "";
                                fromTab = text.includes(",");
                                if (!fromTab) return [
                                    3,
                                    3
                                ];
                                indexes = String(text).split(",");
                                groupIdx = Number(indexes[0]);
                                if (index === groupIdx) {
                                    if (group.tabs.length === 1) return [
                                        2
                                    ];
                                    if (position === "universe") return [
                                        2
                                    ];
                                }
                                tabIdx = Number(indexes[1]);
                                tab = models/* reader.removeTab */.r1.removeTab(tabIdx, groupIdx);
                                if (tab) tabs.push(tab);
                                return [
                                    3,
                                    7
                                ];
                            case 3:
                                id = text;
                                if (!((ref = Object.values(pages).find(function(p) {
                                    return p.displayName === id;
                                })) !== null && ref !== void 0)) return [
                                    3,
                                    4
                                ];
                                _tmp = ref;
                                return [
                                    3,
                                    6
                                ];
                            case 4:
                                return [
                                    4,
                                    db.db === null || db.db === void 0 ? void 0 : db.db.books.get(id)
                                ];
                            case 5:
                                _tmp = _state.sent();
                                _state.label = 6;
                            case 6:
                                tabParam = _tmp;
                                if (tabParam) tabs.push(tabParam);
                                _state.label = 7;
                            case 7:
                                if (tabs.length) {
                                    switch(position){
                                        case "left":
                                            models/* reader.addGroup */.r1.addGroup(tabs, index);
                                            break;
                                        case "right":
                                            models/* reader.addGroup */.r1.addGroup(tabs, index + 1);
                                            break;
                                        default:
                                            tabs.forEach(function(t) {
                                                return models/* reader.addTab */.r1.addTab(t, index);
                                            });
                                    }
                                }
                                return [
                                    2
                                ];
                        }
                    });
                });
                return function(e, position) {
                    return _ref.apply(this, arguments);
                };
            }(),
            children: group.tabs.map(function(tab, i) {
                return /*#__PURE__*/ (0,jsx_runtime.jsx)(PaneContainer, {
                    active: i === selectedIndex,
                    children: (0,_instanceof/* default */.Z)(tab, models/* BookTab */.g$) ? /*#__PURE__*/ (0,jsx_runtime.jsx)(BookPane, {
                        tab: tab,
                        onMouseDown: handleMouseDown
                    }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(tab.Component, {})
                }, tab.id);
            })
        })
    });
}
var PaneContainer = function(param) {
    var active = param.active, children = param.children;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        className: (0,clsx_m/* default */.Z)("h-full", active || "hidden"),
        children: react.Children.map(children, function(child) {
            return /*#__PURE__*/ react.isValidElement(child) ? /*#__PURE__*/ react.cloneElement(child, {
                active: active
            }) : child;
        })
    });
};
function BookPane(param) {
    var tab = param.tab, onMouseDown = param.onMouseDown, active = param.active;
    var ref, ref1, ref2;
    var ref3 = (0,react.useRef)(null);
    var wrapperRef = (0,react.useRef)(null);
    var citationHighlightTimerRef = (0,react.useRef)(null);
    var citationHighlightCfiRef = (0,react.useRef)(null);
    var typography = (0,hooks/* useTypography */.tj)(tab);
    var dark = (0,hooks/* useColorScheme */.tv)().dark;
    var ref4 = (0,_sliced_to_array/* default */.Z)((0,hooks/* useBackground */.ho)(), 3), background = ref4[0], backgroundColor = ref4[2];
    var contentWidthPercent = typography.contentWidthPercent;
    var ref5 = (0,_sliced_to_array/* default */.Z)((0,hooks/* useAction */.BH)(), 2), setAction = ref5[1];
    var ref6 = (0,esm/* useSnapshot */.RK)(tab), iframe = ref6.iframe, rendition = ref6.rendition, rendered = ref6.rendered, container = ref6.container, book = ref6.book;
    var isRTL = ((ref = book.metadata) === null || ref === void 0 ? void 0 : ref.direction) === "rtl";
    tilg_default()();
    // v3.12: Semantic Jump Highlight Support
    (0,react.useEffect)(function() {
        var isHighlightableCfi = function(cfi) {
            return !!cfi && cfi.startsWith("epubcfi(") && cfi.includes("!") && /:\d+/.test(cfi);
        };
        var normalizeAnchorText = function(value) {
            return String(value || "").replace(/\s+/g, " ").replace(/[^\w\s\u00C0-\u024F]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
        };
        var normalizeText = function(value) {
            return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
        };
        var sleep = function(ms) {
            return new Promise(function(resolve) {
                return setTimeout(resolve, ms);
            });
        };
        var clearCitationHighlight = function(cfi) {
            var target = cfi || citationHighlightCfiRef.current;
            if (!target) return;
            try {
                var ref;
                (ref = tab.rendition) === null || ref === void 0 ? void 0 : ref.annotations.remove(target, "highlight");
            } catch (e) {
            // Ignore cleanup errors from stale/invalid CFI.
            }
            if (!cfi || target === citationHighlightCfiRef.current) {
                citationHighlightCfiRef.current = null;
            }
            if (citationHighlightTimerRef.current) {
                clearTimeout(citationHighlightTimerRef.current);
                citationHighlightTimerRef.current = null;
            }
        };
        var applyGlowCitationHighlight = function(targetCfi) {
            if (!tab.rendition || !isHighlightableCfi(targetCfi)) return false;
            // Remove previous citation highlight (or duplicated same-CFI highlight) to avoid stacking.
            clearCitationHighlight(citationHighlightCfiRef.current || targetCfi);
            try {
                tab.rendition.annotations.remove(targetCfi, "highlight");
            } catch (e) {
            // Ignore if nothing exists yet.
            }
            try {
                if (tab.rendition) {
                    var ref;
                    var doc = (ref = tab.rendition.getContents()[0]) === null || ref === void 0 ? void 0 : ref.document;
                    if (doc) ensureHighlightStyles(doc);
                }
                tab.rendition.annotations.add("highlight", targetCfi, {}, undefined, "glow-highlight");
                citationHighlightCfiRef.current = targetCfi;
                citationHighlightTimerRef.current = setTimeout(function() {
                    clearCitationHighlight(targetCfi);
                }, 5000);
                return true;
            } catch (err) {
                console.warn("[Reader] Failed to apply glow citation highlight:", err);
                return false;
            }
        };
        var buildContentProbes = function(content) {
            var normalized = normalizeText(content).replace(RegExp("[^\\p{L}\\p{N}\\s]", "gu"), " ");
            var words = normalized.split(/\s+/).filter(Boolean);
            if (words.length === 0) return [];
            var starts = [
                22,
                16,
                12,
                9,
                7
            ];
            var mids = [
                14,
                10
            ];
            var probes = [];
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = starts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var n = _step.value;
                    if (words.length >= n) probes.push(words.slice(0, n).join(" "));
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
            var midStart = Math.max(0, Math.floor(words.length / 2) - 8);
            var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
            try {
                for(var _iterator1 = mids[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                    var n1 = _step1.value;
                    if (words.length >= midStart + n1) probes.push(words.slice(midStart, midStart + n1).join(" "));
                }
            } catch (err) {
                _didIteratorError1 = true;
                _iteratorError1 = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                        _iterator1.return();
                    }
                } finally{
                    if (_didIteratorError1) {
                        throw _iteratorError1;
                    }
                }
            }
            return Array.from(new Set(probes.filter(function(p) {
                return p.length >= 32;
            })));
        };
        var tryFindPreciseCfi = function() {
            var _ref = (0,_async_to_generator/* default */.Z)(function(content) {
                var text, section, probes, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, probe, matches, hit;
                return (0,tslib_es6.__generator)(this, function(_state) {
                    text = String(content || "").trim();
                    if (!text) return [
                        2,
                        null
                    ];
                    section = tab === null || tab === void 0 ? void 0 : tab.section;
                    if (!section || typeof section.find !== "function") return [
                        2,
                        null
                    ];
                    probes = buildContentProbes(text);
                    if (probes.length === 0) return [
                        2,
                        null
                    ];
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(_iterator = probes[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            probe = _step.value;
                            try {
                                matches = section.find(probe) || [];
                                hit = matches.find(function(m) {
                                    return typeof (m === null || m === void 0 ? void 0 : m.cfi) === "string" && m.cfi.startsWith("epubcfi(");
                                });
                                if (hit === null || hit === void 0 ? void 0 : hit.cfi) return [
                                    2,
                                    hit.cfi
                                ];
                            } catch (e) {
                            // Section may not be fully ready yet; caller retries.
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
                    return [
                        2,
                        null
                    ];
                });
            });
            return function tryFindPreciseCfi(content) {
                return _ref.apply(this, arguments);
            };
        }();
        var buildNormalizedNodeMap = function(doc) {
            var refs = [];
            var chars = [];
            var walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
                acceptNode: function acceptNode(node) {
                    var ref;
                    var parentTag = (((ref = node.parentElement) === null || ref === void 0 ? void 0 : ref.tagName) || "").toLowerCase();
                    if (parentTag === "script" || parentTag === "style" || parentTag === "noscript") {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            });
            var started = false;
            var prevSpace = false;
            var allowed = /[\w\u00C0-\u024F]/;
            var current = walker.nextNode();
            while(current){
                var node = current;
                var raw = node.nodeValue || "";
                for(var i = 0; i < raw.length; i++){
                    var ch = raw[i] || "";
                    var isSpace = /\s/.test(ch);
                    var out = isSpace ? " " : allowed.test(ch) ? ch.toLowerCase() : " ";
                    if (out === " ") {
                        if (!started || prevSpace) continue;
                        chars.push(" ");
                        refs.push({
                            node: node,
                            offset: i
                        });
                        prevSpace = true;
                        continue;
                    }
                    chars.push(out);
                    refs.push({
                        node: node,
                        offset: i
                    });
                    started = true;
                    prevSpace = false;
                }
                current = walker.nextNode();
            }
            if (chars.length > 0 && chars[chars.length - 1] === " ") {
                chars.pop();
                refs.pop();
            }
            return {
                normalized: chars.join(""),
                refs: refs
            };
        };
        var ensureHighlightStyles = function(doc) {
            var ref;
            if (doc.getElementById("lumen-highlight-styles")) return;
            var style = doc.createElement("style");
            style.id = "lumen-highlight-styles";
            style.textContent = "\n        @keyframes lumen-shimmer {\n          0% { background-position: 200% 0; }\n          100% { background-position: -200% 0; }\n        }\n        .glow-highlight, .lumen-citation-highlight {\n          background: linear-gradient(110deg, \n            rgba(6, 182, 212, 0.1) 0%, \n            rgba(6, 182, 212, 0.25) 50%, \n            rgba(6, 182, 212, 0.1) 100%\n          ) !important;\n          background-size: 200% 100% !important;\n          animation: lumen-shimmer 3s linear infinite !important;\n          border-bottom: 2px solid rgba(6, 182, 212, 0.8) !important;\n          border-radius: 3px !important;\n          box-shadow: 0 2px 8px rgba(6, 182, 212, 0.15) !important;\n          transition: all 0.3s ease !important;\n        }\n      ";
            (ref = doc.head) === null || ref === void 0 ? void 0 : ref.appendChild(style);
        };
        var clearFallbackHighlight = function(doc) {
            var nodes = doc.querySelectorAll('[data-lumen-citation-highlight="1"]');
            nodes.forEach(function(node) {
                node.classList.remove("lumen-citation-highlight");
                node.removeAttribute("data-lumen-citation-highlight");
            });
        };
        var tryContentFallbackHighlight = function(content) {
            var text = normalizeText(content || "");
            if (!text) return false;
            var wrapper = wrapperRef.current;
            if (!wrapper) return false;
            var frame = wrapper.querySelector("iframe");
            var doc = frame === null || frame === void 0 ? void 0 : frame.contentDocument;
            if (!(doc === null || doc === void 0 ? void 0 : doc.body)) return false;
            ensureHighlightStyles(doc);
            clearFallbackHighlight(doc);
            var probes = [
                220,
                170,
                130,
                96,
                72,
                52
            ].map(function(len) {
                return text.slice(0, len);
            }).filter(function(probe) {
                return probe.length >= 28;
            });
            if (probes.length === 0) return false;
            var candidates = Array.from(doc.body.querySelectorAll("p, li, blockquote, h1, h2, h3, h4, h5, h6, div, span"));
            var target = null;
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                var _loop = function() {
                    var probe = _step.value;
                    target = candidates.find(function(el) {
                        return normalizeText(el.textContent || "").includes(probe);
                    }) || null;
                    if (target) return "break";
                };
                for(var _iterator = probes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var _ret = _loop();
                    if (_ret === "break") break;
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
            if (!target) return false;
            target.classList.add("lumen-citation-highlight");
            target.setAttribute("data-lumen-citation-highlight", "1");
            try {
                target.scrollIntoView({
                    block: "center",
                    behavior: "smooth"
                });
            } catch (e) {
            // Ignore scroll failures in edge iframe states.
            }
            setTimeout(function() {
                try {
                    target === null || target === void 0 ? void 0 : target.classList.remove("lumen-citation-highlight");
                    target === null || target === void 0 ? void 0 : target.removeAttribute("data-lumen-citation-highlight");
                } catch (e) {
                // Ignore cleanup errors.
                }
            }, 5000);
            return true;
        };
        var tryAnchorBasedHighlight = function() {
            var _ref = (0,_async_to_generator/* default */.Z)(function(anchorStartNorm, anchorEndNorm, content) {
                var startNorm, endNorm, wrapper, frame, doc, ref, normalized, refs, start, endExclusive, contentNorm, probe, windowStart, windowEnd, nearby, startRef, endRef, range, cfi;
                return (0,tslib_es6.__generator)(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            if (!Number.isFinite(anchorStartNorm) || !Number.isFinite(anchorEndNorm)) return [
                                2,
                                false
                            ];
                            startNorm = Number(anchorStartNorm);
                            endNorm = Number(anchorEndNorm);
                            if (startNorm < 0 || endNorm <= startNorm) return [
                                2,
                                false
                            ];
                            wrapper = wrapperRef.current;
                            if (!wrapper) return [
                                2,
                                false
                            ];
                            frame = wrapper.querySelector("iframe");
                            doc = frame === null || frame === void 0 ? void 0 : frame.contentDocument;
                            if (!(doc === null || doc === void 0 ? void 0 : doc.body)) return [
                                2,
                                false
                            ];
                            ref = buildNormalizedNodeMap(doc), normalized = ref.normalized, refs = ref.refs;
                            if (!normalized || refs.length === 0) return [
                                2,
                                false
                            ];
                            start = Math.max(0, Math.min(startNorm, refs.length - 1));
                            endExclusive = Math.max(start + 1, Math.min(endNorm, refs.length));
                            contentNorm = normalizeAnchorText(content || "");
                            if (contentNorm.length >= 24) {
                                probe = contentNorm.slice(0, Math.min(90, contentNorm.length));
                                windowStart = Math.max(0, start - 80);
                                windowEnd = Math.min(normalized.length, endExclusive + 80);
                                nearby = normalized.slice(windowStart, windowEnd);
                                if (probe && !nearby.includes(probe)) {
                                    return [
                                        2,
                                        false
                                    ];
                                }
                            }
                            startRef = refs[start];
                            endRef = refs[endExclusive - 1];
                            if (!startRef || !endRef) return [
                                2,
                                false
                            ];
                            range = doc.createRange();
                            range.setStart(startRef.node, startRef.offset);
                            range.setEnd(endRef.node, Math.min((endRef.node.nodeValue || "").length, endRef.offset + 1));
                            cfi = "";
                            try {
                                cfi = tab.rangeToCfi(range);
                            } catch (e) {
                                return [
                                    2,
                                    false
                                ];
                            }
                            if (!isHighlightableCfi(cfi)) return [
                                2,
                                false
                            ];
                            try {
                                tab.display(cfi, false);
                            } catch (e1) {
                            // Keep going; annotation may still succeed.
                            }
                            return [
                                4,
                                sleep(60)
                            ];
                        case 1:
                            _state.sent();
                            return [
                                2,
                                applyGlowCitationHighlight(cfi)
                            ];
                    }
                });
            });
            return function tryAnchorBasedHighlight(anchorStartNorm, anchorEndNorm, content) {
                return _ref.apply(this, arguments);
            };
        }();
        var handle = function(e) {
            var ref = e.detail || {}, cfi = ref.cfi, content = ref.content, anchorStartNorm = ref.anchorStartNorm, anchorEndNorm = ref.anchorEndNorm;
            if (active && tab.rendition && typeof cfi === "string" && isHighlightableCfi(cfi)) {
                try {
                    // Apply singleton glow highlight to avoid stacked overlays on repeated clicks.
                    applyGlowCitationHighlight(cfi);
                } catch (err) {
                    console.warn("[Reader] Failed to highlight chunk CFI:", err);
                }
                return;
            }
            if (active && typeof content === "string" && content.trim().length > 0) {
                void (0,_async_to_generator/* default */.Z)(function() {
                    var anchorAttempts, hasAnchors, attempt, anchored, preciseCfi;
                    return (0,tslib_es6.__generator)(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                anchorAttempts = 0;
                                hasAnchors = Number.isFinite(Number(anchorStartNorm)) && Number.isFinite(Number(anchorEndNorm)) && Number(anchorEndNorm) > Number(anchorStartNorm);
                                attempt = 0;
                                _state.label = 1;
                            case 1:
                                if (!(attempt < 14)) return [
                                    3,
                                    9
                                ];
                                if (!(hasAnchors && anchorAttempts < 4)) return [
                                    3,
                                    3
                                ];
                                return [
                                    4,
                                    tryAnchorBasedHighlight(Number(anchorStartNorm), Number(anchorEndNorm), content)
                                ];
                            case 2:
                                anchored = _state.sent();
                                anchorAttempts++;
                                if (anchored) return [
                                    2
                                ];
                                _state.label = 3;
                            case 3:
                                return [
                                    4,
                                    tryFindPreciseCfi(content)
                                ];
                            case 4:
                                preciseCfi = _state.sent();
                                if (!(preciseCfi && isHighlightableCfi(preciseCfi))) return [
                                    3,
                                    6
                                ];
                                try {
                                    tab.display(preciseCfi, false);
                                } catch (e) {
                                // Keep going; highlight can still succeed even if display fails here.
                                }
                                return [
                                    4,
                                    sleep(60)
                                ];
                            case 5:
                                _state.sent();
                                try {
                                    if (applyGlowCitationHighlight(preciseCfi)) return [
                                        2
                                    ];
                                } catch (e1) {
                                // If annotation fails, continue to fallback highlight.
                                }
                                _state.label = 6;
                            case 6:
                                if (tryContentFallbackHighlight(content)) return [
                                    2
                                ];
                                return [
                                    4,
                                    sleep(120)
                                ];
                            case 7:
                                _state.sent();
                                _state.label = 8;
                            case 8:
                                attempt++;
                                return [
                                    3,
                                    1
                                ];
                            case 9:
                                console.warn("[Reader] Fallback highlight not found for citation content");
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        };
        window.addEventListener("reader-highlight-chunk", handle);
        return function() {
            window.removeEventListener("reader-highlight-chunk", handle);
            clearCitationHighlight();
        };
    }, [
        active,
        tab,
        tab.rendition
    ]);
    // Function to center content by applying dynamic padding to iframe body
    var centerContent = (0,react.useCallback)(function() {
        var wrapper = wrapperRef.current;
        if (!wrapper || !rendition) return;
        try {
            var ref;
            var iframe = wrapper.querySelector("iframe");
            if (!iframe || !iframe.contentDocument) return;
            var body = iframe.contentDocument.body;
            if (!body) return;
            var wrapperWidth = wrapper.clientWidth;
            var bodyStyle = (ref = iframe.contentWindow) === null || ref === void 0 ? void 0 : ref.getComputedStyle(body);
            if (!bodyStyle) return;
            // Get actual column count from CSS
            var columnCount = parseInt(bodyStyle.columnCount);
            var columnGap = parseFloat(bodyStyle.columnGap || "0");
            // Only apply centering if we have valid column layout
            if (columnCount && columnCount > 0 && !isNaN(columnCount)) {
                // Calculate the width of a single column
                var totalGapWidth = (columnCount - 1) * columnGap;
                var columnWidth = (wrapperWidth - totalGapWidth) / columnCount;
                // Calculate total width needed for all columns
                var totalColumnsWidth = columnCount * columnWidth + totalGapWidth;
                // Calculate extra space and apply as margin
                var extraSpace = wrapperWidth - totalColumnsWidth;
                var margin = Math.max(0, Math.floor(extraSpace / 2));
                // Use margin instead of padding - this doesn't reduce internal width
                body.style.marginLeft = "".concat(margin, "px");
                body.style.marginRight = "".concat(margin, "px");
                console.log("Content centering (margin):", {
                    wrapperWidth: wrapperWidth,
                    columnCount: columnCount,
                    columnWidth: columnWidth,
                    columnGap: columnGap,
                    totalColumnsWidth: totalColumnsWidth,
                    extraSpace: extraSpace,
                    margin: margin
                });
            } else {
                // No columns or invalid config, reset margins
                body.style.marginLeft = "0px";
                body.style.marginRight = "0px";
                console.log("No valid column layout, margins reset");
            }
        } catch (error) {
            console.error("Error centering content:", error);
        }
    }, [
        rendition
    ]);
    (0,react.useEffect)(function() {
        var el = ref3.current;
        if (!el) return;
        var timeoutId;
        var observer = new ResizeObserver(function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                if (rendition === null || rendition === void 0 ? void 0 : rendition.manager) {
                    try {
                        var ref;
                        var width = el.clientWidth;
                        var height = el.clientHeight;
                        console.log("Resizing rendition to:", width, height);
                        console.log("WrapperRef width:", (ref = wrapperRef.current) === null || ref === void 0 ? void 0 : ref.clientWidth);
                        console.log("ContentWidthPercent:", contentWidthPercent);
                        if (width > 0 && height > 0) {
                            rendition.resize(width, height);
                            //Apply centering after resize
                            setTimeout(function() {
                                return centerContent();
                            }, 100);
                        }
                    } catch (error) {
                        console.error("Error resizing rendition:", error);
                    }
                }
            }, 60);
        });
        observer.observe(el);
        return function() {
            observer.disconnect();
            clearTimeout(timeoutId);
        };
    }, [
        rendition,
        contentWidthPercent,
        centerContent
    ]);
    (0,hooks/* useSync */.CO)(tab);
    var setNavbar = (0,es/* useSetRecoilState */.Zl)(state/* navbarState */.OL);
    var mobile = (0,hooks/* useMobile */.XA)();
    var _contentWidthPercent, _fontFamily, _fontSize, _fontWeight, _lineHeight, _spread, _zoom;
    var pageCountLayoutSignature = [
        (_contentWidthPercent = typography.contentWidthPercent) !== null && _contentWidthPercent !== void 0 ? _contentWidthPercent : "",
        (_fontFamily = typography.fontFamily) !== null && _fontFamily !== void 0 ? _fontFamily : "",
        (_fontSize = typography.fontSize) !== null && _fontSize !== void 0 ? _fontSize : "",
        (_fontWeight = typography.fontWeight) !== null && _fontWeight !== void 0 ? _fontWeight : "",
        (_lineHeight = typography.lineHeight) !== null && _lineHeight !== void 0 ? _lineHeight : "",
        (_spread = typography.spread) !== null && _spread !== void 0 ? _spread : "",
        (_zoom = typography.zoom) !== null && _zoom !== void 0 ? _zoom : "", 
    ].join("|");
    (0,react.useEffect)(function() {
        tab.setPageCountLayoutSignature(pageCountLayoutSignature);
    }, [
        pageCountLayoutSignature,
        tab
    ]);
    var applyCustomStyle = (0,react.useCallback)(function() {
        var contents = rendition === null || rendition === void 0 ? void 0 : rendition.getContents()[0];
        (0,styles/* updateCustomStyle */.A7)(contents, typography);
        // Smart Color Inversion for Dark Mode
        if (contents) {
            var doc = contents.document;
            var elements = doc.querySelectorAll("p, span, h1, h2, h3, h4, h5, h6, div, a, li, blockquote");
            if (dark) {
                // Dark mode: invert dark colors to light
                var themeColor = "#bfc8ca" // Light gray for dark mode
                ;
                elements.forEach(function(el) {
                    var htmlEl = el;
                    var computedStyle = window.getComputedStyle(htmlEl);
                    var color = computedStyle.color;
                    // Parse RGB
                    var rgb = color.match(/\d+/g);
                    if (rgb && rgb.length >= 3) {
                        var ref = (0,_sliced_to_array/* default */.Z)(rgb.map(Number), 3), r = ref[0], g = ref[1], b = ref[2];
                        // Check if color is dark (e.g., close to black)
                        // Threshold can be adjusted, < 100 is a safe bet for "dark text"
                        if (r < 100 && g < 100 && b < 100) {
                            htmlEl.style.setProperty("color", themeColor, "important");
                        }
                    }
                    var backgroundColor = computedStyle.backgroundColor;
                    var bgRgb = backgroundColor.match(/\d+/g);
                    if (bgRgb && bgRgb.length >= 3) {
                        var ref1 = (0,_sliced_to_array/* default */.Z)(bgRgb.map(Number), 3), r1 = ref1[0], g1 = ref1[1], b1 = ref1[2];
                        // If background is light (close to white), make it dark gray
                        // This fixes "white boxes" in dark mode while keeping the box visible
                        if (r1 > 200 && g1 > 200 && b1 > 200) {
                            htmlEl.style.setProperty("background-color", "#374151", "important");
                        }
                    }
                });
            } else {
                // Light mode: clear any forced color styles to restore original book colors
                elements.forEach(function(el) {
                    var htmlEl = el;
                    htmlEl.style.removeProperty("color");
                    htmlEl.style.removeProperty("background-color");
                });
            }
        }
    }, [
        rendition,
        typography,
        dark
    ]);
    (0,react.useEffect)(function() {
        tab.onRender = applyCustomStyle;
    }, [
        applyCustomStyle,
        tab
    ]);
    (0,react.useEffect)(function() {
        var el = ref3.current;
        if (el && !rendition) {
            var width = el.clientWidth;
            var height = el.clientHeight;
            tab.render(el, width, height);
        }
    }, [
        rendition,
        tab
    ]);
    (0,react.useEffect)(function() {
        var _spread;
        /**
     * when `spread` changes, we should call `spread()` to re-layout,
     * then call {@link updateCustomStyle} to update custom style
     * according to the latest layout
     */ rendition === null || rendition === void 0 ? void 0 : rendition.spread((_spread = typography.spread) !== null && _spread !== void 0 ? _spread : types_rendition/* RenditionSpread.Auto */.J.Auto);
        // Apply centering after spread change
        setTimeout(function() {
            return centerContent();
        }, 200);
    }, [
        typography.spread,
        rendition,
        centerContent
    ]);
    // Apply centering when page turns (rendered changes)
    (0,react.useEffect)(function() {
        if (rendered) {
            console.log("Page rendered, applying centering");
            setTimeout(function() {
                return centerContent();
            }, 100);
        }
    }, [
        rendered,
        centerContent
    ]);
    (0,react.useEffect)(function() {
        return applyCustomStyle();
    }, [
        applyCustomStyle
    ]);
    (0,react.useEffect)(function() {
        var timeoutId = window.setTimeout(function() {
            tab.refreshPageCountEstimate();
        }, 150);
        return function() {
            return window.clearTimeout(timeoutId);
        };
    }, [
        tab,
        rendition,
        typography.contentWidthPercent,
        typography.fontFamily,
        typography.fontSize,
        typography.fontWeight,
        typography.lineHeight,
        typography.spread,
        typography.zoom, 
    ]);
    (0,react.useEffect)(function() {
        if (dark === undefined) return;
        // set `!important` when in dark mode
        var color = dark ? "#bfc8ca" : "#3f484a";
        rendition === null || rendition === void 0 ? void 0 : rendition.themes.override("color", color, dark);
        if (backgroundColor) {
            rendition === null || rendition === void 0 ? void 0 : rendition.themes.override("background-color", backgroundColor, true);
        }
    }, [
        rendition,
        dark,
        backgroundColor
    ]);
    // Force resize after initial render
    (0,react.useEffect)(function() {
        if ((rendition === null || rendition === void 0 ? void 0 : rendition.manager) && rendered) {
            try {
                // Call resize() without arguments to let epub.js recalculate
                rendition.resize();
                window.setTimeout(function() {
                    return tab.refreshPageCountEstimate();
                }, 150);
            } catch (error) {
                console.error("Error resizing rendition after render:", error);
            }
        }
    }, [
        rendition,
        rendered,
        tab
    ]);
    // Trigger resize when pane becomes visible after being hidden
    (0,react.useEffect)(function() {
        if (active && (rendition === null || rendition === void 0 ? void 0 : rendition.manager)) {
            // Small delay to ensure DOM has updated after becoming visible
            var timeoutId = setTimeout(function() {
                if (rendition === null || rendition === void 0 ? void 0 : rendition.manager) {
                    // Double check rendition.manager is still valid
                    try {
                        rendition.resize();
                        window.setTimeout(function() {
                            return tab.refreshPageCountEstimate();
                        }, 150);
                    } catch (error) {
                        console.error("Error resizing rendition on visibility change:", error);
                    }
                }
            }, 50);
            return function() {
                return clearTimeout(timeoutId);
            };
        }
    }, [
        active,
        rendition,
        tab
    ]);
    var ref7 = (0,react.useState)(), src = ref7[0], setSrc = ref7[1];
    (0,react.useEffect)(function() {
        if (src) {
            var ref;
            if ((0,_instanceof/* default */.Z)(document.activeElement, HTMLElement)) (ref = document.activeElement) === null || ref === void 0 ? void 0 : ref.blur();
        }
    }, [
        src
    ]);
    var setDragEvent = (0,base/* useDndContext */.Cj)().setDragEvent;
    // `dragenter` not fired in iframe when the count of times is even, so use `dragover`
    (0,hooks_dist/* useEventListener */.OR)(iframe, "dragover", function(e) {
        console.log("drag enter in iframe");
        setDragEvent(e);
    });
    (0,hooks_dist/* useEventListener */.OR)(iframe, "mousedown", onMouseDown);
    (0,hooks_dist/* useEventListener */.OR)(iframe, "click", function(e) {
        // https://developer.chrome.com/blog/tap-to-search
        e.preventDefault();
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = e.composedPath()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var el = _step.value;
                // `instanceof` may not work in iframe
                if (el.tagName === "A" && el.href) {
                    tab.showPrevLocation();
                    return;
                }
                if (mobile === false && el.tagName === "IMG" && el.src.startsWith("blob:")) {
                    setSrc(el.src);
                    return;
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
        if (platform/* isTouchScreen */.z && container) {
            if (getClickedAnnotation()) {
                setClickedAnnotation(false);
                return;
            }
            var w = container.clientWidth;
            var x = e.clientX % w;
            var threshold = 0.3;
            var side = w * threshold;
            // Edge taps no longer turn pages. A center tap toggles the navbar on mobile.
            if (mobile && x >= side && w - x >= side) {
                setNavbar(function(a) {
                    return !a;
                });
            }
        }
    });
    (0,hooks_dist/* useEventListener */.OR)(iframe, "wheel", function(e) {
        if (e.deltaY < 0) {
            tab.isRTL ? tab.next() : tab.prev();
        } else {
            tab.isRTL ? tab.prev() : tab.next();
        }
    });
    (0,hooks_dist/* useEventListener */.OR)(iframe, "keydown", handleKeyDown(tab));
    (0,hooks_dist/* useEventListener */.OR)(iframe, "touchstart", function(e) {
        var ref, ref1;
        var ref2;
        var x0 = (ref2 = (ref = e.targetTouches[0]) === null || ref === void 0 ? void 0 : ref.clientX) !== null && ref2 !== void 0 ? ref2 : 0;
        var ref3;
        var y0 = (ref3 = (ref1 = e.targetTouches[0]) === null || ref1 === void 0 ? void 0 : ref1.clientY) !== null && ref3 !== void 0 ? ref3 : 0;
        var t0 = Date.now();
        if (!iframe) return;
        // When selecting text with long tap, `touchend` is not fired,
        // so instead of use `addEventlistener`, we should use `on*`
        // to remove the previous listener.
        iframe.ontouchend = function handleTouchEnd(e) {
            var ref, ref1;
            iframe.ontouchend = undefined;
            var selection = iframe.getSelection();
            if ((0,hooks/* hasSelection */.yF)(selection)) return;
            var ref2;
            var x1 = (ref2 = (ref = e.changedTouches[0]) === null || ref === void 0 ? void 0 : ref.clientX) !== null && ref2 !== void 0 ? ref2 : 0;
            var ref3;
            var y1 = (ref3 = (ref1 = e.changedTouches[0]) === null || ref1 === void 0 ? void 0 : ref1.clientY) !== null && ref3 !== void 0 ? ref3 : 0;
            var t1 = Date.now();
            var deltaX = x1 - x0;
            var deltaY = y1 - y0;
            var deltaT = t1 - t0;
            var absX = Math.abs(deltaX);
            var absY = Math.abs(deltaY);
            if (absX < 10) return;
            if (absY / absX > 2) {
                if (deltaT > 100 || absX < 30) {
                    return;
                }
            }
            if (deltaX > 0) {
                tab.isRTL ? tab.next() : tab.prev();
            }
            if (deltaX < 0) {
                tab.isRTL ? tab.prev() : tab.next();
            }
        };
    });
    (0,hooks/* useDisablePinchZooming */.gp)(iframe);
    var parseTitle = function(filename) {
        if (!filename) return {
            title: "Unknown",
            creator: undefined
        };
        var parts = String(filename).split(" -- ");
        if (parts.length >= 2) {
            return {
                title: parts[0],
                creator: parts[1]
            };
        }
        return {
            title: filename,
            creator: undefined
        };
    };
    var displayTitle = ((ref1 = tab.book.metadata) === null || ref1 === void 0 ? void 0 : ref1.title) || parseTitle(tab.title).title;
    var displayCreator = ((ref2 = tab.book.metadata) === null || ref2 === void 0 ? void 0 : ref2.creator) || parseTitle(tab.title).creator;
    // Get group and tabs info for header
    var groupIndex = models/* reader.groups.findIndex */.r1.groups.findIndex(function(g) {
        return g.tabs.some(function(t) {
            return t.id === tab.id;
        });
    });
    var group = groupIndex !== -1 ? models/* reader.groups */.r1.groups[groupIndex] : undefined;
    var allTabs = (group === null || group === void 0 ? void 0 : group.tabs) || [];
    var selectedTabIndex = allTabs.findIndex(function(t) {
        return t.id === tab.id;
    });
    var header = /*#__PURE__*/ (0,jsx_runtime.jsx)(ReaderPaneHeader, {
        title: displayTitle,
        creator: displayCreator,
        tabs: allTabs,
        selectedTabIndex: selectedTabIndex,
        rtl: isRTL,
        onTabSelect: function(index) {
            if (group) {
                group.selectTab(index);
            }
        },
        onTabClose: function(index) {
            if (groupIndex !== -1) {
                models/* reader.removeTab */.r1.removeTab(index, groupIndex);
            }
        },
        onNext: function() {
            return tab.next();
        },
        onPrev: function() {
            return tab.prev();
        },
        onToc: function() {
            setAction("toc");
        },
        onClose: function() {
            // Close the current tab
            if (groupIndex !== -1) {
                var tabIndex = group.tabs.findIndex(function(t) {
                    return t.id === tab.id;
                });
                if (tabIndex !== -1) {
                    models/* reader.removeTab */.r1.removeTab(tabIndex, groupIndex);
                }
            }
        },
        onMenu: function() {
            setAction(function(current) {
                return current ? undefined : "toc";
            });
        }
    });
    var footer = /*#__PURE__*/ (0,jsx_runtime.jsx)(ReaderPaneFooter, {
        percentage: book.percentage,
        rtl: isRTL
    });
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(NewReaderLayout, {
        header: header,
        footer: footer,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(react_photo_view_module/* PhotoSlider */.Ce, {
                images: [
                    {
                        src: src,
                        key: 0
                    }
                ],
                visible: !!src,
                onClose: function() {
                    return setSrc(undefined);
                },
                maskOpacity: 0.6,
                bannerVisible: false
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "relative flex h-full w-full flex-1 flex-col items-center",
                style: {
                    backgroundColor: backgroundColor
                },
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                    ref: wrapperRef,
                    className: "reader-wrapper relative mx-auto h-full",
                    style: {
                        width: contentWidthPercent && contentWidthPercent < 100 ? "".concat(contentWidthPercent, "%") : "100%"
                    },
                    children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        ref: ref3,
                        className: "flex h-full w-full justify-center",
                        // `color-scheme: dark` will make iframe background white
                        style: {
                            colorScheme: "auto"
                        },
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: (0,clsx_m/* default */.Z)("absolute inset-0", // do not cover `sash`
                                "z-20", rendered && "hidden", background)
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(TextSelectionMenu, {
                                tab: tab
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Annotations, {
                                tab: tab
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(SearchHighlightLayer, {
                                tab: tab
                            })
                        ]
                    })
                })
            })
        ]
    });
}
var ReaderPaneHeader = function(param) {
    var title = param.title, _creator = param.creator, tabs = param.tabs, _selectedTabIndex = param.selectedTabIndex, selectedTabIndex = _selectedTabIndex === void 0 ? 0 : _selectedTabIndex, rtl = param.rtl, onTabSelect = param.onTabSelect, onTabClose = param.onTabClose, onNext = param.onNext, onPrev = param.onPrev, onToc = param.onToc, onClose = param.onClose, onMenu = param.onMenu;
    var t = (0,hooks/* useTranslation */.$G)();
    // Truncate title if too long
    var truncatedTitle = title && title.length > 40 ? "".concat(title.substring(0, 40), "...") : title;
    // Always show tabs for consistent sizing
    var showTabs = tabs && tabs.length >= 1;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("header", {
        className: "flex h-12 shrink-0 items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-800",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex items-center space-x-2",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                        onClick: onMenu,
                        className: "rounded p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                            className: "material-symbols-outlined text-xl",
                            children: "menu"
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                        onClick: function() {
                            return models/* reader.clear */.r1.clear();
                        },
                        className: "rounded p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
                        title: t("reader.back_to_library"),
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                            className: "material-symbols-outlined text-xl",
                            children: "home"
                        })
                    }),
                    showTabs ? /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "flex items-center space-x-2",
                        children: tabs.map(function(tab, index) {
                            var ref;
                            var isSelected = index === selectedTabIndex;
                            var tabTitle = (0,_instanceof/* default */.Z)(tab, models/* BookTab */.g$) ? ((ref = tab.book.metadata) === null || ref === void 0 ? void 0 : ref.title) || tab.book.name : tab.title;
                            var truncTabTitle = tabTitle && tabTitle.length > 25 ? "".concat(tabTitle.substring(0, 25), "...") : tabTitle;
                            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: (0,clsx_m/* default */.Z)("group flex items-center rounded px-3 py-1.5 transition-colors", isSelected ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-900"),
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                        onClick: function() {
                                            return onTabSelect === null || onTabSelect === void 0 ? void 0 : onTabSelect(index);
                                        },
                                        onDoubleClick: function(e) {
                                            return e.preventDefault();
                                        },
                                        className: (0,clsx_m/* default */.Z)("text-sm font-medium transition-colors", isSelected ? "text-gray-800 dark:text-white" : "text-gray-600 dark:text-gray-400"),
                                        children: truncTabTitle || "Untitled"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                        onClick: function(e) {
                                            e.stopPropagation();
                                            onTabClose === null || onTabClose === void 0 ? void 0 : onTabClose(index);
                                        },
                                        className: "ml-2 rounded p-0.5 opacity-0 transition-opacity hover:bg-gray-200 group-hover:opacity-100 dark:hover:bg-gray-700",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "material-symbols-outlined text-sm text-gray-500 dark:text-gray-400",
                                            children: "close"
                                        })
                                    })
                                ]
                            }, tab.id);
                        })
                    }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h1", {
                                className: "font-semibold text-gray-800 dark:text-white",
                                children: truncatedTitle || "Untitled"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                onClick: onClose,
                                className: "rounded p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                    className: "material-symbols-outlined text-xl",
                                    children: "close"
                                })
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "flex-grow"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex items-center space-x-2",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                        onClick: rtl ? onNext : onPrev,
                        className: "rounded p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                            className: "material-symbols-outlined",
                            children: "chevron_left"
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                        onClick: rtl ? onPrev : onNext,
                        className: "rounded p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                            className: "material-symbols-outlined",
                            children: "chevron_right"
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "mx-2 h-6 w-px bg-gray-200 dark:bg-gray-700"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                        onClick: onToc,
                        className: "rounded p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                            className: "material-symbols-outlined",
                            children: "more_horiz"
                        })
                    })
                ]
            })
        ]
    });
};
var ReaderPaneFooter = function(param) {
    var _percentage = param.percentage, percentage = _percentage === void 0 ? 0 : _percentage, rtl = param.rtl;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("footer", {
        className: "border-border-light dark:border-border-dark relative flex h-14 shrink-0 items-center justify-between border-t px-6",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "flex-1"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "absolute bottom-4 left-1/2 w-full max-w-xs -translate-x-1/2 px-4",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "bg-primary/20 relative h-0.5 w-full rounded-full shadow-sm",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "bg-primary absolute h-full rounded-full transition-all duration-300",
                            style: rtl ? {
                                right: 0,
                                width: "".concat(percentage * 100, "%")
                            } : {
                                left: 0,
                                width: "".concat(percentage * 100, "%")
                            }
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "absolute top-1/2 -translate-y-1/2 transition-all duration-300",
                            style: rtl ? {
                                right: "".concat(percentage * 100, "%")
                            } : {
                                left: "".concat(percentage * 100, "%")
                            },
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: (0,clsx_m/* default */.Z)("bg-primary border-surface-light dark:border-surface-dark h-2.5 w-2.5 rounded-full border-2 shadow-sm", rtl ? "translate-x-1/2" : "-translate-x-1/2")
                            })
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                className: "text-subtle-light dark:text-subtle-dark flex-1 text-right text-sm",
                children: [
                    Math.round(percentage * 100),
                    "%"
                ]
            })
        ]
    });
};

// EXTERNAL MODULE: ./src/sync.ts
var sync = __webpack_require__(9715);
;// CONCATENATED MODULE: ./src/pages/index.tsx
// @ts-ignore






// @ts-ignore

// @ts-ignore










var SOURCE = "src";
function Index() {
    var focusedTab = (0,models/* useReaderSnapshot */.Ys)().focusedTab;
    var router = (0,next_router.useRouter)();
    var src = new URL(window.location.href).searchParams.get(SOURCE);
    var ref = (0,react.useState)(!!src), loading = ref[0], setLoading = ref[1];
    (0,hooks/* useDisablePinchZooming */.gp)();
    (0,react.useEffect)(function() {
        var src = router.query[SOURCE];
        if (!src) return;
        if (!Array.isArray(src)) src = [
            src
        ];
        Promise.all(src.map(function(s) {
            return (0,src_file/* fetchBook */.F3)(s).then(function(b) {
                models/* reader.addTab */.r1.addTab(b);
            });
        })).finally(function() {
            return setLoading(false);
        });
    }, [
        router.query
    ]);
    (0,react.useEffect)(function() {
        if ("launchQueue" in window && "LaunchParams" in window) {
            window.launchQueue.setConsumer(function(params) {
                console.log("launchQueue", params);
                if (params.files.length) {
                    Promise.all(params.files.map(function(f) {
                        return f.getFile();
                    })).then(function(files) {
                        return (0,src_file/* handleFiles */.Np)(files);
                    }).then(function(books) {
                        return books.forEach(function(b) {
                            return models/* reader.addTab */.r1.addTab(b);
                        });
                    });
                }
            });
        }
    }, []);
    (0,react.useEffect)(function() {
        router.beforePopState(function(param) {
            var url = param.url;
            if (url === "/") {
                models/* reader.clear */.r1.clear();
            }
            return true;
        });
    }, [
        router
    ]);
    var ref1;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)((head_default()), {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("title", {
                        children: (ref1 = focusedTab === null || focusedTab === void 0 ? void 0 : focusedTab.title) !== null && ref1 !== void 0 ? ref1 : "Lumen Read"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(ReaderGridView, {}),
            loading || /*#__PURE__*/ (0,jsx_runtime.jsx)(Library, {})
        ]
    });
}
var Library = function() {
    var books = (0,hooks/* useLibrary */.yX)();
    var ref;
    var covers = (0,dexie_react_hooks.useLiveQuery)(function() {
        return (ref = db.db === null || db.db === void 0 ? void 0 : db.db.covers.toArray()) !== null && ref !== void 0 ? ref : [];
    });
    var fileInputRef = (0,react.useRef)(null);
    var ref1 = (0,hooks/* useRemoteBooks */.IF)(), remoteBooks = ref1.data, mutateRemoteBooks = ref1.mutate;
    var ref2 = (0,hooks/* useRemoteFiles */.MX)(), remoteFiles = ref2.data;
    var previousRemoteBooks = (0,usePrevious/* default */.Z)(remoteBooks);
    var previousRemoteFiles = (0,usePrevious/* default */.Z)(remoteFiles);
    var ref3 = (0,react.useState)(), setLoading = ref3[1];
    var ref4 = (0,react.useState)(false), readyToSync = ref4[0], setReadyToSync = ref4[1];
    var groups = (0,models/* useReaderSnapshot */.Ys)().groups;
    (0,react.useEffect)(function() {
        if (previousRemoteFiles && remoteFiles) {
            // to remove effect dependency `books`
            db.db === null || db.db === void 0 ? void 0 : db.db.books.toArray().then(function(books) {
                if (books.length === 0) return;
                var newRemoteBooks = remoteFiles.map(function(f) {
                    return books.find(function(b) {
                        return b.name === f.name;
                    });
                });
                (0,sync/* uploadData */.xF)(newRemoteBooks);
                mutateRemoteBooks(newRemoteBooks, {
                    revalidate: false
                });
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        mutateRemoteBooks,
        remoteFiles
    ]);
    (0,react.useEffect)(function() {
        if (!previousRemoteBooks && remoteBooks) {
            db.db === null || db.db === void 0 ? void 0 : db.db.books.bulkPut(remoteBooks).then(function() {
                return setReadyToSync(true);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        remoteBooks
    ]);
    (0,react.useEffect)(function() {
        if (!remoteFiles || !readyToSync) return;
        db.db === null || db.db === void 0 ? void 0 : db.db.books.toArray().then(function() {
            var _ref = (0,_async_to_generator/* default */.Z)(function(books) {
                var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err;
                return (0,tslib_es6.__generator)(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            _state.label = 1;
                        case 1:
                            _state.trys.push([
                                1,
                                6,
                                7,
                                8
                            ]);
                            _loop = function() {
                                var remoteFile, book, file;
                                return (0,tslib_es6.__generator)(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            remoteFile = _step.value;
                                            book = books.find(function(b) {
                                                return b.name === remoteFile.name;
                                            });
                                            if (!book) return [
                                                2,
                                                "continue"
                                            ];
                                            return [
                                                4,
                                                db.db === null || db.db === void 0 ? void 0 : db.db.files.get(book.id)
                                            ];
                                        case 1:
                                            file = _state.sent();
                                            if (file) return [
                                                2,
                                                "continue"
                                            ];
                                            setLoading(book.id);
                                            return [
                                                4,
                                                sync/* dbx.filesDownload */["if"].filesDownload({
                                                    path: "/files/".concat(remoteFile.name)
                                                }).then(function(d) {
                                                    var blob = d.result.fileBlob;
                                                    return (0,src_file/* addFile */.N2)(book.id, new File([
                                                        blob
                                                    ], book.name));
                                                })
                                            ];
                                        case 2:
                                            _state.sent();
                                            setLoading(undefined);
                                            return [
                                                2
                                            ];
                                    }
                                });
                            };
                            _iterator = remoteFiles[Symbol.iterator]();
                            _state.label = 2;
                        case 2:
                            if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                3,
                                5
                            ];
                            return [
                                5,
                                (0,tslib_es6.__values)(_loop())
                            ];
                        case 3:
                            _state.sent();
                            _state.label = 4;
                        case 4:
                            _iteratorNormalCompletion = true;
                            return [
                                3,
                                2
                            ];
                        case 5:
                            return [
                                3,
                                8
                            ];
                        case 6:
                            err = _state.sent();
                            _didIteratorError = true;
                            _iteratorError = err;
                            return [
                                3,
                                8
                            ];
                        case 7:
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
                        case 8:
                            return [
                                2
                            ];
                    }
                });
            });
            return function(books) {
                return _ref.apply(this, arguments);
            };
        }());
    }, [
        readyToSync,
        remoteFiles
    ]);
    var handleToggleFavorite = function() {
        var _ref = (0,_async_to_generator/* default */.Z)(function(book) {
            return (0,tslib_es6.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            db.db === null || db.db === void 0 ? void 0 : db.db.books.update(book.id, {
                                favorite: !book.favorite
                            })
                        ];
                    case 1:
                        _state.sent();
                        return [
                            2
                        ];
                }
            });
        });
        return function handleToggleFavorite(book) {
            return _ref.apply(this, arguments);
        };
    }();
    var handleDownload = function() {
        var _ref = (0,_async_to_generator/* default */.Z)(function(book) {
            var fileRecord;
            return (0,tslib_es6.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            db.db === null || db.db === void 0 ? void 0 : db.db.files.get(book.id)
                        ];
                    case 1:
                        fileRecord = _state.sent();
                        if (fileRecord) {
                            (0,FileSaver_min.saveAs)(fileRecord.file, "".concat(book.name, ".epub"));
                        }
                        return [
                            2
                        ];
                }
            });
        });
        return function handleDownload(book) {
            return _ref.apply(this, arguments);
        };
    }();
    var handleRemove = function() {
        var _ref = (0,_async_to_generator/* default */.Z)(function(book) {
            var error;
            return (0,tslib_es6.__generator)(this, function(_state) {
                switch(_state.label){
                    case 0:
                        console.log("Attempting to remove book:", book.id, book.name);
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            5,
                            ,
                            6
                        ]);
                        return [
                            4,
                            db.db === null || db.db === void 0 ? void 0 : db.db.books["delete"](book.id)
                        ];
                    case 2:
                        _state.sent();
                        return [
                            4,
                            db.db === null || db.db === void 0 ? void 0 : db.db.files["delete"](book.id)
                        ];
                    case 3:
                        _state.sent();
                        return [
                            4,
                            db.db === null || db.db === void 0 ? void 0 : db.db.covers["delete"](book.id)
                        ];
                    case 4:
                        _state.sent();
                        console.log("Book removed successfully");
                        return [
                            3,
                            6
                        ];
                    case 5:
                        error = _state.sent();
                        console.error("Failed to remove book:", error);
                        return [
                            3,
                            6
                        ];
                    case 6:
                        return [
                            2
                        ];
                }
            });
        });
        return function handleRemove(book) {
            return _ref.apply(this, arguments);
        };
    }();
    var handleViewDetails = function(book) {
        var ref;
        // Placeholder for details view
        alert("Details for: ".concat(book.name, "\nAuthor: ").concat((ref = book.metadata) === null || ref === void 0 ? void 0 : ref.creator, "\nSize: ").concat((book.size / 1024 / 1024).toFixed(2), " MB"));
    };
    if (groups.length) return null;
    if (!books) return null;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                ref: fileInputRef,
                type: "file",
                accept: "application/epub+zip,application/epub,application/zip",
                className: "hidden",
                onChange: function(e) {
                    var files = e.target.files;
                    if (files) (0,src_file/* handleFiles */.Np)(files);
                },
                multiple: true
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(LibraryView, {
                books: books,
                covers: covers || [],
                onAddBook: function() {
                    var ref;
                    return (ref = fileInputRef.current) === null || ref === void 0 ? void 0 : ref.click();
                },
                onBookClick: function(book) {
                    return models/* reader.addTab */.r1.addTab(book);
                },
                onDrop: function(e) {
                    var bookId = e.dataTransfer.getData("text/plain");
                    var book = books.find(function(b) {
                        return b.id === bookId;
                    });
                    if (book) models/* reader.addTab */.r1.addTab(book);
                    (0,src_file/* handleFiles */.Np)(e.dataTransfer.files);
                },
                onToggleFavorite: handleToggleFavorite,
                onDownload: handleDownload,
                onRemove: handleRemove,
                onViewDetails: handleViewDetails
            })
        ]
    });
};


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [974,774,888,179], function() { return __webpack_exec__(4596); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);