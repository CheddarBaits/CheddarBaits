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
  senko:      { name: '5" Senko',                 page: "senko.html"      },
  paddletail: { name: '3.5" Paddletail Swimbait', page: "paddletail.html" }
};


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
   ------------------------------------------------------------ */

const CHEDDAR_COLORS = [

  {
    id: "monkey-milk",
    name: "Monkey Milk",
    blurb: "Milky pearl white with a heavy iridescent flash. Shines hard in sun.",
    swatch: "linear-gradient(150deg, #f2eee4, #d9d2c0)",
    baits: {
      senko: null,
      paddletail: null
    }
  },

  {
    id: "confetti-cake",
    name: "Confetti Cake",
    blurb: "Opaque deep purple loaded with red, blue and purple flake.",
    swatch: "linear-gradient(150deg, #4a2d6b, #2a1540)",
    baits: {
      senko: null,
      paddletail: null
    }
  },

  {
    id: "blue-confetti-cake",
    name: "Blue Confetti Cake",
    blurb: "The confetti cake mix in a semi-transparent deep blue.",
    swatch: "linear-gradient(150deg, #2f6fa8, #14375c)",
    baits: {
      senko: null,
      paddletail: null
    }
  },

  {
    id: "bubblegum",
    name: "Bubblegum",
    blurb: "Soft opaque pink with black flake through it.",
    swatch: "linear-gradient(150deg, #f2a0c0, #d1668f)",
    baits: {
      senko: null,
      paddletail: null
    }
  },

  {
    id: "chartreuse-pepper",
    name: "Chartreuse Pepper",
    blurb: "Bright chartreuse with fine black pepper flake.",
    swatch: "linear-gradient(150deg, #c8e04a, #8fae1c)",
    baits: {
      senko: null,
      paddletail: null
    }
  },

  {
    id: "blue-smoke-pearl",
    name: "Blue Smoke Pearl",
    blurb: "Smoky blue pearl base with purple and blue flake.",
    swatch: "linear-gradient(150deg, #6d86a8, #38506e)",
    baits: {
      senko: null,
      paddletail: null
    }
  },

  {
    id: "watermelon-green",
    name: "Watermelon Green",
    blurb: "Natural green pumpkin body lifted with chartreuse. Quiet, confident, always works.",
    swatch: "linear-gradient(150deg, #7a8a3c, #46521c)",
    baits: {
      senko: null,
      paddletail: null
    }
  }

];
