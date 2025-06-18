export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu("InNoHassle")
    .addItem('Open scheduling plugin', 'openPlugin');

  menu.addToUi();
};

export const openPlugin = () => {
  const html = HtmlService.createHtmlOutputFromFile('plugin');
  html.setTitle("Schedule conflict resolver")
  SpreadsheetApp.getUi().showSidebar(html);
};
