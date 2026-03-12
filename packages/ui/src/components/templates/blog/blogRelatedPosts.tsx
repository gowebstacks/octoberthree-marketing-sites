import { SanityBlogPost } from "../../../types/sanity";
import { Heading } from "../../atoms";
import { ResourceCard } from "../../organisms";


interface BlogRelatedProps {
  posts: SanityBlogPost[]
}

export default function BlogRelatedPosts({ posts }: BlogRelatedProps) {
  if (!posts || posts.length === 0) return null;
  
  return (
    <section className="bg-background">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="flex flex-col gap-6 sm:gap-12 lg:gap-16">
          <div className="lg:max-w-[1008px] lg:mx-auto">
            <Heading
              as="h2"
              size="3xl"
              weight="normal"
              fontFamily="accent"
              className="text-heading"
            >
              Related posts
            </Heading>
          </div>
          {posts && posts.length > 0 && (
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {posts.slice(0, 4).map((card, idx) => (
                  <div key={`${card._id}-${idx}-resource-card`} className="w-full">
                    {/* <ResourceCard {...card} /> */}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
