export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { asal, tujuan, berat, kurir } = req.body;
  // Memakai API Key yang sama yang sudah kamu set di Vercel
  const apiKey = process.env.RAJAONGKIR_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ status: 500, message: 'API Key belum diset di Vercel.' });
  }

  try {
    // Endpoint resmi Komerce Tariff API
    const response = await fetch('https://api.komerce.id/tariff/api/v1/calculate', {
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
    
    // Teruskan respons dari Komerce langsung ke frontend
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Gagal menghubungi server Komerce' });
  }
}
