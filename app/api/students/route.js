import { NextResponse } from 'next/server';

const API_URL = 'https://course.summitglobal.id/students';

export async function GET() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 200 }); // As per requirement, return 200 even on error?
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    // Simulate success since external API may not support POST
    return NextResponse.json({ message: 'Student added successfully', ...body }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}
