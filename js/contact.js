/* ============================================================
   betterhomes — Contact page form handler
   ------------------------------------------------------------
   Demo only: there is NO backend. On submit we just check that
   the required fields are filled, show a success message, and
   reset the form. Wrapped in an IIFE so we don't leak variables
   into the global scope.
   ============================================================ */
(function () {
  "use strict";

  // Grab the form and the hidden success banner.
  var form = document.getElementById("contactForm");
  var success = document.getElementById("formSuccess");

  // If either element is missing, there's nothing to wire up.
  if (!form || !success) {
    return;
  }

  // Listen for the form being submitted.
  form.addEventListener("submit", function (event) {
    // Stop the browser from doing a real page-reloading submit.
    event.preventDefault();

    // Basic validation: make sure every required field has a value.
    // form.checkValidity() uses the `required`/`type` attributes in the
    // HTML, so we don't have to check each field by hand.
    if (!form.checkValidity()) {
      // Let the browser show its built-in "please fill this in" hints.
      form.reportValidity();
      return;
    }

    // All good — reveal the success message (CSS .is-visible shows it).
    success.classList.add("is-visible");

    // Clear the fields so the form looks fresh after submitting.
    form.reset();
  });
})();
