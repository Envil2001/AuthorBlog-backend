
const Comment = require("../models/commentModel");
const postModel = require("../models/postModel");

class commentController {
    async createComment(req, res) {
        try {
            const { comment } = req.body
            const postId = req.params.id;
            if (!comment)
                return res.json({ message: 'Комментарий не может быть пустым' })
    
            const newComment = new Comment({ 
                comment, 
                user: req.userId,
            })
            await newComment.save()
    
            try {
                await postModel.findByIdAndUpdate(postId, {
                    $push: { comments: newComment._id, },
                }).populate('user')
            } catch (error) {
                console.log(error)
            }
    
            res.json(newComment)
        } catch (error) {
            res.json({ message: 'Что-то пошло не так.', error })
        }
    }

}


module.exports = new commentController();