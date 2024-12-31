
export interface Article {
  id: string;
  title: string;
  date: string;
  html: string;
  next?: string;
  prev?: string;
}
