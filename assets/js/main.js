/**********************************************
MANHATTAN HYDRAULICS
A down to earth product studio.
==============================================

js/main.js
This file contains the main javscript code
to power microinteractions on the site.

NOTE:
I've decided to use jQuery because it's an
easier developer experience for anyone on the
team who might be new to javascript.

**********************************************/

$(document).ready(function () {
  $.easing = Object.assign({}, $.easing, {
    easeInOutCirc: function (x, t, b, c, d) {
      if ((t /= d / 2) < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
      return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
  });

  var site = {
    animationSettings: {
      speed: 360,
      easing: "easeInOutCirc",
    },

    ui: {
      body: $("body"),
      win: $(window),
      panels: $(".panel"),
      headers: $("header"),
      footer: $("footer"),
      leftPanel: {
        el: $(".panel--left"),
        key: "left",
      },
      rightPanel: {
        el: $(".panel--right"),
        key: "right",
      },
    },

    sizes: {},

    ix: {
      enabled: true,

      handleMouseLeave: function () {
        this.closePanel(site.ui.leftPanel.el);
        this.closePanel(site.ui.rightPanel.el);
      },

      handlePanelHover: function (panel) {
        this.openPanel(panel);
      },

      handlePanelLeave: function (panel) {
        this.closePanel(panel);
      },

      openPanel: function (panel) {
        $(panel).is(site.ui.leftPanel.el)
          ? $(site.ui.body).addClass("left")
          : $(site.ui.body).addClass("right");
        $(panel).animate(
          {
            "padding-top": 0,
          },
          {
            easing: site.animationSettings.easing,
            duration: site.animationSettings.speed,
          }
        );
      },

      closePanel: function (panel) {
        if ($(panel).is(site.ui.leftPanel.el)) {
          $(site.ui.body).removeClass("left");
        } else {
          $(site.ui.body).removeClass("right");
        }

        $(panel).stop().animate(
          {
            "padding-top": site.sizes.headerHeight,
          },
          {
            duration: site.animationSettings.speed,
          }
        );
      },
    },

    getSizes: function () {
      site.sizes.winWidth = site.ui.win.width();
      site.sizes.winHeight = site.ui.win.height();
      site.sizes.headerHeight =
        site.sizes.winHeight -
        (site.ui.footer.height() + site.ui.headers.height());
    },

    checkIfMobile: function () {
      if (site.sizes.winWidth <= 767) {
        site.ix.enabled = false;
        return true;
      } else {
        site.ix.enabled = true;
        return false;
      }
    },

    equalHeight: function (group) {
      //group.css('height','auto');
      var tallest = 0;
      group.each(function () {
        var thisHeight = $(this).height();
        if (thisHeight > tallest) {
          tallest = thisHeight;
        }
      });
      group.height(tallest);
    },

    init: function () {
      this.getSizes();
      this.checkIfMobile();
      this.ui.win.resize(this.resize);
      if (site.ix.enabled) {
        this.bindEvents();
        this.setPositions();
        this.equalHeight($(".panel header svg"));
      }
    },

    resizeTimer: null,
    resize: function () {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(function () {
        site.getSizes();
        site.checkIfMobile();
        if (site.ix.enabled) {
          site.bindEvents();
          site.setPositions();
          site.equalHeight($(".panel header svg"));
        } else {
          site.unbindEvents();
          $(".panel, main").removeAttr("style");
        }
      }, 250);
    },

    bindEvents: function () {
      $.each([site.ui.leftPanel.el, site.ui.rightPanel.el], function () {
        $(this)
          .on("mouseenter", function () {
            site.ix.handlePanelHover(this);
          })
          .on("mouseleave", function () {
            site.ix.handlePanelLeave(this);
          });
      });
    },

    unbindEvents: function () {
      $.each([site.ui.leftPanel.el, site.ui.rightPanel.el], function () {
        $(this).unbind("mouseenter").unbind("mouseleave");
      });
    },

    setPositions: function () {
      site.ui.panels.css({
        "padding-top": site.sizes.headerHeight,
      });
    },
  };

  site.init();
});
