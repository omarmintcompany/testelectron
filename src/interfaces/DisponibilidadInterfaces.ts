export interface itemReservations {
  docNum: number;
  client: string;
  itemCode: string;
  quantity: number;
  whsCode: string;
  whsName: string;
  docStatus: string;
  docDate: string;
  DateRec: string;
  DaysRec: string;
}

export interface itemTransit {
  itemCode: string;
  qtyToSend: number;
  qtyNotSent: number;
  qtySent: number;
  qtyNotRcv: number;
  qtyRcv: number;
  qtyToRcv: number;
  whsCode1: string;
  whsCode2: string;
  whsNameFrom: string;
  whsNameTo: string;
  ponumber: number;
  requestTime: string;
  sentTime: string;
  receiveTime: string;
  storeFrom: string;
  storeTo: string;
}
