import { PaymentMethod } from '@stripe/stripe-js'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Pusher from 'pusher-js'
import { useRef } from 'react'
import { store } from '../store/store'
import { setHideConfetti, setShowConfetti } from '../store/slices/uiSlice'
import { setAdoptionFeeCookie } from '../actions/_infra/setAdoptionFeeCookie'
import { savePaymentMethod } from '../actions/_stripe/savePaymentMethod'

export function usePaymentProcessor() {
  const router = useRouter()
  const session = useSession()
  const hasProcessedOrder = useRef(false)
  const hasProcessedRecurringOrder = useRef(false)
  const processingStatusRef = useRef<string>('idle')

  const getPaymentMethodId = (paymentMethod: string | PaymentMethod | undefined): string | undefined => {
    return typeof paymentMethod === 'string' ? paymentMethod : paymentMethod?.id
  }

  const setupPusherListenerOneTime = (
    saveCard?: boolean,
    paymentMethod?: string,
    setError?: (v: string) => void,
    setLoading?: (v: boolean) => void
  ) => {
    processingStatusRef.current = 'processing'
    hasProcessedOrder.current = false

    const channelId = session?.data?.user?.id
    if (!channelId) return

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    })
    const channel = pusher.subscribe(`payment-${channelId}`)

    const timeout = setTimeout(() => {
      if (processingStatusRef.current === 'processing') {
        processingStatusRef.current = 'failed'
        setError?.('Order processing timeout. Please check your email for confirmation.')
        setLoading?.(false)
      }
    }, 10000)

    channel.bind('order-created', async (data: any) => {
      if (hasProcessedOrder.current) return
      hasProcessedOrder.current = true

      clearTimeout(timeout)
      processingStatusRef.current = 'success'

      if (saveCard && session?.data?.user?.id && paymentMethod) {
        savePaymentMethod(session?.data?.user?.id, paymentMethod as string, true).catch(console.error)
      }

      if (data.type === 'ADOPTION_FEE') {
        if (data.adoptionFeeId) {
          await setAdoptionFeeCookie(data.adoptionFeeId)
        }
        router.push(`/adopt/application`)
      } else {
        router.push(`/order-confirmation/${data.orderId}`)
      }
      channel.unbind_all()
      pusher.unsubscribe(`payment-${channelId}`)

      store.dispatch(setShowConfetti())
      setTimeout(() => {
        setLoading?.(false)
        store.dispatch(setHideConfetti())
      }, 2000)
    })

    channel.bind('order-failed', (data: any) => {
      clearTimeout(timeout)
      processingStatusRef.current = 'failed'
      setError?.(data.error || 'Order processing failed')
      setLoading?.(false)
      channel.unbind('order-created')
      channel.unbind('order-failed')
    })
  }

  const setupPusherListenerRecurring = (
    subscriptionResult?: any,
    setError?: any,
    setLoading?: any,
    saveCard?: boolean,
    paymentMethodId?: string | PaymentMethod
  ) => {
    const channelId = `payment-${subscriptionResult.subscriptionId}`

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    })

    const channel = pusher.subscribe(channelId)

    const timeout = setTimeout(() => {
      if (processingStatusRef.current === 'processing') {
        setError('Order processing timeout. Please check your email for confirmation.')
        processingStatusRef.current = 'failed'
        setLoading(false)
      }
    }, 10000)

    channel.bind('order-created', (data: any) => {
      if (hasProcessedRecurringOrder.current) return
      hasProcessedRecurringOrder.current = true

      clearTimeout(timeout)
      processingStatusRef.current = 'success'

      if (saveCard && session?.data?.user?.id && paymentMethodId) {
        savePaymentMethod(session?.data?.user?.id, paymentMethodId as string, true).catch(console.error)
      }

      router.push(`/order-confirmation/${data.orderId}`)
      channel.unbind_all()
      pusher.unsubscribe(channelId)

      store.dispatch(setShowConfetti())
      setTimeout(() => {
        setLoading(false)
        store.dispatch(setHideConfetti())
      }, 2000)
    })

    channel.bind('order-failed', (data: any) => {
      clearTimeout(timeout)
      processingStatusRef.current = 'failed'
      setLoading(false)
      setError(data.error || 'Order processing failed')
      channel.unbind_all()
      pusher.unsubscribe(channelId)
    })
  }

  return {
    getPaymentMethodId,
    setupPusherListenerOneTime,
    setupPusherListenerRecurring
  }
}
