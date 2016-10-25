var Exports = module.exports = {};

function createNofications (notifications) {
  messages = notifications.map(function (n) {
    return `
    <div style="border-radius:2px;background-color: #f5f5f5;display:flex;align-items:flex-start;max-width:400px;margin:auto; adding:5px;margin-bottom:20px;padding:5px;border:1px solid #eee;">
      <img style="display:inline-block;border-radius:100%;height: 40px;" src="` + n.created_by.image + '">'
      + '<div style="display:inline-block; margin-left:10px;">'
      +  '<p style="margin:5px 0;">' + n.message + '</p>'
      +  '<a href="https://thepelicanblog.com' + n.action + `" style="color:#0093FF;text-decoration: none;">See your update --></a>
      </div>
    </div>`;
  });

  var data = '';
  messages.forEach(function (message) {
    data = data + message;
  });

  return data;
};

function createDiscover (discoverPosts) {
  messages = discoverPosts.map(function (d) {
    return `
    <div style="border-radius:2px;background-color: #f5f5f5;display:flex;align-items:flex-start;max-width:400px; margin:auto;margin-bottom:20px;padding:5px;border:1px solid #eee;">
      <img style="display:inline-block;border-radius:100%;height: 40px;" src="` + d.owner.image + '">'
    + `<div style="display:inline-block; margin-left:10px;">
        <p style="margin:5px 0;">` + d.title + '</p>'
      + '<a href="https://thepelicanblog.com/discover?post=' + d._id + '" style="color:#0093FF;text-decoration: none;">Explore --></a>'
    + `</div>
    </div>`;
  });

  var data = '';
  messages.forEach(function(message) {
    data = data + message;
  })
  return data;
};

var header = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title></title>
  </head>
  <body style="background-color:#eee; min-height: 200px; width: 100%;font-family: sans-serif !important; color:#4a4a4a !important;overflow:auto;">
    <a href="https://thepelicanblog.com" style="text-align:center; color: #4a4a4a;text-decoration: none;">
      <h1 style="margin-top:30px;">The Pelican Blog</h1>
    </a>
    <div style="background-color:#fff;border: 1px solid #ddd;border-radius:2px; max-width:100%; width: 550px;margin: 20px auto 40px; padding: 5px 10px 35px;">
      <h2 style="text-align:center;font-weight:300;">Activity Updates</h2>`;


var middle = `
      <hr style="border:0;border-bottom:1px solid #eee;margin-top:40px; margin-bottom:40px;">
      <h2 style="text-align:center;font-weight:300;">Today's new posts</h2>`;


var bottom = `
      <hr style="border:0;border-bottom:1px solid #eee;margin-top:40px; margin-bottom:40px;">
      <h2 style="text-align:center;font-weight:300;">Found new cool stuff?</h2>
      <div style="width:100%;text-align:center;margin-top:40px;margin-bottom:40px;">
        <a href="https://thepelicanblog.com" style="background-color:#0093FF;color:#fff !important;width:80%;padding:15px;text-align:center;color: #4a4a4a;text-decoration: none;">Post some crap</a>
      </div>
    </div>
  </body>
</html>`;

Exports.template = function (notifications, discover) {
  var email = header + createNofications(notifications) + middle + createDiscover(discover) + bottom;
  return email;
};
