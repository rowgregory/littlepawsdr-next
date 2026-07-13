import { AboutBlock } from 'app/components/features/home/AboutBlock'
import { ApplicationsBlock } from 'app/components/features/home/ApplicationsBlock'
import { AvailableDogsBlock } from 'app/components/features/home/AvailableDogsCarousel'
import { DogGalleryBlock } from 'app/components/features/home/DogGalleryBlock'
import { Hero } from 'app/components/features/home/hero/Hero'
import InstagramBlock from 'app/components/features/home/InstagramBlock'
import { LPDRLogo } from 'app/components/features/home/LPDRLogo'
import { WaysToHelpBlock } from 'app/components/features/home/WaysToHelpBlock'
import { WelcomeWienersBlock } from 'app/components/features/home/WelcomeWienersBlock'

export const HomeClient = ({ dachshunds, welcomeWieners }) => {
  return (
    <>
      <Hero />
      <AboutBlock />
      <AvailableDogsBlock data={dachshunds?.data?.data} />
      <LPDRLogo />
      <DogGalleryBlock />
      <WaysToHelpBlock />
      <ApplicationsBlock />
      <WelcomeWienersBlock data={welcomeWieners?.data} />
      <InstagramBlock />
    </>
  )
}
