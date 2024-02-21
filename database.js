// const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const path = require('path')

let userids = []

if (!fs.existsSync(path.resolve(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, '/uploads'))
}

function showAllUsers() {
    let pathval = path.resolve(__dirname, 'uploads')
    fs.readdirSync(pathval).filter(function (file) {
        console.log(fs.statSync(pathval + '/' + file).isDirectory() ? userids.push(file) : "---");
    });
}

showAllUsers();

function isUserExist(userid) {
    return userids.includes(userid);
}

module.exports = { isUserExist, userids }
