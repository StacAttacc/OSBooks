export interface CalcResult {
  grossPay: number;
  qppTier1: number;
  qppTier2: number;
  eiPremium: number;
  qpipPremium: number;
  federalIncomeTax: number;
  quebecIncomeTax: number;
  totalEmployeeDeductions: number;
  netPay: number;
  employerQppTier1: number;
  employerQppTier2: number;
  employerEi: number;
  employerQpip: number;
  employerFssq: number;
  totalEmployerContributions: number;
}
