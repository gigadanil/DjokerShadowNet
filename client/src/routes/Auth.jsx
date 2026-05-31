import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Mail, RefreshCw, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { clearToken, setToken } from '../utils/auth';

function Auth() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);

  useEffect(() => {
    clearToken();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((value) => value - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (step === 'code') {
      inputsRef.current[0]?.focus();
    }
  }, [step]);

  const codeString = useMemo(() => code.join(''), [code]);

  const sendCode = async () => {
    setError('');
    setStatus('');
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return setError('Введите корректный Email');
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка отправки кода');
      }
      setStep('code');
      setStatus('Код отправлен. Проверьте почту.');
      setTimer(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeString })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Неверный код');
      }
      setToken(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    sendCode();
  };

  const handleCodeChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const nextCode = [...code];
    nextCode[index] = value;
    setCode(nextCode);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').trim().slice(0, 6);
    if (!/^[0-9]+$/.test(pasted)) return;
    const nextCode = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
    setCode(nextCode);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center px-6 py-12 sm:px-8">
        <div className="glass-card w-full rounded-[2rem] border border-white/10 bg-[#07070f]/90 p-8 shadow-panel backdrop-blur-2xl sm:p-12">
          <div className="mb-8 flex items-center justify-between gap-4 flex-col sm:flex-row">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-300/70">Djoker: Shadow Net</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Вход по Email и одноразовому коду</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">Введите почту, получите код и быстро войдите в личный кабинет без пароля.</p>
            </div>
            <div className="rounded-3xl border border-violet-500/20 bg-[#11111b]/85 px-5 py-4 text-sm text-slate-300 shadow-glow">Безопасный доступ за 5 минут</div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[0.95fr_0.9fr]">
            <div className="rounded-[1.75rem] border border-white/10 bg-[#0c0c16]/95 p-8">
              {step === 'email' ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">Шаг 1</p>
                    <h2 className="mt-3 text-3xl font-semibold text-white">Введите вашу почту</h2>
                  </div>
                  <label className="block text-sm font-medium text-slate-300">
                    Email
                    <div className="mt-3 flex items-center gap-3 rounded-3xl border border-violet-500/20 bg-[#11111b]/90 px-4 py-3 transition focus-within:border-violet-400/70">
                      <Mail className="h-5 w-5 text-violet-300/80" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                      />
                    </div>
                  </label>
                  <button
                    onClick={sendCode}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-glow px-6 py-3 text-sm font-semibold uppercase text-surface transition hover:bg-violet-400/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Отправка...' : 'Получить код'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">Шаг 2</p>
                    <h2 className="mt-3 text-3xl font-semibold text-white">Введите 6-значный код</h2>
                    <p className="mt-2 text-sm text-slate-400">Мы отправили код на <span className="font-semibold text-white">{email}</span></p>
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => (inputsRef.current[index] = element)}
                        value={digit}
                        onChange={(e) => handleCodeChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        maxLength={1}
                        className="h-16 w-full rounded-3xl border border-white/10 bg-[#11111b]/90 text-center text-2xl font-semibold text-white outline-none transition focus:border-violet-400 focus:bg-[#161627]"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                      />
                    ))}
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      onClick={handleVerify}
                      disabled={loading || codeString.length < 6}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-glow px-6 py-3 text-sm font-semibold uppercase text-surface transition hover:bg-violet-400/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? 'Проверка...' : 'Войти'}
                      <Send className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleResend}
                      disabled={timer > 0 || loading}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-500/30 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-violet-400 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RefreshCw className="h-4 w-4" />
                      {timer > 0 ? `Повторно через ${timer}s` : 'Отправить код повторно'}
                    </button>
                  </div>
                </div>
              )}
              {status && <p className="mt-6 rounded-3xl border border-emerald-500/15 bg-emerald-500/10 p-4 text-sm text-emerald-200">{status}</p>}
              {error && <p className="mt-6 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</p>}
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-[#09090f]/95 p-8 text-slate-300 shadow-inner">
              <p className="text-sm uppercase tracking-[0.28em] text-violet-300/80">Почему это безопасно?</p>
              <ul className="mt-6 space-y-4 text-sm leading-7">
                <li>• Без паролей — меньше рисков взлома.</li>
                <li>• Одноразовый код действует 5 минут.</li>
                <li>• Только ваш Email получает доступ.</li>
              </ul>
              <p className="mt-6 text-sm text-slate-500">Если хотите вернуться на главную, нажмите кнопку ниже.</p>
              <Link to="/" className="mt-6 inline-flex rounded-full border border-violet-500/30 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-violet-400 hover:bg-white/10">
                Вернуться на главную
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
