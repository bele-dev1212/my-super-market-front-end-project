 const cartIcon = document.querySelector('.cart-icon');
        const cartModal = document.getElementById('cartModal');
        const closeModal = document.querySelector('.close-modal');
        const cartItemsContainer = document.getElementById('cartItems');
        const cartCount = document.querySelector('.cart-count');
        const totalAmount = document.querySelector('.total-amount');
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        const wishlistButtons = document.querySelectorAll('.wishlist');
        const checkoutBtn = document.querySelector('.checkout-btn');

        // Cart Data
        let cart = [];
        let wishlist = [];

        // Event Listeners
        cartIcon.addEventListener('click', openCartModal);
        closeModal.addEventListener('click', closeCartModal);
        checkoutBtn.addEventListener('click', checkout);

        // Add to Cart functionality
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productId = productCard.querySelector('h3').textContent;
                const productPrice = parseFloat(productCard.querySelector('.current-price').textContent.replace('$', ''));
                const productImg = productCard.querySelector('.product-img').textContent;
                
                // Check if product already in cart
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: productId,
                        name: productId,
                        price: productPrice,
                        img: productImg,
                        quantity: 1
                    });
                }
                
                updateCart();
                animateAddToCart(this);
            });
        });

        // Wishlist functionality
        wishlistButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productId = productCard.querySelector('h3').textContent;
                
                this.classList.toggle('active');
                
                if (this.classList.contains('active')) {
                    wishlist.push(productId);
                } else {
                    wishlist = wishlist.filter(id => id !== productId);
                }
            });
        });

        // Modal Functions
        function openCartModal() {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            }
            cartModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        function closeCartModal() {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Update Cart UI
        function updateCart() {
            // Update cart count
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Update cart items
            if (cart.length > 0) {
                cartItemsContainer.innerHTML = '';
                
                cart.forEach(item => {
                    const cartItemElement = document.createElement('div');
                    cartItemElement.className = 'cart-item';
                    cartItemElement.innerHTML = `
                        <div class="cart-item-img">${item.img}</div>
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-actions">
                                <button class="quantity-btn minus">-</button>
                                <input type="text" class="quantity" value="${item.quantity}" readonly>
                                <button class="quantity-btn plus">+</button>
                                <span class="remove-item">Remove</span>
                            </div>
                        </div>
                    `;
                    
                    cartItemsContainer.appendChild(cartItemElement);
                    
                    // Add event listeners to quantity buttons
                    const minusBtn = cartItemElement.querySelector('.minus');
                    const plusBtn = cartItemElement.querySelector('.plus');
                    const removeBtn = cartItemElement.querySelector('.remove-item');
                    
                    minusBtn.addEventListener('click', () => {
                        if (item.quantity > 1) {
                            item.quantity -= 1;
                            updateCart();
                        }
                    });
                    
                    plusBtn.addEventListener('click', () => {
                        item.quantity += 1;
                        updateCart();
                    });
                    
                    removeBtn.addEventListener('click', () => {
                        cart = cart.filter(cartItem => cartItem.id !== item.id);
                        updateCart();
                    });
                });
            } else {
                cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            }
            
            // Update total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalAmount.textContent = `$${total.toFixed(2)}`;
        }

        // Checkout function
        function checkout() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            alert(`Order placed! Total: ${totalAmount.textContent}`);
            cart = [];
            updateCart();
            closeCartModal();
        }

        // Add to cart animation
        function animateAddToCart(button) {
            button.textContent = 'Added!';
            button.style.backgroundColor = '#27ae60';
            
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '';
            }, 1000);
        }

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                closeCartModal();
            }
        });