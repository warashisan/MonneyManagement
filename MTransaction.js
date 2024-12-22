function ttt(text){
    if(text){
        
        document.getElementById("output").textContent = text;
    }
    else{
        document.getElementById("output").textContent ="--------------------";
    }
}

//今日の日付を返却する関数
function getTodayDate() {
    const today = new Date(); // 現在の日付と時刻を取得
    const year = today.getFullYear(); // 年
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 月（0から始まるので+1）
    const day = String(today.getDate()).padStart(2, '0'); // 日
    return `${year}-${month}-${day}`; // YYYY-MM-DD形式で返す
}

// JSONデータをテーブルに表示
function displayData() {

    // localStorageからデータを取得
    const value = localStorage.getItem("saveData");
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
            Object.values(item).forEach(value => {
                    const cell = document.createElement('td');
                    cell.textContent = value;
                    row.appendChild(cell);
            });
    
            // 編集ボタン追加
            const EditActionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = "Edit";
            editButton.className = "Edit-button";
            
            editButton.addEventListener('click', () => {
                editTableData(item.Id);
            });
            EditActionsCell.appendChild(editButton);
            row.appendChild(EditActionsCell);

            // 削除ボタン追加
            const deleteActionCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete";
            deleteButton.className = "Delete-button";
            
            deleteButton.addEventListener('click', () => {
                DeleteRecord(item.Id);
            });
            deleteActionCell.appendChild(deleteButton);
            row.appendChild(deleteActionCell);
    
            tableBody.appendChild(row);
        });

        //現在の所持金を表示
        document.getElementById('realTimeMoneyAmount').innerText  = `TotalAmount : ${price}`;   

        //エラーハンドラー解消
        const errorElements = document.querySelectorAll('.error');

        errorElements.forEach(element => {
            element.classList.remove('error');
        });
    }
}

//エラーハンドラー
function errorHandler(_name, _price, _calendar){
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
}

//インプットボックスのクリア関数
function inputDataAllDelete(){
    // Clear input fields after saving
    document.getElementById("Box_name").value = "";
    document.getElementById("Box_price").value = "";
    document.getElementById("Box_isEarning").checked = false;
    document.getElementById("Status").value = "Set";
}

//レコード編集
function editTableData(id){
    const value = localStorage.getItem("saveData");
    if (!value) return;
    let parsedData = JSON.parse(value);
    
    const records = parsedData.filter(item => item.Id === id);
    if(!records){
        alert("対象のレコードが見つかりません。");
        return;
    }

    let count = 0;

    const rows = document.querySelectorAll('tbody tr'); // 全行を取得
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowId = parseInt(cells[0].textContent.trim());
        if(rowId === id){
            cells.forEach(cell => {
                const editButton = cell.querySelector('.Edit-button');
                const deleteButton = cell.querySelector('.Delete-button');
                if(editButton){
                    //編集ボタンを編集完了ボタンに置き換え
                    const compliteButton = document.createElement('button');
                    compliteButton.textContent = "Complite";
                    compliteButton.className = "Complite-button";

                    cell.removeChild(editButton);
                    cell.appendChild(compliteButton);

                    compliteButton.addEventListener('click', () => {
                        const name = document.getElementById("recordInput1").value;
                        const price = document.getElementById("recordInput2").value;
                        const date = document.getElementById("recordInput3").value;
                        const IsEarning = document.getElementById("recordInput4").value;
                        const status = document.getElementById("recordInput5").value;
                    
                    //inputボックスの値を取得
                    const data = {
                        Id : id,
                        Name : document.getElementById("recordInput1").value,
                        Price : document.getElementById("recordInput2").value,
                        Date : document.getElementById("recordInput3").value,
                        IsEarning : document.getElementById("recordInput4").checked,
                        status : document.getElementById("recordInput5").value
                    }
                        
                        const tempRecord = [{}];
                        records.forEach(record =>{
                            if(record.id === parseInt(id)){
                                tempRecord[tempRecord.length] = data;
                            }
                            else{
                                tempRecord[tempRecord.length] = record;
                            }
                        });

                        ttt(records);

                        localStorage.setItem("saveData", JSON.stringify(records));
                        displayData();
                    });
                    return;
                }
                if(deleteButton)return;
                if(count === 0){
                    count +=1;
                    return;
                };

                //cellに入れ込む用の箱作成
                const cellText = cell.textContent.trim();
                const cellInput = document.createElement('input');
                cellInput.type = 'text';
                cellInput.id = 'recordInput' + count;
                cellInput.value = cellText;
                count +=1;
                
                //cellにセット
                cell.textContent = '';
                cell.appendChild(cellInput);
            });
        }
    });
}

// レコード削除
function DeleteRecord(id) {
    const value = localStorage.getItem("saveData");
    if (!value) return;

    let parsedData = JSON.parse(value);
    const records = parsedData.filter(item => item.Id !== id);
    if (!records) return;
    //確認のポップアップを表示
    if (!confirm('Are you sure you want to delete data?')) {
        return;
    }

    localStorage.setItem("saveData", JSON.stringify(records));
    displayData();
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
    if(errorHandler(data.Name, data.Price, data._calendar)){
        return;
    }
    
    //すでに保存しているデータの取得
    const value = localStorage.getItem("saveData");
    
    //もしデータが入っているとき - 格納済みのデータとインプット内容を保存
    if(value){
        parsedData = JSON.parse(value);
        parsedData[parsedData.length] = data;
        localStorage.setItem("saveData", JSON.stringify(parsedData));
        document.getElementById("output").textContent = "Data saved successfully!";
    }
    //データが入っていないとき - インプットの内容を保存
    else{
        localStorage.setItem("saveData", JSON.stringify([data]));
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
    localStorage.setItem("saveData", "[]");
    document.getElementById("output").textContent = "All data deleted.";
    displayData();
})

// 保存データの取得とページ読み込み時の表示
window.addEventListener("load", () => {
    displayData();
});