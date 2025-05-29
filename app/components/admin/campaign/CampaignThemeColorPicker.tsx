import campaignThemeColors from '@public/static-data/campaitn-theme-colors'
import React, { FC } from 'react'

const CampaignThemeColorPicker: FC<{ setInputs: any; value: any; error: any }> = ({ setInputs, value, error }) => {
  return (
    <div className="flex flex-col w-full my-3 relative">
      <div className="flex flex-wrap gap-0.5 h-fit">
        {campaignThemeColors?.map((obj: any, i: number) => (
          <div
            onClick={() => setInputs((prev: any) => ({ ...prev, themeColor: obj }))}
            key={i}
            style={{ backgroundColor: obj.dark }}
            className={`relative z-10 rounded-md h-8 w-8 flex items-center justify-center cursor-pointer`}
          >
            {value === obj?.dark && <div className="bg-white h-2 w-2 rounded-full"></div>}
          </div>
        ))}
      </div>
      {error && <div className="text-xs text-red-500 font-medium absolute -bottom-1 right-0">{error}</div>}
    </div>
  )
}

export default CampaignThemeColorPicker
