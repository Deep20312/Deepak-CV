document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    let currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme or default
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Set initial icon
    if (currentTheme === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        
        // Update icon
        themeToggle.innerHTML = currentTheme === 'dark' 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        
        // Add animation class
        themeToggle.classList.add('theme-change');
        setTimeout(() => {
            themeToggle.classList.remove('theme-change');
        }, 300);
    });

    // Animate progress bars when scrolled into view
    const animateProgressBars = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress-fill');
                
                progressBars.forEach(bar => {
                    const parent = bar.closest('.language-progress');
                    const level = parent.getAttribute('data-level');
                    
                    // Animate the fill
                    bar.style.width = `${level}%`;
                    
                    // Add animation class
                    bar.classList.add('animate-progress');
                    
                    // Remove observer after animation
                    setTimeout(() => {
                        observer.unobserve(entry.target);
                    }, 1500);
                });
            }
        });
    };

    // Set up Intersection Observer for progress bars
    const languageObserver = new IntersectionObserver(animateProgressBars, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe language section
    const languageSection = document.querySelector('.language-container');
    if (languageSection) {
        languageObserver.observe(languageSection);
    }

    // Add hover effects to all cards
    const cards = document.querySelectorAll('.skill-card, .project-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation delay to sections for staggered effect
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1 + 0.2}s`;
    });

    // Visitor Popup Functionality
    const popup = document.getElementById('visitorPopup');
    const closeBtn = document.getElementById('closePopup');
    const visitorForm = document.getElementById('visitorForm');
    
    // Check if user has already submitted the form
    if (!localStorage.getItem('visitorFormSubmitted')) {
        // Show popup after 3 seconds
        setTimeout(() => {
            popup.classList.add('active');
        }, 3000);
    }

    // Close popup
    closeBtn.addEventListener('click', () => {
        popup.classList.remove('active');
    });

    // Close when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
        }
    });

    // Form submission
    visitorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Form data collection
        const formData = {
            name: document.getElementById('visitorName').value,
            email: document.getElementById('visitorEmail').value,
            company: document.getElementById('visitorCompany').value || 'Not provided',
            purpose: document.getElementById('visitorPurpose').value,
            timestamp: new Date().toISOString(),
            pageUrl: window.location.href
        };

        // Show loading state
        const submitBtn = visitorForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Send data to Formspree
        fetch('https://formspree.io/f/mdkejyaw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                company: formData.company,
                purpose: formData.purpose,
                _subject: 'New Resume Website Visitor',
                message: `New visitor from resume website:\n\nName: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nPurpose: ${formData.purpose}\n\nPage: ${formData.pageUrl}`
            })
        })
        .then(response => {
            if (response.ok) {
                // Store submission in localStorage to prevent showing again
                localStorage.setItem('visitorFormSubmitted', 'true');
                localStorage.setItem('visitorData', JSON.stringify(formData));
                
                // Show thank you message
                popup.innerHTML = `
                    <div class="popup-content">
                        <h3>Thank You!</h3>
                        <p>I appreciate you taking the time to share your information. I'll be in touch soon!</p>
                        <button id="closeThankYou" class="submit-btn">Close</button>
                    </div>
                `;
                
                document.getElementById('closeThankYou').addEventListener('click', () => {
                    popup.classList.remove('active');
                });
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your information. Please try again later.');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        });
    });

    // Form validation
    const formFields = visitorForm.querySelectorAll('input, select');
    formFields.forEach(field => {
        field.addEventListener('input', () => {
            if (!field.validity.valid) {
                field.nextElementSibling.style.display = 'block';
            } else {
                field.nextElementSibling.style.display = 'none';
            }
        });
    });
});
