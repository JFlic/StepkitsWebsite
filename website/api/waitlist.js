// NOTE: Supabase persistence disabled for initial Vercel deploy.
// Re-enable by uncommenting below and setting SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY env vars in Vercel.
// const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body ?? {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  // --- Supabase disabled for base deploy: accept email, don't persist ---
  console.log('Waitlist signup (not persisted):', email.toLowerCase().trim());
  return res.json({ ok: true });

  /*
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Missing Supabase configuration' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { error } = await supabase
    .from('waitlist')
    .insert({ email: email.toLowerCase().trim() });

  // 23505 = unique constraint violation (duplicate email) — silent success
  if (error && error.code !== '23505') {
    console.error('Supabase error:', error.message);
    return res.status(500).json({ error: 'Failed to save email' });
  }

  return res.json({ ok: true });
  */
};
