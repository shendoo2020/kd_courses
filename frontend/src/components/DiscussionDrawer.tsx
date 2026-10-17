import { useState, useEffect } from "react";
import { commentsApi, Comment } from "@/lib/api";
import { MessageSquare, ThumbsUp, Send, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

export default function DiscussionDrawer({ lessonId }: { lessonId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (lessonId) {
      fetchComments();
    }
  }, [lessonId]);

  const fetchComments = async () => {
    try {
      const res = await commentsApi.getLessonComments(lessonId);
      setComments(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    const text = parentId ? replyText : newComment;
    if (!text.trim()) return;

    try {
      await commentsApi.postComment(lessonId, { text, parentId });
      setNewComment("");
      setReplyText("");
      setActiveReplyId(null);
      fetchComments();
    } catch (e) {
      alert("Failed to post comment");
    }
  };

  const handleUpvote = async (commentId: string) => {
    try {
      await commentsApi.upvote(commentId);
      fetchComments();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedComments);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedComments(newSet);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <MessageSquare size={18} className="text-slate-500" />
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Classroom Q&A</h3>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {loading ? (
          <div className="text-center text-xs text-slate-500">Loading discussion...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-xs text-slate-500 py-8">
            No questions yet. Be the first to start the discussion!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 flex items-center justify-center font-bold text-xs">
                  {comment.user.name[0]}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{comment.user.name}</span>
                    <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    {comment.isEndorsed && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                        <CheckCircle2 size={10} /> Instructor Endorsed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500">
                    <button onClick={() => handleUpvote(comment.id)} className="hover:text-brand-600 flex items-center gap-1">
                      <ThumbsUp size={12} /> {comment.upvotes}
                    </button>
                    <button onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)} className="hover:text-brand-600">
                      Reply
                    </button>
                    {comment.replies && comment.replies.length > 0 && (
                      <button onClick={() => toggleExpand(comment.id)} className="hover:text-brand-600 flex items-center gap-1 text-brand-600">
                        {expandedComments.has(comment.id) ? <ChevronUp size={12} /> : <ChevronDown size={12} />} 
                        {comment.replies.length} replies
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Reply Input */}
              {activeReplyId === comment.id && (
                <form onSubmit={(e) => handlePost(e, comment.id)} className="ml-11 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-grow px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:border-brand-500"
                  />
                  <button type="submit" className="p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700">
                    <Send size={14} />
                  </button>
                </form>
              )}

              {/* Replies (Nested) */}
              {expandedComments.has(comment.id) && comment.replies?.map((reply) => (
                <div key={reply.id} className="flex gap-3 ml-11 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 flex items-center justify-center font-bold text-[10px]">
                    {reply.user.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-[11px] text-slate-900 dark:text-white">{reply.user.name}</span>
                      {reply.user.role === 'INSTRUCTOR' && (
                        <span className="text-[9px] font-bold text-brand-600 bg-brand-50 dark:bg-brand-950 px-1 rounded">Instructor</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      {reply.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* New Question Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={(e) => handlePost(e)}>
          <textarea
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ask a question about this lesson..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:border-brand-500 resize-none mb-2"
          />
          <button type="submit" className="w-full py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-colors">
            Post Question
          </button>
        </form>
      </div>
    </div>
  );
}
