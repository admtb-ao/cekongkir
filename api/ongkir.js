export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { asal, tujuan, berat, kurir } = req.body;
  const apiKey = process.env.RAJAONGKIR_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ status: 500, message: 'API Key belum diset di Vercel.' });
  }

  try {
    // Menggunakan Endpoint Sandbox Komerce Tariff API
    const response = await fetch('https://api-sandbox.komerce.id/tariff/api/v1/calculate', {
      method: 'POST',
      headers: {
        'key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        origin: asal,
        destination: tujuan,
        weight: berat,
        courier: kurir
      })
    });

    const data = await response.json();
    
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Gagal menghubungi server Sandbox Komerce' });
  }
}
