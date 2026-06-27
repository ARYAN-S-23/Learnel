import { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';

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
          <div className="relative bg-white rounded-2xl border border-[#eef1f6] shadow-2xl w-full max-w-sm animate-scale-in">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={22} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-[#2d3436] mb-2">
                {config.title || 'Are you sure?'}
              </h3>
              <p className="text-sm text-[#636e72]">
                {config.message || 'This action cannot be undone.'}
              </p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm bg-white border border-[#eef1f6] hover:bg-[#f8f9fd] text-[#636e72] transition-all"
              >
                {config.cancelText || 'Cancel'}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm bg-red-500 hover:bg-red-600 text-white transition-all"
              >
                {config.confirmText || 'Delete'}
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
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
}
