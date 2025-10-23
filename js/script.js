const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// تفعيل الوضع الليلي والفاتح
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  // تبديل الأيقونة
  if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
});

function goToLoading(targetPage) {
  // احفظ الصفحة المطلوبة في localStorage
  localStorage.setItem("nextPage", targetPage);
  // روح لصفحة اللودينج
  window.location.href = "./loading.html";
}

// نستخدم IntersectionObserver علشان نعرف إمتى الصور تظهر في الشاشة
const images = document.querySelectorAll('.container img');

  // نستخدم IntersectionObserver لمراقبة الصور
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // لما تدخل الصورة في الشاشة
        entry.target.classList.add('show');
      } else {
        // لما تخرج الصورة من الشاشة
        entry.target.classList.remove('show');
      }
    });
  }, { threshold: 0.3 }); // 30% من الصورة لازم تبان علشان يتفاعل

  images.forEach(img => observer.observe(img));

  // ================================
const footer = document.querySelector('.footer');

  // نستخدم الـ Intersection Observer
  const observerf = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // يشغل الأنيميشن
        footer.classList.add('show');

        // بعد ما تنتهي الحركة، نحذف الكلاس علشان تشتغل تاني لما نرجع
        footer.addEventListener('animationend', () => {
          footer.classList.remove('show');
        }, { once: true });
      }
    });
  });

  observerf.observe(footer);

// ========== نظام إدارة المستخدمين ==========

// التحقق من حالة تسجيل الدخول وتحديث واجهة المستخدم
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    
    // إضافة حدث النقر لتسجيل الخروج
    document.addEventListener('click', function(e) {
        if (e.target.id === 'logoutBtn') {
            e.preventDefault();
            logout();
        }
    });
});

// دالة تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
function updateNavigation() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navLinks = document.getElementById('navLinks');
    
    if (currentUser && navLinks) {
        // البحث عن رابط تسجيل الدخول واستبداله باسم المستخدم
        const loginItems = navLinks.querySelectorAll('li');
        const loginItem = Array.from(loginItems).find(item => 
            item.textContent.includes('Login') || item.innerHTML.includes('right-to-bracket')
        );
        
        if (loginItem) {
            loginItem.innerHTML = `
                <i class="fa-solid fa-user" style="color: #e9bb03;"></i>
                <a href="#" id="userMenu">${currentUser.username}</a>
                <div class="user-dropdown" id="userDropdown" style="display: none; position: absolute; background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <a href="#" id="logoutBtn">Logout</a>
                </div>
            `;
            
            // إضافة قائمة منسدلة للمستخدم
            const userMenu = document.getElementById('userMenu');
            const userDropdown = document.getElementById('userDropdown');
            
            userMenu.addEventListener('click', function(e) {
                e.preventDefault();
                userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
            });
            
            // إغلاق القائمة عند النقر خارجها
            document.addEventListener('click', function(e) {
                if (!loginItem.contains(e.target)) {
                    userDropdown.style.display = 'none';
                }
            });
        }
    }
}

// دالة تسجيل الخروج
function logout() {
    localStorage.removeItem('currentUser');
    alert('You have been logged out successfully');
    location.reload();
}

// جعل الدوال متاحة عالمياً
window.goToLoading = goToLoading;
window.logout = logout;
window.updateNavigation = updateNavigation;