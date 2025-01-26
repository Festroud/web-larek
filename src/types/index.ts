// Интерфейс для данных заказа
interface IOrderData {
  order: {
    // Список товаров с указанием их идентификаторов и количества
    items: Array<{ 
      productId: string;  // Идентификатор продукта
      quantity: number;   // Количество товара
    }>;

    // Данные клиента
    customer: { 
      name: string;    // Имя клиента
      email: string;   // e-mail клиента
      phone: string;   // Телефон клиента
    };

    // Данные доставки
    delivery: { 
      address: string;   // Адрес доставки
      city: string;      // Город
      postalCode: string; // Почтовый индекс
      country: string;   // Страна
    };

    // Метод оплаты
    paymentMethod: string;

    // Общая сумма заказа
    total: number;
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


interface IContactInfo {
  payment?: 'online' | 'cash'; // Способ оплаты
  address?: string; // Адрес доставки
  email?: string; // e-mail
  phone?: string; // Телефон
}

type TFormErrors = Partial<Record<keyof IContactInfo, string>>;

interface IOrder {
  items: IBasketItem[]; // Список товаров
  contactInfo: IContactInfo; // Контактная информация

  /**
   * Установка контактной информации.
   * Можно передавать частичные данные для обновления.
   * @param info - Данные, которые нужно установить
   */
  setContactInfo(info: Partial<IContactInfo>): void;
  /**
   * Проверка валидности контактной информации.
   * @returns true, если все данные валидны; иначе false.
   */
  validateContactInfo(): boolean;
  /**
   * Получение ошибок валидации.
   * Возвращает объект, где ключи соответствуют полям `IContactInfo`,
   * а значения содержат описание ошибок.
   * @returns Объект ошибок
   */
  getValidationErrors(): TFormErrors;
  /**
   * Получение полной информации о заказе.
   * Возвращает объект, содержащий список товаров и контактные данные.
   * @returns Объект заказа
   */
  getOrderLot(): { items: IBasketItem[]; contactInfo: IContactInfo };
  /**
   * Оформление заказа.
   * Проверяет валидность данных перед завершением.
   */
  placeOrder(): void;
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

interface IOrderStatusModal {
  /**
   * Открытие модального окна с переданным содержимым.
   * @param view - Контент, который нужно показать внутри модального окна.
   */
  open(view: HTMLElement): void;

  /**
   * Закрытие модального окна.
   */
  close(): void;

  /**
   * Отображение успешного статуса заказа.
   * @param orderId - Уникальный идентификатор заказа.
   * @param totalAmount - Итоговая сумма заказа.
   * @returns HTML-элемент, представляющий успешный статус заказа.
   */
  renderSuccess(orderId: string, totalAmount: number): HTMLElement;

  /**
   * Отображение ошибки выполнения заказа.
   * @param errorMessage - Текст сообщения об ошибке.
   * @returns HTML-элемент, представляющий ошибку выполнения заказа.
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

