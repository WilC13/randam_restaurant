const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const searchOR = async (place_id, name, vicinity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orsearch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: `${name} ${vicinity}` , place_id}),
    });
    const data = await response.json();

    if (response.status === 200 && data.openrice_url) {
      return data.openrice_url;
    } else {
      return `https://www.google.com/search?q=${encodeURIComponent(
        name
      )}+${encodeURIComponent(vicinity)}`;
    }
  } catch (err) {
    console.error("err", err);
    return `https://www.google.com/search?q=${encodeURIComponent(
      name
    )}+${encodeURIComponent(vicinity)}`;
  }
};
