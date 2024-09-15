function MapBtn({ location, data }) {
  const dir_url = "https://www.google.com/maps/dir/?api=1";
  const openMap = () => {
    const params = new URLSearchParams({
      origin: `${location.latitude},${location.longitude}`,
      destination: data.name,
      destination_place_id: data.place_id,
      travelmode: "walking",
    }).toString();
    window.open(`${dir_url}&${params}`);
  };
  return (
    <>
      <button onClick={openMap}>GO</button>
    </>
  );
}

export default MapBtn;
