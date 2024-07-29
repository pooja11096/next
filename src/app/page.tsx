'use client'

import Image from "next/image";
import StepForm from "./components/StepForm";
import { Provider } from "react-redux";
import { store } from "./store/store";

export default function Home() {
  return (
    <Provider store={store}>
      <>
      <StepForm personName={""} date={null} selectedCustomer={""} shutterName={""} width={0} height={0} discountType={"Amount"} discountValue={0}/>
      </>
    </Provider>   
  );
}
