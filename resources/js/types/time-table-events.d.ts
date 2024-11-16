export interface Event {
    id: number | string;
    name: string;
    startTime: Date;
    endTime: Date;
    type?: string;
    [key: string]: unknown;
}

export interface Events {
    [day: string]: Event[];
}
