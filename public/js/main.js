// Дата начала отношений: 14 сентября 2023, 08:50
const startDate = new Date('2023-09-14T00:00:00');
// Дата следующей годовщины: 14 сентября 2025
const nextAnniversary = new Date('2026-09-14T00:00:00');

// Для теста
let answers = {
    gifts: 0,
    words: 0,
    time: 0,
    touch: 0,
    service: 0
};

function updateTimer() {
    const now = new Date();
    const diff = now - startDate;
    
    // Вычисляем разницу во времени
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Обновляем значения на странице
    document.getElementById('days').textContent = String(days).padStart(3, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    
    // Обратный отсчет до годовщины
    const countdownDiff = nextAnniversary - now;
    if (countdownDiff > 0) {
        const cdDays = Math.floor(countdownDiff / (1000 * 60 * 60 * 24));
        const cdHours = Math.floor((countdownDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const cdMinutes = Math.floor((countdownDiff % (1000 * 60 * 60)) / (1000 * 60));
        const cdSeconds = Math.floor((countdownDiff % (1000 * 60)) / 1000);
        
        document.getElementById('countdown-days').textContent = String(cdDays).padStart(3, '0');
        document.getElementById('countdown-hours').textContent = String(cdHours).padStart(2, '0');
        document.getElementById('countdown-minutes').textContent = String(cdMinutes).padStart(2, '0');
        document.getElementById('countdown-seconds').textContent = String(cdSeconds).padStart(2, '0');
    }
}

// Обновляем таймер каждую секунду
setInterval(updateTimer, 1000);
// И сразу запускаем первый раз
updateTimer();

// Параллакс фона (только на больших экранах)
function handleParallax(e) {
    if (window.innerWidth > 768) { // Только на десктопах
        const x = (window.innerWidth - e.pageX) / 100;
        const y = (window.innerHeight - e.pageY) / 100;
        document.body.style.backgroundPosition = `${x}px ${y}px`;
    }
}

document.addEventListener('mousemove', handleParallax);

function showSlide(slideNumber) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    const targetSlide = document.getElementById(`slide${slideNumber}`);
    if (targetSlide) {
        targetSlide.classList.add('active');
    }
}

// Создание сердечек по КЛИКУ (не по движению мыши)
let lastHeartTime = 0;
function createHeart(e) {
    const now = Date.now();
    if (now - lastHeartTime < 100) return; // Ограничиваем частоту
    lastHeartTime = now;
    
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = (e.clientX - 10) + 'px';
    heart.style.top = (e.clientY - 10) + 'px';
    heart.style.fontSize = '20px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    heart.style.animation = 'floatUp 1s ease-out forwards';
    
    document.body.appendChild(heart);
    
    // Удаляем сердечко после анимации
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

// УБРАЛИ обработчик mousemove для сердечек
// Добавляем обработчик клика на весь body
document.body.addEventListener('click', createHeart);

// Добавляем CSS для анимации сердечек
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(1.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Выбор опции в тесте
function selectOption(element, type) {
    // Убираем выделение со всех опций в этом вопросе
    const question = element.closest('.question');
    const options = question.querySelectorAll('.option');
    options.forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Добавляем выделение выбранной опции
    element.classList.add('selected');
    
    // Увеличиваем счетчик для этого типа
    answers[type]++;
}

// Подсчет результата
function calculateResult() {
    const resultContent = document.getElementById('resultContent');
    const resultDiv = document.getElementById('quizResult');
    
    // Находим максимальное значение
    let maxType = '';
    let maxValue = 0;
    for (let type in answers) {
        if (answers[type] > maxValue) {
            maxValue = answers[type];
            maxType = type;
        }
    }
    
    // Сбрасываем счетчики
    answers = {
        gifts: 0,
        words: 0,
        time: 0,
        touch: 0,
        service: 0
    };
    
    // Генерируем результат
    let message = '';
    let title = '';
    
    switch(maxType) {
        case 'gifts':
            title = 'Дарение подарков 🎁';
            message = `
                <div class="language-title">${title}</div>
                <p>Ты чувствуешь любовь через подарки и сюрпризы! Для тебя важно, чтобы подарок показывал, что тебя понимают и ценят. Даже небольшие подарки имеют для тебя большое значение.</p>
                <p><strong>Для нас:</strong> Подарки не обязательно должны быть дорогими. Главное - это внимание и забота, вложенная в них. Сюрпризы и маленькие знаки внимания делают нашу связь особенной.</p>
            `;
            break;
        case 'words':
            title = 'Слова поддержки 💬';
            message = `
                <div class="language-title">${title}</div>
                <p>Ты чувствуешь любовь через слова признания, похвалы и поддержки! Для тебя важно слышать, как тебя ценят и любят. Искренние слова имеют для тебя огромную силу.</p>
                <p><strong>Для нас:</strong> Слова любви, комплименты и слова поддержки - это наша сила. Когда мы говорим друг другу, как важны друг для друга, это делает нас ближе.</p>
            `;
            break;
        case 'time':
            title = 'Качество времени ⏰';
            message = `
                <div class="language-title">${title}</div>
                <p>Ты чувствуешь любовь, когда проводите время вместе! Для тебя важно полное внимание партнера, без отвлечений. Совместно проведенные моменты - это то, что питает твою душу.</p>
                <p><strong>Для нас:</strong> Наше время вместе - это наше сокровище. Когда мы вместе, мы создаем воспоминания, которые остаются с нами навсегда. Каждый момент вместе бесценен.</p>
            `;
            break;
        case 'touch':
            title = 'Физический контакт 🤗';
            message = `
                <div class="language-title">${title}</div>
                <p>Ты чувствуешь любовь через прикосновения, объятия и физическую близость! Для тебя важно физическое выражение любви. Объятия, поцелуи и прикосновения питают твою душу.</p>
                <p><strong>Для нас:</strong> Физический контакт - это наш способ показать любовь без слов. Объятия, поцелуи и прикосновения создают особенную связь между нами.</p>
            `;
            break;
        case 'service':
            title = 'Акты служения 🤝';
            message = `
                <div class="language-title">${title}</div>
                <p>Ты чувствуешь любовь, когда за тебя что-то делают! Для тебя важно, чтобы партнер помогал и заботился о тебе. Когда кто-то делает что-то для тебя, это показывает любовь.</p>
                <p><strong>Для нас:</strong> Забота друг о друге - это наше выражение любви. Когда мы помогаем друг другу, мы показываем, что нам не все равно. Маленькие акты доброты делают нас ближе.</p>
            `;
            break;
    }
    
    resultContent.innerHTML = message;
    resultDiv.style.display = 'block';
    
    // Прокручиваем к результату
    resultDiv.scrollIntoView({ behavior: 'smooth' });
    
    // Автоматически прокручиваем вверх через 3 секунды
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 3000);
}

// Отправка сообщения через сервер
function sendMessage() {
    const message = document.getElementById('message').value.trim();
    
    if (message === '') {
        alert('Пожалуйста, напиши что-нибудь! Твои слова очень важны для меня ❤️');
        return;
    }
    
    // Показываем индикатор загрузки
    document.getElementById('sendMessageLoading').style.display = 'block';
    document.querySelector('.send-btn').style.display = 'none';
    
    // Отправка через наш сервер
    fetch('/api/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: message
        })
    })
    .then(response => response.json())
    .then(data => {
        // Скрываем индикатор загрузки
        document.getElementById('sendMessageLoading').style.display = 'none';
        document.querySelector('.send-btn').style.display = 'none';
        
        if (data.success) {
            // Успешно отправлено
            document.querySelector('.message-form').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
        } else {
            document.querySelector('.send-btn').style.display = 'block';
            alert('Ошибка отправки сообщения. Попробуй еще раз ❤️\nОшибка: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        // Скрываем индикатор загрузки
        document.getElementById('sendMessageLoading').style.display = 'none';
        document.querySelector('.send-btn').style.display = 'block';
        alert('Ошибка отправки сообщения. Попробуй еще раз ❤️\nОшибка: ' + error.message);
    });
}

// Обработка touch событий для мобильных устройств
document.body.addEventListener('touchstart', function(e) {
    // Предотвращаем двойной тап для зума на мобильных
    if (e.touches.length === 1) {
        // Можно добавить специфичную логику для тач-устройств
    }
}, { passive: true });

