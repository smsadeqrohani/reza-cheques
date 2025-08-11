import React from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DateObject from 'react-date-object';

interface PersianDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label: string;
  placeholder?: string;
}

export const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'انتخاب تاریخ'
}) => {
  const handleDateChange = (dateObject: DateObject | null) => {
    console.log('DatePicker onChange:', dateObject);
    if (dateObject) {
      // Format as YYYY/MM/DD for internal storage
      const year = dateObject.year;
      const month = String(dateObject.month.number).padStart(2, '0');
      const day = String(dateObject.day).padStart(2, '0');
      const formattedDate = `${year}/${month}/${day}`;
      console.log('Formatted date:', formattedDate);
      onChange(formattedDate);
    }
  };

  // Parse the value string to create a date object for the picker
  const parseValue = (dateString: string) => {
    console.log('parseValue input:', dateString);
    if (!dateString) return null;
    
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    
    // Create a proper DateObject that react-multi-date-picker expects
    const result = new DateObject({
      date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      calendar: persian,
      locale: persian_fa
    });
    console.log('parseValue result:', result);
    return result;
  };



  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <DatePicker
        value={parseValue(value)}
        onChange={handleDateChange}
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        format="YYYY/MM/DD"
        digits={["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]}
        placeholder={placeholder}
        inputClass="input-field cursor-pointer text-right"
        containerClassName="w-full"
        className="input-field cursor-pointer text-right"
      />
    </div>
  );
};
