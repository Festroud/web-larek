import { IEvents } from "../components/base/events";  // Импортируем интерфейс для событий

// Интерфейс для модели контактов
export interface IContacts {
  formContacts: HTMLFormElement;  // Ссылка на форму контактов
  inputAll: HTMLInputElement[];  // Все поля ввода формы
  buttonSubmit: HTMLButtonElement;  // Кнопка отправки формы
  formErrors: HTMLElement;  // Блок с ошибками формы
  render(): HTMLElement;  // Метод для рендера формы
}

// Класс для модели контактных данных
export class Contacts implements IContacts {
  formContacts: HTMLFormElement;  // Ссылка на форму контактов
  inputAll: HTMLInputElement[];  // Ссылка на все поля ввода
  buttonSubmit: HTMLButtonElement;  // Кнопка отправки формы
  formErrors: HTMLElement;  // Блок с ошибками

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    // Клонируем содержимое шаблона и находим нужные элементы
    this.formContacts = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.inputAll = Array.from(this.formContacts.querySelectorAll('.form__input'));
    this.buttonSubmit = this.formContacts.querySelector('.button');
    this.formErrors = this.formContacts.querySelector('.form__errors');

    // Добавляем обработчик для изменения полей формы
    this.inputAll.forEach(item => {
      item.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const field = target.name;  // Имя поля (например, email, phone)
        const value = target.value;  // Значение, которое пользователь ввел
        this.events.emit(`contacts:changeInput`, { field, value });  // Генерируем событие для обновления данных
      })
    })

    // Обработчик для отправки формы
    this.formContacts.addEventListener('submit', (event: Event) => {
      event.preventDefault();  // Отменяем стандартное поведение формы (перезагрузку страницы)
      this.events.emit('success:open');  // Генерируем событие для открытия окна об успешном завершении
    });
  }

  // Метод для установки состояния валидности формы (разрешение/запрещение отправки)
  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;  // Делаем кнопку отправки недоступной, если форма не валидна
  }

  // Метод для рендера формы контактов
  render() {
    return this.formContacts;
  }
}
