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

const ClassesView = ({ classes, onAddClass, onEditClass, onDeleteClass }) => {
  const [formModalMode, setFormModalMode] = useState(null); // 'create' | 'edit' | null
  const [alertConfig, setAlertConfig] = useState(null);

  const [form, setForm] = useState({ id: '', class_name: '', academic_year: '2025/2026' });

  const openCreateForm = () => {
    setForm({ id: '', class_name: '', academic_year: '2025/2026' });
    setFormModalMode('create');
  };

  const openEditForm = (cl) => {
    setForm({
      id: cl.id,
      class_name: cl.class_name,
      academic_year: cl.academic_year
    });
    setFormModalMode('edit');
  };

  // Simpan Form (Langsung simpan tanpa konfirmasi bertumpuk)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!form.class_name.trim()) return;

    if (formModalMode === 'create') {
      onAddClass({
        id: 'CLS-' + Math.floor(10 + Math.random() * 90),
        ...form
      });
      setFormModalMode(null);
      // Pop-up Sukses
      setAlertConfig({
        type: 'success',
        title: 'Berhasil!',
        message: 'Tahun ajaran baru berhasil ditambahkan.',
        onConfirm: () => setAlertConfig(null)
      });
    } else if (formModalMode === 'edit') {
      onEditClass(form);
      setFormModalMode(null);
      // Pop-up Sukses
      setAlertConfig({
        type: 'success',
        title: 'Berhasil!',
        message: 'Perubahan tahun ajaran berhasil disimpan.',
        onConfirm: () => setAlertConfig(null)
      });
    }
  };

  const handlePreDelete = (cl) => {
    setAlertConfig({
      type: 'confirm',
      title: 'Konfirmasi Hapus',
      message: 'Apakah Anda ingin menghapus data ini?',
      onConfirm: () => {
        onDeleteClass(cl.id);
        // Pop-up Sukses
        setAlertConfig({
          type: 'success',
          title: 'Berhasil!',
          message: 'Tahun ajaran berhasil dihapus.',
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
            <span className="text-[#5d87ff] font-bold">Tahun Ajaran</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Tahun Ajaran
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
          <span>Tambah Data Baru</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="tw-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                <th className="pb-3 px-3">Kode Kelas</th>
                <th className="pb-3 px-3">Kelas</th>
                <th className="pb-3 px-3">Kompetensi Keahlian</th>
                <th className="pb-3 px-3">Tahun Akademik</th>
                <th className="pb-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.map((cl) => {
                const { className: parsedClass, major: parsedMajor } = parseClassAndMajor(cl.class_name, cl);
                return (
                  <tr key={cl.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-[#5d87ff]">{cl.id}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{parsedClass}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#5d87ff] bg-blue-50 px-2.5 py-1 rounded-lg text-xs">
                        {parsedMajor}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{cl.academic_year}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => openEditForm(cl)}
                        className="px-2.5 py-1 rounded-lg text-[#5d87ff] bg-blue-50 hover:bg-blue-100 font-bold transition flex items-center gap-1"
                        title="Edit Rombel Kelas"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        <span>Edit</span>
                      </button>

                      <button 
                        onClick={() => handlePreDelete(cl)}
                        className="px-2.5 py-1 rounded-lg text-rose-500 bg-rose-50 hover:bg-rose-100 font-bold transition flex items-center gap-1"
                        title="Hapus Rombel Kelas"
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
            })}
          </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL: TAMBAH & EDIT KELAS */}
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
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#444444] text-center mb-1">
              {formModalMode === 'create' ? 'Tambah Tahun Ajaran' : 'Edit Tahun Ajaran'}
            </h3>
            <p className="text-xs text-[#666666] text-center mb-5">
              {formModalMode === 'create' ? 'Masukkan data kelas dan tahun ajaran' : `Memperbarui kelas: ${form.class_name}`}
            </p>

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block font-semibold text-[#555] mb-1">
                  Nama Kelas & Jurusan
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: X TKJ 2 (Teknik Jaringan)"
                  value={form.class_name}
                  onChange={(e) => setForm({ ...form, class_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#555] mb-1">
                  Tahun Akademik
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

export default ClassesView;
