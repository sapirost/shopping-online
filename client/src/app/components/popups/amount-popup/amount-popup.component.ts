import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from './../../../services/user.service';

@Component({
  selector: 'app-amount-popup',
  templateUrl: './amount-popup.component.html',
  styleUrls: ['./amount-popup.component.scss']
})
export class AmountPopupComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AmountPopupComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() { }

  addToMyCart(amount) {
    this.userService.addToUserCart(this.data.productID, amount).subscribe(response => {
      console.log("🚀 ~ file: amount-popup.component.ts ~ line 21 ~ AmountPopupComponent ~ this.userService.addToUserCart ~ response", response)
      this.userService.updateUserCart(response);
      this.dialogRef.close();
    });
  }
}
