import React, { useState, useEffect } from 'react';
import iconCircle from '../assets/images/circle.png';
import '../assets/styles/global.css';
import {
    Home,
    UserSearch,
    Heart,
    CircleUserRound,
    ImagePlus,
    LogOut,
  } from "lucide-react";

import { 
    Card, 
    CardContent, 
    // CardDescription,
    // CardHeader,
    // CardTitle, 
} from "@/components/ui/card";

import { Button } from"@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PostcardSuggested from "@/components/ui/postcard/postcard-suggested";
import PostcardPosting from "@/components/ui/postcard/postcard-posting";

// import PostcardEditprofile from "@/components/ui/postcard/postcard-editprofile";
import PostcardFollowers from "@/components/ui/postcard/postcard-followboard";

// import postsFollowingdata from '@/data/following-data.json';
// import postsFollowersdata from '@/data/followers-data.json';
// import { Post } from '@/types/home';
import postsSuggesteddata from '@/data/suggested-data.json';

// import PostcardFollowing from "@/components/ui/postcard/postcard-followboard";
import { NavLink, useNavigate } from 'react-router-dom';
// import { Dialog, DialogContent } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';

import { setProfile } from '@/lib/redux/profileSlice';
import { toast } from 'sonner';

interface Follower {
  id: string;
  username: string;
  name: string;
  avatar: string;
  is_following: boolean;
}

interface Following {
  id: string;
  username: string;
  name: string;
  avatar: string;
  is_following: boolean;
}

// interface SuggestedData {
//   posts: Array<{
//     id: number;
//     username: string;
//     userHandle: string;
//     avatarUrl: string;
//   }>;
// }

const Followboard: React.FC = () => {
    const navigate = useNavigate();
    const [followingState] = useState<{ [key: number]: boolean }>({});
    // const [followingState, setFollowingState] = useState<{ [key: number]: boolean }>({});
    const [ setIsEditprofileOpen] = useState(false);
    // const [isEditprofileOpen, setIsEditprofileOpen] = useState(false);
    const [isPostinganOpen, setIsPostinganOpen] = useState(false);
    const [setIsAvatarOpen] = useState(false);
    // const [isAvatarOpen, setIsAvatarOpen] = useState(false);

    const [followers, setFollowers] = useState<Follower[]>([]);
    const [followings, setFollowings] = useState<Following[]>([]);

    // const [followersLoading, setFollowersLoading] = useState(false);
    // const [followingLoading, setFollowingLoading] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.profile);

    const API_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/v1/profile`, {
                    headers: { 
                        Authorization: `Bearer ${token}` 
                    }
                });
                const data = await response.json();
                
                if (data.id) {
                    dispatch(setProfile(data));
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };

    fetchProfile();
    }, [dispatch]);

    const handleFollowClick = async (userId: number) => {
        try {
            const token = localStorage.getItem('token');
            
            const isFollowing = (followers?.find(f => f.id === userId.toString())?.is_following) || 
                              (followings?.find(f => f.id === userId.toString())?.is_following) || 
                              false;
            
            const response = await fetch(`${API_URL}/api/v1/follows`, {
                method: isFollowing ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(
                    isFollowing 
                    ? { followed_id: userId }
                    : { followed_user_id: userId }
                )
            });

            const data = await response.json();

            if (data.status === 'success') {
                // Update local state
                setFollowers(prev => prev?.map(follower => 
                    follower.id === userId.toString()
                    ? { ...follower, is_following: !follower.is_following }
                    : follower
                ) || []);
                
                setFollowings(prev => prev?.map(following => 
                    following.id === userId.toString()
                    ? { ...following, is_following: !following.is_following }
                    : following
                ) || []);

                // Refresh data
                await Promise.all([fetchFollowers(), fetchFollowings()]);
            } else {
                throw new Error(data.message || 'Failed to update follow status');
            }
        } catch (error) {
            console.error('Failed to update follow status:', error);
            setError(error instanceof Error ? error.message : 'Failed to update follow status');
        }
    };

    const fetchFollowers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/v1/follows?type=followers`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.status === 'success') {
                setFollowers(data.data.followers);
            } else {
                setError(data.message || 'Failed to fetch followers');
            }
        } catch (err) {
            setError('Failed to fetch follower data');
        } finally {
            setIsLoading(false);
        }
    };

    
    const fetchFollowings = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/v1/follows?type=following`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log('Following data:', data);

            if (data.status === 'success') {
                setFollowings(data.data.following);
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error('Following fetch error:', err);
            setError('Failed to fetch following data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowers();
    }, []);

    useEffect(() => {
        fetchFollowings();
        console.log('useEffect following triggered');
    }, []);

    const handleLogout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            //Semuanya
            localStorage.clear();
            navigate('/login');
            toast.success('Logged out successfully');
        };

    return (
      <div className="grid grid-cols-10 min-h-screen">
        {/* Left Sidebar 2/10 */}
        <div className="col-span-2 bg-gray-900 p-4 border-r border-gray-700 flex flex-col">
        <img 
            className="icon-heading ml-2 w-40 h-12" 
            src={iconCircle} 
            alt="Circle" />
            <NavLink to="/dashboard" className="flex items-center gap-2 text-white ml-2 mt-10 cursor-pointer hover:text-gray-300 user">
                <Home size={24} strokeWidth={1} /> 
                <p>Home</p>
            </NavLink>
            <NavLink to="/search" className="flex items-center gap-2 text-white ml-2 mt-8 cursor-pointer hover:text-gray-300 user">
                <UserSearch size={24} strokeWidth={1} /> 
                <p>Search</p>
            </NavLink>
            <div className="flex items-center gap-2 text-white ml-2 mt-8 cursor-pointer hover:text-gray-300 user">
                <Heart size={24} strokeWidth={3} /> 
                <p className="font-semibold">Follow</p>
            </div>
            <NavLink to="/profile" className="flex items-center gap-2 text-white ml-2 mt-8 cursor-pointer hover:text-gray-300 user">
                <CircleUserRound size={24} strokeWidth={1} /> 
                <p>Profile</p>
            </NavLink>
            <button className='bg-[#04A51E] hover:bg-[#008616] text-white w-full py-2 px-4 rounded-full mt-10 cursor-pointer' onClick={() => setIsPostinganOpen(true)}>Create Post</button>
            <NavLink 
                to="/#" onClick={handleLogout} className="flex items-center gap-2 text-white ml-2 mt-auto cursor-pointer hover:text-gray-300 user mb-4">
                <LogOut size={24} strokeWidth={1} /> 
                <p>Logout</p>
            </NavLink>
        </div>
  
        {/* Main Content - 5/10 */}
        <div className="col-span-5 bg-gray-800 p-4 border-r border-gray-700">
            <div className="flex flex-col">
                <div className="flex items-center">
                    <p className="text-white text-xl">
                        Follows
                    </p>
                </div>
                <Tabs defaultValue="followers" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                        <TabsTrigger 
                            value="followers" 
                            className="tabs-trigger text-white py-2">
                            Followers
                        </TabsTrigger>
                        <TabsTrigger 
                            value="following" 
                            className="tabs-trigger text-white py-2">
                            Following
                        </TabsTrigger>
                    </TabsList>
                    <div className="border-b border-gray-600" />
                    <TabsContent value="followers">   
                        <div className="flex flex-col gap-4">
                            {isLoading ? (
                                <div className="text-white text-center py-4">Loading followers...</div>
                            ) : error ? (
                                <div className="text-red-500 text-center py-4">{error}</div>
                            ) : followers && followers.length > 0 ? (
                                followers.map((follower) => (
                                    <div key={follower.id} className="flex items-center justify-between px-4">
                                        <PostcardFollowers
                                            username={follower.name}
                                            userHandle={follower.username}
                                            avatarUrl={follower.avatar}
                                            profileStatus=""
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={() => handleFollowClick(Number(follower.id))}
                                            className={`rounded-full cursor-pointer ${
                                                follower.is_following
                                                ? 'bg-gray-800 text-gray-400 border-gray-600' 
                                                : 'bg-transparent border-white text-white'
                                            }`}
                                        >
                                            {follower.is_following ? 'Unfollow' : 'Follow'}
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-white text-center py-4">No followers found</div>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="following">   
                        <div className="flex flex-col gap-4">
                            {isLoading ? (
                                <div className="text-white text-center py-4">Loading following...</div>
                            ) : error ? (
                                <div className="text-red-500 text-center py-4">{error}</div>
                            ) : followings && followings.length > 0 ? (
                                followings.map((following) => (
                                    <div key={following.id} className="flex items-center justify-between px-4">
                                        <PostcardFollowers 
                                            username={following.name}
                                            userHandle={following.username}
                                            avatarUrl={following.avatar}
                                            profileStatus=""
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={() => handleFollowClick(Number(following.id))}
                                            className={`rounded-full cursor-pointer ${
                                                following.is_following
                                                ? 'bg-gray-800 text-gray-400 border-gray-600' 
                                                : 'bg-transparent border-white text-white'
                                            }`}
                                        >
                                            {following.is_following ? 'Unfollow' : 'Follow'}
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-white text-center py-4">No following found</div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modal */}
                {isPostinganOpen && (
                    <>
                        <div 
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
                            onClick={() => setIsPostinganOpen(false)}
                        />
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg z-20 w-[600px]">
                            <div className="flex justify-end">
                                <button 
                                    onClick={() => setIsPostinganOpen(false)}
                                    className=" text-gray-400 hover:text-white">
                                    ✕
                                </button>
                            </div>
                            <PostcardPosting />
                            <div className="flex justify-between items-center flex-row mt-4">
                                <ImagePlus 
                                    size={24} 
                                    strokeWidth={2} 
                                    className="text-[#04A51E] hover:text-[#008616] cursor-pointer mr-2 transition-colors"/>
                                <Button
                                    className="bg-[#04A51E] text-white hover:bg-[#008616] rounded-full cursor-pointer">
                                    Post
                                </Button>
                            </div>
                        </div>
                    </>
                )}
        </div>
  
        {/* Right Sidebar - 3/10 */}
        <div className="col-span-3 bg-gray-900 p-4">

            {/* Card Profile */}
            <Card className="bg-gray-900 text-white p-4 rounded-lg">
                <h2 className="text-heading text-l">Profile</h2>
                <div className="-mt-4 h-14 w-full bg-gradient-to-r from-green-200 via-green-400 to-green-600 rounded-lg" />
                
                <div className="relative -mt-8 flex items-center px-4">
                    {/* <Avatar className="w-16 h-16 border-4 border-black cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setIsAvatarOpen(true)}>
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback>{profile.name?.[0]}</AvatarFallback>
                    </Avatar> */}
                    
                    {/* <Button
                        variant="outline"
                        className="-mr-4 ml-auto bg-transparent border-white text-white rounded-full cursor-pointer" 
                        onClick={() => setIsEditprofileOpen(true)}>
                        Edit Profile
                    </Button> */}
                </div>

                <CardContent>
                    <h2 className="-ml-4 -mt-4 text-l font-semibold flex flex-col text-left">{profile.name}</h2>
                    <div className="-ml-4 flex flex-col text-left">
                        <p className="text-gray-400">@{profile.username}</p>
                        <p className="text-gray-300 text-sm">{profile.bio}</p>
                    </div>

                    <div className="-ml-4 mt-3 flex text-sm text-gray-400">
                        <span className="mr-4">
                            <strong className="text-white">{profile.following_count}</strong> Following
                        </span>
                        <span>
                            <strong className="text-white">{profile.follower_count}</strong> Followers
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Card Suggested for you */}
            <Card className=" bg-gray-900 text-white mt-4 p-4 rounded-lg">
                <h2 className="text-heading text-l">Suggested for you</h2>

                {/* Profile Info */}
                <div className="flex flex-col gap-4">
                    {postsSuggesteddata.posts.map((post) => (
                        <div key={post.id} className="flex items-center justify-between px-4">
                            <PostcardSuggested
                                username={post.username}
                                userHandle={post.userHandle}
                                avatarUrl={post.avatarUrl}
                            />
                            <Button
                                variant="outline"
                                onClick={() => handleFollowClick(post.id)}
                                className={`rounded-full cursor-pointer ${
                                    followingState[post.id]
                                    ? 'bg-gray-800 text-gray-400 border-gray-600' 
                                    : 'bg-transparent border-white text-white'
                                }`}
                            >
                                {followingState[post.id] ? 'Following' : 'Follow'}
                            </Button>
                        </div>
                    ))}
                </div>

            </Card>

        </div>
      </div>
    );
};

export default Followboard;