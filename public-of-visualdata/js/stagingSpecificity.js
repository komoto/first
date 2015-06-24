function setFavicon(fileName){
  $('<link/>')
  .attr({
    rel :"shortcut icon",
    href:"/img/" + fileName
    })
  .appendTo('head');
}

function specifyStage(url){
  if(url.indexOf("http://vdata.nikkei.com") >= 0){
    setFavicon("favicon.png");
      }
  else if (url.indexOf("localhost") >= 0 ) {
    setFavicon("lofav.png");
    document.title = "Local Host";
  }
  else{
    setFavicon("stfav.png");
    document.title = "Staging";
  }
}
