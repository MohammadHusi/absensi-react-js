import React, { useState } from 'react';
import SweetAlertModal from './SweetAlertModal';

const StudentSelfView = ({ currentUser, students = [], classes = [], attendanceRecords = [], onAddExcuse, onUpdateProfile }) => {
  const [showExcuseModal, setShowExcuseModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  // Cari data murid yang login
  const studentData = students.find(s => s.id === currentUser?.student_id || s.username === currentUser?.username) || {
    id: currentUser?.student_id || 'STD-001',
    nisn: currentUser?.username || '0061234567',
    full_name: currentUser?.full_name || 'Mohammad Zainal Arifin',
    gender: 'L',
    parent_phone: '081234567890',
    address: 'Jl. Raya Palengaan No. 12, Pamekasan',
    class_id: currentUser?.class_id || 'CLS-01'
  };

  const studentClass = classes.find(c => c.id === studentData.class_id);

  // Form Edit Profil Pribadi
  const [profileForm, setProfileForm] = useState({
    nisn: studentData.nisn || '',
    full_name: studentData.full_name || '',
    gender: studentData.gender || 'L',
    parent_phone: studentData.parent_phone || '',
    address: studentData.address || ''
  });

  const openProfileModal = () => {
    setProfileForm({
      nisn: studentData.nisn || currentUser?.username || '',
      full_name: studentData.full_name || currentUser?.full_name || '',
      gender: studentData.gender || 'L',
      parent_phone: studentData.parent_phone || '',
      address: studentData.address || ''
    });
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.full_name.trim()) return;

    if (onUpdateProfile) {
      onUpdateProfile({
        ...studentData,
        ...profileForm
      });
    }

    setShowEditProfileModal(false);
    setAlertConfig({
      type: 'success',
      title: 'Profil Diperbarui!',
      message: 'Data pribadi Anda berhasil disimpan dan diperbarui.',
      onConfirm: () => setAlertConfig(null)
    });
  };

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    status: 'Izin',
    notes: '',
    attachment_url: ''
  });

  const myRecords = attendanceRecords.filter(r => r.student_id === currentUser?.student_id || r.student_id === 'STD-001');
  const hadir = myRecords.filter(r => r.status === 'Hadir').length;
  const izin = myRecords.filter(r => r.status === 'Izin').length;
  const sakit = myRecords.filter(r => r.status === 'Sakit').length;
  const alpa = myRecords.filter(r => r.status === 'Alpa').length;
  const total = hadir + izin + sakit + alpa;
  const rate = total > 0 ? Math.round((hadir / total) * 100) : 100;

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!form.notes) return;

    onAddExcuse({
      id: 'ATT-IZN-' + Math.floor(100 + Math.random() * 900),
      student_id: currentUser?.student_id || 'STD-001',
      student_name: currentUser?.full_name || 'Mohammad Zainal Arifin',
      class_id: currentUser?.class_id || 'CLS-01',
      date: form.date,
      status: form.status,
      notes: form.notes,
      attachment_url: form.attachment_url
    });
    setShowExcuseModal(false);
    setForm({ date: new Date().toISOString().slice(0, 10), status: 'Izin', notes: '', attachment_url: '' });
    // Pop-up Sukses
    setAlertConfig({
      type: 'success',
      title: 'Berhasil!',
      message: 'Pengajuan izin/sakit berhasil dikirimkan.',
      onConfirm: () => setAlertConfig(null)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <span>Portal Saya</span>
            <span>/</span>
            <span className="text-[#5d87ff] font-bold">Kehadiran Mandiri</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            {currentUser?.full_name || studentData.full_name}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={openProfileModal}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-[#5d87ff]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            <span>Ubah Data Pribadi</span>
          </button>

          {currentUser?.role === 'murid' && (
            <button 
              onClick={() => setShowExcuseModal(true)}
              className="px-4 py-2 bg-[#5d87ff] hover:bg-[#4570ea] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
            >
              <span>+ Ajukan Izin / Sakit</span>
            </button>
          )}
        </div>
      </div>

      {/* Profil Ringkas Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Jenis Kelamin</span>
          <span className="font-bold text-slate-700 mt-1 block">
            {studentData.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">No. Telepon / WA</span>
          <span className="font-bold text-slate-700 mt-1 block font-mono">
            {studentData.parent_phone || '-'}
          </span>
        </div>
        <div className="sm:col-span-2">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Alamat Rumah</span>
          <span className="font-semibold text-slate-700 mt-1 block">
            {studentData.address || '-'}
          </span>
        </div>
      </div>

      {/* 5 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
        <div className="tw-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Tingkat Hadir</span>
          <div className="text-2xl font-black text-[#5d87ff] mt-1">{rate}%</div>
          <span className="text-[10px] text-slate-400">Syarat Ujian &gt; 85%</span>
        </div>
        <div className="tw-card p-4">
          <span className="text-[11px] font-bold text-emerald-600 uppercase">Hadir</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{hadir}</div>
          <span className="text-[10px] text-slate-400">Pertemuan</span>
        </div>
        <div className="tw-card p-4">
          <span className="text-[11px] font-bold text-blue-600 uppercase">Izin</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{izin}</div>
          <span className="text-[10px] text-slate-400">Dispensasi</span>
        </div>
        <div className="tw-card p-4">
          <span className="text-[11px] font-bold text-amber-600 uppercase">Sakit</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{sakit}</div>
          <span className="text-[10px] text-slate-400">Surat Dokter</span>
        </div>
        <div className="tw-card p-4 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-rose-600 uppercase">Alpa</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{alpa}</div>
          <span className="text-[10px] text-slate-400">Tanpa Keterangan</span>
        </div>
      </div>

      {/* Table */}
      <div className="tw-card p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4">Riwayat Presensi Saya</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                <th className="pb-3 px-3">Tanggal</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Keterangan</th>
                <th className="pb-3 px-3">Bukti Surat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myRecords.map((r) => {
                let badgeClass = 'badge-hadir';
                if (r.status === 'Izin') badgeClass = 'badge-izin';
                else if (r.status === 'Sakit') badgeClass = 'badge-sakit';
                else if (r.status === 'Alpa') badgeClass = 'badge-alpa';

                return (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-mono font-semibold">{r.date}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${badgeClass}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{r.notes || '-'}</td>
                    <td className="py-3 px-3">
                      {r.attachment_url ? (
                        <a href={r.attachment_url} target="_blank" rel="noreferrer" className="text-[#5d87ff] font-bold underline">
                          Lihat Dokumen
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL PENGAJUAN */}
      {showExcuseModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
            onClick={() => setShowExcuseModal(false)}
          />

          <div 
            className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-[460px] shadow-2xl z-10 border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[72px] h-[72px] rounded-full border-[3px] border-[#cbe8f7] flex items-center justify-center mx-auto mb-4 text-[#60c5f1]">
              <svg className="w-9 h-9 stroke-[#60c5f1]" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#444444] text-center mb-1">Pengajuan Izin / Sakit</h3>
            <p className="text-xs text-[#666666] text-center mb-5">Pengajuan akan langsung tercatat dan diverifikasi wali kelas.</p>

            <form onSubmit={handlePreSubmit} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block font-semibold text-[#555] mb-1">Tanggal Izin</label>
                <input 
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:bg-white focus:border-[#60c5f1]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#555] mb-1">Jenis Keterangan</label>
                <select 
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none"
                >
                  <option value="Izin">Izin (Keperluan Keluarga/Acara)</option>
                  <option value="Sakit">Sakit (Kondisi Kurang Sehat)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#555] mb-1">Alasan / Catatan</label>
                <textarea 
                  rows="3"
                  required
                  placeholder="Jelaskan alasan izin secara singkat..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:bg-white focus:border-[#60c5f1]"
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold text-[#555] mb-1">Link Foto Surat Dokter (Google Drive)</label>
                <input 
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={form.attachment_url}
                  onChange={(e) => setForm({ ...form, attachment_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:bg-white focus:border-[#60c5f1]"
                />
              </div>

              <div className="flex items-center justify-center gap-3 pt-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowExcuseModal(false)} 
                  className="px-6 py-2.5 rounded-lg bg-[#efefef] hover:bg-[#e4e4e4] text-[#444444] text-sm font-semibold transition min-w-[90px]"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-lg bg-[#60c5f1] hover:bg-[#4ab9ea] text-white text-sm font-semibold shadow-sm transition min-w-[90px]"
                >
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL UBAH DATA PRIBADI */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
            onClick={() => setShowEditProfileModal(false)}
          />

          <div 
            className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-[480px] shadow-2xl z-10 border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Ubah Data Pribadi</h3>
                <p className="text-xs text-slate-400 mt-0.5">Perbarui informasi profil Anda secara mandiri</p>
              </div>
              <button 
                onClick={() => setShowEditProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text"
                  required
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:bg-white focus:border-[#5d87ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NISN</label>
                  <input 
                    type="text"
                    required
                    value={profileForm.nisn}
                    onChange={(e) => setProfileForm({ ...profileForm, nisn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono outline-none focus:bg-white focus:border-[#5d87ff]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select 
                    value={profileForm.gender}
                    onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">No. Telepon / WA</label>
                <input 
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={profileForm.parent_phone}
                  onChange={(e) => setProfileForm({ ...profileForm, parent_phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono outline-none focus:bg-white focus:border-[#5d87ff]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Rumah</label>
                <textarea 
                  rows="3"
                  placeholder="Masukkan alamat lengkap tempat tinggal Anda..."
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:bg-white focus:border-[#5d87ff]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowEditProfileModal(false)} 
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition text-xs"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 rounded-xl bg-[#5d87ff] hover:bg-[#4570ea] text-white font-bold shadow-md shadow-blue-500/20 transition text-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SWEETALERT POP-UP: KONFIRMASI & SUKSES */}
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

export default StudentSelfView;
