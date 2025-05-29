'use client'

import { FormEvent, Fragment, useState } from 'react'
import { LogoPurple } from '@public/images'
import Image from 'next/image'
import Link from 'next/link'
import { useRegisterMutation } from '@redux/services/authApi'
import validateRegisterForm from 'app/validations/validateRegisterForm'
import AwesomeIcon from 'app/components/common/AwesomeIcon'
import { eyeIcon, eyeSlashIcon } from 'app/lib/font-awesome/icons'
import { useRouter } from 'next/navigation'
import createFormActions from '@redux/features/form/formActions'
import { RootState, useAppDispatch, useAppSelector } from '@redux/store'
import { setShowConfetti } from '@redux/features/stripeSlice'

const Register = () => {
  const { push } = useRouter()
  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false })
  const [register, { isLoading }] = useRegisterMutation()
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('registerForm', dispatch)
  const { registerForm } = useAppSelector((state: RootState) => state.form)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const isValid = validateRegisterForm(registerForm?.inputs, setErrors)
    if (!isValid) return

    try {
      await register({
        firstName: registerForm?.inputs.firstName,
        lastName: registerForm?.inputs.lastName,
        email: registerForm?.inputs.email,
        password: registerForm?.inputs.password
        // cameFromAuction: state?.cameFromAuction,
        // customCampaignLink: state?.customCampaignLink,
      }).unwrap()

      push('/profile')
      setShowConfetti()
    } catch {}
  }

  return (
    <Fragment>
      <div className="bg-white min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <Link href="/">
            <Image src={LogoPurple} alt="Little Paws Dachshund Rescue" className="w-44 mb-4 mx-auto" />
          </Link>
          <p className="font-Matter-Medium text-2xl text-center mb-2.5">Register</p>
          <p className="text-gray-400 text-sm font-Matter-Regular text-center mb-4">Sign up or sign in to an existing account to start bidding</p>
          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col">
                <label className="font-Matter-Medium text-sm mb-1" htmlFor="firstName">
                  First name*
                </label>
                <input
                  className="auth-input bg-white border-[1px] border-gray-200 rounded-md mb-4 py-2.5 px-4 font-Matter-Regular focus:outline-none "
                  name="firstName"
                  onChange={handleInput}
                  type="text"
                  alt="First Name"
                  value={registerForm?.inputs.firstName || ''}
                />
              </div>
              <div className="flex flex-col">
                <label className="font-Matter-Medium text-sm mb-1" htmlFor="lastName">
                  Last name*
                </label>
                <input
                  className="auth-input bg-white border-[1px] border-gray-200 rounded-md mb-4 py-2.5 px-4 font-Matter-Regular focus:outline-none "
                  name="lastName"
                  onChange={handleInput}
                  type="text"
                  alt="Last Name"
                  value={registerForm?.inputs.lastName || ''}
                />
              </div>
            </div>
            <label className="font-Matter-Medium text-sm mb-1" htmlFor="email">
              Email*
            </label>
            <input
              className="auth-input bg-white border-[1px] border-gray-200 rounded-md mb-4 py-2.5 px-4 font-Matter-Regular focus:outline-none "
              name="email"
              onChange={handleInput}
              type="email"
              alt="Email"
              value={registerForm?.inputs.email || ''}
            />
            <label className="font-Matter-Medium text-sm mb-1" htmlFor="password">
              Password*{' '}
              <i
                // onClick={() => setModal({ open: true, help: true, text: '' })}
                className="fa-solid fa-circle-exclamation text-sm text-teal-300 cursor-pointer"
              ></i>
            </label>
            <div className="flex relative">
              <input
                className="auth-input bg-white border-[1px] w-full border-gray-200 rounded-md mb-4 py-2.5 px-4 font-Matter-Regular focus:outline-none"
                name="password"
                onChange={handleInput}
                type={showPassword.password ? 'text' : 'password'}
                alt="Password"
                value={registerForm?.inputs.password || ''}
              />
              <i
                onClick={() =>
                  setShowPassword((prev: any) => ({
                    ...prev,
                    password: !showPassword.password
                  }))
                }
                className={`fa-solid ${showPassword.password ? 'fa-eye' : 'fa-eye-slash'} absolute top-4 right-2`}
              ></i>
            </div>
            <label className="font-Matter-Medium text-sm mb-1" htmlFor="confirmPassword">
              Confirm Password*
            </label>
            <div className="flex relative">
              <input
                className="auth-input bg-white border-[1px] w-full border-gray-200 rounded-md mb-4 py-2.5 px-4 font-Matter-Regular focus:outline-none"
                name="confirmPassword"
                onChange={handleInput}
                type={showPassword.confirmPassword ? 'text' : 'password'}
                alt="Confirm Password"
                value={registerForm?.inputs.confirmPassword || ''}
              />
              <AwesomeIcon
                icon={showPassword.confirmPassword ? eyeIcon : eyeSlashIcon}
                onClick={() =>
                  setShowPassword((prev: any) => ({
                    ...prev,
                    confirmPassword: !showPassword.confirmPassword
                  }))
                }
                className="absolute top-4 right-2"
              />
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="py-2 w-full bg-teal-300 text-white font-Matter-Regular rounded-md mt-4 flex items-center justify-center"
            >
              Sign{isLoading && 'ing'} up{isLoading && '...'}
            </button>
          </form>
          {/* <p className='text-xs text-gray-500 text-center mt-2'>
            By creating an account, you agree to the{' '}
            <Link
              className='text-gray-900 font-Matter-Medium hover:text-teal-300'
              to={termsOfServiceLinkKey}
            >
              Terns of Service
            </Link>{' '}
            and{' '}
            <Link
              className='text-gray-900 font-Matter-Medium hover:text-teal-300'
              to={privacyPolicyLinkKey}
            >
              Privacy Policy
            </Link>
          </p>
          <p className='text-sm text-gray-700 text-center mt-3'>
            Already have an account?{' '}
            <Link className='text-teal-500' to='/auth/login'>
              Sign in.
            </Link>
          </p> */}
        </div>
      </div>
    </Fragment>
  )
}

export default Register
