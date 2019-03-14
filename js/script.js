
var select = document.getElementById("selectreceipt"); 
var options = ["Iron Ingot", "Iron Plate", "Iron Rod", "Screws", "Reinforced Iron Plate", "Copper Ingot", "Wires", "Concrete", "Steel Ingot", "Steel Plate", "Steel Pipe"]; 

for(var i = 0; i < options.length; i++) 
{
    var opt = options[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

var btn_go = document.getElementById("calculate");
btn_go.addEventListener("click", caculate);

var value = ""; 
var permin = 0;
var beginpermin = 0;

function caculate()
{      
  selectedreceipt = document.getElementById("selectreceipt").value.toLowerCase(); 
  permin = document.getElementById("permin").value; 
  beginpermin = permin;
  fetch('./json/receipt.json')
    .then(function(response) 
    {
      return response.json();
    })
    .then(function(myJson) 
    {
      if(document.getElementById('options').getElementsByTagName("p").length > 0)
      {
        paragraphlength = document.getElementById('options').getElementsByTagName("p").length;
        var counter = paragraphlength;
        for(var i = 0; i < paragraphlength; i++)
        {
          var element = document.getElementById('options').getElementsByTagName("p")[(counter - 1)];
          document.getElementById('options').removeChild(element);
          counter = counter - 1;
        }   
      } 
      //console.log("----------------------Caculating started----------------------")
      requestedReceipt(selectedreceipt, permin, myJson)
    });
}

function requestedReceipt(selectedreceipt, permin, myJson)
{
  var receipts = myJson["receipts"];
      
  for(var i = 0; i < receipts.length; i++)
  {
      if(receipts[i].receipt == selectedreceipt)
      {
        for(var j = 0; j < receipts[i].ingredient.length; j++)
        {
          if(j > 0)
          {
            permin = beginpermin;
            var paragraph = document.createElement("p");        
            var text = document.createTextNode("----------------------Next ingredient----------------------");       
            paragraph.appendChild(text);                                
            document.getElementById('options').appendChild(paragraph);
            //console.log("----------------------Next ingredient----------------------")
          }
          var counter = 1;
          for(var k = receipts[i].producing[0].amountpermin; k < permin; k = k + receipts[i].producing[0].amountpermin)
          { 
            counter = counter + 1; 
          }  

          var paragraph = document.createElement("p");        
          var text = document.createTextNode("For getting " + permin + " " + receipts[i].receipt + " per min you need " + counter + " " + receipts[i].createdby);       
          paragraph.appendChild(text);                                
          document.getElementById('options').appendChild(paragraph);

          //console.log("For getting", permin, receipts[i].receipt, "per min you need", counter, receipts[i].createdby)  
          selectedreceipt = receipts[i].ingredient[j].name;
          permin = receipts[i].ingredient[j].amountpermin * counter;

          requestedReceipt(selectedreceipt, permin, myJson);
        }
      }
  }    
}