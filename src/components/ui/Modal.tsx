'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-background rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800">
        {title && (
          <h2 className="text-2xl font-bold mb-4 text-foreground">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
