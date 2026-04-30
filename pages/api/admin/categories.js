import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('id, name, slug, color, icon, description')
    .order('sort_order')
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data)
}
