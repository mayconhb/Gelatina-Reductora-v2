import React, { useState, useRef } from 'react';
import { User, LogOut, ChevronRight, Camera, ArrowLeft, Save, Loader2 } from 'lucide-react';

interface ProfileViewProps {
  onLogout: () => void;
  userName: string;
  userAvatar: string | null;
  onUpdateProfile: (name: string, avatar: string | null) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onLogout, userName, userAvatar, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editAvatar, setEditAvatar] = useState<string | null>(userAvatar);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    setEditName(userName);
    setEditAvatar(userAvatar);
    setIsEditing(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API delay
    setTimeout(() => {
      onUpdateProfile(editName, editAvatar);
      setIsSaving(false);
      setIsEditing(false);
    }, 800);
  };

  const AvatarDisplay = ({ src, size = "large" }: { src: string | null, size?: "large" | "small" }) => {
    const sizeClasses = size === "large" ? "w-24 h-24" : "w-20 h-20";
    const iconSize = size === "large" ? 40 : 32;

    if (src) {
      return (
        <div className={`${sizeClasses} rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200`}>
          <img src={src} alt="Avatar" className="w-full h-full object-cover" />
        </div>
      );
    }
    return (
      <div className={`${sizeClasses} rounded-full border-4 border-white shadow-md bg-slate-200 flex items-center justify-center text-slate-400`}>
        <User size={iconSize} strokeWidth={1.5} />
      </div>
    );
  };

  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 animate-slide-in flex flex-col">
        {/* Header Edit Mode */}
        <div className="px-6 py-6 flex items-center justify-between border-b border-slate-100/50 bg-white/50">
          <button 
            onClick={() => setIsEditing(false)}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-slate-900">Datos Personales</h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        <div className="flex-1 px-6 pt-10">
          <div className="flex flex-col items-center mb-10">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <AvatarDisplay src={editAvatar} size="large" />
              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </div>
              <div className="absolute bottom-0 right-0 bg-emerald-500 p-2 rounded-full text-white shadow-sm border-2 border-white">
                <Camera size={14} />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 font-medium">Toca para cambiar foto</p>
            {/* Hidden Input for Camera/File */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              capture="user" // This triggers camera on mobile
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wide">Nombre</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-900 font-medium"
              />
            </div>
          </div>
        </div>

        <div className="p-6 pb-safe">
           <button 
            onClick={handleSave}
            disabled={!editName.trim() || isSaving}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Guardar Cambios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 px-6 pb-24 animate-fade-in bg-transparent min-h-screen">
      
      {/* Header Profile */}
      <div className="flex flex-col items-center mb-10">
        <div className="mb-4">
           <AvatarDisplay src={userAvatar} size="large" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{userName}</h2>
      </div>

      {/* Menu List - Simplified */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 overflow-hidden mb-8">
        <button 
          onClick={handleEditClick}
          className="w-full flex items-center justify-between p-4 active:bg-slate-50/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="text-slate-500">
              <User size={20} />
            </div>
            <span className="text-slate-700 font-medium">Datos Personales</span>
          </div>
          <ChevronRight size={18} className="text-slate-300" />
        </button>
      </div>

      {/* Logout */}
      <button 
        onClick={onLogout}
        className="w-full bg-white/70 backdrop-blur-sm text-red-600 font-semibold py-4 rounded-xl border border-white/50 shadow-sm active:bg-red-50 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut size={18} />
        Cerrar sesión
      </button>

      <p className="text-center text-slate-400 text-xs mt-8">Versión 1.0.0</p>
    </div>
  );
};