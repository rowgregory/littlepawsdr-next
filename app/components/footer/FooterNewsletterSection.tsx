import React from 'react'
import Icon from '../common/Icon'
import { paperPlaneIcon } from 'app/lib/font-awesome/icons'
import createFormActions from '@redux/features/form/formActions'
import { RootState, useAppDispatch, useAppSelector } from '@redux/store'

const FooterNewsletterSection = () => {
  const dispatch = useAppDispatch()
  const { handleInput } = createFormActions('newsletterForm', dispatch)
  const { newsletterForm } = useAppSelector((state: RootState) => state.form)

  return (
    <div className="grid grid-cols-12 col-span-9 bg-[#1e1e29] rounded-2xl w-full p-4 sm:p-10  text-white items-center">
      <div className="col-span-12 sm:col-span-6">
        <h5 className="text-lg mb-3 font-QBold text-center sm:text-left">Join, Support, Rescue</h5>
        <p className="font-QLight text-sm mb-6 sm:mb-0">
          Stay updated on rescues, events, and <br /> dachshund adoption opportunities!
        </p>
      </div>

      <form className="col-span-12 sm:col-span-6 flex items-center gap-1.5 sm:gap-3">
        <input
          name="email"
          type="text"
          className="rounded-xl focus:outline-none text-color p-3 w-full"
          onChange={handleInput}
          value={newsletterForm?.inputs.email || ''}
          placeholder="Email"
        />
        <button className="h-12 max-w-[48px] w-full rounded-xl bg-teal-400 text-white flex items-center justify-center">
          <Icon icon={paperPlaneIcon} className="fa-xs" />
        </button>
      </form>
    </div>
  )
}

export default FooterNewsletterSection
