import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-receipt-popup',
  templateUrl: './receipt-popup.component.html',
  styleUrls: ['./receipt-popup.component.scss']
})
export class ReceiptPopupComponent implements OnInit {
  content = '';

  constructor(public dialogRef: MatDialogRef<ReceiptPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getReceipt(details): void {
    this.content += 'MyStore - Receipt: ' + '\r\n\r\n';
    details.myCart.map(prod => {
      this.content += prod.name + ' $' + prod.price + '\r\n';
    });

    this.content += '\r\n' + 'Total Price: $' + details.totalPrice;

    const blob = new Blob([this.content], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, `myStore-receipt-${Date.now()}.txt`);
    this.content = '';
    this.onNoClick();
  }
}
