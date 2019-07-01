export interface User {
    data: Data;
}

export interface Data {
    name:            string;
    account:         string;
    agency:          string;
    document:        string;
    holder:          number;
    phone:           string;
    uid:             string;
    paymentMaxValue: string;
    infoEmail:       string;
    setPassword:     boolean;
}