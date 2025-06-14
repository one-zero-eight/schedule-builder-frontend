# InNoHassle-ScheduleConflictResolver

React plugin for Google Spreadsheets to check conflicts in Innopolis University's schedule

This template was used for react integration: https://github.com/enuchi/React-Google-Apps-Script/tree/main

## Installation and linking

1. Download [node](https://nodejs.org/en/download) and [yarn (classic)](https://classic.yarnpkg.com/lang/en/docs/install) package manager
2. Enable the [Google Apps Script API](https://script.google.com/home/usersettings) in your settings
3. Clone the repository
4. In the root of the project run `yarn install`
5. Login into your google spreadsheets account via `yarn run login`
6. Open the spreadsheet you wish to link the plugin to
    - Open your Google Sheets document
    - Go to `Extensions` -> `Apps Script` -> `Project settings`
    - Find `Script ID` and copy it
7. Rename the `.clasp.json.EXAMPLE` file to `.clasp.json`
8. Open the above file and change it's contents to link the project
    - **DO NOT edit** `rootDir` field
    - Change the `scriptId` field to the value copied on step **6**
    - Change the `parentId` field to the id of your spreadsheet. You can get it via spreadsheet url. For example: https://docs.google.com/spreadsheets/d/.../edit the `id` is at `...`
9. Next, follow either `Launch for production` if you intent on using the plugin and `Launch for development` if you want to change the code for the plugin

## Launch for production

1. Run `yarn run deploy`
2. Run `yarn run open`
3. After the page loads you will see `InNoHassle` menu item on top of your spreadsheet. Click the button and open the plugin. It will appear as a sidebar on your right 

## Launch for development

TODO