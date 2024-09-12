function RandomBtn({ setCurrentLocation }) {
  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          alert(err.message);
        }
      );
    } else {
      alert("Geolocation is not supproted by your broswer");
    }
  };

  return (
    <>
      <button onClick={getGeolocation}>Get Location</button>
    </>
  );
}

export default RandomBtn;
