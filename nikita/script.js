// 1. Функционал корзины
let cart = [];
let totalPrice = 0;

// Кнопки "Добавить в заказ"
const orderButtons = document.querySelectorAll('.order-btn');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const emptyCartMsg = document.querySelector('.empty-cart-msg');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutBtn = document.getElementById('checkout');

// Обработчик добавления в корзину
orderButtons.forEach(button => {
    button.addEventListener('click', function() {
        const name = this.getAttribute('data-name');
        const price = parseInt(this.getAttribute('data-price'));
        
        // Добавляем товар в массив корзины
        cart.push({ name, price });
        totalPrice += price;
        
        // Обновляем отображение
        updateCartDisplay();
        
        // Анимация кнопки
        this.textContent = 'Добавлено!';
        this.style.backgroundColor = '#2ecc71';
        setTimeout(() => {
            this.textContent = 'Добавить в заказ';
            this.style.backgroundColor = '';
        }, 1500);
    });
});

// Обновление вида корзины
function updateCartDisplay() {
    // Очищаем контейнер
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.appendChild(emptyCartMsg);
        emptyCartMsg.style.display = 'block';
    } else {
        emptyCartMsg.style.display = 'none';
        
        // Создаем элементы для каждого товара
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">${item.price} руб.</span>
                <button class="remove-item" data-index="${index}">×</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Добавляем обработчики для кнопок удаления
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                totalPrice -= cart[index].price;
                cart.splice(index, 1);
                updateCartDisplay();
            });
        });
    }
    
    // Обновляем итоговую сумму
    totalPriceElement.textContent = totalPrice;
}

// Очистка корзины
clearCartBtn.addEventListener('click', () => {
    if (confirm('Очистить всю корзину?')) {
        cart = [];
        totalPrice = 0;
        updateCartDisplay();
    }
});

// Оформление заказа
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Корзина пуста! Добавьте товары перед оформлением.');
        return;
    }
    
    let orderMessage = 'Ваш заказ:\n';
    cart.forEach(item => {
        orderMessage += `- ${item.name}: ${item.price} руб.\n`;
    });
    orderMessage += `\nИтого: ${totalPrice} руб.\n\nСпасибо за заказ! С вами свяжутся для подтверждения.`;
    
    alert(orderMessage);
    
    // Здесь можно отправить данные на сервер
    // fetch('/api/order', { method: 'POST', body: JSON.stringify(cart) })
    
    // Очищаем корзину после оформления
    cart = [];
    totalPrice = 0;
    updateCartDisplay();
});

// 2. Плавная прокрутка к якорям
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// 3. Таймер акции (пример)
function updatePromotionTimer() {
    const timerElement = document.getElementById('promo-timer');
    if(!timerElement) return;
    
    // Установите дату окончания акции
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 2); // Акция на 2 дня
    
    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = endDate - now;
        
        if(distance < 0) {
            clearInterval(timer);
            timerElement.innerHTML = "Акция завершена!";
            return;
        }
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        timerElement.innerHTML = `До конца акции: ${hours}ч ${minutes}м ${seconds}с`;
    }, 1000);
}

// Вызов функций при загрузке
document.addEventListener('DOMContentLoaded', function() {
    updatePromotionTimer();
});

// ... существующий код корзины ...

// 4. ФИЛЬТРАЦИЯ МЕНЮ
const filterButtons = document.querySelectorAll('.filter-btn');
const products = document.querySelectorAll('.product');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Убираем активный класс у всех кнопок
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Добавляем активный класс нажатой кнопке
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        // Показываем/скрываем товары
        products.forEach(product => {
            if (filter === 'all' || product.getAttribute('data-category') === filter) {
                product.style.display = 'block';
                setTimeout(() => {
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, 10);
            } else {
                product.style.opacity = '0';
                product.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    product.style.display = 'none';
                }, 300);
            }
        });
    });
});

// 5. КНОПКА "НАВЕРХ"
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'block';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 6. АНИМАЦИЯ ПРИ СКРОЛЛЕ
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдаем за секциями
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(section);
});

// 7. СОХРАНЕНИЕ КОРЗИНЫ В LOCALSTORAGE
function saveCartToLocalStorage() {
    localStorage.setItem('cookingCart', JSON.stringify(cart));
    localStorage.setItem('cookingTotalPrice', totalPrice.toString());
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cookingCart');
    const savedTotalPrice = localStorage.getItem('cookingTotalPrice');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
        totalPrice = parseInt(savedTotalPrice) || 0;
        updateCartDisplay();
    }
}

// Обновляем функцию добавления в корзину
orderButtons.forEach(button => {
    button.addEventListener('click', function() {
        const name = this.getAttribute('data-name');
        const price = parseInt(this.getAttribute('data-price'));
        
        cart.push({ name, price });
        totalPrice += price;
        
        updateCartDisplay();
        saveCartToLocalStorage(); // Сохраняем
        
        // Анимация
        this.textContent = 'Добавлено!';
        this.style.backgroundColor = '#2ecc71';
        setTimeout(() => {
            this.textContent = 'Добавить в заказ';
            this.style.backgroundColor = '';
        }, 1500);
    });
});

// Загружаем корзину при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updatePromotionTimer();
    loadCartFromLocalStorage();
    
    // Анимация для товаров
    products.forEach(product => {
        product.style.opacity = '0';
        product.style.transform = 'translateY(20px)';
        product.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        setTimeout(() => {
            product.style.opacity = '1';
            product.style.transform = 'translateY(0)';
        }, 100);
    });
});