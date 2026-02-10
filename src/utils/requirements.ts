export const transactionRequirements: Record<
  string,
  { key: string; label: string }[]
> = {
  "Non-Professional Driver License Application": [
    { key: "apl_form", label: "Application for Permits and License (APL) Form" },
    { key: "medical_certificate", label: "Medical Certificate" },
    { key: "pdc", label: "Practical Driving Course (PDC)" },
    { key: "student_permit", label: "Valid Student Permit" },
    { key: "psa_birth_certificate", label: "PSA Birth Certificate" },
  ],

  "Professional Driver License Application": [
    { key: "apl_form", label: "Application for Permits and License (APL) Form" },
    { key: "medical_certificate", label: "Medical Certificate" },
    { key: "pdc", label: "Practical Driving Course (PDC)" },
    { key: "non_pro_license", label: "Valid Non-Professional License" },
    { key: "psa_birth_certificate", label: "PSA Birth Certificate" },
  ],

  "Adding Restriction": [
    { key: "apl_form", label: "Application for Permits and License (APL) Form" },
    { key: "medical_certificate", label: "Medical Certificate" },
    { key: "drivers_license", label: "Valid Driver's License" },
  ],
};