document.addEventListener('DOMContentLoaded', () => {
    // Product data enhanced with description, category, age
    const products = [
        {
            id: 1,
            name: "Конструктор «Крепость»",
            image: "images/toy-fortress.jpg",
            price: 2999,
            rating: 4.8,
            badge: "Хит",
            description: "Большой деревянный конструктор для мальчиков и девочек. Развивает мелкую моторику, пространственное мышление и воображение. В наборе более 200 деталей.",
            category: "Конструкторы",
            age: "5+"
        },
        {
            id: 2,
            name: "Набор для творчества «Радужные краски»",
            image: "images/toy-paints.png",
            price: 1499,
            rating: 4.5,
            badge: "Новинка",
            description: "Яркий набор для рисования с акварельными красками, кисточками и холстом. Идеально для юных художников.",
            category: "Настольные игры",
            age: "3+"
        },
        {
            id: 3,
            name: "Мягкий медведь-плюш",
            image: "images/toy-bear.png",
            price: 1999,
            rating: 5.0,
            badge: "Популярное",
            description: "Плюшевый мишка из гипоаллергенных материалов. Мягкий, приятный на ощупь, безопасный даже для малышей.",
            category: "Мягкие игрушки",
            age: "3+"
        },
        {
            id: 4,
            name: "Научный набор «Маленький учёный»",
            image: "images/toy-science.png",
            price: 3499,
            rating: 4.7,
            badge: "Образовательное",
            description: "Обучающий набор с безопасными химическими экспериментами и микроскопом. Отличный подарок для любознательных детей.",
            category: "Обучающие наборы",
            age: "5+"
        },
        {
            id: 5,
            name: "Радиоуправляемая машинка",
            image: "images/toy-car.png",
            price: 4999,
            rating: 4.6,
            badge: "Скорость",
            description: "Мощная машинка на пульте управления с большим радиусом действия. Устойчива к ударам и легка в управлении.",
            category: "Конструкторы",
            age: "5+"
        },
        {
            id: 6,
            name: "Набор магнитных плиток",
            image: "images/toy-tiles.png",
            price: 2799,
            rating: 4.4,
            badge: "Тренд",
            description: "Красочные магнитные плитки для создания 3D-конструкций. Развивает пространственное мышление и креативность.",
            category: "Обучающие наборы",
            age: "3+"
        }
    ];

    // Full localStorage cart
    const CART_KEY = 'toyStoreCart';
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const total = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = total;
        }
    }

    function saveCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCount();
    }

    function addToCart(product) {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
        }
        saveCart();
    }

    // Initialize count on load
    updateCartCount();

    // Modal refs
    const modal = document.getElementById('productModal');
    const modalProductImage = document.getElementById('modalProductImage');
    const modalProductTitle = document.getElementById('modalProductTitle');
    const modalProductPrice = document.getElementById('modalProductPrice');
    const modalProductDescription = document.getElementById('modalProductDescription');
    const modalProductRating = document.getElementById('modalProductRating');

    function openModal(product) {
        if (!modal) return;
        if (modalProductImage) { modalProductImage.src = product.image; modalProductImage.alt = product.name; }
        if (modalProductTitle) modalProductTitle.textContent = product.name;
        if (modalProductPrice) modalProductPrice.textContent = `${product.price.toLocaleString()} ₽`;
        if (modalProductDescription) modalProductDescription.textContent = product.description;
        if (modalProductRating) modalProductRating.innerHTML = renderStars(product.rating);
        modal.style.display = 'flex';
    }

    function closeModal() {
        if (modal) modal.style.display = 'none';
    }

    if (modal) {
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Render stars helper
    function renderStars(rating) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                html += '<i class="fas fa-star"></i>';
            } else if (rating >= i - 0.5) {
                html += '<i class="fas fa-star-half-alt"></i>';
            } else {
                html += '<i class="far fa-star"></i>';
            }
        }
        return html;
    }

    // Filters state
    let activeCategory = 'all';
    let activeAge = 'all';

    function getFilteredProducts() {
        return products.filter(p => {
            const catMatch = activeCategory === 'all' || p.category === activeCategory;
            const ageMatch = activeAge === 'all' || p.age === activeAge;
            return catMatch && ageMatch;
        });
    }

    function renderFilters(container) {
        if (!container) return;
        const categories = ['all', 'Конструкторы', 'Настольные игры', 'Мягкие игрушки', 'Обучающие наборы'];
        const ages = ['all', '3+', '5+'];

        const catLabel = (c) => c === 'all' ? 'Все категории' : c;
        const ageLabel = (a) => a === 'all' ? 'Любой возраст' : a;

        container.innerHTML = `
            <div class="filter-group category-filters">
                ${categories.map(c => `<button class="filter-chip ${c === activeCategory ? 'active' : ''}" data-filter="category" data-value="${c}">${catLabel(c)}</button>`).join('')}
            </div>
            <div class="filter-group age-filters">
                ${ages.map(a => `<button class="filter-chip ${a === activeAge ? 'active' : ''}" data-filter="age" data-value="${a}">${ageLabel(a)}</button>`).join('')}
            </div>
        `;

        container.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const type = chip.dataset.filter;
                const value = chip.dataset.value;
                if (type === 'category') activeCategory = value;
                if (type === 'age') activeAge = value;
                renderFilters(container);
                renderProducts();
            });
        });
    }

    function renderProducts() {
        const productGrid = document.getElementById('productGrid');
        if (!productGrid) return;
        const filtered = getFilteredProducts();
        productGrid.innerHTML = '';

        filtered.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card fade-in';
            productCard.dataset.id = product.id;

            productCard.innerHTML = `
                <div class="product-badge">${product.badge}</div>
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-overlay">
                        <button class="btn-outline view-btn" data-id="${product.id}"><i class="fas fa-eye"></i> Посмотреть</button>
                        <button class="btn-primary add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i> В корзину</button>
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="rating">${renderStars(product.rating)}</div>
                    <p class="price">${product.price.toLocaleString()} ₽</p>
                    <p class="meta"><span class="category">${product.category}</span> · <span class="age">${product.age}</span></p>
                </div>
            `;

            productGrid.appendChild(productCard);
        });

        // Re-bind IntersectionObserver for new cards
        observeFadeIns();
    }

    // Event delegation for add-to-cart and modal
    document.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-to-cart');
        if (addBtn) {
            e.preventDefault();
            const id = Number(addBtn.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) {
                addToCart(product);
                const originalText = addBtn.innerHTML;
                addBtn.innerHTML = '<i class="fas fa-check"></i> Добавлено!';
                setTimeout(() => { addBtn.innerHTML = originalText; }, 1500);
            }
            return;
        }

        const viewBtn = e.target.closest('.view-btn');
        if (viewBtn) {
            e.preventDefault();
            e.stopPropagation();
            const id = Number(viewBtn.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) openModal(product);
            return;
        }

        const card = e.target.closest('.product-card');
        if (card && !e.target.closest('.product-overlay')) {
            const id = Number(card.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) openModal(product);
        }
    });

    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input[type="email"]');
            if (input && input.value.trim() !== '') {
                alert('Спасибо за подписку на нашу рассылку!');
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

    // IntersectionObserver fade-in
    let appearOnScroll;
    function observeFadeIns() {
        const faders = document.querySelectorAll('.fade-in');
        if (!appearOnScroll) {
            appearOnScroll = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('appear');
                    appearOnScroll.unobserve(entry.target);
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
        }
        faders.forEach(fader => appearOnScroll.observe(fader));
    }

    // Hamburger toggle
    const burgerMenu = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav');
    if (burgerMenu && nav) {
        burgerMenu.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Initial render
    const filterContainer = document.getElementById('productFilters');
    if (filterContainer) renderFilters(filterContainer);
    renderProducts();
    observeFadeIns();
});
