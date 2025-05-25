import type {
  DachshundAttributes,
  DachshundStatus,
  DachshundRelationships,
  DachshundData,
  DachshundMeta,
  DachshundDetailsPayload,
} from "app/types/api-types";

export const initialDachshundAttributes: DachshundAttributes = {
  photos: [],
  name: "",
  ageGroup: 0,
  sex: "",
  breedString: "",
  descriptionHtml: "",
  adoptionFeeString: "",
};

export const initialDachshundStatus: DachshundStatus = {
  type: "",
  id: "",
};

export const initialDachshundRelationships: DachshundRelationships = {
  statuses: {
    data: [initialDachshundStatus],
  },
};

export const initialDachshundData: DachshundData = {
  id: "",
  attributes: initialDachshundAttributes,
  relationships: initialDachshundRelationships,
};

export const initialDachshundMeta: DachshundMeta = {
  count: 0,
  countReturned: 0,
  pageReturned: 0,
  limit: 0,
  pages: 0,
};

export const initialDachshundDetailsPayload: DachshundDetailsPayload = {
  data: [initialDachshundData],
  included: [],
  meta: initialDachshundMeta,
  dachshund: {},
};
