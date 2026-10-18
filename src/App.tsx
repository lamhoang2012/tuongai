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
  const [analyzed, setAnalyzed] = useState(false);
  const [samples, setSamples] = useState(initialSamples);
  const [notice, setNotice] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const filteredSamples = useMemo(() => samples.filter(s => (s.name + s.subject + s.issue).toLowerCase().includes(search.toLowerCase())), [samples, search]);

  const go = (next: View) => { setView(next); setMobileMenu(false); setNotice(''); };
  const analyze = () => {
    if (!question.trim() && !uploadedName) {
      setNotice('Hãy nhập bài làm hoặc tải ảnh bài tập lên trước nhé.');
      return;
    }
    setAnalyzed(true);
    setNotice('Đã tạo bản phân tích minh họa. Giáo viên cần xác nhận trước khi sử dụng kết quả.');
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
            <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> AI ROOT-CAUSE TRACER</div><h1>Truy gốc lỗi bài làm</h1><p className="page-subtitle">Nhập bài làm hoặc tải ảnh lên để xem quy trình phân tích minh họa.</p></div><div className="demo-badge"><ShieldCheck size={15}/> Chế độ trải nghiệm</div></div>
            <div className="analysis-layout"><div className="panel input-panel"><div className="panel-heading"><div><h3><FileText size={18}/> Bài làm cần phân tích</h3><p>Thông tin được dùng trong phiên demo này</p></div><span className="step-number">01</span></div>
              <label className="field-label">Môn học</label><select className="select-field" defaultValue="math"><option value="math">Toán học</option><option value="literature">Ngữ văn</option><option value="english">Tiếng Anh</option><option value="science">Khoa học tự nhiên</option></select>
              <label className="field-label">Đề bài / yêu cầu</label><textarea className="text-field" rows={3} value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ví dụ: Giải phương trình 2x + 5 = 13..." />
              <label className="field-label">Bài làm của học sinh</label><textarea className="text-field answer-field" rows={5} value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Nhập các bước làm bài vào đây..." />
              <input ref={fileRef} type="file" accept="image/*" className="hidden-input" onChange={e => { const f=e.target.files?.[0]; if(f) setUploadedName(f.name); }} />
              <button className={`upload-zone ${uploadedName ? 'upload-done' : ''}`} onClick={() => fileRef.current?.click()}><span className="upload-icon">{uploadedName ? <CheckCircle2 size={22}/> : <CloudUpload size={23}/>}</span><span><strong>{uploadedName || 'Tải ảnh bài làm lên'}</strong><small>{uploadedName ? 'Đã chọn tệp trên thiết bị · demo chưa gửi lên máy chủ' : 'PNG, JPG hoặc ảnh chụp vở · chọn tệp từ thiết bị'}</small></span><Upload size={18}/></button>
              <div className="privacy-note"><ShieldCheck size={15}/> Không tải dữ liệu lên máy chủ trong bản demo giao diện này.</div>
              <button className="primary-btn full-btn" onClick={analyze}><Sparkles size={17}/> Phân tích bài làm <ArrowRight size={16}/></button>
            </div>
            <div className="panel results-panel"><div className="panel-heading"><div><h3><BrainCircuit size={19}/> Kết quả truy gốc lỗi</h3><p>Quy trình phân tích minh họa</p></div><span className="step-number">02</span></div>
              {!analyzed ? <div className="empty-result"><div className="empty-illustration"><BrainCircuit size={44}/><Sparkles size={19} className="empty-spark"/></div><h3>Phân tích sẽ xuất hiện tại đây</h3><p>Nhập đề bài và bài làm, sau đó chọn “Phân tích bài làm” để xem bản minh họa.</p><div className="process-list"><div><span>1</span> Xác định bước làm cần xem xét</div><div><span>2</span> Tìm nguyên nhân có thể gây lỗi</div><div><span>3</span> Đề xuất hướng luyện tập</div></div></div> :
                <div className="result-content"><div className="result-summary"><span className="result-icon"><AlertCircle size={22}/></span><div><span className="result-kicker">NHẬN ĐỊNH MINH HỌA</span><h3>Cần kiểm tra lại một bước biến đổi</h3><p>Đây là kết quả mẫu, không phải kết luận AI thực tế.</p></div></div><div className="root-cause"><div className="cause-label"><span>01</span> NGUYÊN NHÂN CÓ THỂ</div><strong>Chưa áp dụng nhất quán quy tắc biến đổi</strong><p>Đối chiếu từng dòng với đề bài và yêu cầu học sinh giải thích lý do của mỗi phép biến đổi.</p></div><div className="root-cause solution"><div className="cause-label"><span>02</span> HƯỚNG KHẮC PHỤC</div><strong>Luyện từng bước, kiểm tra bằng phép thay</strong><p>Viết lại phép biến đổi, kiểm tra dấu và thay kết quả vào đề để xác minh.</p></div><div className="teacher-review"><ShieldCheck size={18}/><span><strong>Giáo viên xác nhận</strong><small>Luôn kiểm tra kết quả trước khi chấm điểm hoặc phản hồi cho học sinh.</small></span></div><button className="secondary-btn full-btn" onClick={() => { setAnalyzed(false); setNotice('Bạn có thể chỉnh sửa bài làm và phân tích lại.'); }}>Làm mới phân tích</button></div>}
            </div></div>
            <div className="disclaimer"><CircleHelp size={17}/><p><strong>Lưu ý:</strong> Chức năng phân tích trong phiên bản này là bản demo giao diện. Để AI thực sự đọc ảnh và truy nguyên nhân, cần kết nối dịch vụ AI ở phía máy chủ, bảo vệ API key và kiểm thử độ chính xác.</p></div>
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
