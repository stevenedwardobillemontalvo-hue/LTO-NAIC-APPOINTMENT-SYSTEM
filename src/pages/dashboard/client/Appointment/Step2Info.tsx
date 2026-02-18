import { useEffect, useState } from "react";
import { clientInfo } from "../../../../services/client/appointment";
import { useSnackbar } from "notistack";

interface PersonalInfo {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  birthdate: string;
  ltmsNumber: string;
}

interface Props {
  data: { personalInfo?: PersonalInfo };
  updateForm: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const EDITABLE_FIELDS: (keyof PersonalInfo)[] = [
  "firstName",
  "middleName",
  "lastName",
  "contactNumber",
  "email",
  "birthdate",
  "ltmsNumber"
];

export default function Step2Info({ data, updateForm, onNext, onBack }: Props) {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(
    data.personalInfo || {
      id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      birthdate: "",
      ltmsNumber: "",
    }
  );
  const [editingField, setEditingField] = useState<keyof PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await clientInfo(token);
        const info: PersonalInfo = {
          id: res.id || "",
          firstName: res.firstName || "",
          middleName: res.middleName || "",
          lastName: res.lastName || "",
          contactNumber: res.contactNumber || "",
          email: res.email || "",
          birthdate: res.birthdate || "",
          ltmsNumber: res.ltmsNumber || "",
        };
        setPersonalInfo(info);
        updateForm({ personalInfo: info });
      } catch (err) {
        console.error("Failed to load user info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleEditToggle = (field: keyof PersonalInfo) => {
    if (!EDITABLE_FIELDS.includes(field)) return; 
    setEditingField(editingField === field ? null : field);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const missingFields = (Object.entries(personalInfo) as [keyof PersonalInfo, string][])
      .filter(([key, value]) => key !== "middleName" && !value)
      .map(([key]) => key.replace(/([A-Z])/g, " $1"));

    if (missingFields.length > 0) {
      enqueueSnackbar(
        `Please fill in: ${missingFields.join(", ")}`,
        { variant: "warning" }
      );
      return;
    }

    updateForm({ personalInfo });
    onNext();
  };

  const formatBirthdateDisplay = (dateStr: string) => {
  if (!dateStr) return "";

  // if already mm/dd/yyyy, return it
  if (dateStr.includes("/")) return dateStr;

  // expects yyyy-mm-dd
  const [yyyy, mm, dd] = dateStr.split("-");
  if (!yyyy || !mm || !dd) return dateStr;

  return `${mm}/${dd}/${yyyy}`;
};

const normalizeBirthdateValue = (dateStr: string) => {
  if (!dateStr) return "";

  if (dateStr.includes("-")) return dateStr;

  if (dateStr.includes("/")) {
    const [mm, dd, yyyy] = dateStr.split("/");
    if (!mm || !dd || !yyyy) return "";
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }

  return dateStr;
};



  if (loading) return <p>Loading user info...</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
      <div className="space-y-3">
        {/* {(Object.entries(personalInfo) as [keyof PersonalInfo, string][]).map(
          ([key, value]) => ( */}
          {(Object.entries(personalInfo) as [keyof PersonalInfo, string][])
            .filter(([key]) => key !== "id")
            .map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between border p-2 rounded"
            >
              {editingField === key ? (
              // <input
              //   type="text"
              //   name={key}
              //   value={value}
              //   onChange={handleChange}
              //   onBlur={() => setEditingField(null)}
              //   className="border p-1 rounded w-2/3"
              // />
              <input
                type={key === "birthdate" ? "date" : "text"}
                name={key}
                value={key === "birthdate" ? normalizeBirthdateValue(value) : value}
                onChange={handleChange}
                onBlur={() => setEditingField(null)}
                className="border p-1 rounded w-2/3"
              />
            ) : (
              <span className="w-2/3">
                <strong>
                  {key === "ltmsNumber"
                    ? "LTMS Number:"
                    : key
                        .replace(/([A-Z])/g, " $1") 
                        .split(" ")                
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ") + ":"}
                </strong>{" "}
                {/* {key === "email" ? value.toLowerCase() : value || "N/A"} */}
                {(() => {
                  const trimmed = (value || "").trim();

                  if (key === "middleName") return trimmed || "N/A";

                  // if (["email", "birthdate", "ltmsNumber"].includes(key))
                  //   return trimmed ? (key === "email" ? trimmed.toLowerCase() : trimmed) : "No data";
                  if (["email", "birthdate", "ltmsNumber"].includes(key)) {
                  if (!trimmed) return "No Data";

                  if (key === "email") return trimmed.toLowerCase();

                  if (key === "birthdate") return formatBirthdateDisplay(trimmed);

                  return trimmed;
                }
                
                  return trimmed || "No Data";
                })()}
              </span>

            )}

              {/* {editingField === key ? (
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="border p-1 rounded w-2/3"
                />
              ) : (
                <span className="capitalize w-2/3">
                  <strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {value || "N/A"}
                </span>
              )} */}
              {editingField === key || 
                ((EDITABLE_FIELDS.includes(key) && !["email", "birthdate", "ltmsNumber"].includes(key)) 
                || (["email", "birthdate", "ltmsNumber"].includes(key) && !value)) && (
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleEditToggle(key)}
                    className={`px-3 py-1 rounded ${editingField === key ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}
                  >
                    {editingField === key ? "Save" : "Edit"}
                  </button>
                )}
            </div>
          )
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="bg-gray-300 px-4 py-2 rounded">
          <span className="text-lg font-semibold">←</span>
          <span> Back</span>
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          <span>Next </span>
          <span className="text-lg font-semibold">→</span>
        </button>
      </div>
    </div>
  );
}
