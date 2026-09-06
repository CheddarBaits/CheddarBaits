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
   ------------------------------------------------------------ */

const CHEDDAR_BAITS = {
  senko:      { name: '5" Senko',                 page: "senko.html",      price: 5.99, packSize: 8 },
  paddletail: { name: '3.5" Paddletail Swimbait', page: "paddletail.html", price: 5.99, packSize: 6 }
};

// Flat shipping added to every order, regardless of size or destination
// within Canada. Change this one number if your actual cost shifts.
const SHIPPING_FLAT_RATE = 6.00;


/* ------------------------------------------------------------
   THE COLORS

   Each color looks like this:

     {
       id:     "monkey-milk",        // lowercase, no spaces. Used in links.
       name:   "Monkey Milk",        // what customers see
       blurb:  "Short description.", // one or two sentences
       swatch: "linear-gradient(150deg, #f2eee4, #d9d2c0)",
       baits:  {
         senko:      "assets/senko-monkey-milk.jpg",
         paddletail: null
       }
     }

   The "baits" object does two jobs at once:

     - If a bait is LISTED, the color shows up in that bait's dropdown
       and on the colors page.
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
    baits: {
      senko: "assets/cheddarbaits15.jpg",
      paddletail: "assets/cheddarbaits9.jpg"
    }
  },

  {
    id: "confetti-cake",
    name: "Confetti Cake",
    blurb: "Opaque deep purple loaded with red, blue and purple flake.",
    swatch: "linear-gradient(150deg, #4a2d6b, #2a1540)",
    baits: {
      senko: "assets/cheddarbaits20.jpg",
      paddletail: "assets/cheddarbaits14.jpg"
    }
  },

  {
    id: "sparkle-&-shine",
    name: "Sparkle & Shine",
    blurb: "Similar to confetti cake mix, but in a semi-transparent deep blue.",
    swatch: "linear-gradient(150deg, #2f6fa8, #14375c)",
    baits: {
      senko: "assets/cheddarbaits18.jpg",
      paddletail: null
    }
  },

  {
    id: "sparkle-&-shine-(pearl-edition)",
    name: "Sparkle & Shine (Pearl Edition)",
    blurb: "Sparkle and shine, but with extra shine!",
    swatch: "linear-gradient(150deg, #2f6fa8, #14375c)",
    baits: {
      senko: "assets/cheddarbaits3.jpg",
      paddletail: "assets/cheddarbaits11.jpg"
    }
  },

  {
    id: "bubblegum",
    name: "Bubblegum",
    blurb: "Soft opaque pink with black flake through it.",
    swatch: "linear-gradient(150deg, #f2a0c0, #d1668f)",
    baits: {
      senko: "assets/cheddarbaits16.jpg",
      paddletail: "assets/cheddarbaits7.jpg"
    }
  },

  {
    id: "chartreuse-pepper",
    name: "Chartreuse Pepper",
    blurb: "Bright chartreuse with fine black pepper flake.",
    swatch: "linear-gradient(150deg, #c8e04a, #8fae1c)",
    baits: {
      senko: "assets/cheddarbaits21.jpg",
      paddletail: null
    }
  },

  {
    id: "blue-smoke-pearl",
    name: "Blue Smoke Pearl",
    blurb: "Smoky blue pearl base with purple and blue flake. Coming Soon!",
    swatch: "linear-gradient(150deg, #6d86a8, #38506e)",
    baits: {
      senko: null,
      paddletail: null
    }
  },

  {
    id: "pumpkingreen",
    name: "PumpkinGreen",
    blurb: "Natural green pumpkin body enhanced with black flake. The classic lure for bass fishermen",
    swatch: "linear-gradient(150deg, #0d6301, #084100)",
    baits: {
      senko: "assets/cheddarbaits23.jpg",
      paddletail: "assets/cheddarbaits13.jpg"
    }
  },

  {
    id: "junebug",
    name: "Junebug",
    blurb: "A flashy violet with strong green flake that works great in muddy waters, due to its ability to create really strong silhouettes.",
    swatch: "linear-gradient(150deg, #640468, #400242)",
    baits: {
      senko: "assets/cheddarbaits22.jpg",
      paddletail: "assets/cheddarbaits6.jpg"
    }
  },

  {
    id: "watermelon-red",
    name: "Watermelon Red",
    blurb: "Natural green pumpkin body lifted with chartreuse and red flake. Quiet, confident, a timeless classic.",
    swatch: "linear-gradient(150deg, #7a8a3c, #46521c)",
    baits: {
      senko: "assets/cheddarbaits17.jpg",
      paddletail: "assets/cheddarbaits12.jpg"
    }
  },

  {
    id: "midnight-twinkle",
    name: "Midnight Twinkle",
    blurb: "A flashy black with blue flake, works great in muddy waters for it's awesome silhouettes!",
    swatch: "linear-gradient(150deg, #05000a, #1707fd)",
    baits: {
      senko: null,
      paddletail: "assets/cheddarbaits10.jpg"
    }
  },

  {
    id: "electric-junebug",
    name: "Electric Junebug",
    blurb: "A flashy blue-violet with strong green and blue flake that works great in muddy waters. Shiny! Coming Soon!",
    swatch: "linear-gradient(150deg, #260797, #2704ec)",
    baits: {
      senko: null,
      paddletail: null
    }
  },

  {
    id: "blue-smoke-pearl",
    name: "Blue Smoke Pearl",
    blurb: "Smoky blue pearl base with purple and blue flake. Coming Soon!",
    swatch: "linear-gradient(150deg, #6d86a8, #38506e)",
    baits: {
      senko: null,
      paddletail: null
    }
  }

];
