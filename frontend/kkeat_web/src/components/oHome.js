import { useState, useEffect } from "react";
// import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import  {useRouter} from 'next/router'

import { postLocation } from "../app/api/locationService";

import RandomBtn from "./RandomBtn";
import Loading from "./Loading";
import Info from "./Info";
import RandomTextAnimation from "./RandomTextAnimation";
import { render } from "react-dom";

function Home1() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const [loadingStartTime, setLoadingStartTime] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (currentLocation) {
      setLoadingStartTime(Date.now());
      setIsLoading(true);
      // console.log(currentLocation)
      postLocation(currentLocation, setIsLoading, setRestaurantInfo);
      // navigate("/loading");
    }
  }, [currentLocation]);

  useEffect(() => {
    if (!isLoading && loadingStartTime && Object.keys(restaurantInfo).length > 0) {
      const elapsedTime = Date.now() - loadingStartTime;
      const remainingTime = 3000 - elapsedTime;
      if (remainingTime <= 0) {
        router.push("/info");
      } else {
        const timer = setTimeout(() => {
          router.push("/info");
        }, remainingTime);
        return () => clearTimeout(timer); // Clean up the timer on component unmount
      }
    }
  }, [isLoading, loadingStartTime, restaurantInfo, router]);

  const renderRandomTextAnimations = (count) => {
    return Array.from({ length: count }, (_, index) => (
      <RandomTextAnimation key={index} />
    ));
  };

return(
  <div>
    {/* {renderRandomTextAnimations(5)} */}
    {/* <RandomBtn setCurrentLocation={setCurrentLocation} setIsLoading={setIsLoading} isMain={true} /> */}
    <p>ac</p>
  </div>
);
}

const Home = () => {
  return (
    <div>
      <p>ac</p>
    </div>
  );
};
//   return (
//     <>
//       <Routes>
//         <Route
//           path="/loading"
//           element={
//             <>
//               <Loading className="loading" />
//               {renderRandomTextAnimations(3)}
//             </>
//           }
//         />
//         <Route
//           path="/info"
//           element={
//             <Info
//               info={restaurantInfo}
//               setCurrentLocation={setCurrentLocation}
//               setIsLoading={setIsLoading}
//               currentLocation={currentLocation}
//             />
//           }
//         />
//         <Route
//           path="/"
//           element={
//             <>
//               <RandomBtn
//                 setCurrentLocation={setCurrentLocation}
//                 setIsLoading={setIsLoading}
//                 isMain={true}
//               />
//               {renderRandomTextAnimations(5)}
//             </>
//           }
//         />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </>
//   );
// }

export default Home;
