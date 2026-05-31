import { TEvent } from "../home/types";

export type TEventContainerProps = {}
export type TEventViewProps = {
    events: TEvent[];
    isLoading: boolean;
    hasMore: boolean;
    onToggleLike: (eventId: string) => void;
}