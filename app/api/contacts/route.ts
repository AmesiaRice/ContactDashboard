import { NextResponse } from "next/server";
import { Contact, SheetResponse } from "@/lib/types";

export async function GET() {
  const scriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json(
      {
        status: "error",
        data: [],
        message:
          "NEXT_PUBLIC_APPS_SCRIPT_URL is not set in .env.local",
      } satisfies SheetResponse,
      { status: 500 }
    );
  }

  try {
    const res = await fetch(scriptUrl, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Apps Script returned status ${res.status}`);
    }

    const json = await res.json();

    // Normalise whatever the Apps Script returns into our Contact shape
    // Apps Script typically returns an array of row objects keyed by column header
    const rows: Record<string, string>[] = Array.isArray(json)
      ? json
      : json.data ?? [];

    const data: Contact[] = rows.map((row) => ({
      timestamp: row["Timestamp"] ?? row["timestamp"] ?? "",
      name: row["Name"] ?? row["name"] ?? "",
      phone: row["Phone No"] ?? row["phone"] ?? "",
      company: row["Company Name"] ?? row["company"] ?? "",
      address: row["Address"] ?? row["address"] ?? "",
      email: row["Email"] ?? row["email"] ?? "",
      city: row["City"] ?? row["city"] ?? "",
      pincode: row["Pincode"] ?? row["pincode"] ?? "",
      contactType: row["Contact Type"] ?? row["contactType"] ?? "",
      remarks: row["Remarks"] ?? row["remarks"] ?? "",
    }));

    const response: SheetResponse = { status: "success", data };
    return NextResponse.json(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { status: "error", data: [], message } satisfies SheetResponse,
      { status: 500 }
    );
  }
}
