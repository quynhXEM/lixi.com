"use client";

import { useEffect, useState } from "react";

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Register service worker ngay khi component mount
    if ("serviceWorker" in navigator && typeof window !== "undefined") {
      // Đăng ký với scope root để có thể cache toàn bộ site
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("SW registered: ", registration);
          // Check for updates
          registration.update();
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (!showInstallButton) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-4 right-4 bg-yellow-400 hover:bg-yellow-300 text-red-800 font-bold py-2 px-4 rounded-full shadow-lg z-50 flex items-center gap-2 transition-all"
      aria-label="Cài đặt ứng dụng"
    >
      <span>📱</span>
      <span>Cài đặt App</span>
    </button>
  );
}
