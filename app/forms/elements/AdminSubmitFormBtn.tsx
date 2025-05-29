import React, { FC, useEffect } from 'react'
import Spinner from 'app/components/common/Spinner'
import AwesomeIcon from 'app/components/common/AwesomeIcon'
import { checkIcon } from 'app/lib/font-awesome/icons'
import { useAppDispatch } from '@redux/store'
import { resetCampaignSuccess } from '@redux/features/campaignSlice'

const AdminSubmitFormBtn: FC<{ isLoading: boolean; error: string; success: boolean }> = ({ isLoading, error, success }) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(resetCampaignSuccess())
      }, 1750)
    }
  }, [dispatch, success])

  return (
    <div className="flex items-center gap-x-2">
      <button
        disabled={isLoading}
        type="submit"
        className="flex justify-center items-center px-5 py-1 text-white w-fit rounded-2xl bg-polardrift dark:bg-celestialdrift cursor-pointer"
      >
        Submit
      </button>
      {isLoading && <Spinner fill="fill-azure dark:fill-amathystglow" />}
      {error && <div className="text-xs text-red-500">{error}</div>}
      {success && <AwesomeIcon icon={checkIcon} className="w-5 h-5 text-azure dark:text-amathystglow" />}
    </div>
  )
}

export default AdminSubmitFormBtn
