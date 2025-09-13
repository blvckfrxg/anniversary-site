const express = require('express');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

// Получаем токен и Chat ID из переменных окружения
const TOKEN = process.env.TOKEN || '8345921861:AAGdxBroNKkBXDMjkJO7YgO1vUyBgDCb8N8';
const CHAT_ID = process.env.CHAT_ID || '1937410406';

// Создаем Express сервер
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы - указываем правильный путь
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint для отправки сообщений
app.post('/api/send-message', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ success: false, error: 'Текст сообщения обязателен' });
        }
        
        // Проверяем, инициализирован ли бот
        if (TOKEN !== 'YOUR_BOT_TOKEN_HERE' && CHAT_ID !== 'YOUR_CHAT_ID_HERE') {
            try {
                const bot = new TelegramBot(TOKEN, { polling: false });
                const message = `💌 Новое сообщение от моей любимой:\n\n"${text}"\n\nОтправлено с сайта годовщины ❤️`;
                await bot.sendMessage(CHAT_ID, message);
                res.json({ success: true, message: 'Сообщение успешно отправлено!' });
            } catch (error) {
                console.error('Ошибка отправки сообщения:', error);
                res.status(500).json({ success: false, error: error.message });
            }
        } else {
            // Для тестирования без Telegram
            res.json({ success: true, message: 'Сообщение получено (Telegram отключен для тестирования)' });
        }
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Обслуживание главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Открой в браузере: http://localhost:${PORT}`);
});
