import { useCallback } from 'react'

interface FieldErrors {
  name?: string
  sellingFormat?: string
  startingPrice?: string
  buyNowPrice?: string
}

export function useAuctionItemValidation(inputs: any) {
  return useCallback((): [FieldErrors, boolean] => {
    const errs: FieldErrors = {}
    if (!inputs?.name?.trim()) errs.name = 'Name is required'
    if (!inputs?.sellingFormat) errs.sellingFormat = 'Selling format is required'
    if (inputs?.sellingFormat !== 'FIXED' && !inputs?.startingPrice) errs.startingPrice = 'Starting price is required for auction items'
    if (inputs?.sellingFormat !== 'AUCTION' && !inputs?.buyNowPrice) errs.buyNowPrice = 'Buy now price is required for fixed items'
    return [errs, Object.keys(errs).length === 0]
  }, [inputs])
}
