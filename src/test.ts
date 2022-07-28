import { query } from "express";
import { cpSync, ftruncate } from "fs";
import { connect } from "http2";
import { waitForDebugger } from "inspector";
import { send } from "process";
import { promises } from "stream";
import { setInterval, setTimeout } from "timers/promises";
import { records } from "./Routers/Records";
import { FormSheama } from "./Core/class/Validation";
import * as connection from './Core/Config/db.config';
import { isTypedArray } from "util/types";
import { create } from "domain";
import { RateLimiter } from "./middlewares/Rate_Limiter v2";
import { findSourceMap } from "module";


const loginSheama: FormSheama = new FormSheama([
    {
        key: "email",
        type: "string",
        min: 10,
        max: 20,
        isRequired: true,
    },
    {
        key: 'password',
        type: 'string',
        max: 20,
        min: 8
    },
    {
        key: 'skils',
        type: 'array',
        max: 5,
        min: 2,
        isRequired: true,
        value: [
            {
                key: 'skilName',
                type: 'string',
                max: 15,
                min: 7
            },
            {
                key: 'skilExp',
                type: 'string',
                max: 2,
                min: 1
            }
        ]
    }
]);

// ----> ALGORITHEM SESSION <---- //

function collectOddNumbers(list: number[]): number[] {
    let newList = [];

    if (list.length == 0) return newList;

    if (list[0] % 2 == 1) {
        newList.push(list[0]);
    }

    // remove the item processed from list
    list.splice(0, 1);

    return newList.concat(collectOddNumbers(list));
}


//console.log(collectOddNumbers([7,3,5,9,11,10]));


function findWhere(items: any[], value: any): any | -1 {
    for (let item of items) {
        if (item == value) return item;
    }
    return -1;
}


//console.log(findWhere(['adam','brahim','brahim'],'adam'));


function binarySearch(items: number[], value: number): number {
    let start = 0;
    let end = items.length;
    let midle = Math.floor(((start + end) / 2));

    while (items[midle] != value && start <= end) {
        if (items[midle] > value) {
            end = midle - 1;
        } else {
            start = midle + 1
        }
        midle = Math.floor(((start + end) / 2));
    }

    if (items[midle] == value) return value;
    return -1;
}


function naiveSearcb(text: string, pattern: string) {
    const textLength = text.length;
    const patternLength = pattern.length;

    for (let i = 0; i < textLength; i++) {
        let j = 0;
        for (j; j < patternLength; j++) {
            if (text[i + j] != pattern[j]) {
                break;
            }
        }
        if (j == patternLength) {
            console.log('Find Pattern At Index < ' + j + ' >');
            break;
        }
    }
}


//console.log(binarySearch([1,5,7,10,15,17,19,22,24,28],15));

//console.log(naiveSearcb('how are you mohamed','mohamed'));

interface User {
    id: number,
    date: string
}

function sortList(list: User[]) {
    const bigOne = 0;
    let sortList = [];
    for (let item of list) {
        const itemDate = Date.parse(item.date);
        if (itemDate > bigOne) {
            sortList.push(item);
        }
    }
}

//console.log(Date.parse('2/6/2022 10:15:12').valueOf());


/// Problem Solving ///

// ->

function getAverage(numOne: number, numTwo: number, numThre: number) {
    const average = (numOne + numTwo + numThre) / 3;
    console.log(average);
    if (average >= 50) {
        return console.log('Pass');
    }
    console.log('Fail');
}

function maxNumber(one: number, Two: number, thre: number) {
    if (one > Two) {
        if (one > thre) {
            return console.log(one);
        }
        console.log(thre);
    }
    else {
        if (Two > thre) {
            return console.log(Two);
        }
        console.log(thre);
    }

}

/**
 * one  = 8
 * two  = 4
 * thre = 9
 *
*/
function maxNumberV2(one: number, Two: number, thre: number) {
    if (one > Two && one > thre) {
        return console.log(one);
    }
    if (Two > thre) {
        return console.log(Two);
    }
    console.log(thre);
}



class Locale {
    constructor(lang: string) { }
}



let myServices;
let language;
function onInit() {

    const sharedPrefLang = myServices.sharedPreferences.getString("lang");
    if (sharedPrefLang == "ar") {
        language = new Locale("ar");
        return;
    } 
    if (sharedPrefLang == "en") {
        language = new Locale("en");
        return;
    } 
    language = new Locale('divaceLAng');
    //super.onInit();
}