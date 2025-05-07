# netrunner-card-data

*《矩阵潜袭》中文卡牌数据库数据导出工具*

## 简介

`netrunner-card-data` 用于将由 [netrunner-database](https://github.com/eric03742/netrunner-database) 生成的《矩阵潜袭》中文卡牌数据库导出为JSON格式的文本文件。

## 本地运行

拉取或下载本仓库后使用以下命令安装：

```shell
npm install
npm run build:release
```

编译完成后使用以下命令运行：

```shell
npm run start [-- --mirror]
```

其中参数 `--mirror` 表示使用国内的 [Gitee](https://gitee.com/eric03742/netrunner-database) 镜像源数据库。不加参数时，默认使用 [GitHub](https://github.com/eric03742/netrunner-database) 源。

生成的数据位于 `result` 文件夹下。

## 数据源

你可以在项目目录中的 `result` 文件夹下查看最新版本的导出数据。

本项目使用 [netrunner-database](https://github.com/eric03742/netrunner-database) 生成的 SQLite 数据库文件作为数据来源。

卡牌数据来自 [NetrunnerDB](https://netrunnerdb.com/) 及其 GitHub 仓库 [netrunner-card-json](https://github.com/NetrunnerDB/netrunner-cards-json)，中文文本数据来自 [netrunner-card-text-Chinese](https://github.com/eric03742/netrunner-card-text-Chinese)。

本仓库及其开发者与 Fantasy Flight Games、Wizards of the Coast、Null Signal Games、NetrunnerDB 均无关联。

## 许可证

[MIT](./LICENSE)

## 作者

[Eric03742](https://github.com/eric03742)
