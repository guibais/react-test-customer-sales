import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-pulse">
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg shadow-lg border border-red-400 flex items-center space-x-2">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm font-medium">Sem conexão</span>
      </div>
    </div>
  );
}