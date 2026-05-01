import { setInputs } from 'app/lib/store/slices/formSlice'
import { store } from 'app/lib/store/store'
export function initializeForm(inputs: any, formName: string, data: Record<string, any>) {
  if (inputs) return
  store.dispatch(setInputs({ formName, data }))
}
