'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import validateLoginForm from 'app/validations/validateLoginForm'
import { useLoginMutation } from '@redux/services/authApi'
import Picture from 'app/components/common/Picture'
import AwesomeIcon from 'app/components/common/AwesomeIcon'
import { eyeIcon, eyeSlashIcon } from 'app/lib/font-awesome/icons'
import createFormActions from '@redux/features/form/formActions'
import { RootState, useAppDispatch, useAppSelector } from '@redux/store'

const Login = () => {
  const { push } = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('loginForm', dispatch)
  const { loginForm } = useAppSelector((state: RootState) => state.form)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const isValid = validateLoginForm(loginForm?.inputs, setErrors)
    if (!isValid) return

    const data = await login({ email: loginForm?.inputs.email.toLowerCase(), password: loginForm?.inputs.password }).unwrap()

    if (data?.isAdmin) {
      push('/admin')
    } else if (data?.isSupporter) {
      push('/')
    }
  }

  return (
    <div className="bg-white min-h-dvh flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <Link href="/">
          <Picture src="/images/logo-purple.png" className="w-44 mb-4 mx-auto" priority={false} />
        </Link>
        <p className="font-Matter-Medium text-2xl text-center mb-2.5">Sign In</p>
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <div className="flex flex-col mb-7 w-full relative">
            <input
              className="auth-input bg-white border-[1px] border-gray-200 rounded-md mb-4 py-2.5 px-4 font-Matter-Regular focus:outline-none"
              name="email"
              onChange={handleInput}
              type="email"
              alt="Email"
              value={loginForm?.inputs.email || ''}
            />
            {loginForm?.errors.email && (
              <span className="text-red-500 flex self-end mt-1 text-11 absolute -bottom-5 animate-fadeIn">{loginForm?.errors.email}</span>
            )}
          </div>
          <div className="flex flex-col mb-7 w-full relative">
            <input
              className="auth-input bg-white border-[1px] w-full border-gray-200 rounded-md mb-4 py-2.5 px-4 font-Matter-Regular focus:outline-none"
              name="password"
              onChange={handleInput}
              type={showPassword ? 'text' : 'password'}
              alt="Password"
              value={loginForm?.inputs.password}
            />
            {loginForm?.errors.password && (
              <span className="text-red-500 flex self-end mt-1 text-11 absolute -bottom-5 animate-fadeIn">{loginForm?.errors.password}</span>
            )}
            <AwesomeIcon
              icon={showPassword ? eyeIcon : eyeSlashIcon}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-4 right-2"
            />
          </div>
          <Link className="text-sm text-teal-400" href="/auth/forgot-password">
            Forgot password
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="py-2 w-full bg-teal-300 text-white font-Matter-Regular rounded-md mt-4 flex items-center justify-center"
          >
            Sign{isLoading && 'ing'} in{isLoading && '...'}
          </button>
        </form>
        <p className="text-sm text-gray-700 text-center mt-3">
          New to Little Paws Dachshund Rescue?{' '}
          <Link className="text-teal-500" href="/auth/register">
            Sign up.
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
