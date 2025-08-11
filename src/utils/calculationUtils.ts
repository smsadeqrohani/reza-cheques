export interface InstallmentRow {
  installmentNumber: number;
  dueDate: string;
  installmentAmount: number;
  interestAmount: number;
  principalAmount: number;
  remainingBalance: number;
}

export interface CalculationResult {
  summary: {
    invoiceNumber: string;
    customerName: string;
    invoiceDate: string;
    totalAmount: number;
    downPayment: number;
    principalAmount: number;
    annualRate: number;
    monthlyRate: number;
    numberOfInstallments: number;
    totalInterest: number;
    totalPayment: number;
  };
  installments: InstallmentRow[];
}

export const calculateInstallments = (
  invoiceNumber: string,
  customerName: string,
  invoiceDate: string,
  totalAmount: number,
  downPayment: number,
  numberOfInstallments: number,
  annualRate: number
): CalculationResult | null => {
  // Validation
  if (downPayment > totalAmount) {
    return null;
  }

  const principalAmount = totalAmount - downPayment;
  if (principalAmount <= 0) {
    return null;
  }

  if (numberOfInstallments < 1) {
    return null;
  }

  const monthlyRate = annualRate / 12 / 100; // Convert percentage to decimal

  // Calculate fixed installment amount using annuity formula
  let installmentAmount: number;
  
  if (monthlyRate === 0) {
    // If no interest, equal principal payments
    installmentAmount = principalAmount / numberOfInstallments;
  } else {
    // Annuity formula: A = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const numerator = principalAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfInstallments);
    const denominator = Math.pow(1 + monthlyRate, numberOfInstallments) - 1;
    installmentAmount = numerator / denominator;
  }

  // Keep original calculation for internal use
  const originalInstallmentAmount = installmentAmount;
  
  // Round to nearest 100,000 Rials for display
  installmentAmount = roundToNearestHundredThousand(installmentAmount);

  // Calculate installments with original amount for internal calculations
  const installments: InstallmentRow[] = [];
  let remainingBalance = principalAmount;
  let totalRoundedInstallments = 0;

  for (let i = 1; i <= numberOfInstallments; i++) {
    const interestAmount = Math.round(remainingBalance * monthlyRate);
    let principalAmountForThisMonth = originalInstallmentAmount - interestAmount;
    
    // Adjust for rounding in last installment
    if (i === numberOfInstallments) {
      principalAmountForThisMonth = remainingBalance;
    }
    
    remainingBalance = Math.max(0, remainingBalance - principalAmountForThisMonth);
    
    // Round the installment amount for display
    const roundedInstallmentAmount = roundToNearestHundredThousand(originalInstallmentAmount);
    totalRoundedInstallments += roundedInstallmentAmount;
    
    installments.push({
      installmentNumber: i,
      dueDate: '', // Will be filled by date calculation
      installmentAmount: roundedInstallmentAmount,
      interestAmount,
      principalAmount: principalAmountForThisMonth,
      remainingBalance
    });
    

  }

  // Calculate total interest based on rounded installments
  const totalRoundedInterest = totalRoundedInstallments - principalAmount;
  
  return {
    summary: {
      invoiceNumber,
      customerName,
      invoiceDate,
      totalAmount,
      downPayment,
      principalAmount,
      annualRate,
      monthlyRate: monthlyRate * 100, // Convert back to percentage
      numberOfInstallments,
      totalInterest: totalRoundedInterest,
      totalPayment: totalRoundedInstallments
    },
    installments
  };
};

export const formatCurrency = (amount: number): string => {
  // Format with Persian numerals and 3-digit separators
  const formattedNumber = new Intl.NumberFormat('fa-IR').format(amount);
  
  return formattedNumber + ' ریال';
};

export const formatPercentage = (percentage: number): string => {
  return percentage.toFixed(2) + '%';
};

// Helper function to round to nearest 100,000 Rials
export const roundToNearestHundredThousand = (amount: number): number => {
  // Round to nearest 100,000
  const roundedAmount = Math.round(amount / 100000) * 100000;
  return roundedAmount;
};
