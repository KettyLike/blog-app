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
app.use(express.json({ limit: '15mb' }));

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

async function writeUsersDb(data) {
  await fs.writeFile(usersDbPath, JSON.stringify(data, null, 2));
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

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function contentBlockToHtml(block) {
  if (block.type === 'heading') {
    return `<h2>${escapeHtml(block.text)}</h2>`;
  }

  if (block.type === 'image' && block.url) {
    return `<img src="${escapeHtml(block.url)}" alt="" />`;
  }

  return `<p>${escapeHtml(block.text)}</p>`;
}

function renderSharedArticlePage(article) {
  const description = article.preview ?? '';
  const coverImage = article.coverImage
    ? `<img class="cover" src="${escapeHtml(article.coverImage)}" alt="" />`
    : '';
  const category = article.category
    ? `<span class="category">${escapeHtml(article.category)}</span>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(article.title)} | BlogApp</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:title" content="${escapeHtml(article.title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  ${article.coverImage ? `<meta property="og:image" content="${escapeHtml(article.coverImage)}" />` : ''}
  <style>
    :root {
      color-scheme: light;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #172033;
      background: #f6f3ee;
    }
    body {
      margin: 0;
      padding: 32px 18px;
    }
    main {
      width: min(760px, 100%);
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e7dfd4;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 18px 50px rgba(40, 30, 20, 0.08);
    }
    article {
      padding: clamp(24px, 5vw, 48px);
    }
    .cover {
      width: 100%;
      max-height: 420px;
      object-fit: cover;
      display: block;
    }
    .category {
      display: inline-block;
      margin-bottom: 12px;
      color: #b15f38;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    h1 {
      margin: 0;
      font-size: clamp(32px, 7vw, 52px);
      line-height: 1.05;
    }
    .meta {
      margin: 16px 0 28px;
      color: #687386;
      font-size: 15px;
      font-weight: 600;
    }
    h2 {
      margin: 34px 0 12px;
      font-size: 24px;
    }
    p {
      margin: 0 0 18px;
      color: #334155;
      font-size: 18px;
      line-height: 1.68;
    }
    article img:not(.cover) {
      width: 100%;
      border-radius: 14px;
      margin: 14px 0 24px;
    }
  </style>
</head>
<body>
  <main>
    ${coverImage}
    <article>
      ${category}
      <h1>${escapeHtml(article.title)}</h1>
      <div class="meta">${escapeHtml(article.author)} &middot; ${escapeHtml(article.readTime)}</div>
      ${article.content.map(contentBlockToHtml).join('\n      ')}
    </article>
  </main>
</body>
</html>`;
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
    avatar: user.avatar ?? null,
  });
});

app.post('/auth/register', async (request, response) => {
  const { name, email, password, bio } = request.body ?? {};

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    response.status(400).json({ message: 'Name, email, and password are required.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = await readUsersDb();

  const emailExists = users.some((user) => user.email.toLowerCase() === normalizedEmail);
  if (emailExists) {
    response.status(409).json({ message: 'Email is already registered.' });
    return;
  }

  const createdUser = {
    id: `u-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password: password.trim(),
    bio: bio?.trim() || '',
    role: 'author',
  };

  users.push(createdUser);
  await writeUsersDb(users);

  response.status(201).json({
    id: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    bio: createdUser.bio,
    role: createdUser.role,
    avatar: createdUser.avatar ?? null,
  });
});

app.post('/users/:userId/avatar', async (request, response) => {
  const { userId } = request.params;
  const { avatar } = request.body ?? {};

  if (!avatar?.trim()) {
    response.status(400).json({ message: 'Avatar is required.' });
    return;
  }

  const users = await readUsersDb();
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    response.status(404).json({ message: 'User not found.' });
    return;
  }

  users[userIndex] = {
    ...users[userIndex],
    avatar: avatar.trim(),
  };
  await writeUsersDb(users);

  response.json({
    id: users[userIndex].id,
    name: users[userIndex].name,
    email: users[userIndex].email,
    bio: users[userIndex].bio,
    role: users[userIndex].role,
    avatar: users[userIndex].avatar ?? null,
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

app.get('/share/articles/:articleId', async (request, response) => {
  const articles = await readArticlesWithComments();
  const article = articles.find((item) => item.id === request.params.articleId);

  if (!article) {
    response.status(404).send('Article not found.');
    return;
  }

  response.type('html').send(renderSharedArticlePage(article));
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

  if (!title?.trim() || !body?.trim() || !userId?.trim()) {
    response.status(400).json({ message: 'Title, body, and userId are required.' });
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
    category: category?.trim() || null,
    title: title.trim(),
    preview: normalizedBody.slice(0, 140).trimEnd() + (normalizedBody.length > 140 ? '...' : ''),
    author: user.name,
    readTime: calculateReadTime(normalizedBody),
    coverImage: coverImage?.trim() || null,
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
