# Contributing to Job Autofill Extension

Thank you for wanting to contribute! This is an open-source project and all contributions are welcome — bug fixes, new portal support, UI improvements, or documentation.

---

## 🧭 Before You Start

- Check [open issues](https://github.com/sumit1894/job-autofill-extension/issues) to avoid duplicating work
- For large changes, open an issue first to discuss the approach
- Keep PRs focused — one feature or fix per PR

---

## 🛠️ Local Setup

```bash
git clone https://github.com/sumit1894/job-autofill-extension.git
cd job-autofill-extension
npm install
npm run build
```

Then load the `/dist` folder as an unpacked extension in Chrome (`chrome://extensions` → Developer mode → Load unpacked).

During development, run:

```bash
npm run dev
```

This watches for changes and rebuilds automatically. Reload the extension in Chrome after each build.

---

## 📁 Where Things Live

| File | What it does |
|---|---|
| `src/App.jsx` | The popup UI — all form fields and tabs live here |
| `src/content.js` | Runs on job portal pages — handles all autofill logic |
| `manifest.json` | Chrome extension config — permissions, content script rules |

---

## 🌐 Adding Support for a New Portal

1. Open the portal's job application page
2. Inspect the form fields (right-click → Inspect)
3. Note how labels are structured — by `name`, `id`, `aria-label`, or a wrapper `<label>`
4. Add any new keywords to the relevant mapping in `content.js` under `buildMappings()`
5. If the portal uses custom dropdowns (div/span based), note the class names and add a selector to the custom dropdown section
6. Test, then open a PR with the portal name in the title: `feat: add Shine.com support`

---

## 🐛 Reporting a Bug

Open an issue with:
- Which portal it's failing on
- Which field isn't being filled
- What happens (field stays empty / wrong value / dropdown doesn't open)
- Browser version

---

## ✅ PR Checklist

- [ ] Tested on at least one job portal
- [ ] No `console.log` left in production paths (use them only for debug)
- [ ] PR title follows format: `fix:`, `feat:`, `docs:`, `refactor:`
- [ ] Description explains what changed and why

---

## 💡 Good First Issues

Look for issues tagged [`good first issue`](https://github.com/sumit1894/job-autofill-extension/issues?q=is%3Aissue+label%3A%22good+first+issue%22):

- Add keyword aliases for a specific portal
- Fix a broken dropdown on a specific site
- Improve the popup UI
- Write tests

---

## 📄 License

By contributing, you agree your contributions will be licensed under the [MIT License](./LICENSE).