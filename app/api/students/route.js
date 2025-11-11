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

export async function GET(request) {
  const data = loadData();
  return NextResponse.json(data.students, { status: 200 });
}

export async function POST(request) {
  try {
    const data = loadData();
    const body = await request.json();
    const newId = data.students.length > 0 ? Math.max(...data.students.map(s => s.id)) + 1 : 1;
    data.students.push({ id: newId, ...body });
    saveData(data);
    return NextResponse.json({ id: newId, ...body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding student', error: error.message }, { status: 400 });
  }
}
