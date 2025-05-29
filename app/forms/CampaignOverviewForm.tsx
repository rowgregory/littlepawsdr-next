import { useUpdateCampaignMutation } from '@redux/services/campaignApi'
import { RootState, useAppDispatch, useAppSelector } from '@redux/store'
import validateCampaignOverviewForm from 'app/validations/validateCampaignOverviewForm'
import { FormEvent } from 'react'
import AdminInput from './elements/AdminInput'
import CampaignThemeColorPicker from 'app/components/admin/campaign/CampaignThemeColorPicker'
import AdminSubmitFormBtn from './elements/AdminSubmitFormBtn'
import getUpdatedAttributes from 'app/utils/getUpdatedAttributes'
import createFormActions from '@redux/features/form/formActions'

const CampaignOverviewForm = () => {
  const dispatch = useAppDispatch()
  const [updateCampaign, { isLoading, error }] = useUpdateCampaignMutation()
  const { campaign, success } = useAppSelector((state: RootState) => state.campaign)
  const { setErrors, handleInput } = createFormActions('campaignOverviewForm', dispatch)
  const { campaignOverviewForm } = useAppSelector((state: RootState) => state.form)
  const inputs = campaignOverviewForm?.inputs
  const errors = campaignOverviewForm?.errors

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

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
      <AdminInput value={inputs?.title} handleInput={handleInput} error={errors?.title} name="title" capitalName="Title" />
      <AdminInput value={inputs?.subtitle} handleInput={handleInput} error={errors?.subtitle} name="subtitle" capitalName="Subtitle" />
      <AdminInput value={inputs?.goal} handleInput={handleInput} error={errors?.goal} name="goal" capitalName="Goal" type="number" />
      <CampaignThemeColorPicker setInputs={handleInput} value={inputs?.themeColor?.dark} error={errors?.themeColor} />
      <AdminSubmitFormBtn isLoading={isLoading} error={error?.data?.message} success={success} />
    </form>
  )
}

export default CampaignOverviewForm
