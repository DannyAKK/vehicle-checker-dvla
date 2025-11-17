// DVLA API Integration for Vercel
const DVLA_API_KEY = process.env.DVLA_API_KEY;
const DVLA_API_URL = "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { registrationNumber } = req.body;

    if (!registrationNumber || typeof registrationNumber !== "string") {
      return res.status(400).json({ error: "Valid registration number is required" });
    }

    const cleanReg = registrationNumber.replace(/\s/g, "").toUpperCase();
    const ukRegPattern = /^[A-Z]{1,3}[0-9]{1,4}[A-Z]{1,3}$/;

    if (!ukRegPattern.test(cleanReg)) {
      return res.status(400).json({ error: "Invalid UK registration number format" });
    }

    const dvlaResponse = await fetch(DVLA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": DVLA_API_KEY,
      },
      body: JSON.stringify({ registrationNumber: cleanReg }),
    });

    const errors = {
      400: "Invalid registration number",
      404: "Vehicle not found in DVLA database",
      429: "Too many requests. Please try again later",
      500: "DVLA service temporarily unavailable",
    };

    if (!dvlaResponse.ok) {
      return res.status(dvlaResponse.status).json({ error: errors[dvlaResponse.status] });
    }

    const data = await dvlaResponse.json();
    return res.status(200).json({ success: true, registrationNumber: cleanReg, data });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
