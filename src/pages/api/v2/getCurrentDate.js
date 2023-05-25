export default function handler(req, res) {
    const currentDate = process.env.CURRENT_DATE
    return res.status(200).json({currentDate})
}