import { useSpring, animated } from "@react-spring/web";

const NotFound = () => {
  // const springPropsOne = useSpring({
  //   from: { opacity: 0, transform: "translateY(-250px)" },
  //   to: { opacity: 1, transform: "translateY(0)" },
  //   config: { duration: 800 },
  // });

  const springPropsTwo = useSpring({
    from: { opacity: 0, transform: "translateY(-250px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 600 },
  });

  const springPropsThree = useSpring({
    from: { opacity: 0, transform: "translateY(-250px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 400 },
  });

  return (
    <div className="h-full w-full flex flex-row justify-center items-center font-Quicksand uppercase bg-zinc-100 pt-14">
      <div className="h-full w-7/12 flex flex-col justify-center items-center gap-2 pb-24">
        <animated.h1 style={springPropsTwo}>
          <h1
            className="text-9xl font-bold text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(to right, #6D6CAA, #6EC5D6)",
            }}
          >
            Oops !
          </h1>
        </animated.h1>
        <animated.h1
          className="text-3xl font-bold text-gray-500"
          style={springPropsTwo}
        >
          404 - page not found
        </animated.h1>
        <animated.p
          className="text-xl font-medium text-gray-400"
          style={springPropsThree}
        >
          the requested url badpage was not found on this server.
        </animated.p>
      </div>
    </div>
  );
};

export default NotFound;
