const { Genre } = require('../database/config.js');

const createGenre = async (req, res) => {
    const { name, image } = req.body;

    try {
        
        const genre = await Genre.create({ name, image });
        res.json({
            ok: true,
            genre
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        });
    }

}
const updateGenre = async (req, res) => {
    const { name, image } = req.body;
    const { id } = req.params;

    try {
        const genre = await Genre.update({ name, image },
            { where: { id },
            returning: true,
            plain: true });
        res.json({
            ok: true,
            genre: genre[1]
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        });
    }
}
const deleteGenre = async (req, res) => {
    const { id } = req.params;

    try {
        const genre = await Genre.destroy({ where: { id } });
        res.json({
            ok: true,
            genre
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        });
    }
}
const getGenres = async (req, res) => {
    try {
        const genres = await Genre.findAll();
        res.json({
            ok: true,
            genres
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        });
    }
}




module.exports = {
    createGenre,
    updateGenre,
    deleteGenre,
    getGenres
}