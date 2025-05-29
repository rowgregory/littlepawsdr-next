'use client'

import createFormActions from '@redux/features/form/formActions'
import { useUpdateCampaignMutation } from '@redux/services/campaignApi'
import { RootState, useAppDispatch, useAppSelector } from '@redux/store'
import AwesomeIcon from 'app/components/common/AwesomeIcon'
import { checkIcon, copyIcon } from 'app/lib/font-awesome/icons'
import getUpdatedAttributes from 'app/utils/getUpdatedAttributes'
import React, { FormEvent, useState } from 'react'
import AdminSubmitFormBtn from './elements/AdminSubmitFormBtn'
import { ADMIN_CAMPAIGN_BASE_URL } from 'app/utils/url.functions'

const CampaignSharingForm = () => {
  const { campaign, success } = useAppSelector((state: RootState) => state.campaign)
  const { campaignSharingForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput } = createFormActions('campaignSharingForm', dispatch)
  const [updateCampaign, { isLoading, error }] = useUpdateCampaignMutation()
  const [loading, setLoading] = useState(false)
  const [qrCodeLink, setQrCodeLink] = useState(`https://localhost:300/campaigns/${campaignSharingForm?.inputs.customCampaignLink}`)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await updateCampaign({
      _id: campaignSharingForm?.inputs._id,
      ...getUpdatedAttributes(campaign, campaignSharingForm?.inputs)
    }).unwrap()

    setQrCodeLink(`https://localhost:300/campaigns/${campaignSharingForm?.inputs.customCampaignLink}`)
  }

  const copyLink = () => {
    setLoading(true)
    navigator.clipboard.writeText(qrCodeLink).then(async () => {
      setTimeout(() => setLoading(false), 1750)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col mt-5 animate-fade-in">
      <div className="w-full mb-7">
        <h3 className="mb-2 text-17 text-ironMist font-semibold">Custom Campaign Link</h3>
        <div className="flex items-center h-10">
          <div className="rounded-tl-lg rounded-bl-lg p-2 border-1 text-sm border-zinc-100 bg-zinc-100 dark:border-storm dark:bg-charcoal">
            {`http://localhost:3000${ADMIN_CAMPAIGN_BASE_URL}`}
          </div>
          <div className="border-1 border-gray-100 dark:border-storm flex items-center p-2">
            <input
              value={campaignSharingForm?.inputs?.customCampaignLink || ''}
              type="text"
              name="customCampaignLink"
              className="w-full bg-transparent text-shadow text-sm dark:text-white focus:outline-none rounded-tr-lg rounded-br-lg"
              onChange={handleInput}
            />
            <AwesomeIcon onClick={() => copyLink()} icon={loading ? checkIcon : copyIcon} className={`w-4 h-4 text-azure dark:text-amathystglow`} />
          </div>
        </div>
      </div>
      <AdminSubmitFormBtn isLoading={isLoading} error={error?.data?.message} success={success} />
      <div className="mt-10">
        <h3 className="text-17 text-ironMist font-semibold mb-2">QR Code</h3>
        <p className="text-sm text-ironMist dark:text-zinc-300 mb-4">Click the QR code to copy it. You can now paste it wherever you need!</p>
      </div>
    </form>
  )
}

export default CampaignSharingForm
