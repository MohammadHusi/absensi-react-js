import React, { useState } from 'react';
import SweetAlertModal from './SweetAlertModal';

const DAYS_OF_WEEK = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const ACADEMIC_YEARS = [
  '2025/2026',
  '2026/2027',
  '2027/2028',
  '2028/2029',
  '2029/2030',
  '2030/2031'
];

const ScheduleView = ({ 
  schedules = [], 
  classes = [], 
  subjects = [], 
  teachers = [],
  currentUser,
  onAddSchedule,
  onEditSchedule,
  onDeleteSchedule 
}) => {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('Semua');
  const [selectedSemester, setSelectedSemester] = useState('Semua');
  const [selectedDay, setSelectedDay] = useState('Semua');
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [search, setSearch] = useState('');
  const [formModalMode, setFormModalMode] = useState(null); // 'create' | 'edit' | null
  const [alertConfig, setAlertConfig] = useState(null);

  const [form, setForm] = useState({
    id: '',
    academic_year: '2025/2026',
    semester: 'Ganjil',
    day: 'Senin',
    class_id: '',
    subject_id: '',
    teacher_id: '',
    teacher_name: '',
    start_time: '07:00',
    end_time: '08:30'
  });

  // Filter Schedule
  const filteredSchedules = schedules.filter(item => {
    const matchYear = selectedAcademicYear === 'Semua' || (item.academic_year || '2025/2026') === selectedAcademicYear;
    const matchSemester = selectedSemester === 'Semua' || (item.semester || 'Ganjil') === selectedSemester;
    const matchDay = selectedDay === 'Semua' || item.day === selectedDay;
    const matchClass = selectedClass === 'Semua' || item.class_id === selectedClass;
    const className = classes.find(c => c.id === item.class_id)?.class_name || '';
    const subjectName = subjects.find(s => s.id === item.subject_id)?.name || item.subject_name || '';
    const teacherName = teachers.find(t => t.id === item.teacher_id)?.full_name || item.teacher_name || '';
    const matchSearch = 
      subjectName.toLowerCase().includes(search.toLowerCase()) ||
      teacherName.toLowerCase().includes(search.toLowerCase()) ||
      className.toLowerCase().includes(search.toLowerCase());
    return matchYear && matchSemester && matchDay && matchClass && matchSearch;
  });

  // Urutkan jadwal berdasarkan hari lalu jam mulai
  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    const dayOrder = { 'Ahad': 0, 'Minggu': 0, 'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6 };
    const dayDiff = (dayOrder[a.day] ?? 99) - (dayOrder[b.day] ?? 99);
    if (dayDiff !== 0) return dayDiff;
    return (a.start_time || '').localeCompare(b.start_time || '');
  });

  const openCreateForm = () => {
    const defaultClass = classes[0]?.id || '';
    const defaultSubject = subjects[0]?.id || '';
    
    // Cari guru pengajar otomatis dari mata pelajaran terpilih atau guru pertama
    const subjObj = subjects.find(s => s.id === defaultSubject);
    const matchedTeacher = teachers.find(t => t.full_name === subjObj?.teacher) || teachers[0];

    setForm({
      id: '',
      academic_year: selectedAcademicYear !== 'Semua' ? selectedAcademicYear : '2025/2026',
      semester: selectedSemester !== 'Semua' ? selectedSemester : 'Ganjil',
      day: selectedDay !== 'Semua' ? selectedDay : 'Senin',
      class_id: defaultClass,
      subject_id: defaultSubject,
      teacher_id: matchedTeacher?.id || '',
      teacher_name: matchedTeacher?.full_name || subjObj?.teacher || '',
      start_time: '07:00',
      end_time: '08:30'
    });
    setFormModalMode('create');
  };

  const openEditForm = (item) => {
    const matchedTeacher = teachers.find(t => t.id === item.teacher_id || t.full_name === item.teacher_name);

    setForm({
      id: item.id,
      academic_year: item.academic_year || '2025/2026',
      semester: item.semester || 'Ganjil',
      day: item.day,
      class_id: item.class_id,
      subject_id: item.subject_id,
      teacher_id: matchedTeacher?.id || item.teacher_id || '',
      teacher_name: matchedTeacher?.full_name || item.teacher_name || '',
      start_time: item.start_time,
      end_time: item.end_time
    });
    setFormModalMode('edit');
  };

  const handleSubjectChange = (subjId) => {
    const foundSubj = subjects.find(s => s.id === subjId);
    const matchedTeacher = teachers.find(t => t.full_name === foundSubj?.teacher);

    setForm(prev => ({
      ...prev,
      subject_id: subjId,
      teacher_id: matchedTeacher ? matchedTeacher.id : prev.teacher_id,
      teacher_name: matchedTeacher ? matchedTeacher.full_name : (foundSubj?.teacher || prev.teacher_name)
    }));
  };

  const handleTeacherChange = (teacherId) => {
    const foundTeacher = teachers.find(t => t.id === teacherId);
    setForm(prev => ({
      ...prev,
      teacher_id: teacherId,
      teacher_name: foundTeacher ? foundTeacher.full_name : ''
    }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!form.class_id || !form.subject_id) {
      setAlertConfig({
        type: 'danger',
        title: 'Data Belum Lengkap',
        message: 'Mohon pilih kelas dan mata pelajaran.',
        onConfirm: () => setAlertConfig(null)
      });
      return;
    }

    const selectedSubj = subjects.find(s => s.id === form.subject_id);
    const payload = {
      ...form,
      subject_name: selectedSubj?.name || ''
    };

    if (formModalMode === 'create') {
      onAddSchedule({
        id: 'SCH-' + Math.floor(100 + Math.random() * 900),
        ...payload
      });
      setFormModalMode(null);
      setAlertConfig({
        type: 'success',
        title: 'Berhasil!',
        message: 'Jadwal pelajaran baru berhasil ditambahkan.',
        onConfirm: () => setAlertConfig(null)
      });
    } else if (formModalMode === 'edit') {
      onEditSchedule(payload);
      setFormModalMode(null);
      setAlertConfig({
        type: 'success',
        title: 'Berhasil!',
        message: 'Perubahan jadwal pelajaran berhasil disimpan.',
        onConfirm: () => setAlertConfig(null)
      });
    }
  };

  const handlePreDelete = (item) => {
    const subjName = subjects.find(s => s.id === item.subject_id)?.name || item.subject_name || 'Pelajaran';
    setAlertConfig({
      type: 'confirm',
      title: 'Konfirmasi Hapus',
      message: `Hapus jadwal ${subjName} pada hari ${item.day} (${item.start_time} - ${item.end_time})?`,
      onConfirm: () => {
        onDeleteSchedule(item.id);
        setAlertConfig({
          type: 'success',
          title: 'Berhasil!',
          message: 'Jadwal berhasil dihapus.',
          onConfirm: () => setAlertConfig(null)
        });
      },
      onCancel: () => setAlertConfig(null)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <span>Presensi</span>
            <span>/</span>
            <span className="text-[#5d87ff] font-bold">Jadwal Pelajaran</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Jadwal Pelajaran
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Kelola jadwal belajar mengajar mingguan SMK Mawaddah</p>
        </div>

        {currentUser?.role !== 'murid' && (
          <button 
            onClick={openCreateForm}
            className="px-4 py-2 bg-[#5d87ff] hover:bg-[#4570ea] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Tambah Jadwal</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs space-y-3">
        {/* Hari Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold px-2 shrink-0">Hari:</span>
          {['Semua', ...DAYS_OF_WEEK].map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                selectedDay === day 
                  ? 'bg-[#5d87ff] text-white shadow-xs' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Filter Kelas, Tahun Ajaran, Semester & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
          <div className="w-full sm:w-40">
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5d87ff]/30 focus:border-[#5d87ff]"
            >
              <option value="Semua">Semua Thn Ajaran</option>
              {ACADEMIC_YEARS.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-36">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5d87ff]/30 focus:border-[#5d87ff]"
            >
              <option value="Semua">Semua Semester</option>
              <option value="Ganjil">Semester Ganjil</option>
              <option value="Genap">Semester Genap</option>
            </select>
          </div>

          <div className="w-full sm:w-48">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5d87ff]/30 focus:border-[#5d87ff]"
            >
              <option value="Semua">Semua Kelas</option>
              {classes.map(cl => (
                <option key={cl.id} value={cl.id}>{cl.class_name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 relative">
            <input 
              type="text"
              placeholder="Cari mapel atau guru pengajar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5d87ff]/30 focus:border-[#5d87ff]"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Table / Card List */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Hari</th>
                <th className="py-3.5 px-4">Jam Mulai / Selesai</th>
                <th className="py-3.5 px-4">Kelas</th>
                <th className="py-3.5 px-4">Mata Pelajaran</th>
                <th className="py-3.5 px-4">Guru Pengajar</th>
                <th className="py-3.5 px-4">Tahun Ajaran</th>
                <th className="py-3.5 px-4">Semester</th>
                {currentUser?.role !== 'murid' && (
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {sortedSchedules.length > 0 ? (
                sortedSchedules.map((item) => {
                  const targetClass = classes.find(c => c.id === item.class_id);
                  const targetSubj = subjects.find(s => s.id === item.subject_id);
                  const subjectName = targetSubj?.name || item.subject_name || '-';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-extrabold ${
                          item.day === 'Ahad' || item.day === 'Minggu' ? 'bg-red-100 text-red-700' :
                          item.day === 'Senin' ? 'bg-blue-100 text-blue-700' :
                          item.day === 'Selasa' ? 'bg-emerald-100 text-emerald-700' :
                          item.day === 'Rabu' ? 'bg-amber-100 text-amber-700' :
                          item.day === 'Kamis' ? 'bg-purple-100 text-purple-700' :
                          item.day === 'Jumat' ? 'bg-teal-100 text-teal-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {item.day}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"/>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/>
                          </svg>
                          {item.start_time} – {item.end_time}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {targetClass ? targetClass.class_name : item.class_id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {subjectName}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {(() => {
                          const matchedT = teachers.find(t => t.id === item.teacher_id || t.full_name === item.teacher_name);
                          return matchedT ? matchedT.full_name : (item.teacher_name || '-');
                        })()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {item.academic_year || '2025/2026'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          (item.semester || 'Ganjil') === 'Ganjil' 
                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' 
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                          {item.semester || 'Ganjil'}
                        </span>
                      </td>
                      {currentUser?.role !== 'murid' && (
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditForm(item)}
                              title="Edit Jadwal"
                              className="p-1.5 rounded-lg bg-blue-50 text-[#5d87ff] hover:bg-blue-100 transition"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                              </svg>
                            </button>
                            <button
                              onClick={() => handlePreDelete(item)}
                              title="Hapus Jadwal"
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-slate-400">
                    <svg className="w-10 h-10 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Belum ada jadwal pelajaran untuk kriteria yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah / Edit */}
      {formModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">
                {formModalMode === 'create' ? 'Tambah Jadwal Pelajaran' : 'Edit Jadwal Pelajaran'}
              </h3>
              <button 
                onClick={() => setFormModalMode(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hari</label>
                  <select
                    value={form.day}
                    onChange={(e) => setForm({ ...form, day: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5d87ff]/30 focus:border-[#5d87ff]"
                  >
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Ajaran</label>
                  <select
                    value={form.academic_year}
                    onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5d87ff]/30 focus:border-[#5d87ff]"
                  >
                    {ACADEMIC_YEARS.map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5d87ff]/30 focus:border-[#5d87ff]"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kelas</label>
                <select
                  value={form.class_id}
                  onChange={(e) => setForm({ ...form, class_id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5d87ff]/30 focus:border-[#5d87ff]"
                >
                  {classes.map(cl => (
                    <option key={cl.id} value={cl.id}>{cl.class_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                <select
                  value={form.subject_id}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5d87ff]/30 focus:border-[#5d87ff]"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.teacher})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Guru Pengajar</label>
                <select
                  value={form.teacher_id}
                  onChange={(e) => handleTeacherChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5d87ff]/30 focus:border-[#5d87ff]"
                >
                  <option value="">-- Pilih Guru Pengajar --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Mulai</label>
                  <input 
                    type="time"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5d87ff]/30 focus:border-[#5d87ff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Selesai</label>
                  <input 
                    type="time"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5d87ff]/30 focus:border-[#5d87ff]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFormModalMode(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5d87ff] hover:bg-[#4570ea] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alert Pop-up */}
      {alertConfig && (
        <SweetAlertModal 
          isOpen={true}
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          onConfirm={alertConfig.onConfirm}
          onCancel={alertConfig.onCancel}
        />
      )}
    </div>
  );
};

export default ScheduleView;
