do ($ = window.jQuery, window) ->
  # Define the plugin class
  class chardinJs

    settings:
      opacity: 0.8
      disableZIndex: false
      closeBoxMessage: 'Got it!'
      closeBoxCorner: 'SE'
      iframeSelector: null


    constructor: (el, options) ->
      @settings = $.extend(@settings, options)
      @$el = $(el).first()
      $(window).resize => @refresh()


    start: ->
      return false if @_overlay_visible()
      @_add_overlay_layer()
      @_call_function_on_chardin_elements(@_show_element)

      if @settings.closeBoxMessage
        close_box = $("""<div class="chardinjs-closebox chardinjs-closebox-#{@settings.closeBoxCorner.toLowerCase()}">#{@settings.closeBoxMessage}</div>""")
        close_box.click => @stop()
        @$el.append(close_box)

      @$el.trigger 'chardinJs:start'


    toggle: ->
      if @_overlay_visible()
        @stop()
      else
        @start()


    refresh: ->
      if @_overlay_visible()
        @_call_function_on_chardin_elements(@_position_helper_layer)
      else
        return this


    stop: ->
      @$el.find('.chardinjs-overlay').fadeOut -> $(this).remove()

      @$el.find('.chardinjs-helper-layer').remove()
      @$el.find('.chardinjs-closebox').remove()

      @$el.find('.chardinjs-show-element').removeClass('chardinjs-show-element')
      @$el.find('.chardinjs-relative-position').removeClass('chardinjs-relative-position')

      if window.removeEventListener
        window.removeEventListener 'keydown', @_onKeyDown, true
      #IE
      else document.detachEvent 'onkeydown', @_onKeyDown  if document.detachEvent

      @$el.trigger('chardinJs:stop')


    _overlay_visible: ->
      @$el.find('.chardinjs-overlay').length


    _add_overlay_layer: ->
      return false if @_overlay_visible()
      overlay_layer = $('<div class="chardinjs-overlay" />')

      #check if the target element is body, we should calculate the size of overlay layer in a better way
      if @$el.is('body')
        overlay_layer
          .css('top', 0)
          .css('bottom', 0)
          .css('left', 0)
          .css('right', 0)
          .css('position', 'fixed')
      else
        element_position = @_get_offset(@$el)
        overlay_layer
          .width(element_position.width)
          .height(element_position.height)
          .css('top', "#{element_position.top}px")
          .css('left', "#{element_position.left}px")
      @$el.append(overlay_layer)

      overlay_layer.click => @stop()

      setTimeout =>
        percentage_opacity = Math.round(100 * @settings.opacity)
        overlay_layer
          .css('opacity', @settings.opacity)
          .css('-ms-filter', "progid:DXImageTransform.Microsoft.Alpha(Opacity=#{percentage_opacity})")
          .css('filter', "alpha(opacity=#{percentage_opacity})")
      , 10


    _get_position: (element) -> element.attr('data-position') or 'bottom'


    _place_tooltip: (element) ->
      tooltip_layer = element.data('tooltip_layer')
      tooltip_layer_position = @_get_offset(tooltip_layer)

      #reset the old style
      tooltip_layer.css('top', '')
      tooltip_layer.css('right', '')
      tooltip_layer.css('bottom', '')
      tooltip_layer.css('left', '')

      switch @_get_position(element)
        when 'top', 'bottom'
          target_element_position  = @_get_offset(element)
          target_width             = target_element_position.width
          my_width                 = tooltip_layer.width()
          tooltip_layer.css('left', "#{(target_width / 2) - (tooltip_layer_position.width / 2)}px")
        when 'left', 'right'
          target_element_position = @_get_offset(element)
          target_height           = target_element_position.height
          my_height               = tooltip_layer.height()
          tooltip_layer.css('top', "#{(target_height / 2) - (tooltip_layer_position.height / 2)}px")

      switch @_get_position(element)
        when 'left'
          tooltip_layer.css('left', "-#{tooltip_layer_position.width - 34}px")
        when 'right'
          tooltip_layer.css('right', "-#{tooltip_layer_position.width - 34}px")
        when 'bottom'
          tooltip_layer.css('bottom', "-#{tooltip_layer_position.height}px")
        when 'top'
          tooltip_layer.css('top', "-#{tooltip_layer_position.height}px")


    _position_helper_layer: (element, yOffset=0) =>
      helper_layer = element.data('helper_layer')
      element_position = @_get_offset(element, yOffset)
      helper_layer
        .width(element_position.width)
        .height(element_position.height)
        .css('top', "#{element_position.top}px")
        .css('left', "#{element_position.left}px")


    _show_element: (element, yOffset=0) =>
      element_position = @_get_offset(element, yOffset)

      tooltip_layer    = $("""<div class="chardinjs-tooltip chardinjs-#{@_get_position(element)}"><div class="chardinjs-tooltiptext">#{element.attr('data-intro')}</div></div>""")

      helper_layer     = $("""<div class="chardinjs-helper-layer chardinjs-#{@_get_position(element)}" />""")
      helper_layer.data('id', element.id) if element.id
      helper_layer.append(tooltip_layer)

      element
        .data('helper_layer', helper_layer)
        .data('tooltip_layer',tooltip_layer)

      @_position_helper_layer(element, yOffset)

      @$el.append(helper_layer)

      @_place_tooltip(element)

      element.addClass('chardinjs-show-element') unless @settings.disableZIndex

      current_element_position = element.css('position').toLowerCase()

      element.addClass('chardinjs-relative-position') if current_element_position isnt 'absolute' and current_element_position isnt 'relative'


    _get_offset: (element, yOffset=0) ->
      {
        left: element.offset().left
        top: element.offset().top + yOffset
        width: element.outerWidth()
        height: element.outerHeight()
      }


    _call_function_on_chardin_elements: (fn) =>
      for el in @$el.find('*[data-intro]')
        fn($(el)) if $(el).is(':visible')

      if @settings.iframeSelector
        for iframe in @$el.find(@settings.iframeSelector)
          for el in $(iframe.contentWindow.document || iframe.contentDocument).find('*[data-intro]')
            fn($(el), $(iframe).offset().top) if $(el).is(':visible')


  $.fn.extend chardinJs: (command, options={}) ->
    $this = $(this[0])
    data = $this.data('chardinJs')
    if !data
      $this.data 'chardinJs', (data = new chardinJs(this, options))
    if typeof command == 'string'
      data[command].apply(data)
    data
