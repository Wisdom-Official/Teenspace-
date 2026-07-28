/**
 * Student Registration Form - Client Architecture
 */

// -------------------------------------------------------------
// CONFIGURATION
// -------------------------------------------------------------
// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyeCHSHepLNw13FZGN77ZnCYIgIYPl1cMY-yJkOVdW2pNl-kCjTs2Jm3qzPWmffS89w/exec";

// State Tracker
let currentTab = 1;

// Elements
const form = document.getElementById('registrationForm');
const sameAsPhoneCheckbox = document.getElementById('sameAsPhone');
const phoneInput = document.getElementById('phone');
const whatsappInput = document.getElementById('whatsapp');
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
    }
  });

  // Enable/Disable Submit Button based on Consent
  consentCheck.addEventListener('change', () => {
    submitBtn.disabled = !consentCheck.checked;
  });

  // Attach live input error clearing
  const allInputs = form.querySelectorAll('input, select');
  allInputs.forEach(input => {
    input.addEventListener('input', () => clearFieldError(input));
    input.addEventListener('change', () => clearFieldError(input));
  });

  // Handle Submit
  form.addEventListener('submit', handleFormSubmit);
});

// -------------------------------------------------------------
// NAVIGATION & TABS
// -------------------------------------------------------------
function showTab(tabIndex) {
  const tabs = document.querySelectorAll('.form-tab');
  const indicators = document.querySelectorAll('.step-item');

  tabs.forEach(tab => {
    tab.classList.remove('active');
    if (parseInt(tab.dataset.tab, 10) === tabIndex) {
      tab.classList.add('active');
    }
  });

  indicators.forEach((indicator, idx) => {
    const stepNum = idx + 1;
    indicator.classList.remove('active', 'completed');
    if (stepNum === tabIndex) {
      indicator.classList.add('active');
    } else if (stepNum < tabIndex) {
      indicator.classList.add('completed');
    }
  });

  currentTab = tabIndex;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (tabIndex === 4) {
    populateReviewScreen();
  }
}

function nextTab(fromTab) {
  if (validateTab(fromTab)) {
    showTab(fromTab + 1);
  }
}

function prevTab(fromTab) {
  showTab(fromTab - 1);
}

function goToTab(tabIndex) {
  showTab(tabIndex);
}

// -------------------------------------------------------------
// VALIDATION LOGIC
// -------------------------------------------------------------
function validateTab(tabIndex) {
  let isValid = true;
  let firstInvalidInput = null;

  const setInvalid = (inputEl, errorElId, message) => {
    isValid = false;
    inputEl.classList.add('invalid');
    document.getElementById(errorElId).textContent = message;
    if (!firstInvalidInput) firstInvalidInput = inputEl;
  };

  if (tabIndex === 1) {
    const name = document.getElementById('studentName');
    const age = document.getElementById('age');
    const district = document.getElementById('district');
    const panchayat = document.getElementById('panchayat');

    if (!name.value.trim() || name.value.trim().length < 2) {
      setInvalid(name, 'studentNameError', 'Please enter a valid full name.');
    }

    const ageVal = parseInt(age.value, 10);
    if (!age.value || isNaN(ageVal) || ageVal < 3 || ageVal > 30) {
      setInvalid(age, 'ageError', 'Enter a valid age between 3 and 30.');
    }

    if (!district.value) {
      setInvalid(district, 'districtError', 'Please select a district.');
    }

    if (!panchayat.value.trim()) {
      setInvalid(panchayat, 'panchayatError', 'Panchayat name is required.');
    }
  }

  if (tabIndex === 2) {
    const phoneRegex = /^[6-9]\d{9}$/;
    const email = document.getElementById('email');

    if (!phoneInput.value || !phoneRegex.test(phoneInput.value)) {
      setInvalid(phoneInput, 'phoneError', 'Enter a valid 10-digit Indian phone number.');
    }

    if (!whatsappInput.value || !phoneRegex.test(whatsappInput.value)) {
      setInvalid(whatsappInput, 'whatsappError', 'Enter a valid 10-digit WhatsApp number.');
    }

    if (email.value.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        setInvalid(email, 'emailError', 'Enter a valid email address.');
      }
    }
  }

  if (tabIndex === 3) {
    const school = document.getElementById('school');
    const standard = document.getElementById('standard');

    if (!school.value.trim()) {
      setInvalid(school, 'schoolError', 'School name is required.');
    }

    if (!standard.value) {
      setInvalid(standard, 'standardError', 'Please select a class / standard.');
    }
  }

  if (firstInvalidInput) {
    firstInvalidInput.focus();
  }

  return isValid;
}

function clearFieldError(inputEl) {
  inputEl.classList.remove('invalid');
  const errorEl = document.getElementById(`${inputEl.id}Error`);
  if (errorEl) errorEl.textContent = '';
  hideAlert();
}

// -------------------------------------------------------------
// REVIEW POPULATION
// -------------------------------------------------------------
function populateReviewScreen() {
  document.getElementById('revName').textContent = document.getElementById('studentName').value;
  document.getElementById('revAge').textContent = document.getElementById('age').value;
  document.getElementById('revDistrict').textContent = document.getElementById('district').value;
  document.getElementById('revPanchayat').textContent = document.getElementById('panchayat').value;
  document.getElementById('revPhone').textContent = document.getElementById('phone').value;
  document.getElementById('revWhatsapp').textContent = document.getElementById('whatsapp').value;
  document.getElementById('revEmail').textContent = document.getElementById('email').value || 'N/A';
  document.getElementById('revSchool').textContent = document.getElementById('school').value;
  document.getElementById('revStandard').textContent = document.getElementById('standard').value;
}

// -------------------------------------------------------------
// SUBMISSION HANDLER
// -------------------------------------------------------------
async function handleFormSubmit(e) {
  e.preventDefault();

  if (GOOGLE_APPS_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
    showAlert('Configuration Error: Please update GOOGLE_APPS_SCRIPT_URL in script.js');
    return;
  }

  if (!consentCheck.checked) {
    showAlert('Please check the confirmation box to proceed.');
    return;
  }

  setLoadingState(true);
  hideAlert();

  const formData = {
    studentName: document.getElementById('studentName').value.trim(),
    age: document.getElementById('age').value,
    district: document.getElementById('district').value,
    panchayat: document.getElementById('panchayat').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    whatsapp: document.getElementById('whatsapp').value.trim(),
    email: document.getElementById('email').value.trim(),
    school: document.getElementById('school').value.trim(),
    standard: document.getElementById('standard').value,
    consent: consentCheck.checked
  };

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // Bypasses CORS pre-flight restrictions with Google Apps Script
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.status === 'success') {
      form.classList.add('hidden');
      document.querySelector('.stepper').classList.add('hidden');
      document.querySelector('.form-header').classList.add('hidden');
      successScreen.classList.remove('hidden');
    } else {
      showAlert(result.message || 'Failed to submit registration. Please try again.');
    }
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
  form.classList.remove('hidden');
  document.querySelector('.stepper').classList.remove('hidden');
  document.querySelector('.form-header').classList.remove('hidden');
  successScreen.classList.add('hidden');
  submitBtn.disabled = true;
  showTab(1);
}

function showAlert(message) {
  formAlert.textContent = message;
  formAlert.className = 'alert alert-danger';
  formAlert.classList.remove('hidden');
}

function hideAlert() {
  formAlert.classList.add('hidden');
}


