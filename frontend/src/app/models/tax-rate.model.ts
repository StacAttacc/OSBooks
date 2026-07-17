export interface BracketDto {
  upperBound: number | null;
  rate: number;
}

export interface TaxRateSet {
  id: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  qppExemption: number;
  qppYmpe: number;
  qppYampe: number;
  qppBaseRate: number;
  qppAdditionalTier1Rate: number;
  qppTier1Rate: number;
  qppTier2Rate: number;
  qppTier1MaxEmployee: number;
  qppTier2MaxEmployee: number;
  eiEmployeeRate: number;
  eiEmployerMultiplier: number;
  eiMaxInsurableEarnings: number;
  eiMaxEmployeePremium: number;
  qpipEmployeeRate: number;
  qpipEmployerRate: number;
  qpipMaxInsurableEarnings: number;
  qpipMaxEmployeePremium: number;
  qpipMaxEmployerPremium: number;
  federalBasicPersonalAmount: number;
  federalEmploymentAmount: number;
  federalLowestRate: number;
  quebecFederalAbatement: number;
  quebecBasicPersonalAmount: number;
  quebecWorkerDeductionMax: number;
  quebecWorkerDeductionRate: number;
  quebecLowestRate: number;
  fssqSmallEmployerRate: number;
  fssqLargeEmployerRate: number;
  federalBrackets: BracketDto[];
  quebecBrackets: BracketDto[];
}

export type TaxRateSetBody = Omit<TaxRateSet, 'id'>;
