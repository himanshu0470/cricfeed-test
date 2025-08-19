// app/api/matches/live/route.ts
import { NextResponse } from 'next/server';
import { CONFIG } from '@/config/config';

interface Payload {
    deviceId: string;
    userId: number;
    userType: number;
    name: string;
    sub: any;
    deviceType: number;
}

export async function POST(request: Request) {
    try {
        const { deviceId, userId, userType, name, sub, deviceType } = await request.json();
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.SAVE_DEVICE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ deviceId, userId, userType, name, sub, deviceType }),
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
            result: {
                "message": "server side error"
            },
            title: 'Error',
            message: error instanceof Error ? error.message : 'Internal Server Error'
        }, { status: 500 });
    }
}
