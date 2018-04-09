/*
 * flowplayer.js 3.2.12. The Flowplayer API
 * Copyright 2009-2011 Flowplayer Oy
 * This file is part of Flowplayer.
 *
 * Flowplayer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Flowplayer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Flowplayer.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Date: ${date}
 * Revision: ${revision}
 */
!function () {
    function h(p) {
        console.log("$f.fireEvent", [].slice.call(p))
    }

    function l(r) {
        if (!r || typeof r != "object") {
            return r
        }
        var p = new r.constructor();
        for (var q in r) {
            if (r.hasOwnProperty(q)) {
                p[q] = l(r[q])
            }
        }
        return p
    }

    function n(u, r) {
        if (!u) {
            return
        }
        var p, q = 0, s = u.length;
        if (s === undefined) {
            for (p in u) {
                if (r.call(u[p], p, u[p]) === false) {
                    break
                }
            }
        } else {
            for (var t = u[0]; q < s && r.call(t, q, t) !== false; t = u[++q]) {
            }
        }
        return u
    }

    function c(p) {
        return document.getElementById(p)
    }

    function j(r, q, p) {
        if (typeof q != "object") {
            return r
        }
        if (r && q) {
            n(q, function (s, t) {
                if (!p || typeof t != "function") {
                    r[s] = t
                }
            })
        }
        return r
    }

    function o(t) {
        var r = t.indexOf(".");
        if (r != -1) {
            var q = t.slice(0, r) || "*";
            var p = t.slice(r + 1, t.length);
            var s = [];
            n(document.getElementsByTagName(q), function () {
                if (this.className && this.className.indexOf(p) != -1) {
                    s.push(this)
                }
            });
            return s
        }
    }

    function g(p) {
        p = p || window.event;
        if (p.preventDefault) {
            p.stopPropagation();
            p.preventDefault()
        } else {
            p.returnValue = false;
            p.cancelBubble = true
        }
        return false
    }

    function k(r, p, q) {
        r[p] = r[p] || [];
        r[p].push(q)
    }

    function e(p) {
        return p.replace(/&amp;/g, "%26").replace(/&/g, "%26").replace(/=/g, "%3D")
    }

    function f() {
        return"_" + ("" + Math.random()).slice(2, 10)
    }

    var i = function (u, s, t) {
        var r = this, q = {}, v = {};
        r.index = s;
        if (typeof u == "string") {
            u = {url: u}
        }
        j(this, u, true);
        n(("Begin*,Start,Pause*,Resume*,Seek*,Stop*,Finish*,LastSecond,Update,BufferFull,BufferEmpty,BufferStop").split(","), function () {
            var w = "on" + this;
            if (w.indexOf("*") != -1) {
                w = w.slice(0, w.length - 1);
                var x = "onBefore" + w.slice(2);
                r[x] = function (y) {
                    k(v, x, y);
                    return r
                }
            }
            r[w] = function (y) {
                k(v, w, y);
                return r
            };
            if (s == -1) {
                if (r[x]) {
                    t[x] = r[x]
                }
                if (r[w]) {
                    t[w] = r[w]
                }
            }
        });
        j(this, {onCuepoint: function (y, x) {
            if (arguments.length == 1) {
                q.embedded = [null, y];
                return r
            }
            if (typeof y == "number") {
                y = [y]
            }
            var w = f();
            q[w] = [y, x];
            if (t.isLoaded()) {
                t._api().fp_addCuepoints(y, s, w)
            }
            return r
        }, update: function (x) {
            j(r, x);
            if (t.isLoaded()) {
                t._api().fp_updateClip(x, s)
            }
            var w = t.getConfig();
            var y = (s == -1) ? w.clip : w.playlist[s];
            j(y, x, true)
        }, _fireEvent: function (w, z, x, B) {
            if (w == "onLoad") {
                n(q, function (C, D) {
                    if (D[0]) {
                        t._api().fp_addCuepoints(D[0], s, C)
                    }
                });
                return false
            }
            B = B || r;
            if (w == "onCuepoint") {
                var A = q[z];
                if (A) {
                    return A[1].call(t, B, x)
                }
            }
            if (z && "onBeforeBegin,onMetaData,onStart,onUpdate,onResume".indexOf(w) != -1) {
                j(B, z);
                if (z.metaData) {
                    if (!B.duration) {
                        B.duration = z.metaData.duration
                    } else {
                        B.fullDuration = z.metaData.duration
                    }
                }
            }
            var y = true;
            n(v[w], function () {
                y = this.call(t, B, z, x)
            });
            return y
        }});
        if (u.onCuepoint) {
            var p = u.onCuepoint;
            r.onCuepoint.apply(r, typeof p == "function" ? [p] : p);
            delete u.onCuepoint
        }
        n(u, function (w, x) {
            if (typeof x == "function") {
                k(v, w, x);
                delete u[w]
            }
        });
        if (s == -1) {
            t.onCuepoint = this.onCuepoint
        }
    };
    var m = function (q, s, r, u) {
        var p = this, t = {}, v = false;
        if (u) {
            j(t, u)
        }
        n(s, function (w, x) {
            if (typeof x == "function") {
                t[w] = x;
                delete s[w]
            }
        });
        j(this, {animate: function (z, A, y) {
            if (!z) {
                return p
            }
            if (typeof A == "function") {
                y = A;
                A = 500
            }
            if (typeof z == "string") {
                var x = z;
                z = {};
                z[x] = A;
                A = 500
            }
            if (y) {
                var w = f();
                t[w] = y
            }
            if (A === undefined) {
                A = 500
            }
            s = r._api().fp_animate(q, z, A, w);
            return p
        }, css: function (x, y) {
            if (y !== undefined) {
                var w = {};
                w[x] = y;
                x = w
            }
            s = r._api().fp_css(q, x);
            j(p, s);
            return p
        }, show: function () {
            this.display = "block";
            r._api().fp_showPlugin(q);
            return p
        }, hide: function () {
            this.display = "none";
            r._api().fp_hidePlugin(q);
            return p
        }, toggle: function () {
            this.display = r._api().fp_togglePlugin(q);
            return p
        }, fadeTo: function (z, y, x) {
            if (typeof y == "function") {
                x = y;
                y = 500
            }
            if (x) {
                var w = f();
                t[w] = x
            }
            this.display = r._api().fp_fadeTo(q, z, y, w);
            this.opacity = z;
            return p
        }, fadeIn: function (x, w) {
            return p.fadeTo(1, x, w)
        }, fadeOut: function (x, w) {
            return p.fadeTo(0, x, w)
        }, getName: function () {
            return q
        }, getPlayer: function () {
            return r
        }, _fireEvent: function (x, w, y) {
            if (x == "onUpdate") {
                var A = r._api().fp_getPlugin(q);
                if (!A) {
                    return
                }
                j(p, A);
                delete p.methods;
                if (!v) {
                    n(A.methods, function () {
                        var C = "" + this;
                        p[C] = function () {
                            var D = [].slice.call(arguments);
                            var E = r._api().fp_invoke(q, C, D);
                            return E === "undefined" || E === undefined ? p : E
                        }
                    });
                    v = true
                }
            }
            var B = t[x];
            if (B) {
                var z = B.apply(p, w);
                if (x.slice(0, 1) == "_") {
                    delete t[x]
                }
                return z
            }
            return p
        }})
    };

    function b(r, H, u) {
        var x = this, w = null, E = false, v, t, G = [], z = {}, y = {}, F, s, q, D, p, B;
        j(x, {id: function () {
            return F
        }, isLoaded: function () {
            return(w !== null && w.fp_play !== undefined && !E)
        }, getParent: function () {
            return r
        }, hide: function (I) {
            if (I) {
                r.style.height = "0px"
            }
            if (x.isLoaded()) {
                w.style.height = "0px"
            }
            return x
        }, show: function () {
            r.style.height = B + "px";
            if (x.isLoaded()) {
                w.style.height = p + "px"
            }
            return x
        }, isHidden: function () {
            return x.isLoaded() && parseInt(w.style.height, 10) === 0
        }, load: function (K) {
            if (!x.isLoaded() && x._fireEvent("onBeforeLoad") !== false) {
                var I = function () {
                    if (v && !flashembed.isSupported(H.version)) {
                        r.innerHTML = ""
                    }
                    if (K) {
                        K.cached = true;
                        k(y, "onLoad", K)
                    }
                    flashembed(r, H, {config: u})
                };
                var J = 0;
                n(a, function () {
                    this.unload(function (L) {
                        if (++J == a.length) {
                            I()
                        }
                    })
                })
            }
            return x
        }, unload: function (K) {
            if (v.replace(/\s/g, "") !== "") {
                if (x._fireEvent("onBeforeUnload") === false) {
                    if (K) {
                        K(false)
                    }
                    return x
                }
                E = true;
                try {
                    if (w) {
                        if (w.fp_isFullscreen()) {
                            w.fp_toggleFullscreen()
                        }
                        w.fp_close();
                        x._fireEvent("onUnload")
                    }
                } catch (I) {
                }
                var J = function () {
                    w = null;
                    r.innerHTML = v;
                    E = false;
                    if (K) {
                        K(true)
                    }
                };
                if (/WebKit/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent)) {
                    setTimeout(J, 0)
                } else {
                    J()
                }
            } else {
                if (K) {
                    K(false)
                }
            }
            return x
        }, getClip: function (I) {
            if (I === undefined) {
                I = D
            }
            return G[I]
        }, getCommonClip: function () {
            return t
        }, getPlaylist: function () {
            return G
        }, getPlugin: function (I) {
            var K = z[I];
            if (!K && x.isLoaded()) {
                var J = x._api().fp_getPlugin(I);
                if (J) {
                    K = new m(I, J, x);
                    z[I] = K
                }
            }
            return K
        }, getScreen: function () {
            return x.getPlugin("screen")
        }, getControls: function () {
            return x.getPlugin("controls")._fireEvent("onUpdate")
        }, getLogo: function () {
            try {
                return x.getPlugin("logo")._fireEvent("onUpdate")
            } catch (I) {
            }
        }, getPlay: function () {
            return x.getPlugin("play")._fireEvent("onUpdate")
        }, getConfig: function (I) {
            return I ? l(u) : u
        }, getFlashParams: function () {
            return H
        }, loadPlugin: function (L, K, N, M) {
            if (typeof N == "function") {
                M = N;
                N = {}
            }
            var J = M ? f() : "_";
            x._api().fp_loadPlugin(L, K, N, J);
            var I = {};
            I[J] = M;
            var O = new m(L, null, x, I);
            z[L] = O;
            return O
        }, getState: function () {
            return x.isLoaded() ? w.fp_getState() : -1
        }, play: function (J, I) {
            var K = function () {
                if (J !== undefined) {
                    x._api().fp_play(J, I)
                } else {
                    x._api().fp_play()
                }
            };
            if (x.isLoaded()) {
                K()
            } else {
                if (E) {
                    setTimeout(function () {
                        x.play(J, I)
                    }, 50)
                } else {
                    x.load(function () {
                        K()
                    })
                }
            }
            return x
        }, getVersion: function () {
            var J = "flowplayer.js 3.2.12";
            if (x.isLoaded()) {
                var I = w.fp_getVersion();
                I.push(J);
                return I
            }
            return J
        }, _api: function () {
            if (!x.isLoaded()) {
                throw"Flowplayer " + x.id() + " not loaded when calling an API method"
            }
            return w
        }, setClip: function (I) {
            n(I, function (J, K) {
                if (typeof K == "function") {
                    k(y, J, K);
                    delete I[J]
                } else {
                    if (J == "onCuepoint") {
                        $f(r).getCommonClip().onCuepoint(I[J][0], I[J][1])
                    }
                }
            });
            x.setPlaylist([I]);
            return x
        }, getIndex: function () {
            return q
        }, bufferAnimate: function (I) {
            w.fp_bufferAnimate(I === undefined || I);
            return x
        }, _swfHeight: function () {
            return w.clientHeight
        }});
        n(("Click*,Load*,Unload*,Keypress*,Volume*,Mute*,Unmute*,PlaylistReplace,ClipAdd,Fullscreen*,FullscreenExit,Error,MouseOver,MouseOut").split(","), function () {
            var I = "on" + this;
            if (I.indexOf("*") != -1) {
                I = I.slice(0, I.length - 1);
                var J = "onBefore" + I.slice(2);
                x[J] = function (K) {
                    k(y, J, K);
                    return x
                }
            }
            x[I] = function (K) {
                k(y, I, K);
                return x
            }
        });
        n(("pause,resume,mute,unmute,stop,toggle,seek,getStatus,getVolume,setVolume,getTime,isPaused,isPlaying,startBuffering,stopBuffering,isFullscreen,toggleFullscreen,reset,close,setPlaylist,addClip,playFeed,setKeyboardShortcutsEnabled,isKeyboardShortcutsEnabled").split(","), function () {
            var I = this;
            x[I] = function (K, J) {
                if (!x.isLoaded()) {
                    return x
                }
                var L = null;
                if (K !== undefined && J !== undefined) {
                    L = w["fp_" + I](K, J)
                } else {
                    L = (K === undefined) ? w["fp_" + I]() : w["fp_" + I](K)
                }
                return L === "undefined" || L === undefined ? x : L
            }
        });
        x._fireEvent = function (R) {
            if (typeof R == "string") {
                R = [R]
            }
            var S = R[0], P = R[1], N = R[2], M = R[3], L = 0;
            if (u.debug) {
                h(R)
            }
            if (!x.isLoaded() && S == "onLoad" && P == "player") {
                w = w || c(s);
                p = x._swfHeight();
                n(G, function () {
                    this._fireEvent("onLoad")
                });
                n(z, function (T, U) {
                    U._fireEvent("onUpdate")
                });
                t._fireEvent("onLoad")
            }
            if (S == "onLoad" && P != "player") {
                return
            }
            if (S == "onError") {
                if (typeof P == "string" || (typeof P == "number" && typeof N == "number")) {
                    P = N;
                    N = M
                }
            }
            if (S == "onContextMenu") {
                n(u.contextMenu[P], function (T, U) {
                    U.call(x)
                });
                return
            }
            if (S == "onPluginEvent" || S == "onBeforePluginEvent") {
                var I = P.name || P;
                var J = z[I];
                if (J) {
                    J._fireEvent("onUpdate", P);
                    return J._fireEvent(N, R.slice(3))
                }
                return
            }
            if (S == "onPlaylistReplace") {
                G = [];
                var O = 0;
                n(P, function () {
                    G.push(new i(this, O++, x))
                })
            }
            if (S == "onClipAdd") {
                if (P.isInStream) {
                    return
                }
                P = new i(P, N, x);
                G.splice(N, 0, P);
                for (L = N + 1; L < G.length; L++) {
                    G[L].index++
                }
            }
            var Q = true;
            if (typeof P == "number" && P < G.length) {
                D = P;
                var K = G[P];
                if (K) {
                    Q = K._fireEvent(S, N, M)
                }
                if (!K || Q !== false) {
                    Q = t._fireEvent(S, N, M, K)
                }
            }
            n(y[S], function () {
                Q = this.call(x, P, N);
                if (this.cached) {
                    y[S].splice(L, 1)
                }
                if (Q === false) {
                    return false
                }
                L++
            });
            return Q
        };
        function C() {
            if ($f(r)) {
                $f(r).getParent().innerHTML = "";
                q = $f(r).getIndex();
                a[q] = x
            } else {
                a.push(x);
                q = a.length - 1
            }
            B = parseInt(r.style.height, 10) || r.clientHeight;
            F = r.id || "fp" + f();
            s = H.id || F + "_api";
            H.id = s;
            v = r.innerHTML;
            if (typeof u == "string") {
                u = {clip: {url: u}}
            }
            u.playerId = F;
            u.clip = u.clip || {};
            if (r.getAttribute("href", 2) && !u.clip.url) {
                u.clip.url = r.getAttribute("href", 2)
            }
            if (u.clip.url) {
                u.clip.url = e(u.clip.url)
            }
            t = new i(u.clip, -1, x);
            u.playlist = u.playlist || [u.clip];
            var J = 0;
            n(u.playlist, function () {
                var M = this;
                if (typeof M == "object" && M.length) {
                    M = {url: "" + M}
                }
                if (M.url) {
                    M.url = e(M.url)
                }
                n(u.clip, function (N, O) {
                    if (O !== undefined && M[N] === undefined && typeof O != "function") {
                        M[N] = O
                    }
                });
                u.playlist[J] = M;
                M = new i(M, J, x);
                G.push(M);
                J++
            });
            n(u, function (M, N) {
                if (typeof N == "function") {
                    if (t[M]) {
                        t[M](N)
                    } else {
                        k(y, M, N)
                    }
                    delete u[M]
                }
            });
            n(u.plugins, function (M, N) {
                if (N) {
                    z[M] = new m(M, N, x)
                }
            });
            if (!u.plugins || u.plugins.controls === undefined) {
                z.controls = new m("controls", null, x)
            }
            z.canvas = new m("canvas", null, x);
            v = r.innerHTML;
            function L(M) {
                if (/iPad|iPhone|iPod/i.test(navigator.userAgent) && !/.flv$/i.test(G[0].url) && !K()) {
                    return true
                }
                if (!x.isLoaded() && x._fireEvent("onBeforeClick") !== false) {
                    x.load()
                }
                return g(M)
            }

            function K() {
                return x.hasiPadSupport && x.hasiPadSupport()
            }

            function I() {
                if (v.replace(/\s/g, "") !== "") {
                    if (r.addEventListener) {
                        r.addEventListener("click", L, false)
                    } else {
                        if (r.attachEvent) {
                            r.attachEvent("onclick", L)
                        }
                    }
                } else {
                    if (r.addEventListener && !K()) {
                        r.addEventListener("click", g, false)
                    }
                    x.load()
                }
            }

            setTimeout(I, 0)
        }

        if (typeof r == "string") {
            var A = c(r);
            if (!A) {
                throw"Flowplayer cannot access element: " + r
            }
            r = A;
            C()
        } else {
            C()
        }
    }

    var a = [];

    function d(p) {
        this.length = p.length;
        this.each = function (r) {
            n(p, r)
        };
        this.size = function () {
            return p.length
        };
        var q = this;
        for (name in b.prototype) {
            q[name] = function () {
                var r = arguments;
                q.each(function () {
                    this[name].apply(this, r)
                })
            }
        }
    }

    window.flowplayer = window.$f = function () {
        var q = null;
        var p = arguments[0];
        if (!arguments.length) {
            n(a, function () {
                if (this.isLoaded()) {
                    q = this;
                    return false
                }
            });
            return q || a[0]
        }
        if (arguments.length == 1) {
            if (typeof p == "number") {
                return a[p]
            } else {
                if (p == "*") {
                    return new d(a)
                }
                n(a, function () {
                    if (this.id() == p.id || this.id() == p || this.getParent() == p) {
                        q = this;
                        return false
                    }
                });
                return q
            }
        }
        if (arguments.length > 1) {
            var u = arguments[1], r = (arguments.length == 3) ? arguments[2] : {};
            if (typeof u == "string") {
                u = {src: u}
            }
            u = j({bgcolor: "#000000", version: [10, 1], expressInstall: "http://releases.flowplayer.org/swf/expressinstall.swf", cachebusting: false}, u);
            if (typeof p == "string") {
                if (p.indexOf(".") != -1) {
                    var t = [];
                    n(o(p), function () {
                        t.push(new b(this, l(u), l(r)))
                    });
                    return new d(t)
                } else {
                    var s = c(p);
                    return new b(s !== null ? s : l(p), l(u), l(r))
                }
            } else {
                if (p) {
                    return new b(p, l(u), l(r))
                }
            }
        }
        return null
    };
    j(window.$f, {fireEvent: function () {
        var q = [].slice.call(arguments);
        var r = $f(q[0]);
        return r ? r._fireEvent(q.slice(1)) : null
    }, addPlugin: function (p, q) {
        b.prototype[p] = q;
        return $f
    }, each: n, extend: j});
    if (typeof jQuery == "function") {
        jQuery.fn.flowplayer = function (r, q) {
            if (!arguments.length || typeof arguments[0] == "number") {
                var p = [];
                this.each(function () {
                    var s = $f(this);
                    if (s) {
                        p.push(s)
                    }
                });
                return arguments.length ? p[arguments[0]] : new d(p)
            }
            return this.each(function () {
                $f(this, l(r), q ? l(q) : {})
            })
        }
    }
}();
!function () {
    var h = document.all, j = "http://get.adobe.com/flashplayer", c = typeof jQuery == "function", e = /(\d+)[^\d]+(\d+)[^\d]*(\d*)/, b = {width: "100%", height: "100%", id: "_" + ("" + Math.random()).slice(9), allowfullscreen: true, allowscriptaccess: "always", quality: "high", wmode:"opaque", version: [3, 0], onFail: null, expressInstall: null, w3c: false, cachebusting: false};
    if (window.attachEvent) {
        window.attachEvent("onbeforeunload", function () {
            __flash_unloadHandler = function () {
            };
            __flash_savedUnloadHandler = function () {
            }
        })
    }
    function i(m, l) {
        if (l) {
            for (var f in l) {
                if (l.hasOwnProperty(f)) {
                    m[f] = l[f]
                }
            }
        }
        return m
    }

    function a(f, n) {
        var m = [];
        for (var l in f) {
            if (f.hasOwnProperty(l)) {
                m[l] = n(f[l])
            }
        }
        return m
    }

    window.flashembed = function (f, m, l) {
        if (typeof f == "string") {
            f = document.getElementById(f.replace("#", ""))
        }
        if (!f) {
            return
        }
        if (typeof m == "string") {
            m = {src: m}
        }
        return new d(f, i(i({}, b), m), l)
    };
    var g = i(window.flashembed, {conf: b, getVersion: function () {
        var m, f;
        try {
            f = navigator.plugins["Shockwave Flash"].description.slice(16)
        } catch (o) {
            try {
                m = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
                f = m && m.GetVariable("$version")
            } catch (n) {
                try {
                    m = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
                    f = m && m.GetVariable("$version")
                } catch (l) {
                }
            }
        }
        f = e.exec(f);
        return f ? [1 * f[1], 1 * f[(f[1] * 1 > 9 ? 2 : 3)] * 1] : [0, 0]
    }, asString: function (l) {
        if (l === null || l === undefined) {
            return null
        }
        var f = typeof l;
        if (f == "object" && l.push) {
            f = "array"
        }
        switch (f) {
            case"string":
                l = l.replace(new RegExp('(["\\\\])', "g"), "\\$1");
                l = l.replace(/^\s?(\d+\.?\d*)%/, "$1pct");
                return'"' + l + '"';
            case"array":
                return"[" + a(l,function (o) {
                    return g.asString(o)
                }).join(",") + "]";
            case"function":
                return'"function()"';
            case"object":
                var m = [];
                for (var n in l) {
                    if (l.hasOwnProperty(n)) {
                        m.push('"' + n + '":' + g.asString(l[n]))
                    }
                }
                return"{" + m.join(",") + "}"
        }
        return String(l).replace(/\s/g, " ").replace(/\'/g, '"')
    }, getHTML: function (o, l) {
        o = i({}, o);
        var n = '<object wmode="opaque"  width="' + o.width + '" height="' + o.height + '" id="' + o.id + '" name="' + o.id + '"';
        if (o.cachebusting) {
            o.src += ((o.src.indexOf("?") != -1 ? "&" : "?") + Math.random())
        }
        if (o.w3c || !h) {
            n += ' data="' + o.src + '" type="application/x-shockwave-flash"'
        } else {
            n += ' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'
        }
        n += ">";
        if (o.w3c || h) {
            n += '<param name="movie" wmode="opaque" value="' + o.src + '" />'
        }
        o.width = o.height = o.id = o.w3c = o.src = null;
        o.onFail = o.version = o.expressInstall = null;
        for (var m in o) {
            if (o[m]) {
                n += '<param  name="' + m + '" value="' + o[m] + '" />'
            }
        }
        var p = "";
        if (l) {
            for (var f in l) {
                if (l[f]) {
                    var q = l[f];
                    p += f + "=" + (/function|object/.test(typeof q) ? g.asString(q) : q) + "&"
                }
            }
            p = p.slice(0, -1);
            n += '<param name="flashvars" value=\'' + p + "' />"
        }
        n += "</object>";
        return n
    }, isSupported: function (f) {
        return k[0] > f[0] || k[0] == f[0] && k[1] >= f[1]
    }});
    var k = g.getVersion();

    function d(f, n, m) {
        if (g.isSupported(n.version)) {
            f.innerHTML = g.getHTML(n, m)
        } else {
            if (n.expressInstall && g.isSupported([6, 65])) {
                f.innerHTML = g.getHTML(i(n, {src: n.expressInstall}), {MMredirectURL: encodeURIComponent(location.href), MMplayerType: "PlugIn", MMdoctitle: document.title})
            } else {
                if (!f.innerHTML.replace(/\s/g, "")) {
                    f.innerHTML = "<h2>Flash version " + n.version + " or greater is required</h2><h3>" + (k[0] > 0 ? "Your version is " + k : "You have no flash plugin installed") + "</h3>" + (f.tagName == "A" ? "<p>Click here to download latest version</p>" : "<p>Download latest version from <a href='" + j + "'>here</a></p>");
                    if (f.tagName == "A" || f.tagName == "DIV") {
                        f.onclick = function () {
                            location.href = j
                        }
                    }
                }
                if (n.onFail) {
                    var l = n.onFail.call(this);
                    if (typeof l == "string") {
                        f.innerHTML = l
                    }
                }
            }
        }
        if (h) {
            window[n.id] = document.getElementById(n.id)
        }
        i(this, {getRoot: function () {
            return f
        }, getOptions: function () {
            return n
        }, getConf: function () {
            return m
        }, getApi: function () {
            return f.firstChild
        }})
    }

    if (c) {
        jQuery.tools = jQuery.tools || {version: "3.2.12"};
        jQuery.tools.flashembed = {conf: b};
        jQuery.fn.flashembed = function (l, f) {
            return this.each(function () {
                $(this).data("flashembed", flashembed(this, l, f))
            })
        }
    }
}();
$f.addPlugin("ipad", function (y) {
    var S = -1;
    var z = 0;
    var A = 1;
    var P = 2;
    var E = 3;
    var L = 4;
    var j = 5;
    var i = this;
    var U = 1;
    var T = false;
    var I = false;
    var v = false;
    var s = 0;
    var R = [];
    var l;
    var t = null;
    var d = 0;
    var f = {accelerated: false, autoBuffering: false, autoPlay: true, baseUrl: null, bufferLength: 3, connectionProvider: null, cuepointMultiplier: 1000, cuepoints: [], controls: {}, duration: 0, extension: "", fadeInSpeed: 1000, fadeOutSpeed: 1000, image: false, linkUrl: null, linkWindow: "_self", live: false, metaData: {}, originalUrl: null, position: 0, playlist: [], provider: "http", scaling: "scale", seekableOnBegin: false, start: 0, url: null, urlResolvers: []};
    var x = S;
    var r = S;
    var u = /iPad|iPhone|iPod/i.test(navigator.userAgent);
    var c = null;

    function n(Y, X, V) {
        if (X) {
            for (key in X) {
                if (key) {
                    if (X[key] && typeof X[key] == "function" && !V) {
                        continue
                    }
                    if (X[key] && typeof X[key] == "object" && X[key].length === undefined) {
                        var W = {};
                        n(W, X[key]);
                        Y[key] = W
                    } else {
                        Y[key] = X[key]
                    }
                }
            }
        }
        return Y
    }

    var B = {simulateiDevice: false, controlsSizeRatio: 1.5, controls: true, debug: false, validExtensions: "mov|m4v|mp4|avi|mp3|m4a|aac|m3u8|m3u|pls", posterExtensions: "png|jpg"};
    n(B, y);
    var b = B.validExtensions ? new RegExp("^.(" + B.validExtensions + ")$", "i") : null;
    var e = new RegExp("^.(" + B.posterExtensions + ")$", "i");

    function h() {
        if (B.debug) {
            if (u) {
                var V = [].splice.call(arguments, 0).join(", ");
                console.log.apply(console, [V])
            } else {
                console.log.apply(console, arguments)
            }
        }
    }

    function m(V) {
        switch (V) {
            case -1:
                return"UNLOADED";
            case 0:
                return"LOADED";
            case 1:
                return"UNSTARTED";
            case 2:
                return"BUFFERING";
            case 3:
                return"PLAYING";
            case 4:
                return"PAUSED";
            case 5:
                return"ENDED"
        }
        return"UNKOWN"
    }

    function J(V) {
        var W = $f.fireEvent(i.id(), "onBefore" + V, s);
        return W !== false
    }

    function O(V) {
        V.stopPropagation();
        V.preventDefault();
        return false
    }

    function M(W, V) {
        if (x == S && !V) {
            return
        }
        r = x;
        x = W;
        D();
        if (W == E) {
            p()
        }
        h(m(W))
    }

    function C() {
        c.fp_stop();
        T = false;
        I = false;
        v = false;
        M(A);
        M(A)
    }

    var g = null;

    function p() {
        if (g) {
            return
        }
        console.log("starting tracker");
        g = setInterval(G, 100);
        G()
    }

    function D() {
        clearInterval(g);
        g = null
    }

    function G() {
        var W = Math.floor(c.fp_getTime() * 10) * 100;
        var X = Math.floor(c.duration * 10) * 100;
        var Y = (new Date()).time;

        function V(ab, Z) {
            ab = ab >= 0 ? ab : X - Math.abs(ab);
            for (var aa = 0; aa < Z.length; aa++) {
                if (Z[aa].lastTimeFired > Y) {
                    Z[aa].lastTimeFired = -1
                } else {
                    if (Z[aa].lastTimeFired + 500 > Y) {
                        continue
                    } else {
                        if (ab == W || (W - 500 < ab && W > ab)) {
                            Z[aa].lastTimeFired = Y;
                            $f.fireEvent(i.id(), "onCuepoint", s, Z[aa].fnId, Z[aa].parameters)
                        }
                    }
                }
            }
        }

        $f.each(i.getCommonClip().cuepoints, V);
        $f.each(R[s].cuepoints, V)
    }

    function H() {
        C();
        v = true;
        c.fp_seek(0)
    }

    function N(V) {
    }

    function q() {
        console.log(c);
        function V(X) {
            var W = {};
            n(W, f);
            n(W, i.getCommonClip());
            n(W, X);
            if (W.ipadUrl) {
                url = decodeURIComponent(W.ipadUrl)
            } else {
                if (W.url) {
                    url = W.url
                }
            }
            if (url && url.indexOf("://") == -1 && W.ipadBaseUrl) {
                url = W.ipadBaseUrl + "/" + url
            } else {
                if (url && url.indexOf("://") == -1 && W.baseUrl) {
                    url = W.baseUrl + "/" + url
                }
            }
            W.originalUrl = W.url;
            W.completeUrl = url;
            W.extension = W.completeUrl.substr(W.completeUrl.lastIndexOf("."));
            var Y = W.extension.indexOf("?");
            if (Y > -1) {
                W.extension = W.extension.substr(0, Y)
            }
            W.type = "video";
            delete W.index;
            h("fixed clip", W);
            return W
        }

        c.fp_play = function (Z, X, ab, ac) {
            var W = null;
            var aa = true;
            var Y = true;
            h("Calling play() " + Z, Z);
            if (X) {
                h("ERROR: inStream clips not yet supported");
                return
            }
            if (Z !== undefined) {
                if (typeof Z == "number") {
                    if (s >= R.length) {
                        return
                    }
                    s = Z;
                    Z = R[s]
                } else {
                    if (typeof Z == "string") {
                        Z = {url: Z}
                    }
                    c.fp_setPlaylist(Z.length !== undefined ? Z : [Z])
                }
                if (s == 0 && R.length > 1 && e.test(R[s].extension)) {
                    var ac = R[s].url;
                    console.log("Poster image available with url " + ac);
                    ++s;
                    console.log("Not last clip in the playlist, moving to next one");
                    c.fp_play(s, false, true, ac);
                    return
                }
                if (b && !b.test(R[s].extension)) {
                    return
                }
                Z = R[s];
                W = Z.completeUrl;
                if (Z.autoBuffering !== undefined && Z.autoBuffering === false) {
                    aa = false
                }
                if (Z.autoPlay === undefined || Z.autoPlay === true || ab === true) {
                    aa = true;
                    Y = true
                } else {
                    Y = false
                }
            } else {
                h("clip was not given, simply calling video.play, if not already buffering");
                if (x != P) {
                    c.play()
                }
                return
            }
            h("about to play " + W, aa, Y);
            C();
            if (W) {
                h("Changing SRC attribute" + W);
                c.setAttribute("src", W)
            }
            if (aa) {
                if (!J("Begin")) {
                    return false
                }
                if (ac) {
                    Y = Z.autoPlay;
                    c.setAttribute("poster", ac);
                    c.setAttribute("preload", "none")
                }
                $f.fireEvent(i.id(), "onBegin", s);
                h("calling video.load()");
                c.load()
            }
            if (Y) {
                h("calling video.play()");
                c.play()
            }
        };
        c.fp_pause = function () {
            h("pause called");
            if (!J("Pause")) {
                return false
            }
            c.pause()
        };
        c.fp_resume = function () {
            h("resume called");
            if (!J("Resume")) {
                return false
            }
            c.play()
        };
        c.fp_stop = function () {
            h("stop called");
            if (!J("Stop")) {
                return false
            }
            I = true;
            c.pause();
            try {
                c.currentTime = 0
            } catch (W) {
            }
        };
        c.fp_seek = function (W) {
            h("seek called " + W);
            if (!J("Seek")) {
                return false
            }
            var aa = 0;
            var W = W + "";
            if (W.charAt(W.length - 1) == "%") {
                var X = parseInt(W.substr(0, W.length - 1)) / 100;
                var Z = c.duration;
                aa = Z * X
            } else {
                aa = W
            }
            try {
                c.currentTime = aa
            } catch (Y) {
                h("Wrong seek time")
            }
        };
        c.fp_getTime = function () {
            return c.currentTime
        };
        c.fp_mute = function () {
            h("mute called");
            if (!J("Mute")) {
                return false
            }
            U = c.volume;
            c.volume = 0
        };
        c.fp_unmute = function () {
            if (!J("Unmute")) {
                return false
            }
            c.volume = U
        };
        c.fp_getVolume = function () {
            return c.volume * 100
        };
        c.fp_setVolume = function (W) {
            if (!J("Volume")) {
                return false
            }
            c.volume = W / 100
        };
        c.fp_toggle = function () {
            h("toggle called");
            if (i.getState() == j) {
                H();
                return
            }
            if (c.paused) {
                c.fp_play()
            } else {
                c.fp_pause()
            }
        };
        c.fp_isPaused = function () {
            return c.paused
        };
        c.fp_isPlaying = function () {
            return !c.paused
        };
        c.fp_getPlugin = function (X) {
            if (X == "canvas" || X == "controls") {
                var W = i.getConfig();
                return W.plugins && W.plugins[X] ? W.plugins[X] : null
            }
            h("ERROR: no support for " + X + " plugin on iDevices");
            return null
        };
        c.fp_close = function () {
            M(S);
            c.parentNode.removeChild(c);
            c = null
        };
        c.fp_getStatus = function () {
            var X = 0;
            var Y = 0;
            try {
                X = c.buffered.start();
                Y = c.buffered.end()
            } catch (W) {
            }
            return{bufferStart: X, bufferEnd: Y, state: x, time: c.fp_getTime(), muted: c.muted, volume: c.fp_getVolume()}
        };
        c.fp_getState = function () {
            return x
        };
        c.fp_startBuffering = function () {
            if (x == A) {
                c.load()
            }
        };
        c.fp_setPlaylist = function (X) {
            h("Setting playlist");
            s = 0;
            for (var W = 0; W < X.length; W++) {
                X[W] = V(X[W])
            }
            R = X;
            $f.fireEvent(i.id(), "onPlaylistReplace", X)
        };
        c.fp_addClip = function (X, W) {
            X = V(X);
            R.splice(W, 0, X);
            $f.fireEvent(i.id(), "onClipAdd", X, W)
        };
        c.fp_updateClip = function (X, W) {
            n(R[W], X);
            return R[W]
        };
        c.fp_getVersion = function () {
            return"3.2.3"
        };
        c.fp_isFullscreen = function () {
            var W = c.webkitDisplayingFullscreen;
            if (W !== undefined) {
                return W
            }
            return false
        };
        c.fp_toggleFullscreen = function () {
            if (c.fp_isFullscreen()) {
                c.webkitExitFullscreen()
            } else {
                c.webkitEnterFullscreen()
            }
        };
        c.fp_addCuepoints = function (Z, X, W) {
            var ab = X == -1 ? i.getCommonClip() : R[X];
            ab.cuepoints = ab.cuepoints || {};
            Z = Z instanceof Array ? Z : [Z];
            for (var Y = 0; Y < Z.length; Y++) {
                var ac = typeof Z[Y] == "object" ? (Z[Y]["time"] || null) : Z[Y];
                if (ac == null) {
                    continue
                }
                ac = Math.floor(ac / 100) * 100;
                var aa = ac;
                if (typeof Z[Y] == "object") {
                    aa = n({}, Z[Y], false);
                    if (aa.time === undefined) {
                        delete aa.time
                    }
                    if (aa.parameters !== undefined) {
                        n(aa, aa.parameters, false);
                        delete aa.parameters
                    }
                }
                ab.cuepoints[ac] = ab.cuepoints[ac] || [];
                ab.cuepoints[ac].push({fnId: W, lastTimeFired: -1, parameters: aa})
            }
        };
        $f.each(("toggleFullscreen,stopBuffering,reset,playFeed,setKeyboardShortcutsEnabled,isKeyboardShortcutsEnabled,css,animate,showPlugin,hidePlugin,togglePlugin,fadeTo,invoke,loadPlugin").split(","), function () {
            var W = this;
            c["fp_" + W] = function () {
                h("ERROR: unsupported API on iDevices " + W);
                return false
            }
        })
    }

    function K() {
        var ai = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "seeked", "seeking", "stalled", "suspend", "volumechange", "waiting"];
        var aa = function (ak) {
            h("Got event " + ak.type, ak)
        };
        for (var ac = 0; ac < ai.length; ac++) {
            c.addEventListener(ai[ac], aa, false)
        }
        var X = function (ak) {
            h("got onBufferEmpty event " + ak.type);
            M(P);
            $f.fireEvent(i.id(), "onBufferEmpty", s)
        };
        c.addEventListener("emptied", X, false);
        c.addEventListener("waiting", X, false);
        var Z = function (ak) {
            if (r == A || r == P) {
            } else {
                h("Restoring old state " + m(r));
                M(r)
            }
            $f.fireEvent(i.id(), "onBufferFull", s)
        };
        c.addEventListener("canplay", Z, false);
        c.addEventListener("canplaythrough", Z, false);
        var Y = function (al) {
            var ak;
            d = R[s].start;
            if (R[s].duration > 0) {
                ak = R[s].duration;
                t = ak + d
            } else {
                ak = c.duration;
                t = null
            }
            c.fp_updateClip({duration: ak, metaData: {duration: c.duration}}, s);
            R[s].duration = c.duration;
            R[s].metaData = {duration: c.duration};
            $f.fireEvent(i.id(), "onMetaData", s, R[s])
        };
        c.addEventListener("loadedmetadata", Y, false);
        c.addEventListener("durationchange", Y, false);
        var W = function (ak) {
            if (t && c.currentTime > t) {
                c.fp_seek(d);
                C();
                return O(ak)
            }
        };
        c.addEventListener("timeupdate", W, false);
        var ah = function (ak) {
            if (x == L) {
                if (!J("Resume")) {
                    h("Resume disallowed, pausing");
                    c.fp_pause();
                    return O(ak)
                }
                $f.fireEvent(i.id(), "onResume", s)
            }
            M(E);
            if (!T) {
                T = true;
                $f.fireEvent(i.id(), "onStart", s)
            }
        };
        c.addEventListener("playing", ah, false);
        var V = function (ak) {
            F()
        };
        c.addEventListener("play", V, false);
        var ae = function (ak) {
            if (!J("Finish")) {
                if (R.length == 1) {
                    h("Active playlist only has one clip, onBeforeFinish returned false. Replaying");
                    H()
                } else {
                    if (s != (R.length - 1)) {
                        h("Not the last clip in the playlist, but onBeforeFinish returned false. Returning to the beginning of current clip");
                        c.fp_seek(0)
                    } else {
                        h("Last clip in playlist, but onBeforeFinish returned false, start again from the beginning");
                        c.fp_play(0)
                    }
                }
                return O(ak)
            }
            M(j);
            $f.fireEvent(i.id(), "onFinish", s);
            if (R.length > 1 && s < (R.length - 1)) {
                h("Not last clip in the playlist, moving to next one");
                c.fp_play(++s, false, true)
            }
        };
        c.addEventListener("ended", ae, false);
        var ad = function (ak) {
            M(z, true);
            $f.fireEvent(i.id(), "onError", s, 201);
            if (B.onFail && B.onFail instanceof Function) {
                B.onFail.apply(i, [])
            }
        };
        c.addEventListener("error", ad, false);
        var ag = function (ak) {
            h("got pause event from player" + i.id());
            if (I) {
                return
            }
            if (x == P && r == A) {
                h("forcing play");
                setTimeout(function () {
                    c.play()
                }, 0);
                return
            }
            if (!J("Pause")) {
                c.fp_resume();
                return O(ak)
            }
            Q();
            M(L);
            $f.fireEvent(i.id(), "onPause", s)
        };
        c.addEventListener("pause", ag, false);
        var aj = function (ak) {
            $f.fireEvent(i.id(), "onBeforeSeek", s)
        };
        c.addEventListener("seeking", aj, false);
        var ab = function (ak) {
            if (I) {
                I = false;
                $f.fireEvent(i.id(), "onStop", s)
            } else {
                $f.fireEvent(i.id(), "onSeek", s)
            }
            h("seek done, currentState", m(x));
            if (v) {
                v = false;
                c.fp_play()
            } else {
                if (x != E) {
                    c.fp_pause()
                }
            }
        };
        c.addEventListener("seeked", ab, false);
        var af = function (ak) {
            $f.fireEvent(i.id(), "onVolume", c.fp_getVolume())
        };
        c.addEventListener("volumechange", af, false)
    }

    function F() {
        l = setInterval(function () {
            if (c.fp_getTime() >= c.duration - 1) {
                $f.fireEvent(i.id(), "onLastSecond", s);
                Q()
            }
        }, 100)
    }

    function Q() {
        clearInterval(l)
    }

    function o() {
        c.fp_play(0)
    }

    function w() {
    }

    if (u || B.simulateiDevice) {
        if (!window.flashembed.__replaced) {
            var k = window.flashembed;
            window.flashembed = function (X, ac, Y) {
                if (typeof X == "string") {
                    X = document.getElementById(X.replace("#", ""))
                }
                if (!X) {
                    return
                }
                var ab = window.getComputedStyle(X, null);
                var aa = parseInt(ab.width);
                var V = parseInt(ab.height);
                while (X.firstChild) {
                    X.removeChild(X.firstChild)
                }
                var W = document.createElement("div");
                var Z = document.createElement("video");
                W.appendChild(Z);
                X.appendChild(W);
                W.style.height = V + "px";
                W.style.width = aa + "px";
                W.style.display = "block";
                W.style.position = "relative";
                W.style.background = "-webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0.7)))";
                W.style.cursor = "default";
                W.style.webkitUserDrag = "none";
                Z.style.height = "100%";
                Z.style.width = "100%";
                Z.style.display = "block";
                Z.id = ac.id;
                Z.name = ac.id;
                Z.style.cursor = "pointer";
                Z.style.webkitUserDrag = "none";
                Z.type = "video/mp4";
                Z.playerConfig = Y.config;
                $f.fireEvent(Y.config.playerId, "onLoad", "player")
            };
            flashembed.getVersion = k.getVersion;
            flashembed.asString = k.asString;
            flashembed.isSupported = function () {
                return true
            };
            flashembed.__replaced = true
        }
        var a = i._fireEvent;
        i._fireEvent = function (V) {
            if (V[0] == "onLoad" && V[1] == "player") {
                c = i.getParent().querySelector("video");
                if (B.controls) {
                    c.controls = "controls"
                }
                q();
                K();
                M(z, true);
                c.fp_setPlaylist(c.playerConfig.playlist);
                o();
                a.apply(i, [V])
            }
            var W = x != S;
            if (x == S && typeof V == "string") {
                W = true
            }
            if (W) {
                return a.apply(i, [V])
            }
        };
        i._swfHeight = function () {
            return parseInt(c.style.height)
        };
        i.hasiPadSupport = function () {
            return true
        }
    }
    return i
});