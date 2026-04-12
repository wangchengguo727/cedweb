document.addEventListener("DOMContentLoaded", () => {
    // 获取所需元素
    const photoItems = document.querySelectorAll('.photo-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    // 1. 点击图片放大展示
    photoItems.forEach(img => {
        img.addEventListener('click', () => {
            // 获取当前点击图片的路径
            const src = img.getAttribute('src');
            // 将路径赋给大图预览器
            lightboxImg.src = src;
            // 显示预览层
            lightbox.style.display = 'flex';
            // 禁止背景层的滑动
            document.body.style.overflow = 'hidden';
        });
    });

    // 2. 关闭预览层的通用函数
    const closeLightbox = () => {
        lightbox.style.display = 'none';
        lightboxImg.src = ''; // 清空图片路径
        document.body.style.overflow = 'auto'; // 恢复背景滑动
    };

    // 3. 点击右上角关闭按钮
    closeBtn.addEventListener('click', closeLightbox);

    // 4. 点击图片周围的黑色遮罩层也可关闭
    lightbox.addEventListener('click', (e) => {
        // 确保点击的是遮罩层背景，而不是图片本身
        if (e.target === lightbox || e.target.classList.contains('lightbox-wrapper')) {
            closeLightbox();
        }
    });
    // --- 5. 瀑布流图片“视差浮现”动画逻辑 ---
    const photoCards = document.querySelectorAll('.photo-item');
    
    // 配置观察器：图片露出 10% 即可触发动画
    const photoObserverOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px"
    };

    const photoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 进入屏幕视口，添加 show 类触发 CSS 动画
                entry.target.classList.add('show');
                // 动画执行一次后取消监听，节省手机性能
                observer.unobserve(entry.target);
            }
        });
    }, photoObserverOptions);

    // 【核心细节】：由于我们前面做了一个“拉开幕布”的入场动画（耗时约1.2秒）
    // 为了防止图片在幕布还没拉开前就偷偷播放完动画了，我们需要延迟开始监听！
    setTimeout(() => {
        photoCards.forEach((card, index) => {
            // 给首屏出现的几张图片加上非常微小的阶梯延迟，产生“错落有致”的波浪感
            if (index < 8) {
                card.style.transitionDelay = `${index * 0.05}s`;
            }
            // 开始监听
            photoObserver.observe(card);
        });
    }, 1200); // 延迟 1.2 秒（等待蓝色幕布拉开）
});