import clsx from "clsx";

import data from "./data.json";

function getWeekNumber(d: Date) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

function parseWeekPlan(weekPlan: string): { [key: string]: string } {
  const weekPlanArray = weekPlan.split(" ");

  // Rest of the array, but the last one
  const restOfTheArray = weekPlanArray.slice(0, weekPlanArray.length - 1);

  var init: string[][] = [];
  const chunkedArray = restOfTheArray.reduce((resultArray, item: string, index) => {
    const chunkIndex = Math.floor(index / 2);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, init);

  return {
    1: chunkedArray[0].join(" "),
    2: chunkedArray[1].join(" "),
    3: chunkedArray[2].join(" "),
    4: chunkedArray[3].join(" "),
    5: chunkedArray[4].join(" "),
    6: chunkedArray[5].join(" "),
    0: weekPlanArray[weekPlanArray.length - 1], // last index for Sunday
  };
}

function getDayName(dayNumber: string) {
  switch (dayNumber) {
    case "1":
      return "Mon";
    case "2":
      return "Tue";
    case "3":
      return "Wed";
    case "4":
      return "Thu";
    case "5":
      return "Fri";
    case "6":
      return "Sat";
    case "0":
      return "Sun";
    default:
      return "Unknown";
  }
}


function WeightLiftingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10l-4-4m0 0l-4 4m4-4v18m6-18l-4-4m0 0l-4 4m4-4v18M3 21h18M3 10h18"
      />
    </svg>
  );
}

function App() {

  const weekNumber = 3 //getWeekNumber(new Date())[1];
  console.log('weekNumber:', weekNumber)

  // Check for week number overflow
  if (Object.keys(data).includes(weekNumber.toString()) === false) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-4xl font-bold">
          Week {weekNumber}
        </div>
        <div className="text-2xl font-bold">
          No data for this week
        </div>
      </div>
    );
  }

  const weekPlan = parseWeekPlan(data[weekNumber.toString() as keyof typeof data]);

  const keys = Object.keys(weekPlan);
  keys.push(keys.shift() as string);
  const SevenDaysPlan = keys.map((dayNumber) => {
    const dayPlan = weekPlan[dayNumber];
    const isRest = dayPlan.includes("lepo");
    const isSun = dayNumber === "0";
    const isMon = dayNumber === "1";

    return (
      <div className={clsx('flex flex-col items-center mx-2 my-4 border p-4',
        isRest && 'bg-success',
        isSun && 'bg-primary',
        isMon && 'bg-secondary')}>
        <div className="text-2xl font-bold">{getDayName(dayNumber)}</div>
        <div className="text-xl font-bold">
          {isRest && "LEPO"}
          {isMon && <WeightLiftingIcon />}
          {!isRest && !isMon && dayPlan}
        </div>
      </div>
    );
  });


  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl font-bold">
        Week {weekNumber}
      </div>
      <div className="flex justify-center items-center flex-wrap">
        {SevenDaysPlan}
      </div>
    </div>
  );
}

export default App;