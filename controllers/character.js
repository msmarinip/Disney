const { Character, Op, conn, Movie } = require('../database/config.js');



const createCharacter = async (req, res) => {
    const { name, age, weight, movies, image } = req.body;
    const trans = await conn.transaction();
    try {
        const character = await Character.create({
            name,
            image,
            age,
            weight
        }, { transaction:trans });
        if(movies.length > 0){
            await new Movie();
            await character.setMovies(movies, {transaction: trans});
        }
        await trans.commit();
        res.json({
            ok: true,
            character: {
                id: character.id,
                name: character.name,
                age: character.age,
                weight: character.weight,
                image: character.image,
                movies
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
}


const updateCharacter = async (req, res) => {
    const { id } = req.params;
    const { name, age, weight, movies, image } = req.body;
    
    const trans = await conn.transaction();
    try {
        
        const character = await Character.update({
            name,
            image,
            age,
            weight
        }, {
            where: {
                id: id
            },
            returning: true,
            plain: true,
            transaction: trans })

        await new Movie();
        await character[1].setMovies(movies, {transaction: trans});

        await trans.commit();
        res.json({
            ok: true,
            character: {
                id: character[1].id,
                name: character[1].name,
                age: character[1].age,
                weight: character[1].weight,
                image: character[1].image,
                movies
            }
        })
    } catch (error) {
        await trans.rollback();
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error',
            error
        });
    }
}


const deleteCharacter = async (req, res) => {
    const { id } = req.params;
    try {
        const character = await Character.destroy({
            where: {
                id: parseInt(id)
            }
        });
        res.json({
            ok: true,
            character
        });   
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error',
            error
        });
    }
        
    
}

const getCharacters = async (req, res) => {
    const { name, age, movies } = req.query;
    try {

        const characters =
            name ? await getCharactersByName(name)
            : age ? await getCharactersByAge(age)
            : movies ? await getCharactersByMovie(movies)
            : await getCharactersAll();
        res.json({
            ok: true,
            characters
        });   
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error',
            error
        });
    }
}
const getCharactersAll = async () => {
    try {
        const characters = await Character.findAll({
            attributes: ['name', 'image']
        });
        return characters;
    } catch (error) {
        console.log(error)
    }
}
const getCharactersByName = async (name) => {
    try {
        const characters = await Character.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            },
            attributes: ['id','name', 'image', 'age', 'weight'],
            include: [{
                model: Movie,
                through: {
                    attributes: []
                } 
            }]
        });
        return characters;
    } catch (error) {
        console.log(error)
    }
}
const getCharactersByAge = async (age) => {
    try {
        const characters = await Character.findAll({
            where: {
                age: parseInt(age)
            },
            attributes: ['id','name', 'image', 'age', 'weight'],
            include: [{
                model: Movie,
                through: {
                    attributes: []
                 } 
            }]
        });
        return characters;
    } catch (error) {
        console.log(error)
    }
}



const getCharactersByMovie = async (movie) => {
    try {
        const characters = await Character.findAll({
            attributes: ['id','name', 'image', 'age', 'weight'],
            include: {
                model: Movie,
                where: {
                  id: parseInt(movie)
                },
                attributes: [],
                through: {
                    attributes: []
                } 
              }
        });
        return characters;
    } catch (error) {
        console.log(error)
    }
}

const getByCharacter = async (req, res) => {
    const { id } = req.params;
    try {
        const character = await Character.findOne({
            where: {
                id: parseInt(id)
            },
            attributes: ['id', 'name', 'image', 'age', 'weight'],
            include: [{
                model: Movie,
                through: {
                    attributes: []
                }
                
            }]
        });
        res.json({
            ok: true,
            character
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
    createCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacters,
    getByCharacter
}