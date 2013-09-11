Spruce Quiz Junior
=================

## After git clone:

### Single-liner:
    npm install && npm update && bower update && cd client/lib/angular-placeholders && npm install && npm install grunt-cli && grunt && cd ../../..

During the second to last command, open browser at:
    http://localhost:9018
to allow karma to compile the `angular-placeholders` library

### Step-by-step:
1. Run `npm install` or `npm update` to download all of the npm packages.
2. Run `bower install` to load all of the library files.
3. The `angular-placeholders` package needs to be compiled.
  * first get into the directory:
          ```cd client/lib/angular-placeholders```
  * Second, `npm install`
  * Now install the `grunt-cli` command line tool for grunt (grunt itself is already installed locally at this point during the last step.)
          ```npm install -g grunt-cli```
  * Now you are pretty much ready to go

## How to run:

Type in the following command to run. 

    cd SpruceQuizJunior && npm install
    supervisor server.js
