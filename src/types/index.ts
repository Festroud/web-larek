// Интерфейс для данных заказа
interface IOrderData {
  orderId: string;
  items: Array<{ id: string; quantity: number }>;
  totalPrice: number;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  }; 
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}


interface IBaseCard {
  id: string;
  title: string;
  price: number | null;
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
  clearBasket(): void;
}


// Заказ (Order)
interface IOrder {
  items: IBasketItem[];
  paymentMethod: 'online' | 'cash';
  deliveryAddress: string;
  email: string;
  phone: string;

  // Метод для оформления заказа
  placeOrder(): void;

  // Метод для валидации данных заказа
  validate(): void;

  // Генерация ошибок при валидации
  getValidationErrors(): string[];
}

// UI КОМПОНЕНТЫ

// Интерфейс для галереи товаров
interface IGallery {
  setProducts(productElements: HTMLElement[]): void;
  render(): void;
  onProductClick(productId: string): void;
}

// Реализация галереи
class Gallery implements IGallery {
  private container: HTMLElement;
  private products: HTMLElement[] = [];
  private onPreviewOpen: (productId: string) => void;

  constructor(containerSelector: string, onPreviewOpen: (productId: string) => void) {
    this.container = document.querySelector(containerSelector) as HTMLElement;
    this.onPreviewOpen = onPreviewOpen;
  }

  // Установка элементов для галереи
  setProducts(productElements: HTMLElement[]): void {
    this.products = productElements;
    this.render();
  }

  // Отображение элементов на странице
  render(): void {
    this.container.innerHTML = ''; // Очищаем контейнер перед добавлением новых элементов
    this.products.forEach((productElement) => this.container.appendChild(productElement));
  }

  // Обработка клика на продукт
  onProductClick(productId: string): void {
    this.onPreviewOpen(productId); // Вызываем функцию открытия превью
  }
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
  open(content: HTMLElement): void; // Открытие модального окна с переданным контентом
  close(): void; // Закрытие модального окна
}

// Модальное окно статуса заказа (OrderStatusModal) - расширяет IModal
interface IOrderStatusModal extends IModal {
  /**
   * Отображение успешного статуса заказа
   * @param orderId - уникальный идентификатор заказа
   * @param totalAmount - итоговая сумма заказа
   */
  renderSuccess(orderId: string, totalAmount: number): HTMLElement;

  /**
   * Отображение ошибки выполнения заказа
   * @param errorMessage - текст сообщения об ошибке
   */
  renderFailure(errorMessage: string): HTMLElement;
}


// СОБЫТИЯ

// Брокер событий (EventBus)
interface IEventBus {
  on<T>(event: string, callback: (data: T) => void): void;
  emit<T>(event: string, data?: T): void;
}

class EventBus implements IEventBus {
  private events: Map<string, Function[]> = new Map();

  on<T>(event: string, callback: (data: T) => void): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  emit<T>(event: string, data?: T): void {
    this.events.get(event)?.forEach((callback) => callback(data!));
  }
}

