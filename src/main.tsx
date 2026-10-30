import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Root ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_#18181b] text-center">
            <div className="w-12 h-12 bg-[#FF6F59] text-white rounded-xl border-2 border-slate-900 flex items-center justify-center mx-auto mb-4 font-black text-xl shadow-[2px_2px_0px_#18181b]">
              !
            </div>
            <h2 className="text-xl font-black text-slate-950 mb-2">Terjadi Kendala Tampilan</h2>
            <p className="text-sm text-slate-600 mb-6 font-medium">
              Aplikasi mendeteksi error kecil saat merender tampilan. Tekan tombol di bawah untuk memuat ulang dengan aman.
            </p>
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-xl bg-[#FFE853] text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all"
            >
              Muat Ulang Aplikasi
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
