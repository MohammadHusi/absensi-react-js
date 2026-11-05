import React, { useState } from 'react';

const RekapView = ({ classes, students, attendanceRecords }) => {
  const [filterClass, setFilterClass] = useState('');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10));

  const filtered = attendanceRecords.filter(r => {
    const matchC = !filterClass || r.class_id === filterClass;
    const matchD = !filterDate || r.date === filterDate;
    return matchC && matchD;
  });

  const exportCsv = () => {
    if (filtered.length === 0) {
      alert('Tidak ada data yang sesuai filter untuk diekspor.');
      return;
    }
    let csv = 'ID,Tanggal,Kelas,NISN,Nama Murid,Status,Catatan\n';
    filtered.forEach(r => {
      const st = students.find(s => s.id === r.student_id);
      const cl = classes.find(c => c.id === r.class_id);
      csv += `"${r.id}","${r.date}","${cl?.class_name || r.class_id}","${st?.nisn || '-'}","${st?.full_name || r.student_name}","${r.status}","${r.notes || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Presensi_Mawaddah_${filterDate || 'all'}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <span>Laporan & Analisis</span>
            <span>/</span>
            <span className="text-[#5d87ff] font-bold">Rekapitulasi Presensi</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Rekapitulasi & Ekspor Laporan
          </h1>
        </div>

        <button 
          onClick={exportCsv}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center gap-2"
        >
          <span>📥 Ekspor ke Excel (.CSV)</span>
        </button>
      </div>

      {/* Filter Card */}
      <div className="tw-card p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Filter Kelas</label>
            <select 
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
            >
              <option value="">Semua Rombel Kelas</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.class_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Filter Tanggal</label>
            <input 
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
            />
          </div>

          <div className="flex items-end">
            <button 
              onClick={() => { setFilterClass(''); setFilterDate(''); }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="tw-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                <th className="pb-3 px-3">Tanggal</th>
                <th className="pb-3 px-3">Kelas</th>
                <th className="pb-3 px-3">NISN</th>
                <th className="pb-3 px-3">Nama Murid</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Tidak ada catatan presensi yang sesuai kriteria filter.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const st = students.find(s => s.id === r.student_id);
                  const cl = classes.find(c => c.id === r.class_id);

                  let badgeClass = 'badge-hadir';
                  if (r.status === 'Izin') badgeClass = 'badge-izin';
                  else if (r.status === 'Sakit') badgeClass = 'badge-sakit';
                  else if (r.status === 'Alpa') badgeClass = 'badge-alpa';

                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-mono font-semibold text-slate-600">{r.date}</td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{cl?.class_name?.split(' ')[0] || r.class_id}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{st?.nisn || '-'}</td>
                      <td className="py-3 px-3 font-bold text-slate-800">{st?.full_name || r.student_name}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${badgeClass}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{r.notes || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default RekapView;
