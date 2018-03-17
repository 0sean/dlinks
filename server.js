// DLinks by Anidox

var express = require('express'), app = express(), config = require('./config.json'), log = require('./logger.js'), Enmap = require('enmap'), EnmapLevel = require('enmap-level'), db = new Enmap({ provider: new EnmapLevel({ name: 'db' }) }), bodyParser = require('body-parser'), request = require('request-promise-native');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
  res.render('pages/index', {
    desc: config.description,
    title: config.title,
    author: config.author
  });
});

app.post('/api/getlink', function(req, res) {
  if(typeof db.get(req.body.id) == 'string') {
    res.render('pages/error', {
      msg: `Server already added (shortlink is ${db.get(req.body.id)})`,
      title: config.title,
      author: config.author
    });
    return;
  } else if(typeof db.filter(e => e.shortlink == req.params.q).map(e => e)[0] == 'object') {
    res.render('pages/error', {
      msg: 'Shortlink already in use.',
      title: config.title,
      author: config.author
    });
    return;
  } else if(req.body.id.length !== 18) {
    res.render('pages/error', {
      msg: 'ID invalid (must be 18 chars).',
      title: config.title,
      author: config.author
    });
    return;
  }
  db.set(req.body.id, {id: req.body.id, shortlink: req.body.shortlink});
  res.render('pages/success', {
    msg: 'Server added!<br>Now go to Server Settings > Widget. Enable it and set an instant invite channel.',
    title: config.title,
    author: config.author
  });
});

app.get('/s/:q', async function(req, res) {
  if(parseInt(req.params.q).toString() == 'NaN' && typeof db.filter(e => e.shortlink == req.params.q).map(e => e)[0] == 'object') {
    var guild = db.filter(e => e.shortlink == req.params.q).map(e => e)[0], widget = await request(`https://discordapp.com/api/guilds/${guild.id}/widget.json`), widget = JSON.parse(widget);
    res.render('pages/s', {
      name: widget.name,
      channels: widget.channels.length,
      members: widget.members.length,
      invite: `"${widget.instant_invite}"`,
      title: config.title,
      author: config.author
    });
  } else if(typeof db.filter(e => e.id == req.params.q).map(e => e)[0] == 'object') {
    var guild = db.filter(e => e.id == req.params.q).map(e => e)[0], widget = await request(`https://discordapp.com/api/guilds/${guild.id}/widget.json`), widget = JSON.parse(widget);
    res.render('pages/s', {
      name: widget.name,
      channels: widget.channels.length,
      members: widget.members.length,
      shortlink: guild.shortlink,
      invite: `"${widget.instant_invite}"`,
      title: config.title,
      author: config.author
    });
  } else {
    res.render('pages/error', {
      msg: `Server not found.`,
      title: config.title,
      author: config.author
    });
  }
});

app.get('/list', async function(req, res) {
  let widgets = [], processed = 0;
  db.forEach(async (e) => {
    let widget = await request(`https://discordapp.com/api/guilds/${e.id}/widget.json`);
    widgets.unshift(widget);
    // A little workaround to make sure the forEach is finished before rendering page.
    processed++;
    if(processed === db.map(e => e).length) {
      res.render('pages/list', {
        db: db,
        title: config.title,
        author: config.author,
        desc: config.description,
        widgets: widgets
      });
    }
  });
});

app.get('/:q', async function(req, res) {
  if(!db.filter(e => e.shortlink == req.params.q).map(e => e)[0]) {
    res.render('pages/error', {
      msg: `Server not found.`,
      title: config.title,
      author: config.author
    });
  } else {
    var guild = db.filter(e => e.shortlink == req.params.q).map(e => e)[0], widget = await request(`https://discordapp.com/api/guilds/${guild.id}/widget.json`), widget = JSON.parse(widget);
    if(widget.instant_invite == null) {
      res.render('pages/error', {
        msg: `Invite not found. Please set up your server correctly (set an instant invite channel in Server Settings > Widget).`,
        title: config.title,
        author: config.author
      });
    }
    res.redirect(widget.instant_invite);
  }
});

app.listen(config.port, async function() {
  log(`Up and running on port ${config.port}!`, 'Express');
  await db.defer;
  log('Loaded!', 'Enmap');
});
