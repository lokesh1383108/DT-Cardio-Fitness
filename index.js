document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Default Seed Data (Testimonials, Gallery, Videos)
       ========================================================================== */
    const defaultTestimonials = [
        {
            id: 1,
            name: "Ritu Kumari",
            batch: "Bhiwadi Offline Batch",
            result: "Lost 12kg",
            rating: 5,
            quote: "DT Cardio has completely changed my perspective on fitness. Anjali Ma'am gives personal attention to every student. I lost 12 kgs in just 3 months with her offline batch and proper diet guidelines!",
            status: "approved"
        },
        {
            id: 2,
            name: "Amit Sharma",
            batch: "Online Client",
            result: "Muscle Gain +6kg",
            rating: 5,
            quote: "Due to my office shifts, I joined their online cardio classes. The workouts are extremely energetic, and the custom protein-rich diet chart helped me gain 6kg of lean muscle mass. Highly recommended!",
            status: "approved"
        },
        {
            id: 3,
            name: "Priya Singh",
            batch: "Cosmos Greens Resident",
            result: "Body Toning",
            rating: 5,
            quote: "Best decision of 2026. The separate batches for females give so much comfort and space. The body toning exercises combined with aerobics kept me excited every day. Superb coaching!",
            status: "approved"
        }
    ];

    const defaultPhotos = [
        { id: 101, url: "images/hero_fitness.png", caption: "Unisex Cardio Session" },
        { id: 102, url: "images/owner_trainer.png", caption: "Coach Anjali Raj Chawhan" },
        { id: 103, url: "images/cardio_class.png", caption: "Bhiwadi Studio Class" }
    ];

    const defaultVideos = [
        {
            id: 201,
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            title: "Cardio Kickboxing Session Preview",
            desc: "A quick glimpse of our high-intensity group cardio batches."
        },
        {
            id: 202,
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            title: "Aerobics & Fat Loss Routine",
            desc: "Cardio session tailored for toning and fast weight loss."
        }
    ];

    /* ==========================================================================
       Local Storage State Manager
       ========================================================================== */
    let state = {
        feedbacks: JSON.parse(localStorage.getItem('dt_feedbacks')) || defaultTestimonials,
        photos: JSON.parse(localStorage.getItem('dt_photos')) || defaultPhotos,
        videos: JSON.parse(localStorage.getItem('dt_videos')) || defaultVideos
    };

    // Save state helper
    const saveState = () => {
        localStorage.setItem('dt_feedbacks', JSON.stringify(state.feedbacks));
        localStorage.setItem('dt_photos', JSON.stringify(state.photos));
        localStorage.setItem('dt_videos', JSON.stringify(state.videos));
    };

    // Init storage if empty
    if (!localStorage.getItem('dt_feedbacks')) saveState();

    /* ==========================================================================
       SPA Hash-Based Router
       ========================================================================== */
    const mainWrapper = document.getElementById('main-content-wrapper');
    const feedbackPage = document.getElementById('give-feedback');
    const mainHeader = document.getElementById('main-header');

    const handleRoute = () => {
        const hash = window.location.hash;
        
        if (hash === '#give-feedback') {
            mainWrapper.style.display = 'none';
            feedbackPage.style.display = 'flex';
            window.scrollTo(0, 0);
        } else {
            mainWrapper.style.display = 'block';
            feedbackPage.style.display = 'none';
            
            // Scroll to hash section if present on main page
            if (hash) {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Call once on load

    /* ==========================================================================
       Sticky Header and Scroll Active Links
       ========================================================================== */
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        const bars = navToggle.querySelectorAll('.bar');
        if (navToggle.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(6px, -7px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    };

    navToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    const sections = document.querySelectorAll('section');
    const scrollActive = () => {
        const scrollY = window.scrollY;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    };
    window.addEventListener('scroll', scrollActive);

    /* ==========================================================================
       Dynamic Rendering Functions
       ========================================================================== */
    
    // Render Testimonials Carousel
    const testimonialsSlider = document.getElementById('testimonialsSlider');
    const sliderDots = document.getElementById('sliderDots');
    let currentSlide = 0;
    let slideInterval;

    const renderTestimonials = () => {
        const approvedFeedbacks = state.feedbacks.filter(f => f.status === 'approved');
        
        if (approvedFeedbacks.length === 0) {
            testimonialsSlider.innerHTML = `<p class="text-center" style="grid-column: span 3; font-style: italic;">No reviews approved yet.</p>`;
            sliderDots.innerHTML = '';
            return;
        }

        testimonialsSlider.innerHTML = approvedFeedbacks.map((item, idx) => `
            <div class="testimonial-slide ${idx === 0 ? 'active' : ''}">
                <div class="testimonial-card">
                    <div class="stars">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</div>
                    <p class="quote">"${item.quote}"</p>
                    <div class="client-info">
                        <div class="client-avatar" style="background-color: var(--primary-light); color: var(--primary)">
                            ${item.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h4>${item.name}</h4>
                            <p class="client-meta">${item.batch} ${item.result ? `• ${item.result}` : ''}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        sliderDots.innerHTML = approvedFeedbacks.map((_, idx) => `
            <span class="dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>
        `).join('');

        // Re-attach carousel events
        initCarousel();
    };

    const initCarousel = () => {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.slider-dots .dot');
        currentSlide = 0;

        clearInterval(slideInterval);

        const showSlide = (index) => {
            if (slides.length === 0) return;
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => showSlide(currentSlide + 1);
        const prevSlide = () => showSlide(currentSlide - 1);

        document.getElementById('sliderNext').onclick = () => {
            clearInterval(slideInterval);
            nextSlide();
            slideInterval = setInterval(nextSlide, 6000);
        };

        document.getElementById('sliderPrev').onclick = () => {
            clearInterval(slideInterval);
            prevSlide();
            slideInterval = setInterval(nextSlide, 6000);
        };

        dots.forEach((dot, index) => {
            dot.onclick = () => {
                clearInterval(slideInterval);
                showSlide(index);
                slideInterval = setInterval(nextSlide, 6000);
            };
        });

        slideInterval = setInterval(nextSlide, 6000);
    };

    // Render Gallery
    const renderGallery = () => {
        const galleryGrid = document.getElementById('dynamicGalleryGrid');
        if (!galleryGrid) return;

        galleryGrid.innerHTML = state.photos.map(photo => `
            <div class="gallery-card">
                <img src="${photo.url}" alt="${photo.caption}" class="gallery-card-img" onerror="this.src='images/hero_fitness.png'">
                <div class="gallery-card-caption">${photo.caption}</div>
            </div>
        `).join('');
    };

    // Render Videos
    const renderVideos = () => {
        const videoGrid = document.getElementById('dynamicVideoGrid');
        if (!videoGrid) return;

        videoGrid.innerHTML = state.videos.map(video => {
            // Check if embed url
            const isEmbed = video.url.includes('youtube.com/embed') || video.url.includes('player.vimeo.com');
            
            return `
                <div class="video-card">
                    <div class="video-wrapper">
                        ${isEmbed ? `
                            <iframe src="${video.url}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                        ` : `
                            <video src="${video.url}" controls preload="metadata" onerror="showMockVideoThumbnail(this, '${video.title.replace(/'/g, "\\'")}')"></video>
                        `}
                    </div>
                    <div class="video-info">
                        <h4>${video.title}</h4>
                        <p>${video.desc || 'Client transformation feedback workout session'}</p>
                    </div>
                </div>
            `;
        }).join('');
    };

    /* ==========================================================================
       Hero Slideshow (Auto-slide in seconds)
       ========================================================================== */
    const heroSlideshow = document.getElementById('heroSlideshow');
    let currentHeroSlide = 0;
    let heroInterval;

    const renderHeroSlideshow = () => {
        if (!heroSlideshow) return;

        if (state.photos.length === 0) {
            heroSlideshow.innerHTML = `<div class="hero-slide active"><img src="images/hero_fitness.png" alt="Fitness Training Scene"></div>`;
            return;
        }

        heroSlideshow.innerHTML = state.photos.map((photo, idx) => `
            <div class="hero-slide ${idx === 0 ? 'active' : ''}">
                <img src="${photo.url}" alt="${photo.caption}" onerror="this.src='images/hero_fitness.png'">
            </div>
        `).join('');

        initHeroSlideshow();
    };

    const initHeroSlideshow = () => {
        clearInterval(heroInterval);
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length <= 1) return;

        currentHeroSlide = 0;

        const nextHeroSlide = () => {
            slides[currentHeroSlide].classList.remove('active');
            currentHeroSlide = (currentHeroSlide + 1) % slides.length;
            slides[currentHeroSlide].classList.add('active');
        };

        // Automatic side-scrolling transition every 4 seconds
        heroInterval = setInterval(nextHeroSlide, 4000);
    };

    /* ==========================================================================
       Interactive BMI Calculator
       ========================================================================== */
    const bmiForm = document.getElementById('bmiForm');
    const bmiResult = document.getElementById('bmiResult');
    const bmiScore = document.getElementById('bmiScore');
    const bmiStatus = document.getElementById('bmiStatus');
    const bmiSuggestion = document.getElementById('bmiSuggestion');
    const bmiCTA = document.getElementById('bmiCTA');

    if (bmiForm) {
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const weight = parseFloat(document.getElementById('bmi-weight').value);
            const heightCm = parseFloat(document.getElementById('bmi-height').value);
            const gender = document.querySelector('input[name="bmi-gender"]:checked').value;

            if (!weight || !heightCm) return;

            const heightM = heightCm / 100;
            const bmi = (weight / (heightM * heightM)).toFixed(1);

            bmiScore.textContent = bmi;
            bmiResult.classList.add('active');

            let classification = '';
            let advice = '';
            let color = '';

            if (bmi < 18.5) {
                classification = 'Underweight';
                color = 'hsl(200, 70%, 45%)';
                advice = `Your BMI indicates you are underweight. We recommend our specialized ${gender === 'Female' ? 'Female' : 'Male'} Weight Gain Program, focused on healthy calorie excess, strength coaching, and protein-packed nutrition templates.`;
            } else if (bmi >= 18.5 && bmi <= 24.9) {
                classification = 'Healthy Weight';
                color = 'var(--success)';
                advice = `Great job! You fall into the healthy weight category. Maintain your fitness level with our Body Toning or Cardio Stamina batches to keep your cardiovascular health in peak state.`;
            } else if (bmi >= 25 && bmi <= 29.9) {
                classification = 'Overweight';
                color = 'var(--warning)';
                advice = `You are in the overweight range. Our targeted Weight Loss batches combined with a custom nutrition diet chart will help achieve a safe calorie deficit and trim body fat sustainably.`;
            } else {
                classification = 'Obese';
                color = 'var(--danger)';
                advice = `Your score indicates obesity. Let's work together step-by-step. Our coach provides personal, close monitoring and custom low-impact cardio programs to protect your joints while burning fat.`;
            }

            bmiStatus.textContent = classification;
            bmiStatus.style.color = color;
            bmiScore.style.color = color;
            bmiSuggestion.textContent = advice;

            const customMessage = encodeURIComponent(`Hello Coach Anjali, I calculated my BMI as ${bmi} (${classification}) for the ${gender} Batch. I'd like to book a free trial session.`);
            bmiCTA.setAttribute('href', `https://wa.me/919509700562?text=${customMessage}`);
            bmiCTA.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    /* ==========================================================================
       Contact Form Submission Handler
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('formSubmitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const phone = document.getElementById('contact-phone').value.trim();
            const mode = document.getElementById('contact-mode').value;
            const batch = document.getElementById('contact-gender').value;
            const goal = document.getElementById('contact-goal').value;
            const message = document.getElementById('contact-message').value.trim();

            if (name.length < 2) {
                showFeedback('Please enter a valid full name.', 'error');
                return;
            }
            if (!/^[0-9]{10}$/.test(phone)) {
                showFeedback('Please enter a valid 10-digit mobile number.', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing request...';

            setTimeout(() => {
                showFeedback(`Thank you, ${name}! Your enquiry has been received. Redirecting to Coach Anjali...`, 'success');

                let waText = `Hello DT Cardio & Fitness!\n\n`;
                waText += `My name is *${name}*.\n`;
                waText += `I want to join the *${batch}* (${mode}).\n`;
                waText += `My Fitness Goal is: *${goal}*.\n`;
                waText += `My Contact: ${phone}.\n`;
                if (message) {
                    waText += `Note: _${message}_\n`;
                }
                
                const waUrl = `https://wa.me/919509700562?text=${encodeURIComponent(waText)}`;

                setTimeout(() => {
                    window.open(waUrl, '_blank');
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Enquiry';
                }, 1500);

            }, 1000);
        });
    }

    function showFeedback(msg, type) {
        formFeedback.textContent = msg;
        formFeedback.className = `form-feedback ${type}`;
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /* ==========================================================================
       User Standalone Review Form Form Handler
       ========================================================================== */
    const userFeedbackForm = document.getElementById('userFeedbackForm');
    const fbFormFeedback = document.getElementById('fbFormFeedback');

    if (userFeedbackForm) {
        userFeedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('fb-name').value.trim();
            const batch = document.getElementById('fb-batch').value.trim();
            const rating = parseInt(document.querySelector('input[name="fb-rating"]:checked').value);
            const result = document.getElementById('fb-result').value.trim();
            const text = document.getElementById('fb-text').value.trim();

            if (name.length < 2 || text.length < 5) {
                fbFormFeedback.textContent = "Please fill in all required fields accurately.";
                fbFormFeedback.className = "form-feedback error";
                fbFormFeedback.style.display = "block";
                return;
            }

            const newReview = {
                id: Date.now(),
                name: name,
                batch: batch,
                result: result || null,
                rating: rating,
                quote: text,
                status: "pending" // Admin must approve
            };

            state.feedbacks.push(newReview);
            saveState();

            fbFormFeedback.textContent = "Thank you! Your transformation story has been submitted and is pending approval from Coach Anjali Raj Chawhan.";
            fbFormFeedback.className = "form-feedback success";
            fbFormFeedback.style.display = "block";

            userFeedbackForm.reset();

            // Redirect back to testimonials on landing page after 3 seconds
            setTimeout(() => {
                fbFormFeedback.style.display = "none";
                window.location.hash = "#testimonials";
            }, 3500);
        });
    }

    /* ==========================================================================
       Admin Login Modal & Dashboard Handlers
       ========================================================================== */
    const adminPortalBtn = document.getElementById('adminPortalBtn');
    const adminLoginModal = document.getElementById('adminLoginModal');
    const closeLoginModalBtn = document.getElementById('closeLoginModalBtn');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminLoginFeedback = document.getElementById('adminLoginFeedback');
    
    const adminDashboardModal = document.getElementById('adminDashboardModal');
    const closeDashboardBtn = document.getElementById('closeDashboardBtn');

    // Open login modal
    if (adminPortalBtn) {
        adminPortalBtn.addEventListener('click', () => {
            adminLoginModal.style.display = 'flex';
            adminLoginFeedback.style.display = 'none';
            adminLoginForm.reset();
        });
    }

    // Close login modal
    if (closeLoginModalBtn) {
        closeLoginModalBtn.addEventListener('click', () => {
            adminLoginModal.style.display = 'none';
        });
    }

    // Passcode Login Submit
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const passcode = document.getElementById('admin-passcode').value;

            // Security check passcode
            if (passcode === 'dtfitness2026') {
                adminLoginFeedback.textContent = "Access Granted!";
                adminLoginFeedback.className = "form-feedback success";
                adminLoginFeedback.style.display = "block";

                setTimeout(() => {
                    adminLoginModal.style.display = 'none';
                    adminDashboardModal.style.display = 'flex';
                    renderAdminFeedbackList();
                    renderAdminPhotoList();
                    renderAdminVideoList();
                }, 800);
            } else {
                adminLoginFeedback.textContent = "Incorrect Passcode. Try again.";
                adminLoginFeedback.className = "form-feedback error";
                adminLoginFeedback.style.display = "block";
            }
        });
    }

    // Close dashboard modal
    if (closeDashboardBtn) {
        closeDashboardBtn.addEventListener('click', () => {
            adminDashboardModal.style.display = 'none';
        });
    }

    /* ==========================================================================
       Admin Tab Navigation
       ========================================================================== */
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            link.classList.add('active');
            const targetPanel = document.getElementById(link.dataset.tab);
            targetPanel.classList.add('active');
        });
    });

    /* ==========================================================================
       Admin Core Management Features
       ========================================================================== */

    // Render Admin Feedback approvals list
    const adminFeedbackList = document.getElementById('adminFeedbackList');
    
    const renderAdminFeedbackList = () => {
        if (!adminFeedbackList) return;

        if (state.feedbacks.length === 0) {
            adminFeedbackList.innerHTML = `<p style="font-style: italic;">No reviews submitted yet.</p>`;
            return;
        }

        adminFeedbackList.innerHTML = state.feedbacks.map(item => `
            <div class="admin-feedback-item">
                <div class="admin-feedback-info">
                    <h5>${item.name} <span class="admin-feedback-status-badge ${item.status}">${item.status}</span></h5>
                    <div class="admin-feedback-meta">
                        Batch: ${item.batch} ${item.result ? `| Result: ${item.result}` : ''} | Rating: ${item.rating}★
                    </div>
                    <p class="admin-feedback-text">"${item.quote}"</p>
                </div>
                <div class="feedback-actions">
                    ${item.status === 'pending' ? `
                        <button class="btn btn-primary btn-sm approve-fb-btn" data-id="${item.id}">Approve</button>
                    ` : ''}
                    <button class="btn btn-outline btn-sm delete-fb-btn" data-id="${item.id}" style="color: var(--danger); border-color: var(--danger);">Delete</button>
                </div>
            </div>
        `).join('');

        // Attach buttons listeners
        document.querySelectorAll('.approve-fb-btn').forEach(btn => {
            btn.onclick = () => {
                const id = parseInt(btn.dataset.id);
                approveFeedback(id);
            };
        });

        document.querySelectorAll('.delete-fb-btn').forEach(btn => {
            btn.onclick = () => {
                const id = parseInt(btn.dataset.id);
                deleteFeedback(id);
            };
        });
    };

    // Approve feedback action
    const approveFeedback = (id) => {
        state.feedbacks = state.feedbacks.map(f => {
            if (f.id === id) f.status = 'approved';
            return f;
        });
        saveState();
        renderAdminFeedbackList();
        renderTestimonials();
    };

    // Delete feedback action
    const deleteFeedback = (id) => {
        state.feedbacks = state.feedbacks.filter(f => f.id !== id);
        saveState();
        renderAdminFeedbackList();
        renderTestimonials();
    };

    // Render Admin Photo list for deletion
    const adminPhotoList = document.getElementById('adminPhotoList');

    const renderAdminPhotoList = () => {
        if (!adminPhotoList) return;

        if (state.photos.length === 0) {
            adminPhotoList.innerHTML = `<p style="font-style: italic; font-size: 0.85rem;">No photos uploaded yet.</p>`;
            return;
        }

        adminPhotoList.innerHTML = state.photos.map(photo => `
            <div class="admin-media-item">
                <img src="${photo.url}" alt="${photo.caption}" class="admin-media-thumb" onerror="this.src='images/hero_fitness.png'">
                <div class="admin-media-info">${photo.caption}</div>
                <div class="admin-media-actions">
                    <button class="btn btn-outline btn-sm delete-photo-btn" data-id="${photo.id}" style="color: var(--danger); border-color: var(--danger);">Delete</button>
                </div>
            </div>
        `).join('');

        // Attach delete handlers
        document.querySelectorAll('.delete-photo-btn').forEach(btn => {
            btn.onclick = () => {
                const id = parseInt(btn.dataset.id);
                deletePhoto(id);
            };
        });
    };

    const deletePhoto = (id) => {
        state.photos = state.photos.filter(p => p.id !== id);
        saveState();
        renderGallery();
        renderHeroSlideshow();
        renderAdminPhotoList();
    };

    // Render Admin Video list for deletion
    const adminVideoList = document.getElementById('adminVideoList');

    const renderAdminVideoList = () => {
        if (!adminVideoList) return;

        if (state.videos.length === 0) {
            adminVideoList.innerHTML = `<p style="font-style: italic; font-size: 0.85rem;">No videos added yet.</p>`;
            return;
        }

        adminVideoList.innerHTML = state.videos.map(video => `
            <div class="admin-media-item">
                <div class="admin-media-info" style="font-weight: 600;">${video.title}</div>
                <div class="admin-media-actions">
                    <button class="btn btn-outline btn-sm delete-video-btn" data-id="${video.id}" style="color: var(--danger); border-color: var(--danger);">Delete</button>
                </div>
            </div>
        `).join('');

        // Attach delete handlers
        document.querySelectorAll('.delete-video-btn').forEach(btn => {
            btn.onclick = () => {
                const id = parseInt(btn.dataset.id);
                deleteVideo(id);
            };
        });
    };

    const deleteVideo = (id) => {
        state.videos = state.videos.filter(v => v.id !== id);
        saveState();
        renderVideos();
        renderAdminVideoList();
    };

    // Add Photo form submit handler (Base64 file reader)
    const adminPhotoForm = document.getElementById('adminPhotoForm');
    const adminPhotoFeedback = document.getElementById('adminPhotoFeedback');

    if (adminPhotoForm) {
        adminPhotoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fileInput = document.getElementById('admin-photo-file');
            const caption = document.getElementById('admin-photo-caption').value.trim();

            if (fileInput.files.length === 0 || !caption) return;

            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                const base64Url = event.target.result;
                const newPhoto = {
                    id: Date.now(),
                    url: base64Url,
                    caption: caption
                };

                state.photos.push(newPhoto);
                saveState();
                renderGallery();
                renderHeroSlideshow();
                renderAdminPhotoList();

                adminPhotoFeedback.textContent = "Photo added successfully!";
                adminPhotoFeedback.className = "form-feedback success";
                adminPhotoFeedback.style.display = "block";

                adminPhotoForm.reset();
                setTimeout(() => adminPhotoFeedback.style.display = 'none', 3000);
            };

            reader.readAsDataURL(file);
        });
    }

    // Add Video Form handler (YouTube / direct link parser)
    const adminVideoForm = document.getElementById('adminVideoForm');
    const adminVideoFeedback = document.getElementById('adminVideoFeedback');

    if (adminVideoForm) {
        adminVideoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rawUrl = document.getElementById('admin-video-url').value.trim();
            const title = document.getElementById('admin-video-title').value.trim();

            if (!rawUrl || !title) return;

            // YouTube embed URL parsing helper
            let embedUrl = rawUrl;
            if (rawUrl.includes('youtube.com/watch') || rawUrl.includes('youtu.be/')) {
                let videoId = '';
                if (rawUrl.includes('youtube.com/watch')) {
                    const urlParams = new URLSearchParams(new URL(rawUrl).search);
                    videoId = urlParams.get('v');
                } else if (rawUrl.includes('youtu.be/')) {
                    videoId = rawUrl.split('/').pop().split('?')[0];
                }
                if (videoId) {
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                }
            }

            const newVideo = {
                id: Date.now(),
                url: embedUrl,
                title: title,
                desc: "Uploaded Transformation Workout Highlight"
            };

            state.videos.push(newVideo);
            saveState();
            renderVideos();
            renderAdminVideoList();

            adminVideoFeedback.textContent = "Video highlight added successfully!";
            adminVideoFeedback.className = "form-feedback success";
            adminVideoFeedback.style.display = "block";

            adminVideoForm.reset();
            setTimeout(() => adminVideoFeedback.style.display = 'none', 3000);
        });
    }

    // Fallback thumbnail generator for direct mp4 video links
    window.showMockVideoThumbnail = (videoEl, title) => {
        const wrapper = videoEl.parentElement;
        wrapper.innerHTML = `
            <div class="video-thumbnail-placeholder" onclick="playMockDirectVideo(this, '${videoEl.src}')">
                <div class="video-play-btn">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <span class="video-thumbnail-text">Play Video</span>
            </div>
        `;
    };

    window.playMockDirectVideo = (placeholderEl, videoSrc) => {
        const wrapper = placeholderEl.parentElement;
        wrapper.innerHTML = `<video src="${videoSrc}" controls autoplay style="width: 100%; height: 100%;"></video>`;
    };

    /* ==========================================================================
       Initial rendering calls
       ========================================================================== */
    renderTestimonials();
    renderGallery();
    renderVideos();
    renderHeroSlideshow();
});
