import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


import requests

from config import Config


API_KEY = Config.SEARCH_API_KEY
CX = Config.SEARCH_ENGINE_ID


def google_search(query: str) -> list:
    search_url = f"https://www.googleapis.com/customsearch/v1"
    params = {"key": API_KEY, "cx": CX, "q": query, "num": 10}  # 只獲取前10個結果

    response = requests.get(search_url, params=params)
    if response.status_code != 200:
        print(f"Failed to retrieve search results, status code: {response.status_code}")
        return []

    search_results = []
    results = response.json().get("items", [])
    for item in results:
        link = item.get("link")
        if link and "openrice" in link:
            search_results.append(link)

    return search_results


def find_openrice_url(query: str) -> str:
    search_results = google_search(query)
    openrice_urls = [url for url in search_results if "openrice" in url]
    try:
        return openrice_urls[0]
    except IndexError:
        return None


if __name__ == "__main__":
    query = input("Enter a search query: ")
    openrice_urls = find_openrice_urls(query)
    if openrice_urls:
        print("OpenRice URLs found in the top search results:")
    else:
        print("No OpenRice URLs found in the top search results")
    print(openrice_urls)
