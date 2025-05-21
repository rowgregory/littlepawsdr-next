import Link from 'next/link';

const DachshundActionSection = ({
  dachshund,
  dogStatusId,
}: {
  dachshund: any;
  dogStatusId: string;
}) => {
  return (
    dogStatusId === '1' && (
      <div className="sticky top-3 col-span-12 xl:col-span-4 flex flex-col rounded-lg bg-teal-400 h-fit px-5 py-8">
        <div className="flex items-center justify-center flex-col">
          <p className="text-lg text-white text-center font-QBold mb-4">
            Considering {dachshund?.attributes?.name} for adoption?
          </p>
          <Link
            href="/adopt"
            className="font-semibold font-QBold w-full text-center p-2 duration-200 hover:no-underline uppercase bg-white rounded-full text-teal-400 hover:bg-teal-600 hover:text-white"
          >
            Start your Inquiry
          </Link>
        </div>
      </div>
    )
  );
};

export default DachshundActionSection;
