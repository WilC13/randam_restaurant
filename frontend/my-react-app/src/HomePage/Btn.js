function Btn({setCurrentLocation}) {


 const getGeolocation = () => {
 
   if(navigator.geolocation)  {
 
     navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation({"lat": position.coords.latitude, "lng": position.coords.longitude});
     },
     () => {
       console.log('Unable to retrieve your location');
     });
   } else {
     console.log('Geolocation is not supproted by your broswer')
   } 
 }

  return (
    <>
      <button onClick={getGeolocation}>Get Location</button>
    </>
  );
}

export default Btn;
