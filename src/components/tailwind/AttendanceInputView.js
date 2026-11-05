import React, { useState } from 'react';
import SweetAlertModal from './SweetAlertModal';

const AttendanceInputView = ({ classes, students, onSaveBatch }) => {
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || 'CLS-01');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  
  const classStudents = students.filter(s => s.class_id === selectedClass);
  const [statuses, setStatuses] = useState({});
  const [notes, setNotes] = useState({});

  const [alertConfig, setAlertConfig] = useState(null);

  const getStatus = (id) => statuses[id] || 'Hadir';
  const getNote = (id) => notes[id] || '';

  const handleSetStatus = (id, st) => {
    setStatuses(prev => ({ ...prev, [id]: st }));
  };

  const handleSetNote = (id, n) => {
    setNotes(prev => ({ ...prev, [id]: n }));
  };

  const handleSetAllHadir = () => {
    const updated = {};
    classStudents.forEach(s => {
      updated[s.id] = 'Hadir';
    });
    setStatuses(updated);
  };

  // Simpan Presensi langsung tanpa konfirmasi bertumpuk
  const handlePreSave = () => {
    if (classStudents.length === 0) return;

    const records = classStudents.map(st => ({
      student_id: st.id,
      student_name: st.full_name,
      class_id: selectedClass,
      date: selectedDate,
      status: getStatus(st.id),
      notes: getNote(st.id)
    }));
    onSaveBatch(records);
    // Pop-up Sukses
    setAlertConfig({
      type: 'success',
      title: 'Berhasil!',
      message: `Data presensi untuk ${classStudents.length} murid berhasil disimpan.`,
      onConfirm: () => setAlertConfig(null)
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <span>Presensi</span>
            <span>/</span>
            <span className="text-[#5d87ff] font-bold">Input Absensi Harian</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Lembar Presensi Kelas
          </h1>
        </div>

        <button 
          onClick={handleSetAllHadir}
          className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <span>✓ Set Semua Murid Hadir</span>
        </button>
      </div>

      {/* Class & Date Filter Card */}
      <div className="tw-card p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pilih Rombel Kelas</label>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-[#5d87ff]"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.class_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tanggal Presensi</label>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-[#5d87ff]"
            />
          </div>
        </div>
      </div>

      {/* Student Attendance Matrix */}
      <div className="tw-card overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wide">
            Daftar Murid ({classStudents.length} Murid)
          </span>
          <span className="text-slate-400">Pilih status kehadiran</span>
        </div>

        <div className="divide-y divide-slate-100">
          {classStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Tidak ada murid di kelas ini.
            </div>
          ) : (
            classStudents.map((st, index) => {
              const currentStatus = getStatus(st.id);
              const currentNote = getNote(st.id);

              return (
                <div key={st.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/70 transition">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-300">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{st.full_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        NISN: {st.nisn} • Gender: {st.gender}
                      </div>
                    </div>
                  </div>

                  {/* Status Toggle Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 text-xs">
                      <button 
                        type="button" 
                        onClick={() => handleSetStatus(st.id, 'Hadir')}
                        className={`px-3 py-1 font-bold rounded-lg transition ${
                          currentStatus === 'Hadir' ? 'bg-[#13deb9] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Hadir
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleSetStatus(st.id, 'Izin')}
                        className={`px-3 py-1 font-bold rounded-lg transition ${
                          currentStatus === 'Izin' ? 'bg-[#5d87ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Izin
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleSetStatus(st.id, 'Sakit')}
                        className={`px-3 py-1 font-bold rounded-lg transition ${
                          currentStatus === 'Sakit' ? 'bg-[#ffae1f] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Sakit
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleSetStatus(st.id, 'Alpa')}
                        className={`px-3 py-1 font-bold rounded-lg transition ${
                          currentStatus === 'Alpa' ? 'bg-[#fa896b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Alpa
                      </button>
                    </div>

                    <input 
                      type="text" 
                      placeholder="Catatan..."
                      value={currentNote}
                      onChange={(e) => handleSetNote(st.id, e.target.value)}
                      className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl w-36 outline-none focus:bg-white focus:border-[#5d87ff]"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handlePreSave}
            disabled={classStudents.length === 0}
            className="px-6 py-2.5 bg-[#5d87ff] hover:bg-[#4570ea] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2"
          >
            <span>Simpan Presensi Kelas</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        </div>

      </div>

      {/* SWEETALERT POP-UP: KONFIRMASI SIMPAN PRESENSI & SUKSES */}
      {alertConfig && (
        <SweetAlertModal 
          isOpen={Boolean(alertConfig)}
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

export default AttendanceInputView;
