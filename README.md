# الواجهة البحرية — Firebase V2

ارفع الملفات كلها إلى مجلد GitHub Pages نفسه.

- index.html: صفحة الزبائن فقط، بدون أي رابط أو أثر للوحة التحكم.
- admin.html: لوحة الإدارة المنفصلة.
- firebase-config.js: إعدادات Firebase.
- app.js و style.css: المنيو العامة.
- admin.js و admin.css: لوحة الإدارة.

Firestore:
- admin/{UID} مع role = admin
- settings/site
- categories/{id}
- products/{id}

هذه النسخة تستخدم روابط صور مباشرة في حقل imageUrl. لم نفعّل Firebase Storage حتى لا نحتاج تفعيل الفوترة في هذه المرحلة.