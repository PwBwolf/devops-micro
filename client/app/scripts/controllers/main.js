'use strict';

angular.module('YipTV')
  .controller('MainController', function ($scope, Page) {
    this.Page = Page;
    Page.title = "Welcome to YipTV"; // TODO Localise this
  });
