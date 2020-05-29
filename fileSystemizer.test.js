
const fs = require('fs');
const unzipper = require('unzipper');
const rimraf = require('rimraf');



describe('listFilesInDirectorySync', () => {
    beforeEach(()=> {
        // Set up some mocked out file info before each test
        fs.createReadStream('__mocks__/mock_dir.zip')
            .pipe(unzipper.Extract({path: '__mocks__/'}))
    });

    afterEach(async () => {
        rimraf.sync('__mocks__/mock_dir')
    });

    it('includes all files in the directory in the summary', () => {
        let files = fs.readdirSync('__mocks__/mock_dir')
        files.forEach(item => {
            console.log(item)
        });
        expect(files.length).toBe(4);
    });


});