const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const path = require('path');

// Замените на ваш токен
const TOKEN = '8345921861:AAGdxBroNKkBXDMjkJO7YgO1vUyBgDCb8N8';
// Замените на ваш Chat ID
const CHAT_ID = '1937410406';

// Создаем бота
let bot;
if (TOKEN !== 'YOUR_BOT_TOKEN_HERE' && CHAT_ID !== 'YOUR_CHAT_ID_HERE') {
    bot = new TelegramBot(TOKEN, { polling: true });
    console.log('Бот запущен! 🤖');
} else {
    console.log('Токен или Chat ID не установлены. Бот не активен.');
}

// Создаем Express сервер
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Обработка команд (если бот активен)
if (bot) {
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, '💌 Привет! Это бот для сайта годовщины. Здесь ты можешь получать сообщения от своей второй половинки ❤️');
    });

    bot.onText(/\/help/, (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, '💌 Этот бот получает сообщения с сайта годовщины. Просто поделись своими чувствами на сайте, и они придут сюда! 💖');
    });
}

// API endpoint для отправки сообщений
app.post('/api/send-message', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.json({ success: false, error: 'Текст сообщения обязателен' });
        }
        
        // Отправляем сообщение в Telegram (если бот активен)
        if (bot) {
            await bot.sendMessage(CHAT_ID, `💌 Новое сообщение от моей любимой:\n\n"${text}"\n\nОтправлено с сайта годовщины ❤️`);
            res.json({ success: true, message: 'Сообщение успешно отправлено!' });
        } else {
            // Для тестирования без Telegram
            console.log('Тестовое сообщение:', text);
            res.json({ success: true, message: 'Сообщение получено (Telegram отключен для тестирования)' });
        }
    } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
        res.json({ success: false, error: error.message });
    }
});

// Обслуживание главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Открой http://localhost:${PORT} в браузере`);
    
    if (!bot) {
        console.log('\n⚠️  ВНИМАНИЕ: Бот Telegram не активен!');
        console.log('Убедитесь, что установлены переменные окружения TOKEN и CHAT_ID');
    }
});

// Обработка ошибок бота (если бот активен)
if (bot) {
    bot.on('polling_error', (error) => {
        console.error('Ошибка polling:', error);
    });
}