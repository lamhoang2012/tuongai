import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, UserCheck, GraduationCap } from 'lucide-react';

interface AuthModalProps {
  onLoginSuccess: (role: 'teacher' | 'student', email?: string) => void;
  onOpenStudentEntry: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess, onOpenStudentEntry }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('thaytuan.toan9@edu.vn');
  const [password, setPassword] = useState('MatKhau123!@#');
  const [fullName, setFullName] = useState('Thầy Nguyễn Tuấn');
  const [schoolName, setSchoolName] = useState('THCS Nguyễn Du');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('teacher', email);
    }, 600);
  };

  const handleQuickDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('teacher', 'thaytuan.toan9@edu.vn');
    }, 300);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 relative backdrop-blur-sm">
      {/* Top Tabs */}
      <div className="bg-slate-100 p-1 rounded-xl flex items-center mb-5">
        <button
          type="button"
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all text-center cursor-pointer ${
            activeTab === 'login'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('register')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all text-center cursor-pointer ${
            activeTab === 'register'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Đăng ký
        </button>
      </div>

      {/* Role Notice matching screenshot */}
      <p className="text-center text-xs text-slate-500 mb-6 leading-relaxed">
        Dành cho giáo viên. Học sinh vào lớp bằng{' '}
        <span className="font-semibold text-slate-700 underline decoration-sky-300">
          đường link thầy cô gửi
        </span>
        , không cần tài khoản.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'register' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Họ và tên giáo viên
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Cô Trần Thanh Hà"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Trường học / Cơ sở đào tạo
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Ví dụ: THCS Chu Văn An"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email đã đăng ký"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu của bạn"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent pr-14 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              {showPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
        </div>

        {activeTab === 'login' && (
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-slate-600 font-medium">Ghi nhớ đăng nhập</span>
            </label>
            <button
              type="button"
              onClick={() => alert('Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!')}
              className="font-semibold text-sky-600 hover:text-sky-700 cursor-pointer hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>
        )}

        {/* Big CTA Button matching screenshot */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#1d63b8] via-[#107094] to-[#0e7490] hover:from-[#1957a3] hover:to-[#0c627a] shadow-md shadow-sky-900/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{activeTab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản giáo viên'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Toggle link below button */}
        <div className="text-center pt-2">
          {activeTab === 'login' ? (
            <p className="text-xs text-slate-500">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="font-semibold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
              >
                Đăng ký ngay
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="font-semibold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
              >
                Đăng nhập ngay
              </button>
            </p>
          )}
        </div>
      </form>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
          <span className="bg-white px-3 text-slate-400 font-semibold">Hoặc trải nghiệm ngay</span>
        </div>
      </div>

      {/* Quick Action Buttons for Users */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleQuickDemo}
          className="w-full py-2.5 px-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl text-xs font-semibold text-sky-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <UserCheck className="w-4 h-4 text-sky-600" />
          <span>Vào nhanh tài khoản Giáo viên (Thầy Tuấn)</span>
        </button>

        <button
          type="button"
          onClick={onOpenStudentEntry}
          className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-semibold text-amber-900 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <GraduationCap className="w-4 h-4 text-amber-600" />
          <span>Em là Học sinh? Vào nộp bài ngay (Không cần nick)</span>
        </button>
      </div>
    </div>
  );
};
