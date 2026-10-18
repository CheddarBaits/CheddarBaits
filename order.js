/* ============================================================
   CheddarBaits — order form logic
   ------------------------------------------------------------
   You should not need to edit this file. It:
     - lets the customer add/remove multiple bait+color+quantity
       lines in one order
     - fills each line's color dropdown based on which bait it has,
       with each color's own price shown when it has one (Stingers,
       Stinger Grubs)
     - pre-fills the first line's bait if the page was opened as
       order.html?bait=senko
     - adds up every line, plus flat shipping (SHIPPING_FLAT_RATE in
       colors.js), into one total, with an items/shipping breakdown —
       using the bait's flat price if it has one, or the selected
       color's own price otherwise
     - shows each bait's and color's description under its dropdown
       (straight from colors.js)
     - "Build a Kit": pick a bait, set packs for many colors at once, and
       it creates the order lines for you (shown as compact one-line
       summaries you can expand with Edit)
     - submits the form to Formspree without leaving the page,
       and swaps in a "thanks" message on success
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const itemsContainer = document.getElementById("order-items");
  const addItemBtn = document.getElementById("add-item-btn");
  const destinationSelect = document.getElementById("destination");
  const usNote = document.getElementById("us-shipping-note");
  const caNote = document.getElementById("ca-shipping-note");
  const breakdownEl = document.getElementById("order-breakdown");
  const progressEl = document.getElementById("ship-progress");
  const progressTextEl = document.getElementById("ship-progress-text");
  const progressFillEl = document.getElementById("ship-progress-fill");

  // The "color" a customer picks when they want us to choose for them.
  // Colors are drawn at random when the order is poured, so the customer
  // is never promised (or shown) any specific color.
  const MYSTERY_VALUE = "Mystery Mix (random assortment)";
  const MYSTERY_NOTE =
    "Mystery Mix is a random assortment of colors from what we currently have in stock. " +
    "You can't choose the colors, and we can't guarantee or swap specific ones. " +
    "Want a specific color? Pick it from the list instead.";
  const mysteryAckWrap = document.getElementById("mystery-ack-wrap");
  const mysteryAck = document.getElementById("mystery-ack");
  const MYSTERY_LABEL = "Mystery Mix \u2014 random assortment, we pick";

  // Free-shipping threshold from colors.js (null = switched off).
  const FREE_AT = (typeof FREE_SHIPPING_THRESHOLD === "number") ? FREE_SHIPPING_THRESHOLD : null;
  const totalValueEl = document.getElementById("order-total-value");
  const totalFieldEl = document.getElementById("total-field");
  const form = document.getElementById("order-form");
  const successBox = document.getElementById("order-success");

  if (!itemsContainer || !addItemBtn || !form) return;

  const kitBtn = document.getElementById("kit-btn");
  const kitPanel = document.getElementById("kit-panel");
  const kitBait = document.getElementById("kit-bait");
  const kitColors = document.getElementById("kit-colors");
  const kitSummary = document.getElementById("kit-summary");
  const kitAdd = document.getElementById("kit-add");
  const kitCancel = document.getElementById("kit-cancel");
  const kitOneEach = document.getElementById("kit-one-each");
  const kitClear = document.getElementById("kit-clear");

  // Maps the dropdown's display text back to the colors.js bait key.
  const BAIT_KEY_BY_LABEL = {};
  Object.keys(CHEDDAR_BAITS).forEach(function (key) {
    BAIT_KEY_BY_LABEL[CHEDDAR_BAITS[key].name] = key;
  });

  let itemCount = 0;

  // Some baits (Senko, Paddletail) have one flat price. Others
  // (Stingers, Stinger Grubs) price per color instead — bait.price
  // is null for those, so this looks up the selected color's own
  // price. Returns null if there's genuinely no price yet either way.
  function priceForSelection(bait, key, colorName) {
    if (bait.price != null) return bait.price;

    const color = CHEDDAR_COLORS.find(function (c) {
      return c.name === colorName && c.baits && Object.prototype.hasOwnProperty.call(c.baits, key);
    });

    return (color && color.price != null) ? color.price : null;
  }

  function populateColorsFor(colorSelect, baitKey) {
    colorSelect.innerHTML = "";

    const colors = AVAILABLE_COLORS.filter(function (c) {
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

    const mystery = document.createElement("option");
    mystery.value = MYSTERY_VALUE;
    mystery.textContent = MYSTERY_LABEL;
    colorSelect.appendChild(mystery);

    colors.forEach(function (color) {
      const opt = document.createElement("option");
      opt.value = color.name;
      // Shows " — $7.99" after the name for colors with their own
      // price (Stingers, Stinger Grubs). Colors with no "price" field
      // render exactly as before — just the name.
      opt.textContent = color.name + (color.price != null ? " — $" + color.price.toFixed(2) : "");
      colorSelect.appendChild(opt);
    });

    colorSelect.disabled = false;
  }

  function addItem(presetBaitKey, presetColor, presetQty, collapsed) {
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
      '<div class="order-item-summary">' +
        '<span class="order-item-summary-text"></span>' +
        '<button type="button" class="order-item-edit">Edit</button>' +
      '</div>' +
      '<div class="order-field">' +
        '<label>Which bait?</label>' +
        '<select class="item-bait" required></select>' +
        '<p class="item-bait-desc" hidden></p>' +
      '</div>' +
      '<div class="order-field">' +
        '<label>Which color?</label>' +
        '<select class="item-color" required disabled>' +
          '<option value="">Choose a bait first</option>' +
        '</select>' +
        '<p class="item-color-note" hidden></p>' +
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
      const bait = CHEDDAR_BAITS[key];
      // Skip baits with no page yet (e.g. Laminates) — nothing to
      // order until there's a real color list for them.
      if (!bait.page) return;

      const opt = document.createElement("option");
      opt.value = bait.name;
      opt.dataset.key = key;
      opt.textContent = bait.name;
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

    row.querySelector(".order-item-edit").addEventListener("click", function () {
      row.classList.remove("order-item-collapsed");
    });

    if (presetBaitKey && CHEDDAR_BAITS[presetBaitKey]) {
      baitSelect.value = CHEDDAR_BAITS[presetBaitKey].name;
      populateColorsFor(colorSelect, presetBaitKey);
      if (presetColor) colorSelect.value = presetColor;
      if (presetQty) quantityInput.value = presetQty;
      updatePackNote();
    }

    // Lines made by the kit builder start as a compact one-line summary.
    if (collapsed) row.classList.add("order-item-collapsed");

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

  // Keeps every order line's extra text in sync:
  //   - the bait's description under the bait dropdown
  //   - the color's description (or the Mystery Mix explanation) under
  //     the color dropdown
  //   - the one-line summary used by kit-builder lines
  // and shows a required "I understand" checkbox while any line is a
  // Mystery Mix.
  function updateMysteryUI() {
    let any = false;
    Array.prototype.forEach.call(itemsContainer.children, function (row) {
      const baitSelect = row.querySelector(".item-bait");
      const colorSelect = row.querySelector(".item-color");
      const qtyInput = row.querySelector(".item-quantity");
      const baitDesc = row.querySelector(".item-bait-desc");
      const note = row.querySelector(".item-color-note");
      const summary = row.querySelector(".order-item-summary-text");

      const key = BAIT_KEY_BY_LABEL[baitSelect.value];
      const bait = key && CHEDDAR_BAITS[key];
      const isMystery = colorSelect && colorSelect.value === MYSTERY_VALUE;
      if (isMystery) any = true;

      if (baitDesc) {
        let text = "";
        if (bait) {
          const facts = [];
          if (bait.packSize) facts.push(bait.packSize + " per pack");
          if (bait.price != null) facts.push("$" + bait.price.toFixed(2) + " per pack");
          text = (bait.blurb || "") + (facts.length ? " (" + facts.join(", ") + ")" : "");
        }
        baitDesc.textContent = text;
        baitDesc.hidden = !text;
      }

      if (note) {
        let text = "";
        if (isMystery) {
          text = MYSTERY_NOTE;
        } else if (colorSelect && colorSelect.value) {
          const color = CHEDDAR_COLORS.find(function (c) { return c.name === colorSelect.value; });
          text = color && color.blurb ? color.blurb : "";
        }
        note.textContent = text;
        note.hidden = !text;
      }

      if (summary) {
        const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
        summary.textContent = (bait ? bait.name : "No bait chosen") + " \u2014 " +
          (colorSelect && colorSelect.value ? colorSelect.value : "no color yet") +
          " \u00d7 " + qty + " pack" + (qty > 1 ? "s" : "");
      }
    });
    if (mysteryAckWrap) mysteryAckWrap.hidden = !any;
    if (mysteryAck) {
      mysteryAck.required = any;
      if (!any) mysteryAck.checked = false;
    }
  }

  // Free-shipping progress bar. Pass null to hide it.
  function renderProgress(itemsTotal) {
    if (!progressEl) return;
    if (FREE_AT === null || itemsTotal === null) {
      progressEl.hidden = true;
      return;
    }
    const have = Math.round(itemsTotal * 100);
    const need = Math.round(FREE_AT * 100);
    const pct = Math.min(100, Math.round((have / need) * 100));

    progressTextEl.textContent = have >= need
      ? "You've unlocked free shipping!"
      : "Add $" + ((need - have) / 100).toFixed(2) + " more in baits for free shipping (orders over $" +
        (Number.isInteger(FREE_AT) ? FREE_AT : FREE_AT.toFixed(2)) + ").";
    progressFillEl.style.width = pct + "%";
    progressEl.classList.toggle("ship-progress-done", have >= need);
    progressEl.hidden = false;
  }

  // Draws the small "Items / Shipping" lines above the total.
  // rows is a list of [label, value] pairs; pass null to hide it.
  function renderBreakdown(rows) {
    if (!breakdownEl) return;
    breakdownEl.innerHTML = "";
    if (!rows) {
      breakdownEl.hidden = true;
      return;
    }
    rows.forEach(function (pair) {
      const row = document.createElement("div");
      row.className = "order-breakdown-row";
      const label = document.createElement("span");
      label.textContent = pair[0];
      const value = document.createElement("span");
      value.textContent = pair[1];
      row.appendChild(label);
      row.appendChild(value);
      breakdownEl.appendChild(row);
    });
    breakdownEl.hidden = false;
  }

  function updateTotal() {
    if (!totalValueEl) return;
    updateMysteryUI();

    const isUS = destinationSelect && destinationSelect.value === "United States";
    if (usNote) usNote.hidden = !isUS;
    if (caNote) caNote.hidden = isUS;

    let itemsTotal = 0;
    let anyChosen = false;
    let anyTBD = false;
    let lineParts = [];

    Array.prototype.forEach.call(itemsContainer.children, function (row) {
      const baitSelect = row.querySelector(".item-bait");
      const colorSelect = row.querySelector(".item-color");
      const quantityInput = row.querySelector(".item-quantity");
      const key = BAIT_KEY_BY_LABEL[baitSelect.value];
      const bait = key && CHEDDAR_BAITS[key];

      if (!bait) return;
      anyChosen = true;

      const qty = Math.max(1, parseInt(quantityInput.value, 10) || 1);
      const price = priceForSelection(bait, key, colorSelect ? colorSelect.value : "");

      if (price == null) {
        anyTBD = true;
        lineParts.push(qty + " pack" + (qty > 1 ? "s" : "") + " of " + bait.name + " (TBD)");
        return;
      }

      const lineTotal = price * qty;
      itemsTotal += lineTotal;
      lineParts.push(qty + " pack" + (qty > 1 ? "s" : "") + " of " + bait.name + " ($" + lineTotal.toFixed(2) + ")");
    });

    if (!anyChosen) {
      totalValueEl.textContent = "Choose a bait";
      renderBreakdown(null);
      renderProgress(null);
      if (totalFieldEl) totalFieldEl.value = "";
      return;
    }

    if (isUS) {
      renderProgress(null);
      const suffix = anyTBD ? " + some prices TBD" : "";
      const formatted = "$" + itemsTotal.toFixed(2) + suffix + " + shipping (TBD)";
      renderBreakdown([
        ["Items", "$" + itemsTotal.toFixed(2) + suffix],
        ["Shipping (U.S.)", "confirmed with you, charged at the end"]
      ]);
      totalValueEl.textContent = formatted;
      if (totalFieldEl) totalFieldEl.value = formatted + " \u2014 " + lineParts.join(", ");
      return;
    }

    // Canada: flat rate, or free once the bait total reaches the threshold.
    // Compared in whole cents so 74.99999 style float noise can't cheat it.
    const freeShip = FREE_AT !== null && Math.round(itemsTotal * 100) >= Math.round(FREE_AT * 100);
    const shipCost = freeShip ? 0 : SHIPPING_FLAT_RATE;
    const shipRowLabel = freeShip ? "Shipping (free over $" + FREE_AT + ")" : "Shipping (Canada flat rate)";
    const shipRowValue = freeShip ? "FREE" : "$" + SHIPPING_FLAT_RATE.toFixed(2);
    renderProgress(itemsTotal);

    if (anyTBD) {
      const shipText = freeShip ? "free shipping" : "$" + SHIPPING_FLAT_RATE.toFixed(2) + " CAD shipping";
      const formatted = "$" + itemsTotal.toFixed(2) + " + some prices TBD + " + shipText;
      renderBreakdown([
        ["Items", "$" + itemsTotal.toFixed(2) + " + some prices TBD"],
        [shipRowLabel, shipRowValue]
      ]);
      totalValueEl.textContent = formatted;
      if (totalFieldEl) totalFieldEl.value = formatted + " \u2014 " + lineParts.join(", ");
      return;
    }

    const grandTotal = itemsTotal + shipCost;
    const formatted = freeShip
      ? "$" + grandTotal.toFixed(2) + " CAD (free shipping)"
      : "$" + grandTotal.toFixed(2) + " CAD (incl. $" + SHIPPING_FLAT_RATE.toFixed(2) + " shipping)";
    renderBreakdown([
      ["Items", "$" + itemsTotal.toFixed(2)],
      [shipRowLabel, shipRowValue]
    ]);
    totalValueEl.textContent = formatted;
    if (totalFieldEl) totalFieldEl.value = formatted + " \u2014 " + lineParts.join(", ");
  }

  if (destinationSelect) {
    destinationSelect.addEventListener("change", updateTotal);
  }

  // ------------------------------------------------------------
  // BUILD A KIT
  // ------------------------------------------------------------
  // Pick a bait, set packs for any number of colors, press Add. Each
  // color with at least one pack becomes a normal order line, so the
  // total, free-shipping bar, Mystery Mix checkbox and the emailed
  // order all work exactly as they do for lines added by hand.
  function kitInputs() {
    return Array.prototype.slice.call(kitColors.querySelectorAll(".kit-qty"));
  }

  function updateKitSummary() {
    const key = kitBait.value;
    const bait = key && CHEDDAR_BAITS[key];
    let packs = 0;
    let cost = 0;
    let unpriced = false;

    kitInputs().forEach(function (input) {
      const q = Math.max(0, parseInt(input.value, 10) || 0);
      if (!q) return;
      packs += q;
      const price = priceForSelection(bait, key, input.dataset.color);
      if (price == null) unpriced = true; else cost += price * q;
    });

    kitAdd.disabled = packs === 0;
    if (!bait) { kitSummary.textContent = ""; return; }
    if (packs === 0) { kitSummary.textContent = "Choose how many packs of each color."; return; }
    const baits = bait.packSize ? " (" + (packs * bait.packSize) + " baits)" : "";
    kitSummary.textContent = "Kit: " + packs + " pack" + (packs > 1 ? "s" : "") + baits + " \u2014 $" +
      cost.toFixed(2) + (unpriced ? " + some prices TBD" : "") + " before shipping.";
  }

  function buildKitRows(key) {
    kitColors.innerHTML = "";
    const bait = CHEDDAR_BAITS[key];
    kitOneEach.hidden = kitClear.hidden = !bait;
    if (!bait) { updateKitSummary(); return; }

    const colors = AVAILABLE_COLORS.filter(function (c) {
      return c.baits && Object.prototype.hasOwnProperty.call(c.baits, key);
    });
    if (colors.length === 0) {
      const p = document.createElement("p");
      p.className = "kit-empty";
      p.textContent = "No colors listed for this bait yet.";
      kitColors.appendChild(p);
      kitOneEach.hidden = kitClear.hidden = true;
      updateKitSummary();
      return;
    }

    // Mystery Mix goes first so a kit can include random packs too.
    const entries = [{ name: MYSTERY_VALUE, label: MYSTERY_LABEL, mystery: true }].concat(
      colors.map(function (c) { return { name: c.name, label: c.name, color: c }; })
    );

    entries.forEach(function (entry) {
      const row = document.createElement("label");
      row.className = "kit-row";

      const thumb = document.createElement("span");
      thumb.className = "kit-thumb";
      if (entry.mystery) {
        thumb.textContent = "?";
      } else {
        const img = entry.color.baits[key];
        if (img) {
          const el = document.createElement("img");
          el.src = img;
          el.alt = "";
          el.loading = "lazy";
          thumb.appendChild(el);
        } else {
          thumb.style.background = entry.color.swatch;
        }
      }
      row.appendChild(thumb);

      const name = document.createElement("span");
      name.className = "kit-name";
      name.textContent = entry.label;
      row.appendChild(name);

      const input = document.createElement("input");
      input.type = "number";
      input.className = "kit-qty";
      input.min = "0";
      input.value = "0";
      input.dataset.color = entry.name;
      input.setAttribute("aria-label", "Packs of " + entry.label);
      input.addEventListener("input", updateKitSummary);
      row.appendChild(input);

      kitColors.appendChild(row);
    });
    updateKitSummary();
  }

  if (kitBtn && kitPanel && kitBait) {
    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "Choose a bait";
    kitBait.appendChild(ph);
    Object.keys(CHEDDAR_BAITS).forEach(function (key) {
      if (!CHEDDAR_BAITS[key].page) return;
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = CHEDDAR_BAITS[key].name;
      kitBait.appendChild(opt);
    });

    kitBtn.addEventListener("click", function () {
      kitPanel.hidden = !kitPanel.hidden;
      if (!kitPanel.hidden) kitPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    kitCancel.addEventListener("click", function () { kitPanel.hidden = true; });
    kitBait.addEventListener("change", function () { buildKitRows(kitBait.value); });

    // "1 pack of each" fills every real color with 1 (not the Mystery row).
    kitOneEach.addEventListener("click", function () {
      kitInputs().forEach(function (input) {
        input.value = input.dataset.color === MYSTERY_VALUE ? "0" : "1";
      });
      updateKitSummary();
    });
    kitClear.addEventListener("click", function () {
      kitInputs().forEach(function (input) { input.value = "0"; });
      updateKitSummary();
    });

    kitAdd.addEventListener("click", function () {
      const key = kitBait.value;
      if (!key || !CHEDDAR_BAITS[key]) return;

      const picks = [];
      kitInputs().forEach(function (input) {
        const q = Math.max(0, parseInt(input.value, 10) || 0);
        if (q > 0) picks.push({ name: input.dataset.color, qty: q });
      });
      if (picks.length === 0) return;

      // If the only line on the form is still empty, the kit replaces it.
      if (itemsContainer.children.length === 1 && !itemsContainer.querySelector(".item-bait").value) {
        itemsContainer.innerHTML = "";
      }

      picks.forEach(function (p) { addItem(key, p.name, p.qty, true); });
      renumberItems();
      updateRemoveButtons();
      updateTotal();

      // Reset and close the panel; the new lines are now in the order.
      kitBait.value = "";
      buildKitRows("");
      kitPanel.hidden = true;
      itemsContainer.lastElementChild.scrollIntoView({ behavior: "smooth", block: "center" });
    });
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
