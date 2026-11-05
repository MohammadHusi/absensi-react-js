import React, { useState } from 'react';
import SweetAlertModal from './SweetAlertModal';

const SubjectsView = ({ subjects, teachers = [], onAddSubject, onEditSubject, onDeleteSubject }) => {
  const [search, setSearch] = useState('');
  const [formModalMode, setFormModalMode] = useState(null); // 'create' | 'edit' | null
  const [viewingSubject, setViewingSubject] = useState(null);
  const [alertConfig, setAlertConfig] = useState(null);

  const [form, setForm] = useState({
    id: '',
    name: '',
    teacher: '',
    academic_year: '2025/2026'
  });

  // Filter Mata Pelajaran
  const filteredSubjects = subjects.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.teacher?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateForm = () => {
    setForm({
      id: '',
      name: '',
      teacher: teachers[0]?.full_name || '',
      academic_year: '2025/2026'
    });
    setFormModalMode('create');
  };

  const openEditForm = (sb) => {
    setForm({
      id: sb.id,
      name: sb.name || '',
      teacher: sb.teacher || '',
      academic_year: sb.academic_year || '2025/2026'
    });
    setFormModalMode('edit');
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (formModalMode === 'create') {
      onAddSubject({
        id: 'MP-' + Math.floor(10 + Math.random() * 90),
        ...form
      });
      setFormModalMode(null);
      setAlertConfig({
        type: 'success',
        title: 'Berhasil!',
        message: 'Data mata pelajaran baru berhasil ditambahkan.',
        onConfirm: () => setAlertConfig(null)
      });
    } else if (formModalMode === 'edit') {
      onEditSubject(form);
      setFormModalMode(null);
      setAlertConfig({
        type: 'success',
        title: 'Berhasil!',
        message: 'Perubahan data mata pelajaran berhasil disimpan.',
        onConfirm: () => setAlertConfig(null)
      });
    }
  };

  const handlePreDelete = (sb) => {
    setAlertConfig({
      type: 'confirm',
      title: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus mata pelajaran "${sb.name}"?`,
      onConfirm: () => {
        onDeleteSubject(sb.id);
        setAlertConfig({
          type: 'success',
          title: 'Berhasil!',
          message: 'Data mata pelajaran berhasil dihapus.',
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
            <span>Data Master</span>
            <span>/</span>
            <span className="text-[#5d87ff] font-bold">Data Mapel</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Data Mata Pelajaran
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
          <span>Tambah Mapel Baru</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="tw-card p-6">
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <input 
              type="text"
              placeholder="Cari mapel atau guru pengampu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#5d87ff] outline-none"
            />
          </div>


        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                <th className="pb-3 px-3 w-12 text-center">No</th>
                <th className="pb-3 px-3">Nama Mata Pelajaran</th>
                <th className="pb-3 px-3">Guru Pengampu</th>
                <th className="pb-3 px-3">Tahun Ajaran</th>
                <th className="pb-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-400">
                    Tidak ada data mata pelajaran yang cocok.
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((sb, idx) => (
                  <tr key={sb.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 text-center text-slate-400 font-semibold">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{sb.name}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {sb.teacher || '-'}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                        {sb.academic_year || '2025/2026'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Tombol Lihat Detail */}
                        <button 
                          onClick={() => setViewingSubject(sb)}
                          className="px-2.5 py-1 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 font-bold transition flex items-center gap-1"
                          title="Lihat Detail Mapel"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>Detail</span>
                        </button>

                        {/* Tombol Edit */}
                        <button 
                          onClick={() => openEditForm(sb)}
                          className="px-2.5 py-1 rounded-lg text-[#5d87ff] bg-blue-50 hover:bg-blue-100 font-bold transition flex items-center gap-1"
                          title="Edit Data Mapel"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                          <span>Edit</span>
                        </button>

                        {/* Tombol Hapus */}
                        <button 
                          onClick={() => handlePreDelete(sb)}
                          className="px-2.5 py-1 rounded-lg text-rose-500 bg-rose-50 hover:bg-rose-100 font-bold transition flex items-center gap-1"
                          title="Hapus Data Mapel"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL: TAMBAH & EDIT MAPEL */}
      {formModalMode && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
            onClick={() => setFormModalMode(null)}
          />

          <div 
            className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-[480px] shadow-2xl z-10 border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[72px] h-[72px] rounded-full border-[3px] border-[#cbe8f7] flex items-center justify-center mx-auto mb-4 text-[#60c5f1]">
              <svg className="w-9 h-9 stroke-[#60c5f1]" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#444444] text-center mb-1">
              {formModalMode === 'create' ? 'Tambah Mata Pelajaran' : 'Edit Mata Pelajaran'}
            </h3>
            <p className="text-xs text-[#666666] text-center mb-5">
              {formModalMode === 'create' ? 'Masukkan kurikulum mata pelajaran dan guru pengampu' : `Memperbarui mata pelajaran: ${form.name}`}
            </p>

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block font-semibold text-[#555] mb-1">
                  Nama Mata Pelajaran
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Bisnis Digital & E-Commerce"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#555] mb-1">
                    Guru Pengampu
                  </label>
                  <select
                    value={form.teacher}
                    onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none"
                  >
                    <option value="">-- Pilih Guru --</option>
                    {teachers.map(tc => (
                      <option key={tc.id} value={tc.full_name}>
                        {tc.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#555] mb-1">
                    Tahun Ajaran
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: 2025/2026"
                    value={form.academic_year}
                    onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
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
                  className="px-6 py-2.5 rounded-lg bg-[#5d87ff] hover:bg-[#4570ea] text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition min-w-[90px]"
                >
                  {formModalMode === 'create' ? 'Simpan' : 'Perbarui'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL LIHAT DETAIL MAPEL */}
      {viewingSubject && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
            onClick={() => setViewingSubject(null)}
          />

          <div 
            className="relative bg-white rounded-3xl p-6 sm:p-7 w-full max-w-[480px] shadow-2xl z-10 border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Top Right */}
            <button 
              onClick={() => setViewingSubject(null)}
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
                Detail Data Mata Pelajaran
              </h3>
            </div>

            {/* Details List */}
            <div className="space-y-3 text-xs mb-6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Nama Mata Pelajaran</span>
                <span className="font-bold text-slate-800 text-sm">
                  {viewingSubject.name}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Guru Pengampu</span>
                <span className="font-bold text-[#5d87ff]">
                  {viewingSubject.teacher || '-'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Tahun Ajaran</span>
                <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {viewingSubject.academic_year || '2025/2026'}
                </span>
              </div>
            </div>

            {/* Action Buttons in Modal */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setViewingSubject(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition text-xs"
              >
                Tutup
              </button>
              <button 
                type="button" 
                onClick={() => {
                  const sb = viewingSubject;
                  setViewingSubject(null);
                  openEditForm(sb);
                }}
                className="px-4 py-2 rounded-xl bg-[#5d87ff] hover:bg-[#4570ea] text-white font-bold transition text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Edit Mapel Ini
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

export default SubjectsView;
