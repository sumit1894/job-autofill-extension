import { useState, useEffect } from "react";

// ─── Field definitions ────────────────────────────────────────────────
const TEXT_FIELDS = [
  { key: "fullName",       placeholder: "Full Name",              icon: "👤", type: "text"  },
  { key: "email",          placeholder: "Email",                  icon: "📧", type: "email" },
  { key: "phone",          placeholder: "Phone / Mobile",         icon: "📱", type: "tel"   },
  { key: "college",        placeholder: "College / University",   icon: "🏛️", type: "text"  },
  { key: "degree",         placeholder: "Degree (e.g. B.Tech)",   icon: "🎓", type: "text"  },
  { key: "branch",         placeholder: "Branch / Major",         icon: "📚", type: "text"  },
  { key: "graduationYear", placeholder: "Graduation Year",        icon: "📅", type: "text"  },
  { key: "cgpa",           placeholder: "CGPA / Percentage",      icon: "📊", type: "text"  },
  { key: "experience",     placeholder: "Experience (years)",     icon: "💼", type: "text"  },
  { key: "currentCTC",     placeholder: "Current CTC (LPA)",      icon: "💰", type: "text"  },
  { key: "expectedCTC",    placeholder: "Expected CTC (LPA)",     icon: "💸", type: "text"  },
  { key: "noticePeriod",   placeholder: "Notice Period (days)",   icon: "📋", type: "text"  },
  { key: "currentLocation",placeholder: "Current Location",       icon: "📍", type: "text"  },
  { key: "linkedin",       placeholder: "LinkedIn Profile URL",   icon: "🔗", type: "url"   },
  { key: "github",         placeholder: "GitHub Profile URL",     icon: "🐙", type: "url"   },
  { key: "portfolio",      placeholder: "Portfolio / Website",    icon: "🌐", type: "url"   },
];

const SELECT_FIELDS = [
  {
    key: "gender",
    label: "Gender",
    icon: "🧑",
    options: ["", "Male", "Female", "Non-binary", "Prefer not to say"],
  },
  {
    key: "workMode",
    label: "Preferred Work Mode",
    icon: "🏠",
    options: ["", "Remote", "On-site", "Hybrid"],
  },
  {
    key: "employmentType",
    label: "Employment Type",
    icon: "📝",
    options: ["", "Full-time", "Part-time", "Internship", "Contract", "Freelance"],
  },
];

const ALL_KEYS = [
  ...TEXT_FIELDS.map((f) => f.key),
  ...SELECT_FIELDS.map((f) => f.key),
];

// ─── Sections for tabbed UI ───────────────────────────────────────────
const SECTIONS = [
  {
    label: "Personal",
    icon: "👤",
    textKeys: ["fullName", "email", "phone", "gender", "currentLocation"],
  },
  {
    label: "Education",
    icon: "🎓",
    textKeys: ["college", "degree", "branch", "graduationYear", "cgpa"],
  },
  {
    label: "Career",
    icon: "💼",
    textKeys: [
      "experience", "currentCTC", "expectedCTC",
      "noticePeriod", "workMode", "employmentType",
    ],
  },
  {
    label: "Links",
    icon: "🔗",
    textKeys: ["linkedin", "github", "portfolio"],
  },
];

export function App() {
  const [formData, setFormData] = useState(
    Object.fromEntries(ALL_KEYS.map((k) => [k, ""]))
  );
  const [activeTab, setActiveTab] = useState(0);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!chrome?.storage?.local) return;
    chrome.storage.local.get(ALL_KEYS, (data) => {
      setFormData((prev) => ({ ...prev, ...data }));
    });
  }, []);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const saveData = async () => {
    try {
      await chrome.storage.local.set(formData);
      setStatus("saved");
      setTimeout(() => setStatus(null), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 2000);
    }
  };

  const autoFill = async () => {
    try {
      setStatus("filling");
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.sendMessage(tab.id, { action: "AUTOFILL" });
      setTimeout(() => setStatus("done"), 600);
      setTimeout(() => setStatus(null), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 2000);
    }
  };

  const clearAll = async () => {
    await chrome.storage.local.remove(ALL_KEYS);
    setFormData(Object.fromEntries(ALL_KEYS.map((k) => [k, ""])));
  };

  const filledCount = ALL_KEYS.filter((k) => formData[k]?.trim()).length;
  const progress = Math.round((filledCount / ALL_KEYS.length) * 100);

  // Render a single field (text or select)
  const renderField = (key) => {
    const textField = TEXT_FIELDS.find((f) => f.key === key);
    const selectField = SELECT_FIELDS.find((f) => f.key === key);

    if (selectField) {
      return (
        <div key={key} style={styles.fieldRow}>
          <span style={styles.fieldIcon}>{selectField.icon}</span>
          <select
            value={formData[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            style={{
              ...styles.select,
              color: formData[key] ? "#1e1b4b" : "#9ca3af",
            }}
          >
            {selectField.options.map((opt) => (
              <option key={opt} value={opt} style={{ color: "#1e1b4b" }}>
                {opt || selectField.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (textField) {
      return (
        <div key={key} style={{
          ...styles.fieldRow,
          borderColor: formData[key]?.trim() ? "#4f46e5" : "#e2e0f0",
        }}>
          <span style={styles.fieldIcon}>{textField.icon}</span>
          <input
            type={textField.type}
            placeholder={textField.placeholder}
            value={formData[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            style={styles.input}
          />
        </div>
      );
    }

    return null;
  };

  const currentSection = SECTIONS[activeTab];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>✦</div>
          <span style={styles.title}>Job Autofill</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.progressText}>{progress}%</span>
          <div style={styles.badge}>{filledCount}/{ALL_KEYS.length}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressBar, width: `${progress}%` }} />
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {SECTIONS.map((sec, i) => (
          <button
            key={sec.label}
            onClick={() => setActiveTab(i)}
            style={{
              ...styles.tab,
              ...(activeTab === i ? styles.tabActive : {}),
            }}
          >
            <span style={{ fontSize: "12px" }}>{sec.icon}</span>
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      {/* Fields for active tab */}
      <div style={styles.fields}>
        {currentSection.textKeys.map((key) => renderField(key))}
      </div>

      {/* Status */}
      {status && (
        <div style={{
          ...styles.statusMsg,
          background: status === "error" ? "#fee2e2"
            : status === "saved" || status === "done" ? "#dcfce7"
            : "#ede9fe",
          color: status === "error" ? "#991b1b"
            : status === "saved" || status === "done" ? "#166534"
            : "#4c1d95",
        }}>
          {status === "saved"   && "✓ Profile saved!"}
          {status === "filling" && "⚡ Filling form…"}
          {status === "done"    && "✓ Autofill complete!"}
          {status === "error"   && "✗ Something went wrong"}
        </div>
      )}

      {/* Actions */}
      <div style={styles.actions}>
        <button onClick={saveData} style={styles.btnPrimary}>Save Profile</button>
        <button onClick={autoFill} style={styles.btnSecondary}>⚡ Autofill</button>
      </div>

      <button onClick={clearAll} style={styles.btnClear}>Clear all data</button>
    </div>
  );
}

const styles = {
  container: {
    width: "340px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: "#faf9ff",
    padding: "0 0 12px 0",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px 10px",
    borderBottom: "1px solid #ede9fe",
    background: "#fff",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "8px" },
  headerRight: { display: "flex", alignItems: "center", gap: "8px" },
  logo: {
    width: "26px", height: "26px",
    background: "#4f46e5", borderRadius: "7px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", color: "#fff",
  },
  title: { fontWeight: "600", fontSize: "15px", color: "#1e1b4b" },
  progressText: { fontSize: "11px", color: "#6d28d9", fontWeight: "600" },
  badge: {
    fontSize: "11px", fontWeight: "600", color: "#6d28d9",
    background: "#ede9fe", padding: "2px 7px", borderRadius: "999px",
  },
  progressTrack: { height: "3px", background: "#ede9fe", width: "100%" },
  progressBar: {
    height: "100%", background: "#4f46e5",
    transition: "width 0.3s ease", borderRadius: "0 2px 2px 0",
  },
  tabs: {
    display: "flex",
    borderBottom: "1px solid #ede9fe",
    background: "#fff",
  },
  tab: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", gap: "2px",
    padding: "8px 4px", border: "none", background: "transparent",
    fontSize: "10px", color: "#9ca3af", cursor: "pointer",
    borderBottom: "2px solid transparent", fontWeight: "500",
    transition: "all 0.15s",
  },
  tabActive: {
    color: "#4f46e5",
    borderBottom: "2px solid #4f46e5",
    background: "#faf9ff",
  },
  fields: {
    padding: "10px 14px 4px",
    display: "flex", flexDirection: "column", gap: "6px",
    maxHeight: "280px", overflowY: "auto",
  },
  fieldRow: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "#fff", border: "1px solid #e2e0f0",
    borderRadius: "8px", padding: "0 10px",
    transition: "border-color 0.15s",
  },
  fieldIcon: { fontSize: "13px", flexShrink: 0 },
  input: {
    flex: 1, border: "none", outline: "none",
    background: "transparent", padding: "9px 0",
    fontSize: "13px", color: "#1e1b4b", width: "100%",
  },
  select: {
    flex: 1, border: "none", outline: "none",
    background: "transparent", padding: "9px 0",
    fontSize: "13px", width: "100%", cursor: "pointer",
    appearance: "none",
  },
  statusMsg: {
    margin: "8px 14px 0", padding: "7px 12px",
    borderRadius: "8px", fontSize: "12px",
    fontWeight: "500", textAlign: "center",
  },
  actions: { display: "flex", gap: "8px", padding: "10px 14px 4px" },
  btnPrimary: {
    flex: 1, padding: "9px 0", background: "#4f46e5",
    color: "#fff", border: "none", borderRadius: "8px",
    fontWeight: "600", fontSize: "13px", cursor: "pointer",
  },
  btnSecondary: {
    flex: 1, padding: "9px 0", background: "#fff",
    color: "#4f46e5", border: "1.5px solid #4f46e5",
    borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer",
  },
  btnClear: {
    display: "block", margin: "4px auto 0",
    background: "none", border: "none",
    color: "#9ca3af", fontSize: "11px",
    cursor: "pointer", padding: "4px 8px", textDecoration: "underline",
  },
};