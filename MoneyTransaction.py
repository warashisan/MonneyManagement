import json

# 初期データ
data = [
    {
        "ID": 1,
        "Name": "Pro,
        "Price": 10000,
        "Date": "2024-12-11T12:00:00Z",
        "IsEarning": True,
        "BeforePrice": 1500,
        "ResultPrice": 11500,
        "from": "Warehouse A",
        "to": "Store B"
    },
    {
        "ID": 2,
        "Name": "Product B",
        "Price": 1500,
        "Date": "2024-12-10T15:30:00Z",
        "IsEarning": False,
        "BeforePrice": 3000,
        "ResultPrice": 1500,
        "from": "Warehouse B",
        "to": "Store C"
    }
]

# Create: 新しいデータを追加
def create_entry(new_entry):
    new_entry["ID"] == max(item["ID"] for item in data) + 1
    data.append(new_entry)
    return new_entry

# Read: データを取得（IDで検索）
def read_entry(entry_id):
    if entry_id == "" or entry_id = 0
        return data
    else:
        for entry in data:
            if entry["ID"] == entry_id:
                return entry
    return None

# Update: データを更新
def update_entry(entry_id, updated_fields):
    for entry in data:
        if entry["ID"] == entry_id:
            entry.update(updated_fields)
            return entry
    return None

# Delete: データを削除
def delete_entry(entry_id):
    global data
    data = [entry for entry in data if entry["ID"] != entry_id]
    return True
