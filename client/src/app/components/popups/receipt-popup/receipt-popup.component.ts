import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-receipt-popup',
  templateUrl: './receipt-popup.component.html',
  styleUrls: ['./receipt-popup.component.scss']
})
export class ReceiptPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ReceiptPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { }

  getReceipt(cart): void {
    let content = 'MyStore - Receipt: ' + '\r\n\r\n';
    cart.items.map(prod => {
      content += prod.name + ' $' + prod.price + '\r\n';
    });

    content += '\r\n' + 'Total Price: $' + cart.totalPrice;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, `myStore-receipt-${Date.now()}.txt`);
    this.dialogRef.close();
  }
}
