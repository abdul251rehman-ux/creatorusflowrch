export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { pin } = req.body
  const correct = process.env.ADMIN_PIN

  if (!correct) return res.status(500).json({ error: 'ADMIN_PIN env var not set' })

  if (pin === correct) {
    return res.status(200).json({ success: true })
  }
  return res.status(401).json({ success: false, message: 'Invalid PIN' })
}
