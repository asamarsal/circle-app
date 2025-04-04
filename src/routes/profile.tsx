import React, { useState } from 'react';
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

import { Card, CardContent } from "@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PostcardSuggested from "@/components/ui/postcard/postcard-suggested";
import postsSuggesteddata from '@/data/suggested-data.json';
import { NavLink } from 'react-router-dom';
import githubIcon from '../assets/images/icon/icon_github.png';
import linkedinIcon from '../assets/images/icon/icon_linkedin.png';
import mediumIcon from '../assets/images/icon/icon_medium.png';
import instagramIcon from '../assets/images/icon/icon_instagram.png';
import dumbwaysIcon from '../assets/images/icon/icon_dumbways.png';
import postsProfiledata from '@/data/profile-data.json';
import postsEditprofiledata from '@/data/editprofile-data.json';
import PostcardProfile from "@/components/ui/postcard/postcard-profile";
import PostcardEditprofile from "@/components/ui/postcard/postcard-editprofile";
import PostcardPosting from "@/components/ui/postcard/postcard-posting";
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Dashboard: React.FC = () => {
    const [followingState, setFollowingState] = useState<{ [key: number]: boolean }>({});
    const [isEditprofileOpen, setIsEditprofileOpen] = useState(false);
    const [isPostinganOpen, setIsPostinganOpen] = useState(false);
    const [isAvatarOpen, setIsAvatarOpen] = useState(false);

    const handleFollowClick = (userId: number) => {
        setFollowingState(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
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
            <NavLink to="/followboard" className="flex items-center gap-2 text-white ml-2 mt-8 cursor-pointer hover:text-gray-300 user">
                <Heart size={24} strokeWidth={1} /> 
                <p>Follow</p>
            </NavLink>
            <div className="flex items-center gap-2 text-white ml-2 mt-8 cursor-pointer hover:text-gray-300 user">
                <CircleUserRound size={24} strokeWidth={3} /> 
                <p className="font-semibold">Profile</p>
            </div>
            <button className='bg-[#04A51E] hover:bg-[#008616] text-white w-full py-2 px-4 rounded-full mt-10 cursor-pointer' onClick={() => setIsPostinganOpen(true)}>Create Post</button>
            <div className="flex items-center gap-2 text-white ml-2 mt-auto cursor-pointer hover:text-gray-300 user mb-8">
                <LogOut size={24} strokeWidth={1} /> 
                <p>Logout</p>
            </div>
        </div>
  
        {/* Main Content - 5/10 */}
        <div className="col-span-5 bg-gray-800 p-4 border-r border-gray-700">
            <div className="flex flex-col">
                <div className="flex items-center">
                    <p className="text-white text-xl">
                        Asa Marsal
                    </p>
                </div>
                {/* Card Profile */}
                <Card className="bg-gray-800 text-white border-0">
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
                    </div>

                    {/* Dialog Avatar */}
                    <Dialog open={isAvatarOpen} onOpenChange={setIsAvatarOpen}>
                        <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700 text-white p-0">
                            <img 
                                src="https://github.com/shadcn.png" 
                                alt="Profile" 
                                className="w-full h-full object-cover rounded-lg"/>
                        </DialogContent>
                    </Dialog>
                
                    {/* Name & Bio */}
                    <CardContent>
                        <h2 className="-ml-4 -mt-4 text-l font-semibold flex flex-col text-left">Asa Marsal</h2>
                        <div className="-ml-4 flex flex-col text-left ">
                            <p className="text-gray-400">@asamarsal</p>
                            <p className="text-gray-300 text-sm">Skrillex is back baby...</p>
                        </div>
                
                        {/* Following & Followers */}
                        <div className="-ml-4 mt-3 flex text-sm text-gray-400">
                            <span className="mr-4">
                                <strong className="text-white">291</strong> Following
                            </span>
                            <span>
                                <strong className="text-white">23</strong> Followers
                            </span>
                            </div>
                    </CardContent>
                </Card>
                <div className="border-b border-gray-600 mt-0" />
                <div className="mt-4 flex flex-col w-full">
                    {postsProfiledata.posts.map((post) => (
                        <PostcardProfile 
                            key={post.id}
                            username={post.username}
                            userHandle={post.userHandle}
                            content={post.content}
                            timestamp={post.timestamp}
                            avatarUrl={post.avatarUrl}
                            likecount={post.likecount}
                            imageUrl={post.imageUrl}
                        />
                    ))}
                </div>

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
            </div>
        </div>
  
        {/* Right Sidebar - 3/10 */}
        <div className="col-span-3 bg-gray-900 p-4">

            {/* Card Suggested for you */}
            <Card className=" bg-gray-900 text-white p-4 rounded-lg">
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
                                    <PostcardEditprofile />
                                </div>
                            </div>
                        </>
                    )}
            </Card>
            <Card className="bg-gray-900 text-white mt-4 p-2">
                {/* Profile Info */}
                <div className="flex items-center ml-4">
                    <p className='text-s -ml-2'>
                        Developed by Asa Marsal |
                    </p>
                    <a 
                        href="https://github.com/asamarsal" 
                        target="https://github.com/asamarsal"
                        className="ml-2 hover:opacity-80">
                        <img 
                            src={githubIcon} 
                            alt="GitHub"
                            className="w-6 h-6 brightness-0 invert"
                        />
                    </a>
                    <a 
                        href="https://github.com/asamarsal" 
                        target="https://github.com/asamarsal"
                        className="ml-2 hover:opacity-80">
                        <img 
                            src={linkedinIcon} 
                            alt="GitHub"
                            className="w-6 h-6 brightness-0 invert"
                        />
                    </a>
                    <a 
                        href="https://github.com/asamarsal" 
                        target="https://github.com/asamarsal"
                        className="ml-2 hover:opacity-80">
                        <img 
                            src={mediumIcon} 
                            alt="GitHub"
                            className="w-6 h-6 brightness-0 invert"
                        />
                    </a>
                    <a 
                        href="https://github.com/asamarsal" 
                        target="https://github.com/asamarsal"
                        className="ml-2 hover:opacity-80">
                        <img 
                            src={instagramIcon} 
                            alt="GitHub"
                            className="w-6 h-6 brightness-0 invert"
                        />
                    </a>
                </div>
                <div className="flex items-center ml-4 -mt-4">
                    <p className='text-s -ml-2'>
                        Powered by Dumbways Indonesia 
                    </p>
                    <a 
                        href="https://github.com/asamarsal" 
                        target="https://github.com/asamarsal"
                        className="ml-2 hover:opacity-80">
                        <img 
                            src={dumbwaysIcon} 
                            alt="Dumbways"
                            className="h-6"
                        />
                    </a>
                </div>
            </Card>
        </div>
      </div>
    );
};

export default Dashboard;