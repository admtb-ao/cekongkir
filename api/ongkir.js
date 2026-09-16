export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 405, message: 'Method Not Allowed' });
  }

  const { asal, tujuan, berat, kurir } = req.body;
  const apiKey = process.env.RAJAONGKIR_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ status: 500, message: 'API Key belum diset di Vercel.' });
  }

  try {
    // Menggunakan format JSON yang lebih universal untuk API Komerce
    const response = await fetch('https://api-sandbox.komerce.id/tariff/api/v1/calculate', {
      method: 'POST',
      headers: {
        'key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        origin: Number(asal),
        destination: Number(tujuan),
        weight: Number(berat),
        courier: kurir
      })
    });

    const responseText = await response.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      // Tangkap kalau server Komerce balikin HTML error (misal 404 / 502)
      return res.status(200).json({ 
        status: 500, 
        message: `Komerce Server Error (${response.status}): ${responseText.substring(0, 150)}` 
      });
    }
    
    return res.status(200).json(data);

  } catch (error) {
    return res.status(200).json({ 
      status: 500, 
      message: `Network/Fetch Exception: ${error.message}` 
    });
  }
}
