import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, Signal, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductsService } from '@api/products.service';
import { RateProductComponent } from '@features/products/rate-product/rate-product.component';
import { Product } from '@shared/models/product.interface';
import { CartStore } from '@shared/store/shopping-cart.store';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CurrencyPipe, RateProductComponent],
  templateUrl: './details.component.html',
})
export default class DetailsComponent implements OnInit {
  starsArray: number[] = new Array(5).fill(0);

  // @Input({ alias: 'id' }) productId!: number;
  productId = input<number>(0, { alias: 'id' });
  product!: Signal<Product | undefined>;
  cartStore = inject(CartStore);

  private readonly productsSvc = inject(ProductsService);
  private readonly _sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.product = this.productsSvc.getProductById(this.productId());
  }

  onAddToCart() {
    this.cartStore.addToCart(this.product() as Product);
  }
}
