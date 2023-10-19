export interface TransferList {
  id: number;
  whsToName: string;
  whsTo: string;
  whsFromName: string;
  whsFrom: string;
  status: string;
  dateCreated: string;
  dateSend: string;
  title: string;
  urgent: boolean;
  NeedDateTime: string;
  TypeName: string;
}
export interface TransferType {
  id: number;
  description: string;
}
export interface Transfer {
  id: number;
  title: string;
  whsFrom: string;
  whsTo: string;
  salesPerson: string;
  dateCreated: string;
  dateSend: string;
  status: string;
  transferLines: TransferLine[];
}

export interface TransferLine {
  itemCode: string;
  itemDescription: string;
  color: string;
  size: string;
  brand: string;
  section: string;
  orderQty: number;
  sendQty: number;
  recvQty: number;
}

export interface SalesRep {
  code: string;
  name: string;
  govid: string;
  cardcode: string;
  password: string;
}
export interface Reason {
  id: number;
  description: string;
}

export type TodoErrorResponse = {
  error: string;
};

export interface iConfig {
  valid: string;
  allow0: number;
  endpoint: string;
  whscodes: string;
  apk: string;
}

export interface versionFile {
  currentVersion: string;
}

export interface whsconfig {
  businessUnitId: number;
  businessUnitName: string;
  whsCodes: whsCodes[];
}

export interface whsCodes {
  whsCode: string;
  whsName: string;
  type: string;
}

export interface refData {
  brand: string;
  modelName: string;
  modelCode: string;
  rprov: string;
  section: string;
  itemCodes: itemCodeData[];
}

export interface itemCodeData {
  itemCode: string;
  size: string;
}

export interface stockInfo {
  whsCode: string;
  itemCode: string;
  onHand: number;
}
export type stockTable = {
  itemCode: string;
  size: string;
  stockInfo: stockInfo[];
};
