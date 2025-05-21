import BottomHeader from './header/BottomHeader';
import TopHeader from './header/TopHeader';

const Header = () => {
  return (
    <header className="bg-[#1a1f28] w-full h-36 px-3 flex flex-col pt-4 pb-12 relative">
      <TopHeader />
      <BottomHeader />
    </header>
  );
};

export default Header;
