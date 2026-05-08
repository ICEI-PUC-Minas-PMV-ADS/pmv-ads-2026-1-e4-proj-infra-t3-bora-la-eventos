import { getToken } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import EventsTable from "./EventsTable";

export type EventItem = {
  id: string;
  title: string;
  date: string;
  bannerBase64?: string;
  participantsCount: number;
  organizerId: string;
  status: string;
};

async function getMyEvents(token: string): Promise<EventItem[]> {
  return apiFetch<EventItem[]>("/events/mine", "GET", undefined, token);
}

export default async function EventsPage() {
  const token = await getToken("auth-token");
  let myEvents: EventItem[] = [
    {
      date: (() => {
        const date = new Date();
        date.setDate(date.getDate() + 5);
        return date.toDateString();
      })(),
      id: "1",
      organizerId: "1",
      participantsCount: 6,
      status: "21343",
      title: "teste",
    },
  ];

  if (token) {
    try {
      myEvents = await getMyEvents(token);
    } catch {
      myEvents = [];
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie e monitore os eventos futuros e passados do seu estabelecimento.
        </p>
      </div>
      <EventsTable events={myEvents} />
    </div>
  );
}
