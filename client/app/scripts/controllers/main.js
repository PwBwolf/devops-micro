'use strict';

angular.module('YipTV')
  .controller('MainController', function ($scope, Page) {
    this.Page = Page; // Make the page available to the HTML
    Page.title = "HOMEPAGE_TITLE"; // TODO Localise this
  });
