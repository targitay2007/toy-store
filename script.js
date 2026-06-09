document.addEventListener('DOMContentLoaded', () => {
    // Product data
    const products = [
        {
            id: 1,
            name: "Конструктор «Крепость»",
            image: "https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Конструктор",
            price: 2999,
            rating: 4.8,
            badge: "Хит"
        },
        {
            id: 2,
            name: "Набор для творчества «Радужные краски»",
            image: "https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=Краски",
            price: 1499,
            rating: 4.5,
            badge: "Новинка"
        },
        {
            id: 3,
            name: "Мягкий медведь-плюш",
            image: "https://via.placeholder.com/300x300/FF9F1C/FFFFFF?text=Медведь",
            price: 1999,
            rating: 5.0,
            badge: "Популярное"
        },
        {
            id: 4,
            name: "Научный набор «Маленький учёный»",
            image: "https://via.placeholder.com/300x300/2A9D8F/FFFFFF?text=Набор",
            price: 3499,
            rating: 4.7,
            badge: "Образовательное"
        },
        {
            id: 5,
            name: "Радиоуправляемая машинка",
            image: "https://via.placeholder.com/300x300/E76F51/FFFFFF?text=Машинка",
            price: 4999,
            rating: 4.6,
            badge: "Скорость"
        },
        {
            id: 6,
            name: "Набор магнитных плиток",
            image: "https://via.placeholder.com/300x300/264653/FFFFFF?text=Плитки",
            price: 2799,
            rating: 4.4,
            badge: "Тренд"
        }
    ];

    // Cart functionality (demo)
    const cartCount = document.querySelector('.cart-count');
    let count = 0;
    const addButtons = document.querySelectorAll('.add-to-cart');
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            count++;
            cartCount.textContent = count;
            btn.textContent = 'Добавлено!';
            setTimeout(() => { btn.textContent = 'В корзину'; }, 1500);
        });
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input[type="email"]');
            if (input.value.trim() !== '') {
                alert('Спасибо за подписку! Мы будем держать вас в курсе новинок.');
                newsletterForm.reset();
            } else {
                alert('Пожалуйста, введите корректный email.');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Simple animation on scroll (optional)
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            appearOnScroll.unobserve(entry.target);
        });
    }, appearOptions);
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Load products dynamically
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            productCard.innerHTML = `
                <div class="product-badge">${product.badge}</div>
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-overlay">
                        <button class="btn-outline view-btn"><i class="fas fa-eye"></i> Посмотреть</button>
                        <button class="btn-primary add-to-cart"><i class="fas fa-shopping-cart"></i> В корзину</button>
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="rating">
                        ${Array(5).fill().map((_, i) => i < product.rating ? '<i class="fas fa-star"></i>' : i < product.rating + 0.5 ? '<i class="fas fa-star-half-alt"></i>' : '<i class="far fa-star"></i>').join('')}
                    </div>
                    <p class="price">${product.price.toLocaleString()} &#8381;</p>
                </div>
            `;

            productGrid.appendChild(productCard);
        });

        // Re-add event listeners to newly created buttons
        const newAddButtons = document.querySelectorAll('.add-to-cart');
        newAddButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                count++;
                cartCount.textContent = count;
                btn.textContent = 'Добавлено!';
                setTimeout(() => { btn.textContent = 'В корзину'; }, 1500);
            });
        });

        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Функция просмотра товара в разработке.');
            });
        });

    // Modal functionality
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImg = document.getElementById('modalImg');
    const modalPrice = document.getElementById('modalPrice');
    const modalRating = document.getElementById('modalRating');
    const modalBadge = document.getElementById('modalBadge');
    const closeBtn = document.querySelector('.close-btn');

    // Open modal when product card is clicked
    document.addEventListener('click', function(e) {
        const card = e.target.closest('.product-card');
        if (card) {
            const productName = card.querySelector('h3').textContent;
            const product = products.find(p => p.name === productName);
            if (product) {
                modalTitle.textContent = product.name;
                modalImg.src = product.image;
                modalImg.alt = product.name;
                modalPrice.textContent = product.price.toLocaleString() + ' &#8381;';
                modalRating.textContent = product.rating;
                modalBadge.textContent = product.badge;
                modal.style.display = 'block';
            }
        }
    });

    // Close modal when clicking on X or outside content
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    }
});