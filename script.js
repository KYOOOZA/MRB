/* =====================================================================
   script.js — MESIN WEBSITE. Biasanya TIDAK perlu diubah.
   Data produk ada di products.js. Bagian yang boleh diubah ditandai "UBAH:".
   ===================================================================== */
const $ = s => document.querySelector(s);
const FOTO_KOSONG = "data:image/svg+xml;utf8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' text-anchor='middle' fill='#6b7280' font-family='sans-serif' font-size='20'>Foto segera hadir</text></svg>");

/* Setiap produk otomatis diberi ID unik sesuai urutannya (tidak perlu menulis id manual) */
PRODUCTS.forEach((p, i) => { p.id = i; p.desc = p.description || p.desc; p.colors = p.color || p.colors; });

const state = { cat: "", brand: "", size: "", surface: "", q: "", shown: CONFIG.perPage };
const foto = p => p.image ? encodeURI(p.image) : FOTO_KOSONG;
const imgTag = (p, extra = "") => `<img src="${foto(p)}" alt="${p.name}" loading="lazy" ${extra} onerror="this.onerror=null;this.src='${FOTO_KOSONG}'">`;
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
const ukuran = s => s ? s.replace("x", " x ") + (/^\d/.test(s) ? " cm" : "") : "";

/* ---------- Info toko (dari CONFIG) ---------- */
function isiInfoToko() {
  $("#storeName").textContent = CONFIG.storeName.toUpperCase();
  $("#addr").textContent = CONFIG.address;
  $("#phone").textContent = CONFIG.phoneText;
  $("#hours").textContent = CONFIG.hours;
  $("#year").textContent = new Date().getFullYear();
  $("#fab").href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Halo " + CONFIG.storeName + ", saya ingin bertanya seputar produk.")}`;
  $("#mapBtn").href = "https://www.google.com/maps/search/" + encodeURIComponent(CONFIG.storeName + " Pekanbaru");
  // UBAH: dinding motif di hero — otomatis memakai 12 foto keramik pertama
  $("#wall").innerHTML = PRODUCTS.filter(p => p.image && p.category === "Keramik & Granit")
    .filter((p, i, a) => i % Math.max(1, Math.floor(a.length / 12)) === 0).slice(0, 12)
    .map(p => imgTag(p)).join("");
}

/* ---------- Kategori, chip, merek ---------- */
function buatKategoriDanMerek() {
  $("#cats").innerHTML = CONFIG.categories.map(c =>
    `<button class="cat" data-cat="${c.name}"><i>${c.icon}</i><div><b>${c.name}</b><span>${c.desc}</span></div></button>`).join("");
  $("#chips").innerHTML = ["", ...CONFIG.categories.map(c => c.name)].map(n =>
    `<button class="chip" data-cat="${n}">${n || "Semua"}</button>`).join("");
  const jumlah = {};
  PRODUCTS.forEach(p => jumlah[p.brand] = (jumlah[p.brand] || 0) + 1);
  $("#brands").innerHTML = Object.keys(jumlah).sort().map(b =>
    `<button data-brand="${b}">${b} <span>(${jumlah[b]})</span></button>`).join("");
  isiDropdown("#fBrand", "Semua merek", [...new Set(PRODUCTS.map(p => p.brand))].sort());
  isiDropdown("#fSize", "Semua ukuran", [...new Set(PRODUCTS.map(p => p.size).filter(Boolean))], ukuran);
  isiDropdown("#fSurface", "Semua permukaan", [...new Set(PRODUCTS.map(p => p.surface).filter(Boolean))], cap);
}
function isiDropdown(sel, semua, daftar, label = x => x) {
  $(sel).innerHTML = `<option value="">${semua}</option>` + daftar.map(v => `<option value="${v}">${label(v)}</option>`).join("");
}

/* ---------- Filter & tampil produk ---------- */
function cocok(p) {
  const teks = [p.name, p.brand, p.category, p.size, ukuran(p.size), p.surface, p.desc, ...(p.sizes || []), ...(p.colors || [])].join(" ").toLowerCase();
  return (!state.cat || p.category === state.cat) && (!state.brand || p.brand === state.brand) &&
         (!state.size || p.size === state.size) && (!state.surface || p.surface === state.surface) &&
         (!state.q || state.q.toLowerCase().split(/\s+/).every(k => teks.includes(k)));
}
function kartu(p) {
  const spek = [ukuran(p.size), cap(p.surface)].filter(Boolean);
  const tag = spek.length ? spek.map(t => `<span class="tag">${t}</span>`).join("") : `<span class="tag">${p.category}</span>`;
  return `<button class="card" data-id="${p.id}" aria-label="Lihat ${p.name}">${imgTag(p)}<div><small>${p.brand}</small><b>${p.name}</b>${tag}<span class="ok">● Tersedia di toko</span></div></button>`;
}
function tampil() {
  const hasil = PRODUCTS.filter(cocok);
  $("#count").textContent = hasil.length + " produk ditemukan";
  $("#grid").innerHTML = hasil.length ? hasil.slice(0, state.shown).map(kartu).join("")
    : `<p class="empty">Produk tidak ditemukan. Coba kata lain, atau tanya admin lewat WhatsApp.</p>`;
  const sisa = hasil.length - state.shown;
  const moreBtn = $("#more");
  if (sisa <= 0) {
    moreBtn.hidden = true;
    moreBtn.style.display = "none";
  } else {
    moreBtn.hidden = false;
    moreBtn.style.display = "";
    moreBtn.textContent = `Tampilkan lebih banyak (${sisa} lagi)`;
  }
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c.dataset.cat === state.cat));
}
function setFilter(o, lompat) {
  Object.assign(state, { shown: CONFIG.perPage }, o);
  $("#q").value = state.q; $("#fBrand").value = state.brand; $("#fSize").value = state.size; $("#fSurface").value = state.surface;
  tampil();
  if (lompat) $("#produk").scrollIntoView();
}

/* ---------- Popup detail produk ---------- */
function bukaDetail(id) {
  const p = PRODUCTS[id], varian = p.sizes || p.colors;
  const baris = (k, v) => v ? `<tr><td>${k}</td><td>${v}</td></tr>` : "";
  const mirip = PRODUCTS.filter(x => x.id !== id && (x.brand === p.brand || x.category === p.category)).slice(0, 4);
  $("#modalBox").innerHTML = `
    <button class="x" aria-label="Tutup">×</button>
    ${imgTag(p, 'id="bigImg" title="Klik untuk memperbesar"')}
    <div>
      <small>${p.brand} · ${p.category}</small><h3>${p.name}</h3><span class="ok">● Tersedia di toko</span>
      ${p.desc ? `<p style="margin-top:10px">${p.desc}</p>` : ""}
      <table class="spec">${baris("Merek", p.brand)}${baris("Kategori", p.category)}${baris("Ukuran", ukuran(p.size))}${baris("Permukaan", cap(p.surface))}</table>
      ${varian ? `<label>${p.colors ? "Pilih warna" : "Pilih ukuran / tipe"}<select id="varian">${varian.map(v => `<option>${v}</option>`).join("")}</select></label>` : ""}
      <a class="btn wa" id="waBtn" target="_blank" rel="noopener">Tanya stok & harga di WhatsApp</a>
      <p class="note" style="margin-top:12px">Harga dan stok kami konfirmasi lewat WhatsApp agar akurat. Warna di layar bisa sedikit berbeda dari aslinya.</p>
    </div>
    ${mirip.length ? `<div class="similar"><h4>Produk serupa</h4><div class="grid">${mirip.map(kartu).join("")}</div></div>` : ""}`;
  const wa = () => {
    const v = $("#varian") ? ` — ${$("#varian").value}` : "";
    const info = [p.brand, ukuran(p.size)].filter(Boolean).join(", ");
    // UBAH: kalimat pesan WhatsApp otomatis
    $("#waBtn").href = `https://wa.me/${CONFIG.whatsapp}?text=` + encodeURIComponent(`Halo ${CONFIG.storeName}, saya mau tanya stok & harga: *${p.name}* (${info})${v}`);
  };
  wa(); if ($("#varian")) $("#varian").onchange = wa;
  $("#modal").hidden = false; document.body.style.overflow = "hidden";
}
function tutupDetail() { $("#modal").hidden = true; document.body.style.overflow = ""; }

/* ---------- Event ---------- */
document.addEventListener("click", e => {
  const t = e.target;
  if (t.closest(".card")) return bukaDetail(+t.closest(".card").dataset.id);
  if (t.closest(".cat, .chip")) { const b = t.closest(".cat, .chip"); return setFilter({ cat: b.dataset.cat }, !!b.closest("#cats")); }
  if (t.closest("#brands button")) return setFilter({ brand: t.closest("button").dataset.brand, cat: "" }, true);
  if (t.matches(".x") || t.id === "modal") return tutupDetail();
  if (t.id === "bigImg") window.open(t.src, "_blank");
  if (t.closest("nav a")) { $("#menu").classList.remove("open"); $("#burger").setAttribute("aria-expanded", "false"); }
});
document.addEventListener("keydown", e => { if (e.key === "Escape") tutupDetail(); });
$("#burger").onclick = () => { const o = $("#menu").classList.toggle("open"); $("#burger").setAttribute("aria-expanded", o); };
$("#more").onclick = () => {
  const total = PRODUCTS.filter(cocok).length;
  if (state.shown < total) {
    state.shown += CONFIG.perPage;
    tampil();
  }
};
$("#reset").onclick = () => setFilter({ cat: "", brand: "", size: "", surface: "", q: "" });
$("#q").oninput = e => { state.q = e.target.value; state.shown = CONFIG.perPage; tampil(); };
$("#fBrand").onchange = e => setFilter({ brand: e.target.value });
$("#fSize").onchange = e => setFilter({ size: e.target.value });
$("#fSurface").onchange = e => setFilter({ surface: e.target.value });
$("#heroSearch").onsubmit = e => { e.preventDefault(); setFilter({ q: $("#heroInput").value, cat: "", brand: "" }, true); };

/* ---------- Mulai ---------- */
isiInfoToko(); buatKategoriDanMerek(); tampil();