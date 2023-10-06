const ComponentsDetail = () => {
  return (
    <>
      <div
        className="poster"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})`,
        }}
      ></div>
    </>
  );
};

export default ComponentsDetail
