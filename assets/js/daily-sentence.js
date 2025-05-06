async function fetchDailyTextData() {
    // 请确保替换为您自己的有效 ID 和 KEY
    const apiKey = '0e8b0763210c6f7f19b175a6c177ca4f'; // 示例 Key，请替换
    const apiId = '10004465'; // 示例 ID，请替换
    
    let apiUrl = `https://cn.apihz.cn/api/yiyan/api.php?id=${apiId}&key=${apiKey}`;
  

    const headerText = document.getElementById('header-text');
    headerText.innerHTML = '<div class="loading">正在加载数据...</div>'; 

    try {
        const response = await fetch(apiUrl);
        // 检查响应是否成功
        if (!response.ok) {
            // 如果响应状态码不是 2xx，尝试读取响应体以获取错误信息
            let errorData = { msg: `HTTP error! status: ${response.status}` }; // 默认错误
            try {
                errorData = await response.json(); // 尝试解析 JSON 错误信息
            } catch (e) {
                // 如果响应体不是 JSON 或解析失败，使用默认错误
                console.error('Failed to parse error response:', e);
            }
            throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // 检查 API 返回的业务代码
        if (data.code !== 200) {
            throw new Error(data.msg || '获取数据失败');
        }

        updateLocationDisplay(data.msg); // 使用 API 返回的确认地点信息更新显示

    } catch (error) {
        console.error('获取数据时出错:', error);
        headerText.innerHTML = `<div class="error">加载数据失败: ${error.message}</div>`;
    }
}

function updateLocationDisplay(data) {
    const headerText = document.getElementById('header-text');
    headerText.innerHTML = `<span id="scrolling-text">每日一言：${data}～～</span>`;
    
    // 确保DOM更新后再执行滚动逻辑
    setTimeout(() => {
        // 获取文本元素
        const scrollingText = document.getElementById('scrolling-text');
        const container = headerText;
        
        // 设置滚动文本的样式以确保滚动效果正常
        scrollingText.style.display = 'inline-block';
        scrollingText.style.whiteSpace = 'nowrap';
        
        console.log('文本宽度:', scrollingText.offsetWidth, '容器宽度:', container.offsetWidth);
        
        // 检查文本是否需要滚动（内容宽度大于容器宽度）
        // 强制滚动以便于测试
        if (true) { // 确保滚动机制启动
            // 设置初始位置（从右侧开始）
            let position = 0;
            let speed = 2; // 增加滚动速度，使效果更明显
            let direction = -1; // 向左滚动
            let pauseDelay = 2000; // 滚动到两端后暂停时间（毫秒）
            let isPaused = false;
            let pauseTimer;
            
            // 启动滚动动画
            const scrollAnimation = setInterval(() => {
                if (isPaused) return;
                
                // 移动文本
                position += speed * direction;
                scrollingText.style.transform = `translateX(${position}px)`;
                
                // 左侧边界检测（向左滚动到尽头）
                const maxScrollLeft = scrollingText.offsetWidth - container.offsetWidth + 20; // 添加额外的边界空间
                
                if (direction < 0 && position <= -maxScrollLeft) {
                    isPaused = true;
                    console.log('到达左侧边界，准备向右滚动');
                    // 暂停片刻后向右滚动
                    pauseTimer = setTimeout(() => {
                        direction = 1; // 改变方向为向右
                        isPaused = false;
                    }, pauseDelay);
                }
                
                // 右侧边界检测（向右滚动到尽头）
                if (direction > 0 && position >= 0) {
                    isPaused = true;
                    console.log('到达右侧边界，准备向左滚动');
                    // 暂停片刻后向左滚动
                    pauseTimer = setTimeout(() => {
                        direction = -1; // 改变方向为向左
                        isPaused = false;
                    }, pauseDelay);
                }
            }, 20);
            
            // 清理函数，确保在页面离开时清除定时器
            window.addEventListener('beforeunload', () => {
                clearInterval(scrollAnimation);
                clearTimeout(pauseTimer);
            });
        }
    }, 500); // 给DOM半秒时间更新
}

fetchDailyTextData()