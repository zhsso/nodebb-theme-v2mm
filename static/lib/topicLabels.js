// Generated by CoffeeScript 1.10.0
'use strict';
define('forum/topicLabelsTool', ['components', 'translator', 'topicSelect'], function(omponents, translator, topicSelect) {
  var checkTopicLabel, running;
  running = false;
  console.log("topicLabelsTool init ...");
  checkTopicLabel = function(topic, labelName) {
    if (!topic.labels || !topic.labels.length) {
      return false;
    }
    return !!topic.labels.find(function(label) {
      return label.name === labelName;
    });
  };
  $(document).on('click', '.label-tools .toggle-label', function() {
    var action, cid, label, labelName, labeledTopics, msg, tids;
    labelName = $(this).data('name');
    if (ajaxify.data.template.topic) {
      tids = [String(ajaxify.data.tid)];
    } else {
      tids = topicSelect.getSelectedTids();
    }
    label = ajaxify.data.availabelLabels.find(function(label) {
      return label.name === labelName;
    });
    if (running || !tids.length || !label) {
      return false;
    }
    running = true;
    if (ajaxify.data.template.topic) {
      if (checkTopicLabel(ajaxify.data, labelName)) {
        labeledTopics = [ajaxify.data];
      } else {
        labeledTopics = [];
      }
    } else {
      labeledTopics = ajaxify.data.topics.filter(function(topic) {
        return tids.indexOf(String(topic.tid)) !== -1 && checkTopicLabel(topic, labelName);
      });
    }
    if (labeledTopics.length === tids.length) {
      action = 'remove';
      msg = 'Remove label success.';
    } else {
      action = 'add';
      msg = 'Add label success.';
    }
    cid = ajaxify.data.cid;
    socket.emit('plugins.v2mm.handleLabel', {
      action: action,
      label: label,
      tids: tids,
      cid: cid
    }, function(err) {
      if (err) {
        return app.alertError(err.message);
      }
      running = false;
      app.alertSuccess(msg);
      return ajaxify.refresh();
    });
    return false;
  });
  $(document).on('click', '.label-tools .removeAllLabels', function() {
    bootbox.confirm('Are you sure you wish to remove all labels?', function(confirm) {
      var action, cid, tids;
      if (!confirm) {
        return;
      }
      if (ajaxify.data.template.topic) {
        tids = [String(ajaxify.data.tid)];
      } else {
        tids = topicSelect.getSelectedTids();
      }
      action = 'removeAll';
      cid = ajaxify.data.cid;
      return socket.emit('plugins.v2mm.handleLabel', {
        action: action,
        tids: tids,
        cid: cid
      }, function(err) {
        if (err) {
          return app.alertError(err.message);
        }
        running = false;
        app.alertSuccess('Remove label success.');
        return ajaxify.refresh();
      });
    });
    return false;
  });
});
