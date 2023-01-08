//利用者ごとの設定値を入力してください。
const SPREAD_SHEET_ID = "テンプレートシートのIDを記載";
const CONF_SHEET_NAME = "予定"

const SPREAD_SHEET = SpreadsheetApp.openById(SPREAD_SHEET_ID);
const CONF_SHEET = SPREAD_SHEET.getSheetByName(CONF_SHEET_NAME);

//LINE CHATBOTのアクセストークン情報
const ACCESS_TOKEN = CONF_SHEET.getRange("C27").getValue();

//テンプレートシート（月初めの登録の際に使用）
const TEMPLATE_SHEET_NAME_1 = CONF_SHEET.getRange("C28").getValue();
const TEMPLATE_SHEET_NAME_2 = CONF_SHEET.getRange("C29").getValue();

const TODAY = new Date();
const YEAR = String(TODAY.getFullYear());
const MONTH = String(('0' + (TODAY.getMonth() + 1)).slice(-2));
const OUTPUT_MONTH = YEAR + MONTH;

//LINEからの入力内容を登録するシート
const OUTPUT_SHEET_NAME_1 = TEMPLATE_SHEET_NAME_1.replace('yyyyMM',OUTPUT_MONTH);

//LINEから送信された画像（OCRでテキスト化）を登録するシート
const OUTPUT_SHEET_NAME_2 = TEMPLATE_SHEET_NAME_2.replace('yyyyMM',OUTPUT_MONTH);

//画像を保存するフォルダ情報
const RECEIPT_ROOT_FOLDER_ID = CONF_SHEET.getRange("C34").getValue();
const RECEIPT_FOLDER_ID = CONF_SHEET.getRange("C33").getValue();
const GRAPH_FOLDER_ID = CONF_SHEET.getRange("C35").getValue();

//マニュアルのファイル情報
const MANUAL_FILE_ID = CONF_SHEET.getRange("C38").getValue();

  if(!SPREAD_SHEET.getSheetByName(OUTPUT_SHEET_NAME_1)){
    createMonthSheet();
  }

let textId = CONF_SHEET.getRange("C31").getValue();
let imageId = CONF_SHEET.getRange("C32").getValue();

const OUTPUT_SHEET_1 = SPREAD_SHEET.getSheetByName(OUTPUT_SHEET_NAME_1);
const OUTPUT_SHEET_2 = SPREAD_SHEET.getSheetByName(OUTPUT_SHEET_NAME_2);

const CATEGORY_LIST = SPREAD_SHEET.getRangeByName("分類リスト").getValues().flat().filter(n => n!='');
const MANUAL_STR = SPREAD_SHEET.getRangeByName("マニュアル").getValues().flat().join('');

const ROW_START_1 = findRow(OUTPUT_SHEET_1,'ROW_START',1);
const ROW_END_1 = findRow(OUTPUT_SHEET_1,'ROW_END',1);

const ROW_START_2 = findRow(OUTPUT_SHEET_2,'ROW_START',1);
const ROW_END_2 = findRow(OUTPUT_SHEET_2,'ROW_END',1);

debug('start:new LineBotSdk.client');
const bot = new LineBotSdk.client(ACCESS_TOKEN);
debug('end:new LineBotSdk.client');

//Main
function doPost(e) {
  debug('start:doPost');  
  bot.call(e, callback) 
  debug('end:doPost');  
};

//Line CHATBOTから通信時のコールバック関数
function callback(e) {
  debug('start:callback');
  try{
    if (e.message.type == "image") {
      debug('message.type=image');
      const replyUrl = "https://api-data.line.me/v2/bot/message/"+e.message.id+"/content";
      const options = { "headers" : { 'Authorization': 'Bearer ' + ACCESS_TOKEN } };
    
      debug('start:fetch');
      const blob = UrlFetchApp.fetch(replyUrl, options).getBlob();
      debug('end:fetch');

      debug('start:createImageFile');
      const driveOptions = { title: e.message.id, parents: [{id: RECEIPT_FOLDER_ID}] };
      const image = Drive.Files.insert(driveOptions, blob, { "ocr": true, "ocrLanguage": "ja" });
      debug('end:createImageFile');

      debug('start:getOcrText');
      const text = DocumentApp.openById(image.id).getBody().getText();
      debug('end:getOcrText');

      debug('start:OUTPUT_SHEET_1.setValue');
      let rowNo1 = String(imageId+ROW_START_1)
      let rangeValue1 = 'E' + rowNo1;
      let range1 = OUTPUT_SHEET_1.getRange(rangeValue1);
      const sheetUrl = `#gid=${OUTPUT_SHEET_2.getSheetId()}&range=B${rowNo1}`;
      const hlink = `=HYPERLINK("${sheetUrl}","レシート")`;
      range1.setValue(hlink);
      debug('end:OUTPUT_SHEET_1.setValue');

      debug('start:OUTPUT_SHEET_2.setValue');
      let rowNo2 = String(imageId+ROW_START_2)
      let rangeValue2 = 'B' + rowNo2;
      let range2 = OUTPUT_SHEET_2.getRange(rangeValue2);
      range2.setValue(text);
      debug('end:OUTPUT_SHEET_2.setValue');

      debug('start:sequenceImageId');
      CONF_SHEET.getRange("C32").setValue(++imageId); 
      debug('end:sequenceImageId')

      bot.replyMessage(e, [bot.textMessage("レシートの登録が完了しました。")]);
    }
    if (e.message.type == "text") {
      debug('message.type=text');

      debug('start:processingMessage');
      let message  = (e.message.text);
      let value = message.split(/\n/);

      if(value.length == 1 && value == '画像なし'){
        debug('start:sequenceImageId');
        CONF_SHEET.getRange("C32").setValue(++imageId); 
        debug('end:sequenceImageId')
        bot.replyMessage(e, [bot.textMessage("画像の登録をスキップしました。")]);
        debug('end:processingMessage');

      }else if(value.length == 1 && value == '使い方'){
        debug('start:outputManual');

        /*文字列で送信する場合
        bot.replyMessage(e, [bot.textMessage(MANUAL_STR)]);
        */

        //ファイルURL取得
        let manualUrl=DriveApp.getFileById(MANUAL_FILE_ID).getDownloadUrl()+ "&access_token=" + ScriptApp.getOAuthToken();
        bot.replyMessage(e, [bot.textMessage(manualUrl)]);        
        
        debug('end:outputManual');
        debug('end:processingMessage');

      }else if(value.length == 1 && value == '支出項目'){
        debug('start:outputCategotyList');
        debug(CATEGORY_LIST.join('\n'));
        bot.replyMessage(e, [bot.textMessage(CATEGORY_LIST.join('\n'))]);
        debug('end:outputCategotyList');
        debug('end:processingMessage');

      }else if(value.length == 1 && value == '支出明細'){
        debug('start:outputExpenditureStatement');

        /* 文字列で送信する場合
        let arr =SPREAD_SHEET.getRangeByName("支出明細_" + OUTPUT_MONTH).getValues().filter(n => n[2]!=0);
        bot.replyMessage(e, [bot.textMessage(arr.join("\n"))]);
        */

        debug('start:createImageFile');
        let charts = OUTPUT_SHEET_1.getCharts();
        let imageBlob = charts[0].getBlob().getAs('image/png').setName("chart_image.png");
         //フォルダIDを指定して、フォルダを取得
        let folder = DriveApp.getFolderById(GRAPH_FOLDER_ID);
 
        //同名ファイル削除
        let itr = folder.getFilesByName("chart_image.png");
        if( itr.hasNext() ) {
          folder.removeFile(itr.next());
        }
        //フォルダにcreateFileメソッドを実行して、ファイルを作成
        folder.createFile(imageBlob);
        debug('end:createImageFile');

        //ファイルURL取得
        let imageUrl=folder.getFilesByName("chart_image.png").next().getDownloadUrl()+ "&access_token=" + ScriptApp.getOAuthToken();
        bot.replyMessage(e, [bot.textMessage(imageUrl)]);        
        debug('end:outputExpenditureStatement');
        debug('end:processingMessage');
      }else if(value.length != 3){
        bot.replyMessage(e, [bot.textMessage("入力値は3行で入力ください。\n（分類、項目、金額）")]);
        debug('end:processingMessage');
        return;
      }else{
        let values = [value];

        //支出項目が存在しない場合
        if(!CATEGORY_LIST.includes(values[0][0])){
          values[0][0] = "その他"
        }

        debug('start:setValue');
        let rowNo = String(textId+ROW_START_1)
        let rangeValue = 'B' + rowNo + ':D' + rowNo;
        let range = OUTPUT_SHEET_1.getRange(rangeValue);
        range.setValues(values);
        debug('end:setValue');

        debug('start:sequenceTextId');
        CONF_SHEET.getRange("C31").setValue(++textId);
        debug('start:sequenceTextId');
        
        bot.replyMessage(e, [bot.textMessage("テキストの登録が完了しました。")]);
        debug('end:processingMessage');
      }
    }
    debug('end:callback')
  }catch(e){
    debug('error:callback');
    debug(e);
  }
};


//以下、callback関数で利用

function findRow(sheet,val,col){
  let lastRow=sheet.getDataRange().getLastRow(); //対象となるシートの最終行を取得

  for(let i=1;i<=lastRow;i++){
    if(sheet.getRange(i,col).getValue() === val){
      return i;
    }
  }
  return 0;
}

function debug(value='デバッグテスト') {
  const sheet = SpreadsheetApp.openById(SPREAD_SHEET_ID);
  const ss = sheet.getSheetByName('logs');
  const date = new Date();
  const targetRow = ss.getLastRow() + 1;
  ss.getRange('A' + targetRow).setValue(date);
  ss.getRange('B' + targetRow).setValue(value);
}

function createMonthSheet() {
  try{
    //logシートをリセット
    let logSheet = SPREAD_SHEET.getSheetByName('logs');
    logSheet.clear();
    debug("start:createMonthSheet");

    //コピー対象のシートを読み込む
    let baseSheet = SPREAD_SHEET.getSheetByName(TEMPLATE_SHEET_NAME_1);
    //コピー対象シートを同一のスプレッドシートにコピー
    let newsheet = baseSheet.copyTo(SPREAD_SHEET);
    //シートのリネーム
    newsheet.setName(OUTPUT_SHEET_NAME_1);
    newsheet.showSheet();

    //支出明細のセル範囲に名前を設定
    const NAMED_RANGE_START = CONF_SHEET.getRange("C36").getValue();;
    const NAMED_RANGE_END = CONF_SHEET.getRange("C37").getValue();;
    let rangeValue = NAMED_RANGE_START + ':' + NAMED_RANGE_END;
    let range = newsheet.getRange(rangeValue);
    SPREAD_SHEET.setNamedRange("支出明細_" + OUTPUT_MONTH,range);

    baseSheet = SPREAD_SHEET.getSheetByName(TEMPLATE_SHEET_NAME_2);
    //コピー対象シートを同一のスプレッドシートにコピー
    newsheet = baseSheet.copyTo(SPREAD_SHEET);
    //シートのリネーム
    newsheet.setName(OUTPUT_SHEET_NAME_2);
    newsheet.showSheet();

    //シーケンスをリセット
    CONF_SHEET.getRange("C31").setValue(1);
    CONF_SHEET.getRange("C32").setValue(1);

    //画像を保存するフォルダを作成
    const ROOT_FOLDER = DriveApp.getFolderById(RECEIPT_ROOT_FOLDER_ID);
    const FOLDER_ITERATOR = ROOT_FOLDER.getFoldersByName(OUTPUT_MONTH);
    let targetFolder;
    if (FOLDER_ITERATOR.hasNext()) {
      // 存在する場合
      targetFolder = FOLDER_ITERATOR.next();
    } else {
      // 存在しない場合
      targetFolder = ROOT_FOLDER.createFolder(OUTPUT_MONTH);
    }

    CONF_SHEET.getRange("C33").setValue(targetFolder.getId());

    debug("end:createMonthSheet");
  }catch(e){
    debug("error:createMonthSheet");
    debug(e);
    if(SPREAD_SHEET.getSheetByName(OUTPUT_SHEET_NAME_1)){
        let deleteSheet = SPREAD_SHEET.getSheetByName(OUTPUT_SHEET_NAME_1);
        SPREAD_SHEET.deleteSheet(deleteSheet);
        debug(OUTPUT_SHEET_NAME_1 + "シートを削除しました");
   }
    if(SPREAD_SHEET.getSheetByName(OUTPUT_SHEET_NAME_2)){
        let deleteSheet = SPREAD_SHEET.getSheetByName(OUTPUT_SHEET_NAME_2);
        SPREAD_SHEET.deleteSheet(deleteSheet);
        debug(OUTPUT_SHEET_NAME_2 + "シートを削除しました");
   }
  }
}