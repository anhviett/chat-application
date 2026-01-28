export interface GeminiMessage {
  id: number;
  role: 'user' | 'model';
  content: string;
}