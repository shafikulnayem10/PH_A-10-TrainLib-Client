import { serverFetch, protectedFetch, serverMutation } from "../core/server";

export const getLatestForumPosts = async () => {
    return serverFetch("/latest-posts");
};

export const getAllForumPosts = async (queryString = "") => {
    const query = queryString ? `?${queryString}` : "";
    return serverFetch(`/api/forum${query}`);
};

export const getPostDetails = async (id) => {
    return protectedFetch(`/api/forum/${id}`);
};

export const createForumPost = async (postData) => {
    return serverMutation("/api/forum", postData, "POST");
};

export const togglePostVote = async (postId, voteData) => {
    return serverMutation(`/api/forum/${postId}/vote`, voteData, "PATCH");
};

export const getPostComments = async (id) => {
    return protectedFetch(`/api/forum/${id}/comments`);
};

export const addComment = async (postId, commentData) => {
    return serverMutation(`/api/forum/${postId}/comment`, commentData, "POST");
};

export const editComment = async (commentId, commentData) => {
    return serverMutation(`/api/forum/comment/${commentId}`, commentData, "PATCH");
};

export const deleteComment = async (commentId, commentData) => {
    return serverMutation(`/api/forum/comment/${commentId}`, commentData, "DELETE");
};

export const addCommentReply = async (commentId, replyData) => {
    return serverMutation(`/api/forum/comment/${commentId}/reply`, replyData, "POST");
};