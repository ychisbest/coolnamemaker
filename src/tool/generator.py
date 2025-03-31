from time import sleep
import requests
import os
import traceback
import json

def call_gemini_api(prompt):
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent"
    api_key = "AIzaSyCcmhi5dWdx3iOVOMsQ0_NVoBarZlrR6NQ"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    data = {
        "contents": [{
            "parts":[{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "temperature": 0.7
        }
    }
    
    try:
        response = requests.post(
            f"{url}?key={api_key}",
            headers=headers, 
            json=data
        )
        response.raise_for_status()
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    except requests.exceptions.RequestException as e:
        print(f"Error calling Gemini API: {e}")
        return None
    


# 你预先定义的 AI 翻译函数
def callai(prompt):
    
    json=open('college-name-generator.json', 'r',encoding="utf-8").read()
    
    # 示例：请替换为你实际的 AI 调用逻辑
    prompt= f"""
你是站点生成器，负责生成站点的内容。请根据以下信息生成一个站点的内容：
{prompt}

你模仿下面的json内容格式:
{json}

"""
    return call_gemini_api(prompt).replace("```json", "").replace("```", "")

def main():
    while(True):
        with open('data.txt', 'r') as f:
            lines = f.readlines()
        if lines:
            line = lines[0]
            print(f"Processing line: {line.strip()}")
            response = callai(line)
                
            try:
                # Try to parse the response as JSON
                json_data = json.loads(response)
                
                # If parsing succeeds, save with slug as filename
                if 'slug' in json_data:
                    filename = f"{json_data['slug']}.json"
                else:
                    filename = "unnamed.json"
                
                with open(filename, 'w', encoding='utf-8') as f:
                    json.dump(json_data, f, ensure_ascii=False, indent=2)
                print(f"Successfully saved to {filename}")
                
            except json.JSONDecodeError:
                # If parsing fails, save the raw response to error.json
                with open('error.json', 'w', encoding='utf-8') as f:
                    f.write(response)
                print("Failed to parse JSON, saved response to error.json")
                break;
            
            if lines:
                with open('data.txt', 'w') as f:
                    f.writelines(lines[1:])
        else:
            break;
        sleep(20)  # Sleep for a while before checking again

main()
