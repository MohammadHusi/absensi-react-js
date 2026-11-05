import React, { useState } from 'react';

const AdminPortal = ({ 
  students, 
  teachers, 
  classes, 
  attendanceRecords, 
  onAddStudent, 
  onDeleteStudent,
  onAddTeacher,
  onDeleteTeacher,
  onAddClass,
  onDeleteClass 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Filter states for Rekap
  const [filterClass, setFilterClass] = useState('');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10));

  // Modals state
  const [modalType, setModalType] = useState(null); // 'student' | 'teacher' | 'class'
  const [studentForm, setStudentForm] = useState({ nisn: '', full_name: '', class_id: 'CLS-01', gender: 'L', parent_phone: '' });
  const [teacherForm, setTeacherForm] = useState({ nip: '', full_name: '', subject: '' });
  const [classForm, setClassForm] = useState({ class_name: '', academic_year: '2025/2026' });

  // Today's attendance counts
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRecords = attendanceRecords.filter(r => r.date === todayStr);
  const hadirCount = todayRecords.filter(r => r.status === 'Hadir').length;
  const izinCount = todayRecords.filter(r => r.status === 'Izin').length;
  const sakitCount = todayRecords.filter(r => r.status === 'Sakit').length;
  const alpaCount = todayRecords.filter(r => r.status === 'Alpa').length;
  const totalToday = todayRecords.length;
  const rateToday = totalToday > 0 ? Math.round((hadirCount / totalToday) * 100) : 0;

  // Filtered records for Rekap
  const filteredRecords = attendanceRecords.filter(r => {
    const matchClass = !filterClass || r.class_id === filterClass;
    const matchDate = !filterDate || r.date === filterDate;
    return matchClass && matchDate;
  });

  // Export to CSV
  const handleExportCsv = () => {
    if (filteredRecords.length === 0) {
      alert('Tidak ada data yang sesuai filter untuk diekspor.');
      return;
    }
    let csv = 'ID,Tanggal,Kelas,NISN,Nama Siswa,Status,Catatan\n';
    filteredRecords.forEach(r => {
      const st = students.find(s => s.id === r.student_id) || { nisn: '-', full_name: r.student_name || '-' };
      const cl = classes.find(c => c.id === r.class_id) || { class_name: r.class_id };
      csv += `"${r.id}","${r.date}","${cl.class_name}","${st.nisn}","${st.full_name}","${r.status}","${r.notes || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rekap_Absensi_Mawaddah_${todayStr}.csv`;
    link.click();
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    onAddStudent({
      id: 'STD-' + Math.floor(100 + Math.random() * 900),
      ...studentForm
    });
    setModalType(null);
    setStudentForm({ nisn: '', full_name: '', class_id: 'CLS-01', gender: 'L', parent_phone: '' });
  };

  const handleSaveTeacher = (e) => {
    e.preventDefault();
    onAddTeacher({
      id: 'TCH-' + Math.floor(100 + Math.random() * 900),
      ...teacherForm
    });
    setModalType(null);
    setTeacherForm({ nip: '', full_name: '', subject: '' });
  };

  const handleSaveClass = (e) => {
    e.preventDefault();
    onAddClass({
      id: 'CLS-' + Math.floor(10 + Math.random() * 90),
      ...classForm
    });
    setModalType(null);
    setClassForm({ class_name: '', academic_year: '2025/2026' });
  };

  return (
    <div className="container py-4">
      
      {/* Top Header & Navigation Tabs */}
      <div className="siam-card p-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <span className="badge bg-success-subtle text-success fw-bold px-2.5 py-1 mb-1">
            DASHBOARD ADMINISTRATOR
          </span>
          <h2 className="h4 fw-bold text-dark mb-0">SIAM SMK Mawaddah Palengaan</h2>
        </div>

        <div className="d-flex flex-wrap gap-1 bg-light p-1 rounded-3 border">
          <button 
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-white bg-white shadow-sm fw-bold text-success' : 'text-muted'}`}
            onClick={() => setActiveTab('overview')}
          >
            Ringkasan
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'students' ? 'btn-white bg-white shadow-sm fw-bold text-success' : 'text-muted'}`}
            onClick={() => setActiveTab('students')}
          >
            Data Siswa ({students.length})
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'teachers' ? 'btn-white bg-white shadow-sm fw-bold text-success' : 'text-muted'}`}
            onClick={() => setActiveTab('teachers')}
          >
            Data Guru ({teachers.length})
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'classes' ? 'btn-white bg-white shadow-sm fw-bold text-success' : 'text-muted'}`}
            onClick={() => setActiveTab('classes')}
          >
            Data Kelas ({classes.length})
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'rekap' ? 'btn-white bg-white shadow-sm fw-bold text-success' : 'text-muted'}`}
            onClick={() => setActiveTab('rekap')}
          >
            Rekapitulasi
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          {/* 4 Metric Cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-lg-3">
              <div className="siam-card p-3 p-md-4">
                <span className="small text-muted fw-bold text-uppercase">Total Siswa</span>
                <div className="h3 fw-bold text-dark my-1">{students.length}</div>
                <small className="text-muted">Terdaftar aktif di sistem</small>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="siam-card p-3 p-md-4">
                <span className="small text-muted fw-bold text-uppercase">Guru & Tendik</span>
                <div className="h3 fw-bold text-dark my-1">{teachers.length}</div>
                <small className="text-muted">Pendidik aktif</small>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="siam-card p-3 p-md-4">
                <span className="small text-muted fw-bold text-uppercase">Rombel Kelas</span>
                <div className="h3 fw-bold text-dark my-1">{classes.length}</div>
                <small className="text-muted">TKJ, RPL, TBSM</small>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="siam-card p-3 p-md-4">
                <span className="small text-muted fw-bold text-uppercase">Tingkat Hadir Hari Ini</span>
                <div className="h3 fw-bold text-success my-1">{rateToday}%</div>
                <small className="text-muted">{totalToday} Siswa Terabsen</small>
              </div>
            </div>
          </div>

          {/* Breakdown Status Hari Ini */}
          <div className="siam-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h6 fw-bold text-dark mb-0">Rincian Presensi Hari Ini</h3>
              <span className="badge bg-light text-secondary border small">{todayStr}</span>
            </div>

            <div className="row g-3 text-center">
              <div className="col-6 col-sm-3">
                <div className="p-3 rounded-3 bg-success-subtle border border-success-subtle">
                  <span className="small fw-bold text-success text-uppercase">Hadir</span>
                  <div className="h2 fw-bold text-success mb-0">{hadirCount}</div>
                </div>
              </div>

              <div className="col-6 col-sm-3">
                <div className="p-3 rounded-3 bg-info-subtle border border-info-subtle">
                  <span className="small fw-bold text-info text-uppercase">Izin</span>
                  <div className="h2 fw-bold text-info mb-0">{izinCount}</div>
                </div>
              </div>

              <div className="col-6 col-sm-3">
                <div className="p-3 rounded-3 bg-warning-subtle border border-warning-subtle">
                  <span className="small fw-bold text-warning text-uppercase">Sakit</span>
                  <div className="h2 fw-bold text-warning mb-0">{sakitCount}</div>
                </div>
              </div>

              <div className="col-6 col-sm-3">
                <div className="p-3 rounded-3 bg-danger-subtle border border-danger-subtle">
                  <span className="small fw-bold text-danger text-uppercase">Alpa</span>
                  <div className="h2 fw-bold text-danger mb-0">{alpaCount}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MASTER DATA SISWA TAB */}
      {activeTab === 'students' && (
        <div className="siam-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h6 fw-bold text-dark mb-0">Data Induk Siswa SMK Mawaddah</h3>
            <button className="btn-emerald btn-sm" onClick={() => setModalType('student')}>
              + Tambah Siswa
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.85rem' }}>
              <thead className="table-light">
                <tr>
                  <th>NISN</th>
                  <th>Nama Lengkap</th>
                  <th>Kelas</th>
                  <th>Gender</th>
                  <th>No. HP Orang Tua</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.id}>
                    <td className="font-monospace fw-bold">{st.nisn}</td>
                    <td className="fw-semibold text-dark">{st.full_name}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {classes.find(c => c.id === st.class_id)?.class_name || st.class_id}
                      </span>
                    </td>
                    <td>{st.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                    <td className="font-monospace text-muted">{st.parent_phone}</td>
                    <td className="text-center">
                      <button 
                        className="btn btn-outline-danger btn-sm py-0 px-2 rounded-pill"
                        onClick={() => onDeleteStudent(st.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MASTER DATA GURU TAB */}
      {activeTab === 'teachers' && (
        <div className="siam-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h6 fw-bold text-dark mb-0">Data Dewan Guru Pengajar</h3>
            <button className="btn-emerald btn-sm" onClick={() => setModalType('teacher')}>
              + Tambah Guru
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.85rem' }}>
              <thead className="table-light">
                <tr>
                  <th>NIP</th>
                  <th>Nama Guru</th>
                  <th>Mata Pelajaran</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((tc) => (
                  <tr key={tc.id}>
                    <td className="font-monospace fw-bold">{tc.nip}</td>
                    <td className="fw-semibold text-dark">{tc.full_name}</td>
                    <td><span className="badge bg-success-subtle text-success">{tc.subject}</span></td>
                    <td className="text-center">
                      <button 
                        className="btn btn-outline-danger btn-sm py-0 px-2 rounded-pill"
                        onClick={() => onDeleteTeacher(tc.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MASTER DATA KELAS TAB */}
      {activeTab === 'classes' && (
        <div className="siam-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h6 fw-bold text-dark mb-0">Daftar Rombongan Belajar (Rombel)</h3>
            <button className="btn-emerald btn-sm" onClick={() => setModalType('class')}>
              + Tambah Kelas
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.85rem' }}>
              <thead className="table-light">
                <tr>
                  <th>Kode Kelas</th>
                  <th>Nama Kelas & Kompetensi</th>
                  <th>Tahun Ajaran</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cl) => (
                  <tr key={cl.id}>
                    <td className="font-monospace fw-bold">{cl.id}</td>
                    <td className="fw-bold text-dark">{cl.class_name}</td>
                    <td>{cl.academic_year}</td>
                    <td className="text-center">
                      <button 
                        className="btn btn-outline-danger btn-sm py-0 px-2 rounded-pill"
                        onClick={() => onDeleteClass(cl.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. REKAPITULASI & EXPORT TAB */}
      {activeTab === 'rekap' && (
        <div className="siam-card p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <div>
              <h3 className="h6 fw-bold text-dark mb-1">Laporan Rekapitulasi Presensi</h3>
              <small className="text-muted">Filter berdasarkan kelas dan tanggal untuk ekspor laporan</small>
            </div>
            <button className="btn btn-success btn-sm fw-bold rounded-pill px-3" onClick={handleExportCsv}>
              📥 Ekspor ke Excel (CSV)
            </button>
          </div>

          {/* Filter Bar */}
          <div className="row g-2 mb-4 bg-light p-3 rounded-3 border">
            <div className="col-12 col-md-5">
              <label className="form-label small fw-bold text-muted">Filter Kelas</label>
              <select 
                className="form-select form-select-sm"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <option value="">Semua Kelas</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.class_name}</option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-5">
              <label className="form-label small fw-bold text-muted">Filter Tanggal</label>
              <input 
                type="date"
                className="form-control form-control-sm"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-2 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={() => { setFilterClass(''); setFilterDate(''); }}
              >
                Reset Filter
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.85rem' }}>
              <thead className="table-light">
                <tr>
                  <th>Tanggal</th>
                  <th>Kelas</th>
                  <th>Nama Siswa</th>
                  <th>Status</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      Tidak ada catatan absensi sesuai filter yang dipilih.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => {
                    const st = students.find(s => s.id === r.student_id);
                    const cl = classes.find(c => c.id === r.class_id);
                    const badgeClass = r.status === 'Hadir' ? 'bg-success' :
                                       r.status === 'Izin' ? 'bg-info' :
                                       r.status === 'Sakit' ? 'bg-warning' : 'bg-danger';
                    return (
                      <tr key={r.id}>
                        <td className="font-monospace">{r.date}</td>
                        <td>{cl?.class_name || r.class_id}</td>
                        <td className="fw-semibold">{st?.full_name || r.student_name}</td>
                        <td><span className={`badge ${badgeClass} text-white`}>{r.status}</span></td>
                        <td className="text-muted">{r.notes || '-'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH SISWA */}
      {modalType === 'student' && (
        <div className="siam-modal-overlay" onClick={() => setModalType(null)}>
          <div className="siam-modal-content p-4" onClick={(e) => e.stopPropagation()}>
            <h4 className="h6 fw-bold text-dark mb-3">Tambah Siswa Baru</h4>
            <form onSubmit={handleSaveStudent}>
              <div className="mb-2">
                <label className="form-label small fw-bold">NISN</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm"
                  value={studentForm.nisn}
                  onChange={(e) => setStudentForm({ ...studentForm, nisn: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold">Nama Lengkap</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm"
                  value={studentForm.full_name}
                  onChange={(e) => setStudentForm({ ...studentForm, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold">Kelas</label>
                <select 
                  className="form-select form-select-sm"
                  value={studentForm.class_id}
                  onChange={(e) => setStudentForm({ ...studentForm, class_id: e.target.value })}
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.class_name}</option>
                  ))}
                </select>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold">Gender</label>
                  <select 
                    className="form-select form-select-sm"
                    value={studentForm.gender}
                    onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold">No. HP Orang Tua</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm"
                    value={studentForm.parent_phone}
                    onChange={(e) => setStudentForm({ ...studentForm, parent_phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light btn-sm" onClick={() => setModalType(null)}>Batal</button>
                <button type="submit" className="btn btn-success btn-sm fw-bold">Simpan Siswa</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH GURU */}
      {modalType === 'teacher' && (
        <div className="siam-modal-overlay" onClick={() => setModalType(null)}>
          <div className="siam-modal-content p-4" onClick={(e) => e.stopPropagation()}>
            <h4 className="h6 fw-bold text-dark mb-3">Tambah Guru Pengajar</h4>
            <form onSubmit={handleSaveTeacher}>
              <div className="mb-2">
                <label className="form-label small fw-bold">NIP / NUPTK</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm"
                  value={teacherForm.nip}
                  onChange={(e) => setTeacherForm({ ...teacherForm, nip: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold">Nama Guru Lengkap</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm"
                  value={teacherForm.full_name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Mata Pelajaran</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm"
                  value={teacherForm.subject}
                  onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                  required
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light btn-sm" onClick={() => setModalType(null)}>Batal</button>
                <button type="submit" className="btn btn-success btn-sm fw-bold">Simpan Guru</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH KELAS */}
      {modalType === 'class' && (
        <div className="siam-modal-overlay" onClick={() => setModalType(null)}>
          <div className="siam-modal-content p-4" onClick={(e) => e.stopPropagation()}>
            <h4 className="h6 fw-bold text-dark mb-3">Tambah Kelas Baru</h4>
            <form onSubmit={handleSaveClass}>
              <div className="mb-2">
                <label className="form-label small fw-bold">Nama Kelas & Jurusan</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm"
                  placeholder="Contoh: X TKJ 2"
                  value={classForm.class_name}
                  onChange={(e) => setClassForm({ ...classForm, class_name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Tahun Akademik</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm"
                  value={classForm.academic_year}
                  onChange={(e) => setClassForm({ ...classForm, academic_year: e.target.value })}
                  required
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light btn-sm" onClick={() => setModalType(null)}>Batal</button>
                <button type="submit" className="btn btn-success btn-sm fw-bold">Simpan Kelas</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPortal;
