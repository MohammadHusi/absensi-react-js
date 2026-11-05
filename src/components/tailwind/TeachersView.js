import React, { useState } from 'react';
import SweetAlertModal from './SweetAlertModal';

const TeachersView = ({ teachers, onAddTeacher, onEditTeacher, onDeleteTeacher }) => {
  const [formModalMode, setFormModalMode] = useState(null); // 'create' | 'edit' | null
  const [alertConfig, setAlertConfig] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);

  const [form, setForm] = useState({ id: '', nip: '', full_name: '', subject: '', gender: 'L' });

  const openCreateForm = () => {
    setForm({ id: '', nip: '', full_name: '', subject: '', gender: 'L' });
    setFormModalMode('create');
  };

  const openEditForm = (tc) => {
    setForm({
      id: tc.id,
      nip: tc.nip,
      full_name: tc.full_name,
      subject: tc.subject,
      gender: tc.gender || 'L'
    });
    setFormModalMode('edit');
  };

  // Simpan Form (Langsung simpan tanpa konfirmasi bertumpuk)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!form.nip.trim() || !form.full_name.trim()) return;

    if (formModalMode === 'create') {
      onAddTeacher({
        id: 'TCH-' + Math.floor(100 + Math.random() * 900),
        ...form
      });
      setFormModalMode(null);
      // Pop-up Sukses
      setAlertConfig({
        type: 'success',
        title: 'Berhasil!',
        message: 'Data guru pengajar berhasil ditambahkan.',
        onConfirm: () => setAlertConfig(null)
      });
    } else if (formModalMode === 'edit') {
      onEditTeacher(form);
      setFormModalMode(null);
      // Pop-up Sukses
      setAlertConfig({
        type: 'success',
        title: 'Berhasil!',
        message: 'Perubahan data guru berhasil disimpan.',
        onConfirm: () => setAlertConfig(null)
      });
    }
  };

  const handlePreDelete = (tc) => {
    setAlertConfig({
      type: 'confirm',
      title: 'Konfirmasi Hapus',
      message: 'Apakah Anda ingin menghapus data ini?',
      onConfirm: () => {
        onDeleteTeacher(tc.id);
        // Pop-up Sukses
        setAlertConfig({
          type: 'success',
          title: 'Berhasil!',
          message: 'Data guru berhasil dihapus.',
          onConfirm: () => setAlertConfig(null)
        });
      },
      onCancel: () => setAlertConfig(null)
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <span>Data Master</span>
            <span>/</span>
            <span className="text-[#5d87ff] font-bold">Data Guru</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Dewan Guru Pengajar
          </h1>
        </div>

        <button 
          onClick={openCreateForm}
          className="px-4 py-2 bg-[#5d87ff] hover:bg-[#4570ea] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>Tambah Guru Baru</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="tw-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                <th className="pb-3 px-3 w-12 text-center">No</th>
                <th className="pb-3 px-3">Nama Guru</th>
                <th className="pb-3 px-3">NIP / NUPTK</th>
                <th className="pb-3 px-3">Jenis Kelamin</th>
                <th className="pb-3 px-3">Mata Pelajaran</th>
                <th className="pb-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.map((tc, index) => (
                <tr key={tc.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 text-center text-slate-400 font-semibold">
                    {index + 1}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800">{tc.full_name}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-600">{tc.nip}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      tc.gender === 'P' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-[#5d87ff]'
                    }`}>
                      {tc.gender === 'P' ? 'Perempuan' : 'Laki-laki'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-blue-50 text-[#5d87ff] px-2.5 py-1 rounded-lg font-bold text-[11px]">
                      {tc.subject}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => setViewingTeacher(tc)}
                        className="px-2.5 py-1 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 font-bold transition flex items-center gap-1"
                        title="Lihat Detail Guru"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Detail</span>
                      </button>

                      <button 
                        onClick={() => openEditForm(tc)}
                        className="px-2.5 py-1 rounded-lg text-[#5d87ff] bg-blue-50 hover:bg-blue-100 font-bold transition flex items-center gap-1"
                        title="Edit Data Guru"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        <span>Edit</span>
                      </button>

                      <button 
                        onClick={() => handlePreDelete(tc)}
                        className="px-2.5 py-1 rounded-lg text-rose-500 bg-rose-50 hover:bg-rose-100 font-bold transition flex items-center gap-1"
                        title="Hapus Data Guru"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        <span>Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL: TAMBAH & EDIT GURU */}
      {formModalMode && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
            onClick={() => setFormModalMode(null)}
          />

          <div 
            className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-[460px] shadow-2xl z-10 border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[72px] h-[72px] rounded-full border-[3px] border-[#cbe8f7] flex items-center justify-center mx-auto mb-4 text-[#60c5f1]">
              <svg className="w-9 h-9 stroke-[#60c5f1]" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#444444] text-center mb-1">
              {formModalMode === 'create' ? 'Tambah Guru Pengajar' : 'Edit Data Guru'}
            </h3>
            <p className="text-xs text-[#666666] text-center mb-5">
              {formModalMode === 'create' ? 'Masukkan data identitas guru pengampu KBM' : `Memperbarui data pengajar: ${form.full_name}`}
            </p>

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block font-semibold text-[#555] mb-1">
                  NIP / NUPTK
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: 198501122010011003"
                  value={form.nip}
                  onChange={(e) => setForm({ ...form, nip: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#555] mb-1">
                  Nama Guru Lengkap & Gelar
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Baihaqi, S.Pd"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#555] mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#555] mb-1">
                    Mata Pelajaran
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Pemrograman Web"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => setFormModalMode(null)}
                  className="px-6 py-2.5 rounded-lg bg-[#efefef] hover:bg-[#e4e4e4] text-[#444444] text-sm font-semibold transition min-w-[90px]"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-lg bg-[#60c5f1] hover:bg-[#4ab9ea] text-white text-sm font-semibold shadow-sm transition min-w-[90px]"
                >
                  {formModalMode === 'create' ? 'Simpan' : 'Perbarui'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL LIHAT DETAIL GURU */}
      {viewingTeacher && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity animate-in fade-in"
            onClick={() => setViewingTeacher(null)}
          />

          <div 
            className="relative bg-white rounded-3xl p-6 sm:p-7 w-full max-w-[480px] shadow-2xl z-10 border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Top Right */}
            <button 
              onClick={() => setViewingTeacher(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition"
              title="Tutup"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            {/* Header Modal */}
            <div className="mb-5 pb-3 border-b border-slate-100 pr-8">
              <h3 className="text-lg font-bold text-slate-800">
                Detail Data Guru
              </h3>
            </div>

            {/* Details List */}
            <div className="space-y-3 text-xs mb-6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Nama Lengkap Guru</span>
                <span className="font-bold text-slate-800 text-sm">
                  {viewingTeacher.full_name}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">NIP / NUPTK</span>
                <span className="font-mono font-bold text-slate-800 text-sm tracking-wider">
                  {viewingTeacher.nip}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Jenis Kelamin</span>
                <span className={`px-2.5 py-0.5 rounded-md font-bold text-xs ${
                  viewingTeacher.gender === 'P'
                    ? 'bg-pink-100/70 text-pink-700'
                    : 'bg-blue-100/70 text-blue-700'
                }`}>
                  {viewingTeacher.gender === 'P' ? '♀ Perempuan' : '♂ Laki-laki'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Mata Pelajaran</span>
                <span className="font-bold text-[#5d87ff] bg-blue-50 px-2.5 py-1 rounded-lg">
                  {viewingTeacher.subject}
                </span>
              </div>


            </div>

            {/* Action Buttons in Modal */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setViewingTeacher(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition text-xs"
              >
                Tutup
              </button>
              <button 
                type="button" 
                onClick={() => {
                  const tc = viewingTeacher;
                  setViewingTeacher(null);
                  openEditForm(tc);
                }}
                className="px-4 py-2 rounded-xl bg-[#5d87ff] hover:bg-[#4570ea] text-white font-bold transition text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Edit Guru Ini
              </button>
            </div>

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

export default TeachersView;
