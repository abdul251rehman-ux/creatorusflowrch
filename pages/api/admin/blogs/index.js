import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

const SELECT = `*, categories(id,name,slug,color,icon), authors(id,name,slug,avatar_url,role)`

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .select(SELECT)
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const body = { ...req.body }
    // set_published_at trigger only fires on UPDATE — handle INSERT manually
    if (body.status === 'published') {
      body.published = true
      if (!body.published_at) body.published_at = new Date().toISOString()
    }
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .insert(body)
      .select(SELECT)
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  res.status(405).end()
}
