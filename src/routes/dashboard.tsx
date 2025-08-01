import React, { useState, useEffect, useRef} from 'react';
import iconCircle from '../assets/images/circle.png';
import '../assets/styles/global.css';
import {
    Home,
    UserSearch,
    Heart,
    CircleUserRound,
    ImagePlus,
    LogOut,
    // LucideAArrowDown,
    LucideCircle,
    LucideArrowLeft,
  } from "lucide-react";

import Lottie from "lottie-react";
import loadingworld from "@/assets/lottie/loadingworld.json";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PostcardHome from "@/components/ui/postcard/postcard-home";
// import postsHomedata from '@/data/home-data.json';
import PostcardSuggested from "@/components/ui/postcard/postcard-suggested";
import postsSuggesteddata from '@/data/suggested-data.json';
import PostcardPosting from "@/components/ui/postcard/postcard-posting";
import PostcardReply from "@/components/ui/postcard/postcard-reply";
import PostcardReplyfromuser from "@/components/ui/postcard/postcard-replyfromuser";
import PostcardPostingselected from "@/components/ui/postcard/postcard-postingselected";
import { NavLink, useNavigate } from 'react-router-dom';
import PostcardEditprofile from "@/components/ui/postcard/postcard-editprofile";
// import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PostCardProps } from '@/types/home';
import { APISemuanya } from '@/lib/api';

import { Toaster, toast } from 'sonner';

import { io } from 'socket.io-client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setProfile, updateProfile } from '@/lib/redux/profileSlice';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const [followingState, setFollowingState] = useState<{ [key: number]: boolean }>({});
    const [isEditprofileOpen, setIsEditprofileOpen] = useState(false);
    const [isPostinganOpen, setIsPostinganOpen] = useState(false);
    const [setIsAvatarOpen] = useState(false);
    // const [isLikeClicked, setisLikeClicked] = useState(false);
    // const [setisCommentClicked] = useState(false);
    const [threads, setThreads] = useState<PostCardProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const [isOnline, setIsOnline] = useState(false);
    const [socket, setSocket] = useState<any>(null);
    const [selectedPost, setSelectedPost] = useState<PostCardProps | null>(null);

    const [isImagePostExpandModalOpen, setIsImagePostExpandModalOpen] = useState(false);

    const [replies, setReplies] = useState<any[]>([]);

    const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({});

    const [likedReplies, setLikedReplies] = useState<{ [key: number]: boolean }>({});

    const API_URL = import.meta.env.VITE_API_BASE_URL;

    //Data User yang Login
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.profile);

    // const [imageProcessingStatus, setImageProcessingStatus] = useState<{ [key: number]: string }>({});

    const handleImageSelect = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        }
    };


    useEffect(() => {
    const loadThreads = async () => {
        try {
            const response = await APISemuanya.threads.getAll();
            const threadsData = response.data.data.threads.map((thread: any) => ({
                id: thread.id,
                username: thread.user.name,
                userHandle: thread.user.username,
                content: thread.content,

                image: thread.image,

                timestamp: formatTimestamp(thread.created_at),
                avatarUrl: thread.user.profile_picture || "https://picsum.photos/200/?random=2",
                likecount: thread.likes,
                created_at: thread.created_at
            }));
            setThreads(threadsData);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to load threads:', error);
            setIsLoading(false);
        }
    };
        loadThreads();
    }, []);

    const formatTimestamp = (created_at: string) => {
        const now = new Date();
        const created = new Date(created_at);
        const diff = Math.floor((now.getTime() - created.getTime()) / 1000 / 60); // menit

        if (diff < 60) return `${diff}m`;
        if (diff < 1440) return `${Math.floor(diff/60)}h`;
        return `${Math.floor(diff/1440)}d`;
    };

    const newformatTimestamp = (created_at: string) => {
        const date = new Date(created_at);

        // Format waktu: 2 digit jam, 2 digit menit, AM/PM
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // jam 0 jadi 12
        const strTime = `${hours.toString().padStart(2, '0')}.${minutes.toString().padStart(2, '0')} ${ampm}`;

        // Format tanggal: Month day, year
        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();

        return `${strTime} . ${month} ${day}, ${year}`;
    };

    const handleFollowClick = (userId: number) => {
        setFollowingState(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    const handlePost = async () => {
    if (!content.trim()) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Ga ada tokennya');
                return;
            }

            const formData = new FormData();
            formData.append('content', content.trim());

            // Nama filename
            if (selectedImage) {
                formData.append('image', selectedImage, selectedImage.name);
                // formData.append('processImage', 'true');
                toast.info('Uploading image...');
            }

            const response = await APISemuanya.threads.create({
                content: content.trim(),
                image: selectedImage
            });

            console.log('Create response:', response.data);

            if (response.data.code === 200) {
                // const threadId = response.data.data.id;

                // if (selectedImage) {
                // setImageProcessingStatus(prev => ({
                //     ...prev,
                //     [threadId]: 'processing'
                // }));
                // }
                
                setContent('');
                setSelectedImage(null);
                setImagePreview(null);

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                
                const loadThreads = async () => {
                    try {
                        const response = await APISemuanya.threads.getAll();
                        
                        const threadsData = response.data.data.threads.map((thread: any) => ({
                            id: thread.id,
                            username: thread.user.name,
                            userHandle: thread.user.username,
                            content: thread.content,
                            image: thread.image ? `${API_URL}${thread.image}` : null,
                            timestamp: formatTimestamp(thread.created_at),
                            avatarUrl: thread.user.profile_picture || "https://picsum.photos/200/?random=2",
                            likecount: thread.likes,
                            created_at: thread.created_at
                        }));
                        setThreads(threadsData);
                        toast.success('Postingan berhasil diupload!');
                    } catch (error) {
                        console.error('Failed to reload threads:', error);
                        toast.error('Gagal memuat postingan baru');
                    }
                };
                await loadThreads();
            }
        } catch (error) {
            console.error('Failed to create thread:', error);
            toast.error('Failed to create threads');
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

    useEffect(() => {
        const newSocket = io(`${API_URL}`);
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

    useEffect(() => {
        const socket = io('${API_URL}');
        setSocket(socket);

        // Listen for new threads
        socket.on('newThread', (thread: any) => {
            setThreads(prev => [{
                id: thread.id,
                username: thread.user.name,
                userHandle: thread.user.username,
                content: thread.content,
                image: thread.image ? `${API_URL}${thread.image}` : null,
                timestamp: formatTimestamp(thread.created_at),
                avatarUrl: thread.user.profile_picture || "https://picsum.photos/200/?random=2",
                likecount: thread.likes,
                created_at: thread.created_at
            }, ...prev]);
        });

        socket.on('imageProcessed', (data: { threadId: number, status: string, imageUrl?: string }) => {

            if (data.status === 'completed' && data.imageUrl) {
                setThreads(prev => prev.map(thread => 
                    thread.id === data.threadId 
                        ? { ...thread, imageUrl: data.imageUrl }
                        : thread
                ));
                toast.success('Image processed successfully!');
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
    if (selectedPost) {
        const fetchReplies = async () => {
            try {
                const token = localStorage.getItem('token');
                // const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                
                // Fetch replies
                const res = await fetch(`${API_URL}/api/v1/reply?thread_id=${selectedPost.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                
                // Sort replies by date
                // const sortedReplies = data.data.replies.sort((a: any, b: any) => 
                //     new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                // );

                // Check like status for each reply
                // const repliesWithLikeStatus = await Promise.all(sortedReplies.map(async (reply: any) => {
                //     // Fetch like status for each reply
                //     const likeResponse = await fetch(`${API_URL}/api/v1/like?thread_id=${reply.id}`, {
                //         headers: {
                //             Authorization: `Bearer ${token}`
                //         }
                //     });
                //     const likeData = await likeResponse.json();
                    
                //     // Check if current user has liked this reply
                //     const isLiked = likeData.data.like.some(
                //         (like: any) => like.user.id === currentUser.user_id
                //     );

                //     // Update liked replies state
                //     setLikedReplies(prev => ({
                //         ...prev,
                //         [reply.id]: isLiked
                //     }));

                //     return {
                //         id: reply.id,
                //         user: reply.user,
                //         content: reply.content,
                //         created_at: reply.created_at,
                //         likes: reply.likes || 0,
                //         is_liked: isLiked
                //     };
                // }));

                setReplies(data.data.replies);
            } catch (err) {
                console.error('Failed to fetch replies:', err);
                setReplies([]);
            }
        };
        fetchReplies();
    } else {
        setReplies([]);
    }
}, [selectedPost]);

    useEffect(() => {
        if (!socket) return;

        // Listen for new replies
        socket.on('newReply', (reply: { thread_id: number; }) => {
            // Pastikan reply untuk thread yang sedang dibuka
            if (selectedPost && reply.thread_id === selectedPost.id) {
                setReplies(prev => [reply, ...prev]);
            }
        });

        return () => {
            socket.off('newReply');
        };
    }, [socket, selectedPost]);

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

    // console.log("threadId:", selectedPost?.id);
    // console.log("User ID:", user.user_id);

    const handleProfileUpdate = async (updatedData: {
        username?: string;
        name?: string;
        bio?: string;
        avatar?: string;
        cover_photo?: string;
    }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('${API_URL}/api/v1/profile', {
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

    const checkLikeStatus = async (threadId: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/v1/like?thread_id=${threadId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.status === 'success') {
                // Check if current user has liked this post
                const currentUserId = user.user_id;
                const isLiked = data.data.like.some((like: any) => like.user.id === currentUserId);
                setLikedPosts(prev => ({
                    ...prev,
                    [threadId]: isLiked
                }));
                return isLiked;
            }
            return false;
        } catch (error) {
            console.error('Failed to check like status:', error);
            return false;
        }
    };

    const handleLike = async (threadId: number) => {
    try {
        const token = localStorage.getItem('token');
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        
        // First check if post is already liked
        const checkLikeResponse = await fetch(`${API_URL}/api/v1/like?thread_id=${threadId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        const checkLikeData = await checkLikeResponse.json();
        
        const isCurrentlyLiked = checkLikeData.data.like.some(
        (like: any) => like.user.id === currentUser.user_id
        );

        // Toggle like based on current state
        if (isCurrentlyLiked) {
        // Unlike - DELETE request
        const response = await fetch(`${API_URL}/api/v1/like/${threadId}`, {
            method: 'DELETE',
            headers: {
            Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        if (data.message === "Tweet unliked successfully") {
            setLikedPosts(prev => ({
            ...prev,
            [threadId]: false
            }));
            // Decrement like count
            setThreads(prev => prev.map(thread => 
            thread.id === threadId
                ? { ...thread, likecount: thread.likecount - 1 }
                : thread
            ));
        }
        } else {
        // Like - POST request
        const response = await fetch(`${API_URL}/api/v1/like`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
            tweet_id: threadId.toString(),
            user_id: currentUser.user_id.toString()
            })
        });
        const data = await response.json();
        
        if (data.message === "Tweet liked successfully") {
            setLikedPosts(prev => ({
            ...prev,
            [threadId]: true
            }));
            // Increment like count
            setThreads(prev => prev.map(thread => 
            thread.id === threadId
                ? { ...thread, likecount: thread.likecount + 1 }
                : thread
            ));
        }
        }
    } catch (error) {
        console.error('Failed to toggle like:', error);
        toast.error('Failed to update like status');
    }
    };

    const handleReplyLike = async (replyId: number) => {
        try {
            const token = localStorage.getItem('token');
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            
            // Check current like status
            const checkLikeResponse = await fetch(`${API_URL}/api/v1/like?thread_id=${replyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const checkLikeData = await checkLikeResponse.json();
            
            const isCurrentlyLiked = checkLikeData.data.like.some(
                (like: any) => like.user.id === currentUser.user_id
            );

            if (isCurrentlyLiked) {
                // Unlike
                const response = await fetch(`${API_URL}/api/v1/like/${replyId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                
                if (data.message === "Tweet unliked successfully") {
                    setLikedReplies(prev => ({
                        ...prev,
                        [replyId]: false
                    }));
                    // Update reply like count
                    setReplies(prev => prev.map(reply => 
                        reply.id === replyId
                            ? { ...reply, likecount: reply.likecount - 1 }
                            : reply
                    ));
                }
            } else {
                // Like
                const response = await fetch('${API_URL}/api/v1/like', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        tweet_id: replyId.toString(),
                        user_id: currentUser.user_id.toString()
                    })
                });
                const data = await response.json();
                
                if (data.message === "Tweet liked successfully") {
                    setLikedReplies(prev => ({
                        ...prev,
                        [replyId]: true
                    }));
                    // Update reply like count
                    setReplies(prev => prev.map(reply => 
                        reply.id === replyId
                            ? { ...reply, likecount: reply.likecount + 1 }
                            : reply
                    ));
                }
            }
        } catch (error) {
            console.error('Failed to toggle reply like:', error);
            toast.error('Failed to update like status');
        }
    };

    useEffect(() => {
        const checkLikes = async () => {
            for (const thread of threads) {
                await checkLikeStatus(thread.id);
            }
        };
        
        if (threads.length > 0) {
            checkLikes();
        }
    }, [threads]);

    return (
      <div className="grid grid-cols-10 min-h-screen overflow-hidden">
        {/* Left Sidebar 2/10 */}
        <div className="col-span-2 bg-gray-900 p-4 border-r border-gray-700 flex flex-col">
        <Toaster position="top-center" />
        <img 
            className="icon-heading ml-2 w-40 h-12" 
            src={iconCircle} 
            alt="Circle" />
            <NavLink to="/dashboard" className="flex items-center gap-2 text-white ml-2 mt-10 cursor-pointer hover:text-gray-300 user">
                <Home size={24} strokeWidth={3}  /> 
                <p className="font-semibold" >Home</p>
            </NavLink>
            <NavLink to="/search" className="flex items-center gap-2 text-white ml-2 mt-8 cursor-pointer hover:text-gray-300 user">
                <UserSearch size={24} strokeWidth={1} /> 
                <p>Search</p>
            </NavLink>
            <NavLink to="/followboard" className="flex items-center gap-2 text-white ml-2 mt-8 cursor-pointer hover:text-gray-300 user">
                <Heart size={24} strokeWidth={1} /> 
                <p>Follow</p>
            </NavLink>
            <NavLink to="/profile" className="flex items-center gap-2 text-white ml-2 mt-8 cursor-pointer hover:text-gray-300 user">
                <CircleUserRound size={24} strokeWidth={1} /> 
                <p>Profile</p>
            </NavLink>
            <button className='bg-[#04A51E] hover:bg-[#008616] text-white w-full py-2 px-4 rounded-full mt-10 cursor-pointer' type="submit" onClick={() => setIsPostinganOpen(true)}>Create Post</button>
            <NavLink 
                to="/#" onClick={handleLogout} className="flex items-center gap-2 text-white ml-2 mt-auto cursor-pointer hover:text-gray-300 user mb-4 mt-8">
                <LogOut size={24} strokeWidth={1} /> 
                <p>Logout</p>
            </NavLink>
        </div>
  
        {/* Main Content - 5/10 */}
        <div className="col-span-5 bg-gray-800 p-4 border-r border-gray-700 overflow-y-scroll no-scrollbar h-screen">
            <div className="flex flex-col">
            {!selectedPost && (
                <>
                <div className="flex items-center">
                    <p className="text-white text-xl">
                        Home
                    </p>
                </div>
                <div className="mt-4 flex flex-row items-center w-full gap-4">
                    <div className="flex items-center flex-1">
                        <Avatar className="w-10 h-10 border-black">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>SA</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-1 ml-2">
                    <input 
                        type="text" 
                        placeholder="What is happening?!"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-3 py-2 text-white bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                            />
                            {imagePreview && (
                <div className="relative mt-2">
                    <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-60 rounded-lg"
                    />
                    <button
                        onClick={() => {
                            setSelectedImage(null);
                            setImagePreview(null);
                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }
                        }}
                        className="absolute top-2 right-2 bg-gray-800/50 rounded-full p-1"
                    >
                        ✕
                    </button>
                </div>
            )}
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <ImagePlus 
                        size={24} 
                        strokeWidth={2} 
                        className="text-[#04A51E] hover:text-[#008616] cursor-pointer transition-colors"
                        onClick={handleImageSelect}
                    />
                    <Button 
                        className="bg-[#04A51E] text-white hover:bg-[#008616] rounded-full cursor-pointer"
                        onClick={handlePost}
                        disabled={!content.trim()}
                    >
                        Post
                    </Button>
                </div>
                <div className="border-b border-gray-600 mt-4" />
                    </>
                )}
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
                                    className="text-[#04A51E] hover:text-[#008616] cursor-pointer mr-2 transition-colors"
                                    onClick={handleImageSelect}/>
                                <Button
                                    className="bg-[#04A51E] text-white hover:bg-[#008616] rounded-full cursor-pointer">
                                    Post
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                <div className="mt-2 flex flex-col w-full">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center">
                        <p className="text-2xl mb-6 text-white">Loading ...</p>
                        <Lottie animationData={loadingworld} loop={true} className="w-80 h-80" />
                        </div>
                    ) : (
                        selectedPost ? (
                        <div className="flex flex-col w-full">
                            
                            <div className="flex flex-col justify-start items-start mb-2">
                                <button
                                    className="text-white font-bold text-xl hover:text-white flex items-center gap-2 cursor-pointer"
                                    onClick={() => setSelectedPost(null)}
                                > <LucideArrowLeft size={24} />
                                    Back
                                </button>
                            </div>
                            <div className="w-full max-w-2xl mx-autorounded-lg pr-4 pl-4">
                                <PostcardPostingselected
                                    id={selectedPost.id}
                                    username={selectedPost.username}
                                    userHandle={selectedPost.userHandle}
                                    content={selectedPost.content}
                                    image={selectedPost.image}
                                    timestamp={selectedPost.created_at ? newformatTimestamp(selectedPost.created_at) : ''}
                                    avatarUrl={selectedPost.avatarUrl}
                                    likecount={selectedPost.likecount}
                                    isLiked={likedPosts[selectedPost.id]}
                                    onLikeClick={(e) => {
                                        e.stopPropagation();
                                        handleLike(selectedPost.id);
                                    }}
                                />
                                {selectedPost.image && (
                                    <>
                                        {isImagePostExpandModalOpen && (
                                            <div
                                                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                                                onClick={() => setIsImagePostExpandModalOpen(false)}
                                            >
                                                <img
                                                    src={selectedPost.image.startsWith('http') ? selectedPost.image : `${API_URL}${selectedPost.image}`}
                                                    alt="Large Post Image"
                                                    className="max-w-2xl max-h-[40vh] rounded-lg shadow-lg"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            
                            <div className="w-full pr-4 pl-4">
                                <PostcardReply
                                    threadId={selectedPost.id}
                                    userId={user.user_id}
                                    onSuccess={() => {}}
                                />
                                {replies.map((post) => (
                                    <PostcardReplyfromuser
                                        key={post.id}
                                        id={post.id}
                                        username={post.user.name}
                                        userHandle={post.user.username}
                                        content={post.content}
                                        avatarUrl={post.user.profile_picture}
                                        timestamp={formatTimestamp(post.created_at)}
                                        likecount={post.likecount}
                                        isLiked={likedReplies[post.id]}
                                        onLikeClick={(e) => {
                                            e.stopPropagation();
                                            handleReplyLike(post.id);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        ) : (
                        threads.map((post) => (
                            <div key={post.id} onClick={() => setSelectedPost(post)} className="cursor-pointer">
                                <PostcardHome
                                    id={post.id}
                                    username={post.username}
                                    userHandle={post.userHandle}
                                    content={post.content}
                                    image={post.image}
                                    timestamp={post.timestamp}
                                    avatarUrl={post.avatarUrl}
                                    likecount={post.likecount}
                                    isLiked={likedPosts[post.id]}
                                    onLikeClick={(e) => {
                                        e.stopPropagation(); // Prevent post selection when clicking like
                                        handleLike(post.id);
                                    }}
                                />
                            </div>
                            ))
                        )
                    )}
                    </div>
                </div>
            </div>
  
        {/* Right Sidebar - 3/10 */}
        <div className="col-span-3 bg-gray-900 p-4">

            {/* Card Profile */}
            <Card className="bg-gray-900 text-white p-4 rounded-lg">
            <h2 className="text-heading text-l">Profile</h2>
            <div className="-mt-4 h-14 w-full bg-gradient-to-r from-green-200 via-green-400 to-green-600 rounded-lg" />
            
            <div className="relative -mt-8 flex items-center px-4">
                <Avatar className="w-16 h-16 border-4 border-black cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setIsAvatarOpen(true)}>
                <AvatarImage src={profile.avatar} />
                <AvatarFallback>{profile.name?.[0]}</AvatarFallback>
                </Avatar>
                
                <Button
                variant="outline"
                className="-mr-4 ml-auto bg-transparent border-white text-white rounded-full cursor-pointer" 
                onClick={() => setIsEditprofileOpen(true)}>
                Edit Profile
                </Button>
            </div>

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
                                {followingState[post.id] ? 'Unfollow' : 'Follow'}
                            </Button>
                        </div>
                    ))}
                </div>

            </Card>

        </div>
      </div>
    );
};

export default Dashboard;