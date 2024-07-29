import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Button from './Button';
import Input from './Input';
import { addCustomer } from '../store/formSlice';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose }) => {
  const [customerName, setCustomerName] = useState('');
  const dispatch = useDispatch();

  const handleAddCustomer = () => {
    if (customerName.trim()) {
      dispatch(addCustomer({ id: Date.now().toString(), name: customerName }));
      setCustomerName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Customer</h2>
        <Input
         label='Customer'
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeHolder="Customer Name"
        />
        <Button onClick={handleAddCustomer}>Add</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

export default CustomerModal;
