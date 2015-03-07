// ==UserScript==
// @name        InstaSynchP Persistent Settings
// @namespace   InstaSynchP
// @description Makes the InstaSync settings persistent

// @version     1.0.3
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
  }, {
    'label': 'Show greynames in chat',
    'id': 'instasync-greynames-chat',
    'type': 'checkbox',
    'default': false,
    'section': ['InstaSync']
  }, {
    'label': 'Disable player',
    'id': 'instasync-disable-player',
    'type': 'checkbox',
    'default': false,
    'section': ['InstaSync']
  }];
}

PersistentSettings.prototype.load = function (setting, variable, selector, neg, onSettingChange) {
  "use strict";
  var th = this,
    set = gmc.get(setting);
  onSettingChange = onSettingChange || function () {};
  window.room[variable] = set;
  //turn off default event, set the checkbox and add our own listener
  $(selector).off().attr('checked', neg ? !set : set).on("change", function () {
    var val = $(this).is(":checked");
    gmc.set(setting, neg ? !val : val);
    window.plugins.settings.save();
  });
  //set the value when the setting changes
  events.on(th, 'SettingChange[{0}]'.format(setting), function (ignore, newVal) {
    window.room[variable] = newVal;
    onSettingChange(ignore, newVal);
  });
};

PersistentSettings.prototype.disablePlayer = function () {
  "use strict";
  var th = this;
  window.room.playerDisabled = gmc.get('instasync-disable-player');
  //remove native events
  $("#disable_player").off();
  $('#reload_btn').off();

  function save(val) {
      gmc.set('instasync-disable-player', val);
      window.plugins.settings.save();
    }
    //kill the player
  $("#disable_player").on("click", function () {
    
    save(true);
  });
  //recreate the player on reload
  $('#reload_btn').on("click", function () {
    if (!gmc.get('instasync-disable-player')) {
      reloadPlayer();
    } else {
      save(false);
    }
  });
  //reload/destroy player on save
  events.on(th, 'SettingChange[instasync-disable-player]', function (ignore, newVal) {
    window.room.playerDisabled = newVal;
    if (newVal) {
      $("#media").html("");
    } else {
      reloadPlayer();
    }
  });
};

PersistentSettings.prototype.preConnect = function () {
  "use strict";
  var th = this;
  th.load('instasync-autosync', 'autosync', '#toggle_autosync_box', false, function (ignore, newVal) {
    if (newVal) {
      sendcmd('resynch');
    }
  });
  th.load('instasync-yt-controls', 'showYTcontrols', '#toggleYTcontrols_box', false, reloadPlayer);
  th.load('instasync-greynames-chat', 'filterGreyname', '#toggle_greyname_chat', true);
  th.disablePlayer();
};

window.plugins = window.plugins || {};
window.plugins.persistentSettings = new PersistentSettings('1.0.3');
