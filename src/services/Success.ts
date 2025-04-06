import { IEvents } from "../components/base/events";
import { ISuccess } from "../types/index";

export class Success implements ISuccess {
  success: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    // Инициализация элементов DOM из шаблона
    this.success = template.content.querySelector('.order-success').cloneNode(true) as HTMLElement;
    this.description = this.success.querySelector('.order-success__description');
    this.button = this.success.querySelector('.order-success__close');

    // Слушатель для закрытия окна успешного заказа
    this.button.addEventListener('click', () => { 
      events.emit('success:close') // Событие закрытия окна
    });
  }

  // Метод для рендеринга компонента Success с передачей суммы
  render(total: number): HTMLElement {
    // Заполнение описания
    this.description.textContent = `Списано ${total} синапсов`; // Указываем сумму
    return this.success;
  }
}
