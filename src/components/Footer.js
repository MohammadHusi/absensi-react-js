import React from 'react';

const Footer = ({ onOpenGuide }) => {
  return (
    <footer className="custom-footer">
      <div className="container">
        <div className="row g-4 justify-content-between">
          {/* School Brand & Bio */}
          <div className="col-12 col-lg-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="brand-icon-box" style={{ width: '38px', height: '38px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white fw-bold mb-0" style={{ fontSize: '1.1rem' }}>SMK NEGERI DIGITAL</h4>
                <small className="text-primary fw-semibold">Disiplin • Kompeten • Berkarakter</small>
              </div>
            </div>

            <p className="small text-secondary mb-3 pe-lg-4" style={{ lineHeight: '1.6' }}>
              Sistem Presensi & Absensi Terpadu Berbasis Digital untuk mewujudkan transparansi kehadiran, 
              efisiensi administrasi sekolah, dan penanaman budaya disiplin kerja industri bagi seluruh warga sekolah.
            </p>

            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-dark-subtle text-light border border-secondary px-2 py-1 small">
                ⭐ Terakreditasi A (Unggul)
              </span>
              <span className="badge bg-dark-subtle text-light border border-secondary px-2 py-1 small">
                🏢 SMK Pusat Keunggulan
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-lg-2">
            <h5 className="footer-heading">Navigasi</h5>
            <ul className="footer-links">
              <li><a href="#beranda">Beranda</a></li>
              <li><a href="#layanan">Pilihan Portal</a></li>
              <li><a href="#panduan" onClick={(e) => { e.preventDefault(); onOpenGuide(); }}>Buku Panduan</a></li>
              <li><a href="#jadwal">Jadwal Sekolah</a></li>
              <li><a href="#kontak">Bantuan Siswa</a></li>
            </ul>
          </div>

          {/* Jurusan / Keahlian */}
          <div className="col-6 col-lg-2">
            <h5 className="footer-heading">Kompetensi</h5>
            <ul className="footer-links">
              <li><a href="#rpl">Rekayasa Perangkat Lunak</a></li>
              <li><a href="#tkj">Teknik Jaringan Komputer</a></li>
              <li><a href="#dkv">Desain Komunikasi Visual</a></li>
              <li><a href="#tbsm">Teknik Sepeda Motor</a></li>
              <li><a href="#akl">Akuntansi & Keuangan</a></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="col-12 col-lg-3">
            <h5 className="footer-heading">Informasi Layanan</h5>
            <div className="small text-secondary d-flex flex-column gap-2">
              <div>
                <div className="text-white fw-semibold">Gedung Pelayanan Siswa:</div>
                <div>Jl. Pendidikan Kejuruan No. 45, Kota Pelajar</div>
              </div>
              <div>
                <div className="text-white fw-semibold">Hotline Presensi:</div>
                <div>+62 (021) 789-0123 / WA: 0812-3456-7890</div>
              </div>
              <div>
                <div className="text-white fw-semibold">Jam Operasional Server:</div>
                <div className="text-success fw-bold">Aktif 24 Jam Non-Stop</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="text-secondary small">
            © {new Date().getFullYear()} Sistem Presensi Digital SMK. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="text-secondary small d-flex gap-3">
            <span>Versi Sistem 2.4.0 (Enterprise)</span>
            <span>•</span>
            <span>Integrasi Dapodik Kemdikbudristek</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
