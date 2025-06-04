import CommunityPost from '../models/CommunityPost.js';
import { cloudinary } from '../config/cloudinary.js';

export const createPost = async (req, res) => {
    try {
        const { content, category, isAnonymous } = req.body;
        const images = req.files || [];

        // Upload images to cloudinary if any
        const uploadedImages = await Promise.all(
            images.map(async (image) => {
                const result = await cloudinary.uploader.upload(image.path, {
                    folder: 'community_posts',
                    resource_type: 'image'
                });
                return result.secure_url;
            })
        );

        const post = new CommunityPost({
            content,
            category,
            images: uploadedImages,
            isAnonymous: isAnonymous === 'true',
            author: req.user.id,
            authorModel: req.user.role === 'expert' ? 'Expert' : 'User'
        });

        await post.save();
        
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating post',
            error: error.stack
        });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await CommunityPost.find({})
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching posts',
            error: error.message
        });
    }
};

export const getPostsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const posts = await CommunityPost.find({ category })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        console.error('Error fetching posts by category:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching posts',
            error: error.message
        });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const posts = await CommunityPost.find({ author: userId })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user posts',
            error: error.message
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await CommunityPost.findOne({
            _id: req.params.postId,
            author: req.user.id
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found or unauthorized'
            });
        }

        // Delete images from cloudinary if any
        if (post.images && post.images.length > 0) {
            await Promise.all(
                post.images.map(async (imageUrl) => {
                    const publicId = imageUrl.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy('community_posts/' + publicId);
                })
            );
        }

        await post.remove();
        res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting post',
            error: error.message
        });
    }
};