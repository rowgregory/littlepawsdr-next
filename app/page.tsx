import About from './components/home-page/About'
import Banner from './components/home-page/Banner'
import Contact from './components/home-page/Contact'
import FunFacts from './components/home-page/FunFacts'
import HighlightCards from './components/home-page/HighlightCards'
import SafeAndEasyDonations from './components/home-page/SafeAndEasyDonations'

const HomePage = () => {
  return (
    <div className="min-h-dvh">
      <Banner />
      <HighlightCards />
      <About />
      <Contact />
      <SafeAndEasyDonations />
      <FunFacts />
    </div>
  )
}

export default HomePage
