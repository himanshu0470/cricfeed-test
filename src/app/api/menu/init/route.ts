// app/api/menu/init/route.ts
import { NextResponse } from 'next/server';
import { CONFIG } from '@/config/config';

export async function POST(request: Request) {
    try {
        const { whitelabelId = "" } = await request.json();
        // Log the incoming request
        const fullUrl = `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.GET_INIT_DATA}`;

        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.GET_INIT_DATA}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ whitelabelId }),
        });

        // Log the response status

        if (!response.ok) {
            // Log error details
            const errorText = await response.text();
            console.error('External API error:', errorText);

            throw new Error(`External API returned ${response.status}`);
        }

        const data = await response.json();

        // Log successful response

        return NextResponse.json(data);
    } catch (error) {
        // Log the full error
        console.error('API Route Error:', error);

        return NextResponse.json(
            {
                success: false,
                status: 500,
                result: {
                    menuItems: [],
                    pages: [],
                    banner: [],
                    news: [],
                    competitions: [],
                    blocks: [],
                },
                title: 'Error',
                message: error instanceof Error ? error.message : 'Internal Server Error',
            },
            { status: 500 }
        );
    }
}