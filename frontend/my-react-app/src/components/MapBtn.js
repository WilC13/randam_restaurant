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
    <button
      type="button"
      className="btn btn-outline-success"
      onClick={openMap}
      style={{ display: "flex", alignItems: "center" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        className="bi bi-map"
        viewBox="0 0 16 16"
        style={{ marginRight: "0.2rem" }}
      >
        <path
          fillRule="evenodd"
          d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.5.5 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103M10 1.91l-4-.8v12.98l4 .8zm1 12.98 4-.8V1.11l-4 .8zm-6-.8V1.11l-4 .8v12.98z"
        ></path>
      </svg>
      <i>帶我去</i>
    </button>

    // <>

    //   <button onClick={openMap} className={className}>
    //     GO
    //   </button>
    // </>
  );
}

export default MapBtn;
