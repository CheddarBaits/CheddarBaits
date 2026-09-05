/* ============================================================
   CheddarBaits — order form logic
   ------------------------------------------------------------
   You should not need to edit this file. It:
     - lets the customer add/remove multiple bait+color+quantity
       lines in one order
     - fills each line's color dropdown based on which bait it has
     - pre-fills the first line's bait if the page was opened as
       order.html?bait=senko
     - adds up every line, plus flat shipping, into one total
     - submits the form to Formspree without leaving the page,
       and swaps in a "thanks" message on success
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const itemsContainer = document.getElementById("order-items");
  const addItemBtn = document.getElementById("add-item-btn");
  const destinationSelect = document.getElementById("destination");
  const usNote = document.getElementById("us-shipping-note");
  const totalValueEl = document.getElementById("order-total-value");
  const totalFieldEl = document.getElementById("total-field");
  const form = document.getElementById("order-form");
  const successBox = document.getElementById("order-success");

  if (!itemsContainer || !addItemBtn || !form) return;

  // Maps the dropdown's display text back to the colors.js bait key.
  const BAIT_KEY_BY_LABEL = {};
  Object.keys(CHEDDAR_BAITS).forEach(function (key) {
    BAIT_KEY_BY_LABEL[CHEDDAR_BAITS[key].name] = key;
  });

  let itemCount = 0;

  function populateColorsFor(colorSelect, baitKey) {
    colorSelect.innerHTML = "";

    const colors = CHEDDAR_COLORS.filter(function (c) {
      return c.baits && Object.prototype.hasOwnProperty.call(c.baits, baitKey);
    });

    if (colors.length === 0) {
      const opt = document.createElement("option");
      opt.textContent = "No colors listed for this bait yet";
      colorSelect.appendChild(opt);
      colorSelect.disabled = true;
      return;
    }

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose a color";
    colorSelect.appendChild(placeholder);

    colors.forEach(function (color) {
      const opt = document.createElement("option");
      opt.value = color.name;
      opt.textContent = color.name;
      colorSelect.appendChild(opt);
    });

    colorSelect.disabled = false;
  }

  function addItem(presetBaitKey) {
    itemCount++;
    const n = itemCount;

    const row = document.createElement("div");
    row.className = "order-item";
    row.dataset.itemId = n;

    row.innerHTML =
      '<div class="order-item-heading">' +
        '<span>Bait ' + n + '</span>' +
        '<button type="button" class="order-item-remove" aria-label="Remove this bait">Remove</button>' +
      '</div>' +
      '<div class="order-field">' +
        '<label>Which bait?</label>' +
        '<select class="item-bait" required></select>' +
      '</div>' +
      '<div class="order-field">' +
        '<label>Which color?</label>' +
        '<select class="item-color" required disabled>' +
          '<option value="">Choose a bait first</option>' +
        '</select>' +
      '</div>' +
      '<div class="order-field order-field-narrow">' +
        '<label class="item-qty-label">How many packs?</label>' +
        '<input type="number" class="item-quantity" min="1" value="1" required>' +
        '<p class="item-qty-note"></p>' +
      '</div>';

    itemsContainer.appendChild(row);

    const baitSelect = row.querySelector(".item-bait");
    const colorSelect = row.querySelector(".item-color");
    const quantityInput = row.querySelector(".item-quantity");
    const qtyLabel = row.querySelector(".item-qty-label");
    const qtyNote = row.querySelector(".item-qty-note");
    const removeBtn = row.querySelector(".order-item-remove");

    // Names go through the DOM directly rather than an HTML string,
    // since bait names contain a literal " (5" Senko) that would
    // otherwise break out of an attribute value.
    baitSelect.name = "Item " + n + " - Bait";
    colorSelect.name = "Item " + n + " - Color";
    quantityInput.name = "Item " + n + " - Quantity";

    const placeholderOpt = document.createElement("option");
    placeholderOpt.value = "";
    placeholderOpt.textContent = "Choose a bait";
    baitSelect.appendChild(placeholderOpt);

    Object.keys(CHEDDAR_BAITS).forEach(function (key) {
      const opt = document.createElement("option");
      opt.value = CHEDDAR_BAITS[key].name;
      opt.dataset.key = key;
      opt.textContent = CHEDDAR_BAITS[key].name;
      baitSelect.appendChild(opt);
    });

    function updatePackNote() {
      const key = BAIT_KEY_BY_LABEL[baitSelect.value];
      const bait = key && CHEDDAR_BAITS[key];

      if (!bait || !bait.packSize) {
        qtyLabel.textContent = "How many?";
        qtyNote.textContent = "";
        return;
      }

      qtyLabel.textContent = "How many packs of " + bait.packSize + "?";
      const qty = Math.max(1, parseInt(quantityInput.value, 10) || 1);
      const baitCount = qty * bait.packSize;
      qtyNote.textContent = qty + " pack" + (qty > 1 ? "s" : "") +
        " = " + baitCount + " " + bait.name.replace(/^\d+(\.\d+)?"\s*/, "").toLowerCase() + (baitCount > 1 ? "s" : "");
    }

    baitSelect.addEventListener("change", function () {
      const key = BAIT_KEY_BY_LABEL[baitSelect.value];
      if (key) {
        populateColorsFor(colorSelect, key);
      } else {
        colorSelect.innerHTML = '<option value="">Choose a bait first</option>';
        colorSelect.disabled = true;
      }
      updatePackNote();
      updateTotal();
    });

    colorSelect.addEventListener("change", updateTotal);
    quantityInput.addEventListener("input", function () {
      updatePackNote();
      updateTotal();
    });

    removeBtn.addEventListener("click", function () {
      // Always leave at least one item line on the form.
      if (itemsContainer.children.length <= 1) return;
      row.remove();
      renumberItems();
      updateTotal();
    });

    if (presetBaitKey && CHEDDAR_BAITS[presetBaitKey]) {
      baitSelect.value = CHEDDAR_BAITS[presetBaitKey].name;
      populateColorsFor(colorSelect, presetBaitKey);
      updatePackNote();
    }

    updateRemoveButtons();
  }

  function renumberItems() {
    Array.prototype.forEach.call(itemsContainer.children, function (row, i) {
      const label = row.querySelector(".order-item-heading span");
      if (label) label.textContent = "Bait " + (i + 1);
    });
  }

  function updateRemoveButtons() {
    const onlyOne = itemsContainer.children.length <= 1;
    Array.prototype.forEach.call(itemsContainer.querySelectorAll(".order-item-remove"), function (btn) {
      btn.hidden = onlyOne;
    });
  }

  addItemBtn.addEventListener("click", function () { addItem(); });

  function updateTotal() {
    if (!totalValueEl) return;

    const isUS = destinationSelect && destinationSelect.value === "United States";
    if (usNote) usNote.hidden = !isUS;

    let itemsTotal = 0;
    let anyChosen = false;
    let anyTBD = false;
    let lineParts = [];

    Array.prototype.forEach.call(itemsContainer.children, function (row) {
      const baitSelect = row.querySelector(".item-bait");
      const quantityInput = row.querySelector(".item-quantity");
      const key = BAIT_KEY_BY_LABEL[baitSelect.value];
      const bait = key && CHEDDAR_BAITS[key];

      if (!bait) return;
      anyChosen = true;

      const qty = Math.max(1, parseInt(quantityInput.value, 10) || 1);

      if (bait.price == null) {
        anyTBD = true;
        lineParts.push(qty + " pack" + (qty > 1 ? "s" : "") + " of " + bait.name + " (TBD)");
        return;
      }

      const lineTotal = bait.price * qty;
      itemsTotal += lineTotal;
      lineParts.push(qty + " pack" + (qty > 1 ? "s" : "") + " of " + bait.name + " ($" + lineTotal.toFixed(2) + ")");
    });

    if (!anyChosen) {
      totalValueEl.textContent = "Choose a bait";
      if (totalFieldEl) totalFieldEl.value = "";
      return;
    }

    if (isUS) {
      const suffix = anyTBD ? " + some prices TBD" : "";
      const formatted = "$" + itemsTotal.toFixed(2) + suffix + " + shipping (TBD)";
      totalValueEl.textContent = formatted;
      if (totalFieldEl) totalFieldEl.value = formatted + " \u2014 " + lineParts.join(", ");
      return;
    }

    if (anyTBD) {
      const formatted = "$" + itemsTotal.toFixed(2) + " + some prices TBD + $" + SHIPPING_FLAT_RATE.toFixed(2) + " shipping";
      totalValueEl.textContent = formatted;
      if (totalFieldEl) totalFieldEl.value = formatted + " \u2014 " + lineParts.join(", ");
      return;
    }

    const grandTotal = itemsTotal + SHIPPING_FLAT_RATE;
    const formatted = "$" + grandTotal.toFixed(2) + " (incl. $" + SHIPPING_FLAT_RATE.toFixed(2) + " shipping)";
    totalValueEl.textContent = formatted;
    if (totalFieldEl) totalFieldEl.value = formatted + " \u2014 " + lineParts.join(", ");
  }

  if (destinationSelect) {
    destinationSelect.addEventListener("change", updateTotal);
  }

  // Pre-select a bait on the first line if the link included ?bait=senko
  const params = new URLSearchParams(window.location.search);
  const preselect = params.get("bait");
  addItem(preselect && CHEDDAR_BAITS[preselect] ? preselect : null);

  updateTotal();

  // Submit without leaving the page.
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    })
      .then(function (response) {
        if (response.ok) {
          form.hidden = true;
          successBox.hidden = false;
        } else {
          throw new Error("Form submission failed");
        }
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Order";
        alert("Something went wrong sending your order. Please try again, or email cheddarbaits@gmail.com directly.");
      });
  });
});
