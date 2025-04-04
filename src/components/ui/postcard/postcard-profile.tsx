import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Heart,
    MessageSquareText,
  } from "lucide-react";

  const adaImage = (url: string | null | undefined): url is string => {
    return Boolean(url && typeof url === 'string' && url.trim() !== "");
};

interface PostCardProps {
  username: string;
  userHandle: string;
  content: string;
  avatarUrl?: string;
  timestamp?: string;
  likecount: number;
  imageUrl?: string | null;
}

const PostcardProfile: React.FC<PostCardProps> = ({ 
  username, 
  userHandle, 
  content, 
  avatarUrl = "https://github.com/shadcn.png",
  timestamp,
  likecount,
  imageUrl,
}) => {
  return (
    <div className="w-full border-b border-gray-700 pb-4 mb-4">
      <div className="flex">
        <Avatar className="w-10 h-10 border-black">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col ml-4 flex-1">
            <div className="flex items-center gap-2">
                <span className="font-medium text-white hover:text-gray-300 cursor-pointer">
                {username}
                </span>
                <span className="text-gray-500">@{userHandle}</span>
                <span className="text-gray-500">· {timestamp}</span>
            </div>
            <p className="text-white mt-1 text-left">{content}</p>
            <div className="flex flex-row items-center gap-2">
                        {adaImage(imageUrl) && (
                            <img
                                src={imageUrl}
                                alt="Post Image"
                                className="w-full h-auto rounded-lg mt-2"
                            />
                        )}
                    </div>
            <div className="flex items-center gap-4 text-white mt-2 cursor-pointer hover:text-gray-300">
                    <div className="flex flex-row items-center gap-2">
                        <Heart size={18} strokeWidth={2} />
                        <span className="text-white">{likecount}</span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <MessageSquareText size={18} strokeWidth={2} />
                        <span className="text-white">{likecount}</span>
                    </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PostcardProfile;