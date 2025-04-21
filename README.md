# netrunner-card-data

*《矩阵潜袭》中文卡牌数据库数据导出工具*

## 简介

`netrunner-card-data` 用于将由 [netrunner-database](https://github.com/eric03742/netrunner-database) 导入中文卡牌数据库的数据导出为JSON格式的文本文件。

## 使用

使用以下命令运行工具：

```shell
npx @eric03742/netrunner-card-data \
    --host={HOST} \
    --port={PORT} \
    --username={USERNAME} \
    --password={PASSWORD} \
    --database={DATABASE} \
    --output={OUTPUT_DIR}
```

**参数说明**

* `--host`：数据库地址
* `--port`：端口
* `--username`：用户名
* `--password`：密码
* `--database`：数据库名
* `--output`：导出目录

## 数据源

卡牌数据来自 [NetrunnerDB](https://netrunnerdb.com/) API，中文文本数据来自 [NetrunnerCN/netrunner-card-text-Chinese](https://github.com/NetrunnerCN/netrunner-card-text-Chinese)。

本仓库及其开发者与 Fantasy Flight Games、Wizards of the Coast、Null Signal Games、NetrunnerDB 均无关联。

## 许可证

[MIT](./LICENSE)

## 作者

[Eric03742](https://github.com/eric03742)
