import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Transaction } from '../types';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styles: [
  ],
  providers: [ DatePipe ]
})
export class AddTransactionComponent implements OnInit {

  transactionFormGroup: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    formBuilder: FormBuilder,
    private _dataService: DataService,
    private datePipe: DatePipe,
    private router: Router
  )
  {
    this.transactionFormGroup = formBuilder.group({
      date: ["", [Validators.required]],
      type: ["", [Validators.required]],
      description: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      status: ["", [Validators.required]],
    });

    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'YYYY-MM-DD'});
  }

  ngOnInit(): void {
  }

  save(){
    const formData = this.transactionFormGroup.value;
    formData.date = this.datePipe.transform(formData.date, 'yyyy-MM-dd');
    this._dataService.create(formData).subscribe((res:Transaction) => {
      this.router.navigate(['/list']);
    });
  }

}
