const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rimraf = require('rimraf');
const {program} = require('commander');


function processDir(dir, destPath, delSourceFlag) {
    fs.readdir(dir, {withFileTypes: true}, (err, fileSysmObjects) => {
        //счетчик объектов в директории. Нужен чтоб понять, когда можно директорию удалять
        let dirObjNumber = fileSysmObjects.length;

        fileSysmObjects.forEach(obj => {
            const objPath = path.join(dir, obj.name)
            if (obj.isDirectory()) {
                processDir(objPath, destPath);
                return
            }

            // if file
            const toDir = obj.name[0];
            const toFilePath = path.join(destPath, toDir, obj.name);
            fs.mkdir(path.join(destPath, toDir), {recursive: true}, err => {
                if (err) throw err;
                if (delSourceFlag) {
                    fs.rename(objPath, toFilePath, (err) => {
                        if (err) throw err;
                        if (dirObjNumber -= 1 <= 0) {
                            // приведенный ниже вариант не работает на винде, т.е ошибка
                            //Error: EPERM: operation not permitted, unlink
                            // fs.unlink(dir, err => {console.log(`directory ${dir} deleted, \n ${err}`)})

                            //поэтому использую стороннюю библиотеку, в которой это проблема решена
                            rimraf(dir, err => {
                                err && console.log(err)
                            })
                        }
                    })
                } else {
                    fs.copyFile(objPath, toFilePath, err => {
                        if (err) throw err
                    })
                }
            })

        })
    })
}

const verifyDirectoryExists = dir => {
    fs.access(dir, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`${dir}  does not exist `);
            throw err;
        }
    });
}

if (require.main === module) {
    program
        .option('-s, --source <type>', 'source path')
        .option('-d, --destination <type>', 'destination path')
        .option('-dd, --delsource', 'delete source after finish');
    program.parse(process.argv);

    assert(program.source, "source path is not set");
    assert(program.destination, "destination path is not set");
    verifyDirectoryExists(program.source);

    const delSourceFlag = !!program.delsource;
    processDir(program.source, program.destination, delSourceFlag)


}


