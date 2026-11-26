// Statistik Indonesia — perender halaman (hash routes).
// Setiap halaman: { html, mount } — mount menggambar grafik kanvas setelah
// HTML dimasukkan ke DOM, dan memasang kontrol halaman itu (toggle, filter).

import { DATA, INDEX } from './data.js';
import { lineChart, hbarChart, vbarChart } from './charts.js';

function fmt(n, d) {
  return n.toLocaleString('id-ID', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
}

function kpi(label, value, unit, note, source, route) {
  const inner =
    '<div class="kpi-label">' + label + '</div>' +
    '<div class="kpi-value">' + value + (unit ? ' <small>' + unit + '</small>' : '') + '</div>' +
    '<div class="kpi-note">' + note + '</div>' +
    '<div class="kpi-source">' + source + '</div>';
  if (route) return '<a class="kpi clickable" href="' + route + '" style="text-decoration:none;color:inherit;display:block">' + inner + '</a>';
  return '<div class="kpi">' + inner + '</div>';
}

function chartCard(title, canvasId, caption, source) {
  return '<section class="card"><h3>' + title + '</h3>' +
    '<div class="chart-box"><canvas id="' + canvasId + '"></canvas></div>' +
    '<div class="chart-caption">' + caption + '</div>' +
    '<div class="source">' + source + '</div></section>';
}

function factRow(label, value, source) {
  return '<li><span>' + label + '</span><span class="fact-value">' + value +
    (source ? '<span class="fact-source">' + source + '</span>' : '') + '</span></li>';
}

function topicCard(route, title, text, stat) {
  return '<a class="topic" href="' + route + '"><h3>' + title + '</h3><p>' + text + '</p>' +
    '<span class="topic-stat">' + stat + '</span></a>';
}

// ---------- Beranda ----------
function home() {
  const p = DATA.penduduk, e = DATA.ekonomi, h = DATA.harga, k = DATA.kerja, m = DATA.kemiskinan;
  const html =
    '<section class="hero"><h1>Statistik Indonesia, dibaca dengan mudah.</h1>' +
    '<p>Angka-angka resmi negara — penduduk, ekonomi, harga, pekerjaan, dan kemiskinan — ' +
    'dikumpulkan dari publikasi Badan Pusat Statistik (BPS), lengkap dengan sumber dan tahunnya. ' +
    'Tidak ada angka karangan di situs ini.</p>' +
    '<span class="stamp">Data terakhir: November 2025 · BPS</span></section>' +

    '<div class="kpis">' +
    kpi('Penduduk', '281,6', 'juta jiwa', 'Pertengahan 2024', 'BPS, Proyeksi Penduduk 2020–2035', '#/penduduk') +
    kpi('Pertumbuhan ekonomi', '5,11', '%', 'PDB tumbuh sepanjang 2025', 'BPS, PDB 2025', '#/ekonomi') +
    kpi('Inflasi', '1,57', '% yoy', 'Desember 2024 — terendah sepanjang sejarah', 'BPS, IHK Desember 2024', '#/harga') +
    kpi('Pengangguran terbuka', '4,74', '%', 'November 2025 · 7,35 juta orang', 'BPS, Sakernas November 2025', '#/kerja') +
    kpi('Kemiskinan', '8,25', '%', 'September 2025 · 23,36 juta orang', 'BPS, Susenas September 2025', '#/kemiskinan') +
    kpi('IPM', '75,02', '', 'Indeks Pembangunan Manusia 2024', 'BPS, IPM 2024', '#/kemiskinan') +
    '</div>' +

    '<div class="grid-2">' +
    chartCard('Pertumbuhan ekonomi Indonesia', 'home-growth', 'PDB tumbuh di atas 5% selama empat tahun berturut-turut (2022–2025).', 'BPS, Berita Resmi Statistik PDB') +
    chartCard('Tingkat kemiskinan terus turun', 'home-poverty', 'Tingkat kemiskinan Maret 2021–2025; September 2025 mencapai 8,25%.', 'BPS, Susenas') +
    '</div>' +

    '<h2>Jelajahi berdasarkan topik</h2>' +
    '<div class="topic-cards">' +
    topicCard('#/penduduk', 'Penduduk', 'Berapa banyak penduduk Indonesia, di mana mereka tinggal, dan bagaimana pertumbuhannya.', '281,6 juta <small>jiwa · 2024</small>') +
    topicCard('#/ekonomi', 'Ekonomi', 'PDB, pertumbuhan, PDB per kapita, dan sektor yang menggerakkan ekonomi.', 'Rp23.821,1 T <small>· 2025</small>') +
    topicCard('#/harga', 'Harga', 'Inflasi, IHK, dan apa yang membuat harga naik atau turun.', '1,57% <small>yoy · Des 2024</small>') +
    topicCard('#/kerja', 'Ketenagakerjaan', 'Siapa yang bekerja, di sektor apa, dan berapa penganggurannya.', '147,91 juta <small>bekerja · Nov 2025</small>') +
    topicCard('#/kemiskinan', 'Kemiskinan', 'Tingkat kemiskinan, garis kemiskinan, dan ketimpangan (gini).', '8,25% <small>· Sep 2025</small>') +
    topicCard('#/daerah', 'Daerah', 'Bandingkan provinsi: penduduk terbanyak dan bagiannya terhadap nasional.', '8 provinsi <small>terbesar · 2024</small>') +
    '</div>' +

    '<div class="note"><strong>Cara membaca angka di situs ini.</strong> Setiap angka disertai sumber dan ' +
    'tahunnya. “yoy” berarti dibandingkan periode yang sama tahun sebelumnya; “TPT” adalah tingkat ' +
    'pengangguran terbuka; “IHK” adalah Indeks Harga Konsumen. Kalau satu angka belum bisa diverifikasi ' +
    'dari publikasi BPS, angka itu tidak kami tampilkan.</div>';

  return {
    html,
    mount() {
      lineChart(document.getElementById('home-growth'),
        e.growth.map((d) => ({ label: d.year, value: d.value })), { decimals: 2 });
      lineChart(document.getElementById('home-poverty'),
        m.poverty.concat([{ year: 'Sep 25', value: 8.25 }]).map((d) => ({ label: d.year, value: d.value })), { decimals: 2 });
    },
  };
}

// ---------- Penduduk ----------
function penduduk() {
  const p = DATA.penduduk;
  const rows = p.provinces.map((prov) =>
    '<tr><td>' + prov.name + '</td><td class="num">' + fmt(prov.value, 2) + '</td>' +
    '<td class="num">' + fmt((prov.value / 281.6) * 100, 2) + '%</td></tr>').join('');
  const html =
    '<h1>Penduduk Indonesia</h1>' +
    '<p class="lede">Indonesia adalah negara berpenduduk terbesar keempat di dunia. ' +
    'Jumlah penduduk terus tumbuh sekitar 1% per tahun, dan lebih dari separuhnya tinggal di Pulau Jawa.</p>' +
    '<div class="kpis">' +
    kpi('Jumlah penduduk', '281,6', 'juta jiwa', 'Pertengahan 2024', 'BPS, Proyeksi Penduduk 2020–2035') +
    kpi('Laju pertumbuhan', '1,04', '% per tahun', '2024', 'BPS, Proyeksi Penduduk 2020–2035') +
    kpi('Proyeksi 2025', '284,44', 'juta jiwa', 'Pertengahan 2025', 'BPS, Proyeksi Penduduk 2020–2035') +
    '</div>' +
    '<div class="grid-2">' +
    chartCard('Jumlah penduduk 2020–2024 (juta jiwa)', 'pop-line',
      '2020 adalah hasil Sensus Penduduk; 2021–2024 proyeksi pertengahan tahun.', 'BPS, Sensus Penduduk 2020 & Proyeksi Penduduk 2020–2035') +
    chartCard('Lima provinsi berpenduduk terbanyak (juta jiwa, 2024)', 'pop-bars',
      'Jawa Barat sendiri menampung hampir 18% penduduk Indonesia.', p.provinceSource) +
    '</div>' +
    '<section class="card"><h2>Provinsi berpenduduk terbanyak</h2>' +
    '<table class="data"><thead><tr><th>Provinsi</th><th class="num">Penduduk (juta)</th><th class="num">Bagian dari nasional</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table>' +
    '<div class="source">' + p.provinceSource + ' · Bagian dihitung dari total nasional 281,6 juta jiwa (2024).</div></section>' +
    '<section class="card"><h2>Fakta cepat</h2><ul class="fact-list">' +
    factRow('Hasil Sensus Penduduk 2020', '270,20 juta jiwa', 'BPS, Sensus Penduduk 2020') +
    factRow('Kenaikan 2020 → 2024', '11,40 juta jiwa', 'BPS') +
    factRow('Provinsi terbanyak', 'Jawa Barat — 50,35 juta jiwa', 'BPS, 2024') +
    '</ul></section>';

  return {
    html,
    mount() {
      lineChart(document.getElementById('pop-line'),
        p.series.map((d) => ({ label: d.year, value: d.value })), { decimals: 2 });
      hbarChart(document.getElementById('pop-bars'),
        p.provinces.slice(0, 5).map((d) => ({ label: d.name, value: d.value })),
        { decimals: 2, highlightFirst: true });
    },
  };
}

// ---------- Ekonomi ----------
function ekonomi() {
  const e = DATA.ekonomi;
  const sectorRows = e.sectors.map((s) =>
    '<tr><td>' + s.name + '</td><td class="num">' + fmt(s.value, 2) + '%</td></tr>').join('');
  const html =
    '<h1>Ekonomi Indonesia</h1>' +
    '<p class="lede">Perekonomian Indonesia tumbuh 5,11% sepanjang 2025, dengan PDB mencapai ' +
    'Rp23.821,1 triliun. Industri pengolahan adalah lapangan usaha terbesar.</p>' +
    '<div class="kpis">' +
    kpi('PDB 2025', 'Rp23.821,1', 'triliun', 'Atas dasar harga berlaku', 'BPS, PDB 2025') +
    kpi('Pertumbuhan 2025', '5,11', '%', 'c-to-c, naik dari 5,03% pada 2024', 'BPS, PDB 2025') +
    kpi('PDB per kapita 2025', 'Rp83,7', 'juta', '≈ US$5.083,4 per orang', 'BPS, PDB 2025') +
    '</div>' +
    '<section class="card"><h2>Tren PDB</h2>' +
    '<div class="toggle" role="group" aria-label="Pilih ukuran PDB">' +
    '<button type="button" id="eco-growth-btn" aria-pressed="true">Pertumbuhan (%)</button>' +
    '<button type="button" id="eco-nominal-btn" aria-pressed="false">PDB (Rp triliun)</button></div>' +
    '<div class="chart-box"><canvas id="eco-chart"></canvas></div>' +
    '<div class="chart-caption" id="eco-caption">Pertumbuhan ekonomi tahunan (c-to-c). Tahun 2020 terkontraksi −2,07% karena pandemi.</div>' +
    '<div class="source">BPS, Berita Resmi Statistik PDB</div></section>' +
    '<div class="grid-2">' +
    '<section class="card"><h2>Lima lapangan usaha terbesar</h2><p>Pangsa terhadap PDB, Triwulan IV-2025.</p>' +
    '<table class="data"><thead><tr><th>Lapangan usaha</th><th class="num">Pangsa</th></tr></thead>' +
    '<tbody>' + sectorRows + '</tbody></table>' +
    '<div class="source">' + e.sectorSource + '</div></section>' +
    '<section class="card"><h2>PDB per kapita</h2><ul class="fact-list">' +
    factRow('2024', 'Rp78,62 juta (≈ US$4.960,33)', 'BPS, PDB 2024') +
    factRow('2025', 'Rp83,7 juta (≈ US$5.083,4)', 'BPS, PDB 2025') +
    factRow('Kenaikan 2024 → 2025', 'Rp5,08 juta per orang', 'BPS') +
    '</ul><div class="note"><strong>Mengapa PDB per kapita penting?</strong> Angka ini membagi seluruh ' +
    'nilai tambah ekonomi dengan jumlah penduduk — ukuran kasar rata-rata kesejahteraan ekonomi per orang.</div></section>' +
    '</div>';

  return {
    html,
    mount() {
      const canvas = document.getElementById('eco-chart');
      const caption = document.getElementById('eco-caption');
      const bGrowth = document.getElementById('eco-growth-btn');
      const bNominal = document.getElementById('eco-nominal-btn');
      const drawGrowth = () => {
        vbarChart(canvas, e.growth.map((d) => ({ label: d.year, value: d.value })), { decimals: 2 });
        caption.textContent = 'Pertumbuhan ekonomi tahunan (c-to-c). Tahun 2020 terkontraksi −2,07% karena pandemi.';
        bGrowth.setAttribute('aria-pressed', 'true');
        bNominal.setAttribute('aria-pressed', 'false');
      };
      const drawNominal = () => {
        lineChart(canvas, e.nominal.map((d) => ({ label: d.year, value: d.value })), { decimals: 0 });
        caption.textContent = 'PDB atas dasar harga berlaku (Rp triliun). Nilainya naik dari Rp15.434,2 triliun pada 2020.';
        bNominal.setAttribute('aria-pressed', 'true');
        bGrowth.setAttribute('aria-pressed', 'false');
      };
      bGrowth.addEventListener('click', drawGrowth);
      bNominal.addEventListener('click', drawNominal);
      drawGrowth();
    },
  };
}

// ---------- Harga ----------
function harga() {
  const h = DATA.harga;
  const html =
    '<h1>Harga &amp; Inflasi</h1>' +
    '<p class="lede">Inflasi Indonesia pada Desember 2024 tercatat 1,57% (yoy) — inflasi tahun kalender ' +
    'terendah sejak BPS mulai menghitung inflasi. Sasaran Bank Indonesia adalah 2,5% ± 1%.</p>' +
    '<div class="kpis">' +
    kpi('Inflasi Des 2024', '1,57', '% yoy', 'Terendah sepanjang sejarah perhitungan BPS', 'BPS, IHK Desember 2024') +
    kpi('IHK Des 2024', '106,80', '', 'Indeks Harga Konsumen (2022=100)', 'BPS, IHK Desember 2024') +
    kpi('Inflasi inti', '2,26', '% yoy', 'Desember 2024', 'BPS, IHK Desember 2024') +
    '</div>' +
    chartCard('Inflasi tahunan, Desember 2020–2024 (% yoy)', 'inf-line',
      'Inflasi 2022 melonjak ke 5,51% lalu turun tiga tahun berturut-turut.', 'BPS, Berita Resmi Statistik IHK') +
    '<div class="grid-2">' +
    '<section class="card"><h2>Apa yang menggerakkan harga?</h2><ul class="fact-list">' +
    factRow('Kelompok makanan, minuman & tembakau', '1,90% yoy', 'BPS, Desember 2024') +
    factRow('Komponen inti', '2,26% yoy', 'BPS, Desember 2024') +
    factRow('Inflasi bulanan Desember 2024', '0,44% (mtm)', 'BPS, Desember 2024') +
    factRow('IHK Desember 2023', '105,15', 'BPS (2022=100)') +
    '</ul></section>' +
    '<section class="card"><h2>Catatan penting</h2>' +
    '<div class="note"><strong>Deflasi Februari 2025.</strong> Indonesia mengalami deflasi tahunan ' +
    '−0,09% (yoy) pada Februari 2025 — deflasi tahunan pertama dalam 25 tahun terakhir. ' +
    '<span class="source" style="display:block;margin-top:6px">BPS, 2025</span></div>' +
    '<p>Sasaran inflasi Bank Indonesia adalah <strong>2,5% ± 1%</strong>. Inflasi 2024 sebesar 1,57% ' +
    'berada di dalam kisaran sasaran tersebut.</p></section>' +
    '</div>';

  return {
    html,
    mount() {
      lineChart(document.getElementById('inf-line'),
        h.inflation.map((d) => ({ label: d.year, value: d.value })), { decimals: 2 });
    },
  };
}

// ---------- Ketenagakerjaan ----------
function kerja() {
  const k = DATA.kerja;
  const html =
    '<h1>Ketenagakerjaan</h1>' +
    '<p class="lede">Pada November 2025, 147,91 juta orang bekerja dari 155,27 juta angkatan kerja. ' +
    'Tingkat pengangguran terbuka 4,74% — terendah dalam satu dekade terakhir.</p>' +
    '<div class="kpis">' +
    kpi('Bekerja', '147,91', 'juta orang', 'November 2025', k.nov2025.source) +
    kpi('TPT', '4,74', '%', 'November 2025 · 7,35 juta penganggur', k.nov2025.source) +
    kpi('TPAK', '70,95', '%', 'Tingkat partisipasi angkatan kerja, Nov 2025', k.nov2025.source) +
    '</div>' +
    chartCard('Tingkat pengangguran terbuka, Agustus 2021–2025 (%)', 'tpt-line',
      'TPT Agustus turun dari 6,49% (2021) menjadi 4,85% (2025).', 'BPS, Sakernas') +
    '<div class="grid-2">' +
    '<section class="card"><h2>Potret pekerja — November 2025</h2><ul class="fact-list">' +
    factRow('Pekerja penuh waktu', '67,94%', 'BPS, November 2025') +
    factRow('Pekerja paruh waktu', '24,24%', 'BPS, November 2025') +
    factRow('Setengah penganggur', '7,81%', 'BPS, November 2025') +
    factRow('Tiga sektor terbesar', '60,52% pekerja', 'Pertanian, perdagangan & industri pengolahan — BPS, November 2025') +
    '</ul></section>' +
    '<section class="card"><h2>Potret pekerja — Agustus 2025</h2><ul class="fact-list">' +
    factRow('Pekerja informal', '57,80% (84,58 juta orang)', 'BPS, Agustus 2025') +
    factRow('Upah rata-rata buruh/karyawan', 'Rp3,33 juta per bulan', 'BPS, Agustus 2025') +
    factRow('Pekerja penuh waktu', '67,32%', 'BPS, Agustus 2025') +
    factRow('Setengah penganggur', '7,91% (11,60 juta orang)', 'BPS, Agustus 2025') +
    '</ul><div class="note"><strong>Yang dimaksud “bekerja”.</strong> Dalam Sakernas, seseorang ' +
    'dihitung bekerja bila dalam seminggu terakhir bekerja paling sedikit satu jam untuk memperoleh upah atau keuntungan.</div></section>' +
    '</div>';

  return {
    html,
    mount() {
      lineChart(document.getElementById('tpt-line'),
        k.tpt.map((d) => ({ label: d.year, value: d.value })), { decimals: 2 });
    },
  };
}

// ---------- Kemiskinan ----------
function kemiskinan() {
  const m = DATA.kemiskinan;
  const giniRows = m.gini.map((g) =>
    '<tr><td>' + g.label + '</td><td class="num">' + g.value.toFixed(3).replace('.', ',') + '</td></tr>').join('');
  const html =
    '<h1>Kemiskinan &amp; Kesejahteraan</h1>' +
    '<p class="lede">Tingkat kemiskinan Indonesia turun menjadi 8,25% pada September 2025 — ' +
    '23,36 juta orang — terendah dalam dua dekade terakhir. Ketimpangan (gini ratio) juga turun ke 0,363.</p>' +
    '<div class="kpis">' +
    kpi('Tingkat kemiskinan', '8,25', '%', 'September 2025 · 23,36 juta orang', 'BPS, September 2025') +
    kpi('Garis kemiskinan', 'Rp641.443', '', 'Per kapita per bulan, Sep 2025', 'BPS, September 2025') +
    kpi('Gini ratio', '0,363', '', 'September 2025, turun dari 0,375 (Mar 2025)', 'BPS, Susenas') +
    '</div>' +
    '<section class="card"><h2>Tren kemiskinan &amp; ketimpangan</h2>' +
    '<div class="toggle" role="group" aria-label="Pilih ukuran">' +
    '<button type="button" id="pov-btn" aria-pressed="true">Tingkat kemiskinan (%)</button>' +
    '<button type="button" id="gini-btn" aria-pressed="false">Gini ratio</button></div>' +
    '<div class="chart-box"><canvas id="pov-chart"></canvas></div>' +
    '<div class="chart-caption" id="pov-caption">Tingkat kemiskinan Maret 2021–2025; September 2025 mencapai 8,25%.</div>' +
    '<div class="source">BPS, Susenas</div></section>' +
    '<div class="grid-2">' +
    '<section class="card"><h2>Gini ratio</h2><p>Skala 0 (semua sama) sampai 1 (satu orang menguasai semua).</p>' +
    '<table class="data"><thead><tr><th>Periode</th><th class="num">Gini ratio</th></tr></thead>' +
    '<tbody>' + giniRows + '</tbody></table>' +
    '<div class="source">BPS, Susenas · Di perkotaan 0,383 dan perdesaan 0,295 (September 2025).</div></section>' +
    '<section class="card"><h2>Kemiskinan ekstrem</h2><ul class="fact-list">' +
    factRow('Maret 2024', '1,26%', 'BPS') +
    factRow('Maret 2025', '0,85% (2,38 juta orang)', 'BPS') +
    factRow('Garis kemiskinan Maret 2025', 'Rp609.160 per kapita/bulan', 'BPS') +
    '</ul><div class="note"><strong>IPM 2024: 75,02.</strong> Indeks Pembangunan Manusia naik dari ' +
    '74,39 pada 2023. <span class="source" style="display:block;margin-top:6px">BPS, IPM 2024</span></div></section>' +
    '</div>';

  return {
    html,
    mount() {
      const canvas = document.getElementById('pov-chart');
      const caption = document.getElementById('pov-caption');
      const bPov = document.getElementById('pov-btn');
      const bGini = document.getElementById('gini-btn');
      const drawPov = () => {
        lineChart(canvas,
          m.poverty.concat([{ year: 'Sep 25', value: 8.25 }]).map((d) => ({ label: d.year, value: d.value })), { decimals: 2 });
        caption.textContent = 'Tingkat kemiskinan Maret 2021–2025; September 2025 mencapai 8,25%.';
        bPov.setAttribute('aria-pressed', 'true');
        bGini.setAttribute('aria-pressed', 'false');
      };
      const drawGini = () => {
        lineChart(canvas, m.gini.map((d) => ({ label: d.label, value: d.value })), { decimals: 3 });
        caption.textContent = 'Gini ratio Maret 2024 – September 2025. Nilai turun 0,012 poin dalam enam bulan terakhir.';
        bGini.setAttribute('aria-pressed', 'true');
        bPov.setAttribute('aria-pressed', 'false');
      };
      bPov.addEventListener('click', drawPov);
      bGini.addEventListener('click', drawGini);
      drawPov();
    },
  };
}

// ---------- Daerah ----------
function daerah() {
  const p = DATA.penduduk;
  const html =
    '<h1>Daerah: bandingkan provinsi</h1>' +
    '<p class="lede">Delapan provinsi berpenduduk terbanyak menampung lebih dari dua pertiga penduduk ' +
    'Indonesia. Ketik nama provinsi untuk menyaring, atau klik judul kolom untuk mengurutkan.</p>' +
    '<section class="card"><div class="filter-row">' +
    '<input type="search" id="prov-filter" placeholder="Cari provinsi… (mis. Jawa, Sumatera)" aria-label="Cari provinsi">' +
    '<span class="badge" id="prov-count"></span></div>' +
    '<table class="data"><thead><tr>' +
    '<th><button type="button" data-sort="name">Provinsi ↕</button></th>' +
    '<th class="num"><button type="button" data-sort="value">Penduduk (juta) ↕</button></th>' +
    '<th class="num"><button type="button" data-sort="share">Bagian ↕</button></th>' +
    '</tr></thead><tbody id="prov-body"></tbody></table>' +
    '<div class="source">' + p.provinceSource + ' · Bagian dihitung dari total nasional 281,6 juta jiwa (2024).</div></section>' +
    '<div class="note"><strong>Mengapa Jawa begitu padat?</strong> Enam provinsi di Pulau Jawa — ' +
    'Jawa Barat, Jawa Timur, Jawa Tengah, Banten, DKI Jakarta, dan DI Yogyakarta — menampung lebih dari ' +
    'separuh penduduk Indonesia, sementara luasnya hanya sekitar 7% wilayah daratan. Itulah mengapa ' +
    'pemerataan pembangunan antardaerah selalu menjadi isu utama statistik daerah.</div>';

  return {
    html,
    mount() {
      const body = document.getElementById('prov-body');
      const input = document.getElementById('prov-filter');
      const count = document.getElementById('prov-count');
      let sortKey = 'value';
      let sortDir = -1;
      const render = () => {
        const q = input.value.trim().toLowerCase();
        let rows = p.provinces
          .map((prov) => ({ name: prov.name, value: prov.value, share: (prov.value / 281.6) * 100 }))
          .filter((r) => !q || r.name.toLowerCase().includes(q));
        rows.sort((a, b) => {
          const av = a[sortKey], bv = b[sortKey];
          return (av < bv ? -1 : av > bv ? 1 : 0) * sortDir;
        });
        body.innerHTML = rows.length ? rows.map((r) =>
          '<tr><td>' + r.name + '</td><td class="num">' + fmt(r.value, 2) + '</td>' +
          '<td class="num">' + fmt(r.share, 2) + '%</td></tr>').join('')
          : '<tr><td colspan="3" class="empty">Tidak ada provinsi yang cocok dengan “' + input.value.trim() + '”.</td></tr>';
        count.textContent = rows.length + ' dari 8 provinsi';
      };
      document.querySelectorAll('th button[data-sort]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const key = btn.getAttribute('data-sort');
          if (sortKey === key) sortDir = -sortDir;
          else { sortKey = key; sortDir = key === 'name' ? 1 : -1; }
          render();
        });
      });
      input.addEventListener('input', render);
      render();
    },
  };
}

// ---------- Tentang ----------
function tentang() {
  const html =
    '<h1>Tentang situs ini</h1>' +
    '<p class="lede">Statistik Indonesia adalah portal ringkas data nasional yang dirancang untuk ' +
    'orang yang mencari angka resmi — pelajar, jurnalis, peneliti, pelaku usaha, dan siapa pun yang ' +
    'butuh angka yang bisa dipertanggungjawabkan.</p>' +
    '<section class="card"><h2>Dari mana datanya?</h2>' +
    '<p>Semua angka di situs ini berasal dari publikasi resmi <strong>Badan Pusat Statistik (BPS)</strong>: ' +
    'Berita Resmi Statistik (PDB, IHK, ketenagakerjaan, kemiskinan), Sensus Penduduk 2020, Proyeksi ' +
    'Penduduk 2020–2035, Sakernas, dan Susenas. Setiap angka dicantumkan bersama tahun dan publikasinya.</p>' +
    '<h2>Prinsip kami</h2><ul class="fact-list">' +
    factRow('Satu angka, satu sumber', 'Setiap angka punya sumber dan tahun') +
    factRow('Tidak ada angka karangan', 'Yang ragu tidak ditampilkan') +
    factRow('Dapat diverifikasi', 'Nama publikasi BPS dicantumkan') +
    factRow('Gratis dan tanpa iklan', 'Situs statis, tanpa pelacak') +
    '</ul></section>' +
    '<section class="card"><h2>Daftar publikasi yang dipakai</h2><ul class="fact-list">' +
    factRow('PDB Triwulan IV-2025 & Tahunan 2025', 'BPS, Februari 2026') +
    factRow('PDB Tahunan 2024', 'BPS, Februari 2025') +
    factRow('IHK Desember 2024', 'BPS, Januari 2025') +
    factRow('Keadaan Ketenagakerjaan, Agustus 2025', 'BPS, November 2025') +
    factRow('Keadaan Ketenagakerjaan, November 2025', 'BPS, 2025') +
    factRow('Kemiskinan & Ketimpangan, September 2025', 'BPS, 2025') +
    factRow('Kemiskinan & Ketimpangan, Maret 2025', 'BPS, 2025') +
    factRow('Proyeksi Penduduk 2020–2035', 'BPS') +
    factRow('Indeks Pembangunan Manusia 2024', 'BPS, 2024') +
    '</ul><p style="margin-top:12px">Situs ini bukan situs resmi BPS dan tidak berafiliasi dengan BPS. ' +
    'Untuk data mentah dan tabel lengkap, kunjungi publikasi resmi BPS.</p></section>';

  return { html, mount() {} };
}

export const ROUTES = {
  '/': home,
  '/penduduk': penduduk,
  '/ekonomi': ekonomi,
  '/harga': harga,
  '/kerja': kerja,
  '/kemiskinan': kemiskinan,
  '/daerah': daerah,
  '/tentang': tentang,
};

export function searchIndex(query) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return INDEX.filter((item) =>
    item.label.toLowerCase().includes(q) || item.detail.toLowerCase().includes(q)).slice(0, 7);
}
