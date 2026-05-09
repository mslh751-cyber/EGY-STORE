# ⚡ مرجع سريع - EGY STORE

## 🚀 البدء السريع

```bash
# الخطوة 1: افتح المجلد
cd c:\Users\mhame\Downloads\sistem

# الخطوة 2: شغّل الخادم
npm run dev

# الخطوة 3: افتح المتصفح
http://localhost:3000/index.html
```

---

## 📝 بيانات الاختبار

| الحقل | القيمة |
|------|--------|
| البريد | ahmed@example.com |
| كلمة المرور | pass123 |

---

## 🔗 روابط API المهمة

| الرابط | النوع | الوصف |
|--------|-------|-------|
| `/api/health` | GET | التحقق من الخادم |
| `/api/login` | POST | تسجيل الدخول |
| `/api/register` | POST | إنشاء حساب |
| `/api/users?email=X` | GET | بيانات المستخدم |
| `/api/pending-count` | GET | عدد الحسابات المعلقة |

---

## 📋 هيكل الطلب (Request)

### تسجيل الدخول

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### التسجيل

```json
{
  "name": "اسم المستخدم",
  "email": "user@example.com",
  "phone": "01012345678",
  "password": "password"
}
```

---

## 📊 أكواد الرد (Response Codes)

| الكود | المعنى | الحل |
|------|--------|------|
| 200 | نجح ✅ | لا توجد مشكلة |
| 201 | تم الإنشاء ✅ | تم إنشاء الحساب بنجاح |
| 400 | طلب خاطئ | تحقق من المدخلات |
| 401 | غير مصرح | البيانات المرور خاطئة |
| 404 | غير موجود | الرابط خاطئ |
| 500 | خطأ في الخادم | أعد تشغيل الخادم |

---

## 🆘 حل المشاكل السريع

### المشكلة: الخادم لا يستجيب

```bash
# قتل العملية
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# أو أعد التشغيل
npm run dev
```

### المشكلة: 404 على الروابط

```bash
# تأكد من وجود الملفات
dir app\api\

# أعد تشغيل الخادم
npm run dev
```

### المشكلة: أخطاء CORS

```bash
# تحقق من headers
curl -i http://localhost:3000/api/health
```

---

## 📁 الملفات الهامة

| الملف | الفائدة |
|------|---------|
| `next.config.js` | إعدادات CORS والـ Headers |
| `middleware.js` | معالجة CORS التلقائية |
| `.env.local` | متغيرات البيئة |
| `app/api/login/route.js` | API تسجيل الدخول |
| `app/api/register/route.js` | API التسجيل |
| `public/index.html` | الواجهة الأمامية |
| `db.json` | قاعدة البيانات |
| `lib/db.mjs` | إدارة البيانات |

---

## 🔍 أوامر مفيدة

### فحص حالة الخادم

```bash
# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:3000/api/health -UseBasicParsing
```

### فحص الملفات

```bash
# عرض هيكل المشروع
tree
```

### تنظيف البيانات

```bash
# حذف node_modules و rebuild
Remove-Item node_modules -Recurse -Force
npm install
```

---

## 📞 أرقام التحقق

- ✅ رقم الهاتف يجب أن يبدأ بـ `01` أو `020` أو `021` أو `025`
- ✅ البريد يجب أن يحتوي على `@` و `.`
- ✅ الرقم يجب أن يكون 11 رقم فقط

---

## 💾 النسخ الاحتياطية

### نسخ احتياطي من db.json

```bash
# Windows
copy db.json db.json.backup

# Linux/Mac
cp db.json db.json.backup
```

---

## 🎯 خطوات التصحيح

1. **افتح F12** في المتصفح
2. اذهب إلى **Console** وابحث عن الأخطاء
3. اذهب إلى **Network** وفحص الطلبات
4. تحقق من **Server logs** في Terminal
5. اقرأ الرسائل بعناية

---

## ⚙️ الإعدادات الافتراضية

- **المنفذ:** 3000
- **البيئة:** development
- **قاعدة البيانات:** JSON (db.json)
- **API Base:** http://localhost:3000

---

## 🔐 التحقق من الأمان

- ✅ كلمات المرور محفوظة (استخدم bcrypt في الإنتاج)
- ✅ CORS محدد
- ✅ معالجة الأخطاء آمنة
- ✅ No console logs حساسة

---

## 📊 معلومات المستخدم المخزنة

```json
{
  "id": 1778207602264,
  "name": "أحمد",
  "email": "ahmed@example.com",
  "phone": "01012345678",
  "password": "pass123",
  "role": "employee",
  "permissions": [],
  "approved": false,
  "createdAt": "2026-05-08T02:33:22.264Z"
}
```

---

## ⏱️ المهل الزمنية

| العملية | المهلة |
|--------|--------|
| Health Check | 5 ثوانٍ |
| Login | 10 ثوانٍ |
| Register | 10 ثوانٍ |
| API عام | 10 ثوانٍ |

---

## 🎓 أفضل الممارسات

✅ **افحص الـ Console دائماً** عند وجود مشاكل  
✅ **استخدم Network tab** لرؤية الطلبات والردود  
✅ **أعد تشغيل الخادم** بعد أي تعديل  
✅ **اختبر الـ API** باستخدام Postman أو curl  
✅ **احفظ نسخة احتياطية** من db.json  

---

## 🚀 الأوامر اليومية

```bash
# يوميّاً
npm run dev

# عند الانتهاء
# Ctrl+C لإيقاف الخادم

# عند الإنتاج
npm run build
npm start
```

---

## 📚 المراجع

- [Next.js Docs](https://nextjs.org/docs)
- [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## 💡 نصائح إضافية

1. استخدم `console.log()` لتتبع الأخطاء
2. استخدم `localStorage` لحفظ بيانات المستخدم
3. استخدم `sessionStorage` للبيانات المؤقتة
4. تحقق من الـ Network Tab في Developer Tools
5. اختبر من أجهزة مختلفة

---

## ✨ جاهز للعمل! 🎉

كل شيء معد وجاهز للاستخدام. استمتع بالعمل!

**هل تحتاج مساعدة؟ افحص:**
- Console في المتصفح (F12)
- Network Tab للطلبات
- Server logs في Terminal
