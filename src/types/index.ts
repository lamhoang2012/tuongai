export interface LineFeedbackItem {
  stepOrLine: string;
  status: 'correct' | 'warning' | 'error';
  detail?: string;
  comment: string;
  correction?: string;
}

export interface PracticeQuestion {
  title: string;
  question: string;
  hint: string;
}

export interface AIGradingResult {
  score: number;
  summaryVerdict: string;
  transcription: string;
  strengths: string[];
  lineFeedback: LineFeedbackItem[];
  overallComment: string;
  recommendedPractice: PracticeQuestion[];
  gradedAt: string;
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentName: string;
  studentAvatar?: string;
  submittedAt: string;
  type: 'photo' | 'text';
  imageUrl?: string;
  textSolution?: string;
  gradingResult?: AIGradingResult;
  status: 'pending' | 'graded_ai' | 'reviewed_teacher';
  teacherNote?: string;
  adjustedScore?: number;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  subject: 'Toán' | 'Ngữ Văn' | 'Tiếng Anh' | 'Vật Lý' | 'Hóa Học' | 'Khoa Học Tự Nhiên';
  gradeLevel: string;
  dueDate: string;
  description: string;
  rubric: string;
  totalSubmissions: number;
  gradedCount: number;
  averageScore?: number;
}

export interface Classroom {
  id: string;
  code: string;
  name: string;
  grade: string;
  teacherName: string;
  studentCount: number;
  coverColor: string;
}
