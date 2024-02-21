const express = require('express')
const app = express()
const fs = require('fs')
const utils = require('./utils')
const { upload, path } = require('./filehandle')
const database = require('./database')


const delim = "\n<----------------->\n";


console.log();

// Using express.urlencoded middleware
app.use(express.urlencoded({
  extended: true
}))

app.use(express.static("./static"))

function checker(req, res, next) {
  console.log(req.body);
  next()
}

app.get('/api', (req, res) => {
  res.json(
    {
      name: "imon"
    }
  )
})

// ROUTE FOR HOMEPAGE
app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, './index.html'))
})

// ROUTE FOR IMAGE UPLOAD OF A CLIENT
app.post('/:userid/upload', upload.single('image'), (req, res) => {
  if (req.uploaderror)
    return res.sendFile(path.resolve(__dirname, './sorry.html'))
  res.sendFile(path.resolve(__dirname, './thankyou.html'))
})

// ROUTE FOR TEXT UPLOAD OF A CLIENT
app.post('/:userid/uploadtext', (req, res) => {
  if (!database.isUserExist(req.params.userid)) {
    res.json({
      status: 'failure',
      msg: 'Invalid Userid....'
    })
    return
  }

  fs.appendFile("uploads/" + req.params.userid + "/data.txt", req.body.text + delim, err => { });


  res.json({
    status: 'success',
    msg: 'Text Data Submitted Successfully....'
  })
})

// ROUTE FOR IMAGE DOWNLOAD
app.get('/:userid/download/:filename', (req, res) => {
  const file = `uploads/${req.params.userid}/${req.params.filename}`
  res.download(file)
})

// ROUTE FOR VIEWING ALL UPLOADED IMAGES OF A CLIENT
app.get('/:userid/view', (req, res) => {
  const files = fs.readdirSync(path.join(__dirname, 'uploads', req.params.userid))
  let html = ``;
  files.forEach(e => {
    if (e.match(/\.(jpg|jpeg|png|gif)$/))
      html += `<div class="col-md-6 p-1"><div class="single-image-wrapper"><img class="img-fluid" src="./${req.params.userid}/download/${e}">
              <a href="./${req.params.userid}/download/${e}" class="btn btn-success">DOWNLOAD</a>
            </div></div>`
  })
  res.send(html)
})

// ROUTE FOR VIEWING ALL UPLOADED IMAGES OF A CLIENT
app.get('/:userid/viewall', (req, res) => {
  const files = fs.readdirSync(path.join(__dirname, 'uploads', req.params.userid))
  let html = ``;

  files.forEach(e => {
    let extension = e.split('.').pop();
    if (extension == 'jpeg') extension = 'jpg'
    let f = e
    if (e.length > 30) {
      f = e.substring(0, 26) + "...";
    }
    if (e != 'data.txt')
      html += `<div class="col-md-6 p-1"><i class="bi bi-filetype-${extension}"></i><a class='file-dwnload' href='./${req.params.userid}/download/${e}'>${f}</a></div>`
  })
  res.send(html)
})


// ROUTE FOR VIEWING ALL TEXTS OF A CLIENT
app.get('/:userid/viewtext', (req, res) => {
  if (!database.isUserExist(req.params.userid)) {
    res.json({
      status: 'failure',
      msg: 'Invalid Userid....'
    })
    return
  }

  let textdata = fs.readFileSync("uploads/" + req.params.userid + "/data.txt", { encoding: 'utf8', flag: 'r' });
  res.json({
    status: 'success',
    msg: textdata.split(delim)
  })
})


// SENDS NEW CLIENTS UNIQUE USER-IDS
app.get('/getuserid', (req, res) => {
  let newuserid;
  do {
    newuserid = utils.generateUniqueId()
  } while (database.isUserExist(newuserid))


  database.userids.push(newuserid)

  console.log(database.userids);

  fs.mkdir(path.join(__dirname, '/uploads', '/' + newuserid), (err) => {
    if (err) {
      return console.error(err);
    }
    console.log('Directory created successfully!');
  });

  fs.writeFile("uploads/" + newuserid + "/data.txt", "", err => { });

  res.json({
    userid: newuserid
  })
})

app.get("*", (req, res) => {
  res.status(404).send("sorry page not found")
})

app.listen(8000, () => {
  console.log('Server running on port 80')
})

