import React, { useState, useEffect, useRef } from 'react';
import { LoginView } from './components/LoginView';
import { HomeView } from './components/HomeView';
import { ProfileView } from './components/ProfileView';
import { TabBar } from './components/TabBar';
import { ProductDetailView } from './components/ProductDetailView';
import { Product, ViewState, Tab } from './types';
import { Download, Star, Share, MoreVertical, Plus, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallAlert, setShowInstallAlert] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('user_name') || '';
  });
  const [userAvatar, setUserAvatar] = useState<string | null>(() => {
    return localStorage.getItem('user_avatar');
  });
  
  const [viewState, setViewState] = useState<ViewState>(() => {
    const savedUser = localStorage.getItem('user_name');
    return savedUser ? 'main' : 'login';
  });

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };

  const isAndroid = () => {
    return /Android/.test(navigator.userAgent);
  };

  const isStandalone = () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
  };

  useEffect(() => {
    const installedStatus = localStorage.getItem('app_installed');
    if (installedStatus === 'true' || isStandalone()) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem('app_installed', 'true');
      deferredPromptRef.current = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
      @keyframes bounceIn {
        0% { opacity: 0; transform: translateY(-20px) scale(0.9); }
        50% { transform: translateY(5px) scale(1.05); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.5s ease-out forwards;
      }
      .animate-fade-in {
        animation: fadeInUp 0.4s ease-out forwards;
      }
      .animate-slide-in {
        animation: slideIn 0.3s ease-out forwards;
      }
      .animate-bounce-in {
        animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }
      .pb-safe {
        padding-bottom: env(safe-area-inset-bottom, 20px);
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      document.head.removeChild(style);
    };
  }, []);

  const handleLogin = (name: string) => {
    setUserName(name);
    setViewState('main');
    localStorage.setItem('user_name', name);
  };

  const handleLogout = () => {
    setViewState('login');
    setActiveTab('home');
    setSelectedProduct(null);
    setUserName('');
    setUserAvatar(null);
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_avatar');
  };

  const handleUpdateProfile = (newName: string, newAvatar: string | null) => {
    setUserName(newName);
    setUserAvatar(newAvatar);
    localStorage.setItem('user_name', newName);
    if (newAvatar) {
      localStorage.setItem('user_avatar', newAvatar);
    } else {
      localStorage.removeItem('user_avatar');
    }
  };

  const handleInstallApp = async () => {
    if (deferredPromptRef.current) {
      try {
        await deferredPromptRef.current.prompt();
        const { outcome } = await deferredPromptRef.current.userChoice;
        if (outcome === 'accepted') {
          setShowInstallAlert(true);
          setTimeout(() => {
            setShowInstallAlert(false);
            setIsInstalled(true);
            localStorage.setItem('app_installed', 'true');
          }, 2000);
        }
        deferredPromptRef.current = null;
      } catch {
        setShowInstallInstructions(true);
      }
    } else {
      setShowInstallInstructions(true);
    }
  };

  const renderInstallInstructionsModal = () => {
    if (!showInstallInstructions) return null;

    const iosDevice = isIOS();
    const androidDevice = isAndroid();

    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setShowInstallInstructions(false)}
        />
        
        <div className="relative bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full text-center space-y-5 animate-bounce-in border border-white/50 z-10 max-h-[90vh] overflow-y-auto">
          <button 
            onClick={() => setShowInstallInstructions(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>

          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <Smartphone size={32} />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900">
            Instalar Aplicación
          </h3>

          {iosDevice ? (
            <div className="text-left space-y-4">
              <p className="text-slate-600 text-sm text-center mb-4">
                Sigue estos pasos para instalar en tu iPhone/iPad:
              </p>
              
              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Toca el botón Compartir</p>
                  <p className="text-slate-500 text-xs">Busca el ícono <Share size={14} className="inline text-blue-500" /> en la barra del navegador</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Selecciona "Agregar a inicio"</p>
                  <p className="text-slate-500 text-xs">Desliza hacia abajo y busca <Plus size={14} className="inline" /> Agregar a pantalla de inicio</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Confirma la instalación</p>
                  <p className="text-slate-500 text-xs">Toca "Agregar" en la esquina superior derecha</p>
                </div>
              </div>
            </div>
          ) : androidDevice ? (
            <div className="text-left space-y-4">
              <p className="text-slate-600 text-sm text-center mb-4">
                Sigue estos pasos para instalar en tu Android:
              </p>
              
              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Abre el menú del navegador</p>
                  <p className="text-slate-500 text-xs">Toca los tres puntos <MoreVertical size={14} className="inline" /> en la esquina superior</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Selecciona "Instalar app"</p>
                  <p className="text-slate-500 text-xs">O busca "Agregar a pantalla de inicio"</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Confirma la instalación</p>
                  <p className="text-slate-500 text-xs">Toca "Instalar" en el diálogo que aparece</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-left space-y-4">
              <p className="text-slate-600 text-sm text-center mb-4">
                Instala la app desde tu navegador:
              </p>
              
              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Busca el ícono de instalación</p>
                  <p className="text-slate-500 text-xs">En la barra de direcciones o menú del navegador</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Haz clic en "Instalar"</p>
                  <p className="text-slate-500 text-xs">Confirma la instalación cuando aparezca el diálogo</p>
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={() => setShowInstallInstructions(false)}
            className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl shadow-lg active:scale-95 transition-all mt-4"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  };

  // Main Render Logic
  if (viewState === 'login') {
    return (
      <>
        <LoginView 
          onLogin={handleLogin} 
          isInstalled={isInstalled}
          onInstall={handleInstallApp}
          installing={showInstallAlert}
        />
        {renderInstallInstructionsModal()}
      </>
    );
  }

  return (
    <div className="max-w-md mx-auto h-[100dvh] bg-slate-50 relative shadow-2xl overflow-hidden font-sans flex flex-col">
      
      {/* Background Ambience (Organic Gradients) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
         {/* Top Right - Soft Emerald */}
         <div className="absolute -top-[10%] -right-[20%] w-[400px] h-[400px] bg-emerald-200/30 rounded-full blur-3xl opacity-60 animate-pulse" />
         {/* Bottom Left - Soft Blue/Slate */}
         <div className="absolute top-[40%] -left-[20%] w-[350px] h-[350px] bg-blue-100/40 rounded-full blur-3xl opacity-50" />
         {/* Bottom Right - Accent */}
         <div className="absolute -bottom-[10%] -right-[10%] w-[300px] h-[300px] bg-emerald-100/30 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 pb-20">
        {activeTab === 'home' && (
          <HomeView 
            onProductClick={setSelectedProduct} 
            onShowUpgrade={() => setShowUpgradeModal(true)}
            userName={userName} 
          />
        )}
        {activeTab === 'profile' && (
          <ProfileView 
            onLogout={handleLogout} 
            userName={userName} 
            userAvatar={userAvatar}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </div>

      {/* Floating Install Button (Inside App) */}
      {!isInstalled && !selectedProduct && (
        <button
          onClick={handleInstallApp}
          className="absolute bottom-24 right-6 bg-emerald-600 text-white px-4 py-3 rounded-full shadow-xl z-30 flex items-center gap-2 animate-pulse font-bold text-sm hover:scale-105 active:scale-95 transition-all"
        >
          <Download size={18} />
          Instalar App
        </button>
      )}

      {/* Tab Navigation */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Detail Overlay */}
      {selectedProduct && (
        <ProductDetailView 
          product={selectedProduct} 
          onBack={() => setSelectedProduct(null)} 
        />
      )}

      {/* Upgrade Modal - Global & Absolute to Container */}
      {showUpgradeModal && (
        <div className="absolute inset-0 z-[50] flex items-center justify-center p-6 w-full h-full">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowUpgradeModal(false)}
          />
          
          {/* Modal Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-[90%] w-full text-center space-y-4 animate-bounce-in border border-white/50 z-10">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 text-amber-500 shadow-sm ring-4 ring-amber-50">
              <Star size={32} fill="currentColor" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900">
              Acceso Exclusivo VIP 🌟
            </h3>
            
            <p className="text-slate-500 text-sm leading-relaxed">
              Este contenido es una joya de nuestra colección premium.<br/>
              <span className="font-medium text-slate-700">Desbloquea el acceso total</span> para acelerar tus resultados hoy mismo.
            </p>

            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-slate-900/20 active:scale-95 transition-all mt-4 hover:bg-slate-800"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Global Install Alert Feedback */}
      {showInstallAlert && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full shadow-2xl z-[60] flex items-center gap-3 animate-bounce-in min-w-[280px]">
          <div className="bg-emerald-100 p-1.5 rounded-full">
            <Download size={16} className="text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Instalando aplicación...</p>
          </div>
        </div>
      )}

      {/* Install Instructions Modal */}
      {renderInstallInstructionsModal()}
    </div>
  );
};

export default App;