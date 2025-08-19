// app/api/matches/live/route.ts
import { NextResponse } from 'next/server';
import { CONFIG } from '@/config/config';

export async function POST(request: Request) {
    try {
        const { clientId, email, fullName } = await request.json();
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.UPDATE_PROFILE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ clientId, fullName, email }),
        });

        if (!response.ok) {
            console.error('External API error:', response.status);
            throw new Error(`External API returned ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json({
            success: false,
            status: 500,
            result: 'Something went wrong',
            title: 'Error',
            message: error instanceof Error ? error.message : 'Internal Server Error'
        }, { status: 500 });
    }
}