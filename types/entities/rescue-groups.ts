export interface IDachshundAttributes {
  name: string
  slug: string
  ageString: string
  ageGroup: string
  sex: string
  breedString: string
  colorDetails: string
  photos: string[]
  isSpecialNeeds: boolean
  isAdoptionPending: boolean
  isCourtesyListing: boolean
  sizeGroup: string
  qualities: string[]
  createdDate: string
}

export interface IDachshund {
  id: string
  attributes: IDachshundAttributes
}
