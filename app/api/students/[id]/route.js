import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data.json');

function loadData() {
  if (fs.existsSync(dataFile)) {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  }
  return { students: [] };
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

export async function GET(request, { params }) {
  const { id } = await params;
  const data = loadData();
  const student = data.students.find(s => s.id === parseInt(id));

  if (!student) {
    return NextResponse.json({ message: `Student with ID ${id} not found` }, { status: 404 });
  }

  return NextResponse.json(student, { status: 200 });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const data = loadData();
  const index = data.students.findIndex(s => s.id === parseInt(id));

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
    saveData(data);
    return NextResponse.json(data.students[index], { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating student', error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const data = loadData();
  const index = data.students.findIndex(s => s.id === parseInt(id));

  if (index === -1) {
    return NextResponse.json({ message: `Student with ID ${id} not found` }, { status: 404 });
  }

  data.students.splice(index, 1);
  saveData(data);
  return NextResponse.json({ message: `Student with id ${id} deleted successfully` }, { status: 200 });
}
