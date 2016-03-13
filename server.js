const express = require('express');
const request = require('request');
const env = require('node-env-file');
env(__dirname + '/.env');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = process.env.PORT ? process.env.PORT : 3000;
const app = express();

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A';
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_PATH = process.env.GITHUB_REDIRECT_PATH;

function queryString(json) {
  return '?' +
  Object.keys(json).map(function encodeParam(key) {
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key]);
  }).join('&');
}

if (isDeveloping) {
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.config.js');

  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use(express.static(__dirname + '/dist'));
}

app.set('views', './app/views');
app.set('view engine', 'ejs');

app.get('/', function indexRequest(req, res) {
  res.render('index', {
    env: process.env.NODE_ENV,
    clientId: CLIENT_ID,
    redirectPath: REDIRECT_PATH
  });
});

app.get(REDIRECT_PATH, function issuesRequest(req, res) {
  var url = 'https://github.com/login/oauth/access_token';

  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: req.query.code
  };

  url += queryString(params);

  const options = {
    url: url,
    headers: {
      'User-Agent': USER_AGENT
    }
  };

  request(options, function requestRepoIssues(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body);
      var token = body.split('access_token=')[1].split('&')[0];
      res.redirect('/?token=' + token);
    } else {
      console.log(error);
      res.send('Error in request: ' + error);
    }
  });
});

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
