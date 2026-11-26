// Statistik Indonesia — seluruh angka di file ini berasal dari publikasi resmi
// Badan Pusat Statistik (BPS). Setiap angka dicantumkan bersama tahun dan
// sumbernya; angka yang tidak bisa diverifikasi tidak ditampilkan di situs ini.
// Nilai dibulatkan seperti yang dipublikasikan BPS. Satuan ditulis eksplisit.

export const SOURCES = {
  bps: 'BPS',
  sensus: 'BPS, Sensus Penduduk 2020',
  proyeksi: 'BPS, Proyeksi Penduduk Indonesia 2020–2035',
  pdb: 'BPS, Berita Resmi Statistik PDB',
  ihk: 'BPS, Berita Resmi Statistik IHK',
  sakernas: 'BPS, Sakernas (Survei Angkatan Kerja Nasional)',
  susenas: 'BPS, Susenas (Survei Sosial Ekonomi Nasional)',
};

export const DATA = {
  penduduk: {
    title: 'Penduduk',
    updated: '2024',
    // Pertengahan tahun, juta jiwa. 2020 = hasil Sensus Penduduk 2020.
    series: [
      { year: 2020, value: 270.2, note: 'Sensus Penduduk 2020' },
      { year: 2021, value: 272.25 },
      { year: 2022, value: 275.77 },
      { year: 2023, value: 278.69 },
      { year: 2024, value: 281.6 },
    ],
    latest: { value: 281.6, unit: 'juta jiwa', year: 2024, source: SOURCES.proyeksi },
    growth2024: { value: 1.04, unit: '% per tahun', year: 2024, source: SOURCES.proyeksi },
    projection2025: { value: 284.44, unit: 'juta jiwa', year: 2025, source: SOURCES.proyeksi },
    // Delapan provinsi terbesar, pertengahan 2024, juta jiwa.
    provinces: [
      { name: 'Jawa Barat', value: 50.35 },
      { name: 'Jawa Timur', value: 41.81 },
      { name: 'Jawa Tengah', value: 37.89 },
      { name: 'Sumatera Utara', value: 15.59 },
      { name: 'Banten', value: 12.43 },
      { name: 'DKI Jakarta', value: 10.56 },
      { name: 'Sulawesi Selatan', value: 9.2 },
      { name: 'Lampung', value: 9.01 },
    ],
    provinceSource: 'BPS, Jumlah Penduduk menurut Provinsi, 2024',
    facts: [
      { label: 'Hasil Sensus Penduduk 2020', value: '270,20 juta jiwa', source: SOURCES.sensus },
      { label: 'Laju pertumbuhan penduduk', value: '1,04% (2024)', source: SOURCES.proyeksi },
      { label: 'Proyeksi 2025', value: '284,44 juta jiwa', source: SOURCES.proyeksi },
    ],
  },

  ekonomi: {
    title: 'Ekonomi',
    updated: '2025',
    // Pertumbuhan PDB, persen (c-to-c).
    growth: [
      { year: 2020, value: -2.07 },
      { year: 2021, value: 3.7 },
      { year: 2022, value: 5.31 },
      { year: 2023, value: 5.05 },
      { year: 2024, value: 5.03 },
      { year: 2025, value: 5.11 },
    ],
    // PDB atas dasar harga berlaku, Rp triliun.
    nominal: [
      { year: 2020, value: 15434.2 },
      { year: 2021, value: 16976.7 },
      { year: 2022, value: 19588.4 },
      { year: 2023, value: 20892.4 },
      { year: 2024, value: 22139.0 },
      { year: 2025, value: 23821.1 },
    ],
    perCapita: [
      { year: 2024, value: 78.62, unit: 'Rp juta', usd: 4960.33 },
      { year: 2025, value: 83.7, unit: 'Rp juta', usd: 5083.4 },
    ],
    // Pangsa terhadap PDB menurut lapangan usaha, Triwulan IV-2025, persen.
    sectors: [
      { name: 'Industri pengolahan', value: 19.2 },
      { name: 'Perdagangan', value: 13.24 },
      { name: 'Pertanian, kehutanan, dan perikanan', value: 11.56 },
      { name: 'Konstruksi', value: 10.16 },
      { name: 'Pertambangan dan penggalian', value: 8.93 },
    ],
    sectorSource: 'BPS, PDB Triwulan IV-2025',
    source: SOURCES.pdb,
  },

  harga: {
    title: 'Harga',
    updated: 'Desember 2024',
    // Inflasi year-on-year Desember, persen.
    inflation: [
      { year: 2020, value: 1.68 },
      { year: 2021, value: 1.87 },
      { year: 2022, value: 5.51 },
      { year: 2023, value: 2.61 },
      { year: 2024, value: 1.57 },
    ],
    cpiDec2024: { value: 106.8, base: '2022=100', year: 2024, source: SOURCES.ihk },
    cpiDec2023: { value: 105.15, base: '2022=100', year: 2023, source: SOURCES.ihk },
    coreDec2024: { value: 2.26, unit: '% yoy', year: 2024, source: SOURCES.ihk },
    foodDec2024: { value: 1.9, unit: '% yoy', year: 2024, source: SOURCES.ihk },
    target: 'Sasaran inflasi Bank Indonesia: 2,5% ± 1%',
    deflationNote: {
      label: 'Deflasi tahunan Februari 2025',
      value: '−0,09% (yoy)',
      detail: 'Deflasi tahunan pertama dalam 25 tahun terakhir.',
      source: 'BPS, 2025',
    },
    source: SOURCES.ihk,
  },

  kerja: {
    title: 'Ketenagakerjaan',
    updated: 'November 2025',
    // Tingkat Pengangguran Terbuka, Agustus, persen.
    tpt: [
      { year: 2021, value: 6.49 },
      { year: 2022, value: 5.86 },
      { year: 2023, value: 5.32 },
      { year: 2024, value: 4.91 },
      { year: 2025, value: 4.85 },
    ],
    nov2025: {
      bekerja: 147.91,
      angkatanKerja: 155.27,
      penganggur: 7.35,
      tpt: 4.74,
      tpak: 70.95,
      penuhWaktu: 67.94,
      paruhWaktu: 24.24,
      setengahPenganggur: 7.81,
      source: 'BPS, Keadaan Ketenagakerjaan Indonesia, November 2025',
    },
    aug2025: {
      penganggur: 7.46,
      informal: 57.8,
      informalJuta: 84.58,
      upahRata: 3.33,
      penuhWaktu: 67.32,
      paruhWaktu: 24.77,
      setengahPenganggur: 7.91,
      source: 'BPS, Keadaan Ketenagakerjaan Indonesia, Agustus 2025',
    },
    topSectorsShare: { value: 60.52, detail: 'Pertanian, perdagangan, dan industri pengolahan', year: 2025, source: 'BPS, November 2025' },
    source: SOURCES.sakernas,
  },

  kemiskinan: {
    title: 'Kemiskinan & Kesejahteraan',
    updated: 'September 2025',
    // Tingkat kemiskinan, Maret, persen.
    poverty: [
      { year: 2021, value: 10.14 },
      { year: 2022, value: 9.54 },
      { year: 2023, value: 9.36 },
      { year: 2024, value: 9.03 },
      { year: 2025, value: 8.47 },
    ],
    sep2025: { rate: 8.25, people: 23.36, source: 'BPS, September 2025' },
    mar2025: { rate: 8.47, people: 23.85, povertyLine: 609160, source: 'BPS, Maret 2025' },
    sep2024: { rate: 8.57, people: 24.06, source: 'BPS, September 2024' },
    povertyLineSep2025: { value: 641443, unit: 'Rp per kapita per bulan', source: 'BPS, September 2025' },
    gini: [
      { label: 'Maret 2024', value: 0.379 },
      { label: 'September 2024', value: 0.381 },
      { label: 'Maret 2025', value: 0.375 },
      { label: 'September 2025', value: 0.363 },
    ],
    extreme: [
      { label: 'Maret 2024', value: 1.26 },
      { label: 'Maret 2025', value: 0.85, people: 2.38 },
    ],
    source: SOURCES.susenas,
  },

  ipm: {
    title: 'Indeks Pembangunan Manusia',
    series: [
      { year: 2023, value: 74.39 },
      { year: 2024, value: 75.02 },
    ],
    source: 'BPS, Indeks Pembangunan Manusia 2024',
  },
};

// Indikator untuk kotak pencarian di header.
export const INDEX = [
  { label: 'Jumlah penduduk Indonesia', route: '#/penduduk', detail: '281,6 juta jiwa (2024)' },
  { label: 'Pertumbuhan penduduk', route: '#/penduduk', detail: '1,04% (2024)' },
  { label: 'Provinsi penduduk terbanyak', route: '#/daerah', detail: 'Jawa Barat, 50,35 juta (2024)' },
  { label: 'Pertumbuhan ekonomi (PDB)', route: '#/ekonomi', detail: '5,11% (2025)' },
  { label: 'PDB Indonesia', route: '#/ekonomi', detail: 'Rp23.821,1 triliun (2025)' },
  { label: 'PDB per kapita', route: '#/ekonomi', detail: 'Rp83,7 juta (2025)' },
  { label: 'Sektor ekonomi terbesar', route: '#/ekonomi', detail: 'Industri pengolahan 19,20% (Q4-2025)' },
  { label: 'Inflasi', route: '#/harga', detail: '1,57% yoy (Desember 2024)' },
  { label: 'Indeks Harga Konsumen (IHK)', route: '#/harga', detail: '106,80 (Desember 2024)' },
  { label: 'Inflasi inti', route: '#/harga', detail: '2,26% yoy (Desember 2024)' },
  { label: 'Tingkat pengangguran terbuka', route: '#/kerja', detail: '4,74% (November 2025)' },
  { label: 'Angkatan kerja', route: '#/kerja', detail: '155,27 juta (November 2025)' },
  { label: 'Upah rata-rata pekerja', route: '#/kerja', detail: 'Rp3,33 juta per bulan (Agustus 2025)' },
  { label: 'Tingkat kemiskinan', route: '#/kemiskinan', detail: '8,25% (September 2025)' },
  { label: 'Garis kemiskinan', route: '#/kemiskinan', detail: 'Rp641.443 per kapita (September 2025)' },
  { label: 'Gini ratio', route: '#/kemiskinan', detail: '0,363 (September 2025)' },
  { label: 'Kemiskinan ekstrem', route: '#/kemiskinan', detail: '0,85% (Maret 2025)' },
  { label: 'Indeks Pembangunan Manusia', route: '#/', detail: '75,02 (2024)' },
];
