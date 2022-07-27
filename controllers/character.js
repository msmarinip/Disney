const { Character, Op, conn, Movie } = require('../database/config.js');



const createCharacter = async (req, res) => {
    const { name, age, weight, movies, image } = req.body;
    // const image = req.file;
    // console.log(image);
    const trans = await conn.transaction();
    try {
        const character = await Character.create({
            name,
            image,
            age,
            weight
        }, { transaction:trans });
        if(movies.lenght > 0){
            await character.setMovies(movies, {transaction: trans})
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
            console.log(character)

        // await Movie.findAll()
        // await Character.removeMovies(character);
        
        if(movies.lenght > 0) await character.setMovies(movies, { transaction: trans })

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


module.exports = {
    createCharacter,
    updateCharacter
}