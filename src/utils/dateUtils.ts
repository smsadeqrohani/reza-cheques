import dayjs from 'dayjs';
import jalaliday from 'jalali-plugin-dayjs';
import 'dayjs/locale/fa';

// Extend dayjs with jalali plugin
dayjs.extend(jalaliday);

// Set Persian locale
dayjs.locale('fa');

// Set default calendar to Jalali
dayjs.calendar('jalali');

export interface JalaliDate {
  year: number;
  month: number;
  day: number;
}

/**
 * Format Jalali date to string (YYYY/MM/DD)
 */
export const formatJalaliDate = (date: dayjs.Dayjs): string => {
  return date.format('YYYY/MM/DD');
};

/**
 * Format Jalali date for display with Persian month names
 */
export const formatJalaliDateForDisplay = (date: dayjs.Dayjs): string => {
  return date.format('DD MMMM YYYY');
};

/**
 * Create a Jalali date object
 */
export const createJalaliDate = (year: number, month: number, day: number): dayjs.Dayjs => {
  return dayjs().year(year).month(month - 1).date(day);
};

/**
 * Add months to a Jalali date
 */
export const addMonthsToJalali = (date: dayjs.Dayjs, months: number): dayjs.Dayjs => {
  return date.add(months, 'month');
};

/**
 * Get first installment date (exactly one month after invoice date)
 */
export const getFirstInstallmentDate = (invoiceDate: dayjs.Dayjs): dayjs.Dayjs => {
  return addMonthsToJalali(invoiceDate, 1);
};

/**
 * Get installment date for a specific installment number
 */
export const getInstallmentDate = (invoiceDate: dayjs.Dayjs, installmentNumber: number): dayjs.Dayjs => {
  return addMonthsToJalali(invoiceDate, installmentNumber);
};

/**
 * Get current Jalali date
 */
export const getCurrentJalaliDate = (): dayjs.Dayjs => {
  return dayjs();
};

/**
 * Parse Jalali date string
 */
export const parseJalaliDate = (dateString: string): dayjs.Dayjs | null => {
  const date = dayjs(dateString, { jalali: true });
  return date.isValid() ? date : null;
};

/**
 * Validate Jalali date string
 */
export const isValidJalaliDate = (dateString: string): boolean => {
  return dayjs(dateString, { jalali: true }).isValid();
};

/**
 * Get days in month for Jalali calendar
 */
export const getDaysInJalaliMonth = (year: number, month: number): number => {
  return dayjs().year(year).month(month - 1).daysInMonth();
};

/**
 * Check if Jalali year is leap year
 */
export const isJalaliLeapYear = (year: number): boolean => {
  return dayjs().year(year).month(11).daysInMonth() === 30;
};

/**
 * Get first day of week for a Jalali month
 */
export const getFirstDayOfJalaliMonth = (year: number, month: number): number => {
  return dayjs().year(year).month(month - 1).date(1).day();
};

/**
 * Convert Gregorian date to Jalali
 */
export const gregorianToJalali = (gregorianDate: Date): dayjs.Dayjs => {
  return dayjs(gregorianDate).calendar('jalali');
};

/**
 * Convert Jalali date to Gregorian
 */
export const jalaliToGregorian = (jalaliDate: dayjs.Dayjs): Date => {
  return jalaliDate.calendar('gregory').toDate();
};

/**
 * Get Persian month names
 */
export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر',
  'دی', 'بهمن', 'اسفند'
];

/**
 * Get Persian week day names
 */
export const PERSIAN_WEEK_DAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

/**
 * Get Persian month name by index (1-12)
 */
export const getPersianMonthName = (monthIndex: number): string => {
  return PERSIAN_MONTHS[monthIndex - 1] || '';
};

/**
 * Get Persian week day name by index (0-6)
 */
export const getPersianWeekDayName = (dayIndex: number): string => {
  return PERSIAN_WEEK_DAYS[dayIndex] || '';
};

/**
 * Format Jalali date for display with Persian numbers
 */
export const formatJalaliDateWithPersianNumbers = (dateString: string): string => {
  if (!dateString) return '';
  
  const parts = dateString.split('/');
  if (parts.length !== 3) return '';
  
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) return '';
  
  // Convert to Persian numerals without separators
  const persianYear = year.toLocaleString('fa-IR', { useGrouping: false });
  const persianMonth = month.toLocaleString('fa-IR', { useGrouping: false }).padStart(2, '۰');
  const persianDay = day.toLocaleString('fa-IR', { useGrouping: false }).padStart(2, '۰');
  
  return `${persianYear}/${persianMonth}/${persianDay}`;
};
