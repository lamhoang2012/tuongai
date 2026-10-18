import React, { useState, useEffect } from 'react';
import { OwlLogo } from './components/OwlLogo';
import { DoodleBackground } from './components/DoodleBackground';
import { NotebookPreviewCard } from './components/NotebookPreviewCard';
import { AuthModal } from './components/AuthModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentPortalView } from './components/StudentPortalView';
import { AIGradingModal } from './components/AIGradingModal';
import { StudentSubmitModal } from './components/StudentSubmitModal';
import { 
  INITIAL_CLASSES, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_SUBMISSIONS, 
  SAMPLE_HANDWRITTEN_TESTS 
} from './data/mockData';
import { Classroom, Assignment, StudentSubmission } from './types';
import { Camera, Sparkles, Bookmark, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';

export default function App() {
  // Navigation / View State
  const [currentView, setCurrentView] = useState<'landing' | 'teacher' | 'student'>('landing');

  // Application Data
  const [classes, setClasses] = useState<Classroom[]>(INITIAL_CLASSES);
  const [currentClass, setCurrentClass] = useState<Classroom>(INITIAL_CLASSES[0]);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(INITIAL_SUBMISSIONS);

  // Quick Direct Grading Demo modal from landing
  const [sampleInspecting, setSampleInspecting] = useState<StudentSubmission | null>(null);
  const [isQuickScanOpen, setIsQuickScanOpen] = useState(false);

  // Check URL query parameters (e.g. ?class=TOAN9A)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const classCode = params.get('class');
    if (classCode) {
      const found = classes.find((c) => c.code.toLowerCase() === classCode.toLowerCase());
      if (found) {
        setCurrentClass(found);
        setCurrentView('student');
      }
    }
  }, [classes]);

  // Handlers
  const handleLoginSuccess = (role: 'teacher' | 'student', _email?: string) => {
    if (role === 'teacher') {
      setCurrentView('teacher');
    } else {
      setCurrentView('student');
    }
  };

  const handleAddSubmission = (newSub: StudentSubmission) => {
    setSubmissions((prev) => [newSub, ...prev]);
  };

  const handleUpdateSubmission = (updated: StudentSubmission) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  const handleAddAssignment = (newAssignment: Assignment) => {
    setAssignments((prev) => [newAssignment, ...prev]);
  };

  // If in Teacher Dashboard
  if (currentView === 'teacher') {
    return (
      <TeacherDashboard
        currentClass={currentClass}
        classes={classes}
        onSelectClass={setCurrentClass}
        assignments={assignments}
        submissions={submissions}
        onUpdateSubmission={handleUpdateSubmission}
        onAddSubmission={handleAddSubmission}
        onAddAssignment={handleAddAssignment}
        onLogout={() => setCurrentView('landing')}
        onSwitchToStudentView={() => setCurrentView('student')}
      />
    );
  }

  // If in Student Portal
  if (currentView === 'student') {
    return (
      <StudentPortalView
        currentClass={currentClass}
        assignments={assignments}
        submissions={submissions}
        onAddSubmission={handleAddSubmission}
        onBackToLanding={() => setCurrentView('landing')}
        onOpenTeacherLogin={() => setCurrentView('landing')}
      />
    );
  }

  // LANDING PAGE (Pixel-perfect recreation of user screenshot)
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 relative flex flex-col justify-between selection:bg-sky-200">
      {/* Educational Doodle Line Art Background */}
      <DoodleBackground />

      {/* Floating Demo Role Switcher Bar */}
      <div className="relative z-20 bg-sky-900/90 text-white text-xs py-1.5 px-4 flex items-center justify-between backdrop-blur-md border-b border-sky-800">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-sky-100">
              Chế độ trải nghiệm Tường Học Tập AI:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentView('teacher')}
              className="bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
              <span>Giao diện Giáo viên</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('student')}
              className="bg-amber-500/80 hover:bg-amber-500 text-white px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Giao diện Học sinh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 flex flex-col justify-center">
        {/* Top Header Logo */}
        <header className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 select-none">
            <OwlLogo size={54} />
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none font-heading">
                Tường Học Tập AI
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Không gian cùng học
              </p>
            </div>
          </div>
        </header>

        {/* Hero 2-Column Grid */}
        <main className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines, Explanations & Notebook Preview */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow matching screenshot */}
            <p className="text-xs sm:text-sm font-bold tracking-wider text-slate-400 uppercase select-none">
              MỖI Ý TƯỞNG ĐỀU CÓ MỘT CHỖ
            </p>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] font-heading">
              <span className="text-[#0f284e]">Chụp bài, nộp bài, </span>
              <span className="text-[#1070b8]">AI chấm ngay.</span>
            </h2>

            {/* Paragraph Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Giáo viên chụp bài làm hoặc học sinh nộp bằng điện thoại. AI đọc cả chữ viết tay, cho điểm, chỉ đúng chỗ sai và gợi ý bài luyện thêm cho từng em.
            </p>

            {/* 3 Bullet Features matching screenshot */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200/80 flex items-center justify-center shrink-0 text-sky-600 shadow-2xs mt-0.5">
                  <Camera className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Chụp ảnh vở ô li, giấy kiểm tra hoặc gõ bài trực tiếp.
                </p>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200/80 flex items-center justify-center shrink-0 text-sky-600 shadow-2xs mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  AI chấm theo đáp án của thầy cô, chỉ lỗi sai từng dòng kèm cách sửa.
                </p>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200/80 flex items-center justify-center shrink-0 text-sky-600 shadow-2xs mt-0.5">
                  <Bookmark className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Định hướng luyện tập và bài tập gợi ý riêng cho mỗi em.
                </p>
              </div>
            </div>

            {/* Bottom Ruled Notebook Preview (As shown at bottom of user screenshot) */}
            <NotebookPreviewCard
              onTrySampleGrading={() => {
                const sampleSub = submissions[0];
                if (sampleSub) {
                  setSampleInspecting(sampleSub);
                }
              }}
            />
          </div>

          {/* Right Column: Auth Modal Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <AuthModal
              onLoginSuccess={handleLoginSuccess}
              onOpenStudentEntry={() => setCurrentView('student')}
            />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 bg-white/60 backdrop-blur-xs py-4 text-center text-xs text-slate-500">
        <p>
          © 2026 Tường Học Tập AI • Nền tảng học tập thông minh & Chấm chữ viết tay ứng dụng Gemini
        </p>
      </footer>

      {/* Sample Inspection Modal if opened */}
      {sampleInspecting && (
        <AIGradingModal
          submission={sampleInspecting}
          onClose={() => setSampleInspecting(null)}
          onUpdateSubmission={handleUpdateSubmission}
          isTeacherView={false}
        />
      )}

      {/* Quick Camera Scan Modal */}
      {isQuickScanOpen && (
        <StudentSubmitModal
          assignment={assignments[0]}
          allAssignments={assignments}
          onClose={() => setIsQuickScanOpen(false)}
          onSubmitSuccess={(newSub) => {
            handleAddSubmission(newSub);
            setIsQuickScanOpen(false);
            setSampleInspecting(newSub);
          }}
        />
      )}
    </div>
  );
}
