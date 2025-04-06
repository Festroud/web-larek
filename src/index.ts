import './scss/styles.scss';  // Импорт стилей

////////////// Импорты утилит и компонентов
import { CDN_URL, API_URL } from './utils/constants';  // Константы URL для API и CDN
import { EventEmitter } from './components/base/events';  // Модуль для работы с событиями
import { ApiModel } from './Model/ApiModel';  // Модуль для работы с API
import { DataModel } from './Model/DataModel';  // Модуль для работы с данными
import { Card } from './services/Card';  // Класс для отображения карточки товара
import { CardPreview } from './services/CardPreview';  // Класс для отображения превью карточки товара
import { IOrderData, IProductItem, PaymentMethod } from './types/index';  // Типы данных для заказа и продукта
import { Modal } from './services/Modal';  // Класс для работы с модальными окнами
import { ensureElement } from './utils/utils';  // Утилита для безопасного получения DOM-элемента
import { BasketModel } from './Model/BasketModel';  // Модель для работы с корзиной
import { Basket } from './services/Basket';  // Класс для отображения корзины
import { BasketItems } from './services/BasketItems';  // Класс для отображения элементов корзины
import { FormModel } from './Model/FormModel';  // Модель для формы заказа
import { Order } from './services/Order';  // Класс для отображения формы заказа
import { Contacts } from './services/Contacts';  // Класс для работы с контактными данными
import { Success } from './services/Success';  // Класс для отображения успешного оформления заказа

////////////// Шаблоны для компонентов
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;  // Шаблон для карточки товара
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;  // Шаблон для превью карточки товара
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;  // Шаблон для корзины
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;  // Шаблон для карточки в корзине
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;  // Шаблон для формы заказа
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;  // Шаблон для контактов
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;  // Шаблон для успешного оформления заказа

////////////// Инициализация моделей и компонентов
const apiModel = new ApiModel(CDN_URL, API_URL);  // Инициализация модели для работы с API
const events = new EventEmitter();  // Инициализация системы событий
const dataModel = new DataModel(events);  // Инициализация модели данных
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);  // Инициализация модального окна
const basket = new Basket(basketTemplate, events);  // Инициализация корзины
const basketModel = new BasketModel();  // Инициализация модели корзины
const formModel = new FormModel(events);  // Инициализация модели формы
const order = new Order(orderTemplate, events);  // Инициализация формы заказа
const contacts = new Contacts(contactsTemplate, events);  // Инициализация работы с контактами

////////////// Отображение карточек товара на странице
events.on('productCards:receive', () => {
  dataModel.productCards.forEach(item => {
    const card = new Card(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
    ensureElement<HTMLElement>('.gallery').append(card.render(item));  // Рендерим карточки товаров в галерее
  });
});

////////////// Получение объекта данных "IProductItem" карточки, по которой кликнули
events.on('card:select', (item: IProductItem) => {
  dataModel.setPreview(item);  // Устанавливаем карточку как предварительный просмотр
});

////////////// Открытие модального окна карточки товара
events.on('modalCard:open', (item: IProductItem) => {
  const cardPreview = new CardPreview(cardPreviewTemplate, events);  // Инициализация модального окна для превью
  modal.content = cardPreview.render(item);  // Отображаем превью карточки
  modal.render();  // Рендерим модальное окно
});

////////////// Добавление карточки товара в корзину
events.on('card:addBasket', () => {
  basketModel.setSelectedСard(dataModel.selectedСard);  // Добавляем выбранный товар в корзину
  basket.renderHeaderBasketCounter(basketModel.getCounter());  // Обновляем количество товаров в корзине на иконке
  modal.close();  // Закрываем модальное окно
});

////////////// Открытие модального окна корзины
events.on('basket:open', () => {
  basket.renderSumAllProducts(basketModel.getSumAllProducts());  // Отображаем сумму всех товаров в корзине
  // Формируем список товаров в корзине
  let index = 1;
  basket.items = basketModel.basketProducts.flatMap((item) => {
    const elements: HTMLElement[] = [];
    for (let i = 0; i < item.quantity; i++) {
      const basketItem = new BasketItems(cardBasketTemplate, events, {
        onClick: () => events.emit('basket:basketItemRemove', item.product),
      });
      elements.push(basketItem.render(item, index++));  // Рендерим каждый товар в корзине
    }
    return elements;
  });
  modal.content = basket.render();  // Отображаем корзину в модальном окне
  modal.render();  // Рендерим модальное окно
});

////////////// Удаление карточки товара из корзины
events.on('basket:basketItemRemove', (item: IProductItem) => {
  basketModel.deleteCardToBasket(item);  // Удаляем товар из корзины
  basket.renderHeaderBasketCounter(basketModel.getCounter());  // Обновляем количество товаров на иконке корзины
  basket.renderSumAllProducts(basketModel.getSumAllProducts());  // Обновляем сумму всех товаров в корзине
  // Обновляем список товаров в корзине
  let index = 1;
  basket.items = basketModel.basketProducts.flatMap((item) => {
    const elements: HTMLElement[] = [];
    for (let i = 0; i < item.quantity; i++) {
      const basketItem = new BasketItems(cardBasketTemplate, events, {
        onClick: () => events.emit('basket:basketItemRemove', item.product),
      });
      elements.push(basketItem.render(item, index++));  // Рендерим каждый товар в корзине
    }
    return elements;
  });
});

////////////// Открытие модального окна "способа оплаты" и "адреса доставки"
events.on('order:open', () => {
  modal.content = order.render();  // Отображаем форму заказа
  modal.render();  // Рендерим модальное окно
  // Получаем массив ID товаров в корзине для дальнейшей обработки
  formModel.items = basketModel.basketProducts.map(item => item.product.id);  // Передаем ID товаров в форму
});

////////////// Обработка выбора способа оплаты
events.on('order:paymentSelection', (button: HTMLButtonElement) => {
  // Добавляем проверку для всех доступных способов оплаты
  if (button.name === 'online' || button.name === 'offline' || button.name === 'card') {
    formModel.payment = button.name as PaymentMethod;  // Устанавливаем выбранный способ оплаты
    formModel.contactInfo.payment = button.name as PaymentMethod;  // Устанавливаем способ оплаты в контактной информации
    events.emit('payment:changed', { payment: button.name as PaymentMethod });  // Отправляем событие изменения способа оплаты
  } else {
    console.warn(`Неизвестный способ оплаты: ${button.name}`);  // Логируем ошибку при неизвестном способе оплаты
  }
});

////////////// Отслеживаем изменение в поле ввода "адреса доставки"
events.on('order:changeAddress', (data: { field: string, value: string }) => {
  formModel.setOrderAddress(data.field, data.value);  // Обновляем данные адреса в модели формы
});

////////////// Валидация данных строки "address" и "payment"
events.on('formErrors:address', (errors: Partial<IOrderData>) => {
  const { address, payment } = errors;
  order.valid = !address && !payment;  // Проверка на валидность формы
  order.formErrors.textContent = Object.values({ address, payment }).filter(i => !!i).join('; ');  // Отображаем ошибки валидации
});
////////////// Открытие модального окна "Email" и "Телефон"
events.on('contacts:open', () => {
  formModel.total = basketModel.getSumAllProducts();  // Устанавливаем общую сумму заказа
  modal.content = contacts.render();  // Отображаем форму для ввода данных контактов
  modal.render();  // Рендерим модальное окно
});

////////////// Отслеживаем изменение в полях ввода "Email" и "Телефон"
events.on('contacts:changeInput', (data: { field: string, value: string }) => {
  formModel.setOrderData(data.field, data.value);  // Обновляем данные формы на основе ввода
});

////////////// Валидация данных строки "Email" и "Телефон"
events.on('formErrors:change', (errors: Partial<IOrderData>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;  // Проверка валидности полей "Email" и "Телефон"
  contacts.formErrors.textContent = Object.values({ phone, email }).filter(i => !!i).join('; ');  // Отображаем ошибки валидации
});
////////////// Открытие модального окна "Заказ оформлен"
events.on('success:open', () => {
  apiModel.postOrderLot(formModel.getOrderLot())  // Отправляем заказ на сервер
    .then((data) => {
      console.log(data);  // Логируем ответ от сервера
      const success = new Success(successTemplate, events);  // Создаем экземпляр успеха
      modal.content = success.render(basketModel.getSumAllProducts());  // Отображаем успешное оформление заказа
      basketModel.clearBasketProducts();  // Очищаем корзину
      basket.renderHeaderBasketCounter(basketModel.getCounter());  // Обновляем иконку корзины
      modal.render();  // Рендерим модальное окно
    })
    .catch(error => console.log(error));  // Логируем ошибки, если что-то пошло не так
});

////////////// Закрытие модального окна "Заказ оформлен"
events.on('success:close', () => modal.close());  // Закрываем модальное окно с успешным оформлением заказа

////////////// Блокируем прокрутку страницы при открытии модального окна
events.on('modal:open', () => {
  modal.locked = true;  // Блокируем прокрутку страницы
});

////////////// Разблокируем прокрутку страницы при закрытии модального окна
events.on('modal:close', () => {
  modal.locked = false;  // Разблокируем прокрутку страницы
});
//////////////Получаем данные с сервера
apiModel.getListProductCard()
  .then(function (data: IProductItem[]) {
    dataModel.productCards = data;  // Загружаем данные карточек товара
  })
  .catch(error => console.log(error));  // Логируем ошибку, если не удалось получить данные
