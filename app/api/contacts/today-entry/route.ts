import { NextRequest, NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyKpmV1kgO02GHe1gsgYgniNRTk9DWtfNbhr2-3uhQlJ9uDAB-1KTvZABD4Lxya31qRqg/exec";

export async function POST(req: NextRequest) {
  try {
    const contact = await req.json();

    console.log("Received contact for today entry:", contact);

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      throw new Error(`Apps Script Error: ${response.status}`);
    }

    const text = await response.text();
    console.log("Apps Script Response:", text);

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      result = { success: true, rawResponse: text };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown Error",
      },
      { status: 500 }
    );
  }
}