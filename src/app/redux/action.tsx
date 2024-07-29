// src/redux/actions.ts

export const SAVE_FORM_DATA = 'SAVE_FORM_DATA';

export interface FormData {
  personName: string;
  date: Date;
  customer: string;
  shutterDetails: {
    name: string;
    width: number;
    height: number;
    area: number;
  }[];
  discountType: 'amount' | 'percentage';
  discountValue: number;
  totalAmount: number;
}

export interface SaveFormDataAction {
  type: typeof SAVE_FORM_DATA;
  payload: FormData;
}

export const saveFormData = (data: FormData): SaveFormDataAction => ({
  type: SAVE_FORM_DATA,
  payload: data,
});

export type FormActionTypes = SaveFormDataAction;