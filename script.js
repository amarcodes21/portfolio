// ===== PROJECT DATABASE =====
// Fallback local database structure in case portfolioData is missing
let database = {
    categories: [
        { id: "featured", title: "Continue Exploring" },
        { id: "ai", title: "My AI & ML Universe" },
        { id: "web", title: "Web Development Collection" },
        { id: "all", title: "Popular Projects" },
        { id: "skills", title: "Skills Collection" }
    ],
    items: []
};

// Check if portfolioData is provided from portfolio-data.js
if (typeof portfolioData !== 'undefined') {
    // Map the user's projects into our database format
    database.items = portfolioData.projects.map((p, index) => {
        let rowIds = ["all"];
        if (p.featured) rowIds.push("featured");
        if (p.category.toLowerCase().includes("ai") || p.category.toLowerCase().includes("artificial intelligence") || p.category.toLowerCase().includes("computer vision") || p.category.toLowerCase().includes("machine learning")) {
            rowIds.push("ai");
        }
        if (p.category.toLowerCase().includes("web")) {
            rowIds.push("web");
        }

        return {
            id: "proj-" + index,
            type: "project",
            title: p.title,
            category: p.category,
            rowIds: rowIds,
            shortDesc: p.description,
            problem: p.description,
            features: p.features || [],
            techStack: p.techStack || (portfolioData.skills ? portfolioData.skills.slice(0, 3).join(', ') : ""),
            year: portfolioData.graduationYear || "2024",
            image: p.image || "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
            github: p.github || "#",
            demo: p.demo || "#"
        };
    });

    // Map skills as items
    const skillIconMap = {
        "python": "python",
        "java": "java",
        "sql": "mysql",
        "html": "html",
        "css": "css",
        "javascript": "js",
        "git and github": "github",
        "machine learning": "tensorflow" // placeholder tech icon for ML
    };

    if (portfolioData.skills) {
        portfolioData.skills.forEach((skill, index) => {
            const skillLower = skill.toLowerCase();
            const iconName = skillIconMap[skillLower];

            // If we have a mapped icon, use skillicons.dev, otherwise fallback to text avatar
            const imageUrl = iconName
                ? `https://skillicons.dev/icons?i=${iconName}&theme=dark`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(skill)}&background=141414&color=E50914&size=800&font-size=0.3`;

            database.items.push({
                id: "skill-" + index,
                type: "skill",
                title: skill,
                category: "Skill",
                rowIds: ["skills"],
                shortDesc: `Proficient in ${skill}`,
                image: imageUrl,
            });
        });
    }
}

// ===== DOM ELEMENTS =====
const navbar = document.getElementById('navbar');
const carouselWrapper = document.getElementById('carousel-wrapper');
const heroBg = document.getElementById('hero-bg');

// Modal Elements
const modal = document.getElementById('project-modal');
const modalCloseBtn = document.getElementById('modal-close');
const modalBackdrop = document.getElementById('modal-backdrop');
const mHero = document.getElementById('modal-hero');
const mCategory = document.getElementById('modal-category');
const mTitle = document.getElementById('modal-title');
const mTech = document.getElementById('modal-tech-stack');
const mProblem = document.getElementById('modal-problem');
const mFeaturesGroup = document.getElementById('modal-features-group');
const mFeatures = document.getElementById('modal-features');
const mGithub = document.getElementById('modal-github');
const mDemo = document.getElementById('modal-demo');
const mYear = document.getElementById('modal-year');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    if (typeof portfolioData !== 'undefined') {
        populateUserData();
    }

    buildCarousels();
    setupScrollEffects();
    document.body.style.overflow = 'hidden'; // Lock scrolling during profile selection
});

function populateUserData() {
    // Populate Hero Section
    const titleElem = document.getElementById('hero-title');
    if (titleElem) titleElem.textContent = portfolioData.name;

    const durationElem = document.getElementById('hero-duration');
    if (durationElem) durationElem.textContent = portfolioData.role;

    const yearElem = document.getElementById('hero-year');
    if (yearElem) yearElem.textContent = portfolioData.graduationYear;

    const introElem = document.getElementById('hero-intro');
    if (introElem) introElem.textContent = portfolioData.about;

    // Determine the featured project for hero bg
    const featuredProj = database.items.find(p => p.rowIds.includes('featured') && p.type === 'project');
    if (featuredProj && heroBg) {
        heroBg.style.backgroundImage = `url('${featuredProj.image}')`;
    } else if (heroBg && portfolioData.profileImage) {
        heroBg.style.backgroundImage = `url('${portfolioData.profileImage}')`;
    }

    // Populate About Section
    const aboutRole = document.getElementById('about-role');
    if (aboutRole) aboutRole.textContent = portfolioData.role;

    const aboutText = document.getElementById('about-text');
    if (aboutText) aboutText.textContent = portfolioData.about;

    const profilePic = document.getElementById('about-profile-pic');
    if (profilePic) profilePic.src = portfolioData.profileImage;

    // Contact Buttons
    const contactEmail = document.getElementById('contact-email');
    if (contactEmail && portfolioData.socialLinks.email) contactEmail.href = portfolioData.socialLinks.email;

    const contactGithub = document.getElementById('contact-github');
    if (contactGithub && portfolioData.socialLinks.github) contactGithub.href = portfolioData.socialLinks.github;

    const contactLinkedin = document.getElementById('contact-linkedin');
    if (contactLinkedin && portfolioData.socialLinks.linkedin) contactLinkedin.href = portfolioData.socialLinks.linkedin;

    // Nav Links
    const navGithub = document.getElementById('nav-github');
    if (navGithub && portfolioData.socialLinks.github) navGithub.href = portfolioData.socialLinks.github;

    const navLinkedin = document.getElementById('nav-linkedin');
    if (navLinkedin && portfolioData.socialLinks.linkedin) navLinkedin.href = portfolioData.socialLinks.linkedin;

    const navResume = document.getElementById('nav-resume');
    if (navResume && portfolioData.socialLinks.resume) navResume.href = portfolioData.socialLinks.resume;

    // Footer Links
    const footerGithub = document.getElementById('footer-github');
    if (footerGithub && portfolioData.socialLinks.github) footerGithub.href = portfolioData.socialLinks.github;

    const footerLinkedin = document.getElementById('footer-linkedin');
    if (footerLinkedin && portfolioData.socialLinks.linkedin) footerLinkedin.href = portfolioData.socialLinks.linkedin;

    const footerEmail = document.getElementById('footer-email');
    if (footerEmail && portfolioData.socialLinks.email) footerEmail.href = portfolioData.socialLinks.email;

    const footerName = document.getElementById('footer-name');
    if (footerName) footerName.textContent = portfolioData.name;

    // Populate Stats
    const statsContainer = document.getElementById('creator-stats');
    if (statsContainer && portfolioData.skills) {
        const skillsString = portfolioData.skills.join(', ');
        statsContainer.innerHTML = `
            <div class="stat-group">
                <span class="stat-label">Core Skills & Technologies:</span>
                <span class="stat-value">${skillsString}</span>
            </div>
            <div class="stat-group">
                <span class="stat-label">Education:</span>
                <span class="stat-value">${portfolioData.college} (Class of ${portfolioData.graduationYear})</span>
            </div>
        `;
    }

    // Populate Education
    const eduList = document.getElementById('education-list');
    if (eduList && portfolioData.education) {
        eduList.innerHTML = portfolioData.education.map(edu => `
            <div class="episode-card">
                <h3 class="episode-title">${edu.degree}</h3>
                <p class="episode-meta">${edu.institution} • ${edu.year}</p>
                <p class="episode-synopsis">${edu.details}</p>
            </div>
        `).join('');
    }

    // Populate Achievements
    const achList = document.getElementById('achievements-list');
    if (achList && portfolioData.achievements) {
        achList.innerHTML = portfolioData.achievements.map(ach => `
            <div class="episode-card">
                <h3 class="episode-title">${ach.title}</h3>
                <p class="episode-meta">${ach.year}</p>
                <p class="episode-synopsis">${ach.description}</p>
            </div>
        `).join('');
    }

    // Update Developer Profile Avatar
    const devAvatar = document.querySelector('.avatar-2');
    if (devAvatar && portfolioData.profileImage) {
        devAvatar.style.backgroundImage = `url('${portfolioData.profileImage}')`;
    }
}

// ===== PROFILE SELECTION =====
window.selectProfile = function (profileName) {
    const profileScreen = document.getElementById('profile-selection');
    const appContent = document.getElementById('portfolio-app');

    profileScreen.style.opacity = '0';

    setTimeout(() => {
        profileScreen.style.display = 'none';
        appContent.style.display = 'block';
        document.body.style.overflow = 'auto'; // Unlock scrolling

        // Trigger initial scroll effect calculation
        window.dispatchEvent(new Event('scroll'));
    }, 500);
};

// ===== CAROUSEL GENERATION =====
function buildCarousels() {
    carouselWrapper.innerHTML = '';

    database.categories.forEach(category => {
        const rowItems = database.items.filter(p => p.rowIds.includes(category.id));
        if (rowItems.length === 0) return;

        const rowHTML = `
            <div class="carousel-row">
                <h3 class="carousel-title">${category.title}</h3>
                <div class="carousel-container">
                    <button class="carousel-btn left" aria-label="Scroll left"><i class="fas fa-chevron-left"></i></button>
                    <div class="carousel-track" id="track-${category.id}">
                        ${rowItems.map(item => createPosterHTML(item)).join('')}
                    </div>
                    <button class="carousel-btn right" aria-label="Scroll right"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        `;
        carouselWrapper.insertAdjacentHTML('beforeend', rowHTML);

        setTimeout(() => {
            const track = document.getElementById(`track-${category.id}`);
            const leftBtn = track.parentElement.querySelector('.left');
            const rightBtn = track.parentElement.querySelector('.right');

            // Scroll exact width of visible area to snap perfectly
            leftBtn.addEventListener('click', () => {
                const width = track.clientWidth;
                track.scrollBy({ left: -width, behavior: 'smooth' });
            });
            rightBtn.addEventListener('click', () => {
                const width = track.clientWidth;
                track.scrollBy({ left: width, behavior: 'smooth' });
            });
        }, 0);
    });
}

function createPosterHTML(item) {
    const isProject = item.type === 'project';

    return `
        <div class="poster" tabindex="0" onclick="${isProject ? `openModal('${item.id}')` : ''}" onkeypress="if(event.key === 'Enter' && ${isProject}) openModal('${item.id}')">
            <img src="${item.image}" alt="${item.title}" class="poster-img" loading="lazy">
            <div class="poster-title-overlay">${item.title.split('—')[0]}</div>
            
            <div class="poster-hover-details">
                <div class="hover-img-wrapper">
                    <img src="${item.image}" alt="Backdrop">
                </div>
                <div class="hover-content">
                    ${isProject ? `
                    <div class="hover-actions-mini">
                        <button class="btn-mini"><i class="fas fa-play"></i></button>
                        <button class="btn-mini outline"><i class="fas fa-plus"></i></button>
                        <button class="btn-mini outline" style="margin-left:auto;"><i class="fas fa-chevron-down"></i></button>
                    </div>` : ''}
                    <div class="hover-meta">
                        <span class="match-score">99% Match</span>
                        <span class="rating">DEV</span>
                    </div>
                    <div class="hover-tech">
                        <span>${item.category}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== MODAL LOGIC (TITLE DETAILS) =====
window.openModal = function (id) {
    const proj = database.items.find(p => p.id === id);
    if (!proj || proj.type !== 'project') return;

    mHero.style.backgroundImage = `url(${proj.image})`;
    mCategory.textContent = proj.category;
    mTitle.textContent = proj.title.split('—')[0];
    mYear.textContent = proj.year;

    mTech.textContent = proj.techStack;

    mProblem.textContent = proj.problem;

    if (proj.features && proj.features.length > 0) {
        mFeaturesGroup.style.display = 'block';
        mFeatures.innerHTML = proj.features.map(f => `<li>${f}</li>`).join('');
    } else {
        mFeaturesGroup.style.display = 'none';
    }

    mGithub.href = proj.github;
    mDemo.href = proj.demo;

    mGithub.style.display = (proj.github && proj.github !== '#') ? 'inline-flex' : 'none';
    mDemo.style.display = (proj.demo && proj.demo !== '#') ? 'inline-flex' : 'none';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

modalCloseBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ===== SCROLL EFFECTS & PARALLAX =====
function setupScrollEffects() {
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => revealObserver.observe(reveal));

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        if (scrolled > 5) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrolled < window.innerHeight && heroBg) {
            // Very subtle parallax so it doesn't break immersion
            heroBg.style.transform = `translateY(${scrolled * 0.2}px) scale(1.05)`;
        }
    });
}
