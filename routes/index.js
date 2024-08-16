var express = require('express');
const { spawn } = require('child_process');
var router = express.Router();

// router.use(bodyParser.text({type:"*/*"}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
  const python = spawn('./env/bin/python', ['simulator.py', req.body.file]);
  
  new Promise((resolve, reject) => {
    let stdoutData = '';
    let stderrData = '';

    python.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    python.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    python.on('close', (code) => {
      if (code === 0) {
          resolve(stdoutData);  // Resolve with accumulated stdout data
      } else {
          reject(stderrData);  // Reject with accumulated stderr data
      }
    });
  })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
