import { useState } from "react";
import { transactionRequirements } from "../../../../utils/requirements";
// import { createAppointment } from "../../../../services/client/appointment";
import { useSnackbar } from "notistack";

interface Props {
  data: any;
  updateForm: (updates: any) => void;
  onBack: () => void;
}

export default function Step3Transaction({ data, updateForm, onBack }: Props) {
  const [selectedType, setSelectedType] = useState(data.typeOfTransaction || "");
  const [requirements, setRequirements] = useState<any>(data.requirement || {});
  const [submitting, setSubmitting] = useState(false);
  // const [result, setResult] = useState<any>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleFileChange = (reqName: string, file: File) => {
    setRequirements((prev: any) => ({ ...prev, [reqName]: file }));
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      enqueueSnackbar("Please select a type of transaction!", { variant: "warning" });
      return;
    }

    const appointmentId = crypto.randomUUID();

    updateForm({
      typeOfTransaction: selectedType,
      requirement: requirements,
    });

    const formData = new FormData();
    formData.append("clientId", data.personalInfo?.id || "");
    formData.append("appointmentId", appointmentId);
    formData.append("typeOfTransaction", selectedType);
    formData.append("appointmentDate", data.date);
    formData.append("appointmentTime", data.time);
    formData.append("personalInfo", JSON.stringify(data.personalInfo));

    Object.keys(requirements).forEach((key) => {
      if (requirements[key]) formData.append(key, requirements[key]);
    });

    try {
    setSubmitting(true);
    
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/appointment/client`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    const finalId = data.appointmentId || appointmentId;

     enqueueSnackbar("Appointment created successfully!", { variant: "success" });

      updateForm({
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
        token: "",
      });

      window.location.href = `https://lto-naic-appointment-system.vercel.app/dashboard/${finalId}/appointment`;

    // setResult(data);
  } catch (err: any) {
    console.error(err);
    enqueueSnackbar(err.message || "Something went wrong!", { variant: "error" });
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Type of Transaction</h2>

      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      >
        <option value="">-----CHOOSE YOUR TRANSACTION-----</option>
        {Object.keys(transactionRequirements).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {selectedType && (
        <div>
          <h3 className="font-semibold mb-2">Required Documents</h3>
          <p className="text-sm text-gray-500 mb-3">
            Please upload your required documents as <strong>.jpg</strong> or <strong>.png</strong> images.
          </p>
          {transactionRequirements[selectedType].map((req) => (
            <div key={req} className="mb-2">
              <label className="block">{req}</label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileChange(req, e.target.files[0]);
                }}
                className="border p-2 w-full rounded"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="bg-gray-300 px-4 py-2 rounded">
          <span className="text-lg font-semibold">←</span>
          <span> Back</span>
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`bg-green-500 text-white px-4 py-2 rounded ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* {result && (
        <div className="mt-4 p-4 border rounded bg-green-100">
          <h3 className="font-semibold">Appointment Created</h3>
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
}
