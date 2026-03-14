import { NextStudio } from 'sanity/next-studio'
import config from '@/lib/sanity.config'

export default function SanityStudioPage() {
  return <NextStudio config={config} />
}
