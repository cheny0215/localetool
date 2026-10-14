const simpleLoading = (function () {
    function ensureStyles() {
        if (document.getElementById('simple-loading-styles')) return;

        const style = document.createElement('style');
        style.id = 'simple-loading-styles';
        style.textContent = `
            @keyframes simple-loading-spin {
                to { transform: rotate(360deg); }
            }

            .simple-loading {
                position: absolute;
                inset: 0;
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(245, 245, 245, 0.82);
                transition: opacity 0.1s ease;
            }

            .simple-loading-inner {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
            }

            .simple-loading-spinner {
                width: 36px;
                height: 36px;
                border: 4px solid rgba(0, 0, 0, 0.1);
                border-top-color: var(--active-color, #2196F3);
                border-radius: 50%;
                animation: simple-loading-spin 1s linear infinite;
            }

            .simple-loading-text {
                margin: 0;
                color:var(--active-color);
                font-size: 13px;
                font-weight: 400;
                letter-spacing: 0.5px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }

            .simple-loading.fade-out {
                opacity: 0;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }

    function loaddingAnimation() {
        ensureStyles();

        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'simple-loading';

        const inner = document.createElement('div');
        inner.className = 'simple-loading-inner';

        const spinner = document.createElement('div');
        spinner.className = 'simple-loading-spinner';

        const text = document.createElement('p');
        text.className = 'simple-loading-text';
        text.textContent = '加载中';

        let step = 0;
        const timer = setInterval(() => {
            step += 1;
            step > 2 && (step = 0);
            text.textContent = '加载中' + '.'.repeat(step);
        }, 400);

        inner.appendChild(spinner);
        inner.appendChild(text);
        loadingContainer.appendChild(inner);

        const content = document.getElementById('content');
        if (content) {
            content.appendChild(loadingContainer);
        }

        loadingContainer.setProgress = function () {};

        loadingContainer.cleanup = function () {
            clearInterval(timer);
            loadingContainer.classList.add('fade-out');
        };

        return loadingContainer;
    }

    return {
        loaddingAnimation: loaddingAnimation
    };
})();

window.simpleLoading = simpleLoading;
