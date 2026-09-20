let data = loadMenuData();

const app = document.getElementById("app");

function esc(v=""){
  return String(v).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}
function money(v){ return `${Number(v||0).toLocaleString("ar-EG")} ₪`; }

function render(){
  data = loadMenuData();
  const s = data.settings;
  const cats = [...data.categories].filter(c=>c.visible).sort((a,b)=>a.order-b.order);
  app.innerHTML = `
    <header class="hero" style="${s.heroImage ? `--hero:url('${s.heroImage}')` : ''}">
      <div class="hero-overlay"></div>
      <nav class="topbar">
        <a class="brand" href="#">
          ${s.logo ? `<img src="${s.logo}" alt="${esc(s.name)}">` : `<span class="brand-mark">✦</span>`}
          <span><b>${esc(s.name)}</b><small>${esc(s.englishName)}</small></span>
        </a>
        <a class="admin-link" href="admin.html">لوحة التحكم</a>
      </nav>
      <div class="hero-content">
        <span class="eyebrow">WELCOME TO</span>
        <h1>${esc(s.name)}</h1>
        <p>${esc(s.tagline)}</p>
        <a href="#menu" class="gold-btn">استكشف القائمة <span>↓</span></a>
      </div>
      <div class="scroll-note">مرر لاكتشاف التجربة</div>
    </header>

    <main id="menu">
      <section class="intro section">
        <div class="section-kicker">OUR STORY</div>
        <h2>نكهات تلتقي مع البحر</h2>
        <p>${esc(s.description)}</p>
        <div class="gold-line"></div>
      </section>

      <section class="categories section">
        <div class="section-heading">
          <div><span class="section-kicker">MENU</span><h2>قائمة الطعام</h2></div>
        </div>
        <div class="category-grid">
          ${cats.map(c=>`<button class="category-card" onclick="document.getElementById('cat-${c.id}').scrollIntoView({behavior:'smooth',block:'start'})">
            <div class="cat-img" style="${c.image ? `background-image:url('${c.image}')` : ''}"><span>${esc(c.icon||"✦")}</span></div>
            <strong>${esc(c.name)}</strong><small>اكتشف الأصناف</small>
          </button>`).join("")}
        </div>
      </section>

      <section class="products section">
        ${cats.map(c=>{
          const products = data.products.filter(p=>p.visible && p.categoryId===c.id);
          if(!products.length) return "";
          return `<div class="menu-category" id="cat-${c.id}">
            <div class="category-title"><span>${esc(c.icon||"✦")}</span><div><small>DISCOVER</small><h2>${esc(c.name)}</h2></div></div>
            <div class="product-grid">
              ${products.map(p=>`<article class="product-card">
                <div class="product-image" style="${p.image ? `background-image:url('${p.image}')` : ''}">
                  ${!p.image ? `<div class="placeholder-food">✦</div>` : ""}
                  ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
                </div>
                <div class="product-info">
                  <div class="product-top"><h3>${esc(p.name)}</h3><span>${money(p.price)}</span></div>
                  <p>${esc(p.description)}</p>
                </div>
              </article>`).join("")}
            </div>
          </div>`;
        }).join("")}
      </section>
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <div><span class="footer-logo">✦</span><h2>${esc(s.name)}</h2><p>${esc(s.tagline)}</p></div>
        <div><b>تواصل معنا</b><a href="tel:${esc(s.phone)}">${esc(s.phone)}</a><a href="${s.whatsapp ? `https://wa.me/${String(s.whatsapp).replace(/\\D/g,'')}` : '#'}">WhatsApp</a></div>
        <div><b>الموقع</b><p>${esc(s.address)}</p><p>${esc(s.hours)}</p></div>
      </div>
      <div class="copyright">© ${new Date().getFullYear()} ${esc(s.name)} — جميع الحقوق محفوظة</div>
    </footer>`;
}

render();
window.addEventListener("menuDataChanged", render);