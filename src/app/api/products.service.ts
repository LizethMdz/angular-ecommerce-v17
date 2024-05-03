import { HttpClient } from '@angular/common/http';
import {
  EnvironmentInjector,
  Injectable,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '@envs/environment';
import { Product } from '@shared/models/product.interface';
import { Observable, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  public products = signal<Product[]>([]);
  private readonly _http = inject(HttpClient);
  private readonly _endPoint = environment.apiURL;
  private readonly _injector = inject(EnvironmentInjector);

  constructor() {
    this.getProducts();
  }

  public getProducts(): void {
    this._http
      .get<Product[]>(`${this._endPoint}/products/?sort=desc`)
      .pipe(
        map((products: Product[]) =>
          products.map((product: Product) => ({ ...product, qty: 1 }))
        ),
        tap((products: Product[]) => this.products.set(products))
      )
      .subscribe();
  }

  public getAllProducts(): Observable<Product[]> {
    return this._http
      .get<Product[]>(`${this._endPoint}/products/?sort=desc`)
      .pipe(
        map((products: Product[]) =>
          products.map((product: Product) => ({ ...product, qty: 1 }))
        ),
        tap((products: Product[]) => this.products.set(products))
      );
  }

  public getProductById(id: number) {
    return runInInjectionContext(this._injector, () =>
      toSignal<Product>(
        this._http.get<Product>(`${this._endPoint}/products/${id}`)
      )
    );
  }

  public addProduct(product : Product): Observable<Product> {
    return this._http.post<Product>(`${this._endPoint}/products`, product);
  }

  public updateProduct(product : Product): Observable<Product> {
    return this._http.put<Product>(`${this._endPoint}/products/${product.id}`, product);
  }

  public deleteProductById(idProduct : number): Observable<Product> {
    return this._http.delete<Product>(`${this._endPoint}/products/${idProduct}`);
  }

  public getCategories(): Observable<string[]> {
    return this._http.get<string[]>(`${this._endPoint}/products/categories`);
  }

  public getCategoriesByName(categoryName: string) {
    this._http.get<Product[]>(`${this._endPoint}/products/category/${categoryName}`).pipe(
      map((products: Product[]) =>
        products.map((product: Product) => ({ ...product, qty: 1 }))
      ),
      tap((products: Product[]) => this.products.set(products))
    )
      .subscribe();
  }
}
