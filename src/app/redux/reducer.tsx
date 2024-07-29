// src/redux/reducer.ts

import { SAVE_FORM_DATA, FormData, FormActionTypes } from './action';

interface FormState {
  formData: FormData[];
}

const initialState: FormState = {
  formData: [],
};

const formReducer = (state = initialState, action: FormActionTypes): FormState => {
  switch (action.type) {
    case SAVE_FORM_DATA:
      return {
        ...state,
        formData: [...state.formData, action.payload],
      };
    default:
      return state;
  }
};

export default formReducer;