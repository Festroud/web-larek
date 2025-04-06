import { IActions } from "../types/index";
import { IEvents } from "../components/base/events";
import { IBasketItem } from "../types/index";

export interface IBasketItems {
  basketItem: HTMLElement;
  index: HTMLElement;
  title: HTMLElement;
  price: HTMLElement;
  buttonDelete: HTMLButtonElement;
  render(data: IBasketItem, index: number): HTMLElement; 
}

export class BasketItems implements IBasketItems {
  basketItem: HTMLElement;
  index: HTMLElement;
  title: HTMLElement;
  price: HTMLElement;
  buttonDelete: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    // Инициализация элементов из шаблона
    this.basketItem = template.content.querySelector('.basket__item').cloneNode(true) as HTMLElement;
    this.index = this.basketItem.querySelector('.basket__item-index') as HTMLElement;
    this.title = this.basketItem.querySelector('.card__title') as HTMLElement;
    this.price = this.basketItem.querySelector('.card__price') as HTMLElement;
    this.buttonDelete = this.basketItem.querySelector('.basket__item-delete') as HTMLButtonElement;

    // Если переданы действия (например, обработчик клика), то подключаем его к кнопке удаления
    if (actions?.onClick) {
      this.buttonDelete.addEventListener('click', actions.onClick);
    }
  }

  // Метод для установки цены, если значение null, выводим "Бесценно"
  protected setPrice(value: number | null): string {
    if (value === null) {
      return 'Бесценно';
    }
    return `${value} синапсов`; // формируем строку с ценой
  }

  // Метод рендеринга для компонента BasketItem
  render(item: IBasketItem, index: number): HTMLElement {
    this.index.textContent = index.toString(); // Отображение индекса товара
    this.title.textContent = item.product.title; // Название товара
    this.price.textContent = `${item.product.price} синапсов`; // Цена товара
    return this.basketItem; // Возвращаем отрендеренный элемент
  }
}
