document.addEventListener('DOMContentLoaded', () => {
    // 获取Canvas元素和上下文
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // 获取游戏相关DOM元素
    const scoreElement = document.getElementById('score');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const speedOptions = document.querySelectorAll('input[name="speed"]'); // 获取速度选项
    
    // 游戏配置
    const gridSize = 20; // 每个网格的大小
    const gridWidth = canvas.width / gridSize; // 网格宽度数量
    const gridHeight = canvas.height / gridSize; // 网格高度数量
    
    // 可选的食物 Emoji
    const foodEmojis = ['🍎', '🥕', '🍓', '🍉', '🍖', '🍗', '🍔', '🥦', '🌽', '🍇'];
    
    // 游戏状态
    let snake = []; // 蛇身体，每个元素是一个{x, y}对象
    let food = {}; // 食物位置
    let direction = ''; // 当前移动方向
    let nextDirection = ''; // 下一次移动方向
    let gameRunning = false; // 游戏是否在运行
    let gameOver = false; // 游戏是否结束
    let score = 0; // 得分
    let gameLoopInterval = null; // 游戏循环定时器, 初始化为 null
    let currentSpeed = 150; // 当前游戏速度, 默认中速
    
    // 初始化游戏
    function initGame() {
        // 初始化蛇，从中心开始
        snake = [{
            x: Math.floor(gridWidth / 2),
            y: Math.floor(gridHeight / 2)
        }];
        
        // 生成第一个食物
        generateFood();
        
        // 设置初始方向
        direction = '';
        nextDirection = '';
        
        // 重置游戏状态
        gameRunning = false;
        gameOver = false;
        score = 0;
        scoreElement.textContent = score;
        
        // 启用速度选择
        speedOptions.forEach(option => option.disabled = false);
        // 确保清除定时器 (防御性)
        if (gameLoopInterval) {
             clearInterval(gameLoopInterval);
             gameLoopInterval = null;
        }
        
        // 绘制初始游戏画面
        drawGame();
    }
    
    // 生成食物，确保不与蛇身重叠
    function generateFood() {
        let newFoodPosition;
        let foodOnSnake;
        let randomEmoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)]; // 随机选一个 Emoji
        
        do {
            foodOnSnake = false;
            newFoodPosition = {
                x: Math.floor(Math.random() * gridWidth),
                y: Math.floor(Math.random() * gridHeight)
            };
            
            // 检查是否与蛇身重叠
            for (let segment of snake) {
                if (segment.x === newFoodPosition.x && segment.y === newFoodPosition.y) {
                    foodOnSnake = true;
                    break;
                }
            }
        } while (foodOnSnake);
        
        food = { ...newFoodPosition, emoji: randomEmoji }; // 存储位置和 Emoji
    }
    
    // 绘制游戏
    function drawGame() {
        // 清除画布并设置背景色
        ctx.fillStyle = '#0f172a'; // 深蓝紫色背景
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 1. 绘制网格背景
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)'; // 半透明青色网格线
        ctx.lineWidth = 1; // 稍微加粗一点
        for (let x = 0; x <= gridWidth; x++) {
            ctx.beginPath();
            ctx.moveTo(x * gridSize, 0);
            ctx.lineTo(x * gridSize, canvas.height);
            ctx.stroke();
        }
         for (let y = 0; y <= gridHeight; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * gridSize);
            ctx.lineTo(canvas.width, y * gridSize);
            ctx.stroke();
        }
        
        // 2. 绘制蛇 (赛博朋克风格)
        const cornerRadius = gridSize * 0.25; // 可以稍微方一点
        ctx.lineWidth = 1.5; 
        ctx.strokeStyle = '#fcee0a'; // 亮黄色描边

        for (let i = 0; i < snake.length; i++) {
            const segment = snake[i];
            const x = segment.x * gridSize;
            const y = segment.y * gridSize;

            if (i === 0) { // 蛇头
                ctx.fillStyle = '#ff00ff'; // 品红色头部
            } else { // 蛇身
                // 身体用青色，但饱和度低一点
                ctx.fillStyle = '#00aaaa'; 
            }
            
            // 绘制圆角矩形
            ctx.beginPath();
            ctx.roundRect(x + 1, y + 1, gridSize - 2, gridSize - 2, cornerRadius);
            ctx.fill();
            ctx.stroke(); // 添加亮黄描边

            // 给蛇头添加眼睛
            if (i === 0) {
                ctx.fillStyle = '#fcee0a'; // 亮黄色眼睛
                const eyeSize = gridSize * 0.15; // 眼睛大一点
                let eye1X, eye1Y, eye2X, eye2Y;

                // 根据移动方向确定眼睛位置
                 switch (direction) {
                    case 'up':
                        eye1X = x + gridSize * 0.3;
                        eye1Y = y + gridSize * 0.3;
                        eye2X = x + gridSize * 0.7;
                        eye2Y = y + gridSize * 0.3;
                        break;
                    case 'down':
                        eye1X = x + gridSize * 0.3;
                        eye1Y = y + gridSize * 0.7;
                        eye2X = x + gridSize * 0.7;
                        eye2Y = y + gridSize * 0.7;
                        break;
                    case 'left':
                        eye1X = x + gridSize * 0.3;
                        eye1Y = y + gridSize * 0.3;
                        eye2X = x + gridSize * 0.3;
                        eye2Y = y + gridSize * 0.7;
                        break;
                    case 'right':
                    default: // 包括初始状态
                        eye1X = x + gridSize * 0.7;
                        eye1Y = y + gridSize * 0.3;
                        eye2X = x + gridSize * 0.7;
                        eye2Y = y + gridSize * 0.7;
                        break;
                }

                ctx.beginPath();
                ctx.arc(eye1X, eye1Y, eyeSize, 0, Math.PI * 2);
                ctx.arc(eye2X, eye2Y, eyeSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // 3. 绘制食物 (保持 Emoji)
        ctx.font = `${gridSize * 0.85}px Arial`; // 稍微调大一点
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // 添加阴影让 Emoji 更突出
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'; // 阴影更深
        ctx.shadowBlur = 8;
        ctx.fillText(food.emoji, food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2);
        // 清除阴影，避免影响后续绘制
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        // 4. 如果游戏结束，绘制游戏结束文字 (赛博朋克风格)
        if (gameOver) {
            ctx.fillStyle = 'rgba(10, 15, 26, 0.9)'; // 更暗的遮罩
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'var(--cyber-primary)'; // 青色文字
            ctx.font = 'bold 52px Orbitron, sans-serif'; // 使用 Orbitron 字体并更大
            ctx.textAlign = 'center';
            ctx.shadowColor = 'var(--cyber-primary)'; // 青色辉光
            ctx.shadowBlur = 15;
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 45);
            
            ctx.fillStyle = '#cbd5e1'; // 浅蓝灰色分数文字
            ctx.font = '32px Orbitron, sans-serif';
            ctx.shadowColor = 'transparent'; // 分数不需要辉光
            ctx.shadowBlur = 0;
            ctx.fillText(`SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 35);
            // 清除阴影 (以防万一)
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }
    }
    
    // 游戏主循环
    function gameLoop() {
        if (!gameRunning || gameOver) return;
        
        // 更新方向
        direction = nextDirection;
        
        // 如果没有方向，不移动
        if (!direction) return;
        
        // 获取蛇头
        const head = {...snake[0]};
        
        // 根据方向移动蛇头
        switch (direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
        
        // 检查是否撞墙
        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
            endGame();
            return;
        }
        
        // 检查是否撞到自己
        for (let segment of snake) {
            if (segment.x === head.x && segment.y === head.y) {
                endGame();
                return;
            }
        }
        
        // 将新头部添加到蛇身
        snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            // 增加分数
            score += 10;
            scoreElement.textContent = score;
            
            // 生成新食物
            generateFood();
        } else {
            // 如果没吃到食物，移除尾部
            snake.pop();
        }
        
        // 重新绘制游戏
        drawGame();
    }
    
    // 结束游戏
    function endGame() {
        gameRunning = false;
        gameOver = true;
        if (gameLoopInterval) {
            clearInterval(gameLoopInterval);
            gameLoopInterval = null;
        }
        drawGame(); // 绘制最后的游戏结束画面
        startBtn.style.display = 'none';
        restartBtn.style.display = 'block';
        // 启用速度选择
        speedOptions.forEach(option => option.disabled = false);
    }
    
    // 开始游戏
    function startGame() {
        if (gameRunning) return;
        
        // 获取选定的速度
        currentSpeed = 150; // 重置为默认值以防万一
        speedOptions.forEach(option => {
            if (option.checked) {
                currentSpeed = parseInt(option.value, 10);
            }
        });
        
        // 禁用速度选择
        speedOptions.forEach(option => option.disabled = true);
        
        // 确保清除任何可能残留的定时器
        if (gameLoopInterval) {
            clearInterval(gameLoopInterval);
            gameLoopInterval = null;
        }
        
        if (gameOver) {
            // initGame() 会重置状态并启用速度选项，
            // 但因为我们是在开始游戏流程中，所以状态重置后需要立即再次禁用速度选项
            initGame();
            speedOptions.forEach(option => option.disabled = true);
        } else if (!snake || snake.length === 0) {
             // 处理直接点击开始的情况 (非 game over)
             initGame();
             speedOptions.forEach(option => option.disabled = true);
        }
        
        gameRunning = true;
        gameOver = false;
        
        // 使用选定的速度启动游戏循环
        gameLoopInterval = setInterval(gameLoop, currentSpeed);
        
        startBtn.style.display = 'none';
        restartBtn.style.display = 'block';
    }
    
    // 重启游戏
    function restartGame() {
        // 调用 startGame 时会获取最新的速度设置
        initGame();
        startGame();
    }
    
    // 键盘事件监听
    document.addEventListener('keydown', (event) => {
        if (!gameRunning) return;
        
        // 根据按键设置下一个方向
        // 禁止直接180度转向（无法直接向相反方向移动）
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    });
    
    // 触摸屏滑动支持
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        event.preventDefault();
    }, { passive: false });
    
    canvas.addEventListener('touchmove', (event) => {
        if (!gameRunning || !touchStartX || !touchStartY) return;
        
        const touchEndX = event.touches[0].clientX;
        const touchEndY = event.touches[0].clientY;
        
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // 判断滑动方向
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // 水平方向滑动
            if (diffX > 0 && direction !== 'left') {
                nextDirection = 'right';
            } else if (diffX < 0 && direction !== 'right') {
                nextDirection = 'left';
            }
        } else {
            // 垂直方向滑动
            if (diffY > 0 && direction !== 'up') {
                nextDirection = 'down';
            } else if (diffY < 0 && direction !== 'down') {
                nextDirection = 'up';
            }
        }
        
        touchStartX = touchEndX;
        touchStartY = touchEndY;
        event.preventDefault();
    }, { passive: false });
    
    // 绑定按钮事件
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);
    
    // 初始化游戏
    initGame();
}); 