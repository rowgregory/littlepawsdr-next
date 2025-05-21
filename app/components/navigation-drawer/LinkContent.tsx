import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import AccordionLinks from './AccordionLink';
import { singleLinkData } from '@public/static-data/sidenavData';
import Link from 'next/link';

const LinkContent = ({ closeMenu }: { closeMenu: () => void }) => {
  const pathname = usePathname();

  const linkStyles =
    'duration-300 text-[#cbd7db] text-sm font-medium tracking-[0.1rem] grid grid-cols-[0.25fr,3fr,0.1fr] items-center text-left gap-2 px-5 py-3 uppercase hover:text-[#cbd7db] hover:no-underline hover:bg-[#213242] focus:text-[#cbd7db] focus:no-underline focus:bg-[#213242]';

  return (
    <div className="mt-20 sidenav-link-menu list-none w-full overflow-y-scroll no-scrollbar flex flex-col">
      <Link
        className={`${pathname === '/' ? 'bg-[#213242]' : ''}  ${linkStyles}`}
        href="/"
        onClick={() => closeMenu()}
      >
        <FontAwesomeIcon icon={faHome} className="mr-2" />
        Home
      </Link>
      <AccordionLinks closeMenu={closeMenu} pathname={pathname} />
      <div className="w-full px-5">
        <hr className="my-5 bg-[#556a7f] opacity-20" />
      </div>
      <div className="mb-4">
        {singleLinkData.map((link: any, i: number) => (
          <Link
            className={`${pathname === link.linkKey ? 'bg-[#213242]' : ''
              } ${linkStyles}`}
            key={i}
            href={link.linkKey}
            onClick={() => closeMenu()}
          >
            <i className={link.icon}></i>
            {link.linkText}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LinkContent;
