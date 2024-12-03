// 全局message组件
const showMessage = ({msg, type, delay = 2000, isTransition = true}) => {
    const messageBox = document.createElement('div');
    messageBox.className = 'custom-alert';
    messageBox.textContent = msg;
    document.body.appendChild(messageBox);

    // 定义主题色变量
    const themes = {
        success: {
            background: 'linear-gradient(145deg, #28a745, #20c997)',
            boxShadow: '0 4px 12px rgba(40, 167, 69, 0.15)',
            border: '1px solid rgba(40, 167, 69, 0.1)'
        },
        warning: {
            background: 'linear-gradient(145deg, #ffc107, #fd7e14)',
            boxShadow: '0 4px 12px rgba(255, 193, 7, 0.15)',
            border: '1px solid rgba(255, 193, 7, 0.1)'
        },
        error: {
            background: 'linear-gradient(145deg, #dc3545, #e83e8c)',
            boxShadow: '0 4px 12px rgba(220, 53, 69, 0.15)',
            border: '1px solid rgba(220, 53, 69, 0.1)'
        },
        info: {
            background: 'linear-gradient(145deg, #17a2b8, #007bff)',
            boxShadow: '0 4px 12px rgba(23, 162, 184, 0.15)',
            border: '1px solid rgba(23, 162, 184, 0.1)'
        }
    };

    // 基础样式
    const baseStyles = {
        position: 'fixed',
        top: '20px',
        left: '50%',
        minWidth: '320px',
        maxWidth: '480px',
        padding: '12px 24px',
        color: '#ffffff',
        borderRadius: '8px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '1.5',
        display: 'none',
        zIndex: '10000',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transform: 'translateX(-50%) translateY(-20px)',
        opacity: '0',
        transition: isTransition ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : '',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
    };

    // 应用基础样式
    Object.assign(messageBox.style, baseStyles);

    // 应用主题样式
    const theme = themes[type] || themes.info;
    Object.assign(messageBox.style, {
        background: theme.background,
        boxShadow: theme.boxShadow,
        border: theme.border
    });

    // 显示消息框
    messageBox.style.display = 'flex';
    
    // 使用requestAnimationFrame确保动画流畅
    requestAnimationFrame(() => {
        messageBox.style.opacity = '1';
        messageBox.style.transform = 'translateX(-50%) translateY(0)';
    });

    // 自动隐藏消息框
    const hideTimeout = setTimeout(() => {
        messageBox.style.opacity = '0';
        messageBox.style.transform = 'translateX(-50%) translateY(-20px)';
        
        // 等待动画结束后移除元素
        setTimeout(() => {
            document.body.removeChild(messageBox);
        }, 300);
    }, delay);

    // 鼠标悬停时暂停计时器
    messageBox.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
    });

    // 鼠标离开时重新开始计时
    messageBox.addEventListener('mouseleave', () => {
        setTimeout(() => {
            messageBox.style.opacity = '0';
            messageBox.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(messageBox);
            }, 300);
        }, delay / 2);
    });
};