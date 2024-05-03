import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product } from '@shared/models/product.interface';
import { ProductsService } from '@api/products.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export interface ProductsCRUDStore {
    products: Product[];
    isLoading: boolean;
    error: any;
}

const initialState: ProductsCRUDStore = {
    products: [],
    isLoading: false,
    error: null
};

export const ProductsCRUDStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods(({ products, ...store }, productsService = inject(ProductsService), toastService = inject(ToastrService)) => ({
        async loadAll(): Promise<void> {
            patchState(store, { isLoading: true });
            const products = await firstValueFrom(productsService.getAllProducts(), { defaultValue: [] });
            patchState(store, { products, isLoading: false });
        },
        async deleteProduct(id: number) {
            patchState(store, { isLoading: true });
            const resultDeleteProducts = await lastValueFrom(productsService.deleteProductById(id));
            let productsList: Product[] = [];
            if (resultDeleteProducts) {
                productsList = products().filter((product) => product.id !== id);
                toastService.success("El producto fue eliminado.")
            } else {
                productsList = products();
                toastService.error("El producto no pudo ser eliminado.")
            }
            patchState(store, { products: productsList, isLoading: false });
        },
        async addProduct(product: Product) {
            patchState(store, { isLoading: true });
            const resultDeleteProducts = await lastValueFrom(productsService.addProduct(product));
            if (resultDeleteProducts) {
                patchState(store, { products: [...products(), product] });
                toastService.success("El producto fue creado.")
            } else {
                toastService.error("El producto no pudo ser creado.")
            }
        },
        async updateProduct(product: Product) {
            patchState(store, { isLoading: true });
            const resultDeleteProducts = await lastValueFrom(productsService.updateProduct(product));
            if (resultDeleteProducts) {
                const updatedProduct = products().map((pro) =>
                    pro.id === product.id
                        ? { ...product }
                        : pro
                );
                patchState(store, { products: updatedProduct });
                toastService.success("El producto fue actualizado.")
            } else {
                toastService.error("El producto no pudo ser actualizado.")
            }
        },
        clearCart() {
            patchState(store, initialState);
        },
    }))
);

export const calculateTotalAmount = (products: Product[]): number => {
    return products.reduce(
        (acc, product) => acc + product.price * product.qty,
        0
    );
}

export const calculateProductCount = (products: Product[]): number => {
    return products.reduce((acc, product) => acc + product.qty, 0);
}
