export interface PostCardProps {
  id: number;
  username: string;
  userHandle: string;
  content: string;
  avatarUrl?: string;
  timestamp?: string;
  likecount: number;
  image?: string | null;
  created_at?: string;
  isLiked?: boolean;
  onLikeClick?: (e: React.MouseEvent) => void;
  // imageProcessingStatus?: string;
}