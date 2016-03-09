import {IStringFluent, StringImpl} from './stringField';
import {IIntFluent, IntImpl} from './intField';
import {IAnyFluent, AnyImpl} from './anyField';
import {IField, IFluent} from './base';
import {IFloatFluent, FloatImpl} from './floatField';

class Factory {
    public static any(defaultValue: any): IAnyFluent {
        return new AnyImpl(defaultValue);
    }

    public static int(defaultValue?: number, typeValidationMessage?: string): IIntFluent {
        return new IntImpl(defaultValue, typeValidationMessage);
    }

    public static float(defaultValue?: number, typeValidationMessage?: string): IFloatFluent {
        return new FloatImpl(defaultValue, typeValidationMessage);
    }

    public static string(defaultValue?: string, typeValidationMessage?: string): IStringFluent {
        return new StringImpl(defaultValue, typeValidationMessage);
    }
}

export {Factory as FieldFactory, IField, IFluent};
