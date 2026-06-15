// ===== NAVIGATION BAR BEHAVIOR =====
    document.addEventListener('DOMContentLoaded', () => {
        const navBg = document.querySelector('.nav-bg');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');

        // --- 1. Add icons to nav links ---
        navLinks.forEach(link => {
            const iconClass = link.getAttribute('data-icon');
            if (iconClass) {
                const icon = document.createElement('i');
                icon.className = iconClass;
                link.prepend(icon); // insert icon before the text
            }
        });

        // --- 2. Function to handle scroll effects ---
        function handleScroll() {
            const scrollY = window.scrollY;

            // Add/remove glass background
            if (scrollY > 20) {
                navBg.classList.add('scrolled');
            } else {
                navBg.classList.remove('scrolled');
            }

            // Highlight active section
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 70; // adjust for nav
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        // Run on scroll
        window.addEventListener('scroll', handleScroll);

        // Run on load
        handleScroll();
    });

    // ===== SEMINARS & CERTIFICATES GALLERY =====
    const certificates = [
        {
            title: "Leadership Seminar: Silakbo ng Diwa | June 2025",
            details: "Developed practical leadership skills, learning strategies to inspire and guide teams effectively through interactive exercises.",
            image: "{% static 'Media/CERT7.jpg' %}"
        },
        {
            title: "Introduction to Cybersecurity (Cisco Online Course) | NOV 2025",
            details: "Explored cybersecurity fundamentals, including threat types, protection strategies, and career opportunities in the field.",
            image: "{% static 'Media/CERT4.jpg' %}"
        },
        {
            title: "Ethical Hacker (Cisco Online Course) | NOV 2025",
            details: "Learned offensive security techniques to identify vulnerabilities and prevent cyber attacks before malicious actors exploit them.",
            image: "{% static 'Media/CERT6.jpg' %}"
        },
        {
            title: "Network Defense (Cisco Online Course) | NOV 2025",
            details: "Learned to monitor and protect network systems, analyze security alerts, and implement effective defense strategies.",
            image: "{% static 'Media/CERT2.jpg' %}"
        },
        {
            title: "Endpoint Security (Cisco Online Course) | DEC 2025",
            details: "Learned how to secure networks from core to edge, including protection of endpoint devices and overall system security.",
            image: "{% static 'Media/CERT3.jpg' %}"
        },
        {
            title: "Basic Web Development with PHP, JavaScript, and jQuery | November 2022",
            details: "Gained foundational web development skills, including creating dynamic and interactive web pages using PHP, JavaScript, and jQuery.",
            image: "{% static 'Media/CERT1.png' %}"
        }
    ];

    let certIndex = 0;

    const certTitleEl = document.getElementById("certificate-title");
    const certDetailsEl = document.getElementById("certificate-details");
    const certImageEl = document.getElementById("certificate-image");
    const nextCertBtn = document.getElementById("next-btn");
    const prevCertBtn = document.getElementById("prev-btn");

    // Function to update gallery content
    function updateCertificate() {
        certTitleEl.textContent = certificates[certIndex].title;
        certDetailsEl.textContent = certificates[certIndex].details;

        // Smooth fade effect
        certImageEl.style.opacity = 0;
        setTimeout(() => {
            certImageEl.src = certificates[certIndex].image;
            certImageEl.style.opacity = 1;
        }, 200);
    }

    // Next button
    if (nextCertBtn) {
        nextCertBtn.addEventListener("click", () => {
            certIndex = (certIndex + 1) % certificates.length;
            updateCertificate();
        });
    }

    // Previous button
    if (prevCertBtn) {
        prevCertBtn.addEventListener("click", () => {
            certIndex = (certIndex - 1 + certificates.length) % certificates.length;
            updateCertificate();
        });
    }

    // Initialize first certificate on page load
    updateCertificate();


    // ===== CAROUSEL SLIDING =====
    const cards = document.querySelectorAll('.card-container');
    const positions = ['position-left-2', 'position-left-1', 'position-center', 'position-right-1', 'position-right-2'];
    let currentPositions = [2, 3, 4, 0, 1]; // Maps card index to position index

    function slideCards() {
        // Shift positions to the right
        currentPositions = currentPositions.map(pos => (pos + 1) % 5);

        // Update each card's position class with fade during transition
        cards.forEach((card, index) => {
            // Add a class for fade transition instead of inline styles
            card.classList.add('sliding');
            
            // Remove all position classes
            positions.forEach(pos => card.classList.remove(pos));
            
            // Add new position class
            const newPosition = positions[currentPositions[index]];
            card.classList.add(newPosition);

            // Remove sliding class after transition completes
            setTimeout(() => {
                card.classList.remove('sliding');
            }, 800);
        });
    }

    // Auto-slide every 5 seconds
    setInterval(slideCards, 5000);

    // ===== INTERSECTION OBSERVER FOR REVEAL =====
    document.addEventListener("DOMContentLoaded", () => {
        const reveals = document.querySelectorAll(".reveal");
        let lastScrollY = window.scrollY;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const currentScrollY = window.scrollY;
                    const scrollingDown = currentScrollY > lastScrollY;

                    if (entry.isIntersecting) {
                        // Show when entering viewport
                        entry.target.classList.add("show");
                        entry.target.classList.remove("hide-up", "hide-down");
                    } else {
                        // Hide with direction-based animation
                        entry.target.classList.remove("show");
                        
                        if (scrollingDown) {
                            // Scrolling down - element goes up
                            entry.target.classList.add("hide-up");
                            entry.target.classList.remove("hide-down");
                        } else {
                            // Scrolling up - element goes down
                            entry.target.classList.add("hide-down");
                            entry.target.classList.remove("hide-up");
                        }
                    }
                    
                    lastScrollY = currentScrollY;
                });
            },
            {
                threshold: 0.25, // section is 25% visible
            }
        );

        reveals.forEach(section => observer.observe(section));
    });

    // ===== PROJECTS CAROUSEL NAVIGATION =====
    const carousel = document.querySelector('.projects-carousel');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    const cardWidth = 330; // card width + gap

    if (nextBtn && carousel) {
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
    }

    if (prevBtn && carousel) {
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
    }

    // ===== HERO SECTION INITIAL ANIMATIONS =====
    window.addEventListener('load', () => {

        const heroImg = document.getElementById('hero-img');
        if (heroImg) {
            heroImg.style.animation = 'fadeSlideRight 0.8s ease forwards 1.5s';
            
            // Mark animation as complete after it finishes
            setTimeout(() => {
                heroImg.classList.add('animation-complete');
            }, 2300); // 1.5s delay + 0.8s animation
        }
    });

    // ===== ROLE TEXT ROTATION =====
    const roles = [
        "GRAPHIC DESIGNER",
        "UI/UX DESIGNER",
        "WEB DEVELOPER",
    ];

    let currentIndex = 0;
    const roleElement = document.getElementById("role-text");

    function typeWriter(text, index = 0) {
        if (index < text.length) {
            roleElement.textContent = text.substring(0, index + 1);
            setTimeout(() => typeWriter(text, index + 1), 80); // Typing speed
        }
    }

    function changeRole() {
        if (!roleElement) return;
        
        // Slide right and fade out
        roleElement.style.opacity = '0';
        roleElement.style.transform = 'translateX(50px)';

        // Don't wait - immediately start preparing next text
        setTimeout(() => {
            // Change to next role
            currentIndex = (currentIndex + 1) % roles.length;
            roleElement.textContent = ''; // Clear text
            
            // Reset position
            roleElement.style.transform = 'translateX(0)';
            
            // Immediately fade in and start typing
            roleElement.style.opacity = '1';
            typeWriter(roles[currentIndex]);
        }, 150); // Quick overlap - starts while still sliding out
    }

    // Start changing roles after initial animations complete (after ~3s)
    setTimeout(() => {
        setInterval(changeRole, 3500); // Longer interval for typing animation
    }, 3000);

    // ===== HERO IMAGE TILT EFFECT =====
    const img = document.getElementById('hero-img');
    const card = img?.parentElement;

    if (card && img) {
        let tiltEnabled = false;

        // Enable tilt only after initial animation completes
        setTimeout(() => {
            tiltEnabled = true;
        }, 2300); // 1.5s delay + 0.8s animation

        card.addEventListener('mousemove', (e) => {
            if (!tiltEnabled) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            // Use custom property for tilt, preserving other transforms
            card.style.setProperty('--tilt-x', `${rotateX}deg`);
            card.style.setProperty('--tilt-y', `${rotateY}deg`);
            
            // Apply tilt using transform property
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            if (!tiltEnabled) return;

            // Reset tilt smoothly
            card.style.setProperty('--tilt-x', '0deg');
            card.style.setProperty('--tilt-y', '0deg');
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            img.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    }

