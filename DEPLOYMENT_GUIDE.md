# 🌐 دليل النشر إلى الإنتاج (Production)

## 📋 قبل النشر - قائمة التحقق

- [ ] تأكد من أن جميع الاختبارات تعمل محلياً
- [ ] تحديث `.env.local` مع عنوان السيرفر الحقيقي
- [ ] عمل `npm run build` والتحقق من عدم وجود أخطاء
- [ ] تحديث رابط API في الكود إن لزم الأمر

---

## 🔐 إعدادات الإنتاج الآمنة

### 1. ملف `.env.production`

```bash
NEXT_PUBLIC_API_URL=https://yourdomain.com
NODE_ENV=production
PORT=3000
```

**ملاحظة:** استخدم `https` وليس `http`

### 2. تحديث CORS للإنتاج

**ملف:** `next.config.js`

```javascript
const nextConfig = {
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          // غيّر * إلى نطاقك الحقيقي
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGINS || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 3. تأمين كلمات المرور

**استخدم bcrypt:**

```bash
npm install bcrypt
```

**ملف:** `lib/auth.mjs` (جديد)

```javascript
import bcrypt from 'bcrypt';

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
```

---

## 🚀 خطوات النشر

### الطريقة 1: النشر على Vercel (الموصى به)

#### الخطوة 1: إنشاء حساب Vercel
1. اذهب إلى https://vercel.com
2. اشترك مجاناً

#### الخطوة 2: ربط المستودع
```bash
npm install -g vercel
vercel login
vercel
```

#### الخطوة 3: اتبع التعليمات
- اختر اسم المشروع
- حدد مجلد المشروع
- انتظر النشر التلقائي

#### النتيجة:
```
Deployed to: https://your-project.vercel.app
```

---

### الطريقة 2: النشر على خادم خاص

#### الخطوة 1: إعداد الخادم

**تثبيت Node.js:**
```bash
# على Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# على CentOS/RedHat
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

**تثبيت PM2 (لتشغيل تلقائي):**
```bash
npm install -g pm2
```

#### الخطوة 2: رفع الملفات

**استخدام Git:**
```bash
cd /var/www/egy-store
git clone https://your-repo-url.git
cd egy-store
npm install
npm run build
```

**أو استخدام SFTP/FTP:**
- رفع جميع الملفات إلى `/var/www/egy-store`
- قم بتشغيل `npm install && npm run build`

#### الخطوة 3: تشغيل التطبيق

```bash
pm2 start npm --name "egy-store" -- start
pm2 save
pm2 startup
```

#### الخطوة 4: إعداد Nginx (اختياري)

**ملف:** `/etc/nginx/sites-available/egy-store`

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**تفعيل:**
```bash
sudo ln -s /etc/nginx/sites-available/egy-store /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### الخطوة 5: SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

### الطريقة 3: النشر على Docker

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### .dockerignore

```
node_modules
.next
.git
.gitignore
README.md
```

#### البناء والتشغيل

```bash
docker build -t egy-store .
docker run -p 3000:3000 egy-store
```

---

## 📊 مراقبة الأداء

### استخدام PM2

```bash
# عرض الحالة
pm2 status

# عرض السجلات
pm2 logs egy-store

# إعادة تشغيل
pm2 restart egy-store

# إيقاف
pm2 stop egy-store
```

### مراقبة الأخطاء

**ملف:** `.env.production`

```bash
LOG_FILE=/var/log/egy-store/error.log
DEBUG=egy-store:*
```

---

## 🔒 نصائح الأمان

### 1. متغيرات البيئة الحساسة

```bash
# تخزين آمن للبيانات الحساسة
# لا تضع كلمات المرور في الكود!

# استخدم:
DATABASE_URL="postgres://user:pass@host/db"
API_SECRET="your-secret-key"
```

### 2. HTTPS إلزامي

```javascript
// في middleware.js
if (process.env.NODE_ENV === 'production') {
  // افرض HTTPS
  if (request.headers['x-forwarded-proto'] !== 'https') {
    return NextResponse.redirect(
      new URL(request.url.replace('http://', 'https://'))
    );
  }
}
```

### 3. Rate Limiting

```bash
npm install express-rate-limit
```

**الاستخدام:**

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 طلب لكل 15 دقيقة
});

app.use('/api/', limiter);
```

### 4. CSRF Protection

```bash
npm install csrf
```

---

## 🔄 التحديثات والصيانة

### تحديث التطبيق

```bash
# سحب التحديثات
git pull

# تثبيت التبعيات الجديدة
npm install

# بناء النسخة الجديدة
npm run build

# إعادة تشغيل
pm2 restart egy-store
```

### النسخ الاحتياطي

```bash
# نسخ احتياطي من قاعدة البيانات
cp db.json db.json.backup-$(date +%Y%m%d)

# أو استخدم cron
0 0 * * * cp /var/www/egy-store/db.json /backups/db-$(date +\%Y\%m\%d).json
```

---

## 🧪 اختبار الإنتاج

### 1. اختبر جميع الـ API Routes

```bash
# Health Check
curl https://yourdomain.com/api/health

# Login
curl -X POST https://yourdomain.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'

# Register
curl -X POST https://yourdomain.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"01012345678","password":"pass123"}'
```

### 2. اختبر CORS

```bash
curl -i -X OPTIONS https://yourdomain.com/api/login \
  -H "Access-Control-Request-Method: POST"
```

### 3. اختبر الأداء

```bash
npm install -g apache2-utils

ab -n 1000 -c 10 https://yourdomain.com/index.html
```

---

## 📈 تحسين الأداء

### 1. تفعيل الـ Caching

```javascript
// في next.config.js
const nextConfig = {
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};
```

### 2. ضغط البيانات

```javascript
// استخدم gzip التلقائي في Next.js
// يتم تفعيله افتراضياً في الإنتاج
```

### 3. تحسين الصور

```bash
npm install next-image-optimization
```

---

## 📞 استكشاف الأخطاء

### المشكلة: 502 Bad Gateway

**الحل:**
```bash
# تحقق من الخادم
pm2 status
pm2 logs

# أعد التشغيل
pm2 restart egy-store
```

### المشكلة: Timeout

**الحل:**
```bash
# زد timeout في nginx
proxy_connect_timeout 600s;
proxy_send_timeout 600s;
proxy_read_timeout 600s;
```

### المشكلة: Out of Memory

**الحل:**
```bash
# زد الذاكرة المتاحة
pm2 start npm --name "egy-store" --max-memory-restart 500M -- start
```

---

## ✅ قائمة التحقق النهائية

- [ ] تم بناء التطبيق بدون أخطاء: `npm run build`
- [ ] جميع الـ API Routes تعمل
- [ ] CORS يعمل من جميع الأنطقة المسموحة
- [ ] قاعدة البيانات محفوظة وآمنة
- [ ] كلمات المرور مشفرة (مع bcrypt)
- [ ] تم تفعيل HTTPS
- [ ] تم إعداد النسخ الاحتياطية
- [ ] تم إعداد المراقبة (Monitoring)
- [ ] تم اختبار جميع المسارات

---

## 🎉 نصيحة نهائية

**بعد النشر، قم بـ:**
1. اختبر الموقع من أجهزة مختلفة
2. راقب السجلات للأخطاء
3. تحقق من الأداء
4. اطلب من المستخدمين اختبار الموقع
5. استعد للدعم الفني

**حظاً موفقاً! 🚀**
