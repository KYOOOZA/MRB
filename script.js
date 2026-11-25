/* =====================================================================
   script.js — MESIN WEBSITE MITRA RIAU BANGUNAN (VERSI BERSIH)
   ===================================================================== */
const $ = s => document.querySelector(s);

const FOTO_KOSONG = "data:image/svg+xml;utf8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>" +
  "<rect width='100%' height='100%' fill='#e5e7eb'/>" +
  "<text x='50%' y='50%' text-anchor='middle' fill='#6b7280' font-family='sans-serif' font-size='20'>Foto segera hadir</text>" +
  "</svg>"
);

/* Beri ID otomatis sesuai urutan array PRODUCTS agar selalu sinkron */
PRODUCTS.forEach((p, i) => {
  p.id = i;
  p.brand = p.brand ? p.brand.trim().toUpperCase() : "";
  p.desc = p.description || p.desc || "";
  p.colors = p.color || p.colors || null;
});

const state = {
  cat: "",
  brand: "",
  size: "",
  surface: "",
  q: "",
  shown: CONFIG.perPage
};

const foto = p => (p.image ? encodeURI(p.image) : FOTO_KOSONG);
const imgTag = (p, extra = "") =>
  `<img src="${foto(p)}" alt="${p.name}" loading="lazy" ${extra} onerror="this.onerror=null;this.src='${FOTO_KOSONG}'">`;
const cap = s => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const ukuran = s => (s ? s.replace("x", " x ") + (/^\d/.test(s) ? " cm" : "") : "");

/* ---------- 1. Info Toko & Pembersihan Background ---------- */
function isiInfoToko() {
  if ($("#storeName")) $("#storeName").textContent = CONFIG.storeName.toUpperCase();
  if ($("#addr")) $("#addr").textContent = CONFIG.address;
  if ($("#phone")) $("#phone").textContent = CONFIG.phoneText;
  if ($("#hours")) $("#hours").innerHTML = CONFIG.hours;
  if ($("#year")) $("#year").textContent = new Date().getFullYear();

  if ($("#fab")) {
    $("#fab").href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
      "Halo " + CONFIG.storeName + ", saya ingin bertanya seputar produk."
    )}`;
  }

  if ($("#mapBtn")) {
    $("#mapBtn").href =
      "https://www.google.com/maps/search/" +
      encodeURIComponent(CONFIG.storeName + " Pekanbaru");
  }

  // Kosongkan & sembunyikan elemen #wall agar gambar motif tidak bocor ke background halaman
  // Dinding motif 12 kotak yang otomatis berubah-ubah tiap 3 detik
  // Dinding motif 12 kotak campuran dari SEMUA kategori produk
// Dinding motif 12 kotak yang otomatis berubah-ubah tiap 3 detik
  const wall = $("#wall");
  if (wall) {
    wall.style.display = "";
    const keramik = PRODUCTS.filter(p => p.image && p.category === "Keramik & Granit");

    const gantiWall = () => {
      if (!keramik.length) return;
      // Acak urutan gambar dan ambil 12 produk
      const acak = [...keramik].sort(() => Math.random() - 0.5).slice(0, 12);
      wall.style.opacity = "0.2";
      setTimeout(() => {
        wall.innerHTML = acak.map(p => imgTag(p)).join("");
        wall.style.opacity = "1";
      }, 250);
    };

    gantiWall(); // Tampilkan pertama kali
    setInterval(gantiWall, 3500); // Ganti otomatis setiap 3,5 detik (3500 ms)
  }
}

/* ---------- 2. Kategori, Chip Filter & Daftar Merek ---------- */
function isiDropdown(sel, semua, daftar, label = x => x) {
  const el = $(sel);
  if (!el) return;
  el.innerHTML =
    `<option value="">${semua}</option>` +
    daftar.map(v => `<option value="${v}">${label(v)}</option>`).join("");
}

function buatKategoriDanMerek() {
  if ($("#cats")) {
    $("#cats").innerHTML = CONFIG.categories
      .map(
        c =>
          `<button class="cat" data-cat="${c.name}"><i>${c.icon}</i><div><b>${c.name}</b><span>${c.desc}</span></div></button>`
      )
      .join("");
  }

  if ($("#chips")) {
    $("#chips").innerHTML = ["", ...CONFIG.categories.map(c => c.name)]
      .map(n => `<button class="chip" data-cat="${n}">${n || "Semua"}</button>`)
      .join("");
  }

  const jumlah = {};
  PRODUCTS.forEach(p => {
    if (p.brand) jumlah[p.brand] = (jumlah[p.brand] || 0) + 1;
  });

  if ($("#brands")) {
    $("#brands").innerHTML = Object.keys(jumlah)
      .sort()
      .map(b => `<button data-brand="${b}">${b} <span>(${jumlah[b]})</span></button>`)
      .join("");
  }

  isiDropdown(
    "#fBrand",
    "Semua merek",
    [...new Set(PRODUCTS.map(p => p.brand).filter(Boolean))].sort()
  );
  isiDropdown(
    "#fSize",
    "Semua ukuran",
    [...new Set(PRODUCTS.map(p => p.size).filter(Boolean))],
    ukuran
  );
  isiDropdown(
    "#fSurface",
    "Semua permukaan",
    [...new Set(PRODUCTS.map(p => p.surface).filter(Boolean))],
    cap
  );
}

/* ---------- 3. Filter & Tampilan Grid Produk ---------- */
function cocok(p) {
  const teks = [
    p.name,
    p.brand,
    p.category,
    p.size,
    ukuran(p.size),
    p.surface,
    p.desc,
    ...(p.sizes || []),
    ...(p.colors || [])
  ]
    .join(" ")
    .toLowerCase();

  return (
    (!state.cat || p.category === state.cat) &&
    (!state.brand || p.brand === state.brand) &&
    (!state.size || p.size === state.size) &&
    (!state.surface || p.surface === state.surface) &&
    (!state.q || state.q.toLowerCase().split(/\s+/).every(k => teks.includes(k)))
  );
}

function kartu(p) {
  const spek = [ukuran(p.size), cap(p.surface)].filter(Boolean);
  const tag = spek.length
    ? spek.map(t => `<span class="tag">${t}</span>`).join("")
    : `<span class="tag">${p.category}</span>`;

  return `
    <button class="card" data-id="${p.id}" aria-label="Lihat ${p.name}">
      ${imgTag(p)}
      <div>
        <small>${p.brand}</small>
        <b>${p.name}</b>
        ${tag}
        <span class="ok">● Tersedia di toko</span>
      </div>
    </button>`;
}

function tampil() {
  const hasil = PRODUCTS.filter(cocok);
  if ($("#count")) $("#count").textContent = hasil.length + " produk ditemukan";

  if ($("#grid")) {
    $("#grid").innerHTML = hasil.length
      ? hasil.slice(0, state.shown).map(kartu).join("")
      : `<p class="empty">Produk tidak ditemukan. Coba kata lain, atau tanya admin lewat WhatsApp.</p>`;
  }

  const sisa = hasil.length - state.shown;
  const moreBtn = $("#more");
  if (moreBtn) {
    if (sisa <= 0) {
      moreBtn.hidden = true;
      moreBtn.style.display = "none";
    } else {
      moreBtn.hidden = false;
      moreBtn.style.display = "";
      moreBtn.textContent = `Tampilkan lebih banyak (${sisa} lagi)`;
    }
  }

  document
    .querySelectorAll(".chip")
    .forEach(c => c.classList.toggle("on", c.dataset.cat === state.cat));
}

function setFilter(o, lompat) {
  Object.assign(state, { shown: CONFIG.perPage }, o);
  if ($("#q")) $("#q").value = state.q;
  if ($("#fBrand")) $("#fBrand").value = state.brand;
  if ($("#fSize")) $("#fSize").value = state.size;
  if ($("#fSurface")) $("#fSurface").value = state.surface;
  tampil();
  if (lompat && $("#produk")) $("#produk").scrollIntoView({ behavior: "smooth" });
}

/* ---------- 4. Popup Detail Produk ---------- */
function bukaDetail(id) {
  const p = PRODUCTS[id];
  if (!p) return;

  const varian = p.sizes || p.colors;
  const baris = (k, v) => (v ? `<tr><td>${k}</td><td>${v}</td></tr>` : "");
  const mirip = PRODUCTS.filter(
    x => x.id !== id && (x.brand === p.brand || x.category === p.category)
  ).slice(0, 4);

  $("#modalBox").innerHTML = `
    <button class="x" aria-label="Tutup">×</button>
    ${imgTag(p, 'id="bigImg" title="Klik untuk memperbesar"')}
    <div>
      <small>${p.brand} · ${p.category}</small>
      <h3>${p.name}</h3>
      <span class="ok">● Tersedia di toko</span>
      ${p.desc ? `<p style="margin-top:10px">${p.desc}</p>` : ""}
      <table class="spec">
        ${baris("Merek", p.brand)}
        ${baris("Kategori", p.category)}
        ${baris("Ukuran", ukuran(p.size))}
        ${baris("Permukaan", cap(p.surface))}
      </table>
      ${
        varian
          ? `<label>${p.colors ? "Pilih warna" : "Pilih ukuran / tipe"}<select id="varian">${varian
              .map(v => `<option>${v}</option>`)
              .join("")}</select></label>`
          : ""
      }
      <a class="btn wa" id="waBtn" target="_blank" rel="noopener">Tanya stok & harga di WhatsApp</a>
      <p class="note" style="margin-top:12px">Harga dan stok kami konfirmasi lewat WhatsApp agar akurat. Warna di layar bisa sedikit berbeda dari aslinya.</p>
    </div>
    ${
      mirip.length
        ? `<div class="similar"><h4>Produk serupa</h4><div class="grid">${mirip
            .map(kartu)
            .join("")}</div></div>`
        : ""
    }`;

  const wa = () => {
    const v = $("#varian") ? ` — ${$("#varian").value}` : "";
    const info = [p.brand, ukuran(p.size)].filter(Boolean).join(", ");
    $("#waBtn").href =
      `https://wa.me/${CONFIG.whatsapp}?text=` +
      encodeURIComponent(
        `Halo ${CONFIG.storeName}, saya mau tanya stok & harga: *${p.name}* (${info})${v}`
      );
  };

  wa();
  if ($("#varian")) $("#varian").onchange = wa;
  $("#modal").hidden = false;
  document.body.style.overflow = "hidden";
}

function tutupDetail() {
  if ($("#modal")) $("#modal").hidden = true;
  document.body.style.overflow = "";
}

/* ---------- 5. Event Listener ---------- */
document.addEventListener("click", e => {
  const t = e.target;
  if (t.closest(".card")) return bukaDetail(+t.closest(".card").dataset.id);
  if (t.closest(".cat, .chip")) {
    const b = t.closest(".cat, .chip");
    return setFilter({ cat: b.dataset.cat }, !!b.closest("#cats"));
  }
  if (t.closest("#brands button")) {
    return setFilter({ brand: t.closest("button").dataset.brand, cat: "" }, true);
  }
  if (t.matches(".x") || t.id === "modal") return tutupDetail();
  if (t.id === "bigImg") window.open(t.src, "_blank");
  if (t.closest("nav a")) {
    if ($("#menu")) $("#menu").classList.remove("open");
    if ($("#burger")) $("#burger").setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") tutupDetail();
});

if ($("#burger")) {
  $("#burger").onclick = () => {
    const o = $("#menu").classList.toggle("open");
    $("#burger").setAttribute("aria-expanded", o);
  };
}

if ($("#more")) {
  $("#more").onclick = () => {
    const total = PRODUCTS.filter(cocok).length;
    if (state.shown < total) {
      state.shown += CONFIG.perPage;
      tampil();
    }
  };
}

if ($("#reset")) {
  $("#reset").onclick = () =>
    setFilter({ cat: "", brand: "", size: "", surface: "", q: "" });
}
if ($("#q")) {
  $("#q").oninput = e => {
    state.q = e.target.value;
    state.shown = CONFIG.perPage;
    tampil();
  };
}
if ($("#fBrand")) $("#fBrand").onchange = e => setFilter({ brand: e.target.value });
if ($("#fSize")) $("#fSize").onchange = e => setFilter({ size: e.target.value });
if ($("#fSurface")) $("#fSurface").onchange = e => setFilter({ surface: e.target.value });
if ($("#heroSearch")) {
  $("#heroSearch").onsubmit = e => {
    e.preventDefault();
    setFilter({ q: $("#heroInput").value, cat: "", brand: "" }, true);
  };
}

/* ---------- Jalankan Website ---------- */
isiInfoToko();
buatKategoriDanMerek();
tampil();