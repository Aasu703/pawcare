"use client";

import { useEffect, useState } from "react";
import { getAllPosts, getPostById } from "@/lib/api/public/post";
import { Post } from "@/lib/types/post";
import { toast } from "sonner";
import { FileText, User, Calendar } from "lucide-react";

export default function PublicAnnouncementsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const res = await getAllPosts(1, 50);
    if (res.success && res.data) {
      setPosts(res.data.posts || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f4f57]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0c4148]">Announcements</h1>
        <p className="text-gray-500 mt-1">Stay updated with the latest from our providers</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No announcements yet</h3>
          <p className="text-gray-400 mt-1">Check back later for updates from our providers</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post._id} className="bg-white rounded-xl shadow-md border p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold text-[#0c4148] mb-2">{post.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                {post.providerName && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" /> {post.providerName}
                  </span>
                )}
                {post.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
