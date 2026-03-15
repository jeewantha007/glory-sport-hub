import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision' 
import { schemaTypes } from '../../gloryofsports/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'GloryofSports',

  projectId: '09qbsqtb',
  dataset: 'production',
  basePath: '/admin/studio',

  plugins: [structureTool(), visionTool()],

  schema: {
    // @ts-ignore
    types: schemaTypes,
  },
})
