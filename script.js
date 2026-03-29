document.addEventListener('DOMContentLoaded', () => {
    // 1. Photo Carousel Logic
    const photoFiles = [
        'Leonor_Puyana_de_Bermudez.jpg',
        'colegio_integral_soacha_baile.jpg',
        'colegio_integral_soacha_ejercicio_teatro.jpg',
        'colegio_integral_soacha_excelencia.jpg',
        'colegio_integral_soacha_grados_capilla.jpeg',
        'colegio_integral_soacha_jardin.jpeg',
        'colegio_integral_soacha_letrero.jpeg',
        'colegio_integral_soacha_virgen_maria_nina.jpg',
        'colegio_integral_soacha_llanerito.jpg',
        'colegio_integral_soacha_ninas_biblioteca.jpg',
        'colegio_integral_soacha_oratorio_capilla.jpeg',
        'colegio_integral_soacha_primeras_comuniones.jpg',
        'colegio_integral_soacha_recreo.jpg',
        'colegio_integral_soacha_retablo.jpeg',
        'colegio_integral_soacha_virgen_maria_jardin.jpeg'
    ];

    const track = document.querySelector('.carousel-track');
    // Remove buttons and nav dots logic since it's now an infinite scroll
    const nextButton = document.querySelector('.btn-next');
    const prevButton = document.querySelector('.btn-prev');
    const dotsNav = document.querySelector('.carousel-nav');

    // Hide controls if they exist (or we can just ignore them, but better to hide)
    if (nextButton) nextButton.style.display = 'none';
    if (prevButton) prevButton.style.display = 'none';
    if (dotsNav) dotsNav.style.display = 'none';

    // Populate carousel (Double the items to ensure smooth infinite scroll validation)
    const infiniteFiles = [...photoFiles, ...photoFiles];

    infiniteFiles.forEach((file, index) => {
        const slide = document.createElement('li');
        slide.classList.add('carousel-slide');
        slide.innerHTML = `<img src="images/carousel/${file}" alt="School Photo ${index + 1}">`;
        track.appendChild(slide);
    });

    // 2. Donation Data and Progress Bars
    const objectives = [
        {
            name: 'Formar corazones',
            cost: 8000000,
            description: 'Dotación completa de los libros "Aprender a Amar" para todas las estudiantes.',
            impact: 'Cada $30.000 cubren el material de una niña.',
            images: ['images/projects/project1a.jpg', 'images/projects/project1b.jpg']
        },
        {
            name: 'Nuevo confesionario',
            cost: 8000000,
            description: 'Construcción de un nuevo confesionario para el oratorio.',
            images: ['images/projects/project2a.jpg', 'images/projects/project2b.jpg']
        },
        {
            name: 'Nuevo ambón',
            cost: 2000000,
            description: 'Adquisición de un nuevo ambón para el oratorio. El actual lo usaremos como atril para la Sede.',
            images: ['images/projects/project3a.jpg', 'images/projects/project3b.jpg']
        },
        {
            name: 'El Sueño de San José',
            cost: 4000000,
            description: 'Una urna especial para nuestra hermosa imagen de San José Dormido.',
            images: ['images/projects/project4a.jpg', 'images/projects/project4b.jpg']
        }
    ];

    const levels = [
        {
            name: 'Legendary Hero',
            min: 1000000,
            icon: 'images/levels/level4.png',
            description: 'Dejas un legado histórico. Te conviertes en un pilar del colegio. Gracias a héroes como tú, podemos completar nuestras metas y asegurar la formación de toda una generación.',
            range: '$1.000.000 COP en adelante'
        },
        {
            name: 'VIP Status',
            min: 500000,
            icon: 'images/levels/level3.png',
            description: 'Eres parte fundamental del equipo. Tu donación impulsa significativamente la construcción del nuevo confesionario y la urna para San José.',
            range: '$500.000 - $999.000 COP'
        },
        {
            name: 'Front Row Seat',
            min: 100000,
            icon: 'images/levels/level2.png',
            description: 'Estás en primera fila. Tu generosidad nos permite avanzar más rápido.',
            range: '$100.000 - $499.000 COP'
        },
        {
            name: 'Club Member',
            min: 0,
            icon: 'images/levels/level1.png',
            description: 'Es la semilla para nuestros sueños. ¡Bienvenido al club!',
            range: 'Hasta $99.000 COP'
        }
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
        // Removed donation-stats element logic

        if (totalElement) {
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

        objectives.forEach((obj, index) => {
            let objDonated = Math.min(remainingDonated, obj.cost);
            let percentage = (objDonated / obj.cost) * 100;
            remainingDonated = Math.max(0, remainingDonated - obj.cost);

            const isCompleted = percentage >= 100;

            const div = document.createElement('div');
            div.classList.add('objective-item');
            if (isCompleted) div.classList.add('completed');

            // Construct carousel HTML
            const imagesHtml = obj.images.map((imgSrc, imgIndex) =>
                `<img src="${imgSrc}" alt="${obj.name}" class="mini-carousel-img ${imgIndex === 0 ? 'active' : ''}">`
            ).join('');

            div.innerHTML = `
                <div class="objective-image mini-carousel" id="mini-carousel-${index}">
                    ${imagesHtml}
                </div>
                <div class="objective-content">
                    <div class="objective-header">
                        <span class="objective-title">${obj.name} ${isCompleted ? '<span class="completed-badge">✓ Meta Cumplida</span>' : ''}</span>
                    </div>
                    <p>${obj.description}</p>
                    ${obj.impact ? `<p class="impact-text"><strong>Impacto:</strong> ${obj.impact}</p>` : ''}
                    
                    <div class="progress-info-header">
                        <span class="current-amount">$${objDonated.toLocaleString('es-CO')}</span>
                        <span class="goal-info">${percentage.toFixed(0)}% de la meta de $${obj.cost.toLocaleString('es-CO')}</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar ${isCompleted ? 'gold-glow' : ''}" data-width="${percentage}%"></div>
                    </div>
                </div>
            `;
            container.appendChild(div);

            // Start mini-carousel cycle
            startMiniCarousel(index, obj.images.length);
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

    function startMiniCarousel(id, count) {
        const carousel = document.getElementById(`mini-carousel-${id}`);
        if (!carousel) return;
        const images = carousel.querySelectorAll('.mini-carousel-img');
        let currentIndex = 0;

        setInterval(() => {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % count;
            images[currentIndex].classList.add('active');
        }, 4000); // Change image every 4 seconds
    }

    function renderDonors(donors) {
        const container = document.getElementById('donors-grid');
        container.innerHTML = ''; // Clear existing content
        container.classList.remove('donors-grid'); // Remove grid class as we want full-width rows
        container.classList.add('hall-of-fame');

        // Sort levels ascending (Club Member first)
        const sortedLevels = [...levels].sort((a, b) => a.min - b.min);

        sortedLevels.forEach(level => {
            // Find donors for this level
            // A donor belongs to this level if their amount is >= level.min AND < the next higher level's min (if any)
            // But simplify: we can just check if it matches the level lookup
            const levelDonors = donors.filter(d => {
                const assignedLevel = levels.find(l => d.amount >= l.min); // uses the original ordered levels array which assumes order matters or logic matters
                // To be safe, let's just re-calculate the level for each donor using the same logic as before
                // The original find() works because arrays are searched in order. 
                // Wait, the original levels array was:
                // Legendary (1M), VIP (500k), Front (100k), Club (0)
                // So find() returns the first match.
                return assignedLevel.name === level.name;
            });

            // REMOVED CHECK: if (levelDonors.length === 0) return; 

            const levelDiv = document.createElement('div');
            levelDiv.classList.add('hall-of-fame-level');

            const donorCount = levelDonors.length;
            const donorCountHtml = `
                <div class="donor-count-box">
                    <span class="count-number">${donorCount}</span>
                    <span class="count-label">${donorCount === 1 ? 'donante' : 'donantes'}</span>
                </div>`;

            levelDiv.innerHTML = `
                <div class="level-image-container">
                    <img src="${level.icon}" alt="${level.name}" class="level-image">
                </div>
                <div class="level-content">
                    <div class="level-header-row">
                        <div class="level-title-col">
                            <h3 class="level-title">${level.name}</h3>
                            <p class="level-range">${level.range}</p>
                            <p class="level-description">${level.description}</p>
                        </div>
                        ${donorCountHtml}
                    </div>
                </div>
            `;
            container.appendChild(levelDiv);
        });
    }

    function obfuscateName(fullName) {
        return fullName.split(' ').map(word => {
            if (word.length <= 2) return word;
            return word.substring(0, 2) + '*'.repeat(Math.min(3, word.length - 2));
        }).join(' ');
    }

    function setupFloatingButton() {
        const btn = document.getElementById('floating-donate-btn');
        const hero = document.querySelector('.hero');
        const donarSection = document.getElementById('donar');
        const footer = document.querySelector('footer');

        if (!btn || !hero || !donarSection) return;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroBottom = hero.offsetTop + hero.offsetHeight;
            const donarTop = donarSection.offsetTop;

            // Show button if we passed the hero but haven't reached the donar section
            // Ideally slightly before donar section so it doesn't overlap
            if (scrollY > heroBottom && scrollY < (donarTop - window.innerHeight + 200)) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });
    }

    function setupScrollAnimations() {
        setupFloatingButton(); // Call it here
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
