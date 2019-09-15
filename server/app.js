const express = require('express');
const { argv } = require('yargs');
const { exec } = require('child_process');

const app = express();
const port = argv.port || 8000;
const { pathRepo } = argv;

const dash = ':::';

if (!pathRepo) {
  console.log('Укажите путь к репозиториям');
  process.exit(-1);
}

app.use(express.json());

app.get('/api/repos', (req, res) => {
  exec(`cd ${pathRepo} && ls -d */`, (err, out) => {
    if (err) {
      res.status(404).send({
        result: err,
      });
    } else {
      res.status(200).send({
        result: out.split('\n').filter((item) => item.length),
      });
    }
  });
});

app.get('/api/repos/:repositoryId/commits/:commitHash', (req, res) => {
  const { repositoryId, commitHash } = req.params;
  const gitLogCommand = `git log --pretty=format:"%H${dash}%cd${dash}%s" ${commitHash}`;

  exec(`cd ${pathRepo}/${repositoryId} && ${gitLogCommand}`, (err, out = []) => {
    if (err) {
      res.status(404).send({
        result: err,
      });
    } else {
      res.status(200).send({
        result: out.split('\n').map((item) => {
          const [hash, time, message] = item.split(dash);

          return { hash, time, message };
        }),
      });
    }
  });
});

app.get('/api/repos/:repositoryId/commits/:commitHash/diff', (req, res) => {
  const { repositoryId, commitHash } = req.params;
  const gitDiffCommand = `cd ${pathRepo}/${repositoryId} && git diff ${commitHash}`;

  exec(gitDiffCommand, (err, out) => {
    if (err || !commitHash) {
      res.status(404).send({
        result: err,
      });
    } else {
      res.status(200).format({
        'text/html': function () {
          res.send(`<p style="white-space: pre">${out}<p>`);
        },
      });
    }
  });
});

app.get('/api/repos/(:repositoryId|:repositoryId/tree/:commitHash/:path(*))', (req, res) => {
  const { repositoryId, commitHash, path } = req.params;
  let gitCommand = 'git ls-tree -r --name-only';

  if (commitHash && path) {
    gitCommand = `${gitCommand} ${commitHash} ${path}/`;
  } else {
    gitCommand = `${gitCommand} HEAD`;
  }
  exec(`cd ${pathRepo}/${repositoryId} && ${gitCommand}`, (err, out) => {
    if (err) {
      res.status(404).send({
        result: err,
      });
    } else {
      res.status(200).format({
        'text/html': function () {
          res.send(`<p style="white-space: pre">${out}<p>`);
        },
      });
    }
  });
});

app.get('/api/repos/:repositoryId/blob/:commitHash/:pathToFile(*)', (req, res) => {
  const { repositoryId, commitHash, pathToFile } = req.params;
  const gitCommand = `git show ${commitHash}:${pathToFile}`;

  exec(`cd ${pathRepo}/${repositoryId} && ${gitCommand}`, (err, out) => {
    if (err || !pathToFile || !commitHash || !out.length) {
      res.status(404).send({
        result: err,
      });
    } else {
      res.status(200).send(out);
    }
  });
});

app.delete('/api/repos/:repositoryId', (req, res) => {
  const { repositoryId } = req.params;

  exec(`cd ${pathRepo} && rm -r -f ${repositoryId}`, (err) => {
    if (err) {
      res.status(404).send({
        result: err,
      });
    } else {
      res.status(200).end();
    }
  });
});

app.post('/api/repos', (req, res) => {
  const { url } = req.body;

  exec(`cd ${pathRepo} && git clone ${url}`, ((err) => {
    if (err) {
      res.status(404).send({
        result: err,
      });
    } else {
      res.status(200).end();
    }
  }));
});

app.listen(port, () => {
  console.log(`Сервер запущен на ${port} порту`);
  console.log(`Путь до папки с репозиториями: ${pathRepo}`);
});
