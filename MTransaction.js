var year = 2000;
var month = 1;
let saveDataKey = "";

//初期化処理
function infini(){
    //現在保存されている年、月を取得
    year = localStorage.getItem("year");
    month = localStorage.getItem("month");
    
    if(!year || !month){
        const today = new Date(); // 現在の日付と時刻を取得
        year = today.getFullYear(); // 年
        month = String(today.getMonth() + 1).padStart(2, '0'); // 月（0から始まるので+1）
        // 保存しておく
        localStorage.setItem("year", year);
        localStorage.setItem("month", month);    
    }
    
    //データ取得キーの保存
    saveDataKey = `${year}${month}savedata`;
    document.getElementById('CurrentDateTime').textContent = `---- year:${year} - month:${month} ----`;
}

//今日の日付を返却する関数
function getTodayDate() {
    const today1 = new Date(); // 現在の日付と時刻を取得
    const year1 = today1.getFullYear(); // 年
    const month1 = String(today.getMonth() + 1).padStart(2, '0'); // 月（0から始まるので+1）
    const day1 = String(today.getDate()).padStart(2, '0'); // 日

    return `${year1}-${month1}-${day1}`; // YYYY-MM-DD形式で返す
}

// JSONデータをテーブルに表示
function displayData() {
    // localStorageからデータを取得
    const value = localStorage.getItem(saveDataKey);
    if(value){
        const data = JSON.parse(value);
        let price = 0;
        //合計金額取得処理
        for(let i = 0;i < data.length;i++){
            if(data[i].IsEarning)
                price += parseFloat(data[i].Price) || 0;
            else{
                price -= parseFloat(data[i].Price) || 0;
            }
        }
    
        //レコードの追加
        const tableBody = document.getElementById('dataRows');
        tableBody.innerHTML = ""; // 古い行をクリア
        data.forEach(item => {
            const row = document.createElement('tr');
            // Idフィールドを除外してループ
            Object.entries(item).forEach(([key, value]) => {
                if (key === "Id") return; // Idだけをスキップ
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
        document.getElementById('realTimeMoneyAmount').innerText  = price;   

        //エラーハンドラー解消
        const errorElements = document.querySelectorAll('.error');

        errorElements.forEach(element => {
            element.classList.remove('error');
        });
    }
    //日付の更新
    document.getElementById('CurrentDateTime').textContent = `---- year:${year} - month:${month} ----`;
}

//エラーハンドラー
function errorHandler(_name, _price, _calendar,_Status){
        //インプットにデータが入っていない
        if(_name == ""){
            document.getElementById("output").textContent = "No Data...";
    
            const input_box = document.getElementById("Box_name");
            input_box.classList.add("error"); // エラー時に赤くする
            return true;
        }
        else if(_price == ""){
            document.getElementById("output").textContent = "No Data...";
    
            const input_box = document.getElementById("Box_price");
            input_box.classList.add("error"); // エラー時に赤くする
            return true;
        }
        else if(_calendar == ""){
            document.getElementById("output").textContent = "No Data...";
    
            const input_box = document.getElementById("calendar");
            input_box.classList.add("error"); // エラー時に赤くする
            return true;
        }
        else if(_Status == ""){
            document.getElementById("output").textContent = "No Data...";
    
            const input_box = document.getElementById("Status");
            input_box.classList.add("error"); // エラー時に赤くする
            return true;
        }
}

// レコード削除機能
function DeleteRecord(id) {
    const value = localStorage.getItem(saveDataKey);
    if (!value) return;

    let parsedData = JSON.parse(value);
    let record_id = parsedData.filter(item => item.Id === id);
    const records = parsedData.filter(item => item.Id !== id);
    if (!records) return;
    //レコード削除
    if(record_id[0].status === "temporary"){
        localStorage.setItem(saveDataKey, JSON.stringify(records));
        displayData();
    }
    else{
        //確認のポップアップを表示
        if (!confirm('Are you sure you want to delete data?')) {
            return;
        }
        localStorage.setItem(saveDataKey, JSON.stringify(records));
        displayData();
    }
}

//インプットボックスのクリア関数
function inputDataAllDelete(){
    // Clear input fields after saving
    document.getElementById("Box_name").value = "";
    document.getElementById("Box_price").value = "";
    document.getElementById("Box_isEarning").checked = false;
    document.getElementById("Status").value = "Set";
}

//saveボタンを押下
document.getElementById("saveButton").addEventListener("click", ()=>{
    
    //inputボックスの値を取得
    const data = {
        Id:Date.now(),
        Name : document.getElementById("Box_name").value,
        Price : document.getElementById("Box_price").value,
        Date : document.getElementById("calendar").value,
        IsEarning : document.getElementById("Box_isEarning").checked,
        status : document.getElementById("Status").value
    }

    //error handler
    if(errorHandler(data.Name, data.Price, data._calendar,data.status)){
        return;
    }
    
    //すでに保存しているデータの取得
    const value = localStorage.getItem(saveDataKey);
    
    //もしデータが入っているとき - 格納済みのデータとインプット内容を保存
    if(value){
        parsedData = JSON.parse(value);
        parsedData[parsedData.length] = data;
        localStorage.setItem(saveDataKey, JSON.stringify(parsedData));
        document.getElementById("output").textContent = "Data saved successfully!";
    }
    //データが入っていないとき - インプットの内容を保存
    else{
        localStorage.setItem(saveDataKey, JSON.stringify([data]));
        document.getElementById("output").textContent = "Data saved successfully!";
    }
    //インプットボックスをクリア
    inputDataAllDelete();

    displayData();
})

//すべて削除するボタンを押下
document.getElementById("deleteButton").addEventListener("click", ()=>{

    //確認のポップアップを表示
    if (!confirm('Are you sure you want to delete all data?')) {
        return;
    }
    localStorage.setItem(saveDataKey, "[]");
    document.getElementById("output").textContent = "All data deleted.";
    displayData();
})

//来月に移動
document.getElementById("nextMonth").addEventListener("click", ()=>{

    //来月をセット
    if(month === 12 || month === "12"){
        year = Number(year) + 1;
        month = 1;
    }
    else{
        month = Number(month) + 1;
    }

    // 保存する
    saveDataKey = `${year}${month}savedata`;
    localStorage.setItem("year", year);
    localStorage.setItem("month", month); 

    //更新
    document.getElementById("realTimeMoneyAmount").textContent = "";
    document.getElementById("dataRows").textContent = "";
    displayData();
})

//先月に移動
document.getElementById("backMonth").addEventListener("click", ()=>{

    //先月に移動
    if(month === 1 || month === "1"){
        year -= 1;
        month = 12;
    }
    else{
        month -= 1;
    }

    // 保存する
    saveDataKey = `${year}${month}savedata`;
    localStorage.setItem("year", year);
    localStorage.setItem("month", month); 

    //更新
    document.getElementById("realTimeMoneyAmount").textContent = "";
    document.getElementById("dataRows").textContent = "";
    displayData();
})

// 保存データの取得とページ読み込み時の表示
window.addEventListener("load", () => {
    infini();
    displayData();
});