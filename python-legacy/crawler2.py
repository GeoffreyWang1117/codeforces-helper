import os
import requests
import hashlib
import time
import random
import string
import cloudscraper
import re
from bs4 import BeautifulSoup

def read_api_credentials(file_path='secret.txt'):
    """读取API密钥和秘密"""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"未找到密钥文件：{file_path}")
    
    with open(file_path, 'r') as file:
        lines = file.readlines()
        key = lines[0].strip().split(': ')[1]
        secret = lines[1].strip().split(': ')[1]
    return key, secret

def generate_api_signature(api_method, api_key, api_secret, params):
    """生成API请求所需的签名"""
    rand = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    time_stamp = str(int(time.time()))
    
    sorted_params = sorted(params.items())
    param_str = '&'.join([f"{k}={v}" for k, v in sorted_params])
    to_sign = f"{rand}/{api_method}?{param_str}#{api_secret}"
    hash_value = hashlib.sha512(to_sign.encode('utf-8')).hexdigest()
    return rand + hash_value, time_stamp

def convert_html_to_markdown(html):
    """将 Codeforces 题目中的 HTML 公式转换为 Markdown 兼容的 LaTeX 语法"""
    soup = BeautifulSoup(html, "html.parser")
    
    # 处理 <sup> 上标
    for sup in soup.find_all("sup"):
        sup.string = f"^{sup.get_text()}"
    
    # 处理 <sub> 下标
    for sub in soup.find_all("sub"):
        sub.string = f"_{sub.get_text()}"
    
    # 处理 <i> 斜体（通常用于变量）
    for italic in soup.find_all("i"):
        italic.string = f"*{italic.get_text()}*"
    
    # 获取文本
    text = str(soup)
    
    # 处理 Codeforces 的 $$$...$$$ 公式，转换为 $...$
    text = re.sub(r"\$\$\$(.*?)\$\$\$", r"$\1$", text)
    
    # 处理 `\( ... \)` 和 `\[ ... \]`
    text = text.replace("\\(", "$").replace("\\)", "$")  # 行内公式
    text = text.replace("\\[", "$$").replace("\\]", "$$")  # 块级公式
    
    return text

def download_pdf(contest_id, problem_letter, save_dir):
    """模拟浏览器行为下载 PDF 文件"""
    pdf_url = f"https://codeforces.com/problemset/problem/{contest_id}/{problem_letter}.pdf"
    pdf_save_path = os.path.join(save_dir, f"{problem_letter}.pdf")
    
    scraper = cloudscraper.create_scraper()
    response = scraper.get(pdf_url, stream=True)
    if response.status_code == 200:
        with open(pdf_save_path, 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
        print(f"[已下载] 题目 PDF -> {pdf_save_path}")
    else:
        print(f"[错误] 无法下载 PDF: {pdf_url}")

def fetch_contest_problems(contest_id):
    """获取指定竞赛的题目信息"""
    api_method = 'contest.standings'
    api_url = f"https://codeforces.com/api/{api_method}"
    
    api_key, api_secret = read_api_credentials()
    
    params = {
        'contestId': contest_id,
        'apiKey': api_key,
        'time': int(time.time()),
        'from': 1,
        'count': 1  # 获取竞赛的题目信息
    }
    
    api_sig, time_stamp = generate_api_signature(api_method, api_key, api_secret, params)
    params['time'] = time_stamp
    params['apiSig'] = api_sig
    
    response = requests.get(api_url, params=params)
    print("API 响应:", response.json())  # 添加调试信息
    
    if response.status_code == 200:
        data = response.json()
        if data['status'] == 'OK':
            problems = data['result']['problems']
            return problems
        else:
            print(f"API返回错误: {data['comment']}")
    else:
        print(f"请求失败，状态码: {response.status_code}")
    return []

def download_codeforces_contest(contest_id):
    problems = fetch_contest_problems(contest_id)
    save_dir = f"codeforces_contest_{contest_id}"
    os.makedirs(save_dir, exist_ok=True)
    
    scraper = cloudscraper.create_scraper()
    
    for problem in problems:
        problem_letter = problem['index']
        url = f"https://codeforces.com/contest/{contest_id}/problem/{problem_letter}"
        response = scraper.get(url)
        
        if response.status_code != 200 or "Just a moment..." in response.text:
            print(f"[跳过] 题目 {problem_letter} 被 Cloudflare 保护，尝试下载 PDF...")
            download_pdf(contest_id, problem_letter, save_dir)
            continue
        
        soup = BeautifulSoup(response.text, "html.parser")
        statement_tag = soup.find("div", class_="problem-statement")
        
        if not statement_tag:
            print(f"[错误] 题目 {problem_letter} 解析失败，尝试下载 PDF...")
            download_pdf(contest_id, problem_letter, save_dir)
            continue
        
        title_tag = soup.find("div", class_="title")
        title = title_tag.text.strip() if title_tag else f"Problem {problem_letter}"
        statement = convert_html_to_markdown(statement_tag.get_text(separator="\n").strip())
        
        file_path = os.path.join(save_dir, f"{problem_letter}.md")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(f"# {title}\n\n")
            f.write(f"## 题目描述\n{statement}\n\n")
        
        print(f"[已保存] 题目 {problem_letter} -> {file_path}")
    
    print(f"✅ 竞赛 {contest_id} 题目下载完成，保存在 {save_dir}/")

if __name__ == "__main__":
    contest_id = input("请输入 Codeforces 竞赛编号: ")
    download_codeforces_contest(contest_id)