import React, { useMemo, useRef, useState } from 'react';
import {
  Activity, AlertCircle, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen,
  BrainCircuit, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp,
  ClipboardCheck, CloudUpload, FileImage, FileText, GraduationCap, LayoutDashboard,
  Lightbulb, Menu, MessageSquareText, Plus, Search, Send, Settings, ShieldCheck,
  Sparkles, Target, TrendingUp, Upload, Users, X, Zap
} from 'lucide-react';

type View = 'overview' | 'analysis' | 'wall' | 'reports';
type Sample = { id: number; name: string; subject: string; score: number; status: string; issue: string; color: string };

const initialSamples: Sample[] = [
  { id: 1, name: 'Nguyễn Minh Anh', subject: 'Toán học · Phương trình', score: 7.5, status: 'Cần luyện tập', issue: 'Chuyển vế chưa đổi dấu', color: 'blue' },
  { id: 2, name: 'Trần Gia Bảo', subject: 'Toán học · Phương trình', score: 9, status: 'Hoàn thành tốt', issue: 'Trình bày lời giải rõ ràng', color: 'green' },
  { id: 3, name: 'Lê Phương Linh', subject: 'Toán học · Phương trình', score: 6.5, status: 'Cần hỗ trợ', issue: 'Nhầm quy tắc phân phối', color: 'orange' },
];

export default function App() {
  const [view, setView] = useState<View>('overview');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [search, setSearch] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [uploadedName, setUploadedName] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [subject, setSubject] = useState('Toán học');
  const [gradingResult, setGradingResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [samples, setSamples] = useState(initialSamples);
  const [notice, setNotice] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const filteredSamples = useMemo(() => samples.filter(s => (s.name + s.subject + s.issue).toLowerCase().includes(search.toLowerCase())), [samples, search]);

  const go = (next: View) => { setView(next); setMobileMenu(false); setNotice(''); };
  const analyze = async () => {
    if (!question.trim() && !answer.trim() && !uploadedFile) {
      setNotice('Hãy nhập đề bài, bài làm hoặc tải ảnh bài tập lên trước nhé.');
      return;
    }
    setIsAnalyzing(true);
    setNotice('');
    setGradingResult(null);
    try {
      let imageBase64: string | undefined;
      if (uploadedFile) {
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Không đọc được ảnh.'));
          reader.onerror = () => reject(new Error('Không đọc được tệp ảnh.'));
          reader.readAsDataURL(uploadedFile);
        });
      }
      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentTitle: question,
          studentText: answer,
          subject,
          imageBase64,
          mimeType: uploadedFile?.type || 'image/jpeg'
        })
      });
      const payload = await response.json();
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || 'Không thể phân tích bài làm. Vui lòng thử lại.');
      }
      setGradingResult(payload.data);
      setAnalyzed(true);
      setNotice(payload.isSimulatedNotice || 'Đã nhận kết quả phân tích. Hãy kiểm tra lại trước khi sử dụng để chấm điểm.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi phân tích bài làm.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  const addPractice = () => {
    setSamples(prev => [{ id: Date.now(), name: 'Bài làm mới', subject: 'Bài luyện tập · Đại số', score: 8, status: 'Vừa cập nhật', issue: 'Đã lưu vào tường học tập', color: 'blue' }, ...prev]);
    setNotice('Đã thêm bài luyện tập mẫu vào tường học tập.');
    setView('wall');
  };

  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Tổng quan', icon: <LayoutDashboard size={18} /> },
    { id: 'analysis', label: 'Truy gốc lỗi AI', icon: <BrainCircuit size={18} /> },
    { id: 'wall', label: 'Tường học tập', icon: <BookOpen size={18} /> },
    { id: 'reports', label: 'Báo cáo kết quả', icon: <ClipboardCheck size={18} /> },
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><BrainCircuit size={25} strokeWidth={2.2} /></div>
          <div><strong>Tường học tập AI</strong><span>TRUY GỐC LỖI</span></div>
          <button className="icon-btn sidebar-close" onClick={() => setMobileMenu(false)} aria-label="Đóng menu"><X size={19} /></button>
        </div>
        <div className="workspace-label">KHÔNG GIAN HỌC TẬP</div>
        <nav className="side-nav" aria-label="Điều hướng chính">
          {navItems.map(item => <button key={item.id} onClick={() => go(item.id)} className={`nav-item ${view === item.id ? 'active' : ''}`}>{item.icon}<span>{item.label}</span>{view === item.id && <ChevronRight className="nav-chevron" size={16} />}</button>)}
        </nav>
        <div className="sidebar-tip">
          <div className="tip-icon"><Sparkles size={18} /></div>
          <strong>Học từ lỗi sai</strong>
          <p>Mỗi lỗi là một cơ hội để hiểu sâu hơn và tiến bộ từng ngày.</p>
          <button onClick={() => go('analysis')}>Thử phân tích <ArrowRight size={15} /></button>
        </div>
        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setNotice('Cài đặt demo: dữ liệu hiện được lưu trong phiên sử dụng này.')}><Settings size={18} /><span>Cài đặt</span></button>
          <div className="profile">
            <div className="avatar">LH</div><div className="profile-copy"><strong>{role === 'teacher' ? 'Giáo viên hướng dẫn' : 'Học sinh 8A4'}</strong><span>{role === 'teacher' ? 'Quản lý lớp học' : 'Không gian học cá nhân'}</span></div>
            <button className="icon-btn" aria-label="Đổi vai trò" onClick={() => setRole(role === 'teacher' ? 'student' : 'teacher')}><ChevronDown size={17} /></button>
          </div>
        </div>
      </aside>

      {mobileMenu && <button className="mobile-overlay" onClick={() => setMobileMenu(false)} aria-label="Đóng menu" />}
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-menu-btn" onClick={() => setMobileMenu(true)} aria-label="Mở menu"><Menu size={21} /></button>
            <div className="breadcrumb">Không gian học tập <ChevronRight size={15} /> <strong>{navItems.find(n => n.id === view)?.label}</strong></div>
          </div>
          <div className="topbar-right">
            <div className="live-status"><span /> Hệ thống sẵn sàng</div>
            <button className="role-switch" onClick={() => setRole(role === 'teacher' ? 'student' : 'teacher')}><Users size={16} /> {role === 'teacher' ? 'Giáo viên' : 'Học sinh'} <ChevronDown size={15} /></button>
            <div className="avatar top-avatar">LH</div>
          </div>
        </header>

        <div className="page-content">
          {notice && <div className="notice"><CheckCircle2 size={18} /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Đóng thông báo"><X size={16} /></button></div>}
          {view === 'overview' && <>
            <section className="welcome-row">
              <div><div className="eyebrow"><span className="eyebrow-dot" /> NỀN TẢNG HỌC TẬP THÔNG MINH</div><h1>Chào mừng trở lại! <span className="wave">✦</span></h1><p className="page-subtitle">Cùng nhìn lại tiến độ học tập và biến những lỗi sai thành bước tiến mới.</p></div>
              <button className="primary-btn" onClick={() => go('analysis')}><Sparkles size={17} /> Bắt đầu truy gốc lỗi <ArrowRight size={16} /></button>
            </section>
            <section className="hero-card">
              <div className="hero-copy"><div className="hero-pill"><Zap size={14} /> LEARNING WALL AI</div><h2>Không chỉ biết <em>sai ở đâu,</em><br />mà còn hiểu <em>vì sao sai.</em></h2><p>AI hỗ trợ phân tích từng bước làm bài, tìm nguyên nhân gốc rễ và gợi ý cách luyện tập phù hợp với mỗi học sinh.</p><button className="hero-btn" onClick={() => go('analysis')}>Phân tích bài làm <ArrowRight size={17} /></button><div className="hero-trust"><ShieldCheck size={16} /> Giáo viên kiểm duyệt · Học sinh chủ động tiến bộ</div></div>
              <div className="hero-visual"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="brain-orb"><BrainCircuit size={76} strokeWidth={1.35} /></div><div className="float-chip chip-top"><span className="chip-icon"><Target size={16} /></span><span><b>Truy gốc lỗi</b><small>Tìm nguyên nhân</small></span></div><div className="float-chip chip-bottom"><span className="chip-check"><Check size={17} /></span><span><b>Gợi ý cải thiện</b><small>Lộ trình cá nhân hóa</small></span></div><div className="visual-spark spark-a">✦</div><div className="visual-spark spark-b">✧</div></div>
            </section>
            <section className="stats-grid">
              <StatCard icon={<Users size={19}/>} label="Học sinh tham gia" value="32" note="Lớp 8A4" tone="blue" trend="+4 tuần này" />
              <StatCard icon={<ClipboardCheck size={19}/>} label="Bài làm đã xem" value={String(18 + samples.length)} note="Trong bản demo" tone="violet" trend="+6 bài mới" />
              <StatCard icon={<Target size={19}/>} label="Điểm trung bình" value="7,8/10" note="Bài luyện tập mẫu" tone="green" trend="+0,6 điểm" />
              <StatCard icon={<Activity size={19}/>} label="Lỗi đã nhận diện" value="14" note="Dữ liệu minh họa" tone="orange" trend="4 nhóm lỗi" />
            </section>
            <section className="content-grid">
              <div className="panel recent-panel"><div className="panel-heading"><div><h3>Bài làm gần đây</h3><p>Theo dõi kết quả và lỗi thường gặp</p></div><button className="text-btn" onClick={() => go('wall')}>Xem tất cả <ArrowRight size={15}/></button></div><div className="table-wrap"><table><thead><tr><th>HỌC SINH</th><th>BÀI TẬP</th><th>ĐIỂM</th><th>TRẠNG THÁI</th></tr></thead><tbody>{samples.slice(0,3).map(s => <tr key={s.id}><td><div className="student-cell"><div className={`mini-avatar ${s.color}`}>{s.name.split(' ').slice(-2).map(w => w[0]).join('')}</div><strong>{s.name}</strong></div></td><td>{s.subject}</td><td><span className="score">{s.score.toLocaleString('vi-VN')}/10</span></td><td><span className={`status-badge ${s.color}`}>{s.status}</span></td></tr>)}</tbody></table></div></div>
              <div className="panel insight-panel"><div className="panel-heading"><div><h3><Sparkles size={18} /> Góc nhìn AI</h3><p>Gợi ý từ dữ liệu minh họa</p></div><span className="ai-label">AI INSIGHT</span></div><div className="insight-main"><div className="insight-icon"><Lightbulb size={22}/></div><div><strong>Lỗi chuyển vế là điểm cần chú ý</strong><p>Một số bài làm mẫu cho thấy học sinh cần luyện thêm quy tắc đổi dấu khi chuyển hạng tử sang vế đối diện.</p></div></div><div className="insight-footer"><span><TrendingUp size={16}/> Gợi ý hoạt động</span><button onClick={addPractice}>Tạo bài luyện <ArrowRight size={15}/></button></div></div>
            </section>
            <section className="bottom-banner"><div className="banner-icon"><GraduationCap size={24}/></div><div><strong>Một lớp học, nhiều cách học khác nhau.</strong><p>Khám phá tường học tập để xem bài làm, phản hồi và các bước tiến của lớp.</p></div><button onClick={() => go('wall')}>Mở tường học tập <ArrowRight size={16}/></button></section>
          </>}

          {view === 'analysis' && <section className="workspace-page">
            <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> AI ROOT-CAUSE TRACER</div><h1>Truy gốc lỗi bài làm</h1><p className="page-subtitle">Nhập đề bài, bài làm hoặc tải ảnh để gửi đến dịch vụ phân tích AI.</p></div><div className="demo-badge"><ShieldCheck size={15}/> AI có xác nhận</div></div>
            <div className="analysis-layout"><div className="panel input-panel"><div className="panel-heading"><div><h3><FileText size={18}/> Bài làm cần phân tích</h3><p>Nội dung sẽ được gửi đến API chấm bài</p></div><span className="step-number">01</span></div>
              <label className="field-label">Môn học</label><select className="select-field" value={subject} onChange={e => setSubject(e.target.value)}><option>Toán học</option><option>Ngữ văn</option><option>Tiếng Anh</option><option>Khoa học tự nhiên</option></select>
              <label className="field-label">Đề bài / yêu cầu</label><textarea className="text-field" rows={3} value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ví dụ: Giải phương trình 2x + 5 = 13..." />
              <label className="field-label">Bài làm của học sinh</label><textarea className="text-field answer-field" rows={5} value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Nhập các bước làm bài vào đây..." />
              <input ref={fileRef} type="file" accept="image/*" className="hidden-input" onChange={e => { const f=e.target.files?.[0]; if(f) { if(f.size > 3 * 1024 * 1024) { setNotice("Ảnh quá lớn. Vui lòng chọn ảnh dưới 3 MB."); e.target.value = ""; return; } setUploadedFile(f); setUploadedName(f.name); setAnalyzed(false); setGradingResult(null); } }} />
              <button className={`upload-zone ${uploadedName ? 'upload-done' : ''}`} onClick={() => fileRef.current?.click()}><span className="upload-icon">{uploadedName ? <CheckCircle2 size={22}/> : <CloudUpload size={23}/>}</span><span><strong>{uploadedName || 'Tải ảnh bài làm lên'}</strong><small>{uploadedName ? 'Ảnh sẽ được gửi khi bạn nhấn phân tích' : 'PNG, JPG hoặc ảnh chụp vở · tối đa 3 MB'}</small></span><Upload size={18}/></button>
              <div className="privacy-note"><ShieldCheck size={15}/> Ảnh và bài làm được gửi đến API để phân tích; không nhập thông tin cá nhân không cần thiết.</div>
              <button className="primary-btn full-btn" onClick={analyze} disabled={isAnalyzing}>{isAnalyzing ? <><Activity size={17}/> Đang phân tích...</> : <><Sparkles size={17}/> Phân tích bài làm <ArrowRight size={16}/></>}</button>
            </div>
            <div className="panel results-panel"><div className="panel-heading"><div><h3><BrainCircuit size={19}/> Kết quả truy gốc lỗi</h3><p>Quy trình phân tích minh họa</p></div><span className="step-number">02</span></div>
              {!analyzed || !gradingResult ? <div className="empty-result"><div className="empty-illustration"><BrainCircuit size={44}/><Sparkles size={19} className="empty-spark"/></div><h3>{isAnalyzing ? 'Đang đọc và phân tích bài làm' : 'Kết quả sẽ xuất hiện tại đây'}</h3><p>{isAnalyzing ? 'Vui lòng đợi trong giây lát.' : 'Nhập đề bài, bài làm hoặc chọn ảnh rồi nhấn “Phân tích bài làm”.'}</p><div className="process-list"><div><span>1</span> Đọc nội dung bài làm</div><div><span>2</span> Xác định lỗi và giải thích</div><div><span>3</span> Đề xuất cách luyện tập</div></div></div> :
                <div className="result-content">
                  <div className="result-summary"><span className="result-icon"><CheckCircle2 size={22}/></span><div><span className="result-kicker">KẾT QUẢ PHÂN TÍCH</span><h3>{gradingResult.summaryVerdict || 'Đã phân tích bài làm'}</h3><p>Điểm tham khảo: <strong>{typeof gradingResult.score === 'number' ? gradingResult.score + '/10' : 'Chưa có điểm'}</strong></p></div></div>
                  {gradingResult.transcription && <div className="root-cause"><div className="cause-label"><span>01</span> NỘI DUNG NHẬN DIỆN</div><p style={{whiteSpace:'pre-wrap'}}>{gradingResult.transcription}</p></div>}
                  {Array.isArray(gradingResult.strengths) && gradingResult.strengths.length > 0 && <div className="root-cause solution"><div className="cause-label"><span>02</span> ĐIỂM LÀM TỐT</div><ul>{gradingResult.strengths.map((item:string,i:number)=><li key={i}>{item}</li>)}</ul></div>}
                  {Array.isArray(gradingResult.lineFeedback) && gradingResult.lineFeedback.map((item:any,i:number)=><div className="root-cause" key={i}><div className="cause-label"><span>{String(i+3).padStart(2,'0')}</span> {item.stepOrLine || 'Nhận xét'}</div><strong>{item.status === 'error' ? 'Cần sửa' : item.status === 'warning' ? 'Cần lưu ý' : 'Nhận xét'}</strong><p>{item.detail}</p><p>{item.comment}</p>{item.correction && <p><strong>Cách sửa:</strong> {item.correction}</p>}</div>)}
                  {gradingResult.overallComment && <div className="teacher-review"><ShieldCheck size={18}/><span><strong>Nhận xét chung</strong><small>{gradingResult.overallComment}</small></span></div>}
                  {Array.isArray(gradingResult.recommendedPractice) && gradingResult.recommendedPractice.map((item:any,i:number)=><div className="root-cause solution" key={i}><strong>{item.title || 'Bài luyện tập'}</strong><p>{item.question}</p>{item.hint && <p><strong>Gợi ý:</strong> {item.hint}</p>}</div>)}
                  <button className="secondary-btn full-btn" onClick={() => { setAnalyzed(false); setGradingResult(null); setNotice('Bạn có thể chỉnh sửa bài làm và phân tích lại.'); }}>Làm mới phân tích</button>
                </div>}
            </div></div>
            <div className="disclaimer"><CircleHelp size={17}/><p><strong>Lưu ý:</strong> Kết quả AI chỉ mang tính tham khảo. Cần giáo viên kiểm tra lại trước khi dùng để chấm điểm chính thức.</p></div>
          </section>}

          {view === 'wall' && <section className="workspace-page"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> CLASS LEARNING WALL</div><h1>Tường học tập lớp 8A4</h1><p className="page-subtitle">Tổng hợp bài làm, ghi nhận tiến bộ và các điểm cần luyện tập.</p></div><button className="primary-btn" onClick={() => go('analysis')}><Plus size={17}/> Thêm bài làm</button></div>
            <div className="wall-toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm học sinh, môn học, lỗi sai..." /></div><span className="wall-count">{filteredSamples.length} bài làm</span></div>
            <div className="wall-grid">{filteredSamples.map((s,i) => <article className="work-card" key={s.id}><div className="work-card-top"><div className={`work-icon ${s.color}`}><FileText size={21}/></div><span className={`status-badge ${s.color}`}>{s.status}</span></div><div className="work-meta">BÀI LÀM #{String(i+1).padStart(2,'0')}</div><h3>{s.name}</h3><p>{s.subject}</p><div className="work-issue"><AlertCircle size={16}/><span>{s.issue}</span></div><div className="work-card-bottom"><span>Điểm đánh giá</span><strong>{s.score.toLocaleString('vi-VN')}<small>/10</small></strong></div><button className="card-link" onClick={() => {setQuestion(s.subject);setAnswer(s.issue);setAnalyzed(false);go('analysis');}}>Xem phân tích <ArrowRight size={15}/></button></article>)}
              {filteredSamples.length === 0 && <div className="no-results"><Search size={28}/><strong>Không tìm thấy bài làm phù hợp</strong><span>Thử từ khóa khác nhé.</span></div>}</div>
            <div className="notice-inline"><Lightbulb size={18}/><span>Dữ liệu học sinh trên trang là dữ liệu minh họa. Không dùng để đánh giá học lực thực tế.</span></div>
          </section>}

          {view === 'reports' && <section className="workspace-page"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> PROJECT REPORT</div><h1>Báo cáo kết quả dự án</h1><p className="page-subtitle">Thông tin giới thiệu sản phẩm và các hạng mục cần hoàn thiện trước khi nộp.</p></div><button className="secondary-btn" onClick={() => window.print()}><FileText size={16}/> In / lưu PDF</button></div>
            <div className="report-title-card"><div className="report-emblem"><BrainCircuit size={34}/></div><div><span className="report-overline">BÁO CÁO KẾT QUẢ THỰC HIỆN DỰ ÁN DỰ THI</span><h2>TƯỜNG HỌC TẬP AI – TRUY GỐC LỖI</h2><p>Learning Wall AI – Error Root Tracer</p><span className="report-field">LĨNH VỰC 07: MÁY TÍNH · HỆ THỐNG PHẦN MỀM</span></div></div>
            <div className="panel report-table-panel"><div className="panel-heading"><div><h3>Thông tin dự án</h3><p>Cập nhật các trường còn thiếu trước khi nộp hồ sơ</p></div><span className="draft-label">BẢN DỰ THẢO</span></div><div className="report-table"><div className="report-row report-head"><strong>THÔNG TIN</strong><strong>NỘI DUNG</strong></div><div className="report-row"><span>Tác giả / nhóm tác giả</span><strong> [Bổ sung họ tên học sinh dự thi]</strong></div><div className="report-row"><span>Lớp / trường</span><strong>8A4 – Trường TH&THCS Na Rì 1</strong></div><div className="report-row"><span>Người hướng dẫn</span><strong>[Bổ sung người hướng dẫn đã được phê duyệt]</strong></div><div className="report-row"><span>Đơn vị dự thi</span><strong>Xã Na Rì, tỉnh Thái Nguyên</strong></div><div className="report-row"><span>Sản phẩm</span><strong><a href="https://thibithocsovn.github.io/tuongai/" target="_blank" rel="noreferrer">thibithocsovn.github.io/tuongai/</a></strong></div><div className="report-row"><span>Giai đoạn thực hiện</span><strong>[Bổ sung ngày bắt đầu và kết thúc]</strong></div></div></div>
            <div className="report-note"><AlertCircle size={20}/><div><strong>Các mục cần xác minh</strong><p>Tên tác giả, người hướng dẫn, mốc thời gian và số liệu thử nghiệm phải được xác nhận bằng dữ liệu thực tế. Không trình bày số liệu minh họa trên giao diện như kết quả thử nghiệm đã được chứng minh.</p></div></div>
            <div className="report-actions"><button className="secondary-btn" onClick={() => go('overview')}>Về tổng quan</button><button className="primary-btn" onClick={() => go('analysis')}>Mở bản demo AI <ArrowRight size={16}/></button></div>
          </section>}
          <footer className="footer"><span>© 2026 Tường học tập AI – Truy gốc lỗi</span><span><span className="footer-dot"/> Bản demo phục vụ trải nghiệm dự án</span></footer>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, note, tone, trend }: { icon: React.ReactNode; label: string; value: string; note: string; tone: string; trend: string }) {
  return <div className="stat-card"><div className="stat-top"><span className={`stat-icon ${tone}`}>{icon}</span><span className="stat-trend"><ArrowUpRight size={14}/>{trend}</span></div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><div className="stat-bottom"><span>{note}</span><span className="stat-spark"><ArrowUpRight size={15}/></span></div></div>;
}
