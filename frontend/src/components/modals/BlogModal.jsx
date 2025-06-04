import React from 'react';
import CreateBlog from '../blog/CreateBlog';

const BlogModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-w-3xl w-full mx-4">
        <CreateBlog onClose={onClose} />
      </div>
    </div>
  );
};

export default BlogModal;