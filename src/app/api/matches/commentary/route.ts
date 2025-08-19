import { CONFIG } from "@/config/config";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { eid } = await request.json();

        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.GET_COMMENTARY_BY_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ eid }),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch commentary' }, { status: 500 });
    }
}