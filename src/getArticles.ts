import type { Article } from "./types"


const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));


const articles: Article[] = [
  {
    id: '2024/04/01/test-fragment',
    title: 'test fragment',
    date: "2024-04-01",
    html: `<a id="top" href="#bottom">to bottom</a>
<div style="height:800px">spacer</div>
<a id="bottom" href="#top">to top</a>`,
  },
  {
    id: '2024/03/01/baz',
    title: 'baz',
    date: "2024-03-01",
    html: `<p>baz!</p>`,
    prev: '2024/02/01/bar',
  },
  {
    id: '2024/02/01/bar',
    title: 'bar',
    date: "2024-02-01",
    html: `<p>bar!</p>`,
    next: '2024/03/01/baz',
    prev: '2024/01/01/foo',
  },
  {
    id: '2024/01/01/foo',
    title: 'foo',
    date: "2024-01-01",
    html: `<p>foo!</p>`,
    next: '2024/02/01/bar',
  },
];

export async function getArticles(): Promise<Article[]> {
  await sleep(100);
  return articles;
}
