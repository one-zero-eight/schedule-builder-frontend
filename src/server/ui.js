export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('InNoHassle')
    .addItem('Open scheduling plugin', 'openPlugin');

  menu.addToUi();
};

export const openPlugin = () => {
  const html = HtmlService.createHtmlOutputFromFile('innohassle-sidebar');
  html.setTitle('Schedule conflict resolver');
  SpreadsheetApp.getUi().showSidebar(html);
};
