/* Floating "Screens" menu so reviewers can jump between mockup screens. */
(function () {
  const pages = [
    ['index.html', '1 · Landing page'], ['dashboard.html', '2 · Member dashboard'], ['tenders.html', '3 · Tenders'],
    ['opportunities.html', '4 · Opportunities'], ['market-data.html', '5 · Market Data'], ['register.html', '6 · Mobile registration'],
    ['mobile-ar.html', '7 · Mobile, Arabic'], ['pricing.html', '8 · Pricing and plans'], ['upgrade.html', '9 · Upgrade prompt (mobile)'],
    ['farm-planner.html', '10 · Farm Planner'], ['finance-bundle.html', '11 · Finance bundle (mobile)']
  ];
  const here = location.pathname.split('/').pop() || 'index.html';
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:9999;font-family:Inter,system-ui,sans-serif';
  const btn = document.createElement('button');
  btn.type = 'button'; btn.textContent = '☰ Screens';
  btn.setAttribute('aria-expanded', 'false');
  btn.style.cssText = 'font:inherit;font-size:14px;font-weight:600;color:#1F2A24;background:#D9A21B;border:0;border-radius:999px;padding:10px 16px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.2)';
  const panel = document.createElement('nav');
  panel.setAttribute('aria-label', 'Mockup screens');
  panel.style.cssText = 'display:none;margin-bottom:8px;background:#FFFFFF;border-radius:14px;padding:8px;box-shadow:0 12px 32px rgba(0,0,0,.2);min-width:240px';
  pages.forEach(([href, label]) => {
    const a = document.createElement('a');
    a.href = href; a.textContent = label;
    a.style.cssText = 'display:block;padding:8px 12px;border-radius:8px;font-size:14px;text-decoration:none;color:' + (href === here ? '#FFFFFF;background:#1E6B3A' : '#1F2A24');
    panel.appendChild(a);
  });
  btn.addEventListener('click', () => {
    const open = panel.style.display === 'none';
    panel.style.display = open ? 'block' : 'none';
    btn.setAttribute('aria-expanded', String(open));
  });
  wrap.appendChild(panel); wrap.appendChild(btn);
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(wrap));
})();
