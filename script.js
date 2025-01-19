// Mouse position tracking utility
class MouseTracker {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.listeners = new Set();
        
        window.addEventListener('mousemove', (e) => {
            this.position = { x: e.clientX, y: e.clientY };
            this.notifyListeners();
        });
    }

    addListener(callback) {
        this.listeners.add(callback);
    }

    removeListener(callback) {
        this.listeners.delete(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.position));
    }
}

// Social Card Component
class SocialCard {
    constructor(profile) {
        this.profile = profile;
        this.selectedAccount = 0;
        this.mouseTracker = new MouseTracker();
        this.element = this.createCardElement();
        this.isAnimating = false;
        this.setupEventListeners();
        this.setupInteractivity();
        this.setupEnhancedInteractivity();
    }

    createCardElement() {
        const template = document.getElementById('socialCardTemplate');
        const card = template.content.cloneNode(true).querySelector('.social-card');
        this.updateCardContent(card);
        return card;
    }

    updateCardContent(card) {
        const currentAccount = this.profile.accounts[this.selectedAccount];
        const currentAccentColor = this.profile.accentColors[this.selectedAccount];
        const currentSecondaryColor = this.profile.secondaryColors[this.selectedAccount];

        // Update icon
        const icon = card.querySelector('.icon-container i');
        icon.setAttribute('data-lucide', this.profile.platform.toLowerCase());
        icon.style.color = `rgb(${currentAccentColor})`;
        icon.style.transition = 'transform 0.3s ease';

        // Update account switcher
        if (this.profile.accounts.length > 1) {
            const switcherButton = card.querySelector('.account-switch-button');
            switcherButton.innerHTML = `
                ${this.profile.platform} (${this.selectedAccount + 1}/${this.profile.accounts.length})
                <i data-lucide="chevron-right"></i>
            `;
            
            const accountMenu = card.querySelector('.account-menu');
            accountMenu.innerHTML = this.profile.accounts.map((account, index) => `
                <button class="account-option ${index === this.selectedAccount ? 'active' : ''}"
                        data-index="${index}">
                    @${account.username}
                </button>
            `).join('');
        } else {
            card.querySelector('.account-switcher').style.display = 'none';
        }

        // Update profile info with animation
        const username = card.querySelector('.username');
        const bio = card.querySelector('.bio');
        
        username.style.opacity = '0';
        bio.style.opacity = '0';
        
        setTimeout(() => {
            username.textContent = `@${currentAccount.username}`;
            bio.textContent = currentAccount.bio || '';
            
            username.style.opacity = '1';
            bio.style.opacity = '1';
        }, 300);

        // Update profile link with enhanced styling
        const profileLink = card.querySelector('.profile-link');
        profileLink.href = currentAccount.link;
        profileLink.style.backgroundColor = `rgba(${currentSecondaryColor}, 0.1)`;
        profileLink.style.color = `rgb(${currentAccentColor})`;
        profileLink.style.transform = 'translateZ(0)';

        // Update ambient light with animation
        const ambientLight = card.querySelector('.ambient-light');
        ambientLight.style.background = `linear-gradient(45deg, 
            rgba(${currentAccentColor}, 0.4) 0%, 
            rgba(${currentSecondaryColor}, 0.4) 100%)`;

        // Initialize Lucide icons with animation
        lucide.createIcons({
            attrs: {
                class: 'w-4 h-4 transition-transform duration-300'
            }
        });
    }

    setupEventListeners() {
        // Mouse hover effects
        this.element.addEventListener('mouseenter', () => {
            this.mouseTracker.addListener(this.handleMouseMove.bind(this));
            this.element.classList.add('card-hover');
        });

        this.element.addEventListener('mouseleave', () => {
            this.mouseTracker.removeListener(this.handleMouseMove.bind(this));
            this.resetGradient();
            this.element.classList.remove('card-hover');
        });

        // Account switcher with animation
        const switcherButton = this.element.querySelector('.account-switch-button');
        if (switcherButton) {
            switcherButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const menu = this.element.querySelector('.account-menu');
                menu.classList.toggle('visible');
                this.createRipple(e);
            });
        }

        // Account menu options with smooth transition
        const accountMenu = this.element.querySelector('.account-menu');
        if (accountMenu) {
            accountMenu.addEventListener('click', (e) => {
                const option = e.target.closest('.account-option');
                if (option) {
                    this.smoothAccountTransition(parseInt(option.dataset.index));
                    this.createRipple(e);
                }
            });
        }

        // Close account menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.element.contains(e.target)) {
                const menu = this.element.querySelector('.account-menu');
                if (menu) menu.classList.remove('visible');
            }
        });
    }

    setupInteractivity() {
        // Add ripple effect for all clickable elements
        const clickableElements = this.element.querySelectorAll('button, a');
        clickableElements.forEach(element => {
            element.addEventListener('click', this.createRipple.bind(this));
        });

        // Add hover interactions for icon
        const icon = this.element.querySelector('.icon-container');
        icon.addEventListener('mouseover', () => this.wobbleAnimation(icon));

        // Add interactive profile link
        const profileLink = this.element.querySelector('.profile-link');
        profileLink.addEventListener('mouseover', () => this.pulseAnimation(profileLink));

        // Add hover sound effect
        this.element.addEventListener('mouseenter', () => this.playHoverSound());
    }

    setupEnhancedInteractivity() {
        // 3D Tilt Effect
        this.element.addEventListener('mousemove', (e) => {
            if (this.isAnimating) return;
            
            const rect = this.element.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const tiltX = (y - 0.5) * 20;
            const tiltY = (x - 0.5) * -20;
            
            this.element.style.transform = 
                `perspective(1000px) 
                 rotateX(${tiltX}deg) 
                 rotateY(${tiltY}deg) 
                 scale3d(1.05, 1.05, 1.05)`;
        });

        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = 'none';
        });

        // Smooth Account Switching Animation
        const switcherButton = this.element.querySelector('.account-switch-button');
        if (switcherButton) {
            switcherButton.addEventListener('click', () => {
                this.element.classList.add('switching');
                setTimeout(() => {
                    this.element.classList.remove('switching');
                }, 500);
            });
        }

        // Interactive Icons
        const icon = this.element.querySelector('.icon-container');
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2) rotate(5deg)';
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    handleMouseMove(position) {
        if (!this.isAnimating) {
            const rect = this.element.getBoundingClientRect();
            const x = ((position.x - rect.left) / rect.width) * 100;
            const y = ((position.y - rect.top) / rect.height) * 100;
            this.updateGradient(x, y);
        }
    }

    updateGradient(x, y) {
        const currentAccentColor = this.profile.accentColors[this.selectedAccount];
        const currentSecondaryColor = this.profile.secondaryColors[this.selectedAccount];
        
        this.element.style.background = `
            radial-gradient(circle at ${x}% ${y}%, 
                rgba(${currentAccentColor}, 0.2) 0%, 
                rgba(17, 24, 39, 0.95) 50%),
            linear-gradient(
                45deg,
                rgba(${currentAccentColor}, 0.1) 0%,
                rgba(${currentSecondaryColor}, 0.1) 100%
            )
        `;
    }

    resetGradient() {
        this.element.style.background = '';
    }

    createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    wobbleAnimation(element) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        element.style.animation = 'wobble 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
            this.isAnimating = false;
        }, 500);
    }

    pulseAnimation(element) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        element.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
            this.isAnimating = false;
        }, 500);
    }

    smoothAccountTransition(newIndex) {
        if (newIndex === this.selectedAccount) return;

        this.isAnimating = true;
        this.element.style.opacity = '0';
        
        setTimeout(() => {
            this.selectedAccount = newIndex;
            this.updateCardContent(this.element);
            this.element.style.opacity = '1';
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 300);
        }, 300);
    }

    playHoverSound() {
        // Create a subtle hover sound effect
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        gainNode.gain.value = 0.1;
        oscillator.frequency.value = 400;
        oscillator.type = 'sine';

        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.1);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Social Media Profiles Data
const profiles = [
    {
        platform: 'GitHub',
        accounts: [
            {
                username: 'ohaviii',
                link: 'https://github.com/ohaviii',
                bio: 'Developer & Open Source Enthusiast 💻'
            }
        ],
        accentColors: ['147, 51, 234'],
        secondaryColors: ['168, 85, 247']
    },
    {
        platform: 'Instagram',
        accounts: [
            {
                username: 'oh.aviii',
                link: 'https://www.instagram.com/oh.aviii',
                bio: 'Personal Life & Adventures 📸'
            },
            {
                username: 'av.eeiii',
                link: 'https://www.instagram.com/av.eeiii',
                bio: 'Work & Creative Portfolio ✨'
            }
        ],
        accentColors: ['225, 48, 108', '245, 96, 64'],
        secondaryColors: ['193, 53, 132', '226, 119, 95']
    },
    {
        platform: 'YouTube',
        accounts: [
            {
                username: 'Lyrical Pills Hindi',
                link: 'https://www.youtube.com/@LyricalPills',
                bio: 'Music & Lyrics | Creative Content 🎵'
            },
            {
                username: 'SNEH',
                link: 'https://www.youtube.com/@Sneeehhhh',
                bio: 'Personal Channel & Vlogs 🎥'
            }
        ],
        accentColors: ['255, 0, 0', '230, 33, 23'],
        secondaryColors: ['200, 0, 0', '180, 32, 23']
    },
    {
        platform: 'LinkedIn',
        accounts: [
            {
                username: 'Abhinav Kumar',
                link: 'https://www.linkedin.com/in/avi-kr/',
                bio: 'Professional Network & Updates 💼'
            }
        ],
        accentColors: ['10, 102, 194'],
        secondaryColors: ['40, 123, 222']
    },
    {
        platform: 'Pinterest',
        accounts: [
            {
                username: 'AVI',
                link: 'https://in.pinterest.com/oh_avi/_profile/',
                bio: 'Visual Inspiration & Ideas 🎨'
            }
        ],
        accentColors: ['230, 0, 35'],
        secondaryColors: ['200, 0, 35']
    },
    {
        platform: 'Facebook',
        accounts: [
            {
                username: 'Avi',
                link: 'https://facebook.com/dummy-profile',
                bio: 'Connecting & Sharing 🌟'
            }
        ],
        accentColors: ['66, 103, 178'],
        secondaryColors: ['88, 120, 188']
    }
];

// Initialize the showcase with staggered animation
function initializeSocialMediaShowcase() {
    const container = document.getElementById('socialMediaContainer');
    
    profiles.forEach((profile, index) => {
        setTimeout(() => {
            const card = new SocialCard(profile);
            card.element.style.opacity = '0';
            container.appendChild(card.element);
            
            // Trigger entrance animation
            requestAnimationFrame(() => {
                card.element.style.opacity = '1';
                card.element.classList.add('loading');
            });
        }, index * 200); // Stagger the entrance of each card
    });
}

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSocialMediaShowcase);

// Add a timestamp to show when the page was last updated
const timestamp = document.createElement('div');
timestamp.className = 'timestamp';
timestamp.textContent = `Last updated: ${new Date().toUTCString()}`;
document.body.appendChild(timestamp);

// Add a floating cursor effect (optional enhancement)
const cursor = document.createElement('div');
cursor.className = 'floating-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    const activeCard = document.querySelector('.social-card:hover');
    if (!activeCard) return;

    const card = activeCard.__cardInstance;
    if (!card || !card.profile.accounts.length > 1) return;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const currentIndex = card.selectedAccount;
        const totalAccounts = card.profile.accounts.length;
        
        let newIndex;
        if (e.key === 'ArrowLeft') {
            newIndex = (currentIndex - 1 + totalAccounts) % totalAccounts;
        } else {
            newIndex = (currentIndex + 1) % totalAccounts;
        }
        
        card.smoothAccountTransition(newIndex);
    }
});

// Add resize handler for responsive adjustments
window.addEventListener('resize', () => {
    const cards = document.querySelectorAll('.social-card');
    cards.forEach(card => {
        // Reset any transform styles on resize
        card.style.transform = 'none';
    });
});

// Add error handling for failed resource loading
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT') {
        console.error('Resource failed to load:', e.target.src);
        // You could implement a fallback here if needed
    }
}, true);