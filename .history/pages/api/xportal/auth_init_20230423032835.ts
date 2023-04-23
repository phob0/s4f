
export default async function myApi(req, res) {
  const { city } = req.query;

  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHERMAP_API_KEY}`);

  const data = await response.json();

  res.json(data);
}
