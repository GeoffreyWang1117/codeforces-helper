import os
import time
import cloudscraper
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

def fetch_real_pdf_url(contest_id, problem_letter):
    """使用 Selenium 访问题目页面，提取真正的 PDF 下载链接"""
    problem_url = f"https://codeforces.com/problemset/problem/{contest_id}/{problem_letter}"
    
    # 配置 Chrome Driver 选项（无头模式，不打开窗口）
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # 运行时不显示浏览器
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    service = Service("/path/to/chromedriver")  # 替换为你的 chromedriver 路径
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        driver.get(problem_url)
        time.sleep(3)  # 等待页面加载完成
        
        # 查找 <embed> 标签
        embed_tag = driver.find_element(By.TAG_NAME, "embed")
        pdf_url = embed_tag.get_attribute("src")

        if pdf_url and "about:blank" not in pdf_url:
            return f"https://codeforces.com{pdf_url}"

        print(f"[错误] 无法找到 PDF 下载链接，可能受到 Cloudflare 保护")
        return None
    except Exception as e:
        print(f"[错误] Selenium 解析 PDF URL 失败: {e}")
        return None
    finally:
        driver.quit()

def download_pdf(contest_id, problem_letter, save_dir):
    """模拟浏览器行为，解析 HTML 获取真正的 PDF URL 并下载"""
    pdf_url = fetch_real_pdf_url(contest_id, problem_letter)
    if not pdf_url:
        print(f"[跳过] 题目 {problem_letter} 的 PDF 下载失败")
        return

    pdf_save_path = os.path.join(save_dir, f"{problem_letter}.pdf")

    scraper = cloudscraper.create_scraper()
    response = scraper.get(pdf_url, stream=True)

    # 确保下载的是 PDF，而不是 Cloudflare 保护页面
    content_type = response.headers.get("Content-Type", "")
    if "application/pdf" not in content_type:
        print(f"[错误] 题目 {problem_letter} 的 PDF 无法下载，可能受到 Cloudflare 保护")
        return

    if response.status_code == 200:
        with open(pdf_save_path, 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
        print(f"[已下载] 题目 PDF -> {pdf_save_path}")
    else:
        print(f"[错误] 无法下载 PDF: {pdf_url}")

if __name__ == "__main__":
    contest_id = input("请输入 Codeforces 竞赛编号: ")
    problem_letter = input("请输入题目编号 (如 A, B, C...): ")
    save_dir = f"codeforces_contest_{contest_id}"
    os.makedirs(save_dir, exist_ok=True)
    download_pdf(contest_id, problem_letter, save_dir)