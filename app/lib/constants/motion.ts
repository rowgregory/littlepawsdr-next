export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, easign: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 }
  })
}

export const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06
    }
  }
}

export const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, easing: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } }
}
