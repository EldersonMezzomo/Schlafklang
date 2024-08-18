const timerBtns = document.querySelectorAll('.timer-btn');
const backgroundBtns = document.querySelectorAll('.background-btn');
const soundBtns = document.querySelectorAll('.sound-btn');
const startBtn = document.getElementById('start-btn');
const audioPlayer = document.getElementById('audio-player');
const video = document.getElementById('background-video');
const overlay = document.getElementById('overlay');
const mainContent = document.querySelector('main');
const header = document.querySelector('header');
const refreshIcon = document.getElementById('refresh-icon');

let totalTime;
let selectedSoundFolder = '';
let countdown;

// Função para destacar o botão selecionado e parar a pulsação
function selectButton(buttons, selectedBtn) {
    buttons.forEach(btn => {
        btn.classList.remove('selected', 'pulse');
        btn.classList.add('disabled');
    });
    selectedBtn.classList.add('selected');
    selectedBtn.classList.remove('disabled');
}

// Função para ativar os botões e iniciar a pulsação
function activateButtons(buttons) {
    buttons.forEach(btn => {
        btn.classList.remove('disabled');
        btn.style.pointerEvents = 'auto';
        btn.classList.add('pulse');
    });
}

// Função para ativar o modo tela cheia
function openFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
}

// Função para sair do modo tela cheia
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}

// Iniciar animação dos botões de tempo
activateButtons(timerBtns);

timerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        totalTime = parseInt(btn.getAttribute('data-time'));
        selectButton(timerBtns, btn);
        activateButtons(backgroundBtns);
    });
});

backgroundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const bg = btn.getAttribute('data-bg');
        selectButton(backgroundBtns, btn);
        activateButtons(soundBtns);

        // Substituir o vídeo "home.mp4" pelo vídeo de fundo escolhido
        if (bg === 'kerze') {
            video.src = 'assets/video/kerze.mp4';
        } else if (bg === 'fireplace') {
            video.src = 'assets/video/fireplace.mp4';
        } else if (bg === 'night-sky') {
            video.src = 'assets/video/night-sky.mp4';
        }
        video.style.opacity = '1';
        video.play();
    });
});

soundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        selectedSoundFolder = btn.getAttribute('data-sound');
        selectButton(soundBtns, btn);
        startBtn.disabled = false;
        startBtn.classList.add('pulse');
        startBtn.style.pointerEvents = 'auto';
    });
});

startBtn.addEventListener('click', () => {
    if (totalTime && selectedSoundFolder) {
        playRandomTrack(); // Reproduz a primeira música aleatória

        // Ocultar todos os elementos e trazer o vídeo para o primeiro plano
        header.classList.add('hidden-elements');
        mainContent.classList.add('hidden-elements');
        video.style.zIndex = '1';

        // Exibir o ícone de reciclagem
        refreshIcon.classList.remove('hidden-elements');

        // Ativar o modo tela cheia
        openFullscreen();

        // Configura o volume inicial para 1 (máximo)
        audioPlayer.volume = 1;

        const initialTime = totalTime; // Armazena o tempo total inicial

        countdown = setInterval(() => {
            totalTime--;

            // Atualiza o volume do áudio proporcionalmente ao tempo restante
            if (totalTime > 0) {
                audioPlayer.volume = totalTime / initialTime;
            }

            if (totalTime <= 0) {
                clearInterval(countdown);
                audioPlayer.pause();
                audioPlayer.volume = 0;
                video.style.display = 'none'; // Oculta o vídeo
                overlay.style.display = 'flex'; // Exibe a tela preta com "zzz..."
            }
        }, 1000);

        // Detectar quando a música termina e reproduzir outra se ainda houver tempo
        audioPlayer.addEventListener('ended', () => {
            if (totalTime > 0) {
                playRandomTrack();
            }
        });
    } else {
        alert('Bitte wählen Sie eine Zeit, einen Hintergrund und eine Musik aus.');
    }
});


// Função para reproduzir uma música aleatória
function playRandomTrack() {
    const trackPath = getRandomTrack(selectedSoundFolder);
    audioPlayer.src = trackPath;
    audioPlayer.play();
}

// Função para escolher uma música aleatória da pasta selecionada
function getRandomTrack(folder) {
    const tracks = {
        'ambiente': 20, // Número de músicas na pasta "audio-ambiente"
        'futurista': 20, // Número de músicas na pasta "audio-futurista"
        'romantico': 20  // Número de músicas na pasta "audio-romantico"
    };
    const randomIndex = Math.floor(Math.random() * tracks[folder]) + 1;
    return `assets/audio-${folder}/track${randomIndex}.mp3`; // Ajustado para refletir os nomes das pastas corretas
}

// Função para recarregar a página ao clicar no ícone de reciclagem
refreshIcon.addEventListener('click', () => {
    closeFullscreen();
    location.reload();
});
