import React, { useState } from 'react';

const RegisterModal = ({ isOpen, onClose, onRegisterStudent, onRegisterTeacher, classes }) => {
  const [role, setRole] = useState('murid');
  const [step, setStep] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [studentForm, setStudentForm] = useState({
    full_name: '', nisn: '', class_id: classes?.[0]?.id || 'CLS-01',
    gender: 'L', parent_phone: '', address: '', password: '',
  });
  const [teacherForm, setTeacherForm] = useState({
    full_name: '', nip: '', subject: '', phone: '', password: '',
  });
  const [errors, setErrors] = useState({});

  const resetAll = () => {
    setRole('murid'); setStep(1); setSuccessMsg('');
    setErrors({}); setShowPassword(false);
    setStudentForm({ full_name: '', nisn: '', class_id: classes?.[0]?.id || 'CLS-01', gender: 'L', parent_phone: '', address: '', password: '' });
    setTeacherForm({ full_name: '', nip: '', subject: '', phone: '', password: '' });
  };

  const handleClose = () => { resetAll(); onClose(); };

  const validateStudent = () => {
    const e = {};
    if (!studentForm.full_name.trim()) e.full_name = 'Nama lengkap wajib diisi.';
    if (!studentForm.nisn.trim()) e.nisn = 'NISN wajib diisi.';
    if (!studentForm.password.trim()) e.password = 'Password wajib diisi.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateTeacher = () => {
    const e = {};
    if (!teacherForm.full_name.trim()) e.full_name = 'Nama lengkap wajib diisi.';
    if (!teacherForm.nip.trim()) e.nip = 'NIP wajib diisi.';
    if (!teacherForm.subject.trim()) e.subject = 'Mata pelajaran wajib diisi.';
    if (!teacherForm.password.trim()) e.password = 'Password wajib diisi.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'murid') {
      if (!validateStudent()) return;
      onRegisterStudent({ id: 'STD-' + Math.floor(100 + Math.random() * 9000), ...studentForm, username: studentForm.nisn.trim() });
      setSuccessMsg(`Akun murid atas nama "${studentForm.full_name}" berhasil didaftarkan! Silakan login menggunakan NISN dan password yang telah dibuat.`);
    } else {
      if (!validateTeacher()) return;
      onRegisterTeacher({ id: 'TCH-' + Math.floor(100 + Math.random() * 9000), ...teacherForm, username: teacherForm.nip.trim() });
      setSuccessMsg(`Akun guru atas nama "${teacherForm.full_name}" berhasil didaftarkan! Silakan login menggunakan NIP dan password yang telah dibuat.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div
        className="relative bg-white rounded-3xl w-full max-w-[480px] shadow-2xl z-10 border border-slate-100 overflow-hidden"
        style={{ animation: 'regZoomIn 0.2s ease' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5d87ff] to-[#49beff] px-6 pt-6 pb-8 relative">
          <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition" title="Tutup">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Daftar Akun Baru</h2>
              <p className="text-white/75 text-xs mt-0.5">SMK Mawaddah Palengaan</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-6" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {successMsg ? (
            <div className="pt-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Pendaftaran Berhasil!</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-5">{successMsg}</p>
              <button onClick={handleClose} className="w-full py-3 rounded-xl bg-[#5d87ff] hover:bg-[#4570ea] text-white font-bold text-xs transition shadow-md shadow-blue-500/25">
                Kembali ke Halaman Login
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Pilih Peran */}
              {step === 1 && (
                <div className="pt-5">
                  <p className="text-sm font-bold text-slate-700 mb-4 text-center">Daftar sebagai:</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button onClick={() => setRole('murid')} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition ${role === 'murid' ? 'border-[#5d87ff] bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role === 'murid' ? 'bg-[#5d87ff]' : 'bg-slate-200'}`}>
                        <svg className={`w-6 h-6 ${role === 'murid' ? 'text-white' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <span className={`text-xs font-bold ${role === 'murid' ? 'text-[#5d87ff]' : 'text-slate-600'}`}>Murid / Siswa</span>
                      {role === 'murid' && <span className="text-[10px] text-[#5d87ff] bg-blue-100 px-2 py-0.5 rounded-full font-semibold">Dipilih ✓</span>}
                    </button>
                    <button onClick={() => setRole('guru')} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition ${role === 'guru' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role === 'guru' ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                        <svg className={`w-6 h-6 ${role === 'guru' ? 'text-white' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className={`text-xs font-bold ${role === 'guru' ? 'text-emerald-600' : 'text-slate-600'}`}>Guru Pengajar</span>
                      {role === 'guru' && <span className="text-[10px] text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">Dipilih ✓</span>}
                    </button>
                  </div>
                  <button onClick={() => setStep(2)} className={`w-full py-3 rounded-xl font-bold text-xs text-white transition shadow-md flex items-center justify-center gap-2 ${role === 'guru' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25' : 'bg-[#5d87ff] hover:bg-[#4570ea] shadow-blue-500/25'}`}>
                    <span>Lanjutkan Pendaftaran {role === 'murid' ? 'Murid' : 'Guru'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Step 2: Form */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="pt-4 space-y-3.5 text-xs text-left">
                  <button type="button" onClick={() => { setStep(1); setErrors({}); }} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-[11px] font-semibold transition mb-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Kembali Pilih Peran
                  </button>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${role === 'guru' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-[#5d87ff]'}`}>
                    <span>{role === 'guru' ? '👨‍🏫 Formulir Pendaftaran Guru' : '🎓 Formulir Pendaftaran Murid'}</span>
                  </div>

                  {/* MURID FIELDS */}
                  {role === 'murid' && (<>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Nama Lengkap <span className="text-rose-500">*</span></label>
                      <input type="text" placeholder="Masukkan nama lengkap murid" value={studentForm.full_name}
                        onChange={(e) => { setStudentForm({ ...studentForm, full_name: e.target.value }); setErrors({ ...errors, full_name: '' }); }}
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:bg-white outline-none transition ${errors.full_name ? 'border-rose-400' : 'border-slate-200 focus:border-[#5d87ff]'}`} />
                      {errors.full_name && <p className="text-rose-500 text-[10px] mt-1">{errors.full_name}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">NISN <span className="text-rose-500">*</span></label>
                      <input type="text" placeholder="Contoh: 0061234567" value={studentForm.nisn}
                        onChange={(e) => { setStudentForm({ ...studentForm, nisn: e.target.value }); setErrors({ ...errors, nisn: '' }); }}
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-mono text-slate-800 focus:bg-white outline-none transition ${errors.nisn ? 'border-rose-400' : 'border-slate-200 focus:border-[#5d87ff]'}`} />
                      {errors.nisn && <p className="text-rose-500 text-[10px] mt-1">{errors.nisn}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Kelas</label>
                        <select value={studentForm.class_id} onChange={(e) => setStudentForm({ ...studentForm, class_id: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:border-[#5d87ff] outline-none">
                          {classes?.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Jenis Kelamin</label>
                        <select value={studentForm.gender} onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:border-[#5d87ff] outline-none">
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">No. Telepon / WA Orang Tua</label>
                      <input type="text" placeholder="08..." value={studentForm.parent_phone}
                        onChange={(e) => setStudentForm({ ...studentForm, parent_phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:border-[#5d87ff] outline-none" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Alamat</label>
                      <textarea rows="2" placeholder="Alamat lengkap murid" value={studentForm.address}
                        onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-[#5d87ff] outline-none resize-none" />
                    </div>
                  </>)}

                  {/* GURU FIELDS */}
                  {role === 'guru' && (<>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Nama Lengkap <span className="text-rose-500">*</span></label>
                      <input type="text" placeholder="Masukkan nama lengkap guru" value={teacherForm.full_name}
                        onChange={(e) => { setTeacherForm({ ...teacherForm, full_name: e.target.value }); setErrors({ ...errors, full_name: '' }); }}
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:bg-white outline-none transition ${errors.full_name ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500'}`} />
                      {errors.full_name && <p className="text-rose-500 text-[10px] mt-1">{errors.full_name}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">NIP <span className="text-rose-500">*</span></label>
                      <input type="text" placeholder="Nomor Induk Pegawai" value={teacherForm.nip}
                        onChange={(e) => { setTeacherForm({ ...teacherForm, nip: e.target.value }); setErrors({ ...errors, nip: '' }); }}
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-mono text-slate-800 focus:bg-white outline-none transition ${errors.nip ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500'}`} />
                      {errors.nip && <p className="text-rose-500 text-[10px] mt-1">{errors.nip}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Mata Pelajaran <span className="text-rose-500">*</span></label>
                      <input type="text" placeholder="Contoh: Pemrograman Web" value={teacherForm.subject}
                        onChange={(e) => { setTeacherForm({ ...teacherForm, subject: e.target.value }); setErrors({ ...errors, subject: '' }); }}
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:bg-white outline-none transition ${errors.subject ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500'}`} />
                      {errors.subject && <p className="text-rose-500 text-[10px] mt-1">{errors.subject}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">No. Telepon</label>
                      <input type="text" placeholder="08..." value={teacherForm.phone}
                        onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:border-emerald-500 outline-none" />
                    </div>
                  </>)}

                  {/* Password */}
                  <div className="pt-1 border-t border-slate-100">
                    <label className="block font-semibold text-slate-600 mb-1">Buat Password <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Buat kata sandi untuk login"
                        value={role === 'murid' ? studentForm.password : teacherForm.password}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (role === 'murid') setStudentForm({ ...studentForm, password: val });
                          else setTeacherForm({ ...teacherForm, password: val });
                          setErrors({ ...errors, password: '' });
                        }}
                        className={`w-full pr-10 px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:bg-white outline-none transition ${errors.password ? 'border-rose-400' : role === 'guru' ? 'border-slate-200 focus:border-emerald-500' : 'border-slate-200 focus:border-[#5d87ff]'}`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition">
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="text-rose-500 text-[10px] mt-1">{errors.password}</p>}
                    <p className="text-[10px] text-slate-400 mt-1">{role === 'murid' ? 'Login menggunakan NISN & password ini.' : 'Login menggunakan NIP & password ini.'}</p>
                  </div>

                  <button type="submit" className={`w-full py-3 rounded-xl font-bold text-xs text-white transition shadow-md flex items-center justify-center gap-2 ${role === 'guru' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25' : 'bg-[#5d87ff] hover:bg-[#4570ea] shadow-blue-500/25'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Daftarkan {role === 'murid' ? 'Murid' : 'Guru'} Sekarang</span>
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes regZoomIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  );
};

export default RegisterModal;
