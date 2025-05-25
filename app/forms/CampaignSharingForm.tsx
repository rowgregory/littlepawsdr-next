import React, { FormEvent, useRef, useState } from 'react'
import useForm from '@hooks/useForm'
import { useUpdateCampaignMutation } from '@redux/services/campaignApi'
import { RootState, useAppSelector } from '@redux/store'
import AwesomeIcon from 'app/components/common/AwesomeIcon'
import AdminSubmitFormBtn from 'app/forms/elements/AdminSubmitFormBtn'
import { checkIcon, copyIcon } from 'app/icons'
import getUpdatedAttributes from 'app/utils/getUpdatedAttributes'
import { ADMIN_CAMPAIGN_BASE_URL } from 'app/utils/url.functions'
// import { QRCodeSVG } from 'qrcode.react'
// import { toPng } from 'html-to-image'

const CampaignSharingForm = () => {
  const { campaign, success } = useAppSelector((state: RootState) => state.campaign)
  const { inputs, handleInput } = useForm({ customCampaignLink: '' }, () => {}, campaign)
  const [updateCampaign, { isLoading, error }] = useUpdateCampaignMutation()
  const [loading, setLoading] = useState(false)
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const [qrCodeLink, setQrCodeLink] = useState(`https://localhost:300/campaigns/${inputs.customCampaignLink}`)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await updateCampaign({
      _id: inputs._id,
      ...getUpdatedAttributes(campaign, inputs)
    }).unwrap()

    setQrCodeLink(`https://localhost:300/campaigns/${inputs.customCampaignLink}`)
  }

  const copyLink = () => {
    setLoading(true)
    navigator.clipboard.writeText(qrCodeLink).then(async () => {
      setTimeout(() => setLoading(false), 1750)
    })
  }

  // const handleCopyQRCode = async () => {
  //   if (qrCodeRef.current) {
  //     try {
  //       const dataUrl = await toPng(qrCodeRef.current, {
  //         backgroundColor: 'white',
  //         width: 128,
  //         height: 128
  //       })
  //       const blob = await (await fetch(dataUrl)).blob()
  //       const clipboardItem = new ClipboardItem({ 'image/png': blob })

  //       await navigator.clipboard.write([clipboardItem])
  //       alert('QR Code copied to clipboard!')
  //     } catch (err) {
  //       alert('Failed to copy QR code.')
  //     }
  //   }
  // }

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
              value={inputs?.customCampaignLink || ''}
              type="text"
              name="customCampaignLink"
              className="w-full bg-transparent text-shadow text-sm dark:text-white focus:outline-none rounded-tr-lg rounded-br-lg"
              onChange={handleInput}
            />
            <AwesomeIcon
              onClick={() => copyLink()}
              icon={loading ? checkIcon : copyIcon}
              className={`w-4 h-4 text-azure dark:text-amathystglow`}
            />
          </div>
        </div>
      </div>
      <AdminSubmitFormBtn isLoading={isLoading} error={error?.data?.message} success={success} />
      <div className="mt-10">
        <h3 className="text-17 text-ironMist font-semibold mb-2">QR Code</h3>
        <p className="text-sm text-ironMist dark:text-zinc-300 mb-4">
          Click the QR code to copy it. You can now paste it wherever you need!
        </p>
        {/* <div ref={qrCodeRef} onClick={handleCopyQRCode}>
          <QRCodeSVG value={qrCodeLink} size={128} />
        </div> */}
      </div>
    </form>
  )
}

export default CampaignSharingForm
