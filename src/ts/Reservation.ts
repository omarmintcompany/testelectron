import axios from 'axios';

export interface ReservationLine {
  id: number;
  itemCode: string;
  brand: string;
  itemGroupCode: string;
  modelCode: string;
  modelDescription: string;
  section: string;
  size: string;
  supplierColor: string;
  supplierReferenceNumber: string;
  season: string;
  family: string;
  itemDescription: string;
  urlPhoto: string;
  quantity: number;
}

export interface IReservation {
  createReservation(apiendpoint: string, token: string): Promise<boolean>;
  updateReservation(apiendpoint: string, token: string): Promise<boolean>;
  confirmReservation(apiendpoint: string, token: string): Promise<boolean>;
  cancelReservation(apiendpoint: string, token: string): Promise<boolean>;
  addLine(itemcode: string): Promise<boolean>;
  delLine(itemcode: string): Promise<boolean>;
}

export class Reservation implements IReservation {
  public id: number;
  public dateCreated: string;
  public cardCode: string;
  public cardName: string;
  public phone: string;
  public email: string;
  public pickDateTime: string;
  public pickDate: string;
  public pickTime: string;
  public salesPerson: string;
  public salesPersonaName: string;
  public whsCode: string;
  public status: string;
  public notes: string;
  public categoryId: string;
  public categoryName: string;
  public ticketId: string;
  public WhsCode: string;
  public reservationLines: ReservationLine[];

  constructor(id: number, whscode: string) {
    this.id = id;
    this.categoryId = 1;
    this.status = 'SC';
    this.whsCode = whscode;
    this.reservationLines = [];
    this.email = '';
    this.phone = '';
  }

  public async addLine(
    itemcode: string,
    apiendpoint: string
  ): Promise<boolean> {
    if (
      this.reservationLines.filter((p) => p.itemCode == itemcode).length != 0
    ) {
      this.reservationLines
        .filter((p) => p.itemCode == itemcode)
        .map((p) => p.quantity++);
    } else {
      return axios
        .get(`${apiendpoint}/disponibilidad/${itemcode}/itemData`)
        .then((x) => {
          this.reservationLines.push({
            id: 0,
            itemCode: x.data.itemCode,
            brand: x.data.brand,
            itemGroupCode: x.data.itemGroupCode,
            modelCode: x.data.modelCode,
            modelDescription: x.data.modelDescription,
            section: x.data.section,
            size: x.data.size,
            supplierColor: x.data.supplierColor,
            supplierReferenceNumber: x.data.supplierReferenceNumber,
            season: x.data.season,
            family: x.data.family,
            itemDescription: x.data.itemDescription,
            urlPhoto: x.data.urlPhoto,
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
    this.reservationLines = this.reservationLines.filter(
      (p) => p.itemCode != itemcode
    );
    return true;
  }

  public async createReservation(
    apiendpoint: string,
    token: string
  ): Promise<boolean> {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    return axios
      .put(
        `${apiendpoint}/Reservation/create`,
        {
          cardCode: 'C' + this.whsCode,
          cardName: this.cardName,
          categoryId: this.categoryId,
          email: this.email != '' && this.email != null ? this.email : ' ',
          phone: this.phone != '' && this.phone != null ? this.phone : ' ',
          pickDateTime: new Date(this.pickDate + ' ' + this.pickTime),
          status: this.status,
          whsCode: this.whsCode,
          notes: (this.notes = !'' ? this.notes : ' '),
          reservationLines: this.reservationLines,
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

  public async updateReservation(
    apiendpoint: string,
    token: string
  ): Promise<boolean> {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    return axios
      .put(
        `${apiendpoint}/Reservation/update`,
        {
          id: this.id,
          cardCode: 'C' + this.whsCode,
          cardName: this.cardName,
          categoryId: this.categoryId,
          email: this.email != '' && this.email != null ? this.email : ' ',
          phone: this.phone != '' && this.phone != null ? this.phone : ' ',
          pickDateTime: new Date(this.pickDate + ' ' + this.pickTime),
          status: this.status,
          whsCode: this.whsCode,
          notes: (this.notes = !'' ? this.notes : ' '),
          reservationLines: this.reservationLines,
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

  public async cancelReservation(
    apiendpoint: string,
    token: string
  ): Promise<boolean> {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    return axios
      .put(`${apiendpoint}/Reservation/cancel/${this.id}`, {}, config)
      .then(() => {
        return true;
      })
      .catch((err) => {
        throw err;
      });
  }
  public async confirmReservation(
    apiendpoint: string,
    token: string
  ): Promise<boolean> {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    return axios
      .put(`${apiendpoint}/Reservation/confirm/${this.id}`, {}, config)
      .then(() => {
        return true;
      })
      .catch((err) => {
        throw err;
      });
  }
}
