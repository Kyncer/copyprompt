# app.py
from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup
from collections import Counter
import re

app = Flask(__name__)

def extract_keywords(url):
    try:
        # Send a GET request to the URL
        response = requests.get(url)
        response.raise_for_status()  # Raise an HTTPError for bad responses

        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract text content from the HTML
        text_content = ' '.join([p.get_text() for p in soup.find_all('p')])

        # Tokenize and count keywords using regular expression
        words = re.findall(r'\b\w+\b', text_content.lower())
        keyword_counts = Counter(words)

        # Extract top 10 keywords
        top_keywords = keyword_counts.most_common(10)

        # Directly return a JSON response as a simple list of strings
        return jsonify(keywords=[keyword[0] for keyword in top_keywords])
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return jsonify(error=f'Internal Server Error: {str(e)}')

@app.route('/', methods=['POST'])
def index():
    try:
        target_url = request.form['url']
        return extract_keywords(target_url)
    except Exception as e:
        return jsonify(error=f'Internal Server Error: {str(e)}')

if __name__ == '__main__':
    app.run(debug=True)
