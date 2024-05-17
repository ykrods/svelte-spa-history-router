/**
 * data-source.js
 *
 * Dummy APIs for fetch data
 */

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
};

const articles = [
  {
    id: 'test-param',
    title: 'Test param',
    html: `<p>Sucess!</p>`,
    next: 'test/param/with/slash',
  },
  {
    id: 'test/param/with/slash',
    title: 'Test param with path',
    html: `<p>Success!</p>`,
    previous: 'test-param',
    next: 'test-fragment',
  },
  {
    id: 'test-fragment',
    title: 'Test fragment',
    html: `<a id="top" href="#bottom">to bottom</a>
<div style="height:800px">spacer</div>
<a id="bottom" href="#top">to top</a>`,
    previous: 'test/param/with/slash',
  },
];

export async function getArticles() {
  await sleep(100);
  return articles;
}

export async function getArticle(id) {
  return articles.find(a => a.id === id);
}
