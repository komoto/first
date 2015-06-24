function _handleMultipleEvents(t, e, s, o) {
    vjs.arr.forEach(s, function(s) {
        t(e, s, o)
    })
}

function _logType(t, e) {
    var s, o, n;
    s = Array.prototype.slice.call(e), o = function() {}, n = window.console || {
        log: o,
        warn: o,
        error: o
    }, t ? s.unshift(t.toUpperCase() + ":") : t = "log", vjs.log.history.push(s), s.unshift("VIDEOJS:"), n[t].apply ? n[t].apply(n, s) : n[t](s.join(" "))
}
document.createElement("video"), document.createElement("audio"), document.createElement("track");
var vjs = function(t, e, s) {
        var o;
        if ("string" == typeof t) {
            if (0 === t.indexOf("#") && (t = t.slice(1)), vjs.players[t]) return vjs.players[t];
            o = vjs.el(t)
        } else o = t;
        if (!o || !o.nodeName) throw new TypeError("The element or ID supplied is not valid. (videojs)");
        return o.player || new vjs.Player(o, e, s)
    },
    videojs = window.videojs = vjs;
vjs.CDN_VERSION = "4.8", vjs.ACCESS_PROTOCOL = "https:" == document.location.protocol ? "https://" : "http://", vjs.options = {
    techOrder: ["html5", "flash"],
    html5: {},
    flash: {},
    width: 300,
    height: 150,
    defaultVolume: 0,
    playbackRates: [],
    inactivityTimeout: 2e3,
    children: {
        mediaLoader: {},
        posterImage: {},
        textTrackDisplay: {},
        loadingSpinner: {},
        bigPlayButton: {},
        controlBar: {},
        errorDisplay: {}
    },
    language: document.getElementsByTagName("html")[0].getAttribute("lang") || navigator.languages && navigator.languages[0] || navigator.userLanguage || navigator.language || "en",
    languages: {},
    notSupportedMessage: "No compatible source was found for this video."
}, "GENERATED_CDN_VSN" !== vjs.CDN_VERSION && (videojs.options.flash.swf = vjs.ACCESS_PROTOCOL + "vjs.zencdn.net/" + vjs.CDN_VERSION + "/video-js.swf"), vjs.addLanguage = function(t, e) {
    return vjs.options.languages[t] = void 0 !== vjs.options.languages[t] ? vjs.util.mergeOptions(vjs.options.languages[t], e) : e, vjs.options.languages
}, vjs.players = {}, "function" == typeof define && define.amd ? define([], function() {
    return videojs
}) : "object" == typeof exports && "object" == typeof module && (module.exports = videojs), vjs.CoreObject = vjs.CoreObject = function() {}, vjs.CoreObject.extend = function(t) {
    var e, s;
    t = t || {}, e = t.init || t.init || this.prototype.init || this.prototype.init || function() {}, s = function() {
        e.apply(this, arguments)
    }, s.prototype = vjs.obj.create(this.prototype), s.prototype.constructor = s, s.extend = vjs.CoreObject.extend, s.create = vjs.CoreObject.create;
    for (var o in t) t.hasOwnProperty(o) && (s.prototype[o] = t[o]);
    return s
}, vjs.CoreObject.create = function() {
    var t = vjs.obj.create(this.prototype);
    return this.apply(t, arguments), t
}, vjs.on = function(t, e, s) {
    if (vjs.obj.isArray(e)) return _handleMultipleEvents(vjs.on, t, e, s);
    var o = vjs.getData(t);
    o.handlers || (o.handlers = {}), o.handlers[e] || (o.handlers[e] = []), s.guid || (s.guid = vjs.guid++), o.handlers[e].push(s), o.dispatcher || (o.disabled = !1, o.dispatcher = function(e) {
        if (!o.disabled) {
            e = vjs.fixEvent(e);
            var s = o.handlers[e.type];
            if (s)
                for (var n = s.slice(0), i = 0, r = n.length; r > i && !e.isImmediatePropagationStopped(); i++) n[i].call(t, e)
        }
    }), 1 == o.handlers[e].length && (t.addEventListener ? t.addEventListener(e, o.dispatcher, !1) : t.attachEvent && t.attachEvent("on" + e, o.dispatcher))
}, vjs.off = function(t, e, s) {
    if (vjs.hasData(t)) {
        var o = vjs.getData(t);
        if (o.handlers) {
            if (vjs.obj.isArray(e)) return _handleMultipleEvents(vjs.off, t, e, s);
            var n = function(e) {
                o.handlers[e] = [], vjs.cleanUpEvents(t, e)
            };
            if (e) {
                var i = o.handlers[e];
                if (i) {
                    if (!s) return n(e), void 0;
                    if (s.guid)
                        for (var r = 0; r < i.length; r++) i[r].guid === s.guid && i.splice(r--, 1);
                    vjs.cleanUpEvents(t, e)
                }
            } else
                for (var a in o.handlers) n(a)
        }
    }
}, vjs.cleanUpEvents = function(t, e) {
    var s = vjs.getData(t);
    0 === s.handlers[e].length && (delete s.handlers[e], t.removeEventListener ? t.removeEventListener(e, s.dispatcher, !1) : t.detachEvent && t.detachEvent("on" + e, s.dispatcher)), vjs.isEmpty(s.handlers) && (delete s.handlers, delete s.dispatcher, delete s.disabled), vjs.isEmpty(s) && vjs.removeData(t)
}, vjs.fixEvent = function(t) {
    function e() {
        return !0
    }

    function s() {
        return !1
    }
    if (!t || !t.isPropagationStopped) {
        var o = t || window.event;
        t = {};
        for (var n in o) "layerX" !== n && "layerY" !== n && "keyboardEvent.keyLocation" !== n && ("returnValue" == n && o.preventDefault || (t[n] = o[n]));
        if (t.target || (t.target = t.srcElement || document), t.relatedTarget = t.fromElement === t.target ? t.toElement : t.fromElement, t.preventDefault = function() {
                o.preventDefault && o.preventDefault(), t.returnValue = !1, t.isDefaultPrevented = e, t.defaultPrevented = !0
            }, t.isDefaultPrevented = s, t.defaultPrevented = !1, t.stopPropagation = function() {
                o.stopPropagation && o.stopPropagation(), t.cancelBubble = !0, t.isPropagationStopped = e
            }, t.isPropagationStopped = s, t.stopImmediatePropagation = function() {
                o.stopImmediatePropagation && o.stopImmediatePropagation(), t.isImmediatePropagationStopped = e, t.stopPropagation()
            }, t.isImmediatePropagationStopped = s, null != t.clientX) {
            var i = document.documentElement,
                r = document.body;
            t.pageX = t.clientX + (i && i.scrollLeft || r && r.scrollLeft || 0) - (i && i.clientLeft || r && r.clientLeft || 0), t.pageY = t.clientY + (i && i.scrollTop || r && r.scrollTop || 0) - (i && i.clientTop || r && r.clientTop || 0)
        }
        t.which = t.charCode || t.keyCode, null != t.button && (t.button = 1 & t.button ? 0 : 4 & t.button ? 1 : 2 & t.button ? 2 : 0)
    }
    return t
}, vjs.trigger = function(t, e) {
    var s = vjs.hasData(t) ? vjs.getData(t) : {},
        o = t.parentNode || t.ownerDocument;
    if ("string" == typeof e && (e = {
            type: e,
            target: t
        }), e = vjs.fixEvent(e), s.dispatcher && s.dispatcher.call(t, e), o && !e.isPropagationStopped() && e.bubbles !== !1) vjs.trigger(o, e);
    else if (!o && !e.defaultPrevented) {
        var n = vjs.getData(e.target);
        e.target[e.type] && (n.disabled = !0, "function" == typeof e.target[e.type] && e.target[e.type](), n.disabled = !1)
    }
    return !e.defaultPrevented
}, vjs.one = function(t, e, s) {
    if (vjs.obj.isArray(e)) return _handleMultipleEvents(vjs.one, t, e, s);
    var o = function() {
        vjs.off(t, e, o), s.apply(this, arguments)
    };
    o.guid = s.guid = s.guid || vjs.guid++, vjs.on(t, e, o)
};
var hasOwnProp = Object.prototype.hasOwnProperty;
vjs.createEl = function(t, e) {
    var s;
    return t = t || "div", e = e || {}, s = document.createElement(t), vjs.obj.each(e, function(t, e) {
        -1 !== t.indexOf("aria-") || "role" == t ? s.setAttribute(t, e) : s[t] = e
    }), s
}, vjs.capitalize = function(t) {
    return t.charAt(0).toUpperCase() + t.slice(1)
}, vjs.obj = {}, vjs.obj.create = Object.create || function(t) {
    function e() {}
    return e.prototype = t, new e
}, vjs.obj.each = function(t, e, s) {
    for (var o in t) hasOwnProp.call(t, o) && e.call(s || this, o, t[o])
}, vjs.obj.merge = function(t, e) {
    if (!e) return t;
    for (var s in e) hasOwnProp.call(e, s) && (t[s] = e[s]);
    return t
}, vjs.obj.deepMerge = function(t, e) {
    var s, o, n;
    t = vjs.obj.copy(t);
    for (s in e) hasOwnProp.call(e, s) && (o = t[s], n = e[s], t[s] = vjs.obj.isPlain(o) && vjs.obj.isPlain(n) ? vjs.obj.deepMerge(o, n) : e[s]);
    return t
}, vjs.obj.copy = function(t) {
    return vjs.obj.merge({}, t)
}, vjs.obj.isPlain = function(t) {
    return !!t && "object" == typeof t && "[object Object]" === t.toString() && t.constructor === Object
}, vjs.obj.isArray = Array.isArray || function(t) {
    return "[object Array]" === Object.prototype.toString.call(t)
}, vjs.isNaN = function(t) {
    return t !== t
}, vjs.bind = function(t, e, s) {
    e.guid || (e.guid = vjs.guid++);
    var o = function() {
        return e.apply(t, arguments)
    };
    return o.guid = s ? s + "_" + e.guid : e.guid, o
}, vjs.cache = {}, vjs.guid = 1, vjs.expando = "vdata" + (new Date).getTime(), vjs.getData = function(t) {
    var e = t[vjs.expando];
    return e || (e = t[vjs.expando] = vjs.guid++, vjs.cache[e] = {}), vjs.cache[e]
}, vjs.hasData = function(t) {
    var e = t[vjs.expando];
    return !(!e || vjs.isEmpty(vjs.cache[e]))
}, vjs.removeData = function(t) {
    var e = t[vjs.expando];
    if (e) {
        delete vjs.cache[e];
        try {
            delete t[vjs.expando]
        } catch (s) {
            t.removeAttribute ? t.removeAttribute(vjs.expando) : t[vjs.expando] = null
        }
    }
}, vjs.isEmpty = function(t) {
    for (var e in t)
        if (null !== t[e]) return !1;
    return !0
}, vjs.addClass = function(t, e) {
    -1 == (" " + t.className + " ").indexOf(" " + e + " ") && (t.className = "" === t.className ? e : t.className + " " + e)
}, vjs.removeClass = function(t, e) {
    var s, o;
    if (-1 != t.className.indexOf(e)) {
        for (s = t.className.split(" "), o = s.length - 1; o >= 0; o--) s[o] === e && s.splice(o, 1);
        t.className = s.join(" ")
    }
}, vjs.TEST_VID = vjs.createEl("video"), vjs.USER_AGENT = navigator.userAgent, vjs.IS_IPHONE = /iPhone/i.test(vjs.USER_AGENT), vjs.IS_IPAD = /iPad/i.test(vjs.USER_AGENT), vjs.IS_IPOD = /iPod/i.test(vjs.USER_AGENT), vjs.IS_IOS = vjs.IS_IPHONE || vjs.IS_IPAD || vjs.IS_IPOD, vjs.IOS_VERSION = function() {
    var t = vjs.USER_AGENT.match(/OS (\d+)_/i);
    return t && t[1] ? t[1] : void 0
}(), vjs.IS_ANDROID = /Android/i.test(vjs.USER_AGENT), vjs.ANDROID_VERSION = function() {
    var t, e, s = vjs.USER_AGENT.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i);
    return s ? (t = s[1] && parseFloat(s[1]), e = s[2] && parseFloat(s[2]), t && e ? parseFloat(s[1] + "." + s[2]) : t ? t : null) : null
}(), vjs.IS_OLD_ANDROID = vjs.IS_ANDROID && /webkit/i.test(vjs.USER_AGENT) && vjs.ANDROID_VERSION < 2.3, vjs.IS_FIREFOX = /Firefox/i.test(vjs.USER_AGENT), vjs.IS_CHROME = /Chrome/i.test(vjs.USER_AGENT), vjs.TOUCH_ENABLED = !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch), vjs.setElementAttributes = function(t, e) {
    vjs.obj.each(e, function(e, s) {
        null === s || "undefined" == typeof s || s === !1 ? t.removeAttribute(e) : t.setAttribute(e, s === !0 ? "" : s)
    })
}, vjs.getElementAttributes = function(t) {
    var e, s, o, n, i;
    if (e = {}, s = ",autoplay,controls,loop,muted,default,", t && t.attributes && t.attributes.length > 0) {
        o = t.attributes;
        for (var r = o.length - 1; r >= 0; r--) n = o[r].name, i = o[r].value, ("boolean" == typeof t[n] || -1 !== s.indexOf("," + n + ",")) && (i = null !== i ? !0 : !1), e[n] = i
    }
    return e
}, vjs.getComputedDimension = function(t, e) {
    var s = "";
    return document.defaultView && document.defaultView.getComputedStyle ? s = document.defaultView.getComputedStyle(t, "").getPropertyValue(e) : t.currentStyle && (s = t["client" + e.substr(0, 1).toUpperCase() + e.substr(1)] + "px"), s
}, vjs.insertFirst = function(t, e) {
    e.firstChild ? e.insertBefore(t, e.firstChild) : e.appendChild(t)
}, vjs.browser = {}, vjs.el = function(t) {
    return 0 === t.indexOf("#") && (t = t.slice(1)), document.getElementById(t)
}, vjs.formatTime = function(t, e) {
    e = e || t;
    var s = Math.floor(t % 60),
        o = Math.floor(t / 60 % 60),
        n = Math.floor(t / 3600),
        i = Math.floor(e / 60 % 60),
        r = Math.floor(e / 3600);
    return (isNaN(t) || 1 / 0 === t) && (n = o = s = "-"), n = n > 0 || r > 0 ? n + ":" : "", o = ((n || i >= 10) && 10 > o ? "0" + o : o) + ":", s = 10 > s ? "0" + s : s, n + o + s
}, vjs.blockTextSelection = function() {
    document.body.focus(), document.onselectstart = function() {
        return !1
    }
}, vjs.unblockTextSelection = function() {
    document.onselectstart = function() {
        return !0
    }
}, vjs.trim = function(t) {
    return (t + "").replace(/^\s+|\s+$/g, "")
}, vjs.round = function(t, e) {
    return e || (e = 0), Math.round(t * Math.pow(10, e)) / Math.pow(10, e)
}, vjs.createTimeRange = function(t, e) {
    return {
        length: 1,
        start: function() {
            return t
        },
        end: function() {
            return e
        }
    }
}, vjs.get = function(t, e, s, o) {
    var n, i, r, a, l;
    s = s || function() {}, "undefined" == typeof XMLHttpRequest && (window.XMLHttpRequest = function() {
        try {
            return new window.ActiveXObject("Msxml2.XMLHTTP.6.0")
        } catch (t) {}
        try {
            return new window.ActiveXObject("Msxml2.XMLHTTP.3.0")
        } catch (e) {}
        try {
            return new window.ActiveXObject("Msxml2.XMLHTTP")
        } catch (s) {}
        throw new Error("This browser does not support XMLHttpRequest.")
    }), i = new XMLHttpRequest, r = vjs.parseUrl(t), a = window.location, l = r.protocol + r.host !== a.protocol + a.host, !l || !window.XDomainRequest || "withCredentials" in i ? (n = "file:" == r.protocol || "file:" == a.protocol, i.onreadystatechange = function() {
        4 === i.readyState && (200 === i.status || n && 0 === i.status ? e(i.responseText) : s(i.responseText))
    }) : (i = new window.XDomainRequest, i.onload = function() {
        e(i.responseText)
    }, i.onerror = s, i.onprogress = function() {}, i.ontimeout = s);
    try {
        i.open("GET", t, !0), o && (i.withCredentials = !0)
    } catch (c) {
        return s(c), void 0
    }
    try {
        i.send()
    } catch (c) {
        s(c)
    }
}, vjs.setLocalStorage = function(t, e) {
    try {
        var s = window.localStorage || !1;
        if (!s) return;
        s[t] = e
    } catch (o) {
        22 == o.code || 1014 == o.code ? vjs.log("LocalStorage Full (VideoJS)", o) : 18 == o.code ? vjs.log("LocalStorage not allowed (VideoJS)", o) : vjs.log("LocalStorage Error (VideoJS)", o)
    }
}, vjs.getAbsoluteURL = function(t) {
    return t.match(/^https?:\/\//) || (t = vjs.createEl("div", {
        innerHTML: '<a href="' + t + '">x</a>'
    }).firstChild.href), t
}, vjs.parseUrl = function(t) {
    var e, s, o, n, i;
    n = ["protocol", "hostname", "port", "pathname", "search", "hash", "host"], s = vjs.createEl("a", {
        href: t
    }), o = "" === s.host && "file:" !== s.protocol, o && (e = vjs.createEl("div"), e.innerHTML = '<a href="' + t + '"></a>', s = e.firstChild, e.setAttribute("style", "display:none; position:absolute;"), document.body.appendChild(e)), i = {};
    for (var r = 0; r < n.length; r++) i[n[r]] = s[n[r]];
    return o && document.body.removeChild(e), i
}, vjs.log = function() {
    _logType(null, arguments)
}, vjs.log.history = [], vjs.log.error = function() {
    _logType("error", arguments)
}, vjs.log.warn = function() {
    _logType("warn", arguments)
}, vjs.findPosition = function(t) {
    var e, s, o, n, i, r, a, l, c;
    return t.getBoundingClientRect && t.parentNode && (e = t.getBoundingClientRect()), e ? (s = document.documentElement, o = document.body, n = s.clientLeft || o.clientLeft || 0, i = window.pageXOffset || o.scrollLeft, r = e.left + i - n, a = s.clientTop || o.clientTop || 0, l = window.pageYOffset || o.scrollTop, c = e.top + l - a, {
        left: vjs.round(r),
        top: vjs.round(c)
    }) : {
        left: 0,
        top: 0
    }
}, vjs.arr = {}, vjs.arr.forEach = function(t, e, s) {
    if (vjs.obj.isArray(t) && e instanceof Function)
        for (var o = 0, n = t.length; n > o; ++o) e.call(s || vjs, t[o], o, t);
    return t
}, vjs.util = {}, vjs.util.mergeOptions = function(t, e) {
    var s, o, n;
    t = vjs.obj.copy(t);
    for (s in e) e.hasOwnProperty(s) && (o = t[s], n = e[s], t[s] = vjs.obj.isPlain(o) && vjs.obj.isPlain(n) ? vjs.util.mergeOptions(o, n) : e[s]);
    return t
}, vjs.Component = vjs.CoreObject.extend({
    init: function(t, e, s) {
        this.player_ = t, this.options_ = vjs.obj.copy(this.options_), e = this.options(e), this.id_ = e.id || (e.el && e.el.id ? e.el.id : t.id() + "_component_" + vjs.guid++), this.name_ = e.name || null, this.el_ = e.el || this.createEl(), this.children_ = [], this.childIndex_ = {}, this.childNameIndex_ = {}, this.initChildren(), this.ready(s), e.reportTouchActivity !== !1 && this.enableTouchActivity()
    }
}), vjs.Component.prototype.dispose = function() {
    if (this.trigger({
            type: "dispose",
            bubbles: !1
        }), this.children_)
        for (var t = this.children_.length - 1; t >= 0; t--) this.children_[t].dispose && this.children_[t].dispose();
    this.children_ = null, this.childIndex_ = null, this.childNameIndex_ = null, this.off(), this.el_.parentNode && this.el_.parentNode.removeChild(this.el_), vjs.removeData(this.el_), this.el_ = null
}, vjs.Component.prototype.player_ = !0, vjs.Component.prototype.player = function() {
    return this.player_
}, vjs.Component.prototype.options_, vjs.Component.prototype.options = function(t) {
    return void 0 === t ? this.options_ : this.options_ = vjs.util.mergeOptions(this.options_, t)
}, vjs.Component.prototype.el_, vjs.Component.prototype.createEl = function(t, e) {
    return vjs.createEl(t, e)
}, vjs.Component.prototype.localize = function(t) {
    var e = this.player_.language(),
        s = this.player_.languages();
    return s && s[e] && s[e][t] ? s[e][t] : t
}, vjs.Component.prototype.el = function() {
    return this.el_
}, vjs.Component.prototype.contentEl_, vjs.Component.prototype.contentEl = function() {
    return this.contentEl_ || this.el_
}, vjs.Component.prototype.id_, vjs.Component.prototype.id = function() {
    return this.id_
}, vjs.Component.prototype.name_, vjs.Component.prototype.name = function() {
    return this.name_
}, vjs.Component.prototype.children_, vjs.Component.prototype.children = function() {
    return this.children_
}, vjs.Component.prototype.childIndex_, vjs.Component.prototype.getChildById = function(t) {
    return this.childIndex_[t]
}, vjs.Component.prototype.childNameIndex_, vjs.Component.prototype.getChild = function(t) {
    return this.childNameIndex_[t]
}, vjs.Component.prototype.addChild = function(t, e) {
    var s, o, n;
    return "string" == typeof t ? (n = t, e = e || {}, o = e.componentClass || vjs.capitalize(n), e.name = n, s = new window.videojs[o](this.player_ || this, e)) : s = t, this.children_.push(s), "function" == typeof s.id && (this.childIndex_[s.id()] = s), n = n || s.name && s.name(), n && (this.childNameIndex_[n] = s), "function" == typeof s.el && s.el() && this.contentEl().appendChild(s.el()), s
}, vjs.Component.prototype.removeChild = function(t) {
    if ("string" == typeof t && (t = this.getChild(t)), t && this.children_) {
        for (var e = !1, s = this.children_.length - 1; s >= 0; s--)
            if (this.children_[s] === t) {
                e = !0, this.children_.splice(s, 1);
                break
            }
        if (e) {
            this.childIndex_[t.id] = null, this.childNameIndex_[t.name] = null;
            var o = t.el();
            o && o.parentNode === this.contentEl() && this.contentEl().removeChild(t.el())
        }
    }
}, vjs.Component.prototype.initChildren = function() {
    var t, e, s, o, n;
    if (t = this, e = this.options().children)
        if (vjs.obj.isArray(e))
            for (var i = 0; i < e.length; i++) s = e[i], "string" == typeof s ? (o = s, n = {}) : (o = s.name, n = s), t[o] = t.addChild(o, n);
        else vjs.obj.each(e, function(e, s) {
            s !== !1 && (t[e] = t.addChild(e, s))
        })
}, vjs.Component.prototype.buildCSSClass = function() {
    return ""
}, vjs.Component.prototype.on = function(t, e) {
    return vjs.on(this.el_, t, vjs.bind(this, e)), this
}, vjs.Component.prototype.off = function(t, e) {
    return vjs.off(this.el_, t, e), this
}, vjs.Component.prototype.one = function(t, e) {
    return vjs.one(this.el_, t, vjs.bind(this, e)), this
}, vjs.Component.prototype.trigger = function(t) {
    return vjs.trigger(this.el_, t), this
}, vjs.Component.prototype.isReady_, vjs.Component.prototype.isReadyOnInitFinish_ = !0, vjs.Component.prototype.readyQueue_, vjs.Component.prototype.ready = function(t) {
    return t && (this.isReady_ ? t.call(this) : (void 0 === this.readyQueue_ && (this.readyQueue_ = []), this.readyQueue_.push(t))), this
}, vjs.Component.prototype.triggerReady = function() {
    this.isReady_ = !0;
    var t = this.readyQueue_;
    if (t && t.length > 0) {
        for (var e = 0, s = t.length; s > e; e++) t[e].call(this);
        this.readyQueue_ = [], this.trigger("ready")
    }
}, vjs.Component.prototype.addClass = function(t) {
    return vjs.addClass(this.el_, t), this
}, vjs.Component.prototype.removeClass = function(t) {
    return vjs.removeClass(this.el_, t), this
}, vjs.Component.prototype.show = function() {
    return this.el_.style.display = "block", this
}, vjs.Component.prototype.hide = function() {
    return this.el_.style.display = "none", this
}, vjs.Component.prototype.lockShowing = function() {
    return this.addClass("vjs-lock-showing"), this
}, vjs.Component.prototype.unlockShowing = function() {
    return this.removeClass("vjs-lock-showing"), this
}, vjs.Component.prototype.disable = function() {
    this.hide(), this.show = function() {}
}, vjs.Component.prototype.width = function(t, e) {
    return this.dimension("width", t, e)
}, vjs.Component.prototype.height = function(t, e) {
    return this.dimension("height", t, e)
}, vjs.Component.prototype.dimensions = function(t, e) {
    return this.width(t, !0).height(e)
}, vjs.Component.prototype.dimension = function(t, e, s) {
    if (void 0 !== e) return (null === e || vjs.isNaN(e)) && (e = 0), this.el_.style[t] = -1 !== ("" + e).indexOf("%") || -1 !== ("" + e).indexOf("px") ? e : "auto" === e ? "" : e + "px", s || this.trigger("resize"), this;
    if (!this.el_) return 0;
    var o = this.el_.style[t],
        n = o.indexOf("px");
    return -1 !== n ? parseInt(o.slice(0, n), 10) : parseInt(this.el_["offset" + vjs.capitalize(t)], 10)
}, vjs.Component.prototype.onResize, vjs.Component.prototype.emitTapEvents = function() {
    var t, e, s, o, n, i, r, a, l;
    t = 0, e = null, l = 22, this.on("touchstart", function(s) {
        1 === s.touches.length && (e = s.touches[0], t = (new Date).getTime(), o = !0)
    }), this.on("touchmove", function(t) {
        t.touches.length > 1 ? o = !1 : e && (i = t.touches[0].pageX - e.pageX, r = t.touches[0].pageY - e.pageY, a = Math.sqrt(i * i + r * r), a > l && (o = !1))
    }), n = function() {
        o = !1
    }, this.on("touchleave", n), this.on("touchcancel", n), this.on("touchend", function(n) {
        e = null, o === !0 && (s = (new Date).getTime() - t, 250 > s && (n.preventDefault(), this.trigger("tap")))
    })
}, vjs.Component.prototype.enableTouchActivity = function() {
    var t, e, s;
    t = vjs.bind(this.player(), this.player().reportUserActivity), this.on("touchstart", function() {
        t(), clearInterval(e), e = setInterval(t, 250)
    }), s = function() {
        t(), clearInterval(e)
    }, this.on("touchmove", t), this.on("touchend", s), this.on("touchcancel", s)
}, vjs.Button = vjs.Component.extend({
    init: function(t, e) {
        vjs.Component.call(this, t, e), this.emitTapEvents(), this.on("tap", this.onClick), this.on("click", this.onClick), this.on("focus", this.onFocus), this.on("blur", this.onBlur)
    }
}), vjs.Button.prototype.createEl = function(t, e) {
    var s;
    return e = vjs.obj.merge({
        className: this.buildCSSClass(),
        role: "button",
        "aria-live": "polite",
        tabIndex: 0
    }, e), s = vjs.Component.prototype.createEl.call(this, t, e), e.innerHTML || (this.contentEl_ = vjs.createEl("div", {
        className: "vjs-control-content"
    }), this.controlText_ = vjs.createEl("span", {
        className: "vjs-control-text",
        innerHTML: this.localize(this.buttonText) || "Need Text"
    }), this.contentEl_.appendChild(this.controlText_), s.appendChild(this.contentEl_)), s
}, vjs.Button.prototype.buildCSSClass = function() {
    return "vjs-control " + vjs.Component.prototype.buildCSSClass.call(this)
}, vjs.Button.prototype.onClick = function() {}, vjs.Button.prototype.onFocus = function() {
    vjs.on(document, "keydown", vjs.bind(this, this.onKeyPress))
}, vjs.Button.prototype.onKeyPress = function(t) {
    (32 == t.which || 13 == t.which) && (t.preventDefault(), this.onClick())
}, vjs.Button.prototype.onBlur = function() {
    vjs.off(document, "keydown", vjs.bind(this, this.onKeyPress))
}, vjs.Slider = vjs.Component.extend({
    init: function(t, e) {
        vjs.Component.call(this, t, e), this.bar = this.getChild(this.options_.barName), this.handle = this.getChild(this.options_.handleName), this.on("mousedown", this.onMouseDown), this.on("touchstart", this.onMouseDown), this.on("focus", this.onFocus), this.on("blur", this.onBlur), this.on("click", this.onClick), this.player_.on("controlsvisible", vjs.bind(this, this.update)), t.on(this.playerEvent, vjs.bind(this, this.update)), this.boundEvents = {}, this.boundEvents.move = vjs.bind(this, this.onMouseMove), this.boundEvents.end = vjs.bind(this, this.onMouseUp)
    }
}), vjs.Slider.prototype.createEl = function(t, e) {
    return e = e || {}, e.className = e.className + " vjs-slider", e = vjs.obj.merge({
        role: "slider",
        "aria-valuenow": 0,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        tabIndex: 0
    }, e), vjs.Component.prototype.createEl.call(this, t, e)
}, vjs.Slider.prototype.onMouseDown = function(t) {
    t.preventDefault(), vjs.blockTextSelection(), this.addClass("vjs-sliding"), vjs.on(document, "mousemove", this.boundEvents.move), vjs.on(document, "mouseup", this.boundEvents.end), vjs.on(document, "touchmove", this.boundEvents.move), vjs.on(document, "touchend", this.boundEvents.end), this.onMouseMove(t)
}, vjs.Slider.prototype.onMouseMove = function() {}, vjs.Slider.prototype.onMouseUp = function() {
    vjs.unblockTextSelection(), this.removeClass("vjs-sliding"), vjs.off(document, "mousemove", this.boundEvents.move, !1), vjs.off(document, "mouseup", this.boundEvents.end, !1), vjs.off(document, "touchmove", this.boundEvents.move, !1), vjs.off(document, "touchend", this.boundEvents.end, !1), this.update()
}, vjs.Slider.prototype.update = function() {
    if (this.el_) {
        var t, e = this.getPercent(),
            s = this.handle,
            o = this.bar;
        if (isNaN(e) && (e = 0), t = e, s) {
            var n = this.el_,
                i = n.offsetWidth,
                r = s.el().offsetWidth,
                a = r ? r / i : 0,
                l = 1 - a,
                c = e * l;
            t = c + a / 2, s.el().style.left = vjs.round(100 * c, 2) + "%"
        }
        o && (o.el().style.width = vjs.round(100 * t, 2) + "%")
    }
}, vjs.Slider.prototype.calculateDistance = function(t) {
    var e, s, o, n, i, r, a, l, c;
    if (e = this.el_, s = vjs.findPosition(e), i = r = e.offsetWidth, a = this.handle, this.options().vertical) {
        if (n = s.top, c = t.changedTouches ? t.changedTouches[0].pageY : t.pageY, a) {
            var u = a.el().offsetHeight;
            n += u / 2, r -= u
        }
        return Math.max(0, Math.min(1, (n - c + r) / r))
    }
    if (o = s.left, l = t.changedTouches ? t.changedTouches[0].pageX : t.pageX, a) {
        var p = a.el().offsetWidth;
        o += p / 2, i -= p
    }
    return Math.max(0, Math.min(1, (l - o) / i))
}, vjs.Slider.prototype.onFocus = function() {
    vjs.on(document, "keyup", vjs.bind(this, this.onKeyPress))
}, vjs.Slider.prototype.onKeyPress = function(t) {
    37 == t.which || 40 == t.which ? (t.preventDefault(), this.stepBack()) : (38 == t.which || 39 == t.which) && (t.preventDefault(), this.stepForward())
}, vjs.Slider.prototype.onBlur = function() {
    vjs.off(document, "keyup", vjs.bind(this, this.onKeyPress))
}, vjs.Slider.prototype.onClick = function(t) {
    t.stopImmediatePropagation(), t.preventDefault()
}, vjs.SliderHandle = vjs.Component.extend(), vjs.SliderHandle.prototype.defaultValue = 0, vjs.SliderHandle.prototype.createEl = function(t, e) {
    return e = e || {}, e.className = e.className + " vjs-slider-handle", e = vjs.obj.merge({
        innerHTML: '<span class="vjs-control-text">' + this.defaultValue + "</span>"
    }, e), vjs.Component.prototype.createEl.call(this, "div", e)
}, vjs.Menu = vjs.Component.extend(), vjs.Menu.prototype.addItem = function(t) {
    this.addChild(t), t.on("click", vjs.bind(this, function() {
        this.unlockShowing()
    }))
}, vjs.Menu.prototype.createEl = function() {
    var t = this.options().contentElType || "ul";
    this.contentEl_ = vjs.createEl(t, {
        className: "vjs-menu-content"
    });
    var e = vjs.Component.prototype.createEl.call(this, "div", {
        append: this.contentEl_,
        className: "vjs-menu"
    });
    return e.appendChild(this.contentEl_), vjs.on(e, "click", function(t) {
        t.preventDefault(), t.stopImmediatePropagation()
    }), e
}, vjs.MenuItem = vjs.Button.extend({
    init: function(t, e) {
        vjs.Button.call(this, t, e), this.selected(e.selected)
    }
}), vjs.MenuItem.prototype.createEl = function(t, e) {
    return vjs.Button.prototype.createEl.call(this, "li", vjs.obj.merge({
        className: "vjs-menu-item",
        innerHTML: this.options_.label
    }, e))
}, vjs.MenuItem.prototype.onClick = function() {
    this.selected(!0)
}, vjs.MenuItem.prototype.selected = function(t) {
    t ? (this.addClass("vjs-selected"), this.el_.setAttribute("aria-selected", !0)) : (this.removeClass("vjs-selected"), this.el_.setAttribute("aria-selected", !1))
}, vjs.MenuButton = vjs.Button.extend({
    init: function(t, e) {
        vjs.Button.call(this, t, e), this.menu = this.createMenu(), this.addChild(this.menu), this.items && 0 === this.items.length && this.hide(), this.on("keyup", this.onKeyPress), this.el_.setAttribute("aria-haspopup", !0), this.el_.setAttribute("role", "button")
    }
}), vjs.MenuButton.prototype.buttonPressed_ = !1, vjs.MenuButton.prototype.createMenu = function() {
    var t = new vjs.Menu(this.player_);
    if (this.options().title && t.contentEl().appendChild(vjs.createEl("li", {
            className: "vjs-menu-title",
            innerHTML: vjs.capitalize(this.options().title),
            tabindex: -1
        })), this.items = this.createItems(), this.items)
        for (var e = 0; e < this.items.length; e++) t.addItem(this.items[e]);
    return t
}, vjs.MenuButton.prototype.createItems = function() {}, vjs.MenuButton.prototype.buildCSSClass = function() {
    return this.className + " vjs-menu-button " + vjs.Button.prototype.buildCSSClass.call(this)
}, vjs.MenuButton.prototype.onFocus = function() {}, vjs.MenuButton.prototype.onBlur = function() {}, vjs.MenuButton.prototype.onClick = function() {
    this.one("mouseout", vjs.bind(this, function() {
        this.menu.unlockShowing(), this.el_.blur()
    })), this.buttonPressed_ ? this.unpressButton() : this.pressButton()
}, vjs.MenuButton.prototype.onKeyPress = function(t) {
    t.preventDefault(), 32 == t.which || 13 == t.which ? this.buttonPressed_ ? this.unpressButton() : this.pressButton() : 27 == t.which && this.buttonPressed_ && this.unpressButton()
}, vjs.MenuButton.prototype.pressButton = function() {
    this.buttonPressed_ = !0, this.menu.lockShowing(), this.el_.setAttribute("aria-pressed", !0), this.items && this.items.length > 0 && this.items[0].el().focus()
}, vjs.MenuButton.prototype.unpressButton = function() {
    this.buttonPressed_ = !1, this.menu.unlockShowing(), this.el_.setAttribute("aria-pressed", !1)
}, vjs.MediaError = function(t) {
    "number" == typeof t ? this.code = t : "string" == typeof t ? this.message = t : "object" == typeof t && vjs.obj.merge(this, t), this.message || (this.message = vjs.MediaError.defaultMessages[this.code] || "")
}, vjs.MediaError.prototype.code = 0, vjs.MediaError.prototype.message = "", vjs.MediaError.prototype.status = null, vjs.MediaError.errorTypes = ["MEDIA_ERR_CUSTOM", "MEDIA_ERR_ABORTED", "MEDIA_ERR_NETWORK", "MEDIA_ERR_DECODE", "MEDIA_ERR_SRC_NOT_SUPPORTED", "MEDIA_ERR_ENCRYPTED"], vjs.MediaError.defaultMessages = {
    1: "You aborted the video playback",
    2: "A network error caused the video download to fail part-way.",
    3: "The video playback was aborted due to a corruption problem or because the video used features your browser did not support.",
    4: "The video could not be loaded, either because the server or network failed or because the format is not supported.",
    5: "The video is encrypted and we do not have the keys to decrypt it."
};
for (var errNum = 0; errNum < vjs.MediaError.errorTypes.length; errNum++) vjs.MediaError[vjs.MediaError.errorTypes[errNum]] = errNum, vjs.MediaError.prototype[vjs.MediaError.errorTypes[errNum]] = errNum;
! function() {
    var t, e, s, o;
    for (vjs.browser.fullscreenAPI, t = [
            ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
            ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"],
            ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"],
            ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"],
            ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
        ], e = t[0], o = 0; o < t.length; o++)
        if (t[o][1] in document) {
            s = t[o];
            break
        }
    if (s)
        for (vjs.browser.fullscreenAPI = {}, o = 0; o < s.length; o++) vjs.browser.fullscreenAPI[e[o]] = s[o]
}(), vjs.Player = vjs.Component.extend({
    init: function(t, e, s) {
        this.tag = t, t.id = t.id || "vjs_video_" + vjs.guid++, this.tagAttributes = t && vjs.getElementAttributes(t), e = vjs.obj.merge(this.getTagSettings(t), e), this.language_ = e.language || vjs.options.language, this.languages_ = e.languages || vjs.options.languages, this.cache_ = {}, this.poster_ = e.poster, this.controls_ = e.controls, t.controls = !1, e.reportTouchActivity = !1, vjs.Component.call(this, this, e, s), this.controls() ? this.addClass("vjs-controls-enabled") : this.addClass("vjs-controls-disabled"), vjs.players[this.id_] = this, e.plugins && vjs.obj.each(e.plugins, function(t, e) {
            this[t](e)
        }, this), this.listenForUserActivity()
    }
}), vjs.Player.prototype.language_, vjs.Player.prototype.language = function(t) {
    return void 0 === t ? this.language_ : (this.language_ = t, this)
}, vjs.Player.prototype.languages_, vjs.Player.prototype.languages = function() {
    return this.languages_
}, vjs.Player.prototype.options_ = vjs.options, vjs.Player.prototype.dispose = function() {
    this.trigger("dispose"), this.off("dispose"), vjs.players[this.id_] = null, this.tag && this.tag.player && (this.tag.player = null), this.el_ && this.el_.player && (this.el_.player = null), this.tech && this.tech.dispose(), vjs.Component.prototype.dispose.call(this)
}, vjs.Player.prototype.getTagSettings = function(t) {
    var e = {
        sources: [],
        tracks: []
    };
    if (vjs.obj.merge(e, vjs.getElementAttributes(t)), t.hasChildNodes()) {
        var s, o, n, i, r;
        for (s = t.childNodes, i = 0, r = s.length; r > i; i++) o = s[i], n = o.nodeName.toLowerCase(), "source" === n ? e.sources.push(vjs.getElementAttributes(o)) : "track" === n && e.tracks.push(vjs.getElementAttributes(o))
    }
    return e
}, vjs.Player.prototype.createEl = function() {
    var t, e = this.el_ = vjs.Component.prototype.createEl.call(this, "div"),
        s = this.tag;
    if (s.removeAttribute("width"), s.removeAttribute("height"), s.hasChildNodes()) {
        var o, n, i, r, a, l;
        for (o = s.childNodes, n = o.length, l = []; n--;) r = o[n], a = r.nodeName.toLowerCase(), "track" === a && l.push(r);
        for (i = 0; i < l.length; i++) s.removeChild(l[i])
    }
    return t = vjs.getElementAttributes(s), vjs.obj.each(t, function(s) {
        e.setAttribute(s, t[s])
    }), s.id += "_html5_api", s.className = "vjs-tech", s.player = e.player = this, this.addClass("vjs-paused"), this.width(this.options_.width, !0), this.height(this.options_.height, !0), s.parentNode && s.parentNode.insertBefore(e, s), vjs.insertFirst(s, e), this.el_ = e, this.on("loadstart", this.onLoadStart), this.on("waiting", this.onWaiting), this.on(["canplay", "canplaythrough", "playing", "ended"], this.onWaitEnd), this.on("seeking", this.onSeeking), this.on("seeked", this.onSeeked), this.on("ended", this.onEnded), this.on("play", this.onPlay), this.on("firstplay", this.onFirstPlay), this.on("pause", this.onPause), this.on("progress", this.onProgress), this.on("durationchange", this.onDurationChange), this.on("fullscreenchange", this.onFullscreenChange), e
}, vjs.Player.prototype.loadTech = function(t, e) {
    this.tech && this.unloadTech(), "Html5" !== t && this.tag && (vjs.Html5.disposeMediaElement(this.tag), this.tag = null), this.techName = t, this.isReady_ = !1;
    var s = function() {
            this.player_.triggerReady()
        },
        o = vjs.obj.merge({
            source: e,
            parentEl: this.el_
        }, this.options_[t.toLowerCase()]);
    e && (this.currentType_ = e.type, e.src == this.cache_.src && this.cache_.currentTime > 0 && (o.startTime = this.cache_.currentTime), this.cache_.src = e.src), this.tech = new window.videojs[t](this, o), this.tech.ready(s)
}, vjs.Player.prototype.unloadTech = function() {
    this.isReady_ = !1, this.tech.dispose(), this.tech = !1
}, vjs.Player.prototype.onLoadStart = function() {
    this.error(null), this.paused() ? (this.hasStarted(!1), this.one("play", function() {
        this.hasStarted(!0)
    })) : this.trigger("firstplay")
}, vjs.Player.prototype.hasStarted_ = !1, vjs.Player.prototype.hasStarted = function(t) {
    return void 0 !== t ? (this.hasStarted_ !== t && (this.hasStarted_ = t, t ? (this.addClass("vjs-has-started"), this.trigger("firstplay")) : this.removeClass("vjs-has-started")), this) : this.hasStarted_
}, vjs.Player.prototype.onLoadedMetaData, vjs.Player.prototype.onLoadedData, vjs.Player.prototype.onLoadedAllData, vjs.Player.prototype.onPlay = function() {
    this.removeClass("vjs-paused"), this.addClass("vjs-playing")
}, vjs.Player.prototype.onWaiting = function() {
    this.addClass("vjs-waiting")
}, vjs.Player.prototype.onWaitEnd = function() {
    this.removeClass("vjs-waiting")
}, vjs.Player.prototype.onSeeking = function() {
    this.addClass("vjs-seeking")
}, vjs.Player.prototype.onSeeked = function() {
    this.removeClass("vjs-seeking")
}, vjs.Player.prototype.onFirstPlay = function() {
    this.options_.starttime && this.currentTime(this.options_.starttime), this.addClass("vjs-has-started")
}, vjs.Player.prototype.onPause = function() {
    this.removeClass("vjs-playing"), this.addClass("vjs-paused")
}, vjs.Player.prototype.onTimeUpdate, vjs.Player.prototype.onProgress = function() {
    1 == this.bufferedPercent() && this.trigger("loadedalldata")
}, vjs.Player.prototype.onEnded = function() {
    this.options_.loop && (this.currentTime(0), this.play())
}, vjs.Player.prototype.onDurationChange = function() {
    var t = this.techGet("duration");
    t && (0 > t && (t = 1 / 0), this.duration(t), 1 / 0 === t ? this.addClass("vjs-live") : this.removeClass("vjs-live"))
}, vjs.Player.prototype.onVolumeChange, vjs.Player.prototype.onFullscreenChange = function() {
    this.isFullscreen() ? this.addClass("vjs-fullscreen") : this.removeClass("vjs-fullscreen")
}, vjs.Player.prototype.cache_, vjs.Player.prototype.getCache = function() {
    return this.cache_
}, vjs.Player.prototype.techCall = function(t, e) {
    if (this.tech && !this.tech.isReady_) this.tech.ready(function() {
        this[t](e)
    });
    else try {
        this.tech[t](e)
    } catch (s) {
        throw s
    }
}, vjs.Player.prototype.techGet = function(t) {
    if (this.tech && this.tech.isReady_) try {
        return this.tech[t]()
    } catch (e) {
        throw void 0 === this.tech[t] ? vjs.log("Video.js: " + t + " method not defined for " + this.techName + " playback technology.", e) : "TypeError" == e.name ? (vjs.log("Video.js: " + t + " unavailable on " + this.techName + " playback technology element.", e), this.tech.isReady_ = !1) : vjs.log(e), e
    }
}, vjs.Player.prototype.play = function() {
    return this.techCall("play"), this
}, vjs.Player.prototype.pause = function() {
    return this.techCall("pause"), this
}, vjs.Player.prototype.paused = function() {
    return this.techGet("paused") === !1 ? !1 : !0
}, vjs.Player.prototype.currentTime = function(t) {
    return void 0 !== t ? (this.techCall("setCurrentTime", t), this) : this.cache_.currentTime = this.techGet("currentTime") || 0
}, vjs.Player.prototype.duration = function(t) {
    return void 0 !== t ? (this.cache_.duration = parseFloat(t), this) : (void 0 === this.cache_.duration && this.onDurationChange(), this.cache_.duration || 0)
}, vjs.Player.prototype.remainingTime = function() {
    return this.duration() - this.currentTime()
}, vjs.Player.prototype.buffered = function() {
    var t = this.techGet("buffered");
    return t && t.length || (t = vjs.createTimeRange(0, 0)), t
}, vjs.Player.prototype.bufferedPercent = function() {
    var t, e, s = this.duration(),
        o = this.buffered(),
        n = 0;
    if (!s) return 0;
    for (var i = 0; i < o.length; i++) t = o.start(i), e = o.end(i), e > s && (e = s), n += e - t;
    return n / s
}, vjs.Player.prototype.bufferedEnd = function() {
    var t = this.buffered(),
        e = this.duration(),
        s = t.end(t.length - 1);
    return s > e && (s = e), s
}, vjs.Player.prototype.volume = function(t) {
    var e;
    return void 0 !== t ? (e = Math.max(0, Math.min(1, parseFloat(t))), this.cache_.volume = e, this.techCall("setVolume", e), vjs.setLocalStorage("volume", e), this) : (e = parseFloat(this.techGet("volume")), isNaN(e) ? 1 : e)
}, vjs.Player.prototype.muted = function(t) {
    return void 0 !== t ? (this.techCall("setMuted", t), this) : this.techGet("muted") || !1
}, vjs.Player.prototype.supportsFullScreen = function() {
    return this.techGet("supportsFullScreen") || !1
}, vjs.Player.prototype.isFullscreen_ = !1, vjs.Player.prototype.isFullscreen = function(t) {
    return void 0 !== t ? (this.isFullscreen_ = !!t, this) : this.isFullscreen_
}, vjs.Player.prototype.isFullScreen = function(t) {
    return vjs.log.warn('player.isFullScreen() has been deprecated, use player.isFullscreen() with a lowercase "s")'), this.isFullscreen(t)
}, vjs.Player.prototype.requestFullscreen = function() {
    var t = vjs.browser.fullscreenAPI;
    return this.isFullscreen(!0), t ? (vjs.on(document, t.fullscreenchange, vjs.bind(this, function() {
        this.isFullscreen(document[t.fullscreenElement]), this.isFullscreen() === !1 && vjs.off(document, t.fullscreenchange, arguments.callee), this.trigger("fullscreenchange")
    })), this.el_[t.requestFullscreen]()) : this.tech.supportsFullScreen() ? this.techCall("enterFullScreen") : (this.enterFullWindow(), this.trigger("fullscreenchange")), this
}, vjs.Player.prototype.requestFullScreen = function() {
    return vjs.log.warn('player.requestFullScreen() has been deprecated, use player.requestFullscreen() with a lowercase "s")'), this.requestFullscreen()
}, vjs.Player.prototype.exitFullscreen = function() {
    var t = vjs.browser.fullscreenAPI;
    return this.isFullscreen(!1), t ? document[t.exitFullscreen]() : this.tech.supportsFullScreen() ? this.techCall("exitFullScreen") : (this.exitFullWindow(), this.trigger("fullscreenchange")), this
}, vjs.Player.prototype.cancelFullScreen = function() {
    return vjs.log.warn("player.cancelFullScreen() has been deprecated, use player.exitFullscreen()"), this.exitFullscreen()
}, vjs.Player.prototype.enterFullWindow = function() {
    this.isFullWindow = !0, this.docOrigOverflow = document.documentElement.style.overflow, vjs.on(document, "keydown", vjs.bind(this, this.fullWindowOnEscKey)), document.documentElement.style.overflow = "hidden", vjs.addClass(document.body, "vjs-full-window"), this.trigger("enterFullWindow")
}, vjs.Player.prototype.fullWindowOnEscKey = function(t) {
    27 === t.keyCode && (this.isFullscreen() === !0 ? this.exitFullscreen() : this.exitFullWindow())
}, vjs.Player.prototype.exitFullWindow = function() {
    this.isFullWindow = !1, vjs.off(document, "keydown", this.fullWindowOnEscKey), document.documentElement.style.overflow = this.docOrigOverflow, vjs.removeClass(document.body, "vjs-full-window"), this.trigger("exitFullWindow")
}, vjs.Player.prototype.selectSource = function(t) {
    for (var e = 0, s = this.options_.techOrder; e < s.length; e++) {
        var o = vjs.capitalize(s[e]),
            n = window.videojs[o];
        if (n) {
            if (n.isSupported())
                for (var i = 0, r = t; i < r.length; i++) {
                    var a = r[i];
                    if (n.canPlaySource(a)) return {
                        source: a,
                        tech: o
                    }
                }
        } else vjs.log.error('The "' + o + '" tech is undefined. Skipped browser support check for that tech.')
    }
    return !1
}, vjs.Player.prototype.src = function(t) {
    return void 0 === t ? this.techGet("src") : (vjs.obj.isArray(t) ? this.sourceList_(t) : "string" == typeof t ? this.src({
        src: t
    }) : t instanceof Object && (t.type && !window.videojs[this.techName].canPlaySource(t) ? this.sourceList_([t]) : (this.cache_.src = t.src, this.currentType_ = t.type || "", this.ready(function() {
        this.techCall("src", t.src), "auto" == this.options_.preload && this.load(), this.options_.autoplay && this.play()
    }))), this)
}, vjs.Player.prototype.sourceList_ = function(t) {
    var e, s = this.selectSource(t);
    s ? s.tech === this.techName ? this.src(s.source) : this.loadTech(s.tech, s.source) : (e = setTimeout(vjs.bind(this, function() {
        this.error({
            code: 4,
            message: this.localize(this.options().notSupportedMessage)
        })
    }), 0), this.triggerReady(), this.on("dispose", function() {
        clearTimeout(e)
    }))
}, vjs.Player.prototype.load = function() {
    return this.techCall("load"), this
}, vjs.Player.prototype.currentSrc = function() {
    return this.techGet("currentSrc") || this.cache_.src || ""
}, vjs.Player.prototype.currentType = function() {
    return this.currentType_ || ""
}, vjs.Player.prototype.preload = function(t) {
    return void 0 !== t ? (this.techCall("setPreload", t), this.options_.preload = t, this) : this.techGet("preload")
}, vjs.Player.prototype.autoplay = function(t) {
    return void 0 !== t ? (this.techCall("setAutoplay", t), this.options_.autoplay = t, this) : this.techGet("autoplay", t)
}, vjs.Player.prototype.loop = function(t) {
    return void 0 !== t ? (this.techCall("setLoop", t), this.options_.loop = t, this) : this.techGet("loop")
}, vjs.Player.prototype.poster_, vjs.Player.prototype.poster = function(t) {
    return void 0 === t ? this.poster_ : (this.poster_ = t, this.techCall("setPoster", t), this.trigger("posterchange"), void 0)
}, vjs.Player.prototype.controls_, vjs.Player.prototype.controls = function(t) {
    return void 0 !== t ? (t = !!t, this.controls_ !== t && (this.controls_ = t, t ? (this.removeClass("vjs-controls-disabled"), this.addClass("vjs-controls-enabled"), this.trigger("controlsenabled")) : (this.removeClass("vjs-controls-enabled"), this.addClass("vjs-controls-disabled"), this.trigger("controlsdisabled"))), this) : this.controls_
}, vjs.Player.prototype.usingNativeControls_, vjs.Player.prototype.usingNativeControls = function(t) {
    return void 0 !== t ? (t = !!t, this.usingNativeControls_ !== t && (this.usingNativeControls_ = t, t ? (this.addClass("vjs-using-native-controls"), this.trigger("usingnativecontrols")) : (this.removeClass("vjs-using-native-controls"), this.trigger("usingcustomcontrols"))), this) : this.usingNativeControls_
}, vjs.Player.prototype.error_ = null, vjs.Player.prototype.error = function(t) {
    return void 0 === t ? this.error_ : null === t ? (this.error_ = t, this.removeClass("vjs-error"), this) : (this.error_ = t instanceof vjs.MediaError ? t : new vjs.MediaError(t), this.trigger("error"), this.addClass("vjs-error"), vjs.log.error("(CODE:" + this.error_.code + " " + vjs.MediaError.errorTypes[this.error_.code] + ")", this.error_.message, this.error_), this)
}, vjs.Player.prototype.ended = function() {
    return this.techGet("ended")
}, vjs.Player.prototype.seeking = function() {
    return this.techGet("seeking")
}, vjs.Player.prototype.userActivity_ = !0, vjs.Player.prototype.reportUserActivity = function() {
    this.userActivity_ = !0
}, vjs.Player.prototype.userActive_ = !0, vjs.Player.prototype.userActive = function(t) {
    return void 0 !== t ? (t = !!t, t !== this.userActive_ && (this.userActive_ = t, t ? (this.userActivity_ = !0, this.removeClass("vjs-user-inactive"), this.addClass("vjs-user-active"), this.trigger("useractive")) : (this.userActivity_ = !1, this.tech && this.tech.one("mousemove", function(t) {
        t.stopPropagation(), t.preventDefault()
    }), this.removeClass("vjs-user-active"), this.addClass("vjs-user-inactive"), this.trigger("userinactive"))), this) : this.userActive_
}, vjs.Player.prototype.listenForUserActivity = function() {
    var t, e, s, o, n, i, r, a, l;
    t = vjs.bind(this, this.reportUserActivity), e = function(e) {
        (e.screenX != a || e.screenY != l) && (a = e.screenX, l = e.screenY, t())
    }, s = function() {
        t(), clearInterval(o), o = setInterval(t, 250)
    }, n = function() {
        t(), clearInterval(o)
    }, this.on("mousedown", s), this.on("mousemove", e), this.on("mouseup", n), this.on("keydown", t), this.on("keyup", t), i = setInterval(vjs.bind(this, function() {
        if (this.userActivity_) {
            this.userActivity_ = !1, this.userActive(!0), clearTimeout(r);
            var t = this.options().inactivityTimeout;
            t > 0 && (r = setTimeout(vjs.bind(this, function() {
                this.userActivity_ || this.userActive(!1)
            }), t))
        }
    }), 250), this.on("dispose", function() {
        clearInterval(i), clearTimeout(r)
    })
}, vjs.Player.prototype.playbackRate = function(t) {
    return void 0 !== t ? (this.techCall("setPlaybackRate", t), this) : this.tech && this.tech.featuresPlaybackRate ? this.techGet("playbackRate") : 1
}, vjs.ControlBar = vjs.Component.extend(), vjs.ControlBar.prototype.options_ = {
    loadEvent: "play",
    children: {
        playToggle: {},
        currentTimeDisplay: {},
        timeDivider: {},
        durationDisplay: {},
        remainingTimeDisplay: {},
        liveDisplay: {},
        progressControl: {},
        fullscreenToggle: {},
        volumeControl: {},
        muteToggle: {},
        playbackRateMenuButton: {}
    }
}, vjs.ControlBar.prototype.createEl = function() {
    return vjs.createEl("div", {
        className: "vjs-control-bar"
    })
}, vjs.LiveDisplay = vjs.Component.extend({
    init: function(t, e) {
        vjs.Component.call(this, t, e)
    }
}), vjs.LiveDisplay.prototype.createEl = function() {
    var t = vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-live-controls vjs-control"
    });
    return this.contentEl_ = vjs.createEl("div", {
        className: "vjs-live-display",
        innerHTML: '<span class="vjs-control-text">' + this.localize("Stream Type") + "</span>" + this.localize("LIVE"),
        "aria-live": "off"
    }), t.appendChild(this.contentEl_), t
}, vjs.PlayToggle = vjs.Button.extend({
    init: function(t, e) {
        vjs.Button.call(this, t, e), t.on("play", vjs.bind(this, this.onPlay)), t.on("pause", vjs.bind(this, this.onPause))
    }
}), vjs.PlayToggle.prototype.buttonText = "Play", vjs.PlayToggle.prototype.buildCSSClass = function() {
    return "vjs-play-control " + vjs.Button.prototype.buildCSSClass.call(this)
}, vjs.PlayToggle.prototype.onClick = function() {
    this.player_.paused() ? this.player_.play() : this.player_.pause()
}, vjs.PlayToggle.prototype.onPlay = function() {
    vjs.removeClass(this.el_, "vjs-paused"), vjs.addClass(this.el_, "vjs-playing"), this.el_.children[0].children[0].innerHTML = this.localize("Pause")
}, vjs.PlayToggle.prototype.onPause = function() {
    vjs.removeClass(this.el_, "vjs-playing"), vjs.addClass(this.el_, "vjs-paused"), this.el_.children[0].children[0].innerHTML = this.localize("Play")
}, vjs.CurrentTimeDisplay = vjs.Component.extend({
    init: function(t, e) {
        vjs.Component.call(this, t, e), t.on("timeupdate", vjs.bind(this, this.updateContent))
    }
}), vjs.CurrentTimeDisplay.prototype.createEl = function() {
    var t = vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-current-time vjs-time-controls vjs-control"
    });
    return this.contentEl_ = vjs.createEl("div", {
        className: "vjs-current-time-display",
        innerHTML: '<span class="vjs-control-text">Current Time </span>0:00',
        "aria-live": "off"
    }), t.appendChild(this.contentEl_), t
}, vjs.CurrentTimeDisplay.prototype.updateContent = function() {
    var t = this.player_.scrubbing ? this.player_.getCache().currentTime : this.player_.currentTime();
    this.contentEl_.innerHTML = '<span class="vjs-control-text">' + this.localize("Current Time") + "</span> " + vjs.formatTime(t, this.player_.duration())
}, vjs.DurationDisplay = vjs.Component.extend({
    init: function(t, e) {
        vjs.Component.call(this, t, e), t.on("timeupdate", vjs.bind(this, this.updateContent))
    }
}), vjs.DurationDisplay.prototype.createEl = function() {
    var t = vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-duration vjs-time-controls vjs-control"
    });
    return this.contentEl_ = vjs.createEl("div", {
        className: "vjs-duration-display",
        innerHTML: '<span class="vjs-control-text">' + this.localize("Duration Time") + "</span> 0:00",
        "aria-live": "off"
    }), t.appendChild(this.contentEl_), t
}, vjs.DurationDisplay.prototype.updateContent = function() {
    var t = this.player_.duration();
    t && (this.contentEl_.innerHTML = '<span class="vjs-control-text">' + this.localize("Duration Time") + "</span> " + vjs.formatTime(t))
}, vjs.TimeDivider = vjs.Component.extend({
    init: function(t, e) {
        vjs.Component.call(this, t, e)
    }
}), vjs.TimeDivider.prototype.createEl = function() {
    return vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-time-divider",
        innerHTML: "<div><span>/</span></div>"
    })
}, vjs.RemainingTimeDisplay = vjs.Component.extend({
    init: function(t, e) {
        vjs.Component.call(this, t, e), t.on("timeupdate", vjs.bind(this, this.updateContent))
    }
}), vjs.RemainingTimeDisplay.prototype.createEl = function() {
    var t = vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-remaining-time vjs-time-controls vjs-control"
    });
    return this.contentEl_ = vjs.createEl("div", {
        className: "vjs-remaining-time-display",
        innerHTML: '<span class="vjs-control-text">' + this.localize("Remaining Time") + "</span> -0:00",
        "aria-live": "off"
    }), t.appendChild(this.contentEl_), t
}, vjs.RemainingTimeDisplay.prototype.updateContent = function() {
    this.player_.duration() && (this.contentEl_.innerHTML = '<span class="vjs-control-text">' + this.localize("Remaining Time") + "</span> -" + vjs.formatTime(this.player_.remainingTime()))
}, vjs.FullscreenToggle = vjs.Button.extend({
    init: function(t, e) {
        vjs.Button.call(this, t, e)
    }
}), vjs.FullscreenToggle.prototype.buttonText = "Fullscreen", vjs.FullscreenToggle.prototype.buildCSSClass = function() {
    return "vjs-fullscreen-control " + vjs.Button.prototype.buildCSSClass.call(this)
}, vjs.FullscreenToggle.prototype.onClick = function() {
    this.player_.isFullscreen() ? (this.player_.exitFullscreen(), this.controlText_.innerHTML = this.localize("Fullscreen")) : (this.player_.requestFullscreen(), this.controlText_.innerHTML = this.localize("Non-Fullscreen"))
}, vjs.ProgressControl = vjs.Component.extend({
    init: function(t, e) {
        vjs.Component.call(this, t, e)
    }
}), vjs.ProgressControl.prototype.options_ = {
    children: {
        seekBar: {}
    }
}, vjs.ProgressControl.prototype.createEl = function() {
    return vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-progress-control vjs-control"
    })
}, vjs.SeekBar = vjs.Slider.extend({
    init: function(t, e) {
        vjs.Slider.call(this, t, e), t.on("timeupdate", vjs.bind(this, this.updateARIAAttributes)), t.ready(vjs.bind(this, this.updateARIAAttributes))
    }
}), vjs.SeekBar.prototype.options_ = {
    children: {
        loadProgressBar: {},
        playProgressBar: {},
        seekHandle: {}
    },
    barName: "playProgressBar",
    handleName: "seekHandle"
}, vjs.SeekBar.prototype.playerEvent = "timeupdate", vjs.SeekBar.prototype.createEl = function() {
    return vjs.Slider.prototype.createEl.call(this, "div", {
        className: "vjs-progress-holder",
        "aria-label": "video progress bar"
    })
}, vjs.SeekBar.prototype.updateARIAAttributes = function() {
    var t = this.player_.scrubbing ? this.player_.getCache().currentTime : this.player_.currentTime();
    this.el_.setAttribute("aria-valuenow", vjs.round(100 * this.getPercent(), 2)), this.el_.setAttribute("aria-valuetext", vjs.formatTime(t, this.player_.duration()))
}, vjs.SeekBar.prototype.getPercent = function() {
    return this.player_.currentTime() / this.player_.duration()
}, vjs.SeekBar.prototype.onMouseDown = function(t) {
    vjs.Slider.prototype.onMouseDown.call(this, t), this.player_.scrubbing = !0, this.videoWasPlaying = !this.player_.paused(), this.player_.pause()
}, vjs.SeekBar.prototype.onMouseMove = function(t) {
    var e = this.calculateDistance(t) * this.player_.duration();
    e == this.player_.duration() && (e -= .1), this.player_.currentTime(e)
}, vjs.SeekBar.prototype.onMouseUp = function(t) {
    vjs.Slider.prototype.onMouseUp.call(this, t), this.player_.scrubbing = !1, this.videoWasPlaying && this.player_.play()
}, vjs.SeekBar.prototype.stepForward = function() {
    this.player_.currentTime(this.player_.currentTime() + 5)
}, vjs.SeekBar.prototype.stepBack = function() {
    this.player_.currentTime(this.player_.currentTime() - 5)
}, vjs.LoadProgressBar = vjs.Component.extend({
    init: function(t, e) {
        vjs.Component.call(this, t, e), t.on("progress", vjs.bind(this, this.update))
    }
}), vjs.LoadProgressBar.prototype.createEl = function() {
    return vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-load-progress",
        innerHTML: '<span class="vjs-control-text"><span>' + this.localize("Loaded") + "</span>: 0%</span>"
    })
}, vjs.LoadProgressBar.prototype.update = function() {
    var t, e, s, o, n = this.player_.buffered(),
        i = this.player_.duration(),
        r = this.player_.bufferedEnd(),
        a = this.el_.children,
        l = function(t, e) {
            var s = t / e || 0;
            return 100 * s + "%"
        };
    for (this.el_.style.width = l(r, i), t = 0; t < n.length; t++) e = n.start(t), s = n.end(t), o = a[t], o || (o = this.el_.appendChild(vjs.createEl())), o.style.left = l(e, r), o.style.width = l(s - e, r);
    for (t = a.length; t > n.length; t--) this.el_.removeChild(a[t - 1])
}, vjs.PlayProgressBar = vjs.Component.extend({
    init: function(t, e) {
        vjs.Component.call(this, t, e)
    }
}), vjs.PlayProgressBar.prototype.createEl = function() {
    return vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-play-progress",
        innerHTML: '<span class="vjs-control-text"><span>' + this.localize("Progress") + "</span>: 0%</span>"
    })
}, vjs.SeekHandle = vjs.SliderHandle.extend({
    init: function(t, e) {
        vjs.SliderHandle.call(this, t, e), t.on("timeupdate", vjs.bind(this, this.updateContent))
    }
}), vjs.SeekHandle.prototype.defaultValue = "00:00", vjs.SeekHandle.prototype.createEl = function() {
    return vjs.SliderHandle.prototype.createEl.call(this, "div", {
        className: "vjs-seek-handle",
        "aria-live": "off"
    })
}, vjs.SeekHandle.prototype.updateContent = function() {
    var t = this.player_.scrubbing ? this.player_.getCache().currentTime : this.player_.currentTime();
    this.el_.innerHTML = '<span class="vjs-control-text">' + vjs.formatTime(t, this.player_.duration()) + "</span>"
}, vjs.VolumeControl = vjs.Component.extend({
    init: function(t, e) {
        vjs.Component.call(this, t, e), t.tech && t.tech.featuresVolumeControl === !1 && this.addClass("vjs-hidden"), t.on("loadstart", vjs.bind(this, function() {
            t.tech.featuresVolumeControl === !1 ? this.addClass("vjs-hidden") : this.removeClass("vjs-hidden")
        }))
    }
}), vjs.VolumeControl.prototype.options_ = {
    children: {
        volumeBar: {}
    }
}, vjs.VolumeControl.prototype.createEl = function() {
    return vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-volume-control vjs-control"
    })
}, vjs.VolumeBar = vjs.Slider.extend({
    init: function(t, e) {
        vjs.Slider.call(this, t, e), t.on("volumechange", vjs.bind(this, this.updateARIAAttributes)), t.ready(vjs.bind(this, this.updateARIAAttributes))
    }
}), vjs.VolumeBar.prototype.updateARIAAttributes = function() {
    this.el_.setAttribute("aria-valuenow", vjs.round(100 * this.player_.volume(), 2)), this.el_.setAttribute("aria-valuetext", vjs.round(100 * this.player_.volume(), 2) + "%")
}, vjs.VolumeBar.prototype.options_ = {
    children: {
        volumeLevel: {},
        volumeHandle: {}
    },
    barName: "volumeLevel",
    handleName: "volumeHandle"
}, vjs.VolumeBar.prototype.playerEvent = "volumechange", vjs.VolumeBar.prototype.createEl = function() {
    return vjs.Slider.prototype.createEl.call(this, "div", {
        className: "vjs-volume-bar",
        "aria-label": "volume level"
    })
}, vjs.VolumeBar.prototype.onMouseMove = function(t) {
    this.player_.muted() && this.player_.muted(!1), this.player_.volume(this.calculateDistance(t))
}, vjs.VolumeBar.prototype.getPercent = function() {
    return this.player_.muted() ? 0 : this.player_.volume()
}, vjs.VolumeBar.prototype.stepForward = function() {
    this.player_.volume(this.player_.volume() + .1)
}, vjs.VolumeBar.prototype.stepBack = function() {
    this.player_.volume(this.player_.volume() - .1)
}, vjs.VolumeLevel = vjs.Component.extend({
    init: function(t, e) {
        vjs.Component.call(this, t, e)
    }
}), vjs.VolumeLevel.prototype.createEl = function() {
    return vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-volume-level",
        innerHTML: '<span class="vjs-control-text"></span>'
    })
}, vjs.VolumeHandle = vjs.SliderHandle.extend(), vjs.VolumeHandle.prototype.defaultValue = "00:00", vjs.VolumeHandle.prototype.createEl = function() {
    return vjs.SliderHandle.prototype.createEl.call(this, "div", {
        className: "vjs-volume-handle"
    })
}, vjs.MuteToggle = vjs.Button.extend({
    init: function(t, e) {
        vjs.Button.call(this, t, e), t.on("volumechange", vjs.bind(this, this.update)), t.tech && t.tech.featuresVolumeControl === !1 && this.addClass("vjs-hidden"), t.on("loadstart", vjs.bind(this, function() {
            t.tech.featuresVolumeControl === !1 ? this.addClass("vjs-hidden") : this.removeClass("vjs-hidden")
        }))
    }
}), vjs.MuteToggle.prototype.createEl = function() {
    return vjs.Button.prototype.createEl.call(this, "div", {
        className: "vjs-mute-control vjs-control",
        innerHTML: '<div><span class="vjs-control-text">' + this.localize("Mute") + "</span></div>"
    })
}, vjs.MuteToggle.prototype.onClick = function() {
    this.player_.muted(this.player_.muted() ? !1 : !0)
}, vjs.MuteToggle.prototype.update = function() {
    var t = this.player_.volume(),
        e = 3;
    0 === t || this.player_.muted() ? e = 0 : .33 > t ? e = 1 : .67 > t && (e = 2), this.player_.muted() ? this.el_.children[0].children[0].innerHTML != this.localize("Unmute") && (this.el_.children[0].children[0].innerHTML = this.localize("Unmute")) : this.el_.children[0].children[0].innerHTML != this.localize("Mute") && (this.el_.children[0].children[0].innerHTML = this.localize("Mute"));
    for (var s = 0; 4 > s; s++) vjs.removeClass(this.el_, "vjs-vol-" + s);
    vjs.addClass(this.el_, "vjs-vol-" + e)
}, vjs.VolumeMenuButton = vjs.MenuButton.extend({
    init: function(t, e) {
        vjs.MenuButton.call(this, t, e), t.on("volumechange", vjs.bind(this, this.update)), t.tech && t.tech.featuresVolumeControl === !1 && this.addClass("vjs-hidden"), t.on("loadstart", vjs.bind(this, function() {
            t.tech.featuresVolumeControl === !1 ? this.addClass("vjs-hidden") : this.removeClass("vjs-hidden")
        })), this.addClass("vjs-menu-button")
    }
}), vjs.VolumeMenuButton.prototype.createMenu = function() {
    var t = new vjs.Menu(this.player_, {
            contentElType: "div"
        }),
        e = new vjs.VolumeBar(this.player_, vjs.obj.merge({
            vertical: !0
        }, this.options_.volumeBar));
    return t.addChild(e), t
}, vjs.VolumeMenuButton.prototype.onClick = function() {
    vjs.MuteToggle.prototype.onClick.call(this), vjs.MenuButton.prototype.onClick.call(this)
}, vjs.VolumeMenuButton.prototype.createEl = function() {
    return vjs.Button.prototype.createEl.call(this, "div", {
        className: "vjs-volume-menu-button vjs-menu-button vjs-control",
        innerHTML: '<div><span class="vjs-control-text">' + this.localize("Mute") + "</span></div>"
    })
}, vjs.VolumeMenuButton.prototype.update = vjs.MuteToggle.prototype.update, vjs.PlaybackRateMenuButton = vjs.MenuButton.extend({
    init: function(t, e) {
        vjs.MenuButton.call(this, t, e), this.updateVisibility(), this.updateLabel(), t.on("loadstart", vjs.bind(this, this.updateVisibility)), t.on("ratechange", vjs.bind(this, this.updateLabel))
    }
}), vjs.PlaybackRateMenuButton.prototype.createEl = function() {
    var t = vjs.Component.prototype.createEl.call(this, "div", {
        className: "vjs-playback-rate vjs-menu-button vjs-control",
        innerHTML: '<div class="vjs-control-content"><span class="vjs-control-text">' + this.localize("Playback Rate") + "</span></div>"
    });
    return this.labelEl_ = vjs.createEl("div", {
        className: "vjs-playback-rate-value",
        innerHTML: 1
    }), t.appendChild(this.labelEl_), t
}, vjs.PlaybackRateMenuButton.prototype.createMenu = function() {
    var t = new vjs.Menu(this.player()),
        e = this.player().options().playbackRates;
    if (e)
        for (var s = e.length - 1; s >= 0; s--) t.addChild(new vjs.PlaybackRateMenuItem(this.player(), {
            rate: e[s] + "x"
        }));
    return t
}, vjs.PlaybackRateMenuButton.prototype.updateARIAAttributes = function() {
    this.el().setAttribute("aria-valuenow", this.player().playbackRate())
}, vjs.PlaybackRateMenuButton.prototype.onClick = function() {
    for (var t = this.player().playbackRate(), e = this.player().options().playbackRates, s = e[0], o = 0; o < e.length; o++)
        if (e[o] > t) {
            s = e[o];
            break
        }
    this.player().playbackRate(s)
}, vjs.PlaybackRateMenuButton.prototype.playbackRateSupported = function() {
    return this.player().tech && this.player().tech.featuresPlaybackRate && this.player().options().playbackRates && this.player().options().playbackRates.length > 0
}, vjs.PlaybackRateMenuButton.prototype.updateVisibility = function() {
    this.playbackRateSupported() ? this.removeClass("vjs-hidden") : this.addClass("vjs-hidden")
}, vjs.PlaybackRateMenuButton.prototype.updateLabel = function() {
    this.playbackRateSupported() && (this.labelEl_.innerHTML = this.player().playbackRate() + "x")
}, vjs.PlaybackRateMenuItem = vjs.MenuItem.extend({
    contentElType: "button",
    init: function(t, e) {
        var s = this.label = e.rate,
            o = this.rate = parseFloat(s, 10);
        e.label = s, e.selected = 1 === o, vjs.MenuItem.call(this, t, e), this.player().on("ratechange", vjs.bind(this, this.update))
    }
}), vjs.PlaybackRateMenuItem.prototype.onClick = function() {
    vjs.MenuItem.prototype.onClick.call(this), this.player().playbackRate(this.rate)
}, vjs.PlaybackRateMenuItem.prototype.update = function() {
    this.selected(this.player().playbackRate() == this.rate)
}, vjs.PosterImage = vjs.Button.extend({
    init: function(t, e) {
        vjs.Button.call(this, t, e), t.poster() && this.src(t.poster()), t.poster() && t.controls() || this.hide(), t.on("posterchange", vjs.bind(this, function() {
            this.src(t.poster())
        })), t.on("play", vjs.bind(this, this.hide))
    }
});
var _backgroundSizeSupported = "backgroundSize" in vjs.TEST_VID.style;
if (vjs.PosterImage.prototype.createEl = function() {
        var t = vjs.createEl("div", {
            className: "vjs-poster",
            tabIndex: -1
        });
        return _backgroundSizeSupported || t.appendChild(vjs.createEl("img")), t
    }, vjs.PosterImage.prototype.src = function(t) {
        var e = this.el();
        void 0 !== t && (_backgroundSizeSupported ? e.style.backgroundImage = 'url("' + t + '")' : e.firstChild.src = t)
    }, vjs.PosterImage.prototype.onClick = function() {
        this.player().controls() && this.player_.play()
    }, vjs.LoadingSpinner = vjs.Component.extend({
        init: function(t, e) {
            vjs.Component.call(this, t, e)
        }
    }), vjs.LoadingSpinner.prototype.createEl = function() {
        return vjs.Component.prototype.createEl.call(this, "div", {
            className: "vjs-loading-spinner"
        })
    }, vjs.BigPlayButton = vjs.Button.extend(), vjs.BigPlayButton.prototype.createEl = function() {
        return vjs.Button.prototype.createEl.call(this, "div", {
            className: "vjs-big-play-button",
            innerHTML: '<span aria-hidden="true"></span>',
            "aria-label": "play video"
        })
    }, vjs.BigPlayButton.prototype.onClick = function() {
        this.player_.play()
    }, vjs.ErrorDisplay = vjs.Component.extend({
        init: function(t, e) {
            vjs.Component.call(this, t, e), this.update(), t.on("error", vjs.bind(this, this.update))
        }
    }), vjs.ErrorDisplay.prototype.createEl = function() {
        var t = vjs.Component.prototype.createEl.call(this, "div", {
            className: "vjs-error-display"
        });
        return this.contentEl_ = vjs.createEl("div"), t.appendChild(this.contentEl_), t
    }, vjs.ErrorDisplay.prototype.update = function() {
        this.player().error() && (this.contentEl_.innerHTML = this.localize(this.player().error().message))
    }, vjs.MediaTechController = vjs.Component.extend({
        init: function(t, e, s) {
            e = e || {}, e.reportTouchActivity = !1, vjs.Component.call(this, t, e, s), this.featuresProgressEvents || this.manualProgressOn(), this.featuresTimeupdateEvents || this.manualTimeUpdatesOn(), this.initControlsListeners()
        }
    }), vjs.MediaTechController.prototype.initControlsListeners = function() {
        var t, e, s, o;
        e = this, t = this.player();
        var s = function() {
            t.controls() && !t.usingNativeControls() && e.addControlsListeners()
        };
        o = vjs.bind(e, e.removeControlsListeners), this.ready(s), t.on("controlsenabled", s), t.on("controlsdisabled", o), this.ready(function() {
            this.networkState && this.networkState() > 0 && this.player().trigger("loadstart")
        })
    }, vjs.MediaTechController.prototype.addControlsListeners = function() {
        var t;
        this.on("mousedown", this.onClick), this.on("touchstart", function() {
            t = this.player_.userActive()
        }), this.on("touchmove", function() {
            t && this.player().reportUserActivity()
        }), this.on("touchend", function(t) {
            t.preventDefault()
        }), this.emitTapEvents(), this.on("tap", this.onTap)
    }, vjs.MediaTechController.prototype.removeControlsListeners = function() {
        this.off("tap"), this.off("touchstart"), this.off("touchmove"), this.off("touchleave"), this.off("touchcancel"), this.off("touchend"), this.off("click"), this.off("mousedown")
    }, vjs.MediaTechController.prototype.onClick = function(t) {
        0 === t.button && this.player().controls() && (this.player().paused() ? this.player().play() : this.player().pause())
    }, vjs.MediaTechController.prototype.onTap = function() {
        this.player().userActive(!this.player().userActive())
    }, vjs.MediaTechController.prototype.manualProgressOn = function() {
        this.manualProgress = !0, this.trackProgress()
    }, vjs.MediaTechController.prototype.manualProgressOff = function() {
        this.manualProgress = !1, this.stopTrackingProgress()
    }, vjs.MediaTechController.prototype.trackProgress = function() {
        this.progressInterval = setInterval(vjs.bind(this, function() {
            var t = this.player().bufferedPercent();
            this.bufferedPercent_ != t && this.player().trigger("progress"), this.bufferedPercent_ = t, 1 === t && this.stopTrackingProgress()
        }), 500)
    }, vjs.MediaTechController.prototype.stopTrackingProgress = function() {
        clearInterval(this.progressInterval)
    }, vjs.MediaTechController.prototype.manualTimeUpdatesOn = function() {
        this.manualTimeUpdates = !0, this.player().on("play", vjs.bind(this, this.trackCurrentTime)), this.player().on("pause", vjs.bind(this, this.stopTrackingCurrentTime)), this.one("timeupdate", function() {
            this.featuresTimeupdateEvents = !0, this.manualTimeUpdatesOff()
        })
    }, vjs.MediaTechController.prototype.manualTimeUpdatesOff = function() {
        this.manualTimeUpdates = !1, this.stopTrackingCurrentTime(), this.off("play", this.trackCurrentTime), this.off("pause", this.stopTrackingCurrentTime)
    }, vjs.MediaTechController.prototype.trackCurrentTime = function() {
        this.currentTimeInterval && this.stopTrackingCurrentTime(), this.currentTimeInterval = setInterval(vjs.bind(this, function() {
            this.player().trigger("timeupdate")
        }), 250)
    }, vjs.MediaTechController.prototype.stopTrackingCurrentTime = function() {
        clearInterval(this.currentTimeInterval), this.player().trigger("timeupdate")
    }, vjs.MediaTechController.prototype.dispose = function() {
        this.manualProgress && this.manualProgressOff(), this.manualTimeUpdates && this.manualTimeUpdatesOff(), vjs.Component.prototype.dispose.call(this)
    }, vjs.MediaTechController.prototype.setCurrentTime = function() {
        this.manualTimeUpdates && this.player().trigger("timeupdate")
    }, vjs.MediaTechController.prototype.setPoster = function() {}, vjs.MediaTechController.prototype.featuresVolumeControl = !0, vjs.MediaTechController.prototype.featuresFullscreenResize = !1, vjs.MediaTechController.prototype.featuresPlaybackRate = !1, vjs.MediaTechController.prototype.featuresProgressEvents = !1, vjs.MediaTechController.prototype.featuresTimeupdateEvents = !1, vjs.media = {}, vjs.Html5 = vjs.MediaTechController.extend({
        init: function(t, e, s) {
            this.featuresVolumeControl = vjs.Html5.canControlVolume(), this.featuresPlaybackRate = vjs.Html5.canControlPlaybackRate(), this.movingMediaElementInDOM = !vjs.IS_IOS, this.featuresFullscreenResize = !0, this.featuresProgressEvents = !0, vjs.MediaTechController.call(this, t, e, s), this.setupTriggers();
            var o = e.source;
            o && this.el_.currentSrc !== o.src && (this.el_.src = o.src), vjs.TOUCH_ENABLED && t.options().nativeControlsForTouch !== !1 && this.useNativeControls(), t.ready(function() {
                this.tag && this.options_.autoplay && this.paused() && (delete this.tag.poster, this.play())
            }), this.triggerReady()
        }
    }), vjs.Html5.prototype.dispose = function() {
        vjs.Html5.disposeMediaElement(this.el_), vjs.MediaTechController.prototype.dispose.call(this)
    }, vjs.Html5.prototype.createEl = function() {
        var t, e = this.player_,
            s = e.tag;
        s && this.movingMediaElementInDOM !== !1 || (s ? (t = s.cloneNode(!1), vjs.Html5.disposeMediaElement(s), s = t, e.tag = null) : (s = vjs.createEl("video"), vjs.setElementAttributes(s, vjs.obj.merge(e.tagAttributes || {}, {
            id: e.id() + "_html5_api",
            "class": "vjs-tech"
        }))), s.player = e, vjs.insertFirst(s, e.el()));
        for (var o = ["autoplay", "preload", "loop", "muted"], n = o.length - 1; n >= 0; n--) {
            var i = o[n],
                r = {};
            "undefined" != typeof e.options_[i] && (r[i] = e.options_[i]), vjs.setElementAttributes(s, r)
        }
        return s
    }, vjs.Html5.prototype.setupTriggers = function() {
        for (var t = vjs.Html5.Events.length - 1; t >= 0; t--) vjs.on(this.el_, vjs.Html5.Events[t], vjs.bind(this, this.eventHandler))
    }, vjs.Html5.prototype.eventHandler = function(t) {
        "error" == t.type && this.error() ? this.player().error(this.error().code) : (t.bubbles = !1, this.player().trigger(t))
    }, vjs.Html5.prototype.useNativeControls = function() {
        var t, e, s, o, n;
        t = this, e = this.player(), t.setControls(e.controls()), s = function() {
            t.setControls(!0)
        }, o = function() {
            t.setControls(!1)
        }, e.on("controlsenabled", s), e.on("controlsdisabled", o), n = function() {
            e.off("controlsenabled", s), e.off("controlsdisabled", o)
        }, t.on("dispose", n), e.on("usingcustomcontrols", n), e.usingNativeControls(!0)
    }, vjs.Html5.prototype.play = function() {
        this.el_.play()
    }, vjs.Html5.prototype.pause = function() {
        this.el_.pause()
    }, vjs.Html5.prototype.paused = function() {
        return this.el_.paused
    }, vjs.Html5.prototype.currentTime = function() {
        return this.el_.currentTime
    }, vjs.Html5.prototype.setCurrentTime = function(t) {
        try {
            this.el_.currentTime = t
        } catch (e) {
            vjs.log(e, "Video is not ready. (Video.js)")
        }
    }, vjs.Html5.prototype.duration = function() {
        return this.el_.duration || 0
    }, vjs.Html5.prototype.buffered = function() {
        return this.el_.buffered
    }, vjs.Html5.prototype.volume = function() {
        return this.el_.volume
    }, vjs.Html5.prototype.setVolume = function(t) {
        this.el_.volume = t
    }, vjs.Html5.prototype.muted = function() {
        return this.el_.muted
    }, vjs.Html5.prototype.setMuted = function(t) {
        this.el_.muted = t
    }, vjs.Html5.prototype.width = function() {
        return this.el_.offsetWidth
    }, vjs.Html5.prototype.height = function() {
        return this.el_.offsetHeight
    }, vjs.Html5.prototype.supportsFullScreen = function() {
        return "function" != typeof this.el_.webkitEnterFullScreen || !/Android/.test(vjs.USER_AGENT) && /Chrome|Mac OS X 10.5/.test(vjs.USER_AGENT) ? !1 : !0
    }, vjs.Html5.prototype.enterFullScreen = function() {
        var t = this.el_;
        t.paused && t.networkState <= t.HAVE_METADATA ? (this.el_.play(), setTimeout(function() {
            t.pause(), t.webkitEnterFullScreen()
        }, 0)) : t.webkitEnterFullScreen()
    }, vjs.Html5.prototype.exitFullScreen = function() {
        this.el_.webkitExitFullScreen()
    }, vjs.Html5.prototype.src = function(t) {
        return void 0 === t ? this.el_.src : (this.el_.src = t, void 0)
    }, vjs.Html5.prototype.load = function() {
        this.el_.load()
    }, vjs.Html5.prototype.currentSrc = function() {
        return this.el_.currentSrc
    }, vjs.Html5.prototype.poster = function() {
        return this.el_.poster
    }, vjs.Html5.prototype.setPoster = function(t) {
        this.el_.poster = t
    }, vjs.Html5.prototype.preload = function() {
        return this.el_.preload
    }, vjs.Html5.prototype.setPreload = function(t) {
        this.el_.preload = t
    }, vjs.Html5.prototype.autoplay = function() {
        return this.el_.autoplay
    }, vjs.Html5.prototype.setAutoplay = function(t) {
        this.el_.autoplay = t
    }, vjs.Html5.prototype.controls = function() {
        return this.el_.controls
    }, vjs.Html5.prototype.setControls = function(t) {
        this.el_.controls = !!t
    }, vjs.Html5.prototype.loop = function() {
        return this.el_.loop
    }, vjs.Html5.prototype.setLoop = function(t) {
        this.el_.loop = t
    }, vjs.Html5.prototype.error = function() {
        return this.el_.error
    }, vjs.Html5.prototype.seeking = function() {
        return this.el_.seeking
    }, vjs.Html5.prototype.ended = function() {
        return this.el_.ended
    }, vjs.Html5.prototype.defaultMuted = function() {
        return this.el_.defaultMuted
    }, vjs.Html5.prototype.playbackRate = function() {
        return this.el_.playbackRate
    }, vjs.Html5.prototype.setPlaybackRate = function(t) {
        this.el_.playbackRate = t
    }, vjs.Html5.prototype.networkState = function() {
        return this.el_.networkState
    }, vjs.Html5.isSupported = function() {
        try {
            vjs.TEST_VID.volume = .5
        } catch (t) {
            return !1
        }
        return !!vjs.TEST_VID.canPlayType
    }, vjs.Html5.canPlaySource = function(t) {
        try {
            return !!vjs.TEST_VID.canPlayType(t.type)
        } catch (e) {
            return ""
        }
    }, vjs.Html5.canControlVolume = function() {
        var t = vjs.TEST_VID.volume;
        return vjs.TEST_VID.volume = t / 2 + .1, t !== vjs.TEST_VID.volume
    }, vjs.Html5.canControlPlaybackRate = function() {
        var t = vjs.TEST_VID.playbackRate;
        return vjs.TEST_VID.playbackRate = t / 2 + .1, t !== vjs.TEST_VID.playbackRate
    }, function() {
        var t, e = /^application\/(?:x-|vnd\.apple\.)mpegurl/i,
            s = /^video\/mp4/i;
        vjs.Html5.patchCanPlayType = function() {
            vjs.ANDROID_VERSION >= 4 && (t || (t = vjs.TEST_VID.constructor.prototype.canPlayType), vjs.TEST_VID.constructor.prototype.canPlayType = function(s) {
                return s && e.test(s) ? "maybe" : t.call(this, s)
            }), vjs.IS_OLD_ANDROID && (t || (t = vjs.TEST_VID.constructor.prototype.canPlayType), vjs.TEST_VID.constructor.prototype.canPlayType = function(e) {
                return e && s.test(e) ? "maybe" : t.call(this, e)
            })
        }, vjs.Html5.unpatchCanPlayType = function() {
            var e = vjs.TEST_VID.constructor.prototype.canPlayType;
            return vjs.TEST_VID.constructor.prototype.canPlayType = t, t = null, e
        }, vjs.Html5.patchCanPlayType()
    }(), vjs.Html5.Events = "loadstart,suspend,abort,error,emptied,stalled,loadedmetadata,loadeddata,canplay,canplaythrough,playing,waiting,seeking,seeked,ended,durationchange,timeupdate,progress,play,pause,ratechange,volumechange".split(","), vjs.Html5.disposeMediaElement = function(t) {
        if (t) {
            for (t.player = null, t.parentNode && t.parentNode.removeChild(t); t.hasChildNodes();) t.removeChild(t.firstChild);
            t.removeAttribute("src"), "function" == typeof t.load && ! function() {
                try {
                    t.load()
                } catch (e) {}
            }()
        }
    }, vjs.Flash = vjs.MediaTechController.extend({
        init: function(t, e, s) {
            vjs.MediaTechController.call(this, t, e, s);
            var o = e.source,
                n = e.parentEl,
                i = this.el_ = vjs.createEl("div", {
                    id: t.id() + "_temp_flash"
                }),
                r = t.id() + "_flash_api",
                a = t.options_,
                l = vjs.obj.merge({
                    readyFunction: "videojs.Flash.onReady",
                    eventProxyFunction: "videojs.Flash.onEvent",
                    errorEventProxyFunction: "videojs.Flash.onError",
                    autoplay: a.autoplay,
                    preload: a.preload,
                    loop: a.loop,
                    muted: a.muted
                }, e.flashVars),
                c = vjs.obj.merge({
                    wmode: "opaque",
                    bgcolor: "#000000"
                }, e.params),
                u = vjs.obj.merge({
                    id: r,
                    name: r,
                    "class": "vjs-tech"
                }, e.attributes);
            if (o)
                if (o.type && vjs.Flash.isStreamingType(o.type)) {
                    var p = vjs.Flash.streamToParts(o.src);
                    l.rtmpConnection = encodeURIComponent(p.connection), l.rtmpStream = encodeURIComponent(p.stream)
                } else l.src = encodeURIComponent(vjs.getAbsoluteURL(o.src));
            vjs.insertFirst(i, n), e.startTime && this.ready(function() {
                this.load(), this.play(), this.currentTime(e.startTime)
            }), vjs.IS_FIREFOX && this.ready(function() {
                vjs.on(this.el(), "mousemove", vjs.bind(this, function() {
                    this.player().trigger({
                        type: "mousemove",
                        bubbles: !1
                    })
                }))
            }), t.on("stageclick", t.reportUserActivity), this.el_ = vjs.Flash.embed(e.swf, i, l, c, u)
        }
    }), vjs.Flash.prototype.dispose = function() {
        vjs.MediaTechController.prototype.dispose.call(this)
    }, vjs.Flash.prototype.play = function() {
        this.el_.vjs_play()
    }, vjs.Flash.prototype.pause = function() {
        this.el_.vjs_pause()
    }, vjs.Flash.prototype.src = function(t) {
        if (void 0 === t) return this.currentSrc();
        if (vjs.Flash.isStreamingSrc(t) ? (t = vjs.Flash.streamToParts(t), this.setRtmpConnection(t.connection), this.setRtmpStream(t.stream)) : (t = vjs.getAbsoluteURL(t), this.el_.vjs_src(t)), this.player_.autoplay()) {
            var e = this;
            setTimeout(function() {
                e.play()
            }, 0)
        }
    }, vjs.Flash.prototype.setCurrentTime = function(t) {
        this.lastSeekTarget_ = t, this.el_.vjs_setProperty("currentTime", t), vjs.MediaTechController.prototype.setCurrentTime.call(this)
    }, vjs.Flash.prototype.currentTime = function() {
        return this.seeking() ? this.lastSeekTarget_ || 0 : this.el_.vjs_getProperty("currentTime")
    }, vjs.Flash.prototype.currentSrc = function() {
        var t = this.el_.vjs_getProperty("currentSrc");
        if (null == t) {
            var e = this.rtmpConnection(),
                s = this.rtmpStream();
            e && s && (t = vjs.Flash.streamFromParts(e, s))
        }
        return t
    }, vjs.Flash.prototype.load = function() {
        this.el_.vjs_load()
    }, vjs.Flash.prototype.poster = function() {
        this.el_.vjs_getProperty("poster")
    }, vjs.Flash.prototype.setPoster = function() {}, vjs.Flash.prototype.buffered = function() {
        return vjs.createTimeRange(0, this.el_.vjs_getProperty("buffered"))
    }, vjs.Flash.prototype.supportsFullScreen = function() {
        return !1
    }, vjs.Flash.prototype.enterFullScreen = function() {
        return !1
    }, function() {
        function t(t) {
            var e = t.charAt(0).toUpperCase() + t.slice(1);
            o["set" + e] = function(e) {
                return this.el_.vjs_setProperty(t, e)
            }
        }

        function e(t) {
            o[t] = function() {
                return this.el_.vjs_getProperty(t)
            }
        }
        var s, o = vjs.Flash.prototype,
            n = "rtmpConnection,rtmpStream,preload,defaultPlaybackRate,playbackRate,autoplay,loop,mediaGroup,controller,controls,volume,muted,defaultMuted".split(","),
            i = "error,networkState,readyState,seeking,initialTime,duration,startOffsetTime,paused,played,seekable,ended,videoTracks,audioTracks,videoWidth,videoHeight,textTracks".split(",");
        for (s = 0; s < n.length; s++) e(n[s]), t(n[s]);
        for (s = 0; s < i.length; s++) e(i[s])
    }(), vjs.Flash.isSupported = function() {
        return vjs.Flash.version()[0] >= 10
    }, vjs.Flash.canPlaySource = function(t) {
        var e;
        return t.type ? (e = t.type.replace(/;.*/, "").toLowerCase(), e in vjs.Flash.formats || e in vjs.Flash.streamingFormats ? "maybe" : void 0) : ""
    }, vjs.Flash.formats = {
        "video/flv": "FLV",
        "video/x-flv": "FLV",
        "video/mp4": "MP4",
        "video/m4v": "MP4"
    }, vjs.Flash.streamingFormats = {
        "rtmp/mp4": "MP4",
        "rtmp/flv": "FLV"
    }, vjs.Flash.onReady = function(t) {
        var e, s;
        e = vjs.el(t), s = e && e.parentNode && e.parentNode.player, s && (e.player = s, vjs.Flash.checkReady(s.tech))
    }, vjs.Flash.checkReady = function(t) {
        t.el() && (t.el().vjs_getProperty ? t.triggerReady() : setTimeout(function() {
            vjs.Flash.checkReady(t)
        }, 50))
    }, vjs.Flash.onEvent = function(t, e) {
        var s = vjs.el(t).player;
        s.trigger(e)
    }, vjs.Flash.onError = function(t, e) {
        var s = vjs.el(t).player,
            o = "FLASH: " + e;
        "srcnotfound" == e ? s.error({
            code: 4,
            message: o
        }) : s.error(o)
    }, vjs.Flash.version = function() {
        var t = "0,0,0";
        try {
            t = new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version").replace(/\D+/g, ",").match(/^,?(.+),?$/)[1]
        } catch (e) {
            try {
                navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin && (t = (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1])
            } catch (s) {}
        }
        return t.split(",")
    }, vjs.Flash.embed = function(t, e, s, o, n) {
        var i = vjs.Flash.getEmbedCode(t, s, o, n),
            r = vjs.createEl("div", {
                innerHTML: i
            }).childNodes[0],
            a = e.parentNode;
        e.parentNode.replaceChild(r, e);
        var l = a.childNodes[0];
        return setTimeout(function() {
            l.style.display = "block"
        }, 1e3), r
    }, vjs.Flash.getEmbedCode = function(t, e, s, o) {
        var n = '<object type="application/x-shockwave-flash"',
            i = "",
            r = "",
            a = "";
        return e && vjs.obj.each(e, function(t, e) {
            i += t + "=" + e + "&amp;"
        }), s = vjs.obj.merge({
            movie: t,
            flashvars: i,
            allowScriptAccess: "always",
            allowNetworking: "all"
        }, s), vjs.obj.each(s, function(t, e) {
            r += '<param name="' + t + '" value="' + e + '" />'
        }), o = vjs.obj.merge({
            data: t,
            width: "100%",
            height: "100%"
        }, o), vjs.obj.each(o, function(t, e) {
            a += t + '="' + e + '" '
        }), n + a + ">" + r + "</object>"
    }, vjs.Flash.streamFromParts = function(t, e) {
        return t + "&" + e
    }, vjs.Flash.streamToParts = function(t) {
        var e = {
            connection: "",
            stream: ""
        };
        if (!t) return e;
        var s, o = t.indexOf("&");
        return -1 !== o ? s = o + 1 : (o = s = t.lastIndexOf("/") + 1, 0 === o && (o = s = t.length)), e.connection = t.substring(0, o), e.stream = t.substring(s, t.length), e
    }, vjs.Flash.isStreamingType = function(t) {
        return t in vjs.Flash.streamingFormats
    }, vjs.Flash.RTMP_RE = /^rtmp[set]?:\/\//i, vjs.Flash.isStreamingSrc = function(t) {
        return vjs.Flash.RTMP_RE.test(t)
    }, vjs.MediaLoader = vjs.Component.extend({
        init: function(t, e, s) {
            if (vjs.Component.call(this, t, e, s), t.options_.sources && 0 !== t.options_.sources.length) t.src(t.options_.sources);
            else
                for (var o = 0, n = t.options_.techOrder; o < n.length; o++) {
                    var i = vjs.capitalize(n[o]),
                        r = window.videojs[i];
                    if (r && r.isSupported()) {
                        t.loadTech(i);
                        break
                    }
                }
        }
    }), vjs.Player.prototype.textTracks_, vjs.Player.prototype.textTracks = function() {
        return this.textTracks_ = this.textTracks_ || [], this.textTracks_
    }, vjs.Player.prototype.addTextTrack = function(t, e, s, o) {
        var n = this.textTracks_ = this.textTracks_ || [];
        o = o || {}, o.kind = t, o.label = e, o.language = s;
        var i = vjs.capitalize(t || "subtitles"),
            r = new window.videojs[i + "Track"](this, o);
        return n.push(r), r.dflt() && this.ready(function() {
            setTimeout(function() {
                r.player().showTextTrack(r.id())
            }, 0)
        }), r
    }, vjs.Player.prototype.addTextTracks = function(t) {
        for (var e, s = 0; s < t.length; s++) e = t[s], this.addTextTrack(e.kind, e.label, e.language, e);
        return this
    }, vjs.Player.prototype.showTextTrack = function(t, e) {
        for (var s, o, n, i = this.textTracks_, r = 0, a = i.length; a > r; r++) s = i[r], s.id() === t ? (s.show(), o = s) : e && s.kind() == e && s.mode() > 0 && s.disable();
        return n = o ? o.kind() : e ? e : !1, n && this.trigger(n + "trackchange"), this
    }, vjs.TextTrack = vjs.Component.extend({
        init: function(t, e) {
            vjs.Component.call(this, t, e), this.id_ = e.id || "vjs_" + e.kind + "_" + e.language + "_" + vjs.guid++, this.src_ = e.src, this.dflt_ = e["default"] || e.dflt, this.title_ = e.title, this.language_ = e.srclang, this.label_ = e.label, this.cues_ = [], this.activeCues_ = [], this.readyState_ = 0, this.mode_ = 0, this.player_.on("fullscreenchange", vjs.bind(this, this.adjustFontSize))
        }
    }), vjs.TextTrack.prototype.kind_, vjs.TextTrack.prototype.kind = function() {
        return this.kind_
    }, vjs.TextTrack.prototype.src_, vjs.TextTrack.prototype.src = function() {
        return this.src_
    }, vjs.TextTrack.prototype.dflt_, vjs.TextTrack.prototype.dflt = function() {
        return this.dflt_
    }, vjs.TextTrack.prototype.title_, vjs.TextTrack.prototype.title = function() {
        return this.title_
    }, vjs.TextTrack.prototype.language_, vjs.TextTrack.prototype.language = function() {
        return this.language_
    }, vjs.TextTrack.prototype.label_, vjs.TextTrack.prototype.label = function() {
        return this.label_
    }, vjs.TextTrack.prototype.cues_, vjs.TextTrack.prototype.cues = function() {
        return this.cues_
    }, vjs.TextTrack.prototype.activeCues_, vjs.TextTrack.prototype.activeCues = function() {
        return this.activeCues_
    }, vjs.TextTrack.prototype.readyState_, vjs.TextTrack.prototype.readyState = function() {
        return this.readyState_
    }, vjs.TextTrack.prototype.mode_, vjs.TextTrack.prototype.mode = function() {
        return this.mode_
    }, vjs.TextTrack.prototype.adjustFontSize = function() {
        this.el_.style.fontSize = this.player_.isFullscreen() ? screen.width / this.player_.width() * 1.4 * 100 + "%" : ""
    }, vjs.TextTrack.prototype.createEl = function() {
        return vjs.Component.prototype.createEl.call(this, "div", {
            className: "vjs-" + this.kind_ + " vjs-text-track"
        })
    }, vjs.TextTrack.prototype.show = function() {
        this.activate(), this.mode_ = 2, vjs.Component.prototype.show.call(this)
    }, vjs.TextTrack.prototype.hide = function() {
        this.activate(), this.mode_ = 1, vjs.Component.prototype.hide.call(this)
    }, vjs.TextTrack.prototype.disable = function() {
        2 == this.mode_ && this.hide(), this.deactivate(), this.mode_ = 0
    }, vjs.TextTrack.prototype.activate = function() {
        0 === this.readyState_ && this.load(), 0 === this.mode_ && (this.player_.on("timeupdate", vjs.bind(this, this.update, this.id_)), this.player_.on("ended", vjs.bind(this, this.reset, this.id_)), ("captions" === this.kind_ || "subtitles" === this.kind_) && this.player_.getChild("textTrackDisplay").addChild(this))
    }, vjs.TextTrack.prototype.deactivate = function() {
        this.player_.off("timeupdate", vjs.bind(this, this.update, this.id_)), this.player_.off("ended", vjs.bind(this, this.reset, this.id_)), this.reset(), this.player_.getChild("textTrackDisplay").removeChild(this)
    }, vjs.TextTrack.prototype.load = function() {
        0 === this.readyState_ && (this.readyState_ = 1, vjs.get(this.src_, vjs.bind(this, this.parseCues), vjs.bind(this, this.onError)))
    }, vjs.TextTrack.prototype.onError = function(t) {
        this.error = t, this.readyState_ = 3, this.trigger("error")
    }, vjs.TextTrack.prototype.parseCues = function(t) {
        for (var e, s, o, n, i = t.split("\n"), r = "", a = 1, l = i.length; l > a; a++)
            if (r = vjs.trim(i[a])) {
                for (-1 == r.indexOf("-->") ? (n = r, r = vjs.trim(i[++a])) : n = this.cues_.length, e = {
                        id: n,
                        index: this.cues_.length
                    }, s = r.split(/[\t ]+/), e.startTime = this.parseCueTime(s[0]), e.endTime = this.parseCueTime(s[2]), o = []; i[++a] && (r = vjs.trim(i[a]));) o.push(r);
                e.text = o.join("<br/>"), this.cues_.push(e)
            }
        this.readyState_ = 2, this.trigger("loaded")
    }, vjs.TextTrack.prototype.parseCueTime = function(t) {
        var e, s, o, n, i, r = t.split(":"),
            a = 0;
        return 3 == r.length ? (e = r[0], s = r[1], o = r[2]) : (e = 0, s = r[0], o = r[1]), o = o.split(/\s+/), n = o.splice(0, 1)[0], n = n.split(/\.|,/), i = parseFloat(n[1]), n = n[0], a += 3600 * parseFloat(e), a += 60 * parseFloat(s), a += parseFloat(n), i && (a += i / 1e3), a
    }, vjs.TextTrack.prototype.update = function() {
        if (this.cues_.length > 0) {
            var t = this.player_.options().trackTimeOffset || 0,
                e = this.player_.currentTime() + t;
            if (void 0 === this.prevChange || e < this.prevChange || this.nextChange <= e) {
                var s, o, n, i, r = this.cues_,
                    a = this.player_.duration(),
                    l = 0,
                    c = !1,
                    u = [];
                for (e >= this.nextChange || void 0 === this.nextChange ? i = void 0 !== this.firstActiveIndex ? this.firstActiveIndex : 0 : (c = !0, i = void 0 !== this.lastActiveIndex ? this.lastActiveIndex : r.length - 1);;) {
                    if (n = r[i], n.endTime <= e) l = Math.max(l, n.endTime), n.active && (n.active = !1);
                    else if (e < n.startTime) {
                        if (a = Math.min(a, n.startTime), n.active && (n.active = !1), !c) break
                    } else c ? (u.splice(0, 0, n), void 0 === o && (o = i), s = i) : (u.push(n), void 0 === s && (s = i), o = i), a = Math.min(a, n.endTime), l = Math.max(l, n.startTime), n.active = !0;
                    if (c) {
                        if (0 === i) break;
                        i--
                    } else {
                        if (i === r.length - 1) break;
                        i++
                    }
                }
                this.activeCues_ = u, this.nextChange = a, this.prevChange = l, this.firstActiveIndex = s, this.lastActiveIndex = o, this.updateDisplay(), this.trigger("cuechange")
            }
        }
    }, vjs.TextTrack.prototype.updateDisplay = function() {
        for (var t = this.activeCues_, e = "", s = 0, o = t.length; o > s; s++) e += '<span class="vjs-tt-cue">' + t[s].text + "</span>";
        this.el_.innerHTML = e
    }, vjs.TextTrack.prototype.reset = function() {
        this.nextChange = 0, this.prevChange = this.player_.duration(), this.firstActiveIndex = 0, this.lastActiveIndex = 0
    }, vjs.CaptionsTrack = vjs.TextTrack.extend(), vjs.CaptionsTrack.prototype.kind_ = "captions", vjs.SubtitlesTrack = vjs.TextTrack.extend(), vjs.SubtitlesTrack.prototype.kind_ = "subtitles", vjs.ChaptersTrack = vjs.TextTrack.extend(), vjs.ChaptersTrack.prototype.kind_ = "chapters", vjs.TextTrackDisplay = vjs.Component.extend({
        init: function(t, e, s) {
            vjs.Component.call(this, t, e, s), t.options_.tracks && t.options_.tracks.length > 0 && this.player_.addTextTracks(t.options_.tracks)
        }
    }), vjs.TextTrackDisplay.prototype.createEl = function() {
        return vjs.Component.prototype.createEl.call(this, "div", {
            className: "vjs-text-track-display"
        })
    }, vjs.TextTrackMenuItem = vjs.MenuItem.extend({
        init: function(t, e) {
            var s = this.track = e.track;
            e.label = s.label(), e.selected = s.dflt(), vjs.MenuItem.call(this, t, e), this.player_.on(s.kind() + "trackchange", vjs.bind(this, this.update))
        }
    }), vjs.TextTrackMenuItem.prototype.onClick = function() {
        vjs.MenuItem.prototype.onClick.call(this), this.player_.showTextTrack(this.track.id_, this.track.kind())
    }, vjs.TextTrackMenuItem.prototype.update = function() {
        this.selected(2 == this.track.mode())
    }, vjs.OffTextTrackMenuItem = vjs.TextTrackMenuItem.extend({
        init: function(t, e) {
            e.track = {
                kind: function() {
                    return e.kind
                },
                player: t,
                label: function() {
                    return e.kind + " off"
                },
                dflt: function() {
                    return !1
                },
                mode: function() {
                    return !1
                }
            }, vjs.TextTrackMenuItem.call(this, t, e), this.selected(!0)
        }
    }), vjs.OffTextTrackMenuItem.prototype.onClick = function() {
        vjs.TextTrackMenuItem.prototype.onClick.call(this), this.player_.showTextTrack(this.track.id_, this.track.kind())
    }, vjs.OffTextTrackMenuItem.prototype.update = function() {
        for (var t, e = this.player_.textTracks(), s = 0, o = e.length, n = !0; o > s; s++) t = e[s], t.kind() == this.track.kind() && 2 == t.mode() && (n = !1);
        this.selected(n)
    }, vjs.TextTrackButton = vjs.MenuButton.extend({
        init: function(t, e) {
            vjs.MenuButton.call(this, t, e), this.items.length <= 1 && this.hide()
        }
    }), vjs.TextTrackButton.prototype.createItems = function() {
        var t, e = [];
        e.push(new vjs.OffTextTrackMenuItem(this.player_, {
            kind: this.kind_
        }));
        for (var s = 0; s < this.player_.textTracks().length; s++) t = this.player_.textTracks()[s], t.kind() === this.kind_ && e.push(new vjs.TextTrackMenuItem(this.player_, {
            track: t
        }));
        return e
    }, vjs.CaptionsButton = vjs.TextTrackButton.extend({
        init: function(t, e, s) {
            vjs.TextTrackButton.call(this, t, e, s), this.el_.setAttribute("aria-label", "Captions Menu")
        }
    }), vjs.CaptionsButton.prototype.kind_ = "captions", vjs.CaptionsButton.prototype.buttonText = "Captions", vjs.CaptionsButton.prototype.className = "vjs-captions-button", vjs.SubtitlesButton = vjs.TextTrackButton.extend({
        init: function(t, e, s) {
            vjs.TextTrackButton.call(this, t, e, s), this.el_.setAttribute("aria-label", "Subtitles Menu")
        }
    }), vjs.SubtitlesButton.prototype.kind_ = "subtitles", vjs.SubtitlesButton.prototype.buttonText = "Subtitles", vjs.SubtitlesButton.prototype.className = "vjs-subtitles-button", vjs.ChaptersButton = vjs.TextTrackButton.extend({
        init: function(t, e, s) {
            vjs.TextTrackButton.call(this, t, e, s), this.el_.setAttribute("aria-label", "Chapters Menu")
        }
    }), vjs.ChaptersButton.prototype.kind_ = "chapters", vjs.ChaptersButton.prototype.buttonText = "Chapters", vjs.ChaptersButton.prototype.className = "vjs-chapters-button", vjs.ChaptersButton.prototype.createItems = function() {
        for (var t, e = [], s = 0; s < this.player_.textTracks().length; s++) t = this.player_.textTracks()[s], t.kind() === this.kind_ && e.push(new vjs.TextTrackMenuItem(this.player_, {
            track: t
        }));
        return e
    }, vjs.ChaptersButton.prototype.createMenu = function() {
        for (var t, e, s = this.player_.textTracks(), o = 0, n = s.length, i = this.items = []; n > o; o++)
            if (t = s[o], t.kind() == this.kind_) {
                if (0 !== t.readyState()) {
                    e = t;
                    break
                }
                t.load(), t.on("loaded", vjs.bind(this, this.createMenu))
            }
        var r = this.menu;
        if (void 0 === r && (r = new vjs.Menu(this.player_), r.contentEl().appendChild(vjs.createEl("li", {
                className: "vjs-menu-title",
                innerHTML: vjs.capitalize(this.kind_),
                tabindex: -1
            }))), e) {
            var a, l, c = e.cues_;
            for (o = 0, n = c.length; n > o; o++) a = c[o], l = new vjs.ChaptersTrackMenuItem(this.player_, {
                track: e,
                cue: a
            }), i.push(l), r.addChild(l);
            this.addChild(r)
        }
        return this.items.length > 0 && this.show(), r
    }, vjs.ChaptersTrackMenuItem = vjs.MenuItem.extend({
        init: function(t, e) {
            var s = this.track = e.track,
                o = this.cue = e.cue,
                n = t.currentTime();
            e.label = o.text, e.selected = o.startTime <= n && n < o.endTime, vjs.MenuItem.call(this, t, e), s.on("cuechange", vjs.bind(this, this.update))
        }
    }), vjs.ChaptersTrackMenuItem.prototype.onClick = function() {
        vjs.MenuItem.prototype.onClick.call(this), this.player_.currentTime(this.cue.startTime), this.update(this.cue.startTime)
    }, vjs.ChaptersTrackMenuItem.prototype.update = function() {
        var t = this.cue,
            e = this.player_.currentTime();
        this.selected(t.startTime <= e && e < t.endTime)
    }, vjs.obj.merge(vjs.ControlBar.prototype.options_.children, {
        subtitlesButton: {},
        captionsButton: {},
        chaptersButton: {}
    }), vjs.JSON, "undefined" != typeof window.JSON && "function" === window.JSON.parse) vjs.JSON = window.JSON;
else {
    vjs.JSON = {};
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    vjs.JSON.parse = function(text, reviver) {
        function walk(t, e) {
            var s, o, n = t[e];
            if (n && "object" == typeof n)
                for (s in n) Object.prototype.hasOwnProperty.call(n, s) && (o = walk(n, s), void 0 !== o ? n[s] = o : delete n[s]);
            return reviver.call(t, e, n)
        }
        var j;
        if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(t) {
                return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
            })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
            "": j
        }, "") : j;
        throw new SyntaxError("JSON.parse(): invalid or malformed JSON data")
    }
}
vjs.autoSetup = function() {
    var t, e, s, o = document.getElementsByTagName("video");
    if (o && o.length > 0)
        for (var n = 0, i = o.length; i > n; n++) {
            if (e = o[n], !e || !e.getAttribute) {
                vjs.autoSetupTimeout(1);
                break
            }
            void 0 === e.player && (t = e.getAttribute("data-setup"), null !== t && (t = vjs.JSON.parse(t || "{}"), s = videojs(e, t)))
        } else vjs.windowLoaded || vjs.autoSetupTimeout(1)
}, vjs.autoSetupTimeout = function(t) {
    setTimeout(vjs.autoSetup, t)
}, "complete" === document.readyState ? vjs.windowLoaded = !0 : vjs.one(window, "load", function() {
    vjs.windowLoaded = !0
}), vjs.autoSetupTimeout(1), vjs.plugin = function(t, e) {
    vjs.Player.prototype[t] = e
};
! function(i) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery", "videojs", "imagesloaded", "jquery-ui"], i) : i(jQuery, videojs)
}(function(i, o) {
    i.BigVideo = function(e) {
        function t() {
            var o = I.container.outerWidth() < i(window).width() ? I.container.outerWidth() : i(window).width(),
                e = I.container.outerHeight() < i(window).height() ? I.container.outerHeight() : i(window).height(),
                t = o / e;
            I.container.is(i("body")) && i("html,body").css("height", i(window).height() > i("body").css("height", "auto").height() ? "100%" : "auto"), b > t ? "video" == v ? (l.width(e * b).height(e), I.shrinkable ? i(u).css("top", -(o / b - e) / 2).css("left", 0).css("height", o / b) : i(u).css("top", 0).css("left", -(e * b - o) / 2).css("height", e), i(u + "_html5_api").css("width", e * b).css("height", e), i(u + "_flash_api").css("width", e * b).css("height", e)) : i("#big-video-image").css({
                width: "auto",
                height: e,
                top: 0,
                left: -(e * b - o) / 2
            }) : "video" == v ? (l.width(o).height(o / b), i(u).css("top", -(o / b - e) / 2).css("left", 0).css("height", o / b), i(u + "_html5_api").css("width", i(u + "_html5_api").parent().width() + "px").css("height", "auto"), i(u + "_flash_api").css("width", o).css("height", o / b)) : i("#big-video-image").css({
                width: o,
                height: "auto",
                top: -(o / b - e) / 2,
                left: 0
            })
        }

        function d() {
            var o = '<div id="big-video-control-container"><div id="big-video-control"><a href="#" id="big-video-control-play"></a><div id="big-video-control-middle"><div id="big-video-control-bar"><div id="big-video-control-bound-left"></div><div id="big-video-control-progress"></div><div id="big-video-control-track"></div><div id="big-video-control-bound-right"></div></div></div>	<div id="big-video-control-timer"></div></div></div>';
            I.container.append(o), i("#big-video-control-container").css("display", "none"), i("#big-video-control-timer").css("display", "none"), i("#big-video-control-track").slider({
                animate: !0,
                step: .01,
                slide: function(o, e) {
                    _ = !0, i("#big-video-control-progress").css("width", e.value - .16 + "%"), l.currentTime(e.value / 100 * l.duration())
                },
                stop: function(i, o) {
                    _ = !1, l.currentTime(o.value / 100 * l.duration())
                }
            }), i("#big-video-control-bar").click(function(o) {
                l.currentTime(o.offsetX / i(this).width() * l.duration())
            }), i("#big-video-control-play").click(function(i) {
                i.preventDefault(), n("toggle")
            }), l.on("timeupdate", function() {
                if (!_ && l.currentTime() / l.duration()) {
                    var o = l.currentTime(),
                        e = Math.floor(o / 60),
                        t = Math.floor(o) - 60 * e;
                    10 > t && (t = "0" + t);
                    var d = l.currentTime() / l.duration() * 100;
                    i("#big-video-control-track").slider("value", d), i("#big-video-control-progress").css("width", d - .16 + "%"), i("#big-video-control-timer").text(e + ":" + t + "/" + m)
                }
            })
        }

        function n(o) {
            var e = o || "toggle";
            "toggle" == e && (e = k ? "pause" : "play"), "pause" == e ? (l.pause(), i("#big-video-control-play").css("background-position", "-16px"), k = !1) : "play" == e ? (l.play(), i("#big-video-control-play").css("background-position", "0"), k = !0) : "skip" == e && a()
        }

        function s() {
            l.play(), I.container.off("click", s)
        }

        function a() {
            g++, g === L.length && (g = 0), r(L[g])
        }

        function r(o) {
            i(u).css("display", "block"), v = "video", l.src(o), k = !0, j ? (i("#big-video-control-container").css("display", "none"), l.ready(function() {
                l.volume(0)
            }), doLoop = !0) : (i("#big-video-control-container").css("display", "block"), l.ready(function() {
                l.volume(y)
            }), doLoop = !1), i("#big-video-image").css("display", "none"), i(u).css("display", "block")
        }

        function c(o) {
            i("#big-video-image").remove(), l.pause(), i(u).css("display", "none"), i("#big-video-control-container").css("display", "none"), v = "image";
            var e = i('<img id="big-video-image" src=' + o + " />");
            f.append(e), i("#big-video-image").imagesLoaded(function() {
                b = i("#big-video-image").width() / i("#big-video-image").height(), t()
            })
        }
        var l, g, v, h = {
                useFlashForFirefox: !0,
                forceAutoplay: !1,
                controls: !1,
                doLoop: !1,
                container: i("body"),
                shrinkable: !1
            },
            p = this,
            u = "#big-video-vid",
            f = i('<div id="big-video-wrap"></div>'),
            b = (i(""), 16 / 9),
            m = 0,
            y = .8,
            w = !1,
            _ = !1,
            k = !1,
            x = !1,
            j = !1,
            L = [],
            I = i.extend({}, h, e);
        p.init = function() {
            if (!w) {
                I.container.prepend(f);
                var e = I.forceAutoplay ? "autoplay" : "";
                l = i('<video id="' + u.substr(1) + '" class="video-js vjs-default-skin" preload="auto" data-setup="{}" ' + e + " webkit-playsinline></video>"), l.css("position", "absolute"), f.append(l);
                var n = ["html5", "flash"],
                    r = navigator.userAgent.toLowerCase(),
                    c = -1 != r.indexOf("firefox");
                I.useFlashForFirefox && c && (n = ["flash", "html5"]), l = o(u.substr(1), {
                    controls: !1,
                    autoplay: !0,
                    preload: "auto",
                    techOrder: n
                }), I.controls && d(), t(), w = !0, k = !1, I.forceAutoplay && i("body").on("click", s), i("#big-video-vid_flash_api").attr("scale", "noborder").attr("width", "100%").attr("height", "100%"), i(window).on("resize.bigvideo", function() {
                    t()
                }), l.on("loadedmetadata", function() {
                    b = document.getElementById("big-video-vid_flash_api") ? document.getElementById("big-video-vid_flash_api").vjs_getProperty("videoWidth") / document.getElementById("big-video-vid_flash_api").vjs_getProperty("videoHeight") : i("#big-video-vid_html5_api").prop("videoWidth") / i("#big-video-vid_html5_api").prop("videoHeight"), t();
                    var o = Math.round(l.duration()),
                        e = Math.floor(o / 60),
                        d = o - 60 * e;
                    10 > d && (d = "0" + d), m = e + ":" + d
                }), l.on("ended", function() {
                    I.doLoop && (l.currentTime(0), l.play()), x && a()
                })
            }
        }, p.show = function(o, e) {
            if (void 0 === e && (e = {}), j = e.ambient === !0, (j || e.doLoop) && (I.doLoop = !0), "string" == typeof o) {
                var t = o.lastIndexOf("?") > 0 ? o.substring(o.lastIndexOf(".") + 1, o.lastIndexOf("?")) : o.substring(o.lastIndexOf(".") + 1);
                "jpg" == t || "gif" == t || "png" == t ? c(o) : ("mp4" == t || "ogg" == t || "ogv" == t || "webm" == t) && (r(o), e.onShown && e.onShown(), x = !1)
            } else if (i.isArray(o)) r(o);
            else {
                if ("object" != typeof o || !o.src || !o.type) throw "BigVideo.show received invalid input for parameter source";
                r([o])
            }
        }, p.showPlaylist = function(o, e) {
            if (!i.isArray(o)) throw "BigVideo.showPlaylist parameter files accepts only arrays";
            void 0 === e && (e = {}), j = e.ambient === !0, (j || e.doLoop) && (I.doLoop = !0), L = o, g = 0, this.show(L[g]), e.onShown && e.onShown(), x = !0
        }, p.getPlayer = function() {
            return l
        }, p.remove = p.dispose = function() {
            w = !1, f.remove(), i(window).off("resize.bigvideo"), l && (l.off("loadedmetadata"), l.off("ended"), l.dispose())
        }, p.triggerPlayer = function(i) {
            n(i)
        }
    }
});