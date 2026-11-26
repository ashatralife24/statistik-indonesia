// Statistik Indonesia — penggambar grafik kanvas polos (tanpa pustaka).
// Dua jenis grafik: garis (tren tahunan) dan batang horizontal (perbandingan).
// Warna mengikuti palet situs; teks memakai font sistem agar tajam di semua ukuran.

const INK = '#14201d';
const MUTED = '#6b7a73';
const GRID = '#e3dcc8';
const GREEN = '#0c4a42';
const GREEN_MID = '#14705f';
const AMBER = '#e9a319';

function setupCanvas(canvas, cssHeight) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  const height = cssHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function niceCeil(max) {
  if (max <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  for (const s of steps) {
    if (s * pow >= max) return s * pow;
  }
  return 10 * pow;
}

function niceStep(raw) {
  if (raw <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const steps = [1, 2, 2.5, 5, 10];
  for (const s of steps) {
    if (s * pow >= raw) return s * pow;
  }
  return 10 * pow;
}

function formatValue(v, decimals) {
  const d = decimals === undefined ? (Math.abs(v) < 10 ? 2 : 0) : decimals;
  return v.toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });
}

// Label sumbu: buang nol desimal yang tidak perlu ("10,00" -> "10", "2,50" -> "2,5").
function formatTick(v) {
  if (Number.isInteger(v)) return v.toLocaleString('id-ID');
  return v.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// Grafik garis: points = [{label, value}], valueLabel = satuan di sumbu.
export function lineChart(canvas, points, options) {
  const opts = options || {};
  const { ctx, width, height } = setupCanvas(canvas, opts.height || 260);
  const pad = { l: 52, r: 14, t: 16, b: 30 };
  const plotW = width - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;
  const values = points.map((p) => p.value);
  let min = Math.min.apply(null, values);
  let max = Math.max.apply(null, values);
  if (opts.zeroBaseline !== false) min = Math.min(0, min);
  if (max === min) max = min + 1;
  const top = niceCeil(max);
  const bottom = min < 0 ? -niceCeil(Math.abs(min)) : 0;
  const step = niceStep((top - bottom) / 4);
  const y = (v) => pad.t + plotH - ((v - bottom) / (top - bottom)) * plotH;
  const x = (i) => pad.l + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);

  ctx.font = '11px -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let v = bottom; v <= top + step * 0.001; v += step) {
    const vv = Math.round(v * 1e9) / 1e9;
    const yy = y(vv);
    ctx.strokeStyle = GRID;
    ctx.beginPath();
    ctx.moveTo(pad.l, yy);
    ctx.lineTo(width - pad.r, yy);
    ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.fillText(formatTick(vv), pad.l - 8, yy);
  }
  if (bottom < 0) {
    ctx.strokeStyle = '#b9b29a';
    ctx.beginPath();
    ctx.moveTo(pad.l, y(0));
    ctx.lineTo(width - pad.r, y(0));
    ctx.stroke();
  }

  // Garis tren.
  ctx.strokeStyle = opts.color || GREEN_MID;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(x(i), y(p.value));
    else ctx.lineTo(x(i), y(p.value));
  });
  ctx.stroke();

  // Titik + label nilai.
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  points.forEach((p, i) => {
    ctx.fillStyle = opts.color || GREEN_MID;
    ctx.beginPath();
    ctx.arc(x(i), y(p.value), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.font = 'bold 11px -apple-system, "Segoe UI", Roboto, sans-serif';
    // Label nilai di atas titik, kecuali bila terlalu dekat dengan tepi atas:
    // letakkan di bawah titik. Jepit posisi x agar label tidak terpotong tepi.
    let lx = Math.max(x(i), pad.l + 26);
    lx = Math.min(lx, width - pad.r - 26);
    let ly = y(p.value) - 8;
    if (ly < pad.t + 4) ly = y(p.value) + 18;
    ctx.fillText(formatValue(p.value, opts.decimals), lx, ly);
    ctx.font = '11px -apple-system, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = MUTED;
    ctx.textBaseline = 'top';
    ctx.fillText(String(p.label), lx, height - pad.b + 8);
    ctx.textBaseline = 'bottom';
  });
  return { width, height };
}

// Grafik batang horizontal: items = [{label, value}], diurutkan apa adanya.
// Grafik batang horizontal: items = [{label, value}], diurutkan apa adanya.
// Setiap baris: nama di atas batang, nilai di ujung kanan batang.
export function hbarChart(canvas, items, options) {
  const opts = options || {};
  const rowH = opts.rowHeight || 48;
  const height = Math.max(120, items.length * rowH + 30);
  const { ctx, width } = setupCanvas(canvas, height);
  const pad = { l: 10, r: 58, t: 8, b: 8 };
  const max = Math.max.apply(null, items.map((i) => i.value));
  const top = niceCeil(max);
  const barW = width - pad.l - pad.r;
  const barH = 16;

  items.forEach((item, i) => {
    const rowTop = pad.t + i * rowH;
    const barY = rowTop + 20;
    const w = Math.max(2, (item.value / top) * barW);
    ctx.fillStyle = INK;
    ctx.font = '12px -apple-system, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(item.label, pad.l, rowTop + 13);
    ctx.fillStyle = i === 0 && opts.highlightFirst ? AMBER : opts.color || GREEN_MID;
    ctx.beginPath();
    ctx.roundRect(pad.l, barY, w, barH, 5);
    ctx.fill();
    ctx.fillStyle = GREEN;
    ctx.font = 'bold 12px -apple-system, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(formatValue(item.value, opts.decimals), pad.l + w + 8, barY + 13);
  });
  return { width, height };
}

// Grafik batang vertikal sederhana untuk deret tahunan pendek.
export function vbarChart(canvas, points, options) {
  const opts = options || {};
  const { ctx, width, height } = setupCanvas(canvas, opts.height || 240);
  const pad = { l: 48, r: 10, t: 18, b: 28 };
  const plotW = width - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;
  const values = points.map((p) => p.value);
  const max = Math.max.apply(null, values);
  const min = Math.min(0, Math.min.apply(null, values));
  const top = niceCeil(max);
  const bottom = min < 0 ? -niceCeil(Math.abs(min)) : 0;
  const step = niceStep((top - bottom) / 4);
  const y = (v) => pad.t + plotH - ((v - bottom) / (top - bottom)) * plotH;
  const slot = plotW / points.length;
  const barW = Math.min(46, slot * 0.55);

  ctx.font = '11px -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let v = bottom; v <= top + step * 0.001; v += step) {
    const vv = Math.round(v * 1e9) / 1e9;
    const yy = y(vv);
    ctx.strokeStyle = GRID;
    ctx.beginPath();
    ctx.moveTo(pad.l, yy);
    ctx.lineTo(width - pad.r, yy);
    ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.fillText(formatTick(vv), pad.l - 8, yy);
  }

  points.forEach((p, i) => {
    const cx = pad.l + slot * i + slot / 2;
    const y0 = y(Math.max(0, p.value));
    const y1 = y(Math.min(0, p.value));
    ctx.fillStyle = p.value < 0 ? '#a33b2e' : (opts.color || GREEN_MID);
    ctx.beginPath();
    ctx.roundRect(cx - barW / 2, Math.min(y0, y1), barW, Math.abs(y1 - y0) || 2, 4);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.font = 'bold 11px -apple-system, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(formatValue(p.value, opts.decimals), cx, Math.min(y0, y1) - 5);
    ctx.font = '11px -apple-system, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = MUTED;
    ctx.textBaseline = 'top';
    ctx.fillText(String(p.label), cx, height - pad.b + 6);
    ctx.textBaseline = 'bottom';
  });
  return { width, height };
}
