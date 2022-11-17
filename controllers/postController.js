const PostModel = require("../models/postModel");
const Comment = require("../models/commentModel");

class PostController {
    async create(req, res) {
        try {

            const doc = new PostModel({
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            });

            const post = await doc.save();
            res.json(post);
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: 'Не удалось создать статью'
            });
        }
    }
    async getAll(req, res) {
        try {
            const posts = await PostModel.find().populate('user').exec();

            res.json(posts);
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: 'Не удалось получить статьи'
            });
        }
    }
    async getPopular(req, res) {
        try {
            const posts = await PostModel.find().sort({ "viewsCount": -1 }).populate('user').exec();

            res.json(posts);
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: 'Не удалось получить статьи'
            });
        }
    }
    async getPostsBySearch(req, res) {
        try {
            const tag = req.params.tag;

            PostModel.find({ tags: tag },
                (err, doc) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            message: 'Не удалось вернуть статью'
                        });
                    }

                    if (!doc) {
                        return res.status(404).json({
                            message: "Статья не найдена"
                        });
                    }
                    res.json(doc);
                }
            ).populate('user');

            
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    async getLastTags(req, res) {
        try {
            const posts = await PostModel.find().limit(5).exec();
            const tags = posts.map(obj => obj.tags).flat().slice(0, 5);
            res.json(tags);
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: 'Не удалось получить теги'
            });
        }
    }
    async getOne(req, res) {
        try {
            const postId = req.params.id;

            PostModel.findOneAndUpdate({ _id: postId },
                {
                    $inc: { viewsCount: 1 },
                },
                {
                    returnDocument: 'after',
                },
                (err, doc) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            message: 'Не удалось вернуть статью'
                        });
                    }

                    if (!doc) {
                        return res.status(404).json({
                            message: "Статья не найдена"
                        });
                    }
                    res.json(doc);
                }
            ).populate('user');

        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: 'Не удалось получить статьи'
            });
        }
    }
    async getPostsComments(req, res) {
        try {
            const post = await PostModel.findById(req.params.id);
            const list = await Promise.all(
                post.comments.map((comment) => {
                    return Comment.findById(comment).populate('user')
                }),
            )
            res.json(list)
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: 'Не удалось получить комментарии'
            });
        }
    }
    async remove(req, res) {
        try {
            const postId = req.params.id;

            PostModel.findOneAndDelete({
                _id: postId,
            }, (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось удалить статью'
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: "Статья не найдена"
                    });
                }

                res.json({
                    message: "Статья удалена"
                })
            });


        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: 'Не удалось получить статьи'
            });
        }
    }
    async update(req, res) {
        try {
            const postId = req.params.id;
            await PostModel.updateOne({
                _id: postId
            },
                {
                    title: req.body.title,
                    text: req.body.text,
                    imageUrl: req.body.imageUrl,
                    tags: req.body.tags,
                    user: req.userId,
                },
            );

            res.json({
                message: "Статья обновлена"
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: 'Не удалось обновить статью'
            });
        }
    }
}

module.exports = new PostController();