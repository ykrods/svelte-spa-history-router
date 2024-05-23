/** @type {(ms: Number) => Promise<void>} */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const articles = [
  {
    id: '2024/03/01/baz',
    title: 'baz',
    date: "2024-03-01",
    html: `<p>baz!</p>`,
    url: '/blog/posts/2024/03/01/baz',
    prev: '/blog/posts/2024/02/01/bar',
  },
  {
    id: '2024/02/01/bar',
    title: 'bar',
    date: "2024-02-01",
    html: `<p>bar!</p>`,
    previous: '',
    url: '/blog/posts/2024/02/01/bar',
    next: '/blog/posts/2024/03/01/baz',
    prev: '/blog/posts/2024/01/01/foo',
  },
  {
    id: '2024/01/01/foo',
    title: 'foo',
    date: "2024-01-01",
    html: `<p>foo!</p>`,
    url: '/blog/posts/2024/01/01/foo',
    next: '/blog/posts/2024/02/01/bar',
  },
];

export async function getArticles() {
  await sleep(100);
  return articles;
}

/**
 *  @param {string} id
 */
export async function getArticle(id) {
  return articles.find(a => a.id === id);
}
