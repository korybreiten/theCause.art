module.exports = {
    saveImage
};

function saveImage(req, res) {
    const location = "images/" + req.file.filename;
    return res.status(200).json( location );
}