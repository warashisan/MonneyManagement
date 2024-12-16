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

        // 削除ボタン追加
        const actionsCell = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = "Delete";
        editButton.className = "Delete-button";
        editButton.addEventListener('click', () => {
            DeleteRecord(item.Id);
        });
        actionsCell.appendChild(editButton);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

// レコード削除機能
function DeleteRecord(id) {
    const value = localStorage.getItem("saveData");
    if (!value) return;

    let parsedData = JSON.parse(value);
    const records = parsedData.filter(item => item.Id !== id);
    document.getElementById("output").textContent = records;
    if (!records) return;
    //確認のポップアップを表示
    if (!confirm('Are you sure you want to delete data?')) {
        return;
    }

    localStorage.setItem("saveData", JSON.stringify(records));
    loadTable();
}

//インプットボックスのクリア関数
function inputDataAllDelete(){
    // Clear input fields after saving
    document.getElementById("Box_name").value = "";
    document.getElementById("Box_price").value = "";
    document.getElementById("Box_isEarning").checked = false;
    document.getElementById("Status").value = "Set";
}

//保存データの取得とページ読み込み
function loadTable(){
    // localStorageからデータを取得
    const value = localStorage.getItem("saveData");
    const array = JSON.parse(value);
    // データを表示
    displayData(array);
}

//saveボタンを押下
document.getElementById("saveButton").addEventListener("click", ()=>{
    
    //inputボックスの値を取得
    const data ={
        Id:Date.now(),
        Name : document.getElementById("Box_name").value,
        Price : document.getElementById("Box_price").value,
        Date : document.getElementById("calendar").value,
        IsEarning : document.getElementById("Box_isEarning").checked,
        status : document.getElementById("Status").value
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
    document.getElementById("output").textContent = "All data deleted.";
})

// 保存データの取得とページ読み込み時の表示
window.addEventListener("load", () => {
    loadTable();
    //すでに保存しているデータの取得
    const values = localStorage.getItem("saveData");
    let price = 0;
    //もしデータが入っているとき - 格納済みのデータとインプット内容を保存
    if(values){
        let parsedData = JSON.parse(values);
        for(let i = 0;i < parsedData.length;i++){
            if(parsedData[i].IsEarning)
                price += parseFloat(parsedData[i].Price) || 0;
            else{
                price -= parseFloat(parsedData[i].Price) || 0;
            }
        }
    document.getElementById("realTimeMoneyAmount").textContent = "Amount : " + price;
    }
});