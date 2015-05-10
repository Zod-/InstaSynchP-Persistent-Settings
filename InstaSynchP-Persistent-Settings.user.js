// ==UserScript==
// @name        InstaSynchP Persistent Settings
// @namespace   InstaSynchP
// @description Makes the InstaSync settings persistent

// @version     1.0.4
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
  'use strict';
  this.version = version;
  this.name = 'InstaSynchP Persistent Settings';
  this.settings = [{
    label: 'Autosync',
    id: 'instasync-autosync',
    type: 'checkbox',
    destination: 'playlist',
    'default': true,
    section: ['InstaSync']
  }, {
    label: 'Native YouTube controls',
    id: 'instasync-yt-controls',
    type: 'checkbox',
    destination: 'playlist',
    'default': false,
    section: ['InstaSync']
  }, {
    label: 'Show greynames in chat',
    id: 'instasync-greynames-chat',
    type: 'checkbox',
    'default': true,
    section: ['InstaSync']
  }, {
    label: 'Disable player',
    id: 'instasync-disable-player',
    type: 'checkbox',
    destination: 'playlist',
    'default': false,
    section: ['InstaSync']
  }];
}

PersistentSettings.prototype.executeOnce = function () {
  'use strict';
  var _this = this;
  events.on(_this, 'SettingChange[instasync-autosync]', function (ig, v) {
    window.room.autosync = v;
    if (v) {
      sendcmd('resynch');
    }
  });
  events.on(_this, 'SettingChange[instasync-yt-controls]', function (ig, v) {
    window.room.showYTcontrols = v;
    reloadPlayer();
  });
  events.on(_this, 'SettingChange[instasync-greynames-chat]', function (ig, v) {
    window.room.filterGreyname = v;
  });
  events.on(_this, 'SettingChange[instasync-disable-player]', function (ig, v) {
    window.room.playerDisabled = v;
    if (v) {
      $("#media").html("");
    } else {
      reloadPlayer();
    }
  });
};

PersistentSettings.prototype.postConnect = function () {
  'use strict';
  window.room.autosync = gmc.get('instasync-autosync');
  window.room.showYTcontrols = gmc.get('instasync-yt-controls');
  window.room.filterGreyname = gmc.get('instasync-greynames-chat');
  window.room.playerDisabled = gmc.get('instasync-disable-player');
  reloadPlayer();
};

PersistentSettings.prototype.preConnect = function () {
  'use strict';
  $('#disable_player').remove();
  $('#reload_btn').off().on('click', function () {
    if (!gmc.get('instasync-disable-player')) {
      reloadPlayer();
    } else {
      gmc.set('instasync-disable-player', false);
    }
  });
};

window.plugins = window.plugins || {};
window.plugins.persistentSettings = new PersistentSettings('1.0.4');
