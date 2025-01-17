// Базовый интерфейс для всех товаров
interface IBaseCard {
  id: string;
  title: string;
  price: number;
}

// Товар (Card), расширяет IBaseCard
interface ICard extends IBaseCard {
  category: string;
  description: string;
  image: string;
}

// Элемент корзины (BasketItem)
interface IBasketItem {
  product: ICard;
  quantity: number;
}

// Базовый интерфейс для корзины
interface IBaseBasket {
  totalPrice: number;
  calculateTotal(): number;
}

// Корзина (Basket), расширяет IBaseBasket
interface IBasket extends IBaseBasket {
  items: IBasketItem[];

  addItem(product: ICard): void;
  removeItem(productId: string): void;
}

// Заказ (Order)
interface IOrder {
  items: IBasketItem[];
  paymentMethod: 'online' | 'cash';
  deliveryAddress: string;
  email: string;
  phone: string;

  placeOrder(): void;
}

// UI КОМПОНЕНТЫ

// Галерея товаров (Gallery)
interface IGallery {
  products: ICard[];
  render(): void;
  onProductClick(productId: string): void;
}

// Шапка сайта (Header)
interface IHeader {
  logo: HTMLImageElement;
  basketButton: HTMLButtonElement;
  basketCounter: HTMLSpanElement;
  updateBasketCounter(count: number): void;
}

// Модальное окно (Modal)
interface IModal {
  open(content: HTMLElement): void;
  close(): void;
}

// Модальное окно статуса заказа (OrderStatusModal) - расширяет IModal
interface IOrderStatusModal extends IModal {
  renderSuccess(orderId: string, totalAmount: number): void;
  renderFailure(errorMessage: string): void;
}


// СОБЫТИЯ

// Брокер событий (EventBus)
interface IEventBus {
  on<T>(event: string, callback: (data: T) => void): void;
  emit<T>(event: string, data?: T): void;
}

