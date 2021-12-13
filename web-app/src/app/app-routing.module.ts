import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTransactionComponent } from './transaction/add-transaction.component';
import { TransactionListComponent } from './transaction/transaction-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: TransactionListComponent,
    data: {
      title: 'To-do List'
    }
  },
  {
    path: 'add',
    component: AddTransactionComponent,
    data: {
      title: 'Add To-do Item'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
