///<reference path="../_all.d.ts"/>

class FieldRule<TRuleType> {
    constructor(public value: TRuleType, public message: string){}
}

interface IField<TFieldType> {
    name: string;
    defaultValue: TFieldType;
    fieldIsRequired: FieldRule<boolean>;
    allowNull: FieldRule<boolean>;
    customValidator: (value: any) => string[];
}

interface IAnyField extends IField<any> {
}

interface IIntField extends IField<number> {
    max: FieldRule<number>;
    min: FieldRule<number>;
    floorMax: boolean;
    ceilMin: boolean;
}

interface IStringField extends IField<string> {
    maxLength: FieldRule<number>;
    minLength: FieldRule<number>;
    trimToMax: boolean;
    padToMin: boolean;
    continuationChar: string;
    padChar: string;
    padAtEnd: boolean;
}

interface IFluent<TDerived> {
    isRequired: (message?: string) => TDerived
    allowsNull: (message?: string) => TDerived;
    defaultsTo: (value: any) => TDerived;
}

interface IAnyFluent extends IFluent<IAnyFluent> {
    getField: () => IAnyField;
}

interface IIntFluent extends IFluent<IIntFluent> {
    maxValue: (value: number, floorOnConvert?: boolean, message?: string) => IIntFluent;
    minValue: (value: number, ceilingOnConvert?: boolean, message?: string) => IIntFluent;
    getField: () => IIntField;
}

interface IStringFluent extends IFluent<IStringFluent> {
    maxLength: (value: number, trimOnConvert?: boolean, continuationChar?: string, message?: string) => IStringFluent;
    minLength: (value: number, padOnConvert?: boolean, padChar?: string, padDirection?: 'start'|'end', message?: string) => IStringFluent;
    getField: () => IStringField;
}

class BaseImpl<TFieldType> implements IField<TFieldType> {

    name: string;
    defaultValue: TFieldType;
    fieldIsRequired: FieldRule<boolean>;
    allowNull: FieldRule<boolean>;

    constructor(name: string){
        this.name = name;
        this.defaultValue = null;
        this.fieldIsRequired = new FieldRule<boolean>(false, '?: is a required field');
        this.allowNull = new FieldRule<boolean>(false, '?: cannot be null');
    }

    customValidator(value: any): string[] {
        return [];
    }
}

class AnyImpl implements IAnyField, IAnyFluent {
    name: string;
    defaultValue: any;
    fieldIsRequired: FieldRule<boolean>;
    allowNull: FieldRule<boolean>;

    constructor(name: string){
        this.name = name;
        this.defaultValue = null;
        this.fieldIsRequired = new FieldRule<boolean>(false, '?: is a required field');
        this.allowNull = new FieldRule<boolean>(false, '?: cannot be null');
    }

    customValidator(value: any): string[] {
        return [];
    }

    getField(): IAnyField {
        return this;
    }

    isRequired(message?: string): IAnyFluent {
        this.fieldIsRequired.value = true;
        if (!_.isNil(message)) {
            this.fieldIsRequired.message = message;
        }
        return this;
    }

    allowsNull(message?: string): IAnyFluent {
        this.allowNull.value = true;
        if (!_.isNil(message)) {
            this.allowNull.message = message;
        }
        return this;
    }

    defaultsTo(value: any): IAnyFluent {
        this.defaultValue = value;
        return this;
    }
}

class field {
    public static any(name: string): IAnyFluent {
        return new AnyImpl(name);
    }
}