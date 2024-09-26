
var repArray = [];

function searchRepository(){
    var userRes = document.getElementById("tag").value;
    const gitApi = `https://api.github.com/search/repositories?q=${userRes}`; // Search for user input repository

    fetch(gitApi,{   //Request from nominatim API to query the endpoit ( users location).
        method: 'GET',  //Search operatior that is used for data gaining.
        headers: {      // Expecting that the response will arrive in JSON format.
            'Accept' : 'application/json'
        }    
    })
    .then(response=> {
        if(!response.ok){
            if (response.status === 404) {
                throw new Error('404: Not Found');
            } else if (response.status === 500) {
                throw new Error('500: Internal Server Error');
            } else {
                throw new Error(`Error: ${response.status}`);
            }
        }
        return response.json()}) //Return the json response
        .then(data => {
           repArray = data.items;
        })
    document.querySelector('.message').style.display = 'flex';
    document.getElementById("result").innerHTML= "Wait a second";
    setTimeout(findMetrics, 2000);  //Wait for the search
    
}

function findMetrics(){
    for(let i=0; i<repArray.length; i++){
     
        const name = repArray[i].full_name;  // Get the name of the repository

        const radios = document.getElementsByName('gitSelect'); //Take the radio group
        var selection = ""; //Clear value
        
        for (const radio of radios) {
            if (radio.checked) {
                selection = radio.value; //Selected Radio Button
                break;
            }
        }

        const gitUrl = `https://api.github.com/repos/${name}/${selection}`;
        fetch(gitUrl,{  //Request from github API to query the endpoit ( users location).
          method: 'GET',  //Search operatior that is used for data gaining.
          headers: {      // Expecting that the response will arrive in JSON format.
              'Accept' : 'application/json'
          }    
      })
      .then(response=> {
          if(!response.ok){
              if (response.status === 404) {
                  throw new Error('404: Not Found');
              } else if (response.status === 500) {
                  throw new Error('500: Internal Server Error');
              
              } 
              else if(response.status===403){
                  throw new Error('403: Forbidden');
              }else {
                  throw new Error(`Error: ${response.status}`);
              }
          }
          return response.json()}) //Return the json response
          .then(data => {
             const commitBox =document.createElement('div');   //We dont know the number of repositories so we create it dynamically
             commitBox.innerHTML = JSON.stringify(data, null, 4); //Make the Json format more readale
             const nameBox = document.createElement('div');   // A new div that holds name of respository creator
             nameBox.innerHHTML = name;  // The nameBox div takes the full name of creator/repository

             document.getElementById("result").appendChild(nameBox);  //Show result in the modal
             document.getElementById("result").appendChild(commitBox); //Show result in the modal
          
          }).catch(error=>{
             document.getElementById("result").innerHTML = error // In case any error may happen  
              
          })
     
  }
  //open modal
  document.querySelector('.message').style.display='flex';
}
 //close modal 
 function closeModal(){
    document.querySelector('.message').style.display='none';
}
  