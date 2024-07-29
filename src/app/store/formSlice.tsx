import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface Customer {
    id: string;
    name: string;
}
interface Shutter {
    id: string;
    name: string;
}
interface ShutterDetail{
    id: string;
    shutterName: string;
    width: number;
    height: number;
    area: number
}

interface FormDetails{
    personName: string;
    date: Date | null;
    selectedCustomer: Customer | null;
    shutters: Shutter[];
    customers: Customer[];
    shutterDetails: ShutterDetail[];
    discountType: 'Amount' | 'Percentage';
    discountValue: number;
    totalAmount: number;
}

const initialState: FormDetails = {
    personName: '',
    date: null,
    selectedCustomer: null,
    shutters: [],
    customers: [],
    shutterDetails: [],
    discountType: 'Amount',
    discountValue: 0,
    totalAmount: 0
}
export interface FormFields {
    personName: string;
    date: Date | null;
    selectedCustomer: string;
    shutterDetails: ShutterDetail[];
    discountType: 'Amount' | 'Percentage';
    discountValue: number;
  }

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers:{
        updaetePersonName: (state, action: PayloadAction<string>) =>{
            state.personName = action.payload
        },
        updateDate: (state, action: PayloadAction<Date|null>) => {
            state.date = action.payload
        },
        updateSelectedCustomer: (state, action:PayloadAction<Customer | null>) => {
            state.selectedCustomer = action.payload
        },
        addCustomer: (state, action: PayloadAction<Customer>) => {
            state.customers.push(action.payload)
        },
        addShutter: (state, action: PayloadAction<Shutter>) => {
            state.shutters.push(action.payload)
        },
        updateShutterDetails: (state, action: PayloadAction<ShutterDetail[]>) => {
            state.shutterDetails = action.payload
        },
        updateDiscountType: (state, action: PayloadAction<'Amount' | 'Percentage'>) => {
            state.discountType = action.payload
        },
        updateDiscountValue: (state, action: PayloadAction<number>) => {
            state.discountValue = action.payload
        },
        updateTotalAmount: (state, action: PayloadAction<number>)=>{
            state.totalAmount = action.payload
        }
        
    }
})

export const {updaetePersonName,updateDate,updateDiscountType,updateDiscountValue,updateSelectedCustomer,updateShutterDetails,updateTotalAmount,addCustomer,addShutter} = formSlice.actions;

export default formSlice.reducer;