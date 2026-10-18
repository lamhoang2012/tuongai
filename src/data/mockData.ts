import { Classroom, Assignment, StudentSubmission } from '../types';

export const INITIAL_CLASSES: Classroom[] = [
  {
    id: 'class-9a',
    code: 'TOAN9A',
    name: 'Lớp 9A - Toán Hình học & Đại số',
    grade: 'Lớp 9',
    teacherName: 'Thầy Nguyễn Tuấn',
    studentCount: 38,
    coverColor: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'class-8b',
    code: 'VAN8B',
    name: 'Lớp 8B - Ngữ Văn Chuyên Đề',
    grade: 'Lớp 8',
    teacherName: 'Cô Trần Thanh Hà',
    studentCount: 42,
    coverColor: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'class-5a',
    code: 'TOAN5A',
    name: 'Lớp 5A1 - Vở Bài Tập Toán Tiểu Học',
    grade: 'Lớp 5',
    teacherName: 'Thầy Nguyễn Tuấn',
    studentCount: 32,
    coverColor: 'from-amber-500 to-orange-600',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-1',
    classId: 'class-9a',
    title: 'Bài tập 1: Hệ thức lượng trong tam giác vuông',
    subject: 'Toán',
    gradeLevel: 'Lớp 9',
    dueDate: '23:59 hôm nay',
    description: 'Làm các bài tập 1, 2, 3 trang 68 SGK Toán 9 tập 1. Học sinh trình bày ra vở ô li rồi chụp ảnh rõ nét gửi lên tường lớp.',
    rubric: `Barem chấm điểm:
1. Vẽ hình đúng, ghi rõ giả thiết, kết luận (1.0 điểm)
2. Áp dụng đúng định lý Pytago tính cạnh huyền (2.5 điểm)
3. Áp dụng đúng hệ thức lượng b.c = a.h tính đường cao AH (3.0 điểm)
4. Tính hình chiếu BH, CH và kết luận đầy đủ đơn vị cm (2.5 điểm)
5. Trình bày sạch đẹp, lập luận logic, chữ viết rõ ràng (1.0 điểm)`,
    totalSubmissions: 28,
    gradedCount: 26,
    averageScore: 8.6,
  },
  {
    id: 'assign-2',
    classId: 'class-9a',
    title: 'Bài tập 2: Rút gọn biểu thức chứa căn bậc hai',
    subject: 'Toán',
    gradeLevel: 'Lớp 9',
    dueDate: '20:00 ngày mai',
    description: 'Rút gọn biểu thức P và tìm giá trị của x để P > 1. Viết từng bước biến đổi phân thức.',
    rubric: '1. Tìm ĐKXĐ đúng (1.5 điểm)\n2. Quy đồng mẫu thức chính xác (3.5 điểm)\n3. Rút gọn tử và mẫu (3.0 điểm)\n4. Giải bất phương trình P > 1 và đối chiếu ĐKXĐ (2.0 điểm)',
    totalSubmissions: 19,
    gradedCount: 15,
    averageScore: 7.9,
  },
  {
    id: 'assign-3',
    classId: 'class-8b',
    title: 'Đoạn văn nghị luận: Ý nghĩa của tinh thần tự học',
    subject: 'Ngữ Văn',
    gradeLevel: 'Lớp 8',
    dueDate: 'Hết tuần này',
    description: 'Viết đoạn văn khoảng 200 chữ trình bày suy nghĩ của em về ý nghĩa của việc tự học trong thời đại công nghệ số.',
    rubric: '1. Đúng hình thức đoạn văn, dung lượng 200 chữ (2.0 điểm)\n2. Xác định đúng vấn đề nghị luận (2.0 điểm)\n3. Hệ thống luận điểm, dẫn chứng thực tế thuyết phục (4.0 điểm)\n4. Diễn đạt lưu loát, không sai chính tả ngữ pháp (2.0 điểm)',
    totalSubmissions: 35,
    gradedCount: 30,
    averageScore: 8.2,
  },
];

// Preloaded realistic submissions
export const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-1',
    assignmentId: 'assign-1',
    studentName: 'Nguyễn Minh Khang',
    submittedAt: '10 phút trước',
    type: 'photo',
    status: 'graded_ai',
    adjustedScore: 8.5,
    textSolution: `Cho tam giác ABC vuông tại A, đường cao AH. AB = 6cm, AC = 8cm.
1) Áp dụng định lý Pytago trong tam giác ABC:
   BC² = AB² + AC² = 6² + 8² = 100 => BC = 10 (cm).
2) Áp dụng hệ thức lượng: AB . AC = AH . BC
   => AH = (6 . 8) / 10 = 4.8 (cm).
3) Tính BH: AB² = BH . BC => BH = 36 / 10 = 3.6 (cm).`,
    gradingResult: {
      score: 8.5,
      summaryVerdict: 'Bài làm rất tốt, lập luận chặt chẽ, tính toán chuẩn xác',
      transcription: `Cho tam giác ABC vuông tại A, đường cao AH (H thuộc BC). Biết AB = 6cm, AC = 8cm.\n1) Áp dụng định lý Pytago trong tam giác vuông ABC:\nBC² = AB² + AC² = 6² + 8² = 100 => BC = 10 (cm).\n2) Áp dụng hệ thức lượng: AB . AC = AH . BC => AH = (6.8)/10 = 4.8 (cm).\n3) Tính BH: AB² = BH . BC => BH = 36/10 = 3.6 (cm).`,
      strengths: [
        'Nắm vững định lý Pytago và hệ thức liên hệ cạnh - đường cao.',
        'Tính toán chuẩn xác, ghi đầy đủ đơn vị độ dài (cm).',
        'Vở ô li viết chữ ngay ngắn, sạch đẹp.',
      ],
      lineFeedback: [
        {
          stepOrLine: 'Dòng 1: Đặt giả thiết',
          status: 'correct',
          comment: 'Nêu rõ tam giác vuông và vị trí đường cao AH.',
        },
        {
          stepOrLine: 'Dòng 2: Tính cạnh huyền BC',
          status: 'correct',
          comment: 'Thay số và khai căn chính xác BC = 10 cm.',
        },
        {
          stepOrLine: 'Dòng 3: Tính đường cao AH',
          status: 'warning',
          comment: 'Kết quả AH = 4.8 cm đúng, nhưng nên nêu cụ thể "Áp dụng hệ thức lượng trong △ vuông".',
          correction: 'Bổ sung tên định lý trước khi áp dụng hệ thức.',
        },
        {
          stepOrLine: 'Dòng 4: Tính hình chiếu BH',
          status: 'correct',
          comment: 'Tính BH = 3.6 cm chuẩn xác.',
        },
      ],
      overallComment: 'Em làm bài rất cẩn thận, nét chữ đẹp. Lần sau chú ý trích dẫn tên định lý đầy đủ để không bị trừ điểm trình bày trong kỳ thi vào lớp 10 nhé!',
      recommendedPractice: [
        {
          title: 'Bài tập 1: Tính các cạnh tam giác khi biết đường cao',
          question: 'Cho △ABC vuông tại A, AH = 12cm, CH = 16cm. Tính độ dài BH và AB.',
          hint: 'Áp dụng hệ thức AH² = BH . CH để tìm BH trước.',
        },
      ],
      gradedAt: 'Hôm nay 18:30',
    },
    teacherNote: 'Thầy đã xem lại, AI chấm chuẩn xác. Cộng 0.5 điểm khuyến khích vì vở sạch chữ đẹp!',
  },
  {
    id: 'sub-2',
    assignmentId: 'assign-1',
    studentName: 'Trần Mai Anh',
    submittedAt: '25 phút trước',
    type: 'photo',
    status: 'reviewed_teacher',
    adjustedScore: 9.5,
    textSolution: `Tam giác ABC vuông tại A có đường cao AH.
1) BC² = AB² + AC² = 36 + 64 = 100 => BC = 10 cm (Định lý Pytago)
2) Theo hệ thức lượng: AH . BC = AB . AC => AH = 48/10 = 4.8 cm
3) AB² = BH . BC => BH = 36/10 = 3.6 cm
4) CH = BC - BH = 10 - 3.6 = 6.4 cm.`,
    gradingResult: {
      score: 9.5,
      summaryVerdict: 'Bài làm xuất sắc, đầy đủ và ngắn gọn',
      transcription: `1) BC = 10 cm\n2) AH = 4.8 cm\n3) BH = 3.6 cm, CH = 6.4 cm`,
      strengths: [
        'Trình bày hoàn hảo, tính thêm cả hình chiếu CH.',
        'Mỗi bước đều có chú thích định lý trong ngoặc đơn.',
      ],
      lineFeedback: [
        {
          stepOrLine: 'Toàn bộ bài làm',
          status: 'correct',
          comment: 'Hoàn hảo không có điểm trừ.',
        },
      ],
      overallComment: 'Bài làm rất tốt, đáng khen ngợi!',
      recommendedPractice: [
        {
          title: 'Bài tập nâng cao: Góc và tỉ số lượng giác',
          question: 'Tính góc B và góc C của tam giác ABC nói trên (làm tròn đến độ).',
          hint: 'Dùng sin B = AC / BC hoặc tan B = AC / AB.',
        },
      ],
      gradedAt: 'Hôm nay 18:15',
    },
    teacherNote: 'Xuất sắc, tiếp tục phát huy!',
  },
  {
    id: 'sub-3',
    assignmentId: 'assign-1',
    studentName: 'Lê Hoàng Nam',
    submittedAt: '40 phút trước',
    type: 'text',
    status: 'graded_ai',
    adjustedScore: 7.0,
    textSolution: `BC^2 = 6^2 + 8^2 = 100 => BC = 10
AH = 6 * 8 / 10 = 4.8
BH = 6^2 / 10 = 3.6`,
    gradingResult: {
      score: 7.0,
      summaryVerdict: 'Kết quả đúng nhưng còn thiếu lời giải và đơn vị',
      transcription: `BC^2 = 6^2 + 8^2 = 100 => BC = 10\nAH = 6 * 8 / 10 = 4.8\nBH = 6^2 / 10 = 3.6`,
      strengths: ['Công thức tính toán đều đúng, ra kết quả chính xác.'],
      lineFeedback: [
        {
          stepOrLine: 'Dòng 1',
          status: 'warning',
          comment: 'Cần ghi "Áp dụng định lý Pytago..." và ghi đơn vị cm sau số 10.',
          correction: 'BC = 10 (cm)',
        },
        {
          stepOrLine: 'Dòng 2',
          status: 'warning',
          comment: 'Chưa có công thức chữ trước khi thay số.',
          correction: 'Ghi AH = (AB . AC) / BC = ...',
        },
      ],
      overallComment: 'Em làm nháp rất nhanh nhưng khi nộp bài thi cần viết câu dẫn lời giải và đơn vị (cm) nhé!',
      recommendedPractice: [
        {
          title: 'Rèn luyện kỹ năng trình bày bài toán hình',
          question: 'Trình bày lại bài toán trên đầy đủ các bước theo mẫu chuẩn của thầy.',
          hint: 'Mỗi phép tính cần có: Tên định lý -> Công thức tổng quát -> Thay số -> Kết luận có đơn vị.',
        },
      ],
      gradedAt: 'Hôm nay 17:55',
    },
  },
  {
    id: 'sub-4',
    assignmentId: 'assign-1',
    studentName: 'Phạm Thu Thảo',
    submittedAt: '1 giờ trước',
    type: 'photo',
    status: 'graded_ai',
    adjustedScore: 8.0,
    textSolution: `Tính BC: BC² = 6² + 8² = 100 => BC = 10cm.
Tính AH: 1/AH² = 1/AB² + 1/AC² = 1/36 + 1/64 = 25/576
=> AH² = 576/25 => AH = 24/5 = 4.8cm.`,
    gradingResult: {
      score: 8.0,
      summaryVerdict: 'Áp dụng hệ thức nghịch đảo bình phương đường cao sáng tạo',
      transcription: `1/AH² = 1/AB² + 1/AC² => AH = 4.8cm`,
      strengths: ['Sử dụng cách 2 với công thức nghịch đảo bình phương rất tốt.'],
      lineFeedback: [
        {
          stepOrLine: 'Bước tính AH',
          status: 'correct',
          comment: 'Quy đồng và khai căn phân số 576/25 rất chính xác.',
        },
      ],
      overallComment: 'Cách giải rất hay, thể hiện sự hiểu sâu bản chất hệ thức lượng!',
      recommendedPractice: [],
      gradedAt: 'Hôm nay 17:30',
    },
  },
];

// Sample test papers for quick testing without taking a real photo
export const SAMPLE_HANDWRITTEN_TESTS = [
  {
    id: 'sample-geo',
    title: 'Vở ô li Toán 9: Hệ thức lượng hình học',
    author: 'Nguyễn Hoàng Nam (Lớp 9A)',
    subject: 'Toán',
    assignmentTitle: 'Bài tập 1: Hệ thức lượng trong tam giác vuông',
    text: `Cho tam giác ABC vuông tại A, đường cao AH (H thuộc BC).
Biết AB = 6cm, AC = 8cm.
1) Áp dụng định lý Pytago trong tam giác ABC:
   BC² = AB² + AC² = 6² + 8² = 36 + 64 = 100
   => BC = √100 = 10 (cm)
2) Áp dụng hệ thức lượng liên hệ cạnh và đường cao:
   AB . AC = AH . BC
   => AH = (AB . AC) / BC = (6 . 8) / 10 = 4.8 (cm)
3) Tính độ dài hình chiếu BH:
   AB² = BH . BC => BH = AB² / BC = 36 / 10 = 3.6 (cm)`,
    previewNote: 'Chữ viết tay trên vở kẻ ô li vuông chuẩn học sinh THCS',
  },
  {
    id: 'sample-algebra',
    title: 'Bài thi Đại số: Rút gọn biểu thức chứa căn',
    author: 'Trần Thảo Ly (Lớp 9B)',
    subject: 'Toán',
    assignmentTitle: 'Bài tập 2: Rút gọn biểu thức chứa căn bậc hai',
    text: `ĐKXĐ: x >= 0 và x khác 4.
Biểu thức P = [ (√x / (√x - 2)) - (2 / (√x + 2)) ] : ((x + 4) / (x - 4))
Quy đồng trong ngoặc vuông:
P = [ (√x(√x + 2) - 2(√x - 2)) / (x - 4) ] . ((x - 4) / (x + 4))
= [ (x + 2√x - 2√x + 4) / (x - 4) ] . ((x - 4) / (x + 4))
= [ (x + 4) / (x - 4) ] . ((x - 4) / (x + 4))
= 1.
Để P > 1 => 1 > 1 (vô lý). Vậy không có giá trị nào của x để P > 1.`,
    previewNote: 'Bài giải đại số chi tiết có tìm ĐKXĐ',
  },
  {
    id: 'sample-literature',
    title: 'Văn nghị luận: Ý nghĩa của sự kiên trì',
    author: 'Lê Ngọc Mai (Lớp 8A)',
    subject: 'Ngữ Văn',
    assignmentTitle: 'Đoạn văn nghị luận xã hội',
    text: `Trong cuộc sống đầy thử thách, kiên trì chính là chiếc chìa khóa vạn năng giúp con người mở ra cánh cửa thành công. Kiên trì là sự bền bỉ, nhẫn nại, không nản lòng trước thất bại mà luôn hướng tới mục tiêu đã đặt ra. Nhờ có lòng kiên trì, nhà bác học Thomas Edison đã thử nghiệm hàng nghìn lần để phát minh ra bóng đèn điện chiếu sáng cho nhân loại. Đối với học sinh, kiên trì thể hiện qua việc tự giác học tập mỗi ngày, không bỏ cuộc trước những bài toán khó. Tóm lại, kiên trì không chỉ tôi luyện bản lĩnh mà còn giúp ta trưởng thành và vững vàng trên con đường tương lai.`,
    previewNote: 'Đoạn văn chữ viết tay học sinh THCS',
  },
];
