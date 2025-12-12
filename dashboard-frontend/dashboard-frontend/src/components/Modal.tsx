import React from 'react';

interface ModalProps {
  title?: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg p-6">
        {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
