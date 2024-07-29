import React from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps{
  selectedDate: Date | null;
  onChange: (date:Date | null) => void
}
const DatePickerComponent:React.FC<DatePickerProps> = ({selectedDate,onChange}) => {
  return (
    <DatePicker selected={selectedDate} onChange={onChange} dateFormat="yyyy/mm/dd"/>
  )
}

export default DatePickerComponent