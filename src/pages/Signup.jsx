import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, User, AlertCircle, ChevronRight, Check, Upload, Image, FileText, MapPin, Car } from "lucide-react";
import api from "../api";

export default function Signup({ onLoginSuccess, addToast }) {
  const navigate = useNavigate();
  const [signupStep, setSignupStep] = useState(1);

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const [driverName, setDriverName] = useState("");
  const [dob, setDob] = useState("");
  const [license, setLicense] = useState("");
  const [panCard, setPanCard] = useState("");
  const [aadhaarCard, setAadhaarCard] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const [photoPreview, setPhotoPreview] = useState("");
  const [licensePreview, setLicensePreview] = useState("");
  const [panPreview, setPanPreview] = useState("");
  const [aadhaarPreview, setAadhaarPreview] = useState("");
  const [rcPreview, setRcPreview] = useState("");

  const [signupError, setSignupError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast("File size should not exceed 2MB.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSignupStep1Submit = (e) => {
    e.preventDefault();
    setSignupError("");
    if (!signupEmail || !signupPassword || !signupConfirmPassword) {
      setSignupError("Please fill in all credentials.");
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      return;
    }
    setSignupStep(2);
  };

  const handleSignupStep2Submit = async (e) => {
    e.preventDefault();
    setSignupError("");
    if (!driverName || !dob || !license || !panCard || !aadhaarCard || !mobileNumber || !vehicleType || !vehicleNumber) {
      setSignupError("Please fill in all verification text details.");
      return;
    }
    if (!photoPreview) {
      setSignupError("Please upload a Profile Photo.");
      return;
    }
    if (!licensePreview || !panPreview || !aadhaarPreview || !rcPreview) {
      setSignupError("Please upload images for all required verification documents.");
      return;
    }

    const payload = {
      name: driverName,
      email: signupEmail,
      phone: mobileNumber,
      aadhaar: aadhaarCard,
      licenseNumber: license,
      photo: photoPreview,
      password: signupPassword,
      dob: dob,
      panCard: panCard,
      licenseImage: licensePreview,
      panImage: panPreview,
      aadhaarImage: aadhaarPreview,
      vehicleDetails: {
        type: vehicleType,
        number: vehicleNumber,
        rcImage: rcPreview
      }
    };

    setIsSubmitting(true);
    try {
      const response = await api.post('/driver-auth/register', payload);
      if (addToast) addToast("Registration submitted successfully! Your account is under verification.", "success");
      // Redirect to login page so they can await verification
      navigate('/login');
    } catch (err) {
      setSignupError(err.response?.data?.error || "Failed to register driver");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">


      {/* RIGHT SIDE — Signup Form */}
      <div className="flex-1 flex items-start justify-center p-6 pt-10 bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/50 min-h-screen overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 md:p-10 animate-fade-in">

          <div className="text-center mb-6">
            <Link to="/" className="inline-flex bg-slate-50 p-2 rounded-xl mb-3 border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-100 transition-colors">
              <img src="/logo.png" alt="CAB BAZAR logo" className="h-14 w-auto object-contain" />
            </Link>
            <h2 className="text-2xl font-black text-slate-900 tracking-wide">Create Your Account</h2>
            <p className="text-slate-500 text-sm mt-1">Driver Partner Registration</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${signupStep === 1 ? 'bg-secondary text-white' : 'bg-emerald-500 text-white'}`}>
                {signupStep > 1 ? <Check size={12} /> : "1"}
              </span>
              <span className={`text-xs font-semibold ${signupStep === 1 ? 'text-slate-800' : 'text-slate-400'}`}>Security Credentials</span>
            </div>
            <div className="flex-1 h-[2px] bg-slate-200 mx-4"></div>
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${signupStep === 2 ? 'bg-secondary text-white' : 'bg-slate-200 text-slate-500'}`}>
                2
              </span>
              <span className={`text-xs font-semibold ${signupStep === 2 ? 'text-slate-800' : 'text-slate-400'}`}>Driver Verification</span>
            </div>
          </div>

          {signupError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm font-medium border border-red-100 mb-4">
              <AlertCircle size={16} />
              {signupError}
            </div>
          )}

          {/* STEP 1: CREDENTIALS */}
          {signupStep === 1 && (
            <form onSubmit={handleSignupStep1Submit} className="max-w-md mx-auto flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Email ID <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><User size={18} /></span>
                  <input type="email" className="w-full py-2.5 pl-10 pr-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all" placeholder="driver@cabbazar.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></span>
                  <input type="password" className="w-full py-2.5 pl-10 pr-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all" placeholder="••••••••" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></span>
                  <input type="password" className="w-full py-2.5 pl-10 pr-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all" placeholder="••••••••" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="w-full bg-secondary hover:bg-secondary-hover text-white font-bold py-3 px-6 rounded-lg cursor-pointer flex items-center justify-center gap-2 mt-2 transition-colors">
                Continue to Verification <ChevronRight size={16} />
              </button>

              <div className="text-center text-sm pt-4 border-t border-slate-100">
                <span className="text-slate-500">Already have an account? </span>
                <Link to="/login" className="text-secondary font-bold hover:underline cursor-pointer transition-colors">Log In here</Link>
              </div>
            </form>
          )}

          {/* STEP 2: DRIVER VERIFICATION */}
          {signupStep === 2 && (
            <form onSubmit={handleSignupStep2Submit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Driver Name <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all" placeholder="Alexander Pierce" value={driverName} onChange={(e) => setDriverName(e.target.value)} required />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Mobile Number <span className="text-red-500">*</span></label>
                  <input type="tel" className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all" placeholder="+91 99999 00000" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Date of Birth <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all cursor-pointer" value={dob} onChange={(e) => setDob(e.target.value)} required />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Profile Photo <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-3">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile preview" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                        <User size={18} />
                      </div>
                    )}
                    <label className="flex items-center gap-1 py-1.5 px-3 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-700 bg-white cursor-pointer select-none transition-colors">
                      <Upload size={14} /> Upload Photo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, setPhotoPreview)} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Driving License No. <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all" placeholder="DL-9876543210" value={license} onChange={(e) => setLicense(e.target.value)} required />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">PAN Card No. <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all" placeholder="ABCDE1234F" value={panCard} onChange={(e) => setPanCard(e.target.value)} required />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Aadhaar Card No. <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all" placeholder="4820-3948-1029" value={aadhaarCard} onChange={(e) => setAadhaarCard(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Vehicle Type <span className="text-red-500">*</span></label>
                  <select className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} required>
                    <option value="">Select Type</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Vehicle Number <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-3 focus:ring-blue-500/15 transition-all" placeholder="MH-12-AB-1234" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">Verification Document Images <span className="text-red-500">*</span></h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Driving License", preview: licensePreview, setPreview: setLicensePreview },
                    { label: "PAN Card", preview: panPreview, setPreview: setPanPreview },
                    { label: "Aadhaar Card", preview: aadhaarPreview, setPreview: setAadhaarPreview },
                    { label: "Vehicle RC", preview: rcPreview, setPreview: setRcPreview },
                  ].map(({ label, preview, setPreview }) => (
                    <div key={label} className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                      <label className="h-28 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center p-2 cursor-pointer text-center bg-slate-50 hover:bg-slate-50/80 transition-all overflow-hidden relative">
                        {preview ? (
                          <img src={preview} alt={label} className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <>
                            <Image size={20} className="text-slate-400 mb-1" />
                            <span className="text-[9px] font-bold text-slate-500">Upload</span>
                          </>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, setPreview)} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-4 border-t border-slate-100 pt-5">
                <button type="button" className="flex-1 py-2.5 px-4 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setSignupStep(1)}>
                  Back
                </button>
                <button type="submit" disabled={isSubmitting} className={`flex-1 bg-secondary hover:bg-secondary-hover text-white font-bold py-2.5 px-4 rounded-lg cursor-pointer hover:shadow-md transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
