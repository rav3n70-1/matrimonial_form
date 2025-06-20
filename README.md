# 💍 Modern Multi-Step Matrimony Registration Form

A sleek, user-friendly, **multi-step registration form** built specifically for matrimonial websites. This project transforms a traditional long form into a modern, interactive wizard—enhancing the user experience with a clean design, subtle animations, and intuitive flow.

The form is fully responsive, provides instant validation feedback, and enables users to download a professionally formatted PDF of their submitted profile.

---

## 📸 Live Preview

> _It’s highly recommended to include a screenshot or a short GIF demo of the form here._  
Use tools like **ScreenToGif** or **Giphy Capture** to record your form in action for better visual appeal.

---

## ✨ Features

This project is packed with features to ensure a smooth and modern registration experience:

- **🔢 Multi-Step Wizard**  
  Breaks the registration into four manageable steps — _Personal_, _Professional_, _Education_, and _Preview_ — reducing user fatigue.

- **📊 Interactive Progress Bar**  
  Clearly shows users where they are in the form process.

- **📱 Fully Responsive Layout**  
  Adapts seamlessly across devices using **Tailwind CSS**.

- **🖼️ Live Photo Preview**  
  Instant preview of uploaded profile pictures.

- **🎓 Dynamic Education Section**  
  Add or remove multiple educational qualifications on the fly.

- **📝 Comprehensive Final Preview**  
  Displays a clean, formatted summary of all inputs before submission.

- **📄 PDF Profile Download**  
  Generate a professional-looking PDF version of the user's profile using **jsPDF** and **html2canvas**.

- **✅ Real-Time Validation**  
  Immediate feedback for required fields and formatting—no page reloads needed.

- **🔔 Custom Toast Notifications**  
  Smooth, animated feedback messages (instead of default `alert()` boxes).

- **⚠️ Confirmation Modals**  
  Protects against accidental data loss by confirming form resets.

- **🎨 Modern UI/UX Enhancements**  
  Subtle animated backgrounds, hover effects, loading indicators, and smooth step transitions.

---

## 🛠️ Tech Stack

### Frontend:
- **HTML5**
- **CSS3** (with **Tailwind CSS**)
- **JavaScript (ES6+)**

### Libraries & Dependencies:
- **Font Awesome** – Icon library  
- **jsPDF** – Client-side PDF generation  
- **html2canvas** – HTML to image conversion  
- **Google Fonts** – 'Inter' typeface for modern typography

---

## 📁 File Structure

.
├── 📄 index.html # Main structure of the form
├── 🎨 style.css # Custom styles and animations
└── ⚙️ script.js # Core logic: step navigation, validation, dynamic fields, and PDF generation

yaml
Always show details

Copy

---


## 🚀 Getting Started

You can run this project locally in just a few steps:

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
Or download the ZIP file directly.

Navigate into the project folder

bash
Always show details

Copy
cd your-repo-name
Open the form in a browser
Simply open index.html in any modern browser—no server required, as all dependencies are included via CDN.

🧠 Code Highlights
Key logic is implemented in script.js. Here are some core highlights:

🔄 State Management
A currentStep variable tracks the user’s position. The updateUI() function ensures the correct view, progress, and button visibility after every change.

🧵 Async Data Handling
collectFormData() is built with async/await to handle image file reading and ensure all data (including Base64 image data) is ready before generating the preview or PDF.

🖨️ Summary & PDF Matching
The populateSummary() function dynamically builds the final preview and ensures PDF output matches the user interface perfectly.

📄 License
This project is licensed under the MIT License.
See the LICENSE file for full details.

🙌 Contributing
Pull requests and contributions are welcome!
Feel free to open issues for suggestions, bugs, or improvements.
"""
