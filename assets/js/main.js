// 宝岛红标鸡展示页面交互功能

class ProductShowcase {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;
        this.isTransitioning = false;

        this.init();
    }

    init() {
        this.bindEvents();
        this.generateQRCode();
        this.startAutoSlide();
        this.addLoadingAnimation();
    }

    bindEvents() {
        // 点击导航点
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (!this.isTransitioning) {
                    this.goToSlide(index);
                }
            });
        });

        // 箭头按钮
        this.prevBtn.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.prevSlide();
            }
        });

        this.nextBtn.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (!this.isTransitioning) {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            }
        });

        // 触摸滑动事件
        let startX = 0;
        let endX = 0;
        const slideContainer = document.getElementById('slideContainer');

        slideContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        slideContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const difference = startX - endX;

            if (Math.abs(difference) > 50 && !this.isTransitioning) {
                if (difference > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }, { passive: true });

        // 鼠标悬停时暂停自动滑动
        const showcase = document.querySelector('.product-showcase');
        showcase.addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });

        showcase.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });

        // 页面可见性变化时控制自动滑动
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoSlide();
            } else {
                this.startAutoSlide();
            }
        });
    }

    goToSlide(index) {
        if (index === this.currentSlide || this.isTransitioning) return;

        this.isTransitioning = true;

        // 移除当前活动状态
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        // 设置新的活动状态
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');

        // 重置过渡状态
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);

        // 重启自动滑动
        this.restartAutoSlide();
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }

    startAutoSlide() {
        this.stopAutoSlide(); // 确保没有重复的间隔
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // 每5秒自动切换
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    restartAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }

    generateQRCode() {
        // 生成当前页面的二维码
        const currentUrl = window.location.href;
        const qrContainer = document.getElementById('qrcode');

        if (qrContainer && typeof QRCode !== 'undefined') {
            QRCode.toCanvas(qrContainer, currentUrl, {
                width: 150,
                height: 150,
                colorDark: '#2c3e50',
                colorLight: '#ffffff',
                margin: 2,
                errorCorrectionLevel: 'M'
            }, (error) => {
                if (error) {
                    console.error('二维码生成失败:', error);
                    qrContainer.innerHTML = '<p style="color: #666; font-size: 0.9rem;">二维码生成中...</p>';
                }
            });
        } else {
            // 如果QRCode库未加载，显示备用内容
            setTimeout(() => this.generateQRCode(), 1000);
        }
    }

    addLoadingAnimation() {
        // 为所有元素添加加载动画
        const elements = document.querySelectorAll('.header, .main-content, .footer');
        elements.forEach((element, index) => {
            element.classList.add('loading');
            element.style.animationDelay = `${index * 0.2}s`;
        });
    }

    // 获取当前页面信息用于分享
    getPageInfo() {
        return {
            title: '宝岛红标鸡 - 优质台湾鸡肉',
            description: '台湾原产地直供，无抗生素养殖，天然有机饲料',
            url: window.location.href,
            image: '' // 可以添加产品图片URL
        };
    }
}

// 工具函数
const Utils = {
    // 防抖函数
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 检测移动设备
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // 平滑滚动到元素
    scrollToElement: (element, offset = 0) => {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
};

// 性能优化：图片懒加载（如果有真实图片）
class LazyImageLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.imageObserver = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        this.imageObserver.unobserve(img);
                    }
                });
            });

            this.images.forEach(img => {
                this.imageObserver.observe(img);
            });
        } else {
            // 降级处理：直接加载所有图片
            this.images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化产品展示
    const showcase = new ProductShowcase();

    // 初始化图片懒加载
    const lazyLoader = new LazyImageLoader();

    // 添加页面加载完成的类
    document.body.classList.add('loaded');

    // 性能监控（可选）
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`页面加载时间: ${loadTime}ms`);
        });
    }
});

// 错误处理
window.addEventListener('error', (e) => {
    console.error('页面错误:', e.error);
});

// 导出给全局使用（如果需要）
window.ProductShowcase = ProductShowcase;
window.Utils = Utils;