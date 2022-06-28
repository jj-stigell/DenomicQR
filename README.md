# DenomicQR, a dynamic QR code web app
Simple web app to create and maintain dynamic QR codes.

[Live demo](https://denomic.herokuapp.com/)

Demo account:

    User:     demo@demo.com
    Password: password

## Introduction
With DenomicQR users can create and maintain their own dynamic QR codes.
The QR codes have short redirection URL encoded in them. Scanning and opening
the QR code redirects user to the url assigned to the QR code. This url can be
edited, making it a dynamic QR code.

App uses Base64 encoding scheme to represent the QR codes. Generated QR codes are stored in base64 format to the database.
Database used for the app is [PostgreSQL](https://www.postgresql.org/). Validation for user inputs in client-side is done using javascript, regex and jQuery. Server-side validation is done with regex and Deno's [Validasaur](https://github.com/emsifa/validasaur) library.

## Requirements
* [Deno](https://deno.land/) (App built using [v1.22.0](https://github.com/denoland/deno/releases/tag/v1.22.0))

## Run the application (locally)
1. Clone the project to your machine ```[git clone https://github.com/jj-stigell/DenomicQR.git]```
2. Install [Deno](https://deno.land/) JS/TS runtime.
3. Create a postgreSQL databse and create database tables by loading the sql files from /config/database/createTables.sql
4. (optional) you can populate the database with ready made mock data with file /config/database/mockData.sql.
User password is commented in plain text to easily sign in to the account.
5. Setup the database credentials in /config/database/creds.js
6. Setup in file /config/settings.js your base url + "/code" to where the codes will be redirected, for and example http://localhost:7777/code/ or 'https://myherokuapp.herokuapp.com/code/'
6. Run from project root with command: ```deno run --allow-net --allow-read --unstable run-locally.js```
7. Open [localhost:7777](http://localhost:7777)

## Deploy to Heroku
1. App ports have already been configured for the use of Heroku in the app.js file
2. Create a new app in heroku and in the setting tab add the following buildpack https://github.com/chibat/heroku-buildpack-deno.git
3. A Procfile (case-sensitive, no suffix) in the project root directory will tell Heroku that it can launch the application using the command line command ```web: deno run --allow-all --unstable app.js ${PORT}``` Heroku will replace ${PORT} with the port that it wishes that the application will run on.
4. Deno version can be set with an additional file called runtime.txt. App has been created and tested with runtime v1.22.0
5. To push the project to Heroku make sure you have [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed on your machine.
6. Push the application to Heroku repository with terminal commands from the project root directory:
    * ```heroku login```
    * ```git init```
    * ```heroku git:remote -a "your-heroku-app-name"```
    * ```git add .```
    * ```git commit -m "initial commit"```
    * ```git push heroku master```
7. After Heroku set everything up, your app should be working in the address https://your-heroku-app-name.herokuapp.com

## API

Two APIs are available. QR code link redirecting history and edit history.

Redirecting history is fetched by making a request to "/rehist/'qrID'". For an example "/rehist/94jkT95u" returns the redirects of QR code id 94jkT95u in ascending order by 'viewedat' and meta data containing the QR id and how many entries found in total.

```json

{
    redirectHistory: [{
        id: 2845,
        viewedat: "2022-06-21T20:54:38.119Z"
    },
    {
        id: 3843,
        viewedat: "2022-06-22T01:46:58.730Z"
    }],
    meta: {
        qrid: "94jkT95u",
        foundEntries: 2
    }
}

```

Edit history is fetched by making a request to "/edhist/'qrID'". For an example "/rehist/94jkT95u" returns the edits made to QR code id 94jkT95u in ascending order by 'fromdate' and meta data containing the QR code id and how many entries found in total.

```json

{
    editHistory: [{
        id: 1043,
        linksto: "https://www.nhk.or.jp/",
        comment: "This QR code redirects to NHK Japan",
        fromdate: "2022-06-22T05:47:47.829Z",
        todate: "2022-07-22T05:49:58.510Z"
    },
    {
        id: 1273,
        linksto: "https://www.foxnews.com/",
        comment: "Links was update, now it's redirecting to Fox News",
        fromdate: "2022-07-22T05:49:58.510Z",
        todate: "2022-08-22T18:04:22.902Z"
    },
    {
        id: 1883,
        linksto: "https://jsonapi.org/",
        comment: "Updated the link to redirect to JSON website",
        fromdate: "2022-08-22T18:04:22.902Z",
        todate: "2022-09-22T18:06:05.860Z"
    }],
    meta: {
        qrid: "94jkT95u",
        foundEntries: 3
    }
}

```
At this moment, API is available only for the user who owns the QR code and access it from the webapp.

## Run tests
Run tests for the app from project root with command: ```deno test --allow-net --unstable --allow-read```

## Built With

* [Deno v1.22.0](https://deno.land/) - A modern runtime for JavaScript and TypeScript.
* [PostgreSQL v13](https://www.postgresql.org/docs/13/index.html) - PostgreSQL is a powerful, open source object-relational database system. Project using [ElephantSQL](https://www.elephantsql.com/plans.html).
* [Bootstrap 5](https://getbootstrap.com/) - Powerful, extensible, and feature-packed frontend toolkit. Build and customize with Sass, utilize prebuilt grid system and components, and bring projects to life with powerful JavaScript plugins.
* [Eta](https://eta.js.org/) - A lightweight, powerful, pluggable embedded JS template engine.
* [jQuery v3.6.0](https://jquery.com/) - jQuery is a fast, small, and feature-rich JavaScript library.
* [Chart.js v3.8.0](https://www.chartjs.org/) - Simple yet flexible JavaScript charting for designers & developers.
* Deno libraries
    * [oak v9.0.1](https://github.com/oakserver/oak) - A middleware framework for Deno's native HTTP server, Deno Deploy and Node.js 16.5 and later.
    * [superoak v4.7.0](https://deno.land/x/superoak@4.7.0) - HTTP assertions for Oak made easy via SuperDeno. For testing.
    * [QR Code v2.0.0](https://deno.land/x/qrcode@v2.0.0) - Generate QR codes in Deno, as base64-encoded images, completely dependency-free and requires no binary.
    * [Validasaur v0.15.0](https://github.com/emsifa/validasaur) - Validasaur is Deno validation library slightly inspired by Laravel Validation.
    * [Short UUID v3.2.3](https://github.com/jeanlescure/short_uuid) - Deno module used for generating random or sequential UUID of any length.
    * [BCrypt v0.2.4](https://deno.land/x/bcrypt@v0.2.4) - A port from jBCrypt to TypeScript for use in Deno.
    * [Oak Sessions v3.1.3](https://deno.land/x/oak_sessions@v3.1.3) - Use cookie-based web sessions with the Oak framework.
    * [deno-postgres v0.13.0](https://deno.land/x/postgres@v0.13.0) - A lightweight PostgreSQL driver for Deno focused on user experience.
    * [Eta v.1.12.3](https://deno.land/x/eta@v1.12.3) - Eta is a lightweight and blazing fast embedded JS templating engine that works inside Node, Deno, and the browser.

## Future TODO
* Fix the various cosmetic problems with the user interface
* [Captcha](https://deno.land/x/svg_captcha@v1.1.0) for preventing bots etc. from signing up, mass generating codes
* More comprehensive tests
* Replace the place holder chart with working one
* Format datetime in the QR code edit mode
* Record to database the device that was used for opening the QR link (Android, PC, iPhone, Mac, etc.)
* Edit and redirect history listing with filter and arrange functionalities
* Caching of recources
* Third party sign in functionality (Google, Facebook, GitHub, etc.)
* Database indexing
* Error [logging](https://deno.land/std@0.145.0/log/README.md)
* Error handling

## Version History
* 0.3.0
    * Redirect and edit history view for the user, with ajax update functionality
    * Delete confirmation part of the UI
    * Client-side form validation for registration, code adding and editing with jQuery
    * Chart showing redirect history (uses mock data at the moment)
    * Faq page
    * Create QR code and my QR codes pages separated
* 0.2.0
    * Only the owner of the QR code can view edit page, edit and delete the code
    * APIs for getting the redirecting and edit history
    * Not found pages redirecting for dead links
    * Increment view for link everytime opened
    * Redirect and edit history tracking
    * QR code deleting deletes the history and views
* 0.1.2
    * Reformatting forms
    * Fixing typos in main pages
* 0.1.1
    * Initial Release