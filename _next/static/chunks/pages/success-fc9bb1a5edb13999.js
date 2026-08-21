(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[2],{

/***/ 5081:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/success",
      function () {
        return __webpack_require__(4908);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 4908:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Success; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1999);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6248);
/* harmony import */ var _sync__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9715);



function Success() {
    var ref = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(3), countdown = ref[0], setCountdown = ref[1];
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function() {
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/opener
        var opener = window.opener;
        opener === null || opener === void 0 ? void 0 : opener.postMessage(_sync__WEBPACK_IMPORTED_MODULE_2__/* .OAUTH_SUCCESS_MESSAGE */ .Ok);
        var id = setInterval(function() {
            setCountdown(function(cd) {
                if (cd > 1) return cd - 1;
                clearInterval(id);
                window.close();
                return cd;
            });
        }, 1000);
    }, []);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: "flex h-full items-center justify-center text-center",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", {
                    className: "typescale-headline-large text-green-600",
                    children: "Oauth success"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                    className: "typescale-body-large text-on-surface-variant",
                    children: [
                        "This window will close in ",
                        countdown,
                        "s."
                    ]
                })
            ]
        })
    });
}


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,888,179], function() { return __webpack_exec__(5081); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);