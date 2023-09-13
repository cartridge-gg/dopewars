"use strict";
var starknet = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod2) => function __require() {
    return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
    mod2
  ));
  var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

  // node_modules/whatwg-fetch/fetch.js
  var fetch_exports = {};
  __export(fetch_exports, {
    DOMException: () => DOMException,
    Headers: () => Headers,
    Request: () => Request,
    Response: () => Response,
    fetch: () => fetch
  });
  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj);
  }
  function normalizeName(name) {
    if (typeof name !== "string") {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === "") {
      throw new TypeError('Invalid character in header field name: "' + name + '"');
    }
    return name.toLowerCase();
  }
  function normalizeValue(value) {
    if (typeof value !== "string") {
      value = String(value);
    }
    return value;
  }
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return { done: value === void 0, value };
      }
    };
    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator;
      };
    }
    return iterator;
  }
  function Headers(headers) {
    this.map = {};
    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }
  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError("Already read"));
    }
    body.bodyUsed = true;
  }
  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    });
  }
  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise;
  }
  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise;
  }
  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);
    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join("");
  }
  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0);
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer;
    }
  }
  function Body() {
    this.bodyUsed = false;
    this._initBody = function(body) {
      this.bodyUsed = this.bodyUsed;
      this._bodyInit = body;
      if (!body) {
        this._bodyText = "";
      } else if (typeof body === "string") {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }
      if (!this.headers.get("content-type")) {
        if (typeof body === "string") {
          this.headers.set("content-type", "text/plain;charset=UTF-8");
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set("content-type", this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
        }
      }
    };
    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }
        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        } else if (this._bodyFormData) {
          throw new Error("could not read FormData body as blob");
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };
      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          var isConsumed = consumed(this);
          if (isConsumed) {
            return isConsumed;
          }
          if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
            return Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            );
          } else {
            return Promise.resolve(this._bodyArrayBuffer);
          }
        } else {
          return this.blob().then(readBlobAsArrayBuffer);
        }
      };
    }
    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected;
      }
      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
      } else if (this._bodyFormData) {
        throw new Error("could not read FormData body as text");
      } else {
        return Promise.resolve(this._bodyText);
      }
    };
    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode);
      };
    }
    this.json = function() {
      return this.text().then(JSON.parse);
    };
    return this;
  }
  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method;
  }
  function Request(input, options) {
    if (!(this instanceof Request)) {
      throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
    }
    options = options || {};
    var body = options.body;
    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError("Already read");
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }
    this.credentials = options.credentials || this.credentials || "same-origin";
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || "GET");
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;
    if ((this.method === "GET" || this.method === "HEAD") && body) {
      throw new TypeError("Body not allowed for GET or HEAD requests");
    }
    this._initBody(body);
    if (this.method === "GET" || this.method === "HEAD") {
      if (options.cache === "no-store" || options.cache === "no-cache") {
        var reParamSearch = /([?&])_=[^&]*/;
        if (reParamSearch.test(this.url)) {
          this.url = this.url.replace(reParamSearch, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
        } else {
          var reQueryString = /\?/;
          this.url += (reQueryString.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
        }
      }
    }
  }
  function decode(body) {
    var form = new FormData();
    body.trim().split("&").forEach(function(bytes2) {
      if (bytes2) {
        var split2 = bytes2.split("=");
        var name = split2.shift().replace(/\+/g, " ");
        var value = split2.join("=").replace(/\+/g, " ");
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }
  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
    preProcessedHeaders.split("\r").map(function(header) {
      return header.indexOf("\n") === 0 ? header.substr(1, header.length) : header;
    }).forEach(function(line) {
      var parts = line.split(":");
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(":").trim();
        headers.append(key, value);
      }
    });
    return headers;
  }
  function Response(bodyInit, options) {
    if (!(this instanceof Response)) {
      throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
    }
    if (!options) {
      options = {};
    }
    this.type = "default";
    this.status = options.status === void 0 ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = options.statusText === void 0 ? "" : "" + options.statusText;
    this.headers = new Headers(options.headers);
    this.url = options.url || "";
    this._initBody(bodyInit);
  }
  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);
      if (request.signal && request.signal.aborted) {
        return reject(new DOMException("Aborted", "AbortError"));
      }
      var xhr = new XMLHttpRequest();
      function abortXhr() {
        xhr.abort();
      }
      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || "")
        };
        options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
        var body = "response" in xhr ? xhr.response : xhr.responseText;
        setTimeout(function() {
          resolve(new Response(body, options));
        }, 0);
      };
      xhr.onerror = function() {
        setTimeout(function() {
          reject(new TypeError("Network request failed"));
        }, 0);
      };
      xhr.ontimeout = function() {
        setTimeout(function() {
          reject(new TypeError("Network request failed"));
        }, 0);
      };
      xhr.onabort = function() {
        setTimeout(function() {
          reject(new DOMException("Aborted", "AbortError"));
        }, 0);
      };
      function fixUrl(url) {
        try {
          return url === "" && global2.location.href ? global2.location.href : url;
        } catch (e) {
          return url;
        }
      }
      xhr.open(request.method, fixUrl(request.url), true);
      if (request.credentials === "include") {
        xhr.withCredentials = true;
      } else if (request.credentials === "omit") {
        xhr.withCredentials = false;
      }
      if ("responseType" in xhr) {
        if (support.blob) {
          xhr.responseType = "blob";
        } else if (support.arrayBuffer && request.headers.get("Content-Type") && request.headers.get("Content-Type").indexOf("application/octet-stream") !== -1) {
          xhr.responseType = "arraybuffer";
        }
      }
      if (init && typeof init.headers === "object" && !(init.headers instanceof Headers)) {
        Object.getOwnPropertyNames(init.headers).forEach(function(name) {
          xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
        });
      } else {
        request.headers.forEach(function(value, name) {
          xhr.setRequestHeader(name, value);
        });
      }
      if (request.signal) {
        request.signal.addEventListener("abort", abortXhr);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            request.signal.removeEventListener("abort", abortXhr);
          }
        };
      }
      xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
    });
  }
  var global2, support, viewClasses, isArrayBufferView, methods, redirectStatuses, DOMException;
  var init_fetch = __esm({
    "node_modules/whatwg-fetch/fetch.js"() {
      global2 = typeof globalThis !== "undefined" && globalThis || typeof self !== "undefined" && self || typeof global2 !== "undefined" && global2;
      support = {
        searchParams: "URLSearchParams" in global2,
        iterable: "Symbol" in global2 && "iterator" in Symbol,
        blob: "FileReader" in global2 && "Blob" in global2 && function() {
          try {
            new Blob();
            return true;
          } catch (e) {
            return false;
          }
        }(),
        formData: "FormData" in global2,
        arrayBuffer: "ArrayBuffer" in global2
      };
      if (support.arrayBuffer) {
        viewClasses = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ];
        isArrayBufferView = ArrayBuffer.isView || function(obj) {
          return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
        };
      }
      Headers.prototype.append = function(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ", " + value : value;
      };
      Headers.prototype["delete"] = function(name) {
        delete this.map[normalizeName(name)];
      };
      Headers.prototype.get = function(name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null;
      };
      Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name));
      };
      Headers.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
      };
      Headers.prototype.forEach = function(callback, thisArg) {
        for (var name in this.map) {
          if (this.map.hasOwnProperty(name)) {
            callback.call(thisArg, this.map[name], name, this);
          }
        }
      };
      Headers.prototype.keys = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push(name);
        });
        return iteratorFor(items);
      };
      Headers.prototype.values = function() {
        var items = [];
        this.forEach(function(value) {
          items.push(value);
        });
        return iteratorFor(items);
      };
      Headers.prototype.entries = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push([name, value]);
        });
        return iteratorFor(items);
      };
      if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
      }
      methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
      Request.prototype.clone = function() {
        return new Request(this, { body: this._bodyInit });
      };
      Body.call(Request.prototype);
      Body.call(Response.prototype);
      Response.prototype.clone = function() {
        return new Response(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers(this.headers),
          url: this.url
        });
      };
      Response.error = function() {
        var response = new Response(null, { status: 0, statusText: "" });
        response.type = "error";
        return response;
      };
      redirectStatuses = [301, 302, 303, 307, 308];
      Response.redirect = function(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError("Invalid status code");
        }
        return new Response(null, { status, headers: { location: url } });
      };
      DOMException = global2.DOMException;
      try {
        new DOMException();
      } catch (err2) {
        DOMException = function(message, name) {
          this.message = message;
          this.name = name;
          var error = Error(message);
          this.stack = error.stack;
        };
        DOMException.prototype = Object.create(Error.prototype);
        DOMException.prototype.constructor = DOMException;
      }
      fetch.polyfill = true;
      if (!global2.fetch) {
        global2.fetch = fetch;
        global2.Headers = Headers;
        global2.Request = Request;
        global2.Response = Response;
      }
    }
  });

  // node_modules/isomorphic-fetch/fetch-npm-browserify.js
  var require_fetch_npm_browserify = __commonJS({
    "node_modules/isomorphic-fetch/fetch-npm-browserify.js"(exports, module) {
      init_fetch();
      module.exports = self.fetch.bind(self);
    }
  });

  // node_modules/url-join/lib/url-join.js
  var require_url_join = __commonJS({
    "node_modules/url-join/lib/url-join.js"(exports, module) {
      (function(name, context, definition) {
        if (typeof module !== "undefined" && module.exports)
          module.exports = definition();
        else if (typeof define === "function" && define.amd)
          define(definition);
        else
          context[name] = definition();
      })("urljoin", exports, function() {
        function normalize(strArray) {
          var resultArray = [];
          if (strArray.length === 0) {
            return "";
          }
          if (typeof strArray[0] !== "string") {
            throw new TypeError("Url must be a string. Received " + strArray[0]);
          }
          if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
            var first = strArray.shift();
            strArray[0] = first + strArray[0];
          }
          if (strArray[0].match(/^file:\/\/\//)) {
            strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1:///");
          } else {
            strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1://");
          }
          for (var i = 0; i < strArray.length; i++) {
            var component = strArray[i];
            if (typeof component !== "string") {
              throw new TypeError("Url must be a string. Received " + component);
            }
            if (component === "") {
              continue;
            }
            if (i > 0) {
              component = component.replace(/^[\/]+/, "");
            }
            if (i < strArray.length - 1) {
              component = component.replace(/[\/]+$/, "");
            } else {
              component = component.replace(/[\/]+$/, "/");
            }
            resultArray.push(component);
          }
          var str = resultArray.join("/");
          str = str.replace(/\/(\?|&|#[^!])/g, "$1");
          var parts = str.split("?");
          str = parts.shift() + (parts.length > 0 ? "?" : "") + parts.join("&");
          return str;
        }
        return function() {
          var input;
          if (typeof arguments[0] === "object") {
            input = arguments[0];
          } else {
            input = [].slice.call(arguments);
          }
          return normalize(input);
        };
      });
    }
  });

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Account: () => Account,
    AccountInterface: () => AccountInterface,
    BlockStatus: () => BlockStatus,
    BlockTag: () => BlockTag,
    CairoCustomEnum: () => CairoCustomEnum,
    CairoOption: () => CairoOption,
    CairoOptionVariant: () => CairoOptionVariant,
    CairoResult: () => CairoResult,
    CairoResultVariant: () => CairoResultVariant,
    CallData: () => CallData,
    Contract: () => Contract,
    ContractFactory: () => ContractFactory,
    ContractInterface: () => ContractInterface,
    CustomError: () => CustomError,
    EntryPointType: () => EntryPointType,
    GatewayError: () => GatewayError,
    HttpError: () => HttpError,
    LibraryError: () => LibraryError,
    Litteral: () => Litteral,
    Provider: () => Provider,
    ProviderInterface: () => ProviderInterface,
    RPC: () => rpc_exports,
    RpcProvider: () => RpcProvider,
    SIMULATION_FLAG: () => SIMULATION_FLAG,
    Sequencer: () => sequencer_exports,
    SequencerProvider: () => SequencerProvider,
    Signer: () => Signer,
    SignerInterface: () => SignerInterface,
    TransactionExecutionStatus: () => TransactionExecutionStatus,
    TransactionFinalityStatus: () => TransactionFinalityStatus,
    TransactionStatus: () => TransactionStatus,
    TransactionType: () => TransactionType,
    Uint: () => Uint,
    ValidateType: () => ValidateType,
    addAddressPadding: () => addAddressPadding,
    buildUrl: () => buildUrl,
    cairo: () => cairo_exports,
    constants: () => constants_exports,
    contractClassResponseToLegacyCompiledContract: () => contractClassResponseToLegacyCompiledContract,
    defaultProvider: () => defaultProvider,
    ec: () => ec_exports,
    encode: () => encode_exports,
    events: () => events_exports,
    extractContractHashes: () => extractContractHashes,
    fixProto: () => fixProto,
    fixStack: () => fixStack,
    getCalldata: () => getCalldata,
    getChecksumAddress: () => getChecksumAddress,
    hash: () => hash_exports,
    isSierra: () => isSierra,
    isUrl: () => isUrl,
    json: () => json_exports,
    merkle: () => merkle_exports,
    num: () => num_exports,
    number: () => number2,
    parseUDCEvent: () => parseUDCEvent,
    provider: () => provider_exports,
    selector: () => selector_exports,
    shortString: () => shortString_exports,
    splitArgsAndOptions: () => splitArgsAndOptions,
    stark: () => stark_exports,
    starknetId: () => starknetId_exports,
    transaction: () => transaction_exports,
    typedData: () => typedData_exports,
    types: () => types_exports,
    uint256: () => uint256_exports,
    validateAndParseAddress: () => validateAndParseAddress,
    validateChecksumAddress: () => validateChecksumAddress
  });

  // src/constants.ts
  var constants_exports = {};
  __export(constants_exports, {
    API_VERSION: () => API_VERSION,
    BN_FEE_TRANSACTION_VERSION_1: () => BN_FEE_TRANSACTION_VERSION_1,
    BN_FEE_TRANSACTION_VERSION_2: () => BN_FEE_TRANSACTION_VERSION_2,
    BN_TRANSACTION_VERSION_1: () => BN_TRANSACTION_VERSION_1,
    BN_TRANSACTION_VERSION_2: () => BN_TRANSACTION_VERSION_2,
    BaseUrl: () => BaseUrl,
    HEX_STR_TRANSACTION_VERSION_1: () => HEX_STR_TRANSACTION_VERSION_1,
    HEX_STR_TRANSACTION_VERSION_2: () => HEX_STR_TRANSACTION_VERSION_2,
    IS_BROWSER: () => IS_BROWSER,
    MASK_250: () => MASK_250,
    MASK_251: () => MASK_251,
    NetworkName: () => NetworkName,
    StarknetChainId: () => StarknetChainId,
    TEXT_TO_FELT_MAX_LEN: () => TEXT_TO_FELT_MAX_LEN,
    TransactionHashPrefix: () => TransactionHashPrefix,
    UDC: () => UDC,
    ZERO: () => ZERO
  });

  // src/utils/encode.ts
  var encode_exports = {};
  __export(encode_exports, {
    IS_BROWSER: () => IS_BROWSER,
    addHexPrefix: () => addHexPrefix,
    arrayBufferToString: () => arrayBufferToString,
    atobUniversal: () => atobUniversal,
    btoaUniversal: () => btoaUniversal,
    buf2hex: () => buf2hex,
    calcByteLength: () => calcByteLength,
    padLeft: () => padLeft,
    pascalToSnake: () => pascalToSnake,
    removeHexPrefix: () => removeHexPrefix,
    sanitizeBytes: () => sanitizeBytes,
    sanitizeHex: () => sanitizeHex,
    stringToArrayBuffer: () => stringToArrayBuffer,
    utf8ToArray: () => utf8ToArray
  });
  var IS_BROWSER = typeof window !== "undefined";
  var STRING_ZERO = "0";
  function arrayBufferToString(array) {
    return new Uint8Array(array).reduce((data, byte) => data + String.fromCharCode(byte), "");
  }
  function stringToArrayBuffer(s) {
    return Uint8Array.from(s, (c) => c.charCodeAt(0));
  }
  function atobUniversal(a) {
    return IS_BROWSER ? stringToArrayBuffer(atob(a)) : Buffer.from(a, "base64");
  }
  function btoaUniversal(b) {
    return IS_BROWSER ? btoa(arrayBufferToString(b)) : Buffer.from(b).toString("base64");
  }
  function buf2hex(buffer) {
    return [...buffer].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
  function removeHexPrefix(hex) {
    return hex.replace(/^0x/i, "");
  }
  function addHexPrefix(hex) {
    return `0x${removeHexPrefix(hex)}`;
  }
  function padString(str, length, left, padding = STRING_ZERO) {
    const diff = length - str.length;
    let result = str;
    if (diff > 0) {
      const pad = padding.repeat(diff);
      result = left ? pad + str : str + pad;
    }
    return result;
  }
  function padLeft(str, length, padding = STRING_ZERO) {
    return padString(str, length, true, padding);
  }
  function calcByteLength(str, byteSize = 8) {
    const { length } = str;
    const remainder = length % byteSize;
    return remainder ? (length - remainder) / byteSize * byteSize + byteSize : length;
  }
  function sanitizeBytes(str, byteSize = 8, padding = STRING_ZERO) {
    return padLeft(str, calcByteLength(str, byteSize), padding);
  }
  function sanitizeHex(hex) {
    hex = removeHexPrefix(hex);
    hex = sanitizeBytes(hex, 2);
    if (hex) {
      hex = addHexPrefix(hex);
    }
    return hex;
  }
  function utf8ToArray(str) {
    return new TextEncoder().encode(str);
  }
  var pascalToSnake = (text) => /[a-z]/.test(text) ? text.split(/(?=[A-Z])/).join("_").toUpperCase() : text;

  // src/constants.ts
  var TEXT_TO_FELT_MAX_LEN = 31;
  var HEX_STR_TRANSACTION_VERSION_1 = "0x1";
  var HEX_STR_TRANSACTION_VERSION_2 = "0x2";
  var BN_TRANSACTION_VERSION_1 = 1n;
  var BN_TRANSACTION_VERSION_2 = 2n;
  var BN_FEE_TRANSACTION_VERSION_1 = 2n ** 128n + BN_TRANSACTION_VERSION_1;
  var BN_FEE_TRANSACTION_VERSION_2 = 2n ** 128n + BN_TRANSACTION_VERSION_2;
  var ZERO = 0n;
  var MASK_250 = 2n ** 250n - 1n;
  var MASK_251 = 2n ** 251n;
  var API_VERSION = ZERO;
  var BaseUrl = /* @__PURE__ */ ((BaseUrl2) => {
    BaseUrl2["SN_MAIN"] = "https://alpha-mainnet.starknet.io";
    BaseUrl2["SN_GOERLI"] = "https://alpha4.starknet.io";
    BaseUrl2["SN_GOERLI2"] = "https://alpha4-2.starknet.io";
    return BaseUrl2;
  })(BaseUrl || {});
  var NetworkName = /* @__PURE__ */ ((NetworkName2) => {
    NetworkName2["SN_MAIN"] = "SN_MAIN";
    NetworkName2["SN_GOERLI"] = "SN_GOERLI";
    NetworkName2["SN_GOERLI2"] = "SN_GOERLI2";
    return NetworkName2;
  })(NetworkName || {});
  var StarknetChainId = /* @__PURE__ */ ((StarknetChainId4) => {
    StarknetChainId4["SN_MAIN"] = "0x534e5f4d41494e";
    StarknetChainId4["SN_GOERLI"] = "0x534e5f474f45524c49";
    StarknetChainId4["SN_GOERLI2"] = "0x534e5f474f45524c4932";
    return StarknetChainId4;
  })(StarknetChainId || {});
  var TransactionHashPrefix = /* @__PURE__ */ ((TransactionHashPrefix2) => {
    TransactionHashPrefix2["DECLARE"] = "0x6465636c617265";
    TransactionHashPrefix2["DEPLOY"] = "0x6465706c6f79";
    TransactionHashPrefix2["DEPLOY_ACCOUNT"] = "0x6465706c6f795f6163636f756e74";
    TransactionHashPrefix2["INVOKE"] = "0x696e766f6b65";
    TransactionHashPrefix2["L1_HANDLER"] = "0x6c315f68616e646c6572";
    return TransactionHashPrefix2;
  })(TransactionHashPrefix || {});
  var UDC = {
    ADDRESS: "0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf",
    ENTRYPOINT: "deployContract"
  };

  // src/types/index.ts
  var types_exports = {};
  __export(types_exports, {
    BlockStatus: () => BlockStatus,
    BlockTag: () => BlockTag,
    EntryPointType: () => EntryPointType,
    Litteral: () => Litteral,
    RPC: () => rpc_exports,
    SIMULATION_FLAG: () => SIMULATION_FLAG,
    Sequencer: () => sequencer_exports,
    TransactionExecutionStatus: () => TransactionExecutionStatus,
    TransactionFinalityStatus: () => TransactionFinalityStatus,
    TransactionStatus: () => TransactionStatus,
    TransactionType: () => TransactionType,
    Uint: () => Uint,
    ValidateType: () => ValidateType
  });

  // src/types/account.ts
  var SIMULATION_FLAG = /* @__PURE__ */ ((SIMULATION_FLAG3) => {
    SIMULATION_FLAG3["SKIP_VALIDATE"] = "SKIP_VALIDATE";
    SIMULATION_FLAG3["SKIP_EXECUTE"] = "SKIP_EXECUTE";
    return SIMULATION_FLAG3;
  })(SIMULATION_FLAG || {});

  // src/types/calldata.ts
  var ValidateType = /* @__PURE__ */ ((ValidateType2) => {
    ValidateType2["DEPLOY"] = "DEPLOY";
    ValidateType2["CALL"] = "CALL";
    ValidateType2["INVOKE"] = "INVOKE";
    return ValidateType2;
  })(ValidateType || {});
  var Uint = /* @__PURE__ */ ((Uint2) => {
    Uint2["u8"] = "core::integer::u8";
    Uint2["u16"] = "core::integer::u16";
    Uint2["u32"] = "core::integer::u32";
    Uint2["u64"] = "core::integer::u64";
    Uint2["u128"] = "core::integer::u128";
    Uint2["u256"] = "core::integer::u256";
    return Uint2;
  })(Uint || {});
  var Litteral = /* @__PURE__ */ ((Litteral2) => {
    Litteral2["ClassHash"] = "core::starknet::class_hash::ClassHash";
    Litteral2["ContractAddress"] = "core::starknet::contract_address::ContractAddress";
    return Litteral2;
  })(Litteral || {});

  // src/types/lib/contract/index.ts
  var EntryPointType = /* @__PURE__ */ ((EntryPointType2) => {
    EntryPointType2["EXTERNAL"] = "EXTERNAL";
    EntryPointType2["L1_HANDLER"] = "L1_HANDLER";
    EntryPointType2["CONSTRUCTOR"] = "CONSTRUCTOR";
    return EntryPointType2;
  })(EntryPointType || {});

  // src/types/lib/index.ts
  var TransactionType = /* @__PURE__ */ ((TransactionType3) => {
    TransactionType3["DECLARE"] = "DECLARE";
    TransactionType3["DEPLOY"] = "DEPLOY";
    TransactionType3["DEPLOY_ACCOUNT"] = "DEPLOY_ACCOUNT";
    TransactionType3["INVOKE"] = "INVOKE_FUNCTION";
    return TransactionType3;
  })(TransactionType || {});
  var TransactionStatus = /* @__PURE__ */ ((TransactionStatus2) => {
    TransactionStatus2["NOT_RECEIVED"] = "NOT_RECEIVED";
    TransactionStatus2["RECEIVED"] = "RECEIVED";
    TransactionStatus2["ACCEPTED_ON_L2"] = "ACCEPTED_ON_L2";
    TransactionStatus2["ACCEPTED_ON_L1"] = "ACCEPTED_ON_L1";
    TransactionStatus2["REJECTED"] = "REJECTED";
    TransactionStatus2["REVERTED"] = "REVERTED";
    return TransactionStatus2;
  })(TransactionStatus || {});
  var TransactionFinalityStatus = /* @__PURE__ */ ((TransactionFinalityStatus3) => {
    TransactionFinalityStatus3["NOT_RECEIVED"] = "NOT_RECEIVED";
    TransactionFinalityStatus3["RECEIVED"] = "RECEIVED";
    TransactionFinalityStatus3["ACCEPTED_ON_L2"] = "ACCEPTED_ON_L2";
    TransactionFinalityStatus3["ACCEPTED_ON_L1"] = "ACCEPTED_ON_L1";
    return TransactionFinalityStatus3;
  })(TransactionFinalityStatus || {});
  var TransactionExecutionStatus = /* @__PURE__ */ ((TransactionExecutionStatus3) => {
    TransactionExecutionStatus3["REJECTED"] = "REJECTED";
    TransactionExecutionStatus3["REVERTED"] = "REVERTED";
    TransactionExecutionStatus3["SUCCEEDED"] = "SUCCEEDED";
    return TransactionExecutionStatus3;
  })(TransactionExecutionStatus || {});
  var BlockStatus = /* @__PURE__ */ ((BlockStatus2) => {
    BlockStatus2["PENDING"] = "PENDING";
    BlockStatus2["ACCEPTED_ON_L1"] = "ACCEPTED_ON_L1";
    BlockStatus2["ACCEPTED_ON_L2"] = "ACCEPTED_ON_L2";
    BlockStatus2["REJECTED"] = "REJECTED";
    return BlockStatus2;
  })(BlockStatus || {});
  var BlockTag = /* @__PURE__ */ ((BlockTag2) => {
    BlockTag2["pending"] = "pending";
    BlockTag2["latest"] = "latest";
    return BlockTag2;
  })(BlockTag || {});

  // src/types/api/rpc.ts
  var rpc_exports = {};
  __export(rpc_exports, {
    SimulationFlag: () => SimulationFlag,
    TransactionExecutionStatus: () => TransactionExecutionStatus2,
    TransactionFinalityStatus: () => TransactionFinalityStatus2,
    TransactionType: () => TransactionType2
  });

  // src/types/api/openrpc.ts
  var TXN_TYPE = /* @__PURE__ */ ((TXN_TYPE2) => {
    TXN_TYPE2["DECLARE"] = "DECLARE";
    TXN_TYPE2["DEPLOY"] = "DEPLOY";
    TXN_TYPE2["DEPLOY_ACCOUNT"] = "DEPLOY_ACCOUNT";
    TXN_TYPE2["INVOKE"] = "INVOKE";
    TXN_TYPE2["L1_HANDLER"] = "L1_HANDLER";
    return TXN_TYPE2;
  })(TXN_TYPE || {});
  var TXN_FINALITY_STATUS = /* @__PURE__ */ ((TXN_FINALITY_STATUS2) => {
    TXN_FINALITY_STATUS2["ACCEPTED_ON_L2"] = "ACCEPTED_ON_L2";
    TXN_FINALITY_STATUS2["ACCEPTED_ON_L1"] = "ACCEPTED_ON_L1";
    return TXN_FINALITY_STATUS2;
  })(TXN_FINALITY_STATUS || {});
  var TXN_EXECUTION_STATUS = /* @__PURE__ */ ((TXN_EXECUTION_STATUS2) => {
    TXN_EXECUTION_STATUS2["SUCCEEDED"] = "SUCCEEDED";
    TXN_EXECUTION_STATUS2["REVERTED"] = "REVERTED";
    return TXN_EXECUTION_STATUS2;
  })(TXN_EXECUTION_STATUS || {});
  var SIMULATION_FLAG2 = /* @__PURE__ */ ((SIMULATION_FLAG3) => {
    SIMULATION_FLAG3["SKIP_VALIDATE"] = "SKIP_VALIDATE";
    SIMULATION_FLAG3["SKIP_FEE_CHARGE"] = "SKIP_FEE_CHARGE";
    return SIMULATION_FLAG3;
  })(SIMULATION_FLAG2 || {});

  // src/types/api/rpc.ts
  var TransactionType2 = TXN_TYPE;
  var SimulationFlag = SIMULATION_FLAG2;
  var TransactionFinalityStatus2 = TXN_FINALITY_STATUS;
  var TransactionExecutionStatus2 = TXN_EXECUTION_STATUS;

  // src/types/api/sequencer.ts
  var sequencer_exports = {};

  // src/utils/assert.ts
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failure");
    }
  }

  // src/utils/num.ts
  var num_exports = {};
  __export(num_exports, {
    assertInRange: () => assertInRange,
    bigNumberishArrayToDecimalStringArray: () => bigNumberishArrayToDecimalStringArray,
    bigNumberishArrayToHexadecimalStringArray: () => bigNumberishArrayToHexadecimalStringArray,
    cleanHex: () => cleanHex,
    getDecimalString: () => getDecimalString,
    getHexString: () => getHexString,
    getHexStringArray: () => getHexStringArray,
    hexToBytes: () => hexToBytes2,
    hexToDecimalString: () => hexToDecimalString,
    isBigInt: () => isBigInt,
    isHex: () => isHex,
    isStringWholeNumber: () => isStringWholeNumber,
    toBigInt: () => toBigInt,
    toCairoBool: () => toCairoBool,
    toHex: () => toHex,
    toHexString: () => toHexString,
    toStorageKey: () => toStorageKey
  });

  // node_modules/@noble/curves/esm/abstract/utils.js
  var utils_exports = {};
  __export(utils_exports, {
    bitGet: () => bitGet,
    bitLen: () => bitLen,
    bitMask: () => bitMask,
    bitSet: () => bitSet,
    bytesToHex: () => bytesToHex,
    bytesToNumberBE: () => bytesToNumberBE,
    bytesToNumberLE: () => bytesToNumberLE,
    concatBytes: () => concatBytes,
    createHmacDrbg: () => createHmacDrbg,
    ensureBytes: () => ensureBytes,
    equalBytes: () => equalBytes,
    hexToBytes: () => hexToBytes,
    hexToNumber: () => hexToNumber,
    numberToBytesBE: () => numberToBytesBE,
    numberToBytesLE: () => numberToBytesLE,
    numberToHexUnpadded: () => numberToHexUnpadded,
    numberToVarBytesBE: () => numberToVarBytesBE,
    utf8ToBytes: () => utf8ToBytes,
    validateObject: () => validateObject
  });
  var _0n = BigInt(0);
  var _1n = BigInt(1);
  var _2n = BigInt(2);
  var u8a = (a) => a instanceof Uint8Array;
  var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
  function bytesToHex(bytes2) {
    if (!u8a(bytes2))
      throw new Error("Uint8Array expected");
    let hex = "";
    for (let i = 0; i < bytes2.length; i++) {
      hex += hexes[bytes2[i]];
    }
    return hex;
  }
  function numberToHexUnpadded(num) {
    const hex = num.toString(16);
    return hex.length & 1 ? `0${hex}` : hex;
  }
  function hexToNumber(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    return BigInt(hex === "" ? "0" : `0x${hex}`);
  }
  function hexToBytes(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    const len = hex.length;
    if (len % 2)
      throw new Error("padded hex string expected, got unpadded hex of length " + len);
    const array = new Uint8Array(len / 2);
    for (let i = 0; i < array.length; i++) {
      const j = i * 2;
      const hexByte = hex.slice(j, j + 2);
      const byte = Number.parseInt(hexByte, 16);
      if (Number.isNaN(byte) || byte < 0)
        throw new Error("Invalid byte sequence");
      array[i] = byte;
    }
    return array;
  }
  function bytesToNumberBE(bytes2) {
    return hexToNumber(bytesToHex(bytes2));
  }
  function bytesToNumberLE(bytes2) {
    if (!u8a(bytes2))
      throw new Error("Uint8Array expected");
    return hexToNumber(bytesToHex(Uint8Array.from(bytes2).reverse()));
  }
  function numberToBytesBE(n, len) {
    return hexToBytes(n.toString(16).padStart(len * 2, "0"));
  }
  function numberToBytesLE(n, len) {
    return numberToBytesBE(n, len).reverse();
  }
  function numberToVarBytesBE(n) {
    return hexToBytes(numberToHexUnpadded(n));
  }
  function ensureBytes(title, hex, expectedLength) {
    let res;
    if (typeof hex === "string") {
      try {
        res = hexToBytes(hex);
      } catch (e) {
        throw new Error(`${title} must be valid hex string, got "${hex}". Cause: ${e}`);
      }
    } else if (u8a(hex)) {
      res = Uint8Array.from(hex);
    } else {
      throw new Error(`${title} must be hex string or Uint8Array`);
    }
    const len = res.length;
    if (typeof expectedLength === "number" && len !== expectedLength)
      throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
    return res;
  }
  function concatBytes(...arrays) {
    const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
    let pad = 0;
    arrays.forEach((a) => {
      if (!u8a(a))
        throw new Error("Uint8Array expected");
      r.set(a, pad);
      pad += a.length;
    });
    return r;
  }
  function equalBytes(b1, b2) {
    if (b1.length !== b2.length)
      return false;
    for (let i = 0; i < b1.length; i++)
      if (b1[i] !== b2[i])
        return false;
    return true;
  }
  function utf8ToBytes(str) {
    if (typeof str !== "string")
      throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str));
  }
  function bitLen(n) {
    let len;
    for (len = 0; n > _0n; n >>= _1n, len += 1)
      ;
    return len;
  }
  function bitGet(n, pos) {
    return n >> BigInt(pos) & _1n;
  }
  var bitSet = (n, pos, value) => {
    return n | (value ? _1n : _0n) << BigInt(pos);
  };
  var bitMask = (n) => (_2n << BigInt(n - 1)) - _1n;
  var u8n = (data) => new Uint8Array(data);
  var u8fr = (arr) => Uint8Array.from(arr);
  function createHmacDrbg(hashLen, qByteLen, hmacFn) {
    if (typeof hashLen !== "number" || hashLen < 2)
      throw new Error("hashLen must be a number");
    if (typeof qByteLen !== "number" || qByteLen < 2)
      throw new Error("qByteLen must be a number");
    if (typeof hmacFn !== "function")
      throw new Error("hmacFn must be a function");
    let v = u8n(hashLen);
    let k = u8n(hashLen);
    let i = 0;
    const reset = () => {
      v.fill(1);
      k.fill(0);
      i = 0;
    };
    const h = (...b) => hmacFn(k, v, ...b);
    const reseed = (seed = u8n()) => {
      k = h(u8fr([0]), seed);
      v = h();
      if (seed.length === 0)
        return;
      k = h(u8fr([1]), seed);
      v = h();
    };
    const gen2 = () => {
      if (i++ >= 1e3)
        throw new Error("drbg: tried 1000 values");
      let len = 0;
      const out = [];
      while (len < qByteLen) {
        v = h();
        const sl = v.slice();
        out.push(sl);
        len += v.length;
      }
      return concatBytes(...out);
    };
    const genUntil = (seed, pred) => {
      reset();
      reseed(seed);
      let res = void 0;
      while (!(res = pred(gen2())))
        reseed();
      reset();
      return res;
    };
    return genUntil;
  }
  var validatorFns = {
    bigint: (val) => typeof val === "bigint",
    function: (val) => typeof val === "function",
    boolean: (val) => typeof val === "boolean",
    string: (val) => typeof val === "string",
    stringOrUint8Array: (val) => typeof val === "string" || val instanceof Uint8Array,
    isSafeInteger: (val) => Number.isSafeInteger(val),
    array: (val) => Array.isArray(val),
    field: (val, object) => object.Fp.isValid(val),
    hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
  };
  function validateObject(object, validators, optValidators = {}) {
    const checkField = (fieldName, type, isOptional) => {
      const checkVal = validatorFns[type];
      if (typeof checkVal !== "function")
        throw new Error(`Invalid validator "${type}", expected function`);
      const val = object[fieldName];
      if (isOptional && val === void 0)
        return;
      if (!checkVal(val, object)) {
        throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type}`);
      }
    };
    for (const [fieldName, type] of Object.entries(validators))
      checkField(fieldName, type, false);
    for (const [fieldName, type] of Object.entries(optValidators))
      checkField(fieldName, type, true);
    return object;
  }

  // src/utils/num.ts
  function isHex(hex) {
    return /^0x[0-9a-f]*$/i.test(hex);
  }
  function toBigInt(value) {
    return BigInt(value);
  }
  function isBigInt(value) {
    return typeof value === "bigint";
  }
  function toHex(number3) {
    return addHexPrefix(toBigInt(number3).toString(16));
  }
  var toHexString = toHex;
  function toStorageKey(number3) {
    const res = addHexPrefix(toBigInt(number3).toString(16).padStart(64, "0"));
    return res;
  }
  function hexToDecimalString(hex) {
    return BigInt(addHexPrefix(hex)).toString(10);
  }
  var cleanHex = (hex) => hex.toLowerCase().replace(/^(0x)0+/, "$1");
  function assertInRange(input, lowerBound, upperBound, inputName = "") {
    const messageSuffix = inputName === "" ? "invalid length" : `invalid ${inputName} length`;
    const inputBigInt = BigInt(input);
    const lowerBoundBigInt = BigInt(lowerBound);
    const upperBoundBigInt = BigInt(upperBound);
    assert(
      inputBigInt >= lowerBoundBigInt && inputBigInt <= upperBoundBigInt,
      `Message not signable, ${messageSuffix}.`
    );
  }
  function bigNumberishArrayToDecimalStringArray(rawCalldata) {
    return rawCalldata.map((x) => toBigInt(x).toString(10));
  }
  function bigNumberishArrayToHexadecimalStringArray(rawCalldata) {
    return rawCalldata.map((x) => toHex(x));
  }
  var isStringWholeNumber = (value) => /^\d+$/.test(value);
  function getDecimalString(value) {
    if (isHex(value)) {
      return hexToDecimalString(value);
    }
    if (isStringWholeNumber(value)) {
      return value;
    }
    throw new Error(`${value} need to be hex-string or whole-number-string`);
  }
  function getHexString(value) {
    if (isHex(value)) {
      return value;
    }
    if (isStringWholeNumber(value)) {
      return toHexString(value);
    }
    throw new Error(`${value} need to be hex-string or whole-number-string`);
  }
  function getHexStringArray(value) {
    return value.map((el) => getHexString(el));
  }
  var toCairoBool = (value) => (+value).toString();
  function hexToBytes2(value) {
    if (!isHex(value))
      throw new Error(`${value} need to be a hex-string`);
    let adaptedValue = removeHexPrefix(value);
    if (adaptedValue.length % 2 !== 0) {
      adaptedValue = `0${adaptedValue}`;
    }
    return hexToBytes(adaptedValue);
  }

  // src/utils/selector.ts
  var selector_exports = {};
  __export(selector_exports, {
    getSelector: () => getSelector,
    getSelectorFromName: () => getSelectorFromName,
    keccakBn: () => keccakBn,
    starknetKeccak: () => starknetKeccak
  });

  // node_modules/@scure/starknet/lib/esm/index.js
  var esm_exports = {};
  __export(esm_exports, {
    CURVE: () => CURVE,
    Fp251: () => Fp251,
    MAX_VALUE: () => MAX_VALUE,
    ProjectivePoint: () => ProjectivePoint,
    Signature: () => Signature,
    _poseidonMDS: () => _poseidonMDS,
    _starkCurve: () => _starkCurve,
    computeHashOnElements: () => computeHashOnElements,
    ethSigToPrivate: () => ethSigToPrivate,
    getAccountPath: () => getAccountPath,
    getPublicKey: () => getPublicKey,
    getSharedSecret: () => getSharedSecret,
    getStarkKey: () => getStarkKey,
    grindKey: () => grindKey,
    keccak: () => keccak,
    pedersen: () => pedersen,
    poseidonBasic: () => poseidonBasic,
    poseidonCreate: () => poseidonCreate,
    poseidonHash: () => poseidonHash,
    poseidonHashFunc: () => poseidonHashFunc,
    poseidonHashMany: () => poseidonHashMany,
    poseidonHashSingle: () => poseidonHashSingle,
    poseidonSmall: () => poseidonSmall,
    sign: () => sign,
    utils: () => utils,
    verify: () => verify
  });

  // node_modules/@noble/hashes/esm/_assert.js
  function number(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error(`Wrong positive integer: ${n}`);
  }
  function bytes(b, ...lengths) {
    if (!(b instanceof Uint8Array))
      throw new Error("Expected Uint8Array");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
  }
  function hash(hash2) {
    if (typeof hash2 !== "function" || typeof hash2.create !== "function")
      throw new Error("Hash should be wrapped by utils.wrapConstructor");
    number(hash2.outputLen);
    number(hash2.blockLen);
  }
  function exists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function output(out, instance) {
    bytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
  }

  // node_modules/@noble/hashes/esm/_u64.js
  var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
  var _32n = /* @__PURE__ */ BigInt(32);
  function fromBig(n, le = false) {
    if (le)
      return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
    return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
  }
  function split(lst, le = false) {
    let Ah = new Uint32Array(lst.length);
    let Al = new Uint32Array(lst.length);
    for (let i = 0; i < lst.length; i++) {
      const { h, l } = fromBig(lst[i], le);
      [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
  }
  var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
  var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
  var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
  var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;

  // node_modules/@noble/hashes/esm/crypto.js
  var crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

  // node_modules/@noble/hashes/esm/utils.js
  var u8a2 = (a) => a instanceof Uint8Array;
  var u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
  var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  var rotr = (word, shift) => word << 32 - shift | word >>> shift;
  var isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  if (!isLE)
    throw new Error("Non little-endian hardware is not supported");
  function utf8ToBytes2(str) {
    if (typeof str !== "string")
      throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str));
  }
  function toBytes(data) {
    if (typeof data === "string")
      data = utf8ToBytes2(data);
    if (!u8a2(data))
      throw new Error(`expected Uint8Array, got ${typeof data}`);
    return data;
  }
  function concatBytes2(...arrays) {
    const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
    let pad = 0;
    arrays.forEach((a) => {
      if (!u8a2(a))
        throw new Error("Uint8Array expected");
      r.set(a, pad);
      pad += a.length;
    });
    return r;
  }
  var Hash = class {
    // Safe version that clones internal state
    clone() {
      return this._cloneInto();
    }
  };
  var toStr = {}.toString;
  function wrapConstructor(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
  }
  function wrapXOFConstructorWithOpts(hashCons) {
    const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    return hashC;
  }
  function randomBytes(bytesLength = 32) {
    if (crypto && typeof crypto.getRandomValues === "function") {
      return crypto.getRandomValues(new Uint8Array(bytesLength));
    }
    throw new Error("crypto.getRandomValues must be defined");
  }

  // node_modules/@noble/hashes/esm/sha3.js
  var [SHA3_PI, SHA3_ROTL, _SHA3_IOTA] = [[], [], []];
  var _0n2 = /* @__PURE__ */ BigInt(0);
  var _1n2 = /* @__PURE__ */ BigInt(1);
  var _2n2 = /* @__PURE__ */ BigInt(2);
  var _7n = /* @__PURE__ */ BigInt(7);
  var _256n = /* @__PURE__ */ BigInt(256);
  var _0x71n = /* @__PURE__ */ BigInt(113);
  for (let round = 0, R = _1n2, x = 1, y = 0; round < 24; round++) {
    [x, y] = [y, (2 * x + 3 * y) % 5];
    SHA3_PI.push(2 * (5 * y + x));
    SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
    let t = _0n2;
    for (let j = 0; j < 7; j++) {
      R = (R << _1n2 ^ (R >> _7n) * _0x71n) % _256n;
      if (R & _2n2)
        t ^= _1n2 << (_1n2 << /* @__PURE__ */ BigInt(j)) - _1n2;
    }
    _SHA3_IOTA.push(t);
  }
  var [SHA3_IOTA_H, SHA3_IOTA_L] = /* @__PURE__ */ split(_SHA3_IOTA, true);
  var rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
  var rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
  function keccakP(s, rounds = 24) {
    const B = new Uint32Array(5 * 2);
    for (let round = 24 - rounds; round < 24; round++) {
      for (let x = 0; x < 10; x++)
        B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
      for (let x = 0; x < 10; x += 2) {
        const idx1 = (x + 8) % 10;
        const idx0 = (x + 2) % 10;
        const B0 = B[idx0];
        const B1 = B[idx0 + 1];
        const Th = rotlH(B0, B1, 1) ^ B[idx1];
        const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
        for (let y = 0; y < 50; y += 10) {
          s[x + y] ^= Th;
          s[x + y + 1] ^= Tl;
        }
      }
      let curH = s[2];
      let curL = s[3];
      for (let t = 0; t < 24; t++) {
        const shift = SHA3_ROTL[t];
        const Th = rotlH(curH, curL, shift);
        const Tl = rotlL(curH, curL, shift);
        const PI = SHA3_PI[t];
        curH = s[PI];
        curL = s[PI + 1];
        s[PI] = Th;
        s[PI + 1] = Tl;
      }
      for (let y = 0; y < 50; y += 10) {
        for (let x = 0; x < 10; x++)
          B[x] = s[y + x];
        for (let x = 0; x < 10; x++)
          s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
      }
      s[0] ^= SHA3_IOTA_H[round];
      s[1] ^= SHA3_IOTA_L[round];
    }
    B.fill(0);
  }
  var Keccak = class extends Hash {
    // NOTE: we accept arguments in bytes instead of bits here.
    constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
      super();
      this.blockLen = blockLen;
      this.suffix = suffix;
      this.outputLen = outputLen;
      this.enableXOF = enableXOF;
      this.rounds = rounds;
      this.pos = 0;
      this.posOut = 0;
      this.finished = false;
      this.destroyed = false;
      number(outputLen);
      if (0 >= this.blockLen || this.blockLen >= 200)
        throw new Error("Sha3 supports only keccak-f1600 function");
      this.state = new Uint8Array(200);
      this.state32 = u32(this.state);
    }
    keccak() {
      keccakP(this.state32, this.rounds);
      this.posOut = 0;
      this.pos = 0;
    }
    update(data) {
      exists(this);
      const { blockLen, state } = this;
      data = toBytes(data);
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        for (let i = 0; i < take; i++)
          state[this.pos++] ^= data[pos++];
        if (this.pos === blockLen)
          this.keccak();
      }
      return this;
    }
    finish() {
      if (this.finished)
        return;
      this.finished = true;
      const { state, suffix, pos, blockLen } = this;
      state[pos] ^= suffix;
      if ((suffix & 128) !== 0 && pos === blockLen - 1)
        this.keccak();
      state[blockLen - 1] ^= 128;
      this.keccak();
    }
    writeInto(out) {
      exists(this, false);
      bytes(out);
      this.finish();
      const bufferOut = this.state;
      const { blockLen } = this;
      for (let pos = 0, len = out.length; pos < len; ) {
        if (this.posOut >= blockLen)
          this.keccak();
        const take = Math.min(blockLen - this.posOut, len - pos);
        out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
        this.posOut += take;
        pos += take;
      }
      return out;
    }
    xofInto(out) {
      if (!this.enableXOF)
        throw new Error("XOF is not possible for this instance");
      return this.writeInto(out);
    }
    xof(bytes2) {
      number(bytes2);
      return this.xofInto(new Uint8Array(bytes2));
    }
    digestInto(out) {
      output(out, this);
      if (this.finished)
        throw new Error("digest() was already called");
      this.writeInto(out);
      this.destroy();
      return out;
    }
    digest() {
      return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
      this.destroyed = true;
      this.state.fill(0);
    }
    _cloneInto(to) {
      const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
      to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
      to.state32.set(this.state32);
      to.pos = this.pos;
      to.posOut = this.posOut;
      to.finished = this.finished;
      to.rounds = rounds;
      to.suffix = suffix;
      to.outputLen = outputLen;
      to.enableXOF = enableXOF;
      to.destroyed = this.destroyed;
      return to;
    }
  };
  var gen = (suffix, blockLen, outputLen) => wrapConstructor(() => new Keccak(blockLen, suffix, outputLen));
  var sha3_224 = /* @__PURE__ */ gen(6, 144, 224 / 8);
  var sha3_256 = /* @__PURE__ */ gen(6, 136, 256 / 8);
  var sha3_384 = /* @__PURE__ */ gen(6, 104, 384 / 8);
  var sha3_512 = /* @__PURE__ */ gen(6, 72, 512 / 8);
  var keccak_224 = /* @__PURE__ */ gen(1, 144, 224 / 8);
  var keccak_256 = /* @__PURE__ */ gen(1, 136, 256 / 8);
  var keccak_384 = /* @__PURE__ */ gen(1, 104, 384 / 8);
  var keccak_512 = /* @__PURE__ */ gen(1, 72, 512 / 8);
  var genShake = (suffix, blockLen, outputLen) => wrapXOFConstructorWithOpts((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === void 0 ? outputLen : opts.dkLen, true));
  var shake128 = /* @__PURE__ */ genShake(31, 168, 128 / 8);
  var shake256 = /* @__PURE__ */ genShake(31, 136, 256 / 8);

  // node_modules/@noble/hashes/esm/_sha2.js
  function setBigUint64(view, byteOffset, value, isLE2) {
    if (typeof view.setBigUint64 === "function")
      return view.setBigUint64(byteOffset, value, isLE2);
    const _32n2 = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value >> _32n2 & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE2 ? 4 : 0;
    const l = isLE2 ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE2);
    view.setUint32(byteOffset + l, wl, isLE2);
  }
  var SHA2 = class extends Hash {
    constructor(blockLen, outputLen, padOffset, isLE2) {
      super();
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.padOffset = padOffset;
      this.isLE = isLE2;
      this.finished = false;
      this.length = 0;
      this.pos = 0;
      this.destroyed = false;
      this.buffer = new Uint8Array(blockLen);
      this.view = createView(this.buffer);
    }
    update(data) {
      exists(this);
      const { view, buffer, blockLen } = this;
      data = toBytes(data);
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          const dataView = createView(data);
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          continue;
        }
        buffer.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(view, 0);
          this.pos = 0;
        }
      }
      this.length += data.length;
      this.roundClean();
      return this;
    }
    digestInto(out) {
      exists(this);
      output(out, this);
      this.finished = true;
      const { buffer, view, blockLen, isLE: isLE2 } = this;
      let { pos } = this;
      buffer[pos++] = 128;
      this.buffer.subarray(pos).fill(0);
      if (this.padOffset > blockLen - pos) {
        this.process(view, 0);
        pos = 0;
      }
      for (let i = pos; i < blockLen; i++)
        buffer[i] = 0;
      setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
      this.process(view, 0);
      const oview = createView(out);
      const len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen should be aligned to 32bit");
      const outLen = len / 4;
      const state = this.get();
      if (outLen > state.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state[i], isLE2);
    }
    digest() {
      const { buffer, outputLen } = this;
      this.digestInto(buffer);
      const res = buffer.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneInto(to) {
      to || (to = new this.constructor());
      to.set(...this.get());
      const { blockLen, buffer, length, finished, destroyed, pos } = this;
      to.length = length;
      to.pos = pos;
      to.finished = finished;
      to.destroyed = destroyed;
      if (length % blockLen)
        to.buffer.set(buffer);
      return to;
    }
  };

  // node_modules/@noble/hashes/esm/sha256.js
  var Chi = (a, b, c) => a & b ^ ~a & c;
  var Maj = (a, b, c) => a & b ^ a & c ^ b & c;
  var SHA256_K = /* @__PURE__ */ new Uint32Array([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  var IV = /* @__PURE__ */ new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
  var SHA256 = class extends SHA2 {
    constructor() {
      super(64, 32, 8, false);
      this.A = IV[0] | 0;
      this.B = IV[1] | 0;
      this.C = IV[2] | 0;
      this.D = IV[3] | 0;
      this.E = IV[4] | 0;
      this.F = IV[5] | 0;
      this.G = IV[6] | 0;
      this.H = IV[7] | 0;
    }
    get() {
      const { A, B, C, D, E, F, G, H } = this;
      return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
      this.A = A | 0;
      this.B = B | 0;
      this.C = C | 0;
      this.D = D | 0;
      this.E = E | 0;
      this.F = F | 0;
      this.G = G | 0;
      this.H = H | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W[i] = view.getUint32(offset, false);
      for (let i = 16; i < 64; i++) {
        const W15 = SHA256_W[i - 15];
        const W2 = SHA256_W[i - 2];
        const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
        const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
        SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
      }
      let { A, B, C, D, E, F, G, H } = this;
      for (let i = 0; i < 64; i++) {
        const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
        const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
        const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
        const T2 = sigma0 + Maj(A, B, C) | 0;
        H = G;
        G = F;
        F = E;
        E = D + T1 | 0;
        D = C;
        C = B;
        B = A;
        A = T1 + T2 | 0;
      }
      A = A + this.A | 0;
      B = B + this.B | 0;
      C = C + this.C | 0;
      D = D + this.D | 0;
      E = E + this.E | 0;
      F = F + this.F | 0;
      G = G + this.G | 0;
      H = H + this.H | 0;
      this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
      SHA256_W.fill(0);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0);
      this.buffer.fill(0);
    }
  };
  var sha256 = /* @__PURE__ */ wrapConstructor(() => new SHA256());

  // node_modules/@noble/curves/esm/abstract/modular.js
  var _0n3 = BigInt(0);
  var _1n3 = BigInt(1);
  var _2n3 = BigInt(2);
  var _3n = BigInt(3);
  var _4n = BigInt(4);
  var _5n = BigInt(5);
  var _8n = BigInt(8);
  var _9n = BigInt(9);
  var _16n = BigInt(16);
  function mod(a, b) {
    const result = a % b;
    return result >= _0n3 ? result : b + result;
  }
  function pow(num, power, modulo) {
    if (modulo <= _0n3 || power < _0n3)
      throw new Error("Expected power/modulo > 0");
    if (modulo === _1n3)
      return _0n3;
    let res = _1n3;
    while (power > _0n3) {
      if (power & _1n3)
        res = res * num % modulo;
      num = num * num % modulo;
      power >>= _1n3;
    }
    return res;
  }
  function invert(number3, modulo) {
    if (number3 === _0n3 || modulo <= _0n3) {
      throw new Error(`invert: expected positive integers, got n=${number3} mod=${modulo}`);
    }
    let a = mod(number3, modulo);
    let b = modulo;
    let x = _0n3, y = _1n3, u = _1n3, v = _0n3;
    while (a !== _0n3) {
      const q = b / a;
      const r = b % a;
      const m = x - u * q;
      const n = y - v * q;
      b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd = b;
    if (gcd !== _1n3)
      throw new Error("invert: does not exist");
    return mod(x, modulo);
  }
  function tonelliShanks(P) {
    const legendreC = (P - _1n3) / _2n3;
    let Q, S, Z;
    for (Q = P - _1n3, S = 0; Q % _2n3 === _0n3; Q /= _2n3, S++)
      ;
    for (Z = _2n3; Z < P && pow(Z, legendreC, P) !== P - _1n3; Z++)
      ;
    if (S === 1) {
      const p1div4 = (P + _1n3) / _4n;
      return function tonelliFast(Fp, n) {
        const root = Fp.pow(n, p1div4);
        if (!Fp.eql(Fp.sqr(root), n))
          throw new Error("Cannot find square root");
        return root;
      };
    }
    const Q1div2 = (Q + _1n3) / _2n3;
    return function tonelliSlow(Fp, n) {
      if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE))
        throw new Error("Cannot find square root");
      let r = S;
      let g = Fp.pow(Fp.mul(Fp.ONE, Z), Q);
      let x = Fp.pow(n, Q1div2);
      let b = Fp.pow(n, Q);
      while (!Fp.eql(b, Fp.ONE)) {
        if (Fp.eql(b, Fp.ZERO))
          return Fp.ZERO;
        let m = 1;
        for (let t2 = Fp.sqr(b); m < r; m++) {
          if (Fp.eql(t2, Fp.ONE))
            break;
          t2 = Fp.sqr(t2);
        }
        const ge = Fp.pow(g, _1n3 << BigInt(r - m - 1));
        g = Fp.sqr(ge);
        x = Fp.mul(x, ge);
        b = Fp.mul(b, g);
        r = m;
      }
      return x;
    };
  }
  function FpSqrt(P) {
    if (P % _4n === _3n) {
      const p1div4 = (P + _1n3) / _4n;
      return function sqrt3mod4(Fp, n) {
        const root = Fp.pow(n, p1div4);
        if (!Fp.eql(Fp.sqr(root), n))
          throw new Error("Cannot find square root");
        return root;
      };
    }
    if (P % _8n === _5n) {
      const c1 = (P - _5n) / _8n;
      return function sqrt5mod8(Fp, n) {
        const n2 = Fp.mul(n, _2n3);
        const v = Fp.pow(n2, c1);
        const nv = Fp.mul(n, v);
        const i = Fp.mul(Fp.mul(nv, _2n3), v);
        const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
        if (!Fp.eql(Fp.sqr(root), n))
          throw new Error("Cannot find square root");
        return root;
      };
    }
    if (P % _16n === _9n) {
    }
    return tonelliShanks(P);
  }
  var FIELD_FIELDS = [
    "create",
    "isValid",
    "is0",
    "neg",
    "inv",
    "sqrt",
    "sqr",
    "eql",
    "add",
    "sub",
    "mul",
    "pow",
    "div",
    "addN",
    "subN",
    "mulN",
    "sqrN"
  ];
  function validateField(field) {
    const initial = {
      ORDER: "bigint",
      MASK: "bigint",
      BYTES: "isSafeInteger",
      BITS: "isSafeInteger"
    };
    const opts = FIELD_FIELDS.reduce((map, val) => {
      map[val] = "function";
      return map;
    }, initial);
    return validateObject(field, opts);
  }
  function FpPow(f, num, power) {
    if (power < _0n3)
      throw new Error("Expected power > 0");
    if (power === _0n3)
      return f.ONE;
    if (power === _1n3)
      return num;
    let p = f.ONE;
    let d = num;
    while (power > _0n3) {
      if (power & _1n3)
        p = f.mul(p, d);
      d = f.sqr(d);
      power >>= _1n3;
    }
    return p;
  }
  function FpInvertBatch(f, nums) {
    const tmp = new Array(nums.length);
    const lastMultiplied = nums.reduce((acc, num, i) => {
      if (f.is0(num))
        return acc;
      tmp[i] = acc;
      return f.mul(acc, num);
    }, f.ONE);
    const inverted = f.inv(lastMultiplied);
    nums.reduceRight((acc, num, i) => {
      if (f.is0(num))
        return acc;
      tmp[i] = f.mul(acc, tmp[i]);
      return f.mul(acc, num);
    }, inverted);
    return tmp;
  }
  function nLength(n, nBitLength2) {
    const _nBitLength = nBitLength2 !== void 0 ? nBitLength2 : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
  }
  function Field(ORDER, bitLen2, isLE2 = false, redef = {}) {
    if (ORDER <= _0n3)
      throw new Error(`Expected Field ORDER > 0, got ${ORDER}`);
    const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen2);
    if (BYTES > 2048)
      throw new Error("Field lengths over 2048 bytes are not supported");
    const sqrtP = FpSqrt(ORDER);
    const f = Object.freeze({
      ORDER,
      BITS,
      BYTES,
      MASK: bitMask(BITS),
      ZERO: _0n3,
      ONE: _1n3,
      create: (num) => mod(num, ORDER),
      isValid: (num) => {
        if (typeof num !== "bigint")
          throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
        return _0n3 <= num && num < ORDER;
      },
      is0: (num) => num === _0n3,
      isOdd: (num) => (num & _1n3) === _1n3,
      neg: (num) => mod(-num, ORDER),
      eql: (lhs, rhs) => lhs === rhs,
      sqr: (num) => mod(num * num, ORDER),
      add: (lhs, rhs) => mod(lhs + rhs, ORDER),
      sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
      mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
      pow: (num, power) => FpPow(f, num, power),
      div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
      // Same as above, but doesn't normalize
      sqrN: (num) => num * num,
      addN: (lhs, rhs) => lhs + rhs,
      subN: (lhs, rhs) => lhs - rhs,
      mulN: (lhs, rhs) => lhs * rhs,
      inv: (num) => invert(num, ORDER),
      sqrt: redef.sqrt || ((n) => sqrtP(f, n)),
      invertBatch: (lst) => FpInvertBatch(f, lst),
      // TODO: do we really need constant cmov?
      // We don't have const-time bigints anyway, so probably will be not very useful
      cmov: (a, b, c) => c ? b : a,
      toBytes: (num) => isLE2 ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
      fromBytes: (bytes2) => {
        if (bytes2.length !== BYTES)
          throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes2.length}`);
        return isLE2 ? bytesToNumberLE(bytes2) : bytesToNumberBE(bytes2);
      }
    });
    return Object.freeze(f);
  }
  function getFieldBytesLength(fieldOrder) {
    if (typeof fieldOrder !== "bigint")
      throw new Error("field order must be bigint");
    const bitLength = fieldOrder.toString(2).length;
    return Math.ceil(bitLength / 8);
  }
  function getMinHashLength(fieldOrder) {
    const length = getFieldBytesLength(fieldOrder);
    return length + Math.ceil(length / 2);
  }
  function mapHashToField(key, fieldOrder, isLE2 = false) {
    const len = key.length;
    const fieldLen = getFieldBytesLength(fieldOrder);
    const minLen = getMinHashLength(fieldOrder);
    if (len < 16 || len < minLen || len > 1024)
      throw new Error(`expected ${minLen}-1024 bytes of input, got ${len}`);
    const num = isLE2 ? bytesToNumberBE(key) : bytesToNumberLE(key);
    const reduced = mod(num, fieldOrder - _1n3) + _1n3;
    return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
  }

  // node_modules/@noble/curves/esm/abstract/poseidon.js
  var poseidon_exports = {};
  __export(poseidon_exports, {
    poseidon: () => poseidon,
    splitConstants: () => splitConstants,
    validateOpts: () => validateOpts
  });
  function validateOpts(opts) {
    const { Fp, mds, reversePartialPowIdx: rev, roundConstants: rc } = opts;
    const { roundsFull, roundsPartial, sboxPower, t } = opts;
    validateField(Fp);
    for (const i of ["t", "roundsFull", "roundsPartial"]) {
      if (typeof opts[i] !== "number" || !Number.isSafeInteger(opts[i]))
        throw new Error(`Poseidon: invalid param ${i}=${opts[i]} (${typeof opts[i]})`);
    }
    if (!Array.isArray(mds) || mds.length !== t)
      throw new Error("Poseidon: wrong MDS matrix");
    const _mds = mds.map((mdsRow) => {
      if (!Array.isArray(mdsRow) || mdsRow.length !== t)
        throw new Error(`Poseidon MDS matrix row: ${mdsRow}`);
      return mdsRow.map((i) => {
        if (typeof i !== "bigint")
          throw new Error(`Poseidon MDS matrix value=${i}`);
        return Fp.create(i);
      });
    });
    if (rev !== void 0 && typeof rev !== "boolean")
      throw new Error(`Poseidon: invalid param reversePartialPowIdx=${rev}`);
    if (roundsFull % 2 !== 0)
      throw new Error(`Poseidon roundsFull is not even: ${roundsFull}`);
    const rounds = roundsFull + roundsPartial;
    if (!Array.isArray(rc) || rc.length !== rounds)
      throw new Error("Poseidon: wrong round constants");
    const roundConstants = rc.map((rc2) => {
      if (!Array.isArray(rc2) || rc2.length !== t)
        throw new Error(`Poseidon wrong round constants: ${rc2}`);
      return rc2.map((i) => {
        if (typeof i !== "bigint" || !Fp.isValid(i))
          throw new Error(`Poseidon wrong round constant=${i}`);
        return Fp.create(i);
      });
    });
    if (!sboxPower || ![3, 5, 7].includes(sboxPower))
      throw new Error(`Poseidon wrong sboxPower=${sboxPower}`);
    const _sboxPower = BigInt(sboxPower);
    let sboxFn = (n) => FpPow(Fp, n, _sboxPower);
    if (sboxPower === 3)
      sboxFn = (n) => Fp.mul(Fp.sqrN(n), n);
    else if (sboxPower === 5)
      sboxFn = (n) => Fp.mul(Fp.sqrN(Fp.sqrN(n)), n);
    return Object.freeze({ ...opts, rounds, sboxFn, roundConstants, mds: _mds });
  }
  function splitConstants(rc, t) {
    if (typeof t !== "number")
      throw new Error("poseidonSplitConstants: wrong t");
    if (!Array.isArray(rc) || rc.length % t)
      throw new Error("poseidonSplitConstants: wrong rc");
    const res = [];
    let tmp = [];
    for (let i = 0; i < rc.length; i++) {
      tmp.push(rc[i]);
      if (tmp.length === t) {
        res.push(tmp);
        tmp = [];
      }
    }
    return res;
  }
  function poseidon(opts) {
    const _opts = validateOpts(opts);
    const { Fp, mds, roundConstants, rounds, roundsPartial, sboxFn, t } = _opts;
    const halfRoundsFull = _opts.roundsFull / 2;
    const partialIdx = _opts.reversePartialPowIdx ? t - 1 : 0;
    const poseidonRound = (values, isFull, idx) => {
      values = values.map((i, j) => Fp.add(i, roundConstants[idx][j]));
      if (isFull)
        values = values.map((i) => sboxFn(i));
      else
        values[partialIdx] = sboxFn(values[partialIdx]);
      values = mds.map((i) => i.reduce((acc, i2, j) => Fp.add(acc, Fp.mulN(i2, values[j])), Fp.ZERO));
      return values;
    };
    const poseidonHash2 = function poseidonHash3(values) {
      if (!Array.isArray(values) || values.length !== t)
        throw new Error(`Poseidon: wrong values (expected array of bigints with length ${t})`);
      values = values.map((i) => {
        if (typeof i !== "bigint")
          throw new Error(`Poseidon: wrong value=${i} (${typeof i})`);
        return Fp.create(i);
      });
      let round = 0;
      for (let i = 0; i < halfRoundsFull; i++)
        values = poseidonRound(values, true, round++);
      for (let i = 0; i < roundsPartial; i++)
        values = poseidonRound(values, false, round++);
      for (let i = 0; i < halfRoundsFull; i++)
        values = poseidonRound(values, true, round++);
      if (round !== rounds)
        throw new Error(`Poseidon: wrong number of rounds: last round=${round}, total=${rounds}`);
      return values;
    };
    poseidonHash2.roundConstants = roundConstants;
    return poseidonHash2;
  }

  // node_modules/@noble/curves/esm/abstract/weierstrass.js
  var weierstrass_exports = {};
  __export(weierstrass_exports, {
    DER: () => DER,
    SWUFpSqrtRatio: () => SWUFpSqrtRatio,
    mapToCurveSimpleSWU: () => mapToCurveSimpleSWU,
    weierstrass: () => weierstrass,
    weierstrassPoints: () => weierstrassPoints
  });

  // node_modules/@noble/curves/esm/abstract/curve.js
  var _0n4 = BigInt(0);
  var _1n4 = BigInt(1);
  function wNAF(c, bits) {
    const constTimeNegate = (condition, item) => {
      const neg = item.negate();
      return condition ? neg : item;
    };
    const opts = (W) => {
      const windows = Math.ceil(bits / W) + 1;
      const windowSize = 2 ** (W - 1);
      return { windows, windowSize };
    };
    return {
      constTimeNegate,
      // non-const time multiplication ladder
      unsafeLadder(elm, n) {
        let p = c.ZERO;
        let d = elm;
        while (n > _0n4) {
          if (n & _1n4)
            p = p.add(d);
          d = d.double();
          n >>= _1n4;
        }
        return p;
      },
      /**
       * Creates a wNAF precomputation window. Used for caching.
       * Default window size is set by `utils.precompute()` and is equal to 8.
       * Number of precomputed points depends on the curve size:
       * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
       * - 𝑊 is the window size
       * - 𝑛 is the bitlength of the curve order.
       * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
       * @returns precomputed point tables flattened to a single array
       */
      precomputeWindow(elm, W) {
        const { windows, windowSize } = opts(W);
        const points = [];
        let p = elm;
        let base = p;
        for (let window2 = 0; window2 < windows; window2++) {
          base = p;
          points.push(base);
          for (let i = 1; i < windowSize; i++) {
            base = base.add(p);
            points.push(base);
          }
          p = base.double();
        }
        return points;
      },
      /**
       * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
       * @param W window size
       * @param precomputes precomputed tables
       * @param n scalar (we don't check here, but should be less than curve order)
       * @returns real and fake (for const-time) points
       */
      wNAF(W, precomputes, n) {
        const { windows, windowSize } = opts(W);
        let p = c.ZERO;
        let f = c.BASE;
        const mask = BigInt(2 ** W - 1);
        const maxNumber = 2 ** W;
        const shiftBy = BigInt(W);
        for (let window2 = 0; window2 < windows; window2++) {
          const offset = window2 * windowSize;
          let wbits = Number(n & mask);
          n >>= shiftBy;
          if (wbits > windowSize) {
            wbits -= maxNumber;
            n += _1n4;
          }
          const offset1 = offset;
          const offset2 = offset + Math.abs(wbits) - 1;
          const cond1 = window2 % 2 !== 0;
          const cond2 = wbits < 0;
          if (wbits === 0) {
            f = f.add(constTimeNegate(cond1, precomputes[offset1]));
          } else {
            p = p.add(constTimeNegate(cond2, precomputes[offset2]));
          }
        }
        return { p, f };
      },
      wNAFCached(P, precomputesMap, n, transform) {
        const W = P._WINDOW_SIZE || 1;
        let comp = precomputesMap.get(P);
        if (!comp) {
          comp = this.precomputeWindow(P, W);
          if (W !== 1) {
            precomputesMap.set(P, transform(comp));
          }
        }
        return this.wNAF(W, comp, n);
      }
    };
  }
  function validateBasic(curve2) {
    validateField(curve2.Fp);
    validateObject(curve2, {
      n: "bigint",
      h: "bigint",
      Gx: "field",
      Gy: "field"
    }, {
      nBitLength: "isSafeInteger",
      nByteLength: "isSafeInteger"
    });
    return Object.freeze({
      ...nLength(curve2.n, curve2.nBitLength),
      ...curve2,
      ...{ p: curve2.Fp.ORDER }
    });
  }

  // node_modules/@noble/curves/esm/abstract/weierstrass.js
  function validatePointOpts(curve2) {
    const opts = validateBasic(curve2);
    validateObject(opts, {
      a: "field",
      b: "field"
    }, {
      allowedPrivateKeyLengths: "array",
      wrapPrivateKey: "boolean",
      isTorsionFree: "function",
      clearCofactor: "function",
      allowInfinityPoint: "boolean",
      fromBytes: "function",
      toBytes: "function"
    });
    const { endo, Fp, a } = opts;
    if (endo) {
      if (!Fp.eql(a, Fp.ZERO)) {
        throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
      }
      if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
        throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
      }
    }
    return Object.freeze({ ...opts });
  }
  var { bytesToNumberBE: b2n, hexToBytes: h2b } = utils_exports;
  var DER = {
    // asn.1 DER encoding utils
    Err: class DERErr extends Error {
      constructor(m = "") {
        super(m);
      }
    },
    _parseInt(data) {
      const { Err: E } = DER;
      if (data.length < 2 || data[0] !== 2)
        throw new E("Invalid signature integer tag");
      const len = data[1];
      const res = data.subarray(2, len + 2);
      if (!len || res.length !== len)
        throw new E("Invalid signature integer: wrong length");
      if (res[0] & 128)
        throw new E("Invalid signature integer: negative");
      if (res[0] === 0 && !(res[1] & 128))
        throw new E("Invalid signature integer: unnecessary leading zero");
      return { d: b2n(res), l: data.subarray(len + 2) };
    },
    toSig(hex) {
      const { Err: E } = DER;
      const data = typeof hex === "string" ? h2b(hex) : hex;
      if (!(data instanceof Uint8Array))
        throw new Error("ui8a expected");
      let l = data.length;
      if (l < 2 || data[0] != 48)
        throw new E("Invalid signature tag");
      if (data[1] !== l - 2)
        throw new E("Invalid signature: incorrect length");
      const { d: r, l: sBytes } = DER._parseInt(data.subarray(2));
      const { d: s, l: rBytesLeft } = DER._parseInt(sBytes);
      if (rBytesLeft.length)
        throw new E("Invalid signature: left bytes after parsing");
      return { r, s };
    },
    hexFromSig(sig) {
      const slice = (s2) => Number.parseInt(s2[0], 16) & 8 ? "00" + s2 : s2;
      const h = (num) => {
        const hex = num.toString(16);
        return hex.length & 1 ? `0${hex}` : hex;
      };
      const s = slice(h(sig.s));
      const r = slice(h(sig.r));
      const shl = s.length / 2;
      const rhl = r.length / 2;
      const sl = h(shl);
      const rl = h(rhl);
      return `30${h(rhl + shl + 4)}02${rl}${r}02${sl}${s}`;
    }
  };
  var _0n5 = BigInt(0);
  var _1n5 = BigInt(1);
  var _2n4 = BigInt(2);
  var _3n2 = BigInt(3);
  var _4n2 = BigInt(4);
  function weierstrassPoints(opts) {
    const CURVE2 = validatePointOpts(opts);
    const { Fp } = CURVE2;
    const toBytes2 = CURVE2.toBytes || ((_c, point, _isCompressed) => {
      const a = point.toAffine();
      return concatBytes(Uint8Array.from([4]), Fp.toBytes(a.x), Fp.toBytes(a.y));
    });
    const fromBytes = CURVE2.fromBytes || ((bytes2) => {
      const tail = bytes2.subarray(1);
      const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
      const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
      return { x, y };
    });
    function weierstrassEquation(x) {
      const { a, b } = CURVE2;
      const x2 = Fp.sqr(x);
      const x3 = Fp.mul(x2, x);
      return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
    }
    if (!Fp.eql(Fp.sqr(CURVE2.Gy), weierstrassEquation(CURVE2.Gx)))
      throw new Error("bad generator point: equation left != right");
    function isWithinCurveOrder(num) {
      return typeof num === "bigint" && _0n5 < num && num < CURVE2.n;
    }
    function assertGE(num) {
      if (!isWithinCurveOrder(num))
        throw new Error("Expected valid bigint: 0 < bigint < curve.n");
    }
    function normPrivateKeyToScalar(key) {
      const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n } = CURVE2;
      if (lengths && typeof key !== "bigint") {
        if (key instanceof Uint8Array)
          key = bytesToHex(key);
        if (typeof key !== "string" || !lengths.includes(key.length))
          throw new Error("Invalid key");
        key = key.padStart(nByteLength * 2, "0");
      }
      let num;
      try {
        num = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
      } catch (error) {
        throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
      }
      if (wrapPrivateKey)
        num = mod(num, n);
      assertGE(num);
      return num;
    }
    const pointPrecomputes = /* @__PURE__ */ new Map();
    function assertPrjPoint(other) {
      if (!(other instanceof Point))
        throw new Error("ProjectivePoint expected");
    }
    class Point {
      constructor(px, py, pz) {
        this.px = px;
        this.py = py;
        this.pz = pz;
        if (px == null || !Fp.isValid(px))
          throw new Error("x required");
        if (py == null || !Fp.isValid(py))
          throw new Error("y required");
        if (pz == null || !Fp.isValid(pz))
          throw new Error("z required");
      }
      // Does not validate if the point is on-curve.
      // Use fromHex instead, or call assertValidity() later.
      static fromAffine(p) {
        const { x, y } = p || {};
        if (!p || !Fp.isValid(x) || !Fp.isValid(y))
          throw new Error("invalid affine point");
        if (p instanceof Point)
          throw new Error("projective point not allowed");
        const is0 = (i) => Fp.eql(i, Fp.ZERO);
        if (is0(x) && is0(y))
          return Point.ZERO;
        return new Point(x, y, Fp.ONE);
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      /**
       * Takes a bunch of Projective Points but executes only one
       * inversion on all of them. Inversion is very slow operation,
       * so this improves performance massively.
       * Optimization: converts a list of projective points to a list of identical points with Z=1.
       */
      static normalizeZ(points) {
        const toInv = Fp.invertBatch(points.map((p) => p.pz));
        return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
      }
      /**
       * Converts hash string or Uint8Array to Point.
       * @param hex short/long ECDSA hex
       */
      static fromHex(hex) {
        const P = Point.fromAffine(fromBytes(ensureBytes("pointHex", hex)));
        P.assertValidity();
        return P;
      }
      // Multiplies generator point by privateKey.
      static fromPrivateKey(privateKey) {
        return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
      }
      // "Private method", don't use it directly
      _setWindowSize(windowSize) {
        this._WINDOW_SIZE = windowSize;
        pointPrecomputes.delete(this);
      }
      // A point on curve is valid if it conforms to equation.
      assertValidity() {
        if (this.is0()) {
          if (CURVE2.allowInfinityPoint && !Fp.is0(this.py))
            return;
          throw new Error("bad point: ZERO");
        }
        const { x, y } = this.toAffine();
        if (!Fp.isValid(x) || !Fp.isValid(y))
          throw new Error("bad point: x or y not FE");
        const left = Fp.sqr(y);
        const right = weierstrassEquation(x);
        if (!Fp.eql(left, right))
          throw new Error("bad point: equation left != right");
        if (!this.isTorsionFree())
          throw new Error("bad point: not in prime-order subgroup");
      }
      hasEvenY() {
        const { y } = this.toAffine();
        if (Fp.isOdd)
          return !Fp.isOdd(y);
        throw new Error("Field doesn't support isOdd");
      }
      /**
       * Compare one point to another.
       */
      equals(other) {
        assertPrjPoint(other);
        const { px: X1, py: Y1, pz: Z1 } = this;
        const { px: X2, py: Y2, pz: Z2 } = other;
        const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
        const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
        return U1 && U2;
      }
      /**
       * Flips point to one corresponding to (x, -y) in Affine coordinates.
       */
      negate() {
        return new Point(this.px, Fp.neg(this.py), this.pz);
      }
      // Renes-Costello-Batina exception-free doubling formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 3
      // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
      double() {
        const { a, b } = CURVE2;
        const b3 = Fp.mul(b, _3n2);
        const { px: X1, py: Y1, pz: Z1 } = this;
        let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
        let t0 = Fp.mul(X1, X1);
        let t1 = Fp.mul(Y1, Y1);
        let t2 = Fp.mul(Z1, Z1);
        let t3 = Fp.mul(X1, Y1);
        t3 = Fp.add(t3, t3);
        Z3 = Fp.mul(X1, Z1);
        Z3 = Fp.add(Z3, Z3);
        X3 = Fp.mul(a, Z3);
        Y3 = Fp.mul(b3, t2);
        Y3 = Fp.add(X3, Y3);
        X3 = Fp.sub(t1, Y3);
        Y3 = Fp.add(t1, Y3);
        Y3 = Fp.mul(X3, Y3);
        X3 = Fp.mul(t3, X3);
        Z3 = Fp.mul(b3, Z3);
        t2 = Fp.mul(a, t2);
        t3 = Fp.sub(t0, t2);
        t3 = Fp.mul(a, t3);
        t3 = Fp.add(t3, Z3);
        Z3 = Fp.add(t0, t0);
        t0 = Fp.add(Z3, t0);
        t0 = Fp.add(t0, t2);
        t0 = Fp.mul(t0, t3);
        Y3 = Fp.add(Y3, t0);
        t2 = Fp.mul(Y1, Z1);
        t2 = Fp.add(t2, t2);
        t0 = Fp.mul(t2, t3);
        X3 = Fp.sub(X3, t0);
        Z3 = Fp.mul(t2, t1);
        Z3 = Fp.add(Z3, Z3);
        Z3 = Fp.add(Z3, Z3);
        return new Point(X3, Y3, Z3);
      }
      // Renes-Costello-Batina exception-free addition formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 1
      // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
      add(other) {
        assertPrjPoint(other);
        const { px: X1, py: Y1, pz: Z1 } = this;
        const { px: X2, py: Y2, pz: Z2 } = other;
        let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
        const a = CURVE2.a;
        const b3 = Fp.mul(CURVE2.b, _3n2);
        let t0 = Fp.mul(X1, X2);
        let t1 = Fp.mul(Y1, Y2);
        let t2 = Fp.mul(Z1, Z2);
        let t3 = Fp.add(X1, Y1);
        let t4 = Fp.add(X2, Y2);
        t3 = Fp.mul(t3, t4);
        t4 = Fp.add(t0, t1);
        t3 = Fp.sub(t3, t4);
        t4 = Fp.add(X1, Z1);
        let t5 = Fp.add(X2, Z2);
        t4 = Fp.mul(t4, t5);
        t5 = Fp.add(t0, t2);
        t4 = Fp.sub(t4, t5);
        t5 = Fp.add(Y1, Z1);
        X3 = Fp.add(Y2, Z2);
        t5 = Fp.mul(t5, X3);
        X3 = Fp.add(t1, t2);
        t5 = Fp.sub(t5, X3);
        Z3 = Fp.mul(a, t4);
        X3 = Fp.mul(b3, t2);
        Z3 = Fp.add(X3, Z3);
        X3 = Fp.sub(t1, Z3);
        Z3 = Fp.add(t1, Z3);
        Y3 = Fp.mul(X3, Z3);
        t1 = Fp.add(t0, t0);
        t1 = Fp.add(t1, t0);
        t2 = Fp.mul(a, t2);
        t4 = Fp.mul(b3, t4);
        t1 = Fp.add(t1, t2);
        t2 = Fp.sub(t0, t2);
        t2 = Fp.mul(a, t2);
        t4 = Fp.add(t4, t2);
        t0 = Fp.mul(t1, t4);
        Y3 = Fp.add(Y3, t0);
        t0 = Fp.mul(t5, t4);
        X3 = Fp.mul(t3, X3);
        X3 = Fp.sub(X3, t0);
        t0 = Fp.mul(t3, t1);
        Z3 = Fp.mul(t5, Z3);
        Z3 = Fp.add(Z3, t0);
        return new Point(X3, Y3, Z3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      is0() {
        return this.equals(Point.ZERO);
      }
      wNAF(n) {
        return wnaf.wNAFCached(this, pointPrecomputes, n, (comp) => {
          const toInv = Fp.invertBatch(comp.map((p) => p.pz));
          return comp.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
        });
      }
      /**
       * Non-constant-time multiplication. Uses double-and-add algorithm.
       * It's faster, but should only be used when you don't care about
       * an exposed private key e.g. sig verification, which works over *public* keys.
       */
      multiplyUnsafe(n) {
        const I = Point.ZERO;
        if (n === _0n5)
          return I;
        assertGE(n);
        if (n === _1n5)
          return this;
        const { endo } = CURVE2;
        if (!endo)
          return wnaf.unsafeLadder(this, n);
        let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
        let k1p = I;
        let k2p = I;
        let d = this;
        while (k1 > _0n5 || k2 > _0n5) {
          if (k1 & _1n5)
            k1p = k1p.add(d);
          if (k2 & _1n5)
            k2p = k2p.add(d);
          d = d.double();
          k1 >>= _1n5;
          k2 >>= _1n5;
        }
        if (k1neg)
          k1p = k1p.negate();
        if (k2neg)
          k2p = k2p.negate();
        k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
        return k1p.add(k2p);
      }
      /**
       * Constant time multiplication.
       * Uses wNAF method. Windowed method may be 10% faster,
       * but takes 2x longer to generate and consumes 2x memory.
       * Uses precomputes when available.
       * Uses endomorphism for Koblitz curves.
       * @param scalar by which the point would be multiplied
       * @returns New point
       */
      multiply(scalar) {
        assertGE(scalar);
        let n = scalar;
        let point, fake;
        const { endo } = CURVE2;
        if (endo) {
          const { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
          let { p: k1p, f: f1p } = this.wNAF(k1);
          let { p: k2p, f: f2p } = this.wNAF(k2);
          k1p = wnaf.constTimeNegate(k1neg, k1p);
          k2p = wnaf.constTimeNegate(k2neg, k2p);
          k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
          point = k1p.add(k2p);
          fake = f1p.add(f2p);
        } else {
          const { p, f } = this.wNAF(n);
          point = p;
          fake = f;
        }
        return Point.normalizeZ([point, fake])[0];
      }
      /**
       * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
       * Not using Strauss-Shamir trick: precomputation tables are faster.
       * The trick could be useful if both P and Q are not G (not in our case).
       * @returns non-zero affine point
       */
      multiplyAndAddUnsafe(Q, a, b) {
        const G = Point.BASE;
        const mul = (P, a2) => a2 === _0n5 || a2 === _1n5 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2);
        const sum = mul(this, a).add(mul(Q, b));
        return sum.is0() ? void 0 : sum;
      }
      // Converts Projective point to affine (x, y) coordinates.
      // Can accept precomputed Z^-1 - for example, from invertBatch.
      // (x, y, z) ∋ (x=x/z, y=y/z)
      toAffine(iz) {
        const { px: x, py: y, pz: z } = this;
        const is0 = this.is0();
        if (iz == null)
          iz = is0 ? Fp.ONE : Fp.inv(z);
        const ax = Fp.mul(x, iz);
        const ay = Fp.mul(y, iz);
        const zz = Fp.mul(z, iz);
        if (is0)
          return { x: Fp.ZERO, y: Fp.ZERO };
        if (!Fp.eql(zz, Fp.ONE))
          throw new Error("invZ was invalid");
        return { x: ax, y: ay };
      }
      isTorsionFree() {
        const { h: cofactor, isTorsionFree } = CURVE2;
        if (cofactor === _1n5)
          return true;
        if (isTorsionFree)
          return isTorsionFree(Point, this);
        throw new Error("isTorsionFree() has not been declared for the elliptic curve");
      }
      clearCofactor() {
        const { h: cofactor, clearCofactor } = CURVE2;
        if (cofactor === _1n5)
          return this;
        if (clearCofactor)
          return clearCofactor(Point, this);
        return this.multiplyUnsafe(CURVE2.h);
      }
      toRawBytes(isCompressed = true) {
        this.assertValidity();
        return toBytes2(Point, this, isCompressed);
      }
      toHex(isCompressed = true) {
        return bytesToHex(this.toRawBytes(isCompressed));
      }
    }
    Point.BASE = new Point(CURVE2.Gx, CURVE2.Gy, Fp.ONE);
    Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
    const _bits = CURVE2.nBitLength;
    const wnaf = wNAF(Point, CURVE2.endo ? Math.ceil(_bits / 2) : _bits);
    return {
      CURVE: CURVE2,
      ProjectivePoint: Point,
      normPrivateKeyToScalar,
      weierstrassEquation,
      isWithinCurveOrder
    };
  }
  function validateOpts2(curve2) {
    const opts = validateBasic(curve2);
    validateObject(opts, {
      hash: "hash",
      hmac: "function",
      randomBytes: "function"
    }, {
      bits2int: "function",
      bits2int_modN: "function",
      lowS: "boolean"
    });
    return Object.freeze({ lowS: true, ...opts });
  }
  function weierstrass(curveDef) {
    const CURVE2 = validateOpts2(curveDef);
    const { Fp, n: CURVE_ORDER2 } = CURVE2;
    const compressedLen = Fp.BYTES + 1;
    const uncompressedLen = 2 * Fp.BYTES + 1;
    function isValidFieldElement(num) {
      return _0n5 < num && num < Fp.ORDER;
    }
    function modN(a) {
      return mod(a, CURVE_ORDER2);
    }
    function invN(a) {
      return invert(a, CURVE_ORDER2);
    }
    const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
      ...CURVE2,
      toBytes(_c, point, isCompressed) {
        const a = point.toAffine();
        const x = Fp.toBytes(a.x);
        const cat = concatBytes;
        if (isCompressed) {
          return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
        } else {
          return cat(Uint8Array.from([4]), x, Fp.toBytes(a.y));
        }
      },
      fromBytes(bytes2) {
        const len = bytes2.length;
        const head = bytes2[0];
        const tail = bytes2.subarray(1);
        if (len === compressedLen && (head === 2 || head === 3)) {
          const x = bytesToNumberBE(tail);
          if (!isValidFieldElement(x))
            throw new Error("Point is not on curve");
          const y2 = weierstrassEquation(x);
          let y = Fp.sqrt(y2);
          const isYOdd = (y & _1n5) === _1n5;
          const isHeadOdd = (head & 1) === 1;
          if (isHeadOdd !== isYOdd)
            y = Fp.neg(y);
          return { x, y };
        } else if (len === uncompressedLen && head === 4) {
          const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
          const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
          return { x, y };
        } else {
          throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
        }
      }
    });
    const numToNByteStr = (num) => bytesToHex(numberToBytesBE(num, CURVE2.nByteLength));
    function isBiggerThanHalfOrder(number3) {
      const HALF = CURVE_ORDER2 >> _1n5;
      return number3 > HALF;
    }
    function normalizeS(s) {
      return isBiggerThanHalfOrder(s) ? modN(-s) : s;
    }
    const slcNum = (b, from, to) => bytesToNumberBE(b.slice(from, to));
    class Signature3 {
      constructor(r, s, recovery) {
        this.r = r;
        this.s = s;
        this.recovery = recovery;
        this.assertValidity();
      }
      // pair (bytes of r, bytes of s)
      static fromCompact(hex) {
        const l = CURVE2.nByteLength;
        hex = ensureBytes("compactSignature", hex, l * 2);
        return new Signature3(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
      }
      // DER encoded ECDSA signature
      // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
      static fromDER(hex) {
        const { r, s } = DER.toSig(ensureBytes("DER", hex));
        return new Signature3(r, s);
      }
      assertValidity() {
        if (!isWithinCurveOrder(this.r))
          throw new Error("r must be 0 < r < CURVE.n");
        if (!isWithinCurveOrder(this.s))
          throw new Error("s must be 0 < s < CURVE.n");
      }
      addRecoveryBit(recovery) {
        return new Signature3(this.r, this.s, recovery);
      }
      recoverPublicKey(msgHash) {
        const { r, s, recovery: rec } = this;
        const h = bits2int_modN(ensureBytes("msgHash", msgHash));
        if (rec == null || ![0, 1, 2, 3].includes(rec))
          throw new Error("recovery id invalid");
        const radj = rec === 2 || rec === 3 ? r + CURVE2.n : r;
        if (radj >= Fp.ORDER)
          throw new Error("recovery id 2 or 3 invalid");
        const prefix = (rec & 1) === 0 ? "02" : "03";
        const R = Point.fromHex(prefix + numToNByteStr(radj));
        const ir = invN(radj);
        const u1 = modN(-h * ir);
        const u2 = modN(s * ir);
        const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
        if (!Q)
          throw new Error("point at infinify");
        Q.assertValidity();
        return Q;
      }
      // Signatures should be low-s, to prevent malleability.
      hasHighS() {
        return isBiggerThanHalfOrder(this.s);
      }
      normalizeS() {
        return this.hasHighS() ? new Signature3(this.r, modN(-this.s), this.recovery) : this;
      }
      // DER-encoded
      toDERRawBytes() {
        return hexToBytes(this.toDERHex());
      }
      toDERHex() {
        return DER.hexFromSig({ r: this.r, s: this.s });
      }
      // padded bytes of r, then padded bytes of s
      toCompactRawBytes() {
        return hexToBytes(this.toCompactHex());
      }
      toCompactHex() {
        return numToNByteStr(this.r) + numToNByteStr(this.s);
      }
    }
    const utils2 = {
      isValidPrivateKey(privateKey) {
        try {
          normPrivateKeyToScalar(privateKey);
          return true;
        } catch (error) {
          return false;
        }
      },
      normPrivateKeyToScalar,
      /**
       * Produces cryptographically secure private key from random of size
       * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
       */
      randomPrivateKey: () => {
        const length = getMinHashLength(CURVE2.n);
        return mapHashToField(CURVE2.randomBytes(length), CURVE2.n);
      },
      /**
       * Creates precompute table for an arbitrary EC point. Makes point "cached".
       * Allows to massively speed-up `point.multiply(scalar)`.
       * @returns cached point
       * @example
       * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
       * fast.multiply(privKey); // much faster ECDH now
       */
      precompute(windowSize = 8, point = Point.BASE) {
        point._setWindowSize(windowSize);
        point.multiply(BigInt(3));
        return point;
      }
    };
    function getPublicKey2(privateKey, isCompressed = true) {
      return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
    }
    function isProbPub(item) {
      const arr = item instanceof Uint8Array;
      const str = typeof item === "string";
      const len = (arr || str) && item.length;
      if (arr)
        return len === compressedLen || len === uncompressedLen;
      if (str)
        return len === 2 * compressedLen || len === 2 * uncompressedLen;
      if (item instanceof Point)
        return true;
      return false;
    }
    function getSharedSecret2(privateA, publicB, isCompressed = true) {
      if (isProbPub(privateA))
        throw new Error("first arg must be private key");
      if (!isProbPub(publicB))
        throw new Error("second arg must be public key");
      const b = Point.fromHex(publicB);
      return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
    }
    const bits2int2 = CURVE2.bits2int || function(bytes2) {
      const num = bytesToNumberBE(bytes2);
      const delta = bytes2.length * 8 - CURVE2.nBitLength;
      return delta > 0 ? num >> BigInt(delta) : num;
    };
    const bits2int_modN = CURVE2.bits2int_modN || function(bytes2) {
      return modN(bits2int2(bytes2));
    };
    const ORDER_MASK = bitMask(CURVE2.nBitLength);
    function int2octets(num) {
      if (typeof num !== "bigint")
        throw new Error("bigint expected");
      if (!(_0n5 <= num && num < ORDER_MASK))
        throw new Error(`bigint expected < 2^${CURVE2.nBitLength}`);
      return numberToBytesBE(num, CURVE2.nByteLength);
    }
    function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
      if (["recovered", "canonical"].some((k) => k in opts))
        throw new Error("sign() legacy options not supported");
      const { hash: hash2, randomBytes: randomBytes2 } = CURVE2;
      let { lowS, prehash, extraEntropy: ent } = opts;
      if (lowS == null)
        lowS = true;
      msgHash = ensureBytes("msgHash", msgHash);
      if (prehash)
        msgHash = ensureBytes("prehashed msgHash", hash2(msgHash));
      const h1int = bits2int_modN(msgHash);
      const d = normPrivateKeyToScalar(privateKey);
      const seedArgs = [int2octets(d), int2octets(h1int)];
      if (ent != null) {
        const e = ent === true ? randomBytes2(Fp.BYTES) : ent;
        seedArgs.push(ensureBytes("extraEntropy", e));
      }
      const seed = concatBytes(...seedArgs);
      const m = h1int;
      function k2sig(kBytes) {
        const k = bits2int2(kBytes);
        if (!isWithinCurveOrder(k))
          return;
        const ik = invN(k);
        const q = Point.BASE.multiply(k).toAffine();
        const r = modN(q.x);
        if (r === _0n5)
          return;
        const s = modN(ik * modN(m + r * d));
        if (s === _0n5)
          return;
        let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n5);
        let normS = s;
        if (lowS && isBiggerThanHalfOrder(s)) {
          normS = normalizeS(s);
          recovery ^= 1;
        }
        return new Signature3(r, normS, recovery);
      }
      return { seed, k2sig };
    }
    const defaultSigOpts = { lowS: CURVE2.lowS, prehash: false };
    const defaultVerOpts = { lowS: CURVE2.lowS, prehash: false };
    function sign2(msgHash, privKey, opts = defaultSigOpts) {
      const { seed, k2sig } = prepSig(msgHash, privKey, opts);
      const C = CURVE2;
      const drbg = createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
      return drbg(seed, k2sig);
    }
    Point.BASE._setWindowSize(8);
    function verify2(signature, msgHash, publicKey, opts = defaultVerOpts) {
      const sg = signature;
      msgHash = ensureBytes("msgHash", msgHash);
      publicKey = ensureBytes("publicKey", publicKey);
      if ("strict" in opts)
        throw new Error("options.strict was renamed to lowS");
      const { lowS, prehash } = opts;
      let _sig = void 0;
      let P;
      try {
        if (typeof sg === "string" || sg instanceof Uint8Array) {
          try {
            _sig = Signature3.fromDER(sg);
          } catch (derError) {
            if (!(derError instanceof DER.Err))
              throw derError;
            _sig = Signature3.fromCompact(sg);
          }
        } else if (typeof sg === "object" && typeof sg.r === "bigint" && typeof sg.s === "bigint") {
          const { r: r2, s: s2 } = sg;
          _sig = new Signature3(r2, s2);
        } else {
          throw new Error("PARSE");
        }
        P = Point.fromHex(publicKey);
      } catch (error) {
        if (error.message === "PARSE")
          throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
        return false;
      }
      if (lowS && _sig.hasHighS())
        return false;
      if (prehash)
        msgHash = CURVE2.hash(msgHash);
      const { r, s } = _sig;
      const h = bits2int_modN(msgHash);
      const is = invN(s);
      const u1 = modN(h * is);
      const u2 = modN(r * is);
      const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine();
      if (!R)
        return false;
      const v = modN(R.x);
      return v === r;
    }
    return {
      CURVE: CURVE2,
      getPublicKey: getPublicKey2,
      getSharedSecret: getSharedSecret2,
      sign: sign2,
      verify: verify2,
      ProjectivePoint: Point,
      Signature: Signature3,
      utils: utils2
    };
  }
  function SWUFpSqrtRatio(Fp, Z) {
    const q = Fp.ORDER;
    let l = _0n5;
    for (let o = q - _1n5; o % _2n4 === _0n5; o /= _2n4)
      l += _1n5;
    const c1 = l;
    const _2n_pow_c1_1 = _2n4 << c1 - _1n5 - _1n5;
    const _2n_pow_c1 = _2n_pow_c1_1 * _2n4;
    const c2 = (q - _1n5) / _2n_pow_c1;
    const c3 = (c2 - _1n5) / _2n4;
    const c4 = _2n_pow_c1 - _1n5;
    const c5 = _2n_pow_c1_1;
    const c6 = Fp.pow(Z, c2);
    const c7 = Fp.pow(Z, (c2 + _1n5) / _2n4);
    let sqrtRatio = (u, v) => {
      let tv1 = c6;
      let tv2 = Fp.pow(v, c4);
      let tv3 = Fp.sqr(tv2);
      tv3 = Fp.mul(tv3, v);
      let tv5 = Fp.mul(u, tv3);
      tv5 = Fp.pow(tv5, c3);
      tv5 = Fp.mul(tv5, tv2);
      tv2 = Fp.mul(tv5, v);
      tv3 = Fp.mul(tv5, u);
      let tv4 = Fp.mul(tv3, tv2);
      tv5 = Fp.pow(tv4, c5);
      let isQR = Fp.eql(tv5, Fp.ONE);
      tv2 = Fp.mul(tv3, c7);
      tv5 = Fp.mul(tv4, tv1);
      tv3 = Fp.cmov(tv2, tv3, isQR);
      tv4 = Fp.cmov(tv5, tv4, isQR);
      for (let i = c1; i > _1n5; i--) {
        let tv52 = i - _2n4;
        tv52 = _2n4 << tv52 - _1n5;
        let tvv5 = Fp.pow(tv4, tv52);
        const e1 = Fp.eql(tvv5, Fp.ONE);
        tv2 = Fp.mul(tv3, tv1);
        tv1 = Fp.mul(tv1, tv1);
        tvv5 = Fp.mul(tv4, tv1);
        tv3 = Fp.cmov(tv2, tv3, e1);
        tv4 = Fp.cmov(tvv5, tv4, e1);
      }
      return { isValid: isQR, value: tv3 };
    };
    if (Fp.ORDER % _4n2 === _3n2) {
      const c12 = (Fp.ORDER - _3n2) / _4n2;
      const c22 = Fp.sqrt(Fp.neg(Z));
      sqrtRatio = (u, v) => {
        let tv1 = Fp.sqr(v);
        const tv2 = Fp.mul(u, v);
        tv1 = Fp.mul(tv1, tv2);
        let y1 = Fp.pow(tv1, c12);
        y1 = Fp.mul(y1, tv2);
        const y2 = Fp.mul(y1, c22);
        const tv3 = Fp.mul(Fp.sqr(y1), v);
        const isQR = Fp.eql(tv3, u);
        let y = Fp.cmov(y2, y1, isQR);
        return { isValid: isQR, value: y };
      };
    }
    return sqrtRatio;
  }
  function mapToCurveSimpleSWU(Fp, opts) {
    validateField(Fp);
    if (!Fp.isValid(opts.A) || !Fp.isValid(opts.B) || !Fp.isValid(opts.Z))
      throw new Error("mapToCurveSimpleSWU: invalid opts");
    const sqrtRatio = SWUFpSqrtRatio(Fp, opts.Z);
    if (!Fp.isOdd)
      throw new Error("Fp.isOdd is not implemented!");
    return (u) => {
      let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
      tv1 = Fp.sqr(u);
      tv1 = Fp.mul(tv1, opts.Z);
      tv2 = Fp.sqr(tv1);
      tv2 = Fp.add(tv2, tv1);
      tv3 = Fp.add(tv2, Fp.ONE);
      tv3 = Fp.mul(tv3, opts.B);
      tv4 = Fp.cmov(opts.Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
      tv4 = Fp.mul(tv4, opts.A);
      tv2 = Fp.sqr(tv3);
      tv6 = Fp.sqr(tv4);
      tv5 = Fp.mul(tv6, opts.A);
      tv2 = Fp.add(tv2, tv5);
      tv2 = Fp.mul(tv2, tv3);
      tv6 = Fp.mul(tv6, tv4);
      tv5 = Fp.mul(tv6, opts.B);
      tv2 = Fp.add(tv2, tv5);
      x = Fp.mul(tv1, tv3);
      const { isValid, value } = sqrtRatio(tv2, tv6);
      y = Fp.mul(tv1, u);
      y = Fp.mul(y, value);
      x = Fp.cmov(x, tv3, isValid);
      y = Fp.cmov(y, value, isValid);
      const e1 = Fp.isOdd(u) === Fp.isOdd(y);
      y = Fp.cmov(Fp.neg(y), y, e1);
      x = Fp.div(x, tv4);
      return { x, y };
    };
  }

  // node_modules/@noble/hashes/esm/hmac.js
  var HMAC = class extends Hash {
    constructor(hash2, _key) {
      super();
      this.finished = false;
      this.destroyed = false;
      hash(hash2);
      const key = toBytes(_key);
      this.iHash = hash2.create();
      if (typeof this.iHash.update !== "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen;
      this.outputLen = this.iHash.outputLen;
      const blockLen = this.blockLen;
      const pad = new Uint8Array(blockLen);
      pad.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 54;
      this.iHash.update(pad);
      this.oHash = hash2.create();
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 54 ^ 92;
      this.oHash.update(pad);
      pad.fill(0);
    }
    update(buf) {
      exists(this);
      this.iHash.update(buf);
      return this;
    }
    digestInto(out) {
      exists(this);
      bytes(out, this.outputLen);
      this.finished = true;
      this.iHash.digestInto(out);
      this.oHash.update(out);
      this.oHash.digestInto(out);
      this.destroy();
    }
    digest() {
      const out = new Uint8Array(this.oHash.outputLen);
      this.digestInto(out);
      return out;
    }
    _cloneInto(to) {
      to || (to = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
      to = to;
      to.finished = finished;
      to.destroyed = destroyed;
      to.blockLen = blockLen;
      to.outputLen = outputLen;
      to.oHash = oHash._cloneInto(to.oHash);
      to.iHash = iHash._cloneInto(to.iHash);
      return to;
    }
    destroy() {
      this.destroyed = true;
      this.oHash.destroy();
      this.iHash.destroy();
    }
  };
  var hmac = (hash2, key, message) => new HMAC(hash2, key).update(message).digest();
  hmac.create = (hash2, key) => new HMAC(hash2, key);

  // node_modules/@noble/curves/esm/_shortw_utils.js
  function getHash(hash2) {
    return {
      hash: hash2,
      hmac: (key, ...msgs) => hmac(hash2, key, concatBytes2(...msgs)),
      randomBytes
    };
  }

  // node_modules/@scure/starknet/lib/esm/index.js
  var CURVE_ORDER = BigInt("3618502788666131213697322783095070105526743751716087489154079457884512865583");
  var MAX_VALUE = BigInt("0x800000000000000000000000000000000000000000000000000000000000000");
  var nBitLength = 252;
  function bits2int(bytes2) {
    while (bytes2[0] === 0)
      bytes2 = bytes2.subarray(1);
    const delta = bytes2.length * 8 - nBitLength;
    const num = bytesToNumberBE(bytes2);
    return delta > 0 ? num >> BigInt(delta) : num;
  }
  function hex0xToBytes(hex) {
    if (typeof hex === "string") {
      hex = strip0x(hex);
      if (hex.length & 1)
        hex = "0" + hex;
    }
    return hexToBytes(hex);
  }
  var curve = weierstrass({
    a: BigInt(1),
    b: BigInt("3141592653589793238462643383279502884197169399375105820974944592307816406665"),
    Fp: Field(BigInt("0x800000000000011000000000000000000000000000000000000000000000001")),
    n: CURVE_ORDER,
    nBitLength,
    Gx: BigInt("874739451078007766457464989774322083649278607533249481151382481072868806602"),
    Gy: BigInt("152666792071518830868575557812948353041420400780739481342941381225525861407"),
    h: BigInt(1),
    lowS: false,
    ...getHash(sha256),
    bits2int,
    bits2int_modN: (bytes2) => {
      const hex = bytesToNumberBE(bytes2).toString(16);
      if (hex.length === 63)
        bytes2 = hex0xToBytes(hex + "0");
      return mod(bits2int(bytes2), CURVE_ORDER);
    }
  });
  var _starkCurve = curve;
  function ensureBytes2(hex) {
    return ensureBytes("", typeof hex === "string" ? hex0xToBytes(hex) : hex);
  }
  function normPrivKey(privKey) {
    return bytesToHex(ensureBytes2(privKey)).padStart(64, "0");
  }
  function getPublicKey(privKey, isCompressed = false) {
    return curve.getPublicKey(normPrivKey(privKey), isCompressed);
  }
  function getSharedSecret(privKeyA, pubKeyB) {
    return curve.getSharedSecret(normPrivKey(privKeyA), pubKeyB);
  }
  function checkSignature(signature) {
    const { r, s } = signature;
    if (r < 0n || r >= MAX_VALUE)
      throw new Error(`Signature.r should be [1, ${MAX_VALUE})`);
    const w = invert(s, CURVE_ORDER);
    if (w < 0n || w >= MAX_VALUE)
      throw new Error(`inv(Signature.s) should be [1, ${MAX_VALUE})`);
  }
  function checkMessage(msgHash) {
    const bytes2 = ensureBytes2(msgHash);
    const num = bytesToNumberBE(bytes2);
    if (num >= MAX_VALUE)
      throw new Error(`msgHash should be [0, ${MAX_VALUE})`);
    return bytes2;
  }
  function sign(msgHash, privKey, opts) {
    const sig = curve.sign(checkMessage(msgHash), normPrivKey(privKey), opts);
    checkSignature(sig);
    return sig;
  }
  function verify(signature, msgHash, pubKey) {
    if (!(signature instanceof Signature)) {
      const bytes2 = ensureBytes2(signature);
      try {
        signature = Signature.fromDER(bytes2);
      } catch (derError) {
        if (!(derError instanceof DER.Err))
          throw derError;
        signature = Signature.fromCompact(bytes2);
      }
    }
    checkSignature(signature);
    return curve.verify(signature, checkMessage(msgHash), ensureBytes2(pubKey));
  }
  var { CURVE, ProjectivePoint, Signature, utils } = curve;
  function extractX(bytes2) {
    const hex = bytesToHex(bytes2.subarray(1));
    const stripped = hex.replace(/^0+/gm, "");
    return `0x${stripped}`;
  }
  function strip0x(hex) {
    return hex.replace(/^0x/i, "");
  }
  function grindKey(seed) {
    const _seed = ensureBytes2(seed);
    const sha256mask = 2n ** 256n;
    const limit = sha256mask - mod(sha256mask, CURVE_ORDER);
    for (let i = 0; ; i++) {
      const key = sha256Num(concatBytes(_seed, numberToVarBytesBE(BigInt(i))));
      if (key < limit)
        return mod(key, CURVE_ORDER).toString(16);
      if (i === 1e5)
        throw new Error("grindKey is broken: tried 100k vals");
    }
  }
  function getStarkKey(privateKey) {
    return extractX(getPublicKey(privateKey, true));
  }
  function ethSigToPrivate(signature) {
    signature = strip0x(signature);
    if (signature.length !== 130)
      throw new Error("Wrong ethereum signature");
    return grindKey(signature.substring(0, 64));
  }
  var MASK_31 = 2n ** 31n - 1n;
  var int31 = (n) => Number(n & MASK_31);
  function getAccountPath(layer, application, ethereumAddress, index) {
    const layerNum = int31(sha256Num(layer));
    const applicationNum = int31(sha256Num(application));
    const eth = hexToNumber(strip0x(ethereumAddress));
    return `m/2645'/${layerNum}'/${applicationNum}'/${int31(eth)}'/${int31(eth >> 31n)}'/${index}`;
  }
  var PEDERSEN_POINTS = [
    new ProjectivePoint(2089986280348253421170679821480865132823066470938446095505822317253594081284n, 1713931329540660377023406109199410414810705867260802078187082345529207694986n, 1n),
    new ProjectivePoint(996781205833008774514500082376783249102396023663454813447423147977397232763n, 1668503676786377725805489344771023921079126552019160156920634619255970485781n, 1n),
    new ProjectivePoint(2251563274489750535117886426533222435294046428347329203627021249169616184184n, 1798716007562728905295480679789526322175868328062420237419143593021674992973n, 1n),
    new ProjectivePoint(2138414695194151160943305727036575959195309218611738193261179310511854807447n, 113410276730064486255102093846540133784865286929052426931474106396135072156n, 1n),
    new ProjectivePoint(2379962749567351885752724891227938183011949129833673362440656643086021394946n, 776496453633298175483985398648758586525933812536653089401905292063708816422n, 1n)
  ];
  function pedersenPrecompute(p1, p2) {
    const out = [];
    let p = p1;
    for (let i = 0; i < 248; i++) {
      out.push(p);
      p = p.double();
    }
    p = p2;
    for (let i = 0; i < 4; i++) {
      out.push(p);
      p = p.double();
    }
    return out;
  }
  var PEDERSEN_POINTS1 = pedersenPrecompute(PEDERSEN_POINTS[1], PEDERSEN_POINTS[2]);
  var PEDERSEN_POINTS2 = pedersenPrecompute(PEDERSEN_POINTS[3], PEDERSEN_POINTS[4]);
  function pedersenArg(arg) {
    let value;
    if (typeof arg === "bigint") {
      value = arg;
    } else if (typeof arg === "number") {
      if (!Number.isSafeInteger(arg))
        throw new Error(`Invalid pedersenArg: ${arg}`);
      value = BigInt(arg);
    } else {
      value = bytesToNumberBE(ensureBytes2(arg));
    }
    if (!(0n <= value && value < curve.CURVE.Fp.ORDER))
      throw new Error(`PedersenArg should be 0 <= value < CURVE.P: ${value}`);
    return value;
  }
  function pedersenSingle(point, value, constants2) {
    let x = pedersenArg(value);
    for (let j = 0; j < 252; j++) {
      const pt = constants2[j];
      if (pt.equals(point))
        throw new Error("Same point");
      if ((x & 1n) !== 0n)
        point = point.add(pt);
      x >>= 1n;
    }
    return point;
  }
  function pedersen(x, y) {
    let point = PEDERSEN_POINTS[0];
    point = pedersenSingle(point, x, PEDERSEN_POINTS1);
    point = pedersenSingle(point, y, PEDERSEN_POINTS2);
    return extractX(point.toRawBytes(true));
  }
  var computeHashOnElements = (data, fn = pedersen) => [0, ...data, data.length].reduce((x, y) => fn(x, y));
  var MASK_2502 = bitMask(250);
  var keccak = (data) => bytesToNumberBE(keccak_256(data)) & MASK_2502;
  var sha256Num = (data) => bytesToNumberBE(sha256(data));
  var Fp251 = Field(BigInt("3618502788666131213697322783095070105623107215331596699973092056135872020481"));
  function poseidonRoundConstant(Fp, name, idx) {
    const val = Fp.fromBytes(sha256(utf8ToBytes2(`${name}${idx}`)));
    return Fp.create(val);
  }
  function _poseidonMDS(Fp, name, m, attempt = 0) {
    const x_values = [];
    const y_values = [];
    for (let i = 0; i < m; i++) {
      x_values.push(poseidonRoundConstant(Fp, `${name}x`, attempt * m + i));
      y_values.push(poseidonRoundConstant(Fp, `${name}y`, attempt * m + i));
    }
    if ((/* @__PURE__ */ new Set([...x_values, ...y_values])).size !== 2 * m)
      throw new Error("X and Y values are not distinct");
    return x_values.map((x) => y_values.map((y) => Fp.inv(Fp.sub(x, y))));
  }
  var MDS_SMALL = [
    [3, 1, 1],
    [1, -1, 1],
    [1, 1, -2]
  ].map((i) => i.map(BigInt));
  function poseidonBasic(opts, mds) {
    validateField(opts.Fp);
    if (!Number.isSafeInteger(opts.rate) || !Number.isSafeInteger(opts.capacity))
      throw new Error(`Wrong poseidon opts: ${opts}`);
    const m = opts.rate + opts.capacity;
    const rounds = opts.roundsFull + opts.roundsPartial;
    const roundConstants = [];
    for (let i = 0; i < rounds; i++) {
      const row = [];
      for (let j = 0; j < m; j++)
        row.push(poseidonRoundConstant(opts.Fp, "Hades", m * i + j));
      roundConstants.push(row);
    }
    const res = poseidon({
      ...opts,
      t: m,
      sboxPower: 3,
      reversePartialPowIdx: true,
      mds,
      roundConstants
    });
    res.m = m;
    res.rate = opts.rate;
    res.capacity = opts.capacity;
    return res;
  }
  function poseidonCreate(opts, mdsAttempt = 0) {
    const m = opts.rate + opts.capacity;
    if (!Number.isSafeInteger(mdsAttempt))
      throw new Error(`Wrong mdsAttempt=${mdsAttempt}`);
    return poseidonBasic(opts, _poseidonMDS(opts.Fp, "HadesMDS", m, mdsAttempt));
  }
  var poseidonSmall = poseidonBasic({ Fp: Fp251, rate: 2, capacity: 1, roundsFull: 8, roundsPartial: 83 }, MDS_SMALL);
  function poseidonHash(x, y, fn = poseidonSmall) {
    return fn([x, y, 2n])[0];
  }
  function poseidonHashFunc(x, y, fn = poseidonSmall) {
    return numberToVarBytesBE(poseidonHash(bytesToNumberBE(x), bytesToNumberBE(y), fn));
  }
  function poseidonHashSingle(x, fn = poseidonSmall) {
    return fn([x, 0n, 1n])[0];
  }
  function poseidonHashMany(values, fn = poseidonSmall) {
    const { m, rate } = fn;
    if (!Array.isArray(values))
      throw new Error("bigint array expected in values");
    const padded = Array.from(values);
    padded.push(1n);
    while (padded.length % rate !== 0)
      padded.push(0n);
    let state = new Array(m).fill(0n);
    for (let i = 0; i < padded.length; i += rate) {
      for (let j = 0; j < rate; j++)
        state[j] += padded[i + j];
      state = fn(state);
    }
    return state[0];
  }

  // src/utils/selector.ts
  function keccakBn(value) {
    const hexWithoutPrefix = removeHexPrefix(toHex(BigInt(value)));
    const evenHex = hexWithoutPrefix.length % 2 === 0 ? hexWithoutPrefix : `0${hexWithoutPrefix}`;
    return addHexPrefix(keccak(hexToBytes2(addHexPrefix(evenHex))).toString(16));
  }
  function keccakHex(str) {
    return addHexPrefix(keccak(utf8ToArray(str)).toString(16));
  }
  function starknetKeccak(str) {
    const hash2 = BigInt(keccakHex(str));
    return hash2 & MASK_250;
  }
  function getSelectorFromName(funcName) {
    return toHex(starknetKeccak(funcName));
  }
  function getSelector(value) {
    if (isHex(value)) {
      return value;
    }
    if (isStringWholeNumber(value)) {
      return toHexString(value);
    }
    return getSelectorFromName(value);
  }

  // src/utils/shortString.ts
  var shortString_exports = {};
  __export(shortString_exports, {
    decodeShortString: () => decodeShortString,
    encodeShortString: () => encodeShortString,
    isASCII: () => isASCII,
    isDecimalString: () => isDecimalString,
    isLongText: () => isLongText,
    isShortString: () => isShortString,
    isShortText: () => isShortText,
    isText: () => isText,
    splitLongString: () => splitLongString
  });
  function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
  }
  function isShortString(str) {
    return str.length <= TEXT_TO_FELT_MAX_LEN;
  }
  function isDecimalString(str) {
    return /^[0-9]*$/i.test(str);
  }
  function isText(val) {
    return typeof val === "string" && !isHex(val) && !isStringWholeNumber(val);
  }
  var isShortText = (val) => isText(val) && isShortString(val);
  var isLongText = (val) => isText(val) && !isShortString(val);
  function splitLongString(longStr) {
    const regex = RegExp(`[^]{1,${TEXT_TO_FELT_MAX_LEN}}`, "g");
    return longStr.match(regex) || [];
  }
  function encodeShortString(str) {
    if (!isASCII(str))
      throw new Error(`${str} is not an ASCII string`);
    if (!isShortString(str))
      throw new Error(`${str} is too long`);
    return addHexPrefix(str.replace(/./g, (char) => char.charCodeAt(0).toString(16)));
  }
  function decodeShortString(str) {
    if (!isASCII(str))
      throw new Error(`${str} is not an ASCII string`);
    if (isHex(str)) {
      return removeHexPrefix(str).replace(/.{2}/g, (hex) => String.fromCharCode(parseInt(hex, 16)));
    }
    if (isDecimalString(str)) {
      return decodeShortString("0X".concat(BigInt(str).toString(16)));
    }
    throw new Error(`${str} is not Hex or decimal`);
  }

  // src/utils/calldata/cairo.ts
  var cairo_exports = {};
  __export(cairo_exports, {
    felt: () => felt,
    getArrayType: () => getArrayType,
    isCairo1Abi: () => isCairo1Abi,
    isCairo1Type: () => isCairo1Type,
    isLen: () => isLen,
    isTypeArray: () => isTypeArray,
    isTypeBool: () => isTypeBool,
    isTypeContractAddress: () => isTypeContractAddress,
    isTypeEnum: () => isTypeEnum,
    isTypeEthAddress: () => isTypeEthAddress,
    isTypeFelt: () => isTypeFelt,
    isTypeLitteral: () => isTypeLitteral,
    isTypeNamedTuple: () => isTypeNamedTuple,
    isTypeOption: () => isTypeOption,
    isTypeResult: () => isTypeResult,
    isTypeStruct: () => isTypeStruct,
    isTypeTuple: () => isTypeTuple,
    isTypeUint: () => isTypeUint,
    isTypeUint256: () => isTypeUint256,
    tuple: () => tuple,
    uint256: () => uint256
  });

  // src/utils/uint256.ts
  var uint256_exports = {};
  __export(uint256_exports, {
    UINT_128_MAX: () => UINT_128_MAX,
    UINT_256_MAX: () => UINT_256_MAX,
    bnToUint256: () => bnToUint256,
    isUint256: () => isUint256,
    uint256ToBN: () => uint256ToBN
  });
  var UINT_128_MAX = (1n << 128n) - 1n;
  var UINT_256_MAX = (1n << 256n) - 1n;
  function uint256ToBN(uint2562) {
    return (toBigInt(uint2562.high) << 128n) + toBigInt(uint2562.low);
  }
  function isUint256(bn) {
    return toBigInt(bn) <= UINT_256_MAX;
  }
  function bnToUint256(bn) {
    const bi = toBigInt(bn);
    if (!isUint256(bi))
      throw new Error("Number is too large");
    return {
      low: addHexPrefix((bi & UINT_128_MAX).toString(16)),
      high: addHexPrefix((bi >> 128n).toString(16))
    };
  }

  // src/utils/calldata/cairo.ts
  var isLen = (name) => /_len$/.test(name);
  var isTypeFelt = (type) => type === "felt" || type === "core::felt252";
  var isTypeArray = (type) => /\*/.test(type) || type.startsWith("core::array::Array::") || type.startsWith("core::array::Span::");
  var isTypeTuple = (type) => /^\(.*\)$/i.test(type);
  var isTypeNamedTuple = (type) => /\(.*\)/i.test(type) && type.includes(":");
  var isTypeStruct = (type, structs) => type in structs;
  var isTypeEnum = (type, enums) => type in enums;
  var isTypeOption = (type) => type.startsWith("core::option::Option::");
  var isTypeResult = (type) => type.startsWith("core::result::Result::");
  var isTypeUint = (type) => Object.values(Uint).includes(type);
  var isTypeLitteral = (type) => Object.values(Litteral).includes(type);
  var isTypeUint256 = (type) => type === "core::integer::u256";
  var isTypeBool = (type) => type === "core::bool";
  var isTypeContractAddress = (type) => type === "core::starknet::contract_address::ContractAddress";
  var isTypeEthAddress = (type) => type === "core::starknet::eth_address::EthAddress";
  var isCairo1Type = (type) => type.includes("core::");
  var getArrayType = (type) => {
    if (isCairo1Type(type)) {
      return type.substring(type.indexOf("<") + 1, type.lastIndexOf(">"));
    }
    return type.replace("*", "");
  };
  function isCairo1Abi(abi) {
    const firstFunction = abi.find((entry) => entry.type === "function");
    if (!firstFunction) {
      if (abi.find((it) => it.type === "interface")) {
        return true;
      }
      throw new Error(`Error in ABI. No function in ABI.`);
    }
    if (firstFunction.inputs.length) {
      return isCairo1Type(firstFunction.inputs[0].type);
    }
    if (firstFunction.outputs.length) {
      return isCairo1Type(firstFunction.outputs[0].type);
    }
    throw new Error(`Error in ABI. No input/output in function ${firstFunction.name}`);
  }
  var uint256 = (it) => {
    const bn = BigInt(it);
    if (!isUint256(bn))
      throw new Error("Number is too large");
    return {
      // eslint-disable-next-line no-bitwise
      low: (bn & UINT_128_MAX).toString(10),
      // eslint-disable-next-line no-bitwise
      high: (bn >> 128n).toString(10)
    };
  };
  var tuple = (...args) => ({ ...args });
  function felt(it) {
    if (isBigInt(it) || typeof it === "number" && Number.isInteger(it)) {
      return it.toString();
    }
    if (isText(it)) {
      if (!isShortString(it))
        throw new Error(
          `${it} is a long string > 31 chars, felt can store short strings, split it to array of short strings`
        );
      const encoded = encodeShortString(it);
      return BigInt(encoded).toString();
    }
    if (typeof it === "string" && isHex(it)) {
      return BigInt(it).toString();
    }
    if (typeof it === "string" && isStringWholeNumber(it)) {
      return it;
    }
    if (typeof it === "boolean") {
      return `${+it}`;
    }
    throw new Error(`${it} can't be computed by felt()`);
  }

  // src/utils/calldata/enum/CairoCustomEnum.ts
  var CairoCustomEnum = class {
    /**
     * @param enumContent an object with the variants as keys and the content as value. Only one content shall be defined.
     */
    constructor(enumContent) {
      const variantsList = Object.values(enumContent);
      if (variantsList.length === 0) {
        throw new Error("This Enum must have a least 1 variant");
      }
      const nbActiveVariants = variantsList.filter(
        (content) => typeof content !== "undefined"
      ).length;
      if (nbActiveVariants !== 1) {
        throw new Error("This Enum must have exactly one active variant");
      }
      this.variant = enumContent;
    }
    /**
     *
     * @returns the content of the valid variant of a Cairo custom Enum.
     */
    unwrap() {
      const variants = Object.entries(this.variant);
      const activeVariant = variants.find((item) => typeof item[1] !== "undefined");
      if (typeof activeVariant === "undefined") {
        return void 0;
      }
      return activeVariant[1];
    }
    /**
     *
     * @returns the name of the valid variant of a Cairo custom Enum.
     */
    activeVariant() {
      const variants = Object.entries(this.variant);
      const activeVariant = variants.find((item) => typeof item[1] !== "undefined");
      if (typeof activeVariant === "undefined") {
        return "";
      }
      return activeVariant[0];
    }
  };

  // src/utils/calldata/enum/CairoOption.ts
  var CairoOptionVariant = /* @__PURE__ */ ((CairoOptionVariant2) => {
    CairoOptionVariant2[CairoOptionVariant2["Some"] = 0] = "Some";
    CairoOptionVariant2[CairoOptionVariant2["None"] = 1] = "None";
    return CairoOptionVariant2;
  })(CairoOptionVariant || {});
  var CairoOption = class {
    constructor(variant, someContent) {
      if (!(variant in CairoOptionVariant)) {
        throw new Error("Wrong variant : should be CairoOptionVariant.Some or .None.");
      }
      if (variant === 0 /* Some */) {
        if (typeof someContent === "undefined") {
          throw new Error(
            'The creation of a Cairo Option with "Some" variant needs a content as input.'
          );
        }
        this.Some = someContent;
        this.None = void 0;
      } else {
        this.Some = void 0;
        this.None = true;
      }
    }
    /**
     *
     * @returns the content of the valid variant of a Cairo custom Enum.
     *  If None, returns 'undefined'.
     */
    unwrap() {
      if (this.None) {
        return void 0;
      }
      return this.Some;
    }
    /**
     *
     * @returns true if the valid variant is 'isSome'.
     */
    isSome() {
      return !(typeof this.Some === "undefined");
    }
    /**
     *
     * @returns true if the valid variant is 'isNone'.
     */
    isNone() {
      return this.None === true;
    }
  };

  // src/utils/calldata/enum/CairoResult.ts
  var CairoResultVariant = /* @__PURE__ */ ((CairoResultVariant2) => {
    CairoResultVariant2[CairoResultVariant2["Ok"] = 0] = "Ok";
    CairoResultVariant2[CairoResultVariant2["Err"] = 1] = "Err";
    return CairoResultVariant2;
  })(CairoResultVariant || {});
  var CairoResult = class {
    constructor(variant, resultContent) {
      if (!(variant in CairoResultVariant)) {
        throw new Error("Wrong variant : should be CairoResultVariant.Ok or .Err.");
      }
      if (variant === 0 /* Ok */) {
        this.Ok = resultContent;
        this.Err = void 0;
      } else {
        this.Ok = void 0;
        this.Err = resultContent;
      }
    }
    /**
     *
     * @returns the content of the valid variant of a Cairo Result.
     */
    unwrap() {
      if (typeof this.Ok !== "undefined") {
        return this.Ok;
      }
      if (typeof this.Err !== "undefined") {
        return this.Err;
      }
      throw new Error("Both Result.Ok and .Err are undefined. Not authorized.");
    }
    /**
     *
     * @returns true if the valid variant is 'Ok'.
     */
    isOk() {
      return !(typeof this.Ok === "undefined");
    }
    /**
     *
     * @returns true if the valid variant is 'isErr'.
     */
    isErr() {
      return !(typeof this.Err === "undefined");
    }
  };

  // src/utils/calldata/formatter.ts
  var guard = {
    isBN: (data, type, key) => {
      if (!isBigInt(data[key]))
        throw new Error(
          `Data and formatter mismatch on ${key}:${type[key]}, expected response data ${key}:${data[key]} to be BN instead it is ${typeof data[key]}`
        );
    },
    unknown: (data, type, key) => {
      throw new Error(`Unhandled formatter type on ${key}:${type[key]} for data ${key}:${data[key]}`);
    }
  };
  function formatter(data, type, sameType) {
    return Object.entries(data).reduce((acc, [key, value]) => {
      const elType = sameType ?? type[key];
      if (!(key in type) && !sameType) {
        acc[key] = value;
        return acc;
      }
      if (elType === "string") {
        if (Array.isArray(data[key])) {
          const arrayStr = formatter(
            data[key],
            data[key].map((_) => elType)
          );
          acc[key] = Object.values(arrayStr).join("");
          return acc;
        }
        guard.isBN(data, type, key);
        acc[key] = decodeShortString(value);
        return acc;
      }
      if (elType === "number") {
        guard.isBN(data, type, key);
        acc[key] = Number(value);
        return acc;
      }
      if (typeof elType === "function") {
        acc[key] = elType(value);
        return acc;
      }
      if (Array.isArray(elType)) {
        const arrayObj = formatter(data[key], elType, elType[0]);
        acc[key] = Object.values(arrayObj);
        return acc;
      }
      if (typeof elType === "object") {
        acc[key] = formatter(data[key], elType);
        return acc;
      }
      guard.unknown(data, type, key);
      return acc;
    }, {});
  }

  // src/utils/calldata/parser/parser-0-1.1.0.ts
  var AbiParser1 = class {
    constructor(abi) {
      this.abi = abi;
    }
    /**
     * abi method inputs length without '_len' inputs
     * cairo 0 reducer
     * @param abiMethod FunctionAbi
     * @returns number
     */
    methodInputsLength(abiMethod) {
      return abiMethod.inputs.reduce((acc, input) => !isLen(input.name) ? acc + 1 : acc, 0);
    }
    /**
     * get method definition from abi
     * @param name string
     * @returns FunctionAbi | undefined
     */
    getMethod(name) {
      return this.abi.find((it) => it.name === name);
    }
    /**
     * Get Abi in legacy format
     * @returns Abi
     */
    getLegacyFormat() {
      return this.abi;
    }
  };

  // src/utils/calldata/parser/parser-2.0.0.ts
  var AbiParser2 = class {
    constructor(abi) {
      this.abi = abi;
    }
    /**
     * abi method inputs length
     * @param abiMethod FunctionAbi
     * @returns number
     */
    methodInputsLength(abiMethod) {
      return abiMethod.inputs.length;
    }
    /**
     * get method definition from abi
     * @param name string
     * @returns FunctionAbi | undefined
     */
    getMethod(name) {
      const intf = this.abi.find((it) => it.type === "interface");
      return intf.items.find((it) => it.name === name);
    }
    /**
     * Get Abi in legacy format
     * @returns Abi
     */
    getLegacyFormat() {
      return this.abi.flatMap((e) => {
        if (e.type === "interface") {
          return e.items;
        }
        return e;
      });
    }
  };

  // src/utils/calldata/parser/index.ts
  function createAbiParser(abi) {
    const version = getAbiVersion(abi);
    if (version === 0 || version === 1) {
      return new AbiParser1(abi);
    }
    if (version === 2) {
      return new AbiParser2(abi);
    }
    throw Error(`Unsupported ABI version ${version}`);
  }
  function getAbiVersion(abi) {
    if (abi.find((it) => it.type === "interface"))
      return 2;
    if (isCairo1Abi(abi))
      return 1;
    return 0;
  }
  function isNoConstructorValid(method, argsCalldata, abiMethod) {
    return method === "constructor" && !abiMethod && !argsCalldata.length;
  }

  // src/utils/calldata/tuple.ts
  function parseNamedTuple(namedTuple) {
    const name = namedTuple.substring(0, namedTuple.indexOf(":"));
    const type = namedTuple.substring(name.length + ":".length);
    return { name, type };
  }
  function parseSubTuple(s) {
    if (!s.includes("("))
      return { subTuple: [], result: s };
    const subTuple = [];
    let result = "";
    let i = 0;
    while (i < s.length) {
      if (s[i] === "(") {
        let counter = 1;
        const lBracket = i;
        i++;
        while (counter) {
          if (s[i] === ")")
            counter--;
          if (s[i] === "(")
            counter++;
          i++;
        }
        subTuple.push(s.substring(lBracket, i));
        result += " ";
        i--;
      } else {
        result += s[i];
      }
      i++;
    }
    return {
      subTuple,
      result
    };
  }
  function extractCairo0Tuple(type) {
    const cleanType = type.replace(/\s/g, "").slice(1, -1);
    const { subTuple, result } = parseSubTuple(cleanType);
    let recomposed = result.split(",").map((it) => {
      return subTuple.length ? it.replace(" ", subTuple.shift()) : it;
    });
    if (isTypeNamedTuple(type)) {
      recomposed = recomposed.reduce((acc, it) => {
        return acc.concat(parseNamedTuple(it));
      }, []);
    }
    return recomposed;
  }
  function extractCairo1Tuple(type) {
    const cleanType = type.replace(/\s/g, "").slice(1, -1);
    const { subTuple, result } = parseSubTuple(cleanType);
    const recomposed = result.split(",").map((it) => {
      return subTuple.length ? it.replace(" ", subTuple.shift()) : it;
    });
    return recomposed;
  }
  function extractTupleMemberTypes(type) {
    if (isCairo1Type(type)) {
      return extractCairo1Tuple(type);
    }
    return extractCairo0Tuple(type);
  }

  // src/utils/calldata/propertyOrder.ts
  function errorU256(key) {
    return Error(
      `Your object includes the property : ${key}, containing an Uint256 object without the 'low' and 'high' keys.`
    );
  }
  function orderPropsByAbi(unorderedObject, abiOfObject, structs, enums) {
    const orderInput = (unorderedItem, abiType) => {
      if (isTypeArray(abiType)) {
        return orderArray(unorderedItem, abiType);
      }
      if (isTypeEnum(abiType, enums)) {
        const abiObj = enums[abiType];
        return orderEnum(unorderedItem, abiObj);
      }
      if (isTypeTuple(abiType)) {
        return orderTuple(unorderedItem, abiType);
      }
      if (isTypeEthAddress(abiType)) {
        return unorderedItem;
      }
      if (isTypeUint256(abiType)) {
        const u256 = unorderedItem;
        if (typeof u256 !== "object") {
          return u256;
        }
        if (!("low" in u256 && "high" in u256)) {
          throw errorU256(abiType);
        }
        return { low: u256.low, high: u256.high };
      }
      if (isTypeStruct(abiType, structs)) {
        const abiOfStruct = structs[abiType].members;
        return orderStruct(unorderedItem, abiOfStruct);
      }
      return unorderedItem;
    };
    const orderStruct = (unorderedObject2, abiObject) => {
      const orderedObject2 = abiObject.reduce((orderedObject, abiParam) => {
        const setProperty = (value) => Object.defineProperty(orderedObject, abiParam.name, {
          enumerable: true,
          value: value ?? unorderedObject2[abiParam.name]
        });
        if (unorderedObject2[abiParam.name] === "undefined") {
          if (isCairo1Type(abiParam.type) || !isLen(abiParam.name)) {
            throw Error(`Your object needs a property with key : ${abiParam.name} .`);
          }
        }
        setProperty(orderInput(unorderedObject2[abiParam.name], abiParam.type));
        return orderedObject;
      }, {});
      return orderedObject2;
    };
    function orderArray(myArray, abiParam) {
      const typeInArray = getArrayType(abiParam);
      if (typeof myArray === "string") {
        return myArray;
      }
      return myArray.map((myElem) => orderInput(myElem, typeInArray));
    }
    function orderTuple(unorderedObject2, abiParam) {
      const typeList = extractTupleMemberTypes(abiParam);
      const orderedObject2 = typeList.reduce((orderedObject, abiTypeCairoX, index) => {
        const myObjKeys = Object.keys(unorderedObject2);
        const setProperty = (value) => Object.defineProperty(orderedObject, index.toString(), {
          enumerable: true,
          value: value ?? unorderedObject2[myObjKeys[index]]
        });
        const abiType = abiTypeCairoX?.type ? abiTypeCairoX.type : abiTypeCairoX;
        setProperty(orderInput(unorderedObject2[myObjKeys[index]], abiType));
        return orderedObject;
      }, {});
      return orderedObject2;
    }
    const orderEnum = (unorderedObject2, abiObject) => {
      if (isTypeResult(abiObject.name)) {
        const unorderedResult = unorderedObject2;
        const resultOkType = abiObject.name.substring(
          abiObject.name.indexOf("<") + 1,
          abiObject.name.lastIndexOf(",")
        );
        const resultErrType = abiObject.name.substring(
          abiObject.name.indexOf(",") + 1,
          abiObject.name.lastIndexOf(">")
        );
        if (unorderedResult.isOk()) {
          return new CairoResult(
            0 /* Ok */,
            orderInput(unorderedObject2.unwrap(), resultOkType)
          );
        }
        return new CairoResult(
          1 /* Err */,
          orderInput(unorderedObject2.unwrap(), resultErrType)
        );
      }
      if (isTypeOption(abiObject.name)) {
        const unorderedOption = unorderedObject2;
        const resultSomeType = abiObject.name.substring(
          abiObject.name.indexOf("<") + 1,
          abiObject.name.lastIndexOf(">")
        );
        if (unorderedOption.isSome()) {
          return new CairoOption(
            0 /* Some */,
            orderInput(unorderedOption.unwrap(), resultSomeType)
          );
        }
        return new CairoOption(1 /* None */, {});
      }
      const unorderedCustomEnum = unorderedObject2;
      const variants = Object.entries(unorderedCustomEnum.variant);
      const newEntries = variants.map((variant) => {
        if (typeof variant[1] === "undefined") {
          return variant;
        }
        const variantType = abiObject.type.substring(
          abiObject.type.lastIndexOf("<") + 1,
          abiObject.type.lastIndexOf(">")
        );
        if (variantType === "()") {
          return variant;
        }
        return [variant[0], orderInput(unorderedCustomEnum.unwrap(), variantType)];
      });
      return new CairoCustomEnum(Object.fromEntries(newEntries));
    };
    const finalOrderedObject = abiOfObject.reduce((orderedObject, abiParam) => {
      const setProperty = (value) => Object.defineProperty(orderedObject, abiParam.name, {
        enumerable: true,
        value
      });
      if (isLen(abiParam.name)) {
        return orderedObject;
      }
      setProperty(orderInput(unorderedObject[abiParam.name], abiParam.type));
      return orderedObject;
    }, {});
    return finalOrderedObject;
  }

  // src/utils/calldata/requestParser.ts
  function parseBaseTypes(type, val) {
    switch (true) {
      case isTypeUint256(type):
        const el_uint256 = uint256(val);
        return [felt(el_uint256.low), felt(el_uint256.high)];
      default:
        return felt(val);
    }
  }
  function parseTuple(element, typeStr) {
    const memberTypes = extractTupleMemberTypes(typeStr);
    const elements = Object.values(element);
    if (elements.length !== memberTypes.length) {
      throw Error(
        `ParseTuple: provided and expected abi tuple size do not match.
      provided: ${elements} 
      expected: ${memberTypes}`
      );
    }
    return memberTypes.map((it, dx) => {
      return {
        element: elements[dx],
        type: it.type ?? it
      };
    });
  }
  function parseUint256(element) {
    if (typeof element === "object") {
      const { low, high } = element;
      return [felt(low), felt(high)];
    }
    const el_uint256 = uint256(element);
    return [felt(el_uint256.low), felt(el_uint256.high)];
  }
  function parseCalldataValue(element, type, structs, enums) {
    if (element === void 0) {
      throw Error(`Missing parameter for type ${type}`);
    }
    if (Array.isArray(element)) {
      const result = [];
      result.push(felt(element.length));
      const arrayType = getArrayType(type);
      return element.reduce((acc, it) => {
        return acc.concat(parseCalldataValue(it, arrayType, structs, enums));
      }, result);
    }
    if (structs[type] && structs[type].members.length) {
      if (isTypeUint256(type)) {
        return parseUint256(element);
      }
      if (type === "core::starknet::eth_address::EthAddress")
        return parseBaseTypes(type, element);
      const { members } = structs[type];
      const subElement = element;
      return members.reduce((acc, it) => {
        return acc.concat(parseCalldataValue(subElement[it.name], it.type, structs, enums));
      }, []);
    }
    if (isTypeTuple(type)) {
      const tupled = parseTuple(element, type);
      return tupled.reduce((acc, it) => {
        const parsedData = parseCalldataValue(it.element, it.type, structs, enums);
        return acc.concat(parsedData);
      }, []);
    }
    if (isTypeUint256(type)) {
      return parseUint256(element);
    }
    if (isTypeEnum(type, enums)) {
      const { variants } = enums[type];
      if (isTypeOption(type)) {
        const myOption = element;
        if (myOption.isSome()) {
          const listTypeVariant2 = variants.find((variant) => variant.name === "Some");
          if (typeof listTypeVariant2 === "undefined") {
            throw Error(`Error in abi : Option has no 'Some' variant.`);
          }
          const typeVariantSome = listTypeVariant2.type;
          if (typeVariantSome === "()") {
            return 0 /* Some */.toString();
          }
          const parsedParameter2 = parseCalldataValue(
            myOption.unwrap(),
            typeVariantSome,
            structs,
            enums
          );
          if (Array.isArray(parsedParameter2)) {
            return [0 /* Some */.toString(), ...parsedParameter2];
          }
          return [0 /* Some */.toString(), parsedParameter2];
        }
        return 1 /* None */.toString();
      }
      if (isTypeResult(type)) {
        const myResult = element;
        if (myResult.isOk()) {
          const listTypeVariant3 = variants.find((variant) => variant.name === "Ok");
          if (typeof listTypeVariant3 === "undefined") {
            throw Error(`Error in abi : Result has no 'Ok' variant.`);
          }
          const typeVariantOk = listTypeVariant3.type;
          if (typeVariantOk === "()") {
            return 0 /* Ok */.toString();
          }
          const parsedParameter3 = parseCalldataValue(
            myResult.unwrap(),
            typeVariantOk,
            structs,
            enums
          );
          if (Array.isArray(parsedParameter3)) {
            return [0 /* Ok */.toString(), ...parsedParameter3];
          }
          return [0 /* Ok */.toString(), parsedParameter3];
        }
        const listTypeVariant2 = variants.find((variant) => variant.name === "Err");
        if (typeof listTypeVariant2 === "undefined") {
          throw Error(`Error in abi : Result has no 'Err' variant.`);
        }
        const typeVariantErr = listTypeVariant2.type;
        if (typeVariantErr === "()") {
          return 1 /* Err */.toString();
        }
        const parsedParameter2 = parseCalldataValue(myResult.unwrap(), typeVariantErr, structs, enums);
        if (Array.isArray(parsedParameter2)) {
          return [1 /* Err */.toString(), ...parsedParameter2];
        }
        return [1 /* Err */.toString(), parsedParameter2];
      }
      const myEnum = element;
      const activeVariant = myEnum.activeVariant();
      const listTypeVariant = variants.find((variant) => variant.name === activeVariant);
      if (typeof listTypeVariant === "undefined") {
        throw Error(`Not find in abi : Enum has no '${activeVariant}' variant.`);
      }
      const typeActiveVariant = listTypeVariant.type;
      const numActiveVariant = variants.findIndex((variant) => variant.name === activeVariant);
      if (typeActiveVariant === "()") {
        return numActiveVariant.toString();
      }
      const parsedParameter = parseCalldataValue(myEnum.unwrap(), typeActiveVariant, structs, enums);
      if (Array.isArray(parsedParameter)) {
        return [numActiveVariant.toString(), ...parsedParameter];
      }
      return [numActiveVariant.toString(), parsedParameter];
    }
    if (typeof element === "object") {
      throw Error(`Parameter ${element} do not align with abi parameter ${type}`);
    }
    return parseBaseTypes(type, element);
  }
  function parseCalldataField(argsIterator, input, structs, enums) {
    const { name, type } = input;
    let { value } = argsIterator.next();
    switch (true) {
      case isTypeArray(type):
        if (!Array.isArray(value) && !isText(value)) {
          throw Error(`ABI expected parameter ${name} to be array or long string, got ${value}`);
        }
        if (typeof value === "string") {
          value = splitLongString(value);
        }
        return parseCalldataValue(value, input.type, structs, enums);
      case type === "core::starknet::eth_address::EthAddress":
        return parseBaseTypes(type, value);
      case (isTypeStruct(type, structs) || isTypeTuple(type) || isTypeUint256(type)):
        return parseCalldataValue(value, type, structs, enums);
      case isTypeEnum(type, enums):
        return parseCalldataValue(
          value,
          type,
          structs,
          enums
        );
      default:
        return parseBaseTypes(type, value);
    }
  }

  // src/utils/calldata/responseParser.ts
  function parseBaseTypes2(type, it) {
    let temp;
    switch (true) {
      case isTypeBool(type):
        temp = it.next().value;
        return Boolean(BigInt(temp));
      case isTypeUint256(type):
        const low = it.next().value;
        const high = it.next().value;
        return uint256ToBN({ low, high });
      case type === "core::starknet::eth_address::EthAddress":
        temp = it.next().value;
        return BigInt(temp);
      default:
        temp = it.next().value;
        return BigInt(temp);
    }
  }
  function parseResponseValue(responseIterator, element, structs, enums) {
    if (element.type === "()") {
      return {};
    }
    if (isTypeUint256(element.type)) {
      const low = responseIterator.next().value;
      const high = responseIterator.next().value;
      return uint256ToBN({ low, high });
    }
    if (isTypeArray(element.type)) {
      const parsedDataArr = [];
      const el = { name: "", type: getArrayType(element.type) };
      const len = BigInt(responseIterator.next().value);
      while (parsedDataArr.length < len) {
        parsedDataArr.push(parseResponseValue(responseIterator, el, structs, enums));
      }
      return parsedDataArr;
    }
    if (structs && element.type in structs && structs[element.type]) {
      if (element.type === "core::starknet::eth_address::EthAddress") {
        return parseBaseTypes2(element.type, responseIterator);
      }
      return structs[element.type].members.reduce((acc, el) => {
        acc[el.name] = parseResponseValue(responseIterator, el, structs, enums);
        return acc;
      }, {});
    }
    if (enums && element.type in enums && enums[element.type]) {
      const variantNum = Number(responseIterator.next().value);
      const rawEnum = enums[element.type].variants.reduce((acc, variant, num) => {
        if (num === variantNum) {
          acc[variant.name] = parseResponseValue(
            responseIterator,
            { name: "", type: variant.type },
            structs,
            enums
          );
          return acc;
        }
        acc[variant.name] = void 0;
        return acc;
      }, {});
      if (element.type.startsWith("core::option::Option")) {
        const content = variantNum === 0 /* Some */ ? rawEnum.Some : void 0;
        return new CairoOption(variantNum, content);
      }
      if (element.type.startsWith("core::result::Result")) {
        let content;
        if (variantNum === 0 /* Ok */) {
          content = rawEnum.Ok;
        } else {
          content = rawEnum.Err;
        }
        return new CairoResult(variantNum, content);
      }
      const customEnum = new CairoCustomEnum(rawEnum);
      return customEnum;
    }
    if (isTypeTuple(element.type)) {
      const memberTypes = extractTupleMemberTypes(element.type);
      return memberTypes.reduce((acc, it, idx) => {
        const name = it?.name ? it.name : idx;
        const type = it?.type ? it.type : it;
        const el = { name, type };
        acc[name] = parseResponseValue(responseIterator, el, structs, enums);
        return acc;
      }, {});
    }
    if (isTypeArray(element.type)) {
      const parsedDataArr = [];
      const el = { name: "", type: getArrayType(element.type) };
      const len = BigInt(responseIterator.next().value);
      while (parsedDataArr.length < len) {
        parsedDataArr.push(parseResponseValue(responseIterator, el, structs, enums));
      }
      return parsedDataArr;
    }
    return parseBaseTypes2(element.type, responseIterator);
  }
  function responseParser(responseIterator, output2, structs, enums, parsedResult) {
    const { name, type } = output2;
    let temp;
    switch (true) {
      case isLen(name):
        temp = responseIterator.next().value;
        return BigInt(temp);
      case (structs && type in structs || isTypeTuple(type)):
        return parseResponseValue(responseIterator, output2, structs, enums);
      case (enums && isTypeEnum(type, enums)):
        return parseResponseValue(responseIterator, output2, structs, enums);
      case isTypeArray(type):
        if (isCairo1Type(type)) {
          return parseResponseValue(responseIterator, output2, structs, enums);
        }
        const parsedDataArr = [];
        if (parsedResult && parsedResult[`${name}_len`]) {
          const arrLen = parsedResult[`${name}_len`];
          while (parsedDataArr.length < arrLen) {
            parsedDataArr.push(
              parseResponseValue(
                responseIterator,
                { name, type: output2.type.replace("*", "") },
                structs,
                enums
              )
            );
          }
        }
        return parsedDataArr;
      default:
        return parseBaseTypes2(type, responseIterator);
    }
  }

  // src/utils/calldata/validate.ts
  var validateFelt = (parameter, input) => {
    assert(
      typeof parameter === "string" || typeof parameter === "number" || typeof parameter === "bigint",
      `Validate: arg ${input.name} should be a felt typed as (String, Number or BigInt)`
    );
    if (typeof parameter === "string" && !isHex(parameter))
      return;
    const param = BigInt(parameter.toString(10));
    assert(
      // from : https://github.com/starkware-libs/starknet-specs/blob/29bab650be6b1847c92d4461d4c33008b5e50b1a/api/starknet_api_openrpc.json#L1266
      param >= 0n && param <= 2n ** 252n - 1n,
      `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^252-1]`
    );
  };
  var validateUint = (parameter, input) => {
    if (typeof parameter === "number") {
      assert(
        parameter <= Number.MAX_SAFE_INTEGER,
        `Validation: Parameter is to large to be typed as Number use (BigInt or String)`
      );
    }
    assert(
      typeof parameter === "string" || typeof parameter === "number" || typeof parameter === "bigint" || typeof parameter === "object" && "low" in parameter && "high" in parameter,
      `Validate: arg ${input.name} of cairo type ${input.type} should be type (String, Number or BigInt), but is ${typeof parameter} ${parameter}.`
    );
    const param = typeof parameter === "object" ? uint256ToBN(parameter) : toBigInt(parameter);
    switch (input.type) {
      case "core::integer::u8" /* u8 */:
        assert(
          param >= 0n && param <= 255n,
          `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0 - 255]`
        );
        break;
      case "core::integer::u16" /* u16 */:
        assert(
          param >= 0n && param <= 65535n,
          `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 65535]`
        );
        break;
      case "core::integer::u32" /* u32 */:
        assert(
          param >= 0n && param <= 4294967295n,
          `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 4294967295]`
        );
        break;
      case "core::integer::u64" /* u64 */:
        assert(
          param >= 0n && param <= 2n ** 64n - 1n,
          `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^64-1]`
        );
        break;
      case "core::integer::u128" /* u128 */:
        assert(
          param >= 0n && param <= 2n ** 128n - 1n,
          `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^128-1]`
        );
        break;
      case "core::integer::u256" /* u256 */:
        assert(
          param >= 0n && param <= 2n ** 256n - 1n,
          `Validate: arg ${input.name} is ${input.type} 0 - 2^256-1`
        );
        break;
      case "core::starknet::class_hash::ClassHash" /* ClassHash */:
        assert(
          // from : https://github.com/starkware-libs/starknet-specs/blob/29bab650be6b1847c92d4461d4c33008b5e50b1a/api/starknet_api_openrpc.json#L1670
          param >= 0n && param <= 2n ** 252n - 1n,
          `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^252-1]`
        );
        break;
      case "core::starknet::contract_address::ContractAddress" /* ContractAddress */:
        assert(
          // from : https://github.com/starkware-libs/starknet-specs/blob/29bab650be6b1847c92d4461d4c33008b5e50b1a/api/starknet_api_openrpc.json#L1245
          param >= 0n && param <= 2n ** 252n - 1n,
          `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^252-1]`
        );
        break;
      default:
        break;
    }
  };
  var validateBool = (parameter, input) => {
    assert(
      typeof parameter === "boolean",
      `Validate: arg ${input.name} of cairo type ${input.type} should be type (Boolean)`
    );
  };
  var validateStruct = (parameter, input, structs) => {
    if (input.type === "core::integer::u256" /* u256 */) {
      validateUint(parameter, input);
      return;
    }
    if (input.type === "core::starknet::eth_address::EthAddress") {
      assert(
        typeof parameter !== "object",
        `EthAdress type is waiting a BigNumberish. Got ${parameter}`
      );
      const param = BigInt(parameter.toString(10));
      assert(
        // from : https://github.com/starkware-libs/starknet-specs/blob/29bab650be6b1847c92d4461d4c33008b5e50b1a/api/starknet_api_openrpc.json#L1259
        param >= 0n && param <= 2n ** 160n - 1n,
        `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^160-1]`
      );
      return;
    }
    assert(
      typeof parameter === "object" && !Array.isArray(parameter),
      `Validate: arg ${input.name} is cairo type struct (${input.type}), and should be defined as js object (not array)`
    );
    structs[input.type].members.forEach(({ name }) => {
      assert(
        Object.keys(parameter).includes(name),
        `Validate: arg ${input.name} should have a property ${name}`
      );
    });
  };
  var validateEnum = (parameter, input) => {
    assert(
      typeof parameter === "object" && !Array.isArray(parameter),
      `Validate: arg ${input.name} is cairo type Enum (${input.type}), and should be defined as js object (not array)`
    );
    const methodsKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(parameter));
    const keys = [...Object.getOwnPropertyNames(parameter), ...methodsKeys];
    if (isTypeOption(input.type) && keys.includes("isSome") && keys.includes("isNone")) {
      return;
    }
    if (isTypeResult(input.type) && keys.includes("isOk") && keys.includes("isErr")) {
      return;
    }
    if (keys.includes("variant") && keys.includes("activeVariant")) {
      return;
    }
    throw new Error(
      `Validate Enum: argument ${input.name}, type ${input.type}, value received ${parameter}, is not an Enum.`
    );
  };
  var validateTuple = (parameter, input) => {
    assert(
      typeof parameter === "object" && !Array.isArray(parameter),
      `Validate: arg ${input.name} should be a tuple (defined as object)`
    );
  };
  var validateArray = (parameter, input, structs, enums) => {
    const baseType = getArrayType(input.type);
    if (isTypeFelt(baseType) && isLongText(parameter)) {
      return;
    }
    assert(Array.isArray(parameter), `Validate: arg ${input.name} should be an Array`);
    switch (true) {
      case isTypeFelt(baseType):
        parameter.forEach((param) => validateFelt(param, input));
        break;
      case isTypeTuple(baseType):
        parameter.forEach((it) => validateTuple(it, { name: input.name, type: baseType }));
        break;
      case isTypeArray(baseType):
        parameter.forEach(
          (param) => validateArray(param, { name: "", type: baseType }, structs, enums)
        );
        break;
      case isTypeStruct(baseType, structs):
        parameter.forEach(
          (it) => validateStruct(it, { name: input.name, type: baseType }, structs)
        );
        break;
      case isTypeEnum(baseType, enums):
        parameter.forEach((it) => validateEnum(it, { name: input.name, type: baseType }));
        break;
      case (isTypeUint(baseType) || isTypeLitteral(baseType)):
        parameter.forEach((param) => validateUint(param, input));
        break;
      case isTypeBool(baseType):
        parameter.forEach((param) => validateBool(param, input));
        break;
      default:
        throw new Error(
          `Validate Unhandled: argument ${input.name}, type ${input.type}, value ${parameter}`
        );
    }
  };
  function validateFields(abiMethod, args, structs, enums) {
    abiMethod.inputs.reduce((acc, input) => {
      const parameter = args[acc];
      switch (true) {
        case isLen(input.name):
          return acc;
        case isTypeFelt(input.type):
          validateFelt(parameter, input);
          break;
        case (isTypeUint(input.type) || isTypeLitteral(input.type)):
          validateUint(parameter, input);
          break;
        case isTypeBool(input.type):
          validateBool(parameter, input);
          break;
        case isTypeArray(input.type):
          validateArray(parameter, input, structs, enums);
          break;
        case isTypeStruct(input.type, structs):
          validateStruct(parameter, input, structs);
          break;
        case isTypeEnum(input.type, enums):
          validateEnum(parameter, input);
          break;
        case isTypeTuple(input.type):
          validateTuple(parameter, input);
          break;
        default:
          throw new Error(
            `Validate Unhandled: argument ${input.name}, type ${input.type}, value ${parameter}`
          );
      }
      return acc + 1;
    }, 0);
  }

  // src/utils/calldata/index.ts
  var CallData = class {
    constructor(abi) {
      this.structs = CallData.getAbiStruct(abi);
      this.enums = CallData.getAbiEnum(abi);
      this.parser = createAbiParser(abi);
      this.abi = this.parser.getLegacyFormat();
    }
    /**
     * Validate arguments passed to the method as corresponding to the ones in the abi
     * @param type ValidateType - type of the method
     * @param method string - name of the method
     * @param args ArgsOrCalldata - arguments that are passed to the method
     */
    validate(type, method, args = []) {
      if (type !== "DEPLOY" /* DEPLOY */) {
        const invocableFunctionNames = this.abi.filter((abi) => {
          if (abi.type !== "function")
            return false;
          const isView = abi.stateMutability === "view" || abi.state_mutability === "view";
          return type === "INVOKE" /* INVOKE */ ? !isView : isView;
        }).map((abi) => abi.name);
        assert(
          invocableFunctionNames.includes(method),
          `${type === "INVOKE" /* INVOKE */ ? "invocable" : "viewable"} method not found in abi`
        );
      }
      const abiMethod = this.abi.find(
        (abi) => type === "DEPLOY" /* DEPLOY */ ? abi.name === method && abi.type === "constructor" : abi.name === method && abi.type === "function"
      );
      if (isNoConstructorValid(method, args, abiMethod)) {
        return;
      }
      const inputsLength = this.parser.methodInputsLength(abiMethod);
      if (args.length !== inputsLength) {
        throw Error(
          `Invalid number of arguments, expected ${inputsLength} arguments, but got ${args.length}`
        );
      }
      validateFields(abiMethod, args, this.structs, this.enums);
    }
    /**
     * Compile contract callData with abi
     * Parse the calldata by using input fields from the abi for that method
     * @param method string - method name
     * @param args RawArgs - arguments passed to the method. Can be an array of arguments (in the order of abi definition), or an object constructed in conformity with abi (in this case, the parameter can be in a wrong order).
     * @return Calldata - parsed arguments in format that contract is expecting
     * @example
     * ```typescript
     * const calldata = myCallData.compile("constructor",["0x34a",[1,3n]]);
     * ```
     * ```typescript
     * const calldata2 = myCallData.compile("constructor",{list:[1,3n],balance:"0x34"}); // wrong order is valid
     * ```
     */
    compile(method, argsCalldata) {
      const abiMethod = this.abi.find((abiFunction) => abiFunction.name === method);
      if (isNoConstructorValid(method, argsCalldata, abiMethod)) {
        return [];
      }
      let args;
      if (Array.isArray(argsCalldata)) {
        args = argsCalldata;
      } else {
        const orderedObject = orderPropsByAbi(
          argsCalldata,
          abiMethod.inputs,
          this.structs,
          this.enums
        );
        args = Object.values(orderedObject);
        validateFields(abiMethod, args, this.structs, this.enums);
      }
      const argsIterator = args[Symbol.iterator]();
      const callArray = abiMethod.inputs.reduce(
        (acc, input) => isLen(input.name) ? acc : acc.concat(parseCalldataField(argsIterator, input, this.structs, this.enums)),
        []
      );
      Object.defineProperty(callArray, "__compiled__", {
        enumerable: false,
        writable: false,
        value: true
      });
      return callArray;
    }
    /**
     * Compile contract callData without abi
     * @param rawArgs RawArgs representing cairo method arguments or string array of compiled data
     * @returns Calldata
     */
    static compile(rawArgs) {
      const createTree = (obj) => {
        const getEntries = (o, prefix = ".") => {
          const oe = Array.isArray(o) ? [o.length.toString(), ...o] : o;
          return Object.entries(oe).flatMap(([k, v]) => {
            let value = v;
            if (isLongText(value))
              value = splitLongString(value);
            if (k === "entrypoint")
              value = getSelectorFromName(value);
            const kk = Array.isArray(oe) && k === "0" ? "$$len" : k;
            if (isBigInt(value))
              return [[`${prefix}${kk}`, felt(value)]];
            if (Object(value) === value) {
              const methodsKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(value));
              const keys = [...Object.getOwnPropertyNames(value), ...methodsKeys];
              if (keys.includes("isSome") && keys.includes("isNone")) {
                const myOption = value;
                const variantNb = myOption.isSome() ? 0 /* Some */ : 1 /* None */;
                if (myOption.isSome())
                  return getEntries({ 0: variantNb, 1: myOption.unwrap() }, `${prefix}${kk}.`);
                return [[`${prefix}${kk}`, felt(variantNb)]];
              }
              if (keys.includes("isOk") && keys.includes("isErr")) {
                const myResult = value;
                const variantNb = myResult.isOk() ? 0 /* Ok */ : 1 /* Err */;
                return getEntries({ 0: variantNb, 1: myResult.unwrap() }, `${prefix}${kk}.`);
              }
              if (keys.includes("variant") && keys.includes("activeVariant")) {
                const myEnum = value;
                const activeVariant = myEnum.activeVariant();
                const listVariants = Object.keys(myEnum.variant);
                const activeVariantNb = listVariants.findIndex(
                  (variant) => variant === activeVariant
                );
                if (typeof myEnum.unwrap() === "object" && Object.keys(myEnum.unwrap()).length === 0) {
                  return [[`${prefix}${kk}`, felt(activeVariantNb)]];
                }
                return getEntries({ 0: activeVariantNb, 1: myEnum.unwrap() }, `${prefix}${kk}.`);
              }
              return getEntries(value, `${prefix}${kk}.`);
            }
            return [[`${prefix}${kk}`, felt(value)]];
          });
        };
        const result = Object.fromEntries(getEntries(obj));
        return result;
      };
      let callTreeArray;
      if (!Array.isArray(rawArgs)) {
        const callTree = createTree(rawArgs);
        callTreeArray = Object.values(callTree);
      } else {
        const callObj = { ...rawArgs };
        const callTree = createTree(callObj);
        callTreeArray = Object.values(callTree);
      }
      Object.defineProperty(callTreeArray, "__compiled__", {
        enumerable: false,
        writable: false,
        value: true
      });
      return callTreeArray;
    }
    /**
     * Parse elements of the response array and structuring them into response object
     * @param method string - method name
     * @param response string[] - response from the method
     * @return Result - parsed response corresponding to the abi
     */
    parse(method, response) {
      const { outputs } = this.abi.find((abi) => abi.name === method);
      const responseIterator = response.flat()[Symbol.iterator]();
      const parsed = outputs.flat().reduce((acc, output2, idx) => {
        const propName = output2.name ?? idx;
        acc[propName] = responseParser(responseIterator, output2, this.structs, this.enums, acc);
        if (acc[propName] && acc[`${propName}_len`]) {
          delete acc[`${propName}_len`];
        }
        return acc;
      }, {});
      return Object.keys(parsed).length === 1 && 0 in parsed ? parsed[0] : parsed;
    }
    /**
     * Format cairo method response data to native js values based on provided format schema
     * @param method string - cairo method name
     * @param response string[] - cairo method response
     * @param format object - formatter object schema
     * @returns Result - parsed and formatted response object
     */
    format(method, response, format) {
      const parsed = this.parse(method, response);
      return formatter(parsed, format);
    }
    /**
     * Helper to extract structs from abi
     * @param abi Abi
     * @returns AbiStructs - structs from abi
     */
    static getAbiStruct(abi) {
      return abi.filter((abiEntry) => abiEntry.type === "struct").reduce(
        (acc, abiEntry) => ({
          ...acc,
          [abiEntry.name]: abiEntry
        }),
        {}
      );
    }
    /**
     * Helper to extract enums from abi
     * @param abi Abi
     * @returns AbiEnums - enums from abi
     */
    static getAbiEnum(abi) {
      const fullEnumList = abi.filter((abiEntry) => abiEntry.type === "enum").reduce(
        (acc, abiEntry) => ({
          ...acc,
          [abiEntry.name]: abiEntry
        }),
        {}
      );
      delete fullEnumList["core::bool"];
      return fullEnumList;
    }
    /**
     * Helper: Compile HexCalldata | RawCalldata | RawArgs
     * @param rawCalldata HexCalldata | RawCalldata | RawArgs
     * @returns Calldata
     */
    static toCalldata(rawCalldata = []) {
      return CallData.compile(rawCalldata);
    }
    /**
     * Helper: Convert raw to HexCalldata
     * @param raw HexCalldata | RawCalldata | RawArgs
     * @returns HexCalldata
     */
    static toHex(raw = []) {
      const calldata = CallData.compile(raw);
      return calldata.map((it) => toHex(it));
    }
  };

  // src/utils/hash.ts
  var hash_exports = {};
  __export(hash_exports, {
    calculateContractAddressFromHash: () => calculateContractAddressFromHash,
    calculateDeclareTransactionHash: () => calculateDeclareTransactionHash,
    calculateDeployAccountTransactionHash: () => calculateDeployAccountTransactionHash,
    calculateDeployTransactionHash: () => calculateDeployTransactionHash,
    calculateTransactionHash: () => calculateTransactionHash,
    calculateTransactionHashCommon: () => calculateTransactionHashCommon,
    computeCompiledClassHash: () => computeCompiledClassHash,
    computeContractClassHash: () => computeContractClassHash,
    computeHashOnElements: () => computeHashOnElements2,
    computeLegacyContractClassHash: () => computeLegacyContractClassHash,
    computeSierraContractClassHash: () => computeSierraContractClassHash,
    default: () => computeHintedClassHash,
    feeTransactionVersion: () => feeTransactionVersion,
    feeTransactionVersion_2: () => feeTransactionVersion_2,
    formatSpaces: () => formatSpaces,
    getSelector: () => getSelector,
    getSelectorFromName: () => getSelectorFromName,
    getVersionsByType: () => getVersionsByType,
    keccakBn: () => keccakBn,
    poseidon: () => poseidon_exports,
    starknetKeccak: () => starknetKeccak,
    transactionVersion: () => transactionVersion,
    transactionVersion_2: () => transactionVersion_2
  });

  // src/utils/ec.ts
  var ec_exports = {};
  __export(ec_exports, {
    starkCurve: () => esm_exports,
    weierstrass: () => weierstrass_exports
  });

  // src/utils/json.ts
  var json_exports = {};
  __export(json_exports, {
    parse: () => parse2,
    parseAlwaysAsBig: () => parseAlwaysAsBig,
    stringify: () => stringify2,
    stringifyAlwaysAsBig: () => stringifyAlwaysAsBig
  });

  // node_modules/lossless-json/lib/esm/utils.js
  function isInteger(value) {
    return INTEGER_REGEX.test(value);
  }
  var INTEGER_REGEX = /^-?[0-9]+$/;
  function isNumber(value) {
    return NUMBER_REGEX.test(value);
  }
  var NUMBER_REGEX = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
  function isSafeNumber(value, config) {
    var num = parseFloat(value);
    var str = String(num);
    var v = extractSignificantDigits(value);
    var s = extractSignificantDigits(str);
    if (v === s) {
      return true;
    }
    if ((config === null || config === void 0 ? void 0 : config.approx) === true) {
      var requiredDigits = 14;
      if (!isInteger(value) && s.length >= requiredDigits && v.startsWith(s.substring(0, requiredDigits))) {
        return true;
      }
    }
    return false;
  }
  var UnsafeNumberReason;
  (function(UnsafeNumberReason2) {
    UnsafeNumberReason2["underflow"] = "underflow";
    UnsafeNumberReason2["overflow"] = "overflow";
    UnsafeNumberReason2["truncate_integer"] = "truncate_integer";
    UnsafeNumberReason2["truncate_float"] = "truncate_float";
  })(UnsafeNumberReason || (UnsafeNumberReason = {}));
  function getUnsafeNumberReason(value) {
    if (isSafeNumber(value, {
      approx: false
    })) {
      return void 0;
    }
    if (isInteger(value)) {
      return UnsafeNumberReason.truncate_integer;
    }
    var num = parseFloat(value);
    if (!isFinite(num)) {
      return UnsafeNumberReason.overflow;
    }
    if (num === 0) {
      return UnsafeNumberReason.underflow;
    }
    return UnsafeNumberReason.truncate_float;
  }
  function extractSignificantDigits(value) {
    return value.replace(EXPONENTIAL_PART_REGEX, "").replace(DOT_REGEX, "").replace(TRAILING_ZEROS_REGEX, "").replace(LEADING_MINUS_AND_ZEROS_REGEX, "");
  }
  var EXPONENTIAL_PART_REGEX = /[eE][+-]?\d+$/;
  var LEADING_MINUS_AND_ZEROS_REGEX = /^-?(0*)?/;
  var DOT_REGEX = /\./;
  var TRAILING_ZEROS_REGEX = /0+$/;

  // node_modules/lossless-json/lib/esm/LosslessNumber.js
  function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
      return typeof obj2;
    } : function(obj2) {
      return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
  }
  function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null)
      return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (_typeof(res) !== "object")
        return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  var LosslessNumber = /* @__PURE__ */ function() {
    function LosslessNumber2(value) {
      _classCallCheck(this, LosslessNumber2);
      _defineProperty(this, "isLosslessNumber", true);
      if (!isNumber(value)) {
        throw new Error('Invalid number (value: "' + value + '")');
      }
      this.value = value;
    }
    _createClass(LosslessNumber2, [{
      key: "valueOf",
      value: function valueOf() {
        var unsafeReason = getUnsafeNumberReason(this.value);
        if (unsafeReason === void 0 || unsafeReason === UnsafeNumberReason.truncate_float) {
          return parseFloat(this.value);
        }
        if (isInteger(this.value)) {
          return BigInt(this.value);
        }
        throw new Error("Cannot safely convert to number: " + "the value '".concat(this.value, "' would ").concat(unsafeReason, " and become ").concat(parseFloat(this.value)));
      }
      /**
       * Get the value of the LosslessNumber as string.
       */
    }, {
      key: "toString",
      value: function toString2() {
        return this.value;
      }
      // Note: we do NOT implement a .toJSON() method, and you should not implement
      // or use that, it cannot safely turn the numeric value in the string into
      // stringified JSON since it has to be parsed into a number first.
    }]);
    return LosslessNumber2;
  }();
  function isLosslessNumber(value) {
    return value && _typeof(value) === "object" && value.isLosslessNumber === true || false;
  }

  // node_modules/lossless-json/lib/esm/numberParsers.js
  function parseLosslessNumber(value) {
    return new LosslessNumber(value);
  }
  function parseNumberAndBigInt(value) {
    return isInteger(value) ? BigInt(value) : parseFloat(value);
  }

  // node_modules/lossless-json/lib/esm/revive.js
  function _typeof2(obj) {
    "@babel/helpers - typeof";
    return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
      return typeof obj2;
    } : function(obj2) {
      return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    }, _typeof2(obj);
  }
  function revive(json, reviver) {
    return reviveValue({
      "": json
    }, "", json, reviver);
  }
  function reviveValue(context, key, value, reviver) {
    if (Array.isArray(value)) {
      return reviver.call(context, key, reviveArray(value, reviver));
    } else if (value && _typeof2(value) === "object" && !isLosslessNumber(value)) {
      return reviver.call(context, key, reviveObject(value, reviver));
    } else {
      return reviver.call(context, key, value);
    }
  }
  function reviveObject(object, reviver) {
    Object.keys(object).forEach(function(key) {
      var value = reviveValue(object, key, object[key], reviver);
      if (value !== void 0) {
        object[key] = value;
      } else {
        delete object[key];
      }
    });
    return object;
  }
  function reviveArray(array, reviver) {
    for (var i = 0; i < array.length; i++) {
      array[i] = reviveValue(array, i + "", array[i], reviver);
    }
    return array;
  }

  // node_modules/lossless-json/lib/esm/parse.js
  function _typeof3(obj) {
    "@babel/helpers - typeof";
    return _typeof3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
      return typeof obj2;
    } : function(obj2) {
      return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    }, _typeof3(obj);
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
      return Array.from(iter);
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr))
      return _arrayLikeToArray(arr);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  function parse(text, reviver) {
    var parseNumber = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : parseLosslessNumber;
    var i = 0;
    var value = parseValue();
    expectValue(value);
    expectEndOfInput();
    return reviver ? revive(value, reviver) : value;
    function parseObject() {
      if (text.charCodeAt(i) === codeOpeningBrace) {
        i++;
        skipWhitespace();
        var object = {};
        var initial = true;
        while (i < text.length && text.charCodeAt(i) !== codeClosingBrace) {
          if (!initial) {
            eatComma();
            skipWhitespace();
          } else {
            initial = false;
          }
          var start = i;
          var key = parseString();
          if (key === void 0) {
            throwObjectKeyExpected();
          }
          skipWhitespace();
          eatColon();
          var _value = parseValue();
          if (Object.prototype.hasOwnProperty.call(object, key) && !isDeepEqual(_value, object[key])) {
            throwDuplicateKey(key, start + 1);
          }
          object[key] = _value;
        }
        if (text.charCodeAt(i) !== codeClosingBrace) {
          throwObjectKeyOrEndExpected();
        }
        i++;
        return object;
      }
    }
    function parseArray() {
      if (text.charCodeAt(i) === codeOpeningBracket) {
        i++;
        skipWhitespace();
        var array = [];
        var initial = true;
        while (i < text.length && text.charCodeAt(i) !== codeClosingBracket) {
          if (!initial) {
            eatComma();
          } else {
            initial = false;
          }
          var _value2 = parseValue();
          expectArrayItem(_value2);
          array.push(_value2);
        }
        if (text.charCodeAt(i) !== codeClosingBracket) {
          throwArrayItemOrEndExpected();
        }
        i++;
        return array;
      }
    }
    function parseValue() {
      var _ref, _ref2, _ref3, _ref4, _ref5, _parseString;
      skipWhitespace();
      var value2 = (_ref = (_ref2 = (_ref3 = (_ref4 = (_ref5 = (_parseString = parseString()) !== null && _parseString !== void 0 ? _parseString : parseNumeric()) !== null && _ref5 !== void 0 ? _ref5 : parseObject()) !== null && _ref4 !== void 0 ? _ref4 : parseArray()) !== null && _ref3 !== void 0 ? _ref3 : parseKeyword("true", true)) !== null && _ref2 !== void 0 ? _ref2 : parseKeyword("false", false)) !== null && _ref !== void 0 ? _ref : parseKeyword("null", null);
      skipWhitespace();
      return value2;
    }
    function parseKeyword(name, value2) {
      if (text.slice(i, i + name.length) === name) {
        i += name.length;
        return value2;
      }
    }
    function skipWhitespace() {
      while (isWhitespace(text.charCodeAt(i))) {
        i++;
      }
    }
    function parseString() {
      if (text.charCodeAt(i) === codeDoubleQuote) {
        i++;
        var result = "";
        while (i < text.length && text.charCodeAt(i) !== codeDoubleQuote) {
          if (text.charCodeAt(i) === codeBackslash) {
            var char = text[i + 1];
            var escapeChar = escapeCharacters[char];
            if (escapeChar !== void 0) {
              result += escapeChar;
              i++;
            } else if (char === "u") {
              if (isHex2(text.charCodeAt(i + 2)) && isHex2(text.charCodeAt(i + 3)) && isHex2(text.charCodeAt(i + 4)) && isHex2(text.charCodeAt(i + 5))) {
                result += String.fromCharCode(parseInt(text.slice(i + 2, i + 6), 16));
                i += 5;
              } else {
                throwInvalidUnicodeCharacter(i);
              }
            } else {
              throwInvalidEscapeCharacter(i);
            }
          } else {
            if (isValidStringCharacter(text.charCodeAt(i))) {
              result += text[i];
            } else {
              throwInvalidCharacter(text[i]);
            }
          }
          i++;
        }
        expectEndOfString();
        i++;
        return result;
      }
    }
    function parseNumeric() {
      var start = i;
      if (text.charCodeAt(i) === codeMinus) {
        i++;
        expectDigit(start);
      }
      if (text.charCodeAt(i) === codeZero) {
        i++;
      } else if (isNonZeroDigit(text.charCodeAt(i))) {
        i++;
        while (isDigit(text.charCodeAt(i))) {
          i++;
        }
      }
      if (text.charCodeAt(i) === codeDot) {
        i++;
        expectDigit(start);
        while (isDigit(text.charCodeAt(i))) {
          i++;
        }
      }
      if (text.charCodeAt(i) === codeLowercaseE || text.charCodeAt(i) === codeUppercaseE) {
        i++;
        if (text.charCodeAt(i) === codeMinus || text.charCodeAt(i) === codePlus) {
          i++;
        }
        expectDigit(start);
        while (isDigit(text.charCodeAt(i))) {
          i++;
        }
      }
      if (i > start) {
        return parseNumber(text.slice(start, i));
      }
    }
    function eatComma() {
      if (text.charCodeAt(i) !== codeComma) {
        throw new SyntaxError("Comma ',' expected after value ".concat(gotAt()));
      }
      i++;
    }
    function eatColon() {
      if (text.charCodeAt(i) !== codeColon) {
        throw new SyntaxError("Colon ':' expected after property name ".concat(gotAt()));
      }
      i++;
    }
    function expectValue(value2) {
      if (value2 === void 0) {
        throw new SyntaxError("JSON value expected ".concat(gotAt()));
      }
    }
    function expectArrayItem(value2) {
      if (value2 === void 0) {
        throw new SyntaxError("Array item expected ".concat(gotAt()));
      }
    }
    function expectEndOfInput() {
      if (i < text.length) {
        throw new SyntaxError("Expected end of input ".concat(gotAt()));
      }
    }
    function expectDigit(start) {
      if (!isDigit(text.charCodeAt(i))) {
        var numSoFar = text.slice(start, i);
        throw new SyntaxError("Invalid number '".concat(numSoFar, "', expecting a digit ").concat(gotAt()));
      }
    }
    function expectEndOfString() {
      if (text.charCodeAt(i) !== codeDoubleQuote) {
        throw new SyntaxError(`End of string '"' expected `.concat(gotAt()));
      }
    }
    function throwObjectKeyExpected() {
      throw new SyntaxError("Quoted object key expected ".concat(gotAt()));
    }
    function throwDuplicateKey(key, pos2) {
      throw new SyntaxError("Duplicate key '".concat(key, "' encountered at position ").concat(pos2));
    }
    function throwObjectKeyOrEndExpected() {
      throw new SyntaxError("Quoted object key or end of object '}' expected ".concat(gotAt()));
    }
    function throwArrayItemOrEndExpected() {
      throw new SyntaxError("Array item or end of array ']' expected ".concat(gotAt()));
    }
    function throwInvalidCharacter(char) {
      throw new SyntaxError("Invalid character '".concat(char, "' ").concat(pos()));
    }
    function throwInvalidEscapeCharacter(start) {
      var chars = text.slice(start, start + 2);
      throw new SyntaxError("Invalid escape character '".concat(chars, "' ").concat(pos()));
    }
    function throwInvalidUnicodeCharacter(start) {
      var end = start + 2;
      while (/\w/.test(text[end])) {
        end++;
      }
      var chars = text.slice(start, end);
      throw new SyntaxError("Invalid unicode character '".concat(chars, "' ").concat(pos()));
    }
    function pos() {
      return "at position ".concat(i);
    }
    function got() {
      return i < text.length ? "but got '".concat(text[i], "'") : "but reached end of input";
    }
    function gotAt() {
      return got() + " " + pos();
    }
  }
  function isWhitespace(code) {
    return code === codeSpace || code === codeNewline || code === codeTab || code === codeReturn;
  }
  function isHex2(code) {
    return code >= codeZero && code <= codeNine || code >= codeUppercaseA && code <= codeUppercaseF || code >= codeLowercaseA && code <= codeLowercaseF;
  }
  function isDigit(code) {
    return code >= codeZero && code <= codeNine;
  }
  function isNonZeroDigit(code) {
    return code >= codeOne && code <= codeNine;
  }
  function isValidStringCharacter(code) {
    return code >= 32 && code <= 1114111;
  }
  function isDeepEqual(a, b) {
    if (a === b) {
      return true;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every(function(item, index) {
        return isDeepEqual(item, b[index]);
      });
    }
    if (isObject(a) && isObject(b)) {
      var keys = _toConsumableArray(new Set([].concat(_toConsumableArray(Object.keys(a)), _toConsumableArray(Object.keys(b)))));
      return keys.every(function(key) {
        return isDeepEqual(a[key], b[key]);
      });
    }
    return false;
  }
  function isObject(value) {
    return _typeof3(value) === "object" && value !== null;
  }
  var escapeCharacters = {
    '"': '"',
    "\\": "\\",
    "/": "/",
    b: "\b",
    f: "\f",
    n: "\n",
    r: "\r",
    t: "	"
    // note that \u is handled separately in parseString()
  };
  var codeBackslash = 92;
  var codeOpeningBrace = 123;
  var codeClosingBrace = 125;
  var codeOpeningBracket = 91;
  var codeClosingBracket = 93;
  var codeSpace = 32;
  var codeNewline = 10;
  var codeTab = 9;
  var codeReturn = 13;
  var codeDoubleQuote = 34;
  var codePlus = 43;
  var codeMinus = 45;
  var codeZero = 48;
  var codeOne = 49;
  var codeNine = 57;
  var codeComma = 44;
  var codeDot = 46;
  var codeColon = 58;
  var codeUppercaseA = 65;
  var codeLowercaseA = 97;
  var codeUppercaseE = 69;
  var codeLowercaseE = 101;
  var codeUppercaseF = 70;
  var codeLowercaseF = 102;

  // node_modules/lossless-json/lib/esm/stringify.js
  function _typeof4(obj) {
    "@babel/helpers - typeof";
    return _typeof4 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
      return typeof obj2;
    } : function(obj2) {
      return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    }, _typeof4(obj);
  }
  function stringify(value, replacer, space, numberStringifiers) {
    var resolvedSpace = resolveSpace(space);
    var replacedValue = typeof replacer === "function" ? replacer.call({
      "": value
    }, "", value) : value;
    return stringifyValue(replacedValue, "");
    function stringifyValue(value2, indent) {
      if (Array.isArray(numberStringifiers)) {
        var stringifier = numberStringifiers.find(function(item) {
          return item.test(value2);
        });
        if (stringifier) {
          var str = stringifier.stringify(value2);
          if (typeof str !== "string" || !isNumber(str)) {
            throw new Error("Invalid JSON number: output of a number stringifier must be a string containing a JSON number " + "(output: ".concat(str, ")"));
          }
          return str;
        }
      }
      if (typeof value2 === "boolean" || typeof value2 === "number" || typeof value2 === "string" || value2 === null || value2 instanceof Date || value2 instanceof Boolean || value2 instanceof Number || value2 instanceof String) {
        return JSON.stringify(value2);
      }
      if (value2 && value2.isLosslessNumber) {
        return value2.toString();
      }
      if (typeof value2 === "bigint") {
        return value2.toString();
      }
      if (Array.isArray(value2)) {
        return stringifyArray(value2, indent);
      }
      if (value2 && _typeof4(value2) === "object") {
        return stringifyObject(value2, indent);
      }
      return void 0;
    }
    function stringifyArray(array, indent) {
      if (array.length === 0) {
        return "[]";
      }
      var childIndent = resolvedSpace ? indent + resolvedSpace : void 0;
      var str = resolvedSpace ? "[\n" : "[";
      for (var i = 0; i < array.length; i++) {
        var item = typeof replacer === "function" ? replacer.call(array, String(i), array[i]) : array[i];
        if (resolvedSpace) {
          str += childIndent;
        }
        if (typeof item !== "undefined" && typeof item !== "function") {
          str += stringifyValue(item, childIndent);
        } else {
          str += "null";
        }
        if (i < array.length - 1) {
          str += resolvedSpace ? ",\n" : ",";
        }
      }
      str += resolvedSpace ? "\n" + indent + "]" : "]";
      return str;
    }
    function stringifyObject(object, indent) {
      if (typeof object.toJSON === "function") {
        return stringify(object.toJSON(), replacer, space, void 0);
      }
      var keys = Array.isArray(replacer) ? replacer.map(String) : Object.keys(object);
      if (keys.length === 0) {
        return "{}";
      }
      var childIndent = resolvedSpace ? indent + resolvedSpace : void 0;
      var first = true;
      var str = resolvedSpace ? "{\n" : "{";
      keys.forEach(function(key) {
        var value2 = typeof replacer === "function" ? replacer.call(object, key, object[key]) : object[key];
        if (includeProperty(key, value2)) {
          if (first) {
            first = false;
          } else {
            str += resolvedSpace ? ",\n" : ",";
          }
          var keyStr = JSON.stringify(key);
          str += resolvedSpace ? childIndent + keyStr + ": " : keyStr + ":";
          str += stringifyValue(value2, childIndent);
        }
      });
      str += resolvedSpace ? "\n" + indent + "}" : "}";
      return str;
    }
    function includeProperty(key, value2) {
      return typeof value2 !== "undefined" && typeof value2 !== "function" && _typeof4(value2) !== "symbol";
    }
  }
  function resolveSpace(space) {
    if (typeof space === "number") {
      return " ".repeat(space);
    }
    if (typeof space === "string" && space !== "") {
      return space;
    }
    return void 0;
  }

  // src/utils/json.ts
  var parseIntAsNumberOrBigInt = (x) => {
    if (!isInteger(x))
      return parseFloat(x);
    const v = parseInt(x, 10);
    return Number.isSafeInteger(v) ? v : BigInt(x);
  };
  var parse2 = (x) => parse(String(x), void 0, parseIntAsNumberOrBigInt);
  var parseAlwaysAsBig = (x) => parse(String(x), void 0, parseNumberAndBigInt);
  var stringify2 = (value, replacer, space, numberStringifiers) => stringify(value, replacer, space, numberStringifiers);
  var stringifyAlwaysAsBig = stringify2;

  // src/utils/hash.ts
  var transactionVersion = BN_TRANSACTION_VERSION_1;
  var transactionVersion_2 = BN_TRANSACTION_VERSION_2;
  var feeTransactionVersion = BN_FEE_TRANSACTION_VERSION_1;
  var feeTransactionVersion_2 = BN_FEE_TRANSACTION_VERSION_2;
  function getVersionsByType(versionType) {
    return versionType === "fee" ? { v1: feeTransactionVersion, v2: feeTransactionVersion_2 } : { v1: transactionVersion, v2: transactionVersion_2 };
  }
  function computeHashOnElements2(data) {
    return [...data, data.length].reduce((x, y) => esm_exports.pedersen(toBigInt(x), toBigInt(y)), 0).toString();
  }
  function calculateTransactionHashCommon(txHashPrefix, version, contractAddress, entryPointSelector, calldata, maxFee, chainId, additionalData = []) {
    const calldataHash = computeHashOnElements2(calldata);
    const dataToHash = [
      txHashPrefix,
      version,
      contractAddress,
      entryPointSelector,
      calldataHash,
      maxFee,
      chainId,
      ...additionalData
    ];
    return computeHashOnElements2(dataToHash);
  }
  function calculateDeployTransactionHash(contractAddress, constructorCalldata, version, chainId, constructorName = "constructor") {
    return calculateTransactionHashCommon(
      "0x6465706c6f79" /* DEPLOY */,
      version,
      contractAddress,
      getSelectorFromName(constructorName),
      constructorCalldata,
      0,
      chainId
    );
  }
  function calculateDeclareTransactionHash(classHash, senderAddress, version, maxFee, chainId, nonce, compiledClassHash) {
    return calculateTransactionHashCommon(
      "0x6465636c617265" /* DECLARE */,
      version,
      senderAddress,
      0,
      [classHash],
      maxFee,
      chainId,
      [nonce, ...compiledClassHash ? [compiledClassHash] : []]
    );
  }
  function calculateDeployAccountTransactionHash(contractAddress, classHash, constructorCalldata, salt, version, maxFee, chainId, nonce) {
    const calldata = [classHash, salt, ...constructorCalldata];
    return calculateTransactionHashCommon(
      "0x6465706c6f795f6163636f756e74" /* DEPLOY_ACCOUNT */,
      version,
      contractAddress,
      0,
      calldata,
      maxFee,
      chainId,
      [nonce]
    );
  }
  function calculateTransactionHash(contractAddress, version, calldata, maxFee, chainId, nonce) {
    return calculateTransactionHashCommon(
      "0x696e766f6b65" /* INVOKE */,
      version,
      contractAddress,
      0,
      calldata,
      maxFee,
      chainId,
      [nonce]
    );
  }
  function calculateContractAddressFromHash(salt, classHash, constructorCalldata, deployerAddress) {
    const compiledCalldata = CallData.compile(constructorCalldata);
    const constructorCalldataHash = computeHashOnElements2(compiledCalldata);
    const CONTRACT_ADDRESS_PREFIX = felt("0x535441524b4e45545f434f4e54524143545f41444452455353");
    return computeHashOnElements2([
      CONTRACT_ADDRESS_PREFIX,
      deployerAddress,
      salt,
      classHash,
      constructorCalldataHash
    ]);
  }
  function nullSkipReplacer(key, value) {
    if (key === "attributes" || key === "accessible_scopes") {
      return Array.isArray(value) && value.length === 0 ? void 0 : value;
    }
    if (key === "debug_info") {
      return null;
    }
    return value === null ? void 0 : value;
  }
  function formatSpaces(json) {
    let insideQuotes = false;
    const newString = [];
    for (const char of json) {
      if (char === '"' && (newString.length > 0 && newString.slice(-1)[0] === "\\") === false) {
        insideQuotes = !insideQuotes;
      }
      if (insideQuotes) {
        newString.push(char);
      } else {
        newString.push(char === ":" ? ": " : char === "," ? ", " : char);
      }
    }
    return newString.join("");
  }
  function computeHintedClassHash(compiledContract) {
    const { abi, program } = compiledContract;
    const contractClass = { abi, program };
    const serializedJson = formatSpaces(stringify2(contractClass, nullSkipReplacer));
    return addHexPrefix(esm_exports.keccak(utf8ToArray(serializedJson)).toString(16));
  }
  function computeLegacyContractClassHash(contract) {
    const compiledContract = typeof contract === "string" ? parse2(contract) : contract;
    const apiVersion = toHex(API_VERSION);
    const externalEntryPointsHash = computeHashOnElements2(
      compiledContract.entry_points_by_type.EXTERNAL.flatMap((e) => [e.selector, e.offset])
    );
    const l1HandlerEntryPointsHash = computeHashOnElements2(
      compiledContract.entry_points_by_type.L1_HANDLER.flatMap((e) => [e.selector, e.offset])
    );
    const constructorEntryPointHash = computeHashOnElements2(
      compiledContract.entry_points_by_type.CONSTRUCTOR.flatMap((e) => [e.selector, e.offset])
    );
    const builtinsHash = computeHashOnElements2(
      compiledContract.program.builtins.map((s) => encodeShortString(s))
    );
    const hintedClassHash = computeHintedClassHash(compiledContract);
    const dataHash = computeHashOnElements2(compiledContract.program.data);
    return computeHashOnElements2([
      apiVersion,
      externalEntryPointsHash,
      l1HandlerEntryPointsHash,
      constructorEntryPointHash,
      builtinsHash,
      hintedClassHash,
      dataHash
    ]);
  }
  function hashBuiltins(builtins) {
    return poseidonHashMany(
      builtins.flatMap((it) => {
        return BigInt(encodeShortString(it));
      })
    );
  }
  function hashEntryPoint(data) {
    const base = data.flatMap((it) => {
      return [BigInt(it.selector), BigInt(it.offset), hashBuiltins(it.builtins)];
    });
    return poseidonHashMany(base);
  }
  function computeCompiledClassHash(casm) {
    const COMPILED_CLASS_VERSION = "COMPILED_CLASS_V1";
    const compiledClassVersion = BigInt(encodeShortString(COMPILED_CLASS_VERSION));
    const externalEntryPointsHash = hashEntryPoint(casm.entry_points_by_type.EXTERNAL);
    const l1Handlers = hashEntryPoint(casm.entry_points_by_type.L1_HANDLER);
    const constructor = hashEntryPoint(casm.entry_points_by_type.CONSTRUCTOR);
    const bytecode = poseidonHashMany(casm.bytecode.map((it) => BigInt(it)));
    return toHex(
      poseidonHashMany([
        compiledClassVersion,
        externalEntryPointsHash,
        l1Handlers,
        constructor,
        bytecode
      ])
    );
  }
  function hashEntryPointSierra(data) {
    const base = data.flatMap((it) => {
      return [BigInt(it.selector), BigInt(it.function_idx)];
    });
    return poseidonHashMany(base);
  }
  function hashAbi(sierra) {
    const indentString = formatSpaces(stringify2(sierra.abi, null));
    return BigInt(addHexPrefix(esm_exports.keccak(utf8ToArray(indentString)).toString(16)));
  }
  function computeSierraContractClassHash(sierra) {
    const CONTRACT_CLASS_VERSION = "CONTRACT_CLASS_V0.1.0";
    const compiledClassVersion = BigInt(encodeShortString(CONTRACT_CLASS_VERSION));
    const externalEntryPointsHash = hashEntryPointSierra(sierra.entry_points_by_type.EXTERNAL);
    const l1Handlers = hashEntryPointSierra(sierra.entry_points_by_type.L1_HANDLER);
    const constructor = hashEntryPointSierra(sierra.entry_points_by_type.CONSTRUCTOR);
    const abiHash = hashAbi(sierra);
    const sierraProgram = poseidonHashMany(sierra.sierra_program.map((it) => BigInt(it)));
    return toHex(
      poseidonHashMany([
        compiledClassVersion,
        externalEntryPointsHash,
        l1Handlers,
        constructor,
        abiHash,
        sierraProgram
      ])
    );
  }
  function computeContractClassHash(contract) {
    const compiledContract = typeof contract === "string" ? parse2(contract) : contract;
    if ("sierra_program" in compiledContract) {
      return computeSierraContractClassHash(compiledContract);
    }
    return computeLegacyContractClassHash(compiledContract);
  }

  // src/utils/stark.ts
  var stark_exports = {};
  __export(stark_exports, {
    compressProgram: () => compressProgram,
    decompressProgram: () => decompressProgram,
    estimatedFeeToMaxFee: () => estimatedFeeToMaxFee,
    formatSignature: () => formatSignature,
    makeAddress: () => makeAddress,
    randomAddress: () => randomAddress,
    signatureToDecimalArray: () => signatureToDecimalArray,
    signatureToHexArray: () => signatureToHexArray
  });

  // node_modules/pako/dist/pako.esm.mjs
  var Z_FIXED$1 = 4;
  var Z_BINARY = 0;
  var Z_TEXT = 1;
  var Z_UNKNOWN$1 = 2;
  function zero$1(buf) {
    let len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  }
  var STORED_BLOCK = 0;
  var STATIC_TREES = 1;
  var DYN_TREES = 2;
  var MIN_MATCH$1 = 3;
  var MAX_MATCH$1 = 258;
  var LENGTH_CODES$1 = 29;
  var LITERALS$1 = 256;
  var L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
  var D_CODES$1 = 30;
  var BL_CODES$1 = 19;
  var HEAP_SIZE$1 = 2 * L_CODES$1 + 1;
  var MAX_BITS$1 = 15;
  var Buf_size = 16;
  var MAX_BL_BITS = 7;
  var END_BLOCK = 256;
  var REP_3_6 = 16;
  var REPZ_3_10 = 17;
  var REPZ_11_138 = 18;
  var extra_lbits = (
    /* extra bits for each length code */
    new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0])
  );
  var extra_dbits = (
    /* extra bits for each distance code */
    new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13])
  );
  var extra_blbits = (
    /* extra bits for each bit length code */
    new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7])
  );
  var bl_order = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var DIST_CODE_LEN = 512;
  var static_ltree = new Array((L_CODES$1 + 2) * 2);
  zero$1(static_ltree);
  var static_dtree = new Array(D_CODES$1 * 2);
  zero$1(static_dtree);
  var _dist_code = new Array(DIST_CODE_LEN);
  zero$1(_dist_code);
  var _length_code = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
  zero$1(_length_code);
  var base_length = new Array(LENGTH_CODES$1);
  zero$1(base_length);
  var base_dist = new Array(D_CODES$1);
  zero$1(base_dist);
  function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
    this.static_tree = static_tree;
    this.extra_bits = extra_bits;
    this.extra_base = extra_base;
    this.elems = elems;
    this.max_length = max_length;
    this.has_stree = static_tree && static_tree.length;
  }
  var static_l_desc;
  var static_d_desc;
  var static_bl_desc;
  function TreeDesc(dyn_tree, stat_desc) {
    this.dyn_tree = dyn_tree;
    this.max_code = 0;
    this.stat_desc = stat_desc;
  }
  var d_code = (dist) => {
    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
  };
  var put_short = (s, w) => {
    s.pending_buf[s.pending++] = w & 255;
    s.pending_buf[s.pending++] = w >>> 8 & 255;
  };
  var send_bits = (s, value, length) => {
    if (s.bi_valid > Buf_size - length) {
      s.bi_buf |= value << s.bi_valid & 65535;
      put_short(s, s.bi_buf);
      s.bi_buf = value >> Buf_size - s.bi_valid;
      s.bi_valid += length - Buf_size;
    } else {
      s.bi_buf |= value << s.bi_valid & 65535;
      s.bi_valid += length;
    }
  };
  var send_code = (s, c, tree) => {
    send_bits(
      s,
      tree[c * 2],
      tree[c * 2 + 1]
      /*.Len*/
    );
  };
  var bi_reverse = (code, len) => {
    let res = 0;
    do {
      res |= code & 1;
      code >>>= 1;
      res <<= 1;
    } while (--len > 0);
    return res >>> 1;
  };
  var bi_flush = (s) => {
    if (s.bi_valid === 16) {
      put_short(s, s.bi_buf);
      s.bi_buf = 0;
      s.bi_valid = 0;
    } else if (s.bi_valid >= 8) {
      s.pending_buf[s.pending++] = s.bi_buf & 255;
      s.bi_buf >>= 8;
      s.bi_valid -= 8;
    }
  };
  var gen_bitlen = (s, desc) => {
    const tree = desc.dyn_tree;
    const max_code = desc.max_code;
    const stree = desc.stat_desc.static_tree;
    const has_stree = desc.stat_desc.has_stree;
    const extra = desc.stat_desc.extra_bits;
    const base = desc.stat_desc.extra_base;
    const max_length = desc.stat_desc.max_length;
    let h;
    let n, m;
    let bits;
    let xbits;
    let f;
    let overflow = 0;
    for (bits = 0; bits <= MAX_BITS$1; bits++) {
      s.bl_count[bits] = 0;
    }
    tree[s.heap[s.heap_max] * 2 + 1] = 0;
    for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
      n = s.heap[h];
      bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
      if (bits > max_length) {
        bits = max_length;
        overflow++;
      }
      tree[n * 2 + 1] = bits;
      if (n > max_code) {
        continue;
      }
      s.bl_count[bits]++;
      xbits = 0;
      if (n >= base) {
        xbits = extra[n - base];
      }
      f = tree[n * 2];
      s.opt_len += f * (bits + xbits);
      if (has_stree) {
        s.static_len += f * (stree[n * 2 + 1] + xbits);
      }
    }
    if (overflow === 0) {
      return;
    }
    do {
      bits = max_length - 1;
      while (s.bl_count[bits] === 0) {
        bits--;
      }
      s.bl_count[bits]--;
      s.bl_count[bits + 1] += 2;
      s.bl_count[max_length]--;
      overflow -= 2;
    } while (overflow > 0);
    for (bits = max_length; bits !== 0; bits--) {
      n = s.bl_count[bits];
      while (n !== 0) {
        m = s.heap[--h];
        if (m > max_code) {
          continue;
        }
        if (tree[m * 2 + 1] !== bits) {
          s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
          tree[m * 2 + 1] = bits;
        }
        n--;
      }
    }
  };
  var gen_codes = (tree, max_code, bl_count) => {
    const next_code = new Array(MAX_BITS$1 + 1);
    let code = 0;
    let bits;
    let n;
    for (bits = 1; bits <= MAX_BITS$1; bits++) {
      code = code + bl_count[bits - 1] << 1;
      next_code[bits] = code;
    }
    for (n = 0; n <= max_code; n++) {
      let len = tree[n * 2 + 1];
      if (len === 0) {
        continue;
      }
      tree[n * 2] = bi_reverse(next_code[len]++, len);
    }
  };
  var tr_static_init = () => {
    let n;
    let bits;
    let length;
    let code;
    let dist;
    const bl_count = new Array(MAX_BITS$1 + 1);
    length = 0;
    for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
      base_length[code] = length;
      for (n = 0; n < 1 << extra_lbits[code]; n++) {
        _length_code[length++] = code;
      }
    }
    _length_code[length - 1] = code;
    dist = 0;
    for (code = 0; code < 16; code++) {
      base_dist[code] = dist;
      for (n = 0; n < 1 << extra_dbits[code]; n++) {
        _dist_code[dist++] = code;
      }
    }
    dist >>= 7;
    for (; code < D_CODES$1; code++) {
      base_dist[code] = dist << 7;
      for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
        _dist_code[256 + dist++] = code;
      }
    }
    for (bits = 0; bits <= MAX_BITS$1; bits++) {
      bl_count[bits] = 0;
    }
    n = 0;
    while (n <= 143) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    while (n <= 255) {
      static_ltree[n * 2 + 1] = 9;
      n++;
      bl_count[9]++;
    }
    while (n <= 279) {
      static_ltree[n * 2 + 1] = 7;
      n++;
      bl_count[7]++;
    }
    while (n <= 287) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    gen_codes(static_ltree, L_CODES$1 + 1, bl_count);
    for (n = 0; n < D_CODES$1; n++) {
      static_dtree[n * 2 + 1] = 5;
      static_dtree[n * 2] = bi_reverse(n, 5);
    }
    static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
    static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES$1, MAX_BITS$1);
    static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES$1, MAX_BL_BITS);
  };
  var init_block = (s) => {
    let n;
    for (n = 0; n < L_CODES$1; n++) {
      s.dyn_ltree[n * 2] = 0;
    }
    for (n = 0; n < D_CODES$1; n++) {
      s.dyn_dtree[n * 2] = 0;
    }
    for (n = 0; n < BL_CODES$1; n++) {
      s.bl_tree[n * 2] = 0;
    }
    s.dyn_ltree[END_BLOCK * 2] = 1;
    s.opt_len = s.static_len = 0;
    s.sym_next = s.matches = 0;
  };
  var bi_windup = (s) => {
    if (s.bi_valid > 8) {
      put_short(s, s.bi_buf);
    } else if (s.bi_valid > 0) {
      s.pending_buf[s.pending++] = s.bi_buf;
    }
    s.bi_buf = 0;
    s.bi_valid = 0;
  };
  var smaller = (tree, n, m, depth) => {
    const _n2 = n * 2;
    const _m2 = m * 2;
    return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
  };
  var pqdownheap = (s, tree, k) => {
    const v = s.heap[k];
    let j = k << 1;
    while (j <= s.heap_len) {
      if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
        j++;
      }
      if (smaller(tree, v, s.heap[j], s.depth)) {
        break;
      }
      s.heap[k] = s.heap[j];
      k = j;
      j <<= 1;
    }
    s.heap[k] = v;
  };
  var compress_block = (s, ltree, dtree) => {
    let dist;
    let lc;
    let sx = 0;
    let code;
    let extra;
    if (s.sym_next !== 0) {
      do {
        dist = s.pending_buf[s.sym_buf + sx++] & 255;
        dist += (s.pending_buf[s.sym_buf + sx++] & 255) << 8;
        lc = s.pending_buf[s.sym_buf + sx++];
        if (dist === 0) {
          send_code(s, lc, ltree);
        } else {
          code = _length_code[lc];
          send_code(s, code + LITERALS$1 + 1, ltree);
          extra = extra_lbits[code];
          if (extra !== 0) {
            lc -= base_length[code];
            send_bits(s, lc, extra);
          }
          dist--;
          code = d_code(dist);
          send_code(s, code, dtree);
          extra = extra_dbits[code];
          if (extra !== 0) {
            dist -= base_dist[code];
            send_bits(s, dist, extra);
          }
        }
      } while (sx < s.sym_next);
    }
    send_code(s, END_BLOCK, ltree);
  };
  var build_tree = (s, desc) => {
    const tree = desc.dyn_tree;
    const stree = desc.stat_desc.static_tree;
    const has_stree = desc.stat_desc.has_stree;
    const elems = desc.stat_desc.elems;
    let n, m;
    let max_code = -1;
    let node;
    s.heap_len = 0;
    s.heap_max = HEAP_SIZE$1;
    for (n = 0; n < elems; n++) {
      if (tree[n * 2] !== 0) {
        s.heap[++s.heap_len] = max_code = n;
        s.depth[n] = 0;
      } else {
        tree[n * 2 + 1] = 0;
      }
    }
    while (s.heap_len < 2) {
      node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
      tree[node * 2] = 1;
      s.depth[node] = 0;
      s.opt_len--;
      if (has_stree) {
        s.static_len -= stree[node * 2 + 1];
      }
    }
    desc.max_code = max_code;
    for (n = s.heap_len >> 1; n >= 1; n--) {
      pqdownheap(s, tree, n);
    }
    node = elems;
    do {
      n = s.heap[
        1
        /*SMALLEST*/
      ];
      s.heap[
        1
        /*SMALLEST*/
      ] = s.heap[s.heap_len--];
      pqdownheap(
        s,
        tree,
        1
        /*SMALLEST*/
      );
      m = s.heap[
        1
        /*SMALLEST*/
      ];
      s.heap[--s.heap_max] = n;
      s.heap[--s.heap_max] = m;
      tree[node * 2] = tree[n * 2] + tree[m * 2];
      s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
      tree[n * 2 + 1] = tree[m * 2 + 1] = node;
      s.heap[
        1
        /*SMALLEST*/
      ] = node++;
      pqdownheap(
        s,
        tree,
        1
        /*SMALLEST*/
      );
    } while (s.heap_len >= 2);
    s.heap[--s.heap_max] = s.heap[
      1
      /*SMALLEST*/
    ];
    gen_bitlen(s, desc);
    gen_codes(tree, max_code, s.bl_count);
  };
  var scan_tree = (s, tree, max_code) => {
    let n;
    let prevlen = -1;
    let curlen;
    let nextlen = tree[0 * 2 + 1];
    let count = 0;
    let max_count = 7;
    let min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    tree[(max_code + 1) * 2 + 1] = 65535;
    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        s.bl_tree[curlen * 2] += count;
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          s.bl_tree[curlen * 2]++;
        }
        s.bl_tree[REP_3_6 * 2]++;
      } else if (count <= 10) {
        s.bl_tree[REPZ_3_10 * 2]++;
      } else {
        s.bl_tree[REPZ_11_138 * 2]++;
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  };
  var send_tree = (s, tree, max_code) => {
    let n;
    let prevlen = -1;
    let curlen;
    let nextlen = tree[0 * 2 + 1];
    let count = 0;
    let max_count = 7;
    let min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        do {
          send_code(s, curlen, s.bl_tree);
        } while (--count !== 0);
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          send_code(s, curlen, s.bl_tree);
          count--;
        }
        send_code(s, REP_3_6, s.bl_tree);
        send_bits(s, count - 3, 2);
      } else if (count <= 10) {
        send_code(s, REPZ_3_10, s.bl_tree);
        send_bits(s, count - 3, 3);
      } else {
        send_code(s, REPZ_11_138, s.bl_tree);
        send_bits(s, count - 11, 7);
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  };
  var build_bl_tree = (s) => {
    let max_blindex;
    scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
    scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
    build_tree(s, s.bl_desc);
    for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
      if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
        break;
      }
    }
    s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
    return max_blindex;
  };
  var send_all_trees = (s, lcodes, dcodes, blcodes) => {
    let rank2;
    send_bits(s, lcodes - 257, 5);
    send_bits(s, dcodes - 1, 5);
    send_bits(s, blcodes - 4, 4);
    for (rank2 = 0; rank2 < blcodes; rank2++) {
      send_bits(s, s.bl_tree[bl_order[rank2] * 2 + 1], 3);
    }
    send_tree(s, s.dyn_ltree, lcodes - 1);
    send_tree(s, s.dyn_dtree, dcodes - 1);
  };
  var detect_data_type = (s) => {
    let block_mask = 4093624447;
    let n;
    for (n = 0; n <= 31; n++, block_mask >>>= 1) {
      if (block_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
        return Z_BINARY;
      }
    }
    if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
      return Z_TEXT;
    }
    for (n = 32; n < LITERALS$1; n++) {
      if (s.dyn_ltree[n * 2] !== 0) {
        return Z_TEXT;
      }
    }
    return Z_BINARY;
  };
  var static_init_done = false;
  var _tr_init$1 = (s) => {
    if (!static_init_done) {
      tr_static_init();
      static_init_done = true;
    }
    s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
    s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
    s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
    s.bi_buf = 0;
    s.bi_valid = 0;
    init_block(s);
  };
  var _tr_stored_block$1 = (s, buf, stored_len, last) => {
    send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
    bi_windup(s);
    put_short(s, stored_len);
    put_short(s, ~stored_len);
    if (stored_len) {
      s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
    }
    s.pending += stored_len;
  };
  var _tr_align$1 = (s) => {
    send_bits(s, STATIC_TREES << 1, 3);
    send_code(s, END_BLOCK, static_ltree);
    bi_flush(s);
  };
  var _tr_flush_block$1 = (s, buf, stored_len, last) => {
    let opt_lenb, static_lenb;
    let max_blindex = 0;
    if (s.level > 0) {
      if (s.strm.data_type === Z_UNKNOWN$1) {
        s.strm.data_type = detect_data_type(s);
      }
      build_tree(s, s.l_desc);
      build_tree(s, s.d_desc);
      max_blindex = build_bl_tree(s);
      opt_lenb = s.opt_len + 3 + 7 >>> 3;
      static_lenb = s.static_len + 3 + 7 >>> 3;
      if (static_lenb <= opt_lenb) {
        opt_lenb = static_lenb;
      }
    } else {
      opt_lenb = static_lenb = stored_len + 5;
    }
    if (stored_len + 4 <= opt_lenb && buf !== -1) {
      _tr_stored_block$1(s, buf, stored_len, last);
    } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {
      send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
      compress_block(s, static_ltree, static_dtree);
    } else {
      send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
      send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
      compress_block(s, s.dyn_ltree, s.dyn_dtree);
    }
    init_block(s);
    if (last) {
      bi_windup(s);
    }
  };
  var _tr_tally$1 = (s, dist, lc) => {
    s.pending_buf[s.sym_buf + s.sym_next++] = dist;
    s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
    s.pending_buf[s.sym_buf + s.sym_next++] = lc;
    if (dist === 0) {
      s.dyn_ltree[lc * 2]++;
    } else {
      s.matches++;
      dist--;
      s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]++;
      s.dyn_dtree[d_code(dist) * 2]++;
    }
    return s.sym_next === s.sym_end;
  };
  var _tr_init_1 = _tr_init$1;
  var _tr_stored_block_1 = _tr_stored_block$1;
  var _tr_flush_block_1 = _tr_flush_block$1;
  var _tr_tally_1 = _tr_tally$1;
  var _tr_align_1 = _tr_align$1;
  var trees = {
    _tr_init: _tr_init_1,
    _tr_stored_block: _tr_stored_block_1,
    _tr_flush_block: _tr_flush_block_1,
    _tr_tally: _tr_tally_1,
    _tr_align: _tr_align_1
  };
  var adler32 = (adler, buf, len, pos) => {
    let s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
    while (len !== 0) {
      n = len > 2e3 ? 2e3 : len;
      len -= n;
      do {
        s1 = s1 + buf[pos++] | 0;
        s2 = s2 + s1 | 0;
      } while (--n);
      s1 %= 65521;
      s2 %= 65521;
    }
    return s1 | s2 << 16 | 0;
  };
  var adler32_1 = adler32;
  var makeTable = () => {
    let c, table = [];
    for (var n = 0; n < 256; n++) {
      c = n;
      for (var k = 0; k < 8; k++) {
        c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
      }
      table[n] = c;
    }
    return table;
  };
  var crcTable = new Uint32Array(makeTable());
  var crc32 = (crc, buf, len, pos) => {
    const t = crcTable;
    const end = pos + len;
    crc ^= -1;
    for (let i = pos; i < end; i++) {
      crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
    }
    return crc ^ -1;
  };
  var crc32_1 = crc32;
  var messages = {
    2: "need dictionary",
    /* Z_NEED_DICT       2  */
    1: "stream end",
    /* Z_STREAM_END      1  */
    0: "",
    /* Z_OK              0  */
    "-1": "file error",
    /* Z_ERRNO         (-1) */
    "-2": "stream error",
    /* Z_STREAM_ERROR  (-2) */
    "-3": "data error",
    /* Z_DATA_ERROR    (-3) */
    "-4": "insufficient memory",
    /* Z_MEM_ERROR     (-4) */
    "-5": "buffer error",
    /* Z_BUF_ERROR     (-5) */
    "-6": "incompatible version"
    /* Z_VERSION_ERROR (-6) */
  };
  var constants$2 = {
    /* Allowed flush values; see deflate() and inflate() below for details */
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    /* Return codes for the compression/decompression functions. Negative values
    * are errors, positive values are used for special but normal events.
    */
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_MEM_ERROR: -4,
    Z_BUF_ERROR: -5,
    //Z_VERSION_ERROR: -6,
    /* compression levels */
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    /* Possible values of the data_type field (though see inflate()) */
    Z_BINARY: 0,
    Z_TEXT: 1,
    //Z_ASCII:                1, // = Z_TEXT (deprecated)
    Z_UNKNOWN: 2,
    /* The deflate compression method */
    Z_DEFLATED: 8
    //Z_NULL:                 null // Use -1 or null inline, depending on var type
  };
  var { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = trees;
  var {
    Z_NO_FLUSH: Z_NO_FLUSH$2,
    Z_PARTIAL_FLUSH,
    Z_FULL_FLUSH: Z_FULL_FLUSH$1,
    Z_FINISH: Z_FINISH$3,
    Z_BLOCK: Z_BLOCK$1,
    Z_OK: Z_OK$3,
    Z_STREAM_END: Z_STREAM_END$3,
    Z_STREAM_ERROR: Z_STREAM_ERROR$2,
    Z_DATA_ERROR: Z_DATA_ERROR$2,
    Z_BUF_ERROR: Z_BUF_ERROR$1,
    Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1,
    Z_FILTERED,
    Z_HUFFMAN_ONLY,
    Z_RLE,
    Z_FIXED,
    Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1,
    Z_UNKNOWN,
    Z_DEFLATED: Z_DEFLATED$2
  } = constants$2;
  var MAX_MEM_LEVEL = 9;
  var MAX_WBITS$1 = 15;
  var DEF_MEM_LEVEL = 8;
  var LENGTH_CODES = 29;
  var LITERALS = 256;
  var L_CODES = LITERALS + 1 + LENGTH_CODES;
  var D_CODES = 30;
  var BL_CODES = 19;
  var HEAP_SIZE = 2 * L_CODES + 1;
  var MAX_BITS = 15;
  var MIN_MATCH = 3;
  var MAX_MATCH = 258;
  var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
  var PRESET_DICT = 32;
  var INIT_STATE = 42;
  var GZIP_STATE = 57;
  var EXTRA_STATE = 69;
  var NAME_STATE = 73;
  var COMMENT_STATE = 91;
  var HCRC_STATE = 103;
  var BUSY_STATE = 113;
  var FINISH_STATE = 666;
  var BS_NEED_MORE = 1;
  var BS_BLOCK_DONE = 2;
  var BS_FINISH_STARTED = 3;
  var BS_FINISH_DONE = 4;
  var OS_CODE = 3;
  var err = (strm, errorCode) => {
    strm.msg = messages[errorCode];
    return errorCode;
  };
  var rank = (f) => {
    return f * 2 - (f > 4 ? 9 : 0);
  };
  var zero = (buf) => {
    let len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  };
  var slide_hash = (s) => {
    let n, m;
    let p;
    let wsize = s.w_size;
    n = s.hash_size;
    p = n;
    do {
      m = s.head[--p];
      s.head[p] = m >= wsize ? m - wsize : 0;
    } while (--n);
    n = wsize;
    p = n;
    do {
      m = s.prev[--p];
      s.prev[p] = m >= wsize ? m - wsize : 0;
    } while (--n);
  };
  var HASH_ZLIB = (s, prev, data) => (prev << s.hash_shift ^ data) & s.hash_mask;
  var HASH = HASH_ZLIB;
  var flush_pending = (strm) => {
    const s = strm.state;
    let len = s.pending;
    if (len > strm.avail_out) {
      len = strm.avail_out;
    }
    if (len === 0) {
      return;
    }
    strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
    strm.next_out += len;
    s.pending_out += len;
    strm.total_out += len;
    strm.avail_out -= len;
    s.pending -= len;
    if (s.pending === 0) {
      s.pending_out = 0;
    }
  };
  var flush_block_only = (s, last) => {
    _tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
    s.block_start = s.strstart;
    flush_pending(s.strm);
  };
  var put_byte = (s, b) => {
    s.pending_buf[s.pending++] = b;
  };
  var putShortMSB = (s, b) => {
    s.pending_buf[s.pending++] = b >>> 8 & 255;
    s.pending_buf[s.pending++] = b & 255;
  };
  var read_buf = (strm, buf, start, size) => {
    let len = strm.avail_in;
    if (len > size) {
      len = size;
    }
    if (len === 0) {
      return 0;
    }
    strm.avail_in -= len;
    buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
    if (strm.state.wrap === 1) {
      strm.adler = adler32_1(strm.adler, buf, len, start);
    } else if (strm.state.wrap === 2) {
      strm.adler = crc32_1(strm.adler, buf, len, start);
    }
    strm.next_in += len;
    strm.total_in += len;
    return len;
  };
  var longest_match = (s, cur_match) => {
    let chain_length = s.max_chain_length;
    let scan = s.strstart;
    let match;
    let len;
    let best_len = s.prev_length;
    let nice_match = s.nice_match;
    const limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
    const _win = s.window;
    const wmask = s.w_mask;
    const prev = s.prev;
    const strend = s.strstart + MAX_MATCH;
    let scan_end1 = _win[scan + best_len - 1];
    let scan_end = _win[scan + best_len];
    if (s.prev_length >= s.good_match) {
      chain_length >>= 2;
    }
    if (nice_match > s.lookahead) {
      nice_match = s.lookahead;
    }
    do {
      match = cur_match;
      if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
        continue;
      }
      scan += 2;
      match++;
      do {
      } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
      len = MAX_MATCH - (strend - scan);
      scan = strend - MAX_MATCH;
      if (len > best_len) {
        s.match_start = cur_match;
        best_len = len;
        if (len >= nice_match) {
          break;
        }
        scan_end1 = _win[scan + best_len - 1];
        scan_end = _win[scan + best_len];
      }
    } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
    if (best_len <= s.lookahead) {
      return best_len;
    }
    return s.lookahead;
  };
  var fill_window = (s) => {
    const _w_size = s.w_size;
    let n, more, str;
    do {
      more = s.window_size - s.lookahead - s.strstart;
      if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
        s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
        s.match_start -= _w_size;
        s.strstart -= _w_size;
        s.block_start -= _w_size;
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
        slide_hash(s);
        more += _w_size;
      }
      if (s.strm.avail_in === 0) {
        break;
      }
      n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
      s.lookahead += n;
      if (s.lookahead + s.insert >= MIN_MATCH) {
        str = s.strstart - s.insert;
        s.ins_h = s.window[str];
        s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
        while (s.insert) {
          s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
          s.prev[str & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str;
          str++;
          s.insert--;
          if (s.lookahead + s.insert < MIN_MATCH) {
            break;
          }
        }
      }
    } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
  };
  var deflate_stored = (s, flush) => {
    let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;
    let len, left, have, last = 0;
    let used = s.strm.avail_in;
    do {
      len = 65535;
      have = s.bi_valid + 42 >> 3;
      if (s.strm.avail_out < have) {
        break;
      }
      have = s.strm.avail_out - have;
      left = s.strstart - s.block_start;
      if (len > left + s.strm.avail_in) {
        len = left + s.strm.avail_in;
      }
      if (len > have) {
        len = have;
      }
      if (len < min_block && (len === 0 && flush !== Z_FINISH$3 || flush === Z_NO_FLUSH$2 || len !== left + s.strm.avail_in)) {
        break;
      }
      last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
      _tr_stored_block(s, 0, 0, last);
      s.pending_buf[s.pending - 4] = len;
      s.pending_buf[s.pending - 3] = len >> 8;
      s.pending_buf[s.pending - 2] = ~len;
      s.pending_buf[s.pending - 1] = ~len >> 8;
      flush_pending(s.strm);
      if (left) {
        if (left > len) {
          left = len;
        }
        s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
        s.strm.next_out += left;
        s.strm.avail_out -= left;
        s.strm.total_out += left;
        s.block_start += left;
        len -= left;
      }
      if (len) {
        read_buf(s.strm, s.strm.output, s.strm.next_out, len);
        s.strm.next_out += len;
        s.strm.avail_out -= len;
        s.strm.total_out += len;
      }
    } while (last === 0);
    used -= s.strm.avail_in;
    if (used) {
      if (used >= s.w_size) {
        s.matches = 2;
        s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
        s.strstart = s.w_size;
        s.insert = s.strstart;
      } else {
        if (s.window_size - s.strstart <= used) {
          s.strstart -= s.w_size;
          s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
          if (s.matches < 2) {
            s.matches++;
          }
          if (s.insert > s.strstart) {
            s.insert = s.strstart;
          }
        }
        s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
        s.strstart += used;
        s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
      }
      s.block_start = s.strstart;
    }
    if (s.high_water < s.strstart) {
      s.high_water = s.strstart;
    }
    if (last) {
      return BS_FINISH_DONE;
    }
    if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 && s.strm.avail_in === 0 && s.strstart === s.block_start) {
      return BS_BLOCK_DONE;
    }
    have = s.window_size - s.strstart;
    if (s.strm.avail_in > have && s.block_start >= s.w_size) {
      s.block_start -= s.w_size;
      s.strstart -= s.w_size;
      s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
      if (s.matches < 2) {
        s.matches++;
      }
      have += s.w_size;
      if (s.insert > s.strstart) {
        s.insert = s.strstart;
      }
    }
    if (have > s.strm.avail_in) {
      have = s.strm.avail_in;
    }
    if (have) {
      read_buf(s.strm, s.window, s.strstart, have);
      s.strstart += have;
      s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
    }
    if (s.high_water < s.strstart) {
      s.high_water = s.strstart;
    }
    have = s.bi_valid + 42 >> 3;
    have = s.pending_buf_size - have > 65535 ? 65535 : s.pending_buf_size - have;
    min_block = have > s.w_size ? s.w_size : have;
    left = s.strstart - s.block_start;
    if (left >= min_block || (left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 && s.strm.avail_in === 0 && left <= have) {
      len = left > have ? have : left;
      last = flush === Z_FINISH$3 && s.strm.avail_in === 0 && len === left ? 1 : 0;
      _tr_stored_block(s, s.block_start, len, last);
      s.block_start += len;
      flush_pending(s.strm);
    }
    return last ? BS_FINISH_STARTED : BS_NEED_MORE;
  };
  var deflate_fast = (s, flush) => {
    let hash_head;
    let bflush;
    for (; ; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) {
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
      }
      if (s.match_length >= MIN_MATCH) {
        bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
          s.match_length--;
          do {
            s.strstart++;
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          } while (--s.match_length !== 0);
          s.strstart++;
        } else {
          s.strstart += s.match_length;
          s.match_length = 0;
          s.ins_h = s.window[s.strstart];
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);
        }
      } else {
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  var deflate_slow = (s, flush) => {
    let hash_head;
    let bflush;
    let max_insert;
    for (; ; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) {
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      s.prev_length = s.match_length;
      s.prev_match = s.match_start;
      s.match_length = MIN_MATCH - 1;
      if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
        if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
          s.match_length = MIN_MATCH - 1;
        }
      }
      if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
        max_insert = s.strstart + s.lookahead - MIN_MATCH;
        bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
        s.lookahead -= s.prev_length - 1;
        s.prev_length -= 2;
        do {
          if (++s.strstart <= max_insert) {
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          }
        } while (--s.prev_length !== 0);
        s.match_available = 0;
        s.match_length = MIN_MATCH - 1;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      } else if (s.match_available) {
        bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
        if (bflush) {
          flush_block_only(s, false);
        }
        s.strstart++;
        s.lookahead--;
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      } else {
        s.match_available = 1;
        s.strstart++;
        s.lookahead--;
      }
    }
    if (s.match_available) {
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
      s.match_available = 0;
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  var deflate_rle = (s, flush) => {
    let bflush;
    let prev;
    let scan, strend;
    const _win = s.window;
    for (; ; ) {
      if (s.lookahead <= MAX_MATCH) {
        fill_window(s);
        if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      s.match_length = 0;
      if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
        scan = s.strstart - 1;
        prev = _win[scan];
        if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
          strend = s.strstart + MAX_MATCH;
          do {
          } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
          s.match_length = MAX_MATCH - (strend - scan);
          if (s.match_length > s.lookahead) {
            s.match_length = s.lookahead;
          }
        }
      }
      if (s.match_length >= MIN_MATCH) {
        bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        s.strstart += s.match_length;
        s.match_length = 0;
      } else {
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  var deflate_huff = (s, flush) => {
    let bflush;
    for (; ; ) {
      if (s.lookahead === 0) {
        fill_window(s);
        if (s.lookahead === 0) {
          if (flush === Z_NO_FLUSH$2) {
            return BS_NEED_MORE;
          }
          break;
        }
      }
      s.match_length = 0;
      bflush = _tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  function Config(good_length, max_lazy, nice_length, max_chain, func) {
    this.good_length = good_length;
    this.max_lazy = max_lazy;
    this.nice_length = nice_length;
    this.max_chain = max_chain;
    this.func = func;
  }
  var configuration_table = [
    /*      good lazy nice chain */
    new Config(0, 0, 0, 0, deflate_stored),
    /* 0 store only */
    new Config(4, 4, 8, 4, deflate_fast),
    /* 1 max speed, no lazy matches */
    new Config(4, 5, 16, 8, deflate_fast),
    /* 2 */
    new Config(4, 6, 32, 32, deflate_fast),
    /* 3 */
    new Config(4, 4, 16, 16, deflate_slow),
    /* 4 lazy matches */
    new Config(8, 16, 32, 32, deflate_slow),
    /* 5 */
    new Config(8, 16, 128, 128, deflate_slow),
    /* 6 */
    new Config(8, 32, 128, 256, deflate_slow),
    /* 7 */
    new Config(32, 128, 258, 1024, deflate_slow),
    /* 8 */
    new Config(32, 258, 258, 4096, deflate_slow)
    /* 9 max compression */
  ];
  var lm_init = (s) => {
    s.window_size = 2 * s.w_size;
    zero(s.head);
    s.max_lazy_match = configuration_table[s.level].max_lazy;
    s.good_match = configuration_table[s.level].good_length;
    s.nice_match = configuration_table[s.level].nice_length;
    s.max_chain_length = configuration_table[s.level].max_chain;
    s.strstart = 0;
    s.block_start = 0;
    s.lookahead = 0;
    s.insert = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    s.ins_h = 0;
  };
  function DeflateState() {
    this.strm = null;
    this.status = 0;
    this.pending_buf = null;
    this.pending_buf_size = 0;
    this.pending_out = 0;
    this.pending = 0;
    this.wrap = 0;
    this.gzhead = null;
    this.gzindex = 0;
    this.method = Z_DEFLATED$2;
    this.last_flush = -1;
    this.w_size = 0;
    this.w_bits = 0;
    this.w_mask = 0;
    this.window = null;
    this.window_size = 0;
    this.prev = null;
    this.head = null;
    this.ins_h = 0;
    this.hash_size = 0;
    this.hash_bits = 0;
    this.hash_mask = 0;
    this.hash_shift = 0;
    this.block_start = 0;
    this.match_length = 0;
    this.prev_match = 0;
    this.match_available = 0;
    this.strstart = 0;
    this.match_start = 0;
    this.lookahead = 0;
    this.prev_length = 0;
    this.max_chain_length = 0;
    this.max_lazy_match = 0;
    this.level = 0;
    this.strategy = 0;
    this.good_match = 0;
    this.nice_match = 0;
    this.dyn_ltree = new Uint16Array(HEAP_SIZE * 2);
    this.dyn_dtree = new Uint16Array((2 * D_CODES + 1) * 2);
    this.bl_tree = new Uint16Array((2 * BL_CODES + 1) * 2);
    zero(this.dyn_ltree);
    zero(this.dyn_dtree);
    zero(this.bl_tree);
    this.l_desc = null;
    this.d_desc = null;
    this.bl_desc = null;
    this.bl_count = new Uint16Array(MAX_BITS + 1);
    this.heap = new Uint16Array(2 * L_CODES + 1);
    zero(this.heap);
    this.heap_len = 0;
    this.heap_max = 0;
    this.depth = new Uint16Array(2 * L_CODES + 1);
    zero(this.depth);
    this.sym_buf = 0;
    this.lit_bufsize = 0;
    this.sym_next = 0;
    this.sym_end = 0;
    this.opt_len = 0;
    this.static_len = 0;
    this.matches = 0;
    this.insert = 0;
    this.bi_buf = 0;
    this.bi_valid = 0;
  }
  var deflateStateCheck = (strm) => {
    if (!strm) {
      return 1;
    }
    const s = strm.state;
    if (!s || s.strm !== strm || s.status !== INIT_STATE && //#ifdef GZIP
    s.status !== GZIP_STATE && //#endif
    s.status !== EXTRA_STATE && s.status !== NAME_STATE && s.status !== COMMENT_STATE && s.status !== HCRC_STATE && s.status !== BUSY_STATE && s.status !== FINISH_STATE) {
      return 1;
    }
    return 0;
  };
  var deflateResetKeep = (strm) => {
    if (deflateStateCheck(strm)) {
      return err(strm, Z_STREAM_ERROR$2);
    }
    strm.total_in = strm.total_out = 0;
    strm.data_type = Z_UNKNOWN;
    const s = strm.state;
    s.pending = 0;
    s.pending_out = 0;
    if (s.wrap < 0) {
      s.wrap = -s.wrap;
    }
    s.status = //#ifdef GZIP
    s.wrap === 2 ? GZIP_STATE : (
      //#endif
      s.wrap ? INIT_STATE : BUSY_STATE
    );
    strm.adler = s.wrap === 2 ? 0 : 1;
    s.last_flush = -2;
    _tr_init(s);
    return Z_OK$3;
  };
  var deflateReset = (strm) => {
    const ret = deflateResetKeep(strm);
    if (ret === Z_OK$3) {
      lm_init(strm.state);
    }
    return ret;
  };
  var deflateSetHeader = (strm, head) => {
    if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
      return Z_STREAM_ERROR$2;
    }
    strm.state.gzhead = head;
    return Z_OK$3;
  };
  var deflateInit2 = (strm, level, method, windowBits, memLevel, strategy) => {
    if (!strm) {
      return Z_STREAM_ERROR$2;
    }
    let wrap = 1;
    if (level === Z_DEFAULT_COMPRESSION$1) {
      level = 6;
    }
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else if (windowBits > 15) {
      wrap = 2;
      windowBits -= 16;
    }
    if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED || windowBits === 8 && wrap !== 1) {
      return err(strm, Z_STREAM_ERROR$2);
    }
    if (windowBits === 8) {
      windowBits = 9;
    }
    const s = new DeflateState();
    strm.state = s;
    s.strm = strm;
    s.status = INIT_STATE;
    s.wrap = wrap;
    s.gzhead = null;
    s.w_bits = windowBits;
    s.w_size = 1 << s.w_bits;
    s.w_mask = s.w_size - 1;
    s.hash_bits = memLevel + 7;
    s.hash_size = 1 << s.hash_bits;
    s.hash_mask = s.hash_size - 1;
    s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
    s.window = new Uint8Array(s.w_size * 2);
    s.head = new Uint16Array(s.hash_size);
    s.prev = new Uint16Array(s.w_size);
    s.lit_bufsize = 1 << memLevel + 6;
    s.pending_buf_size = s.lit_bufsize * 4;
    s.pending_buf = new Uint8Array(s.pending_buf_size);
    s.sym_buf = s.lit_bufsize;
    s.sym_end = (s.lit_bufsize - 1) * 3;
    s.level = level;
    s.strategy = strategy;
    s.method = method;
    return deflateReset(strm);
  };
  var deflateInit = (strm, level) => {
    return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
  };
  var deflate$2 = (strm, flush) => {
    if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) {
      return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
    }
    const s = strm.state;
    if (!strm.output || strm.avail_in !== 0 && !strm.input || s.status === FINISH_STATE && flush !== Z_FINISH$3) {
      return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$2);
    }
    const old_flush = s.last_flush;
    s.last_flush = flush;
    if (s.pending !== 0) {
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH$3) {
      return err(strm, Z_BUF_ERROR$1);
    }
    if (s.status === FINISH_STATE && strm.avail_in !== 0) {
      return err(strm, Z_BUF_ERROR$1);
    }
    if (s.status === INIT_STATE && s.wrap === 0) {
      s.status = BUSY_STATE;
    }
    if (s.status === INIT_STATE) {
      let header = Z_DEFLATED$2 + (s.w_bits - 8 << 4) << 8;
      let level_flags = -1;
      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= level_flags << 6;
      if (s.strstart !== 0) {
        header |= PRESET_DICT;
      }
      header += 31 - header % 31;
      putShortMSB(s, header);
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 65535);
      }
      strm.adler = 1;
      s.status = BUSY_STATE;
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    if (s.status === GZIP_STATE) {
      strm.adler = 0;
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) {
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      } else {
        put_byte(
          s,
          (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16)
        );
        put_byte(s, s.gzhead.time & 255);
        put_byte(s, s.gzhead.time >> 8 & 255);
        put_byte(s, s.gzhead.time >> 16 & 255);
        put_byte(s, s.gzhead.time >> 24 & 255);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, s.gzhead.os & 255);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 255);
          put_byte(s, s.gzhead.extra.length >> 8 & 255);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    }
    if (s.status === EXTRA_STATE) {
      if (s.gzhead.extra) {
        let beg = s.pending;
        let left = (s.gzhead.extra.length & 65535) - s.gzindex;
        while (s.pending + left > s.pending_buf_size) {
          let copy = s.pending_buf_size - s.pending;
          s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
          s.pending = s.pending_buf_size;
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          s.gzindex += copy;
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
          left -= copy;
        }
        let gzhead_extra = new Uint8Array(s.gzhead.extra);
        s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
        s.pending += left;
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        s.gzindex = 0;
      }
      s.status = NAME_STATE;
    }
    if (s.status === NAME_STATE) {
      if (s.gzhead.name) {
        let beg = s.pending;
        let val;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK$3;
            }
            beg = 0;
          }
          if (s.gzindex < s.gzhead.name.length) {
            val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        s.gzindex = 0;
      }
      s.status = COMMENT_STATE;
    }
    if (s.status === COMMENT_STATE) {
      if (s.gzhead.comment) {
        let beg = s.pending;
        let val;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK$3;
            }
            beg = 0;
          }
          if (s.gzindex < s.gzhead.comment.length) {
            val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
      }
      s.status = HCRC_STATE;
    }
    if (s.status === HCRC_STATE) {
      if (s.gzhead.hcrc) {
        if (s.pending + 2 > s.pending_buf_size) {
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
        }
        put_byte(s, strm.adler & 255);
        put_byte(s, strm.adler >> 8 & 255);
        strm.adler = 0;
      }
      s.status = BUSY_STATE;
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE) {
      let bstate = s.level === 0 ? deflate_stored(s, flush) : s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
      if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
        s.status = FINISH_STATE;
      }
      if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
        if (strm.avail_out === 0) {
          s.last_flush = -1;
        }
        return Z_OK$3;
      }
      if (bstate === BS_BLOCK_DONE) {
        if (flush === Z_PARTIAL_FLUSH) {
          _tr_align(s);
        } else if (flush !== Z_BLOCK$1) {
          _tr_stored_block(s, 0, 0, false);
          if (flush === Z_FULL_FLUSH$1) {
            zero(s.head);
            if (s.lookahead === 0) {
              s.strstart = 0;
              s.block_start = 0;
              s.insert = 0;
            }
          }
        }
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      }
    }
    if (flush !== Z_FINISH$3) {
      return Z_OK$3;
    }
    if (s.wrap <= 0) {
      return Z_STREAM_END$3;
    }
    if (s.wrap === 2) {
      put_byte(s, strm.adler & 255);
      put_byte(s, strm.adler >> 8 & 255);
      put_byte(s, strm.adler >> 16 & 255);
      put_byte(s, strm.adler >> 24 & 255);
      put_byte(s, strm.total_in & 255);
      put_byte(s, strm.total_in >> 8 & 255);
      put_byte(s, strm.total_in >> 16 & 255);
      put_byte(s, strm.total_in >> 24 & 255);
    } else {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 65535);
    }
    flush_pending(strm);
    if (s.wrap > 0) {
      s.wrap = -s.wrap;
    }
    return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;
  };
  var deflateEnd = (strm) => {
    if (deflateStateCheck(strm)) {
      return Z_STREAM_ERROR$2;
    }
    const status = strm.state.status;
    strm.state = null;
    return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
  };
  var deflateSetDictionary = (strm, dictionary) => {
    let dictLength = dictionary.length;
    if (deflateStateCheck(strm)) {
      return Z_STREAM_ERROR$2;
    }
    const s = strm.state;
    const wrap = s.wrap;
    if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
      return Z_STREAM_ERROR$2;
    }
    if (wrap === 1) {
      strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
    }
    s.wrap = 0;
    if (dictLength >= s.w_size) {
      if (wrap === 0) {
        zero(s.head);
        s.strstart = 0;
        s.block_start = 0;
        s.insert = 0;
      }
      let tmpDict = new Uint8Array(s.w_size);
      tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
      dictionary = tmpDict;
      dictLength = s.w_size;
    }
    const avail = strm.avail_in;
    const next = strm.next_in;
    const input = strm.input;
    strm.avail_in = dictLength;
    strm.next_in = 0;
    strm.input = dictionary;
    fill_window(s);
    while (s.lookahead >= MIN_MATCH) {
      let str = s.strstart;
      let n = s.lookahead - (MIN_MATCH - 1);
      do {
        s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
      } while (--n);
      s.strstart = str;
      s.lookahead = MIN_MATCH - 1;
      fill_window(s);
    }
    s.strstart += s.lookahead;
    s.block_start = s.strstart;
    s.insert = s.lookahead;
    s.lookahead = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    strm.next_in = next;
    strm.input = input;
    strm.avail_in = avail;
    s.wrap = wrap;
    return Z_OK$3;
  };
  var deflateInit_1 = deflateInit;
  var deflateInit2_1 = deflateInit2;
  var deflateReset_1 = deflateReset;
  var deflateResetKeep_1 = deflateResetKeep;
  var deflateSetHeader_1 = deflateSetHeader;
  var deflate_2$1 = deflate$2;
  var deflateEnd_1 = deflateEnd;
  var deflateSetDictionary_1 = deflateSetDictionary;
  var deflateInfo = "pako deflate (from Nodeca project)";
  var deflate_1$2 = {
    deflateInit: deflateInit_1,
    deflateInit2: deflateInit2_1,
    deflateReset: deflateReset_1,
    deflateResetKeep: deflateResetKeep_1,
    deflateSetHeader: deflateSetHeader_1,
    deflate: deflate_2$1,
    deflateEnd: deflateEnd_1,
    deflateSetDictionary: deflateSetDictionary_1,
    deflateInfo
  };
  var _has = (obj, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
  var assign = function(obj) {
    const sources = Array.prototype.slice.call(arguments, 1);
    while (sources.length) {
      const source = sources.shift();
      if (!source) {
        continue;
      }
      if (typeof source !== "object") {
        throw new TypeError(source + "must be non-object");
      }
      for (const p in source) {
        if (_has(source, p)) {
          obj[p] = source[p];
        }
      }
    }
    return obj;
  };
  var flattenChunks = (chunks) => {
    let len = 0;
    for (let i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }
    const result = new Uint8Array(len);
    for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
      let chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }
    return result;
  };
  var common = {
    assign,
    flattenChunks
  };
  var STR_APPLY_UIA_OK = true;
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch (__) {
    STR_APPLY_UIA_OK = false;
  }
  var _utf8len = new Uint8Array(256);
  for (let q = 0; q < 256; q++) {
    _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
  }
  _utf8len[254] = _utf8len[254] = 1;
  var string2buf = (str) => {
    if (typeof TextEncoder === "function" && TextEncoder.prototype.encode) {
      return new TextEncoder().encode(str);
    }
    let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
    for (m_pos = 0; m_pos < str_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
    }
    buf = new Uint8Array(buf_len);
    for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      if (c < 128) {
        buf[i++] = c;
      } else if (c < 2048) {
        buf[i++] = 192 | c >>> 6;
        buf[i++] = 128 | c & 63;
      } else if (c < 65536) {
        buf[i++] = 224 | c >>> 12;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      } else {
        buf[i++] = 240 | c >>> 18;
        buf[i++] = 128 | c >>> 12 & 63;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      }
    }
    return buf;
  };
  var buf2binstring = (buf, len) => {
    if (len < 65534) {
      if (buf.subarray && STR_APPLY_UIA_OK) {
        return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
      }
    }
    let result = "";
    for (let i = 0; i < len; i++) {
      result += String.fromCharCode(buf[i]);
    }
    return result;
  };
  var buf2string = (buf, max) => {
    const len = max || buf.length;
    if (typeof TextDecoder === "function" && TextDecoder.prototype.decode) {
      return new TextDecoder().decode(buf.subarray(0, max));
    }
    let i, out;
    const utf16buf = new Array(len * 2);
    for (out = 0, i = 0; i < len; ) {
      let c = buf[i++];
      if (c < 128) {
        utf16buf[out++] = c;
        continue;
      }
      let c_len = _utf8len[c];
      if (c_len > 4) {
        utf16buf[out++] = 65533;
        i += c_len - 1;
        continue;
      }
      c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
      while (c_len > 1 && i < len) {
        c = c << 6 | buf[i++] & 63;
        c_len--;
      }
      if (c_len > 1) {
        utf16buf[out++] = 65533;
        continue;
      }
      if (c < 65536) {
        utf16buf[out++] = c;
      } else {
        c -= 65536;
        utf16buf[out++] = 55296 | c >> 10 & 1023;
        utf16buf[out++] = 56320 | c & 1023;
      }
    }
    return buf2binstring(utf16buf, out);
  };
  var utf8border = (buf, max) => {
    max = max || buf.length;
    if (max > buf.length) {
      max = buf.length;
    }
    let pos = max - 1;
    while (pos >= 0 && (buf[pos] & 192) === 128) {
      pos--;
    }
    if (pos < 0) {
      return max;
    }
    if (pos === 0) {
      return max;
    }
    return pos + _utf8len[buf[pos]] > max ? pos : max;
  };
  var strings = {
    string2buf,
    buf2string,
    utf8border
  };
  function ZStream() {
    this.input = null;
    this.next_in = 0;
    this.avail_in = 0;
    this.total_in = 0;
    this.output = null;
    this.next_out = 0;
    this.avail_out = 0;
    this.total_out = 0;
    this.msg = "";
    this.state = null;
    this.data_type = 2;
    this.adler = 0;
  }
  var zstream = ZStream;
  var toString$1 = Object.prototype.toString;
  var {
    Z_NO_FLUSH: Z_NO_FLUSH$1,
    Z_SYNC_FLUSH,
    Z_FULL_FLUSH,
    Z_FINISH: Z_FINISH$2,
    Z_OK: Z_OK$2,
    Z_STREAM_END: Z_STREAM_END$2,
    Z_DEFAULT_COMPRESSION,
    Z_DEFAULT_STRATEGY,
    Z_DEFLATED: Z_DEFLATED$1
  } = constants$2;
  function Deflate$1(options) {
    this.options = common.assign({
      level: Z_DEFAULT_COMPRESSION,
      method: Z_DEFLATED$1,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: Z_DEFAULT_STRATEGY
    }, options || {});
    let opt = this.options;
    if (opt.raw && opt.windowBits > 0) {
      opt.windowBits = -opt.windowBits;
    } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
      opt.windowBits += 16;
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new zstream();
    this.strm.avail_out = 0;
    let status = deflate_1$2.deflateInit2(
      this.strm,
      opt.level,
      opt.method,
      opt.windowBits,
      opt.memLevel,
      opt.strategy
    );
    if (status !== Z_OK$2) {
      throw new Error(messages[status]);
    }
    if (opt.header) {
      deflate_1$2.deflateSetHeader(this.strm, opt.header);
    }
    if (opt.dictionary) {
      let dict;
      if (typeof opt.dictionary === "string") {
        dict = strings.string2buf(opt.dictionary);
      } else if (toString$1.call(opt.dictionary) === "[object ArrayBuffer]") {
        dict = new Uint8Array(opt.dictionary);
      } else {
        dict = opt.dictionary;
      }
      status = deflate_1$2.deflateSetDictionary(this.strm, dict);
      if (status !== Z_OK$2) {
        throw new Error(messages[status]);
      }
      this._dict_set = true;
    }
  }
  Deflate$1.prototype.push = function(data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    let status, _flush_mode;
    if (this.ended) {
      return false;
    }
    if (flush_mode === ~~flush_mode)
      _flush_mode = flush_mode;
    else
      _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1;
    if (typeof data === "string") {
      strm.input = strings.string2buf(data);
    } else if (toString$1.call(data) === "[object ArrayBuffer]") {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    for (; ; ) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }
      status = deflate_1$2.deflate(strm, _flush_mode);
      if (status === Z_STREAM_END$2) {
        if (strm.next_out > 0) {
          this.onData(strm.output.subarray(0, strm.next_out));
        }
        status = deflate_1$2.deflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === Z_OK$2;
      }
      if (strm.avail_out === 0) {
        this.onData(strm.output);
        continue;
      }
      if (_flush_mode > 0 && strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }
      if (strm.avail_in === 0)
        break;
    }
    return true;
  };
  Deflate$1.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
  };
  Deflate$1.prototype.onEnd = function(status) {
    if (status === Z_OK$2) {
      this.result = common.flattenChunks(this.chunks);
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };
  function deflate$1(input, options) {
    const deflator = new Deflate$1(options);
    deflator.push(input, true);
    if (deflator.err) {
      throw deflator.msg || messages[deflator.err];
    }
    return deflator.result;
  }
  function deflateRaw$1(input, options) {
    options = options || {};
    options.raw = true;
    return deflate$1(input, options);
  }
  function gzip$1(input, options) {
    options = options || {};
    options.gzip = true;
    return deflate$1(input, options);
  }
  var Deflate_1$1 = Deflate$1;
  var deflate_2 = deflate$1;
  var deflateRaw_1$1 = deflateRaw$1;
  var gzip_1$1 = gzip$1;
  var constants$1 = constants$2;
  var deflate_1$1 = {
    Deflate: Deflate_1$1,
    deflate: deflate_2,
    deflateRaw: deflateRaw_1$1,
    gzip: gzip_1$1,
    constants: constants$1
  };
  var BAD$1 = 16209;
  var TYPE$1 = 16191;
  var inffast = function inflate_fast(strm, start) {
    let _in;
    let last;
    let _out;
    let beg;
    let end;
    let dmax;
    let wsize;
    let whave;
    let wnext;
    let s_window;
    let hold;
    let bits;
    let lcode;
    let dcode;
    let lmask;
    let dmask;
    let here;
    let op;
    let len;
    let dist;
    let from;
    let from_source;
    let input, output2;
    const state = strm.state;
    _in = strm.next_in;
    input = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output2 = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
    dmax = state.dmax;
    wsize = state.wsize;
    whave = state.whave;
    wnext = state.wnext;
    s_window = state.window;
    hold = state.hold;
    bits = state.bits;
    lcode = state.lencode;
    dcode = state.distcode;
    lmask = (1 << state.lenbits) - 1;
    dmask = (1 << state.distbits) - 1;
    top:
      do {
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = lcode[hold & lmask];
        dolen:
          for (; ; ) {
            op = here >>> 24;
            hold >>>= op;
            bits -= op;
            op = here >>> 16 & 255;
            if (op === 0) {
              output2[_out++] = here & 65535;
            } else if (op & 16) {
              len = here & 65535;
              op &= 15;
              if (op) {
                if (bits < op) {
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                len += hold & (1 << op) - 1;
                hold >>>= op;
                bits -= op;
              }
              if (bits < 15) {
                hold += input[_in++] << bits;
                bits += 8;
                hold += input[_in++] << bits;
                bits += 8;
              }
              here = dcode[hold & dmask];
              dodist:
                for (; ; ) {
                  op = here >>> 24;
                  hold >>>= op;
                  bits -= op;
                  op = here >>> 16 & 255;
                  if (op & 16) {
                    dist = here & 65535;
                    op &= 15;
                    if (bits < op) {
                      hold += input[_in++] << bits;
                      bits += 8;
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                      }
                    }
                    dist += hold & (1 << op) - 1;
                    if (dist > dmax) {
                      strm.msg = "invalid distance too far back";
                      state.mode = BAD$1;
                      break top;
                    }
                    hold >>>= op;
                    bits -= op;
                    op = _out - beg;
                    if (dist > op) {
                      op = dist - op;
                      if (op > whave) {
                        if (state.sane) {
                          strm.msg = "invalid distance too far back";
                          state.mode = BAD$1;
                          break top;
                        }
                      }
                      from = 0;
                      from_source = s_window;
                      if (wnext === 0) {
                        from += wsize - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output2[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output2;
                        }
                      } else if (wnext < op) {
                        from += wsize + wnext - op;
                        op -= wnext;
                        if (op < len) {
                          len -= op;
                          do {
                            output2[_out++] = s_window[from++];
                          } while (--op);
                          from = 0;
                          if (wnext < len) {
                            op = wnext;
                            len -= op;
                            do {
                              output2[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output2;
                          }
                        }
                      } else {
                        from += wnext - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output2[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output2;
                        }
                      }
                      while (len > 2) {
                        output2[_out++] = from_source[from++];
                        output2[_out++] = from_source[from++];
                        output2[_out++] = from_source[from++];
                        len -= 3;
                      }
                      if (len) {
                        output2[_out++] = from_source[from++];
                        if (len > 1) {
                          output2[_out++] = from_source[from++];
                        }
                      }
                    } else {
                      from = _out - dist;
                      do {
                        output2[_out++] = output2[from++];
                        output2[_out++] = output2[from++];
                        output2[_out++] = output2[from++];
                        len -= 3;
                      } while (len > 2);
                      if (len) {
                        output2[_out++] = output2[from++];
                        if (len > 1) {
                          output2[_out++] = output2[from++];
                        }
                      }
                    }
                  } else if ((op & 64) === 0) {
                    here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                    continue dodist;
                  } else {
                    strm.msg = "invalid distance code";
                    state.mode = BAD$1;
                    break top;
                  }
                  break;
                }
            } else if ((op & 64) === 0) {
              here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
              continue dolen;
            } else if (op & 32) {
              state.mode = TYPE$1;
              break top;
            } else {
              strm.msg = "invalid literal/length code";
              state.mode = BAD$1;
              break top;
            }
            break;
          }
      } while (_in < last && _out < end);
    len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;
    strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
    strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
    state.hold = hold;
    state.bits = bits;
    return;
  };
  var MAXBITS = 15;
  var ENOUGH_LENS$1 = 852;
  var ENOUGH_DISTS$1 = 592;
  var CODES$1 = 0;
  var LENS$1 = 1;
  var DISTS$1 = 2;
  var lbase = new Uint16Array([
    /* Length codes 257..285 base */
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
  ]);
  var lext = new Uint8Array([
    /* Length codes 257..285 extra */
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    16,
    72,
    78
  ]);
  var dbase = new Uint16Array([
    /* Distance codes 0..29 base */
    1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577,
    0,
    0
  ]);
  var dext = new Uint8Array([
    /* Distance codes 0..29 extra */
    16,
    16,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    22,
    23,
    23,
    24,
    24,
    25,
    25,
    26,
    26,
    27,
    27,
    28,
    28,
    29,
    29,
    64,
    64
  ]);
  var inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) => {
    const bits = opts.bits;
    let len = 0;
    let sym = 0;
    let min = 0, max = 0;
    let root = 0;
    let curr = 0;
    let drop = 0;
    let left = 0;
    let used = 0;
    let huff = 0;
    let incr;
    let fill;
    let low;
    let mask;
    let next;
    let base = null;
    let match;
    const count = new Uint16Array(MAXBITS + 1);
    const offs = new Uint16Array(MAXBITS + 1);
    let extra = null;
    let here_bits, here_op, here_val;
    for (len = 0; len <= MAXBITS; len++) {
      count[len] = 0;
    }
    for (sym = 0; sym < codes; sym++) {
      count[lens[lens_index + sym]]++;
    }
    root = bits;
    for (max = MAXBITS; max >= 1; max--) {
      if (count[max] !== 0) {
        break;
      }
    }
    if (root > max) {
      root = max;
    }
    if (max === 0) {
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      opts.bits = 1;
      return 0;
    }
    for (min = 1; min < max; min++) {
      if (count[min] !== 0) {
        break;
      }
    }
    if (root < min) {
      root = min;
    }
    left = 1;
    for (len = 1; len <= MAXBITS; len++) {
      left <<= 1;
      left -= count[len];
      if (left < 0) {
        return -1;
      }
    }
    if (left > 0 && (type === CODES$1 || max !== 1)) {
      return -1;
    }
    offs[1] = 0;
    for (len = 1; len < MAXBITS; len++) {
      offs[len + 1] = offs[len] + count[len];
    }
    for (sym = 0; sym < codes; sym++) {
      if (lens[lens_index + sym] !== 0) {
        work[offs[lens[lens_index + sym]]++] = sym;
      }
    }
    if (type === CODES$1) {
      base = extra = work;
      match = 20;
    } else if (type === LENS$1) {
      base = lbase;
      extra = lext;
      match = 257;
    } else {
      base = dbase;
      extra = dext;
      match = 0;
    }
    huff = 0;
    sym = 0;
    len = min;
    next = table_index;
    curr = root;
    drop = 0;
    low = -1;
    used = 1 << root;
    mask = used - 1;
    if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
      return 1;
    }
    for (; ; ) {
      here_bits = len - drop;
      if (work[sym] + 1 < match) {
        here_op = 0;
        here_val = work[sym];
      } else if (work[sym] >= match) {
        here_op = extra[work[sym] - match];
        here_val = base[work[sym] - match];
      } else {
        here_op = 32 + 64;
        here_val = 0;
      }
      incr = 1 << len - drop;
      fill = 1 << curr;
      min = fill;
      do {
        fill -= incr;
        table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
      } while (fill !== 0);
      incr = 1 << len - 1;
      while (huff & incr) {
        incr >>= 1;
      }
      if (incr !== 0) {
        huff &= incr - 1;
        huff += incr;
      } else {
        huff = 0;
      }
      sym++;
      if (--count[len] === 0) {
        if (len === max) {
          break;
        }
        len = lens[lens_index + work[sym]];
      }
      if (len > root && (huff & mask) !== low) {
        if (drop === 0) {
          drop = root;
        }
        next += min;
        curr = len - drop;
        left = 1 << curr;
        while (curr + drop < max) {
          left -= count[curr + drop];
          if (left <= 0) {
            break;
          }
          curr++;
          left <<= 1;
        }
        used += 1 << curr;
        if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
          return 1;
        }
        low = huff & mask;
        table[low] = root << 24 | curr << 16 | next - table_index | 0;
      }
    }
    if (huff !== 0) {
      table[next + huff] = len - drop << 24 | 64 << 16 | 0;
    }
    opts.bits = root;
    return 0;
  };
  var inftrees = inflate_table;
  var CODES = 0;
  var LENS = 1;
  var DISTS = 2;
  var {
    Z_FINISH: Z_FINISH$1,
    Z_BLOCK,
    Z_TREES,
    Z_OK: Z_OK$1,
    Z_STREAM_END: Z_STREAM_END$1,
    Z_NEED_DICT: Z_NEED_DICT$1,
    Z_STREAM_ERROR: Z_STREAM_ERROR$1,
    Z_DATA_ERROR: Z_DATA_ERROR$1,
    Z_MEM_ERROR: Z_MEM_ERROR$1,
    Z_BUF_ERROR,
    Z_DEFLATED
  } = constants$2;
  var HEAD = 16180;
  var FLAGS = 16181;
  var TIME = 16182;
  var OS = 16183;
  var EXLEN = 16184;
  var EXTRA = 16185;
  var NAME = 16186;
  var COMMENT = 16187;
  var HCRC = 16188;
  var DICTID = 16189;
  var DICT = 16190;
  var TYPE = 16191;
  var TYPEDO = 16192;
  var STORED = 16193;
  var COPY_ = 16194;
  var COPY = 16195;
  var TABLE = 16196;
  var LENLENS = 16197;
  var CODELENS = 16198;
  var LEN_ = 16199;
  var LEN = 16200;
  var LENEXT = 16201;
  var DIST = 16202;
  var DISTEXT = 16203;
  var MATCH = 16204;
  var LIT = 16205;
  var CHECK = 16206;
  var LENGTH = 16207;
  var DONE = 16208;
  var BAD = 16209;
  var MEM = 16210;
  var SYNC = 16211;
  var ENOUGH_LENS = 852;
  var ENOUGH_DISTS = 592;
  var MAX_WBITS = 15;
  var DEF_WBITS = MAX_WBITS;
  var zswap32 = (q) => {
    return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
  };
  function InflateState() {
    this.strm = null;
    this.mode = 0;
    this.last = false;
    this.wrap = 0;
    this.havedict = false;
    this.flags = 0;
    this.dmax = 0;
    this.check = 0;
    this.total = 0;
    this.head = null;
    this.wbits = 0;
    this.wsize = 0;
    this.whave = 0;
    this.wnext = 0;
    this.window = null;
    this.hold = 0;
    this.bits = 0;
    this.length = 0;
    this.offset = 0;
    this.extra = 0;
    this.lencode = null;
    this.distcode = null;
    this.lenbits = 0;
    this.distbits = 0;
    this.ncode = 0;
    this.nlen = 0;
    this.ndist = 0;
    this.have = 0;
    this.next = null;
    this.lens = new Uint16Array(320);
    this.work = new Uint16Array(288);
    this.lendyn = null;
    this.distdyn = null;
    this.sane = 0;
    this.back = 0;
    this.was = 0;
  }
  var inflateStateCheck = (strm) => {
    if (!strm) {
      return 1;
    }
    const state = strm.state;
    if (!state || state.strm !== strm || state.mode < HEAD || state.mode > SYNC) {
      return 1;
    }
    return 0;
  };
  var inflateResetKeep = (strm) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    strm.total_in = strm.total_out = state.total = 0;
    strm.msg = "";
    if (state.wrap) {
      strm.adler = state.wrap & 1;
    }
    state.mode = HEAD;
    state.last = 0;
    state.havedict = 0;
    state.flags = -1;
    state.dmax = 32768;
    state.head = null;
    state.hold = 0;
    state.bits = 0;
    state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
    state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);
    state.sane = 1;
    state.back = -1;
    return Z_OK$1;
  };
  var inflateReset = (strm) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    state.wsize = 0;
    state.whave = 0;
    state.wnext = 0;
    return inflateResetKeep(strm);
  };
  var inflateReset2 = (strm, windowBits) => {
    let wrap;
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else {
      wrap = (windowBits >> 4) + 5;
      if (windowBits < 48) {
        windowBits &= 15;
      }
    }
    if (windowBits && (windowBits < 8 || windowBits > 15)) {
      return Z_STREAM_ERROR$1;
    }
    if (state.window !== null && state.wbits !== windowBits) {
      state.window = null;
    }
    state.wrap = wrap;
    state.wbits = windowBits;
    return inflateReset(strm);
  };
  var inflateInit2 = (strm, windowBits) => {
    if (!strm) {
      return Z_STREAM_ERROR$1;
    }
    const state = new InflateState();
    strm.state = state;
    state.strm = strm;
    state.window = null;
    state.mode = HEAD;
    const ret = inflateReset2(strm, windowBits);
    if (ret !== Z_OK$1) {
      strm.state = null;
    }
    return ret;
  };
  var inflateInit = (strm) => {
    return inflateInit2(strm, DEF_WBITS);
  };
  var virgin = true;
  var lenfix;
  var distfix;
  var fixedtables = (state) => {
    if (virgin) {
      lenfix = new Int32Array(512);
      distfix = new Int32Array(32);
      let sym = 0;
      while (sym < 144) {
        state.lens[sym++] = 8;
      }
      while (sym < 256) {
        state.lens[sym++] = 9;
      }
      while (sym < 280) {
        state.lens[sym++] = 7;
      }
      while (sym < 288) {
        state.lens[sym++] = 8;
      }
      inftrees(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
      sym = 0;
      while (sym < 32) {
        state.lens[sym++] = 5;
      }
      inftrees(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
      virgin = false;
    }
    state.lencode = lenfix;
    state.lenbits = 9;
    state.distcode = distfix;
    state.distbits = 5;
  };
  var updatewindow = (strm, src, end, copy) => {
    let dist;
    const state = strm.state;
    if (state.window === null) {
      state.wsize = 1 << state.wbits;
      state.wnext = 0;
      state.whave = 0;
      state.window = new Uint8Array(state.wsize);
    }
    if (copy >= state.wsize) {
      state.window.set(src.subarray(end - state.wsize, end), 0);
      state.wnext = 0;
      state.whave = state.wsize;
    } else {
      dist = state.wsize - state.wnext;
      if (dist > copy) {
        dist = copy;
      }
      state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
      copy -= dist;
      if (copy) {
        state.window.set(src.subarray(end - copy, end), 0);
        state.wnext = copy;
        state.whave = state.wsize;
      } else {
        state.wnext += dist;
        if (state.wnext === state.wsize) {
          state.wnext = 0;
        }
        if (state.whave < state.wsize) {
          state.whave += dist;
        }
      }
    }
    return 0;
  };
  var inflate$2 = (strm, flush) => {
    let state;
    let input, output2;
    let next;
    let put;
    let have, left;
    let hold;
    let bits;
    let _in, _out;
    let copy;
    let from;
    let from_source;
    let here = 0;
    let here_bits, here_op, here_val;
    let last_bits, last_op, last_val;
    let len;
    let ret;
    const hbuf = new Uint8Array(4);
    let opts;
    let n;
    const order = (
      /* permutation of code lengths */
      new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
    );
    if (inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) {
      return Z_STREAM_ERROR$1;
    }
    state = strm.state;
    if (state.mode === TYPE) {
      state.mode = TYPEDO;
    }
    put = strm.next_out;
    output2 = strm.output;
    left = strm.avail_out;
    next = strm.next_in;
    input = strm.input;
    have = strm.avail_in;
    hold = state.hold;
    bits = state.bits;
    _in = have;
    _out = left;
    ret = Z_OK$1;
    inf_leave:
      for (; ; ) {
        switch (state.mode) {
          case HEAD:
            if (state.wrap === 0) {
              state.mode = TYPEDO;
              break;
            }
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.wrap & 2 && hold === 35615) {
              if (state.wbits === 0) {
                state.wbits = 15;
              }
              state.check = 0;
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32_1(state.check, hbuf, 2, 0);
              hold = 0;
              bits = 0;
              state.mode = FLAGS;
              break;
            }
            if (state.head) {
              state.head.done = false;
            }
            if (!(state.wrap & 1) || /* check if zlib header allowed */
            (((hold & 255) << 8) + (hold >> 8)) % 31) {
              strm.msg = "incorrect header check";
              state.mode = BAD;
              break;
            }
            if ((hold & 15) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state.mode = BAD;
              break;
            }
            hold >>>= 4;
            bits -= 4;
            len = (hold & 15) + 8;
            if (state.wbits === 0) {
              state.wbits = len;
            }
            if (len > 15 || len > state.wbits) {
              strm.msg = "invalid window size";
              state.mode = BAD;
              break;
            }
            state.dmax = 1 << state.wbits;
            state.flags = 0;
            strm.adler = state.check = 1;
            state.mode = hold & 512 ? DICTID : TYPE;
            hold = 0;
            bits = 0;
            break;
          case FLAGS:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.flags = hold;
            if ((state.flags & 255) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state.mode = BAD;
              break;
            }
            if (state.flags & 57344) {
              strm.msg = "unknown header flags set";
              state.mode = BAD;
              break;
            }
            if (state.head) {
              state.head.text = hold >> 8 & 1;
            }
            if (state.flags & 512 && state.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32_1(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = TIME;
          case TIME:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.head) {
              state.head.time = hold;
            }
            if (state.flags & 512 && state.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              hbuf[2] = hold >>> 16 & 255;
              hbuf[3] = hold >>> 24 & 255;
              state.check = crc32_1(state.check, hbuf, 4, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = OS;
          case OS:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.head) {
              state.head.xflags = hold & 255;
              state.head.os = hold >> 8;
            }
            if (state.flags & 512 && state.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32_1(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = EXLEN;
          case EXLEN:
            if (state.flags & 1024) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.length = hold;
              if (state.head) {
                state.head.extra_len = hold;
              }
              if (state.flags & 512 && state.wrap & 4) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32_1(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
            } else if (state.head) {
              state.head.extra = null;
            }
            state.mode = EXTRA;
          case EXTRA:
            if (state.flags & 1024) {
              copy = state.length;
              if (copy > have) {
                copy = have;
              }
              if (copy) {
                if (state.head) {
                  len = state.head.extra_len - state.length;
                  if (!state.head.extra) {
                    state.head.extra = new Uint8Array(state.head.extra_len);
                  }
                  state.head.extra.set(
                    input.subarray(
                      next,
                      // extra field is limited to 65536 bytes
                      // - no need for additional size check
                      next + copy
                    ),
                    /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                    len
                  );
                }
                if (state.flags & 512 && state.wrap & 4) {
                  state.check = crc32_1(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                state.length -= copy;
              }
              if (state.length) {
                break inf_leave;
              }
            }
            state.length = 0;
            state.mode = NAME;
          case NAME:
            if (state.flags & 2048) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state.head && len && state.length < 65536) {
                  state.head.name += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state.flags & 512 && state.wrap & 4) {
                state.check = crc32_1(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state.head) {
              state.head.name = null;
            }
            state.length = 0;
            state.mode = COMMENT;
          case COMMENT:
            if (state.flags & 4096) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state.head && len && state.length < 65536) {
                  state.head.comment += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state.flags & 512 && state.wrap & 4) {
                state.check = crc32_1(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state.head) {
              state.head.comment = null;
            }
            state.mode = HCRC;
          case HCRC:
            if (state.flags & 512) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.wrap & 4 && hold !== (state.check & 65535)) {
                strm.msg = "header crc mismatch";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            if (state.head) {
              state.head.hcrc = state.flags >> 9 & 1;
              state.head.done = true;
            }
            strm.adler = state.check = 0;
            state.mode = TYPE;
            break;
          case DICTID:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            strm.adler = state.check = zswap32(hold);
            hold = 0;
            bits = 0;
            state.mode = DICT;
          case DICT:
            if (state.havedict === 0) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state.hold = hold;
              state.bits = bits;
              return Z_NEED_DICT$1;
            }
            strm.adler = state.check = 1;
            state.mode = TYPE;
          case TYPE:
            if (flush === Z_BLOCK || flush === Z_TREES) {
              break inf_leave;
            }
          case TYPEDO:
            if (state.last) {
              hold >>>= bits & 7;
              bits -= bits & 7;
              state.mode = CHECK;
              break;
            }
            while (bits < 3) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.last = hold & 1;
            hold >>>= 1;
            bits -= 1;
            switch (hold & 3) {
              case 0:
                state.mode = STORED;
                break;
              case 1:
                fixedtables(state);
                state.mode = LEN_;
                if (flush === Z_TREES) {
                  hold >>>= 2;
                  bits -= 2;
                  break inf_leave;
                }
                break;
              case 2:
                state.mode = TABLE;
                break;
              case 3:
                strm.msg = "invalid block type";
                state.mode = BAD;
            }
            hold >>>= 2;
            bits -= 2;
            break;
          case STORED:
            hold >>>= bits & 7;
            bits -= bits & 7;
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
              strm.msg = "invalid stored block lengths";
              state.mode = BAD;
              break;
            }
            state.length = hold & 65535;
            hold = 0;
            bits = 0;
            state.mode = COPY_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          case COPY_:
            state.mode = COPY;
          case COPY:
            copy = state.length;
            if (copy) {
              if (copy > have) {
                copy = have;
              }
              if (copy > left) {
                copy = left;
              }
              if (copy === 0) {
                break inf_leave;
              }
              output2.set(input.subarray(next, next + copy), put);
              have -= copy;
              next += copy;
              left -= copy;
              put += copy;
              state.length -= copy;
              break;
            }
            state.mode = TYPE;
            break;
          case TABLE:
            while (bits < 14) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.nlen = (hold & 31) + 257;
            hold >>>= 5;
            bits -= 5;
            state.ndist = (hold & 31) + 1;
            hold >>>= 5;
            bits -= 5;
            state.ncode = (hold & 15) + 4;
            hold >>>= 4;
            bits -= 4;
            if (state.nlen > 286 || state.ndist > 30) {
              strm.msg = "too many length or distance symbols";
              state.mode = BAD;
              break;
            }
            state.have = 0;
            state.mode = LENLENS;
          case LENLENS:
            while (state.have < state.ncode) {
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.lens[order[state.have++]] = hold & 7;
              hold >>>= 3;
              bits -= 3;
            }
            while (state.have < 19) {
              state.lens[order[state.have++]] = 0;
            }
            state.lencode = state.lendyn;
            state.lenbits = 7;
            opts = { bits: state.lenbits };
            ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid code lengths set";
              state.mode = BAD;
              break;
            }
            state.have = 0;
            state.mode = CODELENS;
          case CODELENS:
            while (state.have < state.nlen + state.ndist) {
              for (; ; ) {
                here = state.lencode[hold & (1 << state.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (here_val < 16) {
                hold >>>= here_bits;
                bits -= here_bits;
                state.lens[state.have++] = here_val;
              } else {
                if (here_val === 16) {
                  n = here_bits + 2;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  if (state.have === 0) {
                    strm.msg = "invalid bit length repeat";
                    state.mode = BAD;
                    break;
                  }
                  len = state.lens[state.have - 1];
                  copy = 3 + (hold & 3);
                  hold >>>= 2;
                  bits -= 2;
                } else if (here_val === 17) {
                  n = here_bits + 3;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 3 + (hold & 7);
                  hold >>>= 3;
                  bits -= 3;
                } else {
                  n = here_bits + 7;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 11 + (hold & 127);
                  hold >>>= 7;
                  bits -= 7;
                }
                if (state.have + copy > state.nlen + state.ndist) {
                  strm.msg = "invalid bit length repeat";
                  state.mode = BAD;
                  break;
                }
                while (copy--) {
                  state.lens[state.have++] = len;
                }
              }
            }
            if (state.mode === BAD) {
              break;
            }
            if (state.lens[256] === 0) {
              strm.msg = "invalid code -- missing end-of-block";
              state.mode = BAD;
              break;
            }
            state.lenbits = 9;
            opts = { bits: state.lenbits };
            ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid literal/lengths set";
              state.mode = BAD;
              break;
            }
            state.distbits = 6;
            state.distcode = state.distdyn;
            opts = { bits: state.distbits };
            ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
            state.distbits = opts.bits;
            if (ret) {
              strm.msg = "invalid distances set";
              state.mode = BAD;
              break;
            }
            state.mode = LEN_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          case LEN_:
            state.mode = LEN;
          case LEN:
            if (have >= 6 && left >= 258) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state.hold = hold;
              state.bits = bits;
              inffast(strm, _out);
              put = strm.next_out;
              output2 = strm.output;
              left = strm.avail_out;
              next = strm.next_in;
              input = strm.input;
              have = strm.avail_in;
              hold = state.hold;
              bits = state.bits;
              if (state.mode === TYPE) {
                state.back = -1;
              }
              break;
            }
            state.back = 0;
            for (; ; ) {
              here = state.lencode[hold & (1 << state.lenbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (here_op && (here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (; ; ) {
                here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state.back += here_bits;
            state.length = here_val;
            if (here_op === 0) {
              state.mode = LIT;
              break;
            }
            if (here_op & 32) {
              state.back = -1;
              state.mode = TYPE;
              break;
            }
            if (here_op & 64) {
              strm.msg = "invalid literal/length code";
              state.mode = BAD;
              break;
            }
            state.extra = here_op & 15;
            state.mode = LENEXT;
          case LENEXT:
            if (state.extra) {
              n = state.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.length += hold & (1 << state.extra) - 1;
              hold >>>= state.extra;
              bits -= state.extra;
              state.back += state.extra;
            }
            state.was = state.length;
            state.mode = DIST;
          case DIST:
            for (; ; ) {
              here = state.distcode[hold & (1 << state.distbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (; ; ) {
                here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state.back += here_bits;
            if (here_op & 64) {
              strm.msg = "invalid distance code";
              state.mode = BAD;
              break;
            }
            state.offset = here_val;
            state.extra = here_op & 15;
            state.mode = DISTEXT;
          case DISTEXT:
            if (state.extra) {
              n = state.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.offset += hold & (1 << state.extra) - 1;
              hold >>>= state.extra;
              bits -= state.extra;
              state.back += state.extra;
            }
            if (state.offset > state.dmax) {
              strm.msg = "invalid distance too far back";
              state.mode = BAD;
              break;
            }
            state.mode = MATCH;
          case MATCH:
            if (left === 0) {
              break inf_leave;
            }
            copy = _out - left;
            if (state.offset > copy) {
              copy = state.offset - copy;
              if (copy > state.whave) {
                if (state.sane) {
                  strm.msg = "invalid distance too far back";
                  state.mode = BAD;
                  break;
                }
              }
              if (copy > state.wnext) {
                copy -= state.wnext;
                from = state.wsize - copy;
              } else {
                from = state.wnext - copy;
              }
              if (copy > state.length) {
                copy = state.length;
              }
              from_source = state.window;
            } else {
              from_source = output2;
              from = put - state.offset;
              copy = state.length;
            }
            if (copy > left) {
              copy = left;
            }
            left -= copy;
            state.length -= copy;
            do {
              output2[put++] = from_source[from++];
            } while (--copy);
            if (state.length === 0) {
              state.mode = LEN;
            }
            break;
          case LIT:
            if (left === 0) {
              break inf_leave;
            }
            output2[put++] = state.length;
            left--;
            state.mode = LEN;
            break;
          case CHECK:
            if (state.wrap) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold |= input[next++] << bits;
                bits += 8;
              }
              _out -= left;
              strm.total_out += _out;
              state.total += _out;
              if (state.wrap & 4 && _out) {
                strm.adler = state.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
                state.flags ? crc32_1(state.check, output2, _out, put - _out) : adler32_1(state.check, output2, _out, put - _out);
              }
              _out = left;
              if (state.wrap & 4 && (state.flags ? hold : zswap32(hold)) !== state.check) {
                strm.msg = "incorrect data check";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state.mode = LENGTH;
          case LENGTH:
            if (state.wrap && state.flags) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.wrap & 4 && hold !== (state.total & 4294967295)) {
                strm.msg = "incorrect length check";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state.mode = DONE;
          case DONE:
            ret = Z_STREAM_END$1;
            break inf_leave;
          case BAD:
            ret = Z_DATA_ERROR$1;
            break inf_leave;
          case MEM:
            return Z_MEM_ERROR$1;
          case SYNC:
          default:
            return Z_STREAM_ERROR$1;
        }
      }
    strm.next_out = put;
    strm.avail_out = left;
    strm.next_in = next;
    strm.avail_in = have;
    state.hold = hold;
    state.bits = bits;
    if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH$1)) {
      if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out))
        ;
    }
    _in -= strm.avail_in;
    _out -= strm.avail_out;
    strm.total_in += _in;
    strm.total_out += _out;
    state.total += _out;
    if (state.wrap & 4 && _out) {
      strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
      state.flags ? crc32_1(state.check, output2, _out, strm.next_out - _out) : adler32_1(state.check, output2, _out, strm.next_out - _out);
    }
    strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
    if ((_in === 0 && _out === 0 || flush === Z_FINISH$1) && ret === Z_OK$1) {
      ret = Z_BUF_ERROR;
    }
    return ret;
  };
  var inflateEnd = (strm) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    let state = strm.state;
    if (state.window) {
      state.window = null;
    }
    strm.state = null;
    return Z_OK$1;
  };
  var inflateGetHeader = (strm, head) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    if ((state.wrap & 2) === 0) {
      return Z_STREAM_ERROR$1;
    }
    state.head = head;
    head.done = false;
    return Z_OK$1;
  };
  var inflateSetDictionary = (strm, dictionary) => {
    const dictLength = dictionary.length;
    let state;
    let dictid;
    let ret;
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    state = strm.state;
    if (state.wrap !== 0 && state.mode !== DICT) {
      return Z_STREAM_ERROR$1;
    }
    if (state.mode === DICT) {
      dictid = 1;
      dictid = adler32_1(dictid, dictionary, dictLength, 0);
      if (dictid !== state.check) {
        return Z_DATA_ERROR$1;
      }
    }
    ret = updatewindow(strm, dictionary, dictLength, dictLength);
    if (ret) {
      state.mode = MEM;
      return Z_MEM_ERROR$1;
    }
    state.havedict = 1;
    return Z_OK$1;
  };
  var inflateReset_1 = inflateReset;
  var inflateReset2_1 = inflateReset2;
  var inflateResetKeep_1 = inflateResetKeep;
  var inflateInit_1 = inflateInit;
  var inflateInit2_1 = inflateInit2;
  var inflate_2$1 = inflate$2;
  var inflateEnd_1 = inflateEnd;
  var inflateGetHeader_1 = inflateGetHeader;
  var inflateSetDictionary_1 = inflateSetDictionary;
  var inflateInfo = "pako inflate (from Nodeca project)";
  var inflate_1$2 = {
    inflateReset: inflateReset_1,
    inflateReset2: inflateReset2_1,
    inflateResetKeep: inflateResetKeep_1,
    inflateInit: inflateInit_1,
    inflateInit2: inflateInit2_1,
    inflate: inflate_2$1,
    inflateEnd: inflateEnd_1,
    inflateGetHeader: inflateGetHeader_1,
    inflateSetDictionary: inflateSetDictionary_1,
    inflateInfo
  };
  function GZheader() {
    this.text = 0;
    this.time = 0;
    this.xflags = 0;
    this.os = 0;
    this.extra = null;
    this.extra_len = 0;
    this.name = "";
    this.comment = "";
    this.hcrc = 0;
    this.done = false;
  }
  var gzheader = GZheader;
  var toString = Object.prototype.toString;
  var {
    Z_NO_FLUSH,
    Z_FINISH,
    Z_OK,
    Z_STREAM_END,
    Z_NEED_DICT,
    Z_STREAM_ERROR,
    Z_DATA_ERROR,
    Z_MEM_ERROR
  } = constants$2;
  function Inflate$1(options) {
    this.options = common.assign({
      chunkSize: 1024 * 64,
      windowBits: 15,
      to: ""
    }, options || {});
    const opt = this.options;
    if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
      opt.windowBits = -opt.windowBits;
      if (opt.windowBits === 0) {
        opt.windowBits = -15;
      }
    }
    if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
      opt.windowBits += 32;
    }
    if (opt.windowBits > 15 && opt.windowBits < 48) {
      if ((opt.windowBits & 15) === 0) {
        opt.windowBits |= 15;
      }
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new zstream();
    this.strm.avail_out = 0;
    let status = inflate_1$2.inflateInit2(
      this.strm,
      opt.windowBits
    );
    if (status !== Z_OK) {
      throw new Error(messages[status]);
    }
    this.header = new gzheader();
    inflate_1$2.inflateGetHeader(this.strm, this.header);
    if (opt.dictionary) {
      if (typeof opt.dictionary === "string") {
        opt.dictionary = strings.string2buf(opt.dictionary);
      } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
        opt.dictionary = new Uint8Array(opt.dictionary);
      }
      if (opt.raw) {
        status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
        if (status !== Z_OK) {
          throw new Error(messages[status]);
        }
      }
    }
  }
  Inflate$1.prototype.push = function(data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    const dictionary = this.options.dictionary;
    let status, _flush_mode, last_avail_out;
    if (this.ended)
      return false;
    if (flush_mode === ~~flush_mode)
      _flush_mode = flush_mode;
    else
      _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
    if (toString.call(data) === "[object ArrayBuffer]") {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    for (; ; ) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      status = inflate_1$2.inflate(strm, _flush_mode);
      if (status === Z_NEED_DICT && dictionary) {
        status = inflate_1$2.inflateSetDictionary(strm, dictionary);
        if (status === Z_OK) {
          status = inflate_1$2.inflate(strm, _flush_mode);
        } else if (status === Z_DATA_ERROR) {
          status = Z_NEED_DICT;
        }
      }
      while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap > 0 && data[strm.next_in] !== 0) {
        inflate_1$2.inflateReset(strm);
        status = inflate_1$2.inflate(strm, _flush_mode);
      }
      switch (status) {
        case Z_STREAM_ERROR:
        case Z_DATA_ERROR:
        case Z_NEED_DICT:
        case Z_MEM_ERROR:
          this.onEnd(status);
          this.ended = true;
          return false;
      }
      last_avail_out = strm.avail_out;
      if (strm.next_out) {
        if (strm.avail_out === 0 || status === Z_STREAM_END) {
          if (this.options.to === "string") {
            let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
            let tail = strm.next_out - next_out_utf8;
            let utf8str = strings.buf2string(strm.output, next_out_utf8);
            strm.next_out = tail;
            strm.avail_out = chunkSize - tail;
            if (tail)
              strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
            this.onData(utf8str);
          } else {
            this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
          }
        }
      }
      if (status === Z_OK && last_avail_out === 0)
        continue;
      if (status === Z_STREAM_END) {
        status = inflate_1$2.inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return true;
      }
      if (strm.avail_in === 0)
        break;
    }
    return true;
  };
  Inflate$1.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
  };
  Inflate$1.prototype.onEnd = function(status) {
    if (status === Z_OK) {
      if (this.options.to === "string") {
        this.result = this.chunks.join("");
      } else {
        this.result = common.flattenChunks(this.chunks);
      }
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };
  function inflate$1(input, options) {
    const inflator = new Inflate$1(options);
    inflator.push(input);
    if (inflator.err)
      throw inflator.msg || messages[inflator.err];
    return inflator.result;
  }
  function inflateRaw$1(input, options) {
    options = options || {};
    options.raw = true;
    return inflate$1(input, options);
  }
  var Inflate_1$1 = Inflate$1;
  var inflate_2 = inflate$1;
  var inflateRaw_1$1 = inflateRaw$1;
  var ungzip$1 = inflate$1;
  var constants = constants$2;
  var inflate_1$1 = {
    Inflate: Inflate_1$1,
    inflate: inflate_2,
    inflateRaw: inflateRaw_1$1,
    ungzip: ungzip$1,
    constants
  };
  var { Deflate, deflate, deflateRaw, gzip } = deflate_1$1;
  var { Inflate, inflate, inflateRaw, ungzip } = inflate_1$1;
  var gzip_1 = gzip;
  var ungzip_1 = ungzip;

  // src/utils/stark.ts
  function compressProgram(jsonProgram) {
    const stringified = typeof jsonProgram === "string" ? jsonProgram : stringify2(jsonProgram);
    const compressedProgram = gzip_1(stringified);
    return btoaUniversal(compressedProgram);
  }
  function decompressProgram(base64) {
    if (Array.isArray(base64))
      return base64;
    const decompressed = arrayBufferToString(ungzip_1(atobUniversal(base64)));
    return parse2(decompressed);
  }
  function randomAddress() {
    const randomKeyPair = utils.randomPrivateKey();
    return getStarkKey(randomKeyPair);
  }
  function makeAddress(input) {
    return addHexPrefix(input).toLowerCase();
  }
  function formatSignature(sig) {
    if (!sig)
      throw Error("formatSignature: provided signature is undefined");
    if (Array.isArray(sig)) {
      return sig.map((it) => toHex(it));
    }
    try {
      const { r, s } = sig;
      return [toHex(r), toHex(s)];
    } catch (e) {
      throw new Error("Signature need to be weierstrass.SignatureType or an array for custom");
    }
  }
  function signatureToDecimalArray(sig) {
    return bigNumberishArrayToDecimalStringArray(formatSignature(sig));
  }
  function signatureToHexArray(sig) {
    return bigNumberishArrayToHexadecimalStringArray(formatSignature(sig));
  }
  function estimatedFeeToMaxFee(estimatedFee, overhead = 0.5) {
    const overHeadPercent = Math.round((1 + overhead) * 100);
    return toBigInt(estimatedFee) * toBigInt(overHeadPercent) / 100n;
  }

  // src/utils/contract.ts
  function isSierra(contract) {
    const compiledContract = typeof contract === "string" ? parse2(contract) : contract;
    return "sierra_program" in compiledContract;
  }
  function extractContractHashes(payload) {
    const response = { ...payload };
    if (isSierra(payload.contract)) {
      if (!payload.compiledClassHash && payload.casm) {
        response.compiledClassHash = computeCompiledClassHash(payload.casm);
      }
      if (!response.compiledClassHash)
        throw new Error(
          "Extract compiledClassHash failed, provide (CairoAssembly).casm file or compiledClassHash"
        );
    }
    response.classHash = payload.classHash ?? computeContractClassHash(payload.contract);
    if (!response.classHash)
      throw new Error("Extract classHash failed, provide (CompiledContract).json file or classHash");
    return response;
  }
  function contractClassResponseToLegacyCompiledContract(ccr) {
    if (isSierra(ccr)) {
      throw Error("ContractClassResponse need to be LegacyContractClass (cairo0 response class)");
    }
    const contract = ccr;
    return { ...contract, program: decompressProgram(contract.program) };
  }

  // src/utils/fetchPonyfill.ts
  var import_isomorphic_fetch = __toESM(require_fetch_npm_browserify());
  var fetchPonyfill_default = typeof window !== "undefined" && window.fetch || // use buildin fetch in browser if available
  typeof global !== "undefined" && global.fetch || // use buildin fetch in node, react-native and service worker if available
  import_isomorphic_fetch.default;

  // src/utils/provider.ts
  var provider_exports = {};
  __export(provider_exports, {
    createSierraContractClass: () => createSierraContractClass,
    parseContract: () => parseContract,
    wait: () => wait
  });
  function wait(delay) {
    return new Promise((res) => {
      setTimeout(res, delay);
    });
  }
  function createSierraContractClass(contract) {
    const result = { ...contract };
    delete result.sierra_program_debug_info;
    result.abi = formatSpaces(stringify2(contract.abi));
    result.sierra_program = formatSpaces(stringify2(contract.sierra_program));
    result.sierra_program = compressProgram(result.sierra_program);
    return result;
  }
  function parseContract(contract) {
    const parsedContract = typeof contract === "string" ? parse2(contract) : contract;
    if (!isSierra(contract)) {
      return {
        ...parsedContract,
        ..."program" in parsedContract && { program: compressProgram(parsedContract.program) }
      };
    }
    return createSierraContractClass(parsedContract);
  }

  // src/utils/responseParser/rpc.ts
  var RPCResponseParser = class {
    parseGetBlockResponse(res) {
      return {
        timestamp: res.timestamp,
        block_hash: res.block_hash,
        block_number: res.block_number,
        new_root: res.new_root,
        parent_hash: res.parent_hash,
        status: res.status,
        transactions: res.transactions
      };
    }
    parseGetTransactionResponse(res) {
      return {
        calldata: res.calldata || [],
        contract_address: res.contract_address,
        sender_address: res.contract_address,
        max_fee: res.max_fee,
        nonce: res.nonce,
        signature: res.signature || [],
        transaction_hash: res.transaction_hash,
        version: res.version
      };
    }
    parseFeeEstimateResponse(res) {
      return {
        overall_fee: toBigInt(res[0].overall_fee),
        gas_consumed: toBigInt(res[0].gas_consumed),
        gas_price: toBigInt(res[0].gas_price)
      };
    }
    parseFeeEstimateBulkResponse(res) {
      return res.map((val) => ({
        overall_fee: toBigInt(val.overall_fee),
        gas_consumed: toBigInt(val.gas_consumed),
        gas_price: toBigInt(val.gas_price)
      }));
    }
    parseCallContractResponse(res) {
      return {
        result: res
      };
    }
    parseSimulateTransactionResponse(res) {
      return res.map((it) => {
        return {
          ...it,
          suggestedMaxFee: estimatedFeeToMaxFee(BigInt(it.fee_estimation.overall_fee))
        };
      });
    }
    parseContractClassResponse(res) {
      return {
        ...res,
        abi: typeof res.abi === "string" ? JSON.parse(res.abi) : res.abi
      };
    }
  };

  // src/provider/errors.ts
  function fixStack(target, fn = target.constructor) {
    const { captureStackTrace } = Error;
    captureStackTrace && captureStackTrace(target, fn);
  }
  function fixProto(target, prototype) {
    const { setPrototypeOf } = Object;
    setPrototypeOf ? setPrototypeOf(target, prototype) : target.__proto__ = prototype;
  }
  var CustomError = class extends Error {
    constructor(message) {
      super(message);
      Object.defineProperty(this, "name", {
        value: new.target.name,
        enumerable: false,
        configurable: true
      });
      fixProto(this, new.target.prototype);
      fixStack(this);
    }
  };
  var LibraryError = class extends CustomError {
  };
  var GatewayError = class extends LibraryError {
    constructor(message, errorCode) {
      super(message);
      this.errorCode = errorCode;
    }
  };
  var HttpError = class extends LibraryError {
    constructor(message, errorCode) {
      super(message);
      this.errorCode = errorCode;
    }
  };

  // src/utils/starknetId.ts
  var starknetId_exports = {};
  __export(starknetId_exports, {
    StarknetIdContract: () => StarknetIdContract,
    getStarknetIdContract: () => getStarknetIdContract,
    useDecoded: () => useDecoded,
    useEncoded: () => useEncoded
  });
  var basicAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789-";
  var basicSizePlusOne = BigInt(basicAlphabet.length + 1);
  var bigAlphabet = "\u8FD9\u6765";
  var basicAlphabetSize = BigInt(basicAlphabet.length);
  var bigAlphabetSize = BigInt(bigAlphabet.length);
  var bigAlphabetSizePlusOne = BigInt(bigAlphabet.length + 1);
  function extractStars(str) {
    let k = 0;
    while (str.endsWith(bigAlphabet[bigAlphabet.length - 1])) {
      str = str.substring(0, str.length - 1);
      k += 1;
    }
    return [str, k];
  }
  function useDecoded(encoded) {
    let decoded = "";
    encoded.forEach((subdomain) => {
      while (subdomain !== ZERO) {
        const code = subdomain % basicSizePlusOne;
        subdomain /= basicSizePlusOne;
        if (code === BigInt(basicAlphabet.length)) {
          const nextSubdomain = subdomain / bigAlphabetSizePlusOne;
          if (nextSubdomain === ZERO) {
            const code2 = subdomain % bigAlphabetSizePlusOne;
            subdomain = nextSubdomain;
            if (code2 === ZERO)
              decoded += basicAlphabet[0];
            else
              decoded += bigAlphabet[Number(code2) - 1];
          } else {
            const code2 = subdomain % bigAlphabetSize;
            decoded += bigAlphabet[Number(code2)];
            subdomain /= bigAlphabetSize;
          }
        } else
          decoded += basicAlphabet[Number(code)];
      }
      const [str, k] = extractStars(decoded);
      if (k)
        decoded = str + (k % 2 === 0 ? bigAlphabet[bigAlphabet.length - 1].repeat(k / 2 - 1) + bigAlphabet[0] + basicAlphabet[1] : bigAlphabet[bigAlphabet.length - 1].repeat((k - 1) / 2 + 1));
      decoded += ".";
    });
    if (!decoded) {
      return decoded;
    }
    return decoded.concat("stark");
  }
  function useEncoded(decoded) {
    let encoded = BigInt(0);
    let multiplier = BigInt(1);
    if (decoded.endsWith(bigAlphabet[0] + basicAlphabet[1])) {
      const [str, k] = extractStars(decoded.substring(0, decoded.length - 2));
      decoded = str + bigAlphabet[bigAlphabet.length - 1].repeat(2 * (k + 1));
    } else {
      const [str, k] = extractStars(decoded);
      if (k)
        decoded = str + bigAlphabet[bigAlphabet.length - 1].repeat(1 + 2 * (k - 1));
    }
    for (let i = 0; i < decoded.length; i += 1) {
      const char = decoded[i];
      const index = basicAlphabet.indexOf(char);
      const bnIndex = BigInt(basicAlphabet.indexOf(char));
      if (index !== -1) {
        if (i === decoded.length - 1 && decoded[i] === basicAlphabet[0]) {
          encoded += multiplier * basicAlphabetSize;
          multiplier *= basicSizePlusOne;
          multiplier *= basicSizePlusOne;
        } else {
          encoded += multiplier * bnIndex;
          multiplier *= basicSizePlusOne;
        }
      } else if (bigAlphabet.indexOf(char) !== -1) {
        encoded += multiplier * basicAlphabetSize;
        multiplier *= basicSizePlusOne;
        const newid = (i === decoded.length - 1 ? 1 : 0) + bigAlphabet.indexOf(char);
        encoded += multiplier * BigInt(newid);
        multiplier *= bigAlphabetSize;
      }
    }
    return encoded;
  }
  var StarknetIdContract = /* @__PURE__ */ ((StarknetIdContract2) => {
    StarknetIdContract2["MAINNET"] = "0x6ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678";
    StarknetIdContract2["TESTNET"] = "0x3bab268e932d2cecd1946f100ae67ce3dff9fd234119ea2f6da57d16d29fce";
    return StarknetIdContract2;
  })(StarknetIdContract || {});
  function getStarknetIdContract(chainId) {
    switch (chainId) {
      case "0x534e5f4d41494e" /* SN_MAIN */:
        return "0x6ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678" /* MAINNET */;
      case "0x534e5f474f45524c49" /* SN_GOERLI */:
        return "0x3bab268e932d2cecd1946f100ae67ce3dff9fd234119ea2f6da57d16d29fce" /* TESTNET */;
      default:
        throw new Error("Starknet.id is not yet deployed on this network");
    }
  }

  // src/provider/starknetId.ts
  async function getStarkName(provider, address, StarknetIdContract2) {
    const chainId = await provider.getChainId();
    const contract = StarknetIdContract2 ?? getStarknetIdContract(chainId);
    try {
      const hexDomain = await provider.callContract({
        contractAddress: contract,
        entrypoint: "address_to_domain",
        calldata: CallData.compile({
          address
        })
      });
      const decimalDomain = hexDomain.result.map((element) => BigInt(element)).slice(1);
      const stringDomain = useDecoded(decimalDomain);
      if (!stringDomain) {
        throw Error("Starkname not found");
      }
      return stringDomain;
    } catch (e) {
      if (e instanceof Error && e.message === "Starkname not found") {
        throw e;
      }
      throw Error("Could not get stark name");
    }
  }
  async function getAddressFromStarkName(provider, name, StarknetIdContract2) {
    const chainId = await provider.getChainId();
    const contract = StarknetIdContract2 ?? getStarknetIdContract(chainId);
    try {
      const addressData = await provider.callContract({
        contractAddress: contract,
        entrypoint: "domain_to_address",
        calldata: CallData.compile({
          domain: [useEncoded(name.replace(".stark", "")).toString(10)]
        })
      });
      return addressData.result[0];
    } catch {
      throw Error("Could not get address from stark name");
    }
  }

  // src/provider/utils.ts
  var validBlockTags = Object.values(BlockTag);
  var Block = class {
    constructor(_identifier) {
      this.hash = null;
      this.number = null;
      this.tag = null;
      this.valueOf = () => this.number;
      this.toString = () => this.hash;
      this.setIdentifier(_identifier);
    }
    setIdentifier(__identifier) {
      if (typeof __identifier === "string" && isHex(__identifier)) {
        this.hash = __identifier;
      } else if (typeof __identifier === "bigint") {
        this.hash = toHex(__identifier);
      } else if (typeof __identifier === "number") {
        this.number = __identifier;
      } else if (typeof __identifier === "string" && validBlockTags.includes(__identifier)) {
        this.tag = __identifier;
      } else {
        this.tag = "pending" /* pending */;
      }
    }
    // TODO: fix any
    get queryIdentifier() {
      if (this.number !== null) {
        return `blockNumber=${this.number}`;
      }
      if (this.hash !== null) {
        return `blockHash=${this.hash}`;
      }
      return `blockNumber=${this.tag}`;
    }
    // TODO: fix any
    get identifier() {
      if (this.number !== null) {
        return { block_number: this.number };
      }
      if (this.hash !== null) {
        return { block_hash: this.hash };
      }
      return this.tag;
    }
    set identifier(_identifier) {
      this.setIdentifier(_identifier);
    }
    get sequencerIdentifier() {
      return this.hash !== null ? { blockHash: this.hash } : { blockNumber: this.number ?? this.tag };
    }
  };

  // src/provider/rpc.ts
  var defaultOptions = {
    headers: { "Content-Type": "application/json" },
    blockIdentifier: "pending" /* pending */,
    retries: 200
  };
  var RpcProvider = class {
    constructor(optionsOrProvider) {
      this.responseParser = new RPCResponseParser();
      const { nodeUrl, retries, headers, blockIdentifier, chainId } = optionsOrProvider;
      this.nodeUrl = nodeUrl;
      this.retries = retries || defaultOptions.retries;
      this.headers = { ...defaultOptions.headers, ...headers };
      this.blockIdentifier = blockIdentifier || defaultOptions.blockIdentifier;
      this.chainId = chainId;
      this.getChainId();
    }
    fetch(method, params) {
      const body = stringify2({ method, jsonrpc: "2.0", params, id: 0 });
      return fetchPonyfill_default(this.nodeUrl, {
        method: "POST",
        body,
        headers: this.headers
      });
    }
    errorHandler(error) {
      if (error) {
        const { code, message } = error;
        throw new LibraryError(`${code}: ${message}`);
      }
    }
    async fetchEndpoint(method, params) {
      try {
        const rawResult = await this.fetch(method, params);
        const { error, result } = await rawResult.json();
        this.errorHandler(error);
        return result;
      } catch (error) {
        this.errorHandler(error?.response?.data);
        throw error;
      }
    }
    // Methods from Interface
    async getChainId() {
      this.chainId ?? (this.chainId = await this.fetchEndpoint("starknet_chainId"));
      return this.chainId;
    }
    async getBlock(blockIdentifier = this.blockIdentifier) {
      return this.getBlockWithTxHashes(blockIdentifier).then(
        this.responseParser.parseGetBlockResponse
      );
    }
    async getBlockHashAndNumber() {
      return this.fetchEndpoint("starknet_blockHashAndNumber");
    }
    async getBlockWithTxHashes(blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getBlockWithTxHashes", { block_id });
    }
    async getBlockWithTxs(blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getBlockWithTxs", { block_id });
    }
    async getClassHashAt(contractAddress, blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getClassHashAt", {
        block_id,
        contract_address: contractAddress
      });
    }
    async getNonceForAddress(contractAddress, blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getNonce", {
        contract_address: contractAddress,
        block_id
      });
    }
    async getPendingTransactions() {
      return this.fetchEndpoint("starknet_pendingTransactions");
    }
    async getProtocolVersion() {
      throw new Error("Pathfinder does not implement this rpc 0.1.0 method");
    }
    async getStateUpdate(blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getStateUpdate", { block_id });
    }
    async getStorageAt(contractAddress, key, blockIdentifier = this.blockIdentifier) {
      const parsedKey = toStorageKey(key);
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getStorageAt", {
        contract_address: contractAddress,
        key: parsedKey,
        block_id
      });
    }
    // Methods from Interface
    async getTransaction(txHash) {
      return this.getTransactionByHash(txHash).then(this.responseParser.parseGetTransactionResponse);
    }
    async getTransactionByHash(txHash) {
      return this.fetchEndpoint("starknet_getTransactionByHash", { transaction_hash: txHash });
    }
    async getTransactionByBlockIdAndIndex(blockIdentifier, index) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getTransactionByBlockIdAndIndex", { block_id, index });
    }
    async getTransactionReceipt(txHash) {
      return this.fetchEndpoint("starknet_getTransactionReceipt", { transaction_hash: txHash });
    }
    async getClassByHash(classHash) {
      return this.getClass(classHash);
    }
    async getClass(classHash, blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getClass", {
        class_hash: classHash,
        block_id
      }).then(this.responseParser.parseContractClassResponse);
    }
    async getClassAt(contractAddress, blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getClassAt", {
        block_id,
        contract_address: contractAddress
      }).then(this.responseParser.parseContractClassResponse);
    }
    async getCode(_contractAddress, _blockIdentifier) {
      throw new Error("RPC does not implement getCode function");
    }
    async getEstimateFee(invocation, invocationDetails, blockIdentifier = this.blockIdentifier) {
      return this.getInvokeEstimateFee(invocation, invocationDetails, blockIdentifier);
    }
    async getInvokeEstimateFee(invocation, invocationDetails, blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      const transaction = this.buildTransaction(
        {
          type: "INVOKE_FUNCTION" /* INVOKE */,
          ...invocation,
          ...invocationDetails
        },
        "fee"
      );
      return this.fetchEndpoint("starknet_estimateFee", {
        request: [transaction],
        block_id
      }).then(this.responseParser.parseFeeEstimateResponse);
    }
    async getDeclareEstimateFee(invocation, details, blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      const transaction = this.buildTransaction(
        {
          type: "DECLARE" /* DECLARE */,
          ...invocation,
          ...details
        },
        "fee"
      );
      return this.fetchEndpoint("starknet_estimateFee", {
        request: [transaction],
        block_id
      }).then(this.responseParser.parseFeeEstimateResponse);
    }
    async getDeployAccountEstimateFee(invocation, details, blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      const transaction = this.buildTransaction(
        {
          type: "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */,
          ...invocation,
          ...details
        },
        "fee"
      );
      return this.fetchEndpoint("starknet_estimateFee", {
        request: [transaction],
        block_id
      }).then(this.responseParser.parseFeeEstimateResponse);
    }
    async getEstimateFeeBulk(invocations, { blockIdentifier = this.blockIdentifier, skipValidate = false }) {
      if (skipValidate) {
        console.warn("getEstimateFeeBulk RPC does not support skipValidate");
      }
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_estimateFee", {
        request: invocations.map((it) => this.buildTransaction(it, "fee")),
        block_id
      }).then(this.responseParser.parseFeeEstimateBulkResponse);
    }
    async declareContract({ contract, signature, senderAddress, compiledClassHash }, details) {
      if (!isSierra(contract)) {
        return this.fetchEndpoint("starknet_addDeclareTransaction", {
          declare_transaction: {
            type: rpc_exports.TransactionType.DECLARE,
            contract_class: {
              program: contract.program,
              entry_points_by_type: contract.entry_points_by_type,
              abi: contract.abi
            },
            version: HEX_STR_TRANSACTION_VERSION_1,
            max_fee: toHex(details.maxFee || 0),
            signature: signatureToHexArray(signature),
            sender_address: senderAddress,
            nonce: toHex(details.nonce)
          }
        });
      }
      return this.fetchEndpoint("starknet_addDeclareTransaction", {
        declare_transaction: {
          type: rpc_exports.TransactionType.DECLARE,
          contract_class: {
            sierra_program: decompressProgram(contract.sierra_program),
            contract_class_version: contract.contract_class_version,
            entry_points_by_type: contract.entry_points_by_type,
            abi: contract.abi
          },
          compiled_class_hash: compiledClassHash || "",
          version: HEX_STR_TRANSACTION_VERSION_2,
          max_fee: toHex(details.maxFee || 0),
          signature: signatureToHexArray(signature),
          sender_address: senderAddress,
          nonce: toHex(details.nonce)
        }
      });
    }
    async deployAccountContract({ classHash, constructorCalldata, addressSalt, signature }, details) {
      return this.fetchEndpoint("starknet_addDeployAccountTransaction", {
        deploy_account_transaction: {
          constructor_calldata: CallData.toHex(constructorCalldata || []),
          class_hash: toHex(classHash),
          contract_address_salt: toHex(addressSalt || 0),
          type: rpc_exports.TransactionType.DEPLOY_ACCOUNT,
          max_fee: toHex(details.maxFee || 0),
          version: toHex(details.version || 0),
          signature: signatureToHexArray(signature),
          nonce: toHex(details.nonce)
        }
      });
    }
    async invokeFunction(functionInvocation, details) {
      return this.fetchEndpoint("starknet_addInvokeTransaction", {
        invoke_transaction: {
          sender_address: functionInvocation.contractAddress,
          calldata: CallData.toHex(functionInvocation.calldata),
          type: rpc_exports.TransactionType.INVOKE,
          max_fee: toHex(details.maxFee || 0),
          version: "0x1",
          signature: signatureToHexArray(functionInvocation.signature),
          nonce: toHex(details.nonce)
        }
      });
    }
    // Methods from Interface
    async callContract(call, blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      const result = await this.fetchEndpoint("starknet_call", {
        request: {
          contract_address: call.contractAddress,
          entry_point_selector: getSelectorFromName(call.entrypoint),
          calldata: CallData.toHex(call.calldata)
        },
        block_id
      });
      return this.responseParser.parseCallContractResponse(result);
    }
    async traceTransaction(transactionHash) {
      return this.fetchEndpoint("starknet_traceTransaction", { transaction_hash: transactionHash });
    }
    async traceBlockTransactions(blockHash) {
      return this.fetchEndpoint("starknet_traceBlockTransactions", { block_hash: blockHash });
    }
    async waitForTransaction(txHash, options) {
      let { retries } = this;
      let onchain = false;
      let isErrorState = false;
      let txReceipt = {};
      const retryInterval = options?.retryInterval ?? 5e3;
      const errorStates = options?.errorStates ?? [TransactionExecutionStatus2.REVERTED];
      const successStates = options?.successStates ?? [
        TransactionExecutionStatus2.SUCCEEDED,
        TransactionFinalityStatus2.ACCEPTED_ON_L1,
        TransactionFinalityStatus2.ACCEPTED_ON_L2
      ];
      while (!onchain) {
        await wait(retryInterval);
        try {
          txReceipt = await this.getTransactionReceipt(txHash);
          const executionStatus = pascalToSnake(txReceipt.execution_status);
          const finalityStatus = pascalToSnake(txReceipt.finality_status);
          if (!executionStatus || !finalityStatus) {
            const error = new Error("waiting for transaction status");
            throw error;
          }
          if (successStates.includes(executionStatus) || successStates.includes(finalityStatus)) {
            onchain = true;
          } else if (errorStates.includes(executionStatus) || errorStates.includes(finalityStatus)) {
            const message = `${executionStatus}: ${finalityStatus}: ${txReceipt.revert_reason}`;
            const error = new Error(message);
            error.response = txReceipt;
            isErrorState = true;
            throw error;
          }
        } catch (error) {
          if (error instanceof Error && isErrorState) {
            throw error;
          }
          if (retries === 0) {
            throw new Error(`waitForTransaction timed-out with retries ${this.retries}`);
          }
        }
        retries -= 1;
      }
      await wait(retryInterval);
      return txReceipt;
    }
    /**
     * Gets the transaction count from a block.
     *
     *
     * @param blockIdentifier
     * @returns Number of transactions
     */
    async getTransactionCount(blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getBlockTransactionCount", { block_id });
    }
    /**
     * Gets the latest block number
     *
     *
     * @returns Number of the latest block
     */
    async getBlockNumber() {
      return this.fetchEndpoint("starknet_blockNumber");
    }
    /**
     * Gets syncing status of the node
     *
     *
     * @returns Object with the stats data
     */
    async getSyncingStats() {
      return this.fetchEndpoint("starknet_syncing");
    }
    /**
     * Gets all the events filtered
     *
     *
     * @returns events and the pagination of the events
     */
    async getEvents(eventFilter) {
      return this.fetchEndpoint("starknet_getEvents", { filter: eventFilter });
    }
    async getSimulateTransaction(invocations, {
      blockIdentifier = this.blockIdentifier,
      skipValidate = false,
      skipExecute = false,
      // @deprecated
      skipFeeCharge = true
      // Pathfinder currently does not support `starknet_simulateTransactions` without `SKIP_FEE_CHARGE` simulation flag being set. This will become supported in a future release
    }) {
      const block_id = new Block(blockIdentifier).identifier;
      const simulationFlags = [];
      if (skipValidate)
        simulationFlags.push(SimulationFlag.SKIP_VALIDATE);
      if (skipExecute || skipFeeCharge)
        simulationFlags.push(SimulationFlag.SKIP_FEE_CHARGE);
      return this.fetchEndpoint("starknet_simulateTransactions", {
        block_id,
        transactions: invocations.map((it) => this.buildTransaction(it)),
        simulation_flags: simulationFlags
      }).then(this.responseParser.parseSimulateTransactionResponse);
    }
    async getStarkName(address, StarknetIdContract2) {
      return getStarkName(this, address, StarknetIdContract2);
    }
    async getAddressFromStarkName(name, StarknetIdContract2) {
      return getAddressFromStarkName(this, name, StarknetIdContract2);
    }
    buildTransaction(invocation, versionType) {
      const defaultVersions = getVersionsByType(versionType);
      const details = {
        signature: signatureToHexArray(invocation.signature),
        nonce: toHex(invocation.nonce),
        max_fee: toHex(invocation.maxFee || 0)
      };
      if (invocation.type === "INVOKE_FUNCTION" /* INVOKE */) {
        return {
          type: rpc_exports.TransactionType.INVOKE,
          // Diff between sequencer and rpc invoke type
          sender_address: invocation.contractAddress,
          calldata: CallData.toHex(invocation.calldata),
          version: toHex(invocation.version || defaultVersions.v1),
          // HEX_STR_TRANSACTION_VERSION_1, // as any HOTFIX TODO: Resolve spec version
          ...details
        };
      }
      if (invocation.type === "DECLARE" /* DECLARE */) {
        if (!isSierra(invocation.contract)) {
          return {
            type: invocation.type,
            contract_class: invocation.contract,
            sender_address: invocation.senderAddress,
            version: toHex(invocation.version || defaultVersions.v1),
            // HEX_STR_TRANSACTION_VERSION_1, // as any HOTFIX TODO: Resolve spec version
            ...details
          };
        }
        return {
          // compiled_class_hash
          type: invocation.type,
          contract_class: {
            ...invocation.contract,
            sierra_program: decompressProgram(invocation.contract.sierra_program)
          },
          compiled_class_hash: invocation.compiledClassHash || "",
          sender_address: invocation.senderAddress,
          version: toHex(invocation.version || defaultVersions.v2),
          // HEX_STR_TRANSACTION_VERSION_2, // as any HOTFIX TODO: Resolve spec version
          ...details
        };
      }
      if (invocation.type === "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */) {
        return {
          type: invocation.type,
          constructor_calldata: CallData.toHex(invocation.constructorCalldata || []),
          class_hash: toHex(invocation.classHash),
          contract_address_salt: toHex(invocation.addressSalt || 0),
          version: toHex(invocation.version || defaultVersions.v1),
          ...details
        };
      }
      throw Error("RPC buildTransaction received unknown TransactionType");
    }
  };

  // src/provider/sequencer.ts
  var import_url_join2 = __toESM(require_url_join());

  // src/utils/responseParser/index.ts
  var ResponseParser = class {
  };

  // src/utils/responseParser/sequencer.ts
  var SequencerAPIResponseParser = class extends ResponseParser {
    parseGetBlockResponse(res) {
      return {
        ...res,
        new_root: res.state_root,
        parent_hash: res.parent_block_hash,
        transactions: Object.values(res.transactions).map((value) => "transaction_hash" in value && value.transaction_hash).filter(Boolean)
      };
    }
    parseGetTransactionResponse(res) {
      if (res.status === "NOT_RECEIVED" /* NOT_RECEIVED */ && res.finality_status === "NOT_RECEIVED" /* NOT_RECEIVED */) {
        throw new LibraryError();
      }
      return {
        ...res,
        calldata: "calldata" in res.transaction ? res.transaction.calldata : [],
        contract_class: "contract_class" in res.transaction ? res.transaction.contract_class : void 0,
        entry_point_selector: "entry_point_selector" in res.transaction ? res.transaction.entry_point_selector : void 0,
        max_fee: "max_fee" in res.transaction ? res.transaction.max_fee : void 0,
        nonce: res.transaction.nonce,
        sender_address: "sender_address" in res.transaction ? res.transaction.sender_address : void 0,
        signature: "signature" in res.transaction ? res.transaction.signature : void 0,
        transaction_hash: "transaction_hash" in res.transaction ? res.transaction.transaction_hash : void 0,
        version: "version" in res.transaction ? res.transaction.version : void 0
      };
    }
    parseGetTransactionReceiptResponse(res) {
      return {
        ...res,
        messages_sent: res.l2_to_l1_messages,
        ..."revert_error" in res && { revert_reason: res.revert_error }
      };
    }
    parseFeeEstimateResponse(res) {
      if ("overall_fee" in res) {
        let gasInfo = {};
        try {
          gasInfo = {
            gas_consumed: toBigInt(res.gas_usage),
            gas_price: toBigInt(res.gas_price)
          };
        } catch {
        }
        return {
          overall_fee: toBigInt(res.overall_fee),
          ...gasInfo
        };
      }
      return {
        overall_fee: toBigInt(res.amount)
      };
    }
    parseFeeEstimateBulkResponse(res) {
      return [].concat(res).map((item) => {
        if ("overall_fee" in item) {
          let gasInfo = {};
          try {
            gasInfo = {
              gas_consumed: toBigInt(item.gas_usage),
              gas_price: toBigInt(item.gas_price)
            };
          } catch {
          }
          return {
            overall_fee: toBigInt(item.overall_fee),
            ...gasInfo
          };
        }
        return {
          overall_fee: toBigInt(item.amount)
        };
      });
    }
    parseSimulateTransactionResponse(res) {
      const suggestedMaxFee = "overall_fee" in res.fee_estimation ? res.fee_estimation.overall_fee : res.fee_estimation.amount;
      return [
        {
          transaction_trace: res.trace,
          fee_estimation: res.fee_estimation,
          suggestedMaxFee: estimatedFeeToMaxFee(BigInt(suggestedMaxFee))
        }
      ];
    }
    parseCallContractResponse(res) {
      return {
        result: res.result
      };
    }
    parseInvokeFunctionResponse(res) {
      return {
        transaction_hash: res.transaction_hash
      };
    }
    parseDeployContractResponse(res) {
      return {
        transaction_hash: res.transaction_hash,
        contract_address: res.address
      };
    }
    parseDeclareContractResponse(res) {
      return {
        transaction_hash: res.transaction_hash,
        class_hash: res.class_hash
      };
    }
    parseGetStateUpdateResponse(res) {
      const nonces = Object.entries(res.state_diff.nonces).map(([contract_address, nonce]) => ({
        contract_address,
        nonce
      }));
      const storage_diffs = Object.entries(res.state_diff.storage_diffs).map(
        ([address, storage_entries]) => ({ address, storage_entries })
      );
      return {
        ...res,
        state_diff: {
          ...res.state_diff,
          storage_diffs,
          nonces
        }
      };
    }
    parseContractClassResponse(res) {
      const response = isSierra(res) ? res : parseContract(res);
      return {
        ...response,
        abi: typeof response.abi === "string" ? JSON.parse(response.abi) : response.abi
      };
    }
  };

  // src/utils/url.ts
  var import_url_join = __toESM(require_url_join());
  var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
  var localhostDomainRE = /^localhost[:?\d]*(?:[^:?\d]\S*)?$/;
  var nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/;
  function isUrl(s) {
    if (!s) {
      return false;
    }
    if (typeof s !== "string") {
      return false;
    }
    const match = s.match(protocolAndDomainRE);
    if (!match) {
      return false;
    }
    const everythingAfterProtocol = match[1];
    if (!everythingAfterProtocol) {
      return false;
    }
    if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
      return true;
    }
    return false;
  }
  function buildUrl(baseUrl, defaultPath, urlOrPath) {
    return isUrl(urlOrPath) ? urlOrPath : (0, import_url_join.default)(baseUrl, urlOrPath ?? defaultPath);
  }

  // src/provider/sequencer.ts
  function isEmptyQueryObject(obj) {
    return obj === void 0 || Object.keys(obj).length === 0 || Object.keys(obj).length === 1 && Object.entries(obj).every(([k, v]) => k === "blockIdentifier" && v === null);
  }
  var defaultOptions2 = {
    network: "SN_GOERLI2" /* SN_GOERLI2 */,
    blockIdentifier: "pending" /* pending */
  };
  var SequencerProvider = class {
    constructor(optionsOrProvider = defaultOptions2) {
      this.responseParser = new SequencerAPIResponseParser();
      if ("network" in optionsOrProvider) {
        this.baseUrl = SequencerProvider.getNetworkFromName(optionsOrProvider.network);
        this.feederGatewayUrl = buildUrl(this.baseUrl, "feeder_gateway");
        this.gatewayUrl = buildUrl(this.baseUrl, "gateway");
      } else {
        this.baseUrl = optionsOrProvider.baseUrl;
        this.feederGatewayUrl = buildUrl(
          this.baseUrl,
          "feeder_gateway",
          optionsOrProvider.feederGatewayUrl
        );
        this.gatewayUrl = buildUrl(this.baseUrl, "gateway", optionsOrProvider.gatewayUrl);
      }
      this.chainId = optionsOrProvider?.chainId ?? SequencerProvider.getChainIdFromBaseUrl(this.baseUrl);
      this.headers = optionsOrProvider.headers;
      this.blockIdentifier = optionsOrProvider?.blockIdentifier || defaultOptions2.blockIdentifier;
    }
    static getNetworkFromName(name) {
      switch (name) {
        case "SN_MAIN" /* SN_MAIN */:
        case "0x534e5f4d41494e" /* SN_MAIN */:
          return "https://alpha-mainnet.starknet.io" /* SN_MAIN */;
        case "SN_GOERLI" /* SN_GOERLI */:
        case "0x534e5f474f45524c49" /* SN_GOERLI */:
          return "https://alpha4.starknet.io" /* SN_GOERLI */;
        case "SN_GOERLI2" /* SN_GOERLI2 */:
        case "0x534e5f474f45524c4932" /* SN_GOERLI2 */:
          return "https://alpha4-2.starknet.io" /* SN_GOERLI2 */;
        default:
          throw new Error("Could not detect base url from NetworkName");
      }
    }
    static getChainIdFromBaseUrl(baseUrl) {
      try {
        const url = new URL(baseUrl);
        if (url.host.includes("mainnet.starknet.io")) {
          return "0x534e5f4d41494e" /* SN_MAIN */;
        }
        if (url.host.includes("alpha4-2.starknet.io")) {
          return "0x534e5f474f45524c4932" /* SN_GOERLI2 */;
        }
        return "0x534e5f474f45524c49" /* SN_GOERLI */;
      } catch {
        console.error(`Could not parse baseUrl: ${baseUrl}`);
        return "0x534e5f474f45524c49" /* SN_GOERLI */;
      }
    }
    getFetchUrl(endpoint) {
      const gatewayUrlEndpoints = ["add_transaction"];
      return gatewayUrlEndpoints.includes(endpoint) ? this.gatewayUrl : this.feederGatewayUrl;
    }
    getFetchMethod(endpoint) {
      const postMethodEndpoints = [
        "add_transaction",
        "call_contract",
        "estimate_fee",
        "estimate_message_fee",
        "estimate_fee_bulk",
        "simulate_transaction"
      ];
      return postMethodEndpoints.includes(endpoint) ? "POST" : "GET";
    }
    getQueryString(query) {
      if (isEmptyQueryObject(query)) {
        return "";
      }
      const queryString = Object.entries(query).map(([key, value]) => {
        if (key === "blockIdentifier") {
          const block = new Block(value);
          return `${block.queryIdentifier}`;
        }
        return `${key}=${value}`;
      }).join("&");
      return `?${queryString}`;
    }
    getHeaders(method) {
      if (method === "POST") {
        return {
          "Content-Type": "application/json",
          ...this.headers
        };
      }
      return this.headers;
    }
    // typesafe fetch
    async fetchEndpoint(endpoint, ...[query, request]) {
      const baseUrl = this.getFetchUrl(endpoint);
      const method = this.getFetchMethod(endpoint);
      const queryString = this.getQueryString(query);
      const url = (0, import_url_join2.default)(baseUrl, endpoint, queryString);
      return this.fetch(url, {
        method,
        body: request
      });
    }
    async fetch(endpoint, options) {
      const url = buildUrl(this.baseUrl, "", endpoint);
      const method = options?.method ?? "GET";
      const headers = this.getHeaders(method);
      const body = stringify2(options?.body);
      try {
        const response = await fetchPonyfill_default(url, {
          method,
          body,
          headers
        });
        const textResponse = await response.text();
        if (!response.ok) {
          let responseBody;
          try {
            responseBody = parse2(textResponse);
          } catch {
            throw new HttpError(response.statusText, response.status);
          }
          throw new GatewayError(responseBody.message, responseBody.code);
        }
        const parseChoice = options?.parseAlwaysAsBigInt ? parseAlwaysAsBig : parse2;
        return parseChoice(textResponse);
      } catch (error) {
        if (error instanceof Error && !(error instanceof LibraryError))
          throw Error(`Could not ${method} from endpoint \`${url}\`: ${error.message}`);
        throw error;
      }
    }
    async getChainId() {
      return Promise.resolve(this.chainId);
    }
    async callContract({ contractAddress, entrypoint: entryPointSelector, calldata = [] }, blockIdentifier = this.blockIdentifier) {
      return this.fetchEndpoint(
        "call_contract",
        { blockIdentifier },
        {
          // TODO - determine best choice once both are fully supported in devnet
          // signature: [],
          // sender_address: contractAddress,
          contract_address: contractAddress,
          entry_point_selector: getSelectorFromName(entryPointSelector),
          calldata: CallData.compile(calldata)
        }
      ).then(this.responseParser.parseCallContractResponse);
    }
    async getBlock(blockIdentifier = this.blockIdentifier) {
      return this.fetchEndpoint("get_block", { blockIdentifier }).then(
        this.responseParser.parseGetBlockResponse
      );
    }
    async getNonceForAddress(contractAddress, blockIdentifier = this.blockIdentifier) {
      return this.fetchEndpoint("get_nonce", { contractAddress, blockIdentifier });
    }
    async getStorageAt(contractAddress, key, blockIdentifier = this.blockIdentifier) {
      const parsedKey = toBigInt(key).toString(10);
      return this.fetchEndpoint("get_storage_at", {
        blockIdentifier,
        contractAddress,
        key: parsedKey
      });
    }
    async getTransaction(txHash) {
      const txHashHex = toHex(txHash);
      return this.fetchEndpoint("get_transaction", { transactionHash: txHashHex }).then((result) => {
        if (Object.values(result).length === 1)
          throw new LibraryError(result.status);
        return this.responseParser.parseGetTransactionResponse(result);
      });
    }
    async getTransactionReceipt(txHash) {
      const txHashHex = toHex(txHash);
      return this.fetchEndpoint("get_transaction_receipt", { transactionHash: txHashHex }).then(
        this.responseParser.parseGetTransactionReceiptResponse
      );
    }
    async getClassAt(contractAddress, blockIdentifier = this.blockIdentifier) {
      return this.fetchEndpoint("get_full_contract", { blockIdentifier, contractAddress }).then(
        this.responseParser.parseContractClassResponse
      );
    }
    async getClassHashAt(contractAddress, blockIdentifier = this.blockIdentifier) {
      return this.fetchEndpoint("get_class_hash_at", { blockIdentifier, contractAddress });
    }
    async getClassByHash(classHash, blockIdentifier = this.blockIdentifier) {
      return this.fetchEndpoint("get_class_by_hash", { classHash, blockIdentifier }).then(
        this.responseParser.parseContractClassResponse
      );
    }
    async getCompiledClassByClassHash(classHash, blockIdentifier = this.blockIdentifier) {
      return this.fetchEndpoint("get_compiled_class_by_class_hash", { classHash, blockIdentifier });
    }
    async invokeFunction(functionInvocation, details) {
      return this.fetchEndpoint("add_transaction", void 0, {
        type: "INVOKE_FUNCTION" /* INVOKE */,
        sender_address: functionInvocation.contractAddress,
        calldata: CallData.compile(functionInvocation.calldata ?? []),
        signature: signatureToDecimalArray(functionInvocation.signature),
        nonce: toHex(details.nonce),
        max_fee: toHex(details.maxFee || 0),
        version: "0x1"
      }).then(this.responseParser.parseInvokeFunctionResponse);
    }
    async deployAccountContract({ classHash, constructorCalldata, addressSalt, signature }, details) {
      return this.fetchEndpoint("add_transaction", void 0, {
        type: "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */,
        contract_address_salt: addressSalt ?? randomAddress(),
        constructor_calldata: CallData.compile(constructorCalldata ?? []),
        class_hash: toHex(classHash),
        max_fee: toHex(details.maxFee || 0),
        version: toHex(details.version || 0),
        nonce: toHex(details.nonce),
        signature: signatureToDecimalArray(signature)
      }).then(this.responseParser.parseDeployContractResponse);
    }
    async declareContract({ senderAddress, contract, signature, compiledClassHash }, details) {
      if (!isSierra(contract)) {
        return this.fetchEndpoint("add_transaction", void 0, {
          type: "DECLARE" /* DECLARE */,
          contract_class: contract,
          nonce: toHex(details.nonce),
          signature: signatureToDecimalArray(signature),
          sender_address: senderAddress,
          max_fee: toHex(details.maxFee || 0),
          version: toHex(transactionVersion)
        }).then(this.responseParser.parseDeclareContractResponse);
      }
      return this.fetchEndpoint("add_transaction", void 0, {
        type: "DECLARE" /* DECLARE */,
        sender_address: senderAddress,
        compiled_class_hash: compiledClassHash,
        contract_class: contract,
        nonce: toHex(details.nonce),
        signature: signatureToDecimalArray(signature),
        max_fee: toHex(details.maxFee || 0),
        version: toHex(transactionVersion_2)
      }).then(this.responseParser.parseDeclareContractResponse);
    }
    async getEstimateFee(invocation, invocationDetails, blockIdentifier = this.blockIdentifier, skipValidate = false) {
      return this.getInvokeEstimateFee(invocation, invocationDetails, blockIdentifier, skipValidate);
    }
    async getInvokeEstimateFee(invocation, invocationDetails, blockIdentifier = this.blockIdentifier, skipValidate = false) {
      const transaction = this.buildTransaction(
        {
          type: "INVOKE_FUNCTION" /* INVOKE */,
          ...invocation,
          ...invocationDetails
        },
        "fee"
      );
      return this.fetchEndpoint("estimate_fee", { blockIdentifier, skipValidate }, transaction).then(
        this.responseParser.parseFeeEstimateResponse
      );
    }
    async getDeclareEstimateFee(invocation, details, blockIdentifier = this.blockIdentifier, skipValidate = false) {
      const transaction = this.buildTransaction(
        {
          type: "DECLARE" /* DECLARE */,
          ...invocation,
          ...details
        },
        "fee"
      );
      return this.fetchEndpoint("estimate_fee", { blockIdentifier, skipValidate }, transaction).then(
        this.responseParser.parseFeeEstimateResponse
      );
    }
    async getDeployAccountEstimateFee(invocation, details, blockIdentifier = this.blockIdentifier, skipValidate = false) {
      const transaction = this.buildTransaction(
        {
          type: "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */,
          ...invocation,
          ...details
        },
        "fee"
      );
      return this.fetchEndpoint("estimate_fee", { blockIdentifier, skipValidate }, transaction).then(
        this.responseParser.parseFeeEstimateResponse
      );
    }
    async getEstimateFeeBulk(invocations, { blockIdentifier = this.blockIdentifier, skipValidate = false }) {
      const transactions = invocations.map((it) => this.buildTransaction(it, "fee"));
      return this.fetchEndpoint(
        "estimate_fee_bulk",
        { blockIdentifier, skipValidate },
        transactions
      ).then(this.responseParser.parseFeeEstimateBulkResponse);
    }
    async getCode(contractAddress, blockIdentifier = this.blockIdentifier) {
      return this.fetchEndpoint("get_code", { contractAddress, blockIdentifier });
    }
    async waitForTransaction(txHash, options) {
      let res;
      let completed = false;
      let retries = 0;
      const retryInterval = options?.retryInterval ?? 5e3;
      const errorStates = options?.errorStates ?? [
        "REJECTED" /* REJECTED */,
        "NOT_RECEIVED" /* NOT_RECEIVED */,
        "REVERTED" /* REVERTED */
      ];
      const successStates = options?.successStates ?? [
        "SUCCEEDED" /* SUCCEEDED */,
        "ACCEPTED_ON_L1" /* ACCEPTED_ON_L1 */,
        "ACCEPTED_ON_L2" /* ACCEPTED_ON_L2 */
      ];
      while (!completed) {
        await wait(retryInterval);
        res = await this.getTransactionStatus(txHash);
        if ("NOT_RECEIVED" /* NOT_RECEIVED */ === res.finality_status && retries < 3) {
          retries += 1;
        } else if (successStates.includes(res.finality_status) || successStates.includes(res.execution_status)) {
          completed = true;
        } else if (errorStates.includes(res.finality_status) || errorStates.includes(res.execution_status)) {
          let message;
          if (res.tx_failure_reason) {
            message = `${res.tx_status}: ${res.tx_failure_reason.code}
${res.tx_failure_reason.error_message}`;
          } else if (res.tx_revert_reason) {
            message = `${res.tx_status}: ${res.tx_revert_reason}`;
          } else {
            message = res.tx_status;
          }
          const error = new Error(message);
          error.response = res;
          throw error;
        }
      }
      const txReceipt = await this.getTransactionReceipt(txHash);
      return txReceipt;
    }
    /**
     * Gets the status of a transaction.
     * @param txHash BigNumberish
     * @returns GetTransactionStatusResponse - the transaction status object
     */
    async getTransactionStatus(txHash) {
      const txHashHex = toHex(txHash);
      return this.fetchEndpoint("get_transaction_status", { transactionHash: txHashHex });
    }
    /**
     * Gets the smart contract address on the goerli testnet.
     * @returns GetContractAddressesResponse - starknet smart contract addresses
     */
    async getContractAddresses() {
      return this.fetchEndpoint("get_contract_addresses");
    }
    /**
     * Gets the transaction trace from a tx id.
     * @param txHash BigNumberish
     * @returns TransactionTraceResponse - the transaction trace
     */
    async getTransactionTrace(txHash) {
      const txHashHex = toHex(txHash);
      return this.fetchEndpoint("get_transaction_trace", { transactionHash: txHashHex });
    }
    async estimateMessageFee({ from_address, to_address, entry_point_selector, payload }, blockIdentifier = this.blockIdentifier) {
      const validCallL1Handler = {
        from_address: getDecimalString(from_address),
        to_address: getHexString(to_address),
        entry_point_selector: getSelector(entry_point_selector),
        payload: getHexStringArray(payload)
      };
      return this.fetchEndpoint("estimate_message_fee", { blockIdentifier }, validCallL1Handler);
    }
    /**
     * Simulate transaction using Sequencer provider
     * WARNING!: Sequencer will process only first element from invocations array
     *
     * @param invocations Array of invocations, but only first invocation will be processed
     * @param blockIdentifier block identifier, default 'latest'
     * @param skipValidate Skip Account __validate__ method
     * @returns
     */
    async getSimulateTransaction(invocations, {
      blockIdentifier = this.blockIdentifier,
      skipValidate = false,
      skipExecute = false
    }) {
      if (invocations.length > 1) {
        console.warn("Sequencer simulate process only first element from invocations list");
      }
      if (skipExecute) {
        console.warn("Sequencer can't skip account __execute__");
      }
      const transaction = this.buildTransaction(invocations[0]);
      return this.fetchEndpoint(
        "simulate_transaction",
        {
          blockIdentifier,
          skipValidate: skipValidate ?? false
        },
        transaction
      ).then(this.responseParser.parseSimulateTransactionResponse);
    }
    async getStateUpdate(blockIdentifier = this.blockIdentifier) {
      const args = new Block(blockIdentifier).sequencerIdentifier;
      return this.fetchEndpoint("get_state_update", { ...args }).then(
        this.responseParser.parseGetStateUpdateResponse
      );
    }
    // consider adding an optional trace retrieval parameter to the getBlock method
    async getBlockTraces(blockIdentifier = this.blockIdentifier) {
      const args = new Block(blockIdentifier).sequencerIdentifier;
      return this.fetchEndpoint("get_block_traces", { ...args });
    }
    async getStarkName(address, StarknetIdContract2) {
      return getStarkName(this, address, StarknetIdContract2);
    }
    async getAddressFromStarkName(name, StarknetIdContract2) {
      return getAddressFromStarkName(this, name, StarknetIdContract2);
    }
    /**
     * Build Single AccountTransaction from Single AccountInvocation
     * @param invocation AccountInvocationItem
     * @param versionType 'fee' | 'transaction' - used to determine default versions
     * @returns AccountTransactionItem
     */
    buildTransaction(invocation, versionType) {
      const defaultVersions = getVersionsByType(versionType);
      const details = {
        signature: signatureToDecimalArray(invocation.signature),
        nonce: toHex(invocation.nonce)
      };
      if (invocation.type === "INVOKE_FUNCTION" /* INVOKE */) {
        return {
          type: invocation.type,
          sender_address: invocation.contractAddress,
          calldata: CallData.compile(invocation.calldata ?? []),
          version: toHex(invocation.version || defaultVersions.v1),
          ...details
        };
      }
      if (invocation.type === "DECLARE" /* DECLARE */) {
        if (!isSierra(invocation.contract)) {
          return {
            type: invocation.type,
            contract_class: invocation.contract,
            sender_address: invocation.senderAddress,
            version: toHex(invocation.version || defaultVersions.v1),
            // fee from getDeclareEstimateFee use t.v. instead of feet.v.
            ...details
          };
        }
        return {
          type: invocation.type,
          contract_class: invocation.contract,
          compiled_class_hash: invocation.compiledClassHash,
          sender_address: invocation.senderAddress,
          version: toHex(invocation.version || defaultVersions.v2),
          // fee on getDeclareEstimateFee use t.v. instead of feet.v.
          ...details
        };
      }
      if (invocation.type === "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */) {
        return {
          type: invocation.type,
          constructor_calldata: CallData.compile(invocation.constructorCalldata || []),
          class_hash: toHex(invocation.classHash),
          contract_address_salt: toHex(invocation.addressSalt || 0),
          version: toHex(invocation.version || defaultVersions.v1),
          ...details
        };
      }
      throw Error("Sequencer buildTransaction received unknown TransactionType");
    }
  };

  // src/provider/default.ts
  var Provider = class {
    constructor(providerOrOptions) {
      if (providerOrOptions instanceof Provider) {
        this.provider = providerOrOptions.provider;
      } else if (providerOrOptions instanceof RpcProvider || providerOrOptions instanceof SequencerProvider) {
        this.provider = providerOrOptions;
      } else if (providerOrOptions && "rpc" in providerOrOptions) {
        this.provider = new RpcProvider(providerOrOptions.rpc);
      } else if (providerOrOptions && "sequencer" in providerOrOptions) {
        this.provider = new SequencerProvider(providerOrOptions.sequencer);
      } else {
        this.provider = new SequencerProvider();
      }
    }
    async getChainId() {
      return this.provider.getChainId();
    }
    async getBlock(blockIdentifier) {
      return this.provider.getBlock(blockIdentifier);
    }
    async getClassAt(contractAddress, blockIdentifier) {
      return this.provider.getClassAt(contractAddress, blockIdentifier);
    }
    async getClassHashAt(contractAddress, blockIdentifier) {
      return this.provider.getClassHashAt(contractAddress, blockIdentifier);
    }
    getClassByHash(classHash) {
      return this.provider.getClassByHash(classHash);
    }
    async getEstimateFee(invocationWithTxType, invocationDetails, blockIdentifier) {
      return this.provider.getEstimateFee(invocationWithTxType, invocationDetails, blockIdentifier);
    }
    async getInvokeEstimateFee(invocationWithTxType, invocationDetails, blockIdentifier, skipValidate) {
      return this.provider.getInvokeEstimateFee(
        invocationWithTxType,
        invocationDetails,
        blockIdentifier,
        skipValidate
      );
    }
    async getEstimateFeeBulk(invocations, options) {
      return this.provider.getEstimateFeeBulk(invocations, options);
    }
    async getNonceForAddress(contractAddress, blockIdentifier) {
      return this.provider.getNonceForAddress(contractAddress, blockIdentifier);
    }
    async getStorageAt(contractAddress, key, blockIdentifier) {
      return this.provider.getStorageAt(contractAddress, key, blockIdentifier);
    }
    async getTransaction(txHash) {
      return this.provider.getTransaction(txHash);
    }
    async getTransactionReceipt(txHash) {
      return this.provider.getTransactionReceipt(txHash);
    }
    async callContract(request, blockIdentifier) {
      return this.provider.callContract(request, blockIdentifier);
    }
    async invokeFunction(functionInvocation, details) {
      return this.provider.invokeFunction(functionInvocation, details);
    }
    async deployAccountContract(payload, details) {
      return this.provider.deployAccountContract(payload, details);
    }
    async declareContract(transaction, details) {
      return this.provider.declareContract(transaction, details);
    }
    async getDeclareEstimateFee(transaction, details, blockIdentifier, skipValidate) {
      return this.provider.getDeclareEstimateFee(transaction, details, blockIdentifier, skipValidate);
    }
    getDeployAccountEstimateFee(transaction, details, blockIdentifier, skipValidate) {
      return this.provider.getDeployAccountEstimateFee(
        transaction,
        details,
        blockIdentifier,
        skipValidate
      );
    }
    async getCode(contractAddress, blockIdentifier) {
      return this.provider.getCode(contractAddress, blockIdentifier);
    }
    async waitForTransaction(txHash, options) {
      return this.provider.waitForTransaction(txHash, options);
    }
    async getSimulateTransaction(invocations, options) {
      return this.provider.getSimulateTransaction(invocations, options);
    }
    async getStateUpdate(blockIdentifier) {
      return this.provider.getStateUpdate(blockIdentifier);
    }
    async getStarkName(address, StarknetIdContract2) {
      return getStarkName(this, address, StarknetIdContract2);
    }
    async getAddressFromStarkName(name, StarknetIdContract2) {
      return getAddressFromStarkName(this, name, StarknetIdContract2);
    }
  };

  // src/signer/interface.ts
  var SignerInterface = class {
  };

  // src/utils/transaction.ts
  var transaction_exports = {};
  __export(transaction_exports, {
    fromCallsToExecuteCalldata: () => fromCallsToExecuteCalldata,
    fromCallsToExecuteCalldataWithNonce: () => fromCallsToExecuteCalldataWithNonce,
    fromCallsToExecuteCalldata_cairo1: () => fromCallsToExecuteCalldata_cairo1,
    getExecuteCalldata: () => getExecuteCalldata,
    transformCallsToMulticallArrays: () => transformCallsToMulticallArrays,
    transformCallsToMulticallArrays_cairo1: () => transformCallsToMulticallArrays_cairo1
  });
  var transformCallsToMulticallArrays = (calls) => {
    const callArray = [];
    const calldata = [];
    calls.forEach((call) => {
      const data = CallData.compile(call.calldata || []);
      callArray.push({
        to: toBigInt(call.contractAddress).toString(10),
        selector: toBigInt(getSelectorFromName(call.entrypoint)).toString(10),
        data_offset: calldata.length.toString(),
        data_len: data.length.toString()
      });
      calldata.push(...data);
    });
    return {
      callArray,
      calldata: CallData.compile({ calldata })
    };
  };
  var fromCallsToExecuteCalldata = (calls) => {
    const { callArray, calldata } = transformCallsToMulticallArrays(calls);
    const compiledCalls = CallData.compile({ callArray });
    return [...compiledCalls, ...calldata];
  };
  var fromCallsToExecuteCalldataWithNonce = (calls, nonce) => {
    return [...fromCallsToExecuteCalldata(calls), toBigInt(nonce).toString()];
  };
  var transformCallsToMulticallArrays_cairo1 = (calls) => {
    const callArray = calls.map((call) => ({
      to: toBigInt(call.contractAddress).toString(10),
      selector: toBigInt(getSelectorFromName(call.entrypoint)).toString(10),
      calldata: CallData.compile(call.calldata || [])
    }));
    return callArray;
  };
  var fromCallsToExecuteCalldata_cairo1 = (calls) => {
    const orderCalls = calls.map((call) => ({
      contractAddress: call.contractAddress,
      entrypoint: call.entrypoint,
      calldata: call.calldata
    }));
    return CallData.compile({ orderCalls });
  };
  var getExecuteCalldata = (calls, cairoVersion = "0") => {
    if (cairoVersion === "1") {
      return fromCallsToExecuteCalldata_cairo1(calls);
    }
    return fromCallsToExecuteCalldata(calls);
  };

  // src/utils/typedData.ts
  var typedData_exports = {};
  __export(typedData_exports, {
    encodeData: () => encodeData,
    encodeType: () => encodeType,
    encodeValue: () => encodeValue,
    getDependencies: () => getDependencies,
    getMessageHash: () => getMessageHash,
    getStructHash: () => getStructHash,
    getTypeHash: () => getTypeHash,
    isMerkleTreeType: () => isMerkleTreeType,
    prepareSelector: () => prepareSelector
  });

  // src/utils/merkle.ts
  var merkle_exports = {};
  __export(merkle_exports, {
    MerkleTree: () => MerkleTree,
    proofMerklePath: () => proofMerklePath
  });
  var MerkleTree = class {
    constructor(leafHashes) {
      this.branches = [];
      this.leaves = leafHashes;
      this.root = this.build(leafHashes);
    }
    /**
     * Create Merkle tree
     * @param leaves hex-string array
     * @returns format: hex-string; Merkle tree root
     */
    build(leaves) {
      if (leaves.length === 1) {
        return leaves[0];
      }
      if (leaves.length !== this.leaves.length) {
        this.branches.push(leaves);
      }
      const newLeaves = [];
      for (let i = 0; i < leaves.length; i += 2) {
        if (i + 1 === leaves.length) {
          newLeaves.push(MerkleTree.hash(leaves[i], "0x0"));
        } else {
          newLeaves.push(MerkleTree.hash(leaves[i], leaves[i + 1]));
        }
      }
      return this.build(newLeaves);
    }
    /**
     * Create pedersen hash from a and b
     * @returns format: hex-string
     */
    static hash(a, b) {
      const [aSorted, bSorted] = [toBigInt(a), toBigInt(b)].sort((x, y) => x >= y ? 1 : -1);
      return esm_exports.pedersen(aSorted, bSorted);
    }
    /**
     * Return path to leaf
     * @param leaf hex-string
     * @param branch hex-string array
     * @param hashPath hex-string array
     * @returns format: hex-string array
     */
    getProof(leaf, branch = this.leaves, hashPath = []) {
      const index = branch.indexOf(leaf);
      if (index === -1) {
        throw new Error("leaf not found");
      }
      if (branch.length === 1) {
        return hashPath;
      }
      const isLeft = index % 2 === 0;
      const neededBranch = (isLeft ? branch[index + 1] : branch[index - 1]) ?? "0x0";
      const newHashPath = [...hashPath, neededBranch];
      const currentBranchLevelIndex = this.leaves.length === branch.length ? -1 : this.branches.findIndex((b) => b.length === branch.length);
      const nextBranch = this.branches[currentBranchLevelIndex + 1] ?? [this.root];
      return this.getProof(
        MerkleTree.hash(isLeft ? leaf : neededBranch, isLeft ? neededBranch : leaf),
        nextBranch,
        newHashPath
      );
    }
  };
  function proofMerklePath(root, leaf, path) {
    if (path.length === 0) {
      return root === leaf;
    }
    const [next, ...rest] = path;
    return proofMerklePath(root, MerkleTree.hash(leaf, next), rest);
  }

  // src/utils/typedData.ts
  function getHex(value) {
    try {
      return toHex(value);
    } catch (e) {
      if (typeof value === "string") {
        return toHex(encodeShortString(value));
      }
      throw new Error(`Invalid BigNumberish: ${value}`);
    }
  }
  var validateTypedData = (data) => {
    const typedData = data;
    const valid = Boolean(typedData.types && typedData.primaryType && typedData.message);
    return valid;
  };
  function prepareSelector(selector) {
    return isHex(selector) ? selector : getSelectorFromName(selector);
  }
  function isMerkleTreeType(type) {
    return type.type === "merkletree";
  }
  var getDependencies = (types, type, dependencies = []) => {
    if (type[type.length - 1] === "*") {
      type = type.slice(0, -1);
    }
    if (dependencies.includes(type)) {
      return dependencies;
    }
    if (!types[type]) {
      return dependencies;
    }
    return [
      type,
      ...types[type].reduce(
        (previous, t) => [
          ...previous,
          ...getDependencies(types, t.type, previous).filter(
            (dependency) => !previous.includes(dependency)
          )
        ],
        []
      )
    ];
  };
  function getMerkleTreeType(types, ctx) {
    if (ctx.parent && ctx.key) {
      const parentType = types[ctx.parent];
      const merkleType = parentType.find((t) => t.name === ctx.key);
      const isMerkleTree = isMerkleTreeType(merkleType);
      if (!isMerkleTree) {
        throw new Error(`${ctx.key} is not a merkle tree`);
      }
      if (merkleType.contains.endsWith("*")) {
        throw new Error(`Merkle tree contain property must not be an array but was given ${ctx.key}`);
      }
      return merkleType.contains;
    }
    return "raw";
  }
  var encodeType = (types, type) => {
    const [primary, ...dependencies] = getDependencies(types, type);
    const newTypes = !primary ? [] : [primary, ...dependencies.sort()];
    return newTypes.map((dependency) => {
      return `${dependency}(${types[dependency].map((t) => `${t.name}:${t.type}`)})`;
    }).join("");
  };
  var getTypeHash = (types, type) => {
    return getSelectorFromName(encodeType(types, type));
  };
  var encodeValue = (types, type, data, ctx = {}) => {
    if (types[type]) {
      return [type, getStructHash(types, type, data)];
    }
    if (Object.keys(types).map((x) => `${x}*`).includes(type)) {
      const structHashes = data.map((struct) => {
        return getStructHash(types, type.slice(0, -1), struct);
      });
      return [type, computeHashOnElements2(structHashes)];
    }
    if (type === "merkletree") {
      const merkleTreeType = getMerkleTreeType(types, ctx);
      const structHashes = data.map((struct) => {
        return encodeValue(types, merkleTreeType, struct)[1];
      });
      const { root } = new MerkleTree(structHashes);
      return ["felt", root];
    }
    if (type === "felt*") {
      return ["felt*", computeHashOnElements2(data)];
    }
    if (type === "selector") {
      return ["felt", prepareSelector(data)];
    }
    return [type, getHex(data)];
  };
  var encodeData = (types, type, data) => {
    const [returnTypes, values] = types[type].reduce(
      ([ts, vs], field) => {
        if (data[field.name] === void 0 || data[field.name] === null) {
          throw new Error(`Cannot encode data: missing data for '${field.name}'`);
        }
        const value = data[field.name];
        const [t, encodedValue] = encodeValue(types, field.type, value, {
          parent: type,
          key: field.name
        });
        return [
          [...ts, t],
          [...vs, encodedValue]
        ];
      },
      [["felt"], [getTypeHash(types, type)]]
    );
    return [returnTypes, values];
  };
  var getStructHash = (types, type, data) => {
    return computeHashOnElements2(encodeData(types, type, data)[1]);
  };
  var getMessageHash = (typedData, account) => {
    if (!validateTypedData(typedData)) {
      throw new Error("Typed data does not match JSON schema");
    }
    const message = [
      encodeShortString("StarkNet Message"),
      getStructHash(typedData.types, "StarkNetDomain", typedData.domain),
      account,
      getStructHash(typedData.types, typedData.primaryType, typedData.message)
    ];
    return computeHashOnElements2(message);
  };

  // src/signer/default.ts
  var Signer = class {
    constructor(pk = esm_exports.utils.randomPrivateKey()) {
      this.pk = pk instanceof Uint8Array ? buf2hex(pk) : toHex(pk);
    }
    async getPubKey() {
      return esm_exports.getStarkKey(this.pk);
    }
    async signMessage(typedData, accountAddress) {
      const msgHash = getMessageHash(typedData, accountAddress);
      return esm_exports.sign(msgHash, this.pk);
    }
    async signTransaction(transactions, transactionsDetail, abis) {
      if (abis && abis.length !== transactions.length) {
        throw new Error("ABI must be provided for each transaction or no transaction");
      }
      const calldata = getExecuteCalldata(transactions, transactionsDetail.cairoVersion);
      const msgHash = calculateTransactionHash(
        transactionsDetail.walletAddress,
        transactionsDetail.version,
        calldata,
        transactionsDetail.maxFee,
        transactionsDetail.chainId,
        transactionsDetail.nonce
      );
      return esm_exports.sign(msgHash, this.pk);
    }
    async signDeployAccountTransaction({
      classHash,
      contractAddress,
      constructorCalldata,
      addressSalt,
      maxFee,
      version,
      chainId,
      nonce
    }) {
      const msgHash = calculateDeployAccountTransactionHash(
        contractAddress,
        classHash,
        CallData.compile(constructorCalldata),
        addressSalt,
        version,
        maxFee,
        chainId,
        nonce
      );
      return esm_exports.sign(msgHash, this.pk);
    }
    async signDeclareTransaction({
      classHash,
      senderAddress,
      chainId,
      maxFee,
      version,
      nonce,
      compiledClassHash
    }) {
      const msgHash = calculateDeclareTransactionHash(
        classHash,
        senderAddress,
        version,
        maxFee,
        chainId,
        nonce,
        compiledClassHash
      );
      return esm_exports.sign(msgHash, this.pk);
    }
  };

  // src/utils/events.ts
  function parseUDCEvent(txReceipt) {
    if (!txReceipt.events) {
      throw new Error("UDC emited event is empty");
    }
    const event = txReceipt.events.find(
      (it) => cleanHex(it.from_address) === cleanHex(UDC.ADDRESS)
    ) || {
      data: []
    };
    return {
      transaction_hash: txReceipt.transaction_hash,
      contract_address: event.data[0],
      address: event.data[0],
      deployer: event.data[1],
      unique: event.data[2],
      classHash: event.data[3],
      calldata_len: event.data[4],
      calldata: event.data.slice(5, 5 + parseInt(event.data[4], 16)),
      salt: event.data[event.data.length - 1]
    };
  }

  // src/account/default.ts
  var Account = class extends Provider {
    constructor(providerOrOptions, address, pkOrSigner, cairoVersion = "0") {
      super(providerOrOptions);
      this.deploySelf = this.deployAccount;
      this.address = address.toLowerCase();
      this.signer = typeof pkOrSigner === "string" || pkOrSigner instanceof Uint8Array ? new Signer(pkOrSigner) : pkOrSigner;
      this.cairoVersion = cairoVersion.toString();
    }
    async getNonce(blockIdentifier) {
      return super.getNonceForAddress(this.address, blockIdentifier);
    }
    async getNonceSafe(nonce) {
      try {
        return toBigInt(nonce ?? await this.getNonce());
      } catch (error) {
        return 0n;
      }
    }
    async estimateFee(calls, estimateFeeDetails) {
      return this.estimateInvokeFee(calls, estimateFeeDetails);
    }
    async estimateInvokeFee(calls, { nonce: providedNonce, blockIdentifier, skipValidate } = {}) {
      const transactions = Array.isArray(calls) ? calls : [calls];
      const nonce = toBigInt(providedNonce ?? await this.getNonce());
      const version = toBigInt(feeTransactionVersion);
      const chainId = await this.getChainId();
      const signerDetails = {
        walletAddress: this.address,
        nonce,
        maxFee: ZERO,
        version,
        chainId,
        cairoVersion: this.cairoVersion
      };
      const invocation = await this.buildInvocation(transactions, signerDetails);
      const response = await super.getInvokeEstimateFee(
        { ...invocation },
        { version, nonce },
        blockIdentifier,
        skipValidate
      );
      const suggestedMaxFee = estimatedFeeToMaxFee(response.overall_fee);
      return {
        ...response,
        suggestedMaxFee
      };
    }
    async estimateDeclareFee({ contract, classHash: providedClassHash, casm, compiledClassHash }, { blockIdentifier, nonce: providedNonce, skipValidate } = {}) {
      const nonce = toBigInt(providedNonce ?? await this.getNonce());
      const version = !isSierra(contract) ? feeTransactionVersion : feeTransactionVersion_2;
      const chainId = await this.getChainId();
      const declareContractTransaction = await this.buildDeclarePayload(
        { classHash: providedClassHash, contract, casm, compiledClassHash },
        {
          nonce,
          chainId,
          version,
          walletAddress: this.address,
          maxFee: ZERO,
          cairoVersion: this.cairoVersion
        }
      );
      const response = await super.getDeclareEstimateFee(
        declareContractTransaction,
        { version, nonce },
        blockIdentifier,
        skipValidate
      );
      const suggestedMaxFee = estimatedFeeToMaxFee(response.overall_fee);
      return {
        ...response,
        suggestedMaxFee
      };
    }
    async estimateAccountDeployFee({
      classHash,
      addressSalt = 0,
      constructorCalldata = [],
      contractAddress: providedContractAddress
    }, { blockIdentifier, skipValidate } = {}) {
      const version = toBigInt(feeTransactionVersion);
      const nonce = ZERO;
      const chainId = await this.getChainId();
      const payload = await this.buildAccountDeployPayload(
        { classHash, addressSalt, constructorCalldata, contractAddress: providedContractAddress },
        {
          nonce,
          chainId,
          version,
          walletAddress: this.address,
          maxFee: ZERO,
          cairoVersion: this.cairoVersion
        }
      );
      const response = await super.getDeployAccountEstimateFee(
        { ...payload },
        { version, nonce },
        blockIdentifier,
        skipValidate
      );
      const suggestedMaxFee = estimatedFeeToMaxFee(response.overall_fee);
      return {
        ...response,
        suggestedMaxFee
      };
    }
    async estimateDeployFee(payload, transactionsDetail) {
      const calls = this.buildUDCContractPayload(payload);
      return this.estimateInvokeFee(calls, transactionsDetail);
    }
    async estimateFeeBulk(invocations, { nonce, blockIdentifier, skipValidate } = {}) {
      const accountInvocations = await this.accountInvocationsFactory(invocations, {
        versions: [feeTransactionVersion, feeTransactionVersion_2],
        nonce,
        blockIdentifier
      });
      const response = await super.getEstimateFeeBulk(accountInvocations, {
        blockIdentifier,
        skipValidate
      });
      return [].concat(response).map((elem) => {
        const suggestedMaxFee = estimatedFeeToMaxFee(elem.overall_fee);
        return {
          ...elem,
          suggestedMaxFee
        };
      });
    }
    async buildInvocation(call, signerDetails) {
      const calldata = getExecuteCalldata(call, this.cairoVersion);
      const signature = await this.signer.signTransaction(call, signerDetails);
      return {
        contractAddress: this.address,
        calldata,
        signature
      };
    }
    async execute(calls, abis = void 0, transactionsDetail = {}) {
      const transactions = Array.isArray(calls) ? calls : [calls];
      const nonce = toBigInt(transactionsDetail.nonce ?? await this.getNonce());
       const maxFee = 0;
    // transactionsDetail.maxFee ?? await this.getSuggestedMaxFee(
    //   { type: "INVOKE_FUNCTION" /* INVOKE */, payload: calls },
    //   transactionsDetail
    // );
      const version = toBigInt(transactionVersion);
      const chainId = await this.getChainId();
      const signerDetails = {
        walletAddress: this.address,
        nonce,
        maxFee,
        version,
        chainId,
        cairoVersion: this.cairoVersion
      };
      const signature = await this.signer.signTransaction(transactions, signerDetails, abis);
      const calldata = getExecuteCalldata(transactions, this.cairoVersion);
      return this.invokeFunction(
        { contractAddress: this.address, calldata, signature },
        {
          nonce,
          maxFee,
          version
        }
      );
    }
    /**
     * First check if contract is already declared, if not declare it
     * If contract already declared returned transaction_hash is ''.
     * Method will pass even if contract is already declared
     * @param transactionsDetail (optional)
     */
    async declareIfNot(payload, transactionsDetail = {}) {
      const declareContractPayload = extractContractHashes(payload);
      try {
        await this.getClassByHash(declareContractPayload.classHash);
      } catch (error) {
        return this.declare(payload, transactionsDetail);
      }
      return {
        transaction_hash: "",
        class_hash: declareContractPayload.classHash
      };
    }
    async declare(payload, transactionsDetail = {}) {
      const declareContractPayload = extractContractHashes(payload);
      const details = {};
      details.nonce = toBigInt(transactionsDetail.nonce ?? await this.getNonce());
      details.maxFee = transactionsDetail.maxFee ?? await this.getSuggestedMaxFee(
        {
          type: "DECLARE" /* DECLARE */,
          payload: declareContractPayload
        },
        transactionsDetail
      );
      details.version = !isSierra(payload.contract) ? transactionVersion : transactionVersion_2;
      details.chainId = await this.getChainId();
      const declareContractTransaction = await this.buildDeclarePayload(declareContractPayload, {
        ...details,
        walletAddress: this.address,
        cairoVersion: this.cairoVersion
      });
      return this.declareContract(declareContractTransaction, details);
    }
    async deploy(payload, details) {
      const params = [].concat(payload).map((it) => {
        const {
          classHash,
          salt,
          unique = true,
          constructorCalldata = []
        } = it;
        const compiledConstructorCallData = CallData.compile(constructorCalldata);
        const deploySalt = salt ?? randomAddress();
        return {
          call: {
            contractAddress: UDC.ADDRESS,
            entrypoint: UDC.ENTRYPOINT,
            calldata: [
              classHash,
              deploySalt,
              toCairoBool(unique),
              compiledConstructorCallData.length,
              ...compiledConstructorCallData
            ]
          },
          address: calculateContractAddressFromHash(
            unique ? esm_exports.pedersen(this.address, deploySalt) : deploySalt,
            classHash,
            compiledConstructorCallData,
            unique ? UDC.ADDRESS : 0
          )
        };
      });
      const calls = params.map((it) => it.call);
      const addresses = params.map((it) => it.address);
      const invokeResponse = await this.execute(calls, void 0, details);
      return {
        ...invokeResponse,
        contract_address: addresses
      };
    }
    async deployContract(payload, details) {
      const deployTx = await this.deploy(payload, details);
      const txReceipt = await this.waitForTransaction(deployTx.transaction_hash);
      return parseUDCEvent(txReceipt);
    }
    async declareAndDeploy(payload, details) {
      const { constructorCalldata, salt, unique } = payload;
      let declare = await this.declareIfNot(payload, details);
      if (declare.transaction_hash !== "") {
        const tx = await this.waitForTransaction(declare.transaction_hash);
        declare = { ...declare, ...tx };
      }
      const deploy = await this.deployContract(
        { classHash: declare.class_hash, salt, unique, constructorCalldata },
        details
      );
      return { declare: { ...declare }, deploy };
    }
    async deployAccount({
      classHash,
      constructorCalldata = [],
      addressSalt = 0,
      contractAddress: providedContractAddress
    }, transactionsDetail = {}) {
      const version = toBigInt(transactionVersion);
      const nonce = ZERO;
      const chainId = await this.getChainId();
      const compiledCalldata = CallData.compile(constructorCalldata);
      const contractAddress = providedContractAddress ?? calculateContractAddressFromHash(addressSalt, classHash, compiledCalldata, 0);
      const maxFee = transactionsDetail.maxFee ?? await this.getSuggestedMaxFee(
        {
          type: "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */,
          payload: {
            classHash,
            constructorCalldata: compiledCalldata,
            addressSalt,
            contractAddress
          }
        },
        transactionsDetail
      );
      const signature = await this.signer.signDeployAccountTransaction({
        classHash,
        constructorCalldata: compiledCalldata,
        contractAddress,
        addressSalt,
        chainId,
        maxFee,
        version,
        nonce
      });
      return this.deployAccountContract(
        { classHash, addressSalt, constructorCalldata, signature },
        {
          nonce,
          maxFee,
          version
        }
      );
    }
    async signMessage(typedData) {
      return this.signer.signMessage(typedData, this.address);
    }
    async hashMessage(typedData) {
      return getMessageHash(typedData, this.address);
    }
    async verifyMessageHash(hash2, signature) {
      try {
        await this.callContract({
          contractAddress: this.address,
          entrypoint: "isValidSignature",
          calldata: CallData.compile({
            hash: toBigInt(hash2).toString(),
            signature: formatSignature(signature)
          })
        });
        return true;
      } catch {
        return false;
      }
    }
    async verifyMessage(typedData, signature) {
      const hash2 = await this.hashMessage(typedData);
      return this.verifyMessageHash(hash2, signature);
    }
    async getSuggestedMaxFee({ type, payload }, details) {
      let feeEstimate;
      switch (type) {
        case "INVOKE_FUNCTION" /* INVOKE */:
          feeEstimate = await this.estimateInvokeFee(payload, details);
          break;
        case "DECLARE" /* DECLARE */:
          feeEstimate = await this.estimateDeclareFee(payload, details);
          break;
        case "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */:
          feeEstimate = await this.estimateAccountDeployFee(payload, details);
          break;
        case "DEPLOY" /* DEPLOY */:
          feeEstimate = await this.estimateDeployFee(payload, details);
          break;
        default:
          feeEstimate = { suggestedMaxFee: ZERO, overall_fee: ZERO };
          break;
      }
      return feeEstimate.suggestedMaxFee;
    }
    /**
     * will be renamed to buildDeclareContractTransaction
     */
    async buildDeclarePayload(payload, { nonce, chainId, version, walletAddress, maxFee }) {
      const { classHash, contract, compiledClassHash } = extractContractHashes(payload);
      const compressedCompiledContract = parseContract(contract);
      const signature = await this.signer.signDeclareTransaction({
        classHash,
        compiledClassHash,
        senderAddress: walletAddress,
        chainId,
        maxFee,
        version,
        nonce
      });
      return {
        senderAddress: walletAddress,
        signature,
        contract: compressedCompiledContract,
        compiledClassHash
      };
    }
    async buildAccountDeployPayload({
      classHash,
      addressSalt = 0,
      constructorCalldata = [],
      contractAddress: providedContractAddress
    }, { nonce, chainId, version, maxFee }) {
      const compiledCalldata = CallData.compile(constructorCalldata);
      const contractAddress = providedContractAddress ?? calculateContractAddressFromHash(addressSalt, classHash, compiledCalldata, 0);
      const signature = await this.signer.signDeployAccountTransaction({
        classHash,
        contractAddress,
        chainId,
        maxFee,
        version,
        nonce,
        addressSalt,
        constructorCalldata: compiledCalldata
      });
      return {
        classHash,
        addressSalt,
        constructorCalldata: compiledCalldata,
        signature
      };
    }
    buildUDCContractPayload(payload) {
      const calls = [].concat(payload).map((it) => {
        const {
          classHash,
          salt = "0",
          unique = true,
          constructorCalldata = []
        } = it;
        const compiledConstructorCallData = CallData.compile(constructorCalldata);
        return {
          contractAddress: UDC.ADDRESS,
          entrypoint: UDC.ENTRYPOINT,
          calldata: [
            classHash,
            salt,
            toCairoBool(unique),
            compiledConstructorCallData.length,
            ...compiledConstructorCallData
          ]
        };
      });
      return calls;
    }
    async simulateTransaction(invocations, { nonce, blockIdentifier, skipValidate, skipExecute } = {}) {
      const accountInvocations = await this.accountInvocationsFactory(invocations, {
        versions: [transactionVersion, transactionVersion_2],
        nonce,
        blockIdentifier
      });
      return super.getSimulateTransaction(accountInvocations, {
        blockIdentifier,
        skipValidate,
        skipExecute
      });
    }
    async accountInvocationsFactory(invocations, { versions, nonce, blockIdentifier }) {
      const version = versions[0];
      const safeNonce = await this.getNonceSafe(nonce);
      const chainId = await this.getChainId();
      return Promise.all(
        [].concat(invocations).map(async (transaction, index) => {
          const signerDetails = {
            walletAddress: this.address,
            nonce: toBigInt(Number(safeNonce) + index),
            maxFee: ZERO,
            version,
            chainId,
            cairoVersion: this.cairoVersion
          };
          const txPayload = "payload" in transaction ? transaction.payload : transaction;
          const common2 = {
            type: transaction.type,
            version,
            nonce: toBigInt(Number(safeNonce) + index),
            blockIdentifier
          };
          if (transaction.type === "INVOKE_FUNCTION" /* INVOKE */) {
            const payload = await this.buildInvocation(
              [].concat(txPayload),
              signerDetails
            );
            return {
              ...common2,
              ...payload
            };
          }
          if (transaction.type === "DECLARE" /* DECLARE */) {
            signerDetails.version = !isSierra(txPayload.contract) ? toBigInt(versions[0]) : toBigInt(versions[1]);
            const payload = await this.buildDeclarePayload(txPayload, signerDetails);
            return {
              ...common2,
              ...payload,
              version: signerDetails.version
            };
          }
          if (transaction.type === "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */) {
            const payload = await this.buildAccountDeployPayload(txPayload, signerDetails);
            return {
              ...common2,
              ...payload
            };
          }
          if (transaction.type === "DEPLOY" /* DEPLOY */) {
            const calls = this.buildUDCContractPayload(txPayload);
            const payload = await this.buildInvocation(calls, signerDetails);
            return {
              ...common2,
              ...payload,
              type: "INVOKE_FUNCTION" /* INVOKE */
            };
          }
          throw Error(`accountInvocationsFactory: unsupported transaction type: ${transaction}`);
        })
      );
    }
    async getStarkName(address = this.address, StarknetIdContract2) {
      return super.getStarkName(address, StarknetIdContract2);
    }
  };

  // src/provider/interface.ts
  var ProviderInterface = class {
  };

  // src/provider/index.ts
  var defaultProvider = new Provider();

  // src/account/interface.ts
  var AccountInterface = class extends ProviderInterface {
  };

  // src/utils/events/index.ts
  var events_exports = {};
  __export(events_exports, {
    getAbiEvents: () => getAbiEvents,
    parseEvents: () => parseEvents
  });
  function getAbiEvents(abi) {
    return abi.filter((abiEntry) => abiEntry.type === "event" && (abiEntry.size || abiEntry.kind !== "enum")).reduce((acc, abiEntry) => {
      const entryName = abiEntry.name.slice(abiEntry.name.lastIndexOf(":") + 1);
      const abiEntryMod = { ...abiEntry };
      abiEntryMod.name = entryName;
      return {
        ...acc,
        [addHexPrefix(esm_exports.keccak(utf8ToArray(entryName)).toString(16))]: abiEntryMod
      };
    }, {});
  }
  function parseEvents(providerReceivedEvents, abiEvents, abiStructs, abiEnums) {
    const ret = providerReceivedEvents.flat().reduce((acc, recEvent) => {
      const abiEvent = abiEvents[recEvent.keys[0]];
      if (!abiEvent) {
        return acc;
      }
      const parsedEvent = {};
      parsedEvent[abiEvent.name] = {};
      recEvent.keys.shift();
      const keysIter = recEvent.keys[Symbol.iterator]();
      const dataIter = recEvent.data[Symbol.iterator]();
      const abiEventKeys = abiEvent.members?.filter((it) => it.kind === "key") || abiEvent.keys;
      const abiEventData = abiEvent.members?.filter((it) => it.kind === "data") || abiEvent.data;
      abiEventKeys.forEach((key) => {
        parsedEvent[abiEvent.name][key.name] = responseParser(
          keysIter,
          key,
          abiStructs,
          abiEnums,
          parsedEvent[abiEvent.name]
        );
      });
      abiEventData.forEach((data) => {
        parsedEvent[abiEvent.name][data.name] = responseParser(
          dataIter,
          data,
          abiStructs,
          abiEnums,
          parsedEvent[abiEvent.name]
        );
      });
      acc.push(parsedEvent);
      return acc;
    }, []);
    return ret;
  }

  // src/contract/default.ts
  var splitArgsAndOptions = (args) => {
    const options = [
      "blockIdentifier",
      "parseRequest",
      "parseResponse",
      "formatResponse",
      "maxFee",
      "nonce",
      "signature",
      "addressSalt"
    ];
    const lastArg = args[args.length - 1];
    if (typeof lastArg === "object" && options.some((x) => x in lastArg)) {
      return { args, options: args.pop() };
    }
    return { args };
  };
  function buildCall(contract, functionAbi) {
    return async function(...args) {
      const params = splitArgsAndOptions(args);
      return contract.call(functionAbi.name, params.args, {
        parseRequest: true,
        parseResponse: true,
        ...params.options
      });
    };
  }
  function buildInvoke(contract, functionAbi) {
    return async function(...args) {
      const params = splitArgsAndOptions(args);
      return contract.invoke(functionAbi.name, params.args, {
        parseRequest: true,
        ...params.options
      });
    };
  }
  function buildDefault(contract, functionAbi) {
    if (functionAbi.stateMutability === "view" || functionAbi.state_mutability === "view") {
      return buildCall(contract, functionAbi);
    }
    return buildInvoke(contract, functionAbi);
  }
  function buildPopulate(contract, functionAbi) {
    return function(...args) {
      return contract.populate(functionAbi.name, args);
    };
  }
  function buildEstimate(contract, functionAbi) {
    return function(...args) {
      return contract.estimate(functionAbi.name, args);
    };
  }
  function getCalldata(args, callback) {
    if (Array.isArray(args) && "__compiled__" in args)
      return args;
    if (Array.isArray(args) && Array.isArray(args[0]) && "__compiled__" in args[0])
      return args[0];
    return callback();
  }
  var Contract = class {
    /**
     * Contract class to handle contract methods
     *
     * @param abi - Abi of the contract object
     * @param address (optional) - address to connect to
     * @param providerOrAccount (optional) - Provider or Account to attach to
     */
    constructor(abi, address, providerOrAccount = defaultProvider) {
      this.address = address && address.toLowerCase();
      this.providerOrAccount = providerOrAccount;
      this.callData = new CallData(abi);
      this.structs = CallData.getAbiStruct(abi);
      this.events = getAbiEvents(abi);
      const parser = createAbiParser(abi);
      this.abi = parser.getLegacyFormat();
      const options = { enumerable: true, value: {}, writable: false };
      Object.defineProperties(this, {
        functions: { enumerable: true, value: {}, writable: false },
        callStatic: { enumerable: true, value: {}, writable: false },
        populateTransaction: { enumerable: true, value: {}, writable: false },
        estimateFee: { enumerable: true, value: {}, writable: false }
      });
      this.abi.forEach((abiElement) => {
        if (abiElement.type !== "function")
          return;
        const signature = abiElement.name;
        if (!this[signature]) {
          Object.defineProperty(this, signature, {
            ...options,
            value: buildDefault(this, abiElement)
          });
        }
        if (!this.functions[signature]) {
          Object.defineProperty(this.functions, signature, {
            ...options,
            value: buildDefault(this, abiElement)
          });
        }
        if (!this.callStatic[signature]) {
          Object.defineProperty(this.callStatic, signature, {
            ...options,
            value: buildCall(this, abiElement)
          });
        }
        if (!this.populateTransaction[signature]) {
          Object.defineProperty(this.populateTransaction, signature, {
            ...options,
            value: buildPopulate(this, abiElement)
          });
        }
        if (!this.estimateFee[signature]) {
          Object.defineProperty(this.estimateFee, signature, {
            ...options,
            value: buildEstimate(this, abiElement)
          });
        }
      });
    }
    attach(address) {
      this.address = address;
    }
    connect(providerOrAccount) {
      this.providerOrAccount = providerOrAccount;
    }
    async deployed() {
      if (this.deployTransactionHash) {
        await this.providerOrAccount.waitForTransaction(this.deployTransactionHash);
        this.deployTransactionHash = void 0;
      }
      return this;
    }
    async call(method, args = [], {
      parseRequest = true,
      parseResponse = true,
      formatResponse = void 0,
      blockIdentifier = void 0
    } = {}) {
      assert(this.address !== null, "contract is not connected to an address");
      const calldata = getCalldata(args, () => {
        if (parseRequest) {
          this.callData.validate("CALL" /* CALL */, method, args);
          return this.callData.compile(method, args);
        }
        console.warn("Call skipped parsing but provided rawArgs, possible malfunction request");
        return args;
      });
      return this.providerOrAccount.callContract(
        {
          contractAddress: this.address,
          calldata,
          entrypoint: method
        },
        blockIdentifier
      ).then((x) => {
        if (!parseResponse) {
          return x.result;
        }
        if (formatResponse) {
          return this.callData.format(method, x.result, formatResponse);
        }
        return this.callData.parse(method, x.result);
      });
    }
    invoke(method, args = [], { parseRequest = true, maxFee, nonce, signature } = {}) {
      assert(this.address !== null, "contract is not connected to an address");
      const calldata = getCalldata(args, () => {
        if (parseRequest) {
          this.callData.validate("INVOKE" /* INVOKE */, method, args);
          return this.callData.compile(method, args);
        }
        console.warn("Invoke skipped parsing but provided rawArgs, possible malfunction request");
        return args;
      });
      const invocation = {
        contractAddress: this.address,
        calldata,
        entrypoint: method
      };
      if ("execute" in this.providerOrAccount) {
        return this.providerOrAccount.execute(invocation, void 0, {
          maxFee,
          nonce
        });
      }
      if (!nonce)
        throw new Error(`Nonce is required when invoking a function without an account`);
      console.warn(`Invoking ${method} without an account. This will not work on a public node.`);
      return this.providerOrAccount.invokeFunction(
        {
          ...invocation,
          signature
        },
        {
          nonce
        }
      );
    }
    async estimate(method, args = []) {
      assert(this.address !== null, "contract is not connected to an address");
      if (!getCalldata(args, () => false)) {
        this.callData.validate("INVOKE" /* INVOKE */, method, args);
      }
      const invocation = this.populate(method, args);
      if ("estimateInvokeFee" in this.providerOrAccount) {
        return this.providerOrAccount.estimateInvokeFee(invocation);
      }
      throw Error("Contract must be connected to the account contract to estimate");
    }
    populate(method, args = []) {
      const calldata = getCalldata(args, () => this.callData.compile(method, args));
      return {
        contractAddress: this.address,
        entrypoint: method,
        calldata
      };
    }
    parseEvents(receipt) {
      return parseEvents(
        receipt.events?.filter(
          (event) => cleanHex(event.from_address) === cleanHex(this.address),
          []
        ) || [],
        this.events,
        this.structs,
        CallData.getAbiEnum(this.abi)
      );
    }
    isCairo1() {
      return cairo_exports.isCairo1Abi(this.abi);
    }
    typed(tAbi) {
      return this;
    }
  };

  // src/contract/interface.ts
  var ContractInterface = class {
  };

  // src/contract/contractFactory.ts
  var ContractFactory = class {
    /**
     * @param params CFParams
     *  - compiledContract: CompiledContract;
     *  - account: AccountInterface;
     *  - casm?: CairoAssembly;
     *  - classHash?: string;
     *  - compiledClassHash?: string;
     *  - abi?: Abi;
     */
    constructor(params) {
      this.compiledContract = params.compiledContract;
      this.account = params.account;
      this.casm = params.casm;
      this.abi = params.abi ?? params.compiledContract.abi;
      this.classHash = params.classHash;
      this.compiledClassHash = params.compiledClassHash;
      this.CallData = new CallData(this.abi);
    }
    /**
     * Deploys contract and returns new instance of the Contract
     *
     * If contract is not declared it will first declare it, and then deploy
     */
    async deploy(...args) {
      const { args: param, options = { parseRequest: true } } = splitArgsAndOptions(args);
      const constructorCalldata = getCalldata(param, () => {
        if (options.parseRequest) {
          this.CallData.validate("DEPLOY" /* DEPLOY */, "constructor", param);
          return this.CallData.compile("constructor", param);
        }
        console.warn("Call skipped parsing but provided rawArgs, possible malfunction request");
        return param;
      });
      const {
        deploy: { contract_address, transaction_hash }
      } = await this.account.declareAndDeploy({
        contract: this.compiledContract,
        casm: this.casm,
        classHash: this.classHash,
        compiledClassHash: this.compiledClassHash,
        constructorCalldata,
        salt: options.addressSalt
      });
      assert(Boolean(contract_address), "Deployment of the contract failed");
      const contractInstance = new Contract(
        this.compiledContract.abi,
        contract_address,
        this.account
      );
      contractInstance.deployTransactionHash = transaction_hash;
      return contractInstance;
    }
    /**
     * Attaches to new Account
     *
     * @param account - new Account to attach to
     */
    connect(account) {
      this.account = account;
      return this;
    }
    /**
     * Attaches current abi and account to the new address
     */
    attach(address) {
      return new Contract(this.abi, address, this.account);
    }
    // ethers.js' getDeployTransaction cant be supported as it requires the account or signer to return a signed transaction which is not possible with the current implementation
  };

  // src/utils/address.ts
  function addAddressPadding(address) {
    return addHexPrefix(removeHexPrefix(toHex(address)).padStart(64, "0"));
  }
  function validateAndParseAddress(address) {
    assertInRange(address, ZERO, MASK_251, "Starknet Address");
    const result = addAddressPadding(address);
    if (!result.match(/^(0x)?[0-9a-fA-F]{64}$/)) {
      throw new Error("Invalid Address Format");
    }
    return result;
  }
  function getChecksumAddress(address) {
    const chars = removeHexPrefix(validateAndParseAddress(address)).toLowerCase().split("");
    const hex = removeHexPrefix(keccakBn(address));
    const hashed = hexToBytes(hex.padStart(64, "0"));
    for (let i = 0; i < chars.length; i += 2) {
      if (hashed[i >> 1] >> 4 >= 8) {
        chars[i] = chars[i].toUpperCase();
      }
      if ((hashed[i >> 1] & 15) >= 8) {
        chars[i + 1] = chars[i + 1].toUpperCase();
      }
    }
    return addHexPrefix(chars.join(""));
  }
  function validateChecksumAddress(address) {
    return getChecksumAddress(address) === address;
  }

  // src/index.ts
  var number2 = num_exports;
  return __toCommonJS(src_exports);
})();
/*! Bundled license information:

@noble/curves/esm/abstract/utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/modular.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/poseidon.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/curve.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/weierstrass.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/_shortw_utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

pako/dist/pako.esm.mjs:
  (*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) *)
*/
//# sourceMappingURL=index.global.js.map