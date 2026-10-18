import React, { useState } from 'react';
import { Classroom, Assignment, StudentSubmission } from '../types';
import { OwlLogo } from './OwlLogo';
import { StudentSubmitModal } from './StudentSubmitModal';
import { AIGradingModal } from './AIGradingModal';
import { 
  Camera, BookOpen, Clock, CheckCircle2, Sparkles, Award, 
  ArrowRight, ArrowLeft, Check, Copy, User 
} from 'lucide-react';

interface StudentPortalViewProps {
  currentClass: Classroom;
  assignments: Assignment[];
  submissions: StudentSubmission[];
  onAddSubmission: (sub: StudentSubmission) => void;
  onBackToLanding: () => void;
  onOpenTeacherLogin: () => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  currentClass,
  assignments,
  submissions,
  onAddSubmission,
  onBackToLanding,
  onOpenTeacherLogin,
}) => {
  const [studentName, setStudentName] = useState('Nguyễn Hoàng Nam');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment>(assignments[0]);
  const [viewingSubmission, setViewingSubmission] = useState<StudentSubmission | null>(null);

  // Submissions for this student
  const mySubmissions = submissions.filter(
    (s) => s.studentName.toLowerCase().includes(studentName.toLowerCase().trim())
  );

  const handleOpenSubmit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmitModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToLanding}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer mr-1"
              title="Về trang chủ"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <OwlLogo size={38} />
            <div>
              <h1 className="font-bold text-sm sm:text-base text-slate-900 leading-none">
                Tường Học Tập AI
              </h1>
              <p className="text-[11px] text-slate-500">Cổng nộp bài học sinh (Không cần nick)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Tên của em..."
                className="bg-transparent font-bold text-slate-800 w-28 sm:w-36 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={onOpenTeacherLogin}
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 underline decoration-sky-300 cursor-pointer hidden sm:inline"
            >
              Dành cho Giáo viên
            </button>
          </div>
        </div>
      </header>

      {/* Classroom Hero */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-indigo-700 text-white py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-sky-100 mb-1">
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold">
              Mã lớp: {currentClass.code}
            </span>
            <span>•</span>
            <span>GV: {currentClass.teacherName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">{currentClass.name}</h2>
          <p className="text-xs text-sky-100 mt-1 max-w-xl">
            Chụp ảnh trang vở ô li hoặc gõ bài làm. AI sẽ nhận diện chữ viết tay và chấm điểm chi tiết ngay cho em!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        {/* Active Assignments */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-600" />
              Bài tập đang mở cần nộp
            </h3>
            <span className="text-xs text-slate-500">
              {assignments.length} bài tập
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {assignments.map((assignment) => {
              const mySub = submissions.find(
                (s) =>
                  s.assignmentId === assignment.id &&
                  s.studentName.toLowerCase().includes(studentName.toLowerCase().trim())
              );

              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full uppercase">
                        {assignment.subject}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Hạn: {assignment.dueDate}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      {assignment.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {assignment.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    {mySub ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Đã nộp ({mySub.adjustedScore ?? mySub.gradingResult?.score} điểm)
                        </span>

                        <button
                          type="button"
                          onClick={() => setViewingSubmission(mySub)}
                          className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                        >
                          Xem bài chấm <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenSubmit(assignment)}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Chụp vở & Nộp bài ngay</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recently Graded Work for this student */}
        <section className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Kết quả AI chấm bài gần đây của em ({studentName})
            </h3>
          </div>

          {mySubmissions.length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
              <p>Chưa có bài nào được nộp với tên "{studentName}".</p>
              <p className="mt-1 font-semibold text-sky-600">
                Hãy bấm "Chụp vở & Nộp bài ngay" ở trên để làm bài thử!
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {mySubmissions.map((sub) => {
                const score = sub.adjustedScore ?? sub.gradingResult?.score ?? 8.5;
                return (
                  <div
                    key={sub.id}
                    onClick={() => setViewingSubmission(sub)}
                    className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block">
                        Nộp {sub.submittedAt}
                      </span>
                      <h5 className="text-xs font-bold text-slate-800">
                        {assignments.find((a) => a.id === sub.assignmentId)?.title || 'Bài tập toán'}
                      </h5>
                      <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                        "{sub.gradingResult?.overallComment || 'Bài làm đạt kết quả tốt'}"
                      </p>
                    </div>

                    {/* Red Score Stamp */}
                    <div className="w-12 h-12 rounded-full border-2 border-red-500 bg-red-50 flex flex-col items-center justify-center shrink-0 transform rotate-[-6deg]">
                      <span className="text-red-600 font-black text-sm font-heading leading-none">
                        {score.toFixed(1)}
                      </span>
                      <span className="text-[7px] font-bold text-red-500 uppercase">
                        Điểm
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      {isSubmitModalOpen && (
        <StudentSubmitModal
          assignment={selectedAssignment}
          allAssignments={assignments}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmitSuccess={(newSub) => {
            onAddSubmission(newSub);
            setIsSubmitModalOpen(false);
            setViewingSubmission(newSub);
          }}
          defaultStudentName={studentName}
        />
      )}

      {viewingSubmission && (
        <AIGradingModal
          submission={viewingSubmission}
          onClose={() => setViewingSubmission(null)}
          isTeacherView={false}
        />
      )}
    </div>
  );
};
