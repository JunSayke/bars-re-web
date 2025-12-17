"use client";
import React, { useRef, useState } from "react";
import Button from "@/components/atoms/Button";

export default function ProfileForm() {
  const [username, setUsername] = useState("RapStar_User");
  const [email, setEmail] = useState("user@bisayarap.ai");
  const [bio, setBio] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  function handleChoosePhoto() {
    fileRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire up to API
    console.log({ username, email, bio });
    alert("Profile saved (demo)");
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary bg-[#221933] flex items-center justify-center">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="Profile" className="w-full h-full object-cover" src={preview} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#a492c9]">No photo</div>
            )}
          </div>
          <button aria-label="Upload photo" className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-[#6b21a8] to-[#5b13ec] hover:opacity-95 text-white rounded-full flex items-center justify-center border-2 border-[#0b0612] transition-colors shadow-lg" type="button" onClick={handleChoosePhoto}>
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
          </button>
          <input ref={fileRef} onChange={onFileChange} type="file" accept="image/*" className="hidden" />
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-white text-base font-bold">Profile Picture</h3>
            <p className="text-[#a492c9] text-xs mt-1">PNG, JPG or WEBP. Max 2MB.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="purple" size="sm" type="button" onClick={handleChoosePhoto} className="px-4">Change Photo</Button>
            <button type="button" onClick={() => setPreview(null)} className="px-4 py-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Remove</button>
          </div>
        </div>
      </div>

      <div className="h-px bg-[#2f2348] w-full" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-white text-sm font-semibold leading-normal">Username</label>
          <input className="form-input w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#443267] bg-[#221933] focus:border-primary h-12 placeholder:text-[#a492c9]/50 px-4 text-sm font-normal leading-normal" placeholder="e.g. MC Bisaya" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white text-sm font-semibold leading-normal">Email Address</label>
          <input className="form-input w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#443267] bg-[#221933] focus:border-primary h-12 placeholder:text-[#a492c9]/50 px-4 text-sm font-normal leading-normal" placeholder="name@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-white text-sm font-semibold leading-normal">Artist Bio <span className="text-[#a492c9] font-normal ml-1">(Optional)</span></label>
          <textarea className="form-textarea w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#443267] bg-[#221933] focus:border-primary min-h-[120px] placeholder:text-[#a492c9]/50 p-4 text-sm font-normal leading-normal resize-y" placeholder="Tell us about your style, influences, and what you want to create..." value={bio} onChange={(e) => setBio(e.target.value)} />
          <div className="flex justify-between items-center text-xs text-[#a492c9] px-1"><span>Brief description for your profile.</span><span>{bio.length}/500</span></div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-[#2f2348] mt-2">
        {/* Use existing Button to match login button gradient */}
        <Button variant="purple" size="lg" type="submit" className="min-w-[140px]">Save Changes</Button>
        <button className="flex min-w-[80px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-transparent hover:bg-[#221933] border border-transparent hover:border-[#2f2348] transition-all text-[#a492c9] hover:text-white text-base font-medium leading-normal" type="button" onClick={() => { setUsername("RapStar_User"); setEmail("user@bisayarap.ai"); setBio(""); setPreview(null); }}>Cancel</button>
      </div>
    </form>
  );
}
