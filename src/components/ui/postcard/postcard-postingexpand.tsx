import { Avatar, AvatarImage } from "@/components/ui/avatar";
interface PostCardProps {
  avatarUrl?: string;
}

const PostcardPostingexpand: React.FC<PostCardProps> = ({ 
  avatarUrl = "https://github.com/shadcn.png",
}) => {
  return (
    <div className="w-full border-b border-gray-700 pb-4 mb-4">
        <div className="flex items-center gap-4 mt-4 mb-2">
            <Avatar className="w-10 h-10 border-black">
            <AvatarImage src={avatarUrl} /></Avatar>
            <input 
              type="text" 
              placeholder="What is happening?!"
              className="w-full px-3 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"/>
        </div>
    </div>
  );
};

export default PostcardPostingexpand;