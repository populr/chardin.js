// Generated by CoffeeScript 1.3.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window) {
    var chardinJs;
    chardinJs = (function() {

      chardinJs.name = 'chardinJs';

      chardinJs.prototype.settings = {
        opacity: 0.8,
        disableZIndex: false,
        closeBoxMessage: 'Got it!',
        closeBoxCorner: 'SE'
      };

      function chardinJs(el, options) {
        this._call_function_on_chardin_elements = __bind(this._call_function_on_chardin_elements, this);

        this._show_element = __bind(this._show_element, this);

        this._position_helper_layer = __bind(this._position_helper_layer, this);

        var _this = this;
        this.settings = $.extend(this.settings, options);
        this.$el = $(el);
        $(window).resize(function() {
          return _this.refresh();
        });
      }

      chardinJs.prototype.start = function() {
        if (this._overlay_visible()) {
          return false;
        }
        this._add_overlay_layer();
        this._call_function_on_chardin_elements(this._show_element);
        return this.$el.trigger('chardinJs:start');
      };

      chardinJs.prototype.toggle = function() {
        if (!this._overlay_visible()) {
          return this.start();
        } else {
          return this.stop();
        }
      };

      chardinJs.prototype.refresh = function() {
        if (this._overlay_visible()) {
          return this._call_function_on_chardin_elements(this._position_helper_layer);
        } else {
          return this;
        }
      };

      chardinJs.prototype.stop = function() {
        this.$el.find(".chardinjs-overlay").fadeOut(function() {
          return $(this).remove();
        });
        this.$el.find('.chardinjs-helper-layer').remove();
        this.$el.find('.chardinjs-show-element').removeClass('chardinjs-show-element');
        this.$el.find('.chardinjs-relative-position').removeClass('chardinjs-relative-position');
        if (window.removeEventListener) {
          window.removeEventListener("keydown", this._onKeyDown, true);
        } else {
          if (document.detachEvent) {
            document.detachEvent("onkeydown", this._onKeyDown);
          }
        }
        return this.$el.trigger('chardinJs:stop');
      };

      chardinJs.prototype._overlay_visible = function() {
        return this.$el.find('.chardinjs-overlay').length !== 0;
      };

      chardinJs.prototype._add_overlay_layer = function() {
        var element_position, overlay_layer, styleText,
          _this = this;
        if (this._overlay_visible()) {
          return false;
        }
        overlay_layer = document.createElement("div");
        if (this.settings.closeBoxMessage) {
          overlay_layer.appendChild($("<div class=\"chardinjs-closebox chardinjs-closebox-" + (this.settings.closeBoxCorner.toLowerCase()) + "\">" + this.settings.closeBoxMessage + "</div>")[0]);
        }
        styleText = "";
        overlay_layer.className = "chardinjs-overlay";
        if (this.$el.prop('tagName') === "BODY") {
          styleText += "top: 0;bottom: 0; left: 0;right: 0;position: fixed;";
          overlay_layer.setAttribute("style", styleText);
        } else {
          element_position = this._get_offset(this.$el.get()[0]);
          if (element_position) {
            styleText += "width: " + element_position.width + "px; height:" + element_position.height + "px; top:" + element_position.top + "px;left: " + element_position.left + "px;";
            overlay_layer.setAttribute("style", styleText);
          }
        }
        this.$el.get()[0].appendChild(overlay_layer);
        overlay_layer.onclick = function() {
          return _this.stop();
        };
        return setTimeout(function() {
          styleText += "opacity: " + _this.settings.opacity + ";opacity: " + _this.settings.opacity + ";-ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (Math.round(100 * _this.settings.opacity)) + ")';filter: alpha(opacity=" + (Math.round(100 * _this.settings.opacity)) + ");";
          return overlay_layer.setAttribute("style", styleText);
        }, 10);
      };

      chardinJs.prototype._get_position = function(element) {
        return element.getAttribute('data-position') || 'bottom';
      };

      chardinJs.prototype._place_tooltip = function(element) {
        var my_height, my_width, target_element_position, target_height, target_width, tooltip_layer, tooltip_layer_position;
        tooltip_layer = $(element).data('tooltip_layer');
        tooltip_layer_position = this._get_offset(tooltip_layer);
        tooltip_layer.style.top = null;
        tooltip_layer.style.right = null;
        tooltip_layer.style.bottom = null;
        tooltip_layer.style.left = null;
        switch (this._get_position(element)) {
          case "top":
          case "bottom":
            target_element_position = this._get_offset(element);
            target_width = target_element_position.width;
            my_width = $(tooltip_layer).width();
            tooltip_layer.style.left = "" + ((target_width / 2) - (tooltip_layer_position.width / 2)) + "px";
            break;
          case "left":
          case "right":
            target_element_position = this._get_offset(element);
            target_height = target_element_position.height;
            my_height = $(tooltip_layer).height();
            tooltip_layer.style.top = "" + ((target_height / 2) - (tooltip_layer_position.height / 2)) + "px";
        }
        switch (this._get_position(element)) {
          case "left":
            return tooltip_layer.style.left = "-" + (tooltip_layer_position.width - 34) + "px";
          case "right":
            return tooltip_layer.style.right = "-" + (tooltip_layer_position.width - 34) + "px";
          case "bottom":
            return tooltip_layer.style.bottom = "-" + tooltip_layer_position.height + "px";
          case "top":
            return tooltip_layer.style.top = "-" + tooltip_layer_position.height + "px";
        }
      };

      chardinJs.prototype._position_helper_layer = function(element, yOffset) {
        var element_position, helper_layer;
        if (yOffset == null) {
          yOffset = 0;
        }
        helper_layer = $(element).data('helper_layer');
        element_position = this._get_offset(element, yOffset);
        return helper_layer.setAttribute("style", "width: " + element_position.width + "px; height:" + element_position.height + "px; top:" + element_position.top + "px; left: " + element_position.left + "px;");
      };

      chardinJs.prototype._show_element = function(element, yOffset) {
        var current_element_position, element_position, helper_layer, tooltip_layer;
        if (yOffset == null) {
          yOffset = 0;
        }
        element_position = this._get_offset(element, yOffset);
        helper_layer = document.createElement("div");
        tooltip_layer = document.createElement("div");
        $(element).data('helper_layer', helper_layer).data('tooltip_layer', tooltip_layer);
        if (element.id) {
          helper_layer.setAttribute("data-id", element.id);
        }
        helper_layer.className = "chardinjs-helper-layer chardinjs-" + (this._get_position(element));
        this._position_helper_layer(element, yOffset);
        this.$el.get()[0].appendChild(helper_layer);
        tooltip_layer.className = "chardinjs-tooltip chardinjs-" + (this._get_position(element));
        tooltip_layer.innerHTML = "<div class='chardinjs-tooltiptext'>" + (element.getAttribute('data-intro')) + "</div>";
        helper_layer.appendChild(tooltip_layer);
        this._place_tooltip(element);
        if (!this.settings.disableZIndex) {
          element.className += " chardinjs-show-element";
        }
        current_element_position = "";
        if (element.currentStyle) {
          current_element_position = element.currentStyle["position"];
        } else {
          if (document.defaultView && document.defaultView.getComputedStyle) {
            current_element_position = document.defaultView.getComputedStyle(element, null).getPropertyValue("position");
          }
        }
        current_element_position = current_element_position.toLowerCase();
        if (current_element_position !== "absolute" && current_element_position !== "relative") {
          return element.className += " chardinjs-relative-position";
        }
      };

      chardinJs.prototype._get_offset = function(element, yOffset) {
        var element_position, _x, _y;
        if (yOffset == null) {
          yOffset = 0;
        }
        element_position = {
          width: element.offsetWidth,
          height: element.offsetHeight
        };
        _x = 0;
        _y = 0;
        while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
          _x += element.offsetLeft;
          _y += element.offsetTop;
          element = element.offsetParent;
        }
        element_position.top = _y + yOffset;
        element_position.left = _x;
        return element_position;
      };

      chardinJs.prototype._call_function_on_chardin_elements = function(fn) {
        var el, iframe, _i, _j, _len, _len1, _ref, _ref1, _results;
        _ref = this.$el.find('*[data-intro]');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          if ($(el).is(':visible')) {
            fn(el);
          }
        }
        _ref1 = this.$el.find('iframe');
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          iframe = _ref1[_j];
          _results.push((function() {
            var _k, _len2, _ref2, _results1;
            _ref2 = $(iframe.contentWindow.document || iframe.contentDocument).find('*[data-intro]');
            _results1 = [];
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
              el = _ref2[_k];
              if ($(el).is(':visible')) {
                _results1.push(fn(el, $(iframe).offset().top));
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          })());
        }
        return _results;
      };

      return chardinJs;

    })();
    return $.fn.extend({
      chardinJs: function(command, options) {
        var $this, data;
        if (options == null) {
          options = {};
        }
        $this = $(this[0]);
        data = $this.data('chardinJs');
        if (!data) {
          $this.data('chardinJs', (data = new chardinJs(this, options)));
        }
        if (typeof command === 'string') {
          data[command].apply(data);
        }
        return data;
      }
    });
  })(window.jQuery, window);

}).call(this);
