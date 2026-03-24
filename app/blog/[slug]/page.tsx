interface Props {
  params: { slug: string };
}

export default function BlogPostPage({ params }: Props) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4 capitalize">
        {params.slug.replace(/-/g, " ")}
      </h1>
      <p className="text-gray-600">Blog post content coming soon.</p>
    </main>
  );
}
