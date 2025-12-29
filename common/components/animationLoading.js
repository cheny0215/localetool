const animationLoading = (function(){
    // 定义20条恶搞随机加载文本
    const loadingTexts = [
        '程序员正在疯狂敲代码，手速快到冒烟了...',
        '服务器打了个哈欠，说：让我缓缓...',
        '数据迷路了，正在GPS导航中...',
        '系统：我太难了，给我点时间装个样子...',
        '加载中...其实我在摸鱼，别告诉老板',
        '正在召唤代码之神，需要念三遍咒语...',
        '网速慢？不存在的，是我故意拖延的',
        '系统正在思考人生，请勿打扰...',
        '数据在路上堵车了，前方请绕行...',
        '程序崩了又修好了，放心，我没告诉任何人',
        '正在喂养服务器，它说要吃饱才干活...',
        '加载中...别催，催也是这么慢',
        'CPU说它需要休息一下，毕竟996太累了',
        '正在贿赂网络管理员，马上就通了...',
        '系统正在装模作样地忙碌中...',
        '数据表示：老子在路上呢，急什么急！',
        '加载中...您的等待将会获得0.001秒的省时体验',
        '程序员正在debug，顺便喝了三杯咖啡...',
        '服务器：能不能让我安静地宕机一会？',
        '正在用意念传输数据，请保持专注...'
    ];

    function loaddingAnimation() {
        // 创建加载动画容器
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'modern-loading-container';
        loadingContainer.style.position = 'absolute';
        loadingContainer.style.top = '0';
        loadingContainer.style.left = '0';
        loadingContainer.style.width = '100%';
        loadingContainer.style.height = '100%';
        loadingContainer.style.display = 'flex';
        loadingContainer.style.justifyContent = 'center';
        loadingContainer.style.alignItems = 'center';
        // 使用主题变量，实现主题跟随效果
        loadingContainer.style.background = 'var(--loading-bg)';
        loadingContainer.style.zIndex = '999';
        loadingContainer.style.transition = 'all 0.5s ease';
        loadingContainer.style.overflow = 'hidden';

        // 创建背景粒子效果
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.position = 'absolute';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.overflow = 'hidden';

        // 添加多个粒子
        for (let i = 0; i < 60; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'absolute';
            particle.style.width = `${Math.random() * 4 + 2}px`;
            particle.style.height = particle.style.width;
            particle.style.background = 'rgba(255, 255, 255, 0.8)';
            particle.style.borderRadius = '50%';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animation = `float ${Math.random() * 10 + 10}s ease-in-out infinite`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
            particlesContainer.appendChild(particle);
        }

        // 创建玻璃态主容器
        const glassContainer = document.createElement('div');
        glassContainer.className = 'glass-container';
        glassContainer.style.position = 'relative';
        glassContainer.style.width = '400px';
        glassContainer.style.padding = '60px 40px';
        glassContainer.style.display = 'flex';
        glassContainer.style.flexDirection = 'column';
        glassContainer.style.alignItems = 'center';
        glassContainer.style.zIndex = '2';
        glassContainer.style.animation = 'float-in 0.8s ease-out';

        // 创建旋转圆环加载器
        const spinnerContainer = document.createElement('div');
        spinnerContainer.className = 'spinner-container';
        spinnerContainer.style.position = 'relative';
        spinnerContainer.style.width = '120px';
        spinnerContainer.style.height = '120px';
        spinnerContainer.style.marginBottom = '40px';

        // 外层圆环
        const outerRing = document.createElement('div');
        outerRing.className = 'outer-ring';
        outerRing.style.position = 'absolute';
        outerRing.style.width = '100%';
        outerRing.style.height = '100%';
        outerRing.style.border = '3px solid transparent';
        outerRing.style.borderTopColor = '#ffffff';
        outerRing.style.borderRightColor = '#ffffff';
        outerRing.style.borderRadius = '50%';
        outerRing.style.animation = 'rotate 1.5s linear infinite';
        outerRing.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))';

        // 中层圆环
        const middleRing = document.createElement('div');
        middleRing.className = 'middle-ring';
        middleRing.style.position = 'absolute';
        middleRing.style.width = '80px';
        middleRing.style.height = '80px';
        middleRing.style.top = '20px';
        middleRing.style.left = '20px';
        middleRing.style.border = '3px solid transparent';
        middleRing.style.borderBottomColor = '#a8edea';
        middleRing.style.borderLeftColor = '#a8edea';
        middleRing.style.borderRadius = '50%';
        middleRing.style.animation = 'rotate-reverse 2s linear infinite';
        middleRing.style.filter = 'drop-shadow(0 0 8px rgba(168, 237, 234, 0.5))';

        // 内层发光核心
        const core = document.createElement('div');
        core.className = 'core';
        core.style.position = 'absolute';
        core.style.width = '40px';
        core.style.height = '40px';
        core.style.top = '40px';
        core.style.left = '40px';
        core.style.background = 'linear-gradient(135deg, #667eea 0%, #a8edea 100%)';
        core.style.borderRadius = '50%';
        core.style.animation = 'pulse 2s ease-in-out infinite';
        core.style.boxShadow = '0 0 30px rgba(168, 237, 234, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.3)';

        // 组装旋转器
        spinnerContainer.appendChild(outerRing);
        spinnerContainer.appendChild(middleRing);
        spinnerContainer.appendChild(core);

        // 创建加载文本
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.textContent = 'Loading';
        loadingText.style.color = '#ffffff';
        loadingText.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        loadingText.style.fontSize = '28px';
        loadingText.style.fontWeight = '600';
        loadingText.style.marginBottom = '10px';
        loadingText.style.letterSpacing = '2px';
        loadingText.style.textShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        loadingText.style.animation = 'text-shimmer 2s ease-in-out infinite';

        // 创建副标题
        const subText = document.createElement('div');
        subText.className = 'sub-text';
        // 随机选择一条加载文本
        const randomText = loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
        subText.textContent = randomText;
        subText.style.color = 'rgba(255, 255, 255, 0.8)';
        subText.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        subText.style.fontSize = '14px';
        subText.style.fontWeight = '400';
        subText.style.marginBottom = '30px';
        subText.style.opacity = '0.9';

        // 创建进度条容器
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.style.width = '100%';
        progressContainer.style.height = '6px';
        progressContainer.style.background = 'rgba(255, 255, 255, 0.2)';
        progressContainer.style.borderRadius = '10px';
        progressContainer.style.overflow = 'hidden';
        progressContainer.style.position = 'relative';
        progressContainer.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.1)';

        // 创建进度条
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.height = '100%';
        progressBar.style.width = '0%';
        progressBar.style.background = 'linear-gradient(90deg, #667eea, #a8edea, #ffffff)';
        progressBar.style.borderRadius = '10px';
        progressBar.style.transition = 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        progressBar.style.boxShadow = '0 0 15px rgba(168, 237, 234, 0.8)';
        progressBar.style.position = 'relative';
        progressBar.style.overflow = 'hidden';

        // 添加进度条光效
        const progressGlow = document.createElement('div');
        progressGlow.style.position = 'absolute';
        progressGlow.style.top = '0';
        progressGlow.style.left = '0';
        progressGlow.style.width = '100%';
        progressGlow.style.height = '100%';
        progressGlow.style.background = 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)';
        progressGlow.style.animation = 'shimmer 1.5s ease-in-out infinite';
        progressBar.appendChild(progressGlow);

        progressContainer.appendChild(progressBar);

        // 创建百分比显示
        const percentText = document.createElement('div');
        percentText.className = 'percent-text';
        percentText.textContent = '0%';
        percentText.style.color = 'rgba(255, 255, 255, 0.9)';
        percentText.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        percentText.style.fontSize = '18px';
        percentText.style.fontWeight = '500';
        percentText.style.marginTop = '20px';
        percentText.style.letterSpacing = '1px';

        // 组装玻璃态容器
        glassContainer.appendChild(spinnerContainer);
        glassContainer.appendChild(loadingText);
        glassContainer.appendChild(subText);
        glassContainer.appendChild(progressContainer);
        glassContainer.appendChild(percentText);

        // 添加动画样式
        if (!document.getElementById('modern-loading-styles')) {
            const style = document.createElement('style');
            style.id = 'modern-loading-styles';
            style.textContent = `
                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes rotate-reverse {
                    0% { transform: rotate(360deg); }
                    100% { transform: rotate(0deg); }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 30px rgba(168, 237, 234, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.3);
                    }
                    50% {
                        transform: scale(1.1);
                        box-shadow: 0 0 50px rgba(168, 237, 234, 1), inset 0 0 30px rgba(255, 255, 255, 0.5);
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                    }
                    25% {
                        transform: translateY(-20px) translateX(10px);
                    }
                    50% {
                        transform: translateY(-40px) translateX(-10px);
                    }
                    75% {
                        transform: translateY(-20px) translateX(5px);
                    }
                }
                
                @keyframes float-in {
                    0% {
                        opacity: 0;
                        transform: translateY(30px) scale(0.9);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes text-shimmer {
                    0%, 100% {
                        opacity: 1;
                        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                    }
                    50% {
                        opacity: 0.8;
                        text-shadow: 0 2px 20px rgba(255, 255, 255, 0.5);
                    }
                }
                
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(200%);
                    }
                }
                
                .modern-loading-container.fade-out {
                    opacity: 0;
                    transform: scale(0.95);
                }
            `;
            document.head.appendChild(style);
        }

        // 组装所有元素
        loadingContainer.appendChild(particlesContainer);
        loadingContainer.appendChild(glassContainer);
        document.getElementById('content').appendChild(loadingContainer);

        // 模拟进度更新
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;
            progressBar.style.width = `${progress}%`;
            percentText.textContent = `${Math.floor(progress)}%`;

            if (progress === 100) {
                clearInterval(progressInterval);
            }
        }, 0);

        // 确保在加载完成时进度条达到100%
        loadingContainer.setProgress = (value) => {
            if (value === 100) {
                clearInterval(progressInterval);
                progressBar.style.width = '100%';
                percentText.textContent = '100%';
            }
        };

        // 清理函数
        loadingContainer.cleanup = () => {
            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            percentText.textContent = '100%';
        };

        return loadingContainer;
    }
    return {
        loaddingAnimation: loaddingAnimation
    }
})();

// 1. 作为全局变量
window.animationLoading = animationLoading;
