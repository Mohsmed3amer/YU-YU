

// ======================== إعدادات أساسية ========================
const CART_KEY = 'yuyu_cart_items';
let lastDeleted = null;

// ======================== دوال إدارة السلة ========================

// إحضار السلة
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");

// حفظ السلة
const saveCart = cart => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  if (document.getElementById('orderList')) renderCart();
};

// تعديل الكمية
function updateQuantity(name, change) {
  const cart = getCart();
  const i = cart.findIndex(it => it.name === name);
  if (i === -1) return;

  const newQty = cart[i].quantity + change;
  if (newQty > 0) cart[i].quantity = newQty;
  else lastDeleted = cart.splice(i, 1)[0];

  saveCart(cart);
}

// حذف عنصر
function removeItem(name) {
  const cart = getCart();
  const i = cart.findIndex(it => it.name === name);
  if (i === -1) return;
  lastDeleted = cart.splice(i, 1)[0];
  saveCart(cart);
}

// تراجع عن الحذف
function undoDelete() {
  if (!lastDeleted) return alert("لا يوجد عنصر محذوف للتراجع.");
  const cart = getCart();
  const exist = cart.find(it => it.name === lastDeleted.name);
  exist ? exist.quantity += lastDeleted.quantity : cart.push(lastDeleted);
  lastDeleted = null;
  saveCart(cart);
}

// مسح الكل
function clearAll() {
  if (!confirm("هل أنت متأكد من مسح سلة التسوق؟")) return;
  localStorage.removeItem(CART_KEY);
  lastDeleted = null;
  saveCart([]);
}

// إتمام الطلب
function completeOrder() {
  const cart = getCart();
  if (!cart.length) return alert("عربة التسوق فارغة!");
  alert(`🎉 تم تأكيد الطلب بنجاح!
الإجمالي: ${document.getElementById('totalPrice').textContent}`);
  localStorage.removeItem(CART_KEY);
  window.location.href = 'menu.html';
}

// ======================== دالة العرض ========================

function renderCart() {
  const cart = getCart(),
        orderList = document.getElementById('orderList'),
        summary = document.getElementById('summaryItems'),
        totalEl = document.getElementById('totalPrice'),
        checkout = document.querySelector('.checkout-btn'),
        undo = document.getElementById('undoDelete'),
        clear = document.getElementById('clearAll');

  orderList.innerHTML = summary.innerHTML = '';
  let total = 0;

  if (!cart.length) {
    orderList.innerHTML = `<li class="order-item-empty">
      <p>The shopping cart is empty, please return to 
        <a href="menu.html">menu</a> to add items.</p></li>`;
    totalEl.textContent = '$0.00';
    checkout.disabled = undo.disabled = clear.disabled = true;
    return;
  }

  checkout.disabled = clear.disabled = false;
  undo.disabled = !lastDeleted;

  cart.forEach(it => {
    const itemTotal = it.price * it.quantity;
    total += itemTotal;

    orderList.innerHTML += `
      <li class="order-item">
        <div class="item-info"><h4>${it.name}</h4>
        <p class="muted">$${it.price.toFixed(2)} per item</p></div>
        <div class="item-controls">
          <button class="btn-qty" data-n="${it.name}" data-c="-1">-</button>
          <input value="${it.quantity}" readonly>
          <button class="btn-qty" data-n="${it.name}" data-c="1">+</button>
        </div>
        <div class="item-total">$${itemTotal.toFixed(2)}</div>
        <button class="btn-remove" data-n="${it.name}">X</button>
      </li>`;

    summary.innerHTML += `
      <dt>${it.name} (x${it.quantity})</dt>
      <dd>$${itemTotal.toFixed(2)}</dd>`;
  });

  totalEl.textContent = `$${total.toFixed(2)}`;

  // تفعيل الأزرار
  document.querySelectorAll('.btn-qty').forEach(b =>
    b.onclick = () => updateQuantity(b.dataset.n, +b.dataset.c));
  document.querySelectorAll('.btn-remove').forEach(b =>
    b.onclick = () => removeItem(b.dataset.n));
}

// ======================== المستمعات العامة ========================

document.addEventListener('DOMContentLoaded', () => {
  // زر الإضافة في صفحة menu
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.name, price = +btn.dataset.price;
      const cart = getCart(), item = cart.find(it => it.name === name);
      item ? item.quantity++ : cart.push({ name, price, quantity: 1 });
      saveCart(cart);
      alert(`تمت إضافة "${name}" للسلة ✅`);
    };
  });

  // وظائف صفحة الطلب
  if (document.getElementById('orderList')) {
    renderCart();
    document.getElementById('undoDelete').onclick = undoDelete;
    document.getElementById('clearAll').onclick = clearAll;
    document.querySelector('.checkout-btn').onclick = completeOrder;
  }
});

// =================dark mode============
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
    // نحفظ الصفحة التالية اللي هنروح لها بعد اللودينج
    localStorage.setItem("nextPage", targetPage);
    // ننتقل لصفحة اللودينج
    window.location.href = "../loading.html";
  }