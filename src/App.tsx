import React, { useState } from "react";
import clsx from "clsx";

import { GiWeightLiftingUp } from "react-icons/gi";
import { FaRunning } from "react-icons/fa";

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

const BackAndForwardControls = ({ weekNumber, setWeekNumber }: { weekNumber: number; setWeekNumber: (weekNumber: number) => void }) => {
  return (
    <div className="flex flex-row justify-between">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setWeekNumber(weekNumber - 1);
        }}
      >
        Back
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setWeekNumber((weekNumber + 1) % 52 + 1);
        }}
      >
        Forward
      </button>
    </div>
  );
};

function App() {
  const [weekNumber, setWeekNumber] = useState(getWeekNumber(new Date())[1]);
  const isCurrentWeek = weekNumber === getWeekNumber(new Date())[1];

  // Check for week number overflow
  if (Object.keys(data).includes(weekNumber.toString()) === false) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-4xl font-bold">
          Week {weekNumber} {isCurrentWeek && <span className="text-sm">(Current week)</span>}
        </div>
        <div className="text-2xl font-bold">
          No data for this week
        </div>
        <BackAndForwardControls weekNumber={weekNumber} setWeekNumber={setWeekNumber} />
      </div>
    );
  }

  const weekPlan = parseWeekPlan(data[weekNumber.toString() as keyof typeof data]);

  const keys = Object.keys(weekPlan);
  keys.push(keys.shift() as string);
  const SevenDaysPlan = keys.map((dayNumber) => {
    const dayPlan = weekPlan[dayNumber];
    const isRest = dayPlan.includes("lepo");
    const isRun = dayPlan.includes("km");
    const isComp = dayPlan.includes("K");
    const isSun = dayNumber === "0";
    const isMon = dayNumber === "1";

    const isCurrentDay = dayNumber === new Date().getDay().toString();
    const currentDayHighlight = isCurrentDay ? "bg-warning" : "";

    const dayStyle = clsx(
      "flex justify-between items-center mx-2 my-4 border p-4 rounded-lg w-48 h-30",
      {
        "bg-success": isRest,
        "bg-primary": isSun,
        "bg-secondary": isMon,
        [currentDayHighlight]: isCurrentDay,
        "border-success": isCurrentDay,
        "border-4": isCurrentDay,
      }
    );

    return (
      <div className={dayStyle}>
        <div className="text-2xl font-bold">{getDayName(dayNumber)}</div>
        <div className="flex flex-col text-xl">
          <div className="text-center inline-block">
            {isRest && "LEPO"}
            {isMon && <GiWeightLiftingUp size={32} />}
            {isRun && <FaRunning className="inline" size={32} />}
            {isComp && <FaRunning className="inline" size={32} />}
          </div>
          <div>{!isRest && !isMon && dayPlan}</div>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl font-bold my-5 uppercase">
        Week {weekNumber} {isCurrentWeek && <span className="text-sm">(Current week)</span>}
      </div>
      <div className="flex items-center flex-col md:flex-row">
        <div>
          <div className="flex flex-col justify-center items-center flex-wrap">
            {SevenDaysPlan}
          </div>
        </div>
        <BackAndForwardControls weekNumber={weekNumber} setWeekNumber={setWeekNumber} />
        <div className="bg-secondary ml-2 p-4">
          <p className="text-center mb-2 text-md font-bold">LEGEND</p>
          <p>
            Pa = Palauttava harjoitus<br />
            Pe = Peruskuntoharjoitus<br />
            M = Mäkinen harjoitus<br />
            T = Tempoharjoitus<br />
            K = Kilpailuvauhtinen harjoitus<br />
            IV = Intervalliharjoitus<br />
            Ve = Vaihtoehtoinen harjoittelu (4h:n ohjelmassa)<br />
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;