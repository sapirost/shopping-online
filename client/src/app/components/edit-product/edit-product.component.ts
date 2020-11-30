import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { StoreService } from './../../services/store.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  allCategories: any;
  formData: FormData;
  selectedFile: File | null = null;
  imgError = false;
  imgUrl: any | string = '';
  editMode = false;
  productID: string;

  addProductForm: FormGroup = this.formBuilder.group({
    name: new FormControl('', [Validators.required]),
    category: new FormControl(Validators.required),
    price: new FormControl('', Validators.required)
  });

  constructor(private storeService: StoreService, private formBuilder: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.storeService.getAllCategories().subscribe(categoriesData => {
      this.allCategories = categoriesData;
    });

    this.storeService.editModeEvnt.subscribe(data => {
      this.productID = data;
      this.storeService.getProductById(data).subscribe(details => { this.getProductById(details); });
    });
  }

  getProductById(productOBJ) {
    this.addProductForm = this.formBuilder.group({
      name: new FormControl(productOBJ.name, [Validators.required]),
      category: new FormControl(productOBJ.categoryID, Validators.required),
      price: new FormControl(productOBJ.price, Validators.required)
    });

    this.imgUrl = this.storeService.getProductImageLink(productOBJ.image);
    this.editMode = true;
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
          err => this.snackBar.open('something went wrong! please try again...'));
      }

      if (this.editMode && (this.addProductForm.dirty || this.selectedFile !== null)) {
        this.storeService.updateProduct(this.productID, fd).subscribe(response => {
          this.cleanForm();
          this.storeService.refreshProdsEm.emit(response);
        },
          err => this.snackBar.open('something went wrong! please try again...'));
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
    this.addProductForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      category: new FormControl(Validators.required),
      price: new FormControl('', Validators.required)
    });
  }
}
