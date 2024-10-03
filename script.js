const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const pacman = document.createElement('div');
pacman.classList.add('pacman');
gameArea.appendChild(pacman);
const endGameModal = document.getElementById('endGameModal');
const restartButton = document.getElementById('restartButton');
const exitButton = document.getElementById('exitButton');

let score = 0;
let level = 1;
let dots = [];
let dotCount = getRandomDotCount();
let pacmanX = 0;
let pacmanY = 0;
const moveDistance = 10;

// 初始化游戏
function initGame() {
    clearDots();
    createDots();
    updateDisplay();
}

// 创建豆子
function createDots() {
    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.style.top = `${Math.random() * 390}px`;
        dot.style.left = `${Math.random() * 390}px`;
        gameArea.appendChild(dot);
        dots.push(dot);
    }
}

// 清除豆子
function clearDots() {
    dots.forEach(dot => dot.remove());
    dots = [];
}

// 更新显示
function updateDisplay() {
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
}

// 随机生成豆子数量
function getRandomDotCount() {
    return Math.floor(Math.random() * 10) + 5; // 每关随机生成 5-15 颗豆子
}

// 监听键盘事件
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        pacmanY = Math.max(0, pacmanY - moveDistance);
    } else if (event.key === 'ArrowDown') {
        pacmanY = Math.min(370, pacmanY + moveDistance);
    } else if (event.key === 'ArrowLeft') {
        pacmanX = Math.max(0, pacmanX - moveDistance);
    } else if (event.key === 'ArrowRight') {
        pacmanX = Math.min(370, pacmanX + moveDistance);
    }

    pacman.style.top = `${pacmanY}px`;
    pacman.style.left = `${pacmanX}px`;

    checkCollision();
});

// 检查碰撞
function checkCollision() {
    dots.forEach((dot, index) => {
        const rect1 = pacman.getBoundingClientRect();
        const rect2 = dot.getBoundingClientRect();

        if (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        ) {
            dot.remove();
            dots.splice(index, 1);
            score++;
            updateDisplay();

            // 检查是否完成当前关卡
            if (dots.length === 0) {
                level++;
                if (level > 255) {
                    endGame();
                } else {
                    score = 0; // 清空分数
                    dotCount = getRandomDotCount();
                    initGame();
                }
            }
        }
    });
}

// 游戏结束
function endGame() {
    endGameModal.style.display = 'flex'; // 显示模态框
}

// 重新开始游戏
function restartGame() {
    score = 0;
    level = 1;
    initGame();
    endGameModal.style.display = 'none'; // 隐藏模态框
}

// 退出游戏
function exitGame() {
    window.close(); // 关闭窗口
}

// 保存进度
function saveProgress() {
    const progress = {
        score: score,
        level: level,
        dots: dots.length
    };
    localStorage.setItem('pacmanProgress', JSON.stringify(progress));
}

// 加载进度
function loadProgress() {
    const savedProgress = localStorage.getItem('pacmanProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        score = progress.score;
        level = progress.level;
        dotCount = getRandomDotCount(); // 重新生成豆子数量
        initGame();
    } else {
        initGame();
    }
}

// 监听按钮事件
restartButton.addEventListener('click', restartGame);
exitButton.addEventListener('click', exitGame);

// 监听窗口关闭事件，保存进度
window.addEventListener('beforeunload', saveProgress);

// 页面加载时加载进度
loadProgress();