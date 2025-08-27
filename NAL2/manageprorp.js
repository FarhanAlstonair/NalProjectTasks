// Sidebar toggle elements
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

// Add Property button
const addPropertyBtn = document.getElementById("addPropertyBtn");

// Properties list container and message
const propertiesList = document.getElementById("properties-list");
const noPropertiesMsg = document.getElementById("no-properties-msg");

// Wizard modal elements
const wizardModal = document.getElementById("wizardModal");
const wizardContent = document.getElementById("wizardContent");
const closeWizardBtn = document.getElementById("closeWizardBtn");
const wizardBackBtn = document.getElementById("wizardBackBtn");
const wizardNextBtn = document.getElementById("wizardNextBtn");

// Sidebar toggle handlers
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
});
overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
});

// Properties data storage
let properties = [];

// Wizard state
let currentStep = 0;
const steps = ["Seller Registration", "Ownership Verification", "Listing Intent"];
let wizardData = {};

// Initialize wizardData structure
function initWizardData() {
  wizardData = {
    fullName: "",
    mobile: "",
    mobileVerified: false,
    email: "",
    role: "",
    govtIdType: "",
    govtId: "",
    ownerName: "",
    propertyAddress: "",
    registryNumber: "",
    ownershipType: "",
    listingIntent: "",
    expectedPrice: null,
    negotiable: false,
    loanEncumbrance: "None",
  };
}

// Render wizard step form
function renderStep(step) {
  let html = `<div class="step-indicator">Step ${step + 1} of ${
    steps.length
  }: ${steps[step]}</div>`;
  clearErrors();
  switch (step) {
    case 0:
      html += `
      <form id="sellerForm" novalidate>
        <label for="fullName">Full Name *</label>
        <input type="text" id="fullName" name="fullName" value="${wizardData.fullName}" required />
        <div id="error-fullName" class="error-text"></div>

        <label for="mobile">Mobile Number * (10 digits, OTP required)</label>
        <input type="tel" id="mobile" name="mobile" value="${wizardData.mobile}" maxlength="10" required />
        <button type="button" id="sendOtpBtn">Send OTP</button>
        <div id="otpSection" style="margin-top:8px; display:none;">
          <input type="text" id="otpInput" maxlength="6" placeholder="Enter OTP" />
          <button type="button" id="verifyOtpBtn" disabled>Verify OTP</button>
          <span id="otpStatus" class="success-text" style="display:none;">Verified ✓</span>
          <span id="otpError" class="error-text" style="display:none;"></span>
        </div>
        <div id="error-mobile" class="error-text"></div>

        <label for="email">Email *</label>
        <input type="email" id="email" name="email" value="${wizardData.email}" required />
        <div id="error-email" class="error-text"></div>

        <label for="role">Role *</label>
        <select id="role" name="role" required>
          <option value="">Select Role</option>
          <option value="Owner" ${
            wizardData.role === "Owner" ? "selected" : ""
          }>Owner</option>
          <option value="Agent" ${
            wizardData.role === "Agent" ? "selected" : ""
          }>Agent</option>
          <option value="Builder" ${
            wizardData.role === "Builder" ? "selected" : ""
          }>Builder</option>
          <option value="Company" ${
            wizardData.role === "Company" ? "selected" : ""
          }>Company</option>
        </select>
        <div id="error-role" class="error-text"></div>

        <label for="govtIdType">Identity Proof *</label>
        <select id="govtIdType" name="govtIdType" required>
          <option value="">Select ID Type</option>
          <option value="Aadhaar" ${
            wizardData.govtIdType === "Aadhaar" ? "selected" : ""
          }>Aadhaar</option>
          <option value="PAN" ${
            wizardData.govtIdType === "PAN" ? "selected" : ""
          }>PAN</option>
          <option value="Passport" ${
            wizardData.govtIdType === "Passport" ? "selected" : ""
          }>Passport</option>
          <option value="Voter ID" ${
            wizardData.govtIdType === "Voter ID" ? "selected" : ""
          }>Voter ID</option>
        </select>
        <div id="error-govtIdType" class="error-text"></div>

        <label for="govtId">Government ID Number *</label>
        <input type="text" id="govtId" name="govtId" value="${wizardData.govtId}" required />
        <div id="error-govtId" class="error-text"></div>
      </form>
      `;
      break;

    case 1:
      html += `
      <form id="ownershipForm" novalidate>
        <label for="ownerName">Owner Name *</label>
        <input type="text" id="ownerName" name="ownerName" value="${wizardData.ownerName}" required />
        <div id="error-ownerName" class="error-text"></div>

        <label for="propertyAddress">Property Address *</label>
        <textarea id="propertyAddress" name="propertyAddress" rows="3" required>${wizardData.propertyAddress}</textarea>
        <div id="error-propertyAddress" class="error-text"></div>

        <label for="registryNumber">Property ID / Registry No. *</label>
        <input type="text" id="registryNumber" name="registryNumber" value="${wizardData.registryNumber}" required />
        <div id="error-registryNumber" class="error-text"></div>

        <label>Ownership Type *</label>
        <label><input type="radio" name="ownershipType" value="Single" ${
          wizardData.ownershipType === "Single" ? "checked" : ""
        } /> Single</label>
        <label><input type="radio" name="ownershipType" value="Joint" ${
          wizardData.ownershipType === "Joint" ? "checked" : ""
        } /> Joint</label>
        <label><input type="radio" name="ownershipType" value="Company" ${
          wizardData.ownershipType === "Company" ? "checked" : ""
        } /> Company</label>
        <div id="error-ownershipType" class="error-text"></div>
      </form>`;
      break;

    case 2:
      html += `
      <form id="intentForm" novalidate>
        <label for="listingIntent">Listing Intent *</label>
        <select id="listingIntent" name="listingIntent" required>
          <option value="">Select Intent</option>
          <option value="For Sale" ${
            wizardData.listingIntent === "For Sale" ? "selected" : ""
          }>For Sale</option>
          <option value="For Rent" ${
            wizardData.listingIntent === "For Rent" ? "selected" : ""
          }>For Rent</option>
          <option value="Urgent Sale" ${
            wizardData.listingIntent === "Urgent Sale" ? "selected" : ""
          }>Urgent Sale</option>
        </select>
        <div id="error-listingIntent" class="error-text"></div>

        <label for="expectedPrice">Expected Price * (INR)</label>
        <input type="number" id="expectedPrice" name="expectedPrice" min="1" value="${
          wizardData.expectedPrice || ""
        }" required />
        <div id="error-expectedPrice" class="error-text"></div>

        <label><input type="checkbox" id="negotiable" name="negotiable" ${
          wizardData.negotiable ? "checked" : ""
        } /> Negotiable</label>

        <label for="loanEncumbrance">Loan / Encumbrance</label>
        <select id="loanEncumbrance" name="loanEncumbrance">
          <option value="None" ${
            wizardData.loanEncumbrance === "None" ? "selected" : ""
          }>None</option>
          <option value="Loan" ${
            wizardData.loanEncumbrance === "Loan" ? "selected" : ""
          }>Loan</option>
          <option value="Encumbrance" ${
            wizardData.loanEncumbrance === "Encumbrance" ? "selected" : ""
          }>Encumbrance</option>
        </select>
      </form>
      `;
      break;
  }
  wizardContent.innerHTML = html;

  if (step === 0) setupSellerStepEvents();
  else if (step === 1) setupOwnershipStepEvents();
  else if (step === 2) setupIntentStepEvents();

  checkStepValidity();

  // Update modal title with step name
  document.getElementById("wizardTitle").textContent = `Create Property Listing - ${steps[step]}`;
}

// Clear all error messages
function clearErrors() {
  wizardContent.querySelectorAll(".error-text").forEach((el) => (el.textContent = ""));
  const otpError = document.getElementById("otpError");
  const otpStatus = document.getElementById("otpStatus");
  if (otpError) {
    otpError.style.display = "none";
    otpError.textContent = "";
  }
  if (otpStatus) {
    otpStatus.style.display = "none";
  }
}

// Validation functions for each step
function validateSellerStep() {
  clearErrors();
  let valid = true;

  const fullName = document.getElementById("fullName").value.trim();
  if (!fullName) {
    showError("fullName", "Please enter your full name.");
    valid = false;
  }

  const mobile = document.getElementById("mobile").value.trim();
  if (!/^\d{10}$/.test(mobile)) {
    showError("mobile", "Enter valid 10-digit mobile number.");
    valid = false;
  }
  if (!wizardData.mobileVerified) {
    showError("mobile", "Mobile number not verified.");
    valid = false;
  }

  const email = document.getElementById("email").value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showError("email", "Enter a valid email.");
    valid = false;
  }

  const role = document.getElementById("role").value.trim();
  if (!role) {
    showError("role", "Please select a role.");
    valid = false;
  }

  const govtIdType = document.getElementById("govtIdType").value.trim();
  if (!govtIdType) {
    showError("govtIdType", "Select a government ID type.");
    valid = false;
  }

  const govtId = document.getElementById("govtId").value.trim();
  if (!govtId) {
    showError("govtId", "Enter government ID number.");
    valid = false;
  }

  return valid;
}

function validateOwnershipStep() {
  clearErrors();
  let valid = true;
  const ownerName = document.getElementById("ownerName").value.trim();
  if (!ownerName) {
    showError("ownerName", "Owner name is required.");
    valid = false;
  }
  const propertyAddress = document.getElementById("propertyAddress").value.trim();
  if (!propertyAddress) {
    showError("propertyAddress", "Property address is required.");
    valid = false;
  }
  const registryNumber = document.getElementById("registryNumber").value.trim();
  if (!registryNumber) {
    showError("registryNumber", "Registry number is required.");
    valid = false;
  }
  const ownershipTypes = document.getElementsByName("ownershipType");
  let ownershipTypeChecked = false;
  ownershipTypes.forEach((input) => {
    if (input.checked) ownershipTypeChecked = true;
  });
  if (!ownershipTypeChecked) {
    showError("ownershipType", "Ownership type is required.");
    valid = false;
  }
  return valid;
}

function validateIntentStep() {
  clearErrors();
  let valid = true;
  const listingIntent = document.getElementById("listingIntent").value.trim();
  if (!listingIntent) {
    showError("listingIntent", "Please select listing intent.");
    valid = false;
  }
  const expectedPrice = document.getElementById("expectedPrice").value.trim();
  if (!expectedPrice || isNaN(expectedPrice) || Number(expectedPrice) <= 0) {
    showError("expectedPrice", "Please enter a valid price.");
    valid = false;
  }
  return valid;
}

function showError(fieldId, msg) {
  const el = document.getElementById("error-" + fieldId);
  if (el) el.textContent = msg;
}

// Check current step validity and enable/disable Next button
function checkStepValidity() {
  let valid = false;
  if (currentStep === 0) valid = validateSellerStep();
  else if (currentStep === 1) valid = validateOwnershipStep();
  else if (currentStep === 2) valid = validateIntentStep();
  wizardNextBtn.disabled = !valid;
}

// Setup form event listeners for Step 0 (Seller)
function setupSellerStepEvents() {
  const mobileInput = document.getElementById("mobile");
  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const otpSection = document.getElementById("otpSection");
  const otpInput = document.getElementById("otpInput");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");
  const otpStatus = document.getElementById("otpStatus");
  const otpError = document.getElementById("otpError");

  // Input fields update wizardData and validity check
  [
    "fullName",
    "mobile",
    "email",
    "role",
    "govtIdType",
    "govtId",
  ].forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener("input", (e) => {
      wizardData[id] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      if (id === "mobile") wizardData.mobileVerified = false; // reset OTP verified if mobile changes
      checkStepValidity();
    });
  });

  // Send OTP button shows OTP input area
  sendOtpBtn.addEventListener("click", () => {
    const mobileVal = mobileInput.value.trim();
    if (!/^\d{10}$/.test(mobileVal)) {
      showError("mobile", "Please enter a valid 10-digit mobile number before sending OTP.");
      return;
    }
    clearErrors();
    otpSection.style.display = "block";
    otpInput.value = "";
    verifyOtpBtn.disabled = true;
    otpStatus.style.display = "none";
    otpError.style.display = "none";
  });

  // Enable verify button when OTP input length is 6 digits
  otpInput.addEventListener("input", () => {
    const val = otpInput.value.trim();
    verifyOtpBtn.disabled = val.length !== 6 || !/^\d{6}$/.test(val);
  });

  // Verify OTP button simulation
  verifyOtpBtn.addEventListener("click", () => {
    verifyOtpBtn.disabled = true;
    otpError.style.display = "none";
    otpStatus.style.display = "none";

    // Simulate verification delay and success
    setTimeout(() => {
      if (Math.random() > 0.1) {
        otpStatus.style.display = "inline";
        wizardData.mobileVerified = true;
        checkStepValidity();
      } else {
        otpError.textContent = "Invalid OTP, please retry.";
        otpError.style.display = "block";
        wizardData.mobileVerified = false;
      }
      verifyOtpBtn.disabled = false;
    }, 1200);
  });
}

// Setup form event listeners for Step 1 (Ownership)
function setupOwnershipStepEvents() {
  ["ownerName", "propertyAddress", "registryNumber"].forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener("input", (e) => {
      wizardData[id] = e.target.value;
      checkStepValidity();
    });
  });
  const ownershipTypes = document.getElementsByName("ownershipType");
  ownershipTypes.forEach((input) => {
    input.addEventListener("change", (e) => {
      wizardData.ownershipType = e.target.value;
      checkStepValidity();
    });
  });
}

// Setup form event listeners for Step 2 (Intent)
function setupIntentStepEvents() {
  const listingIntent = document.getElementById("listingIntent");
  const expectedPrice = document.getElementById("expectedPrice");
  const negotiable = document.getElementById("negotiable");
  const loanEncumbrance = document.getElementById("loanEncumbrance");

  listingIntent.addEventListener("change", (e) => {
    wizardData.listingIntent = e.target.value;
    checkStepValidity();
  });
  expectedPrice.addEventListener("input", (e) => {
    wizardData.expectedPrice = e.target.value;
    checkStepValidity();
  });
  negotiable.addEventListener("change", (e) => {
    wizardData.negotiable = e.target.checked;
  });
  loanEncumbrance.addEventListener("change", (e) => {
    wizardData.loanEncumbrance = e.target.value;
  });
}

// Save current step data from form inputs to wizardData
function saveStepData() {
  if (currentStep === 0) {
    wizardData.fullName = document.getElementById("fullName").value.trim();
    wizardData.mobile = document.getElementById("mobile").value.trim();
    wizardData.email = document.getElementById("email").value.trim();
    wizardData.role = document.getElementById("role").value;
    wizardData.govtIdType = document.getElementById("govtIdType").value;
    wizardData.govtId = document.getElementById("govtId").value.trim();
  } else if (currentStep === 1) {
    wizardData.ownerName = document.getElementById("ownerName").value.trim();
    wizardData.propertyAddress = document.getElementById("propertyAddress").value.trim();
    wizardData.registryNumber = document.getElementById("registryNumber").value.trim();
    const ownershipTypes = document.getElementsByName("ownershipType");
    for (const input of ownershipTypes) {
      if (input.checked) {
        wizardData.ownershipType = input.value;
        break;
      }
    }
  } else if (currentStep === 2) {
    wizardData.listingIntent = document.getElementById("listingIntent").value;
    wizardData.expectedPrice = document.getElementById("expectedPrice").value;
    wizardData.negotiable = document.getElementById("negotiable").checked;
    wizardData.loanEncumbrance = document.getElementById("loanEncumbrance").value;
  }
}

// Move Add Property btn to floating on first add
function toggleFloatingAddButton(floating) {
  if (floating) addPropertyBtn.classList.add("floating-add-btn");
  else addPropertyBtn.classList.remove("floating-add-btn");
}

// Render all properties as cards in Manage Properties section
function renderProperties() {
  propertiesList.innerHTML = "";
  if (properties.length === 0) {
    noPropertiesMsg.style.display = "block";
    toggleFloatingAddButton(false);
    return;
  }
  noPropertiesMsg.style.display = "none";
  toggleFloatingAddButton(true);

  properties.forEach((prop) => {
    const card = document.createElement("div");
    card.className = "property-card";
    card.innerHTML = `
      <div class="property-title">${escapeHtml(prop.fullName)}'s Property</div>
      <div class="property-address">${escapeHtml(prop.propertyAddress)}</div>
      <div class="property-details">
        <div>Owner: ${escapeHtml(prop.ownerName)}</div>
        <div>Intent: ${escapeHtml(prop.listingIntent)}</div>
      </div>
      <div class="property-price">₹ ${Number(prop.expectedPrice).toLocaleString("en-IN")}</div>
    `;
    propertiesList.appendChild(card);
  });
}

// Escape HTML for text safety
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Open wizard modal and render initial step
function openWizard() {
  initWizardData();
  currentStep = 0;
  renderStep(currentStep);
  wizardNextBtn.textContent = "Next";
  wizardBackBtn.disabled = true;
  wizardModal.setAttribute("aria-hidden", "false");
  wizardModal.classList.add("show");
  wizardModal.focus();
}

// Close wizard modal
function closeWizard() {
  wizardModal.classList.remove("show");
  wizardModal.setAttribute("aria-hidden", "true");
}

// Button event handlers
addPropertyBtn.addEventListener("click", openWizard);
closeWizardBtn.addEventListener("click", closeWizard);

wizardBackBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    saveStepData();
    currentStep--;
    renderStep(currentStep);
    wizardNextBtn.textContent = "Next";
    wizardBackBtn.disabled = currentStep === 0;
  }
});

wizardNextBtn.addEventListener("click", () => {
  if (wizardNextBtn.disabled) return;
  saveStepData();
  if (currentStep < steps.length - 1) {
    currentStep++;
    renderStep(currentStep);
    wizardBackBtn.disabled = false;
    if (currentStep === steps.length - 1) {
      wizardNextBtn.textContent = "Publish";
    } else {
      wizardNextBtn.textContent = "Next";
    }
  } else {
    // Publish the property
    properties.push({ ...wizardData });
    closeWizard();
    renderProperties();
  }
});

// Accessibility: Allow Esc to close modal
wizardModal.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeWizard();
  }
});

// Initial render of properties
renderProperties();
