// Типы для оплаты и категорий товара
export type PaymentMethod = 'online' | 'offline';
export type ProductCategory = 'soft' | 'hard' | 'other' | 'additional' | 'button';

// Интерфейс товара
export interface IProductItem {
  id: string;
  title: string;
  price: number | null;
  image: string;
  category?: ProductCategory;
  description?: string;
}

// Расширенный интерфейс карточки товара
export interface ICard extends IProductItem {
  selected?: boolean;
}

// Интерфейс для данных заказа
export interface IOrderData {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total?: number;
  items?: string[];
  contactInfo: IContactInfo; // Добавляем явное объявление
}

// Элемент корзины
export interface IBasketItem {
  product: IProductItem;
  quantity: number;
}

// Интерфейс контактной информации
export interface IContactInfo {
  payment?: PaymentMethod;
  address?: string;
  email?: string;
  phone?: string;
}

// Интерфейс данных заказа (расширенный)
export interface IOrderData extends IContactInfo {
  total?: number;
  items?: string[];
}

// Интерфейс статуса заказа
export interface IOrderResult {
  orderId: string;
  status: string;
  message: string;
}

// Интерфейс для действий с карточкой товара
export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
  onAddToBasket?: () => void;
}

// Интерфейс ошибок заказа
export interface IOrderErrors {
  payment?: string;
  address?: string;
}

// Интерфейс ошибок контактных данных
export interface IContactsErrors {
  email?: string;
  phone?: string;
}

// Ошибки формы
export type TFormErrors = Partial<Record<keyof IContactInfo, string>>;

// Интерфейс корзины
export interface IBasket {
  items: IBasketItem[];
  totalPrice: number;

  addItem(product: IProductItem): void;
  removeItem(productId: string): void;
  clearBasket(): void;
  calculateTotal(): number;
}

// Интерфейс заказа
export interface IOrder {
  items: IBasketItem[];
  contactInfo: IContactInfo;

  setContactInfo(info: Partial<IContactInfo>): void;
  validateContactInfo(): boolean;
  getValidationErrors(): TFormErrors;
  getOrderLot(): { items: IBasketItem[]; contactInfo: IContactInfo };
  placeOrder(): void;
}

// UI компоненты

// Интерфейс для успешного сообщения
export interface ISuccess {
  success: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;
  render(total: number): HTMLElement;
}

// Интерфейс для модального окна
export interface IModal {
  open(): void;
  close(): void;
  render(): HTMLElement
}

// Система событий

// Интерфейс для системы событий
export interface IEventBus {
  on<T>(event: string, callback: (data: T) => void): void;
  emit<T>(event: string, data?: T): void;
}

// Реализация системы событий
export class EventBus implements IEventBus {
  private events: Map<string, Function[]> = new Map();

  on<T>(event: string, callback: (data: T) => void): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  emit<T>(event: string, data?: T): void {
    this.events.get(event)?.forEach(callback => callback(data));
  }
}

// Интерфейс для действий пользователя
export interface IActions {
  onClick?: (event: MouseEvent) => void;
}
