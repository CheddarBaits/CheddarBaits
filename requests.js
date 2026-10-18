/* ============================================================
   CheddarBaits — color request board
   ------------------------------------------------------------
   HOW THE MONTHLY ROUNDS WORK

   Every calendar month is its own round. The page works out the
   current month by itself, so there's nothing to switch on or off:
   requests stay open until the last day of the month, then you pick
   ONE request to pour.

   WHAT YOU EDIT HERE, once a month:

   1. SHORTLIST  — the ideas you're considering for this round.
      Leave it empty ( [] ) if you're not showing a shortlist.

   2. PAST_PICKS — add the color you picked at the end of the round,
      newest at the TOP. Once it's poured, you can also add it to
      colors.js as a normal color.

   Each request that comes in lands in your email (through Formspree),
   tagged with its round, e.g. "Request round: 2026-10".
   ------------------------------------------------------------ */

const COLOR_SHORTLIST = [
  // { name: "Root Beer Float", blurb: "Translucent amber with a pearl swirl.", swatch: "#8b5a2b" },
];

const PAST_PICKS = [
  // { month: "October 2026", name: "Root Beer Float", blurb: "Translucent amber with a pearl swirl.", swatch: "#8b5a2b", requestedBy: "Kim D" },
];


/* ------------------------------------------------------------
   Everything below runs the page. You shouldn't need to edit it.
   ------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", function () {
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
                  "August", "September", "October", "November", "December"];

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();                           // 0-11
  const lastDay = new Date(year, month + 1, 0).getDate(); // last day of this month
  const roundName = MONTHS[month] + " " + year;
  const roundKey = year + "-" + String(month + 1).padStart(2, "0");

  function setText(id, text) {
    const node = document.getElementById(id);
    if (node) node.textContent = text;
  }

  setText("round-name", roundName);
  setText("round-closes", "Requests for this round close " + MONTHS[month] + " " + lastDay + ".");

  // ----- hidden fields so each email says which round it belongs to
  const roundField = document.getElementById("round-field");
  if (roundField) roundField.value = roundKey;
  const subjectField = document.getElementById("subject-field");
  if (subjectField) subjectField.value = "CheddarBaits color request (" + roundName + ")";

  // ----- bait checkboxes, built from colors.js so new baits show up automatically
  const baitBox = document.getElementById("bait-options");
  if (baitBox && typeof CHEDDAR_BAITS !== "undefined") {
    Object.keys(CHEDDAR_BAITS).forEach(function (key) {
      const bait = CHEDDAR_BAITS[key];
      if (!bait.page) return;
      const label = document.createElement("label");
      label.className = "request-bait";
      const box = document.createElement("input");
      box.type = "checkbox";
      box.name = "Baits wanted";
      box.value = bait.name;
      label.appendChild(box);
      label.appendChild(document.createTextNode(" " + bait.name));
      baitBox.appendChild(label);
    });
  }

  // ----- shortlist + past picks
  function pickCard(item, showMonth) {
    const card = document.createElement("article");
    card.className = "request-pick";

    const swatch = document.createElement("div");
    swatch.className = "request-pick-swatch";
    swatch.style.background = item.swatch || "#444";
    card.appendChild(swatch);

    const body = document.createElement("div");
    if (showMonth && item.month) {
      const m = document.createElement("p");
      m.className = "request-pick-month";
      m.textContent = item.month;
      body.appendChild(m);
    }
    const h = document.createElement("h4");
    h.textContent = item.name;
    body.appendChild(h);
    if (item.blurb) {
      const p = document.createElement("p");
      p.textContent = item.blurb;
      body.appendChild(p);
    }
    if (item.requestedBy) {
      const by = document.createElement("p");
      by.className = "request-pick-by";
      by.textContent = "Requested by " + item.requestedBy;
      body.appendChild(by);
    }
    card.appendChild(body);
    return card;
  }

  const shortlistGrid = document.getElementById("shortlist-grid");
  const shortlistWrap = document.getElementById("shortlist-wrap");
  if (shortlistGrid && shortlistWrap) {
    if (COLOR_SHORTLIST.length === 0) {
      shortlistWrap.hidden = true;
    } else {
      COLOR_SHORTLIST.forEach(function (item) { shortlistGrid.appendChild(pickCard(item, false)); });
    }
  }

  const pastGrid = document.getElementById("past-grid");
  if (pastGrid) {
    if (PAST_PICKS.length === 0) {
      const p = document.createElement("p");
      p.className = "request-empty";
      p.textContent = "No picks yet. The first one is announced when this round closes.";
      pastGrid.appendChild(p);
    } else {
      PAST_PICKS.forEach(function (item) { pastGrid.appendChild(pickCard(item, true)); });
    }
  }

  // ----- swatch preview text next to the color input
  const swatchInput = document.getElementById("request-swatch");
  const swatchText = document.getElementById("request-swatch-text");
  if (swatchInput && swatchText) {
    swatchInput.addEventListener("input", function () { swatchText.textContent = swatchInput.value; });
  }

  // ----- submit without leaving the page
  const form = document.getElementById("request-form");
  const success = document.getElementById("request-success");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Sending...";

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    })
      .then(function (response) {
        if (response.ok) {
          form.hidden = true;
          success.hidden = false;
        } else {
          throw new Error("Form submission failed");
        }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = "Send Request";
        alert("Something went wrong sending your request. Please try again, or email cheddarbaits@gmail.com directly.");
      });
  });
});
