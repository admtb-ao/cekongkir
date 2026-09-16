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
    // Komerce Sandbox Endpoint menggunakan form-urlencoded
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
    
    // Format agar cocok dibaca oleh frontend tabel kita
    if (data.status === 200 || (data.rajaongkir && data.rajaongkir.status.code === 200)) {
      const results = data.data || data.rajaongkir.results;
      return res.status(200).json({
        status: 200,
        data: results
      });
    } else {
      return res.status(400).json({ 
        status: 400, 
        message: data.message || data.rajaongkir?.status?.description || 'Gagal menghitung tarif' 
      });
    }

  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Gagal menghubungi server Komerce Sandbox' });
  }
}
