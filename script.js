document.addEventListener('DOMContentLoaded', () => {
    // 1. Photo Carousel Logic
    const photoFiles = [
        'colegio_integral_soacha_baile.jpg',
        'colegio_integral_soacha_ejercicio_teatro.jpg',
        'colegio_integral_soacha_excelencia.jpg',
        'colegio_integral_soacha_grados_capilla.jpeg',
        'colegio_integral_soacha_jardin.jpeg',
        'colegio_integral_soacha_letrero.jpeg',
        'colegio_integral_soacha_llanerito.jpg',
        'colegio_integral_soacha_ninas_biblioteca.jpg',
        'colegio_integral_soacha_oratorio_capilla.jpeg',
        'colegio_integral_soacha_primeras_comuniones.jpg',
        'colegio_integral_soacha_recreo.jpg',
        'colegio_integral_soacha_retablo.jpeg',
        'colegio_integral_soacha_virgen_maria_jardin.jpeg'
    ];

    const track = document.querySelector('.carousel-track');
    const nextButton = document.querySelector('.btn-next');
    const prevButton = document.querySelector('.btn-prev');
    const dotsNav = document.querySelector('.carousel-nav');

    // Populate carousel
    photoFiles.forEach((file, index) => {
        const slide = document.createElement('li');
        slide.classList.add('carousel-slide');
        slide.innerHTML = `<img src="images/carousel/${file}" alt="School Photo ${index + 1}">`;
        track.appendChild(slide);

        const dot = document.createElement('button');
        dot.classList.add('carousel-indicator');
        if (index === 0) dot.classList.add('active');
        dotsNav.appendChild(dot);
    });

    const slides = Array.from(track.children);
    const dots = Array.from(dotsNav.children);
    let currentIndex = 0;

    const updateCarousel = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentIndex = index;
    };

    nextButton.addEventListener('click', () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        updateCarousel(nextIndex);
        resetAutoPlay();
    });

    prevButton.addEventListener('click', () => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel(prevIndex);
        resetAutoPlay();
    });

    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;
        const targetIndex = dots.indexOf(targetDot);
        updateCarousel(targetIndex);
    });

    // Auto-play
    let autoPlayInterval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % slides.length;
        updateCarousel(nextIndex);
    }, 5000);

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % slides.length;
            updateCarousel(nextIndex);
        }, 5000);
    }

    // 2. Donation Data and Progress Bars
    const objectives = [
        { name: 'Formar corazones', cost: 8000000, description: 'Dotación completa de los libros "Aprender a Amar" para todas las estudiantes.', impact: 'Cada $30.000 cubren el material de una niña.', image: 'images/project1.jpg' },
        { name: 'Nuevo confesionario', cost: 6000000, description: 'Construcción de un nuevo confesionario para el oratorio.', image: 'images/proyect2.jpg' },
        { name: 'Nuevo ambón', cost: 2000000, description: 'Adquisición de un nuevo ambón para el oratorio.', image: 'images/project3.png' },
        { name: 'El Sueño de San José', cost: 4000000, description: 'Una urna especial para nuestra hermosa imagen de San José Dormido.', image: 'images/project4.png' }
    ];

    const levels = [
        { name: 'Legendary Hero', min: 1000000, icon: 'images/levels/level4.png' },
        { name: 'VIP Status', min: 500000, icon: 'images/levels/level3.png' },
        { name: 'Front Row Seat', min: 100000, icon: 'images/levels/level2.png' },
        { name: 'Club Member', min: 0, icon: 'images/levels/level1.png' }
    ];

    fetch('donors.json')
        .then(response => response.json())
        .then(donors => {
            updateTotalDonated(donors);
            renderObjectives(donors);
            renderDonors(donors);
            setupScrollAnimations();
        });

    function updateTotalDonated(donors) {
        const total = donors.reduce((sum, d) => sum + d.amount, 0);
        const totalElement = document.getElementById('total-amount');
        const statsElement = document.getElementById('donation-stats');

        if (totalElement) {
            animateNumber(totalElement, total);
        }

        if (statsElement) {
            statsElement.innerHTML = `
                <span class="stat-item"><strong>${donors.length}</strong> Donantes</span>
                <span class="stat-divider">|</span>
                <span class="stat-item">Promedio: <strong>$${Math.round(total / donors.length).toLocaleString()}</strong></span>
            `;
        }
    }

    function animateNumber(element, finalValue) {
        let startValue = 0;
        const duration = 2500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Refined easeOutExpo for a smoother finish
            const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentValue = Math.floor(easedProgress * finalValue);

            element.textContent = `$${currentValue.toLocaleString()} COP`;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    function renderObjectives(donors) {
        let totalDonated = donors.reduce((sum, d) => sum + d.amount, 0);
        const container = document.getElementById('objectives-list');

        let remainingDonated = totalDonated;

        objectives.forEach(obj => {
            let objDonated = Math.min(remainingDonated, obj.cost);
            let percentage = (objDonated / obj.cost) * 100;
            remainingDonated = Math.max(0, remainingDonated - obj.cost);

            const isCompleted = percentage >= 100;

            const div = document.createElement('div');
            div.classList.add('objective-item');
            if (isCompleted) div.classList.add('completed');

            div.innerHTML = `
                <div class="objective-image">
                    <img src="${obj.image}" alt="${obj.name}">
                </div>
                <div class="objective-content">
                    <div class="objective-header">
                        <span class="objective-title">${obj.name} ${isCompleted ? '<span class="completed-badge">✓ Meta Cumplida</span>' : ''}</span>
                        <span class="objective-cost">$${obj.cost.toLocaleString()} COP</span>
                    </div>
                    <p>${obj.description}</p>
                    ${obj.impact ? `<p class="impact-text"><strong>Impacto:</strong> ${obj.impact}</p>` : ''}
                    <div class="progress-container">
                        <div class="progress-bar ${isCompleted ? 'gold-glow' : ''}" data-width="${percentage}%"></div>
                    </div>
                    <p class="progress-text">Consignado: $${objDonated.toLocaleString()} COP (${percentage.toFixed(1)}%)</p>
                </div>
            `;
            container.appendChild(div);
        });

        // Setup observer for progress bars
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target.querySelector('.progress-bar');
                    if (bar) {
                        bar.style.width = bar.getAttribute('data-width');
                    }
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        container.querySelectorAll('.objective-item').forEach(item => {
            progressObserver.observe(item);
        });
    }

    function renderDonors(donors) {
        const grid = document.getElementById('donors-grid');
        donors.sort((a, b) => b.amount - a.amount);

        donors.forEach(d => {
            const level = levels.find(l => d.amount >= l.min);
            const card = document.createElement('div');
            card.classList.add('donor-card');

            card.innerHTML = `
                <img src="${level.icon}" alt="${level.name}" class="donor-badge">
                <p class="donor-name">${d.donor}</p>
                <p class="donor-level">${level.name}</p>
            `;
            grid.appendChild(card);
        });
    }

    function setupScrollAnimations() {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // revealObserver.unobserve(entry.target); // Keep observing if we want it to hide/show again, but usually reveal only once
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => {
            revealObserver.observe(el);
        });
    }
});
