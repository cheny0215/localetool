document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');
    const tileContainer = document.getElementById('tile-container');
    const scoreDisplay = document.getElementById('score');
    const resetButton = document.getElementById('reset-button');
    const gameOverMessage = document.getElementById('game-over-message');
    const tryAgainButton = document.getElementById('try-again-button');
    const gameContainer = document.querySelector('.game-container'); // 用于触摸事件

    const gridSize = 4;
    let grid = []; // 存储游戏状态 (二维数组)
    let score = 0;
    let isGameOver = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    console.log("2048 Game Script Loaded"); // 确认脚本已加载

    // --- 初始化游戏 ---
    function setupGame() {
        console.log("Setting up new game...");
        grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
        score = 0;
        isGameOver = false;
        tileContainer.innerHTML = ''; // 清空旧方块
        gameOverMessage.style.display = 'none';
        updateScore();
        addRandomTile();
        addRandomTile();
        // 延迟一点点调用 renderGrid，确保容器尺寸可用
        // requestAnimationFrame 确保在下一次浏览器重绘前执行
        requestAnimationFrame(() => {
             console.log("Initial renderGrid call");
             renderGrid();
        });
    }

    // --- 渲染方块 ---
    function renderGrid() {
        tileContainer.innerHTML = ''; // 清空现有方块以重新渲染

        const containerWidth = tileContainer.offsetWidth;
        const containerHeight = tileContainer.offsetHeight;
        const gap = 15;

        // !! 添加日志：检查获取到的容器尺寸 !!
        console.log(`Rendering Grid. Container dimensions: ${containerWidth}x${containerHeight}`);

        if (containerWidth === 0 || containerHeight === 0) {
             console.error("Error: Tile container has zero dimensions. Cannot render tiles correctly.");
             // 可以考虑在此处设置一个短暂的超时后重试渲染，或者提示用户
             // setTimeout(renderGrid, 100); // 简单的重试机制示例
             return; // 暂时停止渲染以避免错误
        }

        const tileWidthPx = (containerWidth - gap * (gridSize - 1)) / gridSize;
        const tileHeightPx = (containerHeight - gap * (gridSize - 1)) / gridSize;

        const tileWidthCSS = `calc((100% - ${gap * (gridSize - 1)}px) / ${gridSize})`;
        const tileHeightCSS = tileWidthCSS;

        // !! 添加日志：检查计算出的瓦片尺寸 !!
        // console.log(`Calculated tile pixel size: ${tileWidthPx}x${tileHeightPx}`);

        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] !== 0) {
                    const tile = document.createElement('div');
                    tile.classList.add('tile');
                    tile.dataset.value = grid[r][c];
                    tile.textContent = grid[r][c];

                    const topPx = r * (tileHeightPx + gap);
                    const leftPx = c * (tileWidthPx + gap);

                    // !! 添加日志：检查计算出的定位 !!
                    // console.log(`Tile (${r},${c}) value ${grid[r][c]} position: top=${topPx}px, left=${leftPx}px`);

                    tile.style.width = tileWidthCSS;
                    tile.style.height = tileHeightCSS;
                    tile.style.top = `${topPx}px`;
                    tile.style.left = `${leftPx}px`;

                    adjustFontSize(tile, grid[r][c]);
                    tileContainer.appendChild(tile);
                }
            }
        }
        console.log("Grid rendered."); // 确认渲染完成
    }

    // 调整字体大小函数 (可选，主要依赖CSS)
    function adjustFontSize(tileElement, value) {
        const textLength = String(value).length;
        if (value >= 1024) {
            tileElement.style.fontSize = '1.5em'; // 示例，具体数值可在CSS中调整
        } else if (value >= 128) {
            tileElement.style.fontSize = '1.8em';
        } else {
            tileElement.style.fontSize = '2em'; // 默认大小
        }
        // 响应式调整 (可选，CSS @media 优先级更高)
        if (window.innerWidth <= 520) {
             if (value >= 1024) {
                tileElement.style.fontSize = '1.1em';
            } else if (value >= 128) {
                tileElement.style.fontSize = '1.3em';
            } else {
                tileElement.style.fontSize = '1.5em';
            }
        }
    }


    // --- 添加随机方块 ---
    function addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }

        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            // 90% 概率生成 2，10% 概率生成 4
            grid[r][c] = Math.random() < 0.9 ? 2 : 4;
            // 创建并添加新方块的动画效果 (可选，CSS已处理 appear 动画)
            // renderGrid(); // 简单粗暴地重新渲染
        }
    }

    // --- 更新分数 ---
    function updateScore() {
        scoreDisplay.textContent = score;
    }

    // --- 处理移动和合并 ---
    function move(direction) {
        if (isGameOver) return;
        // !! 添加日志：跟踪移动方向 !!
        console.log(`Move attempt: ${direction}`);
        // console.log('Grid before move:', JSON.parse(JSON.stringify(grid))); // 可选：查看移动前状态

        let moved = false;
        // let currentGrid = JSON.parse(JSON.stringify(grid)); // 深拷贝用于比较，暂时不用

        switch (direction) {
            case 'up':    moved = moveUp(); break;
            case 'down':  moved = moveDown(); break;
            case 'left':  moved = moveLeft(); break;
            case 'right': moved = moveRight(); break;
        }

        // !! 添加日志：检查移动结果 !!
        console.log(`Move result for ${direction}: moved = ${moved}`);
        // console.log('Grid after move attempt:', JSON.parse(JSON.stringify(grid))); // 可选：查看移动后状态

        if (moved) {
            console.log("Adding random tile and re-rendering...");
            addRandomTile();
            // 使用 requestAnimationFrame 确保在下一次绘制前渲染
            requestAnimationFrame(renderGrid);
            if (checkGameOver()) {
                console.log("Game Over detected!");
                endGame();
            }
        } else {
            console.log("No movement occurred.");
        }
    }

    // 辅助函数：压缩一行/列（将非零数字移到前面）
    function slide(row) {
        let arr = row.filter(val => val); // 过滤掉 0
        let missing = gridSize - arr.length;
        let zeros = Array(missing).fill(0);
        arr = arr.concat(zeros); // 补齐 0
        return arr;
    }

    // 辅助函数：合并一行/列中的相同数字
    function combine(row) {
        for (let i = 0; i < gridSize - 1; i++) {
            if (row[i] !== 0 && row[i] === row[i + 1]) {
                row[i] *= 2;
                score += row[i]; // 更新分数
                row[i + 1] = 0;
                // 添加合并动画标记 (可选)
                // findTileElement(r, i).classList.add('merged'); // 需要实现 findTileElement
            }
        }
        updateScore();
        return row;
    }

    // --- 具体移动逻辑 ---
    function moveLeft() {
        let moved = false;
        for (let r = 0; r < gridSize; r++) {
            const originalRow = [...grid[r]];
            let row = grid[r];
            row = slide(row);
            row = combine(row);
            row = slide(row);
            grid[r] = row;
            if (originalRow.join(',') !== row.join(',')) {
                moved = true;
            }
        }
        // console.log('moveLeft executed, moved:', moved); // 可选日志
        return moved;
    }

    function moveRight() {
        let moved = false;
        for (let r = 0; r < gridSize; r++) {
            const originalRow = [...grid[r]];
            let row = grid[r].reverse(); // 反转以便复用 slide 和 combine
            row = slide(row);
            row = combine(row);
            row = slide(row);
            grid[r] = row.reverse(); // 再次反转回来
            if (originalRow.join(',') !== grid[r].join(',')) {
                moved = true;
            }
        }
        return moved;
    }

    // 辅助函数：旋转网格（用于上下移动）
    function rotateGrid() {
        const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                newGrid[c][gridSize - 1 - r] = grid[r][c];
            }
        }
        grid = newGrid;
    }

    function moveUp() {
        rotateGrid(); // 旋转90度，向上移动变为向左移动
        rotateGrid();
        rotateGrid();
        const moved = moveLeft();
        rotateGrid(); // 旋转回来
        return moved;
    }

    function moveDown() {
        rotateGrid(); // 旋转90度，向下移动变为向右移动
        const moved = moveRight();
        rotateGrid(); // 旋转回来
        rotateGrid();
        rotateGrid();
        return moved;
    }

    // --- 检查游戏是否结束 ---
    function checkGameOver() {
        // 检查是否有空格子
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === 0) {
                    return false; // 还有空位，游戏未结束
                }
            }
        }

        // 检查是否有可合并的相邻方块
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                // 检查右侧
                if (c < gridSize - 1 && grid[r][c] === grid[r][c + 1]) {
                    return false;
                }
                // 检查下方
                if (r < gridSize - 1 && grid[r][c] === grid[r + 1][c]) {
                    return false;
                }
            }
        }

        // 没有空位且没有可合并的方块
        return true;
    }

    // --- 结束游戏 ---
    function endGame() {
        isGameOver = true;
        gameOverMessage.style.display = 'flex'; // 显示结束信息
    }

    // --- 事件监听 ---
    // 键盘事件
    document.addEventListener('keydown', (event) => {
        // !! 添加日志：确认键盘事件被捕获 !!
        console.log(`Keydown event captured: ${event.key}`);
        if (isGameOver) {
            console.log("Game is over, ignoring key press.");
            return;
        }
        // 检查事件是否来自输入框等，防止干扰（如果页面有输入框的话）
        // if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        //     return;
        // }

        let handled = false; // 标记是否处理了按键
        switch (event.key) {
            case 'ArrowUp':    move('up');    handled = true; break;
            case 'ArrowDown':  move('down');  handled = true; break;
            case 'ArrowLeft':  move('left');  handled = true; break;
            case 'ArrowRight': move('right'); handled = true; break;
        }
        // 如果是我们处理的方向键，阻止默认行为（如页面滚动）
        if (handled) {
            event.preventDefault();
            console.log(`Handled key: ${event.key}`);
        }
    });

    // 触摸事件 (滑动)
    gameContainer.addEventListener('touchstart', (event) => {
        if (isGameOver) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    });

    gameContainer.addEventListener('touchmove', (event) => {
        if (isGameOver) return;
        // 阻止页面滚动
        event.preventDefault();
        touchEndX = event.touches[0].clientX;
        touchEndY = event.touches[0].clientY;
    }, { passive: false }); // passive: false 允许 preventDefault

    gameContainer.addEventListener('touchend', () => {
        if (isGameOver) return;
        handleSwipe();
        // 重置触摸坐标
        touchStartX = 0;
        touchStartY = 0;
        touchEndX = 0;
        touchEndY = 0;
    });

    function handleSwipe() {
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        const threshold = 50; // 滑动阈值

        // 判断主要滑动方向
        if (Math.abs(diffX) > Math.abs(diffY)) { // 水平滑动
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    move('right');
                } else {
                    move('left');
                }
            }
        } else { // 垂直滑动
            if (Math.abs(diffY) > threshold) {
                if (diffY > 0) {
                    move('down');
                } else {
                    move('up');
                }
            }
        }
    }


    // 重置按钮
    resetButton.addEventListener('click', setupGame);
    tryAgainButton.addEventListener('click', setupGame);

    // --- 开始游戏 ---
    console.log("Initializing game setup...");
    setupGame();
}); 