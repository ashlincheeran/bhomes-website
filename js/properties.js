/* ==========================================================================
   betterhomes — listings page logic
   --------------------------------------------------------------------------
   This script powers properties.html. It reads the shared property data,
   renders cards into the grid, and re-filters / re-sorts whenever the user
   changes one of the dropdowns.

   It relies only on the shared data API (loaded before this file):
     - window.PROPERTIES         the array of listings
     - window.renderPropertyCard(p) -> HTML string for one card
     - window.formatAED(n)       (available, though not needed directly here)

   Wrapped in an IIFE (Immediately Invoked Function Expression) so none of our
   variables leak into the global scope.
   ========================================================================== */
(function () {
  "use strict";

  // ----- Grab the elements we need from the page -----
  var grid = document.getElementById("grid");
  var resultCount = document.getElementById("resultCount");

  // The four filter selects + the sort select.
  var purposeSelect = document.getElementById("f-purpose");
  var communitySelect = document.getElementById("f-community");
  var typeSelect = document.getElementById("f-type");
  var bedsSelect = document.getElementById("f-beds");
  var sortSelect = document.getElementById("f-sort");

  /* ------------------------------------------------------------------
     filterProperties()
     Returns a NEW array containing only the listings that match every
     active filter. An empty filter value ("") means "Any", so it matches
     everything.
     ------------------------------------------------------------------ */
  function filterProperties() {
    var purpose = purposeSelect.value;     // "", "sale" or "rent"
    var community = communitySelect.value; // "" or a community name
    var type = typeSelect.value;           // "" or a property type
    var beds = bedsSelect.value;           // "", "studio", "1".."4"

    return window.PROPERTIES.filter(function (property) {
      // Purpose must match (unless "Any").
      if (purpose && property.purpose !== purpose) return false;

      // Community must match (unless "Any").
      if (community && property.community !== community) return false;

      // Property type must match (unless "Any").
      if (type && property.type !== type) return false;

      // Min beds: "studio" = exactly 0 beds; "4" means 4 or more; a plain
      // number means "at least that many".
      if (beds === "studio") {
        if (property.beds !== 0) return false;
      } else if (beds === "4") {
        if (property.beds < 4) return false;
      } else if (beds) {
        if (property.beds < Number(beds)) return false;
      }

      // Passed every check.
      return true;
    });
  }

  /* ------------------------------------------------------------------
     sortProperties(list)
     Sorts a COPY of the given list according to the sort dropdown.
     "newest" keeps the original data order (no sorting applied).
     ------------------------------------------------------------------ */
  function sortProperties(list) {
    var sort = sortSelect.value;
    var sorted = list.slice(); // copy so we never mutate the source array

    if (sort === "price-asc") {
      sorted.sort(function (a, b) { return a.price - b.price; });
    } else if (sort === "price-desc") {
      sorted.sort(function (a, b) { return b.price - a.price; });
    }
    // "newest" -> leave order untouched.

    return sorted;
  }

  /* ------------------------------------------------------------------
     render()
     The main update routine: filter, sort, build the HTML, drop it into
     the grid, and update the result count text.
     ------------------------------------------------------------------ */
  function render() {
    var results = sortProperties(filterProperties());

    // Build one big HTML string from all matching cards, then set it once.
    var html = results.map(function (property) {
      return window.renderPropertyCard(property);
    }).join("");

    grid.innerHTML = html;

    // Update the count, e.g. "9 properties" or "1 property".
    var label = results.length === 1 ? " property" : " properties";
    resultCount.textContent = results.length + label;
  }

  // ----- Wire up the controls: any change re-renders the list -----
  purposeSelect.addEventListener("change", render);
  communitySelect.addEventListener("change", render);
  typeSelect.addEventListener("change", render);
  bedsSelect.addEventListener("change", render);
  sortSelect.addEventListener("change", render);

  // ----- Initial paint when the page loads -----
  render();
})();
