document.addEventListener('DOMContentLoaded', () => {
    // DOM元素
    const gameBoard = document.getElementById('game-board');
    const hintsElement = document.getElementById('hints');
    const clearedPairsElement = document.getElementById('cleared-pairs');
    const totalPairsElement = document.getElementById('total-pairs');
    const timerElement = document.getElementById('timer');
    const restartBtn = document.getElementById('restart-btn');
    const hintBtn = document.getElementById('hint-btn');
    const difficultySelectBtn = document.getElementById('difficulty-select-btn');
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    const themeSelectBtn = document.getElementById('theme-select-btn');

    const winOverlay = document.getElementById('win-overlay');
    const finalHintsElement = document.getElementById('final-hints');
    const finalTimeElement = document.getElementById('final-time');
    const confettiContainer = document.getElementById('confetti-container');

    const currentPlayerNameElement = document.getElementById('current-player-name');
    const changePlayerNameBtn = document.getElementById('change-player-name');
    const changeNameOverlay = document.getElementById('change-name-overlay');
    const changeNameInput = document.getElementById('change-name-input');
    const changeNameSubmit = document.getElementById('change-name-submit');
    const changeNameCancel = document.getElementById('change-name-cancel');

    const dialogOverlay = document.getElementById('dialog-overlay');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogContent = document.getElementById('dialog-content');
    const dialogConfirm = document.getElementById('dialog-confirm');
    const dialogCancel = document.getElementById('dialog-cancel');

    const difficultyOverlay = document.getElementById('difficulty-overlay');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    const difficultyClose = document.getElementById('difficulty-close');

    const themeOverlay = document.getElementById('theme-overlay');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const themeClose = document.getElementById('theme-close');

    const leaderboardOverlay = document.getElementById('leaderboard-overlay');
    const leaderboardBody = document.getElementById('leaderboard-body');
    const leaderboardClose = document.getElementById('leaderboard-close');
    const tabBtns = document.querySelectorAll('.tab-btn');

    const playerNameOverlay = document.getElementById('player-name-overlay');
    const playerNameInput = document.getElementById('player-name-input');
    const playerNameSubmit = document.getElementById('player-name-submit');

    const bodyElement = document.body;
    let lineCanvas, lineCtx; // 用于绘制连接线的Canvas

    // 游戏状态
    let board = []; // 游戏棋盘, 存储每个格子的内容，0为空
    let rows, cols; // 棋盘行列数 (包含外围空行空列)
    let displayRows, displayCols; // 实际显示的图标区域行列数
    let firstSelectedCard = null;
    let hintsLeft = 3;
    let clearedPairs = 0;
    let currentTotalPairs = 0; // 当前难度下的总配对数
    let gameTime = 0;
    let timerInterval = null;
    let gameStarted = false;
    let currentTheme = 'light'; // 'light' or 'dark'
    let currentCardTheme = 'fruits';
    let currentDifficulty = 'easy';
    let tempScore = 0;

    // 排行榜数据 (与memoryMatch类似)
    let leaderboardData = {
        easy: [],
        medium: [],
        hard: []
    };
    let playerName = localStorage.getItem('linkGamePlayerName') || '匿名';
    // API Key and ID (请替换为您自己的)
    const apiKey = '0e8b0763210c6f7f19b175a6c177ca4f'; // 替换为你的 API Key
    const apiId = '10004465';   // 替换为你的 API ID
    const apiStorageKey = 'linkGameLeaderboard'; // 用于区分存储项目的键

    const cardThemes = {
        fruits: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🥝', '🍍', '🥭', '🍑', '🥥', '🥑', '🍆', '🍐', '🫐', '🥒','🥕','🍄'],
        animals: ['🐶', '🐳', '🦖', '🐹', '🐰', '🦊','🐞', '🐻', '🐼', '🦄', '🦋', '🐤', '🐮', '🐷', '🐸', '🐒', '🐔', '🐧', '🐝','🐌'],
        foods: ['🍔', '🍕', '🌭', '🍟', '🍿', '🍩', '🍪', '🍰', '🍦', '🍭', '🍫', '🍬', '🥨', '🥐', '🥯', '🥞', '🧇', '🍳'],
        free:['🔥', '💧', '⛄', '☔', '⚡', '🌀', '🌈', '☀️', '🌡️', '🌕', '⭐', '🚀', '🌏', '🍭', '🍬', '🦋', '🐛', '🐝', '🐸', '🦄', '🦍', '🦷', '🧠', '💢', '🤡', '👽', '👾', '🤢']
    };

    const difficultySettings = {
        easy: { displayRows: 6, displayCols: 8, pairs: (6 * 8) / 2, baseScore: 10000, iconCount: 12 }, // 8x6 grid
        medium: { displayRows: 8, displayCols: 10, pairs: (8 * 10) / 2, baseScore: 20000, iconCount: 16 }, // 10x8 grid
        hard: { displayRows: 10, displayCols: 12, pairs: (10 * 12) / 2, baseScore: 30000, iconCount: 20 }  // 12x10 grid
    };

    // 在DOM元素部分添加主题菜单选择按钮的引用
    const themeMenuBtn = document.createElement('div');
    themeMenuBtn.id = 'theme-menu-btn';
    themeMenuBtn.title = '选择图标主题';
    themeMenuBtn.textContent = '🎨';
    themeMenuBtn.style.background = 'none';
    themeMenuBtn.style.border = 'none';
    themeMenuBtn.style.fontSize = '1.5em';
    themeMenuBtn.style.cursor = 'pointer';
    themeMenuBtn.style.color = 'inherit';
    themeMenuBtn.style.marginLeft = '10px';
    document.querySelector('.header-controls').appendChild(themeMenuBtn);

    // 添加滚动监听事件，确保Canvas位置正确
    window.addEventListener('scroll', function() {
        if (lineCanvas) {
            updateCanvasPosition();
        }
    }, { passive: true });

    // ---- 初始化和游戏流程 ----
    function initGame(theme = currentCardTheme, difficulty = currentDifficulty) {
        currentCardTheme = theme;
        currentDifficulty = difficulty;
        const settings = difficultySettings[difficulty];
        displayRows = settings.displayRows;
        displayCols = settings.displayCols;
        rows = displayRows + 2; // 包括外围空行
        cols = displayCols + 2; // 包括外围空列
        currentTotalPairs = settings.pairs;

        gameBoard.innerHTML = ''; // 清空游戏板
        if (lineCanvas) lineCanvas.remove(); // 移除旧的canvas
        
        stopTimer();
        firstSelectedCard = null;
        hintsLeft = 3;
        clearedPairs = 0;
        gameTime = 0;
        gameStarted = false;

        generateBoard();
        renderBoard();
        createLineCanvas(); // 创建新的canvas
        // 确保Canvas正确定位
        updateCanvasPosition();
        
        updateStats();
        resetTimer();
        winOverlay.classList.remove('show');
        confettiContainer.innerHTML = '';
    }

    function generateBoard() {
        // 创建并初始化为空的二维数组
        board = [];
        for (let r = 0; r < rows; r++) {
            const row = [];
            for (let c = 0; c < cols; c++) {
                row.push(0); // 所有格子初始化为0（空）
            }
            board.push(row);
        }

        // 生成图标配对
        const icons = [];
        const availableIcons = [...cardThemes[currentCardTheme]];
        shuffleArray(availableIcons);
        const iconCountNeeded = difficultySettings[currentDifficulty].iconCount;

        for (let i = 0; i < currentTotalPairs; i++) {
            const icon = availableIcons[i % iconCountNeeded]; 
            icons.push(icon, icon); // 每个图标添加两次（配对）
        }
        shuffleArray(icons);

        // 把图标放到实际显示的区域（不包括外围空行空列）
        let iconIndex = 0;
        for (let r = 1; r <= displayRows; r++) {
            for (let c = 1; c <= displayCols; c++) {
                if (iconIndex < icons.length) {
                    board[r][c] = icons[iconIndex++];
                }
            }
        }

        // 确保棋盘可解
        if (!findHint(true)) {
            console.warn("初始棋盘可能无解，尝试重新洗牌");
            reshuffleBoard();
        }
    }

    function renderBoard() {
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

        // 计算每个卡片的合适大小 - 根据屏幕尺寸自适应
        const isMobile = window.innerWidth < 480;
        let screenWidthFactor = isMobile ? 0.92 : 0.7; // 移动端使用更大占比
        let screenHeightFactor = isMobile ? 0.65 : 0.6;
        
        const gameBoardWidth = window.innerWidth * screenWidthFactor;
        const gameBoardHeight = window.innerHeight * screenHeightFactor;
        
        const cardWidth = Math.floor(Math.min(
            gameBoardWidth / cols,
            gameBoardHeight / rows,
            isMobile ? 35 : 45 // 移动端最大尺寸限制更小
        ));
        
        // 设置游戏容器的实际尺寸
        const totalWidth = cardWidth * cols;
        const totalHeight = cardWidth * rows;
        
        gameBoard.style.width = `${totalWidth}px`;
        gameBoard.style.height = `${totalHeight}px`;
        gameBoard.style.margin = '0 auto 25px'; // 确保水平居中
        
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const card = document.createElement('div');
                card.classList.add('card');
                card.dataset.r = r;
                card.dataset.c = c;
                card.style.width = `${cardWidth}px`;
                card.style.height = `${cardWidth}px`;
                
                if (board[r][c] === 0) {
                    card.classList.add('empty');
                } else {
                    card.textContent = board[r][c];
                    card.addEventListener('click', onCardClick);
                }
                
                gameBoard.appendChild(card);
            }
        }
        
        // 注意：不在这里添加resize事件监听器，因为它已经在createLineCanvas中添加
        // 这样可以避免重复添加事件监听器
    }
    
    function createLineCanvas() {
        lineCanvas = document.createElement('canvas');
        lineCanvas.id = 'line-canvas';
        
        // 初始化canvas尺寸和位置
        document.body.appendChild(lineCanvas); // 添加到body
        lineCanvas.style.pointerEvents = 'none'; // 确保不阻挡鼠标事件
        lineCanvas.style.zIndex = '10'; // 确保在卡片上方
        lineCtx = lineCanvas.getContext('2d');
        updateCanvasPosition(); // 设置初始位置
        
        // 监听滚动和调整大小事件
        window.addEventListener('resize', updateCanvasPosition);
        window.addEventListener('scroll', updateCanvasPosition, { passive: true });
        
        // 定期更新Canvas位置以处理潜在的布局变化
        setInterval(updateCanvasPosition, 2000);
    }

    // 新增函数：更新Canvas位置和尺寸
    function updateCanvasPosition() {
        if (!lineCanvas) return;
        
        const gameBoardRect = gameBoard.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        
        lineCanvas.style.position = 'absolute'; // 使用absolute定位
        lineCanvas.style.left = `${gameBoardRect.left + scrollX}px`;
        lineCanvas.style.top = `${gameBoardRect.top + scrollY}px`;
        lineCanvas.width = gameBoardRect.width;
        lineCanvas.height = gameBoardRect.height;
        
        // 强制重新定位Canvas，解决移动端滚动问题
        setTimeout(() => {
            const updatedRect = gameBoard.getBoundingClientRect();
            lineCanvas.style.left = `${updatedRect.left + scrollX}px`;
            lineCanvas.style.top = `${updatedRect.top + scrollY}px`;
        }, 50);
    }

    function drawLine(path) {
        if (!lineCtx || path.length < 2) return;
        
        // 先更新Canvas位置，确保与游戏板对齐
        updateCanvasPosition();
        
        lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
        lineCtx.beginPath();
        lineCtx.strokeStyle = currentTheme === 'dark' ? '#5cb85c' : '#4CAF50';
        lineCtx.lineWidth = 3;
        lineCtx.lineCap = 'round';
        lineCtx.lineJoin = 'round';

        // 计算每个格子大小
        const boardWidth = lineCanvas.width;
        const boardHeight = lineCanvas.height;
        const cellWidth = boardWidth / cols;
        const cellHeight = boardHeight / rows;
        
        // 绘制连线路径
        for (let i = 0; i < path.length; i++) {
            const point = path[i];
            const x = (point.c + 0.5) * cellWidth; // 加0.5使位置在格子中心
            const y = (point.r + 0.5) * cellHeight; // 加0.5使位置在格子中心
            
            if (i === 0) {
                lineCtx.moveTo(x, y);
            } else {
                lineCtx.lineTo(x, y);
            }
        }
        lineCtx.stroke();

        // 短暂显示后清除
        setTimeout(() => {
            lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
        }, 500);
    }

    function onCardClick(event) {
        if (!gameStarted) {
            startTimer();
            gameStarted = true;
        }

        const clickedCard = event.target;
        const r = parseInt(clickedCard.dataset.r);
        const c = parseInt(clickedCard.dataset.c);

        if (board[r][c] === 0) return; // 点击了空格子

        if (firstSelectedCard) {
            if (firstSelectedCard.element === clickedCard) {
                // 点击了同一个卡片，取消选择
                clickedCard.classList.remove('selected');
                firstSelectedCard = null;
                return;
            }

            // 尝试连接
            const path = canConnect(firstSelectedCard, { r, c, element: clickedCard });
            if (path) {
                // 可以连接
                drawLine(path);
                board[firstSelectedCard.r][firstSelectedCard.c] = 0;
                board[r][c] = 0;
                firstSelectedCard.element.classList.add('empty');
                firstSelectedCard.element.classList.remove('selected');
                firstSelectedCard.element.textContent = '';
                firstSelectedCard.element.removeEventListener('click', onCardClick);

                clickedCard.classList.add('empty');
                clickedCard.classList.remove('selected');
                clickedCard.textContent = '';
                clickedCard.removeEventListener('click', onCardClick);

                clearedPairs++;
                updateStats();
                firstSelectedCard = null;

                if (clearedPairs === currentTotalPairs) {
                    gameComplete();
                } else {
                    // 检查消除后是否导致死局，如果死局则洗牌
                    if (!findHint(true)) {
                        showDialog("提示", "当前棋盘无解，将自动洗牌！", () => reshuffleBoard(), false);
                    }
                }
            } else {
                // 不能连接，取消第一个选择，并选中当前点击的
                firstSelectedCard.element.classList.remove('selected');
                clickedCard.classList.add('selected');
                firstSelectedCard = { r, c, element: clickedCard };
            }
        } else {
            // 第一个选择
            clickedCard.classList.add('selected');
            firstSelectedCard = { r, c, element: clickedCard };
        }
    }

    // ---- 连接逻辑 ----
    function canConnect(card1, card2) {
        if (board[card1.r][card1.c] !== board[card2.r][card2.c]) return false;

        // 同行或同列直线连接
        let path = checkLine(card1, card2);
        if (path) return path;
        // 一个拐点连接
        path = checkOneTurn(card1, card2);
        if (path) return path;
        // 两个拐点连接
        path = checkTwoTurns(card1, card2);
        if (path) return path;

        return false;
    }

    function isEmpty(r, c) {
        return r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === 0;
    }

    // 直线连接
    function checkLine(p1, p2) {
        if (p1.r !== p2.r && p1.c !== p2.c) return null;
        let path = [p1];
        if (p1.r === p2.r) { // 同行
            const dir = p1.c < p2.c ? 1 : -1;
            for (let c = p1.c + dir; c !== p2.c; c += dir) {
                if (!isEmpty(p1.r, c)) return null;
                path.push({r: p1.r, c: c});
            }
        } else { // 同列
            const dir = p1.r < p2.r ? 1 : -1;
            for (let r = p1.r + dir; r !== p2.r; r += dir) {
                if (!isEmpty(r, p1.c)) return null;
                path.push({r: r, c: p1.c});
            }
        }
        path.push(p2);
        return path;
    }

    // 一个拐点
    function checkOneTurn(p1, p2) {
        // 尝试拐点 (p1.r, p2.c)
        if (isEmpty(p1.r, p2.c)) {
            const path1 = checkLine(p1, { r: p1.r, c: p2.c });
            const path2 = checkLine({ r: p1.r, c: p2.c }, p2);
            if (path1 && path2) return path1.slice(0, -1).concat(path2); 
        }
        // 尝试拐点 (p2.r, p1.c)
        if (isEmpty(p2.r, p1.c)) {
            const path1 = checkLine(p1, { r: p2.r, c: p1.c });
            const path2 = checkLine({ r: p2.r, c: p1.c }, p2);
            if (path1 && path2) return path1.slice(0, -1).concat(path2);
        }
        return null;
    }

    // 两个拐点
    function checkTwoTurns(p1, p2) {
        // 遍历所有可能的中间行
        for (let r = 0; r < rows; r++) {
            if (isEmpty(r, p1.c) && isEmpty(r, p2.c)) {
                const turnPoint1 = {r: r, c: p1.c};
                const turnPoint2 = {r: r, c: p2.c};
                
                if (checkLine(p1, turnPoint1) && checkLine(turnPoint2, p2)) {
                    return [p1, ...checkLine(p1, turnPoint1).slice(1, -1), turnPoint1, turnPoint2, ...checkLine(turnPoint2, p2).slice(1)];
                }
            }
        }
        
        // 遍历所有可能的中间列
        for (let c = 0; c < cols; c++) {
            if (isEmpty(p1.r, c) && isEmpty(p2.r, c)) {
                const turnPoint1 = {r: p1.r, c: c};
                const turnPoint2 = {r: p2.r, c: c};
                
                if (checkLine(p1, turnPoint1) && checkLine(turnPoint2, p2)) {
                    return [p1, ...checkLine(p1, turnPoint1).slice(1, -1), turnPoint1, turnPoint2, ...checkLine(turnPoint2, p2).slice(1)];
                }
            }
        }
        
        return null;
    }

    // ---- 提示和洗牌 ----
    function findHint(checkOnly = false) {
        const currentCards = [];
        for (let r = 1; r <= displayRows; r++) {
            for (let c = 1; c <= displayCols; c++) {
                if (board[r][c] !== 0) {
                    currentCards.push({ r, c, element: gameBoard.querySelector(`.card[data-r='${r}'][data-c='${c}']`) });
                }
            }
        }

        for (let i = 0; i < currentCards.length; i++) {
            for (let j = i + 1; j < currentCards.length; j++) {
                if (board[currentCards[i].r][currentCards[i].c] === board[currentCards[j].r][currentCards[j].c]) {
                    if (canConnect(currentCards[i], currentCards[j])) {
                        if (!checkOnly) {
                            currentCards[i].element.classList.add('hint');
                            currentCards[j].element.classList.add('hint');
                            setTimeout(() => {
                                currentCards[i].element.classList.remove('hint');
                                currentCards[j].element.classList.remove('hint');
                            }, 1500);
                        }
                        return [currentCards[i], currentCards[j]];
                    }
                }
            }
        }
        return null; // 没有可消除的对了
    }

    function useHint() {
        if (hintsLeft > 0 && gameStarted) {
            const hintPair = findHint();
            if (hintPair) {
                hintsLeft--;
                updateStats();
            } else {
                showDialog("提示", "当前没有可消除的图案了！可能需要洗牌。", null, false);
            }
        } else if (hintsLeft <= 0) {
            showDialog("提示", "提示次数已用完！", null, false);
        }
    }

    function reshuffleBoard() {
        // 收集当前所有图标
        const iconsToReshuffle = [];
        for (let r = 1; r <= displayRows; r++) {
            for (let c = 1; c <= displayCols; c++) {
                if (board[r][c] !== 0) {
                    iconsToReshuffle.push(board[r][c]);
                }
            }
        }
        
        // 尝试最多5次洗牌，直到找到可解的布局
        let attempts = 0;
        let foundSolvable = false;
        
        while (!foundSolvable && attempts < 5) {
            attempts++;
            shuffleArray(iconsToReshuffle);
            
            // 重新放置图标
            let iconIndex = 0;
            for (let r = 1; r <= displayRows; r++) {
                for (let c = 1; c <= displayCols; c++) {
                    if (board[r][c] !== 0) { // 只在原来有图标的位置重新放置
                        board[r][c] = iconsToReshuffle[iconIndex++];
                    }
                }
            }
            
            // 检查是否可解
            foundSolvable = !!findHint(true);
        }
        
        // 重新渲染棋盘
        renderBoard();
        firstSelectedCard = null; // 清除之前的选择
        
        // 如果还是无解，提示玩家
        if (!foundSolvable) {
            console.warn("洗牌后仍然无解，可能需要重新开始游戏");
            showDialog("提示", "当前棋盘似乎无法找到可消除的配对，建议重新开始游戏。", null, false);
        }
    }


    // ---- 游戏结束和统计 ----
    function gameComplete() {
        stopTimer();
        finalHintsElement.textContent = 3 - hintsLeft;
        finalTimeElement.textContent = formatTime(gameTime);

        const diffConfig = difficultySettings[currentDifficulty];
        const baseScore = diffConfig.baseScore;
        tempScore = Math.max(0, baseScore - (gameTime * 20) - ((3 - hintsLeft) * 500)); // 时间和提示都扣分

        const isNewRecord = checkNewRecord(tempScore);
        setTimeout(() => {
            winOverlay.classList.add('show');
            createConfettiEffect();
            if (isNewRecord) {
                const savedPlayerName = localStorage.getItem('linkGamePlayerName');
                if (savedPlayerName && savedPlayerName !== '匿名') {
                    addNewRecord(savedPlayerName);
                    setTimeout(() => {
                        updateLeaderboardView(currentDifficulty);
                        tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.difficulty === currentDifficulty));
                        leaderboardOverlay.classList.add('show');
                    }, 1500);
                } else {
                    setTimeout(() => {
                        playerNameOverlay.classList.add('show');
                        playerNameInput.focus();
                    }, 1000);
                }
            }
        }, 300);
    }

    function updateStats() {
        hintsElement.textContent = hintsLeft;
        clearedPairsElement.textContent = clearedPairs;
        totalPairsElement.textContent = currentTotalPairs;
    }

    // ---- 计时器 ----
    function startTimer() {
        stopTimer();
        gameTime = 0;
        updateTimer();
        timerInterval = setInterval(() => {
            gameTime++;
            updateTimer();
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function resetTimer() {
        gameTime = 0;
        updateTimer();
    }

    function updateTimer() {
        timerElement.textContent = formatTime(gameTime);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    // ---- 主题切换 ----
    function toggleTheme() {
        if (currentTheme === 'light') {
            bodyElement.classList.add('dark-theme');
            themeSelectBtn.textContent = '☀️'; // 修改为太阳图标表示切换到亮色模式
            currentTheme = 'dark';
        } else {
            bodyElement.classList.remove('dark-theme');
            themeSelectBtn.textContent = '🌚'; // 修改为月亮图标表示切换到暗色模式
            currentTheme = 'light';
        }
        if (lineCanvas) {
             // 重绘连接线以适应新主题颜色
             // drawLine([]); // 简单清除，或在实际连接时重新获取颜色
        }
    }

    // ---- 对话框 ----
    function showDialog(title, content, onConfirm, showCancel = true) {
        dialogTitle.textContent = title;
        dialogContent.innerHTML = content; // 使用innerHTML以支持HTML内容

        const confirmHandler = () => {
            dialogOverlay.classList.remove('show');
            dialogConfirm.removeEventListener('click', confirmHandler);
            if (dialogCancel.style.display !== 'none') {
                 dialogCancel.removeEventListener('click', cancelHandler); // 确保取消事件也被移除
            }
            if (onConfirm) onConfirm();
        };

        const cancelHandler = () => {
            dialogOverlay.classList.remove('show');
            dialogConfirm.removeEventListener('click', confirmHandler);
            dialogCancel.removeEventListener('click', cancelHandler);
        };

        dialogConfirm.addEventListener('click', confirmHandler);

        if (showCancel) {
            dialogCancel.style.display = 'inline-block';
            dialogCancel.addEventListener('click', cancelHandler);
        } else {
            dialogCancel.style.display = 'none';
        }
        dialogOverlay.classList.add('show');
    }

    // ---- 事件监听 ----
    restartBtn.addEventListener('click', () => {
        showDialog(
            "重新开始",
            "确定要重新开始游戏吗？当前进度将丢失。",
            () => initGame(currentCardTheme, currentDifficulty)
        );
    });

    hintBtn.addEventListener('click', useHint);

    difficultySelectBtn.addEventListener('click', () => difficultyOverlay.classList.add('show'));
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedDifficulty = btn.dataset.difficulty;
            if (selectedDifficulty !== currentDifficulty) {
                difficultyOverlay.classList.remove('show');
                showDialog(
                    "更改难度",
                    `将难度更改为 ${btn.textContent.split(' ')[0]} 并重新开始游戏。当前进度将丢失。`,
                    () => {
                        currentDifficulty = selectedDifficulty;
                        initGame(currentCardTheme, currentDifficulty);
                    }
                );
            } else {
                difficultyOverlay.classList.remove('show');
            }
        });
    });
    difficultyClose.addEventListener('click', () => difficultyOverlay.classList.remove('show'));

    themeSelectBtn.addEventListener('click', () => {
        toggleTheme();
        // 更新主题图标
        themeSelectBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌚';
    });
    
    themeMenuBtn.addEventListener('click', () => themeOverlay.classList.add('show'));
    
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTheme = btn.dataset.theme;
            if (selectedTheme !== currentCardTheme) {
                themeOverlay.classList.remove('show');
                const themeName = btn.querySelector('.theme-name').textContent;
                showDialog(
                    "更改主题",
                    `将主题更改为 ${themeName} 并重新开始游戏。当前进度将丢失。`,
                    () => {
                        currentCardTheme = selectedTheme;
                        initGame(currentCardTheme, currentDifficulty);
                    }
                );
            } else {
                themeOverlay.classList.remove('show');
            }
        });
    });
    themeClose.addEventListener('click', () => themeOverlay.classList.remove('show'));

    winOverlay.addEventListener('click', (event) => {
        if (event.target === winOverlay) {
            winOverlay.classList.remove('show');
        }
    });
    
    // ---- 玩家名称和排行榜 (类似Memory Match) ----
    function updatePlayerNameDisplay() {
        playerName = localStorage.getItem('linkGamePlayerName') || '匿名';
        currentPlayerNameElement.textContent = `玩家：${playerName}`;
    }

    changePlayerNameBtn.addEventListener('click', () => {
        changeNameInput.value = localStorage.getItem('linkGamePlayerName') || '';
        changeNameOverlay.classList.add('show');
        changeNameInput.focus();
    });

    changeNameSubmit.addEventListener('click', () => {
        const newName = changeNameInput.value.trim() || '匿名';
        localStorage.setItem('linkGamePlayerName', newName);
        updatePlayerNameDisplay();
        changeNameOverlay.classList.remove('show');
    });

    changeNameCancel.addEventListener('click', () => changeNameOverlay.classList.remove('show'));

    playerNameSubmit.addEventListener('click', () => {
        const newPlayerName = playerNameInput.value.trim() || '匿名玩家';
        addNewRecord(newPlayerName);
        playerNameOverlay.classList.remove('show');
        playerNameInput.value = '';
        localStorage.setItem('linkGamePlayerName', newPlayerName);
        updatePlayerNameDisplay();

        updateLeaderboardView(currentDifficulty);
        tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.difficulty === currentDifficulty));
        setTimeout(() => leaderboardOverlay.classList.add('show'), 500);
    });

    function checkNewRecord(score) {
        const records = leaderboardData[currentDifficulty] || [];
        return records.length < 5 || score > (records[records.length - 1]?.score || 0);
    }

    function addNewRecord(pName) {
        const finalName = pName || localStorage.getItem('linkGamePlayerName') || '匿名玩家';
        const newRecord = {
            name: finalName,
            hintsUsed: 3 - hintsLeft,
            time: formatTime(gameTime),
            score: tempScore,
            isNewRecord: true // 标记为新纪录
        };

        const existingRecordIndex = (leaderboardData[currentDifficulty] || []).findIndex(
            record => record.name === finalName
        );

        if (existingRecordIndex !== -1) {
            if (tempScore > leaderboardData[currentDifficulty][existingRecordIndex].score) {
                // 如果打破自己的记录
                leaderboardData[currentDifficulty][existingRecordIndex] = newRecord;
            } else {
                // 没有打破自己的记录
                return; // 不需要添加新记录
            }
        } else {
            // 新玩家，直接添加
            leaderboardData[currentDifficulty].push(newRecord);
        }

        // 清除之前的新纪录标记
        leaderboardData[currentDifficulty].forEach(record => {
            if (record !== newRecord) {
                record.isNewRecord = false;
            }
        });

        // 排序并截取前5名
        leaderboardData[currentDifficulty].sort((a, b) => b.score - a.score);
        if (leaderboardData[currentDifficulty].length > 5) {
            leaderboardData[currentDifficulty] = leaderboardData[currentDifficulty].slice(0, 5);
        }
        saveLeaderboardData();
        updateLeaderboardView(currentDifficulty);
    }

    function loadLeaderboardData() {

        fetch(`https://cn.apihz.cn/api/cunchu/textcc.php?id=${apiId}&key=${apiKey}&type=2&numid=3`)
            .then(response => response.text())
            .then(data => {
                try {
                    if (data && data !== "没有数据" && data !== "Key验证失败" && data !== "ID验证失败") {
                        const parsedData = JSON.parse(data);
                        if (parsedData && parsedData.words) {
                           leaderboardData = JSON.parse(parsedData.words);
                        } else if (parsedData && typeof parsedData === 'object') { // 有时API直接返回JSON对象
                            leaderboardData = parsedData;
                        }
                         else {
                            console.log("从API获取的排行榜数据为空或格式不正确，使用默认空数据。", parsedData);
                        }
                    } else {
                        console.log("加载排行榜: ", data); // 可能是"没有数据"等
                    }
                } catch (e) {
                    console.error("解析排行榜数据失败", e, "原始数据: ", data);
                }
                ensureLeaderboardStructure();
            })
            .catch(error => {
                console.error("加载排行榜数据失败", error);
                ensureLeaderboardStructure();
            });
    }
    
    function ensureLeaderboardStructure() {
        if (!leaderboardData) leaderboardData = {};
        if (!leaderboardData.easy) leaderboardData.easy = [];
        if (!leaderboardData.medium) leaderboardData.medium = [];
        if (!leaderboardData.hard) leaderboardData.hard = [];
    }

    function saveLeaderboardData() {
        const leaderboardString = JSON.stringify(leaderboardData);

        fetch(`https://cn.apihz.cn/api/cunchu/textcc.php?id=${apiId}&key=${apiKey}&type=1&numid=3&words=${leaderboardString}&title=连连看游戏排行榜`)
            .then(response => response.text())
            .then(data => {
                if(data.includes("成功")){
                    console.log("排行榜数据保存成功", data);
                } else {
                    console.error("保存排行榜数据失败: ", data);
                    showDialog("保存失败", `排行榜数据未能成功保存到云端: ${data}。数据已暂存本地。`, null, false);
                    localStorage.setItem(apiStorageKey, leaderboardString); // 保存到本地作为备份
                }
            })
            .catch(error => {
                console.error("保存排行榜数据失败", error);
                showDialog("保存失败", `排行榜数据因网络错误未能保存到云端。数据已暂存本地。`, null, false);
                localStorage.setItem(apiStorageKey, leaderboardString); // 保存到本地作为备份
            });
    }

    function updateLeaderboardView(difficulty) {
        ensureLeaderboardStructure(); // 确保数据结构存在
        const records = leaderboardData[difficulty] || [];
        leaderboardBody.innerHTML = '';
        if (records.length === 0) {
            leaderboardBody.innerHTML = `<tr><td colspan="5" class="no-records">暂无记录</td></tr>`;
            return;
        }
        records.forEach((record, index) => {
            const row = leaderboardBody.insertRow();
            
            // 为前三名添加特殊样式类
            if (index < 3) {
                row.classList.add(`rank-${index + 1}`);
            }
            
            // 创建带有排名的单元格，前三名显示特殊奖牌
            const rankCell = row.insertCell();
            if (index < 3) {
                rankCell.innerHTML = `<div class="rank-medal rank-medal-${index + 1}"></div>`;
            } else {
                rankCell.textContent = index + 1;
            }
            
            // 添加其他信息
            const nameCell = row.insertCell();
            nameCell.textContent = record.name;
            
            const hintsCell = row.insertCell();
            hintsCell.textContent = record.hintsUsed !== undefined ? record.hintsUsed : record.moves /* 兼容旧数据 */;
            
            const timeCell = row.insertCell();
            timeCell.textContent = record.time;
            
            const scoreCell = row.insertCell();
            scoreCell.textContent = record.score;
            
            // 为前三名的分数添加额外样式
            if (index < 3) {
                scoreCell.style.fontWeight = '700';
            }
            
            // 如果是新纪录，添加徽章
            if (record.isNewRecord) {
                scoreCell.style.position = 'relative';
                const badge = document.createElement('span');
                badge.classList.add('new-record-badge');
                badge.textContent = '新纪录';
                scoreCell.appendChild(badge);
                
                // 添加恭喜效果，一段时间后消失
                setTimeout(() => {
                    if (badge.parentNode) {
                        badge.classList.add('fade-out');
                        setTimeout(() => {
                            if (badge.parentNode) {
                                badge.parentNode.removeChild(badge);
                            }
                            // 在本地存储中也清除标记
                            record.isNewRecord = false;
                            saveLeaderboardData();
                        }, 1000);
                    }
                }, 10000); // 10秒后开始消失
            }
        });
    }

    leaderboardBtn.addEventListener('click', () => {
        updateLeaderboardView(currentDifficulty);
        tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.difficulty === currentDifficulty));
        leaderboardOverlay.classList.add('show');
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const difficulty = btn.dataset.difficulty;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateLeaderboardView(difficulty);
        });
    });
    leaderboardClose.addEventListener('click', () => leaderboardOverlay.classList.remove('show'));

    // ---- 辅助函数 ----
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createConfettiEffect() {
        confettiContainer.innerHTML = ''; // 清除之前的彩色纸屑
        const confettiCount = 100;
        const confettiColors = ['#4A89DC', '#F6BB42', '#E9573F', '#8CC152', '#967ADC', '#FFFFFF'];

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            const x = Math.random() * 100; 
            const y = Math.random() * -50 - 50; 
            const rotation = Math.random() * 360;
            const fallDuration = Math.random() * 2 + 2; 
            const delay = Math.random() * 1;
            confetti.style.left = x + '%';
            confetti.style.top = y + '%'; 
            confetti.style.transform = `rotate(${rotation}deg)`;
            const size = Math.random() * 6 + 4; 
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            if (Math.random() > 0.5) { 
                confetti.style.borderRadius = '50%';
            }
            confettiContainer.appendChild(confetti);
            confetti.animate([
                { transform: `translateY(0vh) rotate(${rotation}deg)`, opacity: 1 },
                { transform: `translateY(120vh) rotate(${rotation + Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: fallDuration * 1000,
                delay: delay * 1000,
                easing: 'ease-out',
                fill: 'forwards'
            });
            setTimeout(() => confetti.remove(), (fallDuration + delay + 0.5) * 1000);
        }
    }

    // 防抖动的窗口调整大小处理函数
    function handleWindowResize() {
        // 防抖动：使用setTimeout限制频繁调用
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(function() {
            updateCanvasPosition();
            
            // 只在游戏未结束时重新渲染
            if (clearedPairs < currentTotalPairs) {
                renderBoard();
            }
        }, 250);
    }
    
    // 替换window.scroll事件处理器
    window.removeEventListener('scroll', updateCanvasPosition);
    window.addEventListener('scroll', updateCanvasPosition, { passive: true });

    // ---- 初始化 ----
    updatePlayerNameDisplay();
    loadLeaderboardData(); // 加载排行榜数据
    initGame(); // 开始游戏
    // toggleTheme(); // 如果需要默认暗黑主题
    
    // 添加窗口resize事件监听
    window.removeEventListener('resize', handleWindowResize);
    window.addEventListener('resize', handleWindowResize);

    // 胜利后重新开始游戏按钮
    const restartAfterWinBtn = document.getElementById('restart-after-win');
    if (restartAfterWinBtn) {
        restartAfterWinBtn.addEventListener('click', () => {
            winOverlay.classList.remove('show');
            initGame(currentCardTheme, currentDifficulty);
        });
    }
});
