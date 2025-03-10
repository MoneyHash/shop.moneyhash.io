/*!-----------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.39.0(ff3621a3fa6389873be5412d17554294ea1b0941)
 * Released under the MIT license
 * https://github.com/microsoft/vscode/blob/main/LICENSE.txt
 *-----------------------------------------------------------*/ (function () {
  var X = [
      'require',
      'exports',
      'vs/editor/common/core/range',
      'vs/editor/common/core/position',
      'vs/base/common/errors',
      'vs/base/common/strings',
      'vs/editor/common/core/offsetRange',
      'vs/editor/common/diff/algorithms/diffAlgorithm',
      'vs/base/common/platform',
      'vs/base/common/event',
      'vs/base/common/assert',
      'vs/base/common/lifecycle',
      'vs/base/common/objects',
      'vs/editor/common/core/lineRange',
      'vs/base/common/uri',
      'vs/base/common/functional',
      'vs/base/common/iterator',
      'vs/base/common/linkedList',
      'vs/base/common/diff/diff',
      'vs/base/common/types',
      'vs/base/common/uint',
      'vs/editor/common/core/characterClassifier',
      'vs/editor/common/core/wordHelper',
      'vs/editor/common/diff/linesDiffComputer',
      'vs/base/common/stopwatch',
      'vs/nls',
      'vs/base/common/arrays',
      'vs/base/common/cache',
      'vs/base/common/color',
      'vs/base/common/diff/diffChange',
      'vs/base/common/keyCodes',
      'vs/base/common/lazy',
      'vs/base/common/hash',
      'vs/base/common/codicons',
      'vs/editor/common/core/selection',
      'vs/editor/common/core/wordCharacterClassifier',
      'vs/editor/common/diff/algorithms/joinSequenceDiffs',
      'vs/editor/common/diff/algorithms/myersDiffAlgorithm',
      'vs/editor/common/diff/algorithms/utils',
      'vs/editor/common/diff/algorithms/dynamicProgrammingDiffing',
      'vs/editor/common/diff/smartLinesDiffComputer',
      'vs/editor/common/diff/standardLinesDiffComputer',
      'vs/editor/common/diff/linesDiffComputers',
      'vs/editor/common/languages/defaultDocumentColorsComputer',
      'vs/editor/common/languages/linkComputer',
      'vs/editor/common/languages/supports/inplaceReplaceSupport',
      'vs/editor/common/model',
      'vs/editor/common/model/prefixSumComputer',
      'vs/editor/common/model/mirrorTextModel',
      'vs/editor/common/model/textModelSearch',
      'vs/editor/common/services/unicodeTextModelHighlighter',
      'vs/editor/common/standalone/standaloneEnums',
      'vs/nls!vs/base/common/platform',
      'vs/base/common/process',
      'vs/base/common/path',
      'vs/base/common/cancellation',
      'vs/editor/common/tokenizationRegistry',
      'vs/editor/common/languages',
      'vs/editor/common/services/editorBaseApi',
      'vs/nls!vs/base/common/worker/simpleWorker',
      'vs/base/common/worker/simpleWorker',
      'vs/editor/common/services/editorSimpleWorker',
    ],
    J = function (x) {
      for (var n = [], R = 0, M = x.length; R < M; R++) n[R] = X[x[R]];
      return n;
    };
  const Ee = this,
    Re = typeof global == 'object' ? global : {};
  var ue;
  (function (x) {
    x.global = Ee;
    class n {
      get isWindows() {
        return this._detect(), this._isWindows;
      }
      get isNode() {
        return this._detect(), this._isNode;
      }
      get isElectronRenderer() {
        return this._detect(), this._isElectronRenderer;
      }
      get isWebWorker() {
        return this._detect(), this._isWebWorker;
      }
      get isElectronNodeIntegrationWebWorker() {
        return this._detect(), this._isElectronNodeIntegrationWebWorker;
      }
      constructor() {
        (this._detected = !1),
          (this._isWindows = !1),
          (this._isNode = !1),
          (this._isElectronRenderer = !1),
          (this._isWebWorker = !1),
          (this._isElectronNodeIntegrationWebWorker = !1);
      }
      _detect() {
        this._detected ||
          ((this._detected = !0),
          (this._isWindows = n._isWindows()),
          (this._isNode = typeof module < 'u' && !!module.exports),
          (this._isElectronRenderer =
            typeof process < 'u' &&
            typeof process.versions < 'u' &&
            typeof process.versions.electron < 'u' &&
            process.type === 'renderer'),
          (this._isWebWorker = typeof x.global.importScripts == 'function'),
          (this._isElectronNodeIntegrationWebWorker =
            this._isWebWorker &&
            typeof process < 'u' &&
            typeof process.versions < 'u' &&
            typeof process.versions.electron < 'u' &&
            process.type === 'worker'));
      }
      static _isWindows() {
        return typeof navigator < 'u' &&
          navigator.userAgent &&
          navigator.userAgent.indexOf('Windows') >= 0
          ? !0
          : typeof process < 'u'
          ? process.platform === 'win32'
          : !1;
      }
    }
    x.Environment = n;
  })(ue || (ue = {}));
  var ue;
  (function (x) {
    class n {
      constructor(u, _, S) {
        (this.type = u), (this.detail = _), (this.timestamp = S);
      }
    }
    x.LoaderEvent = n;
    class R {
      constructor(u) {
        this._events = [new n(1, '', u)];
      }
      record(u, _) {
        this._events.push(
          new n(u, _, x.Utilities.getHighPerformanceTimestamp()),
        );
      }
      getEvents() {
        return this._events;
      }
    }
    x.LoaderEventRecorder = R;
    class M {
      record(u, _) {}
      getEvents() {
        return [];
      }
    }
    (M.INSTANCE = new M()), (x.NullLoaderEventRecorder = M);
  })(ue || (ue = {}));
  var ue;
  (function (x) {
    class n {
      static fileUriToFilePath(M, i) {
        if (((i = decodeURI(i).replace(/%23/g, '#')), M)) {
          if (/^file:\/\/\//.test(i)) return i.substr(8);
          if (/^file:\/\//.test(i)) return i.substr(5);
        } else if (/^file:\/\//.test(i)) return i.substr(7);
        return i;
      }
      static startsWith(M, i) {
        return M.length >= i.length && M.substr(0, i.length) === i;
      }
      static endsWith(M, i) {
        return M.length >= i.length && M.substr(M.length - i.length) === i;
      }
      static containsQueryString(M) {
        return /^[^\#]*\?/gi.test(M);
      }
      static isAbsolutePath(M) {
        return /^((http:\/\/)|(https:\/\/)|(file:\/\/)|(\/))/.test(M);
      }
      static forEachProperty(M, i) {
        if (M) {
          let u;
          for (u in M) M.hasOwnProperty(u) && i(u, M[u]);
        }
      }
      static isEmpty(M) {
        let i = !0;
        return (
          n.forEachProperty(M, () => {
            i = !1;
          }),
          i
        );
      }
      static recursiveClone(M) {
        if (
          !M ||
          typeof M != 'object' ||
          M instanceof RegExp ||
          (!Array.isArray(M) && Object.getPrototypeOf(M) !== Object.prototype)
        )
          return M;
        let i = Array.isArray(M) ? [] : {};
        return (
          n.forEachProperty(M, (u, _) => {
            _ && typeof _ == 'object'
              ? (i[u] = n.recursiveClone(_))
              : (i[u] = _);
          }),
          i
        );
      }
      static generateAnonymousModule() {
        return '===anonymous' + n.NEXT_ANONYMOUS_ID++ + '===';
      }
      static isAnonymousModule(M) {
        return n.startsWith(M, '===anonymous');
      }
      static getHighPerformanceTimestamp() {
        return (
          this.PERFORMANCE_NOW_PROBED ||
            ((this.PERFORMANCE_NOW_PROBED = !0),
            (this.HAS_PERFORMANCE_NOW =
              x.global.performance &&
              typeof x.global.performance.now == 'function')),
          this.HAS_PERFORMANCE_NOW ? x.global.performance.now() : Date.now()
        );
      }
    }
    (n.NEXT_ANONYMOUS_ID = 1),
      (n.PERFORMANCE_NOW_PROBED = !1),
      (n.HAS_PERFORMANCE_NOW = !1),
      (x.Utilities = n);
  })(ue || (ue = {}));
  var ue;
  (function (x) {
    function n(i) {
      if (i instanceof Error) return i;
      const u = new Error(i.message || String(i) || 'Unknown Error');
      return i.stack && (u.stack = i.stack), u;
    }
    x.ensureError = n;
    class R {
      static validateConfigurationOptions(u) {
        function _(S) {
          if (S.phase === 'loading') {
            console.error('Loading "' + S.moduleId + '" failed'),
              console.error(S),
              console.error('Here are the modules that depend on it:'),
              console.error(S.neededBy);
            return;
          }
          if (S.phase === 'factory') {
            console.error(
              'The factory function of "' +
                S.moduleId +
                '" has thrown an exception',
            ),
              console.error(S),
              console.error('Here are the modules that depend on it:'),
              console.error(S.neededBy);
            return;
          }
        }
        if (
          ((u = u || {}),
          typeof u.baseUrl != 'string' && (u.baseUrl = ''),
          typeof u.isBuild != 'boolean' && (u.isBuild = !1),
          typeof u.paths != 'object' && (u.paths = {}),
          typeof u.config != 'object' && (u.config = {}),
          typeof u.catchError > 'u' && (u.catchError = !1),
          typeof u.recordStats > 'u' && (u.recordStats = !1),
          typeof u.urlArgs != 'string' && (u.urlArgs = ''),
          typeof u.onError != 'function' && (u.onError = _),
          Array.isArray(u.ignoreDuplicateModules) ||
            (u.ignoreDuplicateModules = []),
          u.baseUrl.length > 0 &&
            (x.Utilities.endsWith(u.baseUrl, '/') || (u.baseUrl += '/')),
          typeof u.cspNonce != 'string' && (u.cspNonce = ''),
          typeof u.preferScriptTags > 'u' && (u.preferScriptTags = !1),
          u.nodeCachedData &&
            typeof u.nodeCachedData == 'object' &&
            (typeof u.nodeCachedData.seed != 'string' &&
              (u.nodeCachedData.seed = 'seed'),
            (typeof u.nodeCachedData.writeDelay != 'number' ||
              u.nodeCachedData.writeDelay < 0) &&
              (u.nodeCachedData.writeDelay = 1e3 * 7),
            !u.nodeCachedData.path || typeof u.nodeCachedData.path != 'string'))
        ) {
          const S = n(
            new Error("INVALID cached data configuration, 'path' MUST be set"),
          );
          (S.phase = 'configuration'),
            u.onError(S),
            (u.nodeCachedData = void 0);
        }
        return u;
      }
      static mergeConfigurationOptions(u = null, _ = null) {
        let S = x.Utilities.recursiveClone(_ || {});
        return (
          x.Utilities.forEachProperty(u, (a, s) => {
            a === 'ignoreDuplicateModules' &&
            typeof S.ignoreDuplicateModules < 'u'
              ? (S.ignoreDuplicateModules = S.ignoreDuplicateModules.concat(s))
              : a === 'paths' && typeof S.paths < 'u'
              ? x.Utilities.forEachProperty(s, (p, e) => (S.paths[p] = e))
              : a === 'config' && typeof S.config < 'u'
              ? x.Utilities.forEachProperty(s, (p, e) => (S.config[p] = e))
              : (S[a] = x.Utilities.recursiveClone(s));
          }),
          R.validateConfigurationOptions(S)
        );
      }
    }
    x.ConfigurationOptionsUtil = R;
    class M {
      constructor(u, _) {
        if (
          ((this._env = u),
          (this.options = R.mergeConfigurationOptions(_)),
          this._createIgnoreDuplicateModulesMap(),
          this._createSortedPathsRules(),
          this.options.baseUrl === '' &&
            this.options.nodeRequire &&
            this.options.nodeRequire.main &&
            this.options.nodeRequire.main.filename &&
            this._env.isNode)
        ) {
          let S = this.options.nodeRequire.main.filename,
            a = Math.max(S.lastIndexOf('/'), S.lastIndexOf('\\'));
          this.options.baseUrl = S.substring(0, a + 1);
        }
      }
      _createIgnoreDuplicateModulesMap() {
        this.ignoreDuplicateModulesMap = {};
        for (let u = 0; u < this.options.ignoreDuplicateModules.length; u++)
          this.ignoreDuplicateModulesMap[
            this.options.ignoreDuplicateModules[u]
          ] = !0;
      }
      _createSortedPathsRules() {
        (this.sortedPathsRules = []),
          x.Utilities.forEachProperty(this.options.paths, (u, _) => {
            Array.isArray(_)
              ? this.sortedPathsRules.push({ from: u, to: _ })
              : this.sortedPathsRules.push({ from: u, to: [_] });
          }),
          this.sortedPathsRules.sort((u, _) => _.from.length - u.from.length);
      }
      cloneAndMerge(u) {
        return new M(this._env, R.mergeConfigurationOptions(u, this.options));
      }
      getOptionsLiteral() {
        return this.options;
      }
      _applyPaths(u) {
        let _;
        for (let S = 0, a = this.sortedPathsRules.length; S < a; S++)
          if (
            ((_ = this.sortedPathsRules[S]), x.Utilities.startsWith(u, _.from))
          ) {
            let s = [];
            for (let p = 0, e = _.to.length; p < e; p++)
              s.push(_.to[p] + u.substr(_.from.length));
            return s;
          }
        return [u];
      }
      _addUrlArgsToUrl(u) {
        return x.Utilities.containsQueryString(u)
          ? u + '&' + this.options.urlArgs
          : u + '?' + this.options.urlArgs;
      }
      _addUrlArgsIfNecessaryToUrl(u) {
        return this.options.urlArgs ? this._addUrlArgsToUrl(u) : u;
      }
      _addUrlArgsIfNecessaryToUrls(u) {
        if (this.options.urlArgs)
          for (let _ = 0, S = u.length; _ < S; _++)
            u[_] = this._addUrlArgsToUrl(u[_]);
        return u;
      }
      moduleIdToPaths(u) {
        if (
          this._env.isNode &&
          this.options.amdModulesPattern instanceof RegExp &&
          !this.options.amdModulesPattern.test(u)
        )
          return this.isBuild() ? ['empty:'] : ['node|' + u];
        let _ = u,
          S;
        if (!x.Utilities.endsWith(_, '.js') && !x.Utilities.isAbsolutePath(_)) {
          S = this._applyPaths(_);
          for (let a = 0, s = S.length; a < s; a++)
            (this.isBuild() && S[a] === 'empty:') ||
              (x.Utilities.isAbsolutePath(S[a]) ||
                (S[a] = this.options.baseUrl + S[a]),
              !x.Utilities.endsWith(S[a], '.js') &&
                !x.Utilities.containsQueryString(S[a]) &&
                (S[a] = S[a] + '.js'));
        } else
          !x.Utilities.endsWith(_, '.js') &&
            !x.Utilities.containsQueryString(_) &&
            (_ = _ + '.js'),
            (S = [_]);
        return this._addUrlArgsIfNecessaryToUrls(S);
      }
      requireToUrl(u) {
        let _ = u;
        return (
          x.Utilities.isAbsolutePath(_) ||
            ((_ = this._applyPaths(_)[0]),
            x.Utilities.isAbsolutePath(_) || (_ = this.options.baseUrl + _)),
          this._addUrlArgsIfNecessaryToUrl(_)
        );
      }
      isBuild() {
        return this.options.isBuild;
      }
      shouldInvokeFactory(u) {
        return !!(
          !this.options.isBuild ||
          x.Utilities.isAnonymousModule(u) ||
          (this.options.buildForceInvokeFactory &&
            this.options.buildForceInvokeFactory[u])
        );
      }
      isDuplicateMessageIgnoredFor(u) {
        return this.ignoreDuplicateModulesMap.hasOwnProperty(u);
      }
      getConfigForModule(u) {
        if (this.options.config) return this.options.config[u];
      }
      shouldCatchError() {
        return this.options.catchError;
      }
      shouldRecordStats() {
        return this.options.recordStats;
      }
      onError(u) {
        this.options.onError(u);
      }
    }
    x.Configuration = M;
  })(ue || (ue = {}));
  var ue;
  (function (x) {
    class n {
      constructor(s) {
        (this._env = s), (this._scriptLoader = null), (this._callbackMap = {});
      }
      load(s, p, e, f) {
        if (!this._scriptLoader)
          if (this._env.isWebWorker) this._scriptLoader = new i();
          else if (this._env.isElectronRenderer) {
            const { preferScriptTags: b } = s.getConfig().getOptionsLiteral();
            b
              ? (this._scriptLoader = new R())
              : (this._scriptLoader = new u(this._env));
          } else
            this._env.isNode
              ? (this._scriptLoader = new u(this._env))
              : (this._scriptLoader = new R());
        let g = { callback: e, errorback: f };
        if (this._callbackMap.hasOwnProperty(p)) {
          this._callbackMap[p].push(g);
          return;
        }
        (this._callbackMap[p] = [g]),
          this._scriptLoader.load(
            s,
            p,
            () => this.triggerCallback(p),
            b => this.triggerErrorback(p, b),
          );
      }
      triggerCallback(s) {
        let p = this._callbackMap[s];
        delete this._callbackMap[s];
        for (let e = 0; e < p.length; e++) p[e].callback();
      }
      triggerErrorback(s, p) {
        let e = this._callbackMap[s];
        delete this._callbackMap[s];
        for (let f = 0; f < e.length; f++) e[f].errorback(p);
      }
    }
    class R {
      attachListeners(s, p, e) {
        let f = () => {
            s.removeEventListener('load', g), s.removeEventListener('error', b);
          },
          g = m => {
            f(), p();
          },
          b = m => {
            f(), e(m);
          };
        s.addEventListener('load', g), s.addEventListener('error', b);
      }
      load(s, p, e, f) {
        if (/^node\|/.test(p)) {
          let g = s.getConfig().getOptionsLiteral(),
            b = _(s.getRecorder(), g.nodeRequire || x.global.nodeRequire),
            m = p.split('|'),
            C = null;
          try {
            C = b(m[1]);
          } catch (E) {
            f(E);
            return;
          }
          s.enqueueDefineAnonymousModule([], () => C), e();
        } else {
          let g = document.createElement('script');
          g.setAttribute('async', 'async'),
            g.setAttribute('type', 'text/javascript'),
            this.attachListeners(g, e, f);
          const { trustedTypesPolicy: b } = s.getConfig().getOptionsLiteral();
          b && (p = b.createScriptURL(p)), g.setAttribute('src', p);
          const { cspNonce: m } = s.getConfig().getOptionsLiteral();
          m && g.setAttribute('nonce', m),
            document.getElementsByTagName('head')[0].appendChild(g);
        }
      }
    }
    function M(a) {
      const { trustedTypesPolicy: s } = a.getConfig().getOptionsLiteral();
      try {
        return (
          (s
            ? self.eval(s.createScript('', 'true'))
            : new Function('true')
          ).call(self),
          !0
        );
      } catch {
        return !1;
      }
    }
    class i {
      constructor() {
        this._cachedCanUseEval = null;
      }
      _canUseEval(s) {
        return (
          this._cachedCanUseEval === null && (this._cachedCanUseEval = M(s)),
          this._cachedCanUseEval
        );
      }
      load(s, p, e, f) {
        if (/^node\|/.test(p)) {
          const g = s.getConfig().getOptionsLiteral(),
            b = _(s.getRecorder(), g.nodeRequire || x.global.nodeRequire),
            m = p.split('|');
          let C = null;
          try {
            C = b(m[1]);
          } catch (E) {
            f(E);
            return;
          }
          s.enqueueDefineAnonymousModule([], function () {
            return C;
          }),
            e();
        } else {
          const { trustedTypesPolicy: g } = s.getConfig().getOptionsLiteral();
          if (
            !(
              /^((http:)|(https:)|(file:))/.test(p) &&
              p.substring(0, self.origin.length) !== self.origin
            ) &&
            this._canUseEval(s)
          ) {
            fetch(p)
              .then(m => {
                if (m.status !== 200) throw new Error(m.statusText);
                return m.text();
              })
              .then(m => {
                (m = `${m}
//# sourceURL=${p}`),
                  (g ? self.eval(g.createScript('', m)) : new Function(m)).call(
                    self,
                  ),
                  e();
              })
              .then(void 0, f);
            return;
          }
          try {
            g && (p = g.createScriptURL(p)), importScripts(p), e();
          } catch (m) {
            f(m);
          }
        }
      }
    }
    class u {
      constructor(s) {
        (this._env = s),
          (this._didInitialize = !1),
          (this._didPatchNodeRequire = !1);
      }
      _init(s) {
        this._didInitialize ||
          ((this._didInitialize = !0),
          (this._fs = s('fs')),
          (this._vm = s('vm')),
          (this._path = s('path')),
          (this._crypto = s('crypto')));
      }
      _initNodeRequire(s, p) {
        const { nodeCachedData: e } = p.getConfig().getOptionsLiteral();
        if (!e || this._didPatchNodeRequire) return;
        this._didPatchNodeRequire = !0;
        const f = this,
          g = s('module');
        function b(m) {
          const C = m.constructor;
          let E = function (N) {
            try {
              return m.require(N);
            } finally {
            }
          };
          return (
            (E.resolve = function (N, w) {
              return C._resolveFilename(N, m, !1, w);
            }),
            (E.resolve.paths = function (N) {
              return C._resolveLookupPaths(N, m);
            }),
            (E.main = process.mainModule),
            (E.extensions = C._extensions),
            (E.cache = C._cache),
            E
          );
        }
        g.prototype._compile = function (m, C) {
          const E = g.wrap(m.replace(/^#!.*/, '')),
            L = p.getRecorder(),
            N = f._getCachedDataPath(e, C),
            w = { filename: C };
          let c;
          try {
            const A = f._fs.readFileSync(N);
            (c = A.slice(0, 16)), (w.cachedData = A.slice(16)), L.record(60, N);
          } catch {
            L.record(61, N);
          }
          const r = new f._vm.Script(E, w),
            l = r.runInThisContext(w),
            h = f._path.dirname(C),
            d = b(this),
            o = [this.exports, d, this, C, h, process, Re, Buffer],
            v = l.apply(this.exports, o);
          return (
            f._handleCachedData(r, E, N, !w.cachedData, p),
            f._verifyCachedData(r, E, N, c, p),
            v
          );
        };
      }
      load(s, p, e, f) {
        const g = s.getConfig().getOptionsLiteral(),
          b = _(s.getRecorder(), g.nodeRequire || x.global.nodeRequire),
          m =
            g.nodeInstrumenter ||
            function (E) {
              return E;
            };
        this._init(b), this._initNodeRequire(b, s);
        let C = s.getRecorder();
        if (/^node\|/.test(p)) {
          let E = p.split('|'),
            L = null;
          try {
            L = b(E[1]);
          } catch (N) {
            f(N);
            return;
          }
          s.enqueueDefineAnonymousModule([], () => L), e();
        } else {
          p = x.Utilities.fileUriToFilePath(this._env.isWindows, p);
          const E = this._path.normalize(p),
            L = this._getElectronRendererScriptPathOrUri(E),
            N = !!g.nodeCachedData,
            w = N ? this._getCachedDataPath(g.nodeCachedData, p) : void 0;
          this._readSourceAndCachedData(E, w, C, (c, r, l, h) => {
            if (c) {
              f(c);
              return;
            }
            let d;
            r.charCodeAt(0) === u._BOM
              ? (d = u._PREFIX + r.substring(1) + u._SUFFIX)
              : (d = u._PREFIX + r + u._SUFFIX),
              (d = m(d, E));
            const o = { filename: L, cachedData: l },
              v = this._createAndEvalScript(s, d, o, e, f);
            this._handleCachedData(v, d, w, N && !l, s),
              this._verifyCachedData(v, d, w, h, s);
          });
        }
      }
      _createAndEvalScript(s, p, e, f, g) {
        const b = s.getRecorder();
        b.record(31, e.filename);
        const m = new this._vm.Script(p, e),
          C = m.runInThisContext(e),
          E = s.getGlobalAMDDefineFunc();
        let L = !1;
        const N = function () {
          return (L = !0), E.apply(null, arguments);
        };
        return (
          (N.amd = E.amd),
          C.call(
            x.global,
            s.getGlobalAMDRequireFunc(),
            N,
            e.filename,
            this._path.dirname(e.filename),
          ),
          b.record(32, e.filename),
          L
            ? f()
            : g(new Error(`Didn't receive define call in ${e.filename}!`)),
          m
        );
      }
      _getElectronRendererScriptPathOrUri(s) {
        if (!this._env.isElectronRenderer) return s;
        let p = s.match(/^([a-z])\:(.*)/i);
        return p
          ? `file:///${(p[1].toUpperCase() + ':' + p[2]).replace(/\\/g, '/')}`
          : `file://${s}`;
      }
      _getCachedDataPath(s, p) {
        const e = this._crypto
            .createHash('md5')
            .update(p, 'utf8')
            .update(s.seed, 'utf8')
            .update(process.arch, '')
            .digest('hex'),
          f = this._path.basename(p).replace(/\.js$/, '');
        return this._path.join(s.path, `${f}-${e}.code`);
      }
      _handleCachedData(s, p, e, f, g) {
        s.cachedDataRejected
          ? this._fs.unlink(e, b => {
              g.getRecorder().record(62, e),
                this._createAndWriteCachedData(s, p, e, g),
                b && g.getConfig().onError(b);
            })
          : f && this._createAndWriteCachedData(s, p, e, g);
      }
      _createAndWriteCachedData(s, p, e, f) {
        let g = Math.ceil(
            f.getConfig().getOptionsLiteral().nodeCachedData.writeDelay *
              (1 + Math.random()),
          ),
          b = -1,
          m = 0,
          C;
        const E = () => {
          setTimeout(() => {
            C ||
              (C = this._crypto.createHash('md5').update(p, 'utf8').digest());
            const L = s.createCachedData();
            if (!(L.length === 0 || L.length === b || m >= 5)) {
              if (L.length < b) {
                E();
                return;
              }
              (b = L.length),
                this._fs.writeFile(e, Buffer.concat([C, L]), N => {
                  N && f.getConfig().onError(N),
                    f.getRecorder().record(63, e),
                    E();
                });
            }
          }, g * Math.pow(4, m++));
        };
        E();
      }
      _readSourceAndCachedData(s, p, e, f) {
        if (!p) this._fs.readFile(s, { encoding: 'utf8' }, f);
        else {
          let g,
            b,
            m,
            C = 2;
          const E = L => {
            L ? f(L) : --C === 0 && f(void 0, g, b, m);
          };
          this._fs.readFile(s, { encoding: 'utf8' }, (L, N) => {
            (g = N), E(L);
          }),
            this._fs.readFile(p, (L, N) => {
              !L && N && N.length > 0
                ? ((m = N.slice(0, 16)), (b = N.slice(16)), e.record(60, p))
                : e.record(61, p),
                E();
            });
        }
      }
      _verifyCachedData(s, p, e, f, g) {
        f &&
          (s.cachedDataRejected ||
            setTimeout(() => {
              const b = this._crypto
                .createHash('md5')
                .update(p, 'utf8')
                .digest();
              f.equals(b) ||
                (g
                  .getConfig()
                  .onError(
                    new Error(
                      `FAILED TO VERIFY CACHED DATA, deleting stale '${e}' now, but a RESTART IS REQUIRED`,
                    ),
                  ),
                this._fs.unlink(e, m => {
                  m && g.getConfig().onError(m);
                }));
            }, Math.ceil(5e3 * (1 + Math.random()))));
      }
    }
    (u._BOM = 65279),
      (u._PREFIX = '(function (require, define, __filename, __dirname) { '),
      (u._SUFFIX = `
});`);
    function _(a, s) {
      if (s.__$__isRecorded) return s;
      const p = function (f) {
        a.record(33, f);
        try {
          return s(f);
        } finally {
          a.record(34, f);
        }
      };
      return (p.__$__isRecorded = !0), p;
    }
    x.ensureRecordedNodeRequire = _;
    function S(a) {
      return new n(a);
    }
    x.createScriptLoader = S;
  })(ue || (ue = {}));
  var ue;
  (function (x) {
    class n {
      constructor(a) {
        let s = a.lastIndexOf('/');
        s !== -1
          ? (this.fromModulePath = a.substr(0, s + 1))
          : (this.fromModulePath = '');
      }
      static _normalizeModuleId(a) {
        let s = a,
          p;
        for (p = /\/\.\//; p.test(s); ) s = s.replace(p, '/');
        for (
          s = s.replace(/^\.\//g, ''),
            p =
              /\/(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//;
          p.test(s);

        )
          s = s.replace(p, '/');
        return (
          (s = s.replace(
            /^(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//,
            '',
          )),
          s
        );
      }
      resolveModule(a) {
        let s = a;
        return (
          x.Utilities.isAbsolutePath(s) ||
            ((x.Utilities.startsWith(s, './') ||
              x.Utilities.startsWith(s, '../')) &&
              (s = n._normalizeModuleId(this.fromModulePath + s))),
          s
        );
      }
    }
    (n.ROOT = new n('')), (x.ModuleIdResolver = n);
    class R {
      constructor(a, s, p, e, f, g) {
        (this.id = a),
          (this.strId = s),
          (this.dependencies = p),
          (this._callback = e),
          (this._errorback = f),
          (this.moduleIdResolver = g),
          (this.exports = {}),
          (this.error = null),
          (this.exportsPassedIn = !1),
          (this.unresolvedDependenciesCount = this.dependencies.length),
          (this._isComplete = !1);
      }
      static _safeInvokeFunction(a, s) {
        try {
          return { returnedValue: a.apply(x.global, s), producedError: null };
        } catch (p) {
          return { returnedValue: null, producedError: p };
        }
      }
      static _invokeFactory(a, s, p, e) {
        return a.shouldInvokeFactory(s)
          ? a.shouldCatchError()
            ? this._safeInvokeFunction(p, e)
            : { returnedValue: p.apply(x.global, e), producedError: null }
          : { returnedValue: null, producedError: null };
      }
      complete(a, s, p, e) {
        this._isComplete = !0;
        let f = null;
        if (this._callback)
          if (typeof this._callback == 'function') {
            a.record(21, this.strId);
            let g = R._invokeFactory(s, this.strId, this._callback, p);
            (f = g.producedError),
              a.record(22, this.strId),
              !f &&
                typeof g.returnedValue < 'u' &&
                (!this.exportsPassedIn || x.Utilities.isEmpty(this.exports)) &&
                (this.exports = g.returnedValue);
          } else this.exports = this._callback;
        if (f) {
          let g = x.ensureError(f);
          (g.phase = 'factory'),
            (g.moduleId = this.strId),
            (g.neededBy = e(this.id)),
            (this.error = g),
            s.onError(g);
        }
        (this.dependencies = null),
          (this._callback = null),
          (this._errorback = null),
          (this.moduleIdResolver = null);
      }
      onDependencyError(a) {
        return (
          (this._isComplete = !0),
          (this.error = a),
          this._errorback ? (this._errorback(a), !0) : !1
        );
      }
      isComplete() {
        return this._isComplete;
      }
    }
    x.Module = R;
    class M {
      constructor() {
        (this._nextId = 0),
          (this._strModuleIdToIntModuleId = new Map()),
          (this._intModuleIdToStrModuleId = []),
          this.getModuleId('exports'),
          this.getModuleId('module'),
          this.getModuleId('require');
      }
      getMaxModuleId() {
        return this._nextId;
      }
      getModuleId(a) {
        let s = this._strModuleIdToIntModuleId.get(a);
        return (
          typeof s > 'u' &&
            ((s = this._nextId++),
            this._strModuleIdToIntModuleId.set(a, s),
            (this._intModuleIdToStrModuleId[s] = a)),
          s
        );
      }
      getStrModuleId(a) {
        return this._intModuleIdToStrModuleId[a];
      }
    }
    class i {
      constructor(a) {
        this.id = a;
      }
    }
    (i.EXPORTS = new i(0)),
      (i.MODULE = new i(1)),
      (i.REQUIRE = new i(2)),
      (x.RegularDependency = i);
    class u {
      constructor(a, s, p) {
        (this.id = a), (this.pluginId = s), (this.pluginParam = p);
      }
    }
    x.PluginDependency = u;
    class _ {
      constructor(a, s, p, e, f = 0) {
        (this._env = a),
          (this._scriptLoader = s),
          (this._loaderAvailableTimestamp = f),
          (this._defineFunc = p),
          (this._requireFunc = e),
          (this._moduleIdProvider = new M()),
          (this._config = new x.Configuration(this._env)),
          (this._hasDependencyCycle = !1),
          (this._modules2 = []),
          (this._knownModules2 = []),
          (this._inverseDependencies2 = []),
          (this._inversePluginDependencies2 = new Map()),
          (this._currentAnonymousDefineCall = null),
          (this._recorder = null),
          (this._buildInfoPath = []),
          (this._buildInfoDefineStack = []),
          (this._buildInfoDependencies = []);
      }
      reset() {
        return new _(
          this._env,
          this._scriptLoader,
          this._defineFunc,
          this._requireFunc,
          this._loaderAvailableTimestamp,
        );
      }
      getGlobalAMDDefineFunc() {
        return this._defineFunc;
      }
      getGlobalAMDRequireFunc() {
        return this._requireFunc;
      }
      static _findRelevantLocationInStack(a, s) {
        let p = g => g.replace(/\\/g, '/'),
          e = p(a),
          f = s.split(/\n/);
        for (let g = 0; g < f.length; g++) {
          let b = f[g].match(/(.*):(\d+):(\d+)\)?$/);
          if (b) {
            let m = b[1],
              C = b[2],
              E = b[3],
              L = Math.max(m.lastIndexOf(' ') + 1, m.lastIndexOf('(') + 1);
            if (((m = m.substr(L)), (m = p(m)), m === e)) {
              let N = { line: parseInt(C, 10), col: parseInt(E, 10) };
              return N.line === 1 && (N.col -= 53), N;
            }
          }
        }
        throw new Error('Could not correlate define call site for needle ' + a);
      }
      getBuildInfo() {
        if (!this._config.isBuild()) return null;
        let a = [],
          s = 0;
        for (let p = 0, e = this._modules2.length; p < e; p++) {
          let f = this._modules2[p];
          if (!f) continue;
          let g = this._buildInfoPath[f.id] || null,
            b = this._buildInfoDefineStack[f.id] || null,
            m = this._buildInfoDependencies[f.id];
          a[s++] = {
            id: f.strId,
            path: g,
            defineLocation:
              g && b ? _._findRelevantLocationInStack(g, b) : null,
            dependencies: m,
            shim: null,
            exports: f.exports,
          };
        }
        return a;
      }
      getRecorder() {
        return (
          this._recorder ||
            (this._config.shouldRecordStats()
              ? (this._recorder = new x.LoaderEventRecorder(
                  this._loaderAvailableTimestamp,
                ))
              : (this._recorder = x.NullLoaderEventRecorder.INSTANCE)),
          this._recorder
        );
      }
      getLoaderEvents() {
        return this.getRecorder().getEvents();
      }
      enqueueDefineAnonymousModule(a, s) {
        if (this._currentAnonymousDefineCall !== null)
          throw new Error(
            'Can only have one anonymous define call per script file',
          );
        let p = null;
        this._config.isBuild() &&
          (p = new Error('StackLocation').stack || null),
          (this._currentAnonymousDefineCall = {
            stack: p,
            dependencies: a,
            callback: s,
          });
      }
      defineModule(a, s, p, e, f, g = new n(a)) {
        let b = this._moduleIdProvider.getModuleId(a);
        if (this._modules2[b]) {
          this._config.isDuplicateMessageIgnoredFor(a) ||
            console.warn("Duplicate definition of module '" + a + "'");
          return;
        }
        let m = new R(b, a, this._normalizeDependencies(s, g), p, e, g);
        (this._modules2[b] = m),
          this._config.isBuild() &&
            ((this._buildInfoDefineStack[b] = f),
            (this._buildInfoDependencies[b] = (m.dependencies || []).map(C =>
              this._moduleIdProvider.getStrModuleId(C.id),
            ))),
          this._resolve(m);
      }
      _normalizeDependency(a, s) {
        if (a === 'exports') return i.EXPORTS;
        if (a === 'module') return i.MODULE;
        if (a === 'require') return i.REQUIRE;
        let p = a.indexOf('!');
        if (p >= 0) {
          let e = s.resolveModule(a.substr(0, p)),
            f = s.resolveModule(a.substr(p + 1)),
            g = this._moduleIdProvider.getModuleId(e + '!' + f),
            b = this._moduleIdProvider.getModuleId(e);
          return new u(g, b, f);
        }
        return new i(this._moduleIdProvider.getModuleId(s.resolveModule(a)));
      }
      _normalizeDependencies(a, s) {
        let p = [],
          e = 0;
        for (let f = 0, g = a.length; f < g; f++)
          p[e++] = this._normalizeDependency(a[f], s);
        return p;
      }
      _relativeRequire(a, s, p, e) {
        if (typeof s == 'string') return this.synchronousRequire(s, a);
        this.defineModule(
          x.Utilities.generateAnonymousModule(),
          s,
          p,
          e,
          null,
          a,
        );
      }
      synchronousRequire(a, s = new n(a)) {
        let p = this._normalizeDependency(a, s),
          e = this._modules2[p.id];
        if (!e)
          throw new Error(
            "Check dependency list! Synchronous require cannot resolve module '" +
              a +
              "'. This is the first mention of this module!",
          );
        if (!e.isComplete())
          throw new Error(
            "Check dependency list! Synchronous require cannot resolve module '" +
              a +
              "'. This module has not been resolved completely yet.",
          );
        if (e.error) throw e.error;
        return e.exports;
      }
      configure(a, s) {
        let p = this._config.shouldRecordStats();
        s
          ? (this._config = new x.Configuration(this._env, a))
          : (this._config = this._config.cloneAndMerge(a)),
          this._config.shouldRecordStats() && !p && (this._recorder = null);
      }
      getConfig() {
        return this._config;
      }
      _onLoad(a) {
        if (this._currentAnonymousDefineCall !== null) {
          let s = this._currentAnonymousDefineCall;
          (this._currentAnonymousDefineCall = null),
            this.defineModule(
              this._moduleIdProvider.getStrModuleId(a),
              s.dependencies,
              s.callback,
              null,
              s.stack,
            );
        }
      }
      _createLoadError(a, s) {
        let p = this._moduleIdProvider.getStrModuleId(a),
          e = (this._inverseDependencies2[a] || []).map(g =>
            this._moduleIdProvider.getStrModuleId(g),
          );
        const f = x.ensureError(s);
        return (f.phase = 'loading'), (f.moduleId = p), (f.neededBy = e), f;
      }
      _onLoadError(a, s) {
        const p = this._createLoadError(a, s);
        this._modules2[a] ||
          (this._modules2[a] = new R(
            a,
            this._moduleIdProvider.getStrModuleId(a),
            [],
            () => {},
            null,
            null,
          ));
        let e = [];
        for (let b = 0, m = this._moduleIdProvider.getMaxModuleId(); b < m; b++)
          e[b] = !1;
        let f = !1,
          g = [];
        for (g.push(a), e[a] = !0; g.length > 0; ) {
          let b = g.shift(),
            m = this._modules2[b];
          m && (f = m.onDependencyError(p) || f);
          let C = this._inverseDependencies2[b];
          if (C)
            for (let E = 0, L = C.length; E < L; E++) {
              let N = C[E];
              e[N] || (g.push(N), (e[N] = !0));
            }
        }
        f || this._config.onError(p);
      }
      _hasDependencyPath(a, s) {
        let p = this._modules2[a];
        if (!p) return !1;
        let e = [];
        for (let g = 0, b = this._moduleIdProvider.getMaxModuleId(); g < b; g++)
          e[g] = !1;
        let f = [];
        for (f.push(p), e[a] = !0; f.length > 0; ) {
          let b = f.shift().dependencies;
          if (b)
            for (let m = 0, C = b.length; m < C; m++) {
              let E = b[m];
              if (E.id === s) return !0;
              let L = this._modules2[E.id];
              L && !e[E.id] && ((e[E.id] = !0), f.push(L));
            }
        }
        return !1;
      }
      _findCyclePath(a, s, p) {
        if (a === s || p === 50) return [a];
        let e = this._modules2[a];
        if (!e) return null;
        let f = e.dependencies;
        if (f)
          for (let g = 0, b = f.length; g < b; g++) {
            let m = this._findCyclePath(f[g].id, s, p + 1);
            if (m !== null) return m.push(a), m;
          }
        return null;
      }
      _createRequire(a) {
        let s = (p, e, f) => this._relativeRequire(a, p, e, f);
        return (
          (s.toUrl = p => this._config.requireToUrl(a.resolveModule(p))),
          (s.getStats = () => this.getLoaderEvents()),
          (s.hasDependencyCycle = () => this._hasDependencyCycle),
          (s.config = (p, e = !1) => {
            this.configure(p, e);
          }),
          (s.__$__nodeRequire = x.global.nodeRequire),
          s
        );
      }
      _loadModule(a) {
        if (this._modules2[a] || this._knownModules2[a]) return;
        this._knownModules2[a] = !0;
        let s = this._moduleIdProvider.getStrModuleId(a),
          p = this._config.moduleIdToPaths(s),
          e = /^@[^\/]+\/[^\/]+$/;
        this._env.isNode &&
          (s.indexOf('/') === -1 || e.test(s)) &&
          p.push('node|' + s);
        let f = -1,
          g = b => {
            if ((f++, f >= p.length)) this._onLoadError(a, b);
            else {
              let m = p[f],
                C = this.getRecorder();
              if (this._config.isBuild() && m === 'empty:') {
                (this._buildInfoPath[a] = m),
                  this.defineModule(
                    this._moduleIdProvider.getStrModuleId(a),
                    [],
                    null,
                    null,
                    null,
                  ),
                  this._onLoad(a);
                return;
              }
              C.record(10, m),
                this._scriptLoader.load(
                  this,
                  m,
                  () => {
                    this._config.isBuild() && (this._buildInfoPath[a] = m),
                      C.record(11, m),
                      this._onLoad(a);
                  },
                  E => {
                    C.record(12, m), g(E);
                  },
                );
            }
          };
        g(null);
      }
      _loadPluginDependency(a, s) {
        if (this._modules2[s.id] || this._knownModules2[s.id]) return;
        this._knownModules2[s.id] = !0;
        let p = e => {
          this.defineModule(
            this._moduleIdProvider.getStrModuleId(s.id),
            [],
            e,
            null,
            null,
          );
        };
        (p.error = e => {
          this._config.onError(this._createLoadError(s.id, e));
        }),
          a.load(
            s.pluginParam,
            this._createRequire(n.ROOT),
            p,
            this._config.getOptionsLiteral(),
          );
      }
      _resolve(a) {
        let s = a.dependencies;
        if (s)
          for (let p = 0, e = s.length; p < e; p++) {
            let f = s[p];
            if (f === i.EXPORTS) {
              (a.exportsPassedIn = !0), a.unresolvedDependenciesCount--;
              continue;
            }
            if (f === i.MODULE) {
              a.unresolvedDependenciesCount--;
              continue;
            }
            if (f === i.REQUIRE) {
              a.unresolvedDependenciesCount--;
              continue;
            }
            let g = this._modules2[f.id];
            if (g && g.isComplete()) {
              if (g.error) {
                a.onDependencyError(g.error);
                return;
              }
              a.unresolvedDependenciesCount--;
              continue;
            }
            if (this._hasDependencyPath(f.id, a.id)) {
              (this._hasDependencyCycle = !0),
                console.warn(
                  "There is a dependency cycle between '" +
                    this._moduleIdProvider.getStrModuleId(f.id) +
                    "' and '" +
                    this._moduleIdProvider.getStrModuleId(a.id) +
                    "'. The cyclic path follows:",
                );
              let b = this._findCyclePath(f.id, a.id, 0) || [];
              b.reverse(),
                b.push(f.id),
                console.warn(
                  b.map(m => this._moduleIdProvider.getStrModuleId(m)).join(` =>
`),
                ),
                a.unresolvedDependenciesCount--;
              continue;
            }
            if (
              ((this._inverseDependencies2[f.id] =
                this._inverseDependencies2[f.id] || []),
              this._inverseDependencies2[f.id].push(a.id),
              f instanceof u)
            ) {
              let b = this._modules2[f.pluginId];
              if (b && b.isComplete()) {
                this._loadPluginDependency(b.exports, f);
                continue;
              }
              let m = this._inversePluginDependencies2.get(f.pluginId);
              m ||
                ((m = []), this._inversePluginDependencies2.set(f.pluginId, m)),
                m.push(f),
                this._loadModule(f.pluginId);
              continue;
            }
            this._loadModule(f.id);
          }
        a.unresolvedDependenciesCount === 0 && this._onModuleComplete(a);
      }
      _onModuleComplete(a) {
        let s = this.getRecorder();
        if (a.isComplete()) return;
        let p = a.dependencies,
          e = [];
        if (p)
          for (let m = 0, C = p.length; m < C; m++) {
            let E = p[m];
            if (E === i.EXPORTS) {
              e[m] = a.exports;
              continue;
            }
            if (E === i.MODULE) {
              e[m] = {
                id: a.strId,
                config: () => this._config.getConfigForModule(a.strId),
              };
              continue;
            }
            if (E === i.REQUIRE) {
              e[m] = this._createRequire(a.moduleIdResolver);
              continue;
            }
            let L = this._modules2[E.id];
            if (L) {
              e[m] = L.exports;
              continue;
            }
            e[m] = null;
          }
        const f = m =>
          (this._inverseDependencies2[m] || []).map(C =>
            this._moduleIdProvider.getStrModuleId(C),
          );
        a.complete(s, this._config, e, f);
        let g = this._inverseDependencies2[a.id];
        if (((this._inverseDependencies2[a.id] = null), g))
          for (let m = 0, C = g.length; m < C; m++) {
            let E = g[m],
              L = this._modules2[E];
            L.unresolvedDependenciesCount--,
              L.unresolvedDependenciesCount === 0 && this._onModuleComplete(L);
          }
        let b = this._inversePluginDependencies2.get(a.id);
        if (b) {
          this._inversePluginDependencies2.delete(a.id);
          for (let m = 0, C = b.length; m < C; m++)
            this._loadPluginDependency(a.exports, b[m]);
        }
      }
    }
    x.ModuleManager = _;
  })(ue || (ue = {}));
  var Y, ue;
  (function (x) {
    const n = new x.Environment();
    let R = null;
    const M = function (S, a, s) {
      typeof S != 'string' && ((s = a), (a = S), (S = null)),
        (typeof a != 'object' || !Array.isArray(a)) && ((s = a), (a = null)),
        a || (a = ['require', 'exports', 'module']),
        S
          ? R.defineModule(S, a, s, null, null)
          : R.enqueueDefineAnonymousModule(a, s);
    };
    M.amd = { jQuery: !0 };
    const i = function (S, a = !1) {
        R.configure(S, a);
      },
      u = function () {
        if (arguments.length === 1) {
          if (arguments[0] instanceof Object && !Array.isArray(arguments[0])) {
            i(arguments[0]);
            return;
          }
          if (typeof arguments[0] == 'string')
            return R.synchronousRequire(arguments[0]);
        }
        if (
          (arguments.length === 2 || arguments.length === 3) &&
          Array.isArray(arguments[0])
        ) {
          R.defineModule(
            x.Utilities.generateAnonymousModule(),
            arguments[0],
            arguments[1],
            arguments[2],
            null,
          );
          return;
        }
        throw new Error('Unrecognized require call');
      };
    (u.config = i),
      (u.getConfig = function () {
        return R.getConfig().getOptionsLiteral();
      }),
      (u.reset = function () {
        R = R.reset();
      }),
      (u.getBuildInfo = function () {
        return R.getBuildInfo();
      }),
      (u.getStats = function () {
        return R.getLoaderEvents();
      }),
      (u.define = M);
    function _() {
      if (typeof x.global.require < 'u' || typeof require < 'u') {
        const S = x.global.require || require;
        if (typeof S == 'function' && typeof S.resolve == 'function') {
          const a = x.ensureRecordedNodeRequire(R.getRecorder(), S);
          (x.global.nodeRequire = a),
            (u.nodeRequire = a),
            (u.__$__nodeRequire = a);
        }
      }
      n.isNode && !n.isElectronRenderer && !n.isElectronNodeIntegrationWebWorker
        ? (module.exports = u)
        : (n.isElectronRenderer || (x.global.define = M),
          (x.global.require = u));
    }
    (x.init = _),
      (typeof x.global.define != 'function' || !x.global.define.amd) &&
        ((R = new x.ModuleManager(
          n,
          x.createScriptLoader(n),
          M,
          u,
          x.Utilities.getHighPerformanceTimestamp(),
        )),
        typeof x.global.require < 'u' &&
          typeof x.global.require != 'function' &&
          u.config(x.global.require),
        (Y = function () {
          return M.apply(null, arguments);
        }),
        (Y.amd = M.amd),
        typeof doNotInitLoader > 'u' && _());
  })(ue || (ue = {}));
  var me =
    (this && this.__awaiter) ||
    function (x, n, R, M) {
      function i(u) {
        return u instanceof R
          ? u
          : new R(function (_) {
              _(u);
            });
      }
      return new (R || (R = Promise))(function (u, _) {
        function S(p) {
          try {
            s(M.next(p));
          } catch (e) {
            _(e);
          }
        }
        function a(p) {
          try {
            s(M.throw(p));
          } catch (e) {
            _(e);
          }
        }
        function s(p) {
          p.done ? u(p.value) : i(p.value).then(S, a);
        }
        s((M = M.apply(x, n || [])).next());
      });
    };
  Y(X[25], J([0, 1]), function (x, n) {
    'use strict';
    Object.defineProperty(n, '__esModule', { value: !0 }),
      (n.load =
        n.create =
        n.setPseudoTranslation =
        n.getConfiguredDefaultLocale =
        n.localize =
          void 0);
    let R =
      typeof document < 'u' &&
      document.location &&
      document.location.hash.indexOf('pseudo=true') >= 0;
    const M = 'i-default';
    function i(b, m) {
      let C;
      return (
        m.length === 0
          ? (C = b)
          : (C = b.replace(/\{(\d+)\}/g, (E, L) => {
              const N = L[0],
                w = m[N];
              let c = E;
              return (
                typeof w == 'string'
                  ? (c = w)
                  : (typeof w == 'number' ||
                      typeof w == 'boolean' ||
                      w === void 0 ||
                      w === null) &&
                    (c = String(w)),
                c
              );
            })),
        R && (C = '\uFF3B' + C.replace(/[aouei]/g, '$&$&') + '\uFF3D'),
        C
      );
    }
    function u(b, m) {
      let C = b[m];
      return C || ((C = b['*']), C) ? C : null;
    }
    function _(b) {
      return b.charAt(b.length - 1) === '/' ? b : b + '/';
    }
    function S(b, m, C) {
      return me(this, void 0, void 0, function* () {
        const E = _(b) + _(m) + 'vscode/' + _(C),
          L = yield fetch(E);
        if (L.ok) return yield L.json();
        throw new Error(`${L.status} - ${L.statusText}`);
      });
    }
    function a(b) {
      return function (m, C) {
        const E = Array.prototype.slice.call(arguments, 2);
        return i(b[m], E);
      };
    }
    function s(b, m, ...C) {
      return i(m, C);
    }
    n.localize = s;
    function p(b) {}
    n.getConfiguredDefaultLocale = p;
    function e(b) {
      R = b;
    }
    n.setPseudoTranslation = e;
    function f(b, m) {
      var C;
      return {
        localize: a(m[b]),
        getConfiguredDefaultLocale:
          (C = m.getConfiguredDefaultLocale) !== null && C !== void 0
            ? C
            : E => {},
      };
    }
    n.create = f;
    function g(b, m, C, E) {
      var L;
      const N = (L = E['vs/nls']) !== null && L !== void 0 ? L : {};
      if (!b || b.length === 0)
        return C({
          localize: s,
          getConfiguredDefaultLocale: () => {
            var h;
            return (h = N.availableLanguages) === null || h === void 0
              ? void 0
              : h['*'];
          },
        });
      const w = N.availableLanguages ? u(N.availableLanguages, b) : null,
        c = w === null || w === M;
      let r = '.nls';
      c || (r = r + '.' + w);
      const l = h => {
        Array.isArray(h) ? (h.localize = a(h)) : (h.localize = a(h[b])),
          (h.getConfiguredDefaultLocale = () => {
            var d;
            return (d = N.availableLanguages) === null || d === void 0
              ? void 0
              : d['*'];
          }),
          C(h);
      };
      typeof N.loadBundle == 'function'
        ? N.loadBundle(b, w, (h, d) => {
            h ? m([b + '.nls'], l) : l(d);
          })
        : N.translationServiceUrl && !c
        ? me(this, void 0, void 0, function* () {
            var h;
            try {
              const d = yield S(N.translationServiceUrl, w, b);
              return l(d);
            } catch (d) {
              if (!w.includes('-')) return console.error(d), m([b + '.nls'], l);
              try {
                const o = w.split('-')[0],
                  v = yield S(N.translationServiceUrl, o, b);
                return (
                  ((h = N.availableLanguages) !== null && h !== void 0) ||
                    (N.availableLanguages = {}),
                  (N.availableLanguages['*'] = o),
                  l(v)
                );
              } catch (o) {
                return console.error(o), m([b + '.nls'], l);
              }
            }
          })
        : m([b + r], l, h => {
            if (r === '.nls') {
              console.error(
                'Failed trying to load default language strings',
                h,
              );
              return;
            }
            console.error(
              `Failed to load message bundle for language ${w}. Falling back to the default language:`,
              h,
            ),
              m([b + '.nls'], l);
          });
    }
    n.load = g;
  }),
    (function () {
      const x = globalThis.MonacoEnvironment,
        n = x && x.baseUrl ? x.baseUrl : '../../../';
      function R(p, e) {
        var f;
        if (x?.createTrustedTypesPolicy)
          try {
            return x.createTrustedTypesPolicy(p, e);
          } catch (g) {
            console.warn(g);
            return;
          }
        try {
          return (f = self.trustedTypes) === null || f === void 0
            ? void 0
            : f.createPolicy(p, e);
        } catch (g) {
          console.warn(g);
          return;
        }
      }
      const M = R('amdLoader', {
        createScriptURL: p => p,
        createScript: (p, ...e) => {
          const f = e.slice(0, -1).join(','),
            g = e.pop().toString();
          return `(function anonymous(${f}) { ${g}
})`;
        },
      });
      function i() {
        try {
          return (
            (M
              ? globalThis.eval(M.createScript('', 'true'))
              : new Function('true')
            ).call(globalThis),
            !0
          );
        } catch {
          return !1;
        }
      }
      function u() {
        return new Promise((p, e) => {
          if (typeof globalThis.define == 'function' && globalThis.define.amd)
            return p();
          const f = n + 'vs/loader.js';
          if (
            !(
              /^((http:)|(https:)|(file:))/.test(f) &&
              f.substring(0, globalThis.origin.length) !== globalThis.origin
            ) &&
            i()
          ) {
            fetch(f)
              .then(b => {
                if (b.status !== 200) throw new Error(b.statusText);
                return b.text();
              })
              .then(b => {
                (b = `${b}
//# sourceURL=${f}`),
                  (M
                    ? globalThis.eval(M.createScript('', b))
                    : new Function(b)
                  ).call(globalThis),
                  p();
              })
              .then(void 0, e);
            return;
          }
          M ? importScripts(M.createScriptURL(f)) : importScripts(f), p();
        });
      }
      function _() {
        require.config({
          baseUrl: n,
          catchError: !0,
          trustedTypesPolicy: M,
          amdModulesPattern: /^vs\//,
        });
      }
      function S(p) {
        u().then(() => {
          _(),
            require([p], function (e) {
              setTimeout(function () {
                const f = e.create((g, b) => {
                  globalThis.postMessage(g, b);
                }, null);
                for (
                  globalThis.onmessage = g => f.onmessage(g.data, g.ports);
                  s.length > 0;

                ) {
                  const g = s.shift();
                  f.onmessage(g.data, g.ports);
                }
              }, 0);
            });
        });
      }
      typeof globalThis.define == 'function' && globalThis.define.amd && _();
      let a = !0;
      const s = [];
      globalThis.onmessage = p => {
        if (!a) {
          s.push(p);
          return;
        }
        (a = !1), S(p.data);
      };
    })(),
    Y(X[26], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.CallbackIterable =
          n.ArrayQueue =
          n.findMinBy =
          n.findLastMaxBy =
          n.findMaxBy =
          n.numberComparator =
          n.compareBy =
          n.CompareResult =
          n.splice =
          n.insertInto =
          n.mapFind =
          n.asArray =
          n.pushMany =
          n.pushToEnd =
          n.pushToStart =
          n.arrayInsert =
          n.range =
          n.firstOrDefault =
          n.lastIndex =
          n.findLast =
          n.distinct =
          n.isNonEmptyArray =
          n.isFalsyOrEmpty =
          n.coalesceInPlace =
          n.coalesce =
          n.groupBy =
          n.quickSelect =
          n.findFirstInSorted =
          n.binarySearch2 =
          n.binarySearch =
          n.removeFastWithoutKeepingOrder =
          n.equals =
          n.tail2 =
          n.tail =
            void 0);
      function R(F, T = 0) {
        return F[F.length - (1 + T)];
      }
      n.tail = R;
      function M(F) {
        if (F.length === 0) throw new Error('Invalid tail call');
        return [F.slice(0, F.length - 1), F[F.length - 1]];
      }
      n.tail2 = M;
      function i(F, T, q = (H, t) => H === t) {
        if (F === T) return !0;
        if (!F || !T || F.length !== T.length) return !1;
        for (let H = 0, t = F.length; H < t; H++) if (!q(F[H], T[H])) return !1;
        return !0;
      }
      n.equals = i;
      function u(F, T) {
        const q = F.length - 1;
        T < q && (F[T] = F[q]), F.pop();
      }
      n.removeFastWithoutKeepingOrder = u;
      function _(F, T, q) {
        return S(F.length, H => q(F[H], T));
      }
      n.binarySearch = _;
      function S(F, T) {
        let q = 0,
          H = F - 1;
        for (; q <= H; ) {
          const t = ((q + H) / 2) | 0,
            oe = T(t);
          if (oe < 0) q = t + 1;
          else if (oe > 0) H = t - 1;
          else return t;
        }
        return -(q + 1);
      }
      n.binarySearch2 = S;
      function a(F, T) {
        let q = 0,
          H = F.length;
        if (H === 0) return 0;
        for (; q < H; ) {
          const t = Math.floor((q + H) / 2);
          T(F[t]) ? (H = t) : (q = t + 1);
        }
        return q;
      }
      n.findFirstInSorted = a;
      function s(F, T, q) {
        if (((F = F | 0), F >= T.length)) throw new TypeError('invalid index');
        const H = T[Math.floor(T.length * Math.random())],
          t = [],
          oe = [],
          ne = [];
        for (const he of T) {
          const be = q(he, H);
          be < 0 ? t.push(he) : be > 0 ? oe.push(he) : ne.push(he);
        }
        return F < t.length
          ? s(F, t, q)
          : F < t.length + ne.length
          ? ne[0]
          : s(F - (t.length + ne.length), oe, q);
      }
      n.quickSelect = s;
      function p(F, T) {
        const q = [];
        let H;
        for (const t of F.slice(0).sort(T))
          !H || T(H[0], t) !== 0 ? ((H = [t]), q.push(H)) : H.push(t);
        return q;
      }
      n.groupBy = p;
      function e(F) {
        return F.filter(T => !!T);
      }
      n.coalesce = e;
      function f(F) {
        let T = 0;
        for (let q = 0; q < F.length; q++) F[q] && ((F[T] = F[q]), (T += 1));
        F.length = T;
      }
      n.coalesceInPlace = f;
      function g(F) {
        return !Array.isArray(F) || F.length === 0;
      }
      n.isFalsyOrEmpty = g;
      function b(F) {
        return Array.isArray(F) && F.length > 0;
      }
      n.isNonEmptyArray = b;
      function m(F, T = q => q) {
        const q = new Set();
        return F.filter(H => {
          const t = T(H);
          return q.has(t) ? !1 : (q.add(t), !0);
        });
      }
      n.distinct = m;
      function C(F, T) {
        const q = E(F, T);
        if (q !== -1) return F[q];
      }
      n.findLast = C;
      function E(F, T) {
        for (let q = F.length - 1; q >= 0; q--) {
          const H = F[q];
          if (T(H)) return q;
        }
        return -1;
      }
      n.lastIndex = E;
      function L(F, T) {
        return F.length > 0 ? F[0] : T;
      }
      n.firstOrDefault = L;
      function N(F, T) {
        let q = typeof T == 'number' ? F : 0;
        typeof T == 'number' ? (q = F) : ((q = 0), (T = F));
        const H = [];
        if (q <= T) for (let t = q; t < T; t++) H.push(t);
        else for (let t = q; t > T; t--) H.push(t);
        return H;
      }
      n.range = N;
      function w(F, T, q) {
        const H = F.slice(0, T),
          t = F.slice(T);
        return H.concat(q, t);
      }
      n.arrayInsert = w;
      function c(F, T) {
        const q = F.indexOf(T);
        q > -1 && (F.splice(q, 1), F.unshift(T));
      }
      n.pushToStart = c;
      function r(F, T) {
        const q = F.indexOf(T);
        q > -1 && (F.splice(q, 1), F.push(T));
      }
      n.pushToEnd = r;
      function l(F, T) {
        for (const q of T) F.push(q);
      }
      n.pushMany = l;
      function h(F) {
        return Array.isArray(F) ? F : [F];
      }
      n.asArray = h;
      function d(F, T) {
        for (const q of F) {
          const H = T(q);
          if (H !== void 0) return H;
        }
      }
      n.mapFind = d;
      function o(F, T, q) {
        const H = A(F, T),
          t = F.length,
          oe = q.length;
        F.length = t + oe;
        for (let ne = t - 1; ne >= H; ne--) F[ne + oe] = F[ne];
        for (let ne = 0; ne < oe; ne++) F[ne + H] = q[ne];
      }
      n.insertInto = o;
      function v(F, T, q, H) {
        const t = A(F, T),
          oe = F.splice(t, q);
        return o(F, t, H), oe;
      }
      n.splice = v;
      function A(F, T) {
        return T < 0 ? Math.max(T + F.length, 0) : Math.min(T, F.length);
      }
      var y;
      (function (F) {
        function T(t) {
          return t < 0;
        }
        F.isLessThan = T;
        function q(t) {
          return t > 0;
        }
        F.isGreaterThan = q;
        function H(t) {
          return t === 0;
        }
        (F.isNeitherLessOrGreaterThan = H),
          (F.greaterThan = 1),
          (F.lessThan = -1),
          (F.neitherLessOrGreaterThan = 0);
      })(y || (n.CompareResult = y = {}));
      function D(F, T) {
        return (q, H) => T(F(q), F(H));
      }
      n.compareBy = D;
      const k = (F, T) => F - T;
      n.numberComparator = k;
      function B(F, T) {
        if (F.length === 0) return;
        let q = F[0];
        for (let H = 1; H < F.length; H++) {
          const t = F[H];
          T(t, q) > 0 && (q = t);
        }
        return q;
      }
      n.findMaxBy = B;
      function I(F, T) {
        if (F.length === 0) return;
        let q = F[0];
        for (let H = 1; H < F.length; H++) {
          const t = F[H];
          T(t, q) >= 0 && (q = t);
        }
        return q;
      }
      n.findLastMaxBy = I;
      function U(F, T) {
        return B(F, (q, H) => -T(q, H));
      }
      n.findMinBy = U;
      class V {
        constructor(T) {
          (this.items = T),
            (this.firstIdx = 0),
            (this.lastIdx = this.items.length - 1);
        }
        get length() {
          return this.lastIdx - this.firstIdx + 1;
        }
        takeWhile(T) {
          let q = this.firstIdx;
          for (; q < this.items.length && T(this.items[q]); ) q++;
          const H =
            q === this.firstIdx ? null : this.items.slice(this.firstIdx, q);
          return (this.firstIdx = q), H;
        }
        takeFromEndWhile(T) {
          let q = this.lastIdx;
          for (; q >= 0 && T(this.items[q]); ) q--;
          const H =
            q === this.lastIdx
              ? null
              : this.items.slice(q + 1, this.lastIdx + 1);
          return (this.lastIdx = q), H;
        }
        peek() {
          if (this.length !== 0) return this.items[this.firstIdx];
        }
        dequeue() {
          const T = this.items[this.firstIdx];
          return this.firstIdx++, T;
        }
        takeCount(T) {
          const q = this.items.slice(this.firstIdx, this.firstIdx + T);
          return (this.firstIdx += T), q;
        }
      }
      n.ArrayQueue = V;
      class Q {
        constructor(T) {
          this.iterate = T;
        }
        toArray() {
          const T = [];
          return this.iterate(q => (T.push(q), !0)), T;
        }
        filter(T) {
          return new Q(q => this.iterate(H => (T(H) ? q(H) : !0)));
        }
        map(T) {
          return new Q(q => this.iterate(H => q(T(H))));
        }
        findLast(T) {
          let q;
          return this.iterate(H => (T(H) && (q = H), !0)), q;
        }
        findLastMaxBy(T) {
          let q,
            H = !0;
          return (
            this.iterate(
              t => ((H || y.isGreaterThan(T(t, q))) && ((H = !1), (q = t)), !0),
            ),
            q
          );
        }
      }
      (n.CallbackIterable = Q), (Q.empty = new Q(F => {}));
    }),
    Y(X[27], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.CachedFunction = n.LRUCachedFunction = void 0);
      class R {
        constructor(u) {
          (this.fn = u), (this.lastCache = void 0), (this.lastArgKey = void 0);
        }
        get(u) {
          const _ = JSON.stringify(u);
          return (
            this.lastArgKey !== _ &&
              ((this.lastArgKey = _), (this.lastCache = this.fn(u))),
            this.lastCache
          );
        }
      }
      n.LRUCachedFunction = R;
      class M {
        get cachedValues() {
          return this._map;
        }
        constructor(u) {
          (this.fn = u), (this._map = new Map());
        }
        get(u) {
          if (this._map.has(u)) return this._map.get(u);
          const _ = this.fn(u);
          return this._map.set(u, _), _;
        }
      }
      n.CachedFunction = M;
    }),
    Y(X[28], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.Color = n.HSVA = n.HSLA = n.RGBA = void 0);
      function R(S, a) {
        const s = Math.pow(10, a);
        return Math.round(S * s) / s;
      }
      class M {
        constructor(a, s, p, e = 1) {
          (this._rgbaBrand = void 0),
            (this.r = Math.min(255, Math.max(0, a)) | 0),
            (this.g = Math.min(255, Math.max(0, s)) | 0),
            (this.b = Math.min(255, Math.max(0, p)) | 0),
            (this.a = R(Math.max(Math.min(1, e), 0), 3));
        }
        static equals(a, s) {
          return a.r === s.r && a.g === s.g && a.b === s.b && a.a === s.a;
        }
      }
      n.RGBA = M;
      class i {
        constructor(a, s, p, e) {
          (this._hslaBrand = void 0),
            (this.h = Math.max(Math.min(360, a), 0) | 0),
            (this.s = R(Math.max(Math.min(1, s), 0), 3)),
            (this.l = R(Math.max(Math.min(1, p), 0), 3)),
            (this.a = R(Math.max(Math.min(1, e), 0), 3));
        }
        static equals(a, s) {
          return a.h === s.h && a.s === s.s && a.l === s.l && a.a === s.a;
        }
        static fromRGBA(a) {
          const s = a.r / 255,
            p = a.g / 255,
            e = a.b / 255,
            f = a.a,
            g = Math.max(s, p, e),
            b = Math.min(s, p, e);
          let m = 0,
            C = 0;
          const E = (b + g) / 2,
            L = g - b;
          if (L > 0) {
            switch (
              ((C = Math.min(E <= 0.5 ? L / (2 * E) : L / (2 - 2 * E), 1)), g)
            ) {
              case s:
                m = (p - e) / L + (p < e ? 6 : 0);
                break;
              case p:
                m = (e - s) / L + 2;
                break;
              case e:
                m = (s - p) / L + 4;
                break;
            }
            (m *= 60), (m = Math.round(m));
          }
          return new i(m, C, E, f);
        }
        static _hue2rgb(a, s, p) {
          return (
            p < 0 && (p += 1),
            p > 1 && (p -= 1),
            p < 1 / 6
              ? a + (s - a) * 6 * p
              : p < 1 / 2
              ? s
              : p < 2 / 3
              ? a + (s - a) * (2 / 3 - p) * 6
              : a
          );
        }
        static toRGBA(a) {
          const s = a.h / 360,
            { s: p, l: e, a: f } = a;
          let g, b, m;
          if (p === 0) g = b = m = e;
          else {
            const C = e < 0.5 ? e * (1 + p) : e + p - e * p,
              E = 2 * e - C;
            (g = i._hue2rgb(E, C, s + 1 / 3)),
              (b = i._hue2rgb(E, C, s)),
              (m = i._hue2rgb(E, C, s - 1 / 3));
          }
          return new M(
            Math.round(g * 255),
            Math.round(b * 255),
            Math.round(m * 255),
            f,
          );
        }
      }
      n.HSLA = i;
      class u {
        constructor(a, s, p, e) {
          (this._hsvaBrand = void 0),
            (this.h = Math.max(Math.min(360, a), 0) | 0),
            (this.s = R(Math.max(Math.min(1, s), 0), 3)),
            (this.v = R(Math.max(Math.min(1, p), 0), 3)),
            (this.a = R(Math.max(Math.min(1, e), 0), 3));
        }
        static equals(a, s) {
          return a.h === s.h && a.s === s.s && a.v === s.v && a.a === s.a;
        }
        static fromRGBA(a) {
          const s = a.r / 255,
            p = a.g / 255,
            e = a.b / 255,
            f = Math.max(s, p, e),
            g = Math.min(s, p, e),
            b = f - g,
            m = f === 0 ? 0 : b / f;
          let C;
          return (
            b === 0
              ? (C = 0)
              : f === s
              ? (C = ((((p - e) / b) % 6) + 6) % 6)
              : f === p
              ? (C = (e - s) / b + 2)
              : (C = (s - p) / b + 4),
            new u(Math.round(C * 60), m, f, a.a)
          );
        }
        static toRGBA(a) {
          const { h: s, s: p, v: e, a: f } = a,
            g = e * p,
            b = g * (1 - Math.abs(((s / 60) % 2) - 1)),
            m = e - g;
          let [C, E, L] = [0, 0, 0];
          return (
            s < 60
              ? ((C = g), (E = b))
              : s < 120
              ? ((C = b), (E = g))
              : s < 180
              ? ((E = g), (L = b))
              : s < 240
              ? ((E = b), (L = g))
              : s < 300
              ? ((C = b), (L = g))
              : s <= 360 && ((C = g), (L = b)),
            (C = Math.round((C + m) * 255)),
            (E = Math.round((E + m) * 255)),
            (L = Math.round((L + m) * 255)),
            new M(C, E, L, f)
          );
        }
      }
      n.HSVA = u;
      class _ {
        static fromHex(a) {
          return _.Format.CSS.parseHex(a) || _.red;
        }
        static equals(a, s) {
          return !a && !s ? !0 : !a || !s ? !1 : a.equals(s);
        }
        get hsla() {
          return this._hsla ? this._hsla : i.fromRGBA(this.rgba);
        }
        get hsva() {
          return this._hsva ? this._hsva : u.fromRGBA(this.rgba);
        }
        constructor(a) {
          if (a)
            if (a instanceof M) this.rgba = a;
            else if (a instanceof i)
              (this._hsla = a), (this.rgba = i.toRGBA(a));
            else if (a instanceof u)
              (this._hsva = a), (this.rgba = u.toRGBA(a));
            else throw new Error('Invalid color ctor argument');
          else throw new Error('Color needs a value');
        }
        equals(a) {
          return (
            !!a &&
            M.equals(this.rgba, a.rgba) &&
            i.equals(this.hsla, a.hsla) &&
            u.equals(this.hsva, a.hsva)
          );
        }
        getRelativeLuminance() {
          const a = _._relativeLuminanceForComponent(this.rgba.r),
            s = _._relativeLuminanceForComponent(this.rgba.g),
            p = _._relativeLuminanceForComponent(this.rgba.b),
            e = 0.2126 * a + 0.7152 * s + 0.0722 * p;
          return R(e, 4);
        }
        static _relativeLuminanceForComponent(a) {
          const s = a / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        }
        isLighter() {
          return (
            (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1e3 >=
            128
          );
        }
        isLighterThan(a) {
          const s = this.getRelativeLuminance(),
            p = a.getRelativeLuminance();
          return s > p;
        }
        isDarkerThan(a) {
          const s = this.getRelativeLuminance(),
            p = a.getRelativeLuminance();
          return s < p;
        }
        lighten(a) {
          return new _(
            new i(
              this.hsla.h,
              this.hsla.s,
              this.hsla.l + this.hsla.l * a,
              this.hsla.a,
            ),
          );
        }
        darken(a) {
          return new _(
            new i(
              this.hsla.h,
              this.hsla.s,
              this.hsla.l - this.hsla.l * a,
              this.hsla.a,
            ),
          );
        }
        transparent(a) {
          const { r: s, g: p, b: e, a: f } = this.rgba;
          return new _(new M(s, p, e, f * a));
        }
        isTransparent() {
          return this.rgba.a === 0;
        }
        isOpaque() {
          return this.rgba.a === 1;
        }
        opposite() {
          return new _(
            new M(
              255 - this.rgba.r,
              255 - this.rgba.g,
              255 - this.rgba.b,
              this.rgba.a,
            ),
          );
        }
        makeOpaque(a) {
          if (this.isOpaque() || a.rgba.a !== 1) return this;
          const { r: s, g: p, b: e, a: f } = this.rgba;
          return new _(
            new M(
              a.rgba.r - f * (a.rgba.r - s),
              a.rgba.g - f * (a.rgba.g - p),
              a.rgba.b - f * (a.rgba.b - e),
              1,
            ),
          );
        }
        toString() {
          return (
            this._toString || (this._toString = _.Format.CSS.format(this)),
            this._toString
          );
        }
        static getLighterColor(a, s, p) {
          if (a.isLighterThan(s)) return a;
          p = p || 0.5;
          const e = a.getRelativeLuminance(),
            f = s.getRelativeLuminance();
          return (p = (p * (f - e)) / f), a.lighten(p);
        }
        static getDarkerColor(a, s, p) {
          if (a.isDarkerThan(s)) return a;
          p = p || 0.5;
          const e = a.getRelativeLuminance(),
            f = s.getRelativeLuminance();
          return (p = (p * (e - f)) / e), a.darken(p);
        }
      }
      (n.Color = _),
        (_.white = new _(new M(255, 255, 255, 1))),
        (_.black = new _(new M(0, 0, 0, 1))),
        (_.red = new _(new M(255, 0, 0, 1))),
        (_.blue = new _(new M(0, 0, 255, 1))),
        (_.green = new _(new M(0, 255, 0, 1))),
        (_.cyan = new _(new M(0, 255, 255, 1))),
        (_.lightgrey = new _(new M(211, 211, 211, 1))),
        (_.transparent = new _(new M(0, 0, 0, 0))),
        (function (S) {
          let a;
          (function (s) {
            let p;
            (function (e) {
              function f(r) {
                return r.rgba.a === 1
                  ? `rgb(${r.rgba.r}, ${r.rgba.g}, ${r.rgba.b})`
                  : S.Format.CSS.formatRGBA(r);
              }
              e.formatRGB = f;
              function g(r) {
                return `rgba(${r.rgba.r}, ${r.rgba.g}, ${
                  r.rgba.b
                }, ${+r.rgba.a.toFixed(2)})`;
              }
              e.formatRGBA = g;
              function b(r) {
                return r.hsla.a === 1
                  ? `hsl(${r.hsla.h}, ${(r.hsla.s * 100).toFixed(2)}%, ${(
                      r.hsla.l * 100
                    ).toFixed(2)}%)`
                  : S.Format.CSS.formatHSLA(r);
              }
              e.formatHSL = b;
              function m(r) {
                return `hsla(${r.hsla.h}, ${(r.hsla.s * 100).toFixed(2)}%, ${(
                  r.hsla.l * 100
                ).toFixed(2)}%, ${r.hsla.a.toFixed(2)})`;
              }
              e.formatHSLA = m;
              function C(r) {
                const l = r.toString(16);
                return l.length !== 2 ? '0' + l : l;
              }
              function E(r) {
                return `#${C(r.rgba.r)}${C(r.rgba.g)}${C(r.rgba.b)}`;
              }
              e.formatHex = E;
              function L(r, l = !1) {
                return l && r.rgba.a === 1
                  ? S.Format.CSS.formatHex(r)
                  : `#${C(r.rgba.r)}${C(r.rgba.g)}${C(r.rgba.b)}${C(
                      Math.round(r.rgba.a * 255),
                    )}`;
              }
              e.formatHexA = L;
              function N(r) {
                return r.isOpaque()
                  ? S.Format.CSS.formatHex(r)
                  : S.Format.CSS.formatRGBA(r);
              }
              e.format = N;
              function w(r) {
                const l = r.length;
                if (l === 0 || r.charCodeAt(0) !== 35) return null;
                if (l === 7) {
                  const h = 16 * c(r.charCodeAt(1)) + c(r.charCodeAt(2)),
                    d = 16 * c(r.charCodeAt(3)) + c(r.charCodeAt(4)),
                    o = 16 * c(r.charCodeAt(5)) + c(r.charCodeAt(6));
                  return new S(new M(h, d, o, 1));
                }
                if (l === 9) {
                  const h = 16 * c(r.charCodeAt(1)) + c(r.charCodeAt(2)),
                    d = 16 * c(r.charCodeAt(3)) + c(r.charCodeAt(4)),
                    o = 16 * c(r.charCodeAt(5)) + c(r.charCodeAt(6)),
                    v = 16 * c(r.charCodeAt(7)) + c(r.charCodeAt(8));
                  return new S(new M(h, d, o, v / 255));
                }
                if (l === 4) {
                  const h = c(r.charCodeAt(1)),
                    d = c(r.charCodeAt(2)),
                    o = c(r.charCodeAt(3));
                  return new S(new M(16 * h + h, 16 * d + d, 16 * o + o));
                }
                if (l === 5) {
                  const h = c(r.charCodeAt(1)),
                    d = c(r.charCodeAt(2)),
                    o = c(r.charCodeAt(3)),
                    v = c(r.charCodeAt(4));
                  return new S(
                    new M(
                      16 * h + h,
                      16 * d + d,
                      16 * o + o,
                      (16 * v + v) / 255,
                    ),
                  );
                }
                return null;
              }
              e.parseHex = w;
              function c(r) {
                switch (r) {
                  case 48:
                    return 0;
                  case 49:
                    return 1;
                  case 50:
                    return 2;
                  case 51:
                    return 3;
                  case 52:
                    return 4;
                  case 53:
                    return 5;
                  case 54:
                    return 6;
                  case 55:
                    return 7;
                  case 56:
                    return 8;
                  case 57:
                    return 9;
                  case 97:
                    return 10;
                  case 65:
                    return 10;
                  case 98:
                    return 11;
                  case 66:
                    return 11;
                  case 99:
                    return 12;
                  case 67:
                    return 12;
                  case 100:
                    return 13;
                  case 68:
                    return 13;
                  case 101:
                    return 14;
                  case 69:
                    return 14;
                  case 102:
                    return 15;
                  case 70:
                    return 15;
                }
                return 0;
              }
            })((p = s.CSS || (s.CSS = {})));
          })((a = S.Format || (S.Format = {})));
        })(_ || (n.Color = _ = {}));
    }),
    Y(X[29], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.DiffChange = void 0);
      class R {
        constructor(i, u, _, S) {
          (this.originalStart = i),
            (this.originalLength = u),
            (this.modifiedStart = _),
            (this.modifiedLength = S);
        }
        getOriginalEnd() {
          return this.originalStart + this.originalLength;
        }
        getModifiedEnd() {
          return this.modifiedStart + this.modifiedLength;
        }
      }
      n.DiffChange = R;
    }),
    Y(X[4], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.BugIndicatingError =
          n.ErrorNoTelemetry =
          n.NotSupportedError =
          n.illegalState =
          n.illegalArgument =
          n.canceled =
          n.CancellationError =
          n.isCancellationError =
          n.transformErrorForSerialization =
          n.onUnexpectedExternalError =
          n.onUnexpectedError =
          n.errorHandler =
          n.ErrorHandler =
            void 0);
      class R {
        constructor() {
          (this.listeners = []),
            (this.unexpectedErrorHandler = function (C) {
              setTimeout(() => {
                throw C.stack
                  ? g.isErrorNoTelemetry(C)
                    ? new g(
                        C.message +
                          `

` +
                          C.stack,
                      )
                    : new Error(
                        C.message +
                          `

` +
                          C.stack,
                      )
                  : C;
              }, 0);
            });
        }
        emit(C) {
          this.listeners.forEach(E => {
            E(C);
          });
        }
        onUnexpectedError(C) {
          this.unexpectedErrorHandler(C), this.emit(C);
        }
        onUnexpectedExternalError(C) {
          this.unexpectedErrorHandler(C);
        }
      }
      (n.ErrorHandler = R), (n.errorHandler = new R());
      function M(m) {
        S(m) || n.errorHandler.onUnexpectedError(m);
      }
      n.onUnexpectedError = M;
      function i(m) {
        S(m) || n.errorHandler.onUnexpectedExternalError(m);
      }
      n.onUnexpectedExternalError = i;
      function u(m) {
        if (m instanceof Error) {
          const { name: C, message: E } = m,
            L = m.stacktrace || m.stack;
          return {
            $isError: !0,
            name: C,
            message: E,
            stack: L,
            noTelemetry: g.isErrorNoTelemetry(m),
          };
        }
        return m;
      }
      n.transformErrorForSerialization = u;
      const _ = 'Canceled';
      function S(m) {
        return m instanceof a
          ? !0
          : m instanceof Error && m.name === _ && m.message === _;
      }
      n.isCancellationError = S;
      class a extends Error {
        constructor() {
          super(_), (this.name = this.message);
        }
      }
      n.CancellationError = a;
      function s() {
        const m = new Error(_);
        return (m.name = m.message), m;
      }
      n.canceled = s;
      function p(m) {
        return m
          ? new Error(`Illegal argument: ${m}`)
          : new Error('Illegal argument');
      }
      n.illegalArgument = p;
      function e(m) {
        return m
          ? new Error(`Illegal state: ${m}`)
          : new Error('Illegal state');
      }
      n.illegalState = e;
      class f extends Error {
        constructor(C) {
          super('NotSupported'), C && (this.message = C);
        }
      }
      n.NotSupportedError = f;
      class g extends Error {
        constructor(C) {
          super(C), (this.name = 'CodeExpectedError');
        }
        static fromError(C) {
          if (C instanceof g) return C;
          const E = new g();
          return (E.message = C.message), (E.stack = C.stack), E;
        }
        static isErrorNoTelemetry(C) {
          return C.name === 'CodeExpectedError';
        }
      }
      n.ErrorNoTelemetry = g;
      class b extends Error {
        constructor(C) {
          super(C || 'An unexpected bug occurred.'),
            Object.setPrototypeOf(this, b.prototype);
        }
      }
      n.BugIndicatingError = b;
    }),
    Y(X[10], J([0, 1, 4]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.checkAdjacentItems = n.assertFn = n.assertNever = n.ok = void 0);
      function M(S, a) {
        if (!S)
          throw new Error(a ? `Assertion failed (${a})` : 'Assertion Failed');
      }
      n.ok = M;
      function i(S, a = 'Unreachable') {
        throw new Error(a);
      }
      n.assertNever = i;
      function u(S) {
        if (!S()) {
          debugger;
          S(),
            (0, R.onUnexpectedError)(
              new R.BugIndicatingError('Assertion Failed'),
            );
        }
      }
      n.assertFn = u;
      function _(S, a) {
        let s = 0;
        for (; s < S.length - 1; ) {
          const p = S[s],
            e = S[s + 1];
          if (!a(p, e)) return !1;
          s++;
        }
        return !0;
      }
      n.checkAdjacentItems = _;
    }),
    Y(X[15], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }), (n.once = void 0);
      function R(M) {
        const i = this;
        let u = !1,
          _;
        return function () {
          return u || ((u = !0), (_ = M.apply(i, arguments))), _;
        };
      }
      n.once = R;
    }),
    Y(X[16], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.Iterable = void 0);
      var R;
      (function (M) {
        function i(w) {
          return (
            w && typeof w == 'object' && typeof w[Symbol.iterator] == 'function'
          );
        }
        M.is = i;
        const u = Object.freeze([]);
        function _() {
          return u;
        }
        M.empty = _;
        function* S(w) {
          yield w;
        }
        M.single = S;
        function a(w) {
          return i(w) ? w : S(w);
        }
        M.wrap = a;
        function s(w) {
          return w || u;
        }
        M.from = s;
        function p(w) {
          return !w || w[Symbol.iterator]().next().done === !0;
        }
        M.isEmpty = p;
        function e(w) {
          return w[Symbol.iterator]().next().value;
        }
        M.first = e;
        function f(w, c) {
          for (const r of w) if (c(r)) return !0;
          return !1;
        }
        M.some = f;
        function g(w, c) {
          for (const r of w) if (c(r)) return r;
        }
        M.find = g;
        function* b(w, c) {
          for (const r of w) c(r) && (yield r);
        }
        M.filter = b;
        function* m(w, c) {
          let r = 0;
          for (const l of w) yield c(l, r++);
        }
        M.map = m;
        function* C(...w) {
          for (const c of w) for (const r of c) yield r;
        }
        M.concat = C;
        function E(w, c, r) {
          let l = r;
          for (const h of w) l = c(l, h);
          return l;
        }
        M.reduce = E;
        function* L(w, c, r = w.length) {
          for (
            c < 0 && (c += w.length),
              r < 0 ? (r += w.length) : r > w.length && (r = w.length);
            c < r;
            c++
          )
            yield w[c];
        }
        M.slice = L;
        function N(w, c = Number.POSITIVE_INFINITY) {
          const r = [];
          if (c === 0) return [r, w];
          const l = w[Symbol.iterator]();
          for (let h = 0; h < c; h++) {
            const d = l.next();
            if (d.done) return [r, M.empty()];
            r.push(d.value);
          }
          return [
            r,
            {
              [Symbol.iterator]() {
                return l;
              },
            },
          ];
        }
        M.consume = N;
      })(R || (n.Iterable = R = {}));
    }),
    Y(X[30], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.KeyChord =
          n.KeyCodeUtils =
          n.IMMUTABLE_KEY_CODE_TO_CODE =
          n.IMMUTABLE_CODE_TO_KEY_CODE =
          n.NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE =
          n.EVENT_KEY_CODE_MAP =
            void 0);
      class R {
        constructor() {
          (this._keyCodeToStr = []), (this._strToKeyCode = Object.create(null));
        }
        define(f, g) {
          (this._keyCodeToStr[f] = g),
            (this._strToKeyCode[g.toLowerCase()] = f);
        }
        keyCodeToStr(f) {
          return this._keyCodeToStr[f];
        }
        strToKeyCode(f) {
          return this._strToKeyCode[f.toLowerCase()] || 0;
        }
      }
      const M = new R(),
        i = new R(),
        u = new R();
      (n.EVENT_KEY_CODE_MAP = new Array(230)),
        (n.NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE = {});
      const _ = [],
        S = Object.create(null),
        a = Object.create(null);
      (n.IMMUTABLE_CODE_TO_KEY_CODE = []), (n.IMMUTABLE_KEY_CODE_TO_CODE = []);
      for (let e = 0; e <= 193; e++) n.IMMUTABLE_CODE_TO_KEY_CODE[e] = -1;
      for (let e = 0; e <= 132; e++) n.IMMUTABLE_KEY_CODE_TO_CODE[e] = -1;
      (function () {
        const e = '',
          f = [
            [1, 0, 'None', 0, 'unknown', 0, 'VK_UNKNOWN', e, e],
            [1, 1, 'Hyper', 0, e, 0, e, e, e],
            [1, 2, 'Super', 0, e, 0, e, e, e],
            [1, 3, 'Fn', 0, e, 0, e, e, e],
            [1, 4, 'FnLock', 0, e, 0, e, e, e],
            [1, 5, 'Suspend', 0, e, 0, e, e, e],
            [1, 6, 'Resume', 0, e, 0, e, e, e],
            [1, 7, 'Turbo', 0, e, 0, e, e, e],
            [1, 8, 'Sleep', 0, e, 0, 'VK_SLEEP', e, e],
            [1, 9, 'WakeUp', 0, e, 0, e, e, e],
            [0, 10, 'KeyA', 31, 'A', 65, 'VK_A', e, e],
            [0, 11, 'KeyB', 32, 'B', 66, 'VK_B', e, e],
            [0, 12, 'KeyC', 33, 'C', 67, 'VK_C', e, e],
            [0, 13, 'KeyD', 34, 'D', 68, 'VK_D', e, e],
            [0, 14, 'KeyE', 35, 'E', 69, 'VK_E', e, e],
            [0, 15, 'KeyF', 36, 'F', 70, 'VK_F', e, e],
            [0, 16, 'KeyG', 37, 'G', 71, 'VK_G', e, e],
            [0, 17, 'KeyH', 38, 'H', 72, 'VK_H', e, e],
            [0, 18, 'KeyI', 39, 'I', 73, 'VK_I', e, e],
            [0, 19, 'KeyJ', 40, 'J', 74, 'VK_J', e, e],
            [0, 20, 'KeyK', 41, 'K', 75, 'VK_K', e, e],
            [0, 21, 'KeyL', 42, 'L', 76, 'VK_L', e, e],
            [0, 22, 'KeyM', 43, 'M', 77, 'VK_M', e, e],
            [0, 23, 'KeyN', 44, 'N', 78, 'VK_N', e, e],
            [0, 24, 'KeyO', 45, 'O', 79, 'VK_O', e, e],
            [0, 25, 'KeyP', 46, 'P', 80, 'VK_P', e, e],
            [0, 26, 'KeyQ', 47, 'Q', 81, 'VK_Q', e, e],
            [0, 27, 'KeyR', 48, 'R', 82, 'VK_R', e, e],
            [0, 28, 'KeyS', 49, 'S', 83, 'VK_S', e, e],
            [0, 29, 'KeyT', 50, 'T', 84, 'VK_T', e, e],
            [0, 30, 'KeyU', 51, 'U', 85, 'VK_U', e, e],
            [0, 31, 'KeyV', 52, 'V', 86, 'VK_V', e, e],
            [0, 32, 'KeyW', 53, 'W', 87, 'VK_W', e, e],
            [0, 33, 'KeyX', 54, 'X', 88, 'VK_X', e, e],
            [0, 34, 'KeyY', 55, 'Y', 89, 'VK_Y', e, e],
            [0, 35, 'KeyZ', 56, 'Z', 90, 'VK_Z', e, e],
            [0, 36, 'Digit1', 22, '1', 49, 'VK_1', e, e],
            [0, 37, 'Digit2', 23, '2', 50, 'VK_2', e, e],
            [0, 38, 'Digit3', 24, '3', 51, 'VK_3', e, e],
            [0, 39, 'Digit4', 25, '4', 52, 'VK_4', e, e],
            [0, 40, 'Digit5', 26, '5', 53, 'VK_5', e, e],
            [0, 41, 'Digit6', 27, '6', 54, 'VK_6', e, e],
            [0, 42, 'Digit7', 28, '7', 55, 'VK_7', e, e],
            [0, 43, 'Digit8', 29, '8', 56, 'VK_8', e, e],
            [0, 44, 'Digit9', 30, '9', 57, 'VK_9', e, e],
            [0, 45, 'Digit0', 21, '0', 48, 'VK_0', e, e],
            [1, 46, 'Enter', 3, 'Enter', 13, 'VK_RETURN', e, e],
            [1, 47, 'Escape', 9, 'Escape', 27, 'VK_ESCAPE', e, e],
            [1, 48, 'Backspace', 1, 'Backspace', 8, 'VK_BACK', e, e],
            [1, 49, 'Tab', 2, 'Tab', 9, 'VK_TAB', e, e],
            [1, 50, 'Space', 10, 'Space', 32, 'VK_SPACE', e, e],
            [0, 51, 'Minus', 88, '-', 189, 'VK_OEM_MINUS', '-', 'OEM_MINUS'],
            [0, 52, 'Equal', 86, '=', 187, 'VK_OEM_PLUS', '=', 'OEM_PLUS'],
            [0, 53, 'BracketLeft', 92, '[', 219, 'VK_OEM_4', '[', 'OEM_4'],
            [0, 54, 'BracketRight', 94, ']', 221, 'VK_OEM_6', ']', 'OEM_6'],
            [0, 55, 'Backslash', 93, '\\', 220, 'VK_OEM_5', '\\', 'OEM_5'],
            [0, 56, 'IntlHash', 0, e, 0, e, e, e],
            [0, 57, 'Semicolon', 85, ';', 186, 'VK_OEM_1', ';', 'OEM_1'],
            [0, 58, 'Quote', 95, "'", 222, 'VK_OEM_7', "'", 'OEM_7'],
            [0, 59, 'Backquote', 91, '`', 192, 'VK_OEM_3', '`', 'OEM_3'],
            [0, 60, 'Comma', 87, ',', 188, 'VK_OEM_COMMA', ',', 'OEM_COMMA'],
            [0, 61, 'Period', 89, '.', 190, 'VK_OEM_PERIOD', '.', 'OEM_PERIOD'],
            [0, 62, 'Slash', 90, '/', 191, 'VK_OEM_2', '/', 'OEM_2'],
            [1, 63, 'CapsLock', 8, 'CapsLock', 20, 'VK_CAPITAL', e, e],
            [1, 64, 'F1', 59, 'F1', 112, 'VK_F1', e, e],
            [1, 65, 'F2', 60, 'F2', 113, 'VK_F2', e, e],
            [1, 66, 'F3', 61, 'F3', 114, 'VK_F3', e, e],
            [1, 67, 'F4', 62, 'F4', 115, 'VK_F4', e, e],
            [1, 68, 'F5', 63, 'F5', 116, 'VK_F5', e, e],
            [1, 69, 'F6', 64, 'F6', 117, 'VK_F6', e, e],
            [1, 70, 'F7', 65, 'F7', 118, 'VK_F7', e, e],
            [1, 71, 'F8', 66, 'F8', 119, 'VK_F8', e, e],
            [1, 72, 'F9', 67, 'F9', 120, 'VK_F9', e, e],
            [1, 73, 'F10', 68, 'F10', 121, 'VK_F10', e, e],
            [1, 74, 'F11', 69, 'F11', 122, 'VK_F11', e, e],
            [1, 75, 'F12', 70, 'F12', 123, 'VK_F12', e, e],
            [1, 76, 'PrintScreen', 0, e, 0, e, e, e],
            [1, 77, 'ScrollLock', 84, 'ScrollLock', 145, 'VK_SCROLL', e, e],
            [1, 78, 'Pause', 7, 'PauseBreak', 19, 'VK_PAUSE', e, e],
            [1, 79, 'Insert', 19, 'Insert', 45, 'VK_INSERT', e, e],
            [1, 80, 'Home', 14, 'Home', 36, 'VK_HOME', e, e],
            [1, 81, 'PageUp', 11, 'PageUp', 33, 'VK_PRIOR', e, e],
            [1, 82, 'Delete', 20, 'Delete', 46, 'VK_DELETE', e, e],
            [1, 83, 'End', 13, 'End', 35, 'VK_END', e, e],
            [1, 84, 'PageDown', 12, 'PageDown', 34, 'VK_NEXT', e, e],
            [1, 85, 'ArrowRight', 17, 'RightArrow', 39, 'VK_RIGHT', 'Right', e],
            [1, 86, 'ArrowLeft', 15, 'LeftArrow', 37, 'VK_LEFT', 'Left', e],
            [1, 87, 'ArrowDown', 18, 'DownArrow', 40, 'VK_DOWN', 'Down', e],
            [1, 88, 'ArrowUp', 16, 'UpArrow', 38, 'VK_UP', 'Up', e],
            [1, 89, 'NumLock', 83, 'NumLock', 144, 'VK_NUMLOCK', e, e],
            [
              1,
              90,
              'NumpadDivide',
              113,
              'NumPad_Divide',
              111,
              'VK_DIVIDE',
              e,
              e,
            ],
            [
              1,
              91,
              'NumpadMultiply',
              108,
              'NumPad_Multiply',
              106,
              'VK_MULTIPLY',
              e,
              e,
            ],
            [
              1,
              92,
              'NumpadSubtract',
              111,
              'NumPad_Subtract',
              109,
              'VK_SUBTRACT',
              e,
              e,
            ],
            [1, 93, 'NumpadAdd', 109, 'NumPad_Add', 107, 'VK_ADD', e, e],
            [1, 94, 'NumpadEnter', 3, e, 0, e, e, e],
            [1, 95, 'Numpad1', 99, 'NumPad1', 97, 'VK_NUMPAD1', e, e],
            [1, 96, 'Numpad2', 100, 'NumPad2', 98, 'VK_NUMPAD2', e, e],
            [1, 97, 'Numpad3', 101, 'NumPad3', 99, 'VK_NUMPAD3', e, e],
            [1, 98, 'Numpad4', 102, 'NumPad4', 100, 'VK_NUMPAD4', e, e],
            [1, 99, 'Numpad5', 103, 'NumPad5', 101, 'VK_NUMPAD5', e, e],
            [1, 100, 'Numpad6', 104, 'NumPad6', 102, 'VK_NUMPAD6', e, e],
            [1, 101, 'Numpad7', 105, 'NumPad7', 103, 'VK_NUMPAD7', e, e],
            [1, 102, 'Numpad8', 106, 'NumPad8', 104, 'VK_NUMPAD8', e, e],
            [1, 103, 'Numpad9', 107, 'NumPad9', 105, 'VK_NUMPAD9', e, e],
            [1, 104, 'Numpad0', 98, 'NumPad0', 96, 'VK_NUMPAD0', e, e],
            [
              1,
              105,
              'NumpadDecimal',
              112,
              'NumPad_Decimal',
              110,
              'VK_DECIMAL',
              e,
              e,
            ],
            [0, 106, 'IntlBackslash', 97, 'OEM_102', 226, 'VK_OEM_102', e, e],
            [1, 107, 'ContextMenu', 58, 'ContextMenu', 93, e, e, e],
            [1, 108, 'Power', 0, e, 0, e, e, e],
            [1, 109, 'NumpadEqual', 0, e, 0, e, e, e],
            [1, 110, 'F13', 71, 'F13', 124, 'VK_F13', e, e],
            [1, 111, 'F14', 72, 'F14', 125, 'VK_F14', e, e],
            [1, 112, 'F15', 73, 'F15', 126, 'VK_F15', e, e],
            [1, 113, 'F16', 74, 'F16', 127, 'VK_F16', e, e],
            [1, 114, 'F17', 75, 'F17', 128, 'VK_F17', e, e],
            [1, 115, 'F18', 76, 'F18', 129, 'VK_F18', e, e],
            [1, 116, 'F19', 77, 'F19', 130, 'VK_F19', e, e],
            [1, 117, 'F20', 78, 'F20', 131, 'VK_F20', e, e],
            [1, 118, 'F21', 79, 'F21', 132, 'VK_F21', e, e],
            [1, 119, 'F22', 80, 'F22', 133, 'VK_F22', e, e],
            [1, 120, 'F23', 81, 'F23', 134, 'VK_F23', e, e],
            [1, 121, 'F24', 82, 'F24', 135, 'VK_F24', e, e],
            [1, 122, 'Open', 0, e, 0, e, e, e],
            [1, 123, 'Help', 0, e, 0, e, e, e],
            [1, 124, 'Select', 0, e, 0, e, e, e],
            [1, 125, 'Again', 0, e, 0, e, e, e],
            [1, 126, 'Undo', 0, e, 0, e, e, e],
            [1, 127, 'Cut', 0, e, 0, e, e, e],
            [1, 128, 'Copy', 0, e, 0, e, e, e],
            [1, 129, 'Paste', 0, e, 0, e, e, e],
            [1, 130, 'Find', 0, e, 0, e, e, e],
            [
              1,
              131,
              'AudioVolumeMute',
              117,
              'AudioVolumeMute',
              173,
              'VK_VOLUME_MUTE',
              e,
              e,
            ],
            [
              1,
              132,
              'AudioVolumeUp',
              118,
              'AudioVolumeUp',
              175,
              'VK_VOLUME_UP',
              e,
              e,
            ],
            [
              1,
              133,
              'AudioVolumeDown',
              119,
              'AudioVolumeDown',
              174,
              'VK_VOLUME_DOWN',
              e,
              e,
            ],
            [
              1,
              134,
              'NumpadComma',
              110,
              'NumPad_Separator',
              108,
              'VK_SEPARATOR',
              e,
              e,
            ],
            [0, 135, 'IntlRo', 115, 'ABNT_C1', 193, 'VK_ABNT_C1', e, e],
            [1, 136, 'KanaMode', 0, e, 0, e, e, e],
            [0, 137, 'IntlYen', 0, e, 0, e, e, e],
            [1, 138, 'Convert', 0, e, 0, e, e, e],
            [1, 139, 'NonConvert', 0, e, 0, e, e, e],
            [1, 140, 'Lang1', 0, e, 0, e, e, e],
            [1, 141, 'Lang2', 0, e, 0, e, e, e],
            [1, 142, 'Lang3', 0, e, 0, e, e, e],
            [1, 143, 'Lang4', 0, e, 0, e, e, e],
            [1, 144, 'Lang5', 0, e, 0, e, e, e],
            [1, 145, 'Abort', 0, e, 0, e, e, e],
            [1, 146, 'Props', 0, e, 0, e, e, e],
            [1, 147, 'NumpadParenLeft', 0, e, 0, e, e, e],
            [1, 148, 'NumpadParenRight', 0, e, 0, e, e, e],
            [1, 149, 'NumpadBackspace', 0, e, 0, e, e, e],
            [1, 150, 'NumpadMemoryStore', 0, e, 0, e, e, e],
            [1, 151, 'NumpadMemoryRecall', 0, e, 0, e, e, e],
            [1, 152, 'NumpadMemoryClear', 0, e, 0, e, e, e],
            [1, 153, 'NumpadMemoryAdd', 0, e, 0, e, e, e],
            [1, 154, 'NumpadMemorySubtract', 0, e, 0, e, e, e],
            [1, 155, 'NumpadClear', 131, 'Clear', 12, 'VK_CLEAR', e, e],
            [1, 156, 'NumpadClearEntry', 0, e, 0, e, e, e],
            [1, 0, e, 5, 'Ctrl', 17, 'VK_CONTROL', e, e],
            [1, 0, e, 4, 'Shift', 16, 'VK_SHIFT', e, e],
            [1, 0, e, 6, 'Alt', 18, 'VK_MENU', e, e],
            [1, 0, e, 57, 'Meta', 91, 'VK_COMMAND', e, e],
            [1, 157, 'ControlLeft', 5, e, 0, 'VK_LCONTROL', e, e],
            [1, 158, 'ShiftLeft', 4, e, 0, 'VK_LSHIFT', e, e],
            [1, 159, 'AltLeft', 6, e, 0, 'VK_LMENU', e, e],
            [1, 160, 'MetaLeft', 57, e, 0, 'VK_LWIN', e, e],
            [1, 161, 'ControlRight', 5, e, 0, 'VK_RCONTROL', e, e],
            [1, 162, 'ShiftRight', 4, e, 0, 'VK_RSHIFT', e, e],
            [1, 163, 'AltRight', 6, e, 0, 'VK_RMENU', e, e],
            [1, 164, 'MetaRight', 57, e, 0, 'VK_RWIN', e, e],
            [1, 165, 'BrightnessUp', 0, e, 0, e, e, e],
            [1, 166, 'BrightnessDown', 0, e, 0, e, e, e],
            [1, 167, 'MediaPlay', 0, e, 0, e, e, e],
            [1, 168, 'MediaRecord', 0, e, 0, e, e, e],
            [1, 169, 'MediaFastForward', 0, e, 0, e, e, e],
            [1, 170, 'MediaRewind', 0, e, 0, e, e, e],
            [
              1,
              171,
              'MediaTrackNext',
              124,
              'MediaTrackNext',
              176,
              'VK_MEDIA_NEXT_TRACK',
              e,
              e,
            ],
            [
              1,
              172,
              'MediaTrackPrevious',
              125,
              'MediaTrackPrevious',
              177,
              'VK_MEDIA_PREV_TRACK',
              e,
              e,
            ],
            [1, 173, 'MediaStop', 126, 'MediaStop', 178, 'VK_MEDIA_STOP', e, e],
            [1, 174, 'Eject', 0, e, 0, e, e, e],
            [
              1,
              175,
              'MediaPlayPause',
              127,
              'MediaPlayPause',
              179,
              'VK_MEDIA_PLAY_PAUSE',
              e,
              e,
            ],
            [
              1,
              176,
              'MediaSelect',
              128,
              'LaunchMediaPlayer',
              181,
              'VK_MEDIA_LAUNCH_MEDIA_SELECT',
              e,
              e,
            ],
            [
              1,
              177,
              'LaunchMail',
              129,
              'LaunchMail',
              180,
              'VK_MEDIA_LAUNCH_MAIL',
              e,
              e,
            ],
            [
              1,
              178,
              'LaunchApp2',
              130,
              'LaunchApp2',
              183,
              'VK_MEDIA_LAUNCH_APP2',
              e,
              e,
            ],
            [1, 179, 'LaunchApp1', 0, e, 0, 'VK_MEDIA_LAUNCH_APP1', e, e],
            [1, 180, 'SelectTask', 0, e, 0, e, e, e],
            [1, 181, 'LaunchScreenSaver', 0, e, 0, e, e, e],
            [
              1,
              182,
              'BrowserSearch',
              120,
              'BrowserSearch',
              170,
              'VK_BROWSER_SEARCH',
              e,
              e,
            ],
            [
              1,
              183,
              'BrowserHome',
              121,
              'BrowserHome',
              172,
              'VK_BROWSER_HOME',
              e,
              e,
            ],
            [
              1,
              184,
              'BrowserBack',
              122,
              'BrowserBack',
              166,
              'VK_BROWSER_BACK',
              e,
              e,
            ],
            [
              1,
              185,
              'BrowserForward',
              123,
              'BrowserForward',
              167,
              'VK_BROWSER_FORWARD',
              e,
              e,
            ],
            [1, 186, 'BrowserStop', 0, e, 0, 'VK_BROWSER_STOP', e, e],
            [1, 187, 'BrowserRefresh', 0, e, 0, 'VK_BROWSER_REFRESH', e, e],
            [1, 188, 'BrowserFavorites', 0, e, 0, 'VK_BROWSER_FAVORITES', e, e],
            [1, 189, 'ZoomToggle', 0, e, 0, e, e, e],
            [1, 190, 'MailReply', 0, e, 0, e, e, e],
            [1, 191, 'MailForward', 0, e, 0, e, e, e],
            [1, 192, 'MailSend', 0, e, 0, e, e, e],
            [1, 0, e, 114, 'KeyInComposition', 229, e, e, e],
            [1, 0, e, 116, 'ABNT_C2', 194, 'VK_ABNT_C2', e, e],
            [1, 0, e, 96, 'OEM_8', 223, 'VK_OEM_8', e, e],
            [1, 0, e, 0, e, 0, 'VK_KANA', e, e],
            [1, 0, e, 0, e, 0, 'VK_HANGUL', e, e],
            [1, 0, e, 0, e, 0, 'VK_JUNJA', e, e],
            [1, 0, e, 0, e, 0, 'VK_FINAL', e, e],
            [1, 0, e, 0, e, 0, 'VK_HANJA', e, e],
            [1, 0, e, 0, e, 0, 'VK_KANJI', e, e],
            [1, 0, e, 0, e, 0, 'VK_CONVERT', e, e],
            [1, 0, e, 0, e, 0, 'VK_NONCONVERT', e, e],
            [1, 0, e, 0, e, 0, 'VK_ACCEPT', e, e],
            [1, 0, e, 0, e, 0, 'VK_MODECHANGE', e, e],
            [1, 0, e, 0, e, 0, 'VK_SELECT', e, e],
            [1, 0, e, 0, e, 0, 'VK_PRINT', e, e],
            [1, 0, e, 0, e, 0, 'VK_EXECUTE', e, e],
            [1, 0, e, 0, e, 0, 'VK_SNAPSHOT', e, e],
            [1, 0, e, 0, e, 0, 'VK_HELP', e, e],
            [1, 0, e, 0, e, 0, 'VK_APPS', e, e],
            [1, 0, e, 0, e, 0, 'VK_PROCESSKEY', e, e],
            [1, 0, e, 0, e, 0, 'VK_PACKET', e, e],
            [1, 0, e, 0, e, 0, 'VK_DBE_SBCSCHAR', e, e],
            [1, 0, e, 0, e, 0, 'VK_DBE_DBCSCHAR', e, e],
            [1, 0, e, 0, e, 0, 'VK_ATTN', e, e],
            [1, 0, e, 0, e, 0, 'VK_CRSEL', e, e],
            [1, 0, e, 0, e, 0, 'VK_EXSEL', e, e],
            [1, 0, e, 0, e, 0, 'VK_EREOF', e, e],
            [1, 0, e, 0, e, 0, 'VK_PLAY', e, e],
            [1, 0, e, 0, e, 0, 'VK_ZOOM', e, e],
            [1, 0, e, 0, e, 0, 'VK_NONAME', e, e],
            [1, 0, e, 0, e, 0, 'VK_PA1', e, e],
            [1, 0, e, 0, e, 0, 'VK_OEM_CLEAR', e, e],
          ],
          g = [],
          b = [];
        for (const m of f) {
          const [C, E, L, N, w, c, r, l, h] = m;
          if (
            (b[E] ||
              ((b[E] = !0),
              (_[E] = L),
              (S[L] = E),
              (a[L.toLowerCase()] = E),
              C &&
                ((n.IMMUTABLE_CODE_TO_KEY_CODE[E] = N),
                N !== 0 &&
                  N !== 3 &&
                  N !== 5 &&
                  N !== 4 &&
                  N !== 6 &&
                  N !== 57 &&
                  (n.IMMUTABLE_KEY_CODE_TO_CODE[N] = E))),
            !g[N])
          ) {
            if (((g[N] = !0), !w))
              throw new Error(
                `String representation missing for key code ${N} around scan code ${L}`,
              );
            M.define(N, w), i.define(N, l || w), u.define(N, h || l || w);
          }
          c && (n.EVENT_KEY_CODE_MAP[c] = N),
            r && (n.NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE[r] = N);
        }
        n.IMMUTABLE_KEY_CODE_TO_CODE[3] = 46;
      })();
      var s;
      (function (e) {
        function f(L) {
          return M.keyCodeToStr(L);
        }
        e.toString = f;
        function g(L) {
          return M.strToKeyCode(L);
        }
        e.fromString = g;
        function b(L) {
          return i.keyCodeToStr(L);
        }
        e.toUserSettingsUS = b;
        function m(L) {
          return u.keyCodeToStr(L);
        }
        e.toUserSettingsGeneral = m;
        function C(L) {
          return i.strToKeyCode(L) || u.strToKeyCode(L);
        }
        e.fromUserSettings = C;
        function E(L) {
          if (L >= 98 && L <= 113) return null;
          switch (L) {
            case 16:
              return 'Up';
            case 18:
              return 'Down';
            case 15:
              return 'Left';
            case 17:
              return 'Right';
          }
          return M.keyCodeToStr(L);
        }
        e.toElectronAccelerator = E;
      })(s || (n.KeyCodeUtils = s = {}));
      function p(e, f) {
        const g = ((f & 65535) << 16) >>> 0;
        return (e | g) >>> 0;
      }
      n.KeyChord = p;
    }),
    Y(X[31], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }), (n.Lazy = void 0);
      class R {
        constructor(i) {
          (this.executor = i), (this._didRun = !1);
        }
        get value() {
          if (!this._didRun)
            try {
              this._value = this.executor();
            } catch (i) {
              this._error = i;
            } finally {
              this._didRun = !0;
            }
          if (this._error) throw this._error;
          return this._value;
        }
        get rawValue() {
          return this._value;
        }
      }
      n.Lazy = R;
    }),
    Y(X[11], J([0, 1, 15, 16]), function (x, n, R, M) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.DisposableMap =
          n.ImmortalReference =
          n.SafeDisposable =
          n.RefCountedDisposable =
          n.MutableDisposable =
          n.Disposable =
          n.DisposableStore =
          n.toDisposable =
          n.combinedDisposable =
          n.dispose =
          n.isDisposable =
          n.markAsSingleton =
          n.setDisposableTracker =
            void 0);
      const i = !1;
      let u = null;
      function _(l) {
        u = l;
      }
      if (((n.setDisposableTracker = _), i)) {
        const l = '__is_disposable_tracked__';
        _(
          new (class {
            trackDisposable(h) {
              const d = new Error('Potentially leaked disposable').stack;
              setTimeout(() => {
                h[l] || console.log(d);
              }, 3e3);
            }
            setParent(h, d) {
              if (h && h !== E.None)
                try {
                  h[l] = !0;
                } catch {}
            }
            markAsDisposed(h) {
              if (h && h !== E.None)
                try {
                  h[l] = !0;
                } catch {}
            }
            markAsSingleton(h) {}
          })(),
        );
      }
      function S(l) {
        return u?.trackDisposable(l), l;
      }
      function a(l) {
        u?.markAsDisposed(l);
      }
      function s(l, h) {
        u?.setParent(l, h);
      }
      function p(l, h) {
        if (u) for (const d of l) u.setParent(d, h);
      }
      function e(l) {
        return u?.markAsSingleton(l), l;
      }
      n.markAsSingleton = e;
      function f(l) {
        return typeof l.dispose == 'function' && l.dispose.length === 0;
      }
      n.isDisposable = f;
      function g(l) {
        if (M.Iterable.is(l)) {
          const h = [];
          for (const d of l)
            if (d)
              try {
                d.dispose();
              } catch (o) {
                h.push(o);
              }
          if (h.length === 1) throw h[0];
          if (h.length > 1)
            throw new AggregateError(
              h,
              'Encountered errors while disposing of store',
            );
          return Array.isArray(l) ? [] : l;
        } else if (l) return l.dispose(), l;
      }
      n.dispose = g;
      function b(...l) {
        const h = m(() => g(l));
        return p(l, h), h;
      }
      n.combinedDisposable = b;
      function m(l) {
        const h = S({
          dispose: (0, R.once)(() => {
            a(h), l();
          }),
        });
        return h;
      }
      n.toDisposable = m;
      class C {
        constructor() {
          (this._toDispose = new Set()), (this._isDisposed = !1), S(this);
        }
        dispose() {
          this._isDisposed || (a(this), (this._isDisposed = !0), this.clear());
        }
        get isDisposed() {
          return this._isDisposed;
        }
        clear() {
          if (this._toDispose.size !== 0)
            try {
              g(this._toDispose);
            } finally {
              this._toDispose.clear();
            }
        }
        add(h) {
          if (!h) return h;
          if (h === this)
            throw new Error('Cannot register a disposable on itself!');
          return (
            s(h, this),
            this._isDisposed
              ? C.DISABLE_DISPOSED_WARNING ||
                console.warn(
                  new Error(
                    'Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!',
                  ).stack,
                )
              : this._toDispose.add(h),
            h
          );
        }
      }
      (n.DisposableStore = C), (C.DISABLE_DISPOSED_WARNING = !1);
      class E {
        constructor() {
          (this._store = new C()), S(this), s(this._store, this);
        }
        dispose() {
          a(this), this._store.dispose();
        }
        _register(h) {
          if (h === this)
            throw new Error('Cannot register a disposable on itself!');
          return this._store.add(h);
        }
      }
      (n.Disposable = E), (E.None = Object.freeze({ dispose() {} }));
      class L {
        constructor() {
          (this._isDisposed = !1), S(this);
        }
        get value() {
          return this._isDisposed ? void 0 : this._value;
        }
        set value(h) {
          var d;
          this._isDisposed ||
            h === this._value ||
            ((d = this._value) === null || d === void 0 || d.dispose(),
            h && s(h, this),
            (this._value = h));
        }
        clear() {
          this.value = void 0;
        }
        dispose() {
          var h;
          (this._isDisposed = !0),
            a(this),
            (h = this._value) === null || h === void 0 || h.dispose(),
            (this._value = void 0);
        }
      }
      n.MutableDisposable = L;
      class N {
        constructor(h) {
          (this._disposable = h), (this._counter = 1);
        }
        acquire() {
          return this._counter++, this;
        }
        release() {
          return --this._counter === 0 && this._disposable.dispose(), this;
        }
      }
      n.RefCountedDisposable = N;
      class w {
        constructor() {
          (this.dispose = () => {}),
            (this.unset = () => {}),
            (this.isset = () => !1),
            S(this);
        }
        set(h) {
          let d = h;
          return (
            (this.unset = () => (d = void 0)),
            (this.isset = () => d !== void 0),
            (this.dispose = () => {
              d && (d(), (d = void 0), a(this));
            }),
            this
          );
        }
      }
      n.SafeDisposable = w;
      class c {
        constructor(h) {
          this.object = h;
        }
        dispose() {}
      }
      n.ImmortalReference = c;
      class r {
        constructor() {
          (this._store = new Map()), (this._isDisposed = !1), S(this);
        }
        dispose() {
          a(this), (this._isDisposed = !0), this.clearAndDisposeAll();
        }
        clearAndDisposeAll() {
          if (this._store.size)
            try {
              g(this._store.values());
            } finally {
              this._store.clear();
            }
        }
        get(h) {
          return this._store.get(h);
        }
        set(h, d, o = !1) {
          var v;
          this._isDisposed &&
            console.warn(
              new Error(
                'Trying to add a disposable to a DisposableMap that has already been disposed of. The added object will be leaked!',
              ).stack,
            ),
            o ||
              (v = this._store.get(h)) === null ||
              v === void 0 ||
              v.dispose(),
            this._store.set(h, d);
        }
        deleteAndDispose(h) {
          var d;
          (d = this._store.get(h)) === null || d === void 0 || d.dispose(),
            this._store.delete(h);
        }
        [Symbol.iterator]() {
          return this._store[Symbol.iterator]();
        }
      }
      n.DisposableMap = r;
    }),
    Y(X[17], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.LinkedList = void 0);
      class R {
        constructor(u) {
          (this.element = u),
            (this.next = R.Undefined),
            (this.prev = R.Undefined);
        }
      }
      R.Undefined = new R(void 0);
      class M {
        constructor() {
          (this._first = R.Undefined),
            (this._last = R.Undefined),
            (this._size = 0);
        }
        get size() {
          return this._size;
        }
        isEmpty() {
          return this._first === R.Undefined;
        }
        clear() {
          let u = this._first;
          for (; u !== R.Undefined; ) {
            const _ = u.next;
            (u.prev = R.Undefined), (u.next = R.Undefined), (u = _);
          }
          (this._first = R.Undefined),
            (this._last = R.Undefined),
            (this._size = 0);
        }
        unshift(u) {
          return this._insert(u, !1);
        }
        push(u) {
          return this._insert(u, !0);
        }
        _insert(u, _) {
          const S = new R(u);
          if (this._first === R.Undefined) (this._first = S), (this._last = S);
          else if (_) {
            const s = this._last;
            (this._last = S), (S.prev = s), (s.next = S);
          } else {
            const s = this._first;
            (this._first = S), (S.next = s), (s.prev = S);
          }
          this._size += 1;
          let a = !1;
          return () => {
            a || ((a = !0), this._remove(S));
          };
        }
        shift() {
          if (this._first !== R.Undefined) {
            const u = this._first.element;
            return this._remove(this._first), u;
          }
        }
        pop() {
          if (this._last !== R.Undefined) {
            const u = this._last.element;
            return this._remove(this._last), u;
          }
        }
        _remove(u) {
          if (u.prev !== R.Undefined && u.next !== R.Undefined) {
            const _ = u.prev;
            (_.next = u.next), (u.next.prev = _);
          } else u.prev === R.Undefined && u.next === R.Undefined ? ((this._first = R.Undefined), (this._last = R.Undefined)) : u.next === R.Undefined ? ((this._last = this._last.prev), (this._last.next = R.Undefined)) : u.prev === R.Undefined && ((this._first = this._first.next), (this._first.prev = R.Undefined));
          this._size -= 1;
        }
        *[Symbol.iterator]() {
          let u = this._first;
          for (; u !== R.Undefined; ) yield u.element, (u = u.next);
        }
      }
      n.LinkedList = M;
    }),
    Y(X[5], J([0, 1, 27, 31]), function (x, n, R, M) {
      'use strict';
      var i;
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.InvisibleCharacters =
          n.AmbiguousCharacters =
          n.noBreakWhitespace =
          n.getLeftDeleteOffset =
          n.singleLetterHash =
          n.containsUppercaseCharacter =
          n.startsWithUTF8BOM =
          n.UTF8_BOM_CHARACTER =
          n.isEmojiImprecise =
          n.isFullWidthCharacter =
          n.containsUnusualLineTerminators =
          n.UNUSUAL_LINE_TERMINATORS =
          n.isBasicASCII =
          n.containsRTL =
          n.getCharContainingOffset =
          n.prevCharLength =
          n.nextCharLength =
          n.GraphemeIterator =
          n.CodePointIterator =
          n.getNextCodePoint =
          n.computeCodePoint =
          n.isLowSurrogate =
          n.isHighSurrogate =
          n.commonSuffixLength =
          n.commonPrefixLength =
          n.startsWithIgnoreCase =
          n.equalsIgnoreCase =
          n.isUpperAsciiLetter =
          n.isLowerAsciiLetter =
          n.isAsciiDigit =
          n.compareSubstringIgnoreCase =
          n.compareIgnoreCase =
          n.compareSubstring =
          n.compare =
          n.lastNonWhitespaceIndex =
          n.getLeadingWhitespace =
          n.firstNonWhitespaceIndex =
          n.splitLines =
          n.regExpFlags =
          n.regExpLeadsToEndlessLoop =
          n.createRegExp =
          n.stripWildcards =
          n.convertSimple2RegExpPattern =
          n.rtrim =
          n.ltrim =
          n.trim =
          n.escapeRegExpCharacters =
          n.escape =
          n.format =
          n.isFalsyOrWhitespace =
            void 0);
      function u(P) {
        return !P || typeof P != 'string' ? !0 : P.trim().length === 0;
      }
      n.isFalsyOrWhitespace = u;
      const _ = /{(\d+)}/g;
      function S(P, ...O) {
        return O.length === 0
          ? P
          : P.replace(_, function (W, $) {
              const ee = parseInt($, 10);
              return isNaN(ee) || ee < 0 || ee >= O.length ? W : O[ee];
            });
      }
      n.format = S;
      function a(P) {
        return P.replace(/[<>&]/g, function (O) {
          switch (O) {
            case '<':
              return '&lt;';
            case '>':
              return '&gt;';
            case '&':
              return '&amp;';
            default:
              return O;
          }
        });
      }
      n.escape = a;
      function s(P) {
        return P.replace(/[\\\{\}\*\+\?\|\^\$\.\[\]\(\)]/g, '\\$&');
      }
      n.escapeRegExpCharacters = s;
      function p(P, O = ' ') {
        const W = e(P, O);
        return f(W, O);
      }
      n.trim = p;
      function e(P, O) {
        if (!P || !O) return P;
        const W = O.length;
        if (W === 0 || P.length === 0) return P;
        let $ = 0;
        for (; P.indexOf(O, $) === $; ) $ = $ + W;
        return P.substring($);
      }
      n.ltrim = e;
      function f(P, O) {
        if (!P || !O) return P;
        const W = O.length,
          $ = P.length;
        if (W === 0 || $ === 0) return P;
        let ee = $,
          ae = -1;
        for (
          ;
          (ae = P.lastIndexOf(O, ee - 1)), !(ae === -1 || ae + W !== ee);

        ) {
          if (ae === 0) return '';
          ee = ae;
        }
        return P.substring(0, ee);
      }
      n.rtrim = f;
      function g(P) {
        return P.replace(
          /[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g,
          '\\$&',
        ).replace(/[\*]/g, '.*');
      }
      n.convertSimple2RegExpPattern = g;
      function b(P) {
        return P.replace(/\*/g, '');
      }
      n.stripWildcards = b;
      function m(P, O, W = {}) {
        if (!P) throw new Error('Cannot create regex from empty string');
        O || (P = s(P)),
          W.wholeWord &&
            (/\B/.test(P.charAt(0)) || (P = '\\b' + P),
            /\B/.test(P.charAt(P.length - 1)) || (P = P + '\\b'));
        let $ = '';
        return (
          W.global && ($ += 'g'),
          W.matchCase || ($ += 'i'),
          W.multiline && ($ += 'm'),
          W.unicode && ($ += 'u'),
          new RegExp(P, $)
        );
      }
      n.createRegExp = m;
      function C(P) {
        return P.source === '^' ||
          P.source === '^$' ||
          P.source === '$' ||
          P.source === '^\\s*$'
          ? !1
          : !!(P.exec('') && P.lastIndex === 0);
      }
      n.regExpLeadsToEndlessLoop = C;
      function E(P) {
        return (
          (P.global ? 'g' : '') +
          (P.ignoreCase ? 'i' : '') +
          (P.multiline ? 'm' : '') +
          (P.unicode ? 'u' : '')
        );
      }
      n.regExpFlags = E;
      function L(P) {
        return P.split(/\r\n|\r|\n/);
      }
      n.splitLines = L;
      function N(P) {
        for (let O = 0, W = P.length; O < W; O++) {
          const $ = P.charCodeAt(O);
          if ($ !== 32 && $ !== 9) return O;
        }
        return -1;
      }
      n.firstNonWhitespaceIndex = N;
      function w(P, O = 0, W = P.length) {
        for (let $ = O; $ < W; $++) {
          const ee = P.charCodeAt($);
          if (ee !== 32 && ee !== 9) return P.substring(O, $);
        }
        return P.substring(O, W);
      }
      n.getLeadingWhitespace = w;
      function c(P, O = P.length - 1) {
        for (let W = O; W >= 0; W--) {
          const $ = P.charCodeAt(W);
          if ($ !== 32 && $ !== 9) return W;
        }
        return -1;
      }
      n.lastNonWhitespaceIndex = c;
      function r(P, O) {
        return P < O ? -1 : P > O ? 1 : 0;
      }
      n.compare = r;
      function l(P, O, W = 0, $ = P.length, ee = 0, ae = O.length) {
        for (; W < $ && ee < ae; W++, ee++) {
          const pe = P.charCodeAt(W),
            le = O.charCodeAt(ee);
          if (pe < le) return -1;
          if (pe > le) return 1;
        }
        const de = $ - W,
          ye = ae - ee;
        return de < ye ? -1 : de > ye ? 1 : 0;
      }
      n.compareSubstring = l;
      function h(P, O) {
        return d(P, O, 0, P.length, 0, O.length);
      }
      n.compareIgnoreCase = h;
      function d(P, O, W = 0, $ = P.length, ee = 0, ae = O.length) {
        for (; W < $ && ee < ae; W++, ee++) {
          let pe = P.charCodeAt(W),
            le = O.charCodeAt(ee);
          if (pe === le) continue;
          if (pe >= 128 || le >= 128)
            return l(P.toLowerCase(), O.toLowerCase(), W, $, ee, ae);
          v(pe) && (pe -= 32), v(le) && (le -= 32);
          const _e = pe - le;
          if (_e !== 0) return _e;
        }
        const de = $ - W,
          ye = ae - ee;
        return de < ye ? -1 : de > ye ? 1 : 0;
      }
      n.compareSubstringIgnoreCase = d;
      function o(P) {
        return P >= 48 && P <= 57;
      }
      n.isAsciiDigit = o;
      function v(P) {
        return P >= 97 && P <= 122;
      }
      n.isLowerAsciiLetter = v;
      function A(P) {
        return P >= 65 && P <= 90;
      }
      n.isUpperAsciiLetter = A;
      function y(P, O) {
        return P.length === O.length && d(P, O) === 0;
      }
      n.equalsIgnoreCase = y;
      function D(P, O) {
        const W = O.length;
        return O.length > P.length ? !1 : d(P, O, 0, W) === 0;
      }
      n.startsWithIgnoreCase = D;
      function k(P, O) {
        const W = Math.min(P.length, O.length);
        let $;
        for ($ = 0; $ < W; $++)
          if (P.charCodeAt($) !== O.charCodeAt($)) return $;
        return W;
      }
      n.commonPrefixLength = k;
      function B(P, O) {
        const W = Math.min(P.length, O.length);
        let $;
        const ee = P.length - 1,
          ae = O.length - 1;
        for ($ = 0; $ < W; $++)
          if (P.charCodeAt(ee - $) !== O.charCodeAt(ae - $)) return $;
        return W;
      }
      n.commonSuffixLength = B;
      function I(P) {
        return 55296 <= P && P <= 56319;
      }
      n.isHighSurrogate = I;
      function U(P) {
        return 56320 <= P && P <= 57343;
      }
      n.isLowSurrogate = U;
      function V(P, O) {
        return ((P - 55296) << 10) + (O - 56320) + 65536;
      }
      n.computeCodePoint = V;
      function Q(P, O, W) {
        const $ = P.charCodeAt(W);
        if (I($) && W + 1 < O) {
          const ee = P.charCodeAt(W + 1);
          if (U(ee)) return V($, ee);
        }
        return $;
      }
      n.getNextCodePoint = Q;
      function F(P, O) {
        const W = P.charCodeAt(O - 1);
        if (U(W) && O > 1) {
          const $ = P.charCodeAt(O - 2);
          if (I($)) return V($, W);
        }
        return W;
      }
      class T {
        get offset() {
          return this._offset;
        }
        constructor(O, W = 0) {
          (this._str = O), (this._len = O.length), (this._offset = W);
        }
        setOffset(O) {
          this._offset = O;
        }
        prevCodePoint() {
          const O = F(this._str, this._offset);
          return (this._offset -= O >= 65536 ? 2 : 1), O;
        }
        nextCodePoint() {
          const O = Q(this._str, this._len, this._offset);
          return (this._offset += O >= 65536 ? 2 : 1), O;
        }
        eol() {
          return this._offset >= this._len;
        }
      }
      n.CodePointIterator = T;
      class q {
        get offset() {
          return this._iterator.offset;
        }
        constructor(O, W = 0) {
          this._iterator = new T(O, W);
        }
        nextGraphemeLength() {
          const O = K.getInstance(),
            W = this._iterator,
            $ = W.offset;
          let ee = O.getGraphemeBreakType(W.nextCodePoint());
          for (; !W.eol(); ) {
            const ae = W.offset,
              de = O.getGraphemeBreakType(W.nextCodePoint());
            if (j(ee, de)) {
              W.setOffset(ae);
              break;
            }
            ee = de;
          }
          return W.offset - $;
        }
        prevGraphemeLength() {
          const O = K.getInstance(),
            W = this._iterator,
            $ = W.offset;
          let ee = O.getGraphemeBreakType(W.prevCodePoint());
          for (; W.offset > 0; ) {
            const ae = W.offset,
              de = O.getGraphemeBreakType(W.prevCodePoint());
            if (j(de, ee)) {
              W.setOffset(ae);
              break;
            }
            ee = de;
          }
          return $ - W.offset;
        }
        eol() {
          return this._iterator.eol();
        }
      }
      n.GraphemeIterator = q;
      function H(P, O) {
        return new q(P, O).nextGraphemeLength();
      }
      n.nextCharLength = H;
      function t(P, O) {
        return new q(P, O).prevGraphemeLength();
      }
      n.prevCharLength = t;
      function oe(P, O) {
        O > 0 && U(P.charCodeAt(O)) && O--;
        const W = O + H(P, O);
        return [W - t(P, W), W];
      }
      n.getCharContainingOffset = oe;
      let ne;
      function he() {
        return /(?:[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05F4\u0608\u060B\u060D\u061B-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u0710\u0712-\u072F\u074D-\u07A5\u07B1-\u07EA\u07F4\u07F5\u07FA\u07FE-\u0815\u081A\u0824\u0828\u0830-\u0858\u085E-\u088E\u08A0-\u08C9\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFD3D\uFD50-\uFDC7\uFDF0-\uFDFC\uFE70-\uFEFC]|\uD802[\uDC00-\uDD1B\uDD20-\uDE00\uDE10-\uDE35\uDE40-\uDEE4\uDEEB-\uDF35\uDF40-\uDFFF]|\uD803[\uDC00-\uDD23\uDE80-\uDEA9\uDEAD-\uDF45\uDF51-\uDF81\uDF86-\uDFF6]|\uD83A[\uDC00-\uDCCF\uDD00-\uDD43\uDD4B-\uDFFF]|\uD83B[\uDC00-\uDEBB])/;
      }
      function be(P) {
        return ne || (ne = he()), ne.test(P);
      }
      n.containsRTL = be;
      const re = /^[\t\n\r\x20-\x7E]*$/;
      function se(P) {
        return re.test(P);
      }
      (n.isBasicASCII = se), (n.UNUSUAL_LINE_TERMINATORS = /[\u2028\u2029]/);
      function ge(P) {
        return n.UNUSUAL_LINE_TERMINATORS.test(P);
      }
      n.containsUnusualLineTerminators = ge;
      function Le(P) {
        return (
          (P >= 11904 && P <= 55215) ||
          (P >= 63744 && P <= 64255) ||
          (P >= 65281 && P <= 65374)
        );
      }
      n.isFullWidthCharacter = Le;
      function Se(P) {
        return (
          (P >= 127462 && P <= 127487) ||
          P === 8986 ||
          P === 8987 ||
          P === 9200 ||
          P === 9203 ||
          (P >= 9728 && P <= 10175) ||
          P === 11088 ||
          P === 11093 ||
          (P >= 127744 && P <= 128591) ||
          (P >= 128640 && P <= 128764) ||
          (P >= 128992 && P <= 129008) ||
          (P >= 129280 && P <= 129535) ||
          (P >= 129648 && P <= 129782)
        );
      }
      (n.isEmojiImprecise = Se),
        (n.UTF8_BOM_CHARACTER = String.fromCharCode(65279));
      function Z(P) {
        return !!(P && P.length > 0 && P.charCodeAt(0) === 65279);
      }
      n.startsWithUTF8BOM = Z;
      function z(P, O = !1) {
        return P
          ? (O && (P = P.replace(/\\./g, '')), P.toLowerCase() !== P)
          : !1;
      }
      n.containsUppercaseCharacter = z;
      function G(P) {
        return (
          (P = P % (2 * 26)),
          P < 26
            ? String.fromCharCode(97 + P)
            : String.fromCharCode(65 + P - 26)
        );
      }
      n.singleLetterHash = G;
      function j(P, O) {
        return P === 0
          ? O !== 5 && O !== 7
          : P === 2 && O === 3
          ? !1
          : P === 4 || P === 2 || P === 3 || O === 4 || O === 2 || O === 3
          ? !0
          : !(
              (P === 8 && (O === 8 || O === 9 || O === 11 || O === 12)) ||
              ((P === 11 || P === 9) && (O === 9 || O === 10)) ||
              ((P === 12 || P === 10) && O === 10) ||
              O === 5 ||
              O === 13 ||
              O === 7 ||
              P === 1 ||
              (P === 13 && O === 14) ||
              (P === 6 && O === 6)
            );
      }
      class K {
        static getInstance() {
          return K._INSTANCE || (K._INSTANCE = new K()), K._INSTANCE;
        }
        constructor() {
          this._data = te();
        }
        getGraphemeBreakType(O) {
          if (O < 32) return O === 10 ? 3 : O === 13 ? 2 : 4;
          if (O < 127) return 0;
          const W = this._data,
            $ = W.length / 3;
          let ee = 1;
          for (; ee <= $; )
            if (O < W[3 * ee]) ee = 2 * ee;
            else if (O > W[3 * ee + 1]) ee = 2 * ee + 1;
            else return W[3 * ee + 2];
          return 0;
        }
      }
      K._INSTANCE = null;
      function te() {
        return JSON.parse(
          '[0,0,0,51229,51255,12,44061,44087,12,127462,127487,6,7083,7085,5,47645,47671,12,54813,54839,12,128678,128678,14,3270,3270,5,9919,9923,14,45853,45879,12,49437,49463,12,53021,53047,12,71216,71218,7,128398,128399,14,129360,129374,14,2519,2519,5,4448,4519,9,9742,9742,14,12336,12336,14,44957,44983,12,46749,46775,12,48541,48567,12,50333,50359,12,52125,52151,12,53917,53943,12,69888,69890,5,73018,73018,5,127990,127990,14,128558,128559,14,128759,128760,14,129653,129655,14,2027,2035,5,2891,2892,7,3761,3761,5,6683,6683,5,8293,8293,4,9825,9826,14,9999,9999,14,43452,43453,5,44509,44535,12,45405,45431,12,46301,46327,12,47197,47223,12,48093,48119,12,48989,49015,12,49885,49911,12,50781,50807,12,51677,51703,12,52573,52599,12,53469,53495,12,54365,54391,12,65279,65279,4,70471,70472,7,72145,72147,7,119173,119179,5,127799,127818,14,128240,128244,14,128512,128512,14,128652,128652,14,128721,128722,14,129292,129292,14,129445,129450,14,129734,129743,14,1476,1477,5,2366,2368,7,2750,2752,7,3076,3076,5,3415,3415,5,4141,4144,5,6109,6109,5,6964,6964,5,7394,7400,5,9197,9198,14,9770,9770,14,9877,9877,14,9968,9969,14,10084,10084,14,43052,43052,5,43713,43713,5,44285,44311,12,44733,44759,12,45181,45207,12,45629,45655,12,46077,46103,12,46525,46551,12,46973,46999,12,47421,47447,12,47869,47895,12,48317,48343,12,48765,48791,12,49213,49239,12,49661,49687,12,50109,50135,12,50557,50583,12,51005,51031,12,51453,51479,12,51901,51927,12,52349,52375,12,52797,52823,12,53245,53271,12,53693,53719,12,54141,54167,12,54589,54615,12,55037,55063,12,69506,69509,5,70191,70193,5,70841,70841,7,71463,71467,5,72330,72342,5,94031,94031,5,123628,123631,5,127763,127765,14,127941,127941,14,128043,128062,14,128302,128317,14,128465,128467,14,128539,128539,14,128640,128640,14,128662,128662,14,128703,128703,14,128745,128745,14,129004,129007,14,129329,129330,14,129402,129402,14,129483,129483,14,129686,129704,14,130048,131069,14,173,173,4,1757,1757,1,2200,2207,5,2434,2435,7,2631,2632,5,2817,2817,5,3008,3008,5,3201,3201,5,3387,3388,5,3542,3542,5,3902,3903,7,4190,4192,5,6002,6003,5,6439,6440,5,6765,6770,7,7019,7027,5,7154,7155,7,8205,8205,13,8505,8505,14,9654,9654,14,9757,9757,14,9792,9792,14,9852,9853,14,9890,9894,14,9937,9937,14,9981,9981,14,10035,10036,14,11035,11036,14,42654,42655,5,43346,43347,7,43587,43587,5,44006,44007,7,44173,44199,12,44397,44423,12,44621,44647,12,44845,44871,12,45069,45095,12,45293,45319,12,45517,45543,12,45741,45767,12,45965,45991,12,46189,46215,12,46413,46439,12,46637,46663,12,46861,46887,12,47085,47111,12,47309,47335,12,47533,47559,12,47757,47783,12,47981,48007,12,48205,48231,12,48429,48455,12,48653,48679,12,48877,48903,12,49101,49127,12,49325,49351,12,49549,49575,12,49773,49799,12,49997,50023,12,50221,50247,12,50445,50471,12,50669,50695,12,50893,50919,12,51117,51143,12,51341,51367,12,51565,51591,12,51789,51815,12,52013,52039,12,52237,52263,12,52461,52487,12,52685,52711,12,52909,52935,12,53133,53159,12,53357,53383,12,53581,53607,12,53805,53831,12,54029,54055,12,54253,54279,12,54477,54503,12,54701,54727,12,54925,54951,12,55149,55175,12,68101,68102,5,69762,69762,7,70067,70069,7,70371,70378,5,70720,70721,7,71087,71087,5,71341,71341,5,71995,71996,5,72249,72249,7,72850,72871,5,73109,73109,5,118576,118598,5,121505,121519,5,127245,127247,14,127568,127569,14,127777,127777,14,127872,127891,14,127956,127967,14,128015,128016,14,128110,128172,14,128259,128259,14,128367,128368,14,128424,128424,14,128488,128488,14,128530,128532,14,128550,128551,14,128566,128566,14,128647,128647,14,128656,128656,14,128667,128673,14,128691,128693,14,128715,128715,14,128728,128732,14,128752,128752,14,128765,128767,14,129096,129103,14,129311,129311,14,129344,129349,14,129394,129394,14,129413,129425,14,129466,129471,14,129511,129535,14,129664,129666,14,129719,129722,14,129760,129767,14,917536,917631,5,13,13,2,1160,1161,5,1564,1564,4,1807,1807,1,2085,2087,5,2307,2307,7,2382,2383,7,2497,2500,5,2563,2563,7,2677,2677,5,2763,2764,7,2879,2879,5,2914,2915,5,3021,3021,5,3142,3144,5,3263,3263,5,3285,3286,5,3398,3400,7,3530,3530,5,3633,3633,5,3864,3865,5,3974,3975,5,4155,4156,7,4229,4230,5,5909,5909,7,6078,6085,7,6277,6278,5,6451,6456,7,6744,6750,5,6846,6846,5,6972,6972,5,7074,7077,5,7146,7148,7,7222,7223,5,7416,7417,5,8234,8238,4,8417,8417,5,9000,9000,14,9203,9203,14,9730,9731,14,9748,9749,14,9762,9763,14,9776,9783,14,9800,9811,14,9831,9831,14,9872,9873,14,9882,9882,14,9900,9903,14,9929,9933,14,9941,9960,14,9974,9974,14,9989,9989,14,10006,10006,14,10062,10062,14,10160,10160,14,11647,11647,5,12953,12953,14,43019,43019,5,43232,43249,5,43443,43443,5,43567,43568,7,43696,43696,5,43765,43765,7,44013,44013,5,44117,44143,12,44229,44255,12,44341,44367,12,44453,44479,12,44565,44591,12,44677,44703,12,44789,44815,12,44901,44927,12,45013,45039,12,45125,45151,12,45237,45263,12,45349,45375,12,45461,45487,12,45573,45599,12,45685,45711,12,45797,45823,12,45909,45935,12,46021,46047,12,46133,46159,12,46245,46271,12,46357,46383,12,46469,46495,12,46581,46607,12,46693,46719,12,46805,46831,12,46917,46943,12,47029,47055,12,47141,47167,12,47253,47279,12,47365,47391,12,47477,47503,12,47589,47615,12,47701,47727,12,47813,47839,12,47925,47951,12,48037,48063,12,48149,48175,12,48261,48287,12,48373,48399,12,48485,48511,12,48597,48623,12,48709,48735,12,48821,48847,12,48933,48959,12,49045,49071,12,49157,49183,12,49269,49295,12,49381,49407,12,49493,49519,12,49605,49631,12,49717,49743,12,49829,49855,12,49941,49967,12,50053,50079,12,50165,50191,12,50277,50303,12,50389,50415,12,50501,50527,12,50613,50639,12,50725,50751,12,50837,50863,12,50949,50975,12,51061,51087,12,51173,51199,12,51285,51311,12,51397,51423,12,51509,51535,12,51621,51647,12,51733,51759,12,51845,51871,12,51957,51983,12,52069,52095,12,52181,52207,12,52293,52319,12,52405,52431,12,52517,52543,12,52629,52655,12,52741,52767,12,52853,52879,12,52965,52991,12,53077,53103,12,53189,53215,12,53301,53327,12,53413,53439,12,53525,53551,12,53637,53663,12,53749,53775,12,53861,53887,12,53973,53999,12,54085,54111,12,54197,54223,12,54309,54335,12,54421,54447,12,54533,54559,12,54645,54671,12,54757,54783,12,54869,54895,12,54981,55007,12,55093,55119,12,55243,55291,10,66045,66045,5,68325,68326,5,69688,69702,5,69817,69818,5,69957,69958,7,70089,70092,5,70198,70199,5,70462,70462,5,70502,70508,5,70750,70750,5,70846,70846,7,71100,71101,5,71230,71230,7,71351,71351,5,71737,71738,5,72000,72000,7,72160,72160,5,72273,72278,5,72752,72758,5,72882,72883,5,73031,73031,5,73461,73462,7,94192,94193,7,119149,119149,7,121403,121452,5,122915,122916,5,126980,126980,14,127358,127359,14,127535,127535,14,127759,127759,14,127771,127771,14,127792,127793,14,127825,127867,14,127897,127899,14,127945,127945,14,127985,127986,14,128000,128007,14,128021,128021,14,128066,128100,14,128184,128235,14,128249,128252,14,128266,128276,14,128335,128335,14,128379,128390,14,128407,128419,14,128444,128444,14,128481,128481,14,128499,128499,14,128526,128526,14,128536,128536,14,128543,128543,14,128556,128556,14,128564,128564,14,128577,128580,14,128643,128645,14,128649,128649,14,128654,128654,14,128660,128660,14,128664,128664,14,128675,128675,14,128686,128689,14,128695,128696,14,128705,128709,14,128717,128719,14,128725,128725,14,128736,128741,14,128747,128748,14,128755,128755,14,128762,128762,14,128981,128991,14,129009,129023,14,129160,129167,14,129296,129304,14,129320,129327,14,129340,129342,14,129356,129356,14,129388,129392,14,129399,129400,14,129404,129407,14,129432,129442,14,129454,129455,14,129473,129474,14,129485,129487,14,129648,129651,14,129659,129660,14,129671,129679,14,129709,129711,14,129728,129730,14,129751,129753,14,129776,129782,14,917505,917505,4,917760,917999,5,10,10,3,127,159,4,768,879,5,1471,1471,5,1536,1541,1,1648,1648,5,1767,1768,5,1840,1866,5,2070,2073,5,2137,2139,5,2274,2274,1,2363,2363,7,2377,2380,7,2402,2403,5,2494,2494,5,2507,2508,7,2558,2558,5,2622,2624,7,2641,2641,5,2691,2691,7,2759,2760,5,2786,2787,5,2876,2876,5,2881,2884,5,2901,2902,5,3006,3006,5,3014,3016,7,3072,3072,5,3134,3136,5,3157,3158,5,3260,3260,5,3266,3266,5,3274,3275,7,3328,3329,5,3391,3392,7,3405,3405,5,3457,3457,5,3536,3537,7,3551,3551,5,3636,3642,5,3764,3772,5,3895,3895,5,3967,3967,7,3993,4028,5,4146,4151,5,4182,4183,7,4226,4226,5,4253,4253,5,4957,4959,5,5940,5940,7,6070,6070,7,6087,6088,7,6158,6158,4,6432,6434,5,6448,6449,7,6679,6680,5,6742,6742,5,6754,6754,5,6783,6783,5,6912,6915,5,6966,6970,5,6978,6978,5,7042,7042,7,7080,7081,5,7143,7143,7,7150,7150,7,7212,7219,5,7380,7392,5,7412,7412,5,8203,8203,4,8232,8232,4,8265,8265,14,8400,8412,5,8421,8432,5,8617,8618,14,9167,9167,14,9200,9200,14,9410,9410,14,9723,9726,14,9733,9733,14,9745,9745,14,9752,9752,14,9760,9760,14,9766,9766,14,9774,9774,14,9786,9786,14,9794,9794,14,9823,9823,14,9828,9828,14,9833,9850,14,9855,9855,14,9875,9875,14,9880,9880,14,9885,9887,14,9896,9897,14,9906,9916,14,9926,9927,14,9935,9935,14,9939,9939,14,9962,9962,14,9972,9972,14,9978,9978,14,9986,9986,14,9997,9997,14,10002,10002,14,10017,10017,14,10055,10055,14,10071,10071,14,10133,10135,14,10548,10549,14,11093,11093,14,12330,12333,5,12441,12442,5,42608,42610,5,43010,43010,5,43045,43046,5,43188,43203,7,43302,43309,5,43392,43394,5,43446,43449,5,43493,43493,5,43571,43572,7,43597,43597,7,43703,43704,5,43756,43757,5,44003,44004,7,44009,44010,7,44033,44059,12,44089,44115,12,44145,44171,12,44201,44227,12,44257,44283,12,44313,44339,12,44369,44395,12,44425,44451,12,44481,44507,12,44537,44563,12,44593,44619,12,44649,44675,12,44705,44731,12,44761,44787,12,44817,44843,12,44873,44899,12,44929,44955,12,44985,45011,12,45041,45067,12,45097,45123,12,45153,45179,12,45209,45235,12,45265,45291,12,45321,45347,12,45377,45403,12,45433,45459,12,45489,45515,12,45545,45571,12,45601,45627,12,45657,45683,12,45713,45739,12,45769,45795,12,45825,45851,12,45881,45907,12,45937,45963,12,45993,46019,12,46049,46075,12,46105,46131,12,46161,46187,12,46217,46243,12,46273,46299,12,46329,46355,12,46385,46411,12,46441,46467,12,46497,46523,12,46553,46579,12,46609,46635,12,46665,46691,12,46721,46747,12,46777,46803,12,46833,46859,12,46889,46915,12,46945,46971,12,47001,47027,12,47057,47083,12,47113,47139,12,47169,47195,12,47225,47251,12,47281,47307,12,47337,47363,12,47393,47419,12,47449,47475,12,47505,47531,12,47561,47587,12,47617,47643,12,47673,47699,12,47729,47755,12,47785,47811,12,47841,47867,12,47897,47923,12,47953,47979,12,48009,48035,12,48065,48091,12,48121,48147,12,48177,48203,12,48233,48259,12,48289,48315,12,48345,48371,12,48401,48427,12,48457,48483,12,48513,48539,12,48569,48595,12,48625,48651,12,48681,48707,12,48737,48763,12,48793,48819,12,48849,48875,12,48905,48931,12,48961,48987,12,49017,49043,12,49073,49099,12,49129,49155,12,49185,49211,12,49241,49267,12,49297,49323,12,49353,49379,12,49409,49435,12,49465,49491,12,49521,49547,12,49577,49603,12,49633,49659,12,49689,49715,12,49745,49771,12,49801,49827,12,49857,49883,12,49913,49939,12,49969,49995,12,50025,50051,12,50081,50107,12,50137,50163,12,50193,50219,12,50249,50275,12,50305,50331,12,50361,50387,12,50417,50443,12,50473,50499,12,50529,50555,12,50585,50611,12,50641,50667,12,50697,50723,12,50753,50779,12,50809,50835,12,50865,50891,12,50921,50947,12,50977,51003,12,51033,51059,12,51089,51115,12,51145,51171,12,51201,51227,12,51257,51283,12,51313,51339,12,51369,51395,12,51425,51451,12,51481,51507,12,51537,51563,12,51593,51619,12,51649,51675,12,51705,51731,12,51761,51787,12,51817,51843,12,51873,51899,12,51929,51955,12,51985,52011,12,52041,52067,12,52097,52123,12,52153,52179,12,52209,52235,12,52265,52291,12,52321,52347,12,52377,52403,12,52433,52459,12,52489,52515,12,52545,52571,12,52601,52627,12,52657,52683,12,52713,52739,12,52769,52795,12,52825,52851,12,52881,52907,12,52937,52963,12,52993,53019,12,53049,53075,12,53105,53131,12,53161,53187,12,53217,53243,12,53273,53299,12,53329,53355,12,53385,53411,12,53441,53467,12,53497,53523,12,53553,53579,12,53609,53635,12,53665,53691,12,53721,53747,12,53777,53803,12,53833,53859,12,53889,53915,12,53945,53971,12,54001,54027,12,54057,54083,12,54113,54139,12,54169,54195,12,54225,54251,12,54281,54307,12,54337,54363,12,54393,54419,12,54449,54475,12,54505,54531,12,54561,54587,12,54617,54643,12,54673,54699,12,54729,54755,12,54785,54811,12,54841,54867,12,54897,54923,12,54953,54979,12,55009,55035,12,55065,55091,12,55121,55147,12,55177,55203,12,65024,65039,5,65520,65528,4,66422,66426,5,68152,68154,5,69291,69292,5,69633,69633,5,69747,69748,5,69811,69814,5,69826,69826,5,69932,69932,7,70016,70017,5,70079,70080,7,70095,70095,5,70196,70196,5,70367,70367,5,70402,70403,7,70464,70464,5,70487,70487,5,70709,70711,7,70725,70725,7,70833,70834,7,70843,70844,7,70849,70849,7,71090,71093,5,71103,71104,5,71227,71228,7,71339,71339,5,71344,71349,5,71458,71461,5,71727,71735,5,71985,71989,7,71998,71998,5,72002,72002,7,72154,72155,5,72193,72202,5,72251,72254,5,72281,72283,5,72344,72345,5,72766,72766,7,72874,72880,5,72885,72886,5,73023,73029,5,73104,73105,5,73111,73111,5,92912,92916,5,94095,94098,5,113824,113827,4,119142,119142,7,119155,119162,4,119362,119364,5,121476,121476,5,122888,122904,5,123184,123190,5,125252,125258,5,127183,127183,14,127340,127343,14,127377,127386,14,127491,127503,14,127548,127551,14,127744,127756,14,127761,127761,14,127769,127769,14,127773,127774,14,127780,127788,14,127796,127797,14,127820,127823,14,127869,127869,14,127894,127895,14,127902,127903,14,127943,127943,14,127947,127950,14,127972,127972,14,127988,127988,14,127992,127994,14,128009,128011,14,128019,128019,14,128023,128041,14,128064,128064,14,128102,128107,14,128174,128181,14,128238,128238,14,128246,128247,14,128254,128254,14,128264,128264,14,128278,128299,14,128329,128330,14,128348,128359,14,128371,128377,14,128392,128393,14,128401,128404,14,128421,128421,14,128433,128434,14,128450,128452,14,128476,128478,14,128483,128483,14,128495,128495,14,128506,128506,14,128519,128520,14,128528,128528,14,128534,128534,14,128538,128538,14,128540,128542,14,128544,128549,14,128552,128555,14,128557,128557,14,128560,128563,14,128565,128565,14,128567,128576,14,128581,128591,14,128641,128642,14,128646,128646,14,128648,128648,14,128650,128651,14,128653,128653,14,128655,128655,14,128657,128659,14,128661,128661,14,128663,128663,14,128665,128666,14,128674,128674,14,128676,128677,14,128679,128685,14,128690,128690,14,128694,128694,14,128697,128702,14,128704,128704,14,128710,128714,14,128716,128716,14,128720,128720,14,128723,128724,14,128726,128727,14,128733,128735,14,128742,128744,14,128746,128746,14,128749,128751,14,128753,128754,14,128756,128758,14,128761,128761,14,128763,128764,14,128884,128895,14,128992,129003,14,129008,129008,14,129036,129039,14,129114,129119,14,129198,129279,14,129293,129295,14,129305,129310,14,129312,129319,14,129328,129328,14,129331,129338,14,129343,129343,14,129351,129355,14,129357,129359,14,129375,129387,14,129393,129393,14,129395,129398,14,129401,129401,14,129403,129403,14,129408,129412,14,129426,129431,14,129443,129444,14,129451,129453,14,129456,129465,14,129472,129472,14,129475,129482,14,129484,129484,14,129488,129510,14,129536,129647,14,129652,129652,14,129656,129658,14,129661,129663,14,129667,129670,14,129680,129685,14,129705,129708,14,129712,129718,14,129723,129727,14,129731,129733,14,129744,129750,14,129754,129759,14,129768,129775,14,129783,129791,14,917504,917504,4,917506,917535,4,917632,917759,4,918000,921599,4,0,9,4,11,12,4,14,31,4,169,169,14,174,174,14,1155,1159,5,1425,1469,5,1473,1474,5,1479,1479,5,1552,1562,5,1611,1631,5,1750,1756,5,1759,1764,5,1770,1773,5,1809,1809,5,1958,1968,5,2045,2045,5,2075,2083,5,2089,2093,5,2192,2193,1,2250,2273,5,2275,2306,5,2362,2362,5,2364,2364,5,2369,2376,5,2381,2381,5,2385,2391,5,2433,2433,5,2492,2492,5,2495,2496,7,2503,2504,7,2509,2509,5,2530,2531,5,2561,2562,5,2620,2620,5,2625,2626,5,2635,2637,5,2672,2673,5,2689,2690,5,2748,2748,5,2753,2757,5,2761,2761,7,2765,2765,5,2810,2815,5,2818,2819,7,2878,2878,5,2880,2880,7,2887,2888,7,2893,2893,5,2903,2903,5,2946,2946,5,3007,3007,7,3009,3010,7,3018,3020,7,3031,3031,5,3073,3075,7,3132,3132,5,3137,3140,7,3146,3149,5,3170,3171,5,3202,3203,7,3262,3262,7,3264,3265,7,3267,3268,7,3271,3272,7,3276,3277,5,3298,3299,5,3330,3331,7,3390,3390,5,3393,3396,5,3402,3404,7,3406,3406,1,3426,3427,5,3458,3459,7,3535,3535,5,3538,3540,5,3544,3550,7,3570,3571,7,3635,3635,7,3655,3662,5,3763,3763,7,3784,3789,5,3893,3893,5,3897,3897,5,3953,3966,5,3968,3972,5,3981,3991,5,4038,4038,5,4145,4145,7,4153,4154,5,4157,4158,5,4184,4185,5,4209,4212,5,4228,4228,7,4237,4237,5,4352,4447,8,4520,4607,10,5906,5908,5,5938,5939,5,5970,5971,5,6068,6069,5,6071,6077,5,6086,6086,5,6089,6099,5,6155,6157,5,6159,6159,5,6313,6313,5,6435,6438,7,6441,6443,7,6450,6450,5,6457,6459,5,6681,6682,7,6741,6741,7,6743,6743,7,6752,6752,5,6757,6764,5,6771,6780,5,6832,6845,5,6847,6862,5,6916,6916,7,6965,6965,5,6971,6971,7,6973,6977,7,6979,6980,7,7040,7041,5,7073,7073,7,7078,7079,7,7082,7082,7,7142,7142,5,7144,7145,5,7149,7149,5,7151,7153,5,7204,7211,7,7220,7221,7,7376,7378,5,7393,7393,7,7405,7405,5,7415,7415,7,7616,7679,5,8204,8204,5,8206,8207,4,8233,8233,4,8252,8252,14,8288,8292,4,8294,8303,4,8413,8416,5,8418,8420,5,8482,8482,14,8596,8601,14,8986,8987,14,9096,9096,14,9193,9196,14,9199,9199,14,9201,9202,14,9208,9210,14,9642,9643,14,9664,9664,14,9728,9729,14,9732,9732,14,9735,9741,14,9743,9744,14,9746,9746,14,9750,9751,14,9753,9756,14,9758,9759,14,9761,9761,14,9764,9765,14,9767,9769,14,9771,9773,14,9775,9775,14,9784,9785,14,9787,9791,14,9793,9793,14,9795,9799,14,9812,9822,14,9824,9824,14,9827,9827,14,9829,9830,14,9832,9832,14,9851,9851,14,9854,9854,14,9856,9861,14,9874,9874,14,9876,9876,14,9878,9879,14,9881,9881,14,9883,9884,14,9888,9889,14,9895,9895,14,9898,9899,14,9904,9905,14,9917,9918,14,9924,9925,14,9928,9928,14,9934,9934,14,9936,9936,14,9938,9938,14,9940,9940,14,9961,9961,14,9963,9967,14,9970,9971,14,9973,9973,14,9975,9977,14,9979,9980,14,9982,9985,14,9987,9988,14,9992,9996,14,9998,9998,14,10000,10001,14,10004,10004,14,10013,10013,14,10024,10024,14,10052,10052,14,10060,10060,14,10067,10069,14,10083,10083,14,10085,10087,14,10145,10145,14,10175,10175,14,11013,11015,14,11088,11088,14,11503,11505,5,11744,11775,5,12334,12335,5,12349,12349,14,12951,12951,14,42607,42607,5,42612,42621,5,42736,42737,5,43014,43014,5,43043,43044,7,43047,43047,7,43136,43137,7,43204,43205,5,43263,43263,5,43335,43345,5,43360,43388,8,43395,43395,7,43444,43445,7,43450,43451,7,43454,43456,7,43561,43566,5,43569,43570,5,43573,43574,5,43596,43596,5,43644,43644,5,43698,43700,5,43710,43711,5,43755,43755,7,43758,43759,7,43766,43766,5,44005,44005,5,44008,44008,5,44012,44012,7,44032,44032,11,44060,44060,11,44088,44088,11,44116,44116,11,44144,44144,11,44172,44172,11,44200,44200,11,44228,44228,11,44256,44256,11,44284,44284,11,44312,44312,11,44340,44340,11,44368,44368,11,44396,44396,11,44424,44424,11,44452,44452,11,44480,44480,11,44508,44508,11,44536,44536,11,44564,44564,11,44592,44592,11,44620,44620,11,44648,44648,11,44676,44676,11,44704,44704,11,44732,44732,11,44760,44760,11,44788,44788,11,44816,44816,11,44844,44844,11,44872,44872,11,44900,44900,11,44928,44928,11,44956,44956,11,44984,44984,11,45012,45012,11,45040,45040,11,45068,45068,11,45096,45096,11,45124,45124,11,45152,45152,11,45180,45180,11,45208,45208,11,45236,45236,11,45264,45264,11,45292,45292,11,45320,45320,11,45348,45348,11,45376,45376,11,45404,45404,11,45432,45432,11,45460,45460,11,45488,45488,11,45516,45516,11,45544,45544,11,45572,45572,11,45600,45600,11,45628,45628,11,45656,45656,11,45684,45684,11,45712,45712,11,45740,45740,11,45768,45768,11,45796,45796,11,45824,45824,11,45852,45852,11,45880,45880,11,45908,45908,11,45936,45936,11,45964,45964,11,45992,45992,11,46020,46020,11,46048,46048,11,46076,46076,11,46104,46104,11,46132,46132,11,46160,46160,11,46188,46188,11,46216,46216,11,46244,46244,11,46272,46272,11,46300,46300,11,46328,46328,11,46356,46356,11,46384,46384,11,46412,46412,11,46440,46440,11,46468,46468,11,46496,46496,11,46524,46524,11,46552,46552,11,46580,46580,11,46608,46608,11,46636,46636,11,46664,46664,11,46692,46692,11,46720,46720,11,46748,46748,11,46776,46776,11,46804,46804,11,46832,46832,11,46860,46860,11,46888,46888,11,46916,46916,11,46944,46944,11,46972,46972,11,47000,47000,11,47028,47028,11,47056,47056,11,47084,47084,11,47112,47112,11,47140,47140,11,47168,47168,11,47196,47196,11,47224,47224,11,47252,47252,11,47280,47280,11,47308,47308,11,47336,47336,11,47364,47364,11,47392,47392,11,47420,47420,11,47448,47448,11,47476,47476,11,47504,47504,11,47532,47532,11,47560,47560,11,47588,47588,11,47616,47616,11,47644,47644,11,47672,47672,11,47700,47700,11,47728,47728,11,47756,47756,11,47784,47784,11,47812,47812,11,47840,47840,11,47868,47868,11,47896,47896,11,47924,47924,11,47952,47952,11,47980,47980,11,48008,48008,11,48036,48036,11,48064,48064,11,48092,48092,11,48120,48120,11,48148,48148,11,48176,48176,11,48204,48204,11,48232,48232,11,48260,48260,11,48288,48288,11,48316,48316,11,48344,48344,11,48372,48372,11,48400,48400,11,48428,48428,11,48456,48456,11,48484,48484,11,48512,48512,11,48540,48540,11,48568,48568,11,48596,48596,11,48624,48624,11,48652,48652,11,48680,48680,11,48708,48708,11,48736,48736,11,48764,48764,11,48792,48792,11,48820,48820,11,48848,48848,11,48876,48876,11,48904,48904,11,48932,48932,11,48960,48960,11,48988,48988,11,49016,49016,11,49044,49044,11,49072,49072,11,49100,49100,11,49128,49128,11,49156,49156,11,49184,49184,11,49212,49212,11,49240,49240,11,49268,49268,11,49296,49296,11,49324,49324,11,49352,49352,11,49380,49380,11,49408,49408,11,49436,49436,11,49464,49464,11,49492,49492,11,49520,49520,11,49548,49548,11,49576,49576,11,49604,49604,11,49632,49632,11,49660,49660,11,49688,49688,11,49716,49716,11,49744,49744,11,49772,49772,11,49800,49800,11,49828,49828,11,49856,49856,11,49884,49884,11,49912,49912,11,49940,49940,11,49968,49968,11,49996,49996,11,50024,50024,11,50052,50052,11,50080,50080,11,50108,50108,11,50136,50136,11,50164,50164,11,50192,50192,11,50220,50220,11,50248,50248,11,50276,50276,11,50304,50304,11,50332,50332,11,50360,50360,11,50388,50388,11,50416,50416,11,50444,50444,11,50472,50472,11,50500,50500,11,50528,50528,11,50556,50556,11,50584,50584,11,50612,50612,11,50640,50640,11,50668,50668,11,50696,50696,11,50724,50724,11,50752,50752,11,50780,50780,11,50808,50808,11,50836,50836,11,50864,50864,11,50892,50892,11,50920,50920,11,50948,50948,11,50976,50976,11,51004,51004,11,51032,51032,11,51060,51060,11,51088,51088,11,51116,51116,11,51144,51144,11,51172,51172,11,51200,51200,11,51228,51228,11,51256,51256,11,51284,51284,11,51312,51312,11,51340,51340,11,51368,51368,11,51396,51396,11,51424,51424,11,51452,51452,11,51480,51480,11,51508,51508,11,51536,51536,11,51564,51564,11,51592,51592,11,51620,51620,11,51648,51648,11,51676,51676,11,51704,51704,11,51732,51732,11,51760,51760,11,51788,51788,11,51816,51816,11,51844,51844,11,51872,51872,11,51900,51900,11,51928,51928,11,51956,51956,11,51984,51984,11,52012,52012,11,52040,52040,11,52068,52068,11,52096,52096,11,52124,52124,11,52152,52152,11,52180,52180,11,52208,52208,11,52236,52236,11,52264,52264,11,52292,52292,11,52320,52320,11,52348,52348,11,52376,52376,11,52404,52404,11,52432,52432,11,52460,52460,11,52488,52488,11,52516,52516,11,52544,52544,11,52572,52572,11,52600,52600,11,52628,52628,11,52656,52656,11,52684,52684,11,52712,52712,11,52740,52740,11,52768,52768,11,52796,52796,11,52824,52824,11,52852,52852,11,52880,52880,11,52908,52908,11,52936,52936,11,52964,52964,11,52992,52992,11,53020,53020,11,53048,53048,11,53076,53076,11,53104,53104,11,53132,53132,11,53160,53160,11,53188,53188,11,53216,53216,11,53244,53244,11,53272,53272,11,53300,53300,11,53328,53328,11,53356,53356,11,53384,53384,11,53412,53412,11,53440,53440,11,53468,53468,11,53496,53496,11,53524,53524,11,53552,53552,11,53580,53580,11,53608,53608,11,53636,53636,11,53664,53664,11,53692,53692,11,53720,53720,11,53748,53748,11,53776,53776,11,53804,53804,11,53832,53832,11,53860,53860,11,53888,53888,11,53916,53916,11,53944,53944,11,53972,53972,11,54000,54000,11,54028,54028,11,54056,54056,11,54084,54084,11,54112,54112,11,54140,54140,11,54168,54168,11,54196,54196,11,54224,54224,11,54252,54252,11,54280,54280,11,54308,54308,11,54336,54336,11,54364,54364,11,54392,54392,11,54420,54420,11,54448,54448,11,54476,54476,11,54504,54504,11,54532,54532,11,54560,54560,11,54588,54588,11,54616,54616,11,54644,54644,11,54672,54672,11,54700,54700,11,54728,54728,11,54756,54756,11,54784,54784,11,54812,54812,11,54840,54840,11,54868,54868,11,54896,54896,11,54924,54924,11,54952,54952,11,54980,54980,11,55008,55008,11,55036,55036,11,55064,55064,11,55092,55092,11,55120,55120,11,55148,55148,11,55176,55176,11,55216,55238,9,64286,64286,5,65056,65071,5,65438,65439,5,65529,65531,4,66272,66272,5,68097,68099,5,68108,68111,5,68159,68159,5,68900,68903,5,69446,69456,5,69632,69632,7,69634,69634,7,69744,69744,5,69759,69761,5,69808,69810,7,69815,69816,7,69821,69821,1,69837,69837,1,69927,69931,5,69933,69940,5,70003,70003,5,70018,70018,7,70070,70078,5,70082,70083,1,70094,70094,7,70188,70190,7,70194,70195,7,70197,70197,7,70206,70206,5,70368,70370,7,70400,70401,5,70459,70460,5,70463,70463,7,70465,70468,7,70475,70477,7,70498,70499,7,70512,70516,5,70712,70719,5,70722,70724,5,70726,70726,5,70832,70832,5,70835,70840,5,70842,70842,5,70845,70845,5,70847,70848,5,70850,70851,5,71088,71089,7,71096,71099,7,71102,71102,7,71132,71133,5,71219,71226,5,71229,71229,5,71231,71232,5,71340,71340,7,71342,71343,7,71350,71350,7,71453,71455,5,71462,71462,7,71724,71726,7,71736,71736,7,71984,71984,5,71991,71992,7,71997,71997,7,71999,71999,1,72001,72001,1,72003,72003,5,72148,72151,5,72156,72159,7,72164,72164,7,72243,72248,5,72250,72250,1,72263,72263,5,72279,72280,7,72324,72329,1,72343,72343,7,72751,72751,7,72760,72765,5,72767,72767,5,72873,72873,7,72881,72881,7,72884,72884,7,73009,73014,5,73020,73021,5,73030,73030,1,73098,73102,7,73107,73108,7,73110,73110,7,73459,73460,5,78896,78904,4,92976,92982,5,94033,94087,7,94180,94180,5,113821,113822,5,118528,118573,5,119141,119141,5,119143,119145,5,119150,119154,5,119163,119170,5,119210,119213,5,121344,121398,5,121461,121461,5,121499,121503,5,122880,122886,5,122907,122913,5,122918,122922,5,123566,123566,5,125136,125142,5,126976,126979,14,126981,127182,14,127184,127231,14,127279,127279,14,127344,127345,14,127374,127374,14,127405,127461,14,127489,127490,14,127514,127514,14,127538,127546,14,127561,127567,14,127570,127743,14,127757,127758,14,127760,127760,14,127762,127762,14,127766,127768,14,127770,127770,14,127772,127772,14,127775,127776,14,127778,127779,14,127789,127791,14,127794,127795,14,127798,127798,14,127819,127819,14,127824,127824,14,127868,127868,14,127870,127871,14,127892,127893,14,127896,127896,14,127900,127901,14,127904,127940,14,127942,127942,14,127944,127944,14,127946,127946,14,127951,127955,14,127968,127971,14,127973,127984,14,127987,127987,14,127989,127989,14,127991,127991,14,127995,127999,5,128008,128008,14,128012,128014,14,128017,128018,14,128020,128020,14,128022,128022,14,128042,128042,14,128063,128063,14,128065,128065,14,128101,128101,14,128108,128109,14,128173,128173,14,128182,128183,14,128236,128237,14,128239,128239,14,128245,128245,14,128248,128248,14,128253,128253,14,128255,128258,14,128260,128263,14,128265,128265,14,128277,128277,14,128300,128301,14,128326,128328,14,128331,128334,14,128336,128347,14,128360,128366,14,128369,128370,14,128378,128378,14,128391,128391,14,128394,128397,14,128400,128400,14,128405,128406,14,128420,128420,14,128422,128423,14,128425,128432,14,128435,128443,14,128445,128449,14,128453,128464,14,128468,128475,14,128479,128480,14,128482,128482,14,128484,128487,14,128489,128494,14,128496,128498,14,128500,128505,14,128507,128511,14,128513,128518,14,128521,128525,14,128527,128527,14,128529,128529,14,128533,128533,14,128535,128535,14,128537,128537,14]',
        );
      }
      function ie(P, O) {
        if (P === 0) return 0;
        const W = fe(P, O);
        if (W !== void 0) return W;
        const $ = new T(O, P);
        return $.prevCodePoint(), $.offset;
      }
      n.getLeftDeleteOffset = ie;
      function fe(P, O) {
        const W = new T(O, P);
        let $ = W.prevCodePoint();
        for (; we($) || $ === 65039 || $ === 8419; ) {
          if (W.offset === 0) return;
          $ = W.prevCodePoint();
        }
        if (!Se($)) return;
        let ee = W.offset;
        return ee > 0 && W.prevCodePoint() === 8205 && (ee = W.offset), ee;
      }
      function we(P) {
        return 127995 <= P && P <= 127999;
      }
      n.noBreakWhitespace = '\xA0';
      class ce {
        static getInstance(O) {
          return ce.cache.get(Array.from(O));
        }
        static getLocales() {
          return ce._locales.value;
        }
        constructor(O) {
          this.confusableDictionary = O;
        }
        isAmbiguous(O) {
          return this.confusableDictionary.has(O);
        }
        getPrimaryConfusable(O) {
          return this.confusableDictionary.get(O);
        }
        getConfusableCodePoints() {
          return new Set(this.confusableDictionary.keys());
        }
      }
      (n.AmbiguousCharacters = ce),
        (i = ce),
        (ce.ambiguousCharacterData = new M.Lazy(() =>
          JSON.parse(
            '{"_common":[8232,32,8233,32,5760,32,8192,32,8193,32,8194,32,8195,32,8196,32,8197,32,8198,32,8200,32,8201,32,8202,32,8287,32,8199,32,8239,32,2042,95,65101,95,65102,95,65103,95,8208,45,8209,45,8210,45,65112,45,1748,45,8259,45,727,45,8722,45,10134,45,11450,45,1549,44,1643,44,8218,44,184,44,42233,44,894,59,2307,58,2691,58,1417,58,1795,58,1796,58,5868,58,65072,58,6147,58,6153,58,8282,58,1475,58,760,58,42889,58,8758,58,720,58,42237,58,451,33,11601,33,660,63,577,63,2429,63,5038,63,42731,63,119149,46,8228,46,1793,46,1794,46,42510,46,68176,46,1632,46,1776,46,42232,46,1373,96,65287,96,8219,96,8242,96,1370,96,1523,96,8175,96,65344,96,900,96,8189,96,8125,96,8127,96,8190,96,697,96,884,96,712,96,714,96,715,96,756,96,699,96,701,96,700,96,702,96,42892,96,1497,96,2036,96,2037,96,5194,96,5836,96,94033,96,94034,96,65339,91,10088,40,10098,40,12308,40,64830,40,65341,93,10089,41,10099,41,12309,41,64831,41,10100,123,119060,123,10101,125,65342,94,8270,42,1645,42,8727,42,66335,42,5941,47,8257,47,8725,47,8260,47,9585,47,10187,47,10744,47,119354,47,12755,47,12339,47,11462,47,20031,47,12035,47,65340,92,65128,92,8726,92,10189,92,10741,92,10745,92,119311,92,119355,92,12756,92,20022,92,12034,92,42872,38,708,94,710,94,5869,43,10133,43,66203,43,8249,60,10094,60,706,60,119350,60,5176,60,5810,60,5120,61,11840,61,12448,61,42239,61,8250,62,10095,62,707,62,119351,62,5171,62,94015,62,8275,126,732,126,8128,126,8764,126,65372,124,65293,45,120784,50,120794,50,120804,50,120814,50,120824,50,130034,50,42842,50,423,50,1000,50,42564,50,5311,50,42735,50,119302,51,120785,51,120795,51,120805,51,120815,51,120825,51,130035,51,42923,51,540,51,439,51,42858,51,11468,51,1248,51,94011,51,71882,51,120786,52,120796,52,120806,52,120816,52,120826,52,130036,52,5070,52,71855,52,120787,53,120797,53,120807,53,120817,53,120827,53,130037,53,444,53,71867,53,120788,54,120798,54,120808,54,120818,54,120828,54,130038,54,11474,54,5102,54,71893,54,119314,55,120789,55,120799,55,120809,55,120819,55,120829,55,130039,55,66770,55,71878,55,2819,56,2538,56,2666,56,125131,56,120790,56,120800,56,120810,56,120820,56,120830,56,130040,56,547,56,546,56,66330,56,2663,57,2920,57,2541,57,3437,57,120791,57,120801,57,120811,57,120821,57,120831,57,130041,57,42862,57,11466,57,71884,57,71852,57,71894,57,9082,97,65345,97,119834,97,119886,97,119938,97,119990,97,120042,97,120094,97,120146,97,120198,97,120250,97,120302,97,120354,97,120406,97,120458,97,593,97,945,97,120514,97,120572,97,120630,97,120688,97,120746,97,65313,65,119808,65,119860,65,119912,65,119964,65,120016,65,120068,65,120120,65,120172,65,120224,65,120276,65,120328,65,120380,65,120432,65,913,65,120488,65,120546,65,120604,65,120662,65,120720,65,5034,65,5573,65,42222,65,94016,65,66208,65,119835,98,119887,98,119939,98,119991,98,120043,98,120095,98,120147,98,120199,98,120251,98,120303,98,120355,98,120407,98,120459,98,388,98,5071,98,5234,98,5551,98,65314,66,8492,66,119809,66,119861,66,119913,66,120017,66,120069,66,120121,66,120173,66,120225,66,120277,66,120329,66,120381,66,120433,66,42932,66,914,66,120489,66,120547,66,120605,66,120663,66,120721,66,5108,66,5623,66,42192,66,66178,66,66209,66,66305,66,65347,99,8573,99,119836,99,119888,99,119940,99,119992,99,120044,99,120096,99,120148,99,120200,99,120252,99,120304,99,120356,99,120408,99,120460,99,7428,99,1010,99,11429,99,43951,99,66621,99,128844,67,71922,67,71913,67,65315,67,8557,67,8450,67,8493,67,119810,67,119862,67,119914,67,119966,67,120018,67,120174,67,120226,67,120278,67,120330,67,120382,67,120434,67,1017,67,11428,67,5087,67,42202,67,66210,67,66306,67,66581,67,66844,67,8574,100,8518,100,119837,100,119889,100,119941,100,119993,100,120045,100,120097,100,120149,100,120201,100,120253,100,120305,100,120357,100,120409,100,120461,100,1281,100,5095,100,5231,100,42194,100,8558,68,8517,68,119811,68,119863,68,119915,68,119967,68,120019,68,120071,68,120123,68,120175,68,120227,68,120279,68,120331,68,120383,68,120435,68,5024,68,5598,68,5610,68,42195,68,8494,101,65349,101,8495,101,8519,101,119838,101,119890,101,119942,101,120046,101,120098,101,120150,101,120202,101,120254,101,120306,101,120358,101,120410,101,120462,101,43826,101,1213,101,8959,69,65317,69,8496,69,119812,69,119864,69,119916,69,120020,69,120072,69,120124,69,120176,69,120228,69,120280,69,120332,69,120384,69,120436,69,917,69,120492,69,120550,69,120608,69,120666,69,120724,69,11577,69,5036,69,42224,69,71846,69,71854,69,66182,69,119839,102,119891,102,119943,102,119995,102,120047,102,120099,102,120151,102,120203,102,120255,102,120307,102,120359,102,120411,102,120463,102,43829,102,42905,102,383,102,7837,102,1412,102,119315,70,8497,70,119813,70,119865,70,119917,70,120021,70,120073,70,120125,70,120177,70,120229,70,120281,70,120333,70,120385,70,120437,70,42904,70,988,70,120778,70,5556,70,42205,70,71874,70,71842,70,66183,70,66213,70,66853,70,65351,103,8458,103,119840,103,119892,103,119944,103,120048,103,120100,103,120152,103,120204,103,120256,103,120308,103,120360,103,120412,103,120464,103,609,103,7555,103,397,103,1409,103,119814,71,119866,71,119918,71,119970,71,120022,71,120074,71,120126,71,120178,71,120230,71,120282,71,120334,71,120386,71,120438,71,1292,71,5056,71,5107,71,42198,71,65352,104,8462,104,119841,104,119945,104,119997,104,120049,104,120101,104,120153,104,120205,104,120257,104,120309,104,120361,104,120413,104,120465,104,1211,104,1392,104,5058,104,65320,72,8459,72,8460,72,8461,72,119815,72,119867,72,119919,72,120023,72,120179,72,120231,72,120283,72,120335,72,120387,72,120439,72,919,72,120494,72,120552,72,120610,72,120668,72,120726,72,11406,72,5051,72,5500,72,42215,72,66255,72,731,105,9075,105,65353,105,8560,105,8505,105,8520,105,119842,105,119894,105,119946,105,119998,105,120050,105,120102,105,120154,105,120206,105,120258,105,120310,105,120362,105,120414,105,120466,105,120484,105,618,105,617,105,953,105,8126,105,890,105,120522,105,120580,105,120638,105,120696,105,120754,105,1110,105,42567,105,1231,105,43893,105,5029,105,71875,105,65354,106,8521,106,119843,106,119895,106,119947,106,119999,106,120051,106,120103,106,120155,106,120207,106,120259,106,120311,106,120363,106,120415,106,120467,106,1011,106,1112,106,65322,74,119817,74,119869,74,119921,74,119973,74,120025,74,120077,74,120129,74,120181,74,120233,74,120285,74,120337,74,120389,74,120441,74,42930,74,895,74,1032,74,5035,74,5261,74,42201,74,119844,107,119896,107,119948,107,120000,107,120052,107,120104,107,120156,107,120208,107,120260,107,120312,107,120364,107,120416,107,120468,107,8490,75,65323,75,119818,75,119870,75,119922,75,119974,75,120026,75,120078,75,120130,75,120182,75,120234,75,120286,75,120338,75,120390,75,120442,75,922,75,120497,75,120555,75,120613,75,120671,75,120729,75,11412,75,5094,75,5845,75,42199,75,66840,75,1472,108,8739,73,9213,73,65512,73,1633,108,1777,73,66336,108,125127,108,120783,73,120793,73,120803,73,120813,73,120823,73,130033,73,65321,73,8544,73,8464,73,8465,73,119816,73,119868,73,119920,73,120024,73,120128,73,120180,73,120232,73,120284,73,120336,73,120388,73,120440,73,65356,108,8572,73,8467,108,119845,108,119897,108,119949,108,120001,108,120053,108,120105,73,120157,73,120209,73,120261,73,120313,73,120365,73,120417,73,120469,73,448,73,120496,73,120554,73,120612,73,120670,73,120728,73,11410,73,1030,73,1216,73,1493,108,1503,108,1575,108,126464,108,126592,108,65166,108,65165,108,1994,108,11599,73,5825,73,42226,73,93992,73,66186,124,66313,124,119338,76,8556,76,8466,76,119819,76,119871,76,119923,76,120027,76,120079,76,120131,76,120183,76,120235,76,120287,76,120339,76,120391,76,120443,76,11472,76,5086,76,5290,76,42209,76,93974,76,71843,76,71858,76,66587,76,66854,76,65325,77,8559,77,8499,77,119820,77,119872,77,119924,77,120028,77,120080,77,120132,77,120184,77,120236,77,120288,77,120340,77,120392,77,120444,77,924,77,120499,77,120557,77,120615,77,120673,77,120731,77,1018,77,11416,77,5047,77,5616,77,5846,77,42207,77,66224,77,66321,77,119847,110,119899,110,119951,110,120003,110,120055,110,120107,110,120159,110,120211,110,120263,110,120315,110,120367,110,120419,110,120471,110,1400,110,1404,110,65326,78,8469,78,119821,78,119873,78,119925,78,119977,78,120029,78,120081,78,120185,78,120237,78,120289,78,120341,78,120393,78,120445,78,925,78,120500,78,120558,78,120616,78,120674,78,120732,78,11418,78,42208,78,66835,78,3074,111,3202,111,3330,111,3458,111,2406,111,2662,111,2790,111,3046,111,3174,111,3302,111,3430,111,3664,111,3792,111,4160,111,1637,111,1781,111,65359,111,8500,111,119848,111,119900,111,119952,111,120056,111,120108,111,120160,111,120212,111,120264,111,120316,111,120368,111,120420,111,120472,111,7439,111,7441,111,43837,111,959,111,120528,111,120586,111,120644,111,120702,111,120760,111,963,111,120532,111,120590,111,120648,111,120706,111,120764,111,11423,111,4351,111,1413,111,1505,111,1607,111,126500,111,126564,111,126596,111,65259,111,65260,111,65258,111,65257,111,1726,111,64428,111,64429,111,64427,111,64426,111,1729,111,64424,111,64425,111,64423,111,64422,111,1749,111,3360,111,4125,111,66794,111,71880,111,71895,111,66604,111,1984,79,2534,79,2918,79,12295,79,70864,79,71904,79,120782,79,120792,79,120802,79,120812,79,120822,79,130032,79,65327,79,119822,79,119874,79,119926,79,119978,79,120030,79,120082,79,120134,79,120186,79,120238,79,120290,79,120342,79,120394,79,120446,79,927,79,120502,79,120560,79,120618,79,120676,79,120734,79,11422,79,1365,79,11604,79,4816,79,2848,79,66754,79,42227,79,71861,79,66194,79,66219,79,66564,79,66838,79,9076,112,65360,112,119849,112,119901,112,119953,112,120005,112,120057,112,120109,112,120161,112,120213,112,120265,112,120317,112,120369,112,120421,112,120473,112,961,112,120530,112,120544,112,120588,112,120602,112,120646,112,120660,112,120704,112,120718,112,120762,112,120776,112,11427,112,65328,80,8473,80,119823,80,119875,80,119927,80,119979,80,120031,80,120083,80,120187,80,120239,80,120291,80,120343,80,120395,80,120447,80,929,80,120504,80,120562,80,120620,80,120678,80,120736,80,11426,80,5090,80,5229,80,42193,80,66197,80,119850,113,119902,113,119954,113,120006,113,120058,113,120110,113,120162,113,120214,113,120266,113,120318,113,120370,113,120422,113,120474,113,1307,113,1379,113,1382,113,8474,81,119824,81,119876,81,119928,81,119980,81,120032,81,120084,81,120188,81,120240,81,120292,81,120344,81,120396,81,120448,81,11605,81,119851,114,119903,114,119955,114,120007,114,120059,114,120111,114,120163,114,120215,114,120267,114,120319,114,120371,114,120423,114,120475,114,43847,114,43848,114,7462,114,11397,114,43905,114,119318,82,8475,82,8476,82,8477,82,119825,82,119877,82,119929,82,120033,82,120189,82,120241,82,120293,82,120345,82,120397,82,120449,82,422,82,5025,82,5074,82,66740,82,5511,82,42211,82,94005,82,65363,115,119852,115,119904,115,119956,115,120008,115,120060,115,120112,115,120164,115,120216,115,120268,115,120320,115,120372,115,120424,115,120476,115,42801,115,445,115,1109,115,43946,115,71873,115,66632,115,65331,83,119826,83,119878,83,119930,83,119982,83,120034,83,120086,83,120138,83,120190,83,120242,83,120294,83,120346,83,120398,83,120450,83,1029,83,1359,83,5077,83,5082,83,42210,83,94010,83,66198,83,66592,83,119853,116,119905,116,119957,116,120009,116,120061,116,120113,116,120165,116,120217,116,120269,116,120321,116,120373,116,120425,116,120477,116,8868,84,10201,84,128872,84,65332,84,119827,84,119879,84,119931,84,119983,84,120035,84,120087,84,120139,84,120191,84,120243,84,120295,84,120347,84,120399,84,120451,84,932,84,120507,84,120565,84,120623,84,120681,84,120739,84,11430,84,5026,84,42196,84,93962,84,71868,84,66199,84,66225,84,66325,84,119854,117,119906,117,119958,117,120010,117,120062,117,120114,117,120166,117,120218,117,120270,117,120322,117,120374,117,120426,117,120478,117,42911,117,7452,117,43854,117,43858,117,651,117,965,117,120534,117,120592,117,120650,117,120708,117,120766,117,1405,117,66806,117,71896,117,8746,85,8899,85,119828,85,119880,85,119932,85,119984,85,120036,85,120088,85,120140,85,120192,85,120244,85,120296,85,120348,85,120400,85,120452,85,1357,85,4608,85,66766,85,5196,85,42228,85,94018,85,71864,85,8744,118,8897,118,65366,118,8564,118,119855,118,119907,118,119959,118,120011,118,120063,118,120115,118,120167,118,120219,118,120271,118,120323,118,120375,118,120427,118,120479,118,7456,118,957,118,120526,118,120584,118,120642,118,120700,118,120758,118,1141,118,1496,118,71430,118,43945,118,71872,118,119309,86,1639,86,1783,86,8548,86,119829,86,119881,86,119933,86,119985,86,120037,86,120089,86,120141,86,120193,86,120245,86,120297,86,120349,86,120401,86,120453,86,1140,86,11576,86,5081,86,5167,86,42719,86,42214,86,93960,86,71840,86,66845,86,623,119,119856,119,119908,119,119960,119,120012,119,120064,119,120116,119,120168,119,120220,119,120272,119,120324,119,120376,119,120428,119,120480,119,7457,119,1121,119,1309,119,1377,119,71434,119,71438,119,71439,119,43907,119,71919,87,71910,87,119830,87,119882,87,119934,87,119986,87,120038,87,120090,87,120142,87,120194,87,120246,87,120298,87,120350,87,120402,87,120454,87,1308,87,5043,87,5076,87,42218,87,5742,120,10539,120,10540,120,10799,120,65368,120,8569,120,119857,120,119909,120,119961,120,120013,120,120065,120,120117,120,120169,120,120221,120,120273,120,120325,120,120377,120,120429,120,120481,120,5441,120,5501,120,5741,88,9587,88,66338,88,71916,88,65336,88,8553,88,119831,88,119883,88,119935,88,119987,88,120039,88,120091,88,120143,88,120195,88,120247,88,120299,88,120351,88,120403,88,120455,88,42931,88,935,88,120510,88,120568,88,120626,88,120684,88,120742,88,11436,88,11613,88,5815,88,42219,88,66192,88,66228,88,66327,88,66855,88,611,121,7564,121,65369,121,119858,121,119910,121,119962,121,120014,121,120066,121,120118,121,120170,121,120222,121,120274,121,120326,121,120378,121,120430,121,120482,121,655,121,7935,121,43866,121,947,121,8509,121,120516,121,120574,121,120632,121,120690,121,120748,121,1199,121,4327,121,71900,121,65337,89,119832,89,119884,89,119936,89,119988,89,120040,89,120092,89,120144,89,120196,89,120248,89,120300,89,120352,89,120404,89,120456,89,933,89,978,89,120508,89,120566,89,120624,89,120682,89,120740,89,11432,89,1198,89,5033,89,5053,89,42220,89,94019,89,71844,89,66226,89,119859,122,119911,122,119963,122,120015,122,120067,122,120119,122,120171,122,120223,122,120275,122,120327,122,120379,122,120431,122,120483,122,7458,122,43923,122,71876,122,66293,90,71909,90,65338,90,8484,90,8488,90,119833,90,119885,90,119937,90,119989,90,120041,90,120197,90,120249,90,120301,90,120353,90,120405,90,120457,90,918,90,120493,90,120551,90,120609,90,120667,90,120725,90,5059,90,42204,90,71849,90,65282,34,65284,36,65285,37,65286,38,65290,42,65291,43,65294,46,65295,47,65296,48,65297,49,65298,50,65299,51,65300,52,65301,53,65302,54,65303,55,65304,56,65305,57,65308,60,65309,61,65310,62,65312,64,65316,68,65318,70,65319,71,65324,76,65329,81,65330,82,65333,85,65334,86,65335,87,65343,95,65346,98,65348,100,65350,102,65355,107,65357,109,65358,110,65361,113,65362,114,65364,116,65365,117,65367,119,65370,122,65371,123,65373,125,119846,109],"_default":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"cs":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"de":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"es":[8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"fr":[65374,126,65306,58,65281,33,8216,96,8245,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"it":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"ja":[8211,45,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65292,44,65307,59],"ko":[8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"pl":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"pt-BR":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"qps-ploc":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"ru":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,305,105,921,73,1009,112,215,120,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"tr":[160,32,8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"zh-hans":[65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41],"zh-hant":[8211,45,65374,126,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65307,59]}',
          ),
        )),
        (ce.cache = new R.LRUCachedFunction(P => {
          function O(le) {
            const _e = new Map();
            for (let Ce = 0; Ce < le.length; Ce += 2)
              _e.set(le[Ce], le[Ce + 1]);
            return _e;
          }
          function W(le, _e) {
            const Ce = new Map(le);
            for (const [Ae, Ne] of _e) Ce.set(Ae, Ne);
            return Ce;
          }
          function $(le, _e) {
            if (!le) return _e;
            const Ce = new Map();
            for (const [Ae, Ne] of le) _e.has(Ae) && Ce.set(Ae, Ne);
            return Ce;
          }
          const ee = i.ambiguousCharacterData.value;
          let ae = P.filter(le => !le.startsWith('_') && le in ee);
          ae.length === 0 && (ae = ['_default']);
          let de;
          for (const le of ae) {
            const _e = O(ee[le]);
            de = $(de, _e);
          }
          const ye = O(ee._common),
            pe = W(ye, de);
          return new ce(pe);
        })),
        (ce._locales = new M.Lazy(() =>
          Object.keys(ce.ambiguousCharacterData.value).filter(
            P => !P.startsWith('_'),
          ),
        ));
      class ve {
        static getRawData() {
          return JSON.parse(
            '[9,10,11,12,13,32,127,160,173,847,1564,4447,4448,6068,6069,6155,6156,6157,6158,7355,7356,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8203,8204,8205,8206,8207,8234,8235,8236,8237,8238,8239,8287,8288,8289,8290,8291,8292,8293,8294,8295,8296,8297,8298,8299,8300,8301,8302,8303,10240,12288,12644,65024,65025,65026,65027,65028,65029,65030,65031,65032,65033,65034,65035,65036,65037,65038,65039,65279,65440,65520,65521,65522,65523,65524,65525,65526,65527,65528,65532,78844,119155,119156,119157,119158,119159,119160,119161,119162,917504,917505,917506,917507,917508,917509,917510,917511,917512,917513,917514,917515,917516,917517,917518,917519,917520,917521,917522,917523,917524,917525,917526,917527,917528,917529,917530,917531,917532,917533,917534,917535,917536,917537,917538,917539,917540,917541,917542,917543,917544,917545,917546,917547,917548,917549,917550,917551,917552,917553,917554,917555,917556,917557,917558,917559,917560,917561,917562,917563,917564,917565,917566,917567,917568,917569,917570,917571,917572,917573,917574,917575,917576,917577,917578,917579,917580,917581,917582,917583,917584,917585,917586,917587,917588,917589,917590,917591,917592,917593,917594,917595,917596,917597,917598,917599,917600,917601,917602,917603,917604,917605,917606,917607,917608,917609,917610,917611,917612,917613,917614,917615,917616,917617,917618,917619,917620,917621,917622,917623,917624,917625,917626,917627,917628,917629,917630,917631,917760,917761,917762,917763,917764,917765,917766,917767,917768,917769,917770,917771,917772,917773,917774,917775,917776,917777,917778,917779,917780,917781,917782,917783,917784,917785,917786,917787,917788,917789,917790,917791,917792,917793,917794,917795,917796,917797,917798,917799,917800,917801,917802,917803,917804,917805,917806,917807,917808,917809,917810,917811,917812,917813,917814,917815,917816,917817,917818,917819,917820,917821,917822,917823,917824,917825,917826,917827,917828,917829,917830,917831,917832,917833,917834,917835,917836,917837,917838,917839,917840,917841,917842,917843,917844,917845,917846,917847,917848,917849,917850,917851,917852,917853,917854,917855,917856,917857,917858,917859,917860,917861,917862,917863,917864,917865,917866,917867,917868,917869,917870,917871,917872,917873,917874,917875,917876,917877,917878,917879,917880,917881,917882,917883,917884,917885,917886,917887,917888,917889,917890,917891,917892,917893,917894,917895,917896,917897,917898,917899,917900,917901,917902,917903,917904,917905,917906,917907,917908,917909,917910,917911,917912,917913,917914,917915,917916,917917,917918,917919,917920,917921,917922,917923,917924,917925,917926,917927,917928,917929,917930,917931,917932,917933,917934,917935,917936,917937,917938,917939,917940,917941,917942,917943,917944,917945,917946,917947,917948,917949,917950,917951,917952,917953,917954,917955,917956,917957,917958,917959,917960,917961,917962,917963,917964,917965,917966,917967,917968,917969,917970,917971,917972,917973,917974,917975,917976,917977,917978,917979,917980,917981,917982,917983,917984,917985,917986,917987,917988,917989,917990,917991,917992,917993,917994,917995,917996,917997,917998,917999]',
          );
        }
        static getData() {
          return (
            this._data || (this._data = new Set(ve.getRawData())), this._data
          );
        }
        static isInvisibleCharacter(O) {
          return ve.getData().has(O);
        }
        static get codePoints() {
          return ve.getData();
        }
      }
      (n.InvisibleCharacters = ve), (ve._data = void 0);
    }),
    Y(X[32], J([0, 1, 5]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.StringSHA1 =
          n.toHexString =
          n.stringHash =
          n.numberHash =
          n.doHash =
          n.hash =
            void 0);
      function M(m) {
        return i(m, 0);
      }
      n.hash = M;
      function i(m, C) {
        switch (typeof m) {
          case 'object':
            return m === null
              ? u(349, C)
              : Array.isArray(m)
              ? a(m, C)
              : s(m, C);
          case 'string':
            return S(m, C);
          case 'boolean':
            return _(m, C);
          case 'number':
            return u(m, C);
          case 'undefined':
            return u(937, C);
          default:
            return u(617, C);
        }
      }
      n.doHash = i;
      function u(m, C) {
        return ((C << 5) - C + m) | 0;
      }
      n.numberHash = u;
      function _(m, C) {
        return u(m ? 433 : 863, C);
      }
      function S(m, C) {
        C = u(149417, C);
        for (let E = 0, L = m.length; E < L; E++) C = u(m.charCodeAt(E), C);
        return C;
      }
      n.stringHash = S;
      function a(m, C) {
        return (C = u(104579, C)), m.reduce((E, L) => i(L, E), C);
      }
      function s(m, C) {
        return (
          (C = u(181387, C)),
          Object.keys(m)
            .sort()
            .reduce((E, L) => ((E = S(L, E)), i(m[L], E)), C)
        );
      }
      function p(m, C, E = 32) {
        const L = E - C,
          N = ~((1 << L) - 1);
        return ((m << C) | ((N & m) >>> L)) >>> 0;
      }
      function e(m, C = 0, E = m.byteLength, L = 0) {
        for (let N = 0; N < E; N++) m[C + N] = L;
      }
      function f(m, C, E = '0') {
        for (; m.length < C; ) m = E + m;
        return m;
      }
      function g(m, C = 32) {
        return m instanceof ArrayBuffer
          ? Array.from(new Uint8Array(m))
              .map(E => E.toString(16).padStart(2, '0'))
              .join('')
          : f((m >>> 0).toString(16), C / 4);
      }
      n.toHexString = g;
      class b {
        constructor() {
          (this._h0 = 1732584193),
            (this._h1 = 4023233417),
            (this._h2 = 2562383102),
            (this._h3 = 271733878),
            (this._h4 = 3285377520),
            (this._buff = new Uint8Array(64 + 3)),
            (this._buffDV = new DataView(this._buff.buffer)),
            (this._buffLen = 0),
            (this._totalLen = 0),
            (this._leftoverHighSurrogate = 0),
            (this._finished = !1);
        }
        update(C) {
          const E = C.length;
          if (E === 0) return;
          const L = this._buff;
          let N = this._buffLen,
            w = this._leftoverHighSurrogate,
            c,
            r;
          for (
            w !== 0
              ? ((c = w), (r = -1), (w = 0))
              : ((c = C.charCodeAt(0)), (r = 0));
            ;

          ) {
            let l = c;
            if (R.isHighSurrogate(c))
              if (r + 1 < E) {
                const h = C.charCodeAt(r + 1);
                R.isLowSurrogate(h)
                  ? (r++, (l = R.computeCodePoint(c, h)))
                  : (l = 65533);
              } else {
                w = c;
                break;
              }
            else R.isLowSurrogate(c) && (l = 65533);
            if (((N = this._push(L, N, l)), r++, r < E)) c = C.charCodeAt(r);
            else break;
          }
          (this._buffLen = N), (this._leftoverHighSurrogate = w);
        }
        _push(C, E, L) {
          return (
            L < 128
              ? (C[E++] = L)
              : L < 2048
              ? ((C[E++] = 192 | ((L & 1984) >>> 6)),
                (C[E++] = 128 | ((L & 63) >>> 0)))
              : L < 65536
              ? ((C[E++] = 224 | ((L & 61440) >>> 12)),
                (C[E++] = 128 | ((L & 4032) >>> 6)),
                (C[E++] = 128 | ((L & 63) >>> 0)))
              : ((C[E++] = 240 | ((L & 1835008) >>> 18)),
                (C[E++] = 128 | ((L & 258048) >>> 12)),
                (C[E++] = 128 | ((L & 4032) >>> 6)),
                (C[E++] = 128 | ((L & 63) >>> 0))),
            E >= 64 &&
              (this._step(),
              (E -= 64),
              (this._totalLen += 64),
              (C[0] = C[64 + 0]),
              (C[1] = C[64 + 1]),
              (C[2] = C[64 + 2])),
            E
          );
        }
        digest() {
          return (
            this._finished ||
              ((this._finished = !0),
              this._leftoverHighSurrogate &&
                ((this._leftoverHighSurrogate = 0),
                (this._buffLen = this._push(this._buff, this._buffLen, 65533))),
              (this._totalLen += this._buffLen),
              this._wrapUp()),
            g(this._h0) + g(this._h1) + g(this._h2) + g(this._h3) + g(this._h4)
          );
        }
        _wrapUp() {
          (this._buff[this._buffLen++] = 128),
            e(this._buff, this._buffLen),
            this._buffLen > 56 && (this._step(), e(this._buff));
          const C = 8 * this._totalLen;
          this._buffDV.setUint32(56, Math.floor(C / 4294967296), !1),
            this._buffDV.setUint32(60, C % 4294967296, !1),
            this._step();
        }
        _step() {
          const C = b._bigBlock32,
            E = this._buffDV;
          for (let o = 0; o < 64; o += 4)
            C.setUint32(o, E.getUint32(o, !1), !1);
          for (let o = 64; o < 320; o += 4)
            C.setUint32(
              o,
              p(
                C.getUint32(o - 12, !1) ^
                  C.getUint32(o - 32, !1) ^
                  C.getUint32(o - 56, !1) ^
                  C.getUint32(o - 64, !1),
                1,
              ),
              !1,
            );
          let L = this._h0,
            N = this._h1,
            w = this._h2,
            c = this._h3,
            r = this._h4,
            l,
            h,
            d;
          for (let o = 0; o < 80; o++)
            o < 20
              ? ((l = (N & w) | (~N & c)), (h = 1518500249))
              : o < 40
              ? ((l = N ^ w ^ c), (h = 1859775393))
              : o < 60
              ? ((l = (N & w) | (N & c) | (w & c)), (h = 2400959708))
              : ((l = N ^ w ^ c), (h = 3395469782)),
              (d = (p(L, 5) + l + r + h + C.getUint32(o * 4, !1)) & 4294967295),
              (r = c),
              (c = w),
              (w = p(N, 30)),
              (N = L),
              (L = d);
          (this._h0 = (this._h0 + L) & 4294967295),
            (this._h1 = (this._h1 + N) & 4294967295),
            (this._h2 = (this._h2 + w) & 4294967295),
            (this._h3 = (this._h3 + c) & 4294967295),
            (this._h4 = (this._h4 + r) & 4294967295);
        }
      }
      (n.StringSHA1 = b), (b._bigBlock32 = new DataView(new ArrayBuffer(320)));
    }),
    Y(X[18], J([0, 1, 29, 32]), function (x, n, R, M) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.LcsDiff = n.stringDiff = n.StringDiffSequence = void 0);
      class i {
        constructor(e) {
          this.source = e;
        }
        getElements() {
          const e = this.source,
            f = new Int32Array(e.length);
          for (let g = 0, b = e.length; g < b; g++) f[g] = e.charCodeAt(g);
          return f;
        }
      }
      n.StringDiffSequence = i;
      function u(p, e, f) {
        return new s(new i(p), new i(e)).ComputeDiff(f).changes;
      }
      n.stringDiff = u;
      class _ {
        static Assert(e, f) {
          if (!e) throw new Error(f);
        }
      }
      class S {
        static Copy(e, f, g, b, m) {
          for (let C = 0; C < m; C++) g[b + C] = e[f + C];
        }
        static Copy2(e, f, g, b, m) {
          for (let C = 0; C < m; C++) g[b + C] = e[f + C];
        }
      }
      class a {
        constructor() {
          (this.m_changes = []),
            (this.m_originalStart = 1073741824),
            (this.m_modifiedStart = 1073741824),
            (this.m_originalCount = 0),
            (this.m_modifiedCount = 0);
        }
        MarkNextChange() {
          (this.m_originalCount > 0 || this.m_modifiedCount > 0) &&
            this.m_changes.push(
              new R.DiffChange(
                this.m_originalStart,
                this.m_originalCount,
                this.m_modifiedStart,
                this.m_modifiedCount,
              ),
            ),
            (this.m_originalCount = 0),
            (this.m_modifiedCount = 0),
            (this.m_originalStart = 1073741824),
            (this.m_modifiedStart = 1073741824);
        }
        AddOriginalElement(e, f) {
          (this.m_originalStart = Math.min(this.m_originalStart, e)),
            (this.m_modifiedStart = Math.min(this.m_modifiedStart, f)),
            this.m_originalCount++;
        }
        AddModifiedElement(e, f) {
          (this.m_originalStart = Math.min(this.m_originalStart, e)),
            (this.m_modifiedStart = Math.min(this.m_modifiedStart, f)),
            this.m_modifiedCount++;
        }
        getChanges() {
          return (
            (this.m_originalCount > 0 || this.m_modifiedCount > 0) &&
              this.MarkNextChange(),
            this.m_changes
          );
        }
        getReverseChanges() {
          return (
            (this.m_originalCount > 0 || this.m_modifiedCount > 0) &&
              this.MarkNextChange(),
            this.m_changes.reverse(),
            this.m_changes
          );
        }
      }
      class s {
        constructor(e, f, g = null) {
          (this.ContinueProcessingPredicate = g),
            (this._originalSequence = e),
            (this._modifiedSequence = f);
          const [b, m, C] = s._getElements(e),
            [E, L, N] = s._getElements(f);
          (this._hasStrings = C && N),
            (this._originalStringElements = b),
            (this._originalElementsOrHash = m),
            (this._modifiedStringElements = E),
            (this._modifiedElementsOrHash = L),
            (this.m_forwardHistory = []),
            (this.m_reverseHistory = []);
        }
        static _isStringArray(e) {
          return e.length > 0 && typeof e[0] == 'string';
        }
        static _getElements(e) {
          const f = e.getElements();
          if (s._isStringArray(f)) {
            const g = new Int32Array(f.length);
            for (let b = 0, m = f.length; b < m; b++)
              g[b] = (0, M.stringHash)(f[b], 0);
            return [f, g, !0];
          }
          return f instanceof Int32Array
            ? [[], f, !1]
            : [[], new Int32Array(f), !1];
        }
        ElementsAreEqual(e, f) {
          return this._originalElementsOrHash[e] !==
            this._modifiedElementsOrHash[f]
            ? !1
            : this._hasStrings
            ? this._originalStringElements[e] ===
              this._modifiedStringElements[f]
            : !0;
        }
        ElementsAreStrictEqual(e, f) {
          if (!this.ElementsAreEqual(e, f)) return !1;
          const g = s._getStrictElement(this._originalSequence, e),
            b = s._getStrictElement(this._modifiedSequence, f);
          return g === b;
        }
        static _getStrictElement(e, f) {
          return typeof e.getStrictElement == 'function'
            ? e.getStrictElement(f)
            : null;
        }
        OriginalElementsAreEqual(e, f) {
          return this._originalElementsOrHash[e] !==
            this._originalElementsOrHash[f]
            ? !1
            : this._hasStrings
            ? this._originalStringElements[e] ===
              this._originalStringElements[f]
            : !0;
        }
        ModifiedElementsAreEqual(e, f) {
          return this._modifiedElementsOrHash[e] !==
            this._modifiedElementsOrHash[f]
            ? !1
            : this._hasStrings
            ? this._modifiedStringElements[e] ===
              this._modifiedStringElements[f]
            : !0;
        }
        ComputeDiff(e) {
          return this._ComputeDiff(
            0,
            this._originalElementsOrHash.length - 1,
            0,
            this._modifiedElementsOrHash.length - 1,
            e,
          );
        }
        _ComputeDiff(e, f, g, b, m) {
          const C = [!1];
          let E = this.ComputeDiffRecursive(e, f, g, b, C);
          return (
            m && (E = this.PrettifyChanges(E)), { quitEarly: C[0], changes: E }
          );
        }
        ComputeDiffRecursive(e, f, g, b, m) {
          for (m[0] = !1; e <= f && g <= b && this.ElementsAreEqual(e, g); )
            e++, g++;
          for (; f >= e && b >= g && this.ElementsAreEqual(f, b); ) f--, b--;
          if (e > f || g > b) {
            let c;
            return (
              g <= b
                ? (_.Assert(
                    e === f + 1,
                    'originalStart should only be one more than originalEnd',
                  ),
                  (c = [new R.DiffChange(e, 0, g, b - g + 1)]))
                : e <= f
                ? (_.Assert(
                    g === b + 1,
                    'modifiedStart should only be one more than modifiedEnd',
                  ),
                  (c = [new R.DiffChange(e, f - e + 1, g, 0)]))
                : (_.Assert(
                    e === f + 1,
                    'originalStart should only be one more than originalEnd',
                  ),
                  _.Assert(
                    g === b + 1,
                    'modifiedStart should only be one more than modifiedEnd',
                  ),
                  (c = [])),
              c
            );
          }
          const C = [0],
            E = [0],
            L = this.ComputeRecursionPoint(e, f, g, b, C, E, m),
            N = C[0],
            w = E[0];
          if (L !== null) return L;
          if (!m[0]) {
            const c = this.ComputeDiffRecursive(e, N, g, w, m);
            let r = [];
            return (
              m[0]
                ? (r = [
                    new R.DiffChange(
                      N + 1,
                      f - (N + 1) + 1,
                      w + 1,
                      b - (w + 1) + 1,
                    ),
                  ])
                : (r = this.ComputeDiffRecursive(N + 1, f, w + 1, b, m)),
              this.ConcatenateChanges(c, r)
            );
          }
          return [new R.DiffChange(e, f - e + 1, g, b - g + 1)];
        }
        WALKTRACE(e, f, g, b, m, C, E, L, N, w, c, r, l, h, d, o, v, A) {
          let y = null,
            D = null,
            k = new a(),
            B = f,
            I = g,
            U = l[0] - o[0] - b,
            V = -1073741824,
            Q = this.m_forwardHistory.length - 1;
          do {
            const F = U + e;
            F === B || (F < I && N[F - 1] < N[F + 1])
              ? ((c = N[F + 1]),
                (h = c - U - b),
                c < V && k.MarkNextChange(),
                (V = c),
                k.AddModifiedElement(c + 1, h),
                (U = F + 1 - e))
              : ((c = N[F - 1] + 1),
                (h = c - U - b),
                c < V && k.MarkNextChange(),
                (V = c - 1),
                k.AddOriginalElement(c, h + 1),
                (U = F - 1 - e)),
              Q >= 0 &&
                ((N = this.m_forwardHistory[Q]),
                (e = N[0]),
                (B = 1),
                (I = N.length - 1));
          } while (--Q >= -1);
          if (((y = k.getReverseChanges()), A[0])) {
            let F = l[0] + 1,
              T = o[0] + 1;
            if (y !== null && y.length > 0) {
              const q = y[y.length - 1];
              (F = Math.max(F, q.getOriginalEnd())),
                (T = Math.max(T, q.getModifiedEnd()));
            }
            D = [new R.DiffChange(F, r - F + 1, T, d - T + 1)];
          } else {
            (k = new a()),
              (B = C),
              (I = E),
              (U = l[0] - o[0] - L),
              (V = 1073741824),
              (Q = v
                ? this.m_reverseHistory.length - 1
                : this.m_reverseHistory.length - 2);
            do {
              const F = U + m;
              F === B || (F < I && w[F - 1] >= w[F + 1])
                ? ((c = w[F + 1] - 1),
                  (h = c - U - L),
                  c > V && k.MarkNextChange(),
                  (V = c + 1),
                  k.AddOriginalElement(c + 1, h + 1),
                  (U = F + 1 - m))
                : ((c = w[F - 1]),
                  (h = c - U - L),
                  c > V && k.MarkNextChange(),
                  (V = c),
                  k.AddModifiedElement(c + 1, h + 1),
                  (U = F - 1 - m)),
                Q >= 0 &&
                  ((w = this.m_reverseHistory[Q]),
                  (m = w[0]),
                  (B = 1),
                  (I = w.length - 1));
            } while (--Q >= -1);
            D = k.getChanges();
          }
          return this.ConcatenateChanges(y, D);
        }
        ComputeRecursionPoint(e, f, g, b, m, C, E) {
          let L = 0,
            N = 0,
            w = 0,
            c = 0,
            r = 0,
            l = 0;
          e--,
            g--,
            (m[0] = 0),
            (C[0] = 0),
            (this.m_forwardHistory = []),
            (this.m_reverseHistory = []);
          const h = f - e + (b - g),
            d = h + 1,
            o = new Int32Array(d),
            v = new Int32Array(d),
            A = b - g,
            y = f - e,
            D = e - g,
            k = f - b,
            I = (y - A) % 2 === 0;
          (o[A] = e), (v[y] = f), (E[0] = !1);
          for (let U = 1; U <= h / 2 + 1; U++) {
            let V = 0,
              Q = 0;
            (w = this.ClipDiagonalBound(A - U, U, A, d)),
              (c = this.ClipDiagonalBound(A + U, U, A, d));
            for (let T = w; T <= c; T += 2) {
              T === w || (T < c && o[T - 1] < o[T + 1])
                ? (L = o[T + 1])
                : (L = o[T - 1] + 1),
                (N = L - (T - A) - D);
              const q = L;
              for (; L < f && N < b && this.ElementsAreEqual(L + 1, N + 1); )
                L++, N++;
              if (
                ((o[T] = L),
                L + N > V + Q && ((V = L), (Q = N)),
                !I && Math.abs(T - y) <= U - 1 && L >= v[T])
              )
                return (
                  (m[0] = L),
                  (C[0] = N),
                  q <= v[T] && 1447 > 0 && U <= 1447 + 1
                    ? this.WALKTRACE(
                        A,
                        w,
                        c,
                        D,
                        y,
                        r,
                        l,
                        k,
                        o,
                        v,
                        L,
                        f,
                        m,
                        N,
                        b,
                        C,
                        I,
                        E,
                      )
                    : null
                );
            }
            const F = (V - e + (Q - g) - U) / 2;
            if (
              this.ContinueProcessingPredicate !== null &&
              !this.ContinueProcessingPredicate(V, F)
            )
              return (
                (E[0] = !0),
                (m[0] = V),
                (C[0] = Q),
                F > 0 && 1447 > 0 && U <= 1447 + 1
                  ? this.WALKTRACE(
                      A,
                      w,
                      c,
                      D,
                      y,
                      r,
                      l,
                      k,
                      o,
                      v,
                      L,
                      f,
                      m,
                      N,
                      b,
                      C,
                      I,
                      E,
                    )
                  : (e++, g++, [new R.DiffChange(e, f - e + 1, g, b - g + 1)])
              );
            (r = this.ClipDiagonalBound(y - U, U, y, d)),
              (l = this.ClipDiagonalBound(y + U, U, y, d));
            for (let T = r; T <= l; T += 2) {
              T === r || (T < l && v[T - 1] >= v[T + 1])
                ? (L = v[T + 1] - 1)
                : (L = v[T - 1]),
                (N = L - (T - y) - k);
              const q = L;
              for (; L > e && N > g && this.ElementsAreEqual(L, N); ) L--, N--;
              if (((v[T] = L), I && Math.abs(T - A) <= U && L <= o[T]))
                return (
                  (m[0] = L),
                  (C[0] = N),
                  q >= o[T] && 1447 > 0 && U <= 1447 + 1
                    ? this.WALKTRACE(
                        A,
                        w,
                        c,
                        D,
                        y,
                        r,
                        l,
                        k,
                        o,
                        v,
                        L,
                        f,
                        m,
                        N,
                        b,
                        C,
                        I,
                        E,
                      )
                    : null
                );
            }
            if (U <= 1447) {
              let T = new Int32Array(c - w + 2);
              (T[0] = A - w + 1),
                S.Copy2(o, w, T, 1, c - w + 1),
                this.m_forwardHistory.push(T),
                (T = new Int32Array(l - r + 2)),
                (T[0] = y - r + 1),
                S.Copy2(v, r, T, 1, l - r + 1),
                this.m_reverseHistory.push(T);
            }
          }
          return this.WALKTRACE(
            A,
            w,
            c,
            D,
            y,
            r,
            l,
            k,
            o,
            v,
            L,
            f,
            m,
            N,
            b,
            C,
            I,
            E,
          );
        }
        PrettifyChanges(e) {
          for (let f = 0; f < e.length; f++) {
            const g = e[f],
              b =
                f < e.length - 1
                  ? e[f + 1].originalStart
                  : this._originalElementsOrHash.length,
              m =
                f < e.length - 1
                  ? e[f + 1].modifiedStart
                  : this._modifiedElementsOrHash.length,
              C = g.originalLength > 0,
              E = g.modifiedLength > 0;
            for (
              ;
              g.originalStart + g.originalLength < b &&
              g.modifiedStart + g.modifiedLength < m &&
              (!C ||
                this.OriginalElementsAreEqual(
                  g.originalStart,
                  g.originalStart + g.originalLength,
                )) &&
              (!E ||
                this.ModifiedElementsAreEqual(
                  g.modifiedStart,
                  g.modifiedStart + g.modifiedLength,
                ));

            ) {
              const N = this.ElementsAreStrictEqual(
                g.originalStart,
                g.modifiedStart,
              );
              if (
                this.ElementsAreStrictEqual(
                  g.originalStart + g.originalLength,
                  g.modifiedStart + g.modifiedLength,
                ) &&
                !N
              )
                break;
              g.originalStart++, g.modifiedStart++;
            }
            const L = [null];
            if (f < e.length - 1 && this.ChangesOverlap(e[f], e[f + 1], L)) {
              (e[f] = L[0]), e.splice(f + 1, 1), f--;
              continue;
            }
          }
          for (let f = e.length - 1; f >= 0; f--) {
            const g = e[f];
            let b = 0,
              m = 0;
            if (f > 0) {
              const c = e[f - 1];
              (b = c.originalStart + c.originalLength),
                (m = c.modifiedStart + c.modifiedLength);
            }
            const C = g.originalLength > 0,
              E = g.modifiedLength > 0;
            let L = 0,
              N = this._boundaryScore(
                g.originalStart,
                g.originalLength,
                g.modifiedStart,
                g.modifiedLength,
              );
            for (let c = 1; ; c++) {
              const r = g.originalStart - c,
                l = g.modifiedStart - c;
              if (
                r < b ||
                l < m ||
                (C &&
                  !this.OriginalElementsAreEqual(r, r + g.originalLength)) ||
                (E && !this.ModifiedElementsAreEqual(l, l + g.modifiedLength))
              )
                break;
              const d =
                (r === b && l === m ? 5 : 0) +
                this._boundaryScore(r, g.originalLength, l, g.modifiedLength);
              d > N && ((N = d), (L = c));
            }
            (g.originalStart -= L), (g.modifiedStart -= L);
            const w = [null];
            if (f > 0 && this.ChangesOverlap(e[f - 1], e[f], w)) {
              (e[f - 1] = w[0]), e.splice(f, 1), f++;
              continue;
            }
          }
          if (this._hasStrings)
            for (let f = 1, g = e.length; f < g; f++) {
              const b = e[f - 1],
                m = e[f],
                C = m.originalStart - b.originalStart - b.originalLength,
                E = b.originalStart,
                L = m.originalStart + m.originalLength,
                N = L - E,
                w = b.modifiedStart,
                c = m.modifiedStart + m.modifiedLength,
                r = c - w;
              if (C < 5 && N < 20 && r < 20) {
                const l = this._findBetterContiguousSequence(E, N, w, r, C);
                if (l) {
                  const [h, d] = l;
                  (h !== b.originalStart + b.originalLength ||
                    d !== b.modifiedStart + b.modifiedLength) &&
                    ((b.originalLength = h - b.originalStart),
                    (b.modifiedLength = d - b.modifiedStart),
                    (m.originalStart = h + C),
                    (m.modifiedStart = d + C),
                    (m.originalLength = L - m.originalStart),
                    (m.modifiedLength = c - m.modifiedStart));
                }
              }
            }
          return e;
        }
        _findBetterContiguousSequence(e, f, g, b, m) {
          if (f < m || b < m) return null;
          const C = e + f - m + 1,
            E = g + b - m + 1;
          let L = 0,
            N = 0,
            w = 0;
          for (let c = e; c < C; c++)
            for (let r = g; r < E; r++) {
              const l = this._contiguousSequenceScore(c, r, m);
              l > 0 && l > L && ((L = l), (N = c), (w = r));
            }
          return L > 0 ? [N, w] : null;
        }
        _contiguousSequenceScore(e, f, g) {
          let b = 0;
          for (let m = 0; m < g; m++) {
            if (!this.ElementsAreEqual(e + m, f + m)) return 0;
            b += this._originalStringElements[e + m].length;
          }
          return b;
        }
        _OriginalIsBoundary(e) {
          return e <= 0 || e >= this._originalElementsOrHash.length - 1
            ? !0
            : this._hasStrings && /^\s*$/.test(this._originalStringElements[e]);
        }
        _OriginalRegionIsBoundary(e, f) {
          if (this._OriginalIsBoundary(e) || this._OriginalIsBoundary(e - 1))
            return !0;
          if (f > 0) {
            const g = e + f;
            if (this._OriginalIsBoundary(g - 1) || this._OriginalIsBoundary(g))
              return !0;
          }
          return !1;
        }
        _ModifiedIsBoundary(e) {
          return e <= 0 || e >= this._modifiedElementsOrHash.length - 1
            ? !0
            : this._hasStrings && /^\s*$/.test(this._modifiedStringElements[e]);
        }
        _ModifiedRegionIsBoundary(e, f) {
          if (this._ModifiedIsBoundary(e) || this._ModifiedIsBoundary(e - 1))
            return !0;
          if (f > 0) {
            const g = e + f;
            if (this._ModifiedIsBoundary(g - 1) || this._ModifiedIsBoundary(g))
              return !0;
          }
          return !1;
        }
        _boundaryScore(e, f, g, b) {
          const m = this._OriginalRegionIsBoundary(e, f) ? 1 : 0,
            C = this._ModifiedRegionIsBoundary(g, b) ? 1 : 0;
          return m + C;
        }
        ConcatenateChanges(e, f) {
          const g = [];
          if (e.length === 0 || f.length === 0) return f.length > 0 ? f : e;
          if (this.ChangesOverlap(e[e.length - 1], f[0], g)) {
            const b = new Array(e.length + f.length - 1);
            return (
              S.Copy(e, 0, b, 0, e.length - 1),
              (b[e.length - 1] = g[0]),
              S.Copy(f, 1, b, e.length, f.length - 1),
              b
            );
          } else {
            const b = new Array(e.length + f.length);
            return (
              S.Copy(e, 0, b, 0, e.length),
              S.Copy(f, 0, b, e.length, f.length),
              b
            );
          }
        }
        ChangesOverlap(e, f, g) {
          if (
            (_.Assert(
              e.originalStart <= f.originalStart,
              'Left change is not less than or equal to right change',
            ),
            _.Assert(
              e.modifiedStart <= f.modifiedStart,
              'Left change is not less than or equal to right change',
            ),
            e.originalStart + e.originalLength >= f.originalStart ||
              e.modifiedStart + e.modifiedLength >= f.modifiedStart)
          ) {
            const b = e.originalStart;
            let m = e.originalLength;
            const C = e.modifiedStart;
            let E = e.modifiedLength;
            return (
              e.originalStart + e.originalLength >= f.originalStart &&
                (m = f.originalStart + f.originalLength - e.originalStart),
              e.modifiedStart + e.modifiedLength >= f.modifiedStart &&
                (E = f.modifiedStart + f.modifiedLength - e.modifiedStart),
              (g[0] = new R.DiffChange(b, m, C, E)),
              !0
            );
          } else return (g[0] = null), !1;
        }
        ClipDiagonalBound(e, f, g, b) {
          if (e >= 0 && e < b) return e;
          const m = g,
            C = b - g - 1,
            E = f % 2 === 0;
          if (e < 0) {
            const L = m % 2 === 0;
            return E === L ? 0 : 1;
          } else {
            const L = C % 2 === 0;
            return E === L ? b - 1 : b - 2;
          }
        }
      }
      n.LcsDiff = s;
    }),
    Y(X[19], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.withUndefinedAsNull =
          n.withNullAsUndefined =
          n.validateConstraint =
          n.validateConstraints =
          n.isFunction =
          n.assertIsDefined =
          n.assertType =
          n.isUndefinedOrNull =
          n.isDefined =
          n.isUndefined =
          n.isBoolean =
          n.isIterable =
          n.isNumber =
          n.isTypedArray =
          n.isObject =
          n.isString =
            void 0);
      function R(L) {
        return typeof L == 'string';
      }
      n.isString = R;
      function M(L) {
        return (
          typeof L == 'object' &&
          L !== null &&
          !Array.isArray(L) &&
          !(L instanceof RegExp) &&
          !(L instanceof Date)
        );
      }
      n.isObject = M;
      function i(L) {
        const N = Object.getPrototypeOf(Uint8Array);
        return typeof L == 'object' && L instanceof N;
      }
      n.isTypedArray = i;
      function u(L) {
        return typeof L == 'number' && !isNaN(L);
      }
      n.isNumber = u;
      function _(L) {
        return !!L && typeof L[Symbol.iterator] == 'function';
      }
      n.isIterable = _;
      function S(L) {
        return L === !0 || L === !1;
      }
      n.isBoolean = S;
      function a(L) {
        return typeof L > 'u';
      }
      n.isUndefined = a;
      function s(L) {
        return !p(L);
      }
      n.isDefined = s;
      function p(L) {
        return a(L) || L === null;
      }
      n.isUndefinedOrNull = p;
      function e(L, N) {
        if (!L)
          throw new Error(
            N ? `Unexpected type, expected '${N}'` : 'Unexpected type',
          );
      }
      n.assertType = e;
      function f(L) {
        if (p(L))
          throw new Error('Assertion Failed: argument is undefined or null');
        return L;
      }
      n.assertIsDefined = f;
      function g(L) {
        return typeof L == 'function';
      }
      n.isFunction = g;
      function b(L, N) {
        const w = Math.min(L.length, N.length);
        for (let c = 0; c < w; c++) m(L[c], N[c]);
      }
      n.validateConstraints = b;
      function m(L, N) {
        if (R(N)) {
          if (typeof L !== N)
            throw new Error(`argument does not match constraint: typeof ${N}`);
        } else if (g(N)) {
          try {
            if (L instanceof N) return;
          } catch {}
          if (
            (!p(L) && L.constructor === N) ||
            (N.length === 1 && N.call(void 0, L) === !0)
          )
            return;
          throw new Error(
            'argument does not match one of these constraints: arg instanceof constraint, arg.constructor === constraint, nor constraint(arg) === true',
          );
        }
      }
      n.validateConstraint = m;
      function C(L) {
        return L === null ? void 0 : L;
      }
      n.withNullAsUndefined = C;
      function E(L) {
        return typeof L > 'u' ? null : L;
      }
      n.withUndefinedAsNull = E;
    }),
    Y(X[33], J([0, 1, 19]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.Codicon = n.getCodiconFontCharacters = void 0);
      const M = Object.create(null);
      function i(_, S) {
        if ((0, R.isString)(S)) {
          const a = M[S];
          if (a === void 0)
            throw new Error(`${_} references an unknown codicon: ${S}`);
          S = a;
        }
        return (M[_] = S), { id: _ };
      }
      function u() {
        return M;
      }
      (n.getCodiconFontCharacters = u),
        (n.Codicon = {
          add: i('add', 6e4),
          plus: i('plus', 6e4),
          gistNew: i('gist-new', 6e4),
          repoCreate: i('repo-create', 6e4),
          lightbulb: i('lightbulb', 60001),
          lightBulb: i('light-bulb', 60001),
          repo: i('repo', 60002),
          repoDelete: i('repo-delete', 60002),
          gistFork: i('gist-fork', 60003),
          repoForked: i('repo-forked', 60003),
          gitPullRequest: i('git-pull-request', 60004),
          gitPullRequestAbandoned: i('git-pull-request-abandoned', 60004),
          recordKeys: i('record-keys', 60005),
          keyboard: i('keyboard', 60005),
          tag: i('tag', 60006),
          tagAdd: i('tag-add', 60006),
          tagRemove: i('tag-remove', 60006),
          person: i('person', 60007),
          personFollow: i('person-follow', 60007),
          personOutline: i('person-outline', 60007),
          personFilled: i('person-filled', 60007),
          gitBranch: i('git-branch', 60008),
          gitBranchCreate: i('git-branch-create', 60008),
          gitBranchDelete: i('git-branch-delete', 60008),
          sourceControl: i('source-control', 60008),
          mirror: i('mirror', 60009),
          mirrorPublic: i('mirror-public', 60009),
          star: i('star', 60010),
          starAdd: i('star-add', 60010),
          starDelete: i('star-delete', 60010),
          starEmpty: i('star-empty', 60010),
          comment: i('comment', 60011),
          commentAdd: i('comment-add', 60011),
          alert: i('alert', 60012),
          warning: i('warning', 60012),
          search: i('search', 60013),
          searchSave: i('search-save', 60013),
          logOut: i('log-out', 60014),
          signOut: i('sign-out', 60014),
          logIn: i('log-in', 60015),
          signIn: i('sign-in', 60015),
          eye: i('eye', 60016),
          eyeUnwatch: i('eye-unwatch', 60016),
          eyeWatch: i('eye-watch', 60016),
          circleFilled: i('circle-filled', 60017),
          primitiveDot: i('primitive-dot', 60017),
          closeDirty: i('close-dirty', 60017),
          debugBreakpoint: i('debug-breakpoint', 60017),
          debugBreakpointDisabled: i('debug-breakpoint-disabled', 60017),
          debugHint: i('debug-hint', 60017),
          primitiveSquare: i('primitive-square', 60018),
          edit: i('edit', 60019),
          pencil: i('pencil', 60019),
          info: i('info', 60020),
          issueOpened: i('issue-opened', 60020),
          gistPrivate: i('gist-private', 60021),
          gitForkPrivate: i('git-fork-private', 60021),
          lock: i('lock', 60021),
          mirrorPrivate: i('mirror-private', 60021),
          close: i('close', 60022),
          removeClose: i('remove-close', 60022),
          x: i('x', 60022),
          repoSync: i('repo-sync', 60023),
          sync: i('sync', 60023),
          clone: i('clone', 60024),
          desktopDownload: i('desktop-download', 60024),
          beaker: i('beaker', 60025),
          microscope: i('microscope', 60025),
          vm: i('vm', 60026),
          deviceDesktop: i('device-desktop', 60026),
          file: i('file', 60027),
          fileText: i('file-text', 60027),
          more: i('more', 60028),
          ellipsis: i('ellipsis', 60028),
          kebabHorizontal: i('kebab-horizontal', 60028),
          mailReply: i('mail-reply', 60029),
          reply: i('reply', 60029),
          organization: i('organization', 60030),
          organizationFilled: i('organization-filled', 60030),
          organizationOutline: i('organization-outline', 60030),
          newFile: i('new-file', 60031),
          fileAdd: i('file-add', 60031),
          newFolder: i('new-folder', 60032),
          fileDirectoryCreate: i('file-directory-create', 60032),
          trash: i('trash', 60033),
          trashcan: i('trashcan', 60033),
          history: i('history', 60034),
          clock: i('clock', 60034),
          folder: i('folder', 60035),
          fileDirectory: i('file-directory', 60035),
          symbolFolder: i('symbol-folder', 60035),
          logoGithub: i('logo-github', 60036),
          markGithub: i('mark-github', 60036),
          github: i('github', 60036),
          terminal: i('terminal', 60037),
          console: i('console', 60037),
          repl: i('repl', 60037),
          zap: i('zap', 60038),
          symbolEvent: i('symbol-event', 60038),
          error: i('error', 60039),
          stop: i('stop', 60039),
          variable: i('variable', 60040),
          symbolVariable: i('symbol-variable', 60040),
          array: i('array', 60042),
          symbolArray: i('symbol-array', 60042),
          symbolModule: i('symbol-module', 60043),
          symbolPackage: i('symbol-package', 60043),
          symbolNamespace: i('symbol-namespace', 60043),
          symbolObject: i('symbol-object', 60043),
          symbolMethod: i('symbol-method', 60044),
          symbolFunction: i('symbol-function', 60044),
          symbolConstructor: i('symbol-constructor', 60044),
          symbolBoolean: i('symbol-boolean', 60047),
          symbolNull: i('symbol-null', 60047),
          symbolNumeric: i('symbol-numeric', 60048),
          symbolNumber: i('symbol-number', 60048),
          symbolStructure: i('symbol-structure', 60049),
          symbolStruct: i('symbol-struct', 60049),
          symbolParameter: i('symbol-parameter', 60050),
          symbolTypeParameter: i('symbol-type-parameter', 60050),
          symbolKey: i('symbol-key', 60051),
          symbolText: i('symbol-text', 60051),
          symbolReference: i('symbol-reference', 60052),
          goToFile: i('go-to-file', 60052),
          symbolEnum: i('symbol-enum', 60053),
          symbolValue: i('symbol-value', 60053),
          symbolRuler: i('symbol-ruler', 60054),
          symbolUnit: i('symbol-unit', 60054),
          activateBreakpoints: i('activate-breakpoints', 60055),
          archive: i('archive', 60056),
          arrowBoth: i('arrow-both', 60057),
          arrowDown: i('arrow-down', 60058),
          arrowLeft: i('arrow-left', 60059),
          arrowRight: i('arrow-right', 60060),
          arrowSmallDown: i('arrow-small-down', 60061),
          arrowSmallLeft: i('arrow-small-left', 60062),
          arrowSmallRight: i('arrow-small-right', 60063),
          arrowSmallUp: i('arrow-small-up', 60064),
          arrowUp: i('arrow-up', 60065),
          bell: i('bell', 60066),
          bold: i('bold', 60067),
          book: i('book', 60068),
          bookmark: i('bookmark', 60069),
          debugBreakpointConditionalUnverified: i(
            'debug-breakpoint-conditional-unverified',
            60070,
          ),
          debugBreakpointConditional: i('debug-breakpoint-conditional', 60071),
          debugBreakpointConditionalDisabled: i(
            'debug-breakpoint-conditional-disabled',
            60071,
          ),
          debugBreakpointDataUnverified: i(
            'debug-breakpoint-data-unverified',
            60072,
          ),
          debugBreakpointData: i('debug-breakpoint-data', 60073),
          debugBreakpointDataDisabled: i(
            'debug-breakpoint-data-disabled',
            60073,
          ),
          debugBreakpointLogUnverified: i(
            'debug-breakpoint-log-unverified',
            60074,
          ),
          debugBreakpointLog: i('debug-breakpoint-log', 60075),
          debugBreakpointLogDisabled: i('debug-breakpoint-log-disabled', 60075),
          briefcase: i('briefcase', 60076),
          broadcast: i('broadcast', 60077),
          browser: i('browser', 60078),
          bug: i('bug', 60079),
          calendar: i('calendar', 60080),
          caseSensitive: i('case-sensitive', 60081),
          check: i('check', 60082),
          checklist: i('checklist', 60083),
          chevronDown: i('chevron-down', 60084),
          dropDownButton: i('drop-down-button', 60084),
          chevronLeft: i('chevron-left', 60085),
          chevronRight: i('chevron-right', 60086),
          chevronUp: i('chevron-up', 60087),
          chromeClose: i('chrome-close', 60088),
          chromeMaximize: i('chrome-maximize', 60089),
          chromeMinimize: i('chrome-minimize', 60090),
          chromeRestore: i('chrome-restore', 60091),
          circle: i('circle', 60092),
          circleOutline: i('circle-outline', 60092),
          debugBreakpointUnverified: i('debug-breakpoint-unverified', 60092),
          circleSlash: i('circle-slash', 60093),
          circuitBoard: i('circuit-board', 60094),
          clearAll: i('clear-all', 60095),
          clippy: i('clippy', 60096),
          closeAll: i('close-all', 60097),
          cloudDownload: i('cloud-download', 60098),
          cloudUpload: i('cloud-upload', 60099),
          code: i('code', 60100),
          collapseAll: i('collapse-all', 60101),
          colorMode: i('color-mode', 60102),
          commentDiscussion: i('comment-discussion', 60103),
          compareChanges: i('compare-changes', 60157),
          creditCard: i('credit-card', 60105),
          dash: i('dash', 60108),
          dashboard: i('dashboard', 60109),
          database: i('database', 60110),
          debugContinue: i('debug-continue', 60111),
          debugDisconnect: i('debug-disconnect', 60112),
          debugPause: i('debug-pause', 60113),
          debugRestart: i('debug-restart', 60114),
          debugStart: i('debug-start', 60115),
          debugStepInto: i('debug-step-into', 60116),
          debugStepOut: i('debug-step-out', 60117),
          debugStepOver: i('debug-step-over', 60118),
          debugStop: i('debug-stop', 60119),
          debug: i('debug', 60120),
          deviceCameraVideo: i('device-camera-video', 60121),
          deviceCamera: i('device-camera', 60122),
          deviceMobile: i('device-mobile', 60123),
          diffAdded: i('diff-added', 60124),
          diffIgnored: i('diff-ignored', 60125),
          diffModified: i('diff-modified', 60126),
          diffRemoved: i('diff-removed', 60127),
          diffRenamed: i('diff-renamed', 60128),
          diff: i('diff', 60129),
          discard: i('discard', 60130),
          editorLayout: i('editor-layout', 60131),
          emptyWindow: i('empty-window', 60132),
          exclude: i('exclude', 60133),
          extensions: i('extensions', 60134),
          eyeClosed: i('eye-closed', 60135),
          fileBinary: i('file-binary', 60136),
          fileCode: i('file-code', 60137),
          fileMedia: i('file-media', 60138),
          filePdf: i('file-pdf', 60139),
          fileSubmodule: i('file-submodule', 60140),
          fileSymlinkDirectory: i('file-symlink-directory', 60141),
          fileSymlinkFile: i('file-symlink-file', 60142),
          fileZip: i('file-zip', 60143),
          files: i('files', 60144),
          filter: i('filter', 60145),
          flame: i('flame', 60146),
          foldDown: i('fold-down', 60147),
          foldUp: i('fold-up', 60148),
          fold: i('fold', 60149),
          folderActive: i('folder-active', 60150),
          folderOpened: i('folder-opened', 60151),
          gear: i('gear', 60152),
          gift: i('gift', 60153),
          gistSecret: i('gist-secret', 60154),
          gist: i('gist', 60155),
          gitCommit: i('git-commit', 60156),
          gitCompare: i('git-compare', 60157),
          gitMerge: i('git-merge', 60158),
          githubAction: i('github-action', 60159),
          githubAlt: i('github-alt', 60160),
          globe: i('globe', 60161),
          grabber: i('grabber', 60162),
          graph: i('graph', 60163),
          gripper: i('gripper', 60164),
          heart: i('heart', 60165),
          home: i('home', 60166),
          horizontalRule: i('horizontal-rule', 60167),
          hubot: i('hubot', 60168),
          inbox: i('inbox', 60169),
          issueClosed: i('issue-closed', 60324),
          issueReopened: i('issue-reopened', 60171),
          issues: i('issues', 60172),
          italic: i('italic', 60173),
          jersey: i('jersey', 60174),
          json: i('json', 60175),
          bracket: i('bracket', 60175),
          kebabVertical: i('kebab-vertical', 60176),
          key: i('key', 60177),
          law: i('law', 60178),
          lightbulbAutofix: i('lightbulb-autofix', 60179),
          linkExternal: i('link-external', 60180),
          link: i('link', 60181),
          listOrdered: i('list-ordered', 60182),
          listUnordered: i('list-unordered', 60183),
          liveShare: i('live-share', 60184),
          loading: i('loading', 60185),
          location: i('location', 60186),
          mailRead: i('mail-read', 60187),
          mail: i('mail', 60188),
          markdown: i('markdown', 60189),
          megaphone: i('megaphone', 60190),
          mention: i('mention', 60191),
          milestone: i('milestone', 60192),
          mortarBoard: i('mortar-board', 60193),
          move: i('move', 60194),
          multipleWindows: i('multiple-windows', 60195),
          mute: i('mute', 60196),
          noNewline: i('no-newline', 60197),
          note: i('note', 60198),
          octoface: i('octoface', 60199),
          openPreview: i('open-preview', 60200),
          package_: i('package', 60201),
          paintcan: i('paintcan', 60202),
          pin: i('pin', 60203),
          play: i('play', 60204),
          run: i('run', 60204),
          plug: i('plug', 60205),
          preserveCase: i('preserve-case', 60206),
          preview: i('preview', 60207),
          project: i('project', 60208),
          pulse: i('pulse', 60209),
          question: i('question', 60210),
          quote: i('quote', 60211),
          radioTower: i('radio-tower', 60212),
          reactions: i('reactions', 60213),
          references: i('references', 60214),
          refresh: i('refresh', 60215),
          regex: i('regex', 60216),
          remoteExplorer: i('remote-explorer', 60217),
          remote: i('remote', 60218),
          remove: i('remove', 60219),
          replaceAll: i('replace-all', 60220),
          replace: i('replace', 60221),
          repoClone: i('repo-clone', 60222),
          repoForcePush: i('repo-force-push', 60223),
          repoPull: i('repo-pull', 60224),
          repoPush: i('repo-push', 60225),
          report: i('report', 60226),
          requestChanges: i('request-changes', 60227),
          rocket: i('rocket', 60228),
          rootFolderOpened: i('root-folder-opened', 60229),
          rootFolder: i('root-folder', 60230),
          rss: i('rss', 60231),
          ruby: i('ruby', 60232),
          saveAll: i('save-all', 60233),
          saveAs: i('save-as', 60234),
          save: i('save', 60235),
          screenFull: i('screen-full', 60236),
          screenNormal: i('screen-normal', 60237),
          searchStop: i('search-stop', 60238),
          server: i('server', 60240),
          settingsGear: i('settings-gear', 60241),
          settings: i('settings', 60242),
          shield: i('shield', 60243),
          smiley: i('smiley', 60244),
          sortPrecedence: i('sort-precedence', 60245),
          splitHorizontal: i('split-horizontal', 60246),
          splitVertical: i('split-vertical', 60247),
          squirrel: i('squirrel', 60248),
          starFull: i('star-full', 60249),
          starHalf: i('star-half', 60250),
          symbolClass: i('symbol-class', 60251),
          symbolColor: i('symbol-color', 60252),
          symbolCustomColor: i('symbol-customcolor', 60252),
          symbolConstant: i('symbol-constant', 60253),
          symbolEnumMember: i('symbol-enum-member', 60254),
          symbolField: i('symbol-field', 60255),
          symbolFile: i('symbol-file', 60256),
          symbolInterface: i('symbol-interface', 60257),
          symbolKeyword: i('symbol-keyword', 60258),
          symbolMisc: i('symbol-misc', 60259),
          symbolOperator: i('symbol-operator', 60260),
          symbolProperty: i('symbol-property', 60261),
          wrench: i('wrench', 60261),
          wrenchSubaction: i('wrench-subaction', 60261),
          symbolSnippet: i('symbol-snippet', 60262),
          tasklist: i('tasklist', 60263),
          telescope: i('telescope', 60264),
          textSize: i('text-size', 60265),
          threeBars: i('three-bars', 60266),
          thumbsdown: i('thumbsdown', 60267),
          thumbsup: i('thumbsup', 60268),
          tools: i('tools', 60269),
          triangleDown: i('triangle-down', 60270),
          triangleLeft: i('triangle-left', 60271),
          triangleRight: i('triangle-right', 60272),
          triangleUp: i('triangle-up', 60273),
          twitter: i('twitter', 60274),
          unfold: i('unfold', 60275),
          unlock: i('unlock', 60276),
          unmute: i('unmute', 60277),
          unverified: i('unverified', 60278),
          verified: i('verified', 60279),
          versions: i('versions', 60280),
          vmActive: i('vm-active', 60281),
          vmOutline: i('vm-outline', 60282),
          vmRunning: i('vm-running', 60283),
          watch: i('watch', 60284),
          whitespace: i('whitespace', 60285),
          wholeWord: i('whole-word', 60286),
          window: i('window', 60287),
          wordWrap: i('word-wrap', 60288),
          zoomIn: i('zoom-in', 60289),
          zoomOut: i('zoom-out', 60290),
          listFilter: i('list-filter', 60291),
          listFlat: i('list-flat', 60292),
          listSelection: i('list-selection', 60293),
          selection: i('selection', 60293),
          listTree: i('list-tree', 60294),
          debugBreakpointFunctionUnverified: i(
            'debug-breakpoint-function-unverified',
            60295,
          ),
          debugBreakpointFunction: i('debug-breakpoint-function', 60296),
          debugBreakpointFunctionDisabled: i(
            'debug-breakpoint-function-disabled',
            60296,
          ),
          debugStackframeActive: i('debug-stackframe-active', 60297),
          circleSmallFilled: i('circle-small-filled', 60298),
          debugStackframeDot: i('debug-stackframe-dot', 60298),
          debugStackframe: i('debug-stackframe', 60299),
          debugStackframeFocused: i('debug-stackframe-focused', 60299),
          debugBreakpointUnsupported: i('debug-breakpoint-unsupported', 60300),
          symbolString: i('symbol-string', 60301),
          debugReverseContinue: i('debug-reverse-continue', 60302),
          debugStepBack: i('debug-step-back', 60303),
          debugRestartFrame: i('debug-restart-frame', 60304),
          callIncoming: i('call-incoming', 60306),
          callOutgoing: i('call-outgoing', 60307),
          menu: i('menu', 60308),
          expandAll: i('expand-all', 60309),
          feedback: i('feedback', 60310),
          groupByRefType: i('group-by-ref-type', 60311),
          ungroupByRefType: i('ungroup-by-ref-type', 60312),
          account: i('account', 60313),
          bellDot: i('bell-dot', 60314),
          debugConsole: i('debug-console', 60315),
          library: i('library', 60316),
          output: i('output', 60317),
          runAll: i('run-all', 60318),
          syncIgnored: i('sync-ignored', 60319),
          pinned: i('pinned', 60320),
          githubInverted: i('github-inverted', 60321),
          debugAlt: i('debug-alt', 60305),
          serverProcess: i('server-process', 60322),
          serverEnvironment: i('server-environment', 60323),
          pass: i('pass', 60324),
          stopCircle: i('stop-circle', 60325),
          playCircle: i('play-circle', 60326),
          record: i('record', 60327),
          debugAltSmall: i('debug-alt-small', 60328),
          vmConnect: i('vm-connect', 60329),
          cloud: i('cloud', 60330),
          merge: i('merge', 60331),
          exportIcon: i('export', 60332),
          graphLeft: i('graph-left', 60333),
          magnet: i('magnet', 60334),
          notebook: i('notebook', 60335),
          redo: i('redo', 60336),
          checkAll: i('check-all', 60337),
          pinnedDirty: i('pinned-dirty', 60338),
          passFilled: i('pass-filled', 60339),
          circleLargeFilled: i('circle-large-filled', 60340),
          circleLarge: i('circle-large', 60341),
          circleLargeOutline: i('circle-large-outline', 60341),
          combine: i('combine', 60342),
          gather: i('gather', 60342),
          table: i('table', 60343),
          variableGroup: i('variable-group', 60344),
          typeHierarchy: i('type-hierarchy', 60345),
          typeHierarchySub: i('type-hierarchy-sub', 60346),
          typeHierarchySuper: i('type-hierarchy-super', 60347),
          gitPullRequestCreate: i('git-pull-request-create', 60348),
          runAbove: i('run-above', 60349),
          runBelow: i('run-below', 60350),
          notebookTemplate: i('notebook-template', 60351),
          debugRerun: i('debug-rerun', 60352),
          workspaceTrusted: i('workspace-trusted', 60353),
          workspaceUntrusted: i('workspace-untrusted', 60354),
          workspaceUnspecified: i('workspace-unspecified', 60355),
          terminalCmd: i('terminal-cmd', 60356),
          terminalDebian: i('terminal-debian', 60357),
          terminalLinux: i('terminal-linux', 60358),
          terminalPowershell: i('terminal-powershell', 60359),
          terminalTmux: i('terminal-tmux', 60360),
          terminalUbuntu: i('terminal-ubuntu', 60361),
          terminalBash: i('terminal-bash', 60362),
          arrowSwap: i('arrow-swap', 60363),
          copy: i('copy', 60364),
          personAdd: i('person-add', 60365),
          filterFilled: i('filter-filled', 60366),
          wand: i('wand', 60367),
          debugLineByLine: i('debug-line-by-line', 60368),
          inspect: i('inspect', 60369),
          layers: i('layers', 60370),
          layersDot: i('layers-dot', 60371),
          layersActive: i('layers-active', 60372),
          compass: i('compass', 60373),
          compassDot: i('compass-dot', 60374),
          compassActive: i('compass-active', 60375),
          azure: i('azure', 60376),
          issueDraft: i('issue-draft', 60377),
          gitPullRequestClosed: i('git-pull-request-closed', 60378),
          gitPullRequestDraft: i('git-pull-request-draft', 60379),
          debugAll: i('debug-all', 60380),
          debugCoverage: i('debug-coverage', 60381),
          runErrors: i('run-errors', 60382),
          folderLibrary: i('folder-library', 60383),
          debugContinueSmall: i('debug-continue-small', 60384),
          beakerStop: i('beaker-stop', 60385),
          graphLine: i('graph-line', 60386),
          graphScatter: i('graph-scatter', 60387),
          pieChart: i('pie-chart', 60388),
          bracketDot: i('bracket-dot', 60389),
          bracketError: i('bracket-error', 60390),
          lockSmall: i('lock-small', 60391),
          azureDevops: i('azure-devops', 60392),
          verifiedFilled: i('verified-filled', 60393),
          newLine: i('newline', 60394),
          layout: i('layout', 60395),
          layoutActivitybarLeft: i('layout-activitybar-left', 60396),
          layoutActivitybarRight: i('layout-activitybar-right', 60397),
          layoutPanelLeft: i('layout-panel-left', 60398),
          layoutPanelCenter: i('layout-panel-center', 60399),
          layoutPanelJustify: i('layout-panel-justify', 60400),
          layoutPanelRight: i('layout-panel-right', 60401),
          layoutPanel: i('layout-panel', 60402),
          layoutSidebarLeft: i('layout-sidebar-left', 60403),
          layoutSidebarRight: i('layout-sidebar-right', 60404),
          layoutStatusbar: i('layout-statusbar', 60405),
          layoutMenubar: i('layout-menubar', 60406),
          layoutCentered: i('layout-centered', 60407),
          layoutSidebarRightOff: i('layout-sidebar-right-off', 60416),
          layoutPanelOff: i('layout-panel-off', 60417),
          layoutSidebarLeftOff: i('layout-sidebar-left-off', 60418),
          target: i('target', 60408),
          indent: i('indent', 60409),
          recordSmall: i('record-small', 60410),
          errorSmall: i('error-small', 60411),
          arrowCircleDown: i('arrow-circle-down', 60412),
          arrowCircleLeft: i('arrow-circle-left', 60413),
          arrowCircleRight: i('arrow-circle-right', 60414),
          arrowCircleUp: i('arrow-circle-up', 60415),
          heartFilled: i('heart-filled', 60420),
          map: i('map', 60421),
          mapFilled: i('map-filled', 60422),
          circleSmall: i('circle-small', 60423),
          bellSlash: i('bell-slash', 60424),
          bellSlashDot: i('bell-slash-dot', 60425),
          commentUnresolved: i('comment-unresolved', 60426),
          gitPullRequestGoToChanges: i('git-pull-request-go-to-changes', 60427),
          gitPullRequestNewChanges: i('git-pull-request-new-changes', 60428),
          searchFuzzy: i('search-fuzzy', 60429),
          commentDraft: i('comment-draft', 60430),
          send: i('send', 60431),
          sparkle: i('sparkle', 60432),
          insert: i('insert', 60433),
          dialogError: i('dialog-error', 'error'),
          dialogWarning: i('dialog-warning', 'warning'),
          dialogInfo: i('dialog-info', 'info'),
          dialogClose: i('dialog-close', 'close'),
          treeItemExpanded: i('tree-item-expanded', 'chevron-down'),
          treeFilterOnTypeOn: i('tree-filter-on-type-on', 'list-filter'),
          treeFilterOnTypeOff: i('tree-filter-on-type-off', 'list-selection'),
          treeFilterClear: i('tree-filter-clear', 'close'),
          treeItemLoading: i('tree-item-loading', 'loading'),
          menuSelection: i('menu-selection', 'check'),
          menuSubmenu: i('menu-submenu', 'chevron-right'),
          menuBarMore: i('menubar-more', 'more'),
          scrollbarButtonLeft: i('scrollbar-button-left', 'triangle-left'),
          scrollbarButtonRight: i('scrollbar-button-right', 'triangle-right'),
          scrollbarButtonUp: i('scrollbar-button-up', 'triangle-up'),
          scrollbarButtonDown: i('scrollbar-button-down', 'triangle-down'),
          toolBarMore: i('toolbar-more', 'more'),
          quickInputBack: i('quick-input-back', 'arrow-left'),
        });
    }),
    Y(X[12], J([0, 1, 19]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.createProxyObject =
          n.getAllMethodNames =
          n.getAllPropertyNames =
          n.equals =
          n.mixin =
          n.cloneAndChange =
          n.deepFreeze =
          n.deepClone =
            void 0);
      function M(g) {
        if (!g || typeof g != 'object' || g instanceof RegExp) return g;
        const b = Array.isArray(g) ? [] : {};
        return (
          Object.entries(g).forEach(([m, C]) => {
            b[m] = C && typeof C == 'object' ? M(C) : C;
          }),
          b
        );
      }
      n.deepClone = M;
      function i(g) {
        if (!g || typeof g != 'object') return g;
        const b = [g];
        for (; b.length > 0; ) {
          const m = b.shift();
          Object.freeze(m);
          for (const C in m)
            if (u.call(m, C)) {
              const E = m[C];
              typeof E == 'object' &&
                !Object.isFrozen(E) &&
                !(0, R.isTypedArray)(E) &&
                b.push(E);
            }
        }
        return g;
      }
      n.deepFreeze = i;
      const u = Object.prototype.hasOwnProperty;
      function _(g, b) {
        return S(g, b, new Set());
      }
      n.cloneAndChange = _;
      function S(g, b, m) {
        if ((0, R.isUndefinedOrNull)(g)) return g;
        const C = b(g);
        if (typeof C < 'u') return C;
        if (Array.isArray(g)) {
          const E = [];
          for (const L of g) E.push(S(L, b, m));
          return E;
        }
        if ((0, R.isObject)(g)) {
          if (m.has(g))
            throw new Error('Cannot clone recursive data-structure');
          m.add(g);
          const E = {};
          for (const L in g) u.call(g, L) && (E[L] = S(g[L], b, m));
          return m.delete(g), E;
        }
        return g;
      }
      function a(g, b, m = !0) {
        return (0, R.isObject)(g)
          ? ((0, R.isObject)(b) &&
              Object.keys(b).forEach(C => {
                C in g
                  ? m &&
                    ((0, R.isObject)(g[C]) && (0, R.isObject)(b[C])
                      ? a(g[C], b[C], m)
                      : (g[C] = b[C]))
                  : (g[C] = b[C]);
              }),
            g)
          : b;
      }
      n.mixin = a;
      function s(g, b) {
        if (g === b) return !0;
        if (
          g == null ||
          b === null ||
          b === void 0 ||
          typeof g != typeof b ||
          typeof g != 'object' ||
          Array.isArray(g) !== Array.isArray(b)
        )
          return !1;
        let m, C;
        if (Array.isArray(g)) {
          if (g.length !== b.length) return !1;
          for (m = 0; m < g.length; m++) if (!s(g[m], b[m])) return !1;
        } else {
          const E = [];
          for (C in g) E.push(C);
          E.sort();
          const L = [];
          for (C in b) L.push(C);
          if ((L.sort(), !s(E, L))) return !1;
          for (m = 0; m < E.length; m++) if (!s(g[E[m]], b[E[m]])) return !1;
        }
        return !0;
      }
      n.equals = s;
      function p(g) {
        let b = [],
          m = Object.getPrototypeOf(g);
        for (; Object.prototype !== m; )
          (b = b.concat(Object.getOwnPropertyNames(m))),
            (m = Object.getPrototypeOf(m));
        return b;
      }
      n.getAllPropertyNames = p;
      function e(g) {
        const b = [];
        for (const m of p(g)) typeof g[m] == 'function' && b.push(m);
        return b;
      }
      n.getAllMethodNames = e;
      function f(g, b) {
        const m = E =>
            function () {
              const L = Array.prototype.slice.call(arguments, 0);
              return b(E, L);
            },
          C = {};
        for (const E of g) C[E] = m(E);
        return C;
      }
      n.createProxyObject = f;
    }),
    Y(X[20], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.toUint32 = n.toUint8 = void 0);
      function R(i) {
        return i < 0 ? 0 : i > 255 ? 255 : i | 0;
      }
      n.toUint8 = R;
      function M(i) {
        return i < 0 ? 0 : i > 4294967295 ? 4294967295 : i | 0;
      }
      n.toUint32 = M;
    }),
    Y(X[21], J([0, 1, 20]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.CharacterSet = n.CharacterClassifier = void 0);
      class M {
        constructor(_) {
          const S = (0, R.toUint8)(_);
          (this._defaultValue = S),
            (this._asciiMap = M._createAsciiMap(S)),
            (this._map = new Map());
        }
        static _createAsciiMap(_) {
          const S = new Uint8Array(256);
          return S.fill(_), S;
        }
        set(_, S) {
          const a = (0, R.toUint8)(S);
          _ >= 0 && _ < 256 ? (this._asciiMap[_] = a) : this._map.set(_, a);
        }
        get(_) {
          return _ >= 0 && _ < 256
            ? this._asciiMap[_]
            : this._map.get(_) || this._defaultValue;
        }
        clear() {
          this._asciiMap.fill(this._defaultValue), this._map.clear();
        }
      }
      n.CharacterClassifier = M;
      class i {
        constructor() {
          this._actual = new M(0);
        }
        add(_) {
          this._actual.set(_, 1);
        }
        has(_) {
          return this._actual.get(_) === 1;
        }
        clear() {
          return this._actual.clear();
        }
      }
      n.CharacterSet = i;
    }),
    Y(X[6], J([0, 1, 4]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.OffsetRange = void 0);
      class M {
        static addRange(u, _) {
          let S = 0;
          for (; S < _.length && _[S].endExclusive < u.start; ) S++;
          let a = S;
          for (; a < _.length && _[a].start <= u.endExclusive; ) a++;
          if (S === a) _.splice(S, 0, u);
          else {
            const s = Math.min(u.start, _[S].start),
              p = Math.max(u.endExclusive, _[a - 1].endExclusive);
            _.splice(S, a - S, new M(s, p));
          }
        }
        static tryCreate(u, _) {
          if (!(u > _)) return new M(u, _);
        }
        constructor(u, _) {
          if (((this.start = u), (this.endExclusive = _), u > _))
            throw new R.BugIndicatingError(`Invalid range: ${this.toString()}`);
        }
        get isEmpty() {
          return this.start === this.endExclusive;
        }
        delta(u) {
          return new M(this.start + u, this.endExclusive + u);
        }
        get length() {
          return this.endExclusive - this.start;
        }
        toString() {
          return `[${this.start}, ${this.endExclusive})`;
        }
        equals(u) {
          return this.start === u.start && this.endExclusive === u.endExclusive;
        }
        containsRange(u) {
          return this.start <= u.start && u.endExclusive <= this.endExclusive;
        }
        join(u) {
          return new M(
            Math.min(this.start, u.start),
            Math.max(this.endExclusive, u.endExclusive),
          );
        }
        intersect(u) {
          const _ = Math.max(this.start, u.start),
            S = Math.min(this.endExclusive, u.endExclusive);
          if (_ <= S) return new M(_, S);
        }
      }
      n.OffsetRange = M;
    }),
    Y(X[3], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.Position = void 0);
      class R {
        constructor(i, u) {
          (this.lineNumber = i), (this.column = u);
        }
        with(i = this.lineNumber, u = this.column) {
          return i === this.lineNumber && u === this.column
            ? this
            : new R(i, u);
        }
        delta(i = 0, u = 0) {
          return this.with(this.lineNumber + i, this.column + u);
        }
        equals(i) {
          return R.equals(this, i);
        }
        static equals(i, u) {
          return !i && !u
            ? !0
            : !!i &&
                !!u &&
                i.lineNumber === u.lineNumber &&
                i.column === u.column;
        }
        isBefore(i) {
          return R.isBefore(this, i);
        }
        static isBefore(i, u) {
          return i.lineNumber < u.lineNumber
            ? !0
            : u.lineNumber < i.lineNumber
            ? !1
            : i.column < u.column;
        }
        isBeforeOrEqual(i) {
          return R.isBeforeOrEqual(this, i);
        }
        static isBeforeOrEqual(i, u) {
          return i.lineNumber < u.lineNumber
            ? !0
            : u.lineNumber < i.lineNumber
            ? !1
            : i.column <= u.column;
        }
        static compare(i, u) {
          const _ = i.lineNumber | 0,
            S = u.lineNumber | 0;
          if (_ === S) {
            const a = i.column | 0,
              s = u.column | 0;
            return a - s;
          }
          return _ - S;
        }
        clone() {
          return new R(this.lineNumber, this.column);
        }
        toString() {
          return '(' + this.lineNumber + ',' + this.column + ')';
        }
        static lift(i) {
          return new R(i.lineNumber, i.column);
        }
        static isIPosition(i) {
          return (
            i && typeof i.lineNumber == 'number' && typeof i.column == 'number'
          );
        }
      }
      n.Position = R;
    }),
    Y(X[2], J([0, 1, 3]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }), (n.Range = void 0);
      class M {
        constructor(u, _, S, a) {
          u > S || (u === S && _ > a)
            ? ((this.startLineNumber = S),
              (this.startColumn = a),
              (this.endLineNumber = u),
              (this.endColumn = _))
            : ((this.startLineNumber = u),
              (this.startColumn = _),
              (this.endLineNumber = S),
              (this.endColumn = a));
        }
        isEmpty() {
          return M.isEmpty(this);
        }
        static isEmpty(u) {
          return (
            u.startLineNumber === u.endLineNumber &&
            u.startColumn === u.endColumn
          );
        }
        containsPosition(u) {
          return M.containsPosition(this, u);
        }
        static containsPosition(u, _) {
          return !(
            _.lineNumber < u.startLineNumber ||
            _.lineNumber > u.endLineNumber ||
            (_.lineNumber === u.startLineNumber && _.column < u.startColumn) ||
            (_.lineNumber === u.endLineNumber && _.column > u.endColumn)
          );
        }
        static strictContainsPosition(u, _) {
          return !(
            _.lineNumber < u.startLineNumber ||
            _.lineNumber > u.endLineNumber ||
            (_.lineNumber === u.startLineNumber && _.column <= u.startColumn) ||
            (_.lineNumber === u.endLineNumber && _.column >= u.endColumn)
          );
        }
        containsRange(u) {
          return M.containsRange(this, u);
        }
        static containsRange(u, _) {
          return !(
            _.startLineNumber < u.startLineNumber ||
            _.endLineNumber < u.startLineNumber ||
            _.startLineNumber > u.endLineNumber ||
            _.endLineNumber > u.endLineNumber ||
            (_.startLineNumber === u.startLineNumber &&
              _.startColumn < u.startColumn) ||
            (_.endLineNumber === u.endLineNumber && _.endColumn > u.endColumn)
          );
        }
        strictContainsRange(u) {
          return M.strictContainsRange(this, u);
        }
        static strictContainsRange(u, _) {
          return !(
            _.startLineNumber < u.startLineNumber ||
            _.endLineNumber < u.startLineNumber ||
            _.startLineNumber > u.endLineNumber ||
            _.endLineNumber > u.endLineNumber ||
            (_.startLineNumber === u.startLineNumber &&
              _.startColumn <= u.startColumn) ||
            (_.endLineNumber === u.endLineNumber && _.endColumn >= u.endColumn)
          );
        }
        plusRange(u) {
          return M.plusRange(this, u);
        }
        static plusRange(u, _) {
          let S, a, s, p;
          return (
            _.startLineNumber < u.startLineNumber
              ? ((S = _.startLineNumber), (a = _.startColumn))
              : _.startLineNumber === u.startLineNumber
              ? ((S = _.startLineNumber),
                (a = Math.min(_.startColumn, u.startColumn)))
              : ((S = u.startLineNumber), (a = u.startColumn)),
            _.endLineNumber > u.endLineNumber
              ? ((s = _.endLineNumber), (p = _.endColumn))
              : _.endLineNumber === u.endLineNumber
              ? ((s = _.endLineNumber),
                (p = Math.max(_.endColumn, u.endColumn)))
              : ((s = u.endLineNumber), (p = u.endColumn)),
            new M(S, a, s, p)
          );
        }
        intersectRanges(u) {
          return M.intersectRanges(this, u);
        }
        static intersectRanges(u, _) {
          let S = u.startLineNumber,
            a = u.startColumn,
            s = u.endLineNumber,
            p = u.endColumn;
          const e = _.startLineNumber,
            f = _.startColumn,
            g = _.endLineNumber,
            b = _.endColumn;
          return (
            S < e ? ((S = e), (a = f)) : S === e && (a = Math.max(a, f)),
            s > g ? ((s = g), (p = b)) : s === g && (p = Math.min(p, b)),
            S > s || (S === s && a > p) ? null : new M(S, a, s, p)
          );
        }
        equalsRange(u) {
          return M.equalsRange(this, u);
        }
        static equalsRange(u, _) {
          return !u && !_
            ? !0
            : !!u &&
                !!_ &&
                u.startLineNumber === _.startLineNumber &&
                u.startColumn === _.startColumn &&
                u.endLineNumber === _.endLineNumber &&
                u.endColumn === _.endColumn;
        }
        getEndPosition() {
          return M.getEndPosition(this);
        }
        static getEndPosition(u) {
          return new R.Position(u.endLineNumber, u.endColumn);
        }
        getStartPosition() {
          return M.getStartPosition(this);
        }
        static getStartPosition(u) {
          return new R.Position(u.startLineNumber, u.startColumn);
        }
        toString() {
          return (
            '[' +
            this.startLineNumber +
            ',' +
            this.startColumn +
            ' -> ' +
            this.endLineNumber +
            ',' +
            this.endColumn +
            ']'
          );
        }
        setEndPosition(u, _) {
          return new M(this.startLineNumber, this.startColumn, u, _);
        }
        setStartPosition(u, _) {
          return new M(u, _, this.endLineNumber, this.endColumn);
        }
        collapseToStart() {
          return M.collapseToStart(this);
        }
        static collapseToStart(u) {
          return new M(
            u.startLineNumber,
            u.startColumn,
            u.startLineNumber,
            u.startColumn,
          );
        }
        collapseToEnd() {
          return M.collapseToEnd(this);
        }
        static collapseToEnd(u) {
          return new M(
            u.endLineNumber,
            u.endColumn,
            u.endLineNumber,
            u.endColumn,
          );
        }
        delta(u) {
          return new M(
            this.startLineNumber + u,
            this.startColumn,
            this.endLineNumber + u,
            this.endColumn,
          );
        }
        static fromPositions(u, _ = u) {
          return new M(u.lineNumber, u.column, _.lineNumber, _.column);
        }
        static lift(u) {
          return u
            ? new M(
                u.startLineNumber,
                u.startColumn,
                u.endLineNumber,
                u.endColumn,
              )
            : null;
        }
        static isIRange(u) {
          return (
            u &&
            typeof u.startLineNumber == 'number' &&
            typeof u.startColumn == 'number' &&
            typeof u.endLineNumber == 'number' &&
            typeof u.endColumn == 'number'
          );
        }
        static areIntersectingOrTouching(u, _) {
          return !(
            u.endLineNumber < _.startLineNumber ||
            (u.endLineNumber === _.startLineNumber &&
              u.endColumn < _.startColumn) ||
            _.endLineNumber < u.startLineNumber ||
            (_.endLineNumber === u.startLineNumber &&
              _.endColumn < u.startColumn)
          );
        }
        static areIntersecting(u, _) {
          return !(
            u.endLineNumber < _.startLineNumber ||
            (u.endLineNumber === _.startLineNumber &&
              u.endColumn <= _.startColumn) ||
            _.endLineNumber < u.startLineNumber ||
            (_.endLineNumber === u.startLineNumber &&
              _.endColumn <= u.startColumn)
          );
        }
        static compareRangesUsingStarts(u, _) {
          if (u && _) {
            const s = u.startLineNumber | 0,
              p = _.startLineNumber | 0;
            if (s === p) {
              const e = u.startColumn | 0,
                f = _.startColumn | 0;
              if (e === f) {
                const g = u.endLineNumber | 0,
                  b = _.endLineNumber | 0;
                if (g === b) {
                  const m = u.endColumn | 0,
                    C = _.endColumn | 0;
                  return m - C;
                }
                return g - b;
              }
              return e - f;
            }
            return s - p;
          }
          return (u ? 1 : 0) - (_ ? 1 : 0);
        }
        static compareRangesUsingEnds(u, _) {
          return u.endLineNumber === _.endLineNumber
            ? u.endColumn === _.endColumn
              ? u.startLineNumber === _.startLineNumber
                ? u.startColumn - _.startColumn
                : u.startLineNumber - _.startLineNumber
              : u.endColumn - _.endColumn
            : u.endLineNumber - _.endLineNumber;
        }
        static spansMultipleLines(u) {
          return u.endLineNumber > u.startLineNumber;
        }
        toJSON() {
          return this;
        }
      }
      n.Range = M;
    }),
    Y(X[13], J([0, 1, 4, 2]), function (x, n, R, M) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.LineRange = void 0);
      class i {
        static fromRange(_) {
          return new i(_.startLineNumber, _.endLineNumber);
        }
        static joinMany(_) {
          if (_.length === 0) return [];
          let S = _[0];
          for (let a = 1; a < _.length; a++) S = this.join(S, _[a]);
          return S;
        }
        static join(_, S) {
          if (_.length === 0) return S;
          if (S.length === 0) return _;
          const a = [];
          let s = 0,
            p = 0,
            e = null;
          for (; s < _.length || p < S.length; ) {
            let f = null;
            if (s < _.length && p < S.length) {
              const g = _[s],
                b = S[p];
              g.startLineNumber < b.startLineNumber
                ? ((f = g), s++)
                : ((f = b), p++);
            } else s < _.length ? ((f = _[s]), s++) : ((f = S[p]), p++);
            e === null
              ? (e = f)
              : e.endLineNumberExclusive >= f.startLineNumber
              ? (e = new i(
                  e.startLineNumber,
                  Math.max(e.endLineNumberExclusive, f.endLineNumberExclusive),
                ))
              : (a.push(e), (e = f));
          }
          return e !== null && a.push(e), a;
        }
        static ofLength(_, S) {
          return new i(_, _ + S);
        }
        constructor(_, S) {
          if (_ > S)
            throw new R.BugIndicatingError(
              `startLineNumber ${_} cannot be after endLineNumberExclusive ${S}`,
            );
          (this.startLineNumber = _), (this.endLineNumberExclusive = S);
        }
        contains(_) {
          return this.startLineNumber <= _ && _ < this.endLineNumberExclusive;
        }
        get isEmpty() {
          return this.startLineNumber === this.endLineNumberExclusive;
        }
        delta(_) {
          return new i(
            this.startLineNumber + _,
            this.endLineNumberExclusive + _,
          );
        }
        get length() {
          return this.endLineNumberExclusive - this.startLineNumber;
        }
        join(_) {
          return new i(
            Math.min(this.startLineNumber, _.startLineNumber),
            Math.max(this.endLineNumberExclusive, _.endLineNumberExclusive),
          );
        }
        toString() {
          return `[${this.startLineNumber},${this.endLineNumberExclusive})`;
        }
        intersect(_) {
          const S = Math.max(this.startLineNumber, _.startLineNumber),
            a = Math.min(this.endLineNumberExclusive, _.endLineNumberExclusive);
          if (S <= a) return new i(S, a);
        }
        intersectsStrict(_) {
          return (
            this.startLineNumber < _.endLineNumberExclusive &&
            _.startLineNumber < this.endLineNumberExclusive
          );
        }
        overlapOrTouch(_) {
          return (
            this.startLineNumber <= _.endLineNumberExclusive &&
            _.startLineNumber <= this.endLineNumberExclusive
          );
        }
        equals(_) {
          return (
            this.startLineNumber === _.startLineNumber &&
            this.endLineNumberExclusive === _.endLineNumberExclusive
          );
        }
        toInclusiveRange() {
          return this.isEmpty
            ? null
            : new M.Range(
                this.startLineNumber,
                1,
                this.endLineNumberExclusive - 1,
                Number.MAX_SAFE_INTEGER,
              );
        }
        toExclusiveRange() {
          return new M.Range(
            this.startLineNumber,
            1,
            this.endLineNumberExclusive,
            1,
          );
        }
      }
      n.LineRange = i;
    }),
    Y(X[34], J([0, 1, 3, 2]), function (x, n, R, M) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.Selection = void 0);
      class i extends M.Range {
        constructor(_, S, a, s) {
          super(_, S, a, s),
            (this.selectionStartLineNumber = _),
            (this.selectionStartColumn = S),
            (this.positionLineNumber = a),
            (this.positionColumn = s);
        }
        toString() {
          return (
            '[' +
            this.selectionStartLineNumber +
            ',' +
            this.selectionStartColumn +
            ' -> ' +
            this.positionLineNumber +
            ',' +
            this.positionColumn +
            ']'
          );
        }
        equalsSelection(_) {
          return i.selectionsEqual(this, _);
        }
        static selectionsEqual(_, S) {
          return (
            _.selectionStartLineNumber === S.selectionStartLineNumber &&
            _.selectionStartColumn === S.selectionStartColumn &&
            _.positionLineNumber === S.positionLineNumber &&
            _.positionColumn === S.positionColumn
          );
        }
        getDirection() {
          return this.selectionStartLineNumber === this.startLineNumber &&
            this.selectionStartColumn === this.startColumn
            ? 0
            : 1;
        }
        setEndPosition(_, S) {
          return this.getDirection() === 0
            ? new i(this.startLineNumber, this.startColumn, _, S)
            : new i(_, S, this.startLineNumber, this.startColumn);
        }
        getPosition() {
          return new R.Position(this.positionLineNumber, this.positionColumn);
        }
        getSelectionStart() {
          return new R.Position(
            this.selectionStartLineNumber,
            this.selectionStartColumn,
          );
        }
        setStartPosition(_, S) {
          return this.getDirection() === 0
            ? new i(_, S, this.endLineNumber, this.endColumn)
            : new i(this.endLineNumber, this.endColumn, _, S);
        }
        static fromPositions(_, S = _) {
          return new i(_.lineNumber, _.column, S.lineNumber, S.column);
        }
        static fromRange(_, S) {
          return S === 0
            ? new i(
                _.startLineNumber,
                _.startColumn,
                _.endLineNumber,
                _.endColumn,
              )
            : new i(
                _.endLineNumber,
                _.endColumn,
                _.startLineNumber,
                _.startColumn,
              );
        }
        static liftSelection(_) {
          return new i(
            _.selectionStartLineNumber,
            _.selectionStartColumn,
            _.positionLineNumber,
            _.positionColumn,
          );
        }
        static selectionsArrEqual(_, S) {
          if ((_ && !S) || (!_ && S)) return !1;
          if (!_ && !S) return !0;
          if (_.length !== S.length) return !1;
          for (let a = 0, s = _.length; a < s; a++)
            if (!this.selectionsEqual(_[a], S[a])) return !1;
          return !0;
        }
        static isISelection(_) {
          return (
            _ &&
            typeof _.selectionStartLineNumber == 'number' &&
            typeof _.selectionStartColumn == 'number' &&
            typeof _.positionLineNumber == 'number' &&
            typeof _.positionColumn == 'number'
          );
        }
        static createWithDirection(_, S, a, s, p) {
          return p === 0 ? new i(_, S, a, s) : new i(a, s, _, S);
        }
      }
      n.Selection = i;
    }),
    Y(X[35], J([0, 1, 21]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.getMapForWordSeparators = n.WordCharacterClassifier = void 0);
      class M extends R.CharacterClassifier {
        constructor(_) {
          super(0);
          for (let S = 0, a = _.length; S < a; S++)
            this.set(_.charCodeAt(S), 2);
          this.set(32, 1), this.set(9, 1);
        }
      }
      n.WordCharacterClassifier = M;
      function i(u) {
        const _ = {};
        return S => (_.hasOwnProperty(S) || (_[S] = u(S)), _[S]);
      }
      n.getMapForWordSeparators = i(u => new M(u));
    }),
    Y(X[22], J([0, 1, 16, 17]), function (x, n, R, M) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.getWordAtText =
          n.ensureValidWordDefinition =
          n.DEFAULT_WORD_REGEXP =
          n.USUAL_WORD_SEPARATORS =
            void 0),
        (n.USUAL_WORD_SEPARATORS = '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?');
      function i(s = '') {
        let p = '(-?\\d*\\.\\d\\w*)|([^';
        for (const e of n.USUAL_WORD_SEPARATORS)
          s.indexOf(e) >= 0 || (p += '\\' + e);
        return (p += '\\s]+)'), new RegExp(p, 'g');
      }
      n.DEFAULT_WORD_REGEXP = i();
      function u(s) {
        let p = n.DEFAULT_WORD_REGEXP;
        if (s && s instanceof RegExp)
          if (s.global) p = s;
          else {
            let e = 'g';
            s.ignoreCase && (e += 'i'),
              s.multiline && (e += 'm'),
              s.unicode && (e += 'u'),
              (p = new RegExp(s.source, e));
          }
        return (p.lastIndex = 0), p;
      }
      n.ensureValidWordDefinition = u;
      const _ = new M.LinkedList();
      _.unshift({ maxLen: 1e3, windowSize: 15, timeBudget: 150 });
      function S(s, p, e, f, g) {
        if ((g || (g = R.Iterable.first(_)), e.length > g.maxLen)) {
          let L = s - g.maxLen / 2;
          return (
            L < 0 ? (L = 0) : (f += L),
            (e = e.substring(L, s + g.maxLen / 2)),
            S(s, p, e, f, g)
          );
        }
        const b = Date.now(),
          m = s - 1 - f;
        let C = -1,
          E = null;
        for (let L = 1; !(Date.now() - b >= g.timeBudget); L++) {
          const N = m - g.windowSize * L;
          p.lastIndex = Math.max(0, N);
          const w = a(p, e, m, C);
          if ((!w && E) || ((E = w), N <= 0)) break;
          C = N;
        }
        if (E) {
          const L = {
            word: E[0],
            startColumn: f + 1 + E.index,
            endColumn: f + 1 + E.index + E[0].length,
          };
          return (p.lastIndex = 0), L;
        }
        return null;
      }
      n.getWordAtText = S;
      function a(s, p, e, f) {
        let g;
        for (; (g = s.exec(p)); ) {
          const b = g.index || 0;
          if (b <= e && s.lastIndex >= e) return g;
          if (f > 0 && b > f) return null;
        }
        return null;
      }
    }),
    Y(X[7], J([0, 1, 4, 6]), function (x, n, R, M) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.DateTimeout =
          n.InfiniteTimeout =
          n.SequenceDiff =
          n.DiffAlgorithmResult =
            void 0);
      class i {
        static trivial(s, p) {
          return new i(
            [
              new u(
                new M.OffsetRange(0, s.length),
                new M.OffsetRange(0, p.length),
              ),
            ],
            !1,
          );
        }
        static trivialTimedOut(s, p) {
          return new i(
            [
              new u(
                new M.OffsetRange(0, s.length),
                new M.OffsetRange(0, p.length),
              ),
            ],
            !0,
          );
        }
        constructor(s, p) {
          (this.diffs = s), (this.hitTimeout = p);
        }
      }
      n.DiffAlgorithmResult = i;
      class u {
        constructor(s, p) {
          (this.seq1Range = s), (this.seq2Range = p);
        }
        reverse() {
          return new u(this.seq2Range, this.seq1Range);
        }
        toString() {
          return `${this.seq1Range} <-> ${this.seq2Range}`;
        }
        join(s) {
          return new u(
            this.seq1Range.join(s.seq1Range),
            this.seq2Range.join(s.seq2Range),
          );
        }
      }
      n.SequenceDiff = u;
      class _ {
        isValid() {
          return !0;
        }
      }
      (n.InfiniteTimeout = _), (_.instance = new _());
      class S {
        constructor(s) {
          if (
            ((this.timeout = s),
            (this.startTime = Date.now()),
            (this.valid = !0),
            s <= 0)
          )
            throw new R.BugIndicatingError('timeout must be positive');
        }
        isValid() {
          if (!(Date.now() - this.startTime < this.timeout) && this.valid) {
            this.valid = !1;
            debugger;
          }
          return this.valid;
        }
      }
      n.DateTimeout = S;
    }),
    Y(X[36], J([0, 1, 6, 7]), function (x, n, R, M) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.shiftSequenceDiffs =
          n.joinSequenceDiffs =
          n.smoothenSequenceDiffs =
          n.optimizeSequenceDiffs =
            void 0);
      function i(s, p, e) {
        let f = e;
        return (f = _(s, p, f)), (f = S(s, p, f)), f;
      }
      n.optimizeSequenceDiffs = i;
      function u(s, p, e) {
        const f = [];
        for (const g of e) {
          const b = f[f.length - 1];
          if (!b) {
            f.push(g);
            continue;
          }
          g.seq1Range.start - b.seq1Range.endExclusive <= 2 ||
          g.seq2Range.start - b.seq2Range.endExclusive <= 2
            ? (f[f.length - 1] = new M.SequenceDiff(
                b.seq1Range.join(g.seq1Range),
                b.seq2Range.join(g.seq2Range),
              ))
            : f.push(g);
        }
        return f;
      }
      n.smoothenSequenceDiffs = u;
      function _(s, p, e) {
        const f = [];
        e.length > 0 && f.push(e[0]);
        for (let g = 1; g < e.length; g++) {
          const b = f[f.length - 1],
            m = e[g];
          if (m.seq1Range.isEmpty) {
            let C = !0;
            const E = m.seq1Range.start - b.seq1Range.endExclusive;
            for (let L = 1; L <= E; L++)
              if (
                p.getElement(m.seq2Range.start - L) !==
                p.getElement(m.seq2Range.endExclusive - L)
              ) {
                C = !1;
                break;
              }
            if (C) {
              f[f.length - 1] = new M.SequenceDiff(
                b.seq1Range,
                new R.OffsetRange(
                  b.seq2Range.start,
                  m.seq2Range.endExclusive - E,
                ),
              );
              continue;
            }
          }
          f.push(m);
        }
        return f;
      }
      n.joinSequenceDiffs = _;
      function S(s, p, e) {
        if (!s.getBoundaryScore || !p.getBoundaryScore) return e;
        for (let f = 0; f < e.length; f++) {
          const g = e[f];
          if (g.seq1Range.isEmpty) {
            const b = f > 0 ? e[f - 1].seq2Range.endExclusive : -1,
              m = f + 1 < e.length ? e[f + 1].seq2Range.start : p.length;
            e[f] = a(g, s, p, m, b);
          } else if (g.seq2Range.isEmpty) {
            const b = f > 0 ? e[f - 1].seq1Range.endExclusive : -1,
              m = f + 1 < e.length ? e[f + 1].seq1Range.start : s.length;
            e[f] = a(g.reverse(), p, s, m, b).reverse();
          }
        }
        return e;
      }
      n.shiftSequenceDiffs = S;
      function a(s, p, e, f, g) {
        let m = 1;
        for (
          ;
          s.seq2Range.start - m > g &&
          e.getElement(s.seq2Range.start - m) ===
            e.getElement(s.seq2Range.endExclusive - m) &&
          m < 20;

        )
          m++;
        m--;
        let C = 0;
        for (
          ;
          s.seq2Range.start + C < f &&
          e.getElement(s.seq2Range.start + C) ===
            e.getElement(s.seq2Range.endExclusive + C) &&
          C < 20;

        )
          C++;
        if (m === 0 && C === 0) return s;
        let E = 0,
          L = -1;
        for (let N = -m; N <= C; N++) {
          const w = s.seq2Range.start + N,
            c = s.seq2Range.endExclusive + N,
            r = s.seq1Range.start + N,
            l =
              p.getBoundaryScore(r) +
              e.getBoundaryScore(w) +
              e.getBoundaryScore(c);
          l > L && ((L = l), (E = N));
        }
        return E !== 0
          ? new M.SequenceDiff(s.seq1Range.delta(E), s.seq2Range.delta(E))
          : s;
      }
    }),
    Y(X[37], J([0, 1, 6, 7]), function (x, n, R, M) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.MyersDiffAlgorithm = void 0);
      class i {
        compute(s, p, e = M.InfiniteTimeout.instance) {
          if (s.length === 0 || p.length === 0)
            return M.DiffAlgorithmResult.trivial(s, p);
          function f(c, r) {
            for (
              ;
              c < s.length &&
              r < p.length &&
              s.getElement(c) === p.getElement(r);

            )
              c++, r++;
            return c;
          }
          let g = 0;
          const b = new _();
          b.set(0, f(0, 0));
          const m = new S();
          m.set(0, b.get(0) === 0 ? null : new u(null, 0, 0, b.get(0)));
          let C = 0;
          e: for (;;)
            for (g++, C = -g; C <= g; C += 2) {
              if (!e.isValid())
                return M.DiffAlgorithmResult.trivialTimedOut(s, p);
              const c = C === g ? -1 : b.get(C + 1),
                r = C === -g ? -1 : b.get(C - 1) + 1,
                l = Math.min(Math.max(c, r), s.length),
                h = l - C,
                d = f(l, h);
              b.set(C, d);
              const o = l === c ? m.get(C + 1) : m.get(C - 1);
              if (
                (m.set(C, d !== l ? new u(o, l, h, d - l) : o),
                b.get(C) === s.length && b.get(C) - C === p.length)
              )
                break e;
            }
          let E = m.get(C);
          const L = [];
          let N = s.length,
            w = p.length;
          for (;;) {
            const c = E ? E.x + E.length : 0,
              r = E ? E.y + E.length : 0;
            if (
              ((c !== N || r !== w) &&
                L.push(
                  new M.SequenceDiff(
                    new R.OffsetRange(c, N),
                    new R.OffsetRange(r, w),
                  ),
                ),
              !E)
            )
              break;
            (N = E.x), (w = E.y), (E = E.prev);
          }
          return L.reverse(), new M.DiffAlgorithmResult(L, !1);
        }
      }
      n.MyersDiffAlgorithm = i;
      class u {
        constructor(s, p, e, f) {
          (this.prev = s), (this.x = p), (this.y = e), (this.length = f);
        }
      }
      class _ {
        constructor() {
          (this.positiveArr = new Int32Array(10)),
            (this.negativeArr = new Int32Array(10));
        }
        get(s) {
          return s < 0
            ? ((s = -s - 1), this.negativeArr[s])
            : this.positiveArr[s];
        }
        set(s, p) {
          if (s < 0) {
            if (((s = -s - 1), s >= this.negativeArr.length)) {
              const e = this.negativeArr;
              (this.negativeArr = new Int32Array(e.length * 2)),
                this.negativeArr.set(e);
            }
            this.negativeArr[s] = p;
          } else {
            if (s >= this.positiveArr.length) {
              const e = this.positiveArr;
              (this.positiveArr = new Int32Array(e.length * 2)),
                this.positiveArr.set(e);
            }
            this.positiveArr[s] = p;
          }
        }
      }
      class S {
        constructor() {
          (this.positiveArr = []), (this.negativeArr = []);
        }
        get(s) {
          return s < 0
            ? ((s = -s - 1), this.negativeArr[s])
            : this.positiveArr[s];
        }
        set(s, p) {
          s < 0
            ? ((s = -s - 1), (this.negativeArr[s] = p))
            : (this.positiveArr[s] = p);
        }
      }
    }),
    Y(X[38], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.Array2D = void 0);
      class R {
        constructor(i, u) {
          (this.width = i),
            (this.height = u),
            (this.array = []),
            (this.array = new Array(i * u));
        }
        get(i, u) {
          return this.array[i + u * this.width];
        }
        set(i, u, _) {
          this.array[i + u * this.width] = _;
        }
      }
      n.Array2D = R;
    }),
    Y(X[39], J([0, 1, 6, 7, 38]), function (x, n, R, M, i) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.DynamicProgrammingDiffing = void 0);
      class u {
        compute(S, a, s = M.InfiniteTimeout.instance, p) {
          if (S.length === 0 || a.length === 0)
            return M.DiffAlgorithmResult.trivial(S, a);
          const e = new i.Array2D(S.length, a.length),
            f = new i.Array2D(S.length, a.length),
            g = new i.Array2D(S.length, a.length);
          for (let w = 0; w < S.length; w++)
            for (let c = 0; c < a.length; c++) {
              if (!s.isValid())
                return M.DiffAlgorithmResult.trivialTimedOut(S, a);
              const r = w === 0 ? 0 : e.get(w - 1, c),
                l = c === 0 ? 0 : e.get(w, c - 1);
              let h;
              S.getElement(w) === a.getElement(c)
                ? (w === 0 || c === 0 ? (h = 0) : (h = e.get(w - 1, c - 1)),
                  w > 0 &&
                    c > 0 &&
                    f.get(w - 1, c - 1) === 3 &&
                    (h += g.get(w - 1, c - 1)),
                  (h += p ? p(w, c) : 1))
                : (h = -1);
              const d = Math.max(r, l, h);
              if (d === h) {
                const o = w > 0 && c > 0 ? g.get(w - 1, c - 1) : 0;
                g.set(w, c, o + 1), f.set(w, c, 3);
              } else
                d === r
                  ? (g.set(w, c, 0), f.set(w, c, 1))
                  : d === l && (g.set(w, c, 0), f.set(w, c, 2));
              e.set(w, c, d);
            }
          const b = [];
          let m = S.length,
            C = a.length;
          function E(w, c) {
            (w + 1 !== m || c + 1 !== C) &&
              b.push(
                new M.SequenceDiff(
                  new R.OffsetRange(w + 1, m),
                  new R.OffsetRange(c + 1, C),
                ),
              ),
              (m = w),
              (C = c);
          }
          let L = S.length - 1,
            N = a.length - 1;
          for (; L >= 0 && N >= 0; )
            f.get(L, N) === 3
              ? (E(L, N), L--, N--)
              : f.get(L, N) === 1
              ? L--
              : N--;
          return E(-1, -1), b.reverse(), new M.DiffAlgorithmResult(b, !1);
        }
      }
      n.DynamicProgrammingDiffing = u;
    }),
    Y(X[23], J([0, 1, 13]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.RangeMapping = n.LineRangeMapping = n.LinesDiff = void 0);
      class M {
        constructor(S, a) {
          (this.changes = S), (this.hitTimeout = a);
        }
      }
      n.LinesDiff = M;
      class i {
        static inverse(S, a, s) {
          const p = [];
          let e = 1,
            f = 1;
          for (const b of S) {
            const m = new i(
              new R.LineRange(e, b.originalRange.startLineNumber),
              new R.LineRange(f, b.modifiedRange.startLineNumber),
              void 0,
            );
            m.modifiedRange.isEmpty || p.push(m),
              (e = b.originalRange.endLineNumberExclusive),
              (f = b.modifiedRange.endLineNumberExclusive);
          }
          const g = new i(
            new R.LineRange(e, a + 1),
            new R.LineRange(f, s + 1),
            void 0,
          );
          return g.modifiedRange.isEmpty || p.push(g), p;
        }
        constructor(S, a, s) {
          (this.originalRange = S),
            (this.modifiedRange = a),
            (this.innerChanges = s);
        }
        toString() {
          return `{${this.originalRange.toString()}->${this.modifiedRange.toString()}}`;
        }
        get changedLineCount() {
          return Math.max(this.originalRange.length, this.modifiedRange.length);
        }
      }
      n.LineRangeMapping = i;
      class u {
        constructor(S, a) {
          (this.originalRange = S), (this.modifiedRange = a);
        }
        toString() {
          return `{${this.originalRange.toString()}->${this.modifiedRange.toString()}}`;
        }
      }
      n.RangeMapping = u;
    }),
    Y(
      X[40],
      J([0, 1, 18, 23, 5, 2, 10, 13]),
      function (x, n, R, M, i, u, _, S) {
        'use strict';
        Object.defineProperty(n, '__esModule', { value: !0 }),
          (n.DiffComputer = n.SmartLinesDiffComputer = void 0);
        const a = 3;
        class s {
          computeDiff(c, r, l) {
            var h;
            const o = new C(c, r, {
                maxComputationTime: l.maxComputationTimeMs,
                shouldIgnoreTrimWhitespace: l.ignoreTrimWhitespace,
                shouldComputeCharChanges: !0,
                shouldMakePrettyDiff: !0,
                shouldPostProcessCharChanges: !0,
              }).computeDiff(),
              v = [];
            let A = null;
            for (const y of o.changes) {
              let D;
              y.originalEndLineNumber === 0
                ? (D = new S.LineRange(
                    y.originalStartLineNumber + 1,
                    y.originalStartLineNumber + 1,
                  ))
                : (D = new S.LineRange(
                    y.originalStartLineNumber,
                    y.originalEndLineNumber + 1,
                  ));
              let k;
              y.modifiedEndLineNumber === 0
                ? (k = new S.LineRange(
                    y.modifiedStartLineNumber + 1,
                    y.modifiedStartLineNumber + 1,
                  ))
                : (k = new S.LineRange(
                    y.modifiedStartLineNumber,
                    y.modifiedEndLineNumber + 1,
                  ));
              let B = new M.LineRangeMapping(
                D,
                k,
                (h = y.charChanges) === null || h === void 0
                  ? void 0
                  : h.map(
                      I =>
                        new M.RangeMapping(
                          new u.Range(
                            I.originalStartLineNumber,
                            I.originalStartColumn,
                            I.originalEndLineNumber,
                            I.originalEndColumn,
                          ),
                          new u.Range(
                            I.modifiedStartLineNumber,
                            I.modifiedStartColumn,
                            I.modifiedEndLineNumber,
                            I.modifiedEndColumn,
                          ),
                        ),
                    ),
              );
              A &&
                (A.modifiedRange.endLineNumberExclusive ===
                  B.modifiedRange.startLineNumber ||
                  A.originalRange.endLineNumberExclusive ===
                    B.originalRange.startLineNumber) &&
                ((B = new M.LineRangeMapping(
                  A.originalRange.join(B.originalRange),
                  A.modifiedRange.join(B.modifiedRange),
                  A.innerChanges && B.innerChanges
                    ? A.innerChanges.concat(B.innerChanges)
                    : void 0,
                )),
                v.pop()),
                v.push(B),
                (A = B);
            }
            return (
              (0, _.assertFn)(() =>
                (0, _.checkAdjacentItems)(
                  v,
                  (y, D) =>
                    D.originalRange.startLineNumber -
                      y.originalRange.endLineNumberExclusive ===
                      D.modifiedRange.startLineNumber -
                        y.modifiedRange.endLineNumberExclusive &&
                    y.originalRange.endLineNumberExclusive <
                      D.originalRange.startLineNumber &&
                    y.modifiedRange.endLineNumberExclusive <
                      D.modifiedRange.startLineNumber,
                ),
              ),
              new M.LinesDiff(v, o.quitEarly)
            );
          }
        }
        n.SmartLinesDiffComputer = s;
        function p(w, c, r, l) {
          return new R.LcsDiff(w, c, r).ComputeDiff(l);
        }
        class e {
          constructor(c) {
            const r = [],
              l = [];
            for (let h = 0, d = c.length; h < d; h++)
              (r[h] = E(c[h], 1)), (l[h] = L(c[h], 1));
            (this.lines = c), (this._startColumns = r), (this._endColumns = l);
          }
          getElements() {
            const c = [];
            for (let r = 0, l = this.lines.length; r < l; r++)
              c[r] = this.lines[r].substring(
                this._startColumns[r] - 1,
                this._endColumns[r] - 1,
              );
            return c;
          }
          getStrictElement(c) {
            return this.lines[c];
          }
          getStartLineNumber(c) {
            return c + 1;
          }
          getEndLineNumber(c) {
            return c + 1;
          }
          createCharSequence(c, r, l) {
            const h = [],
              d = [],
              o = [];
            let v = 0;
            for (let A = r; A <= l; A++) {
              const y = this.lines[A],
                D = c ? this._startColumns[A] : 1,
                k = c ? this._endColumns[A] : y.length + 1;
              for (let B = D; B < k; B++)
                (h[v] = y.charCodeAt(B - 1)), (d[v] = A + 1), (o[v] = B), v++;
              !c &&
                A < l &&
                ((h[v] = 10), (d[v] = A + 1), (o[v] = y.length + 1), v++);
            }
            return new f(h, d, o);
          }
        }
        class f {
          constructor(c, r, l) {
            (this._charCodes = c), (this._lineNumbers = r), (this._columns = l);
          }
          toString() {
            return (
              '[' +
              this._charCodes
                .map(
                  (c, r) =>
                    (c === 10 ? '\\n' : String.fromCharCode(c)) +
                    `-(${this._lineNumbers[r]},${this._columns[r]})`,
                )
                .join(', ') +
              ']'
            );
          }
          _assertIndex(c, r) {
            if (c < 0 || c >= r.length) throw new Error('Illegal index');
          }
          getElements() {
            return this._charCodes;
          }
          getStartLineNumber(c) {
            return c > 0 && c === this._lineNumbers.length
              ? this.getEndLineNumber(c - 1)
              : (this._assertIndex(c, this._lineNumbers), this._lineNumbers[c]);
          }
          getEndLineNumber(c) {
            return c === -1
              ? this.getStartLineNumber(c + 1)
              : (this._assertIndex(c, this._lineNumbers),
                this._charCodes[c] === 10
                  ? this._lineNumbers[c] + 1
                  : this._lineNumbers[c]);
          }
          getStartColumn(c) {
            return c > 0 && c === this._columns.length
              ? this.getEndColumn(c - 1)
              : (this._assertIndex(c, this._columns), this._columns[c]);
          }
          getEndColumn(c) {
            return c === -1
              ? this.getStartColumn(c + 1)
              : (this._assertIndex(c, this._columns),
                this._charCodes[c] === 10 ? 1 : this._columns[c] + 1);
          }
        }
        class g {
          constructor(c, r, l, h, d, o, v, A) {
            (this.originalStartLineNumber = c),
              (this.originalStartColumn = r),
              (this.originalEndLineNumber = l),
              (this.originalEndColumn = h),
              (this.modifiedStartLineNumber = d),
              (this.modifiedStartColumn = o),
              (this.modifiedEndLineNumber = v),
              (this.modifiedEndColumn = A);
          }
          static createFromDiffChange(c, r, l) {
            const h = r.getStartLineNumber(c.originalStart),
              d = r.getStartColumn(c.originalStart),
              o = r.getEndLineNumber(c.originalStart + c.originalLength - 1),
              v = r.getEndColumn(c.originalStart + c.originalLength - 1),
              A = l.getStartLineNumber(c.modifiedStart),
              y = l.getStartColumn(c.modifiedStart),
              D = l.getEndLineNumber(c.modifiedStart + c.modifiedLength - 1),
              k = l.getEndColumn(c.modifiedStart + c.modifiedLength - 1);
            return new g(h, d, o, v, A, y, D, k);
          }
        }
        function b(w) {
          if (w.length <= 1) return w;
          const c = [w[0]];
          let r = c[0];
          for (let l = 1, h = w.length; l < h; l++) {
            const d = w[l],
              o = d.originalStart - (r.originalStart + r.originalLength),
              v = d.modifiedStart - (r.modifiedStart + r.modifiedLength);
            Math.min(o, v) < a
              ? ((r.originalLength =
                  d.originalStart + d.originalLength - r.originalStart),
                (r.modifiedLength =
                  d.modifiedStart + d.modifiedLength - r.modifiedStart))
              : (c.push(d), (r = d));
          }
          return c;
        }
        class m {
          constructor(c, r, l, h, d) {
            (this.originalStartLineNumber = c),
              (this.originalEndLineNumber = r),
              (this.modifiedStartLineNumber = l),
              (this.modifiedEndLineNumber = h),
              (this.charChanges = d);
          }
          static createFromDiffResult(c, r, l, h, d, o, v) {
            let A, y, D, k, B;
            if (
              (r.originalLength === 0
                ? ((A = l.getStartLineNumber(r.originalStart) - 1), (y = 0))
                : ((A = l.getStartLineNumber(r.originalStart)),
                  (y = l.getEndLineNumber(
                    r.originalStart + r.originalLength - 1,
                  ))),
              r.modifiedLength === 0
                ? ((D = h.getStartLineNumber(r.modifiedStart) - 1), (k = 0))
                : ((D = h.getStartLineNumber(r.modifiedStart)),
                  (k = h.getEndLineNumber(
                    r.modifiedStart + r.modifiedLength - 1,
                  ))),
              o &&
                r.originalLength > 0 &&
                r.originalLength < 20 &&
                r.modifiedLength > 0 &&
                r.modifiedLength < 20 &&
                d())
            ) {
              const I = l.createCharSequence(
                  c,
                  r.originalStart,
                  r.originalStart + r.originalLength - 1,
                ),
                U = h.createCharSequence(
                  c,
                  r.modifiedStart,
                  r.modifiedStart + r.modifiedLength - 1,
                );
              if (I.getElements().length > 0 && U.getElements().length > 0) {
                let V = p(I, U, d, !0).changes;
                v && (V = b(V)), (B = []);
                for (let Q = 0, F = V.length; Q < F; Q++)
                  B.push(g.createFromDiffChange(V[Q], I, U));
              }
            }
            return new m(A, y, D, k, B);
          }
        }
        class C {
          constructor(c, r, l) {
            (this.shouldComputeCharChanges = l.shouldComputeCharChanges),
              (this.shouldPostProcessCharChanges =
                l.shouldPostProcessCharChanges),
              (this.shouldIgnoreTrimWhitespace = l.shouldIgnoreTrimWhitespace),
              (this.shouldMakePrettyDiff = l.shouldMakePrettyDiff),
              (this.originalLines = c),
              (this.modifiedLines = r),
              (this.original = new e(c)),
              (this.modified = new e(r)),
              (this.continueLineDiff = N(l.maxComputationTime)),
              (this.continueCharDiff = N(
                l.maxComputationTime === 0
                  ? 0
                  : Math.min(l.maxComputationTime, 5e3),
              ));
          }
          computeDiff() {
            if (
              this.original.lines.length === 1 &&
              this.original.lines[0].length === 0
            )
              return this.modified.lines.length === 1 &&
                this.modified.lines[0].length === 0
                ? { quitEarly: !1, changes: [] }
                : {
                    quitEarly: !1,
                    changes: [
                      {
                        originalStartLineNumber: 1,
                        originalEndLineNumber: 1,
                        modifiedStartLineNumber: 1,
                        modifiedEndLineNumber: this.modified.lines.length,
                        charChanges: void 0,
                      },
                    ],
                  };
            if (
              this.modified.lines.length === 1 &&
              this.modified.lines[0].length === 0
            )
              return {
                quitEarly: !1,
                changes: [
                  {
                    originalStartLineNumber: 1,
                    originalEndLineNumber: this.original.lines.length,
                    modifiedStartLineNumber: 1,
                    modifiedEndLineNumber: 1,
                    charChanges: void 0,
                  },
                ],
              };
            const c = p(
                this.original,
                this.modified,
                this.continueLineDiff,
                this.shouldMakePrettyDiff,
              ),
              r = c.changes,
              l = c.quitEarly;
            if (this.shouldIgnoreTrimWhitespace) {
              const v = [];
              for (let A = 0, y = r.length; A < y; A++)
                v.push(
                  m.createFromDiffResult(
                    this.shouldIgnoreTrimWhitespace,
                    r[A],
                    this.original,
                    this.modified,
                    this.continueCharDiff,
                    this.shouldComputeCharChanges,
                    this.shouldPostProcessCharChanges,
                  ),
                );
              return { quitEarly: l, changes: v };
            }
            const h = [];
            let d = 0,
              o = 0;
            for (let v = -1, A = r.length; v < A; v++) {
              const y = v + 1 < A ? r[v + 1] : null,
                D = y ? y.originalStart : this.originalLines.length,
                k = y ? y.modifiedStart : this.modifiedLines.length;
              for (; d < D && o < k; ) {
                const B = this.originalLines[d],
                  I = this.modifiedLines[o];
                if (B !== I) {
                  {
                    let U = E(B, 1),
                      V = E(I, 1);
                    for (; U > 1 && V > 1; ) {
                      const Q = B.charCodeAt(U - 2),
                        F = I.charCodeAt(V - 2);
                      if (Q !== F) break;
                      U--, V--;
                    }
                    (U > 1 || V > 1) &&
                      this._pushTrimWhitespaceCharChange(
                        h,
                        d + 1,
                        1,
                        U,
                        o + 1,
                        1,
                        V,
                      );
                  }
                  {
                    let U = L(B, 1),
                      V = L(I, 1);
                    const Q = B.length + 1,
                      F = I.length + 1;
                    for (; U < Q && V < F; ) {
                      const T = B.charCodeAt(U - 1),
                        q = B.charCodeAt(V - 1);
                      if (T !== q) break;
                      U++, V++;
                    }
                    (U < Q || V < F) &&
                      this._pushTrimWhitespaceCharChange(
                        h,
                        d + 1,
                        U,
                        Q,
                        o + 1,
                        V,
                        F,
                      );
                  }
                }
                d++, o++;
              }
              y &&
                (h.push(
                  m.createFromDiffResult(
                    this.shouldIgnoreTrimWhitespace,
                    y,
                    this.original,
                    this.modified,
                    this.continueCharDiff,
                    this.shouldComputeCharChanges,
                    this.shouldPostProcessCharChanges,
                  ),
                ),
                (d += y.originalLength),
                (o += y.modifiedLength));
            }
            return { quitEarly: l, changes: h };
          }
          _pushTrimWhitespaceCharChange(c, r, l, h, d, o, v) {
            if (this._mergeTrimWhitespaceCharChange(c, r, l, h, d, o, v))
              return;
            let A;
            this.shouldComputeCharChanges &&
              (A = [new g(r, l, r, h, d, o, d, v)]),
              c.push(new m(r, r, d, d, A));
          }
          _mergeTrimWhitespaceCharChange(c, r, l, h, d, o, v) {
            const A = c.length;
            if (A === 0) return !1;
            const y = c[A - 1];
            return y.originalEndLineNumber === 0 ||
              y.modifiedEndLineNumber === 0
              ? !1
              : y.originalEndLineNumber === r && y.modifiedEndLineNumber === d
              ? (this.shouldComputeCharChanges &&
                  y.charChanges &&
                  y.charChanges.push(new g(r, l, r, h, d, o, d, v)),
                !0)
              : y.originalEndLineNumber + 1 === r &&
                y.modifiedEndLineNumber + 1 === d
              ? ((y.originalEndLineNumber = r),
                (y.modifiedEndLineNumber = d),
                this.shouldComputeCharChanges &&
                  y.charChanges &&
                  y.charChanges.push(new g(r, l, r, h, d, o, d, v)),
                !0)
              : !1;
          }
        }
        n.DiffComputer = C;
        function E(w, c) {
          const r = i.firstNonWhitespaceIndex(w);
          return r === -1 ? c : r + 1;
        }
        function L(w, c) {
          const r = i.lastNonWhitespaceIndex(w);
          return r === -1 ? c : r + 2;
        }
        function N(w) {
          if (w === 0) return () => !0;
          const c = Date.now();
          return () => Date.now() - c < w;
        }
      },
    ),
    Y(
      X[41],
      J([0, 1, 10, 13, 6, 3, 2, 7, 39, 36, 37, 23]),
      function (x, n, R, M, i, u, _, S, a, s, p, e) {
        'use strict';
        Object.defineProperty(n, '__esModule', { value: !0 }),
          (n.LineSequence =
            n.getLineRangeMapping =
            n.lineRangeMappingFromRangeMappings =
            n.StandardLinesDiffComputer =
              void 0);
        class f {
          constructor() {
            (this.dynamicProgrammingDiffing =
              new a.DynamicProgrammingDiffing()),
              (this.myersDiffingAlgorithm = new p.MyersDiffAlgorithm());
          }
          computeDiff(v, A, y) {
            const D =
                y.maxComputationTimeMs === 0
                  ? S.InfiniteTimeout.instance
                  : new S.DateTimeout(y.maxComputationTimeMs),
              k = !y.ignoreTrimWhitespace,
              B = new Map();
            function I(re) {
              let se = B.get(re);
              return se === void 0 && ((se = B.size), B.set(re, se)), se;
            }
            const U = v.map(re => I(re.trim())),
              V = A.map(re => I(re.trim())),
              Q = new L(U, v),
              F = new L(V, A),
              T = (() =>
                Q.length + F.length < 1500
                  ? this.dynamicProgrammingDiffing.compute(Q, F, D, (re, se) =>
                      v[re] === A[se]
                        ? A[se].length === 0
                          ? 0.1
                          : 1 + Math.log(1 + A[se].length)
                        : 0.99,
                    )
                  : this.myersDiffingAlgorithm.compute(Q, F))();
            let q = T.diffs,
              H = T.hitTimeout;
            q = (0, s.optimizeSequenceDiffs)(Q, F, q);
            const t = [],
              oe = re => {
                if (k)
                  for (let se = 0; se < re; se++) {
                    const ge = ne + se,
                      Le = he + se;
                    if (v[ge] !== A[Le]) {
                      const Se = this.refineDiff(
                        v,
                        A,
                        new S.SequenceDiff(
                          new i.OffsetRange(ge, ge + 1),
                          new i.OffsetRange(Le, Le + 1),
                        ),
                        D,
                        k,
                      );
                      for (const Z of Se.mappings) t.push(Z);
                      Se.hitTimeout && (H = !0);
                    }
                  }
              };
            let ne = 0,
              he = 0;
            for (const re of q) {
              (0, R.assertFn)(
                () => re.seq1Range.start - ne === re.seq2Range.start - he,
              );
              const se = re.seq1Range.start - ne;
              oe(se),
                (ne = re.seq1Range.endExclusive),
                (he = re.seq2Range.endExclusive);
              const ge = this.refineDiff(v, A, re, D, k);
              ge.hitTimeout && (H = !0);
              for (const Le of ge.mappings) t.push(Le);
            }
            oe(v.length - ne);
            const be = m(t, v, A);
            return new e.LinesDiff(be, H);
          }
          refineDiff(v, A, y, D, k) {
            const B = new w(v, y.seq1Range, k),
              I = new w(A, y.seq2Range, k),
              U =
                B.length + I.length < 500
                  ? this.dynamicProgrammingDiffing.compute(B, I, D)
                  : this.myersDiffingAlgorithm.compute(B, I, D);
            let V = U.diffs;
            return (
              (V = (0, s.optimizeSequenceDiffs)(B, I, V)),
              (V = g(B, I, V)),
              (V = (0, s.smoothenSequenceDiffs)(B, I, V)),
              {
                mappings: V.map(
                  F =>
                    new e.RangeMapping(
                      B.translateRange(F.seq1Range),
                      I.translateRange(F.seq2Range),
                    ),
                ),
                hitTimeout: U.hitTimeout,
              }
            );
          }
        }
        n.StandardLinesDiffComputer = f;
        function g(o, v, A) {
          const y = [];
          let D;
          function k() {
            if (!D) return;
            const I = D.s1Range.length - D.deleted,
              U = D.s2Range.length - D.added;
            Math.max(D.deleted, D.added) + (D.count - 1) > I &&
              y.push(new S.SequenceDiff(D.s1Range, D.s2Range)),
              (D = void 0);
          }
          for (const I of A) {
            let U = function (q, H) {
              var t, oe, ne, he;
              if (
                !D ||
                !D.s1Range.containsRange(q) ||
                !D.s2Range.containsRange(H)
              )
                if (
                  D &&
                  !(
                    D.s1Range.endExclusive < q.start &&
                    D.s2Range.endExclusive < H.start
                  )
                ) {
                  const se = i.OffsetRange.tryCreate(
                      D.s1Range.endExclusive,
                      q.start,
                    ),
                    ge = i.OffsetRange.tryCreate(
                      D.s2Range.endExclusive,
                      H.start,
                    );
                  (D.deleted +=
                    (t = se?.length) !== null && t !== void 0 ? t : 0),
                    (D.added +=
                      (oe = ge?.length) !== null && oe !== void 0 ? oe : 0),
                    (D.s1Range = D.s1Range.join(q)),
                    (D.s2Range = D.s2Range.join(H));
                } else
                  k(),
                    (D = {
                      added: 0,
                      deleted: 0,
                      count: 0,
                      s1Range: q,
                      s2Range: H,
                    });
              const be = q.intersect(I.seq1Range),
                re = H.intersect(I.seq2Range);
              D.count++,
                (D.deleted +=
                  (ne = be?.length) !== null && ne !== void 0 ? ne : 0),
                (D.added +=
                  (he = re?.length) !== null && he !== void 0 ? he : 0);
            };
            const V = o.findWordContaining(I.seq1Range.start - 1),
              Q = v.findWordContaining(I.seq2Range.start - 1),
              F = o.findWordContaining(I.seq1Range.endExclusive),
              T = v.findWordContaining(I.seq2Range.endExclusive);
            V && F && Q && T && V.equals(F) && Q.equals(T)
              ? U(V, Q)
              : (V && Q && U(V, Q), F && T && U(F, T));
          }
          return k(), b(A, y);
        }
        function b(o, v) {
          const A = [];
          for (; o.length > 0 || v.length > 0; ) {
            const y = o[0],
              D = v[0];
            let k;
            y && (!D || y.seq1Range.start < D.seq1Range.start)
              ? (k = o.shift())
              : (k = v.shift()),
              A.length > 0 &&
              A[A.length - 1].seq1Range.endExclusive >= k.seq1Range.start
                ? (A[A.length - 1] = A[A.length - 1].join(k))
                : A.push(k);
          }
          return A;
        }
        function m(o, v, A) {
          const y = [];
          for (const D of E(
            o.map(k => C(k, v, A)),
            (k, B) =>
              k.originalRange.overlapOrTouch(B.originalRange) ||
              k.modifiedRange.overlapOrTouch(B.modifiedRange),
          )) {
            const k = D[0],
              B = D[D.length - 1];
            y.push(
              new e.LineRangeMapping(
                k.originalRange.join(B.originalRange),
                k.modifiedRange.join(B.modifiedRange),
                D.map(I => I.innerChanges[0]),
              ),
            );
          }
          return (
            (0, R.assertFn)(() =>
              (0, R.checkAdjacentItems)(
                y,
                (D, k) =>
                  k.originalRange.startLineNumber -
                    D.originalRange.endLineNumberExclusive ===
                    k.modifiedRange.startLineNumber -
                      D.modifiedRange.endLineNumberExclusive &&
                  D.originalRange.endLineNumberExclusive <
                    k.originalRange.startLineNumber &&
                  D.modifiedRange.endLineNumberExclusive <
                    k.modifiedRange.startLineNumber,
              ),
            ),
            y
          );
        }
        n.lineRangeMappingFromRangeMappings = m;
        function C(o, v, A) {
          let y = 0,
            D = 0;
          o.modifiedRange.startColumn - 1 >=
            A[o.modifiedRange.startLineNumber - 1].length &&
            o.originalRange.startColumn - 1 >=
              v[o.originalRange.startLineNumber - 1].length &&
            (y = 1),
            o.modifiedRange.endColumn === 1 &&
              o.originalRange.endColumn === 1 &&
              o.originalRange.startLineNumber + y <=
                o.originalRange.endLineNumber &&
              o.modifiedRange.startLineNumber + y <=
                o.modifiedRange.endLineNumber &&
              (D = -1);
          const k = new M.LineRange(
              o.originalRange.startLineNumber + y,
              o.originalRange.endLineNumber + 1 + D,
            ),
            B = new M.LineRange(
              o.modifiedRange.startLineNumber + y,
              o.modifiedRange.endLineNumber + 1 + D,
            );
          return new e.LineRangeMapping(k, B, [o]);
        }
        n.getLineRangeMapping = C;
        function* E(o, v) {
          let A, y;
          for (const D of o)
            y !== void 0 && v(y, D) ? A.push(D) : (A && (yield A), (A = [D])),
              (y = D);
          A && (yield A);
        }
        class L {
          constructor(v, A) {
            (this.trimmedHash = v), (this.lines = A);
          }
          getElement(v) {
            return this.trimmedHash[v];
          }
          get length() {
            return this.trimmedHash.length;
          }
          getBoundaryScore(v) {
            const A = v === 0 ? 0 : N(this.lines[v - 1]),
              y = v === this.lines.length ? 0 : N(this.lines[v]);
            return 1e3 - (A + y);
          }
        }
        n.LineSequence = L;
        function N(o) {
          let v = 0;
          for (
            ;
            v < o.length && (o.charCodeAt(v) === 32 || o.charCodeAt(v) === 9);

          )
            v++;
          return v;
        }
        class w {
          constructor(v, A, y) {
            (this.lines = v),
              (this.considerWhitespaceChanges = y),
              (this.elements = []),
              (this.firstCharOffsetByLineMinusOne = []),
              (this.offsetByLine = []);
            let D = !1;
            A.start > 0 &&
              A.endExclusive >= v.length &&
              ((A = new i.OffsetRange(A.start - 1, A.endExclusive)), (D = !0)),
              (this.lineRange = A);
            for (
              let k = this.lineRange.start;
              k < this.lineRange.endExclusive;
              k++
            ) {
              let B = v[k],
                I = 0;
              if (D) (I = B.length), (B = ''), (D = !1);
              else if (!y) {
                const U = B.trimStart();
                (I = B.length - U.length), (B = U.trimEnd());
              }
              this.offsetByLine.push(I);
              for (let U = 0; U < B.length; U++)
                this.elements.push(B.charCodeAt(U));
              k < v.length - 1 &&
                (this.elements.push(
                  `
`.charCodeAt(0),
                ),
                (this.firstCharOffsetByLineMinusOne[k - this.lineRange.start] =
                  this.elements.length));
            }
            this.offsetByLine.push(0);
          }
          toString() {
            return `Slice: "${this.text}"`;
          }
          get text() {
            return [...this.elements].map(v => String.fromCharCode(v)).join('');
          }
          getElement(v) {
            return this.elements[v];
          }
          get length() {
            return this.elements.length;
          }
          getBoundaryScore(v) {
            const A = h(v > 0 ? this.elements[v - 1] : -1),
              y = h(v < this.elements.length ? this.elements[v] : -1);
            if (A === 6 && y === 7) return 0;
            let D = 0;
            return (
              A !== y && ((D += 10), y === 1 && (D += 1)),
              (D += l(A)),
              (D += l(y)),
              D
            );
          }
          translateOffset(v) {
            if (this.lineRange.isEmpty)
              return new u.Position(this.lineRange.start + 1, 1);
            let A = 0,
              y = this.firstCharOffsetByLineMinusOne.length;
            for (; A < y; ) {
              const k = Math.floor((A + y) / 2);
              this.firstCharOffsetByLineMinusOne[k] > v ? (y = k) : (A = k + 1);
            }
            const D = A === 0 ? 0 : this.firstCharOffsetByLineMinusOne[A - 1];
            return new u.Position(
              this.lineRange.start + A + 1,
              v - D + 1 + this.offsetByLine[A],
            );
          }
          translateRange(v) {
            return _.Range.fromPositions(
              this.translateOffset(v.start),
              this.translateOffset(v.endExclusive),
            );
          }
          findWordContaining(v) {
            if (v < 0 || v >= this.elements.length || !c(this.elements[v]))
              return;
            let A = v;
            for (; A > 0 && c(this.elements[A - 1]); ) A--;
            let y = v;
            for (; y < this.elements.length && c(this.elements[y]); ) y++;
            return new i.OffsetRange(A, y);
          }
        }
        function c(o) {
          return (
            (o >= 97 && o <= 122) ||
            (o >= 65 && o <= 90) ||
            (o >= 48 && o <= 57)
          );
        }
        const r = {
          [0]: 0,
          [1]: 0,
          [2]: 0,
          [3]: 10,
          [4]: 2,
          [5]: 3,
          [6]: 10,
          [7]: 10,
        };
        function l(o) {
          return r[o];
        }
        function h(o) {
          return o === 10
            ? 7
            : o === 13
            ? 6
            : d(o)
            ? 5
            : o >= 97 && o <= 122
            ? 0
            : o >= 65 && o <= 90
            ? 1
            : o >= 48 && o <= 57
            ? 2
            : o === -1
            ? 3
            : 4;
        }
        function d(o) {
          return o === 32 || o === 9;
        }
      },
    ),
    Y(X[42], J([0, 1, 40, 41]), function (x, n, R, M) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.linesDiffComputers = void 0),
        (n.linesDiffComputers = {
          legacy: new R.SmartLinesDiffComputer(),
          advanced: new M.StandardLinesDiffComputer(),
        });
    }),
    Y(X[43], J([0, 1, 28]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.computeDefaultDocumentColors = void 0);
      function M(f) {
        const g = [];
        for (const b of f) {
          const m = Number(b);
          (m || (m === 0 && b.replace(/\s/g, '') !== '')) && g.push(m);
        }
        return g;
      }
      function i(f, g, b, m) {
        return { red: f / 255, blue: b / 255, green: g / 255, alpha: m };
      }
      function u(f, g) {
        const b = g.index,
          m = g[0].length;
        if (!b) return;
        const C = f.positionAt(b);
        return {
          startLineNumber: C.lineNumber,
          startColumn: C.column,
          endLineNumber: C.lineNumber,
          endColumn: C.column + m,
        };
      }
      function _(f, g) {
        if (!f) return;
        const b = R.Color.Format.CSS.parseHex(g);
        if (b)
          return { range: f, color: i(b.rgba.r, b.rgba.g, b.rgba.b, b.rgba.a) };
      }
      function S(f, g, b) {
        if (!f || g.length !== 1) return;
        const C = g[0].values(),
          E = M(C);
        return { range: f, color: i(E[0], E[1], E[2], b ? E[3] : 1) };
      }
      function a(f, g, b) {
        if (!f || g.length !== 1) return;
        const C = g[0].values(),
          E = M(C),
          L = new R.Color(
            new R.HSLA(E[0], E[1] / 100, E[2] / 100, b ? E[3] : 1),
          );
        return { range: f, color: i(L.rgba.r, L.rgba.g, L.rgba.b, L.rgba.a) };
      }
      function s(f, g) {
        return typeof f == 'string' ? [...f.matchAll(g)] : f.findMatches(g);
      }
      function p(f) {
        const g = [],
          m = s(
            f,
            /\b(rgb|rgba|hsl|hsla)(\([0-9\s,.\%]*\))|(#)([A-Fa-f0-9]{6})\b|(#)([A-Fa-f0-9]{8})\b/gm,
          );
        if (m.length > 0)
          for (const C of m) {
            const E = C.filter(c => c !== void 0),
              L = E[1],
              N = E[2];
            if (!N) continue;
            let w;
            if (L === 'rgb') {
              const c =
                /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*\)$/gm;
              w = S(u(f, C), s(N, c), !1);
            } else if (L === 'rgba') {
              const c =
                /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(0[.][0-9]+|[.][0-9]+|[01][.]|[01])\s*\)$/gm;
              w = S(u(f, C), s(N, c), !0);
            } else if (L === 'hsl') {
              const c =
                /^\(\s*(36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])\s*,\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*,\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*\)$/gm;
              w = a(u(f, C), s(N, c), !1);
            } else if (L === 'hsla') {
              const c =
                /^\(\s*(36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])\s*,\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*,\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*,\s*(0[.][0-9]+|[.][0-9]+|[01][.]|[01])\s*\)$/gm;
              w = a(u(f, C), s(N, c), !0);
            } else L === '#' && (w = _(u(f, C), L + N));
            w && g.push(w);
          }
        return g;
      }
      function e(f) {
        return !f ||
          typeof f.getValue != 'function' ||
          typeof f.positionAt != 'function'
          ? []
          : p(f);
      }
      n.computeDefaultDocumentColors = e;
    }),
    Y(X[44], J([0, 1, 21]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.computeLinks = n.LinkComputer = n.StateMachine = void 0);
      class M {
        constructor(f, g, b) {
          const m = new Uint8Array(f * g);
          for (let C = 0, E = f * g; C < E; C++) m[C] = b;
          (this._data = m), (this.rows = f), (this.cols = g);
        }
        get(f, g) {
          return this._data[f * this.cols + g];
        }
        set(f, g, b) {
          this._data[f * this.cols + g] = b;
        }
      }
      class i {
        constructor(f) {
          let g = 0,
            b = 0;
          for (let C = 0, E = f.length; C < E; C++) {
            const [L, N, w] = f[C];
            N > g && (g = N), L > b && (b = L), w > b && (b = w);
          }
          g++, b++;
          const m = new M(b, g, 0);
          for (let C = 0, E = f.length; C < E; C++) {
            const [L, N, w] = f[C];
            m.set(L, N, w);
          }
          (this._states = m), (this._maxCharCode = g);
        }
        nextState(f, g) {
          return g < 0 || g >= this._maxCharCode ? 0 : this._states.get(f, g);
        }
      }
      n.StateMachine = i;
      let u = null;
      function _() {
        return (
          u === null &&
            (u = new i([
              [1, 104, 2],
              [1, 72, 2],
              [1, 102, 6],
              [1, 70, 6],
              [2, 116, 3],
              [2, 84, 3],
              [3, 116, 4],
              [3, 84, 4],
              [4, 112, 5],
              [4, 80, 5],
              [5, 115, 9],
              [5, 83, 9],
              [5, 58, 10],
              [6, 105, 7],
              [6, 73, 7],
              [7, 108, 8],
              [7, 76, 8],
              [8, 101, 9],
              [8, 69, 9],
              [9, 58, 10],
              [10, 47, 11],
              [11, 47, 12],
            ])),
          u
        );
      }
      let S = null;
      function a() {
        if (S === null) {
          S = new R.CharacterClassifier(0);
          const e = ` 	<>'"\u3001\u3002\uFF61\uFF64\uFF0C\uFF0E\uFF1A\uFF1B\u2018\u3008\u300C\u300E\u3014\uFF08\uFF3B\uFF5B\uFF62\uFF63\uFF5D\uFF3D\uFF09\u3015\u300F\u300D\u3009\u2019\uFF40\uFF5E\u2026`;
          for (let g = 0; g < e.length; g++) S.set(e.charCodeAt(g), 1);
          const f = '.,;:';
          for (let g = 0; g < f.length; g++) S.set(f.charCodeAt(g), 2);
        }
        return S;
      }
      class s {
        static _createLink(f, g, b, m, C) {
          let E = C - 1;
          do {
            const L = g.charCodeAt(E);
            if (f.get(L) !== 2) break;
            E--;
          } while (E > m);
          if (m > 0) {
            const L = g.charCodeAt(m - 1),
              N = g.charCodeAt(E);
            ((L === 40 && N === 41) ||
              (L === 91 && N === 93) ||
              (L === 123 && N === 125)) &&
              E--;
          }
          return {
            range: {
              startLineNumber: b,
              startColumn: m + 1,
              endLineNumber: b,
              endColumn: E + 2,
            },
            url: g.substring(m, E + 1),
          };
        }
        static computeLinks(f, g = _()) {
          const b = a(),
            m = [];
          for (let C = 1, E = f.getLineCount(); C <= E; C++) {
            const L = f.getLineContent(C),
              N = L.length;
            let w = 0,
              c = 0,
              r = 0,
              l = 1,
              h = !1,
              d = !1,
              o = !1,
              v = !1;
            for (; w < N; ) {
              let A = !1;
              const y = L.charCodeAt(w);
              if (l === 13) {
                let D;
                switch (y) {
                  case 40:
                    (h = !0), (D = 0);
                    break;
                  case 41:
                    D = h ? 0 : 1;
                    break;
                  case 91:
                    (o = !0), (d = !0), (D = 0);
                    break;
                  case 93:
                    (o = !1), (D = d ? 0 : 1);
                    break;
                  case 123:
                    (v = !0), (D = 0);
                    break;
                  case 125:
                    D = v ? 0 : 1;
                    break;
                  case 39:
                  case 34:
                  case 96:
                    r === y
                      ? (D = 1)
                      : r === 39 || r === 34 || r === 96
                      ? (D = 0)
                      : (D = 1);
                    break;
                  case 42:
                    D = r === 42 ? 1 : 0;
                    break;
                  case 124:
                    D = r === 124 ? 1 : 0;
                    break;
                  case 32:
                    D = o ? 0 : 1;
                    break;
                  default:
                    D = b.get(y);
                }
                D === 1 && (m.push(s._createLink(b, L, C, c, w)), (A = !0));
              } else if (l === 12) {
                let D;
                y === 91 ? ((d = !0), (D = 0)) : (D = b.get(y)),
                  D === 1 ? (A = !0) : (l = 13);
              } else (l = g.nextState(l, y)), l === 0 && (A = !0);
              A &&
                ((l = 1), (h = !1), (d = !1), (v = !1), (c = w + 1), (r = y)),
                w++;
            }
            l === 13 && m.push(s._createLink(b, L, C, c, N));
          }
          return m;
        }
      }
      n.LinkComputer = s;
      function p(e) {
        return !e ||
          typeof e.getLineCount != 'function' ||
          typeof e.getLineContent != 'function'
          ? []
          : s.computeLinks(e);
      }
      n.computeLinks = p;
    }),
    Y(X[45], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.BasicInplaceReplace = void 0);
      class R {
        constructor() {
          this._defaultValueSet = [
            ['true', 'false'],
            ['True', 'False'],
            [
              'Private',
              'Public',
              'Friend',
              'ReadOnly',
              'Partial',
              'Protected',
              'WriteOnly',
            ],
            ['public', 'protected', 'private'],
          ];
        }
        navigateValueSet(i, u, _, S, a) {
          if (i && u) {
            const s = this.doNavigateValueSet(u, a);
            if (s) return { range: i, value: s };
          }
          if (_ && S) {
            const s = this.doNavigateValueSet(S, a);
            if (s) return { range: _, value: s };
          }
          return null;
        }
        doNavigateValueSet(i, u) {
          const _ = this.numberReplace(i, u);
          return _ !== null ? _ : this.textReplace(i, u);
        }
        numberReplace(i, u) {
          const _ = Math.pow(10, i.length - (i.lastIndexOf('.') + 1));
          let S = Number(i);
          const a = parseFloat(i);
          return !isNaN(S) && !isNaN(a) && S === a
            ? S === 0 && !u
              ? null
              : ((S = Math.floor(S * _)), (S += u ? _ : -_), String(S / _))
            : null;
        }
        textReplace(i, u) {
          return this.valueSetsReplace(this._defaultValueSet, i, u);
        }
        valueSetsReplace(i, u, _) {
          let S = null;
          for (let a = 0, s = i.length; S === null && a < s; a++)
            S = this.valueSetReplace(i[a], u, _);
          return S;
        }
        valueSetReplace(i, u, _) {
          let S = i.indexOf(u);
          return S >= 0
            ? ((S += _ ? 1 : -1),
              S < 0 ? (S = i.length - 1) : (S %= i.length),
              i[S])
            : null;
        }
      }
      (n.BasicInplaceReplace = R), (R.INSTANCE = new R());
    }),
    Y(X[46], J([0, 1, 12]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.shouldSynchronizeModel =
          n.ApplyEditsResult =
          n.SearchData =
          n.ValidAnnotatedEditOperation =
          n.isITextSnapshot =
          n.FindMatch =
          n.TextModelResolvedOptions =
          n.InjectedTextCursorStops =
          n.MinimapPosition =
          n.GlyphMarginLane =
          n.OverviewRulerLane =
            void 0);
      var M;
      (function (b) {
        (b[(b.Left = 1)] = 'Left'),
          (b[(b.Center = 2)] = 'Center'),
          (b[(b.Right = 4)] = 'Right'),
          (b[(b.Full = 7)] = 'Full');
      })(M || (n.OverviewRulerLane = M = {}));
      var i;
      (function (b) {
        (b[(b.Left = 1)] = 'Left'), (b[(b.Right = 2)] = 'Right');
      })(i || (n.GlyphMarginLane = i = {}));
      var u;
      (function (b) {
        (b[(b.Inline = 1)] = 'Inline'), (b[(b.Gutter = 2)] = 'Gutter');
      })(u || (n.MinimapPosition = u = {}));
      var _;
      (function (b) {
        (b[(b.Both = 0)] = 'Both'),
          (b[(b.Right = 1)] = 'Right'),
          (b[(b.Left = 2)] = 'Left'),
          (b[(b.None = 3)] = 'None');
      })(_ || (n.InjectedTextCursorStops = _ = {}));
      class S {
        get originalIndentSize() {
          return this._indentSizeIsTabSize ? 'tabSize' : this.indentSize;
        }
        constructor(m) {
          (this._textModelResolvedOptionsBrand = void 0),
            (this.tabSize = Math.max(1, m.tabSize | 0)),
            m.indentSize === 'tabSize'
              ? ((this.indentSize = this.tabSize),
                (this._indentSizeIsTabSize = !0))
              : ((this.indentSize = Math.max(1, m.indentSize | 0)),
                (this._indentSizeIsTabSize = !1)),
            (this.insertSpaces = !!m.insertSpaces),
            (this.defaultEOL = m.defaultEOL | 0),
            (this.trimAutoWhitespace = !!m.trimAutoWhitespace),
            (this.bracketPairColorizationOptions =
              m.bracketPairColorizationOptions);
        }
        equals(m) {
          return (
            this.tabSize === m.tabSize &&
            this._indentSizeIsTabSize === m._indentSizeIsTabSize &&
            this.indentSize === m.indentSize &&
            this.insertSpaces === m.insertSpaces &&
            this.defaultEOL === m.defaultEOL &&
            this.trimAutoWhitespace === m.trimAutoWhitespace &&
            (0, R.equals)(
              this.bracketPairColorizationOptions,
              m.bracketPairColorizationOptions,
            )
          );
        }
        createChangeEvent(m) {
          return {
            tabSize: this.tabSize !== m.tabSize,
            indentSize: this.indentSize !== m.indentSize,
            insertSpaces: this.insertSpaces !== m.insertSpaces,
            trimAutoWhitespace:
              this.trimAutoWhitespace !== m.trimAutoWhitespace,
          };
        }
      }
      n.TextModelResolvedOptions = S;
      class a {
        constructor(m, C) {
          (this._findMatchBrand = void 0), (this.range = m), (this.matches = C);
        }
      }
      n.FindMatch = a;
      function s(b) {
        return b && typeof b.read == 'function';
      }
      n.isITextSnapshot = s;
      class p {
        constructor(m, C, E, L, N, w) {
          (this.identifier = m),
            (this.range = C),
            (this.text = E),
            (this.forceMoveMarkers = L),
            (this.isAutoWhitespaceEdit = N),
            (this._isTracked = w);
        }
      }
      n.ValidAnnotatedEditOperation = p;
      class e {
        constructor(m, C, E) {
          (this.regex = m), (this.wordSeparators = C), (this.simpleSearch = E);
        }
      }
      n.SearchData = e;
      class f {
        constructor(m, C, E) {
          (this.reverseEdits = m),
            (this.changes = C),
            (this.trimAutoWhitespaceLineNumbers = E);
        }
      }
      n.ApplyEditsResult = f;
      function g(b) {
        return !b.isTooLargeForSyncing() && !b.isForSimpleWidget;
      }
      n.shouldSynchronizeModel = g;
    }),
    Y(X[47], J([0, 1, 26, 20]), function (x, n, R, M) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.PrefixSumIndexOfResult =
          n.ConstantTimePrefixSumComputer =
          n.PrefixSumComputer =
            void 0);
      class i {
        constructor(a) {
          (this.values = a),
            (this.prefixSum = new Uint32Array(a.length)),
            (this.prefixSumValidIndex = new Int32Array(1)),
            (this.prefixSumValidIndex[0] = -1);
        }
        insertValues(a, s) {
          a = (0, M.toUint32)(a);
          const p = this.values,
            e = this.prefixSum,
            f = s.length;
          return f === 0
            ? !1
            : ((this.values = new Uint32Array(p.length + f)),
              this.values.set(p.subarray(0, a), 0),
              this.values.set(p.subarray(a), a + f),
              this.values.set(s, a),
              a - 1 < this.prefixSumValidIndex[0] &&
                (this.prefixSumValidIndex[0] = a - 1),
              (this.prefixSum = new Uint32Array(this.values.length)),
              this.prefixSumValidIndex[0] >= 0 &&
                this.prefixSum.set(
                  e.subarray(0, this.prefixSumValidIndex[0] + 1),
                ),
              !0);
        }
        setValue(a, s) {
          return (
            (a = (0, M.toUint32)(a)),
            (s = (0, M.toUint32)(s)),
            this.values[a] === s
              ? !1
              : ((this.values[a] = s),
                a - 1 < this.prefixSumValidIndex[0] &&
                  (this.prefixSumValidIndex[0] = a - 1),
                !0)
          );
        }
        removeValues(a, s) {
          (a = (0, M.toUint32)(a)), (s = (0, M.toUint32)(s));
          const p = this.values,
            e = this.prefixSum;
          if (a >= p.length) return !1;
          const f = p.length - a;
          return (
            s >= f && (s = f),
            s === 0
              ? !1
              : ((this.values = new Uint32Array(p.length - s)),
                this.values.set(p.subarray(0, a), 0),
                this.values.set(p.subarray(a + s), a),
                (this.prefixSum = new Uint32Array(this.values.length)),
                a - 1 < this.prefixSumValidIndex[0] &&
                  (this.prefixSumValidIndex[0] = a - 1),
                this.prefixSumValidIndex[0] >= 0 &&
                  this.prefixSum.set(
                    e.subarray(0, this.prefixSumValidIndex[0] + 1),
                  ),
                !0)
          );
        }
        getTotalSum() {
          return this.values.length === 0
            ? 0
            : this._getPrefixSum(this.values.length - 1);
        }
        getPrefixSum(a) {
          return a < 0 ? 0 : ((a = (0, M.toUint32)(a)), this._getPrefixSum(a));
        }
        _getPrefixSum(a) {
          if (a <= this.prefixSumValidIndex[0]) return this.prefixSum[a];
          let s = this.prefixSumValidIndex[0] + 1;
          s === 0 && ((this.prefixSum[0] = this.values[0]), s++),
            a >= this.values.length && (a = this.values.length - 1);
          for (let p = s; p <= a; p++)
            this.prefixSum[p] = this.prefixSum[p - 1] + this.values[p];
          return (
            (this.prefixSumValidIndex[0] = Math.max(
              this.prefixSumValidIndex[0],
              a,
            )),
            this.prefixSum[a]
          );
        }
        getIndexOf(a) {
          (a = Math.floor(a)), this.getTotalSum();
          let s = 0,
            p = this.values.length - 1,
            e = 0,
            f = 0,
            g = 0;
          for (; s <= p; )
            if (
              ((e = (s + (p - s) / 2) | 0),
              (f = this.prefixSum[e]),
              (g = f - this.values[e]),
              a < g)
            )
              p = e - 1;
            else if (a >= f) s = e + 1;
            else break;
          return new _(e, a - g);
        }
      }
      n.PrefixSumComputer = i;
      class u {
        constructor(a) {
          (this._values = a),
            (this._isValid = !1),
            (this._validEndIndex = -1),
            (this._prefixSum = []),
            (this._indexBySum = []);
        }
        getTotalSum() {
          return this._ensureValid(), this._indexBySum.length;
        }
        getPrefixSum(a) {
          return this._ensureValid(), a === 0 ? 0 : this._prefixSum[a - 1];
        }
        getIndexOf(a) {
          this._ensureValid();
          const s = this._indexBySum[a],
            p = s > 0 ? this._prefixSum[s - 1] : 0;
          return new _(s, a - p);
        }
        removeValues(a, s) {
          this._values.splice(a, s), this._invalidate(a);
        }
        insertValues(a, s) {
          (this._values = (0, R.arrayInsert)(this._values, a, s)),
            this._invalidate(a);
        }
        _invalidate(a) {
          (this._isValid = !1),
            (this._validEndIndex = Math.min(this._validEndIndex, a - 1));
        }
        _ensureValid() {
          if (!this._isValid) {
            for (
              let a = this._validEndIndex + 1, s = this._values.length;
              a < s;
              a++
            ) {
              const p = this._values[a],
                e = a > 0 ? this._prefixSum[a - 1] : 0;
              this._prefixSum[a] = e + p;
              for (let f = 0; f < p; f++) this._indexBySum[e + f] = a;
            }
            (this._prefixSum.length = this._values.length),
              (this._indexBySum.length =
                this._prefixSum[this._prefixSum.length - 1]),
              (this._isValid = !0),
              (this._validEndIndex = this._values.length - 1);
          }
        }
        setValue(a, s) {
          this._values[a] !== s && ((this._values[a] = s), this._invalidate(a));
        }
      }
      n.ConstantTimePrefixSumComputer = u;
      class _ {
        constructor(a, s) {
          (this.index = a),
            (this.remainder = s),
            (this._prefixSumIndexOfResultBrand = void 0),
            (this.index = a),
            (this.remainder = s);
        }
      }
      n.PrefixSumIndexOfResult = _;
    }),
    Y(X[48], J([0, 1, 5, 3, 47]), function (x, n, R, M, i) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.MirrorTextModel = void 0);
      class u {
        constructor(S, a, s, p) {
          (this._uri = S),
            (this._lines = a),
            (this._eol = s),
            (this._versionId = p),
            (this._lineStarts = null),
            (this._cachedTextValue = null);
        }
        dispose() {
          this._lines.length = 0;
        }
        get version() {
          return this._versionId;
        }
        getText() {
          return (
            this._cachedTextValue === null &&
              (this._cachedTextValue = this._lines.join(this._eol)),
            this._cachedTextValue
          );
        }
        onEvents(S) {
          S.eol &&
            S.eol !== this._eol &&
            ((this._eol = S.eol), (this._lineStarts = null));
          const a = S.changes;
          for (const s of a)
            this._acceptDeleteRange(s.range),
              this._acceptInsertText(
                new M.Position(s.range.startLineNumber, s.range.startColumn),
                s.text,
              );
          (this._versionId = S.versionId), (this._cachedTextValue = null);
        }
        _ensureLineStarts() {
          if (!this._lineStarts) {
            const S = this._eol.length,
              a = this._lines.length,
              s = new Uint32Array(a);
            for (let p = 0; p < a; p++) s[p] = this._lines[p].length + S;
            this._lineStarts = new i.PrefixSumComputer(s);
          }
        }
        _setLineText(S, a) {
          (this._lines[S] = a),
            this._lineStarts &&
              this._lineStarts.setValue(
                S,
                this._lines[S].length + this._eol.length,
              );
        }
        _acceptDeleteRange(S) {
          if (S.startLineNumber === S.endLineNumber) {
            if (S.startColumn === S.endColumn) return;
            this._setLineText(
              S.startLineNumber - 1,
              this._lines[S.startLineNumber - 1].substring(
                0,
                S.startColumn - 1,
              ) + this._lines[S.startLineNumber - 1].substring(S.endColumn - 1),
            );
            return;
          }
          this._setLineText(
            S.startLineNumber - 1,
            this._lines[S.startLineNumber - 1].substring(0, S.startColumn - 1) +
              this._lines[S.endLineNumber - 1].substring(S.endColumn - 1),
          ),
            this._lines.splice(
              S.startLineNumber,
              S.endLineNumber - S.startLineNumber,
            ),
            this._lineStarts &&
              this._lineStarts.removeValues(
                S.startLineNumber,
                S.endLineNumber - S.startLineNumber,
              );
        }
        _acceptInsertText(S, a) {
          if (a.length === 0) return;
          const s = (0, R.splitLines)(a);
          if (s.length === 1) {
            this._setLineText(
              S.lineNumber - 1,
              this._lines[S.lineNumber - 1].substring(0, S.column - 1) +
                s[0] +
                this._lines[S.lineNumber - 1].substring(S.column - 1),
            );
            return;
          }
          (s[s.length - 1] += this._lines[S.lineNumber - 1].substring(
            S.column - 1,
          )),
            this._setLineText(
              S.lineNumber - 1,
              this._lines[S.lineNumber - 1].substring(0, S.column - 1) + s[0],
            );
          const p = new Uint32Array(s.length - 1);
          for (let e = 1; e < s.length; e++)
            this._lines.splice(S.lineNumber + e - 1, 0, s[e]),
              (p[e - 1] = s[e].length + this._eol.length);
          this._lineStarts && this._lineStarts.insertValues(S.lineNumber, p);
        }
      }
      n.MirrorTextModel = u;
    }),
    Y(X[49], J([0, 1, 5, 35, 3, 2, 46]), function (x, n, R, M, i, u, _) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.Searcher =
          n.isValidMatch =
          n.TextModelSearch =
          n.createFindMatch =
          n.isMultilineRegexSource =
          n.SearchParams =
            void 0);
      const S = 999;
      class a {
        constructor(L, N, w, c) {
          (this.searchString = L),
            (this.isRegex = N),
            (this.matchCase = w),
            (this.wordSeparators = c);
        }
        parseSearchRequest() {
          if (this.searchString === '') return null;
          let L;
          this.isRegex
            ? (L = s(this.searchString))
            : (L =
                this.searchString.indexOf(`
`) >= 0);
          let N = null;
          try {
            N = R.createRegExp(this.searchString, this.isRegex, {
              matchCase: this.matchCase,
              wholeWord: !1,
              multiline: L,
              global: !0,
              unicode: !0,
            });
          } catch {
            return null;
          }
          if (!N) return null;
          let w = !this.isRegex && !L;
          return (
            w &&
              this.searchString.toLowerCase() !==
                this.searchString.toUpperCase() &&
              (w = this.matchCase),
            new _.SearchData(
              N,
              this.wordSeparators
                ? (0, M.getMapForWordSeparators)(this.wordSeparators)
                : null,
              w ? this.searchString : null,
            )
          );
        }
      }
      n.SearchParams = a;
      function s(E) {
        if (!E || E.length === 0) return !1;
        for (let L = 0, N = E.length; L < N; L++) {
          const w = E.charCodeAt(L);
          if (w === 10) return !0;
          if (w === 92) {
            if ((L++, L >= N)) break;
            const c = E.charCodeAt(L);
            if (c === 110 || c === 114 || c === 87) return !0;
          }
        }
        return !1;
      }
      n.isMultilineRegexSource = s;
      function p(E, L, N) {
        if (!N) return new _.FindMatch(E, null);
        const w = [];
        for (let c = 0, r = L.length; c < r; c++) w[c] = L[c];
        return new _.FindMatch(E, w);
      }
      n.createFindMatch = p;
      class e {
        constructor(L) {
          const N = [];
          let w = 0;
          for (let c = 0, r = L.length; c < r; c++)
            L.charCodeAt(c) === 10 && (N[w++] = c);
          this._lineFeedsOffsets = N;
        }
        findLineFeedCountBeforeOffset(L) {
          const N = this._lineFeedsOffsets;
          let w = 0,
            c = N.length - 1;
          if (c === -1 || L <= N[0]) return 0;
          for (; w < c; ) {
            const r = w + (((c - w) / 2) >> 0);
            N[r] >= L
              ? (c = r - 1)
              : N[r + 1] >= L
              ? ((w = r), (c = r))
              : (w = r + 1);
          }
          return w + 1;
        }
      }
      class f {
        static findMatches(L, N, w, c, r) {
          const l = N.parseSearchRequest();
          return l
            ? l.regex.multiline
              ? this._doFindMatchesMultiline(
                  L,
                  w,
                  new C(l.wordSeparators, l.regex),
                  c,
                  r,
                )
              : this._doFindMatchesLineByLine(L, w, l, c, r)
            : [];
        }
        static _getMultilineMatchRange(L, N, w, c, r, l) {
          let h,
            d = 0;
          c
            ? ((d = c.findLineFeedCountBeforeOffset(r)), (h = N + r + d))
            : (h = N + r);
          let o;
          if (c) {
            const D = c.findLineFeedCountBeforeOffset(r + l.length) - d;
            o = h + l.length + D;
          } else o = h + l.length;
          const v = L.getPositionAt(h),
            A = L.getPositionAt(o);
          return new u.Range(v.lineNumber, v.column, A.lineNumber, A.column);
        }
        static _doFindMatchesMultiline(L, N, w, c, r) {
          const l = L.getOffsetAt(N.getStartPosition()),
            h = L.getValueInRange(N, 1),
            d =
              L.getEOL() ===
              `\r
`
                ? new e(h)
                : null,
            o = [];
          let v = 0,
            A;
          for (w.reset(0); (A = w.next(h)); )
            if (
              ((o[v++] = p(
                this._getMultilineMatchRange(L, l, h, d, A.index, A[0]),
                A,
                c,
              )),
              v >= r)
            )
              return o;
          return o;
        }
        static _doFindMatchesLineByLine(L, N, w, c, r) {
          const l = [];
          let h = 0;
          if (N.startLineNumber === N.endLineNumber) {
            const o = L.getLineContent(N.startLineNumber).substring(
              N.startColumn - 1,
              N.endColumn - 1,
            );
            return (
              (h = this._findMatchesInLine(
                w,
                o,
                N.startLineNumber,
                N.startColumn - 1,
                h,
                l,
                c,
                r,
              )),
              l
            );
          }
          const d = L.getLineContent(N.startLineNumber).substring(
            N.startColumn - 1,
          );
          h = this._findMatchesInLine(
            w,
            d,
            N.startLineNumber,
            N.startColumn - 1,
            h,
            l,
            c,
            r,
          );
          for (let o = N.startLineNumber + 1; o < N.endLineNumber && h < r; o++)
            h = this._findMatchesInLine(
              w,
              L.getLineContent(o),
              o,
              0,
              h,
              l,
              c,
              r,
            );
          if (h < r) {
            const o = L.getLineContent(N.endLineNumber).substring(
              0,
              N.endColumn - 1,
            );
            h = this._findMatchesInLine(w, o, N.endLineNumber, 0, h, l, c, r);
          }
          return l;
        }
        static _findMatchesInLine(L, N, w, c, r, l, h, d) {
          const o = L.wordSeparators;
          if (!h && L.simpleSearch) {
            const y = L.simpleSearch,
              D = y.length,
              k = N.length;
            let B = -D;
            for (; (B = N.indexOf(y, B + D)) !== -1; )
              if (
                (!o || m(o, N, k, B, D)) &&
                ((l[r++] = new _.FindMatch(
                  new u.Range(w, B + 1 + c, w, B + 1 + D + c),
                  null,
                )),
                r >= d)
              )
                return r;
            return r;
          }
          const v = new C(L.wordSeparators, L.regex);
          let A;
          v.reset(0);
          do
            if (
              ((A = v.next(N)),
              A &&
                ((l[r++] = p(
                  new u.Range(
                    w,
                    A.index + 1 + c,
                    w,
                    A.index + 1 + A[0].length + c,
                  ),
                  A,
                  h,
                )),
                r >= d))
            )
              return r;
          while (A);
          return r;
        }
        static findNextMatch(L, N, w, c) {
          const r = N.parseSearchRequest();
          if (!r) return null;
          const l = new C(r.wordSeparators, r.regex);
          return r.regex.multiline
            ? this._doFindNextMatchMultiline(L, w, l, c)
            : this._doFindNextMatchLineByLine(L, w, l, c);
        }
        static _doFindNextMatchMultiline(L, N, w, c) {
          const r = new i.Position(N.lineNumber, 1),
            l = L.getOffsetAt(r),
            h = L.getLineCount(),
            d = L.getValueInRange(
              new u.Range(r.lineNumber, r.column, h, L.getLineMaxColumn(h)),
              1,
            ),
            o =
              L.getEOL() ===
              `\r
`
                ? new e(d)
                : null;
          w.reset(N.column - 1);
          const v = w.next(d);
          return v
            ? p(this._getMultilineMatchRange(L, l, d, o, v.index, v[0]), v, c)
            : N.lineNumber !== 1 || N.column !== 1
            ? this._doFindNextMatchMultiline(L, new i.Position(1, 1), w, c)
            : null;
        }
        static _doFindNextMatchLineByLine(L, N, w, c) {
          const r = L.getLineCount(),
            l = N.lineNumber,
            h = L.getLineContent(l),
            d = this._findFirstMatchInLine(w, h, l, N.column, c);
          if (d) return d;
          for (let o = 1; o <= r; o++) {
            const v = (l + o - 1) % r,
              A = L.getLineContent(v + 1),
              y = this._findFirstMatchInLine(w, A, v + 1, 1, c);
            if (y) return y;
          }
          return null;
        }
        static _findFirstMatchInLine(L, N, w, c, r) {
          L.reset(c - 1);
          const l = L.next(N);
          return l
            ? p(new u.Range(w, l.index + 1, w, l.index + 1 + l[0].length), l, r)
            : null;
        }
        static findPreviousMatch(L, N, w, c) {
          const r = N.parseSearchRequest();
          if (!r) return null;
          const l = new C(r.wordSeparators, r.regex);
          return r.regex.multiline
            ? this._doFindPreviousMatchMultiline(L, w, l, c)
            : this._doFindPreviousMatchLineByLine(L, w, l, c);
        }
        static _doFindPreviousMatchMultiline(L, N, w, c) {
          const r = this._doFindMatchesMultiline(
            L,
            new u.Range(1, 1, N.lineNumber, N.column),
            w,
            c,
            10 * S,
          );
          if (r.length > 0) return r[r.length - 1];
          const l = L.getLineCount();
          return N.lineNumber !== l || N.column !== L.getLineMaxColumn(l)
            ? this._doFindPreviousMatchMultiline(
                L,
                new i.Position(l, L.getLineMaxColumn(l)),
                w,
                c,
              )
            : null;
        }
        static _doFindPreviousMatchLineByLine(L, N, w, c) {
          const r = L.getLineCount(),
            l = N.lineNumber,
            h = L.getLineContent(l).substring(0, N.column - 1),
            d = this._findLastMatchInLine(w, h, l, c);
          if (d) return d;
          for (let o = 1; o <= r; o++) {
            const v = (r + l - o - 1) % r,
              A = L.getLineContent(v + 1),
              y = this._findLastMatchInLine(w, A, v + 1, c);
            if (y) return y;
          }
          return null;
        }
        static _findLastMatchInLine(L, N, w, c) {
          let r = null,
            l;
          for (L.reset(0); (l = L.next(N)); )
            r = p(
              new u.Range(w, l.index + 1, w, l.index + 1 + l[0].length),
              l,
              c,
            );
          return r;
        }
      }
      n.TextModelSearch = f;
      function g(E, L, N, w, c) {
        if (w === 0) return !0;
        const r = L.charCodeAt(w - 1);
        if (E.get(r) !== 0 || r === 13 || r === 10) return !0;
        if (c > 0) {
          const l = L.charCodeAt(w);
          if (E.get(l) !== 0) return !0;
        }
        return !1;
      }
      function b(E, L, N, w, c) {
        if (w + c === N) return !0;
        const r = L.charCodeAt(w + c);
        if (E.get(r) !== 0 || r === 13 || r === 10) return !0;
        if (c > 0) {
          const l = L.charCodeAt(w + c - 1);
          if (E.get(l) !== 0) return !0;
        }
        return !1;
      }
      function m(E, L, N, w, c) {
        return g(E, L, N, w, c) && b(E, L, N, w, c);
      }
      n.isValidMatch = m;
      class C {
        constructor(L, N) {
          (this._wordSeparators = L),
            (this._searchRegex = N),
            (this._prevMatchStartIndex = -1),
            (this._prevMatchLength = 0);
        }
        reset(L) {
          (this._searchRegex.lastIndex = L),
            (this._prevMatchStartIndex = -1),
            (this._prevMatchLength = 0);
        }
        next(L) {
          const N = L.length;
          let w;
          do {
            if (
              this._prevMatchStartIndex + this._prevMatchLength === N ||
              ((w = this._searchRegex.exec(L)), !w)
            )
              return null;
            const c = w.index,
              r = w[0].length;
            if (
              c === this._prevMatchStartIndex &&
              r === this._prevMatchLength
            ) {
              if (r === 0) {
                R.getNextCodePoint(L, N, this._searchRegex.lastIndex) > 65535
                  ? (this._searchRegex.lastIndex += 2)
                  : (this._searchRegex.lastIndex += 1);
                continue;
              }
              return null;
            }
            if (
              ((this._prevMatchStartIndex = c),
              (this._prevMatchLength = r),
              !this._wordSeparators || m(this._wordSeparators, L, N, c, r))
            )
              return w;
          } while (w);
          return null;
        }
      }
      n.Searcher = C;
    }),
    Y(X[50], J([0, 1, 2, 49, 5, 10, 22]), function (x, n, R, M, i, u, _) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.UnicodeTextModelHighlighter = void 0);
      class S {
        static computeUnicodeHighlights(f, g, b) {
          const m = b ? b.startLineNumber : 1,
            C = b ? b.endLineNumber : f.getLineCount(),
            E = new s(g),
            L = E.getCandidateCodePoints();
          let N;
          L === 'allNonBasicAscii'
            ? (N = new RegExp('[^\\t\\n\\r\\x20-\\x7E]', 'g'))
            : (N = new RegExp(`${a(Array.from(L))}`, 'g'));
          const w = new M.Searcher(null, N),
            c = [];
          let r = !1,
            l,
            h = 0,
            d = 0,
            o = 0;
          e: for (let v = m, A = C; v <= A; v++) {
            const y = f.getLineContent(v),
              D = y.length;
            w.reset(0);
            do
              if (((l = w.next(y)), l)) {
                let k = l.index,
                  B = l.index + l[0].length;
                if (k > 0) {
                  const Q = y.charCodeAt(k - 1);
                  i.isHighSurrogate(Q) && k--;
                }
                if (B + 1 < D) {
                  const Q = y.charCodeAt(B - 1);
                  i.isHighSurrogate(Q) && B++;
                }
                const I = y.substring(k, B);
                let U = (0, _.getWordAtText)(
                  k + 1,
                  _.DEFAULT_WORD_REGEXP,
                  y,
                  0,
                );
                U && U.endColumn <= k + 1 && (U = null);
                const V = E.shouldHighlightNonBasicASCII(I, U ? U.word : null);
                if (V !== 0) {
                  V === 3
                    ? h++
                    : V === 2
                    ? d++
                    : V === 1
                    ? o++
                    : (0, u.assertNever)(V);
                  const Q = 1e3;
                  if (c.length >= Q) {
                    r = !0;
                    break e;
                  }
                  c.push(new R.Range(v, k + 1, v, B + 1));
                }
              }
            while (l);
          }
          return {
            ranges: c,
            hasMore: r,
            ambiguousCharacterCount: h,
            invisibleCharacterCount: d,
            nonBasicAsciiCharacterCount: o,
          };
        }
        static computeUnicodeHighlightReason(f, g) {
          const b = new s(g);
          switch (b.shouldHighlightNonBasicASCII(f, null)) {
            case 0:
              return null;
            case 2:
              return { kind: 1 };
            case 3: {
              const C = f.codePointAt(0),
                E = b.ambiguousCharacters.getPrimaryConfusable(C),
                L = i.AmbiguousCharacters.getLocales().filter(
                  N =>
                    !i.AmbiguousCharacters.getInstance(
                      new Set([...g.allowedLocales, N]),
                    ).isAmbiguous(C),
                );
              return {
                kind: 0,
                confusableWith: String.fromCodePoint(E),
                notAmbiguousInLocales: L,
              };
            }
            case 1:
              return { kind: 2 };
          }
        }
      }
      n.UnicodeTextModelHighlighter = S;
      function a(e, f) {
        return `[${i.escapeRegExpCharacters(
          e.map(b => String.fromCodePoint(b)).join(''),
        )}]`;
      }
      class s {
        constructor(f) {
          (this.options = f),
            (this.allowedCodePoints = new Set(f.allowedCodePoints)),
            (this.ambiguousCharacters = i.AmbiguousCharacters.getInstance(
              new Set(f.allowedLocales),
            ));
        }
        getCandidateCodePoints() {
          if (this.options.nonBasicASCII) return 'allNonBasicAscii';
          const f = new Set();
          if (this.options.invisibleCharacters)
            for (const g of i.InvisibleCharacters.codePoints)
              p(String.fromCodePoint(g)) || f.add(g);
          if (this.options.ambiguousCharacters)
            for (const g of this.ambiguousCharacters.getConfusableCodePoints())
              f.add(g);
          for (const g of this.allowedCodePoints) f.delete(g);
          return f;
        }
        shouldHighlightNonBasicASCII(f, g) {
          const b = f.codePointAt(0);
          if (this.allowedCodePoints.has(b)) return 0;
          if (this.options.nonBasicASCII) return 1;
          let m = !1,
            C = !1;
          if (g)
            for (const E of g) {
              const L = E.codePointAt(0),
                N = i.isBasicASCII(E);
              (m = m || N),
                !N &&
                  !this.ambiguousCharacters.isAmbiguous(L) &&
                  !i.InvisibleCharacters.isInvisibleCharacter(L) &&
                  (C = !0);
            }
          return !m && C
            ? 0
            : this.options.invisibleCharacters &&
              !p(f) &&
              i.InvisibleCharacters.isInvisibleCharacter(b)
            ? 2
            : this.options.ambiguousCharacters &&
              this.ambiguousCharacters.isAmbiguous(b)
            ? 3
            : 0;
        }
      }
      function p(e) {
        return (
          e === ' ' ||
          e ===
            `
` ||
          e === '	'
        );
      }
    }),
    Y(X[51], J([0, 1]), function (x, n) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.WrappingIndent =
          n.TrackedRangeStickiness =
          n.TextEditorCursorStyle =
          n.TextEditorCursorBlinkingStyle =
          n.SymbolTag =
          n.SymbolKind =
          n.SignatureHelpTriggerKind =
          n.SelectionDirection =
          n.ScrollbarVisibility =
          n.ScrollType =
          n.RenderMinimap =
          n.RenderLineNumbersType =
          n.PositionAffinity =
          n.OverviewRulerLane =
          n.OverlayWidgetPositionPreference =
          n.MouseTargetType =
          n.MinimapPosition =
          n.MarkerTag =
          n.MarkerSeverity =
          n.KeyCode =
          n.InlineCompletionTriggerKind =
          n.InlayHintKind =
          n.InjectedTextCursorStops =
          n.IndentAction =
          n.GlyphMarginLane =
          n.EndOfLineSequence =
          n.EndOfLinePreference =
          n.EditorOption =
          n.EditorAutoIndentStrategy =
          n.DocumentHighlightKind =
          n.DefaultEndOfLine =
          n.CursorChangeReason =
          n.ContentWidgetPositionPreference =
          n.CompletionTriggerKind =
          n.CompletionItemTag =
          n.CompletionItemKind =
          n.CompletionItemInsertTextRule =
          n.CodeActionTriggerType =
          n.AccessibilitySupport =
            void 0);
      var R;
      (function (t) {
        (t[(t.Unknown = 0)] = 'Unknown'),
          (t[(t.Disabled = 1)] = 'Disabled'),
          (t[(t.Enabled = 2)] = 'Enabled');
      })(R || (n.AccessibilitySupport = R = {}));
      var M;
      (function (t) {
        (t[(t.Invoke = 1)] = 'Invoke'), (t[(t.Auto = 2)] = 'Auto');
      })(M || (n.CodeActionTriggerType = M = {}));
      var i;
      (function (t) {
        (t[(t.None = 0)] = 'None'),
          (t[(t.KeepWhitespace = 1)] = 'KeepWhitespace'),
          (t[(t.InsertAsSnippet = 4)] = 'InsertAsSnippet');
      })(i || (n.CompletionItemInsertTextRule = i = {}));
      var u;
      (function (t) {
        (t[(t.Method = 0)] = 'Method'),
          (t[(t.Function = 1)] = 'Function'),
          (t[(t.Constructor = 2)] = 'Constructor'),
          (t[(t.Field = 3)] = 'Field'),
          (t[(t.Variable = 4)] = 'Variable'),
          (t[(t.Class = 5)] = 'Class'),
          (t[(t.Struct = 6)] = 'Struct'),
          (t[(t.Interface = 7)] = 'Interface'),
          (t[(t.Module = 8)] = 'Module'),
          (t[(t.Property = 9)] = 'Property'),
          (t[(t.Event = 10)] = 'Event'),
          (t[(t.Operator = 11)] = 'Operator'),
          (t[(t.Unit = 12)] = 'Unit'),
          (t[(t.Value = 13)] = 'Value'),
          (t[(t.Constant = 14)] = 'Constant'),
          (t[(t.Enum = 15)] = 'Enum'),
          (t[(t.EnumMember = 16)] = 'EnumMember'),
          (t[(t.Keyword = 17)] = 'Keyword'),
          (t[(t.Text = 18)] = 'Text'),
          (t[(t.Color = 19)] = 'Color'),
          (t[(t.File = 20)] = 'File'),
          (t[(t.Reference = 21)] = 'Reference'),
          (t[(t.Customcolor = 22)] = 'Customcolor'),
          (t[(t.Folder = 23)] = 'Folder'),
          (t[(t.TypeParameter = 24)] = 'TypeParameter'),
          (t[(t.User = 25)] = 'User'),
          (t[(t.Issue = 26)] = 'Issue'),
          (t[(t.Snippet = 27)] = 'Snippet');
      })(u || (n.CompletionItemKind = u = {}));
      var _;
      (function (t) {
        t[(t.Deprecated = 1)] = 'Deprecated';
      })(_ || (n.CompletionItemTag = _ = {}));
      var S;
      (function (t) {
        (t[(t.Invoke = 0)] = 'Invoke'),
          (t[(t.TriggerCharacter = 1)] = 'TriggerCharacter'),
          (t[(t.TriggerForIncompleteCompletions = 2)] =
            'TriggerForIncompleteCompletions');
      })(S || (n.CompletionTriggerKind = S = {}));
      var a;
      (function (t) {
        (t[(t.EXACT = 0)] = 'EXACT'),
          (t[(t.ABOVE = 1)] = 'ABOVE'),
          (t[(t.BELOW = 2)] = 'BELOW');
      })(a || (n.ContentWidgetPositionPreference = a = {}));
      var s;
      (function (t) {
        (t[(t.NotSet = 0)] = 'NotSet'),
          (t[(t.ContentFlush = 1)] = 'ContentFlush'),
          (t[(t.RecoverFromMarkers = 2)] = 'RecoverFromMarkers'),
          (t[(t.Explicit = 3)] = 'Explicit'),
          (t[(t.Paste = 4)] = 'Paste'),
          (t[(t.Undo = 5)] = 'Undo'),
          (t[(t.Redo = 6)] = 'Redo');
      })(s || (n.CursorChangeReason = s = {}));
      var p;
      (function (t) {
        (t[(t.LF = 1)] = 'LF'), (t[(t.CRLF = 2)] = 'CRLF');
      })(p || (n.DefaultEndOfLine = p = {}));
      var e;
      (function (t) {
        (t[(t.Text = 0)] = 'Text'),
          (t[(t.Read = 1)] = 'Read'),
          (t[(t.Write = 2)] = 'Write');
      })(e || (n.DocumentHighlightKind = e = {}));
      var f;
      (function (t) {
        (t[(t.None = 0)] = 'None'),
          (t[(t.Keep = 1)] = 'Keep'),
          (t[(t.Brackets = 2)] = 'Brackets'),
          (t[(t.Advanced = 3)] = 'Advanced'),
          (t[(t.Full = 4)] = 'Full');
      })(f || (n.EditorAutoIndentStrategy = f = {}));
      var g;
      (function (t) {
        (t[(t.acceptSuggestionOnCommitCharacter = 0)] =
          'acceptSuggestionOnCommitCharacter'),
          (t[(t.acceptSuggestionOnEnter = 1)] = 'acceptSuggestionOnEnter'),
          (t[(t.accessibilitySupport = 2)] = 'accessibilitySupport'),
          (t[(t.accessibilityPageSize = 3)] = 'accessibilityPageSize'),
          (t[(t.ariaLabel = 4)] = 'ariaLabel'),
          (t[(t.autoClosingBrackets = 5)] = 'autoClosingBrackets'),
          (t[(t.screenReaderAnnounceInlineSuggestion = 6)] =
            'screenReaderAnnounceInlineSuggestion'),
          (t[(t.autoClosingDelete = 7)] = 'autoClosingDelete'),
          (t[(t.autoClosingOvertype = 8)] = 'autoClosingOvertype'),
          (t[(t.autoClosingQuotes = 9)] = 'autoClosingQuotes'),
          (t[(t.autoIndent = 10)] = 'autoIndent'),
          (t[(t.automaticLayout = 11)] = 'automaticLayout'),
          (t[(t.autoSurround = 12)] = 'autoSurround'),
          (t[(t.bracketPairColorization = 13)] = 'bracketPairColorization'),
          (t[(t.guides = 14)] = 'guides'),
          (t[(t.codeLens = 15)] = 'codeLens'),
          (t[(t.codeLensFontFamily = 16)] = 'codeLensFontFamily'),
          (t[(t.codeLensFontSize = 17)] = 'codeLensFontSize'),
          (t[(t.colorDecorators = 18)] = 'colorDecorators'),
          (t[(t.colorDecoratorsLimit = 19)] = 'colorDecoratorsLimit'),
          (t[(t.columnSelection = 20)] = 'columnSelection'),
          (t[(t.comments = 21)] = 'comments'),
          (t[(t.contextmenu = 22)] = 'contextmenu'),
          (t[(t.copyWithSyntaxHighlighting = 23)] =
            'copyWithSyntaxHighlighting'),
          (t[(t.cursorBlinking = 24)] = 'cursorBlinking'),
          (t[(t.cursorSmoothCaretAnimation = 25)] =
            'cursorSmoothCaretAnimation'),
          (t[(t.cursorStyle = 26)] = 'cursorStyle'),
          (t[(t.cursorSurroundingLines = 27)] = 'cursorSurroundingLines'),
          (t[(t.cursorSurroundingLinesStyle = 28)] =
            'cursorSurroundingLinesStyle'),
          (t[(t.cursorWidth = 29)] = 'cursorWidth'),
          (t[(t.disableLayerHinting = 30)] = 'disableLayerHinting'),
          (t[(t.disableMonospaceOptimizations = 31)] =
            'disableMonospaceOptimizations'),
          (t[(t.domReadOnly = 32)] = 'domReadOnly'),
          (t[(t.dragAndDrop = 33)] = 'dragAndDrop'),
          (t[(t.dropIntoEditor = 34)] = 'dropIntoEditor'),
          (t[(t.emptySelectionClipboard = 35)] = 'emptySelectionClipboard'),
          (t[(t.experimentalWhitespaceRendering = 36)] =
            'experimentalWhitespaceRendering'),
          (t[(t.extraEditorClassName = 37)] = 'extraEditorClassName'),
          (t[(t.fastScrollSensitivity = 38)] = 'fastScrollSensitivity'),
          (t[(t.find = 39)] = 'find'),
          (t[(t.fixedOverflowWidgets = 40)] = 'fixedOverflowWidgets'),
          (t[(t.folding = 41)] = 'folding'),
          (t[(t.foldingStrategy = 42)] = 'foldingStrategy'),
          (t[(t.foldingHighlight = 43)] = 'foldingHighlight'),
          (t[(t.foldingImportsByDefault = 44)] = 'foldingImportsByDefault'),
          (t[(t.foldingMaximumRegions = 45)] = 'foldingMaximumRegions'),
          (t[(t.unfoldOnClickAfterEndOfLine = 46)] =
            'unfoldOnClickAfterEndOfLine'),
          (t[(t.fontFamily = 47)] = 'fontFamily'),
          (t[(t.fontInfo = 48)] = 'fontInfo'),
          (t[(t.fontLigatures = 49)] = 'fontLigatures'),
          (t[(t.fontSize = 50)] = 'fontSize'),
          (t[(t.fontWeight = 51)] = 'fontWeight'),
          (t[(t.fontVariations = 52)] = 'fontVariations'),
          (t[(t.formatOnPaste = 53)] = 'formatOnPaste'),
          (t[(t.formatOnType = 54)] = 'formatOnType'),
          (t[(t.glyphMargin = 55)] = 'glyphMargin'),
          (t[(t.gotoLocation = 56)] = 'gotoLocation'),
          (t[(t.hideCursorInOverviewRuler = 57)] = 'hideCursorInOverviewRuler'),
          (t[(t.hover = 58)] = 'hover'),
          (t[(t.inDiffEditor = 59)] = 'inDiffEditor'),
          (t[(t.inlineSuggest = 60)] = 'inlineSuggest'),
          (t[(t.letterSpacing = 61)] = 'letterSpacing'),
          (t[(t.lightbulb = 62)] = 'lightbulb'),
          (t[(t.lineDecorationsWidth = 63)] = 'lineDecorationsWidth'),
          (t[(t.lineHeight = 64)] = 'lineHeight'),
          (t[(t.lineNumbers = 65)] = 'lineNumbers'),
          (t[(t.lineNumbersMinChars = 66)] = 'lineNumbersMinChars'),
          (t[(t.linkedEditing = 67)] = 'linkedEditing'),
          (t[(t.links = 68)] = 'links'),
          (t[(t.matchBrackets = 69)] = 'matchBrackets'),
          (t[(t.minimap = 70)] = 'minimap'),
          (t[(t.mouseStyle = 71)] = 'mouseStyle'),
          (t[(t.mouseWheelScrollSensitivity = 72)] =
            'mouseWheelScrollSensitivity'),
          (t[(t.mouseWheelZoom = 73)] = 'mouseWheelZoom'),
          (t[(t.multiCursorMergeOverlapping = 74)] =
            'multiCursorMergeOverlapping'),
          (t[(t.multiCursorModifier = 75)] = 'multiCursorModifier'),
          (t[(t.multiCursorPaste = 76)] = 'multiCursorPaste'),
          (t[(t.multiCursorLimit = 77)] = 'multiCursorLimit'),
          (t[(t.occurrencesHighlight = 78)] = 'occurrencesHighlight'),
          (t[(t.overviewRulerBorder = 79)] = 'overviewRulerBorder'),
          (t[(t.overviewRulerLanes = 80)] = 'overviewRulerLanes'),
          (t[(t.padding = 81)] = 'padding'),
          (t[(t.pasteAs = 82)] = 'pasteAs'),
          (t[(t.parameterHints = 83)] = 'parameterHints'),
          (t[(t.peekWidgetDefaultFocus = 84)] = 'peekWidgetDefaultFocus'),
          (t[(t.definitionLinkOpensInPeek = 85)] = 'definitionLinkOpensInPeek'),
          (t[(t.quickSuggestions = 86)] = 'quickSuggestions'),
          (t[(t.quickSuggestionsDelay = 87)] = 'quickSuggestionsDelay'),
          (t[(t.readOnly = 88)] = 'readOnly'),
          (t[(t.renameOnType = 89)] = 'renameOnType'),
          (t[(t.renderControlCharacters = 90)] = 'renderControlCharacters'),
          (t[(t.renderFinalNewline = 91)] = 'renderFinalNewline'),
          (t[(t.renderLineHighlight = 92)] = 'renderLineHighlight'),
          (t[(t.renderLineHighlightOnlyWhenFocus = 93)] =
            'renderLineHighlightOnlyWhenFocus'),
          (t[(t.renderValidationDecorations = 94)] =
            'renderValidationDecorations'),
          (t[(t.renderWhitespace = 95)] = 'renderWhitespace'),
          (t[(t.revealHorizontalRightPadding = 96)] =
            'revealHorizontalRightPadding'),
          (t[(t.roundedSelection = 97)] = 'roundedSelection'),
          (t[(t.rulers = 98)] = 'rulers'),
          (t[(t.scrollbar = 99)] = 'scrollbar'),
          (t[(t.scrollBeyondLastColumn = 100)] = 'scrollBeyondLastColumn'),
          (t[(t.scrollBeyondLastLine = 101)] = 'scrollBeyondLastLine'),
          (t[(t.scrollPredominantAxis = 102)] = 'scrollPredominantAxis'),
          (t[(t.selectionClipboard = 103)] = 'selectionClipboard'),
          (t[(t.selectionHighlight = 104)] = 'selectionHighlight'),
          (t[(t.selectOnLineNumbers = 105)] = 'selectOnLineNumbers'),
          (t[(t.showFoldingControls = 106)] = 'showFoldingControls'),
          (t[(t.showUnused = 107)] = 'showUnused'),
          (t[(t.snippetSuggestions = 108)] = 'snippetSuggestions'),
          (t[(t.smartSelect = 109)] = 'smartSelect'),
          (t[(t.smoothScrolling = 110)] = 'smoothScrolling'),
          (t[(t.stickyScroll = 111)] = 'stickyScroll'),
          (t[(t.stickyTabStops = 112)] = 'stickyTabStops'),
          (t[(t.stopRenderingLineAfter = 113)] = 'stopRenderingLineAfter'),
          (t[(t.suggest = 114)] = 'suggest'),
          (t[(t.suggestFontSize = 115)] = 'suggestFontSize'),
          (t[(t.suggestLineHeight = 116)] = 'suggestLineHeight'),
          (t[(t.suggestOnTriggerCharacters = 117)] =
            'suggestOnTriggerCharacters'),
          (t[(t.suggestSelection = 118)] = 'suggestSelection'),
          (t[(t.tabCompletion = 119)] = 'tabCompletion'),
          (t[(t.tabIndex = 120)] = 'tabIndex'),
          (t[(t.unicodeHighlighting = 121)] = 'unicodeHighlighting'),
          (t[(t.unusualLineTerminators = 122)] = 'unusualLineTerminators'),
          (t[(t.useShadowDOM = 123)] = 'useShadowDOM'),
          (t[(t.useTabStops = 124)] = 'useTabStops'),
          (t[(t.wordBreak = 125)] = 'wordBreak'),
          (t[(t.wordSeparators = 126)] = 'wordSeparators'),
          (t[(t.wordWrap = 127)] = 'wordWrap'),
          (t[(t.wordWrapBreakAfterCharacters = 128)] =
            'wordWrapBreakAfterCharacters'),
          (t[(t.wordWrapBreakBeforeCharacters = 129)] =
            'wordWrapBreakBeforeCharacters'),
          (t[(t.wordWrapColumn = 130)] = 'wordWrapColumn'),
          (t[(t.wordWrapOverride1 = 131)] = 'wordWrapOverride1'),
          (t[(t.wordWrapOverride2 = 132)] = 'wordWrapOverride2'),
          (t[(t.wrappingIndent = 133)] = 'wrappingIndent'),
          (t[(t.wrappingStrategy = 134)] = 'wrappingStrategy'),
          (t[(t.showDeprecated = 135)] = 'showDeprecated'),
          (t[(t.inlayHints = 136)] = 'inlayHints'),
          (t[(t.editorClassName = 137)] = 'editorClassName'),
          (t[(t.pixelRatio = 138)] = 'pixelRatio'),
          (t[(t.tabFocusMode = 139)] = 'tabFocusMode'),
          (t[(t.layoutInfo = 140)] = 'layoutInfo'),
          (t[(t.wrappingInfo = 141)] = 'wrappingInfo'),
          (t[(t.defaultColorDecorators = 142)] = 'defaultColorDecorators');
      })(g || (n.EditorOption = g = {}));
      var b;
      (function (t) {
        (t[(t.TextDefined = 0)] = 'TextDefined'),
          (t[(t.LF = 1)] = 'LF'),
          (t[(t.CRLF = 2)] = 'CRLF');
      })(b || (n.EndOfLinePreference = b = {}));
      var m;
      (function (t) {
        (t[(t.LF = 0)] = 'LF'), (t[(t.CRLF = 1)] = 'CRLF');
      })(m || (n.EndOfLineSequence = m = {}));
      var C;
      (function (t) {
        (t[(t.Left = 1)] = 'Left'), (t[(t.Right = 2)] = 'Right');
      })(C || (n.GlyphMarginLane = C = {}));
      var E;
      (function (t) {
        (t[(t.None = 0)] = 'None'),
          (t[(t.Indent = 1)] = 'Indent'),
          (t[(t.IndentOutdent = 2)] = 'IndentOutdent'),
          (t[(t.Outdent = 3)] = 'Outdent');
      })(E || (n.IndentAction = E = {}));
      var L;
      (function (t) {
        (t[(t.Both = 0)] = 'Both'),
          (t[(t.Right = 1)] = 'Right'),
          (t[(t.Left = 2)] = 'Left'),
          (t[(t.None = 3)] = 'None');
      })(L || (n.InjectedTextCursorStops = L = {}));
      var N;
      (function (t) {
        (t[(t.Type = 1)] = 'Type'), (t[(t.Parameter = 2)] = 'Parameter');
      })(N || (n.InlayHintKind = N = {}));
      var w;
      (function (t) {
        (t[(t.Automatic = 0)] = 'Automatic'),
          (t[(t.Explicit = 1)] = 'Explicit');
      })(w || (n.InlineCompletionTriggerKind = w = {}));
      var c;
      (function (t) {
        (t[(t.DependsOnKbLayout = -1)] = 'DependsOnKbLayout'),
          (t[(t.Unknown = 0)] = 'Unknown'),
          (t[(t.Backspace = 1)] = 'Backspace'),
          (t[(t.Tab = 2)] = 'Tab'),
          (t[(t.Enter = 3)] = 'Enter'),
          (t[(t.Shift = 4)] = 'Shift'),
          (t[(t.Ctrl = 5)] = 'Ctrl'),
          (t[(t.Alt = 6)] = 'Alt'),
          (t[(t.PauseBreak = 7)] = 'PauseBreak'),
          (t[(t.CapsLock = 8)] = 'CapsLock'),
          (t[(t.Escape = 9)] = 'Escape'),
          (t[(t.Space = 10)] = 'Space'),
          (t[(t.PageUp = 11)] = 'PageUp'),
          (t[(t.PageDown = 12)] = 'PageDown'),
          (t[(t.End = 13)] = 'End'),
          (t[(t.Home = 14)] = 'Home'),
          (t[(t.LeftArrow = 15)] = 'LeftArrow'),
          (t[(t.UpArrow = 16)] = 'UpArrow'),
          (t[(t.RightArrow = 17)] = 'RightArrow'),
          (t[(t.DownArrow = 18)] = 'DownArrow'),
          (t[(t.Insert = 19)] = 'Insert'),
          (t[(t.Delete = 20)] = 'Delete'),
          (t[(t.Digit0 = 21)] = 'Digit0'),
          (t[(t.Digit1 = 22)] = 'Digit1'),
          (t[(t.Digit2 = 23)] = 'Digit2'),
          (t[(t.Digit3 = 24)] = 'Digit3'),
          (t[(t.Digit4 = 25)] = 'Digit4'),
          (t[(t.Digit5 = 26)] = 'Digit5'),
          (t[(t.Digit6 = 27)] = 'Digit6'),
          (t[(t.Digit7 = 28)] = 'Digit7'),
          (t[(t.Digit8 = 29)] = 'Digit8'),
          (t[(t.Digit9 = 30)] = 'Digit9'),
          (t[(t.KeyA = 31)] = 'KeyA'),
          (t[(t.KeyB = 32)] = 'KeyB'),
          (t[(t.KeyC = 33)] = 'KeyC'),
          (t[(t.KeyD = 34)] = 'KeyD'),
          (t[(t.KeyE = 35)] = 'KeyE'),
          (t[(t.KeyF = 36)] = 'KeyF'),
          (t[(t.KeyG = 37)] = 'KeyG'),
          (t[(t.KeyH = 38)] = 'KeyH'),
          (t[(t.KeyI = 39)] = 'KeyI'),
          (t[(t.KeyJ = 40)] = 'KeyJ'),
          (t[(t.KeyK = 41)] = 'KeyK'),
          (t[(t.KeyL = 42)] = 'KeyL'),
          (t[(t.KeyM = 43)] = 'KeyM'),
          (t[(t.KeyN = 44)] = 'KeyN'),
          (t[(t.KeyO = 45)] = 'KeyO'),
          (t[(t.KeyP = 46)] = 'KeyP'),
          (t[(t.KeyQ = 47)] = 'KeyQ'),
          (t[(t.KeyR = 48)] = 'KeyR'),
          (t[(t.KeyS = 49)] = 'KeyS'),
          (t[(t.KeyT = 50)] = 'KeyT'),
          (t[(t.KeyU = 51)] = 'KeyU'),
          (t[(t.KeyV = 52)] = 'KeyV'),
          (t[(t.KeyW = 53)] = 'KeyW'),
          (t[(t.KeyX = 54)] = 'KeyX'),
          (t[(t.KeyY = 55)] = 'KeyY'),
          (t[(t.KeyZ = 56)] = 'KeyZ'),
          (t[(t.Meta = 57)] = 'Meta'),
          (t[(t.ContextMenu = 58)] = 'ContextMenu'),
          (t[(t.F1 = 59)] = 'F1'),
          (t[(t.F2 = 60)] = 'F2'),
          (t[(t.F3 = 61)] = 'F3'),
          (t[(t.F4 = 62)] = 'F4'),
          (t[(t.F5 = 63)] = 'F5'),
          (t[(t.F6 = 64)] = 'F6'),
          (t[(t.F7 = 65)] = 'F7'),
          (t[(t.F8 = 66)] = 'F8'),
          (t[(t.F9 = 67)] = 'F9'),
          (t[(t.F10 = 68)] = 'F10'),
          (t[(t.F11 = 69)] = 'F11'),
          (t[(t.F12 = 70)] = 'F12'),
          (t[(t.F13 = 71)] = 'F13'),
          (t[(t.F14 = 72)] = 'F14'),
          (t[(t.F15 = 73)] = 'F15'),
          (t[(t.F16 = 74)] = 'F16'),
          (t[(t.F17 = 75)] = 'F17'),
          (t[(t.F18 = 76)] = 'F18'),
          (t[(t.F19 = 77)] = 'F19'),
          (t[(t.F20 = 78)] = 'F20'),
          (t[(t.F21 = 79)] = 'F21'),
          (t[(t.F22 = 80)] = 'F22'),
          (t[(t.F23 = 81)] = 'F23'),
          (t[(t.F24 = 82)] = 'F24'),
          (t[(t.NumLock = 83)] = 'NumLock'),
          (t[(t.ScrollLock = 84)] = 'ScrollLock'),
          (t[(t.Semicolon = 85)] = 'Semicolon'),
          (t[(t.Equal = 86)] = 'Equal'),
          (t[(t.Comma = 87)] = 'Comma'),
          (t[(t.Minus = 88)] = 'Minus'),
          (t[(t.Period = 89)] = 'Period'),
          (t[(t.Slash = 90)] = 'Slash'),
          (t[(t.Backquote = 91)] = 'Backquote'),
          (t[(t.BracketLeft = 92)] = 'BracketLeft'),
          (t[(t.Backslash = 93)] = 'Backslash'),
          (t[(t.BracketRight = 94)] = 'BracketRight'),
          (t[(t.Quote = 95)] = 'Quote'),
          (t[(t.OEM_8 = 96)] = 'OEM_8'),
          (t[(t.IntlBackslash = 97)] = 'IntlBackslash'),
          (t[(t.Numpad0 = 98)] = 'Numpad0'),
          (t[(t.Numpad1 = 99)] = 'Numpad1'),
          (t[(t.Numpad2 = 100)] = 'Numpad2'),
          (t[(t.Numpad3 = 101)] = 'Numpad3'),
          (t[(t.Numpad4 = 102)] = 'Numpad4'),
          (t[(t.Numpad5 = 103)] = 'Numpad5'),
          (t[(t.Numpad6 = 104)] = 'Numpad6'),
          (t[(t.Numpad7 = 105)] = 'Numpad7'),
          (t[(t.Numpad8 = 106)] = 'Numpad8'),
          (t[(t.Numpad9 = 107)] = 'Numpad9'),
          (t[(t.NumpadMultiply = 108)] = 'NumpadMultiply'),
          (t[(t.NumpadAdd = 109)] = 'NumpadAdd'),
          (t[(t.NUMPAD_SEPARATOR = 110)] = 'NUMPAD_SEPARATOR'),
          (t[(t.NumpadSubtract = 111)] = 'NumpadSubtract'),
          (t[(t.NumpadDecimal = 112)] = 'NumpadDecimal'),
          (t[(t.NumpadDivide = 113)] = 'NumpadDivide'),
          (t[(t.KEY_IN_COMPOSITION = 114)] = 'KEY_IN_COMPOSITION'),
          (t[(t.ABNT_C1 = 115)] = 'ABNT_C1'),
          (t[(t.ABNT_C2 = 116)] = 'ABNT_C2'),
          (t[(t.AudioVolumeMute = 117)] = 'AudioVolumeMute'),
          (t[(t.AudioVolumeUp = 118)] = 'AudioVolumeUp'),
          (t[(t.AudioVolumeDown = 119)] = 'AudioVolumeDown'),
          (t[(t.BrowserSearch = 120)] = 'BrowserSearch'),
          (t[(t.BrowserHome = 121)] = 'BrowserHome'),
          (t[(t.BrowserBack = 122)] = 'BrowserBack'),
          (t[(t.BrowserForward = 123)] = 'BrowserForward'),
          (t[(t.MediaTrackNext = 124)] = 'MediaTrackNext'),
          (t[(t.MediaTrackPrevious = 125)] = 'MediaTrackPrevious'),
          (t[(t.MediaStop = 126)] = 'MediaStop'),
          (t[(t.MediaPlayPause = 127)] = 'MediaPlayPause'),
          (t[(t.LaunchMediaPlayer = 128)] = 'LaunchMediaPlayer'),
          (t[(t.LaunchMail = 129)] = 'LaunchMail'),
          (t[(t.LaunchApp2 = 130)] = 'LaunchApp2'),
          (t[(t.Clear = 131)] = 'Clear'),
          (t[(t.MAX_VALUE = 132)] = 'MAX_VALUE');
      })(c || (n.KeyCode = c = {}));
      var r;
      (function (t) {
        (t[(t.Hint = 1)] = 'Hint'),
          (t[(t.Info = 2)] = 'Info'),
          (t[(t.Warning = 4)] = 'Warning'),
          (t[(t.Error = 8)] = 'Error');
      })(r || (n.MarkerSeverity = r = {}));
      var l;
      (function (t) {
        (t[(t.Unnecessary = 1)] = 'Unnecessary'),
          (t[(t.Deprecated = 2)] = 'Deprecated');
      })(l || (n.MarkerTag = l = {}));
      var h;
      (function (t) {
        (t[(t.Inline = 1)] = 'Inline'), (t[(t.Gutter = 2)] = 'Gutter');
      })(h || (n.MinimapPosition = h = {}));
      var d;
      (function (t) {
        (t[(t.UNKNOWN = 0)] = 'UNKNOWN'),
          (t[(t.TEXTAREA = 1)] = 'TEXTAREA'),
          (t[(t.GUTTER_GLYPH_MARGIN = 2)] = 'GUTTER_GLYPH_MARGIN'),
          (t[(t.GUTTER_LINE_NUMBERS = 3)] = 'GUTTER_LINE_NUMBERS'),
          (t[(t.GUTTER_LINE_DECORATIONS = 4)] = 'GUTTER_LINE_DECORATIONS'),
          (t[(t.GUTTER_VIEW_ZONE = 5)] = 'GUTTER_VIEW_ZONE'),
          (t[(t.CONTENT_TEXT = 6)] = 'CONTENT_TEXT'),
          (t[(t.CONTENT_EMPTY = 7)] = 'CONTENT_EMPTY'),
          (t[(t.CONTENT_VIEW_ZONE = 8)] = 'CONTENT_VIEW_ZONE'),
          (t[(t.CONTENT_WIDGET = 9)] = 'CONTENT_WIDGET'),
          (t[(t.OVERVIEW_RULER = 10)] = 'OVERVIEW_RULER'),
          (t[(t.SCROLLBAR = 11)] = 'SCROLLBAR'),
          (t[(t.OVERLAY_WIDGET = 12)] = 'OVERLAY_WIDGET'),
          (t[(t.OUTSIDE_EDITOR = 13)] = 'OUTSIDE_EDITOR');
      })(d || (n.MouseTargetType = d = {}));
      var o;
      (function (t) {
        (t[(t.TOP_RIGHT_CORNER = 0)] = 'TOP_RIGHT_CORNER'),
          (t[(t.BOTTOM_RIGHT_CORNER = 1)] = 'BOTTOM_RIGHT_CORNER'),
          (t[(t.TOP_CENTER = 2)] = 'TOP_CENTER');
      })(o || (n.OverlayWidgetPositionPreference = o = {}));
      var v;
      (function (t) {
        (t[(t.Left = 1)] = 'Left'),
          (t[(t.Center = 2)] = 'Center'),
          (t[(t.Right = 4)] = 'Right'),
          (t[(t.Full = 7)] = 'Full');
      })(v || (n.OverviewRulerLane = v = {}));
      var A;
      (function (t) {
        (t[(t.Left = 0)] = 'Left'),
          (t[(t.Right = 1)] = 'Right'),
          (t[(t.None = 2)] = 'None'),
          (t[(t.LeftOfInjectedText = 3)] = 'LeftOfInjectedText'),
          (t[(t.RightOfInjectedText = 4)] = 'RightOfInjectedText');
      })(A || (n.PositionAffinity = A = {}));
      var y;
      (function (t) {
        (t[(t.Off = 0)] = 'Off'),
          (t[(t.On = 1)] = 'On'),
          (t[(t.Relative = 2)] = 'Relative'),
          (t[(t.Interval = 3)] = 'Interval'),
          (t[(t.Custom = 4)] = 'Custom');
      })(y || (n.RenderLineNumbersType = y = {}));
      var D;
      (function (t) {
        (t[(t.None = 0)] = 'None'),
          (t[(t.Text = 1)] = 'Text'),
          (t[(t.Blocks = 2)] = 'Blocks');
      })(D || (n.RenderMinimap = D = {}));
      var k;
      (function (t) {
        (t[(t.Smooth = 0)] = 'Smooth'), (t[(t.Immediate = 1)] = 'Immediate');
      })(k || (n.ScrollType = k = {}));
      var B;
      (function (t) {
        (t[(t.Auto = 1)] = 'Auto'),
          (t[(t.Hidden = 2)] = 'Hidden'),
          (t[(t.Visible = 3)] = 'Visible');
      })(B || (n.ScrollbarVisibility = B = {}));
      var I;
      (function (t) {
        (t[(t.LTR = 0)] = 'LTR'), (t[(t.RTL = 1)] = 'RTL');
      })(I || (n.SelectionDirection = I = {}));
      var U;
      (function (t) {
        (t[(t.Invoke = 1)] = 'Invoke'),
          (t[(t.TriggerCharacter = 2)] = 'TriggerCharacter'),
          (t[(t.ContentChange = 3)] = 'ContentChange');
      })(U || (n.SignatureHelpTriggerKind = U = {}));
      var V;
      (function (t) {
        (t[(t.File = 0)] = 'File'),
          (t[(t.Module = 1)] = 'Module'),
          (t[(t.Namespace = 2)] = 'Namespace'),
          (t[(t.Package = 3)] = 'Package'),
          (t[(t.Class = 4)] = 'Class'),
          (t[(t.Method = 5)] = 'Method'),
          (t[(t.Property = 6)] = 'Property'),
          (t[(t.Field = 7)] = 'Field'),
          (t[(t.Constructor = 8)] = 'Constructor'),
          (t[(t.Enum = 9)] = 'Enum'),
          (t[(t.Interface = 10)] = 'Interface'),
          (t[(t.Function = 11)] = 'Function'),
          (t[(t.Variable = 12)] = 'Variable'),
          (t[(t.Constant = 13)] = 'Constant'),
          (t[(t.String = 14)] = 'String'),
          (t[(t.Number = 15)] = 'Number'),
          (t[(t.Boolean = 16)] = 'Boolean'),
          (t[(t.Array = 17)] = 'Array'),
          (t[(t.Object = 18)] = 'Object'),
          (t[(t.Key = 19)] = 'Key'),
          (t[(t.Null = 20)] = 'Null'),
          (t[(t.EnumMember = 21)] = 'EnumMember'),
          (t[(t.Struct = 22)] = 'Struct'),
          (t[(t.Event = 23)] = 'Event'),
          (t[(t.Operator = 24)] = 'Operator'),
          (t[(t.TypeParameter = 25)] = 'TypeParameter');
      })(V || (n.SymbolKind = V = {}));
      var Q;
      (function (t) {
        t[(t.Deprecated = 1)] = 'Deprecated';
      })(Q || (n.SymbolTag = Q = {}));
      var F;
      (function (t) {
        (t[(t.Hidden = 0)] = 'Hidden'),
          (t[(t.Blink = 1)] = 'Blink'),
          (t[(t.Smooth = 2)] = 'Smooth'),
          (t[(t.Phase = 3)] = 'Phase'),
          (t[(t.Expand = 4)] = 'Expand'),
          (t[(t.Solid = 5)] = 'Solid');
      })(F || (n.TextEditorCursorBlinkingStyle = F = {}));
      var T;
      (function (t) {
        (t[(t.Line = 1)] = 'Line'),
          (t[(t.Block = 2)] = 'Block'),
          (t[(t.Underline = 3)] = 'Underline'),
          (t[(t.LineThin = 4)] = 'LineThin'),
          (t[(t.BlockOutline = 5)] = 'BlockOutline'),
          (t[(t.UnderlineThin = 6)] = 'UnderlineThin');
      })(T || (n.TextEditorCursorStyle = T = {}));
      var q;
      (function (t) {
        (t[(t.AlwaysGrowsWhenTypingAtEdges = 0)] =
          'AlwaysGrowsWhenTypingAtEdges'),
          (t[(t.NeverGrowsWhenTypingAtEdges = 1)] =
            'NeverGrowsWhenTypingAtEdges'),
          (t[(t.GrowsOnlyWhenTypingBefore = 2)] = 'GrowsOnlyWhenTypingBefore'),
          (t[(t.GrowsOnlyWhenTypingAfter = 3)] = 'GrowsOnlyWhenTypingAfter');
      })(q || (n.TrackedRangeStickiness = q = {}));
      var H;
      (function (t) {
        (t[(t.None = 0)] = 'None'),
          (t[(t.Same = 1)] = 'Same'),
          (t[(t.Indent = 2)] = 'Indent'),
          (t[(t.DeepIndent = 3)] = 'DeepIndent');
      })(H || (n.WrappingIndent = H = {}));
    }),
    Y(X[52], J([25, 59]), function (x, n) {
      return x.create('vs/base/common/platform', n);
    }),
    Y(X[8], J([0, 1, 52]), function (x, n, R) {
      'use strict';
      var M;
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.isAndroid =
          n.isEdge =
          n.isSafari =
          n.isFirefox =
          n.isChrome =
          n.isLittleEndian =
          n.OS =
          n.setTimeout0 =
          n.setTimeout0IsFaster =
          n.language =
          n.userAgent =
          n.isMobile =
          n.isIOS =
          n.isWebWorker =
          n.isWeb =
          n.isNative =
          n.isLinux =
          n.isMacintosh =
          n.isWindows =
          n.globals =
          n.LANGUAGE_DEFAULT =
            void 0),
        (n.LANGUAGE_DEFAULT = 'en');
      let i = !1,
        u = !1,
        _ = !1,
        S = !1,
        a = !1,
        s = !1,
        p = !1,
        e = !1,
        f = !1,
        g = !1,
        b,
        m = n.LANGUAGE_DEFAULT,
        C = n.LANGUAGE_DEFAULT,
        E,
        L;
      n.globals =
        typeof self == 'object'
          ? self
          : typeof global == 'object'
          ? global
          : {};
      let N;
      typeof n.globals.vscode < 'u' && typeof n.globals.vscode.process < 'u'
        ? (N = n.globals.vscode.process)
        : typeof process < 'u' && (N = process);
      const w =
          typeof ((M = N?.versions) === null || M === void 0
            ? void 0
            : M.electron) == 'string',
        c = w && N?.type === 'renderer';
      if (typeof navigator == 'object' && !c)
        (L = navigator.userAgent),
          (i = L.indexOf('Windows') >= 0),
          (u = L.indexOf('Macintosh') >= 0),
          (e =
            (L.indexOf('Macintosh') >= 0 ||
              L.indexOf('iPad') >= 0 ||
              L.indexOf('iPhone') >= 0) &&
            !!navigator.maxTouchPoints &&
            navigator.maxTouchPoints > 0),
          (_ = L.indexOf('Linux') >= 0),
          (g = L?.indexOf('Mobi') >= 0),
          (s = !0),
          (b =
            R.getConfiguredDefaultLocale(R.localize(0, null)) ||
            n.LANGUAGE_DEFAULT),
          (m = b),
          (C = navigator.language);
      else if (typeof N == 'object') {
        (i = N.platform === 'win32'),
          (u = N.platform === 'darwin'),
          (_ = N.platform === 'linux'),
          (S = _ && !!N.env.SNAP && !!N.env.SNAP_REVISION),
          (p = w),
          (f = !!N.env.CI || !!N.env.BUILD_ARTIFACTSTAGINGDIRECTORY),
          (b = n.LANGUAGE_DEFAULT),
          (m = n.LANGUAGE_DEFAULT);
        const o = N.env.VSCODE_NLS_CONFIG;
        if (o)
          try {
            const v = JSON.parse(o),
              A = v.availableLanguages['*'];
            (b = v.locale),
              (C = v.osLocale),
              (m = A || n.LANGUAGE_DEFAULT),
              (E = v._translationsConfigFile);
          } catch {}
        a = !0;
      } else console.error('Unable to resolve platform.');
      let r = 0;
      u ? (r = 1) : i ? (r = 3) : _ && (r = 2),
        (n.isWindows = i),
        (n.isMacintosh = u),
        (n.isLinux = _),
        (n.isNative = a),
        (n.isWeb = s),
        (n.isWebWorker = s && typeof n.globals.importScripts == 'function'),
        (n.isIOS = e),
        (n.isMobile = g),
        (n.userAgent = L),
        (n.language = m),
        (n.setTimeout0IsFaster =
          typeof n.globals.postMessage == 'function' &&
          !n.globals.importScripts),
        (n.setTimeout0 = (() => {
          if (n.setTimeout0IsFaster) {
            const o = [];
            n.globals.addEventListener('message', A => {
              if (A.data && A.data.vscodeScheduleAsyncWork)
                for (let y = 0, D = o.length; y < D; y++) {
                  const k = o[y];
                  if (k.id === A.data.vscodeScheduleAsyncWork) {
                    o.splice(y, 1), k.callback();
                    return;
                  }
                }
            });
            let v = 0;
            return A => {
              const y = ++v;
              o.push({ id: y, callback: A }),
                n.globals.postMessage({ vscodeScheduleAsyncWork: y }, '*');
            };
          }
          return o => setTimeout(o);
        })()),
        (n.OS = u || e ? 2 : i ? 1 : 3);
      let l = !0,
        h = !1;
      function d() {
        if (!h) {
          h = !0;
          const o = new Uint8Array(2);
          (o[0] = 1),
            (o[1] = 2),
            (l = new Uint16Array(o.buffer)[0] === (2 << 8) + 1);
        }
        return l;
      }
      (n.isLittleEndian = d),
        (n.isChrome = !!(n.userAgent && n.userAgent.indexOf('Chrome') >= 0)),
        (n.isFirefox = !!(n.userAgent && n.userAgent.indexOf('Firefox') >= 0)),
        (n.isSafari = !!(
          !n.isChrome &&
          n.userAgent &&
          n.userAgent.indexOf('Safari') >= 0
        )),
        (n.isEdge = !!(n.userAgent && n.userAgent.indexOf('Edg/') >= 0)),
        (n.isAndroid = !!(n.userAgent && n.userAgent.indexOf('Android') >= 0));
    }),
    Y(X[53], J([0, 1, 8]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.platform = n.env = n.cwd = void 0);
      let M;
      if (
        typeof R.globals.vscode < 'u' &&
        typeof R.globals.vscode.process < 'u'
      ) {
        const i = R.globals.vscode.process;
        M = {
          get platform() {
            return i.platform;
          },
          get arch() {
            return i.arch;
          },
          get env() {
            return i.env;
          },
          cwd() {
            return i.cwd();
          },
        };
      } else
        typeof process < 'u'
          ? (M = {
              get platform() {
                return process.platform;
              },
              get arch() {
                return process.arch;
              },
              get env() {
                return process.env;
              },
              cwd() {
                return process.env.VSCODE_CWD || process.cwd();
              },
            })
          : (M = {
              get platform() {
                return R.isWindows
                  ? 'win32'
                  : R.isMacintosh
                  ? 'darwin'
                  : 'linux';
              },
              get arch() {},
              get env() {
                return {};
              },
              cwd() {
                return '/';
              },
            });
      (n.cwd = M.cwd), (n.env = M.env), (n.platform = M.platform);
    }),
    Y(X[54], J([0, 1, 53]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.sep =
          n.extname =
          n.basename =
          n.dirname =
          n.relative =
          n.resolve =
          n.normalize =
          n.posix =
          n.win32 =
            void 0);
      const M = 65,
        i = 97,
        u = 90,
        _ = 122,
        S = 46,
        a = 47,
        s = 92,
        p = 58,
        e = 63;
      class f extends Error {
        constructor(l, h, d) {
          let o;
          typeof h == 'string' && h.indexOf('not ') === 0
            ? ((o = 'must not be'), (h = h.replace(/^not /, '')))
            : (o = 'must be');
          const v = l.indexOf('.') !== -1 ? 'property' : 'argument';
          let A = `The "${l}" ${v} ${o} of type ${h}`;
          (A += `. Received type ${typeof d}`),
            super(A),
            (this.code = 'ERR_INVALID_ARG_TYPE');
        }
      }
      function g(r, l) {
        if (r === null || typeof r != 'object') throw new f(l, 'Object', r);
      }
      function b(r, l) {
        if (typeof r != 'string') throw new f(l, 'string', r);
      }
      const m = R.platform === 'win32';
      function C(r) {
        return r === a || r === s;
      }
      function E(r) {
        return r === a;
      }
      function L(r) {
        return (r >= M && r <= u) || (r >= i && r <= _);
      }
      function N(r, l, h, d) {
        let o = '',
          v = 0,
          A = -1,
          y = 0,
          D = 0;
        for (let k = 0; k <= r.length; ++k) {
          if (k < r.length) D = r.charCodeAt(k);
          else {
            if (d(D)) break;
            D = a;
          }
          if (d(D)) {
            if (!(A === k - 1 || y === 1))
              if (y === 2) {
                if (
                  o.length < 2 ||
                  v !== 2 ||
                  o.charCodeAt(o.length - 1) !== S ||
                  o.charCodeAt(o.length - 2) !== S
                ) {
                  if (o.length > 2) {
                    const B = o.lastIndexOf(h);
                    B === -1
                      ? ((o = ''), (v = 0))
                      : ((o = o.slice(0, B)),
                        (v = o.length - 1 - o.lastIndexOf(h))),
                      (A = k),
                      (y = 0);
                    continue;
                  } else if (o.length !== 0) {
                    (o = ''), (v = 0), (A = k), (y = 0);
                    continue;
                  }
                }
                l && ((o += o.length > 0 ? `${h}..` : '..'), (v = 2));
              } else
                o.length > 0
                  ? (o += `${h}${r.slice(A + 1, k)}`)
                  : (o = r.slice(A + 1, k)),
                  (v = k - A - 1);
            (A = k), (y = 0);
          } else D === S && y !== -1 ? ++y : (y = -1);
        }
        return o;
      }
      function w(r, l) {
        g(l, 'pathObject');
        const h = l.dir || l.root,
          d = l.base || `${l.name || ''}${l.ext || ''}`;
        return h ? (h === l.root ? `${h}${d}` : `${h}${r}${d}`) : d;
      }
      n.win32 = {
        resolve(...r) {
          let l = '',
            h = '',
            d = !1;
          for (let o = r.length - 1; o >= -1; o--) {
            let v;
            if (o >= 0) {
              if (((v = r[o]), b(v, 'path'), v.length === 0)) continue;
            } else
              l.length === 0
                ? (v = R.cwd())
                : ((v = R.env[`=${l}`] || R.cwd()),
                  (v === void 0 ||
                    (v.slice(0, 2).toLowerCase() !== l.toLowerCase() &&
                      v.charCodeAt(2) === s)) &&
                    (v = `${l}\\`));
            const A = v.length;
            let y = 0,
              D = '',
              k = !1;
            const B = v.charCodeAt(0);
            if (A === 1) C(B) && ((y = 1), (k = !0));
            else if (C(B))
              if (((k = !0), C(v.charCodeAt(1)))) {
                let I = 2,
                  U = I;
                for (; I < A && !C(v.charCodeAt(I)); ) I++;
                if (I < A && I !== U) {
                  const V = v.slice(U, I);
                  for (U = I; I < A && C(v.charCodeAt(I)); ) I++;
                  if (I < A && I !== U) {
                    for (U = I; I < A && !C(v.charCodeAt(I)); ) I++;
                    (I === A || I !== U) &&
                      ((D = `\\\\${V}\\${v.slice(U, I)}`), (y = I));
                  }
                }
              } else y = 1;
            else
              L(B) &&
                v.charCodeAt(1) === p &&
                ((D = v.slice(0, 2)),
                (y = 2),
                A > 2 && C(v.charCodeAt(2)) && ((k = !0), (y = 3)));
            if (D.length > 0)
              if (l.length > 0) {
                if (D.toLowerCase() !== l.toLowerCase()) continue;
              } else l = D;
            if (d) {
              if (l.length > 0) break;
            } else if (
              ((h = `${v.slice(y)}\\${h}`), (d = k), k && l.length > 0)
            )
              break;
          }
          return (h = N(h, !d, '\\', C)), d ? `${l}\\${h}` : `${l}${h}` || '.';
        },
        normalize(r) {
          b(r, 'path');
          const l = r.length;
          if (l === 0) return '.';
          let h = 0,
            d,
            o = !1;
          const v = r.charCodeAt(0);
          if (l === 1) return E(v) ? '\\' : r;
          if (C(v))
            if (((o = !0), C(r.charCodeAt(1)))) {
              let y = 2,
                D = y;
              for (; y < l && !C(r.charCodeAt(y)); ) y++;
              if (y < l && y !== D) {
                const k = r.slice(D, y);
                for (D = y; y < l && C(r.charCodeAt(y)); ) y++;
                if (y < l && y !== D) {
                  for (D = y; y < l && !C(r.charCodeAt(y)); ) y++;
                  if (y === l) return `\\\\${k}\\${r.slice(D)}\\`;
                  y !== D && ((d = `\\\\${k}\\${r.slice(D, y)}`), (h = y));
                }
              }
            } else h = 1;
          else
            L(v) &&
              r.charCodeAt(1) === p &&
              ((d = r.slice(0, 2)),
              (h = 2),
              l > 2 && C(r.charCodeAt(2)) && ((o = !0), (h = 3)));
          let A = h < l ? N(r.slice(h), !o, '\\', C) : '';
          return (
            A.length === 0 && !o && (A = '.'),
            A.length > 0 && C(r.charCodeAt(l - 1)) && (A += '\\'),
            d === void 0 ? (o ? `\\${A}` : A) : o ? `${d}\\${A}` : `${d}${A}`
          );
        },
        isAbsolute(r) {
          b(r, 'path');
          const l = r.length;
          if (l === 0) return !1;
          const h = r.charCodeAt(0);
          return (
            C(h) ||
            (l > 2 && L(h) && r.charCodeAt(1) === p && C(r.charCodeAt(2)))
          );
        },
        join(...r) {
          if (r.length === 0) return '.';
          let l, h;
          for (let v = 0; v < r.length; ++v) {
            const A = r[v];
            b(A, 'path'),
              A.length > 0 && (l === void 0 ? (l = h = A) : (l += `\\${A}`));
          }
          if (l === void 0) return '.';
          let d = !0,
            o = 0;
          if (typeof h == 'string' && C(h.charCodeAt(0))) {
            ++o;
            const v = h.length;
            v > 1 &&
              C(h.charCodeAt(1)) &&
              (++o, v > 2 && (C(h.charCodeAt(2)) ? ++o : (d = !1)));
          }
          if (d) {
            for (; o < l.length && C(l.charCodeAt(o)); ) o++;
            o >= 2 && (l = `\\${l.slice(o)}`);
          }
          return n.win32.normalize(l);
        },
        relative(r, l) {
          if ((b(r, 'from'), b(l, 'to'), r === l)) return '';
          const h = n.win32.resolve(r),
            d = n.win32.resolve(l);
          if (
            h === d ||
            ((r = h.toLowerCase()), (l = d.toLowerCase()), r === l)
          )
            return '';
          let o = 0;
          for (; o < r.length && r.charCodeAt(o) === s; ) o++;
          let v = r.length;
          for (; v - 1 > o && r.charCodeAt(v - 1) === s; ) v--;
          const A = v - o;
          let y = 0;
          for (; y < l.length && l.charCodeAt(y) === s; ) y++;
          let D = l.length;
          for (; D - 1 > y && l.charCodeAt(D - 1) === s; ) D--;
          const k = D - y,
            B = A < k ? A : k;
          let I = -1,
            U = 0;
          for (; U < B; U++) {
            const Q = r.charCodeAt(o + U);
            if (Q !== l.charCodeAt(y + U)) break;
            Q === s && (I = U);
          }
          if (U !== B) {
            if (I === -1) return d;
          } else {
            if (k > B) {
              if (l.charCodeAt(y + U) === s) return d.slice(y + U + 1);
              if (U === 2) return d.slice(y + U);
            }
            A > B && (r.charCodeAt(o + U) === s ? (I = U) : U === 2 && (I = 3)),
              I === -1 && (I = 0);
          }
          let V = '';
          for (U = o + I + 1; U <= v; ++U)
            (U === v || r.charCodeAt(U) === s) &&
              (V += V.length === 0 ? '..' : '\\..');
          return (
            (y += I),
            V.length > 0
              ? `${V}${d.slice(y, D)}`
              : (d.charCodeAt(y) === s && ++y, d.slice(y, D))
          );
        },
        toNamespacedPath(r) {
          if (typeof r != 'string' || r.length === 0) return r;
          const l = n.win32.resolve(r);
          if (l.length <= 2) return r;
          if (l.charCodeAt(0) === s) {
            if (l.charCodeAt(1) === s) {
              const h = l.charCodeAt(2);
              if (h !== e && h !== S) return `\\\\?\\UNC\\${l.slice(2)}`;
            }
          } else if (
            L(l.charCodeAt(0)) &&
            l.charCodeAt(1) === p &&
            l.charCodeAt(2) === s
          )
            return `\\\\?\\${l}`;
          return r;
        },
        dirname(r) {
          b(r, 'path');
          const l = r.length;
          if (l === 0) return '.';
          let h = -1,
            d = 0;
          const o = r.charCodeAt(0);
          if (l === 1) return C(o) ? r : '.';
          if (C(o)) {
            if (((h = d = 1), C(r.charCodeAt(1)))) {
              let y = 2,
                D = y;
              for (; y < l && !C(r.charCodeAt(y)); ) y++;
              if (y < l && y !== D) {
                for (D = y; y < l && C(r.charCodeAt(y)); ) y++;
                if (y < l && y !== D) {
                  for (D = y; y < l && !C(r.charCodeAt(y)); ) y++;
                  if (y === l) return r;
                  y !== D && (h = d = y + 1);
                }
              }
            }
          } else
            L(o) &&
              r.charCodeAt(1) === p &&
              ((h = l > 2 && C(r.charCodeAt(2)) ? 3 : 2), (d = h));
          let v = -1,
            A = !0;
          for (let y = l - 1; y >= d; --y)
            if (C(r.charCodeAt(y))) {
              if (!A) {
                v = y;
                break;
              }
            } else A = !1;
          if (v === -1) {
            if (h === -1) return '.';
            v = h;
          }
          return r.slice(0, v);
        },
        basename(r, l) {
          l !== void 0 && b(l, 'ext'), b(r, 'path');
          let h = 0,
            d = -1,
            o = !0,
            v;
          if (
            (r.length >= 2 &&
              L(r.charCodeAt(0)) &&
              r.charCodeAt(1) === p &&
              (h = 2),
            l !== void 0 && l.length > 0 && l.length <= r.length)
          ) {
            if (l === r) return '';
            let A = l.length - 1,
              y = -1;
            for (v = r.length - 1; v >= h; --v) {
              const D = r.charCodeAt(v);
              if (C(D)) {
                if (!o) {
                  h = v + 1;
                  break;
                }
              } else
                y === -1 && ((o = !1), (y = v + 1)),
                  A >= 0 &&
                    (D === l.charCodeAt(A)
                      ? --A === -1 && (d = v)
                      : ((A = -1), (d = y)));
            }
            return (
              h === d ? (d = y) : d === -1 && (d = r.length), r.slice(h, d)
            );
          }
          for (v = r.length - 1; v >= h; --v)
            if (C(r.charCodeAt(v))) {
              if (!o) {
                h = v + 1;
                break;
              }
            } else d === -1 && ((o = !1), (d = v + 1));
          return d === -1 ? '' : r.slice(h, d);
        },
        extname(r) {
          b(r, 'path');
          let l = 0,
            h = -1,
            d = 0,
            o = -1,
            v = !0,
            A = 0;
          r.length >= 2 &&
            r.charCodeAt(1) === p &&
            L(r.charCodeAt(0)) &&
            (l = d = 2);
          for (let y = r.length - 1; y >= l; --y) {
            const D = r.charCodeAt(y);
            if (C(D)) {
              if (!v) {
                d = y + 1;
                break;
              }
              continue;
            }
            o === -1 && ((v = !1), (o = y + 1)),
              D === S
                ? h === -1
                  ? (h = y)
                  : A !== 1 && (A = 1)
                : h !== -1 && (A = -1);
          }
          return h === -1 ||
            o === -1 ||
            A === 0 ||
            (A === 1 && h === o - 1 && h === d + 1)
            ? ''
            : r.slice(h, o);
        },
        format: w.bind(null, '\\'),
        parse(r) {
          b(r, 'path');
          const l = { root: '', dir: '', base: '', ext: '', name: '' };
          if (r.length === 0) return l;
          const h = r.length;
          let d = 0,
            o = r.charCodeAt(0);
          if (h === 1)
            return C(o)
              ? ((l.root = l.dir = r), l)
              : ((l.base = l.name = r), l);
          if (C(o)) {
            if (((d = 1), C(r.charCodeAt(1)))) {
              let I = 2,
                U = I;
              for (; I < h && !C(r.charCodeAt(I)); ) I++;
              if (I < h && I !== U) {
                for (U = I; I < h && C(r.charCodeAt(I)); ) I++;
                if (I < h && I !== U) {
                  for (U = I; I < h && !C(r.charCodeAt(I)); ) I++;
                  I === h ? (d = I) : I !== U && (d = I + 1);
                }
              }
            }
          } else if (L(o) && r.charCodeAt(1) === p) {
            if (h <= 2) return (l.root = l.dir = r), l;
            if (((d = 2), C(r.charCodeAt(2)))) {
              if (h === 3) return (l.root = l.dir = r), l;
              d = 3;
            }
          }
          d > 0 && (l.root = r.slice(0, d));
          let v = -1,
            A = d,
            y = -1,
            D = !0,
            k = r.length - 1,
            B = 0;
          for (; k >= d; --k) {
            if (((o = r.charCodeAt(k)), C(o))) {
              if (!D) {
                A = k + 1;
                break;
              }
              continue;
            }
            y === -1 && ((D = !1), (y = k + 1)),
              o === S
                ? v === -1
                  ? (v = k)
                  : B !== 1 && (B = 1)
                : v !== -1 && (B = -1);
          }
          return (
            y !== -1 &&
              (v === -1 || B === 0 || (B === 1 && v === y - 1 && v === A + 1)
                ? (l.base = l.name = r.slice(A, y))
                : ((l.name = r.slice(A, v)),
                  (l.base = r.slice(A, y)),
                  (l.ext = r.slice(v, y)))),
            A > 0 && A !== d ? (l.dir = r.slice(0, A - 1)) : (l.dir = l.root),
            l
          );
        },
        sep: '\\',
        delimiter: ';',
        win32: null,
        posix: null,
      };
      const c = (() => {
        if (m) {
          const r = /\\/g;
          return () => {
            const l = R.cwd().replace(r, '/');
            return l.slice(l.indexOf('/'));
          };
        }
        return () => R.cwd();
      })();
      (n.posix = {
        resolve(...r) {
          let l = '',
            h = !1;
          for (let d = r.length - 1; d >= -1 && !h; d--) {
            const o = d >= 0 ? r[d] : c();
            b(o, 'path'),
              o.length !== 0 &&
                ((l = `${o}/${l}`), (h = o.charCodeAt(0) === a));
          }
          return (l = N(l, !h, '/', E)), h ? `/${l}` : l.length > 0 ? l : '.';
        },
        normalize(r) {
          if ((b(r, 'path'), r.length === 0)) return '.';
          const l = r.charCodeAt(0) === a,
            h = r.charCodeAt(r.length - 1) === a;
          return (
            (r = N(r, !l, '/', E)),
            r.length === 0
              ? l
                ? '/'
                : h
                ? './'
                : '.'
              : (h && (r += '/'), l ? `/${r}` : r)
          );
        },
        isAbsolute(r) {
          return b(r, 'path'), r.length > 0 && r.charCodeAt(0) === a;
        },
        join(...r) {
          if (r.length === 0) return '.';
          let l;
          for (let h = 0; h < r.length; ++h) {
            const d = r[h];
            b(d, 'path'),
              d.length > 0 && (l === void 0 ? (l = d) : (l += `/${d}`));
          }
          return l === void 0 ? '.' : n.posix.normalize(l);
        },
        relative(r, l) {
          if (
            (b(r, 'from'),
            b(l, 'to'),
            r === l ||
              ((r = n.posix.resolve(r)), (l = n.posix.resolve(l)), r === l))
          )
            return '';
          const h = 1,
            d = r.length,
            o = d - h,
            v = 1,
            A = l.length - v,
            y = o < A ? o : A;
          let D = -1,
            k = 0;
          for (; k < y; k++) {
            const I = r.charCodeAt(h + k);
            if (I !== l.charCodeAt(v + k)) break;
            I === a && (D = k);
          }
          if (k === y)
            if (A > y) {
              if (l.charCodeAt(v + k) === a) return l.slice(v + k + 1);
              if (k === 0) return l.slice(v + k);
            } else
              o > y &&
                (r.charCodeAt(h + k) === a ? (D = k) : k === 0 && (D = 0));
          let B = '';
          for (k = h + D + 1; k <= d; ++k)
            (k === d || r.charCodeAt(k) === a) &&
              (B += B.length === 0 ? '..' : '/..');
          return `${B}${l.slice(v + D)}`;
        },
        toNamespacedPath(r) {
          return r;
        },
        dirname(r) {
          if ((b(r, 'path'), r.length === 0)) return '.';
          const l = r.charCodeAt(0) === a;
          let h = -1,
            d = !0;
          for (let o = r.length - 1; o >= 1; --o)
            if (r.charCodeAt(o) === a) {
              if (!d) {
                h = o;
                break;
              }
            } else d = !1;
          return h === -1
            ? l
              ? '/'
              : '.'
            : l && h === 1
            ? '//'
            : r.slice(0, h);
        },
        basename(r, l) {
          l !== void 0 && b(l, 'ext'), b(r, 'path');
          let h = 0,
            d = -1,
            o = !0,
            v;
          if (l !== void 0 && l.length > 0 && l.length <= r.length) {
            if (l === r) return '';
            let A = l.length - 1,
              y = -1;
            for (v = r.length - 1; v >= 0; --v) {
              const D = r.charCodeAt(v);
              if (D === a) {
                if (!o) {
                  h = v + 1;
                  break;
                }
              } else
                y === -1 && ((o = !1), (y = v + 1)),
                  A >= 0 &&
                    (D === l.charCodeAt(A)
                      ? --A === -1 && (d = v)
                      : ((A = -1), (d = y)));
            }
            return (
              h === d ? (d = y) : d === -1 && (d = r.length), r.slice(h, d)
            );
          }
          for (v = r.length - 1; v >= 0; --v)
            if (r.charCodeAt(v) === a) {
              if (!o) {
                h = v + 1;
                break;
              }
            } else d === -1 && ((o = !1), (d = v + 1));
          return d === -1 ? '' : r.slice(h, d);
        },
        extname(r) {
          b(r, 'path');
          let l = -1,
            h = 0,
            d = -1,
            o = !0,
            v = 0;
          for (let A = r.length - 1; A >= 0; --A) {
            const y = r.charCodeAt(A);
            if (y === a) {
              if (!o) {
                h = A + 1;
                break;
              }
              continue;
            }
            d === -1 && ((o = !1), (d = A + 1)),
              y === S
                ? l === -1
                  ? (l = A)
                  : v !== 1 && (v = 1)
                : l !== -1 && (v = -1);
          }
          return l === -1 ||
            d === -1 ||
            v === 0 ||
            (v === 1 && l === d - 1 && l === h + 1)
            ? ''
            : r.slice(l, d);
        },
        format: w.bind(null, '/'),
        parse(r) {
          b(r, 'path');
          const l = { root: '', dir: '', base: '', ext: '', name: '' };
          if (r.length === 0) return l;
          const h = r.charCodeAt(0) === a;
          let d;
          h ? ((l.root = '/'), (d = 1)) : (d = 0);
          let o = -1,
            v = 0,
            A = -1,
            y = !0,
            D = r.length - 1,
            k = 0;
          for (; D >= d; --D) {
            const B = r.charCodeAt(D);
            if (B === a) {
              if (!y) {
                v = D + 1;
                break;
              }
              continue;
            }
            A === -1 && ((y = !1), (A = D + 1)),
              B === S
                ? o === -1
                  ? (o = D)
                  : k !== 1 && (k = 1)
                : o !== -1 && (k = -1);
          }
          if (A !== -1) {
            const B = v === 0 && h ? 1 : v;
            o === -1 || k === 0 || (k === 1 && o === A - 1 && o === v + 1)
              ? (l.base = l.name = r.slice(B, A))
              : ((l.name = r.slice(B, o)),
                (l.base = r.slice(B, A)),
                (l.ext = r.slice(o, A)));
          }
          return v > 0 ? (l.dir = r.slice(0, v - 1)) : h && (l.dir = '/'), l;
        },
        sep: '/',
        delimiter: ':',
        win32: null,
        posix: null,
      }),
        (n.posix.win32 = n.win32.win32 = n.win32),
        (n.posix.posix = n.win32.posix = n.posix),
        (n.normalize = m ? n.win32.normalize : n.posix.normalize),
        (n.resolve = m ? n.win32.resolve : n.posix.resolve),
        (n.relative = m ? n.win32.relative : n.posix.relative),
        (n.dirname = m ? n.win32.dirname : n.posix.dirname),
        (n.basename = m ? n.win32.basename : n.posix.basename),
        (n.extname = m ? n.win32.extname : n.posix.extname),
        (n.sep = m ? n.win32.sep : n.posix.sep);
    }),
    Y(X[24], J([0, 1, 8]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.StopWatch = void 0);
      const M =
        R.globals.performance && typeof R.globals.performance.now == 'function';
      class i {
        static create(_ = !0) {
          return new i(_);
        }
        constructor(_) {
          (this._highResolution = M && _),
            (this._startTime = this._now()),
            (this._stopTime = -1);
        }
        stop() {
          this._stopTime = this._now();
        }
        elapsed() {
          return this._stopTime !== -1
            ? this._stopTime - this._startTime
            : this._now() - this._startTime;
        }
        _now() {
          return this._highResolution
            ? R.globals.performance.now()
            : Date.now();
        }
      }
      n.StopWatch = i;
    }),
    Y(X[9], J([0, 1, 4, 15, 11, 17, 24]), function (x, n, R, M, i, u, _) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.Relay =
          n.EventBufferer =
          n.EventMultiplexer =
          n.MicrotaskEmitter =
          n.DebounceEmitter =
          n.PauseableEmitter =
          n.EventDeliveryQueue =
          n.Emitter =
          n.EventProfiling =
          n.Event =
            void 0);
      const S = !1,
        a = !1;
      var s;
      (function (d) {
        d.None = () => i.Disposable.None;
        function o(Z) {
          if (a) {
            const { onDidAddListener: z } = Z,
              G = g.create();
            let j = 0;
            Z.onDidAddListener = () => {
              ++j === 2 &&
                (console.warn(
                  'snapshotted emitter LIKELY used public and SHOULD HAVE BEEN created with DisposableStore. snapshotted here',
                ),
                G.print()),
                z?.();
            };
          }
        }
        function v(Z, z) {
          return Q(Z, () => {}, 0, void 0, !0, void 0, z);
        }
        d.defer = v;
        function A(Z) {
          return (z, G = null, j) => {
            let K = !1,
              te;
            return (
              (te = Z(
                ie => {
                  if (!K) return te ? te.dispose() : (K = !0), z.call(G, ie);
                },
                null,
                j,
              )),
              K && te.dispose(),
              te
            );
          };
        }
        d.once = A;
        function y(Z, z, G) {
          return V((j, K = null, te) => Z(ie => j.call(K, z(ie)), null, te), G);
        }
        d.map = y;
        function D(Z, z, G) {
          return V(
            (j, K = null, te) =>
              Z(
                ie => {
                  z(ie), j.call(K, ie);
                },
                null,
                te,
              ),
            G,
          );
        }
        d.forEach = D;
        function k(Z, z, G) {
          return V(
            (j, K = null, te) => Z(ie => z(ie) && j.call(K, ie), null, te),
            G,
          );
        }
        d.filter = k;
        function B(Z) {
          return Z;
        }
        d.signal = B;
        function I(...Z) {
          return (z, G = null, j) =>
            (0, i.combinedDisposable)(
              ...Z.map(K => K(te => z.call(G, te), null, j)),
            );
        }
        d.any = I;
        function U(Z, z, G, j) {
          let K = G;
          return y(Z, te => ((K = z(K, te)), K), j);
        }
        d.reduce = U;
        function V(Z, z) {
          let G;
          const j = {
            onWillAddFirstListener() {
              G = Z(K.fire, K);
            },
            onDidRemoveLastListener() {
              G?.dispose();
            },
          };
          z || o(j);
          const K = new m(j);
          return z?.add(K), K.event;
        }
        function Q(Z, z, G = 100, j = !1, K = !1, te, ie) {
          let fe,
            we,
            ce,
            ve = 0,
            P;
          const O = {
            leakWarningThreshold: te,
            onWillAddFirstListener() {
              fe = Z($ => {
                ve++,
                  (we = z(we, $)),
                  j && !ce && (W.fire(we), (we = void 0)),
                  (P = () => {
                    const ee = we;
                    (we = void 0),
                      (ce = void 0),
                      (!j || ve > 1) && W.fire(ee),
                      (ve = 0);
                  }),
                  typeof G == 'number'
                    ? (clearTimeout(ce), (ce = setTimeout(P, G)))
                    : ce === void 0 && ((ce = 0), queueMicrotask(P));
              });
            },
            onWillRemoveListener() {
              K && ve > 0 && P?.();
            },
            onDidRemoveLastListener() {
              (P = void 0), fe.dispose();
            },
          };
          ie || o(O);
          const W = new m(O);
          return ie?.add(W), W.event;
        }
        d.debounce = Q;
        function F(Z, z = 0, G) {
          return d.debounce(
            Z,
            (j, K) => (j ? (j.push(K), j) : [K]),
            z,
            void 0,
            !0,
            void 0,
            G,
          );
        }
        d.accumulate = F;
        function T(Z, z = (j, K) => j === K, G) {
          let j = !0,
            K;
          return k(
            Z,
            te => {
              const ie = j || !z(te, K);
              return (j = !1), (K = te), ie;
            },
            G,
          );
        }
        d.latch = T;
        function q(Z, z, G) {
          return [d.filter(Z, z, G), d.filter(Z, j => !z(j), G)];
        }
        d.split = q;
        function H(Z, z = !1, G = []) {
          let j = G.slice(),
            K = Z(fe => {
              j ? j.push(fe) : ie.fire(fe);
            });
          const te = () => {
              j?.forEach(fe => ie.fire(fe)), (j = null);
            },
            ie = new m({
              onWillAddFirstListener() {
                K || (K = Z(fe => ie.fire(fe)));
              },
              onDidAddFirstListener() {
                j && (z ? setTimeout(te) : te());
              },
              onDidRemoveLastListener() {
                K && K.dispose(), (K = null);
              },
            });
          return ie.event;
        }
        d.buffer = H;
        class t {
          constructor(z) {
            (this.event = z), (this.disposables = new i.DisposableStore());
          }
          map(z) {
            return new t(y(this.event, z, this.disposables));
          }
          forEach(z) {
            return new t(D(this.event, z, this.disposables));
          }
          filter(z) {
            return new t(k(this.event, z, this.disposables));
          }
          reduce(z, G) {
            return new t(U(this.event, z, G, this.disposables));
          }
          latch() {
            return new t(T(this.event, void 0, this.disposables));
          }
          debounce(z, G = 100, j = !1, K = !1, te) {
            return new t(Q(this.event, z, G, j, K, te, this.disposables));
          }
          on(z, G, j) {
            return this.event(z, G, j);
          }
          once(z, G, j) {
            return A(this.event)(z, G, j);
          }
          dispose() {
            this.disposables.dispose();
          }
        }
        function oe(Z) {
          return new t(Z);
        }
        d.chain = oe;
        function ne(Z, z, G = j => j) {
          const j = (...fe) => ie.fire(G(...fe)),
            K = () => Z.on(z, j),
            te = () => Z.removeListener(z, j),
            ie = new m({
              onWillAddFirstListener: K,
              onDidRemoveLastListener: te,
            });
          return ie.event;
        }
        d.fromNodeEventEmitter = ne;
        function he(Z, z, G = j => j) {
          const j = (...fe) => ie.fire(G(...fe)),
            K = () => Z.addEventListener(z, j),
            te = () => Z.removeEventListener(z, j),
            ie = new m({
              onWillAddFirstListener: K,
              onDidRemoveLastListener: te,
            });
          return ie.event;
        }
        d.fromDOMEventEmitter = he;
        function be(Z) {
          return new Promise(z => A(Z)(z));
        }
        d.toPromise = be;
        function re(Z, z) {
          return z(void 0), Z(G => z(G));
        }
        d.runAndSubscribe = re;
        function se(Z, z) {
          let G = null;
          function j(te) {
            G?.dispose(), (G = new i.DisposableStore()), z(te, G);
          }
          j(void 0);
          const K = Z(te => j(te));
          return (0, i.toDisposable)(() => {
            K.dispose(), G?.dispose();
          });
        }
        d.runAndSubscribeWithStore = se;
        class ge {
          constructor(z, G) {
            (this._observable = z),
              (this._counter = 0),
              (this._hasChanged = !1);
            const j = {
              onWillAddFirstListener: () => {
                z.addObserver(this);
              },
              onDidRemoveLastListener: () => {
                z.removeObserver(this);
              },
            };
            G || o(j), (this.emitter = new m(j)), G && G.add(this.emitter);
          }
          beginUpdate(z) {
            this._counter++;
          }
          handlePossibleChange(z) {}
          handleChange(z, G) {
            this._hasChanged = !0;
          }
          endUpdate(z) {
            this._counter--,
              this._counter === 0 &&
                (this._observable.reportChanges(),
                this._hasChanged &&
                  ((this._hasChanged = !1),
                  this.emitter.fire(this._observable.get())));
          }
        }
        function Le(Z, z) {
          return new ge(Z, z).emitter.event;
        }
        d.fromObservable = Le;
        function Se(Z) {
          return z => {
            let G = 0,
              j = !1;
            const K = {
              beginUpdate() {
                G++;
              },
              endUpdate() {
                G--, G === 0 && (Z.reportChanges(), j && ((j = !1), z()));
              },
              handlePossibleChange() {},
              handleChange() {
                j = !0;
              },
            };
            return (
              Z.addObserver(K),
              {
                dispose() {
                  Z.removeObserver(K);
                },
              }
            );
          };
        }
        d.fromObservableLight = Se;
      })(s || (n.Event = s = {}));
      class p {
        constructor(o) {
          (this.listenerCount = 0),
            (this.invocationCount = 0),
            (this.elapsedOverall = 0),
            (this.durations = []),
            (this.name = `${o}_${p._idPool++}`),
            p.all.add(this);
        }
        start(o) {
          (this._stopWatch = new _.StopWatch(!0)), (this.listenerCount = o);
        }
        stop() {
          if (this._stopWatch) {
            const o = this._stopWatch.elapsed();
            this.durations.push(o),
              (this.elapsedOverall += o),
              (this.invocationCount += 1),
              (this._stopWatch = void 0);
          }
        }
      }
      (n.EventProfiling = p), (p.all = new Set()), (p._idPool = 0);
      let e = -1;
      class f {
        constructor(o, v = Math.random().toString(18).slice(2, 5)) {
          (this.threshold = o), (this.name = v), (this._warnCountdown = 0);
        }
        dispose() {
          var o;
          (o = this._stacks) === null || o === void 0 || o.clear();
        }
        check(o, v) {
          const A = this.threshold;
          if (A <= 0 || v < A) return;
          this._stacks || (this._stacks = new Map());
          const y = this._stacks.get(o.value) || 0;
          if (
            (this._stacks.set(o.value, y + 1),
            (this._warnCountdown -= 1),
            this._warnCountdown <= 0)
          ) {
            this._warnCountdown = A * 0.5;
            let D,
              k = 0;
            for (const [B, I] of this._stacks)
              (!D || k < I) && ((D = B), (k = I));
            console.warn(
              `[${this.name}] potential listener LEAK detected, having ${v} listeners already. MOST frequent listener (${k}):`,
            ),
              console.warn(D);
          }
          return () => {
            const D = this._stacks.get(o.value) || 0;
            this._stacks.set(o.value, D - 1);
          };
        }
      }
      class g {
        static create() {
          var o;
          return new g(
            (o = new Error().stack) !== null && o !== void 0 ? o : '',
          );
        }
        constructor(o) {
          this.value = o;
        }
        print() {
          console.warn(
            this.value
              .split(
                `
`,
              )
              .slice(2).join(`
`),
          );
        }
      }
      class b {
        constructor(o, v, A) {
          (this.callback = o),
            (this.callbackThis = v),
            (this.stack = A),
            (this.subscription = new i.SafeDisposable());
        }
        invoke(o) {
          this.callback.call(this.callbackThis, o);
        }
      }
      class m {
        constructor(o) {
          var v, A, y, D, k;
          (this._disposed = !1),
            (this._options = o),
            (this._leakageMon =
              e > 0 ||
              (!((v = this._options) === null || v === void 0) &&
                v.leakWarningThreshold)
                ? new f(
                    (y =
                      (A = this._options) === null || A === void 0
                        ? void 0
                        : A.leakWarningThreshold) !== null && y !== void 0
                      ? y
                      : e,
                  )
                : void 0),
            (this._perfMon =
              !((D = this._options) === null || D === void 0) && D._profName
                ? new p(this._options._profName)
                : void 0),
            (this._deliveryQueue =
              (k = this._options) === null || k === void 0
                ? void 0
                : k.deliveryQueue);
        }
        dispose() {
          var o, v, A, y;
          if (!this._disposed) {
            if (((this._disposed = !0), this._listeners)) {
              if (S) {
                const D = Array.from(this._listeners);
                queueMicrotask(() => {
                  var k;
                  for (const B of D)
                    B.subscription.isset() &&
                      (B.subscription.unset(),
                      (k = B.stack) === null || k === void 0 || k.print());
                });
              }
              this._listeners.clear();
            }
            (o = this._deliveryQueue) === null || o === void 0 || o.clear(this),
              (A =
                (v = this._options) === null || v === void 0
                  ? void 0
                  : v.onDidRemoveLastListener) === null ||
                A === void 0 ||
                A.call(v),
              (y = this._leakageMon) === null || y === void 0 || y.dispose();
          }
        }
        get event() {
          return (
            this._event ||
              (this._event = (o, v, A) => {
                var y, D, k;
                if (
                  (this._listeners || (this._listeners = new u.LinkedList()),
                  this._leakageMon &&
                    this._listeners.size > this._leakageMon.threshold * 3)
                )
                  return (
                    console.warn(
                      `[${this._leakageMon.name}] REFUSES to accept new listeners because it exceeded its threshold by far`,
                    ),
                    i.Disposable.None
                  );
                const B = this._listeners.isEmpty();
                B &&
                  !((y = this._options) === null || y === void 0) &&
                  y.onWillAddFirstListener &&
                  this._options.onWillAddFirstListener(this);
                let I, U;
                this._leakageMon &&
                  this._listeners.size >=
                    Math.ceil(this._leakageMon.threshold * 0.2) &&
                  ((U = g.create()),
                  (I = this._leakageMon.check(U, this._listeners.size + 1))),
                  S && (U = U ?? g.create());
                const V = new b(o, v, U),
                  Q = this._listeners.push(V);
                B &&
                  !((D = this._options) === null || D === void 0) &&
                  D.onDidAddFirstListener &&
                  this._options.onDidAddFirstListener(this),
                  !((k = this._options) === null || k === void 0) &&
                    k.onDidAddListener &&
                    this._options.onDidAddListener(this, o, v);
                const F = V.subscription.set(() => {
                  var T, q;
                  I?.(),
                    this._disposed ||
                      ((q =
                        (T = this._options) === null || T === void 0
                          ? void 0
                          : T.onWillRemoveListener) === null ||
                        q === void 0 ||
                        q.call(T, this),
                      Q(),
                      this._options &&
                        this._options.onDidRemoveLastListener &&
                        ((this._listeners && !this._listeners.isEmpty()) ||
                          this._options.onDidRemoveLastListener(this)));
                });
                return (
                  A instanceof i.DisposableStore
                    ? A.add(F)
                    : Array.isArray(A) && A.push(F),
                  F
                );
              }),
            this._event
          );
        }
        fire(o) {
          var v, A, y;
          if (this._listeners) {
            this._deliveryQueue ||
              (this._deliveryQueue = new E(
                (v = this._options) === null || v === void 0
                  ? void 0
                  : v.onListenerError,
              ));
            for (const D of this._listeners)
              this._deliveryQueue.push(this, D, o);
            (A = this._perfMon) === null ||
              A === void 0 ||
              A.start(this._deliveryQueue.size),
              this._deliveryQueue.deliver(),
              (y = this._perfMon) === null || y === void 0 || y.stop();
          }
        }
        hasListeners() {
          return this._listeners ? !this._listeners.isEmpty() : !1;
        }
      }
      n.Emitter = m;
      class C {
        constructor(o = R.onUnexpectedError) {
          (this._onListenerError = o), (this._queue = new u.LinkedList());
        }
        get size() {
          return this._queue.size;
        }
        push(o, v, A) {
          this._queue.push(new L(o, v, A));
        }
        clear(o) {
          const v = new u.LinkedList();
          for (const A of this._queue) A.emitter !== o && v.push(A);
          this._queue = v;
        }
        deliver() {
          for (; this._queue.size > 0; ) {
            const o = this._queue.shift();
            try {
              o.listener.invoke(o.event);
            } catch (v) {
              this._onListenerError(v);
            }
          }
        }
      }
      n.EventDeliveryQueue = C;
      class E extends C {
        clear(o) {
          this._queue.clear();
        }
      }
      class L {
        constructor(o, v, A) {
          (this.emitter = o), (this.listener = v), (this.event = A);
        }
      }
      class N extends m {
        constructor(o) {
          super(o),
            (this._isPaused = 0),
            (this._eventQueue = new u.LinkedList()),
            (this._mergeFn = o?.merge);
        }
        pause() {
          this._isPaused++;
        }
        resume() {
          if (this._isPaused !== 0 && --this._isPaused === 0)
            if (this._mergeFn) {
              if (this._eventQueue.size > 0) {
                const o = Array.from(this._eventQueue);
                this._eventQueue.clear(), super.fire(this._mergeFn(o));
              }
            } else
              for (; !this._isPaused && this._eventQueue.size !== 0; )
                super.fire(this._eventQueue.shift());
        }
        fire(o) {
          this._listeners &&
            (this._isPaused !== 0 ? this._eventQueue.push(o) : super.fire(o));
        }
      }
      n.PauseableEmitter = N;
      class w extends N {
        constructor(o) {
          var v;
          super(o),
            (this._delay = (v = o.delay) !== null && v !== void 0 ? v : 100);
        }
        fire(o) {
          this._handle ||
            (this.pause(),
            (this._handle = setTimeout(() => {
              (this._handle = void 0), this.resume();
            }, this._delay))),
            super.fire(o);
        }
      }
      n.DebounceEmitter = w;
      class c extends m {
        constructor(o) {
          super(o), (this._queuedEvents = []), (this._mergeFn = o?.merge);
        }
        fire(o) {
          this.hasListeners() &&
            (this._queuedEvents.push(o),
            this._queuedEvents.length === 1 &&
              queueMicrotask(() => {
                this._mergeFn
                  ? super.fire(this._mergeFn(this._queuedEvents))
                  : this._queuedEvents.forEach(v => super.fire(v)),
                  (this._queuedEvents = []);
              }));
        }
      }
      n.MicrotaskEmitter = c;
      class r {
        constructor() {
          (this.hasListeners = !1),
            (this.events = []),
            (this.emitter = new m({
              onWillAddFirstListener: () => this.onFirstListenerAdd(),
              onDidRemoveLastListener: () => this.onLastListenerRemove(),
            }));
        }
        get event() {
          return this.emitter.event;
        }
        add(o) {
          const v = { event: o, listener: null };
          this.events.push(v), this.hasListeners && this.hook(v);
          const A = () => {
            this.hasListeners && this.unhook(v);
            const y = this.events.indexOf(v);
            this.events.splice(y, 1);
          };
          return (0, i.toDisposable)((0, M.once)(A));
        }
        onFirstListenerAdd() {
          (this.hasListeners = !0), this.events.forEach(o => this.hook(o));
        }
        onLastListenerRemove() {
          (this.hasListeners = !1), this.events.forEach(o => this.unhook(o));
        }
        hook(o) {
          o.listener = o.event(v => this.emitter.fire(v));
        }
        unhook(o) {
          o.listener && o.listener.dispose(), (o.listener = null);
        }
        dispose() {
          this.emitter.dispose();
        }
      }
      n.EventMultiplexer = r;
      class l {
        constructor() {
          this.buffers = [];
        }
        wrapEvent(o) {
          return (v, A, y) =>
            o(
              D => {
                const k = this.buffers[this.buffers.length - 1];
                k ? k.push(() => v.call(A, D)) : v.call(A, D);
              },
              void 0,
              y,
            );
        }
        bufferEvents(o) {
          const v = [];
          this.buffers.push(v);
          const A = o();
          return this.buffers.pop(), v.forEach(y => y()), A;
        }
      }
      n.EventBufferer = l;
      class h {
        constructor() {
          (this.listening = !1),
            (this.inputEvent = s.None),
            (this.inputEventListener = i.Disposable.None),
            (this.emitter = new m({
              onDidAddFirstListener: () => {
                (this.listening = !0),
                  (this.inputEventListener = this.inputEvent(
                    this.emitter.fire,
                    this.emitter,
                  ));
              },
              onDidRemoveLastListener: () => {
                (this.listening = !1), this.inputEventListener.dispose();
              },
            })),
            (this.event = this.emitter.event);
        }
        set input(o) {
          (this.inputEvent = o),
            this.listening &&
              (this.inputEventListener.dispose(),
              (this.inputEventListener = o(this.emitter.fire, this.emitter)));
        }
        dispose() {
          this.inputEventListener.dispose(), this.emitter.dispose();
        }
      }
      n.Relay = h;
    }),
    Y(X[55], J([0, 1, 9]), function (x, n, R) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.CancellationTokenSource = n.CancellationToken = void 0);
      const M = Object.freeze(function (S, a) {
        const s = setTimeout(S.bind(a), 0);
        return {
          dispose() {
            clearTimeout(s);
          },
        };
      });
      var i;
      (function (S) {
        function a(s) {
          return s === S.None || s === S.Cancelled || s instanceof u
            ? !0
            : !s || typeof s != 'object'
            ? !1
            : typeof s.isCancellationRequested == 'boolean' &&
              typeof s.onCancellationRequested == 'function';
        }
        (S.isCancellationToken = a),
          (S.None = Object.freeze({
            isCancellationRequested: !1,
            onCancellationRequested: R.Event.None,
          })),
          (S.Cancelled = Object.freeze({
            isCancellationRequested: !0,
            onCancellationRequested: M,
          }));
      })(i || (n.CancellationToken = i = {}));
      class u {
        constructor() {
          (this._isCancelled = !1), (this._emitter = null);
        }
        cancel() {
          this._isCancelled ||
            ((this._isCancelled = !0),
            this._emitter && (this._emitter.fire(void 0), this.dispose()));
        }
        get isCancellationRequested() {
          return this._isCancelled;
        }
        get onCancellationRequested() {
          return this._isCancelled
            ? M
            : (this._emitter || (this._emitter = new R.Emitter()),
              this._emitter.event);
        }
        dispose() {
          this._emitter && (this._emitter.dispose(), (this._emitter = null));
        }
      }
      class _ {
        constructor(a) {
          (this._token = void 0),
            (this._parentListener = void 0),
            (this._parentListener =
              a && a.onCancellationRequested(this.cancel, this));
        }
        get token() {
          return this._token || (this._token = new u()), this._token;
        }
        cancel() {
          this._token
            ? this._token instanceof u && this._token.cancel()
            : (this._token = i.Cancelled);
        }
        dispose(a = !1) {
          var s;
          a && this.cancel(),
            (s = this._parentListener) === null || s === void 0 || s.dispose(),
            this._token
              ? this._token instanceof u && this._token.dispose()
              : (this._token = i.None);
        }
      }
      n.CancellationTokenSource = _;
    }),
    Y(X[14], J([0, 1, 54, 8]), function (x, n, R, M) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.uriToFsPath = n.URI = void 0);
      const i = /^\w[\w\d+.-]*$/,
        u = /^\//,
        _ = /^\/\//;
      function S(h, d) {
        if (!h.scheme && d)
          throw new Error(
            `[UriError]: Scheme is missing: {scheme: "", authority: "${h.authority}", path: "${h.path}", query: "${h.query}", fragment: "${h.fragment}"}`,
          );
        if (h.scheme && !i.test(h.scheme))
          throw new Error('[UriError]: Scheme contains illegal characters.');
        if (h.path) {
          if (h.authority) {
            if (!u.test(h.path))
              throw new Error(
                '[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character',
              );
          } else if (_.test(h.path))
            throw new Error(
              '[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")',
            );
        }
      }
      function a(h, d) {
        return !h && !d ? 'file' : h;
      }
      function s(h, d) {
        switch (h) {
          case 'https':
          case 'http':
          case 'file':
            d ? d[0] !== e && (d = e + d) : (d = e);
            break;
        }
        return d;
      }
      const p = '',
        e = '/',
        f = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
      class g {
        static isUri(d) {
          return d instanceof g
            ? !0
            : d
            ? typeof d.authority == 'string' &&
              typeof d.fragment == 'string' &&
              typeof d.path == 'string' &&
              typeof d.query == 'string' &&
              typeof d.scheme == 'string' &&
              typeof d.fsPath == 'string' &&
              typeof d.with == 'function' &&
              typeof d.toString == 'function'
            : !1;
        }
        constructor(d, o, v, A, y, D = !1) {
          typeof d == 'object'
            ? ((this.scheme = d.scheme || p),
              (this.authority = d.authority || p),
              (this.path = d.path || p),
              (this.query = d.query || p),
              (this.fragment = d.fragment || p))
            : ((this.scheme = a(d, D)),
              (this.authority = o || p),
              (this.path = s(this.scheme, v || p)),
              (this.query = A || p),
              (this.fragment = y || p),
              S(this, D));
        }
        get fsPath() {
          return N(this, !1);
        }
        with(d) {
          if (!d) return this;
          let { scheme: o, authority: v, path: A, query: y, fragment: D } = d;
          return (
            o === void 0 ? (o = this.scheme) : o === null && (o = p),
            v === void 0 ? (v = this.authority) : v === null && (v = p),
            A === void 0 ? (A = this.path) : A === null && (A = p),
            y === void 0 ? (y = this.query) : y === null && (y = p),
            D === void 0 ? (D = this.fragment) : D === null && (D = p),
            o === this.scheme &&
            v === this.authority &&
            A === this.path &&
            y === this.query &&
            D === this.fragment
              ? this
              : new m(o, v, A, y, D)
          );
        }
        static parse(d, o = !1) {
          const v = f.exec(d);
          return v
            ? new m(
                v[2] || p,
                l(v[4] || p),
                l(v[5] || p),
                l(v[7] || p),
                l(v[9] || p),
                o,
              )
            : new m(p, p, p, p, p);
        }
        static file(d) {
          let o = p;
          if (
            (M.isWindows && (d = d.replace(/\\/g, e)), d[0] === e && d[1] === e)
          ) {
            const v = d.indexOf(e, 2);
            v === -1
              ? ((o = d.substring(2)), (d = e))
              : ((o = d.substring(2, v)), (d = d.substring(v) || e));
          }
          return new m('file', o, d, p, p);
        }
        static from(d, o) {
          return new m(d.scheme, d.authority, d.path, d.query, d.fragment, o);
        }
        static joinPath(d, ...o) {
          if (!d.path)
            throw new Error(
              '[UriError]: cannot call joinPath on URI without path',
            );
          let v;
          return (
            M.isWindows && d.scheme === 'file'
              ? (v = g.file(R.win32.join(N(d, !0), ...o)).path)
              : (v = R.posix.join(d.path, ...o)),
            d.with({ path: v })
          );
        }
        toString(d = !1) {
          return w(this, d);
        }
        toJSON() {
          return this;
        }
        static revive(d) {
          var o, v;
          if (d) {
            if (d instanceof g) return d;
            {
              const A = new m(d);
              return (
                (A._formatted =
                  (o = d.external) !== null && o !== void 0 ? o : null),
                (A._fsPath =
                  d._sep === b && (v = d.fsPath) !== null && v !== void 0
                    ? v
                    : null),
                A
              );
            }
          } else return d;
        }
      }
      n.URI = g;
      const b = M.isWindows ? 1 : void 0;
      class m extends g {
        constructor() {
          super(...arguments), (this._formatted = null), (this._fsPath = null);
        }
        get fsPath() {
          return this._fsPath || (this._fsPath = N(this, !1)), this._fsPath;
        }
        toString(d = !1) {
          return d
            ? w(this, !0)
            : (this._formatted || (this._formatted = w(this, !1)),
              this._formatted);
        }
        toJSON() {
          const d = { $mid: 1 };
          return (
            this._fsPath && ((d.fsPath = this._fsPath), (d._sep = b)),
            this._formatted && (d.external = this._formatted),
            this.path && (d.path = this.path),
            this.scheme && (d.scheme = this.scheme),
            this.authority && (d.authority = this.authority),
            this.query && (d.query = this.query),
            this.fragment && (d.fragment = this.fragment),
            d
          );
        }
      }
      const C = {
        [58]: '%3A',
        [47]: '%2F',
        [63]: '%3F',
        [35]: '%23',
        [91]: '%5B',
        [93]: '%5D',
        [64]: '%40',
        [33]: '%21',
        [36]: '%24',
        [38]: '%26',
        [39]: '%27',
        [40]: '%28',
        [41]: '%29',
        [42]: '%2A',
        [43]: '%2B',
        [44]: '%2C',
        [59]: '%3B',
        [61]: '%3D',
        [32]: '%20',
      };
      function E(h, d, o) {
        let v,
          A = -1;
        for (let y = 0; y < h.length; y++) {
          const D = h.charCodeAt(y);
          if (
            (D >= 97 && D <= 122) ||
            (D >= 65 && D <= 90) ||
            (D >= 48 && D <= 57) ||
            D === 45 ||
            D === 46 ||
            D === 95 ||
            D === 126 ||
            (d && D === 47) ||
            (o && D === 91) ||
            (o && D === 93) ||
            (o && D === 58)
          )
            A !== -1 &&
              ((v += encodeURIComponent(h.substring(A, y))), (A = -1)),
              v !== void 0 && (v += h.charAt(y));
          else {
            v === void 0 && (v = h.substr(0, y));
            const k = C[D];
            k !== void 0
              ? (A !== -1 &&
                  ((v += encodeURIComponent(h.substring(A, y))), (A = -1)),
                (v += k))
              : A === -1 && (A = y);
          }
        }
        return (
          A !== -1 && (v += encodeURIComponent(h.substring(A))),
          v !== void 0 ? v : h
        );
      }
      function L(h) {
        let d;
        for (let o = 0; o < h.length; o++) {
          const v = h.charCodeAt(o);
          v === 35 || v === 63
            ? (d === void 0 && (d = h.substr(0, o)), (d += C[v]))
            : d !== void 0 && (d += h[o]);
        }
        return d !== void 0 ? d : h;
      }
      function N(h, d) {
        let o;
        return (
          h.authority && h.path.length > 1 && h.scheme === 'file'
            ? (o = `//${h.authority}${h.path}`)
            : h.path.charCodeAt(0) === 47 &&
              ((h.path.charCodeAt(1) >= 65 && h.path.charCodeAt(1) <= 90) ||
                (h.path.charCodeAt(1) >= 97 && h.path.charCodeAt(1) <= 122)) &&
              h.path.charCodeAt(2) === 58
            ? d
              ? (o = h.path.substr(1))
              : (o = h.path[1].toLowerCase() + h.path.substr(2))
            : (o = h.path),
          M.isWindows && (o = o.replace(/\//g, '\\')),
          o
        );
      }
      n.uriToFsPath = N;
      function w(h, d) {
        const o = d ? L : E;
        let v = '',
          { scheme: A, authority: y, path: D, query: k, fragment: B } = h;
        if (
          (A && ((v += A), (v += ':')),
          (y || A === 'file') && ((v += e), (v += e)),
          y)
        ) {
          let I = y.indexOf('@');
          if (I !== -1) {
            const U = y.substr(0, I);
            (y = y.substr(I + 1)),
              (I = U.lastIndexOf(':')),
              I === -1
                ? (v += o(U, !1, !1))
                : ((v += o(U.substr(0, I), !1, !1)),
                  (v += ':'),
                  (v += o(U.substr(I + 1), !1, !0))),
              (v += '@');
          }
          (y = y.toLowerCase()),
            (I = y.lastIndexOf(':')),
            I === -1
              ? (v += o(y, !1, !0))
              : ((v += o(y.substr(0, I), !1, !0)), (v += y.substr(I)));
        }
        if (D) {
          if (
            D.length >= 3 &&
            D.charCodeAt(0) === 47 &&
            D.charCodeAt(2) === 58
          ) {
            const I = D.charCodeAt(1);
            I >= 65 &&
              I <= 90 &&
              (D = `/${String.fromCharCode(I + 32)}:${D.substr(3)}`);
          } else if (D.length >= 2 && D.charCodeAt(1) === 58) {
            const I = D.charCodeAt(0);
            I >= 65 &&
              I <= 90 &&
              (D = `${String.fromCharCode(I + 32)}:${D.substr(2)}`);
          }
          v += o(D, !0, !1);
        }
        return (
          k && ((v += '?'), (v += o(k, !1, !1))),
          B && ((v += '#'), (v += d ? B : E(B, !1, !1))),
          v
        );
      }
      function c(h) {
        try {
          return decodeURIComponent(h);
        } catch {
          return h.length > 3 ? h.substr(0, 3) + c(h.substr(3)) : h;
        }
      }
      const r = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
      function l(h) {
        return h.match(r) ? h.replace(r, d => c(d)) : h;
      }
    }),
    Y(X[60], J([0, 1, 4, 9, 11, 12, 8, 5]), function (x, n, R, M, i, u, _, S) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.create =
          n.SimpleWorkerServer =
          n.SimpleWorkerClient =
          n.logOnceWebWorkerWarning =
            void 0);
      const a = '$initialize';
      let s = !1;
      function p(l) {
        _.isWeb &&
          (s ||
            ((s = !0),
            console.warn(
              'Could not create web worker(s). Falling back to loading web worker code in main thread, which might cause UI freezes. Please see https://github.com/microsoft/monaco-editor#faq',
            )),
          console.warn(l.message));
      }
      n.logOnceWebWorkerWarning = p;
      class e {
        constructor(h, d, o, v) {
          (this.vsWorker = h),
            (this.req = d),
            (this.method = o),
            (this.args = v),
            (this.type = 0);
        }
      }
      class f {
        constructor(h, d, o, v) {
          (this.vsWorker = h),
            (this.seq = d),
            (this.res = o),
            (this.err = v),
            (this.type = 1);
        }
      }
      class g {
        constructor(h, d, o, v) {
          (this.vsWorker = h),
            (this.req = d),
            (this.eventName = o),
            (this.arg = v),
            (this.type = 2);
        }
      }
      class b {
        constructor(h, d, o) {
          (this.vsWorker = h),
            (this.req = d),
            (this.event = o),
            (this.type = 3);
        }
      }
      class m {
        constructor(h, d) {
          (this.vsWorker = h), (this.req = d), (this.type = 4);
        }
      }
      class C {
        constructor(h) {
          (this._workerId = -1),
            (this._handler = h),
            (this._lastSentReq = 0),
            (this._pendingReplies = Object.create(null)),
            (this._pendingEmitters = new Map()),
            (this._pendingEvents = new Map());
        }
        setWorkerId(h) {
          this._workerId = h;
        }
        sendMessage(h, d) {
          const o = String(++this._lastSentReq);
          return new Promise((v, A) => {
            (this._pendingReplies[o] = { resolve: v, reject: A }),
              this._send(new e(this._workerId, o, h, d));
          });
        }
        listen(h, d) {
          let o = null;
          const v = new M.Emitter({
            onWillAddFirstListener: () => {
              (o = String(++this._lastSentReq)),
                this._pendingEmitters.set(o, v),
                this._send(new g(this._workerId, o, h, d));
            },
            onDidRemoveLastListener: () => {
              this._pendingEmitters.delete(o),
                this._send(new m(this._workerId, o)),
                (o = null);
            },
          });
          return v.event;
        }
        handleMessage(h) {
          !h ||
            !h.vsWorker ||
            (this._workerId !== -1 && h.vsWorker !== this._workerId) ||
            this._handleMessage(h);
        }
        _handleMessage(h) {
          switch (h.type) {
            case 1:
              return this._handleReplyMessage(h);
            case 0:
              return this._handleRequestMessage(h);
            case 2:
              return this._handleSubscribeEventMessage(h);
            case 3:
              return this._handleEventMessage(h);
            case 4:
              return this._handleUnsubscribeEventMessage(h);
          }
        }
        _handleReplyMessage(h) {
          if (!this._pendingReplies[h.seq]) {
            console.warn('Got reply to unknown seq');
            return;
          }
          const d = this._pendingReplies[h.seq];
          if ((delete this._pendingReplies[h.seq], h.err)) {
            let o = h.err;
            h.err.$isError &&
              ((o = new Error()),
              (o.name = h.err.name),
              (o.message = h.err.message),
              (o.stack = h.err.stack)),
              d.reject(o);
            return;
          }
          d.resolve(h.res);
        }
        _handleRequestMessage(h) {
          const d = h.req;
          this._handler.handleMessage(h.method, h.args).then(
            v => {
              this._send(new f(this._workerId, d, v, void 0));
            },
            v => {
              v.detail instanceof Error &&
                (v.detail = (0, R.transformErrorForSerialization)(v.detail)),
                this._send(
                  new f(
                    this._workerId,
                    d,
                    void 0,
                    (0, R.transformErrorForSerialization)(v),
                  ),
                );
            },
          );
        }
        _handleSubscribeEventMessage(h) {
          const d = h.req,
            o = this._handler.handleEvent(
              h.eventName,
              h.arg,
            )(v => {
              this._send(new b(this._workerId, d, v));
            });
          this._pendingEvents.set(d, o);
        }
        _handleEventMessage(h) {
          if (!this._pendingEmitters.has(h.req)) {
            console.warn('Got event for unknown req');
            return;
          }
          this._pendingEmitters.get(h.req).fire(h.event);
        }
        _handleUnsubscribeEventMessage(h) {
          if (!this._pendingEvents.has(h.req)) {
            console.warn('Got unsubscribe for unknown req');
            return;
          }
          this._pendingEvents.get(h.req).dispose(),
            this._pendingEvents.delete(h.req);
        }
        _send(h) {
          const d = [];
          if (h.type === 0)
            for (let o = 0; o < h.args.length; o++)
              h.args[o] instanceof ArrayBuffer && d.push(h.args[o]);
          else h.type === 1 && h.res instanceof ArrayBuffer && d.push(h.res);
          this._handler.sendMessage(h, d);
        }
      }
      class E extends i.Disposable {
        constructor(h, d, o) {
          super();
          let v = null;
          (this._worker = this._register(
            h.create(
              'vs/base/common/worker/simpleWorker',
              I => {
                this._protocol.handleMessage(I);
              },
              I => {
                v?.(I);
              },
            ),
          )),
            (this._protocol = new C({
              sendMessage: (I, U) => {
                this._worker.postMessage(I, U);
              },
              handleMessage: (I, U) => {
                if (typeof o[I] != 'function')
                  return Promise.reject(
                    new Error('Missing method ' + I + ' on main thread host.'),
                  );
                try {
                  return Promise.resolve(o[I].apply(o, U));
                } catch (V) {
                  return Promise.reject(V);
                }
              },
              handleEvent: (I, U) => {
                if (N(I)) {
                  const V = o[I].call(o, U);
                  if (typeof V != 'function')
                    throw new Error(
                      `Missing dynamic event ${I} on main thread host.`,
                    );
                  return V;
                }
                if (L(I)) {
                  const V = o[I];
                  if (typeof V != 'function')
                    throw new Error(`Missing event ${I} on main thread host.`);
                  return V;
                }
                throw new Error(`Malformed event name ${I}`);
              },
            })),
            this._protocol.setWorkerId(this._worker.getId());
          let A = null;
          const y = globalThis.require;
          typeof y < 'u' && typeof y.getConfig == 'function'
            ? (A = y.getConfig())
            : typeof globalThis.requirejs < 'u' &&
              (A = globalThis.requirejs.s.contexts._.config);
          const D = (0, u.getAllMethodNames)(o);
          this._onModuleLoaded = this._protocol.sendMessage(a, [
            this._worker.getId(),
            JSON.parse(JSON.stringify(A)),
            d,
            D,
          ]);
          const k = (I, U) => this._request(I, U),
            B = (I, U) => this._protocol.listen(I, U);
          this._lazyProxy = new Promise((I, U) => {
            (v = U),
              this._onModuleLoaded.then(
                V => {
                  I(w(V, k, B));
                },
                V => {
                  U(V), this._onError('Worker failed to load ' + d, V);
                },
              );
          });
        }
        getProxyObject() {
          return this._lazyProxy;
        }
        _request(h, d) {
          return new Promise((o, v) => {
            this._onModuleLoaded.then(() => {
              this._protocol.sendMessage(h, d).then(o, v);
            }, v);
          });
        }
        _onError(h, d) {
          console.error(h), console.info(d);
        }
      }
      n.SimpleWorkerClient = E;
      function L(l) {
        return (
          l[0] === 'o' && l[1] === 'n' && S.isUpperAsciiLetter(l.charCodeAt(2))
        );
      }
      function N(l) {
        return /^onDynamic/.test(l) && S.isUpperAsciiLetter(l.charCodeAt(9));
      }
      function w(l, h, d) {
        const o = y =>
            function () {
              const D = Array.prototype.slice.call(arguments, 0);
              return h(y, D);
            },
          v = y =>
            function (D) {
              return d(y, D);
            },
          A = {};
        for (const y of l) {
          if (N(y)) {
            A[y] = v(y);
            continue;
          }
          if (L(y)) {
            A[y] = d(y, void 0);
            continue;
          }
          A[y] = o(y);
        }
        return A;
      }
      class c {
        constructor(h, d) {
          (this._requestHandlerFactory = d),
            (this._requestHandler = null),
            (this._protocol = new C({
              sendMessage: (o, v) => {
                h(o, v);
              },
              handleMessage: (o, v) => this._handleMessage(o, v),
              handleEvent: (o, v) => this._handleEvent(o, v),
            }));
        }
        onmessage(h) {
          this._protocol.handleMessage(h);
        }
        _handleMessage(h, d) {
          if (h === a) return this.initialize(d[0], d[1], d[2], d[3]);
          if (
            !this._requestHandler ||
            typeof this._requestHandler[h] != 'function'
          )
            return Promise.reject(
              new Error('Missing requestHandler or method: ' + h),
            );
          try {
            return Promise.resolve(
              this._requestHandler[h].apply(this._requestHandler, d),
            );
          } catch (o) {
            return Promise.reject(o);
          }
        }
        _handleEvent(h, d) {
          if (!this._requestHandler) throw new Error('Missing requestHandler');
          if (N(h)) {
            const o = this._requestHandler[h].call(this._requestHandler, d);
            if (typeof o != 'function')
              throw new Error(`Missing dynamic event ${h} on request handler.`);
            return o;
          }
          if (L(h)) {
            const o = this._requestHandler[h];
            if (typeof o != 'function')
              throw new Error(`Missing event ${h} on request handler.`);
            return o;
          }
          throw new Error(`Malformed event name ${h}`);
        }
        initialize(h, d, o, v) {
          this._protocol.setWorkerId(h);
          const D = w(
            v,
            (k, B) => this._protocol.sendMessage(k, B),
            (k, B) => this._protocol.listen(k, B),
          );
          return this._requestHandlerFactory
            ? ((this._requestHandler = this._requestHandlerFactory(D)),
              Promise.resolve((0, u.getAllMethodNames)(this._requestHandler)))
            : (d &&
                (typeof d.baseUrl < 'u' && delete d.baseUrl,
                typeof d.paths < 'u' &&
                  typeof d.paths.vs < 'u' &&
                  delete d.paths.vs,
                typeof d.trustedTypesPolicy !== void 0 &&
                  delete d.trustedTypesPolicy,
                (d.catchError = !0),
                globalThis.require.config(d)),
              new Promise((k, B) => {
                (globalThis.require || x)(
                  [o],
                  U => {
                    if (
                      ((this._requestHandler = U.create(D)),
                      !this._requestHandler)
                    ) {
                      B(new Error('No RequestHandler!'));
                      return;
                    }
                    k((0, u.getAllMethodNames)(this._requestHandler));
                  },
                  B,
                );
              }));
        }
      }
      n.SimpleWorkerServer = c;
      function r(l) {
        return new c(l, null);
      }
      n.create = r;
    }),
    Y(X[56], J([0, 1, 9, 11]), function (x, n, R, M) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.TokenizationRegistry = void 0);
      class i {
        constructor() {
          (this._tokenizationSupports = new Map()),
            (this._factories = new Map()),
            (this._onDidChange = new R.Emitter()),
            (this.onDidChange = this._onDidChange.event),
            (this._colorMap = null);
        }
        handleChange(S) {
          this._onDidChange.fire({ changedLanguages: S, changedColorMap: !1 });
        }
        register(S, a) {
          return (
            this._tokenizationSupports.set(S, a),
            this.handleChange([S]),
            (0, M.toDisposable)(() => {
              this._tokenizationSupports.get(S) === a &&
                (this._tokenizationSupports.delete(S), this.handleChange([S]));
            })
          );
        }
        get(S) {
          return this._tokenizationSupports.get(S) || null;
        }
        registerFactory(S, a) {
          var s;
          (s = this._factories.get(S)) === null || s === void 0 || s.dispose();
          const p = new u(this, S, a);
          return (
            this._factories.set(S, p),
            (0, M.toDisposable)(() => {
              const e = this._factories.get(S);
              !e || e !== p || (this._factories.delete(S), e.dispose());
            })
          );
        }
        getOrCreate(S) {
          return me(this, void 0, void 0, function* () {
            const a = this.get(S);
            if (a) return a;
            const s = this._factories.get(S);
            return !s || s.isResolved ? null : (yield s.resolve(), this.get(S));
          });
        }
        isResolved(S) {
          if (this.get(S)) return !0;
          const s = this._factories.get(S);
          return !!(!s || s.isResolved);
        }
        setColorMap(S) {
          (this._colorMap = S),
            this._onDidChange.fire({
              changedLanguages: Array.from(this._tokenizationSupports.keys()),
              changedColorMap: !0,
            });
        }
        getColorMap() {
          return this._colorMap;
        }
        getDefaultBackground() {
          return this._colorMap && this._colorMap.length > 2
            ? this._colorMap[2]
            : null;
        }
      }
      n.TokenizationRegistry = i;
      class u extends M.Disposable {
        get isResolved() {
          return this._isResolved;
        }
        constructor(S, a, s) {
          super(),
            (this._registry = S),
            (this._languageId = a),
            (this._factory = s),
            (this._isDisposed = !1),
            (this._resolvePromise = null),
            (this._isResolved = !1);
        }
        dispose() {
          (this._isDisposed = !0), super.dispose();
        }
        resolve() {
          return me(this, void 0, void 0, function* () {
            return (
              this._resolvePromise || (this._resolvePromise = this._create()),
              this._resolvePromise
            );
          });
        }
        _create() {
          return me(this, void 0, void 0, function* () {
            const S = yield this._factory.tokenizationSupport;
            (this._isResolved = !0),
              S &&
                !this._isDisposed &&
                this._register(this._registry.register(this._languageId, S));
          });
        }
      }
    }),
    Y(X[57], J([0, 1, 33, 14, 2, 56]), function (x, n, R, M, i, u) {
      'use strict';
      Object.defineProperty(n, '__esModule', { value: !0 }),
        (n.TokenizationRegistry =
          n.LazyTokenizationSupport =
          n.InlayHintKind =
          n.Command =
          n.FoldingRangeKind =
          n.SymbolKinds =
          n.isLocationLink =
          n.DocumentHighlightKind =
          n.SignatureHelpTriggerKind =
          n.SelectedSuggestionInfo =
          n.InlineCompletionTriggerKind =
          n.CompletionItemKinds =
          n.EncodedTokenizationResult =
          n.TokenizationResult =
          n.Token =
            void 0);
      class _ {
        constructor(c, r, l) {
          (this.offset = c),
            (this.type = r),
            (this.language = l),
            (this._tokenBrand = void 0);
        }
        toString() {
          return '(' + this.offset + ', ' + this.type + ')';
        }
      }
      n.Token = _;
      class S {
        constructor(c, r) {
          (this.tokens = c),
            (this.endState = r),
            (this._tokenizationResultBrand = void 0);
        }
      }
      n.TokenizationResult = S;
      class a {
        constructor(c, r) {
          (this.tokens = c),
            (this.endState = r),
            (this._encodedTokenizationResultBrand = void 0);
        }
      }
      n.EncodedTokenizationResult = a;
      var s;
      (function (w) {
        const c = new Map();
        c.set(0, R.Codicon.symbolMethod),
          c.set(1, R.Codicon.symbolFunction),
          c.set(2, R.Codicon.symbolConstructor),
          c.set(3, R.Codicon.symbolField),
          c.set(4, R.Codicon.symbolVariable),
          c.set(5, R.Codicon.symbolClass),
          c.set(6, R.Codicon.symbolStruct),
          c.set(7, R.Codicon.symbolInterface),
          c.set(8, R.Codicon.symbolModule),
          c.set(9, R.Codicon.symbolProperty),
          c.set(10, R.Codicon.symbolEvent),
          c.set(11, R.Codicon.symbolOperator),
          c.set(12, R.Codicon.symbolUnit),
          c.set(13, R.Codicon.symbolValue),
          c.set(15, R.Codicon.symbolEnum),
          c.set(14, R.Codicon.symbolConstant),
          c.set(15, R.Codicon.symbolEnum),
          c.set(16, R.Codicon.symbolEnumMember),
          c.set(17, R.Codicon.symbolKeyword),
          c.set(27, R.Codicon.symbolSnippet),
          c.set(18, R.Codicon.symbolText),
          c.set(19, R.Codicon.symbolColor),
          c.set(20, R.Codicon.symbolFile),
          c.set(21, R.Codicon.symbolReference),
          c.set(22, R.Codicon.symbolCustomColor),
          c.set(23, R.Codicon.symbolFolder),
          c.set(24, R.Codicon.symbolTypeParameter),
          c.set(25, R.Codicon.account),
          c.set(26, R.Codicon.issues);
        function r(d) {
          let o = c.get(d);
          return (
            o ||
              (console.info('No codicon found for CompletionItemKind ' + d),
              (o = R.Codicon.symbolProperty)),
            o
          );
        }
        w.toIcon = r;
        const l = new Map();
        l.set('method', 0),
          l.set('function', 1),
          l.set('constructor', 2),
          l.set('field', 3),
          l.set('variable', 4),
          l.set('class', 5),
          l.set('struct', 6),
          l.set('interface', 7),
          l.set('module', 8),
          l.set('property', 9),
          l.set('event', 10),
          l.set('operator', 11),
          l.set('unit', 12),
          l.set('value', 13),
          l.set('constant', 14),
          l.set('enum', 15),
          l.set('enum-member', 16),
          l.set('enumMember', 16),
          l.set('keyword', 17),
          l.set('snippet', 27),
          l.set('text', 18),
          l.set('color', 19),
          l.set('file', 20),
          l.set('reference', 21),
          l.set('customcolor', 22),
          l.set('folder', 23),
          l.set('type-parameter', 24),
          l.set('typeParameter', 24),
          l.set('account', 25),
          l.set('issue', 26);
        function h(d, o) {
          let v = l.get(d);
          return typeof v > 'u' && !o && (v = 9), v;
        }
        w.fromString = h;
      })(s || (n.CompletionItemKinds = s = {}));
      var p;
      (function (w) {
        (w[(w.Automatic = 0)] = 'Automatic'),
          (w[(w.Explicit = 1)] = 'Explicit');
      })(p || (n.InlineCompletionTriggerKind = p = {}));
      class e {
        constructor(c, r, l, h) {
          (this.range = c),
            (this.text = r),
            (this.completionKind = l),
            (this.isSnippetText = h);
        }
        equals(c) {
          return (
            i.Range.lift(this.range).equalsRange(c.range) &&
            this.text === c.text &&
            this.completionKind === c.completionKind &&
            this.isSnippetText === c.isSnippetText
          );
        }
      }
      n.SelectedSuggestionInfo = e;
      var f;
      (function (w) {
        (w[(w.Invoke = 1)] = 'Invoke'),
          (w[(w.TriggerCharacter = 2)] = 'TriggerCharacter'),
          (w[(w.ContentChange = 3)] = 'ContentChange');
      })(f || (n.SignatureHelpTriggerKind = f = {}));
      var g;
      (function (w) {
        (w[(w.Text = 0)] = 'Text'),
          (w[(w.Read = 1)] = 'Read'),
          (w[(w.Write = 2)] = 'Write');
      })(g || (n.DocumentHighlightKind = g = {}));
      function b(w) {
        return (
          w &&
          M.URI.isUri(w.uri) &&
          i.Range.isIRange(w.range) &&
          (i.Range.isIRange(w.originSelectionRange) ||
            i.Range.isIRange(w.targetSelectionRange))
        );
      }
      n.isLocationLink = b;
      var m;
      (function (w) {
        const c = new Map();
        c.set(0, R.Codicon.symbolFile),
          c.set(1, R.Codicon.symbolModule),
          c.set(2, R.Codicon.symbolNamespace),
          c.set(3, R.Codicon.symbolPackage),
          c.set(4, R.Codicon.symbolClass),
          c.set(5, R.Codicon.symbolMethod),
          c.set(6, R.Codicon.symbolProperty),
          c.set(7, R.Codicon.symbolField),
          c.set(8, R.Codicon.symbolConstructor),
          c.set(9, R.Codicon.symbolEnum),
          c.set(10, R.Codicon.symbolInterface),
          c.set(11, R.Codicon.symbolFunction),
          c.set(12, R.Codicon.symbolVariable),
          c.set(13, R.Codicon.symbolConstant),
          c.set(14, R.Codicon.symbolString),
          c.set(15, R.Codicon.symbolNumber),
          c.set(16, R.Codicon.symbolBoolean),
          c.set(17, R.Codicon.symbolArray),
          c.set(18, R.Codicon.symbolObject),
          c.set(19, R.Codicon.symbolKey),
          c.set(20, R.Codicon.symbolNull),
          c.set(21, R.Codicon.symbolEnumMember),
          c.set(22, R.Codicon.symbolStruct),
          c.set(23, R.Codicon.symbolEvent),
          c.set(24, R.Codicon.symbolOperator),
          c.set(25, R.Codicon.symbolTypeParameter);
        function r(l) {
          let h = c.get(l);
          return (
            h ||
              (console.info('No codicon found for SymbolKind ' + l),
              (h = R.Codicon.symbolProperty)),
            h
          );
        }
        w.toIcon = r;
      })(m || (n.SymbolKinds = m = {}));
      class C {
        static fromValue(c) {
          switch (c) {
            case 'comment':
              return C.Comment;
            case 'imports':
              return C.Imports;
            case 'region':
              return C.Region;
          }
          return new C(c);
        }
        constructor(c) {
          this.value = c;
        }
      }
      (n.FoldingRangeKind = C),
        (C.Comment = new C('comment')),
        (C.Imports = new C('imports')),
        (C.Region = new C('region'));
      var E;
      (function (w) {
        function c(r) {
          return !r || typeof r != 'object'
            ? !1
            : typeof r.id == 'string' && typeof r.title == 'string';
        }
        w.is = c;
      })(E || (n.Command = E = {}));
      var L;
      (function (w) {
        (w[(w.Type = 1)] = 'Type'), (w[(w.Parameter = 2)] = 'Parameter');
      })(L || (n.InlayHintKind = L = {}));
      class N {
        constructor(c) {
          (this.createSupport = c), (this._tokenizationSupport = null);
        }
        dispose() {
          this._tokenizationSupport &&
            this._tokenizationSupport.then(c => {
              c && c.dispose();
            });
        }
        get tokenizationSupport() {
          return (
            this._tokenizationSupport ||
              (this._tokenizationSupport = this.createSupport()),
            this._tokenizationSupport
          );
        }
      }
      (n.LazyTokenizationSupport = N),
        (n.TokenizationRegistry = new u.TokenizationRegistry());
    }),
    Y(
      X[58],
      J([0, 1, 55, 9, 30, 14, 3, 2, 34, 57, 51]),
      function (x, n, R, M, i, u, _, S, a, s, p) {
        'use strict';
        Object.defineProperty(n, '__esModule', { value: !0 }),
          (n.createMonacoBaseAPI = n.KeyMod = void 0);
        class e {
          static chord(b, m) {
            return (0, i.KeyChord)(b, m);
          }
        }
        (n.KeyMod = e),
          (e.CtrlCmd = 2048),
          (e.Shift = 1024),
          (e.Alt = 512),
          (e.WinCtrl = 256);
        function f() {
          return {
            editor: void 0,
            languages: void 0,
            CancellationTokenSource: R.CancellationTokenSource,
            Emitter: M.Emitter,
            KeyCode: p.KeyCode,
            KeyMod: e,
            Position: _.Position,
            Range: S.Range,
            Selection: a.Selection,
            SelectionDirection: p.SelectionDirection,
            MarkerSeverity: p.MarkerSeverity,
            MarkerTag: p.MarkerTag,
            Uri: u.URI,
            Token: s.Token,
          };
        }
        n.createMonacoBaseAPI = f;
      },
    ),
    Y(
      X[61],
      J([0, 1, 18, 14, 3, 2, 48, 22, 44, 45, 58, 24, 50, 42, 12, 43]),
      function (x, n, R, M, i, u, _, S, a, s, p, e, f, g, b, m) {
        'use strict';
        Object.defineProperty(n, '__esModule', { value: !0 }),
          (n.create = n.EditorSimpleWorker = void 0);
        class C extends _.MirrorTextModel {
          get uri() {
            return this._uri;
          }
          get eol() {
            return this._eol;
          }
          getValue() {
            return this.getText();
          }
          findMatches(w) {
            const c = [];
            for (let r = 0; r < this._lines.length; r++) {
              const l = this._lines[r],
                h = this.offsetAt(new i.Position(r + 1, 1)),
                d = l.matchAll(w);
              for (const o of d)
                (o.index || o.index === 0) && (o.index = o.index + h),
                  c.push(o);
            }
            return c;
          }
          getLinesContent() {
            return this._lines.slice(0);
          }
          getLineCount() {
            return this._lines.length;
          }
          getLineContent(w) {
            return this._lines[w - 1];
          }
          getWordAtPosition(w, c) {
            const r = (0, S.getWordAtText)(
              w.column,
              (0, S.ensureValidWordDefinition)(c),
              this._lines[w.lineNumber - 1],
              0,
            );
            return r
              ? new u.Range(
                  w.lineNumber,
                  r.startColumn,
                  w.lineNumber,
                  r.endColumn,
                )
              : null;
          }
          words(w) {
            const c = this._lines,
              r = this._wordenize.bind(this);
            let l = 0,
              h = '',
              d = 0,
              o = [];
            return {
              *[Symbol.iterator]() {
                for (;;)
                  if (d < o.length) {
                    const v = h.substring(o[d].start, o[d].end);
                    (d += 1), yield v;
                  } else if (l < c.length)
                    (h = c[l]), (o = r(h, w)), (d = 0), (l += 1);
                  else break;
              },
            };
          }
          getLineWords(w, c) {
            const r = this._lines[w - 1],
              l = this._wordenize(r, c),
              h = [];
            for (const d of l)
              h.push({
                word: r.substring(d.start, d.end),
                startColumn: d.start + 1,
                endColumn: d.end + 1,
              });
            return h;
          }
          _wordenize(w, c) {
            const r = [];
            let l;
            for (c.lastIndex = 0; (l = c.exec(w)) && l[0].length !== 0; )
              r.push({ start: l.index, end: l.index + l[0].length });
            return r;
          }
          getValueInRange(w) {
            if (
              ((w = this._validateRange(w)),
              w.startLineNumber === w.endLineNumber)
            )
              return this._lines[w.startLineNumber - 1].substring(
                w.startColumn - 1,
                w.endColumn - 1,
              );
            const c = this._eol,
              r = w.startLineNumber - 1,
              l = w.endLineNumber - 1,
              h = [];
            h.push(this._lines[r].substring(w.startColumn - 1));
            for (let d = r + 1; d < l; d++) h.push(this._lines[d]);
            return (
              h.push(this._lines[l].substring(0, w.endColumn - 1)), h.join(c)
            );
          }
          offsetAt(w) {
            return (
              (w = this._validatePosition(w)),
              this._ensureLineStarts(),
              this._lineStarts.getPrefixSum(w.lineNumber - 2) + (w.column - 1)
            );
          }
          positionAt(w) {
            (w = Math.floor(w)), (w = Math.max(0, w)), this._ensureLineStarts();
            const c = this._lineStarts.getIndexOf(w),
              r = this._lines[c.index].length;
            return {
              lineNumber: 1 + c.index,
              column: 1 + Math.min(c.remainder, r),
            };
          }
          _validateRange(w) {
            const c = this._validatePosition({
                lineNumber: w.startLineNumber,
                column: w.startColumn,
              }),
              r = this._validatePosition({
                lineNumber: w.endLineNumber,
                column: w.endColumn,
              });
            return c.lineNumber !== w.startLineNumber ||
              c.column !== w.startColumn ||
              r.lineNumber !== w.endLineNumber ||
              r.column !== w.endColumn
              ? {
                  startLineNumber: c.lineNumber,
                  startColumn: c.column,
                  endLineNumber: r.lineNumber,
                  endColumn: r.column,
                }
              : w;
          }
          _validatePosition(w) {
            if (!i.Position.isIPosition(w)) throw new Error('bad position');
            let { lineNumber: c, column: r } = w,
              l = !1;
            if (c < 1) (c = 1), (r = 1), (l = !0);
            else if (c > this._lines.length)
              (c = this._lines.length),
                (r = this._lines[c - 1].length + 1),
                (l = !0);
            else {
              const h = this._lines[c - 1].length + 1;
              r < 1 ? ((r = 1), (l = !0)) : r > h && ((r = h), (l = !0));
            }
            return l ? { lineNumber: c, column: r } : w;
          }
        }
        class E {
          constructor(w, c) {
            (this._host = w),
              (this._models = Object.create(null)),
              (this._foreignModuleFactory = c),
              (this._foreignModule = null);
          }
          dispose() {
            this._models = Object.create(null);
          }
          _getModel(w) {
            return this._models[w];
          }
          _getModels() {
            const w = [];
            return (
              Object.keys(this._models).forEach(c => w.push(this._models[c])), w
            );
          }
          acceptNewModel(w) {
            this._models[w.url] = new C(
              M.URI.parse(w.url),
              w.lines,
              w.EOL,
              w.versionId,
            );
          }
          acceptModelChanged(w, c) {
            if (!this._models[w]) return;
            this._models[w].onEvents(c);
          }
          acceptRemovedModel(w) {
            this._models[w] && delete this._models[w];
          }
          computeUnicodeHighlights(w, c, r) {
            return me(this, void 0, void 0, function* () {
              const l = this._getModel(w);
              return l
                ? f.UnicodeTextModelHighlighter.computeUnicodeHighlights(
                    l,
                    c,
                    r,
                  )
                : {
                    ranges: [],
                    hasMore: !1,
                    ambiguousCharacterCount: 0,
                    invisibleCharacterCount: 0,
                    nonBasicAsciiCharacterCount: 0,
                  };
            });
          }
          computeDiff(w, c, r, l) {
            return me(this, void 0, void 0, function* () {
              const h = this._getModel(w),
                d = this._getModel(c);
              return !h || !d ? null : E.computeDiff(h, d, r, l);
            });
          }
          static computeDiff(w, c, r, l) {
            const h =
                l === 'advanced'
                  ? g.linesDiffComputers.advanced
                  : g.linesDiffComputers.legacy,
              d = w.getLinesContent(),
              o = c.getLinesContent(),
              v = h.computeDiff(d, o, r);
            return {
              identical:
                v.changes.length > 0 ? !1 : this._modelsAreIdentical(w, c),
              quitEarly: v.hitTimeout,
              changes: v.changes.map(y => {
                var D;
                return [
                  y.originalRange.startLineNumber,
                  y.originalRange.endLineNumberExclusive,
                  y.modifiedRange.startLineNumber,
                  y.modifiedRange.endLineNumberExclusive,
                  (D = y.innerChanges) === null || D === void 0
                    ? void 0
                    : D.map(k => [
                        k.originalRange.startLineNumber,
                        k.originalRange.startColumn,
                        k.originalRange.endLineNumber,
                        k.originalRange.endColumn,
                        k.modifiedRange.startLineNumber,
                        k.modifiedRange.startColumn,
                        k.modifiedRange.endLineNumber,
                        k.modifiedRange.endColumn,
                      ]),
                ];
              }),
            };
          }
          static _modelsAreIdentical(w, c) {
            const r = w.getLineCount(),
              l = c.getLineCount();
            if (r !== l) return !1;
            for (let h = 1; h <= r; h++) {
              const d = w.getLineContent(h),
                o = c.getLineContent(h);
              if (d !== o) return !1;
            }
            return !0;
          }
          computeMoreMinimalEdits(w, c, r) {
            return me(this, void 0, void 0, function* () {
              const l = this._getModel(w);
              if (!l) return c;
              const h = [];
              let d;
              c = c.slice(0).sort((o, v) => {
                if (o.range && v.range)
                  return u.Range.compareRangesUsingStarts(o.range, v.range);
                const A = o.range ? 0 : 1,
                  y = v.range ? 0 : 1;
                return A - y;
              });
              for (let { range: o, text: v, eol: A } of c) {
                if ((typeof A == 'number' && (d = A), u.Range.isEmpty(o) && !v))
                  continue;
                const y = l.getValueInRange(o);
                if (((v = v.replace(/\r\n|\n|\r/g, l.eol)), y === v)) continue;
                if (Math.max(v.length, y.length) > E._diffLimit) {
                  h.push({ range: o, text: v });
                  continue;
                }
                const D = (0, R.stringDiff)(y, v, r),
                  k = l.offsetAt(u.Range.lift(o).getStartPosition());
                for (const B of D) {
                  const I = l.positionAt(k + B.originalStart),
                    U = l.positionAt(k + B.originalStart + B.originalLength),
                    V = {
                      text: v.substr(B.modifiedStart, B.modifiedLength),
                      range: {
                        startLineNumber: I.lineNumber,
                        startColumn: I.column,
                        endLineNumber: U.lineNumber,
                        endColumn: U.column,
                      },
                    };
                  l.getValueInRange(V.range) !== V.text && h.push(V);
                }
              }
              return (
                typeof d == 'number' &&
                  h.push({
                    eol: d,
                    text: '',
                    range: {
                      startLineNumber: 0,
                      startColumn: 0,
                      endLineNumber: 0,
                      endColumn: 0,
                    },
                  }),
                h
              );
            });
          }
          computeLinks(w) {
            return me(this, void 0, void 0, function* () {
              const c = this._getModel(w);
              return c ? (0, a.computeLinks)(c) : null;
            });
          }
          computeDefaultDocumentColors(w) {
            return me(this, void 0, void 0, function* () {
              const c = this._getModel(w);
              return c ? (0, m.computeDefaultDocumentColors)(c) : null;
            });
          }
          textualSuggest(w, c, r, l) {
            return me(this, void 0, void 0, function* () {
              const h = new e.StopWatch(!0),
                d = new RegExp(r, l),
                o = new Set();
              e: for (const v of w) {
                const A = this._getModel(v);
                if (A) {
                  for (const y of A.words(d))
                    if (
                      !(y === c || !isNaN(Number(y))) &&
                      (o.add(y), o.size > E._suggestionsLimit)
                    )
                      break e;
                }
              }
              return { words: Array.from(o), duration: h.elapsed() };
            });
          }
          computeWordRanges(w, c, r, l) {
            return me(this, void 0, void 0, function* () {
              const h = this._getModel(w);
              if (!h) return Object.create(null);
              const d = new RegExp(r, l),
                o = Object.create(null);
              for (let v = c.startLineNumber; v < c.endLineNumber; v++) {
                const A = h.getLineWords(v, d);
                for (const y of A) {
                  if (!isNaN(Number(y.word))) continue;
                  let D = o[y.word];
                  D || ((D = []), (o[y.word] = D)),
                    D.push({
                      startLineNumber: v,
                      startColumn: y.startColumn,
                      endLineNumber: v,
                      endColumn: y.endColumn,
                    });
                }
              }
              return o;
            });
          }
          navigateValueSet(w, c, r, l, h) {
            return me(this, void 0, void 0, function* () {
              const d = this._getModel(w);
              if (!d) return null;
              const o = new RegExp(l, h);
              c.startColumn === c.endColumn &&
                (c = {
                  startLineNumber: c.startLineNumber,
                  startColumn: c.startColumn,
                  endLineNumber: c.endLineNumber,
                  endColumn: c.endColumn + 1,
                });
              const v = d.getValueInRange(c),
                A = d.getWordAtPosition(
                  { lineNumber: c.startLineNumber, column: c.startColumn },
                  o,
                );
              if (!A) return null;
              const y = d.getValueInRange(A);
              return s.BasicInplaceReplace.INSTANCE.navigateValueSet(
                c,
                v,
                A,
                y,
                r,
              );
            });
          }
          loadForeignModule(w, c, r) {
            const l = (o, v) => this._host.fhr(o, v),
              d = {
                host: (0, b.createProxyObject)(r, l),
                getMirrorModels: () => this._getModels(),
              };
            return this._foreignModuleFactory
              ? ((this._foreignModule = this._foreignModuleFactory(d, c)),
                Promise.resolve((0, b.getAllMethodNames)(this._foreignModule)))
              : new Promise((o, v) => {
                  x(
                    [w],
                    A => {
                      (this._foreignModule = A.create(d, c)),
                        o((0, b.getAllMethodNames)(this._foreignModule));
                    },
                    v,
                  );
                });
          }
          fmr(w, c) {
            if (
              !this._foreignModule ||
              typeof this._foreignModule[w] != 'function'
            )
              return Promise.reject(
                new Error('Missing requestHandler or method: ' + w),
              );
            try {
              return Promise.resolve(
                this._foreignModule[w].apply(this._foreignModule, c),
              );
            } catch (r) {
              return Promise.reject(r);
            }
          }
        }
        (n.EditorSimpleWorker = E),
          (E._diffLimit = 1e5),
          (E._suggestionsLimit = 1e4);
        function L(N) {
          return new E(N, null);
        }
        (n.create = L),
          typeof importScripts == 'function' &&
            (globalThis.monaco = (0, p.createMonacoBaseAPI)());
      },
    );
}.call(this));
