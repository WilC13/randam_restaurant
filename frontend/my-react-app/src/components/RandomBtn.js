import photo from "../assets/img/a.png";

function RandomBtn({ setCurrentLocation, setIsLoading }) {
  const getGeolocation = () => {
    setTimeout(() => {
      setIsLoading(true);
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
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        alert("Geolocation is not supproted by your broswer");
      }
    }, 500);
  };

  return (
    <div>
      <img
        src={photo}
        alt="Random"
        style={{ width: "auto", height: "100vh" }}
        onClick={getGeolocation}
      />
    </div>
  );
}

export default RandomBtn;
