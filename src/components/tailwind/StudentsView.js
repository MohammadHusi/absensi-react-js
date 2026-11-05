import React, { useState } from 'react';
import SweetAlertModal from './SweetAlertModal';

// Helper untuk memisahkan Nama Kelas dan Kompetensi Keahlian
const parseClassAndMajor = (className, classObj = null) => {
  if (classObj?.major) {
    return {
      className: classObj.class_name,
      major: classObj.major
    };
  }
  if (!className) return { className: '-', major: 'Bisnis Digital' };
  const match = className.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return {
      className: match[1].trim(),
      major: match[2].trim()
    };
  }
  return {
    className: className,
    major: 'Bisnis Digital'
  };
};

const StudentsView = ({ students, classes, onAddStudent, onEditStudent, onDeleteStudent }) => {
  const [search, setSearch] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('');

  // Form modal state
  const [formModalMode, setFormModalMode] = useState(null); // 'create' | 'edit' | null
  
  // Delete Confirmation Modal state (HANYA UNTUK HAPUS)
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Detail Modal state
  const [viewingStudent, setViewingStudent] = useState(null);

  // Success Pop-up state (opsional setelah aksi)
  const [successMessage, setSuccessMessage] = useState(null);

  // Form values
  const [form, setForm] = useState({
    id: '',
    nisn: '',
    full_name: '',
    class_id: classes[0]?.id || 'CLS-01',
    gender: 'L',
    parent_phone: '',
    address: '',
    username: '',
    password: ''
  });

  const filteredStudents = students.filter(st => {
    const matchSearch = st.full_name.toLowerCase().includes(search.toLowerCase()) || st.nisn.includes(search);
    const matchClass = !selectedClassFilter || st.class_id === selectedClassFilter;
    return matchSearch && matchClass;
  });

  // Buka Form Tambah
  const openCreateForm = () => {
    setForm({
      id: '',
      nisn: '',
      full_name: '',
      class_id: classes[0]?.id || 'CLS-01',
      gender: 'L',
      parent_phone: '',
      address: '',
      username: '',
      password: '123'
    });
    setFormModalMode('create');
  };

  // Buka Form Edit
  const openEditForm = (st) => {
    setForm({
      id: st.id,
      nisn: st.nisn,
      full_name: st.full_name,
      class_id: st.class_id,
      gender: st.gender,
      parent_phone: st.parent_phone || '',
      address: st.address || '',
      username: st.username || st.nisn,
      password: st.password || '123'
    });
    setFormModalMode('edit');
  };

  // Simpan Form (Langsung simpan TANPA konfirmasi bertumpuk)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!form.nisn.trim() || !form.full_name.trim()) return;

    const payload = {
      ...form,
      username: form.username?.trim() || form.nisn.trim(),
      password: form.password?.trim() || '123'
    };

    if (formModalMode === 'create') {
      onAddStudent({
        id: 'STD-' + Math.floor(100 + Math.random() * 900),
        ...payload
      });
      setFormModalMode(null);
      setSuccessMessage('Data murid baru berhasil ditambahkan.');
    } else if (formModalMode === 'edit') {
      onEditStudent(payload);
      setFormModalMode(null);
      setSuccessMessage('Perubahan data murid berhasil disimpan.');
    }
  };

  // Eksekusi Hapus dari Pop-up Konfirmasi Hapus
  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeleteStudent(deleteTarget.id);
      setDeleteTarget(null);
      setSuccessMessage('Data murid berhasil dihapus.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <span>Data Master</span>
            <span>/</span>
            <span className="text-[#5d87ff] font-bold">Data Murid</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Data Induk Murid
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
          <span>Tambah Murid Baru</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="tw-card p-6">
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <input 
              type="text"
              placeholder="Cari nama atau NISN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#5d87ff] outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select 
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none"
            >
              <option value="">Semua Rombel Kelas</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.class_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                <th className="pb-3 px-3 w-12 text-center">No</th>
                <th className="pb-3 px-3">Nama</th>
                <th className="pb-3 px-3">NISN</th>
                <th className="pb-3 px-3">Kelas</th>
                <th className="pb-3 px-3">Kompetensi</th>
                <th className="pb-3 px-3">Jenis Kelamin</th>
                <th className="pb-3 px-3">No Telepon/WA</th>
                <th className="pb-3 px-3">Alamat Lengkap</th>
                <th className="pb-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-6 text-center text-slate-400">
                    Tidak ada data murid yang cocok.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, idx) => {
                  const cl = classes.find(c => c.id === st.class_id);
                  const { className: parsedClass, major: parsedMajor } = parseClassAndMajor(cl?.class_name || st.class_id, cl);
                  return (
                    <tr key={st.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 text-center text-slate-400 font-semibold">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800">{st.full_name}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-slate-600">
                        {st.nisn}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
                          {parsedClass}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-[#5d87ff] bg-blue-50 px-2.5 py-1 rounded-lg text-xs">
                          {parsedMajor}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          st.gender === 'L' ? 'bg-blue-50 text-[#5d87ff]' : 'bg-pink-50 text-pink-600'
                        }`}>
                          {st.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">
                        {st.parent_phone || '-'}
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate" title={st.address || '-'}>
                        {st.address || '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          
                          {/* Tombol Lihat Detail */}
                          <button 
                            onClick={() => setViewingStudent(st)}
                            className="px-2.5 py-1 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 font-bold transition flex items-center gap-1"
                            title="Lihat Detail Murid"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>Detail</span>
                          </button>

                          {/* Tombol Edit */}
                          <button 
                            onClick={() => openEditForm(st)}
                            className="px-2.5 py-1 rounded-lg text-[#5d87ff] bg-blue-50 hover:bg-blue-100 font-bold transition flex items-center gap-1"
                            title="Edit Data Murid"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            <span>Edit</span>
                          </button>

                          {/* Tombol Hapus -> Membuka Pop-Up Konfirmasi Hapus */}
                          <button 
                            onClick={() => setDeleteTarget(st)}
                            className="px-2.5 py-1 rounded-lg text-rose-500 bg-rose-50 hover:bg-rose-100 font-bold transition flex items-center gap-1"
                            title="Hapus Data Murid"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* ============================================================== */}
      {/* FORM MODAL: TAMBAH / EDIT SISWA (Langsung Simpan) */}
      {/* ============================================================== */}
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
            {/* Top Circle Icon */}
            <div className="w-[72px] h-[72px] rounded-full border-[3px] border-[#cbe8f7] flex items-center justify-center mx-auto mb-4 text-[#60c5f1]">
              <svg className="w-9 h-9 stroke-[#60c5f1]" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {formModalMode === 'create' ? (
                  <>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </>
                ) : (
                  <>
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </>
                )}
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#444444] text-center mb-1">
              {formModalMode === 'create' ? 'Tambah Data Murid' : 'Edit Data Murid'}
            </h3>
            <p className="text-xs text-[#666666] text-center mb-5">
              {formModalMode === 'create' ? 'Lengkapi data identitas murid baru di bawah ini' : `Perbarui data untuk murid: ${form.full_name}`}
            </p>

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs text-left">
              {/* 1. Nama */}
              <div>
                <label className="block font-semibold text-[#555] mb-1">
                  Nama Lengkap Murid
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Nama lengkap murid"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none"
                />
              </div>

              {/* 2. NISN */}
              <div>
                <label className="block font-semibold text-[#555] mb-1">
                  Nomor Induk Siswa Nasional (NISN)
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: 0061234567"
                  value={form.nisn}
                  onChange={(e) => {
                    const newNisn = e.target.value;
                    setForm(prev => ({
                      ...prev,
                      nisn: newNisn,
                      username: !prev.username || prev.username === prev.nisn ? newNisn : prev.username
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none"
                />
              </div>

              {/* 3 & 4. Kelas & Kompetensi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#555] mb-1">Kelas</label>
                  <select 
                    value={form.class_id}
                    onChange={(e) => setForm({ ...form, class_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.class_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#555] mb-1">Kompetensi</label>
                  <input 
                    type="text"
                    readOnly
                    value={(() => {
                      const selCl = classes.find(c => c.id === form.class_id) || classes[0];
                      return selCl?.major || parseClassAndMajor(selCl?.class_name, selCl).major || 'Bisnis Digital';
                    })()}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-600 outline-none cursor-default"
                  />
                </div>
              </div>

              {/* 5 & 6. Jenis Kelamin & No Telepon/WA */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#555] mb-1">Jenis Kelamin</label>
                  <select 
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#555] mb-1">No Telepon/WA</label>
                  <input 
                    type="text"
                    placeholder="08..."
                    value={form.parent_phone}
                    onChange={(e) => setForm({ ...form, parent_phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none"
                  />
                </div>
              </div>

              {/* 7. Alamat Lengkap */}
              <div>
                <label className="block font-semibold text-[#555] mb-1">Alamat Lengkap</label>
                <textarea 
                  rows="2"
                  placeholder="Contoh: Jl. Raya Palengaan No. 12, Pamekasan"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none resize-none"
                />
              </div>

              {/* 8. Akun Login Murid (Username & Password) */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-[#555] mb-1">Username Login</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: 0061234567"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#555] mb-1">Password</label>
                  <input 
                    type="text"
                    required
                    placeholder="Kata sandi murid"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons: Langsung Simpan / Batal */}
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

      {/* ============================================================== */}
      {/* MODAL LIHAT DETAIL SISWA */}
      {/* ============================================================== */}
      {viewingStudent && (() => {
        const cl = classes.find(c => c.id === viewingStudent.class_id);
        const { className: parsedClass, major: parsedMajor } = parseClassAndMajor(cl?.class_name || viewingStudent.class_id, cl);
        const rawPhone = viewingStudent.parent_phone?.replace(/\D/g, '') || '';
        const waNumber = rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : rawPhone;

        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity animate-in fade-in"
              onClick={() => setViewingStudent(null)}
            />

            <div 
              className="relative bg-white rounded-3xl p-6 sm:p-7 w-full max-w-[480px] shadow-2xl z-10 border border-slate-100 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button Top Right */}
              <button 
                onClick={() => setViewingStudent(null)}
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
                  Detail Data Murid
                </h3>
              </div>

              {/* Details List */}
              <div className="space-y-3 text-xs mb-6">
                
                {/* Nama */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Nama Lengkap Murid</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {viewingStudent.full_name}
                  </span>
                </div>

                {/* NISN */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Nomor Induk Siswa Nasional (NISN)</span>
                  <span className="font-mono font-bold text-slate-800 text-sm tracking-wider">
                    {viewingStudent.nisn}
                  </span>
                </div>

                {/* Kelas */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Kelas</span>
                  <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {parsedClass}
                  </span>
                </div>

                {/* Kompetensi */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Kompetensi</span>
                  <span className="font-bold text-[#5d87ff] bg-blue-50 px-2.5 py-1 rounded-lg">
                    {parsedMajor}
                  </span>
                </div>

                {/* Jenis Kelamin */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Jenis Kelamin</span>
                  <span className={`px-2.5 py-0.5 rounded-md font-bold text-xs ${
                    viewingStudent.gender === 'L' 
                      ? 'bg-blue-100/70 text-blue-700' 
                      : 'bg-pink-100/70 text-pink-700'
                  }`}>
                    {viewingStudent.gender === 'L' ? '♂ Laki-laki' : '♀ Perempuan'}
                  </span>
                </div>

                {/* Kontak Orang Tua */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">No Telepon/WA</span>
                    <span className="font-mono font-bold text-slate-800">
                      {viewingStudent.parent_phone || 'Belum terdaftar'}
                    </span>
                  </div>
                  {waNumber && (
                    <a
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-1.5 transition text-[11px]"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/>
                      </svg>
                      Hubungi Orang Tua via WhatsApp
                    </a>
                  )}
                </div>

                {/* Alamat Lengkap */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-500 font-medium">Alamat Lengkap</span>
                  <div className="font-semibold text-slate-700 text-xs leading-relaxed">
                    {viewingStudent.address || 'Alamat domisili belum dicatat'}
                  </div>
                </div>

                {/* Akun Login Murid */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Akun Login Portal (User / Pass)</span>
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    {viewingStudent.username || viewingStudent.nisn} / {viewingStudent.password || '123'}
                  </span>
                </div>

                {/* Lembaga / Sekolah */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Asal Satuan Pendidikan</span>
                  <span className="font-semibold text-slate-700">SMK Mawaddah Palengaan</span>
                </div>

              </div>

              {/* Action Buttons in Modal */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setViewingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition text-xs"
                >
                  Tutup
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    const st = viewingStudent;
                    setViewingStudent(null);
                    openEditForm(st);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#5d87ff] hover:bg-[#4570ea] text-white font-bold transition text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Edit Murid Ini
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ============================================================== */}
      {/* POP-UP KONFIRMASI HAPUS (HANYA MUNCUL SAAT KLIK HAPUS) */}
      {/* ============================================================== */}
      <SweetAlertModal 
        isOpen={Boolean(deleteTarget)}
        type="confirm"
        title="Konfirmasi Hapus"
        message="Apakah Anda ingin menghapus data ini?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* ============================================================== */}
      {/* POP-UP SUKSES */}
      {/* ============================================================== */}
      <SweetAlertModal 
        isOpen={Boolean(successMessage)}
        type="success"
        title="Berhasil!"
        message={successMessage}
        onConfirm={() => setSuccessMessage(null)}
      />

    </div>
  );
};

export default StudentsView;
