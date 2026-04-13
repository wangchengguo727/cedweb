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
    // --- 2. 相册大图预览逻辑 (Lightbox) ---
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    
    // 【修改点：加入 if 判断。如果页面没有 lightbox 元素，就不执行内部逻辑，防止报错崩溃】
    if (lightbox) {
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
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
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
        // 【核心修改：加入 Math.ceil 取整，并将容错像素加宽到 10，确保绝大多数手机都能准确触发】
        if (Math.ceil(sceneryGallery.scrollLeft) >= sceneryGallery.scrollWidth - sceneryGallery.clientWidth - 80) {
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
        const deltaX = startX - currentX; 

        if (deltaX > 0) {
            if (e.cancelable) e.preventDefault(); 
            const moveX = deltaX * 0.5; 
            
            dragIndicator.style.opacity = '1';
            dragIndicator.style.transform = `translate(calc(100% - ${moveX}px), -50%)`;

            // 获取末端卡片的文字元素
            const endHintText = document.querySelector('.end-hint-content p');

            if (moveX >= triggerDistance) {
                dragIndicator.classList.add('ready'); 
                dragText.textContent = "松开进入相册";
                if(endHintText) endHintText.textContent = "松开开启"; // 拖动达标时，卡片文字变化
            } else {
                dragIndicator.classList.remove('ready'); 
                dragText.textContent = "继续拖动查看全部";
                if(endHintText) endHintText.textContent = "左滑进入相册"; // 拖动不到位时，恢复原状
            }
        }
    }, { passive: false }); 

    // 2. 监听手指离开屏幕 (更新 touchend：这里才是真正执行退场动画和跳转的地方)
    sceneryGallery.addEventListener('touchend', () => {
        if (!isDraggingAtEnd) return;
        
        const deltaX = startX - currentX;
        const moveX = deltaX * 0.5;

        if (moveX >= triggerDistance) {
            // 【核心修复：恢复华丽退场与真正的跳转逻辑】
            dragIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span class="drag-text">开启相册...</span>';
            
            document.body.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            document.body.style.opacity = '0';
            document.body.style.transform = 'scale(0.95)';
            document.body.style.backgroundColor = '#000'; 
            
            // 延迟 500 毫秒后真正执行跳转
            setTimeout(() => {
                window.location.href = "gallery.html";
            }, 500);
            
        } else {
            // 距离未达标：气泡弹回原位隐藏
            dragIndicator.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s';
            dragIndicator.style.transform = 'translate(100%, -50%)';
            dragIndicator.style.opacity = '0';
            
            // 恢复末端卡片的文字
            const endHintText = document.querySelector('.end-hint-content p');
            if(endHintText) endHintText.textContent = "左滑进入相册";
        }
        
        isDraggingAtEnd = false; // 重置状态
    });
});