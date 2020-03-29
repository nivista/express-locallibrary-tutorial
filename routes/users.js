let express = require('express')
let router = express.Router()

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource')
})

router.get('/cool', function (req, res) {
    res.send("You're so cool")
})
module.exports = router
