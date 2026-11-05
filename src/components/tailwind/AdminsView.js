import React, { useState } from 'react';
import SweetAlertModal from './SweetAlertModal';

const AdminsView = ({ admins, onAddAdmin, onEditAdmin, onDeleteAdmin }) => {
  const [search, setSearch] = useState('');
  const [formModalMode, setFormModalMode] = useState(null); // 'create' | 'edit' | null
  const [alertConfig, setAlertConfig] = useState(null);

  const [form, setForm] = useState({
    id: '',
    username: '',
    full_name: '',
    role: 'Super Admin',
    email: '',
    phone: '',
    password: ''
  });

  const filteredAdmins = admins.filter(a => {
    return (
      a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.phone?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const openCreateForm = () => {
    setForm({
      id: '',
      username: '',
      full_name: '',
      role: 'Super Admin',
      email: '',
      phone: '',
      password: ''
    });
    setFormModalMode('create');
  };

  const openEditForm = (adm) => {
    setForm({
      id: adm.id,
      username: adm.username,
      full_name: adm.full_name,
      role: adm.role || 'Super Admin',
      email: adm.email || '',
      phone: adm.phone || '',
      password: adm.password || 'admin'
    });
    setFormModalMode('edit');
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.full_name.trim()) return;

    if (formModalMode === 'create') {
      onAddAdmin({
        id: 'ADM-' + Math.floor(100 + Math.random() * 900),
        ...form,
        password: form.password || 'admin'
      });
      setFormModalMode(null);
      setAlertConfig({
        type: 'success',
        title: 'Berhasil!',
        message: 'Data admin baru berhasil ditambahkan.',
        onConfirm: () => setAlertConfig(null)
      });
    } else if (formModalMode === 'edit') {
      onEditAdmin(form);
      setFormModalMode(null);
      setAlertConfig({
        type: 'success',
        title: 'Berhasil!',
        message: 'Perubahan data admin berhasil disimpan.',
        onConfirm: () => setAlertConfig(null)
      });
    }
  };

  const handlePreDelete = (adm) => {
    setAlertConfig({
      type: 'confirm',
      title: 'Konfirmasi Hapus',
      message: `Apakah Anda ingin menghapus admin ${adm.full_name}?`,
      onConfirm: () => {
        onDeleteAdmin(adm.id);
        setAlertConfig({
          type: 'success',
          title: 'Berhasil!',
          message: 'Data admin berhasil dihapus.',
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
            <span className="text-[#5d87ff] font-bold">Data Admin</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Data Administrator Sistem
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
          <span>Tambah Admin Baru</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="tw-card p-6">
        
        {/* Search */}
        <div className="flex items-center gap-2 max-w-md mb-5">
          <input 
            type="text"
            placeholder="Cari nama admin atau no telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#5d87ff] outline-none"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                <th className="pb-3 px-3 w-12 text-center">No</th>
                <th className="pb-3 px-3">Nama Lengkap</th>
                <th className="pb-3 px-3">No Telepon/WA</th>
                <th className="pb-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-400">
                    Tidak ada data admin yang cocok.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((adm, idx) => (
                  <tr key={adm.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 text-center text-slate-400 font-semibold">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800">{adm.full_name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 font-medium">
                      {adm.phone || '-'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => openEditForm(adm)}
                          className="px-2.5 py-1 rounded-lg text-[#5d87ff] bg-blue-50 hover:bg-blue-100 font-bold transition flex items-center gap-1"
                          title="Edit Admin"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                          <span>Edit</span>
                        </button>

                        <button 
                          onClick={() => handlePreDelete(adm)}
                          className="px-2.5 py-1 rounded-lg text-rose-500 bg-rose-50 hover:bg-rose-100 font-bold transition flex items-center gap-1"
                          title="Hapus Admin"
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

      {/* MODAL: TAMBAH & EDIT ADMIN */}
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#444444] text-center mb-1">
              {formModalMode === 'create' ? 'Tambah Data Admin' : 'Edit Data Admin'}
            </h3>
            <p className="text-xs text-[#666666] text-center mb-5">
              {formModalMode === 'create' ? 'Lengkapi data identitas admin baru' : `Memperbarui akun: ${form.full_name}`}
            </p>

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block font-semibold text-[#555] mb-1">Nama Lengkap Admin</label>
                <input 
                  type="text"
                  required
                  placeholder="Nama lengkap admin"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#555] mb-1">Username Login</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: admin.tu"
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
                    placeholder="Kata sandi admin"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#555] mb-1">No Telepon/WA</label>
                <input 
                  type="text"
                  placeholder="08..."
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:border-[#60c5f1] outline-none"
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

      {/* SWEETALERT POP-UP */}
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

export default AdminsView;
