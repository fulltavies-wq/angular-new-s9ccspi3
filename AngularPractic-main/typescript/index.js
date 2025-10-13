"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
class DZ {
    constructor() { }
    typeFunction() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Введите ваш возраст: ', (input) => {
            rl.close();
            // let age: number = Math.floor(Math.random()*100); 
            // Рандомный вариант
            let age = Number(input);
            if (age < 18) {
                console.log('Доступ запрещен');
                return;
            }
            else if (age >= 18) {
                for (let i = 1; i < 11; i++) {
                    console.log(`${age} * ${i} = ${age * i}`);
                }
            }
        });
    }
    function(num1, num2, oper) {
        const operators = '+-*/';
        switch (operators.indexOf(oper)) {
            case 0: return num1 + num2;
            case 1: return num1 - num2;
            case 2: return num1 * num2;
            case 3: return num1 / num2;
            default: return 0;
        }
    }
    arrayObject() {
        const products = [
            { name: "Ноутбук Dell XPS 13", price: 89990, inStock: true },
            { name: "Смартфон iPhone 14 Pro", price: 99990, inStock: false },
            { name: "Наушники Sony WH-1000XM4", price: 24990, inStock: true },
            { name: "Планшет Samsung Galaxy Tab S8", price: 54990, inStock: true },
            { name: "Умные часы Apple Watch Series 8", price: 32990, inStock: false },
            { name: "Игровая консоль PlayStation 5", price: 49990, inStock: true },
            { name: "Фитнес-браслет Xiaomi Mi Band 7", price: 2990, inStock: true },
            { name: "Монитор LG 27GL850", price: 42990, inStock: true },
            { name: "Клавиатура Logitech MX Keys", price: 8990, inStock: false },
            { name: "Мышь Razer DeathAdder V2", price: 5990, inStock: true },
            { name: "Внешний жесткий диск WD 2TB", price: 6490, inStock: true },
            { name: "Роутер TP-Link Archer AX73", price: 12990, inStock: false },
            { name: "Электронная книга Amazon Kindle", price: 8990, inStock: true },
            { name: "Колонка JBL Flip 6", price: 11990, inStock: true },
            { name: "Веб-камера Logitech C920", price: 7990, inStock: true },
            { name: "Принтер HP LaserJet Pro", price: 18990, inStock: false },
            { name: "SSD накопитель Samsung 1TB", price: 8990, inStock: true },
            { name: "Микрофон Blue Yeti", price: 15990, inStock: true },
            { name: "Игровой стул DXRacer", price: 34990, inStock: false },
            { name: "Пауэрбанк Xiaomi 20000mAh", price: 2490, inStock: true }
        ];
        let inStockProducts = products.filter((product) => product.inStock == true);
        console.log(`Товары в наличии: `);
        console.log(inStockProducts);
        let productsPrice = inStockProducts.map((product) => product.price);
        console.log(`Цены товаров: ${productsPrice}`);
        let commonPrice = 0;
        for (let i = 0; i < productsPrice.length; i++) {
            commonPrice += productsPrice[i];
        }
        console.log(`Общая цена: ${commonPrice}`);
        let sortedProducts = inStockProducts.sort((price1, price2) => price1.price - price2.price);
        console.log(`Отсортированные по цене товары в наличии: `);
        console.log(sortedProducts);
    }
    async dataFetch() {
        let response = await fetch('https://jsonplaceholder.typicode.com/posts');
        let users = await response.json();
        let usersId = [];
        for (let i = 0; i < users.length; i++) {
            if (!usersId.includes(users[i].userId)) {
                usersId.push(users[i].userId);
            }
        }
        console.log(usersId);
    }
}
const domashka = new DZ;
// domashka.arrayObject()
domashka.dataFetch();
