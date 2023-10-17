import axios from 'axios';
import { useWhsStore } from '../stores/whs';
import { date } from 'quasar';

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
  createTransfer(): Promise<boolean>;
}

export class Transfer implements ITransfer {
  public id: number;
  public title: string;
  public whsFrom: string;
  public whsTo: string;
  public status: string;
  public type: number;
  public salesPerson: string;
  public dateCreated: string;
  public dateSend: string;
  public dateRec: string;
  public urgent: boolean;
  public salesRepCreate: string;
  public salesRepSent: string;
  public salesRepReceived: string;
  public deliveryMan: boolean;
  public needDateTime: string;
  public transferLines: TransferLine[];

  store = useWhsStore();

  constructor(id: number) {
    this.id = id;
    this.transferLines = [];
  }

  public async addLine(itemcode: string): Promise<boolean> {
    if (this.transferLines.filter((p) => p.itemCode == itemcode).length != 0) {
      this.transferLines
        .filter((p) => p.itemCode == itemcode)
        .map((p) => p.orderQty++);
    } else {
      return axios
        .get(
          `${this.store.options['ApiEndPoint']}/disponibilidad/${itemcode}/itemData`
        )
        .then((x) => {
          this.transferLines.push({
            supplierReferenceNumber: x.data.supplierReferenceNumber,
            itemCode: x.data.itemCode,
            itemDescription: x.data.itemDescription,
            color: '',
            size: '',
            brand: x.data.brand,
            section: x.data.section,
            family: x.data.family,
            season: x.data.season,
            stock: 0,
            urlPhoto: x.data.urlPhoto,
            orderQty: 1,
            sendQty: 0,
            recvQty: 0,
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
  public async createTransfer(): Promise<boolean> {
    const config = {
      headers: { Authorization: `Bearer ${this.store.getToken}` },
    };
    const hour = new Date();
    if (this.needDateTime != '' && this.needDateTime != null) {
      hour.setHours(
        Number(this.needDateTime.split(':')[0]),
        Number(this.needDateTime.split(':')[1])
      );
    }
    return axios
      .post(
        `${this.store.options['ApiEndPoint']}/transfers`,
        {
          id: this.id,
          title: this.title,
          whsFrom: this.whsFrom,
          whsTo: this.whsTo,
          status: this.status,
          salesPerson: this.salesPerson,
          type: this.type.toString(),
          urgent: this.urgent,
          salesRepCreate: this.salesRepCreate,
          salesRepSent: this.salesRepSent,
          salesRepReceived: this.salesRepReceived,
          dateCreated: date
            .formatDate(new Date(Date.UTC(1900, 0, 1)), 'YYYY-MM-DDTHH:MM')
            .toString(),
          dateSend: date
            .formatDate(new Date(Date.UTC(1900, 0, 1)), 'YYYY-MM-DDTHH:MM')
            .toString(),
          dateRec: date
            .formatDate(new Date(Date.UTC(1900, 0, 1)), 'YYYY-MM-DDTHH:MM')
            .toString(),
          deliveryMan: this.deliveryMan,
          needDateTime: !this.deliveryMan
            ? date
                .formatDate(new Date(Date.UTC(1900, 0, 1)), 'YYYY-MM-DDTHH:MM')
                .toString()
            : date.formatDate(hour, 'YYYY-MM-DDTHH:MM').toString(),
          transferLines: this.transferLines,
        },
        config
      )
      .then(() => {
        return true;
      })
      .catch((err) => {
        throw err;
      });
  }
}
