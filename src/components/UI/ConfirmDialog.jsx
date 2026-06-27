import { createContext, useContext, useState, useCallback } from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [resolver, setResolver] = useState(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfig(options);
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = () => {
    resolver?.(true);
    setConfig(null);
    setResolver(null);
  };

  const handleCancel = () => {
    resolver?.(false);
    setConfig(null);
    setResolver(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {config && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCancel}
          />
          <div className="relative bg-white dark:bg-bg-card rounded-2xl border border-border shadow-2xl w-full max-w-sm animate-scale-in">
            <div className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={22} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-text mb-2">
                {config.title || "Are you sure?"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-text-secondary">
                {config.message || "This action cannot be undone."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 px-4 sm:px-6 pb-4 sm:pb-6">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm bg-white dark:bg-bg-card border border-border hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-500 dark:text-text-secondary transition-all"
              >
                {config.cancelText || "Cancel"}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm bg-red-500 hover:bg-red-600 text-white transition-all"
              >
                {config.confirmText || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}
