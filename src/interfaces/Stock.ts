export interface StockRequested {
  id: string;
  createDate: string;
  itemCode: string;
  itemDescription: string;
  season: string;
  section: string;
  brand: string;
  quantity: number;
  urlPhoto: string;
}

export interface Stock {
  fullSeason: string;
  brand: string;
  section: string;
  family: string;
  gamma: string;
  supplierReferenceNumber: string;
  itemCode: string;
  itemDescription: string;
  size: string;
  whsCode: string;
  urlPhoto: string;
  stock: number;
  booking: number;
  inboundTransit: number;
  outboundTransit: number;
  inboundTransferBag: number;
  outboundTransferBag: number;
}
