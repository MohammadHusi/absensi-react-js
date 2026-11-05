import React from 'react';

const ConfirmDeleteModal = ({ isOpen, title = "Konfirmasi Hapus", message = "Apakah Anda ingin menghapus data ini?", onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Dark semi-transparent backdrop */}
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity animate-in fade-in"
        onClick={onCancel}
      />

      {/* Modal Dialog Card (Exact replica of the provided image) */}
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-[420px] p-8 text-center z-10 animate-in zoom-in-95 duration-200 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Circular Info Icon (Exact SweetAlert / Info style from screenshot) */}
        <div className="w-[88px] h-[88px] rounded-full border-[3px] border-[#cbe8f7] flex items-center justify-center mx-auto mb-6 text-[#7cd1f9]">
          <svg className="w-12 h-12 stroke-[#7cd1f9]" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="8" x2="12" y2="8.01" strokeWidth="3" />
            <line x1="12" y1="12" x2="12" y2="16" strokeWidth="2.2" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-[22px] font-bold text-[#444444] mb-2 tracking-tight">
          {title}
        </h3>

        {/* Question text */}
        <p className="text-sm sm:text-[15px] text-[#666666] mb-8 font-normal leading-relaxed">
          {message}
        </p>

        {/* Buttons (Batal & Ya) */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg bg-[#efefef] hover:bg-[#e4e4e4] text-[#444444] text-sm font-semibold transition active:scale-95 min-w-[90px]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-lg bg-[#60c5f1] hover:bg-[#4ab9ea] text-white text-sm font-semibold shadow-sm transition active:scale-95 min-w-[90px]"
          >
            Ya
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
