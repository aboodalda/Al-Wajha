let data = loadMenuData();
const root = document.getElementById("adminApp");

function esc(v=""){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function imgPreview(v){return v ? `<img src="${v}" class="preview" alt="">` : `<div class="no-image">صورة</div>`;}

function layout(content, active="dashboard"){
  root.innerHTML=`<div class="admin-shell">
    <aside class="sidebar">
      <div class="side-brand"><span>✦</span><div><b>الواجهة البحرية</b><small>MENU CONTROL</small></div></div>
      <button class="${active==='dashboard'?'active':''}" onclick="showDashboard()">⌂ <span>الرئيسية</span></button>
      <button class="${active==='products'?'active':''}" onclick="showProducts()">◈ <span>الأصناف</span></button>
      <button class="${active==='categories'?'active':''}" onclick="showCategories()">▦ <span>الأقسام</span></button>
      <button class="${active==='settings'?'active':''}" onclick="showSettings()">⚙ <span>بيانات المطعم</span></button>
      <button class="${active==='appearance'?'active':''}" onclick="showAppearance()">◐ <span>واجهة المنيو</span></button>
      <div class="side-bottom"><a href="index.html" target="_blank">↗ مشاهدة المنيو</a><button onclick="resetAll()">↺ إعادة البيانات الافتراضية</button></div>
    </aside>
    <section class="main">${content}</section>
  </div>`;
}

function header(title,sub=""){return `<div class="page-head"><div><span>CONTROL PANEL</span><h1>${title}</h1>${sub?`<p>${sub}</p>`:""}</div><a class="view-btn" href="index.html" target="_blank">مشاهدة المنيو ↗</a></div>`}

function showDashboard(){
 data=loadMenuData();
 const visibleP=data.products.filter(x=>x.visible).length;
 layout(header("لوحة التحكم","إدارة كاملة لمنيو المطعم من مكان واحد")+`
 <div class="stats">
  <div><span>الأقسام</span><b>${data.categories.length}</b><small>قسم</small></div>
  <div><span>الأصناف</span><b>${data.products.length}</b><small>صنف</small></div>
  <div><span>الأصناف المتاحة</span><b>${visibleP}</b><small>متاح للزبائن</small></div>
  <div><span>المخفية</span><b>${data.products.length-visibleP}</b><small>غير ظاهرة</small></div>
 </div>
 <div class="dashboard-grid">
   <div class="panel"><div class="panel-title"><h2>إجراءات سريعة</h2></div>
    <div class="quick"><button onclick="showProductForm()">＋ إضافة صنف</button><button onclick="showCategoryForm()">＋ إضافة قسم</button><button onclick="showSettings()">⚙ تعديل بيانات المطعم</button><button onclick="showAppearance()">◐ تخصيص الواجهة</button></div>
   </div>
   <div class="panel"><div class="panel-title"><h2>آخر الأصناف</h2><button onclick="showProducts()">عرض الكل</button></div>
    ${data.products.slice(-5).reverse().map(p=>`<div class="mini-row"><span>${esc(p.name)}</span><b>${p.price} ₪</b></div>`).join("")}
   </div>
 </div>`, "dashboard");
}

function showProducts(){
 data=loadMenuData();
 const rows=data.products.map(p=>{const c=data.categories.find(x=>x.id===p.categoryId);return `<tr><td>${imgPreview(p.image)}</td><td><strong>${esc(p.name)}</strong><small>${esc(p.description)}</small></td><td>${esc(c?.name||"—")}</td><td class="price">${p.price} ₪</td><td><span class="status ${p.visible?'on':'off'}">${p.visible?'متاح':'مخفي'}</span></td><td class="actions"><button onclick="editProduct('${p.id}')">تعديل</button><button onclick="toggleProduct('${p.id}')">${p.visible?'إخفاء':'إظهار'}</button><button class="danger" onclick="deleteProduct('${p.id}')">حذف</button></td></tr>`}).join("");
 layout(header("إدارة الأصناف","إضافة وتعديل وحذف جميع أصناف القائمة")+`<div class="toolbar"><button class="primary" onclick="showProductForm()">＋ إضافة صنف جديد</button></div><div class="table-wrap"><table><thead><tr><th>الصورة</th><th>الصنف</th><th>القسم</th><th>السعر</th><th>الحالة</th><th>الإجراءات</th></tr></thead><tbody>${rows||`<tr><td colspan="6" class="empty">لا توجد أصناف</td></tr>`}</tbody></table></div>`, "products");
}

function productForm(p=null){
 const cats=data.categories;
 layout(header(p?"تعديل الصنف":"إضافة صنف جديد","أدخل بيانات الصنف ثم احفظ التغييرات")+`
 <form class="form panel" onsubmit="saveProduct(event,'${p?.id||""}')">
  <div class="form-grid">
   <label>اسم الصنف<input id="pName" required value="${esc(p?.name||"")}"></label>
   <label>القسم<select id="pCat" required>${cats.map(c=>`<option value="${c.id}" ${p?.categoryId===c.id?'selected':''}>${esc(c.name)}</option>`).join("")}</select></label>
   <label>السعر<input id="pPrice" type="number" min="0" step="0.01" required value="${p?.price??""}"></label>
   <label>شارة <small>(اختياري)</small><input id="pBadge" value="${esc(p?.badge||"")}" placeholder="جديد / الأكثر طلباً"></label>
   <label class="full">الوصف<textarea id="pDesc" rows="4">${esc(p?.description||"")}</textarea></label>
   <label class="full">رابط الصورة <small>(يمكنك رفع الصورة لاحقاً أو وضع رابطها)</small><input id="pImage" value="${esc(p?.image||"")}" placeholder="https://..."></label>
   <label class="check"><input id="pVisible" type="checkbox" ${p?.visible!==false?'checked':''}> إظهار الصنف للزبائن</label>
  </div>
  <div class="form-actions"><button class="primary">حفظ الصنف</button><button type="button" onclick="showProducts()">إلغاء</button></div>
 </form>`, "products");
}

function showProductForm(){data=loadMenuData();productForm()}
function editProduct(id){data=loadMenuData();productForm(data.products.find(p=>p.id===id))}
function saveProduct(e,id){
 e.preventDefault(); data=loadMenuData();
 const obj={id:id||makeId("p"),categoryId:document.getElementById("pCat").value,name:document.getElementById("pName").value.trim(),description:document.getElementById("pDesc").value.trim(),price:Number(document.getElementById("pPrice").value),image:document.getElementById("pImage").value.trim(),badge:document.getElementById("pBadge").value.trim(),visible:document.getElementById("pVisible").checked};
 const i=data.products.findIndex(p=>p.id===obj.id); if(i>-1)data.products[i]=obj;else data.products.push(obj); saveMenuData(data);showProducts();
}
function toggleProduct(id){data=loadMenuData();const p=data.products.find(x=>x.id===id);p.visible=!p.visible;saveMenuData(data);showProducts()}
function deleteProduct(id){if(!confirm("حذف هذا الصنف نهائياً؟"))return;data=loadMenuData();data.products=data.products.filter(x=>x.id!==id);saveMenuData(data);showProducts()}

function showCategories(){
 data=loadMenuData();
 layout(header("إدارة الأقسام","تحكم في أقسام المنيو وترتيبها وحالتها")+`<div class="toolbar"><button class="primary" onclick="showCategoryForm()">＋ إضافة قسم</button></div>
 <div class="category-admin">${[...data.categories].sort((a,b)=>a.order-b.order).map(c=>`<div class="cat-admin">
  <div class="cat-icon">${esc(c.icon||"✦")}</div><div class="cat-details"><b>${esc(c.name)}</b><small>ترتيب: ${c.order} • ${c.visible?'ظاهر':'مخفي'}</small></div>
  <div class="actions"><button onclick="editCategory('${c.id}')">تعديل</button><button onclick="toggleCategory('${c.id}')">${c.visible?'إخفاء':'إظهار'}</button><button class="danger" onclick="deleteCategory('${c.id}')">حذف</button></div>
 </div>`).join("")}</div>`, "categories");
}
function categoryForm(c=null){
 layout(header(c?"تعديل القسم":"إضافة قسم جديد","اسم القسم والأيقونة والصورة التي تظهر للزبائن")+`
 <form class="form panel" onsubmit="saveCategory(event,'${c?.id||""}')"><div class="form-grid">
 <label>اسم القسم<input id="cName" required value="${esc(c?.name||"")}"></label>
 <label>الأيقونة / Emoji<input id="cIcon" value="${esc(c?.icon||"🍽️")}"></label>
 <label>الترتيب<input id="cOrder" type="number" value="${c?.order??(data.categories.length+1)}"></label>
 <label class="full">رابط صورة القسم<input id="cImage" value="${esc(c?.image||"")}" placeholder="https://..."></label>
 <label class="check"><input id="cVisible" type="checkbox" ${c?.visible!==false?'checked':''}> إظهار القسم</label>
 </div><div class="form-actions"><button class="primary">حفظ القسم</button><button type="button" onclick="showCategories()">إلغاء</button></div></form>`, "categories");
}
function showCategoryForm(){data=loadMenuData();categoryForm()}
function editCategory(id){data=loadMenuData();categoryForm(data.categories.find(c=>c.id===id))}
function saveCategory(e,id){e.preventDefault();data=loadMenuData();const o={id:id||makeId("c"),name:document.getElementById("cName").value.trim(),icon:document.getElementById("cIcon").value.trim(),order:Number(document.getElementById("cOrder").value),image:document.getElementById("cImage").value.trim(),visible:document.getElementById("cVisible").checked};const i=data.categories.findIndex(c=>c.id===o.id);if(i>-1)data.categories[i]=o;else data.categories.push(o);saveMenuData(data);showCategories()}
function toggleCategory(id){data=loadMenuData();const c=data.categories.find(x=>x.id===id);c.visible=!c.visible;saveMenuData(data);showCategories()}
function deleteCategory(id){data=loadMenuData();if(data.products.some(p=>p.categoryId===id)){alert("لا يمكن حذف قسم يحتوي على أصناف. انقل الأصناف أولاً.");return}if(!confirm("حذف القسم؟"))return;data.categories=data.categories.filter(x=>x.id!==id);saveMenuData(data);showCategories()}

function showSettings(){
 data=loadMenuData();const s=data.settings;
 layout(header("بيانات المطعم","كل ما تغيره هنا يظهر مباشرة في واجهة الزبون")+`
 <form class="form panel" onsubmit="saveSettings(event)"><div class="form-grid">
 <label>اسم المطعم<input id="sName" value="${esc(s.name)}"></label><label>الاسم بالإنجليزية<input id="sEnglish" value="${esc(s.englishName)}"></label>
 <label class="full">العنوان الرئيسي / الشعار النصي<input id="sTag" value="${esc(s.tagline)}"></label>
 <label class="full">وصف المطعم<textarea id="sDesc" rows="4">${esc(s.description)}</textarea></label>
 <label>رقم الهاتف<input id="sPhone" value="${esc(s.phone)}"></label><label>WhatsApp<input id="sWhats" value="${esc(s.whatsapp)}"></label>
 <label>العنوان<input id="sAddress" value="${esc(s.address)}"></label><label>ساعات العمل<input id="sHours" value="${esc(s.hours)}"></label>
 <label>Instagram<input id="sInsta" value="${esc(s.instagram)}"></label><label>Facebook<input id="sFace" value="${esc(s.facebook)}"></label>
 </div><div class="form-actions"><button class="primary">حفظ البيانات</button></div></form>`, "settings");
}
function saveSettings(e){e.preventDefault();data=loadMenuData();data.settings={...data.settings,name:sName.value.trim(),englishName:sEnglish.value.trim(),tagline:sTag.value.trim(),description:sDesc.value.trim(),phone:sPhone.value.trim(),whatsapp:sWhats.value.trim(),address:sAddress.value.trim(),hours:sHours.value.trim(),instagram:sInsta.value.trim(),facebook:sFace.value.trim()};saveMenuData(data);alert("تم حفظ بيانات المطعم");showDashboard()}

function showAppearance(){
 data=loadMenuData();const s=data.settings;
 layout(header("تخصيص واجهة المنيو","ضع صورة رئيسية وشعار المطعم لتظهر في الصفحة الأولى")+`
 <form class="form panel" onsubmit="saveAppearance(event)"><div class="form-grid">
 <label class="full">رابط صورة الخلفية الرئيسية<input id="aHero" value="${esc(s.heroImage)}" placeholder="https://..."></label>
 <label class="full">رابط شعار المطعم<input id="aLogo" value="${esc(s.logo)}" placeholder="https://..."></label>
 </div>
 <div class="appearance-note"><b>ملاحظة:</b> في هذه النسخة يمكنك استخدام روابط الصور. في المرحلة التالية يمكن ربط المشروع بـ Firebase Storage لرفع الصور مباشرة من لوحة التحكم.</div>
 <div class="form-actions"><button class="primary">حفظ الواجهة</button></div></form>`, "appearance");
}
function saveAppearance(e){e.preventDefault();data=loadMenuData();data.settings.heroImage=document.getElementById("aHero").value.trim();data.settings.logo=document.getElementById("aLogo").value.trim();saveMenuData(data);alert("تم حفظ إعدادات الواجهة");showAppearance()}
function resetAll(){if(confirm("سيتم استبدال بيانات المنيو الحالية بالبيانات التجريبية. هل أنت متأكد؟")){resetMenuData();showDashboard()}}

showDashboard();
window.addEventListener("menuDataChanged",()=>data=loadMenuData());