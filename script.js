const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
});

document.querySelectorAll('#site-nav a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

document.getElementById('year').textContent = new Date().getFullYear();

// Fills in the shipping price anywhere the HTML has
// <span data-shipping-rate></span>, straight from colors.js, so the
// number only ever lives in one place. Runs after the page loads so
// it works no matter which order the scripts are listed in.
document.addEventListener('DOMContentLoaded', () => {
  if (typeof SHIPPING_FLAT_RATE === 'undefined') return;
  document.querySelectorAll('[data-shipping-rate]').forEach(el => {
    el.textContent = '$' + SHIPPING_FLAT_RATE.toFixed(2);
  });

  // Free-shipping threshold: <span data-free-threshold></span> gets the
  // amount, and anything wrapped in data-free-shipping disappears if the
  // threshold is switched off (FREE_SHIPPING_THRESHOLD = null).
  const t = (typeof FREE_SHIPPING_THRESHOLD === 'number') ? FREE_SHIPPING_THRESHOLD : null;
  document.querySelectorAll('[data-free-threshold]').forEach(el => {
    if (t !== null) el.textContent = '$' + (Number.isInteger(t) ? t : t.toFixed(2));
  });
  document.querySelectorAll('[data-free-shipping]').forEach(el => {
    el.hidden = (t === null);
  });
});
