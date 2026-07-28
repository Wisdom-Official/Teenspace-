/**
 * Student Registration Form - Client Architecture
 */

// -------------------------------------------------------------
// CONFIGURATION
// -------------------------------------------------------------
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzS6nJJOrtOpWW94ClJBV3FfjyaHCqa5O0jKYX8KsoWSA6dPqQ1P1fuZmJxT1MRKGUsCA/exec";

// State Tracker
let currentTab = 1;

// Elements
const form = document.getElementById('registrationForm');
const sameAsPhoneCheckbox = document.getElementById('sameAsPhone');
const phoneInput = document.getElementById('phone');
const whatsappInput = document.getElementById('whatsapp');
const standardSelect = document.getElementById('standard');
const otherStandardGroup = document.getElementById('otherStandardGroup');
const otherStandardInput = document.getElementById('otherStandard');
const consentCheck = document.getElementById('consentCheck');
const submitBtn = document.getElementById('submitBtn');
const formAlert = document.getElementById('formAlert');
const successScreen = document.getElementById('successScreen');

// -------------------------------------------------------------
// EVENT LISTENERS
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Sync Phone to WhatsApp if checkbox is checked
  sameAsPhoneCheckbox.addEventListener('change', () => {
    if (sameAsPhoneCheckbox.checked) {
      whatsappInput.value = phoneInput.value;
      clearFieldError(whatsappInput);
    }
  });

  phoneInput.addEventListener('input', () => {
    if (sameAsPhoneCheckbox.checked) {
      whatsappInput.value = phoneInput.value;
      clearFieldError(whatsappInput);
    }
  });

  // Handle 'Other' option for standard select
  standardSelect.addEventListener('change', () => {
    if (standardSelect.value === 'Other') {
      otherStandardGroup.classList.remove('hidden');
      otherStandardInput.setAttribute('required', 'true');
    } else {
      otherStandardGroup.classList.add('hidden');
      otherStandardInput.removeAttribute('required');
      otherStandardInput.value = '';
      clearFieldError(otherStandardInput);
    }
  });

  // Enable/Disable submit button based on consent checkbox
  consentCheck.addEventListener('change', () => {
    submitBtn.disabled = !consentCheck.checked;
  });

  // Form submission handler
  form.addEventListener('submit', handleFormSubmit);
});

// -------------------------------------------------------------
// STEP NAVIGATION FUNCTIONS
// -------------------------------------------------------------
function showTab(tabIndex) {
  document.querySelectorAll('.form-section').forEach(section => {
    section.classList.remove('active');
  });

  document.getElementById(`step${tabIndex}`).classList.add('active');

  // Update Stepper indicators
  for (let i = 1; i <= 3; i++) {
    const indicator = document.getElementById(`indicatorStep${i}`);
    indicator.classList.remove('active', 'completed');
    if (i < tabIndex) {
      indicator.classList.add('completed');
    } else if (i === tabIndex) {
      indicator.classList.add('active');
    }
  }

  currentTab = tabIndex;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep() {
  if (validateCurrentStep()) {
    hideAlert();
    if (currentTab < 3) {
      showTab(currentTab + 1);
    }
  }
}

function prevStep() {
  hideAlert();
  if (currentTab > 1) {
    showTab(currentTab - 1);
  }
}

// -------------------------------------------------------------
// VALIDATION LOGIC
// -------------------------------------------------------------
function validateCurrentStep() {
  const currentSection = document.getElementById(`step${currentTab}`);
  const inputs = currentSection.querySelectorAll('input:not(.hidden), select:not(.hidden)');
  let isValid = true;

  inputs.forEach(input => {
    const group = input.closest('.form-group');
    if (!input.checkValidity()) {
      isValid = false;
      if (group) group.classList.add('error');
    } else {
      if (group) group.classList.remove('error');
    }
  });

  if (!isValid) {
    showAlert('Please fill in all required fields correctly before proceeding.');
  }

  return isValid;
}

function clearFieldError(input) {
  const group = input.closest('.form-group');
  if (group) group.classList.remove('error');
}

// -------------------------------------------------------------
// FORM SUBMISSION & API CALL
// -------------------------------------------------------------
async function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateCurrentStep()) return;

  setLoadingState(true);
  hideAlert();

  let standardVal = standardSelect.value;
  if (standardVal === 'Other') {
    standardVal = otherStandardInput.value.trim();
  }

  const formData = {
    name: document.getElementById('name').value.trim(),
    age: document.getElementById('age').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    whatsapp: document.getElementById('whatsapp').value.trim(),
    email: document.getElementById('email').value.trim(),
    district: document.getElementById('district').value.trim(),
    panchayat: document.getElementById('panchayat').value.trim(),
    zone: document.getElementById('zone').value.trim(),
    school: document.getElementById('school').value.trim(),
    standard: standardVal
  };

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    form.classList.add('hidden');
    document.querySelector('.stepper').classList.add('hidden');
    document.querySelector('.form-header').classList.add('hidden');
    successScreen.classList.add('active');

  } catch (err) {
    showAlert('Network error: Could not connect to the server. Please check your internet connection.');
  } finally {
    setLoadingState(false);
  }
}

function setLoadingState(isLoading) {
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.spinner');

  if (isLoading) {
    submitBtn.disabled = true;
    btnText.textContent = 'Submitting...';
    spinner.classList.remove('hidden');
  } else {
    submitBtn.disabled = !consentCheck.checked;
    btnText.textContent = 'Submit Registration';
    spinner.classList.add('hidden');
  }
}

function resetFormState() {
  form.reset();
  otherStandardGroup.classList.add('hidden');
  otherStandardInput.removeAttribute('required');
  form.classList.remove('hidden');
  document.querySelector('.stepper').classList.remove('hidden');
  document.querySelector('.form-header').classList.remove('hidden');
  successScreen.classList.remove('active');
  submitBtn.disabled = true;
  showTab(1);
}

function showAlert(message) {
  formAlert.textContent = message;
  formAlert.className = 'alert alert-danger';
  formAlert.classList.remove('hidden');
  formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideAlert() {
  formAlert.classList.add('hidden');
}

