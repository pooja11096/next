import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  updaetePersonName,
  updateDate,
  updateSelectedCustomer,
  updateShutterDetails,
  updateDiscountType,
  updateDiscountValue,
} from '../store/formSlice';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import DatePickerComponent from '../components/DatePickerComponent';
import Input from '../components/Input';
import Modal from '../components/Modal'; // Assume you have a modal component

const StepForm: React.FC = () => {
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.form);
  const { control, handleSubmit, setValue, getValues, watch } = useForm({
    defaultValues: formState,
  });

  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [isShutterModalOpen, setShutterModalOpen] = useState(false);

  const calculateArea = (width: number, height: number) => width * height;
  const calculateTotalArea = () => formState.shutterDetails.reduce((acc, detail) => acc + detail.area, 0);

  const handleWidthChange = (index: number, value: number) => {
    const height = parseFloat(getValues(`shutterDetails.${index}.height`))  || 0;
    const area = calculateArea(value, height);
    setValue(`shutterDetails.${index}.width`, value, { shouldValidate: true });
    setValue(`shutterDetails.${index}.area`, area, { shouldValidate: true });
    dispatch(updateShutterDetails([...formState.shutterDetails]));
  };

  const handleHeightChange = (index: number, value: number) => {
    const width = parseFloat(getValues(`shutterDetails.${index}.width`)) || 0;
    const area = calculateArea(width, value);
    setValue(`shutterDetails.${index}.height`, value, { shouldValidate: true });
    setValue(`shutterDetails.${index}.area`, area, { shouldValidate: true });
    dispatch(updateShutterDetails([...formState.shutterDetails]));
  };

  const calculateTotalAmount = () => {
    let amount = calculateTotalArea();
    if (formState.discountType === 'Amount') {
      amount -= formState.discountValue;
    } else {
      amount -= amount * (formState.discountValue / 100);
    }
    return amount;
  };

  const onSubmit = (data: any) => {
    dispatch(updatePersonName(data.personName));
    dispatch(updateDate(data.date));
    dispatch(updateSelectedCustomer(data.selectedCustomer));
    dispatch(updateShutterDetails(data.shutterDetails));
    dispatch(updateDiscountType(data.discountType));
    dispatch(updateDiscountValue(data.discountValue));
    // Dispatch action to save or submit the form data
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Section 1: General Details */}
        <div>
          <h2>General Details</h2>
          <Controller
            name="personName"
            control={control}
            render={({ field }) => <Input label="Person Name" {...field} placeholder="Person Name" />}
          />
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePickerComponent
                selectedDate={field.value}
                onChange={(date) => setValue('date', date)}
              />
            )}
          />
          <Controller
            name="selectedCustomer"
            control={control}
            render={({ field }) => (
              <>
                <Dropdown
                  options={formState.customers.map((customer) => ({
                    value: customer.name,
                    label: customer.name,
                  }))}
                  value={field.value}
                  onChange={(e) => setValue('selectedCustomer', e.target.value)}
                />
                <Button type="button" onClick={() => setCustomerModalOpen(true)}>Add Customer</Button>
              </>
            )}
          />
        </div>

        {/* Section 2: Shutter Details */}
        <div>
          <h2>Shutter Details</h2>
          {formState.shutterDetails.map((shutter, index) => (
            <div key={shutter.id}>
              {index > 0 && (
                <Button type="button" onClick={() => {
                  const updatedShutters = formState.shutterDetails.filter((_, i) => i !== index);
                  dispatch(updateShutterDetails(updatedShutters));
                }}>
                  Remove
                </Button>
              )}
              <Controller
                name={`shutterDetails.${index}.shutterName`}
                control={control}
                render={({ field }) => <Dropdown
                  options={formState.shutterNames.map(name => ({ value: name, label: name }))}
                  value={field.value}
                  onChange={e => setValue(`shutterDetails.${index}.shutterName`, e.target.value)}
                />}
              />
              <Controller
                name={`shutterDetails.${index}.width`}
                control={control}
                render={({ field }) => (
                  <Input
                    label="Width"
                    type="number"
                    {...field}
                    onChange={(e) => handleWidthChange(index, parseFloat(e.target.value))}
                  />
                )}
              />
              <Controller
                name={`shutterDetails.${index}.height`}
                control={control}
                render={({ field }) => (
                  <Input
                    label="Height"
                    type="number"
                    {...field}
                    onChange={(e) => handleHeightChange(index, parseFloat(e.target.value))}
                  />
                )}
              />
              <span>Area: {shutter.area}</span>
              <Button type="button" onClick={() => {
                const shutterToClone = formState.shutterDetails.find(s => s.id === shutter.id);
                if (shutterToClone) {
                  const clonedShutter = { ...shutterToClone, id: Date.now().toString() };
                  dispatch(updateShutterDetails([...formState.shutterDetails, clonedShutter]));
                }
              }}>
                Clone
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => {
            const newShutter = {
              id: Date.now().toString(),
              shutterName: '',
              width: 0,
              height: 0,
              area: 0,
            };
            dispatch(updateShutterDetails([...formState.shutterDetails, newShutter]));
          }}>
            Add Shutter
          </Button>
          <div>Total Area: {calculateTotalArea()}</div>
        </div>

        {/* Section 3: Discount */}
        <div>
          <h2>Discount</h2>
          <Controller
            name="discountType"
            control={control}
            render={({ field }) => (
              <>
                <label>
                  <input
                    type="radio"
                    value="Amount"
                    checked={field.value === 'Amount'}
                    onChange={() => setValue('discountType', 'Amount')}
                  />
                  Amount
                </label>
                <label>
                  <input
                    type="radio"
                    value="Percentage"
                    checked={field.value === 'Percentage'}
                    onChange={() => setValue('discountType', 'Percentage')}
                  />
                  Percentage
                </label>
              </>
            )}
          />
          <Controller
            name="discountValue"
            control={control}
            render={({ field }) => (
              <Input
                label="Discount Value"
                type="number"
                {...field}
                placeholder="Discount Value"
              />
            )}
          />
          <div>Total Amount: {calculateTotalAmount()}</div>
        </div>

        {/* Submit Button */}
        <Button type="submit">Submit</Button>
      </form>

      {/* Modals for Adding Customer and Shutter */}
      <Modal
        isOpen={isCustomerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        title="Add Customer"
        onSubmit={(customerName) => {
          // Logic to add customer
          // Update formState.customers
          setCustomerModalOpen(false);
        }}
      >
        {/* Form fields for adding customer */}
      </Modal>
      <Modal
        isOpen={isShutterModalOpen}
        onClose={() => setShutterModalOpen(false)}
        title="Add Shutter"
        onSubmit={(shutterName) => {
          // Logic to add shutter
          // Update formState.shutterNames
          setShutterModalOpen(false);
        }}
      >
        {/* Form fields for adding shutter */}
      </Modal>
    </div>
  );
};

export default StepForm;
