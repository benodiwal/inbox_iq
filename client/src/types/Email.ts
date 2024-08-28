export type Email = {
  id: string;
  subject: string;
  content: string;
  response: string | null;
  sender: string;
  receivedAt: string;
  category: string;
  responseStatus: string;
}
