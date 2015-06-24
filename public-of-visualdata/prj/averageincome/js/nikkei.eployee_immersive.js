(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function($, win, doc) {
  var ns;
  require('./lib/easing');
  win.nikkei = require('./lib/base');
  win.nikkei.ImgLoader = require('./lib/ImgLoader');
  win.nikkei.Scroller = require('./lib/Scroller');
  if (!win.nikkei.employee_immersive) {
    win.nikkei.employee_immersive = {};
  }
  ns = win.nikkei.employee_immersive;
  ns.Intro = require('./Intro.coffee');
  ns.Movie = require('./Movie.coffee');
  return ns.Main = (function() {
    function Main() {
      this.skip_intro = false;
      this.scroll_triggers = {};
    }

    Main.prototype.initialize = function() {
      this.checkHash();
      $((function(_this) {
        return function() {
          _this.onDocumentReady();
        };
      })(this));
      this.intro = new ns.Intro();
      $(this.intro).on('onIntroDocumentReady', $.proxy(this, 'onIntroReady')).on('onStart', $.proxy(this, 'onIntroStart')).on('onComplete', $.proxy(this, 'onIntroComplete')).on('onSizeChange', $.proxy(this, 'onIntroSizeChange'));
      if ($(win).width() < 568) {
        this.skip_intro = true;
      }
      if (!this.skip_intro) {
        nikkei.appendStyle(".main-content{visibility: hidden} .main-content .section{visibility:hidden} .main-content .section-intro{visibility:visible};");
        return this.intro.start();
      } else {
        return this.intro.skipAnim();
      }
    };

    Main.prototype.addCharts = function(options) {
      var key, obj;
      for (key in options) {
        obj = options[key];
        this.scroll_triggers[key] = obj;
      }
      return this;
    };

    Main.prototype.onDocumentReady = function() {
      var key, obj, promises, _ref;
      this.main_content = $('.main-content').first();
      this.adjustSectionHeader();
      if (!this.skip_intro) {
        promises = [];
        _ref = this.scroll_triggers;
        for (key in _ref) {
          obj = _ref[key];
          if (!key) {
            continue;
          }
          promises.push((new $.Deferred((function(_this) {
            return function(dfd) {
              return $(obj.object).on('onComplete', function() {
                return dfd.resolve(this);
              });
            };
          })(this))).promise());
          obj.callback.call(win);
        }
        $.when.apply($, promises).then((function(_this) {
          return function() {
            return _this.intro.setReadyBase();
          };
        })(this));
        this.scroll_triggers = {};
        this.main_content.addClass('intro-animating');
      } else {
        this.intro.setReadyBase();
        this.appendLoadingElmToCharts();
        $(win).on('scroll.Main_Charts', $.proxy(this, 'checkScroll')).triggerHandler('scroll.Main_Charts');
      }
      return $(win).on('resize.Main', $.proxy(this, 'onResize'));
    };

    Main.prototype.onIntroReady = function(evt, is_skip) {
      if (this.skip_intro) {
        this.main_content.removeClass('intro-animating');
      }
      return this.main_content.css({
        visibility: 'visible'
      });
    };

    Main.prototype.onIntroStart = function() {
      return this.main_content.find('> .section').css('visibility', 'visible');
    };

    Main.prototype.onIntroComplete = function() {
      var from_h, self, to_h;
      from_h = this.main_content.height();
      this.main_content.css('height', 'auto');
      to_h = this.main_content.height();
      if (!this.skip_intro) {
        self = this;
        if (nikkei.ua.Mobile) {
          this.main_content.removeClass('intro-animating');
          return self.setMovies();
        } else {
          return this.main_content.css({
            height: from_h
          }).delay(500).animate({
            height: to_h
          }, {
            duration: 1000,
            easing: 'easeOutQuad',
            complete: function() {
              $(this).css({
                height: 'auto'
              }).removeClass('intro-animating');
              return self.setMovies();
            }
          });
        }
      } else {
        if ($(this.skip_hash).size()) {
          this.movie_scroll_lock = true;
          this.setMovies();
          return setTimeout((function(_this) {
            return function() {
              var scroller;
              scroller = new win.nikkei.Scroller('html');
              $(scroller).on('onComplete', function() {
                _this.movie_scroll_lock = false;
                return $(win).triggerHandler('scroll.Main');
              });
              return scroller.scrollToNode($(_this.skip_hash), null, -30);
            };
          })(this), 10);
        } else {
          return this.setMovies();
        }
      }
    };

    Main.prototype.setMovies = function() {
      var self;
      this.movies = [];
      self = this;
      this.main_content.find('.movie-block').each(function() {
        var movie;
        movie = new ns.Movie({
          node: $(this)
        });
        movie.generate();
        return self.movies.push(movie);
      });
      $(win).on('scroll.Main', $.proxy(this, 'onScroll'));
      if (!this.movie_scroll_lock) {
        return $(win).triggerHandler('scroll.Main');
      }
    };

    Main.prototype.onIntroSizeChange = function(evt, height) {
      if (this.main_content && !this.skip_intro) {
        return this.main_content.height(height);
      }
    };

    Main.prototype.checkHash = function() {
      var hash;
      hash = location.hash;
      if (hash.match(/^#section\d\d$/) || hash.match(/^#skip_intro$/) || hash.match(/^#section\d\d_graph$/)) {
        this.skip_intro = true;
        return this.skip_hash = hash;
      }
    };

    Main.prototype.onScroll = function() {
      var sb, st, wh;
      if (this.movie_scroll_lock) {
        return;
      }
      wh = $(win).height();
      st = $(win).scrollTop();
      sb = st + wh;
      if (!nikkei.ua.Mobile) {
        return this.checkScrollForMovie(st, sb, wh);
      }
    };

    Main.prototype.checkScroll = function() {
      var key, obj, offset_top, sb, st, target, wh, _ref, _results;
      wh = $(win).height();
      st = $(win).scrollTop();
      sb = st + wh;
      _ref = this.scroll_triggers;
      _results = [];
      for (key in _ref) {
        obj = _ref[key];
        if (!key) {
          continue;
        }
        target = $(key);
        offset_top = target.offset().top - 100;
        if (target.size() && (offset_top < sb && sb < offset_top + wh * 2)) {
          obj.callback.call(win);
          _results.push(delete this.scroll_triggers[key]);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Main.prototype.checkScrollForMovie = function(st, sb, wh) {
      var m, offset_top, _i, _len, _ref, _results;
      _ref = this.movies;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        m = _ref[_i];
        offset_top = m.getOffest().top;
        if ((offset_top + m.getHeight() < sb && sb < offset_top + m.getHeight() + wh)) {
          if (!m.is_in) {
            m.play();
            _results.push(m.is_in = true);
          } else {
            _results.push(void 0);
          }
        } else {
          if (m.is_in) {
            m.pause();
            _results.push(m.is_in = false);
          } else {
            _results.push(void 0);
          }
        }
      }
      return _results;
    };

    Main.prototype.onResize = function() {
      return this.adjustSectionHeader();
    };

    Main.prototype.adjustSectionHeader = function() {
      var wh;
      if (!this.adjustSectionHeader_initialized) {
        this.main_content.find('.section-header .text-block').css({
          'padding-top': 'auto',
          'padding-bottom': 'auto'
        });
      }
      this.adjustSectionHeader_initialized = true;
      wh = $(win).height();
      return this.main_content.find('.section-header .text-block').removeAttr('style').each(function() {
        var h, pad;
        h = $(this).height();
        if (wh > h) {
          pad = Math.ceil((wh - h) / 2);
          return $(this).css({
            'padding-top': pad
          }).css({
            'padding-bottom': pad
          });
        }
      });
    };

    Main.prototype.appendLoadingElmToCharts = function() {
      var key, loading_view, obj, target, _ref, _results;
      loading_view = $('<div class="loading-view"><div class="spinner"></div><p class="text">loading...</p></div>');
      _ref = this.scroll_triggers;
      _results = [];
      for (key in _ref) {
        obj = _ref[key];
        if (!key) {
          continue;
        }
        target = $(key).find('.figure-block-content').first();
        if (target.size()) {
          obj.object.__loading_node = loading_view.clone().appendTo(target);
        }
        _results.push($(obj.object).on('onComplete', function() {
          if (this.__loading_node) {
            return this.__loading_node.fadeOut({
              duration: 300,
              complete: function() {
                return $(this).remove();
              }
            });
          }
        }));
      }
      return _results;
    };

    return Main;

  })();
})(jQuery, window, window.document);



},{"./Intro.coffee":2,"./Movie.coffee":3,"./lib/ImgLoader":4,"./lib/Scroller":5,"./lib/base":6,"./lib/easing":7}],2:[function(require,module,exports){
(function($, win, doc) {
  var Intro;
  if (!win.nikkei) {
    win.nikkei = require('./lib/base');
  }
  if (!win.nikkei.Scroller) {
    win.nikkei.Scroller = require('./lib/Scroller');
  }
  Intro = (function() {
    function Intro() {
      var i, n, path, path_o, _i;
      this.skip = false;
      this.image_loader = new win.nikkei.ImgLoader;
      for (i = _i = 1; _i <= 28; i = ++_i) {
        n = i;
        if (i.toString().length < 2) {
          n = '0' + i;
        }
        path = 'assets/img/intro/pic_' + n + '.jpg';
        path_o = 'assets/img/intro/pic_' + n + '_o.jpg';
        this.image_loader.push(path);
        this.image_loader.push(path_o);
      }
    }

    Intro.prototype.start = function() {
      var dfd1, dfd2, dfd3;
      if (this.anim_start) {
        return;
      }
      this.anim_start = true;
      dfd1 = new $.Deferred();
      dfd2 = new $.Deferred();
      dfd3 = new $.Deferred();
      this.dfd4 = new $.Deferred();
      $((function(_this) {
        return function() {
          _this.onDocumentReady();
          return dfd1.resolve();
        };
      })(this));
      this.image_loader.complete.add(function() {
        return dfd2.resolve();
      });
      setTimeout(function() {
        return dfd3.resolve();
      }, 1000);
      this.image_loader.start();
      nikkei.appendStyle('.section-intro .scene{visibility: hidden}');
      return $.when(dfd1, dfd2, dfd3, this.dfd4).done($.proxy(this, 'onReady'));
    };

    Intro.prototype.setReadyBase = function() {
      if (this.dfd4) {
        return this.dfd4.resolve();
      }
    };

    Intro.prototype.onDocumentReady = function() {
      this.node = $('.section-intro');
      this.btn_skip = this.node.find('.btn-skip').hide().on('click', $.proxy(this, 'skipAnim'));
      this.btn_scroll = this.node.find('.btn-scroll').hide().on('click', $.proxy(this, 'scrollToNext'));
      this.adjustSize();
      $(this).trigger('onIntroDocumentReady', this.skip);
      this.showLoading();
      if (!this.skip) {
        return (new win.nikkei.Scroller('html')).scrollToNode(this.node.get(0));
      }
    };

    Intro.prototype.showLoading = function() {
      return this.loading_view = $('<div class="loading-view"><div class="spinner"></div><p class="text">loading...</p></div>').prependTo(this.node).hide().fadeIn(600);
    };

    Intro.prototype.hideLoading = function() {
      return this.loading_view.fadeOut({
        duration: 300,
        complete: (function(_this) {
          return function() {
            _this.loading_view.remove();
            return _this.loading_view = null;
          };
        })(this)
      });
    };

    Intro.prototype.onReady = function() {
      var i, n, path, path_o, str, _i;
      this.scene03 = this.node.find('.scene03');
      this.image_canvas = this.scene03.find('.images');
      str = '';
      for (i = _i = 1; _i <= 28; i = ++_i) {
        n = i;
        if (i.toString().length < 2) {
          n = '0' + i;
        }
        path = 'assets/img/intro/pic_' + n + '.jpg';
        path_o = 'assets/img/intro/pic_' + n + '_o.jpg';
        str += "<div class=\"item\">\n  <img src=\"" + path_o + "\" alt=\"\" class=\"image-old\">\n  <img src=\"" + path + "\" alt=\"\" class=\"image-new\">\n</div>";
      }
      this.image_canvas.html(str);
      this.image_canvas.find('.image-new').hide();
      this.adjustSize();
      this.node.find('.scene').css({
        visibility: 'visible'
      }).hide();
      this.hideLoading();
      if (!this.skip) {
        this.startAnim();
      } else {
        this.endAnim(true);
      }
      $(win).on('resize.Intro orientationchange.Intro', $.proxy(this, 'onResize'));
      return $(this).trigger('onStart', this.skip);
    };

    Intro.prototype.startAnim = function() {
      var dfd1, items;
      items = this.node.find('.item');
      this.btn_skip.fadeIn(100);
      dfd1 = new $.Deferred((function(_this) {
        return function(dfd) {
          if (_this.skip) {
            dfd.resolve();
            return;
          }
          return _this.node.find('.scene01').show().find('.text').hide().delay(500).fadeIn({
            duration: 1000,
            complete: function() {
              if (this.skip) {
                $(this).fadeOut();
                dfd.resolve();
                return;
              }
              return $(this).delay(1500).fadeOut({
                duration: 1000,
                complete: function() {
                  return dfd.resolve();
                }
              });
            }
          });
        };
      })(this));
      return dfd1.then((function(_this) {
        return function() {
          var dfd;
          dfd = new $.Deferred(function(dfd) {
            if (_this.skip) {
              dfd.resolve();
              return;
            }
            return _this.node.find('.scene02').show().find('.text').hide().delay(300).fadeIn({
              duration: 1000,
              complete: function() {
                if (this.skip) {
                  $(this).fadeOut();
                  dfd.resolve();
                  return;
                }
                return $(this).delay(1500).fadeOut({
                  duration: 1000,
                  complete: function() {
                    return dfd.resolve();
                  }
                });
              }
            });
          });
          return dfd;
        };
      })(this)).then((function(_this) {
        return function() {
          var base_delay, col, delay, dfd_all, group, i, row, timeout, _i, _ref;
          _this.node.find('.scene03').find('.title').hide();
          _this.node.find('.scene03').show();
          items.hide();
          base_delay = 1000;
          delay = 0;
          col = 0;
          row = 0;
          for (i = _i = 0, _ref = items.size(); 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            if (i % _this.item_col === 0 && i !== 0) {
              col = 0;
              row++;
            }
            group = col + (row - 1);
            delay = _this.getItemDelay(group) + base_delay;
            items.eq(i).delay(delay).fadeIn({
              duration: 600
            });
            col++;
          }
          dfd_all = new $.Deferred();
          timeout = setTimeout(function() {
            return dfd_all.resolve();
          }, delay + 1000);
          if (_this.skip) {
            clearTimeout(timeout);
            timeout = null;
            items.find('.image-new').stop(true, true).show();
            items.stop(true, true).fadeIn(300);
            setTimeout(function() {
              return dfd_all.resolve();
            }, 0);
          }
          return dfd_all;
        };
      })(this)).then((function(_this) {
        return function() {
          var base_delay, col, delay, dfd_all, group, i, row, timeout, _i, _ref;
          base_delay = 750;
          delay = 500;
          col = 0;
          row = 0;
          for (i = _i = 0, _ref = items.size(); 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            if (i % _this.item_col === 0 && i !== 0) {
              col = 0;
              row++;
            }
            group = col + (row - 1);
            delay = _this.getItemDelay(group) + base_delay;
            items.eq(i).find('.image-new').delay(delay).fadeIn({
              duration: 600
            });
            col++;
          }
          dfd_all = new $.Deferred();
          timeout = setTimeout(function() {
            return dfd_all.resolve();
          }, delay + 1000);
          if (_this.skip) {
            clearTimeout(timeout);
            items.find('.image-new').stop(true, true).show();
            timeout = null;
            setTimeout(function() {
              return dfd_all.resolve();
            }, 0);
          }
          return dfd_all;
        };
      })(this)).then((function(_this) {
        return function() {
          _this.image_canvas.fadeOut({
            duration: 1000,
            complete: function() {
              _this.node.find('.scene03').find('.item').each(function(index) {
                var image_new, image_old;
                if (index % 2 === 0) {
                  image_new = $(this).find('.image-new');
                  image_old = $(this).find('.image-old');
                  image_old.removeClass('image-old').addClass('image-new');
                  return image_new.removeClass('image-new').addClass('image-old');
                }
              }).end().delay(100).find('.title').fadeIn({
                duration: 800,
                easing: 'linear'
              });
              return _this.image_canvas.delay(100 + 200).fadeIn({
                duration: 1000,
                easing: 'linear',
                complete: function() {
                  return _this.endAnim();
                }
              });
            }
          });
          if (_this.skip) {
            _this.image_canvas.stop(true, true);
          } else {
            return _this.btn_skip.fadeOut(100);
          }
        };
      })(this));
    };

    Intro.prototype.skipAnim = function() {
      if (this.skip) {
        return;
      }
      this.skip = true;
      if (!this.anim_start) {
        this.start();
      }
      if (this.btn_skip) {
        return this.btn_skip.fadeOut(100);
      }
    };

    Intro.prototype.endAnim = function(from_skip) {
      if (from_skip) {
        this.node.find('.scene03').fadeIn(300).find('.item').each(function(index) {
          var img_new, img_old;
          img_new = $(this).find('.image-new').show();
          if (index % 2 === 0) {
            img_old = $(this).find('.image-old');
            img_old.removeClass('image-old').addClass('image-new');
            return img_new.removeClass('image-new').addClass('image-old');
          }
        });
      }
      this.image_canvas.on('mouseenter', '.item', function() {
        return $(this).find('.image-new').stop(true, true).fadeOut(300);
      }).on('mouseleave', '.item', function() {
        return $(this).find('.image-new').stop(true, true).fadeIn(300);
      });
      this.btn_skip.fadeOut(100);
      $(this).trigger('onComplete');
      return this.showScrollButton();
    };

    Intro.prototype.getItemDelay = function(group) {
      var delay;
      delay = 0;
      if (group === 8) {
        delay = 1200;
      } else if (group === 7) {
        delay = 950;
      } else if (group === 6) {
        delay = 700;
      } else if (group === 5) {
        delay = 550;
      } else if (group === 4) {
        delay = 380;
      } else if (group === 3) {
        delay = 250;
      } else if (group === 2) {
        delay = 120;
      } else if (group === 1) {
        delay = 50;
      }
      return delay;
    };

    Intro.prototype.adjustSize = function() {
      var h, item_count, item_w, max_col, max_row, win_h, win_w;
      win_w = $(win).width();
      win_h = $(win).height();
      max_col = 7;
      max_row = 4;
      item_w = Math.ceil(win_w / max_col);
      if (win_w <= 568) {
        max_col = 3;
        item_w = Math.ceil(win_w / max_col);
        max_row = Math.min(9, Math.floor(win_h / item_w));
        this.skip = true;
      } else if (win_w <= 768) {
        max_col = 5;
        item_w = Math.ceil(win_w / max_col);
        max_row = Math.min(5, Math.floor(win_h / item_w));
      }
      this.item_col = max_col;
      this.item_row = max_row;
      item_count = max_col * max_row;
      h = max_row * item_w;
      if (this.image_canvas) {
        this.image_canvas.find('.item').each(function(index, node) {
          var c, r;
          r = Math.floor(index / max_col);
          c = index % max_col;
          return $(this).width(item_w).height(item_w).css({
            top: r * item_w,
            left: c * item_w
          });
        });
        this.image_canvas.height(h);
      }
      this.node.height(h);
      return $(this).trigger('onSizeChange', h);
    };

    Intro.prototype.onResize = function() {
      return this.adjustSize();
    };

    Intro.prototype.showScrollButton = function() {
      this.btn_scroll.show().stop(true, true);
      return this.scrollButtonBlink();
    };

    Intro.prototype.scrollButtonBlink = function() {
      return this.btn_scroll.animate({
        opacity: 0.01
      }, {
        easing: 'easeInSine',
        duration: 600
      }).delay(500).animate({
        opacity: 1
      }, {
        easing: 'easeOutSine',
        duration: 600,
        complete: (function(_this) {
          return function() {
            return setTimeout(function() {
              return _this.scrollButtonBlink();
            }, 1000);
          };
        })(this)
      });
    };

    Intro.prototype.scrollToNext = function(evt) {
      var hash;
      evt.preventDefault();
      hash = this.btn_scroll.attr('href');
      if ($(hash).size()) {
        return (new win.nikkei.Scroller('html')).scrollToNode($(hash).get(0));
      }
    };

    return Intro;

  })();
  return module.exports = Intro;
})(jQuery, window, window.document);



},{"./lib/Scroller":5,"./lib/base":6}],3:[function(require,module,exports){
(function($, win, doc) {
  var Movie, movie_count;
  if (!win.nikkei) {
    win.nikkei = require('./lib/base');
  }
  movie_count = 0;
  Movie = (function() {
    var MOVIE_BASE_HEIGHT, MOVIE_BASE_WIDTH;

    MOVIE_BASE_WIDTH = 1280;

    MOVIE_BASE_HEIGHT = 720;

    function Movie(params) {
      this.node = params.node;
      movie_count++;
      this.id = movie_count;
      this.is_movie_ready = false;
    }

    Movie.prototype.generate = function() {
      var poster_path, self, size;
      this.movie_path = this.node.data('movie_path');
      this.poster_path = poster_path = this.node.data('movie_cover_path');
      if (!this.movie_path) {
        return;
      }
      this.media = $('<div class="media"></div>').appendTo(this.node);
      this.adjustSize();
      this.movie_cover = $(document.createElement('div')).addClass('movie-cover').css({
        'background-image': 'url(' + this.poster_path + ')',
        'background-size': 'cover'
      }).appendTo(this.node);
      this.start_icon = $('<div class="btn btn-image btn-play"></div>').appendTo(this.node).hide();
      this.cover_button = $('<div class="cover-button"></div>').appendTo(this.node).css({
        opacity: 0
      }).on('click', (function(_this) {
        return function(evt) {
          evt.preventDefault();
          _this.togglePlay();
          if (nikkei.ua.Android) {
            _this.cover_button.remove();
            return _this.start_icon.fadeOut({
              duration: 300,
              complete: function() {
                _this.start_icon.remove();
                return _this.start_icon = null;
              }
            });
          }
        };
      })(this));
      if (!nikkei.ua.iOSPhone && !nikkei.ua.Android) {
        this.bar = $('<div class="bar"><div></div></div>').appendTo(this.node);
        this.pause_icon = $('<div class="btn btn-image btn-pause"></div>').appendTo(this.node).hide();
      }
      self = this;
      size = this.getVideoSize();
      this.media.css('visibility', 'hidden');
      this.media.jPlayer({
        ready: function() {
          self.media.css('visibility', 'visible');
          $(this).jPlayer("setMedia", {
            m4v: self.movie_path
          });
          self.is_movie_ready = true;
          if (!nikkei.ua.Mobile) {
            $(this).jPlayer("play", 0);
            return $(this).jPlayer("pause", 1);
          }
        },
        swfPath: "assets/swf/",
        backgroundColor: "#000000",
        solution: 'html,flash',
        preload: 'auto',
        supplied: 'm4v',
        wmode: "window",
        nativeVideoControls: {
          iphone: /iphone/,
          ipod: /ipod/,
          android: /android/
        },
        volume: 50,
        muted: false,
        loop: false,
        poster: poster_path,
        size: {
          width: size.width,
          height: size.height
        },
        play: (function(_this) {
          return function() {
            return _this.onPlay();
          };
        })(this),
        warning: function(evt) {},
        pause: (function(_this) {
          return function() {
            if (!_this.is_movie_ready) {
              return;
            }
            return _this.onPause();
          };
        })(this),
        ended: (function(_this) {
          return function() {
            return _this.onEnd();
          };
        })(this),
        timeupdate: (function(_this) {
          return function(evt) {
            if (_this.bar) {
              return _this.bar.find('div').css('width', evt.jPlayer.status.currentPercentAbsolute + '%');
            }
          };
        })(this)
      });
      if (nikkei.ua.Mobile) {
        this.setMobileMode();
      }
      return $(win).on('resize.Movie, orientationchange.Movie', $.proxy(this, 'onResize'));
    };

    Movie.prototype.setMobileMode = function() {
      return this.showIcon(1);
    };

    Movie.prototype.togglePlay = function() {
      if (!this.is_playing) {
        return this.play();
      } else {
        return this.pause();
      }
    };

    Movie.prototype.showIcon = function(type, remove_element) {
      var target_icon;
      if (this.start_icon) {
        this.start_icon.stop(true, true).fadeOut(300);
      }
      if (this.pause_icon) {
        this.pause_icon.stop(true, true).fadeOut(300);
      }
      target_icon = type === 1 ? this.start_icon : this.pause_icon;
      if (!target_icon) {
        return;
      }
      target_icon.stop(true, true).removeAttr('style');
      if (remove_element) {
        return target_icon.css({
          opacity: 0.7
        }).animate({
          opacity: 0,
          width: 64 * 1.5,
          height: 64 * 1.5
        }, {
          duration: 600,
          easing: 'easeOutQuad',
          complete: function() {
            return $(this).hide();
          }
        });
      } else {
        return target_icon.hide().fadeIn(300);
      }
    };

    Movie.prototype.play = function() {
      if (this.is_movie_ready && !this.is_playing) {
        return this.media.jPlayer('play');
      }
    };

    Movie.prototype.pause = function() {
      if (this.is_movie_ready && this.is_playing) {
        return this.media.jPlayer('pause');
      }
    };

    Movie.prototype.onPlay = function() {
      if (this.movie_cover) {
        this.movie_cover.fadeOut({
          duration: 300,
          complete: (function(_this) {
            return function() {
              _this.movie_cover.remove();
              return _this.movie_cover = null;
            };
          })(this)
        });
      }
      this.is_playing = true;
      return this.showIcon(1, true);
    };

    Movie.prototype.onPause = function() {
      this.is_playing = false;
      return this.showIcon(0, true);
    };

    Movie.prototype.onEnd = function() {
      this.is_playing = false;
      this.showIcon(1);
      if (!nikkei.ua.Mobile) {
        $(this).jPlayer("play", 0);
        return $(this).jPlayer("pause", 0);
      }
    };

    Movie.prototype.onError = function() {
      return this.media.jPlayer('destroy');
    };

    Movie.prototype.onResize = function(evt) {
      return this.adjustSize();
    };

    Movie.prototype.getVideoSize = function() {
      var h, scale, w;
      w = this.node.width();
      scale = w / MOVIE_BASE_WIDTH;
      h = Math.ceil(MOVIE_BASE_HEIGHT * scale);
      return {
        width: w,
        height: h
      };
    };

    Movie.prototype.adjustSize = function() {
      var size;
      this.node.css({
        width: 'auto',
        height: 'auto'
      });
      size = this.getVideoSize();
      this.node.width(size.width).height(size.height);
      this.media.width(size.width).height(size.height);
      if (this.is_movie_ready) {
        return this.media.jPlayer({
          size: {
            width: size.width,
            height: size.height
          }
        });
      }
    };

    Movie.prototype.getOffest = function() {
      return this.node.offset();
    };

    Movie.prototype.getHeight = function() {
      return this.node.outerHeight();
    };

    return Movie;

  })();
  return module.exports = Movie;
})(jQuery, window, window.document);



},{"./lib/base":6}],4:[function(require,module,exports){
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

(function($, win, doc) {
  var ImgLoader;
  ImgLoader = (function() {
    function ImgLoader() {
      this.images = {};
      this.complete = new $.Callbacks;
      this.error = new $.Callbacks;
      this.load = new $.Callbacks;
    }

    ImgLoader.prototype.push = function(img) {
      if ($.isArray(img)) {
        img.forEach($.proxy(this, 'push'));
        return this;
      }
      if (!(__indexOf.call(this.images, img) >= 0)) {
        this.images[img] = new Image;
      }
      return this;
    };

    ImgLoader.prototype.start = function() {
      var key, o, promises, _ref;
      promises = [];
      _ref = this.images;
      for (key in _ref) {
        o = _ref[key];
        promises.push((new $.Deferred((function(_this) {
          return function(dfd) {
            var image;
            image = _this.images[key];
            image.onload = function() {
              _this.load.fire(_this);
              return dfd.resolve(_this);
            };
            image.onerror = function() {
              _this.error.fire(_this);
              return dfd.reject(_this);
            };
            return image.src = key;
          };
        })(this))).promise());
      }
      return $.when.apply($, promises).then((function(_this) {
        return function() {
          _this.complete.fire(_this);
          return _this.images = {};
        };
      })(this));
    };

    ImgLoader.prototype.get = function(img) {
      return this.images[img];
    };

    return ImgLoader;

  })();
  return module.exports = ImgLoader;
})(jQuery, window, window.document);



},{}],5:[function(require,module,exports){
(function($, win, doc) {
  var Scroller, nikkei;
  nikkei = require('./base');
  Scroller = (function() {
    function Scroller(node, offsetX, offsetY, duration, easing) {
      this.node = $(node).get(0);
      this.offsetX = Number(offsetX) || 0;
      this.offsetY = Number(offsetY) || 0;
      this.duration = Number(duration) >= 0 ? Number(duration) : 1000;
      this.easing = $.easing[easing] != null ? easing : 'easeInOutQuad';
      this.isSafari = !!nikkei.ua.Webkit;
      this.init();
    }

    Scroller.prototype.init = function() {
      var $node;
      if (!this.node || this.node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }
      $node = $(this.node).is('html, body') ? $(doc) : $(this.node);
      if (!$node.mousewheel) {
        return $node.mousewheel = new Function;
      }
    };

    Scroller.prototype.setMobileIgnore = function(bool) {
      return this.is_mobile_ignore = bool;
    };

    Scroller.prototype.setEasing = function(easing) {
      var def;
      def = 'easeInOutQuad';
      if (typeof easing === 'string') {
        this.easing = $.easing[easing] ? easing : def;
      } else if (typeof easing === 'object') {
        if (easing["default"]) {
          this.easing = $.easing[easing["default"]] ? easing["default"] : def;
        }
        if (easing.down) {
          this.easing_down = $.easing[easing.down] ? easing.down : null;
        }
        if (easing.up) {
          this.easing_up = $.easing[easing.up] ? easing.up : null;
        }
      }
      return this;
    };

    Scroller.prototype.scrollTo = function(x, y, duration, offsetY, delay) {
      var $node, maxX, maxY, options, params, zoom;
      if (isNaN(x) || isNaN(y)) {
        throw new TypeError('Scroller.scrollTo: all arguments must be numbers.');
      }
      zoom = 1;
      maxX = Math.max(0, this.node.scrollWidth - this.node.clientWidth);
      maxY = Math.max(0, this.node.scrollHeight - this.node.clientHeight);
      duration = Number(duration) >= 0 ? Number(duration) : this.duration;
      if (offsetY == null) {
        offsetY = 0;
      }
      if (delay == null) {
        delay = 0;
      }
      params = {
        scrollTop: Math.min(maxY, Math.max(0, Math.round((y + this.offsetY + offsetY) * zoom)))
      };
      options = {
        duration: duration,
        easing: this.easing,
        step: $.proxy(this.step, this),
        complete: $.proxy(this.complete, this)
      };
      $node = this.getScrollNode();
      if ($node.scrollTop() !== params.scrollTop) {
        if (this.easing_down && $node.scrollTop() < params.scrollTop) {
          options.easing = this.easing_down;
        } else if (this.easing_up && $node.scrollTop() > params.scrollTop) {
          options.easing = this.easing_up;
        }
        this.abort();
        this.doCallbackByName('onStart');
        this.isBusy = true;
        $node.stop(true, true).delay(delay).animate(params, options);
      } else {
        this.doCallbackByName('onComplete');
      }
      return this;
    };

    Scroller.prototype.scrollToNode = function(node, duration, offsetY, delay) {
      var $base, $node, basePos, baseSrl, nodePos, tmp, _ref;
      node = $(node).get(0);
      if (!node || node.nodeType !== Node.ELEMENT_NODE) {
        throw new TypeError('Scroller.scrollToNode: first argument must be an element node.');
      }
      duration = Number(duration) >= 0 ? Number(duration) : this.duration;
      if (offsetY == null) {
        offsetY = 0;
      }
      $base = $(this.node);
      $node = $(node);
      tmp = $node.parents().filter(function() {
        return this === $base.get(0);
      }).get(0);
      if (tmp) {
        basePos = $base.is('html, body') ? {
          left: 0,
          top: 0
        } : $base.offset();
        baseSrl = $base.is('html, body') ? {
          left: 0,
          top: 0
        } : {
          left: $base.scrollLeft(),
          top: $base.scrollTop()
        };
        nodePos = $node.offset();
        this.scrollTo(nodePos.left + baseSrl.left - basePos.left + ((_ref = this.isSafari) != null ? _ref : {
          4: 0
        }), nodePos.top + baseSrl.top - basePos.top, duration, offsetY, delay);
      }
      return this;
    };

    Scroller.prototype.step = function() {
      return this.doCallbackByName('onScroll');
    };

    Scroller.prototype.complete = function() {
      return this.doCallbackByName('onComplete');
    };

    Scroller.prototype.abort = function() {
      var $node;
      $node = $(this.node);
      if ($node.is(':animated')) {
        $node.stop();
        this.doCallbackByName('onAbort');
      }
      return this;
    };

    Scroller.prototype.doCallbackByName = function(name) {
      return $(this).trigger(name, this.node.scrollLeft, this.node.scrollTop);
    };

    Scroller.prototype.getScrollNode = function() {
      if (nikkei.ua.Webkit && $(this.node).is('html')) {
        return $(document.body);
      } else {
        return $(this.node);
      }
    };

    return Scroller;

  })();
  return module.exports = Scroller;
})(jQuery, window, window.document);



},{"./base":6}],6:[function(require,module,exports){
(function($, win, doc) {
  var ns;
  ns = {};
  if (win.console == null) {
    win.console = {
      element: null,
      firebug: "0",
      userObjects: {},
      assert: function() {},
      clear: function() {},
      count: function() {},
      debug: function() {},
      dir: function() {},
      dirxml: function() {},
      error: function() {},
      getFirebugElement: function() {},
      group: function() {},
      groupCollapsed: function() {},
      groupEnd: function() {},
      log: function() {},
      notifyFirebug: function() {},
      profile: function() {},
      profileEnd: function() {},
      time: function() {},
      timeEnd: function() {},
      trace: function() {},
      warn: function() {}
    };
  }
  if (win.Node == null) {
    win.Node = {
      ELEMENT_NODE: 1,
      ATTRIBUTE_NODE: 2,
      TEXT_NODE: 3,
      CDATA_SECTION_NODE: 4,
      ENTITY_REFERENCE_NODE: 5,
      ENTITY_NODE: 6,
      PROCESSING_INSTRUCTION_NODE: 7,
      COMMENT_NODE: 8,
      DOCUMENT_NODE: 9,
      DOCUMENT_TYPE_NODE: 10,
      DOCUMENT_FRAGMENT_NODE: 11,
      NOTATION_NODE: 12
    };
  }
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(aCallback, aThisObject) {
      var i, index, _i, _len, _results;
      _results = [];
      for (index = _i = 0, _len = this.length; _i < _len; index = ++_i) {
        i = this[index];
        _results.push(aCallback.call(aThisObject, i, index, this));
      }
      return _results;
    };
  }
  if (!Array.prototype.map) {
    Array.prototype.map = function(aCallback, aThisObject) {
      var i, index, ret, _i, _len;
      ret = [];
      for (index = _i = 0, _len = this.length; _i < _len; index = ++_i) {
        i = this[index];
        ret.push(aCallback.call(aThisObject, i, index, this));
      }
      return ret;
    };
  }
  if (!Array.prototype.filter) {
    Array.prototype.filter = function(aCallback, aThisObject) {
      var index, item, ret, _i, _len;
      if (!aThisObject) {
        aThisObject = this;
      }
      ret = [];
      for (index = _i = 0, _len = this.length; _i < _len; index = ++_i) {
        item = this[index];
        if (aCallback.call(aThisObject, item, index, this)) {
          ret.push(item);
        }
      }
      return ret;
    };
  }
  if (!String.prototype.trunc) {
    String.prototype.trunc = function(n, useWordBoundary, debug) {
      var s_, toLong;
      toLong = this.length > n;
      s_ = toLong ? this.substr(0, n - 1) : this;
      if (useWordBoundary && toLong && s_.lastIndexOf(' ') > 1) {
        s_ = s_.substr(0, s_.lastIndexOf(' '));
      }
      if (toLong) {
        return s_ + ' ...'.toString();
      } else {
        return s_.toString();
      }
    };
  }
  if (!String.prototype.formatString) {
    String.prototype.formatString = function(replaceObj) {
      var res;
      if (typeof replaceObj !== 'object') {
        throw new TypeError('String.prototype.formatString');
      }
      res = this;
      $.each(replaceObj, function(i, str) {
        return res = res.replace(new RegExp('\\$\\{' + i + '\\}', 'g'), str);
      });
      return res;
    };
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
      return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
        return window.setTimeout(callback, 1000 / 60);
      };
    })();
  }
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(aSearchElement, aFromIndex) {
      var end, i, start, _i;
      if (typeof aFromIndex !== 'number') {
        aFromIndex = 0;
      } else if (aFromIndex < 0) {
        aFromIndex = this.length + aFromIndex;
      }
      start = aFromIndex;
      end = this.length - 1;
      for (i = _i = start; start <= end ? _i <= end : _i >= end; i = start <= end ? ++_i : --_i) {
        if (this[i] === aSearchElement) {
          return i;
        }
      }
      return -1;
    };
  }
  win.escapeHTMLReg = new RegExp('[&"<>]', "g");
  win.escapeHTMLRule = {
    "&": "&amp;",
    '"': "&quot;",
    "<": "&lt;",
    ">": "&gt;"
  };
  String.prototype.escapeHTML = function() {
    return this.replace(win.escapeHTMLReg, function(c) {
      return win.escapeHTMLRule[c];
    });
  };
  ns.mac_reg = new RegExp('Macintosh', "i");
  ns.ua = (function() {
    return {
      lteIE6: typeof window.addEventListener === 'undefined' && typeof document.documentElement.style.maxHeight === 'undefined',
      lteIE7: typeof window.addEventListener === 'undefined' && typeof document.querySelectorAll === 'undefined',
      lteIE8: typeof window.addEventListener === 'undefined' && typeof document.getElementsByClassName === 'undefined',
      IE: document.uniqueID,
      Firefox: window.sidebar,
      Opera: window.opera,
      Webkit: !document.uniqueID && !window.opera && !window.sidebar && typeof window.localStorage !== "undefined",
      Chrome: navigator.userAgent.toLowerCase().indexOf('chrome') !== -1,
      Firefox: navigator.userAgent.toLowerCase().indexOf('firefox') !== -1,
      Mac: navigator.userAgent.match(ns.mac_reg),
      Mobile: typeof window.orientation !== 'undefined',
      iPhone: navigator.userAgent.toLowerCase().indexOf('iphone') !== -1,
      iPod: navigator.userAgent.toLowerCase().indexOf('ipod') !== -1,
      iOSPhone: navigator.userAgent.toLowerCase().indexOf('iphone') !== -1 || navigator.userAgent.toLowerCase().indexOf('ipod') !== -1,
      Android: navigator.userAgent.toLowerCase().indexOf('android') !== -1,
      AndroidPad: navigator.userAgent.toLowerCase().match(/android(?!.*?mobile)/),
      AndroidPone: navigator.userAgent.toLowerCase().match(/android.*?mobile/)
    };
  })();
  ns.ua.isRetina = (function() {
    var mediaQuery;
    mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)";
    if (win.devicePixelRatio > 1) {
      return true;
    }
    if (win.matchMedia && win.matchMedia(mediaQuery).matches) {
      return true;
    }
    return false;
  })();
  ns.addBrowserPrefix = function(string) {
    var result;
    result = '';
    if (ns.ua.Webkit) {
      result = '-webkit-' + string;
    } else if (ns.ua.Firefox) {
      result = '-moz-' + string;
    } else if (ns.ua.Opera) {
      result = '-o-' + string;
    } else if (ns.ua.IE) {
      result = '-ms-' + string;
    }
    return result;
  };
  ns.zeroPadding = function(v, l) {
    var i, zero;
    zero = '';
    if (!l) {
      l = 2;
    }
    i = 0;
    while (i < l - 1) {
      zero += '0';
      i++;
    }
    return (zero + v).slice(-l);
  };
  ns.zeroPaddingString = function(n, p) {
    var s;
    if (ns.ua.lteIE6) {
      return ns.zeroPadding(n, p);
    }
    if (!p) {
      p = 2;
    }
    s = "000000" + n.toString();
    return s.substr(-1 * p);
  };
  ns.numberFormat = function(v) {
    return String(v).replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
  };
  ns.trimString = function(str, type) {
    if (!str) {
      return str;
    }
    if (type === 'l') {
      return str.replace(/^\s+/, "");
    } else if (type === 'r') {
      return str.replace(/\s+$/, "");
    } else {
      return str.replace(/(^\s+)|(\s+$)/g, "");
    }
  };
  ns.nl2br = function(str) {
    if (!str) {
      return str;
    }
    return str.replace(/(\r\n|\r|\n)/g, '<br>');
  };
  ns.getRandomArray = function(n) {
    var a, b, i, l, m, r, _i, _j;
    a = [];
    b = [];
    m = n - 1;
    for (i = _i = 0; 0 <= m ? _i <= m : _i >= m; i = 0 <= m ? ++_i : --_i) {
      a.push(i);
    }
    for (i = _j = 0; 0 <= m ? _j <= m : _j >= m; i = 0 <= m ? ++_j : --_j) {
      l = a.length;
      r = Math.floor(l * Math.random());
      b.push(a.splice(r, 1)[0]);
    }
    return b;
  };
  ns.appendStyle = function(str_style) {
    var head, style;
    head = $('head');
    style = head.find('style');
    if (!style.size()) {
      style = $(document.createElement('style')).appendTo(head);
    }
    return style.append(str_style);
  };
  ns.URLQuery = (function() {
    function URLQuery() {
      this.init();
    }

    URLQuery.prototype.init = function() {
      var i, pair, q, qsa, value, _results;
      this.key_map = {};
      if (location.search != null) {
        q = location.search.substring(1);
        qsa = q.split('&');
        _results = [];
        for (i in qsa) {
          value = qsa[i];
          if (typeof value !== 'string') {
            continue;
          }
          pair = value.split('=');
          if (pair[0] == null) {
            continue;
          }
          _results.push(this.key_map[pair[0]] = unescape(pair[1]));
        }
        return _results;
      }
    };

    URLQuery.prototype.get = function(key) {
      return this.key_map[key];
    };

    return URLQuery;

  })();
  $.fn.extend({
    kmrSetImgHover: function(options) {
      var r, target;
      if (ns.ua.lteIE6) {
        return this;
      }
      if (typeof options === 'undefined') {
        options = {};
      }
      if (typeof options === 'string') {
        options = {
          target: options
        };
      }
      target = this;
      if (options.target) {
        target = this.find(options.target);
      }
      r = new RegExp('\.(gif|jpe?g|png)$');
      target.filter('img').each(function() {
        var over_src;
        over_src = $(this).attr('src').replace(r, function($0) {
          return '_o' + $0;
        });
        $(this).data('org_src', $(this).attr('src')).data('over_src', over_src);
        return (new Image()).src = over_src;
      });
      $(this).data('target', options.target).off('mouseenter.setImgHover mouseleave.setImgHover').on('mouseenter.setImgHover', function(evt) {
        target = $(this);
        if ($(this).data('target')) {
          target = $(this).find($(this).data('target'));
        }
        return target.filter('img').each(function() {
          return $(this).attr('src', $(this).data('over_src'));
        });
      }).on('mouseleave.setImgHover', function() {
        target = $(this);
        if ($(this).data('target')) {
          target = $(this).find($(this).data('target'));
        }
        return target.filter('img').each(function() {
          return $(this).attr('src', $(this).data('org_src'));
        });
      });
      return this;
    },
    kmrSetAlphaHover: function(options) {
      if (typeof options === 'undefined') {
        options = {};
      }
      if (typeof options === 'string') {
        options = {
          target: options
        };
      }
      if (typeof options.to_alpha === 'undefined') {
        options.to_alpha = 0.6;
      }
      if (typeof options.duration === 'undefined') {
        options.duration = 100;
      }
      if (typeof options.easing === 'undefined') {
        options.easing = 'linear';
      }
      return $(this).each(function() {
        var target;
        target = this;
        if (options.target) {
          target = this.find(options.target);
        }
        return $(this).data('setImgAlphaHoverTarget', target).data('setImgAlphaHoverOptions', options).hover(function() {
          target = $(this).data('setImgAlphaHoverTarget');
          options = $(this).data('setImgAlphaHoverOptions');
          return $(target).animate({
            opacity: options.to_alpha
          }, {
            duration: options.duration,
            easing: options.easing
          });
        }, function() {
          target = $(this).data('setImgAlphaHoverTarget');
          options = $(this).data('setImgAlphaHoverOptions');
          return $(target).animate({
            opacity: 1
          }, {
            duration: options.duration,
            easing: options.easing
          });
        });
      });
    }
  });
  return module.exports = ns;
})(jQuery, window, window.document);



},{}],7:[function(require,module,exports){
jQuery.easing['jswing'] = jQuery.easing['swing'];

if (!jQuery.easing.easeOutQuad) {
  jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    swing: function(x, t, b, c, d) {
      return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function(x, t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    easeOutQuad: function(x, t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(x, t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b;
      }
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInCubic: function(x, t, b, c, d) {
      return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(x, t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(x, t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
      }
      return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function(x, t, b, c, d) {
      return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(x, t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function(x, t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t + b;
      }
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function(x, t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(x, t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(x, t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t * t + b;
      }
      return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function(x, t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(x, t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(x, t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(x, t, b, c, d) {
      if (t === 0) {
        return b;
      } else {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
      }
    },
    easeOutExpo: function(x, t, b, c, d) {
      if (t === d) {
        return b + c;
      } else {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
      }
    },
    easeInOutExpo: function(x, t, b, c, d) {
      if (t === 0) {
        return b;
      }
      if (t === d) {
        return b + c;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      }
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function(x, t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(x, t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function(x, t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      }
      return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeOutElastic: function(x, t, b, c, d) {
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) {
        return b;
      }
      if ((t /= d) === 1) {
        return b + c;
      }
      if (!p) {
        p = d * .3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeOutBack: function(x, t, b, c, d, s) {
      if (s === void 0) {
        s = 1.70158;
      }
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInBounce: function(x, t, b, c, d) {
      return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
    },
    easeOutBounce: function(x, t, b, c, d) {
      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
      } else if (t < (2 / 2.75)) {
        t -= 1.5 / 2.75;
        return c * (7.5625 * t * t + 0.75) + b;
      } else if (t < (2.5 / 2.75)) {
        t -= 2.25 / 2.75;
        return c * (7.5625 * t * t + 0.9375) + b;
      } else {
        t -= 2.625 / 2.75;
        return c * (7.5625 * t * t + 0.984375) + b;
      }
    },
    easeInOutBounce: function(x, t, b, c, d) {
      if (t < d / 2) {
        return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * 0.5 + b;
      }
      return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
  });
}



},{}]},{},[1]);
