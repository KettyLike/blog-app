const cors = require('cors');
const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const port = 4000;
const commentsDbPath = path.join(__dirname, 'data', 'comments.json');
const articlesDbPath = path.join(__dirname, 'data', 'articles.json');
const usersDbPath = path.join(__dirname, 'data', 'users.json');

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

async function writeArticlesDb(data) {
  await fs.writeFile(articlesDbPath, JSON.stringify(data, null, 2));
}

async function readUsersDb() {
  const rawFile = await fs.readFile(usersDbPath, 'utf8');
  return JSON.parse(rawFile);
}

async function readArticlesWithComments() {
  const [articles, comments] = await Promise.all([readArticlesDb(), readCommentsDb()]);

  return articles.map((article) => ({
    ...article,
    comments: comments[article.id] ?? [],
  }));
}

function buildArticleContent(body) {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => ({
      id: `content-${Date.now()}-${index}`,
      type: 'paragraph',
      text: paragraph,
    }));
}

function calculateReadTime(body) {
  const wordsCount = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordsCount / 180));
  return `${minutes} min read`;
}

app.get('/health', (_request, response) => {
  response.json({ ok: true });
});

app.post('/auth/login', async (request, response) => {
  const { email, password } = request.body ?? {};
  const users = await readUsersDb();
  const user = users.find(
    (item) => item.email.toLowerCase() === email?.trim().toLowerCase() && item.password === password
  );

  if (!user) {
    response.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  response.json({
    id: user.id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    role: user.role,
  });
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

app.post('/articles', async (request, response) => {
  const { title, category, body, coverImage, userId } = request.body ?? {};

  if (!title?.trim() || !category?.trim() || !body?.trim() || !userId?.trim()) {
    response.status(400).json({ message: 'Title, category, body, and userId are required.' });
    return;
  }

  const users = await readUsersDb();
  const user = users.find((item) => item.id === userId);

  if (!user) {
    response.status(404).json({ message: 'Author not found.' });
    return;
  }

  const articles = await readArticlesDb();
  const articleId = `article-${Date.now()}`;
  const normalizedBody = body.trim();
  const article = {
    id: articleId,
    category: category.trim(),
    title: title.trim(),
    preview: normalizedBody.slice(0, 140).trimEnd() + (normalizedBody.length > 140 ? '...' : ''),
    author: user.name,
    readTime: calculateReadTime(normalizedBody),
    coverImage:
      coverImage?.trim() ||
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    content: buildArticleContent(normalizedBody),
  };

  articles.unshift(article);
  await writeArticlesDb(articles);

  response.status(201).json({
    ...article,
    comments: [],
  });
});

app.listen(port, () => {
  console.log(`Blog backend is running on http://localhost:${port}`);
});
