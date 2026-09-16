export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { asal, tujuan, berat, kurir } = req.body;
  const apiKey = process.env.BINDERBYTE_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ status: 500, message: 'API Key belum diset di Vercel.' });
  }

  try {
    const url = `https://api.binderbyte.com/v1/cost?api_key=${apiKey}&courier=${kurir}&origin=${asal}&destination=${tujuan}&weight=${berat}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Debugging aman: Teruskan apa adanya dari BinderByte ke frontend
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Gagal menghubungi server BinderByte' });
  }
}
