export enum SettingType {
    BIND,
    BOOLEAN,
    BYTE,
    SHORT,
    INT,
    LONG,
    FLOAT,
    DOUBLE,
    COLOR,
    STRING,
    ENUM,
}

export interface Color {
    r: number,
    g: number,
    b: number,
    a: number,
}

export type SettingValueTypes = number | boolean | string | Long | Color;

export enum StorageType {
    STORAGE_DATA,
    CONFIG,
}

export enum Category {
    PLAYER,
    COMBAT,
    CLIENT,
    MISC,
    HUD,
}
