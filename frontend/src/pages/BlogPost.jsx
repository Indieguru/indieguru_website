import { useParams } from 'react-router-dom';
import Header from "../components/layout/Header";

export default function BlogPost() {
  const { id } = useParams();
  
  // This would typically come from an API call using the id
  // For now using static data
  const blogData = {
    1: {
      title: "Step-by-step guide to choosing great font pairs",
      author: "Andrew Jonson",
      date: "27th January 2022",
      category: "Startup",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non blandit massa enim nec. Scelerisque viverra mauris in aliquam sem. At risus viverra adipiscing at in tellus. Sociis natoque penatibus et magnis dis parturient montes. Ridiculus mus mauris vitae ultricies leo. Neque egestas congue quisque egestas diam. Risus in hendrerit gravida rutrum quisque non.`,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IndieGuru_Beta.png-w0dWx3S2nWAiZNbL5K9aJkNCJcWpst.jpeg"
    },
    2: {
      title: "How to use whitespace in UI design effectively",
      author: "Sarah Smith",
      date: "24th May 2022",
      category: "Business",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non blandit massa enim nec. Scelerisque viverra mauris in aliquam sem. At risus viverra adipiscing at in tellus. Sociis natoque penatibus et magnis dis parturient montes.`,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IndieGuru_Beta.png-w0dWx3S2nWAiZNbL5K9aJkNCJcWpst.jpeg"
    }
  };

  const post = blogData[id];

  if (!post) {
    return <div className="text-center py-20">Blog post not found</div>;
  }

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8 mt-20">
        {/* Author info */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={post.image}
              alt={post.author}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-[#232536] font-medium text-sm">{post.author}</h3>
            <p className="text-[#6d6e76] text-xs">Posted on {post.date}</p>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-[#232536] text-3xl font-bold mb-4">{post.title}</h1>

        {/* Category tag */}
        <div className="mb-6">
          <span className="inline-flex items-center px-3 py-1 bg-[#ffd050] text-[#232536] text-sm font-medium rounded-full">
            <span className="mr-1">👨‍💻</span> {post.category}
          </span>
        </div>

        {/* Featured image */}
        <div className="mb-8">
          <img
            src={post.image}
            alt="Blog featured image"
            className="w-full rounded-md"
          />
        </div>

        {/* Content sections */}
        <div className="mb-10">
          <p className="text-[#6d6e76] text-sm mb-4">
            {post.content}
          </p>
        </div>

        {/* Comment section */}
        <div className="mb-16">
          <div className="flex items-center border border-[#6d6e76] rounded-full overflow-hidden">
            <input type="text" placeholder="Add a Comment" className="flex-grow px-4 py-2 outline-none text-sm" />
            <div className="flex">
              <button className="px-3 py-2 text-xs border-l border-[#6d6e76] text-[#6d6e76]">
                <span className="mr-1">👍</span> Upvote
              </button>
              <button className="px-3 py-2 text-xs border-l border-[#6d6e76] text-[#6d6e76]">
                <span className="mr-1">💬</span> Comment
              </button>
            </div>
          </div>
        </div>

        {/* What to read next section */}
        <div className="mb-16">
          <h2 className="text-[#232536] text-2xl font-bold mb-8">What to read next</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-b pb-4">
                <div className="mb-4">
                  <img
                    src={`https://picsum.photos/300/200?random=${item}`}
                    alt="Case study image"
                    className="w-full rounded-md"
                  />
                </div>
                <div className="mb-2 text-xs text-[#6d6e76]">By Jim Doe | Aug 23, 2021</div>
                <h3 className="text-[#232536] font-bold mb-2">
                  A UX Case Study Creating a Studious Environment for Students:
                </h3>
                <p className="text-[#6d6e76] text-xs mb-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  Excepteur sint occaecat cupidatat non proident.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Join our team section */}
        <div className="text-center mb-8">
          <h2 className="text-[#232536] text-2xl font-bold mb-2">Join our team to be a part</h2>
          <h3 className="text-[#232536] text-2xl font-bold mb-4">of our story</h3>
          <p className="text-[#6d6e76] text-sm mb-6 max-w-md mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </p>
          <button className="bg-[#ffd050] hover:bg-[#fbb236] text-[#232536] font-medium px-6 py-2 rounded">
            Join Now
          </button>
        </div>
      </div>
    </>
  )
}
