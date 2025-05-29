import React from 'react'
import DachshundDetailRow from './DachshundDetailRow'
import { arrowLeftIcon, dogIcon, marsIcon, venusIcon } from 'app/lib/font-awesome/icons'
import { dachshundProfileGridData } from 'app/utils/dachshundHelpers'
import Icon from '../common/Icon'
import { useRouter } from 'next/navigation'

const Divider = () => <div className="w-full h-[1px] bg-zinc-200 my-5"></div>

const SectionTitle = ({ title }: { title: string }) => <p className="text-xl text-teal-400 font-QBold mb-4">{title}</p>

const ProfileGridItem = ({ obj }: { obj: any }) => (
  <div>
    <p className="text-sm font-QBold">{obj?.title}</p>
    <p className="text-sm">{obj.textKey}</p>
  </div>
)

const DachshundInfoSection = ({ dachshund }: { dachshund: any }) => {
  const info = dachshund?.attributes
  const router = useRouter()
  return (
    <div className="col-span-12 xl:col-span-8">
      <div className="text-4xl font-QBold mb-10 text-color">{info?.name}</div>
      <DachshundDetailRow icon={dogIcon} text={info?.breedString} />
      <Divider />
      <DachshundDetailRow icon={info?.sex === 'Male' ? marsIcon : venusIcon} text={`${info?.ageGroup} ${info?.sex}`} />
      <Divider />
      <SectionTitle title="About" />
      <div className="grid grid-cols-3 gap-6">
        {dachshundProfileGridData(info).map((obj, i) => (
          <ProfileGridItem key={i} obj={obj} />
        ))}
      </div>
      <Divider />
      <SectionTitle title="Story" />
      <p
        className="mb-12"
        dangerouslySetInnerHTML={{
          __html: info?.descriptionHtml
        }}
      ></p>
      <button
        onClick={() => router.back()}
        className="text-color text-sm font-QBold uppercase p-6 flex w-fit items-center justify-center shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] rounded-2xl mb-16 hover:-translate-y-1 duration-200"
      >
        <Icon icon={arrowLeftIcon} className="mr-2" /> <span>Previous</span>
      </button>
    </div>
  )
}

export default DachshundInfoSection
