function generateSubWindow(){
    document.formA.action="../html/subWindow.html";
    document.formA.target="_blank";
    //document.formA.rel="opener";
    document.formA.submit();
}