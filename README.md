---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: e357b9dc04ed0e4536b6e0158dd175c0_8d894afdc58511f1820a525400638852
    ReservedCode1: KZWnFFQGLA9RE/V9gWLzaZn9S6VmQL3sGddqv06up10ktZqOWgHtOKTv49kA0YEmX6p1kNeg5Gx2qdjEXyLPvkWmPy+UXa27KOvVDHHLkcF+lwdrvxi+1sc+Azjfgz7gaPnGIWu2JM1y9qE6WjrG4KgkD77Uc6PBrPf5eA5wdaSAnYgabLGwJtO7LBo=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: e357b9dc04ed0e4536b6e0158dd175c0_8d894afdc58511f1820a525400638852
    ReservedCode2: KZWnFFQGLA9RE/V9gWLzaZn9S6VmQL3sGddqv06up10ktZqOWgHtOKTv49kA0YEmX6p1kNeg5Gx2qdjEXyLPvkWmPy+UXa27KOvVDHHLkcF+lwdrvxi+1sc+Azjfgz7gaPnGIWu2JM1y9qE6WjrG4KgkD77Uc6PBrPf5eA5wdaSAnYgabLGwJtO7LBo=
---

# 东航 App 签到（Surge 脚本）

## 文件说明
- ceair_capture.js：http-request 抓取脚本，捕获东航 App 签到请求并保存快照
- ceair_checkin.js：cron 定时脚本，每天重放保存的签到请求

## 配置方法
在 Surge 的配置文件中 [Script] 段添加：
[Script]
东航签到-捕获 = type=http-request,pattern=^https?:\/\/.*\/(sign|checkin|signin)([\/?]|$).*,requires-body=true,max-size=0,script-path=ceair_capture.js
东航签到-执行 = type=cron,cronexp=0 9 * * *,script-path=ceair_checkin.js

pattern 请按实际抓包得到的签到接口 URL 调整。

## 首次使用步骤
1. Surge 开启 MitM：设置 -> 通用 -> 安装并信任证书（iOS 还需在 设置-通用-关于本机-证书信任设置 中开启完全信任）
2. 打开 Surge 的 HTTP 抓包开关（MitM 生效后默认抓取）
3. 打开东航 App，进入签到页面手动签到一次
4. 若脚本匹配到签到请求，会弹出通知"已捕获签到请求"
5. 之后每天 9:00 由 cron 自动签到，结果以通知形式推送

## 注意事项
- 东航 App 接口存在 wasm 加密（请求头含 M-CEAIR-ENCRYPTED），本方案采用"原样重放真实请求"的方式规避手工构造参数的难题
- 若签到请求内含时间戳/随机数/签名等动态参数，重放会失败，只能等待接口简化或改用其他方案
- Token 过期后需重新打开 App 手动签到一次刷新快照
- 仅供个人学习研究，请遵守东航服务条款
*（内容由AI生成，仅供参考）*
