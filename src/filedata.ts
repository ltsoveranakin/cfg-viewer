import { SettingType, SettingValueTypes, StorageType } from "./types";


export class Header {
    constructor(public storageType: StorageType, public version: number) {

    }
}

export class ConfigData {
    categories: CategoryData[] = [];
    constructor(public header: Header, public categoryAmount: number, public configName: string) {

    }
}

export class CategoryData {
    modules: ModuleData[] = [];
    constructor(public category: number, public x: number, public y: number, public expanded: boolean, public moduleCount: number) {
        
    }
}

export class SettingData {
    constructor(public name: string, public settingType: SettingType, public value: SettingValueTypes) {

    }
}

export class ModuleData {
    settings: SettingData[] = [];
    constructor(public name: string, public settingCount: number) {

    }
}