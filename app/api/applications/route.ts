import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const ApplicationSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  position: z.string().min(1).max(120),
  experience: z.string().max(40),
  rightToWork: z.enum(['yes', 'sponsorship', 'no']),
  message: z.string().max(2000).optional(),
});

function validateFile(f: File | null, required: boolean, field: string): string | null {
  if (!f || f.size === 0) return required ? `${field} is required` : null;
  if (f.size > MAX_FILE_BYTES) return `${field} must be 5 MB or smaller`;
  if (!ALLOWED_MIME.has(f.type)) return `${field} must be a PDF or Word document`;
  return null;
}

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const fields = {
    firstName: String(form.get('firstName') ?? '').trim(),
    lastName: String(form.get('lastName') ?? '').trim(),
    email: String(form.get('email') ?? '').trim(),
    phone: String(form.get('phone') ?? '').trim() || undefined,
    position: String(form.get('position') ?? '').trim(),
    experience: String(form.get('experience') ?? '').trim(),
    rightToWork: String(form.get('rightToWork') ?? '').trim(),
    message: String(form.get('message') ?? '').trim() || undefined,
  };

  const parsed = ApplicationSchema.safeParse(fields);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        ...(process.env.NODE_ENV !== 'production' && { details: z.flattenError(parsed.error).fieldErrors }),
      },
      { status: 422 },
    );
  }

  const resume = form.get('resume');
  const coverLetter = form.get('coverLetter');
  const resumeFile = resume instanceof File ? resume : null;
  const coverFile = coverLetter instanceof File ? coverLetter : null;

  const resumeErr = validateFile(resumeFile, true, 'Resume');
  if (resumeErr) return NextResponse.json({ error: resumeErr }, { status: 422 });
  const coverErr = validateFile(coverFile, false, 'Cover letter');
  if (coverErr) return NextResponse.json({ error: coverErr }, { status: 422 });

  const ref = `EMB-${Date.now().toString(36).toUpperCase()}`;

  console.log('[hire] application received', {
    ref,
    ...parsed.data,
    resume: resumeFile ? { name: resumeFile.name, size: resumeFile.size, type: resumeFile.type } : null,
    coverLetter: coverFile ? { name: coverFile.name, size: coverFile.size, type: coverFile.type } : null,
  });

  return NextResponse.json({ ok: true, ref }, { status: 201 });
}
