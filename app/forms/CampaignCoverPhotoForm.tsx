'use client'

import React, { FormEvent, useRef, useState } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@redux/store'
import { useUpdateCampaignMutation } from '@redux/services/campaignApi'
import validateCampaignCoverPhotoForm from 'app/validations/validateCampaignCoverPhotoForm'
import PhotoDropZone from 'app/components/common/PhotoDropZone'
import Switch from './elements/Switch'
import AdminSubmitFormBtn from './elements/AdminSubmitFormBtn'
import uploadFileToFirebase from 'app/utils/uploadFileToFirebase'
import createFormActions from '@redux/features/form/formActions'

const CampaignCoverPhotoForm = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [updateCampaign, { isLoading, error }] = useUpdateCampaignMutation()
  const dispatch = useAppDispatch()
  const { campaign, success } = useAppSelector((state: RootState) => state.campaign)
  const { campaignCoverPhotoForm } = useAppSelector((state: RootState) => state.form)
  const { handleToggle, setErrors, handleUploadProgress, handleFileDrop, handleFileChange } = createFormActions('campaignCoverPhotoForm', dispatch)
  const inputs = campaignCoverPhotoForm?.inputs
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const isValid = validateCampaignCoverPhotoForm(inputs, setErrors)
    if (!isValid) return
    setLoading(true)
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

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col mt-10 animate-fade-in">
      <div className="max-w-sm w-full relative">
        <PhotoDropZone
          inputRef={inputRef}
          image={inputs.coverPhoto}
          name="coverPhoto"
          maintainAspectRatio={inputs.maintainAspectRatio}
          handleDrop={handleFileDrop}
          loading={loading}
          handleFileChange={handleFileChange}
        />
        {campaignCoverPhotoForm?.errors.coverPhoto && (
          <div className="text-xs text-red-500 absolute -bottom-5 right-0">{campaignCoverPhotoForm?.errors.coverPhoto}</div>
        )}
      </div>
      <div className="max-w-md w-full mt-6 mb-10">
        <Switch enabled={(inputs.maintainAspectRatio ?? campaign?.maintainAspectRatio) || false} onChange={handleToggle} />
      </div>
      <AdminSubmitFormBtn isLoading={isLoading} error={error?.data?.message} success={success} />
    </form>
  )
}

export default CampaignCoverPhotoForm
