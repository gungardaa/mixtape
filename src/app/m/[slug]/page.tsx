import { notFound } from 'next/navigation';
import { getPublicMixtape } from '@/lib/mixtapes';
import { PublicMixtapeClient } from '@/components/mixtape/PublicMixtapeClient';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PublicMixtapePage({ params }: PageProps) {
  const { slug } = await params;
  const mixtape = await getPublicMixtape(slug);

  if (!mixtape) notFound();

  return <PublicMixtapeClient mixtape={mixtape} />;
}
