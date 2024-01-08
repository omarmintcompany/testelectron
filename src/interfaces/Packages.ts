export interface TransferHeader {
  id: number;
  title: string;
  type: number;
}
export interface Packages {
  id: number;
  dateCreated: string;
  userCreated: string;
  dateSent: string;
  userSent: string;
  dateReceived: string;
  userReceived: string;
  status: string;
  whsFrom: string;
  whsTo: string;
  CodeBarPackage: number;
  transfers: TransferHeader[];
}
