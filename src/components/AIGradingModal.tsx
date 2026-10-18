import React, { useState } from 'react';
import { AIGradingResult, StudentSubmission } from '../types';
import { 
  X, CheckCircle2, AlertTriangle, XCircle, Sparkles, BookOpen, 
  Volume2, Printer, Edit3, Save, Share2, Award, ArrowRight
} from 'lucide-react';

interface AIGradingModalProps {
  submission: StudentSubmission;
  onClose: () => void;
  onUpdateSubmission?: (updated: StudentSubmission) => void;
  isTeacherView?: boolean;
}

export const AIGradingModal: React.FC<AIGradingModalProps> = ({
  submission,
  onClose,
  onUpdateSubmission,
  isTeacherView = true,
}) => {
  const result = submission.gradingResult;
  const [currentScore, setCurrentScore] = useState<number>(
    submission.adjustedScore ?? result?.score ?? 8.5
  );
  const [teacherNote, setTeacherNote] = useState<string>(
    submission.teacherNote || ''
  );
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!result) return null;

  const handleSpeakFeedback = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const textToRead = `Nhận xét bài làm của em ${submission.studentName}. Điểm số: ${currentScore} điểm. ${result.overallComment}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSaveTeacherReview = () => {
    if (onUpdateSubmission) {
      onUpdateSubmission({
        ...submission,
        adjustedScore: Number(currentScore),
        teacherNote,
        status: 'reviewed_teacher',
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      setIsEditingScore(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-bold text-lg">
              {submission.studentName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold leading-tight">
                  Bài làm: {submission.studentName}
                </h3>
                <span className="bg-sky-400/20 text-sky-200 border border-sky-300/30 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  {submission.status === 'reviewed_teacher' ? 'Đã duyệt' : 'AI đã chấm'}
                </span>
              </div>
              <p className="text-xs text-sky-200/80 mt-0.5">
                Nộp lúc {submission.submittedAt} • Thang điểm 10
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSpeakFeedback}
              title="Đọc nhận xét bằng giọng nói"
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSpeaking ? 'bg-amber-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isSpeaking ? 'Dừng đọc' : 'Đọc lời phê'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              title="In phiếu chấm bài"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Top Banner: Score & Overall Verdict */}
          <div className="bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl border border-sky-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100/80 px-2.5 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                Kết quả đánh giá AI Tường Học Tập
              </div>
              <h4 className="text-lg font-bold text-slate-800">
                {result.summaryVerdict || 'Bài làm đạt yêu cầu'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "{result.overallComment}"
              </p>
            </div>

            {/* Red Stamp Grade */}
            <div className="relative shrink-0 select-none">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-red-600/85 bg-red-50/60 shadow-inner flex flex-col items-center justify-center transform rotate-[-6deg]">
                <div className="absolute inset-1.5 rounded-full border border-red-400/40" />
                <span className="text-3xl sm:text-4xl font-black text-red-600 font-heading leading-none">
                  {currentScore.toFixed(1)}
                </span>
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider mt-1">
                  Điểm / 10
                </span>
                {isTeacherView && (
                  <button
                    type="button"
                    onClick={() => setIsEditingScore(!isEditingScore)}
                    className="absolute -bottom-2 bg-white border border-slate-300 text-slate-700 hover:text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-2.5 h-2.5" /> Sửa điểm
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Score Edit Panel for Teacher */}
          {isEditingScore && isTeacherView && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-wrap items-center gap-4">
              <span className="text-xs font-bold text-amber-900">Điều chỉnh điểm số:</span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.25"
                value={currentScore}
                onChange={(e) => setCurrentScore(parseFloat(e.target.value) || 0)}
                className="w-20 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-sm font-bold text-center text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-xs text-amber-800">
                (Thầy cô có thể chấm lại hoặc cộng điểm khuyến khích)
              </span>
              <button
                type="button"
                onClick={handleSaveTeacherReview}
                className="ml-auto px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Lưu điểm
              </button>
            </div>
          )}

          {/* Main 2-Column Content: Left = Handwriting, Right = Step-by-Step AI Correction */}
          <div className="grid lg:grid-cols-12 gap-5">
            {/* Left: Original Submission (Vở ô li) */}
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  Bài làm của học sinh (Vở ô li)
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {submission.type === 'photo' ? 'Ảnh chụp chữ viết tay' : 'Nộp văn bản gõ'}
                </span>
              </div>

              {/* Notebook Frame */}
              <div className="bg-oli-paper rounded-xl border border-sky-200 p-4 relative min-h-[340px] shadow-inner font-handwriting text-slate-800 text-lg leading-relaxed overflow-x-auto">
                <div className="absolute left-6 top-0 bottom-0 w-[1.5px] bg-red-300/80 pointer-events-none" />
                <div className="pl-5 whitespace-pre-line text-blue-900">
                  {result.transcription || submission.textSolution}
                </div>
              </div>
            </div>

            {/* Right: Line-by-Line AI Feedback */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  Phân tích lỗi sai từng dòng & Cách sửa
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {result.lineFeedback?.length || 0} điểm cần lưu ý
                </span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {result.lineFeedback?.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      item.status === 'correct'
                        ? 'bg-emerald-50/60 border-emerald-200/90 text-emerald-950'
                        : item.status === 'warning'
                        ? 'bg-amber-50/70 border-amber-200/90 text-amber-950'
                        : 'bg-rose-50/70 border-rose-200/90 text-rose-950'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {item.status === 'correct' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : item.status === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">
                            {item.stepOrLine}
                          </span>
                          <span
                            className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                              item.status === 'correct'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'warning'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.status === 'correct'
                              ? 'Chính xác'
                              : item.status === 'warning'
                              ? 'Lưu ý'
                              : 'Lỗi sai'}
                          </span>
                        </div>

                        {item.detail && (
                          <p className="text-xs text-slate-600 font-mono bg-white/70 px-2 py-1 rounded border border-slate-200/60">
                            {item.detail}
                          </p>
                        )}

                        <p className="text-xs leading-relaxed text-slate-700">
                          {item.comment}
                        </p>

                        {item.correction && (
                          <div className="mt-1 pt-1 border-t border-slate-200/60 text-xs">
                            <span className="font-semibold text-slate-800">
                              Cách sửa chuẩn:{' '}
                            </span>
                            <span className="text-sky-800 font-medium">{item.correction}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Strengths list */}
              {result.strengths && result.strengths.length > 0 && (
                <div className="bg-sky-50/60 border border-sky-200/80 rounded-xl p-3.5 space-y-2">
                  <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-sky-600" />
                    Ưu điểm bài làm của em:
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                    {result.strengths.map((str, i) => (
                      <li key={i} className="leading-relaxed">
                        {str}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Teacher's Note Section */}
          {isTeacherView && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Lời dặn dò riêng của thầy/cô gửi học sinh:
              </label>
              <textarea
                value={teacherNote}
                onChange={(e) => setTeacherNote(e.target.value)}
                placeholder="Nhập lời khen hoặc dặn dò em cần làm thêm bài tập nào..."
                rows={2}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Lời dặn dò sẽ hiển thị ngay khi học sinh mở link bài nộp.
                </span>
                <button
                  type="button"
                  onClick={handleSaveTeacherReview}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saveSuccess ? 'Đã lưu & gửi!' : 'Lưu & Trả bài cho học sinh'}
                </button>
              </div>
            </div>
          )}

          {/* Recommended Practice Problems Section */}
          {result.recommendedPractice && result.recommendedPractice.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <h5 className="text-sm font-bold text-amber-950">
                  Bài tập AI gợi ý riêng cho em để rèn luyện củng cố:
                </h5>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {result.recommendedPractice.map((rec, i) => (
                  <div
                    key={i}
                    className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs space-y-1.5"
                  >
                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] shrink-0">
                        {i + 1}
                      </span>
                      {rec.title}
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {rec.question}
                    </p>
                    {rec.hint && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-100 italic">
                        💡 Gợi ý: {rec.hint}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Hệ thống chấm AI tự động kết hợp chữ viết tay
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
