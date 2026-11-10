"use strict";

// Frontend preparation only.
// Real authentication will be connected through Supabase later.

function showAuthMessage(form, message, type = "info") {
  const output = form.querySelector(".auth-message");
  if (!output) return;

  output.textContent = message;
  output.className = `auth-message show ${type}`;
}

function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (!password) return { level: 0, label: "Use at least 8 characters" };
  if (score <= 1) return { level: 1, label: "Weak password" };
  if (score <= 2) return { level: 2, label: "Fair password" };
  if (score <= 3) return { level: 3, label: "Good password" };

  return { level: 4, label: "Strong password" };
}

// Password visibility
document.querySelectorAll("[data-password-toggle]").forEach(button => {
  button.setAttribute("aria-pressed", "false");

  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.passwordToggle);
    if (!input) return;

    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    button.textContent = showing ? "Show" : "Hide";
    button.setAttribute("aria-pressed", String(!showing));
  });
});

// Live password strength on registration
const registerPassword = document.querySelector(
  '[data-auth-form="register"] #password'
);

if (registerPassword) {
  const field = registerPassword.closest(".auth-field");

  if (field) {
    const indicator = document.createElement("div");
    indicator.className = "password-strength";
    indicator.dataset.level = "0";
    indicator.setAttribute("aria-live", "polite");

    indicator.innerHTML = `
      <div class="password-strength-bars" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </div>
      <span class="password-strength-label">Use at least 8 characters</span>
    `;

    const passwordWrap = registerPassword.closest(".auth-password-wrap");
    if (passwordWrap) passwordWrap.after(indicator);

    registerPassword.addEventListener("input", () => {
      const result = getPasswordStrength(registerPassword.value);
      indicator.dataset.level = result.level;
      indicator.querySelector(".password-strength-label").textContent =
        result.label;
    });
  }
}

// Form validation and preparation
document.querySelectorAll("[data-auth-form]").forEach(form => {
  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const type = form.dataset.authForm;
    const data = new FormData(form);

    if (type === "register") {
      const password = data.get("password");
      const confirmPassword = data.get("confirmPassword");

      if (password !== confirmPassword) {
        showAuthMessage(
          form,
          "Your passwords do not match. Please check them.",
          "error"
        );
        return;
      }

      if (password.length < 8) {
        showAuthMessage(
          form,
          "Your password must contain at least 8 characters.",
          "error"
        );
        return;
      }
    }

    const messages = {
      login: "Your login page is ready. Connect Supabase to enable secure sign-in.",
      register: "Your registration page is ready. Connect Supabase to enable account creation and email verification.",
      forgot: "Your password recovery page is ready. Connect Supabase to enable recovery emails."
    };

    showAuthMessage(
      form,
      messages[type] || "Authentication is not configured yet.",
      "info"
    );
  });
});

// Dynamic footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
