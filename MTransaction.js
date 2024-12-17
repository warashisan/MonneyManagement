

//�����̓��t��ԋp����֐�
function getTodayDate() {
    const today = new Date(); // ���݂̓��t�Ǝ������擾
    const year = today.getFullYear(); // �N
    const month = String(today.getMonth() + 1).padStart(2, '0'); // ���i0����n�܂�̂�+1�j
    const day = String(today.getDate()).padStart(2, '0'); // ��
    return `${year}-${month}-${day}`; // YYYY-MM-DD�`���ŕԂ�
}

// JSON�f�[�^���e�[�u���ɕ\��
function displayData() {

    // localStorage����f�[�^���擾
    const value = localStorage.getItem("saveData");
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
            Object.values(item).forEach(value => {
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
        document.getElementById('realTimeMoneyAmount').innerText  = `TotalAmount : ${price}`;   
    }
}

// ���R�[�h�폜�@�\
function DeleteRecord(id) {
    const value = localStorage.getItem("saveData");
    if (!value) return;

    let parsedData = JSON.parse(value);
    const records = parsedData.filter(item => item.Id !== id);
    document.getElementById("output").textContent = records;
    if (!records) return;
    //�m�F�̃|�b�v�A�b�v��\��
    if (!confirm('Are you sure you want to delete data?')) {
        return;
    }

    localStorage.setItem("saveData", JSON.stringify(records));
    displayData();
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
    const data ={
        Id:Date.now(),
        Name : document.getElementById("Box_name").value,
        Price : document.getElementById("Box_price").value,
        Date : document.getElementById("calendar").value,
        IsEarning : document.getElementById("Box_isEarning").checked,
        status : document.getElementById("Status").value
    }
    
    //�f�[�^�ۑ�����
    if(data.Name != ""){

        //���łɕۑ����Ă���f�[�^�̎擾
        const value = localStorage.getItem("saveData");
        
        //�����f�[�^�������Ă���Ƃ� - �i�[�ς݂̃f�[�^�ƃC���v�b�g���e��ۑ�
        if(value){
            parsedData = JSON.parse(value);
            parsedData[parsedData.length] = data;
            localStorage.setItem("saveData", JSON.stringify(parsedData));
            document.getElementById("output").textContent = "Data saved successfully!";
        }
        //�f�[�^�������Ă��Ȃ��Ƃ� - �C���v�b�g�̓��e��ۑ�
        else{
            localStorage.setItem("saveData", JSON.stringify([data]));
            document.getElementById("output").textContent = "Data saved successfully!";
        }
        //�C���v�b�g�{�b�N�X���N���A
        inputDataAllDelete();
    }
    //�C���v�b�g�Ƀf�[�^�������Ă��Ȃ�
    else{
        document.getElementById("output").textContent = "No Data...";
    }
    displayData();
})

//���ׂč폜����{�^��������
document.getElementById("deleteButton").addEventListener("click", ()=>{

    //�m�F�̃|�b�v�A�b�v��\��
    if (!confirm('Are you sure you want to delete all data?')) {
        return;
    }
    localStorage.setItem("saveData", "[]");
    document.getElementById("output").textContent = "All data deleted.";
    displayData();
})

// �ۑ��f�[�^�̎擾�ƃy�[�W�ǂݍ��ݎ��̕\��
window.addEventListener("load", () => {
    displayData();
});