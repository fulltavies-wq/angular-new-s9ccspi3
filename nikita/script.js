console.log('✅ Script.js загружен! Корзина готова к работе!');

// ========== 1. ФУНКЦИОНАЛ КОРЗИНЫ ==========
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
        
        console.log('✅ Добавляем в корзину:', name, price);
        
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
                saveCartToLocalStorage();
            });
        });
    }
    
    // Обновляем итоговую сумму
    totalPriceElement.textContent = totalPrice;
    
    // Сохраняем в LocalStorage
    saveCartToLocalStorage();
    
    // Проверяем бесплатную доставку
    checkFreeDelivery();
}

// Очистка корзины
clearCartBtn.addEventListener('click', () => {
    if (confirm('Очистить всю корзину?')) {
        cart = [];
        totalPrice = 0;
        updateCartDisplay();
        saveCartToLocalStorage();
    }
});

// Оформление заказа
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Корзина пуста! Добавьте товары перед оформлением.');
        return;
    }
    
    let orderMessage = '🍽️ ВАШ ЗАКАЗ 🍽️\n\n';
    cart.forEach(item => {
        orderMessage += `• ${item.name}: ${item.price} руб.\n`;
    });
    orderMessage += `\n💰 ИТОГО: ${totalPrice} руб.\n\n`;
    
    if (totalPrice >= 1500) {
        orderMessage += '🎉 Вы получили БЕСПЛАТНУЮ ДОСТАВКУ!\n';
    } else {
        orderMessage += `📦 До бесплатной доставки осталось: ${1500 - totalPrice} руб.\n`;
    }
    
    orderMessage += `📞 С вами свяжутся для подтверждения заказа.\n`;
    orderMessage += `⏱️ Время доставки: 45-60 минут`;
    
    alert(orderMessage);
    
    // Очищаем корзину после оформления
    cart = [];
    totalPrice = 0;
    updateCartDisplay();
    saveCartToLocalStorage();
});

// ========== 2. ТАЙМЕР АКЦИИ ==========
function updatePromotionTimer() {
    const timerElement = document.getElementById('promo-timer');
    if(!timerElement) return;
    
    // Акция на 3 дня
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);
    endDate.setHours(23, 59, 59, 999);
    
    function updateTimer() {
        const now = new Date().getTime();
        const distance = endDate - now;
        
        if(distance < 0) {
            timerElement.innerHTML = "⏰ Акция завершена!";
            timerElement.style.color = "#e74c3c";
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        let timeString = "";
        if (days > 0) {
            timeString += `${days} дн. `;
        }
        timeString += `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        timerElement.innerHTML = `⏳ До конца акции: <strong>${timeString}</strong>`;
        
        if (hours < 1) {
            timerElement.style.color = "#e74c3c";
        } else if (hours < 3) {
            timerElement.style.color = "#f39c12";
        } else {
            timerElement.style.color = "#ffffff";
        }
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// ========== 3. LOCALSTORAGE ==========
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
        console.log('✅ Корзина загружена из LocalStorage:', cart);
    }
}

// ========== 4. БЕСПЛАТНАЯ ДОСТАВКА ==========
function checkFreeDelivery() {
    // Убираем старые сообщения
    const oldMsg = document.querySelector('.delivery-message');
    if (oldMsg) oldMsg.remove();
    
    if (totalPrice >= 1500 && totalPrice > 0) {
        const deliveryMsg = document.createElement('div');
        deliveryMsg.className = 'delivery-message';
        deliveryMsg.innerHTML = '🎉 Поздравляем! Вы получили БЕСПЛАТНУЮ доставку!';
        deliveryMsg.style.cssText = `
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            color: white;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            margin: 10px 0;
            font-weight: bold;
        `;
        
        if (totalPriceElement.parentNode) {
            totalPriceElement.parentNode.appendChild(deliveryMsg);
        }
    } else if (totalPrice > 0) {
        const remaining = 1500 - totalPrice;
        const deliveryMsg = document.createElement('div');
        deliveryMsg.className = 'delivery-message';
        deliveryMsg.innerHTML = `📦 Добавьте еще ${remaining} руб. для БЕСПЛАТНОЙ доставки!`;
        deliveryMsg.style.cssText = `
            background: #f39c12;
            color: white;
            padding: 8px;
            border-radius: 5px;
            text-align: center;
            margin: 10px 0;
            font-size: 0.9rem;
        `;
        
        if (totalPriceElement.parentNode) {
            totalPriceElement.parentNode.appendChild(deliveryMsg);
        }
    }
}

// ========== 5. ФИЛЬТРЫ МЕНУ ==========
function setupMenuFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                products.forEach(product => {
                    const category = product.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
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
    }
}

// ========== 6. КНОПКА "НАВЕРХ" ==========
const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
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
}

// ========== 7. ПЛАВНАЯ ПРОКРУТКА ==========
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

// ========== 8. СЧЕТЧИК ОНЛАЙН ==========
function updateOnlineCounter() {
    const onlineCount = document.getElementById('online-count');
    if (onlineCount) {
        // Начальное случайное число от 15 до 45
        let currentCount = Math.floor(Math.random() * 30) + 15;
        onlineCount.textContent = currentCount;
        
        // Обновляем каждые 30 секунд
        setInterval(() => {
            // Случайное изменение от -2 до +2
            const change = Math.floor(Math.random() * 5) - 2;
            currentCount = Math.max(10, currentCount + change); // Не меньше 10
            onlineCount.textContent = currentCount;
            
            // Анимация при изменении
            onlineCount.style.transform = 'scale(1.2)';
            setTimeout(() => {
                onlineCount.style.transform = 'scale(1)';
            }, 300);
        }, 30000); // 30 секунд
    }
}

// ========== ЕДИНАЯ ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Страница загружена!');
    
    // Загружаем корзину
    loadCartFromLocalStorage();
    
    // Запускаем таймер акции
    updatePromotionTimer();
    
    // Настраиваем фильтры меню
    setupMenuFilters();
    
    // Запускаем счетчик онлайн
    updateOnlineCounter();
    
    // Настраиваем блюдо дня
    setupDaySpecial();
    
    // Настраиваем темную тему (НОВАЯ ФУНКЦИЯ)
    setupDarkTheme();
    
    // Анимация товаров
    const products = document.querySelectorAll('.product');
    products.forEach((product, index) => {
        product.style.opacity = '0';
        product.style.transform = 'translateY(20px)';
        product.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        setTimeout(() => {
            product.style.opacity = '1';
            product.style.transform = 'translateY(0)';
        }, index * 50);
    });
});
// ========== БЛЮДО ДНЯ (автоматическая смена) ==========
function updateDaySpecial() {
    const dishes = [
        { name: "Салат 'Цезарь' (350гр.)", price: 379, discount: 15 },
        { name: "Утиные ножки «Конфи»", price: 899, discount: 10 },
        { name: "Борщ с говядиной", price: 319, discount: 20 },
        { name: "Банановые панкейки с кленовым сиропом", price: 419, discount: 15 },
        { name: "Суп «Харчо» с курицей и рисом", price: 319, discount: 25 }
    ];
    
    // Берем блюдо по дню недели
    const today = new Date().getDay();
    const specialDish = dishes[today % dishes.length];
    
    const dayDishElement = document.getElementById('day-dish');
    if (dayDishElement) {
        dayDishElement.textContent = specialDish.name;
        
        // Можно добавить автоматическое применение скидки
        console.log(`🍽️ Блюдо дня: ${specialDish.name} (-${specialDish.discount}%)`);
    }
}

// ========== ФИЛЬТРЫ МЕНЮ ==========
function setupMenuFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                products.forEach(product => {
                    const category = product.getAttribute('data-category');
                    
                    // Особый случай для фильтра "popular"
                    if (filter === 'popular') {
                        if (category.includes('popular')) {
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
                    }
                    // Обычные фильтры
                    else if (filter === 'all' || category.includes(filter)) {
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
    }
}

// Функция показа уведомления
function showNotification(message) {
    const notification = document.getElementById('cart-notification');
    const notificationText = document.getElementById('notification-text');
    
    if (notification && notificationText) {
        notificationText.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Обнови обработчик кнопок:
orderButtons.forEach(button => {
    button.addEventListener('click', function() {
        const name = this.getAttribute('data-name');
        const price = parseInt(this.getAttribute('data-price'));
        
        cart.push({ name, price });
        totalPrice += price;
        
        updateCartDisplay();
        showNotification(`"${name}" добавлен в корзину!`); // ← НОВОЕ!
        
        this.textContent = 'Добавлено!';
        this.style.backgroundColor = '#2ecc71';
        setTimeout(() => {
            this.textContent = 'Добавить в заказ';
            this.style.backgroundColor = '';
        }, 1500);
    });
});

// ========== ТЕМНАЯ ТЕМА ==========
function setupDarkTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const darkThemeCSS = document.getElementById('dark-theme-css');
    
    // Проверяем сохраненную тему в localStorage
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    
    // Применяем сохраненную тему
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        if (themeToggle) themeToggle.textContent = '☀️ Тема';
    }
    
    // Создаем элемент для темной темы, если его нет
    if (!darkThemeCSS) {
        const link = document.createElement('link');
        link.id = 'dark-theme-css';
        link.rel = 'stylesheet';
        link.href = 'dark-theme.css';
        document.head.appendChild(link);
    }
    
    // Обработчик клика на кнопку
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            const isNowDark = document.body.classList.contains('dark-theme');
            
            // Меняем иконку кнопки
            themeToggle.textContent = isNowDark ? '☀️ Тема' : '🌙 Тема';
            
            // Сохраняем выбор в localStorage
            localStorage.setItem('darkTheme', isNowDark);
            
            // Анимация переключения
            themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 100);
            
            console.log(`Тема изменена: ${isNowDark ? 'Темная' : 'Светлая'}`);
        });
    }
    
    // Автоматическое переключение по времени (опционально)
    function autoThemeByTime() {
        const hour = new Date().getHours();
        const isNightTime = hour >= 20 || hour <= 6; // С 20:00 до 6:00
        
        if (isNightTime && !document.body.classList.contains('dark-theme')) {
            document.body.classList.add('dark-theme');
            if (themeToggle) themeToggle.textContent = '☀️ Тема';
            localStorage.setItem('darkTheme', true);
            console.log('Автоматически включена темная тема (ночное время)');
        }
    }
    
    // Проверяем время при загрузке
    autoThemeByTime();
}