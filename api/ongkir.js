export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { asal, tujuan, berat, kurir } = req.body;
  const apiKey = process.env.RAJAONGKIR_API_KEY; // Pastikan key RajaOngkir yang dipasang di Vercel

  if (!apiKey) {
    return res.status(500).json({ status: 500, message: 'API Key belum diset di Vercel.' });
  }

  try {
    // Kurir default RajaOngkir Starter: jne, pos, tiki
    // Kalau user pilih selain itu, arahkan ke jne dulu supaya nggak error
    let selectedCourier = 'jne';
    if (kurir.includes('pos')) selectedCourier = 'pos';
    else if (kurir.includes('tiki')) selectedCourier = 'tiki';
    else if (kurir.includes('jne')) selectedCourier = 'jne';

    const response = await fetch('https://api.rajaongkir.com/starter/cost', {
      method: 'POST',
      headers: {
        'key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        origin: asal,
        destination: tujuan,
        weight: berat,
        courier: selectedCourier
      })
    });

    const data = await response.json();
    
    if (data.rajaongkir && data.rajaongkir.status.code === 200) {
      return res.status(200).json({
        status: 200,
        data: data.rajaongkir.results
      });
    } else {
      return res.status(400).json({ status: 400, message: data.rajaongkir?.status?.description || 'Gagal menghitung ongkir' });
    }

  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Gagal menghubungi server RajaOngkir' });
  }
}
