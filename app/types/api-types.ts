export interface DachshundAttributes {
  photos: string[];
  name: string;
  ageGroup: number;
  sex: string;
  breedString: string;
  descriptionHtml: string;
  adoptionFeeString: string;
}

export interface DachshundStatus {
  type: string;
  id: string;
}

export interface DachshundRelationships {
  statuses: {
    data: DachshundStatus[];
  };
}

export interface DachshundData {
  attributes: DachshundAttributes;
  id: string;
  relationships: DachshundRelationships;
}

export interface DachshundMeta {
  count: number;
  countReturned: number;
  pageReturned: number;
  limit: number;
  pages: number;
}

export interface DachshundDetailsPayload {
  data: DachshundData[];
  included: any[];
  meta: DachshundMeta;
  dachshund: any;
}

export interface DachshundStatePayload {
  loading: boolean;
  success: boolean;
  error: string | false | null;
  message: string | null;
  dachshundCount: number;
  available: [] | null;
  allDogs: any[] | null;
  dachshund: {} | any | null;
  initialData: {} | null | unknown;
  dachshunds: [];
  totalCount: number;
}
