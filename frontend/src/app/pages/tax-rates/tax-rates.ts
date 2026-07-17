import { Component, inject, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, DatePipe, PercentPipe } from '@angular/common';
import { Modal } from '../../components/modal/modal';
import { TaxRateSet, TaxRateSetBody, BracketDto } from '../../models/tax-rate.model';

@Component({
  selector: 'app-tax-rates',
  imports: [FormsModule, DecimalPipe, DatePipe, PercentPipe, Modal],
  templateUrl: './tax-rates.html',
  styleUrl: './tax-rates.css',
})
export class TaxRates implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  rates = signal<TaxRateSet[]>([]);
  showModal = signal(false);
  submitting = signal(false);
  editingId = signal<number | null>(null);

  draft: TaxRateSetBody = emptyDraft();

  ngOnInit() { this.load(); }

  load() {
    this.http.get<TaxRateSet[]>('/api/tax-rates').subscribe(data =>
      this.rates.set([...data].sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom)))
    );
  }

  openAdd() {
    const latest = this.rates()[0];
    this.draft = latest
      ? { ...latest, effectiveFrom: '', effectiveTo: null,
          federalBrackets: latest.federalBrackets.map(b => ({ ...b })),
          quebecBrackets: latest.quebecBrackets.map(b => ({ ...b })) }
      : emptyDraft();
    this.editingId.set(null);
    this.showModal.set(true);
  }

  openEdit(r: TaxRateSet) {
    this.draft = { ...r,
      federalBrackets: r.federalBrackets.map(b => ({ ...b })),
      quebecBrackets: r.quebecBrackets.map(b => ({ ...b })) };
    this.editingId.set(r.id);
    this.showModal.set(true);
  }

  close() { this.showModal.set(false); }

  save() {
    const body = { ...this.draft, effectiveTo: this.draft.effectiveTo || null };
    this.submitting.set(true);
    const id = this.editingId();
    const req = id
      ? this.http.put<TaxRateSet>(`/api/tax-rates/${id}`, body)
      : this.http.post<TaxRateSet>('/api/tax-rates', body);
    req.subscribe({
      next: () => { this.submitting.set(false); this.close(); this.load(); },
      error: () => { this.submitting.set(false); },
    });
  }

  addFederalBracket() {
    this.draft.federalBrackets = [...this.draft.federalBrackets, { upperBound: null, rate: 0 }];
    this.cdr.markForCheck();
  }
  removeFederalBracket(i: number) {
    this.draft.federalBrackets = this.draft.federalBrackets.filter((_, j) => j !== i);
    this.cdr.markForCheck();
  }
  addQuebecBracket() {
    this.draft.quebecBrackets = [...this.draft.quebecBrackets, { upperBound: null, rate: 0 }];
    this.cdr.markForCheck();
  }
  removeQuebecBracket(i: number) {
    this.draft.quebecBrackets = this.draft.quebecBrackets.filter((_, j) => j !== i);
    this.cdr.markForCheck();
  }
}

function emptyDraft(): TaxRateSetBody {
  return {
    effectiveFrom: '', effectiveTo: null,
    qppExemption: 0, qppYmpe: 0, qppYampe: 0,
    qppBaseRate: 0, qppAdditionalTier1Rate: 0, qppTier1Rate: 0, qppTier2Rate: 0,
    qppTier1MaxEmployee: 0, qppTier2MaxEmployee: 0,
    eiEmployeeRate: 0, eiEmployerMultiplier: 0, eiMaxInsurableEarnings: 0, eiMaxEmployeePremium: 0,
    qpipEmployeeRate: 0, qpipEmployerRate: 0, qpipMaxInsurableEarnings: 0,
    qpipMaxEmployeePremium: 0, qpipMaxEmployerPremium: 0,
    federalBasicPersonalAmount: 0, federalEmploymentAmount: 0,
    federalLowestRate: 0, quebecFederalAbatement: 0,
    quebecBasicPersonalAmount: 0, quebecWorkerDeductionMax: 0,
    quebecWorkerDeductionRate: 0, quebecLowestRate: 0,
    fssqSmallEmployerRate: 0, fssqLargeEmployerRate: 0,
    federalBrackets: [], quebecBrackets: [],
  };
}
