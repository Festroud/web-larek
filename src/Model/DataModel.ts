import { ICard } from "../types/index";
import { IEvents } from "../components/base/events";

export interface IDataModel {
  productCards: ICard[];
  selectedСard: ICard;
  setPreview(item: ICard): void;
}

export class DataModel implements IDataModel {
  protected _productCards: ICard[];
  selectedСard: ICard;

  constructor(protected events: IEvents) {
    this._productCards = [];
  }

  set productCards(data: ICard[]) {
    this._productCards = data;
    this.events.emit('productCards:receive');
  }

  get productCards() {
    return this._productCards;
  }

  setPreview(item: ICard) {
    this.selectedСard = item;
    this.events.emit('modalCard:open', item);
  }
}
