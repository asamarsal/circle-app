import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface PostCardProps {
  username: string;
  userHandle: string;
  avatarUrl?: string;
  content: string;
}

const PostcardEditprofile: React.FC<PostCardProps> = ({ 
  username, 
  userHandle, 
  avatarUrl = "https://github.com/shadcn.png",
  content, 
}) => {
  return (
    <div className="w-full mb-4 mt-4">
      {/* Banner */}
      <div className="h-20 w-full bg-gradient-to-r from-green-200 via-green-400 to-green-600 rounded-lg" />
      
      {/* Profile Info */}
      <div className="relative -mt-8 flex items-center px-4">
        <Avatar className="w-16 h-16 border-4 border-black">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{username}</AvatarFallback>
        </Avatar>
      </div>

      {/* Name & Bio */}
      <div className="w-full bg-gray-800 rounded-lg shadow-md">
        <div className="flex flex-col items-start">
          <label className="text-gray-400 text-sm font-medium mb-2">Name</label>
          <input 
            type="text" 
            defaultValue="✨ Asa Marsal ✨" 
            className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg"/>
        </div>

        <div className="flex flex-col items-start">
          <label className="mt-2 text-gray-400 text-sm font-medium mb-1">Username</label>
          <input 
            type="text" 
            defaultValue="asamarsal" 
            className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"/>
        </div>
        <div className="flex flex-col items-start">
          <label className="mt-2 text-gray-400 text-sm font-medium mb-1">Bio</label>
          <textarea 
            rows={3} 
            defaultValue="Ikan hiu makan tomat, i lopyu somaccc"
            className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"/>
        </div>
      
      </div>

      <div className="w-full flex justify-end">
        <button className='bg-[#04A51E] hover:bg-[#008616] text-white py-2 px-4 rounded-full mt-10 cursor-pointer'>
          Save
        </button>
      </div>
    </div>
  );
};

export default PostcardEditprofile;