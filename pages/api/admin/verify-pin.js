import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { pin } = req.body

  const { data, error } = await supabaseAdmin
    .from('admin_pin')
    .select('pin')
    .eq('id', 1)
    .single()

  if (error || !data) return res.status(500).json({ error: 'Could not fetch PIN' })

  if (String(pin) === String(data.pin)) {
    return res.status(200).json({ success: true })
  }
  return res.status(401).json({ success: false, message: 'Invalid PIN' })
}
