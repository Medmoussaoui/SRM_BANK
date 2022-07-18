interface DateBetween {
    from: string,
    to:   string
}

export interface RecordsOptions {
    accountId:    string,
    recordsType:  string,
    filterByDate: DateBetween
}

export interface RecordsModuleInterface {
    /**
     * Get list of records by @recordType and filter that records if pass @filterByDate
     * propertie in to @param recordsOptions  
     */
    getRecordsByRecordType(recordsOptions: RecordsOptions) : any;
    /**
     * Any record its as a notification in the client side so if client see the new records 
     * so the action happen is send request to @function signRecordVisite() to change state
     * of this record to @name isVisit = 1 by @default isVisit = 0  
     */
    signRecordVisite(recordId: string, accountId:string) : any;
}