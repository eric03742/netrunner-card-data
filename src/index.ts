#!/usr/bin/env node

import "reflect-metadata";
import fs from "fs/promises";
import log from "loglevel";
import path from "path";
import { program } from "commander";
import { EntityTarget } from "typeorm";

import {
    SEPARATOR, NetrunnerDataSource, NetrunnerDataSourceOptions,
    BaseEntity, SideEntity, FactionEntity, TypeEntity, SubtypeEntity,
    SettypeEntity, CycleEntity, SetEntity,
    FormatEntity, PoolEntity, RestrictionEntity, SnapshotEntity,
    CardEntity, PrintingEntity, RulingEntity,
} from "@eric03742/netrunner-entities";

interface AppOptions extends NetrunnerDataSourceOptions {
    output: string;
}

program
    .version("0.1.0", "-v, --version", "显示程序版本")
    .requiredOption("--host <host>", "数据库地址")
    .requiredOption("--port <port>", "端口", parseInt)
    .requiredOption("--username <username>", "用户名")
    .requiredOption("--password <password>", "密码")
    .requiredOption("--database <database>", "数据库名")
    .requiredOption("--output <output>", "导出目录")
    ;
program.parse();
const options = program.opts<AppOptions>();
const AppDataSource = new NetrunnerDataSource(options);

async function initialize(): Promise<void> {
    log.setLevel(log.levels.INFO);
    await AppDataSource.initialize();
    log.info(`MySQL server '${options.host}:${options.port}', database '${options.database}' connected!`);
}

async function terminate(): Promise<void> {
    await AppDataSource.destroy();
}

async function extract<T extends BaseEntity>(type: EntityTarget<T>, filename: string): Promise<void> {
    const database = AppDataSource.getRepository(type);
    const items = await database.find();
    const content = JSON.stringify(items, (k, v) => {
        if(k === "id") {
            return undefined;
        }

        if(k.endsWith("list")) {
            return (v && v.length > 0 ) ? v.split(SEPARATOR) : [];
        }

        return v;
    }, 2);
    await fs.writeFile(path.join(options.output, filename + ".json"), content, "utf8");
    log.info(`Save '${filename}' finished!`);
}

async function main(): Promise<void> {
    await initialize();
    await extract(SideEntity, "sides");
    await extract(FactionEntity, "factions");
    await extract(TypeEntity, "types");
    await extract(SubtypeEntity, "subtypes");
    await extract(SettypeEntity, "settypes");
    await extract(CycleEntity, "cycles");
    await extract(SetEntity, "sets");
    await extract(FormatEntity, "formats");
    await extract(PoolEntity, "pools");
    await extract(RestrictionEntity, "restrictions");
    await extract(SnapshotEntity, "snapshots");
    await extract(CardEntity, "cards");
    await extract(PrintingEntity, "printings");
    await extract(RulingEntity, "rulings");
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
        await terminate();
    });
