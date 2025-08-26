// Application Data
let properties = [
  {
    id: 1,
    title: "Luxury 3BHK Apartment",
    address: "123 Main St, Bengaluru, Karnataka",
    bedrooms: 3,
    bathrooms: 2,
    area: "1200 sq.ft.",
    price: 7250000,
    status: "For Sale",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    dateAdded: "2024-10-24",
    features: ["Sale", "Active", "Bidding"],
    hasBidding: true,
    hasUrgentSale: false
  },
  {
    id: 2,
    title: "Modern 4BHK Villa",
    address: "456 Oak Avenue, Mumbai, Maharashtra",
    bedrooms: 4,
    bathrooms: 3,
    area: "2400 sq.ft.",
    price: 12000000,
    status: "Urgent Sale",
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    dateAdded: "2024-10-22",
    features: ["Sale", "Active", "Urgent Sale", "Bidding"],
    hasBidding: true,
    hasUrgentSale: true
  },
  {
    id: 3,
    title: "Luxury Family Home",
    address: "789 Palm Boulevard, Hyderabad, Telangana",
    bedrooms: 5,
    bathrooms: 4,
    area: "3200 sq.ft.",
    price: 85000,
    status: "For Rent",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    dateAdded: "2024-10-20",
    features: ["Rent", "Active"],
    hasBidding: false,
    hasUrgentSale: false,
    isRental: true
  }
];

let sampleBids = [
  { bidderId: 1, bidderName: "Alice Kumar", deposit: 200000, amount: 7250000, timestamp: "2025-08-22T10:30:00", email: "alice@example.com" },
  { bidderId: 2, bidderName: "Bob Singh", deposit: 150000, amount: 7100000, timestamp: "2025-08-22T09:45:00", email: "bob@example.com" },
  { bidderId: 3, bidderName: "Charlie Rao", deposit: 150000, amount: 7000000, timestamp: "2025-08-21T15:20:00", email: "charlie@example.com" }
];

// Form state
let currentStep = 1;
let formData = {};
let auctionEndTime = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  renderProperties();
  setupEventListeners();
  setupFormNavigation();
  setupBiddingDashboard();
}

// Event Listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
      const view = this.dataset.view;
      switchView(view);
    });
  });

  // Add Property Button
  document.getElementById('add-property-btn').addEventListener('click', function() {
    switchView('add-property');
  });

  // Back to Dashboard
  document.getElementById('back-to-dashboard').addEventListener('click', function() {
    switchView('dashboard');
  });

  // Urgent Sale Toggle
  document.getElementById('urgent-sale-toggle').addEventListener('change', function() {
    const warningCard = document.getElementById('urgent-sale-warning');
    if (this.checked) {
      warningCard.classList.remove('hidden');
    } else {
      warningCard.classList.add('hidden');
    }
  });

  // Modal close
  document.getElementById('close-bidder-modal').addEventListener('click', closeBidderModal);

  // Bid sorting
  document.getElementById('sort-bids').addEventListener('change', function() {
    sortBids(this.value);
  });
}

// Navigation
function switchView(viewName) {
  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
    view.classList.add('hidden');
  });

  // Show target view
  const targetView = document.getElementById(`${viewName === 'dashboard' ? 'dashboard-view' : 
                                           viewName === 'add-property' ? 'add-property-form' : 
                                           viewName === 'bidding' ? 'bidding-dashboard' : 'dashboard-view'}`);
  
  if (targetView) {
    targetView.classList.add('active');
    targetView.classList.remove('hidden');
  }

  // Update navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  if (viewName !== 'add-property' && viewName !== 'bidding') {
    const activeNavItem = document.querySelector(`[data-view="${viewName}"]`);
    if (activeNavItem) {
      activeNavItem.classList.add('active');
    }
  }
}

// Property Management
function renderProperties() {
  const propertyGrid = document.getElementById('property-grid');
  propertyGrid.innerHTML = '';

  properties.forEach(property => {
    const propertyCard = createPropertyCard(property);
    propertyGrid.appendChild(propertyCard);
  });
}

function createPropertyCard(property) {
  const card = document.createElement('div');
  card.className = 'property-card';

  const badges = property.features.map(feature => {
    const badgeClass = feature === 'Sale' ? 'badge-sale' : 
                      feature === 'Rent' ? 'badge-rent' :
                      feature === 'Urgent Sale' ? 'badge-urgent' :
                      feature === 'Bidding' ? 'badge-bidding' : 'badge-sale';
    return `<span class="property-badge ${badgeClass}">${feature}</span>`;
  }).join('');

  const actionButtons = property.hasBidding ? 
    `<button class="btn btn--primary" onclick="openBiddingDashboard(${property.id})">Bidding</button>
     <button class="btn btn--outline">Edit</button>` :
    `<button class="btn btn--primary">Edit</button>
     <button class="btn btn--outline">More</button>`;

  card.innerHTML = `
    <div class="property-image" style="background-image: url('${property.image}')">
      <div class="property-badges">
        ${badges}
      </div>
    </div>
    <div class="property-content">
      <h3 class="property-title">${property.title}</h3>
      <p class="property-address">${property.address}</p>
      <div class="property-details">
        <span>${property.bedrooms} bed</span>
        <span>${property.bathrooms} bath</span>
        <span>${property.area}</span>
      </div>
      <div class="property-price">
        ${property.isRental ? `₹${property.price.toLocaleString()}/month` : `₹${property.price.toLocaleString()}`}
      </div>
      <div class="property-actions">
        ${actionButtons}
      </div>
    </div>
  `;

  return card;
}

// Form Navigation
function setupFormNavigation() {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  const form = document.getElementById('property-form');

  prevBtn.addEventListener('click', function() {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  });

  nextBtn.addEventListener('click', function() {
    if (validateCurrentStep()) {
      if (currentStep < 7) {
        goToStep(currentStep + 1);
      }
    }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    submitProperty();
  });
}

function goToStep(step) {
  // Hide current step
  document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
  document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('hidden');
  
  // Show new step
  document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
  document.querySelector(`.form-step[data-step="${step}"]`).classList.remove('hidden');

  // Update progress
  updateProgressSteps(step);
  
  // Update navigation buttons
  updateNavigationButtons(step);

  currentStep = step;
}

function updateProgressSteps(activeStep) {
  document.querySelectorAll('.step').forEach((step, index) => {
    const stepNum = index + 1;
    step.classList.remove('active', 'completed');
    
    if (stepNum < activeStep) {
      step.classList.add('completed');
    } else if (stepNum === activeStep) {
      step.classList.add('active');
    }
  });
}

function updateNavigationButtons(step) {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');

  prevBtn.disabled = step === 1;
  
  if (step === 7) {
    nextBtn.classList.add('hidden');
    submitBtn.classList.remove('hidden');
  } else {
    nextBtn.classList.remove('hidden');
    submitBtn.classList.add('hidden');
  }
}

function validateCurrentStep() {
  const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
  
  let isValid = true;
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.focus();
      isValid = false;
      return false;
    }
  });

  // Special validation for radio buttons
  const radioGroups = currentStepElement.querySelectorAll('input[type="radio"][required]');
  const radioGroupNames = [...new Set([...radioGroups].map(radio => radio.name))];
  
  radioGroupNames.forEach(groupName => {
    const checkedRadio = currentStepElement.querySelector(`input[name="${groupName}"]:checked`);
    if (!checkedRadio) {
      isValid = false;
    }
  });

  return isValid;
}

function submitProperty() {
  // Collect form data
  const formData = new FormData(document.getElementById('property-form'));
  const propertyData = {};
  
  for (let [key, value] of formData.entries()) {
    propertyData[key] = value;
  }

  // Collect amenities
  const amenities = [];
  document.querySelectorAll('input[name="amenities"]:checked').forEach(checkbox => {
    amenities.push(checkbox.value);
  });
  propertyData.amenities = amenities;

  // Create new property object
  const newProperty = {
    id: properties.length + 1,
    title: `${propertyData.propertyType || 'Property'} in ${propertyData.city}`,
    address: `${propertyData.address}, ${propertyData.city}, ${propertyData.state}`,
    bedrooms: parseInt(propertyData.bedrooms) || 0,
    bathrooms: parseInt(propertyData.bathrooms) || 0,
    area: `${propertyData.area} sq.ft.`,
    price: parseInt(propertyData.price),
    status: propertyData.listingIntent === 'rent' ? 'For Rent' : 
            propertyData.listingIntent === 'urgent' ? 'Urgent Sale' : 'For Sale',
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    dateAdded: new Date().toISOString().split('T')[0],
    features: getPropertyFeatures(propertyData),
    hasBidding: propertyData.enableBidding === 'on',
    hasUrgentSale: propertyData.urgentSale === 'on',
    isRental: propertyData.listingIntent === 'rent'
  };

  // Add to properties array
  properties.unshift(newProperty);

  // Reset form and go back to dashboard
  resetForm();
  switchView('dashboard');
  renderProperties();

  // Show success message
  alert('Property added successfully!');
}

function getPropertyFeatures(data) {
  const features = [];
  
  if (data.listingIntent === 'rent') {
    features.push('Rent');
  } else {
    features.push('Sale');
  }
  
  features.push('Active');
  
  if (data.urgentSale === 'on') {
    features.push('Urgent Sale');
  }
  
  if (data.enableBidding === 'on') {
    features.push('Bidding');
  }
  
  return features;
}

function resetForm() {
  document.getElementById('property-form').reset();
  currentStep = 1;
  goToStep(1);
  document.getElementById('urgent-sale-warning').classList.add('hidden');
}

// Bidding Dashboard
function setupBiddingDashboard() {
  startCountdownTimer();
}

function openBiddingDashboard(propertyId) {
  const property = properties.find(p => p.id === propertyId);
  if (property) {
    renderBiddingProperty(property);
    renderBids();
    switchView('bidding');
  }
}

function renderBiddingProperty(property) {
  const summaryContainer = document.getElementById('bidding-property-summary');
  summaryContainer.innerHTML = `
    <div class="property-image" style="background-image: url('${property.image}')"></div>
    <div class="property-content">
      <h3 class="property-title">${property.title}</h3>
      <p class="property-address">${property.address}</p>
      <div class="property-details">
        <span>${property.bedrooms} bed</span>
        <span>${property.bathrooms} bath</span>
        <span>${property.area}</span>
      </div>
      <div class="property-price">Base Price: ₹${property.price.toLocaleString()}</div>
    </div>
  `;
}

function renderBids() {
  const bidsContainer = document.getElementById('bids-list');
  const sortedBids = [...sampleBids].sort((a, b) => b.amount - a.amount);
  
  // Update stats
  document.getElementById('total-bids').textContent = sortedBids.length;
  document.getElementById('highest-bid').textContent = `₹${sortedBids[0].amount.toLocaleString()}`;

  bidsContainer.innerHTML = '';
  sortedBids.forEach((bid, index) => {
    const bidElement = createBidElement(bid, index === 0);
    bidsContainer.appendChild(bidElement);
  });
}

function createBidElement(bid, isHighest) {
  const bidDiv = document.createElement('div');
  bidDiv.className = `bid-item ${isHighest ? 'highest' : ''}`;
  
  const initials = bid.bidderName.split(' ').map(n => n[0]).join('');
  const bidTime = new Date(bid.timestamp).toLocaleString();

  bidDiv.innerHTML = `
    <div class="bidder-info">
      <div class="bidder-avatar">${initials}</div>
      <div class="bidder-details">
        <h4>${bid.bidderName}</h4>
        <p>Deposit: ₹${bid.deposit.toLocaleString()} • ${bidTime}</p>
      </div>
    </div>
    <div class="bid-amount">
      <span class="amount">₹${bid.amount.toLocaleString()}</span>
      <div class="deposit">Deposit: ₹${bid.deposit.toLocaleString()}</div>
    </div>
    <div class="bid-actions">
      <button class="btn btn--sm btn--outline" onclick="showBidderProfile(${bid.bidderId})">Profile</button>
      <button class="btn btn--sm btn--primary">Accept</button>
    </div>
  `;

  return bidDiv;
}

function sortBids(sortBy) {
  let sortedBids = [...sampleBids];
  
  switch(sortBy) {
    case 'amount':
      sortedBids.sort((a, b) => b.amount - a.amount);
      break;
    case 'time':
      sortedBids.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      break;
    case 'deposit':
      sortedBids.sort((a, b) => b.deposit - a.deposit);
      break;
  }
  
  sampleBids = sortedBids;
  renderBids();
}

function showBidderProfile(bidderId) {
  const bidder = sampleBids.find(b => b.bidderId === bidderId);
  if (bidder) {
    const modalBody = document.getElementById('bidder-details');
    modalBody.innerHTML = `
      <div class="bidder-profile">
        <h4>${bidder.bidderName}</h4>
        <p><strong>Email:</strong> ${bidder.email}</p>
        <p><strong>Bid Amount:</strong> ₹${bidder.amount.toLocaleString()}</p>
        <p><strong>Deposit:</strong> ₹${bidder.deposit.toLocaleString()}</p>
        <p><strong>Bid Time:</strong> ${new Date(bidder.timestamp).toLocaleString()}</p>
        <div class="bidder-stats">
          <div class="stat">
            <strong>95%</strong>
            <span>Success Rate</span>
          </div>
          <div class="stat">
            <strong>12</strong>
            <span>Completed Deals</span>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('bidder-modal').classList.remove('hidden');
  }
}

function closeBidderModal() {
  document.getElementById('bidder-modal').classList.add('hidden');
}

function startCountdownTimer() {
  function updateTimer() {
    const now = new Date().getTime();
    const timeLeft = auctionEndTime.getTime() - now;

    if (timeLeft > 0) {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      document.getElementById('days').textContent = String(days).padStart(2, '0');
      document.getElementById('hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
      document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    } else {
      // Auction ended
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      
      // Show bidding closed overlay
      showBiddingClosedOverlay();
    }
  }

  // Update timer immediately and then every second
  updateTimer();
  setInterval(updateTimer, 1000);
}

function showBiddingClosedOverlay() {
  document.getElementById('bidding-closed-overlay').classList.remove('hidden');
}

function closeBiddingOverlay() {
  document.getElementById('bidding-closed-overlay').classList.add('hidden');
}

// Global functions for onclick handlers
window.openBiddingDashboard = openBiddingDashboard;
window.showBidderProfile = showBidderProfile;
window.closeBiddingOverlay = closeBiddingOverlay;