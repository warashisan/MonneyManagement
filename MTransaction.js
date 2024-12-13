

//今日の日付を返却する関数
function getTodayDate() {
    const today = new Date(); // 現在の日付と時刻を取得
    const year = today.getFullYear(); // 年
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 月（0から始まるので+1）
    const day = String(today.getDate()).padStart(2, '0'); // 日
    return `${year}-${month}-${day}`; // YYYY-MM-DD形式で返す
}

// JSONデータをテーブルに表示
function displayData(data) {
    const tableBody = document.getElementById('dataRows');
    tableBody.innerHTML = ""; // 古い行をクリア
    data.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}

//インプットボックスのクリア関数
function inputDataAllDelete(){
    // Clear input fields after saving
    document.getElementById("Box_name").value = "";
    document.getElementById("Box_price").value = "";
    document.getElementById("Box_isEarning").checked = false;
    document.getElementById("Box_beforePrice").value = "";
    document.getElementById("Box_resultPrice").value = "";
    document.getElementById("Box_from").value = "";
    document.getElementById("Box_to").value = "";
}

//saveボタンを押下
document.getElementById("saveButton").addEventListener("click", ()=>{
    
    //inputボックスの値を取得
    const data ={
        Id:Date.now(),
        Name : document.getElementById("Box_name").value,
        Price : document.getElementById("Box_price").value,
        Date : getTodayDate(),
        IsEarning : document.getElementById("Box_isEarning").checked,
        BeforePrice : document.getElementById("Box_beforePrice").value,
        ResultPrice : document.getElementById("Box_resultPrice").value,
        from : document.getElementById("Box_from").value,
        to : document.getElementById("Box_to").value,
    }
    
    //データ保存処理
    if(data.Name != ""){

        //すでに保存しているデータの取得
        const value = localStorage.getItem("saveData");
        
        //もしデータが入っているとき - 格納済みのデータとインプット内容を保存
        if(value){
            parsedData = JSON.parse(value);
            parsedData[parsedData.length] = data;
            localStorage.setItem("saveData", JSON.stringify(parsedData));
            displayData(parsedData);
            document.getElementById("output").textContent = "Data saved successfully!";
        }
        //データが入っていないとき - インプットの内容を保存
        else{
            localStorage.setItem("saveData", JSON.stringify([data]));
            displayData([data]);
            document.getElementById("output").textContent = "Data saved successfully!";
        }
        //インプットボックスをクリア
        inputDataAllDelete();
    }
    //インプットにデータが入っていない
    else{
        document.getElementById("output").textContent = "No Data...";
    }
})

//削除ボタンを押下
document.getElementById("deleteButton").addEventListener("click", ()=>{

    //確認のポップアップを表示
    if (!confirm('Are you sure you want to delete all data?')) {
        return;
    }
    localStorage.removeItem("saveData");
    document.getElementById("dataRows").innerHTML = "";
    document.getElementById("output").textContent = "All data deleted.";
})

//保存データの取得とページ読み込み
function loadTable(){
    // localStorageからデータを取得
    const value = localStorage.getItem("saveData");
    const array = JSON.parse(value);
    // データを表示
    displayData(array);
}

// 保存データの取得とページ読み込み時の表示
window.addEventListener("load", () => {
    loadTable();
});