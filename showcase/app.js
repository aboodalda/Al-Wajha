const demoUrl="https://aboodalda.github.io/Al-Wajha/";
const modal=document.getElementById("contactModal");
const selected=document.getElementById("selectedPackage");
const form=document.getElementById("leadForm");
document.querySelectorAll("[data-package]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    selected.textContent=btn.dataset.package;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.getElementById("restaurantName").focus();
  });
});
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
document.querySelector(".modal-close").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
form.addEventListener("submit",e=>{
  e.preventDefault();
  const restaurant=document.getElementById("restaurantName").value.trim();
  const contact=document.getElementById("contactInfo").value.trim();
  const note=document.getElementById("leadNote").value.trim();
  const message=[
    "🌊 أريد منيو رقمية لمطعمي",
    "━━━━━━━━━━━━━━━━",
    "🏛️ اسم المطعم: "+restaurant,
    "📞 التواصل: "+contact,
    "📦 الباقة: "+selected.textContent,
    note?"📝 ملاحظات: "+note:"",
    "━━━━━━━━━━━━━━━━",
    "أريد معرفة السعر والتفاصيل."
  ].filter(Boolean).join("\n");
  const whatsappNumber="970592936150";
  const whatsappUrl="https://wa.me/"+whatsappNumber+"?text="+encodeURIComponent(message);
  const button=form.querySelector("button");
  const old=button.textContent;
  button.textContent="✓ جاري فتح WhatsApp...";
  button.disabled=true;
  window.open(whatsappUrl,"_blank","noopener");
  setTimeout(()=>{button.textContent=old;button.disabled=false;closeModal()},900);
});
