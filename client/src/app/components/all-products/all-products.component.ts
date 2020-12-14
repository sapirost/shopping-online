import { UserRole } from './../../models/user.model';
import { Product } from './../../models/product.model';
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
  allProds: Product[] | [] = [];
  amount = 1;
  role: UserRole;

  constructor(
    private storeService: StoreService,
    private userService: UserService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.storeService.getAllProducts().subscribe(data => this.allProds = data.products);

    const user = this.userService.getUser();
    this.role = user && user.role;

    this.storeService.refreshProdsEm.subscribe(data => this.allProds = data && data.products);
  }

  editProduct(id: string) {
    this.storeService.editModeEvnt.emit(id);
  }

  getImg(image: string) {
    return this.storeService.getProductImageLink(image);
  }

  deleteProduct(id: string) {
    this.storeService.deleteProduct(id).subscribe(response => this.allProds = response.products);
  }

  openDialog(prodID: string) {
    this.dialog.open(AmountPopupComponent, {
      width: '250px',
      data: { amount: this.amount, productID: prodID }
    });
  }
}
