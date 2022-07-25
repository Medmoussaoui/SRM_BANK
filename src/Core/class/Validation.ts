
type ValueTypes = 'string' | 'number' | 'object' | 'array'  | 'map' | ConstrainRoles | ConstrainRoles[];

type PropertieValue = Omit<ConstrainRoles,'key' | 'isRequired'>

type ValueConstrain = ConstrainRoles[] | PropertieValue;

type SheamaValidate = ConstrainRoles[];

type CustomConstraine<T> = (value: T) => boolean;


interface ConstrainRoles {
    key?: string,
    value?: ValueConstrain,
    max?: number,
    min?: number,
    type: ValueTypes,
    expretionPatern?: string[] | string,
    isRequired?: boolean,
}


interface ExitProcess{
    path?: string,
    costraineError?: string,
    message?: string
}


interface ValidationEngine {
    validate: (constraine: ValueConstrain, recieved) => boolean
}


class ValidationErrors {
  
    sizeNumberError(expectedSize: number, recievedSize: number, size: string) {
        FormSheama.exitProcess.costraineError = `${size} Value Number Error`
        if(size == 'min') return  FormSheama.exitProcess.message =  `Minimum Value allowed to Pass ${expectedSize} , But recieved ${recievedSize}`;
        FormSheama.exitProcess.message = `Maximim Value allowed to Pass ${expectedSize} , But recieved ${recievedSize}`;
    }
    
    sizeListError(expectedSize: number, recievedSize: number, size: string){
       FormSheama.exitProcess.costraineError = `${size} length List Error`
       if(size == 'min') return  FormSheama.exitProcess.message =  `Minimum items allowed to Pass ${expectedSize} , But recieved ${recievedSize} Item`;
       FormSheama.exitProcess.message = `Maximim items allowed to Pass ${expectedSize} , But recieved ${recievedSize} Item`;
    }

    sizeStringError(expectedSize: number, recievedSize: number, size: string){
        FormSheama.exitProcess.costraineError = `${size} String Length Error`
        if(size == 'min') return FormSheama.exitProcess.message =  `Minimum String Length allowed to Pass ${expectedSize} , But recieved Length ${recievedSize} `;
        FormSheama.exitProcess.message =  `Maximim String Length allowed to Pass ${expectedSize} , But recieved Length ${recievedSize}`;
    }

    keyNotEqual(){
        FormSheama.exitProcess.costraineError = 'Required';
        FormSheama.exitProcess.message = `"${FormSheama.exitProcess.path}" Is Required`;
    }

    typeError(expectedType, recievedType){
        FormSheama.exitProcess.costraineError = 'Type Error';
        FormSheama.exitProcess.message =  `Expected Type "${expectedType}" Is not asignble of Type "${recievedType}"`;
    } 

    unauthorizedItems(){
        FormSheama.exitProcess = {};
        FormSheama.exitProcess.costraineError = "unauthorized Items";
        FormSheama.exitProcess.message = "The object constains unauthorized items";
    }

}


class CheckTypes {

    isArray     = (type: ValueTypes) => type == "array";

    isObject    = (type: ValueTypes) =>  type == "object";

    isString    = (type: ValueTypes) =>  type == "string"; 
    
    isNumber    = (type) => type == "number";
    
    isUndefined = (type) => type == "undefined";

    isNull      = (value : any) => value == null;

    getType(value: any): ValueTypes {
        if(Array.isArray(value)) return "array";
        return (typeof value as ValueTypes);
    }
}




abstract class BasicValidation extends CheckTypes {

    errors: ValidationErrors = new ValidationErrors();
    
    min(expected:number, recieved) : boolean {
        return undefined;
    }   
    
    max(expected:number, recieved) : boolean {
        return undefined;
    }
    
    checkPaternExpretion(sheamaEx: string[] | string , value) : boolean{
       return sheamaEx == value;
    }


    checkType(type: ValueTypes, recieved) : boolean | ValueTypes {
        const recievedType = this.getType(recieved);
        if(recievedType == type) return type;

        this.errors.typeError(type, recievedType);
        return false;
    }


    getValidatorEngine(type: ValueTypes) : ValidationEngine {
        
        if(this.isObject(type))      return new ObjectValidator();

        else if(this.isString(type)) return new StringValidator();

        else if(this.isNumber(type)) return new NumberValidator();

        else if(this.isArray(type))  return new ArrayValidator();

    }

    validateSize(constraine: ConstrainRoles, recieved): boolean {
        const {min, max} = constraine;
        const validMin = min ? this.min(min, recieved) : true;
        const validMax = max ? this.max(max, recieved) : true;
        return validMax && validMin;
    }

    
}


class StringValidator extends BasicValidation implements ValidationEngine {
    
    errors: ValidationErrors = new ValidationErrors();

    
    min(expected: number, recieved: any):boolean {
        if(recieved.length >= expected) return true;
        this.errors.sizeStringError(expected, recieved.length, 'min');
        return false;
    };

    
    max(expected: number, recieved: any): boolean {
        if(recieved.length <= expected) return true;
        this.errors.sizeStringError(expected, recieved.length, 'max');
        return false;
    }


    validate(constraines, recieved: any) : boolean {
        const type = this.checkType('string', recieved);
        if(type == false) return false;

        const validSize = this.validateSize(constraines, recieved);
        if(validSize == false) return false;
        return true;
    };

}



class ArrayValidator extends BasicValidation implements ValidationEngine {

    errors: ValidationErrors = new ValidationErrors();
    
    min(expected: number, recieved: any): boolean {
        if(recieved.length >= expected) return true;
        this.errors.sizeListError(expected, recieved.length, 'min');
        return false;
    }

    max(expected: number, recieved: any): boolean {
        if(recieved.length <= expected) return true;
        this.errors.sizeListError(expected, recieved.length, 'max');
        return false; 
    }


    validate(constraine: ValueConstrain, recieved) : boolean {
       
        constraine = (constraine as ConstrainRoles);
        
        // Check if The recieved Propeties Is Equal Array expected
        const isArrayType = this.checkType('array', recieved);
        
        // If This contition done Break with Rong Validate because 
        // the Propertie Should be an Array type
        if(isArrayType == false) return false;
        
        const validSize = this.validateSize(constraine, recieved);
        
        // Step validate size Constrain of Array
        if(validSize == false) return false;

        // -- > Logic for validate Item in List

        let type = this.getType((constraine.value));
        let process: ValidationEngine;

        // if is array that means the type of item in list is object se [ConstraineRoles]
        if(type == "array"){
           process = new ObjectValidator();
        } 
        // other ways that means the type of item in list is : list | string | number
        else {
            type = (constraine.value as PropertieValue).type;
            // [process] is the validator engine implementaion of propertie type
            // to validate the item in list
            process = this.getValidatorEngine(type)
        } 

        for(let item of recieved){
            // Check if any single item in list is valid, based on the constraints set 
            // with Validate Engine Implementation 
            const result = process.validate(constraine.value, item);
            // If Result return [false] That means one of Item In list is not 
            // compatble to constraint roles so reject the validation process
            if(result == false) return false;
        }
        // From here with return true result that means the process of
        // validate the Single Items In list is all done and valid
        return true;
    };

}


class NumberValidator extends BasicValidation implements ValidationEngine {

    errors: ValidationErrors = new ValidationErrors();

    min(expected: number, recieved: number): boolean{
        if(recieved >= expected) return true;
        this.errors.sizeNumberError(expected, recieved,'min');
        return false;
    }


    max(expected: number, recieved:number) : boolean {
        if(recieved <= expected) return true;
        this.errors.sizeNumberError(expected, recieved,'max');
        return false;
    }


    validate(constraines: ValueConstrain, recieved: number) : boolean {
        constraines = (constraines as ConstrainRoles);
        
        const type = this.checkType('number', recieved);
        if(type == false) return false;

        const validSize = this.validateSize(constraines, recieved);
        if(validSize == false) return false;
        // more Logic here...
        return true;
    };

}



class ObjectValidator extends BasicValidation implements ValidationEngine {

    getkeys = (object:{}): string[] => Object.keys(object); 

    errors: ValidationErrors = new ValidationErrors();

    checkKey(constraine: ConstrainRoles, formKey: string): boolean | "skip" {
        const {isRequired, key} = constraine;
       
        isRequired ?? true;
        const isEqual = (formKey == key); 

        return (isRequired == false && isEqual == false) ? "skip" : isEqual;
    }
    

    validate(sheamaConstraine: ValueConstrain, data) {
        sheamaConstraine = (sheamaConstraine as SheamaValidate);

        const stepType = this.checkType('object', data);
        if(stepType == false) return false;

        const keys = this.getkeys(data);

        if(keys.length > sheamaConstraine.length){
            this.errors.unauthorizedItems();
            return false;
        } 

        let countValid = 0; /*
           countValid is incement everytime after 
           skep step validate key with success validate
        */

        for(let sheama in sheamaConstraine){

            let key = keys[countValid];

            /* Track Validation */ 
            FormSheama.exitProcess.path = sheamaConstraine[sheama].key;
            /**/
            const keyState = this.checkKey(sheamaConstraine[sheama], key);

            if(keyState == false) {
                this.errors.keyNotEqual();
                return false;
            }

            if(keyState == "skip") continue;
                        
            countValid++; // step validate key is valid that means keyState return  true
            console.log(key);

            const process = this.getValidatorEngine(sheamaConstraine[sheama].type)
            .validate(sheamaConstraine[sheama], data[key]);

            if(process == false) return false;
            
        }

        if(countValid != keys.length){
            this.errors.unauthorizedItems();
            return false; 
        }

        return true;
    }

}


export class FormSheama {    

    static exitProcess: ExitProcess = {};

    formSheama: SheamaValidate = [];
    
    constructor(sheama: SheamaValidate){
        this.formSheama = sheama;
    }

    validate(paylodData: {}): boolean | ExitProcess {
        const process = new ObjectValidator();
        const result  = process.validate(this.formSheama, paylodData);
        return (result == false) ? FormSheama.exitProcess : result;
    }

}

