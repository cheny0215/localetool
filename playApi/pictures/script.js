// 全局变量
let currentPage = 1;
let currentQuery = ''; // 默认搜索
let images = [];
let isLoading = false;
let hasMoreImages = true;
let currentImageIndex = 0;

// DOM 元素
const imageGrid = document.getElementById('image-grid');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsCount = document.getElementById('results-count');
const loadingElement = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxDownload = document.getElementById('lightbox-download');
const gridViewBtn = document.getElementById('grid-view');
const largeViewBtn = document.getElementById('large-view');
const listViewBtn = document.getElementById('list-view');

// 初始化搜索输入框
searchInput.value = currentQuery;

// 监听事件
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
window.addEventListener('scroll', handleScroll);
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrevImage);
lightboxNext.addEventListener('click', showNextImage);
lightboxDownload.addEventListener('click', () => downloadImage(images[currentImageIndex]));
gridViewBtn.addEventListener('click', () => changeView('grid'));
largeViewBtn.addEventListener('click', () => changeView('large'));
listViewBtn.addEventListener('click', () => changeView('list'));

// 给灯箱背景添加点击关闭事件
lightbox.addEventListener('click', (e) => {
    // 只有当点击的是灯箱背景时才关闭，避免点击内容区域时关闭
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// 首次加载图片
loadImages();

// 搜索处理函数
function handleSearch() {
    console.log('search');

    const query = searchInput.value.trim();
    if (query && query !== currentQuery) {
        currentQuery = query;
        currentPage = 1;
        images = [];
        imageGrid.innerHTML = '';
        hasMoreImages = true;
        loadImages();
    }
}

// 加载图片
async function loadImages() {
    if (isLoading || !hasMoreImages) return;

    isLoading = true;
    showLoading(true);

    try {
        // 请确保替换为您自己的有效 ID 和 KEY
        const apiKey = '0e8b0763210c6f7f19b175a6c177ca4f'; // 示例 Key，请替换
        const apiId = '10004465'; // 示例 ID，请替换

        const url = `https://cn.apihz.cn/api/img/apihzimgsougou.php?id=${apiId}&key=${apiKey}&page=${currentPage}&words=${encodeURIComponent(currentQuery)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 200 && data.res && data.res.length > 0) {
            const newImages = data.res;
            images = [...images, ...newImages];

            // 渲染新图片
            renderImages(newImages);

            // 更新结果计数
            resultsCount.textContent = images.length;

            // 隐藏空状态
            emptyState.style.display = 'none';

            // 更新页码
            currentPage++;
        } else {
            hasMoreImages = false;

            // 如果是第一页且没有结果，显示空状态
            if (currentPage === 1 && images.length === 0) {
                emptyState.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('加载图片失败:', error);
    } finally {
        isLoading = false;
        showLoading(false);
    }
}

// 渲染图片
function renderImages(imageUrls) {
    imageUrls.forEach((imageUrl, index) => {
        const card = document.createElement('div');
        card.className = 'image-card';

        const globalIndex = images.indexOf(imageUrl);

        card.innerHTML = `
            <div class="image-wrapper">
                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="${imageUrl}" alt="图片" loading="lazy">
            </div>
            <div class="image-actions">
                <button title="下载" onclick="downloadImage('${imageUrl}')">
                    <i class="fas fa-download"></i>
                </button>
                <button title="分享">
                    <i class="fas fa-share-alt"></i>
                </button>
                <button title="收藏">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        `;

        // 添加点击事件打开灯箱
        card.querySelector('.image-wrapper').addEventListener('click', () => {
            openLightbox(globalIndex);
        });

        imageGrid.appendChild(card);

        // 使用 Intersection Observer 实现懒加载
        observeImage(card.querySelector('img'));
    });
}

// 懒加载图片
function observeImage(img) {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                image.src = image.dataset.src;
                image.onload = () => {
                    image.removeAttribute('data-src');
                };
                observer.unobserve(image);
            }
        });
    }, {
        rootMargin: '0px 0px 200px 0px' // 提前 200px 加载
    });

    observer.observe(img);
}

// 处理滚动加载更多
function handleScroll() {
    if (isLoading || !hasMoreImages) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 当滚动到底部 200px 范围内时加载更多
    if (scrollY + windowHeight >= documentHeight - 200) {
        loadImages();
    }
}

// 显示/隐藏加载状态
function showLoading(show) {
    loadingElement.style.display = show ? 'block' : 'none';
}

// 打开灯箱
function openLightbox(index) {
    if (index < 0 || index >= images.length) return;

    currentImageIndex = index;
    lightboxImg.src = images[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // 添加返回确认
    window.history.pushState({ isLightbox: true }, '');
    
    // 监听浏览器返回按钮
    window.addEventListener('popstate', handlePopState);
}

// 处理浏览器返回按钮
function handlePopState(event) {
    if (lightbox.classList.contains('active')) {
        closeLightbox();
        // 移除popstate监听器，防止多次触发
        window.removeEventListener('popstate', handlePopState);
    }
}

// 关闭灯箱
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    
    // 如果当前状态是灯箱打开状态，则返回前一个状态
    if (window.history.state && window.history.state.isLightbox) {
        window.history.back();
    }
    
    // 显示返回成功提示
    showReturnNotification();
}

// 显示返回成功提示
function showReturnNotification() {
    // 创建提示元素
    const notification = document.createElement('div');
    notification.innerHTML = `
        <i class="fas fa-reply"></i>
        <span>已返回图片列表</span>
    `;
    
    // 样式
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = 'var(--accent-color)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '30px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.fontSize = '14px';
    notification.style.zIndex = '9999';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';
    
    notification.querySelector('i').style.marginRight = '8px';
    
    // 添加到文档
    document.body.appendChild(notification);
    
    // 显示提示
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.bottom = '30px';
    }, 100);
    
    // 2秒后隐藏提示
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.bottom = '20px';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// 显示上一张图片
function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentImageIndex];
}

// 显示下一张图片
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    lightboxImg.src = images[currentImageIndex];
}

// 下载图片
function downloadImage(url) {
    // 创建临时链接
    const link = document.createElement('a');
    link.href = url;
    
    // 从URL中提取文件名，或使用时间戳创建文件名
    const fileName = url.split('/').pop() || `image_${Date.now()}.jpg`;
    link.setAttribute('download', fileName);
    
    // 添加到DOM以允许点击，然后移除
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 添加反馈动画
    addDownloadFeedback();
}

// 添加下载反馈
function addDownloadFeedback() {
    // 创建一个通知元素
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>图片已开始下载</span>
    `;
    
    // 添加样式
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = 'var(--success-color)';
    notification.style.color = 'white';
    notification.style.padding = '12px 25px';
    notification.style.borderRadius = '30px';
    notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.fontSize = '16px';
    notification.style.zIndex = '9999';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';
    
    notification.querySelector('i').style.marginRight = '10px';
    notification.querySelector('i').style.fontSize = '20px';
    
    // 添加到文档
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.bottom = '30px';
    }, 100);
    
    // 3秒后隐藏通知
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.bottom = '20px';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 改变视图模式
function changeView(viewType) {
    // 移除所有活动类
    gridViewBtn.classList.remove('active');
    largeViewBtn.classList.remove('active');
    listViewBtn.classList.remove('active');

    // 移除所有视图类
    imageGrid.classList.remove('grid-view', 'large-view', 'list-view');

    // 添加新的视图类和活动按钮
    switch (viewType) {
        case 'grid':
            gridViewBtn.classList.add('active');
            imageGrid.classList.add('grid-view');
            break;
        case 'large':
            largeViewBtn.classList.add('active');
            imageGrid.classList.add('large-view');
            break;
        case 'list':
            listViewBtn.classList.add('active');
            imageGrid.classList.add('list-view');
            break;
    }
}

// 键盘导航
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            showPrevImage();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
        case 'd':
            downloadImage(images[currentImageIndex]);
            break;
    }
}); 