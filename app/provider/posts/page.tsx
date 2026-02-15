"use client";

import { useEffect, useState } from "react";
import { getMyProviderPosts, createProviderPost, updateProviderPost, deleteProviderPost } from "@/lib/api/provider/post";
import { toast } from "sonner";
import { FileText, Plus, Pencil, Trash2, Globe, Lock, X } from "lucide-react";

export default function ProviderPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form, setForm] = useState({ title: "", content: "", isPublic: true });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const res = await getMyProviderPosts();
    if (res.success && res.data) {
      setPosts(Array.isArray(res.data) ? res.data : []);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditingPost(null);
    setForm({ title: "", content: "", isPublic: true });
    setShowModal(true);
  };

  const openEdit = (data: any) => {
    setEditingPost(post);
    setForm({ title: post.title, content: post.content, isPublic: post.isPublic });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSubmitting(true);

    if (editingPost) {
      const res = await updateProviderPost(editingPost._id, form as UpdatePostRequest);
      if (res.success) {
        toast.success("Post updated");
        fetchPosts();
        setShowModal(false);
      } else {
        toast.error(res.message);
      }
    } else {
      const res = await createProviderPost(form as CreatePostRequest);
      if (res.success) {
        toast.success("Post created");
        fetchPosts();
        setShowModal(false);
      } else {
        toast.error(res.message);
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (data: any) => {
    if (!confirm("Delete this post?")) return;
    const res = await deleteProviderPost(id);
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f4f57]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0c4148]">Announcements & Posts</h1>
          <p className="text-gray-500 mt-1">Share updates with your customers</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#0f4f57] text-white px-4 py-2 rounded-lg hover:bg-[#0c4148] transition"
        >
          <Plus className="h-5 w-5" /> New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No posts yet</h3>
          <p className="text-gray-400 mt-1">Create your first post to share with customers</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-xl shadow border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-semibold text-[#0c4148]">{post.title}</h2>
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                      post.isPublic ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {post.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      {post.isPublic ? "Public" : "Draft"}
                    </span>
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap">{post.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openEdit(post)}
                    className="p-2 text-gray-400 hover:text-[#0f4f57] hover:bg-gray-100 rounded-lg transition"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#0c4148]">
                {editingPost ? "Edit Post" : "New Post"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f4f57]"
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f4f57]"
                  placeholder="Write your announcement..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={form.isPublic}
                  onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">Make this post public</label>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-[#0f4f57] text-white py-2 rounded-lg font-medium hover:bg-[#0c4148] disabled:opacity-50 transition"
              >
                {submitting ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

