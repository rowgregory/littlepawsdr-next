import useForm from '@hooks/useForm'
import { useUpdateCampaignMutation } from '@redux/services/campaignApi'
import { RootState, useAppSelector } from '@redux/store'
import validateCampaignOverviewForm from 'app/validations/validateCampaignOverviewForm'
import { FormEvent } from 'react'
import AdminInput from './elements/AdminInput'
import CampaignThemeColorPicker from 'app/components/admin/campaign/CampaignThemeColorPicker'
import { CAMPAIGN_OVERVIEW_FORM_INITIAL_INPUTS } from '@public/static-data/form-initial-states'
import AdminSubmitFormBtn from './elements/AdminSubmitFormBtn'
import getUpdatedAttributes from 'app/utils/getUpdatedAttributes'

const CampaignOverviewForm = () => {
  const [updateCampaign, { isLoading, error }] = useUpdateCampaignMutation()
  const { campaign, success } = useAppSelector((state: RootState) => state.campaign)
  const { inputs, errors, handleInput, setInputs, setErrors, setSubmitted, submitted } = useForm(
    CAMPAIGN_OVERVIEW_FORM_INITIAL_INPUTS,
    validateCampaignOverviewForm,
    campaign
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const isValid = validateCampaignOverviewForm(inputs, setErrors)
    if (!isValid) return

    const updatedAttributes = { ...getUpdatedAttributes(campaign, inputs) }
    if (Object.keys(updatedAttributes).length === 0) return

    const updatedCampaignData = {
      _id: inputs._id,
      ...updatedAttributes
    }

    await updateCampaign(updatedCampaignData).unwrap()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-7 max-w-sm w-full mt-10 animate-fade-in">
      <AdminInput
        value={inputs.title}
        handleInput={handleInput}
        submitted={submitted}
        error={errors.title}
        name="title"
        capitalName="Title"
      />
      <AdminInput
        value={inputs.subtitle}
        handleInput={handleInput}
        submitted={submitted}
        error={errors.subtitle}
        name="subtitle"
        capitalName="Subtitle"
      />
      <AdminInput
        value={inputs.goal}
        handleInput={handleInput}
        submitted={submitted}
        error={errors.goal}
        name="goal"
        capitalName="Goal"
        type="number"
      />
      <CampaignThemeColorPicker setInputs={setInputs} value={inputs.themeColor.dark} submitted={submitted} error={errors.themeColor} />
      <AdminSubmitFormBtn isLoading={isLoading} error={error?.data?.message} success={success} />
    </form>
  )
}

export default CampaignOverviewForm
