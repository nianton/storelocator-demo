interface Address {
    street: string;
    number: string;
    area: string;
    postCode: string;
}

export interface Position {
  type: string;
  coordinates: Array<number>
}

export interface PosTypeStoreCount {
  posType: string;
  storeCount: number;
}

export interface Store {
  id: string;
  posId: string;
  posType: string;
  legalName: string;
  address: Address;
  location: any;
  subproducts: any[];
  active: boolean;
  amenities: string[] 
}