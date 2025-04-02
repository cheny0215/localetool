// 主题切换功能
function initTheme() {
    // 主题切换函数
    window.switchTheme = function(themeName) {
        // 保存主题选择到本地存储
        localStorage.setItem('preferred-theme', themeName);
        // 设置主题
        document.documentElement.setAttribute('data-theme', themeName);
        
        // 触发过渡动画
        document.body.style.transition = 'background-color 0.3s ease';
        document.querySelector('#sidebar').style.transition = 'all 0.3s ease';
        document.querySelector('.nav').style.transition = 'background-color 0.3s ease';
        
        // 更新导航栏样式
        updateNavStyles();
        
        // 通知用户
        layer.msg('主题切换成功：' + getThemeName(themeName), {
            offset: 't',
            anim: 6
        });
    }

    // 更新导航栏样式
    function updateNavStyles() {
        const nav = document.querySelector('.nav');
        const navItems = document.querySelectorAll('.layui-nav-item a');
        
        // 应用导航栏背景色
        nav.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--header-bg');
        nav.style.color = getComputedStyle(document.documentElement).getPropertyValue('--header-text');
        
        // 应用导航项文字颜色
        navItems.forEach(item => {
            item.style.color = getComputedStyle(document.documentElement).getPropertyValue('--header-text');
        });
    }

    // 获取主题名称
    function getThemeName(theme) {
        const themeNames = {
            'default': '默认主题',
            'dark': '深邃夜空',
            'green': '清新森林',
            'purple': '优雅紫罗',
            'ocean': '海洋之心',
            'sunset': '晚霞橘暮',
            'cherry': '樱花粉韵',
            'mint': '薄荷清晨',
            'tech': '科技蓝调',
            'coffee': '咖啡时光'
        };
        return themeNames[theme] || theme;
    }

    // 页面加载时恢复上次的主题设置
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        // 确保导航栏样式也更新
        setTimeout(updateNavStyles, 100);
    }
}

// 页面加载完成后初始化主题
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
}); 