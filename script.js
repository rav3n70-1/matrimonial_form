document.addEventListener('DOMContentLoaded', function () {
    // State
    let currentStep = 1;
    const totalSteps = 4;
    let formData = {};

    // DOM Elements
    const form = document.getElementById('matrimonyForm');
    const steps = document.querySelectorAll('.form-step');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const pdfBtn = document.getElementById('pdf-btn');
    const resetBtn = document.getElementById('reset-btn');
    const actionButtons = document.getElementById('action-buttons');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const educationContainer = document.getElementById('education-container');
    const addEducationBtn = document.getElementById('add-education-btn');
    const modal = document.getElementById('reset-modal');
    const confirmResetBtn = document.getElementById('confirm-reset-btn');
    const cancelResetBtn = document.getElementById('cancel-reset-btn');

    // --- Core Logic ---

    const updateUI = () => {
        // Update steps visibility
        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === currentStep);
        });

        // Update progress bar
        const progress = ((currentStep - 1) / (totalSteps -1)) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Step ${currentStep} of ${totalSteps}`;

        // Update button states
        prevBtn.disabled = currentStep === 1;
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            prevBtn.style.display = 'none';
            actionButtons.style.display = 'flex';
        } else {
            nextBtn.style.display = 'inline-block';
            prevBtn.style.display = 'inline-block';
            actionButtons.style.display = 'none';
        }
    };

    const showNotification = (type, title, message) => {
        const notification = document.getElementById('notification');
        const icon = document.getElementById('notification-icon');
        document.getElementById('notification-title').textContent = title;
        document.getElementById('notification-message').textContent = message;

        icon.className = 'h-6 w-6'; // Clear classes
        if (type === 'success') icon.classList.add('fas', 'fa-check-circle', 'text-green-500');
        else if (type === 'error') icon.classList.add('fas', 'fa-times-circle', 'text-red-500');
        else if (type === 'info') icon.classList.add('fas', 'fa-info-circle', 'text-blue-500');
        
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    };
    
    // --- Data Handling (Async) ---

    const collectFormData = () => {
        return new Promise(resolve => {
            const data = new FormData(form);
            const collectedData = Object.fromEntries(data.entries());

            // Collect hobbies
            const hobbies = [];
            document.querySelectorAll('input[name="hobbies"]:checked').forEach(checkbox => {
                hobbies.push(checkbox.value);
            });
            collectedData.hobbies = hobbies;

            // Collect favorite places
            const favoritePlaces = [];
            document.querySelectorAll('input[name="favoritePlaces"]:checked').forEach(checkbox => {
                favoritePlaces.push(checkbox.value);
            });
            collectedData.favoritePlaces = favoritePlaces;

            // Format height from feet and inches
            const heightFeet = document.getElementById('height-feet')?.value || '';
            const heightInches = document.getElementById('height-inches')?.value || '';
            if (heightFeet || heightInches) {
                const feet = heightFeet ? `${heightFeet}'` : '0\'';
                const inches = heightInches ? `${heightInches}"` : '0"';
                collectedData.height = `${feet}${inches}`;
            }

            collectedData.education = [];
            const eduRows = educationContainer.querySelectorAll('.education-row');
            eduRows.forEach(row => {
                const degree = row.querySelector('input[name="degree"]').value;
                const institution = row.querySelector('input[name="institution"]').value;
                const year = row.querySelector('input[name="year"]').value;
                const result = row.querySelector('input[name="result"]').value;
                if (degree || institution || year || result) {
                    collectedData.education.push({ degree, institution, year, result });
                }
            });

            const profileFile = document.getElementById('profilePicture').files[0];
            if (profileFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    collectedData.profilePictureBase64 = e.target.result;
                    resolve(collectedData);
                };
                reader.onerror = () => {
                    delete collectedData.profilePictureBase64;
                    resolve(collectedData);
                };
                reader.readAsDataURL(profileFile);
            } else {
                // If there's already a picture in formData, keep it
                if (formData.profilePictureBase64) {
                    collectedData.profilePictureBase64 = formData.profilePictureBase64;
                }
                resolve(collectedData);
            }
        });
    };

    const populateSummary = async () => {
        formData = await collectFormData();
        const summaryContainer = document.getElementById('summary-container');

        const getDisplayValue = (key, value) => {
            if (!value) return '<span class="text-gray-500">Not provided</span>';
            if (key === 'profilePictureBase64') return `<img src="${value}" alt="Profile" class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md">`;
            if (key === 'birthdate') return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            return value;
        };
        
        summaryContainer.innerHTML = `
            <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                ${formData.profilePictureBase64 ? getDisplayValue('profilePictureBase64', formData.profilePictureBase64) : '<div class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-center p-2">No Photo Provided</div>'}
                <div class="text-center sm:text-left">
                    <h3 class="text-3xl font-bold text-gray-800">${formData.fullname || 'N/A'}</h3>
                    <p class="text-gray-600 text-lg">${formData.profession || 'N/A'}</p>
                </div>
            </div>
            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t">
                <div><strong class="text-gray-600">Gender:</strong> ${getDisplayValue('gender', formData.gender)}</div>
                <div><strong class="text-gray-600">Birth Date:</strong> ${getDisplayValue('birthdate', formData.birthdate)}</div>
                <div><strong class="text-gray-600">Height:</strong> ${formData.height || getDisplayValue('height', formData.height)}</div>
                <div><strong class="text-gray-600">Religion:</strong> ${getDisplayValue('religion', formData.religion)}</div>
                <div><strong class="text-gray-600">Email:</strong> ${getDisplayValue('email', formData.email)}</div>
                <div><strong class="text-gray-600">Phone:</strong> ${getDisplayValue('phone', formData.phone)}</div>
                <div class="md:col-span-2"><strong class="text-gray-600">Monthly Income:</strong> ${formData.income ? '৳' + Number(formData.income).toLocaleString() : getDisplayValue('income', formData.income)}</div>
            </div>
            <div class="mt-4 pt-4 border-t">
                <h4 class="text-lg font-semibold text-gray-700 mb-3">👨‍👩‍👧‍👦 Family Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <div><strong class="text-gray-600">Father's Name:</strong> ${getDisplayValue('fathername', formData.fathername)}</div>
                    <div><strong class="text-gray-600">Mother's Name:</strong> ${getDisplayValue('mothername', formData.mothername)}</div>
                    <div class="md:col-span-2"><strong class="text-gray-600">Address:</strong> ${getDisplayValue('address', formData.address)}</div>
                </div>
            </div>
             <div class="mt-4 pt-4 border-t">
                <strong class="text-gray-600 block mb-2 text-lg">Partner Expectations:</strong>
                <p class="text-gray-700 italic bg-white p-4 rounded-md shadow-inner">${getDisplayValue('expectations', formData.expectations)}</p>
            </div>
            ${(formData.hobbies && formData.hobbies.length > 0) ? `
                <div class="mt-4 pt-4 border-t">
                    <strong class="text-gray-600 block mb-2 text-lg">🎯 Hobbies & Interests:</strong>
                    <div class="flex flex-wrap gap-2">
                        ${formData.hobbies.map(hobby => `
                            <span class="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full border border-blue-200">${hobby}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            ${(formData.favoritePlaces && formData.favoritePlaces.length > 0) ? `
                <div class="mt-4 pt-4 border-t">
                    <strong class="text-gray-600 block mb-2 text-lg">🌍 Favorite Places:</strong>
                    <div class="flex flex-wrap gap-2">
                        ${formData.favoritePlaces.map(place => `
                            <span class="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full border border-green-200">${place}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            ${ (formData.education && formData.education.length > 0) ? `
                <div class="mt-4 pt-4 border-t">
                    <strong class="text-gray-600 block mb-2 text-lg">Education:</strong>
                    <ul class="space-y-3">
                        ${formData.education.map(edu => `
                            <li class="bg-white p-3 rounded-md shadow-sm border-l-4 border-blue-400">
                                <p class="font-semibold text-gray-800">${edu.degree || 'N/A'}</p>
                                <p class="text-sm text-gray-600">${edu.institution || 'N/A'} (${edu.year || 'N/A'})</p>
                                <p class="text-sm text-gray-500">Result/GPA: ${edu.result || 'N/A'}</p>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
    };

    // --- Enhanced Validation with Visual Feedback ---
    
    // Name validation function - allows letters, spaces, dots, apostrophes, hyphens
    const validateName = (value) => {
        const namePattern = /^[a-zA-Z\s.''-]+$/;
        return namePattern.test(value.trim()) && value.trim().length >= 2;
    };

    // Email validation
    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    // Phone validation
    const validatePhone = (phone) => {
        const phonePattern = /^\d{10,15}$/;
        return phonePattern.test(phone.replace(/\s+/g, ''));
    };

    // Address validation
    const validateAddress = (address) => {
        return address.trim().length >= 10;
    };

    // Set validation state for a field
    const setValidationState = (fieldId, isValid, errorMessage = '') => {
        const field = document.getElementById(fieldId);
        const validIcon = document.getElementById(`${fieldId}-valid`);
        const invalidIcon = document.getElementById(`${fieldId}-invalid`);
        const errorSpan = document.getElementById(`${fieldId}-error`);

        if (!field) return;

        // Clear previous states
        field.classList.remove('input-valid', 'input-error');
        if (validIcon) validIcon.classList.remove('valid');
        if (invalidIcon) invalidIcon.classList.remove('invalid');
        if (errorSpan) errorSpan.textContent = '';

        if (isValid) {
            field.classList.add('input-valid');
            if (validIcon) validIcon.classList.add('valid');
        } else {
            field.classList.add('input-error');
            if (invalidIcon) invalidIcon.classList.add('invalid');
            if (errorSpan) errorSpan.textContent = errorMessage;
        }
    };

    // Real-time validation setup
    const setupRealTimeValidation = () => {
        // Name fields validation
        ['fullname', 'fathername', 'mothername'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', function() {
                    const value = this.value;
                    if (value.length === 0) {
                        setValidationState(fieldId, false, '');
                        return;
                    }
                    
                    if (validateName(value)) {
                        setValidationState(fieldId, true);
                    } else {
                        setValidationState(fieldId, false, 'Only letters, spaces, dots, apostrophes and hyphens are allowed');
                    }
                });

                field.addEventListener('blur', function() {
                    const value = this.value;
                    if (value.length > 0 && !validateName(value)) {
                        setValidationState(fieldId, false, 'Please enter a valid name');
                    } else if (value.length > 0 && value.trim().length < 2) {
                        setValidationState(fieldId, false, 'Name must be at least 2 characters long');
                    }
                });
            }
        });

        // Email validation
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('input', function() {
                const value = this.value;
                if (value.length === 0) {
                    setValidationState('email', false, '');
                    return;
                }
                
                if (validateEmail(value)) {
                    setValidationState('email', true);
                } else {
                    setValidationState('email', false, 'Please enter a valid email address');
                }
            });
        }

        // Phone validation
        const phoneField = document.getElementById('phone');
        if (phoneField) {
            phoneField.addEventListener('input', function() {
                const value = this.value;
                if (value.length === 0) {
                    setValidationState('phone', false, '');
                    return;
                }
                
                if (validatePhone(value)) {
                    setValidationState('phone', true);
                } else {
                    setValidationState('phone', false, 'Please enter a valid phone number (10-15 digits)');
                }
            });
        }

        // Profession validation
        const professionField = document.getElementById('profession');
        if (professionField) {
            professionField.addEventListener('input', function() {
                const value = this.value;
                if (value.length === 0) {
                    setValidationState('profession', false, '');
                    return;
                }
                
                if (value.trim().length >= 2) {
                    setValidationState('profession', true);
                } else {
                    setValidationState('profession', false, 'Profession must be at least 2 characters long');
                }
            });
        }

        // Income validation
        const incomeField = document.getElementById('income');
        if (incomeField) {
            incomeField.addEventListener('input', function() {
                const value = this.value;
                if (value.length === 0) {
                    setValidationState('income', false, '');
                    return;
                }
                
                if (value > 0) {
                    setValidationState('income', true);
                } else {
                    setValidationState('income', false, 'Please enter a valid income amount');
                }
            });
        }

        // Address validation
        const addressField = document.getElementById('address');
        if (addressField) {
            addressField.addEventListener('input', function() {
                const value = this.value;
                if (value.length === 0) {
                    setValidationState('address', false, '');
                    return;
                }
                
                if (validateAddress(value)) {
                    setValidationState('address', true);
                } else {
                    setValidationState('address', false, 'Address must be at least 10 characters long');
                }
            });
        }

        // Height validation (feet and inches)
        const heightFeetField = document.getElementById('height-feet');
        const heightInchesField = document.getElementById('height-inches');
        
        const validateHeight = () => {
            const feet = heightFeetField ? parseInt(heightFeetField.value) || 0 : 0;
            const inches = heightInchesField ? parseInt(heightInchesField.value) || 0 : 0;
            
            if (feet === 0 && inches === 0) {
                setValidationState('height', false, '');
                return;
            }
            
            if (feet >= 3 && feet <= 8 && inches >= 0 && inches <= 11) {
                const totalInches = (feet * 12) + inches;
                if (totalInches >= 36 && totalInches <= 96) { // 3'0" to 8'0"
                    setValidationState('height', true);
                } else {
                    setValidationState('height', false, 'Height must be between 3\'0" and 8\'0"');
                }
            } else {
                setValidationState('height', false, 'Please enter valid feet (3-8) and inches (0-11)');
            }
        };

        if (heightFeetField) {
            heightFeetField.addEventListener('input', validateHeight);
        }
        if (heightInchesField) {
            heightInchesField.addEventListener('input', validateHeight);
        }

        // Birthdate validation
        const birthdateField = document.getElementById('birthdate');
        if (birthdateField) {
            birthdateField.addEventListener('input', function() {
                const value = this.value;
                if (value.length === 0) {
                    setValidationState('birthdate', false, '');
                    return;
                }
                
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                
                if (age >= 18 && age <= 100) {
                    setValidationState('birthdate', true);
                } else if (age < 18) {
                    setValidationState('birthdate', false, 'You must be at least 18 years old');
                } else {
                    setValidationState('birthdate', false, 'Please enter a valid birth date');
                }
            });
        }

        // Religion validation
        const religionField = document.getElementById('religion');
        if (religionField) {
            religionField.addEventListener('change', function() {
                const value = this.value;
                if (value && value.length > 0) {
                    setValidationState('religion', true);
                } else {
                    setValidationState('religion', false, 'Please select a religion');
                }
            });
        }

        // Expectations validation
        const expectationsField = document.getElementById('expectations');
        if (expectationsField) {
            expectationsField.addEventListener('input', function() {
                const value = this.value;
                if (value.length === 0) {
                    setValidationState('expectations', false, '');
                    return;
                }
                
                if (value.trim().length >= 50) {
                    setValidationState('expectations', true);
                } else {
                    setValidationState('expectations', false, `At least 50 characters required (${value.trim().length}/50)`);
                }
            });
        }
    };

    // Enhanced checkbox functionality
    const setupCheckboxes = () => {
        document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const item = this.closest('.checkbox-item');
                if (this.checked) {
                    item.classList.add('checked');
                } else {
                    item.classList.remove('checked');
                }
            });
        });
    };

    const validateStep = (stepNumber) => {
        let isValid = true;
        const currentStepFields = document.getElementById(`step-${stepNumber}`).querySelectorAll('[required]');
        
        currentStepFields.forEach(field => {
            const errorSpan = document.getElementById(`${field.id}-error`);
            field.classList.remove('input-error');
            if (errorSpan) errorSpan.textContent = '';

            let hasError = false;
            let errorMessage = '';

            if (field.type === 'radio') {
                const radioGroup = document.querySelector(`input[name="${field.name}"]:checked`);
                if (!radioGroup) {
                    hasError = true;
                    errorMessage = 'Please select a gender.';
                    document.getElementById('gender-error').textContent = errorMessage;
                }
            } else if (field.type === 'file') {
                // Profile picture is optional
            } else {
                // Custom validation for specific fields
                if (field.id === 'fullname' || field.id === 'fathername' || field.id === 'mothername') {
                    if (!field.value.trim()) {
                        hasError = true;
                        errorMessage = `${field.labels[0].textContent.replace('*','').trim()} is required.`;
                    } else if (!validateName(field.value)) {
                        hasError = true;
                        errorMessage = 'Only letters, spaces, dots, apostrophes and hyphens are allowed.';
                    }
                } else if (field.id === 'email') {
                    if (!field.value.trim()) {
                        hasError = true;
                        errorMessage = 'Email is required.';
                    } else if (!validateEmail(field.value)) {
                        hasError = true;
                        errorMessage = 'Please enter a valid email address.';
                    }
                } else if (field.id === 'phone') {
                    if (!field.value.trim()) {
                        hasError = true;
                        errorMessage = 'Phone number is required.';
                    } else if (!validatePhone(field.value)) {
                        hasError = true;
                        errorMessage = 'Please enter a valid phone number (10-15 digits).';
                    }
                } else if (field.id === 'address') {
                    if (!field.value.trim()) {
                        hasError = true;
                        errorMessage = 'Address is required.';
                    } else if (!validateAddress(field.value)) {
                        hasError = true;
                        errorMessage = 'Address must be at least 10 characters long.';
                    }
                } else if (field.id === 'birthdate') {
                    if (!field.value) {
                        hasError = true;
                        errorMessage = 'Birth date is required.';
                    } else {
                        const birthDate = new Date(field.value);
                        const today = new Date();
                        const age = today.getFullYear() - birthDate.getFullYear();
                        if (age < 18) {
                            hasError = true;
                            errorMessage = 'You must be at least 18 years old.';
                        }
                    }
                } else if (!field.checkValidity()) {
                    hasError = true;
                    if (field.validity.valueMissing) {
                        errorMessage = `${field.labels[0].textContent.replace('*','').trim()} is required.`;
                    } else if (field.validity.typeMismatch) {
                        errorMessage = `Please enter a valid ${field.type}.`;
                    } else if (field.validity.patternMismatch) {
                        errorMessage = 'Please match the requested format.';
                    } else if (field.validity.tooShort) {
                        errorMessage = `Minimum ${field.minLength} characters required.`;
                    } else {
                        errorMessage = 'This field has an error.';
                    }
                }
            }
            
            if (hasError) {
                setValidationState(field.id, false, errorMessage);
                isValid = false;
            }
        });
        
        return isValid;
    };

    // --- Dynamic Content ---
    const addEducationRow = () => {
        const newRow = document.createElement('div');
        newRow.className = 'education-row p-4 border rounded-lg grid grid-cols-1 md:grid-cols-5 gap-4 items-center relative animate-fade-in';
        newRow.innerHTML = `
            <div class="md:col-span-2">
                <label class="text-sm font-medium text-gray-700">Degree</label>
                <input type="text" name="degree" class="w-full mt-1 p-2 border border-gray-300 rounded-md focus-ring" placeholder="e.g., B.Sc. in CSE">
            </div>
            <div class="md:col-span-2">
                 <label class="text-sm font-medium text-gray-700">Institution</label>
                 <input type="text" name="institution" class="w-full mt-1 p-2 border border-gray-300 rounded-md focus-ring" placeholder="e.g., University of Dhaka">
            </div>
            <div>
                 <label class="text-sm font-medium text-gray-700">Year</label>
                 <input type="number" name="year" class="w-full mt-1 p-2 border border-gray-300 rounded-md focus-ring" placeholder="2020" min="1950" max="${new Date().getFullYear()}">
            </div>
             <div>
                 <label class="text-sm font-medium text-gray-700">Result/GPA</label>
                 <input type="text" name="result" class="w-full mt-1 p-2 border border-gray-300 rounded-md focus-ring" placeholder="3.80">
            </div>
            <div class="md:col-span-5 md:flex justify-end">
                 <button type="button" class="remove-education-btn text-red-500 hover:text-red-700 font-medium text-sm transition-transform hover:scale-110">
                   <i class="fas fa-trash-alt mr-1"></i> Remove
                 </button>
            </div>
        `;
        educationContainer.appendChild(newRow);
        newRow.querySelector('.remove-education-btn').addEventListener('click', () => {
            newRow.remove();
        });
    };

    // --- Event Listeners ---
    nextBtn.addEventListener('click', async () => {
        if (!validateStep(currentStep)) {
            showNotification('error', 'Validation Error', 'Please fix the errors before proceeding.');
            return;
        }

        if (currentStep < totalSteps) {
            currentStep++;
            if (currentStep === totalSteps) {
                nextBtn.disabled = true;
                nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Generating Preview...';
                await populateSummary();
                nextBtn.disabled = false;
                nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right ml-2"></i>';
            }
            updateUI();
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
        }
    });

    addEducationBtn.addEventListener('click', addEducationRow);
    
    document.getElementById('profilePicture').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('profilePreview').src = event.target.result;
                formData.profilePictureBase64 = event.target.result; // Immediately store for later use
            }
            reader.readAsDataURL(file);
        }
    });

    pdfBtn.addEventListener('click', async () => {
        pdfBtn.disabled = true;
        pdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Creating PDF...';
        showNotification('info', 'Generating PDF', 'Your profile PDF is being created...');
        
        const currentData = await collectFormData();
        const { jsPDF } = window.jspdf;
        const pdfPreview = document.getElementById('pdf-preview-container');
        
        // Use the same summary function to ensure consistency
        await populateSummary(); 
        const summaryContent = document.getElementById('summary-container').innerHTML;

        pdfPreview.innerHTML = `
            <div class="p-8">
                <div class="text-center mb-8">
                    <h1 class="text-4xl font-bold text-gray-800">Matrimonial Profile</h1>
                </div>
                ${summaryContent}
                 <p class="text-center text-xs text-gray-400 mt-10">Generated on ${new Date().toLocaleDateString()}</p>
            </div>
        `;
        
        const canvas = await html2canvas(pdfPreview, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        const widthInPdf = pdfWidth - 20;
        const heightInPdf = widthInPdf / ratio;

        pdf.addImage(imgData, 'PNG', 10, 10, widthInPdf, heightInPdf);
        pdf.save(`Matrimonial_Profile_${currentData.fullname.replace(/\s+/g, '_') || 'user'}.pdf`);
        
        pdfPreview.innerHTML = '';
        pdfBtn.disabled = false;
        pdfBtn.innerHTML = '<i class="fas fa-file-pdf mr-2"></i> Download PDF';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';
        
        const finalData = await collectFormData();
        console.log('Form Submitted Data:', finalData);
        
        showNotification('success', 'Registration Complete!', 'Your profile has been submitted successfully.');
        submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Submitted';
    });
    
    // Reset Modal Logic
    resetBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    cancelResetBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    confirmResetBtn.addEventListener('click', () => {
        currentStep = 1;
        formData = {};
        form.reset();
        document.getElementById('profilePreview').src = 'https://placehold.co/150x150/e0e7ff/3730a3?text=Upload+Photo';
        educationContainer.innerHTML = '';
        addEducationRow();
        
        // Clear validation states
        document.querySelectorAll('.text-red-500.text-sm').forEach(span => span.textContent = '');
        document.querySelectorAll('.input-error, .input-valid').forEach(input => {
            input.classList.remove('input-error', 'input-valid');
        });
        document.querySelectorAll('.validation-icon').forEach(icon => {
            icon.classList.remove('valid', 'invalid');
        });
        document.querySelectorAll('.checkbox-item.checked').forEach(item => {
            item.classList.remove('checked');
        });
        
        updateUI();
        modal.classList.add('hidden');
        showNotification('info', 'Form Reset', 'You can now start over from the beginning.');
    });

    // Initial setup
    addEducationRow();
    setupRealTimeValidation();
    setupCheckboxes();
    updateUI();
});
