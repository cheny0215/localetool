
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
    overlay.style.zIndex = '9999'; // 确保在最上层

    // 创建 loading 动画
    const loader = document.createElement('div');
    loader.style.border = '10px solid #f3f3f3'; // Light gray
    loader.style.borderTop = '10px solid #ff4081';
    loader.style.borderLeft = '10px solid #ff4081';
    // loader.style.borderBottom = '10px solid #1e9fff';
    // loader.style.borderRight = '10px solid #1e9fff';
    loader.style.borderRadius = '50%';
    loader.style.width = '60px';
    loader.style.height = '60px';
    loader.style.animation = 'spin 1s linear infinite'; // 旋转动画

    // 将 loading 动画添加到遮罩层
    overlay.appendChild(loader);
    document.body.appendChild(overlay);

    // 添加 CSS 动画样式
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    return {
        show: function() {
            overlay.style.display = 'flex';
        },
        hide: function() {
            overlay.style.display = 'none';
        }
    };

})();
