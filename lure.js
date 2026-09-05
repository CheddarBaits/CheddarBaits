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


/* ------------------------------------------------------------
   GALLERY PAGE
   ------------------------------------------------------------ */

function initGalleryPage() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  const photos = (typeof GALLERY_PHOTOS !== "undefined") ? GALLERY_PHOTOS : [];
  const minTiles = (typeof GALLERY_MIN_TILES !== "undefined") ? GALLERY_MIN_TILES : 0;
  const total = Math.max(photos.length, minTiles);

  grid.innerHTML = "";

  if (total === 0) {
    grid.innerHTML = '<p class="gallery-empty">Photos going up soon.</p>';
    return;
  }

  for (let i = 0; i < total; i++) {
    const photo = photos[i];

    if (!photo) {
      const pending = document.createElement("div");
      pending.className = "gallery-tile gallery-tile-pending";
      pending.innerHTML = "<span>Coming soon</span>";
      grid.appendChild(pending);
      continue;
    }

    const tile = document.createElement("button");
    tile.className = "gallery-tile";
    tile.type = "button";
    tile.setAttribute("aria-label", "Open photo: " + photo.caption);
    tile.dataset.index = i;

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption;
    img.loading = "lazy";
    tile.appendChild(img);

    tile.addEventListener("click", function () {
      openLightbox(Number(this.dataset.index));
    });

    grid.appendChild(tile);
  }

  buildLightbox(photos);
}


/* ------------------------------------------------------------
   Lightbox — click a photo to see it full size.
   ------------------------------------------------------------ */

let lightboxPhotos = [];
let lightboxIndex = 0;
let lightboxOpener = null;

function buildLightbox(photos) {
  lightboxPhotos = photos;

  if (document.getElementById("lightbox")) return;

  const box = document.createElement("div");
  box.id = "lightbox";
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.hidden = true;
  box.innerHTML =
    '<button class="lightbox-close" type="button" aria-label="Close">&times;</button>' +
    '<button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous photo">&#8249;</button>' +
    '<figure class="lightbox-figure">' +
      '<img id="lightbox-img" alt="">' +
      '<figcaption id="lightbox-caption"></figcaption>' +
    '</figure>' +
    '<button class="lightbox-nav lightbox-next" type="button" aria-label="Next photo">&#8250;</button>';

  document.body.appendChild(box);

  box.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  box.querySelector(".lightbox-prev").addEventListener("click", function () { stepLightbox(-1); });
  box.querySelector(".lightbox-next").addEventListener("click", function () { stepLightbox(1); });

  // Clicking the dark area closes it; clicking the photo doesn't.
  box.addEventListener("click", function (e) {
    if (e.target === box || e.target.classList.contains("lightbox-figure")) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
}

function openLightbox(index) {
  const box = document.getElementById("lightbox");
  if (!box) return;

  lightboxOpener = document.activeElement;
  lightboxIndex = index;
  renderLightbox();

  box.hidden = false;
  document.body.classList.add("lightbox-open");
  box.querySelector(".lightbox-close").focus();
}

function closeLightbox() {
  const box = document.getElementById("lightbox");
  if (!box) return;

  box.hidden = true;
  document.body.classList.remove("lightbox-open");
  if (lightboxOpener) lightboxOpener.focus();
}

function stepLightbox(direction) {
  if (lightboxPhotos.length === 0) return;
  lightboxIndex = (lightboxIndex + direction + lightboxPhotos.length) % lightboxPhotos.length;
  renderLightbox();
}

function renderLightbox() {
  const photo = lightboxPhotos[lightboxIndex];
  if (!photo) return;

  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");

  img.src = photo.src;
  img.alt = photo.caption;
  caption.textContent = photo.caption;
}
