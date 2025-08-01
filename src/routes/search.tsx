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
    LucideCircle,
  } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PostcardSuggested from "@/components/ui/postcard/postcard-suggested";
import postsSuggesteddata from '@/data/suggested-data.json';
import PostcardEditprofile from "@/components/ui/postcard/postcard-editprofile";

import { NavLink, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import PostcardPosting from "@/components/ui/postcard/postcard-posting";
import { Dialog, DialogContent } from "@/components/ui/dialog"

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setProfile, updateProfile } from '@/lib/redux/profileSlice';
import { toast } from 'sonner';

import { io } from 'socket.io-client';

interface SearchUser {
  id: string;
  username: string;
  name: string;
  followers: number;
  is_following?: boolean;
}

const Search: React.FC = () => {
    const navigate = useNavigate();
    const [followingState, setFollowingState] = useState<{ [key: number]: boolean }>({});
    const [isEditprofileOpen, setIsEditprofileOpen] = useState(false);
    const [isPostinganOpen, setIsPostinganOpen] = useState(false);
    const [isAvatarOpen, setIsAvatarOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');

    const [isOnline, setIsOnline] = useState(false);
    const [socket, setSocket] = useState<any>(null);

    const profile = useSelector((state: RootState) => state.profile);
    const dispatch = useDispatch();

    const loggedInUserId = JSON.parse(localStorage.getItem('user') || '{}').user_id;

    useEffect(() => {
    if (searchResults.length > 0) {
        fetchFollowStatus();
    }
}, [searchResults]);

    useEffect(() => {
        const debounceTimer = setTimeout(async () => {
            if (searchTerm.trim()) {
                setIsSearching(true);
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`http://localhost:3000/api/v1/search?keyword=${searchTerm}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const data = await response.json();

                    if (data.status === 'success') {
                        setSearchResults(data.data.users);
                        setSearchError('');
                    }
                } catch (error) {
                    setSearchError('Failed to fetch search results');
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500); // Debounce delay

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    useEffect(() => {
            const newSocket = io('http://localhost:3000');
            setSocket(newSocket);
    
            // Connect > Online
            newSocket.on('connect', () => {
                setIsOnline(true);
                // Info User
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                newSocket.emit('userConnected', {
                    userId: userData.id,
                    username: userData.username
                });
    
                toast.success('Terhubung ke server', {
                description: 'Koneksi berhasil dibuat',
                duration: 3000,
                });
            });
    
            // Text = Berubah offline
            newSocket.on('disconnect', () => {
                setIsOnline(false);
                toast.error('Koneksi Terputus', {
                    description: 'Periksa koneksi internet anda',
                    duration: 3000,
                });
            });
    
            return () => {
                if (newSocket) {
                    newSocket.disconnect();
                }
            };
        }, []);
    
    const handleFollowClick = async (userId: number) => {
        try {
            const token = localStorage.getItem('token');
            const user = searchResults.find(u => u.id === userId.toString());
            const isFollowing = user?.is_following || false;
            
            const response = await fetch('http://localhost:3000/api/v1/follows', {
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
                // Immediately update UI
                setSearchResults(prev => prev.map(user => 
                    user.id === userId.toString()
                    ? { ...user, is_following: !user.is_following }
                    : user
                ));

                // Fetch latest following status
                await fetchFollowStatus();
            }
        } catch (error) {
            console.error('Failed to update follow status:', error);
            setSearchError('Failed to update follow status');
        }
    };

    const fetchFollowings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/v1/follows?type=following', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.status === 'success') {
                // Create a map of following status
                const followingMap = data.data.following.reduce((acc: {[key: string]: boolean}, user: any) => {
                    acc[user.id] = true;
                    return acc;
                }, {});

                // Update search results with following status
                setSearchResults(prev => prev.map(user => ({
                    ...user,
                    is_following: followingMap[user.id] || false
                })));
            }
        } catch (error) {
            console.error('Failed to fetch following status:', error);
        }
    };

    const fetchFollowStatus = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/v1/follows?type=following', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (data.status === 'success' && data.data.followers) {
            // Create a Set of IDs of users we're following
            const followingIds = new Set(data.data.followers.map((user: any) => user.id));
            
            // Update search results with following status
            setSearchResults(prev => prev.map(user => ({
                ...user,
                is_following: followingIds.has(user.id)
            })));
        }
    } catch (error) {
        console.error('Failed to fetch following status:', error);
    }
};

const handleProfileUpdate = async (updatedData: {
        username?: string;
        name?: string;
        bio?: string;
        avatar?: string;
        cover_photo?: string;
    }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/v1/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            const data = await response.json();
            if (response.ok) {
                dispatch(updateProfile(data));
                toast.success('Profile updated successfully!');
            } else {
                toast.error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('Error updating profile');
        }
    };

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
            <div className="flex items-center gap-2 text-white ml-2 mt-8 cursor-pointer hover:text-gray-300 user">
                <UserSearch size={24} strokeWidth={3} /> 
                <p className="font-semibold">Search</p>
            </div>
            <NavLink to="/followboard" className="flex items-center gap-2 text-white ml-2 mt-8 cursor-pointer hover:text-gray-300 user">
                <Heart size={24} strokeWidth={1} /> 
                <p>Follow</p>
            </NavLink>
            <NavLink to="/profile" className="flex items-center gap-2 text-white ml-2 mt-8 cursor-pointer hover:text-gray-300 user">
                <CircleUserRound size={24} strokeWidth={1} /> 
                <p>Profile</p>
            </NavLink>
            <button className='bg-[#04A51E] hover:bg-[#008616] text-white w-full py-2 px-4 rounded-full mt-10 cursor-pointer' onClick={() => setIsPostinganOpen(true)}>Create Post</button>
            <NavLink 
                to="/#" onClick={handleLogout} className="flex items-center gap-2 text-white ml-2 mt-auto cursor-pointer hover:text-gray-300 user mb-4 mt-8">
                <LogOut size={24} strokeWidth={1} /> 
                <p>Logout</p>
            </NavLink>
        </div>
  
        {/* Main Content - 5/10 */}
        <div className="col-span-5 bg-gray-800 p-4 border-r border-gray-700">
            <div className="flex flex-col h-full">
                <Input 
                        className='rounded-full placeholder:text-gray-400 text-white' 
                        type="text"
                        placeholder="Search your friend"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

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
                                    className="text-gray-400 hover:text-white">
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

                <div className="mt-4">
                        {isSearching ? (
                            <div className="flex justify-center items-center">
                                <p className="text-white">Searching...</p>
                            </div>
                        ) : searchError ? (
                            <div className="text-red-500 text-center">{searchError}</div>
                        ) : searchResults.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {searchResults.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-12 h-12">
                                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col items-start">
                                                <span className="text-white items-start font-medium">{user.name}</span>
                                                <span className="text-gray-400">@{user.username}</span>
                                                <span className="text-gray-400">{user.followers} followers</span>
                                            </div>
                                        </div>
                                        {user.id !== loggedInUserId.toString() && (
                                            <Button
                                                variant="outline"
                                                onClick={() => handleFollowClick(Number(user.id))}
                                                className={`rounded-full cursor-pointer ${
                                                    user.is_following
                                                    ? 'bg-gray-800 text-gray-400 border-gray-600' 
                                                    : 'bg-transparent border-white text-white'
                                                }`}
                                            >
                                                {user.is_following ? 'Unfollow' : 'Follow'}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : searchTerm ? (
                            <div className="flex flex-col justify-center items-center mt-48">
                                <p className="font-bold text-white">No results found</p>
                                <p className="font-normal text-gray-400">
                                    Try searching for something else or check the<br/> spelling of what you typed.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center items-center mt-48">
                                <p className="font-bold text-white">Write and search something</p>
                                <p className="font-normal text-gray-400">
                                    Try searching for something else or check the<br/> spelling of what you typed.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
  
        {/* Right Sidebar - 3/10 */}
        <div className="col-span-3 bg-gray-900 p-4">

            {/* Card Profile */}
            <Card className="bg-gray-900 text-white p-4 rounded-lg">
                <h2 className="text-heading text-l ">Profile</h2>
                {/* Banner */}
                <div className="-mt-4 h-14 w-full bg-gradient-to-r from-green-200 via-green-400 to-green-600 rounded-lg" />

                {/* Profile Info */}
                <div className="relative -mt-8 flex items-center px-4">
                    <Avatar className="w-16 h-16 border-4 border-black cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setIsAvatarOpen(true)}>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>SA</AvatarFallback>
                    </Avatar>

                    <Button
                    variant="outline"
                    className="-mr-4 ml-auto bg-transparent border-white text-white rounded-full cursor-pointer" onClick={() => setIsEditprofileOpen(true)}>
                    Edit Profile
                    </Button>

                    {/* Dialog Avatar */}
                    <Dialog open={isAvatarOpen} onOpenChange={setIsAvatarOpen}>
                        <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700 text-white p-0">
                            <img 
                                src="https://github.com/shadcn.png" 
                                alt="Profile" 
                                className="w-full h-full object-cover rounded-lg"/>
                        </DialogContent>
                    </Dialog>

                    {/* Modal */}
                        {isEditprofileOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
                                    onClick={() => setIsEditprofileOpen(false)}
                                />
                                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg z-20 w-[600px]">
                                    <div className="flex flex-row justify-between items-center">
                                        <p className='text-s'>
                                            Edit Profile
                                        </p>
                                        <button 
                                            onClick={() => setIsEditprofileOpen(false)}
                                                className=" text-gray-400 hover:text-white">
                                                    ✕
                                        </button>
                                    </div>
                                    <div className="flex flex-column">
                                            {/* Edit Profile Modal */}
                                                            {isEditprofileOpen && (
                                                            <>
                                                                <div 
                                                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
                                                                onClick={() => setIsEditprofileOpen(false)}
                                                                />
                                                                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg z-20 w-[600px]">
                                                                <div className="flex justify-between items-center mb-4">
                                                                    <h2 className="text-white text-xl">Edit Profile</h2>
                                                                    <button 
                                                                    onClick={() => setIsEditprofileOpen(false)}
                                                                    className="text-gray-400 hover:text-white"
                                                                    >
                                                                    ✕
                                                                    </button>
                                                                </div>
                                                                <PostcardEditprofile 
                                                                    onSave={handleProfileUpdate}
                                                                    currentProfile={profile}
                                                                />
                                                                </div>
                                                            </>
                                                            )}
                                    </div>
                                </div>
                            </>
                        )}
                </div>

                {/* Name & Bio */}
                <CardContent>
                    <h2 className="-ml-4 -mt-4 text-l font-semibold flex flex-col text-left">{profile.name}</h2>
                    <div className="-ml-4 flex flex-col text-left">
                        <p className="text-gray-400">@{profile.username}</p>
                        <p className="text-gray-300 text-sm">{profile.bio}</p>
                    </div>

                        <div className="mt-2 -ml-4 flex flex-row items-center text-left">
                            <LucideCircle 
                                size={12} 
                                className={`${isOnline ? 'text-green-400' : 'text-gray-400'} fill-current mr-1`} 
                            />
                            <p className="text-gray-300 text-sm">
                                {isOnline ? 'Online' : 'Offline'}
                            </p>
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

export default Search;