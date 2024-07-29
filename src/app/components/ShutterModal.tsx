import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from './Button';
import Input from './Input';
import { addCustomer } from '../store/formSlice';

interface ShutterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShutterModal: React.FC<ShutterModalProps> = ({ isOpen, onClose }) => {
  const [shutterName, setShutterName] = useState('');
  const dispatch = useDispatch();

  const handleAddShutter = () => {
    if (shutterName.trim()) {
      dispatch(addCustomer({ id: Date.now().toString(), name: shutterName })); // Adjust according to actual action
      setShutterName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Shutter</h2>
        <Input
          label='Shutter'
          value={shutterName}
          onChange={(e) => setShutterName(e.target.value)}
          placeHolder="Shutter Name"
        />
        <Button onClick={handleAddShutter}>Add</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

export default ShutterModal;
