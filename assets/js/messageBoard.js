(function () {
    // 留言板功能
document.addEventListener('DOMContentLoaded', function() {
    const messageBoardLink = document.querySelector('a[href=""][aria-label="留言板"]');
    if (messageBoardLink) {
        messageBoardLink.addEventListener('click', function(e) {
            e.preventDefault();
            showMessageBoard();
        });
    }
});

// 请确保替换为您自己的有效 ID 和 KEY
const apiKey = '0e8b0763210c6f7f19b175a6c177ca4f'; // 示例 Key，请替换
const apiId = '10004465'; // 示例 ID，请替换
const fixedNumId = 1; // 固定使用numid=1存储所有留言
const PAGE_SIZE = 20; // 每页显示留言数
let currentPage = 1; // 当前页码
let totalMessages = []; // 存储所有留言

// 显示留言板面板
function showMessageBoard() {
    // 如果已经存在留言板，则直接显示
    if (document.getElementById('messageBoardPanel')) {
        document.getElementById('messageBoardPanel').style.display = 'block';
        // 刷新留言数据
        fetchMessages();
        return;
    }

    // 创建留言板面板
    const messageBoardPanel = document.createElement('div');
    messageBoardPanel.id = 'messageBoardPanel';
    messageBoardPanel.className = 'message-board-panel';
    
    // 留言板 HTML 结构
    messageBoardPanel.innerHTML = `
        <div class="board-header">
            <div class="board-title">
                <span>留言板</span>
            </div>
            <div class="board-close" id="closeMessageBoard">×</div>
        </div>
        <div class="board-tabs">
            <div class="board-tab active" data-tab="view">查看留言</div>
            <div class="board-tab" data-tab="post">发布留言</div>
        </div>
        <div class="board-content">
            <div class="board-tab-content active" id="viewContent">
                <div class="message-filter">
                    <button id="refreshMessages" class="message-btn">刷新留言</button>
                    <div class="message-count" id="messageCount">共 0 条留言</div>
                </div>
                <div class="message-display">
                    <div class="message-loading" id="messageLoading">
                        <div class="loading-bubble"></div>
                        <div class="loading-bubble"></div>
                        <div class="loading-bubble"></div>
                    </div>
                    <div class="message-placeholder" id="messagePlaceholder">
                        <p>暂无留言内容，快来发表第一条留言吧~</p>
                    </div>
                    <div class="messages-list" id="messagesList">
                        <!-- 留言内容将在这里动态生成 -->
                    </div>
                </div>
                <div class="pagination" id="messagePagination">
                    <button class="pagination-btn" id="prevPage" disabled>&laquo; 上一页</button>
                    <div class="pagination-info">
                        <span id="pageInfo">第 1 页 / 共 1 页</span>
                    </div>
                    <button class="pagination-btn" id="nextPage" disabled>下一页 &raquo;</button>
                </div>
            </div>
            <div class="board-tab-content" id="postContent">
                <div class="message-form">
                    <div class="form-group">
                        <label for="userName">您的名字:</label>
                        <input type="text" id="userName" class="message-input" placeholder="请输入您的名字" maxlength="30">
                    </div>
                    <div class="form-group">
                        <label for="postTitle">标题 (选填):</label>
                        <input type="text" id="postTitle" class="message-input" placeholder="请输入留言标题" maxlength="50">
                    </div>
                    <div class="form-group">
                        <label for="postContentTextarea">内容:</label>
                        <textarea id="postContentTextarea" class="message-textarea" placeholder="请输入留言内容 (不超过1000字符)" maxlength="1000"></textarea>
                        <div class="char-counter"><span id="charCount">0</span>/1000</div>
                    </div>
                    <div class="form-footer">
                        <button id="submitMessage" class="message-btn submit-btn">发布留言</button>
                        <button id="resetForm" class="message-btn reset-btn">重置</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(messageBoardPanel);
    
    // 添加CSS样式文件
    addMessageBoardCSS();
    
    // 添加事件监听器
    setupMessageBoardEvents();
    
    // 等待DOM完全加载后再加载留言数据
    setTimeout(() => {
        // 加载留言数据
        fetchMessages();
        
        // 强制重新计算布局，确保滚动条正确显示
        const messageDisplay = document.querySelector('.message-display');
        const boardTabContent = document.querySelector('.board-tab-content.active');
        
        if (messageDisplay) {
            messageDisplay.style.display = 'none';
            setTimeout(() => {
                messageDisplay.style.display = '';
            }, 0);
        }
        
        if (boardTabContent) {
            boardTabContent.style.display = 'none';
            setTimeout(() => {
                boardTabContent.style.display = 'block';
            }, 0);
        }
    }, 100);
}

// 添加留言板CSS样式文件
function addMessageBoardCSS() {
    if (!document.getElementById('messageBoardCSS')) {
        const linkElement = document.createElement('link');
        linkElement.id = 'messageBoardCSS';
        linkElement.rel = 'stylesheet';
        linkElement.href = './assets/css/messageBoard.css';
        document.head.appendChild(linkElement);
    }
}

// 设置留言板事件
function setupMessageBoardEvents() {
    // 关闭按钮
    document.getElementById('closeMessageBoard').addEventListener('click', function() {
        document.getElementById('messageBoardPanel').style.display = 'none';
    });
    
    // 标签切换
    const tabs = document.querySelectorAll('.board-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有 active 类
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.board-tab-content').forEach(c => c.classList.remove('active'));
            
            // 添加 active 类到当前标签和内容
            this.classList.add('active');
            const tabName = this.getAttribute('data-tab');
            if (tabName === 'view') {
                document.getElementById('viewContent').classList.add('active');
                document.getElementById('postContent').classList.remove('active');
            } else {
                document.getElementById('postContent').classList.add('active');
                document.getElementById('viewContent').classList.remove('active');
            }
        });
    });
    
    // 刷新留言按钮
    document.getElementById('refreshMessages').addEventListener('click', function() {
        fetchMessages();
    });
    
    // 上一页按钮
    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderCurrentPage();
        }
    });
    
    // 下一页按钮
    document.getElementById('nextPage').addEventListener('click', function() {
        const totalPages = Math.ceil(totalMessages.length / PAGE_SIZE);
        if (currentPage < totalPages) {
            currentPage++;
            renderCurrentPage();
        }
    });
    
    // 字符计数
    document.getElementById('postContentTextarea').addEventListener('input', function() {
        const charCount = this.value.length;
        document.getElementById('charCount').textContent = charCount;
    });
    
    // 提交留言
    document.getElementById('submitMessage').addEventListener('click', function() {
        submitMessage();
    });
    
    // 重置表单
    document.getElementById('resetForm').addEventListener('click', function() {
        document.getElementById('userName').value = '';
        document.getElementById('postTitle').value = '';
        document.getElementById('postContentTextarea').value = '';
        document.getElementById('charCount').textContent = '0';
    });
}

// 获取所有留言
function fetchMessages() {
    // 显示加载状态
    document.getElementById('messageLoading').style.display = 'block';
    document.getElementById('messagePlaceholder').style.display = 'none';
    document.getElementById('messagesList').style.display = 'none';
    
    // 重置分页
    currentPage = 1;
    
    // 构建请求参数
    const params = {
        id: apiId,
        key: apiKey,
        type: 2, // 读取记录
        numid: fixedNumId
    };
    
    // 构建URL
    const apiUrl = `https://cn.apihz.cn/api/cunchu/textcc.php?id=${params.id}&key=${params.key}&type=${params.type}&numid=${params.numid}`;
    
    // 发起实际API请求
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            handleMessagesResponse(data);
        })
        .catch(error => {
            console.error('API调用失败:', error);
            handleMessagesResponse({
                code: 400,
                msg: '获取留言失败，请检查网络连接'
            });
        });
}

// 处理留言响应
function handleMessagesResponse(response) {
    // 隐藏加载状态
    document.getElementById('messageLoading').style.display = 'none';
    
    if (response.code === 200 && response.words) {
        try {
            // 尝试解析JSON数据
            try {
                totalMessages = JSON.parse(response.words);
                if (!Array.isArray(totalMessages)) {
                    totalMessages = [];
                }
            } catch (e) {
                console.error('解析留言数据失败:', e);
                totalMessages = [];
            }
            
            // 更新留言计数
            document.getElementById('messageCount').textContent = `共 ${totalMessages.length} 条留言`;
            
            // 显示留言列表
            if (totalMessages.length > 0) {
                // 更新分页信息
                updatePagination();
                
                // 渲染当前页
                renderCurrentPage();
                
                document.getElementById('messagesList').style.display = 'block';
                document.getElementById('messagePlaceholder').style.display = 'none';
                document.getElementById('messagePagination').style.display = 'flex';
                
                // 将消息显示区域滚动到顶部
                const messageDisplay = document.querySelector('.message-display');
                if (messageDisplay) {
                    messageDisplay.scrollTop = 0;
                }
            } else {
                document.getElementById('messagePlaceholder').style.display = 'flex';
                document.getElementById('messagesList').style.display = 'none';
                document.getElementById('messagePagination').style.display = 'none';
            }
        } catch (e) {
            console.error('处理留言数据失败:', e);
            document.getElementById('messagePlaceholder').style.display = 'flex';
            document.getElementById('messagePlaceholder').innerHTML = `
                <p>留言数据格式错误</p>
            `;
            document.getElementById('messagesList').style.display = 'none';
            document.getElementById('messagePagination').style.display = 'none';
        }
    } else {
        // 显示错误信息或空白提示
        document.getElementById('messagePlaceholder').style.display = 'flex';
        if (response.code !== 200) {
            document.getElementById('messagePlaceholder').innerHTML = `
                <p>${response.msg || '获取留言失败，请稍后再试'}</p>
            `;
        }
        document.getElementById('messagesList').style.display = 'none';
        document.getElementById('messagePagination').style.display = 'none';
    }
}

// 更新分页信息
function updatePagination() {
    const totalPages = Math.ceil(totalMessages.length / PAGE_SIZE);
    document.getElementById('pageInfo').textContent = `第 ${currentPage} 页 / 共 ${totalPages} 页`;
    
    // 更新按钮状态
    document.getElementById('prevPage').disabled = currentPage <= 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;
}

// 渲染当前页留言
function renderCurrentPage() {
    // 按时间倒序排列
    const sortedMessages = [...totalMessages].sort((a, b) => new Date(b.time) - new Date(a.time));
    
    // 计算当前页的留言
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, sortedMessages.length);
    const currentPageMessages = sortedMessages.slice(startIndex, endIndex);
    
    // 渲染留言
    renderMessages(currentPageMessages);
    
    // 更新分页信息
    updatePagination();
    
    // 滚动到顶部
    const messageDisplay = document.querySelector('.message-display');
    if (messageDisplay) {
        messageDisplay.scrollTop = 0;
    }
}

// 渲染留言列表
function renderMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';
    
    // 创建SVG图标 - 用于装饰
    const activeColor = getComputedStyle(document.documentElement).getPropertyValue('--active-color').trim() || '#2196F3';
    const encodedColor = encodeURIComponent(activeColor);
    
    // 更新board-content的before伪元素背景
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        .board-content::before {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${encodedColor}" opacity="0.2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>') !important;
        }
    `;
    document.head.appendChild(styleTag);
    
    messages.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        
        messageItem.innerHTML = `
            <div class="message-info">
                <div class="message-author">
                    <span class="author-name">${escapeHtml(message.name || '匿名')}</span>
                </div>
                <div class="message-meta">
                    <span class="message-time">${message.time}</span>
                </div>
            </div>
            ${message.title ? `<h3 class="message-title">${escapeHtml(message.title)}</h3>` : ''}
            <div class="message-body">${escapeHtml(message.content).replace(/\n/g, '<br>')}</div>
        `;
        
        messagesList.appendChild(messageItem);
    });
}

// HTML转义函数，防止XSS攻击
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 提交留言
function submitMessage() {
    const userName = document.getElementById('userName').value.trim();
    const postTitle = document.getElementById('postTitle').value.trim();
    const postContent = document.getElementById('postContentTextarea').value.trim();
    
    // 验证必填字段
    if (!userName) {
        showToast('请输入您的名字');
        return;
    }
    
    if (!postContent) {
        showToast('请输入留言内容');
        return;
    }
    
    if (postContent.length > 1000) {
        showToast('留言内容不能超过1000字符');
        return;
    }
    
    // 显示提交中状态
    const submitBtn = document.getElementById('submitMessage');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;
    
    // 先获取现有留言
    // 构建请求参数
    const fetchParams = {
        id: apiId,
        key: apiKey,
        type: 2, // 读取记录
        numid: fixedNumId
    };
    
    // 构建URL
    const fetchUrl = `https://cn.apihz.cn/api/cunchu/textcc.php?id=${fetchParams.id}&key=${fetchParams.key}&type=${fetchParams.type}&numid=${fetchParams.numid}`;
    
    // 获取现有留言数据
    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            // 解析现有留言
            let messages = [];
            if (data.code === 200 && data.words) {
                try {
                    messages = JSON.parse(data.words);
                    if (!Array.isArray(messages)) {
                        messages = [];
                    }
                } catch (e) {
                    console.error('解析现有留言失败:', e);
                    messages = [];
                }
            }
            
            // 添加新留言
            const newMessage = {
                name: userName,
                title: postTitle,
                content: postContent,
                time: new Date().toLocaleString('zh-CN')
            };
            
            messages.push(newMessage);
            
            // 如果留言过多，只保留最新的100条
            if (messages.length > 100) {
                messages = messages.slice(-100);
            }
            
            // 保存留言
            const saveParams = {
                id: apiId,
                key: apiKey,
                type: 1, // 修改记录
                numid: fixedNumId,
                words: encodeURIComponent(JSON.stringify(messages)),
                title: '留言板数据'
            };
            
            // 构建保存URL
            const saveUrl = `https://cn.apihz.cn/api/cunchu/textcc.php?id=${saveParams.id}&key=${saveParams.key}&type=${saveParams.type}&numid=${saveParams.numid}&words=${saveParams.words}&title=${encodeURIComponent(saveParams.title)}`;
            
            // 提交留言
            return fetch(saveUrl);
        })
        .then(response => response.json())
        .then(data => {
            // 恢复按钮状态
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            if (data.code === 200) {
                showToast('留言提交成功');
                
                // 切换到查看标签并刷新留言
                document.querySelector('.board-tab[data-tab="view"]').click();
                fetchMessages();
                
                // 重置表单
                document.getElementById('resetForm').click();
                
                // 滚动到顶部
                setTimeout(() => {
                    const messageDisplay = document.querySelector('.message-display');
                    if (messageDisplay) {
                        messageDisplay.scrollTop = 0;
                    }
                }, 300);
            } else {
                showToast(data.msg || '留言提交失败，请稍后再试');
            }
        })
        .catch(error => {
            console.error('API调用失败:', error);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showToast('留言提交失败，请检查网络连接');
        });
}

// 显示吐司提示
function showToast(message) {
    // 移除现有的吐司
    const existingToasts = document.querySelectorAll('.toast-message');
    existingToasts.forEach(toast => {
        document.body.removeChild(toast);
    });
    
    // 创建新吐司
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 立即设置为可见
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // 3秒后移除吐司
    setTimeout(() => {
        if (document.body.contains(toast)) {
            document.body.removeChild(toast);
        }
    }, 3000);
}

})()