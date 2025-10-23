// Js/indexjs.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // التحقق من بيانات تسجيل الدخول
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // الحصول على المستخدمين المخزنين
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // البحث عن المستخدم (يمكن استخدام اسم المستخدم أو البريد الإلكتروني)
        const user = users.find(u => 
            (u.username === username || u.email === username) && 
            u.password === password
        );
        
        if (user) {
            // حفظ بيانات المستخدم الحالي
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                username: user.username,
                email: user.email
            }));
            
            alert('Login successful! Redirecting...');
            
            // الانتقال إلى الصفحة الرئيسية
            window.location.href = "../index.html";
        } else {
            alert('Username/Email or password is incorrect');
        }
    });
});