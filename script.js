document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. 头部滚动效果 (Header Scroll Effect) ---
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 2. 简易轮播图 (Simple Carousel) ---
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let currentIndex = 0;
    let carouselInterval;
    const autoPlaySpeed = 5000; // 自动播放速度（毫秒）

    // 显示特定索引的图片
    function showItem(index) {
        // 先隐藏所有图片
        carouselItems.forEach(item => item.classList.remove('active'));
        // 显示当前图片
        carouselItems[index].classList.add('active');
    }

    // 下一张
    function nextSlide() {
        currentIndex++;
        if (currentIndex >= carouselItems.length) {
            currentIndex = 0;
        }
        showItem(currentIndex);
    }

    // 上一张
    function prevSlide() {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = carouselItems.length - 1;
        }
        showItem(currentIndex);
    }

    // 绑定按钮事件
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval(); // 手动点击后重置自动播放计时器
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    // 启动自动播放
    function startInterval() {
        carouselInterval = setInterval(nextSlide, autoPlaySpeed);
    }

    // 重置自动播放
    function resetInterval() {
        clearInterval(carouselInterval);
        startInterval();
    }

    // 页面加载后开始
    startInterval();

    // --- 3. 移动端菜单切换 (Mobile Menu Toggle) ---
    // 这个功能在CSS中预留了样式，JS在此实现切换逻辑
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('is-active'); // 用于动画（可选）
    });

    // 点击导航链接后自动关闭菜单（在移动端）
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

});