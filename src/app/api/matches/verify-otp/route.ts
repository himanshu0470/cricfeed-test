// app/api/matches/live/route.ts
import { NextResponse } from 'next/server';
import { CONFIG } from '@/config/config';

interface Payload {
    clientId: string;
    mobileNo: string;
    countryCode: string;
    otp: string;
}

export async function POST(request: Request) {
    try {
        const { clientId, mobileNo, countryCode, otp } = await request.json();
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.VERIFY_OTP}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ clientId, mobileNo, countryCode, otp }),
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
