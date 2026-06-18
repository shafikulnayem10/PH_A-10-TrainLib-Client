import { serverFetch, protectedFetch, serverMutation } from "../core/server";


export const getLatestForumPosts = async () => {
    return serverFetch("/latest-posts");
};


export const getAllForumPosts = async (queryString = "") => {
    const query = queryString ? `?${queryString}` : "";
    return serverFetch(`/api/forum${query}`);
};


export const getPostDetails = async (id) => {
    return serverFetch(`/api/forum/${id}`);
};


export const createForumPost = async (postData) => {
    return serverMutation("/api/forum", postData, "POST");
};


// export const togglePostVote = async (postId, voteData) => {
//     return serverMutation(`/api/forum/${postId}/vote`, voteData, "PATCH");
// };


export const getPostComments = async (id) => {
    return serverFetch(`/api/forum/${id}/comments`);
};

export const addPostComment = async (id, commentData) => {
    return serverMutation(`/api/forum/${id}/comments`, commentData, "POST");
};