import { Studio } from 'sanity'
import config from '@/lib/sanity.config'

export default function SanityStudioPage() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <Studio config={config} />
    </div>
  )
}
