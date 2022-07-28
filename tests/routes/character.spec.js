const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../app.js');
const { Character, conn } = require('../../database/config.js');
const { generateJWT } = require('../../helpers/jwt.js');

const agent = session(app);
const character = {
  name: 'TestCharacter',
  age: 20,
  weight: 70,
  image: 'image.png'
};



describe('Character routes', async () => { 
    before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
    const token = await generateJWT(1, 'TestCharacter');
    
    // beforeEach(() => Character.destroy({
    //         where: {
    //             name: 'TestCharacter'
    //         }
    //     })
    //     .then(() => Character.create(character))
    // );
    beforeEach(() => Character.create(character));
    afterEach(() => Character.destroy({ where: { name: 'TestCharacter' } }));
    describe('GET /characters', () => {
      it('should get 200', () =>
        agent.get('/characters')
        .set('x-token', token)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res){
            expect(res.body).not.to.be.empty;
        })
      );
      it('should get 401, Unauthorized, if no token is sent', () =>
        agent.get('/characters')
        .set('x-token', '')
        .expect(401)
        .expect('Content-Type', /json/)
      );
      it('should get 200 and the character TestCharacter', () =>
        agent.get('/characters?name=testcharacter')
        .set('x-token', token)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res){
            expect(res.body.characters).to.have.length(1);
            expect(res.body.ok).to.be.true;
        })
      );
    });
 })