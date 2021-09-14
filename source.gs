function koekenInfoMailToSlack() {

  //SlackのWebhook URL
  const webhook_url = '{Your Slack webhook URL}';
  
  //アプリのアイコン
  const slack_icon = ':tabitha:';
  const slack_icon_twitter = ':twitter:';

  //チャンネル名
  const channel = '{ Your Channel }';

  //アプリ名
  const app_name_mail = 'Email通知';
  const app_name_twitter = 'Twitter(@keiokoeken)のDM通知';

  //トリガー頻度に合わせてfrequencyを調整 （トリガーの時間（分単位）と一致させる）
  var current_time = (new Date()).getTime();
  var after = parseInt((current_time - 10*60*1000) / 1000);
  var searchTarget = 'in:inbox is:unread after:' + after;
  var options;

  GmailApp
  .search(searchTarget, 0, 50)
  .forEach((thread) => {
    //毎回options初期化
    options = null;

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
        //一般メールを送信
      }else if(message.getFrom().search(/google/) < 0 && message.getFrom().search(/Google/) < 0 ){
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
        //Googleのシステムメールは無視
      }else{
        options = null;
      }
    });

    //optionsに値が入力されれば
    if(options){
      UrlFetchApp.fetch(webhook_url, options);
    }
  });
}
