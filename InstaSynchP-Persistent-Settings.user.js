// ==UserScript==
// @name        InstaSynchP Persistent Settings
// @namespace   InstaSynchP
// @description Makes the InstaSync settings persistent

// @version     1
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-Persistent-Settings
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js?version=37716
// ==/UserScript==

function PersistentSettings(version) {
  "use strict";
  this.version = version;
  this.name = 'InstaSynchP Persistent Settings';
  this.settings = [{
    'label': 'Autosync',
    'id': 'instasync-autosync',
    'type': 'checkbox',
    'default': true,
    'section': ['InstaSync']
  }, {
    'label': 'Native YouTube controls',
    'id': 'instasync-yt-controls',
    'type': 'checkbox',
    'default': false,
    'section': ['InstaSync']
  },{
    'label': 'Show greynames in chat',
    'id': 'instasync-greynames-chat',
    'type': 'checkbox',
    'default': true,
    'section': ['InstaSync']
  }, {
    'label': 'Disable player',
    'id': 'instasync-disable-player',
    'type': 'checkbox',
    'default': false,
    'section': ['InstaSync']
  }];
}

PersistentSettings.prototype.autosync = function () {
  "use strict";
  var th = this;
  window.room.autosync = gmc.get('instasync-autosync');
  $("#toggle_autosync_box").off();
  if (!gmc.get('instasync-autosync')) {
    $("#toggle_autosync_box").trigger('click');
  }
  $("#toggle_autosync_box").on("change", function () {
    gmc.set('instasync-autosync', $(this).is(":checked"));
    window.plugins.settings.save();
  });
  events.on(th, 'SettingChange[instasync-autosync]', function (ignore, newVal) {
    window.room.autosync = newVal;
    if (newVal) {
      sendcmd('resynch');
    }
  });
};

PersistentSettings.prototype.ytControls = function () {
  "use strict";
  var th = this;
  window.room.showYTcontrols = gmc.get('instasync-yt-controls');
  $("#toggleYTcontrols_box").off();
  if (gmc.get('instasync-yt-controls')) {
    $("#toggleYTcontrols_box").trigger('click');
  }
  $("#toggleYTcontrols_box").on("change", function () {
    gmc.set('instasync-yt-controls', $(this).is(":checked"));
    window.plugins.settings.save();
  });
  events.on(th, 'SettingChange[instasync-yt-controls]', function (ignore, newVal) {
    window.room.showYTcontrols = newVal;
    reloadPlayer();
  });
};

PersistentSettings.prototype.greynameFilter = function () {
  "use strict";
  var th = this;
  window.room.filterGreyname = gmc.get('instasync-yt-controls');
  $("#toggle_greyname_chat").off();
  if (!gmc.get('instasync-greynames-chat')) {
    $("#toggle_greyname_chat").trigger('click');
  }
  $("#toggle_greyname_chat").on("change", function () {
    gmc.set('instasync-greynames-chat', $(this).is(":checked"));
    window.plugins.settings.save();
  });
  events.on(th, 'SettingChange[instasync-greynames-chat]', function (ignore, newVal) {
    window.room.filterGreyname = newVal;
  });
};

PersistentSettings.prototype.disablePlayer = function () {
  "use strict";
  var th = this;
  window.room.playerDisabled = gmc.get('instasync-disable-player');
  $("#disable_player").off();
  $('#reload_btn').off();
  function save(val){
    gmc.set('instasync-disable-player', val);
    window.plugins.settings.save();
  }
  $("#disable_player").on("click", function () {
    save(true);
  });
  $('#reload_btn').on("click", function () {
    save(false);
  });
  events.on(th, 'SettingChange[instasync-disable-player]', function (ignore, newVal) {
    if(newVal){
      $("#media").html("");
    }else{
      reloadPlayer();
    }
    window.room.playerDisabled = newVal;
  });
};

PersistentSettings.prototype.preConnect = function () {
  "use strict";
  var th = this;
  th.autosync();
  th.greynameFilter();
  th.ytControls();
  th.disablePlayer();
};

window.plugins = window.plugins || {};
window.plugins.persistentSettings = new PersistentSettings('1');
