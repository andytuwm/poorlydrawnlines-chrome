

    Polymer('core-layout-trbl', {

      vertical: false,

      ready: function() {
        this.setAttribute('nolayout', '');
      },

      attached: function() {
        this.asyncMethod(function() {
          this.prepare();
          this.layout();
        });
      },

      prepare: function() {
        var parent = this.parentNode.host || this.parentNode;
        // explicit position harmful on <body>
        if (parent.localName !== 'body') {
        // may recalc
          var cs = window.getComputedStyle(parent);
          if (cs.position === 'static') {
            parent.style.position = 'relative';
          }
          //parent.style.overflow = 'hidden';
        }
        // changes will cause another recalc at next validation step
        var stylize = this.stylize, vertical;
        this.parentNode.childNodes.array().forEach(function(c, i) {
          if (c.nodeType === Node.ELEMENT_NODE && !c.hasAttribute('nolayout')) {
            stylize(c, {
              position: 'absolute',
              boxSizing: 'border-box',
              MozBoxSizing: 'border-box',
            });
            // test for auto-vertical
            if (vertical === undefined) {
              vertical = (c.offsetWidth == 0 && c.offsetHeight !== 0);
            }
          }
        });
        this.vertical = this.vertical || vertical;
      },

      /**
       * Arrange sibling nodes end-to-end in one dimension.
       *
       * Arrangement is horizontal unless the `vertical`
       * attribute is applied on this node.
       *
       * @method layout
       */
      layout: function() {
        var parent = this.parentNode.host || this.parentNode;
        var vertical = this.vertical;
        var ww = 0, hh = 0, pre = [], fit, post = [];
        var list = pre;
        // gather element information (at most one recalc)
        this.parentNode.childNodes.array().forEach(function(c, i) {
          if (c.nodeType===Node.ELEMENT_NODE && !c.hasAttribute('nolayout')) {
            var info = {
              element: c,
              w: c.offsetWidth,
              h: c.offsetHeight
            };
            if (!c.hasAttribute('fit') && !c.hasAttribute('flex')) {
              ww += c.offsetWidth;
              hh += c.offsetHeight;
              list.push(info);
            } else {
              fit = c;
              list = post;
              ww = hh = 0;
            }
          }
        });
        // update layout styles (invalidate, no recalc)
        var v = 0;
        var mxp = 0, myp = 0;
        var stylize = this.stylize;
        pre.forEach(function(info) {
          if (vertical) {
            stylize(info.element, {
              top: v + 'px', right: mxp, height: info.h + 'px', left: mxp
            });
          } else {
            stylize(info.element, {
              top: myp, width: info.w + 'px', bottom: myp, left: v + 'px'
            });
          }
          v += vertical ? info.h : info.w;
        });
        if (fit) {
          if (vertical) {
            stylize(fit, {
              top: v + 'px', right: mxp, bottom: hh + 'px', left: mxp
            });
          } else {
            stylize(fit, {
              top: myp, right: ww + 'px', bottom: myp, left: v + 'px'
            });
          }
          v = vertical ? hh : ww;
          post.forEach(function(info) {
            v -= vertical ? info.h : info.w;
            if (vertical) {
              stylize(info.element, {
                height: info.h + 'px', right: mxp, bottom: v + 'px', left: mxp
              });
            } else {
              stylize(info.element, {
                top: myp, right: v + 'px', bottom: myp, width: info.w + 'px'
              });
            }
          });
        }
      },

      stylize: function(element, styles) {
        var style = element.style;
        Object.keys(styles).forEach(function(k){
          style[k] = styles[k];
        });
      }

  });

  