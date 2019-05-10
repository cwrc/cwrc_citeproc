(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.cwrcCiteprocJsSolrResults = {
    attach: function (context, settings) {
      var module_settings = settings.cwrc_citeproc,
        items = module_settings.items,
        itemIds = module_settings.item_ids,
        style = module_settings.style.data,
        containers = document.getElementById(module_settings.container_id);

      // Initialize a system object, which contains two methods needed by the
      // engine.
      var citeprocSys = {
        // Given a language tag in RFC-4646 form, this method retrieves the
        // locale definition file.  This method must return a valid *serialized*
        // CSL locale. (In other words, an blob of XML as an unparsed string.  The
        // processor will fail on a native XML object or buffer).
        retrieveLocale: function () {
          return module_settings.locale_xml;
        },

        // Given an identifier, this retrieves one citation item.  This method
        // must return a valid CSL-JSON object.
        retrieveItem: function (id) {
          return items[id];
        }
      };

      // This runs at document ready, and renders the bibliography.
      function processorOutput() {
        // Given the identifier of a CSL style, we instantiates a CSL.Engine
        // object that can render citations in that style.
        var citeproc = new CSL.Engine(citeprocSys, style);
        citeproc.updateItems(itemIds);
        var bibResult = citeproc.makeBibliography();
        console.log(bibResult);
        return bibResult[1].join('\n');
      }

      // Add the output in the wrapper.
      content.innerHTML = processorOutput();
    }
  };
})(jQuery, Drupal);
