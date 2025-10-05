// Security: Content Security Policy would be set via HTTP headers
// Security: XSS prevention - sanitize inputs
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Loading screen
window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    setTimeout(function() {
        loading.classList.add('hidden');
    }, 1000);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const backToTop = document.getElementById('backToTop');
    
    if(window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide back to top button
    if(window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// Back to top functionality
document.getElementById('backToTop').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// WhatsApp button functionality
document.getElementById('whatsappButton').addEventListener('click', function() {
    const phoneNumber = '918860133445';
    const message = 'Hello, I would like to know more about your numerology consultation services.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});

// Form submission with validation
document.getElementById('consultationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Basic form validation
    const form = e.target;
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
    }
    
    // Sanitize inputs before processing
    const formData = {
        name: sanitizeInput(document.getElementById('name').value),
        email: sanitizeInput(document.getElementById('email').value),
        phone: sanitizeInput(document.getElementById('phone').value),
        service: sanitizeInput(document.getElementById('service').value),
        message: sanitizeInput(document.getElementById('message').value)
    };
    
    // In a real application, you would send this data to your server
    // For now, we'll simulate successful submission
    console.log('Form data submitted:', formData);
    
    // Show success message
    alert('Thank you for your inquiry! We will contact you within 24 hours to schedule your consultation.');
    
    // Reset form
    form.reset();
    form.classList.remove('was-validated');
    
    // You can integrate with email services like:
    // - EmailJS
    // - Formspree
    // - Netlify Forms
    // - Your own backend API
});

// Scroll animation
function checkScroll() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if(elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Add loading lazy for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });
});

// Performance optimization
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}