
import { NextResponse } from 'next/server';

let students = [
  { id: 1, name: 'Alice Smith', major: 'Computer Science' },
  { id: 2, name: 'Bob Johnson', major: 'Data Science' },
];
let nextId = 3;


export async function GET() {
  return NextResponse.json(students, { status: 200 });
}


export async function POST(request) {
  try {
    const body = await request.json();
    const newStudent = {
      id: nextId++,
      name: body.name || 'Unknown Student',
      major: body.major || 'Undeclared',
    };
    students.push(newStudent);
    
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding student', error: error.message }, { status: 400 });
  }
}