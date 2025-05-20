document.addEventListener('DOMContentLoaded', () => {
    // DOM元素
    const gameBoard = document.getElementById('game-board');
    const moveCountElement = document.getElementById('move-count');
    const timerElement = document.getElementById('timer');
    const difficultyDisplayElement = document.getElementById('difficulty-display');
    const restartBtn = document.getElementById('restart-btn');
    const difficultySelectBtn = document.getElementById('difficulty-select-btn');
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    const themeSelectBtn = document.getElementById('theme-select-btn');

    const winOverlay = document.getElementById('win-overlay');
    const finalMovesElement = document.getElementById('final-moves');
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

    const leaderboardOverlay = document.getElementById('leaderboard-overlay');
    const leaderboardBody = document.getElementById('leaderboard-body');
    const leaderboardClose = document.getElementById('leaderboard-close');
    const tabBtns = document.querySelectorAll('.tab-btn');

    const playerNameOverlay = document.getElementById('player-name-overlay');
    const playerNameInput = document.getElementById('player-name-input');
    const playerNameSubmit = document.getElementById('player-name-submit');
    const restartAfterWinBtn = document.getElementById('restart-after-win');

    const bodyElement = document.body;

    // 游戏状态
    let board = []; // 游戏棋盘
    let emptyTilePos = { row: 0, col: 0 }; // 空白格位置
    let size = 3; // 默认3x3难度
    let moveCount = 0;
    let gameTime = 0;
    let timerInterval = null;
    let gameStarted = false;
    let currentTheme = 'light'; // 'light' or 'dark'
    let currentDifficulty = 'easy'; // 'easy', 'medium', 'hard'
    let tempScore = 0;
    
    // 难度相关配置
    const difficultySettings = {
        easy: { size: 3, baseScore: 5000 },
        medium: { size: 4, baseScore: 10000 },
        hard: { size: 5, baseScore: 20000 }
    };

    // 排行榜数据
    let leaderboardData = {
        easy: [],
        medium: [],
        hard: []
    };
    let playerName = localStorage.getItem('huarongdaoPlayerName') || '匿名';
    
    // API Key和ID (替换为您自己的)
    const apiKey = '0e8b0763210c6f7f19b175a6c177ca4f'; // 替换为你的API Key
    const apiId = '10004465';   // 替换为你的API ID
    const apiStorageKey = 'huarongdaoLeaderboard'; // 用于区分存储项目的键

    // ---- 初始化和游戏流程 ----
    function initGame(difficulty = currentDifficulty) {
        currentDifficulty = difficulty;
        const settings = difficultySettings[difficulty];
        size = settings.size;
        difficultyDisplayElement.textContent = getDifficultyName(difficulty);

        stopTimer();
        moveCount = 0;
        gameTime = 0;
        gameStarted = false;

        generateBoard();
        renderBoard();
        updateStats();
        resetTimer();
        winOverlay.classList.remove('show');
        confettiContainer.innerHTML = '';
    }

    function getDifficultyName(difficulty) {
        switch(difficulty) {
            case 'easy': return '简单';
            case 'medium': return '中等';
            case 'hard': return '困难';
            default: return '简单';
        }
    }

    function generateBoard() {
        // 创建一个已解决的棋盘（1到n²-1按顺序排列，最后一个是空格）
        const totalTiles = size * size;
        board = [];

        for (let i = 0; i < totalTiles; i++) {
            board.push(i + 1);
        }
        board[totalTiles - 1] = 0; // 最后一个是空格
        emptyTilePos = { row: size - 1, col: size - 1 };

        // 随机打乱棋盘
        shuffleBoard();
    }

    function shuffleBoard() {
        // 执行一系列随机移动来打乱棋盘（保证有解）
        const moves = 100 + size * 20; // 根据难度调整随机移动次数
        const directions = [
            { row: -1, col: 0 }, // 上
            { row: 1, col: 0 },  // 下
            { row: 0, col: -1 }, // 左
            { row: 0, col: 1 }   // 右
        ];

        for (let i = 0; i < moves; i++) {
            const validMoves = [];

            // 找出所有可能的移动
            for (const dir of directions) {
                const newRow = emptyTilePos.row + dir.row;
                const newCol = emptyTilePos.col + dir.col;

                if (isValidPosition(newRow, newCol)) {
                    validMoves.push({ row: newRow, col: newCol });
                }
            }

            // 随机选择一个有效移动
            if (validMoves.length > 0) {
                const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                const tileValue = getTileValue(randomMove.row, randomMove.col);
                
                // 执行移动
                setTileValue(emptyTilePos.row, emptyTilePos.col, tileValue);
                setTileValue(randomMove.row, randomMove.col, 0);
                emptyTilePos = { row: randomMove.row, col: randomMove.col };
            }
        }
    }

    function renderBoard() {
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        // 计算每个卡片的合适大小 - 根据屏幕尺寸自适应
        const isMobile = window.innerWidth < 480;
        let boardSize = Math.min(
            window.innerWidth * (isMobile ? 0.9 : 0.7),
            window.innerHeight * 0.6
        );
        boardSize = Math.min(boardSize, 500); // 最大尺寸限制
        
        gameBoard.style.width = `${boardSize}px`;
        gameBoard.style.height = `${boardSize}px`;

        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const tileValue = getTileValue(row, col);
                const tile = document.createElement('div');
                tile.classList.add('tile');
                
                if (tileValue === 0) {
                    tile.classList.add('empty');
                } else {
                    tile.setAttribute('data-value', tileValue);
                    tile.dataset.row = row;
                    tile.dataset.col = col;
                    
                    tile.addEventListener('click', onTileClick);
                }
                
                gameBoard.appendChild(tile);
            }
        }
    }

    function getTileValue(row, col) {
        const index = row * size + col;
        return board[index];
    }

    function setTileValue(row, col, value) {
        const index = row * size + col;
        board[index] = value;
    }

    function isValidPosition(row, col) {
        return row >= 0 && row < size && col >= 0 && col < size;
    }

    function isCorrectPosition(row, col, value) {
        return value === row * size + col + 1;
    }

    function onTileClick(event) {
        const tile = event.target;
        const row = parseInt(tile.dataset.row);
        const col = parseInt(tile.dataset.col);

        // 检查是否可以移动这个卡片（是否与空白格相邻）
        if (canMove(row, col)) {
            if (!gameStarted) {
                startTimer();
                gameStarted = true;
            }

            // 交换卡片与空白格
            const tileValue = getTileValue(row, col);
            setTileValue(row, col, 0);
            setTileValue(emptyTilePos.row, emptyTilePos.col, tileValue);
            
            // 更新空白格位置
            emptyTilePos = { row, col };
            
            // 增加移动计数
            moveCount++;
            updateStats();
            
            // 重新渲染棋盘
            renderBoard();
            
            // 检查是否胜利
            if (checkWin()) {
                gameComplete();
            }
        }
    }

    function canMove(row, col) {
        // 检查该位置是否与空白格相邻（上、下、左、右）
        return (
            (Math.abs(row - emptyTilePos.row) === 1 && col === emptyTilePos.col) ||
            (Math.abs(col - emptyTilePos.col) === 1 && row === emptyTilePos.row)
        );
    }

    function checkWin() {
        // 检查所有卡片是否在正确位置
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const tileValue = getTileValue(row, col);
                
                // 如果是空白格，它应该在右下角
                if (tileValue === 0) {
                    if (row !== size - 1 || col !== size - 1) return false;
                } else if (!isCorrectPosition(row, col, tileValue)) {
                    return false;
                }
            }
        }
        return true;
    }

    function gameComplete() {
        stopTimer();
        finalMovesElement.textContent = moveCount;
        finalTimeElement.textContent = formatTime(gameTime);

        const diffConfig = difficultySettings[currentDifficulty];
        const baseScore = diffConfig.baseScore;
        tempScore = Math.max(0, baseScore - (gameTime * 2) - (moveCount * 5)); // 时间和步数都扣分

        const isNewRecord = checkNewRecord(tempScore);
        setTimeout(() => {
            winOverlay.classList.add('show');
            createConfettiEffect();
            if (isNewRecord) {
                const savedPlayerName = localStorage.getItem('huarongdaoPlayerName');
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
        moveCountElement.textContent = moveCount;
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
            themeSelectBtn.textContent = '🌛'; // 修改为月亮图标表示切换到暗色模式
            currentTheme = 'light';
        }
    }

    // ---- 玩家名称和排行榜 ----
    function updatePlayerNameDisplay() {
        playerName = localStorage.getItem('huarongdaoPlayerName') || '匿名';
        currentPlayerNameElement.textContent = `玩家：${playerName}`;
    }

    function checkNewRecord(score) {
        const records = leaderboardData[currentDifficulty] || [];
        return records.length < 5 || score > (records[records.length - 1]?.score || 0);
    }

    function addNewRecord(pName) {
        const finalName = pName || localStorage.getItem('huarongdaoPlayerName') || '匿名玩家';
        const newRecord = {
            name: finalName,
            moves: moveCount,
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
        fetch(`https://cn.apihz.cn/api/cunchu/textcc.php?id=${apiId}&key=${apiKey}&type=2&numid=4`)
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

    // ---- 对话框 ----
    function showDialog(title, content, onConfirm, showCancel = true) {
        dialogTitle.textContent = title;
        dialogContent.innerHTML = content;

        const confirmHandler = () => {
            dialogOverlay.classList.remove('show');
            dialogConfirm.removeEventListener('click', confirmHandler);
            if (dialogCancel.style.display !== 'none') {
                 dialogCancel.removeEventListener('click', cancelHandler);
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

    function saveLeaderboardData() {
        const leaderboardString = JSON.stringify(leaderboardData);

        fetch(`https://cn.apihz.cn/api/cunchu/textcc.php?id=${apiId}&key=${apiKey}&type=1&numid=4&words=${leaderboardString}&title=华容道游戏排行榜`)
            .then(response => response.text())
            .then(data => {
                if(data.includes("成功")){
                    console.log("排行榜数据保存成功", data);
                } else {
                    console.error("保存排行榜数据失败: ", data);
                    showDialog("保存失败", `排行榜数据未能成功保存到云端: 很遗憾，你白玩了。`, null, false);
                }
            })
            .catch(error => {
                console.error("保存排行榜数据失败", error);
                showDialog("保存失败", `排行榜数据因网络错误未能保存到云端。很遗憾，你白玩了。`, null, false);
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
            
            const movesCell = row.insertCell();
            movesCell.textContent = record.moves;
            
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

    // ---- 辅助函数 ----
    function createConfettiEffect() {
        confettiContainer.innerHTML = ''; // 清除之前的彩色纸屑
        const confettiCount = 100;
        const confettiColors = ['#4A89DC', '#48CFAD', '#FFCE54', '#FC6E51', '#8CC152', '#967ADC', '#FFFFFF'];

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

    // ---- 事件监听 ----
    restartBtn.addEventListener('click', () => {
        showDialog(
            "重新开始",
            "确定要重新开始游戏吗？当前进度将丢失。",
            () => initGame(currentDifficulty)
        );
    });

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
                        initGame(selectedDifficulty);
                    }
                );
            } else {
                difficultyOverlay.classList.remove('show');
            }
        });
    });
    difficultyClose.addEventListener('click', () => difficultyOverlay.classList.remove('show'));

    themeSelectBtn.addEventListener('click', toggleTheme);
    
    winOverlay.addEventListener('click', (event) => {
        if (event.target === winOverlay) {
            winOverlay.classList.remove('show');
        }
    });

    restartAfterWinBtn.addEventListener('click', () => {
        winOverlay.classList.remove('show');
        initGame(currentDifficulty);
    });
    
    // 玩家名称相关
    changePlayerNameBtn.addEventListener('click', () => {
        changeNameInput.value = localStorage.getItem('huarongdaoPlayerName') || '';
        changeNameOverlay.classList.add('show');
        changeNameInput.focus();
    });

    changeNameSubmit.addEventListener('click', () => {
        const newName = changeNameInput.value.trim() || '匿名';
        localStorage.setItem('huarongdaoPlayerName', newName);
        updatePlayerNameDisplay();
        changeNameOverlay.classList.remove('show');
    });

    changeNameCancel.addEventListener('click', () => changeNameOverlay.classList.remove('show'));

    playerNameSubmit.addEventListener('click', () => {
        const newPlayerName = playerNameInput.value.trim() || '匿名玩家';
        addNewRecord(newPlayerName);
        playerNameOverlay.classList.remove('show');
        playerNameInput.value = '';
        localStorage.setItem('huarongdaoPlayerName', newPlayerName);
        updatePlayerNameDisplay();

        updateLeaderboardView(currentDifficulty);
        tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.difficulty === currentDifficulty));
        setTimeout(() => leaderboardOverlay.classList.add('show'), 500);
    });

    // 排行榜相关
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

    // 窗口调整大小事件处理
    window.addEventListener('resize', () => {
        renderBoard();
    });

    // ---- 初始化 ----
    updatePlayerNameDisplay();
    loadLeaderboardData(); // 加载排行榜数据
    initGame(); // 开始游戏
});
