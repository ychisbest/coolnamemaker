from time import sleep
import requests
import os
import traceback

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
    return call_gemini_api(prompt)

def main():
    with open('data.txt', 'r+') as f:
        lines = f.readlines()
        if lines:
            line = lines[0]
            
            response = callai(line)
                
            # Save the response to a file
            if response:
                output_filename = f"output-{len(os.listdir('.')) + 1}.json"
                with open(output_filename, 'w', encoding='utf-8') as output_file:
                    output_file.write(response)
                print(f"Generated content saved to {output_filename}")
            else:
                print("Failed to generate content")
            
            f.writelines(lines[1:])
            
main()