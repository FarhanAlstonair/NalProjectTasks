// NAL India Property Management System JavaScript

// Global State
let currentStep = 1;
let currentPropertyId = null;
let editingProperty = false;
let formData = {};
let uploadedImages = [];
let properties = [];
let deletePropertyId = null;
let autoSaveInterval = null;
let currentBiddingProperty = null;
let biddingTimer = null;
let timeLeft = 10; // 10 seconds for demo

// Sample Properties Data
const sampleProperties = [
    {
        id: 1,
        title: "Modern 4BHK Villa",
        address: "456 Oak Avenue, Mumbai, Maharashtra",
        city: "Mumbai",
        state: "Maharashtra",
        zipCode: "400001",
        propertyType: "villa",
        beds: 4,
        baths: 3,
        area: 2400,
        price: 12000000,
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80",
        status: "active",
        badges: ["SALE", "ACTIVE", "URGENT SALE", "BIDDING"],
        biddingEnabled: true,
        urgentSale: true,
        isDraft: false,
        listingIntent: "urgent-sale",
        amenities: ["parking", "gym", "pool", "security"],
        yearBuilt: 2020,
        possession: "immediate",
        images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80"]
    },
    {
        id: 2,
        title: "Luxury 2BHK Apartment",
        address: "789 Marine Drive, Mumbai, Maharashtra",
        city: "Mumbai", 
        state: "Maharashtra",
        zipCode: "400002",
        propertyType: "apartment",
        beds: 2,
        baths: 2,
        area: 1200,
        price: 8500000,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
        status: "active",
        badges: ["SALE", "ACTIVE"],
        biddingEnabled: false,
        urgentSale: false,
        isDraft: false,
        listingIntent: "sale",
        amenities: ["parking", "gym"],
        yearBuilt: 2021,
        possession: "3months",
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80"]
    },
    {
        id: 3,
        title: "3BHK Family Home",
        address: "321 Park Street, Delhi",
        city: "New Delhi",
        state: "Delhi", 
        zipCode: "110001",
        propertyType: "apartment",
        beds: 3,
        baths: 2,
        area: 1800,
        price: 9500000,
        image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=900&q=80",
        status: "sold",
        badges: ["SOLD"],
        biddingEnabled: false,
        urgentSale: false,
        isDraft: false,
        listingIntent: "sale",
        amenities: ["parking", "garden"],
        yearBuilt: 2019,
        possession: "immediate",
        images: ["https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=900&q=80"]
    },
    {
        id: 4,
        title: "Commercial Office Space",
        address: "123 Business Park, Bangalore",
        city: "Bengaluru",
        state: "Karnataka",
        zipCode: "560001", 
        propertyType: "commercial",
        beds: 0,
        baths: 4,
        area: 3000,
        price: 15000000,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
        status: "draft",
        badges: ["DRAFT"],
        biddingEnabled: false,
        urgentSale: false,
        isDraft: true,
        listingIntent: "sale",
        amenities: ["parking", "elevator", "security"],
        yearBuilt: 2022,
        possession: "6months",
        images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80"]
    },
    {
        id: 5,
        title: "Penthouse Suite",
        address: "555 Skyline Avenue, Pune",
        city: "Pune",
        state: "Maharashtra",
        zipCode: "411001",
        propertyType: "apartment", 
        beds: 5,
        baths: 4,
        area: 4500,
        price: 25000000,
        image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80",
        status: "active",
        badges: ["SALE", "ACTIVE", "BIDDING"],
        biddingEnabled: true,
        urgentSale: false,
        isDraft: false,
        listingIntent: "sale",
        amenities: ["parking", "gym", "pool", "clubhouse"],
        yearBuilt: 2023,
        possession: "immediate",
        images: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80"]
    }
];

// Sample Bids Data
const sampleBids = [
    {bidderId: 1, bidderName: "Alice Kumar", deposit: 200000, amount: 7250000, timestamp: "2025-08-22T10:30:00", email: "alice@example.com", profile: "#"},
    {bidderId: 2, bidderName: "Bob Singh", deposit: 150000, amount: 7100000, timestamp: "2025-08-22T09:45:00", email: "bob@example.com", profile: "#"},
    {bidderId: 3, bidderName: "Charlie Rao", deposit: 150000, amount: 7000000, timestamp: "2025-08-21T15:20:00", email: "charlie@example.com", profile: "#"},
    {bidderId: 4, bidderName: "David Mehta", deposit: 100000, amount: 6950000, timestamp: "2025-08-20T14:10:00", email: "david@example.com", profile: "#"},
    {bidderId: 5, bidderName: "Eva Sharma", deposit: 100000, amount: 6900000, timestamp: "2025-08-19T17:55:00", email: "eva@example.com", profile: "#"}
];

// States and Cities Data
const statesAndCities = {
    "Karnataka": ["Bengaluru", "Mysore", "Mangalore", "Hubli", "Other"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Other"],
    "Maharashtra": ["Mumbai", "Pune", "Nashik", "Aurangabad", "Other"],
    "Delhi": ["New Delhi", "Central Delhi", "South Delhi", "North Delhi", "Other"]
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadProperties();
    setupEventListeners();
    showView('dashboard');
    
    // Setup auto-save
    setupAutoSave();
    
    // Load draft if exists
    const draft = localStorage.getItem('propertyDraft');
    if (draft) {
        console.log('Draft found in localStorage');
    }
});

// Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = e.currentTarget.getAttribute('data-view');
            showView(view);
            
            // Update active nav
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            filterPropertiesByStatus(e.target.dataset.status);
        });
    });

    // State change handler
    document.getElementById('state').addEventListener('change', updateCities);

    // Image upload handler
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

    // Search handler
    document.getElementById('searchInput').addEventListener('input', filterProperties);

    // Form validation on input
    setupFormValidation();
}

// View Management
function showView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });
    
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.add('active');
        targetView.classList.remove('hidden');
        
        // Load data for specific views
        if (viewName === 'dashboard') {
            renderPropertiesGrid();
        } else if (viewName === 'properties') {
            renderPropertiesTable();
        } else if (viewName === 'bidding') {
            renderBiddingDashboard();
        }
    }
}

// Property Loading and Management
function loadProperties() {
    const savedProperties = localStorage.getItem('nalIndiaProperties');
    if (savedProperties) {
        properties = JSON.parse(savedProperties);
    } else {
        // Load sample data
        properties = [...sampleProperties];
        saveProperties();
    }
}

function saveProperties() {
    localStorage.setItem('nalIndiaProperties', JSON.stringify(properties));
}

function renderPropertiesGrid() {
    const grid = document.getElementById('propertiesGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (properties.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    grid.innerHTML = properties.map(property => `
        <div class="property-card" data-id="${property.id}">
            <div class="property-image">
                ${property.images && property.images.length > 0 
                    ? `<img src="${property.images[0]}" alt="${property.title}">`
                    : '<i class="fas fa-image" style="font-size: 2rem; color: #94a3b8;"></i>'
                }
                <div class="property-badges">
                    ${generateBadges(property)}
                </div>
            </div>
            <div class="property-content">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-address">${property.address}</p>
                <div class="property-details">
                    <span><i class="fas fa-bed"></i> ${property.beds || 0}</span>
                    <span><i class="fas fa-bath"></i> ${property.baths || 0}</span>
                    <span><i class="fas fa-ruler-combined"></i> ${property.area || 0} sq ft</span>
                </div>
                <div class="property-price">₹${formatPrice(property.price)}</div>
                <div class="property-actions">
                    ${property.biddingEnabled ? `<button class="btn-bidding" onclick="showBiddingDashboard(${property.id})">Bidding</button>` : ''}
                    <button class="btn btn--sm btn--outline" onclick="editProperty('${property.id}')">Edit</button>
                    <button class="btn-icon delete" onclick="showDeleteModal('${property.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function generateBadges(property) {
    let badges = [];
    
    if (property.listingIntent === 'sale') badges.push('<span class="property-badge badge-sale">SALE</span>');
    if (property.status === 'active') badges.push('<span class="property-badge badge-active">ACTIVE</span>');
    if (property.urgentSale) badges.push('<span class="property-badge badge-urgent">URGENT SALE</span>');
    if (property.biddingEnabled) badges.push('<span class="property-badge badge-bidding">BIDDING</span>');
    if (property.status === 'draft') badges.push('<span class="property-badge badge-draft">DRAFT</span>');
    if (property.status === 'sold') badges.push('<span class="property-badge badge-sold">SOLD</span>');
    
    return badges.join('');
}

function renderPropertiesTable() {
    const tbody = document.getElementById('propertiesTableBody');
    
    tbody.innerHTML = properties.map(property => `
        <tr>
            <td>
                <div>
                    <strong>${property.title}</strong><br>
                    <small class="text-secondary">${property.address}</small>
                </div>
            </td>
            <td>${property.propertyType}</td>
            <td>₹${formatPrice(property.price)}</td>
            <td><span class="property-status status-${property.status}">${property.status.charAt(0).toUpperCase() + property.status.slice(1)}</span></td>
            <td>
                <button class="btn btn--sm btn--outline" onclick="editProperty('${property.id}')">Edit</button>
                <button class="btn-icon delete" onclick="showDeleteModal('${property.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Bidding Dashboard Functions
function showBiddingDashboard(propertyId) {
    currentBiddingProperty = properties.find(p => p.id == propertyId);
    if (!currentBiddingProperty) return;
    
    showView('bidding');
    timeLeft = 10; // Reset timer to 10 seconds for demo
    startBiddingTimer();
    
    document.getElementById('biddingPropertyTitle').textContent = currentBiddingProperty.title;
    renderBidsTable();
}

function renderBiddingDashboard() {
    if (currentBiddingProperty) {
        document.getElementById('biddingPropertyTitle').textContent = currentBiddingProperty.title;
        renderBidsTable();
        if (!biddingTimer) {
            startBiddingTimer();
        }
    }
}

function startBiddingTimer() {
    const timerDisplay = document.getElementById('countdownTimer');
    const timerStatus = document.getElementById('timerStatus');
    
    biddingTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerDisplay.innerHTML = `
            <span class="timer-digit">${minutes.toString().padStart(2, '0')}</span>:
            <span class="timer-digit">${seconds.toString().padStart(2, '0')}</span>
        `;
        
        if (timeLeft <= 0) {
            clearInterval(biddingTimer);
            biddingTimer = null;
            timerStatus.textContent = 'Bidding Ended';
            timerStatus.classList.add('timer-ended');
            
            // Show toast notification
            showToast('Bidding has ended! Property status updated.', 'success');
            
            // Update property status
            if (currentBiddingProperty) {
                currentBiddingProperty.status = 'sold';
                currentBiddingProperty.biddingEnabled = false;
                saveProperties();
                renderPropertiesGrid();
            }
        }
        
        timeLeft--;
    }, 1000);
}

function renderBidsTable() {
    const tbody = document.getElementById('bidsTableBody');
    const sortedBids = [...sampleBids].sort((a, b) => b.amount - a.amount);
    
    tbody.innerHTML = sortedBids.map((bid, index) => `
        <tr>
            <td>
                <div class="bidder-name">${bid.bidderName}</div>
                <div class="bidder-email">${bid.email}</div>
            </td>
            <td>₹${formatPrice(bid.deposit)}</td>
            <td class="bid-amount">₹${formatPrice(bid.amount)}</td>
            <td>${formatDateTime(bid.timestamp)}</td>
            <td>
                <button class="btn-profile" onclick="showBidderProfile(${bid.bidderId})">View Profile</button>
            </td>
        </tr>
    `).join('');
}

function showBidderProfile(bidderId) {
    const bidder = sampleBids.find(b => b.bidderId === bidderId);
    if (!bidder) return;
    
    const modal = document.getElementById('bidderModal');
    const content = document.getElementById('bidderProfileContent');
    
    content.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #10b981); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: white; font-size: 2rem; font-weight: bold;">
                ${bidder.bidderName.charAt(0)}
            </div>
            <h3>${bidder.bidderName}</h3>
            <p class="text-secondary">${bidder.email}</p>
        </div>
        <div class="review-content">
            <div class="review-item">
                <span class="review-label">Bid Amount:</span>
                <span class="review-value">₹${formatPrice(bidder.amount)}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Deposit:</span>
                <span class="review-value">₹${formatPrice(bidder.deposit)}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Bid Time:</span>
                <span class="review-value">${formatDateTime(bidder.timestamp)}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Status:</span>
                <span class="review-value">Active Bidder</span>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closeBidderModal() {
    document.getElementById('bidderModal').classList.add('hidden');
}

// Form Wizard Functions
function showFormWizard(propertyId = null) {
    const modal = document.getElementById('formWizardModal');
    const title = document.getElementById('wizardTitle');
    
    currentPropertyId = propertyId;
    editingProperty = !!propertyId;
    
    if (editingProperty) {
        title.textContent = 'Edit Property';
        loadPropertyForEdit(propertyId);
    } else {
        title.textContent = 'Add New Property';
        resetForm();
        loadDraft();
    }
    
    modal.classList.remove('hidden');
    currentStep = 1;
    showStep(1);
    updateProgressBar();
}

function closeFormWizard() {
    const modal = document.getElementById('formWizardModal');
    modal.classList.add('hidden');
    resetForm();
    clearAutoSave();
}

function resetForm() {
    formData = {};
    uploadedImages = [];
    currentStep = 1;
    editingProperty = false;
    currentPropertyId = null;
    
    // Reset all form fields
    document.querySelectorAll('input, select, textarea').forEach(field => {
        if (field.type === 'checkbox' || field.type === 'radio') {
            field.checked = false;
        } else {
            field.value = '';
        }
    });
    
    // Clear image preview
    document.getElementById('imagePreviewGrid').innerHTML = '';
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(stepEl => {
        stepEl.classList.remove('active');
        stepEl.classList.add('hidden');
    });
    
    // Show current step
    const currentStepEl = document.getElementById(`step${step}`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
        currentStepEl.classList.remove('hidden');
    }
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        stepEl.classList.remove('active', 'completed');
        if (index + 1 < step) {
            stepEl.classList.add('completed');
        } else if (index + 1 === step) {
            stepEl.classList.add('active');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.style.display = step > 1 ? 'block' : 'none';
    
    if (step === 6) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
        populateReviewSection();
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
    
    currentStep = step;
    updateProgressBar();
}

function nextStep() {
    if (validateStep(currentStep)) {
        saveStepData(currentStep);
        if (currentStep < 6) {
            showStep(currentStep + 1);
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        saveStepData(currentStep);
        showStep(currentStep - 1);
    }
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const percentage = (currentStep / 6) * 100;
    progressFill.style.width = `${percentage}%`;
}

function validateStep(step) {
    let isValid = true;
    let errorMessages = [];
    
    switch(step) {
        case 1:
            const title = document.getElementById('propertyTitle').value;
            const type = document.getElementById('propertyType').value;
            const address = document.getElementById('address').value;
            const area = document.getElementById('area').value;
            const price = document.getElementById('price').value;
            
            if (!title) errorMessages.push('Property title is required');
            if (!type) errorMessages.push('Property type is required');
            if (!address) errorMessages.push('Address is required');
            if (!area) errorMessages.push('Area is required');
            if (!price) errorMessages.push('Price is required');
            break;
            
        case 3:
            const intent = document.querySelector('input[name="listingIntent"]:checked');
            if (!intent) errorMessages.push('Please select listing intent');
            break;
            
        case 4:
            const state = document.getElementById('state').value;
            const city = document.getElementById('city').value;
            if (!state) errorMessages.push('State is required');
            if (!city) errorMessages.push('City is required');
            break;
            
        case 6:
            const declaration = document.getElementById('declaration').checked;
            if (!declaration) errorMessages.push('Please accept the declaration');
            break;
    }
    
    if (errorMessages.length > 0) {
        showToast(errorMessages.join(', '), 'error');
        isValid = false;
    }
    
    return isValid;
}

function saveStepData(step) {
    switch(step) {
        case 1:
            formData.title = document.getElementById('propertyTitle').value;
            formData.propertyType = document.getElementById('propertyType').value;
            formData.address = document.getElementById('address').value;
            formData.zipCode = document.getElementById('zipCode').value;
            formData.beds = parseInt(document.getElementById('bedrooms').value) || 0;
            formData.baths = parseInt(document.getElementById('bathrooms').value) || 0;
            formData.area = parseInt(document.getElementById('area').value) || 0;
            formData.price = parseInt(document.getElementById('price').value) || 0;
            formData.yearBuilt = parseInt(document.getElementById('yearBuilt').value) || null;
            formData.possession = document.getElementById('possession').value;
            break;
            
        case 2:
            // Document files would be handled here in a real app
            break;
            
        case 3:
            const intent = document.querySelector('input[name="listingIntent"]:checked');
            formData.listingIntent = intent ? intent.value : '';
            formData.biddingEnabled = document.getElementById('enableBidding').checked;
            formData.urgentSale = intent ? intent.value === 'urgent-sale' : false;
            break;
            
        case 4:
            formData.state = document.getElementById('state').value;
            formData.city = document.getElementById('city').value;
            
            // Get selected amenities
            const amenities = [];
            document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                if (cb.value !== 'enableBidding') { // Exclude the bidding checkbox
                    amenities.push(cb.value);
                }
            });
            formData.amenities = amenities;
            break;
            
        case 5:
            formData.images = uploadedImages;
            break;
    }
}

function populateReviewSection() {
    const reviewContent = document.getElementById('reviewContent');
    
    // Save current step data
    saveStepData(currentStep - 1);
    
    reviewContent.innerHTML = `
        <div class="review-item">
            <span class="review-label">Property Title:</span>
            <span class="review-value">${formData.title || '-'}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Type:</span>
            <span class="review-value">${formData.propertyType || '-'}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Address:</span>
            <span class="review-value">${formData.address || '-'}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Location:</span>
            <span class="review-value">${formData.city || '-'}, ${formData.state || '-'}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Area:</span>
            <span class="review-value">${formData.area || 0} sq ft</span>
        </div>
        <div class="review-item">
            <span class="review-label">Price:</span>
            <span class="review-value">₹${formatPrice(formData.price || 0)}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Bedrooms/Bathrooms:</span>
            <span class="review-value">${formData.beds || 0}/${formData.baths || 0}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Listing Intent:</span>
            <span class="review-value">${formData.listingIntent || '-'}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Bidding Enabled:</span>
            <span class="review-value">${formData.biddingEnabled ? 'Yes' : 'No'}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Images:</span>
            <span class="review-value">${uploadedImages.length} image(s)</span>
        </div>
        <div class="review-item">
            <span class="review-label">Amenities:</span>
            <span class="review-value">${formData.amenities?.join(', ') || 'None'}</span>
        </div>
    `;
}

// Image Handling
function handleImageUpload(event) {
    const files = event.target.files;
    
    if (uploadedImages.length + files.length > 5) {
        showToast('Maximum 5 images allowed', 'error');
        return;
    }
    
    for (let file of files) {
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            showToast('Image size should be less than 2MB', 'error');
            continue;
        }
        
        if (!file.type.startsWith('image/')) {
            showToast('Please select only image files', 'error');
            continue;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = {
                id: Date.now() + Math.random(),
                url: e.target.result,
                name: file.name,
                size: file.size
            };
            
            uploadedImages.push(imageData);
            renderImagePreviews();
        };
        reader.readAsDataURL(file);
    }
}

function renderImagePreviews() {
    const grid = document.getElementById('imagePreviewGrid');
    
    grid.innerHTML = uploadedImages.map((image, index) => `
        <div class="image-preview ${index === 0 ? 'cover' : ''}" draggable="true" data-index="${index}">
            <img src="${image.url}" alt="${image.name}">
            <button class="image-preview-overlay" onclick="removeImage(${index})">×</button>
            ${index === 0 ? '<div class="cover-badge">Cover Photo</div>' : ''}
        </div>
    `).join('');
    
    // Add drag and drop functionality
    setupImageDragDrop();
}

function setupImageDragDrop() {
    const previews = document.querySelectorAll('.image-preview');
    
    previews.forEach(preview => {
        preview.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.index);
            e.target.classList.add('dragging');
        });
        
        preview.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
        
        preview.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        preview.addEventListener('drop', (e) => {
            e.preventDefault();
            const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const dropIndex = parseInt(e.target.closest('.image-preview').dataset.index);
            
            if (dragIndex !== dropIndex) {
                reorderImages(dragIndex, dropIndex);
            }
        });
    });
}

function reorderImages(fromIndex, toIndex) {
    const [movedImage] = uploadedImages.splice(fromIndex, 1);
    uploadedImages.splice(toIndex, 0, movedImage);
    renderImagePreviews();
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    renderImagePreviews();
}

// State and City Management
function updateCities() {
    const stateSelect = document.getElementById('state');
    const citySelect = document.getElementById('city');
    const selectedState = stateSelect.value;
    
    // Clear cities
    citySelect.innerHTML = '<option value="">Select City</option>';
    
    if (selectedState && statesAndCities[selectedState]) {
        statesAndCities[selectedState].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

// Property CRUD Operations
function editProperty(propertyId) {
    showFormWizard(propertyId);
}

function loadPropertyForEdit(propertyId) {
    const property = properties.find(p => p.id == propertyId);
    if (!property) return;
    
    // Populate form fields
    document.getElementById('propertyTitle').value = property.title || '';
    document.getElementById('propertyType').value = property.propertyType || '';
    document.getElementById('address').value = property.address || '';
    document.getElementById('zipCode').value = property.zipCode || '';
    document.getElementById('bedrooms').value = property.beds || '';
    document.getElementById('bathrooms').value = property.baths || '';
    document.getElementById('area').value = property.area || '';
    document.getElementById('price').value = property.price || '';
    document.getElementById('yearBuilt').value = property.yearBuilt || '';
    document.getElementById('possession').value = property.possession || '';
    document.getElementById('state').value = property.state || '';
    
    // Update cities and set city
    updateCities();
    setTimeout(() => {
        document.getElementById('city').value = property.city || '';
    }, 100);
    
    // Set listing intent
    if (property.listingIntent) {
        const intentRadio = document.querySelector(`input[name="listingIntent"][value="${property.listingIntent}"]`);
        if (intentRadio) intentRadio.checked = true;
    }
    
    // Set bidding enabled
    document.getElementById('enableBidding').checked = property.biddingEnabled || false;
    
    // Set amenities
    if (property.amenities) {
        property.amenities.forEach(amenity => {
            const checkbox = document.querySelector(`input[type="checkbox"][value="${amenity}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    // Load images
    uploadedImages = property.images?.map(url => ({
        id: Date.now() + Math.random(),
        url: url,
        name: 'existing-image.jpg',
        size: 0
    })) || [];
    
    renderImagePreviews();
}

function submitProperty() {
    if (!validateStep(6)) return;
    
    saveStepData(6);
    
    const propertyData = {
        id: currentPropertyId || Date.now(),
        ...formData,
        images: uploadedImages.map(img => img.url),
        status: editingProperty ? (properties.find(p => p.id == currentPropertyId)?.status || 'active') : 'active',
        isDraft: false,
        badges: []
    };
    
    // Generate badges based on property data
    if (propertyData.listingIntent === 'sale') propertyData.badges.push('SALE');
    if (propertyData.status === 'active') propertyData.badges.push('ACTIVE');
    if (propertyData.urgentSale) propertyData.badges.push('URGENT SALE');
    if (propertyData.biddingEnabled) propertyData.badges.push('BIDDING');
    
    if (editingProperty) {
        const index = properties.findIndex(p => p.id == currentPropertyId);
        if (index !== -1) {
            properties[index] = propertyData;
        }
    } else {
        properties.push(propertyData);
    }
    
    saveProperties();
    clearDraft();
    closeFormWizard();
    showToast(editingProperty ? 'Property updated successfully!' : 'Property added successfully!', 'success');
    renderPropertiesGrid();
    renderPropertiesTable();
}

function showDeleteModal(propertyId) {
    deletePropertyId = propertyId;
    const property = properties.find(p => p.id == propertyId);
    
    if (!property) return;
    
    const modal = document.getElementById('deleteModal');
    const preview = document.getElementById('deletePropertyPreview');
    
    preview.innerHTML = `
        <h4>${property.title}</h4>
        <p><strong>Type:</strong> ${property.propertyType}</p>
        <p><strong>Address:</strong> ${property.address}</p>
        <p><strong>Price:</strong> ₹${formatPrice(property.price)}</p>
    `;
    
    modal.classList.remove('hidden');
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.add('hidden');
    deletePropertyId = null;
}

function confirmDelete() {
    if (deletePropertyId) {
        properties = properties.filter(p => p.id != deletePropertyId);
        saveProperties();
        closeDeleteModal();
        showToast('Property deleted successfully!', 'success');
        renderPropertiesGrid();
        renderPropertiesTable();
    }
}

// Draft Management
function saveDraft() {
    saveStepData(currentStep);
    const draftData = {
        formData,
        uploadedImages,
        currentStep
    };
    localStorage.setItem('nalIndiaPropertyDraft', JSON.stringify(draftData));
    showToast('Draft saved successfully!', 'success');
}

function loadDraft() {
    const draft = localStorage.getItem('nalIndiaPropertyDraft');
    if (draft && !editingProperty) {
        const draftData = JSON.parse(draft);
        formData = draftData.formData || {};
        uploadedImages = draftData.uploadedImages || [];
        
        // Populate form with draft data
        populateFormWithData(formData);
        renderImagePreviews();
        
        showToast('Draft loaded', 'success');
    }
}

function clearDraft() {
    localStorage.removeItem('nalIndiaPropertyDraft');
}

function populateFormWithData(data) {
    Object.keys(data).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
            field.value = data[key];
        }
    });
    
    // Handle special cases
    if (data.listingIntent) {
        const intentRadio = document.querySelector(`input[name="listingIntent"][value="${data.listingIntent}"]`);
        if (intentRadio) intentRadio.checked = true;
    }
    
    if (data.biddingEnabled) {
        document.getElementById('enableBidding').checked = true;
    }
    
    if (data.state) {
        updateCities();
        setTimeout(() => {
            if (data.city) {
                document.getElementById('city').value = data.city;
            }
        }, 100);
    }
    
    if (data.amenities) {
        data.amenities.forEach(amenity => {
            const checkbox = document.querySelector(`input[type="checkbox"][value="${amenity}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
}

// Auto-save functionality
function setupAutoSave() {
    autoSaveInterval = setInterval(() => {
        if (document.getElementById('formWizardModal').classList.contains('hidden')) {
            return;
        }
        
        saveStepData(currentStep);
        const draftData = {
            formData,
            uploadedImages,
            currentStep
        };
        localStorage.setItem('nalIndiaPropertyDraft', JSON.stringify(draftData));
    }, 30000); // Auto-save every 30 seconds
}

function clearAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
}

// Search and Filter Functions
function filterProperties() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filteredProperties = properties.filter(property => {
        const matchesSearch = !searchTerm || 
            property.title.toLowerCase().includes(searchTerm) ||
            property.address.toLowerCase().includes(searchTerm) ||
            property.city.toLowerCase().includes(searchTerm);
        
        return matchesSearch;
    });
    
    renderFilteredProperties(filteredProperties);
}

function filterPropertiesByStatus(status) {
    let filteredProperties;
    
    if (!status) {
        filteredProperties = properties;
    } else {
        filteredProperties = properties.filter(property => property.status === status);
    }
    
    renderFilteredProperties(filteredProperties);
}

function renderFilteredProperties(filteredProperties) {
    const grid = document.getElementById('propertiesGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredProperties.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    grid.innerHTML = filteredProperties.map(property => `
        <div class="property-card" data-id="${property.id}">
            <div class="property-image">
                ${property.images && property.images.length > 0 
                    ? `<img src="${property.images[0]}" alt="${property.title}">`
                    : '<i class="fas fa-image" style="font-size: 2rem; color: #94a3b8;"></i>'
                }
                <div class="property-badges">
                    ${generateBadges(property)}
                </div>
            </div>
            <div class="property-content">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-address">${property.address}</p>
                <div class="property-details">
                    <span><i class="fas fa-bed"></i> ${property.beds || 0}</span>
                    <span><i class="fas fa-bath"></i> ${property.baths || 0}</span>
                    <span><i class="fas fa-ruler-combined"></i> ${property.area || 0} sq ft</span>
                </div>
                <div class="property-price">₹${formatPrice(property.price)}</div>
                <div class="property-actions">
                    ${property.biddingEnabled ? `<button class="btn-bidding" onclick="showBiddingDashboard(${property.id})">Bidding</button>` : ''}
                    <button class="btn btn--sm btn--outline" onclick="editProperty('${property.id}')">Edit</button>
                    <button class="btn-icon delete" onclick="showDeleteModal('${property.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Form Validation
function setupFormValidation() {
    // Add real-time validation
    document.getElementById('propertyTitle').addEventListener('blur', validateRequired);
    document.getElementById('address').addEventListener('blur', validateRequired);
    document.getElementById('area').addEventListener('blur', validateNumber);
    document.getElementById('price').addEventListener('blur', validateNumber);
}

function validateRequired(event) {
    const field = event.target;
    if (!field.value.trim()) {
        field.style.borderColor = '#ef4444';
    } else {
        field.style.borderColor = '#e2e8f0';
    }
}

function validateNumber(event) {
    const field = event.target;
    const value = parseFloat(field.value);
    if (isNaN(value) || value <= 0) {
        field.style.borderColor = '#ef4444';
    } else {
        field.style.borderColor = '#e2e8f0';
    }
}

// Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close" onclick="closeToast(this.parentElement)">×</button>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            closeToast(toast);
        }
    }, 3000);
}

function closeToast(toast) {
    toast.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
    }, 300);
}

// Utility Functions
function formatPrice(price) {
    if (!price) return '0';
    
    if (price >= 10000000) {
        return (price / 10000000).toFixed(2) + ' Cr';
    } else if (price >= 100000) {
        return (price / 100000).toFixed(2) + ' L';
    } else if (price >= 1000) {
        return (price / 1000).toFixed(0) + 'K';
    }
    return price.toString();
}

function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .dragging {
        opacity: 0.5;
        transform: rotate(5deg);
    }
`;
document.head.appendChild(style);

console.log('NAL India Property Management System initialized successfully');