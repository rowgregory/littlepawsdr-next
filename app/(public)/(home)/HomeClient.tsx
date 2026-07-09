import { Hero } from '../../components/home/hero/Hero'
import { AboutBlock } from '../../components/home/AboutBlock'
import { AvailableDogsBlock } from '../../components/home/AvailableDogsCarousel'
import { LPDRLogo } from '../../components/home/LPDRLogo'
import { DogGalleryBlock } from '../../components/home/DogGalleryBlock'
import { WaysToHelpBlock } from '../../components/home/WaysToHelpBlock'
import { WelcomeWienersBlock } from '../../components/home/WelcomeWienersBlock'
import InstagramBlock from '../../components/home/InstagramBlock'
import { ApplicationsBlock } from '../../components/home/ApplicationsBlock'

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
