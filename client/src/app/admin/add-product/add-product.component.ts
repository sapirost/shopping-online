import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { StoreService } from './../../services/store.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  allCategories: any;
  formData: FormData;
  selectedFile: File;
  imgError = false;
  imgUrl: any | string = '';

  addProductForm: FormGroup = this.formBuilder.group({
    name: new FormControl('', [Validators.required]),
    category: new FormControl(Validators.required),
    price: new FormControl('', Validators.required)
  });

  constructor(
    private storeService: StoreService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddProductComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.storeService.getAllCategories().subscribe(categoriesData => {
      this.allCategories = categoriesData;
    });

    if (this.data !== null) {
      this.storeService.getProductById(this.data.productID).subscribe(details => { this.getProductById(details); });
    }
  }

  getProductById(productOBJ) {
    this.addProductForm = this.formBuilder.group({
      name: new FormControl(productOBJ.name, [Validators.required]),
      category: new FormControl(productOBJ.categoryID, Validators.required),
      price: new FormControl(productOBJ.price, Validators.required)
    });

    this.imgUrl = this.storeService.getProductImageLink(productOBJ.image);
  }

  onFileChanged(event) {
    const reader = new FileReader();
    const file = event.target.files[0] as File;
    this.selectedFile = file;
    this.imgError = false;

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imgUrl = reader.result;
    };
  }

  addProduct() {
    const fd = new FormData();
    fd.append('image', this.selectedFile);
    for (const key of Object.keys(this.addProductForm.value)) {
      const value = this.addProductForm.value[key];
      fd.append(key, value);
    }

    if (this.selectedFile !== undefined && this.data == null) {
      this.storeService.addNewProduct(fd).subscribe(() => {
        this.dialogRef.close();
        this.storeService.refreshProdsEm.emit('adding product!');
      },
        err => this.snackBar.open('something went wrong! please try again...'));
    }

    if (this.data !== null && (this.addProductForm.dirty || this.selectedFile !== undefined)) {
      this.storeService.updateProduct(this.data.productID, fd).subscribe(() => {
        this.dialogRef.close();
        this.storeService.refreshProdsEm.emit('updated product!');
      },
        err => this.snackBar.open('something went wrong! please try again...'));
    }

    if (!this.addProductForm.dirty && this.data !== null && this.selectedFile === undefined) {
      this.snackBar.open('no changes has been made...');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
