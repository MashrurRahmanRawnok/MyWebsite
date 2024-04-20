import requests
from bs4 import BeautifulSoup
import os

def download_js_file(url, filename):
    response = requests.get(url)
    with open(filename, 'wb') as f:
        f.write(response.content)

def main():
    with open('/home/mashrur/Documents/My Personal Website/client/src/Components/sample.html', 'r') as f:
        soup = BeautifulSoup(f, 'html.parser')
        scripts = soup.find_all('script', src=True)
        for i, script in enumerate(scripts):
            script_url = script["src"]
            js_filename = f'script_{i+1}.js'
            download_js_file(script_url, js_filename)
            print(f'Downloaded {script_url} as {js_filename}')

if __name__ == "__main__":
    main()