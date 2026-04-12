document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. 滚动揭示动画 ---
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    reveals.forEach(reveal => revealOnScroll.observe(reveal));

    // --- 2. 相册大图预览逻辑 (Lightbox) ---
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('src');
            const alt = item.getAttribute('alt');
            
            lightboxImg.src = src;
            lightboxCaption.textContent = alt;
            lightbox.style.display = 'flex';
            
            // 禁止背景滚动
            document.body.style.overflow = 'hidden';
        });
    });

    // 关闭逻辑
    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    // 点击遮罩背景也可以关闭
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    // --- 3. 拖动相册到底部时的“拉拽跳转”逻辑 ---
    const sceneryGallery = document.querySelector('.scenery-gallery');
    const dragIndicator = document.getElementById('drag-indicator');
    const dragText = dragIndicator.querySelector('.drag-text');
    
    let startX = 0;           // 记录手指按下的初始X坐标
    let currentX = 0;         // 记录手指滑动的当前X坐标
    let isDraggingAtEnd = false; // 标记是否在相册最右侧进行拖动
    const triggerDistance = 120; // 触发跳转所需的拖动距离（像素）

    // 监听手指按下
    sceneryGallery.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        // 计算公式：滚动总宽度 - 已经滚动的距离 <= 容器可视宽度 + 5px(容错值)
        // 这意味着用户已经滑到了最后一张图片
        if (sceneryGallery.scrollWidth - sceneryGallery.scrollLeft <= sceneryGallery.clientWidth + 5) {
            isDraggingAtEnd = true;
            // 移除可能残余的动画过渡，确保手指拖拽时没有延迟跟手感
            dragIndicator.style.transition = 'color 0.3s, background 0.3s';
        } else {
            isDraggingAtEnd = false;
        }
    });

    // 监听手指滑动
    sceneryGallery.addEventListener('touchmove', (e) => {
        if (!isDraggingAtEnd) return;

        currentX = e.touches[0].clientX;
        const deltaX = startX - currentX; // 计算手指往左滑动的距离 (大于0表示向左拽)

        if (deltaX > 0) {
            // 阻止浏览器默认的回弹效果，接管滚动
            if (e.cancelable) e.preventDefault(); 
            
            // 加入 0.5 的阻尼系数，让拖拽有一种拉皮筋的“沉重感”
            const moveX = deltaX * 0.5; 
            
            dragIndicator.style.opacity = '1';
            // 实时改变指示器的位置：从右侧外部(100%)往屏幕中间拉入(-moveX)
            dragIndicator.style.transform = `translate(calc(100% - ${moveX}px), -50%)`;

            // 判断拖动距离是否达到跳转阈值
            if (moveX >= triggerDistance) {
                dragIndicator.classList.add('ready'); // 变色
                dragText.textContent = "松开进入相册";
            } else {
                dragIndicator.classList.remove('ready'); // 恢复原色
                dragText.textContent = "继续拖动查看全部";
            }
        }
    }, { passive: false }); // 必须设置为 false 才能调用 preventDefault

    // 监听手指离开屏幕
    sceneryGallery.addEventListener('touchend', () => {
        if (!isDraggingAtEnd) return;
        
        const deltaX = startX - currentX;
        const moveX = deltaX * 0.5;

        if (moveX >= triggerDistance) {
            // 距离达标：直接跳转到你的完整相册页面
            window.location.href = "gallery.html";
        } else {
            // 距离未达标：指示器弹回原位隐藏
            dragIndicator.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s';
            dragIndicator.style.transform = 'translate(100%, -50%)';
            dragIndicator.style.opacity = '0';
        }
        
        isDraggingAtEnd = false; // 重置状态
    });
});