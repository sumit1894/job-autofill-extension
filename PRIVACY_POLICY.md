# Privacy Policy — Job Autofill Extension

**Last updated:** June 19, 2026

This privacy policy explains what data the Job Autofill Chrome Extension ("the Extension") collects, how it is used, and how it is stored.

---

## 1. What Data We Collect

The Extension collects only the information you manually enter into the popup, including:

- Full name, email, phone number
- Gender, current location
- College, degree, branch, CGPA, graduation year
- Experience, current/expected CTC, notice period
- Work mode and employment type preferences
- LinkedIn, GitHub, and portfolio URLs

We do **not** collect:
- Browsing history
- Passwords or login credentials
- Data from websites you visit, beyond the form fields the Extension fills in
- Any analytics, tracking, or telemetry data

---

## 2. How Data Is Stored

All data you enter is stored locally on your device using Chrome's `storage.local` API.

- This data **never leaves your browser**
- It is **not sent to any server**, including ours
- It is **not shared with any third party**
- It is only accessible to the Extension itself, on your device

---

## 3. How Data Is Used

The data you save is used exclusively to autofill job application forms on supported job portals (LinkedIn, Naukri, Internshala, Indeed, Unstop, and others) when you click the "Autofill" button.

The Extension reads the current page's form fields and fills them with your saved data. It does not read or transmit any other content from the pages you visit.

---

## 4. Permissions We Request

| Permission | Why We Need It |
|---|---|
| `storage` | To save your profile data locally on your device |
| `activeTab` | To autofill the form on the tab you're currently viewing |
| `scripting` | To inject the autofill logic into the job portal page |

We do not request `tabs`, `history`, `cookies`, `webRequest`, or any permission beyond what's needed to fill forms on the active tab.

---

## 5. Third-Party Services

Currently, the Extension does not send any data to third-party services.

**Future feature notice:** If you choose to use the optional "Resume Upload + AI Extraction" feature (when released), your resume content will be sent to Anthropic's Claude API solely to extract structured profile data (name, email, education, skills, etc.). This will only happen if you explicitly upload a resume and opt in. Anthropic's own privacy policy governs that data transfer: https://www.anthropic.com/legal/privacy

---

## 6. Data Deletion

You can delete all stored data at any time by:
- Clicking "Clear all data" in the Extension popup, or
- Uninstalling the Extension (Chrome automatically removes all `storage.local` data on uninstall)

---

## 7. Children's Privacy

This Extension is not directed at children under 13 and does not knowingly collect data from children.

---

## 8. Changes to This Policy

We may update this privacy policy as the Extension adds features. Changes will be reflected in this document with an updated "Last updated" date.

---

## 9. Contact

For questions about this privacy policy, open an issue at:
https://github.com/sumit1894/job-autofill-extension/issues