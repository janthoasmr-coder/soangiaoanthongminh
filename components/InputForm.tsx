
import React from 'react';
import { FormInputs } from '../types';

interface InputFormProps {
  onSubmit: (data: FormInputs) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = React.useState<FormInputs>({
    ten_bai_day: '',
    khoi_lop: 8,
    so_tiet: 2,
    ghi_chu: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'khoi_lop' || name === 'so_tiet' ? (value ? parseInt(value) : null) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ten_bai_day || !formData.khoi_lop || !formData.so_tiet) {
      alert("Vui lòng điền đủ 3 trường bắt buộc: Tên bài, Khối lớp, Số tiết.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-sky-50 p-8 rounded-2xl shadow-2xl border border-sky-200 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-sky-200 pb-6">
        <p className="text-sky-900 font-bold text-lg">Hệ thống sẽ soạn giáo án chuẩn 5512 & 3456 dựa trên các thông tin dưới đây.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <label className="block text-sm font-bold text-sky-800 mb-2 uppercase tracking-wide">Tên bài dạy *</label>
          <input 
            required 
            name="ten_bai_day" 
            value={formData.ten_bai_day || ''} 
            onChange={handleChange} 
            className="w-full px-4 py-3 border-2 border-sky-100 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 outline-none transition-all text-lg bg-white text-slate-900 placeholder-slate-400" 
            placeholder="VD: Định lý Thales trong tam giác" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-sky-800 mb-2 uppercase tracking-wide">Khối lớp *</label>
          <select 
            name="khoi_lop" 
            value={formData.khoi_lop || 8} 
            onChange={handleChange} 
            className="w-full px-4 py-3 border-2 border-sky-100 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 outline-none transition-all bg-white text-slate-900"
          >
            <option value="6">Lớp 6</option>
            <option value="7">Lớp 7</option>
            <option value="8">Lớp 8</option>
            <option value="9">Lớp 9</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-sky-800 mb-2 uppercase tracking-wide">Số tiết dạy *</label>
          <input 
            required 
            type="number" 
            name="so_tiet" 
            min="1" 
            max="10" 
            value={formData.so_tiet || ''} 
            onChange={handleChange} 
            className="w-full px-4 py-3 border-2 border-sky-100 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 outline-none transition-all bg-white text-slate-900 placeholder-slate-400" 
            placeholder="VD: 2" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-sky-800 mb-2 uppercase tracking-wide">Môn học</label>
          <input 
            disabled 
            value="Toán học" 
            className="w-full px-4 py-3 border-2 border-sky-50 bg-sky-50/50 rounded-xl text-sky-600 font-bold cursor-not-allowed" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-sky-800 mb-2 uppercase tracking-wide">Ghi chú (Yêu cầu riêng, học liệu sẵn có...)</label>
        <textarea 
          name="ghi_chu" 
          value={formData.ghi_chu || ''} 
          onChange={handleChange} 
          rows={4} 
          className="w-full px-4 py-3 border-2 border-sky-100 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 outline-none transition-all bg-white text-slate-900 placeholder-slate-400" 
          placeholder="Nhập các yêu cầu cụ thể hoặc kiến thức trọng tâm nếu muốn AI bám sát..." 
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-black text-xl text-white transition-all transform active:scale-95 shadow-xl ${isLoading ? 'bg-sky-300 cursor-not-allowed' : 'bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 hover:-translate-y-1'}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang soạn giáo án trí tuệ nhân tạo...
            </span>
          ) : 'PHÊ DUYỆT & SOẠN GIÁO ÁN'}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
