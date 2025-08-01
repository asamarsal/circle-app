import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface PostCardProps {
  username: string;
  userHandle: string;
  avatarUrl?: string;
  profileStatus: string;
}

const PostcardFollowboard: React.FC<PostCardProps> = ({ 
  username, 
  userHandle,
  avatarUrl,
  profileStatus,
}) => {
    return (
        <div className="w-full border-b border-gray-700 pb-2 -mb-2">
            <div className="flex">
                <Avatar className="-ml-4 w-10 h-10 border-black">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1">
                    <span className="items-start font-medium text-white hover:text-gray-300 cursor-pointer">
                        {username}
                    </span>
                    <span className="text-gray-500 text-sm">
                        {userHandle}
                    </span>
                    <span className="text-gray-500 text-sm">
                        {profileStatus}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PostcardFollowboard;