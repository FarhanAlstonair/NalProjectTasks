// Property Management System JavaScript

// Global State
let currentStep = 1;
let currentPropertyId = null;
let editingProperty = false;
let formData = {};
let uploadedImages = [];
let properties = [];
let deletePropertyId = null;
let autoSaveInterval = null;

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

    // State change handler
    document.getElementById('state').addEventListener('change', updateCities);

    // Image upload handler
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

    // Search and filter handlers
    document.getElementById('searchInput').addEventListener('input', filterProperties);
    document.getElementById('statusFilter').addEventListener('change', filterProperties);
    document.getElementById('typeFilter').addEventListener('change', filterProperties);

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
        }
    }
}

// Property Loading and Management
function loadProperties() {
    const savedProperties = localStorage.getItem('properties');
    if (savedProperties) {
        properties = JSON.parse(savedProperties);
    } else {
        // Load sample data
        properties = [
            {
                id: "prop_1",
                title: "Luxury 3BHK Apartment",
                address: "123 Main Street, Koramangala",
                city: "Bengaluru",
                state: "Karnataka",
                zipCode: "560034",
                propertyType: "apartment",
                bedrooms: 3,
                bathrooms: 2,
                area: 1200,
                price: 8500000,
                listingIntent: "sale",
                status: "active",
                images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80"],
                amenities: ["parking", "gym", "pool"],
                yearBuilt: 2020,
                possession: "immediate",
                createdAt: "2025-01-15T10:30:00Z"
            },
            {
                id: "prop_2",
                title: "Modern Villa",
                address: "456 Garden Road, Whitefield",
                city: "Bengaluru",
                state: "Karnataka",
                zipCode: "560066",
                propertyType: "villa",
                bedrooms: 4,
                bathrooms: 3,
                area: 2500,
                price: 15000000,
                listingIntent: "sale",
                status: "draft",
                images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80"],
                amenities: ["parking", "garden"],
                yearBuilt: 2022,
                possession: "3months",
                createdAt: "2025-01-14T15:20:00Z"
            }
        ];
        saveProperties();
    }
}

function saveProperties() {
    localStorage.setItem('properties', JSON.stringify(properties));
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
                    ? `<img src="${property.images[0]}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;">`
                    : '<span>📷 No Image</span>'
                }
            </div>
            <div class="property-content">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-address">${property.address}, ${property.city}</p>
                <div class="property-details">
                    <span>${property.bedrooms || 0} BHK</span>
                    <span>${property.area || 0} sq ft</span>
                    <span>${property.propertyType}</span>
                </div>
                <div class="property-price">₹${formatPrice(property.price)}</div>
                <div class="property-status status-${property.status}">
                    ${property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </div>
                <div class="property-actions">
                    <button class="btn btn--sm btn--outline" onclick="editProperty('${property.id}')">Edit</button>
                    <button class="btn-icon delete" onclick="showDeleteModal('${property.id}')" title="Delete">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
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
            <td><span class="status status-${property.status}">${property.status}</span></td>
            <td>
                <button class="btn btn--sm btn--outline" onclick="editProperty('${property.id}')">Edit</button>
                <button class="btn-icon delete" onclick="showDeleteModal('${property.id}')">🗑️</button>
            </td>
        </tr>
    `).join('');
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
            formData.bedrooms = parseInt(document.getElementById('bedrooms').value) || 0;
            formData.bathrooms = parseInt(document.getElementById('bathrooms').value) || 0;
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
            break;
            
        case 4:
            formData.state = document.getElementById('state').value;
            formData.city = document.getElementById('city').value;
            
            // Get selected amenities
            const amenities = [];
            document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                amenities.push(cb.value);
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
            <span class="review-value">${formData.bedrooms || 0}/${formData.bathrooms || 0}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Listing Intent:</span>
            <span class="review-value">${formData.listingIntent || '-'}</span>
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
            ${index === 0 ? '<div class="cover-badge">Cover</div>' : ''}
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
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;
    
    // Populate form fields
    document.getElementById('propertyTitle').value = property.title || '';
    document.getElementById('propertyType').value = property.propertyType || '';
    document.getElementById('address').value = property.address || '';
    document.getElementById('zipCode').value = property.zipCode || '';
    document.getElementById('bedrooms').value = property.bedrooms || '';
    document.getElementById('bathrooms').value = property.bathrooms || '';
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
        id: currentPropertyId || 'prop_' + Date.now(),
        ...formData,
        images: uploadedImages.map(img => img.url),
        status: editingProperty ? (properties.find(p => p.id === currentPropertyId)?.status || 'active') : 'active',
        createdAt: editingProperty ? (properties.find(p => p.id === currentPropertyId)?.createdAt) : new Date().toISOString()
    };
    
    if (editingProperty) {
        const index = properties.findIndex(p => p.id === currentPropertyId);
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
    const property = properties.find(p => p.id === propertyId);
    
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
        properties = properties.filter(p => p.id !== deletePropertyId);
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
    localStorage.setItem('propertyDraft', JSON.stringify(draftData));
    showToast('Draft saved successfully!', 'success');
}

function loadDraft() {
    const draft = localStorage.getItem('propertyDraft');
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
    localStorage.removeItem('propertyDraft');
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
        localStorage.setItem('propertyDraft', JSON.stringify(draftData));
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
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    const filteredProperties = properties.filter(property => {
        const matchesSearch = !searchTerm || 
            property.title.toLowerCase().includes(searchTerm) ||
            property.address.toLowerCase().includes(searchTerm) ||
            property.city.toLowerCase().includes(searchTerm);
            
        const matchesStatus = !statusFilter || property.status === statusFilter;
        const matchesType = !typeFilter || property.propertyType === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
    });
    
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
                    ? `<img src="${property.images[0]}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;">`
                    : '<span>📷 No Image</span>'
                }
            </div>
            <div class="property-content">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-address">${property.address}, ${property.city}</p>
                <div class="property-details">
                    <span>${property.bedrooms || 0} BHK</span>
                    <span>${property.area || 0} sq ft</span>
                    <span>${property.propertyType}</span>
                </div>
                <div class="property-price">₹${formatPrice(property.price)}</div>
                <div class="property-status status-${property.status}">
                    ${property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </div>
                <div class="property-actions">
                    <button class="btn btn--sm btn--outline" onclick="editProperty('${property.id}')">Edit</button>
                    <button class="btn-icon delete" onclick="showDeleteModal('${property.id}')" title="Delete">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('typeFilter').value = '';
    renderPropertiesGrid();
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
        field.style.borderColor = 'var(--color-error)';
    } else {
        field.style.borderColor = 'var(--color-border)';
    }
}

function validateNumber(event) {
    const field = event.target;
    const value = parseFloat(field.value);
    if (isNaN(value) || value <= 0) {
        field.style.borderColor = 'var(--color-error)';
    } else {
        field.style.borderColor = 'var(--color-border)';
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
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            closeToast(toast);
        }
    }, 5000);
}

function closeToast(toast) {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
    }, 300);
}

// Utility Functions
function formatPrice(price) {
    if (price >= 10000000) {
        return (price / 10000000).toFixed(2) + ' Cr';
    } else if (price >= 100000) {
        return (price / 100000).toFixed(2) + ' L';
    } else if (price >= 1000) {
        return (price / 1000).toFixed(0) + 'K';
    }
    return price.toString();
}

// Add slideOut animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// TODO: Backend Integration Points
// 1. Replace localStorage with API calls for property CRUD
// 2. Implement real file upload to cloud storage
// 3. Add buyer notification system integration
// 4. Implement user authentication and authorization
// 5. Add real-time updates for property status changes
// 6. Implement bidding system with WebSocket connections

console.log('Property Management System initialized successfully');