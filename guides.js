/* ============================================================
   CheddarBaits — rigging guides
   ------------------------------------------------------------
   THIS IS THE ONLY FILE YOU EDIT TO CHANGE A GUIDE OR ADD A NEW ONE.
   guides.html builds itself from the list below.

   Each guide looks like this:

     {
       id:    "senko",                      // used in the link: guides.html#senko
       title: '5" Senko & Stinger',         // heading on the card
       baits: ["senko", "stinger"],         // keys from colors.js — each one gets
                                            // an "Order" button on the card
       intro: "One or two sentences.",
       rigs: [
         {
           name:   "Wacky rig",
           hook:   "1/0\u20132/0 wacky or circle hook",
           weight: "None",
           how:    "How to rig it and fish it.",
           when:   "Where and when it works best."
         }
       ]
     }

   To add a new guide when you add a new bait: copy a block, change
   the words, and put the bait's key (the one from colors.js) in "baits".

   NOTE: the hook sizes and weights below are common starting points,
   not rules. Change anything that doesn't match how YOU fish these baits.
   ------------------------------------------------------------ */

const RIGGING_GUIDES = [

  {
    id: "senko",
    title: '5" Senko & Stinger',
    baits: ["senko", "stinger"],
    intro: "Stick baits do their best work on a slow, slack-line fall. Whatever rig you pick, let the bait fall without pulling on it and watch your line for a jump or tick.",
    rigs: [
      {
        name: "Wacky rig",
        hook: "1/0\u20132/0 wacky or circle hook (or an O-ring)",
        weight: "None, or a small nail weight in one end",
        how: "Hook it through the middle of the body. Cast past your target, let it fall on a slack line, and give it light twitches. Both ends shimmy as it sinks.",
        when: "Docks, laydowns, weed edges, and pressured fish."
      },
      {
        name: "Texas rig",
        hook: "3/0\u20134/0 offset or EWG hook",
        weight: "Weightless, or a 1/16\u20131/8 oz bullet weight",
        how: "Nose-hook it and bury the hook point in the body so it stays weedless. Skip it under cover or let it fall beside cover.",
        when: "Grass, lily pads, wood, and other heavy cover."
      },
      {
        name: "Neko rig",
        hook: "1/0\u20132/0 weedless or finesse hook",
        weight: "1/16\u20133/32 oz nail weight",
        how: "Push the nail weight into one end and hook it through the middle. The bait stands on its head on the bottom and quivers when you shake the rod tip.",
        when: "Rock, gravel, and clear water finesse bites."
      },
      {
        name: "Drop shot",
        hook: "#1\u20131/0 drop shot hook",
        weight: "3/16\u20133/8 oz drop shot weight",
        how: "Nose-hook it with the hook point up, with the weight 8\u201318 inches below. Keep the weight in place and shake the bait.",
        when: "Fish holding just off the bottom, and deeper water."
      }
    ]
  },

  {
    id: "senko4",
    title: '4" Senko',
    baits: ["senko4"],
    intro: "The smaller Senko is built for finesse. It sinks more slowly, so go lighter on hooks and weights than you would with the 5\".",
    rigs: [
      {
        name: "Wacky rig",
        hook: "#1\u20131/0 wacky or circle hook",
        weight: "None",
        how: "Hook it through the middle and fish it on a slack line, with light twitches and long pauses.",
        when: "Shallow water, clear water, and slow bites."
      },
      {
        name: "Neko rig",
        hook: "#1\u20131/0 weedless or finesse hook",
        weight: "1/16 oz nail weight",
        how: "Nail weight in one end, hook through the middle. Drag it slowly across the bottom, then shake it in place.",
        when: "Hard bottoms and cold-water bites."
      },
      {
        name: "Drop shot",
        hook: "#2\u2013#1 drop shot hook",
        weight: "1/8\u20133/16 oz drop shot weight",
        how: "Nose-hook it, weight 8\u201312 inches below, and shake it gently over fish you can see on your electronics.",
        when: "Suspended or bottom-hugging fish in clear water."
      }
    ]
  },

  {
    id: "paddletail",
    title: '3.5" Ripper Paddletail & 3" Minnow Paddletail',
    baits: ["paddletail", "minnow"],
    intro: "The tail does the work, so keep the bait running level and the retrieve steady. Go to the lighter end of the weight range with the 3\" Minnow.",
    rigs: [
      {
        name: "Swimbait jighead",
        hook: "1/0\u20133/0 jighead (1/0\u20132/0 for the 3\" Minnow)",
        weight: "1/8\u20131/4 oz (1/16\u20131/8 oz for the 3\" Minnow)",
        how: "Thread the bait straight onto the jighead so it sits level. Let it sink to the depth you want, then retrieve at a steady pace so the tail kicks.",
        when: "Open water, schooling baitfish, and anywhere fish are chasing."
      },
      {
        name: "Weighted swimbait hook",
        hook: "2/0\u20133/0 weighted EWG swimbait hook",
        weight: "Built into the hook, typically 1/8\u20131/4 oz",
        how: "Rig it weedless with the hook point tucked into the back and swim it over and through cover.",
        when: "Sparse grass, weed tops, and shallow cover."
      },
      {
        name: "Jig or bladed jig trailer",
        hook: "On the jig's own hook",
        weight: "3/8\u20131/2 oz jig or bladed jig",
        how: "Slide it onto the trailer keeper so the tail has room to kick. It adds a swimming tail and some bulk to the jig.",
        when: "Slow-rolling a jig, or adding bulk to a bladed jig."
      }
    ]
  },

  {
    id: "grub",
    title: '5/8" Grub & Stinger Grub',
    baits: ["grub", "stingergrub"],
    intro: "Small grubs are a crappie and panfish classic. Keep your gear light so the grub's tail can move on the fall and the retrieve.",
    rigs: [
      {
        name: "Jighead, cast and retrieve",
        hook: "#2\u2013#1 jighead",
        weight: "1/32\u20131/16 oz",
        how: "Cast, let it sink, then retrieve slowly and steadily. Count it down to find the depth where the bites are.",
        when: "Crappie and panfish cruising around cover or along edges."
      },
      {
        name: "Under a float",
        hook: "#2\u2013#1 jighead",
        weight: "1/32\u20131/16 oz, under a slip float",
        how: "Set the float so the grub sits at the depth of the brush or the suspended fish. Let it hang, with an occasional twitch.",
        when: "Suspended fish and shallow brush."
      },
      {
        name: "Vertical jigging",
        hook: "#2\u2013#1 jighead",
        weight: "1/16 oz",
        how: "Drop it straight down beside a dock or brush pile on light line and lift and fall it just above the cover.",
        when: "Fish stacked on tight cover."
      }
    ]
  },

  {
    id: "creature",
    title: '4" Creature Bait',
    baits: ["creature"],
    intro: "The ribs and appendages push water and add action even when you aren't doing much. Use heavier gear when fishing thick cover.",
    rigs: [
      {
        name: "Texas rig (flip and pitch)",
        hook: "3/0\u20134/0 EWG hook",
        weight: "1/4\u20133/8 oz bullet weight (peg it in heavy cover)",
        how: "Pitch it into holes and pockets, let it fall on a controlled line, then lift and drop it before reeling in.",
        when: "Thick cover, matted vegetation, and wood."
      },
      {
        name: "Jig trailer",
        hook: "On the jig's own hook",
        weight: "3/8\u20133/4 oz flipping or football jig",
        how: "Rig it on the jig hook so the appendages flare behind the skirt. Hop it along the bottom.",
        when: "Rock, wood, and structure edges."
      },
      {
        name: "Carolina rig",
        hook: "3/0 EWG hook",
        weight: "1/2\u20131 oz weight with an 18\u201336 inch leader",
        how: "Drag it slowly along the bottom, then sweep the rod and let the creature flutter back down.",
        when: "Flats, points, and gravel or rock bottoms."
      }
    ]
  }

];


/* ------------------------------------------------------------
   Builds the page from the list above. You shouldn't need to
   edit anything below this line.
   ------------------------------------------------------------ */

function initGuidesPage() {
  const grid = document.getElementById("guides-grid");
  if (!grid) return;
  grid.innerHTML = "";

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  RIGGING_GUIDES.forEach(function (guide) {
    const card = el("article", "guide-card");
    card.id = guide.id;

    card.appendChild(el("h3", "guide-title", guide.title));
    card.appendChild(el("p", "guide-intro", guide.intro));

    guide.rigs.forEach(function (rig) {
      const box = el("div", "guide-rig");
      box.appendChild(el("h4", "guide-rig-name", rig.name));

      const specs = el("dl", "guide-specs");
      [["Hook", rig.hook], ["Weight", rig.weight]].forEach(function (pair) {
        const row = el("div", "guide-spec");
        row.appendChild(el("dt", null, pair[0]));
        row.appendChild(el("dd", null, pair[1]));
        specs.appendChild(row);
      });
      box.appendChild(specs);

      const how = el("p", "guide-how");
      how.appendChild(el("strong", null, "How: "));
      how.appendChild(document.createTextNode(rig.how));
      box.appendChild(how);

      const when = el("p", "guide-when");
      when.appendChild(el("strong", null, "Best for: "));
      when.appendChild(document.createTextNode(rig.when));
      box.appendChild(when);

      card.appendChild(box);
    });

    // One "Order" button per bait this guide covers.
    const actions = el("div", "guide-actions");
    guide.baits.forEach(function (key) {
      const bait = (typeof CHEDDAR_BAITS !== "undefined") && CHEDDAR_BAITS[key];
      if (!bait || !bait.page) return;
      const link = el("a", "button button-secondary", "Order the " + bait.name);
      link.href = "order.html?bait=" + key;
      actions.appendChild(link);
    });
    if (actions.children.length) card.appendChild(actions);

    grid.appendChild(card);
  });
}
