import axios from 'axios';

export interface TransferLine {
  supplierReferenceNumber: string;
  itemCode: string;
  itemDescription: string;
  color: string;
  size: string;
  brand: string;
  section: string;
  family: string;
  urlPhoto: string;
  season: string;
  stock: number;
  orderQty: number;
  sendQty: number;
  recvQty: number;
  quantity: number;
}

export interface ITransfer {
  addLine(itemcode: string): Promise<boolean>;
  delLine(itemcode: string): Promise<boolean>;
}

export class Transfer implements ITransfer {
  public id: number;
  public title: string;
  public whsFrom: string;
  public whsTo: string;
  public salesPerson: string;
  public status: string;
  public type: number;
  public dateCreated: string;
  public dateSend: string;
  public dateRec: string;
  public urgent: boolean;
  public salesRepCreate: string;
  public salesRepSent: string;
  public salesRepReceived: string;
  public transferLines: TransferLine[];

  constructor(id: number) {
    this.id = id;
    this.transferLines = [];
  }

  public async addLine(
    itemcode: string,
    apiendpoint: string
  ): Promise<boolean> {
    if (this.transferLines.filter((p) => p.itemCode == itemcode).length != 0) {
      this.transferLines
        .filter((p) => p.itemCode == itemcode)
        .map((p) => p.quantity++);
    } else {
      return axios
        .get(`${apiendpoint}/disponibilidad/${itemcode}/itemData`)
        .then((x) => {
          this.transferLines.push({
            supplierReferenceNumber: x.data.supplierReferenceNumber,
            itemCode: x.data.itemCode,
            itemDescription: x.data.itemDescription,
            color: x.data.color,
            size: x.data.size,
            brand: x.data.brand,
            section: x.data.section,
            family: x.data.family,
            season: x.data.season,
            stock: x.data.stock,
            urlPhoto: x.data.urlPhoto,
            orderQty: x.data.orderQty,
            sendQty: x.data.sendQty,
            recvQty: x.data.recvQty,
            quantity: 1,
          });
        })
        .catch((err) => {
          throw err;
        });
    }

    return true;
  }

  public async delLine(itemcode: string): Promise<boolean> {
    this.transferLines = this.transferLines.filter(
      (p) => p.itemCode != itemcode
    );
    return true;
  }
}
