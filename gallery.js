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
});