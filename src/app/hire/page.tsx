import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import HireClient, { type Job } from './HireClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Join the team at Ember on Toorak. Open positions across the kitchen, floor, bar, and cellar — apply with your resume and cover letter.',
  openGraph: {
    title: 'Careers — Ember on Toorak',
    description: 'Cook with fire. Serve with soul. Open roles at Ember on Toorak.',
    url: 'https://www.emberontoorak.com.au/hire',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: '/hire' },
};

export default async function HirePage() {
  const rows = await prisma.job.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  const jobs: Job[] = rows.map((j) => ({
    id: j.id,
    slug: j.slug,
    title: j.title,
    department: j.department,
    type: j.type,
    location: j.location,
    salary: j.salary,
    summary: j.summary,
    responsibilities: j.responsibilities,
    requirements: j.requirements,
  }));

  return <HireClient jobs={jobs} />;
}
