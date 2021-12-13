import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

//Data Service
import {DataService} from '../data.service';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Transaction } from '../types';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styles: [
  ],
  providers: [ DatePipe ]
})
export class TransactionListComponent implements OnInit {

  transactions:Transaction[];
  transaction: Transaction;

  modalRef: BsModalRef;
  modalRef2: BsModalRef;

  itemToDeleteId: number;
  itemToEditId: number;

  @ViewChild('template',  { static: false }) modalTemplate: TemplateRef<any>;
  @ViewChild('confirmTemplate',  { static: false }) confirmModalTemplate: TemplateRef<any>;

  transactionFormGroup: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private _dataService: DataService, private _modalService: BsModalService, formBuilder: FormBuilder, private datePipe: DatePipe) {
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
    this._dataService.getAll().subscribe((res:Transaction[]) => {
      this.transactions = res;
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this._modalService.show(template);
  }

  handleRowClick(event: any, transaction: Transaction){
    if(event.target.tagName.toLowerCase() == 'td'){

      this.transaction = transaction;

      this.transactionFormGroup.setValue({
        date: transaction.date,
        type: transaction.type,
        description: transaction.description,
        amount: transaction.amount,
        status: transaction.status
      });

      this.itemToEditId = this.transaction.id;
      this.openModal(this.modalTemplate);
    }
  }

  edit(transaction: Transaction) {
      this.transaction = transaction;

      this.transactionFormGroup.setValue({
        date: transaction.date,
        type: transaction.type,
        description: transaction.description,
        amount: transaction.amount,
        status: transaction.status
      });

      this.itemToEditId = this.transaction.id;
      this.openModal(this.modalTemplate);
  }

  update(id: number) {
    const formData = this.transactionFormGroup.value;
    formData.date = this.datePipe.transform(formData.date, 'yyyy-MM-dd');
    this.transaction.date = formData.date;
    this.transaction.type = formData.type;
    this.transaction.description = formData.description;
    this.transaction.amount = formData.amount;
    this.transaction.status = formData.status;

    this._dataService.update(id, this.transaction).subscribe((res: Transaction) => {
    });

    this.modalRef.hide();
  }

  openConfirmModal(template: TemplateRef<any>) {
    this.modalRef2 = this._modalService.show(template);
  }

  delete(id: number) {
    this.itemToDeleteId = id;
    this.openConfirmModal(this.confirmModalTemplate);
  }

  confirmDelete(doDelete: boolean){
    if(doDelete){
      this._dataService.delete(this.itemToDeleteId).subscribe((res: any) => {
      })
    }

    this.modalRef2.hide();
  }
}
