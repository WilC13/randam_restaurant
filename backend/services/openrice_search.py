# import sys
# import os

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


import requests
from typing import Optional

from config import Config
from .firebase_service import fetch_url, save_url


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


def find_openrice_url(place_id: str, query: str) -> Optional[str]:
    def save_and_return_url(url: str) -> str:
        save_url(place_id, url)
        return url
    
    url = fetch_url(place_id)
    if url:
        return url
    
    search_results = google_search(query)
    openrice_urls = [url for url in search_results if "openrice" in url]

    # Prioritize URLs containing "zh/hongkong"
    for link in openrice_urls:
        if "zh/hongkong" in link:
            return save_and_return_url(link)

    # If not found, return URLs containing "zh-cn/hongkong"
    for link in openrice_urls:
        if "zh-cn/hongkong" in link:
            return save_and_return_url(link)
    
    #No OpenRice URL found
    return None


if __name__ == "__main__":
    place_id = "ChIJEQQy_k8ABDQRiAbRcmP_Y68"
    query = "滿貫廳 wong nai chung road, happy valley"

    openrice_urls = find_openrice_url(place_id, query)
    if openrice_urls:
        print("OpenRice URLs found in the top search results:")
    else:
        print("No OpenRice URLs found in the top search results")
    print(openrice_urls)
