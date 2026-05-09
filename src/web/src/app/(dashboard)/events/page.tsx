"use client"

import { apiFetch } from "@/lib/api";
import EventsTable from "./EventsTable";
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";

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

export default function EventsPage() {
  const [myEvents, setMyEvents] = useState<EventItem[]>([]);
  const cookies = useCookies();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const token = cookies.get("auth-token")

        if (!token) {
          setMyEvents([]);
          return;
        }

        const events = await getMyEvents(token);

        setMyEvents(events);
      } catch (error) {
        console.error(error);
        setMyEvents([]);
      }
    };

    loadEvents();
  }, []);

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
