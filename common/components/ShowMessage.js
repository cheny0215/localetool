// 全局message组件
const showMessage = ({msg, type , delay=2000 ,isTransition=true}) => {
    const messageBox = document.createElement('div');
    messageBox.className = 'custom-alert';
    messageBox.textContent = msg;
    document.body.appendChild(messageBox);

    // 样式
    messageBox.style.position = 'fixed';
    messageBox.style.top = '20px'; /* 顶部距离 */
    messageBox.style.left = '50%'; /* 居中定位 */
    messageBox.style.width = '300px'; /* 固定宽度 */
    messageBox.style.padding = '15px';
    messageBox.style.backgroundColor = '#888888';
    messageBox.style.color = 'white';
    messageBox.style.borderRadius = '5px';
    messageBox.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    messageBox.style.display = 'none'; /* 默认隐藏 */
    messageBox.style.zIndex = '1000';
    messageBox.style.transition = isTransition ? 'opacity 0.3s, transform 0.3s' : '';
    messageBox.style.opacity = '0'; /* 初始透明度 */
    messageBox.style.transform = 'translateX(-50%) translateY(-20px)'; /* 向左移动50%宽度以实现居中 */

    if (type === 'success') {
        messageBox.style.backgroundColor = '#4caf50'; // 绿色
    } else if (type === 'warning') {
        messageBox.style.backgroundColor = '#ff9800'; // 橙色
    } else if (type === 'error') {
        messageBox.style.backgroundColor = '#f44336'; // 红色
    } else if (type === 'info') {
        messageBox.style.backgroundColor = '#1e9fff'; // 蓝色
    }
    messageBox.textContent = msg;   // 设置消息文本
    messageBox.style.display = 'block';   // 显示消息框
    requestAnimationFrame(() => {
        messageBox.style.opacity = '1';
        messageBox.style.transform = 'translateX(-50%) translateY(0)';
    });
    // 自动隐藏消息框
    setTimeout(() => {
        messageBox.style.opacity = '0';
        messageBox.style.transform = 'translateX(-50%) translateY(-20px)';
        // 等待动画结束后隐藏元素
        setTimeout(() => {
            messageBox.style.display = 'none';
            document.body.removeChild(messageBox)
        }, 300); // 与 CSS 中的过渡时间保持一致
    }, delay); // delay秒后隐藏
}