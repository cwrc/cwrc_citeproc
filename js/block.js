(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.cwrcCiteprocJs = {
    attach: function (context, settings) {
      var module_settings = settings.cwrc_citeproc;
      var style = module_settings.style.data;
      var items = [];
      var citation_id = module_settings.object_id;
      var itemIds = [];
      var content = document.getElementById(module_settings.container_id);

      itemIds.push(citation_id);
      module_settings.item.id = citation_id;
      items[citation_id] = module_settings.item;

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

      // Given the identifier of a CSL style, this function instantiates a
      // CSL.Engine object that can render citations in that style.
      function getProcessor() {
        // Instantiate and return the engine.
        var citeproc = new CSL.Engine(citeprocSys, style);
        return citeproc;
      }

      // This runs at document ready, and renders the bibliography.
      function processorOutput() {
        var citeproc = getProcessor();
        citeproc.updateItems(itemIds);
        var bibResult = citeproc.makeBibliography();
        return bibResult[1].join('\n');
      }
      content.innerHTML = processorOutput();
    }
  };
})(jQuery, Drupal);
