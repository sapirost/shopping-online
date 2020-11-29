import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AmountPopupComponent } from '../popups/amount-popup/amount-popup.component';
import { StoreService } from './../../services/store.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {
  allProds: Array<any> | [] = [];
  amount = 1;
  role: string;

  @Output() EditProduct = new EventEmitter();

  constructor(
    private storeService: StoreService,
    private userService: UserService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.storeService.getAllProducts().subscribe(data => {
      this.allProds = data.products;
    });

    this.userService.userSubjectOBS.subscribe(data => {
      this.role = data.role;
    });

    this.storeService.refreshProdsEm.subscribe(data => {
      this.allProds = data.products;
    });
  }

  editProduct(id) {
    this.storeService.editModeEvnt.emit(id);
  }

  getImg(image) {
    return this.storeService.getProductImageLink(image);
  }

  delete(id) {
    this.storeService.deleteProduct(id).subscribe(response => {
      this.allProds = response.products;
    });
  }

  openDialog(prodID): void {
    const dialogRef = this.dialog.open(AmountPopupComponent, {
      width: '250px',
      data: { amount: this.amount, productID: prodID }
    });
  }
}
