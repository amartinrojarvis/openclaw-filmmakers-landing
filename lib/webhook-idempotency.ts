import { promises as fs } from 'fs';
import path from 'path';

const IDEMPOTENCY_FILE = path.join(process.cwd(), 'data', 'processed-webhooks.json');

interface ProcessedWebhooks {
  eventIds: string[];
}

async function loadProcessed(): Promise<ProcessedWebhooks> {
  try {
    const content = await fs.readFile(IDEMPOTENCY_FILE, 'utf-8');
    return JSON.parse(content) as ProcessedWebhooks;
  } catch {
    return { eventIds: [] };
  }
}

async function saveProcessed(data: ProcessedWebhooks): Promise<void> {
  await fs.mkdir(path.dirname(IDEMPOTENCY_FILE), { recursive: true });
  // Mantener solo los ultimos 500 eventIds para no crecer indefinidamente
  const trimmed = data.eventIds.slice(-500);
  await fs.writeFile(IDEMPOTENCY_FILE, JSON.stringify({ eventIds: trimmed }, null, 2));
}

export async function isEventProcessed(eventId: string): Promise<boolean> {
  const data = await loadProcessed();
  return data.eventIds.includes(eventId);
}

export async function markEventAsProcessed(eventId: string): Promise<void> {
  const data = await loadProcessed();
  if (!data.eventIds.includes(eventId)) {
    data.eventIds.push(eventId);
    await saveProcessed(data);
  }
}
