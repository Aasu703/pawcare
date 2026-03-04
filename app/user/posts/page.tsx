"use client";

import { useEffect, useState } from "react";
import { getAllPosts } from "@/lib/api/public/post";
import { toast } from "sonner";
import { FileText, User, Calendar } from "lucide-react";

export default function UserPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const res = await getAllPosts(1, 100);
    if (res.success && res.data) {
      setPosts(res.data.posts || []);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--pc-teal)]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--pc-teal-dark)]">Provider Posts</h1>
        <p className="text-muted-foreground mt-1">Latest announcements shared by providers</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No posts yet</h3>
          <p className="text-muted-foreground mt-1">Providers have not shared announcements yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post._id} className="bg-white rounded-xl shadow border p-6">
              <h2 className="text-xl font-semibold text-[var(--pc-teal-dark)] mb-2">{post.title}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
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
              <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

