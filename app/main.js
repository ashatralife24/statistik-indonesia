// Statistik Indonesia — router hash dan pencarian.
// Rute: #/ (beranda), #/penduduk, #/ekonomi, #/harga, #/kerja, #/kemiskinan,
// #/daerah, #/tentang. Rute tak dikenal kembali ke beranda.

import { ROUTES, searchIndex } from './views.js';

const NAV = [
  ['#/', 'Beranda'],
  ['#/penduduk', 'Penduduk'],
  ['#/ekonomi', 'Ekonomi'],
  ['#/harga', 'Harga'],
  ['#/kerja', 'Kerja'],
  ['#/kemiskinan', 'Kemiskinan'],
  ['#/daerah', 'Daerah'],
];

const TITLES = {
  '/': 'Statistik Indonesia — Data Nasional dari BPS',
  '/penduduk': 'Penduduk — Statistik Indonesia',
  '/ekonomi': 'Ekonomi — Statistik Indonesia',
  '/harga': 'Harga & Inflasi — Statistik Indonesia',
  '/kerja': 'Ketenagakerjaan — Statistik Indonesia',
  '/kemiskinan': 'Kemiskinan — Statistik Indonesia',
  '/daerah': 'Daerah — Statistik Indonesia',
  '/tentang': 'Tentang — Statistik Indonesia',
};

const app = document.getElementById('app');
const nav = document.getElementById('main-nav');

function buildNav(active) {
  nav.innerHTML = NAV.map(([href, label]) => {
    const path = href.slice(1);
    const cls = path === active ? ' class="active" aria-current="page"' : '';
    return '<a href="' + href + '"' + cls + '>' + label + '</a>';
  }).join('');
}

function route() {
  const hash = window.location.hash || '#/';
  const path = hash.slice(1).split('?')[0] || '/';
  const view = ROUTES[path] || ROUTES['/'];
  const realPath = ROUTES[path] ? path : '/';
  buildNav(realPath);
  document.title = TITLES[realPath] || TITLES['/'];
  const { html, mount } = view();
  app.innerHTML = html;
  mount();
  window.scrollTo(0, 0);
}

function setupSearch() {
  const input = document.getElementById('site-search');
  const box = document.getElementById('search-results');
  if (!input || !box) return;
  const close = () => { box.classList.remove('open'); box.innerHTML = ''; };
  input.addEventListener('input', () => {
    const results = searchIndex(input.value);
    if (!results.length) { close(); return; }
    box.innerHTML = results.map((r) =>
      '<a href="' + r.route + '"><strong>' + r.label + '</strong><small>' + r.detail + '</small></a>').join('');
    box.classList.add('open');
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { close(); input.blur(); }
    if (event.key === 'Enter') {
      const first = box.querySelector('a');
      if (first) { window.location.hash = first.getAttribute('href'); close(); input.blur(); }
    }
  });
  box.addEventListener('click', (event) => {
    if (event.target.closest('a')) { close(); input.value = ''; }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-wrap')) close();
  });
}

window.addEventListener('hashchange', route);
setupSearch();
route();
