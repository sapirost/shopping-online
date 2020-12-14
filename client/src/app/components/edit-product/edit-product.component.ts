import { Category, Product } from './../../models/product.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { StoreService } from './../../services/store.service';
import { get } from 'lodash';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  allCategories: Category[];
  formData: FormData;
  selectedFile: File | null = null;
  imgError = false;
  imgUrl: any | string = '';
  editMode = false;
  productID: string;

  addProductForm: FormGroup;

  constructor(private storeService: StoreService, private formBuilder: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.setProductForm();
    this.storeService.categoriesObservable.subscribe(categories => this.allCategories = categories);

    this.storeService.editModeEvnt.subscribe(data => {
      this.productID = data;
      this.storeService.getProductById(data).subscribe(product => this.setProductForm(product));
    });
  }

  private setProductForm(product?: Product) {
    this.addProductForm = this.formBuilder.group({
      name: new FormControl(get(product, 'name'), [Validators.required]),
      category: new FormControl(get(product, 'categoryID'), Validators.required),
      price: new FormControl(get(product, 'price'), Validators.required)
    });

    if (product) {
      this.imgUrl = this.storeService.getProductImageLink(product.image);
      this.editMode = true;
    }
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
    if (this.selectedFile == null && !this.editMode) {
      this.imgError = true;
    } else {
      const fd = new FormData();
      fd.append('image', this.selectedFile);
      for (const key of Object.keys(this.addProductForm.value)) {
        const value = this.addProductForm.value[key];
        fd.append(key, value);
      }

      if (!this.editMode) {
        this.storeService.addNewProduct(fd).subscribe(response => {
          this.cleanForm();
          this.storeService.refreshProdsEm.emit(response);
        },
          () => this.snackBar.open('something went wrong! please try again...'));
      }

      if (this.editMode && (this.addProductForm.dirty || this.selectedFile !== null)) {
        this.storeService.updateProduct(this.productID, fd).subscribe(response => {
          this.cleanForm();
          this.storeService.refreshProdsEm.emit(response);
        },
          () => this.snackBar.open('something went wrong! please try again...'));
      }

      if (!this.addProductForm.dirty && this.editMode && this.selectedFile === null) {
        this.snackBar.open('no changes has been made...');
      }
    }
  }

  cleanForm() {
    this.selectedFile = null;
    this.imgError = false;
    this.imgUrl = '';
    this.editMode = false;
    this.productID = '';
    this.addProductForm.reset();
  }
}
