import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

const SELECT = `*, categories(id,name,slug,color,icon), authors(id,name,slug,avatar_url,role)`

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PUT') {
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .update(req.body)
      .eq('id', id)
      .select(SELECT)
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin.from('blogs').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
