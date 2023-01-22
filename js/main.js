//利用者ごとの設定値を入力してください。
const SPREAD_SHEET_ID = "テンプレートシートのIDを記載してください";
const CONF_SHEET_NAME = "予定"

const SPREAD_SHEET = SpreadsheetApp.openById(SPREAD_SHEET_ID);
const CONF_SHEET = SPREAD_SHEET.getSheetByName(CONF_SHEET_NAME);


//シートから取得_1
//-------------------------------------------------------------------
//LINE CHATBOTのアクセストークン情報
const ACCESS_TOKEN = SPREAD_SHEET.getRangeByName("チャンネルアクセストークン").getValue();

//テンプレートシート（月初めの登録の際に使用）
const TEMPLATE_SHEET_NAME_1 = SPREAD_SHEET.getRangeByName("テンプレートシート名_1").getValue();
const TEMPLATE_SHEET_NAME_2 = SPREAD_SHEET.getRangeByName("テンプレートシート名_2").getValue();

//入力範囲情報
const TEMPLATE_SHEET1_TEXT_COLOMUN_START = ConvertToNumber(SPREAD_SHEET.getRangeByName("実績シート入力列_start").getValue());
const TEMPLATE_SHEET1_TEXT_COLOMUN_END = ConvertToNumber(SPREAD_SHEET.getRangeByName("実績シート入力列_end").getValue());
const TEMPLATE_SHEET1_LINK_COLOMUN = ConvertToNumber(SPREAD_SHEET.getRangeByName("実績シート_リンク入力列").getValue());

const TEMPLATE_SHEET2_TEXT_COLOMUN = ConvertToNumber(SPREAD_SHEET.getRangeByName("レシートシート_入力列").getValue());


//現在日時情報から年、月を取得（入力シート有無の判定に利用）
const TODAY = new Date();
const YEAR = String(TODAY.getFullYear());
const MONTH = String(('0' + (TODAY.getMonth() + 1)).slice(-2));
const OUTPUT_MONTH = YEAR + MONTH;

//LINEからのメッセージを登録するシート
const OUTPUT_SHEET_NAME_1 = TEMPLATE_SHEET_NAME_1.replace('yyyyMM',OUTPUT_MONTH);

//LINEから送信された画像（OCRでテキスト化）を登録するシート
const OUTPUT_SHEET_NAME_2 = TEMPLATE_SHEET_NAME_2.replace('yyyyMM',OUTPUT_MONTH);

//画像を保存するフォルダ情報
const RECEIPT_ROOT_FOLDER_ID = SPREAD_SHEET.getRangeByName("画像フォルダID").getValue();
const RECEIPT_ROOT_FOLDER = DriveApp.getFolderById(RECEIPT_ROOT_FOLDER_ID);

const RECEIPT_FOLDER_ID = SPREAD_SHEET.getRangeByName("月別画像フォルダID").getValue();
const GRAPH_FOLDER_ID = SPREAD_SHEET.getRangeByName("グラフ画像フォルダID").getValue();

//グラフファイル名
const GRAPH_FILE_NAME = SPREAD_SHEET.getRangeByName("グラフ画像ファイル名").getValue();

//マニュアルのファイル情報
const MANUAL_FILE_ID = SPREAD_SHEET.getRangeByName("マニュアルファイルID").getValue();
//-------------------------------------------------------------------


//callback関数で利用
//-------------------------------------------------------------------
//確認テンプレート（JSON）
const CONFIRM_TEMPLATE = {"type": "template",
                           "altText": "this is a confirm template",
                           "template": {
                                        "type": "confirm",
                                        "text": "レシートを登録しますか?",
                                        "actions": [
                                                      {
                                                        "type": "message",
                                                        "label": "画像あり",
                                                        "text": "画像あり"
                                                      },
                                                      {
                                                        "type": "message",
                                                        "label": "画像なし",
                                                        "text": "画像なし"
                                                      }
                                                    ]
                                        }
                          };

  //リッチメニュー押下時の実行関数リスト
  const TEXT_MESSAGE_LIST = [{"message":"使い方" , "function_":outputManual},
                                      {"message":"支出項目" , "function_":outputCategotyList},
                                      {"message":"画像なし" , "function_":skipRegistRecipt},
                                      {"message":"支出明細" , "function_":outputExpenditureStatement},
                            ];
//-------------------------------------------------------------------


//シートから取得_2
//-------------------------------------------------------------------
  //入力シートが存在するか確認（1/1に登録時に1月の入力シートが存在するか確認）
  if(!SPREAD_SHEET.getSheetByName(OUTPUT_SHEET_NAME_1)){
    createMonthSheet();
  }

//登録内容の入力行用
let textId = SPREAD_SHEET.getRangeByName("シーケンス_テキスト").getValue();
let imageId = SPREAD_SHEET.getRangeByName("シーケンス_画像").getValue();

//入力シート
const OUTPUT_SHEET_1 = SPREAD_SHEET.getSheetByName(OUTPUT_SHEET_NAME_1);
const OUTPUT_SHEET_2 = SPREAD_SHEET.getSheetByName(OUTPUT_SHEET_NAME_2);

const ROW_START_1 = findRow(OUTPUT_SHEET_1,'ROW_START',1);
const ROW_END_1 = findRow(OUTPUT_SHEET_1,'ROW_END',1);

const ROW_START_2 = findRow(OUTPUT_SHEET_2,'ROW_START',1);
const ROW_END_2 = findRow(OUTPUT_SHEET_2,'ROW_END',1);

//家計簿の支出項目リスト
const CATEGORY_LIST = SPREAD_SHEET.getRangeByName("分類リスト").getValues().flat().filter(n => n!='');
//-------------------------------------------------------------------


//-------------------------------------------------------------------
//LineBotSdkをマウント
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
      let rowNo = String(ROW_START_1+imageId);
      let range1 = OUTPUT_SHEET_1.getRange(rowNo,TEMPLATE_SHEET1_LINK_COLOMUN);

      const sheetUrl = `#gid=${OUTPUT_SHEET_2.getSheetId()}&range=B${rowNo}`;
      const hlink = `=HYPERLINK("${sheetUrl}","レシート")`;
      range1.setValue(hlink);
      debug('end:OUTPUT_SHEET_1.setValue');

      debug('start:OUTPUT_SHEET_2.setValue');
      let range2 = OUTPUT_SHEET_2.getRange(rowNo,TEMPLATE_SHEET2_TEXT_COLOMUN);
      range2.setValue(text);
      debug('end:OUTPUT_SHEET_2.setValue');;

      addSequenceId('image',++imageId);

      bot.replyMessage(e, [bot.textMessage("レシートの登録が完了しました。")]);
    }
    if (e.message.type == "text") {
      debug('message.type=text');

      debug('start:processingMessage');
      let message  = (e.message.text);
      let value = message.split(/\n/);

      let function_;

      //実行関数の取得
      TEXT_MESSAGE_LIST.forEach(o => {
          if(value==o.message){
            function_= o.function_;
          }

       });

      if(function_!=null){
        debug(`start:${function_.name}`);

        //関数を実行し、返信メッセージを返す
        const messages = function_();

        bot.replyMessage(e, messages);
        debug('end:processingMessage');
        
      }else if(value.length == 1 && value == '画像あり'){
        bot.replyMessage(e, [bot.textMessage("画像を送信してください。")]);
        debug('end:processingMessage');
      
      }else if(value.length != 3){
        bot.replyMessage(e, [bot.textMessage("登録値は3行で入力ください。\n（分類、項目、金額）")]);
        debug('end:processingMessage');
        return;

      }else{
        let values = [value];

        //支出項目が存在しない場合
        if(!CATEGORY_LIST.includes(values[0][0])){
          values[0][0] = "その他";
        }

        debug('start:setValue');
        let rowNo = String(ROW_START_1+textId);
        let range = OUTPUT_SHEET_1.getRange(rowNo,TEMPLATE_SHEET1_TEXT_COLOMUN_START,1,TEMPLATE_SHEET1_TEXT_COLOMUN_END-TEMPLATE_SHEET1_TEXT_COLOMUN_START +1);

        range.setValues(values);
        debug('end:setValue');

        addSequenceId('text',++textId);
        
        bot.replyMessage(e, [bot.textMessage("テキストの登録が完了しました。")]);
        bot.pushMessage(e.source.userId, [CONFIRM_TEMPLATE]);
        debug('end:processingMessage');
      }
    }
    debug('end:callback')
  }catch(e){
    debug('error:callback');
    debug(e);
  }
};
//-------------------------------------------------------------------


//以下、callback関数で利用
//-------------------------------------------------------------------
function debug(value='デバッグテスト') {
  const sheet = SpreadsheetApp.openById(SPREAD_SHEET_ID);
  const ss = sheet.getSheetByName('logs');
  const date = new Date();
  const targetRow = ss.getLastRow() + 1;
  ss.getRange('A' + targetRow).setValue(date);
  ss.getRange('B' + targetRow).setValue(value);
}

function findRow(sheet,val,col){
  let lastRow=sheet.getDataRange().getLastRow(); //対象となるシートの最終行を取得

  for(let i=1;i<=lastRow;i++){
    if(sheet.getRange(i,col).getValue() === val){
      return i;
    }
  }
  return 0;
}

function ConvertToNumber(strCol) {  
  var iNum = 0;
  var temp = 0;
  
  strCol = strCol.toUpperCase();
  for (i = strCol.length - 1; i >= 0; i--) {
    temp = strCol.charCodeAt(i) - 64; // 現在の文字番号;
console.log(strCol.length - 1);                
      if(i != strCol.length - 1) {
      temp = (temp) * Math.pow(26,(i + 1));
console.log(temp);
    }
    iNum = iNum + temp
      console.log(iNum)
  }
  return iNum;
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
    const NAMED_RANGE_START = SPREAD_SHEET.getRangeByName("支出明細_範囲_start").getValue();
    const NAMED_RANGE_END = SPREAD_SHEET.getRangeByName("支出明細_範囲_end").getValue();
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
    addSequenceId('text',1);
    addSequenceId('image',1);
 
    //画像を保存するフォルダを作成
    const FOLDER_ITERATOR = RECEIPT_ROOT_FOLDER.getFoldersByName(OUTPUT_MONTH);
    let targetFolder;
    if (FOLDER_ITERATOR.hasNext()) {
      // 存在する場合
      targetFolder = FOLDER_ITERATOR.next();
    } else {
      // 存在しない場合
      targetFolder = RECEIPT_ROOT_FOLDER.createFolder(OUTPUT_MONTH);
    }

    SPREAD_SHEET.getRangeByName("月別画像フォルダID").setValue(targetFolder.getId());

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
//-------------------------------------------------------------------


//以下、TEXT_MESSAGE_LISTに格納
//-------------------------------------------------------------------
function outputExpenditureStatement(){
  debug('start:outputExpenditureStatement');
        debug('start:createImageFile');
        let charts = OUTPUT_SHEET_1.getCharts();
        let imageBlob = charts[0].getBlob().getAs('image/png').setName(GRAPH_FILE_NAME);
        
        //フォルダIDを指定して、フォルダを取得
        let folder = DriveApp.getFolderById(GRAPH_FOLDER_ID);
 
        //同名ファイル削除
        let itr = folder.getFilesByName(GRAPH_FILE_NAME);
        if( itr.hasNext() ) {
          //folder.removeFile(itr.next());
          itr.next().setTrashed(true);
        }
        //フォルダにcreateFileメソッドを実行して、ファイルを作成
        folder.createFile(imageBlob);
        debug('end:createImageFile');

        //ファイルURL取得
        let imageUrl=folder.getFilesByName(GRAPH_FILE_NAME).next().getDownloadUrl()+ "&access_token=" + ScriptApp.getOAuthToken();

        debug('end:outputExpenditureStatement');
        return [{ type: 'image', originalContentUrl:imageUrl , previewImageUrl:imageUrl }];
}

function outputCategotyList(){
        debug('start:outputCategotyList');
        debug(CATEGORY_LIST.join('\n'));
        debug('end:outputCategotyList');

        return [bot.textMessage(CATEGORY_LIST.join('\n'))];
}

function outputManual(){
        debug('start:outputManual');
        //ファイルURL取得
        let manualUrl=DriveApp.getFileById(MANUAL_FILE_ID).getDownloadUrl()+ "&access_token=" + ScriptApp.getOAuthToken();

        debug('end:outputManual');
        return [bot.textMessage(manualUrl)];
}

function skipRegistRecipt(){
  addSequenceId('image',++imageId);
  return [bot.textMessage("画像の登録をスキップしました。")];
}

function addSequenceId(idName,val){
        if(idName=='image'){
          debug('start:sequenceImageId');
          SPREAD_SHEET.getRangeByName("シーケンス_画像").setValue(val); 
          debug('end:sequenceImageId')
        }else if(idName=='text'){
          debug('start:sequenceTextId');
          SPREAD_SHEET.getRangeByName("シーケンス_テキスト").setValue(val);
          debug('end:sequenceTextId');
        }
}
//-------------------------------------------------------------------