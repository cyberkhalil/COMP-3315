// scripts.js - تحسينات تفاعلية للصفحة الرئيسية وصفحة lecture1
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('COMP-3315 | Course scripts loaded (Main + Lecture support)');

        // ========== تحديث السنة في جميع التواقيع ==========
        const currentYear = new Date().getFullYear();
        const yearSpans = document.querySelectorAll('#current-year, #lecture-year, .copyright-year span');
        yearSpans.forEach(span => {
            if (span.tagName === 'SPAN') {
                span.textContent = currentYear;
            } else if (span.classList?.contains('copyright-year')) {
                // إذا كان العنصر هو الفقرة نفسها
                span.innerHTML = span.innerHTML.replace(/\d{4}/, currentYear);
            }
        });
        // معالجة حالة footer العادي بدون id
        const footerCopyright = document.querySelector('footer p:last-of-type');
        if (footerCopyright && footerCopyright.innerText.includes('©')) {
            footerCopyright.innerHTML = footerCopyright.innerHTML.replace(/\d{4}/, currentYear);
        }

        // ========== الوظائف العامة للصفحة الرئيسية ==========
        const lectureBtns = document.querySelectorAll('.lecture-btn');
        lectureBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const targetChapter = this.closest('.week-card')?.querySelector('.chapter-title-main')?.innerText || 'Lecture';
                console.log(`Navigating to ${targetChapter} material: ${this.getAttribute('href')}`);
            });
        });

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

        // ========== وظائف إضافية خاصة بصفحات المحاضرات (lecture) ==========
        // إضافة زر نسخ لكل عنصر pre مع تجنب إضافة أزرار متكررة
        const preBlocks = document.querySelectorAll('pre:not(.no-copy)');
        preBlocks.forEach(pre => {
            // تجنب إضافة الزر إذا كان موجوداً بالفعل
            if (pre.parentElement?.querySelector('.copy-pre-btn')) return;
            
            const copyBtn = document.createElement('button');
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.className = 'copy-pre-btn';
            copyBtn.style.position = 'absolute';
            copyBtn.style.right = '12px';
            copyBtn.style.top = '12px';
            copyBtn.style.background = 'var(--primary)';
            copyBtn.style.border = 'none';
            copyBtn.style.borderRadius = '30px';
            copyBtn.style.padding = '4px 12px';
            copyBtn.style.cursor = 'pointer';
            copyBtn.style.fontSize = '0.7rem';
            copyBtn.style.color = 'white';
            copyBtn.style.zIndex = '3';
            copyBtn.style.transition = '0.2s';
            copyBtn.title = 'Copy to clipboard';
            
            // جعل الـ pre له موضع نسبي
            const container = document.createElement('div');
            container.style.position = 'relative';
            container.style.margin = '1rem 0';
            pre.parentNode.insertBefore(container, pre);
            container.appendChild(pre);
            container.appendChild(copyBtn);
            
            copyBtn.addEventListener('click', async () => {
                const text = pre.innerText;
                try {
                    await navigator.clipboard.writeText(text);
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 1500);
                } catch (err) {
                    console.error('Failed to copy: ', err);
                    copyBtn.innerHTML = '<i class="fas fa-times"></i>';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 1500);
                }
            });
        });

        // تأثير ظهور تدريجي للبطاقات إذا كانت موجودة (للمحاضرات المستقبلية)
        const cards = document.querySelectorAll('.lecture-card');
        if (cards.length) {
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
        }
    });
})();