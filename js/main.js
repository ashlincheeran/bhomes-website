/* ==========================================================================
   betterhomes — shared site behaviour
   --------------------------------------------------------------------------
   Handles the mobile nav toggle, the hero search tabs, and rendering the
   "featured properties" grid on the home page from window.PROPERTIES.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Mobile navigation toggle ---------------------------------------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  /* ---- Hero search tabs ------------------------------------------------- */
  var tabs = document.querySelectorAll(".search-bar .tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("is-active"); });
      tab.classList.add("is-active");
    });
  });

  /* ---- Render featured properties on the home page --------------------- */
  var grid = document.getElementById("featuredGrid");
  if (grid && Array.isArray(window.PROPERTIES)) {
    var featured = window.PROPERTIES.filter(function (p) { return p.featured; });
    grid.innerHTML = featured.map(renderCard).join("");
  }

  /* Build the HTML for a single property card. Shared shape with the
     listings page so the look stays consistent. */
  function renderCard(p) {
    var price = window.formatAED(p.price) + (p.purpose === "rent" ? "<small>/year</small>" : "");
    var bedsLabel = p.beds === 0 ? "Studio" : p.beds + " bed";
    var ribbon = p.featured ? '<span class="property-card__ribbon">Featured</span>' : "";
    return (
      '<article class="property-card">' +
        '<div class="property-card__media">' +
          ribbon +
          '<img src="' + p.image + '" alt="' + p.title + '" loading="lazy" />' +
        "</div>" +
        '<div class="property-card__body">' +
          '<div class="property-card__price">' + price + "</div>" +
          '<div class="property-card__title">' + p.title + "</div>" +
          '<div class="property-card__loc">📍 ' + p.community + "</div>" +
          '<div class="property-card__meta">' +
            "<span>" + bedsLabel + "</span>" +
            "<span>" + p.baths + " bath</span>" +
            "<span>" + p.area.toLocaleString() + " sqft</span>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  /* Expose for reuse on the listings page. */
  window.renderPropertyCard = renderCard;
})();
