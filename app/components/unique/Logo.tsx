import Link from 'next/link'
import Picture from '../common/Picture'

export const Logo = ({ className, src }: { className: string; src: string }) => {
  return (
    <Link href="/">
      <Picture className={className} src={src} priority={false} />
    </Link>
  )
}
