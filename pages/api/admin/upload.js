import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { fileName, fileType, fileData } = req.body
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = `${Date.now()}-${safeName}`

  const buffer = Buffer.from(fileData, 'base64')

  const { data, error } = await supabaseAdmin.storage
    .from('blog-images')
    .upload(path, buffer, { contentType: fileType, upsert: false })

  if (error) return res.status(500).json({ error: error.message })

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('blog-images')
    .getPublicUrl(data.path)

  return res.status(200).json({ url: publicUrl })
}
