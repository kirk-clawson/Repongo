export interface IField {
    name: string;
    defaultValue: any;
    messages: string[];
    isValid(value: any): boolean;
}

export interface IFluent {
    getField(name: string): IField;
    isRequired(message?: string): this
}

export class FieldRule<TRuleType> {
    constructor(public value: TRuleType, public message: string) {
    }

    setNonNullMessage(message?: string): void {
        if (message != null) {
            this.message = message;
        }
    }
}
