import React from 'react';

const GuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '1',
      title: 'Presensi Masuk (06.30 - 07.15 WIB)',
      desc: 'Setibanya di sekolah, lakukan tap kartu pelajar RFID pada sensor di gerbang atau scan QR presensi melalui loket gerbang utama.',
    },
    {
      num: '2',
      title: 'Presensi Pembelajaran Kelas (KBM)',
      desc: 'Di awal setiap jam pelajaran, guru pengampu akan memverifikasi kehadiran di aplikasi kelas. Pastikan berada di dalam ruangan.',
    },
    {
      num: '3',
      title: 'Presensi Pulang (15.30 - 16.30 WIB)',
      desc: 'Lakukan tap kartu kembali saat jam pulang sekolah usai. Data kepulangan akan otomatis terkirim via notifikasi kepada orang tua/wali murid.',
    },
    {
      num: '4',
      title: 'Izin, Sakit, atau Dispensasi Kegiatan',
      desc: 'Pengajuan izin sakit wajib melampirkan surat dokter. Surat tugas ekstrakurikuler/lomba diserahkan ke kesiswaan untuk status Dispen.',
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header-custom" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
          <span className="badge bg-primary px-2 py-1 mb-2">PANDUAN RESMI</span>
          <h3 className="h5 fw-bold mb-1">Tata Cara Presensi & Ketertiban SMK</h3>
          <p className="small mb-0 text-white-50">Pedoman kehadiran untuk mewujudkan kedisiplinan berkarakter</p>
        </div>

        <div className="p-4">
          <div className="d-flex flex-column gap-3 mb-4">
            {steps.map((st, idx) => (
              <div key={idx} className="d-flex gap-3 align-items-start p-3 rounded-3 bg-light border">
                <span className="badge bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>
                  {st.num}
                </span>
                <div>
                  <h5 className="h6 fw-bold mb-1 text-dark">{st.title}</h5>
                  <p className="small text-muted mb-0 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="alert alert-info py-2 px-3 small d-flex align-items-center gap-2 mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Toleransi keterlambatan maksimal 10 menit. Siswa terlambat wajib melapor ke guru piket.</span>
          </div>

          <button className="btn btn-primary w-100 rounded-pill py-2 fw-bold" onClick={onClose}>
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
