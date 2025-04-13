'use client';
import React from 'react';

export default function Dialog({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-4 text-xl font-bold text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
