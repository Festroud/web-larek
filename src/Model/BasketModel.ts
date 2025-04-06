import { IBasketItem, ICard } from "../types/index";

export interface IBasketModel {
  basketProducts: IBasketItem[];
  getCounter: () => number;
  getSumAllProducts: () => number;
  setSelectedСard(data: ICard): void;
  deleteCardToBasket(item: ICard): void;
  clearBasketProducts(): void;
}

export class BasketModel implements IBasketModel {
  protected _basketProducts: IBasketItem[];

  constructor() {
    this._basketProducts = [];
  }

  set basketProducts(data: IBasketItem[]) {
    this._basketProducts = data;
  }

  get basketProducts() {
    return this._basketProducts;
  }

  // количество товаров в корзине (с учетом quantity)
  getCounter() {
    return this.basketProducts.reduce((sum, item) => sum + item.quantity, 0);
  }

  // сумма всех товаров в корзине
  getSumAllProducts() {
    return this.basketProducts.reduce((sum, item) => sum + (item.product.price ?? 0) * item.quantity, 0);
  }

  // добавить карточку товара в корзину
  setSelectedСard(data: ICard) {
    const existingItem = this._basketProducts.find(item => item.product.id === data.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this._basketProducts.push({ product: data, quantity: 1 });
    }
  }

  // удалить одну единицу товара из корзины
  deleteCardToBasket(item: ICard) {
    const index = this._basketProducts.findIndex(basketItem => basketItem.product.id === item.id);
    if (index >= 0) {
      if (this._basketProducts[index].quantity > 1) {
        this._basketProducts[index].quantity -= 1;
      } else {
        this._basketProducts.splice(index, 1);
      }
    }
  }

  clearBasketProducts() {
    this.basketProducts = [];
  }
}
