const { Movie, Character, conn } = require('../database/config.js');

const createMovie = async (req, res) => {
    const { title, genreId, image, date, score, isMovie, characters } = req.body;
    
    const trans = await conn.transaction();
    try {
        const movie = await Movie.create({
            title,
            genreId,
            image,
            date,
            score,
            isMovie
        }, { transaction: trans});
        
        if(characters.length > 0){ 
            await new Character()
            await movie.setCharacters(characters, {transaction: trans})
        }
        await trans.commit();
        res.json({
            ok: true,
            movie: {
                id: movie.id,
                title: movie.title,
                genreId: movie.genreId,
                image: movie.image,
                date: movie.date,
                score: movie.score,
                isMovie: movie.isMovie,
                characters
            }
        });    
    } catch (error) {
        await trans.rollback()
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error',
            error
        });
    }
        
    
}

const updateMovie = async (req, res) => {
    const { id } = req.params;
    const { title, genreId, image, date, score, isMovie, characters } = req.body;

    const trans = await conn.transaction();
    try {
        const movie = await Movie.update({
            title,
            genreId,
            image,
            date,
            score,
            isMovie
        }, {
            where: {
                id: parseInt(id)
            },
            returning: true,
            plain: true
        });

        await new Character();
        await movie[1].setCharacters(characters, {transaction: trans});
        await trans.commit();

        res.json({
            ok: true,
            movie: {
                id: movie[1].id,
                title: movie[1].title,
                genreId: movie[1].genreId,
                image: movie[1].image,
                date: movie[1].date,
                score: movie[1].score,
                isMovie: movie[1].isMovie,
                characters
            }
        });
    } catch (error) {
        await trans.rollback();
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error',
            error
        });
    }
};


const deleteMovie = async (req, res) => {
    const { id } = req.params;
    const trans = await conn.transaction();
    try {
        const movie = await Movie.destroy({
            where: {
                id: parseInt(id)
            }
        },{transaction: trans});
        
        await trans.commit();
        res.json({
            ok: true,
            movie
        });
    } catch (error) {
        await trans.rollback();
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error',
            error
        });
    }
};

const getMovies = async (req, res) => {
    try {
        const movies = await Movie.findAll({
            attributes: ['title', 'image', 'date'],
          });
        res.json({
            ok: true,
            movies
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error',
            error
        });
    }
}

module.exports = {
    createMovie,
    updateMovie,
    deleteMovie,
    getMovies
}