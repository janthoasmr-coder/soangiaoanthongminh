
import React, { useEffect, useRef } from 'react';
import { GenerationResult, ProcedureActivity, KnowledgeItem, ExampleExercise } from '../types';

declare const katex: any;

/**
 * MathText: Render văn bản xen kẽ công thức toán học.
 * Hỗ trợ: $...$, $$...$$, \(...\), \[...\]
 */
const MathText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  // Split text into parts based on LaTeX delimiters
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g);

  return (
    <span className="leading-relaxed">
      {parts.map((part, index) => {
        if (!part) return null;

        let formula = '';
        let displayMode = false;

        if (part.startsWith('$$') && part.endsWith('$$')) {
          formula = part.slice(2, -2);
          displayMode = true;
        } else if (part.startsWith('$') && part.endsWith('$')) {
          formula = part.slice(1, -1);
          displayMode = false;
        } else if (part.startsWith('\\[') && part.endsWith('\\]')) {
          formula = part.slice(2, -2);
          displayMode = true;
        } else if (part.startsWith('\\(') && part.endsWith('\\)')) {
          formula = part.slice(2, -2);
          displayMode = false;
        } else {
          return <span key={index} className="whitespace-pre-wrap">{part}</span>;
        }

        try {
          const html = katex.renderToString(formula.trim(), { 
            displayMode, 
            throwOnError: false,
            trust: true 
          });
          return (
            <span 
              key={index} 
              className={displayMode ? "block my-4 overflow-x-auto py-2" : "inline-block px-0.5 align-middle"}
              dangerouslySetInnerHTML={{ __html: html }} 
            />
          );
        } catch (e) {
          return <code key={index} className="bg-red-50 text-red-600 px-1">{part}</code>;
        }
      })}
    </span>
  );
};

const ProductRenderer: React.FC<{ product: ProcedureActivity['to_chuc_thuc_hien_2_cot']['san_pham_du_kien'] }> = ({ product }) => {
  return (
    <div className="space-y-4 text-black">
      {product.tom_tat && (
        <div className="font-bold underline italic text-blue-900 border-b border-blue-100 pb-1 mb-2">
          <MathText text={product.tom_tat} />
        </div>
      )}
      
      {product.kien_thuc_moi?.length > 0 && (
        <div className="space-y-2">
          {product.kien_thuc_moi.map((k: KnowledgeItem, idx: number) => (
            <div key={idx} className="bg-blue-50/40 p-2.5 rounded-lg border-l-4 border-blue-500 shadow-sm">
              <span className="font-bold uppercase text-[10px] tracking-wider text-blue-900 block mb-1 opacity-70">{k.loai}</span>
              <MathText text={k.noi_dung} />
            </div>
          ))}
        </div>
      )}

      {product.vi_du?.length > 0 && (
        <div className="space-y-4 mt-4">
          {product.vi_du.map((v: ExampleExercise, idx: number) => (
            <div key={idx} className="border border-dashed border-gray-300 p-3.5 rounded-xl bg-white shadow-sm">
              <p className="font-bold text-gray-900 mb-2">Ví dụ {idx + 1}: <MathText text={v.de_bai} /></p>
              <div className="mt-2 text-green-900 pl-3 border-l-2 border-green-200 py-1 bg-green-50/30 rounded-r-lg">
                <span className="italic font-bold text-sm underline decoration-green-300">Lời giải:</span>
                <div className="mt-2"><MathText text={v.loi_giai_chi_tiet} /></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {product.bai_tap?.length > 0 && (
        <div className="space-y-4 mt-4">
          {product.bai_tap.map((b: ExampleExercise, idx: number) => (
            <div key={idx} className="border border-indigo-100 p-3.5 rounded-xl bg-indigo-50/20 shadow-sm">
              <p className="font-bold text-indigo-900 mb-2">Bài tập {idx + 1}: <MathText text={b.de_bai} /></p>
              <div className="mt-2 text-indigo-900 pl-3 border-l-2 border-indigo-200 py-1 bg-white/50 rounded-r-lg">
                <span className="italic font-bold text-sm underline decoration-indigo-300">Lời giải:</span>
                <div className="mt-2"><MathText text={b.loi_giai_chi_tiet} /></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LessonPlanViewer: React.FC<{ data: GenerationResult }> = ({ data }) => {
  const { lesson_plan, digital_competency_map, form_inputs } = data;
  const docRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();
  
  const handleDownloadDocx = () => {
    if (!docRef.current) return;
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; color: black; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 10px; }
        td, th { border: 1px solid black; padding: 5px; vertical-align: top; }
        .font-bold { font-weight: bold; }
        .uppercase { text-transform: uppercase; }
        .text-center { text-align: center; }
        .italic { font-style: italic; }
      </style></head><body>`;
    const footer = "</body></html>";
    const html = header + docRef.current.innerHTML + footer;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Giao_An_${lesson_plan.thong_tin_chung.tieu_de_bai.replace(/\s+/g, '_')}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-sans no-print-bg">
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md p-4 mb-8 rounded-2xl shadow-2xl border border-blue-200 flex flex-wrap justify-between items-center gap-4 no-print">
        <div className="flex flex-col">
          <h2 className="text-xl font-black text-blue-900 uppercase">Kế hoạch bài dạy</h2>
          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider italic">Chuẩn CV 5512 & Năng lực số 3456</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleDownloadDocx} className="px-4 py-2 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-all active:scale-95 text-sm">
            Tải Word (.doc)
          </button>
          <button onClick={handlePrint} className="px-5 py-2.5 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 shadow-xl transition-all active:scale-95 text-sm">
            In Giáo Án (A4)
          </button>
        </div>
      </div>

      <div ref={docRef} className="bg-white p-[20mm] shadow-2xl lesson-document mx-auto print:p-0 print:shadow-none min-h-[297mm] text-black border border-gray-100">
        <div className="grid grid-cols-2 mb-10 text-[13pt] leading-snug">
          <div className="text-left">
            <p className="font-bold">Trường: ............................................</p>
            <p className="font-bold">Tổ: ....................................................</p>
            <div className="w-32 h-[0.5px] bg-black mt-1"></div>
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="font-bold text-left w-full pl-8">Họ và tên giáo viên:</p>
            <p className="font-bold w-full pl-8">..........................................................</p>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-[16pt] font-bold uppercase mb-2">KẾ HOẠCH BÀI DẠY</h1>
          <p className="text-[14pt] font-bold uppercase">TÊN BÀI DẠY: {lesson_plan.thong_tin_chung.tieu_de_bai}</p>
          <p className="text-[13pt] mt-2">
            Môn học/Hoạt động giáo dục: <span className="font-bold uppercase">Toán học</span>; lớp: <span className="font-bold">{form_inputs?.khoi_lop || '.......'}</span>
          </p>
          <p className="text-[13pt] mt-1 italic">Thời gian thực hiện: ({form_inputs?.so_tiet || '...'} tiết)</p>
        </div>

        <div className="mb-8">
          <h2 className="text-[14pt] font-bold uppercase border-b border-black pb-1 mb-3">I. MỤC TIÊU:</h2>
          <div className="ml-4 space-y-4 text-[13pt]">
            <div>
              <h3 className="font-bold underline">1. Kiến thức:</h3>
              <ul className="list-disc ml-8 text-justify">
                {lesson_plan.muc_tieu.kien_thuc.map((k, i) => <li key={i}><MathText text={k} /></li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-bold underline">2. Năng lực:</h3>
              <div className="ml-4 space-y-2">
                <p><span className="font-bold">Năng lực chung:</span> {lesson_plan.muc_tieu.nang_luc.nang_luc_chung.join('; ')}.</p>
                <p><span className="font-bold">Năng lực đặc thù Toán học:</span> {lesson_plan.muc_tieu.nang_luc.nang_luc_dac_thu_toan.join('; ')}.</p>
                <div className="mt-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100 shadow-sm">
                  <span className="font-bold text-blue-900 uppercase text-[11pt] tracking-tight">Năng lực số (Tích hợp CV 3456):</span>
                  <ul className="list-disc ml-8 mt-2 space-y-1">
                    {lesson_plan.muc_tieu.nang_luc_so.map((nls, i) => (
                      <li key={i} className="text-justify text-[12pt]">
                        <span className="font-bold text-indigo-800">{nls.ma}:</span> {nls.mo_ta}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold underline">3. Phẩm chất:</h3>
              <ul className="list-disc ml-8 text-justify">
                {lesson_plan.muc_tieu.pham_chat.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-[14pt] font-bold uppercase border-b border-black pb-1 mb-3">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU:</h2>
          <div className="ml-4 text-[13pt]">
            <p><strong>- Giáo viên:</strong> {lesson_plan.thiet_bi.giao_vien.join(', ')}.</p>
            <p><strong>- Học sinh:</strong> {lesson_plan.thiet_bi.hoc_sinh.join(', ')}.</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-[14pt] font-bold uppercase border-b border-black pb-1 mb-3">III. TIẾN TRÌNH DẠY HỌC:</h2>
          
          {lesson_plan.tien_trinh.map((section, sIdx) => (
            <div key={sIdx} className="mb-10">
              <h3 className="text-[13pt] font-bold uppercase mb-4 text-slate-900 underline underline-offset-4 decoration-2">{section.ten_phan}</h3>
              {section.cac_hoat_dong.map((act, aIdx) => (
                <div key={aIdx} className="mb-8 ml-2" style={{ pageBreakInside: 'avoid' }}>
                  <h4 className="font-bold text-[12pt] mb-4 bg-slate-50 p-2.5 border-l-4 border-slate-600 italic">Hoạt động {aIdx + 1}: {act.ten_hoat_dong}</h4>
                  <div className="ml-4 space-y-3 text-[12pt]">
                    <p><strong>a) Mục tiêu:</strong> {act.muc_tieu.join('; ')}.</p>
                    <p><strong>b) Nội dung:</strong> <MathText text={act.noi_dung} /></p>
                    <p><strong>c) Sản phẩm:</strong> <MathText text={act.san_pham} /></p>
                    <div className="mt-6">
                      <p className="font-bold mb-3 uppercase text-[11pt] tracking-wide">d) Tổ chức thực hiện:</p>
                      <table className="w-full border border-black border-collapse text-[12pt]">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="border border-black p-3 w-1/2 uppercase font-bold text-center text-[10pt]">HOẠT ĐỘNG CỦA GV VÀ HS</th>
                            <th className="border border-black p-3 w-1/2 uppercase font-bold text-center text-[10pt]">SẢN PHẨM DỰ KIẾN</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-black p-3 align-top text-justify space-y-6">
                              <div>
                                <p className="font-bold italic uppercase text-[10pt] text-slate-700">Bước 1: Chuyển giao nhiệm vụ</p>
                                <div className="pl-3 mt-1.5"><MathText text={act.to_chuc_thuc_hien_2_cot.hoat_dong_gv_hs.buoc_1} /></div>
                              </div>
                              <div>
                                <p className="font-bold italic uppercase text-[10pt] text-slate-700">Bước 2: Thực hiện nhiệm vụ</p>
                                <div className="pl-3 mt-1.5"><MathText text={act.to_chuc_thuc_hien_2_cot.hoat_dong_gv_hs.buoc_2} /></div>
                              </div>
                              <div>
                                <p className="font-bold italic uppercase text-[10pt] text-slate-700">Bước 3: Báo cáo, thảo luận</p>
                                <div className="pl-3 mt-1.5"><MathText text={act.to_chuc_thuc_hien_2_cot.hoat_dong_gv_hs.buoc_3} /></div>
                              </div>
                              <div>
                                <p className="font-bold italic uppercase text-[10pt] text-slate-700">Bước 4: Kết luận, nhận định</p>
                                <div className="pl-3 mt-1.5"><MathText text={act.to_chuc_thuc_hien_2_cot.hoat_dong_gv_hs.buoc_4} /></div>
                              </div>
                            </td>
                            <td className="border border-black p-4 align-top bg-slate-50/5">
                              <ProductRenderer product={act.to_chuc_thuc_hien_2_cot.san_pham_du_kien} />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t-2 border-black" style={{ pageBreakInside: 'avoid' }}>
          <h2 className="text-[14pt] font-bold uppercase mb-6 text-center">IV. BẢNG ÁNH XẠ NĂNG LỰC SỐ (CV 3456):</h2>
          <table className="w-full border border-black border-collapse text-[11pt]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-3 text-center uppercase font-bold w-1/4">Hoạt động giáo dục</th>
                <th className="border border-black p-3 w-32 text-center uppercase font-bold">Mã NLS</th>
                <th className="border border-black p-3 text-center uppercase font-bold">Biểu hiện / Minh chứng kỹ thuật</th>
              </tr>
            </thead>
            <tbody>
              {digital_competency_map.map((row, i) => (
                <tr key={i}>
                  <td className="border border-black p-3 font-bold bg-slate-50/10">{row.hoat_dong}</td>
                  <td className="border border-black p-3 text-center font-bold text-blue-900 font-mono tracking-tight">{row.ma_nls.join(', ')}</td>
                  <td className="border border-black p-3 text-justify italic leading-snug">
                    <span className="not-italic text-slate-800">{row.bieu_hien.join('; ')}</span> 
                    <div className="mt-2 pt-1 border-t border-dashed border-gray-200">
                      <strong>Minh chứng:</strong> {row.minh_chung.join('; ')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12" style={{ pageBreakInside: 'avoid' }}>
          <h2 className="text-[14pt] font-bold uppercase border-b border-black pb-1 mb-3">V. HƯỚNG DẪN VỀ NHÀ:</h2>
          <ul className="list-disc ml-8 text-[13pt] space-y-2">
            {lesson_plan.huong_dan_ve_nha.map((item, i) => <li key={i}><MathText text={item} /></li>)}
          </ul>
        </div>

        <div className="mt-24 grid grid-cols-2 text-center text-[13pt]" style={{ pageBreakInside: 'avoid' }}>
          <div>
            <p className="font-bold uppercase mb-2">Duyệt của tổ chuyên môn</p>
            <div className="h-28"></div>
            <p className="italic text-sm">(Ký và ghi rõ họ tên)</p>
          </div>
          <div className="italic">
            <p>...................., ngày .... tháng .... năm 202...</p>
            <p className="font-bold mt-2 uppercase not-italic">Người soạn</p>
            <div className="h-28"></div>
            <p className="font-bold uppercase not-italic text-[14pt]">................................................</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanViewer;
