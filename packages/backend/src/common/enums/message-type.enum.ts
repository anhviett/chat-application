export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video',
}

export enum MessageStatus {
  SENT = 0,
  DELIVERED = 1,
  READ = 2,
}