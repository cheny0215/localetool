(function () {
    // 倒计时功能
function initCountdown() {
    // 获取DOM元素
    const countdownCard = document.getElementById('countdownCard');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettings = document.getElementById('closeSettings');
    const cancelSettings = document.getElementById('cancelSettings');
    const saveSettings = document.getElementById('saveSettings');
    const toggleCountdown = document.getElementById('toggleCountdown');
    
    // 获取或初始化userInfo对象
    let userInfo = {};
    try {
        const storedUserInfo = localStorage.getItem('userInfo');
        userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : {};
    } catch (e) {
        console.error('解析userInfo出错:', e);
        userInfo = {}
    }
    // 初始化倒计时显示状态
    let isCountdownVisible = userInfo.countdownVisible === true;
    
    // 设置初始状态
    if (isCountdownVisible) {
        countdownCard.classList.add('visible');
        toggleCountdown.textContent = '隐藏下班倒计时';
    } else {
        countdownCard.classList.remove('visible');
        toggleCountdown.textContent = '显示下班倒计时';
    }
    
    // 切换倒计时显示/隐藏
    toggleCountdown.addEventListener('click', function() {
        isCountdownVisible = !isCountdownVisible;
        userInfo.countdownVisible = isCountdownVisible;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        if (isCountdownVisible) {
            countdownCard.classList.add('visible');
            toggleCountdown.textContent = '隐藏下班倒计时';
            layer.msg('已显示下班倒计时', {
                offset: 'b',
                anim: 1
            });
        } else {
            countdownCard.classList.remove('visible');
            toggleCountdown.textContent = '显示下班倒计时';
            layer.msg('已隐藏下班倒计时', {
                offset: 'b',
                anim: 1
            });
        }
    });
    
    // 时间输入框
    const workStartTime = document.getElementById('workStartTime');
    const lunchStartTime = document.getElementById('lunchStartTime');
    const lunchEndTime = document.getElementById('lunchEndTime');
    const workEndTime = document.getElementById('workEndTime');
    
    // 当前时间表显示
    const currentWorkStart = document.getElementById('currentWorkStart');
    const currentLunch = document.getElementById('currentLunch');
    const currentWorkEnd = document.getElementById('currentWorkEnd');
    
    // 倒计时显示元素
    const countdownTitle = document.getElementById('countdownTitle');
    const countdownTime = document.getElementById('countdownTime');
    const countdownDesc = document.getElementById('countdownDesc');
    const countdownIcon = document.getElementById('countdownIcon');
    
    // 默认时间设置
    let timeSettings = {
        workStart: '09:30',
        lunchStart: '12:00',
        lunchEnd: '14:00',
        workEnd: '18:30'
    };
    
    // 从本地存储加载时间设置
    const savedSettings = userInfo.workTimeSettings;
    if (savedSettings) {
        timeSettings = savedSettings;
    }
    
    // 更新设置面板中的时间
    function updateSettingsDisplay() {
        workStartTime.value = timeSettings.workStart;
        lunchStartTime.value = timeSettings.lunchStart;
        lunchEndTime.value = timeSettings.lunchEnd;
        workEndTime.value = timeSettings.workEnd;
        
        currentWorkStart.textContent = timeSettings.workStart;
        currentLunch.textContent = `${timeSettings.lunchStart} - ${timeSettings.lunchEnd}`;
        currentWorkEnd.textContent = timeSettings.workEnd;
    }
    
    // 初始化设置面板
    updateSettingsDisplay();
    
    // 打开设置面板
    countdownCard.addEventListener('click', function() {
        settingsPanel.style.display = 'block';
    });
    
    // 关闭设置面板
    closeSettings.addEventListener('click', function() {
        settingsPanel.style.display = 'none';
    });
    
    cancelSettings.addEventListener('click', function() {
        settingsPanel.style.display = 'none';
        updateSettingsDisplay(); // 恢复原始设置
    });
    
    // 保存设置
    saveSettings.addEventListener('click', function() {
        timeSettings = {
            workStart: workStartTime.value,
            lunchStart: lunchStartTime.value,
            lunchEnd: lunchEndTime.value,
            workEnd: workEndTime.value
        };
        userInfo.workTimeSettings = timeSettings
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        updateSettingsDisplay();
        settingsPanel.style.display = 'none';
        
        // 显示保存成功消息
        layer.msg('工作时间设置已保存', {
            offset: 'b',
            anim: 1
        });
    });
    
    // 计算倒计时
    function updateCountdown() {
        const now = new Date();
        
        // 解析时间设置
        const parseTime = (timeStr) => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const date = new Date(now);
            date.setHours(hours, minutes, 0, 0);
            return date;
        };
        
        const workStartDate = parseTime(timeSettings.workStart);
        const lunchStartDate = parseTime(timeSettings.lunchStart);
        const lunchEndDate = parseTime(timeSettings.lunchEnd);
        const workEndDate = parseTime(timeSettings.workEnd);
        
        // 计算当前时间段（转换为分钟便于比较）
        const nowTime = now.getHours() * 60 + now.getMinutes();
        const workStartTime = parseInt(timeSettings.workStart.split(':')[0]) * 60 + parseInt(timeSettings.workStart.split(':')[1]);
        const lunchStartTime = parseInt(timeSettings.lunchStart.split(':')[0]) * 60 + parseInt(timeSettings.lunchStart.split(':')[1]);
        const lunchEndTime = parseInt(timeSettings.lunchEnd.split(':')[0]) * 60 + parseInt(timeSettings.lunchEnd.split(':')[1]);
        const workEndTime = parseInt(timeSettings.workEnd.split(':')[0]) * 60 + parseInt(timeSettings.workEnd.split(':')[1]);
        
        // 格式化时间差的通用函数
        const formatTimeDiff = (timeDiff) => {
            // 计算小时、分钟和秒
            const hours = Math.floor(Math.abs(timeDiff) / (1000 * 60 * 60));
            const minutes = Math.floor((Math.abs(timeDiff) % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((Math.abs(timeDiff) % (1000 * 60)) / 1000);
            
            // 返回格式化的时间字符串
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };
        
        // 辅助函数：从 URL 中获取文件名
        const getFilenameFromUrl = (url) => {
             try {
                 const parsedUrl = new URL(url, window.location.href); // 处理相对路径和绝对路径
                 return parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf('/') + 1);
             } catch (e) {
                 // 如果 URL 无效或为空，返回空字符串或进行错误处理
                 return ""; 
             }
         };
        
        let timeDiff;
        let newIconFilename = '';
        let currentIconFilename = getFilenameFromUrl(countdownIcon.src);
        
        // 上班前
        if (nowTime < workStartTime) {
            countdownDesc.innerHTML = '可恶！快<span style="color:#fff;font-size:16px;">上班</span>了💼<br>只有';
            newIconFilename = 'coffee.png';
            timeDiff = workStartDate - now;
        } 
        // 上午工作时间
        else if (nowTime >= workStartTime && nowTime < lunchStartTime) {
            countdownDesc.innerHTML = '距离<span style="color:#fff;font-size:16px;">干饭</span>时间<br>竟然还有';
            newIconFilename = 'work.png';
            timeDiff = lunchStartDate - now;
        }
        // 午休时间
        else if (nowTime >= lunchStartTime && nowTime < lunchEndTime) {
            countdownDesc.innerHTML = '<span style="color:#fff;font-size:16px;">午休</span>时间告急～<br>仅剩';
            newIconFilename = 'lunch.png';
            timeDiff = lunchEndDate - now;
        }
        // 下午工作时间
        else if (nowTime >= lunchEndTime && nowTime < workEndTime) {
            countdownDesc.innerHTML = '坚持就是胜利✌️<br>距离<span style="color:#fff;font-size:16px;">下班</span>还有';
            newIconFilename = 'run.png';
            timeDiff = workEndDate - now;
        }
        // 下班后
        else {
            countdownDesc.innerHTML = '晚上好，加班🐶<br>你已经<span style="color:#fff;font-size:16px;">加班</span>';
            newIconFilename = 'moon.png';
            timeDiff = now - workEndDate; // 注意这里是计算已经加班的时间
        }
        
        // 只有当图标需要改变时才更新 src
        if (newIconFilename && currentIconFilename !== newIconFilename) {
             countdownIcon.src = `./assets/icons/${newIconFilename}`;
        }
        
        // 更新倒计时显示
        countdownTime.textContent = formatTimeDiff(timeDiff);
    }
    
    // 立即更新一次倒计时
    updateCountdown();
    
    // 每秒更新一次倒计时
    setInterval(updateCountdown, 1000);

    // 获取不再显示按钮
    const hideCountdown = document.getElementById('hideCountdown');

    // 添加不再显示按钮的点击事件
    hideCountdown.addEventListener('click', function() {
        isCountdownVisible = false;
        userInfo.countdownVisible = false;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        countdownCard.classList.remove('visible');
        toggleCountdown.textContent = '显示下班倒计时';
        settingsPanel.style.display = 'none';
        
        // 显示提示消息
        layer.msg('已隐藏下班倒计时，可在导航栏设置中重新开启', {
            offset: 'b',
            anim: 1,
            time: 3000
        });
    });
}

// 页面加载完成后初始化倒计时
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
}); 
})()