// ============ 东航 App 签到 - 定时执行脚本 (Surge cron) ============
// 用途：每天定时读取 ceair_capture.js 保存的签到请求快照并原样重放。
// 前提：已通过 Surge MitM 抓包，且至少手动签到过一次生成快照。
// 注意：若东航接口校验时间戳/签名，重放会失败；Token 过期时需重新手动签到刷新快照。
const STORE_FILE = "ceair_signin_req.json";

function load() {
  const data = $file.read(STORE_FILE);
  if (!data || !data.content) return null;
  try { return JSON.parse(data.content); } catch (e) { return null; }
}

function notify(title, msg) {
  $notification.post("东航签到", title, msg);
}

function main() {
  const req = load();
  if (!req) {
    notify("未找到签到请求快照", "请先在东航App手动签到一次，确保捕获脚本生效");
    $done();
    return;
  }
  $httpClient.request({
    url: req.url,
    method: req.method,
    headers: req.headers,
    body: req.body
  }, (err, resp, data) => {
    if (err) {
      notify("签到失败(网络错误)", String(err).slice(0, 200));
      $done();
      return;
    }
    const text = data ? String(data).slice(0, 200) : "(空响应)";
    const status = resp && resp.status ? String(resp.status) : "?";
    notify("HTTP " + status, text);
    $done();
  });
}

main();
