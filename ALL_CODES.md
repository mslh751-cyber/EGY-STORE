# 📝 جميع الأكواس المعدلة - مرجع شامل

## 📌 محتويات الملف

هذا الملف يحتوي على جميع الأكواس المعدلة بالكامل وموقع كل ملف.

---

## 1️⃣ **next.config.js**

**الموقع:** `/next.config.js`  
**النوع:** جديد ✨

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // تفعيل CORS والـ Headers المهمة للـ API
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  // السماح بأن يتم الوصول للمشروع من أي عنوان domain
  reactStrictMode: true,
};

module.exports = nextConfig;
```

---

## 2️⃣ **middleware.js**

**الموقع:** `/middleware.js`  
**النوع:** جديد ✨

```javascript
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  // إضافة CORS Headers
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

---

## 3️⃣ **.env.local**

**الموقع:** `/.env.local`  
**النوع:** جديد ✨

```
# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
PORT=3000
```

---

## 4️⃣ **app/api/login/route.js**

**الموقع:** `/app/api/login/route.js`  
**النوع:** معدّل ✏️

```javascript
import { NextResponse } from 'next/server';
import { readDb, normalizeEmail } from '../../../lib/db.mjs';

// معالجة CORS لـ OPTIONS requests
export async function OPTIONS(request) {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    const password = String(body.password || '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const db = readDb();
    const user = db.users.find(u => normalizeEmail(u.email) === email && u.password === password);

    if (!user) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    return NextResponse.json({ user }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في معالجة الطلب' }, { status: 500 });
  }
}
```

---

## 5️⃣ **app/api/register/route.js**

**الموقع:** `/app/api/register/route.js`  
**النوع:** معدّل ✏️

```javascript
import { NextResponse } from 'next/server';
import { readDb, writeDb, normalizeEmail } from '../../../lib/db.mjs';

// معالجة CORS لـ OPTIONS requests
export async function OPTIONS(request) {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = normalizeEmail(body.email);
    const phone = String(body.phone || '').trim();
    const password = String(body.password || '').trim();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'يرجى ملء جميع الحقول' }, { status: 400 });
    }

    if (!/^01[025][0-9]{8}$/.test(phone)) {
      return NextResponse.json({ error: 'الرجاء إدخال رقم هاتف مصري صحيح مكون من 11 رقماً' }, { status: 400 });
    }

    const db = readDb();
    if (db.users.some(u => normalizeEmail(u.email) === email)) {
      return NextResponse.json({ error: 'هذا البريد الإلكتروني مستخدم بالفعل' }, { status: 409 });
    }

    const user = {
      id: Date.now(),
      name,
      email,
      phone,
      password,
      role: 'employee',
      permissions: [],
      approved: false,
      createdAt: new Date().toISOString(),
    };

    db.users.push(user);
    writeDb(db);

    return NextResponse.json({ user }, { 
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في معالجة الطلب' }, { status: 500 });
  }
}
```

---

## 6️⃣ **app/api/health/route.js**

**الموقع:** `/app/api/health/route.js`  
**النوع:** معدّل ✏️

```javascript
import { NextResponse } from 'next/server';

// معالجة CORS لـ OPTIONS requests
export async function OPTIONS(request) {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET() {
  return NextResponse.json({ status: 'ok' }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
```

---

## 7️⃣ **app/api/users/route.js**

**الموقع:** `/app/api/users/route.js`  
**النوع:** معدّل ✏️

```javascript
import { NextResponse } from 'next/server';
import { readDb, normalizeEmail } from '../../../lib/db.mjs';

// معالجة CORS لـ OPTIONS requests
export async function OPTIONS(request) {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const email = normalizeEmail(url.searchParams.get('email'));

    if (!email) {
      return NextResponse.json({ error: 'Missing email query parameter' }, { status: 400 });
    }

    const db = readDb();
    const user = db.users.find(u => normalizeEmail(u.email) === email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في معالجة الطلب' }, { status: 500 });
  }
}
```

---

## 8️⃣ **app/api/pending-count/route.js**

**الموقع:** `/app/api/pending-count/route.js`  
**النوع:** معدّل ✏️

```javascript
import { NextResponse } from 'next/server';
import { readDb } from '../../../lib/db.mjs';

// معالجة CORS لـ OPTIONS requests
export async function OPTIONS(request) {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET() {
  try {
    const db = readDb();
    const pendingCount = db.users.filter(u => !u.approved).length;
    return NextResponse.json({ pendingCount }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في معالجة الطلب' }, { status: 500 });
  }
}
```

---

## 9️⃣ **index.html - دالة apiFetch (معدّلة)**

**الموقع:** `/public/index.html` (أو `/index.html`)  
**المكان في الملف:** حوالي السطر 851-900  
**النوع:** معدّل ✏️

```javascript
// قائمة الأخطاء الشائة وحلولها
const ERROR_MESSAGES = {
  'Failed to fetch': 'تعذر الاتصال بالخادم. تأكد من:\n1. تشغيل الخادم (npm run dev)\n2. الوصول من http://localhost:3000\n3. فتح المتصفح في نفس الجهاز',
  'AbortError': 'انتهت مهلة الطلب. يرجى المحاولة مجدداً.',
  'NetworkError': 'خطأ في الاتصال بالشبكة. تحقق من اتصالك بالإنترنت.',
};

function apiFetch(path, options = {}) {
  const timeout = options.timeout || 10000; // 10 ثواني كـ افتراضي
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const fetchOptions = {
    ...options,
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  return fetch(`${API_BASE}${path}`, fetchOptions)
    .then(async response => {
      clearTimeout(timeoutId);
      const contentType = response.headers.get('content-type');
      let data = {};
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json().catch(() => ({}));
      }

      if (!response.ok) {
        const errorMsg = data.error || `خطأ ${response.status}: ${response.statusText}`;
        throw new Error(errorMsg);
      }
      return data;
    })
    .catch(err => {
      clearTimeout(timeoutId);
      const errorMsg = err.message || 'خطأ غير معروف';
      const customMsg = ERROR_MESSAGES[err.name] || ERROR_MESSAGES[errorMsg];
      
      if (customMsg) {
        throw new Error(customMsg);
      }
      throw new Error(errorMsg);
    });
}
```

---

## 🔟 **index.html - دالة login() (معدّلة)**

**الموقع:** `/public/index.html` (أو `/index.html`)  
**المكان في الملف:** حوالي السطر 2015-2045  
**النوع:** معدّل ✏️

```javascript
async function login() {
  let email = document.getElementById('login-email').value.trim();
  let password = document.getElementById('login-password').value;
  let error = document.getElementById('login-error');
  
  if (!email || !password) {
    error.textContent = 'يرجى إدخال البريد الإلكتروني وكلمة المرور';
    error.style.display = 'block';
    return;
  }
  if (!isValidEmail(email)) {
    error.textContent = 'الرجاء إدخال بريد إلكتروني صالح';
    error.style.display = 'block';
    return;
  }
  
  // عرض رسالة جاري التحميل
  error.textContent = 'جاري التحقق...';
  error.style.color = '#1e7e34';
  error.style.display = 'block';
  
  try {
    let data = await apiFetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    db.currentUser = data.user;
    saveAuthEmail(db.currentUser.email);
    saveData();
    error.style.display = 'none';
    document.getElementById('login-modal').classList.add('section-hidden');
    document.body.classList.remove('logged-out');
    applyPermissions();
    if (db.currentUser.permissions.length === 0) {
      showPage('empty');
    } else {
      renderDashboard();
    }
  } catch (e) {
    error.textContent = e.message || 'خطأ في تسجيل الدخول';
    error.style.color = '#ef4444';
    error.style.display = 'block';
    console.error('Login error:', e);
  }
}
```

---

## 1️⃣1️⃣ **index.html - دالة register() (معدّلة)**

**الموقع:** `/public/index.html` (أو `/index.html`)  
**المكان في الملف:** حوالي السطر 2170-2210  
**النوع:** معدّل ✏️

```javascript
async function register() {
  let name = document.getElementById('reg-name').value.trim();
  let email = document.getElementById('reg-email').value.trim();
  let phone = document.getElementById('reg-phone').value.trim();
  let password = document.getElementById('reg-password').value;
  let confirm = document.getElementById('reg-confirm').value;
  let error = document.getElementById('register-error');
  
  if (!name || !email || !phone || !password || !confirm) {
    error.textContent = 'يرجى ملء جميع الحقول';
    error.style.color = '#ef4444';
    error.style.display = 'block';
    return;
  }
  if (!isValidEmail(email)) {
    error.textContent = 'الرجاء إدخال بريد إلكتروني صالح';
    error.style.color = '#ef4444';
    error.style.display = 'block';
    return;
  }
  if (!isValidEgyptPhone(phone)) {
    error.textContent = 'الرجاء إدخال رقم هاتف مصري صحيح مكون من 11 رقماً';
    error.style.color = '#ef4444';
    error.style.display = 'block';
    return;
  }
  if (password !== confirm) {
    error.textContent = 'كلمات المرور غير متطابقة';
    error.style.color = '#ef4444';
    error.style.display = 'block';
    return;
  }
  
  // عرض رسالة جاري التحميل
  error.textContent = 'جاري إنشاء الحساب...';
  error.style.color = '#1e7e34';
  error.style.display = 'block';
  
  try {
    let data = await apiFetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    });
    
    db.currentUser = data.user;
    saveAuthEmail(db.currentUser.email);
    saveData();
    document.getElementById('register-modal').classList.add('section-hidden');
    document.body.classList.remove('logged-out');
    applyPermissions();
    error.style.display = 'none';
    showPage('empty');
  } catch (e) {
    error.textContent = e.message || 'خطأ في إنشاء الحساب';
    error.style.color = '#ef4444';
    error.style.display = 'block';
    console.error('Register error:', e);
  }
}
```

---

## 1️⃣2️⃣ **package.json (معدّل)**

**الموقع:** `/package.json`  
**النوع:** معدّل ✏️

```json
{
  "name": "egy-store-server",
  "version": "1.0.0",
  "description": "EGY STORE Next.js Backend API",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.2.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "eslint": "^8",
    "eslint-config-next": "^15.2.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## 📍 ملخص المواقع

| الملف | الموقع | النوع |
|------|--------|-------|
| next.config.js | `/next.config.js` | جديد ✨ |
| middleware.js | `/middleware.js` | جديد ✨ |
| .env.local | `/.env.local` | جديد ✨ |
| api/login/route.js | `/app/api/login/route.js` | معدّل ✏️ |
| api/register/route.js | `/app/api/register/route.js` | معدّل ✏️ |
| api/health/route.js | `/app/api/health/route.js` | معدّل ✏️ |
| api/users/route.js | `/app/api/users/route.js` | معدّل ✏️ |
| api/pending-count/route.js | `/app/api/pending-count/route.js` | معدّل ✏️ |
| index.html | `/public/index.html` | معدّل ✏️ |
| package.json | `/package.json` | معدّل ✏️ |

---

## ✅ التحقق من التثبيت

1. **نسخ الأكواد** من هذا الملف إلى المواقع المحددة
2. **تشغيل الخادم:** `npm run dev`
3. **فتح المتصفح:** `http://localhost:3000/index.html`
4. **اختبار تسجيل الدخول** ببيانات الاختبار
5. **فحص Console** للأخطاء

---

**كل الأكواس جاهزة الآن! 🎉**
