"use client";

import { useEffect, useState } from "react";
import { getAllPosts, deletePost } from "@/lib/api/admin/post";
import { toast } from "sonner";
import { FileText, Trash2, Globe, Lock } from "lucide-react";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    const res = await getAllPosts(page, 20);
    if (res.success && res.data) {
      setPosts(res.data.posts || []);
      setTotalPages(res.data.totalPages || 1);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const handleDelete = async (data: any) => {
    if (!confirm("Delete this post?")) return;
    const res = await deletePost(data);
    if (res.success) {
      toast.success("Post deleted");
      fetchPosts();
    } else {
      toast.error(res.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Post Management</h1>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No posts found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Visibility</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm">{post.title}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{post.content}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{post.providerName || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 w-fit text-xs px-2 py-0.5 rounded-full ${
                      post.isPublic ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {post.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      {post.isPublic ? "Public" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded text-sm bg-white border disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded text-sm bg-white border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

