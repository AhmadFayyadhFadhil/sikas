import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal } from './Modal';
import Button from './Button';

export const ConfirmDialog = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning' 
}) => {
  const variantStyles = {
    warning: 'text-amber-600',
    danger: 'text-red-600',
    info: 'text-blue-600'
  };

  const buttonVariants = {
    warning: 'bg-amber-600 hover:bg-amber-700',
    danger: 'bg-red-600 hover:bg-red-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <div className="flex gap-3 items-start">
        <AlertCircle className={`flex-shrink-0 mt-1 ${variantStyles[variant]}`} size={20} />
        <div className="flex-1">
          <p className="text-slate-700">{message}</p>
        </div>
      </div>
      
      <div className="flex gap-3 justify-end mt-6">
        <Button variant="secondary" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button 
          variant="primary" 
          className={buttonVariants[variant]}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
