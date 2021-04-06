function koekenInfoMailToSlack() {

  //SlackのWebhook URL
  const webhook_url = 'https://hooks.slack.com/services/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';
  
  //アプリのアイコン
  const slack_icon = ':tabitha:';
  const slack_icon_twitter = ':bird:';

  //チャンネル名
  const channel = '#biz-web_division';

  //アプリ名
  const app_name_mail = 'keio.koeken.info@gmail.comでの新規受信';
  const app_name_twitter = 'Twitter(@keiokoeken)のDM通知';

  //トリガー頻度に合わせてfrequencyを調整 （トリガーの時間（分単位）と一致させる）
  var current_time = (new Date()).getTime();
  var after = parseInt((current_time - 10*60*1000) / 1000);
  var searchTarget = 'in:inbox is:unread after:' + after;
  var options;
  GmailApp
  .search(searchTarget, 0, 50)
  .forEach((thread) => {
    thread.getMessages().forEach(function(message){
      if(message.getFrom().search(/twitter/) >= 0) {
        var payload = {
          "icon_emoji": slack_icon_twitter,
          "attachments" : [
            {
              "color": '#00acee',
              "title": message.getSubject(),
            },
          ],
          "channel": channel,
          "username": app_name_twitter,
        };
        options = {
          "method": 'post',
          "contenttype": 'application/json',
          "payload": JSON.stringify(payload),
        };
      }else if(message.getFrom().search(/Google/) == -1 || message.getFrom().search(/google/) == -1) {
        //Googleのシステムメールは無視
        payload = {
          "icon_emoji": slack_icon,
          "attachments": [
            {
              "color": '#ff0000',
              "title": '［件名］' + message.getSubject(),
              "fields": [
                {
                  "value":'［送信者］\n' + message.getFrom() + '\n［本文］\n' + message.getPlainBody(),
                }
              ],
            }
          ],
          "channel": channel,
          "username": app_name_mail,
        };
        options = {
          "method": 'post',
          "contenttype": 'application/json',
          "payload": JSON.stringify(payload),
        };
      }else{
        return;
      }
    });
    UrlFetchApp.fetch(webhook_url, options);
  });
}
