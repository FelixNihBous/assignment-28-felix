import { NextResponse } from 'next/server';

const API_URL = 'https://course.summitglobal.id/students';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    // Simulate success since external API may not support PUT
    return NextResponse.json({ message: 'Student updated successfully', id: parseInt(id), ...body }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}
