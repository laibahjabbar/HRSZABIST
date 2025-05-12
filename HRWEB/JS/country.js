const country_URL="https://vigilant-invention-4j654vqj669jfqrv-6006.app.github.dev/country";

fetch(country_URL).then(response=>{
    if(!response.ok)
        throw new Error("FAILED TO FETCH COUNTRY DATA")
    return response.json();
}).then(date=>{
    const tbody = document.querySelector("#countrytable tbody")

    date.forEach(country=>{
        const row = document.createElement("tr");
        row.innerHTML=`
        <td>${country.country_id}</td>
        <td>${country.country_name}</td>
        <td>${country.region_id}</td>
        `;
        tbody.appendChild(row);
    });    
}).catch(err=>{
    console.log(err.message);
})