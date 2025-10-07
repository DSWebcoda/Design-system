// Design System Navigation and Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Skip special handling for page examples (external links)
            if (this.classList.contains('page-example')) {
                return; // Let the browser handle the navigation normally
            }

            e.preventDefault();

            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Smooth scroll to top of content
            document.querySelector('.content').scrollTop = 0;
        });
    });

    // Color swatch interactions
    const colorSwatches = document.querySelectorAll('.color-swatch');

    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            const colorValue = this.getAttribute('data-color');
            const colorName = this.getAttribute('data-name');

            // Copy color to clipboard
            if (navigator.clipboard) {
                navigator.clipboard.writeText(colorValue).then(() => {
                    showToast(`Copied ${colorName}: ${colorValue}`);
                }).catch(() => {
                    showToast(`${colorName}: ${colorValue}`);
                });
            } else {
                showToast(`${colorName}: ${colorValue}`);
            }
        });

        // Add tooltip on hover
        swatch.addEventListener('mouseenter', function() {
            const colorValue = this.getAttribute('data-color');
            showTooltip(this, colorValue);
        });

        swatch.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });

    // Token copy functionality
    const tokenItems = document.querySelectorAll('.token-item, .token-item-text, .token-item-clean');

    tokenItems.forEach(item => {
        item.addEventListener('click', function() {
            const tokenName = this.getAttribute('data-token');
            const tokenValue = this.getAttribute('data-value');

            // Copy CSS variable to clipboard
            const cssVariable = `var(${tokenName})`;

            if (navigator.clipboard) {
                navigator.clipboard.writeText(cssVariable).then(() => {
                    showTokenCopyFeedback(this, tokenName);
                }).catch(() => {
                    showTokenCopyFeedback(this, tokenName, false);
                });
            } else {
                // Fallback for older browsers
                showTokenCopyFeedback(this, tokenName, false);
            }
        });
    });

    function showTokenCopyFeedback(element, tokenName, success = true) {
        // Add copied class for visual feedback
        element.classList.add('token-copied');

        // Show success message
        if (success) {
            showToast(`Copied: var(${tokenName})`);
        } else {
            showToast(`Token: var(${tokenName})`);
        }

        // Remove feedback class after animation
        setTimeout(() => {
            element.classList.remove('token-copied');
        }, 200);
    }

    // Button demo interactions
    const demoButtons = document.querySelectorAll('.btn');

    demoButtons.forEach(button => {
        // Add click animation
        button.addEventListener('click', function(e) {
            // Only for demo buttons, not navigation
            if (!this.classList.contains('nav-link')) {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.6);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });
    });

    // Form interactions
    const formInputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');

    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Mobile navigation toggle (for future mobile menu)
    function createMobileToggle() {
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-nav-toggle';
        mobileToggle.innerHTML = '☰';
        mobileToggle.style.cssText = `
            display: none;
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 1000;
            background: var(--btn-secondary-light-bg);
            color: var(--btn-secondary-light-text);
            border: none;
            padding: 0.75rem;
            border-radius: var(--radius-form);
            font-size: 1.25rem;
            cursor: pointer;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        `;

        // Add hover effects
        mobileToggle.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.backgroundColor = 'var(--deep-blue-01)';
        });

        mobileToggle.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.backgroundColor = 'var(--btn-secondary-light-bg)';
        });

        mobileToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('open');

            // Toggle backdrop
            if (sidebar.classList.contains('open')) {
                createBackdrop();
            } else {
                removeBackdrop();
            }
        });

        document.body.appendChild(mobileToggle);

        // Show toggle on mobile
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        function handleMediaQuery(e) {
            if (e.matches) {
                mobileToggle.style.display = 'block';
            } else {
                mobileToggle.style.display = 'none';
                document.querySelector('.sidebar').classList.remove('open');
                removeBackdrop();
            }
        }

        mediaQuery.addListener(handleMediaQuery);
        handleMediaQuery(mediaQuery);
    }

    // Backdrop functions for mobile menu
    function createBackdrop() {
        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            animation: fadeIn 0.3s ease;
        `;

        backdrop.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.remove('open');
            removeBackdrop();
        });

        document.body.appendChild(backdrop);
    }

    function removeBackdrop() {
        const backdrop = document.querySelector('.mobile-backdrop');
        if (backdrop) {
            backdrop.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                if (backdrop.parentNode) {
                    backdrop.parentNode.removeChild(backdrop);
                }
            }, 300);
        }
    }

    createMobileToggle();

    // Utility functions
    function showToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #111827;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 500;
            z-index: 1000;
            animation: toast-in 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toast-out 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    let tooltip;

    function showTooltip(element, text) {
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: fixed;
            background: #111827;
            color: white;
            padding: 0.5rem 0.75rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
            z-index: 1000;
            pointer-events: none;
            white-space: nowrap;
            visibility: hidden;
        `;

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        // Calculate horizontal position (centered on element)
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

        // Keep tooltip within viewport horizontally
        const viewportWidth = window.innerWidth;
        if (left < 8) left = 8;
        if (left + tooltipRect.width > viewportWidth - 8) {
            left = viewportWidth - tooltipRect.width - 8;
        }

        // Position above element
        let top = rect.top - tooltipRect.height - 8;

        // If tooltip would be off-screen above, position below
        if (top < 8) {
            top = rect.bottom + 8;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.style.visibility = 'visible';
    }

    function hideTooltip() {
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        @keyframes toast-in {
            from {
                opacity: 0;
                transform: translateY(100%);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes toast-out {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(100%);
            }
        }

        .form-group.focused label {
            color: #0ea5e9;
        }

        @media (max-width: 768px) {
            .mobile-nav-toggle {
                display: block !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize with overview section
    document.querySelector('.nav-link[href="#overview"]').classList.add('active');
    document.querySelector('#overview').classList.add('active');
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        document.querySelector('.sidebar').classList.remove('open');
        removeBackdrop();
    }
});

// Advanced Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) {
        console.log('Search input not found');
        return;
    }

    console.log('Initializing search...');

    // Build search index of all sections, components, and tokens
    const searchIndex = buildSearchIndex();
    console.log(`Search index built with ${searchIndex.length} items`);

    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();

        // Clear previous timeout
        clearTimeout(searchTimeout);

        // Debounce search for better performance
        searchTimeout = setTimeout(() => {
            if (searchTerm === '') {
                // Reset - show all navigation items
                resetNavigation();
                return;
            }

            console.log(`Searching for: "${searchTerm}"`);
            // Search and filter
            performSearch(searchTerm, searchIndex);
        }, 150);
    });

    // Clear search on Escape
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            resetNavigation();
        }
    });
}

function buildSearchIndex() {
    const index = [];

    // Index navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();

        index.push({
            type: 'navigation',
            element: link.parentElement,
            href: href,
            text: text,
            keywords: text.toLowerCase()
        });
    });

    // Index all section headings
    document.querySelectorAll('.section h1, .section h2, .section h3').forEach(heading => {
        const section = heading.closest('.section');
        const sectionId = section ? section.id : '';

        index.push({
            type: 'heading',
            element: heading,
            sectionId: sectionId,
            text: heading.textContent.trim(),
            keywords: heading.textContent.toLowerCase()
        });
    });

    // Index tokens
    document.querySelectorAll('[data-token]').forEach(token => {
        const tokenName = token.getAttribute('data-token');
        const tokenValue = token.getAttribute('data-value');

        index.push({
            type: 'token',
            element: token,
            sectionId: 'tokens',
            text: tokenName,
            keywords: `${tokenName} ${tokenValue}`.toLowerCase()
        });
    });

    // Index button types
    document.querySelectorAll('.button-variant-group h3').forEach(buttonType => {
        index.push({
            type: 'component',
            element: buttonType,
            sectionId: 'buttons',
            text: buttonType.textContent.trim(),
            keywords: buttonType.textContent.toLowerCase() + ' button'
        });
    });

    // Index all component sections (h2 and h3 within sections)
    document.querySelectorAll('.component-section h2, .component-section h3').forEach(componentHeading => {
        const section = componentHeading.closest('.section');
        const sectionId = section ? section.id : '';

        index.push({
            type: 'component',
            element: componentHeading,
            sectionId: sectionId,
            text: componentHeading.textContent.trim(),
            keywords: componentHeading.textContent.toLowerCase()
        });
    });

    // Index color sections
    document.querySelectorAll('.color-section h2').forEach(colorSection => {
        index.push({
            type: 'component',
            element: colorSection,
            sectionId: 'colors',
            text: colorSection.textContent.trim(),
            keywords: colorSection.textContent.toLowerCase()
        });
    });

    // Index typography sections
    document.querySelectorAll('.typography-section h2, .typography-section h3').forEach(typoSection => {
        index.push({
            type: 'component',
            element: typoSection,
            sectionId: 'typography',
            text: typoSection.textContent.trim(),
            keywords: typoSection.textContent.toLowerCase()
        });
    });

    // Index card types and other specific components
    document.querySelectorAll('.card-explore, .accordion-item, .calendar-container').forEach(component => {
        const section = component.closest('.section');
        const sectionId = section ? section.id : '';

        // Get component name from heading or class
        let componentName = '';
        let keywords = '';

        if (component.classList.contains('card-explore')) {
            componentName = 'Explore Cards';
            keywords = 'explore cards card';
        } else if (component.classList.contains('accordion-item')) {
            componentName = 'Accordion';
            keywords = 'accordion collapse expand';
        } else if (component.classList.contains('calendar-container')) {
            componentName = 'Calendar';
            keywords = 'calendar date picker booking';
        }

        if (componentName) {
            index.push({
                type: 'component',
                element: component,
                sectionId: sectionId,
                text: componentName,
                keywords: keywords
            });
        }
    });

    return index;
}

function performSearch(searchTerm, index) {
    const results = index.filter(item =>
        item.keywords.includes(searchTerm)
    );

    console.log(`Found ${results.length} results:`, results.map(r => r.text));

    // Hide all navigation items first
    document.querySelectorAll('.nav-link').forEach(link => {
        link.parentElement.style.display = 'none';
    });

    // Show matching navigation items and expand their sections
    const matchedSections = new Set();
    results.forEach(result => {
        if (result.type === 'navigation') {
            result.element.style.display = 'block';
            // Expand parent section
            const navContent = result.element.closest('.nav-section-content');
            if (navContent) {
                navContent.classList.remove('collapsed');
                const sectionName = navContent.getAttribute('data-section-content');
                const header = document.querySelector(`[data-section="${sectionName}"]`);
                if (header) {
                    header.classList.remove('collapsed');
                    matchedSections.add(sectionName);
                }
            }
        } else {
            // For other types, highlight the corresponding nav item
            const navLink = document.querySelector(`.nav-link[href="#${result.sectionId}"]`);
            if (navLink && navLink.parentElement) {
                navLink.parentElement.style.display = 'block';
                // Expand parent section
                const navContent = navLink.closest('.nav-section-content');
                if (navContent) {
                    navContent.classList.remove('collapsed');
                    const sectionName = navContent.getAttribute('data-section-content');
                    const header = document.querySelector(`[data-section="${sectionName}"]`);
                    if (header) {
                        header.classList.remove('collapsed');
                        matchedSections.add(sectionName);
                    }
                }
            }
        }
    });

    // Show count of results
    if (results.length === 0) {
        showSearchFeedback('No results found');
    } else {
        showSearchFeedback(`${results.length} result${results.length === 1 ? '' : 's'} found`);
    }
}

function resetNavigation() {
    // Show all navigation items
    document.querySelectorAll('.nav-link').forEach(link => {
        link.parentElement.style.display = 'block';
    });

    // Re-expand all sections to their default state
    document.querySelectorAll('.nav-section-content').forEach(content => {
        content.classList.remove('collapsed');
    });

    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.classList.remove('collapsed');
        const icon = header.querySelector('.collapse-icon');
        if (icon) {
            icon.src = 'icons/material-symbols_keyboard-arrow-up.svg';
            icon.alt = 'Collapse';
        }
    });

    // Remove search feedback
    const feedback = document.querySelector('.search-feedback');
    if (feedback) {
        feedback.remove();
    }
}

function showSearchFeedback(message) {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.search-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    const feedback = document.createElement('div');
    feedback.className = 'search-feedback';
    feedback.textContent = message;

    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.appendChild(feedback);
    }
}

// Initialize search after DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSearch);

// Booking Example Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Ticket pricing data
    const ticketPrices = {
        adults: 29.95,
        child: 15.00,
        concession: 23.95,
        infant: 0.00
    };

    // Ticket quantities
    const ticketQuantities = {
        adults: 0,
        child: 0,
        concession: 0,
        infant: 0
    };

    // Initialize booking functionality
    function initializeBooking() {
        const quantityBtns = document.querySelectorAll('.quantity-btn');
        const quantityDisplays = document.querySelectorAll('.quantity-display');
        const ticketsSummary = document.querySelector('.tickets-summary');
        const orderTotal = document.querySelector('.order-total');
        const totalAmount = document.querySelector('.total-amount');
        const ticketBreakdown = document.querySelector('.ticket-breakdown');

        if (!quantityBtns.length) return; // Exit if booking section not present

        // Add event listeners to quantity buttons
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const action = this.getAttribute('data-action');
                const ticketType = this.getAttribute('data-ticket');

                if (action === 'increase') {
                    ticketQuantities[ticketType]++;
                } else if (action === 'decrease' && ticketQuantities[ticketType] > 0) {
                    ticketQuantities[ticketType]--;
                }

                updateQuantityDisplay(ticketType);
                updateBookingSummary();

                // Add ripple effect
                createRipple(this, e);
            });
        });

        // Update quantity display for a specific ticket type
        function updateQuantityDisplay(ticketType) {
            const display = document.querySelector(`[data-ticket="${ticketType}"].quantity-display`);
            if (display) {
                display.textContent = ticketQuantities[ticketType];
                display.setAttribute('data-count', ticketQuantities[ticketType]);

                // Update quantity display selected state
                if (ticketQuantities[ticketType] > 0) {
                    display.classList.add('selected');
                } else {
                    display.classList.remove('selected');
                }
            }
        }

        // Update booking summary
        function updateBookingSummary() {
            const totalTickets = Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0);
            const totalCost = Object.entries(ticketQuantities).reduce((sum, [type, qty]) => {
                return sum + (qty * ticketPrices[type]);
            }, 0);

            const descriptionSection = document.querySelector('.summary-section:has(.description)') ||
                                      document.querySelector('.description')?.closest('.summary-section');

            // Show/hide tickets summary section and description
            if (totalTickets > 0) {
                ticketsSummary.style.display = 'block';
                orderTotal.style.display = 'block';
                // Hide only the description section when tickets are added
                if (descriptionSection) {
                    descriptionSection.style.display = 'none';
                }
                updateTicketBreakdown();
            } else {
                ticketsSummary.style.display = 'none';
                orderTotal.style.display = 'none';
                // Show description section when no tickets are selected
                if (descriptionSection) {
                    descriptionSection.style.display = 'block';
                }
            }

            // Update total amount
            if (totalAmount) {
                totalAmount.textContent = `$${totalCost.toFixed(2)}`;
            }
        }

        // Update ticket breakdown in summary
        function updateTicketBreakdown() {
            if (!ticketBreakdown) return;

            const ticketNames = {
                adults: 'Adults',
                child: 'Child (4-13 Years)',
                concession: 'Concession',
                infant: 'Infants (3 & Under)'
            };

            ticketBreakdown.innerHTML = '';

            Object.entries(ticketQuantities).forEach(([type, qty]) => {
                if (qty > 0) {
                    const ticketRow = document.createElement('div');
                    ticketRow.className = 'ticket-row';

                    const cost = qty * ticketPrices[type];
                    // Always use the full label - no need for singular/plural logic since we have specific labels
                    const ticketLabel = `${qty} x ${ticketNames[type]}`;

                    ticketRow.innerHTML = `
                        <span>${ticketLabel}</span>
                        <span class="price">$${cost.toFixed(2)}</span>
                    `;

                    ticketBreakdown.appendChild(ticketRow);
                }
            });
        }

        // Create ripple effect for buttons
        function createRipple(button, event) {
            const circle = document.createElement('span');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;

            const rect = button.getBoundingClientRect();
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${event.clientX - rect.left - radius}px`;
            circle.style.top = `${event.clientY - rect.top - radius}px`;
            circle.classList.add('ripple-effect');

            const rippleCSS = `
                .ripple-effect {
                    position: absolute;
                    border-radius: 50%;
                    background-color: rgba(0, 6, 79, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                }
            `;

            // Add CSS if not already added
            if (!document.querySelector('#ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = rippleCSS;
                document.head.appendChild(style);
            }

            const existingRipple = button.querySelector('.ripple-effect');
            if (existingRipple) {
                existingRipple.remove();
            }

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(circle);

            // Remove ripple after animation
            setTimeout(() => {
                circle.remove();
            }, 600);
        }

        // Book now button functionality
        const bookNowBtn = document.querySelector('.book-now-btn');
        if (bookNowBtn) {
            bookNowBtn.addEventListener('click', function(e) {
                e.preventDefault();

                const totalTickets = Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0);
                if (totalTickets === 0) {
                    showToast('Please select at least one ticket to continue.');
                    return;
                }

                // Simulate booking process
                this.textContent = 'Processing...';
                this.disabled = true;

                setTimeout(() => {
                    showToast('Booking successful! This is a demo - no actual booking was made.');
                    this.textContent = 'Book now';
                    this.disabled = false;
                }, 2000);

                // Add ripple effect
                createRipple(this, e);
            });
        }

        // Initialize summary state
        updateBookingSummary();
    }

    // Initialize booking functionality
    initializeBooking();

    // Accordion functionality
    function initializeAccordion() {
        const accordionTriggers = document.querySelectorAll('[data-accordion-trigger]');

        accordionTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const accordionItem = this.closest('[data-accordion-item]');
                const accordionContent = accordionItem.querySelector('[data-accordion-content]');
                const isActive = accordionItem.classList.contains('active');

                // Toggle the current accordion item
                if (isActive) {
                    accordionItem.classList.remove('active');
                    accordionContent.style.maxHeight = '0px';
                } else {
                    accordionItem.classList.add('active');
                    // Set max-height to the scroll height for smooth animation
                    accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
                }

                // Update the icon (switch between plus and minus)
                const icon = this.querySelector('.accordion-icon');
                if (icon) {
                    if (isActive) {
                        // Switching from expanded to collapsed
                        icon.src = 'icons/material-symbols_add.svg';
                        icon.alt = 'Expand accordion';
                    } else {
                        // Switching from collapsed to expanded
                        icon.src = 'icons/material-symbols_check-indeterminate-small.svg';
                        icon.alt = 'Collapse accordion';
                    }
                }
            });

            // Add keyboard support
            trigger.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Recalculate max-height on window resize
        window.addEventListener('resize', function() {
            const activeAccordions = document.querySelectorAll('.accordion-item.active [data-accordion-content]');
            activeAccordions.forEach(content => {
                content.style.maxHeight = content.scrollHeight + 'px';
            });
        });
    }

    // Initialize accordion functionality
    initializeAccordion();

    // Calendar functionality
    function initializeCalendar() {
        const calendarDays = document.getElementById('calendar-days');
        const calendarTitle = document.getElementById('calendar-title');
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');

        if (!calendarDays) return; // Exit if calendar section not present

        const today = new Date();
        let currentMonth = today.getMonth(); // Current month (0-indexed)
        let currentYear = today.getFullYear();
        let selectedDate = null;

        // Complete pricing data with special pricing across all months
        const pricingData = {
            // January 2025
            '2025-1-3': { price: 22.50, special: true },
            '2025-1-11': { price: 24.95, special: true },
            '2025-1-19': { price: 23.00, special: true },
            '2025-1-27': { price: 25.50, special: true },

            // February 2025
            '2025-2-5': { price: 26.00, special: true },
            '2025-2-14': { price: 24.00, special: true }, // Valentine's Day special
            '2025-2-21': { price: 23.95, special: true },
            '2025-2-28': { price: 25.95, special: true },

            // March 2025
            '2025-3-7': { price: 24.50, special: true },
            '2025-3-15': { price: 26.50, special: true },
            '2025-3-23': { price: 22.95, special: true },
            '2025-3-30': { price: 25.00, special: true },

            // April 2025
            '2025-4-4': { price: 23.50, special: true },
            '2025-4-12': { price: 24.00, special: true },
            '2025-4-18': { price: 26.95, special: true },
            '2025-4-26': { price: 22.00, special: true },

            // May 2025
            '2025-5-2': { price: 25.50, special: true },
            '2025-5-9': { price: 24.95, special: true },
            '2025-5-17': { price: 23.50, special: true },
            '2025-5-25': { price: 26.00, special: true },

            // June 2025 - keeping original Figma design
            '2025-6-6': { price: 25.00, special: true },
            '2025-6-13': { price: 24.50, special: true },
            '2025-6-20': { price: 25.00, special: true },
            '2025-6-22': { price: 25.00, special: true },
            '2025-6-29': { price: 23.95, special: true },

            // July 2025
            '2025-7-5': { price: 26.50, special: true },
            '2025-7-11': { price: 24.00, special: true },
            '2025-7-19': { price: 25.95, special: true },
            '2025-7-26': { price: 23.00, special: true },

            // August 2025
            '2025-8-1': { price: 22.50, special: true },
            '2025-8-8': { price: 25.50, special: true },
            '2025-8-16': { price: 24.95, special: true },
            '2025-8-24': { price: 26.00, special: true },
            '2025-8-31': { price: 23.50, special: true },

            // September 2025
            '2025-9-6': { price: 24.00, special: true },
            '2025-9-14': { price: 25.95, special: true },
            '2025-9-21': { price: 23.95, special: true },
            '2025-9-28': { price: 26.50, special: true },

            // October 2025
            '2025-10-3': { price: 25.00, special: true },
            '2025-10-10': { price: 24.50, special: true },
            '2025-10-18': { price: 22.95, special: true },
            '2025-10-25': { price: 25.50, special: true },
            '2025-10-31': { price: 20.00, special: true }, // Halloween special

            // November 2025
            '2025-11-7': { price: 23.50, special: true },
            '2025-11-15': { price: 25.95, special: true },
            '2025-11-22': { price: 24.00, special: true },
            '2025-11-29': { price: 26.00, special: true },

            // December 2025
            '2025-12-5': { price: 24.95, special: true },
            '2025-12-12': { price: 23.00, special: true },
            '2025-12-19': { price: 25.50, special: true },
            '2025-12-26': { price: 22.50, special: true }, // Boxing Day special
            '2025-12-31': { price: 19.95, special: true }  // New Year's Eve special
        };

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        function renderCalendar() {
            const firstDay = new Date(currentYear, currentMonth, 1);
            const lastDay = new Date(currentYear, currentMonth + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDayOfWeek = firstDay.getDay();

            // Convert Sunday (0) to Monday (1) based system
            const mondayBasedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

            calendarDays.innerHTML = '';

            // Update calendar title
            calendarTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;

            // Add blank days for previous month
            for (let i = 0; i < mondayBasedStartDay; i++) {
                const prevMonthDate = new Date(currentYear, currentMonth, -mondayBasedStartDay + i + 1);
                const dayElement = createDayElement(prevMonthDate.getDate(), true, false, prevMonthDate);
                dayElement.classList.add('calendar-day-other-month');
                calendarDays.appendChild(dayElement);
            }

            // Add days for current month
            for (let day = 1; day <= daysInMonth; day++) {
                const currentDate = new Date(currentYear, currentMonth, day);
                const today = new Date();

                // Disable days that are in the past (before today)
                const isPastDate = currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                const dayElement = createDayElement(day, false, isPastDate, currentDate);
                calendarDays.appendChild(dayElement);
            }

            // Fill remaining cells with next month dates only if needed to complete a row
            const totalCells = calendarDays.children.length;
            const cellsInLastRow = totalCells % 7;

            // Only add next month days if the last row is incomplete (has some current month days)
            if (cellsInLastRow > 0) {
                const cellsToAdd = 7 - cellsInLastRow;
                for (let day = 1; day <= cellsToAdd; day++) {
                    const nextMonthDate = new Date(currentYear, currentMonth + 1, day);
                    const dayElement = createDayElement(day, true, false, nextMonthDate);
                    dayElement.classList.add('calendar-day-other-month');
                    calendarDays.appendChild(dayElement);
                }
            }
        }

        function createDayElement(dayNumber, isOtherMonth, isPastDate, dateObj) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';

            const dayNumberElement = document.createElement('div');
            dayNumberElement.className = 'calendar-day-number';
            dayNumberElement.textContent = dayNumber;

            dayElement.appendChild(dayNumberElement);

            if (!isOtherMonth && !isPastDate) {
                // Available days - show pricing and make clickable
                const dateKey = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dayNumber}`;
                const pricing = pricingData[dateKey];

                if (pricing) {
                    const priceElement = document.createElement('div');
                    priceElement.className = 'calendar-day-price';
                    if (pricing.special) {
                        priceElement.classList.add('price-special');
                    }
                    priceElement.textContent = `$${pricing.price.toFixed(2)}`;
                    dayElement.appendChild(priceElement);
                } else {
                    // Default pricing for days without specific pricing
                    const priceElement = document.createElement('div');
                    priceElement.className = 'calendar-day-price';
                    priceElement.textContent = '$29.95';
                    dayElement.appendChild(priceElement);
                }

                // Add click handler for available days
                dayElement.addEventListener('click', function() {
                    selectDate(dayElement, dateObj);
                });
            } else if (!isOtherMonth && isPastDate) {
                // Disabled days - no pricing, just grayed out number
                dayElement.classList.add('calendar-day-disabled');
            }

            return dayElement;
        }

        function selectDate(dayElement, dateObj) {
            // Remove previous selection
            const previouslySelected = calendarDays.querySelector('.calendar-day-selected');
            if (previouslySelected) {
                previouslySelected.classList.remove('calendar-day-selected');
            }

            // Add selection to clicked day
            dayElement.classList.add('calendar-day-selected');
            selectedDate = dateObj;

            // Show selection feedback
            const dateStr = dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            showToast(`Selected: ${dateStr}`);
        }

        function navigateMonth(direction) {
            if (direction === 'prev') {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
            } else if (direction === 'next') {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
            }

            selectedDate = null; // Clear selection when navigating
            renderCalendar();
        }

        // Event listeners
        prevMonthBtn.addEventListener('click', () => {
            navigateMonth('prev');
        });

        nextMonthBtn.addEventListener('click', () => {
            navigateMonth('next');
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!document.querySelector('#calendar').classList.contains('active')) return;

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateMonth('prev');
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                navigateMonth('next');
            }
        });

        // Initialize calendar
        renderCalendar();
    }

    // Initialize calendar functionality
    initializeCalendar();

    // Initialize icons functionality
    initializeIcons();
});

// Icons functionality
function initializeIcons() {
    const iconGrid = document.getElementById('icon-grid');
    if (!iconGrid) return; // Exit if icons section not present

    // All icons that exist in the folder
    const icons = [
        { file: 'material-symbols_add.svg', name: 'Add' },
        { file: 'material-symbols_animation.svg', name: 'Animation' },
        { file: 'material-symbols_arrow-back.svg', name: 'Back' },
        { file: 'material-symbols_arrow-downward-rounded.svg', name: 'Arrow Down' },
        { file: 'material-symbols_arrow-forward.svg', name: 'Forward' },
        { file: 'material-symbols_arrow-left-rounded.svg', name: 'Arrow Left' },
        { file: 'material-symbols_arrow-right-rounded.svg', name: 'Arrow Right' },
        { file: 'material-symbols_arrow-upward-rounded.svg', name: 'Arrow Up' },
        { file: 'material-symbols_aspect-ratio-outline-rounded.svg', name: 'Aspect Ratio' },
        { file: 'material-symbols_attach-money.svg', name: 'Money' },
        { file: 'material-symbols_calendar-month-outline.svg', name: 'Calendar' },
        { file: 'material-symbols_call.svg', name: 'Call' },
        { file: 'material-symbols_check-indeterminate-small.svg', name: 'Check Indeterminate' },
        { file: 'material-symbols_check-small.svg', name: 'Check Small' },
        { file: 'material-symbols_chevron-left.svg', name: 'Chevron Left' },
        { file: 'material-symbols_chevron-right.svg', name: 'Chevron Right' },
        { file: 'material-symbols_close-rounded.svg', name: 'Close' },
        { file: 'material-symbols_close-small.svg', name: 'Close Small' },
        { file: 'material-symbols_grid-view-outline.svg', name: 'Grid View' },
        { file: 'material-symbols_hourglass-outline.svg', name: 'Hourglass' },
        { file: 'material-symbols_imagesmode-outline.svg', name: 'Images Mode' },
        { file: 'material-symbols_keyboard-arrow-down.svg', name: 'Keyboard Down' },
        { file: 'material-symbols_keyboard-arrow-up.svg', name: 'Keyboard Up' },
        { file: 'material-symbols_location-on-outline.svg', name: 'Location' },
        { file: 'material-symbols_map-outline.svg', name: 'Map' },
        { file: 'material-symbols_menu.svg', name: 'Menu' },
        { file: 'material-symbols_nest-clock-farsight-analog-outline.svg', name: 'Clock' },
        { file: 'material-symbols_restaurant-menu.svg', name: 'Restaurant Menu' },
        { file: 'material-symbols_schedule-outline.svg', name: 'Schedule' },
        { file: 'material-symbols_search.svg', name: 'Search' },
        { file: 'material-symbols_type-specimen-outline-sharp.svg', name: 'Typography' },
        { file: 'mdi_ticket-outline.svg', name: 'Ticket' }
    ];

    // Generate icon items
    icons.forEach(({ file, name }) => {
        const iconItem = document.createElement('div');
        iconItem.className = 'icon-item';

        iconItem.innerHTML = `
            <div class="icon">
                <img src="icons/${file}" alt="${name}" class="icon-svg">
            </div>
            <span>${name}</span>
        `;

        iconGrid.appendChild(iconItem);
    });

    // Collapsible menu functionality
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');

    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const sectionName = this.getAttribute('data-section');
            const content = document.querySelector(`[data-section-content="${sectionName}"]`);
            const icon = this.querySelector('.collapse-icon');
            const isCollapsed = this.classList.contains('collapsed');

            if (isCollapsed) {
                // Expand
                this.classList.remove('collapsed');
                content.classList.remove('collapsed');
                icon.src = 'icons/material-symbols_keyboard-arrow-up.svg';
                icon.alt = 'Collapse';
            } else {
                // Collapse
                this.classList.add('collapsed');
                content.classList.add('collapsed');
                icon.src = 'icons/material-symbols_keyboard-arrow-down.svg';
                icon.alt = 'Expand';
            }
        });
    });

    // Initialize all sections as expanded by default
    // If you want them collapsed by default, uncomment the lines below:
    // collapsibleHeaders.forEach(header => {
    //     header.classList.add('collapsed');
    //     const sectionName = header.getAttribute('data-section');
    //     const content = document.querySelector(`[data-section-content="${sectionName}"]`);
    //     content.classList.add('collapsed');
    // });
}