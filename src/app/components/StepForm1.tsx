import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// You'll need to create these action creators
import { saveFormData,FormData } from '../redux/action';
import { AppDispatch } from '../store/store';

const StepForm1: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customers, setCustomers] = useState<string[]>([]);
  const [shutters, setShutters] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      personName: '',
      date: new Date(),
      customer: '',
      shutterDetails: [{ name: '', width: 0, height: 0, area: 0 }],
      discountType: 'amount',
      discountValue: 0,
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "shutterDetails"
  });

  const watchShutterDetails = watch("shutterDetails");
  const watchDiscountType = watch("discountType");
  const watchDiscountValue = watch("discountValue");

  // Calculate total area
  const totalArea = watchShutterDetails.reduce((sum, detail) => sum + detail.area, 0);

  // Calculate total amount with discount
  const calculateTotalAmount = () => {
    const baseAmount = totalArea * 100; // Assuming $100 per unit area
    if (watchDiscountType === 'amount') {
      return baseAmount - watchDiscountValue;
    } else {
      return baseAmount - (baseAmount * watchDiscountValue / 100);
    }
  };

  const onSubmit = (data: any ) => {
    dispatch(saveFormData(data));
    // Here you would typically navigate to the table view
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const addCustomer = (name: string) => {
    setCustomers([...customers, name]);
  };

  const addShutter = (name: string) => {
    setShutters([...shutters, name]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {currentStep === 1 && (
        <div>
          <h2>General Details</h2>
          <input {...register("personName")} placeholder="Person Name" />
          <DatePicker
            selected={watch("date")}
            onChange={(date: Date) => setValue("date", date)}
          />
          <select {...register("customer")}>
            {customers.map((customer, index) => (
              <option key={index} value={customer}>{customer}</option>
            ))}
          </select>
          <button type="button" onClick={() => addCustomer(prompt("Enter customer name") || "")}>
            Add Customer
          </button>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h2>Shutter Details</h2>
          {fields.map((field, index) => (
            <div key={field.id}>
              <select {...register(`shutterDetails.${index}.name`)}>
                {shutters.map((shutter, i) => (
                  <option key={i} value={shutter}>{shutter}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                {...register(`shutterDetails.${index}.width`, { valueAsNumber: true })}
                placeholder="Width"
              />
              <input
                type="number"
                step="0.01"
                {...register(`shutterDetails.${index}.height`, { valueAsNumber: true })}
                placeholder="Height"
              />
              <input
                type="number"
                step="0.01"
                {...register(`shutterDetails.${index}.area`, { valueAsNumber: true })}
                value={watchShutterDetails[index]?.width * watchShutterDetails[index]?.height}
                readOnly
              />
              {index > 0 && (
                <button type="button" onClick={() => remove(index)}>Remove</button>
              )}
              <button type="button" onClick={() => append({ name: '', width: 0, height: 0, area: 0 })}>
                Add
              </button>
              <button type="button" onClick={() => append({ ...watchShutterDetails[index] })}>
                Clone
              </button>
            </div>
          ))}
          <div>Total Area: {totalArea}</div>
          <button type="button" onClick={() => addShutter(prompt("Enter shutter name") || "")}>
            Add Shutter
          </button>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h2>Discount</h2>
          <div>
            <input
              type="radio"
              {...register("discountType")}
              value="amount"
              id="amount"
            />
            <label htmlFor="amount">Amount</label>
          </div>
          <div>
            <input
              type="radio"
              {...register("discountType")}
              value="percentage"
              id="percentage"
            />
            <label htmlFor="percentage">Percentage</label>
          </div>
          <input
            type="number"
            {...register("discountValue", { valueAsNumber: true })}
            placeholder="Discount value"
          />
          <div>Total Amount: {calculateTotalAmount()}</div>
        </div>
      )}

      {currentStep > 1 && <button type="button" onClick={prevStep}>Previous</button>}
      {currentStep < 3 ? (
        <button type="button" onClick={nextStep}>Next</button>
      ) : (
        <button type="submit">Submit</button>
      )}
    </form>
  );
};

export default StepForm1;