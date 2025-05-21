import Link from 'next/link';

const Results = ({ searchResults, closeMenu }: any) => {
  const resultData = [
    {
      searchKey: 'dachshunds',
      textKey: 'Dachshunds',
    },
    {
      searchKey: 'products',
      textKey: 'Products',
    },
    {
      searchKey: 'ecards',
      textKey: 'Ecards',
    },
    {
      searchKey: 'welcomeWieners',
      textKey: 'Welcome Wieners',
    },
  ];

  const url = (data: any, item: any) => {
    const key = data.searchKey;
    return key === 'dachshunds'
      ? `/about/type/${item.id}`
      : key === 'products'
      ? `/merch/${item._id}`
      : key === 'ecards'
      ? `/ecard/personalize/${item._id}`
      : `/welcome-wiener/${item._id}`;
  };

  const showResults = !Object.values(searchResults)?.every(
    (array: any) => array.length === 0
  );

  return (
    <div className={`${showResults ? 'block' : 'hidden'} px-5 pt-3`}>
      {resultData.map((data: any, i: number) => (
        <div
          className={`${
            searchResults[data.searchKey]?.length > 0 ? 'block' : 'hidden'
          } text-[#f5f5f5] mb-3`}
          key={i}
        >
          <div className="text-[#afbec3] mb-1">{data.textKey}</div>
          {searchResults?.[data.searchKey]
            ?.map((item: any, k: number) => (
              <Link
                className="duration-300 text-[#cbd7db] font-medium tracking-[0.25rem] w-full flex items-center px-5 py-3.5 mb-1 hover:bg-[#1b2a39]"
                href={url(data, item)}
                key={k}
                onClick={() => closeMenu()}
              >
                <div className="my-1" style={{ color: '#cbd7db' }}>
                  {item?.name}
                </div>
              </Link>
            ))
            .filter((_: any, i: number) => i < 11)}
        </div>
      ))}
      <div className="w-full bg-[#556a7f]">
        <hr className="my-5" />
      </div>
    </div>
  );
};

export default Results;
