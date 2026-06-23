import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User } from 'lucide-react';

const posts = [
  {
    slug: 'future-of-ecommerce',
    title: 'The Future of E-Commerce: Trends to Watch in 2026',
    excerpt:
      'Explore the emerging technologies and shifting consumer behaviors that are reshaping the online shopping landscape.',
    author: 'Alex Morgan',
    date: 'June 15, 2026',
    readTime: '5 min read',
    image: '/blog/ecommerce.jpg',
    category: 'Industry',
  },
  {
    slug: 'sustainable-shopping',
    title: 'How to Build a Sustainable Shopping Habit',
    excerpt:
      'Small changes in your purchasing decisions can make a massive impact on the environment. Here is how to start.',
    author: 'Sarah Chen',
    date: 'June 10, 2026',
    readTime: '4 min read',
    image: '/blog/sustainable.jpg',
    category: 'Lifestyle',
  },
  {
    slug: 'premium-tech-review',
    title: 'Top 10 Premium Tech Gadgets of the Year',
    excerpt:
      'We have tested hundreds of gadgets this year. These are the ones that truly stood out in design and performance.',
    author: 'David Kim',
    date: 'June 5, 2026',
    readTime: '7 min read',
    image: '/blog/tech.jpg',
    category: 'Tech',
  },
];

export const metadata = {
  title: 'Blog — ZKR',
  description:
    'Insights, trends, and stories from the world of premium e-commerce.',
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          The ZKR Journal
        </h1>

        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Insights, trends, and stories to elevate your shopping experience.
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {posts.map((post) => (

          <article
            key={post.slug}
            className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:shadow-soft transition-all duration-300"
          >

            <div className="relative h-48 overflow-hidden bg-muted">

              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />


              <div className="absolute top-4 left-4">

                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur-sm border border-border">
                  {post.category}
                </span>

              </div>

            </div>


            <div className="p-6 flex flex-col flex-1">

              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">

                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>

              </h2>


              <p className="text-muted-foreground text-sm mb-4 flex-1">
                {post.excerpt}
              </p>


              <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">

                <div className="flex items-center gap-3">

                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </span>


                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>

                </div>


                <span>
                  {post.readTime}
                </span>

              </div>

            </div>


          </article>

        ))}

      </div>

    </div>
  );
}