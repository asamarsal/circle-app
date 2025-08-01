import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Heart,
    MessageSquareText,
  } from "lucide-react";
// import { useState } from "react";

import { PostCardProps } from '@/types/home';

const PostcardPostingselected: React.FC<PostCardProps> = ({ 
  username, 
  userHandle, 
  content, 
  avatarUrl,
  timestamp,
  likecount,
  image,
  isLiked,
  onLikeClick
}) => {
  const getImageUrl = (imageUrl: string | null): string => {
  if (!imageUrl) return '';

  if (imageUrl.startsWith('http')) return imageUrl;
  return `http://localhost:3000${imageUrl}`;
};

  // const [isLiked, setIsLiked] = useState(false);
  // const [currentLikeCount, setCurrentLikeCount] = useState(likecount);

  // const handleLikeClick = () => {
  //   setIsLiked(!isLiked);
  //   setCurrentLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  // };

  return (
    <div className="w-full border-b border-gray-700 pb-4 mb-4">
      <div className="flex">
        <Avatar className="w-10 h-10 border-black">
          <AvatarImage 
              src={avatarUrl} 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://picsum.photos/200/?random=2";
            }}
          />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col ml-4 flex-1 items-start">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white hover:text-gray-300 cursor-pointer">
              {username}
            </span>
            <span className="text-gray-500">@{userHandle}</span>
          </div>
          <p className="text-white mt-1 text-left">{content}</p>

          {image && (
          <div className="mt-2 flex items-start">
            <img
              src={getImageUrl(image)}
              alt={`Posted by ${username}`}
              className="max-h-60 w-full object-contain rounded-lg"
              style={{ maxWidth: '100%', height: 'auto' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}

          {/* {imageProcessingStatus === 'processing' && (
            <div className="mt-2 text-yellow-500">
              <p>Processing image...</p>
            </div>
          )} */}

          <div className="flex flex-col gap-4 text-white mt-2">
            <div className="flex">
                <span className="align-start text-gray-500">{timestamp}</span>
            </div>
            <div className="flex flex-row gap-4">
              <div 
                className="flex flex-row items-center gap-2 cursor-pointer"
                onClick={onLikeClick}
              >
                <Heart 
                  size={18} 
                  strokeWidth={2} 
                  className={`transition-colors ${
                    isLiked 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-white hover:text-red-500'
                  }`}
                />
                <span className={isLiked ? 'text-red-500' : 'text-white'}>
                  {likecount}
                </span>
              </div>
              <div className="flex flex-row items-center gap-2 cursor-pointer">
                <MessageSquareText size={18} strokeWidth={2} />
                <span className="text-white">{likecount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostcardPostingselected;