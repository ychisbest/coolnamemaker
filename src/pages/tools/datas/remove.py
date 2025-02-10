import os
import json

# 获取当前文件夹中的所有json文件
current_directory = os.getcwd()
json_files = [f for f in os.listdir(current_directory) if f.endswith('.json')]

# 用一个字典来存储name字段的值及对应的文件名
name_dict = {}

# 记录需要删除的文件
files_to_delete = []

# 遍历所有json文件
for json_file in json_files:
    file_path = os.path.join(current_directory, json_file)
    
    # 打开并读取json文件
    with open(file_path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
            
            # 检查json文件中是否有"name"字段
            if 'name' in data:
                name_value = data['name']
                
                # 如果已经存在相同name字段的文件，记录需要删除的文件
                if name_value in name_dict:
                    files_to_delete.append(file_path)
                else:
                    # 否则将该name字段值存储
                    name_dict[name_value] = file_path
        except json.JSONDecodeError:
            print(f"文件 {json_file} 不是有效的JSON文件，跳过。")

# 提示用户是否删除重复文件
if files_to_delete:
    print("发现以下重复的文件：")
    for file_path in files_to_delete:
        print(file_path)

    user_input = input("是否删除这些文件？(y/n): ")
    
    if user_input.lower() == 'y':
        for file_path in files_to_delete:
            try:
                os.remove(file_path)
                print(f"已删除: {file_path}")
            except PermissionError:
                print(f"无法删除文件 (权限问题): {file_path}")
            except Exception as e:
                print(f"删除文件 {file_path} 时发生错误: {e}")
    else:
        print("未删除文件。")
else:
    print("没有发现重复文件。")
