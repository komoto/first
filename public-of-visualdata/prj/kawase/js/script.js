$(function() {
    $(window).on("load", function() {
        $(".pageBody_loading").fadeOut(500, function() {
            $(this).remove()
        })
    }), $("img.rollover").mouseover(function() {
        $(this).attr("src", $(this).attr("src").replace(/^(.+)(\.[a-z]+)$/, "$1_o$2"))
    }).mouseout(function() {
        $(this).attr("src", $(this).attr("src").replace(/^(.+)_o(\.[a-z]+)$/, "$1$2"))
    }).each(function() {
        $("<img>").attr("src", $(this).attr("src").replace(/^(.+)(\.[a-z]+)$/, "$1_o$2"))
    }), $("a[href^=#]").click(function() {
        if ("modal" != this.getAttribute("data-toggle") && "early" != this.getAttribute("data-menuanchor") && "middle" != this.getAttribute("data-menuanchor") && "late" != this.getAttribute("data-menuanchor") && "last" != this.getAttribute("data-menuanchor")) {
            var t = 80,
                a = $(this).attr("href"),
                e = $("#" == a || "" == a ? "html" : a),
                r = e.offset().top - t;
            return $("html, body").animate({
                scrollTop: r
            }, 300), !1
        }
    }); {
        var t = window.navigator.userAgent.toLowerCase();
        window.navigator.appVersion.toLowerCase()
    } - 1 != t.indexOf("safari") && $(".pageBody_header_fixed").addClass("pageBody_header_absolute")
});
! function(t) {
    function e() {
        var e, i, n = {
            height: a.innerHeight,
            width: a.innerWidth
        };
        return n.height || (e = r.compatMode, (e || !t.support.boxModel) && (i = "CSS1Compat" === e ? f : r.body, n = {
            height: i.clientHeight,
            width: i.clientWidth
        })), n
    }

    function i() {
        return {
            top: a.pageYOffset || f.scrollTop || r.body.scrollTop,
            left: a.pageXOffset || f.scrollLeft || r.body.scrollLeft
        }
    }

    function n() {
        var n, l = t(),
            r = 0;
        if (t.each(d, function(t, e) {
                var i = e.data.selector,
                    n = e.$element;
                l = l.add(i ? n.find(i) : n)
            }), n = l.length)
            for (o = o || e(), h = h || i(); n > r; r++)
                if (t.contains(f, l[r])) {
                    var a, c, p, s = t(l[r]),
                        u = {
                            height: s.height(),
                            width: s.width()
                        },
                        g = s.offset(),
                        v = s.data("inview");
                    if (!h || !o) return;
                    g.top + u.height > h.top && g.top < h.top + o.height && g.left + u.width > h.left && g.left < h.left + o.width ? (a = h.left > g.left ? "right" : h.left + o.width < g.left + u.width ? "left" : "both", c = h.top > g.top ? "bottom" : h.top + o.height < g.top + u.height ? "top" : "both", p = a + "-" + c, v && v === p || s.data("inview", p).trigger("inview", [!0, a, c])) : v && s.data("inview", !1).trigger("inview", [!1])
                }
    }
    var o, h, l, d = {},
        r = document,
        a = window,
        f = r.documentElement,
        c = t.expando;
    t.event.special.inview = {
        add: function(e) {
            d[e.guid + "-" + this[c]] = {
                data: e,
                $element: t(this)
            }, l || t.isEmptyObject(d) || (l = setInterval(n, 250))
        },
        remove: function(e) {
            try {
                delete d[e.guid + "-" + this[c]]
            } catch (i) {}
            t.isEmptyObject(d) && (clearInterval(l), l = null)
        }
    }, t(a).bind("scroll resize scrollstop", function() {
        o = h = null
    }), !f.addEventListener && f.attachEvent && f.attachEvent("onfocusin", function() {
        h = null
    })
}(jQuery);