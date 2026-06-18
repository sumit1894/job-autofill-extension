console.log("Job Autofill Loaded");

// ─── helpers ─────────────────────────────────────────────────────────

function getLabel(el) {
  // 1. explicit <label for="id">
  if (el.id) {
    const lbl = document.querySelector(`label[for="${el.id}"]`);
    if (lbl) return lbl.innerText;
  }
  // 2. wrapping <label>
  const parent = el.closest("label");
  if (parent) return parent.innerText;
  // 3. closest sibling / parent label text (common on Naukri / Internshala)
  const wrapper = el.closest("div, li, td, span[class]");
  if (wrapper) {
    const lbl = wrapper.querySelector("label, .label, [class*='label'], [class*='Label']");
    if (lbl) return lbl.innerText;
    // return first text node text from wrapper
    for (const node of wrapper.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        return node.textContent.trim();
      }
    }
  }
  return "";
}

function fingerprint(el) {
  return [
    el.name || "",
    el.placeholder || "",
    el.id || "",
    el.getAttribute("aria-label") || "",
    el.getAttribute("aria-labelledby") || "",
    el.getAttribute("data-label") || "",
    el.getAttribute("data-placeholder") || "",
    el.getAttribute("data-fieldname") || "",
    getLabel(el),
  ].join(" ").toLowerCase().replace(/[_\-\/]/g, " ");
}

function fuzzyMatch(fp, keywords) {
  return keywords.some((kw) => fp.includes(kw.toLowerCase()));
}

// Fill a native <input> or <textarea> in a way React / Vue / Angular respect
function fillInput(el, value) {
  if (!value) return false;
  if (el.value === value) return true; // already correct

  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype, "value"
  )?.set;
  const nativeTextareaSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype, "value"
  )?.set;

  const setter = el.tagName === "TEXTAREA" ? nativeTextareaSetter : nativeInputValueSetter;
  if (setter) setter.call(el, value);
  else el.value = value;

  ["input", "change", "blur"].forEach((evt) =>
    el.dispatchEvent(new Event(evt, { bubbles: true }))
  );
  // React synthetic event trick
  el.dispatchEvent(new InputEvent("input", { bubbles: true, data: value }));
  console.log(`✓ input filled: "${value}"`);
  return true;
}

// Fill a <select> by fuzzy-matching option text
function fillSelect1(el, value) {
  if (!value) return false;
  const v = value.toLowerCase();
  let bestOption = null;

  for (const opt of el.options) {
    const ot = opt.text.toLowerCase();
    if (ot === v || ot.includes(v) || v.includes(ot)) {
      bestOption = opt;
      if (ot === v) break; // exact — stop
    }
  }

  if (!bestOption) return false;

  el.value = bestOption.value;
  el.dispatchEvent(new Event("change", { bubbles: true }));
  el.dispatchEvent(new Event("input", { bubbles: true }));
  console.log(`✓ select filled: "${bestOption.text}"`);
  return true;
}
function fillSelect(el, value) {
  if (!value) return false;

  const target = value.toLowerCase().trim();

  for (const option of el.options) {
    const text = option.textContent.toLowerCase().trim();

    if (
      text === target ||
      text.includes(target) ||
      target.includes(text)
    ) {
      el.value = option.value;

      el.dispatchEvent(
        new Event("change", { bubbles: true })
      );

      el.dispatchEvent(
        new Event("input", { bubbles: true })
      );

      console.log(
        `✓ Selected "${option.textContent}"`
      );

      return true;
    }
  }

  console.log(
    `✗ Could not find option "${value}"`
  );

  return false;
}

// Fill radio buttons: click the one whose label fuzzy-matches the value
function fillRadio(groupName, value) {
  if (!value) return false;
  const v = value.toLowerCase();
  const radios = document.querySelectorAll(`input[type="radio"][name="${groupName}"]`);
  for (const r of radios) {
    const fp = fingerprint(r);
    const labelText = getLabel(r).toLowerCase();
    if (labelText === v || labelText.includes(v) || fp.includes(v)) {
      r.checked = true;
      r.dispatchEvent(new Event("change", { bubbles: true }));
      r.dispatchEvent(new Event("click", { bubbles: true }));
      console.log(`✓ radio filled: "${labelText}"`);
      return true;
    }
  }
  return false;
}

// Collect all elements inside shadow roots too (LinkedIn uses them)
function getAllInputs(root = document) {
  const results = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let node;
  while ((node = walker.nextNode())) {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(node.tagName)) {
      const t = (node.type || "").toLowerCase();
      if (!["hidden", "file", "submit", "button", "image", "reset", "checkbox"].includes(t)) {
        results.push(node);
      }
    }
    // pierce shadow DOM
    if (node.shadowRoot) results.push(...getAllInputs(node.shadowRoot));
  }
  return results;
}

// ─── field mapping ───────────────────────────────────────────────────

function buildMappings(data) {
  return [
    // ── Personal ──
    {
      keywords: ["full name", "fullname", "candidate name", "applicant name", "your name",
        "first name", "firstname", "name"],
      value: data.fullName,
    },
    {
      keywords: ["email", "email address", "e-mail", "mail id"],
      value: data.email,
    },
    {
      keywords: ["phone", "mobile", "mobile number", "contact number",
        "phone number", "contact", "whatsapp"],
      value: data.phone,
    },
    {
      keywords: ["gender"],
      value: data.gender,
      isSelect: true,
      isRadio: true,
    },
    {
      keywords: ["current location", "location", "city", "current city",
        "residing city", "place"],
      value: data.currentLocation,
    },

    // ── Education ──
    {
      keywords: ["college", "college name", "university", "institute",
        "institution", "school name", "alma mater"],
      value: data.college,
    },
    {
      keywords: ["degree", "qualification", "highest qualification",
        "education", "academic"],
      value: data.degree,
      isSelect: true,
    },
    {
      keywords: ["branch", "major", "specialization", "stream", "subject"],
      value: data.branch,
    },
    {
      keywords: ["graduation year", "passing year", "pass out year",
        "year of passing", "completion year"],
      value: data.graduationYear,
    },
    {
      keywords: ["cgpa", "gpa", "percentage", "marks", "score"],
      value: data.cgpa,
    },

    // ── Career ──
    {
      keywords: ["experience", "years of experience", "work experience",
        "total experience", "exp"],
      value: data.experience,
    },
    {
      keywords: ["current ctc", "current salary", "present ctc",
        "current package", "ctc"],
      value: data.currentCTC,
    },
    {
      keywords: ["expected ctc", "expected salary", "expected package",
        "salary expectation"],
      value: data.expectedCTC,
    },
    {
      keywords: ["notice period", "notice", "joining period",
        "available to join", "days to join"],
      value: data.noticePeriod,
    },
    {
      keywords: ["work mode", "work type", "job type", "remote",
        "employment type", "work from"],
      value: data.workMode,
      isSelect: true,
      isRadio: true,
    },

    // ── Links ──
    {
      keywords: ["linkedin", "linkedin profile", "linkedin url", "linked in"],
      value: data.linkedin,
    },
    {
      keywords: ["github", "github profile", "github url", "git hub"],
      value: data.github,
    },
    {
      keywords: ["portfolio", "portfolio link", "website", "personal website",
        "personal url", "blog"],
      value: data.portfolio,
    },
  ];
}

// ─── main autofill logic ──────────────────────────────────────────────

function runAutofill(data) {
  const mappings = buildMappings(data);
  const inputs = getAllInputs();
  const filledRadioGroups = new Set();

  // 1. Handle radio buttons first (by group name)
  const radioInputs = document.querySelectorAll("input[type='radio']");
  const radioGroups = [...new Set([...radioInputs].map((r) => r.name).filter(Boolean))];

  for (const groupName of radioGroups) {
    for (const mapping of mappings) {
      if (!mapping.isRadio || !mapping.value) continue;
      // Check if the group name hints at this field
      const gn = groupName.toLowerCase();
      if (mapping.keywords.some((kw) => gn.includes(kw.replace(/ /g, "")) || gn.includes(kw))) {
        if (fillRadio(groupName, mapping.value)) {
          filledRadioGroups.add(groupName);
          break;
        }
      }
    }
  }

  // 2. Handle inputs, textareas, selects
  for (const el of inputs) {
    const fp = fingerprint(el);

    for (const mapping of mappings) {
      if (!mapping.value) continue;
      if (!fuzzyMatch(fp, mapping.keywords)) continue;

      if (el.tagName === "SELECT") {
        fillSelect(el, mapping.value);
      } else {
        fillInput(el, mapping.value);
      }
      break;
    }
  }

  // 3. Custom dropdown widgets (divs/spans with role="listbox" / role="combobox")
  //    e.g. Naukri's custom select
  const comboboxes = document.querySelectorAll(
    "[role='combobox'], [role='listbox'], [class*='select'], [class*='Select'], [class*='dropdown'], [class*='Dropdown']"
  );

  for (const cb of comboboxes) {
    const fp = [
      cb.getAttribute("aria-label") || "",
      cb.getAttribute("placeholder") || "",
      cb.id || "",
      cb.className || "",
      getLabel(cb),
    ].join(" ").toLowerCase();

    for (const mapping of mappings) {
      if (!mapping.isSelect || !mapping.value) continue;
      if (!fuzzyMatch(fp, mapping.keywords)) continue;

      // Open the dropdown and look for matching option
      cb.click();
      cb.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

      setTimeout(() => {
        const optionEls = document.querySelectorAll(
          "[role='option'], [class*='option'], [class*='Option'], [class*='item'], [class*='Item']"
        );
        const v = mapping.value.toLowerCase();
        for (const opt of optionEls) {
          const t = opt.textContent.trim().toLowerCase();
          if (t === v || t.includes(v) || v.includes(t)) {
            opt.click();
            console.log(`✓ custom dropdown filled: "${opt.textContent.trim()}"`);
            break;
          }
        }
      }, 200);

      break;
    }
  }

  console.log("✅ Autofill complete");
}

// ─── MutationObserver: handles multi-step / lazy-loaded forms ─────────

let observer = null;
let debounceTimer = null;
let lastData = null;

function startObserver(data) {
  if (observer) observer.disconnect();
  observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => runAutofill(data), 400);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// ─── message listener ────────────────────────────────────────────────

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action !== "AUTOFILL") return;

  const data = await chrome.storage.local.get([
    "fullName", "email", "phone", "gender",
    "college", "degree", "branch", "graduationYear", "cgpa",
    "experience", "currentCTC", "expectedCTC", "noticePeriod",
    "currentLocation", "workMode", "employmentType",
    "linkedin", "github", "portfolio",
  ]);

  lastData = data;

  // Run immediately
  runAutofill(data);

  // Then watch for new fields appearing (multi-step forms)
  startObserver(data);

  // Stop watching after 15s to avoid forever loops
  setTimeout(() => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }, 15000);
});