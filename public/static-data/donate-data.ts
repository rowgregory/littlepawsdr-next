const oneTimeDonationOptions = [25, 35, 50, 150, 500];

const monthlyDonationOptions = [
  { amount: 5, value: "Option 1" },
  { amount: 10, value: "Option 2" },
  { amount: 20, value: "Option 3" },
  { amount: 25, value: "Option 4" },
  { amount: 50, value: "Option 5" },
  { amount: 100, value: "Option 6" },
];

const shopToHelpData = [
  {
    img: "/images/chewy.png",
    textKey:
      "Chewy Gives Back Wish List makes it easy for caring pet lovers to support Little Paws Dachshund Rescue! With just a click, you can shop online for the supplies we need, and your selected items will be sent directly to us!",
    linkKey:
      "https://www.chewy.com/g/little-paws-dachshund-resccue_b106319134#wish-list&wishlistsortby=DEFAULT",
  },
  {
    img: "/images/pet-meds.png",
    textKey:
      "Support Little Paws Dachshund Rescue by shopping through 1800PetMeds! With a few clicks, you can purchase the pet medications and supplies we need, and they’ll be shipped directly to us, helping us care for our pups.",
    linkKey: "https://www.1800petmeds.com/",
  },
  {
    img: "/images/i-give.png",
    textKey:
      "Every purchase you make through iGive can help Little Paws Dachshund Rescue! Simply shop at your favorite online stores, and a portion of your purchase will be donated to us, supporting the care and well-being of our dogs.",
    linkKey:
      "https://www.igive.com/welcome/lp19/index.cfm?c=64803&p=19992&jltest=1",
  },
  {
    img: "/images/bonfire.webp",
    textKey:
      "Show your support for Little Paws Dachshund Rescue with Bonfire! Buy our custom-designed apparel, and a portion of the proceeds will go directly to help our rescue efforts, ensuring more pups find loving homes.",
    linkKey: "https://www.bonfire.com/store/little-paws-dachshund-rescue/",
  },
];

const feedAFosterData = [
  {
    title: "One can of food",
    textKey:
      "Our special can of weed is perfect for pet lovers looking to support our furry friends! Each purchase not only provides a unique item for you but also contributes directly to feeding and caring for our foster dogs. Join us in making a difference, one can at a time!",
    img: "/images/can-of-wet-food.png",
    amount: 3,
  },
  {
    title: "Bag of dry food",
    textKey:
      "Indulge in a delicious bag of dry goods that not only satisfies your cravings but also supports our rescue efforts! Each bag sold helps ensure that our foster dogs receive the nutrition they need. Treat yourself while helping our pups thrive!",
    img: "/images/bag-of-dry-food.jpeg",
    amount: 12,
  },
  {
    title: "Case of wet food",
    textKey:
      "Our case of wet food is a game changer for our furry friends! Each can is packed with nutrients that keep our foster dogs healthy and happy. By purchasing this case, you’re directly contributing to their well-being and ensuring they receive the best care possible!",
    img: "/images/case-of-wet-food.png",
    amount: 35,
  },
];

export {
  oneTimeDonationOptions,
  monthlyDonationOptions,
  shopToHelpData,
  feedAFosterData,
};
