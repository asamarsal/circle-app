import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from 'sonner';

const userisi = JSON.parse(localStorage.getItem('user') || '{}'); 

interface PostCardProps {
  avatarUrl?: string;
  threadId: number;
  userId: string;
  onSuccess?: () => void;
}

const PostcardReply: React.FC<PostCardProps> = ({ 
  avatarUrl = "https://github.com/shadcn.png",
  threadId,
  userId,
  onSuccess,
}) => {

  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);

  // console.log("threadId:", threadId);
  // console.log("userId:", userId);


  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setLoading(true);
    console.log("ID:", userisi);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/v1/reply?thread_id=${threadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          content: replyContent,
        }),
      });
      const data = await res.json();
      if (data.code === 200) {
        setReplyContent("");
        toast.success('Reply berhasil dikirim!');
        if (onSuccess) onSuccess();
      } else {
        alert("Gagal mengirim reply");
      }
    } catch (err) {
      toast.error('Reply gagal dikirim!');
    }
    setLoading(false);
  };

  return (
    
    <div className="w-full max-w-2xl mx-auto border-b border-gray-700 pb-4">
      <div className="flex gap-4">
        <Avatar className="w-10 h-10 border-black">
          <AvatarImage src={avatarUrl} />
        </Avatar>
        <input
          type="text"
          placeholder="Type your reply?!"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          className="w-full px-3 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
        <Button
          className="bg-[#04A51E] text-white hover:bg-[#008616] rounded-full cursor-pointer"
          type="button"
          disabled={loading || !replyContent.trim()}
          onClick={handleReply}
        >
          {loading ? "..." : "Reply"}
        </Button>
      </div>
    </div>
  );
};

export default PostcardReply;