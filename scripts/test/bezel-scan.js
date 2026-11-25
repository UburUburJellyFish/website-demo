// Test helper (not part of the site): scans the parallax for things covering the Apple bezel and for cropped phones.
// Use: npm run build, copy this file to out/__scan.js, serve out/, open the page at the size to test, then in the
// browser console: `await import('/__scan.js'); await __scan()`. "overlaps" should be empty (or only short, nearly
// transparent moments); "cropped" should only list scroll positions where the phone enters or leaves the screen.
window.__scan = async (step = 50) => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  await wait(600);
  const stage = document.querySelector('[data-px-stage]');
  if (!document.documentElement.classList.contains('px-on')) return { pxOn: false };
  const total = parseFloat(stage.style.height) - innerHeight;
  const eff = el => { let o = 1; for (let n = el; n && n !== document.documentElement; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= parseFloat(cs.opacity); } return o; };
  const frames = [...document.querySelectorAll('img[src*="iphone-bezel"]')].map(i => i.parentElement).filter(f => f.closest('[data-px-viewport]'));
  const phoneish = /^(phone|screen-|voice-glow|wall|wall-col-|wall-hero)/;
  const others = [...document.querySelectorAll('[data-px-viewport] [data-px]')].filter(e => !phoneish.test(e.dataset.px) && !e.closest('[data-px="phone"],[data-px="wall"],[data-px="wall-hero"]') && !e.closest('[aria-hidden="true"]'));
  const H = innerHeight, W = innerWidth;
  const over = {}, crop = {};
  for (let y = 0; y <= total; y += step) {
    window.scrollTo({ top: y, behavior: 'instant' }); await wait(20);
    const vis = frames.map(f => ({ f, r: f.getBoundingClientRect(), o: eff(f) })).filter(x => x.o > 0.05 && x.r.width > 0 && x.r.bottom > 0 && x.r.top < H);
    for (const { f, r, o } of vis) {
      const name = (f.closest('[data-px^="wall-col"],[data-px="wall-hero"],[data-px="phone"]')?.dataset.px) || 'phone?';
      if (o > 0.9 && (r.top < 64 || r.bottom > H + 1 || r.left < -1 || r.right > W + 1)) (crop[name] ||= []).push(y);
      for (const e of others) {
        const er = e.getBoundingClientRect(); if (er.width === 0) continue;
        const ix = Math.min(r.right, er.right) - Math.max(r.left, er.left), iy = Math.min(r.bottom, er.bottom) - Math.max(r.top, er.top);
        if (ix <= 2 || iy <= 2) continue;
        const eo = eff(e); if (eo < 0.05) continue;
        (over[`${name} × ${e.dataset.px}`] ||= []).push([y, Math.round(ix * iy), Math.round(Math.min(o, eo) * 100) / 100]);
      }
    }
  }
  const sumO = Object.fromEntries(Object.entries(over).map(([k, v]) => [k, `${v.length}x y ${v[0][0]}..${v.at(-1)[0]} maxArea ${Math.max(...v.map(x => x[1]))} maxOp ${Math.max(...v.map(x => x[2]))}`]));
  const sumC = Object.fromEntries(Object.entries(crop).map(([k, v]) => [k, `${v.length}x: ${v.join(',')}`]));
  return { w: W, h: H, total: Math.round(total), sw: document.documentElement.scrollWidth, overlaps: sumO, cropped: sumC };
};
