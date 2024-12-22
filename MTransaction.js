function ttt(text){
    if(text){
        
        document.getElementById("output").textContent = text;
    }
    else{
        document.getElementById("output").textContent ="--------------------";
    }
}

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
    
            // �ҏW�{�^���ǉ�
            const EditActionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = "Edit";
            editButton.className = "Edit-button";
            
            editButton.addEventListener('click', () => {
                editTableData(item.Id);
            });
            EditActionsCell.appendChild(editButton);
            row.appendChild(EditActionsCell);

            // �폜�{�^���ǉ�
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

        //���݂̏�������\��
        document.getElementById('realTimeMoneyAmount').innerText  = `TotalAmount : ${price}`;   

        //�G���[�n���h���[����
        const errorElements = document.querySelectorAll('.error');

        errorElements.forEach(element => {
            element.classList.remove('error');
        });
    }
}

//�G���[�n���h���[
function errorHandler(_name, _price, _calendar){
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
}

//�C���v�b�g�{�b�N�X�̃N���A�֐�
function inputDataAllDelete(){
    // Clear input fields after saving
    document.getElementById("Box_name").value = "";
    document.getElementById("Box_price").value = "";
    document.getElementById("Box_isEarning").checked = false;
    document.getElementById("Status").value = "Set";
}

//���R�[�h�ҏW
function editTableData(id){
    const value = localStorage.getItem("saveData");
    if (!value) return;
    let parsedData = JSON.parse(value);
    
    const records = parsedData.filter(item => item.Id === id);
    if(!records){
        alert("�Ώۂ̃��R�[�h��������܂���B");
        return;
    }

    let count = 0;

    const rows = document.querySelectorAll('tbody tr'); // �S�s���擾
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowId = parseInt(cells[0].textContent.trim());
        if(rowId === id){
            cells.forEach(cell => {
                const editButton = cell.querySelector('.Edit-button');
                const deleteButton = cell.querySelector('.Delete-button');
                if(editButton){
                    //�ҏW�{�^����ҏW�����{�^���ɒu������
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
                    
                    //input�{�b�N�X�̒l���擾
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

                //cell�ɓ��ꍞ�ޗp�̔��쐬
                const cellText = cell.textContent.trim();
                const cellInput = document.createElement('input');
                cellInput.type = 'text';
                cellInput.id = 'recordInput' + count;
                cellInput.value = cellText;
                count +=1;
                
                //cell�ɃZ�b�g
                cell.textContent = '';
                cell.appendChild(cellInput);
            });
        }
    });
}

// ���R�[�h�폜
function DeleteRecord(id) {
    const value = localStorage.getItem("saveData");
    if (!value) return;

    let parsedData = JSON.parse(value);
    const records = parsedData.filter(item => item.Id !== id);
    if (!records) return;
    //�m�F�̃|�b�v�A�b�v��\��
    if (!confirm('Are you sure you want to delete data?')) {
        return;
    }

    localStorage.setItem("saveData", JSON.stringify(records));
    displayData();
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
    if(errorHandler(data.Name, data.Price, data._calendar)){
        return;
    }
    
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