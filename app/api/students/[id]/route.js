import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://course.summitglobal.id/students';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `Error fetching student with ID ${id}`, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    // Soft delete by sending PUT with deleted flag
    const response = await fetch(`${API_BASE_URL}?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deleted: true }),
    });

    if (!response.ok) {
      throw new Error('Failed to soft delete student');
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to soft delete student' },
      { status: 500 }
    );
  }
}
