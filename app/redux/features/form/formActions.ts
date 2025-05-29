import { Errors } from 'app/types/form-types'
import { formSlice } from './formSlice'
import { ChangeEvent } from 'react'

const createFormActions = (formName: string, dispatch: any) => ({
  setInputs: (data: any) => dispatch(formSlice.actions.setInputs({ formName, data })),
  clearInputs: () => dispatch(formSlice.actions.clearInputs({ formName })),
  setErrors: (errors: Errors) => dispatch(formSlice.actions.setErrors({ formName, errors })),
  handleInput: (e: ChangeEvent<HTMLInputElement> | { target: { name: string; value: any } }) =>
    dispatch(
      formSlice.actions.handleInput({
        formName,
        name: e.target.name,
        value: e.target.value
      })
    ),
  handleToggle: (e: any) =>
    dispatch(
      formSlice.actions.handleToggle({
        formName,
        name: e.target.name,
        checked: e.target.checked
      })
    ),
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0] && files[0].type.startsWith('image/') && !files[0].type.startsWith('image/heic')) {
      const reader = new FileReader()
      reader.onload = () => {
        dispatch(
          formSlice.actions.handleFileUpload({
            formName,
            imageUrl: reader.result,
            file: files[0]
          })
        )
      }
      reader.readAsDataURL(files[0])
    }
  },
  handleVideoChange: (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0] && files[0].type.startsWith('video/')) {
      const reader = new FileReader()
      reader.onload = () => {
        dispatch(
          formSlice.actions.handleVideoUpload({
            formName,
            videoUrl: reader.result,
            videoFile: files[0]
          })
        )
      }
      reader.readAsDataURL(files[0])
    }
  },
  handleFileDrop: (event: React.DragEvent<HTMLDivElement>) => {
    const files = event.dataTransfer.files
    if (files && files[0] && files[0].type.startsWith('image/') && !files[0].type.startsWith('image/heic')) {
      const reader = new FileReader()
      reader.onload = () => {
        dispatch(
          formSlice.actions.handleFileUpload({
            formName,
            imageUrl: reader.result,
            file: files[0]
          })
        )
      }
      reader.readAsDataURL(files[0])
    }
  },

  handleVideoDrop: (event: React.DragEvent<HTMLDivElement>) => {
    const files = event.dataTransfer.files
    if (files && files[0] && files[0].type.startsWith('video/')) {
      const reader = new FileReader()
      reader.onload = () => {
        dispatch(
          formSlice.actions.handleVideoUpload({
            formName,
            videoUrl: reader.result,
            videoFile: files[0]
          })
        )
      }
      reader.readAsDataURL(files[0])
    }
  },
  handleUploadProgress: (progress: any) => dispatch(formSlice.actions.setUploadProgress(progress))
})

export default createFormActions
