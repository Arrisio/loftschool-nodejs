const fs = require('fs');
const {promisify} = require('util');
const path = require('path');
const assert = require('assert');

const {program} = require('commander');

const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const rename = promisify(fs.rename);
const copyFile = promisify(fs.copyFile);
const rimraf_ = promisify(require('rimraf'));
const access = promisify(fs.access);

const processEntity = async (entity, dir, destPath, delSourceFlag) => {
    const entityPath = path.join(dir, entity.name)
    if (entity.isDirectory()) {
        systematizeFiles(entityPath, destPath);
        return
    }
    const toDir = entity.name[0];
    const toFilePath = path.join(destPath, toDir, entity.name);

    await mkdir(path.join(destPath, toDir), {recursive: true});
    if (delSourceFlag) {
        await rename(entityPath, toFilePath)
    } else {
        await copyFile(entityPath, toFilePath)
    }
}

const systematizeFiles = async (dir, destPath, delSourceFlag) => {
    await access(dir);

    const entities = await readdir(dir, {withFileTypes: true});
    await Promise.all(entities.map(async entity => {
        processEntity(entity, dir, destPath, delSourceFlag)
    }))
    if (delSourceFlag) rimraf_(dir);
}


if (require.main === module) {
    program
        .option('-s, --source <type>', 'source path')
        .option('-d, --destination <type>', 'destination path')
        .option('-dd, --delsource', 'delete source after finish');
    program.parse(process.argv);

    assert(program.source, "source path is not set");
    assert(program.destination, "destination path is not set");

    const delSourceFlag = !!program.delsource;
    systematizeFiles(program.source, program.destination, delSourceFlag)


}



