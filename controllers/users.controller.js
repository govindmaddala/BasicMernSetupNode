exports.sendHomeMessage = async (req, res, next) => {
    res.status(200).json({
        message: "message from backend user.controller.js"
    })
}