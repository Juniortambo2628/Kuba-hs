import BlogClient from './BlogClient';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  return <BlogClient params={params} />;
}
