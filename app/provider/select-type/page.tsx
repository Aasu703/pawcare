"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { setProviderType, uploadProviderCertificate } from "@/lib/api/provider/provider";
import { FileUp, Paperclip, Stethoscope, Scissors, ShoppingBag, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import ProviderLocationPicker, { type ProviderPinnedLocation } from "@/components/ProviderLocationPicker";

const providerTypes = [
  {
    id: "vet",
    title: "Veterinarian",
    description: "Provide veterinary services including consultations, vaccinations, and medical treatments",
    icon: Stethoscope,
    color: "bg-green-500",
  },
  {
    id: "shop",
    title: "Pet Shop",
    description: "Sell pet supplies, food, toys, and accessories",
    icon: ShoppingBag,
    color: "bg-blue-500",
  },
  {
    id: "babysitter",
    title: "Groomer",
    description: "Offer grooming and related pet care services",
    icon: Scissors,
    color: "bg-purple-500",
  },
];

export default function SelectProviderType() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [certification, setCertification] = useState("");
  const [certificationDocumentUrl, setCertificationDocumentUrl] = useState("");
  const [certificationFileName, setCertificationFileName] = useState("");
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [experience, setExperience] = useState("");
  const [clinicOrShopName, setClinicOrShopName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [pinnedLocation, setPinnedLocation] = useState<ProviderPinnedLocation>({
    latitude: null,
    longitude: null,
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, checkAuth } = useAuth();
  const hasPinnedLocation =
    typeof pinnedLocation.latitude === "number" &&
    Number.isFinite(pinnedLocation.latitude) &&
    typeof pinnedLocation.longitude === "number" &&
    Number.isFinite(pinnedLocation.longitude);

  const submitType = async (typeId: string) => {
    if (!typeId || loading) return;

    const isVet = typeId === "vet";
    const isGroomer = typeId === "babysitter";
    const isShop = typeId === "shop";

    if (isVet && (!certification.trim() || !experience.trim() || !clinicOrShopName.trim())) {
      toast.error("For vets, certification, experience, and clinic/shop name are required.");
      return;
    }

    if (isGroomer && !experience.trim()) {
      toast.error("For groomers, experience is required.");
      return;
    }

    if (isShop && (!clinicOrShopName.trim() || !panNumber.trim())) {
      toast.error("For shop owners, shop name and PAN number are required.");
      return;
    }

    if ((isVet || isShop) && !hasPinnedLocation) {
      toast.error("Please pin your clinic/shop location on the map.");
      return;
    }

    setLoading(true);
    try {
      const res = await setProviderType({
        providerType: typeId,
        certification: certification.trim(),
        certificationDocumentUrl: certificationDocumentUrl || undefined,
        experience: experience.trim(),
        clinicOrShopName: clinicOrShopName.trim(),
        panNumber: panNumber.trim().toUpperCase(),
        location: hasPinnedLocation
          ? {
              latitude: pinnedLocation.latitude as number,
              longitude: pinnedLocation.longitude as number,
              address: pinnedLocation.address?.trim() || "",
            }
          : undefined,
      });
      if (res.success) {
        const providerFromResponse = res.data?._doc ?? res.data ?? {};
        const updatedUser = {
          ...(user ?? {}),
          ...providerFromResponse,
          providerType: providerFromResponse.providerType ?? typeId,
          role: "provider",
        };

        document.cookie = `user_data=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/;`;
        await checkAuth(updatedUser);
        toast.success("Details submitted. Please wait for admin verification.");
        router.replace("/provider/verification-pending");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to set provider type");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedType) return;
    await submitType(selectedType);
  };

  const handleCertificateUpload = async (file: File | null) => {
    if (!file) return;

    setUploadingCertificate(true);
    try {
      const result = await uploadProviderCertificate(file);
      if (result.success) {
        const uploadedPath = result.data?.path || result.data?.url || "";
        if (!uploadedPath) {
          toast.error("Upload succeeded but file path was not returned.");
          return;
        }
        setCertificationDocumentUrl(uploadedPath);
        setCertificationFileName(result.data?.originalname || file.name);
        toast.success("Certificate file attached successfully.");
      } else {
        toast.error(result.message || "Failed to upload certificate file.");
      }
    } finally {
      setUploadingCertificate(false);
    }
  };

  const isVet = selectedType === "vet";
  const isGroomer = selectedType === "babysitter";
  const isShop = selectedType === "shop";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50/30 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Provider Type
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the type of pet services you provide. This will help us customize your experience and connect you with the right customers.
          </p>
        </div>

        {/* Provider Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {providerTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;

            return (
              <div
                key={type.id}
                onClick={() => {
                  setSelectedType(type.id);
                }}
                className={`relative bg-white/80 backdrop-blur-md rounded-3xl p-8 border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${
                  isSelected
                    ? "border-primary shadow-lg shadow-primary/20 scale-105"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-3 -right-3 bg-primary rounded-full p-2">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`${type.color} p-4 rounded-2xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{type.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{type.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedType && (
          <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Verification Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(isVet || isShop) && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Clinic/Shop Name
                  </label>
                  <input
                    type="text"
                    value={clinicOrShopName}
                    onChange={(e) => setClinicOrShopName(e.target.value)}
                    placeholder="Enter clinic or shop name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white/70"
                  />
                </div>
              )}

              {(isVet || isGroomer) && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience
                  </label>
                  <textarea
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Describe your relevant experience"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white/70"
                  />
                </div>
              )}

              {isVet && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Certification
                  </label>
                  <textarea
                    value={certification}
                    onChange={(e) => setCertification(e.target.value)}
                    placeholder="Enter certification/license details"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white/70"
                  />
                  <div className="mt-3 space-y-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#0f4f57]/20 bg-[#0f4f57]/5 px-4 py-2 text-sm font-semibold text-[#0f4f57] hover:bg-[#0f4f57]/10">
                      <FileUp className="h-4 w-4" />
                      {uploadingCertificate ? "Uploading..." : "Attach Certificate File"}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                        disabled={uploadingCertificate}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          void handleCertificateUpload(file);
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>
                    {certificationDocumentUrl ? (
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <a
                          href={certificationDocumentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[#0f4f57] hover:underline"
                        >
                          <Paperclip className="h-3.5 w-3.5" />
                          {certificationFileName || "View attached certificate"}
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setCertificationDocumentUrl("");
                            setCertificationFileName("");
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-red-700 hover:bg-red-100"
                        >
                          <X className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">
                        Accepted formats: PDF, JPG, PNG, WEBP (max 10MB).
                      </p>
                    )}
                  </div>
                </div>
              )}

              {isShop && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="Enter PAN number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white/70 uppercase"
                  />
                </div>
              )}

              {(isVet || isShop) && (
                <div className="md:col-span-2 space-y-3">
                  <ProviderLocationPicker
                    value={pinnedLocation}
                    onChange={setPinnedLocation}
                    required
                    label={isVet ? "Clinic Location" : "Shop Location"}
                    helperText="Allow location access or click anywhere on map to pin your exact business location."
                  />

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={pinnedLocation.address || ""}
                      onChange={(e) =>
                        setPinnedLocation((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="Landmark, floor, or nearby reference"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white/70"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedType || loading}
            className={`px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              selectedType && !loading
                ? "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-primary/25"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Setting up your profile...
              </div>
            ) : (
              "Submit For Verification"
            )}
          </button>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500">
          Dashboard access will unlock after admin verification.
        </p>
      </div>
    </div>
  );
}
