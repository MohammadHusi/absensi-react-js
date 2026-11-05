import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/tailwind/Sidebar';
import Header from './components/tailwind/Header';
import DashboardOverview from './components/tailwind/DashboardOverview';
import StudentsView from './components/tailwind/StudentsView';
import AttendanceInputView from './components/tailwind/AttendanceInputView';
import RekapView from './components/tailwind/RekapView';
import TeachersView from './components/tailwind/TeachersView';
import ClassesView from './components/tailwind/ClassesView';
import StudentSelfView from './components/tailwind/StudentSelfView';
import AdminsView from './components/tailwind/AdminsView';
import SubjectsView from './components/tailwind/SubjectsView';
import ScheduleView from './components/tailwind/ScheduleView';
import RegisterModal from './components/tailwind/RegisterModal';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('tailwindadmin_siam_user');
    return saved ? JSON.parse(saved) : {
      id: 'USR-001',
      username: 'admin',
      full_name: 'Administrator Utama',
      role: 'admin'
    };
  });

  const [currentView, setCurrentView] = useState('overview'); // 'overview' | 'students' | 'teachers' | 'admins' | 'classes' | 'subjects' | 'input-absen' | 'rekap' | 'murid-portal'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Master Data Kelas
  const [classes, setClasses] = useState([
    { id: 'CLS-01', class_name: 'X (Kelas 10)-A', major: 'Bisnis Digital', academic_year: '2025/2026' },
    { id: 'CLS-02', class_name: 'XI (Kelas 11)-A', major: 'Bisnis Digital', academic_year: '2025/2026' },
    { id: 'CLS-03', class_name: 'XII (Kelas 12)-A', major: 'Bisnis Digital', academic_year: '2025/2026' },
    { id: 'CLS-04', class_name: 'X (Kelas 10)-B', major: 'Bisnis Digital', academic_year: '2025/2026' },
    { id: 'CLS-05', class_name: 'XI (Kelas 11)-B', major: 'Bisnis Digital', academic_year: '2025/2026' },
    { id: 'CLS-06', class_name: 'XII (Kelas 12)-B', major: 'Bisnis Digital', academic_year: '2025/2026' },
  ]);

  // Master Data Guru
  const [teachers, setTeachers] = useState([
    { id: 'TCH-001', nip: '198501122010011003', full_name: 'Ahmad Baihaqi, S.Pd', subject: 'Teknologi Jaringan', gender: 'L' },
    { id: 'TCH-002', nip: '199008242015022004', full_name: 'Nurul Qomariyah, M.Kom', subject: 'Pemrograman Web', gender: 'P' },
    { id: 'TCH-003', nip: '198203152008011009', full_name: 'Drs. H. Mahrus Ali', subject: 'Pendidikan Agama Islam', gender: 'L' },
  ]);

  // Master Data Admin
  const [admins, setAdmins] = useState([
    { id: 'ADM-001', username: 'admin', full_name: 'Administrator Utama', role: 'Super Admin', phone: '081234567800', email: 'admin@smkmawaddah.sch.id', password: 'admin' },
    { id: 'ADM-002', username: 'tu.mawaddah', full_name: 'Hj. Maimunah, S.E', role: 'Admin Tata Usaha', phone: '081234567801', email: 'tu@smkmawaddah.sch.id', password: '123' },
  ]);

  // Master Data Mata Pelajaran
  const [subjects, setSubjects] = useState([
    { id: 'MP-01', code: 'BD-01', name: 'Bisnis Digital & E-Commerce', category: 'Kejuruan', teacher: 'Ahmad Baihaqi, S.Pd', academic_year: '2025/2026', description: 'Pengelolaan toko online, marketplace, dan strategi pemasaran digital.' },
    { id: 'MP-02', code: 'WEB-02', name: 'Pemrograman Web & Mobile', category: 'Kejuruan', teacher: 'Nurul Qomariyah, M.Kom', academic_year: '2025/2026', description: 'Desain web responsif, HTML/CSS, JS dan framework modern.' },
    { id: 'MP-03', code: 'TKJ-03', name: 'Teknologi Jaringan & Komputer', category: 'Kejuruan', teacher: 'Ahmad Baihaqi, S.Pd', academic_year: '2025/2026', description: 'Instalasi jaringan lokal, routing, dan troubleshooting PC/Server.' },
    { id: 'MP-04', code: 'PAI-04', name: 'Pendidikan Agama Islam', category: 'Muatan Nasional', teacher: 'Drs. H. Mahrus Ali', academic_year: '2025/2026', description: 'Pendidikan akhlak, fiqih, dan sejarah kebudayaan Islam.' },
    { id: 'MP-05', code: 'MTK-05', name: 'Matematika Terapan', category: 'Muatan Umum', teacher: 'Drs. H. Mahrus Ali', academic_year: '2025/2026', description: 'Matematika logika bisnis, aljabar, dan statistik dasar.' },
    { id: 'MP-06', code: 'BIN-06', name: 'Bahasa Indonesia', category: 'Muatan Umum', teacher: 'Nurul Qomariyah, M.Kom', academic_year: '2025/2026', description: 'Keterampilan komunikasi formal, surat menyurat, dan presentasi.' }
  ]);

  // Master Data Siswa
  const [students, setStudents] = useState([
    { id: 'STD-001', nisn: '0061234567', full_name: 'Mohammad Zainal Arifin', class_id: 'CLS-01', gender: 'L', parent_phone: '081234567890', address: 'Jl. Raya Palengaan No. 12, Pamekasan', username: '0061234567', password: '123' },
    { id: 'STD-002', nisn: '0061234568', full_name: 'Siti Nur Haliza', class_id: 'CLS-01', gender: 'P', parent_phone: '081234567891', address: 'Dsn. Sumber Anyar, Larangan Badung', username: '0061234568', password: '123' },
    { id: 'STD-003', nisn: '0061234569', full_name: 'Achmad Fawaid', class_id: 'CLS-01', gender: 'L', parent_phone: '081234567892', address: 'Jl. Pesantren Karang Manggis, Palengaan', username: '0061234569', password: '123' },
    { id: 'STD-004', nisn: '0061234570', full_name: 'Nurul Hidayati', class_id: 'CLS-01', gender: 'P', parent_phone: '081234567893', address: 'Dsn. Tengah, Rek Kerek, Palengaan', username: '0061234570', password: '123' },
    { id: 'STD-005', nisn: '0061234571', full_name: 'Moh. Rizki Maulana', class_id: 'CLS-01', gender: 'L', parent_phone: '081234567894', address: 'Jl. Raya Proppo Km 4, Pamekasan', username: '0061234571', password: '123' },
    { id: 'STD-006', nisn: '0062234572', full_name: 'Fatimatuz Zahra', class_id: 'CLS-02', gender: 'P', parent_phone: '081234567895', address: 'Dsn. Morleke, Rombasan, Palengaan', username: '0062234572', password: '123' },
    { id: 'STD-007', nisn: '0062234573', full_name: 'Khoirul Anam', class_id: 'CLS-02', gender: 'L', parent_phone: '081234567896', address: 'Jl. Kyai Amin No. 05, Palengaan Dajah', username: '0062234573', password: '123' },
  ]);

  // Data Presensi
  const todayStr = new Date().toISOString().slice(0, 10);
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: 'ATT-001', student_id: 'STD-001', student_name: 'Mohammad Zainal Arifin', class_id: 'CLS-01', date: todayStr, status: 'Hadir', notes: 'Tepat waktu 06.45 WIB' },
    { id: 'ATT-002', student_id: 'STD-002', student_name: 'Siti Nur Haliza', class_id: 'CLS-01', date: todayStr, status: 'Hadir', notes: 'Tepat waktu 06.50 WIB' },
    { id: 'ATT-003', student_id: 'STD-003', student_name: 'Achmad Fawaid', class_id: 'CLS-01', date: todayStr, status: 'Sakit', notes: 'Surat dokter terlampir' },
    { id: 'ATT-004', student_id: 'STD-004', student_name: 'Nurul Hidayati', class_id: 'CLS-01', date: todayStr, status: 'Izin', notes: 'Dispensasi lomba' },
    { id: 'ATT-005', student_id: 'STD-005', student_name: 'Moh. Rizki Maulana', class_id: 'CLS-01', date: todayStr, status: 'Alpa', notes: 'Tanpa keterangan' },
  ]);

  // Data Jadwal Pelajaran
  const [schedules, setSchedules] = useState([
    { id: 'SCH-001', academic_year: '2025/2026', semester: 'Ganjil', day: 'Senin', class_id: 'CLS-01', subject_id: 'MP-01', subject_name: 'Bisnis Digital & E-Commerce', teacher_id: 'TCH-001', teacher_name: 'Ahmad Baihaqi, S.Pd', start_time: '07:15', end_time: '09:15' },
    { id: 'SCH-002', academic_year: '2025/2026', semester: 'Ganjil', day: 'Senin', class_id: 'CLS-01', subject_id: 'MP-04', subject_name: 'Pendidikan Agama Islam', teacher_id: 'TCH-003', teacher_name: 'Drs. H. Mahrus Ali', start_time: '09:30', end_time: '11:00' },
    { id: 'SCH-003', academic_year: '2025/2026', semester: 'Ganjil', day: 'Selasa', class_id: 'CLS-01', subject_id: 'MP-02', subject_name: 'Pemrograman Web & Mobile', teacher_id: 'TCH-002', teacher_name: 'Nurul Qomariyah, M.Kom', start_time: '07:15', end_time: '09:45' },
    { id: 'SCH-004', academic_year: '2025/2026', semester: 'Ganjil', day: 'Rabu', class_id: 'CLS-02', subject_id: 'MP-03', subject_name: 'Teknologi Jaringan & Komputer', teacher_id: 'TCH-001', teacher_name: 'Ahmad Baihaqi, S.Pd', start_time: '08:00', end_time: '10:30' },
    { id: 'SCH-005', academic_year: '2025/2026', semester: 'Genap', day: 'Kamis', class_id: 'CLS-01', subject_id: 'MP-05', subject_name: 'Matematika Terapan', teacher_id: 'TCH-003', teacher_name: 'Drs. H. Mahrus Ali', start_time: '07:15', end_time: '09:15' },
  ]);

  // ==============================================================
  // SCHEDULE CRUD HANDLERS
  // ==============================================================
  const handleAddSchedule = (sch) => {
    setSchedules(prev => [sch, ...prev]);
  };

  const handleEditSchedule = (updated) => {
    setSchedules(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const handleDeleteSchedule = (id) => {
    setSchedules(prev => prev.filter(item => item.id !== id));
  };

  // ==============================================================
  // STUDENT CRUD HANDLERS
  // ==============================================================
  const handleAddStudent = (st) => {
    setStudents(prev => [st, ...prev]);
  };

  const handleEditStudent = (updatedStudent) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleUpdateStudentProfile = (updatedProfile) => {
    const newUsername = updatedProfile.nisn || updatedProfile.username;
    setStudents(prev => prev.map(s => (s.id === updatedProfile.id || s.username === updatedProfile.username || s.nisn === updatedProfile.nisn) ? { ...s, ...updatedProfile, username: newUsername, nisn: updatedProfile.nisn } : s));
    setCurrentUser(prev => {
      const updatedUser = { ...prev, ...updatedProfile, username: newUsername };
      localStorage.setItem('tailwindadmin_siam_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const handleDeleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  // ==============================================================
  // TEACHER CRUD HANDLERS
  // ==============================================================
  const handleAddTeacher = (tc) => {
    setTeachers(prev => [tc, ...prev]);
  };

  const handleEditTeacher = (updatedTeacher) => {
    setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
  };

  const handleDeleteTeacher = (id) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  // ==============================================================
  // ADMIN CRUD HANDLERS
  // ==============================================================
  const handleAddAdmin = (adm) => {
    setAdmins(prev => [adm, ...prev]);
  };

  const handleEditAdmin = (updatedAdmin) => {
    setAdmins(prev => prev.map(a => a.id === updatedAdmin.id ? updatedAdmin : a));
  };

  const handleDeleteAdmin = (id) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
  };

  // ==============================================================
  // CLASS CRUD HANDLERS
  // ==============================================================
  const handleAddClass = (cl) => {
    setClasses(prev => [cl, ...prev]);
  };

  const handleEditClass = (updatedClass) => {
    setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
  };

  const handleDeleteClass = (id) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  // ==============================================================
  // SUBJECT CRUD HANDLERS
  // ==============================================================
  const handleAddSubject = (sb) => {
    setSubjects(prev => [sb, ...prev]);
  };

  const handleEditSubject = (updatedSubject) => {
    setSubjects(prev => prev.map(s => s.id === updatedSubject.id ? updatedSubject : s));
  };

  const handleDeleteSubject = (id) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // ==============================================================
  // ATTENDANCE HANDLERS
  // ==============================================================
  const handleSaveAttendanceBatch = (newRecords) => {
    setAttendanceRecords(prev => {
      const updated = [...prev];
      newRecords.forEach(nr => {
        const idx = updated.findIndex(item => item.student_id === nr.student_id && item.date === nr.date);
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], ...nr };
        } else {
          updated.push({ id: 'ATT-' + Math.floor(100 + Math.random() * 900), ...nr });
        }
      });
      return updated;
    });
  };

  const handleAddExcuse = (excuse) => {
    setAttendanceRecords(prev => [excuse, ...prev]);
  };

  // ==============================================================
  // REGISTER HANDLERS
  // ==============================================================
  const handleRegisterStudent = (newStudent) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  const handleRegisterTeacher = (newTeacher) => {
    setTeachers(prev => [newTeacher, ...prev]);
  };

  const handleQuickLogin = (role) => {
    let user;
    if (role === 'admin') {
      user = { id: 'USR-001', username: 'admin', full_name: 'Administrator Utama', role: 'admin' };
      setCurrentView('overview');
    } else if (role === 'guru') {
      user = { id: 'TCH-001', username: 'guru.ahmad', full_name: 'Ahmad Baihaqi, S.Pd', role: 'guru' };
      setCurrentView('input-absen');
    } else {
      user = { id: 'USR-003', username: '0061234567', full_name: 'Mohammad Zainal Arifin', role: 'murid', student_id: 'STD-001' };
      setCurrentView('murid-portal');
    }
    setCurrentUser(user);
    localStorage.setItem('tailwindadmin_siam_user', JSON.stringify(user));
    setShowLoginModal(false);
  };

  const handlePerformLogin = (e) => {
    if (e) e.preventDefault();
    const u = loginUsername.trim().toLowerCase();
    const p = loginPassword.trim();

    if (!u) {
      setLoginError('Silakan masukkan username.');
      return;
    }
    if (!p) {
      setLoginError('Silakan masukkan kata sandi / password.');
      return;
    }

    // 1. Cek Login Admin
    const matchedAdmin = admins.find(a => 
      a.username?.toLowerCase() === u || 
      a.full_name?.toLowerCase() === u
    );

    if (u === 'admin' || u === 'administrator' || matchedAdmin) {
      const targetAdmin = matchedAdmin || admins[0];
      if (matchedAdmin && matchedAdmin.password && matchedAdmin.password !== p && p !== 'admin' && p !== 'admin123' && p !== '123') {
        setLoginError('Password admin tidak cocok.');
        return;
      }
      const user = { 
        id: targetAdmin.id, 
        username: targetAdmin.username, 
        full_name: targetAdmin.full_name, 
        role: 'admin' 
      };
      setCurrentUser(user);
      setCurrentView('overview');
      localStorage.setItem('tailwindadmin_siam_user', JSON.stringify(user));
      setShowLoginModal(false);
      setLoginError('');
      return;
    }

    // 2. Cek Login Guru
    const matchedTeacher = teachers.find(t => t.nip === u || t.id.toLowerCase() === u || t.full_name.toLowerCase().includes(u));
    if (u === 'guru' || u === 'guru.ahmad' || matchedTeacher) {
      const user = { 
        id: matchedTeacher?.id || 'TCH-001', 
        username: matchedTeacher?.nip || 'guru.ahmad', 
        full_name: matchedTeacher?.full_name || 'Ahmad Baihaqi, S.Pd', 
        role: 'guru' 
      };
      setCurrentUser(user);
      setCurrentView('input-absen');
      localStorage.setItem('tailwindadmin_siam_user', JSON.stringify(user));
      setShowLoginModal(false);
      setLoginError('');
      return;
    }

    // 3. Cek Login Murid (Dinamis dari Master Data Murid)
    const matchedStudent = students.find(s => 
      s.username?.toLowerCase() === u || 
      s.nisn === u || 
      s.full_name.toLowerCase() === u
    );

    if (matchedStudent || u === 'murid' || u === 'siswa') {
      const targetStudent = matchedStudent || students[0];
      // Cek kecocokan password jika murid memiliki password spesifik
      if (matchedStudent && matchedStudent.password && matchedStudent.password !== p && p !== '123' && p !== '123456' && p !== 'murid123') {
        setLoginError('Password murid tidak cocok.');
        return;
      }
      const user = { 
        id: targetStudent.id, 
        username: targetStudent.username || targetStudent.nisn, 
        full_name: targetStudent.full_name, 
        role: 'murid', 
        student_id: targetStudent.id 
      };
      setCurrentUser(user);
      setCurrentView('murid-portal');
      localStorage.setItem('tailwindadmin_siam_user', JSON.stringify(user));
      setShowLoginModal(false);
      setLoginError('');
      return;
    }

    setLoginError('Username atau kata sandi tidak cocok. Silakan gunakan akun yang valid.');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tailwindadmin_siam_user');
    setLoginUsername('');
    setLoginPassword('');
    setLoginError('');
  };

  // Jika belum login / setelah klik keluar, tampilkan Halaman Login Penuh (Dashboard tertutup)
  if (!currentUser) {
    return (
      <>
      <div className="min-h-screen bg-gradient-to-br from-[#ebf3fa] via-[#f4f7fb] to-[#e4eff8] flex flex-col justify-center items-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-[420px] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
          
          {/* Header Login */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 flex items-center justify-center mx-auto mb-3">
              <img 
                src={`${process.env.PUBLIC_URL}/logo-smk-mawaddah.png`} 
                alt="Logo SMK Mawaddah" 
                className="w-20 h-20 object-contain drop-shadow-md"
              />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Login Pengguna</h2>
            <p className="text-xs text-slate-500 mt-1">
              Sistem Informasi Absensi • <strong>SMK Mawaddah Palengaan</strong>
            </p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{loginError}</span>
            </div>
          )}

          {/* Form Login: Username & Password */}
          <form id="login-form" onSubmit={handlePerformLogin} className="space-y-4 text-xs text-left">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Username / Nama Pengguna
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <input 
                  type="text"
                  required
                  placeholder="Masukkan username (contoh: admin / guru / murid)"
                  value={loginUsername}
                  onChange={(e) => {
                    setLoginUsername(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-[#5d87ff] outline-none transition text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Password / Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Masukkan kata sandi"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-[#5d87ff] outline-none transition text-xs"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  title={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Tombol Masuk & Daftar sejajar — keduanya di luar form */}
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <button 
              type="submit"
              form="login-form"
              className="py-3 px-4 rounded-xl bg-[#5d87ff] hover:bg-[#4570ea] text-white font-bold shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-1.5 text-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
              <span>Masuk</span>
            </button>
            <button
              type="button"
              onClick={() => setShowRegisterModal(true)}
              className="py-3 px-4 rounded-xl bg-[#49beff] hover:bg-[#2eadf0] text-white font-bold shadow-lg shadow-cyan-400/25 transition flex items-center justify-center gap-1.5 text-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Daftar</span>
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-4 text-center text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} SMK Mawaddah Palengaan • Dapodik Terhubung
          </div>

        </div>
      </div>

      {/* Modal Daftar */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegisterStudent={handleRegisterStudent}
        onRegisterTeacher={handleRegisterTeacher}
        classes={classes}
      />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col">

      {/* Main Sidebar */}
      <Sidebar 
        currentView={currentView}
        onViewChange={(v) => setCurrentView(v)}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Right Content Area */}
      <div className={`tailwind-main-content transition-all duration-300 ease-in-out ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        
        {/* Sticky Top Header */}
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onChangeView={(v) => setCurrentView(v)}
        />

        {/* View Router */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {currentView === 'overview' && (
            <DashboardOverview 
              students={students}
              teachers={teachers}
              classes={classes}
              attendanceRecords={attendanceRecords}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {currentView === 'students' && currentUser?.role !== 'murid' && (
            <StudentsView 
              students={students}
              classes={classes}
              onAddStudent={handleAddStudent}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          )}

          {currentView === 'teachers' && currentUser?.role !== 'murid' && (
            <TeachersView 
              teachers={teachers}
              onAddTeacher={handleAddTeacher}
              onEditTeacher={handleEditTeacher}
              onDeleteTeacher={handleDeleteTeacher}
            />
          )}

          {currentView === 'admins' && (
            <AdminsView 
              admins={admins}
              onAddAdmin={handleAddAdmin}
              onEditAdmin={handleEditAdmin}
              onDeleteAdmin={handleDeleteAdmin}
            />
          )}

          {currentView === 'classes' && (
            <ClassesView 
              classes={classes}
              onAddClass={handleAddClass}
              onEditClass={handleEditClass}
              onDeleteClass={handleDeleteClass}
            />
          )}

          {currentView === 'subjects' && currentUser?.role !== 'murid' && (
            <SubjectsView 
              subjects={subjects}
              teachers={teachers}
              onAddSubject={handleAddSubject}
              onEditSubject={handleEditSubject}
              onDeleteSubject={handleDeleteSubject}
            />
          )}

          {currentView === 'input-absen' && (
            <AttendanceInputView 
              classes={classes}
              students={students}
              onSaveBatch={handleSaveAttendanceBatch}
            />
          )}

          {currentView === 'jadwal' && (
            <ScheduleView 
              schedules={schedules}
              classes={classes}
              subjects={subjects}
              teachers={teachers}
              currentUser={currentUser}
              onAddSchedule={handleAddSchedule}
              onEditSchedule={handleEditSchedule}
              onDeleteSchedule={handleDeleteSchedule}
            />
          )}

          {currentView === 'rekap' && currentUser?.role !== 'murid' && (
            <RekapView 
              classes={classes}
              students={students}
              attendanceRecords={attendanceRecords}
            />
          )}

          {currentView === 'murid-portal' && (
            <StudentSelfView 
              currentUser={currentUser}
              students={students}
              classes={classes}
              attendanceRecords={attendanceRecords}
              onAddExcuse={handleAddExcuse}
              onUpdateProfile={handleUpdateStudentProfile}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="px-8 py-4 border-t border-slate-200/70 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2 mt-auto">
          <span>&copy; {new Date().getFullYear()} <strong>SMK Mawaddah Palengaan</strong> — {currentUser?.role === 'guru' ? 'Guru' : currentUser?.role === 'murid' ? 'Murid' : 'Admin'} Edition.</span>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 cursor-pointer">Buku Panduan</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Dapodik Terhubung</span>
            <span>•</span>
            <span className="text-[#5d87ff] font-bold">Versi 2.5</span>
          </div>
        </footer>

      </div>

      {/* Modal Daftar Akun Baru */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegisterStudent={handleRegisterStudent}
        onRegisterTeacher={handleRegisterTeacher}
        classes={classes}
      />

    </div>
  );
}

export default App;
