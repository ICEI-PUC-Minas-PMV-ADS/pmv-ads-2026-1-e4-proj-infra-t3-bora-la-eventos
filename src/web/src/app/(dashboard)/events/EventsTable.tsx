"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Edit, Trash2, Eye, Megaphone, PauseCircle, PlayCircle } from "lucide-react";
import { deleteEventAction, pauseEventAction } from "@/actions/events.action";
import type { EventItem } from "./page";

type Filter = "todos" | "publicados" | "encerrados";

const TABS: { key: Filter; label: string }[] = [
  { key: "todos", label: "Todos os Eventos" },
  { key: "publicados", label: "Publicados" },
  { key: "encerrados", label: "Encerrados" },
];

function isPast(dateStr: string) {
  return new Date(dateStr) < new Date();
}

function getVisualStatus(event: EventItem): "Publicado" | "Pausado" | "Encerrado" {
  if (isPast(event.date)) return "Encerrado";
  if (event.status === "paused") return "Pausado";
  return "Publicado";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ event }: { event: EventItem }) {
  const status = getVisualStatus(event);
  if (status === "Publicado") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Publicado
      </span>
    );
  }
  if (status === "Pausado") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
        Pausado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
      Encerrado
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
        <Calendar size={32} className="text-orange-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Nenhum evento criado ainda
      </h3>
      <p className="text-sm text-gray-500 max-w-sm">
        Você ainda não tem eventos. Use o botão acima para criar o primeiro e
        começar a atrair participantes para o seu estabelecimento!
      </p>
    </div>
  );
}

export default function EventsTable({ events }: { events: EventItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() ?? "";
  const [filter, setFilter] = useState<Filter>("todos");
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = events.filter((e) => {
    const status = getVisualStatus(e);
    const matchesTab =
      filter === "todos" ||
      (filter === "publicados" && status === "Publicado") ||
      (filter === "encerrados" && status === "Encerrado");
    const matchesSearch = !searchQuery || e.title.toLowerCase().includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const totalInteresses = events.reduce((sum, e) => sum + e.participantsCount, 0);
  const publishedCount = events.filter((e) => getVisualStatus(e) === "Publicado").length;

  function handlePause(event: EventItem) {
    setLoadingId(event.id);
    startTransition(async () => {
      await pauseEventAction(event.id, event.status);
      router.refresh();
      setLoadingId(null);
    });
  }

  function handleEdit(event: EventItem) {
    setLoadingId(event.id);
    
    startTransition(async () => {
      router.push("/events/new?id=" + event.id);
      setLoadingId(null);
    });
  }

  function handleDelete(event: EventItem) {
    setLoadingId(event.id);
    startTransition(async () => {
      await deleteEventAction(event.id);
      router.refresh();
      setLoadingId(null);
    });
  }

  if (events.length === 0) return <EmptyState />;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-4 border-b border-gray-100">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                filter === key
                  ? "bg-[#ea580c] text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
              <th className="px-6 py-4">Nome do Evento</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Pessoas Interessadas</th>
              <th className="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length > 0 ? (
              filtered.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {event.bannerBase64 ? (
                        <img
                          src={event.bannerBase64}
                          alt={event.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                          <Calendar size={18} className="text-orange-400" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900">{event.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(event.date)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge event={event} />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {event.participantsCount.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-6 py-4">
                    {confirmDeleteId === event.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Excluir?</span>
                        <button
                          onClick={() => handleDelete(event)}
                          disabled={isPending}
                          className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          Sim
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs font-medium text-gray-500 hover:text-gray-700"
                        >
                          Não
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded"
                          title="Editar"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handlePause(event)}
                          disabled={isPast(event.date) || (isPending && loadingId === event.id)}
                          className="p-1.5 text-gray-400 hover:text-yellow-500 transition-colors rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          title={event.status === "paused" ? "Publicar" : "Pausar"}
                        >
                          {event.status === "paused" ? (
                            <PlayCircle size={15} />
                          ) : (
                            <PauseCircle size={15} />
                          )}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(event.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded"
                          title="Excluir"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                  Nenhum evento nesta categoria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-gray-100 text-sm text-gray-400">
          Exibindo {filtered.length} de {events.length} evento{events.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
            <Eye size={20} className="text-orange-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Interesses</p>
            <p className="text-2xl font-bold text-gray-900">{totalInteresses.toLocaleString("pt-BR")}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
            <Megaphone size={20} className="text-orange-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Eventos Publicados</p>
            <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
          </div>
        </div>

      </div>
    </>
  );
}
