const { Movie, Character, Genre, conn, Op } = require('../database/config.js');

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
    const {name: title, order, genre} = req.query;
    const orderBy = order ? order : 'ASC';
    try {
        const movies = 
            title ? await getMoviesByTitle(title, orderBy) :
            genre ? await getMoviesByGenre(genre, orderBy) :
            await getMoviesAll(orderBy);
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

const getMoviesAll = (order) => {
    return Movie.findAll({
        attributes: ['title', 'image', 'date'],
        order: [
            ['title', order]
          ]
    });
}

const getMoviesByGenre = async (genre, order) => {
    
    try {
        const movies = await Movie.findAll({
            where: {
                genreId: genre
            },
            attributes: ['id','title', 'image', 'date', 'score', 'isMovie'],
            include: [{
                model: Character,
                attributes: ['id','name', 'image', 'age', 'weight'],
                through: {
                    attributes: []
                  } 
            },{
                model: Genre,
                attributes: ['id','name']
            }],
            order: [
                [Genre, 'name', order]
              ]
        });

        return movies;

     } catch (error) {
        console.log(error);
    }
}

const getMoviesByTitle = async (title, order) => {
    try {
        const movies = await Movie.findAll({
            where: {
                title: {[Op.iLike]: `%${title}%`}
            },
            attributes: ['id','title', 'image', 'date', 'score', 'isMovie'],
            include: [{
                model: Character,
                attributes: ['id','name', 'image', 'age', 'weight'],
                through: {
                    attributes: []
                  } 
            },{
                model: Genre,
                attributes: ['id','name']
            }],
            order: [['title', order]]
            
        });

        return movies;

     } catch (error) {
        console.log(error);
    }
}


const getByMovie = async (req, res) => {
    const { id } = req.params;
    try {
        const movie = await Movie.findOne({
            where: {
                id: parseInt(id)
            },
            attributes: ['id','title', 'image', 'date', 'score', 'isMovie'],
            include: [{
                model: Character,
                attributes: ['name', 'image', 'age', 'weight'],
                through: {
                    attributes: []
                  } 
            }],
            
        });
        res.json({
            ok: true,
            movie
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
    getMovies,
    getByMovie
}