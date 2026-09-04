/* ============================================================
   CheddarBaits — page logic
   ------------------------------------------------------------
   You should not need to edit this file. It reads colors.js and
   builds two things:

     initLurePage("senko")  — the dropdown + swapping image
     initColorsPage()       — the full color grid on colors.html
   ============================================================ */


/* ------------------------------------------------------------
   LURE PAGES
   ------------------------------------------------------------ */

function initLurePage(baitKey) {
  const select = document.getElementById("color-select");
  const viewer = document.getElementById("lure-viewer");
  const nameEl = document.getElementById("color-name");
  const blurbEl = document.getElementById("color-blurb");

  if (!select || !viewer) return;

  // Only the colors offered in this bait.
  const colors = CHEDDAR_COLORS.filter(function (c) {
    return c.baits && Object.prototype.hasOwnProperty.call(c.baits, baitKey);
  });

  if (colors.length === 0) {
    select.innerHTML = '<option>No colors listed yet</option>';
    select.disabled = true;
    return;
  }

  colors.forEach(function (color) {
    const option = document.createElement("option");
    option.value = color.id;
    option.textContent = color.name;
    select.appendChild(option);
  });

  function show(color) {
    viewer.innerHTML = "";

    const photo = color.baits[baitKey];
    const baitName = (CHEDDAR_BAITS[baitKey] && CHEDDAR_BAITS[baitKey].name) || "bait";

    if (photo) {
      const img = document.createElement("img");
      img.src = photo;
      img.alt = "CheddarBaits " + baitName + " in " + color.name;
      viewer.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "lure-photo-pending";
      placeholder.style.background = color.swatch;
      placeholder.innerHTML = '<span>Photo coming soon</span>';
      viewer.appendChild(placeholder);
    }

    if (nameEl) nameEl.textContent = color.name;
    if (blurbEl) blurbEl.textContent = color.blurb;
  }

  select.addEventListener("change", function () {
    const picked = colors.find(function (c) { return c.id === select.value; });
    if (picked) show(picked);
  });

  // Deep link support: senko.html#confetti-cake opens on that color.
  const fromHash = window.location.hash.replace("#", "");
  const start = colors.find(function (c) { return c.id === fromHash; }) || colors[0];
  select.value = start.id;
  show(start);
}


/* ------------------------------------------------------------
   COLORS PAGE
   ------------------------------------------------------------ */

function initColorsPage() {
  const grid = document.getElementById("color-grid");
  if (!grid) return;

  grid.innerHTML = "";

  CHEDDAR_COLORS.forEach(function (color) {
    const card = document.createElement("article");
    card.className = "color-card";
    card.id = color.id;

    const swatch = document.createElement("div");
    swatch.className = "color-swatch";
    swatch.style.background = color.swatch;
    card.appendChild(swatch);

    const info = document.createElement("div");
    info.className = "color-card-info";

    const heading = document.createElement("h3");
    heading.textContent = color.name;
    info.appendChild(heading);

    const blurb = document.createElement("p");
    blurb.textContent = color.blurb;
    info.appendChild(blurb);

    // Which baits this color is poured in, linked to their pages.
    const keys = Object.keys(color.baits || {}).filter(function (k) {
      return CHEDDAR_BAITS[k];
    });

    if (keys.length > 0) {
      const avail = document.createElement("p");
      avail.className = "lure-avail";
      avail.appendChild(document.createTextNode("Poured in: "));

      keys.forEach(function (key, i) {
        const link = document.createElement("a");
        link.href = CHEDDAR_BAITS[key].page + "#" + color.id;
        link.textContent = CHEDDAR_BAITS[key].name;
        avail.appendChild(link);
        if (i < keys.length - 1) {
          avail.appendChild(document.createTextNode(", "));
        }
      });

      info.appendChild(avail);
    }

    card.appendChild(info);
    grid.appendChild(card);
  });
}
