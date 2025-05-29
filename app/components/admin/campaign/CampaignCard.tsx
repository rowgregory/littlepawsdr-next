import React, { FC } from 'react'
import Link from 'next/link'
import CountdownTimer from 'app/components/common/CountdownTimer'
import AwesomeIcon from 'app/components/common/AwesomeIcon'
import { gavelIcon } from 'app/lib/font-awesome/icons'

const CampaignCard: FC<{ title: string; campaignId: string; startDate: any; totalGrossCampaignRevenue: any }> = ({
  title,
  campaignId,
  startDate,
  totalGrossCampaignRevenue
}) => {
  return (
    <Link
      href={`/admin/campaigns/${campaignId}/details`}
      className="col-span-12 990:col-span-6 aspect-[16/8] p-6 bg-clouddrift dark:bg-duskfade rounded-xl border-1 border-zinc-100 dark:border-slate flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-shadow dark:text-zinc-300 font-semibold text-19 mb-4">{title}</h3>
          <AwesomeIcon
            icon={gavelIcon}
            className={`w-4 h-4 text-azure dark:text-amathystglow group-hover:rotate-45 duration-300 ease-in origin-bottom`}
          />
        </div>
        <h3 className="text-shadow dark:text-zinc-500 text-sm">Campaign Id:{campaignId}</h3>
        <CountdownTimer startDate={startDate} />
        <h4>{totalGrossCampaignRevenue}</h4>
      </div>
      <div className="text-white bg-polardrift dark:bg-celestialdrift px-5 py-1 rounded-2xl w-fit text-sm">Manage</div>
    </Link>
  )
}

export default CampaignCard
