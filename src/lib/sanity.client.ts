import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: '09qbsqtb',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2024-03-14', // use current date (YYYY-MM-DD) to target the latest API version
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

export const newsQueries = {
  allNews: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "image_url": mainImage.asset->url,
    publishedAt,
    "categories": categories[]->title
  }`,
  newsBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    "meta_description": excerpt,
    "featured_image": mainImage.asset->url,
    publishedAt,
    body,
    "categories": categories[]->title,
    tags,
    source,
    sourceUrl
  }`,
  recentNews: `*[_type == "post"] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "image_url": mainImage.asset->url,
    publishedAt
  }`
}
