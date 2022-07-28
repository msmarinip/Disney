const { Character, conn } = require('../../database/config.js');
const { expect } = require('chai');


describe('Character model', () => { 
    before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
    describe('Validators', () => { 
        beforeEach(() => 
            Character.destroy({
                where: {
                    name: 'TestCharacter'
                }
            })

        );
        describe('name', () => {
            it('should throw an error if name is null', (done) => {
                Character.create({
                    name: '',
                    age: 20,
                    weight: 70,
                    image: 'image.png'
                })
                  .then(() => done(new Error('It requires a valid name')))
                  .catch(() => done());
            });
            it('should work when its a valid name and weight and age are sent', (done) => {
                
                Character.create({
                    name: 'TestCharacter',
                    age: 20,
                    weight: 70,
                    image: 'image.png'
                })
                  .then(() => done())
                  .catch(() => done(new Error('It requires a valid name')));
            })
            it('should not work when its a repeted name', (done) => {
                Character.bulkCreate([{ name: 'TestCharacter', age: 20, weight: 70, image: 'image.png' }, { name: 'TestCharacter', age: 20, weight: 70, image: 'image.png' }])
                  .then(() =>  done(new Error('It requires a unique name')))
                  .catch(() =>  done())
            });
        })
        describe('age', () => {
            it('should throw an error if age is not a number', (done) => {
                Character.create({
                    name: 'TestCharacter',
                    age: [25],
                    weight: 70,
                    image: 'image.png'
                })
                  .then(() => done(new Error('It requires a valid age')))
                  .catch(() => done());
            });
            it('should work if age is null', (done) => {
                Character.create({
                    name: 'TestCharacter',
                    age: null,
                    weight: 70,
                    image: 'image.png'
                })
                  .then(() => done())
                  .catch(() => done(new Error('It requires a valid age')));
            });

        })
        describe('weight', () => {
            it('should throw an error if weight is not a number', (done) => {
                Character.create({
                    name: 'TestCharacter',
                    age: 20,
                    weight: [25],
                    image: 'image.png'
                })
                  .then(() => done(new Error('It requires a valid weight')))
                  .catch(() => done());
            });
            it('should work if weight is null', (done) => {
                Character.create({
                    name: 'TestCharacter',
                    age: 20,
                    weight: null,
                    image: 'image.png'
                })
                  .then(() => done())
                  .catch(() => done(new Error('It requires a valid weight')));
            });

        })
        describe('image', () => {
            it('should throw an error if image is not a string', (done) => {
                Character.create({
                    name: 'TestCharacter',
                    age: 20,
                    weight: 70,
                    image: [25]
                })
                  .then(() => done(new Error('It requires a valid image')))
                  .catch(() => done());
            });
            it('should work if image is null', (done) => {
                Character.create({
                    name: 'TestCharacter',
                    age: 20,
                    weight: 70,
                    image: null
                })
                  .then(() => done())
                  .catch(() => done(new Error('It requires a valid image')));
            });

        })
     })
 })