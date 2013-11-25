Spruce Quiz Junior
=================

## After git clone:
1. First you need to install those command line tools globally:

    npm install -g bower grunt-cli grunt

2. then run:

    npm install

3. finally:

    sh init.sh

Note that you need to open the browser at http://localhost:9018 to compile it.
You have to manually open the browser to compile the code, so support for a headless server deployment is not included.

## Single-liner:

    npm install && npm update && bower update && cd client/lib/angular-placeholders && npm install && grunt && cd ../../.. && cd client/lib/angular-bootstrap/ && npm install && npm install grunt-cli && grunt && cd ../../..


## Break down of script:
### angular-placeholder make

    npm install && npm update && bower update && cd client/lib/angular-placeholders && npm install && grunt && cd ../../..

### angular-bootstrap make

    cd client/lib/angular-bootstrap/ && npm install && npm install grunt-cli && grunt && cd ../../..

During the second to last command, open browser at [http://localhost:9018](http://localhost:9018)
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
    npm start

## How to Let Karma watch the folder and keep running the client-side test:

    grunt clientwatch

other testing scripts are coming.
