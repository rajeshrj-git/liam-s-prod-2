import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { pincode } = await req.json();

    if (!pincode || pincode.length < 6) {
      return NextResponse.json({ success: false, error: "Invalid pincode" });
    }

    // Mock distance calculation logic based on pincode length / hash
    // In a real app this would call Google Maps Distance Matrix API
    const shopPincode = process.env.NEXT_PUBLIC_SHOP_PINCODE || "629166";
    let distanceKm = 0;
    
    if (pincode === shopPincode) {
      distanceKm = 5; // Local area
    } else {
      // Mock random distance between 10 and 50 based on pincode chars
      const charSum = pincode.split("").reduce((sum: number, char: string) => sum + parseInt(char || "0", 10), 0);
      distanceKm = Math.max(10, charSum * 2);
    }

    // Delivery charge = Math.ceil(distanceKm / 10) * 50 rupees
    const charge = Math.ceil(distanceKm / 10) * 50;

    return NextResponse.json({
      success: true,
      distanceKm,
      charge,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
