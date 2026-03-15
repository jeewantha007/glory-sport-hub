import { Studio } from 'sanity'
import config from '@/lib/sanity.config'

export default function SanityStudioPage() {
  return <Studio config={config} />
}
