const WarikanResult = class {
    constructor(from , to , payment) {
      this.from = from
      this.to = to
      this.payment = payment
    }
  }

function warikan(paymentList){

    let sum = 0;
    let average = 0;
    let deviationList;
    let paymentMap = new Map();
    let resultMap = new Map();

    for (const elem of paymentList) {
        let value = elem.payment;
        sum += value;
        if(paymentMap.has(elem.member)){
            value += paymentMap.get(elem.member);
        }
        paymentMap.set(elem.member,value);
    }
    average = Math.round(sum / paymentMap.size);

    deviationList = calcDeviation(average,paymentMap)
    
    for (let elem1 of deviationList.takeMoneyMemberList) {
        let i = 0;
        let whileFlg = true;
        while(whileFlg && i < deviationList.giveMoneyMemberList.length){
            let calcResult = 0; 
            let payment = 0;     
            calcResult = elem1.payment - deviationList.giveMoneyMemberList[i].payment;

            if(calcResult > 0){
                elem1.payment = calcResult;
                payment = deviationList.giveMoneyMemberList[i].payment;
                deviationList.giveMoneyMemberList[i].payment = 0;
            }else{
                deviationList.giveMoneyMemberList[i].payment = - calcResult;
                payment = elem1.payment;
                whileFlg=false;
            }

            if(resultMap.has(deviationList.giveMoneyMemberList[i].member)){
                let arr = resultMap.get(deviationList.giveMoneyMemberList[i].member);
                let result = new WarikanResult(deviationList.giveMoneyMemberList[i].member ,elem1.member, payment)
                arr.push(result);
                resultMap.set(deviationList.giveMoneyMemberList[i].member,arr);
            }else{
                let arr = new Array();
                let result = new WarikanResult(deviationList.giveMoneyMemberList[i].member ,elem1.member, payment)
                arr.push(result);
                resultMap.set(deviationList.giveMoneyMemberList[i].member,arr);

            }

            i++;                  
        }
    }
    let entries = resultMap.entries();
    let j = 0;
    let mapSize = resultMap.size;
    let message='';
    let end = '\n';

    for (let entry of entries) {
      for(let i = 0; i < entry[1].length; i++){
          if(j == mapSize -1 && i == entry[1].length -1){
              end = '';
          }
          
          if(entry[1][i].payment !=0){
            message +=  entry[1][i].from + 'が' + entry[1][i].to + 'へ'+ entry[1][i].payment + '円支払う' + end; 
          }
      }
      j++;
    }
    return message == '' ? '精算なし':message;
}

function calcDeviation(average,paymentMap){
    let entries = paymentMap.entries();
    let takeMoneyMemberList = new Array();
    let giveMoneyMemberList = new Array();

    for (let entry of entries) {
        let deviation = entry[1] - average;
        if(deviation < 0){
            giveMoneyMemberList.push({"member":entry[0],"payment":- deviation});
        }else{
            takeMoneyMemberList.push({"member":entry[0],"payment":deviation});
        }
    }
    takeMoneyMemberList.sort((a,b)=>{
        if( a.payment < b.payment ){
            return -1;
        }else if( a.payment > b.payment ){
            return 1;
        } else{
            return 0;
        }
    });
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