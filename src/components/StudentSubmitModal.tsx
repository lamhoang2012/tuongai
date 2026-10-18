import React, { useState, useRef, useEffect } from 'react';
import { Assignment, StudentSubmission, AIGradingResult } from '../types';
import { SAMPLE_HANDWRITTEN_TESTS } from '../data/mockData';
import { 
  X, Camera, Upload, Type, Sparkles, Check, RefreshCw, FileText, 
  HelpCircle, AlertCircle, ArrowRight, Lightbulb 
} from 'lucide-react';

interface StudentSubmitModalProps {
  assignment: Assignment;
  allAssignments?: Assignment[];
  onClose: () => void;
  onSubmitSuccess: (newSubmission: StudentSubmission) => void;
  defaultStudentName?: string;
}

export const StudentSubmitModal: React.FC<StudentSubmitModalProps> = ({
  assignment,
  allAssignments = [],
  onClose,
  onSubmitSuccess,
  defaultStudentName = '',
}) => {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(assignment.id);
  const currentAssignment = allAssignments.find(a => a.id === selectedAssignmentId) || assignment;

  const [studentName, setStudentName] = useState(defaultStudentName || '');
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'text' | 'sample'>('sample');
  
  // Text solution
  const [textSolution, setTextSolution] = useState('');
  
  // Image handling
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  
  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Grading loading state
  const [isGrading, setIsGrading] = useState(false);
  const [gradingStep, setGradingStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Math helper symbols
  const mathSymbols = ['²', '³', '√', '△', '⊥', '//', '°', 'π', '≥', '≤', '⇒', '⇔'];

  // Start Camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Không thể mở máy ảnh. Vui lòng cấp quyền camera trên trình duyệt hoặc chọn "Tải ảnh lên".');
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Capture snapshot from camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUrl);
      setImageFileName('anh-chup-vo-oli.jpg');
      stopCamera();
    }
  };

  // Clean up camera on unmount or tab switch
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  }, [activeTab]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick load sample test
  const handleSelectSample = (sample: typeof SAMPLE_HANDWRITTEN_TESTS[0]) => {
    setTextSolution(sample.text);
    if (!studentName) {
      setStudentName(sample.author.split(' (')[0]);
    }
    // Also generate a notebook SVG screenshot for this sample
    setSelectedImage(null);
  };

  // Handle Submit & Real AI Grading
  const handleSubmitAndGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của em trước khi nộp bài.');
      return;
    }

    if (!selectedImage && !textSolution.trim()) {
      setErrorMsg('Vui lòng chụp ảnh vở hoặc gõ nội dung bài làm.');
      return;
    }

    setErrorMsg(null);
    setIsGrading(true);
    setGradingStep(1);

    // Simulate educational step transitions
    const stepTimer1 = setTimeout(() => setGradingStep(2), 900);
    const stepTimer2 = setTimeout(() => setGradingStep(3), 1800);
    const stepTimer3 = setTimeout(() => setGradingStep(4), 2700);

    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage || undefined,
          studentText: textSolution,
          assignmentTitle: currentAssignment.title,
          rubric: currentAssignment.rubric,
          subject: currentAssignment.subject,
        }),
      });

      const resData = await response.json();
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      if (resData.success && resData.data) {
        const grading: AIGradingResult = {
          ...resData.data,
          gradedAt: 'Vừa xong',
        };

        const newSub: StudentSubmission = {
          id: `sub-${Date.now()}`,
          assignmentId: currentAssignment.id,
          studentName: studentName.trim(),
          submittedAt: 'Vừa xong',
          type: selectedImage ? 'photo' : 'text',
          imageUrl: selectedImage || undefined,
          textSolution: textSolution || grading.transcription,
          gradingResult: grading,
          status: 'graded_ai',
          adjustedScore: grading.score,
        };

        setIsGrading(false);
        onSubmitSuccess(newSub);
      } else {
        throw new Error('Không nhận được phản hồi chấm bài từ AI');
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsGrading(false);
      setErrorMsg('Có lỗi xảy ra khi chấm bài. Vui lòng thử lại!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Camera className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold leading-tight">
                Nộp bài & AI chấm ngay
              </h3>
              <p className="text-xs text-sky-100">
                Chụp ảnh vở ô li hoặc gõ bài làm để nhận điểm và sửa lỗi tức thì
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmitAndGrade} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Student Info & Assignment Selection */}
          <div className="grid sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và tên của em <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Minh Khang"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bài tập cần nộp
              </label>
              <select
                value={selectedAssignmentId}
                onChange={(e) => setSelectedAssignmentId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                {allAssignments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({a.subject})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignment Quick Guide */}
          <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-3 text-xs text-slate-700">
            <span className="font-bold text-sky-900 block mb-0.5">
              📌 Yêu cầu bài tập:
            </span>
            <p className="line-clamp-2 text-slate-600">{currentAssignment.description}</p>
          </div>

          {/* Submission Method Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Chọn phương thức nộp bài:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('sample')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'sample'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Thử bài mẫu</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('camera')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'camera'
                    ? 'bg-sky-600 text-white border-sky-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Chụp ảnh</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-sky-600 text-white border-sky-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Tải ảnh lên</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'text'
                    ? 'bg-sky-600 text-white border-sky-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Gõ bài giải</span>
              </button>
            </div>
          </div>

          {/* TAB 1: SAMPLE TEST PAPERS (Quick 1-click test for user) */}
          {activeTab === 'sample' && (
            <div className="space-y-3 bg-amber-50/40 border border-amber-200/70 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">
                  Chọn một bài tập chữ viết tay mẫu để kiểm tra tính năng chấm AI:
                </span>
                <span className="text-[11px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-semibold">
                  1-Click Test
                </span>
              </div>

              <div className="space-y-2">
                {SAMPLE_HANDWRITTEN_TESTS.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="p-3 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl cursor-pointer transition-all shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 group-hover:text-amber-900">
                        {sample.title}
                      </span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {sample.subject}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 font-mono">
                      {sample.text.slice(0, 120)}...
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-sky-700 font-semibold">
                      <span>Người làm: {sample.author}</span>
                      <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Dùng bài này <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {textSolution && (
                <div className="mt-3 p-3 bg-oli-paper rounded-xl border border-sky-200 font-handwriting text-blue-900 text-base max-h-40 overflow-y-auto">
                  <span className="font-sans text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Xem trước bài làm sẽ gửi cho AI:
                  </span>
                  <div className="whitespace-pre-line leading-relaxed">{textSolution}</div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CAMERA CAPTURE */}
          {activeTab === 'camera' && (
            <div className="space-y-3">
              {cameraError ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  <p className="font-bold mb-1">Lỗi camera</p>
                  <p>{cameraError}</p>
                </div>
              ) : selectedImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-black max-h-64 flex items-center justify-center">
                  <img src={selectedImage} alt="Chụp ảnh vở" className="max-h-64 object-contain" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      startCamera();
                    }}
                    className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Chụp lại
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-black aspect-video flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-4 border-2 border-dashed border-white/60 rounded-lg pointer-events-none flex items-center justify-center">
                      <span className="text-white/80 text-xs bg-black/40 px-2 py-1 rounded">
                        Căn chỉnh trang vở hoặc giấy kiểm tra vào đây
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" /> Bấm để chụp ảnh vở
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-sky-50/40">
                <Upload className="w-8 h-8 text-sky-600 mb-2" />
                <span className="text-xs font-bold text-slate-800">
                  Nhấn để chọn ảnh vở ô li hoặc kéo thả vào đây
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  Hỗ trợ định dạng JPG, PNG, WEBP (ảnh chụp rõ chữ)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {selectedImage && (
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-900 truncate">
                    <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="truncate">{imageFileName || 'Ảnh bài làm đã chọn'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer ml-2"
                  >
                    Xóa ảnh
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DIRECT TEXT WRITING */}
          {activeTab === 'text' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Gõ bài làm hoặc dán lời giải:
                </span>
                {/* Math helper shortcuts */}
                <div className="flex items-center gap-1 overflow-x-auto py-1">
                  {mathSymbols.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => setTextSolution((prev) => prev + sym)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-sky-100 text-slate-800 hover:text-sky-800 rounded text-xs font-mono font-bold transition-colors cursor-pointer"
                      title={`Thêm ký hiệu ${sym}`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={textSolution}
                onChange={(e) => setTextSolution(e.target.value)}
                placeholder="Gõ lời giải từng bước của em vào đây..."
                rows={6}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          )}

          {/* AI Grading Status Modal Overlay when submitting */}
          {isGrading && (
            <div className="p-5 bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-200 rounded-2xl text-center space-y-3 animate-fade-in">
              <div className="w-12 h-12 mx-auto rounded-full bg-sky-600 text-white flex items-center justify-center animate-pulse shadow-md">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Hệ thống AI đang chấm bài...
              </h4>

              {/* Progress Steps */}
              <div className="space-y-1.5 text-xs text-left max-w-sm mx-auto">
                <div className={`flex items-center gap-2 ${gradingStep >= 1 ? 'text-sky-700 font-bold' : 'text-slate-400'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${gradingStep >= 1 ? 'bg-sky-600 text-white' : 'bg-slate-200'}`}>
                    1
                  </span>
                  <span>Đang nhận diện chữ viết tay qua Gemini OCR...</span>
                </div>
                <div className={`flex items-center gap-2 ${gradingStep >= 2 ? 'text-sky-700 font-bold' : 'text-slate-400'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${gradingStep >= 2 ? 'bg-sky-600 text-white' : 'bg-slate-200'}`}>
                    2
                  </span>
                  <span>Đối chiếu barem điểm và công thức của giáo viên...</span>
                </div>
                <div className={`flex items-center gap-2 ${gradingStep >= 3 ? 'text-sky-700 font-bold' : 'text-slate-400'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${gradingStep >= 3 ? 'bg-sky-600 text-white' : 'bg-slate-200'}`}>
                    3
                  </span>
                  <span>Phân tích lỗi sai từng dòng và đề xuất cách sửa...</span>
                </div>
                <div className={`flex items-center gap-2 ${gradingStep >= 4 ? 'text-sky-700 font-bold' : 'text-slate-400'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${gradingStep >= 4 ? 'bg-sky-600 text-white' : 'bg-slate-200'}`}>
                    4
                  </span>
                  <span>Tổng hợp điểm và tạo bài tập rèn luyện riêng...</span>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer CTA */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              disabled={isGrading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={isGrading}
              className="py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 hover:from-sky-500 hover:to-indigo-600 shadow-md shadow-sky-900/10 active:scale-98 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Nộp bài & AI chấm ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
