import React, { FormEvent, useRef, useMemo } from 'react'
import { RootState, useAppSelector } from '@redux/store'
import useForm from '@hooks/useForm'
import { useUpdateCampaignMutation } from '@redux/services/campaignApi'
import { CAMPAIGN_COVER_PHOTO_FORM_INITIAL_INPUTS } from '@public/static-data/form-initial-states'
import validateCampaignCoverPhotoForm from 'app/validations/validateCampaignCoverPhotoForm'
import PhotoDropZone from 'app/components/common/PhotoDropZone'
import Switch from './elements/Switch'
import AdminSubmitFormBtn from './elements/AdminSubmitFormBtn'
import uploadFileToFirebase from 'app/utils/uploadFileToFirebase'

const CampaignCoverPhotoForm = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [updateCampaign, { isLoading, error }] = useUpdateCampaignMutation()
  const { campaign, success } = useAppSelector((state: RootState) => state.campaign)
  const { inputs, errors, handleToggle, setErrors, handleUploadProgress, handleDrop, handleFileChange, submitted, setSubmitted, loading } =
    useForm(CAMPAIGN_COVER_PHOTO_FORM_INITIAL_INPUTS, validateCampaignCoverPhotoForm, campaign)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    const isValid = validateCampaignCoverPhotoForm(inputs, setErrors)
    if (!isValid) return

    let coverPhoto
    if (inputs.file) {
      coverPhoto = await uploadFileToFirebase(inputs.file, handleUploadProgress, 'image')
    }

    await updateCampaign({
      _id: inputs._id,
      ...(coverPhoto && { coverPhoto: coverPhoto }),
      ...(inputs?.file?.name && { coverPhotoName: inputs?.file?.name }),
      ...(campaign.maintainAspectRatio !== inputs.maintainAspectRatio && { maintainAspectRatio: inputs.maintainAspectRatio })
    }).unwrap()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col mt-10 animate-fade-in">
      <div className="max-w-sm w-full relative">
        <PhotoDropZone
          inputRef={inputRef}
          image={inputs.coverPhoto}
          name="coverPhoto"
          maintainAspectRatio={inputs.maintainAspectRatio}
          handleDrop={handleDrop}
          loading={loading}
          handleFileChange={handleFileChange}
        />
        {submitted && errors.coverPhoto && <div className="text-xs text-red-500 absolute -bottom-5 right-0">{errors.coverPhoto}</div>}
      </div>
      <div className="max-w-md w-full mt-6 mb-10">
        <Switch enabled={(inputs.maintainAspectRatio ?? campaign?.maintainAspectRatio) || false} onChange={handleToggle} />
      </div>
      <AdminSubmitFormBtn isLoading={isLoading} error={error?.data?.message} success={success} />
    </form>
  )
}

export default CampaignCoverPhotoForm
