export const AUTH_MESSAGES = {
  LOGIN: {
    SUCCESS: "Login successful!",
    FAILED: "Login failed",
  },

  FORGOT_PASSWORD: {
    SUCCESS: "Reset email sent successfully!",
    FAILED: "Failed to send reset email",
  },

  REGISTER: {
    INVALID_LTMS:
      "Please enter a valid 13-15 digit LTMS number",
  },

} as const;
