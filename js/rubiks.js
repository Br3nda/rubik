/**
 * Implementation of Drupal behavior.
 */
Drupal.behaviors.rubiks = function(context) {
  Drupal.rubiksToggle.attach(context);
};

Drupal.rubiksToggle = {
  /**
   * Stack of modifiers to retain between pages.
   */
  'modifiers': [],

  /**
   * Add a modifier to the stack, or remove it if it exists.
   */
  'toggleModifier': function(modifier) {
    for (var i in this.modifiers) {
      if (this.modifiers[i] == modifier) {
        delete this.modifiers[i];
        return true;
      }
    }
    this.modifiers.push(modifier);
    return true;
  },

  /**
   * Initialize and attach handlers.
   */
  'attach': function(context) {
    var args = Drupal.rubiksToggle.parseHash(window.location.hash.substring(1));
    $('a.toggler:not(.rubiks-processed)', context).each(function() {
      var toggleable, params;

      // Parse the hash string.
      params = Drupal.rubiksToggle.parseHash($(this).attr('href').split('#')[1]);

      for (var key in params) {
        toggleable = $('#' + key);
        // Target toggleable exist.
        if (toggleable.size() > 0) {
          // Set init state.
          if (args[key] == 1) {
            toggleable.show();
            $(this).addClass('toggler-active');
            Drupal.rubiksToggle.toggleModifier(key + '=' + params[key]);
          }
          else {
            toggleable.hide();
            $(this).removeClass('toggler-active');
          }
          // Add click handler.
          $(this).click(function() {
            toggleable.toggle();
            $(this).toggleClass('toggler-active');
            Drupal.rubiksToggle.toggleModifier(key + '=' + params[key]);
            return false;
          });
        }
        // Target toggleable doesn't exist.
        else {
          $(this).addClass('toggler-disabled');
          $(this).click(function() { return false; });
        }
      }

      // Mark as processed.
      $(this).addClass('rubiks-processed');
      return false;
    });
    $('a:not(.rubiks-processed)', context).each(function() {
      if ($(this).attr('href')) {
        // Rewrite this link's hash string when clicked.
        $(this).click(function() {
          var href = $(this).attr('href').split('#');
          var modifiers = Drupal.rubiksToggle.modifiers.join('&');
          if (modifiers) {
            href[1] = href[1] ? href[1] + '&' + modifiers : modifiers;
            $(this).attr('href', href.join('#'));
          }
        });
        // Mark as processed.
        $(this).addClass('rubiks-processed');
      }
    });
  },

  /**
   * Parse a hash string.
   */
  'parseHash': function(hash) {
    var parameters = {};
    var pairs = hash.split(/[&;]/);
    for(var i=0, len=pairs.length; i<len; ++i) {
      var keyValue = pairs[i].split('=');
      if (keyValue[0]) {
        var key = decodeURIComponent(keyValue[0]);
        var value = keyValue[1] || ''; //empty string if no value
        //decode individual values
        value = value.split(",");
        for(var j=0, jlen=value.length; j<jlen; j++) {
          value[j] = decodeURIComponent(value[j]);
        }
        //if there's only one value, do not return as array
        if (value.length == 1) {
          value = value[0];
        }
        parameters[key] = value;
      }
    }
    return parameters;
  }
};
