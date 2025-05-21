import React from 'react'
import Picture from '../common/Picture'
import Link from 'next/link'

const FeedAFosterCard = ({ obj }: { obj: any }) => {
  return (
    <div className="col-span-12 lg:col-span-4 flex flex-col shadow-lg p-5 rounded-2xl">
      <div className="bg-white p-2 w-fit rounded-2xl">
        <Picture src={obj.img} className="h-24 w-24 aspect-video object-cover self-center rounded-2xl" priority={false} />
      </div>
      <h3 className="mt-6 mb-3 font-QBold text-2xl">{obj.title}</h3>
      <p className="text-[#9d9d9d] mb-10">{obj.textKey}</p>
      <Link
        href={{
          pathname: '/donate/feed-a-foster/checkout',
          query: { amount: obj.amount, title: obj.title }
        }}
        className="bg-teal-400 w-fit text-white font-QBold px-6 py-2.5 rounded-2xl"
      >
        Donate ${obj.amount}
      </Link>
    </div>
  )
}

export default FeedAFosterCard
