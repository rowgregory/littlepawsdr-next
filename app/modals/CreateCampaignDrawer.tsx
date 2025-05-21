'use client'

import React, { FormEvent } from 'react'
import Drawer from 'app/components/common/Drawer'
import { setCloseDrawer } from '@redux/features/dashboardSlice'
import { useCreateCampaignMutation } from '@redux/services/campaignApi'
import { RootState, useAppDispatch, useAppSelector } from '@redux/store'
import useForm from '@hooks/useForm'
import validateCreateCampaignForm from 'app/validations/validateCreateCampaignForm'
import Spinner from 'app/components/common/Spinner'
import CreateCampaignDrawerSVG from '@public/svg/CreateCampaignDrawerSVG'

const CreateCampaignDrawer = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state: RootState) => state.dashboard)
  const [createCampaign, { isLoading: loadingCreate }] = useCreateCampaignMutation()
  const { inputs, errors, handleInput, setInputs, setErrors, submitted, setSubmitted } = useForm({ title: '' }, validateCreateCampaignForm)

  const handleCreateCampaign = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const isValid = validateCreateCampaignForm(inputs, setErrors)
    if (!isValid) return

    await createCampaign(inputs).unwrap()
    dispatch(setCloseDrawer())
    setInputs({})
  }

  return (
    <Drawer isOpen={openDrawer} onClose={() => dispatch(setCloseDrawer())}>
      <div className="relative w-full h-full overflow-hidden">
        <div className="max-w-sm w-full mx-auto mt-12">
          <p className="text-13 mb-1 text-zinc-600 dark:text-zinc-200">Campaign Title</p>
          <form onSubmit={handleCreateCampaign}>
            <div className="relative">
              <input
                name="title"
                type="text"
                alt="Campaign Title"
                value={(inputs.title as string) || ''}
                onChange={handleInput}
                className="focus:outline-none px-3 py-2 w-full rounded-md mb-6 mt-1 border-1 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600 text-jet dark:text-white text-15"
              />
              {submitted && errors.title && <div className="text-red-500 absolute bottom-2 right-0 text-xs">{errors.title}</div>}
            </div>
            <button
              type="submit"
              className="flex items-center justify-center text-white bg-azure dark:bg-celestialdrift border-none py-2 px-3 rounded-md w-full"
            >
              <div className="ml-1 text-15 text-white">
                {loadingCreate ? <Spinner fill="fill-azure dark:fill-amathystglow" /> : 'Create Campaign'}
              </div>
            </button>
          </form>
        </div>
        <div className="absolute bottom-0 right-[-145px] text-zinc-100 dark:text-zinc-800">
          <CreateCampaignDrawerSVG />
        </div>
      </div>
    </Drawer>
  )
}

export default CreateCampaignDrawer
