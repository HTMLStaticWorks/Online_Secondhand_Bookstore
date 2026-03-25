document.addEventListener('DOMContentLoaded', () => {

    /* --- STICKY HEADER --- */
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    /* --- ACTIVE LINK HIGHLIGHTER --- */
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        // Remove active from any hardcoded ones first for consistency
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });


    /* --- INITIAL THEME/RTL STATE --- */
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update all theme buttons to match initial state
    document.querySelectorAll('[id^="theme-toggle"]').forEach(btn => {
        btn.innerHTML = savedTheme === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
    });

    const savedDir = localStorage.getItem('rtl-mode') || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
    document.querySelectorAll('[id^="rtl-toggle"]').forEach(btn => {
        btn.textContent = savedDir === 'rtl' ? 'LTR' : 'RTL';
    });


    /* --- SMOOTH SCROLL --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    /* --- REVEAL ON SCROLL --- */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    /* --- FORM VALIDATION --- */
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault(); // Stop actual submission for demo
                showPopup('Success!', 'Your form has been submitted correctly.', 'success');
            }
            form.classList.add('was-validated');
        }, false);
    });

    /* --- POPUP / TOAST SYSTEM --- */
    function showPopup(title, text, iconType) {
        const toastEl = document.createElement('div');
        toastEl.className = `position-fixed bottom-0 end-0 p-3`;
        toastEl.style.zIndex = '9999';
        toastEl.innerHTML = `
            <div class="toast show animate__animated animate__slideInUp" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-primary text-white">
                    <strong class="me-auto">${title}</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${text}
                </div>
            </div>
        `;
        document.body.appendChild(toastEl);
        setTimeout(() => {
            toastEl.classList.add('animate__slideOutDown');
            setTimeout(() => toastEl.remove(), 500);
        }, 3000);
    }

    // Export for external use
    window.showPopup = showPopup;

    /* --- DASHBOARD SECTION SWITCHER & MOBILE SIDEBAR --- */
    const dashboardSidebar = document.querySelector('.sidebar');
    const sections = document.querySelectorAll('.dashboard-section');
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-target]');
    const overlay = document.querySelector('.sidebar-overlay');
    const mobileToggler = document.getElementById('mobile-sidebar-toggler');

    function switchSection(targetId) {
        if (!sections.length || !sidebarLinks.length) return;

        sections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === targetId) sec.classList.add('active');
        });
        
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === targetId) link.classList.add('active');
        });

        // Close sidebar on mobile after selection
        if (dashboardSidebar && dashboardSidebar.classList.contains('show')) {
            dashboardSidebar.classList.remove('show');
            if (overlay) overlay.classList.remove('show');
        }
    }

    if (sidebarLinks.length) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = link.getAttribute('data-target');
                if (target) {
                    e.preventDefault();
                    switchSection(target);
                }
            });
        });
    }

    // Unified Mobile Sidebar Toggle
    if (mobileToggler && dashboardSidebar) {
        mobileToggler.addEventListener('click', () => {
            dashboardSidebar.classList.add('show');
            if (overlay) overlay.classList.add('show');
        });
    }

    if (overlay && dashboardSidebar) {
        overlay.addEventListener('click', () => {
            dashboardSidebar.classList.remove('show');
            overlay.classList.remove('show');
        });
    }




    /* --- GLOBAL THEME/RTL SYNC --- */
    // Sync all theme toggles if multiple exist
    document.querySelectorAll('[id^="theme-toggle"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const target = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', target);
            localStorage.setItem('theme', target);
            
            // Update all buttons
            document.querySelectorAll('[id^="theme-toggle"]').forEach(b => {
                b.innerHTML = target === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
            });
        });
    });

    // Sync all RTL toggles
    document.querySelectorAll('[id^="rtl-toggle"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const html = document.documentElement;
            const targetDir = html.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
            html.setAttribute('dir', targetDir);
            localStorage.setItem('rtl-mode', targetDir);
            
            document.querySelectorAll('[id^="rtl-toggle"]').forEach(b => {
                b.textContent = targetDir === 'rtl' ? 'LTR' : 'RTL';
            });
        });
    });

});
