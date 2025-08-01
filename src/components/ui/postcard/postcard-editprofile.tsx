import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { toast } from "sonner";

interface PostCardProps {
  currentProfile: {
    name: string;
    username: string;
    bio: string;
    avatar: string;
  };
  onSave: (data: {
    name?: string;
    username?: string;
    bio?: string;
    avatar?: string;
  }) => void;
}

const PostcardEditprofile: React.FC<PostCardProps> = ({ currentProfile, onSave }) => {
  const [formData, setFormData] = useState({
    name: currentProfile.name || '',
    username: currentProfile.username || '',
    bio: currentProfile.bio || '',
    avatar: currentProfile.avatar || ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const formDataToSend = new FormData();
      if (formData.name !== currentProfile.name) {
        formDataToSend.append('name', formData.name);
      }
      if (formData.username !== currentProfile.username) {
        formDataToSend.append('username', formData.username);
      }
      if (formData.bio !== currentProfile.bio) {
        formDataToSend.append('bio', formData.bio);
      }
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await fetch('http://localhost:3000/api/v1/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        onSave(data.data);
        toast.success('Profile updated successfully!');
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div className="w-full mb-4 mt-4">
      {/* Banner */}
      <div className="h-20 w-full bg-gradient-to-r from-green-200 via-green-400 to-green-600 rounded-lg" />
      
      {/* Profile Info */}
      <div className="relative -mt-8 flex items-center px-4">
        <Avatar className="w-16 h-16 border-4 border-black">
          <AvatarImage src={currentProfile.avatar} />
          <AvatarFallback>{currentProfile.name?.[0]}</AvatarFallback>
        </Avatar>
        <input
          type="file"
          onChange={handleImageChange}
          className="hidden"
          id="avatar-upload"
          accept="image/*"
        />
        <label 
          htmlFor="avatar-upload" 
          className="ml-4 text-sm text-gray-400 cursor-pointer hover:text-white"
        >
          +
        </label>
      </div>

      {/* Name & Bio */}
      <div className="w-full bg-gray-800 rounded-lg shadow-md p-4 mt-4">
        <div className="flex flex-col items-start gap-4">
          <div className="w-full flex flex-col items-start">
            <label className="text-gray-400 text-sm font-medium mb-2">Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg"
            />
          </div>

          <div className="w-full flex flex-col items-start">
            <label className="text-gray-400 text-sm font-medium mb-1 ">Username</label>
            <input 
              type="text" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg"
            />
          </div>

          <div className="w-full flex flex-col items-start">
            <label className="text-gray-400 text-sm font-medium mb-1">Bio</label>
            <textarea 
              rows={3} 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end">
        <button 
          className='bg-[#04A51E] hover:bg-[#008616] text-white py-2 px-4 rounded-full mt-10 cursor-pointer disabled:opacity-50'
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default PostcardEditprofile;