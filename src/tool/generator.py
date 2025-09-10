from time import sleep
import requests
import os
import traceback
import json

def call_openai_api(prompt):
    # url = "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
    # api_key="d9b9ca11-7273-4b7e-a8e6-a1518a5c02b4"
    # model="deepseek-v3-250324"
    
    s = requests.Session()
    s.trust_env = True  # 启用环境变量代理
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    api_key="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"
    model="google/gemini-2.5-flash"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": model,
        "messages": [
            {"role": "system", "content": """
             - reply in english
             - everything is for SEO
             """},
            {"role": "user", "content": prompt}
            ],
        "temperature": 0.7
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        print(response.json())
        return response.json()['choices'][0]['message']['content']
    except requests.exceptions.RequestException as e:
        print(f"Error calling OpenAI API: {e}")
        return None


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

你模仿下面的json内容格式,请保证结构和数据类型严格一致，内容可以随意修改。:
{json}

"""
    return call_openai_api(prompt).replace("```json", "").replace("```", "")

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
                sleep(20);
                continue;
            
            if lines:
                with open('data.txt', 'w') as f:
                    f.writelines(lines[1:])
        else:
            break;
        sleep(20)  # Sleep for a while before checking again

main()
