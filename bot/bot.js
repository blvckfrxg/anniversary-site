const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Замените на ваш токен
const TOKEN = '8345921861:AAGdxBroNKkBXDMjkJO7YgO1vUyBgDCb8N8';
// Замените на ваш Chat ID
const CHAT_ID = '1937410406';

// Создаем бота
const bot = new TelegramBot(TOKEN, { polling: true });

console.log('Бот запущен! 🤖');

// Обработка команд
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '💌 Привет! Это бот для сайта годовщины. Здесь ты можешь получать сообщения от своей второй половинки ❤️');
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '💌 Этот бот получает сообщения с сайта годовщины. Просто поделись своими чувствами на сайте, и они придут сюда! 💖');
});

// Функция для отправки сообщений
function sendMessage(text) {
    return bot.sendMessage(CHAT_ID, `💌 Новое сообщение от моей любимой:\n\n"${text}"\n\nОтправлено с сайта годовщины ❤️`);
}

// MIME типы для файлов
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif'
};

// Создаем HTTP сервер
const server = http.createServer((req, res) => {
    // Разрешаем CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    
    // API endpoint для отправки сообщений
    if (req.method === 'POST' && pathname === '/api/send-message') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const { text } = data;
                
                if (!text) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Текст сообщения обязателен' }));
                    return;
                }
                
                // Отправляем сообщение в Telegram
                await sendMessage(text);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Сообщение успешно отправлено!' }));
            } catch (error) {
                console.error('Ошибка отправки сообщения:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }
    
    // Обслуживание статических файлов
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    const filePath = path.join(__dirname, '../public', pathname);
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Файл не найден
                res.writeHead(404);
                res.end('404 - Страница не найдена');
            } else {
                // Другая ошибка
                res.writeHead(500);
                res.end('500 - Внутренняя ошибка сервера');
            }
        } else {
            // Успешно отправляем файл
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Получаем локальный IP адрес
function getLocalIP() {
    const interfaces = require('os').networkInterfaces();
    for (let interfaceName in interfaces) {
        const interface = interfaces[interfaceName];
        for (let i = 0; i < interface.length; i++) {
            const alias = interface[i];
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

const PORT = process.env.PORT || 3000;
const LOCAL_IP = getLocalIP();

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🎉 Сайт запущен!`);
    console.log(`💻 Локально: http://localhost:${PORT}`);
    console.log(`📱 В сети: http://${LOCAL_IP}:${PORT}`);
    console.log(`🤖 Бот активен и готов принимать сообщения!`);
});