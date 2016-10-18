import {IStringFluent, StringImpl} from './stringField';
import { IntImpl} from './intField';
import { AnyImpl} from './anyField';
import {IField, IFluent} from './base';
import {INumberFluent, NumberImpl} from './numberField';

export class FieldFactory {
    public static any(defaultValue: any): IFluent {
        return new AnyImpl(defaultValue);
    }

    public static int(defaultValue?: number, typeValidationMessage?: string): INumberFluent {
        return new IntImpl(defaultValue, typeValidationMessage);
    }

    public static number(defaultValue?: number, typeValidationMessage?: string): INumberFluent {
        return new NumberImpl(defaultValue, typeValidationMessage);
    }

    public static string(defaultValue?: string, typeValidationMessage?: string): IStringFluent {
        return new StringImpl(defaultValue, typeValidationMessage);
    }
}
