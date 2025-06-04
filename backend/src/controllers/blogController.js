import Blog from '../models/Blog.js';
import { cloudinary } from '../config/cloudinary.js';

export const createBlog = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const images = req.files?.images || [];

        // Upload images to cloudinary
        const uploadedImages = await Promise.all(
            images.map(async (image) => {
                try {
                    const result = await cloudinary.uploader.upload(image.path, {
                        folder: 'blog_images',
                        resource_type: 'image'
                    });
                    return {
                        url: result.secure_url,
                        caption: image.originalname
                    };
                } catch (error) {
                    console.error('Error uploading image:', error);
                    throw new Error('Failed to upload image');
                }
            })
        );

        const blog = new Blog({
            title,
            content,
            category,
            createdBy: req.user.id,
            images: uploadedImages,
            status: 'pending'
        });

        await blog.save();
        
        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            blog
        });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating blog',
            error: error.stack
        });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ })
            .sort({ publishDate: -1 });
        
        res.status(200).json({
            success: true,
            blogs
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blogs',
            error: error.message
        });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blog',
            error: error.message
        });
    }
};

export const getExpertBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ createdBy: req.user.id })
            .sort({ publishDate: -1 });
        
        res.status(200).json({
            success: true,
            blogs
        });
    } catch (error) {
        console.error('Error fetching expert blogs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching expert blogs',
            error: error.message
        });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { title, content, category, status } = req.body;
        const images = req.files?.images || [];

        const blog = await Blog.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found or unauthorized'
            });
        }

        // Upload new images if any
        if (images.length > 0) {
            const uploadedImages = await Promise.all(
                images.map(async (image) => {
                    const result = await cloudinary.uploader.upload(image.path, {
                        folder: 'blog_images',
                        resource_type: 'image'
                    });
                    return {
                        url: result.secure_url,
                        caption: image.originalname
                    };
                })
            );
            blog.images.push(...uploadedImages);
        }

        // Update other fields
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.category = category || blog.category;
        blog.status = status || blog.status;

        await blog.save();
        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            blog
        });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating blog',
            error: error.message
        });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found or unauthorized'
            });
        }

        await blog.remove();
        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting blog',
            error: error.message
        });
    }
};

export const getBlogsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const blogs = await Blog.find({
            category,
            
        }).sort({ publishDate: -1 });

        res.status(200).json({
            success: true,
            blogs
        });
    } catch (error) {
        console.error('Error fetching blogs by category:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blogs',
            error: error.message
        });
    }
};

export const approveBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        if (blog.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Blog is already ${blog.status}`
            });
        }

        blog.status = 'approved';
        await blog.save();

        res.status(200).json({
            success: true,
            message: 'Blog approved successfully',
            blog
        });
    } catch (error) {
        console.error('Error approving blog:', error);
        res.status(500).json({
            success: false,
            message: 'Error approving blog',
            error: error.message
        });
    }
};

export const rejectBlog = async (req, res) => {
    try {
        const { reason } = req.body;
        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason is required'
            });
        }

        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        if (blog.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Blog is already ${blog.status}`
            });
        }

        blog.status = 'rejected';
        blog.rejectionReason = reason;
        await blog.save();

        res.status(200).json({
            success: true,
            message: 'Blog rejected successfully',
            blog
        });
    } catch (error) {
        console.error('Error rejecting blog:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting blog',
            error: error.message
        });
    }
};

export const getPendingBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'pending' })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            blogs
        });
    } catch (error) {
        console.error('Error fetching pending blogs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching pending blogs',
            error: error.message
        });
    }
};