const animationLoading = (function(){
    function loaddingAnimation() {
        // 创建加载动画容器
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'iframe-loading-container';
        loadingContainer.style.position = 'absolute';
        loadingContainer.style.top = '0';
        loadingContainer.style.left = '0';
        loadingContainer.style.width = '100%';
        loadingContainer.style.height = '100%';
        loadingContainer.style.display = 'flex';
        loadingContainer.style.justifyContent = 'center';
        loadingContainer.style.alignItems = 'center';
        loadingContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        loadingContainer.style.zIndex = '999';
        loadingContainer.style.backdropFilter = 'blur(5px)';
        loadingContainer.style.transition = 'all 0.5s ease';

        // 创建卡通风格的加载容器
        const cartoonContainer = document.createElement('div');
        cartoonContainer.className = 'cartoon-loading-container';
        cartoonContainer.style.position = 'relative';
        cartoonContainer.style.width = '200px';
        cartoonContainer.style.height = '200px';
        cartoonContainer.style.display = 'flex';
        cartoonContainer.style.flexDirection = 'column';
        cartoonContainer.style.alignItems = 'center';
        cartoonContainer.style.justifyContent = 'center';

        // 创建卡通云朵背景
        const cloudBackground = document.createElement('div');
        cloudBackground.className = 'cloud-background';
        cloudBackground.style.position = 'absolute';
        cloudBackground.style.width = '180px';
        cloudBackground.style.height = '100px';
        cloudBackground.style.backgroundColor = 'white';
        cloudBackground.style.borderRadius = '50px';
        cloudBackground.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.1)';
        cloudBackground.style.zIndex = '1';
        cloudBackground.style.bottom = '40px';

        // 添加云朵的圆形部分
        const cloudCircle1 = document.createElement('div');
        cloudCircle1.style.position = 'absolute';
        cloudCircle1.style.width = '60px';
        cloudCircle1.style.height = '60px';
        cloudCircle1.style.backgroundColor = 'white';
        cloudCircle1.style.borderRadius = '50%';
        cloudCircle1.style.top = '-20px';
        cloudCircle1.style.left = '25px';

        const cloudCircle2 = document.createElement('div');
        cloudCircle2.style.position = 'absolute';
        cloudCircle2.style.width = '80px';
        cloudCircle2.style.height = '80px';
        cloudCircle2.style.backgroundColor = 'white';
        cloudCircle2.style.borderRadius = '50%';
        cloudCircle2.style.top = '-30px';
        cloudCircle2.style.left = '65px';

        const cloudCircle3 = document.createElement('div');
        cloudCircle3.style.position = 'absolute';
        cloudCircle3.style.width = '50px';
        cloudCircle3.style.height = '50px';
        cloudCircle3.style.backgroundColor = 'white';
        cloudCircle3.style.borderRadius = '50%';
        cloudCircle3.style.top = '-10px';
        cloudCircle3.style.right = '20px';

        // 添加云朵阴影效果
        cloudBackground.style.filter = 'drop-shadow(0px 5px 5px rgba(0, 0, 0, 0.1))';

        // 组装云朵
        cloudBackground.appendChild(cloudCircle1);
        cloudBackground.appendChild(cloudCircle2);
        cloudBackground.appendChild(cloudCircle3);

        // 创建卡通狗狗（替换原来的太阳）
        const dogContainer = document.createElement('div');
        dogContainer.className = 'dog-container';
        dogContainer.style.position = 'relative';
        dogContainer.style.zIndex = '2';

        const dog = document.createElement('div');
        dog.className = 'cartoon-dog';
        dog.style.width = '80px';
        dog.style.height = '80px';
        dog.style.position = 'relative';
        dog.style.animation = 'dog-bounce 2s ease-in-out infinite';

        // 狗狗头部
        const dogHead = document.createElement('div');
        dogHead.className = 'dog-head';
        dogHead.style.width = '70px';
        dogHead.style.height = '60px';
        dogHead.style.backgroundColor = '#F9D59B';
        dogHead.style.borderRadius = '50% 50% 45% 45%';
        dogHead.style.position = 'relative';
        dogHead.style.zIndex = '2';
        dogHead.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';

        // 狗狗耳朵
        const leftEar = document.createElement('div');
        leftEar.className = 'dog-ear left';
        leftEar.style.width = '30px';
        leftEar.style.height = '40px';
        leftEar.style.backgroundColor = '#E8C285';
        leftEar.style.borderRadius = '50% 50% 0 50%';
        leftEar.style.position = 'absolute';
        leftEar.style.top = '-15px';
        leftEar.style.left = '-5px';
        leftEar.style.transform = 'rotate(-30deg)';
        leftEar.style.zIndex = '1';
        leftEar.style.transformOrigin = 'bottom right';
        leftEar.style.animation = 'ear-wiggle 3s ease-in-out infinite alternate';

        const rightEar = document.createElement('div');
        rightEar.className = 'dog-ear right';
        rightEar.style.width = '30px';
        rightEar.style.height = '40px';
        rightEar.style.backgroundColor = '#E8C285';
        rightEar.style.borderRadius = '50% 50% 50% 0';
        rightEar.style.position = 'absolute';
        rightEar.style.top = '-15px';
        rightEar.style.right = '-5px';
        rightEar.style.transform = 'rotate(30deg)';
        rightEar.style.zIndex = '1';
        rightEar.style.transformOrigin = 'bottom left';
        rightEar.style.animation = 'ear-wiggle-right 2.5s ease-in-out 0.2s infinite alternate';

        // 狗狗眼睛
        const leftEye = document.createElement('div');
        leftEye.className = 'dog-eye left';
        leftEye.style.width = '12px';
        leftEye.style.height = '12px';
        leftEye.style.backgroundColor = '#333';
        leftEye.style.borderRadius = '50%';
        leftEye.style.position = 'absolute';
        leftEye.style.top = '25px';
        leftEye.style.left = '15px';
        leftEye.style.animation = 'blink 3s ease-in-out infinite';

        // 添加眼睛高光
        const leftEyeHighlight = document.createElement('div');
        leftEyeHighlight.className = 'eye-highlight';
        leftEyeHighlight.style.width = '4px';
        leftEyeHighlight.style.height = '4px';
        leftEyeHighlight.style.backgroundColor = 'white';
        leftEyeHighlight.style.borderRadius = '50%';
        leftEyeHighlight.style.position = 'absolute';
        leftEyeHighlight.style.top = '2px';
        leftEyeHighlight.style.left = '2px';
        leftEye.appendChild(leftEyeHighlight);

        const rightEye = document.createElement('div');
        rightEye.className = 'dog-eye right';
        rightEye.style.width = '12px';
        rightEye.style.height = '12px';
        rightEye.style.backgroundColor = '#333';
        rightEye.style.borderRadius = '50%';
        rightEye.style.position = 'absolute';
        rightEye.style.top = '25px';
        rightEye.style.right = '15px';
        rightEye.style.animation = 'blink 3s ease-in-out infinite';

        // 添加眼睛高光
        const rightEyeHighlight = document.createElement('div');
        rightEyeHighlight.className = 'eye-highlight';
        rightEyeHighlight.style.width = '4px';
        rightEyeHighlight.style.height = '4px';
        rightEyeHighlight.style.backgroundColor = 'white';
        rightEyeHighlight.style.borderRadius = '50%';
        rightEyeHighlight.style.position = 'absolute';
        rightEyeHighlight.style.top = '2px';
        rightEyeHighlight.style.left = '2px';
        rightEye.appendChild(rightEyeHighlight);

        // 狗狗鼻子
        const nose = document.createElement('div');
        nose.className = 'dog-nose';
        nose.style.width = '16px';
        nose.style.height = '12px';
        nose.style.backgroundColor = '#333';
        nose.style.borderRadius = '50%';
        nose.style.position = 'absolute';
        nose.style.top = '35px';
        nose.style.left = '50%';
        nose.style.transform = 'translateX(-50%)';

        // 狗狗嘴巴
        const mouth = document.createElement('div');
        mouth.className = 'dog-mouth';
        mouth.style.width = '20px';
        mouth.style.height = '10px';
        mouth.style.borderBottom = '3px solid #333';
        mouth.style.borderRadius = '0 0 10px 10px';
        mouth.style.position = 'absolute';
        mouth.style.bottom = '12px';
        mouth.style.left = '50%';
        mouth.style.transform = 'translateX(-50%)';

        // 舌头
        const tongue = document.createElement('div');
        tongue.className = 'dog-tongue';
        tongue.style.width = '14px';
        tongue.style.height = '8px';
        tongue.style.backgroundColor = '#FF9999';
        tongue.style.borderRadius = '0 0 7px 7px';
        tongue.style.position = 'absolute';
        tongue.style.bottom = '-3px';
        tongue.style.left = '50%';
        tongue.style.transform = 'translateX(-50%)';
        tongue.style.animation = 'tongue-wag 0.8s ease-in-out infinite alternate';
        mouth.appendChild(tongue);

        // 狗狗腮红
        const leftBlush = document.createElement('div');
        leftBlush.className = 'dog-blush left';
        leftBlush.style.width = '12px';
        leftBlush.style.height = '8px';
        leftBlush.style.backgroundColor = 'rgba(255,105,97,0.4)';
        leftBlush.style.borderRadius = '50%';
        leftBlush.style.position = 'absolute';
        leftBlush.style.top = '35px';
        leftBlush.style.left = '6px';

        const rightBlush = document.createElement('div');
        rightBlush.className = 'dog-blush right';
        rightBlush.style.width = '12px';
        rightBlush.style.height = '8px';
        rightBlush.style.backgroundColor = 'rgba(255,105,97,0.4)';
        rightBlush.style.borderRadius = '50%';
        rightBlush.style.position = 'absolute';
        rightBlush.style.top = '35px';
        rightBlush.style.right = '6px';

        // 组装狗狗头部
        dogHead.appendChild(leftEar);
        dogHead.appendChild(rightEar);
        dogHead.appendChild(leftEye);
        dogHead.appendChild(rightEye);
        dogHead.appendChild(nose);
        dogHead.appendChild(mouth);
        dogHead.appendChild(leftBlush);
        dogHead.appendChild(rightBlush);
        dog.appendChild(dogHead);
        dogContainer.appendChild(dog);

        // 添加动画样式
        if (!document.getElementById('cartoon-loading-styles')) {
            const style = document.createElement('style');
            style.id = 'cartoon-loading-styles';
            style.textContent = `
                @keyframes dog-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                
                @keyframes ear-wiggle {
                    0% { transform: rotate(-30deg); }
                    100% { transform: rotate(-20deg); }
                }
                
                @keyframes ear-wiggle-right {
                    0% { transform: rotate(30deg); }
                    100% { transform: rotate(20deg); }
                }
                
                @keyframes blink {
                    0%, 48%, 52%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(0.1); }
                }
                
                @keyframes tongue-wag {
                    0% { height: 8px; }
                    100% { height: 12px; }
                }
                
                @keyframes fly-bird {
                    0% { transform: translateX(-50px) translateY(0); }
                    25% { transform: translateX(100px) translateY(-20px); }
                    50% { transform: translateX(250px) translateY(0); }
                    75% { transform: translateX(100px) translateY(20px); }
                    100% { transform: translateX(-50px) translateY(0); }
                }
                
                @keyframes flap-wing {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(30deg); }
                }
                
                .iframe-loading-container.fade-out {
                    opacity: 0;
                }
            `;
            document.head.appendChild(style);
        }

        // 创建加载文本
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.textContent = '正在加载...';
        loadingText.style.marginTop = '20px';
        loadingText.style.color = '#333';
        loadingText.style.fontFamily = 'Arial, sans-serif';
        loadingText.style.fontSize = '16px';
        loadingText.style.fontWeight = 'bold';
        loadingText.style.position = 'relative';
        loadingText.style.zIndex = '3';

        // 创建进度条
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.style.width = '150px';
        progressContainer.style.height = '8px';
        progressContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        progressContainer.style.borderRadius = '4px';
        progressContainer.style.marginTop = '15px';
        progressContainer.style.overflow = 'hidden';
        progressContainer.style.position = 'relative';
        progressContainer.style.zIndex = '3';
        progressContainer.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.height = '100%';
        progressBar.style.width = '0%';
        progressBar.style.backgroundColor = '#E8C285';
        progressBar.style.borderRadius = '4px';
        progressBar.style.transition = 'width 0.3s ease';

        progressContainer.appendChild(progressBar);

        // 创建小鸟动画
        const bird = document.createElement('div');
        bird.className = 'cartoon-bird';
        bird.style.position = 'absolute';
        bird.style.zIndex = '4';
        bird.style.width = '30px';
        bird.style.height = '20px';
        bird.style.top = '30px';
        bird.style.left = '-50px';
        bird.style.animation = 'fly-bird 15s linear infinite';

        // 鸟身体
        const birdBody = document.createElement('div');
        birdBody.style.position = 'absolute';
        birdBody.style.width = '20px';
        birdBody.style.height = '15px';
        birdBody.style.backgroundColor = '#4FC3F7';
        birdBody.style.borderRadius = '50% 50% 50% 50%';

        // 鸟翅膀
        const birdWing = document.createElement('div');
        birdWing.style.position = 'absolute';
        birdWing.style.width = '15px';
        birdWing.style.height = '10px';
        birdWing.style.backgroundColor = '#29B6F6';
        birdWing.style.borderRadius = '50% 50% 0 50%';
        birdWing.style.top = '-5px';
        birdWing.style.left = '5px';
        birdWing.style.transformOrigin = 'bottom left';
        birdWing.style.animation = 'flap-wing 0.5s ease-in-out infinite alternate';

        // 鸟头
        const birdHead = document.createElement('div');
        birdHead.style.position = 'absolute';
        birdHead.style.width = '12px';
        birdHead.style.height = '12px';
        birdHead.style.backgroundColor = '#4FC3F7';
        birdHead.style.borderRadius = '50%';
        birdHead.style.left = '18px';
        birdHead.style.top = '-2px';

        // 鸟嘴
        const birdBeak = document.createElement('div');
        birdBeak.style.position = 'absolute';
        birdBeak.style.width = '8px';
        birdBeak.style.height = '5px';
        birdBeak.style.backgroundColor = '#FF9800';
        birdBeak.style.borderRadius = '50% 50% 50% 50%';
        birdBeak.style.left = '28px';
        birdBeak.style.top = '2px';

        // 组装小鸟
        bird.appendChild(birdBody);
        bird.appendChild(birdWing);
        bird.appendChild(birdHead);
        bird.appendChild(birdBeak);

        // 组装所有元素
        cartoonContainer.appendChild(cloudBackground);
        cartoonContainer.appendChild(dogContainer);
        cartoonContainer.appendChild(loadingText);
        cartoonContainer.appendChild(progressContainer);
        cartoonContainer.appendChild(bird);

        loadingContainer.appendChild(cartoonContainer);
        document.getElementById('content').appendChild(loadingContainer);

        // 模拟进度更新
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;
            progressBar.style.width = `${progress}%`;

            if (progress === 100) {
                clearInterval(progressInterval);
            }
        }, 300);

        // 确保在加载完成时进度条达到100%
        loadingContainer.setProgress = (value) => {
            if (value === 100) {
                clearInterval(progressInterval);
                progressBar.style.width = '100%';
            }
        };

        // 清理函数
        loadingContainer.cleanup = () => {
            clearInterval(progressInterval);
            progressBar.style.width = '100%';
        };

        return loadingContainer;
    }
    return {
        loaddingAnimation: loaddingAnimation
    }
})();

// 1. 作为全局变量
window.animationLoading = animationLoading;
