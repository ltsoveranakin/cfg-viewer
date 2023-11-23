import ByteBuffer from "bytebuffer";
import { Category, SettingType, SettingValueTypes, StorageType } from "./types";
import { CategoryData, ConfigData, Header, ModuleData, SettingData } from "./filedata";


function readHeader(buf: ByteBuffer) {
    return new Header(buf.readByte(), buf.readByte());
}


function readUTFStr(buf: ByteBuffer) {
    const byteLen = buf.readShort();
    return buf.readUTF8String(byteLen);
}

function readSetting(buf: ByteBuffer) {
    const name = readUTFStr(buf);
    const settingType: SettingType = buf.readByte();

    let value: SettingValueTypes;

    switch (settingType) {
        case SettingType.BIND:
            value = buf.readInt();
            break;
        case SettingType.BOOLEAN:
            value = buf.readByte() == 1;
            break;
        case SettingType.BYTE:
            value = buf.readByte();
            break;
        case SettingType.SHORT:
            value = buf.readShort();
            break;
        case SettingType.INT:
            value = buf.readInt();
            break;
        case SettingType.LONG:
            value = buf.readLong();
            break;
        case SettingType.FLOAT:
            value = buf.readFloat();
            break;
        case SettingType.DOUBLE:
            value = buf.readDouble();
            break;
        case SettingType.COLOR:
            value = {
                r: buf.readUint8(),
                g: buf.readUint8(),
                b: buf.readUint8(),
                a: buf.readUint8(),
            }
            break;
        case SettingType.STRING:
            value = readUTFStr(buf);
            break;
        case SettingType.ENUM:
            value = buf.readByte();
            break;
        default:
            throw new Error();
    }

    const settingData = new SettingData(name, settingType, value);

    return settingData;
}

function readModule(buf: ByteBuffer) {
    const name = readUTFStr(buf);
    const settingCount = buf.readByte();

    const moduleData = new ModuleData(name, settingCount);

    for(let i = 0; i < settingCount; i++) {
        moduleData.settings.push(readSetting(buf));
    }

    return moduleData;
}

function readCategory(buf: ByteBuffer) {
    const category: Category = buf.readByte();
    const x = buf.readShort();
    const y = buf.readShort();
    const expanded = buf.readByte() == 1;
    const moduleCount = buf.readByte();

    const categoryData = new CategoryData(category, x, y, expanded, moduleCount);

    for(let i = 0; i < moduleCount; i++) {
        categoryData.modules.push(readModule(buf));
    }

    return categoryData;
}

export function baseReader(buf: ByteBuffer) {    
    const header = readHeader(buf);
    
    if(header.storageType != StorageType.CONFIG) {
        throw new Error("Filetype not supported currently :(");
    }

    const configName = readUTFStr(buf);
    const categoryAmount = buf.readByte();

    const data = new ConfigData(header, categoryAmount, configName);

    for(let i = 0; i < categoryAmount; i++) {
        data.categories.push(readCategory(buf));
    }

    return data;
}