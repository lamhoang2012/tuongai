import { GoogleGenAI } from '@google/genai';

type GradeBody = {
  imageBase64?: string;
  mimeType?: string;
  studentText?: string;
  assignmentTitle?: string;
  rubric?: string;
  subject?: string;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Chỉ hỗ trợ phương thức POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      success: false,
      error: 'Máy chủ chưa được cấu hình GEMINI_API_KEY. Hãy thêm khóa trong Vercel → Settings → Environment Variables.'
    });
  }

  const body = (req.body || {}) as GradeBody;
  const { imageBase64, studentText = '', assignmentTitle = '', rubric = '', subject = 'Toán học' } = body;
  if (!String(studentText).trim() && !String(assignmentTitle).trim() && !imageBase64) {
    return res.status(400).json({ success: false, error: 'Hãy nhập đề bài, bài làm hoặc tải ảnh lên.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const parts: any[] = [];
    if (imageBase64) {
      const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      const mimeType = body.mimeType || match?.[1] || 'image/jpeg';
      const data = match?.[2] || imageBase64.replace(/^data:[^,]+,/, '');
      if (!mimeType.startsWith('image/')) {
        return res.status(400).json({ success: false, error: 'Tệp tải lên phải là ảnh.' });
      }
      if (data.length > 4_000_000) {
        return res.status(413).json({ success: false, error: 'Ảnh quá lớn. Hãy chọn ảnh nhỏ hơn 2,5 MB.' });
      }
      parts.push({ inlineData: { mimeType, data } });
    }

    parts.push({
      text: `Bạn là giáo viên hỗ trợ học tập. Phân tích bài làm bằng tiếng Việt, trung thực và không tự bịa nội dung không đọc được.
Môn học: ${subject}
Đề bài: ${assignmentTitle || 'Không được cung cấp'}
Bài làm dạng chữ: ${studentText || 'Hãy đọc từ ảnh đính kèm.'}
Đáp án hoặc tiêu chí chấm: ${rubric || 'Đánh giá theo kiến thức chuẩn, nêu rõ khi thiếu dữ kiện.'}

Trả về JSON với các trường:
- score: số từ 0 đến 10 hoặc null nếu chưa đủ thông tin
- summaryVerdict: nhận định ngắn
- transcription: nội dung bài làm đọc được
- strengths: mảng các điểm làm tốt
- lineFeedback: mảng object gồm stepOrLine, status (correct/warning/error), detail, comment, correction
- overallComment: nhận xét chung
- recommendedPractice: mảng object gồm title, question, hint
Nếu ảnh mờ hoặc thiếu đề bài, phải nêu rõ giới hạn và không đoán điểm chắc chắn.`
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts }],
      config: { responseMimeType: 'application/json' }
    });

    let data: any;
    try {
      data = JSON.parse(response.text || '{}');
    } catch {
      throw new Error('AI trả về dữ liệu không đúng định dạng. Vui lòng thử lại.');
    }

    if (typeof data.score === 'number') {
      data.score = Math.max(0, Math.min(10, data.score));
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Grade API error:', error);
    return res.status(502).json({
      success: false,
      error: 'Không thể phân tích bài làm lúc này. Hãy kiểm tra khóa Gemini và thử lại.'
    });
  }
}
