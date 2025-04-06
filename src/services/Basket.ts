import { createElement } from "../utils/utils";
import { IEvents } from "../components/base/events";

export interface IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  headerBasketButton: HTMLButtonElement;
  headerBasketCounter: HTMLElement;
  renderHeaderBasketCounter(value: number): void;  // Отображение количества товаров в корзине в хедере
  renderSumAllProducts(sumAll: number): void;      // Отображение общей суммы товаров в корзине
  render(): HTMLElement;                            // Метод рендера корзины
}

export class Basket implements IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  headerBasketButton: HTMLButtonElement;
  headerBasketCounter: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    // Инициализация элементов корзины из шаблона
    this.basket = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this.title = this.basket.querySelector('.modal__title');
    this.basketList = this.basket.querySelector('.basket__list');
    this.button = this.basket.querySelector('.basket__button');
    this.basketPrice = this.basket.querySelector('.basket__price');
    this.headerBasketButton = document.querySelector('.header__basket');
    this.headerBasketCounter = document.querySelector('.header__basket-counter');
    
    // Обработчики событий
    this.button.addEventListener('click', () => { this.events.emit('order:open') });   // Открытие окна оформления заказа
    this.headerBasketButton.addEventListener('click', () => { this.events.emit('basket:open') });  // Открытие модального окна корзины

    this.items = [];  // Инициализация пустого массива для товаров в корзине
  }

  // Сеттер для массива товаров в корзине
  set items(items: HTMLElement[]) {
    if (items.length) {
      this.basketList.replaceChildren(...items);  // Заменить содержимое списка товаров на новые элементы
      this.button.removeAttribute('disabled');    // Разблокировать кнопку, если товары в корзине есть
    } else {
      this.button.setAttribute('disabled', 'disabled');  // Заблокировать кнопку, если корзина пуста
      this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));  // Показать сообщение о пустой корзине
    }
  }

  // Метод для отображения количества товаров в корзине в хедере
  renderHeaderBasketCounter(value: number) {
    this.headerBasketCounter.textContent = String(value);
  }

  // Метод для отображения общей суммы товаров в корзине
  renderSumAllProducts(sumAll: number) {
    this.basketPrice.textContent = String(sumAll + ' синапсов');  // Отображение суммы в корзине
  }

  // Метод для рендера самой корзины
  render() {
    this.title.textContent = 'Корзина';  // Устанавливаем заголовок модального окна
    return this.basket;  // Возвращаем элемент корзины
  }
}
