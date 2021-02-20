const _export = {};
(function() {
  const t =
      "function" == typeof Promise
        ? Promise.prototype.then.bind(Promise.resolve())
        : setTimeout,
    e = "keys" in Object;
  let n;
  function o(t, e, n, o = !1) {
    const r = [],
      l = (t, e) => {
        for (const s of t)
          Array.isArray(s) && e > 0
            ? l(s, e - 1)
            : (o && null == s) || r.push(n ? n(s) : s);
      };
    return l(t, Math.floor(e) || 1), r;
  }
  n = e
    ? (t, e) => {
        for (const n of Object.keys(e)) t[n] = e[n];
        return t;
      }
    : (t, e) => {
        for (const n in e) t[n] = e[n];
        return t;
      };
  const r = {},
    l = [],
    s = {
      setAttribute: (t, e, n) =>
        e in t
          ? (t[e] = null == n ? "" : n)
          : null == n
          ? t.removeAttribute(e)
          : t.setAttribute(e, n)
    },
    i = t => "o" === t[0] && "n" === t[1];
  function u(t, e) {
    if (null == e) return;
    let n, o, r;
    (o = null != (n = e._vNode)) && (r = e._vNode._nextDomNode),
      (e.parentNode !== t || n._reorder) &&
        (null != r ? t.insertBefore(e, r) : n._reorder || t.appendChild(e));
    const l = e.previousSibling,
      s = e.nextSibling;
    if (l != s) {
      if (null != l) {
        const t = l._vNode;
        null != t && t._nextDomNode !== e && p(t, e, "_nextDomNode");
      }
      if (null != s) {
        const t = s._vNode;
        null != t && t._nextDomNode !== e && p(t, e, "_prevDomNode");
      }
      o && ((n._prevDomNode = l), (n._nextDomNode = s));
    }
  }
  function p(t, e, n) {
    null != t && ((t[n] = e), p(t._prevVnode, e, n));
  }
  function c(t, e, ...r) {
    if (null == t || "boolean" == typeof t) return null;
    (e = null == e ? {} : n({}, e)),
      r.length && ((r = o(r, Infinity)), (e.children = r));
    const l = e.ref;
    l && delete e.ref;
    const s = e.key;
    s && delete e.key;
    const u = {};
    for (const t in e) i(t) && (u[t.substr(2).toLowerCase()] = e[t]);
    return d(t, e, u, s, l);
  }
  function a() {}
  function d(t, e, n, o, r) {
    const l = {
      type: t,
      props: e,
      events: n,
      key: o,
      _reorder: !1,
      ref: r,
      _children: null,
      _dom: null,
      _component: null,
      __uAttr: null,
      _nextDomNode: null,
      _prevDomNode: null,
      _prevVnode: null
    };
    return (l.__uAttr = l);
  }
  function m(t) {
    if (null == t || "boolean" == typeof t) return null;
    if ("string" == typeof t || "number" == typeof t) return d(null, String(t));
    if (Array.isArray(t)) return c(a, null, t);
    if (null != t._dom) {
      const e = d(t.type, t.props, t.events, t.key, null);
      return (e._dom = t._dom), e;
    }
    return t;
  }
  const _ = (t, e, ...n) => {
    if (((t.__currentLifeCycle = e), null != t[e]))
      try {
        t[e](...n);
      } catch (e) {
        if (null == t.componentDidCatch) throw e;
        t.componentDidCatch(e);
      }
  };
  function f(t, e, ...n) {
    t && (t = _(t, e, ...n));
  }
  function h(t) {
    if (t === r || null == t) return;
    t._prevVnode && h(t._prevVnode);
    const e = t._dom,
      n = t._component;
    if (
      (f(n, "componentWillUnmount", !0),
      null != n && (n.base = n._vnode = null),
      e)
    ) {
      if (null != t) {
        null != t._nextDomNode &&
          p(t._nextDomNode._vNode, null, "_prevDomNode"),
          null != t._prevDomNode &&
            p(t._prevDomNode._vNode, null, "_nextDomNode");
        for (const e of t._children || l) h(e);
        t._prevVnode = t._component = t._dom = t._prevDomNode = t._nextDomNode = null;
      }
      if (Array.isArray(e)) {
        let e;
        for (; (e = t._children.pop()); ) y(e);
      } else y(e);
      e.onclick = e._component = e._listeners = e._prevVnode = e._vNode = null;
    }
  }
  function y(t) {
    const e = t.parentNode;
    e && e.removeChild(t);
  }
  function v(t) {
    let e;
    for (; (e = t.pop()); ) f(e, "componentDidMount"), (e._didMount = !0);
  }
  function b(t, e, n, o) {
    let l;
    const s = t.type;
    if (o)
      "string" == typeof t.props
        ? (l = document.createTextNode(t.props))
        : g((l = document.createElement(s)), t, r);
    else {
      if (s !== e.type) return b(t, null, null, !0);
      if (((l = n), n instanceof Text)) {
        const e = t.props;
        n.nodeValue !== e && (n.nodeValue = e);
      } else g(l, t, e);
    }
    return null != t._prevVnode && (t._prevVnode._dom = l), l;
  }
  const x = t => "key" !== t && "children" !== t;
  function g(t, e, n) {
    if (t instanceof Text) return;
    const o = e.props,
      l = t.attributes,
      u = e.events,
      p = null != n ? n.events : r;
    for (let e = 0; e < l.length; e++) {
      const n = l[e].name;
      n in o || s.setAttribute(t, n, null);
    }
    for (let e in o) {
      if (i(e) || !x(e)) continue;
      let n = o[e];
      const u = e in t ? t[e] : (l[e] || r).value;
      if (
        ("className" === (e = "class" === e ? "className" : e) &&
          Array.isArray(n) &&
          (n = n.join(" ")),
        "style" !== e)
      )
        u !== n && s.setAttribute(t, e, n);
      else {
        const e = t.style;
        if ("string" == typeof n) e.cssText = n;
        else {
          "string" == typeof u ? (e.cssText = "") : u && (u.cssText = "");
          for (const t in n) {
            const o = n[t];
            (u && o === u[t]) || (e[t] = o);
          }
        }
      }
    }
    !(function(t, e, n) {
      if (t != e) {
        null == n._listeners && ((n._listeners = {}), (n.onclick = a)),
          null == e && (e = r),
          null == t && (t = r);
        for (const o in t) {
          const r = t[o];
          e[o] !== r &&
            null != r &&
            (n.addEventListener(o, C), (n._listeners[o] = r));
        }
        for (const o in e)
          null == t[o] && (delete n._listeners[o], n.removeEventListener(o, C));
      }
    })(u, p, t);
  }
  function C(t) {
    return this._listeners[t.type](t);
  }
  function N(t, e, n, o, r, l, s) {
    const i = t._children.length,
      p = e.length,
      c = [];
    for (let a = 0; a < Math.max(i, p); a++) {
      const i = t._children[a];
      let p,
        d = e[a];
      if (null == i) {
        null != d && h(d);
        continue;
      }
      if (null == d && null != (p = e[a + 1])) {
        const t = Array.isArray(p._dom) ? p._dom[0] : p._dom;
        i._nextDomNode = t;
      }
      const m = k(n, i, d, o, r, l, s);
      if (Array.isArray(m)) for (const t of m) u(n, t), c.push(t);
      else u(n, m), c.push(m);
    }
    return c;
  }
  const D = [];
  class S {
    constructor(t, e) {
      (this.props = t), (this.context = e);
    }
    render(t, e) {}
    setState(e) {
      const o =
        "function" == typeof e ? (e = e(this._nextState, this.props)) : e;
      var l;
      null != o &&
        ((this._nextState = n({}, this.state || r)),
        (this._oldState = n({}, this._nextState)),
        n(this._nextState, o),
        ((l = this)._dirty = !0),
        1 === D.push(l) &&
          (null != window.requestAnimationFrame
            ? window.requestAnimationFrame(A)
            : t(A)),
        n(this.state, this._nextState || r));
    }
    forceUpdate(t) {
      const e = this.parentDom,
        n = [];
      if (e) {
        const o = this._vnode;
        (this.base = k(e, o, o, this.context, n, this, !1 !== t)),
          this.base instanceof Node && !this.base.parentNode && u(e, this.base);
      }
      t && t(), v(n);
    }
  }
  function A() {
    let t;
    for (D.sort((t, e) => t._depth - e._depth); (t = D.pop()); )
      (t._nextState = null), (t._dirty = !1), t.forceUpdate(!1);
  }
  function P(t, e, n) {
    return this.constructor(t, n);
  }
  function k(t, e, s, i, u, p, c) {
    if (
      ("boolean" == typeof e && (e = null),
      null != s &&
        null != e &&
        null == e._nextDomNode &&
        (e._nextDomNode = s._nextDomNode),
      null == s || null == e || s.type !== e.type || s.key !== e.key)
    ) {
      if ((null != s && s !== r && h(s), null == e)) return null;
      s = r;
    }
    const d = s === r;
    if (e.__uAttr !== e)
      return console.warn("component not of expected type =>", e), null;
    e._children = o((e.props && e.props.children) || [], Infinity, m);
    const _ = e.type;
    if (_ === a || s.type === a)
      return N(e, d ? l : s._children || l, t, i, u, p, c);
    if ("function" == typeof _) {
      let o, l;
      if (
        ((o = (function(t, e, o, l, s, i, u) {
          let p, c, a;
          const d = t.type;
          if (e._component) {
            if (
              (((p = t._component = e._component).base = t._dom = e._dom),
              (p.props = t.props),
              (p.context = s),
              (a = !1),
              !i)
            )
              if (
                null != p.shouldComponentUpdate &&
                !1 !== p.shouldComponentUpdate(t.props, p.state)
              );
              else if (null != p.shouldComponentUpdate) return r;
          } else
            (a = !0),
              d.prototype && d.prototype.render
                ? ((p = t._component = new d(t.props, s)), l.push(p))
                : ((p = new S(t.props, s)),
                  (t._component = null),
                  (p.constructor = d),
                  (p.render = P));
          return (
            (p.parentDom = o),
            null == p.state && (p.state = {}),
            (p._nextState = n({}, p.state)),
            null != d.getDerivedStateFromProps &&
              (n(
                p._nextState,
                d.getDerivedStateFromProps(t.props, p._nextState) || r
              ),
              n(p._oldState || (p._oldState = {}), p._nextState)),
            a
              ? f(p, "componentWillMount")
              : f(p, "componentWillUpdate", t.props, p._nextState, s),
            (p.state = p._nextState),
            (c = p._prevVnode = m(p.render(t.props, p.state))) &&
              ((c._dom = t._dom), (c._reorder = t._reorder)),
            (p._depth = u ? 1 + ~~u._depth : 0),
            c
          );
        })(e, s, t, u, i, c, p)),
        null != e._component && (e._component._vnode = e),
        o === r)
      )
        return null;
      if (
        ((l = e._dom = k(
          t,
          o,
          "_prevVnode" in s ? s._prevVnode : s,
          i,
          u,
          e._component,
          c
        )),
        null == o)
      )
        return;
      return (
        o && (o._dom = l),
        null != e._component && (e._component.base = e._dom),
        f(
          e._component,
          "componentDidUpdate",
          s.props,
          (s._component || r)._oldState
        ),
        null != s._component && delete s._component._oldState,
        (e._prevVnode = o),
        null != e._dom && (e._dom._vNode = e),
        e._dom
      );
    }
    return (
      (e._dom = d ? b(e, null, null, !0) : b(e, s, s._dom, !1)),
      null != p && (p.base = e._dom),
      (e._dom._vNode = e),
      N(e, d ? l : s._children || l, e._dom, i, u, e._component, c),
      e._dom
    );
  }
  function w(t, e) {
    const n = c(a, null, [t]),
      o = [],
      r = e._oldVnode;
    (e._oldVnode = t),
      k(e, n, r, {}, o, null == r ? null : r._component, !1),
      v(o);
  }
  class V extends S {
    constructor(t, e) {
      const { componentPromise: n, fallbackComponent: o, ...r } = t;
      super(r, e),
        (this.state = {
          ready: !1,
          componentPromise: n,
          finalComponent: null,
          fallbackComponent: o
        });
    }
    static getDerivedStateFromProps(t, e) {
      const n = e || {};
      return n.componentPromise === t.componentPromise
        ? n
        : (null != t.componentPromise &&
            ((n.componentPromise = t.componentPromise),
            (n.ready = !1),
            (n.finalComponent = null)),
          n);
    }
    render(
      { eager: t = !0, loadComponent: e = !1, ...n },
      { ready: o, finalComponent: r }
    ) {
      if (((!t && !e) || o || this.loadComponent(), o)) return c(r, n);
      const { ...l } = n;
      return null != this.state.fallbackComponent
        ? c(this.state.fallbackComponent, l)
        : U;
    }
    loadComponent() {
      return this.state.componentPromise().then(t => {
        this.setState({ ready: !0, finalComponent: t });
      });
    }
  }
  const U = c("div", null, "Loading.."),
    L = [],
    T = {
      subscribe(t) {
        L.includes(t) || L.push(t);
      },
      unsubscribe(t) {
        for (let e = 0; e < L.length; e++)
          if (L[e] === t) return L.splice(e, 1);
      },
      emit(t, e) {
        for (const n of L) n(t, e);
      },
      unsubscribeAll() {
        L.length = 0;
      }
    };
  function F(t) {
    window.history.pushState(r, document.title, t),
      T.emit(t, { type: "load", native: !1 });
  }
  function E(t) {
    window.history.replaceState(r, document.title, t),
      T.emit(t, { type: "redirect", native: !1 });
  }
  class M extends S {
    componentWillMount() {
      T.subscribe(this._routeChangeHandler),
        window.addEventListener("popstate", T.emit);
    }
    componentWillUnmount() {
      window.removeEventListener("popstate", T.emit),
        this.props.destroySubscriptionOnUnmount && T.unsubscribeAll();
    }
    absolute(t) {
      return new URL(
        t || "",
        `${location.protocol}//${location.host}`
      ).toString();
    }
    getCurrentComponent() {
      return this.getPathComponent(M.getPath) || [];
    }
    _routeChangeHandler() {
      const [t, e] = this.getCurrentComponent();
      (this.component = this.match = null),
        this.setState({ component: t, match: e });
    }
    _notFoundComponent() {
      return c(
        "div",
        null,
        `The Requested URL "${this.absolute(M.getPath)}" was not found`
      );
    }
    static get getPath() {
      return location.pathname;
    }
    static get getQs() {
      return location.search;
    }
    getPathComponent(t) {
      for (const e of this.state.routes) {
        const { regex: n, component: o } = e,
          r = n.exec(t);
        if (r) return [o, r];
      }
      return [];
    }
    initComponents(t) {
      for (const e of t)
        null != e.props &&
          null != e.props.path &&
          this.state.routes.push({ regex: e.props.path, component: e });
    }
    constructor(t, e) {
      let { children: n, fallbackComponent: o, ...r } = t;
      super(r, e),
        (o = o || this._notFoundComponent.bind(this)),
        (this.state = { routes: [], fallbackComponent: o }),
        this.initComponents(n);
      const [l, s] = this.getCurrentComponent();
      (this.component = l),
        (this.match = s),
        (this._routeChangeHandler = this._routeChangeHandler.bind(this));
    }
    render() {
      let t;
      return (
        (t =
          null != this.state.component && null != this.state.match
            ? this.state.component
            : this.component
            ? this.component
            : c(this.state.fallbackComponent, this.props)).__uAttr ||
          (t = c(t, { match: this.state.match, ...this.props })),
        c(a, null, t)
      );
    }
  }
  function W(t) {
    const { native: e, href: n, onClick: o, ...r } = t,
      l = r;
    return (
      (l.href = n),
      e ||
        null == n ||
        (l.onClick = e =>
          (function(t, e, n) {
            t.altKey ||
              t.ctrlKey ||
              t.metaKey ||
              t.shiftKey ||
              (t.stopImmediatePropagation && t.stopImmediatePropagation(),
              t.stopPropagation && t.stopPropagation(),
              t.preventDefault(),
              F(e),
              null != n && n(t, e));
          })(e, t.href, o)),
      c("a", l)
    );
  }
  function $(t) {
    return RegExp(`^${t}(/?)$`);
  }
  !(function() {
    var n = function(t, e, u, r) {
        for (var o = 1; o < e.length; o++) {
          var s = e[o],
            f = "number" == typeof s ? u[s] : s,
            p = e[++o];
          1 === p
            ? (r[0] = f)
            : 3 === p
            ? (r[1] = Object.assign(r[1] || {}, f))
            : 5 === p
            ? ((r[1] = r[1] || {})[e[++o]] = f)
            : 6 === p
            ? (r[1][e[++o]] += f + "")
            : r.push(p ? t.apply(null, n(t, f, u, ["", null])) : f);
        }
        return r;
      },
      t = function(n) {
        for (
          var t,
            e,
            u = 1,
            r = "",
            o = "",
            s = [0],
            f = function(n) {
              1 === u && (n || (r = r.replace(/^\s*\n\s*|\s*\n\s*$/g, "")))
                ? s.push(n || r, 0)
                : 3 === u && (n || r)
                ? (s.push(n || r, 1), (u = 2))
                : 2 === u && "..." === r && n
                ? s.push(n, 3)
                : 2 === u && r && !n
                ? s.push(!0, 5, r)
                : u >= 5 &&
                  ((r || (!n && 5 === u)) && (s.push(r, u, e), (u = 6)),
                  n && (s.push(n, u, e), (u = 6))),
                (r = "");
            },
            p = 0;
          p < n.length;
          p++
        ) {
          p && (1 === u && f(), f(p));
          for (var h = 0; h < n[p].length; h++)
            (t = n[p][h]),
              1 === u
                ? "<" === t
                  ? (f(), (s = [s]), (u = 3))
                  : (r += t)
                : 4 === u
                ? "--" === r && ">" === t
                  ? ((u = 1), (r = ""))
                  : (r = t + r[0])
                : o
                ? t === o
                  ? (o = "")
                  : (r += t)
                : '"' === t || "'" === t
                ? (o = t)
                : ">" === t
                ? (f(), (u = 1))
                : u &&
                  ("=" === t
                    ? ((u = 5), (e = r), (r = ""))
                    : "/" === t && (u < 5 || ">" === n[p][h + 1])
                    ? (f(),
                      3 === u && (s = s[0]),
                      (u = s),
                      (s = s[0]).push(u, 2),
                      (u = 0))
                    : " " === t || "\t" === t || "\n" === t || "\r" === t
                    ? (f(), (u = 2))
                    : (r += t)),
              3 === u && "!--" === r && ((u = 4), (s = s[0]));
        }
        return f(), s;
      },
      e = "function" == typeof Map,
      u = e ? new Map() : {},
      r = e
        ? function(n) {
            var e = u.get(n);
            return e || u.set(n, (e = t(n))), e;
          }
        : function(n) {
            for (var e = "", r = 0; r < n.length; r++)
              e += n[r].length + "-" + n[r];
            return u[e] || (u[e] = t(n));
          },
      o = function(t) {
        var e = n(this, r(t), arguments, []);
        return e.length > 1 ? e : e[0];
      };
    "undefined" != typeof module ? (module.exports = o) : (self.htm = o);
  })();

  _export.default = S;
  _export._ = {
    render: w,
    Component: S,
    createElement: c,
    Fragment: a,
    h: c,
    AsyncComponent: V,
    Router: M,
    loadURL: F,
    redirect: E,
    RouterSubscription: T,
    A: W,
    absolutePath: $
  };
  window._export = _export;
  // typeof module !== "undefined" && (module.exports = _export);
  //# sourceMappingURL=ui-lib.mjs.map
})();
