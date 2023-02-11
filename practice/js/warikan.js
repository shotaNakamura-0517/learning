const WarikanResult = class {
    constructor(from , to , payment) {
      this.from = from
      this.to = to
      this.payment = payment
    }
  }

  function warikan(paymentList){
    /*
    引数として、以下の形式の配列を想定
      [{"member":"A" ,"payment":5000},
        {"member":"B" ,"payment":5000},
        {"member":"C" ,"payment":0},
        {"member":"D" ,"payment":0},
        {"member":"C" ,"payment":0},
        {"member":"E" ,"payment":0
      ]
    */
    
        let sum = 0;
        let average = 0;
        let deviationList;
        let paymentMap = new Map();
        let resultMap = new Map();
    
        //memberの支払額を合計して格納
        for (const elem of paymentList) {
            let value = elem.payment;
            sum += value;
            if(paymentMap.has(elem.member)){
                value += paymentMap.get(elem.member);
            }
            paymentMap.set(elem.member,value);
        }
    
        average = Math.round(sum / paymentMap.size);
    
        //一人当たりの支払額(average)と支払い済の金額の差額を計算
        deviationList = calcDeviation(average,paymentMap)
        
        //支払い超過のmemberでloop
        for (let elem1 of deviationList.takeMoneyMemberList) {
            let i = 0;
            let whileFlg = true;
    
            //memberの支払い超過分が解消されるまでloop(誰に返してもらうか確定するまで)
            while(whileFlg && i < deviationList.giveMoneyMemberList.length){
                const elem2 = deviationList.giveMoneyMemberList[i];
                const resultMapKey = elem2.member;
                let resultMapValue;
                let result;
                let calcResult = 0; 
                let payment = 0;
                calcResult = elem1.payment - elem2.payment;
    
                if(calcResult > 0){
                //例）Aさん(1000円支払い超過) - Bさん(500円返済)の場合、true
                    //例）AさんがBさんに支払う金額を格納(返り値のメッセージ用)
                    payment = elem2.payment;
                    //例）Aさんの支払い超過額を更新
                    elem1.payment = calcResult;
                    //例）Bさんの返済額を更新(支払い終えているので0円)
                    elem2.payment = 0;
                }else{
                //例）Aさん(500円支払い超過) - Bさん(1000円返済)の場合、true
                    //例）AさんがBさんに支払う金額を格納(返り値のメッセージ用)
                    payment = elem1.payment;
                    //例）Bさんの返済額を更新(500円)
                    elem2.payment = - calcResult;
                    //例）Aさんは支払超過分を解消できたので次のmemberの処理に進む
                    whileFlg=false;
                }
    
                if(resultMap.has(resultMapKey)){
                    resultMapValue = resultMap.get(resultMapKey);
                }else{
                    resultMapValue = new Array();
                }
    
                result = new WarikanResult(resultMapKey ,elem1.member, payment)
                resultMapValue.push(result);
                resultMap.set(resultMapKey,resultMapValue);
    
                i++;                  
            }
        }
        let entries = resultMap.entries();
        let i = 0;
        let mapSize = resultMap.size;
        let message='';
        let end = '\n';
    
        //例）resultMapKeyでloop
        for (let entry of entries) {
          //MapValueの配列をloop(resultMapValue) 
          for(let j = 0; j < entry[1].length; j++){
              //最終行は行末に改行を追加しない
              if(i == mapSize -1 && j == entry[1].length -1){
                  end = '';
              }
              
              //「~が~に0円支払う」のメッセージは作成しない
              if(entry[1][j].payment !=0){
                message +=  entry[1][j].from + 'が' + entry[1][j].to + 'へ'+ entry[1][j].payment + '円支払う' + end; 
              }
          }
          i++;
        }
        return message == '' ? '精算なし':message;
    }
    
    function calcDeviation(average,paymentMap){
        let entries = paymentMap.entries();
        //支払い超過のmemberを格納
        let takeMoneyMemberList = new Array();
        //返済しなければいけないmemberを格納
        let giveMoneyMemberList = new Array();
    
        for (let entry of entries) {
            let deviation = entry[1] - average;
            if(deviation < 0){
                giveMoneyMemberList.push({"member":entry[0],"payment":- deviation});
            }else{
                takeMoneyMemberList.push({"member":entry[0],"payment":deviation});
            }
        }
        //降順でソート
        takeMoneyMemberList.sort((a,b)=>{
            if( a.payment > b.payment ){
                return -1;
            }else if( a.payment < b.payment ){
                return 1;
            } else{
                return 0;
            }
        });
      
        //降順でソート
        giveMoneyMemberList.sort((a,b)=>{
            if( a.payment > b.payment ){
                return -1;
            }else if( a.payment < b.payment ){
                return 1;
            } else{
                return 0;
            }
        });
    
        return{takeMoneyMemberList:takeMoneyMemberList,giveMoneyMemberList:giveMoneyMemberList};
    }
    


const data_ = [{"member":"A" ,"payment":5000},
                {"member":"B" ,"payment":5000},
                {"member":"C" ,"payment":100},
                {"member":"D" ,"payment":50},
                {"member":"C" ,"payment":0},
                {"member":"E" ,"payment":100}]

const resultMessage = warikan(data_);
console.log(resultMessage);