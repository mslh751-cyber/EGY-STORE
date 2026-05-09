# EGY STORE - Multi-User Real-Time System

نظام إدارة متجر إلكتروني متعدد المستخدمين في الوقت الفعلي.

## الميزات

- ✅ نظام مصادقة متقدم (JWT Authentication)
- ✅ إدارة المستخدمين مع الموافقة من المدير
- ✅ قاعدة بيانات MongoDB مشتركة
- ✅ مزامنة البيانات في الوقت الفعلي (Socket.io)
- ✅ واجهة إدارة شاملة
- ✅ نظام صلاحيات مرن

## متطلبات التشغيل

- Node.js >= 18.0.0
- MongoDB
- npm أو pnpm

## التثبيت والتشغيل

1. **تثبيت التبعيات:**
   ```bash
   npm install
   # أو
   pnpm install
   ```

2. **إعداد قاعدة البيانات:**
   - تأكد من تشغيل MongoDB
   - عدل ملف `.env` إذا لزم الأمر

3. **تهيئة قاعدة البيانات:**
   ```bash
   npm run init-db
   ```

4. **تشغيل الخادم:**
   ```bash
   npm run server
   ```

5. **فتح المتصفح:**
   - اذهب إلى `http://localhost:3000`

## حساب المدير الافتراضي

- **البريد الإلكتروني:** admin@egy-store.com
- **كلمة المرور:** admin123

## API Endpoints

### المصادقة
- `POST /api/register` - تسجيل مستخدم جديد
- `POST /api/login` - تسجيل الدخول

### إدارة المستخدمين (Admin Only)
- `GET /api/users` - جلب جميع المستخدمين
- `GET /api/pending-count` - عدد الطلبات المعلقة
- `PUT /api/users/:userId/approve` - الموافقة على مستخدم
- `PUT /api/users/:userId` - تحديث بيانات مستخدم

### الصحة
- `GET /api/health` - فحص حالة الخادم

## التقنيات المستخدمة

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
- **Real-time:** Socket.io
- **Frontend:** Vanilla JavaScript, HTML, CSS
- **Charts:** Chart.js

## هيكل المشروع

```
├── models/           # نماذج قاعدة البيانات
├── controllers/      # متحكمات API
├── middleware/       # الوسائط المتوسطة
├── scripts/          # سكريبتات المساعدة
├── public/           # الملفات الثابتة والواجهة
├── server.js         # الخادم الرئيسي
├── .env              # متغيرات البيئة
└── package.json      # التبعيات
```

## الأمان

- تشفير كلمات المرور باستخدام bcrypt
- رموز JWT محمية
- التحقق من الصلاحيات
- حماية من الوصول غير المصرح به

## التطوير

للمساهمة في التطوير:

1. قم بعمل Fork للمشروع
2. أنشئ فرع للميزة الجديدة
3. ارفع التغييرات
4. أنشئ Pull Request

## الترخيص

هذا المشروع مفتوح المصدر تحت رخصة MIT.