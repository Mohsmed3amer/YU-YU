// 1. جلب العناصر الضرورية مرة واحدة
const form = document.getElementById('Login');
const nameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// 2. جلب عناصر الخطأ
const nameErrorElement = document.getElementById('error-text');
const emailErrorElement = document.getElementById('error-email');
const passwordErrorElement = document.getElementById('error-password');

// 3. تعريف التعبيرات النمطية (RegExp)

// الشروط: يبدأ بحرف كبير، يحتوي على أرقام، لا مسافات، حد أقصى 8 أحرف.
const NAME_PATTERN = /^[A-Z]([a-zA-Z0-9]){0,7}$/; 

// الشروط: نطاقات محددة (gmail, hotmail, yahoo, outlook, github)
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@(\s*gmail\.com\s*|\s*hotmail\.com\s*|\s*yahoo\.com\s*|\s*outlook\.com\s*|\s*github\.com\s*)$/i;

// الشروط: حرف كبير وصغير ورقم ورمز واحد على الأقل، بلا مسافات، حد أقصى 12 حرفاً.
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{1,12}$/;


// 4. دوال التحقق المخصصة لكل حقل (للاستخدام الفوري وللإرسال)

function validateName() {
    const name = nameInput.value.trim();
    const isValid = NAME_PATTERN.test(name);
    
    if (!isValid) {
        nameErrorElement.innerHTML = "Must start with a capital letter, no spaces, and maximum length 8 characters.";
        nameInput.classList.add('error-text'); // لتغيير تنسيق الحقل
        return false;
    } else {
        nameErrorElement.innerHTML = "";
        nameInput.classList.remove('error-text');
        return true;
    }
}

function validateEmail() {
    const email = emailInput.value.trim();
    const isValid = EMAIL_PATTERN.test(email);
    
    if (!isValid) {
        emailErrorElement.innerHTML = "Invalid email format or domain not allowed.";
        emailInput.classList.add('error-email');
        return false;
    } else {
        emailErrorElement.innerHTML = "";
        emailInput.classList.remove('error-email');
        return true;
    }
}

function validatePassword() {
    const password = passwordInput.value.trim();
    const isValid = PASSWORD_PATTERN.test(password);
    
    if (!isValid) {
        passwordErrorElement.innerHTML = "Must contain letters (upper/lower case), numbers, symbols, maximum 12 characters with no spaces.";
        passwordInput.classList.add('error-password');
        return false;
    } else {
        passwordErrorElement.innerHTML = "";
        passwordInput.classList.remove('error-password');
        return true;
    }
}

// 5. ربط التحقق الفوري (Blur)
// تظهر رسالة الخطأ فوراً بعد مغادرة المستخدم للحقل
nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);


// 6. ربط التحقق النهائي (Submit)
form.addEventListener('submit', function(event) {
    event.preventDefault(); // منع الإرسال الافتراضي
    
    // تشغيل جميع دوال التحقق للتأكد من الحالة النهائية
    const isNameValid = validateName(); 
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    // إذا كان أي حقل غير صالح، امنع الإرسال
    if (!isNameValid || !isEmailValid || !isPasswordValid) {
        // عرض رسالة عامة للتأكيد على الأخطاء
        alert('Please correct mistakes in the form before submitting.');
        
    } else {
        // حالة النجاح: حفظ المستخدم في Local Storage
        const userData = {
            username: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
            id: Date.now().toString()
        };
        
        // حفظ المستخدم في Local Storage
        saveUser(userData);
        
        // حفظ بيانات تسجيل الدخول الحالية
        localStorage.setItem('currentUser', JSON.stringify({
            username: userData.username,
            email: userData.email,
            id: userData.id
        }));
        
        alert('Registration successful! Redirecting to home page.');
        
        // التوجيه إلى الصفحة الرئيسية
        window.location.href = "../index.html";
    }
});

// دالة لحفظ المستخدم في Local Storage
function saveUser(userData) {
    // جلب المستخدمين الحاليين أو إنشاء مصفوفة فارغة
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // التحقق من عدم وجود مستخدم بنفس البريد الإلكتروني
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
        alert('This email is already registered!');
        return false;
    }
    
    // إضافة المستخدم الجديد
    users.push(userData);
    
    // حفظ المصفوفة المحدثة في Local Storage
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}