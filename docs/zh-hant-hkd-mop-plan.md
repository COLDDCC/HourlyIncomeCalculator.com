# 繁體中文、港幣及澳門幣實施規格

## 已確認產品決策（2026-10-26）
- 採方案 A：單一 /zh-hant/ 繁體中文頁面，預設 HKD；額外支援 MOP。
- 語言切換保留已選貨幣、時薪及工時。貨幣切換不作匯率換算。
- 現金互動是品牌特色。HKD **優先使用真實紙幣及硬幣設計影像**，不要用抽象代幣或簡化示意圖代替；MOP 同樣優先使用真實影像。
- 優先產品功能及視覺品質，不因當前搜尋流量低而放棄現金可視化。

## 真實貨幣資產原則
- 優先採用香港金融管理局、官方發鈔銀行及澳門金融管理局公布之面額資料及實物圖；選定來源後記錄具體 URL、版權方、可使用條件。
- 香港金管局指明僅在電子設備展示鈔票影像，不需要為此向金管局申請實物複製許可；**但鈔票和硬幣圖案版權仍屬發行機構，不能把『免金管局核准』當作自動取得版權授權**。
- 澳門金管局指引對僅在電子螢幕顯示法定貨幣影像提供豁免，但發布來源與權利仍須確認。
- 若不能確認圖片的網站使用許可，不要偷用其他站圖，也不要以臨時佔位圖片發布；先完成計算與本地化，再在驗收前解決素材權利問題。
- 港幣流通紙幣 $10、$20、$50、$100、$500、$1000；硬幣 $10、$5、$2、$1、$0.5、$0.2、$0.1。$10 同時有紙幣與硬幣，演算法明確選擇展示優先次序。

## 技術工作
1. 更新 src/lib/i18n.js 的 zh-Hant 完整詞庫、語言名稱及語言路徑。
2. 更新 src/lib/market.js、src/lib/calculator.js 的 HKD、MOP、預設值、符號、貨幣切換與狀態保留。
3. 擴展 src/lib/cash.js、src/lib/currency-assets.js；每種面額提供可驗證真實素材與尺寸比例，零頭不能冒充流通硬幣。
4. 更新 CalculatorPage.astro 及 SEO hreflang、canonical、sitemap；避免繁簡頁面互相 canonical。
5. 更新 tests/international.test.js：全語言字典、貨幣精度、換零找續、語言切換保留輸入、全部圖像存在、所有 alternate 數量。
6. 執行構建、測試、手機版排版及現金桌拖放、分享與圖片保存驗收。

## 來源
- 香港金管局：https://www.hkma.gov.hk/eng/key-functions/money/hong-kong-currency/
- 香港金管局重製 FAQ：https://www.hkma.gov.hk/eng/smart-consumers/frequently-asked-questions/banking/p/P12
- 澳門金管局：https://www.amcm.gov.mo/en/currency/currency_reproduction

## 發布條件
只有當真實港幣圖片授權及載入、數值計算、SEO、多語言、測試全面通過才可合併 main。此規格文件本身不表示功能已完成。
