import { useState } from "react";
import Step1Calendar from "./Step1Calendar";
import Step2Info from "./Step2Info";
import Step3Transaction from "./Step3Transaction";

export default function Appointment() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    personalInfo: {
      id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      birthdate: "",
      ltmsNumber: "",
    },
    typeOfTransaction: "",
    requirement: {},
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateForm = (updates: any) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between mb-4">
        {/* <button disabled={step === 1} onClick={prevStep}>
          ◀ Back
        </button> */}
        <p className="font-semibold">Step {step} of 3</p>
      </div>

      {step === 1 && (
        <Step1Calendar
          data={formData}
          updateForm={updateForm}
          onNext={nextStep}
        />
      )}
      {step === 2 && (
        <Step2Info
          data={formData}
          updateForm={updateForm}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}
      {step === 3 && (
        <Step3Transaction
          data={formData}
          updateForm={updateForm}
          onBack={prevStep}
        />
      )}
    </div>
  );
}
