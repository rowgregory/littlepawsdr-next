import { Hero } from '../home-page/Hero'
import { AboutBlock } from '../home-page/AboutBlock'
import { AvailableDogsBlock } from '../home-page/AvailableDogsCarousel'
import { LPDRLogo } from '../home-page/LPDRLogo'
import { DogGalleryBlock } from '../home-page/DogGalleryBlock'
import { WaysToHelpBlock } from '../home-page/WaysToHelpBlock'
import { WelcomeWienersBlock } from '../home-page/WelcomeWienersBlock'
import InstagramBlock from '../home-page/InstagramBlock'

export const HomeClient = ({ dachshunds, welcomeWieners }) => {
  return (
    <div className="min-h-dvh">
      <Hero />
      <AboutBlock />
      <AvailableDogsBlock data={dachshunds?.data?.data} />
      <LPDRLogo />
      <DogGalleryBlock />
      <WaysToHelpBlock />
      <WelcomeWienersBlock data={welcomeWieners?.data} />
      <InstagramBlock />
    </div>
  )
}
