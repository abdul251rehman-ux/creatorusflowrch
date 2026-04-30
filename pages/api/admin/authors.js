import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const { data, error } = await supabaseAdmin
    .from('authors')
    .select('id, name, slug, bio, avatar_url, role')
    .eq('is_active', true)
    .order('name')
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data)
}
