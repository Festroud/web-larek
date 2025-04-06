import { ApiListResponse, Api } from '../components/base/api';  // Импортируем базовые классы и типы
import { IOrderData, IOrderResult, IProductItem } from '../types/index';  // Импортируем типы для данных

// Интерфейс для модели работы с API
export interface IApiModel {
  cdn: string;  // URL для работы с CDN (например, для загрузки изображений)
  items: IProductItem[];  // Массив товаров
  getListProductCard: () => Promise<IProductItem[]>;  // Метод для получения списка товаров
  postOrderLot: (order: IOrderData) => Promise<IOrderResult>;  // Метод для отправки заказа
}

// Реализация модели для работы с API
export class ApiModel extends Api implements IApiModel {
  cdn: string;  // URL для работы с CDN
  items: IProductItem[];  // Массив товаров

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);  // Вызываем конструктор родительского класса Api
    this.cdn = cdn;  // Инициализируем URL для CDN
  }

  // Получение списка карточек товаров с сервера
  getListProductCard(): Promise<IProductItem[]> {
    return this.get('/product')  // Выполняем GET-запрос к эндпоинту /product
      .then((data: ApiListResponse<IProductItem>) => 
        // Обрабатываем полученные данные и добавляем CDN URL для изображения
        data.items.map((item) => ({
          ...item,
          image: this.cdn + item.image,  // Присоединяем URL к изображению товара
        }))
      );
  }

  // Отправка заказа на сервер
  postOrderLot(order: IOrderData): Promise<IOrderResult> {
    return this.post(`/order`, order)  // Выполняем POST-запрос на эндпоинт /order с данными заказа
      .then((data: IOrderResult) => data);  // Возвращаем результат выполнения запроса
  }
}
