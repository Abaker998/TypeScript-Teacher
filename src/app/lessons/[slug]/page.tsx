import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * Redirects from the old /lessons/[slug] route to the new /typescript/lessons/[slug] route.
 * This provides backwards compatibility for any existing links.
 */
export default function LessonRedirectPage({ params }: PageProps): never {
  redirect(`/typescript/lessons/${params.slug}`);
}
