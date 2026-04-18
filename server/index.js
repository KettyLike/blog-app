const cors = require('cors');
const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const port = 4000;
const dbPath = path.join(__dirname, 'data', 'comments.json');

app.use(cors());
app.use(express.json());

async function readCommentsDb() {
  const rawFile = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(rawFile);
}

async function writeCommentsDb(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

app.get('/health', (_request, response) => {
  response.json({ ok: true });
});

app.get('/comments', async (_request, response) => {
  const data = await readCommentsDb();
  response.json(data);
});

app.get('/articles/:articleId/comments', async (request, response) => {
  const data = await readCommentsDb();
  response.json(data[request.params.articleId] ?? []);
});

app.post('/articles/:articleId/comments', async (request, response) => {
  const { articleId } = request.params;
  const { author, text } = request.body ?? {};

  if (!author?.trim() || !text?.trim()) {
    response.status(400).json({ message: 'Author and text are required.' });
    return;
  }

  const data = await readCommentsDb();
  const createdComment = {
    id: `c-${Date.now()}`,
    author: author.trim(),
    text: text.trim(),
  };

  data[articleId] = [...(data[articleId] ?? []), createdComment];
  await writeCommentsDb(data);

  response.status(201).json(createdComment);
});

app.listen(port, () => {
  console.log(`Blog backend is running on http://localhost:${port}`);
});
