/**
 * Flux v3.1.3
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["FluxUtils"] = factory();
	else
		root["FluxUtils"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	module.exports.Container = __webpack_require__(1);
	module.exports.Mixin = __webpack_require__(11);
	module.exports.ReduceStore = __webpack_require__(12);
	module.exports.Store = __webpack_require__(13);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule FluxContainer
	 * 
	 */

	'use strict';

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== 'function' && superClass !== null) {
	    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var FluxContainerSubscriptions = __webpack_require__(2);
	var React = __webpack_require__(5);

	var invariant = __webpack_require__(4);
	var shallowEqual = __webpack_require__(10);

	var Component = React.Component;

	var DEFAULT_OPTIONS = {
	  pure: true,
	  withProps: false,
	  withContext: false
	};

	/**
	 * A FluxContainer is used to subscribe a react component to multiple stores.
	 * The stores that are used must be returned from a static `getStores()` method.
	 *
	 * The component receives information from the stores via state. The state
	 * is generated using a static `calculateState()` method that each container
	 * must implement. A simple container may look like:
	 *
	 *   class FooContainer extends Component {
	 *     static getStores() {
	 *       return [FooStore];
	 *     }
	 *
	 *     static calculateState() {
	 *       return {
	 *         foo: FooStore.getState(),
	 *       };
	 *     }
	 *
	 *     render() {
	 *       return <FooView {...this.state} />;
	 *     }
	 *   }
	 *
	 *   module.exports = FluxContainer.create(FooContainer);
	 *
	 * Flux container also supports some other, more advanced use cases. If you need
	 * to base your state off of props as well:
	 *
	 *   class FooContainer extends Component {
	 *     ...
	 *
	 *     static calculateState(prevState, props) {
	 *       return {
	 *         foo: FooStore.getSpecificFoo(props.id),
	 *       };
	 *     }
	 *
	 *     ...
	 *   }
	 *
	 *   module.exports = FluxContainer.create(FooContainer, {withProps: true});
	 *
	 * Or if your stores are passed through your props:
	 *
	 *   class FooContainer extends Component {
	 *     ...
	 *
	 *     static getStores(props) {
	 *       const {BarStore, FooStore} = props.stores;
	 *       return [BarStore, FooStore];
	 *     }
	 *
	 *     static calculateState(prevState, props) {
	 *       const {BarStore, FooStore} = props.stores;
	 *       return {
	 *         bar: BarStore.getState(),
	 *         foo: FooStore.getState(),
	 *       };
	 *     }
	 *
	 *     ...
	 *   }
	 *
	 *   module.exports = FluxContainer.create(FooContainer, {withProps: true});
	 */
	function create(Base, options) {
	  enforceInterface(Base);

	  // Construct the options using default, override with user values as necessary.
	  var realOptions = _extends({}, DEFAULT_OPTIONS, options || {});

	  var getState = function getState(state, maybeProps, maybeContext) {
	    var props = realOptions.withProps ? maybeProps : undefined;
	    var context = realOptions.withContext ? maybeContext : undefined;
	    return Base.calculateState(state, props, context);
	  };

	  var getStores = function getStores(maybeProps, maybeContext) {
	    var props = realOptions.withProps ? maybeProps : undefined;
	    var context = realOptions.withContext ? maybeContext : undefined;
	    return Base.getStores(props, context);
	  };

	  // Build the container class.

	  var ContainerClass = (function (_Base) {
	    _inherits(ContainerClass, _Base);

	    function ContainerClass(props, context) {
	      var _this = this;

	      _classCallCheck(this, ContainerClass);

	      _Base.call(this, props, context);
	      this._fluxContainerSubscriptions = new FluxContainerSubscriptions();
	      this._fluxContainerSubscriptions.setStores(getStores(props, context));
	      this._fluxContainerSubscriptions.addListener(function () {
	        _this.setState(function (prevState, currentProps) {
	          return getState(prevState, currentProps, context);
	        });
	      });
	      var calculatedState = getState(undefined, props, context);
	      this.state = _extends({}, this.state || {}, calculatedState);
	    }

	    // Make sure we override shouldComponentUpdate only if the pure option is
	    // specified. We can't override this above because we don't want to override
	    // the default behavior on accident. Super works weird with react ES6 classes.

	    ContainerClass.prototype.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
	      if (_Base.prototype.componentWillReceiveProps) {
	        _Base.prototype.componentWillReceiveProps.call(this, nextProps, nextContext);
	      }

	      if (realOptions.withProps || realOptions.withContext) {
	        // Update both stores and state.
	        this._fluxContainerSubscriptions.setStores(getStores(nextProps, nextContext));
	        this.setState(function (prevState) {
	          return getState(prevState, nextProps, nextContext);
	        });
	      }
	    };

	    ContainerClass.prototype.componentWillUnmount = function componentWillUnmount() {
	      if (_Base.prototype.componentWillUnmount) {
	        _Base.prototype.componentWillUnmount.call(this);
	      }

	      this._fluxContainerSubscriptions.reset();
	    };

	    return ContainerClass;
	  })(Base);

	  var container = realOptions.pure ? createPureComponent(ContainerClass) : ContainerClass;

	  // Update the name of the container before returning
	  var componentName = Base.displayName || Base.name;
	  container.displayName = 'FluxContainer(' + componentName + ')';
	  return container;
	}

	function createPureComponent(BaseComponent) {
	  var PureComponent = (function (_BaseComponent) {
	    _inherits(PureComponent, _BaseComponent);

	    function PureComponent() {
	      _classCallCheck(this, PureComponent);

	      _BaseComponent.apply(this, arguments);
	    }

	    PureComponent.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
	      return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
	    };

	    return PureComponent;
	  })(BaseComponent);

	  return PureComponent;
	}

	function enforceInterface(o) {
	  !o.getStores ?  true ? invariant(false, 'Components that use FluxContainer must implement `static getStores()`') : invariant(false) : undefined;
	  !o.calculateState ?  true ? invariant(false, 'Components that use FluxContainer must implement `static calculateState()`') : invariant(false) : undefined;
	}

	/**
	 * This is a way to connect stores to a functional stateless view. Here's a
	 * simple example:
	 *
	 *   // FooView.js
	 *
	 *   function FooView(props) {
	 *     return <div>{props.value}</div>;
	 *   }
	 *
	 *   module.exports = FooView;
	 *
	 *
	 *   // FooContainer.js
	 *
	 *   function getStores() {
	 *     return [FooStore];
	 *   }
	 *
	 *   function calculateState() {
	 *     return {
	 *       value: FooStore.getState();
	 *     };
	 *   }
	 *
	 *   module.exports = FluxContainer.createFunctional(
	 *     FooView,
	 *     getStores,
	 *     calculateState,
	 *   );
	 *
	 */
	function createFunctional(viewFn, _getStores, _calculateState, options) {
	  var FunctionalContainer = (function (_Component) {
	    _inherits(FunctionalContainer, _Component);

	    function FunctionalContainer() {
	      _classCallCheck(this, FunctionalContainer);

	      _Component.apply(this, arguments);
	    }

	    // Update the name of the component before creating the container.

	    FunctionalContainer.getStores = function getStores(props, context) {
	      return _getStores(props, context);
	    };

	    FunctionalContainer.calculateState = function calculateState(prevState, props, context) {
	      return _calculateState(prevState, props, context);
	    };

	    FunctionalContainer.prototype.render = function render() {
	      return viewFn(this.state);
	    };

	    return FunctionalContainer;
	  })(Component);

	  var viewFnName = viewFn.displayName || viewFn.name || 'FunctionalContainer';
	  FunctionalContainer.displayName = viewFnName;
	  return create(FunctionalContainer, options);
	}

	module.exports = { create: create, createFunctional: createFunctional };

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule FluxContainerSubscriptions
	 * 
	 */

	'use strict';

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	var FluxStoreGroup = __webpack_require__(3);

	function shallowArrayEqual(a, b) {
	  if (a === b) {
	    return true;
	  }
	  if (a.length !== b.length) {
	    return false;
	  }
	  for (var i = 0; i < a.length; i++) {
	    if (a[i] !== b[i]) {
	      return false;
	    }
	  }
	  return true;
	}

	var FluxContainerSubscriptions = (function () {
	  function FluxContainerSubscriptions() {
	    _classCallCheck(this, FluxContainerSubscriptions);

	    this._callbacks = [];
	  }

	  FluxContainerSubscriptions.prototype.setStores = function setStores(stores) {
	    var _this = this;

	    if (this._stores && shallowArrayEqual(this._stores, stores)) {
	      return;
	    }
	    this._stores = stores;
	    this._resetTokens();
	    this._resetStoreGroup();

	    var changed = false;
	    var changedStores = [];

	    if (true) {
	      // Keep track of the stores that changed for debugging purposes only
	      this._tokens = stores.map(function (store) {
	        return store.addListener(function () {
	          changed = true;
	          changedStores.push(store);
	        });
	      });
	    } else {
	      (function () {
	        var setChanged = function setChanged() {
	          changed = true;
	        };
	        _this._tokens = stores.map(function (store) {
	          return store.addListener(setChanged);
	        });
	      })();
	    }

	    var callCallbacks = function callCallbacks() {
	      if (changed) {
	        _this._callbacks.forEach(function (fn) {
	          return fn();
	        });
	        changed = false;
	        if (true) {
	          // Uncomment this to print the stores that changed.
	          // console.log(changedStores);
	          changedStores = [];
	        }
	      }
	    };
	    this._storeGroup = new FluxStoreGroup(stores, callCallbacks);
	  };

	  FluxContainerSubscriptions.prototype.addListener = function addListener(fn) {
	    this._callbacks.push(fn);
	  };

	  FluxContainerSubscriptions.prototype.reset = function reset() {
	    this._resetTokens();
	    this._resetStoreGroup();
	    this._resetCallbacks();
	    this._resetStores();
	  };

	  FluxContainerSubscriptions.prototype._resetTokens = function _resetTokens() {
	    if (this._tokens) {
	      this._tokens.forEach(function (token) {
	        return token.remove();
	      });
	      this._tokens = null;
	    }
	  };

	  FluxContainerSubscriptions.prototype._resetStoreGroup = function _resetStoreGroup() {
	    if (this._storeGroup) {
	      this._storeGroup.release();
	      this._storeGroup = null;
	    }
	  };

	  FluxContainerSubscriptions.prototype._resetStores = function _resetStores() {
	    this._stores = null;
	  };

	  FluxContainerSubscriptions.prototype._resetCallbacks = function _resetCallbacks() {
	    this._callbacks = [];
	  };

	  return FluxContainerSubscriptions;
	})();

	module.exports = FluxContainerSubscriptions;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule FluxStoreGroup
	 * 
	 */

	'use strict';

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	var invariant = __webpack_require__(4);

	/**
	 * FluxStoreGroup allows you to execute a callback on every dispatch after
	 * waiting for each of the given stores.
	 */

	var FluxStoreGroup = (function () {
	  function FluxStoreGroup(stores, callback) {
	    var _this = this;

	    _classCallCheck(this, FluxStoreGroup);

	    this._dispatcher = _getUniformDispatcher(stores);

	    // Precompute store tokens.
	    var storeTokens = stores.map(function (store) {
	      return store.getDispatchToken();
	    });

	    // Register with the dispatcher.
	    this._dispatchToken = this._dispatcher.register(function (payload) {
	      _this._dispatcher.waitFor(storeTokens);
	      callback();
	    });
	  }

	  FluxStoreGroup.prototype.release = function release() {
	    this._dispatcher.unregister(this._dispatchToken);
	  };

	  return FluxStoreGroup;
	})();

	function _getUniformDispatcher(stores) {
	  !(stores && stores.length) ?  true ? invariant(false, 'Must provide at least one store to FluxStoreGroup') : invariant(false) : undefined;
	  var dispatcher = stores[0].getDispatcher();
	  if (true) {
	    for (var _iterator = stores, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	      var _ref;

	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }

	      var store = _ref;

	      !(store.getDispatcher() === dispatcher) ?  true ? invariant(false, 'All stores in a FluxStoreGroup must use the same dispatcher') : invariant(false) : undefined;
	    }
	  }
	  return dispatcher;
	}

	module.exports = FluxStoreGroup;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var validateFormat = function validateFormat(format) {};

	if (true) {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}

	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	if (false) {
	  module.exports = require('./cjs/react.production.min.js');
	} else {
	  module.exports = __webpack_require__(6);
	}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/** @license React v16.13.1
	 * react.development.js
	 *
	 * Copyright (c) Facebook, Inc. and its affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	if (true) {
	  (function () {
	    'use strict';

	    var _assign = __webpack_require__(7);
	    var checkPropTypes = __webpack_require__(8);

	    var ReactVersion = '16.13.1';

	    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
	    // nor polyfill, then a plain number is used for performance.
	    var hasSymbol = typeof Symbol === 'function' && Symbol['for'];
	    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol['for']('react.element') : 0xeac7;
	    var REACT_PORTAL_TYPE = hasSymbol ? Symbol['for']('react.portal') : 0xeaca;
	    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol['for']('react.fragment') : 0xeacb;
	    var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol['for']('react.strict_mode') : 0xeacc;
	    var REACT_PROFILER_TYPE = hasSymbol ? Symbol['for']('react.profiler') : 0xead2;
	    var REACT_PROVIDER_TYPE = hasSymbol ? Symbol['for']('react.provider') : 0xeacd;
	    var REACT_CONTEXT_TYPE = hasSymbol ? Symbol['for']('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
	    var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol['for']('react.concurrent_mode') : 0xeacf;
	    var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol['for']('react.forward_ref') : 0xead0;
	    var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol['for']('react.suspense') : 0xead1;
	    var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol['for']('react.suspense_list') : 0xead8;
	    var REACT_MEMO_TYPE = hasSymbol ? Symbol['for']('react.memo') : 0xead3;
	    var REACT_LAZY_TYPE = hasSymbol ? Symbol['for']('react.lazy') : 0xead4;
	    var REACT_BLOCK_TYPE = hasSymbol ? Symbol['for']('react.block') : 0xead9;
	    var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol['for']('react.fundamental') : 0xead5;
	    var REACT_RESPONDER_TYPE = hasSymbol ? Symbol['for']('react.responder') : 0xead6;
	    var REACT_SCOPE_TYPE = hasSymbol ? Symbol['for']('react.scope') : 0xead7;
	    var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	    var FAUX_ITERATOR_SYMBOL = '@@iterator';
	    function getIteratorFn(maybeIterable) {
	      if (maybeIterable === null || typeof maybeIterable !== 'object') {
	        return null;
	      }

	      var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

	      if (typeof maybeIterator === 'function') {
	        return maybeIterator;
	      }

	      return null;
	    }

	    /**
	     * Keeps track of the current dispatcher.
	     */
	    var ReactCurrentDispatcher = {
	      /**
	       * @internal
	       * @type {ReactComponent}
	       */
	      current: null
	    };

	    /**
	     * Keeps track of the current batch's configuration such as how long an update
	     * should suspend for if it needs to.
	     */
	    var ReactCurrentBatchConfig = {
	      suspense: null
	    };

	    /**
	     * Keeps track of the current owner.
	     *
	     * The current owner is the component who should own any components that are
	     * currently being constructed.
	     */
	    var ReactCurrentOwner = {
	      /**
	       * @internal
	       * @type {ReactComponent}
	       */
	      current: null
	    };

	    var BEFORE_SLASH_RE = /^(.*)[\\\/]/;
	    function describeComponentFrame(name, source, ownerName) {
	      var sourceInfo = '';

	      if (source) {
	        var path = source.fileName;
	        var fileName = path.replace(BEFORE_SLASH_RE, '');

	        {
	          // In DEV, include code for a common special case:
	          // prefer "folder/index.js" instead of just "index.js".
	          if (/^index\./.test(fileName)) {
	            var match = path.match(BEFORE_SLASH_RE);

	            if (match) {
	              var pathBeforeSlash = match[1];

	              if (pathBeforeSlash) {
	                var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
	                fileName = folderName + '/' + fileName;
	              }
	            }
	          }
	        }

	        sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
	      } else if (ownerName) {
	        sourceInfo = ' (created by ' + ownerName + ')';
	      }

	      return '\n    in ' + (name || 'Unknown') + sourceInfo;
	    }

	    var Resolved = 1;
	    function refineResolvedLazyComponent(lazyComponent) {
	      return lazyComponent._status === Resolved ? lazyComponent._result : null;
	    }

	    function getWrappedName(outerType, innerType, wrapperName) {
	      var functionName = innerType.displayName || innerType.name || '';
	      return outerType.displayName || (functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName);
	    }

	    function getComponentName(_x) {
	      var _again = true;

	      _function: while (_again) {
	        var type = _x;
	        _again = false;

	        if (type == null) {
	          // Host root, text node or just invalid type.
	          return null;
	        }

	        {
	          if (typeof type.tag === 'number') {
	            error('Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
	          }
	        }

	        if (typeof type === 'function') {
	          return type.displayName || type.name || null;
	        }

	        if (typeof type === 'string') {
	          return type;
	        }

	        switch (type) {
	          case REACT_FRAGMENT_TYPE:
	            return 'Fragment';

	          case REACT_PORTAL_TYPE:
	            return 'Portal';

	          case REACT_PROFILER_TYPE:
	            return "Profiler";

	          case REACT_STRICT_MODE_TYPE:
	            return 'StrictMode';

	          case REACT_SUSPENSE_TYPE:
	            return 'Suspense';

	          case REACT_SUSPENSE_LIST_TYPE:
	            return 'SuspenseList';
	        }

	        if (typeof type === 'object') {
	          switch (type.$$typeof) {
	            case REACT_CONTEXT_TYPE:
	              return 'Context.Consumer';

	            case REACT_PROVIDER_TYPE:
	              return 'Context.Provider';

	            case REACT_FORWARD_REF_TYPE:
	              return getWrappedName(type, type.render, 'ForwardRef');

	            case REACT_MEMO_TYPE:
	              _x = type.type;
	              _again = true;
	              continue _function;

	            case REACT_BLOCK_TYPE:
	              _x = type.render;
	              _again = true;
	              continue _function;

	            case REACT_LAZY_TYPE:
	              {
	                var thenable = type;
	                var resolvedThenable = refineResolvedLazyComponent(thenable);

	                if (resolvedThenable) {
	                  _x = resolvedThenable;
	                  _again = true;
	                  thenable = resolvedThenable = undefined;
	                  continue _function;
	                }

	                break;
	              }
	          }
	        }

	        return null;
	      }
	    }

	    var ReactDebugCurrentFrame = {};
	    var currentlyValidatingElement = null;
	    function setCurrentlyValidatingElement(element) {
	      {
	        currentlyValidatingElement = element;
	      }
	    }

	    {
	      // Stack implementation injected by the current renderer.
	      ReactDebugCurrentFrame.getCurrentStack = null;

	      ReactDebugCurrentFrame.getStackAddendum = function () {
	        var stack = ''; // Add an extra top frame while an element is being validated

	        if (currentlyValidatingElement) {
	          var name = getComponentName(currentlyValidatingElement.type);
	          var owner = currentlyValidatingElement._owner;
	          stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
	        } // Delegate to the injected renderer-specific implementation

	        var impl = ReactDebugCurrentFrame.getCurrentStack;

	        if (impl) {
	          stack += impl() || '';
	        }

	        return stack;
	      };
	    }

	    /**
	     * Used by act() to track whether you're inside an act() scope.
	     */
	    var IsSomeRendererActing = {
	      current: false
	    };

	    var ReactSharedInternals = {
	      ReactCurrentDispatcher: ReactCurrentDispatcher,
	      ReactCurrentBatchConfig: ReactCurrentBatchConfig,
	      ReactCurrentOwner: ReactCurrentOwner,
	      IsSomeRendererActing: IsSomeRendererActing,
	      // Used by renderers to avoid bundling object-assign twice in UMD bundles:
	      assign: _assign
	    };

	    {
	      _assign(ReactSharedInternals, {
	        // These should not be included in production.
	        ReactDebugCurrentFrame: ReactDebugCurrentFrame,
	        // Shim for React DOM 16.0.0 which still destructured (but not used) this.
	        // TODO: remove in React 17.0.
	        ReactComponentTreeHook: {}
	      });
	    }

	    // by calls to these methods by a Babel plugin.
	    //
	    // In PROD (or in packages without access to React internals),
	    // they are left as they are instead.

	    function warn(format) {
	      {
	        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	          args[_key - 1] = arguments[_key];
	        }

	        printWarning('warn', format, args);
	      }
	    }
	    function error(format) {
	      {
	        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	          args[_key2 - 1] = arguments[_key2];
	        }

	        printWarning('error', format, args);
	      }
	    }

	    function printWarning(level, format, args) {
	      // When changing this logic, you might want to also
	      // update consoleWithStackDev.www.js as well.
	      {
	        var hasExistingStack = args.length > 0 && typeof args[args.length - 1] === 'string' && args[args.length - 1].indexOf('\n    in') === 0;

	        if (!hasExistingStack) {
	          var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
	          var stack = ReactDebugCurrentFrame.getStackAddendum();

	          if (stack !== '') {
	            format += '%s';
	            args = args.concat([stack]);
	          }
	        }

	        var argsWithFormat = args.map(function (item) {
	          return '' + item;
	        }); // Careful: RN currently depends on this prefix

	        argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
	        // breaks IE9: https://github.com/facebook/react/issues/13610
	        // eslint-disable-next-line react-internal/no-production-logging

	        Function.prototype.apply.call(console[level], console, argsWithFormat);

	        try {
	          // --- Welcome to debugging React ---
	          // This error was thrown as a convenience so that you can use this stack
	          // to find the callsite that caused this warning to fire.
	          var argIndex = 0;
	          var message = 'Warning: ' + format.replace(/%s/g, function () {
	            return args[argIndex++];
	          });
	          throw new Error(message);
	        } catch (x) {}
	      }
	    }

	    var didWarnStateUpdateForUnmountedComponent = {};

	    function warnNoop(publicInstance, callerName) {
	      {
	        var _constructor = publicInstance.constructor;
	        var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
	        var warningKey = componentName + "." + callerName;

	        if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
	          return;
	        }

	        error("Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);

	        didWarnStateUpdateForUnmountedComponent[warningKey] = true;
	      }
	    }
	    /**
	     * This is the abstract API for an update queue.
	     */

	    var ReactNoopUpdateQueue = {
	      /**
	       * Checks whether or not this composite component is mounted.
	       * @param {ReactClass} publicInstance The instance we want to test.
	       * @return {boolean} True if mounted, false otherwise.
	       * @protected
	       * @final
	       */
	      isMounted: function isMounted(publicInstance) {
	        return false;
	      },

	      /**
	       * Forces an update. This should only be invoked when it is known with
	       * certainty that we are **not** in a DOM transaction.
	       *
	       * You may want to call this when you know that some deeper aspect of the
	       * component's state has changed but `setState` was not called.
	       *
	       * This will not invoke `shouldComponentUpdate`, but it will invoke
	       * `componentWillUpdate` and `componentDidUpdate`.
	       *
	       * @param {ReactClass} publicInstance The instance that should rerender.
	       * @param {?function} callback Called after component is updated.
	       * @param {?string} callerName name of the calling function in the public API.
	       * @internal
	       */
	      enqueueForceUpdate: function enqueueForceUpdate(publicInstance, callback, callerName) {
	        warnNoop(publicInstance, 'forceUpdate');
	      },

	      /**
	       * Replaces all of the state. Always use this or `setState` to mutate state.
	       * You should treat `this.state` as immutable.
	       *
	       * There is no guarantee that `this.state` will be immediately updated, so
	       * accessing `this.state` after calling this method may return the old value.
	       *
	       * @param {ReactClass} publicInstance The instance that should rerender.
	       * @param {object} completeState Next state.
	       * @param {?function} callback Called after component is updated.
	       * @param {?string} callerName name of the calling function in the public API.
	       * @internal
	       */
	      enqueueReplaceState: function enqueueReplaceState(publicInstance, completeState, callback, callerName) {
	        warnNoop(publicInstance, 'replaceState');
	      },

	      /**
	       * Sets a subset of the state. This only exists because _pendingState is
	       * internal. This provides a merging strategy that is not available to deep
	       * properties which is confusing. TODO: Expose pendingState or don't use it
	       * during the merge.
	       *
	       * @param {ReactClass} publicInstance The instance that should rerender.
	       * @param {object} partialState Next partial state to be merged with state.
	       * @param {?function} callback Called after component is updated.
	       * @param {?string} Name of the calling function in the public API.
	       * @internal
	       */
	      enqueueSetState: function enqueueSetState(publicInstance, partialState, callback, callerName) {
	        warnNoop(publicInstance, 'setState');
	      }
	    };

	    var emptyObject = {};

	    {
	      Object.freeze(emptyObject);
	    }
	    /**
	     * Base class helpers for the updating state of a component.
	     */

	    function Component(props, context, updater) {
	      this.props = props;
	      this.context = context; // If a component has string refs, we will assign a different object later.

	      this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
	      // renderer.

	      this.updater = updater || ReactNoopUpdateQueue;
	    }

	    Component.prototype.isReactComponent = {};
	    /**
	     * Sets a subset of the state. Always use this to mutate
	     * state. You should treat `this.state` as immutable.
	     *
	     * There is no guarantee that `this.state` will be immediately updated, so
	     * accessing `this.state` after calling this method may return the old value.
	     *
	     * There is no guarantee that calls to `setState` will run synchronously,
	     * as they may eventually be batched together.  You can provide an optional
	     * callback that will be executed when the call to setState is actually
	     * completed.
	     *
	     * When a function is provided to setState, it will be called at some point in
	     * the future (not synchronously). It will be called with the up to date
	     * component arguments (state, props, context). These values can be different
	     * from this.* because your function may be called after receiveProps but before
	     * shouldComponentUpdate, and this new state, props, and context will not yet be
	     * assigned to this.
	     *
	     * @param {object|function} partialState Next partial state or function to
	     *        produce next partial state to be merged with current state.
	     * @param {?function} callback Called after state is updated.
	     * @final
	     * @protected
	     */

	    Component.prototype.setState = function (partialState, callback) {
	      if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
	        {
	          throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
	        }
	      }

	      this.updater.enqueueSetState(this, partialState, callback, 'setState');
	    };
	    /**
	     * Forces an update. This should only be invoked when it is known with
	     * certainty that we are **not** in a DOM transaction.
	     *
	     * You may want to call this when you know that some deeper aspect of the
	     * component's state has changed but `setState` was not called.
	     *
	     * This will not invoke `shouldComponentUpdate`, but it will invoke
	     * `componentWillUpdate` and `componentDidUpdate`.
	     *
	     * @param {?function} callback Called after update is complete.
	     * @final
	     * @protected
	     */

	    Component.prototype.forceUpdate = function (callback) {
	      this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
	    };
	    /**
	     * Deprecated APIs. These APIs used to exist on classic React classes but since
	     * we would like to deprecate them, we're not going to move them over to this
	     * modern base class. Instead, we define a getter that warns if it's accessed.
	     */

	    {
	      var deprecatedAPIs = {
	        isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
	        replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
	      };

	      var defineDeprecationWarning = function defineDeprecationWarning(methodName, info) {
	        Object.defineProperty(Component.prototype, methodName, {
	          get: function get() {
	            warn('%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);

	            return undefined;
	          }
	        });
	      };

	      for (var fnName in deprecatedAPIs) {
	        if (deprecatedAPIs.hasOwnProperty(fnName)) {
	          defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
	        }
	      }
	    }

	    function ComponentDummy() {}

	    ComponentDummy.prototype = Component.prototype;
	    /**
	     * Convenience component with default shallow equality check for sCU.
	     */

	    function PureComponent(props, context, updater) {
	      this.props = props;
	      this.context = context; // If a component has string refs, we will assign a different object later.

	      this.refs = emptyObject;
	      this.updater = updater || ReactNoopUpdateQueue;
	    }

	    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
	    pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

	    _assign(pureComponentPrototype, Component.prototype);

	    pureComponentPrototype.isPureReactComponent = true;

	    // an immutable object with a single mutable value
	    function createRef() {
	      var refObject = {
	        current: null
	      };

	      {
	        Object.seal(refObject);
	      }

	      return refObject;
	    }

	    var hasOwnProperty = Object.prototype.hasOwnProperty;
	    var RESERVED_PROPS = {
	      key: true,
	      ref: true,
	      __self: true,
	      __source: true
	    };
	    var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;

	    {
	      didWarnAboutStringRefs = {};
	    }

	    function hasValidRef(config) {
	      {
	        if (hasOwnProperty.call(config, 'ref')) {
	          var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

	          if (getter && getter.isReactWarning) {
	            return false;
	          }
	        }
	      }

	      return config.ref !== undefined;
	    }

	    function hasValidKey(config) {
	      {
	        if (hasOwnProperty.call(config, 'key')) {
	          var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

	          if (getter && getter.isReactWarning) {
	            return false;
	          }
	        }
	      }

	      return config.key !== undefined;
	    }

	    function defineKeyPropWarningGetter(props, displayName) {
	      var warnAboutAccessingKey = function warnAboutAccessingKey() {
	        {
	          if (!specialPropKeyWarningShown) {
	            specialPropKeyWarningShown = true;

	            error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
	          }
	        }
	      };

	      warnAboutAccessingKey.isReactWarning = true;
	      Object.defineProperty(props, 'key', {
	        get: warnAboutAccessingKey,
	        configurable: true
	      });
	    }

	    function defineRefPropWarningGetter(props, displayName) {
	      var warnAboutAccessingRef = function warnAboutAccessingRef() {
	        {
	          if (!specialPropRefWarningShown) {
	            specialPropRefWarningShown = true;

	            error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
	          }
	        }
	      };

	      warnAboutAccessingRef.isReactWarning = true;
	      Object.defineProperty(props, 'ref', {
	        get: warnAboutAccessingRef,
	        configurable: true
	      });
	    }

	    function warnIfStringRefCannotBeAutoConverted(config) {
	      {
	        if (typeof config.ref === 'string' && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
	          var componentName = getComponentName(ReactCurrentOwner.current.type);

	          if (!didWarnAboutStringRefs[componentName]) {
	            error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://fb.me/react-strict-mode-string-ref', getComponentName(ReactCurrentOwner.current.type), config.ref);

	            didWarnAboutStringRefs[componentName] = true;
	          }
	        }
	      }
	    }
	    /**
	     * Factory method to create a new React element. This no longer adheres to
	     * the class pattern, so do not use new to call it. Also, instanceof check
	     * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
	     * if something is a React Element.
	     *
	     * @param {*} type
	     * @param {*} props
	     * @param {*} key
	     * @param {string|object} ref
	     * @param {*} owner
	     * @param {*} self A *temporary* helper to detect places where `this` is
	     * different from the `owner` when React.createElement is called, so that we
	     * can warn. We want to get rid of owner and replace string `ref`s with arrow
	     * functions, and as long as `this` and owner are the same, there will be no
	     * change in behavior.
	     * @param {*} source An annotation object (added by a transpiler or otherwise)
	     * indicating filename, line number, and/or other information.
	     * @internal
	     */

	    var ReactElement = function ReactElement(type, key, ref, self, source, owner, props) {
	      var element = {
	        // This tag allows us to uniquely identify this as a React Element
	        $$typeof: REACT_ELEMENT_TYPE,
	        // Built-in properties that belong on the element
	        type: type,
	        key: key,
	        ref: ref,
	        props: props,
	        // Record the component responsible for creating this element.
	        _owner: owner
	      };

	      {
	        // The validation flag is currently mutative. We put it on
	        // an external backing store so that we can freeze the whole object.
	        // This can be replaced with a WeakMap once they are implemented in
	        // commonly used development environments.
	        element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
	        // the validation flag non-enumerable (where possible, which should
	        // include every environment we run tests in), so the test framework
	        // ignores it.

	        Object.defineProperty(element._store, 'validated', {
	          configurable: false,
	          enumerable: false,
	          writable: true,
	          value: false
	        }); // self and source are DEV only properties.

	        Object.defineProperty(element, '_self', {
	          configurable: false,
	          enumerable: false,
	          writable: false,
	          value: self
	        }); // Two elements created in two different places should be considered
	        // equal for testing purposes and therefore we hide it from enumeration.

	        Object.defineProperty(element, '_source', {
	          configurable: false,
	          enumerable: false,
	          writable: false,
	          value: source
	        });

	        if (Object.freeze) {
	          Object.freeze(element.props);
	          Object.freeze(element);
	        }
	      }

	      return element;
	    };
	    /**
	     * Create and return a new ReactElement of the given type.
	     * See https://reactjs.org/docs/react-api.html#createelement
	     */

	    function createElement(type, config, children) {
	      var propName; // Reserved names are extracted

	      var props = {};
	      var key = null;
	      var ref = null;
	      var self = null;
	      var source = null;

	      if (config != null) {
	        if (hasValidRef(config)) {
	          ref = config.ref;

	          {
	            warnIfStringRefCannotBeAutoConverted(config);
	          }
	        }

	        if (hasValidKey(config)) {
	          key = '' + config.key;
	        }

	        self = config.__self === undefined ? null : config.__self;
	        source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

	        for (propName in config) {
	          if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
	            props[propName] = config[propName];
	          }
	        }
	      } // Children can be more than one argument, and those are transferred onto
	      // the newly allocated props object.

	      var childrenLength = arguments.length - 2;

	      if (childrenLength === 1) {
	        props.children = children;
	      } else if (childrenLength > 1) {
	        var childArray = Array(childrenLength);

	        for (var i = 0; i < childrenLength; i++) {
	          childArray[i] = arguments[i + 2];
	        }

	        {
	          if (Object.freeze) {
	            Object.freeze(childArray);
	          }
	        }

	        props.children = childArray;
	      } // Resolve default props

	      if (type && type.defaultProps) {
	        var defaultProps = type.defaultProps;

	        for (propName in defaultProps) {
	          if (props[propName] === undefined) {
	            props[propName] = defaultProps[propName];
	          }
	        }
	      }

	      {
	        if (key || ref) {
	          var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

	          if (key) {
	            defineKeyPropWarningGetter(props, displayName);
	          }

	          if (ref) {
	            defineRefPropWarningGetter(props, displayName);
	          }
	        }
	      }

	      return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
	    }
	    function cloneAndReplaceKey(oldElement, newKey) {
	      var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
	      return newElement;
	    }
	    /**
	     * Clone and return a new ReactElement using element as the starting point.
	     * See https://reactjs.org/docs/react-api.html#cloneelement
	     */

	    function cloneElement(element, config, children) {
	      if (!!(element === null || element === undefined)) {
	        {
	          throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
	        }
	      }

	      var propName; // Original props are copied

	      var props = _assign({}, element.props); // Reserved names are extracted

	      var key = element.key;
	      var ref = element.ref; // Self is preserved since the owner is preserved.

	      var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
	      // transpiler, and the original source is probably a better indicator of the
	      // true owner.

	      var source = element._source; // Owner will be preserved, unless ref is overridden

	      var owner = element._owner;

	      if (config != null) {
	        if (hasValidRef(config)) {
	          // Silently steal the ref from the parent.
	          ref = config.ref;
	          owner = ReactCurrentOwner.current;
	        }

	        if (hasValidKey(config)) {
	          key = '' + config.key;
	        } // Remaining properties override existing props

	        var defaultProps;

	        if (element.type && element.type.defaultProps) {
	          defaultProps = element.type.defaultProps;
	        }

	        for (propName in config) {
	          if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
	            if (config[propName] === undefined && defaultProps !== undefined) {
	              // Resolve default props
	              props[propName] = defaultProps[propName];
	            } else {
	              props[propName] = config[propName];
	            }
	          }
	        }
	      } // Children can be more than one argument, and those are transferred onto
	      // the newly allocated props object.

	      var childrenLength = arguments.length - 2;

	      if (childrenLength === 1) {
	        props.children = children;
	      } else if (childrenLength > 1) {
	        var childArray = Array(childrenLength);

	        for (var i = 0; i < childrenLength; i++) {
	          childArray[i] = arguments[i + 2];
	        }

	        props.children = childArray;
	      }

	      return ReactElement(element.type, key, ref, self, source, owner, props);
	    }
	    /**
	     * Verifies the object is a ReactElement.
	     * See https://reactjs.org/docs/react-api.html#isvalidelement
	     * @param {?object} object
	     * @return {boolean} True if `object` is a ReactElement.
	     * @final
	     */

	    function isValidElement(object) {
	      return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
	    }

	    var SEPARATOR = '.';
	    var SUBSEPARATOR = ':';
	    /**
	     * Escape and wrap key so it is safe to use as a reactid
	     *
	     * @param {string} key to be escaped.
	     * @return {string} the escaped key.
	     */

	    function escape(key) {
	      var escapeRegex = /[=:]/g;
	      var escaperLookup = {
	        '=': '=0',
	        ':': '=2'
	      };
	      var escapedString = ('' + key).replace(escapeRegex, function (match) {
	        return escaperLookup[match];
	      });
	      return '$' + escapedString;
	    }
	    /**
	     * TODO: Test that a single child and an array with one item have the same key
	     * pattern.
	     */

	    var didWarnAboutMaps = false;
	    var userProvidedKeyEscapeRegex = /\/+/g;

	    function escapeUserProvidedKey(text) {
	      return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
	    }

	    var POOL_SIZE = 10;
	    var traverseContextPool = [];

	    function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
	      if (traverseContextPool.length) {
	        var traverseContext = traverseContextPool.pop();
	        traverseContext.result = mapResult;
	        traverseContext.keyPrefix = keyPrefix;
	        traverseContext.func = mapFunction;
	        traverseContext.context = mapContext;
	        traverseContext.count = 0;
	        return traverseContext;
	      } else {
	        return {
	          result: mapResult,
	          keyPrefix: keyPrefix,
	          func: mapFunction,
	          context: mapContext,
	          count: 0
	        };
	      }
	    }

	    function releaseTraverseContext(traverseContext) {
	      traverseContext.result = null;
	      traverseContext.keyPrefix = null;
	      traverseContext.func = null;
	      traverseContext.context = null;
	      traverseContext.count = 0;

	      if (traverseContextPool.length < POOL_SIZE) {
	        traverseContextPool.push(traverseContext);
	      }
	    }
	    /**
	     * @param {?*} children Children tree container.
	     * @param {!string} nameSoFar Name of the key path so far.
	     * @param {!function} callback Callback to invoke with each child found.
	     * @param {?*} traverseContext Used to pass information throughout the traversal
	     * process.
	     * @return {!number} The number of children in this subtree.
	     */

	    function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
	      var type = typeof children;

	      if (type === 'undefined' || type === 'boolean') {
	        // All of the above are perceived as null.
	        children = null;
	      }

	      var invokeCallback = false;

	      if (children === null) {
	        invokeCallback = true;
	      } else {
	        switch (type) {
	          case 'string':
	          case 'number':
	            invokeCallback = true;
	            break;

	          case 'object':
	            switch (children.$$typeof) {
	              case REACT_ELEMENT_TYPE:
	              case REACT_PORTAL_TYPE:
	                invokeCallback = true;
	            }

	        }
	      }

	      if (invokeCallback) {
	        callback(traverseContext, children, // If it's the only child, treat the name as if it was wrapped in an array
	        // so that it's consistent if the number of children grows.
	        nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
	        return 1;
	      }

	      var child;
	      var nextName;
	      var subtreeCount = 0; // Count of children found in the current subtree.

	      var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

	      if (Array.isArray(children)) {
	        for (var i = 0; i < children.length; i++) {
	          child = children[i];
	          nextName = nextNamePrefix + getComponentKey(child, i);
	          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
	        }
	      } else {
	        var iteratorFn = getIteratorFn(children);

	        if (typeof iteratorFn === 'function') {

	          {
	            // Warn about using Maps as children
	            if (iteratorFn === children.entries) {
	              if (!didWarnAboutMaps) {
	                warn('Using Maps as children is deprecated and will be removed in ' + 'a future major release. Consider converting children to ' + 'an array of keyed ReactElements instead.');
	              }

	              didWarnAboutMaps = true;
	            }
	          }

	          var iterator = iteratorFn.call(children);
	          var step;
	          var ii = 0;

	          while (!(step = iterator.next()).done) {
	            child = step.value;
	            nextName = nextNamePrefix + getComponentKey(child, ii++);
	            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
	          }
	        } else if (type === 'object') {
	          var addendum = '';

	          {
	            addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
	          }

	          var childrenString = '' + children;

	          {
	            {
	              throw Error("Objects are not valid as a React child (found: " + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + ")." + addendum);
	            }
	          }
	        }
	      }

	      return subtreeCount;
	    }
	    /**
	     * Traverses children that are typically specified as `props.children`, but
	     * might also be specified through attributes:
	     *
	     * - `traverseAllChildren(this.props.children, ...)`
	     * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
	     *
	     * The `traverseContext` is an optional argument that is passed through the
	     * entire traversal. It can be used to store accumulations or anything else that
	     * the callback might find relevant.
	     *
	     * @param {?*} children Children tree object.
	     * @param {!function} callback To invoke upon traversing each child.
	     * @param {?*} traverseContext Context for traversal.
	     * @return {!number} The number of children in this subtree.
	     */

	    function traverseAllChildren(children, callback, traverseContext) {
	      if (children == null) {
	        return 0;
	      }

	      return traverseAllChildrenImpl(children, '', callback, traverseContext);
	    }
	    /**
	     * Generate a key string that identifies a component within a set.
	     *
	     * @param {*} component A component that could contain a manual key.
	     * @param {number} index Index that is used if a manual key is not provided.
	     * @return {string}
	     */

	    function getComponentKey(component, index) {
	      // Do some typechecking here since we call this blindly. We want to ensure
	      // that we don't block potential future ES APIs.
	      if (typeof component === 'object' && component !== null && component.key != null) {
	        // Explicit key
	        return escape(component.key);
	      } // Implicit key determined by the index in the set

	      return index.toString(36);
	    }

	    function forEachSingleChild(bookKeeping, child, name) {
	      var func = bookKeeping.func,
	          context = bookKeeping.context;
	      func.call(context, child, bookKeeping.count++);
	    }
	    /**
	     * Iterates through children that are typically specified as `props.children`.
	     *
	     * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
	     *
	     * The provided forEachFunc(child, index) will be called for each
	     * leaf child.
	     *
	     * @param {?*} children Children tree container.
	     * @param {function(*, int)} forEachFunc
	     * @param {*} forEachContext Context for forEachContext.
	     */

	    function forEachChildren(children, forEachFunc, forEachContext) {
	      if (children == null) {
	        return children;
	      }

	      var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
	      traverseAllChildren(children, forEachSingleChild, traverseContext);
	      releaseTraverseContext(traverseContext);
	    }

	    function mapSingleChildIntoContext(bookKeeping, child, childKey) {
	      var result = bookKeeping.result,
	          keyPrefix = bookKeeping.keyPrefix,
	          func = bookKeeping.func,
	          context = bookKeeping.context;
	      var mappedChild = func.call(context, child, bookKeeping.count++);

	      if (Array.isArray(mappedChild)) {
	        mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
	          return c;
	        });
	      } else if (mappedChild != null) {
	        if (isValidElement(mappedChild)) {
	          mappedChild = cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
	          // traverseAllChildren used to do for objects as children
	          keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
	        }

	        result.push(mappedChild);
	      }
	    }

	    function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
	      var escapedPrefix = '';

	      if (prefix != null) {
	        escapedPrefix = escapeUserProvidedKey(prefix) + '/';
	      }

	      var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
	      traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
	      releaseTraverseContext(traverseContext);
	    }
	    /**
	     * Maps children that are typically specified as `props.children`.
	     *
	     * See https://reactjs.org/docs/react-api.html#reactchildrenmap
	     *
	     * The provided mapFunction(child, key, index) will be called for each
	     * leaf child.
	     *
	     * @param {?*} children Children tree container.
	     * @param {function(*, int)} func The map function.
	     * @param {*} context Context for mapFunction.
	     * @return {object} Object containing the ordered map of results.
	     */

	    function mapChildren(children, func, context) {
	      if (children == null) {
	        return children;
	      }

	      var result = [];
	      mapIntoWithKeyPrefixInternal(children, result, null, func, context);
	      return result;
	    }
	    /**
	     * Count the number of children that are typically specified as
	     * `props.children`.
	     *
	     * See https://reactjs.org/docs/react-api.html#reactchildrencount
	     *
	     * @param {?*} children Children tree container.
	     * @return {number} The number of children.
	     */

	    function countChildren(children) {
	      return traverseAllChildren(children, function () {
	        return null;
	      }, null);
	    }
	    /**
	     * Flatten a children object (typically specified as `props.children`) and
	     * return an array with appropriately re-keyed children.
	     *
	     * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
	     */

	    function toArray(children) {
	      var result = [];
	      mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
	        return child;
	      });
	      return result;
	    }
	    /**
	     * Returns the first child in a collection of children and verifies that there
	     * is only one child in the collection.
	     *
	     * See https://reactjs.org/docs/react-api.html#reactchildrenonly
	     *
	     * The current implementation of this function assumes that a single child gets
	     * passed without a wrapper, but the purpose of this helper function is to
	     * abstract away the particular structure of children.
	     *
	     * @param {?object} children Child collection structure.
	     * @return {ReactElement} The first and only `ReactElement` contained in the
	     * structure.
	     */

	    function onlyChild(children) {
	      if (!isValidElement(children)) {
	        {
	          throw Error("React.Children.only expected to receive a single React element child.");
	        }
	      }

	      return children;
	    }

	    function createContext(defaultValue, calculateChangedBits) {
	      if (calculateChangedBits === undefined) {
	        calculateChangedBits = null;
	      } else {
	        {
	          if (calculateChangedBits !== null && typeof calculateChangedBits !== 'function') {
	            error('createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits);
	          }
	        }
	      }

	      var context = {
	        $$typeof: REACT_CONTEXT_TYPE,
	        _calculateChangedBits: calculateChangedBits,
	        // As a workaround to support multiple concurrent renderers, we categorize
	        // some renderers as primary and others as secondary. We only expect
	        // there to be two concurrent renderers at most: React Native (primary) and
	        // Fabric (secondary); React DOM (primary) and React ART (secondary).
	        // Secondary renderers store their context values on separate fields.
	        _currentValue: defaultValue,
	        _currentValue2: defaultValue,
	        // Used to track how many concurrent renderers this context currently
	        // supports within in a single renderer. Such as parallel server rendering.
	        _threadCount: 0,
	        // These are circular
	        Provider: null,
	        Consumer: null
	      };
	      context.Provider = {
	        $$typeof: REACT_PROVIDER_TYPE,
	        _context: context
	      };
	      var hasWarnedAboutUsingNestedContextConsumers = false;
	      var hasWarnedAboutUsingConsumerProvider = false;

	      {
	        // A separate object, but proxies back to the original context object for
	        // backwards compatibility. It has a different $$typeof, so we can properly
	        // warn for the incorrect usage of Context as a Consumer.
	        var Consumer = {
	          $$typeof: REACT_CONTEXT_TYPE,
	          _context: context,
	          _calculateChangedBits: context._calculateChangedBits
	        }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here

	        Object.defineProperties(Consumer, {
	          Provider: {
	            get: function get() {
	              if (!hasWarnedAboutUsingConsumerProvider) {
	                hasWarnedAboutUsingConsumerProvider = true;

	                error('Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
	              }

	              return context.Provider;
	            },
	            set: function set(_Provider) {
	              context.Provider = _Provider;
	            }
	          },
	          _currentValue: {
	            get: function get() {
	              return context._currentValue;
	            },
	            set: function set(_currentValue) {
	              context._currentValue = _currentValue;
	            }
	          },
	          _currentValue2: {
	            get: function get() {
	              return context._currentValue2;
	            },
	            set: function set(_currentValue2) {
	              context._currentValue2 = _currentValue2;
	            }
	          },
	          _threadCount: {
	            get: function get() {
	              return context._threadCount;
	            },
	            set: function set(_threadCount) {
	              context._threadCount = _threadCount;
	            }
	          },
	          Consumer: {
	            get: function get() {
	              if (!hasWarnedAboutUsingNestedContextConsumers) {
	                hasWarnedAboutUsingNestedContextConsumers = true;

	                error('Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
	              }

	              return context.Consumer;
	            }
	          }
	        }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

	        context.Consumer = Consumer;
	      }

	      {
	        context._currentRenderer = null;
	        context._currentRenderer2 = null;
	      }

	      return context;
	    }

	    function lazy(ctor) {
	      var lazyType = {
	        $$typeof: REACT_LAZY_TYPE,
	        _ctor: ctor,
	        // React uses these fields to store the result.
	        _status: -1,
	        _result: null
	      };

	      {
	        // In production, this would just set it on the object.
	        var defaultProps;
	        var propTypes;
	        Object.defineProperties(lazyType, {
	          defaultProps: {
	            configurable: true,
	            get: function get() {
	              return defaultProps;
	            },
	            set: function set(newDefaultProps) {
	              error('React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

	              defaultProps = newDefaultProps; // Match production behavior more closely:

	              Object.defineProperty(lazyType, 'defaultProps', {
	                enumerable: true
	              });
	            }
	          },
	          propTypes: {
	            configurable: true,
	            get: function get() {
	              return propTypes;
	            },
	            set: function set(newPropTypes) {
	              error('React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

	              propTypes = newPropTypes; // Match production behavior more closely:

	              Object.defineProperty(lazyType, 'propTypes', {
	                enumerable: true
	              });
	            }
	          }
	        });
	      }

	      return lazyType;
	    }

	    function forwardRef(render) {
	      {
	        if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
	          error('forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
	        } else if (typeof render !== 'function') {
	          error('forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
	        } else {
	          if (render.length !== 0 && render.length !== 2) {
	            error('forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.');
	          }
	        }

	        if (render != null) {
	          if (render.defaultProps != null || render.propTypes != null) {
	            error('forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?');
	          }
	        }
	      }

	      return {
	        $$typeof: REACT_FORWARD_REF_TYPE,
	        render: render
	      };
	    }

	    function isValidElementType(type) {
	      return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
	      type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
	    }

	    function memo(type, compare) {
	      {
	        if (!isValidElementType(type)) {
	          error('memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
	        }
	      }

	      return {
	        $$typeof: REACT_MEMO_TYPE,
	        type: type,
	        compare: compare === undefined ? null : compare
	      };
	    }

	    function resolveDispatcher() {
	      var dispatcher = ReactCurrentDispatcher.current;

	      if (!(dispatcher !== null)) {
	        {
	          throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.");
	        }
	      }

	      return dispatcher;
	    }

	    function useContext(Context, unstable_observedBits) {
	      var dispatcher = resolveDispatcher();

	      {
	        if (unstable_observedBits !== undefined) {
	          error('useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://fb.me/rules-of-hooks' : '');
	        } // TODO: add a more generic warning for invalid values.

	        if (Context._context !== undefined) {
	          var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
	          // and nobody should be using this in existing code.

	          if (realContext.Consumer === Context) {
	            error('Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
	          } else if (realContext.Provider === Context) {
	            error('Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
	          }
	        }
	      }

	      return dispatcher.useContext(Context, unstable_observedBits);
	    }
	    function useState(initialState) {
	      var dispatcher = resolveDispatcher();
	      return dispatcher.useState(initialState);
	    }
	    function useReducer(reducer, initialArg, init) {
	      var dispatcher = resolveDispatcher();
	      return dispatcher.useReducer(reducer, initialArg, init);
	    }
	    function useRef(initialValue) {
	      var dispatcher = resolveDispatcher();
	      return dispatcher.useRef(initialValue);
	    }
	    function useEffect(create, deps) {
	      var dispatcher = resolveDispatcher();
	      return dispatcher.useEffect(create, deps);
	    }
	    function useLayoutEffect(create, deps) {
	      var dispatcher = resolveDispatcher();
	      return dispatcher.useLayoutEffect(create, deps);
	    }
	    function useCallback(callback, deps) {
	      var dispatcher = resolveDispatcher();
	      return dispatcher.useCallback(callback, deps);
	    }
	    function useMemo(create, deps) {
	      var dispatcher = resolveDispatcher();
	      return dispatcher.useMemo(create, deps);
	    }
	    function useImperativeHandle(ref, create, deps) {
	      var dispatcher = resolveDispatcher();
	      return dispatcher.useImperativeHandle(ref, create, deps);
	    }
	    function useDebugValue(value, formatterFn) {
	      {
	        var dispatcher = resolveDispatcher();
	        return dispatcher.useDebugValue(value, formatterFn);
	      }
	    }

	    var propTypesMisspellWarningShown;

	    {
	      propTypesMisspellWarningShown = false;
	    }

	    function getDeclarationErrorAddendum() {
	      if (ReactCurrentOwner.current) {
	        var name = getComponentName(ReactCurrentOwner.current.type);

	        if (name) {
	          return '\n\nCheck the render method of `' + name + '`.';
	        }
	      }

	      return '';
	    }

	    function getSourceInfoErrorAddendum(source) {
	      if (source !== undefined) {
	        var fileName = source.fileName.replace(/^.*[\\\/]/, '');
	        var lineNumber = source.lineNumber;
	        return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
	      }

	      return '';
	    }

	    function getSourceInfoErrorAddendumForProps(elementProps) {
	      if (elementProps !== null && elementProps !== undefined) {
	        return getSourceInfoErrorAddendum(elementProps.__source);
	      }

	      return '';
	    }
	    /**
	     * Warn if there's no key explicitly set on dynamic arrays of children or
	     * object keys are not valid. This allows us to keep track of children between
	     * updates.
	     */

	    var ownerHasKeyUseWarning = {};

	    function getCurrentComponentErrorInfo(parentType) {
	      var info = getDeclarationErrorAddendum();

	      if (!info) {
	        var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

	        if (parentName) {
	          info = "\n\nCheck the top-level render call using <" + parentName + ">.";
	        }
	      }

	      return info;
	    }
	    /**
	     * Warn if the element doesn't have an explicit key assigned to it.
	     * This element is in an array. The array could grow and shrink or be
	     * reordered. All children that haven't already been validated are required to
	     * have a "key" property assigned to it. Error statuses are cached so a warning
	     * will only be shown once.
	     *
	     * @internal
	     * @param {ReactElement} element Element that requires a key.
	     * @param {*} parentType element's parent's type.
	     */

	    function validateExplicitKey(element, parentType) {
	      if (!element._store || element._store.validated || element.key != null) {
	        return;
	      }

	      element._store.validated = true;
	      var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

	      if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
	        return;
	      }

	      ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
	      // property, it may be the creator of the child that's responsible for
	      // assigning it a key.

	      var childOwner = '';

	      if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
	        // Give the component that originally created this child.
	        childOwner = " It was passed a child from " + getComponentName(element._owner.type) + ".";
	      }

	      setCurrentlyValidatingElement(element);

	      {
	        error('Each child in a list should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
	      }

	      setCurrentlyValidatingElement(null);
	    }
	    /**
	     * Ensure that every element either is passed in a static location, in an
	     * array with an explicit keys property defined, or in an object literal
	     * with valid key property.
	     *
	     * @internal
	     * @param {ReactNode} node Statically passed child of any type.
	     * @param {*} parentType node's parent's type.
	     */

	    function validateChildKeys(node, parentType) {
	      if (typeof node !== 'object') {
	        return;
	      }

	      if (Array.isArray(node)) {
	        for (var i = 0; i < node.length; i++) {
	          var child = node[i];

	          if (isValidElement(child)) {
	            validateExplicitKey(child, parentType);
	          }
	        }
	      } else if (isValidElement(node)) {
	        // This element was passed in a valid location.
	        if (node._store) {
	          node._store.validated = true;
	        }
	      } else if (node) {
	        var iteratorFn = getIteratorFn(node);

	        if (typeof iteratorFn === 'function') {
	          // Entry iterators used to provide implicit keys,
	          // but now we print a separate warning for them later.
	          if (iteratorFn !== node.entries) {
	            var iterator = iteratorFn.call(node);
	            var step;

	            while (!(step = iterator.next()).done) {
	              if (isValidElement(step.value)) {
	                validateExplicitKey(step.value, parentType);
	              }
	            }
	          }
	        }
	      }
	    }
	    /**
	     * Given an element, validate that its props follow the propTypes definition,
	     * provided by the type.
	     *
	     * @param {ReactElement} element
	     */

	    function validatePropTypes(element) {
	      {
	        var type = element.type;

	        if (type === null || type === undefined || typeof type === 'string') {
	          return;
	        }

	        var name = getComponentName(type);
	        var propTypes;

	        if (typeof type === 'function') {
	          propTypes = type.propTypes;
	        } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
	        // Inner props are checked in the reconciler.
	        type.$$typeof === REACT_MEMO_TYPE)) {
	          propTypes = type.propTypes;
	        } else {
	          return;
	        }

	        if (propTypes) {
	          setCurrentlyValidatingElement(element);
	          checkPropTypes(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
	          setCurrentlyValidatingElement(null);
	        } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
	          propTypesMisspellWarningShown = true;

	          error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
	        }

	        if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
	          error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
	        }
	      }
	    }
	    /**
	     * Given a fragment, validate that it can only be provided with fragment props
	     * @param {ReactElement} fragment
	     */

	    function validateFragmentProps(fragment) {
	      {
	        setCurrentlyValidatingElement(fragment);
	        var keys = Object.keys(fragment.props);

	        for (var i = 0; i < keys.length; i++) {
	          var key = keys[i];

	          if (key !== 'children' && key !== 'key') {
	            error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

	            break;
	          }
	        }

	        if (fragment.ref !== null) {
	          error('Invalid attribute `ref` supplied to `React.Fragment`.');
	        }

	        setCurrentlyValidatingElement(null);
	      }
	    }
	    function createElementWithValidation(type, props, children) {
	      var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
	      // succeed and there will likely be errors in render.

	      if (!validType) {
	        var info = '';

	        if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
	          info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
	        }

	        var sourceInfo = getSourceInfoErrorAddendumForProps(props);

	        if (sourceInfo) {
	          info += sourceInfo;
	        } else {
	          info += getDeclarationErrorAddendum();
	        }

	        var typeString;

	        if (type === null) {
	          typeString = 'null';
	        } else if (Array.isArray(type)) {
	          typeString = 'array';
	        } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
	          typeString = "<" + (getComponentName(type.type) || 'Unknown') + " />";
	          info = ' Did you accidentally export a JSX literal instead of a component?';
	        } else {
	          typeString = typeof type;
	        }

	        {
	          error('React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
	        }
	      }

	      var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
	      // TODO: Drop this when these are no longer allowed as the type argument.

	      if (element == null) {
	        return element;
	      } // Skip key warning if the type isn't valid since our key validation logic
	      // doesn't expect a non-string/function type and can throw confusing errors.
	      // We don't want exception behavior to differ between dev and prod.
	      // (Rendering will throw with a helpful message and as soon as the type is
	      // fixed, the key warnings will appear.)

	      if (validType) {
	        for (var i = 2; i < arguments.length; i++) {
	          validateChildKeys(arguments[i], type);
	        }
	      }

	      if (type === REACT_FRAGMENT_TYPE) {
	        validateFragmentProps(element);
	      } else {
	        validatePropTypes(element);
	      }

	      return element;
	    }
	    var didWarnAboutDeprecatedCreateFactory = false;
	    function createFactoryWithValidation(type) {
	      var validatedFactory = createElementWithValidation.bind(null, type);
	      validatedFactory.type = type;

	      {
	        if (!didWarnAboutDeprecatedCreateFactory) {
	          didWarnAboutDeprecatedCreateFactory = true;

	          warn('React.createFactory() is deprecated and will be removed in ' + 'a future major release. Consider using JSX ' + 'or use React.createElement() directly instead.');
	        } // Legacy hook: remove it

	        Object.defineProperty(validatedFactory, 'type', {
	          enumerable: false,
	          get: function get() {
	            warn('Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');

	            Object.defineProperty(this, 'type', {
	              value: type
	            });
	            return type;
	          }
	        });
	      }

	      return validatedFactory;
	    }
	    function cloneElementWithValidation(element, props, children) {
	      var newElement = cloneElement.apply(this, arguments);

	      for (var i = 2; i < arguments.length; i++) {
	        validateChildKeys(arguments[i], newElement.type);
	      }

	      validatePropTypes(newElement);
	      return newElement;
	    }

	    {

	      try {
	        var frozenObject = Object.freeze({});
	        var testMap = new Map([[frozenObject, null]]);
	        var testSet = new Set([frozenObject]); // This is necessary for Rollup to not consider these unused.
	        // https://github.com/rollup/rollup/issues/1771
	        // TODO: we can remove these if Rollup fixes the bug.

	        testMap.set(0, 0);
	        testSet.add(0);
	      } catch (e) {}
	    }

	    var createElement$1 = createElementWithValidation;
	    var cloneElement$1 = cloneElementWithValidation;
	    var createFactory = createFactoryWithValidation;
	    var Children = {
	      map: mapChildren,
	      forEach: forEachChildren,
	      count: countChildren,
	      toArray: toArray,
	      only: onlyChild
	    };

	    exports.Children = Children;
	    exports.Component = Component;
	    exports.Fragment = REACT_FRAGMENT_TYPE;
	    exports.Profiler = REACT_PROFILER_TYPE;
	    exports.PureComponent = PureComponent;
	    exports.StrictMode = REACT_STRICT_MODE_TYPE;
	    exports.Suspense = REACT_SUSPENSE_TYPE;
	    exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
	    exports.cloneElement = cloneElement$1;
	    exports.createContext = createContext;
	    exports.createElement = createElement$1;
	    exports.createFactory = createFactory;
	    exports.createRef = createRef;
	    exports.forwardRef = forwardRef;
	    exports.isValidElement = isValidElement;
	    exports.lazy = lazy;
	    exports.memo = memo;
	    exports.useCallback = useCallback;
	    exports.useContext = useContext;
	    exports.useDebugValue = useDebugValue;
	    exports.useEffect = useEffect;
	    exports.useImperativeHandle = useImperativeHandle;
	    exports.useLayoutEffect = useLayoutEffect;
	    exports.useMemo = useMemo;
	    exports.useReducer = useReducer;
	    exports.useRef = useRef;
	    exports.useState = useState;
	    exports.version = ReactVersion;
	  })();
	}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var printWarning = function printWarning() {};

	if (true) {
	  var ReactPropTypesSecret = __webpack_require__(9);
	  var loggedTypeFailures = {};
	  var has = Function.call.bind(Object.prototype.hasOwnProperty);

	  printWarning = function (text) {
	    var message = 'Warning: ' + text;
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };
	}

	/**
	 * Assert that the values match with the type specs.
	 * Error messages are memorized and will only be shown once.
	 *
	 * @param {object} typeSpecs Map of name to a ReactPropType
	 * @param {object} values Runtime values that need to be type-checked
	 * @param {string} location e.g. "prop", "context", "child context"
	 * @param {string} componentName Name of the component for error messages.
	 * @param {?Function} getStack Returns the component stack.
	 * @private
	 */
	function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
	  if (true) {
	    for (var typeSpecName in typeSpecs) {
	      if (has(typeSpecs, typeSpecName)) {
	        var error;
	        // Prop type validation may throw. In case they do, we don't want to
	        // fail the render phase where it didn't fail before. So we log it.
	        // After these have been cleaned up, we'll let them throw.
	        try {
	          // This is intentionally an invariant that gets caught. It's the same
	          // behavior as without this statement except with a better message.
	          if (typeof typeSpecs[typeSpecName] !== 'function') {
	            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.');
	            err.name = 'Invariant Violation';
	            throw err;
	          }
	          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
	        } catch (ex) {
	          error = ex;
	        }
	        if (error && !(error instanceof Error)) {
	          printWarning((componentName || 'React class') + ': type specification of ' + location + ' `' + typeSpecName + '` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a ' + typeof error + '. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).');
	        }
	        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	          // Only monitor this failure once because there tends to be a lot of the
	          // same error.
	          loggedTypeFailures[error.message] = true;

	          var stack = getStack ? getStack() : '';

	          printWarning('Failed ' + location + ' type: ' + error.message + (stack != null ? stack : ''));
	        }
	      }
	    }
	  }
	}

	/**
	 * Resets warning cache when testing.
	 *
	 * @private
	 */
	checkPropTypes.resetWarningCache = function () {
	  if (true) {
	    loggedTypeFailures = {};
	  }
	};

	module.exports = checkPropTypes;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

	module.exports = ReactPropTypesSecret;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @typechecks
	 * 
	 */

	/*eslint-disable no-self-compare */

	'use strict';

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * inlined Object.is polyfill to avoid requiring consumers ship their own
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	 */
	function is(x, y) {
	  // SameValue algorithm
	  if (x === y) {
	    // Steps 1-5, 7-10
	    // Steps 6.b-6.e: +0 != -0
	    // Added the nonzero y check to make Flow happy, but it is redundant
	    return x !== 0 || y !== 0 || 1 / x === 1 / y;
	  } else {
	    // Step 6.a: NaN == NaN
	    return x !== x && y !== y;
	  }
	}

	/**
	 * Performs equality by iterating through keys on an object and returning false
	 * when any key has values which are not strictly equal between the arguments.
	 * Returns true when the values of all keys are strictly equal.
	 */
	function shallowEqual(objA, objB) {
	  if (is(objA, objB)) {
	    return true;
	  }

	  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
	    return false;
	  }

	  var keysA = Object.keys(objA);
	  var keysB = Object.keys(objB);

	  if (keysA.length !== keysB.length) {
	    return false;
	  }

	  // Test for A's keys different from B.
	  for (var i = 0; i < keysA.length; i++) {
	    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
	      return false;
	    }
	  }

	  return true;
	}

	module.exports = shallowEqual;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule FluxMixinLegacy
	 * 
	 */

	'use strict';

	var FluxStoreGroup = __webpack_require__(3);

	var invariant = __webpack_require__(4);

	/**
	 * `FluxContainer` should be preferred over this mixin, but it requires using
	 * react with classes. So this mixin is provided where it is not yet possible
	 * to convert a container to be a class.
	 *
	 * This mixin should be used for React components that have state based purely
	 * on stores. `this.props` will not be available inside of `calculateState()`.
	 *
	 * This mixin will only `setState` not replace it, so you should always return
	 * every key in your state unless you know what you are doing. Consider this:
	 *
	 *   var Foo = React.createClass({
	 *     mixins: [
	 *       FluxMixinLegacy([FooStore])
	 *     ],
	 *
	 *     statics: {
	 *       calculateState(prevState) {
	 *         if (!prevState) {
	 *           return {
	 *             foo: FooStore.getFoo(),
	 *           };
	 *         }
	 *
	 *         return {
	 *           bar: FooStore.getBar(),
	 *         };
	 *       }
	 *     },
	 *   });
	 *
	 * On the second calculateState when prevState is not null, the state will be
	 * updated to contain the previous foo AND the bar that was just returned. Only
	 * returning bar will not delete foo.
	 *
	 */
	function FluxMixinLegacy(stores) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? { withProps: false } : arguments[1];

	  stores = stores.filter(function (store) {
	    return !!store;
	  });

	  return {
	    getInitialState: function getInitialState() {
	      enforceInterface(this);
	      return options.withProps ? this.constructor.calculateState(null, this.props) : this.constructor.calculateState(null, undefined);
	    },

	    componentWillMount: function componentWillMount() {
	      var _this = this;

	      // This tracks when any store has changed and we may need to update.
	      var changed = false;
	      var setChanged = function setChanged() {
	        changed = true;
	      };

	      // This adds subscriptions to stores. When a store changes all we do is
	      // set changed to true.
	      this._fluxMixinSubscriptions = stores.map(function (store) {
	        return store.addListener(setChanged);
	      });

	      // This callback is called after the dispatch of the relevant stores. If
	      // any have reported a change we update the state, then reset changed.
	      var callback = function callback() {
	        if (changed) {
	          _this.setState(function (prevState) {
	            return options.withProps ? _this.constructor.calculateState(prevState, _this.props) : _this.constructor.calculateState(prevState, undefined);
	          });
	        }
	        changed = false;
	      };
	      this._fluxMixinStoreGroup = new FluxStoreGroup(stores, callback);
	    },

	    componentWillUnmount: function componentWillUnmount() {
	      this._fluxMixinStoreGroup.release();
	      for (var _iterator = this._fluxMixinSubscriptions, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	        var _ref;

	        if (_isArray) {
	          if (_i >= _iterator.length) break;
	          _ref = _iterator[_i++];
	        } else {
	          _i = _iterator.next();
	          if (_i.done) break;
	          _ref = _i.value;
	        }

	        var subscription = _ref;

	        subscription.remove();
	      }
	      this._fluxMixinSubscriptions = [];
	    }
	  };
	}

	function enforceInterface(o) {
	  !o.constructor.calculateState ?  true ? invariant(false, 'Components that use FluxMixinLegacy must implement ' + '`calculateState()` on the statics object') : invariant(false) : undefined;
	}

	module.exports = FluxMixinLegacy;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule FluxReduceStore
	 * 
	 */

	'use strict';

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== 'function' && superClass !== null) {
	    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var FluxStore = __webpack_require__(13);

	var abstractMethod = __webpack_require__(20);
	var invariant = __webpack_require__(4);

	/**
	 * This is the basic building block of a Flux application. All of your stores
	 * should extend this class.
	 *
	 *   class CounterStore extends FluxReduceStore<number> {
	 *     getInitialState(): number {
	 *       return 1;
	 *     }
	 *
	 *     reduce(state: number, action: Object): number {
	 *       switch(action.type) {
	 *         case: 'add':
	 *           return state + action.value;
	 *         case: 'double':
	 *           return state * 2;
	 *         default:
	 *           return state;
	 *       }
	 *     }
	 *   }
	 */

	var FluxReduceStore = (function (_FluxStore) {
	  _inherits(FluxReduceStore, _FluxStore);

	  function FluxReduceStore(dispatcher) {
	    _classCallCheck(this, FluxReduceStore);

	    _FluxStore.call(this, dispatcher);
	    this._state = this.getInitialState();
	  }

	  /**
	   * Getter that exposes the entire state of this store. If your state is not
	   * immutable you should override this and not expose _state directly.
	   */

	  FluxReduceStore.prototype.getState = function getState() {
	    return this._state;
	  };

	  /**
	   * Constructs the initial state for this store. This is called once during
	   * construction of the store.
	   */

	  FluxReduceStore.prototype.getInitialState = function getInitialState() {
	    return abstractMethod('FluxReduceStore', 'getInitialState');
	  };

	  /**
	   * Used to reduce a stream of actions coming from the dispatcher into a
	   * single state object.
	   */

	  FluxReduceStore.prototype.reduce = function reduce(state, action) {
	    return abstractMethod('FluxReduceStore', 'reduce');
	  };

	  /**
	   * Checks if two versions of state are the same. You do not need to override
	   * this if your state is immutable.
	   */

	  FluxReduceStore.prototype.areEqual = function areEqual(one, two) {
	    return one === two;
	  };

	  FluxReduceStore.prototype.__invokeOnDispatch = function __invokeOnDispatch(action) {
	    this.__changed = false;

	    // Reduce the stream of incoming actions to state, update when necessary.
	    var startingState = this._state;
	    var endingState = this.reduce(startingState, action);

	    // This means your ending state should never be undefined.
	    !(endingState !== undefined) ?  true ? invariant(false, '%s returned undefined from reduce(...), did you forget to return ' + 'state in the default case? (use null if this was intentional)', this.constructor.name) : invariant(false) : undefined;

	    if (!this.areEqual(startingState, endingState)) {
	      this._state = endingState;

	      // `__emitChange()` sets `this.__changed` to true and then the actual
	      // change will be fired from the emitter at the end of the dispatch, this
	      // is required in order to support methods like `hasChanged()`
	      this.__emitChange();
	    }

	    if (this.__changed) {
	      this.__emitter.emit(this.__changeEvent);
	    }
	  };

	  return FluxReduceStore;
	})(FluxStore);

	module.exports = FluxReduceStore;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule FluxStore
	 * 
	 */

	'use strict';

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	var _require = __webpack_require__(14);

	var EventEmitter = _require.EventEmitter;

	var invariant = __webpack_require__(4);

	/**
	 * This class represents the most basic functionality for a FluxStore. Do not
	 * extend this store directly; instead extend FluxReduceStore when creating a
	 * new store.
	 */

	var FluxStore = (function () {
	  function FluxStore(dispatcher) {
	    var _this = this;

	    _classCallCheck(this, FluxStore);

	    this.__className = this.constructor.name;

	    this.__changed = false;
	    this.__changeEvent = 'change';
	    this.__dispatcher = dispatcher;
	    this.__emitter = new EventEmitter();
	    this._dispatchToken = dispatcher.register(function (payload) {
	      _this.__invokeOnDispatch(payload);
	    });
	  }

	  FluxStore.prototype.addListener = function addListener(callback) {
	    return this.__emitter.addListener(this.__changeEvent, callback);
	  };

	  FluxStore.prototype.getDispatcher = function getDispatcher() {
	    return this.__dispatcher;
	  };

	  /**
	   * This exposes a unique string to identify each store's registered callback.
	   * This is used with the dispatcher's waitFor method to declaratively depend
	   * on other stores updating themselves first.
	   */

	  FluxStore.prototype.getDispatchToken = function getDispatchToken() {
	    return this._dispatchToken;
	  };

	  /**
	   * Returns whether the store has changed during the most recent dispatch.
	   */

	  FluxStore.prototype.hasChanged = function hasChanged() {
	    !this.__dispatcher.isDispatching() ?  true ? invariant(false, '%s.hasChanged(): Must be invoked while dispatching.', this.__className) : invariant(false) : undefined;
	    return this.__changed;
	  };

	  FluxStore.prototype.__emitChange = function __emitChange() {
	    !this.__dispatcher.isDispatching() ?  true ? invariant(false, '%s.__emitChange(): Must be invoked while dispatching.', this.__className) : invariant(false) : undefined;
	    this.__changed = true;
	  };

	  /**
	   * This method encapsulates all logic for invoking __onDispatch. It should
	   * be used for things like catching changes and emitting them after the
	   * subclass has handled a payload.
	   */

	  FluxStore.prototype.__invokeOnDispatch = function __invokeOnDispatch(payload) {
	    this.__changed = false;
	    this.__onDispatch(payload);
	    if (this.__changed) {
	      this.__emitter.emit(this.__changeEvent);
	    }
	  };

	  /**
	   * The callback that will be registered with the dispatcher during
	   * instantiation. Subclasses must override this method. This callback is the
	   * only way the store receives new data.
	   */

	  FluxStore.prototype.__onDispatch = function __onDispatch(payload) {
	     true ?  true ? invariant(false, '%s has not overridden FluxStore.__onDispatch(), which is required', this.__className) : invariant(false) : undefined;
	  };

	  return FluxStore;
	})();

	module.exports = FluxStore;

	// private

	// protected, available to subclasses

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	var fbemitter = {
	  EventEmitter: __webpack_require__(15),
	  EmitterSubscription: __webpack_require__(16)
	};

	module.exports = fbemitter;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule BaseEventEmitter
	 * @typechecks
	 */

	'use strict';

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	var EmitterSubscription = __webpack_require__(16);
	var EventSubscriptionVendor = __webpack_require__(18);

	var emptyFunction = __webpack_require__(19);
	var invariant = __webpack_require__(4);

	/**
	 * @class BaseEventEmitter
	 * @description
	 * An EventEmitter is responsible for managing a set of listeners and publishing
	 * events to them when it is told that such events happened. In addition to the
	 * data for the given event it also sends a event control object which allows
	 * the listeners/handlers to prevent the default behavior of the given event.
	 *
	 * The emitter is designed to be generic enough to support all the different
	 * contexts in which one might want to emit events. It is a simple multicast
	 * mechanism on top of which extra functionality can be composed. For example, a
	 * more advanced emitter may use an EventHolder and EventFactory.
	 */

	var BaseEventEmitter = (function () {
	  /**
	   * @constructor
	   */

	  function BaseEventEmitter() {
	    _classCallCheck(this, BaseEventEmitter);

	    this._subscriber = new EventSubscriptionVendor();
	    this._currentSubscription = null;
	  }

	  /**
	   * Adds a listener to be invoked when events of the specified type are
	   * emitted. An optional calling context may be provided. The data arguments
	   * emitted will be passed to the listener function.
	   *
	   * TODO: Annotate the listener arg's type. This is tricky because listeners
	   *       can be invoked with varargs.
	   *
	   * @param {string} eventType - Name of the event to listen to
	   * @param {function} listener - Function to invoke when the specified event is
	   *   emitted
	   * @param {*} context - Optional context object to use when invoking the
	   *   listener
	   */

	  BaseEventEmitter.prototype.addListener = function addListener(eventType, listener, context) {
	    return this._subscriber.addSubscription(eventType, new EmitterSubscription(this._subscriber, listener, context));
	  };

	  /**
	   * Similar to addListener, except that the listener is removed after it is
	   * invoked once.
	   *
	   * @param {string} eventType - Name of the event to listen to
	   * @param {function} listener - Function to invoke only once when the
	   *   specified event is emitted
	   * @param {*} context - Optional context object to use when invoking the
	   *   listener
	   */

	  BaseEventEmitter.prototype.once = function once(eventType, listener, context) {
	    var emitter = this;
	    return this.addListener(eventType, function () {
	      emitter.removeCurrentListener();
	      listener.apply(context, arguments);
	    });
	  };

	  /**
	   * Removes all of the registered listeners, including those registered as
	   * listener maps.
	   *
	   * @param {?string} eventType - Optional name of the event whose registered
	   *   listeners to remove
	   */

	  BaseEventEmitter.prototype.removeAllListeners = function removeAllListeners(eventType) {
	    this._subscriber.removeAllSubscriptions(eventType);
	  };

	  /**
	   * Provides an API that can be called during an eventing cycle to remove the
	   * last listener that was invoked. This allows a developer to provide an event
	   * object that can remove the listener (or listener map) during the
	   * invocation.
	   *
	   * If it is called when not inside of an emitting cycle it will throw.
	   *
	   * @throws {Error} When called not during an eventing cycle
	   *
	   * @example
	   *   var subscription = emitter.addListenerMap({
	   *     someEvent: function(data, event) {
	   *       console.log(data);
	   *       emitter.removeCurrentListener();
	   *     }
	   *   });
	   *
	   *   emitter.emit('someEvent', 'abc'); // logs 'abc'
	   *   emitter.emit('someEvent', 'def'); // does not log anything
	   */

	  BaseEventEmitter.prototype.removeCurrentListener = function removeCurrentListener() {
	    !!!this._currentSubscription ?  true ? invariant(false, 'Not in an emitting cycle; there is no current subscription') : invariant(false) : undefined;
	    this._subscriber.removeSubscription(this._currentSubscription);
	  };

	  /**
	   * Returns an array of listeners that are currently registered for the given
	   * event.
	   *
	   * @param {string} eventType - Name of the event to query
	   * @return {array}
	   */

	  BaseEventEmitter.prototype.listeners = function listeners(eventType) /* TODO: Array<EventSubscription> */{
	    var subscriptions = this._subscriber.getSubscriptionsForType(eventType);
	    return subscriptions ? subscriptions.filter(emptyFunction.thatReturnsTrue).map(function (subscription) {
	      return subscription.listener;
	    }) : [];
	  };

	  /**
	   * Emits an event of the given type with the given data. All handlers of that
	   * particular type will be notified.
	   *
	   * @param {string} eventType - Name of the event to emit
	   * @param {*} Arbitrary arguments to be passed to each registered listener
	   *
	   * @example
	   *   emitter.addListener('someEvent', function(message) {
	   *     console.log(message);
	   *   });
	   *
	   *   emitter.emit('someEvent', 'abc'); // logs 'abc'
	   */

	  BaseEventEmitter.prototype.emit = function emit(eventType) {
	    var subscriptions = this._subscriber.getSubscriptionsForType(eventType);
	    if (subscriptions) {
	      var keys = Object.keys(subscriptions);
	      for (var ii = 0; ii < keys.length; ii++) {
	        var key = keys[ii];
	        var subscription = subscriptions[key];
	        // The subscription may have been removed during this event loop.
	        if (subscription) {
	          this._currentSubscription = subscription;
	          this.__emitToSubscription.apply(this, [subscription].concat(Array.prototype.slice.call(arguments)));
	        }
	      }
	      this._currentSubscription = null;
	    }
	  };

	  /**
	   * Provides a hook to override how the emitter emits an event to a specific
	   * subscription. This allows you to set up logging and error boundaries
	   * specific to your environment.
	   *
	   * @param {EmitterSubscription} subscription
	   * @param {string} eventType
	   * @param {*} Arbitrary arguments to be passed to each registered listener
	   */

	  BaseEventEmitter.prototype.__emitToSubscription = function __emitToSubscription(subscription, eventType) {
	    var args = Array.prototype.slice.call(arguments, 2);
	    subscription.listener.apply(subscription.context, args);
	  };

	  return BaseEventEmitter;
	})();

	module.exports = BaseEventEmitter;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 * 
	 * @providesModule EmitterSubscription
	 * @typechecks
	 */

	'use strict';

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== 'function' && superClass !== null) {
	    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var EventSubscription = __webpack_require__(17);

	/**
	 * EmitterSubscription represents a subscription with listener and context data.
	 */

	var EmitterSubscription = (function (_EventSubscription) {
	  _inherits(EmitterSubscription, _EventSubscription);

	  /**
	   * @param {EventSubscriptionVendor} subscriber - The subscriber that controls
	   *   this subscription
	   * @param {function} listener - Function to invoke when the specified event is
	   *   emitted
	   * @param {*} context - Optional context object to use when invoking the
	   *   listener
	   */

	  function EmitterSubscription(subscriber, listener, context) {
	    _classCallCheck(this, EmitterSubscription);

	    _EventSubscription.call(this, subscriber);
	    this.listener = listener;
	    this.context = context;
	  }

	  return EmitterSubscription;
	})(EventSubscription);

	module.exports = EmitterSubscription;

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule EventSubscription
	 * @typechecks
	 */

	'use strict';

	/**
	 * EventSubscription represents a subscription to a particular event. It can
	 * remove its own subscription.
	 */

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	var EventSubscription = (function () {

	  /**
	   * @param {EventSubscriptionVendor} subscriber the subscriber that controls
	   *   this subscription.
	   */

	  function EventSubscription(subscriber) {
	    _classCallCheck(this, EventSubscription);

	    this.subscriber = subscriber;
	  }

	  /**
	   * Removes this subscription from the subscriber that controls it.
	   */

	  EventSubscription.prototype.remove = function remove() {
	    if (this.subscriber) {
	      this.subscriber.removeSubscription(this);
	      this.subscriber = null;
	    }
	  };

	  return EventSubscription;
	})();

	module.exports = EventSubscription;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 * 
	 * @providesModule EventSubscriptionVendor
	 * @typechecks
	 */

	'use strict';

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	var invariant = __webpack_require__(4);

	/**
	 * EventSubscriptionVendor stores a set of EventSubscriptions that are
	 * subscribed to a particular event type.
	 */

	var EventSubscriptionVendor = (function () {
	  function EventSubscriptionVendor() {
	    _classCallCheck(this, EventSubscriptionVendor);

	    this._subscriptionsForType = {};
	    this._currentSubscription = null;
	  }

	  /**
	   * Adds a subscription keyed by an event type.
	   *
	   * @param {string} eventType
	   * @param {EventSubscription} subscription
	   */

	  EventSubscriptionVendor.prototype.addSubscription = function addSubscription(eventType, subscription) {
	    !(subscription.subscriber === this) ?  true ? invariant(false, 'The subscriber of the subscription is incorrectly set.') : invariant(false) : undefined;
	    if (!this._subscriptionsForType[eventType]) {
	      this._subscriptionsForType[eventType] = [];
	    }
	    var key = this._subscriptionsForType[eventType].length;
	    this._subscriptionsForType[eventType].push(subscription);
	    subscription.eventType = eventType;
	    subscription.key = key;
	    return subscription;
	  };

	  /**
	   * Removes a bulk set of the subscriptions.
	   *
	   * @param {?string} eventType - Optional name of the event type whose
	   *   registered supscriptions to remove, if null remove all subscriptions.
	   */

	  EventSubscriptionVendor.prototype.removeAllSubscriptions = function removeAllSubscriptions(eventType) {
	    if (eventType === undefined) {
	      this._subscriptionsForType = {};
	    } else {
	      delete this._subscriptionsForType[eventType];
	    }
	  };

	  /**
	   * Removes a specific subscription. Instead of calling this function, call
	   * `subscription.remove()` directly.
	   *
	   * @param {object} subscription
	   */

	  EventSubscriptionVendor.prototype.removeSubscription = function removeSubscription(subscription) {
	    var eventType = subscription.eventType;
	    var key = subscription.key;

	    var subscriptionsForType = this._subscriptionsForType[eventType];
	    if (subscriptionsForType) {
	      delete subscriptionsForType[key];
	    }
	  };

	  /**
	   * Returns the array of subscriptions that are currently registered for the
	   * given event type.
	   *
	   * Note: This array can be potentially sparse as subscriptions are deleted
	   * from it when they are removed.
	   *
	   * TODO: This returns a nullable array. wat?
	   *
	   * @param {string} eventType
	   * @return {?array}
	   */

	  EventSubscriptionVendor.prototype.getSubscriptionsForType = function getSubscriptionsForType(eventType) {
	    return this._subscriptionsForType[eventType];
	  };

	  return EventSubscriptionVendor;
	})();

	module.exports = EventSubscriptionVendor;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * 
	 */

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	var emptyFunction = function emptyFunction() {};

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule abstractMethod
	 * 
	 */

	'use strict';

	var invariant = __webpack_require__(4);

	function abstractMethod(className, methodName) {
	   true ?  true ? invariant(false, 'Subclasses of %s must override %s() with their own implementation.', className, methodName) : invariant(false) : undefined;
	}

	module.exports = abstractMethod;

/***/ })
/******/ ])
});
;