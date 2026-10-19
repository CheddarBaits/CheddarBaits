/* ============================================================
   CheddarBaits — color data
   ------------------------------------------------------------
   THIS IS THE ONLY FILE YOU EDIT WHEN YOU POUR A NEW COLOR
   OR ADD A NEW BAIT. Every page reads from this file.
   ============================================================ */


/* ------------------------------------------------------------
   THE BAITS

   The key ("senko") is what gets used in the "baits" list on each
   color below. When you add a new bait to the lineup, add it here
   and make a page for it.

   "image" and "blurb" are only used by lures.html (the "See All
   Lures" grid). Set image to a real photo path once you have one —
   until then it shows a "Coming Soon" placeholder like the homepage
   cards do.

   "page": null means "not orderable yet, no page built" — it shows
   as a plain "Coming Soon" tile on lures.html/stingers.html with no
   link, and won't show up as a choice on the order form. Set it to
   a real filename once the page exists.

   "priceVariesByColor": true means this bait's price is NOT one
   flat number — it's set per color below instead (see "price" in
   THE COLORS section). Leave "price" as null on baits like this;
   lure.js and order.js both check each color's own price for these.
   ------------------------------------------------------------ */

const CHEDDAR_BAITS = {
  senko:      { name: '5" Senko',                 page: "senko.html",      price: 5.99, packSize: 8,
                image: "assets/cheddarbaits24.jpg",
                blurb: "The classic Senko everyone loves — customizable colors." },

  paddletail: { name: '3.5" Ripper Paddletail', page: "paddletail.html", price: 5.99, packSize: 6,
                image: "assets/cheddarbaits5.jpg",
                blurb: "Paddletails that are guaranteed to drive the bass nuts." },

  // ---- Stingers & Laminates family ---------------------------------
  // "Stingers & Laminates" on the homepage links to stingers.html,
  // a hub page listing these three. price is null here on purpose —
  // see priceVariesByColor above. packSize of 4 is a placeholder,
  // change it if your actual pack size is different.

  stinger:     { name: "Stinger",      page: "stinger.html",     price: 7.99, packSize: 8, priceVariesByColor: true,
                 image: "assets/cheddarbaits28.jpg",
                 blurb: "Two-tone stick baits with a focus point. Available in both 4\" and 5\"" },

  stingergrub: { name: "Stinger Grub", page: "stingergrub.html", price: 7.99, packSize: 40, priceVariesByColor: true,
                 image: "assets/cheddarbaits29.jpg",
                 blurb: "A small 5/8\" non-tailed crappie jig grub, poured half-and-half in two colors." },

  laminate:    { name: "Laminates",    page: null,               price: 9.99, packSize: null, priceVariesByColor: true,
                 image: null,
                 blurb: "Multi-layered laminate colors — coming soon." },

  grub:       { name: '5/8" Grub',                  page: "grub.html",       price: 5.99, packSize: 40,
                image: "assets/cheddarbaits38.jpg",
                blurb: "A classic curl-tail grub with heavy thump on the fall and the retrieve." },

  senko4:     { name: '4" Senko',                 page: "senko4.html",     price: 5.99, packSize: 10,
                image: "assets/cheddarbaits39.jpg",
                blurb: "A smaller version of our 5\" Senko, built for finesse presentations and lighter bites." },

  minnow:     { name: '3" Minnow Paddletail',                page: "minnow.html",     price: 5.99, packSize: 8,
                image: "assets/cheddarbaits34.jpg",
                blurb: "A slim baitfish profile that shines on a jighead or as a swimbait trailer." },

  creature:   { name: '4" Creature Bait',         page: "creature.html",   price: 6.99, packSize: 5,
                image: "assets/cheddarbaits43.jpg",
                blurb: "A ribbed creature bait built for high action and wobble." }
};

// Flat shipping (CAD) added to every Canadian order, regardless of size.
// Change this one number if your actual cost shifts — the homepage
// banner, the order form, and the emailed total all read from it.
// (U.S. orders are quoted separately and don't use this number.)
const SHIPPING_FLAT_RATE = 21.49;

// Canadian orders whose bait total (before shipping) reaches this amount
// ship free. Set to null to turn free shipping off entirely — the banner
// text, the order form, and the progress bar all hide themselves.
// Rule of thumb: threshold = shipping cost / your profit margin per dollar.
// E.g. $21.49 shipping at a 40% margin breaks even at about $54, so $100
// leaves room to spare at that margin.
const FREE_SHIPPING_THRESHOLD = 100.00;


/* ------------------------------------------------------------
   THE COLORS

   Each color looks like this:

     {
       id:     "monkey-milk",        // lowercase, no spaces. Used in links.
       name:   "Monkey Milk",        // what customers see
       blurb:  "Short description.", // one or two sentences
       swatch: "linear-gradient(150deg, #f2eee4, #d9d2c0)",
       price:  7.99,                 // OPTIONAL. Only needed for baits
                                      // marked priceVariesByColor above.
                                      // Omit it entirely for baits that
                                      // already have a flat price (Senko,
                                      // Paddletail) — it's ignored there.
       soldOut: true,                // OPTIONAL. Add this line when you run out
                                      // of the color. It disappears from the
                                      // order form, the bait pages, the colors
                                      // page and the color finder. Delete the
                                      // line (or set it to false) when it's
                                      // back in stock.
       baits:  {
         senko:      "assets/senko-monkey-milk.jpg",
         paddletail: null
       }
     }

   The "baits" object does two jobs at once:

     - If a bait is LISTED, the color shows up in that bait's dropdown
       and on the colors page. If a bait is NOT listed (the key is
       missing entirely), the color will not show up for that bait
       at all — that's how the stinger colors below stay off of
       Senko/Paddletail's dropdowns even though every color used to
       list all six baits.
     - The value is the photo path, or null if you haven't shot it yet.
       null shows a tinted "Photo coming soon" panel instead.

   So to add a photo later, you swap null for the file path. To stop
   offering a color in a bait, delete that line.

   PATHS ALWAYS USE FORWARD SLASHES (/), never backslashes (\).
   Windows shows you backslashes in File Explorer, but that's a
   Windows-only convention — browsers and JavaScript strings both
   want forward slashes, on every operating system.
   ------------------------------------------------------------ */

const CHEDDAR_COLORS = [

  {
    id: "monkey-milk",
    name: "Monkey Milk",
    blurb: "Milky pearl white with a heavy iridescent flash. Shines hard in sun.",
    swatch: "linear-gradient(150deg, #f2eee4, #d9d2c0)",
    image: "assets/cheddarbaits48.png",
    baits: {
      senko: "assets/cheddarbaits15.jpg",
      paddletail: "assets/cheddarbaits9.jpg",
      grub: null,
      senko4: null,
      minnow: null,
      creature: null
    }
  },

  {
    id: "confetti-cake",
    name: "Confetti Cake",
    blurb: "Opaque deep purple loaded with red, blue and purple flake.",
    swatch: "linear-gradient(150deg, #4a2d6b, #2a1540)",
    image: "assets/cheddarbaits20.jpg",
    baits: {
      senko: "assets/cheddarbaits20.jpg",
      paddletail: "assets/cheddarbaits14.jpg",
      grub: null,
      senko4: null,
      minnow: null,
      creature: null
    }
  },

  {
    id: "sparkle-&-shine",
    name: "Sparkle & Shine",
    blurb: "Similar to confetti cake mix, but in a semi-transparent deep blue.",
    swatch: "linear-gradient(150deg, #2f6fa8, #14375c)",
    baits: {
      senko: "assets/cheddarbaits18.jpg",
      paddletail: null,
      grub: null,
      senko4: null,
      minnow: null,
      creature: null
    }
  },

  {
    id: "pearlescent-baby-blue",
    name: "Pearlescent Baby Blue",
    blurb: "Baby Blue with a subtle shimmer that is sure to catch the fish's eye!",
    swatch: "linear-gradient(150deg, #2f6fa8, #14375c)",
    image: "assets/cheddarbaits11.jpg",
    baits: {
      senko: "assets/cheddarbaits3.jpg",
      paddletail: "assets/cheddarbaits11.jpg",
      grub: null,
      senko4: null,
      minnow: null,
      creature: null
    }
  },

  {
    id: "bubblegum",
    name: "Bubblegum",
    blurb: "Soft opaque pink with black flake through it.",
    swatch: "linear-gradient(150deg, #f2a0c0, #d1668f)",
    image: "assets/cheddarbaits7.jpg",
    baits: {
      senko: "assets/cheddarbaits16.jpg",
      paddletail: "assets/cheddarbaits7.jpg",
      grub: null,
      senko4: null,
      minnow: null,
      creature: null
    }
  },

  {
    id: "chartreuse-pepper",
    name: "Chartreuse Pepper",
    blurb: "Bright chartreuse with fine black pepper flake.",
    swatch: "linear-gradient(150deg, #c8e04a, #8fae1c)",
    image: "assets/cheddarbaits21.jpg",
    baits: {
      senko: "assets/cheddarbaits21.jpg",
      paddletail: null,
      grub: null,
      senko4: null,
      minnow: null,
      creature: null
    }
  },

  {
    id: "blue-smoke",
    name: "Blue Smoke",
    blurb: "Smoky blue base with purple and blue flake. Photo coming soon!",
    swatch: "linear-gradient(150deg, #6d86a8, #38506e)",
    baits: {
      senko: null,
      paddletail: null,
      grub: null,
      senko4: null,
      minnow: null,
      creature: null
    }
  },

  {
    id: "pumpkingreen",
    name: "PumpkinGreen",
    blurb: "Natural green pumpkin body enhanced with black flake. The classic colour for bass fishermen",
    swatch: "linear-gradient(150deg, #0d6301, #084100)",
    image: "assets/cheddarbaits23.jpg",
    baits: {
      senko: "assets/cheddarbaits23.jpg",
      paddletail: "assets/cheddarbaits13.jpg",
      grub: null,
      senko4: null,
      minnow: null,
      creature: null
    }
  },

  {
    id: "junebug",
    name: "Junebug",
    blurb: "A flashy violet with strong green flake that works great in muddy waters.",
    swatch: "linear-gradient(150deg, #640468, #400242)",
    image: "assets/cheddarbaits22.jpg",
    baits: {
      senko: "assets/cheddarbaits22.jpg",
      paddletail: "assets/cheddarbaits6.jpg",
      grub: null,
      senko4: null,
      minnow: null,
      creature: null
    }
  },

  {
    id: "watermelon-red",
    name: "Watermelon Red",
    blurb: "Natural green pumpkin body lifted with chartreuse and red flake. Quiet, confident, a timeless classic.",
    swatch: "linear-gradient(150deg, #7a8a3c, #46521c)",
    image: "assets/cheddarbaits12.jpg",
    baits: {
      senko: "assets/cheddarbaits17.jpg",
      paddletail: "assets/cheddarbaits12.jpg",
      grub: null,
      senko4: null,
      minnow: null,
      creature: null
    }
  },

  {
    id: "midnight-twinkle",
    name: "Midnight Twinkle",
    blurb: "A flashy black with blue flake, works great in muddy waters for it's awesome silhouettes!",
    swatch: "linear-gradient(150deg, #05000a, #1707fd)",
    image: "assets/cheddarbaits33.jpg",
    baits: {
      senko: null,
      paddletail: "assets/cheddarbaits10.jpg",
      grub: null,
      senko4: null,
      minnow: null,
      creature: null
    }
  },

  {
    id: "cheddar-gold-pearl",
    name: "Cheddar Gold Pearl",
    blurb: "Our signature Cheddar Gold Pearl recipe, made with ultra-fine mica powders for the ultimate golden sheen.",
    swatch: "linear-gradient(150deg, #ecd500, #e4e00a)",
    image: "assets/cheddarbaits31.jpg",
    baits: {
      senko: "assets/cheddarbaits31.jpg",
      paddletail: null,
      grub: "assets/cheddarbaits37.jpg",
      senko4: null,
      minnow: null,
      creature: null
    }
  },

  {
    id: "smurf-blue",
    name: "Smurf Blue",
    blurb: "Our signature Smurf Blue recipe, made with ultra-fine mica powders for a shiny presentation.",
    swatch: "linear-gradient(150deg, #ecd500, #e4e00a)",
    image: "assets/cheddarbaits34.jpg",
    baits: {
      senko: null,
      paddletail: null,
      grub: "assets/cheddarbaits40.jpg",
      senko4: null,
      minnow: null,
      creature: null
    }
  },

  {
    id: "dirty-grape-soda",
    name: "Dirty Grape Soda",
    blurb: "A Brown-Purple color shift. Great for casting silhouettes, or in bright conditions.",
    swatch: "linear-gradient(150deg, #ecd500, #e4e00a)",
    image: "assets/cheddarbaits40.jpg",
    baits: {
      senko: "assets/cheddarbaits30.jpg",
      paddletail: "assets/cheddarbaits32.jpg",
      grub: "assets/cheddarbaits38.jpg",
      senko4: null,
      minnow: "assets/cheddarbaits34.jpg",
      creature: "assets/cheddarbaits43.jpg"
    }
  },

  /* ----------------------------------------------------------
     STINGERS & STINGER GRUBS
     Two-tone colors — half of one color, half of another — so
     the swatch below is a hard 90-degree split instead of the
     smooth blend used on the single-color baits above. Priced
     per color since some splits take longer to pour than others.
     Only list "stinger" / "stingergrub" in "baits" — leaving the
     other bait keys off entirely keeps these off Senko/Paddletail's
     dropdowns, since they were never poured on those shapes.
     ---------------------------------------------------------- */

  {
    id: "lemon-drop-smurf-blue",
    name: "Lemon Drop & Smurf Blue",
    blurb: "Our custom lemon drop recipe against a smurf blue — a sharp two-tone split that introduces both silhouette, and .",
    swatch: "linear-gradient(90deg, #cfe83a 50%, #1e9be0 50%)",
    image: "assets/cheddarbaits45.jpg",
    price: 7.99,
    baits: {
      stinger: "assets/cheddarbaits45.jpg",
      stingergrub: "assets/cheddarbaits29.jpg"
    }
  },

  {
    id: "lemon-drop-confetti-cake",
    name: "Lemon Drop & Confetti Cake",
    blurb: "Our custom lemon drop recipe split against the deep purple confetti cake flake mix. a shiny two tone, made for clear water.",
    swatch: "linear-gradient(90deg, #cfe83a 50%, #4a2d6b 50%)",
    image: "assets/cheddarbaits47.jpg",
    price: 7.99,
    baits: {
      stinger: "assets/cheddarbaits47.jpg",
    }
  },

  {
  id: "lemon-drop-night-sky",
  name: "Lemon Drop & Night Sky",
  blurb: "Our custom lemon drop recipe split against our midnight twinkle. Great for silhouettes in versatile water conditions.",
  swatch: "linear-gradient(150deg, #0b0e2a, #1e3a5f)",
  image: "assets/cheddarbaits46.jpg",
  price: 7.99,
  baits: {
    stinger: "assets/cheddarbaits46.jpg"
  }
 },

  {
    // Suggested name — swap this and the "name" line below if you'd
    // rather call it something else. Alternates: "Mud Pie Shift",
    // "Dirty Grape Soda".
    id: "dirty-grape-soda-lemon-drop",
    name: "Dirty Grape Soda & Lemon Drop",
    blurb: "A brown-purple color shift split against Our custom lemon drop recipe. a sharp two-tone split for strong silhouettes in stained water",
    swatch: "linear-gradient(150deg, #6b4423, #4a2d6b)",
    price: 7.99,
    baits: {
      stinger: null
    }
  }

];


/* ------------------------------------------------------------
   Colors that are in stock. Every page uses THIS list for what
   customers can see and pick, so a color marked soldOut: true
   above disappears everywhere at once. Don't edit this part.
   ------------------------------------------------------------ */

const AVAILABLE_COLORS = CHEDDAR_COLORS.filter(function (c) { return !c.soldOut; });
