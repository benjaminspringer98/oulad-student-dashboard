// TODO: prolly not needed anymore with next public env variables
export default function handler(req, res) {
  const currentDate = process.env.NEXT_PUBLIC_CURRENT_DATE;
  return res.status(200).json({ currentDate });
}
