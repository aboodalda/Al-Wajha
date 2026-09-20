/* بيانات المنيو الافتراضية - يمكن تعديلها من لوحة التحكم */
const DEFAULT_DATA = {
  settings: {
    name: "الواجهة البحرية",
    englishName: "AL WAJHA AL BAHRIYA",
    tagline: "تجربة طعام استثنائية على البحر",
    description: "أجواء بحرية راقية، نكهات مختارة بعناية، وتجربة تستحق أن تعاش.",
    phone: "+970 000 000 000",
    whatsapp: "+970000000000",
    address: "الواجهة البحرية — فلسطين",
    hours: "يومياً 10:00 ص — 12:00 م",
    instagram: "#",
    facebook: "#",
    heroImage: "",
    logo: ""
  },
  categories: [
    {id:"c1", name:"المأكولات البحرية", icon:"🐟", image:"", order:1, visible:true},
    {id:"c2", name:"الوجبات الرئيسية", icon:"🍽️", image:"", order:2, visible:true},
    {id:"c3", name:"المقبلات", icon:"🥗", image:"", order:3, visible:true},
    {id:"c4", name:"المشروبات", icon:"🥤", image:"", order:4, visible:true},
    {id:"c5", name:"الحلويات", icon:"🍰", image:"", order:5, visible:true}
  ],
  products: [
    {id:"p1", categoryId:"c1", name:"سمك مشوي على الفحم", description:"سمك طازج متبل بتوابل خاصة ويقدم مع الأرز والسلطة.", price:55, image:"", badge:"اختيار الشيف", visible:true},
    {id:"p2", categoryId:"c1", name:"جمبري بالزبدة والثوم", description:"جمبري طازج مع الزبدة والثوم والأعشاب العطرية.", price:48, image:"", badge:"", visible:true},
    {id:"p3", categoryId:"c2", name:"دجاج مشوي فاخر", description:"صدر دجاج مشوي يقدم مع البطاطا والخضار والصوص الخاص.", price:38, image:"", badge:"", visible:true},
    {id:"p4", categoryId:"c2", name:"ستيك الواجهة البحرية", description:"قطعة لحم طرية مع صوص الشيف والبطاطا المشوية.", price:65, image:"", badge:"الأكثر طلباً", visible:true},
    {id:"p5", categoryId:"c3", name:"طبق مقبلات بحرية", description:"تشكيلة مختارة من المقبلات الطازجة للمشاركة.", price:25, image:"", badge:"", visible:true},
    {id:"p6", categoryId:"c4", name:"موهيتو الواجهة", description:"مشروب منعش بالليمون والنعناع والثلج.", price:18, image:"", badge:"جديد", visible:true},
    {id:"p7", categoryId:"c5", name:"كنافة بحرية", description:"كنافة ذهبية تقدم بطريقة عصرية مع الآيس كريم.", price:22, image:"", badge:"", visible:true}
  ]
};

function cloneDefaultData(){ return JSON.parse(JSON.stringify(DEFAULT_DATA)); }

function loadMenuData(){
  try {
    const raw = localStorage.getItem("alwajhaMenuData");
    if(!raw){
      const d = cloneDefaultData();
      localStorage.setItem("alwajhaMenuData", JSON.stringify(d));
      return d;
    }
    return JSON.parse(raw);
  } catch(e){
    return cloneDefaultData();
  }
}

function saveMenuData(data){
  localStorage.setItem("alwajhaMenuData", JSON.stringify(data));
  window.dispatchEvent(new Event("menuDataChanged"));
}

function makeId(prefix){
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}

function resetMenuData(){
  const d = cloneDefaultData();
  localStorage.setItem("alwajhaMenuData", JSON.stringify(d));
  return d;
}