import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";


// Calculate waterfall positions
function computeWaterfallData(rawData) {
  let runningTotal = 0;

  return rawData.map((entry) => {
    const { value, isTotal = false } = entry;

    let barBottom;
    let barTop;

    if (isTotal) {
      barBottom = 0;
      barTop = value;
    } else if (value >= 0) {
      barBottom = runningTotal;
      barTop = runningTotal + value;
    } else {
      barBottom = runningTotal + value;
      barTop = runningTotal;
    }


    if (!isTotal) {
      runningTotal += value;
    }


    return {
      name: entry.name,
      value,
      waterfallRange: [barBottom, barTop],
      isTotal,
    };
  });
}


// Data
const rawData = [
  {
    name: "Revenue",
    value: 420,
  },
  {
    name: "Services",
    value: 210,
  },
  {
    name: "Fixed costs",
    value: -170,
  },
  {
    name: "Variable costs",
    value: -120,
  },
  {
    name: "Taxes",
    value: -60,
  },
  {
    name: "Profit",
    value: 280,
    isTotal: true,
  },
];


const waterfallData = computeWaterfallData(rawData);


// Colors
function getBarColor(entry) {

  if (entry?.isTotal) {
    return "#082f49"; // sky-950
  }


  if (entry?.value >= 0) {
    return "#bae6fd"; // sky-200
  }


  return "#f0f9ff"; // sky-50
}


// Custom bar
const WaterfallBar = (props) => {

  const color = getBarColor(props.payload);


  return (
    <Rectangle
      {...props}
      fill={color}
      radius={[8, 8, 0, 0]}
    />
  );
};


// Tooltip
const WaterfallTooltip = ({ active, payload }) => {

  if (!active || !payload || !payload.length) {
    return null;
  }


  const entry = payload[0].payload;


  return (
    <div
      className="
        bg-white
        rounded-xl
        shadow-xl
        border
        border-gray-200
        px-4
        py-3
      "
    >

      <p className="font-bold text-sky-950">
        {entry.name}
      </p>


      <p className="text-gray-600">
        Value:
        {" "}
        {entry.value >= 0 ? "+" : ""}
        {entry.value}
      </p>


      {
        entry.isTotal && (
          <p className="text-sky-700 font-semibold italic">
            Total
          </p>
        )
      }

    </div>
  );
};



export default function WaterfallChart() {


  return (

    <ResponsiveContainer
      width="100%"
      height="100%"
    >

      <BarChart
        data={waterfallData}
        margin={{
          top: 20,
          right: 20,
          left: 10,
          bottom: 20,
        }}
      >


        <CartesianGrid
          stroke="#ffffff30"
          strokeDasharray="4 4"
          vertical={false}
        />


        <XAxis
          dataKey="name"
          tick={{
            fill: "#ffffff",
            fontWeight: 600,
            fontSize: 12,
          }}
          axisLine={{
            stroke: "#ffffff",
          }}
          tickLine={false}
        />


        <YAxis
          tick={{
            fill: "#ffffff",
            fontWeight: 600,
          }}
          axisLine={false}
          tickLine={false}
        />


        <Tooltip
          content={<WaterfallTooltip />}
        />


        <Bar
          dataKey={(item) => item.waterfallRange}
          shape={(props) => (
            <WaterfallBar {...props} />
          )}
          isAnimationActive={true}
        />


      </BarChart>

    </ResponsiveContainer>

  );
}