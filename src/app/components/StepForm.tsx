import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { updateDate, updateDiscountType, updateDiscountValue, updateSelectedCustomer, updateShutterDetails, updateTotalAmount, updatePersonName } from '../store/formSlice';
import Button from './Button';
import Dropdown from './Dropdown';
import DatePickerComponent from './DatePickerComponent';
import Input from './Input';
import CustomerModal from './CustomerModal';
import ShutterModal from './ShutterModal';
import { FormFields } from '../store/formSlice';

const defaultValues: FormFields = {
    personName: '',
    date: null,
    selectedCustomer: '',
    shutterDetails: [{ id: Date.now().toString(), shutterName: '', width: 0, height: 0, area: 0 }],
    discountType: 'Amount',
    discountValue: 0,
};

const StepForm: React.FC = () => {
    const [step, setStep] = useState(0);
    const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
    const [isShutterModalOpen, setShutterModalOpen] = useState(false);
    const dispatch = useDispatch();
    const { register, handleSubmit, control, watch, setValue, getValues } = useForm<FormFields>({
        defaultValues
    });

    const formState = useSelector((state: RootState) => state.form);

    useEffect(() => {
        // Update total amount whenever shutterDetails or discount values change
        dispatch(updateTotalAmount(calculateTotalAmount()));
    }, [formState.shutterDetails, formState.discountValue, formState.discountType]);

    const onSubmit = (data: FormFields) => {
        dispatch(updatePersonName(data.personName));
        dispatch(updateDate(data.date));
        dispatch(updateSelectedCustomer(formState.customers.find(customer => customer.name === data.selectedCustomer) || null));
        dispatch(updateShutterDetails(formState.shutterDetails));
        dispatch(updateDiscountType(data.discountType));
        dispatch(updateDiscountValue(data.discountValue));
        dispatch(updateTotalAmount(calculateTotalAmount()));
    };

    const calculateArea = (width: number, height: number) => width * height;
    const calculateTotalArea = () => formState.shutterDetails.reduce((acc, detail) => acc + detail.area, 0);
    const calculateTotalAmount = () => {
        let amount = calculateTotalArea();
        if (formState.discountType === 'Amount') {
            amount -= formState.discountValue;
        } else {
            amount -= amount * (formState.discountValue / 100);
        }
        return amount;
    };

    const handleAddShutter = () => {
        const newShutter = {
            id: Date.now().toString(),
            shutterName: '',
            width: 0,
            height: 0,
            area: 0
        };
        dispatch(updateShutterDetails([...formState.shutterDetails, newShutter]));
    };

    const handleRemoveShutter = (id: string) => {
        const filteredShutters = formState.shutterDetails.filter(shutter => shutter.id !== id);
        dispatch(updateShutterDetails(filteredShutters));
    };

    const handleCloneShutter = (id: string) => {
        const shutterToClone = formState.shutterDetails.find(shutter => shutter.id === id);
        if (shutterToClone) {
            dispatch(updateShutterDetails([...formState.shutterDetails, { ...shutterToClone, id: Date.now().toString() }]));
        }
    };

    const handleWidthChange = (index: number, value: number) => {
        const height = parseFloat(getValues(`shutterDetails.${index}.height`)) || 0;
        const area = calculateArea(value, height);

        // Update width, height, and area in the form state
        setValue(`shutterDetails.${index}.width`, value, { shouldValidate: true });
        setValue(`shutterDetails.${index}.area`, area, { shouldValidate: true });

        dispatch(updateShutterDetails([...formState.shutterDetails]));
        dispatch(updateTotalAmount(calculateTotalAmount()));
    };

    const handleHeightChange = (index: number, value: number) => {
        const width = parseFloat(getValues(`shutterDetails.${index}.width`)) ||0;
        const area = calculateArea(width, value);

        // Update height, width, and area in the form state
        setValue(`shutterDetails.${index}.height`, value, { shouldValidate: true });
        setValue(`shutterDetails.${index}.area`, area, { shouldValidate: true });

        dispatch(updateShutterDetails([...formState.shutterDetails]));
        dispatch(updateTotalAmount(calculateTotalAmount()));
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {step === 0 && (
                    <div>
                        <h2>General Details</h2>
                        <Controller
                            name="personName"
                            control={control}
                            render={({ field }) => <Input label='Person Name' {...field} placeholder="Person Name" />}
                        />
                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <DatePickerComponent
                                    selectedDate={field.value}
                                    onChange={date => setValue('date', date)}
                                />
                            )}
                        />
                        <Controller
                            name="selectedCustomer"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Dropdown
                                        options={formState.customers.map(customer => ({
                                            value: customer.name,
                                            label: customer.name,
                                        }))}
                                        value={field.value}
                                        onChange={e => setValue('selectedCustomer', e.target.value)}
                                    />
                                    <Button onClick={() => setCustomerModalOpen(true)}>Add Customer</Button>
                                </>
                            )}
                        />
                        <Button type="button" onClick={() => setStep(1)}>Next</Button>
                    </div>
                )}

                {step === 1 && (
                    <div>
                        <h2>Shutter Details</h2>
                        {formState.shutterDetails.map((shutter, index) => (
                            <div key={shutter.id}>
                                {index > 0 && (
                                    <Button onClick={() => handleRemoveShutter(shutter.id)}>Remove</Button>
                                )}
                                <Controller
                                    name={`shutterDetails.${index}.shutterName`}
                                    control={control}
                                    render={({ field }) => <Input {...field} placeholder='Shutter Name' label='Shutter Name' />}
                                />
                                <Controller
                                    name={`shutterDetails.${index}.width`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            label='Width'
                                            {...field}
                                            type="number"
                                            placeholder='Width'
                                            onChange={e => handleWidthChange(index, parseFloat(e.target.value))}
                                        />
                                    )}
                                />
                                <Controller
                                    name={`shutterDetails.${index}.height`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            label='Height'
                                            {...field}
                                            type="number"
                                            placeholder="Height"
                                            onChange={e => handleHeightChange(index, parseFloat(e.target.value))}
                                        />
                                    )}
                                />
                                <span>Area: {shutter.area}</span>
                                <Button type="button" onClick={() => handleCloneShutter(shutter.id)}>Clone</Button>
                            </div>
                        ))}
                        <Button type="button" onClick={handleAddShutter}>Add Shutter</Button>
                        <div>Total Area: {calculateTotalArea()}</div>
                        <Button type="button" onClick={() => setStep(2)}>Next</Button>
                    </div>
                )}

                {step === 2 && (
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
                                    label='Discount Value'
                                    {...field}
                                    type="number"
                                    placeholder="Discount Value"
                                />
                            )}
                        />
                        <div>Total Amount: {calculateTotalAmount()}</div>
                        <Button type="submit">Submit</Button>
                    </div>
                )}
            </form>
            <CustomerModal
                isOpen={isCustomerModalOpen}
                onClose={() => setCustomerModalOpen(false)}
            />
                        <ShutterModal
                isOpen={isShutterModalOpen}
                onClose={() => setShutterModalOpen(false)}
            />
        </div>
    );
};

export default StepForm;

