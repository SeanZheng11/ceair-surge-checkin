// ============ 东航 App 签到 - 请求捕获脚本 (Surge http-request) ============
// 用途：当东航 App 发出签到请求时，自动把请求快照(URL/Method/Headers/Body)保存到文件，
// 供 ceair_checkin.js 定时重放。本脚本不主动发起请求，只做抓取存档。
const STORE_FILE = "ceair_signin_req.json";

function save() {
  const snapshot = {
    url: $request.url,
    method: $request.method,
    headers: $request.headers,
    body: $request.body || ""
  };
  const result = $file.write({ string: JSON.stringify(snapshot) }, STORE_FILE);
  if (result && result.error) {
    $notification.post("东航签到", "捕获失败", String(result.error));
  } else {
    $notification.post("东航签到", "已捕获签到请求", $request.url);
  }
}

save();
$done();
