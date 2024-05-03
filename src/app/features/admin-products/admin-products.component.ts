import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductsCRUDStore } from '@shared/store/products-crud.store';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  standalone: true,
  imports: [CurrencyPipe]
})

export class AdminProductsComponent implements OnInit {

  readonly productsStore = inject(ProductsCRUDStore);
  productsList = this.productsStore.products;

  constructor() { }

  ngOnInit() {
    this.productsStore.loadAll();
  }

  deleteProduct(id : number) {
    this.productsStore.deleteProduct(id);
  }

}
