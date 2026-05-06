(function () {
    'use strict';


    function initIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleNavbarScroll() {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    function navigateToPage(pageId) {
        sections.forEach(sec => sec.classList.remove('active-page'));

        const targetSec = document.getElementById(pageId);
        if (targetSec) {
            targetSec.classList.add('active-page');

            if (pageId === 'inicio') {
                const aboutSec = document.getElementById('about-project');
                if (aboutSec) aboutSec.classList.add('active-page');
            }
        }

        navLinks.forEach((link) => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${pageId}"]`);
        if (activeLink) activeLink.classList.add('active');

        window.scrollTo({ top: 0, behavior: 'smooth' });

        history.pushState(null, null, `#${pageId}`);

        setTimeout(() => {
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }, 100);
    }

    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                if (!link.classList.contains('nav-dropdown-toggle')) {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    navigateToPage(targetId);

                    navToggle.classList.remove('active');
                    navMenu.classList.remove('open');
                }
            });
        });

        const navDropdown = document.getElementById('navDropdown');
        const navDropdownToggle = document.getElementById('navDropdownToggle');

        if (navDropdown && navDropdownToggle) {
            navDropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                navDropdown.classList.toggle('open');
            });

            document.addEventListener('click', (e) => {
                if (!navDropdown.contains(e.target)) {
                    navDropdown.classList.remove('open');
                }
            });
        }
    }

    const backToTop = document.getElementById('backToTop');

    function handleBackToTopVisibility() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px',
        }
    );

    revealElements.forEach((el) => revealObserver.observe(el));


    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 1800;
        const start = performance.now();

        function frame(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);

            element.textContent = value.toLocaleString('es-ES');

            if (progress < 1) {
                requestAnimationFrame(frame);
            } else {
                if (target === 95) element.textContent = value + '%';
                else element.textContent = target.toLocaleString('es-ES');
            }
        }

        requestAnimationFrame(frame);
    }

    const statsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 }
    );

    statNumbers.forEach((num) => statsObserver.observe(num));


    const searchInput = document.getElementById('searchInput');
    const variablesTable = document.getElementById('variablesTable');
    const searchCount = document.getElementById('searchCount');

    if (searchInput && variablesTable) {
        const rows = variablesTable.querySelectorAll('tbody tr');
        const totalRows = rows.length;

        rows.forEach((row) => {
            row.dataset.originalHtml = row.innerHTML;
        });

        function escapeRegExp(str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        function filterTable() {
            const query = searchInput.value.trim().toLowerCase();
            let visibleCount = 0;

            rows.forEach((row) => {
                row.innerHTML = row.dataset.originalHtml;

                const text = row.textContent.toLowerCase();
                const isMatch = query === '' || text.includes(query);

                row.style.display = isMatch ? '' : 'none';

                if (isMatch) {
                    visibleCount++;

                    if (query !== '') {
                        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
                        row.querySelectorAll('td').forEach((cell) => {
                            if (cell.textContent.toLowerCase().includes(query)) {
                                cell.innerHTML = cell.innerHTML.replace(
                                    regex,
                                    '<span class="highlight">$1</span>'
                                );
                            }
                        });
                    }
                }
            });

            if (searchCount) {
                if (query === '') {
                    searchCount.textContent = totalRows + ' resultados';
                } else {
                    searchCount.textContent =
                        visibleCount + ' de ' + totalRows + ' resultados';
                }
            }
        }

        searchInput.addEventListener('input', filterTable);
    }


    window.hideMapLoader = function () {
        const loader = document.getElementById('mapLoader');
        if (loader) {
            setTimeout(() => loader.classList.add('hidden'), 400);
        }
    };


    setTimeout(() => {
        const loader = document.getElementById('mapLoader');
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    }, 4000);


    if (typeof Chart !== 'undefined') {
        Chart.defaults.font.family =
            "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif";
        Chart.defaults.font.size = 12;
        Chart.defaults.color = '#52606D';
        Chart.defaults.borderColor = '#E5E7EB';
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.legend.labels.padding = 16;
        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(11, 60, 93, 0.95)';
        Chart.defaults.plugins.tooltip.titleFont = { weight: '600', size: 13 };
        Chart.defaults.plugins.tooltip.bodyFont = { size: 12 };
        Chart.defaults.plugins.tooltip.padding = 12;
        Chart.defaults.plugins.tooltip.cornerRadius = 8;
        Chart.defaults.plugins.tooltip.boxPadding = 6;
        Chart.defaults.plugins.tooltip.displayColors = true;

        initCharts();
    }

    function initCharts() {
        const colors = {
            petroleum: '#0B3C5D',
            petroleumLight: '#1A5A82',
            gold: '#C9A227',
            sky: '#5B9BD5',
            charcoal: '#1F2933',
            mist: '#9AA5B1',
        };

        const ctxDecadas = document.getElementById('chartDecadas');
        if (ctxDecadas) {
            const ctx = ctxDecadas.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 0, 320);
            gradient.addColorStop(0, colors.petroleum);
            gradient.addColorStop(1, 'rgba(11, 60, 93, 0.4)');

            new Chart(ctxDecadas, {
                type: 'bar',
                data: {
                    labels: [
                        '1900-1925',
                        '1926-1950',
                        '1951-1975',
                        '1976-2000',
                        '2001-2025',
                    ],
                    datasets: [
                        {
                            label: 'Pozos perforados',
                            data: [120, 340, 890, 1450, 980],
                            backgroundColor: gradient,
                            borderColor: colors.petroleum,
                            borderWidth: 0,
                            borderRadius: 8,
                            hoverBackgroundColor: colors.gold,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0,0,0,0.04)' },
                            ticks: { padding: 8 },
                        },
                        x: {
                            grid: { display: false },
                            ticks: { padding: 8 },
                        },
                    },
                    animation: {
                        duration: 1400,
                        easing: 'easeOutQuart',
                    },
                },
            });
        }

        const ctxCuencas = document.getElementById('chartCuencas');
        if (ctxCuencas) {
            new Chart(ctxCuencas, {
                type: 'doughnut',
                data: {
                    labels: [
                        'Cuenca del Golfo',
                        'Cuenca de Burgos',
                        'Cuenca Tampico',
                        'Cuenca Veracruz',
                        'Sureste',
                        'Otras',
                    ],
                    datasets: [
                        {
                            data: [1320, 880, 720, 540, 1100, 220],
                            backgroundColor: [
                                colors.petroleum,
                                colors.sky,
                                colors.gold,
                                colors.petroleumLight,
                                colors.charcoal,
                                colors.mist,
                            ],
                            borderColor: '#ffffff',
                            borderWidth: 3,
                            hoverOffset: 12,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '62%',
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                font: { size: 11 },
                                boxWidth: 8,
                                boxHeight: 8,
                            },
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const total = context.dataset.data.reduce(
                                        (a, b) => a + b,
                                        0
                                    );
                                    const value = context.parsed;
                                    const pct = ((value / total) * 100).toFixed(1);
                                    return `${context.label}: ${value.toLocaleString(
                                        'es-ES'
                                    )} (${pct}%)`;
                                },
                            },
                        },
                    },
                    animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 1400,
                    },
                },
            });
        }

        const ctxTipos = document.getElementById('chartTipos');
        if (ctxTipos) {
            new Chart(ctxTipos, {
                type: 'bar',
                data: {
                    labels: [
                        'Productor de petróleo',
                        'Productor de gas',
                        'Exploratorio',
                        'Inyector',
                        'Mixto',
                        'Abandonado',
                    ],
                    datasets: [
                        {
                            label: 'Cantidad',
                            data: [2850, 1620, 980, 540, 320, 470],
                            backgroundColor: [
                                colors.petroleum,
                                colors.petroleumLight,
                                colors.sky,
                                colors.gold,
                                colors.charcoal,
                                colors.mist,
                            ],
                            borderRadius: 6,
                            borderSkipped: false,
                        },
                    ],
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (context) =>
                                    `${context.parsed.x.toLocaleString('es-ES')} pozos`,
                            },
                        },
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0,0,0,0.04)' },
                            ticks: { padding: 8 },
                        },
                        y: {
                            grid: { display: false },
                            ticks: { padding: 8 },
                        },
                    },
                    animation: {
                        duration: 1400,
                        easing: 'easeOutQuart',
                    },
                },
            });
        }
    }

    let scrollTicking = false;

    function onScroll() {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                handleNavbarScroll();
                handleBackToTopVisibility();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });


    document.addEventListener('DOMContentLoaded', () => {
        initIcons();
        handleNavbarScroll();
        handleBackToTopVisibility();

        const initialHash = window.location.hash.substring(1);
        if (initialHash && document.getElementById(initialHash)) {
            navigateToPage(initialHash);
        } else {
            navigateToPage('inicio');
        }
    });

    window.addEventListener('load', () => {
        initIcons();
    });
})();
(function () {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    function activateTab(target) {
        tabBtns.forEach((b) => b.classList.remove('active'));
        tabPanels.forEach((p) => p.classList.remove('active'));

        const btn = document.querySelector(`.tab-btn[data-tab="${target}"]`);
        if (btn) btn.classList.add('active');

        const panel = document.getElementById('tab-' + target);
        if (panel) panel.classList.add('active');

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    tabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            activateTab(target);
        });
    });

    const dropdownTabLinks = document.querySelectorAll('.nav-dropdown-item[data-tab-target]');
    dropdownTabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            if (typeof navigateToPage === 'function') {
                navigateToPage('mas');
            } else {

                window.location.hash = '#mas';
                document.querySelectorAll('section[id]').forEach(sec => sec.classList.remove('active-page'));
                const targetSec = document.getElementById('mas');
                if (targetSec) targetSec.classList.add('active-page');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            const targetTab = link.getAttribute('data-tab-target');
            activateTab(targetTab);

            const navDropdown = document.getElementById('navDropdown');
            if (navDropdown) navDropdown.classList.remove('open');

            const navToggle = document.getElementById('navToggle');
            const navMenu = document.getElementById('navMenu');
            if (navToggle) navToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('open');
        });
    });
})();
(function () {
    const btn = document.getElementById('mapFullscreenBtn');
    const wrapper = document.querySelector('#mapa-interactivo .map-frame');
    if (btn && wrapper) {
        btn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                wrapper.requestFullscreen?.();
            } else {
                document.exitFullscreen?.();
            }
        });
    }
})();
function cerrarAviso() {
    const overlay = document.getElementById("aviso-overlay");
    overlay.style.display = "none";
}

(function () {
    const mapZoomSlider = document.getElementById('mapZoomSlider');
    const mapPreviewImg = document.getElementById('mapPreviewImg');

    if (mapZoomSlider && mapPreviewImg) {
        let scale = 1;
        let isDragging = false;
        let startX = 0, startY = 0;
        let translateX = 0, translateY = 0;

        function updateTransform() {
            mapPreviewImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }

        mapZoomSlider.addEventListener('input', (e) => {
            scale = e.target.value;
            if (scale <= 1) {
                translateX = 0;
                translateY = 0;
            }
            updateTransform();
        });

        mapPreviewImg.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (scale > 1) {
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                mapPreviewImg.style.transition = 'none';
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        });

        const stopDragging = () => {
            if (isDragging) {
                isDragging = false;
                mapPreviewImg.style.transition = 'transform 0.1s ease-out';
            }
        };

        window.addEventListener('mouseup', stopDragging);
    }
})();