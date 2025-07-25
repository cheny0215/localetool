// 创建 loading 组件
const LoadingModule = (function() {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    overlay.style.display = 'none';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';

    // 创建 loading 容器
    const loaderContainer = document.createElement('div');
    loaderContainer.style.position = 'relative';
    loaderContainer.style.width = '100px';
    loaderContainer.style.height = '40px';
    loaderContainer.style.display = 'flex';
    loaderContainer.style.justifyContent = 'center';
    loaderContainer.style.alignItems = 'center';

    // 创建两个小球
    const dot1 = document.createElement('div');
    const dot2 = document.createElement('div');

    // 设置小球的基本样式
    const dotStyle = {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        position: 'absolute'
    };

    // 设置第一个小球样式
    Object.assign(dot1.style, dotStyle);
    dot1.style.backgroundColor = '#ff4081';
    dot1.style.animation = 'moveLeft 1.2s ease-in-out infinite';
    dot1.style.left = '20px';

    // 设置第二个小球样式
    Object.assign(dot2.style, dotStyle);
    dot2.style.backgroundColor = '#1e9fff';
    dot2.style.animation = 'moveRight 1.2s ease-in-out infinite';
    dot2.style.right = '20px';

    // 将小球添加到容器中
    loaderContainer.appendChild(dot1);
    loaderContainer.appendChild(dot2);
    overlay.appendChild(loaderContainer);
    
    // 添加 CSS 动画样式
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes moveLeft {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(40px); }
        }
        @keyframes moveRight {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-40px); }
        }
    `;
    document.head.appendChild(style);
    
    // 确保在DOM加载完成后添加到body
    document.addEventListener('DOMContentLoaded', function() {
        document.body.appendChild(overlay);
    });
    
    // 如果DOM已经加载完成，直接添加
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        document.body.appendChild(overlay);
    }

    return {
        show: function() {
            overlay.style.display = 'flex';
        },
        hide: function() {
            overlay.style.display = 'none';
        }
    };
})();
