import React, { useState } from 'react';

const DashboardOverview = ({ 
  students, 
  teachers, 
  classes, 
  attendanceRecords, 
  onNavigate 
}) => {
  const [selectedMonth, setSelectedMonth] = useState('Oktober 2026');

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRecords = attendanceRecords.filter(r => r.date === todayStr);
  const hadirCount = todayRecords.filter(r => r.status === 'Hadir').length;
  const izinCount = todayRecords.filter(r => r.status === 'Izin').length;
  const sakitCount = todayRecords.filter(r => r.status === 'Sakit').length;
  const alpaCount = todayRecords.filter(r => r.status === 'Alpa').length;
  const totalToday = todayRecords.length;
  const attendanceRate = totalToday > 0 ? Math.round((hadirCount / totalToday) * 100) : 98;

  // Weekly Attendance Mock Data for Bar Chart
  const weeklyData = [
    { day: 'Senin', hadir: 98, izin: 1, sakit: 1, alpa: 0 },
    { day: 'Selasa', hadir: 97, izin: 2, sakit: 1, alpa: 0 },
    { day: 'Rabu', hadir: 99, izin: 1, sakit: 0, alpa: 0 },
    { day: 'Kamis', hadir: 96, izin: 2, sakit: 1, alpa: 1 },
    { day: 'Jumat', hadir: 99, izin: 1, sakit: 0, alpa: 0 },
    { day: 'Sabtu', hadir: 98, izin: 1, sakit: 1, alpa: 0 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#5d87ff] font-bold">Dashboard</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Dashboard Absensi
          </h1>
        </div>

      </div>

      {/* 4 Stat Summary Cards (TailwindAdmin Next.js Signature Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Tingkat Kehadiran */}
        <div className="tw-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tingkat Kehadiran
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#5d87ff] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-800">{attendanceRate}%</h3>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              +1.8% vs kemarin
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Rata-rata kehadiran seluruh rombel
          </p>
        </div>

        {/* Card 2: Murid Hadir */}
        <div className="tw-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Murid Hadir Hari Ini
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#13deb9] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-800">{hadirCount} / {students.length}</h3>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Tepat Waktu
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Dari total {students.length} murid aktif
          </p>
        </div>

        {/* Card 3: Guru Mengajar */}
        <div className="tw-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pendidik & Tendik
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-800">{teachers.length} / {teachers.length}</h3>
            <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              100% Hadir
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Seluruh guru aktif mengampu KBM
          </p>
        </div>

        {/* Card 4: Izin & Sakit */}
        <div className="tw-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Izin / Sakit
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#ffae1f] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-800">{izinCount + sakitCount} Murid</h3>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Terverifikasi
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            {izinCount} Izin resmi, {sakitCount} Sakit
          </p>
        </div>

      </div>

      {/* Middle Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Weekly Attendance Bar Chart (2 cols) */}
        <div className="tw-card p-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Grafik Tren Kehadiran Mingguan
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Statistik persentase kehadiran murid hari Senin hingga Sabtu
              </p>
            </div>

            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-600 outline-none"
            >
              <option value="Oktober 2026">Oktober 2026</option>
              <option value="September 2026">September 2026</option>
              <option value="Agustus 2026">Agustus 2026</option>
            </select>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-4 pb-2 px-2 border-b border-slate-100">
            {weeklyData.map((d, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                {/* Tooltip on hover */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded font-mono shadow-sm">
                  {d.hadir}%
                </span>
                
                {/* Visual Bar with Gradient */}
                <div 
                  className="w-full max-w-[48px] bg-gradient-to-t from-[#5d87ff] to-[#49beff] rounded-t-xl group-hover:brightness-110 transition-all cursor-pointer relative"
                  style={{ height: `${d.hadir}%` }}
                >
                  <div className="absolute top-2 left-0 right-0 text-center text-[10px] font-bold text-white/90">
                    {d.hadir}%
                  </div>
                </div>

                {/* Day Label */}
                <span className="text-xs font-semibold text-slate-500 mt-1">
                  {d.day}
                </span>
              </div>
            ))}
          </div>

          {/* Legend and Summary */}
          <div className="flex items-center justify-between pt-4 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#5d87ff]"></span>
                <span className="text-slate-600 font-medium">Hadir Tepat Waktu</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ffae1f]"></span>
                <span className="text-slate-600 font-medium">Izin & Sakit</span>
              </div>
            </div>

            <span className="text-slate-400 font-medium">Target Sekolah: &gt; 95%</span>
          </div>
        </div>

        {/* Right Column: Today's Distribution (Donut Breakdown) */}
        <div className="tw-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">
                Komposisi Hari Ini
              </h3>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {todayStr}
              </span>
            </div>

            {/* Circular Rate Indicator */}
            <div className="text-center py-4">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle cx="72" cy="72" r="58" stroke="#f1f5f9" strokeWidth="14" fill="transparent" />
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="58" 
                    stroke="#5d87ff" 
                    strokeWidth="14" 
                    fill="transparent" 
                    strokeDasharray="364.4" 
                    strokeDashoffset={364.4 - (364.4 * attendanceRate) / 100}
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-3xl font-black text-slate-800">{attendanceRate}%</div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Hadir</span>
                </div>
              </div>
            </div>

            {/* List breakdown pills */}
            <div className="space-y-2.5 mt-2">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
                <div className="flex items-center gap-2 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#13deb9]"></span>
                  <span>Hadir Tepat Waktu</span>
                </div>
                <span className="font-bold">{hadirCount} Murid</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-blue-50 text-blue-800">
                <div className="flex items-center gap-2 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5d87ff]"></span>
                  <span>Izin Resmi</span>
                </div>
                <span className="font-bold">{izinCount} Murid</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-amber-50 text-amber-800">
                <div className="flex items-center gap-2 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffae1f]"></span>
                  <span>Sakit (Surat Dokter)</span>
                </div>
                <span className="font-bold">{sakitCount} Murid</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-rose-50 text-rose-800">
                <div className="flex items-center gap-2 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fa896b]"></span>
                  <span>Alpa / Tanpa Keterangan</span>
                </div>
                <span className="font-bold">{alpaCount} Murid</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('input-absen')}
            className="w-full mt-4 py-2 text-xs font-bold text-[#5d87ff] bg-blue-50 hover:bg-blue-100 rounded-xl transition text-center"
          >
            Buka Lembar Presensi Kelas →
          </button>
        </div>

      </div>

      {/* Bottom Section: Recent Activity & Top Jurusan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Attendance Activity Table (2 cols) */}
        <div className="tw-card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Aktivitas Presensi Terbaru
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daftar verifikasi presensi yang masuk ke sistem
              </p>
            </div>

            <button 
              onClick={() => onNavigate('rekap')}
              className="text-xs font-bold text-[#5d87ff] hover:underline"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                  <th className="pb-3">Murid</th>
                  <th className="pb-3">Kelas</th>
                  <th className="pb-3">Tanggal</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceRecords.slice(0, 6).map((rec) => {
                  const st = students.find(s => s.id === rec.student_id);
                  const cl = classes.find(c => c.id === rec.class_id);

                  let badgeClass = 'badge-hadir';
                  if (rec.status === 'Izin') badgeClass = 'badge-izin';
                  else if (rec.status === 'Sakit') badgeClass = 'badge-sakit';
                  else if (rec.status === 'Alpa') badgeClass = 'badge-alpa';

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-[#5d87ff] font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {(st?.full_name || rec.student_name || 'S').charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{st?.full_name || rec.student_name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">NISN: {st?.nisn || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-semibold text-slate-600">
                        {cl?.class_name?.split(' ')[0] || rec.class_id}
                      </td>
                      <td className="py-3 pr-4 font-mono text-slate-500">
                        {rec.date}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${badgeClass}`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 truncate max-w-[140px]">
                        {rec.notes || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Ranking Kehadiran Jurusan */}
        <div className="tw-card p-6">
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Persentase Per Rombel
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Tingkat kedisiplinan per kompetensi keahlian
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">X (Kelas 10)-A</span>
                <span className="text-[#5d87ff]">99.2%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-[#5d87ff] h-2 rounded-full" style={{ width: '99.2%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">XI (Kelas 11)-A</span>
                <span className="text-[#13deb9]">98.5%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-[#13deb9] h-2 rounded-full" style={{ width: '98.5%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">XII (Kelas 12)-A</span>
                <span className="text-[#ffae1f]">96.8%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-[#ffae1f] h-2 rounded-full" style={{ width: '96.8%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100/60 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">SMK Pusat Keunggulan</div>
                <div className="text-[11px] text-slate-500">Mawaddah Palengaan</div>
              </div>
              <span className="text-[11px] font-bold bg-[#5d87ff] text-white px-2.5 py-1 rounded-xl">
                Akreditasi A
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardOverview;
