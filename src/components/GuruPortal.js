import React, { useState } from 'react';

const GuruPortal = ({ currentUser, classes, students, onSaveAttendanceBatch }) => {
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || 'CLS-01');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  
  // Filter students for the selected class
  const classStudents = students.filter(s => s.class_id === selectedClass);

  // Local attendance state for current sheet
  const [attendanceSheet, setAttendanceSheet] = useState({});

  const getStatus = (studentId) => {
    return attendanceSheet[studentId]?.status || 'Hadir';
  };

  const getNotes = (studentId) => {
    return attendanceSheet[studentId]?.notes || '';
  };

  const handleSetStatus = (studentId, status) => {
    setAttendanceSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: status
      }
    }));
  };

  const handleSetNotes = (studentId, notes) => {
    setAttendanceSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes: notes
      }
    }));
  };

  const handleSetAllHadir = () => {
    const updated = { ...attendanceSheet };
    classStudents.forEach(st => {
      updated[st.id] = {
        ...updated[st.id],
        status: 'Hadir'
      };
    });
    setAttendanceSheet(updated);
  };

  const handleSave = () => {
    if (classStudents.length === 0) {
      alert('Tidak ada siswa di kelas ini.');
      return;
    }

    const records = classStudents.map(st => ({
      student_id: st.id,
      student_name: st.full_name,
      class_id: selectedClass,
      date: selectedDate,
      status: getStatus(st.id),
      notes: getNotes(st.id)
    }));

    onSaveAttendanceBatch(records);
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="siam-card p-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <span className="badge bg-success-subtle text-success fw-bold px-2.5 py-1 mb-1">
            PORTAL GURU PENGAJAR
          </span>
          <h2 className="h4 fw-bold text-dark mb-0">Input Presensi Harian</h2>
          <small className="text-muted">Guru: {currentUser?.full_name}</small>
        </div>

        <button 
          className="btn btn-outline-success btn-sm rounded-pill fw-bold px-3 d-flex align-items-center gap-2"
          onClick={handleSetAllHadir}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>✓ Set Semua Siswa Hadir</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="siam-card p-3 mb-4 bg-light">
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-muted text-uppercase">Pilih Rombongan Belajar (Kelas)</label>
            <select 
              className="form-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.class_name}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-muted text-uppercase">Tanggal Presensi</label>
            <input 
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Attendance Matrix List */}
      <div className="siam-card overflow-hidden mb-4">
        <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
          <span className="small fw-bold text-uppercase text-secondary">
            Daftar Siswa ({classStudents.length} Siswa)
          </span>
          <span className="small text-muted">
            Klik status untuk mengubah kehadiran
          </span>
        </div>

        <div className="list-group list-group-flush">
          {classStudents.length === 0 ? (
            <div className="p-4 text-center text-muted">
              Belum ada data siswa di kelas yang dipilih.
            </div>
          ) : (
            classStudents.map((st, index) => {
              const currentStatus = getStatus(st.id);
              const currentNotes = getNotes(st.id);

              return (
                <div key={st.id} className="list-group-item p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <span className="badge bg-light text-secondary border font-monospace">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="fw-bold text-dark">{st.full_name}</div>
                      <small className="text-muted font-monospace">
                        NISN: {st.nisn} • Gender: {st.gender}
                      </small>
                    </div>
                  </div>

                  {/* Quick Toggle Buttons & Notes */}
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <div className="btn-group btn-group-sm" role="group">
                      <button 
                        type="button" 
                        className={`status-btn ${currentStatus === 'Hadir' ? 'active-hadir' : ''}`}
                        onClick={() => handleSetStatus(st.id, 'Hadir')}
                      >
                        Hadir
                      </button>
                      <button 
                        type="button" 
                        className={`status-btn ${currentStatus === 'Izin' ? 'active-izin' : ''}`}
                        onClick={() => handleSetStatus(st.id, 'Izin')}
                      >
                        Izin
                      </button>
                      <button 
                        type="button" 
                        className={`status-btn ${currentStatus === 'Sakit' ? 'active-sakit' : ''}`}
                        onClick={() => handleSetStatus(st.id, 'Sakit')}
                      >
                        Sakit
                      </button>
                      <button 
                        type="button" 
                        className={`status-btn ${currentStatus === 'Alpa' ? 'active-alpa' : ''}`}
                        onClick={() => handleSetStatus(st.id, 'Alpa')}
                      >
                        Alpa
                      </button>
                    </div>

                    <input 
                      type="text" 
                      className="form-control form-control-sm"
                      style={{ width: '150px' }}
                      placeholder="Catatan..."
                      value={currentNotes}
                      onChange={(e) => handleSetNotes(st.id, e.target.value)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Action */}
        <div className="p-3 bg-light border-top d-flex justify-content-end">
          <button 
            className="btn-emerald py-2 px-4 rounded-pill fw-bold"
            onClick={handleSave}
            disabled={classStudents.length === 0}
          >
            <span>Simpan Absensi Kelas Ini</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
};

export default GuruPortal;
