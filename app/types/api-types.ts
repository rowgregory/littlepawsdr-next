interface DachshundDetailsPayload {
  data: [
    {
      attributes: {
        photos: string[];
        name: string;
        ageGroup: number;
        sex: string;
        breedString: string;
        descriptionHtml: string;
        adoptionFeeString: string;
      };
      id: string;
      relationships: {
        statuses: {
          data: [
            {
              type: string;
              id: string;
            }
          ];
        };
      };
    }
  ];
  included: any[];
  meta: {
    count: number;
    countReturned: number;
    pageReturned: number;
    limit: number;
    pages: number;
  };
  dachshund: any;
}

interface DachshundStatePayload {
  loading: boolean;
  success: boolean;
  error: string | false | null;
  message: string | null;
  dachshundCount: number;
  searchBarData: [] | null;
  available: [] | null;
  allDogs: any[] | null;
  dachshund: {} | any | null;
  searchBar: {
    list: [];
  };
  initialData: {} | null | unknown;
  dachshunds: [];
  totalCount: number;
}

export type { DachshundDetailsPayload, DachshundStatePayload };
