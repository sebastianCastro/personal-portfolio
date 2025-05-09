// JavaScript for Contact Form Popup functionality with Web3Forms integration
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements - only target links that say "Contact"
    const contactLinks = document.querySelectorAll('a.nav-link:nth-child(4), a.mobile-nav-link:last-child, a.contact-btn');
    
    const contactPopup = document.getElementById('contact-popup');
    const closeButton = document.getElementById('close-popup');
    const contactForm = document.getElementById('contact-form');
    const senderEmail = document.getElementById('sender-email');
    const subjectSelect = document.getElementById('subject');
    const messageField = document.getElementById('message');
    const sendButton = document.getElementById('send-button');
    const attachButton = document.getElementById('attach-button');
    const fileInput = document.getElementById('file-input');
    const resultDiv = document.createElement('div'); // Create result div for Web3Forms messages
    resultDiv.id = 'result';
    contactForm.appendChild(resultDiv);
    
    // Open popup when contact links are clicked
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            contactPopup.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close popup when X button is clicked
    closeButton.addEventListener('click', function() {
        contactPopup.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    });
    
    // Close popup when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === contactPopup) {
            contactPopup.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Handle file input when attach button is clicked
    attachButton.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        const fileName = this.files[0]?.name;
        if (fileName) {
            // Update attach button with file name
            const truncatedName = fileName.length > 10 ? fileName.substring(0, 10) + '...' : fileName;
            const attachIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`;
            
            attachButton.innerHTML = `${attachIcon} ${truncatedName}`;
        }
    });
    
    // Function to check if form is valid and enable/disable send button
    function validateForm() {
        const isValid = 
            senderEmail.value.trim() !== '' && 
            senderEmail.validity.valid &&
            subjectSelect.value !== '' &&
            messageField.value.trim() !== '';
        
        // Update send button state
        sendButton.disabled = !isValid;
    }
    
    // Add input listeners to form fields
    [senderEmail, subjectSelect, messageField].forEach(field => {
        field.addEventListener('input', validateForm);
        field.addEventListener('change', validateForm);
    });
    
    // Handle form submission with Web3Forms
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data and create form data object for Web3Forms
        const formData = new FormData();
        
        // Add Web3Forms required fields
        formData.append('access_key', '82b20fdf-e5e9-4b43-a37b-616c0304ef3e');
        formData.append('subject', 'New contact from your website: ' + subjectSelect.value);
        formData.append('from_name', 'Website Contact Form');
        
        // Add user data
        formData.append('email', senderEmail.value);
        formData.append('message', messageField.value);
        formData.append('subject_choice', subjectSelect.value);
        
        // Add attachment information if available
        if (fileInput.files[0]) {
            formData.append('attachment_info', fileInput.files[0].name);
        }
        
        // Convert FormData to JSON for the fetch API
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
        
        // Update UI to show loading state
        sendButton.disabled = true;
        resultDiv.innerHTML = "Please wait...";
        resultDiv.style.display = "block";
        
        // Send data to Web3Forms
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                // Show success message
                showSuccessMessage();
            } else {
                console.log(response);
                resultDiv.innerHTML = json.message;
            }
        })
        .catch(error => {
            console.log(error);
            resultDiv.innerHTML = "Something went wrong!";
            sendButton.disabled = false;
        });
    });
    
    // Function to show success message
    function showSuccessMessage() {
        const popupBody = document.querySelector('.popup-body');
        popupBody.innerHTML = `
            <div class="success-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. I'll get back to you soon.</p>
                <button id="close-success" class="cta-btn download-btn">Close</button>
            </div>
        `;
        
        // Add close button functionality
        document.getElementById('close-success').addEventListener('click', function() {
            contactPopup.style.display = 'none';
            document.body.style.overflow = '';
            
            // Reset form after a delay (for when popup is opened again)
            setTimeout(() => {
                contactForm.reset();
                validateForm();
                document.querySelector('.popup-body').innerHTML = '';
                document.querySelector('.popup-body').appendChild(contactForm);
                
                // Reset attach button text and result div
                const attachIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`;
                const sendButton = '<button type="submit" id="send-button" disabled>Send</button>'
                
                attachButton.innerHTML = `${attachIcon} Attach`;
                resultDiv.style.display = "none";
                resultDiv.innerHTML = "";
                sendButton.disabled = false;
            }, 500);
        });
    }
    
    // Initialize form validation
    validateForm();
});