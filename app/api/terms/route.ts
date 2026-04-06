import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'policy', 'Liams product terms and conditions.docx');
    const file = await readFile(filePath);
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="Liams_Terms_and_Conditions.docx"'
      }
    });
  } catch (e) {
    return new NextResponse('Not found', { status: 404 });
  }
}
