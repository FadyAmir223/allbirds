export type ProductMain = {
  _id: string
  handle: string
  name: string
  price: number
  sizes: string[]
  bestFor: string[]
  material: string
}

export type ProductEdition = {
  id: number
  handle: string
  salePrice?: number
  colorName: string
  colors: string[]
  hues: string[]
  sizesSoldOut: string[]
  images: string[]
}

export type Product = ProductMain & {
  editions: {
    edition: string
    products: ProductEdition[]
  }[]
}

export type ProductDetailed = {
  product: Product & {
    freeShipping: boolean
    gender: string
    silhouette: string
    highlights: string[]
    dropdown: {
      title: string
      content: string
    }[]
    materialFeatures: {
      image: string
      text: {
        h4: string
        h2: string
        p: string
      }
      _id: string
    }[]
    recommendations: {
      name: string
      image: string
    }[]
  }
}
