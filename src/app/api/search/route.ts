import { NextResponse } from "next/server";
import { Extension, MarketplaceResponse } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const sortBy = searchParams.get("sortBy") || "0";

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const apiUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json;api-version=3.0-preview.1",
      },
      body: JSON.stringify({
        filters: [
          {
            criteria: [
              { filterType: 8, value: "Microsoft.VisualStudio.Code" },
              { filterType: 10, value: query },
              { filterType: 12, value: "4096" },
            ],
            pageNumber: 1,
            pageSize: 50,
            sortBy: parseInt(sortBy),
          },
        ],
        flags: 914,
      }),
    });

    const data = (await response.json()) as MarketplaceResponse;

    if (!response.ok) {
      throw new Error("Failed to fetch extensions");
    }

    const extensions: Extension[] = data.results[0].extensions;

    return NextResponse.json({ extensions });
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json(
      { error: "Failed to search extensions" },
      { status: 500 }
    );
  }
}
