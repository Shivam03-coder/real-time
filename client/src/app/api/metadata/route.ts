// app/api/metadata/route.ts
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for") ||
    null;

  const userAgent = request.headers.get("user-agent") || "";
  const referrer = request.headers.get("referer") || "";

  // Fetch country using ipwho.is (free, no API key needed)
  let country = null;
  try {
    const ipRes = await fetch("https://ipwho.is/");
    const ipData = await ipRes.json();
    if (ipData.success) {
      country = ipData.country; // Country name like "India"
    }
  } catch (err) {
    console.error("Failed to fetch country:", err);
  }

  return new Response(
    JSON.stringify({
      country,
      device: getDeviceType(userAgent),
      referrer,
      ipAddress: ip,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return "mobile";
  if (/tablet/i.test(userAgent)) return "tablet";
  if (/iPad|iPhone|iPod/.test(userAgent)) return "ios";
  if (/Android/.test(userAgent)) return "android";
  return "desktop";
}
