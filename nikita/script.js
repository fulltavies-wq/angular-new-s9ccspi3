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
        
        // Показываем уведомление через очередь
        queueNotification({
            type: 'success',
            title: 'Товар добавлен!',
            text: `${name} - ${price} руб.`,
            icon: '🛒'
        });
        
        // Анимация кнопки
        this.textContent = 'Добавлено!';
        this.style.backgroundColor = '#2ecc71';
        this.style.color = 'white';
        
        setTimeout(() => {
            this.textContent = 'Добавить в заказ';
            this.style.backgroundColor = '';
            this.style.color = '';
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
                
                // Уведомление об удалении
                queueNotification({
                    type: 'error',
                    title: 'Товар удален',
                    text: 'Товар удален из корзины',
                    icon: '🗑️',
                    duration: 2000
                });
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
    if (cart.length === 0) {
        showNotification({
            type: 'error',
            title: 'Корзина пуста',
            text: 'Нет товаров для очистки',
            icon: '🤷',
            duration: 3000
        });
        return;
    }
    
    // Показываем подтверждение
    queueNotification({
        type: 'error',
        title: 'Очистить корзину?',
        text: `Всего ${cart.length} товаров`,
        icon: '⚠️',
        duration: 4000
    });
    
    // Даем 3 секунды на отмену
    setTimeout(() => {
        if (confirm('Очистить всю корзину?')) {
            cart = [];
            totalPrice = 0;
            updateCartDisplay();
            saveCartToLocalStorage();
            
            showNotification({
                type: 'success',
                title: 'Корзина очищена',
                text: 'Все товары удалены',
                icon: '✅',
                duration: 3000
            });
        }
    }, 1000);
});

// Оформление заказа
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification({
            type: 'error',
            title: 'Корзина пуста!',
            text: 'Добавьте товары перед оформлением',
            icon: '❌',
            duration: 4000
        });
        return;
    }
    
    let orderMessage = '🍽️ ВАШ ЗАКАЗ 🍽️\n\n';
    cart.forEach(item => {
        orderMessage += `• ${item.name}: ${item.price} руб.\n`;
    });
    orderMessage += `\n💰 ИТОГО: ${totalPrice} руб.\n\n`;
    
    if (totalPrice >= 1500) {
        orderMessage += '🎉 Вы получили БЕСПЛАТНУЮ ДОСТАВКУ!\n';
        
        queueNotification({
            type: 'delivery',
            title: 'Бесплатная доставка!',
            text: 'Ваш заказ будет доставлен бесплатно',
            icon: '🚚',
            duration: 4000
        });
    } else {
        orderMessage += `📦 До бесплатной доставки осталось: ${1500 - totalPrice} руб.\n`;
    }
    
    orderMessage += `📞 С вами свяжутся для подтверждения заказа.\n`;
    orderMessage += `⏱️ Время доставки: 45-60 минут`;
    
    showNotification({
        type: 'success',
        title: 'Заказ оформлен!',
        text: `На сумму: ${totalPrice} руб.`,
        icon: '✅',
        duration: 5000
    });
    
    setTimeout(() => {
        alert(orderMessage);
    }, 600);
    
    cart = [];
    totalPrice = 0;
    updateCartDisplay();
    saveCartToLocalStorage();
});

// ========== 2. ТАЙМЕР АКЦИИ ==========
function updatePromotionTimer() {
    const timerElement = document.getElementById('promo-timer');
    if(!timerElement) return;
    
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
        
        // Уведомление только при первом достижении
        if (totalPrice - cart[cart.length-1]?.price < 1500) {
            queueNotification({
                type: 'delivery',
                title: 'Бесплатная доставка!',
                text: 'Вы получили бесплатную доставку',
                icon: '🎁',
                duration: 4000
            });
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

// ========== 5. ФИЛЬТРЫ МЕНЮ ==========
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
                    } else if (filter === 'all' || category.includes(filter)) {
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
        let currentCount = Math.floor(Math.random() * 30) + 15;
        onlineCount.textContent = currentCount;
        
        setInterval(() => {
            const change = Math.floor(Math.random() * 5) - 2;
            currentCount = Math.max(10, currentCount + change);
            onlineCount.textContent = currentCount;
            
            onlineCount.style.transform = 'scale(1.2)';
            setTimeout(() => {
                onlineCount.style.transform = 'scale(1)';
            }, 300);
        }, 30000);
    }
}

// ========== 9. БЛЮДО ДНЯ ==========
function setupDaySpecial() {
    const dayDishElement = document.getElementById('day-dish');
    const dayDishOrderBtn = document.getElementById('day-dish-order');
    
    if (!dayDishElement || !dayDishOrderBtn) return;
    
    const daySpecialMenu = {
        0: {
            name: "Утиные ножки «Конфи»",
            originalPrice: 899,
            discount: 20,
            category: "main"
        },
        1: {
            name: "Салат 'Цезарь' (350гр.)",
            originalPrice: 379,
            discount: 15,
            category: "zakuski"
        },
        2: {
            name: "Пельмени (400гр.)",
            originalPrice: 299,
            discount: 25,
            category: "main"
        },
        3: {
            name: "Борщ с говядиной",
            originalPrice: 319,
            discount: 20,
            category: "soups"
        },
        4: {
            name: "Банановые панкейки с кленовым сиропом",
            originalPrice: 419,
            discount: 18,
            category: "zakuski"
        },
        5: {
            name: "Утопенцы по-чешски",
            originalPrice: 499,
            discount: 15,
            category: "main"
        },
        6: {
            name: "Суп «Харчо» с курицей и рисом",
            originalPrice: 319,
            discount: 30,
            category: "soups"
        }
    };
    
    const today = new Date().getDay();
    const todaySpecial = daySpecialMenu[today];
    
    if (todaySpecial) {
        const discountPrice = Math.round(todaySpecial.originalPrice * (1 - todaySpecial.discount / 100));
        
        dayDishElement.textContent = todaySpecial.name;
        
        const discountElement = document.querySelector('.discount');
        if (discountElement) {
            discountElement.textContent = `-${todaySpecial.discount}%`;
        }
        
        const oldPriceElement = document.querySelector('.old-price');
        const newPriceElement = document.querySelector('.special-price strong');
        
        if (oldPriceElement) {
            oldPriceElement.textContent = todaySpecial.originalPrice;
        }
        if (newPriceElement) {
            newPriceElement.textContent = `${discountPrice} руб.`;
        }
        
        dayDishOrderBtn.addEventListener('click', function() {
            cart.push({ 
                name: `${todaySpecial.name} (Блюдо дня -${todaySpecial.discount}%)`, 
                price: discountPrice 
            });
            totalPrice += discountPrice;
            
            updateCartDisplay();
            
            queueNotification({
                type: 'discount',
                title: 'Блюдо дня со скидкой!',
                text: `${todaySpecial.name} -${todaySpecial.discount}%`,
                icon: '🎯',
                duration: 4000
            });
            
            this.textContent = 'Добавлено!';
            this.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
            this.style.color = 'white';
            
            setTimeout(() => {
                this.textContent = 'Заказать блюдо дня';
                this.style.background = 'linear-gradient(135deg, #f1c40f, #f39c12)';
                this.style.color = '#2c3e50';
            }, 2000);
        });
        
        console.log(`🍽️ Блюдо дня: ${todaySpecial.name} -${todaySpecial.discount}% = ${discountPrice} руб.`);
    }
}

// ========== 10. ТЕМНАЯ ТЕМА ==========
function setupDarkTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const darkThemeCSS = document.getElementById('dark-theme-css');
    
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        if (themeToggle) themeToggle.textContent = '☀️ Тема';
    }
    
    if (!darkThemeCSS) {
        const link = document.createElement('link');
        link.id = 'dark-theme-css';
        link.rel = 'stylesheet';
        link.href = 'dark-theme.css';
        document.head.appendChild(link);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            const isNowDark = document.body.classList.contains('dark-theme');
            
            themeToggle.textContent = isNowDark ? '☀️ Тема' : '🌙 Тема';
            
            localStorage.setItem('darkTheme', isNowDark);
            
            queueNotification({
                type: 'success',
                title: 'Тема изменена',
                text: isNowDark ? 'Темная тема включена' : 'Светлая тема включена',
                icon: isNowDark ? '🌙' : '☀️',
                duration: 3000
            });
            
            themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 100);
        });
    }
    
    function autoThemeByTime() {
        const hour = new Date().getHours();
        const isNightTime = hour >= 20 || hour <= 6;
        
        if (isNightTime && !document.body.classList.contains('dark-theme')) {
            document.body.classList.add('dark-theme');
            if (themeToggle) themeToggle.textContent = '☀️ Тема';
            localStorage.setItem('darkTheme', true);
            
            queueNotification({
                type: 'delivery',
                title: 'Автоматическая тема',
                text: 'Включена темная тема (ночное время)',
                icon: '🌃',
                duration: 4000
            });
        }
    }
    
    autoThemeByTime();
}

// ========== 11. УВЕДОМЛЕНИЯ ==========
function showNotification(options = {}) {
    const {
        type = 'success',
        title = 'Товар добавлен',
        text = '',
        duration = 3000,
        icon = '🛒'
    } = options;
    
    let notification;
    
    switch(type) {
        case 'delivery':
            notification = document.getElementById('delivery-notification');
            break;
        default:
            notification = document.getElementById('cart-notification');
    }
    
    if (!notification) return;
    
    const titleElement = notification.querySelector('.notification-title');
    const textElement = notification.querySelector('.notification-text');
    const iconElement = notification.querySelector('.notification-icon');
    const timeElement = notification.querySelector('.notification-time');
    
    if (titleElement) titleElement.textContent = title;
    if (textElement) textElement.textContent = text;
    if (iconElement) iconElement.textContent = icon;
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        timeElement.textContent = timeString;
    }
    
    notification.className = 'cart-notification';
    if (type !== 'success') {
        notification.classList.add(`${type}-notification`);
    }
    
    notification.classList.remove('hide');
    notification.classList.add('show');
    
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        const closeHandler = () => hideNotification(notification);
        closeBtn.onclick = closeHandler;
    }
    
    if (duration > 0) {
        setTimeout(() => {
            hideNotification(notification);
        }, duration);
    }
    
    playNotificationSound(type);
}

function hideNotification(notification) {
    if (!notification) return;
    
    notification.classList.remove('show');
    notification.classList.add('hide');
    
    setTimeout(() => {
        notification.className = 'cart-notification';
    }, 500);
}

function playNotificationSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'success':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                break;
            case 'delivery':
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
                oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2);
                break;
            case 'discount':
                oscillator.frequency.setValueAtTime(700, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.1);
                oscillator.frequency.exponentialRampToValueAtTime(700, audioContext.currentTime + 0.2);
                break;
            case 'error':
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
                break;
            default:
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.2);
        }
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Аудио не поддерживается
    }
}

let notificationQueue = [];
let isNotificationShowing = false;

function queueNotification(options) {
    notificationQueue.push(options);
    
    if (!isNotificationShowing) {
        showNextNotification();
    }
}

function showNextNotification() {
    if (notificationQueue.length === 0) {
        isNotificationShowing = false;
        return;
    }
    
    isNotificationShowing = true;
    const options = notificationQueue.shift();
    
    showNotification({
        ...options,
        duration: 2500
    });
    
    setTimeout(() => {
        showNextNotification();
    }, 3000);
}

// ========== 12. ЕДИНАЯ ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Страница загружена!');
    
    loadCartFromLocalStorage();
    updatePromotionTimer();
    setupMenuFilters();
    updateOnlineCounter();
    setupDaySpecial();
    setupDarkTheme();
    
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
    
    queueNotification({
        type: 'success',
        title: 'Добро пожаловать!',
        text: 'Кафе Cooking готово к заказу',
        icon: '👋',
        duration: 4000
    });
});