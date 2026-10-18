import React, { useState } from 'react';
import { Classroom, Assignment, StudentSubmission } from '../types';
import { OwlLogo } from './OwlLogo';
import { AIGradingModal } from './AIGradingModal';
import { StudentSubmitModal } from './StudentSubmitModal';
import { 
  Users, BookOpen, PlusCircle, Sparkles, Filter, Search, Copy, 
  Check, Camera, LogOut, GraduationCap, ChevronDown, Award, 
  AlertCircle, BarChart3, TrendingUp, Calendar, ArrowUpRight
} from 'lucide-react';

interface TeacherDashboardProps {
  currentClass: Classroom;
  classes: Classroom[];
  onSelectClass: (c: Classroom) => void;
  assignments: Assignment[];
  submissions: StudentSubmission[];
  onUpdateSubmission: (sub: StudentSubmission) => void;
  onAddSubmission: (sub: StudentSubmission) => void;
  onAddAssignment: (assignment: Assignment) => void;
  onLogout: () => void;
  onSwitchToStudentView: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentClass,
  classes,
  onSelectClass,
  assignments,
  submissions,
  onUpdateSubmission,
  onAddSubmission,
  onAddAssignment,
  onLogout,
  onSwitchToStudentView,
}) => {
  const [activeTab, setActiveTab] = useState<'wall' | 'create_assignment' | 'analytics'>('wall');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    assignments.find((a) => a.classId === currentClass.id)?.id || assignments[0]?.id || ''
  );
  const [filterScore, setFilterScore] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Modals
  const [inspectingSubmission, setInspectingSubmission] = useState<StudentSubmission | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // New assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<'Toán' | 'Ngữ Văn' | 'Tiếng Anh' | 'Khoa Học Tự Nhiên'>('Toán');
  const [newDueDate, setNewDueDate] = useState('23:59 ngày mai');
  const [newDesc, setNewDesc] = useState('');
  const [newRubric, setNewRubric] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  const currentAssignment = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];

  // Filter submissions
  const classSubmissions = submissions.filter((s) => {
    const matchAssignment = !selectedAssignmentId || s.assignmentId === selectedAssignmentId;
    const matchSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const score = s.adjustedScore ?? s.gradingResult?.score ?? 0;

    let matchScore = true;
    if (filterScore === 'high') matchScore = score >= 8.0;
    if (filterScore === 'medium') matchScore = score >= 6.5 && score < 8.0;
    if (filterScore === 'low') matchScore = score < 6.5;

    return matchAssignment && matchSearch && matchScore;
  });

  const copyClassLink = () => {
    const link = `${window.location.origin}/?class=${currentClass.code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const created: Assignment = {
      id: `assign-${Date.now()}`,
      classId: currentClass.id,
      title: newTitle,
      subject: newSubject,
      gradeLevel: currentClass.grade,
      dueDate: newDueDate,
      description: newDesc || 'Hoàn thành bài tập vào vở và nộp ảnh lên tường lớp.',
      rubric: newRubric || 'Chấm theo đúng quy chuẩn kiến thức, yêu cầu lập luận chặt chẽ.',
      totalSubmissions: 0,
      gradedCount: 0,
    };

    onAddAssignment(created);
    setSelectedAssignmentId(created.id);
    setNewTitle('');
    setNewDesc('');
    setNewRubric('');
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setActiveTab('wall');
    }, 1200);
  };

  // Calculate statistics
  const totalSub = classSubmissions.length;
  const avgScore = totalSub > 0
    ? (classSubmissions.reduce((acc, curr) => acc + (curr.adjustedScore ?? curr.gradingResult?.score ?? 0), 0) / totalSub).toFixed(1)
    : '8.4';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <OwlLogo size={42} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-none">
                  Tường Học Tập AI
                </h1>
                <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Giáo viên
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Không gian cùng học & Chấm bài tự động
              </p>
            </div>
          </div>

          {/* Class Switcher & Code */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <select
                value={currentClass.id}
                onChange={(e) => {
                  const target = classes.find((c) => c.id === e.target.value);
                  if (target) onSelectClass(target);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 pl-3 pr-8 rounded-xl border-none cursor-pointer focus:ring-2 focus:ring-sky-500 transition-colors"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Share Code Button */}
            <button
              type="button"
              onClick={copyClassLink}
              title="Sao chép link mời học sinh vào lớp"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Đã sao chép link</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-sky-600" />
                  <span>Mã lớp: <strong>{currentClass.code}</strong></span>
                </>
              )}
            </button>

            {/* Quick Snap/Grade Homework */}
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-3 sm:px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Chụp chấm bài mới</span>
              <span className="sm:hidden">Chấm bài</span>
            </button>

            {/* Teacher Profile / Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                type="button"
                onClick={onSwitchToStudentView}
                title="Xem giao diện của học sinh"
                className="p-2 text-slate-500 hover:text-sky-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onLogout}
                title="Đăng xuất"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Class Banner */}
      <div className="bg-gradient-to-r from-sky-800 via-sky-700 to-indigo-800 text-white py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-200 font-semibold mb-1">
              <span>{currentClass.grade}</span>
              <span>•</span>
              <span>GV: {currentClass.teacherName}</span>
              <span>•</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full">
                {currentClass.studentCount} học sinh
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {currentClass.name}
            </h2>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 sm:gap-4 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2.5 rounded-2xl">
            <div className="text-center">
              <span className="text-[10px] text-sky-200 font-semibold block uppercase">
                Bài đã nộp
              </span>
              <span className="text-lg font-bold">{totalSub}</span>
            </div>
            <div className="w-[1px] h-8 bg-white/20" />
            <div className="text-center">
              <span className="text-[10px] text-sky-200 font-semibold block uppercase">
                Điểm TB
              </span>
              <span className="text-lg font-bold text-amber-300">{avgScore}</span>
            </div>
            <div className="w-[1px] h-8 bg-white/20" />
            <div className="text-center">
              <span className="text-[10px] text-sky-200 font-semibold block uppercase">
                AI đã chấm
              </span>
              <span className="text-lg font-bold text-emerald-300">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-6 overflow-x-auto py-2">
            <button
              type="button"
              onClick={() => setActiveTab('wall')}
              className={`py-2 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'wall'
                  ? 'border-sky-600 text-sky-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Tường nộp bài</span>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px]">
                {classSubmissions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('create_assignment')}
              className={`py-2 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'create_assignment'
                  ? 'border-sky-600 text-sky-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Giao bài tập mới</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'border-sky-600 text-sky-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Thống kê & Lỗi sai</span>
            </button>
          </div>

          {/* Student direct entry link banner */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
            <span>Link học sinh:</span>
            <code className="bg-slate-100 text-sky-700 px-2 py-1 rounded font-mono font-semibold">
              ?class={currentClass.code}
            </code>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* TAB 1: TUONG NOP BAI (Submission Wall) */}
        {activeTab === 'wall' && (
          <div className="space-y-6">
            {/* Filter & Assignment Selector Controls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Assignment Switcher */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <label className="text-xs font-bold text-slate-600 shrink-0">
                  Bài tập:
                </label>
                <select
                  value={selectedAssignmentId}
                  onChange={(e) => setSelectedAssignmentId(e.target.value)}
                  className="w-full md:w-72 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                >
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} ({a.subject})
                    </option>
                  ))}
                </select>
              </div>

              {/* Search & Score Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                <div className="relative flex-1 md:flex-initial">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên học sinh..."
                    className="w-full md:w-48 pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setFilterScore('all')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      filterScore === 'all' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterScore('high')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      filterScore === 'high' ? 'bg-white shadow-2xs text-emerald-700' : 'text-slate-600'
                    }`}
                  >
                    Điểm giỏi (≥8)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterScore('medium')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      filterScore === 'medium' ? 'bg-white shadow-2xs text-amber-700' : 'text-slate-600'
                    }`}
                  >
                    Khá (6.5 - 7.9)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterScore('low')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      filterScore === 'low' ? 'bg-white shadow-2xs text-rose-700' : 'text-slate-600'
                    }`}
                  >
                    Cần rèn luyện
                  </button>
                </div>
              </div>
            </div>

            {/* Submissions Grid (Tường nộp bài kiểu Padlet/Classroom Wall) */}
            {classSubmissions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-700">Chưa có bài nộp nào phù hợp</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Hãy gửi mã lớp <strong>{currentClass.code}</strong> cho học sinh hoặc bấm "Chụp chấm bài mới" để nộp hộ học sinh.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Chụp bài chấm ngay
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {classSubmissions.map((sub) => {
                  const score = sub.adjustedScore ?? sub.gradingResult?.score ?? 8.0;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => setInspectingSubmission(sub)}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all p-5 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                    >
                      {/* Top Row: Student Name & Red Score Stamp */}
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 text-sky-800 font-bold flex items-center justify-center text-sm border border-sky-200">
                              {sub.studentName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                                {sub.studentName}
                              </h4>
                              <span className="text-[11px] text-slate-400">
                                {sub.submittedAt}
                              </span>
                            </div>
                          </div>

                          {/* Score Stamp Badge */}
                          <div className="w-12 h-12 rounded-full border-2 border-red-500/80 bg-red-50/50 flex flex-col items-center justify-center transform rotate-[-6deg] shrink-0 shadow-inner">
                            <span className="text-red-600 font-black text-base font-heading leading-none">
                              {score.toFixed(1)}
                            </span>
                            <span className="text-[8px] font-bold text-red-500 uppercase">
                              Điểm
                            </span>
                          </div>
                        </div>

                        {/* Submission Content Preview (Notebook preview) */}
                        <div className="mt-3.5 p-3 bg-oli-paper rounded-xl border border-sky-100 font-handwriting text-blue-900 text-base max-h-28 overflow-hidden relative">
                          <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-red-300/50" />
                          <div className="pl-3 line-clamp-3">
                            {sub.gradingResult?.transcription || sub.textSolution || 'Bài làm chữ viết tay...'}
                          </div>
                        </div>

                        {/* AI Feedback Snippet */}
                        {sub.gradingResult && (
                          <div className="mt-3 text-xs text-slate-600 bg-sky-50/60 p-2.5 rounded-xl border border-sky-100 space-y-1">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-sky-800">
                              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                              <span>{sub.gradingResult.summaryVerdict}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 italic line-clamp-2">
                              "{sub.gradingResult.overallComment}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Footer Row */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-slate-500">
                          {sub.status === 'reviewed_teacher' ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Thầy đã duyệt
                            </span>
                          ) : (
                            <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                              AI đã chấm
                            </span>
                          )}
                        </span>

                        <span className="text-sky-600 group-hover:text-sky-700 font-bold flex items-center gap-1 text-[11px]">
                          Xem chi tiết <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CREATE ASSIGNMENT */}
        {activeTab === 'create_assignment' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Giao bài tập mới cho lớp</h3>
                <p className="text-xs text-slate-500">
                  Cung cấp đề bài và barem điểm để AI đối chiếu chấm tự động chính xác theo ý thầy cô
                </p>
              </div>
            </div>

            {createSuccess && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Đã tạo bài tập thành công! Đang chuyển về tường lớp...</span>
              </div>
            )}

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tên bài tập / Đề kiểm tra <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Bài tập 3 - Hệ thức lượng & Tỉ số lượng giác góc nhọn"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Môn học
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e: any) => setNewSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                  >
                    <option value="Toán">Toán</option>
                    <option value="Ngữ Văn">Ngữ Văn</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Khoa Học Tự Nhiên">Khoa Học Tự Nhiên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Hạn nộp bài
                  </label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    placeholder="23:59 hôm nay"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Yêu cầu & Nội dung đề bài
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Làm các bài tập 1, 2, 3 trang 70 SGK. Chụp rõ từng trang vở kẻ ô li..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Barem điểm / Đáp án mẫu cho AI</span>
                  <span className="text-[11px] text-sky-600 font-normal">
                    AI sẽ bám sát đáp án này để chấm từng bước
                  </span>
                </label>
                <textarea
                  value={newRubric}
                  onChange={(e) => setNewRubric(e.target.value)}
                  placeholder="1. Vẽ hình và ghi giả thiết (1đ)&#10;2. Tính cạnh huyền BC = 10cm (3đ)&#10;3. Tính đường cao AH = 4.8cm (3đ)..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('wall')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Tạo bài tập & Mở link nộp
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: ANALYTICS & COMMON MISTAKES */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Điểm trung bình lớp</span>
                <p className="text-3xl font-black text-slate-900 mt-2 font-heading">{avgScore} / 10</p>
                <span className="text-xs text-emerald-600 font-semibold mt-1 inline-flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +0.4 điểm so với bài trước
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Tỉ lệ nộp bài đúng hạn</span>
                <p className="text-3xl font-black text-sky-700 mt-2 font-heading">92%</p>
                <span className="text-xs text-slate-500 mt-1 block">
                  35/38 học sinh đã hoàn thành
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Học sinh đạt điểm Giỏi</span>
                <p className="text-3xl font-black text-indigo-700 mt-2 font-heading">68%</p>
                <span className="text-xs text-slate-500 mt-1 block">
                  Nắm vững định lý và tính toán chuẩn
                </span>
              </div>
            </div>

            {/* AI Insights: Common Mistakes detected by AI across the class */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">
                  AI Tổng hợp: Các lỗi sai phổ biến nhất của cả lớp
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">
                      1. Thiếu chú thích tên định lý khi biến đổi
                    </span>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                      42% học sinh mắc
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Nhiều em áp dụng ngay hệ thức <code className="font-mono bg-white px-1">AB.AC = AH.BC</code> mà không ghi rõ câu dẫn "Áp dụng hệ thức liên hệ cạnh và đường cao trong △ vuông".
                  </p>
                  <p className="text-[11px] text-amber-800 font-semibold italic">
                    💡 Khuyến nghị cho thầy: Nhắc lại quy chuẩn trình bày bài thi vào lớp 10 ở tiết học tới.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900">
                      2. Quên ghi đơn vị độ dài (cm) ở bước kết luận
                    </span>
                    <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                      28% học sinh mắc
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Học sinh tính ra AH = 4.8 nhưng bỏ quên đơn vị (cm), dễ bị trừ 0.25 điểm trong barem thi chính thức.
                  </p>
                  <p className="text-[11px] text-rose-800 font-semibold italic">
                    💡 AI đã tự động cảnh báo lỗi này trong nhận xét của từng em.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Detail Inspection Modal */}
      {inspectingSubmission && (
        <AIGradingModal
          submission={inspectingSubmission}
          onClose={() => setInspectingSubmission(null)}
          onUpdateSubmission={(updated) => {
            onUpdateSubmission(updated);
            setInspectingSubmission(updated);
          }}
          isTeacherView={true}
        />
      )}

      {/* Snap / Submit Homework Modal */}
      {isSubmitModalOpen && (
        <StudentSubmitModal
          assignment={currentAssignment}
          allAssignments={assignments}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmitSuccess={(newSub) => {
            onAddSubmission(newSub);
            setIsSubmitModalOpen(false);
            setInspectingSubmission(newSub);
          }}
          defaultStudentName="Nguyễn Hoàng Nam"
        />
      )}
    </div>
  );
};
