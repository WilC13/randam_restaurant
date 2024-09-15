const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const postLocation = async (
  location,
  setIsLoading,
  setRestaurantInfo
) => {
  console.log(location);
  setIsLoading(true);

  try {
    const res = await fetch(`${API_BASE_URL}/location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    });
    const data = await res.json();
    setRestaurantInfo(data.result);
  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};
