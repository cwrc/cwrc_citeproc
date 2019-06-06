(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.cwrcCiteprocJsSolrResults = {
    attach: function (context, settings) {
      var module_settings = settings.cwrc_citeproc,
        items = module_settings.items,
        itemIds = module_settings.item_ids,
        style = module_settings.style.data;

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
          return items[id].raw;
        }
      };

      /**
       * Helper to merge the citations and ids.
       *
       * @param ids
       * @param citations
       */
      function mergeIdsCitation(ids, citations) {
        var result = {};
        for (var i = 0; i < ids.length; i++) {
          result[ids[i]] = citations[i];
        }

        return result;
      }

      /**
       * This runs at document ready, and renders the bibliography.
       */
      function processorOutput() {
        // Given the identifier of a CSL style, we instantiates a CSL.Engine
        // object that can render citations in that style.
        var citeproc = new CSL.Engine(citeprocSys, style);
        citeproc.updateItems(itemIds);
        var bibResult = citeproc.makeBibliography();
        if (bibResult.length) {
          var item_ids = JSON.parse(JSON.stringify(bibResult[0].entry_ids));
          item_ids = [].concat.apply([], item_ids);
          var citations = mergeIdsCitation(item_ids, bibResult[1]);

          for (var object_id in citations) {
            // Skip loop if the property is from prototype.
            if (!citations.hasOwnProperty(object_id)) {
              continue;
            }

            // Replacing the default link text with the citation.
            if (items.hasOwnProperty(object_id)) {
              var item_wrapper = document.getElementById(items[object_id].id);
              item_wrapper.innerHTML = citations[object_id];
            }
          }
        }
      }

      // Process the output.
      processorOutput();
    }
  };
})(jQuery, Drupal);
