

//�����̓��t��ԋp����֐�
function getTodayDate() {
    const today = new Date(); // ���݂̓��t�Ǝ������擾
    const year = today.getFullYear(); // �N
    const month = String(today.getMonth() + 1).padStart(2, '0'); // ���i0����n�܂�̂�+1�j
    const day = String(today.getDate()).padStart(2, '0'); // ��
    return `${year}-${month}-${day}`; // YYYY-MM-DD�`���ŕԂ�
}

// JSON�f�[�^���e�[�u���ɕ\��
function displayData(data) {
    const tableBody = document.getElementById('dataRows');
    tableBody.innerHTML = ""; // �Â��s���N���A
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

//�C���v�b�g�{�b�N�X�̃N���A�֐�
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

//save�{�^��������
document.getElementById("saveButton").addEventListener("click", ()=>{
    
    //input�{�b�N�X�̒l���擾
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
    
    //�f�[�^�ۑ�����
    if(data.Name != ""){

        //���łɕۑ����Ă���f�[�^�̎擾
        const value = localStorage.getItem("saveData");
        
        //�����f�[�^�������Ă���Ƃ� - �i�[�ς݂̃f�[�^�ƃC���v�b�g���e��ۑ�
        if(value){
            parsedData = JSON.parse(value);
            parsedData[parsedData.length] = data;
            localStorage.setItem("saveData", JSON.stringify(parsedData));
            displayData(parsedData);
            document.getElementById("output").textContent = "Data saved successfully!";
        }
        //�f�[�^�������Ă��Ȃ��Ƃ� - �C���v�b�g�̓��e��ۑ�
        else{
            localStorage.setItem("saveData", JSON.stringify([data]));
            displayData([data]);
            document.getElementById("output").textContent = "Data saved successfully!";
        }
        //�C���v�b�g�{�b�N�X���N���A
        inputDataAllDelete();
    }
    //�C���v�b�g�Ƀf�[�^�������Ă��Ȃ�
    else{
        document.getElementById("output").textContent = "No Data...";
    }
})

//�폜�{�^��������
document.getElementById("deleteButton").addEventListener("click", ()=>{

    //�m�F�̃|�b�v�A�b�v��\��
    if (!confirm('Are you sure you want to delete all data?')) {
        return;
    }
    localStorage.removeItem("saveData");
    document.getElementById("dataRows").innerHTML = "";
    document.getElementById("output").textContent = "All data deleted.";
})

//�ۑ��f�[�^�̎擾�ƃy�[�W�ǂݍ���
function loadTable(){
    // localStorage����f�[�^���擾
    const value = localStorage.getItem("saveData");
    const array = JSON.parse(value);
    // �f�[�^��\��
    displayData(array);
}

// �ۑ��f�[�^�̎擾�ƃy�[�W�ǂݍ��ݎ��̕\��
window.addEventListener("load", () => {
    loadTable();
});