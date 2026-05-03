// scripts.js - تحسينات تفاعلية للصفحة الرئيسية وصفحة lecture1
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('COMP-3315 | Course scripts loaded (Main + Lecture support)');

        // ========== الوظائف العامة للصفحة الرئيسية ==========
        // تفاعل أزرار المحاضرات
        const lectureBtns = document.querySelectorAll('.lecture-btn');
        lectureBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const targetChapter = this.closest('.week-card')?.querySelector('.chapter-title-main')?.innerText || 'Lecture';
                console.log(`Navigating to ${targetChapter} material: ${this.getAttribute('href')}`);
            });
        });

        // تحديث سنة حقوق النشر تلقائياً
        const footerYear = document.querySelector('footer p:last-of-type');
        if (footerYear) {
            const currentYear = new Date().getFullYear();
            if (footerYear.innerText.includes('© 2026')) {
                footerYear.innerText = footerYear.innerText.replace('2026', currentYear);
            }
        }

        // تمرير سلس للروابط الداخلية (لأي صفحة)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // تأثير تركيز على بطاقات الأسبوع
        const weekCards = document.querySelectorAll('.week-card');
        weekCards.forEach(card => {
            card.addEventListener('focusin', () => {
                card.style.borderColor = 'var(--primary)';
            });
            card.addEventListener('focusout', () => {
                card.style.borderColor = 'var(--border-light)';
            });
        });

        // ========== وظائف إضافية خاصة بصفحة lecture1 ==========
        // إذا كانت الصفحة تحتوي على كلاسات lecture-card (أي lecture1)
        if (document.querySelector('.lecture-card')) {
            console.log('Lecture mode detected: adding extra enhancements');
            
            // إضافة تأثير ظهور تدريجي للبطاقات عند التمرير (اختياري)
            const cards = document.querySelectorAll('.lecture-card');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(12px)';
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                observer.observe(card);
            });

            // إضافة أيقونة نسخ لكود الـ traceroute (تحسين تجربة المستخدم)
            const preBlocks = document.querySelectorAll('pre');
            preBlocks.forEach(pre => {
                const copyBtn = document.createElement('button');
                copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                copyBtn.style.position = 'absolute';
                copyBtn.style.right = '20px';
                copyBtn.style.top = '10px';
                copyBtn.style.background = 'var(--primary)';
                copyBtn.style.border = 'none';
                copyBtn.style.borderRadius = '30px';
                copyBtn.style.padding = '4px 12px';
                copyBtn.style.cursor = 'pointer';
                copyBtn.style.fontSize = '0.7rem';
                copyBtn.style.color = 'white';
                copyBtn.style.zIndex = '3';
                copyBtn.title = 'نسخ النص';
                
                const container = document.createElement('div');
                container.style.position = 'relative';
                pre.parentNode.insertBefore(container, pre);
                container.appendChild(pre);
                container.appendChild(copyBtn);
                
                copyBtn.addEventListener('click', () => {
                    const text = pre.innerText;
                    navigator.clipboard.writeText(text).then(() => {
                        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => {
                            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                        }, 1500);
                    });
                });
            });
        }
    });
})();