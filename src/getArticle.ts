import type { Article } from "./types"

import { getArticles } from "./getArticles"


const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));


export async function getArticle(id: string): Promise<Article | undefined> {
  await sleep(50);
  const articles = await getArticles();
  return articles.find(a => a.id === id);
}
