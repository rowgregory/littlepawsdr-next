// ─── Types ────────────────────────────────────────────────────────────────────
export interface IDachshundAttributes {
  name: string
  slug: string
  ageString: string
  ageGroup: string
  sex: string
  colorDetails: string
  photos: string[]
  isSpecialNeeds: boolean
  isAdoptionPending: boolean
  isCourtesyListing: boolean
  sizeGroup: string
  qualities: string[]
}

export interface IDachshund {
  id: string
  attributes: IDachshundAttributes
}
