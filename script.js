// HTML'den eleman alma //

const form=document.querySelector(".top-banner form");
const input=document.querySelector(".top-banner input");
const msg=document.querySelector(".top-banner .msg");
const list=document.querySelector(".ajax-section .cities");
const apiKey= "b93d50a18284b2d03b8c9365ffb6b27d";

// Form gönderildiginde calısacak kodlar //

form.addEventListener("submit", (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini önler //

    // Kullanıcının girdiği şehiri alır //
    let inputVal=input.value;

    // Eğer şehir listesinde zaten bir şehir varsa kontrol et //

    const listItems= list.querySelectorAll(".ajax-section .city");
    const listItemsArray = Array.from(listItems);

    if(listItemsArray.length > 0){
        const filteredArray= listItemsArray.filter((el)=>{
            let content=el.querySelector(".city-name span").textContent.toLocaleLowerCase();
            return content == inputVal.toLocaleLowerCase();
        });

        if(filteredArray.length>0){
            //Eğer şehir zaten listeye eklenmişse kullanıcıyı uyar//
            msg.textContent= `Already ${filteredArray[0].querySelector(".city-name span").textContent} You know the weather of your city. `;
            form.reset();
            input.focus();
            return;
        }
    }

    // API'den hava durumu bilgilerini almak için istek gönder //

    const url= `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    fetch(url)
    .then((response) => response.json())
    .then((data) =>{
        const {main, name, sys, weather} = data;
        const icon = `https://iconscout.com/${weather[0] ["icon"]}.svg`;

        // Yeni bir liste öğesi oluştur ve havadurumu bilgilerini ekrana yerleştir //

        const li=document.createElement("li");
        li.classList.add("city");

        const markup= `
        <h2 class="city-name" data-name="${name}, ${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup> C</sup></div>
        <figure>
            <img class="city-icon" src="${icon}" alt="${weather [0]["description"]}/>
            <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
        `;

        li.innerHTML = markup;
        list.appendChild(li);
    }).catch(()=>{
        msg.textContent = "Please search for a valid city";
    });

    msg.textContent = "";
    form.reset();
    input.focus();

});