import { Hero } from '../home-page/Hero'
import { AboutBlock } from '../home-page/AboutBlock'
import { AvailableDogsBlock } from '../home-page/AvailableDogsCarousel'
import { LPDRLogo } from '../home-page/LPDRLogo'
import { DogGalleryBlock } from '../home-page/DogGalleryBlock'
import { WaysToHelpBlock } from '../home-page/WaysToHelpBlock'
import { WelcomeWienersBlock } from '../home-page/WelcomeWienersBlock'
import InstagramBlock from '../home-page/InstagramBlock'

export const HomeClient = ({ data }) => {
  return (
    <div className="min-h-dvh">
      <Hero />
      <AboutBlock />
      <AvailableDogsBlock data={data?.dachshunds} />
      <LPDRLogo />
      <DogGalleryBlock />
      <WaysToHelpBlock />
      <WelcomeWienersBlock data={data?.dachshunds?.data?.data} />
      <InstagramBlock />
    </div>
  )
}
