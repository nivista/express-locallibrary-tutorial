let moment = require('moment')
let mongoose = require('mongoose')

let Schema = mongoose.Schema

let AuthorSchema = new Schema({
    first_name: { type: String, required: true, max: 100 },
    family_name: { type: String, required: true, max: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
})

//Virtual for author's full name
AuthorSchema.virtual('name').get(function () {
    // To avoid errors in cases where an author does not have either a family name or first name
    // We want to make sure we handle the exception by returning an empty string for that case
    let fullname = ''
    if (this.first_name && this.family_name) {
        fullname = this.family_name + ', ' + this.first_name
    }
    if (!this.first_name || !this.family_name) {
        fullname = ''
    }
    return fullname
})

AuthorSchema.virtual('url').get(function () {
    return '/catalog/author/' + this._id
})

AuthorSchema.virtual('date_of_birth_formatted').get(function () {
    return this.date_of_birth
        ? moment(this.date_of_birth).format('MMMM Do, YYYY')
        : ''
})

AuthorSchema.virtual('date_of_death_formatted').get(function () {
    return this.date_of_death
        ? moment(this.date_of_death).format('MMMM Do, YYYY')
        : ''
})

AuthorSchema.virtual('lifespan').get(function () {
    return this.date_of_birth_formatted + ' - ' + this.date_of_death_formatted
})

module.exports = mongoose.model('Author', AuthorSchema)
