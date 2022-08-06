export type RecordType = 'recordPull' | 'recordPut' | 'recordSender' | 'recordReciever';

export interface DateBetween {
    from: Date,
    to: Date
}

export interface RecordFilter {
    recordId: number,
    filterDate?: DateBetween
}