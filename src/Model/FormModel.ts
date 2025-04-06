import { IEvents } from '../components/base/events';
import { TFormErrors, IOrderData, PaymentMethod, IContactInfo } from '../types/index';

// Интерфейс для модели формы
export interface IFormModel extends IOrderData {
  setOrderAddress(field: string, value: string): void;  // Установка адреса заказа
  validateOrder(): boolean;  // Валидация данных заказа
  setOrderData(field: string, value: string): void;  // Установка данных заказа (например, email, телефон)
  validateContacts(): boolean;  // Валидация контактных данных
  getOrderLot(): IOrderData;  // Получение данных для отправки
  contactInfo: IContactInfo;  // Контактная информация
}

// Реализация модели формы
export class FormModel implements IFormModel {
  payment: PaymentMethod;  // Способ оплаты
  email: string;  // Электронная почта
  phone: string;  // Телефон
  address: string;  // Адрес доставки
  total: number;  // Общая сумма
  items: string[];  // Список товаров (ID)
  formErrors: TFormErrors = {};  // Ошибки формы

  // Контактная информация
  contactInfo: IContactInfo;

  constructor(protected events: IEvents) {
    // Инициализация данных
    this.payment = 'online' as PaymentMethod;
    this.email = '';
    this.phone = '';
    this.address = '';
    this.total = 0;
    this.items = [];
    this.contactInfo = { email: '', phone: '', address: '', payment: 'online' }; // Инициализация contactInfo
  }

  // Метод для установки адреса
  setOrderAddress(field: string, value: string) {
    if (field === 'address') {
      this.address = value;  // Устанавливаем адрес
      this.contactInfo.address = value; // Обновляем в contactInfo
    }

    if (this.validateOrder()) {
      this.events.emit('order:ready', this.getOrderLot());  // Эмитим событие если заказ готов
    }
  }

  // Метод для валидации заказа (адрес и способ оплаты)
  validateOrder() {
    const regexp = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;  // Регулярное выражение для валидации адреса
    const errors: typeof this.formErrors = {};  // Ошибки валидации

    // Проверки для поля address
    if (!this.address) {
      errors.address = 'Необходимо указать адрес';
    } else if (!regexp.test(this.address)) {
      errors.address = 'Укажите настоящий адрес';
    } else if (!this.payment) {
      errors.payment = 'Выберите способ оплаты';
    }

    this.formErrors = errors;  // Присваиваем ошибки
    this.events.emit('formErrors:address', this.formErrors);  // Эмитим ошибки
    return Object.keys(errors).length === 0;  // Возвращаем true, если ошибок нет
  }

  // Метод для установки данных заказа (email, телефон)
  setOrderData(field: string, value: string) {
    if (field === 'email') {
      this.email = value;  // Устанавливаем email
      this.contactInfo.email = value;  // Обновляем в contactInfo
    } else if (field === 'phone') {
      this.phone = value;  // Устанавливаем телефон
      this.contactInfo.phone = value;  // Обновляем в contactInfo
    }

    if (this.validateContacts()) {
      this.events.emit('order:ready', this.getOrderLot());  // Эмитим событие если заказ готов
    }
  }

  // Метод для валидации контактных данных
  validateContacts() {
    const regexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;  // Регулярное выражение для email
    const regexpPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;  // Регулярное выражение для телефона
    const errors: typeof this.formErrors = {};  // Ошибки валидации

    // Проверки для поля email
    if (!this.email) {
      errors.email = 'Необходимо указать email';
    } else if (!regexpEmail.test(this.email)) {
      errors.email = 'Некорректный адрес электронной почты';
    }

    // Если телефон начинается с 8, преобразуем в +7
    if (this.phone.startsWith('8')) {
      this.phone = '+7' + this.phone.slice(1);
    }

    // Проверки для поля phone
    if (!this.phone) {
      errors.phone = 'Необходимо указать телефон';
    } else if (!regexpPhone.test(this.phone)) {
      errors.phone = 'Некорректный формат номера телефона';
    }

    this.formErrors = errors;  // Присваиваем ошибки
    this.events.emit('formErrors:change', this.formErrors);  // Эмитим ошибки
    return Object.keys(errors).length === 0;  // Возвращаем true, если ошибок нет
  }

  // Метод для получения данных для отправки
  getOrderLot(): IOrderData {
    // Логируем данные перед отправкой
    console.log('Order Data:', {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
      total: this.total,
      items: this.items,
      contactInfo: this.contactInfo,
    });
  
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
      total: this.total,
      items: this.items,
      contactInfo: this.contactInfo,  // Возвращаем контактную информацию
    };
  }
}
