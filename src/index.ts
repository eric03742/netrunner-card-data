#!/usr/bin/env node

import "reflect-metadata";
import fs from "fs/promises";
import log from "loglevel";
import path from "path";
import { program } from "commander";
import { DataSource, EntityTarget } from "typeorm";

import {
    NetrunnerDataSource, BaseEntity,
    SideEntity, FactionEntity, TypeEntity, SubtypeEntity,
    SettypeEntity, CycleEntity, SetEntity,
    FormatEntity, PoolEntity, RestrictionEntity, SnapshotEntity,
    CardEntity, PrintingEntity, RulingEntity,
} from "@eric03742/netrunner-entities";

interface AppOptions {
    mirror: boolean;
}

const DOWNLOAD_FILE = "netrunner.sqlite";
const OUTPUT_DIR = "result";
const MAIN_LINK = "https://github.com/eric03742/netrunner-database/releases/latest/download/netrunner.sqlite";
const MIRROR_LINK = "https://gitee.com/eric03742/netrunner-database/releases/download/latest/netrunner.sqlite";

program
    .name("netrunner-card-data")
    .description("《矩阵潜袭》中文卡牌数据库导出工具")
    .version("0.3.0", "-v, --version", "显示程序版本")
    .option("--mirror", "使用国内镜像源")
    ;

async function initialize(): Promise<DataSource> {
    program.parse();
    log.setLevel(log.levels.INFO);
    const options = program.opts<AppOptions>();
    const link = options.mirror ? MIRROR_LINK : MAIN_LINK;
    log.info(`Using: ${link} as database source!`);

    const result = await fetch(link);
    if(!result.ok) {
        throw new Error(`Download SQLite database 'netrunner.sqlite' from ${link} failed!`);
    }

    const buffer = await result.bytes();
    await fs.writeFile(DOWNLOAD_FILE, buffer);

    const source = NetrunnerDataSource.create(DOWNLOAD_FILE);
    await source.initialize();
    log.info(`SQLite database '${DOWNLOAD_FILE}' connected!`);
    return source;
}

async function extract<T extends BaseEntity>(source: DataSource, type: EntityTarget<T>, filename: string): Promise<void> {
    const database = source.getRepository(type);
    const items = await database.find();
    const content = JSON.stringify(items, (k, v) => {
        if(k === "id") {
            return undefined;
        }

        if(k.endsWith("codenames")) {
            return (v && v.length > 0 ) ? v.split(",") : [];
        }

        return v;
    }, 2);
    await fs.writeFile(path.join(OUTPUT_DIR, filename + ".json"), content, "utf8");
    log.info(`Save '${filename}' finished!`);
}

async function main(): Promise<void> {
    const source = await initialize();
    await extract(source, SideEntity, "sides");
    await extract(source, FactionEntity, "factions");
    await extract(source, TypeEntity, "types");
    await extract(source, SubtypeEntity, "subtypes");
    await extract(source, SettypeEntity, "settypes");
    await extract(source, CycleEntity, "cycles");
    await extract(source, SetEntity, "sets");
    await extract(source, FormatEntity, "formats");
    await extract(source, PoolEntity, "pools");
    await extract(source, RestrictionEntity, "restrictions");
    await extract(source, SnapshotEntity, "snapshots");
    await extract(source, CardEntity, "cards");
    await extract(source, PrintingEntity, "printings");
    await extract(source, RulingEntity, "rulings");
    await source.destroy();
}

main()
    .then(() => {
        log.info("Finished!");
    })
    .catch((err: Error) => {
        log.error("Failed with error: " + err.message);
        log.error("Stacktrace: " + err.stack);
    })
    .finally(async () => {
        await fs.unlink(DOWNLOAD_FILE);
    })
    ;
