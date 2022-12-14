const { Op } = require('sequelize');
const { BlogPost, PostCategory, User, Category } = require('../models');

const getAllPosts = async () => {
  const posts = await BlogPost.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] },
      },
      {
        model: Category,
        as: 'categories',
      },
    ],
  });

  return posts;
};

const getPostByPk = async (id) => {
  const post = await BlogPost.findOne({
    where: {
      id,
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] },
      },
      {
        model: Category,
        as: 'categories',
      },
    ],
  });

  return post;
};

const createPostCategory = async (categories, postId) => {
  await Promise.all(categories
    .map(async (categoryId) => PostCategory.create({ postId, categoryId })));
};

const createPost = async ({ title, content, userId, published, updated, categoryIds }) => {
  const newPost = await BlogPost.create({ title, content, userId, published, updated });

  await createPostCategory(categoryIds, newPost.id);

  return newPost;
};

const updatePost = async (id, body) => {
  const { title, content } = body;
  await BlogPost.update({ title, content }, {
    where: {
      id,
    },
  });
  const updated = await getPostByPk(id);
  return updated;
};

const deletePost = async (id) => {
  await BlogPost.destroy({
    where: {
      id,
    },
  });
};

const searchQueryPost = async (query) => {
  const posts = BlogPost.findAll({
    where: {
      [Op.or]: [{ title: { [Op.like]: query } }, { content: { [Op.like]: query } }],
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] },
      },
      {
        model: Category,
        as: 'categories',
      },
    ],
  });

  return posts;
};

module.exports = {
  createPost,
  getAllPosts,
  getPostByPk,
  updatePost,
  deletePost,
  searchQueryPost,
};