<div align="center">

# ✦ Job Autofill Extension

**A Chrome extension that auto-fills job application forms across major job portals.**

![Version](/public/icons/icon16.png)
<!-- ![License](https://img.shields.io/badge/license-MIT-4f46e5)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)
![Built With](https://img.shields.io/badge/built%20with-React%20%2B%20Vite-61dafb) -->

[Features](#features) • [Supported Portals](#supported-portals) • [Installation](#installation) • [Contributing](#contributing) • [Roadmap](#roadmap)

</div>

---

## 📌 What is this?

Job Autofill is an open-source Chrome extension that saves your profile once and fills job application forms automatically — across LinkedIn, Naukri, Internshala, Indeed, Unstop, and more.

No more typing your name, email, college, and LinkedIn URL on every single application.

---

## ✨ Features

- ⚡ **One-click autofill** across multiple job portals
- 👤 **16+ fields** — name, email, phone, college, degree, CGPA, skills, CTC, notice period, and more
- 🔽 **Dropdown support** — fills `<select>`, radio buttons, and custom div-based dropdowns
- 🧠 **Smart label scanning** — finds fields by label text, not just `name` or `id`
- ⚛️ **React/Vue compatible** — uses native value setters so modern SPAs register the fill
- 👁️ **MutationObserver** — watches for new fields on multi-step forms and fills them automatically
- 🔒 **100% local** — all data stored in `chrome.storage.local`, never sent anywhere

---

## 🌐 Supported Portals

| Portal | Text Fields | Dropdowns | Multi-step |
|---|---|---|---|
| LinkedIn | ✅ | 🔄 In Progress | ✅ |
| Naukri | ✅ | ✅ | ✅ |
| Internshala | ✅ | ✅ | ✅ |
| Indeed | ✅ | 🔄 In Progress | ✅ |
| Unstop | ✅ | ✅ | ✅ |

---

## 🚀 Installation (Development)

### Prerequisites
- Node.js 18+
- Chrome browser

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/job-autofill-extension.git
cd job-autofill-extension

# 2. Install dependencies
npm install

# 3. Build the extension
npm run build

# 4. Load in Chrome
# Open chrome://extensions
# Enable "Developer mode" (top right toggle)
# Click "Load unpacked"
# Select the /dist folder
```

---

## 🗂️ Project Structure

```
job-autofill-extension/
├── src/
│   ├── App.jsx          # Popup UI (React)
│   ├── main.jsx         # React entry point
│   └── content.js       # Content script (runs on job portals)
├── public/
│   └── icons/           # Extension icons (16, 48, 128px)
├── manifest.json        # Chrome extension manifest (v3)
├── index.html           # Popup HTML shell
├── vite.config.js       # Vite build config
├── CONTRIBUTING.md      # How to contribute
└── README.md
```

---

## 🗺️ Roadmap

| Version | Feature | Status |
|---|---|---|
| V1.0 | Core autofill (text fields) | ✅ Done |
| V1.1 | Dropdown + radio button support | 🔄 In Progress |
| V1.2 | Skills tag-input support | 📋 Planned |
| V1.3 | Hardened React/LinkedIn support | 📋 Planned |
| V1.4 | Resume upload + AI data extraction | 📋 Planned |

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

Good first issues are tagged [`good first issue`](https://github.com/YOUR_USERNAME/job-autofill-extension/issues?q=is%3Aissue+label%3A%22good+first+issue%22) on GitHub.

---

## 📄 License

MIT © [Your Name](https://github.com/YOUR_USERNAME)

</div>