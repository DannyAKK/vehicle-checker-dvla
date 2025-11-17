const DVLA_API_KEY = process.env.DVLA_API_KEY;
const DVLA_API_URL = "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles";

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: '{"error":"Method not allowed"}' };

  try {
    const { registrationNumber } = JSON.parse(event.body);

    if (!registrationNumber) {
      return { statusCode: 400, headers, body: '{"error":"Valid registration number is required"}' };
    }

    const cleanReg = registrationNumber.replace(/\s/g, "").toUpperCase();
    const ukRegPattern = /^[A-Z]{1,3}[0-9]{1,4}[A-Z]{1,3}$/;

    if (!ukRegPattern.test(cleanReg)) {
      return { statusCode: 400, headers, body: '{"error":"Invalid UK registration number format"}' };
    }

    const response = await fetch(DVLA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": DVLA_API_KEY
      },
      body: JSON.stringify({ registrationNumber: cleanReg }),
    });

    const errors = {
      400: "Invalid registration number",
      404: "Vehicle not found",
      429: "Too many requests",
      500: "DVLA service unavailable"
    };

    if (!response.ok) {
      return { statusCode: response.status, headers, body: `{"error":"${errors[response.status]}` };
    }

    const data = await response.json();
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, registrationNumber: cleanReg, data }) };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: '{"error":"Internal server error"}' };
  }
};
