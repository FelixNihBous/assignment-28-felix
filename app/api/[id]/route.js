import { NextResponse } from 'next/server';
import { data } from '../data.js';

function findStudentIndex(id) {
    return data.students.findIndex(s => s.id === parseInt(id));
}


export async function PUT(request, { params }) {
  const id = params.id;
  const index = findStudentIndex(id);

  if (index === -1) {
    return NextResponse.json({ message: `Student with ID ${id} not found` }, { status: 404 });
  }

  try {
    const body = await request.json();
    data.students[index] = {
      ...data.students[index],
      ...body,
      id: data.students[index].id,
    };
    return NextResponse.json(data.students[index], { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating student', error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const id = params.id;
  const index = findStudentIndex(id);

  if (index === -1) {
    return NextResponse.json({ message: `Student with ID ${id} not found` }, { status: 404 });
  }

  data.students.splice(index, 1);
  return NextResponse.json({ message: `Student with id ${id} deleted successfully` }, { status: 200 });
}
