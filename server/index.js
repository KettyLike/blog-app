const cors = require('cors');
const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const port = 4000;
const commentsDbPath = path.join(__dirname, 'data', 'comments.json');
const articlesDbPath = path.join(__dirname, 'data', 'articles.json');

app.use(cors());
app.use(express.json());

async function readCommentsDb() {
  const rawFile = await fs.readFile(commentsDbPath, 'utf8');
  return JSON.parse(rawFile);
}

async function writeCommentsDb(data) {
  await fs.writeFile(commentsDbPath, JSON.stringify(data, null, 2));
}

async function readArticlesDb() {
  const rawFile = await fs.readFile(articlesDbPath, 'utf8');
  return JSON.parse(rawFile);
}

async function readArticlesWithComments() {
  const [articles, comments] = await Promise.all([readArticlesDb(), readCommentsDb()]);

  return articles.map((article) => ({
    ...article,
    comments: comments[article.id] ?? [],
  }));
}

app.get('/health', (_request, response) => {
  response.json({ ok: true });
});

app.get('/comments', async (_request, response) => {
  const data = await readCommentsDb();
  response.json(data);
});

app.get('/articles', async (_request, response) => {
  const data = await readArticlesWithComments();
  response.json(data);
});

app.get('/articles/:articleId', async (request, response) => {
  const articles = await readArticlesWithComments();
  const article = articles.find((item) => item.id === request.params.articleId);

  if (!article) {
    response.status(404).json({ message: 'Article not found.' });
    return;
  }

  response.json(article);
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
