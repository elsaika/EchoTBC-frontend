/*
  Stepper TBCheck — indikator langkah yang dipakai di semua layar + Konfigurasi Pusat API.
  Cara pakai di tiap HTML:
    <div id="tb-stepper" data-step="1"></div>   <- ganti angka sesuai layar
    <script src="stepper.js"></script>
  Angka data-step: 1=Persetujuan, 2=Data Klinis, 3=Rekam, 4=Proses, 5=Hasil
*/

// =====================================================================
// 🚀 KONFIGURASI PUSAT API BACKEND (HUGGING FACE)
// =====================================================================
// Tempel Direct URL dari Hugging Face kamu di sini (tanpa tanda garis miring '/' di ujungnya)
window.API_BASE_URL = "https://devyana-echotbc-backend.hf.space";

(function () {
  const STEPS = [
    { label: "Persetujuan", icon: "verified_user" },
    { label: "Data Klinis", icon: "assignment" },
    { label: "Rekam Batuk", icon: "mic" },
    { label: "Proses", icon: "query_stats" },
    { label: "Hasil", icon: "analytics" },
  ];

  function buildStepper() {
    const host = document.getElementById("tb-stepper");
    if (!host) return;
    const current = parseInt(host.getAttribute("data-step") || "1", 10);

    // ---------- Sidebar VERTIKAL (desktop) ----------
    let vert =
      '<nav class="tb-stepper-vertical" aria-label="Langkah skrining">' +
      '<div class="tb-stepper-head">' +
      '<div class="tb-stepper-brand"><span class="material-symbols-outlined">medical_services</span> EchoTBC </div>' +
      '<div class="tb-stepper-sub">Dengar, Kenali, Cegah</div>' +
      '</div><ol class="tb-stepper-list">';

    STEPS.forEach((s, i) => {
      const n = i + 1;
      const state = n < current ? "done" : n === current ? "active" : "todo";
      const inner =
        state === "done"
          ? '<span class="material-symbols-outlined">check</span>'
          : n;
      vert +=
        '<li class="tb-step tb-step-' +
        state +
        '" aria-current="' +
        (state === "active" ? "step" : "false") +
        '">' +
        '<span class="tb-step-circle">' +
        inner +
        "</span>" +
        '<span class="tb-step-label">' +
        s.label +
        "</span>" +
        "</li>";
    });
    vert += "</ol></nav>";

    // ---------- Bar HORIZONTAL (mobile) ----------
    let horiz =
      '<div class="tb-stepper-horizontal" aria-label="Langkah skrining">';
    STEPS.forEach((s, i) => {
      const n = i + 1;
      const state = n < current ? "done" : n === current ? "active" : "todo";
      const inner =
        state === "done"
          ? '<span class="material-symbols-outlined">check</span>'
          : n;
      horiz +=
        '<div class="tb-hstep tb-step-' +
        state +
        '">' +
        '<span class="tb-step-circle">' +
        inner +
        "</span>" +
        '<span class="tb-hstep-label">' +
        s.label +
        "</span>" +
        "</div>";
      if (n < STEPS.length) horiz += '<span class="tb-hstep-line"></span>';
    });
    horiz += "</div>";

    host.innerHTML = vert + horiz;
  }

  // CSS disuntikkan sekali
  function injectCSS() {
    if (document.getElementById("tb-stepper-css")) return;
    const css = document.createElement("style");
    css.id = "tb-stepper-css";
    css.textContent = `
      :root { --tb-primary:#00629d; --tb-done:#0f8a6a; --tb-muted:#9aa3ad; }
      /* ---- VERTICAL (desktop) ---- */
      .tb-stepper-vertical{
        display:none; flex-direction:column; gap:.5rem;
        width:16rem; position:fixed; left:0; top:0; bottom:0; padding:1.25rem 1rem;
        background:linear-gradient(180deg,#dae9fb 0%,#eff5ff 100%);
        border-right:1px solid rgba(0,98,157,.12); z-index:40;
      }
      @media (min-width:1024px){ .tb-stepper-vertical{ display:flex; } }
      .tb-stepper-head{ padding:.25rem .5rem 1rem; }
      .tb-stepper-brand{ display:flex; align-items:center; gap:.5rem; font-size:1.25rem; font-weight:700; color:var(--tb-primary); }
      .tb-stepper-brand .material-symbols-outlined{ font-size:1.5rem; }
      .tb-stepper-sub{ font-size:.7rem; letter-spacing:.08em; text-transform:uppercase; color:#5f6b76; margin-top:.4rem; }
      .tb-stepper-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:.4rem; }
      .tb-step{ display:flex; align-items:center; gap:.75rem; padding:.7rem .8rem; border-radius:.85rem; transition:all .2s; }
      .tb-step-circle{ width:1.9rem; height:1.9rem; border-radius:50%; display:flex; align-items:center; justify-content:center;
        font-size:.85rem; font-weight:700; flex-shrink:0; border:2px solid transparent; }
      .tb-step-circle .material-symbols-outlined{ font-size:1.1rem; }
      .tb-step-label{ font-size:.9rem; font-weight:500; }
      /* selesai */
      .tb-step-done .tb-step-circle{ background:var(--tb-done); color:#fff; }
      .tb-step-done .tb-step-label{ color:#3a4750; }
      /* aktif */
      .tb-step-active{ background:var(--tb-primary); box-shadow:0 4px 14px rgba(0,98,157,.25); }
      .tb-step-active .tb-step-circle{ background:#fff; color:var(--tb-primary); }
      .tb-step-active .tb-step-label{ color:#fff; font-weight:700; }
      /* belum */
      .tb-step-todo .tb-step-circle{ background:transparent; color:var(--tb-muted); border-color:#c4ccd4; }
      .tb-step-todo .tb-step-label{ color:var(--tb-muted); }
      /* ---- HORIZONTAL (mobile) ---- */
      .tb-stepper-horizontal{
        display:flex; align-items:center; justify-content:space-between;
        gap:.25rem; padding:1rem .9rem; background:#eff5ff;
        border-bottom:1px solid rgba(0,98,157,.12);
        position:sticky; top:0; z-index:40;
      }
      @media (min-width:1024px){ .tb-stepper-horizontal{ display:none; } }
      .tb-hstep{ display:flex; flex-direction:column; align-items:center; gap:.25rem; flex-shrink:0; }
      .tb-hstep .tb-step-circle{ width:1.7rem; height:1.7rem; font-size:.8rem; }
      .tb-hstep-label{ font-size:.62rem; font-weight:500; text-align:center; max-width:3.4rem; line-height:1.1; }
      .tb-hstep-line{ flex:1; height:2px; background:#c4ccd4; margin:0 .1rem; margin-bottom:.9rem; }
      .tb-hstep.tb-step-done .tb-step-circle{ background:var(--tb-done); color:#fff; }
      .tb-hstep.tb-step-active .tb-step-circle{ background:var(--tb-primary); color:#fff; box-shadow:0 0 0 3px rgba(0,98,157,.18); }
      .tb-hstep.tb-step-todo .tb-step-circle{ background:#fff; color:var(--tb-muted); border:2px solid #c4ccd4; }
      .tb-hstep-label{ color:#5f6b76; }
      .tb-hstep.tb-step-todo .tb-hstep-label{ color:var(--tb-muted); }
      .tb-hstep.tb-step-active .tb-hstep-label{ color:var(--tb-primary); font-weight:700; }
    `;
    document.head.appendChild(css);
  }

  document.addEventListener("DOMContentLoaded", () => {
    injectCSS();
    buildStepper();
  });
})();
