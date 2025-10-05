import { useSpring, animated } from "@react-spring/web";
import useDarkMode from "../store/UseDarkMode.js";

const NotFound = () => {
  // const springPropsOne = useSpring({
  //   from: { opacity: 0, transform: "translateY(-250px)" },
  //   to: { opacity: 1, transform: "translateY(0)" },
  //   config: { duration: 800 },
  // });
  const { darkMode } = useDarkMode();

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
    <div className="h-full w-full flex flex-row justify-center items-center font-Quicksand uppercase bg-white dark:bg-dark-100 pt-14">
      <div className="h-full w-7/12 flex flex-col justify-center items-center gap-2 pb-24">
        <animated.h1 style={springPropsTwo}>
          <h1
            className="text-9xl font-bold text-transparent bg-clip-text"
            style={{
              backgroundImage: darkMode
                ? "linear-gradient(to right, #9897c6, #94d2e0"
                : "linear-gradient(to right, #6D6CAA, #6EC5D6)",
            }}
          >
            Oops !
          </h1>
        </animated.h1>
        <animated.h1
          className="text-3xl font-bold text-dark-100 dark:text-white"
          style={springPropsTwo}
        >
          404 - page not found
        </animated.h1>
        <animated.p
          className="text-xl font-medium text-dark-100 dark:text-white"
          style={springPropsThree}
        >
          the requested url badpage was not found on this server.
        </animated.p>
      </div>
    </div>
  );
};

export default NotFound;
