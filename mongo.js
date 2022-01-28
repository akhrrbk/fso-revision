const mongoose = require('mongoose')

// if(process.argv.length < 3){
//     console.log('provide the password in this order node mongo.js <password>');
// }

// const password = process.argv[2]

// const url = process.env.MONGODB_URI
const url = 'mongodb+srv://jalap:befwejrgfwejrgbwejrg@cluster0.jn9rt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'Tillakaakakakka',
    date: new Date(),
    important: true
})

// note.save().then(result => {
//     console.log('note saved');
//     mongoose.connection.close()
// })

Note.find({important: true}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
})