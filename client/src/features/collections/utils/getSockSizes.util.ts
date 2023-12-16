export const getSockSize = (genderSizes: string[]) =>
  genderSizes.reduce((acc, curr, idx) => {
    if (isNaN(Number(curr))) {
      if (idx > 0) acc += ' / '
      return `${acc}${curr}`
    }
    return `${acc}-${curr}`
  }, '')
