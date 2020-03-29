const { body, validationResult } = require('express-validator')

let BookInstance = require('../models/bookinstance')
let Book = require('../models/book')

// Display list of all BookInstances.
exports.bookinstance_list = function (req, res, next) {
    BookInstance.find()
        .populate('book')
        .exec(function (err, list_bookinstances) {
            if (err) {
                return next(err)
            }
            // Successful, so render
            res.render('bookinstance_list', {
                title: 'Book Instance List',
                bookinstance_list: list_bookinstances,
            })
        })
}

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function (req, res, next) {
    BookInstance.findById(req.params.id)
        .populate('book')
        .exec(function (err, bookinstance) {
            if (err) {
                return next(err)
            }
            if (bookinstance == null) {
                // No results.
                let err = new Error('Book copy not found')
                err.status = 404
                return next(err)
            }
            // Successful, so render.
            res.render('bookinstance_detail', {
                title: 'Copy: ' + bookinstance.book.title,
                bookinstance: bookinstance,
            })
        })
}

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function (req, res, next) {
    Book.find({}, 'title').exec(function (err, books) {
        if (err) {
            return next(err)
        }
        // Successful, so render.
        res.render('bookinstance_form', {
            title: 'Create BookInstance',
            book_list: books,
        })
    })
}

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    // Validate fields.
    body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
    body('imprint', 'Imprint must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('due_back', 'Invalid date')
        .optional({ checkFalsy: true })
        .isISO8601()
        .escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req)

        // Create a BookInstance object with escaped and trimmed data.
        let bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
        })

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({}, 'title').exec(function (err, books) {
                if (err) {
                    return next(err)
                }
                // Successful, so render.
                res.render('bookinstance_form', {
                    title: 'Create BookInstance',
                    book_list: books,
                    selected_book: bookinstance.book._id,
                    errors: errors.array(),
                    bookinstance: bookinstance,
                })
            })
            return
        } else {
            // Data from form is valid.
            bookinstance.save(function (err) {
                if (err) {
                    return next(err)
                }
                // Successful - redirect to new record.
                res.redirect(bookinstance.url)
            })
        }
    },
]

exports.bookinstance_delete_get = function (req, res, next) {
    BookInstance.findById(req.params.id, function (err, bookinstance) {
        if (err) return next(err)
        console.log(bookinstance)
        if (bookinstance === null) {
            res.redirect('/catalog/bookinstances')
        }
        // should i bring more info about the bookinstance?
        res.render('bookinstance_delete', {
            title: 'Delete Book Instance',
            bookinstance,
        })
    })
}

exports.bookinstance_delete_post = function (req, res, next) {
    console.log(req.body.bookinstanceid)
    BookInstance.findByIdAndRemove(req.body.bookinstanceid, function (err) {
        console.log('hello')
        if (err) {
            console.log('hi')
            next(err)
        }
        console.log('hello')
        console.log(req.body.bookinstanceid)
        res.redirect('/catalog/bookinstances')
    })
}

exports.bookinstance_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET')
}

exports.bookinstance_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST')
}
