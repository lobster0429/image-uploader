#安裝方式

```html
  <script src=`${your_path}/image-uploader.js`></script>
```
實際運作狀況可參考 `demo.html`

#使用方式
此套件設計遵從 jquey plugin 設計方法，使用以下方式執行

```html
<input class="your_input" id="your_name" name="your_name" type="text">

<script>
  $('.your_input').imageUploader();
</script>
```
目前只接受 text 與 hidden 兩種 input 使用

#參數與設定方式

參數設定提供兩種方法

*共用設定*：可直接傳入 plugin 內進行設定
```javascript
  const config = {
    width: '180px',
    height: '180px',
    format: 'jpeg, png',
  }
  $('your_input').imageUploader(config);
```

*個別設定*：可以針對個別 input ，除了 placeholder 屬性外，其餘用 data-attribute 進行設定
```html
<input class="your_input" id="your_name" placeholder="封面圖片" name="your_name" type="text" data-width="180px" data-height="180px" data-format="jpeg, png">
```

#參數

|參數名稱|資料類別|預設值|功能|
==============================
| width | String | 180px | 上傳區塊寬度，可接受 css 長度允許的所有值 |
| height | String | 180px | 上傳區塊高度，可接受 css 長度允許的所有值 |
| icon | String | fa-image | 中間圖標，來源為 Font Awesome  |
| color | String | #b2dcc8 | 上傳區塊文字及圖標顏色，可接受 css color 允許的所有值 |
| size | Number | null | 檢驗圖片容量上限，單位為KB |
| format | String | null | 檢驗圖片 MIME 格式，多個格式請以逗號分隔，範例：jpeg, png |
| ratio | String | null | 檢驗圖片的長寬比例，需傳入兩個數字，並以逗號分隔，範例：350,200 |
| placeholder | String | null | 顯示於上傳區塊的文字 |




