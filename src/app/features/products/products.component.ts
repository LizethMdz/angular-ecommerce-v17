import { Component, inject } from '@angular/core';
import { ProductsService } from '@api/products.service';
import { CardComponent } from '@features/products/card/card.component';
import { Product } from '@shared/models/product.interface';
import { CartStore } from '@shared/store/shopping-cart.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { BadgesCategoriesComponent } from './badges-categories/badges-categories.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CardComponent, BadgesCategoriesComponent],
  template: `
  <section class="container flex place-content-center">
    <div class="flex items-center align-middle space-x-1 my-3">
      @for(category of categories(); track $index) {
        <app-badges-categories [nameCategory]="category" (selectCategory)="onSelectCateogy($event)"></app-badges-categories>
      }
      <app-badges-categories [nameCategory]="'all products'" (selectCategory)="onSelectCateogy($event)"></app-badges-categories>
    </div>
  </section>
    <section class="text-gray-600 body-font">
      <div class="container px-5 py-24 mx-auto">
        <div class="flex flex-wrap -m-4">
          @for (product of products(); track $index) {
          <app-card
            (addToCartEvent)="onAddToCart($event)"
            class="w-full p-4 lg:w-1/4 md:w-1/2"
            [product]="product"
          />
          }
        </div>
      </div>
    </section>
  `,
})
export default class ProductsComponent {
  private readonly productSvc = inject(ProductsService);
  products = this.productSvc.products;
  cartStore = inject(CartStore);
  categories = toSignal(this.productSvc.getCategories());

  onAddToCart(product: Product): void {
    this.cartStore.addToCart(product);
  }

  onSelectCateogy(categoryName: string) {
    if (categoryName != 'all products') this.productSvc.getCategoriesByName(categoryName);
    else this.productSvc.getProducts();
  }
}
