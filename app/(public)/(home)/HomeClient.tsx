import { Hero } from '../../components/home-page/Hero'
import { AboutBlock } from '../../components/home-page/AboutBlock'
import { AvailableDogsBlock } from '../../components/home-page/AvailableDogsCarousel'
import { LPDRLogo } from '../../components/home-page/LPDRLogo'
import { DogGalleryBlock } from '../../components/home-page/DogGalleryBlock'
import { WaysToHelpBlock } from '../../components/home-page/WaysToHelpBlock'
import { WelcomeWienersBlock } from '../../components/home-page/WelcomeWienersBlock'
import InstagramBlock from '../../components/home-page/InstagramBlock'
import { ApplicationsBlock } from '../../components/home-page/ApplicationsBlock'

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
