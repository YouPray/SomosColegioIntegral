document.addEventListener('DOMContentLoaded', () => {
    // 1. Photo Carousel Logic
    const photoFiles = [
        '539562148_122151059798755527_4517419949007981657_n.jpg',
        '548759526_18420569848128603_914077316555818580_n.jpg',
        '549205954_18420569740128603_4149615417702794010_n.jpg',
        '585113940_122166428870755527_6523186199500761605_n.jpg',
        'EDp3zNzXUAUZLKr (1).jpg',
        'Fiesta.jpg',
        'IMG_20230201_084800-scaled.jpg',
        'IMG_20230201_091900-scaled.jpg',
        'IMG_5907-1.jpg',
        'WhatsApp Image 2026-01-21 at 2.40.22 PM.jpeg',
        'WhatsApp Image 2026-01-21 at 2.40.23 PM (1).jpeg',
        'WhatsApp Image 2026-01-21 at 2.40.23 PM (3).jpeg',
        'WhatsApp Image 2026-01-21 at 2.40.23 PM (4).jpeg',
        'WhatsApp-Image-2022-11-29-at-11.32.43-AM-1.jpeg',
        'WhatsApp-Image-2023-02-01-at-11.33.48-AM-2.jpeg'
    ];

    const track = document.querySelector('.carousel-track');
    const nextButton = document.querySelector('.btn-next');
    const prevButton = document.querySelector('.btn-prev');
    const dotsNav = document.querySelector('.carousel-nav');

    // Populate carousel
    photoFiles.forEach((file, index) => {
        const slide = document.createElement('li');
        slide.classList.add('carousel-slide');
        slide.innerHTML = `<img src="Fotos/${file}" alt="School Photo ${index + 1}">`;
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
        { name: 'Formar corazones', cost: 8000000, description: 'Dotación completa de los libros "Aprender a Amar" para todas las estudiantes.', impact: 'Cada $30.000 cubren el material de una niña.' },
        { name: 'Nuevo confesionario', cost: 6000000, description: 'Construcción de un nuevo confesionario para el oratorio.' },
        { name: 'Nuevo ambón', cost: 2000000, description: 'Adquisición de un nuevo ambón para el oratorio.' },
        { name: 'El Sueño de San José', cost: 4000000, description: 'Una urna especial para nuestra hermosa imagen de San José Dormido.' }
    ];

    const levels = [
        { name: 'Legendary Hero', min: 1000000, icon: 'levels/level4.png' },
        { name: 'VIP Status', min: 500000, icon: 'levels/level3.png' },
        { name: 'Front Row Seat', min: 100000, icon: 'levels/level2.png' },
        { name: 'Club Member', min: 0, icon: 'levels/level1.png' }
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
        if (totalElement) {
            // Animate number counting up (optional but premium)
            animateNumber(totalElement, total);
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

            const div = document.createElement('div');
            div.classList.add('objective-item');
            div.innerHTML = `
                <div class="objective-header">
                    <span class="objective-title">${obj.name}</span>
                    <span class="objective-cost">$${obj.cost.toLocaleString()} COP</span>
                </div>
                <p>${obj.description}</p>
                ${obj.impact ? `<p class="impact-text"><strong>Impacto:</strong> ${obj.impact}</p>` : ''}
                <div class="progress-container">
                    <div class="progress-bar" data-width="${percentage}%"></div>
                </div>
                <p class="progress-text">Consignado: $${objDonated.toLocaleString()} COP (${percentage.toFixed(1)}%)</p>
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
