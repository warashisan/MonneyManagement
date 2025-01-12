var year = 2000;
var month = 1;
let saveDataKey = "";

//����������
function infini(){
    //���ݕۑ�����Ă���N�A�����擾
    year = localStorage.getItem("year");
    month = localStorage.getItem("month");
    
    if(!year || !month){
        const today = new Date(); // ���݂̓��t�Ǝ������擾
        year = today.getFullYear(); // �N
        month = String(today.getMonth() + 1).padStart(2, '0'); // ���i0����n�܂�̂�+1�j
        // �ۑ����Ă���
        localStorage.setItem("year", year);
        localStorage.setItem("month", month);    
    }
    
    //�f�[�^�擾�L�[�̕ۑ�
    saveDataKey = `${year}${month}savedata`;
    document.getElementById('CurrentDateTime').textContent = `---- year:${year} - month:${month} ----`;
}

//�����̓��t��ԋp����֐�
function getTodayDate() {
    const today1 = new Date(); // ���݂̓��t�Ǝ������擾
    const year1 = today1.getFullYear(); // �N
    const month1 = String(today.getMonth() + 1).padStart(2, '0'); // ���i0����n�܂�̂�+1�j
    const day1 = String(today.getDate()).padStart(2, '0'); // ��

    return `${year1}-${month1}-${day1}`; // YYYY-MM-DD�`���ŕԂ�
}

// JSON�f�[�^���e�[�u���ɕ\��
function displayData() {
    // localStorage����f�[�^���擾
    const value = localStorage.getItem(saveDataKey);
    if(value){
        const data = JSON.parse(value);
        let price = 0;
        //���v���z�擾����
        for(let i = 0;i < data.length;i++){
            if(data[i].IsEarning)
                price += parseFloat(data[i].Price) || 0;
            else{
                price -= parseFloat(data[i].Price) || 0;
            }
        }
    
        //���R�[�h�̒ǉ�
        const tableBody = document.getElementById('dataRows');
        tableBody.innerHTML = ""; // �Â��s���N���A
        data.forEach(item => {
            const row = document.createElement('tr');
            // Id�t�B�[���h�����O���ă��[�v
            Object.entries(item).forEach(([key, value]) => {
                if (key === "Id") return; // Id�������X�L�b�v
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });
    
            // �폜�{�^���ǉ�
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

        //�G���[�n���h���[����
        const errorElements = document.querySelectorAll('.error');

        errorElements.forEach(element => {
            element.classList.remove('error');
        });
    }
    //���t�̍X�V
    document.getElementById('CurrentDateTime').textContent = `---- year:${year} - month:${month} ----`;
}

//�G���[�n���h���[
function errorHandler(_name, _price, _calendar,_Status){
        //�C���v�b�g�Ƀf�[�^�������Ă��Ȃ�
        if(_name == ""){
            document.getElementById("output").textContent = "No Data...";
    
            const input_box = document.getElementById("Box_name");
            input_box.classList.add("error"); // �G���[���ɐԂ�����
            return true;
        }
        else if(_price == ""){
            document.getElementById("output").textContent = "No Data...";
    
            const input_box = document.getElementById("Box_price");
            input_box.classList.add("error"); // �G���[���ɐԂ�����
            return true;
        }
        else if(_calendar == ""){
            document.getElementById("output").textContent = "No Data...";
    
            const input_box = document.getElementById("calendar");
            input_box.classList.add("error"); // �G���[���ɐԂ�����
            return true;
        }
        else if(_Status == ""){
            document.getElementById("output").textContent = "No Data...";
    
            const input_box = document.getElementById("Status");
            input_box.classList.add("error"); // �G���[���ɐԂ�����
            return true;
        }
}

// ���R�[�h�폜�@�\
function DeleteRecord(id) {
    const value = localStorage.getItem(saveDataKey);
    if (!value) return;

    let parsedData = JSON.parse(value);
    let record_id = parsedData.filter(item => item.Id === id);
    const records = parsedData.filter(item => item.Id !== id);
    if (!records) return;
    //���R�[�h�폜
    if(record_id[0].status === "temporary"){
        localStorage.setItem(saveDataKey, JSON.stringify(records));
        displayData();
    }
    else{
        //�m�F�̃|�b�v�A�b�v��\��
        if (!confirm('Are you sure you want to delete data?')) {
            return;
        }
        localStorage.setItem(saveDataKey, JSON.stringify(records));
        displayData();
    }
}

//�C���v�b�g�{�b�N�X�̃N���A�֐�
function inputDataAllDelete(){
    // Clear input fields after saving
    document.getElementById("Box_name").value = "";
    document.getElementById("Box_price").value = "";
    document.getElementById("Box_isEarning").checked = false;
    document.getElementById("Status").value = "Set";
}

//save�{�^��������
document.getElementById("saveButton").addEventListener("click", ()=>{
    
    //input�{�b�N�X�̒l���擾
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
    
    //���łɕۑ����Ă���f�[�^�̎擾
    const value = localStorage.getItem(saveDataKey);
    
    //�����f�[�^�������Ă���Ƃ� - �i�[�ς݂̃f�[�^�ƃC���v�b�g���e��ۑ�
    if(value){
        parsedData = JSON.parse(value);
        parsedData[parsedData.length] = data;
        localStorage.setItem(saveDataKey, JSON.stringify(parsedData));
        document.getElementById("output").textContent = "Data saved successfully!";
    }
    //�f�[�^�������Ă��Ȃ��Ƃ� - �C���v�b�g�̓��e��ۑ�
    else{
        localStorage.setItem(saveDataKey, JSON.stringify([data]));
        document.getElementById("output").textContent = "Data saved successfully!";
    }
    //�C���v�b�g�{�b�N�X���N���A
    inputDataAllDelete();

    displayData();
})

//���ׂč폜����{�^��������
document.getElementById("deleteButton").addEventListener("click", ()=>{

    //�m�F�̃|�b�v�A�b�v��\��
    if (!confirm('Are you sure you want to delete all data?')) {
        return;
    }
    localStorage.setItem(saveDataKey, "[]");
    document.getElementById("output").textContent = "All data deleted.";
    displayData();
})

//�����Ɉړ�
document.getElementById("nextMonth").addEventListener("click", ()=>{

    //�������Z�b�g
    if(month === 12 || month === "12"){
        year = Number(year) + 1;
        month = 1;
    }
    else{
        month = Number(month) + 1;
    }

    // �ۑ�����
    saveDataKey = `${year}${month}savedata`;
    localStorage.setItem("year", year);
    localStorage.setItem("month", month); 

    //�X�V
    document.getElementById("realTimeMoneyAmount").textContent = "";
    document.getElementById("dataRows").textContent = "";
    displayData();
})

//�挎�Ɉړ�
document.getElementById("backMonth").addEventListener("click", ()=>{

    //�挎�Ɉړ�
    if(month === 1 || month === "1"){
        year -= 1;
        month = 12;
    }
    else{
        month -= 1;
    }

    // �ۑ�����
    saveDataKey = `${year}${month}savedata`;
    localStorage.setItem("year", year);
    localStorage.setItem("month", month); 

    //�X�V
    document.getElementById("realTimeMoneyAmount").textContent = "";
    document.getElementById("dataRows").textContent = "";
    displayData();
})

// �ۑ��f�[�^�̎擾�ƃy�[�W�ǂݍ��ݎ��̕\��
window.addEventListener("load", () => {
    infini();
    displayData();
});