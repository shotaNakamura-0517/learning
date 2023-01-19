function executeScriptC(){
    if(!(window.opener==null)){
        window.opener.alert_();
    }else{
        alert("メインウィンドウを認識できません");
    }
}