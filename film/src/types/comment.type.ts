export interface CommentService{
    id: string;
    comment_filmId: string | null;
    comment_user_id: string;
    comment_content: string;
    comment_left: number;
    comment_right: number;
    comment_parentId: string | null;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}