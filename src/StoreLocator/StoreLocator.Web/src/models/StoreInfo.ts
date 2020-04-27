export default interface StoreInfo {
  id: string;
  posType: string;
  address: string;
  coordinates: Array<number>
}

export interface Address {
  street: string;
  number: string;
  area: string;
  postCode: string;
}