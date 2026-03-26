// 等待 HTML 文档加载完毕后执行
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 滚动揭示动画 (Scroll Reveal Animation) ---
    // 选取所有带有 'reveal' 类的元素
    const reveals = document.querySelectorAll('.reveal');

    // 定义一个配置项，决定元素露出多少比例时触发动画
    const revealOptions = {
        threshold: 0.15, // 元素出现 15% 时触发
        rootMargin: "0px 0px -50px 0px" // 底部提前 50px 触发
    };

    // 使用 Intersection Observer API 监听元素是否进入视口
    const revealOnScroll = new IntersectionObserver(function(
        entries,
        revealOnScroll
    ) {
        entries.forEach(entry => {
            // 如果元素进入了视口
            if (!entry.isIntersecting) {
                return;
            } else {
                // 添加 'active' 类以触发 CSS 动画
                entry.target.classList.add('active');
                // 动画触发后停止监听该元素，只播放一次
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // 将所有选中的元素加入监听
    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // --- 确保横向滚动条在页面加载时在最左侧 ---
    const gallery = document.querySelector('.scenery-gallery');
    if(gallery) {
        gallery.scrollLeft = 0;
    }
});