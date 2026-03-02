// Lightweight toast system for the Migration Assistant
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, type = 'success') => {
    const id = ++_id;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  const toast = {
    success: (msg) => add(msg, 'success'),
    error: (msg) => add(msg, 'error'),
    warn: (msg) => add(msg, 'warn'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onRemove }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-[#73e28a] flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
    warn: <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />,
  };
  const borders = {
    success: 'border-[#73e28a]/30',
    error: 'border-red-500/30',
    warn: 'border-yellow-500/30',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 bg-slate-900 border ${borders[toast.type]} rounded-xl px-4 py-3 shadow-xl max-w-sm`}
    >
      {icons[toast.type]}
      <p className="text-slate-200 text-sm flex-1">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-slate-500 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}