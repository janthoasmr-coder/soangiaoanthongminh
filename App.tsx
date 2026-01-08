
import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import LessonPlanViewer from './components/LessonPlanViewer';
import { FormInputs, GenerationResult } from './types';
import { generateLessonPlan } from './geminiService';

declare global {
  interface Window {
    // Fix: Using the existing global AIStudio type to match environment expectations
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [phase, setPhase] = useState<'A' | 'B'>('A');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(true);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success after triggering the dialog to avoid race conditions
      setHasKey(true);
      setError(null);
    }
  };

  const handleStartGeneration = async (inputs: FormInputs) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateLessonPlan(inputs);
      setResult(data);
      setPhase('B');
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error("Generation Error:", err);
      const errorMsg = err.message || "";
      // Reset key state if the API key is invalid or not found
      if (errorMsg.includes("API key not valid") || errorMsg.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key hiện tại không hợp lệ. Vui lòng cấu hình lại bằng nút bên dưới.");
      } else {
        setError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <nav className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-2xl sticky top-0 z-50 no-print border-b border-blue-400/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-inner">
              <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">MathPlan AI</h1>
              <p className="text-[9px] text-blue-200 uppercase font-bold tracking-widest mt-1 opacity-80">Soạn giáo án 5512 & 3456</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleOpenKeyDialog}
              className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all active:scale-95 ${!hasKey ? 'bg-amber-500 border-amber-400 text-white animate-pulse' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
            >
              {!hasKey ? '⚠️ Cấu hình API Key' : '🔑 Thay đổi Key'}
            </button>
            {phase === 'B' && (
              <button 
                onClick={() => setPhase('A')}
                className="text-xs font-bold bg-white text-blue-900 px-4 py-2 rounded-xl border border-white/20 transition-all active:scale-95"
              >
                Soạn Bài Mới
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        {!hasKey && (
          <div className="max-w-4xl mx-auto mb-8 bg-amber-50 border-2 border-amber-200 p-6 rounded-2xl shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full text-amber-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-amber-900 text-lg uppercase">Yêu cầu cấu hình API Key</h3>
                <p className="text-amber-800 mt-1 text-sm leading-relaxed">
                  Để sử dụng dịch vụ soạn giáo án AI, bạn cần chọn một API Key hợp lệ từ dự án có tính phí (Paid Project). 
                  Bạn có thể tìm hiểu thêm về <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-amber-600">tài liệu thanh toán tại đây</a>.
                </p>
                <button 
                  onClick={handleOpenKeyDialog}
                  className="mt-4 bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-amber-700 transition-all shadow-md active:scale-95"
                >
                  Mở hộp thoại chọn Key
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto mb-8 bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl shadow-lg flex items-center gap-4 animate-shake" role="alert">
            <div className="bg-red-200 p-2 rounded-full flex-shrink-0">
               <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="flex-grow">
              <strong className="font-black text-lg uppercase tracking-tight">Thông báo lỗi: </strong>
              <span className="block text-sm font-bold mt-1">{error}</span>
            </div>
          </div>
        )}

        {phase === 'A' ? (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Hệ thống Soạn Giáo Án Thông Minh</h2>
              <p className="text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                Ứng dụng AI chuyên biệt cho giáo viên Toán THCS, tự động tích hợp Năng lực số và định dạng LaTeX chuẩn mực.
              </p>
            </div>
            <InputForm onSubmit={handleStartGeneration} isLoading={isLoading} />
          </div>
        ) : (
          result && <LessonPlanViewer data={result} />
        )}
      </main>

      <footer className="bg-white py-8 border-t border-slate-200 mt-auto no-print">
        <div className="container mx-auto px-6 text-center">
          <p className="font-black text-slate-400 text-[10px] uppercase tracking-widest">MathPlan AI • Powered by Gemini 3 Flash</p>
        </div>
      </footer>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-shake { animation: shake 0.5s linear; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
      `}</style>
    </div>
  );
};

export default App;
