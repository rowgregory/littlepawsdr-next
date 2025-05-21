import Link from 'next/link'
import Picture from './common/Picture'

const Logo = ({ className }: { className: string }) => {
  return (
    <Link href="/">
      <Picture className={className} src="/images/logo-white.webp" priority={false} />
    </Link>
  )
}

export default Logo
