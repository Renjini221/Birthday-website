document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('login-overlay');
    const mainCard = document.getElementById('main-card');
    const form = document.getElementById('details-form');
    
    const birthdayContent = document.getElementById('birthday-content');
    const countdownContainer = document.getElementById('countdown-container');
    const modeText = document.getElementById('mode-text');
    const pageTitle = document.querySelector('.title');
    const emailDisplay = document.getElementById('user-email-display');

    let balloonInterval;

    function updateClock() {
        const now = new Date();
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        document.getElementById('clock-display').textContent = now.toLocaleDateString(undefined, options);
    }
    updateClock();
    setInterval(updateClock, 1000);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const dob = new Date(document.getElementById('dob').value);
        const email = document.getElementById('email').value;

        if (username) pageTitle.textContent = `Happy Birthday ${username}!`;
        emailDisplay.textContent = email;

        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            mainCard.style.display = 'block';
            checkBirthdayStatus(dob, username);
        }, 500);
    });

    function checkBirthdayStatus(dob, username) {
        const today = new Date();
        const isBirthday = today.getDate() === dob.getDate() && today.getMonth() === dob.getMonth();

        if (isBirthday) {
            modeText.textContent = "Celebration Mode On";
            birthdayContent.style.display = 'block';
            countdownContainer.style.display = 'none';
            
            startBalloons();
        } else {
            modeText.textContent = "Anticipation Mode";
            pageTitle.textContent = "Coming Soon...";
            birthdayContent.style.display = 'none';
            countdownContainer.style.display = 'block';
            
            startCountdown(dob);
        }
    }

    function startCountdown(dob) {
        const updateTimer = () => {
            const today = new Date();
            let nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
            
            if (today > nextBirthday) {
                nextBirthday.setFullYear(today.getFullYear() + 1);
            }

            const diff = nextBirthday - today;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    const balloonLayer = document.querySelector('.balloon-layer');
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#1DD1A1'];

    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        
        const x = Math.random() * 100;
        const delay = Math.random() * 5; 
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        balloon.style.left = `${x}%`;
        balloon.style.animationDelay = `${delay}s`;
        balloon.style.backgroundColor = color;
        
        balloonLayer.appendChild(balloon);

        balloon.addEventListener('animationend', () => {
            balloon.remove();
        });
    }

    function startBalloons() {
        if (!balloonInterval) {
            for(let i=0; i<5; i++) createBalloon();
            balloonInterval = setInterval(createBalloon, 800);
        }
    }

    const confettiBtn = document.getElementById('confetti-btn');
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.size = Math.random() * 10 + 5;
            this.speedY = Math.random() * 3 + 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
        }
        update() {
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    let animationId = null;

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, index) => {
            p.y += p.speedY; 
            p.rotation += p.rotationSpeed;
            
            p.draw();
            
            if (p.y > canvas.height) particles.splice(index, 1);
        });

        if (particles.length > 0) {
            animationId = requestAnimationFrame(animateConfetti);
        } else {
            animationId = null;
        }
    }

    confettiBtn.addEventListener('click', () => {
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
        
        if (!animationId) {
            animateConfetti();
        }
    });

    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.textContent = 'Play music 🎵';
        } else {
            bgMusic.play().catch(e => alert("Please interact with the page first to play audio!"));
            musicBtn.textContent = 'Pause music ⏸️';
        }
        isPlaying = !isPlaying;
    });

    const giftBtn = document.getElementById('gift-btn');
    const hiddenMessage = document.getElementById('hidden-message');
    const messageText = "Surprise! You are cherished more than you know. Here’s to another year of adventures, laughter, and all your favorite things. 🥂";
    
    hiddenMessage.textContent = '';
      hiddenMessage.style.display = 'none'; 

    let typingInterval;

    function typeWriter(text, element, speed = 50) {
        let i = 0;;
        element.textContent = '';
        clearInterval(typingInterval);
        
        typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, speed);
    }

    giftBtn.addEventListener('click', () => {
        if (hiddenMessage.style.display == 'block') {
            hiddenMessage.style.display = 'none';
            giftBtn.textContent = 'Open gift 🎁';
            clearInterval(typingInterval); 
        } else {
            hiddenMessage.style.display = 'block';
            giftBtn.textContent = 'Close gift 🎁';
             createConfettiBurst(); 
            typeWriter(messageText, hiddenMessage);
        }
    });

    function createConfettiBurst() {
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
        if (!animationId) {
            animateConfetti();
        }
    }

    const wishBtn = document.querySelector('.wish-btn');
    
    wishBtn.addEventListener('click', () => {
        wishBtn.textContent = "Candles Lit! 🔥";
        wishBtn.style.backgroundColor = "#ffeb3b";
        wishBtn.style.color = "#d32f2f";
        wishBtn.style.borderColor = "#ff9800";
        wishBtn.style.boxShadow = "0 0 15px #ff9800, 0 0 30px #ffeb3b"; 

        for (let i = 0; i < 60; i++) {
            const p = new Particle();
            const fireColors = ['#ff0000', '#ff9800', '#ffeb3b', '#ff5722'];
            p.color = fireColors[Math.floor(Math.random() * fireColors.length)];
            p.speedY = Math.random() * -10 - 5;
            p.x = window.innerWidth / 2 + (Math.random() * 50 - 25); 
            p.y = window.innerHeight / 2 + 50; 
            particles.push(p);
        }
        
        if (!animationId) animateConfetti();
        
        wishBtn.disabled = true;
        wishBtn.style.cursor = "default";
    });

    const predictionBtn = document.getElementById('prediction-btn');
    const predictionBox = document.getElementById('prediction-result');
    
    const predictions = [
        "🔮 You will master a new skill faster than you expect!",
        "🔮 An unexpected adventure awaits you next month.",
        "🔮 Your kindness will return to you tenfold very soon.",
        "🔮 A dream you've almost forgotten will start coming true.",
        "🔮 You will find the perfect pizza topping combination.",
        "🔮 Great fortune is coming... in the form of cat memes.",
        "🔮 You will defeat your biggest bug on the first try!",
        "🔮 Someone is thinking about how awesome you are right now."
    ];

    predictionBtn.addEventListener('click', () => {
        predictionBox.style.display = 'block';
        predictionBox.innerHTML = 'Consulting the stars... <span class="spinning">🔮</span>';
        
        predictionBtn.disabled = true;
        
        setTimeout(() => {
            const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
            predictionBox.innerHTML = `🔮 ${randomPrediction}`;
            
            predictionBox.style.animation = 'none';
            predictionBox.offsetHeight; 
            predictionBox.style.animation = 'fadeIn 0.5s ease';
            
            predictionBtn.disabled = false;
        }, 1500);
    });
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    if (name) {
        document.getElementById('username').value = name;
    }

    const card = document.querySelector('.card');
    const container = document.body;

    container.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    container.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
    });

    container.addEventListener('mouseleave', () => {
        card.style.transition = 'all 0.5s ease';
        card.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });

    document.addEventListener('dblclick', (e) => {
        for(let i=0; i<5; i++){
            setTimeout(createBalloon, i * 100);
        }
    });

    const cake = document.querySelector('.cake');
    cake.addEventListener('click', () => {
        cake.style.filter = "brightness(0.8) sepia(0.2)";
        createConfettiBurst(); 
        
        setTimeout(() => {
            cake.style.filter = "none";
        }, 3000);
    });
});
