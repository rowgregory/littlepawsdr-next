export type FormProps = {
  inputs: any
  errors: any
  handleInput: (e: any) => void
  handleSubmit: (e: any) => void
  onClose: () => void
  isUpdating: boolean
  isLoading: boolean
}
