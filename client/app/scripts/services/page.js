'use strict';

angular.module('YipTV')
  .service('Page', function () {
    this.title = "";
    this.getTitle = function() {
      return this.title;
    };
    this.setTitle = function(t) {
      this.title = t;
    }
  });
