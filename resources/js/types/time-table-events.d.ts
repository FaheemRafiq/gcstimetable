export interface Event {
    id: number | string;
    name: string;
    startTime: string;
    endTime: string;
    type?: string;
    [key: string]: unknown;
}

export interface Events {
    [day: string]: Event[];
}
