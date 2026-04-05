export const getHeaderLinksVisibilityClass = (priority: number) => {
  switch (priority) {
    case 1:
      return 'hidden lg:block' // always visible in nav range
    case 2:
      return 'hidden lg-2:block' // visible from 1100px
    case 3:
      return 'hidden lg-3:block' // visible from 1160px
    case 4:
      return 'hidden xl:block' // visible from 1280px
    case 5:
      return 'hidden 1336:block' // visible from 1336px
    case 6:
      return 'hidden xl-2:block' // visible from 1380px
    case 7:
      return 'hidden 2xl:block' // visible from 1536px — first to disappear
    default:
      return 'hidden lg:block'
  }
}
