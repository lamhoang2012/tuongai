import React from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';

interface NotebookPreviewCardProps {
  onTrySampleGrading?: () => void;
}

export const NotebookPreviewCard: React.FC<NotebookPreviewCardProps> = ({ onTrySampleGrading }) => {
  return (
    <div className="relative mt-8 group">
      {/* Background soft shadow glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-sky-200 to-indigo-100 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-opacity" />

      <div className="relative bg-[#fffdfa] rounded-xl border border-sky-200/80 shadow-lg overflow-hidden">
        {/* Notebook Top Header */}
        <div className="bg-sky-50/80 border-b border-sky-100 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-semibold text-slate-600 ml-1">
              Bài tập Toán 9 - Hệ thức lượng trong tam giác vuông
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-sky-600" /> AI đã chấm tức thì
          </span>
        </div>

        {/* Ruled Ô Li Notebook Paper Area */}
        <div className="p-5 bg-oli-paper relative font-handwriting text-slate-800 text-lg sm:text-xl leading-relaxed">
          {/* Red notebook margin line */}
          <div className="absolute left-8 top-0 bottom-0 w-[1.5px] bg-red-300/70" />

          {/* Red Stamp Grade (8.5 / 10) in top-right */}
          <div className="absolute right-4 top-3 sm:right-6 sm:top-4 pointer-events-none transform rotate-[-8deg]">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-red-500/80 flex flex-col items-center justify-center bg-red-50/30 shadow-inner">
              <span className="text-red-600 font-bold text-2xl sm:text-3xl font-heading leading-none">
                8.5
              </span>
              <span className="text-[10px] text-red-500 font-semibold uppercase tracking-wider mt-0.5">
                AI Chấm
              </span>
              {/* Circle double ring */}
              <div className="absolute inset-1 rounded-full border border-red-400/50" />
            </div>
          </div>

          {/* Student Handwritten Solution Preview */}
          <div className="pl-6 pr-18 sm:pr-24 space-y-2 select-none">
            <p className="text-blue-900 font-semibold text-lg sm:text-xl">
              Bài 1: Cho <span className="font-bold">△ABC</span> vuông tại A, đường cao AH...
            </p>
            <p className="text-blue-800">
              1) Áp dụng định lý Pytago: <br />
              &nbsp;&nbsp;&nbsp;&nbsp;BC² = AB² + AC² = 6² + 8² = 100 
              <span className="text-emerald-600 text-sm font-sans font-medium ml-2 inline-flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                ✓ Đúng (10 cm)
              </span>
            </p>
            <p className="text-blue-800">
              2) Ta có: AB · AC = AH · BC <br />
              &nbsp;&nbsp;&nbsp;&nbsp;⇒ AH = (6 · 8) / 10 = 4.8 cm
              <span className="text-amber-700 text-sm font-sans font-medium ml-2 inline-flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                ⚠ Ghi rõ tên hệ thức
              </span>
            </p>
          </div>

          {/* Line-by-line feedback cards floating on bottom */}
          <div className="mt-4 pt-3 border-t border-sky-100/80 font-sans grid sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-start gap-2 bg-white/90 p-2.5 rounded-lg border border-slate-200 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Lập luận logic, kết quả chính xác</p>
                <p className="text-slate-500 text-[11px]">Học sinh nắm vững cách tính cạnh huyền và đường cao.</p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200 shadow-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Gợi ý sửa dòng 2</p>
                <p className="text-amber-800 text-[11px]">Bổ sung: "Áp dụng hệ thức lượng vào △ vuông ABC..."</p>
              </div>
            </div>
          </div>

          {onTrySampleGrading && (
            <div className="mt-3 flex justify-end font-sans">
              <button
                type="button"
                onClick={onTrySampleGrading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <span>Xem chi tiết & làm bài thử</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
