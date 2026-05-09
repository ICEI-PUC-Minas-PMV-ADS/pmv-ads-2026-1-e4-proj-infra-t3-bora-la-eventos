import { getMyEventsAction } from "@/actions/events.action";
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

export default async function EventsPage() {
  const myEvents = (await getMyEventsAction()) as EventItem[];

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
